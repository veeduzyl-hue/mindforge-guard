import {
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_READY,
  assertValidGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary,
} from "./governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_READY,
  assertValidGovernanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary,
} from "./governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_READY,
  assertValidGovernanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary,
} from "./governanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_STATUS_APPLICABLE,
  assertValidGovernanceCaseReviewDecisionApplicabilityProfile,
} from "./governanceCaseReviewDecisionApplicabilityProfile.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_STATUS_AVAILABLE,
  assertValidGovernanceCaseReviewDecisionApplicabilityExplanationProfile,
} from "./governanceCaseReviewDecisionApplicabilityExplanationProfile.mjs";
import { assertValidGovernanceCaseReviewDecisionProfile } from "./governanceCaseReviewDecisionProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_KIND =
  "governance_case_review_decision_attestation_profile";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_VERSION = "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_SCHEMA_ID =
  "mindforge/governance-case-review-decision-attestation-profile/v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_STAGE =
  "governance_case_review_decision_attestation_boundary_phase1_v6_1_0";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONSUMER_SURFACE =
  "guard.audit.governance_case_review_decision_attestation";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_BOUNDARY =
  "governance_case_review_decision_attestation_boundary_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_STATUS_ATTESTED =
  "attested_current_view";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_CURRENT_SELECTION_READY =
  "current_selection_final_acceptance_ready";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_SELECTION_EXPLANATION_LINKED =
  "selection_explanation_linked";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_SELECTION_RECEIPT_LINKED =
  "selection_receipt_linked";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_APPLICABILITY_LINKED =
  "applicability_linked";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_APPLICABILITY_EXPLANATION_LINKED =
  "applicability_explanation_linked";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_CONTINUITY_GROUNDED =
  "continuity_grounded";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_SUPERSESSION_GROUNDED =
  "supersession_grounded";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_NON_SUPERSEDED_CURRENT_VIEW =
  "non_superseded_current_view";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_CODES =
  Object.freeze([
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_CURRENT_SELECTION_READY,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_SELECTION_EXPLANATION_LINKED,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_SELECTION_RECEIPT_LINKED,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_APPLICABILITY_LINKED,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_APPLICABILITY_EXPLANATION_LINKED,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_CONTINUITY_GROUNDED,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_SUPERSESSION_GROUNDED,
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_NON_SUPERSEDED_CURRENT_VIEW,
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_CODE_ALLOWLIST =
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_CODES;
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TOP_LEVEL_FIELDS =
  Object.freeze([
    "kind",
    "version",
    "schema_id",
    "canonical_action_hash",
    "governance_case_review_decision_attestation",
    "deterministic",
    "enforcing",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PAYLOAD_FIELDS =
  Object.freeze([
    "stage",
    "consumer_surface",
    "boundary",
    "attestation_ref",
    "attestation_context",
    "validation_exports",
    "preserved_semantics",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_STABLE_EXPORT_SET =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_KIND",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_SCHEMA_ID",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_STAGE",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONSUMER_SURFACE",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_BOUNDARY",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_STATUS_ATTESTED",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_CURRENT_SELECTION_READY",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_SELECTION_EXPLANATION_LINKED",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_SELECTION_RECEIPT_LINKED",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_APPLICABILITY_LINKED",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_APPLICABILITY_EXPLANATION_LINKED",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_CONTINUITY_GROUNDED",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_SUPERSESSION_GROUNDED",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_NON_SUPERSEDED_CURRENT_VIEW",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_CODES",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_CODE_ALLOWLIST",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TOP_LEVEL_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PAYLOAD_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_STABLE_EXPORT_SET",
    "buildGovernanceCaseReviewDecisionAttestationProfile",
    "validateGovernanceCaseReviewDecisionAttestationProfile",
    "assertValidGovernanceCaseReviewDecisionAttestationProfile",
  ]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasUniqueStrings(values) {
  return Array.isArray(values) && new Set(values).size === values.length;
}

function ensureKnownReasonCodes(reasonCodes) {
  return (
    Array.isArray(reasonCodes) &&
    reasonCodes.every((code) =>
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_CODE_ALLOWLIST.includes(
        code
      )
    )
  );
}

function buildDerivedArtifactId(kind, caseId, reviewDecisionId, canonicalActionHash) {
  return `${kind}:${caseId}:${reviewDecisionId}:${canonicalActionHash}`;
}

function deriveSupersessionStatus(reviewDecisionContext) {
  if (reviewDecisionContext.superseded_by_review_decision_id) {
    return "superseded";
  }
  if (reviewDecisionContext.supersedes_review_decision_id) {
    return "superseding";
  }
  return "standalone";
}

function assertPreservedSupportingArtifactSemantics(semantics, label) {
  for (const field of [
    "supporting_artifact_only",
    "recommendation_only",
    "additive_only",
    "non_executing",
    "default_off",
  ]) {
    if (semantics[field] !== true) {
      throw new Error(
        `governance case review decision attestation insufficient support: ${label} must preserve ${field}`
      );
    }
  }
  for (const field of [
    "judgment_source_enabled",
    "authority_source_enabled",
    "selection_feedback_enabled",
    "main_path_takeover",
  ]) {
    if (semantics[field] !== false) {
      throw new Error(
        `governance case review decision attestation insufficient support: ${label} must preserve ${field}=false`
      );
    }
  }
}

function assertAttestationSupport({
  selectionFinalAcceptanceBoundary,
  selectionExplanationFinalAcceptanceBoundary,
  selectionReceiptFinalAcceptanceBoundary,
  applicabilityProfile,
  applicabilityExplanationProfile,
}) {
  const selectionAcceptance =
    selectionFinalAcceptanceBoundary.governance_case_review_decision_current_selection_final_acceptance;
  const selectionExplanationAcceptance =
    selectionExplanationFinalAcceptanceBoundary.governance_case_review_decision_selection_explanation_final_acceptance;
  const selectionReceiptAcceptance =
    selectionReceiptFinalAcceptanceBoundary.governance_case_review_decision_selection_receipt_final_acceptance;
  const applicabilityPayload =
    applicabilityProfile.governance_case_review_decision_applicability;
  const applicabilityExplanationPayload =
    applicabilityExplanationProfile.governance_case_review_decision_applicability_explanation;

  if (
    selectionAcceptance.final_acceptance_contract.readiness_level !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_READY
  ) {
    throw new Error(
      "governance case review decision attestation requires current selection final acceptance readiness"
    );
  }
  if (
    selectionExplanationAcceptance.final_acceptance_contract.readiness_level !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_EXPLANATION_FINAL_ACCEPTANCE_READY
  ) {
    throw new Error(
      "governance case review decision attestation requires selection explanation final acceptance readiness"
    );
  }
  if (
    selectionReceiptAcceptance.final_acceptance_contract.readiness_level !==
    GOVERNANCE_CASE_REVIEW_DECISION_SELECTION_RECEIPT_FINAL_ACCEPTANCE_READY
  ) {
    throw new Error(
      "governance case review decision attestation requires selection receipt final acceptance readiness"
    );
  }
  if (
    selectionAcceptance.acceptance_scope.selection_status !== "selected" ||
    selectionExplanationAcceptance.acceptance_scope.selection_status !== "selected" ||
    selectionReceiptAcceptance.acceptance_scope.selection_status !== "selected"
  ) {
    throw new Error(
      "governance case review decision attestation only supports selected current selection"
    );
  }
  if (
    selectionAcceptance.acceptance_scope.unique_terminal_candidate_preserved !==
      true ||
    selectionAcceptance.acceptance_scope.selected_state_supported !== true
  ) {
    throw new Error(
      "governance case review decision attestation requires uniquely selected current selection"
    );
  }
  if (
    applicabilityPayload.applicability_context.applicability_status !==
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_STATUS_APPLICABLE
  ) {
    throw new Error(
      "governance case review decision attestation requires applicable applicability profile"
    );
  }
  if (
    applicabilityExplanationPayload.explanation_context.explanation_status !==
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_STATUS_AVAILABLE
  ) {
    throw new Error(
      "governance case review decision attestation requires available applicability explanation profile"
    );
  }

  assertPreservedSupportingArtifactSemantics(
    applicabilityPayload.preserved_semantics,
    "applicability profile"
  );
  assertPreservedSupportingArtifactSemantics(
    applicabilityExplanationPayload.preserved_semantics,
    "applicability explanation profile"
  );

  for (const boundary of [
    selectionAcceptance.final_acceptance_contract,
    selectionExplanationAcceptance.final_acceptance_contract,
    selectionReceiptAcceptance.final_acceptance_contract,
  ]) {
    for (const field of [
      "recommendation_only",
      "additive_only",
      "non_executing",
      "default_off",
    ]) {
      if (boundary[field] !== true) {
        throw new Error(
          `governance case review decision attestation requires stable prerequisite field: ${field}`
        );
      }
    }
    for (const field of [
      "judgment_source_enabled",
      "authority_source_enabled",
      "selection_feedback_enabled",
      "main_path_takeover",
    ]) {
      if (field in boundary && boundary[field] !== false) {
        throw new Error(
          `governance case review decision attestation requires stable prerequisite field: ${field}=false`
        );
      }
    }
  }
}

export function buildGovernanceCaseReviewDecisionAttestationProfile({
  governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary,
  governanceCaseReviewDecisionSelectionExplanationFinalAcceptanceBoundary,
  governanceCaseReviewDecisionSelectionReceiptFinalAcceptanceBoundary,
  governanceCaseReviewDecisionApplicabilityProfile,
  governanceCaseReviewDecisionApplicabilityExplanationProfile,
  governanceCaseReviewDecisionProfiles,
}) {
  const selectionFinalAcceptanceBoundary =
    assertValidGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary(
      governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary
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
  if (
    !Array.isArray(governanceCaseReviewDecisionProfiles) ||
    governanceCaseReviewDecisionProfiles.length === 0
  ) {
    throw new Error(
      "governance case review decision attestation requires review decision profiles"
    );
  }
  const reviewProfiles = governanceCaseReviewDecisionProfiles.map((profile) =>
    assertValidGovernanceCaseReviewDecisionProfile(profile)
  );

  assertAttestationSupport({
    selectionFinalAcceptanceBoundary,
    selectionExplanationFinalAcceptanceBoundary,
    selectionReceiptFinalAcceptanceBoundary,
    applicabilityProfile,
    applicabilityExplanationProfile,
  });

  const selectionAcceptance =
    selectionFinalAcceptanceBoundary.governance_case_review_decision_current_selection_final_acceptance;
  const selectionRef = selectionAcceptance.current_selection_profile_ref;
  const selectionExplanationAcceptance =
    selectionExplanationFinalAcceptanceBoundary.governance_case_review_decision_selection_explanation_final_acceptance;
  const selectionExplanationRef =
    selectionExplanationAcceptance.selection_explanation_profile_ref;
  const selectionReceiptAcceptance =
    selectionReceiptFinalAcceptanceBoundary.governance_case_review_decision_selection_receipt_final_acceptance;
  const selectionReceiptRef =
    selectionReceiptAcceptance.selection_receipt_profile_ref;
  const applicabilityPayload =
    applicabilityProfile.governance_case_review_decision_applicability;
  const applicabilityRef = applicabilityPayload.applicability_ref;
  const applicabilityExplanationPayload =
    applicabilityExplanationProfile.governance_case_review_decision_applicability_explanation;
  const applicabilityExplanationRef =
    applicabilityExplanationPayload.applicability_explanation_ref;

  const caseId = selectionRef.case_id;
  const reviewDecisionId = selectionRef.current_review_decision_id;
  const canonicalActionHash = selectionFinalAcceptanceBoundary.canonical_action_hash;

  for (const [label, ref] of [
    ["selection explanation final acceptance", selectionExplanationRef],
    ["selection receipt final acceptance", selectionReceiptRef],
    ["applicability profile", applicabilityRef],
    ["applicability explanation profile", applicabilityExplanationRef],
  ]) {
    if (
      ref.case_id !== caseId ||
      ref.current_review_decision_id !== reviewDecisionId
    ) {
      throw new Error(
        `governance case review decision attestation mismatch: ${label} must remain identity aligned`
      );
    }
  }
  if (
    selectionExplanationFinalAcceptanceBoundary.canonical_action_hash !==
      canonicalActionHash ||
    selectionReceiptFinalAcceptanceBoundary.canonical_action_hash !==
      canonicalActionHash ||
    applicabilityProfile.canonical_action_hash !== canonicalActionHash ||
    applicabilityExplanationProfile.canonical_action_hash !== canonicalActionHash
  ) {
    throw new Error(
      "governance case review decision attestation mismatch: canonical_action_hash must remain aligned across attestation inputs"
    );
  }

  const selectedReviewDecisionProfile = reviewProfiles.find((profile) => {
    const context = profile.governance_case_review_decision.review_decision_context;
    return (
      context.case_id === caseId &&
      context.review_decision_id === reviewDecisionId &&
      profile.canonical_action_hash === canonicalActionHash
    );
  });
  if (!selectedReviewDecisionProfile) {
    throw new Error(
      "governance case review decision attestation mismatch: selected review decision profile is required"
    );
  }

  const reviewDecisionContext =
    selectedReviewDecisionProfile.governance_case_review_decision.review_decision_context;
  if (
    reviewDecisionContext.continuity_mode === "superseded" ||
    reviewDecisionContext.superseded_by_review_decision_id !== null
  ) {
    throw new Error(
      "governance case review decision attestation unsupported state: superseded review decision cannot be attested as current view"
    );
  }

  const attestationId = buildDerivedArtifactId(
    "review_decision_attestation",
    caseId,
    reviewDecisionId,
    canonicalActionHash
  );
  const currentSelectionId = buildDerivedArtifactId(
    "current_selection",
    caseId,
    reviewDecisionId,
    canonicalActionHash
  );
  const selectionReceiptId = buildDerivedArtifactId(
    "selection_receipt",
    caseId,
    reviewDecisionId,
    canonicalActionHash
  );
  const selectionExplanationId = buildDerivedArtifactId(
    "selection_explanation",
    caseId,
    reviewDecisionId,
    canonicalActionHash
  );
  const applicabilityId = buildDerivedArtifactId(
    "applicability",
    caseId,
    reviewDecisionId,
    canonicalActionHash
  );
  const applicabilityExplanationId = buildDerivedArtifactId(
    "applicability_explanation",
    caseId,
    reviewDecisionId,
    canonicalActionHash
  );
  const attestationReasonCodes =
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_CODE_ALLOWLIST.filter(
      (code) =>
        [
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_CURRENT_SELECTION_READY,
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_SELECTION_EXPLANATION_LINKED,
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_SELECTION_RECEIPT_LINKED,
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_APPLICABILITY_LINKED,
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_APPLICABILITY_EXPLANATION_LINKED,
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_CONTINUITY_GROUNDED,
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_SUPERSESSION_GROUNDED,
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_NON_SUPERSEDED_CURRENT_VIEW,
        ].includes(code)
    );

  return {
    kind: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_KIND,
    version: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_VERSION,
    schema_id: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_SCHEMA_ID,
    canonical_action_hash: canonicalActionHash,
    governance_case_review_decision_attestation: {
      stage: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_STAGE,
      consumer_surface: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONSUMER_SURFACE,
      boundary: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_BOUNDARY,
      attestation_ref: {
        attestation_id: attestationId,
        case_id: caseId,
        review_decision_id: reviewDecisionId,
        current_selection_id: currentSelectionId,
        selection_receipt_id: selectionReceiptId,
        selection_explanation_id: selectionExplanationId,
        applicability_id: applicabilityId,
        applicability_explanation_id: applicabilityExplanationId,
      },
      attestation_context: {
        attestation_status:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_STATUS_ATTESTED,
        continuity_status: reviewDecisionContext.continuity_mode,
        supersession_status: deriveSupersessionStatus(reviewDecisionContext),
        attested_scope: Object.freeze({
          attested_current_view_only: true,
          selected_review_decision_only: true,
          continuity_grounded: true,
          supersession_grounded: true,
          additive_support_only: true,
        }),
        attested_at: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_STAGE,
        attestation_basis: Object.freeze({
          attestation_reason_codes: Object.freeze(attestationReasonCodes),
          current_selection_final_acceptance_ready: true,
          selection_receipt_linked: true,
          selection_explanation_linked: true,
          applicability_linked: true,
          applicability_explanation_linked: true,
          continuity_mode: reviewDecisionContext.continuity_mode,
          supersedes_review_decision_id:
            reviewDecisionContext.supersedes_review_decision_id,
        }),
        artifact_version:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_VERSION,
      },
      validation_exports: {
        current_selection_final_acceptance_available: true,
        selection_receipt_final_acceptance_available: true,
        selection_explanation_final_acceptance_available: true,
        applicability_profile_available: true,
        applicability_explanation_profile_available: true,
        selected_review_decision_profile_available: true,
        export_surface_available: true,
      },
      preserved_semantics: {
        derived_only: true,
        supporting_artifact_only: true,
        recommendation_only: true,
        additive_only: true,
        non_executing: true,
        default_off: true,
        judgment_source_enabled: false,
        authority_source_enabled: false,
        execution_binding_enabled: false,
        selection_feedback_enabled: false,
        main_path_takeover: false,
        authority_scope_expansion: false,
        governance_object_addition: false,
        risk_integration: false,
        ui_control_plane: false,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateGovernanceCaseReviewDecisionAttestationProfile(profile) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: ["governance case review decision attestation profile must be an object"],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_TOP_LEVEL_FIELDS)
  ) {
    errors.push(
      "governance case review decision attestation top-level field order drifted"
    );
  }
  if (profile.kind !== GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_KIND) {
    errors.push("governance case review decision attestation kind drifted");
  }
  if (
    profile.version !== GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_VERSION
  ) {
    errors.push("governance case review decision attestation version drifted");
  }
  if (
    profile.schema_id !==
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_SCHEMA_ID
  ) {
    errors.push("governance case review decision attestation schema drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push(
      "governance case review decision attestation canonical_action_hash is required"
    );
  }
  if (profile.deterministic !== true || profile.enforcing !== false) {
    errors.push(
      "governance case review decision attestation execution flags drifted"
    );
  }
  const payload = profile.governance_case_review_decision_attestation;
  if (!isPlainObject(payload)) {
    errors.push("governance case review decision attestation payload missing");
    return { ok: false, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PAYLOAD_FIELDS)
  ) {
    errors.push(
      "governance case review decision attestation payload field order drifted"
    );
  }
  if (payload.stage !== GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_STAGE) {
    errors.push("governance case review decision attestation stage drifted");
  }
  if (
    payload.consumer_surface !==
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CONSUMER_SURFACE
  ) {
    errors.push(
      "governance case review decision attestation consumer surface drifted"
    );
  }
  if (payload.boundary !== GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_BOUNDARY) {
    errors.push("governance case review decision attestation boundary drifted");
  }
  if (!isPlainObject(payload.attestation_ref)) {
    errors.push("governance case review decision attestation ref missing");
  }
  if (!isPlainObject(payload.attestation_context)) {
    errors.push("governance case review decision attestation context missing");
  }
  if (!isPlainObject(payload.validation_exports)) {
    errors.push("governance case review decision attestation validation exports missing");
  }
  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push("governance case review decision attestation preserved semantics missing");
  }
  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const attestationRef = payload.attestation_ref;
  const attestationContext = payload.attestation_context;
  const validationExports = payload.validation_exports;
  const preservedSemantics = payload.preserved_semantics;

  for (const field of [
    "attestation_id",
    "case_id",
    "review_decision_id",
    "current_selection_id",
    "selection_receipt_id",
    "selection_explanation_id",
    "applicability_id",
    "applicability_explanation_id",
  ]) {
    if (
      typeof attestationRef[field] !== "string" ||
      attestationRef[field].length === 0
    ) {
      errors.push(
        `governance case review decision attestation ref ${field} is required`
      );
    }
  }
  if (
    attestationContext.attestation_status !==
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_STATUS_ATTESTED
  ) {
    errors.push("governance case review decision attestation status drifted");
  }
  if (
    typeof attestationContext.continuity_status !== "string" ||
    attestationContext.continuity_status.length === 0
  ) {
    errors.push(
      "governance case review decision attestation continuity_status is required"
    );
  }
  if (
    typeof attestationContext.supersession_status !== "string" ||
    attestationContext.supersession_status.length === 0
  ) {
    errors.push(
      "governance case review decision attestation supersession_status is required"
    );
  }
  if (!isPlainObject(attestationContext.attested_scope)) {
    errors.push(
      "governance case review decision attestation attested_scope must be an object"
    );
  } else {
    for (const field of [
      "attested_current_view_only",
      "selected_review_decision_only",
      "continuity_grounded",
      "supersession_grounded",
      "additive_support_only",
    ]) {
      if (attestationContext.attested_scope[field] !== true) {
        errors.push(
          `governance case review decision attestation scope drifted: ${field}`
        );
      }
    }
  }
  if (
    attestationContext.attested_at !==
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_STAGE
  ) {
    errors.push("governance case review decision attestation attested_at drifted");
  }
  if (!isPlainObject(attestationContext.attestation_basis)) {
    errors.push(
      "governance case review decision attestation attestation_basis must be an object"
    );
  } else {
    if (
      !ensureKnownReasonCodes(
        attestationContext.attestation_basis.attestation_reason_codes
      ) ||
      !hasUniqueStrings(
        attestationContext.attestation_basis.attestation_reason_codes
      ) ||
      JSON.stringify(
        attestationContext.attestation_basis.attestation_reason_codes
      ) !==
        JSON.stringify(
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_REASON_CODE_ALLOWLIST.filter(
            (code) =>
              attestationContext.attestation_basis.attestation_reason_codes.includes(
                code
              )
          )
        )
    ) {
      errors.push(
        "governance case review decision attestation reason codes drifted"
      );
    }
    for (const field of [
      "current_selection_final_acceptance_ready",
      "selection_receipt_linked",
      "selection_explanation_linked",
      "applicability_linked",
      "applicability_explanation_linked",
    ]) {
      if (attestationContext.attestation_basis[field] !== true) {
        errors.push(
          `governance case review decision attestation basis drifted: ${field}`
        );
      }
    }
  }
  if (
    attestationContext.artifact_version !==
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_PROFILE_VERSION
  ) {
    errors.push(
      "governance case review decision attestation artifact_version drifted"
    );
  }
  for (const field of [
    "current_selection_final_acceptance_available",
    "selection_receipt_final_acceptance_available",
    "selection_explanation_final_acceptance_available",
    "applicability_profile_available",
    "applicability_explanation_profile_available",
    "selected_review_decision_profile_available",
    "export_surface_available",
  ]) {
    if (validationExports[field] !== true) {
      errors.push(
        `governance case review decision attestation validation export drifted: ${field}`
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
    if (preservedSemantics[field] !== true) {
      errors.push(
        `governance case review decision attestation preserved semantic drifted: ${field}`
      );
    }
  }
  for (const field of [
    "judgment_source_enabled",
    "authority_source_enabled",
    "execution_binding_enabled",
    "selection_feedback_enabled",
    "main_path_takeover",
    "authority_scope_expansion",
    "governance_object_addition",
    "risk_integration",
    "ui_control_plane",
  ]) {
    if (preservedSemantics[field] !== false) {
      errors.push(
        `governance case review decision attestation preserved semantic drifted: ${field}`
      );
    }
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionAttestationProfile(profile) {
  const validation = validateGovernanceCaseReviewDecisionAttestationProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `governance case review decision attestation profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
