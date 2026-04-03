import fs from "node:fs";
import path from "node:path";

import { getMailProviderConfig, isProductionEnv, readBooleanEnv } from "./env";

export type MailMode = "provider" | "dev";

type ProviderDeliveryResult = {
  mode: "provider";
  delivered: true;
};

type DevDeliveryResult = {
  mode: "dev";
  delivered: true;
  debugPath: string;
  devMagicLink?: string;
};

export type MailDeliveryResult = ProviderDeliveryResult | DevDeliveryResult;

interface TextEmailInput {
  to: string;
  subject: string;
  text: string;
  debugType: string;
  debugPayload?: Record<string, unknown>;
}

function getDebugPath(): string {
  return (
    process.env.MAGIC_LINK_DEBUG_STORE_PATH ||
    path.join(process.cwd(), ".mindforge", "license-hub", "magic-links.jsonl")
  );
}

function resolveMailMode(): MailMode {
  const configuredMode = process.env.MAGIC_LINK_MAIL_MODE;

  if (configuredMode === "provider" || configuredMode === "dev") {
    return configuredMode;
  }

  if (isProductionEnv()) {
    throw new Error("production requires explicit MAGIC_LINK_MAIL_MODE=provider or dev");
  }

  return "dev";
}

function isDevMailAllowedInProduction(): boolean {
  return readBooleanEnv("ALLOW_DEV_MAGIC_LINK_IN_PRODUCTION", false);
}

function assertMailModeAllowed(mode: MailMode): void {
  if (mode !== "dev") {
    return;
  }

  if (isProductionEnv() && !isDevMailAllowedInProduction()) {
    throw new Error(
      "production dev mail mode is disabled; configure provider mail or explicitly set ALLOW_DEV_MAGIC_LINK_IN_PRODUCTION=true"
    );
  }
}

async function sendViaResend(input: TextEmailInput): Promise<void> {
  const { resendApiKey: apiKey, resendFromEmail: from } = getMailProviderConfig();
  if (!apiKey || !from) {
    throw new Error("provider mail mode requires RESEND_API_KEY and RESEND_FROM_EMAIL");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: input.subject,
      text: input.text,
    }),
  });

  if (!response.ok) {
    throw new Error(`resend send failed: ${response.status}`);
  }
}

function writeDebugEmail(input: TextEmailInput): DevDeliveryResult {
  const debugPath = getDebugPath();
  fs.mkdirSync(path.dirname(debugPath), { recursive: true });
  fs.appendFileSync(
    debugPath,
    JSON.stringify({
      created_at: new Date().toISOString(),
      type: input.debugType,
      to: input.to,
      subject: input.subject,
      text: input.text,
      ...input.debugPayload,
    }) + "\n",
    "utf8"
  );
  console.log(`[license-hub][dev-mail:${input.debugType}] ${input.to} -> ${input.subject}`);

  return {
    mode: "dev",
    delivered: true,
    debugPath,
  };
}

async function sendTextEmail(input: TextEmailInput): Promise<MailDeliveryResult> {
  const mode = resolveMailMode();
  assertMailModeAllowed(mode);

  if (mode === "provider") {
    await sendViaResend(input);
    return {
      mode: "provider",
      delivered: true,
    };
  }

  return writeDebugEmail(input);
}

export async function sendMagicLinkEmail(to: string, magicLink: string): Promise<MailDeliveryResult> {
  const delivery = await sendTextEmail({
    to,
    subject: "Your MindForge License Hub sign-in link",
    text: `Use this sign-in link: ${magicLink}`,
    debugType: "magic_link",
    debugPayload: {
      magic_link: magicLink,
    },
  });

  if (delivery.mode === "dev" && (!isProductionEnv() || isDevMailAllowedInProduction())) {
    return {
      ...delivery,
      devMagicLink: magicLink,
    };
  }

  return delivery;
}

export async function sendSignedLicenseEmail(input: {
  to: string;
  licenseId: string;
  signedLicenseJson: unknown;
  actionLabel?: string;
}): Promise<MailDeliveryResult> {
  return sendTextEmail({
    to: input.to,
    subject: `${input.actionLabel || "License delivery"} for ${input.licenseId}`,
    text: `Signed license JSON for ${input.licenseId}\n\n${JSON.stringify(input.signedLicenseJson, null, 2)}`,
    debugType: "signed_license",
    debugPayload: {
      license_id: input.licenseId,
      action: input.actionLabel || "license_delivery",
      signed_license_json: input.signedLicenseJson,
    },
  });
}

export async function sendLicenseStatusEmail(input: {
  to: string;
  subject: string;
  message: string;
  licenseId: string;
  actionLabel: string;
}): Promise<MailDeliveryResult> {
  return sendTextEmail({
    to: input.to,
    subject: input.subject,
    text: input.message,
    debugType: "license_status",
    debugPayload: {
      license_id: input.licenseId,
      action: input.actionLabel,
    },
  });
}
