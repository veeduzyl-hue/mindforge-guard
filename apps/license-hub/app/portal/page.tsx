import Link from "next/link";

import { requirePortalCustomer } from "../../lib/auth";

export default async function PortalPage() {
  const { session, customer } = await requirePortalCustomer();

  return (
    <main style={{ maxWidth: 840, margin: "0 auto", padding: 32, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <h1>Customer Portal</h1>
      <p>Signed in as {session.email}</p>
      <p>{customer ? "Your account is ready." : "No account profile is available for this email yet."}</p>
      <p>
        <Link href="/portal/licenses">View licenses</Link>
      </p>
      <p>
        <Link href="/account">Open account</Link>
      </p>
      <form action="/api/auth/logout" method="post">
        <button type="submit">Logout</button>
      </form>
    </main>
  );
}
