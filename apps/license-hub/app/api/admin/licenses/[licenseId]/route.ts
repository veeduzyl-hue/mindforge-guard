import { NextRequest, NextResponse } from "next/server";

import { getLicenseHubDb } from "@mindforge/db";

import { AdminAuthError, requireAdminApiSession } from "../../../../../lib/adminAuth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ licenseId: string }> }
) {
  try {
    await requireAdminApiSession();
    const { licenseId } = await params;
    const db = await getLicenseHubDb();
    const license = await db.getLicenseByLicenseId(licenseId);

    if (!license) {
      return NextResponse.json({ ok: false, error: "license_not_found" }, { status: 404 });
    }

    const [customer, order, actions] = await Promise.all([
      db.getCustomerById(license.customerId),
      db.getOrderById(license.orderId),
      db.listAdminActionsByLicenseId(license.id),
    ]);

    return NextResponse.json({
      ok: true,
      item: {
        license_id: license.licenseId,
        schema_version: license.schemaVersion,
        edition: license.edition,
        status: license.status,
        subject_email: license.subjectEmail,
        issued_at: license.issuedAt,
        not_before: license.notBefore,
        not_after: license.notAfter,
        revoked_at: license.revokedAt,
        revoke_reason: license.revokeReason,
        key_id: license.keyId,
        customer,
        order,
        supersedes_license_record_id: license.supersedesLicenseId,
        superseded_at: license.supersededAt,
        payload_json: license.payloadJson,
        signed_license_json: license.signedLicenseJson,
        admin_actions: actions,
      },
    });
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
