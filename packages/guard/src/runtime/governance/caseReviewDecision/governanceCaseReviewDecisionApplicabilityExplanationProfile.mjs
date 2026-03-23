import {
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_READY,
  assertValidGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary,
} from "./governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_CODE_ALLOWLIST,
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_STATUS_APPLICABLE,
  assertValidGovernanceCaseReviewDecisionApplicabilityProfile,
} from "./governanceCaseReviewDecisionApplicabilityProfile.mjs";
import { assertValidGovernanceCaseReviewDecisionProfile } from "./governanceCaseReviewDecisionProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_KIND =
  "governance_case_review_decision_applicability_explanation_profile";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_SCHEMA_ID =
  "mindforge/governance-case-review-decision-applicability-explanation-profile/v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_STAGE =
  "governance_case_review_decision_applicability_explanation_boundary_phase2_v6_0_0";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_CONSUMER_SURFACE =
  "guard.audit.governance_case_review_decision_applicability_explanation";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_BOUNDARY =
  "governance_case_review_decision_applicability_explanation_boundary_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_STATUS_AVAILABLE =
  "available";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_SELECTED_CURRENT_REVIEW_DECISION_APPLICABLE =
  "selected_current_review_decision_applicable";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_APPLICABILITY_PROFILE_ALIGNED =
  "applicability_profile_aligned";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_CURRENT_SELECTION_FINAL_ACCEPTANCE_READY =
  "current_selection_final_acceptance_ready";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_SAME_CASE_BOUNDED =
  "same_case_id_bounded";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_SAME_CANONICAL_ACTION_HASH_BOUNDED =
  "same_canonical_action_hash_bounded";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_REVIEW_DECISION_PROFILE_PRESENT =
  "review_decision_profile_present";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_NON_SUPERSEDED_REVIEW_DECISION =
  "non_superseded_review_decision";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_SUPPORTING_ARTIFACT_ONLY_PRESERVED =
  "supporting_artifact_only_preserved";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_CODES =
  Object.freeze([
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_SELECTED_CURRENT_REVIEW_DECISION_APPLICABLE,
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_APPLICABILITY_PROFILE_ALIGNED,
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_CURRENT_SELECTION_FINAL_ACCEPTANCE_READY,
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_SAME_CASE_BOUNDED,
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_SAME_CANONICAL_ACTION_HASH_BOUNDED,
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_REVIEW_DECISION_PROFILE_PRESENT,
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_NON_SUPERSEDED_REVIEW_DECISION,
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_SUPPORTING_ARTIFACT_ONLY_PRESERVED,
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_CODE_ALLOWLIST =
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_CODES;
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_TOP_LEVEL_FIELDS =
  Object.freeze([
    "kind",
    "version",
    "schema_id",
    "canonical_action_hash",
    "governance_case_review_decision_applicability_explanation",
    "deterministic",
    "enforcing",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PAYLOAD_FIELDS =
  Object.freeze([
    "stage",
    "consumer_surface",
    "boundary",
    "applicability_explanation_ref",
    "explanation_context",
    "validation_exports",
    "preserved_semantics",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_STABLE_EXPORT_SET =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_KIND",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_SCHEMA_ID",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_STAGE",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_CONSUMER_SURFACE",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_BOUNDARY",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_STATUS_AVAILABLE",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_SELECTED_CURRENT_REVIEW_DECISION_APPLICABLE",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_APPLICABILITY_PROFILE_ALIGNED",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_CURRENT_SELECTION_FINAL_ACCEPTANCE_READY",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_SAME_CASE_BOUNDED",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_SAME_CANONICAL_ACTION_HASH_BOUNDED",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_REVIEW_DECISION_PROFILE_PRESENT",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_NON_SUPERSEDED_REVIEW_DECISION",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_SUPPORTING_ARTIFACT_ONLY_PRESERVED",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_CODES",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_CODE_ALLOWLIST",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_TOP_LEVEL_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PAYLOAD_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_STABLE_EXPORT_SET",
    "buildGovernanceCaseReviewDecisionApplicabilityExplanationProfile",
    "validateGovernanceCaseReviewDecisionApplicabilityExplanationProfile",
    "assertValidGovernanceCaseReviewDecisionApplicabilityExplanationProfile",
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

function assertApplicabilityExplanationSupport({
  selectionFinalAcceptanceBoundary,
  applicabilityProfile,
}) {
  const acceptance =
    selectionFinalAcceptanceBoundary.governance_case_review_decision_current_selection_final_acceptance;
  const scope = acceptance.acceptance_scope;
  const finalContract = acceptance.final_acceptance_contract;
  const applicabilityPayload =
    applicabilityProfile.governance_case_review_decision_applicability;
  const applicabilityContext = applicabilityPayload.applicability_context;
  const applicabilitySemantics = applicabilityPayload.preserved_semantics;

  if (
    finalContract.readiness_level !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_READY
  ) {
    throw new Error(
      "governance case review decision applicability explanation requires current selection final acceptance readiness"
    );
  }
  if (scope.selection_status !== "selected") {
    throw new Error(
      "governance case review decision applicability explanation only supports selected current selection"
    );
  }
  if (
    applicabilityContext.applicability_status !==
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_STATUS_APPLICABLE
  ) {
    throw new Error(
      "governance case review decision applicability explanation requires applicable applicability profile"
    );
  }
  if (
    applicabilitySemantics.supporting_artifact_only !== true ||
    applicabilitySemantics.recommendation_only !== true ||
    applicabilitySemantics.additive_only !== true ||
    applicabilitySemantics.non_executing !== true ||
    applicabilitySemantics.default_off !== true ||
    applicabilitySemantics.judgment_source_enabled !== false ||
    applicabilitySemantics.authority_source_enabled !== false ||
    applicabilitySemantics.selection_feedback_enabled !== false ||
    applicabilitySemantics.main_path_takeover !== false
  ) {
    throw new Error(
      "governance case review decision applicability explanation requires applicability profile to remain additive-only, non-executing, default-off, and non-takeover"
    );
  }
}

export function buildGovernanceCaseReviewDecisionApplicabilityExplanationProfile({
  governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary,
  governanceCaseReviewDecisionApplicabilityProfile,
  governanceCaseReviewDecisionProfiles,
}) {
  const selectionFinalAcceptance =
    assertValidGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary(
      governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary
    );
  const applicabilityProfile =
    assertValidGovernanceCaseReviewDecisionApplicabilityProfile(
      governanceCaseReviewDecisionApplicabilityProfile
    );
  if (
    !Array.isArray(governanceCaseReviewDecisionProfiles) ||
    governanceCaseReviewDecisionProfiles.length === 0
  ) {
    throw new Error(
      "governance case review decision applicability explanation requires review decision profiles"
    );
  }
  const reviewProfiles = governanceCaseReviewDecisionProfiles.map((profile) =>
    assertValidGovernanceCaseReviewDecisionProfile(profile)
  );
  assertApplicabilityExplanationSupport({
    selectionFinalAcceptanceBoundary: selectionFinalAcceptance,
    applicabilityProfile,
  });

  const acceptance =
    selectionFinalAcceptance.governance_case_review_decision_current_selection_final_acceptance;
  const selectionRef = acceptance.current_selection_profile_ref;
  const applicabilityPayload =
    applicabilityProfile.governance_case_review_decision_applicability;
  const applicabilityRef = applicabilityPayload.applicability_ref;
  const applicabilityContext = applicabilityPayload.applicability_context;

  if (
    applicabilityRef.case_id !== selectionRef.case_id ||
    applicabilityRef.current_review_decision_id !==
      selectionRef.current_review_decision_id ||
    applicabilityProfile.canonical_action_hash !==
      selectionFinalAcceptance.canonical_action_hash
  ) {
    throw new Error(
      "governance case review decision applicability explanation mismatch: applicability profile must remain aligned to current selection final acceptance"
    );
  }

  const selectedReviewDecisionProfile = reviewProfiles.find((profile) => {
    const context = profile.governance_case_review_decision.review_decision_context;
    return (
      context.case_id === selectionRef.case_id &&
      context.review_decision_id === selectionRef.current_review_decision_id &&
      profile.canonical_action_hash === selectionFinalAcceptance.canonical_action_hash
    );
  });

  if (!selectedReviewDecisionProfile) {
    throw new Error(
      "governance case review decision applicability explanation mismatch: selected review decision profile is required"
    );
  }

  const reviewDecisionContext =
    selectedReviewDecisionProfile.governance_case_review_decision.review_decision_context;
  if (
    reviewDecisionContext.continuity_mode === "superseded" ||
    reviewDecisionContext.superseded_by_review_decision_id !== null
  ) {
    throw new Error(
      "governance case review decision applicability explanation unsupported state: superseded review decisions cannot receive applicability explanation artifacts"
    );
  }

  const explanationReasonCodes =
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_CODE_ALLOWLIST.filter(
      (code) =>
        [
          GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_SELECTED_CURRENT_REVIEW_DECISION_APPLICABLE,
          GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_APPLICABILITY_PROFILE_ALIGNED,
          GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_CURRENT_SELECTION_FINAL_ACCEPTANCE_READY,
          GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_SAME_CASE_BOUNDED,
          GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_SAME_CANONICAL_ACTION_HASH_BOUNDED,
          GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_REVIEW_DECISION_PROFILE_PRESENT,
          GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_NON_SUPERSEDED_REVIEW_DECISION,
          GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_SUPPORTING_ARTIFACT_ONLY_PRESERVED,
        ].includes(code)
    );

  return {
    kind:
      GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_KIND,
    version:
      GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_VERSION,
    schema_id:
      GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_SCHEMA_ID,
    canonical_action_hash: applicabilityProfile.canonical_action_hash,
    governance_case_review_decision_applicability_explanation: {
      stage:
        GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_STAGE,
      consumer_surface:
        GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_CONSUMER_SURFACE,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_BOUNDARY,
      applicability_explanation_ref: {
        case_id: applicabilityRef.case_id,
        selection_status: applicabilityRef.selection_status,
        current_review_decision_id: applicabilityRef.current_review_decision_id,
        applicability_status: applicabilityContext.applicability_status,
      },
      explanation_context: {
        explanation_status:
          GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_STATUS_AVAILABLE,
        current_review_decision_id: reviewDecisionContext.review_decision_id,
        applicability_status: applicabilityContext.applicability_status,
        review_status: reviewDecisionContext.review_status,
        evidence_sufficiency: reviewDecisionContext.evidence_sufficiency,
        review_decision_sequence: reviewDecisionContext.review_decision_sequence,
        continuity_mode: reviewDecisionContext.continuity_mode,
        supersedes_review_decision_id:
          reviewDecisionContext.supersedes_review_decision_id,
        applicability_reason_codes: Object.freeze([
          ...applicabilityContext.applicability_reason_codes,
        ]),
        explanation_reason_codes: Object.freeze(explanationReasonCodes),
      },
      validation_exports: {
        current_selection_final_acceptance_available: true,
        applicability_profile_available: true,
        selected_review_decision_profile_available: true,
        export_surface_available: true,
      },
      preserved_semantics: {
        supporting_artifact_only: true,
        recommendation_only: true,
        additive_only: true,
        non_executing: true,
        default_off: true,
        applicability_scoring: false,
        applicability_ranking: false,
        reselection_enabled: false,
        judgment_source_enabled: false,
        authority_source_enabled: false,
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

export function validateGovernanceCaseReviewDecisionApplicabilityExplanationProfile(
  profile
) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: [
        "governance case review decision applicability explanation profile must be an object",
      ],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_TOP_LEVEL_FIELDS
    )
  ) {
    errors.push(
      "governance case review decision applicability explanation top-level field order drifted"
    );
  }
  if (
    profile.kind !==
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_KIND
  ) {
    errors.push(
      "governance case review decision applicability explanation kind drifted"
    );
  }
  if (
    profile.version !==
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_VERSION
  ) {
    errors.push(
      "governance case review decision applicability explanation version drifted"
    );
  }
  if (
    profile.schema_id !==
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_SCHEMA_ID
  ) {
    errors.push(
      "governance case review decision applicability explanation schema drifted"
    );
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push(
      "governance case review decision applicability explanation canonical_action_hash is required"
    );
  }
  if (profile.deterministic !== true || profile.enforcing !== false) {
    errors.push(
      "governance case review decision applicability explanation execution flags drifted"
    );
  }
  const payload =
    profile.governance_case_review_decision_applicability_explanation;
  if (!isPlainObject(payload)) {
    errors.push(
      "governance case review decision applicability explanation payload missing"
    );
    return { ok: false, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PAYLOAD_FIELDS
    )
  ) {
    errors.push(
      "governance case review decision applicability explanation payload field order drifted"
    );
  }
  if (
    payload.stage !==
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_STAGE
  ) {
    errors.push(
      "governance case review decision applicability explanation stage drifted"
    );
  }
  if (
    payload.consumer_surface !==
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_CONSUMER_SURFACE
  ) {
    errors.push(
      "governance case review decision applicability explanation consumer surface drifted"
    );
  }
  if (
    payload.boundary !==
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_PROFILE_BOUNDARY
  ) {
    errors.push(
      "governance case review decision applicability explanation boundary drifted"
    );
  }
  if (!isPlainObject(payload.applicability_explanation_ref)) {
    errors.push(
      "governance case review decision applicability explanation ref missing"
    );
  }
  if (!isPlainObject(payload.explanation_context)) {
    errors.push(
      "governance case review decision applicability explanation context missing"
    );
  }
  if (!isPlainObject(payload.validation_exports)) {
    errors.push(
      "governance case review decision applicability explanation validation exports missing"
    );
  }
  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push(
      "governance case review decision applicability explanation preserved semantics missing"
    );
  }
  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const explanationRef = payload.applicability_explanation_ref;
  const explanationContext = payload.explanation_context;
  const validationExports = payload.validation_exports;
  const preservedSemantics = payload.preserved_semantics;

  if (explanationRef.selection_status !== "selected") {
    errors.push(
      "governance case review decision applicability explanation only supports selected current selection"
    );
  }
  if (
    explanationRef.applicability_status !==
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_STATUS_APPLICABLE
  ) {
    errors.push(
      "governance case review decision applicability explanation applicability_status drifted"
    );
  }
  for (const field of ["case_id", "current_review_decision_id"]) {
    if (
      typeof explanationRef[field] !== "string" ||
      explanationRef[field].length === 0
    ) {
      errors.push(
        `governance case review decision applicability explanation ref ${field} is required`
      );
    }
  }
  if (
    explanationContext.explanation_status !==
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_STATUS_AVAILABLE
  ) {
    errors.push(
      "governance case review decision applicability explanation status drifted"
    );
  }
  if (
    explanationContext.applicability_status !==
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_STATUS_APPLICABLE
  ) {
    errors.push(
      "governance case review decision applicability explanation applicability_status drifted"
    );
  }
  if (
    typeof explanationContext.current_review_decision_id !== "string" ||
    explanationContext.current_review_decision_id.length === 0
  ) {
    errors.push(
      "governance case review decision applicability explanation current_review_decision_id is required"
    );
  }
  if (
    !ensureKnownReasonCodes(
      explanationContext.applicability_reason_codes,
      GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_CODE_ALLOWLIST
    ) ||
    explanationContext.applicability_reason_codes.length === 0
  ) {
    errors.push(
      "governance case review decision applicability explanation applicability reason codes drifted"
    );
  }
  if (
    !ensureKnownReasonCodes(
      explanationContext.explanation_reason_codes,
      GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_CODE_ALLOWLIST
    ) ||
    !hasUniqueStrings(explanationContext.explanation_reason_codes) ||
    JSON.stringify(explanationContext.explanation_reason_codes) !==
      JSON.stringify(
        GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_REASON_CODE_ALLOWLIST.filter(
          (code) => explanationContext.explanation_reason_codes.includes(code)
        )
      )
  ) {
    errors.push(
      "governance case review decision applicability explanation reason codes drifted"
    );
  }
  for (const field of [
    "current_selection_final_acceptance_available",
    "applicability_profile_available",
    "selected_review_decision_profile_available",
    "export_surface_available",
  ]) {
    if (validationExports[field] !== true) {
      errors.push(
        `governance case review decision applicability explanation validation export drifted: ${field}`
      );
    }
  }
  for (const field of [
    "supporting_artifact_only",
    "recommendation_only",
    "additive_only",
    "non_executing",
    "default_off",
  ]) {
    if (preservedSemantics[field] !== true) {
      errors.push(
        `governance case review decision applicability explanation preserved semantic drifted: ${field}`
      );
    }
  }
  for (const field of [
    "applicability_scoring",
    "applicability_ranking",
    "reselection_enabled",
    "judgment_source_enabled",
    "authority_source_enabled",
    "selection_feedback_enabled",
    "main_path_takeover",
    "authority_scope_expansion",
    "governance_object_addition",
    "risk_integration",
    "ui_control_plane",
  ]) {
    if (preservedSemantics[field] !== false) {
      errors.push(
        `governance case review decision applicability explanation preserved semantic drifted: ${field}`
      );
    }
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionApplicabilityExplanationProfile(
  profile
) {
  const validation =
    validateGovernanceCaseReviewDecisionApplicabilityExplanationProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `governance case review decision applicability explanation profile invalid: ${validation.errors.join(
      "; "
    )}`
  );
  err.validation = validation;
  throw err;
}
