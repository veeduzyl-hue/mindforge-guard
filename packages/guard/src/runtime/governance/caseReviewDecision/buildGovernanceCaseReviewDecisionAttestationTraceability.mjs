import { assertValidGovernanceCaseReviewDecisionAttestationTraceabilityContract } from "./governanceCaseReviewDecisionAttestationTraceabilityContract.mjs";
import {
  assertValidGovernanceCaseReviewDecisionAttestationTraceabilityProfile,
  buildGovernanceCaseReviewDecisionAttestationTraceabilityProfile,
} from "./governanceCaseReviewDecisionAttestationTraceabilityProfile.mjs";

export {
  buildGovernanceCaseReviewDecisionAttestationTraceabilityProfile as buildGovernanceCaseReviewDecisionAttestationTraceability,
};

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
    executing: false,
  });
}
