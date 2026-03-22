import {
  GOVERNANCE_CASE_CLOSURE_CONSUMER_SURFACE,
} from "../caseClosure/governanceCaseClosureProfile.mjs";
import {
  GOVERNANCE_CASE_CLOSURE_STABILIZATION_BOUNDARY,
  GOVERNANCE_CASE_CLOSURE_STABILIZATION_KIND,
  GOVERNANCE_CASE_CLOSURE_STABILIZATION_STAGE,
  GOVERNANCE_CASE_CLOSURE_STABILIZATION_VERSION,
  assertValidGovernanceCaseClosureStabilizationProfile,
} from "../caseClosure/governanceCaseClosureStabilizationProfile.mjs";

export const GOVERNANCE_CASE_EVIDENCE_PROFILE_KIND =
  "governance_case_evidence_profile";
export const GOVERNANCE_CASE_EVIDENCE_PROFILE_VERSION = "v1";
export const GOVERNANCE_CASE_EVIDENCE_PROFILE_SCHEMA_ID =
  "mindforge/governance-case-evidence-profile/v1";
export const GOVERNANCE_CASE_EVIDENCE_PROFILE_STAGE =
  "governance_case_evidence_boundary_phase1_v1";
export const GOVERNANCE_CASE_EVIDENCE_CONSUMER_SURFACE =
  "guard.audit.governance_case_evidence";
export const GOVERNANCE_CASE_EVIDENCE_PROFILE_BOUNDARY =
  "governance_case_evidence_boundary_contract";
export const GOVERNANCE_CASE_EVIDENCE_STATUS_DOCUMENTED =
  "evidence_documented";
export const GOVERNANCE_CASE_EVIDENCE_MODE_RECOMMENDATION_ONLY =
  "supporting_artifact_record_only";
export const GOVERNANCE_CASE_EVIDENCE_SUPPORT_READY =
  "case_support_ready_for_review";
export const GOVERNANCE_CASE_EVIDENCE_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "governance_case_evidence",
  "deterministic",
  "enforcing",
]);
export const GOVERNANCE_CASE_EVIDENCE_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "closure_ref",
  "evidence_context",
  "validation_exports",
  "preserved_semantics",
]);
export const GOVERNANCE_CASE_EVIDENCE_STABLE_EXPORT_SET = Object.freeze([
  "GOVERNANCE_CASE_EVIDENCE_PROFILE_KIND",
  "GOVERNANCE_CASE_EVIDENCE_PROFILE_VERSION",
  "GOVERNANCE_CASE_EVIDENCE_PROFILE_SCHEMA_ID",
  "GOVERNANCE_CASE_EVIDENCE_PROFILE_STAGE",
  "GOVERNANCE_CASE_EVIDENCE_CONSUMER_SURFACE",
  "GOVERNANCE_CASE_EVIDENCE_PROFILE_BOUNDARY",
  "GOVERNANCE_CASE_EVIDENCE_STATUS_DOCUMENTED",
  "GOVERNANCE_CASE_EVIDENCE_MODE_RECOMMENDATION_ONLY",
  "GOVERNANCE_CASE_EVIDENCE_SUPPORT_READY",
  "GOVERNANCE_CASE_EVIDENCE_TOP_LEVEL_FIELDS",
  "GOVERNANCE_CASE_EVIDENCE_PAYLOAD_FIELDS",
  "GOVERNANCE_CASE_EVIDENCE_STABLE_EXPORT_SET",
  "buildGovernanceCaseEvidenceProfile",
  "validateGovernanceCaseEvidenceProfile",
  "assertValidGovernanceCaseEvidenceProfile",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function normalizeStringArray(values, fallback) {
  if (!Array.isArray(values) || values.length === 0) return [fallback];
  return values.map((value) => String(value));
}

export function buildGovernanceCaseEvidenceProfile({
  governanceCaseClosureStabilizationProfile,
  caseId,
  evidenceStatus = GOVERNANCE_CASE_EVIDENCE_STATUS_DOCUMENTED,
  evidenceMode = GOVERNANCE_CASE_EVIDENCE_MODE_RECOMMENDATION_ONLY,
  evidenceRationale = "case-supporting evidence boundary documented without execution or routing",
  evidenceBasisRefs,
  linkedResolutionIds,
  linkedEscalationIds,
  linkedClosureIds,
  linkedExceptionIds,
  linkedOverrideRecordIds,
  evidenceRecordedAt = "2026-03-22T00:00:00.000Z",
  evidenceRecordedBy = "governance_case_evidence_reviewer",
} = {}) {
  const closure = assertValidGovernanceCaseClosureStabilizationProfile(
    governanceCaseClosureStabilizationProfile
  );
  const continuityRef =
    closure.governance_case_closure_stabilization.continuity_ref;
  const normalizedCaseId = caseId ?? continuityRef.case_id;

  return {
    kind: GOVERNANCE_CASE_EVIDENCE_PROFILE_KIND,
    version: GOVERNANCE_CASE_EVIDENCE_PROFILE_VERSION,
    schema_id: GOVERNANCE_CASE_EVIDENCE_PROFILE_SCHEMA_ID,
    canonical_action_hash: closure.canonical_action_hash,
    governance_case_evidence: {
      stage: GOVERNANCE_CASE_EVIDENCE_PROFILE_STAGE,
      consumer_surface: GOVERNANCE_CASE_EVIDENCE_CONSUMER_SURFACE,
      boundary: GOVERNANCE_CASE_EVIDENCE_PROFILE_BOUNDARY,
      closure_ref: {
        kind: GOVERNANCE_CASE_CLOSURE_STABILIZATION_KIND,
        version: GOVERNANCE_CASE_CLOSURE_STABILIZATION_VERSION,
        stage: GOVERNANCE_CASE_CLOSURE_STABILIZATION_STAGE,
        boundary: GOVERNANCE_CASE_CLOSURE_STABILIZATION_BOUNDARY,
        source_surface: GOVERNANCE_CASE_CLOSURE_CONSUMER_SURFACE,
      },
      evidence_context: {
        case_id: normalizedCaseId,
        evidence_status: evidenceStatus,
        evidence_mode: evidenceMode,
        evidence_rationale: evidenceRationale,
        evidence_basis_refs: Object.freeze(
          Array.isArray(evidenceBasisRefs) && evidenceBasisRefs.length > 0
            ? evidenceBasisRefs.map((entry) => Object.freeze({ ...entry }))
            : [
                Object.freeze({
                  source_kind: GOVERNANCE_CASE_CLOSURE_STABILIZATION_KIND,
                  source_stage: GOVERNANCE_CASE_CLOSURE_STABILIZATION_STAGE,
                  source_boundary: GOVERNANCE_CASE_CLOSURE_STABILIZATION_BOUNDARY,
                }),
              ]
        ),
        linked_resolution_ids: Object.freeze(
          normalizeStringArray(
            linkedResolutionIds,
            continuityRef.linked_resolution_ids[0]
          )
        ),
        linked_escalation_ids: Object.freeze(
          normalizeStringArray(
            linkedEscalationIds,
            continuityRef.linked_escalation_ids[0]
          )
        ),
        linked_closure_ids: Object.freeze(
          normalizeStringArray(linkedClosureIds, `closure-${normalizedCaseId}`)
        ),
        linked_exception_ids: Object.freeze(
          normalizeStringArray(
            linkedExceptionIds,
            continuityRef.linked_exception_ids[0]
          )
        ),
        linked_override_record_ids: Object.freeze(
          normalizeStringArray(
            linkedOverrideRecordIds,
            continuityRef.linked_override_record_ids[0]
          )
        ),
        evidence_recorded_at: evidenceRecordedAt,
        evidence_recorded_by: evidenceRecordedBy,
        support_readiness: {
          level: GOVERNANCE_CASE_EVIDENCE_SUPPORT_READY,
          recommendation_only: true,
          non_executing: true,
          default_off: true,
          actual_execution: false,
        },
      },
      validation_exports: {
        consumer_available: true,
        validator_available: true,
        export_surface_available: true,
      },
      preserved_semantics: {
        evidence_supporting_artifact_only: true,
        closure_semantics_preserved: true,
        escalation_semantics_preserved: true,
        resolution_semantics_preserved: true,
        exception_semantics_preserved: true,
        audit_output_preserved: true,
        audit_verdict_preserved: true,
        actual_exit_code_preserved: true,
        denied_exit_code_preserved: 25,
        authority_scope_expansion: false,
        governance_object_addition: false,
        main_path_takeover: false,
        risk_integration: false,
        ui_control_plane: false,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateGovernanceCaseEvidenceProfile(profile) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: ["governance case evidence profile must be an object"],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(GOVERNANCE_CASE_EVIDENCE_TOP_LEVEL_FIELDS)
  ) {
    errors.push("governance case evidence top-level field order drifted");
  }
  if (profile.kind !== GOVERNANCE_CASE_EVIDENCE_PROFILE_KIND) {
    errors.push("governance case evidence kind drifted");
  }
  if (profile.version !== GOVERNANCE_CASE_EVIDENCE_PROFILE_VERSION) {
    errors.push("governance case evidence version drifted");
  }
  if (profile.schema_id !== GOVERNANCE_CASE_EVIDENCE_PROFILE_SCHEMA_ID) {
    errors.push("governance case evidence schema drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("governance case evidence canonical action hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("governance case evidence must remain deterministic");
  }
  if (profile.enforcing !== false) {
    errors.push("governance case evidence must remain non-enforcing");
  }
  const payload = profile.governance_case_evidence;
  if (!isPlainObject(payload)) {
    errors.push("governance case evidence payload must be an object");
    return { ok: errors.length === 0, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(GOVERNANCE_CASE_EVIDENCE_PAYLOAD_FIELDS)
  ) {
    errors.push("governance case evidence payload field order drifted");
  }
  if (payload.stage !== GOVERNANCE_CASE_EVIDENCE_PROFILE_STAGE) {
    errors.push("governance case evidence stage drifted");
  }
  if (payload.consumer_surface !== GOVERNANCE_CASE_EVIDENCE_CONSUMER_SURFACE) {
    errors.push("governance case evidence consumer surface drifted");
  }
  if (payload.boundary !== GOVERNANCE_CASE_EVIDENCE_PROFILE_BOUNDARY) {
    errors.push("governance case evidence boundary drifted");
  }
  if (!isPlainObject(payload.closure_ref)) {
    errors.push("governance case evidence closure ref must be an object");
  }
  const context = payload.evidence_context;
  if (!isPlainObject(context)) {
    errors.push("governance case evidence context must be an object");
  } else {
    if (typeof context.case_id !== "string" || context.case_id.length === 0) {
      errors.push("governance case evidence case_id is required");
    }
    if (
      typeof context.evidence_status !== "string" ||
      context.evidence_status.length === 0
    ) {
      errors.push("governance case evidence status is required");
    }
    if (
      typeof context.evidence_mode !== "string" ||
      context.evidence_mode.length === 0
    ) {
      errors.push("governance case evidence mode is required");
    }
    if (
      typeof context.evidence_rationale !== "string" ||
      context.evidence_rationale.length === 0
    ) {
      errors.push("governance case evidence rationale is required");
    }
    if (
      !Array.isArray(context.evidence_basis_refs) ||
      context.evidence_basis_refs.length === 0
    ) {
      errors.push("governance case evidence basis refs are required");
    }
    if (
      !Array.isArray(context.linked_resolution_ids) ||
      context.linked_resolution_ids.length === 0
    ) {
      errors.push("governance case evidence linked resolution ids are required");
    }
    if (
      !Array.isArray(context.linked_escalation_ids) ||
      context.linked_escalation_ids.length === 0
    ) {
      errors.push("governance case evidence linked escalation ids are required");
    }
    if (
      !Array.isArray(context.linked_closure_ids) ||
      context.linked_closure_ids.length === 0
    ) {
      errors.push("governance case evidence linked closure ids are required");
    }
    if (
      !Array.isArray(context.linked_exception_ids) ||
      context.linked_exception_ids.length === 0
    ) {
      errors.push("governance case evidence linked exception ids are required");
    }
    if (
      !Array.isArray(context.linked_override_record_ids) ||
      context.linked_override_record_ids.length === 0
    ) {
      errors.push("governance case evidence linked override ids are required");
    }
    if (
      typeof context.evidence_recorded_at !== "string" ||
      context.evidence_recorded_at.length === 0
    ) {
      errors.push("governance case evidence recorded_at is required");
    }
    if (
      typeof context.evidence_recorded_by !== "string" ||
      context.evidence_recorded_by.length === 0
    ) {
      errors.push("governance case evidence recorded_by is required");
    }
    if (!isPlainObject(context.support_readiness)) {
      errors.push("governance case evidence support readiness must be an object");
    } else {
      if (context.support_readiness.level !== GOVERNANCE_CASE_EVIDENCE_SUPPORT_READY) {
        errors.push("governance case evidence support readiness level drifted");
      }
      if (context.support_readiness.recommendation_only !== true) {
        errors.push("governance case evidence support recommendation drifted");
      }
      if (context.support_readiness.non_executing !== true) {
        errors.push("governance case evidence support non-executing drifted");
      }
      if (context.support_readiness.default_off !== true) {
        errors.push("governance case evidence support default-off drifted");
      }
      if (context.support_readiness.actual_execution !== false) {
        errors.push("governance case evidence support execution drifted");
      }
    }
  }
  if (!isPlainObject(payload.validation_exports)) {
    errors.push("governance case evidence validation exports must be an object");
  }
  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push("governance case evidence preserved semantics must be an object");
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseEvidenceProfile(profile) {
  const validation = validateGovernanceCaseEvidenceProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `governance case evidence profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
