import { NextResponse } from "next/server";

import { getLicenseHubDb } from "@mindforge/db";

import { AdminAuthError, requireAdminApiSession } from "../../../../lib/adminAuth";

export async function GET() {
  try {
    await requireAdminApiSession();
    const db = await getLicenseHubDb();
    const [orders, customers] = await Promise.all([db.listOrders(), db.listCustomers()]);
    const customerById = new Map(customers.map((customer) => [customer.id, customer]));

    return NextResponse.json({
      ok: true,
      items: orders.map((order) => ({
        id: order.id,
        external_order_id: order.externalOrderId,
        payment_provider: order.paymentProvider,
        status: order.status,
        edition: order.edition,
        amount_cents: order.amountCents,
        currency: order.currency,
        paid_at: order.paidAt,
        customer_email: customerById.get(order.customerId)?.email || null,
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
