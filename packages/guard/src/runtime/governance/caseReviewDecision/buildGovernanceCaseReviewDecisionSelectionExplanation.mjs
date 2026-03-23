import { assertValidGovernanceCaseReviewDecisionSelectionExplanationContract } from "./governanceCaseReviewDecisionSelectionExplanationContract.mjs";
import {
  assertValidGovernanceCaseReviewDecisionSelectionExplanationProfile,
  buildGovernanceCaseReviewDecisionSelectionExplanationProfile,
} from "./governanceCaseReviewDecisionSelectionExplanationProfile.mjs";

export { buildGovernanceCaseReviewDecisionSelectionExplanationProfile };

export function consumeGovernanceCaseReviewDecisionSelectionExplanation({
  governanceCaseReviewDecisionSelectionExplanationProfile,
  governanceCaseReviewDecisionSelectionExplanationContract,
}) {
  const profile =
    assertValidGovernanceCaseReviewDecisionSelectionExplanationProfile(
      governanceCaseReviewDecisionSelectionExplanationProfile
    );
  const contract =
    assertValidGovernanceCaseReviewDecisionSelectionExplanationContract(
      governanceCaseReviewDecisionSelectionExplanationContract
    );
  const payload =
    profile.governance_case_review_decision_selection_explanation;
  const context = payload.explanation_context;
  const selectionRef = payload.selection_ref;

  if (
    contract.current_review_decision_id !==
      selectionRef.current_review_decision_id ||
    contract.canonical_action_hash !== profile.canonical_action_hash
  ) {
    throw new Error(
      "governance case review decision selection explanation consumer mismatch: profile and contract must remain aligned"
    );
  }

  return Object.freeze({
    consumer_surface: payload.consumer_surface,
    case_id: selectionRef.case_id,
    selection_status: selectionRef.selection_status,
    explanation_status: context.explanation_status,
    current_review_decision_id: selectionRef.current_review_decision_id,
    reason_codes: Object.freeze([...context.reason_codes]),
    supporting_artifact_only: true,
    recommendation_only: true,
    additive_only: true,
    executing: false,
  });
}
