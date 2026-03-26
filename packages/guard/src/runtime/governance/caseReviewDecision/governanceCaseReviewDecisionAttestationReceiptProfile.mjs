import {
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_STATUS_ATTESTED,
  assertValidGovernanceCaseReviewDecisionAttestationProfile,
} from "./governanceCaseReviewDecisionAttestationProfile.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_STATUS_AVAILABLE,
  assertValidGovernanceCaseReviewDecisionAttestationExplanationProfile,
} from "./governanceCaseReviewDecisionAttestationExplanationProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PROFILE_KIND =
  "governance_case_review_decision_attestation_receipt_profile";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PROFILE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PROFILE_SCHEMA_ID =
  "mindforge/governance-case-review-decision-attestation-receipt-profile/v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PROFILE_STAGE =
  "governance_case_review_decision_attestation_receipt_boundary_phase1_v6_3_0";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_CONSUMER_SURFACE =
  "guard.audit.governance_case_review_decision_attestation_receipt";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PROFILE_BOUNDARY =
  "governance_case_review_decision_attestation_receipt_boundary_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_STATUS_RECORDED =
  "recorded";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_SCOPE_CURRENT_ATTESTATION =
  "current_attestation_explanation_receipt_only";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_ATTESTATION_AVAILABLE =
  "attestation_available";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_ATTESTATION_EXPLANATION_AVAILABLE =
  "attestation_explanation_available";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_CURRENT_SELECTION_ALIGNED =
  "current_selection_aligned";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_SELECTION_EXPLANATION_LINKED =
  "selection_explanation_linked";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_SELECTION_RECEIPT_LINKED =
  "selection_receipt_linked";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_APPLICABILITY_LINKED =
  "applicability_linked";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_APPLICABILITY_EXPLANATION_LINKED =
  "applicability_explanation_linked";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_CONTINUITY_CHAIN_CURRENT =
  "continuity_chain_current";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_SUPPORTING_BASIS_COMPLETE =
  "supporting_basis_complete";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_CODES =
  Object.freeze([
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_ATTESTATION_AVAILABLE,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_ATTESTATION_EXPLANATION_AVAILABLE,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_CURRENT_SELECTION_ALIGNED,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_SELECTION_EXPLANATION_LINKED,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_SELECTION_RECEIPT_LINKED,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_APPLICABILITY_LINKED,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_APPLICABILITY_EXPLANATION_LINKED,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_CONTINUITY_CHAIN_CURRENT,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_SUPPORTING_BASIS_COMPLETE,
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_CODE_ALLOWLIST =
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_CODES;
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_TOP_LEVEL_FIELDS =
  Object.freeze([
    "kind",
    "version",
    "schema_id",
    "canonical_action_hash",
    "governance_case_review_decision_attestation_receipt",
    "deterministic",
    "enforcing",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PAYLOAD_FIELDS =
  Object.freeze([
    "stage",
    "consumer_surface",
    "boundary",
    "attestation_receipt_ref",
    "receipt_context",
    "validation_exports",
    "preserved_semantics",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_STABLE_EXPORT_SET =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PROFILE_KIND",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PROFILE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PROFILE_SCHEMA_ID",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PROFILE_STAGE",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_CONSUMER_SURFACE",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PROFILE_BOUNDARY",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_STATUS_RECORDED",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_SCOPE_CURRENT_ATTESTATION",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_ATTESTATION_AVAILABLE",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_ATTESTATION_EXPLANATION_AVAILABLE",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_CURRENT_SELECTION_ALIGNED",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_SELECTION_EXPLANATION_LINKED",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_SELECTION_RECEIPT_LINKED",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_APPLICABILITY_LINKED",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_APPLICABILITY_EXPLANATION_LINKED",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_CONTINUITY_CHAIN_CURRENT",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_SUPPORTING_BASIS_COMPLETE",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_CODES",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_CODE_ALLOWLIST",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_TOP_LEVEL_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PAYLOAD_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_STABLE_EXPORT_SET",
    "buildGovernanceCaseReviewDecisionAttestationReceiptProfile",
    "validateGovernanceCaseReviewDecisionAttestationReceiptProfile",
    "assertValidGovernanceCaseReviewDecisionAttestationReceiptProfile",
  ]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasUniqueStrings(values) {
  return Array.isArray(values) && new Set(values).size === values.length;
}

function ensureKnownReasonCodes(reasonCodes, allowlist) {
  return Array.isArray(reasonCodes) && reasonCodes.every((code) => allowlist.includes(code));
}

function assertAlignedIdentity({
  attestationRef,
  explanationRef,
  canonicalActionHash,
  explanationCanonicalActionHash,
}) {
  for (const field of [
    "case_id",
    "review_decision_id",
    "current_selection_id",
    "selection_explanation_id",
    "selection_receipt_id",
    "applicability_id",
    "applicability_explanation_id",
  ]) {
    if (attestationRef[field] !== explanationRef[field]) {
      throw new Error(
        `governance case review decision attestation receipt mismatch: ${field} must remain aligned`
      );
    }
  }
  if (attestationRef.attestation_id !== explanationRef.attestation_id) {
    throw new Error(
      "governance case review decision attestation receipt mismatch: attestation_id must remain aligned"
    );
  }
  if (canonicalActionHash !== explanationCanonicalActionHash) {
    throw new Error(
      "governance case review decision attestation receipt mismatch: canonical_action_hash must remain aligned across receipt inputs"
    );
  }
}

function assertAttestationSemantics(attestationPayload) {
  const context = attestationPayload.attestation_context;
  const basis = context.attestation_basis;
  const validationExports = attestationPayload.validation_exports;
  const semantics = attestationPayload.preserved_semantics;
  if (context.attestation_status !== GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_STATUS_ATTESTED) {
    throw new Error(
      "governance case review decision attestation receipt requires attestation current view"
    );
  }
  if (
    context.continuity_status === "superseded" ||
    context.continuity_status === "parallel" ||
    context.supersession_status === "superseded" ||
    basis.continuity_chain_intact !== true ||
    basis.current_selection_final_acceptance_ready !== true
  ) {
    throw new Error(
      "governance case review decision attestation receipt unsupported state: broken continuity current attestation cannot receive a receipt"
    );
  }
  for (const field of [
    "current_selection_final_acceptance_available",
    "selection_receipt_final_acceptance_available",
    "selection_explanation_final_acceptance_available",
    "applicability_profile_available",
    "applicability_explanation_profile_available",
    "unique_current_view_required",
    "continuity_chain_intact",
    "linkage_integrity_preserved",
    "permit_aggregate_export_only",
  ]) {
    if (validationExports[field] !== true) {
      throw new Error(
        `governance case review decision attestation receipt missing attestation validation export: ${field}`
      );
    }
  }
  for (const field of [
    "selection_explanation_linked",
    "selection_receipt_linked",
    "applicability_linked",
    "applicability_explanation_linked",
    "derived_only",
    "supporting_artifact_only",
    "non_authoritative",
    "no_main_path_takeover",
  ]) {
    if (basis[field] !== true) {
      throw new Error(
        `governance case review decision attestation receipt missing support: attestation basis must preserve ${field}`
      );
    }
  }
  for (const field of [
    "derived_only",
    "supporting_artifact_only",
    "recommendation_only",
    "additive_only",
    "non_executing",
    "default_off",
  ]) {
    if (semantics[field] !== true) {
      throw new Error(
        `governance case review decision attestation receipt requires attestation preserved semantic ${field}=true`
      );
    }
  }
  for (const field of [
    "judgment_source_enabled",
    "authority_source_enabled",
    "execution_binding_enabled",
    "selection_feedback_enabled",
    "main_path_takeover",
  ]) {
    if (semantics[field] !== false) {
      throw new Error(
        `governance case review decision attestation receipt requires attestation preserved semantic ${field}=false`
      );
    }
  }
}

function assertExplanationSemantics(explanationPayload) {
  const context = explanationPayload.explanation_context;
  const basis = context.explanation_basis;
  const validationExports = explanationPayload.validation_exports;
  const semantics = explanationPayload.preserved_semantics;
  if (
    context.explanation_status !==
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_STATUS_AVAILABLE
  ) {
    throw new Error(
      "governance case review decision attestation receipt requires attestation explanation availability"
    );
  }
  for (const field of [
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
  ]) {
    if (validationExports[field] !== true) {
      throw new Error(
        `governance case review decision attestation receipt missing explanation validation export: ${field}`
      );
    }
  }
  for (const field of [
    "supporting_basis_complete",
    "selection_explanation_aligned",
    "selection_receipt_aligned",
    "applicability_aligned",
    "applicability_explanation_aligned",
    "current_selection_aligned",
  ]) {
    if (basis[field] !== true) {
      throw new Error(
        `governance case review decision attestation receipt missing support: explanation basis must preserve ${field}`
      );
    }
  }
  for (const field of [
    "derived_only",
    "supporting_artifact_only",
    "non_authoritative",
    "additive_only",
    "non_executing",
    "default_off",
  ]) {
    if (semantics[field] !== true) {
      throw new Error(
        `governance case review decision attestation receipt requires explanation preserved semantic ${field}=true`
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
  ]) {
    if (semantics[field] !== false) {
      throw new Error(
        `governance case review decision attestation receipt requires explanation preserved semantic ${field}=false`
      );
    }
  }
}

export function buildGovernanceCaseReviewDecisionAttestationReceiptProfile({
  governanceCaseReviewDecisionAttestationProfile,
  governanceCaseReviewDecisionAttestationExplanationProfile,
}) {
  const attestationProfile =
    assertValidGovernanceCaseReviewDecisionAttestationProfile(
      governanceCaseReviewDecisionAttestationProfile
    );
  const explanationProfile =
    assertValidGovernanceCaseReviewDecisionAttestationExplanationProfile(
      governanceCaseReviewDecisionAttestationExplanationProfile
    );

  const attestationPayload =
    attestationProfile.governance_case_review_decision_attestation;
  const explanationPayload =
    explanationProfile.governance_case_review_decision_attestation_explanation;
  const attestationRef = attestationPayload.attestation_ref;
  const explanationRef = explanationPayload.attestation_explanation_ref;

  assertAttestationSemantics(attestationPayload);
  assertExplanationSemantics(explanationPayload);
  assertAlignedIdentity({
    attestationRef,
    explanationRef,
    canonicalActionHash: attestationProfile.canonical_action_hash,
    explanationCanonicalActionHash: explanationProfile.canonical_action_hash,
  });

  const receiptId = `${attestationRef.attestation_id}:receipt`;
  const receiptReasonCodes =
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_CODE_ALLOWLIST.filter(
      (code) =>
        [
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_ATTESTATION_AVAILABLE,
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_ATTESTATION_EXPLANATION_AVAILABLE,
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_CURRENT_SELECTION_ALIGNED,
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_SELECTION_EXPLANATION_LINKED,
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_SELECTION_RECEIPT_LINKED,
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_APPLICABILITY_LINKED,
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_APPLICABILITY_EXPLANATION_LINKED,
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_CONTINUITY_CHAIN_CURRENT,
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_SUPPORTING_BASIS_COMPLETE,
        ].includes(code)
    );

  return {
    kind: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PROFILE_KIND,
    version: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PROFILE_VERSION,
    schema_id:
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PROFILE_SCHEMA_ID,
    canonical_action_hash: attestationProfile.canonical_action_hash,
    governance_case_review_decision_attestation_receipt: {
      stage: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PROFILE_STAGE,
      consumer_surface:
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_CONSUMER_SURFACE,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PROFILE_BOUNDARY,
      attestation_receipt_ref: {
        receipt_id: receiptId,
        case_id: attestationRef.case_id,
        review_decision_id: attestationRef.review_decision_id,
        attestation_id: attestationRef.attestation_id,
        attestation_explanation_id: explanationRef.explanation_id,
        current_selection_id: attestationRef.current_selection_id,
        selection_explanation_id: attestationRef.selection_explanation_id,
        selection_receipt_id: attestationRef.selection_receipt_id,
        applicability_id: attestationRef.applicability_id,
        applicability_explanation_id: attestationRef.applicability_explanation_id,
      },
      receipt_context: {
        receipt_status:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_STATUS_RECORDED,
        continuity_status: attestationPayload.attestation_context.continuity_status,
        supersession_status:
          attestationPayload.attestation_context.supersession_status,
        attestation_basis: Object.freeze({
          ...attestationPayload.attestation_context.attestation_basis,
        }),
        receipt_scope:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_SCOPE_CURRENT_ATTESTATION,
        receipt_basis: Object.freeze({
          receipt_reason_codes: Object.freeze(receiptReasonCodes),
          attestation_available: true,
          attestation_explanation_available: true,
          current_attestation_aligned: true,
          current_selection_aligned: true,
          attestation_explanation_aligned: true,
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
        receipt_status_inputs: Object.freeze({
          continuity_chain_current: true,
          supporting_basis_complete: true,
          current_view_only: true,
          non_superseded_current_attestation_only: true,
        }),
        artifact_version:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PROFILE_VERSION,
      },
      validation_exports: {
        attestation_available: true,
        attestation_explanation_available: true,
        export_surface_available: true,
        unique_current_attestation_view_required: true,
        attestation_explanation_alignment_required: true,
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
        attestation_traceability: false,
        cryptographic_receipt_seal: false,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateGovernanceCaseReviewDecisionAttestationReceiptProfile(
  profile
) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: [
        "governance case review decision attestation receipt profile must be an object",
      ],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_TOP_LEVEL_FIELDS)
  ) {
    errors.push(
      "governance case review decision attestation receipt top-level field order drifted"
    );
  }
  if (
    profile.kind !== GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PROFILE_KIND ||
    profile.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PROFILE_VERSION ||
    profile.schema_id !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PROFILE_SCHEMA_ID
  ) {
    errors.push(
      "governance case review decision attestation receipt profile envelope drifted"
    );
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push(
      "governance case review decision attestation receipt canonical_action_hash is required"
    );
  }
  if (profile.deterministic !== true || profile.enforcing !== false) {
    errors.push(
      "governance case review decision attestation receipt execution flags drifted"
    );
  }

  const payload = profile.governance_case_review_decision_attestation_receipt;
  if (!isPlainObject(payload)) {
    errors.push(
      "governance case review decision attestation receipt payload missing"
    );
    return { ok: false, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PAYLOAD_FIELDS)
  ) {
    errors.push(
      "governance case review decision attestation receipt payload field order drifted"
    );
  }
  if (
    payload.stage !== GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PROFILE_STAGE ||
    payload.consumer_surface !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_CONSUMER_SURFACE ||
    payload.boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PROFILE_BOUNDARY
  ) {
    errors.push(
      "governance case review decision attestation receipt payload envelope drifted"
    );
  }
  if (!isPlainObject(payload.attestation_receipt_ref)) {
    errors.push(
      "governance case review decision attestation receipt ref missing"
    );
  }
  if (!isPlainObject(payload.receipt_context)) {
    errors.push(
      "governance case review decision attestation receipt context missing"
    );
  }
  if (!isPlainObject(payload.validation_exports)) {
    errors.push(
      "governance case review decision attestation receipt validation exports missing"
    );
  }
  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push(
      "governance case review decision attestation receipt preserved semantics missing"
    );
  }
  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const receiptRef = payload.attestation_receipt_ref;
  const receiptContext = payload.receipt_context;
  const validationExports = payload.validation_exports;
  const preservedSemantics = payload.preserved_semantics;

  for (const field of [
    "receipt_id",
    "case_id",
    "review_decision_id",
    "attestation_id",
    "attestation_explanation_id",
    "current_selection_id",
    "selection_explanation_id",
    "selection_receipt_id",
    "applicability_id",
    "applicability_explanation_id",
  ]) {
    if (
      typeof receiptRef[field] !== "string" ||
      receiptRef[field].length === 0
    ) {
      errors.push(
        `governance case review decision attestation receipt ref ${field} is required`
      );
    }
  }
  if (
    receiptContext.receipt_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_STATUS_RECORDED ||
    receiptContext.receipt_scope !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_SCOPE_CURRENT_ATTESTATION
  ) {
    errors.push(
      "governance case review decision attestation receipt scope or status drifted"
    );
  }
  if (
    typeof receiptContext.continuity_status !== "string" ||
    typeof receiptContext.supersession_status !== "string"
  ) {
    errors.push(
      "governance case review decision attestation receipt continuity or supersession status is required"
    );
  }
  if (!isPlainObject(receiptContext.attestation_basis)) {
    errors.push(
      "governance case review decision attestation receipt attestation_basis must be an object"
    );
  }
  if (!isPlainObject(receiptContext.receipt_basis)) {
    errors.push(
      "governance case review decision attestation receipt receipt_basis must be an object"
    );
  } else if (
    !ensureKnownReasonCodes(
      receiptContext.receipt_basis.receipt_reason_codes,
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_REASON_CODE_ALLOWLIST
    ) ||
    !hasUniqueStrings(receiptContext.receipt_basis.receipt_reason_codes)
  ) {
    errors.push(
      "governance case review decision attestation receipt reason codes drifted"
    );
  } else {
    for (const field of [
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
    ]) {
      if (receiptContext.receipt_basis[field] !== true) {
        errors.push(
          `governance case review decision attestation receipt receipt_basis drifted: ${field}`
        );
      }
    }
  }
  if (!isPlainObject(receiptContext.receipt_status_inputs)) {
    errors.push(
      "governance case review decision attestation receipt receipt_status_inputs must be an object"
    );
  } else {
    for (const field of [
      "continuity_chain_current",
      "supporting_basis_complete",
      "current_view_only",
      "non_superseded_current_attestation_only",
    ]) {
      if (receiptContext.receipt_status_inputs[field] !== true) {
        errors.push(
          `governance case review decision attestation receipt receipt_status_inputs drifted: ${field}`
        );
      }
    }
  }
  if (
    receiptContext.artifact_version !==
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_RECEIPT_PROFILE_VERSION
  ) {
    errors.push(
      "governance case review decision attestation receipt artifact_version drifted"
    );
  }
  for (const field of [
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
  ]) {
    if (validationExports[field] !== true) {
      errors.push(
        `governance case review decision attestation receipt validation export drifted: ${field}`
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
    if (preservedSemantics[field] !== true) {
      errors.push(
        `governance case review decision attestation receipt preserved semantic drifted: ${field}`
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
    "attestation_traceability",
    "cryptographic_receipt_seal",
  ]) {
    if (preservedSemantics[field] !== false) {
      errors.push(
        `governance case review decision attestation receipt preserved semantic drifted: ${field}`
      );
    }
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionAttestationReceiptProfile(
  profile
) {
  const validation =
    validateGovernanceCaseReviewDecisionAttestationReceiptProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `governance case review decision attestation receipt profile invalid: ${validation.errors.join(
      "; "
    )}`
  );
  err.validation = validation;
  throw err;
}
