export type BillingEventType =
  | "order_created"
  | "payment_succeeded"
  | "payment_failed"
  | "order_canceled"
  | "payment_refunded";

export interface BillingEvent {
  provider: string;
  eventId: string;
  notificationId: string | null;
  eventType: BillingEventType;
  occurredAt: string;
  billingPeriodStartsAt: string | null;
  billingPeriodEndsAt: string | null;
  externalOrderId: string;
  externalPaymentId: string | null;
  externalSubscriptionId: string | null;
  externalCustomerId: string | null;
  customerEmail: string | null;
  subjectEmail: string | null;
  customerName: string | null;
  edition: string;
  plan: string | null;
  interval: string | null;
  priceKey: string | null;
  amountCents: number | null;
  currency: string | null;
  statusReason: string | null;
  rawPayload: unknown;
}

function asString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const normalized = String(value).trim();
  return normalized ? normalized : null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function requireString(value: unknown, fieldName: string): string {
  const resolved = asString(value);
  if (!resolved) {
    throw new Error(`${fieldName} is required`);
  }

  return resolved;
}

function normalizeEventType(rawType: string): BillingEventType {
  const normalized = rawType.trim().toLowerCase();
  if (["payment_succeeded", "payment.succeeded", "transaction.paid"].includes(normalized)) {
    return "payment_succeeded";
  }
  if (["payment_failed", "payment.failed", "transaction.payment_failed"].includes(normalized)) {
    return "payment_failed";
  }
  if (["order_created", "subscription_created", "order.created", "subscription.created"].includes(normalized)) {
    return "order_created";
  }
  if (["order_canceled", "subscription_canceled", "order.canceled", "subscription.canceled"].includes(normalized)) {
    return "order_canceled";
  }
  if (["payment_refunded", "refund_issued", "payment.refunded", "adjustment.refunded"].includes(normalized)) {
    return "payment_refunded";
  }

  throw new Error(`unsupported billing event type: ${rawType}`);
}

export function normalizeBillingEvent(rawPayload: unknown, provider: string): BillingEvent {
  const payload = rawPayload as Record<string, unknown>;
  const data = (payload.data || {}) as Record<string, unknown>;
  const customer = (data.customer || {}) as Record<string, unknown>;
  const order = (data.order || {}) as Record<string, unknown>;
  const payment = (data.payment || {}) as Record<string, unknown>;
  const subscription = (data.subscription || {}) as Record<string, unknown>;

  const eventType = normalizeEventType(requireString(payload.type, "type"));
  const eventId = requireString(payload.id || payload.event_id, "id");
  const externalOrderId =
    requireString(order.id || order.external_order_id || payment.order_id || subscription.order_id, "order.id");

  return {
    provider,
    eventId,
    notificationId: eventId,
    eventType,
    occurredAt: asString(payload.occurred_at) || new Date().toISOString(),
    billingPeriodStartsAt: null,
    billingPeriodEndsAt: null,
    externalOrderId,
    externalPaymentId: asString(payment.id || payment.external_payment_id),
    externalSubscriptionId: asString(subscription.id || order.subscription_id || payment.subscription_id),
    externalCustomerId: asString(customer.id || customer.external_customer_id),
    customerEmail: asString(customer.email),
    subjectEmail: asString(customer.email),
    customerName: asString(customer.name),
    edition: asString(order.edition) || "community",
    plan: null,
    interval: null,
    priceKey: null,
    amountCents: asNumber(order.amount_cents ?? payment.amount_cents),
    currency: asString(order.currency || payment.currency),
    statusReason: asString(data.reason || payload.reason),
    rawPayload,
  };
}
