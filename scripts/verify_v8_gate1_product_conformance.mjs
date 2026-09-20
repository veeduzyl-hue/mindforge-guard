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
assert.equal(args[0], "--task"); assert.ok(["T1-01", "T1-02", "T1-03", "T1-04", "T2-01"].includes(args[1]));
assert.ok(args.slice(2).every(arg => ["--before", "--record", "--scope-only", "--regressions"].includes(arg)));
const before = args.includes("--before"), record = args.includes("--record");
const fixturePath = "tests/fixtures/gate1/t1-01-controls.v0.1.json";
const resultPath = "tests/fixtures/gate1/t1-01-results.v0.1.json";
const productPaths = ["admission.ts", "contracts.ts", "canonicalBytes.ts"].map(p => "packages/guard-core/src/mesr/repaired/" + p);
const t102Paths = ["packages/guard-core/src/mesr/repaired/requirements.ts", "scripts/verify_v8_gate1_product_conformance.mjs", "scripts/gate1/b09-product-inputs.mjs", "scripts/gate1/b09-product-compare.mjs", "tests/fixtures/gate1/t1-02-controls.v0.1.json", "tests/fixtures/gate1/t1-02-results.v0.1.json", "docs/validation/v8-gate1-t1-02-evidence-v0.1.md"];
const t103Paths = ["packages/guard-core/src/mesr/repaired/claimState.ts", "packages/guard-core/src/mesr/repaired/evaluateClaim.ts", "scripts/verify_v8_gate1_product_conformance.mjs", "scripts/gate1/b09-product-inputs.mjs", "scripts/gate1/b09-product-compare.mjs", "tests/fixtures/gate1/t1-03-controls.v0.1.json", "tests/fixtures/gate1/t1-03-results.v0.1.json", "docs/validation/v8-gate1-t1-03-evidence-v0.1.md"];
const head = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const t104Anchor = "ef3e5b7fbcd8854d99a680bf532816b50cc851cd";
const t104Paths = ["packages/guard-core/src/mesr/repaired/composition.ts", "scripts/verify_v8_gate1_product_conformance.mjs", "scripts/gate1/b09-product-inputs.mjs", "scripts/gate1/b09-product-compare.mjs", "tests/fixtures/gate1/t1-04-controls.v0.1.json", "tests/fixtures/gate1/t1-04-results.v0.1.json", "docs/validation/v8-gate1-t1-04-evidence-v0.1.md"];
const taskScope = args[1] === "T2-01" ? assertT201PreservationScope() : assertTaskScope();
if (args.includes("--regressions")) assert.equal(args[1], "T1-04");
if (args.includes("--scope-only")) { assert.equal(args[1], "T1-04"); console.log("T1-04 pre-change recognized: PASS"); process.exit(0); }
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

if (args[1] === "T2-01") { await runT201Task(); } else if (args[1] === "T1-04") { await runCompositionTask(); } else if (args[1] === "T1-03") { await runStateTask(); } else if (args[1] === "T1-02") { await runRequirementsTask(); } else {
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
  const t104 = "14ffe82625313f75076d8dcc39950770523c128e";
  const verifierPath = "scripts/verify_v8_gate1_product_conformance.mjs";
  const t104ClosurePaths = [verifierPath, "docs/validation/v8-gate1-t1-04-post-commit-verifier-closure-v0.1.md"];
  const t104ClosureSubject = "test(v8): register accepted T1-04 lineage";
  // Admit exactly one closure by parent, subject, exact paths and pinned content.
  // Normalize only these two declarations to avoid a self-referential digest.
  const t104ClosureVerifierSha256 = "2ea770c095b4668fa54076b752e8eb762beed0f05c932a1d281d64e305225a60";
  const t104ClosureEvidenceSha256 = "322376787ece2b7c321c93d3822bb8aa0278ccf8d6f537add8ef1f04ad53f7cf";
  const normalizedT104Verifier = text => text.replace(/^  const t104Closure(?:Verifier|Evidence)Sha256 = "[0-9a-f]{64}";$/gm, line => line.replace(/"[0-9a-f]{64}"/, '"<PIN>"'));
  const closurePaths = [verifierPath, "docs/validation/v8-gate1-t1-02-post-commit-verifier-closure-v0.1.md"];
  const repairPaths = [verifierPath, "docs/validation/v8-gate1-t1-03-post-commit-verifier-closure-v0.1.md"];
  // Only these two digest declarations are normalized, avoiding a self-referential commit pin.
  // A future closure is admitted by exact content, parent, subject and complete path set once.
  const closureVerifierSha256 = "290e69204d2404767fcbde923acad03bc5208763e3486791687928443adf8f43";
  const closureEvidenceSha256 = "a14fa6b5a7910d60099bc11b4c1dbf16448a04049ddaacc4ad604f426e594c47";
  const closureSubject = "test(v8): complete task-attributed Gate1 history validation";
  const normalizedVerifier = text => text.replace(/^  const closure(?:Verifier|Evidence)Sha256 = "[0-9a-f]{64}";$/gm, line => line.replace(/"[0-9a-f]{64}"/, '"<PIN>"'));
  const git = (...gitArgs) => execFileSync("git", gitArgs, { encoding: "utf8", stdio: "pipe", maxBuffer: 30_000_000 }).trim();
  const blob = (commit, path) => execFileSync("git", ["cat-file", "blob", commit + ":" + path], { maxBuffer: 128_000_000 });
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
    { id: "T1-03-CLOSURE-INITIAL", commit: initialClosure, parent: t103, paths: repairPaths },
    { id: "T1-03-CLOSURE-FINAL", commit: t104Anchor, parent: initialClosure, paths: repairPaths },
    { id: "T1-04", commit: t104, parent: t104Anchor, paths: t104Paths, heading: "Exact seven-path allowlist" }
  ];
  const anchors = { "T1-01": t101, "T1-02": t102, "T1-03": t103, "T1-04": t104 };
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
  const validateT104ClosureContent = (verifier, evidence) => {
    assert.equal(digest(normalizedT104Verifier(verifier)), t104ClosureVerifierSha256, "Unaccepted T1-04 closure verifier content");
    assert.ok(verifier.includes('const t104ClosureVerifierSha256 = "' + t104ClosureVerifierSha256 + '";'), "T1-04 closure verifier pin changed");
    assert.ok(verifier.includes('const t104ClosureEvidenceSha256 = "' + t104ClosureEvidenceSha256 + '";'), "T1-04 closure evidence pin changed");
    assert.equal(digest(evidence), t104ClosureEvidenceSha256, "Unaccepted T1-04 closure evidence content");
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
      assert.deepEqual(actual.parents, [t104], "Follow-up closure must be the sole direct child of accepted T1-04");
      assert.equal(actual.subject, t104ClosureSubject, "Unaccepted closure subject");
      assert.deepEqual(sorted(actual.paths), sorted(t104ClosurePaths), "Outside accepted closure history");
      validateT104ClosureContent(blob(actual.commit, verifierPath).toString("utf8"), blob(actual.commit, t104ClosurePaths[1]));
    }
    assert.equal(current, history.at(-1).commit, "HEAD must be the last attributed commit");
    assert.deepEqual(sorted(allowlists["T1-04"] ?? []), sorted(t104Paths), "Tampered accepted task allowlist: T1-04");
    for (const path of pending) assert.ok(t104ClosurePaths.includes(path), "Outside current verifier-closure allowlist: " + path);
  };
  assert.ok(["feat/v8-gate1-tranche1-t1-04-v0.1", "validation/v8-gate1-tranche1-formal-closure-v0.1"].includes(git("branch", "--show-current")), "T1-04 branch mismatch");
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
  reject("unaccepted-descendant", () => validate(args[1], anchors, head, [...history.slice(0, accepted.length), { commit: "unaccepted", parents: [t104], paths: ["README.md"], subject: t104ClosureSubject }], []), /Outside accepted closure history/);
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
  reject("second-closure-extra-path", () => validate(args[1], anchors, head, [...history.slice(0, accepted.length), { commit: "unaccepted", parents: [t104], paths: [...t104ClosurePaths, "README.md"], subject: t104ClosureSubject }], []), /Outside accepted closure history/);
  reject("unaccepted-same-path-commit", () => {
    const altered = structuredClone(history); altered[4].commit = "unaccepted";
    validate(args[1], anchors, head, altered, []);
  }, /Unaccepted intervening commit/);
  // Validate accepted closure bytes from Git; pending shared tooling belongs to T1-04.
  const approvedVerifier = blob(t104Anchor, verifierPath).toString("utf8"), approvedEvidence = fs.readFileSync(repairPaths[1]);
  pass("exact-closure-content", () => validateClosureContent(approvedVerifier, approvedEvidence));
  reject("closure-verifier-content-tamper", () => validateClosureContent(approvedVerifier + "\n// unaccepted\n", approvedEvidence), /Unaccepted closure verifier content/);
  reject("closure-evidence-content-tamper", () => validateClosureContent(approvedVerifier, Buffer.concat([approvedEvidence, Buffer.from("unaccepted")])), /Unaccepted closure evidence content/);
  reject("closure-verifier-pin-tamper", () => validateClosureContent(approvedVerifier.replace('const closureVerifierSha256 = "' + closureVerifierSha256, 'const closureVerifierSha256 = "' + "0".repeat(64)), approvedEvidence), /Closure verifier pin changed/);
  reject("closure-evidence-pin-tamper", () => validateClosureContent(approvedVerifier.replace('const closureEvidenceSha256 = "' + closureEvidenceSha256, 'const closureEvidenceSha256 = "' + "0".repeat(64)), approvedEvidence), /Closure evidence pin changed/);
  // Latest accepted owner supplies each current blob; earlier shared-tool blobs
  // remain immutable in their exact registered commits, not compared to newer versions.
  const latestOwner = new Map(accepted.flatMap(item => item.paths.map(path => [path, item.commit])));
  for (const [path, owner] of latestOwner) {
    if (path === verifierPath) continue; // exact closure content checked separately below
    const preserved = blob(owner, path);
    assert.deepEqual(fs.readFileSync(path), preserved, "Frozen accepted worktree bytes: " + path);
    assert.deepEqual(blob(head, path), preserved, "Frozen accepted committed bytes: " + path);
  }
  const currentVerifier = fs.readFileSync(verifierPath, "utf8"), currentEvidence = fs.readFileSync(t104ClosurePaths[1]);
  pass("exact-t1-04-closure-content", () => validateT104ClosureContent(currentVerifier, currentEvidence));
  reject("t1-04-closure-verifier-content-tamper", () => validateT104ClosureContent(currentVerifier + "\n// unaccepted\n", currentEvidence), /Unaccepted T1-04 closure verifier content/);
  reject("t1-04-closure-evidence-content-tamper", () => validateT104ClosureContent(currentVerifier, Buffer.concat([currentEvidence, Buffer.from("unaccepted")])), /Unaccepted T1-04 closure evidence content/);
  reject("t1-04-closure-verifier-pin-tamper", () => validateT104ClosureContent(currentVerifier.replace('const t104ClosureVerifierSha256 = "' + t104ClosureVerifierSha256, 'const t104ClosureVerifierSha256 = "' + "0".repeat(64)), currentEvidence), /T1-04 closure verifier pin changed/);
  reject("t1-04-closure-evidence-pin-tamper", () => validateT104ClosureContent(currentVerifier.replace('const t104ClosureEvidenceSha256 = "' + t104ClosureEvidenceSha256, 'const t104ClosureEvidenceSha256 = "' + "0".repeat(64)), currentEvidence), /T1-04 closure evidence pin changed/);
  reject("unauthorized-closure-subject", () => validate(args[1], anchors, head, [...history.slice(0, accepted.length), { commit: "unaccepted", parents: [t104], paths: t104ClosurePaths, subject: "unrelated" }], []), /Unaccepted closure subject/);
  reject("unauthorized-closure-parent", () => validate(args[1], anchors, head, [...history.slice(0, accepted.length), { commit: "unaccepted", parents: [initialClosure], paths: t104ClosurePaths, subject: t104ClosureSubject }], []), /sole direct child/);
  reject("unknown-task-commit", () => {
    const altered = structuredClone(history); altered[6].commit = "unaccepted";
    validate(args[1], anchors, head, altered, []);
  }, /Unaccepted intervening commit/);
  for (const path of [...productPaths, "packages/guard-core/src/mesr/repaired/requirements.ts", ...t103Paths.slice(0, 2)]) {
    const source = fs.readFileSync(path, "utf8");
    for (const match of source.matchAll(/(?:from\s+|import\s*\()\s*["']([^"']+)["']/g)) assert.ok(!/scripts|fixtures|gate1|b09/.test(match[1]), "Test dependency: " + path);
  }
  reject("tampered-t1-04-allowlist", () => validate("T1-04", anchors, head, history, [], { ...declared, "T1-04": [...t104Paths, "README.md"] }), /Tampered accepted task allowlist/);
  reject("missing-t1-04-anchor", () => validate("T1-04", { ...anchors, "T1-04": undefined }, head, history, []), /Missing\/tampered/);
  for (const path of t104Paths) pass("t1-04-authorized-" + path, () => { assert.ok(history[6].paths.includes(path)); validate("T1-04", anchors, head, history, []); });
  for (const path of t104Paths.filter(path => path !== verifierPath)) reject("t1-04-frozen-pending-" + path, () => validate("T1-04", anchors, head, history, [path]), /Outside current verifier-closure allowlist/);
  for (const path of t104ClosurePaths) pass("t1-04-closure-authorized-" + path, () => validate("T1-04", anchors, head, history, [path]));
  console.log(JSON.stringify({ verifier_lineage_guard: "STRICT", scope: "T1-04", historical_commits: history.length, head, closure_commit: history.length > accepted.length ? history.at(-1).commit : null, controls }));
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

// T1-04 owns composition only. Test adapters never supply expected diagnostics.
function compositionRegressions() {
  const suites = [
    "verify_mesr_registry", "verify_mesr_reason_bindings", "verify_mesr_claim_stability", "verify_mesr_composition", "verify_mesr_runtime_portability", "verify_mesr_cross_domain", "verify_mesr_apaai_crosswalk",
    "verify_v8_runtime_compatibility", "verify_v8_institutional_artifact_readiness",
    "verify_governance_surface", "verify_governance_consumption_profile", "verify_audit_permit_gate", "verify_v7_0_example_evidence_pack", "verify_v7_0_1_license_hub_after_purchase_copy", "verify_v7_0_1_public_surface_consistency", "verify_v7_0_1_current_docs_baseline", "verify_v7_0_1_github_action_first_report"
  ];
  return suites.map(suite => {
    const path = "scripts/" + suite + ".mjs";
    const stdout = execFileSync(process.execPath, [path], { encoding: "utf8", maxBuffer: 20_000_000 });
    console.log("T1-04 regression PASS: " + suite);
    return { command: "node " + path, exit_code: 0, stdout, stdout_sha256: digest(stdout), source_sha256: digest(fs.readFileSync(path)) };
  });
}
async function runCompositionTask() {
  const { loadCompositionInputs, loadCoreProbes, requirementCoreInput } = await import("./gate1/b09-product-inputs.mjs");
  const { inspectCanonicalAdmission } = await import("../packages/guard-core/src/mesr/repaired/admission.ts");
  const { evaluateClaims } = await import("../packages/guard-core/src/mesr/repaired/evaluateClaim.ts");
  const rows = loadCompositionInputs(), probes = loadCoreProbes(), trust = testTrust(), core = requirementCoreInput();
  const controlPath = t104Paths[4];
  if (before) {
    assert.ok(!fs.existsSync(t104Paths[0]), "Before must precede composition implementation");
    assert.ok(!fs.existsSync(controlPath), "Never overwrite T1-04 BEFORE evidence");
    const observations = rows.map(row => {
      const admission = inspectCanonicalAdmission(row.input, trust);
      const legacy = admission.input_issues.length ? { status: "NOT_CALLED_SHAPE_REJECTION" } : composeMesrModules(row.input.modules);
      return { case_id: row.case_id, input_sha256: digest(row.input), input: row.input, admission, legacy,
        classification: "BEFORE_EXPECTED_GAP", basis: "T1-04 composition API absent; earlier admission/legacy behavior retained separately, not T1-04 closure" };
    });
    const probeObservations = probes.map(probe => ({ ...probe, core_output: evaluateClaims(probe.input, core, trust), contextual_output: null, classification: "BEFORE_EXPECTED_GAP", basis: "No admitted composition consumer; Core-only product evaluation observed" }));
    const regressions = compositionRegressions();
    const sources = [...productPaths, ...t102Paths.slice(0,1), ...t103Paths.slice(0,2), ...t104Paths.slice(1,4), "packages/guard-core/src/mesr/moduleManifest.ts", "docs/planning/21_GATE1_IMPLEMENTATION_PLAN.md", "docs/planning/22_GATE1_CHANGE_CONTROL_CONTRACT.md", "docs/adr/0010-mesr-canonical-id-relation-and-admission-contract.md", "docs/adr/0011-mesr-claim-nonclaim-state-and-binding-contract.md", "docs/adr/0016-mesr-module-version-lock-and-noninterference-contract.md", "docs/validation/v8-b08-composition-hardening-cases-v0.1.md"];
    const capture = { version: "gate1-t1-04-controls/0.1", task_id: "T1-04", pre_change_head: head, file_allowlist: t104Paths,
      oracle_hash: digest(fs.readFileSync(frozenDir + "oracle.v0.2.json")), source_hashes: Object.fromEntries(sources.map(p => [p, digest(fs.readFileSync(p))])),
      BEFORE_CONFORMING: 0, BEFORE_PARTIAL_CONFORMANCE: 0, BEFORE_EXPECTED_GAP: rows.length, observations, probes: probeObservations, regressions, legacy: legacyControls(), runtime: { node: process.version, icu: process.versions.icu }, frozen_files: pins.files.length };
    fs.writeFileSync(controlPath, JSON.stringify(capture, null, 2) + "\n");
    console.log(JSON.stringify({ task: "T1-04", phase: "before", cases: rows.length, c_cases: 41, probes: probes.length, regressions: regressions.length, capture_sha256: digest(fs.readFileSync(controlPath)) }));
    return;
  }
  assert.equal(digest(fs.readFileSync(controlPath)), "a9de9d4c1b25751efc217ae01457be56caede29ba058a9693f9329417fe06f6f", "Original T1-04 BEFORE bytes changed");
  const baseline = readJson(controlPath);
  assert.equal(baseline.pre_change_head, t104Anchor);
  assert.deepEqual(baseline.file_allowlist, t104Paths);
  assert.deepEqual(rows.map(r => [r.case_id, digest(r.input)]), baseline.observations.map(r => [r.case_id, r.input_sha256]));
  assert.deepEqual(probes, baseline.probes.map(({ id, facet, binding, nonclaim, input }) => ({ id, facet, ...(binding ? { binding } : {}), ...(nonclaim ? { nonclaim } : {}), input })));
  assert.deepEqual(JSON.parse(JSON.stringify(legacyControls())), baseline.legacy, "Legacy parser/validator/report/reason serialized bytes changed");
  assert.equal(process.version, baseline.runtime.node); assert.equal(process.versions.icu, baseline.runtime.icu);
  const { composePinnedModules, collectComposedRequirements } = await import("../packages/guard-core/src/mesr/repaired/composition.ts");
  const { collectBindingRequirements } = await import("../packages/guard-core/src/mesr/repaired/requirements.ts");
  const { compositionTrust } = await import("./gate1/b09-product-inputs.mjs");
  const { compareCompositions } = await import("./gate1/b09-product-compare.mjs");
  const oracle = readJson(frozenDir + "oracle.v0.2.json"), hardening = readJson(frozenDir + "admission-hardening.v0.1.json");
  const compositionBasis = compositionTrust();
  const compose = input => composePinnedModules(input, compositionBasis);
  const source = id => structuredClone(rows.find(r => r.case_id === id).input);
  const reject = input => {
    const output = compose(input); assert.equal(output.status, "INVALID_COMPOSITION");
    for (const key of ["semantic_entries", "mappings", "profiles", "requirements", "nonclaims", "resolved_modules"]) assert.deepEqual(output[key], []);
    assert.equal(output.core_basis_input, null); assert.ok(output.diagnostics.length); return output;
  };
  const relock = input => {
    const byId = new Map(input.modules.map(m => [m.module_id, m]));
    input.raw_manifests = Object.fromEntries(input.modules.map(m => [m.module_id, canonical(m)]));
    input.lock = input.modules.map(m => ({ module_id: m.module_id, version: m.version, byte_digest: digest(input.raw_manifests[m.module_id]), content_digest: digest(m), byte_length: Buffer.byteLength(input.raw_manifests[m.module_id]), dependencies: m.dependencies.map(d => ({ ...d, content_digest: byId.has(d.module_id) ? digest(byId.get(d.module_id)) : "0".repeat(64) })) }));
    return input;
  };
  const permutations = list => list.length ? list.flatMap((item, i) => permutations(list.filter((_, j) => i !== j)).map(rest => [item, ...rest])) : [[]];
  function execute() {
    const outputs = {};
    for (const row of rows) {
      const unchanged = canonical(row.input), trustBytes = canonical(compositionBasis);
      outputs[row.case_id] = compose(row.input);
      assert.equal(canonical(row.input), unchanged, "Product input mutation"); assert.equal(canonical(compositionBasis), trustBytes, "Trust mutation");
      if (outputs[row.case_id].legacy_resolver_called) assert.deepEqual(outputs[row.case_id].legacy_issues, composeMesrModules(row.input.modules).issues, "Legacy diagnostic equality: " + row.case_id);
      else assert.deepEqual(outputs[row.case_id].legacy_issues, []);
      // Admission diagnostics remain complete even when a more specific composition
      // diagnostic explains the umbrella failure. No raw error is discarded.
      assert.deepEqual(outputs[row.case_id].admission.diagnostics, inspectCanonicalAdmission(row.input, compositionBasis).diagnostics);
      if (row.case_id.startsWith("C")) assert.equal(digest(row.input), oracle.fixture_input_digests[row.case_id]);
    }
    const comparisons = compareCompositions(rows, outputs, oracle, hardening);
    const valid = compose(source("C01")), descriptive = compose(source("C24"));
    const coreModule = valid.core_basis_input.modules[0];
    assert.deepEqual(coreModule.added_semantics, valid.semantic_entries.filter(e => e.namespace === "mesr.core"));
    assert.deepEqual(coreModule, core.modules[0], "Complete Core manifest equality");
    const probeResults = probes.map((probe, i) => {
      const base = evaluateClaims(probe.input, core, compositionBasis);
      assert.deepEqual(base, baseline.probes[i].core_output, "Protected pre-change state/predicate/provenance changed");
      const composedCollection = collectComposedRequirements(probe.input, valid, compositionBasis);
      assert.deepEqual(composedCollection, collectBindingRequirements(probe.input, core, compositionBasis), "Composition changed Core binding union");
      const contextual = evaluateClaims(probe.input, valid.core_basis_input, compositionBasis);
      assert.deepEqual(contextual, base, "T1_04_CORE_NONINTERFERENCE_FAIL: " + probe.id);
      assert.deepEqual(evaluateClaims(probe.input, descriptive.core_basis_input, compositionBasis), base, "Descriptive edges changed Core state");
      assert.equal(contextual.claims.length, 1);
      if (probe.facet === "nonclaim") { assert.equal(contextual.claims[0].state, "UNSUPPORTED"); assert.ok(contextual.claims[0].nonclaims.includes(probe.nonclaim)); }
      if (probe.facet === "binding") assert.ok(contextual.claims[0].missing_bindings.includes(probe.binding), "Required binding weakened: " + probe.id);
      return { id: probe.id, facet: probe.facet, input_sha256: digest(probe.input), before_output_sha256: digest(baseline.probes[i].core_output), core_output_sha256: digest(base), composed_output: contextual, collection_sha256: digest(composedCollection), descriptive_output_sha256: digest(base), outcome: "PASS" };
    });
    const permutationResults = [];
    for (const id of ["C01", "C24"]) for (const order of permutations(source(id).modules.map(m => m.module_id))) {
      const input = source(id); input.modules = order.map(id => input.modules.find(m => m.module_id === id)); input.lock.reverse(); input.relations.reverse();
      const output = compose(input); assert.equal(canonical(output), canonical(outputs[id]), "Permutation changed full canonical output: " + id);
      permutationResults.push({ case_id: id, order, output_sha256: digest(output), outcome: "PASS" });
    }
    for (const row of rows) {
      const input = structuredClone(row.input); if (Array.isArray(input.modules)) input.modules.reverse(); if (Array.isArray(input.lock)) input.lock.reverse(); if (Array.isArray(input.relations)) input.relations.reverse();
      assert.equal(canonical(compose(input)), canonical(outputs[row.case_id]), "Negative permutation drift: " + row.case_id);
      permutationResults.push({ case_id: row.case_id, order: "reversed", output_sha256: digest(outputs[row.case_id]), outcome: "PASS" });
    }
    const controls = [];
    const check = (id, fn) => { const observation = fn(); controls.push({ id, outcome: "PASS", ...(observation === undefined ? {} : { observation }) }); };
    const mutate = (id, fn, rewrite = false) => check(id, () => {
      const input = source("C01"); fn(input); if (rewrite) relock(input);
      const result = reject(input), reversed = structuredClone(input);
      reversed.modules.reverse(); if (Array.isArray(reversed.lock)) reversed.lock.reverse(); if (Array.isArray(reversed.relations)) reversed.relations.reverse();
      assert.equal(canonical(reject(reversed)), canonical(result), "Supplemental permutation drift: " + id); return result;
    });
    mutate("caller-forced-valid", x => { x.valid = true; x.status = "VALID_COMPOSITION"; });
    mutate("caller-forced-resolution", x => { x.resolved_modules = x.modules; });
    mutate("unproved-conformance", x => { x.admission_basis = { conformant: true }; });
    mutate("core-definition-override", x => { x.modules[0].added_semantics[0].definition = "Changed meaning"; }, true);
    mutate("core-support-widening", x => { x.modules[0].added_semantics[0].supports.push(x.modules[0].added_semantics[0].does_not_support[0]); }, true);
    mutate("core-nonclaim-removal", x => { x.modules[0].added_semantics[0].does_not_support = []; }, true);
    mutate("core-binding-removal", x => { x.modules[0].added_semantics[0].required_bindings = []; }, true);
    mutate("core-predicate-weakening", x => { x.modules[0].added_semantics[0].binding_predicates = { principal_id: "presence" }; }, true);
    mutate("profile-nonclaim-masking", x => { x.effective_changes = [{ kind: "nonclaim_removal", module_id: x.modules[3].module_id, claim: "authority" }]; });
    mutate("profile-support-inversion", x => { x.effective_changes = [{ kind: "support_widening", module_id: x.modules[3].module_id, claim: "authority" }]; });
    mutate("unknown-effective-change", x => { x.effective_changes = [{ kind: "state_precedence", module_id: x.modules[3].module_id, claim: "approval" }]; });
    mutate("duplicate-semantic-across-modules", x => { x.modules[1].added_semantics.push(structuredClone(x.modules[0].added_semantics[0])); }, true);
    mutate("duplicate-conflicting-module", x => { const duplicate = structuredClone(x.modules[3]); duplicate.presentation.label = "conflicting"; x.modules.push(duplicate); }, true);
    mutate("unknown-dependency", x => { x.modules[1].dependencies.push({ module_id: "unknown", version: "0.1.0" }); }, true);
    mutate("dependency-digest-mismatch", x => { x.lock[1].dependencies[0].content_digest = "0".repeat(64); });
    mutate("module-version-mismatch", x => { x.modules[1].version = "9.0.0"; });
    mutate("unknown-module-identity", x => { x.modules[1].module_id = "unknown"; }, true);
    mutate("acyclic-name-only-alias", x => { x.relations = [{ type: "alias", from: "identity", to: "authority" }]; });
    mutate("alias-self-cycle", x => { x.relations = [{ type: "alias", from: "A", to: "A" }]; });
    mutate("unproved-lifecycle-endpoints", x => { x.relations = [{ type: "supersedes", from: "A", to: "B" }]; });
    mutate("unproved-equivalence-activation", x => { x.relations = [{ type: "entails", from: "identity", to: "authority", activate: true }]; });
    mutate("unknown-relation", x => { x.relations = [{ type: "same_as", from: "A", to: "B" }]; });
    mutate("crosswalk-cannot-be-alias", x => { x.modules[2].mappings[0].mapping_relation = "alias"; }, true);
    mutate("missing-context-proof", x => { delete x.context_versions; });
    mutate("partial-activation-attempt", x => { x.modules[3].semantic_overrides = [{ left: "verification", right: "acceptance" }]; }, true);
    mutate("self-authored-byte-and-proof-lock", x => { x.modules[1].added_semantics[0].definition = "changed"; x.admission_basis.module_digests[1].digest = digest(x.modules[1]); }, true);
    check("trusted-label-cannot-admit-new-core-inventory", () => {
      const x = relock(source("C01")); x.modules[1].added_semantics[0].definition = "Unadmitted interpretation"; relock(x);
      const t = structuredClone(compositionBasis); t.modules = structuredClone(x.modules); t.proof.module_digests = x.modules.map(m => ({ module_id: m.module_id, digest: digest(m) })); t.proof_digest = digest(t.proof); x.admission_basis = structuredClone(t.proof);
      const result = composePinnedModules(x, t); assert.equal(result.status, "INVALID_COMPOSITION"); assert.deepEqual(result.semantic_entries, []); return result;
    });
    check("empty-compatibility-dossier-rejected", () => {
      const x = source("C01"), t = structuredClone(compositionBasis);
      for (const id of Object.keys(t.context_versions)) { t.context_versions[id] = {}; x.context_versions[id] = {}; }
      const r = composePinnedModules(x, t); assert.equal(r.status, "INVALID_COMPOSITION"); assert.deepEqual(r.semantic_entries, []); return r;
    });
    mutate("duplicate-manifest-key-rejected", x => { const id = x.modules[0].module_id; x.raw_manifests[id] = '{"module_id":"mesr.core",' + x.raw_manifests[id].slice(1); });
    check("invalid-json-and-malformed-shapes", () => {
      const cyclic = {}; cyclic.self = cyclic;
      for (const value of [null, {}, [], cyclic, { ...source("C01"), modules: [null] }, { ...source("C01"), lock: {} }]) reject(value);
    });
    check("unexpected-helper-error-propagates", () => {
      const value = new Proxy({}, { ownKeys() { throw new Error("injected helper failure"); } });
      assert.throws(() => compose(value), /injected helper failure/);
    });
    check("consumer-rejects-fabricated-valid-and-rejection", () => {
      for (const candidate of [{ status: "VALID_COMPOSITION", core_basis_input: core }, structuredClone(valid), outputs.C02]) assert.throws(() => collectComposedRequirements(probes[0].input, candidate, compositionBasis), /in-process admitted/);
    });
    check("return-and-input-isolation", () => {
      const input = source("C01"), r = compose(input); assert.throws(() => { r.semantic_entries[0].supports.push("authority"); }, TypeError);
      assert.equal(Object.isFrozen(input.modules[0]), false); assert.deepEqual(compose(input), r);
    });
    check("corrupt-oracle-rejected", () => { const altered = structuredClone(oracle); altered.cases.C01.status = "INVALID_COMPOSITION"; assert.throws(() => compareCompositions(rows, outputs, altered, hardening)); });
    check("lost-required-diagnostic-rejected", () => { const altered = structuredClone(outputs); altered.C09.diagnostics = []; assert.throws(() => compareCompositions(rows, altered, oracle, hardening)); });
    check("dropped-result-rejected", () => { const altered = { ...outputs }; delete altered.C01; assert.throws(() => compareCompositions(rows, altered, oracle, hardening)); });
    check("deliberate-false-positive-rejected", () => { const altered = structuredClone(outputs); altered.C02.status = "VALID_COMPOSITION"; assert.throws(() => compareCompositions(rows, altered, oracle, hardening)); });
    check("dropped-composed-binding-rejected", () => { const altered = structuredClone(outputs); altered.C01.requirements[0].required_bindings = []; assert.throws(() => compareCompositions(rows, altered, oracle, hardening)); });
    check("exception-is-not-rejection-pass", () => { const run = fn => { const r = fn(); assert.equal(r.status, "INVALID_COMPOSITION"); }; assert.throws(() => run(() => { throw new Error("evaluation error"); }), /evaluation error/); });
    return { outputs, comparisons, probes: probeResults, permutations: permutationResults, supplemental_controls: controls };
  }
  const first = execute(), replayHashes = [digest(first)];
  console.log(JSON.stringify({ task: "T1-04", first_replay: { c_cases: 41, malformed: 5, probes: first.probes.length, controls: first.supplemental_controls.length, permutations: first.permutations.length } }));
  console.log("T1-04 full replay 1 PASS: " + replayHashes[0]);
  for (let i = 1; i < 3; i++) { replayHashes.push(digest(execute())); console.log("T1-04 full replay " + (i + 1) + " PASS: " + replayHashes[i]); }
  assert.equal(new Set(replayHashes).size, 1, "T1-04 complete replay nondeterminism");
  const acceptedResult = readJson(t104Paths[5]);
  assert.equal(digest(first.outputs), acceptedResult.product_composition_semantic_hash, "Accepted T1-04 product semantic hash changed");
  assert.equal(replayHashes[0], acceptedResult.result_hash, "Accepted T1-04 task-result hash changed");
  console.log("PRODUCT_COMPOSITION_SEMANTIC_HASH=" + digest(first.outputs));
  const regressions = args.includes("--regressions") ? compositionRegressions() : [];
  if (regressions.length) assert.deepEqual(regressions.map(r => r.command), baseline.regressions.map(r => r.command));
  // Public/default callers and accepted product/fixture bytes remain guarded by
  // strict lineage plus an explicit current HEAD diff (staged and unstaged).
  const changed = execFileSync("git", ["diff", "--name-only", head], { encoding: "utf8" }).trim().split("\n").filter(Boolean);
  assert.ok(changed.every(p => t104Paths.includes(p)));
  const sourceText = fs.readFileSync(t104Paths[0], "utf8");
  for (const m of sourceText.matchAll(/(?:from\s+|import\s*\()\s*["']([^"']+)["']/g)) assert.ok(!/scripts|fixtures|gate1|b09|claimState|evaluateClaim/.test(m[1]), "Product boundary/import violation");
  const packagePaths = execFileSync("git", ["ls-files", "-z", "packages"], { encoding: "utf8", maxBuffer: 10_000_000 }).split("\0").filter(p => /\.(?:ts|mjs|cjs|js|json)$/.test(p) && !p.includes("/repaired/"));
  for (const p of packagePaths) assert.ok(!fs.readFileSync(p, "utf8").includes("repaired/"), "Public/default composition caller: " + p);
  for (const p of ["scripts/gate1/b09-product-inputs.mjs", "scripts/gate1/b09-product-compare.mjs"]) {
    const original = execFileSync("git", ["show", head + ":" + p], { encoding: "utf8" });
    assert.ok(fs.readFileSync(p, "utf8").startsWith(original), "Earlier adapters changed instead of additive T1-04 tests");
  }
  const pathApi = await import("node:path");
  const b09Roots = ["scripts/verify_v8_b09_acceptance_resume.mjs", "scripts/verify_v8_b09_repaired_experiment_3.mjs"], b09Files = new Set(), b09Edges = [];
  const walkB09 = p => {
    if (b09Files.has(p)) return; b09Files.add(p);
    // General tracked source may use CRLF worktree bytes and LF Git blobs.
    // Compare the existing Git clean representation without changing either;
    // the 19 frozen artifacts still require exact raw equality at entry.
    const cleanBlob = execFileSync("git", ["hash-object", "--path=" + p, p], { encoding: "utf8" }).trim();
    const acceptedBlob = execFileSync("git", ["rev-parse", head + ":" + p], { encoding: "utf8" }).trim();
    assert.equal(cleanBlob, acceptedBlob, "B09 dependency Git content changed: " + p);
    for (const m of fs.readFileSync(p, "utf8").matchAll(/(?:from\s+|import\s*\()\s*["']([^"']+)["']/g)) {
      if (!m[1].startsWith(".")) continue;
      let to = pathApi.posix.normalize(pathApi.posix.join(pathApi.posix.dirname(p), m[1]));
      if (!fs.existsSync(to)) to = [".ts", ".mjs", ".js", "/index.ts"].map(ext => to + ext).find(q => fs.existsSync(q));
      assert.ok(to, "Unresolved B09 import"); b09Edges.push([p, to]); walkB09(to);
    }
  };
  b09Roots.forEach(walkB09);
  assert.ok([...b09Files].every(p => !p.includes("/repaired/")));
  const b09 = { status: "NOT_RERUN", reason: "Neither frozen runner nor its complete static local import closure reaches repaired composition; every reachable source has unchanged Git clean content, with raw worktree and Git blob byte domains recorded separately", roots: b09Roots, edges: b09Edges, sources: [...b09Files].sort().map(p => ({ path: p, worktree_sha256: digest(fs.readFileSync(p)), git_blob_sha256: digest(execFileSync("git", ["show", head + ":" + p], { maxBuffer: 20_000_000 })), git_clean_content_unchanged: true })), frozen_artifacts_unchanged: pins.files.length };
  const counts = Object.fromEntries(["EXPECTED_GAP_CLOSED", "PARTIAL_CONFORMANCE_IMPROVED", "UNCHANGED_CONFORMING", "UNCHANGED_EXPECTED_GAP", "NEW_REGRESSION"].map(k => [k, first.comparisons.filter(r => r.case_id.startsWith("C") && r.classification === k).length]));
  const legacyMatches = baseline.observations.filter(row => row.legacy.status !== "NOT_CALLED_SHAPE_REJECTION");
  for (const row of legacyMatches) assert.deepEqual(composeMesrModules(row.input.modules), row.legacy, "Complete legacy BEFORE equality: " + row.case_id);
  const preservation = { evidence_ref: t104Paths[6] + "#required-commands-and-prior-task-preservation", verifier_lineage_guard: "STRICT", product_code_unchanged_since_smokes: true,
    executed_verifier_sha256: "96ac7cb797516c8a0dcb6ad46e2935793a0ec7f213325e2327d11d61f5c18a72",
    closure_only_verifier_change: "B09 Git/worktree byte-domain comparison and evidence metadata; no product, prior-task assertion or lineage change",
    source_hashes: Object.fromEntries([...productPaths, t102Paths[0], ...t103Paths.slice(0,2), t104Paths[0], ...t104Paths.slice(2,4)].map(p => [p, digest(fs.readFileSync(p))])),
    results: [{ task_id: "T1-01", slices: 50, controls: 33, exit_code: 0, outcome: "PASS" }, { task_id: "T1-02", slices: 13, controls: 20, exit_code: 0, outcome: "PASS" }, { task_id: "T1-03", slices: 38, controls: 56, exit_code: 0, outcome: "PASS" }] };
  const result = { version: "gate1-t1-04-results/0.1", task_id: "T1-04", title: "Atomic composition and finite Core noninterference", gap_ids: ["G08"], pre_change_head: head, post_change_head: null, worktree_state: "UNCOMMITTED",
    before_sha256: digest(fs.readFileSync(controlPath)), before_observations: baseline.observations.map(({ case_id, input_sha256, classification, basis }) => ({ case_id, input_sha256, classification, basis })), before_probes_ref: controlPath + "#probes", before_source_hashes: baseline.source_hashes,
    oracle_hash: baseline.oracle_hash, source_hashes: Object.fromEntries(t104Paths.slice(0,4).map(p => [p, digest(fs.readFileSync(p))])), trust_hash: digest(compositionBasis), ...first,
    counts, b09, prior_task_preservation: preservation, legacy_resolver_comparison: { callable_match: legacyMatches.length, callable_total: legacyMatches.length, shape_rejected_not_called: baseline.observations.length - legacyMatches.length, regressions: 0 }, supplemental_h_counts: { EXPECTED_GAP_CLOSED: 5 }, probe_counts: { EXPECTED_GAP_CLOSED: 603 }, replay_hashes: replayHashes, result_hash: replayHashes[0], regressions_before: baseline.regressions, regressions_after: regressions,
    initial_comparison: { status: "PASS", observed: "MATCH 46", basis: "Retained execution record before completion of the acceptance harness; final implementation independently rechecked here" },
    baseline_tooling_attempt: { exit_code: 1, suite: "verify_v7_0_1_public_surface_consistency", reason: "Legacy Git-index stat prerequisite rejected unstaged authorized test paths; staged only authorized paths and reran BEFORE, 17/17 PASS; no historical test edits" },
    legacy_byte_equality: true, frozen_files: pins.files.length, public_contract_drift: false, authority_expansion: false, later_assurance: "WITHHELD_FOR_TRANCHE_2", remaining_gaps: ["G05", "G07", "G06", "G03"], formal_tranche_closure: false };
  if (record) {
    assert.equal(regressions.length, 17, "Record acceptance only after full AFTER regression matrix");
    fs.writeFileSync(t104Paths[5], JSON.stringify(result, null, 2) + "\n");
  }
  console.log(JSON.stringify({ task: "T1-04", cases: 41, malformed_controls: 5, probes: first.probes.length, supplemental_controls: first.supplemental_controls.length, permutations: first.permutations.length, ...counts, replay_hashes: replayHashes, T1_04_RESULT_HASH: replayHashes[0], regressions_after: regressions.length }));
}

// T2-01 PRESERVATION MODE: historical T1 task modes and their guards remain intact.
function assertT201PreservationScope() {
  const baselinePath = "tests/fixtures/gate1/t2-01-controls.v0.1.json";
  assert.equal(digest(fs.readFileSync(baselinePath)), "6f0fbc92fb7347c3fe814bd534fcd58740fd96794943d675519b7f5dbd52185e", "Immutable BEFORE capture");
  const baseline = readJson(baselinePath);
  assert.equal(baseline.status, "BEFORE_PASS");
  const entry = "d2cd1460684b37e3a3ca8e8e1e958d15b3357d28";
  const implementation = "112d19ca84f13cc74447a41dfde5df49d9f9e49b";
  const expectedHash = "4df327296d4c2baea45cd22ce13d4b789fedbb783a7c8a1ff7a526745edad102";
  const verifierPath = "scripts/verify_v8_gate1_product_conformance.mjs";
  const implementationPaths = [
    "packages/guard-core/src/mesr/repaired/verificationEvent.ts", verifierPath,
    "scripts/gate1/b09-product-inputs.mjs", "scripts/gate1/b09-product-compare.mjs",
    baselinePath, "tests/fixtures/gate1/t2-01-results.v0.1.json",
    "docs/validation/v8-gate1-t2-01-evidence-v0.1.md"
  ];
  const closurePaths = [verifierPath, "docs/validation/v8-gate1-t2-01-post-commit-verifier-closure-v0.1.md"];
  const closureSubject = "test(v8): preserve accepted T2-01 implementation lifecycle";
  const t201ClosureVerifierSha256 = "50d77f565b0091fb4ac0d176d4cf16b83d91b5bd34327bbb781258c1b00fc1f7";
  const t201ClosureEvidenceSha256 = "b3d4add94d3e38c86ccf4634ef58e3d7cad9573f752622f701b789d7e11e4237";
  const normalize = text => text.replace(/^  const t201Closure(?:Verifier|Evidence)Sha256 = "[0-9a-f]{64}";$/gm, line => line.replace(/"[0-9a-f]{64}"/, '"<PIN>"'));
  const git = (...a) => execFileSync("git", a, { encoding: "utf8", stdio: "pipe", maxBuffer: 128_000_000 }).trim();
  const blob = (commit, path) => execFileSync("git", ["cat-file", "blob", commit+":"+path], {maxBuffer:128_000_000});
  const list = text => text.split("\n").filter(Boolean);
  const sorted = paths => [...paths].sort();
  const isAncestor = (anchor, current) => {
    try { git("cat-file", "-e", anchor+"^{commit}"); git("merge-base", "--is-ancestor", anchor, current); return true; }
    catch { return false; }
  };
  const inventory = commit => ({
    commit, parents:git("show","-s","--format=%P",commit).split(" "),
    paths:list(git("diff-tree","--no-commit-id","--name-only","--no-renames","-r",commit)),
    subject:git("show","-s","--format=%s",commit)
  });
  const validateClosureContent = (verifier, evidence) => {
    assert.equal(digest(normalize(verifier)),t201ClosureVerifierSha256,"Unaccepted T2-01 closure verifier");
    assert.ok(verifier.includes('const t201ClosureVerifierSha256 = "'+t201ClosureVerifierSha256+'";'),"Closure verifier pin changed");
    assert.ok(verifier.includes('const t201ClosureEvidenceSha256 = "'+t201ClosureEvidenceSha256+'";'),"Closure evidence pin changed");
    assert.equal(digest(evidence),t201ClosureEvidenceSha256,"Unaccepted T2-01 closure evidence");
  };
  // Real Git inventories and adversarial controls share this guard.
  // Ancestry alone never admits a descendant: at most one content-pinned
  // closure child may follow the accepted implementation.
  const validate = (task, anchor, current, history, pending, allowlist = baseline.file_allowlist) => {
    assert.equal(task,"T2-01","Unknown task");
    assert.equal(baseline.pre_change_head,entry,"Tampered entry anchor");
    assert.deepEqual(sorted(allowlist),sorted(implementationPaths),"Tampered task allowlist");
    if(current===entry) {
      assert.equal(history.length,0,"Pre-commit history must be empty");
      for(const path of pending) assert.ok(implementationPaths.includes(path),"Outside pre-commit T2-01 scope: "+path);
      return "PRE_COMMIT_IMPLEMENTATION";
    }
    assert.equal(anchor,implementation,"Missing/tampered accepted implementation anchor");
    assert.ok(isAncestor(anchor,current),"Nonancestor accepted implementation");
    assert.ok(history.length===1 || history.length===2,"Unrelated intervening commit count");
    assert.equal(history[0].commit,implementation,"Wrong implementation commit");
    assert.deepEqual(history[0].parents,[entry],"Implementation must directly follow entry");
    assert.deepEqual(sorted(history[0].paths),sorted(implementationPaths),"Implementation seven-path scope invalid");
    if(history.length===2) {
      const closure=history[1];
      assert.deepEqual(closure.parents,[implementation],"Unrelated intervening commit");
      assert.equal(closure.subject,closureSubject,"Unaccepted closure subject");
      assert.deepEqual(sorted(closure.paths),sorted(closurePaths),"Closure two-path scope invalid");
      validateClosureContent(blob(closure.commit,verifierPath).toString("utf8"),blob(closure.commit,closurePaths[1]));
      assert.equal(pending.length,0,"Accepted closure requires clean working tree");
    } else {
      for(const path of pending) assert.ok(closurePaths.includes(path),"Outside authorized closure scope: "+path);
    }
    assert.equal(current,history.at(-1).commit,"Unattributed HEAD");
    return "POST_COMMIT_ACCEPTED_IMPLEMENTATION";
  };
  assert.ok(["feat/v8-gate1-tranche2-t2-01-v0.1","planning/v8-gate1-tranche2-t2-02-v0.1"].includes(git("branch","--show-current")),"T2-01 branch mismatch");
  for(const receipt of baseline.accepted_receipts) git("merge-base","--is-ancestor",receipt,head);
  assert.deepEqual(list(git("diff","--name-only",baseline.accepted_receipts.at(-1),entry)),baseline.documentation_only_since_closure);
  // Index and worktree are inspected separately so opposite edits cannot
  // cancel out and hide an unauthorized pending path.
  const pending=[...new Set([
    ...list(git("diff","--name-only","--no-renames",head)),
    ...list(git("diff","--cached","--name-only","--no-renames")),
    ...list(git("diff","--name-only","--no-renames")),
    ...list(git("ls-files","--others","--exclude-standard"))
  ])];
  const history=head===entry ? [] : list(git("rev-list","--reverse","--topo-order",entry+".."+head)).map(inventory);
  const lifecycle=validate(args[1],implementation,head,history,pending);
  const controls=[];
  const pass=(id,fn)=>{fn();controls.push({id,outcome:"PASS"});};
  const reject=(id,fn,pattern)=>pass(id,()=>assert.throws(fn,pattern));
  pass("pre-commit-valid-entry",()=>validate("T2-01",implementation,entry,[],implementationPaths));
  const accepted=[inventory(implementation)];
  pass("accepted-implementation",()=>validate("T2-01",implementation,implementation,accepted,[]));
  reject("unauthorized-eighth-path",()=>validate("T2-01",implementation,implementation,[{...accepted[0],paths:[...accepted[0].paths,"README.md"]}],[]),/seven-path/);
  reject("wrong-implementation-commit",()=>validate("T2-01",implementation,implementation,[{...accepted[0],commit:entry}],[]),/Wrong implementation/);
  reject("nonancestor-implementation",()=>validate("T2-01",implementation,baseline.accepted_receipts.at(-1),accepted,[]),/Nonancestor/);
  reject("unknown-task",()=>validate("T2-02",implementation,implementation,accepted,[]),/Unknown task/);
  reject("tampered-task-allowlist",()=>validate("T2-01",implementation,implementation,accepted,[],[...implementationPaths,"README.md"]),/Tampered task allowlist/);
  reject("unrelated-intervening-commit",()=>validate("T2-01",implementation,implementation,[...accepted,{...accepted[0],parents:[implementation],subject:"unrelated"}],[]),/Unaccepted closure subject/);
  reject("current-unrelated-pending-path",()=>validate("T2-01",implementation,implementation,accepted,["README.md"]),/Outside authorized closure/);
  reject("missing-accepted-anchor",()=>validate("T2-01",undefined,implementation,accepted,[]),/Missing\/tampered/);
  reject("pre-commit-unrelated-path",()=>validate("T2-01",implementation,entry,[],["README.md"]),/Outside pre-commit/);
  reject("implementation-pending-product-change",()=>validate("T2-01",implementation,implementation,accepted,[implementationPaths[0]]),/Outside authorized closure/);
  reject("unattributed-descendant",()=>validate("T2-01",implementation,implementation,[...accepted,...accepted,...accepted],[]),/intervening commit count/);
  if(lifecycle==="POST_COMMIT_ACCEPTED_IMPLEMENTATION") {
    assert.ok(!record,"Accepted T2-01 fixtures cannot be rewritten");
    for(const path of implementationPaths.filter(p=>p!==verifierPath)) {
      assert.equal(digest(fs.readFileSync(path)),digest(blob(implementation,path)),"Accepted task bytes changed: "+path);
      assert.equal(digest(blob(head,path)),digest(blob(implementation,path)),"Accepted task Git bytes changed: "+path);
    }
    if(head===implementation && pending.length) validateClosureContent(fs.readFileSync(verifierPath,"utf8"),fs.readFileSync(closurePaths[1]));
    reject("closure-verifier-content-tamper",()=>validateClosureContent(fs.readFileSync(verifierPath,"utf8")+"\n// tampered",fs.readFileSync(closurePaths[1])),/Unaccepted T2-01 closure verifier/);
    reject("closure-evidence-content-tamper",()=>validateClosureContent(fs.readFileSync(verifierPath,"utf8"),Buffer.from("tampered")),/Unaccepted T2-01 closure evidence/);
    const acceptedVerifier=blob(implementation,verifierPath).toString("utf8");
    const currentText=fs.readFileSync(verifierPath,"utf8");
    const currentTask=currentText.slice(currentText.lastIndexOf("\nasync function t201Preservation("));
    const restoredTask=currentTask.replace(/\n  \/\/ BEGIN POST-COMMIT RECEIPT REUSE[\s\S]*?  \/\/ END POST-COMMIT RECEIPT REUSE\n/,"\n");
    assert.equal(restoredTask,acceptedVerifier.slice(acceptedVerifier.lastIndexOf("\nasync function t201Preservation(")),"Accepted semantic assertions or preservation expectations changed");
  }
  for(const [path,sha256] of Object.entries(baseline.protected_hashes)) assert.equal(digest(fs.readFileSync(path)),sha256,"Protected file: "+path);
  for(const path of baseline.file_allowlist.slice(2,4)) assert.ok(fs.readFileSync(path,"utf8").startsWith(blob(entry,path).toString("utf8")),"Historical adapter changed: "+path);
  // Compare the ENTIRE historical verifier after reversing only dispatch additions
  // in memory. No historical guard, assertion or falsifier may be changed.
  const current=fs.readFileSync(verifierPath,"utf8");
  const prefix=current.split("\n// T2-01 PRESERVATION MODE:")[0].trimEnd()+"\n";
  const original=execFileSync("git",["show",entry+":"+verifierPath],{encoding:"utf8"});
  const restored=prefix.replace('["T1-01", "T1-02", "T1-03", "T1-04", "T2-01"].includes(args[1])','["T1-01", "T1-02", "T1-03", "T1-04"].includes(args[1])')
    .replace('const taskScope = args[1] === "T2-01" ? assertT201PreservationScope() : assertTaskScope();','const taskScope = assertTaskScope();')
    .replace('if (args[1] === "T2-01") { await runT201Task(); } else if (args[1] === "T1-04")','if (args[1] === "T1-04")');
  assert.equal(restored,original,"Historical T1 verifier/lineage assertions changed");
  return {baseline,pending,lifecycle,implementation,expectedHash,controls,historical_verifier_sha256:digest(original),protected_files:Object.keys(baseline.protected_hashes).length};
}

async function t201Preservation(baseline) {
  const h=await import("./gate1/b09-product-inputs.mjs");
  const {inspectCanonicalAdmission}=await import("../packages/guard-core/src/mesr/repaired/admission.ts");
  const {collectBindingRequirements}=await import("../packages/guard-core/src/mesr/repaired/requirements.ts");
  const {evaluateClaims}=await import("../packages/guard-core/src/mesr/repaired/evaluateClaim.ts");
  const {composePinnedModules,collectComposedRequirements}=await import("../packages/guard-core/src/mesr/repaired/composition.ts");
  const trust=h.testTrust(),core=h.requirementCoreInput(),ct=h.compositionTrust();
  const map=(rows,fn)=>rows.map(r=>({id:r.case_id??r.id,input_sha256:digest(r.input),output_sha256:digest(fn(r.input))}));
  const composition=composePinnedModules(h.loadCompositionInputs().find(r=>r.case_id==="C01").input,ct);assert.equal(composition.status,"VALID_COMPOSITION");
  const fingerprints={t101:map(h.loadInputs(),x=>inspectCanonicalAdmission(x,trust)),t102:map(h.loadRequirementInputs(),x=>collectBindingRequirements(x,core,trust)),t103:map(h.loadStateInputs(),x=>evaluateClaims(x,core,trust)),t104:map(h.loadCompositionInputs(),x=>composePinnedModules(x,ct)),core_probes:h.loadCoreProbes().map(p=>{
    const a=collectBindingRequirements(p.input,core,trust);assert.deepEqual(a,collectComposedRequirements(p.input,composition,ct));
    return {id:p.id,input_sha256:digest(p.input),collection_sha256:digest(a),state_sha256:digest(evaluateClaims(p.input,core,trust))};
  })};
  assert.deepEqual(fingerprints,baseline.fingerprints,"T1/Core semantic or output drift");
  assert.deepEqual(JSON.parse(JSON.stringify(legacyControls())),baseline.legacy,"Public bytes/reason order/parser/validator drift");
  for(const row of baseline.observations)assert.deepEqual(evaluateClaims(row.input,core,trust),row.existing_t1_output,"Existing B09 verification semantics: "+row.case_id);
  return {t101:"PASS",t102:"PASS",t103:"PASS",t104:"PASS",core_603:"PASS",fingerprints,public_bytes:"PASS",existing_verification_occurred:"PRESERVED"};
}

async function runT201Task() {
  assert.ok(!before,"BEFORE already frozen; recapture forbidden");
  const baseline=taskScope.baseline;
  const {loadVerificationEventInputs,requirementCoreInput}=await import("./gate1/b09-product-inputs.mjs");
  const {compareVerificationEvents}=await import("./gate1/b09-product-compare.mjs");
  const {evaluateVerificationEvent}=await import("../packages/guard-core/src/mesr/repaired/verificationEvent.ts");
  const {evaluateClaims}=await import("../packages/guard-core/src/mesr/repaired/evaluateClaim.ts");
  const rows=loadVerificationEventInputs(),core=requirementCoreInput(),trust=testTrust();
  const run=()=>{
    const inputHash=digest(rows),outputs=Object.fromEntries(rows.map(r=>[r.case_id,evaluateVerificationEvent(r.input)]));
    const comparisons=compareVerificationEvents(rows,outputs);assert.equal(digest(rows),inputHash,"Input mutation");
    const controls=[],check=(id,fn)=>{const observation=fn();controls.push({id,result:"PASS",observation:observation??null});};
    const witness=id=>structuredClone(rows.find(r=>r.case_id===id).input);
    // Explicit semantic test context; these values never repair missing event facts.
    const context=(x,requests)=>({input:{kind:"claims",input_set_id:"t2-01-explicit-test-context",subject:x.target.subject,revision:x.target.revision,scope:x.target.scope,producer:"test-context-author",registry:structuredClone(trust.registry),method:{id:"parser-case-check",version:"1.0.0",digest:"test-context:parser-case-check/1.0.0"},bindings:{evaluation_time:"2026-09-18T10:00:00Z"},evidence_ledger:{},events:[],requests:requests??[
      {path:"pass",claim:"verification.passed",semantic_ids:["mesr.core.evidence.verification"],semantic_version:"0.1.0",required_bindings:[]},
      {path:"occurred",claim:"verification.occurred",semantic_ids:["mesr.core.evidence.verification"],semantic_version:"0.1.0",required_bindings:[]}
    ]},coreInput:core,trust});
    const claim=(out,path)=>{assert.equal(out.claim_evaluation?.status,"EVALUATED");const c=out.claim_evaluation.claims.find(c=>c.path===path);assert.ok(c);return c;};
    for(const [id,state] of [["W01","SUPPORTED"],["W02","UNSUPPORTED"],["W03","INCONCLUSIVE"]])check("bridge."+id,()=>{
      const x=witness(id),c=context(x),before=digest({x,c}),out=evaluateVerificationEvent(x,c);
      assert.equal(claim(out,"pass").state,state);assert.equal(claim(out,"occurred").state,"SUPPORTED");assert.equal(digest({x,c}),before);return out;
    });
    for(const id of ["W04","W04o","W10","W11","W17","W18","W20","mixed-valid-invalid-results"])check("missing-result."+id,()=>{
      const x=witness(id),out=evaluateVerificationEvent(x,context(x));assert.equal(claim(out,"pass").state,"UNRESOLVED");assert.equal(claim(out,"occurred").state,"UNRESOLVED");assert.ok(claim(out,"pass").missing_bindings.includes("t2_01_result_basis"));return out;
    });
    const setContext=x=>{
      const c=context(x);x.records["w:set"]={kind:"result_set",source_namespace:"planning-witness",source_ref:"w:set",...x.target,result_refs:[...x.result_refs]};c.result_set_ref="w:set";return c;
    };
    check("conflict-preserved-through-T1",()=>{
      const x=witness("W13"),c=setContext(x),out=evaluateVerificationEvent(x,c);
      assert.equal(claim(out,"pass").state,"CONFLICTED");assert.equal(claim(out,"occurred").state,"SUPPORTED");
      assert.equal(claim(out,"pass").bindings.find(b=>b.binding==="t2_01_result_basis").value,true);
      assert.equal(claim(out,"pass").evaluation_basis.conflicts[0].records.length,2);return out;
    });
    check("identical-compatible-results",()=>{
      const x=witness("W13");x.records["w:result-fail"].result=x.records["w:output-fail"].result="passed";
      x.records["w:output-fail"].content=structuredClone(x.records["w:output-pass"].content);
      const out=evaluateVerificationEvent(x,setContext(x));assert.equal(out.annotation,"ATTRIBUTABLE_OCCURRENCE_WITH_RESULT");
      assert.equal(claim(out,"pass").state,"SUPPORTED");assert.equal(claim(out,"pass").evaluation_basis.positive.length,2);return out;
    });
    for(const field of ["criterion","subject","scope","event_time","event_id"])check("competing-mismatch."+field,()=>{
      const x=witness("W13");x.records["w:result-fail"][field]=field==="event_time"?"2026-09-18T11:00:00Z":"other";
      if(field==="criterion")x.records["w:output-fail"][field]="other";
      const out=evaluateVerificationEvent(x,setContext(x));assert.equal(out.annotation,"ATTRIBUTABLE_OCCURRENCE_RESULT_UNRESOLVED");
      assert.equal(claim(out,"pass").state,"UNRESOLVED");assert.deepEqual(out.result_basis.values,["passed","failed"]);return out;
    });
    check("conflict-order-and-majority-do-not-select-winner",()=>{
      const x=witness("W13"),a=evaluateVerificationEvent(x,setContext(x));x.result_refs.reverse();
      const b=evaluateVerificationEvent(x,setContext(x));assert.equal(claim(a,"pass").state,"CONFLICTED");assert.equal(claim(b,"pass").state,"CONFLICTED");
      const pass=structuredClone(x.records["w:result-pass"]),output=structuredClone(x.records["w:output-pass"]);pass.source_ref="w:another-pass";pass.output_ref="w:another-output";output.source_ref=pass.output_ref;
      x.records[pass.source_ref]=pass;x.records[output.source_ref]=output;x.result_refs.push(pass.source_ref);x.records["w:event"].output_refs.push(output.source_ref);
      const out=evaluateVerificationEvent(x,setContext(x));assert.equal(claim(out,"pass").state,"CONFLICTED");assert.equal(out.result_basis.values.length,3);return out;
    });
    check("multi-result-without-retained-set-withheld",()=>{const x=witness("W13"),out=evaluateVerificationEvent(x,context(x));assert.ok(!out.claim_evaluation);assert.deepEqual(out.result_basis.values,["passed","failed"]);return out;});
    for(const location of ["bindings","predicates","request","context"])check("reserved-collision."+location,()=>{
      const x=witness("W01"),c=context(x);
      if(location==="request")c.input.requests[0].required_bindings.push("t2_01_result_basis");
      else if(location==="context")c.contexts=[{path:"pass",subject:x.target.subject,scope:x.target.scope,evaluation_time:c.input.bindings.evaluation_time,source_ref:"test:reserved",requirements:[{binding:"t2_01_result_basis",predicate:"true"}]}];
      else c.input[location]={...(c.input[location]??{}),t2_01_result_basis:true};
      assert.throws(()=>evaluateVerificationEvent(x,c),/Reserved binding collision/);return "REJECTED";
    });
    for(const [key,value] of [["annotation","ATTRIBUTABLE_OCCURRENCE_WITH_RESULT"],["t2_01_result_basis",true],["state","SUPPORTED"],["status","VALID"],["result","passed"]])check("envelope-hint."+key,()=>{
      const x=witness("W04");x[key]=value;const out=evaluateVerificationEvent(x);assert.ok(!out.annotation);assert.equal(out.occurrence_basis.established,false);return out;
    });
    check("caller-positive-hints-cannot-complete-result",()=>{
      const x=witness("W04"),c=context(x);c.input.caller_supported_claim_parts=["verification.passed"];c.input.predicates={verification_executed:"true"};c.input.bindings.result="passed";c.input.bindings.limitations="caller none";
      const out=evaluateVerificationEvent(x,c);assert.equal(claim(out,"pass").state,"UNRESOLVED");return out;
    });
    for(const [recordRef,key] of [["w:event","event_id"],["w:event","verifier"],["w:result","criterion"],["w:result","input_ref"],["w:result","output_ref"]])check("caller-fabrication."+recordRef+"."+key,()=>{
      const x=witness("W01"),c=context(x);delete x.records[recordRef][key];c.input[key]="fake";c.input.bindings[key]="fake";
      const out=evaluateVerificationEvent(x,c);assert.ok(!out.result_basis.established);if(out.claim_evaluation)assert.notEqual(claim(out,"pass").state,"SUPPORTED");return out;
    });
    check("synthetic-result-without-retained-witnesses",()=>{
      const x=witness("W01");x.records["w:result"].input_ref="invented:input";x.records["w:result"].output_ref="invented:output";
      const out=evaluateVerificationEvent(x,context(x));assert.equal(claim(out,"pass").state,"UNRESOLVED");return out;
    });
    for(const [id,record] of [["array-metadata",{verifications:[{status:"passed"}]}],["report-allow",{verdict:"allow"}],["prebuilt-valid",{status:"VALID",annotation:"ATTRIBUTABLE_OCCURRENCE_WITH_RESULT",t2_01_result_basis:true}]])check("shortcut."+id,()=>{
      const x=witness("W14");x.records={assertion:record};const out=evaluateVerificationEvent(x,context(x));
      assert.equal(out.annotation,"NO_ATTRIBUTABLE_OCCURRENCE");assert.equal(claim(out,"pass").state,"UNRESOLVED");return out;
    });
    check("caller-added-requirements-preserved",()=>{
      const x=witness("W01"),c=context(x);c.input.requests[0].required_bindings.push("witnesses");const out=evaluateVerificationEvent(x,c);
      assert.equal(claim(out,"pass").state,"UNRESOLVED");assert.ok(claim(out,"pass").missing_bindings.includes("witnesses"));assert.equal(claim(out,"occurred").state,"SUPPORTED");return out;
    });
    check("caller-context-obligation-preserved",()=>{
      const x=witness("W01"),c=context(x);c.contexts=[{path:"pass",subject:x.target.subject,scope:x.target.scope,evaluation_time:c.input.bindings.evaluation_time,source_ref:"test:extra",requirements:[{binding:"additional",predicate:"true"}]}];
      const out=evaluateVerificationEvent(x,c);assert.equal(claim(out,"pass").state,"UNRESOLVED");return out;
    });
    for(const [id,change] of [["descriptor-mismatch",c=>{c.input.method.version="2.0.0";}],["missing-method",c=>{delete c.input.method;}],["missing-time",c=>{delete c.input.bindings.evaluation_time;}],["context-subject",c=>{c.input.subject="other";}]])check(id,()=>{
      const x=witness("W01"),c=context(x);change(c);const out=evaluateVerificationEvent(x,c);assert.ok(!out.claim_evaluation);assert.equal(out.annotation,"ATTRIBUTABLE_OCCURRENCE_WITH_RESULT");return out;
    });
    check("malformed-T1-remains-rejected",()=>{const x=witness("W01"),c=context(x);c.input.requests=null;const expected=evaluateClaims(c.input,core,trust),out=evaluateVerificationEvent(x,c);assert.equal(expected.status,"REJECTED");assert.deepEqual(out.claim_evaluation,expected);return out;});
    check("unadmitted-Core-remains-rejected",()=>{const x=witness("W01"),c=context(x);c.coreInput=structuredClone(core);c.coreInput.registry.digest="unadmitted";const out=evaluateVerificationEvent(x,c);assert.equal(out.claim_evaluation.status,"REJECTED");return out;});
    const facets=[["independence","verification.independent","mesr.core.evidence.verification"],["producer_inference","verification.independent","mesr.core.provenance.producer"],["integrity","artifact.byte_equality","mesr.core.evidence.item"],["authority","execution_authority","mesr.core.evidence.verification"],["acceptance","institutional.acceptance","mesr.core.evidence.verification"],["generic","compliance","mesr.core.evidence.verification"],["generic","approval","mesr.core.evidence.verification"],["generic","safe","mesr.core.evidence.verification"],["generic","execution_permission","mesr.core.evidence.verification"]];
    for(const [path,facet,anchor] of facets)check("boundary."+facet+"."+anchor,()=>{
      const x=witness("W01"),c=context(x,[{path,claim:facet,semantic_ids:[anchor],semantic_version:"0.1.0",required_bindings:[]}]),out=evaluateVerificationEvent(x,c);
      assert.notEqual(claim(out,path).state,"SUPPORTED");assert.ok(!out.independent&&!out.authenticated_verifier&&!out.integrity&&!out.custody);return out;
    });
    check("same-producer-checker-not-independence",()=>{
      const x=witness("W01");x.records["w:event"].verifier=x.records["w:result"].verifier=x.records["w:event"].producer;
      const out=evaluateVerificationEvent(x,context(x));assert.equal(claim(out,"pass").state,"SUPPORTED");assert.ok(!out.independent);return out;
    });
    check("strict-duplicate-key-parser",()=>{assert.throws(()=>evaluateVerificationEvent('{"target":{},"target":{}}'));assert.throws(()=>evaluateVerificationEvent('{"x":1,"\\u0078":2}'));return "REJECTED";});
    check("malformed-envelope",()=>{for(const x of [null,[],{},42])assert.ok(!evaluateVerificationEvent(x).annotation);return "REJECTED";});
    check("unexpected-helper-errors-propagate",()=>{
      const x=witness("W01");Object.defineProperty(x,"records",{enumerable:true,get(){throw new Error("unexpected-getter");}});
      assert.throws(()=>evaluateVerificationEvent(x));const cycle={};cycle.self=cycle;assert.throws(()=>evaluateVerificationEvent(cycle));return "NO_POSITIVE_OUTPUT";
    });
    check("exact-serialized-input",()=>{const x=witness("W01");assert.deepEqual(evaluateVerificationEvent(JSON.stringify(x)),outputs.W01);return "PASS";});
    check("absent-null-empty-type-diagnostics-distinct",()=>{
      const variants=["absent","null","empty","whitespace","wrong-type"],issues=variants.map(v=>outputs["field.w:event.event_id."+v].diagnostics.find(d=>d.path==="/records/w:event/event_id").issue);
      assert.deepEqual(issues,["ABSENT","NULL","EMPTY","WHITESPACE","WRONG_TYPE"]);return issues;
    });
    check("provenance-pointers-resolve",()=>{for(const p of outputs.W01.provenance){const value=p.pointer.split("/").slice(1).reduce((v,k)=>v[k.replaceAll("~1","/").replaceAll("~0","~")],outputs.W01.raw_input);assert.deepEqual(value,outputs.W01.raw_input.records[p.record_ref][p.field]);}return "PASS";});
    check("comparator-falsifiers",()=>{
      const corrupted=structuredClone(rows);corrupted[0].expected_annotation="NO_ATTRIBUTABLE_OCCURRENCE";assert.throws(()=>compareVerificationEvents(corrupted,outputs));
      const dropped={...outputs};delete dropped.W01;assert.throws(()=>compareVerificationEvents(rows,dropped));
      const falsePositive=structuredClone(outputs);falsePositive.W05.annotation="ATTRIBUTABLE_OCCURRENCE_WITH_RESULT";assert.throws(()=>compareVerificationEvents(rows,falsePositive));return ["corrupt-expectation","dropped-case","false-positive"];
    });
    return {outputs,comparisons,controls};
  };
  const first=run();console.log("T2-01 controls PASS: "+rows.length+" cases; "+first.controls.length+" bridge/falsifier controls");
  const replayHashes=[digest(first),digest(run()),digest(run())];assert.equal(new Set(replayHashes).size,1);console.log("T2-01 three replays identical: "+replayHashes[0]);
  // BEGIN POST-COMMIT RECEIPT REUSE
  if(taskScope.lifecycle==="POST_COMMIT_ACCEPTED_IMPLEMENTATION") {
    // Task semantics above execute on this checkout. Expensive T1/Core and
    // 21-suite acceptance remain explicitly inherited from unchanged receipts.
    const accepted=readJson(baseline.file_allowlist[5]),closure=accepted.acceptance_closure;
    assert.equal(replayHashes[0],taskScope.expectedHash,"T2_01_POST_COMMIT_SEMANTIC_DRIFT");
    assert.equal(accepted.result_hash,taskScope.expectedHash);
    assert.deepEqual(replayHashes,accepted.replay_hashes);
    assert.equal(rows.length,370);assert.equal(first.comparisons.length,370);assert.equal(first.controls.length,64);
    for(const key of ["t101","t102","t103","t104","core_603"]) assert.equal(accepted.preservation[key],"PASS");
    assert.equal(accepted.preservation.existing_verification_occurred,"PRESERVED");
    assert.equal(accepted.preservation.six_state_selector,"PRESERVED");
    assert.equal(taskScope.protected_files,1422);
    assert.equal(closure.final_after_pass,21);assert.equal(closure.final_after_total,21);
    assert.equal(closure.final_counts.NEW_REGRESSION,0);
    assert.equal(closure.public_contract_drift,"NO");assert.equal(closure.authority_expansion,"NO");
    assert.equal(closure.final_after_regressions.length,baseline.regressions.length);
    for(const [i,prior] of baseline.regressions.entries()) {
      const receipt=closure.final_after_regressions[i];
      assert.equal(receipt.command,prior.command);assert.equal(receipt.exit_code,0);
      assert.equal(receipt.source_sha256,prior.source_sha256);
      assert.equal(digest(fs.readFileSync(prior.path)),prior.source_sha256);
    }
    const product=fs.readFileSync(baseline.file_allowlist[0],"utf8");
    for(const m of product.matchAll(/(?:from\s+|import\s*\()\s*["']([^"']+)["']/g)) assert.ok(!/scripts|fixtures|gate1|b09/.test(m[1]));
    assert.ok(!/\bselectClaimState\b/.test(product));
    assertT201PreservationScope();
    console.log(JSON.stringify({
      decision:"T2_01_POST_COMMIT_PASS",semantic_assertions_reached:true,
      lifecycle:taskScope.lifecycle,accepted_task_implementation_commit:taskScope.implementation,
      implementation_seven_path_scope:"PASS",verifier_lifecycle_guard:"STRICT",lifecycle_controls:taskScope.controls,
      annotations_pass:370,bridge_boundary_controls_pass:64,result_hash:replayHashes[0],
      preservation:"INHERITED_ACCEPTED_T1_CORE_RECEIPTS_WITH_UNCHANGED_BYTES",
      after_regressions:"INHERITED_ACCEPTED_21_OF_21; NOT_RERUN",
      protected_files:taskScope.protected_files,product_code_changed:"NO",
      public_contract_drift:"NO",authority_expansion:"NO",recorded:false,
      deferred:{T2_02:"NOT_STARTED",T2_03:"NOT_STARTED",G03:"OPEN",G05:"OPEN"}
    }));
    return;
  }
  // END POST-COMMIT RECEIPT REUSE
  const preservation=await t201Preservation(baseline);console.log("T1-01/02/03/04 fingerprints and 603 Core probes preserved");
  const regressions=baseline.regressions.map(prior=>{
    assert.equal(digest(fs.readFileSync(prior.path)),prior.source_sha256);
    try {
      const stdout=execFileSync(process.execPath,[prior.path],{encoding:"utf8",maxBuffer:30_000_000});console.log("AFTER PASS "+prior.path);
      return {command:prior.command,exit_code:0,stdout,stdout_sha256:digest(stdout),source_sha256:prior.source_sha256};
    } catch (error) {
      // Preserve failed commands and continue the matrix; never convert a scope
      // rejection into PASS or discard completed product evidence.
      const stdout=String(error.stdout??""),stderr=String(error.stderr??"");
      console.log("AFTER FAIL "+prior.path);
      return {command:prior.command,exit_code:error.status??null,stdout,stderr,stdout_sha256:digest(stdout),source_sha256:prior.source_sha256};
    }
  });
  assert.equal(regressions.length,21);
  const product=fs.readFileSync(baseline.file_allowlist[0],"utf8");for(const m of product.matchAll(/(?:from\s+|import\s*\()\s*["']([^"']+)["']/g))assert.ok(!/scripts|fixtures|gate1|b09/.test(m[1]));
  assert.ok(!/\bselectClaimState\b/.test(product));assertT201PreservationScope();
  const b09=baseline.observations.map(row=>({case_id:row.case_id,classification:"UNCHANGED_CONFORMING",scope:"Existing T1 occurrence/result output preserved exactly",private_joins:"UNCHANGED_EXPECTED_GAP",pending:["T2-02","T2-03","G03"]}));
  // Distinct assertion slices; old rich-join gaps are not whole-case PASS.
  const counts={EXPECTED_GAP_CLOSED:first.comparisons.length,PARTIAL_CONFORMANCE_IMPROVED:0,UNCHANGED_CONFORMING:b09.length,UNCHANGED_EXPECTED_GAP:b09.length,NEW_REGRESSION:regressions.filter(r=>r.exit_code!==0).length};
  const result={version:"gate1-t2-01-results/0.1",decision:counts.NEW_REGRESSION ? "T2_01_IMPLEMENTATION_FAIL" : "T2_01_IMPLEMENTATION_PASS_WITH_REMAINING_GAPS",entry_commit:head,pre_change_head:baseline.pre_change_head,implementation_committed:false,file_allowlist:baseline.file_allowlist,before_sha256:digest(fs.readFileSync(baseline.file_allowlist[4])),source_hashes:Object.fromEntries(baseline.file_allowlist.slice(0,4).map(p=>[p,digest(fs.readFileSync(p))])),input_hashes:rows.map(r=>({case_id:r.case_id,sha256:digest(r.input)})),...first,replay_hashes:replayHashes,result_hash:replayHashes[0],preservation,protected_files:taskScope.protected_files,historical_task_acceptance:"INHERITED",historical_task_smokes:baseline.historical_task_smokes,lineage_guard:"STRICT",before_regressions:baseline.regressions.map(r=>({command:r.command,exit_code:r.exit_code,stdout_sha256:r.stdout_sha256})),after_regressions:regressions,b09_slices:b09,counts,public_contract_drift:"NO",authority_expansion:"NO",reference_evaluator_imported:"NO",deferred:{T2_02:"NOT_STARTED",T2_03:"NOT_STARTED",G03:"OPEN",G05:"OPEN"}};
  if(record)fs.writeFileSync(baseline.file_allowlist[5],JSON.stringify(result,null,2)+"\n");
  console.log(JSON.stringify({decision:result.decision,...counts,result_hash:result.result_hash,recorded:record}));
  if(counts.NEW_REGRESSION) process.exitCode=1;
}
