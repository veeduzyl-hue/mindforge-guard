import { assertValidGovernanceCaseReviewDecisionAttestationReceiptContract } from "./governanceCaseReviewDecisionAttestationReceiptContract.mjs";
import {
  assertValidGovernanceCaseReviewDecisionAttestationReceiptProfile,
  buildGovernanceCaseReviewDecisionAttestationReceiptProfile,
} from "./governanceCaseReviewDecisionAttestationReceiptProfile.mjs";

export {
  buildGovernanceCaseReviewDecisionAttestationReceiptProfile as buildGovernanceCaseReviewDecisionAttestationReceipt,
};

export function consumeGovernanceCaseReviewDecisionAttestationReceipt({
  governanceCaseReviewDecisionAttestationReceiptProfile,
  governanceCaseReviewDecisionAttestationReceiptContract,
}) {
  const profile = assertValidGovernanceCaseReviewDecisionAttestationReceiptProfile(
    governanceCaseReviewDecisionAttestationReceiptProfile
  );
  const contract =
    assertValidGovernanceCaseReviewDecisionAttestationReceiptContract(
      governanceCaseReviewDecisionAttestationReceiptContract
    );
  const payload = profile.governance_case_review_decision_attestation_receipt;
  const receiptRef = payload.attestation_receipt_ref;
  const receiptContext = payload.receipt_context;

  if (
    contract.attestation_receipt_profile_ref.receipt_id !== receiptRef.receipt_id ||
    contract.attestation_receipt_profile_ref.attestation_id !==
      receiptRef.attestation_id ||
    contract.attestation_receipt_profile_ref.attestation_explanation_id !==
      receiptRef.attestation_explanation_id ||
    contract.review_decision_id !== receiptRef.review_decision_id ||
    contract.attestation_receipt_profile_ref.case_id !== receiptRef.case_id ||
    contract.canonical_action_hash !== profile.canonical_action_hash
  ) {
    throw new Error(
      "governance case review decision attestation receipt consumer mismatch: profile and contract must remain aligned"
    );
  }

  return Object.freeze({
    consumer_surface: payload.consumer_surface,
    receipt_id: receiptRef.receipt_id,
    case_id: receiptRef.case_id,
    review_decision_id: receiptRef.review_decision_id,
    attestation_id: receiptRef.attestation_id,
    attestation_explanation_id: receiptRef.attestation_explanation_id,
    receipt_status: receiptContext.receipt_status,
    receipt_scope: receiptContext.receipt_scope,
    receipt_reason_codes: Object.freeze([
      ...receiptContext.receipt_basis.receipt_reason_codes,
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
