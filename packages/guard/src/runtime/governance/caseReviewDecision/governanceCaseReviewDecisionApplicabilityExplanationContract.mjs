import {
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_VERSION,
  assertValidGovernanceCaseReviewDecisionApplicabilityExplanationProfile,
} from "./governanceCaseReviewDecisionApplicabilityExplanationProfile.mjs";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_CONTRACT_KIND =
  "governance_case_review_decision_applicability_explanation_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_CONTRACT_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_CONTRACT_BOUNDARY =
  "bounded_governance_case_review_decision_applicability_explanation_contract";

export function buildGovernanceCaseReviewDecisionApplicabilityExplanationContract({
  governanceCaseReviewDecisionApplicabilityExplanationProfile,
}) {
  const profile =
    assertValidGovernanceCaseReviewDecisionApplicabilityExplanationProfile(
      governanceCaseReviewDecisionApplicabilityExplanationProfile
    );
  const payload =
    profile.governance_case_review_decision_applicability_explanation;
  const explanationRef = payload.applicability_explanation_ref;
  const explanationContext = payload.explanation_context;

  return {
    kind:
      GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_CONTRACT_KIND,
    version:
      GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_CONTRACT_VERSION,
    boundary:
      GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_CONTRACT_BOUNDARY,
    applicability_explanation_profile_ref: {
      kind:
        GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_KIND,
      version:
        GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_VERSION,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_BOUNDARY,
      case_id: explanationRef.case_id,
      current_review_decision_id: explanationRef.current_review_decision_id,
    },
    explanation_available: true,
    selected_current_review_decision_only: true,
    current_selection_final_acceptance_required: true,
    applicability_profile_required: true,
    selected_review_decision_profile_required: true,
    strict_case_id_alignment_required: true,
    strict_current_review_decision_id_alignment_required: true,
    strict_canonical_action_hash_alignment_required: true,
    non_superseded_review_decision_required: true,
    supporting_artifact_only: true,
    recommendation_only: true,
    additive_only: true,
    non_executing: true,
    default_off: true,
    applicability_scoring: false,
    applicability_ranking: false,
    reselection_enabled: false,
    judgment_source_enabled: false,
    authority_source_enabled: false,
    selection_feedback_enabled: false,
    main_path_takeover: false,
    authority_scope_expansion: false,
    new_governance_object: false,
    risk_source_enabled: false,
    explanation_status: explanationContext.explanation_status,
    applicability_status: explanationContext.applicability_status,
    current_review_decision_id: explanationRef.current_review_decision_id,
    canonical_action_hash: profile.canonical_action_hash,
  };
}

export function validateGovernanceCaseReviewDecisionApplicabilityExplanationContract(
  contract
) {
  const errors = [];
  if (!isPlainObject(contract)) {
    return {
      ok: false,
      errors: [
        "governance case review decision applicability explanation contract must be an object",
      ],
    };
  }
  if (
    contract.kind !==
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_CONTRACT_KIND
  ) {
    errors.push(
      "governance case review decision applicability explanation contract kind drifted"
    );
  }
  if (
    contract.version !==
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_CONTRACT_VERSION
  ) {
    errors.push(
      "governance case review decision applicability explanation contract version drifted"
    );
  }
  if (
    contract.boundary !==
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_CONTRACT_BOUNDARY
  ) {
    errors.push(
      "governance case review decision applicability explanation contract boundary drifted"
    );
  }
  if (!isPlainObject(contract.applicability_explanation_profile_ref)) {
    errors.push(
      "governance case review decision applicability explanation profile ref missing"
    );
  }
  for (const field of [
    "explanation_available",
    "selected_current_review_decision_only",
    "current_selection_final_acceptance_required",
    "applicability_profile_required",
    "selected_review_decision_profile_required",
    "strict_case_id_alignment_required",
    "strict_current_review_decision_id_alignment_required",
    "strict_canonical_action_hash_alignment_required",
    "non_superseded_review_decision_required",
    "supporting_artifact_only",
    "recommendation_only",
    "additive_only",
    "non_executing",
    "default_off",
  ]) {
    if (contract[field] !== true) {
      errors.push(
        `governance case review decision applicability explanation contract field drifted: ${field}`
      );
    }
  }
  for (const field of [
    "applicability_scoring",
    "applicability_ranking",
    "reselection_enabled",
    "judgment_source_enabled",
    "authority_source_enabled",
    "selection_feedback_enabled",
    "main_path_takeover",
    "authority_scope_expansion",
    "new_governance_object",
    "risk_source_enabled",
  ]) {
    if (contract[field] !== false) {
      errors.push(
        `governance case review decision applicability explanation contract field drifted: ${field}`
      );
    }
  }
  if (contract.explanation_status !== "available") {
    errors.push(
      "governance case review decision applicability explanation status drifted"
    );
  }
  if (contract.applicability_status !== "applicable") {
    errors.push(
      "governance case review decision applicability explanation applicability_status drifted"
    );
  }
  if (
    typeof contract.current_review_decision_id !== "string" ||
    contract.current_review_decision_id.length === 0
  ) {
    errors.push(
      "governance case review decision applicability explanation current_review_decision_id is required"
    );
  }
  if (
    typeof contract.canonical_action_hash !== "string" ||
    contract.canonical_action_hash.length === 0
  ) {
    errors.push(
      "governance case review decision applicability explanation canonical_action_hash is required"
    );
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionApplicabilityExplanationContract(
  contract
) {
  const validation =
    validateGovernanceCaseReviewDecisionApplicabilityExplanationContract(
      contract
    );
  if (validation.ok) return contract;

  const err = new Error(
    `governance case review decision applicability explanation contract invalid: ${validation.errors.join(
      "; "
    )}`
  );
  err.validation = validation;
  throw err;
}
