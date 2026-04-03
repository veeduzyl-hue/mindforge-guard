import { NextRequest, NextResponse } from "next/server";

import { handleBillingWebhook } from "../../../../lib/billingWebhook";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const result = await handleBillingWebhook(rawBody, request.headers);

    return NextResponse.json({
      ok: true,
      ...result,
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
