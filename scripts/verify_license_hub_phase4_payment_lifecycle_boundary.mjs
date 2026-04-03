import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function expect(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

for (const relPath of [
  "apps/license-hub/app/api/webhooks/billing/route.ts",
  "apps/license-hub/lib/billingWebhook.ts",
  "apps/license-hub/lib/billingEvents.ts",
  "apps/license-hub/lib/paymentLifecycle.ts",
  "apps/license-hub/lib/systemActions.ts",
]) {
  expect(fs.existsSync(path.join(root, relPath)), `missing required phase4 file: ${relPath}`);
}

const schema = read("packages/db/prisma/schema.prisma");
expect(schema.includes("refunded"), "prisma schema should include refunded order status");
expect(schema.includes("refund_revoked"), "prisma schema should include refund_revoked license status");
expect(schema.includes("model SystemAction"), "prisma schema should include SystemAction model");
expect(schema.includes("externalPaymentId"), "prisma schema should persist external payment ids");

const dbClient = read("packages/db/src/client.ts");
for (const token of [
  "createSystemAction",
  "listSystemActionsByOrderId",
  "getOrderByExternalOrderId",
  "getOrderByExternalPaymentId",
  "updateOrder",
  "externalPaymentId",
  "refundedAt",
  "cancelledAt",
]) {
  expect(dbClient.includes(token), `db client missing ${token}`);
}

const billingWebhook = read("apps/license-hub/lib/billingWebhook.ts");
expect(billingWebhook.includes("verifyBillingSignature"), "billing webhook should verify signatures");
expect(billingWebhook.includes("getWebhookEvent"), "billing webhook should check event idempotency");
expect(billingWebhook.includes("createWebhookEvent"), "billing webhook should persist event ledger records");
expect(billingWebhook.includes("markWebhookEvent"), "billing webhook should mark processing outcome");

const lifecycle = read("apps/license-hub/lib/paymentLifecycle.ts");
expect(lifecycle.includes("issueLicenseForPaidOrder"), "payment lifecycle should reuse the issuance path");
expect(lifecycle.includes("findActiveLicenseByOrderId"), "payment lifecycle should avoid duplicate active licenses");
expect(lifecycle.includes("\"refund_revoked\""), "refund lifecycle should mark licenses as refund_revoked");
expect(lifecycle.includes("\"payment_succeeded_replayed\""), "payment success replays should be auditable");
expect(lifecycle.includes("recordSystemAction"), "payment lifecycle should write system actions");

const envExample = read("apps/license-hub/.env.example");
for (const token of [
  "BILLING_PROVIDER",
  "BILLING_WEBHOOK_SECRET",
  "BILLING_SIGNATURE_HEADER",
  "BILLING_ALLOW_UNSIGNED_DEV",
]) {
  expect(envExample.includes(token), `.env.example missing ${token}`);
}

const readme = read("apps/license-hub/README.md");
expect(readme.includes("/api/webhooks/billing"), "README should document billing webhook route");
expect(readme.includes("system_actions"), "README should document system actions");

const rootPackageJson = read("package.json");
expect(
  rootPackageJson.includes("\"verify:license-hub-phase4\""),
  "package.json should include verify:license-hub-phase4"
);

process.stdout.write("license hub phase4 payment lifecycle boundary verified\n");
