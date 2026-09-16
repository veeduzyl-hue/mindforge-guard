import assert from "node:assert/strict";
import { caseIds, readJson, frozenDir, digest } from "./b09-product-inputs.mjs";

export function expectations() {
  const oracle = readJson(frozenDir + "oracle.v0.2.json");
  const hardening = readJson(frozenDir + "admission-hardening.v0.1.json");
  return Object.fromEntries(caseIds.map(id => [id, id.startsWith("H")
    ? hardening.cases.find(row => row.case_id === id).expected : oracle.cases[id]]));
}
export function compare(row, result, expected) {
  assert.ok(expected, `Unmatched oracle: ${row.case_id}`);
  assert.equal(result.contract_version, "mesr-canonical-admission/0.1");
  assert.equal(result.semantic_composition, "WITHHELD");
  for (const key of ["semantic_entries", "mappings", "profiles", "claims"]) assert.deepEqual(result[key], []);
  const pending = row.case_id.startsWith("C") ? ["T1-04: complete semantic composition/noninterference"] : [];
  if (row.case_id === "C01") {
    assert.equal(expected.status, "VALID_COMPOSITION");
    assert.equal(result.status, "CHECKED_BASIS");
    assert.ok(result.checked_basis.modules.length > 0);
    assert.ok(result.checked_basis.admission_basis_refs[0].digest);
    assert.deepEqual(Object.keys(result.checked_basis).sort(), ["contract_version", "registry", "modules", "relation_ledger_ref", "admission_basis_refs", "validation_method", "input_set_id"].sort());
    assert.equal(result.checked_basis.contract_version, "mesr-composition-lock/0.1");
    assert.deepEqual(result.checked_basis.registry.version, row.input.registry.version);
    assert.deepEqual(result.checked_basis.registry.digest, row.input.registry.digest);
    assert.deepEqual(result.checked_basis.modules.map(m => m.module_id), row.input.modules.map(m => m.module_id));
    for (const checked of result.checked_basis.modules) {
      const locked = row.input.lock.find(m => m.module_id === checked.module_id);
      assert.equal(checked.byte_digest, locked.byte_digest);
      assert.equal(checked.byte_length, locked.byte_length);
      assert.equal(checked.semantic_content_digest, locked.content_digest);
      assert.deepEqual(checked.entries, expected.semantic_entries.filter(entry => entry.namespace === checked.namespace).map(entry => ({ semantic_id: entry.semantic_id, version: entry.version, digest: digest(entry) })));
    }
    return { asserted: ["identity/lock admission", "attribution", "composition withheld"], pending };
  }
  if (expected.status) {
    // REJECTED is the private admission result, not a legacy composition verdict.
    // It maps losslessly to oracle REJECTED / INVALID_COMPOSITION by input kind.
    assert.equal(result.status, "REJECTED");
    assert.equal(result.checked_basis, null);
    if (row.case_id.startsWith("C")) assert.deepEqual(result.diagnostics, expected.diagnostics);
    else assert.ok(result.input_issues.length > 0);
    return { asserted: ["rejection", "zero admitted outputs", ...(row.case_id.startsWith("C") ? ["all oracle diagnostic fields"] : ["structural issues"])], pending };
  }
  // Five H cases exercise later binding/state logic. Preserve their exact input;
  // acceptance of shape MUST NOT be called supportability or whole-case conformance.
  assert.equal(result.status, "CHECKED_INPUT_SHAPE");
  assert.equal(result.checked_basis, null);
  assert.deepEqual(result.input_issues, []);
  assert.equal(expected.state, "UNRESOLVED");
  pending.push(`T1-02/T1-03/Tranche 2: UNRESOLVED; missing ${expected.missing_binding}`);
  return { asserted: ["structural admission only", "no claim evaluation"], pending };
}
export function compareAll(rows, outputs, expected) {
  assert.deepEqual(rows.map(row => row.case_id), caseIds, "Dropped/duplicate/reordered input inventory");
  assert.deepEqual(Object.keys(outputs), caseIds, "Dropped/duplicate/unmatched result inventory");
  return rows.map(row => ({ case_id: row.case_id, ...compare(row, outputs[row.case_id], expected[row.case_id]) }));
}
