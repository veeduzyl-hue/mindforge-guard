import { NextRequest, NextResponse } from "next/server";

import { getLicenseHubDb } from "@mindforge/db";

import { revokeLicenseByAdmin } from "../../../../../../lib/adminActions";
import { AdminAuthError, requireAdminApiSession } from "../../../../../../lib/adminAuth";

async function readBody(request: NextRequest): Promise<Record<string, FormDataEntryValue | unknown>> {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await request.json()) as Record<string, unknown>;
  }
  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    return Object.fromEntries(form.entries());
  }
  return {};
}

function respond(request: NextRequest, body: Record<string, unknown>, payload: object) {
  if (typeof body.redirectTo === "string" && body.redirectTo.startsWith("/")) {
    return NextResponse.redirect(new URL(body.redirectTo, request.url), 303);
  }

  return NextResponse.json(payload);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ licenseId: string }> }
) {
  try {
    const session = await requireAdminApiSession();
    const { licenseId } = await params;
    const body = await readBody(request);
    const db = await getLicenseHubDb();
    const result = await revokeLicenseByAdmin({
      db,
      actorEmail: session.email,
      licenseId,
      reason: typeof body.reason === "string" ? body.reason : undefined,
      notifyCustomer: body.notifyCustomer as string | undefined,
    });

    return respond(request, body, {
      ok: true,
      licenseId: result.license.licenseId,
      status: result.license.status,
      revokedAt: result.license.revokedAt,
      actionId: result.action.id,
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
      { status: 400 }
    );
  }
}
