import fs from "node:fs";
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

function expectObject(value, label) {
  expect(value && typeof value === "object" && !Array.isArray(value), `${label} must be an object`);
}

function expectString(value, label) {
  expect(typeof value === "string" && value.length >= 1, `${label} must be a non-empty string`);
}

function expectArray(value, label) {
  expect(Array.isArray(value), `${label} must be an array`);
}

function expectBoolean(value, expected, label) {
  expect(value === expected, `${label} must be ${expected}`);
}

function expectEnum(value, allowed, label) {
  expect(allowed.includes(value), `${label} must be one of ${allowed.join(", ")}`);
}

function expectExactKeys(value, keys, label) {
  expectObject(value, label);
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  expect(
    JSON.stringify(actual) === JSON.stringify(expected),
    `${label} keys mismatch: expected ${JSON.stringify(expected)} got ${JSON.stringify(actual)}`
  );
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const schemaPath = path.join(
  repoRoot,
  "schemas",
  "single_agent_governance_report",
  "preview_v1.schema.json"
);

const fixtureDir = path.join(repoRoot, "fixtures", "single_agent_governance_report");

const fixtureFiles = [
  "ready_for_review.json",
  "needs_human_review.json",
  "insufficient_evidence.json",
  "out_of_scope.json",
  "unknown.json"
];

const expectedTopLevelKeys = [
  "object_type",
  "object_version",
  "report_mode",
  "generated_at",
  "agent_identity",
  "capability_boundary",
  "authority_envelope",
  "execution_path_snapshot",
  "proposed_action",
  "policy_evaluation_preview",
  "findings",
  "review_evidence",
  "artifact_provenance",
  "pre_v6_14_capability_foundation",
  "action_summary",
  "intent_summary",
  "authority_summary",
  "evidence_summary",
  "admissibility_summary",
  "risk_summary",
  "drift_summary",
  "guardrail_mapping_summary",
  "transition_summary",
  "procedural_receipt_summary",
  "lineage_summary",
  "review_posture",
  "receipt_refs",
  "deterministic_hash",
  "non_enforcement_boundary"
];

const allowedReviewPostures = [
  "ready_for_review",
  "needs_human_review",
  "insufficient_evidence",
  "out_of_scope",
  "unknown"
];

const forbiddenTopLevelFields = [
  "readiness_verdict",
  "approval_result",
  "decision",
  "enforcement_result",
  "compliance_status",
  "merge_status",
  "deployment_status",
  "permit_result",
  "commit_result",
  "block_result"
];

const expectedMessage =
  "This report does not approve, reject, block, permit, commit, merge, deploy, or execute any change.";

const expectedFoundationKeys = [
  "status_validate_policy",
  "audit",
  "snapshot",
  "action_classify",
  "drift",
  "assoc_correlate",
  "risk",
  "license_edition_gate",
  "verification_chain"
];

const forbiddenClaimKeys = new Set([
  "audit_semantics_changed",
  "permit_semantics_changed",
  "classify_semantics_changed",
  "drift_semantics_changed",
  "license_semantics_changed",
  "deny_exit_code_25_changed",
  "deny_exit_code_25_redefined",
  "released_behavior_changed",
  "released_behavior_claim",
  "commercial_surface_changed",
  "commercial_launch",
  "marketplace_launch",
  "github_action_implementation",
  "cli_behavior_changed",
  "entitlement_claim"
]);

function expectFileExists(filePath, label) {
  expect(fs.existsSync(filePath), `${label} must exist at ${path.relative(repoRoot, filePath)}`);
}

function validateSchema(schema) {
  expect(schema.type === "object", "schema top-level type mismatch");
  expect(schema.additionalProperties === false, "schema must disallow top-level additionalProperties");
  expect(schema.properties.object_type.const === "single_agent_governance_report_preview", "object_type const mismatch");
  expect(schema.properties.object_version.const === "v1", "object_version const mismatch");
  expect(schema.properties.report_mode.const === "preview", "report_mode const mismatch");
  expectObject(schema.$defs.nonEnforcementBoundary, "schema.$defs.nonEnforcementBoundary");
  expectExactKeys(
    schema.$defs.nonEnforcementBoundary.properties,
    [
      "recommendation_only",
      "non_executing",
      "approval_granted",
      "execution_permission_granted",
      "blocking_effect",
      "deployment_authority",
      "merge_authority",
      "enforcement_action",
      "legal_compliance_claim",
      "message"
    ],
    "schema non_enforcement_boundary.properties"
  );
  expect(
    JSON.stringify([...schema.required].sort()) === JSON.stringify([...expectedTopLevelKeys].sort()),
    "schema required top-level fields mismatch"
  );
  expectObject(schema.$defs.preV614CapabilityFoundation, "schema.$defs.preV614CapabilityFoundation");
  expectExactKeys(
    schema.$defs.preV614CapabilityFoundation.properties,
    expectedFoundationKeys,
    "schema pre_v6_14_capability_foundation.properties"
  );
  expectEnumList(
    schema.properties.review_posture.enum,
    allowedReviewPostures,
    "schema review_posture enum"
  );
  for (const forbiddenField of forbiddenTopLevelFields) {
    expect(!(forbiddenField in schema.properties), `schema must not define forbidden top-level field ${forbiddenField}`);
  }
}

function expectEnumList(actual, expected, label) {
  expect(
    JSON.stringify([...actual].sort()) === JSON.stringify([...expected].sort()),
    `${label} mismatch: expected ${JSON.stringify(expected)} got ${JSON.stringify(actual)}`
  );
}

function validateFixtureBundle(fileName, fixture) {
  const label = `fixture ${fileName}`;
  expectExactKeys(fixture, expectedTopLevelKeys, label);
  expect(fixture.object_type === "single_agent_governance_report_preview", `${label}.object_type mismatch`);
  expect(fixture.object_version === "v1", `${label}.object_version mismatch`);
  expect(fixture.report_mode === "preview", `${label}.report_mode mismatch`);
  expectString(fixture.generated_at, `${label}.generated_at`);
  for (const forbiddenField of forbiddenTopLevelFields) {
    expect(!(forbiddenField in fixture), `${label} must not contain ${forbiddenField}`);
  }
  validateAgentIdentity(fixture.agent_identity, `${label}.agent_identity`);
  validateCapabilityBoundary(fixture.capability_boundary, `${label}.capability_boundary`);
  validateAuthorityEnvelope(fixture.authority_envelope, `${label}.authority_envelope`);
  validateExecutionPathSnapshot(fixture.execution_path_snapshot, `${label}.execution_path_snapshot`);
  validateProposedAction(fixture.proposed_action, `${label}.proposed_action`);
  validatePolicyEvaluationPreview(fixture.policy_evaluation_preview, `${label}.policy_evaluation_preview`);
  validateFindings(fixture.findings, `${label}.findings`);
  validateReviewEvidence(fixture.review_evidence, `${label}.review_evidence`);
  validateArtifactProvenance(fixture.artifact_provenance, `${label}.artifact_provenance`);
  validatePreV614CapabilityFoundation(
    fixture.pre_v6_14_capability_foundation,
    `${label}.pre_v6_14_capability_foundation`
  );
  for (const key of [
    "action_summary",
    "intent_summary",
    "authority_summary",
    "evidence_summary",
    "admissibility_summary",
    "risk_summary",
    "drift_summary",
    "guardrail_mapping_summary",
    "transition_summary",
    "procedural_receipt_summary",
    "lineage_summary"
  ]) {
    expectString(fixture[key], `${label}.${key}`);
  }
  expectEnum(fixture.review_posture, allowedReviewPostures, `${label}.review_posture`);
  expectArray(fixture.receipt_refs, `${label}.receipt_refs`);
  expect(fixture.receipt_refs.length >= 1, `${label}.receipt_refs must be non-empty`);
  fixture.receipt_refs.forEach((entry, index) => expectString(entry, `${label}.receipt_refs[${index}]`));
  expectString(fixture.deterministic_hash, `${label}.deterministic_hash`);
  expect(
    /^sha256:[a-f0-9]{64}$/.test(fixture.deterministic_hash),
    `${label}.deterministic_hash must match sha256:<64 hex>`
  );
  validateNonEnforcementBoundary(fixture.non_enforcement_boundary, `${label}.non_enforcement_boundary`);
  expectNoForbiddenClaims(fixture, label);
}

function validateFoundationEntry(value, label, refKey, extraKeys = []) {
  const expectedKeys = ["present", "contributes_to", refKey, "contract_preserved"];
  expectedKeys.push(...extraKeys);
  if ("not_applicable_reason" in value) expectedKeys.push("not_applicable_reason");
  expectExactKeys(value, expectedKeys, label);
  expect(typeof value.present === "boolean", `${label}.present must be boolean`);
  expectArray(value.contributes_to, `${label}.contributes_to`);
  expect(value.contributes_to.length >= 1, `${label}.contributes_to must be non-empty`);
  value.contributes_to.forEach((entry, index) =>
    expectString(entry, `${label}.contributes_to[${index}]`)
  );
  expectArray(value[refKey], `${label}.${refKey}`);
  expect(value[refKey].length >= 1, `${label}.${refKey} must be non-empty`);
  value[refKey].forEach((entry, index) => expectString(entry, `${label}.${refKey}[${index}]`));
  expectBoolean(value.contract_preserved, true, `${label}.contract_preserved`);
  if ("not_applicable_reason" in value) {
    expect(
      value.not_applicable_reason === null ||
        (typeof value.not_applicable_reason === "string" && value.not_applicable_reason.length >= 1),
      `${label}.not_applicable_reason must be null or a non-empty string`
    );
  }
}

function validatePreV614CapabilityFoundation(value, label) {
  expectExactKeys(value, expectedFoundationKeys, label);
  validateFoundationEntry(value.status_validate_policy, `${label}.status_validate_policy`, "artifact_refs");
  validateFoundationEntry(value.audit, `${label}.audit`, "evidence_refs");
  validateFoundationEntry(value.snapshot, `${label}.snapshot`, "snapshot_refs");
  validateFoundationEntry(value.action_classify, `${label}.action_classify`, "artifact_refs");
  validateFoundationEntry(value.drift, `${label}.drift`, "drift_refs");
  validateFoundationEntry(value.assoc_correlate, `${label}.assoc_correlate`, "correlation_refs");
  validateFoundationEntry(value.risk, `${label}.risk`, "risk_refs");
  validateFoundationEntry(
    value.license_edition_gate,
    `${label}.license_edition_gate`,
    "artifact_refs",
    ["entitlement_changed"]
  );
  validateFoundationEntry(value.verification_chain, `${label}.verification_chain`, "verifier_refs");
  expectBoolean(
    value.license_edition_gate.entitlement_changed,
    false,
    `${label}.license_edition_gate.entitlement_changed`
  );
}

function validateAgentIdentity(value, label) {
  expectExactKeys(value, ["agent_id", "agent_kind", "agent_label", "source_kind", "single_agent"], label);
  expectString(value.agent_id, `${label}.agent_id`);
  expect(value.agent_kind === "single_agent", `${label}.agent_kind mismatch`);
  expectString(value.agent_label, `${label}.agent_label`);
  expectEnum(value.source_kind, ["fixture", "preview_input"], `${label}.source_kind`);
  expectBoolean(value.single_agent, true, `${label}.single_agent`);
}

function validateCapabilityBoundary(value, label) {
  expectExactKeys(
    value,
    [
      "boundary_scope",
      "absorbed_evidence_structure",
      "single_agent_only",
      "multi_agent_in_scope",
      "github_action_implementation_in_scope",
      "cli_behavior_change_in_scope",
      "separate_product_claim"
    ],
    label
  );
  expectString(value.boundary_scope, `${label}.boundary_scope`);
  expectArray(value.absorbed_evidence_structure, `${label}.absorbed_evidence_structure`);
  expect(value.absorbed_evidence_structure.length === 9, `${label}.absorbed_evidence_structure length mismatch`);
  expectBoolean(value.single_agent_only, true, `${label}.single_agent_only`);
  expectBoolean(value.multi_agent_in_scope, false, `${label}.multi_agent_in_scope`);
  expectBoolean(
    value.github_action_implementation_in_scope,
    false,
    `${label}.github_action_implementation_in_scope`
  );
  expectBoolean(value.cli_behavior_change_in_scope, false, `${label}.cli_behavior_change_in_scope`);
  expectBoolean(value.separate_product_claim, false, `${label}.separate_product_claim`);
}

function validateAuthorityEnvelope(value, label) {
  expectExactKeys(
    value,
    [
      "authority_scope",
      "recommendation_only",
      "approval_granted",
      "execution_permission_granted",
      "merge_authority",
      "deployment_authority",
      "blocking_effect"
    ],
    label
  );
  expect(value.authority_scope === "human_review_only", `${label}.authority_scope mismatch`);
  expectBoolean(value.recommendation_only, true, `${label}.recommendation_only`);
  expectBoolean(value.approval_granted, false, `${label}.approval_granted`);
  expectBoolean(value.execution_permission_granted, false, `${label}.execution_permission_granted`);
  expectBoolean(value.merge_authority, false, `${label}.merge_authority`);
  expectBoolean(value.deployment_authority, false, `${label}.deployment_authority`);
  expectBoolean(value.blocking_effect, false, `${label}.blocking_effect`);
}

function validateExecutionPathSnapshot(value, label) {
  expectExactKeys(
    value,
    [
      "input_origin",
      "execution_surface",
      "runtime_execution_performed",
      "workflow_execution_performed",
      "github_action_wrapper_used",
      "repo_ref",
      "path_summary"
    ],
    label
  );
  expectString(value.input_origin, `${label}.input_origin`);
  expectString(value.execution_surface, `${label}.execution_surface`);
  expectBoolean(value.runtime_execution_performed, false, `${label}.runtime_execution_performed`);
  expectBoolean(value.workflow_execution_performed, false, `${label}.workflow_execution_performed`);
  expectBoolean(value.github_action_wrapper_used, false, `${label}.github_action_wrapper_used`);
  expectString(value.repo_ref, `${label}.repo_ref`);
  expectString(value.path_summary, `${label}.path_summary`);
}

function validateProposedAction(value, label) {
  expectExactKeys(value, ["action_kind", "change_scope", "in_scope", "summary"], label);
  expectString(value.action_kind, `${label}.action_kind`);
  expectString(value.change_scope, `${label}.change_scope`);
  expect(typeof value.in_scope === "boolean", `${label}.in_scope must be boolean`);
  expectString(value.summary, `${label}.summary`);
}

function validatePolicyEvaluationPreview(value, label) {
  expectExactKeys(
    value,
    ["evaluation_mode", "severity_model", "probability_scoring", "legal_compliance_scoring", "checks"],
    label
  );
  expect(value.evaluation_mode === "deterministic_preview", `${label}.evaluation_mode mismatch`);
  expect(value.severity_model === "severity_only", `${label}.severity_model mismatch`);
  expectBoolean(value.probability_scoring, false, `${label}.probability_scoring`);
  expectBoolean(value.legal_compliance_scoring, false, `${label}.legal_compliance_scoring`);
  expectArray(value.checks, `${label}.checks`);
  expect(value.checks.length >= 1, `${label}.checks must be non-empty`);
  value.checks.forEach((entry, index) => {
    const checkLabel = `${label}.checks[${index}]`;
    expectExactKeys(entry, ["check_id", "check_name", "outcome", "severity", "summary"], checkLabel);
    expectString(entry.check_id, `${checkLabel}.check_id`);
    expectString(entry.check_name, `${checkLabel}.check_name`);
    expectEnum(
      entry.outcome,
      ["satisfied", "attention_required", "missing_evidence", "out_of_scope", "indeterminate"],
      `${checkLabel}.outcome`
    );
    expectEnum(entry.severity, ["none", "low", "medium", "high"], `${checkLabel}.severity`);
    expectString(entry.summary, `${checkLabel}.summary`);
  });
}

function validateFindings(value, label) {
  expectArray(value, label);
  expect(value.length >= 1, `${label} must be non-empty`);
  value.forEach((entry, index) => {
    const findingLabel = `${label}[${index}]`;
    expectExactKeys(entry, ["finding_id", "category", "severity", "summary", "related_ref"], findingLabel);
    expectString(entry.finding_id, `${findingLabel}.finding_id`);
    expectEnum(
      entry.category,
      [
        "readiness_note",
        "evidence_gap",
        "ambiguity",
        "drift_signal",
        "guardrail_alignment",
        "scope_boundary",
        "provenance_note"
      ],
      `${findingLabel}.category`
    );
    expectEnum(entry.severity, ["none", "low", "medium", "high"], `${findingLabel}.severity`);
    expectString(entry.summary, `${findingLabel}.summary`);
    expect(
      entry.related_ref === null || (typeof entry.related_ref === "string" && entry.related_ref.length >= 1),
      `${findingLabel}.related_ref must be null or a non-empty string`
    );
  });
}

function validateReviewEvidence(value, label) {
  expectExactKeys(value, ["review_required", "review_status", "review_owner", "open_issues"], label);
  expect(typeof value.review_required === "boolean", `${label}.review_required must be boolean`);
  expectEnum(
    value.review_status,
    ["reviewable", "human_review_required", "evidence_incomplete", "out_of_scope", "unknown"],
    `${label}.review_status`
  );
  expect(
    value.review_owner === null || (typeof value.review_owner === "string" && value.review_owner.length >= 1),
    `${label}.review_owner must be null or a non-empty string`
  );
  expectArray(value.open_issues, `${label}.open_issues`);
  value.open_issues.forEach((entry, index) => expectString(entry, `${label}.open_issues[${index}]`));
}

function validateArtifactProvenance(value, label) {
  expectExactKeys(
    value,
    [
      "source_refs",
      "generated_flags",
      "metadata_completeness",
      "watermark_enforcement",
      "content_labeling_enforcement",
      "legal_proof"
    ],
    label
  );
  expectArray(value.source_refs, `${label}.source_refs`);
  expect(value.source_refs.length >= 1, `${label}.source_refs must be non-empty`);
  value.source_refs.forEach((entry, index) => expectString(entry, `${label}.source_refs[${index}]`));
  expectExactKeys(
    value.generated_flags,
    ["ai_assisted", "fixture_backed", "human_review_required"],
    `${label}.generated_flags`
  );
  expect(typeof value.generated_flags.ai_assisted === "boolean", `${label}.generated_flags.ai_assisted must be boolean`);
  expect(typeof value.generated_flags.fixture_backed === "boolean", `${label}.generated_flags.fixture_backed must be boolean`);
  expect(
    typeof value.generated_flags.human_review_required === "boolean",
    `${label}.generated_flags.human_review_required must be boolean`
  );
  expectEnum(value.metadata_completeness, ["complete", "partial", "minimal"], `${label}.metadata_completeness`);
  expectBoolean(value.watermark_enforcement, false, `${label}.watermark_enforcement`);
  expectBoolean(value.content_labeling_enforcement, false, `${label}.content_labeling_enforcement`);
  expectBoolean(value.legal_proof, false, `${label}.legal_proof`);
}

function validateNonEnforcementBoundary(value, label) {
  expectExactKeys(
    value,
    [
      "recommendation_only",
      "non_executing",
      "approval_granted",
      "execution_permission_granted",
      "blocking_effect",
      "deployment_authority",
      "merge_authority",
      "enforcement_action",
      "legal_compliance_claim",
      "message"
    ],
    label
  );
  expectBoolean(value.recommendation_only, true, `${label}.recommendation_only`);
  expectBoolean(value.non_executing, true, `${label}.non_executing`);
  expectBoolean(value.approval_granted, false, `${label}.approval_granted`);
  expectBoolean(value.execution_permission_granted, false, `${label}.execution_permission_granted`);
  expectBoolean(value.blocking_effect, false, `${label}.blocking_effect`);
  expectBoolean(value.deployment_authority, false, `${label}.deployment_authority`);
  expectBoolean(value.merge_authority, false, `${label}.merge_authority`);
  expect(value.enforcement_action === "none", `${label}.enforcement_action must be none`);
  expectBoolean(value.legal_compliance_claim, false, `${label}.legal_compliance_claim`);
  expect(value.message === expectedMessage, `${label}.message mismatch`);
}

function walk(value, visit, currentPath = "") {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => walk(entry, visit, `${currentPath}[${index}]`));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      const nextPath = currentPath ? `${currentPath}.${key}` : key;
      visit(key, entry, nextPath);
      walk(entry, visit, nextPath);
    }
  }
}

function expectNoForbiddenClaims(value, label) {
  walk(value, (key, entry, entryPath) => {
    expect(!forbiddenClaimKeys.has(key), `${label} contains forbidden claim key ${entryPath}`);
    if (key === "entitlement_changed") {
      expect(
        entryPath.endsWith("pre_v6_14_capability_foundation.license_edition_gate.entitlement_changed"),
        `${label} contains unexpected entitlement_changed field at ${entryPath}`
      );
      expect(entry === false, `${label} must keep ${entryPath} false`);
    }
    if (typeof entry === "string") {
      expect(!/deny exit code 25/i.test(entry), `${label} must not redefine deny exit code 25 in ${entryPath}`);
      expect(!/commercial launch/i.test(entry), `${label} must not claim commercial launch in ${entryPath}`);
      expect(!/marketplace launch/i.test(entry), `${label} must not claim Marketplace launch in ${entryPath}`);
      expect(!/changed semantics/i.test(entry), `${label} must not claim changed semantics in ${entryPath}`);
    }
  });
}

function main() {
  expectFileExists(schemaPath, "schema");
  const schema = readJson(schemaPath, "schema");
  validateSchema(schema);

  for (const fileName of fixtureFiles) {
    const fixturePath = path.join(fixtureDir, fileName);
    expectFileExists(fixturePath, `fixture ${fileName}`);
    const fixture = readJson(fixturePath, `fixture ${fileName}`);
    validateFixtureBundle(fileName, fixture);
  }

  console.log("PASS: v7.0 single_agent_governance_report_preview schema and fixtures validated.");
}

main();
