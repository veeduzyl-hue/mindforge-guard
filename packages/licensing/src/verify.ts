import crypto from "node:crypto";

import { canonicalizeJson } from "./canonicalize";
import { SignedLicensePayload, validateLicensePayloadShape } from "./schema";

function normalizePublicKeyPem(publicKeyPem: string): string {
  return publicKeyPem.replace(/\r\n/g, "\n").trimEnd() + "\n";
}

export function verifyLicensePayload(
  signedLicense: SignedLicensePayload,
  publicKeyPem: string
): { ok: boolean; reason?: string } {
  const { signature, ...unsignedPayload } = signedLicense;
  const validation = validateLicensePayloadShape(unsignedPayload);
  if (!validation.ok) {
    return {
      ok: false,
      reason: `invalid payload shape: ${validation.errors.join("; ")}`,
    };
  }

  if (signature?.alg !== "ed25519") {
    return {
      ok: false,
      reason: "signature.alg must equal ed25519",
    };
  }

  if (!signature?.sig) {
    return {
      ok: false,
      reason: "signature.sig is required",
    };
  }

  try {
    const verified = crypto.verify(
      null,
      Buffer.from(canonicalizeJson(unsignedPayload), "utf8"),
      normalizePublicKeyPem(publicKeyPem),
      Buffer.from(signature.sig, "base64")
    );

    return verified
      ? { ok: true }
      : {
          ok: false,
          reason: "signature verification failed",
        };
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? error.message : String(error),
    };
  }
}
