import { NextResponse } from "next/server";

import { AccountAuthError, requireAccountApiContext } from "../../../../lib/account";

export async function GET() {
  try {
    const { session, db } = await requireAccountApiContext();
    const licenses = await db.listLicensesByCustomerEmail(session.email);

    return NextResponse.json({
      ok: true,
      items: licenses.map((license) => ({
        license_id: license.licenseId,
        edition: license.edition,
        status: license.status,
        issued_at: license.issuedAt,
        not_before: license.notBefore,
        not_after: license.notAfter,
        key_id: license.keyId,
      })),
    });
  } catch (error) {
    if (error instanceof AccountAuthError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
