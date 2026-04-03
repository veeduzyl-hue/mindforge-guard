import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { verifyLicenseDocument } from "./license_verify.mjs";
import { normalizeEdition } from "./edition.mjs";

// Cross-platform user-level storage:
// Windows: C:\Users\<you>\.guard\license.json
// macOS/Linux: /Users/<you>/.guard/license.json
const LICENSE_DIR = path.join(os.homedir(), ".guard");
const LICENSE_PATH = path.join(LICENSE_DIR, "license.json");

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function parseIsoMs(s) {
  if (typeof s !== "string" || !s.trim()) return null;
  const ms = Date.parse(s);
  return Number.isNaN(ms) ? NaN : ms;
}

export function getLicensePath() {
  return LICENSE_PATH;
}

export function buildLicensePortalHint() {
  return "Download your signed license JSON from License Hub, then run: guard license install --file <path>";
}

function buildLicenseState(result) {
  const state = result?.status || result?.kind || "invalid";
  if (state === "valid") return "ok";
  return state;
}

function buildLicenseResultFromDoc(doc, filePath) {
  const verification = verifyLicenseDocument(doc);
  const edition = normalizeEdition(doc?.edition || verification.edition || "community");
  const notBefore = doc?.not_before || null;
  const notAfter = doc?.not_after || doc?.expiry || null;
  const keyId = doc?.key_id || doc?.issuer?.key_id || verification.key_id || null;
  const licenseId = doc?.license_id || verification.license_id || null;
  const pathValue = filePath || LICENSE_PATH;

  if (!verification.ok) {
    return {
      kind: buildLicenseState(verification),
      path: pathValue,
      edition,
      not_before: notBefore,
      not_after: notAfter,
      key_id: keyId,
      license_id: licenseId,
      reason: verification.reason || "license verification failed",
    };
  }

  return {
    kind: "ok",
    path: pathValue,
    version: doc?.version ?? null,
    product: doc?.product ?? null,
    license_id: licenseId,
    key_id: keyId,
    edition,
    not_before: notBefore,
    not_after: notAfter,
  };
}

export function readLicenseFile(filePath) {
  const resolvedPath = filePath || LICENSE_PATH;
  try {
    if (!fs.existsSync(resolvedPath)) {
      return { kind: "missing", path: resolvedPath };
    }

    const raw = fs.readFileSync(resolvedPath, "utf8");
    const doc = JSON.parse(raw);
    return buildLicenseResultFromDoc(doc, resolvedPath);
  } catch (err) {
    return { kind: "invalid", path: resolvedPath, reason: err?.message || "parse error" };
  }
}

/**
 * Read and validate local license file.
 *
 * Returns:
 *  - { kind:"missing", path }
 *  - { kind:"invalid", path, reason }
 *  - { kind:"not_yet_valid", path, edition, not_before, not_after }
 *  - { kind:"expired", path, edition, not_before, not_after }
 *  - { kind:"ok", path, edition, not_before, not_after, key_id, license_id, product, version }
 */
export function readLicense() {
  return readLicenseFile(LICENSE_PATH);
}

export function removeLicense() {
  try {
    if (!fs.existsSync(LICENSE_PATH)) {
      return { ok: true, removed: false, path: LICENSE_PATH };
    }
    fs.unlinkSync(LICENSE_PATH);
    return { ok: true, removed: true, path: LICENSE_PATH };
  } catch (err) {
    return { ok: false, error: err?.message || String(err), path: LICENSE_PATH };
  }
}

/**
 * Convert a readLicense() result into a numeric tier.
 * 0: community, 1: pro, 2: pro+
 */
export function licenseTier(lic) {
  if (!lic || lic.kind !== "ok") return 0;
  const edition = normalizeEdition(lic?.edition || "community");
  if (edition === "enterprise") return 3;
  if (edition === "pro_plus") return 2;
  if (edition === "pro") return 1;
  return 0;
}

/**
 * Optional helper used by some surfaces.
 */
export function showLicenseSummary() {
  const lic = readLicense();
  if (!lic || lic.kind === "missing") return { state: "missing", path: LICENSE_PATH };
  if (lic.kind === "invalid") return { state: "invalid", path: LICENSE_PATH, reason: lic.reason };
  if (lic.kind === "expired") return { state: "expired", path: LICENSE_PATH, edition: lic.edition, not_after: lic.not_after };
  if (lic.kind === "not_yet_valid") return { state: "not_yet_valid", path: LICENSE_PATH, edition: lic.edition, not_before: lic.not_before };
  if (lic.kind === "revoked") return { state: "revoked", path: LICENSE_PATH, edition: lic.edition, reason: lic.reason };
  if (lic.kind === "superseded") return { state: "superseded", path: LICENSE_PATH, edition: lic.edition, reason: lic.reason };
  return {
    state: "ok",
    path: LICENSE_PATH,
    edition: lic.edition,
    not_before: lic.not_before,
    not_after: lic.not_after,
    key_id: lic.key_id,
    license_id: lic.license_id,
  };
}

/**
 * Install a license file (v2 signed json) from raw object.
 * This DOES validate cryptographically & time window (via readLicense()).
 */
export function installLicenseObject(doc) {
  ensureDir(LICENSE_DIR);
  fs.writeFileSync(LICENSE_PATH, JSON.stringify(doc, null, 2) + "\n", "utf8");
  const lic = readLicense();
  return lic;
}

export function loadGuardEditionFromLocalLicense() {
  const lic = readLicense();
  if (!lic || lic.kind === "missing") {
    return { edition: "community", status: "missing", key_id: null, license_id: null };
  }
  if (lic.kind === "ok") {
    return {
      edition: normalizeEdition(lic.edition),
      status: "valid",
      key_id: lic.key_id ?? null,
      license_id: lic.license_id ?? null,
    };
  }
  return {
    edition: "community",
    status: lic.kind,
    key_id: lic.key_id ?? null,
    license_id: lic.license_id ?? null,
  };
}
