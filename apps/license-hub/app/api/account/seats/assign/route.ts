import { NextResponse } from "next/server";

import { AccountAuthError, requireAccountApiContext } from "../../../../../lib/account";

export async function POST(request: Request) {
  try {
    const { session, customer, organization, db } = await requireAccountApiContext();
    const body = (await request.json()) as {
      licenseId?: string;
      email?: string;
    };

    if (!organization || !body.licenseId || !body.email) {
      return NextResponse.json({ ok: false, error: "organization, licenseId, and email are required" }, { status: 400 });
    }

    const assignment = await db.assignSeat({
      organizationId: organization.id,
      licenseId: body.licenseId,
      email: body.email,
      assignedByEmail: session.email,
      customerId: customer?.id ?? null,
    });

    return NextResponse.json({ ok: true, assignment });
  } catch (error) {
    if (error instanceof AccountAuthError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}
