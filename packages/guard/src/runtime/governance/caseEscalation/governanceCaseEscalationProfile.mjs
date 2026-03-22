import {
  GOVERNANCE_CASE_RESOLUTION_STABILIZATION_BOUNDARY,
  GOVERNANCE_CASE_RESOLUTION_STABILIZATION_KIND,
  GOVERNANCE_CASE_RESOLUTION_STABILIZATION_STAGE,
  GOVERNANCE_CASE_RESOLUTION_STABILIZATION_VERSION,
  assertValidGovernanceCaseResolutionStabilizationProfile,
} from "../caseResolution/governanceCaseResolutionStabilizationProfile.mjs";
import { GOVERNANCE_CASE_RESOLUTION_CONSUMER_SURFACE } from "../caseResolution/governanceCaseResolutionProfile.mjs";

export const GOVERNANCE_CASE_ESCALATION_PROFILE_KIND =
  "governance_case_escalation_profile";
export const GOVERNANCE_CASE_ESCALATION_PROFILE_VERSION = "v1";
export const GOVERNANCE_CASE_ESCALATION_PROFILE_SCHEMA_ID =
  "mindforge/governance-case-escalation-profile/v1";
export const GOVERNANCE_CASE_ESCALATION_PROFILE_STAGE =
  "governance_case_escalation_boundary_phase2_v1";
export const GOVERNANCE_CASE_ESCALATION_CONSUMER_SURFACE =
  "guard.audit.governance_case_escalation";
export const GOVERNANCE_CASE_ESCALATION_PROFILE_BOUNDARY =
  "governance_case_escalation_boundary_contract";
export const GOVERNANCE_CASE_ESCALATION_STATUS_DOCUMENTED =
  "escalation_documented";
export const GOVERNANCE_CASE_ESCALATION_MODE_RECOMMENDATION_ONLY =
  "recommendation_record_only";
export const GOVERNANCE_CASE_ESCALATION_LANE_REVIEW_COUNCIL =
  "review_council_recommended";
export const GOVERNANCE_CASE_ESCALATION_CLOSURE_READY =
  "closure_ready_for_review";
export const GOVERNANCE_CASE_ESCALATION_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "governance_case_escalation",
  "deterministic",
  "enforcing",
]);
export const GOVERNANCE_CASE_ESCALATION_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "resolution_ref",
  "escalation_context",
  "validation_exports",
  "preserved_semantics",
]);
export const GOVERNANCE_CASE_ESCALATION_STABLE_EXPORT_SET = Object.freeze([
  "GOVERNANCE_CASE_ESCALATION_PROFILE_KIND",
  "GOVERNANCE_CASE_ESCALATION_PROFILE_VERSION",
  "GOVERNANCE_CASE_ESCALATION_PROFILE_SCHEMA_ID",
  "GOVERNANCE_CASE_ESCALATION_PROFILE_STAGE",
  "GOVERNANCE_CASE_ESCALATION_CONSUMER_SURFACE",
  "GOVERNANCE_CASE_ESCALATION_PROFILE_BOUNDARY",
  "GOVERNANCE_CASE_ESCALATION_STATUS_DOCUMENTED",
  "GOVERNANCE_CASE_ESCALATION_MODE_RECOMMENDATION_ONLY",
  "GOVERNANCE_CASE_ESCALATION_LANE_REVIEW_COUNCIL",
  "GOVERNANCE_CASE_ESCALATION_CLOSURE_READY",
  "GOVERNANCE_CASE_ESCALATION_TOP_LEVEL_FIELDS",
  "GOVERNANCE_CASE_ESCALATION_PAYLOAD_FIELDS",
  "GOVERNANCE_CASE_ESCALATION_STABLE_EXPORT_SET",
  "buildGovernanceCaseEscalationProfile",
  "validateGovernanceCaseEscalationProfile",
  "assertValidGovernanceCaseEscalationProfile",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function normalizeStringArray(values, fallback) {
  if (!Array.isArray(values) || values.length === 0) return [fallback];
  return values.map((value) => String(value));
}

export function buildGovernanceCaseEscalationProfile({
  governanceCaseResolutionStabilizationProfile,
  caseId,
  escalationStatus = GOVERNANCE_CASE_ESCALATION_STATUS_DOCUMENTED,
  escalationMode = GOVERNANCE_CASE_ESCALATION_MODE_RECOMMENDATION_ONLY,
  escalationRationale = "escalation boundary documented without routing or execution",
  linkedExceptionIds = ["exception-record-1"],
  linkedOverrideRecordIds = ["override-record-1"],
  linkedResolutionIds = ["resolution-record-1"],
  recommendedEscalationLane = GOVERNANCE_CASE_ESCALATION_LANE_REVIEW_COUNCIL,
  escalationRecordedAt = "2026-03-22T00:00:00.000Z",
  escalationRecordedBy = "governance_case_escalation_reviewer",
} = {}) {
  const resolutionProfile = assertValidGovernanceCaseResolutionStabilizationProfile(
    governanceCaseResolutionStabilizationProfile
  );
  const normalizedCaseId =
    caseId ??
    `case-${resolutionProfile.canonical_action_hash
      .slice(-12)
      .replace(/[^a-z0-9]/gi, "")
      .toLowerCase()}`;

  return {
    kind: GOVERNANCE_CASE_ESCALATION_PROFILE_KIND,
    version: GOVERNANCE_CASE_ESCALATION_PROFILE_VERSION,
    schema_id: GOVERNANCE_CASE_ESCALATION_PROFILE_SCHEMA_ID,
    canonical_action_hash: resolutionProfile.canonical_action_hash,
    governance_case_escalation: {
      stage: GOVERNANCE_CASE_ESCALATION_PROFILE_STAGE,
      consumer_surface: GOVERNANCE_CASE_ESCALATION_CONSUMER_SURFACE,
      boundary: GOVERNANCE_CASE_ESCALATION_PROFILE_BOUNDARY,
      resolution_ref: {
        kind: GOVERNANCE_CASE_RESOLUTION_STABILIZATION_KIND,
        version: GOVERNANCE_CASE_RESOLUTION_STABILIZATION_VERSION,
        stage: GOVERNANCE_CASE_RESOLUTION_STABILIZATION_STAGE,
        boundary: GOVERNANCE_CASE_RESOLUTION_STABILIZATION_BOUNDARY,
        source_surface: GOVERNANCE_CASE_RESOLUTION_CONSUMER_SURFACE,
      },
      escalation_context: {
        case_id: normalizedCaseId,
        escalation_status: escalationStatus,
        escalation_mode: escalationMode,
        escalation_rationale: escalationRationale,
        escalation_basis_refs: Object.freeze([
          Object.freeze({
            source_kind: GOVERNANCE_CASE_RESOLUTION_STABILIZATION_KIND,
            source_stage: GOVERNANCE_CASE_RESOLUTION_STABILIZATION_STAGE,
            source_boundary: GOVERNANCE_CASE_RESOLUTION_STABILIZATION_BOUNDARY,
          }),
        ]),
        linked_exception_ids: Object.freeze(
          normalizeStringArray(linkedExceptionIds, "exception-record-1")
        ),
        linked_override_record_ids: Object.freeze(
          normalizeStringArray(linkedOverrideRecordIds, "override-record-1")
        ),
        linked_resolution_ids: Object.freeze(
          normalizeStringArray(linkedResolutionIds, "resolution-record-1")
        ),
        recommended_escalation_lane: {
          lane: recommendedEscalationLane,
          recommendation_only: true,
          actual_routing: false,
        },
        escalation_recorded_at: escalationRecordedAt,
        escalation_recorded_by: escalationRecordedBy,
        closure_readiness: {
          level: GOVERNANCE_CASE_ESCALATION_CLOSURE_READY,
          recommendation_only: true,
          non_executing: true,
          default_off: true,
          actual_closure_execution: false,
        },
      },
      validation_exports: {
        consumer_available: true,
        validator_available: true,
        export_surface_available: true,
      },
      preserved_semantics: {
        resolution_semantics_preserved: true,
        exception_semantics_preserved: true,
        snapshot_semantics_preserved: true,
        evidence_semantics_preserved: true,
        policy_semantics_preserved: true,
        enforcement_semantics_preserved: true,
        approval_semantics_preserved: true,
        judgment_semantics_preserved: true,
        permit_gate_semantics_preserved: true,
        audit_output_preserved: true,
        audit_verdict_preserved: true,
        actual_exit_code_preserved: true,
        denied_exit_code_preserved: 25,
        authority_scope: "review_gate_deny_exit_recommendation_only",
        authority_scope_expansion: false,
        governance_object_addition: false,
        main_path_takeover: false,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateGovernanceCaseEscalationProfile(profile) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: ["governance case escalation profile must be an object"],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(GOVERNANCE_CASE_ESCALATION_TOP_LEVEL_FIELDS)
  ) {
    errors.push("governance case escalation top-level field order drifted");
  }
  if (profile.kind !== GOVERNANCE_CASE_ESCALATION_PROFILE_KIND) {
    errors.push("governance case escalation kind drifted");
  }
  if (profile.version !== GOVERNANCE_CASE_ESCALATION_PROFILE_VERSION) {
    errors.push("governance case escalation version drifted");
  }
  if (profile.schema_id !== GOVERNANCE_CASE_ESCALATION_PROFILE_SCHEMA_ID) {
    errors.push("governance case escalation schema id drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("governance case escalation canonical action hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("governance case escalation must remain deterministic");
  }
  if (profile.enforcing !== false) {
    errors.push("governance case escalation must remain non-enforcing");
  }

  const payload = profile.governance_case_escalation;
  if (!isPlainObject(payload)) {
    errors.push("governance case escalation payload must be an object");
    return { ok: errors.length === 0, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(GOVERNANCE_CASE_ESCALATION_PAYLOAD_FIELDS)
  ) {
    errors.push("governance case escalation payload field order drifted");
  }
  if (payload.stage !== GOVERNANCE_CASE_ESCALATION_PROFILE_STAGE) {
    errors.push("governance case escalation stage drifted");
  }
  if (payload.consumer_surface !== GOVERNANCE_CASE_ESCALATION_CONSUMER_SURFACE) {
    errors.push("governance case escalation consumer surface drifted");
  }
  if (payload.boundary !== GOVERNANCE_CASE_ESCALATION_PROFILE_BOUNDARY) {
    errors.push("governance case escalation boundary drifted");
  }
  if (!isPlainObject(payload.resolution_ref)) {
    errors.push("governance case escalation resolution ref must be an object");
  }

  const context = payload.escalation_context;
  if (!isPlainObject(context)) {
    errors.push("governance case escalation context must be an object");
  } else {
    if (typeof context.case_id !== "string" || context.case_id.length === 0) {
      errors.push("governance case escalation case_id is required");
    }
    if (
      typeof context.escalation_status !== "string" ||
      context.escalation_status.length === 0
    ) {
      errors.push("governance case escalation status is required");
    }
    if (
      typeof context.escalation_mode !== "string" ||
      context.escalation_mode.length === 0
    ) {
      errors.push("governance case escalation mode is required");
    }
    if (
      typeof context.escalation_rationale !== "string" ||
      context.escalation_rationale.length === 0
    ) {
      errors.push("governance case escalation rationale is required");
    }
    if (
      !Array.isArray(context.escalation_basis_refs) ||
      context.escalation_basis_refs.length === 0
    ) {
      errors.push("governance case escalation basis refs are required");
    }
    if (
      !Array.isArray(context.linked_exception_ids) ||
      context.linked_exception_ids.length === 0
    ) {
      errors.push("governance case escalation linked exception ids are required");
    }
    if (
      !Array.isArray(context.linked_override_record_ids) ||
      context.linked_override_record_ids.length === 0
    ) {
      errors.push("governance case escalation linked override ids are required");
    }
    if (
      !Array.isArray(context.linked_resolution_ids) ||
      context.linked_resolution_ids.length === 0
    ) {
      errors.push("governance case escalation linked resolution ids are required");
    }
    if (!isPlainObject(context.recommended_escalation_lane)) {
      errors.push("governance case escalation recommended lane must be an object");
    } else {
      if (
        typeof context.recommended_escalation_lane.lane !== "string" ||
        context.recommended_escalation_lane.lane.length === 0
      ) {
        errors.push("governance case escalation lane is required");
      }
      if (context.recommended_escalation_lane.recommendation_only !== true) {
        errors.push("governance case escalation lane recommendation drifted");
      }
      if (context.recommended_escalation_lane.actual_routing !== false) {
        errors.push("governance case escalation actual routing drifted");
      }
    }
    if (
      typeof context.escalation_recorded_at !== "string" ||
      context.escalation_recorded_at.length === 0
    ) {
      errors.push("governance case escalation recorded_at is required");
    }
    if (
      typeof context.escalation_recorded_by !== "string" ||
      context.escalation_recorded_by.length === 0
    ) {
      errors.push("governance case escalation recorded_by is required");
    }
    if (!isPlainObject(context.closure_readiness)) {
      errors.push("governance case escalation closure readiness must be an object");
    } else {
      if (
        context.closure_readiness.level !== GOVERNANCE_CASE_ESCALATION_CLOSURE_READY
      ) {
        errors.push("governance case escalation closure readiness level drifted");
      }
      if (context.closure_readiness.recommendation_only !== true) {
        errors.push("governance case escalation closure recommendation drifted");
      }
      if (context.closure_readiness.non_executing !== true) {
        errors.push("governance case escalation closure non-executing drifted");
      }
      if (context.closure_readiness.default_off !== true) {
        errors.push("governance case escalation closure default-off drifted");
      }
      if (context.closure_readiness.actual_closure_execution !== false) {
        errors.push("governance case escalation closure execution drifted");
      }
    }
  }

  if (!isPlainObject(payload.validation_exports)) {
    errors.push("governance case escalation validation exports must be an object");
  }
  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push("governance case escalation preserved semantics must be an object");
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseEscalationProfile(profile) {
  const validation = validateGovernanceCaseEscalationProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `governance case escalation profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
