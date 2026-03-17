import { createHash } from "node:crypto";

import { canonicalJSONStringify } from "../../product/canonical_json.mjs";

export function hashAction(action) {
  const copy = { ...action };
  delete copy.canonical_action_hash;
  return `sha256:${createHash("sha256").update(canonicalJSONStringify(copy), "utf8").digest("hex")}`;
}
