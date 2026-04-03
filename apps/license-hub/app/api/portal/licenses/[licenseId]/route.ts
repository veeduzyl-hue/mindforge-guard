import { NextRequest, NextResponse } from "next/server";

import { getLicenseHubDb } from "@mindforge/db";

import { getSessionFromCookies } from "../../../../../lib/session";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ licenseId: string }> }
) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { licenseId } = await context.params;
  const db = await getLicenseHubDb();
  const license = await db.getLicenseByLicenseIdForEmail(licenseId, session.email);

  if (!license) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    item: {
      license_id: license.licenseId,
      edition: license.edition,
      issued_at: license.issuedAt,
      not_before: license.notBefore,
      not_after: license.notAfter,
      status: license.status,
      key_id: license.keyId,
      subject_email: license.subjectEmail,
    },
  });
}
