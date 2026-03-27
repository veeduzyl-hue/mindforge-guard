import { assertValidGovernanceCaseReviewDecisionClosureEvidencePackageContract } from "./governanceCaseReviewDecisionClosureEvidencePackageContract.mjs";
import {
  assertValidGovernanceCaseReviewDecisionClosureEvidencePackageProfile,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageProfile,
} from "./governanceCaseReviewDecisionClosureEvidencePackageProfile.mjs";

export {
  buildGovernanceCaseReviewDecisionClosureEvidencePackageProfile as buildGovernanceCaseReviewDecisionClosureEvidencePackage,
};

export function consumeGovernanceCaseReviewDecisionClosureEvidencePackage({
  governanceCaseReviewDecisionClosureEvidencePackageProfile,
  governanceCaseReviewDecisionClosureEvidencePackageContract,
}) {
  const profile =
    assertValidGovernanceCaseReviewDecisionClosureEvidencePackageProfile(
      governanceCaseReviewDecisionClosureEvidencePackageProfile
    );
  const contract =
    assertValidGovernanceCaseReviewDecisionClosureEvidencePackageContract(
      governanceCaseReviewDecisionClosureEvidencePackageContract
    );
  const payload = profile.governance_case_review_decision_closure_evidence_package;
  const ref = payload.closure_evidence_package_ref;

  if (
    contract.closure_evidence_package_profile_ref.package_id !== ref.package_id ||
    contract.closure_evidence_package_profile_ref.receipt_id !== ref.receipt_id ||
    contract.closure_evidence_package_profile_ref.receipt_selection_id !==
      ref.receipt_selection_id ||
    contract.closure_evidence_package_profile_ref.explanation_id !==
      ref.explanation_id ||
    contract.closure_evidence_package_profile_ref.explanation_selection_id !==
      ref.explanation_selection_id ||
    contract.closure_evidence_package_profile_ref.closure_id !== ref.closure_id ||
    contract.review_decision_id !== ref.review_decision_id ||
    contract.canonical_action_hash !== profile.canonical_action_hash
  ) {
    throw new Error(
      "governance case review decision closure evidence package consumer mismatch: profile and contract must remain aligned"
    );
  }

  return Object.freeze({
    consumer_surface: payload.consumer_surface,
    package_id: ref.package_id,
    receipt_id: ref.receipt_id,
    receipt_selection_id: ref.receipt_selection_id,
    explanation_id: ref.explanation_id,
    explanation_selection_id: ref.explanation_selection_id,
    closure_id: ref.closure_id,
    closure_selection_id: ref.closure_selection_id,
    case_id: ref.case_id,
    review_decision_id: ref.review_decision_id,
    attestation_id: ref.attestation_id,
    package_status: payload.package_manifest.package_status,
    package_scope: payload.package_manifest.package_scope,
    included_artifact_ids: Object.freeze([
      ...payload.package_manifest.included_artifact_ids,
    ]),
    current_receipt_selected: true,
    current_receipt_selection_stable: true,
    current_closure_selected: true,
    current_explanation_selected: true,
    package_manifest_complete: true,
    package_composition_bounded: true,
    package_export_stable: true,
    package_linkage_only: true,
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
    permit_lane_consumption: false,
    audit_path_dependency: false,
    main_path_takeover: false,
    executing: false,
  });
}
