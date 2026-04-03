import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function expect(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function read(filePath) {
  return fs.readFileSync(path.join(root, filePath), "utf8");
}

const requiredFiles = [
  "apps/license-hub/package.json",
  "apps/license-hub/app/api/webhooks/mock-payment/route.ts",
  "apps/license-hub/lib/handleMockPaymentEvent.ts",
  "apps/license-hub/lib/issueLicenseForPaidOrder.ts",
  "apps/license-hub/.env.example",
  "apps/license-hub/README.md",
  "packages/db/package.json",
  "packages/db/prisma/schema.prisma",
  "packages/db/src/client.ts",
  "packages/licensing/package.json",
  "packages/licensing/src/canonicalize.ts",
  "packages/licensing/src/schema.ts",
  "packages/licensing/src/sign.ts",
  "packages/licensing/src/verify.ts",
  "packages/licensing/src/entitlements.ts",
];

for (const file of requiredFiles) {
  expect(fs.existsSync(path.join(root, file)), `missing required file: ${file}`);
}

const rootPackageJson = read("package.json");
expect(rootPackageJson.includes("\"apps/*\""), "root workspaces should include apps/*");

const prismaSchema = read("packages/db/prisma/schema.prisma");
for (const modelName of [
  "model Customer",
  "model Order",
  "model License",
  "model WebhookEvent",
  "model MagicLinkToken",
  "model AdminAction",
]) {
  expect(prismaSchema.includes(modelName), `prisma schema missing ${modelName}`);
}

const licensingSign = read("packages/licensing/src/sign.ts");
expect(licensingSign.includes("signLicensePayload"), "sign.ts should export signLicensePayload");

const licensingVerify = read("packages/licensing/src/verify.ts");
expect(
  licensingVerify.includes("verifyLicensePayload"),
  "verify.ts should export verifyLicensePayload"
);

const routeSource = read("apps/license-hub/app/api/webhooks/mock-payment/route.ts");
expect(routeSource.includes("export async function POST"), "mock webhook route must expose POST");

const handlerSource = read("apps/license-hub/lib/handleMockPaymentEvent.ts");
expect(
  handlerSource.includes("payment.succeeded") && handlerSource.includes("getLicenseHubDb"),
  "mock webhook handler should process payment.succeeded and use db access"
);

const issueSource = read("apps/license-hub/lib/issueLicenseForPaidOrder.ts");
expect(
  issueSource.includes("signLicensePayload") && issueSource.includes("verifyLicensePayload"),
  "issueLicenseForPaidOrder should sign and verify licenses"
);

process.stdout.write("license hub skeleton phase1 verified\n");
