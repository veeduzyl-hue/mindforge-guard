import { canonicalJson } from "../../canonical_json.mjs";
import { sha256Hex } from "../../hash.mjs";

export function hashAction(action) {
  const copy = { ...action };
  delete copy.action_hash;
  return sha256Hex(canonicalJson(copy));
}