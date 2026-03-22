import {
  GOVERNANCE_CASE_ESCALATION_CONSUMER_SURFACE,
} from "../caseEscalation/governanceCaseEscalationProfile.mjs";
import {
  GOVERNANCE_CASE_ESCALATION_STABILIZATION_BOUNDARY,
  GOVERNANCE_CASE_ESCALATION_STABILIZATION_KIND,
  GOVERNANCE_CASE_ESCALATION_STABILIZATION_STAGE,
  GOVERNANCE_CASE_ESCALATION_STABILIZATION_VERSION,
  assertValidGovernanceCaseEscalationStabilizationProfile,
} from "../caseEscalation/governanceCaseEscalationStabilizationProfile.mjs";

export const GOVERNANCE_CASE_CLOSURE_PROFILE_KIND =
  "governance_case_closure_profile";
export const GOVERNANCE_CASE_CLOSURE_PROFILE_VERSION = "v1";
export const GOVERNANCE_CASE_CLOSURE_PROFILE_SCHEMA_ID =
  "mindforge/governance-case-closure-profile/v1";
export const GOVERNANCE_CASE_CLOSURE_PROFILE_STAGE =
  "governance_case_closure_boundary_phase3_v1";
export const GOVERNANCE_CASE_CLOSURE_CONSUMER_SURFACE =
  "guard.audit.governance_case_closure";
export const GOVERNANCE_CASE_CLOSURE_PROFILE_BOUNDARY =
  "governance_case_closure_boundary_contract";
export const GOVERNANCE_CASE_CLOSURE_STATUS_DOCUMENTED =
  "closure_documented";
export const GOVERNANCE_CASE_CLOSURE_MODE_RECOMMENDATION_ONLY =
  "recommendation_record_only";
export const GOVERNANCE_CASE_CLOSURE_READY =
  "closure_ready_for_review";
export const GOVERNANCE_CASE_POST_CLOSURE_OBSERVATION_READY =
  "post_closure_observation_ready_for_review";
export const GOVERNANCE_CASE_CLOSURE_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "governance_case_closure",
  "deterministic",
  "enforcing",
]);
export const GOVERNANCE_CASE_CLOSURE_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "escalation_ref",
  "closure_context",
  "validation_exports",
  "preserved_semantics",
]);
export const GOVERNANCE_CASE_CLOSURE_STABLE_EXPORT_SET = Object.freeze([
  "GOVERNANCE_CASE_CLOSURE_PROFILE_KIND",
  "GOVERNANCE_CASE_CLOSURE_PROFILE_VERSION",
  "GOVERNANCE_CASE_CLOSURE_PROFILE_SCHEMA_ID",
  "GOVERNANCE_CASE_CLOSURE_PROFILE_STAGE",
  "GOVERNANCE_CASE_CLOSURE_CONSUMER_SURFACE",
  "GOVERNANCE_CASE_CLOSURE_PROFILE_BOUNDARY",
  "GOVERNANCE_CASE_CLOSURE_STATUS_DOCUMENTED",
  "GOVERNANCE_CASE_CLOSURE_MODE_RECOMMENDATION_ONLY",
  "GOVERNANCE_CASE_CLOSURE_READY",
  "GOVERNANCE_CASE_POST_CLOSURE_OBSERVATION_READY",
  "GOVERNANCE_CASE_CLOSURE_TOP_LEVEL_FIELDS",
  "GOVERNANCE_CASE_CLOSURE_PAYLOAD_FIELDS",
  "GOVERNANCE_CASE_CLOSURE_STABLE_EXPORT_SET",
  "buildGovernanceCaseClosureProfile",
  "validateGovernanceCaseClosureProfile",
  "assertValidGovernanceCaseClosureProfile",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function normalizeStringArray(values, fallback) {
  if (!Array.isArray(values) || values.length === 0) return [fallback];
  return values.map((value) => String(value));
}

export function buildGovernanceCaseClosureProfile({
  governanceCaseEscalationStabilizationProfile,
  caseId,
  closureStatus = GOVERNANCE_CASE_CLOSURE_STATUS_DOCUMENTED,
  closureMode = GOVERNANCE_CASE_CLOSURE_MODE_RECOMMENDATION_ONLY,
  closureRationale = "closure boundary documented without execution or transition",
  linkedExceptionIds = ["exception-record-1"],
  linkedOverrideRecordIds = ["override-record-1"],
  linkedResolutionIds = ["resolution-record-1"],
  linkedEscalationIds = ["escalation-record-1"],
  closureRecordedAt = "2026-03-22T00:00:00.000Z",
  closureRecordedBy = "governance_case_closure_reviewer",
} = {}) {
  const escalationProfile = assertValidGovernanceCaseEscalationStabilizationProfile(
    governanceCaseEscalationStabilizationProfile
  );
  const normalizedCaseId =
    caseId ??
    `case-${escalationProfile.canonical_action_hash
      .slice(-12)
      .replace(/[^a-z0-9]/gi, "")
      .toLowerCase()}`;

  return {
    kind: GOVERNANCE_CASE_CLOSURE_PROFILE_KIND,
    version: GOVERNANCE_CASE_CLOSURE_PROFILE_VERSION,
    schema_id: GOVERNANCE_CASE_CLOSURE_PROFILE_SCHEMA_ID,
    canonical_action_hash: escalationProfile.canonical_action_hash,
    governance_case_closure: {
      stage: GOVERNANCE_CASE_CLOSURE_PROFILE_STAGE,
      consumer_surface: GOVERNANCE_CASE_CLOSURE_CONSUMER_SURFACE,
      boundary: GOVERNANCE_CASE_CLOSURE_PROFILE_BOUNDARY,
      escalation_ref: {
        kind: GOVERNANCE_CASE_ESCALATION_STABILIZATION_KIND,
        version: GOVERNANCE_CASE_ESCALATION_STABILIZATION_VERSION,
        stage: GOVERNANCE_CASE_ESCALATION_STABILIZATION_STAGE,
        boundary: GOVERNANCE_CASE_ESCALATION_STABILIZATION_BOUNDARY,
        source_surface: GOVERNANCE_CASE_ESCALATION_CONSUMER_SURFACE,
      },
      closure_context: {
        case_id: normalizedCaseId,
        closure_status: closureStatus,
        closure_mode: closureMode,
        closure_rationale: closureRationale,
        closure_basis_refs: Object.freeze([
          Object.freeze({
            source_kind: GOVERNANCE_CASE_ESCALATION_STABILIZATION_KIND,
            source_stage: GOVERNANCE_CASE_ESCALATION_STABILIZATION_STAGE,
            source_boundary: GOVERNANCE_CASE_ESCALATION_STABILIZATION_BOUNDARY,
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
        linked_escalation_ids: Object.freeze(
          normalizeStringArray(linkedEscalationIds, "escalation-record-1")
        ),
        closure_readiness: {
          level: GOVERNANCE_CASE_CLOSURE_READY,
          recommendation_only: true,
          non_executing: true,
          default_off: true,
          actual_closure_execution: false,
          workflow_transition: false,
        },
        closure_recorded_at: closureRecordedAt,
        closure_recorded_by: closureRecordedBy,
        post_closure_observation_readiness: {
          level: GOVERNANCE_CASE_POST_CLOSURE_OBSERVATION_READY,
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
        escalation_semantics_preserved: true,
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

export function validateGovernanceCaseClosureProfile(profile) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: ["governance case closure profile must be an object"],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(GOVERNANCE_CASE_CLOSURE_TOP_LEVEL_FIELDS)
  ) {
    errors.push("governance case closure top-level field order drifted");
  }
  if (profile.kind !== GOVERNANCE_CASE_CLOSURE_PROFILE_KIND) {
    errors.push("governance case closure kind drifted");
  }
  if (profile.version !== GOVERNANCE_CASE_CLOSURE_PROFILE_VERSION) {
    errors.push("governance case closure version drifted");
  }
  if (profile.schema_id !== GOVERNANCE_CASE_CLOSURE_PROFILE_SCHEMA_ID) {
    errors.push("governance case closure schema id drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("governance case closure canonical action hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("governance case closure must remain deterministic");
  }
  if (profile.enforcing !== false) {
    errors.push("governance case closure must remain non-enforcing");
  }

  const payload = profile.governance_case_closure;
  if (!isPlainObject(payload)) {
    errors.push("governance case closure payload must be an object");
    return { ok: errors.length === 0, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(GOVERNANCE_CASE_CLOSURE_PAYLOAD_FIELDS)
  ) {
    errors.push("governance case closure payload field order drifted");
  }
  if (payload.stage !== GOVERNANCE_CASE_CLOSURE_PROFILE_STAGE) {
    errors.push("governance case closure stage drifted");
  }
  if (payload.consumer_surface !== GOVERNANCE_CASE_CLOSURE_CONSUMER_SURFACE) {
    errors.push("governance case closure consumer surface drifted");
  }
  if (payload.boundary !== GOVERNANCE_CASE_CLOSURE_PROFILE_BOUNDARY) {
    errors.push("governance case closure boundary drifted");
  }
  if (!isPlainObject(payload.escalation_ref)) {
    errors.push("governance case closure escalation ref must be an object");
  }

  const context = payload.closure_context;
  if (!isPlainObject(context)) {
    errors.push("governance case closure context must be an object");
  } else {
    if (typeof context.case_id !== "string" || context.case_id.length === 0) {
      errors.push("governance case closure case_id is required");
    }
    if (
      typeof context.closure_status !== "string" ||
      context.closure_status.length === 0
    ) {
      errors.push("governance case closure status is required");
    }
    if (
      typeof context.closure_mode !== "string" ||
      context.closure_mode.length === 0
    ) {
      errors.push("governance case closure mode is required");
    }
    if (
      typeof context.closure_rationale !== "string" ||
      context.closure_rationale.length === 0
    ) {
      errors.push("governance case closure rationale is required");
    }
    if (
      !Array.isArray(context.closure_basis_refs) ||
      context.closure_basis_refs.length === 0
    ) {
      errors.push("governance case closure basis refs are required");
    }
    if (
      !Array.isArray(context.linked_exception_ids) ||
      context.linked_exception_ids.length === 0
    ) {
      errors.push("governance case closure linked exception ids are required");
    }
    if (
      !Array.isArray(context.linked_override_record_ids) ||
      context.linked_override_record_ids.length === 0
    ) {
      errors.push("governance case closure linked override ids are required");
    }
    if (
      !Array.isArray(context.linked_resolution_ids) ||
      context.linked_resolution_ids.length === 0
    ) {
      errors.push("governance case closure linked resolution ids are required");
    }
    if (
      !Array.isArray(context.linked_escalation_ids) ||
      context.linked_escalation_ids.length === 0
    ) {
      errors.push("governance case closure linked escalation ids are required");
    }
    if (!isPlainObject(context.closure_readiness)) {
      errors.push("governance case closure readiness must be an object");
    } else {
      if (context.closure_readiness.level !== GOVERNANCE_CASE_CLOSURE_READY) {
        errors.push("governance case closure readiness level drifted");
      }
      if (context.closure_readiness.recommendation_only !== true) {
        errors.push("governance case closure readiness recommendation drifted");
      }
      if (context.closure_readiness.non_executing !== true) {
        errors.push("governance case closure readiness non-executing drifted");
      }
      if (context.closure_readiness.default_off !== true) {
        errors.push("governance case closure readiness default-off drifted");
      }
      if (context.closure_readiness.actual_closure_execution !== false) {
        errors.push("governance case closure execution drifted");
      }
      if (context.closure_readiness.workflow_transition !== false) {
        errors.push("governance case closure workflow transition drifted");
      }
    }
    if (
      typeof context.closure_recorded_at !== "string" ||
      context.closure_recorded_at.length === 0
    ) {
      errors.push("governance case closure recorded_at is required");
    }
    if (
      typeof context.closure_recorded_by !== "string" ||
      context.closure_recorded_by.length === 0
    ) {
      errors.push("governance case closure recorded_by is required");
    }
    if (!isPlainObject(context.post_closure_observation_readiness)) {
      errors.push("governance case closure post observation readiness must be an object");
    } else {
      if (
        context.post_closure_observation_readiness.level !==
        GOVERNANCE_CASE_POST_CLOSURE_OBSERVATION_READY
      ) {
        errors.push("governance case closure post observation readiness level drifted");
      }
      if (context.post_closure_observation_readiness.recommendation_only !== true) {
        errors.push("governance case closure post observation recommendation drifted");
      }
      if (context.post_closure_observation_readiness.non_executing !== true) {
        errors.push("governance case closure post observation non-executing drifted");
      }
      if (context.post_closure_observation_readiness.default_off !== true) {
        errors.push("governance case closure post observation default-off drifted");
      }
      if (context.post_closure_observation_readiness.actual_closure_execution !== false) {
        errors.push("governance case closure post observation execution drifted");
      }
    }
  }

  if (!isPlainObject(payload.validation_exports)) {
    errors.push("governance case closure validation exports must be an object");
  }
  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push("governance case closure preserved semantics must be an object");
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseClosureProfile(profile) {
  const validation = validateGovernanceCaseClosureProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `governance case closure profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
