import crypto from "node:crypto";

import { cookies } from "next/headers";

import { isProductionEnv } from "./env";

const SESSION_COOKIE_NAME = "mf_license_hub_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export interface PortalSession {
  email: string;
  exp: number;
}

function base64urlEncode(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

function base64urlDecode(input: string): string {
  return Buffer.from(input, "base64url").toString("utf8");
}

function getSessionSecret(): string {
  const configured = process.env.LICENSE_HUB_SESSION_SECRET;
  if (configured) {
    return configured;
  }

  if (isProductionEnv()) {
    throw new Error("production requires LICENSE_HUB_SESSION_SECRET");
  }

  return "mindforge-license-hub-dev-secret";
}

function sign(value: string): string {
  return crypto.createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

export function createSessionToken(email: string): string {
  const payload: PortalSession = {
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encodedPayload = base64urlEncode(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function verifySessionToken(token: string | undefined): PortalSession | null {
  if (!token) return null;
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;
  if (sign(encodedPayload) !== signature) return null;

  try {
    const payload = JSON.parse(base64urlDecode(encodedPayload)) as PortalSession;
    if (!payload.email || !payload.exp) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSessionFromCookies(): Promise<PortalSession | null> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export async function setSessionCookie(email: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, createSessionToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export { SESSION_COOKIE_NAME };
