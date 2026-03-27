import { assertValidGovernanceCaseReviewDecisionAttestationApplicabilityClosureContract } from "./governanceCaseReviewDecisionAttestationApplicabilityClosureContract.mjs";
import {
  assertValidGovernanceCaseReviewDecisionAttestationApplicabilityClosureProfile,
  buildGovernanceCaseReviewDecisionAttestationApplicabilityClosureProfile,
} from "./governanceCaseReviewDecisionAttestationApplicabilityClosureProfile.mjs";

export {
  buildGovernanceCaseReviewDecisionAttestationApplicabilityClosureProfile as buildGovernanceCaseReviewDecisionAttestationApplicabilityClosure,
};

export function consumeGovernanceCaseReviewDecisionAttestationApplicabilityClosure({
  governanceCaseReviewDecisionAttestationApplicabilityClosureProfile,
  governanceCaseReviewDecisionAttestationApplicabilityClosureContract,
}) {
  const profile =
    assertValidGovernanceCaseReviewDecisionAttestationApplicabilityClosureProfile(
      governanceCaseReviewDecisionAttestationApplicabilityClosureProfile
    );
  const contract =
    assertValidGovernanceCaseReviewDecisionAttestationApplicabilityClosureContract(
      governanceCaseReviewDecisionAttestationApplicabilityClosureContract
    );
  const payload =
    profile.governance_case_review_decision_attestation_applicability_closure;
  const ref = payload.attestation_applicability_closure_ref;

  if (
    contract.attestation_applicability_closure_profile_ref.closure_id !==
      ref.closure_id ||
    contract.attestation_applicability_closure_profile_ref.attestation_id !==
      ref.attestation_id ||
    contract.canonical_action_hash !== profile.canonical_action_hash
  ) {
    throw new Error(
      "governance case review decision attestation applicability closure consumer mismatch: profile and contract must remain aligned"
    );
  }

  return Object.freeze({
    consumer_surface: payload.consumer_surface,
    closure_id: ref.closure_id,
    case_id: ref.case_id,
    review_decision_id: ref.review_decision_id,
    attestation_id: ref.attestation_id,
    applicability_id: ref.applicability_id,
    applicability_explanation_id: ref.applicability_explanation_id,
    closure_status: payload.closure_context.closure_status,
    closure_scope: payload.closure_context.closure_scope,
    closure_reason_codes: Object.freeze([
      ...payload.closure_context.closure_basis.closure_reason_codes,
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
    audit_path_dependency: false,
    permit_lane_consumption: false,
    executing: false,
  });
}
