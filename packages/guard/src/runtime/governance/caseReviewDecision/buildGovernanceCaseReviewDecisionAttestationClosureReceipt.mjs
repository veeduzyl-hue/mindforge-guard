import { assertValidGovernanceCaseReviewDecisionAttestationClosureReceiptContract } from "./governanceCaseReviewDecisionAttestationClosureReceiptContract.mjs";
import {
  assertValidGovernanceCaseReviewDecisionAttestationClosureReceiptProfile,
  buildGovernanceCaseReviewDecisionAttestationClosureReceiptProfile,
} from "./governanceCaseReviewDecisionAttestationClosureReceiptProfile.mjs";

export {
  buildGovernanceCaseReviewDecisionAttestationClosureReceiptProfile as buildGovernanceCaseReviewDecisionAttestationClosureReceipt,
};

export function consumeGovernanceCaseReviewDecisionAttestationClosureReceipt({
  governanceCaseReviewDecisionAttestationClosureReceiptProfile,
  governanceCaseReviewDecisionAttestationClosureReceiptContract,
}) {
  const profile =
    assertValidGovernanceCaseReviewDecisionAttestationClosureReceiptProfile(
      governanceCaseReviewDecisionAttestationClosureReceiptProfile
    );
  const contract =
    assertValidGovernanceCaseReviewDecisionAttestationClosureReceiptContract(
      governanceCaseReviewDecisionAttestationClosureReceiptContract
    );
  const payload =
    profile.governance_case_review_decision_attestation_closure_receipt;
  const ref = payload.attestation_closure_receipt_ref;
  const context = payload.receipt_context;

  if (
    contract.attestation_closure_receipt_profile_ref.receipt_id !== ref.receipt_id ||
    contract.attestation_closure_receipt_profile_ref.explanation_id !==
      ref.explanation_id ||
    contract.attestation_closure_receipt_profile_ref.explanation_selection_id !==
      ref.explanation_selection_id ||
    contract.attestation_closure_receipt_profile_ref.closure_id !==
      ref.closure_id ||
    contract.attestation_closure_receipt_profile_ref.attestation_id !==
      ref.attestation_id ||
    contract.review_decision_id !== ref.review_decision_id ||
    contract.attestation_closure_receipt_profile_ref.case_id !== ref.case_id ||
    contract.canonical_action_hash !== profile.canonical_action_hash
  ) {
    throw new Error(
      "governance case review decision attestation closure receipt consumer mismatch: profile and contract must remain aligned"
    );
  }

  return Object.freeze({
    consumer_surface: payload.consumer_surface,
    receipt_id: ref.receipt_id,
    explanation_id: ref.explanation_id,
    explanation_selection_id: ref.explanation_selection_id,
    closure_id: ref.closure_id,
    closure_selection_id: ref.closure_selection_id,
    case_id: ref.case_id,
    review_decision_id: ref.review_decision_id,
    attestation_id: ref.attestation_id,
    receipt_status: context.receipt_status,
    receipt_scope: context.receipt_scope,
    receipt_reason_codes: Object.freeze([
      ...context.receipt_basis.receipt_reason_codes,
    ]),
    current_closure_selected: true,
    current_explanation_selected: true,
    current_explanation_selection_stable: true,
    receipt_linkage_only: true,
    consumption_boundary_bounded: true,
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
    audit_path_dependency: false,
    permit_lane_consumption: false,
    executing: false,
  });
}
