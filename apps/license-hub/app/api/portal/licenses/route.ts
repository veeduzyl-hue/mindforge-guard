import { NextResponse } from "next/server";

import { getLicenseHubDb } from "@mindforge/db";

import { getSessionFromCookies } from "../../../../lib/session";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const db = await getLicenseHubDb();
  const licenses = await db.listLicensesByCustomerEmail(session.email);

  return NextResponse.json({
    ok: true,
    items: licenses.map((license) => ({
      license_id: license.licenseId,
      edition: license.edition,
      issued_at: license.issuedAt,
      not_before: license.notBefore,
      not_after: license.notAfter,
      status: license.status,
      key_id: license.keyId,
    })),
  });
}
