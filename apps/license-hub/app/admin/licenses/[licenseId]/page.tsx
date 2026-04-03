import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAdminContext } from "../../../../lib/adminAuth";

export default async function AdminLicenseDetailPage({
  params,
}: {
  params: Promise<{ licenseId: string }>;
}) {
  const { licenseId } = await params;
  const { session, db } = await requireAdminContext();
  const license = await db.getLicenseByLicenseId(licenseId);

  if (!license) {
    notFound();
  }

  const [customer, order, actions] = await Promise.all([
    db.getCustomerById(license.customerId),
    db.getOrderById(license.orderId),
    db.listAdminActionsByLicenseId(license.id),
  ]);

  const redirectTo = `/admin/licenses/${license.licenseId}`;

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 32, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <h1>Admin License Detail</h1>
      <p>Signed in as {session.email}</p>
      <p>
        <Link href="/admin/licenses">Back to licenses</Link>
      </p>

      <section style={{ border: "1px solid #d1cab8", borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <h2 style={{ marginTop: 0 }}>{license.licenseId}</h2>
        <p>Status: {license.status}</p>
        <p>Edition: {license.edition}</p>
        <p>Customer: {customer?.email || license.subjectEmail}</p>
        <p>Order: {order?.externalOrderId || license.orderId}</p>
        <p>Issued: {license.issuedAt}</p>
        <p>Window: {license.notBefore} to {license.notAfter}</p>
        <p>Key: {license.keyId}</p>
        <p>Supersedes license record: {license.supersedesLicenseId || "none"}</p>
        <p>Revoked at: {license.revokedAt || "not revoked"}</p>
        <p>Revoke reason: {license.revokeReason || "n/a"}</p>
        <p>
          <Link href={`/api/admin/licenses/${license.licenseId}`}>View API payload</Link>
        </p>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        <form action={`/api/admin/licenses/${license.licenseId}/resend`} method="post" style={{ border: "1px solid #d1cab8", borderRadius: 12, padding: 16 }}>
          <h2 style={{ marginTop: 0 }}>Resend</h2>
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button type="submit">Resend signed license email</button>
        </form>

        <form action={`/api/admin/licenses/${license.licenseId}/revoke`} method="post" style={{ border: "1px solid #d1cab8", borderRadius: 12, padding: 16, display: "grid", gap: 8 }}>
          <h2 style={{ marginTop: 0 }}>Revoke</h2>
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <label>
            Reason
            <textarea name="reason" rows={3} style={{ width: "100%" }} />
          </label>
          <label>
            <input type="checkbox" name="notifyCustomer" /> Notify customer
          </label>
          <button type="submit">Revoke license</button>
        </form>

        <form action={`/api/admin/licenses/${license.licenseId}/extend`} method="post" style={{ border: "1px solid #d1cab8", borderRadius: 12, padding: 16, display: "grid", gap: 8 }}>
          <h2 style={{ marginTop: 0 }}>Extend</h2>
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <label>
            New not_after (ISO)
            <input type="text" name="notAfter" defaultValue={license.notAfter} style={{ width: "100%" }} />
          </label>
          <label>
            Reason
            <textarea name="reason" rows={3} style={{ width: "100%" }} />
          </label>
          <label>
            <input type="checkbox" name="notifyCustomer" /> Email replacement license
          </label>
          <button type="submit">Create extension replacement</button>
        </form>

        <form action={`/api/admin/licenses/${license.licenseId}/supersede`} method="post" style={{ border: "1px solid #d1cab8", borderRadius: 12, padding: 16, display: "grid", gap: 8 }}>
          <h2 style={{ marginTop: 0 }}>Supersede</h2>
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <label>
            New edition
            <input type="text" name="edition" defaultValue={license.edition} style={{ width: "100%" }} />
          </label>
          <label>
            New not_after (ISO)
            <input type="text" name="notAfter" defaultValue={license.notAfter} style={{ width: "100%" }} />
          </label>
          <label>
            Reason
            <textarea name="reason" rows={3} style={{ width: "100%" }} />
          </label>
          <label>
            <input type="checkbox" name="notifyCustomer" /> Email replacement license
          </label>
          <button type="submit">Supersede with replacement</button>
        </form>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Admin actions</h2>
        {actions.length === 0 ? <p>No admin actions recorded.</p> : null}
        <div style={{ display: "grid", gap: 12 }}>
          {actions.map((action) => (
            <article key={action.id} style={{ border: "1px solid #d1cab8", borderRadius: 12, padding: 16 }}>
              <p style={{ marginTop: 0, fontWeight: 700 }}>{action.actionType}</p>
              <p>Actor: {action.actorEmail}</p>
              <p>Created: {action.createdAt}</p>
              <pre style={{ whiteSpace: "pre-wrap", overflowX: "auto" }}>{JSON.stringify(action.payloadJson, null, 2)}</pre>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
