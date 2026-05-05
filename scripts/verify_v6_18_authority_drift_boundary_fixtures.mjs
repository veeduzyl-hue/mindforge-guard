import { runGuard } from "../packages/guard/src/runGuard.mjs";

const FORBIDDEN_KEYS = new Set([
  "commit_gate",
  "permit_gate",
  "deployment_gate",
  "runtime_enforcement",
  "approval_authority",
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

function expectPayload(payload, expected, label) {
  expectExactKeys(
    payload,
    [
      "kind",
      "version",
      "preview",
      "command",
      "mode",
      "schema_version",
      "input_ref",
      "boundary",
      "source_authority_context",
      "execution_context",
      "authority_drift",
      "enforcement_action",
      "blocking_effect",
      "execution_authority_granted",
      "non_enforcement_boundary",
      "deterministic_hash",
    ],
    `${label} top-level`
  );

  expect(payload.kind === "authority_drift_preview", `${label} kind mismatch`);
  expect(payload.version === "v6.18", `${label} version mismatch`);
  expect(payload.preview === true, `${label} preview mismatch`);
  expect(payload.command === "guard authority drift", `${label} command mismatch`);
  expect(payload.mode === "preview", `${label} mode mismatch`);
  expect(payload.schema_version === "guard.authority_drift_preview.v6_18", `${label} schema version mismatch`);
  expect(payload.enforcement_action === "none", `${label} enforcement_action mismatch`);
  expect(payload.blocking_effect === false, `${label} blocking_effect mismatch`);
  expect(payload.execution_authority_granted === false, `${label} execution_authority_granted mismatch`);
  expect(typeof payload.deterministic_hash === "string" && payload.deterministic_hash.startsWith("sha256:"), `${label} deterministic_hash mismatch`);

  expect(payload.input_ref.kind === "fixture_file", `${label} input_ref.kind mismatch`);
  expect(payload.input_ref.fixture_backed === true, `${label} input_ref.fixture_backed mismatch`);
  expect(payload.input_ref.fixture_schema_version === "v6.18-preview", `${label} input_ref.fixture_schema_version mismatch`);

  expect(payload.boundary.preview_only === true, `${label} boundary.preview_only mismatch`);
  expect(payload.boundary.fixture_backed === true, `${label} boundary.fixture_backed mismatch`);
  expect(payload.boundary.derived_only === true, `${label} boundary.derived_only mismatch`);
  expect(payload.boundary.explanation_only === true, `${label} boundary.explanation_only mismatch`);
  expect(payload.boundary.recommendation_only === true, `${label} boundary.recommendation_only mismatch`);
  expect(payload.boundary.non_enforcing === true, `${label} boundary.non_enforcing mismatch`);
  expect(payload.boundary.default_off === true, `${label} boundary.default_off mismatch`);
  expect(payload.boundary.no_execution_authority_granted === true, `${label} boundary.no_execution_authority_granted mismatch`);
  expect(payload.boundary.no_blocking_effect === true, `${label} boundary.no_blocking_effect mismatch`);
  expect(payload.boundary.no_exit_21 === true, `${label} boundary.no_exit_21 mismatch`);
  expect(payload.boundary.no_exit_25 === true, `${label} boundary.no_exit_25 mismatch`);
  expect(payload.boundary.no_audit_semantic_change === true, `${label} boundary.no_audit_semantic_change mismatch`);
  expect(payload.boundary.no_permit_semantic_change === true, `${label} boundary.no_permit_semantic_change mismatch`);
  expect(payload.boundary.no_classify_semantic_change === true, `${label} boundary.no_classify_semantic_change mismatch`);

  expect(payload.source_authority_context.prior_execution_validity === expected.priorExecutionValidity, `${label} prior_execution_validity mismatch`);
  expect(payload.source_authority_context.decision_effect === false, `${label} source_authority_context.decision_effect mismatch`);
  expect(payload.source_authority_context.authority_binding_effect === false, `${label} source_authority_context.authority_binding_effect mismatch`);

  expect(payload.execution_context.execution_scope_state === expected.executionScopeState, `${label} execution_scope_state mismatch`);
  expect(payload.execution_context.evidence_freshness_state === expected.evidenceFreshnessState, `${label} evidence_freshness_state mismatch`);
  expect(payload.execution_context.actor_alignment_state === expected.actorAlignmentState, `${label} actor_alignment_state mismatch`);
  expect(payload.execution_context.decision_effect === false, `${label} execution_context.decision_effect mismatch`);

  expect(payload.authority_drift.status === expected.status, `${label} authority_drift.status mismatch`);
  expect(payload.authority_drift.execution_time_validity === expected.executionTimeValidity, `${label} authority_drift.execution_time_validity mismatch`);
  expect(
    JSON.stringify(payload.authority_drift.drift_factors) === JSON.stringify(expected.driftFactors),
    `${label} authority_drift.drift_factors mismatch`
  );
  expect(
    JSON.stringify(payload.authority_drift.reason_codes) === JSON.stringify(expected.reasonCodes),
    `${label} authority_drift.reason_codes mismatch`
  );
  expect(payload.authority_drift.decision_effect === false, `${label} authority_drift.decision_effect mismatch`);

  expect(payload.non_enforcement_boundary.preview_only === true, `${label} non_enforcement_boundary.preview_only mismatch`);
  expect(payload.non_enforcement_boundary.explanation_only === true, `${label} non_enforcement_boundary.explanation_only mismatch`);
  expect(payload.non_enforcement_boundary.enforced === false, `${label} non_enforcement_boundary.enforced mismatch`);
  expect(payload.non_enforcement_boundary.changes_exit_semantics === false, `${label} non_enforcement_boundary.changes_exit_semantics mismatch`);
  expect(payload.non_enforcement_boundary.execution_authority_granted === false, `${label} non_enforcement_boundary.execution_authority_granted mismatch`);
  expect(payload.non_enforcement_boundary.blocking_effect === false, `${label} non_enforcement_boundary.blocking_effect mismatch`);
  expect(payload.non_enforcement_boundary.enforcement_action === "none", `${label} non_enforcement_boundary.enforcement_action mismatch`);
  expect(payload.non_enforcement_boundary.exit_21_used === false, `${label} non_enforcement_boundary.exit_21_used mismatch`);
  expect(payload.non_enforcement_boundary.exit_25_used === false, `${label} non_enforcement_boundary.exit_25_used mismatch`);

  expectNoForbiddenFields(payload, `${label} payload`);
}

async function main() {
  for (const [label, fixturePath, expected] of [
    [
      "stable execution fixture",
      "fixtures/authority_drift/authority-drift.stable-execution.valid.json",
      {
        priorExecutionValidity: "valid",
        executionScopeState: "aligned",
        evidenceFreshnessState: "fresh",
        actorAlignmentState: "aligned",
        status: "stable",
        executionTimeValidity: "valid",
        driftFactors: ["none_detected"],
        reasonCodes: ["authority_stable_at_execution_time"],
      },
    ],
    [
      "scope drift fixture",
      "fixtures/authority_drift/authority-drift.scope-drift.invalidates.valid.json",
      {
        priorExecutionValidity: "valid",
        executionScopeState: "scope_drifted",
        evidenceFreshnessState: "fresh",
        actorAlignmentState: "aligned",
        status: "drift_detected",
        executionTimeValidity: "invalid",
        driftFactors: ["scope_drift"],
        reasonCodes: ["scope_drift_invalidates_execution_time_authority"],
      },
    ],
    [
      "evidence decay fixture",
      "fixtures/authority_drift/authority-drift.evidence-decay.unknown.valid.json",
      {
        priorExecutionValidity: "valid",
        executionScopeState: "aligned",
        evidenceFreshnessState: "expired",
        actorAlignmentState: "aligned",
        status: "unknown",
        executionTimeValidity: "unknown",
        driftFactors: ["evidence_decay"],
        reasonCodes: ["evidence_decay_execution_time_validity_unknown"],
      },
    ],
    [
      "actor drift fixture",
      "fixtures/authority_drift/authority-drift.actor-drift.invalidates.valid.json",
      {
        priorExecutionValidity: "valid",
        executionScopeState: "aligned",
        evidenceFreshnessState: "fresh",
        actorAlignmentState: "drifted",
        status: "drift_detected",
        executionTimeValidity: "invalid",
        driftFactors: ["actor_drift"],
        reasonCodes: ["actor_drift_invalidates_execution_time_authority"],
      },
    ],
    [
      "outside-scope non-authority fixture",
      "fixtures/authority_drift/authority-drift.outside-scope.non-authority.valid.json",
      {
        priorExecutionValidity: "not_applicable",
        executionScopeState: "not_authority_scoped",
        evidenceFreshnessState: "not_applicable",
        actorAlignmentState: "not_applicable",
        status: "not_applicable",
        executionTimeValidity: "not_applicable",
        driftFactors: ["outside_scope_non_authority_request"],
        reasonCodes: ["outside_scope_non_authority_request"],
      },
    ],
  ]) {
    const result = await runGuard({
      argv: ["authority", "drift", "--preview", "--json", "--fixture-file", fixturePath],
    });
    expect(result.exitCode === 0, `${label} should exit 0`);
    expect(result.exitCode !== 21, `${label} must not use exit 21`);
    expect(result.exitCode !== 25, `${label} must not use exit 25`);
    const payload = JSON.parse(result.stdout);
    expectPayload(payload, expected, label);
  }

  process.stdout.write("PASS verify_v6_18_authority_drift_boundary_fixtures\n");
}

try {
  await main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
