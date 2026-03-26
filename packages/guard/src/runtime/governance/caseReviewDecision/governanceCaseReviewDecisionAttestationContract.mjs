import {
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_VERSION,
  assertValidGovernanceCaseReviewDecisionAttestationProfile,
} from "./governanceCaseReviewDecisionAttestationProfile.mjs";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONTRACT_KIND =
  "governance_case_review_decision_attestation_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONTRACT_VERSION = "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONTRACT_BOUNDARY =
  "bounded_governance_case_review_decision_attestation_contract";

export function buildGovernanceCaseReviewDecisionAttestationContract({
  governanceCaseReviewDecisionAttestationProfile,
}) {
  const profile = assertValidGovernanceCaseReviewDecisionAttestationProfile(
    governanceCaseReviewDecisionAttestationProfile
  );
  const payload = profile.governance_case_review_decision_attestation;
  const attestationRef = payload.attestation_ref;
  const attestationContext = payload.attestation_context;

  return {
    kind: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONTRACT_KIND,
    version: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONTRACT_VERSION,
    boundary: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONTRACT_BOUNDARY,
    attestation_profile_ref: {
      kind: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_KIND,
      version: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_VERSION,
      boundary: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_BOUNDARY,
      attestation_id: attestationRef.attestation_id,
      case_id: attestationRef.case_id,
      review_decision_id: attestationRef.review_decision_id,
    },
    attestation_available: true,
    selected_current_review_decision_only: true,
    current_selection_final_acceptance_required: true,
    selection_receipt_final_acceptance_required: true,
    selection_explanation_final_acceptance_required: true,
    applicability_profile_required: true,
    applicability_explanation_profile_required: true,
    selected_review_decision_profile_required: true,
    non_superseded_review_decision_required: true,
    unique_current_view_required: true,
    broken_continuity_rejected: true,
    cross_case_binding_rejected: true,
    cross_decision_binding_rejected: true,
    cross_canonical_action_hash_binding_rejected: true,
    strict_case_id_alignment_required: true,
    strict_review_decision_id_alignment_required: true,
    strict_canonical_action_hash_alignment_required: true,
    continuity_supersession_basis_required: true,
    aggregate_export_only: true,
    permit_aggregate_export_only: true,
    derived_only: true,
    supporting_artifact_only: true,
    recommendation_only: true,
    additive_only: true,
    non_executing: true,
    default_off: true,
    judgment_source_enabled: false,
    authority_source_enabled: false,
    execution_binding_enabled: false,
    selection_feedback_enabled: false,
    risk_source_enabled: false,
    main_path_takeover: false,
    authority_scope_expansion: false,
    new_governance_object: false,
    attestation_status: attestationContext.attestation_status,
    continuity_status: attestationContext.continuity_status,
    supersession_status: attestationContext.supersession_status,
    artifact_version: attestationContext.artifact_version,
    review_decision_id: attestationRef.review_decision_id,
    canonical_action_hash: profile.canonical_action_hash,
  };
}

export function validateGovernanceCaseReviewDecisionAttestationContract(contract) {
  const errors = [];
  if (!isPlainObject(contract)) {
    return {
      ok: false,
      errors: ["governance case review decision attestation contract must be an object"],
    };
  }
  if (contract.kind !== GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONTRACT_KIND) {
    errors.push("governance case review decision attestation contract kind drifted");
  }
  if (
    contract.version !== GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONTRACT_VERSION
  ) {
    errors.push("governance case review decision attestation contract version drifted");
  }
  if (
    contract.boundary !== GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONTRACT_BOUNDARY
  ) {
    errors.push("governance case review decision attestation contract boundary drifted");
  }
  if (!isPlainObject(contract.attestation_profile_ref)) {
    errors.push("governance case review decision attestation profile ref missing");
  }
  for (const field of [
    "attestation_available",
    "selected_current_review_decision_only",
    "current_selection_final_acceptance_required",
    "selection_receipt_final_acceptance_required",
    "selection_explanation_final_acceptance_required",
    "applicability_profile_required",
    "applicability_explanation_profile_required",
    "selected_review_decision_profile_required",
    "non_superseded_review_decision_required",
    "unique_current_view_required",
    "broken_continuity_rejected",
    "cross_case_binding_rejected",
    "cross_decision_binding_rejected",
    "cross_canonical_action_hash_binding_rejected",
    "strict_case_id_alignment_required",
    "strict_review_decision_id_alignment_required",
    "strict_canonical_action_hash_alignment_required",
    "continuity_supersession_basis_required",
    "aggregate_export_only",
    "permit_aggregate_export_only",
    "derived_only",
    "supporting_artifact_only",
    "recommendation_only",
    "additive_only",
    "non_executing",
    "default_off",
  ]) {
    if (contract[field] !== true) {
      errors.push(
        `governance case review decision attestation contract field drifted: ${field}`
      );
    }
  }
  for (const field of [
    "judgment_source_enabled",
    "authority_source_enabled",
    "execution_binding_enabled",
    "selection_feedback_enabled",
    "risk_source_enabled",
    "main_path_takeover",
    "authority_scope_expansion",
    "new_governance_object",
  ]) {
    if (contract[field] !== false) {
      errors.push(
        `governance case review decision attestation contract field drifted: ${field}`
      );
    }
  }
  if (contract.attestation_status !== "attested_current_view") {
    errors.push("governance case review decision attestation status drifted");
  }
  if (
    typeof contract.continuity_status !== "string" ||
    contract.continuity_status.length === 0
  ) {
    errors.push("governance case review decision attestation continuity_status is required");
  }
  if (
    typeof contract.supersession_status !== "string" ||
    contract.supersession_status.length === 0
  ) {
    errors.push("governance case review decision attestation supersession_status is required");
  }
  if (contract.artifact_version !== "v1") {
    errors.push("governance case review decision attestation artifact_version drifted");
  }
  if (
    typeof contract.review_decision_id !== "string" ||
    contract.review_decision_id.length === 0
  ) {
    errors.push("governance case review decision attestation review_decision_id is required");
  }
  if (
    typeof contract.canonical_action_hash !== "string" ||
    contract.canonical_action_hash.length === 0
  ) {
    errors.push("governance case review decision attestation canonical_action_hash is required");
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionAttestationContract(contract) {
  const validation = validateGovernanceCaseReviewDecisionAttestationContract(contract);
  if (validation.ok) return contract;

  const err = new Error(
    `governance case review decision attestation contract invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
