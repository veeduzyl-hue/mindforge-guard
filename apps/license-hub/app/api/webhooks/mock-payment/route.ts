import { NextRequest, NextResponse } from "next/server";

import { handleMockPaymentEvent } from "../../../../lib/handleMockPaymentEvent";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    if (!payload?.id || !payload?.type) {
      return NextResponse.json(
        {
          ok: false,
          error: "invalid_payload",
        },
        { status: 400 }
      );
    }

    const result = await handleMockPaymentEvent(payload);
    return NextResponse.json(result, {
      status: result.ok ? 200 : 400,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
