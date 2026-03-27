import {
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_STATUS_ATTESTED,
  assertValidGovernanceCaseReviewDecisionAttestationProfile,
} from "./governanceCaseReviewDecisionAttestationProfile.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_STATUS_APPLICABLE,
  assertValidGovernanceCaseReviewDecisionApplicabilityProfile,
} from "./governanceCaseReviewDecisionApplicabilityProfile.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_STATUS_AVAILABLE,
  assertValidGovernanceCaseReviewDecisionApplicabilityExplanationProfile,
} from "./governanceCaseReviewDecisionApplicabilityExplanationProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_PROFILE_KIND =
  "governance_case_review_decision_attestation_applicability_closure_profile";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_PROFILE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_PROFILE_SCHEMA_ID =
  "mindforge/governance-case-review-decision-attestation-applicability-closure-profile/v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_PROFILE_STAGE =
  "governance_case_review_decision_attestation_applicability_closure_boundary_phase1_v6_5_0";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_CONSUMER_SURFACE =
  "guard.audit.governance_case_review_decision_attestation_applicability_closure";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_PROFILE_BOUNDARY =
  "governance_case_review_decision_attestation_applicability_closure_boundary_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_STATUS_CLOSED =
  "closed";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_SCOPE_CURRENT_ATTESTATION =
  "current_attestation_applicability_closure_only";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_REASON_CODES =
  Object.freeze([
    "attestation_available",
    "applicability_available",
    "applicability_explanation_available",
    "current_selection_aligned",
    "selection_explanation_linked",
    "selection_receipt_linked",
    "applicability_linked",
    "applicability_explanation_linked",
    "continuity_chain_current",
    "supporting_linkage_bounded",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_REASON_CODE_ALLOWLIST =
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_REASON_CODES;
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_TOP_LEVEL_FIELDS =
  Object.freeze([
    "kind",
    "version",
    "schema_id",
    "canonical_action_hash",
    "governance_case_review_decision_attestation_applicability_closure",
    "deterministic",
    "enforcing",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_PAYLOAD_FIELDS =
  Object.freeze([
    "stage",
    "consumer_surface",
    "boundary",
    "attestation_applicability_closure_ref",
    "closure_context",
    "validation_exports",
    "preserved_semantics",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_STABLE_EXPORT_SET =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_PROFILE_KIND",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_PROFILE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_PROFILE_SCHEMA_ID",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_PROFILE_STAGE",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_CONSUMER_SURFACE",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_PROFILE_BOUNDARY",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_STATUS_CLOSED",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_SCOPE_CURRENT_ATTESTATION",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_REASON_CODES",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_REASON_CODE_ALLOWLIST",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_TOP_LEVEL_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_PAYLOAD_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_STABLE_EXPORT_SET",
    "buildGovernanceCaseReviewDecisionAttestationApplicabilityClosureProfile",
    "validateGovernanceCaseReviewDecisionAttestationApplicabilityClosureProfile",
    "assertValidGovernanceCaseReviewDecisionAttestationApplicabilityClosureProfile",
  ]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function ensureKnownReasonCodes(codes) {
  return Array.isArray(codes) && new Set(codes).size === codes.length && codes.every((code) => GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_REASON_CODE_ALLOWLIST.includes(code));
}

function assertAligned(attestationRef, applicabilityRef, explanationRef, hashes) {
  if (
    attestationRef.case_id !== applicabilityRef.case_id ||
    attestationRef.case_id !== explanationRef.case_id
  ) {
    throw new Error("governance case review decision attestation applicability closure mismatch: case_id");
  }
  if (
    attestationRef.review_decision_id !== applicabilityRef.current_review_decision_id ||
    attestationRef.review_decision_id !== explanationRef.current_review_decision_id
  ) {
    throw new Error("governance case review decision attestation applicability closure mismatch: current_review_decision_id");
  }
  if (new Set(hashes).size !== 1) {
    throw new Error("governance case review decision attestation applicability closure mismatch: canonical_action_hash");
  }
}

export function buildGovernanceCaseReviewDecisionAttestationApplicabilityClosureProfile({
  governanceCaseReviewDecisionAttestationProfile,
  governanceCaseReviewDecisionApplicabilityProfile,
  governanceCaseReviewDecisionApplicabilityExplanationProfile,
}) {
  const attestationProfile = assertValidGovernanceCaseReviewDecisionAttestationProfile(
    governanceCaseReviewDecisionAttestationProfile
  );
  const applicabilityProfile = assertValidGovernanceCaseReviewDecisionApplicabilityProfile(
    governanceCaseReviewDecisionApplicabilityProfile
  );
  const applicabilityExplanationProfile =
    assertValidGovernanceCaseReviewDecisionApplicabilityExplanationProfile(
      governanceCaseReviewDecisionApplicabilityExplanationProfile
    );

  const attestationPayload = attestationProfile.governance_case_review_decision_attestation;
  const applicabilityPayload = applicabilityProfile.governance_case_review_decision_applicability;
  const explanationPayload =
    applicabilityExplanationProfile.governance_case_review_decision_applicability_explanation;
  const attestationRef = attestationPayload.attestation_ref;
  const applicabilityRef = applicabilityPayload.applicability_ref;
  const explanationRef = explanationPayload.applicability_explanation_ref;
  const attestationBasis = attestationPayload.attestation_context.attestation_basis;

  if (attestationPayload.attestation_context.attestation_status !== GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_STATUS_ATTESTED) {
    throw new Error("governance case review decision attestation applicability closure requires attestation current view");
  }
  if (
    attestationPayload.attestation_context.continuity_status === "superseded" ||
    attestationPayload.attestation_context.supersession_status === "superseded" ||
    attestationBasis.continuity_chain_intact !== true
  ) {
    throw new Error("governance case review decision attestation applicability closure unsupported state: broken continuity");
  }
  if (
    applicabilityPayload.applicability_context.applicability_status !== GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_STATUS_APPLICABLE
  ) {
    throw new Error("governance case review decision attestation applicability closure requires applicability availability");
  }
  if (
    explanationPayload.explanation_context.explanation_status !== GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_STATUS_AVAILABLE
  ) {
    throw new Error("governance case review decision attestation applicability closure requires applicability explanation availability");
  }
  if (
    attestationBasis.selection_explanation_linked !== true ||
    attestationBasis.selection_receipt_linked !== true ||
    attestationBasis.applicability_linked !== true ||
    attestationBasis.applicability_explanation_linked !== true
  ) {
    throw new Error("governance case review decision attestation applicability closure requires bounded supporting linkage");
  }

  assertAligned(attestationRef, applicabilityRef, explanationRef, [
    attestationProfile.canonical_action_hash,
    applicabilityProfile.canonical_action_hash,
    applicabilityExplanationProfile.canonical_action_hash,
  ]);

  return {
    kind:
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_PROFILE_KIND,
    version:
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_PROFILE_VERSION,
    schema_id:
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_PROFILE_SCHEMA_ID,
    canonical_action_hash: attestationProfile.canonical_action_hash,
    governance_case_review_decision_attestation_applicability_closure: {
      stage:
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_PROFILE_STAGE,
      consumer_surface:
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_CONSUMER_SURFACE,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_PROFILE_BOUNDARY,
      attestation_applicability_closure_ref: {
        closure_id: `${attestationRef.attestation_id}:applicability_closure`,
        case_id: attestationRef.case_id,
        review_decision_id: attestationRef.review_decision_id,
        attestation_id: attestationRef.attestation_id,
        applicability_id: attestationRef.applicability_id,
        applicability_explanation_id: attestationRef.applicability_explanation_id,
        current_selection_id: attestationRef.current_selection_id,
        selection_explanation_id: attestationRef.selection_explanation_id,
        selection_receipt_id: attestationRef.selection_receipt_id,
      },
      closure_context: {
        closure_status:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_STATUS_CLOSED,
        continuity_status: attestationPayload.attestation_context.continuity_status,
        supersession_status:
          attestationPayload.attestation_context.supersession_status,
        attestation_basis: Object.freeze({ ...attestationBasis }),
        applicability_reason_codes: Object.freeze([
          ...applicabilityPayload.applicability_context.applicability_reason_codes,
        ]),
        applicability_explanation_reason_codes: Object.freeze([
          ...explanationPayload.explanation_context.explanation_reason_codes,
        ]),
        closure_scope:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_SCOPE_CURRENT_ATTESTATION,
        closure_basis: Object.freeze({
          closure_reason_codes: Object.freeze([
            ...GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_REASON_CODES,
          ]),
          attestation_available: true,
          applicability_available: true,
          applicability_explanation_available: true,
          current_attestation_aligned: true,
          current_selection_aligned: true,
          selection_explanation_linked: true,
          selection_receipt_linked: true,
          applicability_aligned: true,
          applicability_explanation_aligned: true,
          continuity_chain_current: true,
          supporting_linkage_bounded: true,
          derived_only: true,
          supporting_artifact_only: true,
          non_authoritative: true,
          non_authoritative_support_only: true,
          closure_linkage_only: true,
          aggregate_export_only: true,
          permit_aggregate_export_only: true,
        }),
        artifact_version:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_PROFILE_VERSION,
      },
      validation_exports: {
        attestation_available: true,
        applicability_available: true,
        applicability_explanation_available: true,
        export_surface_available: true,
        unique_current_attestation_view_required: true,
        applicability_alignment_required: true,
        applicability_explanation_alignment_required: true,
        continuity_chain_intact_required: true,
        broken_continuity_rejected: true,
        cross_case_binding_rejected: true,
        cross_review_decision_binding_rejected: true,
        cross_canonical_action_hash_binding_rejected: true,
        complete_supporting_linkage_required: true,
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
        observability_platform_behavior: false,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateGovernanceCaseReviewDecisionAttestationApplicabilityClosureProfile(
  profile
) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return { ok: false, errors: ["governance case review decision attestation applicability closure profile must be an object"] };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_TOP_LEVEL_FIELDS
    )
  ) {
    errors.push("governance case review decision attestation applicability closure top-level field order drifted");
  }
  const payload = profile.governance_case_review_decision_attestation_applicability_closure;
  if (!isPlainObject(payload)) {
    errors.push("governance case review decision attestation applicability closure payload missing");
    return { ok: false, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_PAYLOAD_FIELDS
    )
  ) {
    errors.push("governance case review decision attestation applicability closure payload field order drifted");
  }
  if (
    payload.closure_context.closure_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_STATUS_CLOSED ||
    payload.closure_context.closure_scope !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_SCOPE_CURRENT_ATTESTATION
  ) {
    errors.push("governance case review decision attestation applicability closure scope or status drifted");
  }
  if (
    !ensureKnownReasonCodes(
      payload.closure_context.closure_basis.closure_reason_codes
    )
  ) {
    errors.push("governance case review decision attestation applicability closure reason codes drifted");
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionAttestationApplicabilityClosureProfile(
  profile
) {
  const validation =
    validateGovernanceCaseReviewDecisionAttestationApplicabilityClosureProfile(
      profile
    );
  if (validation.ok) return profile;
  const err = new Error(
    `governance case review decision attestation applicability closure profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
