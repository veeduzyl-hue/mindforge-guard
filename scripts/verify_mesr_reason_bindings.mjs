import assert from "node:assert/strict";
import { GUARD_REASON_CODES } from "../packages/guard-core/src/reasonCodes.ts";
import { MESR_REASON_CODE_BINDINGS, validateMesrReasonCodeBindings } from "../packages/guard-core/src/mesr/reasonCodeBindings.ts";

const validation = validateMesrReasonCodeBindings();
assert.equal(Object.values(GUARD_REASON_CODES).length, 56);
assert.equal(MESR_REASON_CODE_BINDINGS.length, 56);
assert.deepEqual(validation, {
  valid: true,
  current_reason_count: 56,
  mapped_count: 56,
  duplicates: [],
  orphan_mappings: [],
  missing_mappings: [],
  unresolved_semantic_ids: [],
  order_preserved: true,
});
assert.ok(MESR_REASON_CODE_BINDINGS.some((entry) => entry.domain_semantic_id !== null));
assert.ok(MESR_REASON_CODE_BINDINGS.every((entry) => entry.explicit_non_claims.length > 0));

console.log("PASS: MESR reason-code bindings 56/56 resolved with no duplicates or orphans");
