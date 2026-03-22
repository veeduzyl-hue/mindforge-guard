import { assertValidGovernanceCaseReviewDecisionCurrentSelectionSummaryProfile } from "./governanceCaseReviewDecisionCurrentSelectionSummaryProfile.mjs";

export function consumeGovernanceCaseReviewDecisionCurrentSelection({
  governanceCaseReviewDecisionCurrentSelectionSummaryProfile,
}) {
  const profile =
    assertValidGovernanceCaseReviewDecisionCurrentSelectionSummaryProfile(
      governanceCaseReviewDecisionCurrentSelectionSummaryProfile
    );
  const context =
    profile.governance_case_review_decision_current_selection_summary
      .summary_context;

  return {
    consumer_surface:
      profile.governance_case_review_decision_current_selection_summary
        .consumer_surface,
    case_id: context.case_id,
    selection_status: context.selection_status,
    conflict_detected: context.conflict_detected === true,
    current_review_decision: context.current_review_decision,
    conflict_review_decision_ids: context.conflict_review_decision_ids,
    candidate_review_decision_ids: context.candidate_review_decision_ids,
    supporting_artifact_only: true,
    recommendation_only: true,
    additive_only: true,
    executing: false,
  };
}
