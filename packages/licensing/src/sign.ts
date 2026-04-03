import crypto from "node:crypto";

import { canonicalizeJson } from "./canonicalize";
import { SignedLicensePayload, UnsignedLicensePayload, validateLicensePayloadShape } from "./schema";

function normalizePrivateKeyPem(privateKeyPem: string): string {
  return privateKeyPem.replace(/\r\n/g, "\n").trimEnd() + "\n";
}

export function signLicensePayload(
  payload: UnsignedLicensePayload,
  privateKeyPem: string
): SignedLicensePayload {
  const validation = validateLicensePayloadShape(payload);
  if (!validation.ok) {
    throw new Error(`invalid license payload: ${validation.errors.join("; ")}`);
  }

  const message = canonicalizeJson(payload);
  const signature = crypto.sign(
    null,
    Buffer.from(message, "utf8"),
    normalizePrivateKeyPem(privateKeyPem)
  );

  return {
    ...payload,
    signature: {
      alg: "ed25519",
      sig: signature.toString("base64"),
    },
  };
}
