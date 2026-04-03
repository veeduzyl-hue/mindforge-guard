import {
  LicenseEdition,
  LicenseEntitlements,
  normalizeLicenseEdition,
  resolveEntitlementsForEdition,
} from "./entitlements";

export interface LicenseSubject {
  email: string;
}

export interface LicenseIssuer {
  name: string;
  key_id: string;
}

export interface LicenseSignatureEnvelope {
  alg: "ed25519";
  sig: string;
}

export type LicenseStatus = "active" | "superseded" | "revoked" | "expired";

export interface UnsignedLicensePayload {
  version: number;
  license_id: string;
  customer_id: string;
  order_id: string;
  subject: LicenseSubject;
  edition: LicenseEdition;
  issued_at: string;
  not_before: string;
  not_after: string;
  status: LicenseStatus;
  entitlements: LicenseEntitlements;
  issuer: LicenseIssuer;
}

export interface SignedLicensePayload extends UnsignedLicensePayload {
  signature: LicenseSignatureEnvelope;
}

export interface CreateUnsignedLicensePayloadInput {
  version?: number;
  license_id: string;
  customer_id: string;
  order_id: string;
  subject: LicenseSubject;
  edition: string;
  issued_at: string;
  not_before: string;
  not_after: string;
  status?: LicenseStatus;
  entitlements?: LicenseEntitlements;
  issuer: LicenseIssuer;
}

function isIsoTimestamp(value: string): boolean {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

export function validateLicensePayloadShape(payload: Partial<SignedLicensePayload>): {
  ok: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (typeof payload.version !== "number") errors.push("version must be a number");
  if (!payload.license_id) errors.push("license_id is required");
  if (!payload.customer_id) errors.push("customer_id is required");
  if (!payload.order_id) errors.push("order_id is required");
  if (!payload.subject?.email) errors.push("subject.email is required");
  if (!payload.issuer?.name) errors.push("issuer.name is required");
  if (!payload.issuer?.key_id) errors.push("issuer.key_id is required");
  if (!payload.edition) errors.push("edition is required");
  if (!payload.issued_at || !isIsoTimestamp(payload.issued_at)) errors.push("issued_at must be ISO");
  if (!payload.not_before || !isIsoTimestamp(payload.not_before)) errors.push("not_before must be ISO");
  if (!payload.not_after || !isIsoTimestamp(payload.not_after)) errors.push("not_after must be ISO");
  if (!payload.status) errors.push("status is required");
  if (!payload.entitlements) errors.push("entitlements are required");

  const notBefore = Date.parse(payload.not_before || "");
  const notAfter = Date.parse(payload.not_after || "");
  if (Number.isFinite(notBefore) && Number.isFinite(notAfter) && notBefore >= notAfter) {
    errors.push("not_before must be earlier than not_after");
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function createUnsignedLicensePayload(
  input: CreateUnsignedLicensePayloadInput
): UnsignedLicensePayload {
  return {
    version: input.version ?? 1,
    license_id: input.license_id,
    customer_id: input.customer_id,
    order_id: input.order_id,
    subject: input.subject,
    edition: normalizeLicenseEdition(input.edition),
    issued_at: input.issued_at,
    not_before: input.not_before,
    not_after: input.not_after,
    status: input.status ?? "active",
    entitlements: input.entitlements ?? resolveEntitlementsForEdition(input.edition),
    issuer: input.issuer,
  };
}
