import fs from "node:fs";
import os from "node:os";
import path from "node:path";

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

function parseJsonOutput(result, label) {
  try {
    return JSON.parse(result.stdout);
  } catch (error) {
    throw new Error(`${label} must output valid JSON (${error.message})`);
  }
}

function expectExactKeys(actual, expectedKeys, label) {
  const actualKeys = Object.keys(actual).sort();
  const expectedSorted = [...expectedKeys].sort();
  expect(
    JSON.stringify(actualKeys) === JSON.stringify(expectedSorted),
    `${label} keys mismatch: expected ${expectedSorted.join(", ")} got ${actualKeys.join(", ")}`
  );
}

function buildExpectedCheckPayload(fixture) {
  return {
    kind: "authority_check_preview",
    preview: true,
    schema_version: fixture.schema_version,
    command: "guard authority check",
    decision: fixture.decision,
    receipt: fixture.authority_receipt,
    recommendation_only: fixture.recommendation_only,
    non_executing: fixture.non_executing,
    default_off: fixture.default_off,
    machine_verifiable: fixture.machine_verifiable,
    no_execution_authority: fixture.no_execution_authority,
    no_commit_gate_semantics: fixture.no_commit_gate_semantics,
    no_license_gating_semantic_change: fixture.no_license_gating_semantic_change,
    no_current_cli_contract_change: fixture.no_current_cli_contract_change,
    no_current_exit_code_semantic_change: fixture.no_current_exit_code_semantic_change,
    enforcement_action: "none",
    blocking_effect: false,
    execution_authority_granted: false,
  };
}

function expectCheckOutputUnchanged(payload, fixture, label) {
  const expected = buildExpectedCheckPayload(fixture);
  expect(JSON.stringify(payload) === JSON.stringify(expected), `${label} output changed`);
}

function expectCoverageMatrix(payload) {
  expect(payload.coverage_matrix, "coverage_matrix must exist");
  expect(
    payload.coverage_matrix.current_state_context_v1?.status === "implemented",
    "current_state_context_v1.status must be implemented"
  );
  expect(
    payload.coverage_matrix.current_state_context_v1?.implemented_as === "constructible_current_state",
    "current_state_context_v1.implemented_as mismatch"
  );
  expect(
    payload.coverage_matrix.bind_time_validity_v1?.status === "implemented",
    "bind_time_validity_v1.status must be implemented"
  );
  expect(
    payload.coverage_matrix.bind_time_validity_v1?.implemented_as === "state_validity_at_bind_time",
    "bind_time_validity_v1.implemented_as mismatch"
  );
  expect(
    payload.coverage_matrix.bind_time_validity_v1?.enforced === false,
    "bind_time_validity_v1.enforced must be false"
  );
  expect(
    payload.coverage_matrix.commitment_candidate_v1?.status === "reserved",
    "commitment_candidate_v1.status must be reserved"
  );
  expect(
    payload.coverage_matrix.commitment_candidate_v1?.evaluated === false,
    "commitment_candidate_v1.evaluated must be false"
  );
  expect(
    payload.coverage_matrix.commitment_candidate_v1?.result === "not_evaluated",
    "commitment_candidate_v1.result must be not_evaluated"
  );
  expect(
    payload.coverage_matrix.admissibility_result_v1?.status === "reserved",
    "admissibility_result_v1.status must be reserved"
  );
  expect(
    payload.coverage_matrix.admissibility_result_v1?.evaluated === false,
    "admissibility_result_v1.evaluated must be false"
  );
  expect(
    payload.coverage_matrix.admissibility_result_v1?.result === "not_evaluated",
    "admissibility_result_v1.result must be not_evaluated"
  );
  expect(
    payload.coverage_matrix.commitment_receipt_v1?.status === "deferred",
    "commitment_receipt_v1.status must be deferred"
  );
  expect(
    payload.coverage_matrix.commitment_receipt_v1?.implemented === false,
    "commitment_receipt_v1.implemented must be false"
  );
}

function expectExplainPayload(payload, expectedDecision, expectedVerdict, label) {
  expect(payload.kind === "authority_explain_preview", `${label} kind mismatch`);
  expect(
    payload.schema_version === "guard.authority_explain_preview.v6_15",
    `${label} schema_version mismatch`
  );
  expect(payload.command === "guard authority explain", `${label} command mismatch`);
  expect(payload.preview === true, `${label} preview must be true`);
  expect(payload.authority_check_ref, `${label} authority_check_ref must exist`);
  expect(payload.constructible_current_state, `${label} constructible_current_state must exist`);
  expect(payload.state_validity_at_bind_time, `${label} state_validity_at_bind_time must exist`);
  expect(payload.authority_explanation, `${label} authority_explanation must exist`);
  expect(payload.admissibility_result, `${label} admissibility_result must exist`);
  expect(payload.commitment_candidate, `${label} commitment_candidate must exist`);
  expect(payload.receipt_linkage, `${label} receipt_linkage must exist`);
  expect(payload.non_enforcement_boundary, `${label} non_enforcement_boundary must exist`);
  expect(payload.authority_check_ref.decision === expectedDecision, `${label} decision mismatch`);
  expect(!("commitment_receipt" in payload), `${label} must not create a top-level commitment_receipt object`);

  expectCoverageMatrix(payload);

  const currentState = payload.constructible_current_state;
  expect(
    currentState.schema_version === "guard.constructible_current_state.v1",
    `${label} current state schema_version mismatch`
  );
  expect(currentState.constructed_from === "fixture", `${label} current state must be fixture-backed`);
  expect(currentState.current_commit_gate_result?.evaluated === false, `${label} commit gate must be unevaluated`);
  expect(
    currentState.current_commit_gate_result?.result === "not_evaluated",
    `${label} commit gate result mismatch`
  );

  const bindTime = payload.state_validity_at_bind_time;
  expect(bindTime.schema_version === "guard.bind_time_validity.v1", `${label} bind-time schema mismatch`);
  expect(bindTime.evaluated === true, `${label} bind-time must be evaluated`);
  expect(bindTime.enforced === false, `${label} bind-time must not be enforced`);
  expect(typeof bindTime.evaluated_at === "string" && bindTime.evaluated_at.length > 0, `${label} evaluated_at missing`);
  expect("expires_at" in bindTime, `${label} expires_at missing`);
  expect(bindTime.verdict === expectedVerdict, `${label} verdict mismatch`);
  expect(typeof bindTime.state_hash === "string" && bindTime.state_hash.startsWith("sha256:"), `${label} state_hash mismatch`);
  expect(typeof bindTime.policy_hash === "string" && bindTime.policy_hash.startsWith("sha256:"), `${label} policy_hash mismatch`);
  expect(
    bindTime.evidence_hash === null ||
      (typeof bindTime.evidence_hash === "string" && bindTime.evidence_hash.startsWith("sha256:")),
    `${label} evidence_hash mismatch`
  );
  expect(bindTime.replay_guard_preview, `${label} replay_guard_preview missing`);
  expect(bindTime.replay_guard_preview.evaluated === true, `${label} replay_guard_preview.evaluated mismatch`);
  expect(bindTime.replay_guard_preview.enforced === false, `${label} replay_guard_preview.enforced mismatch`);
  expect(
    bindTime.replay_guard_preview.mode === "fixture_declared_or_derived",
    `${label} replay_guard_preview.mode mismatch`
  );
  expect(bindTime.replay_guard_preview.blocking_effect === false, `${label} replay_guard_preview.blocking_effect mismatch`);

  expect(payload.admissibility_result.evaluated === false, `${label} admissibility_result.evaluated mismatch`);
  expect(
    payload.admissibility_result.result === "not_evaluated",
    `${label} admissibility_result.result mismatch`
  );
  expect(
    Array.isArray(payload.admissibility_result.reserved_result_values),
    `${label} reserved_result_values missing`
  );
  expect(
    !["admit", "deny", "defer", "requires_human_confirmation"].includes(payload.admissibility_result.result),
    `${label} admissibility_result must remain reserved`
  );
  expectExactKeys(
    payload.admissibility_result,
    ["schema_version", "status", "evaluated", "result", "reserved_result_values"],
    `${label} admissibility_result`
  );

  expect(payload.commitment_candidate.evaluated === false, `${label} commitment_candidate.evaluated mismatch`);
  expect(
    payload.commitment_candidate.result === "not_evaluated",
    `${label} commitment_candidate.result mismatch`
  );
  expect(
    payload.commitment_candidate.commit_decision === "not_evaluated",
    `${label} commitment_candidate.commit_decision mismatch`
  );
  expect(
    !["allowed", "blocked", "approved", "denied"].includes(payload.commitment_candidate.commit_decision),
    `${label} commitment_candidate must not emit a real commit decision`
  );
  expectExactKeys(
    payload.commitment_candidate,
    ["schema_version", "status", "evaluated", "result", "commit_decision"],
    `${label} commitment_candidate`
  );

  expect(
    typeof payload.receipt_linkage.deterministic_hash === "string" &&
      payload.receipt_linkage.deterministic_hash.startsWith("sha256:"),
    `${label} receipt_linkage.deterministic_hash missing`
  );
  expect(
    payload.receipt_linkage.commitment_receipt?.implemented === false,
    `${label} commitment_receipt must remain deferred`
  );
  expect(
    payload.receipt_linkage.commitment_receipt?.deferred_to === "commit_gate_phase",
    `${label} commitment_receipt.deferred_to mismatch`
  );
  expectExactKeys(
    payload.receipt_linkage.commitment_receipt,
    ["implemented", "deferred_to"],
    `${label} receipt_linkage.commitment_receipt`
  );

  expect(payload.non_enforcement_boundary.recommendation_only === true, `${label} recommendation_only mismatch`);
  expect(payload.non_enforcement_boundary.non_executing === true, `${label} non_executing mismatch`);
  expect(payload.non_enforcement_boundary.default_off === true, `${label} default_off mismatch`);
  expect(payload.non_enforcement_boundary.enforced === false, `${label} enforced mismatch`);
  expect(payload.non_enforcement_boundary.blocking_effect === false, `${label} blocking_effect mismatch`);
  expect(
    payload.non_enforcement_boundary.execution_authority_granted === false,
    `${label} execution_authority_granted mismatch`
  );
  expect(
    payload.non_enforcement_boundary.does_not_create_commit_gate === true,
    `${label} does_not_create_commit_gate mismatch`
  );
  expect(
    payload.non_enforcement_boundary.does_not_decide_admissibility === true,
    `${label} does_not_decide_admissibility mismatch`
  );
  expect(
    payload.non_enforcement_boundary.does_not_create_commitment_receipt === true,
    `${label} does_not_create_commitment_receipt mismatch`
  );
}

function expectDeterministicStability(firstPayload, secondPayload, label) {
  expect(
    firstPayload.state_validity_at_bind_time.state_hash === secondPayload.state_validity_at_bind_time.state_hash,
    `${label} state_hash must be stable`
  );
  expect(
    firstPayload.state_validity_at_bind_time.policy_hash === secondPayload.state_validity_at_bind_time.policy_hash,
    `${label} policy_hash must be stable`
  );
  expect(
    firstPayload.state_validity_at_bind_time.evidence_hash === secondPayload.state_validity_at_bind_time.evidence_hash,
    `${label} evidence_hash must be stable`
  );
  expect(
    firstPayload.receipt_linkage.deterministic_hash === secondPayload.receipt_linkage.deterministic_hash,
    `${label} deterministic_hash must be stable`
  );
  expect(
    firstPayload.receipt_linkage.authority_explain_receipt_id ===
      secondPayload.receipt_linkage.authority_explain_receipt_id,
    `${label} authority_explain_receipt_id must be stable`
  );
  expect(
    JSON.stringify(firstPayload.coverage_matrix) === JSON.stringify(secondPayload.coverage_matrix),
    `${label} coverage_matrix must be stable`
  );
  expect(
    JSON.stringify(firstPayload.admissibility_result) === JSON.stringify(secondPayload.admissibility_result),
    `${label} admissibility_result must be stable`
  );
  expect(
    JSON.stringify(firstPayload.commitment_candidate) === JSON.stringify(secondPayload.commitment_candidate),
    `${label} commitment_candidate must be stable`
  );
  expect(
    firstPayload.state_validity_at_bind_time.evaluated_at ===
      secondPayload.state_validity_at_bind_time.evaluated_at,
    `${label} evaluated_at must be stable`
  );
  expect(
    firstPayload.state_validity_at_bind_time.expires_at ===
      secondPayload.state_validity_at_bind_time.expires_at,
    `${label} expires_at must be stable`
  );
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function createTempFixtures() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mf-guard-authority-explain-"));
  const staleFixturePath = path.join(tempRoot, "stale.json");
  const mismatchFixturePath = path.join(tempRoot, "mismatch.json");
  const unknownFixturePath = path.join(tempRoot, "unknown.json");
  const malformedFixturePath = path.join(tempRoot, "malformed.json");
  const invalidJsonPath = path.join(tempRoot, "invalid.json");

  const insideFixture = JSON.parse(
    fs.readFileSync("fixtures/authority/authority-boundary.inside-scope.valid.json", "utf8")
  );

  const staleFixture = structuredClone(insideFixture);
  staleFixture.context_snapshot.branch = "stale/preview-branch";
  writeJson(staleFixturePath, staleFixture);

  const mismatchFixture = structuredClone(insideFixture);
  mismatchFixture.intent.protected_surfaces_touched = true;
  mismatchFixture.context_snapshot.protected_surfaces_touched = true;
  mismatchFixture.authority_scope.requested_operation = "touch_protected_surface";
  writeJson(mismatchFixturePath, mismatchFixture);

  const unknownFixture = structuredClone(insideFixture);
  unknownFixture.decision = "insufficient_context";
  writeJson(unknownFixturePath, unknownFixture);

  const malformedFixture = structuredClone(insideFixture);
  delete malformedFixture.authority_receipt;
  writeJson(malformedFixturePath, malformedFixture);

  fs.writeFileSync(invalidJsonPath, "{invalid-json", "utf8");

  return {
    tempRoot,
    staleFixturePath,
    mismatchFixturePath,
    unknownFixturePath,
    malformedFixturePath,
    invalidJsonPath,
  };
}

const { runGuard } = await import("../packages/guard/src/runGuard.mjs");

async function runAuthorityExplain(args) {
  return runGuard({
    argv: ["authority", "explain", ...args],
  });
}

async function runAuthorityCheck(args) {
  return runGuard({
    argv: ["authority", "check", ...args],
  });
}

const insideFixture = JSON.parse(
  fs.readFileSync("fixtures/authority/authority-boundary.inside-scope.valid.json", "utf8")
);
const outsideFixture = JSON.parse(
  fs.readFileSync("fixtures/authority/authority-boundary.outside-scope.valid.json", "utf8")
);

const insideResult = await runAuthorityExplain([
  "--preview",
  "--json",
  "--fixture-file",
  "fixtures/authority/authority-boundary.inside-scope.valid.json",
]);
expect(insideResult.exitCode === 0, "inside explain should exit 0");
expect(insideResult.exitCode !== 21, "inside explain must not use exit 21");
expect(insideResult.exitCode !== 25, "inside explain must not use exit 25");
const insidePayload = parseJsonOutput(insideResult, "inside explain");
expectExplainPayload(insidePayload, "inside_scope", "valid", "inside explain");

const insideRepeatResult = await runAuthorityExplain([
  "--preview",
  "--json",
  "--fixture-file",
  "fixtures/authority/authority-boundary.inside-scope.valid.json",
]);
expect(insideRepeatResult.exitCode === 0, "repeat inside explain should exit 0");
const insideRepeatPayload = parseJsonOutput(insideRepeatResult, "repeat inside explain");
expectExplainPayload(insideRepeatPayload, "inside_scope", "valid", "repeat inside explain");
expectDeterministicStability(insidePayload, insideRepeatPayload, "inside explain");

const outsideResult = await runAuthorityExplain([
  "--preview",
  "--json",
  "--fixture-file",
  "fixtures/authority/authority-boundary.outside-scope.valid.json",
]);
expect(outsideResult.exitCode === 0, "outside explain should exit 0");
expect(outsideResult.exitCode !== 21, "outside explain must not use exit 21");
expect(outsideResult.exitCode !== 25, "outside explain must not use exit 25");
const outsidePayload = parseJsonOutput(outsideResult, "outside explain");
expectExplainPayload(outsidePayload, "outside_scope", "valid", "outside explain");
expect(
  outsidePayload.authority_check_ref.decision === "outside_scope",
  "outside_scope must remain a successful decision result, not a denial"
);

const missingPreview = await runAuthorityExplain([
  "--json",
  "--fixture-file",
  "fixtures/authority/authority-boundary.inside-scope.valid.json",
]);
expect(missingPreview.exitCode === 2, "missing --preview should exit 2");

const missingJson = await runAuthorityExplain([
  "--preview",
  "--fixture-file",
  "fixtures/authority/authority-boundary.inside-scope.valid.json",
]);
expect(missingJson.exitCode === 2, "missing --json should exit 2");

const missingFixtureFlag = await runAuthorityExplain([
  "--preview",
  "--json",
]);
expect(missingFixtureFlag.exitCode === 2, "missing --fixture-file should exit 2");

const unknownOptionResult = await runAuthorityExplain([
  "--preview",
  "--json",
  "--fixture-file",
  "fixtures/authority/authority-boundary.inside-scope.valid.json",
  "--unknown-option",
]);
expect(unknownOptionResult.exitCode === 2, "unknown option should exit 2");

const malformedUsageResult = await runAuthorityExplain([
  "--preview",
  "--json",
  "--fixture-file",
  "fixtures/authority/authority-boundary.inside-scope.valid.json",
  "unexpected-positional",
]);
expect(malformedUsageResult.exitCode === 2, "malformed usage should exit 2");

const { tempRoot, staleFixturePath, mismatchFixturePath, unknownFixturePath, malformedFixturePath, invalidJsonPath } =
  createTempFixtures();

try {
  const staleResult = await runAuthorityExplain([
    "--preview",
    "--json",
    "--fixture-file",
    staleFixturePath,
  ]);
  expect(staleResult.exitCode === 0, "stale bind-time state should exit 0");
  const stalePayload = parseJsonOutput(staleResult, "stale explain");
  expectExplainPayload(stalePayload, "inside_scope", "stale", "stale explain");

  const mismatchResult = await runAuthorityExplain([
    "--preview",
    "--json",
    "--fixture-file",
    mismatchFixturePath,
  ]);
  expect(mismatchResult.exitCode === 0, "mismatch bind-time state should exit 0");
  const mismatchPayload = parseJsonOutput(mismatchResult, "mismatch explain");
  expectExplainPayload(
    mismatchPayload,
    "inside_scope",
    "mismatch",
    "mismatch explain"
  );

  const unknownResult = await runAuthorityExplain([
    "--preview",
    "--json",
    "--fixture-file",
    unknownFixturePath,
  ]);
  expect(unknownResult.exitCode === 0, "unknown bind-time state should exit 0");
  const unknownPayload = parseJsonOutput(unknownResult, "unknown explain");
  expectExplainPayload(
    unknownPayload,
    "insufficient_context",
    "unknown",
    "unknown explain"
  );

  const malformedResult = await runAuthorityExplain([
    "--preview",
    "--json",
    "--fixture-file",
    malformedFixturePath,
  ]);
  expect(malformedResult.exitCode === 30, "malformed fixture should exit 30");

  const invalidJsonResult = await runAuthorityExplain([
    "--preview",
    "--json",
    "--fixture-file",
    invalidJsonPath,
  ]);
  expect(invalidJsonResult.exitCode === 30, "invalid JSON fixture should exit 30");
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

const insideCheckResult = await runAuthorityCheck([
  "--preview",
  "--json",
  "--fixture-file",
  "fixtures/authority/authority-boundary.inside-scope.valid.json",
]);
expect(insideCheckResult.exitCode === 0, "inside check should still exit 0");
expectCheckOutputUnchanged(parseJsonOutput(insideCheckResult, "inside check"), insideFixture, "inside check");

const outsideCheckResult = await runAuthorityCheck([
  "--preview",
  "--json",
  "--fixture-file",
  "fixtures/authority/authority-boundary.outside-scope.valid.json",
]);
expect(outsideCheckResult.exitCode === 0, "outside check should still exit 0");
expectCheckOutputUnchanged(parseJsonOutput(outsideCheckResult, "outside check"), outsideFixture, "outside check");

process.stdout.write("authority explain preview verified\n");
