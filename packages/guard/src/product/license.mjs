import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Cross-platform user-level storage:
// Windows: C:\Users\<you>\.guard\license.json
// macOS/Linux: /Users/<you>/.guard/license.json
const LICENSE_DIR = path.join(os.homedir(), ".guard");
const LICENSE_PATH = path.join(LICENSE_DIR, "license.json");

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function todayYMD() {
  const d = new Date();
  const yyyy = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function isExpired(expiryYMD) {
  if (!expiryYMD) return false;
  // lexicographic compare works for YYYY-MM-DD
  return String(expiryYMD) < todayYMD();
}

function parseKey(keyRaw) {
  const key = String(keyRaw || "").trim();
  if (!key) return null;

  // Accepted examples:
  //   community
  //   pro
  //   pro+
  //   pro:2026-12-31
  //   pro+:2026-12-31
  const parts = key.split(":");
  const edition = parts[0];
  const expiry = parts[1] || null;

  if (!["community", "pro", "pro+"].includes(edition)) return null;

  if (expiry) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(expiry)) return null;
  }

  return { edition, expiry, key };
}

/** ---------- New API (used by CLI) ---------- **/

export function getLicensePath() {
  return LICENSE_PATH;
}

export function readLicense() {
  try {
    if (!fs.existsSync(LICENSE_PATH)) {
      return { kind: "missing", path: LICENSE_PATH };
    }

    const raw = fs.readFileSync(LICENSE_PATH, "utf8");
    const obj = JSON.parse(raw);

    const edition = obj?.edition;
    const expiry = obj?.expiry || null;

    if (!["community", "pro", "pro+"].includes(edition)) {
      return { kind: "invalid", path: LICENSE_PATH, reason: "unknown edition" };
    }

    const expired = isExpired(expiry);

    return {
      kind: expired ? "expired" : "ok",
      path: LICENSE_PATH,
      edition,
      expiry,
      activated_at: obj?.activated_at || null,
      source: obj?.source || null,
      key_hint: obj?.key_hint || null,
      v: obj?.v || 1,
    };
  } catch (err) {
    return { kind: "invalid", path: LICENSE_PATH, reason: err?.message || "parse error" };
  }
}

export function writeLicenseFromKey(keyRaw) {
  const parsed = parseKey(keyRaw);
  if (!parsed) {
    return { ok: false, error: "invalid_key_format" };
  }

  ensureDir(LICENSE_DIR);

  const payload = {
    v: 1,
    edition: parsed.edition,
    expiry: parsed.expiry,
    activated_at: new Date().toISOString(),
    source: "manual",
    // purely for support/debug; not a security feature
    key_hint: parsed.key.slice(0, 8),
  };

  fs.writeFileSync(LICENSE_PATH, JSON.stringify(payload, null, 2) + "\n", "utf8");
  return { ok: true, path: LICENSE_PATH, edition: parsed.edition, expiry: parsed.expiry };
}

export function removeLicense() {
  if (!fs.existsSync(LICENSE_PATH)) {
    return { ok: true, removed: false, path: LICENSE_PATH };
  }
  fs.unlinkSync(LICENSE_PATH);
  return { ok: true, removed: true, path: LICENSE_PATH };
}

/**
 * Convenience for gating:
 * - community: 0
 * - pro: 1
 * - pro+: 2
 */
export function licenseTier(license) {
  const edition = license?.edition || "community";
  if (edition === "pro+") return 2;
  if (edition === "pro") return 1;
  return 0;
}

/** ---------- Backward-compatible exports (do NOT remove) ----------
 * runAudit.mjs (and possibly others) in your repo already import these.
 * We keep them as thin wrappers over the new API.
 */

export function loadGuardEditionFromLocalLicense() {
  const lic = readLicense();
  if (lic.kind === "ok") return lic.edition;
  // Treat missing/invalid/expired as community (safe default for execution)
  return "community";
}

export function loadGuardLicenseFromLocalLicense() {
  // Some call sites may want the whole object
  return readLicense();
}

export function getGuardLocalLicensePath() {
  return LICENSE_PATH;
}