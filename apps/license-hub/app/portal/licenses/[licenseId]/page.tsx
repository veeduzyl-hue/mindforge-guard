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
      <h1>License details</h1>
      <p>
        <Link href="/portal/licenses">Back to licenses</Link>
      </p>
      <dl>
        <dt>License ID</dt>
        <dd>{license.licenseId}</dd>
        <dt>Edition</dt>
        <dd>{license.edition}</dd>
        <dt>Issued on</dt>
        <dd>{license.issuedAt}</dd>
        <dt>Valid from</dt>
        <dd>{license.notBefore}</dd>
        <dt>Valid until</dt>
        <dd>{license.notAfter}</dd>
        <dt>Status</dt>
        <dd>{license.status}</dd>
        <dt>Key ID</dt>
        <dd>{license.keyId}</dd>
      </dl>
      <p>
        <a href={`/api/portal/licenses/${license.licenseId}/download`}>Download signed license JSON</a>
      </p>
    </main>
  );
}
