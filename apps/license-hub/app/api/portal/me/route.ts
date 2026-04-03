import { NextResponse } from "next/server";

import { getLicenseHubDb } from "@mindforge/db";

import { getSessionFromCookies } from "../../../../lib/session";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const db = await getLicenseHubDb();
  const customer = await db.getCustomerByEmail(session.email);

  return NextResponse.json({
    ok: true,
    email: session.email,
    customer: customer
      ? {
          id: customer.id,
          email: customer.email,
          name: customer.name,
        }
      : null,
  });
}
