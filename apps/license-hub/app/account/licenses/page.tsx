import Link from "next/link";

import { requireAccountContext } from "../../../lib/account";

export default async function AccountLicensesPage() {
  const { session, db } = await requireAccountContext();
  const licenses = await db.listLicensesByCustomerEmail(session.email);

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 32, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <h1>Account Licenses</h1>
      <p>
        <Link href="/account">Back to account</Link>
      </p>
      {licenses.length === 0 ? <p>No licenses found for this email yet.</p> : null}
      <div style={{ display: "grid", gap: 12 }}>
        {licenses.map((license) => (
          <article key={license.id} style={{ padding: 16, border: "1px solid #d1cab8", borderRadius: 12 }}>
            <h2 style={{ marginTop: 0 }}>{license.licenseId}</h2>
            <p>Status: {license.status}</p>
            <p>Edition: {license.edition}</p>
            <p>Issued: {license.issuedAt}</p>
            <p>Valid: {license.notBefore} to {license.notAfter}</p>
            <p>Portal detail: <Link href={`/portal/licenses/${license.licenseId}`}>Open delivery detail</Link></p>
          </article>
        ))}
      </div>
    </main>
  );
}
