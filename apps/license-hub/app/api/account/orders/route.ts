import { NextResponse } from "next/server";

import { AccountAuthError, requireAccountApiContext } from "../../../../lib/account";

export async function GET() {
  try {
    const { session, db } = await requireAccountApiContext();
    const orders = await db.listOrdersByCustomerEmail(session.email);

    return NextResponse.json({
      ok: true,
      items: orders.map((order) => ({
        id: order.id,
        external_order_id: order.externalOrderId,
        status: order.status,
        edition: order.edition,
        payment_provider: order.paymentProvider,
        external_payment_id: order.externalPaymentId,
        external_subscription_id: order.externalSubscriptionId,
        amount_cents: order.amountCents,
        currency: order.currency,
        status_reason: order.statusReason,
        created_at: order.createdAt,
      })),
    });
  } catch (error) {
    if (error instanceof AccountAuthError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
