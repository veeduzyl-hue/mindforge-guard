import { assertValidGovernanceCaseReviewDecisionSelectionReceiptContract } from "./governanceCaseReviewDecisionSelectionReceiptContract.mjs";
import {
  assertValidGovernanceCaseReviewDecisionSelectionReceiptProfile,
  buildGovernanceCaseReviewDecisionSelectionReceiptProfile,
} from "./governanceCaseReviewDecisionSelectionReceiptProfile.mjs";

export { buildGovernanceCaseReviewDecisionSelectionReceiptProfile as buildGovernanceCaseReviewDecisionSelectionReceipt };

export function consumeGovernanceCaseReviewDecisionSelectionReceipt({
  governanceCaseReviewDecisionSelectionReceiptProfile,
  governanceCaseReviewDecisionSelectionReceiptContract,
}) {
  const profile = assertValidGovernanceCaseReviewDecisionSelectionReceiptProfile(
    governanceCaseReviewDecisionSelectionReceiptProfile
  );
  const contract =
    assertValidGovernanceCaseReviewDecisionSelectionReceiptContract(
      governanceCaseReviewDecisionSelectionReceiptContract
    );
  const payload = profile.governance_case_review_decision_selection_receipt;
  const receiptRef = payload.selection_receipt_ref;
  const context = payload.receipt_context;

  if (
    contract.selection_receipt_profile_ref.case_id !== receiptRef.case_id ||
    contract.current_review_decision_id !== receiptRef.current_review_decision_id ||
    contract.canonical_action_hash !== profile.canonical_action_hash
  ) {
    throw new Error(
      "governance case review decision selection receipt consumer mismatch: profile and contract must remain aligned"
    );
  }

  return Object.freeze({
    consumer_surface: payload.consumer_surface,
    case_id: receiptRef.case_id,
    selection_status: receiptRef.selection_status,
    receipt_status: context.receipt_status,
    current_review_decision_id: receiptRef.current_review_decision_id,
    reason_codes: Object.freeze([...context.reason_codes]),
    supporting_artifact_only: true,
    recommendation_only: true,
    additive_only: true,
    non_executing: true,
    default_off: true,
    identity_alignment_hardened: true,
    judgment_source_enabled: false,
    authority_source_enabled: false,
    selection_feedback_enabled: false,
    executing: false,
  });
}
