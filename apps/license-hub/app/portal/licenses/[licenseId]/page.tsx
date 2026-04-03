import Link from "next/link";
import { notFound } from "next/navigation";

import { requirePortalCustomer } from "../../../../lib/auth";

export default async function PortalLicenseDetailPage({
  params,
}: {
  params: Promise<{ licenseId: string }>;
}) {
  const { session, db } = await requirePortalCustomer();
  const { licenseId } = await params;
  const license = await db.getLicenseByLicenseIdForEmail(licenseId, session.email);

  if (!license) {
    notFound();
  }

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 32, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <h1>License Detail</h1>
      <p>
        <Link href="/portal/licenses">Back to licenses</Link>
      </p>
      <dl>
        <dt>license_id</dt>
        <dd>{license.licenseId}</dd>
        <dt>edition</dt>
        <dd>{license.edition}</dd>
        <dt>issued_at</dt>
        <dd>{license.issuedAt}</dd>
        <dt>not_before</dt>
        <dd>{license.notBefore}</dd>
        <dt>not_after</dt>
        <dd>{license.notAfter}</dd>
        <dt>status</dt>
        <dd>{license.status}</dd>
        <dt>key_id</dt>
        <dd>{license.keyId}</dd>
      </dl>
      <p>
        <a href={`/api/portal/licenses/${license.licenseId}/download`}>Download signed license JSON</a>
      </p>
    </main>
  );
}
