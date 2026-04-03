import type { LicenseHubDb } from "@mindforge/db";

export async function recordSystemAction(input: {
  db: LicenseHubDb;
  source: string;
  actionType: string;
  targetType: string;
  targetId: string;
  payloadJson: unknown;
  orderId?: string | null;
  licenseId?: string | null;
  webhookEventId?: string | null;
}) {
  return input.db.createSystemAction({
    source: input.source,
    actionType: input.actionType,
    targetType: input.targetType,
    targetId: input.targetId,
    payloadJson: input.payloadJson,
    orderId: input.orderId ?? null,
    licenseId: input.licenseId ?? null,
    webhookEventId: input.webhookEventId ?? null,
  });
}
