import { NextResponse } from "next/server";

import { AccountAuthError, requireAccountApiContext } from "../../../../lib/account";
import { ACTIVATION_SKELETON_NOTE } from "../../../../lib/activation";

export async function POST(request: Request) {
  try {
    const { session, db } = await requireAccountApiContext();
    const body = (await request.json()) as {
      activationId?: string;
    };

    if (!body.activationId) {
      return NextResponse.json({ ok: false, error: "activationId is required" }, { status: 400 });
    }

    const existing = await db.getActivationRecordByActivationId(body.activationId);
    if (!existing || existing.requestedByEmail !== session.email) {
      return NextResponse.json({ ok: false, error: "activation not found" }, { status: 404 });
    }

    const activation = await db.confirmActivationRecord(body.activationId);
    return NextResponse.json({
      ok: true,
      mode: "optional_skeleton",
      offline_license_install_remains_authoritative: true,
      note: ACTIVATION_SKELETON_NOTE,
      activation,
    });
  } catch (error) {
    if (error instanceof AccountAuthError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
