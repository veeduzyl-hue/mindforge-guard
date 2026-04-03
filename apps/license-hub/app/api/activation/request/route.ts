import { NextResponse } from "next/server";

import { AccountAuthError, requireAccountApiContext } from "../../../../lib/account";
import { ACTIVATION_SKELETON_NOTE, createActivationSkeletonRequest } from "../../../../lib/activation";

export async function POST(request: Request) {
  try {
    const { session, customer, organization, db } = await requireAccountApiContext();
    const body = (await request.json()) as {
      licenseId?: string;
      deviceFingerprint?: string;
      machineName?: string | null;
    };

    if (!body.licenseId || !body.deviceFingerprint) {
      return NextResponse.json({ ok: false, error: "licenseId and deviceFingerprint are required" }, { status: 400 });
    }

    const license = await db.getLicenseByLicenseIdForEmail(body.licenseId, session.email);
    if (!license) {
      return NextResponse.json({ ok: false, error: "license not found" }, { status: 404 });
    }

    const activation = await createActivationSkeletonRequest({
      db,
      license,
      organization,
      customerId: customer?.id ?? null,
      requestedByEmail: session.email,
      deviceFingerprint: body.deviceFingerprint,
      machineName: body.machineName ?? null,
    });

    return NextResponse.json({
      ok: true,
      mode: "optional_skeleton",
      offline_license_install_remains_authoritative: true,
      note: ACTIVATION_SKELETON_NOTE,
      activation: {
        activation_id: activation.activationId,
        status: activation.status,
        requested_at: activation.requestedAt,
      },
    });
  } catch (error) {
    if (error instanceof AccountAuthError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
