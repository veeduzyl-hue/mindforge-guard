import Link from "next/link";

import { requirePortalCustomer } from "../../../lib/auth";

export default async function PortalLicensesPage() {
  const { session, db } = await requirePortalCustomer();
  const licenses = await db.listLicensesByCustomerEmail(session.email);

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 32, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <h1>Your Licenses</h1>
      <p>Signed in as {session.email}</p>
      <p>
        <Link href="/portal">Back to License Hub</Link>
      </p>

      {licenses.length === 0 ? <p>No licenses found for this email yet.</p> : null}

      <div style={{ display: "grid", gap: 12 }}>
        {licenses.map((license) => (
          <article key={license.licenseId} style={{ padding: 16, border: "1px solid #d1cab8", borderRadius: 12 }}>
            <h2 style={{ marginTop: 0 }}>{license.licenseId}</h2>
            <p>Edition: {license.edition}</p>
            <p>Status: {license.status}</p>
            <p>Issued on: {license.issuedAt}</p>
            <p>Valid: {license.notBefore} to {license.notAfter}</p>
            <p>Key ID: {license.keyId}</p>
            <p>
              <Link href={`/portal/licenses/${license.licenseId}`}>View details</Link>
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
