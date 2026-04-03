import Link from "next/link";

import { requirePortalCustomer } from "../../lib/auth";

export default async function PortalPage() {
  const { session, customer } = await requirePortalCustomer();

  return (
    <main style={{ maxWidth: 840, margin: "0 auto", padding: 32, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <h1>Customer Portal</h1>
      <p>Signed in as {session.email}</p>
      <p>{customer ? `Customer record: ${customer.id}` : "No customer record found yet for this email."}</p>
      <p>
        <Link href="/portal/licenses">View licenses</Link>
      </p>
      <p>
        <Link href="/account">Open account surface</Link>
      </p>
      <form action="/api/auth/logout" method="post">
        <button type="submit">Logout</button>
      </form>
    </main>
  );
}
