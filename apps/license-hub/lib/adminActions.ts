import crypto from "node:crypto";

import type { CustomerRecord, LicenseRecord, LicenseHubDb, OrderRecord } from "@mindforge/db";
import {
  createUnsignedLicensePayload,
  normalizeLicenseEdition,
  resolveEntitlementsForEdition,
  signLicensePayload,
  verifyLicensePayload,
} from "@mindforge/licensing";

import { getLicenseIssuerConfig } from "./env";
import { type MailDeliveryResult, sendLicenseStatusEmail, sendSignedLicenseEmail } from "./mailer";

interface LicenseContext {
  db: LicenseHubDb;
  license: LicenseRecord;
  customer: CustomerRecord;
  order: OrderRecord;
}

interface NotificationAttemptResult {
  notification: MailDeliveryResult | null;
  notificationError: string | null;
}

export interface AdminActionRequestBody {
  reason?: string;
  notAfter?: string;
  edition?: string;
  notifyCustomer?: boolean | string;
  redirectTo?: string;
}

function requireIsoTimestamp(value: string | undefined, fieldName: string): string {
  const candidate = String(value || "");
  if (!candidate || !Number.isFinite(Date.parse(candidate))) {
    throw new Error(`${fieldName} must be a valid ISO timestamp`);
  }

  return new Date(candidate).toISOString();
}

function resolveReplacementEdition(value: string | undefined, fallbackEdition: string): string {
  const candidate = String(value || "").trim();
  if (!candidate) {
    return fallbackEdition;
  }

  const normalized = normalizeLicenseEdition(candidate);
  const accepted = ["community", "pro", "pro_plus", "pro+", "enterprise"];
  if (!accepted.includes(candidate.toLowerCase()) && normalized !== candidate.toLowerCase()) {
    throw new Error("edition must be one of community, pro, pro_plus, pro+, or enterprise");
  }

  return normalized;
}

function normalizeNotifyCustomer(value: boolean | string | undefined): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  return value === "true" || value === "1" || value === "on" || value === "yes";
}

function requireActiveLicense(license: LicenseRecord): void {
  if (license.status !== "active") {
    throw new Error(`license must be active for this action; current status is ${license.status}`);
  }
}

async function getLicenseContext(db: LicenseHubDb, licenseId: string): Promise<LicenseContext> {
  const license = await db.getLicenseByLicenseId(licenseId);
  if (!license) {
    throw new Error("license_not_found");
  }

  const customer = await db.getCustomerById(license.customerId);
  const order = await db.getOrderById(license.orderId);
  if (!customer || !order) {
    throw new Error("license record is missing customer or order linkage");
  }

  return {
    db,
    license,
    customer,
    order,
  };
}

async function attemptNotification(input: {
  db: LicenseHubDb;
  actorEmail: string;
  actionType: string;
  parentLicenseId: string;
  licenseRecordId: string;
  send: () => Promise<MailDeliveryResult>;
}): Promise<NotificationAttemptResult> {
  try {
    const notification = await input.send();
    return {
      notification,
      notificationError: null,
    };
  } catch (error) {
    const notificationError = error instanceof Error ? error.message : String(error);
    await input.db.createAdminAction({
      actorEmail: input.actorEmail,
      actionType: `${input.actionType}_notification_error`,
      targetType: "license",
      targetId: input.parentLicenseId,
      licenseId: input.licenseRecordId,
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

function createReplacementSignedLicense(input: {
  customer: CustomerRecord;
  order: OrderRecord;
  nextEdition: string;
  nextNotAfter: string;
}) {
  const issuer = getLicenseIssuerConfig();
  const issuedAt = new Date().toISOString();
  const notBefore = issuedAt;

  const payload = createUnsignedLicensePayload({
    version: 1,
    license_id: `lic_${crypto.randomUUID()}`,
    customer_id: input.customer.id,
    order_id: input.order.id,
    subject: {
      email: input.customer.email,
    },
    edition: input.nextEdition,
    issued_at: issuedAt,
    not_before: notBefore,
    not_after: input.nextNotAfter,
    status: "active",
    entitlements: resolveEntitlementsForEdition(input.nextEdition),
    issuer: {
      name: issuer.issuerName,
      key_id: issuer.keyId,
    },
  });

  const signedLicense = signLicensePayload(payload, issuer.privateKeyPem);
  const verification = verifyLicensePayload(signedLicense, issuer.publicKeyPem);
  if (!verification.ok) {
    throw new Error(`replacement license failed verification: ${verification.reason}`);
  }

  return {
    payload,
    signedLicense,
  };
}

export async function resendLicenseByAdmin(input: {
  db: LicenseHubDb;
  actorEmail: string;
  licenseId: string;
}) {
  const context = await getLicenseContext(input.db, input.licenseId);
  const delivery = await sendSignedLicenseEmail({
    to: context.customer.email,
    licenseId: context.license.licenseId,
    signedLicenseJson: context.license.signedLicenseJson,
    actionLabel: "License resend",
  });

  const action = await input.db.createAdminAction({
    actorEmail: input.actorEmail,
    actionType: "resend",
    targetType: "license",
    targetId: context.license.licenseId,
    licenseId: context.license.id,
    payloadJson: {
      customer_email: context.customer.email,
      status: context.license.status,
      delivery_mode: delivery.mode,
      debug_path: "debugPath" in delivery ? delivery.debugPath : null,
    },
  });

  return {
    license: context.license,
    delivery,
    action,
  };
}

export async function revokeLicenseByAdmin(input: {
  db: LicenseHubDb;
  actorEmail: string;
  licenseId: string;
  reason?: string;
  notifyCustomer?: boolean | string;
}) {
  const context = await getLicenseContext(input.db, input.licenseId);
  requireActiveLicense(context.license);

  const revokedAt = new Date().toISOString();
  const updatedLicense = await input.db.updateLicense(context.license.id, {
    status: "revoked",
    revokedAt,
    revokeReason: input.reason?.trim() || null,
  });

  const notifyCustomer = normalizeNotifyCustomer(input.notifyCustomer);

  const action = await input.db.createAdminAction({
    actorEmail: input.actorEmail,
    actionType: "revoke",
    targetType: "license",
    targetId: context.license.licenseId,
    licenseId: context.license.id,
    payloadJson: {
      revoked_at: revokedAt,
      revoke_reason: input.reason?.trim() || null,
      notify_customer: notifyCustomer,
      notification_mode: null,
    },
  });

  let notification = null;
  let notificationError = null;
  if (notifyCustomer) {
    const result = await attemptNotification({
      db: input.db,
      actorEmail: input.actorEmail,
      actionType: "revoke",
      parentLicenseId: context.license.licenseId,
      licenseRecordId: context.license.id,
      send: () =>
        sendLicenseStatusEmail({
          to: context.customer.email,
          subject: `License ${context.license.licenseId} revoked`,
          message: `License ${context.license.licenseId} has been revoked.${input.reason ? ` Reason: ${input.reason}` : ""}`,
          licenseId: context.license.licenseId,
          actionLabel: "revoke",
        }),
    });
    notification = result.notification;
    notificationError = result.notificationError;
  }

  return {
    license: updatedLicense,
    action,
    notification,
    notificationError,
  };
}

async function replaceLicenseByAdmin(input: {
  db: LicenseHubDb;
  actorEmail: string;
  licenseId: string;
  actionType: "extend" | "supersede";
  nextNotAfter: string;
  nextEdition?: string;
  reason?: string;
  notifyCustomer?: boolean | string;
}) {
  const context = await getLicenseContext(input.db, input.licenseId);
  requireActiveLicense(context.license);

  const nextEdition = resolveReplacementEdition(input.nextEdition, context.license.edition);
  const nextNotAfter = requireIsoTimestamp(input.nextNotAfter, "notAfter");
  const replacement = createReplacementSignedLicense({
    customer: context.customer,
    order: context.order,
    nextEdition,
    nextNotAfter,
  });

  const replacementRecord = await input.db.createLicense({
    licenseId: replacement.signedLicense.license_id,
    schemaVersion: replacement.signedLicense.version,
    keyId: replacement.signedLicense.issuer.key_id,
    edition: replacement.signedLicense.edition,
    status: replacement.signedLicense.status,
    subjectEmail: replacement.signedLicense.subject.email,
    issuedAt: replacement.signedLicense.issued_at,
    notBefore: replacement.signedLicense.not_before,
    notAfter: replacement.signedLicense.not_after,
    revokedAt: null,
    revokeReason: null,
    payloadJson: replacement.payload,
    signedLicenseJson: replacement.signedLicense,
    signatureBase64: replacement.signedLicense.signature.sig,
    customerId: context.customer.id,
    orderId: context.order.id,
    supersedesLicenseId: context.license.id,
    supersededAt: null,
  });

  const supersededAt = replacement.signedLicense.issued_at;
  const previousLicense = await input.db.updateLicense(context.license.id, {
    status: "superseded",
    supersededAt,
  });

  const notifyCustomer = normalizeNotifyCustomer(input.notifyCustomer);

  const action = await input.db.createAdminAction({
    actorEmail: input.actorEmail,
    actionType: input.actionType,
    targetType: "license",
    targetId: context.license.licenseId,
    licenseId: context.license.id,
    payloadJson: {
      reason: input.reason?.trim() || null,
      previous_license_id: context.license.licenseId,
      replacement_license_id: replacementRecord.licenseId,
      previous_status: previousLicense.status,
      replacement_status: replacementRecord.status,
      next_not_after: replacementRecord.notAfter,
      next_edition: replacementRecord.edition,
      notify_customer: notifyCustomer,
      notification_mode: null,
    },
  });

  let notification = null;
  let notificationError = null;
  if (notifyCustomer) {
    const result = await attemptNotification({
      db: input.db,
      actorEmail: input.actorEmail,
      actionType: input.actionType,
      parentLicenseId: context.license.licenseId,
      licenseRecordId: context.license.id,
      send: () =>
        sendSignedLicenseEmail({
          to: context.customer.email,
          licenseId: replacementRecord.licenseId,
          signedLicenseJson: replacementRecord.signedLicenseJson,
          actionLabel: input.actionType === "extend" ? "License extension" : "License replacement",
        }),
    });
    notification = result.notification;
    notificationError = result.notificationError;
  }

  return {
    previousLicense,
    replacementLicense: replacementRecord,
    action,
    notification,
    notificationError,
  };
}

export async function extendLicenseByAdmin(input: {
  db: LicenseHubDb;
  actorEmail: string;
  licenseId: string;
  notAfter: string;
  reason?: string;
  notifyCustomer?: boolean | string;
}) {
  return replaceLicenseByAdmin({
    db: input.db,
    actorEmail: input.actorEmail,
    licenseId: input.licenseId,
    actionType: "extend",
    nextNotAfter: input.notAfter,
    reason: input.reason,
    notifyCustomer: input.notifyCustomer,
  });
}

export async function supersedeLicenseByAdmin(input: {
  db: LicenseHubDb;
  actorEmail: string;
  licenseId: string;
  notAfter: string;
  edition?: string;
  reason?: string;
  notifyCustomer?: boolean | string;
}) {
  return replaceLicenseByAdmin({
    db: input.db,
    actorEmail: input.actorEmail,
    licenseId: input.licenseId,
    actionType: "supersede",
    nextNotAfter: input.notAfter,
    nextEdition: input.edition,
    reason: input.reason,
    notifyCustomer: input.notifyCustomer,
  });
}
