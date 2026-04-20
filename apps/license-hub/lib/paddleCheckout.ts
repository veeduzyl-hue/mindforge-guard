import { getLicenseHubDb } from "@mindforge/db";

import { getPaddleConfig } from "./env";
import { paddleApiRequest, type PaddleTransactionResponse } from "./paddleApi";
import { getPaddlePriceById, getPaddlePriceByKey, listPaddlePrices, type PaddlePriceDefinition } from "./paddlePrices";

interface PaddleCustomerResponse {
  id: string;
  email: string;
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function requireEmail(value: string): string {
  const email = normalizeEmail(value);
  if (!email || !email.includes("@")) {
    throw new Error("valid email is required");
  }
  return email;
}

function resolvePrice(input: { priceId?: string; priceKey?: string }): PaddlePriceDefinition {
  const byId = getPaddlePriceById(input.priceId);
  if (byId) {
    return byId;
  }

  const byKey = getPaddlePriceByKey(input.priceKey || "");
  if (byKey) {
    return byKey;
  }

  throw new Error("unsupported Paddle price");
}

function logPaddleCheckoutEmail(fields: {
  purchase_email: string;
  paddle_customer_email: string;
  price_key: string;
  edition: string;
}) {
  console.info(JSON.stringify(fields));
}

async function getPaddleCustomerByEmail(email: string): Promise<PaddleCustomerResponse | null> {
  const customers = await paddleApiRequest<PaddleCustomerResponse[]>(`/customers?email=${encodeURIComponent(email)}`);
  return customers[0] || null;
}

async function ensurePaddleCustomer(email: string): Promise<PaddleCustomerResponse> {
  const existingCustomer = await getPaddleCustomerByEmail(email);
  if (existingCustomer) {
    return existingCustomer;
  }

  return paddleApiRequest<PaddleCustomerResponse>("/customers", {
    method: "POST",
    body: JSON.stringify({
      email,
    }),
  });
}

export async function createPaddleCheckout(input: {
  buyerEmail: string;
  priceId?: string;
  priceKey?: string;
}) {
  const buyerEmail = requireEmail(input.buyerEmail);
  const price = resolvePrice(input);
  const paddle = getPaddleConfig();
  const paddleCustomer = await ensurePaddleCustomer(buyerEmail);

  logPaddleCheckoutEmail({
    purchase_email: buyerEmail,
    paddle_customer_email: paddleCustomer.email,
    price_key: price.key,
    edition: price.edition,
  });

  const transaction = await paddleApiRequest<PaddleTransactionResponse>("/transactions", {
    method: "POST",
    body: JSON.stringify({
      items: [
        {
          price_id: price.priceId,
          quantity: 1,
        },
      ],
      collection_mode: "automatic",
      checkout: {
        url: paddle.checkoutTargetUrl,
      },
      customer_id: paddleCustomer.id,
      custom_data: {
        integration: "mindforge_guard",
        integration_phase: "paddle_phase1",
        requested_email: buyerEmail,
        price_key: price.key,
        price_id: price.priceId,
        edition: price.edition,
        plan: price.plan,
        interval: price.interval,
      },
    }),
  });

  const db = await getLicenseHubDb();
  const customer = await db.upsertCustomer({
    email: buyerEmail,
  });
  const order = await db.upsertOrder({
    externalOrderId: transaction.id,
    paymentProvider: "paddle",
    customerId: customer.id,
    edition: price.edition,
    status: "pending",
    statusReason: "checkout_created",
  });
  await db.createSystemAction({
    source: "paddle_checkout",
    actionType: "checkout_created",
    targetType: "order",
    targetId: order.externalOrderId,
    orderId: order.id,
    payloadJson: {
      price_key: price.key,
      price_id: price.priceId,
      edition: price.edition,
      interval: price.interval,
      transaction_status: transaction.status,
    },
  });

  return {
    transactionId: transaction.id,
    transactionStatus: transaction.status,
    orderId: order.id,
    price,
    successUrl: paddle.checkoutSuccessUrl,
    cancelUrl: paddle.checkoutCancelUrl,
    checkoutUrl: transaction.checkout?.url || null,
  };
}

export function getPaddleClientBootConfig() {
  const paddle = getPaddleConfig();
  return {
    environment: paddle.environment,
    clientToken: paddle.clientToken,
    successUrl: paddle.checkoutSuccessUrl,
    cancelUrl: paddle.checkoutCancelUrl,
    prices: listPaddlePrices(),
  };
}
