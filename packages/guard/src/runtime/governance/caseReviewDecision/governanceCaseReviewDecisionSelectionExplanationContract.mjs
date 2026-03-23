import {
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_VERSION,
  assertValidGovernanceCaseReviewDecisionSelectionExplanationProfile,
} from "./governanceCaseReviewDecisionSelectionExplanationProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONTRACT_KIND =
  "governance_case_review_decision_selection_explanation_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONTRACT_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONTRACT_BOUNDARY =
  "bounded_governance_case_review_decision_selection_explanation_contract";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceCaseReviewDecisionSelectionExplanationContract({
  governanceCaseReviewDecisionSelectionExplanationProfile,
}) {
  const profile =
    assertValidGovernanceCaseReviewDecisionSelectionExplanationProfile(
      governanceCaseReviewDecisionSelectionExplanationProfile
    );
  const selectionRef =
    profile.governance_case_review_decision_selection_explanation.selection_ref;
  const explanationContext =
    profile.governance_case_review_decision_selection_explanation
      .explanation_context;

  return {
    kind: GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONTRACT_KIND,
    version:
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONTRACT_VERSION,
    boundary:
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONTRACT_BOUNDARY,
    selection_explanation_profile_ref: {
      kind: GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_KIND,
      version:
        GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_VERSION,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_PROFILE_BOUNDARY,
      case_id: selectionRef.case_id,
      current_review_decision_id: selectionRef.current_review_decision_id,
    },
    explanation_available: true,
    current_selection_required: true,
    supporting_artifact_only: true,
    recommendation_only: true,
    additive_only: true,
    non_executing: true,
    default_off: true,
    eligible_selected_current_selection_only: true,
    conflict_ineligible: true,
    ambiguity_ineligible: true,
    insufficient_support_ineligible: true,
    bounded_reason_codes_only: true,
    allowlisted_reason_codes:
      profile.governance_case_review_decision_selection_explanation
        .explanation_context.reason_codes,
    implicit_reason_semantics: false,
    freeform_explanation: false,
    ranking_scoring_engine: false,
    selection_feedback_enabled: false,
    judgment_source_enabled: false,
    main_path_takeover: false,
    authority_scope_expansion: false,
    new_governance_object: false,
    explanation_status: explanationContext.explanation_status,
    reason_codes: explanationContext.reason_codes,
    current_review_decision_id: selectionRef.current_review_decision_id,
    canonical_action_hash: profile.canonical_action_hash,
  };
}

export function validateGovernanceCaseReviewDecisionSelectionExplanationContract(
  contract
) {
  const errors = [];
  if (!isPlainObject(contract)) {
    return {
      ok: false,
      errors: [
        "governance case review decision selection explanation contract must be an object",
      ],
    };
  }
  if (
    contract.kind !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONTRACT_KIND
  ) {
    errors.push(
      "governance case review decision selection explanation contract kind drifted"
    );
  }
  if (
    contract.version !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONTRACT_VERSION
  ) {
    errors.push(
      "governance case review decision selection explanation contract version drifted"
    );
  }
  if (
    contract.boundary !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_CONTRACT_BOUNDARY
  ) {
    errors.push(
      "governance case review decision selection explanation contract boundary drifted"
    );
  }
  if (!isPlainObject(contract.selection_explanation_profile_ref)) {
    errors.push(
      "governance case review decision selection explanation profile ref missing"
    );
  }
  if (contract.explanation_available !== true) {
    errors.push(
      "governance case review decision selection explanation availability drifted"
    );
  }
  if (contract.current_selection_required !== true) {
    errors.push(
      "governance case review decision selection explanation current selection requirement drifted"
    );
  }
  if (contract.supporting_artifact_only !== true) {
    errors.push(
      "governance case review decision selection explanation supporting-artifact boundary drifted"
    );
  }
  if (contract.recommendation_only !== true) {
    errors.push(
      "governance case review decision selection explanation recommendation boundary drifted"
    );
  }
  if (contract.additive_only !== true) {
    errors.push(
      "governance case review decision selection explanation additive boundary drifted"
    );
  }
  if (contract.non_executing !== true) {
    errors.push(
      "governance case review decision selection explanation non-executing boundary drifted"
    );
  }
  if (contract.default_off !== true) {
    errors.push(
      "governance case review decision selection explanation default-off boundary drifted"
    );
  }
  if (contract.eligible_selected_current_selection_only !== true) {
    errors.push(
      "governance case review decision selection explanation eligibility boundary drifted"
    );
  }
  if (contract.conflict_ineligible !== true) {
    errors.push(
      "governance case review decision selection explanation conflict rejection drifted"
    );
  }
  if (contract.ambiguity_ineligible !== true) {
    errors.push(
      "governance case review decision selection explanation ambiguity rejection drifted"
    );
  }
  if (contract.insufficient_support_ineligible !== true) {
    errors.push(
      "governance case review decision selection explanation insufficient support rejection drifted"
    );
  }
  if (contract.bounded_reason_codes_only !== true) {
    errors.push(
      "governance case review decision selection explanation bounded reason codes boundary drifted"
    );
  }
  if (contract.freeform_explanation !== false) {
    errors.push(
      "governance case review decision selection explanation freeform boundary drifted"
    );
  }
  if (contract.ranking_scoring_engine !== false) {
    errors.push(
      "governance case review decision selection explanation ranking boundary drifted"
    );
  }
  if (contract.implicit_reason_semantics !== false) {
    errors.push(
      "governance case review decision selection explanation implicit reason semantics drifted"
    );
  }
  if (contract.selection_feedback_enabled !== false) {
    errors.push(
      "governance case review decision selection explanation selection feedback drifted"
    );
  }
  if (contract.judgment_source_enabled !== false) {
    errors.push(
      "governance case review decision selection explanation judgment source drifted"
    );
  }
  if (contract.main_path_takeover !== false) {
    errors.push(
      "governance case review decision selection explanation main path takeover drifted"
    );
  }
  if (contract.authority_scope_expansion !== false) {
    errors.push(
      "governance case review decision selection explanation authority expansion drifted"
    );
  }
  if (contract.new_governance_object !== false) {
    errors.push(
      "governance case review decision selection explanation governance object boundary drifted"
    );
  }
  if (contract.explanation_status !== "available") {
    errors.push(
      "governance case review decision selection explanation status drifted"
    );
  }
  if (
    !Array.isArray(contract.reason_codes) ||
    contract.reason_codes.length === 0
  ) {
    errors.push(
      "governance case review decision selection explanation reason codes are required"
    );
  }
  if (
    !Array.isArray(contract.allowlisted_reason_codes) ||
    JSON.stringify(contract.allowlisted_reason_codes) !==
      JSON.stringify(contract.reason_codes)
  ) {
    errors.push(
      "governance case review decision selection explanation allowlisted reason codes drifted"
    );
  }
  if (
    typeof contract.current_review_decision_id !== "string" ||
    contract.current_review_decision_id.length === 0
  ) {
    errors.push(
      "governance case review decision selection explanation current_review_decision_id is required"
    );
  }
  if (
    typeof contract.canonical_action_hash !== "string" ||
    contract.canonical_action_hash.length === 0
  ) {
    errors.push(
      "governance case review decision selection explanation canonical_action_hash is required"
    );
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionSelectionExplanationContract(
  contract
) {
  const validation =
    validateGovernanceCaseReviewDecisionSelectionExplanationContract(contract);
  if (validation.ok) return contract;

  const err = new Error(
    `governance case review decision selection explanation contract invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
