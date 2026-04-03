import { NextResponse } from "next/server";

import { getLicenseHubDb } from "@mindforge/db";

import { AdminAuthError, requireAdminApiSession } from "../../../../lib/adminAuth";

export async function GET() {
  try {
    await requireAdminApiSession();
    const db = await getLicenseHubDb();
    const [customers, orders, licenses] = await Promise.all([db.listCustomers(), db.listOrders(), db.listLicenses()]);
    const orderCountByCustomerId = new Map<string, number>();
    const licenseCountByCustomerId = new Map<string, number>();

    for (const order of orders) {
      orderCountByCustomerId.set(order.customerId, (orderCountByCustomerId.get(order.customerId) || 0) + 1);
    }

    for (const license of licenses) {
      licenseCountByCustomerId.set(license.customerId, (licenseCountByCustomerId.get(license.customerId) || 0) + 1);
    }

    return NextResponse.json({
      ok: true,
      items: customers.map((customer) => ({
        id: customer.id,
        email: customer.email,
        name: customer.name,
        external_customer_id: customer.externalCustomerId,
        order_count: orderCountByCustomerId.get(customer.id) || 0,
        license_count: licenseCountByCustomerId.get(customer.id) || 0,
        created_at: customer.createdAt,
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
