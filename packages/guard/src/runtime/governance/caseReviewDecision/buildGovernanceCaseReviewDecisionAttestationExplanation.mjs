import { assertValidGovernanceCaseReviewDecisionAttestationExplanationContract } from "./governanceCaseReviewDecisionAttestationExplanationContract.mjs";
import {
  assertValidGovernanceCaseReviewDecisionAttestationExplanationProfile,
  buildGovernanceCaseReviewDecisionAttestationExplanationProfile,
} from "./governanceCaseReviewDecisionAttestationExplanationProfile.mjs";

export {
  buildGovernanceCaseReviewDecisionAttestationExplanationProfile as buildGovernanceCaseReviewDecisionAttestationExplanation,
};

export function consumeGovernanceCaseReviewDecisionAttestationExplanation({
  governanceCaseReviewDecisionAttestationExplanationProfile,
  governanceCaseReviewDecisionAttestationExplanationContract,
}) {
  const profile =
    assertValidGovernanceCaseReviewDecisionAttestationExplanationProfile(
      governanceCaseReviewDecisionAttestationExplanationProfile
    );
  const contract =
    assertValidGovernanceCaseReviewDecisionAttestationExplanationContract(
      governanceCaseReviewDecisionAttestationExplanationContract
    );
  const payload =
    profile.governance_case_review_decision_attestation_explanation;
  const explanationRef = payload.attestation_explanation_ref;
  const explanationContext = payload.explanation_context;

  if (
    contract.attestation_explanation_profile_ref.explanation_id !==
      explanationRef.explanation_id ||
    contract.attestation_explanation_profile_ref.attestation_id !==
      explanationRef.attestation_id ||
    contract.review_decision_id !== explanationRef.review_decision_id ||
    contract.attestation_explanation_profile_ref.case_id !== explanationRef.case_id ||
    contract.canonical_action_hash !== profile.canonical_action_hash
  ) {
    throw new Error(
      "governance case review decision attestation explanation consumer mismatch: profile and contract must remain aligned"
    );
  }

  return Object.freeze({
    consumer_surface: payload.consumer_surface,
    explanation_id: explanationRef.explanation_id,
    case_id: explanationRef.case_id,
    review_decision_id: explanationRef.review_decision_id,
    attestation_id: explanationRef.attestation_id,
    explanation_status: explanationContext.explanation_status,
    explanation_scope: explanationContext.explanation_scope,
    explanation_reason_codes: Object.freeze([
      ...explanationContext.explanation_basis.explanation_reason_codes,
    ]),
    derived_only: true,
    supporting_artifact_only: true,
    non_authoritative: true,
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
