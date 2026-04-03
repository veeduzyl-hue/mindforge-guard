import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

function expect(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function createHubSignedLicense({ privateKey, keyId, canonicalJSONStringify, status = "active", edition = "pro" }) {
  const payload = {
    version: 1,
    license_id: "lic_phase5_test",
    customer_id: "cus_phase5_test",
    order_id: "ord_phase5_test",
    subject: { email: "buyer@example.com" },
    edition,
    issued_at: "2026-04-03T00:00:00.000Z",
    not_before: "2026-04-03T00:00:00.000Z",
    not_after: "2027-04-03T00:00:00.000Z",
    status,
    entitlements: {
      analytics: {
        drift_timeline: true,
        drift_compare: edition === "pro_plus" || edition === "enterprise",
        assoc_correlate: edition === "pro_plus" || edition === "enterprise",
      },
    },
    issuer: {
      name: "MindForge Licensing Authority",
      key_id: keyId,
    },
  };

  const signature = crypto.sign(
    null,
    Buffer.from(canonicalJSONStringify(payload), "utf8"),
    privateKey
  );

  return {
    ...payload,
    signature: {
      alg: "ed25519",
      sig: signature.toString("base64"),
    },
  };
}

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mf-guard-phase5-"));
process.env.HOME = tempRoot;
process.env.USERPROFILE = tempRoot;

const [{ canonicalJSONStringify }, { LICENSE_KEYSET }, { readLicenseFile }, { verifyLicenseDocument }, { runGuard }] =
  await Promise.all([
    import("../packages/guard/src/product/canonical_json.mjs"),
    import("../packages/guard/src/product/license_keyset.mjs"),
    import("../packages/guard/src/product/license.mjs"),
    import("../packages/guard/src/product/license_verify.mjs"),
    import("../packages/guard/src/runGuard.mjs"),
  ]);

const invalidFile = path.join(tempRoot, "invalid-license.json");
fs.writeFileSync(invalidFile, "{invalid-json", "utf8");

const helpResult = await runGuard({ argv: ["--help"] });
expect(helpResult.exitCode === 0, "guard --help should succeed");
expect(helpResult.stdout.includes("guard license verify --file <file>"), "help should document license verify");
expect(helpResult.stdout.includes("guard license install --file <file>"), "help should document install --file");

const missingStatus = await runGuard({ argv: ["license", "status"] });
expect(missingStatus.exitCode === 0, "license status without installed license should succeed");
expect(missingStatus.stdout.includes("license: missing"), "missing license status should be surfaced");
expect(missingStatus.stdout.includes("path:"), "license status should include install path");
expect(missingStatus.stdout.includes("next:"), "license status should include next-step guidance");

const overallStatus = await runGuard({ argv: ["status"] });
expect(overallStatus.exitCode === 0, "guard status should succeed without a license");
expect(overallStatus.stdout.includes("License:"), "guard status should include license section");
expect(overallStatus.stdout.includes("path:"), "guard status should include license path");

const verifyInvalid = await runGuard({ argv: ["license", "verify", "--file", invalidFile] });
expect(verifyInvalid.exitCode === 30, "verifying an invalid license file should exit 30");
expect(verifyInvalid.stdout.includes("\"install_path\""), "verify output should include install_path");
expect(verifyInvalid.stdout.includes("\"next_step\""), "verify output should include next_step guidance");

const installInvalid = await runGuard({ argv: ["license", "install", "--file", invalidFile] });
expect(installInvalid.exitCode === 30, "installing an invalid license file should exit 30");
expect(installInvalid.stdout.includes("\"license_install_invalid\""), "install invalid should surface license_install_invalid");
expect(installInvalid.stdout.includes("\"install_path\""), "install invalid should include install path");

const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519");
const keyId = "phase5_test_key";
LICENSE_KEYSET[keyId] = {
  publicKey: publicKey.export({ type: "spki", format: "pem" }).toString(),
};

const hubDoc = createHubSignedLicense({ privateKey, keyId, canonicalJSONStringify, status: "active", edition: "pro" });
const hubVerify = verifyLicenseDocument(hubDoc);
expect(hubVerify.ok === true, "guard should verify hub-signed licenses");
expect(hubVerify.edition === "pro", "verified hub license should preserve edition");

const hubFile = path.join(tempRoot, "hub-license.json");
fs.writeFileSync(hubFile, JSON.stringify(hubDoc, null, 2) + "\n", "utf8");
const hubRead = readLicenseFile(hubFile);
expect(hubRead.kind === "ok", "readLicenseFile should accept hub-signed license files");
expect(hubRead.license_id === "lic_phase5_test", "readLicenseFile should surface hub license id");

const revokedHubDoc = createHubSignedLicense({ privateKey, keyId, canonicalJSONStringify, status: "revoked", edition: "pro" });
const revokedVerify = verifyLicenseDocument(revokedHubDoc);
expect(revokedVerify.ok === false, "revoked hub license should not verify as ok");
expect(revokedVerify.status === "revoked", "revoked hub license should surface revoked status");

process.stdout.write("guard cli activation ux phase5 verified\n");
