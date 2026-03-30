import { assertValidGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryContract } from "./governanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryContract.mjs";
import {
  assertValidGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile,
} from "./governanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile.mjs";

export {
  buildGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile as buildGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummary,
};

export function consumeGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummary({
  governanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile,
  governanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryContract,
}) {
  const profile =
    assertValidGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile(
      governanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile
    );
  const contract =
    assertValidGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryContract(
      governanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryContract
    );
  const payload =
    profile.governance_case_review_decision_closure_evidence_package_consumption_summary;
  const ref = payload.closure_evidence_package_consumption_summary_ref;
  const readiness = payload.summary_context.delivery_readiness;

  if (
    contract.closure_evidence_package_consumption_summary_profile_ref.summary_id !==
      ref.summary_id ||
    contract.closure_evidence_package_consumption_summary_profile_ref.package_id !==
      ref.package_id ||
    contract.closure_evidence_package_consumption_summary_profile_ref.narrative_id !==
      ref.narrative_id ||
    contract.closure_evidence_package_consumption_summary_profile_ref
      .narrative_selection_id !== ref.narrative_selection_id ||
    contract.closure_evidence_package_consumption_summary_profile_ref.receipt_id !==
      ref.receipt_id ||
    contract.closure_evidence_package_consumption_summary_profile_ref.explanation_id !==
      ref.explanation_id ||
    contract.closure_evidence_package_consumption_summary_profile_ref.closure_id !==
      ref.closure_id ||
    contract.review_decision_id !== ref.review_decision_id ||
    contract.canonical_action_hash !== profile.canonical_action_hash
  ) {
    throw new Error(
      "governance case review decision closure evidence package consumption summary consumer mismatch: profile and contract must remain aligned"
    );
  }

  return Object.freeze({
    consumer_surface: payload.consumer_surface,
    summary_id: ref.summary_id,
    package_id: ref.package_id,
    narrative_id: ref.narrative_id,
    narrative_selection_id: ref.narrative_selection_id,
    receipt_id: ref.receipt_id,
    explanation_id: ref.explanation_id,
    closure_id: ref.closure_id,
    case_id: ref.case_id,
    review_decision_id: ref.review_decision_id,
    attestation_id: ref.attestation_id,
    summary_status: payload.summary_context.summary_status,
    summary_scope: payload.summary_context.summary_scope,
    delivery_state: readiness.delivery_state,
    readability_state: readiness.readability_state,
    package_available: true,
    explanation_available: true,
    explanation_stabilized_surface_available: true,
    current_narrative_selected: true,
    current_narrative_selection_stable: true,
    narrative_section_alignment_stable: true,
    section_artifact_binding_stable: true,
    section_consumer_consistency_stable: true,
    cross_surface_alignment_stable: true,
    delivery_readiness_summary_bounded: true,
    delivery_readiness_readable: true,
    consumer_reading_surface_bounded: true,
    summary_export_stable: true,
    aggregate_export_only: true,
    permit_aggregate_export_only: true,
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
    permit_lane_consumption: false,
    audit_path_dependency: false,
    main_path_takeover: false,
    executing: false,
  });
}
