import { NextRequest, NextResponse } from "next/server";

import { handleBillingWebhook } from "../../../../lib/billingWebhook";

type StagedError = Error & {
  stage?: string;
  reason?: string;
};

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
    const normalized = (error instanceof Error ? error : new Error(String(error))) as StagedError;
    console.error(
      JSON.stringify({
        webhook_billing_error: true,
        stage: normalized.stage || "unknown",
        reason: normalized.reason || null,
        error_message: normalized.message,
        error_stack: normalized.stack || null,
      })
    );
    return NextResponse.json(
      {
        ok: false,
        error: normalized.message,
      },
      { status: 400 }
    );
  }
}
