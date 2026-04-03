import Link from "next/link";

import { requireAdminContext } from "../../../lib/adminAuth";

export default async function AdminOrdersPage() {
  const { session, db } = await requireAdminContext();
  const [orders, customers] = await Promise.all([db.listOrders(), db.listCustomers()]);
  const customerById = new Map(customers.map((customer) => [customer.id, customer]));

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 32, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <h1>Admin Orders</h1>
      <p>Signed in as {session.email}</p>
      <p>
        <Link href="/admin">Back to admin</Link>
      </p>

      {orders.length === 0 ? <p>No orders found.</p> : null}

      <div style={{ display: "grid", gap: 12 }}>
        {orders.map((order) => (
          <article key={order.id} style={{ border: "1px solid #d1cab8", borderRadius: 12, padding: 16 }}>
            <h2 style={{ marginTop: 0 }}>{order.externalOrderId}</h2>
            <p>Status: {order.status}</p>
            <p>Edition: {order.edition}</p>
            <p>Customer: {customerById.get(order.customerId)?.email || order.customerId}</p>
            <p>Provider: {order.paymentProvider}</p>
            <p>Paid at: {order.paidAt || "n/a"}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
