import crypto from "node:crypto";

import type { BillingEvent, BillingEventType } from "./billingEvents";
import { getPaddleConfig } from "./env";
import { getPaddlePriceById } from "./paddlePrices";

function parseJsonObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  const normalized = String(value).trim();
  return normalized || null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function timingSafeEquals(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  if (left.length !== right.length) {
    return false;
  }
  return crypto.timingSafeEqual(left, right);
}

function parsePaddleSignature(header: string) {
  const parsed = new Map<string, string[]>();
  for (const part of header.split(";")) {
    const [key, value] = part.trim().split("=");
    if (!key || !value) {
      continue;
    }
    const current = parsed.get(key) || [];
    current.push(value);
    parsed.set(key, current);
  }
  const ts = parsed.get("ts")?.[0] || null;
  const h1 = parsed.get("h1") || [];
  return {
    ts,
    h1,
  };
}

export function verifyPaddleSignature(rawBody: string, headers: Headers): void {
  const config = getPaddleConfig();
  if (!config.webhookSecret) {
    throw new Error("Missing required environment variable: PADDLE_WEBHOOK_SECRET");
  }

  const header = headers.get("Paddle-Signature") || headers.get("paddle-signature");
  if (!header) {
    throw new Error("missing Paddle-Signature header");
  }

  const signature = parsePaddleSignature(header);
  if (!signature.ts || signature.h1.length === 0) {
    throw new Error("invalid Paddle-Signature header");
  }

  const now = Math.floor(Date.now() / 1000);
  const timestamp = Number(signature.ts);
  if (!Number.isFinite(timestamp)) {
    throw new Error("invalid Paddle-Signature timestamp");
  }
  if (Math.abs(now - timestamp) > config.webhookToleranceSeconds) {
    throw new Error("stale Paddle webhook timestamp");
  }

  const signedPayload = `${signature.ts}:${rawBody}`;
  const expected = crypto.createHmac("sha256", config.webhookSecret).update(signedPayload, "utf8").digest("hex");
  if (!signature.h1.some((candidate) => timingSafeEquals(expected, candidate))) {
    throw new Error("invalid Paddle webhook signature");
  }
}

function resolveEdition(input: {
  customData: Record<string, unknown>;
  items: Record<string, unknown>[];
  fallback?: string | null;
}) {
  const customEdition = asString(input.customData.edition);
  if (customEdition) {
    return customEdition;
  }

  const firstPriceId =
    asString(parseJsonObject(input.items[0]).price_id) ||
    asString(parseJsonObject(parseJsonObject(input.items[0]).price).id);
  const price = getPaddlePriceById(firstPriceId);
  return price?.edition || input.fallback || "community";
}

function resolveAmountCents(data: Record<string, unknown>): number | null {
  const details = parseJsonObject(data.details);
  const totals = parseJsonObject(details.totals);
  return (
    asNumber(totals.grand_total) ||
    asNumber(totals.total) ||
    asNumber(parseJsonObject(data.totals).grand_total) ||
    asNumber(parseJsonObject(data.totals).total)
  );
}

function normalizePaddleEventType(eventType: string, payloadData: Record<string, unknown>): BillingEventType | null {
  switch (eventType) {
    case "transaction.completed":
      return "payment_succeeded";
    case "transaction.payment_failed":
      return "payment_failed";
    case "transaction.created":
      return "order_created";
    case "subscription.canceled":
      return "order_canceled";
    case "adjustment.created":
    case "adjustment.updated": {
      const action = asString(payloadData.action);
      const status = asString(payloadData.status);
      if (action === "refund" && status === "approved") {
        return "payment_refunded";
      }
      return null;
    }
    default:
      return null;
  }
}

export function normalizePaddleBillingEvent(rawPayload: unknown): BillingEvent | null {
  const payload = parseJsonObject(rawPayload);
  const data = parseJsonObject(payload.data);
  const eventTypeName = asString(payload.event_type) || asString(payload.type);
  if (!eventTypeName) {
    throw new Error("event_type is required");
  }

  const normalizedType = normalizePaddleEventType(eventTypeName, data);
  if (!normalizedType) {
    return null;
  }

  const customData = parseJsonObject(data.custom_data);
  const items = Array.isArray(data.items) ? data.items.map((item) => parseJsonObject(item)) : [];
  const firstPayment = Array.isArray(data.payments) ? parseJsonObject(data.payments[0]) : {};
  const externalOrderId =
    asString(data.id) ||
    asString(data.transaction_id) ||
    asString(customData.transaction_id) ||
    asString(data.subscription_id);

  if (!externalOrderId) {
    throw new Error("Paddle event is missing a transaction or subscription identifier");
  }

  return {
    provider: "paddle",
    eventId: asString(payload.event_id) || asString(payload.id) || `paddle_${eventTypeName}_${externalOrderId}`,
    eventType: normalizedType,
    occurredAt: asString(payload.occurred_at) || asString(data.updated_at) || new Date().toISOString(),
    externalOrderId,
    externalPaymentId:
      normalizedType === "order_canceled"
        ? null
        : asString(firstPayment.id) ||
          (eventTypeName.startsWith("transaction.") ? asString(data.id) : asString(data.transaction_id)),
    externalSubscriptionId:
      normalizedType === "order_canceled" ? asString(data.id) : asString(data.subscription_id),
    externalCustomerId: asString(data.customer_id),
    customerEmail: asString(customData.requested_email) || asString(customData.customer_email),
    customerName: asString(customData.customer_name),
    edition: resolveEdition({
      customData,
      items,
      fallback: asString(customData.plan),
    }),
    amountCents: resolveAmountCents(data),
    currency: asString(data.currency_code),
    statusReason:
      asString(data.reason) ||
      asString(customData.status_reason) ||
      (normalizedType === "order_canceled" ? "period_end_cancellation" : null),
    rawPayload,
  };
}
