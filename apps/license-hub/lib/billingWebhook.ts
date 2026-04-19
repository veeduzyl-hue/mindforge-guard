import crypto from "node:crypto";

import { getLicenseHubDb } from "@mindforge/db";

import { getBillingProviderConfig, isProductionEnv } from "./env";
import { normalizeBillingEvent } from "./billingEvents";
import { applyBillingLifecycle } from "./paymentLifecycle";
import { normalizePaddleBillingEvent, verifyPaddleSignature } from "./paddleWebhook";

type StagedError = Error & {
  stage?: string;
  reason?: string;
};

function sha256Hex(secret: string, value: string): string {
  return crypto.createHmac("sha256", secret).update(value, "utf8").digest("hex");
}

function timingSafeEquals(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  if (left.length !== right.length) {
    return false;
  }
  return crypto.timingSafeEqual(left, right);
}

function verifyBillingSignature(rawBody: string, headers: Headers): void {
  const config = getBillingProviderConfig();
  const signature = headers.get(config.signatureHeader) || headers.get(config.signatureHeader.toLowerCase());

  if (!config.webhookSecret) {
    if (isProductionEnv() || !config.allowUnsignedDev) {
      throw new Error("billing webhook secret is required");
    }
    return;
  }

  if (!signature) {
    throw new Error(`missing billing signature header: ${config.signatureHeader}`);
  }

  const expected = sha256Hex(config.webhookSecret, rawBody);
  if (!timingSafeEquals(expected, signature)) {
    throw new Error("invalid billing webhook signature");
  }
}

function fallbackEventId(rawBody: string): string {
  const digest = crypto.createHash("sha256").update(rawBody, "utf8").digest("hex").slice(0, 24);
  return `surrogate_${digest}`;
}

function safeParseRawPayload(rawBody: string): unknown {
  return JSON.parse(rawBody) as unknown;
}

function withStage(error: unknown, stage: string, reason?: string): Error {
  const normalized = error instanceof Error ? error : new Error(String(error));
  const staged = normalized as StagedError;
  staged.stage = staged.stage || stage;
  if (reason && !staged.reason) {
    staged.reason = reason;
  }
  return normalized;
}

function extractLedgerMetadata(rawPayload: unknown, rawBody: string) {
  const payload = (rawPayload && typeof rawPayload === "object" ? rawPayload : {}) as Record<string, unknown>;
  const eventId =
    (typeof payload.id === "string" && payload.id.trim()) ||
    (typeof payload.event_id === "string" && payload.event_id.trim()) ||
    fallbackEventId(rawBody);
  const eventType =
    (typeof payload.type === "string" && payload.type.trim()) ||
    (typeof payload.event_type === "string" && payload.event_type.trim()) ||
    "unknown";

  return {
    eventId,
    eventType,
  };
}

export async function handleBillingWebhook(rawBody: string, headers: Headers) {
  const providerConfig = getBillingProviderConfig();
  if (providerConfig.provider === "paddle") {
    return handlePaddleBillingWebhook(rawBody, headers);
  }

  verifyBillingSignature(rawBody, headers);
  const db = await getLicenseHubDb();
  let rawPayload: unknown = null;

  try {
    rawPayload = safeParseRawPayload(rawBody);
  } catch (error) {
    const ledger = extractLedgerMetadata(null, rawBody);
    const webhookEvent =
      (await db.getWebhookEvent(providerConfig.provider, ledger.eventId)) ||
      (await db.createWebhookEvent({
        provider: providerConfig.provider,
        eventId: ledger.eventId,
        eventType: ledger.eventType,
        payloadJson: {
          raw_body: rawBody,
          raw_payload: null,
        },
      }));

    await db.markWebhookEvent(webhookEvent.id, {
      status: "error",
      processedAt: new Date().toISOString(),
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }

  const ledger = extractLedgerMetadata(rawPayload, rawBody);

  const existingEvent = await db.getWebhookEvent(providerConfig.provider, ledger.eventId);
  if (existingEvent?.status === "processed") {
    return {
      ok: true,
      idempotent: true,
      provider: providerConfig.provider,
      eventId: existingEvent.eventId,
      eventType: existingEvent.eventType,
      orderId: existingEvent.orderId,
      licenseRecordId: existingEvent.licenseId,
      publicLicenseId: null,
    };
  }

  const webhookEvent =
    existingEvent ||
    (await db.createWebhookEvent({
      provider: providerConfig.provider,
      eventId: ledger.eventId,
      eventType: ledger.eventType,
      payloadJson: {
        raw_body: rawBody,
        raw_payload: rawPayload,
      },
    }));

  try {
    const event = normalizeBillingEvent(rawPayload, providerConfig.provider);
    const result = await applyBillingLifecycle({
      db,
      webhookEventId: webhookEvent.id,
      event,
    });

    await db.markWebhookEvent(webhookEvent.id, {
      status: "processed",
      processedAt: new Date().toISOString(),
      customerId: result.customer.id,
      orderId: result.order.id,
      licenseId: result.license?.id ?? null,
    });

    return {
      ok: true,
      idempotent: result.idempotent,
      provider: providerConfig.provider,
      eventId: event.eventId,
      eventType: event.eventType,
      orderId: result.order.id,
      licenseRecordId: result.license?.id ?? null,
      publicLicenseId: result.license?.licenseId ?? null,
    };
  } catch (error) {
    await db.markWebhookEvent(webhookEvent.id, {
      status: "error",
      processedAt: new Date().toISOString(),
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

async function handlePaddleBillingWebhook(rawBody: string, headers: Headers) {
  try {
    await verifyPaddleSignature(rawBody, headers);
  } catch (error) {
    throw withStage(error, "verify_signature");
  }

  const providerConfig = getBillingProviderConfig();
  const db = await getLicenseHubDb();
  let rawPayload: unknown;
  try {
    rawPayload = safeParseRawPayload(rawBody);
  } catch (error) {
    throw withStage(error, "parse_raw_payload", "invalid_webhook_json");
  }

  let normalized;
  try {
    normalized = normalizePaddleBillingEvent(rawPayload);
  } catch (error) {
    throw withStage(error, "normalize_event", "invalid_paddle_event");
  }
  const payloadRecord = rawPayload && typeof rawPayload === "object" ? (rawPayload as Record<string, unknown>) : {};
  const ledger = {
    eventId:
      (typeof payloadRecord.event_id === "string" && payloadRecord.event_id.trim()) ||
      (typeof payloadRecord.id === "string" && payloadRecord.id.trim()) ||
      fallbackEventId(rawBody),
    eventType:
      (typeof payloadRecord.event_type === "string" && payloadRecord.event_type.trim()) ||
      (typeof payloadRecord.type === "string" && payloadRecord.type.trim()) ||
      "unknown",
  };

  const existingEvent = await db.getWebhookEvent(providerConfig.provider, ledger.eventId);
  if (existingEvent?.status === "processed") {
    return {
      ok: true,
      idempotent: true,
      ignored: false,
      provider: providerConfig.provider,
      eventId: existingEvent.eventId,
      eventType: existingEvent.eventType,
      orderId: existingEvent.orderId,
      licenseRecordId: existingEvent.licenseId,
      publicLicenseId: null,
    };
  }

  const webhookEvent =
    existingEvent ||
    (await db.createWebhookEvent({
      provider: providerConfig.provider,
      eventId: ledger.eventId,
      eventType: ledger.eventType,
      payloadJson: {
        raw_body: rawBody,
        raw_payload: rawPayload,
      },
    }));

  if (!normalized) {
    await db.markWebhookEvent(webhookEvent.id, {
      status: "ignored",
      processedAt: new Date().toISOString(),
    });
    return {
      ok: true,
      idempotent: false,
      ignored: true,
      provider: providerConfig.provider,
      eventId: ledger.eventId,
      eventType: ledger.eventType,
      orderId: null,
      licenseRecordId: null,
      publicLicenseId: null,
    };
  }

  try {
    const result = await applyBillingLifecycle({
      db,
      webhookEventId: webhookEvent.id,
      event: normalized,
    });
    await db.markWebhookEvent(webhookEvent.id, {
      status: "processed",
      processedAt: new Date().toISOString(),
      customerId: result.customer.id,
      orderId: result.order.id,
      licenseId: result.license?.id ?? null,
    });

    return {
      ok: true,
      idempotent: result.idempotent,
      ignored: false,
      provider: providerConfig.provider,
      eventId: normalized.eventId,
      eventType: normalized.eventType,
      orderId: result.order.id,
      licenseRecordId: result.license?.id ?? null,
      publicLicenseId: result.license?.licenseId ?? null,
    };
  } catch (error) {
    const stagedError = withStage(error, "apply_billing_lifecycle");
    await db.markWebhookEvent(webhookEvent.id, {
      status: "error",
      processedAt: new Date().toISOString(),
      errorMessage: stagedError.message,
    });
    throw stagedError;
  }
}
