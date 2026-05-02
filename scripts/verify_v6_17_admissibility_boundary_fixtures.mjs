import { runGuard } from "../packages/guard/src/runGuard.mjs";

const ALLOWED_PREREQUISITE_STATES = new Set([
  "explanation_ready",
  "explanation_incomplete",
  "explanation_blocked",
  "explanation_unknown",
]);
const FORBIDDEN_KEYS = new Set([
  "admit",
  "deny",
  "defer",
  "approved",
  "rejected",
  "commit_gate",
  "permit_gate",
  "deployment_gate",
  "runtime_enforcement",
  "requires_human_confirmation",
]);
const FORBIDDEN_VALUES = new Set([
  "admit",
  "deny",
  "defer",
  "approved",
  "rejected",
  "allowed",
  "blocked_by_gate",
  "requires_human_confirmation",
]);

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

function expectExactKeys(actual, expectedKeys, label) {
  const actualKeys = Object.keys(actual).sort();
  const expectedSorted = [...expectedKeys].sort();
  expect(
    JSON.stringify(actualKeys) === JSON.stringify(expectedSorted),
    `${label} keys mismatch: expected ${expectedSorted.join(", ")} got ${actualKeys.join(", ")}`
  );
}

function expectAllowedState(value, label) {
  expect(ALLOWED_PREREQUISITE_STATES.has(value), `${label} must be an allowed prerequisite state`);
}

function walk(value, visit) {
  visit(value);
  if (Array.isArray(value)) {
    for (const entry of value) walk(entry, visit);
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      visit(key);
      walk(entry, visit);
    }
  }
}

function expectNoForbiddenFields(value, label) {
  walk(value, (entry) => {
    if (typeof entry === "string" && FORBIDDEN_VALUES.has(entry)) {
      throw new Error(`${label} contains forbidden string value ${entry}`);
    }
    if (typeof entry === "string" && FORBIDDEN_KEYS.has(entry)) {
      throw new Error(`${label} contains forbidden field ${entry}`);
    }
  });
}

function expectPayload(payload, expectedReadinessState, label) {
  expectExactKeys(
    payload,
    [
      "boundary",
      "command",
      "mode",
      "schema_version",
      "input_ref",
      "authority_context",
      "grounding_context",
      "admissibility_input_package",
      "admissibility_prerequisite_matrix",
      "admissibility_explanation",
      "admissibility_result",
      "receipt_linkage",
      "non_enforcement_boundary",
      "deterministic_hash",
    ],
    `${label} top-level`
  );
  expect(payload.command === "guard admissibility explain", `${label} command mismatch`);
  expect(payload.mode === "preview", `${label} mode mismatch`);
  expect(payload.schema_version === "guard.admissibility_explain_preview.v6_17", `${label} schema version mismatch`);
  expect(payload.input_ref.kind === "fixture_file", `${label} input_ref.kind mismatch`);
  expect(payload.input_ref.fixture_backed === true, `${label} input_ref.fixture_backed mismatch`);
  expect(payload.boundary.preview_only === true, `${label} boundary.preview_only mismatch`);
  expect(payload.boundary.explanation_only === true, `${label} boundary.explanation_only mismatch`);
  expect(payload.boundary.no_admissibility_decision === true, `${label} boundary.no_admissibility_decision mismatch`);
  expect(payload.boundary.no_commit_gate === true, `${label} boundary.no_commit_gate mismatch`);
  expect(payload.boundary.no_permit_gate === true, `${label} boundary.no_permit_gate mismatch`);
  expect(payload.boundary.no_deployment_gate === true, `${label} boundary.no_deployment_gate mismatch`);
  expect(payload.boundary.no_runtime_enforcement === true, `${label} boundary.no_runtime_enforcement mismatch`);

  expectAllowedState(payload.authority_context.current_state_context_state, `${label} authority current state`);
  expectAllowedState(payload.authority_context.bind_time_validity_state, `${label} authority bind-time state`);
  expectAllowedState(payload.grounding_context.evidence_lineage_state, `${label} grounding evidence lineage`);
  expectAllowedState(payload.admissibility_input_package.input_completeness, `${label} input completeness`);
  expectAllowedState(payload.admissibility_input_package.input_consistency, `${label} input consistency`);
  expectAllowedState(payload.admissibility_explanation.readiness_state, `${label} explanation readiness`);
  expect(
    payload.admissibility_explanation.readiness_state === expectedReadinessState,
    `${label} explanation readiness mismatch`
  );

  expect(
    typeof payload.admissibility_input_package.input_package_hash === "string" &&
      payload.admissibility_input_package.input_package_hash.startsWith("sha256:"),
    `${label} input_package_hash mismatch`
  );
  for (const [key, entry] of Object.entries(payload.admissibility_prerequisite_matrix)) {
    expectAllowedState(entry.state, `${label} matrix ${key}`);
    expect(entry.explanation_only === true, `${label} matrix ${key} explanation_only mismatch`);
    expect(entry.decision_effect === false, `${label} matrix ${key} decision_effect mismatch`);
  }

  expectExactKeys(
    payload.admissibility_result,
    ["schema_version", "status", "evaluated", "result", "decision", "reason"],
    `${label} admissibility_result`
  );
  expect(payload.admissibility_result.schema_version === "guard.admissibility_result.reserved.v2", `${label} result schema mismatch`);
  expect(payload.admissibility_result.status === "reserved", `${label} result status mismatch`);
  expect(payload.admissibility_result.evaluated === false, `${label} result evaluated mismatch`);
  expect(payload.admissibility_result.result === "not_evaluated", `${label} result mismatch`);
  expect(payload.admissibility_result.decision === null, `${label} result decision mismatch`);
  expect(
    payload.admissibility_result.reason === "reserved_for_future_admissibility_decision_boundary",
    `${label} result reason mismatch`
  );

  expect(payload.non_enforcement_boundary.admissibility_decision_evaluated === false, `${label} non-enforcement evaluated mismatch`);
  expect(payload.non_enforcement_boundary.permission_granted === false, `${label} non-enforcement permission mismatch`);
  expect(payload.non_enforcement_boundary.commit_gate_triggered === false, `${label} commit gate trigger mismatch`);
  expect(payload.non_enforcement_boundary.permit_gate_triggered === false, `${label} permit gate trigger mismatch`);
  expect(payload.non_enforcement_boundary.deployment_gate_triggered === false, `${label} deployment gate trigger mismatch`);
  expect(payload.non_enforcement_boundary.runtime_enforcement_triggered === false, `${label} runtime enforcement mismatch`);
  expect(payload.non_enforcement_boundary.enforcement_effect === "none", `${label} enforcement effect mismatch`);

  expect(
    typeof payload.deterministic_hash === "string" && payload.deterministic_hash.startsWith("sha256:"),
    `${label} deterministic_hash mismatch`
  );
  expectNoForbiddenFields(payload, `${label} payload`);
}

async function main() {
  for (const [label, fixturePath, expectedReadinessState] of [
    [
      "constructible grounded fixture",
      "fixtures/admissibility/admissibility-boundary.constructible-grounded.valid.json",
      "explanation_ready",
    ],
    [
      "partial basis fixture",
      "fixtures/admissibility/admissibility-boundary.partial-basis.valid.json",
      "explanation_incomplete",
    ],
  ]) {
    const result = await runGuard({
      argv: ["admissibility", "explain", "--preview", "--json", "--fixture-file", fixturePath],
    });
    expect(result.exitCode === 0, `${label} should exit 0`);
    expect(result.exitCode !== 21, `${label} must not use exit 21`);
    expect(result.exitCode !== 25, `${label} must not use exit 25`);
    const payload = JSON.parse(result.stdout);
    expectPayload(payload, expectedReadinessState, label);
  }

  process.stdout.write("PASS verify_v6_17_admissibility_boundary_fixtures\n");
}

try {
  await main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
