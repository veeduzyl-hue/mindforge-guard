import crypto from "node:crypto";

import { getLicenseHubDb } from "@mindforge/db";

import { getBillingProviderConfig, isProductionEnv } from "./env";
import { normalizeBillingEvent } from "./billingEvents";
import { applyBillingLifecycle } from "./paymentLifecycle";

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

export async function handleBillingWebhook(rawBody: string, headers: Headers) {
  verifyBillingSignature(rawBody, headers);

  const providerConfig = getBillingProviderConfig();
  const rawPayload = JSON.parse(rawBody) as unknown;
  const event = normalizeBillingEvent(rawPayload, providerConfig.provider);
  const db = await getLicenseHubDb();

  const existingEvent = await db.getWebhookEvent(providerConfig.provider, event.eventId);
  if (existingEvent?.status === "processed") {
    return {
      ok: true,
      idempotent: true,
      provider: providerConfig.provider,
      eventId: event.eventId,
      eventType: event.eventType,
      orderId: existingEvent.orderId,
      licenseId: existingEvent.licenseId,
    };
  }

  const webhookEvent =
    existingEvent ||
    (await db.createWebhookEvent({
      provider: providerConfig.provider,
      eventId: event.eventId,
      eventType: event.eventType,
      payloadJson: {
        raw_body: rawPayload,
        normalized_event: event,
      },
    }));

  try {
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
      licenseId: result.license?.licenseId ?? null,
    });

    return {
      ok: true,
      idempotent: result.idempotent,
      provider: providerConfig.provider,
      eventId: event.eventId,
      eventType: event.eventType,
      orderId: result.order.id,
      licenseId: result.license?.licenseId ?? null,
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
