import { redirect } from "next/navigation";

import { getLicenseHubDb } from "@mindforge/db";

import { getSessionFromCookies } from "./session";

export async function requirePortalSession() {
  const session = await getSessionFromCookies();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function requirePortalCustomer() {
  const session = await requirePortalSession();
  const db = await getLicenseHubDb();
  const customer = await db.getCustomerByEmail(session.email);
  return {
    session,
    customer,
    db,
  };
}
