import { getLicenseHubDb } from "@mindforge/db";

import { getLicenseIssuerConfig } from "./env";
import { issueLicenseForPaidOrder } from "./issueLicenseForPaidOrder";

interface MockPaymentSucceededEvent {
  id: string;
  type: "payment.succeeded";
  data: {
    customer: {
      id?: string;
      email: string;
      name?: string;
    };
    order: {
      id: string;
      edition: string;
      amountCents?: number;
      currency?: string;
      notBefore?: string;
      notAfter?: string;
    };
  };
}

export async function handleMockPaymentEvent(payload: MockPaymentSucceededEvent) {
  const db = await getLicenseHubDb();
  const existingEvent = await db.getWebhookEvent("mock_payment", payload.id);
  if (existingEvent?.status === "processed" && existingEvent.licenseId) {
    return {
      ok: true,
      eventType: payload.type,
      idempotent: true,
      licenseId: existingEvent.licenseId,
    };
  }

  const webhookEvent =
    existingEvent ||
    (await db.createWebhookEvent({
      provider: "mock_payment",
      eventId: payload.id,
      eventType: payload.type,
      payloadJson: payload,
    }));

  if (payload.type !== "payment.succeeded") {
    await db.markWebhookEvent(webhookEvent.id, {
      status: "ignored",
      processedAt: new Date().toISOString(),
      errorMessage: `unsupported event type: ${payload.type}`,
    });
    return {
      ok: false,
      eventType: payload.type,
      idempotent: false,
      error: "unsupported_event_type",
    };
  }

  const customer = await db.upsertCustomer({
    email: payload.data.customer.email,
    name: payload.data.customer.name ?? null,
    externalCustomerId: payload.data.customer.id ?? null,
  });

  const order = await db.upsertOrder({
    externalOrderId: payload.data.order.id,
    paymentProvider: "mock_payment",
    customerId: customer.id,
    edition: payload.data.order.edition,
    amountCents: payload.data.order.amountCents ?? null,
    currency: payload.data.order.currency ?? null,
    status: "paid",
    paidAt: new Date().toISOString(),
  });

  const issuerConfig = getLicenseIssuerConfig();
  const issued = await issueLicenseForPaidOrder({
    db,
    customer,
    order,
    issuerName: issuerConfig.issuerName,
    keyId: issuerConfig.keyId,
    privateKeyPem: issuerConfig.privateKeyPem,
    publicKeyPem: issuerConfig.publicKeyPem,
    notBefore: payload.data.order.notBefore,
    notAfter: payload.data.order.notAfter,
  });

  await db.markWebhookEvent(webhookEvent.id, {
    status: "processed",
    processedAt: new Date().toISOString(),
    customerId: customer.id,
    orderId: order.id,
    licenseId: issued.license.licenseId,
  });

  return {
    ok: true,
    eventType: payload.type,
    idempotent: issued.idempotent,
    licenseId: issued.license.licenseId,
    orderId: order.id,
    customerId: customer.id,
  };
}
