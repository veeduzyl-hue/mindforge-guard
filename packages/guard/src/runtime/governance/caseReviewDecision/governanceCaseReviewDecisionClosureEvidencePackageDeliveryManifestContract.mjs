import {
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PROFILE_VERSION,
  assertValidGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestProfile,
} from "./governanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestProfile.mjs";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_CONTRACT_KIND =
  "governance_case_review_decision_closure_evidence_package_delivery_manifest_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_CONTRACT_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_CONTRACT_BOUNDARY =
  "bounded_governance_case_review_decision_closure_evidence_package_delivery_manifest_contract";

export function buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestContract({
  governanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestProfile,
}) {
  const profile =
    assertValidGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestProfile(
      governanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestProfile
    );
  const payload =
    profile.governance_case_review_decision_closure_evidence_package_delivery_manifest;
  const ref = payload.closure_evidence_package_delivery_manifest_ref;

  return {
    kind:
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_CONTRACT_KIND,
    version:
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_CONTRACT_VERSION,
    boundary:
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_CONTRACT_BOUNDARY,
    closure_evidence_package_delivery_manifest_profile_ref: {
      kind:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PROFILE_KIND,
      version:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PROFILE_VERSION,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PROFILE_BOUNDARY,
      manifest_id: ref.manifest_id,
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
    },
    bundle_surface_required: true,
    package_surface_required: true,
    explanation_surface_required: true,
    consumption_summary_surface_required: true,
    manifest_ref_alignment_stable: true,
    manifest_listing_deterministic: true,
    manifest_composition_bounded: true,
    manifest_completeness_bounded: true,
    manifest_acceptance_surface_bounded: true,
    acceptance_readability_stable: true,
    manifest_export_stable: true,
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
    authority_scope_expansion: false,
    new_governance_authority_object: false,
    review_decision_id: ref.review_decision_id,
    canonical_action_hash: profile.canonical_action_hash,
  };
}

export function validateGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestContract(
  contract
) {
  const errors = [];
  if (!isPlainObject(contract)) {
    return {
      ok: false,
      errors: [
        "governance case review decision closure evidence package delivery manifest contract must be an object",
      ],
    };
  }
  if (
    contract.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_CONTRACT_KIND ||
    contract.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_CONTRACT_VERSION ||
    contract.boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_CONTRACT_BOUNDARY
  ) {
    errors.push(
      "governance case review decision closure evidence package delivery manifest contract envelope drifted"
    );
  }
  for (const field of [
    "bundle_surface_required",
    "package_surface_required",
    "explanation_surface_required",
    "consumption_summary_surface_required",
    "manifest_ref_alignment_stable",
    "manifest_listing_deterministic",
    "manifest_composition_bounded",
    "manifest_completeness_bounded",
    "manifest_acceptance_surface_bounded",
    "acceptance_readability_stable",
    "manifest_export_stable",
    "aggregate_export_only",
    "permit_aggregate_export_only",
    "derived_only",
    "supporting_artifact_only",
    "non_authoritative",
    "additive_only",
    "non_executing",
    "default_off",
  ]) {
    if (contract[field] !== true) {
      errors.push(
        `governance case review decision closure evidence package delivery manifest contract field drifted: ${field}`
      );
    }
  }
  for (const field of [
    "judgment_source_enabled",
    "authority_source_enabled",
    "execution_binding_enabled",
    "risk_source_enabled",
    "permit_lane_consumption",
    "audit_path_dependency",
    "main_path_takeover",
    "authority_scope_expansion",
    "new_governance_authority_object",
  ]) {
    if (contract[field] !== false) {
      errors.push(
        `governance case review decision closure evidence package delivery manifest contract field drifted: ${field}`
      );
    }
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestContract(
  contract
) {
  const validation =
    validateGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestContract(
      contract
    );
  if (validation.ok) return contract;
  const err = new Error(
    `governance case review decision closure evidence package delivery manifest contract invalid: ${validation.errors.join(
      "; "
    )}`
  );
  err.validation = validation;
  throw err;
}
