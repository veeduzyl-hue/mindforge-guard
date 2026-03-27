import {
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_VERSION,
  assertValidGovernanceCaseReviewDecisionClosureEvidencePackageProfile,
} from "./governanceCaseReviewDecisionClosureEvidencePackageProfile.mjs";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONTRACT_KIND =
  "governance_case_review_decision_closure_evidence_package_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONTRACT_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONTRACT_BOUNDARY =
  "bounded_governance_case_review_decision_closure_evidence_package_contract";

export function buildGovernanceCaseReviewDecisionClosureEvidencePackageContract({
  governanceCaseReviewDecisionClosureEvidencePackageProfile,
}) {
  const profile =
    assertValidGovernanceCaseReviewDecisionClosureEvidencePackageProfile(
      governanceCaseReviewDecisionClosureEvidencePackageProfile
    );
  const payload = profile.governance_case_review_decision_closure_evidence_package;
  const ref = payload.closure_evidence_package_ref;
  const manifest = payload.package_manifest;
  return {
    kind:
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONTRACT_KIND,
    version:
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONTRACT_VERSION,
    boundary:
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONTRACT_BOUNDARY,
    closure_evidence_package_profile_ref: {
      kind:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_KIND,
      version:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_VERSION,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_BOUNDARY,
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
    },
    package_available: true,
    receipt_required: true,
    closure_required: true,
    closure_explanation_required: true,
    current_receipt_selected_only: true,
    unique_current_receipt_required: true,
    current_receipt_selection_stable: true,
    current_closure_selected_only: true,
    current_explanation_selected_only: true,
    package_manifest_complete: true,
    package_composition_bounded: true,
    package_export_stable: true,
    package_linkage_only: true,
    consumption_boundary_bounded: true,
    aggregate_export_only: true,
    permit_aggregate_export_only: true,
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
    permit_lane_consumption: false,
    audit_path_dependency: false,
    main_path_takeover: false,
    authority_scope_expansion: false,
    new_governance_object: false,
    package_status: manifest.package_status,
    package_scope: manifest.package_scope,
    review_decision_id: ref.review_decision_id,
    canonical_action_hash: profile.canonical_action_hash,
  };
}

export function validateGovernanceCaseReviewDecisionClosureEvidencePackageContract(
  contract
) {
  const errors = [];
  if (!isPlainObject(contract)) {
    return {
      ok: false,
      errors: [
        "governance case review decision closure evidence package contract must be an object",
      ],
    };
  }
  if (
    contract.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONTRACT_KIND ||
    contract.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONTRACT_VERSION ||
    contract.boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONTRACT_BOUNDARY
  ) {
    errors.push(
      "governance case review decision closure evidence package contract envelope drifted"
    );
  }
  if (!isPlainObject(contract.closure_evidence_package_profile_ref)) {
    errors.push(
      "governance case review decision closure evidence package profile ref missing"
    );
  }
  for (const field of [
    "package_available",
    "receipt_required",
    "closure_required",
    "closure_explanation_required",
    "current_receipt_selected_only",
    "unique_current_receipt_required",
    "current_receipt_selection_stable",
    "current_closure_selected_only",
    "current_explanation_selected_only",
    "package_manifest_complete",
    "package_composition_bounded",
    "package_export_stable",
    "package_linkage_only",
    "consumption_boundary_bounded",
    "aggregate_export_only",
    "permit_aggregate_export_only",
    "derived_only",
    "supporting_artifact_only",
    "non_authoritative",
    "recommendation_only",
    "additive_only",
    "non_executing",
    "default_off",
  ]) {
    if (contract[field] !== true) {
      errors.push(
        `governance case review decision closure evidence package contract field drifted: ${field}`
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
    "new_governance_object",
  ]) {
    if (contract[field] !== false) {
      errors.push(
        `governance case review decision closure evidence package contract field drifted: ${field}`
      );
    }
  }
  if (contract.package_status !== "packaged") {
    errors.push(
      "governance case review decision closure evidence package status drifted"
    );
  }
  if (
    contract.package_scope !== "current_closure_supporting_evidence_package_only"
  ) {
    errors.push(
      "governance case review decision closure evidence package scope drifted"
    );
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionClosureEvidencePackageContract(
  contract
) {
  const validation =
    validateGovernanceCaseReviewDecisionClosureEvidencePackageContract(contract);
  if (validation.ok) return contract;
  const err = new Error(
    `governance case review decision closure evidence package contract invalid: ${validation.errors.join(
      "; "
    )}`
  );
  err.validation = validation;
  throw err;
}
