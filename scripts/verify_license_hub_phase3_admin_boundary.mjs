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
  "apps/license-hub/app/admin/page.tsx",
  "apps/license-hub/app/admin/licenses/page.tsx",
  "apps/license-hub/app/admin/licenses/[licenseId]/page.tsx",
  "apps/license-hub/app/admin/orders/page.tsx",
  "apps/license-hub/app/admin/customers/page.tsx",
  "apps/license-hub/app/api/admin/me/route.ts",
  "apps/license-hub/app/api/admin/licenses/route.ts",
  "apps/license-hub/app/api/admin/licenses/[licenseId]/route.ts",
  "apps/license-hub/app/api/admin/licenses/[licenseId]/resend/route.ts",
  "apps/license-hub/app/api/admin/licenses/[licenseId]/revoke/route.ts",
  "apps/license-hub/app/api/admin/licenses/[licenseId]/extend/route.ts",
  "apps/license-hub/app/api/admin/licenses/[licenseId]/supersede/route.ts",
  "apps/license-hub/app/api/admin/orders/route.ts",
  "apps/license-hub/app/api/admin/customers/route.ts",
  "apps/license-hub/lib/adminAuth.ts",
  "apps/license-hub/lib/adminActions.ts",
]) {
  expect(fs.existsSync(path.join(root, relPath)), `missing required phase3 file: ${relPath}`);
}

const envExample = read("apps/license-hub/.env.example");
expect(envExample.includes("LICENSE_HUB_ADMIN_EMAILS"), ".env.example should define LICENSE_HUB_ADMIN_EMAILS");
expect(
  envExample.includes("ALLOW_DEV_MAGIC_LINK_IN_PRODUCTION"),
  ".env.example should define ALLOW_DEV_MAGIC_LINK_IN_PRODUCTION"
);

const schema = read("packages/db/prisma/schema.prisma");
expect(schema.includes("revokedAt"), "prisma schema should include revokedAt on License");
expect(schema.includes("revokeReason"), "prisma schema should include revokeReason on License");

const dbClient = read("packages/db/src/client.ts");
for (const token of [
  "listCustomers",
  "listOrders",
  "listLicenses",
  "getLicenseByLicenseId",
  "updateLicense",
  "createAdminAction",
  "listAdminActionsByLicenseId",
  "revokedAt",
  "revokeReason",
]) {
  expect(dbClient.includes(token), `db client missing ${token}`);
}

const adminAuth = read("apps/license-hub/lib/adminAuth.ts");
expect(adminAuth.includes("LICENSE_HUB_ADMIN_EMAILS"), "admin auth should use LICENSE_HUB_ADMIN_EMAILS");
expect(adminAuth.includes("isAdminEmail"), "admin auth should expose isAdminEmail");

const adminActions = read("apps/license-hub/lib/adminActions.ts");
for (const token of [
  "resendLicenseByAdmin",
  "revokeLicenseByAdmin",
  "extendLicenseByAdmin",
  "supersedeLicenseByAdmin",
  "createAdminAction",
  "status: \"superseded\"",
  "status: \"revoked\"",
]) {
  expect(adminActions.includes(token), `admin actions missing ${token}`);
}

const mailer = read("apps/license-hub/lib/mailer.ts");
expect(
  mailer.includes("ALLOW_DEV_MAGIC_LINK_IN_PRODUCTION"),
  "mailer should guard production dev mode with ALLOW_DEV_MAGIC_LINK_IN_PRODUCTION"
);
expect(
  mailer.includes("production requires explicit MAGIC_LINK_MAIL_MODE"),
  "mailer should fail closed when production mail mode is implicit"
);

const session = read("apps/license-hub/lib/session.ts");
expect(
  session.includes("production requires LICENSE_HUB_SESSION_SECRET"),
  "session should require LICENSE_HUB_SESSION_SECRET in production"
);
expect(
  !session.includes("process.env.LICENSE_PRIVATE_KEY_PEM ||"),
  "session should not fall back to LICENSE_PRIVATE_KEY_PEM"
);

const requestMagicLinkRoute = read("apps/license-hub/app/api/auth/request-magic-link/route.ts");
expect(
  requestMagicLinkRoute.includes("result.delivery.devMagicLink"),
  "magic link route should only expose devMagicLink when delivery returned it"
);

process.stdout.write("license hub phase3 admin boundary verified\n");
