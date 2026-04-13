import { NextRequest, NextResponse } from "next/server";

import { handleBillingWebhook } from "../../../../lib/billingWebhook";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signatureHeader = request.headers.get("paddle-signature") || request.headers.get("Paddle-Signature");
    console.info(
      JSON.stringify({
        route_hit: true,
        signature_header: signatureHeader ? "present" : "missing",
        raw_body_length: rawBody.length,
      })
    );
    const result = await handleBillingWebhook(rawBody, request.headers);

    return NextResponse.json(result);
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
