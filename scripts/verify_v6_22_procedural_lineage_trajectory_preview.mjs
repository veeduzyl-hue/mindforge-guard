import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

function fail(message) {
  throw new Error(message);
}

function expect(condition, message) {
  if (!condition) fail(message);
}

function readJson(filePath, label) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`${label} must contain valid JSON (${error.message})`);
  }
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
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

function expectNoForbiddenDecisionSemantics(value, label) {
  const forbiddenFields = new Set([
    "optimize",
    "control",
    "reroute",
    "orchestrate",
    "execute_workflow",
    "run_agent",
    "grant_permission",
    "approve",
    "admit",
    "deny",
    "defer",
    "allow",
    "block",
    "pass",
    "fail",
    "permit",
    "commit",
    "deploy",
    "enforcement_decision",
    "policy_decision",
    "trajectory_control",
    "trajectory_approved",
    "safe_to_execute"
  ]);
  const forbiddenValues = new Set([...forbiddenFields]);

  walk(value, (entry) => {
    if (typeof entry === "string" && forbiddenFields.has(entry)) {
      throw new Error(`${label} contains forbidden field ${entry}`);
    }
    if (typeof entry === "string" && forbiddenValues.has(entry.toLowerCase())) {
      throw new Error(`${label} contains forbidden value ${entry}`);
    }
  });
}

function stableValue(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => stableValue(entry));
  }
  if (!value || typeof value !== "object") {
    return value;
  }
  return Object.keys(value)
    .sort()
    .reduce((result, key) => {
      result[key] = stableValue(value[key]);
      return result;
    }, {});
}

function stableStringify(value) {
  return JSON.stringify(stableValue(value));
}

function sha256(value) {
  return `sha256:${createHash("sha256").update(stableStringify(value)).digest("hex")}`;
}

function expectExactArray(actual, expected, label) {
  expect(
    JSON.stringify(actual) === JSON.stringify(expected),
    `${label} mismatch: expected ${JSON.stringify(expected)} got ${JSON.stringify(actual)}`
  );
}

function expectObject(value, label) {
  expect(value && typeof value === "object" && !Array.isArray(value), `${label} must be an object`);
}

function expectString(value, label) {
  expect(typeof value === "string" && value.length >= 1, `${label} must be a non-empty string`);
}

function expectBooleanConst(value, expected, label) {
  expect(value === expected, `${label} must be ${expected}`);
}

function expectNullableString(value, label) {
  expect(value === null || (typeof value === "string" && value.length >= 1), `${label} must be a string or null`);
}

function expectEnum(value, allowed, label) {
  expect(allowed.includes(value), `${label} must be one of ${allowed.join(", ")}`);
}

function expectRequiredKeys(value, requiredKeys, label) {
  expectObject(value, label);
  const actualKeys = Object.keys(value).sort();
  const expectedKeys = [...requiredKeys].sort();
  expect(
    JSON.stringify(actualKeys) === JSON.stringify(expectedKeys),
    `${label} keys mismatch: expected ${JSON.stringify(expectedKeys)} got ${JSON.stringify(actualKeys)}`
  );
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const schemaPath = path.join(
  repoRoot,
  "schemas",
  "procedural_lineage_trajectory",
  "procedural-lineage-trajectory-preview.schema.json"
);
const fixturePath = path.join(
  repoRoot,
  "fixtures",
  "procedural_lineage_trajectory",
  "procedural-lineage-trajectory.cases.valid.json"
);
const boundaryDocPath = path.join(
  repoRoot,
  "docs",
  "governance",
  "v6_22_procedural_lineage_trajectory_boundary.md"
);
const scopeCardPath = path.join(
  repoRoot,
  "docs",
  "governance",
  "v6_22_procedural_lineage_trajectory_scope_card.md"
);
const runGuardPath = path.join(repoRoot, "packages", "guard", "src", "runGuard.mjs");

const EXPECTED_TRAJECTORY_STATUSES = [
  "visible",
  "partially_visible",
  "insufficient_lineage",
  "out_of_scope",
  "unknown"
];
const EXPECTED_SEGMENT_TYPES = [
  "admissibility_prerequisite",
  "authority_drift_validity",
  "symbolic_guardrail_mapping",
  "transition_validity",
  "procedural_artifact_receipt"
];
const EXPECTED_FINDING_TYPES = [
  "lineage_ref_recorded",
  "segment_summary_recorded",
  "missing_lineage_ref",
  "insufficient_lineage_evidence",
  "trajectory_control_out_of_scope",
  "optimization_out_of_scope",
  "rerouting_out_of_scope",
  "orchestration_out_of_scope",
  "workflow_execution_out_of_scope",
  "not_preview_determinable"
];
const EXPECTED_VERIFICATION_SURFACES = [
  "fixture_declared",
  "receipt_ref_declared",
  "deterministic_summary_declared",
  "external_system_required",
  "human_review_required",
  "not_preview_determinable"
];
const EXPECTED_SOURCE_VERSIONS = ["v6.17", "v6.18", "v6.19", "v6.20", "v6.21"];
const EXPECTED_SUMMARY_KINDS = [
  "admissibility_prerequisite_summary",
  "authority_drift_validity_summary",
  "symbolic_guardrail_mapping_summary",
  "transition_validity_preservation_summary",
  "procedural_artifact_patch_receipt_summary"
];
const ALLOWED_EXIT_CODES = new Set([0, 2, 30]);

function expectFileExists(filePath, label) {
  expect(fs.existsSync(filePath), `${label} must exist at ${path.relative(repoRoot, filePath)}`);
}

function expectSchemaShape(schema) {
  expect(schema.type === "object", "schema top-level type mismatch");
  expect(schema.additionalProperties === false, "schema must disallow additionalProperties at top level");
  expect(
    schema.properties.schema_version.const === "guard.procedural_lineage_trajectory_preview.v1",
    "schema_version const mismatch"
  );
  expectExactArray(schema.$defs.trajectoryStatus.enum, EXPECTED_TRAJECTORY_STATUSES, "trajectory_status enum");
  expectExactArray(schema.$defs.segmentType.enum, EXPECTED_SEGMENT_TYPES, "segment_type enum");
  expectExactArray(schema.$defs.findingType.enum, EXPECTED_FINDING_TYPES, "finding_type enum");
  expectExactArray(
    schema.$defs.verificationSurface.enum,
    EXPECTED_VERIFICATION_SURFACES,
    "verification_surface enum"
  );
  expectExactArray(schema.$defs.sourceVersion.enum, EXPECTED_SOURCE_VERSIONS, "source_version enum");
  expectExactArray(schema.$defs.summaryKind.enum, EXPECTED_SUMMARY_KINDS, "summary_kind enum");
  expect(schema.$defs.fixtureBundle, "schema must define fixtureBundle");
}

function expectScopeCard(scopeCard) {
  for (const phrase of [
    "Scope card only. Not implemented.",
    "Trajectory visibility, not trajectory control.",
    "no trajectory optimizer",
    "no runtime controller",
    "no multi-agent orchestrator",
    "no auto rerouting system",
    "no workflow executor",
    "no policy engine",
    "no proof that a trajectory is safe to execute",
    "no approval that a lineage may proceed"
  ]) {
    expect(scopeCard.includes(phrase), `scope card must include ${phrase}`);
  }
}

function expectBoundaryDoc(boundaryDoc) {
  expect(
    boundaryDoc.includes("Trajectory visibility, not trajectory control"),
    "boundary doc must include the narrative 'Trajectory visibility, not trajectory control'"
  );
  for (const phrase of [
    "The PR-A preview surface is verifier-harness only.",
    "There is no CLI in PR-A.",
    "There are no `runGuard` changes in PR-A.",
    "no trajectory optimizer",
    "no runtime controller",
    "no multi-agent orchestrator",
    "no auto rerouting system",
    "no workflow executor",
    "no policy engine",
    "no permission grant",
    "no lineage approval",
    "no trajectory-safe-to-execute proof",
    "no commercial entitlement change"
  ]) {
    expect(boundaryDoc.includes(phrase), `boundary doc must include ${phrase}`);
  }
  for (const forbiddenClaim of [
    "supports trajectory optimization",
    "supports trajectory control",
    "reroutes tasks",
    "executes workflows",
    "orchestrates agents",
    "grants permissions",
    "approves lineage progression",
    "proves a trajectory is safe to execute",
    "changes commercial entitlements"
  ]) {
    expect(!boundaryDoc.includes(forbiddenClaim), `boundary doc must not claim ${forbiddenClaim}`);
  }
}

function validateFixtureBundle(fixture, schema) {
  const requiredKeys = schema.$defs.fixtureBundle.required;
  expectRequiredKeys(fixture, requiredKeys, "fixture bundle");
  expect(fixture.schema_version === "guard.procedural_lineage_trajectory_fixture.v1", "fixture schema_version mismatch");
  expectBooleanConst(fixture.preview, true, "fixture.preview");
  expectBooleanConst(fixture.visibility_only, true, "fixture.visibility_only");
  expectBooleanConst(fixture.explanation_only, true, "fixture.explanation_only");
  expectBooleanConst(fixture.fixture_backed, true, "fixture.fixture_backed");
  expectBooleanConst(fixture.derived_only, true, "fixture.derived_only");
  expectBooleanConst(fixture.no_live_repo_state_reading, true, "fixture.no_live_repo_state_reading");
  expectBooleanConst(fixture.no_live_source_fetching, true, "fixture.no_live_source_fetching");
  expectBooleanConst(fixture.no_external_calls, true, "fixture.no_external_calls");
  expectBooleanConst(fixture.no_runtime_enforcement, true, "fixture.no_runtime_enforcement");
  expectBooleanConst(fixture.no_authority_expansion, true, "fixture.no_authority_expansion");
  expectExactArray(
    [...fixture.frozen_summary_lineage].sort(),
    [...EXPECTED_SOURCE_VERSIONS].sort(),
    "fixture.frozen_summary_lineage"
  );
  expect(Array.isArray(fixture.cases) && fixture.cases.length === 5, "fixture.cases length mismatch");
  fixture.cases.forEach((entry, index) => validateFixtureCase(entry, schema, `fixture.cases[${index}]`));
}

function validateFixtureCase(entry, schema, label) {
  const requiredKeys = schema.$defs.fixtureCase.required;
  expectRequiredKeys(entry, requiredKeys, label);
  expectString(entry.case_id, `${label}.case_id`);
  expectEnum(entry.trajectory_status, EXPECTED_TRAJECTORY_STATUSES, `${label}.trajectory_status`);
  expect(Array.isArray(entry.lineage_refs) && entry.lineage_refs.length >= 1, `${label}.lineage_refs must be a non-empty array`);
  entry.lineage_refs.forEach((ref, index) => validateLineageRef(ref, schema, `${label}.lineage_refs[${index}]`));
  expect(
    Array.isArray(entry.trajectory_segments) && entry.trajectory_segments.length >= 1,
    `${label}.trajectory_segments must be a non-empty array`
  );
  entry.trajectory_segments.forEach((segment, index) => validateTrajectorySegment(segment, schema, `${label}.trajectory_segments[${index}]`));
  expect(
    Array.isArray(entry.trajectory_findings) && entry.trajectory_findings.length >= 1,
    `${label}.trajectory_findings must be a non-empty array`
  );
  entry.trajectory_findings.forEach((finding, index) => validateTrajectoryFinding(finding, schema, `${label}.trajectory_findings[${index}]`));
  expectNoForbiddenDecisionSemantics(entry, label);
}

function buildTrajectoryBoundary() {
  return {
    visibility_only: true,
    explanation_only: true,
    trajectory_control_performed: false,
    optimization_performed: false,
    rerouting_performed: false,
    workflow_execution_performed: false,
    agent_orchestration_performed: false,
    permission_granted: false,
    file_mutation_performed: false,
    enforcement_action: "none",
    blocking_effect: false,
    does_not_control_trajectory: true,
    does_not_optimize_trajectory: true,
    does_not_reroute_tasks: true,
    does_not_execute_workflow: true,
    does_not_orchestrate_agents: true,
    does_not_grant_permission: true,
    does_not_mutate_files: true,
    does_not_approve_lineage_progression: true,
    does_not_prove_trajectory_safe_to_execute: true
  };
}

function buildPreviewTrajectories(fixture, fixtureFileLabel) {
  return fixture.cases.map((entry) => {
    const trajectory = {
      schema_version: "guard.procedural_lineage_trajectory_preview.v1",
      preview: true,
      visibility_only: true,
      explanation_only: true,
      recommendation_only: true,
      fixture_backed: true,
      deterministic: true,
      non_executing: true,
      additive_only: true,
      no_authority_expansion: true,
      trajectory_status: entry.trajectory_status,
      trajectory_control_performed: false,
      optimization_performed: false,
      rerouting_performed: false,
      workflow_execution_performed: false,
      agent_orchestration_performed: false,
      permission_granted: false,
      file_mutation_performed: false,
      enforcement_action: "none",
      blocking_effect: false,
      input_ref: {
        kind: "fixture_case",
        fixture_file: fixtureFileLabel,
        fixture_schema_version: fixture.schema_version,
        case_id: entry.case_id,
        fixture_backed: true,
        consumed_by_reference_only: true,
        frozen_summary_lineage: [...fixture.frozen_summary_lineage]
      },
      lineage_refs: entry.lineage_refs.map((ref) => ({ ...ref })),
      trajectory_segments: entry.trajectory_segments.map((segment) => ({ ...segment })),
      trajectory_findings: entry.trajectory_findings.map((finding) => ({ ...finding })),
      trajectory_boundary: buildTrajectoryBoundary()
    };
    trajectory.deterministic_hash = sha256(trajectory);
    return trajectory;
  });
}

function validateInputRef(inputRef, schema, label) {
  const requiredKeys = schema.$defs.inputRef.required;
  expectRequiredKeys(inputRef, requiredKeys, label);
  expect(inputRef.kind === "fixture_case", `${label}.kind mismatch`);
  expectString(inputRef.fixture_file, `${label}.fixture_file`);
  expectString(inputRef.fixture_schema_version, `${label}.fixture_schema_version`);
  expectString(inputRef.case_id, `${label}.case_id`);
  expectBooleanConst(inputRef.fixture_backed, true, `${label}.fixture_backed`);
  expectBooleanConst(inputRef.consumed_by_reference_only, true, `${label}.consumed_by_reference_only`);
  expectExactArray(
    [...inputRef.frozen_summary_lineage].sort(),
    [...EXPECTED_SOURCE_VERSIONS].sort(),
    `${label}.frozen_summary_lineage`
  );
}

function validateLineageRef(lineageRef, schema, label) {
  const requiredKeys = schema.$defs.lineageRef.required;
  expectRequiredKeys(lineageRef, requiredKeys, label);
  expectEnum(lineageRef.source_version, EXPECTED_SOURCE_VERSIONS, `${label}.source_version`);
  expectEnum(lineageRef.summary_kind, EXPECTED_SUMMARY_KINDS, `${label}.summary_kind`);
  expectString(lineageRef.source_receipt_ref, `${label}.source_receipt_ref`);
  expectEnum(lineageRef.verification_surface, EXPECTED_VERIFICATION_SURFACES, `${label}.verification_surface`);
}

function validateTrajectorySegment(segment, schema, label) {
  const requiredKeys = schema.$defs.trajectorySegment.required;
  expectRequiredKeys(segment, requiredKeys, label);
  expectString(segment.segment_id, `${label}.segment_id`);
  expectEnum(segment.segment_type, EXPECTED_SEGMENT_TYPES, `${label}.segment_type`);
  expectString(segment.segment_summary, `${label}.segment_summary`);
  expectEnum(segment.source_version, EXPECTED_SOURCE_VERSIONS, `${label}.source_version`);
  expectNullableString(segment.related_lineage_ref, `${label}.related_lineage_ref`);
  expectEnum(segment.verification_surface, EXPECTED_VERIFICATION_SURFACES, `${label}.verification_surface`);
}

function validateTrajectoryFinding(finding, schema, label) {
  const requiredKeys = schema.$defs.trajectoryFinding.required;
  expectRequiredKeys(finding, requiredKeys, label);
  expectString(finding.finding_id, `${label}.finding_id`);
  expectEnum(finding.finding_type, EXPECTED_FINDING_TYPES, `${label}.finding_type`);
  expectEnum(finding.verification_surface, EXPECTED_VERIFICATION_SURFACES, `${label}.verification_surface`);
  expectString(finding.finding_summary, `${label}.finding_summary`);
  expectNullableString(finding.related_lineage_ref, `${label}.related_lineage_ref`);
  expectNullableString(finding.gap_summary, `${label}.gap_summary`);
}

function validateTrajectoryBoundary(boundary, schema, label) {
  const requiredKeys = schema.$defs.trajectoryBoundary.required;
  expectRequiredKeys(boundary, requiredKeys, label);
  expectBooleanConst(boundary.visibility_only, true, `${label}.visibility_only`);
  expectBooleanConst(boundary.explanation_only, true, `${label}.explanation_only`);
  expectBooleanConst(boundary.trajectory_control_performed, false, `${label}.trajectory_control_performed`);
  expectBooleanConst(boundary.optimization_performed, false, `${label}.optimization_performed`);
  expectBooleanConst(boundary.rerouting_performed, false, `${label}.rerouting_performed`);
  expectBooleanConst(boundary.workflow_execution_performed, false, `${label}.workflow_execution_performed`);
  expectBooleanConst(boundary.agent_orchestration_performed, false, `${label}.agent_orchestration_performed`);
  expectBooleanConst(boundary.permission_granted, false, `${label}.permission_granted`);
  expectBooleanConst(boundary.file_mutation_performed, false, `${label}.file_mutation_performed`);
  expect(boundary.enforcement_action === "none", `${label}.enforcement_action mismatch`);
  expectBooleanConst(boundary.blocking_effect, false, `${label}.blocking_effect`);
  expectBooleanConst(boundary.does_not_control_trajectory, true, `${label}.does_not_control_trajectory`);
  expectBooleanConst(boundary.does_not_optimize_trajectory, true, `${label}.does_not_optimize_trajectory`);
  expectBooleanConst(boundary.does_not_reroute_tasks, true, `${label}.does_not_reroute_tasks`);
  expectBooleanConst(boundary.does_not_execute_workflow, true, `${label}.does_not_execute_workflow`);
  expectBooleanConst(boundary.does_not_orchestrate_agents, true, `${label}.does_not_orchestrate_agents`);
  expectBooleanConst(boundary.does_not_grant_permission, true, `${label}.does_not_grant_permission`);
  expectBooleanConst(boundary.does_not_mutate_files, true, `${label}.does_not_mutate_files`);
  expectBooleanConst(
    boundary.does_not_approve_lineage_progression,
    true,
    `${label}.does_not_approve_lineage_progression`
  );
  expectBooleanConst(
    boundary.does_not_prove_trajectory_safe_to_execute,
    true,
    `${label}.does_not_prove_trajectory_safe_to_execute`
  );
}

function validatePreviewTrajectory(trajectory, schema, label) {
  const requiredKeys = schema.required;
  expectRequiredKeys(trajectory, requiredKeys.concat([
    "recommendation_only",
    "fixture_backed",
    "deterministic",
    "non_executing",
    "additive_only",
    "no_authority_expansion"
  ]), label);
  expect(trajectory.schema_version === "guard.procedural_lineage_trajectory_preview.v1", `${label}.schema_version mismatch`);
  expectBooleanConst(trajectory.preview, true, `${label}.preview`);
  expectBooleanConst(trajectory.visibility_only, true, `${label}.visibility_only`);
  expectBooleanConst(trajectory.explanation_only, true, `${label}.explanation_only`);
  expectBooleanConst(trajectory.recommendation_only, true, `${label}.recommendation_only`);
  expectBooleanConst(trajectory.fixture_backed, true, `${label}.fixture_backed`);
  expectBooleanConst(trajectory.deterministic, true, `${label}.deterministic`);
  expectBooleanConst(trajectory.non_executing, true, `${label}.non_executing`);
  expectBooleanConst(trajectory.additive_only, true, `${label}.additive_only`);
  expectBooleanConst(trajectory.no_authority_expansion, true, `${label}.no_authority_expansion`);
  expectEnum(trajectory.trajectory_status, EXPECTED_TRAJECTORY_STATUSES, `${label}.trajectory_status`);
  expectBooleanConst(trajectory.trajectory_control_performed, false, `${label}.trajectory_control_performed`);
  expectBooleanConst(trajectory.optimization_performed, false, `${label}.optimization_performed`);
  expectBooleanConst(trajectory.rerouting_performed, false, `${label}.rerouting_performed`);
  expectBooleanConst(trajectory.workflow_execution_performed, false, `${label}.workflow_execution_performed`);
  expectBooleanConst(trajectory.agent_orchestration_performed, false, `${label}.agent_orchestration_performed`);
  expectBooleanConst(trajectory.permission_granted, false, `${label}.permission_granted`);
  expectBooleanConst(trajectory.file_mutation_performed, false, `${label}.file_mutation_performed`);
  expect(trajectory.enforcement_action === "none", `${label}.enforcement_action mismatch`);
  expectBooleanConst(trajectory.blocking_effect, false, `${label}.blocking_effect`);
  validateInputRef(trajectory.input_ref, schema, `${label}.input_ref`);
  expect(Array.isArray(trajectory.lineage_refs) && trajectory.lineage_refs.length >= 1, `${label}.lineage_refs must be a non-empty array`);
  trajectory.lineage_refs.forEach((entry, index) => validateLineageRef(entry, schema, `${label}.lineage_refs[${index}]`));
  expect(
    Array.isArray(trajectory.trajectory_segments) && trajectory.trajectory_segments.length >= 1,
    `${label}.trajectory_segments must be a non-empty array`
  );
  trajectory.trajectory_segments.forEach((entry, index) => validateTrajectorySegment(entry, schema, `${label}.trajectory_segments[${index}]`));
  expect(
    Array.isArray(trajectory.trajectory_findings) && trajectory.trajectory_findings.length >= 1,
    `${label}.trajectory_findings must be a non-empty array`
  );
  trajectory.trajectory_findings.forEach((entry, index) => validateTrajectoryFinding(entry, schema, `${label}.trajectory_findings[${index}]`));
  validateTrajectoryBoundary(trajectory.trajectory_boundary, schema, `${label}.trajectory_boundary`);
  expect(
    typeof trajectory.deterministic_hash === "string" && /^sha256:[a-f0-9]{64}$/.test(trajectory.deterministic_hash),
    `${label}.deterministic_hash mismatch`
  );
  const withoutHash = { ...trajectory };
  delete withoutHash.deterministic_hash;
  expect(
    trajectory.deterministic_hash === sha256(withoutHash),
    `${label}.deterministic_hash must match canonical payload`
  );
  expectNoForbiddenDecisionSemantics(trajectory, label);
}

function parseJsonOutput(result, label) {
  try {
    return JSON.parse(result.stdout);
  } catch (error) {
    fail(`${label} must output valid JSON (${error.message})`);
  }
}

function runPreviewHarness({ fixtureFile, unknownOption = false } = {}) {
  if (unknownOption) {
    return {
      exitCode: 2,
      stdout: "",
      stderr: "Unknown option: --unknown-option"
    };
  }

  if (!fixtureFile) {
    return {
      exitCode: 2,
      stdout: "",
      stderr: "Missing required option: fixtureFile"
    };
  }

  if (!fs.existsSync(fixtureFile)) {
    return {
      exitCode: 30,
      stdout: JSON.stringify({ error: { kind: "procedural_lineage_trajectory_fixture_missing" } }),
      stderr: ""
    };
  }

  let fixture;
  try {
    fixture = JSON.parse(fs.readFileSync(fixtureFile, "utf8"));
  } catch {
    return {
      exitCode: 30,
      stdout: JSON.stringify({ error: { kind: "procedural_lineage_trajectory_fixture_invalid_json" } }),
      stderr: ""
    };
  }

  try {
    const schema = readJson(schemaPath, "schema");
    validateFixtureBundle(fixture, schema);
    const trajectories = buildPreviewTrajectories(
      fixture,
      path.relative(repoRoot, fixtureFile).replace(/\\/g, "/")
    );
    return {
      exitCode: 0,
      stdout: JSON.stringify({ trajectories }, null, 2) + "\n",
      stderr: ""
    };
  } catch {
    return {
      exitCode: 30,
      stdout: JSON.stringify({ error: { kind: "procedural_lineage_trajectory_contract_invalid" } }),
      stderr: ""
    };
  }
}

function createTempFixtures(baseFixture) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mf-guard-procedural-trajectory-"));
  const malformedPath = path.join(tempRoot, "malformed.json");
  const invalidJsonPath = path.join(tempRoot, "invalid.json");
  const missingFixturePath = path.join(tempRoot, "missing.json");

  const malformedFixture = structuredClone(baseFixture);
  delete malformedFixture.cases;
  writeJson(malformedPath, malformedFixture);
  fs.writeFileSync(invalidJsonPath, "{ invalid json\n", "utf8");

  return { tempRoot, malformedPath, invalidJsonPath, missingFixturePath };
}

async function main() {
  expectFileExists(schemaPath, "v6.22 schema");
  expectFileExists(fixturePath, "v6.22 fixture bundle");
  expectFileExists(boundaryDocPath, "v6.22 boundary doc");
  expectFileExists(scopeCardPath, "v6.22 scope card");
  expectFileExists(runGuardPath, "runGuard");

  const schema = readJson(schemaPath, "schema");
  const fixture = readJson(fixturePath, "fixture bundle");
  const boundaryDoc = fs.readFileSync(boundaryDocPath, "utf8");
  const scopeCard = fs.readFileSync(scopeCardPath, "utf8");
  const runGuardSource = fs.readFileSync(runGuardPath, "utf8");

  expectSchemaShape(schema);
  expectScopeCard(scopeCard);
  expectBoundaryDoc(boundaryDoc);
  validateFixtureBundle(fixture, schema);

  expect(!runGuardSource.includes("guard trajectory explain"), "runGuard must remain unchanged for v6.22 PR-A");
  expect(!runGuardSource.includes("procedural_lineage_trajectory"), "runGuard must not dispatch v6.22 trajectory preview");

  const observedExitCodes = new Set();
  const recordExit = (result) => {
    observedExitCodes.add(result.exitCode);
    return result;
  };

  const firstRun = recordExit(runPreviewHarness({ fixtureFile: fixturePath }));
  expect(firstRun.exitCode === 0, "valid fixture should exit 0");
  const firstPayload = parseJsonOutput(firstRun, "first harness run");

  const secondRun = recordExit(runPreviewHarness({ fixtureFile: fixturePath }));
  expect(secondRun.exitCode === 0, "repeat valid fixture should exit 0");
  const secondPayload = parseJsonOutput(secondRun, "second harness run");

  expect(
    JSON.stringify(firstPayload) === JSON.stringify(secondPayload),
    "preview trajectories must remain identical across repeated runs"
  );

  expect(
    Array.isArray(firstPayload.trajectories) && firstPayload.trajectories.length === 5,
    "trajectory count mismatch"
  );

  firstPayload.trajectories.forEach((trajectory, index) => {
    validatePreviewTrajectory(trajectory, schema, `trajectories[${index}]`);
  });

  const observedStatuses = [...new Set(firstPayload.trajectories.map((entry) => entry.trajectory_status))].sort();
  expectExactArray(observedStatuses, [...EXPECTED_TRAJECTORY_STATUSES].sort(), "trajectory_status coverage");

  const observedSegmentTypes = [
    ...new Set(firstPayload.trajectories.flatMap((entry) => entry.trajectory_segments.map((segment) => segment.segment_type)))
  ].sort();
  expectExactArray(observedSegmentTypes, [...EXPECTED_SEGMENT_TYPES].sort(), "segment_type coverage");

  const observedFindingTypes = [
    ...new Set(firstPayload.trajectories.flatMap((entry) => entry.trajectory_findings.map((finding) => finding.finding_type)))
  ].sort();
  expectExactArray(observedFindingTypes, [...EXPECTED_FINDING_TYPES].sort(), "finding_type coverage");

  const observedVerificationSurfaces = [
    ...new Set(
      firstPayload.trajectories.flatMap((entry) => [
        ...entry.lineage_refs.map((lineageRef) => lineageRef.verification_surface),
        ...entry.trajectory_segments.map((segment) => segment.verification_surface),
        ...entry.trajectory_findings.map((finding) => finding.verification_surface)
      ])
    )
  ].sort();
  expectExactArray(
    observedVerificationSurfaces,
    [...EXPECTED_VERIFICATION_SURFACES].sort(),
    "verification_surface coverage"
  );

  const missingFixture = recordExit(runPreviewHarness());
  expect(missingFixture.exitCode === 2, "missing fixture argument should exit 2");

  const unknownOption = recordExit(runPreviewHarness({ fixtureFile: fixturePath, unknownOption: true }));
  expect(unknownOption.exitCode === 2, "unknown option should exit 2");

  const { tempRoot, malformedPath, invalidJsonPath, missingFixturePath } = createTempFixtures(fixture);
  try {
    const missingFixtureResult = recordExit(runPreviewHarness({ fixtureFile: missingFixturePath }));
    expect(missingFixtureResult.exitCode === 30, "missing fixture file should exit 30");

    const invalidJsonResult = recordExit(runPreviewHarness({ fixtureFile: invalidJsonPath }));
    expect(invalidJsonResult.exitCode === 30, "invalid fixture JSON should exit 30");

    const malformedResult = recordExit(runPreviewHarness({ fixtureFile: malformedPath }));
    expect(malformedResult.exitCode === 30, "malformed fixture should exit 30");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  expect(!observedExitCodes.has(21), "exit 21 must not be used");
  expect(!observedExitCodes.has(25), "exit 25 must not be used");
  for (const exitCode of observedExitCodes) {
    expect(ALLOWED_EXIT_CODES.has(exitCode), `unexpected exit code observed: ${exitCode}`);
  }

  process.stdout.write("procedural lineage trajectory preview verified\n");
}

try {
  await main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
