import { NextRequest, NextResponse } from "next/server";

import { requestMagicLink } from "../../../../lib/magicLink";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await requestMagicLink({
      email: body?.email,
      purpose: "portal_access",
    });

    return NextResponse.json({
      ok: true,
      email: result.email,
      expiresAt: result.expiresAt,
      mailMode: result.delivery.mode,
      ...(result.delivery.mode === "dev" && result.delivery.devMagicLink
        ? {
            devMagicLink: result.delivery.devMagicLink,
            debugPath: result.delivery.debugPath,
          }
        : {}),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 400 }
    );
  }
}
