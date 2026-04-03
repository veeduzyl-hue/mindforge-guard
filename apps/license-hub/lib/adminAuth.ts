import { redirect } from "next/navigation";

import { getLicenseHubDb } from "@mindforge/db";

import { readCsvEnv } from "./env";
import { getSessionFromCookies, type PortalSession } from "./session";

export class AdminAuthError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "AdminAuthError";
  }
}

export function getAdminEmailAllowlist(): string[] {
  return readCsvEnv("LICENSE_HUB_ADMIN_EMAILS");
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) {
    return false;
  }

  return getAdminEmailAllowlist().includes(email.trim().toLowerCase());
}

export async function requireAdminSession(): Promise<PortalSession> {
  const session = await getSessionFromCookies();
  if (!session) {
    redirect("/login?error=admin_login_required");
  }

  if (!isAdminEmail(session.email)) {
    redirect("/portal?error=admin_forbidden");
  }

  return session;
}

export async function requireAdminApiSession(): Promise<PortalSession> {
  const session = await getSessionFromCookies();
  if (!session) {
    throw new AdminAuthError("unauthorized", 401);
  }

  if (!isAdminEmail(session.email)) {
    throw new AdminAuthError("forbidden", 403);
  }

  return session;
}

export async function requireAdminContext() {
  const session = await requireAdminSession();
  const db = await getLicenseHubDb();

  return {
    session,
    db,
  };
}
