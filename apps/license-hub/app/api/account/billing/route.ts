import { NextResponse } from "next/server";

import { AccountAuthError, buildBillingSummaryForEmail, requireAccountApiContext } from "../../../../lib/account";

export async function GET() {
  try {
    const { session, db } = await requireAccountApiContext();
    const summary = await buildBillingSummaryForEmail(db, session.email);

    return NextResponse.json({
      ok: true,
      summary: {
        order_count: summary.orderCount,
        license_count: summary.licenseCount,
        active_license_count: summary.activeLicenseCount,
        latest_payment_status: summary.latestPaymentStatus,
        fulfillment_state: summary.fulfillmentState,
        renewal_hint: summary.renewalHint,
        latest_order: summary.latestOrder
          ? {
              external_order_id: summary.latestOrder.externalOrderId,
              status: summary.latestOrder.status,
              status_reason: summary.latestOrder.statusReason,
              created_at: summary.latestOrder.createdAt,
            }
          : null,
      },
    });
  } catch (error) {
    if (error instanceof AccountAuthError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
