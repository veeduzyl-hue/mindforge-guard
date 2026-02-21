import crypto from "node:crypto";
import { canonicalJSONStringify } from "./canonical_json.mjs";
import { LICENSE_KEYSET } from "./license_keyset.mjs";
import { normalizeEdition } from "./edition.mjs";

/**
 * Base64url decode (RFC 4648 URL-safe, no padding required)
 */
function base64urlToBuffer(s) {
  if (typeof s !== "string") return null;
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  try {
    return Buffer.from(b64, "base64");
  } catch {
    return null;
  }
}

function parseIsoDate(s) {
  if (!s || typeof s !== "string") return null;
  const t = Date.parse(s);
  if (!Number.isFinite(t)) return null;
  return new Date(t);
}

function nowUtc() {
  return new Date();
}

/**
 * Normalize PEM for OpenSSL 3 strict decoder
 */
function normalizePem(pem) {
  if (typeof pem !== "string") return null;

  const cleaned = pem.replace(/\r\n/g, "\n").trim();

  if (!cleaned.includes("BEGIN PUBLIC KEY")) return null;

  return cleaned.endsWith("\n") ? cleaned : cleaned + "\n";
}

/**
 * Resolve public key from LICENSE_KEYSET entry.
 * Backward compatible:
 * - old form: LICENSE_KEYSET[key_id] === "<pem string>"
 * - new form: LICENSE_KEYSET[key_id] === { publicKey: "<pem string>", ... }
 */
function resolvePublicKey(key_id) {
  const entry = LICENSE_KEYSET[key_id];
  if (!entry) return null;

  if (typeof entry === "string") return entry;
  if (typeof entry === "object" && entry !== null && typeof entry.publicKey === "string") {
    return entry.publicKey;
  }

  return null;
}

/**
 * V2 license verification:
 * - version must be 2
 * - key_id must exist in keyset
 * - signature must verify Ed25519 over canonical payload (license without signature)
 * - not_before/not_after must be valid and current time within window
 *
 * Returns:
 *  { ok:true, edition, key_id, license_id }
 *  { ok:false, edition:'community', reason, status }
 */
export function verifyLicenseV2(doc) {
  if (!doc || typeof doc !== "object") {
    return {
      ok: false,
      edition: "community",
      status: "invalid",
      reason: "license not an object",
    };
  }

  if (doc.version !== 2) {
    return {
      ok: false,
      edition: "community",
      status: "invalid",
      reason: "license version is not 2",
    };
  }

  const key_id = doc.key_id;
  if (typeof key_id !== "string" || !key_id) {
    return {
      ok: false,
      edition: "community",
      status: "invalid",
      reason: "missing key_id",
    };
  }

  const pubRaw = resolvePublicKey(key_id);
  const pub = normalizePem(pubRaw);

  if (!pub) {
    return {
      ok: false,
      edition: "community",
      status: "invalid",
      reason: `unknown or malformed key_id '${key_id}'`,
    };
  }

  const sigBuf = base64urlToBuffer(doc.signature);
  if (!sigBuf) {
    return {
      ok: false,
      edition: "community",
      status: "invalid",
      reason: "invalid signature encoding",
    };
  }

  // canonical payload = license without signature
  const { signature, ...payload } = doc;
  const msg = canonicalJSONStringify(payload);
  const msgBuf = Buffer.from(msg, "utf8");

  let verified = false;

  try {
    // Critical: createPublicKey for OpenSSL3 compatibility
    const keyObj = crypto.createPublicKey(pub);

    // For Ed25519 algorithm must be null
    verified = crypto.verify(null, msgBuf, keyObj, sigBuf);
  } catch (e) {
    return {
      ok: false,
      edition: "community",
      status: "invalid",
      reason: `crypto verify error: ${e?.message || String(e)}`,
    };
  }

  if (!verified) {
    return {
      ok: false,
      edition: "community",
      status: "invalid",
      reason: "signature verification failed",
    };
  }

  // ----- time window validation -----

  const nb = parseIsoDate(doc.not_before);
  const na = parseIsoDate(doc.not_after);
  const now = nowUtc();

  if (!nb || !na) {
    return {
      ok: false,
      edition: "community",
      status: "invalid",
      reason: "not_before/not_after must be valid ISO date strings",
    };
  }

  if (now < nb) {
    return {
      ok: false,
      edition: "community",
      status: "not_yet_valid",
      reason: "license not yet valid",
    };
  }

  if (now > na) {
    return {
      ok: false,
      edition: "community",
      status: "expired",
      reason: "license expired",
    };
  }

  const edition = normalizeEdition(doc.edition);

  return {
    ok: true,
    edition,
    status: "valid",
    key_id,
    license_id: typeof doc.license_id === "string" ? doc.license_id : undefined,
  };
}
