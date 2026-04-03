import Link from "next/link";

import { requireAccountContext } from "../../../lib/account";
import { buildSeatOverview } from "../../../lib/seats";

export default async function AccountSeatsPage() {
  const { session, organization, db } = await requireAccountContext();
  const overview = await buildSeatOverview(db, organization, session.email);

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 32, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <h1>Seat Assignments</h1>
      <p>
        <Link href="/account">Back to account</Link>
      </p>
      {overview.notes.map((note) => (
        <p key={note} style={{ color: "#6a604b" }}>{note}</p>
      ))}
      <h2>Entitlements</h2>
      {overview.entitlements.length === 0 ? <p>No seat entitlements have been scaffolded yet.</p> : null}
      <ul>
        {overview.entitlements.map((entitlement) => (
          <li key={entitlement.id}>
            License {entitlement.license?.licenseId || entitlement.licenseId} - seats {entitlement.activeAssignments}/{entitlement.seatCount}
          </li>
        ))}
      </ul>
      <h2>Assignments</h2>
      {overview.assignments.length === 0 ? <p>No seat assignments yet.</p> : null}
      <ul>
        {overview.assignments.map((assignment) => (
          <li key={assignment.id}>
            {assignment.email} - {assignment.status} - {assignment.license?.licenseId || "unknown license"}
          </li>
        ))}
      </ul>
    </main>
  );
}
