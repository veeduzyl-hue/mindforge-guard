import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

for (const relPath of [
  "apps/license-hub/app/login/page.tsx",
  "apps/license-hub/app/portal/page.tsx",
  "apps/license-hub/app/portal/licenses/page.tsx",
  "apps/license-hub/app/portal/licenses/[licenseId]/page.tsx",
  "apps/license-hub/app/api/auth/request-magic-link/route.ts",
  "apps/license-hub/app/api/auth/verify-magic-link/route.ts",
  "apps/license-hub/app/api/auth/logout/route.ts",
  "apps/license-hub/app/api/portal/me/route.ts",
  "apps/license-hub/app/api/portal/licenses/route.ts",
  "apps/license-hub/app/api/portal/licenses/[licenseId]/route.ts",
  "apps/license-hub/app/api/portal/licenses/[licenseId]/download/route.ts",
  "apps/license-hub/lib/magicLink.ts",
  "apps/license-hub/lib/session.ts",
  "apps/license-hub/lib/auth.ts",
  "apps/license-hub/lib/mailer.ts",
]) {
  expect(fs.existsSync(path.join(root, relPath)), `missing required phase2 file: ${relPath}`);
}

const dbClient = read("packages/db/src/client.ts");
for (const tokenMethod of [
  "createMagicLinkToken",
  "getMagicLinkTokenByHash",
  "consumeMagicLinkToken",
  "listLicensesByCustomerEmail",
  "getLicenseByLicenseIdForEmail",
]) {
  expect(dbClient.includes(tokenMethod), `db client missing ${tokenMethod}`);
}

const magicLinkLib = read("apps/license-hub/lib/magicLink.ts");
expect(magicLinkLib.includes("crypto.randomBytes"), "magic link tokens should use secure randomness");
expect(magicLinkLib.includes("sha256"), "magic link flow should hash tokens before storage");

const sessionLib = read("apps/license-hub/lib/session.ts");
expect(sessionLib.includes("httpOnly: true"), "session cookie should be httpOnly");
expect(sessionLib.includes("sameSite: \"lax\""), "session cookie should use SameSite=lax");

const detailApi = read("apps/license-hub/app/api/portal/licenses/[licenseId]/route.ts");
expect(detailApi.includes("getLicenseByLicenseIdForEmail"), "detail API should enforce ownership");

const downloadApi = read("apps/license-hub/app/api/portal/licenses/[licenseId]/download/route.ts");
expect(downloadApi.includes("Content-Disposition"), "download API should return attachment content");

process.stdout.write("license hub phase2 boundary verified\n");
