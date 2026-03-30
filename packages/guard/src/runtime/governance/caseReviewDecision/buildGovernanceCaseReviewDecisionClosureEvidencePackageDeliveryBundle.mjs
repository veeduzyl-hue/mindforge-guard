import { assertValidGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleContract } from "./governanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleContract.mjs";
import {
  assertValidGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleProfile,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleProfile,
} from "./governanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleProfile.mjs";

export {
  buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleProfile as buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundle,
};

export function consumeGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundle({
  governanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleProfile,
  governanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleContract,
}) {
  const profile =
    assertValidGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleProfile(
      governanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleProfile
    );
  const contract =
    assertValidGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleContract(
      governanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleContract
    );
  const payload =
    profile.governance_case_review_decision_closure_evidence_package_delivery_bundle;
  const ref = payload.closure_evidence_package_delivery_bundle_ref;
  const handoff = payload.bundle_context.handoff_bundle;

  if (
    contract.closure_evidence_package_delivery_bundle_profile_ref.bundle_id !==
      ref.bundle_id ||
    contract.closure_evidence_package_delivery_bundle_profile_ref.package_id !==
      ref.package_id ||
    contract.closure_evidence_package_delivery_bundle_profile_ref.explanation_id !==
      ref.explanation_id ||
    contract.closure_evidence_package_delivery_bundle_profile_ref.summary_id !==
      ref.summary_id ||
    contract.closure_evidence_package_delivery_bundle_profile_ref.narrative_id !==
      ref.narrative_id ||
    contract.closure_evidence_package_delivery_bundle_profile_ref
      .narrative_selection_id !== ref.narrative_selection_id ||
    contract.closure_evidence_package_delivery_bundle_profile_ref.receipt_id !==
      ref.receipt_id ||
    contract.closure_evidence_package_delivery_bundle_profile_ref.closure_id !==
      ref.closure_id ||
    contract.review_decision_id !== ref.review_decision_id ||
    contract.canonical_action_hash !== profile.canonical_action_hash
  ) {
    throw new Error(
      "governance case review decision closure evidence package delivery bundle consumer mismatch: profile and contract must remain aligned"
    );
  }

  return Object.freeze({
    consumer_surface: payload.consumer_surface,
    bundle_id: ref.bundle_id,
    package_id: ref.package_id,
    explanation_id: ref.explanation_id,
    summary_id: ref.summary_id,
    narrative_id: ref.narrative_id,
    narrative_selection_id: ref.narrative_selection_id,
    receipt_id: ref.receipt_id,
    closure_id: ref.closure_id,
    case_id: ref.case_id,
    review_decision_id: ref.review_decision_id,
    attestation_id: ref.attestation_id,
    bundle_status: payload.bundle_context.bundle_status,
    bundle_scope: payload.bundle_context.bundle_scope,
    handoff_state: handoff.handoff_state,
    readability_state: handoff.readability_state,
    package_available: true,
    explanation_available: true,
    consumption_summary_available: true,
    explanation_stabilized_surface_available: true,
    delivery_readiness_summary_available: true,
    bundle_ref_alignment_stable: true,
    handoff_semantics_stable: true,
    bundle_composition_stable: true,
    bundle_handoff_readability_consistency_stable: true,
    cross_surface_alignment_stable: true,
    bundle_composition_bounded: true,
    bundle_handoff_surface_bounded: true,
    bundle_handoff_readable: true,
    bundle_export_stable: true,
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
