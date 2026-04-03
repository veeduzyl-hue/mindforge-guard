import { NextResponse } from "next/server";

import { AccountAuthError, requireAccountApiContext } from "../../../../lib/account";

export async function GET() {
  try {
    const { organization, db } = await requireAccountApiContext();
    const members = organization ? await db.listOrganizationMembers(organization.id) : [];

    return NextResponse.json({
      ok: true,
      organization,
      members,
    });
  } catch (error) {
    if (error instanceof AccountAuthError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
