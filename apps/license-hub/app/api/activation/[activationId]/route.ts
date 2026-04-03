import { NextResponse } from "next/server";

import { AccountAuthError, requireAccountApiContext } from "../../../../lib/account";
import { ACTIVATION_SKELETON_NOTE } from "../../../../lib/activation";

export async function GET(_request: Request, context: { params: Promise<{ activationId: string }> }) {
  try {
    const { session, db } = await requireAccountApiContext();
    const { activationId } = await context.params;

    const activation = await db.getActivationRecordByActivationId(activationId);
    if (!activation || activation.requestedByEmail !== session.email) {
      return NextResponse.json({ ok: false, error: "activation not found" }, { status: 404 });
    }

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
