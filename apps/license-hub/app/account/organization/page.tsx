import Link from "next/link";

import { requireAccountContext } from "../../../lib/account";

export default async function AccountOrganizationPage() {
  const { organization, db } = await requireAccountContext();
  const members = organization ? await db.listOrganizationMembers(organization.id) : [];

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 32, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <h1>Organization</h1>
      <p>
        <Link href="/account">Back to account</Link>
      </p>
      {organization ? (
        <>
          <p>Name: {organization.name}</p>
          <p>Slug: {organization.slug}</p>
          <p>Billing email: {organization.billingEmail || "n/a"}</p>
          <h2>Members</h2>
          <ul>
            {members.map((member) => (
              <li key={member.id}>
                {member.email} - {member.role} ({member.status})
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No organization is attached to this account yet.</p>
      )}
    </main>
  );
}
