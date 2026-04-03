import Link from "next/link";

import { requireAdminSession } from "../../lib/adminAuth";

export default async function AdminPage() {
  const session = await requireAdminSession();

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: 32, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <h1>License Hub Admin</h1>
      <p>Signed in as {session.email}</p>
      <div style={{ display: "grid", gap: 12 }}>
        <Link href="/admin/licenses">Licenses</Link>
        <Link href="/admin/orders">Orders</Link>
        <Link href="/admin/customers">Customers</Link>
        <Link href="/portal">Customer portal</Link>
      </div>
    </main>
  );
}
