import { NextRequest, NextResponse } from "next/server";

import { createPaddleCheckout } from "../../../../lib/paddleCheckout";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as {
      buyerEmail?: string;
      priceId?: string;
      priceKey?: string;
    };

    const result = await createPaddleCheckout({
      buyerEmail: payload.buyerEmail || "",
      priceId: payload.priceId,
      priceKey: payload.priceKey,
    });

    return NextResponse.json({
      ok: true,
      checkout: {
        transaction_id: result.transactionId,
        transaction_status: result.transactionStatus,
        order_id: result.orderId,
        success_url: result.successUrl,
        cancel_url: result.cancelUrl,
      },
      price: {
        key: result.price.key,
        price_id: result.price.priceId,
        edition: result.price.edition,
        interval: result.price.interval,
        label: result.price.label,
      },
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
