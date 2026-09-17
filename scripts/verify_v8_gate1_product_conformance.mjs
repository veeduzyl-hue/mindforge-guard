import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { loadInputs, testTrust, canonical, digest, readJson, frozenDir, caseIds } from "./gate1/b09-product-inputs.mjs";
import { expectations, compareAll } from "./gate1/b09-product-compare.mjs";
import { composeMesrModules } from "../packages/guard-core/src/mesr/moduleManifest.ts";
import { generateGovernanceReport } from "../packages/guard-core/src/generateGovernanceReport.ts";
import { generateEvidenceIndex } from "../packages/guard-core/src/generateEvidenceIndex.ts";
import { renderMarkdownReport } from "../packages/renderer-md/src/renderMarkdownReport.ts";
import { renderHtmlReport } from "../packages/renderer-html/src/renderHtmlReport.ts";
import { parseEvidencePack } from "../packages/guard-core/src/parseEvidencePack.ts";
import { validateEvidencePack } from "../packages/guard-core/src/validateEvidencePack.ts";
import { GUARD_REASON_CODES } from "../packages/guard-core/src/reasonCodes.ts";

process.chdir(fileURLToPath(new URL("../", import.meta.url)));
const args = process.argv.slice(2);
assert.equal(args[0], "--task"); assert.ok(["T1-01", "T1-02", "T1-03"].includes(args[1]));
assert.ok(args.slice(2).every(arg => ["--before", "--record"].includes(arg)));
const before = args.includes("--before"), record = args.includes("--record");
const fixturePath = "tests/fixtures/gate1/t1-01-controls.v0.1.json";
const resultPath = "tests/fixtures/gate1/t1-01-results.v0.1.json";
const productPaths = ["admission.ts", "contracts.ts", "canonicalBytes.ts"].map(p => "packages/guard-core/src/mesr/repaired/" + p);
const t102Paths = ["packages/guard-core/src/mesr/repaired/requirements.ts", "scripts/verify_v8_gate1_product_conformance.mjs", "scripts/gate1/b09-product-inputs.mjs", "scripts/gate1/b09-product-compare.mjs", "tests/fixtures/gate1/t1-02-controls.v0.1.json", "tests/fixtures/gate1/t1-02-results.v0.1.json", "docs/validation/v8-gate1-t1-02-evidence-v0.1.md"];
const t103Paths = ["packages/guard-core/src/mesr/repaired/claimState.ts", "packages/guard-core/src/mesr/repaired/evaluateClaim.ts", "scripts/verify_v8_gate1_product_conformance.mjs", "scripts/gate1/b09-product-inputs.mjs", "scripts/gate1/b09-product-compare.mjs", "tests/fixtures/gate1/t1-03-controls.v0.1.json", "tests/fixtures/gate1/t1-03-results.v0.1.json", "docs/validation/v8-gate1-t1-03-evidence-v0.1.md"];
const head = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const taskScope = assertTaskScope();
const pins = readJson(frozenDir + "freeze.v0.2.json");
for (const pin of pins.files) {
  const bytes = fs.readFileSync(pin.path);
  assert.equal(digest(bytes), pin.sha256, "Frozen worktree bytes: " + pin.path);
  assert.equal(digest(execFileSync("git", ["cat-file", "blob", head + ":" + pin.path], { maxBuffer: 20_000_000 })), pin.sha256, "Frozen Git bytes: " + pin.path);
}
function legacyControls() {
  const allow = readJson("fixtures/ai-pr-low-risk-complete/evidence-pack.json");
  const review = readJson("fixtures/ai-pr-missing-tests/evidence-pack.json");
  const inconclusive = structuredClone(allow); inconclusive.manifest.completeness = "incomplete";
  const block = structuredClone(allow);
  block.blocked_actions = [{ blocked_action_id: "control:block", timestamp: allow.created_at, attempted_action: "read protected path", reason_code: "PROTECTED_PATH", policy_ref: null, severity: "critical", human_review_required: true }];
  const outputs = {};
  for (const [verdict, input] of Object.entries({ allow, require_review: review, inconclusive, block })) {
    const result = generateGovernanceReport(input);
    assert.equal(result.ok, true, JSON.stringify(result));
    assert.equal(result.report.verdict.value, verdict);
    const report = result.report;
    outputs[verdict] = { input, json: JSON.stringify(result), markdown: renderMarkdownReport(report), html: renderHtmlReport(report), index: JSON.stringify(generateEvidenceIndex(report)), reason_order: report.reason_codes };
    for (const representation of [input, JSON.stringify(input), Buffer.from(JSON.stringify(input))]) assert.equal(parseEvidencePack(representation).ok, true);
    assert.equal(validateEvidencePack(input).ok, true);
  }
  const invalid = [null, {}, { ...allow, schema_version: "9.9.9" }, { ...allow, unknown_field: true }, { ...allow, created_at: "invalid" }];
  const invalidResults = invalid.map(input => ({ input, parsed: parseEvidencePack(input), validated: validateEvidencePack(input), report: generateGovernanceReport(input) }));
  for (const row of invalidResults) assert.equal(row.validated.ok, false);
  return { outputs, invalid: invalidResults, invalid_json: parseEvidencePack("{invalid"), reason_values: Object.values(GUARD_REASON_CODES) };
}

if (args[1] === "T1-03") { await runStateTask(); } else if (args[1] === "T1-02") { await runRequirementsTask(); } else {
const rows = loadInputs(), expected = expectations(), trust = testTrust();
const oracle = readJson(frozenDir + "oracle.v0.2.json");
for (const row of rows.filter(row => row.case_id.startsWith("C"))) assert.equal(digest(row.input), oracle.fixture_input_digests[row.case_id]);

const legacy = legacyControls();
if (before) {
  assert.ok(productPaths.every(path => !fs.existsSync(path)), "Capture must precede runtime implementation");
  assert.ok(!fs.existsSync(fixturePath), "Before evidence is immutable once captured");
  const observations = rows.map(row => {
    let legacyObservation = { classification: "NOT_APPLICABLE", note: "No legacy supplemental shape API" };
    if (row.input?.kind === "composition") {
      try { legacyObservation = { status: composeMesrModules(structuredClone(row.input.modules)).status }; }
      catch (error) { legacyObservation = { typed_api_error: error.message, note: "Malformed supplemental data lies outside legacy typed API; not repaired rejection" }; }
    }
    return { case_id: row.case_id, input_digest: digest(row.input), product_status: "BEFORE_EXPECTED_GAP", reason: "T1-01 private API absent", legacy_observation: legacyObservation };
  });
  fs.mkdirSync("tests/fixtures/gate1", { recursive: true });
  fs.writeFileSync(fixturePath, JSON.stringify({ version: "gate1-t1-01-controls/0.1", pre_change_head: head, oracle_hash: digest(fs.readFileSync(frozenDir + "oracle.v0.2.json")), trust_digest: digest(trust), observations, legacy }, null, 2) + "\n");
  console.log(JSON.stringify({ phase: "before", cases: rows.length, BEFORE_EXPECTED_GAP: rows.length, legacy_verdicts: Object.keys(legacy.outputs), freeze_blobs: pins.files.length }));
} else {
  const baseline = readJson(fixturePath);
  execFileSync("git", ["merge-base", "--is-ancestor", baseline.pre_change_head, head]);
  assert.equal(JSON.stringify(legacy), JSON.stringify(baseline.legacy), "Legacy serialized output or rejection drift");
  assert.equal(digest(trust), baseline.trust_digest);
  assert.deepEqual(baseline.observations.map(row => row.case_id), caseIds);
  assert.equal(baseline.task_id, "T1-01");
  assert.equal(baseline.semantic_composition, "WITHHELD");
  assert.deepEqual(baseline.case_controls.map(row => row.case_id), caseIds);
  const preservedCapture = Object.fromEntries(baseline.recovery.original_keys.map(key => [key, baseline[key]]));
  assert.equal(digest(preservedCapture), baseline.recovery.preserved_capture_digest, "Recovered before evidence changed");
  assert.equal(digest(JSON.stringify(preservedCapture, null, 2) + "\n"), baseline.recovery.original_file_sha256);
  for (const pin of baseline.source_contracts) assert.equal(digest(fs.readFileSync(pin.path)), pin.sha256, "Source contract changed");
  const { inspectCanonicalAdmission } = await import("../packages/guard-core/src/mesr/repaired/admission.ts");
  const originalInputs = canonical(rows), originalTrust = canonical(trust);
  const outputs = Object.fromEntries(rows.map(row => [row.case_id, inspectCanonicalAdmission(row.input, trust)]));
  assert.equal(canonical(rows), originalInputs, "Product mutated input");
  assert.equal(canonical(trust), originalTrust, "Product mutated admission source");
  const assertions = compareAll(rows, outputs, expected).map(row => ({ ...row, comparison: "EXPECTED_GAP_CLOSED", scope: "T1-01 owned assertions only", later_semantic_obligations_status: "WITHHELD_FOR_LATER_TASK" }));
  const beforeAfter = assertions.map(row => {
    const original = baseline.observations.find(observation => observation.case_id === row.case_id);
    assert.equal(original.product_status, "BEFORE_EXPECTED_GAP");
    const control = baseline.case_controls.find(control => control.case_id === row.case_id);
    assert.equal(control.input_sha256, original.input_digest);
    assert.equal(control.expected_status, outputs[row.case_id].status);
    return { case_id: row.case_id, obligation: row.asserted, before: "EXPECTED_GAP", before_basis: original.reason,
      after: "CONFORMS_TODAY", comparison: row.comparison, scope: row.scope,
      product_result_ref: "outputs." + row.case_id, semantic_composition: "WITHHELD",
      later_semantic_obligations_status: "WITHHELD_FOR_LATER_TASK", pending: row.pending };
  });
  const comparisonCounts = Object.fromEntries(["EXPECTED_GAP_CLOSED", "PARTIAL_CONFORMANCE_IMPROVED", "UNCHANGED_CONFORMING", "UNCHANGED_EXPECTED_GAP", "NEW_REGRESSION"].map(key => [key, beforeAfter.filter(row => row.comparison === key).length]));
  assert.equal(digest(outputs), baseline.recovery.prior_product_outputs_digest, "Recovered product behavior changed");
  const replayHashes = [digest(outputs)];
  for (let i = 0; i < 2; i++) replayHashes.push(digest(Object.fromEntries(rows.map(row => [row.case_id, inspectCanonicalAdmission(structuredClone(row.input), trust)]))));
  assert.equal(new Set(replayHashes).size, 1);
  // Harness falsifiers: failures must propagate, including a deliberately admitted negative.
  const corrupted = structuredClone(expected); corrupted.C02.diagnostics[0].rule_id = "CORRUPTED_EXPECTATION";
  assert.throws(() => compareAll(rows, outputs, corrupted));
  const dropped = { ...outputs }; delete dropped.H35;
  assert.throws(() => compareAll(rows, dropped, expected));
  const falsePositive = structuredClone(outputs); falsePositive.C02 = structuredClone(outputs.C01);
  assert.throws(() => compareAll(rows, falsePositive, expected));
  const droppedBinding = structuredClone(rows); delete droppedBinding.find(r => r.case_id === "H08").input.bindings.evidence_refs;
  assert.throws(() => assert.equal(digest(droppedBinding.find(r => r.case_id === "H08").input), baseline.observations.find(r => r.case_id === "H08").input_digest));
  for (const row of rows) assert.equal(digest(row.input), baseline.observations.find(r => r.case_id === row.case_id).input_digest);
  const { canonicalJson, parseExactJson, CanonicalInputError } = await import("../packages/guard-core/src/mesr/repaired/canonicalBytes.ts");
  const supplemental = [];
  const checkControl = (id, check) => { check(); supplemental.push({ id, outcome: "PASS" }); };
  const valid = rows.find(row => row.case_id === "C01").input;
  const rejectMutation = (id, mutate) => checkControl(id, () => {
    const input = structuredClone(valid); const suppliedTrust = structuredClone(trust);
    mutate(input, suppliedTrust);
    const output = inspectCanonicalAdmission(input, suppliedTrust);
    assert.equal(output.status, "REJECTED", id);
    assert.equal(output.checked_basis, null);
    for (const key of ["semantic_entries", "mappings", "profiles", "claims"]) assert.deepEqual(output[key], []);
  });
  rejectMutation("unknown-module-id", x => { x.modules[1].module_id = "unknown.module"; });
  rejectMutation("unknown-registry-version", x => { x.registry.version = "0.1.1"; });
  rejectMutation("self-rewritten-registry", (x, t) => { x.registry.digest = t.registry.digest = "0".repeat(64); });
  rejectMutation("unknown-closed-field", x => { x.automatic_acceptance = true; });
  rejectMutation("unsupported-module-version", x => { x.modules[1].version = "latest"; });
  rejectMutation("unsupported-lock-field", x => { x.lock[0].format = "yaml"; });
  rejectMutation("missing-manifest", x => { delete x.raw_manifests[x.modules[1].module_id]; });
  rejectMutation("extra-manifest", x => { x.raw_manifests.extra = "{}"; });
  rejectMutation("missing-lock", x => { x.lock.pop(); });
  rejectMutation("extra-lock", x => { x.lock.push({ ...x.lock[0], module_id: "extra" }); });
  rejectMutation("missing-core", x => { x.modules.shift(); x.lock.shift(); delete x.raw_manifests["mesr.core"]; });
  rejectMutation("empty-composition", x => { x.modules = []; x.lock = []; x.raw_manifests = {}; });
  rejectMutation("invalid-byte-length", x => { x.lock[0].byte_length--; });
  rejectMutation("duplicate-decoded-json-key", x => { x.raw_manifests["mesr.core"] = '{"x":1,"\\u0078":2}'; });
  rejectMutation("duplicate-nested-json-key", x => { x.raw_manifests["mesr.core"] = '{"a":[{"x":1,"x":2}]}'; });
  rejectMutation("nonfinite-raw-json", x => { x.raw_manifests["mesr.core"] = '{"x":1e999}'; });
  rejectMutation("raw-utf8-bom", x => { x.raw_manifests["mesr.core"] = "\uFEFF" + x.raw_manifests["mesr.core"]; });
  rejectMutation("unpaired-raw-surrogate", x => { x.raw_manifests["mesr.core"] = '{"x":"' + String.fromCharCode(0xd800) + '"}'; });
  rejectMutation("rewritten-content-and-lock", x => {
    const m = x.modules[1]; m.added_semantics[0].definition += " altered";
    const text = canonical(m); x.raw_manifests[m.module_id] = text;
    x.lock[1].byte_digest = digest(text); x.lock[1].content_digest = digest(m); x.lock[1].byte_length = Buffer.byteLength(text);
    for (const lock of x.lock) for (const dependency of lock.dependencies) if (dependency.module_id === m.module_id) dependency.content_digest = digest(m);
  });
  rejectMutation("self-rewritten-proof", x => { x.admission_basis.issuer = "producer rewrites its proof"; });
  rejectMutation("wrong-independent-proof-pin", (x, t) => { t.proof_digest = "0".repeat(64); });
  rejectMutation("non-json-value", x => { x.modules[0].extra = undefined; });
  rejectMutation("non-json-getter", x => { Object.defineProperty(x.modules[0], "extra", { enumerable: true, get() { throw new Error("Must not execute getter"); } }); });
  rejectMutation("non-json-cycle", x => { x.modules[0].extra = x; });
  rejectMutation("non-json-prototype", x => { x.modules[0].extra = new Date(0); });
  checkControl("unknown-claim-identity", () => {
    const input = structuredClone(rows.find(row => row.case_id === "H29").input);
    input.requests[0].semantic_ids = ["identity.declared"];
    assert.equal(inspectCanonicalAdmission(input, trust).status, "REJECTED");
  });
  checkControl("exact-raw-format-with-separate-byte-lock", () => {
    const input = structuredClone(valid); const id = input.modules[1].module_id;
    input.raw_manifests[id] = JSON.stringify(input.modules[1], null, 2) + "\r\n";
    input.lock[1].byte_digest = digest(input.raw_manifests[id]);
    input.lock[1].byte_length = Buffer.byteLength(input.raw_manifests[id], "utf8");
    const output = inspectCanonicalAdmission(input, trust);
    assert.equal(output.status, "CHECKED_BASIS");
    assert.notEqual(output.checked_basis.modules[1].byte_digest, output.checked_basis.modules[1].semantic_content_digest);
    assert.equal(output.checked_basis.modules[1].semantic_content_digest, valid.lock[1].content_digest);
  });
  checkControl("core-only-explicit-basis", () => {
    const input = structuredClone(valid); input.modules = [input.modules[0]]; input.lock = [input.lock[0]];
    input.raw_manifests = { "mesr.core": input.raw_manifests["mesr.core"] };
    const output = inspectCanonicalAdmission(input, trust);
    assert.equal(output.status, "CHECKED_BASIS"); assert.equal(output.checked_basis.modules.length, 1);
    assert.equal(output.semantic_composition, "WITHHELD");
  });
  checkControl("unicode-codepoint-and-integer-key-order", () => {
    assert.equal(canonicalJson({ "10": "\u5341", "2": "\u4e8c", "\ud83d\ude00": 1, "\uE000": 2 }), '{"10":"\u5341","2":"\u4e8c","\uE000":2,"\ud83d\ude00":1}');
    assert.equal(Buffer.byteLength(canonicalJson({ text: "\u8bc1\u636e" }), "utf8"), 17);
    assert.notEqual(digest(canonicalJson([1, 2])), digest(canonicalJson([2, 1])));
  });
  checkControl("strict-json-parser-controls", () => {
    for (const raw of ['{"a":1,}', '[1,]', '{"a":01}', '{"a":true}junk', '{"a":"unterminated}', '{"a":1,"a":2}']) assert.throws(() => parseExactJson(raw));
    assert.deepEqual(parseExactJson(' {"a":[1,true,null,"x"]}\n'), { a: [1, true, null, "x"] });
    for (const value of [NaN, Infinity, 1n, undefined, Symbol("x"), () => 1, [, 1], new Map()]) assert.throws(() => canonicalJson(value), CanonicalInputError);
  });
  checkControl("permutation-and-return-isolation", () => {
    const input = structuredClone(valid); input.modules.reverse(); input.lock.reverse();
    assert.deepEqual(inspectCanonicalAdmission(input, trust), outputs.C01);
    const output = inspectCanonicalAdmission(valid, trust);
    assert.throws(() => { output.checked_basis.modules[0].version = "9.0.0"; }, TypeError);
    assert.equal(valid.modules[0].version, "0.1.0");
  });
  checkControl("windows-regex-helper-equivalence", () => {
    const source = fs.readFileSync(productPaths[2], "utf8");
    const tokenPattern = source.match(/const match = \/(.+)\/\.exec/)[1];
    const previousPattern = tokenPattern.replaceAll("\\u0022", '"');
    assert.notEqual(tokenPattern, previousPattern);
    const current = new RegExp(tokenPattern), previous = new RegExp(previousPattern);
    for (let codeUnit = 0; codeUnit <= 0xffff; codeUnit++) {
      const character = String.fromCharCode(codeUnit);
      for (const token of ['"' + character + '"', '"' + "\\" + character + '"']) {
        assert.equal(current.exec(token)?.[0], previous.exec(token)?.[0]);
      }
    }
    for (const token of ['"\\u0022"', '"\\u0078"', '"\\uXXXX"', '"\\u123"', '"abc', '"abc"tail']) {
      assert.equal(current.exec(token)?.[0], previous.exec(token)?.[0]);
    }
  });
  checkControl("public-source-and-import-isolation", () => {
    // Reuse only paths whose commit attribution or current pending scope passed the entry guard.
    const owned = taskScope.validatedPaths;
    const changed = execFileSync("git", ["diff", "--name-only", baseline.pre_change_head], { encoding: "utf8" }).trim().split("\n").filter(Boolean);
    assert.ok(changed.every(path => owned.includes(path)), "Protected baseline files changed: " + changed.filter(path => !owned.includes(path)).join(", "));
    const tracked = execFileSync("git", ["ls-files", "-z", "packages"], { encoding: "utf8", maxBuffer: 5_000_000 }).split("\0").filter(p => /\.(?:mjs|cjs|js|ts|json)$/.test(p));
    for (const path of tracked) assert.ok(!fs.readFileSync(path, "utf8").includes("mesr/repaired"), "Default/public caller: " + path);
    for (const path of productPaths) {
      const source = fs.readFileSync(path, "utf8");
      for (const match of source.matchAll(/(?:from\s+|import\s*\()\s*["']([^"']+)["']/g)) assert.ok(!/scripts|fixtures|gate1|b09/.test(match[1]), "Test dependency: " + path);
    }
  });
  const result = { version: "gate1-t1-01-results/0.1", task_id: "T1-01", gap_ids: ["G08"], recovery: baseline.recovery, before_after: beforeAfter, execution_counts: { PASS: rows.length, FAIL: 0, ERROR: 0 }, later_semantic_obligations_status: "WITHHELD_FOR_LATER_TASK", pre_change_head: head, post_change_head: null, worktree_state: "UNCOMMITTED", oracle_hash: baseline.oracle_hash, baseline_hash: digest(fs.readFileSync(fixturePath)), trust_digest: digest(trust), source_hashes: Object.fromEntries([...productPaths, "scripts/verify_v8_gate1_product_conformance.mjs", "scripts/gate1/b09-product-inputs.mjs", "scripts/gate1/b09-product-compare.mjs"].map(path => [path, digest(fs.readFileSync(path))])), outputs, assertions, supplemental_controls: supplemental, harness_falsifiers: ["corrupted expectation", "dropped result", "false positive", "dropped binding input"], replay_hashes: replayHashes, comparison_unit: "T1-01 owned obligation slice; never whole-case semantic conformance", counts: comparisonCounts, legacy_byte_equality: true, freeze_blobs: pins.files.length };
  if (record) fs.writeFileSync(resultPath, JSON.stringify(result, null, 2) + "\n");
  console.log(JSON.stringify({ phase: "after", cases: rows.length, ...result.counts, result_hash: digest(result), replay_hashes: replayHashes, legacy_byte_equality: true }));
}

}

async function runRequirementsTask() {
  const { loadRequirementInputs, requirementCoreInput, t102CaseIds } = await import("./gate1/b09-product-inputs.mjs");
  const rows = loadRequirementInputs(), core = requirementCoreInput(), trust = testTrust();
  assert.deepEqual(rows.map(row => row.case_id), t102CaseIds);
  const controlPath = "tests/fixtures/gate1/t1-02-controls.v0.1.json";
  const outputPath = "tests/fixtures/gate1/t1-02-results.v0.1.json";
  const productPath = "packages/guard-core/src/mesr/repaired/requirements.ts";
  const { inspectCanonicalAdmission } = await import("../packages/guard-core/src/mesr/repaired/admission.ts");
  assert.equal(inspectCanonicalAdmission(core, trust).status, "CHECKED_BASIS");
  const legacy = legacyControls();
  assert.equal(JSON.stringify(legacy), JSON.stringify(readJson("tests/fixtures/gate1/t1-01-controls.v0.1.json").legacy));
  if (before) {
    assert.ok(!fs.existsSync(productPath), "Before capture must precede implementation");
    assert.ok(!fs.existsSync(controlPath), "Never overwrite before observations");
    const observations = rows.map(row => ({ case_id: row.case_id, input_sha256: digest(row.input), input: row.input,
      classification: "BEFORE_EXPECTED_GAP", basis: "T1-02 private requirement API absent at recorded HEAD",
      admission_observation: inspectCanonicalAdmission(row.input, trust), pending: "T1-03 states; T1-04 composition; applicable Tranche 2 proof methods" }));
    const baseline = { version: "gate1-t1-02-controls/0.1", task_id: "T1-02", pre_change_head: head,
      oracle_hash: digest(fs.readFileSync(frozenDir + "oracle.v0.2.json")), core_input_sha256: digest(core), trust_sha256: digest(trust),
      BEFORE_CONFORMS: 0, BEFORE_PARTIAL: 0, BEFORE_EXPECTED_GAP: rows.length, BEFORE_NOT_APPLICABLE: 0,
      observations, legacy_sha256: digest(legacy), frozen_files: pins.files.length };
    fs.writeFileSync(controlPath, JSON.stringify(baseline, null, 2) + "\n");
    console.log(JSON.stringify({ task: "T1-02", phase: "before", cases: rows.length, BEFORE_CONFORMS: 0, BEFORE_PARTIAL: 0, BEFORE_EXPECTED_GAP: rows.length, BEFORE_NOT_APPLICABLE: 0, frozen_files: pins.files.length }));
    return;
  }
  await verifyRequirementsAfter({ rows, core, trust, t102CaseIds, controlPath, outputPath, productPath, legacy });
}

async function verifyRequirementsAfter({ rows, core, trust, t102CaseIds, controlPath, outputPath, productPath, legacy }) {
  const baseline = readJson(controlPath);
  execFileSync("git", ["merge-base", "--is-ancestor", baseline.pre_change_head, head]);
  assert.equal(digest(fs.readFileSync(controlPath)), "2e0edbf7952d17bd27b8716f94b4cb0df039eed05d4313a0241300b419efccf7", "Original before capture changed");
  assert.equal(digest(legacy), baseline.legacy_sha256);
  assert.equal(digest(core), baseline.core_input_sha256);
  assert.equal(digest(trust), baseline.trust_sha256);
  assert.equal(digest(fs.readFileSync(frozenDir + "oracle.v0.2.json")), baseline.oracle_hash);
  assert.deepEqual(baseline.observations.map(r => r.case_id), t102CaseIds);
  for (const row of rows) {
    const original = baseline.observations.find(r => r.case_id === row.case_id);
    assert.deepEqual(row.input, original.input);
    assert.equal(digest(row.input), original.input_sha256);
    assert.equal(original.classification, "BEFORE_EXPECTED_GAP");
  }
  const { collectBindingRequirements, inspectBindingValue } = await import("../packages/guard-core/src/mesr/repaired/requirements.ts");
  const { compareRequirements } = await import("./gate1/b09-product-compare.mjs");
  const oracle = readJson(frozenDir + "oracle.v0.2.json");
  const hardening = readJson(frozenDir + "admission-hardening.v0.1.json");
  const expected = Object.fromEntries(rows.map(row => [row.case_id, row.case_id.startsWith("H") ? hardening.cases.find(h => h.case_id === row.case_id).expected : oracle.cases[row.case_id] ?? null]));
  const original = digest({ rows, core, trust });
  const run = () => Object.fromEntries(rows.map(row => [row.case_id, collectBindingRequirements(row.input, core, trust)]));
  const outputs = run();
  const assertions = compareRequirements(rows, outputs, expected, t102CaseIds);
  const replayHashes = [digest(outputs), digest(run()), digest(run())];
  assert.equal(new Set(replayHashes).size, 1);
  assert.equal(digest({ rows, core, trust }), original);
  const controls = [];
  let controlObservations = [];
  const check = (name, fn) => { controlObservations = []; fn(); controls.push({ name, result: "PASS", product_observations: controlObservations }); };
  const input = id => structuredClone(rows.find(r => r.case_id === id).input);
  const evaluate = (source, contexts = []) => {
    const result = collectBindingRequirements(source, core, trust, contexts);
    controlObservations.push({ input_sha256: result.input_digest, contexts: structuredClone(contexts), result });
    return result;
  };
  const generic = () => input("control.generic");
  const context = requirements => ({ path: "generic", subject: generic().subject, scope: generic().scope, evaluation_time: generic().bindings.evaluation_time, source_ref: "control:independent-obligation-declaration", requirements });
  check("null-whitespace-zero-false-cannot-satisfy-reference", () => {
    for (const value of [null, "", "  ", 0, false, [], {}]) {
      const source = generic(); source.bindings.subject = value;
      const result = evaluate(source).claims[0]; assert.ok(result.missing_bindings.includes("subject"));
      const binding = result.bindings.find(b => b.binding === "subject"); assert.equal(binding.present, true); assert.deepEqual(binding.value, value);
    }
    const source = generic(); delete source.bindings.subject;
    const binding = evaluate(source).claims[0].bindings.find(b => b.binding === "subject"); assert.equal(binding.present, false); assert.ok(!Object.hasOwn(binding, "value"));
  });
  check("boolean-false-zero-empty-explicit-predicates", () => {
    for (const [predicate, value] of [["boolean", false], ["nonnegative_integer", 0], ["reference_array_allow_empty", []]]) {
      const source = generic(); source.bindings.additional = value;
      const result = evaluate(source, [context([{ binding: "additional", predicate }])]).claims[0];
      assert.deepEqual(result.missing_bindings, []); const binding = result.bindings.find(b => b.binding === "additional"); assert.equal(binding.satisfied, true); assert.deepEqual(binding.value, value);
    }
    assert.equal(inspectBindingValue("true", true, false).satisfied, false);
    assert.equal(inspectBindingValue("nonnegative_integer", true, -1).satisfied, false);
    assert.equal(inspectBindingValue("nonnegative_integer", true, 0.5).satisfied, false);
  });
  check("witness-members-have-value-predicates", () => {
    for (const value of [[], [""], ["  "], [false], [0], [null]]) { const source = input("control.caller_added"); source.bindings.witnesses = value; assert.ok(evaluate(source).claims[0].missing_bindings.includes("witnesses")); }
  });
  check("unknown-predicate-and-caller-hint-not-proof", () => {
    const source = generic(); source.requests[0].required_bindings = ["unregistered"]; source.bindings.unregistered = "present"; source.predicates.unregistered = "nonempty_reference";
    const result = evaluate(source).claims[0]; assert.ok(result.missing_bindings.includes("unregistered"));
    const predicate = result.bindings.find(b => b.binding === "unregistered").predicates[0]; assert.equal(predicate.defined, false); assert.equal(predicate.satisfied, false);
    assert.ok(evaluate(generic(), [context([{ binding: "additional", predicate: "unknown" }])]).claims[0].missing_bindings.includes("additional"));
  });
  check("context-union-cannot-weaken-core", () => {
    const source = generic(); source.bindings.subject = false;
    const result = evaluate(source, [context([{ binding: "subject", predicate: "boolean" }, { binding: "witnesses", predicate: "nonempty_array" }])]).claims[0];
    assert.ok(result.effective_requirements.includes("witnesses")); assert.ok(result.missing_bindings.includes("subject"));
    assert.ok(result.bindings.find(b => b.binding === "subject").predicates.some(p => p.predicate === "nonempty_reference"));
    const bad = context([]); bad.subject = "different"; assert.equal(evaluate(generic(), [bad]).status, "REJECTED");
  });
  check("registry-boundary-caller-context-union", () => {
    const source = generic(); source.requests[0].claim = "evidence_sufficient"; source.requests[0].observed_state_ids = ["evidence_present"]; source.requests[0].required_bindings = ["witnesses"];
    const result = evaluate(source, [context([{ binding: "verification_executed", predicate: "boolean" }])]).claims[0];
    assert.deepEqual(result.effective_requirements, ["admissibility", "claim_specific_required_evidence", "evidence_id_or_ref", "producer_or_source", "provenance", "quality", "scope", "subject", "time", "verification_executed", "witnesses"]);
    assert.ok(result.excluded_inferences.some(n => n.source_ref === "Core:CB-11"));
    delete source.requests[0].observed_state_ids;
    assert.deepEqual(evaluate(source, [context([{ binding: "verification_executed", predicate: "boolean" }])]).claims[0].effective_requirements, result.effective_requirements, "Caller omission cannot remove anchored Core boundary obligations");
    source.bindings.verification_executed = false;
    assert.ok(evaluate(source, [context([{ binding: "verification_executed", predicate: "boolean" }])]).claims[0].missing_bindings.includes("verification_executed"));
  });
  check("duplicate-requirements-retain-every-source", () => {
    const source = generic(); source.requests[0].required_bindings = ["subject", "subject"];
    const a = context([{ binding: "subject", predicate: "nonempty_reference" }, { binding: "subject", predicate: "nonempty_reference" }]);
    const b = { ...structuredClone(a), source_ref: "control:second-source" };
    const r = evaluate(source, [a, a, b]).claims[0];
    assert.equal(r.effective_requirements.filter(x => x === "subject").length, 1);
    const binding = r.bindings.find(x => x.binding === "subject");
    assert.ok(binding.origins.includes("caller:generic") && binding.origins.includes(a.source_ref) && binding.origins.includes(b.source_ref));
    assert.equal(binding.origins.length, new Set(binding.origins).size);
    assert.equal(binding.predicates.length, new Set(binding.predicates.map(p => p.predicate + ":" + p.source_ref)).size);
  });
  check("unknown-version-retained", () => { const source = generic(); source.requests[0].semantic_version = "9.9.9"; const r = evaluate(source).claims[0]; assert.equal(r.unresolved_identities.length, 1); assert.ok(r.missing_bindings.includes("semantic_identity")); });
  check("separate-paths-never-cancel-nonclaims", () => {
    const result = outputs.N18; const observed = result.claims.find(c => c.path === "observation_inference"), verified = result.claims.find(c => c.path === "independence");
    assert.ok(observed.excluded_inferences.length); assert.equal(verified.excluded_inferences.length, 0); assert.deepEqual(verified.missing_bindings, []);
    for (const request of input("N18").requests) { const source = input("N18"); source.requests = [request]; assert.deepEqual(evaluate(source).claims[0], result.claims.find(r => r.path === request.path)); }
  });
  check("evidence-reference-subject-scope-resolution", () => {
    for (const key of ["subject", "scope"]) { const source = input("I10.unresolved_ref"); source.evidence_ledger["fixture:change"][key] = "different"; assert.ok(evaluate(source).claims[0].missing_bindings.includes("evidence_ref:fixture:change")); }
  });
  check("method-null-retained-as-missing", () => { assert.ok(outputs.H29.claims[0].missing_bindings.includes("method")); });
  check("identity-lock-and-composition-boundary", () => {
    const bad = structuredClone(core); bad.lock[0].content_digest = "0".repeat(64); assert.equal(collectBindingRequirements(generic(), bad, trust).status, "REJECTED");
    assert.equal(collectBindingRequirements(generic(), loadInputs()[0].input, trust).status, "REJECTED");
    assert.equal(collectBindingRequirements(generic(), { status: "CHECKED_BASIS" }, trust).status, "REJECTED");
    const source = generic(); source.registry.digest = "0".repeat(64); assert.equal(evaluate(source).status, "REJECTED");
  });
  check("malformed-and-nonjson-fail-closed", () => {
    for (const value of [null, {}, [], { kind: "claims", requests: [] }]) assert.equal(evaluate(value).status, "REJECTED");
    const source = generic(); source.bindings.invalid = NaN; assert.equal(evaluate(source).status, "REJECTED");
    const duplicate = generic(); duplicate.requests.push(structuredClone(duplicate.requests[0])); assert.equal(evaluate(duplicate).status, "REJECTED");
  });
  check("permutation-immutability-and-no-input-mutation", () => {
    const source = input("N18"); source.requests.reverse(); source.requests.forEach(r => r.semantic_ids.reverse());
    const result = evaluate(source); assert.deepEqual(result.claims, outputs.N18.claims);
    assert.throws(() => { result.claims[0].nonclaims.pop(); }, TypeError);
    const a = context([{ binding: "witnesses", predicate: "nonempty_array" }]), b = context([{ binding: "verification_executed", predicate: "true" }]);
    assert.deepEqual(evaluate(generic(), [a, b]).claims, evaluate(generic(), [b, a]).claims);
  });
  check("harness-corrupted-oracle-fails", () => { const corrupt = structuredClone(expected); corrupt.N03.claims[0].missing_bindings = []; assert.throws(() => compareRequirements(rows, outputs, corrupt, t102CaseIds)); });
  check("harness-omission-and-false-positive-fail", () => {
    const omitted = { ...outputs }; delete omitted.N09; assert.throws(() => compareRequirements(rows, omitted, expected, t102CaseIds));
    const falsePositive = structuredClone(outputs); falsePositive.N08.claims[0].missing_bindings = []; assert.throws(() => compareRequirements(rows, falsePositive, expected, t102CaseIds));
  });
  check("harness-dropped-binding-input-fails", () => {
    const changed = structuredClone(rows); delete changed.find(r => r.case_id === "control.generic").input.bindings.subject;
    const bad = Object.fromEntries(changed.map(r => [r.case_id, evaluate(r.input)])); assert.throws(() => compareRequirements(changed, bad, expected, t102CaseIds));
  });
  check("original-core-nonclaim-and-missing-association-retained", () => {
    const n = outputs.N18.claims.find(c => c.path === "observation_inference").nonclaim_provenance.find(n => n.source_ref === "Core:CB-07");
    assert.equal(n.canonical_nonclaim, "verification");
    const source = generic(); delete source.bindings.evaluation_time;
    const r = evaluate(source).claims[0]; assert.ok(r.missing_bindings.includes("evaluation_time")); assert.equal(r.provenance.evaluation_time, null);
  });
  check("unordered-requirements-and-multiple-anchor-provenance", () => {
    const source = generic(); source.requests[0].semantic_ids.push("mesr.core.actor.actor"); source.requests[0].required_bindings = ["witnesses", "subject", "witnesses"];
    const first = evaluate(source).claims;
    source.requests[0].semantic_ids.reverse(); source.requests[0].required_bindings.reverse();
    assert.equal(JSON.stringify(evaluate(source).claims), JSON.stringify(first));
    const binding = first[0].bindings.find(b => b.binding === "subject");
    assert.ok(binding.origins.some(o => o.startsWith("mesr.core.actor.actor@")) && binding.origins.some(o => o.startsWith("mesr.core.evidence.item@")) && binding.origins.includes("caller:generic"));
  });
  check("n18-additional-diagnostic-never-hides-oracle-obligations", () => {
    const corrupt = structuredClone(expected); corrupt.N18.claims.find(c => c.path === "observation_inference").missing_bindings.push("corrupted-required-binding");
    assert.throws(() => compareRequirements(rows, outputs, corrupt, t102CaseIds));
  });
  const result = { version: "gate1-t1-02-results/0.1", task_id: "T1-02", pre_change_head: head, post_change_head: null, worktree_state: "UNCOMMITTED",
    oracle_hash: baseline.oracle_hash, before_sha256: digest(fs.readFileSync(controlPath)), core_input_sha256: digest(core), trust_sha256: digest(trust),
    source_hashes: Object.fromEntries([productPath, "scripts/verify_v8_gate1_product_conformance.mjs", "scripts/gate1/b09-product-inputs.mjs", "scripts/gate1/b09-product-compare.mjs"].map(p => [p, digest(fs.readFileSync(p))])),
    outputs, assertions, supplemental_controls: controls, replay_hashes: replayHashes,
    counts: { EXPECTED_GAP_CLOSED: rows.length, PARTIAL_CONFORMANCE_IMPROVED: 0, UNCHANGED_CONFORMING: 0, UNCHANGED_EXPECTED_GAP: 0, NEW_REGRESSION: 0 },
    before_after: assertions.map(a => ({ ...a, before: "EXPECTED_GAP", after: "CONFORMS_TODAY", unit: "task-owned requirement/nonclaim slice only" })),
    legacy_byte_equality: true, frozen_files: pins.files.length, semantic_composition: "WITHHELD_FOR_T1_04", state_evaluation: "PENDING_STATE_EVALUATION" };
  if (record) fs.writeFileSync(outputPath, JSON.stringify(result, null, 2) + "\n");
  console.log(JSON.stringify({ task: "T1-02", phase: "after", cases: rows.length, controls: controls.length, ...result.counts, replay_hashes: replayHashes }));
}

// Attribute immutable historical commits to their own task, separately from pending scope.
function assertTaskScope() {
  const t101 = "7726fc7f58305e59ea7359d9658494b7695bfa4d";
  const t102 = "c5a66b50cefc39002dea190af078a49a7c47e3d4";
  const closure = "2b0e9facb48795533ad96545e318c54ce535515b";
  const t103 = "ff263558cf45d4ad3d42b98e1f983b9f89b1a883";
  const base = "dbdb14ed9cf2f1b7e293f44bf9df1007f8ae15fc";
  const initialClosure = "12d5529b608b13c2c518005721d60d558c9804ea";
  const verifierPath = "scripts/verify_v8_gate1_product_conformance.mjs";
  const closurePaths = [verifierPath, "docs/validation/v8-gate1-t1-02-post-commit-verifier-closure-v0.1.md"];
  const repairPaths = [verifierPath, "docs/validation/v8-gate1-t1-03-post-commit-verifier-closure-v0.1.md"];
  // Only these two digest declarations are normalized, avoiding a self-referential commit pin.
  // A future closure is admitted by exact content, parent, subject and complete path set once.
  const closureVerifierSha256 = "290e69204d2404767fcbde923acad03bc5208763e3486791687928443adf8f43";
  const closureEvidenceSha256 = "a14fa6b5a7910d60099bc11b4c1dbf16448a04049ddaacc4ad604f426e594c47";
  const closureSubject = "test(v8): complete task-attributed Gate1 history validation";
  const normalizedVerifier = text => text.replace(/^  const closure(?:Verifier|Evidence)Sha256 = "[0-9a-f]{64}";$/gm, line => line.replace(/"[0-9a-f]{64}"/, '"<PIN>"'));
  const git = (...gitArgs) => execFileSync("git", gitArgs, { encoding: "utf8", stdio: "pipe", maxBuffer: 30_000_000 }).trim();
  const blob = (commit, path) => execFileSync("git", ["cat-file", "blob", commit + ":" + path], { maxBuffer: 30_000_000 });
  const list = value => value.split("\n").filter(Boolean);
  const sorted = paths => [...paths].sort();
  const isAncestor = (anchor, current) => {
    try { git("cat-file", "-e", anchor + "^{commit}"); git("merge-base", "--is-ancestor", anchor, current); return true; }
    catch { return false; }
  };
  const t101Paths = [...productPaths, verifierPath, "scripts/gate1/b09-product-inputs.mjs", "scripts/gate1/b09-product-compare.mjs", "tests/fixtures/gate1/t1-01-controls.v0.1.json", "tests/fixtures/gate1/t1-01-results.v0.1.json", "docs/validation/v8-gate1-t1-01-evidence-v0.1.md"];
  const accepted = [
    { id: "T1-01", commit: t101, parent: base, paths: t101Paths, heading: "Exact allowed_file_paths" },
    { id: "T1-02", commit: t102, parent: t101, paths: t102Paths, heading: "Frozen exact file allowlist" },
    { id: "T1-02-CLOSURE", commit: closure, parent: t102, paths: closurePaths },
    { id: "T1-03", commit: t103, parent: closure, paths: t103Paths, heading: "Exact file allowlist" },
    { id: "T1-03-CLOSURE-INITIAL", commit: initialClosure, parent: t103, paths: repairPaths }
  ];
  const anchors = { "T1-01": t101, "T1-02": t102, "T1-03": t103 };
  const inventory = commit => ({ commit, parents: list(git("show", "-s", "--format=%P", commit).replaceAll(" ", "\n")),
    paths: list(git("diff-tree", "--no-commit-id", "--name-only", "--no-renames", "-r", commit)), subject: git("show", "-s", "--format=%s", commit) });
  const declared = Object.fromEntries(accepted.map(item => {
    if (!item.heading) return [item.id, [...item.paths]];
    const evidence = item.paths.find(path => path.startsWith("docs/validation/"));
    const section = blob(item.commit, evidence).toString("utf8").split("## " + item.heading)[1]?.split(/\r?\n## /)[0];
    assert.ok(section, "Missing accepted evidence allowlist: " + item.id);
    return [item.id, [...section.matchAll(/^(?:- |\d+\. )([^\r\n]+)$/gm)].map(match => match[1])];
  }));
  const validateClosureContent = (verifier, evidence) => {
    assert.equal(digest(normalizedVerifier(verifier)), closureVerifierSha256, "Unaccepted closure verifier content");
    assert.ok(verifier.includes('const closureVerifierSha256 = "' + closureVerifierSha256 + '";'), "Closure verifier pin changed");
    assert.ok(verifier.includes('const closureEvidenceSha256 = "' + closureEvidenceSha256 + '";'), "Closure evidence pin changed");
    assert.equal(digest(evidence), closureEvidenceSha256, "Unaccepted closure evidence content");
  };
  const validate = (task, suppliedAnchors, current, history, pending, allowlists = declared) => {
    assert.ok(Object.hasOwn(anchors, task), "Unknown task");
    for (const [id, anchor] of Object.entries(anchors)) {
      assert.equal(suppliedAnchors[id], anchor, "Missing/tampered accepted task anchor: " + id);
      assert.ok(isAncestor(anchor, current), "Missing/non-ancestor accepted task anchor: " + id);
    }
    assert.ok(isAncestor(closure, current), "Missing/non-ancestor accepted closure anchor");
    assert.ok(isAncestor(initialClosure, current), "Missing/non-ancestor initial T1-03 closure anchor");
    assert.ok(history.length === accepted.length || history.length === accepted.length + 1, "Unaccepted intervening commit count");
    for (let i = 0; i < accepted.length; i++) {
      const spec = accepted[i], actual = history[i];
      assert.deepEqual(sorted(allowlists[spec.id] ?? []), sorted(spec.paths), "Tampered accepted task allowlist: " + spec.id);
      assert.equal(actual.commit, spec.commit, "Unaccepted intervening commit: " + actual.commit);
      assert.deepEqual(actual.parents, [spec.parent], "Unexpected accepted task parents: " + spec.id);
      assert.deepEqual(sorted(actual.paths), sorted(spec.paths), "Outside accepted task history: " + spec.id);
    }
    if (history.length > accepted.length) {
      const actual = history.at(-1);
      assert.deepEqual(actual.parents, [initialClosure], "Follow-up closure must be the sole direct child of the pinned initial closure");
      assert.equal(actual.subject, closureSubject, "Unaccepted closure subject");
      assert.deepEqual(sorted(actual.paths), sorted(repairPaths), "Outside accepted closure history");
      validateClosureContent(blob(actual.commit, verifierPath).toString("utf8"), blob(actual.commit, repairPaths[1]));
    }
    for (const path of pending) assert.ok(repairPaths.includes(path), "Outside current verifier-closure allowlist: " + path);
  };
  const history = list(git("rev-list", "--reverse", "--topo-order", base + ".." + head)).map(inventory);
  const pending = [...list(git("diff", "--name-only", "--no-renames", head)), ...list(git("ls-files", "--others", "--exclude-standard"))];
  validate(args[1], anchors, head, history, pending);
  // Falsifiers call the same production guard over real Git inventories; no temporary commits or fixture rewrites.
  const controls = [];
  const pass = (id, check) => { check(); controls.push({ id, outcome: "PASS" }); };
  const reject = (id, check, pattern) => pass(id, () => assert.throws(check, pattern));
  pass("accepted-task-lineage", () => validate(args[1], anchors, head, history, pending));
  for (const [kind, path] of [["evidence", t103Paths[7]], ["product", t103Paths[0]], ["fixture", t103Paths[5]]]) {
    pass("t1-03-authorized-" + kind, () => { assert.ok(history[3].paths.includes(path)); validate("T1-03", anchors, head, history, []); });
  }
  reject("unknown-task", () => validate("UNKNOWN_TASK", anchors, head, history, []), /Unknown task/);
  reject("missing-task-anchor", () => validate("T1-03", { ...anchors, "T1-03": undefined }, head, history, []), /Missing\/tampered/);
  pass("nonexistent-anchor-git-check", () => assert.equal(isAncestor("0".repeat(40), head), false));
  reject("nonancestor-task-anchor", () => validate("T1-01", anchors, t102, history, []), /non-ancestor/);
  for (const spec of accepted) reject("unauthorized-historical-path-" + spec.id, () => {
    const altered = structuredClone(history); altered.find(row => row.commit === spec.commit).paths.push("README.md");
    validate(args[1], anchors, head, altered, []);
  }, /Outside accepted task history/);
  reject("intervening-unrelated-commit", () => {
    const altered = structuredClone(history); altered.splice(3, 0, { commit: "unaccepted", parents: [closure], paths: ["README.md"], subject: "unrelated" });
    validate(args[1], anchors, head, altered, []);
  }, /Unaccepted intervening/);
  reject("unaccepted-descendant", () => validate(args[1], anchors, head, [...history.slice(0, accepted.length), { commit: "unaccepted", parents: [initialClosure], paths: ["README.md"], subject: closureSubject }], []), /Outside accepted closure history/);
  reject("extra-empty-descendant", () => validate(args[1], anchors, head, [...history, ...history.slice(0, 2)], []), /Unaccepted intervening commit count/);
  for (const path of ["README.md", "packages/guard-core/src/reasonCodes.ts", t103Paths[0], t103Paths[5], t103Paths[7]]) {
    reject("unauthorized-pending-" + path, () => validate(args[1], anchors, head, history, [...pending, path]), /Outside current verifier-closure allowlist/);
  }
  reject("tampered-task-allowlist", () => validate(args[1], anchors, head, history, [], { ...declared, "T1-03": [...declared["T1-03"], "README.md"] }), /Tampered accepted task allowlist/);
  reject("dropped-task-allowlist-path", () => validate(args[1], anchors, head, history, [], { ...declared, "T1-03": declared["T1-03"].slice(1) }), /Tampered accepted task allowlist/);
  reject("historical-evidence-wrong-task", () => {
    const altered = structuredClone(history); altered[1].paths.push(t103Paths[7]);
    validate(args[1], anchors, head, altered, []);
  }, /Outside accepted task history: T1-02/);
  reject("historical-evidence-wrong-closure", () => {
    const altered = structuredClone(history); altered[2].paths.push(t103Paths[7]);
    validate(args[1], anchors, head, altered, []);
  }, /Outside accepted task history: T1-02-CLOSURE/);
  reject("second-closure-extra-path", () => validate(args[1], anchors, head, [...history.slice(0, accepted.length), { commit: "unaccepted", parents: [initialClosure], paths: [...repairPaths, "README.md"], subject: closureSubject }], []), /Outside accepted closure history/);
  reject("unaccepted-same-path-commit", () => {
    const altered = structuredClone(history); altered[4].commit = "unaccepted";
    validate(args[1], anchors, head, altered, []);
  }, /Unaccepted intervening commit/);
  const approvedVerifier = fs.readFileSync(verifierPath, "utf8"), approvedEvidence = fs.readFileSync(repairPaths[1]);
  pass("exact-closure-content", () => validateClosureContent(approvedVerifier, approvedEvidence));
  reject("closure-verifier-content-tamper", () => validateClosureContent(approvedVerifier + "\n// unaccepted\n", approvedEvidence), /Unaccepted closure verifier content/);
  reject("closure-evidence-content-tamper", () => validateClosureContent(approvedVerifier, Buffer.concat([approvedEvidence, Buffer.from("unaccepted")])), /Unaccepted closure evidence content/);
  reject("closure-verifier-pin-tamper", () => validateClosureContent(approvedVerifier.replace('const closureVerifierSha256 = "' + closureVerifierSha256, 'const closureVerifierSha256 = "' + "0".repeat(64)), approvedEvidence), /Closure verifier pin changed/);
  reject("closure-evidence-pin-tamper", () => validateClosureContent(approvedVerifier.replace('const closureEvidenceSha256 = "' + closureEvidenceSha256, 'const closureEvidenceSha256 = "' + "0".repeat(64)), approvedEvidence), /Closure evidence pin changed/);
  // Freeze all accepted artifacts at the last semantic task; only the verifier may change in this closure.
  for (const path of [...new Set(accepted.flatMap(item => item.paths))].filter(path => !repairPaths.includes(path))) {
    const preserved = blob(t103, path);
    assert.deepEqual(fs.readFileSync(path), preserved, "Frozen T1-01/T1-02/T1-03 worktree bytes: " + path);
    assert.deepEqual(blob(head, path), preserved, "Frozen T1-01/T1-02/T1-03 committed bytes: " + path);
  }
  for (const path of [...productPaths, "packages/guard-core/src/mesr/repaired/requirements.ts", ...t103Paths.slice(0, 2)]) {
    const source = fs.readFileSync(path, "utf8");
    for (const match of source.matchAll(/(?:from\s+|import\s*\()\s*["']([^"']+)["']/g)) assert.ok(!/scripts|fixtures|gate1|b09/.test(match[1]), "Test dependency: " + path);
  }
  console.log(JSON.stringify({ verifier_lineage_guard: "STRICT", scope: "T1-03-POST-COMMIT-CLOSURE", historical_commits: history.length, controls }));
  return Object.freeze({ validatedPaths: Object.freeze([...new Set([...history.flatMap(item => item.paths), ...pending])]) });
}

async function runStateTask() {
  const { loadStateInputs, requirementCoreInput } = await import("./gate1/b09-product-inputs.mjs");
  const { collectBindingRequirements } = await import("../packages/guard-core/src/mesr/repaired/requirements.ts");
  const rows = loadStateInputs(), core = requirementCoreInput(), trust = testTrust();
  const controlPath = "tests/fixtures/gate1/t1-03-controls.v0.1.json";
  if (before) {
    assert.ok(t103Paths.slice(0,2).every(p => !fs.existsSync(p)), "Before capture must precede product edits");
    assert.ok(!fs.existsSync(controlPath), "Before evidence is immutable");
    const observations = rows.map(row => ({ case_id: row.case_id, input_sha256: digest(row.input), input: row.input, classification: "BEFORE_EXPECTED_GAP", reason: "T1-03 state API absent", collection: collectBindingRequirements(row.input, core, trust) }));
    fs.writeFileSync(controlPath, JSON.stringify({ version: "gate1-t1-03-controls/0.1", task_id: "T1-03", pre_change_head: head, oracle_hash: digest(fs.readFileSync(frozenDir + "oracle.v0.2.json")), observations, legacy: legacyControls(), BEFORE_EXPECTED_GAP: rows.length, BEFORE_PARTIAL_CONFORMANCE: 0, BEFORE_CONFORMS: 0 }, null, 2) + "\n");
    console.log(JSON.stringify({ task: "T1-03", phase: "before", BEFORE_EXPECTED_GAP: rows.length, BEFORE_PARTIAL_CONFORMANCE: 0, BEFORE_CONFORMS: 0 })); return;
  }

  assert.equal(digest(fs.readFileSync(controlPath)), "49ef95636eaf7f8c42feec84679751409bb4a56ade3226dc26249ef2d00eee0f", "Original T1-03 BEFORE capture changed");
  const baseline = readJson(controlPath), oracle = readJson(frozenDir + "oracle.v0.2.json");
  execFileSync("git", ["merge-base", "--is-ancestor", baseline.pre_change_head, head]);
  assert.equal(baseline.oracle_hash, digest(fs.readFileSync(frozenDir + "oracle.v0.2.json")));
  assert.equal(JSON.stringify(legacyControls()), JSON.stringify(baseline.legacy));
  assert.deepEqual(rows.map(r => ({ case_id: r.case_id, input_sha256: digest(r.input) })), baseline.observations.map(r => ({ case_id: r.case_id, input_sha256: r.input_sha256 })));
  const { evaluateClaims, evaluateCompositeClaim } = await import("../packages/guard-core/src/mesr/repaired/evaluateClaim.ts");
  const { CLAIM_STATES } = await import("../packages/guard-core/src/mesr/repaired/claimState.ts");
  const { compareStateResults } = await import("./gate1/b09-product-compare.mjs");
  const run = () => Object.fromEntries(rows.map(r => [r.case_id, evaluateClaims(r.input, core, trust)]));
  const inputHash = digest({ rows, core, trust });
  const outputs = run();
  const comparisons = compareStateResults(rows, outputs, oracle, baseline);
  const replayHashes = [digest(outputs), digest(run()), digest(run())];
  assert.equal(new Set(replayHashes).size, 1); assert.equal(digest({ rows, core, trust }), inputHash);
  const runControls = () => {
  const controls = [];
  let observations = [];
  const check = (name, fn) => { observations = []; fn(); controls.push({ name, result: "PASS", observations }); };
  const source = id => structuredClone(rows.find(r => r.case_id === id).input);
  const evaluate = input => { const result = evaluateClaims(input, core, trust); observations.push(result); return result; };
  const claim = (input, path) => { const result = evaluate(input); assert.equal(result.status, "EVALUATED"); return result.claims.find(c => !path || c.path === path); };
  const generic = () => { const x = source("N04"); x.requests[0].claim = "evidence_presence"; delete x.caller_supported_claim_parts; return x; };
  const booleanProof = value => {
    const x = generic(); delete x.positive_evidence;
    x.evidence_ledger["control:fact"] = { subject: x.subject, scope: x.scope, time: x.bindings.evaluation_time, present: value, predicate: "evidence_presence", semantic_id: "mesr.core.evidence.item", source_ref: "control:measurement" };
    x.state_proofs = [{ path: "generic", claim: "evidence_presence", semantic_id: "mesr.core.evidence.item", semantic_version: "0.1.0", subject: x.subject, scope: x.scope, time: x.bindings.evaluation_time, source_ref: "control:method", criterion: "bound-boolean-equality/0.1", evidence_ref: "control:fact", property: "present", expected: true }];
    return x;
  };
  const staleSource = () => {
    const x = source("N06a"), now = x.bindings.evaluation_time;
    x.evidence_ledger["control:past"] = { subject: x.subject, scope: x.scope, time: "2026-09-14T10:00:00Z", predicate: "standing.current", applicable: true, source_ref: "control:historical-measurement" };
    x.evidence_ledger["control:now"] = { subject: x.subject, scope: x.scope, time: now, predicate: "standing.current", applicable: false, source_ref: "control:loss-measurement" };
    x.state_proofs = [{ path: "current", claim: "standing.current", semantic_id: "mesr.core.temporal.basis", semantic_version: "0.1.0", subject: x.subject, scope: x.scope, time: now, source_ref: "control:loss-rule", criterion: "bound-applicability-loss/0.1", historical_ref: "control:past", current_ref: "control:now" }];
    return x;
  };
  check("exact-six-states", () => assert.deepEqual([...CLAIM_STATES], ["SUPPORTED", "UNSUPPORTED", "UNRESOLVED", "CONFLICTED", "STALE", "INCONCLUSIVE"]));
  check("complete-positive", () => assert.equal(claim(generic()).state, "SUPPORTED"));
  check("complete-explicit-negative", () => { const x = booleanProof(false); delete x.positive_evidence; const c = claim(x); assert.equal(c.state, "UNSUPPORTED"); assert.equal(c.rationale, "COMPLETED_NON_SUPPORT"); });
  check("boolean-positive", () => assert.equal(claim(booleanProof(true)).state, "SUPPORTED"));
  check("missing-not-world-false", () => { const x = generic(); delete x.bindings.provenance; const c = claim(x); assert.equal(c.state, "UNRESOLVED"); assert.equal(c.world_falsity_asserted, false); });
  check("unknown-id-retained", () => { const c = claim(source("N09")); assert.equal(c.state, "UNRESOLVED"); assert.equal(c.unresolved_identities.length, 1); });
  check("unknown-evidence-ref", () => { const x = source("N12.complete"); x.bindings.evidence_refs.push("absent"); assert.equal(claim(x).state, "UNRESOLVED"); });
  check("false-empty-null-missing", () => { for (const value of [false, [], null, "", " "]) { const x = generic(); x.bindings.provenance = value; assert.equal(claim(x).state, "UNRESOLVED"); } });
  check("prohibited-inference-versus-world-question", () => { const r = evaluate(source("N15")); assert.equal(r.claims.find(c => c.path === "producer_inference").state, "UNSUPPORTED"); assert.equal(r.claims.find(c => c.path === "independence").state, "UNRESOLVED"); assert.ok(r.claims.every(c => !c.world_falsity_asserted)); });
  check("caller-positive-cannot-override-core", () => { const x = source("N04"); x.state = "SUPPORTED"; x.caller_supported_claim_parts = [x.requests[0].claim]; assert.equal(claim(x).state, "UNSUPPORTED"); });
  check("caller-cannot-force-any-state", () => { for (const state of CLAIM_STATES) { const x = source("N01"); x.state = state; x.requests.forEach(r => r.state = state); x.atomic_results = [{ state }]; assert.ok(evaluate(x).claims.every(c => c.state === "UNRESOLVED")); } });
  check("caller-contradiction-is-not-proof", () => assert.equal(claim(source("N10")).state, "UNRESOLVED"));
  check("comparable-conflict-attribution", () => { const c = claim(source("N05")); assert.equal(c.state, "CONFLICTED"); assert.equal(c.conflict_refs.length, 2); });
  check("different-subject-time-not-conflict", () => { for (const id of ["N11.subject", "N11.time"]) { const c = claim(source(id)); assert.equal(c.state, "SUPPORTED"); assert.equal(c.conflict_refs.length, 0); assert.equal(c.ignored_evidence.length, 1); } });
  check("conflict-retains-missing-obligation", () => { const x = source("N05"); delete x.bindings.subject; const c = claim(x); assert.equal(c.state, "CONFLICTED"); assert.ok(c.missing_bindings.includes("subject")); });
  check("inconclusive-complete-versus-missing", () => { assert.equal(claim(source("N12.complete")).state, "INCONCLUSIVE"); assert.equal(claim(source("N12.missing")).state, "UNRESOLVED"); });
  check("historical-not-current", () => { const c = claim(source("N06a")); assert.equal(c.state, "UNRESOLVED"); assert.ok(c.historical_basis); });
  check("generic-proven-loss", () => { const c = claim(staleSource()); assert.equal(c.state, "STALE"); assert.ok(c.evaluation_basis.stale[0].historical); assert.ok(c.missing_bindings.includes("currentness")); });
  check("never-valid-not-stale", () => { const x = staleSource(); x.evidence_ledger["control:past"].applicable = false; assert.equal(claim(x).state, "UNRESOLVED"); });
  check("stale-label-not-proof", () => { const x = source("N06a"); x.state = "STALE"; assert.equal(claim(x).state, "UNRESOLVED"); });
  check("proof-value-and-context-falsifiers", () => { for (const mutate of [x => x.state_proofs[0].subject = "other", x => x.state_proofs[0].criterion = "caller:support", x => x.evidence_ledger["control:fact"].present = "true", x => delete x.evidence_ledger["control:fact"], x => x.state_proofs[0].semantic_id = "unknown"]) { const x = booleanProof(true); mutate(x); assert.equal(claim(x).state, "UNRESOLVED"); } });
  check("path-isolation-and-separate-positive", () => { const x = source("N18"); x.requests.push(source("N12.complete").requests[0]); x.events[0].result = "passed"; const r = evaluate(x); assert.equal(r.claims.find(c => c.path === "observation_inference").state, "UNSUPPORTED"); assert.equal(r.claims.find(c => c.path === "pass").state, "SUPPORTED"); for (const c of r.claims) { const alone = structuredClone(x); alone.requests = alone.requests.filter(r => r.path === c.path); assert.deepEqual(claim(alone), c); } });
  check("producer-result-is-not-independent", () => { const r = evaluate(source("N02")); assert.equal(r.claims.find(c => c.path === "pass").state, "SUPPORTED"); assert.equal(r.claims.find(c => c.path === "independence").state, "UNRESOLVED"); });
  check("no-verification-is-not-failed", () => { const r = evaluate(source("N01")); assert.ok(r.claims.every(c => c.state === "UNRESOLVED" && !c.evaluation_basis.negative.length)); });
  check("public-dispositions-not-states", () => { for (const id of ["N16.allow", "N16.block"]) assert.equal(claim(source(id)).state, "UNRESOLVED"); });
  const atomic = [claim(generic()), claim(booleanProof(false)), claim(source("N01"), "occurred"), claim(source("N05")), claim(staleSource()), claim(source("N12.complete"))];
  const prohibited = claim(source("N04"));
  const identity = { claim: "required-evidence-conjunction", ...Object.fromEntries(["subject", "scope", "evaluation_time"].map(k => [k, atomic[0].provenance[k]])), source_ref: "control:conjunction" };
  const composite = (children, required = children.map(c => c.path)) => { const r = evaluateCompositeClaim(identity, required, children); observations.push(r); return r; };
  check("precedence-combinations", () => {
    assert.equal(composite([atomic[1], atomic[2], atomic[4], atomic[3]]).state, "CONFLICTED");
    assert.equal(composite([atomic[1], atomic[2], atomic[4]]).state, "STALE");
    assert.equal(composite([atomic[1], atomic[2]]).state, "UNRESOLVED");
    assert.equal(composite([prohibited, atomic[2], atomic[4], atomic[3]]).state, "UNSUPPORTED");
  });
  check("composite-all-supported", () => { const c = claim(source("N11.subject")); assert.equal(composite([atomic[0], c]).state, "SUPPORTED"); });
  check("composite-unresolved-not-negative", () => { const c = composite([atomic[0], atomic[2]]); assert.equal(c.state, "UNRESOLVED"); assert.equal(c.children.length, 2); });
  check("composite-conflicted", () => assert.equal(composite([atomic[0], atomic[3]]).state, "CONFLICTED"));
  check("composite-stale", () => assert.equal(composite([atomic[0], atomic[4]]).state, "STALE"));
  check("composite-undecidable", () => assert.equal(composite([atomic[0], atomic[5]]).state, "INCONCLUSIVE"));
  check("composite-explicit-negative", () => { const x = booleanProof(false); x.requests[0].path = "presence"; x.state_proofs[0].path = "presence"; assert.equal(composite([atomic[0], claim(x)]).state, "UNSUPPORTED"); });
  check("composite-prohibition-before-conflict", () => assert.equal(composite([prohibited, atomic[3]]).state, "UNSUPPORTED"));
  check("composite-dropped-duplicate-fabricated-child", () => { assert.equal(composite([atomic[0]], ["generic", "pass"]).state, "UNRESOLVED"); assert.equal(composite([atomic[0], atomic[0]], ["generic"]).state, "UNRESOLVED"); assert.equal(composite([structuredClone(atomic[0])]).state, "UNRESOLVED"); assert.equal(composite([], []).state, "UNRESOLVED"); });
  check("composite-permutation", () => assert.deepEqual(composite([atomic[0], atomic[3]]), composite([atomic[3], atomic[0]])));
  check("evidence-and-request-permutations", () => { const x = source("N05"), a = evaluate(x); x.events.reverse(); assert.deepEqual(evaluate(x).claims, a.claims); const n = source("N02"), b = evaluate(n); n.requests.reverse(); n.requests.forEach(r => { r.semantic_ids.reverse(); r.required_bindings.reverse(); }); assert.deepEqual(evaluate(n).claims, b.claims); });
  check("invalid-input-never-supported", () => { for (const x of [null, {}, { ...generic(), registry: { version: "bad", digest: "bad" } }]) { const r = evaluate(x); assert.equal(r.status, "REJECTED"); assert.equal(r.claims.length, 0); } });
  check("corrupted-expectation-fails", () => { const bad = structuredClone(oracle); bad.cases.N04.claims[0].state = "SUPPORTED"; assert.throws(() => compareStateResults(rows, outputs, bad, baseline)); });
  check("withheld-expectation-corruption-fails", () => { const bad = structuredClone(oracle); bad.cases.N06b.claims[0].state = "SUPPORTED"; assert.throws(() => compareStateResults(rows, outputs, bad, baseline)); });
  check("withheld-obligation-loss-fails", () => { const bad = structuredClone(outputs); bad.N06b.claims[0].missing_bindings = ["unrelated"]; assert.throws(() => compareStateResults(rows, bad, oracle, baseline)); });
  check("dropped-result-fails", () => { const bad = { ...outputs }; delete bad.N01; assert.throws(() => compareStateResults(rows, bad, oracle, baseline)); });
  check("false-positive-fails", () => { const bad = structuredClone(outputs); bad.N01.claims[0].state = "SUPPORTED"; assert.throws(() => compareStateResults(rows, bad, oracle, baseline)); });
  check("lost-collection-binding-fails", () => { const bad = structuredClone(outputs); bad.N03.claims[0].collection.missing_bindings = []; assert.throws(() => compareStateResults(rows, bad, oracle, baseline)); });
  check("product-test-import-isolation", () => { for (const p of t103Paths.slice(0, 2)) for (const m of fs.readFileSync(p, "utf8").matchAll(/(?:from\s+|import\s*\()\s*["']([^"']+)["']/g)) assert.ok(!/scripts|fixtures|gate1|b09/.test(m[1])); });
  check("different-scope-not-conflict", () => { const x = source("N05"); x.events[1].scope = "other-scope"; const c = claim(x); assert.equal(c.state, "SUPPORTED"); assert.equal(c.conflict_refs.length, 0); });
  check("different-predicate-not-conflict-or-support", () => { const x = source("N05"); x.events[1].property = "different-property"; const c = claim(x); assert.equal(c.state, "UNRESOLVED"); assert.equal(c.conflict_refs.length, 0); });
  check("result-conflict-is-not-occurrence-conflict", () => { const x = source("N05"); x.requests[0].claim = "verification.occurred"; assert.equal(claim(x).state, "SUPPORTED"); });
  check("false-expected-and-arbitrary-property-rejected", () => { for (const edit of [x => x.state_proofs[0].expected = false, x => x.state_proofs[0].property = "unrelated", x => x.evidence_ledger["control:fact"].predicate = "other-claim", x => delete x.evidence_ledger["control:fact"].source_ref]) { const x = booleanProof(true); edit(x); assert.equal(claim(x).state, "UNRESOLVED"); } });
  check("malformed-proof-never-supported", () => { for (const proof of [null, {}, [null], [{ path: "unrequested" }]]) { const x = generic(); x.state_proofs = proof; assert.equal(evaluate(x).status, "REJECTED"); } });
  check("producer-label-without-bound-record", () => { const x = source("N11.subject"); x.events = [{ result: "passed" }]; assert.equal(claim(x).state, "UNRESOLVED"); });
  check("cross-event-output-reference", () => { const x = source("N11.subject"); x.evidence_ledger["fixture:test-output"].event_id = "other-check"; assert.equal(claim(x).state, "UNRESOLVED"); });
  check("invalid-evaluation-time", () => { const x = generic(); x.bindings.evaluation_time = "invalid"; assert.equal(claim(x).state, "UNRESOLVED"); });
  check("unrequested-composite-child-preserved", () => { const r = composite([atomic[0], atomic[3]], ["generic"]); assert.equal(r.state, "UNRESOLVED"); assert.equal(r.supplied_children.length, 2); });
  check("composite-context-mismatch", () => { const r = evaluateCompositeClaim({ ...identity, scope: "other" }, [atomic[0].path], [atomic[0]]); assert.equal(r.state, "UNRESOLVED"); assert.equal(r.supplied_children.length, 1); observations.push(r); });
  check("composite-invalid-shape-is-error", () => assert.throws(() => evaluateCompositeClaim(null, [], []), TypeError));
  check("selector-not-callable-with-caller-flags", () => assert.ok(!fs.readFileSync(t103Paths[1], "utf8").includes("export function selectClaimState")));
  return controls;
  };
  const controls = runControls();
  const fullReplayHashes = [digest({ outputs, controls }), digest({ outputs: run(), controls: runControls() }), digest({ outputs: run(), controls: runControls() })];
  assert.equal(new Set(fullReplayHashes).size, 1, "Full atomic/composite/control replay drift");
  const counts = Object.fromEntries(["EXPECTED_GAP_CLOSED", "PARTIAL_CONFORMANCE_IMPROVED", "UNCHANGED_CONFORMING", "UNCHANGED_EXPECTED_GAP", "NEW_REGRESSION"].map(k => [k, comparisons.filter(r => r.classification === k).length]));
  const result = { version: "gate1-t1-03-results/0.1", task_id: "T1-03", pre_change_head: head, post_change_head: null, worktree_state: "UNCOMMITTED", before_sha256: digest(fs.readFileSync(controlPath)), oracle_hash: baseline.oracle_hash,
    source_hashes: Object.fromEntries(t103Paths.slice(0, 5).map(p => [p, digest(fs.readFileSync(p))])), outputs, comparisons, supplemental_controls: controls, product_replay_hashes: replayHashes, replay_hashes: fullReplayHashes, result_hash: fullReplayHashes[0], counts, legacy_byte_equality: true, frozen_files: pins.files.length, semantic_composition: "WITHHELD_FOR_T1_04" };
  if (record) fs.writeFileSync("tests/fixtures/gate1/t1-03-results.v0.1.json", JSON.stringify(result, null, 2) + "\n");
  console.log(JSON.stringify({ task: "T1-03", cases: rows.length, controls: controls.length, ...counts, replay_hashes: fullReplayHashes, result_hash: fullReplayHashes[0] }));
}
