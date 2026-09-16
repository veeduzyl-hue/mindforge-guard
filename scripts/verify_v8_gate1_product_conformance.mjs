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
assert.equal(args[0], "--task"); assert.ok(["T1-01", "T1-02"].includes(args[1]));
assert.ok(args.slice(2).every(arg => ["--before", "--record"].includes(arg)));
const before = args.includes("--before"), record = args.includes("--record");
const fixturePath = "tests/fixtures/gate1/t1-01-controls.v0.1.json";
const resultPath = "tests/fixtures/gate1/t1-01-results.v0.1.json";
const productPaths = ["admission.ts", "contracts.ts", "canonicalBytes.ts"].map(p => "packages/guard-core/src/mesr/repaired/" + p);
const t102Paths = ["packages/guard-core/src/mesr/repaired/requirements.ts", "scripts/verify_v8_gate1_product_conformance.mjs", "scripts/gate1/b09-product-inputs.mjs", "scripts/gate1/b09-product-compare.mjs", "tests/fixtures/gate1/t1-02-controls.v0.1.json", "tests/fixtures/gate1/t1-02-results.v0.1.json", "docs/validation/v8-gate1-t1-02-evidence-v0.1.md"];
const head = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
assertTaskScope();
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

if (args[1] === "T1-02") { await runRequirementsTask(); } else {
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
    const owned = [...productPaths, "scripts/verify_v8_gate1_product_conformance.mjs", "scripts/gate1/b09-product-inputs.mjs", "scripts/gate1/b09-product-compare.mjs", fixturePath, resultPath, "docs/validation/v8-gate1-t1-01-evidence-v0.1.md"];
    owned.push(...t102Paths, "docs/validation/v8-gate1-t1-02-post-commit-verifier-closure-v0.1.md");
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

// Exact task-scope protection includes untracked files and committed T1-01 byte pins.
function assertTaskScope() {
  const t101 = "7726fc7f58305e59ea7359d9658494b7695bfa4d";
  const t102 = "c5a66b50cefc39002dea190af078a49a7c47e3d4";
  const closurePaths = ["scripts/verify_v8_gate1_product_conformance.mjs", "docs/validation/v8-gate1-t1-02-post-commit-verifier-closure-v0.1.md"];
  const git = (...args) => execFileSync("git", args, { encoding: "utf8", stdio: "pipe" }).trim();
  const list = value => value.split("\n").filter(Boolean);
  const isAncestor = (anchor, current) => {
    try { git("cat-file", "-e", anchor + "^{commit}"); git("merge-base", "--is-ancestor", anchor, current); return true; }
    catch { return false; }
  };
  const validate = (task, anchors, current, committed, pending, ancestor) => {
    assert.ok(Object.hasOwn(anchors, task), "Unknown task");
    assert.ok(anchors[task] && ancestor(anchors[task], current), "Missing/non-ancestor accepted task anchor");
    assert.ok(ancestor(t102, current), "T1-02 preservation anchor missing from ancestry");
    for (const path of [...committed, ...pending]) assert.ok(closurePaths.includes(path), "Outside verifier closure allowlist: " + path);
  };
  const anchors = { "T1-01": t101, "T1-02": t102 };
  const changed = list(git("diff", "--name-only", head));
  const untracked = list(git("ls-files", "--others", "--exclude-standard"));
  // Inspect every intervening commit, including reverted changes, as well as net bytes.
  const committed = list(git("log", "--format=", "--name-only", t102 + ".." + head));
  validate(args[1], anchors, head, committed, [...changed, ...untracked], isAncestor);
  for (const extra of ["README.md", "packages/guard-core/src/reasonCodes.ts", "unrelated/other.ts"]) assert.throws(() => validate(args[1], anchors, head, committed, [...changed, extra], isAncestor));
  assert.throws(() => validate("UNKNOWN_TASK", anchors, head, [], [], isAncestor));
  assert.throws(() => validate("T1-02", {}, head, [], [], isAncestor));
  assert.throws(() => validate("T1-02", { "T1-02": "0".repeat(40) }, head, [], [], isAncestor));
  assert.throws(() => validate("T1-02", anchors, t101, [], [], isAncestor));
  assert.throws(() => validate("T1-02", anchors, head, ["README.md"], [], isAncestor));
  validate("T1-02", anchors, "synthetic-authorized-descendant", closurePaths, [], (anchor, current) => [t101, t102].includes(anchor) && current === "synthetic-authorized-descendant");
  const oldPaths = list(git("show", "--format=", "--name-only", t101));
  assert.equal(oldPaths.length, 9);
  for (const path of [...new Set([...oldPaths, ...t102Paths])].filter(path => !closurePaths.includes(path))) {
    const preserved = execFileSync("git", ["cat-file", "blob", t102 + ":" + path], { maxBuffer: 2_000_000 });
    assert.deepEqual(fs.readFileSync(path), preserved, "Frozen T1-01/T1-02 worktree bytes: " + path);
    assert.deepEqual(execFileSync("git", ["cat-file", "blob", head + ":" + path], { maxBuffer: 2_000_000 }), preserved, "Frozen T1-01/T1-02 committed bytes: " + path);
  }
  for (const path of [...productPaths, "packages/guard-core/src/mesr/repaired/requirements.ts"].filter(path => fs.existsSync(path))) {
    const source = fs.readFileSync(path, "utf8");
    for (const match of source.matchAll(/(?:from\s+|import\s*\()\s*["']([^"']+)["']/g)) assert.ok(!/scripts|fixtures|gate1|b09/.test(match[1]), "Test dependency: " + path);
  }
}
