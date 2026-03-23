import { assertValidGovernanceCaseReviewDecisionApplicabilityExplanationContract } from "./governanceCaseReviewDecisionApplicabilityExplanationContract.mjs";
import {
  assertValidGovernanceCaseReviewDecisionApplicabilityExplanationProfile,
  buildGovernanceCaseReviewDecisionApplicabilityExplanationProfile,
} from "./governanceCaseReviewDecisionApplicabilityExplanationProfile.mjs";

export {
  buildGovernanceCaseReviewDecisionApplicabilityExplanationProfile as buildGovernanceCaseReviewDecisionApplicabilityExplanation,
};

export function consumeGovernanceCaseReviewDecisionApplicabilityExplanation({
  governanceCaseReviewDecisionApplicabilityExplanationProfile,
  governanceCaseReviewDecisionApplicabilityExplanationContract,
}) {
  const profile =
    assertValidGovernanceCaseReviewDecisionApplicabilityExplanationProfile(
      governanceCaseReviewDecisionApplicabilityExplanationProfile
    );
  const contract =
    assertValidGovernanceCaseReviewDecisionApplicabilityExplanationContract(
      governanceCaseReviewDecisionApplicabilityExplanationContract
    );
  const payload =
    profile.governance_case_review_decision_applicability_explanation;
  const explanationRef = payload.applicability_explanation_ref;
  const explanationContext = payload.explanation_context;

  if (
    contract.applicability_explanation_profile_ref.case_id !==
      explanationRef.case_id ||
    contract.current_review_decision_id !==
      explanationRef.current_review_decision_id ||
    contract.canonical_action_hash !== profile.canonical_action_hash
  ) {
    throw new Error(
      "governance case review decision applicability explanation consumer mismatch: profile and contract must remain aligned"
    );
  }

  return Object.freeze({
    consumer_surface: payload.consumer_surface,
    case_id: explanationRef.case_id,
    selection_status: explanationRef.selection_status,
    applicability_status: explanationRef.applicability_status,
    explanation_status: explanationContext.explanation_status,
    current_review_decision_id: explanationRef.current_review_decision_id,
    explanation_reason_codes: Object.freeze([
      ...explanationContext.explanation_reason_codes,
    ]),
    supporting_artifact_only: true,
    recommendation_only: true,
    additive_only: true,
    non_executing: true,
    default_off: true,
    judgment_source_enabled: false,
    authority_source_enabled: false,
    selection_feedback_enabled: false,
    executing: false,
  });
}
