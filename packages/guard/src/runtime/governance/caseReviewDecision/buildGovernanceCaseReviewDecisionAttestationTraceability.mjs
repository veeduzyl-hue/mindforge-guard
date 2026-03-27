import { assertValidGovernanceCaseReviewDecisionAttestationTraceabilityContract } from "./governanceCaseReviewDecisionAttestationTraceabilityContract.mjs";
import {
  assertValidGovernanceCaseReviewDecisionAttestationTraceabilityProfile,
  buildGovernanceCaseReviewDecisionAttestationTraceabilityProfile,
} from "./governanceCaseReviewDecisionAttestationTraceabilityProfile.mjs";

export {
  buildGovernanceCaseReviewDecisionAttestationTraceabilityProfile as buildGovernanceCaseReviewDecisionAttestationTraceability,
};

function assertTrueFields(source, fields, label) {
  for (const field of fields) {
    if (source[field] !== true) {
      throw new Error(`${label} must preserve ${field}`);
    }
  }
}

function assertFalseFields(source, fields, label) {
  for (const field of fields) {
    if (source[field] !== false) {
      throw new Error(`${label} must preserve ${field}=false`);
    }
  }
}

export function consumeGovernanceCaseReviewDecisionAttestationTraceability({
  governanceCaseReviewDecisionAttestationTraceabilityProfile,
  governanceCaseReviewDecisionAttestationTraceabilityContract,
}) {
  const profile =
    assertValidGovernanceCaseReviewDecisionAttestationTraceabilityProfile(
      governanceCaseReviewDecisionAttestationTraceabilityProfile
    );
  const contract =
    assertValidGovernanceCaseReviewDecisionAttestationTraceabilityContract(
      governanceCaseReviewDecisionAttestationTraceabilityContract
    );
  const payload =
    profile.governance_case_review_decision_attestation_traceability;
  const traceabilityRef = payload.attestation_traceability_ref;
  const traceabilityContext = payload.traceability_context;

  if (
    contract.attestation_traceability_profile_ref.traceability_id !==
      traceabilityRef.traceability_id ||
    contract.attestation_traceability_profile_ref.attestation_id !==
      traceabilityRef.attestation_id ||
    contract.attestation_traceability_profile_ref.attestation_explanation_id !==
      traceabilityRef.attestation_explanation_id ||
    contract.attestation_traceability_profile_ref.attestation_receipt_id !==
      traceabilityRef.attestation_receipt_id ||
    contract.attestation_traceability_profile_ref.case_id !==
      traceabilityRef.case_id ||
    contract.review_decision_id !== traceabilityRef.review_decision_id ||
    contract.canonical_action_hash !== profile.canonical_action_hash
  ) {
    throw new Error(
      "governance case review decision attestation traceability consumer mismatch: profile and contract must remain aligned"
    );
  }

  assertTrueFields(
    contract,
    [
      "traceability_available",
      "attestation_required",
      "attestation_explanation_required",
      "attestation_receipt_required",
      "unique_current_attestation_view_required",
      "attestation_explanation_alignment_required",
      "attestation_receipt_alignment_required",
      "continuity_chain_intact_required",
      "broken_continuity_rejected",
      "cross_case_binding_rejected",
      "cross_review_decision_binding_rejected",
      "cross_canonical_action_hash_binding_rejected",
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
    ],
    "governance case review decision attestation traceability contract"
  );
  assertFalseFields(
    contract,
    [
      "judgment_source_enabled",
      "authority_source_enabled",
      "execution_binding_enabled",
      "risk_source_enabled",
      "selection_feedback_enabled",
      "permit_lane_consumption",
      "audit_path_dependency",
      "main_path_takeover",
      "attestation_trace_platform",
      "observability_platform_behavior",
      "traceability_platform_behavior",
    ],
    "governance case review decision attestation traceability contract"
  );

  return Object.freeze({
    consumer_surface: payload.consumer_surface,
    traceability_id: traceabilityRef.traceability_id,
    case_id: traceabilityRef.case_id,
    review_decision_id: traceabilityRef.review_decision_id,
    attestation_id: traceabilityRef.attestation_id,
    attestation_explanation_id: traceabilityRef.attestation_explanation_id,
    attestation_receipt_id: traceabilityRef.attestation_receipt_id,
    traceability_status: traceabilityContext.traceability_status,
    traceability_scope: traceabilityContext.traceability_scope,
    traceability_reason_codes: Object.freeze([
      ...traceabilityContext.traceability_basis.traceability_reason_codes,
    ]),
    derived_only: true,
    supporting_artifact_only: true,
    non_authoritative: true,
    recommendation_only: true,
    additive_only: true,
    non_executing: true,
    default_off: true,
    judgment_source_enabled: false,
    authority_source_enabled: false,
    execution_binding_enabled: false,
    risk_source_enabled: false,
    selection_feedback_enabled: false,
    main_path_takeover: false,
    audit_path_dependency: false,
    permit_lane_consumption: false,
    executing: false,
  });
}
