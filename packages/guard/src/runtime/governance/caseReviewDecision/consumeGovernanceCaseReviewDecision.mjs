import { assertValidGovernanceCaseReviewDecisionProfile } from "./governanceCaseReviewDecisionProfile.mjs";
import { assertValidGovernanceCaseReviewDecisionContract } from "./governanceCaseReviewDecisionContract.mjs";

export function consumeGovernanceCaseReviewDecision({
  governanceCaseReviewDecisionProfile,
  governanceCaseReviewDecisionContract,
}) {
  const profile = assertValidGovernanceCaseReviewDecisionProfile(
    governanceCaseReviewDecisionProfile
  );
  const contract = assertValidGovernanceCaseReviewDecisionContract(
    governanceCaseReviewDecisionContract
  );
  const context =
    profile.governance_case_review_decision.review_decision_context;

  return {
    consumer_surface: profile.governance_case_review_decision.consumer_surface,
    case_id: context.case_id,
    review_decision_id: context.review_decision_id,
    review_status: context.review_status,
    evidence_sufficiency: context.evidence_sufficiency,
    review_decision_rationale: context.review_decision_rationale,
    linked_evidence_ids: context.linked_evidence_ids,
    linked_resolution_ids: context.linked_resolution_ids,
    linked_escalation_ids: context.linked_escalation_ids,
    linked_closure_ids: context.linked_closure_ids,
    supporting_artifact_only: contract.supporting_artifact_only === true,
    recommendation_only: contract.recommendation_only === true,
    additive_only: contract.additive_only === true,
    executing: false,
  };
}
