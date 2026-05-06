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
    "execute",
    "install",
    "activate",
    "grant_permission",
    "run_skill",
    "orchestrate_agent",
    "deploy_workflow",
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
    "execution_permission",
    "patch_safe_to_run"
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
  "procedural_artifact_receipt",
  "procedural-artifact-patch-receipt-preview.schema.json"
);
const fixturePath = path.join(
  repoRoot,
  "fixtures",
  "procedural_artifact_receipt",
  "procedural-artifact-patch-receipt.cases.valid.json"
);
const boundaryDocPath = path.join(
  repoRoot,
  "docs",
  "governance",
  "v6_21_procedural_artifact_patch_receipt_boundary.md"
);
const scopeCardPath = path.join(
  repoRoot,
  "docs",
  "governance",
  "v6_21_procedural_artifact_patch_receipt_scope_card.md"
);

const EXPECTED_ARTIFACT_SUBJECT_TYPES = [
  "procedure",
  "skill_patch",
  "workflow_instruction",
  "tool_usage_instruction",
  "documentation_patch"
];
const EXPECTED_PATCH_STATUSES = [
  "receipted",
  "partially_receipted",
  "insufficient_basis",
  "out_of_scope",
  "unknown"
];
const EXPECTED_FINDING_TYPES = [
  "declared_change_recorded",
  "consumed_receipt_ref_recorded",
  "missing_receipt_ref",
  "insufficient_patch_evidence",
  "runtime_execution_out_of_scope",
  "permission_grant_out_of_scope",
  "workflow_deployment_out_of_scope",
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
const EXPECTED_SOURCE_VERSIONS = ["v6.17", "v6.18", "v6.19", "v6.20"];
const EXPECTED_SUMMARY_KINDS = [
  "admissibility_prerequisite_summary",
  "authority_drift_validity_summary",
  "symbolic_guardrail_mapping_summary",
  "transition_validity_preservation_summary"
];
const ALLOWED_EXIT_CODES = new Set([0, 2, 30]);

function expectFileExists(filePath, label) {
  expect(fs.existsSync(filePath), `${label} must exist at ${path.relative(repoRoot, filePath)}`);
}

function expectSchemaShape(schema) {
  expect(schema.type === "object", "schema top-level type mismatch");
  expect(schema.additionalProperties === false, "schema must disallow additionalProperties at top level");
  expect(
    schema.properties.schema_version.const === "guard.procedural_artifact_patch_receipt_preview.v1",
    "schema_version const mismatch"
  );
  expectExactArray(schema.$defs.artifactSubjectType.enum, EXPECTED_ARTIFACT_SUBJECT_TYPES, "artifact_subject_type enum");
  expectExactArray(schema.$defs.patchStatus.enum, EXPECTED_PATCH_STATUSES, "patch_status enum");
  expectExactArray(schema.$defs.findingType.enum, EXPECTED_FINDING_TYPES, "finding_type enum");
  expectExactArray(schema.$defs.verificationSurface.enum, EXPECTED_VERIFICATION_SURFACES, "verification_surface enum");
  expectExactArray(schema.$defs.sourceVersion.enum, EXPECTED_SOURCE_VERSIONS, "source_version enum");
  expectExactArray(schema.$defs.summaryKind.enum, EXPECTED_SUMMARY_KINDS, "summary_kind enum");
  expect(schema.$defs.fixtureBundle, "schema must define fixtureBundle");
}

function expectScopeCard(scopeCard) {
  for (const phrase of [
    "Scope card only. Not implemented.",
    "Receipt of procedural change, not runtime skill execution.",
    "no skill execution runtime",
    "no agent orchestration layer",
    "no tool permission grant",
    "no workflow deployment gate",
    "no file mutation",
    "no proof that a skill patch is safe to run"
  ]) {
    expect(scopeCard.includes(phrase), `scope card must include ${phrase}`);
  }
}

function expectBoundaryDoc(boundaryDoc) {
  expect(
    boundaryDoc.includes("Receipt of procedural change, not runtime skill execution"),
    "boundary doc must include the narrative 'Receipt of procedural change, not runtime skill execution'"
  );
  for (const phrase of [
    "There is no CLI in PR-A.",
    "There are no `runGuard` changes in PR-A.",
    "no skill execution runtime",
    "no skill installation",
    "no tool permission grant",
    "no agent orchestration",
    "no workflow deployment",
    "no file mutation",
    "no patch-safe-to-run proof",
    "no runtime enforcement",
    "no commercial entitlement change",
    "no live workspace procedural diff"
  ]) {
    expect(boundaryDoc.includes(phrase), `boundary doc must include ${phrase}`);
  }
  for (const forbiddenClaim of [
    "supports skill execution",
    "supports skill installation",
    "grants tool permission",
    "orchestrates agents",
    "deploys workflows",
    "mutates files",
    "proves a patch is safe to run",
    "changes commercial entitlements"
  ]) {
    expect(!boundaryDoc.includes(forbiddenClaim), `boundary doc must not claim ${forbiddenClaim}`);
  }
}

function validateArtifactSubject(subject, schema, label) {
  const requiredKeys = schema.$defs.artifactSubject.required;
  expectRequiredKeys(subject, requiredKeys, label);
  expectString(subject.artifact_subject_id, `${label}.artifact_subject_id`);
  expectEnum(subject.artifact_subject_type, EXPECTED_ARTIFACT_SUBJECT_TYPES, `${label}.artifact_subject_type`);
  expectString(subject.declared_name, `${label}.declared_name`);
  expectString(subject.declared_summary, `${label}.declared_summary`);
}

function validateDeclaredPatch(patch, schema, label) {
  const requiredKeys = schema.$defs.declaredPatch.required;
  expectRequiredKeys(patch, requiredKeys, label);
  expectString(patch.patch_id, `${label}.patch_id`);
  expectString(patch.declared_patch_ref, `${label}.declared_patch_ref`);
  expectString(patch.patch_summary, `${label}.patch_summary`);
  expectEnum(patch.patch_status, EXPECTED_PATCH_STATUSES, `${label}.patch_status`);
  expectString(patch.procedural_change_kind, `${label}.procedural_change_kind`);
}

function validateConsumedReceiptRef(ref, schema, label) {
  const requiredKeys = schema.$defs.consumedReceiptRef.required;
  expectRequiredKeys(ref, requiredKeys, label);
  expectEnum(ref.source_version, EXPECTED_SOURCE_VERSIONS, `${label}.source_version`);
  expectEnum(ref.summary_kind, EXPECTED_SUMMARY_KINDS, `${label}.summary_kind`);
  expectString(ref.source_receipt_ref, `${label}.source_receipt_ref`);
  expectEnum(ref.verification_surface, EXPECTED_VERIFICATION_SURFACES, `${label}.verification_surface`);
}

function validateProceduralFinding(finding, schema, label) {
  const requiredKeys = schema.$defs.proceduralFinding.required;
  expectRequiredKeys(finding, requiredKeys, label);
  expectString(finding.finding_id, `${label}.finding_id`);
  expectEnum(finding.finding_type, EXPECTED_FINDING_TYPES, `${label}.finding_type`);
  expectEnum(finding.verification_surface, EXPECTED_VERIFICATION_SURFACES, `${label}.verification_surface`);
  expectString(finding.finding_summary, `${label}.finding_summary`);
  expectNullableString(finding.related_receipt_ref, `${label}.related_receipt_ref`);
  expectNullableString(finding.gap_summary, `${label}.gap_summary`);
}

function validateFixtureBundle(fixture, schema) {
  const requiredKeys = schema.$defs.fixtureBundle.required;
  expectRequiredKeys(fixture, requiredKeys, "fixture bundle");
  expect(fixture.schema_version === "guard.procedural_artifact_patch_receipt_fixture.v1", "fixture schema_version mismatch");
  expectBooleanConst(fixture.preview, true, "fixture.preview");
  expectBooleanConst(fixture.receipt_only, true, "fixture.receipt_only");
  expectBooleanConst(fixture.explanation_only, true, "fixture.explanation_only");
  expectBooleanConst(fixture.fixture_backed, true, "fixture.fixture_backed");
  expectBooleanConst(fixture.derived_only, true, "fixture.derived_only");
  expectBooleanConst(fixture.no_live_repo_state_reading, true, "fixture.no_live_repo_state_reading");
  expectBooleanConst(fixture.no_live_source_fetching, true, "fixture.no_live_source_fetching");
  expectBooleanConst(fixture.no_external_calls, true, "fixture.no_external_calls");
  expectBooleanConst(fixture.no_runtime_enforcement, true, "fixture.no_runtime_enforcement");
  expectBooleanConst(fixture.no_authority_expansion, true, "fixture.no_authority_expansion");
  expect(Array.isArray(fixture.frozen_summary_lineage), "fixture.frozen_summary_lineage must be an array");
  expectExactArray([...fixture.frozen_summary_lineage].sort(), [...EXPECTED_SOURCE_VERSIONS].sort(), "fixture.frozen_summary_lineage");
  expect(Array.isArray(fixture.cases) && fixture.cases.length === 5, "fixture.cases length mismatch");

  fixture.cases.forEach((entry, index) => {
    const label = `fixture.cases[${index}]`;
    const requiredCaseKeys = schema.$defs.fixtureCase.required;
    expectRequiredKeys(entry, requiredCaseKeys, label);
    expectString(entry.case_id, `${label}.case_id`);
    validateArtifactSubject(entry.artifact_subject, schema, `${label}.artifact_subject`);
    validateDeclaredPatch(entry.declared_patch, schema, `${label}.declared_patch`);
    expect(
      Array.isArray(entry.consumed_receipt_refs) && entry.consumed_receipt_refs.length >= 1,
      `${label}.consumed_receipt_refs must be a non-empty array`
    );
    entry.consumed_receipt_refs.forEach((ref, refIndex) => {
      validateConsumedReceiptRef(ref, schema, `${label}.consumed_receipt_refs[${refIndex}]`);
    });
    expect(
      Array.isArray(entry.procedural_findings) && entry.procedural_findings.length >= 1,
      `${label}.procedural_findings must be a non-empty array`
    );
    entry.procedural_findings.forEach((finding, findingIndex) => {
      validateProceduralFinding(finding, schema, `${label}.procedural_findings[${findingIndex}]`);
    });
  });
}

function buildReceiptBoundary() {
  return {
    receipt_only: true,
    execution_performed: false,
    installation_performed: false,
    permission_granted: false,
    workflow_deployed: false,
    agent_orchestration_performed: false,
    file_mutation_performed: false,
    enforcement_action: "none",
    blocking_effect: false,
    does_not_execute_skill: true,
    does_not_install_skill: true,
    does_not_grant_tool_permission: true,
    does_not_orchestrate_agents: true,
    does_not_deploy_workflow: true,
    does_not_mutate_files: true,
    does_not_prove_patch_safe_to_run: true
  };
}

function buildPreviewReceipts(fixture, fixtureFileRelativePath) {
  return fixture.cases.map((entry) => {
    const receipt = {
      schema_version: "guard.procedural_artifact_patch_receipt_preview.v1",
      preview: true,
      receipt_only: true,
      explanation_only: true,
      recommendation_only: true,
      fixture_backed: true,
      deterministic: true,
      non_executing: true,
      additive_only: true,
      no_authority_expansion: true,
      execution_performed: false,
      installation_performed: false,
      permission_granted: false,
      workflow_deployed: false,
      agent_orchestration_performed: false,
      file_mutation_performed: false,
      enforcement_action: "none",
      blocking_effect: false,
      input_ref: {
        kind: "fixture_case",
        fixture_file: fixtureFileRelativePath,
        fixture_schema_version: fixture.schema_version,
        case_id: entry.case_id,
        fixture_backed: true,
        consumed_by_reference_only: true,
        frozen_summary_lineage: [...fixture.frozen_summary_lineage]
      },
      artifact_subject: structuredClone(entry.artifact_subject),
      declared_patch: structuredClone(entry.declared_patch),
      consumed_receipt_refs: structuredClone(entry.consumed_receipt_refs),
      procedural_findings: structuredClone(entry.procedural_findings),
      receipt_boundary: buildReceiptBoundary()
    };
    receipt.deterministic_hash = sha256(receipt);
    return receipt;
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
  expect(Array.isArray(inputRef.frozen_summary_lineage), `${label}.frozen_summary_lineage must be an array`);
  expectExactArray(
    [...inputRef.frozen_summary_lineage].sort(),
    [...EXPECTED_SOURCE_VERSIONS].sort(),
    `${label}.frozen_summary_lineage`
  );
}

function validateReceiptBoundary(boundary, schema, label) {
  const requiredKeys = schema.$defs.receiptBoundary.required;
  expectRequiredKeys(boundary, requiredKeys, label);
  expectBooleanConst(boundary.receipt_only, true, `${label}.receipt_only`);
  expectBooleanConst(boundary.execution_performed, false, `${label}.execution_performed`);
  expectBooleanConst(boundary.installation_performed, false, `${label}.installation_performed`);
  expectBooleanConst(boundary.permission_granted, false, `${label}.permission_granted`);
  expectBooleanConst(boundary.workflow_deployed, false, `${label}.workflow_deployed`);
  expectBooleanConst(boundary.agent_orchestration_performed, false, `${label}.agent_orchestration_performed`);
  expectBooleanConst(boundary.file_mutation_performed, false, `${label}.file_mutation_performed`);
  expect(boundary.enforcement_action === "none", `${label}.enforcement_action mismatch`);
  expectBooleanConst(boundary.blocking_effect, false, `${label}.blocking_effect`);
  expectBooleanConst(boundary.does_not_execute_skill, true, `${label}.does_not_execute_skill`);
  expectBooleanConst(boundary.does_not_install_skill, true, `${label}.does_not_install_skill`);
  expectBooleanConst(boundary.does_not_grant_tool_permission, true, `${label}.does_not_grant_tool_permission`);
  expectBooleanConst(boundary.does_not_orchestrate_agents, true, `${label}.does_not_orchestrate_agents`);
  expectBooleanConst(boundary.does_not_deploy_workflow, true, `${label}.does_not_deploy_workflow`);
  expectBooleanConst(boundary.does_not_mutate_files, true, `${label}.does_not_mutate_files`);
  expectBooleanConst(
    boundary.does_not_prove_patch_safe_to_run,
    true,
    `${label}.does_not_prove_patch_safe_to_run`
  );
}

function validatePreviewReceipt(receipt, schema, label) {
  const requiredKeys = schema.required;
  expectRequiredKeys(receipt, requiredKeys.concat([
    "recommendation_only",
    "fixture_backed",
    "deterministic",
    "non_executing",
    "additive_only",
    "no_authority_expansion"
  ]), label);
  expect(receipt.schema_version === "guard.procedural_artifact_patch_receipt_preview.v1", `${label}.schema_version mismatch`);
  expectBooleanConst(receipt.preview, true, `${label}.preview`);
  expectBooleanConst(receipt.receipt_only, true, `${label}.receipt_only`);
  expectBooleanConst(receipt.explanation_only, true, `${label}.explanation_only`);
  expectBooleanConst(receipt.recommendation_only, true, `${label}.recommendation_only`);
  expectBooleanConst(receipt.fixture_backed, true, `${label}.fixture_backed`);
  expectBooleanConst(receipt.deterministic, true, `${label}.deterministic`);
  expectBooleanConst(receipt.non_executing, true, `${label}.non_executing`);
  expectBooleanConst(receipt.additive_only, true, `${label}.additive_only`);
  expectBooleanConst(receipt.no_authority_expansion, true, `${label}.no_authority_expansion`);
  expectBooleanConst(receipt.execution_performed, false, `${label}.execution_performed`);
  expectBooleanConst(receipt.installation_performed, false, `${label}.installation_performed`);
  expectBooleanConst(receipt.permission_granted, false, `${label}.permission_granted`);
  expectBooleanConst(receipt.workflow_deployed, false, `${label}.workflow_deployed`);
  expectBooleanConst(receipt.agent_orchestration_performed, false, `${label}.agent_orchestration_performed`);
  expectBooleanConst(receipt.file_mutation_performed, false, `${label}.file_mutation_performed`);
  expect(receipt.enforcement_action === "none", `${label}.enforcement_action mismatch`);
  expectBooleanConst(receipt.blocking_effect, false, `${label}.blocking_effect`);
  validateInputRef(receipt.input_ref, schema, `${label}.input_ref`);
  validateArtifactSubject(receipt.artifact_subject, schema, `${label}.artifact_subject`);
  validateDeclaredPatch(receipt.declared_patch, schema, `${label}.declared_patch`);
  expect(Array.isArray(receipt.consumed_receipt_refs) && receipt.consumed_receipt_refs.length >= 1, `${label}.consumed_receipt_refs must be a non-empty array`);
  receipt.consumed_receipt_refs.forEach((ref, index) => validateConsumedReceiptRef(ref, schema, `${label}.consumed_receipt_refs[${index}]`));
  expect(Array.isArray(receipt.procedural_findings) && receipt.procedural_findings.length >= 1, `${label}.procedural_findings must be a non-empty array`);
  receipt.procedural_findings.forEach((finding, index) => validateProceduralFinding(finding, schema, `${label}.procedural_findings[${index}]`));
  validateReceiptBoundary(receipt.receipt_boundary, schema, `${label}.receipt_boundary`);
  expect(
    typeof receipt.deterministic_hash === "string" && /^sha256:[a-f0-9]{64}$/.test(receipt.deterministic_hash),
    `${label}.deterministic_hash mismatch`
  );
  const withoutHash = { ...receipt };
  delete withoutHash.deterministic_hash;
  expect(receipt.deterministic_hash === sha256(withoutHash), `${label}.deterministic_hash must match canonical payload`);
  expectNoForbiddenDecisionSemantics(receipt, label);
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
      stdout: JSON.stringify({ error: { kind: "procedural_artifact_patch_receipt_fixture_missing" } }),
      stderr: ""
    };
  }

  let fixture;
  try {
    fixture = JSON.parse(fs.readFileSync(fixtureFile, "utf8"));
  } catch {
    return {
      exitCode: 30,
      stdout: JSON.stringify({ error: { kind: "procedural_artifact_patch_receipt_fixture_invalid_json" } }),
      stderr: ""
    };
  }

  try {
    const schema = readJson(schemaPath, "schema");
    validateFixtureBundle(fixture, schema);
    const receipts = buildPreviewReceipts(
      fixture,
      path.relative(repoRoot, fixtureFile).replace(/\\/g, "/")
    );
    return {
      exitCode: 0,
      stdout: JSON.stringify({ receipts }, null, 2) + "\n",
      stderr: ""
    };
  } catch {
    return {
      exitCode: 30,
      stdout: JSON.stringify({ error: { kind: "procedural_artifact_patch_receipt_contract_invalid" } }),
      stderr: ""
    };
  }
}

function createTempFixtures(baseFixture) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mf-guard-procedural-receipt-"));
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
  expectFileExists(schemaPath, "v6.21 schema");
  expectFileExists(fixturePath, "v6.21 fixture bundle");
  expectFileExists(boundaryDocPath, "v6.21 boundary doc");
  expectFileExists(scopeCardPath, "v6.21 scope card");

  const schema = readJson(schemaPath, "schema");
  const fixture = readJson(fixturePath, "fixture bundle");
  const boundaryDoc = fs.readFileSync(boundaryDocPath, "utf8");
  const scopeCard = fs.readFileSync(scopeCardPath, "utf8");

  expectSchemaShape(schema);
  expectScopeCard(scopeCard);
  expectBoundaryDoc(boundaryDoc);
  validateFixtureBundle(fixture, schema);

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
    "preview receipts must remain identical across repeated runs"
  );

  expect(Array.isArray(firstPayload.receipts) && firstPayload.receipts.length === 5, "receipt count mismatch");

  firstPayload.receipts.forEach((receipt, index) => {
    validatePreviewReceipt(receipt, schema, `receipts[${index}]`);
  });

  const observedPatchStatuses = [...new Set(firstPayload.receipts.map((receipt) => receipt.declared_patch.patch_status))].sort();
  expectExactArray(observedPatchStatuses, [...EXPECTED_PATCH_STATUSES].sort(), "patch_status coverage");

  const observedArtifactSubjectTypes = [...new Set(firstPayload.receipts.map((receipt) => receipt.artifact_subject.artifact_subject_type))].sort();
  expectExactArray(
    observedArtifactSubjectTypes,
    [...EXPECTED_ARTIFACT_SUBJECT_TYPES].sort(),
    "artifact_subject_type coverage"
  );

  const observedFindingTypes = [...new Set(firstPayload.receipts.flatMap((receipt) => receipt.procedural_findings.map((finding) => finding.finding_type)))].sort();
  expectExactArray(observedFindingTypes, [...EXPECTED_FINDING_TYPES].sort(), "finding_type coverage");

  const observedVerificationSurfaces = [
    ...new Set(
      firstPayload.receipts.flatMap((receipt) => [
        ...receipt.consumed_receipt_refs.map((ref) => ref.verification_surface),
        ...receipt.procedural_findings.map((finding) => finding.verification_surface)
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

  process.stdout.write("procedural artifact patch receipt preview verified\n");
}

try {
  await main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
