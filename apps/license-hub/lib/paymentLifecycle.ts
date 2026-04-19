import type { CustomerRecord, LicenseHubDb, LicenseRecord, OrderRecord } from "@mindforge/db";

import { getLicenseIssuerConfig } from "./env";
import { issueLicenseForPaidOrder } from "./issueLicenseForPaidOrder";
import { resolveLicenseValidityWindow } from "./licenseValidity";
import { sendLicenseStatusEmail, sendSignedLicenseEmail, type MailDeliveryResult } from "./mailer";
import { recordSystemAction } from "./systemActions";
import type { BillingEvent } from "./billingEvents";

interface ResolvedContext {
  customer: CustomerRecord;
  order: OrderRecord;
}

interface LicenseIssuanceContext {
  eventType: string;
  notificationId: string | null;
  transactionId: string;
  requestedEmail: string;
  edition: string;
  plan: string | null;
  interval: string | null;
  priceKey: string | null;
  billingPeriodStartsAt: string | null;
  billingPeriodEndsAt: string | null;
  subscriptionId: string | null;
  externalOrderId: string;
  externalSubscriptionId: string | null;
}

function requireIsoNow(): string {
  return new Date().toISOString();
}

function formatErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function logLicenseIssuance(fields: {
  event_type: string;
  notification_id: string | null;
  transaction_id: string;
  requested_email: string;
  edition: string;
  price_key: string | null;
  subscription_id: string | null;
  will_issue_license: boolean;
  issue_result?: "issued" | "idempotent" | "error";
  issue_error?: string | null;
}) {
  console.info(JSON.stringify(fields));
}

function buildLicenseIssuanceContext(event: BillingEvent, customer: CustomerRecord, order: OrderRecord): LicenseIssuanceContext {
  const requestedEmail = event.subjectEmail || event.customerEmail || customer.email;
  if (!requestedEmail) {
    throw new Error("requested_email is required for license issuance");
  }

  return {
    eventType: event.eventType,
    notificationId: event.notificationId,
    transactionId: event.externalOrderId,
    requestedEmail,
    edition: event.edition || order.edition,
    plan: event.plan,
    interval: event.interval,
    priceKey: event.priceKey,
    billingPeriodStartsAt: event.billingPeriodStartsAt,
    billingPeriodEndsAt: event.billingPeriodEndsAt,
    subscriptionId: event.externalSubscriptionId,
    externalOrderId: event.externalOrderId,
    externalSubscriptionId: event.externalSubscriptionId,
  };
}

async function attemptLifecycleNotification(input: {
  db: LicenseHubDb;
  source: string;
  actionType: string;
  targetId: string;
  orderId: string | null;
  licenseId: string | null;
  webhookEventId: string;
  send: () => Promise<MailDeliveryResult>;
}) {
  try {
    const notification = await input.send();
    return {
      notification,
      notificationError: null,
    };
  } catch (error) {
    const notificationError = error instanceof Error ? error.message : String(error);
    await recordSystemAction({
      db: input.db,
      source: input.source,
      actionType: `${input.actionType}_notification_error`,
      targetType: "order",
      targetId: input.targetId,
      orderId: input.orderId,
      licenseId: input.licenseId,
      webhookEventId: input.webhookEventId,
      payloadJson: {
        notification_error: notificationError,
      },
    });
    return {
      notification: null,
      notificationError,
    };
  }
}

async function resolveCustomerAndOrder(db: LicenseHubDb, event: BillingEvent): Promise<ResolvedContext> {
  const eventEmail = event.subjectEmail || event.customerEmail;
  const existingOrder =
    (await db.getOrderByExternalOrderId(event.externalOrderId)) ||
    (event.externalPaymentId ? await db.getOrderByExternalPaymentId(event.externalPaymentId) : null) ||
    (event.externalSubscriptionId ? await db.getOrderByExternalSubscriptionId(event.externalSubscriptionId) : null);

  if (existingOrder) {
    const existingCustomer = await db.getCustomerById(existingOrder.customerId);
    if (!existingCustomer) {
      throw new Error("existing order is missing its customer");
    }

    const order = await db.updateOrder(existingOrder.id, {
      paymentProvider: event.provider,
      edition: event.edition || existingOrder.edition,
      externalPaymentId: event.externalPaymentId ?? existingOrder.externalPaymentId,
      externalSubscriptionId: event.externalSubscriptionId ?? existingOrder.externalSubscriptionId,
      amountCents: event.amountCents ?? existingOrder.amountCents,
      currency: event.currency ?? existingOrder.currency,
    });

    return {
      customer: existingCustomer,
      order,
    };
  }

  if (!eventEmail) {
    throw new Error("customer email is required when creating a new order from billing event");
  }

  const customer = await db.upsertCustomer({
    email: eventEmail,
    name: event.customerName,
    externalCustomerId: event.externalCustomerId,
  });

  const order = await db.upsertOrder({
    externalOrderId: event.externalOrderId,
    paymentProvider: event.provider,
    customerId: customer.id,
    edition: event.edition,
    externalPaymentId: event.externalPaymentId,
    externalSubscriptionId: event.externalSubscriptionId,
    amountCents: event.amountCents,
    currency: event.currency,
    status: "pending",
  });

  return {
    customer,
    order,
  };
}

async function updateOrderStatus(db: LicenseHubDb, order: OrderRecord, event: BillingEvent): Promise<OrderRecord> {
  const occurredAt = event.occurredAt || requireIsoNow();

  if (event.eventType === "order_created") {
    return db.updateOrder(order.id, {
      status: order.status === "paid" ? order.status : "pending",
      externalPaymentId: event.externalPaymentId ?? order.externalPaymentId,
      externalSubscriptionId: event.externalSubscriptionId ?? order.externalSubscriptionId,
      statusReason: event.statusReason,
    });
  }

  if (event.eventType === "payment_succeeded") {
    return db.updateOrder(order.id, {
      status: "paid",
      paidAt: occurredAt,
      externalPaymentId: event.externalPaymentId ?? order.externalPaymentId,
      externalSubscriptionId: event.externalSubscriptionId ?? order.externalSubscriptionId,
      statusReason: event.statusReason,
    });
  }

  if (event.eventType === "payment_failed") {
    return db.updateOrder(order.id, {
      status: "failed",
      failedAt: occurredAt,
      externalPaymentId: event.externalPaymentId ?? order.externalPaymentId,
      externalSubscriptionId: event.externalSubscriptionId ?? order.externalSubscriptionId,
      statusReason: event.statusReason,
    });
  }

  if (event.eventType === "payment_refunded") {
    return db.updateOrder(order.id, {
      status: "refunded",
      refundedAt: occurredAt,
      externalPaymentId: event.externalPaymentId ?? order.externalPaymentId,
      externalSubscriptionId: event.externalSubscriptionId ?? order.externalSubscriptionId,
      statusReason: event.statusReason || "payment_refunded",
    });
  }

  return db.updateOrder(order.id, {
    status: "cancelled",
    cancelledAt: occurredAt,
    externalPaymentId: event.externalPaymentId ?? order.externalPaymentId,
    externalSubscriptionId: event.externalSubscriptionId ?? order.externalSubscriptionId,
    statusReason: event.statusReason || "billing_canceled",
  });
}

async function revokeLifecycleLicense(input: {
  db: LicenseHubDb;
  order: OrderRecord;
  license: LicenseRecord;
  event: BillingEvent;
}) {
  const isRefund = input.event.eventType === "payment_refunded";
  return input.db.updateLicense(input.license.id, {
    status: isRefund ? "refund_revoked" : "revoked",
    revokedAt: input.event.occurredAt || requireIsoNow(),
    revokeReason:
      input.event.statusReason ||
      (isRefund ? "payment_refunded" : "billing_canceled"),
  });
}

export async function applyBillingLifecycle(input: {
  db: LicenseHubDb;
  webhookEventId: string;
  event: BillingEvent;
}) {
  const context = await resolveCustomerAndOrder(input.db, input.event);
  const order = await updateOrderStatus(input.db, context.order, input.event);

  if (input.event.eventType === "order_created") {
    const action = await recordSystemAction({
      db: input.db,
      source: input.event.provider,
      actionType: "order_created",
      targetType: "order",
      targetId: order.externalOrderId,
      orderId: order.id,
      webhookEventId: input.webhookEventId,
      payloadJson: {
        status: order.status,
      },
    });

    return { customer: context.customer, order, license: null, action, idempotent: false };
  }

  if (input.event.eventType === "payment_failed") {
    const action = await recordSystemAction({
      db: input.db,
      source: input.event.provider,
      actionType: "payment_failed",
      targetType: "order",
      targetId: order.externalOrderId,
      orderId: order.id,
      webhookEventId: input.webhookEventId,
      payloadJson: {
        status: order.status,
        reason: order.statusReason,
      },
    });

    return { customer: context.customer, order, license: null, action, idempotent: false };
  }

  if (input.event.eventType === "payment_succeeded") {
    const issuer = getLicenseIssuerConfig();
    const issuance = buildLicenseIssuanceContext(input.event, context.customer, order);

    logLicenseIssuance({
      event_type: issuance.eventType,
      notification_id: issuance.notificationId,
      transaction_id: issuance.transactionId,
      requested_email: issuance.requestedEmail,
      edition: issuance.edition,
      price_key: issuance.priceKey,
      subscription_id: issuance.subscriptionId,
      will_issue_license: true,
    });

    const validityWindow = resolveLicenseValidityWindow({
      occurredAt: input.event.occurredAt,
      billingPeriodStartsAt: issuance.billingPeriodStartsAt,
      billingPeriodEndsAt: issuance.billingPeriodEndsAt,
      interval: issuance.interval,
      priceKey: issuance.priceKey,
    });

    let issued: Awaited<ReturnType<typeof issueLicenseForPaidOrder>>;
    try {
      issued = await issueLicenseForPaidOrder({
        db: input.db,
        customer: context.customer,
        order,
        subjectEmail: issuance.requestedEmail,
        edition: issuance.edition,
        issuerName: issuer.issuerName,
        keyId: issuer.keyId,
        privateKeyPem: issuer.privateKeyPem,
        publicKeyPem: issuer.publicKeyPem,
        notBefore: validityWindow?.notBefore,
        notAfter: validityWindow?.notAfter,
      });
    } catch (error) {
      logLicenseIssuance({
        event_type: issuance.eventType,
        notification_id: issuance.notificationId,
        transaction_id: issuance.transactionId,
        requested_email: issuance.requestedEmail,
        edition: issuance.edition,
        price_key: issuance.priceKey,
        subscription_id: issuance.subscriptionId,
        will_issue_license: true,
        issue_result: "error",
        issue_error: formatErrorMessage(error),
      });
      throw error;
    }

    logLicenseIssuance({
      event_type: issuance.eventType,
      notification_id: issuance.notificationId,
      transaction_id: issuance.transactionId,
      requested_email: issuance.requestedEmail,
      edition: issuance.edition,
      price_key: issuance.priceKey,
      subscription_id: issuance.subscriptionId,
      will_issue_license: true,
      issue_result: issued.idempotent ? "idempotent" : "issued",
      issue_error: null,
    });

    const action = await recordSystemAction({
      db: input.db,
      source: input.event.provider,
      actionType: issued.idempotent ? "payment_succeeded_replayed" : "payment_succeeded",
      targetType: "order",
      targetId: order.externalOrderId,
      orderId: order.id,
      licenseId: issued.license.id,
      webhookEventId: input.webhookEventId,
      payloadJson: {
        order_status: order.status,
        license_id: issued.license.licenseId,
        idempotent: issued.idempotent,
        subject_email: issuance.requestedEmail,
        edition: issuance.edition,
        plan: issuance.plan,
        interval: issuance.interval,
        price_key: issuance.priceKey,
        external_order_id: issuance.externalOrderId,
        external_subscription_id: issuance.externalSubscriptionId,
      },
    });

    const { notification, notificationError } = await attemptLifecycleNotification({
      db: input.db,
      source: input.event.provider,
      actionType: issued.idempotent ? "payment_succeeded_replayed" : "payment_succeeded",
      targetId: order.externalOrderId,
      orderId: order.id,
      licenseId: issued.license.id,
      webhookEventId: input.webhookEventId,
      send: () =>
        sendSignedLicenseEmail({
          to: issuance.requestedEmail,
          licenseId: issued.license.licenseId,
          signedLicenseJson: issued.license.signedLicenseJson,
          actionLabel: issued.idempotent ? "License delivery replay" : "License issued",
        }),
    });

    return {
      customer: context.customer,
      order,
      license: issued.license,
      action,
      notification,
      notificationError,
      idempotent: issued.idempotent,
    };
  }

  const activeLicense = await input.db.findActiveLicenseByOrderId(order.id);
  const updatedLicense = activeLicense ? await revokeLifecycleLicense({ db: input.db, order, license: activeLicense, event: input.event }) : null;
  const actionType = input.event.eventType === "payment_refunded" ? "payment_refunded" : "order_canceled";
  const action = await recordSystemAction({
    db: input.db,
    source: input.event.provider,
    actionType,
    targetType: "order",
    targetId: order.externalOrderId,
    orderId: order.id,
    licenseId: updatedLicense?.id ?? null,
    webhookEventId: input.webhookEventId,
    payloadJson: {
      order_status: order.status,
      license_status: updatedLicense?.status ?? null,
      reason: order.statusReason,
    },
  });

  let notification = null;
  let notificationError = null;
  if (updatedLicense) {
    const result = await attemptLifecycleNotification({
      db: input.db,
      source: input.event.provider,
      actionType,
      targetId: order.externalOrderId,
      orderId: order.id,
      licenseId: updatedLicense.id,
      webhookEventId: input.webhookEventId,
      send: () =>
        sendLicenseStatusEmail({
          to: context.customer.email,
          subject:
            input.event.eventType === "payment_refunded"
              ? `License ${updatedLicense.licenseId} revoked after refund`
              : `License ${updatedLicense.licenseId} revoked after cancellation`,
          message:
            input.event.eventType === "payment_refunded"
              ? `Your payment was refunded, so license ${updatedLicense.licenseId} has been revoked.`
              : `The related billing agreement was canceled, so license ${updatedLicense.licenseId} has been revoked.`,
          licenseId: updatedLicense.licenseId,
          actionLabel: actionType,
        }),
    });
    notification = result.notification;
    notificationError = result.notificationError;
  }

  return {
    customer: context.customer,
    order,
    license: updatedLicense,
    action,
    notification,
    notificationError,
    idempotent: false,
  };
}
