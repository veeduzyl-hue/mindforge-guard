import fs from "node:fs";
import path from "node:path";
import { normalizeEdition } from "./edition.mjs";
import { verifyLicenseV2 } from "./license_verify.mjs";

/**
 * Phase 2 behavior (offline-first, hardened):
 * - Missing license => community (ok:true)
 * - v1 license => tolerated (no signature) for backward compatibility
 * - v2 license => MUST verify (ed25519 + time window)
 * - Invalid/expired/not_yet_valid => downgrade to community (ok:false)
 *
 * This preserves DS-EXIT-001 and exit contract invariance.
 */

export function loadGuardEditionFromLocalLicense(opts = {}) {
  const cwd = opts.cwd || process.cwd();
  const licenseRelPath =
    opts.licenseRelPath || path.join(".mindforge", "license.json");
  const licensePath = path.join(cwd, licenseRelPath);

  if (!fs.existsSync(licensePath)) {
    return { ok: true, edition: "community", source: "default_community", status: "missing" };
  }

  let doc;
  try {
    const txt = fs.readFileSync(licensePath, "utf-8");
    doc = JSON.parse(txt);
  } catch (e) {
    return {
      ok: false,
      edition: "community",
      source: "invalid_license_fallback",
      status: "invalid",
      reason: `license parse error: ${e?.message || String(e)}`
    };
  }

  // v2: hardened verification
  if (doc && typeof doc === "object" && doc.version === 2) {
    const res = verifyLicenseV2(doc);
    if (!res.ok) {
      return {
        ok: false,
        edition: "community",
        source: "invalid_license_fallback",
        status: res.status || "invalid",
        reason: res.reason || "license v2 invalid"
      };
    }
    return {
      ok: true,
      edition: res.edition,
      source: "license_file",
      status: "valid",
      key_id: res.key_id,
      license_id: res.license_id
    };
  }

  // v1: backward compatible (no signature enforcement)
  if (doc && typeof doc === "object" && doc.version === 1) {
    const edition = normalizeEdition(doc.edition);
    return { ok: true, edition, source: "license_file", status: "valid_v1" };
  }

  // unknown version -> downgrade
  return {
    ok: false,
    edition: "community",
    source: "invalid_license_fallback",
    status: "invalid",
    reason: "unknown license version"
  };
}
