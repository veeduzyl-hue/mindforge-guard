import {
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_PARALLEL,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING,
  GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODES,
  GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_VERSION,
  assertValidGovernanceCaseReviewDecisionProfile,
} from "./governanceCaseReviewDecisionProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_CONTRACT_KIND =
  "governance_case_review_decision_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_CONTRACT_VERSION = "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_CONTRACT_BOUNDARY =
  "bounded_governance_case_review_decision_contract";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceCaseReviewDecisionContract({
  governanceCaseReviewDecisionProfile,
}) {
  const profile = assertValidGovernanceCaseReviewDecisionProfile(
    governanceCaseReviewDecisionProfile
  );
  const context =
    profile.governance_case_review_decision.review_decision_context;
  const isCurrentEffectiveDecision =
    context.continuity_mode !==
      GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED &&
    context.superseded_by_review_decision_id === null;

  return {
    kind: GOVERNANCE_CASE_REVIEW_DECISION_CONTRACT_KIND,
    version: GOVERNANCE_CASE_REVIEW_DECISION_CONTRACT_VERSION,
    boundary: GOVERNANCE_CASE_REVIEW_DECISION_CONTRACT_BOUNDARY,
    review_decision_profile_ref: {
      kind: GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_KIND,
      version: GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_VERSION,
      boundary: GOVERNANCE_CASE_REVIEW_DECISION_PROFILE_BOUNDARY,
      review_decision_id: context.review_decision_id,
    },
    case_review_decision_available: true,
    supporting_artifact_only: true,
    recommendation_only: true,
    additive_only: true,
    non_executing: true,
    default_off: true,
    execution_enabled: false,
    actual_resolution_execution: false,
    actual_escalation_execution: false,
    actual_closure_execution: false,
    automatic_routing: false,
    automatic_case_finalization: false,
    authority_scope: "review_gate_deny_exit_recommendation_only",
    authority_scope_expansion: false,
    main_path_takeover: false,
    new_governance_object: false,
    continuity_supported: true,
    supersession_supported: true,
    continuity_mode: context.continuity_mode,
    supersedes_review_decision_id: context.supersedes_review_decision_id,
    superseded_by_review_decision_id: context.superseded_by_review_decision_id,
    review_decision_sequence: context.review_decision_sequence,
    supersession_reason: context.supersession_reason,
    current_effective_decision: isCurrentEffectiveDecision,
    canonical_action_hash: profile.canonical_action_hash,
  };
}

export function validateGovernanceCaseReviewDecisionContract(contract) {
  const errors = [];
  if (!isPlainObject(contract)) {
    return {
      ok: false,
      errors: ["governance case review decision contract must be an object"],
    };
  }
  if (contract.kind !== GOVERNANCE_CASE_REVIEW_DECISION_CONTRACT_KIND) {
    errors.push("governance case review decision contract kind drifted");
  }
  if (contract.version !== GOVERNANCE_CASE_REVIEW_DECISION_CONTRACT_VERSION) {
    errors.push("governance case review decision contract version drifted");
  }
  if (contract.boundary !== GOVERNANCE_CASE_REVIEW_DECISION_CONTRACT_BOUNDARY) {
    errors.push("governance case review decision contract boundary drifted");
  }
  if (!isPlainObject(contract.review_decision_profile_ref)) {
    errors.push("governance case review decision contract profile ref missing");
  }
  if (contract.case_review_decision_available !== true) {
    errors.push("governance case review decision availability drifted");
  }
  if (contract.supporting_artifact_only !== true) {
    errors.push(
      "governance case review decision supporting-artifact boundary drifted"
    );
  }
  if (contract.recommendation_only !== true) {
    errors.push("governance case review decision recommendation boundary drifted");
  }
  if (contract.additive_only !== true) {
    errors.push("governance case review decision additive boundary drifted");
  }
  if (contract.non_executing !== true) {
    errors.push("governance case review decision non-executing boundary drifted");
  }
  if (contract.default_off !== true) {
    errors.push("governance case review decision default-off boundary drifted");
  }
  if (contract.execution_enabled !== false) {
    errors.push("governance case review decision execution boundary drifted");
  }
  if (contract.actual_resolution_execution !== false) {
    errors.push("governance case review decision resolution execution drifted");
  }
  if (contract.actual_escalation_execution !== false) {
    errors.push("governance case review decision escalation execution drifted");
  }
  if (contract.actual_closure_execution !== false) {
    errors.push("governance case review decision closure execution drifted");
  }
  if (contract.automatic_routing !== false) {
    errors.push("governance case review decision routing boundary drifted");
  }
  if (contract.automatic_case_finalization !== false) {
    errors.push("governance case review decision finalization boundary drifted");
  }
  if (
    contract.authority_scope !== "review_gate_deny_exit_recommendation_only"
  ) {
    errors.push("governance case review decision authority scope drifted");
  }
  if (contract.authority_scope_expansion !== false) {
    errors.push("governance case review decision authority expansion drifted");
  }
  if (contract.main_path_takeover !== false) {
    errors.push("governance case review decision main path takeover drifted");
  }
  if (contract.new_governance_object !== false) {
    errors.push(
      "governance case review decision governance object boundary drifted"
    );
  }
  if (contract.continuity_supported !== true) {
    errors.push("governance case review decision continuity support drifted");
  }
  if (contract.supersession_supported !== true) {
    errors.push("governance case review decision supersession support drifted");
  }
  if (!GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODES.includes(contract.continuity_mode)) {
    errors.push("governance case review decision continuity_mode drifted");
  }
  if (
    !Number.isInteger(contract.review_decision_sequence) ||
    contract.review_decision_sequence < 1
  ) {
    errors.push(
      "governance case review decision review_decision_sequence drifted"
    );
  }
  if (
    contract.supersedes_review_decision_id !== null &&
    (typeof contract.supersedes_review_decision_id !== "string" ||
      contract.supersedes_review_decision_id.length === 0)
  ) {
    errors.push(
      "governance case review decision supersedes_review_decision_id drifted"
    );
  }
  if (
    contract.superseded_by_review_decision_id !== null &&
    (typeof contract.superseded_by_review_decision_id !== "string" ||
      contract.superseded_by_review_decision_id.length === 0)
  ) {
    errors.push(
      "governance case review decision superseded_by_review_decision_id drifted"
    );
  }
  if (
    contract.supersession_reason !== null &&
    (typeof contract.supersession_reason !== "string" ||
      contract.supersession_reason.length === 0)
  ) {
    errors.push("governance case review decision supersession_reason drifted");
  }
  if (
    contract.supersedes_review_decision_id !== null &&
    contract.review_decision_profile_ref &&
    contract.supersedes_review_decision_id ===
      contract.review_decision_profile_ref.review_decision_id
  ) {
    errors.push(
      "governance case review decision supersedes_review_decision_id must not self-reference"
    );
  }
  if (
    contract.continuity_mode ===
      GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_STANDALONE &&
    (contract.supersedes_review_decision_id !== null ||
      contract.superseded_by_review_decision_id !== null)
  ) {
    errors.push(
      "governance case review decision standalone continuity must not include supersession links"
    );
  }
  if (
    contract.continuity_mode ===
      GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDING &&
    contract.supersedes_review_decision_id === null
  ) {
    errors.push(
      "governance case review decision superseding continuity must reference a prior decision"
    );
  }
  if (
    contract.continuity_mode ===
      GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_SUPERSEDED &&
    contract.current_effective_decision !== false
  ) {
    errors.push(
      "governance case review decision superseded continuity must not remain current"
    );
  }
  if (
    contract.continuity_mode ===
      GOVERNANCE_CASE_REVIEW_DECISION_CONTINUITY_MODE_PARALLEL &&
    contract.current_effective_decision !== true
  ) {
    errors.push(
      "governance case review decision parallel continuity must remain review-only current"
    );
  }
  if (
    typeof contract.canonical_action_hash !== "string" ||
    contract.canonical_action_hash.length === 0
  ) {
    errors.push(
      "governance case review decision canonical action hash is required"
    );
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionContract(contract) {
  const validation = validateGovernanceCaseReviewDecisionContract(contract);
  if (validation.ok) return contract;

  const err = new Error(
    `governance case review decision contract invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
