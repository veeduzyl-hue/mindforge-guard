import fs from "node:fs";
import path from "node:path";

type MailDeliveryResult =
  | {
      mode: "provider";
      delivered: true;
    }
  | {
      mode: "dev";
      delivered: true;
      devMagicLink: string;
      debugPath: string;
    };

function getMailerMode(): "provider" | "dev" {
  return process.env.MAGIC_LINK_MAIL_MODE === "provider" ? "provider" : "dev";
}

function getDebugPath(): string {
  return (
    process.env.MAGIC_LINK_DEBUG_STORE_PATH ||
    path.join(process.cwd(), ".mindforge", "license-hub", "magic-links.jsonl")
  );
}

async function sendViaResend(to: string, magicLink: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
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
      to: [to],
      subject: "Your MindForge License Hub sign-in link",
      text: `Use this sign-in link: ${magicLink}`,
    }),
  });

  if (!response.ok) {
    throw new Error(`resend send failed: ${response.status}`);
  }
}

export async function sendMagicLinkEmail(to: string, magicLink: string): Promise<MailDeliveryResult> {
  if (getMailerMode() === "provider") {
    await sendViaResend(to, magicLink);
    return {
      mode: "provider",
      delivered: true,
    };
  }

  const debugPath = getDebugPath();
  fs.mkdirSync(path.dirname(debugPath), { recursive: true });
  fs.appendFileSync(
    debugPath,
    JSON.stringify({
      created_at: new Date().toISOString(),
      to,
      magic_link: magicLink,
    }) + "\n",
    "utf8"
  );
  console.log(`[license-hub][dev-magic-link] ${to} -> ${magicLink}`);

  return {
    mode: "dev",
    delivered: true,
    devMagicLink: magicLink,
    debugPath,
  };
}
