import { assertValidGovernanceCaseReviewDecisionApplicabilityContract } from "./governanceCaseReviewDecisionApplicabilityContract.mjs";
import {
  assertValidGovernanceCaseReviewDecisionApplicabilityProfile,
  buildGovernanceCaseReviewDecisionApplicabilityProfile,
} from "./governanceCaseReviewDecisionApplicabilityProfile.mjs";

export {
  buildGovernanceCaseReviewDecisionApplicabilityProfile as buildGovernanceCaseReviewDecisionApplicability,
};

export function consumeGovernanceCaseReviewDecisionApplicability({
  governanceCaseReviewDecisionApplicabilityProfile,
  governanceCaseReviewDecisionApplicabilityContract,
}) {
  const profile = assertValidGovernanceCaseReviewDecisionApplicabilityProfile(
    governanceCaseReviewDecisionApplicabilityProfile
  );
  const contract = assertValidGovernanceCaseReviewDecisionApplicabilityContract(
    governanceCaseReviewDecisionApplicabilityContract
  );
  const payload = profile.governance_case_review_decision_applicability;
  const applicabilityRef = payload.applicability_ref;
  const applicabilityContext = payload.applicability_context;

  if (
    contract.applicability_profile_ref.case_id !== applicabilityRef.case_id ||
    contract.current_review_decision_id !== applicabilityRef.current_review_decision_id ||
    contract.canonical_action_hash !== profile.canonical_action_hash
  ) {
    throw new Error(
      "governance case review decision applicability consumer mismatch: profile and contract must remain aligned"
    );
  }

  return Object.freeze({
    consumer_surface: payload.consumer_surface,
    case_id: applicabilityRef.case_id,
    selection_status: applicabilityRef.selection_status,
    applicability_status: applicabilityContext.applicability_status,
    current_review_decision_id: applicabilityRef.current_review_decision_id,
    applicability_reason_codes: Object.freeze([
      ...applicabilityContext.applicability_reason_codes,
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
