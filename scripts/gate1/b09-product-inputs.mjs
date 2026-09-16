// Test-side data translation only. No reference evaluator or expected output imports.
import fs from "node:fs";
import { createHash } from "node:crypto";
export const frozenDir = "tests/fixtures/experiment-3-repaired/";
export const readJson = path => JSON.parse(fs.readFileSync(path, "utf8"));
export function canonical(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
}
export const digest = value => createHash("sha256").update(typeof value === "string" || Buffer.isBuffer(value) ? value : canonical(value)).digest("hex");
export const baseIds = ["C01", "C02", "C05", "C06.registry", "C07", "C20.producer", "C20.consumer", "C20.malformed", "C21.>=0.1.0", "C21.latest", "C21.0.1.0-rc.1", "C21.01.1.0", "C22.array", "C22.raw", "C27"];
export const hardeningIds = Array.from({ length: 35 }, (_, i) => `H${String(i + 1).padStart(2, "0")}`);
export const caseIds = [...baseIds, ...hardeningIds];
export function loadInputs() {
  const fixtures = readJson(frozenDir + "cases.v0.2.json");
  const hardening = readJson(frozenDir + "admission-hardening.v0.1.json");
  const rows = baseIds.map(id => {
    const matches = fixtures.filter(row => row.case_id === id);
    if (matches.length !== 1) throw new Error(`Missing/duplicate input: ${id}`);
    return structuredClone(matches[0]);
  });
  for (const id of hardeningIds) {
    const matches = hardening.cases.filter(row => row.case_id === id);
    if (matches.length !== 1) throw new Error(`Missing/duplicate hardening: ${id}`);
    const h = matches[0];
    const bases = fixtures.filter(row => row.case_id === h.base_case_id);
    if (bases.length !== 1) throw new Error(`Missing/duplicate base: ${id}`);
    let input = structuredClone(bases[0].input);
    for (const op of h.mutations) {
      if (!["replace", "remove"].includes(op.op)) throw new Error("Unsupported mutation");
      if (!op.path.length) { input = structuredClone(op.value); continue; }
      let parent = input;
      for (const key of op.path.slice(0, -1)) parent = parent[key];
      if (op.op === "remove") delete parent[op.path.at(-1)];
      else parent[op.path.at(-1)] = structuredClone(op.value);
    }
    if (digest(input) !== h.input_sha256) throw new Error(`Mutation drift: ${id}`);
    rows.push({ case_id: id, input });
  }
  return rows;
}

// The caller supplies this separately from untrusted evidence. Its digest and source
// are recorded in the evidence envelope. This is finite test context, not general
// contextual semantic admission. Only current product Core owns canonical meaning.
export function testTrust() {
  const basis = readJson(frozenDir + "basis.v0.2.json");
  return {
    proof: structuredClone(basis.admission_basis),
    proof_digest: digest(basis.admission_basis),
    proof_ref: `${frozenDir}basis.v0.2.json#admission_basis`,
    registry: structuredClone(basis.registry),
    modules: structuredClone(basis.modules),
    request_paths: ["pass", "occurred", "independence", "producer_inference", "observation_inference", "integrity", "custody", "sufficiency", "current", "authority", "old_authority_inference", "acceptance", "decision", "action", "presence", "generic", "weakening_inference", "collision"],
  };
}

// T1-02 translation preserves original claim inputs and exact H mutations.
export const t102CaseIds = ["N03", "N04", "N07", "N08", "N09", "N08.predicate_override", "I10.unresolved_ref", "N18", "H08", "H28", "H29", "control.generic", "control.caller_added"];
export function loadRequirementInputs() {
  const fixtures = readJson(frozenDir + "cases.v0.2.json");
  const h = loadInputs();
  const rows = t102CaseIds.filter(id => !id.startsWith("control.")).map(id => {
    const found = (id.startsWith("H") ? h : fixtures).filter(row => row.case_id === id);
    if (found.length !== 1) throw new Error("Missing/duplicate T1-02 input: " + id);
    return { case_id: id, input: structuredClone(found[0].input) };
  });
  const positive = structuredClone(fixtures.find(row => row.case_id === "N04").input);
  positive.requests[0].claim = "evidence_presence";
  delete positive.caller_supported_claim_parts;
  rows.push({ case_id: "control.generic", input: positive });
  const added = structuredClone(positive);
  added.requests[0].required_bindings = ["witnesses"];
  rows.push({ case_id: "control.caller_added", input: added });
  return rows;
}
export function requirementCoreInput() {
  const input = structuredClone(loadInputs().find(row => row.case_id === "C01").input);
  input.modules = input.modules.filter(row => row.module_id === "mesr.core");
  input.lock = input.lock.filter(row => row.module_id === "mesr.core");
  input.raw_manifests = { "mesr.core": input.raw_manifests["mesr.core"] };
  return input;
}
