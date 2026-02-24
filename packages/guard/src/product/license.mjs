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

// Legacy v1: expiry is YYYY-MM-DD (manual keys).
function isExpiredYMD(expiryYMD) {
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
    if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(expiry)) return null;
  }

  return { edition, expiry, key };
}

function pickString(obj, keys) {
  for (const k of keys) {
    const v = obj && obj[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

function normalizeEdition(e) {
  if (e === "community" || e === "pro" || e === "pro+") return e;
  return null;
}

/**
 * Evaluate a license object's validity window.
 * Supports:
 * - v2 signed files: not_before / not_after (ISO-8601)
 * - legacy v1: expiry (YYYY-MM-DD)
 *
 * Returns:
 *  { kind: "ok" | "expired" | "not_yet_valid" | "invalid", reason?, not_before?, not_after?, expiry? }
 */
function evalValidityWindow(obj) {
  const not_before = pickString(obj, ["not_before", "notBefore", "nbf"]);
  const not_after = pickString(obj, ["not_after", "notAfter", "exp"]);
  const expiry = pickString(obj, ["expiry", "expires", "expiry_ymd", "expiryYMD"]);

  // Prefer v2 ISO window if present.
  if (not_before || not_after) {
    const nb = not_before ? Date.parse(not_before) : null;
    const na = not_after ? Date.parse(not_after) : null;

    if (not_before && Number.isNaN(nb)) {
      return { kind: "invalid", reason: "invalid not_before", not_before, not_after: not_after || null, expiry: null };
    }
    if (not_after && Number.isNaN(na)) {
      return { kind: "invalid", reason: "invalid not_after", not_before: not_before || null, not_after, expiry: null };
    }

    const now = Date.now();
    if (nb != null && now < nb) {
      return { kind: "not_yet_valid", reason: "license not active yet", not_before: not_before || null, not_after: not_after || null, expiry: null };
    }
    if (na != null && now > na) {
      return { kind: "expired", reason: "license expired", not_before: not_before || null, not_after: not_after || null, expiry: null };
    }

    return { kind: "ok", not_before: not_before || null, not_after: not_after || null, expiry: null };
  }

  // Fallback: legacy expiry fields (either stored as expiry, or written by manual key flow).
  const legacyExpiry = expiry || (typeof obj?.expiry === "string" ? obj.expiry : null);
  const expired = isExpiredYMD(legacyExpiry);
  return { kind: expired ? "expired" : "ok", reason: expired ? "license expired" : undefined, not_before: null, not_after: null, expiry: legacyExpiry || null };
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

    const edition = normalizeEdition(obj?.edition);
    if (!edition) {
      return { kind: "invalid", path: LICENSE_PATH, reason: "unknown edition" };
    }

    const w = evalValidityWindow(obj);
    if (w.kind === "invalid") {
      return { kind: "invalid", path: LICENSE_PATH, reason: w.reason || "invalid time window" };
    }

    return {
      kind: w.kind,
      path: LICENSE_PATH,
      edition,
      // legacy
      expiry: w.expiry,
      // v2 signed window
      not_before: w.not_before,
      not_after: w.not_after,
      // v2 identity fields (optional)
      key_id: typeof obj?.key_id === "string" ? obj.key_id : null,
      license_id: typeof obj?.license_id === "string" ? obj.license_id : null,
      // meta (optional)
      activated_at: typeof obj?.activated_at === "string" ? obj.activated_at : null,
      source: typeof obj?.source === "string" ? obj.source : null,
      key_hint: typeof obj?.key_hint === "string" ? obj.key_hint : null,
      v: typeof obj?.v === "number" ? obj.v : (typeof obj?.version === "number" ? obj.version : 1),
      reason: w.reason || null,
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
    // legacy expiry (YYYY-MM-DD)
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
  // Treat missing/invalid/expired/not_yet_valid as community (safe default for execution)
  return "community";
}

export function loadGuardLicenseFromLocalLicense() {
  // Some call sites may want the whole object
  return readLicense();
}

export function getGuardLocalLicensePath() {
  return LICENSE_PATH;
}

/** ---------- Optional helpers for CLI surfaces ---------- **/

/**
 * Install a license file (v2 signed json). This does NOT validate signature cryptographically
 * (that is handled elsewhere in Guard 1.0). It DOES validate:
 * - JSON parse
 * - edition
 * - validity window (not_before/not_after or legacy expiry)
 *
 * Returns: { ok, ... }
 */
export function installLicenseFile(filePath) {
  try {
    if (!filePath) return { ok: false, error: "missing_file" };
    if (!fs.existsSync(filePath)) return { ok: false, error: "file_not_found", path: filePath };

    const raw = fs.readFileSync(filePath, "utf8");
    const obj = JSON.parse(raw);

    const edition = normalizeEdition(obj?.edition);
    if (!edition) return { ok: false, error: "unknown_edition" };

    const w = evalValidityWindow(obj);
    if (w.kind !== "ok") {
      return { ok: false, error: "license_not_ok", state: w.kind, reason: w.reason || null };
    }

    ensureDir(LICENSE_DIR);

    // Persist as-is, but add minimal local metadata (non-security)
    const payload = {
      ...obj,
      activated_at: new Date().toISOString(),
      source: "file",
    };

    fs.writeFileSync(LICENSE_PATH, JSON.stringify(payload, null, 2) + "\n", "utf8");

    return {
      ok: true,
      path: LICENSE_PATH,
      edition,
      not_before: w.not_before,
      not_after: w.not_after,
      expiry: w.expiry,
      key_id: typeof obj?.key_id === "string" ? obj.key_id : null,
      license_id: typeof obj?.license_id === "string" ? obj.license_id : null,
    };
  } catch (err) {
    return { ok: false, error: "install_failed", reason: err?.message || String(err) };
  }
}

/**
 * Stable summary JSON for `guard license show`.
 */
export function showLicenseSummary() {
  const lic = readLicense();
  const tier = licenseTier(lic);
  return {
    kind: "license_summary",
    v: 1,
    path: lic?.path || LICENSE_PATH,
    state: lic?.kind || "unknown",
    edition: lic?.edition || "community",
    tier,
    not_before: lic?.not_before || null,
    not_after: lic?.not_after || null,
    expiry: lic?.expiry || null,
    key_id: lic?.key_id || null,
    license_id: lic?.license_id || null,
    reason: lic?.reason || null,
    generated_at: new Date().toISOString(),
  };
}
