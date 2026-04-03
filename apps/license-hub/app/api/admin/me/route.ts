import { NextResponse } from "next/server";

import { AdminAuthError, getAdminEmailAllowlist, requireAdminApiSession } from "../../../../lib/adminAuth";

export async function GET() {
  try {
    const session = await requireAdminApiSession();
    return NextResponse.json({
      ok: true,
      email: session.email,
      isAdmin: true,
      adminAllowlistSize: getAdminEmailAllowlist().length,
    });
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
