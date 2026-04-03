import Link from "next/link";

import { requireAdminContext } from "../../../lib/adminAuth";

export default async function AdminLicensesPage() {
  const { session, db } = await requireAdminContext();
  const [licenses, customers, orders] = await Promise.all([db.listLicenses(), db.listCustomers(), db.listOrders()]);
  const customerById = new Map(customers.map((customer) => [customer.id, customer]));
  const orderById = new Map(orders.map((order) => [order.id, order]));

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 32, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <h1>Admin Licenses</h1>
      <p>Signed in as {session.email}</p>
      <p>
        <Link href="/admin">Back to admin</Link>
      </p>

      {licenses.length === 0 ? <p>No licenses found.</p> : null}

      <div style={{ display: "grid", gap: 12 }}>
        {licenses.map((license) => {
          const customer = customerById.get(license.customerId);
          const order = orderById.get(license.orderId);
          return (
            <article key={license.licenseId} style={{ border: "1px solid #d1cab8", borderRadius: 12, padding: 16 }}>
              <h2 style={{ marginTop: 0 }}>{license.licenseId}</h2>
              <p>Status: {license.status}</p>
              <p>Edition: {license.edition}</p>
              <p>Customer: {customer?.email || license.subjectEmail}</p>
              <p>Order: {order?.externalOrderId || license.orderId}</p>
              <p>Valid until: {license.notAfter}</p>
              <p>
                <Link href={`/admin/licenses/${license.licenseId}`}>Open admin detail</Link>
              </p>
            </article>
          );
        })}
      </div>
    </main>
  );
}
