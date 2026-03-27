import {
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_STATUS_ATTESTED,
  assertValidGovernanceCaseReviewDecisionAttestationProfile,
} from "./governanceCaseReviewDecisionAttestationProfile.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_STATUS_AVAILABLE,
  assertValidGovernanceCaseReviewDecisionAttestationExplanationProfile,
} from "./governanceCaseReviewDecisionAttestationExplanationProfile.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_STATUS_RECORDED,
  assertValidGovernanceCaseReviewDecisionAttestationReceiptProfile,
} from "./governanceCaseReviewDecisionAttestationReceiptProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_KIND =
  "governance_case_review_decision_attestation_traceability_profile";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_SCHEMA_ID =
  "mindforge/governance-case-review-decision-attestation-traceability-profile/v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_STAGE =
  "governance_case_review_decision_attestation_traceability_boundary_phase1_v6_4_0";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONSUMER_SURFACE =
  "guard.audit.governance_case_review_decision_attestation_traceability";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_BOUNDARY =
  "governance_case_review_decision_attestation_traceability_boundary_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_STATUS_TRACED =
  "traced";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SCOPE_CURRENT_ATTESTATION =
  "current_attestation_explanation_receipt_traceability_only";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_ATTESTATION_AVAILABLE =
  "attestation_available";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_ATTESTATION_EXPLANATION_AVAILABLE =
  "attestation_explanation_available";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_ATTESTATION_RECEIPT_AVAILABLE =
  "attestation_receipt_available";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_CURRENT_SELECTION_ALIGNED =
  "current_selection_aligned";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_SELECTION_EXPLANATION_LINKED =
  "selection_explanation_linked";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_SELECTION_RECEIPT_LINKED =
  "selection_receipt_linked";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_APPLICABILITY_LINKED =
  "applicability_linked";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_APPLICABILITY_EXPLANATION_LINKED =
  "applicability_explanation_linked";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_CONTINUITY_CHAIN_CURRENT =
  "continuity_chain_current";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_SUPPORTING_BASIS_COMPLETE =
  "supporting_basis_complete";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_CODES =
  Object.freeze([
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_ATTESTATION_AVAILABLE,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_ATTESTATION_EXPLANATION_AVAILABLE,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_ATTESTATION_RECEIPT_AVAILABLE,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_CURRENT_SELECTION_ALIGNED,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_SELECTION_EXPLANATION_LINKED,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_SELECTION_RECEIPT_LINKED,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_APPLICABILITY_LINKED,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_APPLICABILITY_EXPLANATION_LINKED,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_CONTINUITY_CHAIN_CURRENT,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_SUPPORTING_BASIS_COMPLETE,
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_CODE_ALLOWLIST =
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_CODES;
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_TOP_LEVEL_FIELDS =
  Object.freeze([
    "kind",
    "version",
    "schema_id",
    "canonical_action_hash",
    "governance_case_review_decision_attestation_traceability",
    "deterministic",
    "enforcing",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PAYLOAD_FIELDS =
  Object.freeze([
    "stage",
    "consumer_surface",
    "boundary",
    "attestation_traceability_ref",
    "traceability_context",
    "validation_exports",
    "preserved_semantics",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_STABLE_EXPORT_SET =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_KIND",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_SCHEMA_ID",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_STAGE",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONSUMER_SURFACE",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_BOUNDARY",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_STATUS_TRACED",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SCOPE_CURRENT_ATTESTATION",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_ATTESTATION_AVAILABLE",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_ATTESTATION_EXPLANATION_AVAILABLE",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_ATTESTATION_RECEIPT_AVAILABLE",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_CURRENT_SELECTION_ALIGNED",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_SELECTION_EXPLANATION_LINKED",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_SELECTION_RECEIPT_LINKED",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_APPLICABILITY_LINKED",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_APPLICABILITY_EXPLANATION_LINKED",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_CONTINUITY_CHAIN_CURRENT",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_SUPPORTING_BASIS_COMPLETE",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_CODES",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_CODE_ALLOWLIST",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_TOP_LEVEL_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PAYLOAD_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_STABLE_EXPORT_SET",
    "buildGovernanceCaseReviewDecisionAttestationTraceabilityProfile",
    "validateGovernanceCaseReviewDecisionAttestationTraceabilityProfile",
    "assertValidGovernanceCaseReviewDecisionAttestationTraceabilityProfile",
  ]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function ensureKnownReasonCodes(codes, allowlist) {
  return Array.isArray(codes) && new Set(codes).size === codes.length && codes.every((code) => allowlist.includes(code));
}

function assertTrueFields(source, fields, label) {
  for (const field of fields) {
    if (source[field] !== true) {
      throw new Error(`${label} must preserve ${field}`);
    }
  }
}

function assertFalseFields(source, fields, label) {
  for (const field of fields) {
    if (source[field] !== false) {
      throw new Error(`${label} must preserve ${field}=false`);
    }
  }
}

function assertAlignedIdentity(attestationRef, explanationRef, receiptRef, hashes) {
  for (const field of [
    "case_id",
    "review_decision_id",
    "current_selection_id",
    "selection_explanation_id",
    "selection_receipt_id",
    "applicability_id",
    "applicability_explanation_id",
  ]) {
    if (attestationRef[field] !== explanationRef[field] || attestationRef[field] !== receiptRef[field]) {
      throw new Error(`governance case review decision attestation traceability mismatch: ${field} must remain aligned`);
    }
  }
  if (
    attestationRef.attestation_id !== explanationRef.attestation_id ||
    attestationRef.attestation_id !== receiptRef.attestation_id
  ) {
    throw new Error("governance case review decision attestation traceability mismatch: attestation_id must remain aligned");
  }
  if (explanationRef.explanation_id !== receiptRef.attestation_explanation_id) {
    throw new Error("governance case review decision attestation traceability mismatch: attestation_explanation_id must remain aligned");
  }
  if (new Set(hashes).size !== 1) {
    throw new Error("governance case review decision attestation traceability mismatch: canonical_action_hash must remain aligned across traceability inputs");
  }
}

function assertAttestationSemantics(payload) {
  const { attestation_context: context, validation_exports: exports, preserved_semantics: semantics } = payload;
  if (context.attestation_status !== GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_STATUS_ATTESTED) {
    throw new Error("governance case review decision attestation traceability requires attestation current view");
  }
  if (
    context.continuity_status === "superseded" ||
    context.continuity_status === "parallel" ||
    context.supersession_status === "superseded" ||
    context.attestation_basis.continuity_chain_intact !== true ||
    context.attestation_basis.current_selection_final_acceptance_ready !== true
  ) {
    throw new Error("governance case review decision attestation traceability unsupported state: broken continuity current attestation cannot receive traceability");
  }
  assertTrueFields(
    exports,
    [
      "current_selection_final_acceptance_available",
      "selection_receipt_final_acceptance_available",
      "selection_explanation_final_acceptance_available",
      "applicability_profile_available",
      "applicability_explanation_profile_available",
      "unique_current_view_required",
      "continuity_chain_intact",
      "linkage_integrity_preserved",
      "permit_aggregate_export_only",
    ],
    "attestation validation export"
  );
  assertTrueFields(
    context.attestation_basis,
    [
      "selection_explanation_linked",
      "selection_receipt_linked",
      "applicability_linked",
      "applicability_explanation_linked",
      "derived_only",
      "supporting_artifact_only",
      "non_authoritative",
      "no_main_path_takeover",
    ],
    "attestation basis"
  );
  assertTrueFields(
    semantics,
    ["derived_only", "supporting_artifact_only", "recommendation_only", "additive_only", "non_executing", "default_off"],
    "attestation preserved semantic"
  );
  assertFalseFields(
    semantics,
    ["judgment_source_enabled", "authority_source_enabled", "execution_binding_enabled", "selection_feedback_enabled", "main_path_takeover"],
    "attestation preserved semantic"
  );
}

function assertExplanationSemantics(payload) {
  const { explanation_context: context, validation_exports: exports, preserved_semantics: semantics } = payload;
  if (context.explanation_status !== GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_STATUS_AVAILABLE) {
    throw new Error("governance case review decision attestation traceability requires attestation explanation availability");
  }
  assertTrueFields(
    exports,
    [
      "attestation_available",
      "selection_explanation_final_acceptance_available",
      "selection_receipt_final_acceptance_available",
      "applicability_profile_available",
      "applicability_explanation_profile_available",
      "export_surface_available",
      "unique_current_attestation_view_required",
      "broken_continuity_rejected",
      "cross_case_binding_rejected",
      "cross_review_decision_binding_rejected",
      "cross_canonical_action_hash_binding_rejected",
      "complete_supporting_linkage_required",
      "permit_aggregate_export_only",
    ],
    "explanation validation export"
  );
  assertTrueFields(
    context.explanation_basis,
    [
      "supporting_basis_complete",
      "selection_explanation_aligned",
      "selection_receipt_aligned",
      "applicability_aligned",
      "applicability_explanation_aligned",
      "current_selection_aligned",
    ],
    "explanation basis"
  );
  assertTrueFields(
    semantics,
    ["derived_only", "supporting_artifact_only", "non_authoritative", "additive_only", "non_executing", "default_off"],
    "explanation preserved semantic"
  );
  assertFalseFields(
    semantics,
    ["judgment_source_enabled", "authority_source_enabled", "execution_binding_enabled", "risk_source_enabled", "selection_feedback_enabled", "main_path_takeover"],
    "explanation preserved semantic"
  );
}

function assertReceiptSemantics(payload) {
  const { receipt_context: context, validation_exports: exports, preserved_semantics: semantics } = payload;
  if (context.receipt_status !== GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_STATUS_RECORDED) {
    throw new Error("governance case review decision attestation traceability requires attestation receipt availability");
  }
  assertTrueFields(
    exports,
    [
      "attestation_available",
      "attestation_explanation_available",
      "export_surface_available",
      "unique_current_attestation_view_required",
      "attestation_explanation_alignment_required",
      "continuity_chain_intact_required",
      "broken_continuity_rejected",
      "cross_case_binding_rejected",
      "cross_review_decision_binding_rejected",
      "cross_canonical_action_hash_binding_rejected",
      "complete_supporting_linkage_required",
      "linkage_integrity_preserved",
      "non_authoritative_support_only",
      "aggregate_export_only",
      "permit_aggregate_export_only",
    ],
    "receipt validation export"
  );
  assertTrueFields(
    context.receipt_basis,
    [
      "attestation_available",
      "attestation_explanation_available",
      "current_attestation_aligned",
      "current_selection_aligned",
      "attestation_explanation_aligned",
      "selection_explanation_aligned",
      "selection_receipt_aligned",
      "applicability_aligned",
      "applicability_explanation_aligned",
      "continuity_chain_current",
      "supporting_basis_complete",
      "derived_only",
      "supporting_artifact_only",
      "non_authoritative",
      "aggregate_export_only",
      "permit_aggregate_export_only",
    ],
    "receipt basis"
  );
  assertTrueFields(
    semantics,
    ["derived_only", "supporting_artifact_only", "non_authoritative", "recommendation_only", "additive_only", "non_executing", "default_off"],
    "receipt preserved semantic"
  );
  assertFalseFields(
    semantics,
    ["judgment_source_enabled", "authority_source_enabled", "execution_binding_enabled", "risk_source_enabled", "selection_feedback_enabled", "main_path_takeover"],
    "receipt preserved semantic"
  );
}

export function buildGovernanceCaseReviewDecisionAttestationTraceabilityProfile({
  governanceCaseReviewDecisionAttestationProfile,
  governanceCaseReviewDecisionAttestationExplanationProfile,
  governanceCaseReviewDecisionAttestationReceiptProfile,
}) {
  const attestationProfile = assertValidGovernanceCaseReviewDecisionAttestationProfile(
    governanceCaseReviewDecisionAttestationProfile
  );
  const explanationProfile = assertValidGovernanceCaseReviewDecisionAttestationExplanationProfile(
    governanceCaseReviewDecisionAttestationExplanationProfile
  );
  const receiptProfile = assertValidGovernanceCaseReviewDecisionAttestationReceiptProfile(
    governanceCaseReviewDecisionAttestationReceiptProfile
  );

  const attestationPayload = attestationProfile.governance_case_review_decision_attestation;
  const explanationPayload = explanationProfile.governance_case_review_decision_attestation_explanation;
  const receiptPayload = receiptProfile.governance_case_review_decision_attestation_receipt;
  const attestationRef = attestationPayload.attestation_ref;
  const explanationRef = explanationPayload.attestation_explanation_ref;
  const receiptRef = receiptPayload.attestation_receipt_ref;

  assertAttestationSemantics(attestationPayload);
  assertExplanationSemantics(explanationPayload);
  assertReceiptSemantics(receiptPayload);
  assertAlignedIdentity(attestationRef, explanationRef, receiptRef, [
    attestationProfile.canonical_action_hash,
    explanationProfile.canonical_action_hash,
    receiptProfile.canonical_action_hash,
  ]);

  return {
    kind: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_KIND,
    version: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_VERSION,
    schema_id: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_SCHEMA_ID,
    canonical_action_hash: attestationProfile.canonical_action_hash,
    governance_case_review_decision_attestation_traceability: {
      stage: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_STAGE,
      consumer_surface: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_CONSUMER_SURFACE,
      boundary: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_BOUNDARY,
      attestation_traceability_ref: {
        traceability_id: `${attestationRef.attestation_id}:traceability`,
        case_id: attestationRef.case_id,
        review_decision_id: attestationRef.review_decision_id,
        attestation_id: attestationRef.attestation_id,
        attestation_explanation_id: explanationRef.explanation_id,
        attestation_receipt_id: receiptRef.receipt_id,
        current_selection_id: attestationRef.current_selection_id,
        selection_explanation_id: attestationRef.selection_explanation_id,
        selection_receipt_id: attestationRef.selection_receipt_id,
        applicability_id: attestationRef.applicability_id,
        applicability_explanation_id: attestationRef.applicability_explanation_id,
      },
      traceability_context: {
        traceability_status: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_STATUS_TRACED,
        continuity_status: attestationPayload.attestation_context.continuity_status,
        supersession_status: attestationPayload.attestation_context.supersession_status,
        attestation_basis: Object.freeze({ ...attestationPayload.attestation_context.attestation_basis }),
        explanation_basis: Object.freeze({ ...explanationPayload.explanation_context.explanation_basis }),
        receipt_basis: Object.freeze({ ...receiptPayload.receipt_context.receipt_basis }),
        traceability_scope: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SCOPE_CURRENT_ATTESTATION,
        traceability_basis: Object.freeze({
          traceability_reason_codes: Object.freeze([
            ...GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_CODES,
          ]),
          attestation_available: true,
          attestation_explanation_available: true,
          attestation_receipt_available: true,
          current_attestation_aligned: true,
          current_selection_aligned: true,
          attestation_explanation_aligned: true,
          attestation_receipt_aligned: true,
          selection_explanation_aligned: true,
          selection_receipt_aligned: true,
          applicability_aligned: true,
          applicability_explanation_aligned: true,
          continuity_chain_current: true,
          supporting_basis_complete: true,
          derived_only: true,
          supporting_artifact_only: true,
          non_authoritative: true,
          aggregate_export_only: true,
          permit_aggregate_export_only: true,
        }),
        traceability_status_inputs: Object.freeze({
          continuity_chain_current: true,
          supporting_basis_complete: true,
          current_view_only: true,
          non_superseded_current_attestation_only: true,
        }),
        artifact_version: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_VERSION,
      },
      validation_exports: {
        attestation_available: true,
        attestation_explanation_available: true,
        attestation_receipt_available: true,
        export_surface_available: true,
        unique_current_attestation_view_required: true,
        attestation_explanation_alignment_required: true,
        attestation_receipt_alignment_required: true,
        continuity_chain_intact_required: true,
        broken_continuity_rejected: true,
        cross_case_binding_rejected: true,
        cross_review_decision_binding_rejected: true,
        cross_canonical_action_hash_binding_rejected: true,
        complete_supporting_linkage_required: true,
        linkage_integrity_preserved: true,
        non_authoritative_support_only: true,
        aggregate_export_only: true,
        permit_aggregate_export_only: true,
      },
      preserved_semantics: {
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
        authority_scope_expansion: false,
        governance_object_addition: false,
        ui_control_plane: false,
        attestation_trace_platform: false,
        cryptographic_trace_seal: false,
        observability_platform_behavior: false,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateGovernanceCaseReviewDecisionAttestationTraceabilityProfile(profile) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return { ok: false, errors: ["governance case review decision attestation traceability profile must be an object"] };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_TOP_LEVEL_FIELDS)
  ) {
    errors.push("governance case review decision attestation traceability top-level field order drifted");
  }
  if (
    profile.kind !== GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_KIND ||
    profile.version !== GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_VERSION ||
    profile.schema_id !== GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PROFILE_SCHEMA_ID
  ) {
    errors.push("governance case review decision attestation traceability profile envelope drifted");
  }
  const payload = profile.governance_case_review_decision_attestation_traceability;
  if (!isPlainObject(payload)) {
    errors.push("governance case review decision attestation traceability payload missing");
    return { ok: false, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_PAYLOAD_FIELDS)
  ) {
    errors.push("governance case review decision attestation traceability payload field order drifted");
  }
  const ref = payload.attestation_traceability_ref;
  const context = payload.traceability_context;
  if (!isPlainObject(ref) || !isPlainObject(context) || !isPlainObject(payload.validation_exports) || !isPlainObject(payload.preserved_semantics)) {
    errors.push("governance case review decision attestation traceability payload structure drifted");
    return { ok: false, errors };
  }
  for (const field of [
    "traceability_id",
    "case_id",
    "review_decision_id",
    "attestation_id",
    "attestation_explanation_id",
    "attestation_receipt_id",
    "current_selection_id",
    "selection_explanation_id",
    "selection_receipt_id",
    "applicability_id",
    "applicability_explanation_id",
  ]) {
    if (typeof ref[field] !== "string" || ref[field].length === 0) {
      errors.push(`governance case review decision attestation traceability ref ${field} is required`);
    }
  }
  if (
    context.traceability_status !== GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_STATUS_TRACED ||
    context.traceability_scope !== GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_SCOPE_CURRENT_ATTESTATION
  ) {
    errors.push("governance case review decision attestation traceability scope or status drifted");
  }
  if (
    !isPlainObject(context.attestation_basis) ||
    !isPlainObject(context.explanation_basis) ||
    !isPlainObject(context.receipt_basis) ||
    !isPlainObject(context.traceability_basis)
  ) {
    errors.push("governance case review decision attestation traceability basis objects drifted");
  } else if (
    !ensureKnownReasonCodes(
      context.traceability_basis.traceability_reason_codes,
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TRACEABILITY_REASON_CODE_ALLOWLIST
    )
  ) {
    errors.push("governance case review decision attestation traceability reason codes drifted");
  }
  for (const field of [
    "attestation_available",
    "attestation_explanation_available",
    "attestation_receipt_available",
    "export_surface_available",
    "unique_current_attestation_view_required",
    "attestation_explanation_alignment_required",
    "attestation_receipt_alignment_required",
    "continuity_chain_intact_required",
    "broken_continuity_rejected",
    "cross_case_binding_rejected",
    "cross_review_decision_binding_rejected",
    "cross_canonical_action_hash_binding_rejected",
    "complete_supporting_linkage_required",
    "linkage_integrity_preserved",
    "non_authoritative_support_only",
    "aggregate_export_only",
    "permit_aggregate_export_only",
  ]) {
    if (payload.validation_exports[field] !== true) {
      errors.push(
        `governance case review decision attestation traceability validation export drifted: ${field}`
      );
    }
  }
  for (const field of [
    "derived_only",
    "supporting_artifact_only",
    "non_authoritative",
    "recommendation_only",
    "additive_only",
    "non_executing",
    "default_off",
  ]) {
    if (payload.preserved_semantics[field] !== true) {
      errors.push(
        `governance case review decision attestation traceability preserved semantic drifted: ${field}`
      );
    }
  }
  for (const field of [
    "judgment_source_enabled",
    "authority_source_enabled",
    "execution_binding_enabled",
    "risk_source_enabled",
    "selection_feedback_enabled",
    "main_path_takeover",
    "authority_scope_expansion",
    "governance_object_addition",
    "ui_control_plane",
    "attestation_trace_platform",
    "cryptographic_trace_seal",
    "observability_platform_behavior",
  ]) {
    if (payload.preserved_semantics[field] !== false) {
      errors.push(
        `governance case review decision attestation traceability preserved semantic drifted: ${field}`
      );
    }
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionAttestationTraceabilityProfile(profile) {
  const validation = validateGovernanceCaseReviewDecisionAttestationTraceabilityProfile(profile);
  if (validation.ok) return profile;
  const err = new Error(
    `governance case review decision attestation traceability profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
