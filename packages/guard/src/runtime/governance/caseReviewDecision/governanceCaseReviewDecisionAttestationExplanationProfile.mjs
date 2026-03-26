import {
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_STATUS_ATTESTED,
  assertValidGovernanceCaseReviewDecisionAttestationProfile,
} from "./governanceCaseReviewDecisionAttestationProfile.mjs";
import { assertValidGovernanceCaseReviewDecisionApplicabilityExplanationProfile } from "./governanceCaseReviewDecisionApplicabilityExplanationProfile.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_STATUS_APPLICABLE,
  assertValidGovernanceCaseReviewDecisionApplicabilityProfile,
} from "./governanceCaseReviewDecisionApplicabilityProfile.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_READY,
  assertValidGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary,
} from "./governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_READY,
  assertValidGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary,
} from "./governanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_KIND =
  "governance_case_review_decision_attestation_explanation_profile";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_SCHEMA_ID =
  "mindforge/governance-case-review-decision-attestation-explanation-profile/v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_STAGE =
  "governance_case_review_decision_attestation_explanation_boundary_phase1_v6_2_0";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_CONSUMER_SURFACE =
  "guard.audit.governance_case_review_decision_attestation_explanation";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_BOUNDARY =
  "governance_case_review_decision_attestation_explanation_boundary_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_STATUS_AVAILABLE =
  "available";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SCOPE_CURRENT_ATTESTATION =
  "current_attestation_basis_only";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_ATTESTATION_AVAILABLE =
  "attestation_available";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_CURRENT_SELECTION_ALIGNED =
  "current_selection_aligned";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_SELECTION_EXPLANATION_LINKED =
  "selection_explanation_linked";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_SELECTION_RECEIPT_LINKED =
  "selection_receipt_linked";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_APPLICABILITY_LINKED =
  "applicability_linked";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_APPLICABILITY_EXPLANATION_LINKED =
  "applicability_explanation_linked";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_CONTINUITY_CHAIN_CURRENT =
  "continuity_chain_current";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_SUPPORTING_BASIS_COMPLETE =
  "supporting_basis_complete";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_CODES =
  Object.freeze([
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_ATTESTATION_AVAILABLE,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_CURRENT_SELECTION_ALIGNED,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_SELECTION_EXPLANATION_LINKED,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_SELECTION_RECEIPT_LINKED,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_APPLICABILITY_LINKED,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_APPLICABILITY_EXPLANATION_LINKED,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_CONTINUITY_CHAIN_CURRENT,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_SUPPORTING_BASIS_COMPLETE,
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_CODE_ALLOWLIST =
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_CODES;
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_TOP_LEVEL_FIELDS =
  Object.freeze([
    "kind",
    "version",
    "schema_id",
    "canonical_action_hash",
    "governance_case_review_decision_attestation_explanation",
    "deterministic",
    "enforcing",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PAYLOAD_FIELDS =
  Object.freeze([
    "stage",
    "consumer_surface",
    "boundary",
    "attestation_explanation_ref",
    "explanation_context",
    "validation_exports",
    "preserved_semantics",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_STABLE_EXPORT_SET =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_KIND",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_SCHEMA_ID",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_STAGE",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_CONSUMER_SURFACE",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_BOUNDARY",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_STATUS_AVAILABLE",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SCOPE_CURRENT_ATTESTATION",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_ATTESTATION_AVAILABLE",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_CURRENT_SELECTION_ALIGNED",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_SELECTION_EXPLANATION_LINKED",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_SELECTION_RECEIPT_LINKED",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_APPLICABILITY_LINKED",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_APPLICABILITY_EXPLANATION_LINKED",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_CONTINUITY_CHAIN_CURRENT",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_SUPPORTING_BASIS_COMPLETE",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_CODES",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_CODE_ALLOWLIST",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_TOP_LEVEL_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PAYLOAD_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_STABLE_EXPORT_SET",
    "buildGovernanceCaseReviewDecisionAttestationExplanationProfile",
    "validateGovernanceCaseReviewDecisionAttestationExplanationProfile",
    "assertValidGovernanceCaseReviewDecisionAttestationExplanationProfile",
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

function assertAlignedRef({ label, ref, caseId, reviewDecisionId }) {
  if (!isPlainObject(ref)) {
    throw new Error(
      `governance case review decision attestation explanation missing support: ${label} ref must be an object`
    );
  }
  if (ref.case_id !== caseId) {
    throw new Error(
      `governance case review decision attestation explanation mismatch: ${label} must remain case aligned`
    );
  }
  if (ref.current_review_decision_id !== reviewDecisionId) {
    throw new Error(
      `governance case review decision attestation explanation mismatch: ${label} must remain current review decision aligned`
    );
  }
}

function assertSupportingSemantics({
  attestationPayload,
  applicabilityPayload,
  applicabilityExplanationPayload,
}) {
  if (
    attestationPayload.preserved_semantics.derived_only !== true ||
    attestationPayload.preserved_semantics.supporting_artifact_only !== true ||
    attestationPayload.preserved_semantics.recommendation_only !== true ||
    attestationPayload.preserved_semantics.additive_only !== true ||
    attestationPayload.preserved_semantics.non_executing !== true ||
    attestationPayload.preserved_semantics.default_off !== true
  ) {
    throw new Error(
      "governance case review decision attestation explanation requires attestation to remain derived-only additive support"
    );
  }
  for (const field of [
    "judgment_source_enabled",
    "authority_source_enabled",
    "execution_binding_enabled",
    "selection_feedback_enabled",
    "main_path_takeover",
  ]) {
    if (attestationPayload.preserved_semantics[field] !== false) {
      throw new Error(
        `governance case review decision attestation explanation requires attestation preserved semantic ${field}=false`
      );
    }
  }
  if (
    applicabilityPayload.applicability_context.applicability_status !==
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_STATUS_APPLICABLE
  ) {
    throw new Error(
      "governance case review decision attestation explanation requires applicable applicability profile"
    );
  }
  if (
    applicabilityExplanationPayload.explanation_context.explanation_status !==
    "available"
  ) {
    throw new Error(
      "governance case review decision attestation explanation requires available applicability explanation profile"
    );
  }
}

export function buildGovernanceCaseReviewDecisionAttestationExplanationProfile({
  governanceCaseReviewDecisionAttestationProfile,
  governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary,
  governanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary,
  governanceCaseReviewDecisionApplicabilityProfile,
  governanceCaseReviewDecisionApplicabilityExplanationProfile,
}) {
  const attestationProfile =
    assertValidGovernanceCaseReviewDecisionAttestationProfile(
      governanceCaseReviewDecisionAttestationProfile
    );
  const selectionExplanationFinalAcceptanceBoundary =
    assertValidGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary(
      governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary
    );
  const selectionReceiptFinalAcceptanceBoundary =
    assertValidGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary(
      governanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary
    );
  const applicabilityProfile =
    assertValidGovernanceCaseReviewDecisionApplicabilityProfile(
      governanceCaseReviewDecisionApplicabilityProfile
    );
  const applicabilityExplanationProfile =
    assertValidGovernanceCaseReviewDecisionApplicabilityExplanationProfile(
      governanceCaseReviewDecisionApplicabilityExplanationProfile
    );

  const attestationPayload =
    attestationProfile.governance_case_review_decision_attestation;
  const attestationRef = attestationPayload.attestation_ref;
  const attestationContext = attestationPayload.attestation_context;
  const caseId = attestationRef.case_id;
  const reviewDecisionId = attestationRef.review_decision_id;
  const canonicalActionHash = attestationProfile.canonical_action_hash;

  if (
    attestationContext.attestation_status !==
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_STATUS_ATTESTED
  ) {
    throw new Error(
      "governance case review decision attestation explanation requires attestation current view"
    );
  }
  if (
    attestationContext.continuity_status === "superseded" ||
    attestationContext.continuity_status === "parallel" ||
    attestationContext.attestation_basis.continuity_chain_intact !== true ||
    attestationContext.attestation_basis.current_selection_final_acceptance_ready !==
      true
  ) {
    throw new Error(
      "governance case review decision attestation explanation unsupported state: broken continuity current attestation cannot receive explanation"
    );
  }

  const selectionExplanationAcceptance =
    selectionExplanationFinalAcceptanceBoundary.governance_case_review_decision_selection_explanation_final_acceptance;
  const selectionReceiptAcceptance =
    selectionReceiptFinalAcceptanceBoundary.governance_case_review_decision_selection_receipt_final_acceptance;
  const applicabilityPayload =
    applicabilityProfile.governance_case_review_decision_applicability;
  const applicabilityExplanationPayload =
    applicabilityExplanationProfile.governance_case_review_decision_applicability_explanation;

  if (
    selectionExplanationAcceptance.final_acceptance_contract.readiness_level !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_READY
  ) {
    throw new Error(
      "governance case review decision attestation explanation requires selection explanation final acceptance readiness"
    );
  }
  if (
    selectionReceiptAcceptance.final_acceptance_contract.readiness_level !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_READY
  ) {
    throw new Error(
      "governance case review decision attestation explanation requires selection receipt final acceptance readiness"
    );
  }

  assertSupportingSemantics({
    attestationPayload,
    applicabilityPayload,
    applicabilityExplanationPayload,
  });

  assertAlignedRef({
    label: "selection explanation",
    ref: selectionExplanationAcceptance.selection_explanation_profile_ref,
    caseId,
    reviewDecisionId,
  });
  assertAlignedRef({
    label: "selection receipt",
    ref: selectionReceiptAcceptance.selection_receipt_profile_ref,
    caseId,
    reviewDecisionId,
  });
  assertAlignedRef({
    label: "applicability",
    ref: applicabilityPayload.applicability_ref,
    caseId,
    reviewDecisionId,
  });
  assertAlignedRef({
    label: "applicability explanation",
    ref: applicabilityExplanationPayload.applicability_explanation_ref,
    caseId,
    reviewDecisionId,
  });

  if (
    selectionExplanationFinalAcceptanceBoundary.canonical_action_hash !==
      canonicalActionHash ||
    selectionReceiptFinalAcceptanceBoundary.canonical_action_hash !==
      canonicalActionHash ||
    applicabilityProfile.canonical_action_hash !== canonicalActionHash ||
    applicabilityExplanationProfile.canonical_action_hash !== canonicalActionHash
  ) {
    throw new Error(
      "governance case review decision attestation explanation mismatch: canonical_action_hash must remain aligned across explanation inputs"
    );
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
    if (attestationContext.attestation_basis[field] !== true) {
      throw new Error(
        `governance case review decision attestation explanation missing support: attestation basis must preserve ${field}`
      );
    }
  }

  const explanationId = `${attestationRef.attestation_id}:explanation`;
  const explanationReasonCodes =
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_CODE_ALLOWLIST.filter(
      (code) =>
        [
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_ATTESTATION_AVAILABLE,
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_CURRENT_SELECTION_ALIGNED,
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_SELECTION_EXPLANATION_LINKED,
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_SELECTION_RECEIPT_LINKED,
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_APPLICABILITY_LINKED,
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_APPLICABILITY_EXPLANATION_LINKED,
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_CONTINUITY_CHAIN_CURRENT,
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_SUPPORTING_BASIS_COMPLETE,
        ].includes(code)
    );

  return {
    kind: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_KIND,
    version:
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_VERSION,
    schema_id:
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_SCHEMA_ID,
    canonical_action_hash: canonicalActionHash,
    governance_case_review_decision_attestation_explanation: {
      stage:
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_STAGE,
      consumer_surface:
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_CONSUMER_SURFACE,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_BOUNDARY,
      attestation_explanation_ref: {
        explanation_id: explanationId,
        case_id: caseId,
        review_decision_id: reviewDecisionId,
        attestation_id: attestationRef.attestation_id,
        current_selection_id: attestationRef.current_selection_id,
        selection_explanation_id: attestationRef.selection_explanation_id,
        selection_receipt_id: attestationRef.selection_receipt_id,
        applicability_id: attestationRef.applicability_id,
        applicability_explanation_id: attestationRef.applicability_explanation_id,
      },
      explanation_context: {
        explanation_status:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_STATUS_AVAILABLE,
        continuity_status: attestationContext.continuity_status,
        supersession_status: attestationContext.supersession_status,
        attestation_basis: Object.freeze({
          ...attestationContext.attestation_basis,
        }),
        explanation_scope:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SCOPE_CURRENT_ATTESTATION,
        explanation_basis: Object.freeze({
          explanation_reason_codes: Object.freeze(explanationReasonCodes),
          supporting_basis_complete: true,
          selection_explanation_aligned: true,
          selection_receipt_aligned: true,
          applicability_aligned: true,
          applicability_explanation_aligned: true,
          current_selection_aligned: true,
        }),
        artifact_version:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_VERSION,
      },
      validation_exports: {
        attestation_available: true,
        selection_explanation_final_acceptance_available: true,
        selection_receipt_final_acceptance_available: true,
        applicability_profile_available: true,
        applicability_explanation_profile_available: true,
        export_surface_available: true,
      },
      preserved_semantics: {
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
        authority_scope_expansion: false,
        governance_object_addition: false,
        ui_control_plane: false,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateGovernanceCaseReviewDecisionAttestationExplanationProfile(
  profile
) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: [
        "governance case review decision attestation explanation profile must be an object",
      ],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_TOP_LEVEL_FIELDS
    )
  ) {
    errors.push(
      "governance case review decision attestation explanation top-level field order drifted"
    );
  }
  if (
    profile.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_KIND ||
    profile.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_VERSION ||
    profile.schema_id !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_SCHEMA_ID
  ) {
    errors.push(
      "governance case review decision attestation explanation profile envelope drifted"
    );
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push(
      "governance case review decision attestation explanation canonical_action_hash is required"
    );
  }
  if (profile.deterministic !== true || profile.enforcing !== false) {
    errors.push(
      "governance case review decision attestation explanation execution flags drifted"
    );
  }

  const payload = profile.governance_case_review_decision_attestation_explanation;
  if (!isPlainObject(payload)) {
    errors.push(
      "governance case review decision attestation explanation payload missing"
    );
    return { ok: false, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PAYLOAD_FIELDS
    )
  ) {
    errors.push(
      "governance case review decision attestation explanation payload field order drifted"
    );
  }
  if (
    payload.stage !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_STAGE ||
    payload.consumer_surface !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_CONSUMER_SURFACE ||
    payload.boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_BOUNDARY
  ) {
    errors.push(
      "governance case review decision attestation explanation payload envelope drifted"
    );
  }
  if (!isPlainObject(payload.attestation_explanation_ref)) {
    errors.push(
      "governance case review decision attestation explanation ref missing"
    );
  }
  if (!isPlainObject(payload.explanation_context)) {
    errors.push(
      "governance case review decision attestation explanation context missing"
    );
  }
  if (!isPlainObject(payload.validation_exports)) {
    errors.push(
      "governance case review decision attestation explanation validation exports missing"
    );
  }
  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push(
      "governance case review decision attestation explanation preserved semantics missing"
    );
  }
  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const explanationRef = payload.attestation_explanation_ref;
  const explanationContext = payload.explanation_context;
  const validationExports = payload.validation_exports;
  const preservedSemantics = payload.preserved_semantics;

  for (const field of [
    "explanation_id",
    "case_id",
    "review_decision_id",
    "attestation_id",
    "current_selection_id",
    "selection_explanation_id",
    "selection_receipt_id",
    "applicability_id",
    "applicability_explanation_id",
  ]) {
    if (
      typeof explanationRef[field] !== "string" ||
      explanationRef[field].length === 0
    ) {
      errors.push(
        `governance case review decision attestation explanation ref ${field} is required`
      );
    }
  }
  if (
    explanationContext.explanation_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_STATUS_AVAILABLE ||
    explanationContext.explanation_scope !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_SCOPE_CURRENT_ATTESTATION
  ) {
    errors.push(
      "governance case review decision attestation explanation scope or status drifted"
    );
  }
  if (
    typeof explanationContext.continuity_status !== "string" ||
    typeof explanationContext.supersession_status !== "string"
  ) {
    errors.push(
      "governance case review decision attestation explanation continuity or supersession status is required"
    );
  }
  if (!isPlainObject(explanationContext.attestation_basis)) {
    errors.push(
      "governance case review decision attestation explanation attestation_basis must be an object"
    );
  }
  if (!isPlainObject(explanationContext.explanation_basis)) {
    errors.push(
      "governance case review decision attestation explanation explanation_basis must be an object"
    );
  } else if (
    !ensureKnownReasonCodes(
      explanationContext.explanation_basis.explanation_reason_codes,
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_REASON_CODE_ALLOWLIST
    ) ||
    !hasUniqueStrings(
      explanationContext.explanation_basis.explanation_reason_codes
    )
  ) {
    errors.push(
      "governance case review decision attestation explanation reason codes drifted"
    );
  }
  if (
    explanationContext.artifact_version !==
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_EXPLANATION_PROFILE_VERSION
  ) {
    errors.push(
      "governance case review decision attestation explanation artifact_version drifted"
    );
  }
  for (const field of [
    "attestation_available",
    "selection_explanation_final_acceptance_available",
    "selection_receipt_final_acceptance_available",
    "applicability_profile_available",
    "applicability_explanation_profile_available",
    "export_surface_available",
  ]) {
    if (validationExports[field] !== true) {
      errors.push(
        `governance case review decision attestation explanation validation export drifted: ${field}`
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
    if (preservedSemantics[field] !== true) {
      errors.push(
        `governance case review decision attestation explanation preserved semantic drifted: ${field}`
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
  ]) {
    if (preservedSemantics[field] !== false) {
      errors.push(
        `governance case review decision attestation explanation preserved semantic drifted: ${field}`
      );
    }
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionAttestationExplanationProfile(
  profile
) {
  const validation =
    validateGovernanceCaseReviewDecisionAttestationExplanationProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `governance case review decision attestation explanation profile invalid: ${validation.errors.join(
      "; "
    )}`
  );
  err.validation = validation;
  throw err;
}
