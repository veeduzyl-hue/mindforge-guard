import crypto from "node:crypto";

import type { ActivationRecord, LicenseHubDb, LicenseRecord, OrganizationRecord } from "@mindforge/db";

export const ACTIVATION_SKELETON_NOTE =
  "Phase 6 online activation is optional skeleton-only. Guard CLI offline install/verify remains authoritative.";

export function newActivationId(): string {
  return `act_${crypto.randomUUID()}`;
}

export function newActivationNonce(): string {
  return crypto.randomBytes(16).toString("hex");
}

export async function createActivationSkeletonRequest(input: {
  db: LicenseHubDb;
  license: LicenseRecord;
  organization: OrganizationRecord | null;
  customerId: string | null;
  requestedByEmail: string;
  deviceFingerprint: string;
  machineName?: string | null;
}): Promise<ActivationRecord> {
  return input.db.createActivationRecord({
    activationId: newActivationId(),
    licenseId: input.license.id,
    organizationId: input.organization?.id ?? null,
    customerId: input.customerId,
    requestedByEmail: input.requestedByEmail,
    deviceFingerprint: input.deviceFingerprint,
    machineName: input.machineName ?? null,
    requestNonce: newActivationNonce(),
  });
}
