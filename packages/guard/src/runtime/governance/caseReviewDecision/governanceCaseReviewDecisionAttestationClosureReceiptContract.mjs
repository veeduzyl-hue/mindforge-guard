import {
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_VERSION,
  assertValidGovernanceCaseReviewDecisionAttestationClosureReceiptProfile,
} from "./governanceCaseReviewDecisionAttestationClosureReceiptProfile.mjs";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_CONTRACT_KIND =
  "governance_case_review_decision_attestation_closure_receipt_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_CONTRACT_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_CONTRACT_BOUNDARY =
  "bounded_governance_case_review_decision_attestation_closure_receipt_contract";

export function buildGovernanceCaseReviewDecisionAttestationClosureReceiptContract({
  governanceCaseReviewDecisionAttestationClosureReceiptProfile,
}) {
  const profile =
    assertValidGovernanceCaseReviewDecisionAttestationClosureReceiptProfile(
      governanceCaseReviewDecisionAttestationClosureReceiptProfile
    );
  const payload =
    profile.governance_case_review_decision_attestation_closure_receipt;
  const receiptRef = payload.attestation_closure_receipt_ref;
  const receiptContext = payload.receipt_context;

  return {
    kind: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_CONTRACT_KIND,
    version:
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_CONTRACT_VERSION,
    boundary:
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_CONTRACT_BOUNDARY,
    attestation_closure_receipt_profile_ref: {
      kind:
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_KIND,
      version:
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_VERSION,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_BOUNDARY,
      receipt_id: receiptRef.receipt_id,
      receipt_selection_id: receiptRef.receipt_selection_id,
      explanation_id: receiptRef.explanation_id,
      explanation_selection_id: receiptRef.explanation_selection_id,
      closure_id: receiptRef.closure_id,
      closure_selection_id: receiptRef.closure_selection_id,
      case_id: receiptRef.case_id,
      review_decision_id: receiptRef.review_decision_id,
      attestation_id: receiptRef.attestation_id,
    },
    receipt_available: true,
    closure_required: true,
    closure_explanation_required: true,
    current_receipt_selected_only: true,
    current_closure_selected_only: true,
    current_explanation_selected_only: true,
    unique_current_receipt_required: true,
    unique_current_closure_required: true,
    unique_current_explanation_required: true,
    current_receipt_selection_stable: true,
    current_closure_selection_stable: true,
    current_explanation_selection_stable: true,
    explanation_selection_alignment_required: true,
    closure_selection_alignment_required: true,
    attestation_selection_alignment_required: true,
    attestation_applicability_binding_required: true,
    applicability_explanation_alignment_required: true,
    continuity_lineage_alignment_required: true,
    complete_supporting_linkage_required: true,
    receipt_linkage_only: true,
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
    selection_feedback_enabled: false,
    permit_lane_consumption: false,
    audit_path_dependency: false,
    main_path_takeover: false,
    authority_scope_expansion: false,
    new_governance_object: false,
    receipt_status: receiptContext.receipt_status,
    receipt_scope: receiptContext.receipt_scope,
    review_decision_id: receiptRef.review_decision_id,
    canonical_action_hash: profile.canonical_action_hash,
  };
}

export function validateGovernanceCaseReviewDecisionAttestationClosureReceiptContract(
  contract
) {
  const errors = [];
  if (!isPlainObject(contract)) {
    return {
      ok: false,
      errors: [
        "governance case review decision attestation closure receipt contract must be an object",
      ],
    };
  }
  if (
    contract.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_CONTRACT_KIND ||
    contract.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_CONTRACT_VERSION ||
    contract.boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_CONTRACT_BOUNDARY
  ) {
    errors.push(
      "governance case review decision attestation closure receipt contract envelope drifted"
    );
  }
  if (!isPlainObject(contract.attestation_closure_receipt_profile_ref)) {
    errors.push(
      "governance case review decision attestation closure receipt profile ref missing"
    );
  } else {
    for (const field of [
      "receipt_id",
      "receipt_selection_id",
      "explanation_id",
      "explanation_selection_id",
      "closure_id",
      "closure_selection_id",
      "case_id",
      "review_decision_id",
      "attestation_id",
    ]) {
      if (
        typeof contract.attestation_closure_receipt_profile_ref[field] !== "string" ||
        contract.attestation_closure_receipt_profile_ref[field].length === 0
      ) {
        errors.push(
          `governance case review decision attestation closure receipt profile ref field missing: ${field}`
        );
      }
    }
  }
  for (const field of [
    "receipt_available",
    "closure_required",
    "closure_explanation_required",
    "current_receipt_selected_only",
    "current_closure_selected_only",
    "current_explanation_selected_only",
    "unique_current_receipt_required",
    "unique_current_closure_required",
    "unique_current_explanation_required",
    "current_receipt_selection_stable",
    "current_closure_selection_stable",
    "current_explanation_selection_stable",
    "explanation_selection_alignment_required",
    "closure_selection_alignment_required",
    "attestation_selection_alignment_required",
    "attestation_applicability_binding_required",
    "applicability_explanation_alignment_required",
    "continuity_lineage_alignment_required",
    "complete_supporting_linkage_required",
    "receipt_linkage_only",
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
        `governance case review decision attestation closure receipt contract field drifted: ${field}`
      );
    }
  }
  for (const field of [
    "judgment_source_enabled",
    "authority_source_enabled",
    "execution_binding_enabled",
    "risk_source_enabled",
    "selection_feedback_enabled",
    "permit_lane_consumption",
    "audit_path_dependency",
    "main_path_takeover",
    "authority_scope_expansion",
    "new_governance_object",
  ]) {
    if (contract[field] !== false) {
      errors.push(
        `governance case review decision attestation closure receipt contract field drifted: ${field}`
      );
    }
  }
  if (contract.receipt_status !== "recorded") {
    errors.push(
      "governance case review decision attestation closure receipt status drifted"
    );
  }
  if (
    contract.receipt_scope !==
    "current_attestation_applicability_closure_explanation_receipt_only"
  ) {
    errors.push(
      "governance case review decision attestation closure receipt scope drifted"
    );
  }
  if (
    typeof contract.review_decision_id !== "string" ||
    contract.review_decision_id.length === 0 ||
    typeof contract.canonical_action_hash !== "string" ||
    contract.canonical_action_hash.length === 0
  ) {
    errors.push(
      "governance case review decision attestation closure receipt identity fields are required"
    );
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionAttestationClosureReceiptContract(
  contract
) {
  const validation =
    validateGovernanceCaseReviewDecisionAttestationClosureReceiptContract(
      contract
    );
  if (validation.ok) return contract;

  const err = new Error(
    `governance case review decision attestation closure receipt contract invalid: ${validation.errors.join(
      "; "
    )}`
  );
  err.validation = validation;
  throw err;
}
