import {
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_VERSION,
  assertValidGovernanceCaseReviewDecisionAttestationTraceabilityProfile,
} from "./governanceCaseReviewDecisionAttestationTraceabilityProfile.mjs";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONTRACT_KIND =
  "governance_case_review_decision_attestation_traceability_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONTRACT_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONTRACT_BOUNDARY =
  "bounded_governance_case_review_decision_attestation_traceability_contract";

export function buildGovernanceCaseReviewDecisionAttestationTraceabilityContract({
  governanceCaseReviewDecisionAttestationTraceabilityProfile,
}) {
  const profile =
    assertValidGovernanceCaseReviewDecisionAttestationTraceabilityProfile(
      governanceCaseReviewDecisionAttestationTraceabilityProfile
    );
  const payload =
    profile.governance_case_review_decision_attestation_traceability;
  const traceabilityRef = payload.attestation_traceability_ref;
  const traceabilityContext = payload.traceability_context;

  return {
    kind:
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONTRACT_KIND,
    version:
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONTRACT_VERSION,
    boundary:
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONTRACT_BOUNDARY,
    attestation_traceability_profile_ref: {
      kind:
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_KIND,
      version:
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_VERSION,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_BOUNDARY,
      traceability_id: traceabilityRef.traceability_id,
      case_id: traceabilityRef.case_id,
      review_decision_id: traceabilityRef.review_decision_id,
      attestation_id: traceabilityRef.attestation_id,
      attestation_explanation_id: traceabilityRef.attestation_explanation_id,
      attestation_receipt_id: traceabilityRef.attestation_receipt_id,
    },
    traceability_available: true,
    attestation_required: true,
    attestation_explanation_required: true,
    attestation_receipt_required: true,
    current_selection_required: true,
    selection_explanation_required: true,
    selection_receipt_required: true,
    applicability_required: true,
    applicability_explanation_required: true,
    selected_current_review_decision_only: true,
    non_superseded_current_attestation_only: true,
    unique_current_attestation_view_required: true,
    attestation_explanation_alignment_required: true,
    attestation_receipt_alignment_required: true,
    continuity_chain_intact_required: true,
    broken_continuity_rejected: true,
    cross_case_binding_rejected: true,
    cross_review_decision_binding_rejected: true,
    cross_canonical_action_hash_binding_rejected: true,
    strict_case_id_alignment_required: true,
    strict_review_decision_id_alignment_required: true,
    strict_canonical_action_hash_alignment_required: true,
    complete_supporting_linkage_required: true,
    linkage_integrity_preserved: true,
    aggregate_export_only: true,
    permit_aggregate_export_only: true,
    derived_only: true,
    supporting_artifact_only: true,
    non_authoritative: true,
    non_authoritative_support_only: true,
    traceability_basis_support_only: true,
    recommendation_only: true,
    additive_only: true,
    non_executing: true,
    default_off: true,
    structured_traceability_only: true,
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
    attestation_trace_platform: false,
    observability_platform_behavior: false,
    traceability_platform_behavior: false,
    traceability_status: traceabilityContext.traceability_status,
    traceability_scope: traceabilityContext.traceability_scope,
    review_decision_id: traceabilityRef.review_decision_id,
    canonical_action_hash: profile.canonical_action_hash,
  };
}

export function validateGovernanceCaseReviewDecisionAttestationTraceabilityContract(
  contract
) {
  const errors = [];
  if (!isPlainObject(contract)) {
    return {
      ok: false,
      errors: [
        "governance case review decision attestation traceability contract must be an object",
      ],
    };
  }
  if (
    contract.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONTRACT_KIND ||
    contract.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONTRACT_VERSION ||
    contract.boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONTRACT_BOUNDARY
  ) {
    errors.push(
      "governance case review decision attestation traceability contract envelope drifted"
    );
  }
  for (const field of [
    "traceability_available",
    "attestation_required",
    "attestation_explanation_required",
    "attestation_receipt_required",
    "current_selection_required",
    "selection_explanation_required",
    "selection_receipt_required",
    "applicability_required",
    "applicability_explanation_required",
    "selected_current_review_decision_only",
    "non_superseded_current_attestation_only",
    "unique_current_attestation_view_required",
    "attestation_explanation_alignment_required",
    "attestation_receipt_alignment_required",
    "continuity_chain_intact_required",
    "broken_continuity_rejected",
    "cross_case_binding_rejected",
    "cross_review_decision_binding_rejected",
    "cross_canonical_action_hash_binding_rejected",
    "strict_case_id_alignment_required",
    "strict_review_decision_id_alignment_required",
    "strict_canonical_action_hash_alignment_required",
    "complete_supporting_linkage_required",
    "linkage_integrity_preserved",
    "aggregate_export_only",
    "permit_aggregate_export_only",
    "derived_only",
    "supporting_artifact_only",
    "non_authoritative",
    "non_authoritative_support_only",
    "traceability_basis_support_only",
    "recommendation_only",
    "additive_only",
    "non_executing",
    "default_off",
    "structured_traceability_only",
  ]) {
    if (contract[field] !== true) {
      errors.push(
        `governance case review decision attestation traceability contract field drifted: ${field}`
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
    "attestation_trace_platform",
    "observability_platform_behavior",
    "traceability_platform_behavior",
  ]) {
    if (contract[field] !== false) {
      errors.push(
        `governance case review decision attestation traceability contract field drifted: ${field}`
      );
    }
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionAttestationTraceabilityContract(
  contract
) {
  const validation =
    validateGovernanceCaseReviewDecisionAttestationTraceabilityContract(
      contract
    );
  if (validation.ok) return contract;

  const err = new Error(
    `governance case review decision attestation traceability contract invalid: ${validation.errors.join(
      "; "
    )}`
  );
  err.validation = validation;
  throw err;
}
