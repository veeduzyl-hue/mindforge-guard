import Link from "next/link";

import { requireAdminContext } from "../../../lib/adminAuth";

export default async function AdminCustomersPage() {
  const { session, db } = await requireAdminContext();
  const [customers, orders, licenses] = await Promise.all([db.listCustomers(), db.listOrders(), db.listLicenses()]);
  const orderCountByCustomerId = new Map<string, number>();
  const licenseCountByCustomerId = new Map<string, number>();

  for (const order of orders) {
    orderCountByCustomerId.set(order.customerId, (orderCountByCustomerId.get(order.customerId) || 0) + 1);
  }

  for (const license of licenses) {
    licenseCountByCustomerId.set(license.customerId, (licenseCountByCustomerId.get(license.customerId) || 0) + 1);
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 32, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <h1>Admin Customers</h1>
      <p>Signed in as {session.email}</p>
      <p>
        <Link href="/admin">Back to admin</Link>
      </p>

      {customers.length === 0 ? <p>No customers found.</p> : null}

      <div style={{ display: "grid", gap: 12 }}>
        {customers.map((customer) => (
          <article key={customer.id} style={{ border: "1px solid #d1cab8", borderRadius: 12, padding: 16 }}>
            <h2 style={{ marginTop: 0 }}>{customer.email}</h2>
            <p>Name: {customer.name || "n/a"}</p>
            <p>External customer id: {customer.externalCustomerId || "n/a"}</p>
            <p>Orders: {orderCountByCustomerId.get(customer.id) || 0}</p>
            <p>Licenses: {licenseCountByCustomerId.get(customer.id) || 0}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
