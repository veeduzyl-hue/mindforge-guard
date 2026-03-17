import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { verifyLicenseV2 } from "./license_verify.mjs";
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
  try {
    if (!fs.existsSync(LICENSE_PATH)) {
      return { kind: "missing", path: LICENSE_PATH };
    }

    const raw = fs.readFileSync(LICENSE_PATH, "utf8");
    const doc = JSON.parse(raw);

    // Normalize edition early for consistent reporting.
    doc.edition = normalizeEdition(doc?.edition);

    // Cryptographic verification (Ed25519 over canonical payload without signature)
    const vr = verifyLicenseV2(doc);
    if (!vr.ok) {
      return { kind: "invalid", path: LICENSE_PATH, reason: vr.reason || "signature verification failed" };
    }

    // Time window enforcement (v2: not_before / not_after)
    const nbRaw = doc?.not_before || null;
    const naRaw = doc?.not_after || doc?.expiry || null; // allow legacy alias
    const nb = parseIsoMs(nbRaw);
    const na = parseIsoMs(naRaw);

    if (nbRaw && Number.isNaN(nb)) {
      return { kind: "invalid", path: LICENSE_PATH, reason: "invalid not_before" };
    }
    if (naRaw && Number.isNaN(na)) {
      return { kind: "invalid", path: LICENSE_PATH, reason: "invalid not_after/expiry" };
    }

    const now = Date.now();
    if (nb != null && now < nb) {
      return {
        kind: "not_yet_valid",
        path: LICENSE_PATH,
        edition: doc.edition,
        not_before: nbRaw,
        not_after: naRaw,
      };
    }
    if (na != null && now > na) {
      return {
        kind: "expired",
        path: LICENSE_PATH,
        edition: doc.edition,
        not_before: nbRaw,
        not_after: naRaw,
      };
    }

    return {
      kind: "ok",
      path: LICENSE_PATH,
      version: doc?.version ?? null,
      product: doc?.product ?? null,
      license_id: doc?.license_id ?? null,
      key_id: doc?.key_id ?? null,
      edition: doc.edition,
      not_before: nbRaw,
      not_after: naRaw,
    };
  } catch (err) {
    return { kind: "invalid", path: LICENSE_PATH, reason: err?.message || "parse error" };
  }
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
