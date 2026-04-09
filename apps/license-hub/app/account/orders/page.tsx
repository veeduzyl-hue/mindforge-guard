import Link from "next/link";

import { requireAccountContext } from "../../../lib/account";

export default async function AccountOrdersPage() {
  const { session, db } = await requireAccountContext();
  const orders = await db.listOrdersByCustomerEmail(session.email);

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 32, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <h1>Account Orders</h1>
      <p>
        <Link href="/account">Back to account</Link>
      </p>
      {orders.length === 0 ? <p>No billing orders found for this email yet.</p> : null}
      <div style={{ display: "grid", gap: 12 }}>
        {orders.map((order) => (
          <article key={order.id} style={{ padding: 16, border: "1px solid #d1cab8", borderRadius: 12 }}>
            <h2 style={{ marginTop: 0 }}>{order.externalOrderId}</h2>
            <p>Status: {order.status}</p>
            <p>Edition: {order.edition}</p>
            <p>Provider: {order.paymentProvider}</p>
            <p>Payment id: {order.externalPaymentId || "n/a"}</p>
            <p>Subscription id: {order.externalSubscriptionId || "n/a"}</p>
            <p>Status reason: {order.statusReason || "n/a"}</p>
            <p>Created: {order.createdAt}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
