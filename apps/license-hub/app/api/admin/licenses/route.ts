import { NextResponse } from "next/server";

import { AdminAuthError, requireAdminApiSession } from "../../../../lib/adminAuth";
import { getLicenseHubDb } from "@mindforge/db";

export async function GET() {
  try {
    await requireAdminApiSession();
    const db = await getLicenseHubDb();
    const [licenses, customers, orders] = await Promise.all([db.listLicenses(), db.listCustomers(), db.listOrders()]);
    const customerById = new Map(customers.map((customer) => [customer.id, customer]));
    const orderById = new Map(orders.map((order) => [order.id, order]));

    return NextResponse.json({
      ok: true,
      items: licenses.map((license) => ({
        license_id: license.licenseId,
        edition: license.edition,
        status: license.status,
        issued_at: license.issuedAt,
        not_before: license.notBefore,
        not_after: license.notAfter,
        revoked_at: license.revokedAt,
        revoke_reason: license.revokeReason,
        key_id: license.keyId,
        customer_email: customerById.get(license.customerId)?.email || license.subjectEmail,
        external_order_id: orderById.get(license.orderId)?.externalOrderId || null,
        supersedes_license_record_id: license.supersedesLicenseId,
      })),
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
