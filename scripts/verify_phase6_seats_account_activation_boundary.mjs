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
  "apps/license-hub/app/account/page.tsx",
  "apps/license-hub/app/account/orders/page.tsx",
  "apps/license-hub/app/account/licenses/page.tsx",
  "apps/license-hub/app/account/billing/page.tsx",
  "apps/license-hub/app/account/organization/page.tsx",
  "apps/license-hub/app/account/seats/page.tsx",
  "apps/license-hub/app/api/account/me/route.ts",
  "apps/license-hub/app/api/account/orders/route.ts",
  "apps/license-hub/app/api/account/licenses/route.ts",
  "apps/license-hub/app/api/account/billing/route.ts",
  "apps/license-hub/app/api/account/organization/route.ts",
  "apps/license-hub/app/api/account/seats/route.ts",
  "apps/license-hub/app/api/account/seats/assign/route.ts",
  "apps/license-hub/app/api/account/seats/unassign/route.ts",
  "apps/license-hub/app/api/activation/request/route.ts",
  "apps/license-hub/app/api/activation/confirm/route.ts",
  "apps/license-hub/app/api/activation/[activationId]/route.ts",
  "apps/license-hub/lib/account.ts",
  "apps/license-hub/lib/seats.ts",
  "apps/license-hub/lib/activation.ts",
  "docs/phase6-seats-account-activation.md",
];

for (const file of requiredFiles) {
  expect(fs.existsSync(path.join(root, file)), `missing required file: ${file}`);
}

const schema = read("packages/db/prisma/schema.prisma");
for (const modelName of [
  "model Organization",
  "model OrganizationMember",
  "model SeatEntitlement",
  "model SeatAssignment",
  "model ActivationRecord",
]) {
  expect(schema.includes(modelName), `phase 6 schema missing ${modelName}`);
}

const dbClient = read("packages/db/src/client.ts");
for (const contractName of [
  "ensureOrganizationForCustomer",
  "listSeatEntitlementsByOrganizationId",
  "assignSeat",
  "createActivationRecord",
  "confirmActivationRecord",
]) {
  expect(dbClient.includes(contractName), `db client missing ${contractName}`);
}

const accountReadme = read("apps/license-hub/README.md");
expect(accountReadme.includes("/account"), "license hub README should mention /account");
expect(accountReadme.includes("optional online activation protocol skeleton"), "README should explain activation skeleton");
expect(accountReadme.includes("/portal"), "README should keep portal surface present");

const phase6Doc = read("docs/phase6-seats-account-activation.md");
expect(phase6Doc.includes("Phase 6 should center on the **account / billing surface**"), "phase 6 doc should name the mainline");
expect(phase6Doc.includes("offline install / verify remain authoritative"), "phase 6 doc should preserve offline authority");
expect(phase6Doc.includes("Skeleton surface"), "phase 6 doc should distinguish skeleton scope");

const activationRequestRoute = read("apps/license-hub/app/api/activation/request/route.ts");
expect(activationRequestRoute.includes("offline_license_install_remains_authoritative"), "activation request should state offline authority");
expect(activationRequestRoute.includes("optional_skeleton"), "activation request should be skeleton-only");

const portalPage = read("apps/license-hub/app/portal/page.tsx");
expect(portalPage.includes("/account"), "portal should link to account surface");

const guardRun = read("packages/guard/src/runGuard.mjs");
expect(!guardRun.includes("license activate"), "phase 6 should not make CLI activation mandatory yet");

const rootPackage = read("package.json");
expect(rootPackage.includes("\"verify:phase6-seats-account-activation\""), "package.json should expose phase 6 verify");

process.stdout.write("phase6 seats account activation boundary verified\n");
