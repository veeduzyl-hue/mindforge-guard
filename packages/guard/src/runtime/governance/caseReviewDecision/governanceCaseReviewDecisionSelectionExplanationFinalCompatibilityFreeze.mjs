import {
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_VERSION,
  assertValidGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary,
} from "./governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_COMPATIBILITY_FREEZE_KIND =
  "governance_case_review_decision_selection_explanation_final_compatibility_freeze";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_COMPATIBILITY_FREEZE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_COMPATIBILITY_FREEZE_BOUNDARY =
  "governance_case_review_decision_selection_explanation_final_compatibility_freeze_boundary";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_COMPATIBILITY_FREEZE_STABLE_EXPORT_SET =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_COMPATIBILITY_FREEZE_KIND",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_COMPATIBILITY_FREEZE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_COMPATIBILITY_FREEZE_BOUNDARY",
    "buildGovernanceCaseReviewDecisionSelectionExplanationFinalCompatibilityFreeze",
    "validateGovernanceCaseReviewDecisionSelectionExplanationFinalCompatibilityFreeze",
    "assertValidGovernanceCaseReviewDecisionSelectionExplanationFinalCompatibilityFreeze",
  ]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceCaseReviewDecisionSelectionExplanationFinalCompatibilityFreeze(
  { governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary }
) {
  const boundary =
    assertValidGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary(
      governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary
    );
  const acceptance =
    boundary.governance_case_review_decision_selection_explanation_final_acceptance;
  const scope = acceptance.acceptance_scope;

  return {
    kind:
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_COMPATIBILITY_FREEZE_KIND,
    version:
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_COMPATIBILITY_FREEZE_VERSION,
    boundary:
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_COMPATIBILITY_FREEZE_BOUNDARY,
    final_acceptance_ref: {
      kind:
        GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_KIND,
      version:
        GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_VERSION,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_BOUNDARY,
    },
    release_target: "v5.8.0",
    selected_only_preserved: true,
    eligibility_rejection_hardening_preserved: true,
    bounded_reason_codes_preserved: true,
    explanation_supporting_artifact_preserved: true,
    one_way_selection_dependency_preserved: true,
    recommendation_only: true,
    additive_only: true,
    non_executing: true,
    default_off: true,
    judgment_source_enabled: false,
    authority_source_enabled: false,
    selection_feedback_enabled: false,
    execution_takeover: false,
    automatic_routing: false,
    automatic_case_finalization: false,
    workflow_transition_engine: false,
    authority_scope_expansion: false,
    audit_output_preserved: true,
    audit_verdict_preserved: true,
    actual_exit_code_preserved: true,
    denied_exit_code_preserved: 25,
    permit_gate_semantics_preserved: true,
    enforcement_pilot_semantics_preserved: true,
    limited_enforcement_authority_semantics_preserved: true,
    classify_semantics_preserved: true,
    main_path_takeover: false,
    case_id: scope.case_id,
    selection_status: scope.selection_status,
    current_review_decision_id: scope.current_review_decision_id,
    canonical_action_hash: boundary.canonical_action_hash,
  };
}

export function validateGovernanceCaseReviewDecisionSelectionExplanationFinalCompatibilityFreeze(
  freeze
) {
  const errors = [];
  if (!isPlainObject(freeze)) {
    return {
      ok: false,
      errors: [
        "governance case review decision selection explanation final compatibility freeze must be an object",
      ],
    };
  }
  if (
    freeze.kind !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_COMPATIBILITY_FREEZE_KIND
  ) {
    errors.push(
      "governance case review decision selection explanation final compatibility freeze kind drifted"
    );
  }
  if (
    freeze.version !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_COMPATIBILITY_FREEZE_VERSION
  ) {
    errors.push(
      "governance case review decision selection explanation final compatibility freeze version drifted"
    );
  }
  if (
    freeze.boundary !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_COMPATIBILITY_FREEZE_BOUNDARY
  ) {
    errors.push(
      "governance case review decision selection explanation final compatibility freeze boundary drifted"
    );
  }
  if (!isPlainObject(freeze.final_acceptance_ref)) {
    errors.push(
      "governance case review decision selection explanation final compatibility freeze ref missing"
    );
  }
  if (freeze.release_target !== "v5.8.0") {
    errors.push(
      "governance case review decision selection explanation final compatibility freeze release target drifted"
    );
  }
  for (const field of [
    "selected_only_preserved",
    "eligibility_rejection_hardening_preserved",
    "bounded_reason_codes_preserved",
    "explanation_supporting_artifact_preserved",
    "one_way_selection_dependency_preserved",
    "recommendation_only",
    "additive_only",
    "non_executing",
    "default_off",
    "audit_output_preserved",
    "audit_verdict_preserved",
    "actual_exit_code_preserved",
    "permit_gate_semantics_preserved",
    "enforcement_pilot_semantics_preserved",
    "limited_enforcement_authority_semantics_preserved",
    "classify_semantics_preserved",
  ]) {
    if (freeze[field] !== true) {
      errors.push(
        `governance case review decision selection explanation final compatibility freeze field drifted: ${field}`
      );
    }
  }
  for (const field of [
    "judgment_source_enabled",
    "authority_source_enabled",
    "selection_feedback_enabled",
    "execution_takeover",
    "automatic_routing",
    "automatic_case_finalization",
    "workflow_transition_engine",
    "authority_scope_expansion",
    "main_path_takeover",
  ]) {
    if (freeze[field] !== false) {
      errors.push(
        `governance case review decision selection explanation final compatibility freeze field drifted: ${field}`
      );
    }
  }
  if (freeze.denied_exit_code_preserved !== 25) {
    errors.push(
      "governance case review decision selection explanation final compatibility freeze denied exit drifted"
    );
  }
  if (freeze.selection_status !== "selected") {
    errors.push(
      "governance case review decision selection explanation final compatibility freeze selection status drifted"
    );
  }
  for (const field of ["case_id", "current_review_decision_id", "canonical_action_hash"]) {
    if (typeof freeze[field] !== "string" || freeze[field].length === 0) {
      errors.push(
        `governance case review decision selection explanation final compatibility freeze ${field} is required`
      );
    }
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionSelectionExplanationFinalCompatibilityFreeze(
  freeze
) {
  const validation =
    validateGovernanceCaseReviewDecisionSelectionExplanationFinalCompatibilityFreeze(
      freeze
    );
  if (validation.ok) return freeze;

  const err = new Error(
    `governance case review decision selection explanation final compatibility freeze invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
