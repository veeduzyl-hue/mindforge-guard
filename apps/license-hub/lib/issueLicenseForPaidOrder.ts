import crypto from "node:crypto";

import type { CustomerRecord, LicenseHubDb, OrderRecord } from "@mindforge/db";
import {
  createUnsignedLicensePayload,
  resolveEntitlementsForEdition,
  signLicensePayload,
  verifyLicensePayload,
} from "@mindforge/licensing";

interface IssueLicenseForPaidOrderInput {
  db: LicenseHubDb;
  customer: CustomerRecord;
  order: OrderRecord;
  subjectEmail?: string;
  edition?: string;
  issuerName: string;
  keyId: string;
  privateKeyPem: string;
  publicKeyPem: string;
  notBefore?: string;
  notAfter?: string;
}

function buildWindow(input: Pick<IssueLicenseForPaidOrderInput, "notBefore" | "notAfter">) {
  const now = new Date();
  const notBefore = input.notBefore || now.toISOString();

  if (input.notAfter) {
    return {
      notBefore,
      notAfter: input.notAfter,
    };
  }

  const nextYear = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
  return {
    notBefore,
    notAfter: nextYear.toISOString(),
  };
}

export async function issueLicenseForPaidOrder(input: IssueLicenseForPaidOrderInput) {
  const existingActive = await input.db.findActiveLicenseByOrderId(input.order.id);
  if (existingActive) {
    return {
      idempotent: true,
      license: existingActive,
    };
  }

  const window = buildWindow(input);
  const subjectEmail = input.subjectEmail || input.customer.email;
  const edition = input.edition || input.order.edition;
  const payload = createUnsignedLicensePayload({
    version: 1,
    license_id: `lic_${crypto.randomUUID()}`,
    customer_id: input.customer.id,
    order_id: input.order.id,
    subject: {
      email: subjectEmail,
    },
    edition,
    issued_at: new Date().toISOString(),
    not_before: window.notBefore,
    not_after: window.notAfter,
    status: "active",
    entitlements: resolveEntitlementsForEdition(edition),
    issuer: {
      name: input.issuerName,
      key_id: input.keyId,
    },
  });

  const signedLicense = signLicensePayload(payload, input.privateKeyPem);
  const verification = verifyLicensePayload(signedLicense, input.publicKeyPem);
  if (!verification.ok) {
    throw new Error(`issued license failed verification: ${verification.reason}`);
  }

  const record = await input.db.createLicense({
    licenseId: signedLicense.license_id,
    schemaVersion: signedLicense.version,
    keyId: signedLicense.issuer.key_id,
    edition: signedLicense.edition,
    status: signedLicense.status,
    subjectEmail: signedLicense.subject.email,
    issuedAt: signedLicense.issued_at,
    notBefore: signedLicense.not_before,
    notAfter: signedLicense.not_after,
    revokedAt: null,
    revokeReason: null,
    payloadJson: payload,
    signedLicenseJson: signedLicense,
    signatureBase64: signedLicense.signature.sig,
    customerId: input.customer.id,
    orderId: input.order.id,
    supersedesLicenseId: null,
    supersededAt: null,
  });

  return {
    idempotent: false,
    license: record,
    signedLicense,
  };
}
