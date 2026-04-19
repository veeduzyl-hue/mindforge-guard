import { Environment, Paddle } from "@paddle/paddle-node-sdk";

import type { BillingEvent, BillingEventType } from "./billingEvents";
import { getPaddleConfig } from "./env";
import { getPaddlePriceById } from "./paddlePrices";

type StagedError = Error & {
  stage?: string;
  reason?: string;
};

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

let paddleClient: Paddle | null = null;

function getPaddleEnvironment() {
  return getPaddleConfig().environment === "production" ? Environment.production : Environment.sandbox;
}

function getPaddleClient(): Paddle {
  if (!paddleClient) {
    const config = getPaddleConfig();
    paddleClient = new Paddle(config.apiKey || "pdl_webhook_verifier", {
      environment: getPaddleEnvironment(),
    });
  }

  return paddleClient;
}

export function getPaddleSignatureHeader(headers: Headers): string | null {
  return headers.get("paddle-signature") || headers.get("Paddle-Signature");
}

function logPaddleWebhookDiagnostic(fields: {
  signature_header?: "present" | "missing";
  webhook_secret?: "exists" | "missing";
  webhook_secret_prefix?: string | null;
  event_type?: string | null;
  notification_id?: string | null;
  verify_result?: "success" | "failure";
}) {
  console.info(JSON.stringify(fields));
}

function createStagedError(message: string, stage: string, reason: string): Error {
  return Object.assign(new Error(message), {
    stage,
    reason,
  } satisfies Pick<StagedError, "stage" | "reason">);
}

export async function verifyPaddleSignature(rawBody: string, headers: Headers): Promise<void> {
  const config = getPaddleConfig();
  const signatureHeader = getPaddleSignatureHeader(headers);
  const webhookSecretPrefix = config.webhookSecret ? config.webhookSecret.slice(0, 12) : null;

  logPaddleWebhookDiagnostic({
    signature_header: signatureHeader ? "present" : "missing",
    webhook_secret: config.webhookSecret ? "exists" : "missing",
    webhook_secret_prefix: webhookSecretPrefix,
  });

  if (!config.webhookSecret) {
    logPaddleWebhookDiagnostic({
      webhook_secret: "missing",
      webhook_secret_prefix: null,
      verify_result: "failure",
    });
    throw createStagedError(
      "Missing required environment variable: PADDLE_WEBHOOK_SECRET",
      "verify_signature",
      "missing_paddle_webhook_secret"
    );
  }

  if (!signatureHeader) {
    logPaddleWebhookDiagnostic({
      signature_header: "missing",
      webhook_secret: "exists",
      webhook_secret_prefix: webhookSecretPrefix,
      verify_result: "failure",
    });
    throw createStagedError(
      "missing Paddle-Signature header",
      "verify_signature",
      "missing_paddle_signature_header"
    );
  }

  try {
    const eventData = await getPaddleClient().webhooks.unmarshal(rawBody, config.webhookSecret, signatureHeader);
    logPaddleWebhookDiagnostic({
      signature_header: "present",
      webhook_secret: "exists",
      webhook_secret_prefix: webhookSecretPrefix,
      event_type: eventData.eventType || null,
      notification_id: eventData.notificationId || null,
      verify_result: "success",
    });
  } catch {
    logPaddleWebhookDiagnostic({
      signature_header: "present",
      webhook_secret: "exists",
      webhook_secret_prefix: webhookSecretPrefix,
      event_type: null,
      notification_id: null,
      verify_result: "failure",
    });
    throw createStagedError(
      "invalid Paddle webhook signature",
      "verify_signature",
      "invalid_paddle_signature"
    );
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
  const requestedEmail = asString(customData.requested_email) || asString(customData.customer_email);
  const edition = resolveEdition({
    customData,
    items,
    fallback: asString(customData.plan),
  });
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
    notificationId: asString(payload.notification_id) || asString(payload.event_id) || asString(payload.id),
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
    customerEmail: requestedEmail,
    subjectEmail: requestedEmail,
    customerName: asString(customData.customer_name),
    edition,
    plan: asString(customData.plan),
    interval: asString(customData.interval),
    priceKey: asString(customData.price_key),
    amountCents: resolveAmountCents(data),
    currency: asString(data.currency_code),
    statusReason:
      asString(data.reason) ||
      asString(customData.status_reason) ||
      (normalizedType === "order_canceled" ? "period_end_cancellation" : null),
    rawPayload,
  };
}
