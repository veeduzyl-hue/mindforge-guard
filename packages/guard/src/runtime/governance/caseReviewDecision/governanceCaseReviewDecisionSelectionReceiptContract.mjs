import {
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_VERSION,
  assertValidGovernanceCaseReviewDecisionSelectionReceiptProfile,
} from "./governanceCaseReviewDecisionSelectionReceiptProfile.mjs";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONTRACT_KIND =
  "governance_case_review_decision_selection_receipt_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONTRACT_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONTRACT_BOUNDARY =
  "bounded_governance_case_review_decision_selection_receipt_contract";

export function buildGovernanceCaseReviewDecisionSelectionReceiptContract({
  governanceCaseReviewDecisionSelectionReceiptProfile,
}) {
  const profile = assertValidGovernanceCaseReviewDecisionSelectionReceiptProfile(
    governanceCaseReviewDecisionSelectionReceiptProfile
  );
  const selectionRef =
    profile.governance_case_review_decision_selection_receipt.selection_receipt_ref;
  const context =
    profile.governance_case_review_decision_selection_receipt.receipt_context;

  return {
    kind: GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONTRACT_KIND,
    version: GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONTRACT_VERSION,
    boundary:
      GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONTRACT_BOUNDARY,
    selection_receipt_profile_ref: {
      kind: GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_KIND,
      version: GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_VERSION,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_PROFILE_BOUNDARY,
      case_id: selectionRef.case_id,
      current_review_decision_id: selectionRef.current_review_decision_id,
    },
    receipt_available: true,
    current_selection_final_acceptance_required: true,
    selection_explanation_required: true,
    selection_explanation_final_acceptance_required: true,
    eligible_selected_current_selection_only: true,
    missing_support_ineligible: true,
    unsupported_state_ineligible: true,
    ambiguity_ineligible: true,
    identity_alignment_required: true,
    strict_case_id_alignment_required: true,
    strict_current_review_decision_id_alignment_required: true,
    strict_canonical_action_hash_alignment_required: true,
    implicit_alignment_fill_disabled: true,
    supporting_artifact_only: true,
    recommendation_only: true,
    additive_only: true,
    non_executing: true,
    default_off: true,
    structured_receipt_only: true,
    freeform_narrative_receipt: false,
    ranking_scoring_engine: false,
    judgment_source_enabled: false,
    authority_source_enabled: false,
    selection_feedback_enabled: false,
    risk_source_enabled: false,
    main_path_takeover: false,
    authority_scope_expansion: false,
    new_governance_object: false,
    receipt_status: context.receipt_status,
    reason_codes: context.reason_codes,
    current_review_decision_id: selectionRef.current_review_decision_id,
    canonical_action_hash: profile.canonical_action_hash,
  };
}

export function validateGovernanceCaseReviewDecisionSelectionReceiptContract(
  contract
) {
  const errors = [];
  if (!isPlainObject(contract)) {
    return {
      ok: false,
      errors: [
        "governance case review decision selection receipt contract must be an object",
      ],
    };
  }
  if (contract.kind !== GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONTRACT_KIND) {
    errors.push("governance case review decision selection receipt contract kind drifted");
  }
  if (contract.version !== GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONTRACT_VERSION) {
    errors.push(
      "governance case review decision selection receipt contract version drifted"
    );
  }
  if (contract.boundary !== GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_CONTRACT_BOUNDARY) {
    errors.push(
      "governance case review decision selection receipt contract boundary drifted"
    );
  }
  if (!isPlainObject(contract.selection_receipt_profile_ref)) {
    errors.push(
      "governance case review decision selection receipt profile ref missing"
    );
  }
  for (const field of [
    "receipt_available",
    "current_selection_final_acceptance_required",
    "selection_explanation_required",
    "selection_explanation_final_acceptance_required",
    "eligible_selected_current_selection_only",
    "missing_support_ineligible",
    "unsupported_state_ineligible",
    "ambiguity_ineligible",
    "identity_alignment_required",
    "strict_case_id_alignment_required",
    "strict_current_review_decision_id_alignment_required",
    "strict_canonical_action_hash_alignment_required",
    "implicit_alignment_fill_disabled",
    "supporting_artifact_only",
    "recommendation_only",
    "additive_only",
    "non_executing",
    "default_off",
    "structured_receipt_only",
  ]) {
    if (contract[field] !== true) {
      errors.push(
        `governance case review decision selection receipt contract field drifted: ${field}`
      );
    }
  }
  for (const field of [
    "freeform_narrative_receipt",
    "ranking_scoring_engine",
    "judgment_source_enabled",
    "authority_source_enabled",
    "selection_feedback_enabled",
    "risk_source_enabled",
    "main_path_takeover",
    "authority_scope_expansion",
    "new_governance_object",
  ]) {
    if (contract[field] !== false) {
      errors.push(
        `governance case review decision selection receipt contract field drifted: ${field}`
      );
    }
  }
  if (contract.receipt_status !== "recorded") {
    errors.push(
      "governance case review decision selection receipt contract receipt_status drifted"
    );
  }
  if (!Array.isArray(contract.reason_codes) || contract.reason_codes.length === 0) {
    errors.push(
      "governance case review decision selection receipt contract reason_codes are required"
    );
  }
  if (
    typeof contract.current_review_decision_id !== "string" ||
    contract.current_review_decision_id.length === 0
  ) {
    errors.push(
      "governance case review decision selection receipt contract current_review_decision_id is required"
    );
  }
  if (
    typeof contract.canonical_action_hash !== "string" ||
    contract.canonical_action_hash.length === 0
  ) {
    errors.push(
      "governance case review decision selection receipt contract canonical_action_hash is required"
    );
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionSelectionReceiptContract(
  contract
) {
  const validation =
    validateGovernanceCaseReviewDecisionSelectionReceiptContract(contract);
  if (validation.ok) return contract;

  const err = new Error(
    `governance case review decision selection receipt contract invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
