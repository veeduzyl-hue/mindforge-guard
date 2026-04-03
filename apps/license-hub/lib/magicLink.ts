import crypto from "node:crypto";

import { getLicenseHubDb, type MagicLinkPurpose } from "@mindforge/db";

import { sendMagicLinkEmail } from "./mailer";
import { setSessionCookie } from "./session";

const DEFAULT_MAGIC_LINK_TTL_MINUTES = 30;

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

function generateRawToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

function buildBaseUrl(): string {
  return (
    process.env.LICENSE_HUB_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

function buildMagicLink(rawToken: string): string {
  return `${buildBaseUrl()}/api/auth/verify-magic-link?token=${encodeURIComponent(rawToken)}`;
}

export async function requestMagicLink(input: {
  email: string;
  purpose?: MagicLinkPurpose;
}) {
  const email = String(input.email || "").trim().toLowerCase();
  if (!email) {
    throw new Error("email is required");
  }

  const rawToken = generateRawToken();
  const tokenHash = sha256(rawToken);
  const db = await getLicenseHubDb();
  const customer = await db.getCustomerByEmail(email);
  const expiresAt = new Date(
    Date.now() + DEFAULT_MAGIC_LINK_TTL_MINUTES * 60 * 1000
  ).toISOString();

  await db.createMagicLinkToken({
    email,
    tokenHash,
    purpose: input.purpose || "portal_access",
    expiresAt,
    customerId: customer?.id ?? null,
  });

  const magicLink = buildMagicLink(rawToken);
  const delivery = await sendMagicLinkEmail(email, magicLink);

  return {
    ok: true,
    email,
    expiresAt,
    delivery,
  };
}

export async function consumeMagicLink(rawToken: string) {
  const db = await getLicenseHubDb();
  const tokenHash = sha256(rawToken);
  const record = await db.getMagicLinkTokenByHash(tokenHash);

  if (!record) {
    return {
      ok: false,
      reason: "token_not_found",
    };
  }

  if (record.consumedAt) {
    return {
      ok: false,
      reason: "token_already_used",
    };
  }

  if (Date.parse(record.expiresAt) < Date.now()) {
    return {
      ok: false,
      reason: "token_expired",
    };
  }

  await db.consumeMagicLinkToken(record.id);
  await setSessionCookie(record.email);

  return {
    ok: true,
    email: record.email,
  };
}
