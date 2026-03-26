import { assertValidGovernanceCaseReviewDecisionAttestationContract } from "./governanceCaseReviewDecisionAttestationContract.mjs";
import {
  assertValidGovernanceCaseReviewDecisionAttestationProfile,
  buildGovernanceCaseReviewDecisionAttestationProfile,
} from "./governanceCaseReviewDecisionAttestationProfile.mjs";

export {
  buildGovernanceCaseReviewDecisionAttestationProfile as buildGovernanceCaseReviewDecisionAttestation,
};

export function consumeGovernanceCaseReviewDecisionAttestation({
  governanceCaseReviewDecisionAttestationProfile,
  governanceCaseReviewDecisionAttestationContract,
}) {
  const profile = assertValidGovernanceCaseReviewDecisionAttestationProfile(
    governanceCaseReviewDecisionAttestationProfile
  );
  const contract = assertValidGovernanceCaseReviewDecisionAttestationContract(
    governanceCaseReviewDecisionAttestationContract
  );
  const payload = profile.governance_case_review_decision_attestation;
  const attestationRef = payload.attestation_ref;
  const attestationContext = payload.attestation_context;

  if (
    contract.attestation_profile_ref.attestation_id !== attestationRef.attestation_id ||
    contract.attestation_profile_ref.case_id !== attestationRef.case_id ||
    contract.review_decision_id !== attestationRef.review_decision_id ||
    contract.canonical_action_hash !== profile.canonical_action_hash
  ) {
    throw new Error(
      "governance case review decision attestation consumer mismatch: profile and contract must remain aligned"
    );
  }

  return Object.freeze({
    consumer_surface: payload.consumer_surface,
    attestation_id: attestationRef.attestation_id,
    case_id: attestationRef.case_id,
    review_decision_id: attestationRef.review_decision_id,
    attestation_status: attestationContext.attestation_status,
    continuity_status: attestationContext.continuity_status,
    supersession_status: attestationContext.supersession_status,
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
    executing: false,
  });
}
