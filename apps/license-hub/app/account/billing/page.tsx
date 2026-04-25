import Link from "next/link";

import { buildBillingSummaryForEmail, requireAccountContext } from "../../../lib/account";

export default async function AccountBillingPage() {
  const { session, db } = await requireAccountContext();
  const summary = await buildBillingSummaryForEmail(db, session.email);

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 32, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <h1>Billing</h1>
      <p>
        <Link href="/account">Back to account</Link>
      </p>
      <p>Latest payment status: {summary.latestPaymentStatus}</p>
      <p>Fulfillment state: {summary.fulfillmentState}</p>
      <p>Latest paid order: {summary.latestPaidOrder?.externalOrderId || "none"}</p>
      <p>Order count: {summary.orderCount}</p>
      <p>License count: {summary.licenseCount}</p>
      <p>Renewal hint: {summary.renewalHint}</p>
      <p style={{ color: "#6a604b" }}>
        Billing visibility is provided for account review and signed license delivery context.
      </p>
    </main>
  );
}
