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
assert.equal(args[0], "--task"); assert.equal(args[1], "T1-01", "Only T1-01 is implemented");
assert.ok(args.slice(2).every(arg => ["--before", "--record"].includes(arg)));
const before = args.includes("--before"), record = args.includes("--record");
const fixturePath = "tests/fixtures/gate1/t1-01-controls.v0.1.json";
const resultPath = "tests/fixtures/gate1/t1-01-results.v0.1.json";
const productPaths = ["admission.ts", "contracts.ts", "canonicalBytes.ts"].map(p => "packages/guard-core/src/mesr/repaired/" + p);
const head = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const pins = readJson(frozenDir + "freeze.v0.2.json");
for (const pin of pins.files) {
  const bytes = fs.readFileSync(pin.path);
  assert.equal(digest(bytes), pin.sha256, "Frozen worktree bytes: " + pin.path);
  assert.equal(digest(execFileSync("git", ["cat-file", "blob", head + ":" + pin.path], { maxBuffer: 20_000_000 })), pin.sha256, "Frozen Git bytes: " + pin.path);
}
const rows = loadInputs(), expected = expectations(), trust = testTrust();
const oracle = readJson(frozenDir + "oracle.v0.2.json");
for (const row of rows.filter(row => row.case_id.startsWith("C"))) assert.equal(digest(row.input), oracle.fixture_input_digests[row.case_id]);

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
