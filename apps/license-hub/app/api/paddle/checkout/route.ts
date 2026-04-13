import { NextRequest, NextResponse } from "next/server";

import { createPaddleCheckout } from "../../../../lib/paddleCheckout";
import { PaddleApiError } from "../../../../lib/paddleApi";

type CheckoutRequestPayload = {
  buyerEmail?: string;
  priceId?: string;
  priceKey?: string;
};

type CheckoutErrorBody = {
  ok: false;
  error: string;
  code: string;
};

class CheckoutRequestError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "CheckoutRequestError";
    this.status = status;
    this.code = code;
  }
}

function jsonError(status: number, code: string, message: string) {
  return NextResponse.json<CheckoutErrorBody>(
    {
      ok: false,
      error: message,
      code,
    },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

async function readCheckoutPayload(request: NextRequest): Promise<CheckoutRequestPayload> {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new CheckoutRequestError(415, "invalid_content_type", "checkout requests must use application/json");
  }

  const rawBody = await request.text();
  if (!rawBody.trim()) {
    throw new CheckoutRequestError(400, "empty_request_body", "checkout request body is required");
  }

  try {
    return JSON.parse(rawBody) as CheckoutRequestPayload;
  } catch {
    throw new CheckoutRequestError(400, "invalid_json_body", "checkout request body must be valid JSON");
  }
}

function normalizeCheckoutError(error: unknown) {
  if (error instanceof CheckoutRequestError) {
    return jsonError(error.status, error.code, error.message);
  }

  if (error instanceof PaddleApiError) {
    return jsonError(502, "paddle_transaction_failed", error.message || `paddle_api_${error.status}`);
  }

  if (error instanceof Error) {
    if (error.message === "valid email is required") {
      return jsonError(400, "invalid_buyer_email", error.message);
    }

    if (error.message === "unsupported Paddle price") {
      return jsonError(400, "unsupported_paddle_price", error.message);
    }

    if (error.message.startsWith("Missing required environment variable:")) {
      return jsonError(500, "checkout_server_misconfigured", error.message);
    }

    return jsonError(500, "checkout_request_failed", error.message);
  }

  return jsonError(500, "checkout_request_failed", String(error));
}

export async function POST(request: NextRequest) {
  try {
    const payload = await readCheckoutPayload(request);

    const result = await createPaddleCheckout({
      buyerEmail: payload.buyerEmail || "",
      priceId: payload.priceId,
      priceKey: payload.priceKey,
    });

    return NextResponse.json(
      {
        ok: true,
        checkout: {
          transaction_id: result.transactionId,
          transaction_status: result.transactionStatus,
          order_id: result.orderId,
          checkout_url: result.checkoutUrl,
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
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    return normalizeCheckoutError(error);
  }
}
