import { NextResponse } from "next/server";

import { AccountAuthError, requireAccountApiContext } from "../../../../lib/account";
import { buildSeatOverview } from "../../../../lib/seats";

export async function GET() {
  try {
    const { session, organization, db } = await requireAccountApiContext();
    const overview = await buildSeatOverview(db, organization, session.email);

    return NextResponse.json({
      ok: true,
      organization: overview.organization,
      members: overview.members,
      entitlements: overview.entitlements.map((entitlement) => ({
        id: entitlement.id,
        edition: entitlement.edition,
        seat_count: entitlement.seatCount,
        active_assignments: entitlement.activeAssignments,
        license_id: entitlement.license?.licenseId || null,
      })),
      assignments: overview.assignments.map((assignment) => ({
        id: assignment.id,
        email: assignment.email,
        status: assignment.status,
        license_id: assignment.license?.licenseId || null,
      })),
      notes: overview.notes,
    });
  } catch (error) {
    if (error instanceof AccountAuthError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
