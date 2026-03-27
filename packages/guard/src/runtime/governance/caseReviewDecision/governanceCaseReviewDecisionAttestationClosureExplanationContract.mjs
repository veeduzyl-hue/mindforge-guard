import {
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_VERSION,
  assertValidGovernanceCaseReviewDecisionAttestationClosureExplanationProfile,
} from "./governanceCaseReviewDecisionAttestationClosureExplanationProfile.mjs";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONTRACT_KIND =
  "governance_case_review_decision_attestation_closure_explanation_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONTRACT_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONTRACT_BOUNDARY =
  "bounded_governance_case_review_decision_attestation_closure_explanation_contract";

export function buildGovernanceCaseReviewDecisionAttestationClosureExplanationContract({
  governanceCaseReviewDecisionAttestationClosureExplanationProfile,
}) {
  const profile =
    assertValidGovernanceCaseReviewDecisionAttestationClosureExplanationProfile(
      governanceCaseReviewDecisionAttestationClosureExplanationProfile
    );
  const payload =
    profile.governance_case_review_decision_attestation_closure_explanation;
  const ref = payload.attestation_closure_explanation_ref;
  const context = payload.explanation_context;

  return {
    kind:
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONTRACT_KIND,
    version:
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONTRACT_VERSION,
    boundary:
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONTRACT_BOUNDARY,
    attestation_closure_explanation_profile_ref: {
      kind:
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_KIND,
      version:
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_VERSION,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_BOUNDARY,
      explanation_id: ref.explanation_id,
      explanation_selection_id: ref.explanation_selection_id,
      closure_id: ref.closure_id,
      closure_selection_id: ref.closure_selection_id,
      case_id: ref.case_id,
      review_decision_id: ref.review_decision_id,
      attestation_id: ref.attestation_id,
    },
    explanation_available: true,
    closure_required: true,
    attestation_required: true,
    applicability_required: true,
    applicability_explanation_required: true,
    current_explanation_selected_only: true,
    unique_current_explanation_required: true,
    current_explanation_selection_stable: true,
    current_closure_selected_only: true,
    unique_current_closure_required: true,
    current_closure_selection_stable: true,
    closure_validity_basis_required: true,
    closure_selection_alignment_required: true,
    attestation_selection_alignment_required: true,
    attestation_applicability_binding_basis_required: true,
    applicability_explanation_alignment_basis_required: true,
    continuity_lineage_alignment_basis_required: true,
    closure_uniqueness_basis_required: true,
    cross_case_binding_rejected: true,
    cross_review_decision_binding_rejected: true,
    cross_canonical_action_hash_binding_rejected: true,
    complete_supporting_linkage_required: true,
    consumption_boundary_bounded: true,
    aggregate_export_only: true,
    permit_aggregate_export_only: true,
    derived_only: true,
    supporting_artifact_only: true,
    non_authoritative: true,
    additive_only: true,
    non_executing: true,
    default_off: true,
    explanation_linkage_only: true,
    judgment_source_enabled: false,
    authority_source_enabled: false,
    execution_binding_enabled: false,
    risk_source_enabled: false,
    selection_feedback_enabled: false,
    permit_lane_consumption: false,
    audit_path_dependency: false,
    main_path_takeover: false,
    authority_scope_expansion: false,
    new_governance_object: false,
    explanation_status: context.explanation_status,
    explanation_scope: context.explanation_scope,
    review_decision_id: ref.review_decision_id,
    canonical_action_hash: profile.canonical_action_hash,
  };
}

export function validateGovernanceCaseReviewDecisionAttestationClosureExplanationContract(
  contract
) {
  const errors = [];
  if (!isPlainObject(contract)) {
    return {
      ok: false,
      errors: [
        "governance case review decision attestation closure explanation contract must be an object",
      ],
    };
  }
  if (
    contract.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONTRACT_KIND ||
    contract.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONTRACT_VERSION ||
    contract.boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONTRACT_BOUNDARY
  ) {
    errors.push(
      "governance case review decision attestation closure explanation contract envelope drifted"
    );
  }
  if (!isPlainObject(contract.attestation_closure_explanation_profile_ref)) {
    errors.push(
      "governance case review decision attestation closure explanation profile ref missing"
    );
  }
  if (
    isPlainObject(contract.attestation_closure_explanation_profile_ref) &&
    (typeof contract.attestation_closure_explanation_profile_ref
      .explanation_selection_id !== "string" ||
      contract.attestation_closure_explanation_profile_ref.explanation_selection_id
        .length === 0)
  ) {
    errors.push(
      "governance case review decision attestation closure explanation profile ref explanation_selection_id missing"
    );
  }
  for (const field of [
    "explanation_available",
    "closure_required",
    "attestation_required",
    "applicability_required",
    "applicability_explanation_required",
    "current_explanation_selected_only",
    "unique_current_explanation_required",
    "current_explanation_selection_stable",
    "current_closure_selected_only",
    "unique_current_closure_required",
    "current_closure_selection_stable",
    "closure_validity_basis_required",
    "closure_selection_alignment_required",
    "attestation_selection_alignment_required",
    "attestation_applicability_binding_basis_required",
    "applicability_explanation_alignment_basis_required",
    "continuity_lineage_alignment_basis_required",
    "closure_uniqueness_basis_required",
    "cross_case_binding_rejected",
    "cross_review_decision_binding_rejected",
    "cross_canonical_action_hash_binding_rejected",
    "complete_supporting_linkage_required",
    "consumption_boundary_bounded",
    "aggregate_export_only",
    "permit_aggregate_export_only",
    "derived_only",
    "supporting_artifact_only",
    "non_authoritative",
    "additive_only",
    "non_executing",
    "default_off",
    "explanation_linkage_only",
  ]) {
    if (contract[field] !== true) {
      errors.push(
        `governance case review decision attestation closure explanation contract field drifted: ${field}`
      );
    }
  }
  for (const field of [
    "judgment_source_enabled",
    "authority_source_enabled",
    "execution_binding_enabled",
    "risk_source_enabled",
    "selection_feedback_enabled",
    "permit_lane_consumption",
    "audit_path_dependency",
    "main_path_takeover",
    "authority_scope_expansion",
    "new_governance_object",
  ]) {
    if (contract[field] !== false) {
      errors.push(
        `governance case review decision attestation closure explanation contract field drifted: ${field}`
      );
    }
  }
  if (contract.explanation_status !== "available") {
    errors.push(
      "governance case review decision attestation closure explanation status drifted"
    );
  }
  if (
    contract.explanation_scope !==
    "current_attestation_applicability_closure_only"
  ) {
    errors.push(
      "governance case review decision attestation closure explanation scope drifted"
    );
  }
  if (
    typeof contract.review_decision_id !== "string" ||
    contract.review_decision_id.length === 0 ||
    typeof contract.canonical_action_hash !== "string" ||
    contract.canonical_action_hash.length === 0
  ) {
    errors.push(
      "governance case review decision attestation closure explanation identity fields are required"
    );
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionAttestationClosureExplanationContract(
  contract
) {
  const validation =
    validateGovernanceCaseReviewDecisionAttestationClosureExplanationContract(
      contract
    );
  if (validation.ok) return contract;
  const err = new Error(
    `governance case review decision attestation closure explanation contract invalid: ${validation.errors.join(
      "; "
    )}`
  );
  err.validation = validation;
  throw err;
}
