import {
  GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_READY,
  assertValidGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary,
} from "./governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary.mjs";
import {
  assertValidGovernanceCaseReviewDecisionProfile,
} from "./governanceCaseReviewDecisionProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_KIND =
  "governance_case_review_decision_applicability_profile";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_SCHEMA_ID =
  "mindforge/governance-case-review-decision-applicability-profile/v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_STAGE =
  "governance_case_review_decision_applicability_boundary_phase1_v6_0_0";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_CONSUMER_SURFACE =
  "guard.audit.governance_case_review_decision_applicability";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_BOUNDARY =
  "governance_case_review_decision_applicability_boundary_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_STATUS_APPLICABLE =
  "applicable";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_SELECTED_CURRENT_REVIEW_DECISION =
  "selected_current_review_decision";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_CURRENT_SELECTION_FINAL_ACCEPTANCE_READY =
  "current_selection_final_acceptance_ready";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_SAME_CASE_BOUNDED =
  "same_case_id_bounded";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_SAME_CANONICAL_ACTION_HASH_BOUNDED =
  "same_canonical_action_hash_bounded";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_REVIEW_DECISION_PROFILE_PRESENT =
  "review_decision_profile_present";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_REVIEW_DECISION_NOT_SUPERSEDED =
  "review_decision_not_superseded";
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_CODES =
  Object.freeze([
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_SELECTED_CURRENT_REVIEW_DECISION,
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_CURRENT_SELECTION_FINAL_ACCEPTANCE_READY,
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_SAME_CASE_BOUNDED,
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_SAME_CANONICAL_ACTION_HASH_BOUNDED,
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_REVIEW_DECISION_PROFILE_PRESENT,
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_REVIEW_DECISION_NOT_SUPERSEDED,
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_CODE_ALLOWLIST =
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_CODES;
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_TOP_LEVEL_FIELDS =
  Object.freeze([
    "kind",
    "version",
    "schema_id",
    "canonical_action_hash",
    "governance_case_review_decision_applicability",
    "deterministic",
    "enforcing",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PAYLOAD_FIELDS =
  Object.freeze([
    "stage",
    "consumer_surface",
    "boundary",
    "applicability_ref",
    "applicability_context",
    "validation_exports",
    "preserved_semantics",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_STABLE_EXPORT_SET =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_KIND",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_SCHEMA_ID",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_STAGE",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_CONSUMER_SURFACE",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_BOUNDARY",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_STATUS_APPLICABLE",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_SELECTED_CURRENT_REVIEW_DECISION",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_CURRENT_SELECTION_FINAL_ACCEPTANCE_READY",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_SAME_CASE_BOUNDED",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_SAME_CANONICAL_ACTION_HASH_BOUNDED",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_REVIEW_DECISION_PROFILE_PRESENT",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_REVIEW_DECISION_NOT_SUPERSEDED",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_CODES",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_CODE_ALLOWLIST",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_TOP_LEVEL_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PAYLOAD_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_STABLE_EXPORT_SET",
    "buildGovernanceCaseReviewDecisionApplicabilityProfile",
    "validateGovernanceCaseReviewDecisionApplicabilityProfile",
    "assertValidGovernanceCaseReviewDecisionApplicabilityProfile",
  ]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function normalizeOptionalString(value) {
  return value === undefined || value === null ? null : String(value);
}

function ensureKnownReasonCodes(reasonCodes) {
  return (
    Array.isArray(reasonCodes) &&
    reasonCodes.every((code) =>
      GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_CODE_ALLOWLIST.includes(
        code
      )
    )
  );
}

function assertApplicabilitySupport(selectionFinalAcceptanceBoundary) {
  const acceptance =
    selectionFinalAcceptanceBoundary.governance_case_review_decision_current_selection_final_acceptance;
  const scope = acceptance.acceptance_scope;
  const finalContract = acceptance.final_acceptance_contract;

  if (
    finalContract.readiness_level !==
    GOVERNANCE_CASE_REVIEW_DECISION_CURRENT_SELECTION_FINAL_ACCEPTANCE_READY
  ) {
    throw new Error(
      "governance case review decision applicability requires current selection final acceptance readiness"
    );
  }
  if (
    scope.current_selection_boundary_present !== true ||
    scope.current_selection_summary_boundary_present !== true ||
    scope.same_case_id_preserved !== true ||
    scope.same_canonical_action_hash_preserved !== true ||
    scope.superseded_exclusion_preserved !== true ||
    scope.unique_terminal_candidate_preserved !== true ||
    scope.deterministic_output_preserved !== true ||
    scope.selected_state_supported !== true
  ) {
    throw new Error(
      "governance case review decision applicability insufficient support: current selection final acceptance must remain fully bounded"
    );
  }
  if (
    finalContract.additive_only !== true ||
    finalContract.non_executing !== true ||
    finalContract.default_off !== true ||
    finalContract.execution_takeover !== false ||
    finalContract.authority_scope_expansion !== false ||
    finalContract.workflow_engine_emergence !== false
  ) {
    throw new Error(
      "governance case review decision applicability insufficient support: current selection final acceptance must remain additive-only, non-executing, default-off, and non-takeover"
    );
  }
  if (scope.selection_status !== "selected") {
    throw new Error(
      "governance case review decision applicability only supports selected current selection"
    );
  }
}

export function buildGovernanceCaseReviewDecisionApplicabilityProfile({
  governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary,
  governanceCaseReviewDecisionProfiles,
}) {
  const selectionFinalAcceptance =
    assertValidGovernanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary(
      governanceCaseReviewDecisionCurrentSelectionFinalAcceptanceBoundary
    );
  if (
    !Array.isArray(governanceCaseReviewDecisionProfiles) ||
    governanceCaseReviewDecisionProfiles.length === 0
  ) {
    throw new Error(
      "governance case review decision applicability requires review decision profiles"
    );
  }
  const reviewProfiles = governanceCaseReviewDecisionProfiles.map((profile) =>
    assertValidGovernanceCaseReviewDecisionProfile(profile)
  );
  assertApplicabilitySupport(selectionFinalAcceptance);

  const acceptance =
    selectionFinalAcceptance.governance_case_review_decision_current_selection_final_acceptance;
  const selectionRef = acceptance.current_selection_profile_ref;
  const selectionScope = acceptance.acceptance_scope;

  const currentProfile = reviewProfiles.find((profile) => {
    const context = profile.governance_case_review_decision.review_decision_context;
    return (
      context.case_id === selectionRef.case_id &&
      context.review_decision_id === selectionRef.current_review_decision_id &&
      profile.canonical_action_hash === selectionFinalAcceptance.canonical_action_hash
    );
  });

  if (!currentProfile) {
    throw new Error(
      "governance case review decision applicability mismatch: selected review decision profile is required"
    );
  }

  const currentContext =
    currentProfile.governance_case_review_decision.review_decision_context;
  if (
    currentContext.continuity_mode === "superseded" ||
    currentContext.superseded_by_review_decision_id !== null
  ) {
    throw new Error(
      "governance case review decision applicability unsupported state: superseded review decisions cannot become applicability artifacts"
    );
  }

  const reasonCodes =
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_CODE_ALLOWLIST.filter(
      (code) =>
        [
          GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_SELECTED_CURRENT_REVIEW_DECISION,
          GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_CURRENT_SELECTION_FINAL_ACCEPTANCE_READY,
          GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_SAME_CASE_BOUNDED,
          GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_SAME_CANONICAL_ACTION_HASH_BOUNDED,
          GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_REVIEW_DECISION_PROFILE_PRESENT,
          GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_REASON_REVIEW_DECISION_NOT_SUPERSEDED,
        ].includes(code)
    );

  return {
    kind: GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_KIND,
    version: GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_VERSION,
    schema_id: GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_SCHEMA_ID,
    canonical_action_hash: currentProfile.canonical_action_hash,
    governance_case_review_decision_applicability: {
      stage: GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_STAGE,
      consumer_surface: GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_CONSUMER_SURFACE,
      boundary: GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_BOUNDARY,
      applicability_ref: {
        case_id: selectionRef.case_id,
        selection_status: selectionRef.selection_status,
        current_review_decision_id: selectionRef.current_review_decision_id,
      },
      applicability_context: {
        applicability_status:
          GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_STATUS_APPLICABLE,
        applicability_reason_codes: Object.freeze(reasonCodes),
        review_status: currentContext.review_status,
        evidence_sufficiency: currentContext.evidence_sufficiency,
        review_decision_sequence: currentContext.review_decision_sequence,
        continuity_mode: currentContext.continuity_mode,
        supersedes_review_decision_id:
          currentContext.supersedes_review_decision_id,
      },
      validation_exports: {
        current_selection_final_acceptance_available: true,
        selected_review_decision_profile_available: true,
        export_surface_available: true,
      },
      preserved_semantics: {
        supporting_artifact_only: true,
        recommendation_only: true,
        additive_only: true,
        non_executing: true,
        default_off: true,
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

export function validateGovernanceCaseReviewDecisionApplicabilityProfile(profile) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: ["governance case review decision applicability profile must be an object"],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_TOP_LEVEL_FIELDS)
  ) {
    errors.push(
      "governance case review decision applicability profile top-level field order drifted"
    );
  }
  if (profile.kind !== GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_KIND) {
    errors.push("governance case review decision applicability kind drifted");
  }
  if (
    profile.version !== GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_VERSION
  ) {
    errors.push("governance case review decision applicability version drifted");
  }
  if (
    profile.schema_id !== GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_SCHEMA_ID
  ) {
    errors.push("governance case review decision applicability schema drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("governance case review decision applicability canonical_action_hash is required");
  }
  if (profile.deterministic !== true || profile.enforcing !== false) {
    errors.push(
      "governance case review decision applicability execution flags drifted"
    );
  }
  const payload = profile.governance_case_review_decision_applicability;
  if (!isPlainObject(payload)) {
    errors.push("governance case review decision applicability payload missing");
    return { ok: false, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PAYLOAD_FIELDS)
  ) {
    errors.push(
      "governance case review decision applicability payload field order drifted"
    );
  }
  if (payload.stage !== GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_STAGE) {
    errors.push("governance case review decision applicability stage drifted");
  }
  if (
    payload.consumer_surface !==
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_CONSUMER_SURFACE
  ) {
    errors.push(
      "governance case review decision applicability consumer surface drifted"
    );
  }
  if (payload.boundary !== GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_PROFILE_BOUNDARY) {
    errors.push("governance case review decision applicability boundary drifted");
  }
  if (!isPlainObject(payload.applicability_ref)) {
    errors.push("governance case review decision applicability ref missing");
  }
  if (!isPlainObject(payload.applicability_context)) {
    errors.push("governance case review decision applicability context missing");
  }
  if (!isPlainObject(payload.validation_exports)) {
    errors.push("governance case review decision applicability validation exports missing");
  }
  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push("governance case review decision applicability preserved semantics missing");
  }
  if (errors.length > 0) {
    return { ok: false, errors };
  }
  const applicabilityRef = payload.applicability_ref;
  const applicabilityContext = payload.applicability_context;
  const validationExports = payload.validation_exports;
  const preservedSemantics = payload.preserved_semantics;

  if (applicabilityRef.selection_status !== "selected") {
    errors.push("governance case review decision applicability selection_status drifted");
  }
  for (const field of ["case_id", "current_review_decision_id"]) {
    if (
      typeof applicabilityRef[field] !== "string" ||
      applicabilityRef[field].length === 0
    ) {
      errors.push(
        `governance case review decision applicability ref ${field} is required`
      );
    }
  }
  if (
    applicabilityContext.applicability_status !==
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_STATUS_APPLICABLE
  ) {
    errors.push("governance case review decision applicability status drifted");
  }
  if (
    !ensureKnownReasonCodes(applicabilityContext.applicability_reason_codes) ||
    applicabilityContext.applicability_reason_codes.length === 0
  ) {
    errors.push(
      "governance case review decision applicability reason_codes drifted"
    );
  }
  for (const field of [
    "current_selection_final_acceptance_available",
    "selected_review_decision_profile_available",
    "export_surface_available",
  ]) {
    if (validationExports[field] !== true) {
      errors.push(
        `governance case review decision applicability validation export drifted: ${field}`
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
        `governance case review decision applicability preserved semantic drifted: ${field}`
      );
    }
  }
  for (const field of [
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
        `governance case review decision applicability preserved semantic drifted: ${field}`
      );
    }
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionApplicabilityProfile(profile) {
  const validation = validateGovernanceCaseReviewDecisionApplicabilityProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `governance case review decision applicability profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
