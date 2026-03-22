import {
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_VERSION,
  assertValidGovernanceCaseReviewDecisionCurrentSelectionProfile,
} from "./governanceCaseReviewDecisionCurrentSelectionProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONTRACT_KIND =
  "governance_case_review_decision_current_selection_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONTRACT_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONTRACT_BOUNDARY =
  "bounded_governance_case_review_decision_current_selection_contract";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceCaseReviewDecisionCurrentSelectionContract({
  governanceCaseReviewDecisionCurrentSelectionProfile,
}) {
  const profile =
    assertValidGovernanceCaseReviewDecisionCurrentSelectionProfile(
      governanceCaseReviewDecisionCurrentSelectionProfile
    );
  const context =
    profile.governance_case_review_decision_current_selection.selection_context;

  return {
    kind: GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONTRACT_KIND,
    version: GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONTRACT_VERSION,
    boundary:
      GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONTRACT_BOUNDARY,
    current_selection_profile_ref: {
      kind: GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_KIND,
      version: GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_VERSION,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_PROFILE_BOUNDARY,
      case_id: context.case_id,
      current_review_decision_id: context.current_review_decision_id,
    },
    current_selection_available: true,
    supporting_artifact_only: true,
    recommendation_only: true,
    additive_only: true,
    non_executing: true,
    default_off: true,
    deterministic_output_required: true,
    same_case_required: true,
    same_canonical_action_hash_required: true,
    superseded_excluded: true,
    unique_terminal_candidate_required: true,
    explicit_conflict_required: true,
    sequence_continuity_required: true,
    continuity_supported: true,
    main_path_takeover: false,
    authority_scope_expansion: false,
    new_governance_object: false,
    selection_status: context.selection_status,
    current_review_decision_id: context.current_review_decision_id,
    canonical_action_hash: profile.canonical_action_hash,
  };
}

export function validateGovernanceCaseReviewDecisionCurrentSelectionContract(
  contract
) {
  const errors = [];
  if (!isPlainObject(contract)) {
    return {
      ok: false,
      errors: [
        "governance case review decision current selection contract must be an object",
      ],
    };
  }
  if (
    contract.kind !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONTRACT_KIND
  ) {
    errors.push(
      "governance case review decision current selection contract kind drifted"
    );
  }
  if (
    contract.version !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONTRACT_VERSION
  ) {
    errors.push(
      "governance case review decision current selection contract version drifted"
    );
  }
  if (
    contract.boundary !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_CONTRACT_BOUNDARY
  ) {
    errors.push(
      "governance case review decision current selection contract boundary drifted"
    );
  }
  if (!isPlainObject(contract.current_selection_profile_ref)) {
    errors.push(
      "governance case review decision current selection contract profile ref missing"
    );
  }
  if (contract.current_selection_available !== true) {
    errors.push(
      "governance case review decision current selection availability drifted"
    );
  }
  if (contract.supporting_artifact_only !== true) {
    errors.push(
      "governance case review decision current selection supporting-artifact boundary drifted"
    );
  }
  if (contract.recommendation_only !== true) {
    errors.push(
      "governance case review decision current selection recommendation boundary drifted"
    );
  }
  if (contract.additive_only !== true) {
    errors.push(
      "governance case review decision current selection additive boundary drifted"
    );
  }
  if (contract.non_executing !== true) {
    errors.push(
      "governance case review decision current selection non-executing boundary drifted"
    );
  }
  if (contract.default_off !== true) {
    errors.push(
      "governance case review decision current selection default-off boundary drifted"
    );
  }
  if (contract.deterministic_output_required !== true) {
    errors.push(
      "governance case review decision current selection deterministic boundary drifted"
    );
  }
  if (contract.same_case_required !== true) {
    errors.push(
      "governance case review decision current selection case scope drifted"
    );
  }
  if (contract.same_canonical_action_hash_required !== true) {
    errors.push(
      "governance case review decision current selection canonical scope drifted"
    );
  }
  if (contract.superseded_excluded !== true) {
    errors.push(
      "governance case review decision current selection superseded exclusion drifted"
    );
  }
  if (contract.unique_terminal_candidate_required !== true) {
    errors.push(
      "governance case review decision current selection uniqueness boundary drifted"
    );
  }
  if (contract.explicit_conflict_required !== true) {
    errors.push(
      "governance case review decision current selection conflict boundary drifted"
    );
  }
  if (contract.sequence_continuity_required !== true) {
    errors.push(
      "governance case review decision current selection sequence continuity drifted"
    );
  }
  if (contract.continuity_supported !== true) {
    errors.push(
      "governance case review decision current selection continuity support drifted"
    );
  }
  if (contract.main_path_takeover !== false) {
    errors.push(
      "governance case review decision current selection main path takeover drifted"
    );
  }
  if (contract.authority_scope_expansion !== false) {
    errors.push(
      "governance case review decision current selection authority expansion drifted"
    );
  }
  if (contract.new_governance_object !== false) {
    errors.push(
      "governance case review decision current selection governance object boundary drifted"
    );
  }
  if (
    contract.selection_status !== "selected" &&
    contract.selection_status !== "conflict"
  ) {
    errors.push(
      "governance case review decision current selection status drifted"
    );
  }
  if (
    contract.selection_status === "selected" &&
    (typeof contract.current_review_decision_id !== "string" ||
      contract.current_review_decision_id.length === 0)
  ) {
    errors.push(
      "governance case review decision current selection selected status requires current_review_decision_id"
    );
  }
  if (
    contract.selection_status === "conflict" &&
    contract.current_review_decision_id !== null
  ) {
    errors.push(
      "governance case review decision current selection conflict status must not resolve a current decision"
    );
  }
  if (
    typeof contract.canonical_action_hash !== "string" ||
    contract.canonical_action_hash.length === 0
  ) {
    errors.push(
      "governance case review decision current selection canonical_action_hash is required"
    );
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionCurrentSelectionContract(
  contract
) {
  const validation =
    validateGovernanceCaseReviewDecisionCurrentSelectionContract(contract);
  if (validation.ok) return contract;

  const err = new Error(
    `governance case review decision current selection contract invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
