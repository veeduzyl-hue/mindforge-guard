import {
  APPROVAL_FINAL_ACCEPTANCE_BOUNDARY,
  APPROVAL_STABILIZATION_KIND,
  APPROVAL_STABILIZATION_STAGE,
  APPROVAL_STABILIZATION_VERSION,
  assertValidApprovalStabilizationProfile,
} from "../approval/stabilization.mjs";

export const ENFORCEMENT_READINESS_KIND =
  "bounded_enforcement_readiness_profile";
export const ENFORCEMENT_READINESS_VERSION = "v1";
export const ENFORCEMENT_READINESS_SCHEMA_ID =
  "mindforge/enforcement-readiness/v1";
export const ENFORCEMENT_READINESS_STAGE =
  "enforcement_readiness_phase1_v1";
export const ENFORCEMENT_CONSUMER_SURFACE =
  "guard.audit.enforcement_adjacent";
export const ENFORCEMENT_READINESS_BOUNDARY =
  "bounded_non_executing_enforcement_readiness_contract";
export const ENFORCEMENT_SCOPE_CONTRACT_KIND = "enforcement_scope_contract";
export const ENFORCEMENT_SCOPE_CONTRACT_VERSION = "v1";
export const ENFORCEMENT_SCOPE_CONTRACT_BOUNDARY =
  "bounded_recommendation_only_scope_guard";
export const ENFORCEMENT_SCOPE_REVIEW_ONLY =
  "review_gate_deny_exit_recommendation_only";
export const ENFORCEMENT_READINESS_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "enforcement_readiness",
  "deterministic",
  "enforcing",
]);
export const ENFORCEMENT_READINESS_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "approval_ref",
  "scope_contract",
  "preservation_contract",
]);
export const ENFORCEMENT_READINESS_STABLE_EXPORT_SET = Object.freeze([
  "ENFORCEMENT_READINESS_KIND",
  "ENFORCEMENT_READINESS_VERSION",
  "ENFORCEMENT_READINESS_SCHEMA_ID",
  "ENFORCEMENT_READINESS_STAGE",
  "ENFORCEMENT_CONSUMER_SURFACE",
  "ENFORCEMENT_READINESS_BOUNDARY",
  "ENFORCEMENT_SCOPE_CONTRACT_KIND",
  "ENFORCEMENT_SCOPE_CONTRACT_VERSION",
  "ENFORCEMENT_SCOPE_CONTRACT_BOUNDARY",
  "ENFORCEMENT_SCOPE_REVIEW_ONLY",
  "ENFORCEMENT_READINESS_TOP_LEVEL_FIELDS",
  "ENFORCEMENT_READINESS_PAYLOAD_FIELDS",
  "ENFORCEMENT_READINESS_STABLE_EXPORT_SET",
  "buildEnforcementReadinessProfile",
  "validateEnforcementReadinessProfile",
  "assertValidEnforcementReadinessProfile",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildEnforcementReadinessProfile({
  approvalStabilizationProfile,
}) {
  const approval = assertValidApprovalStabilizationProfile(
    approvalStabilizationProfile
  );

  return {
    kind: ENFORCEMENT_READINESS_KIND,
    version: ENFORCEMENT_READINESS_VERSION,
    schema_id: ENFORCEMENT_READINESS_SCHEMA_ID,
    canonical_action_hash: approval.canonical_action_hash,
    enforcement_readiness: {
      stage: ENFORCEMENT_READINESS_STAGE,
      consumer_surface: ENFORCEMENT_CONSUMER_SURFACE,
      boundary: ENFORCEMENT_READINESS_BOUNDARY,
      approval_ref: {
        kind: APPROVAL_STABILIZATION_KIND,
        version: APPROVAL_STABILIZATION_VERSION,
        stage: APPROVAL_STABILIZATION_STAGE,
        boundary: APPROVAL_FINAL_ACCEPTANCE_BOUNDARY,
      },
      scope_contract: {
        kind: ENFORCEMENT_SCOPE_CONTRACT_KIND,
        version: ENFORCEMENT_SCOPE_CONTRACT_VERSION,
        boundary: ENFORCEMENT_SCOPE_CONTRACT_BOUNDARY,
        recommendation_only: true,
        additive_only: true,
        execution_enabled: false,
        default_on: false,
        authority_scope: ENFORCEMENT_SCOPE_REVIEW_ONLY,
        authority_scope_expansion: false,
      },
      preservation_contract: {
        audit_output_preserved: true,
        audit_verdict_preserved: true,
        actual_exit_code_preserved: true,
        denied_exit_code_preserved: 25,
        permit_gate_semantics_preserved: true,
        enforcement_pilot_semantics_preserved: true,
        limited_authority_semantics_preserved: true,
        approval_semantics_preserved: true,
        governance_object_addition: false,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateEnforcementReadinessProfile(profile) {
  const errors = [];

  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: ["enforcement readiness profile must be an object"],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(ENFORCEMENT_READINESS_TOP_LEVEL_FIELDS)
  ) {
    errors.push("enforcement readiness top-level field order drifted");
  }
  if (profile.kind !== ENFORCEMENT_READINESS_KIND) {
    errors.push("enforcement readiness kind drifted");
  }
  if (profile.version !== ENFORCEMENT_READINESS_VERSION) {
    errors.push("enforcement readiness version drifted");
  }
  if (profile.schema_id !== ENFORCEMENT_READINESS_SCHEMA_ID) {
    errors.push("enforcement readiness schema id drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("enforcement readiness canonical_action_hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("enforcement readiness must remain deterministic");
  }
  if (profile.enforcing !== false) {
    errors.push("enforcement readiness must remain non-enforcing");
  }
  if (!isPlainObject(profile.enforcement_readiness)) {
    errors.push("enforcement readiness payload must be an object");
    return { ok: errors.length === 0, errors };
  }

  const payload = profile.enforcement_readiness;
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(ENFORCEMENT_READINESS_PAYLOAD_FIELDS)
  ) {
    errors.push("enforcement readiness payload field order drifted");
  }
  if (payload.stage !== ENFORCEMENT_READINESS_STAGE) {
    errors.push("enforcement readiness stage drifted");
  }
  if (payload.consumer_surface !== ENFORCEMENT_CONSUMER_SURFACE) {
    errors.push("enforcement readiness consumer surface drifted");
  }
  if (payload.boundary !== ENFORCEMENT_READINESS_BOUNDARY) {
    errors.push("enforcement readiness boundary drifted");
  }
  if (!isPlainObject(payload.approval_ref)) {
    errors.push("enforcement readiness approval ref must be an object");
  } else {
    if (payload.approval_ref.kind !== APPROVAL_STABILIZATION_KIND) {
      errors.push("enforcement readiness approval kind drifted");
    }
    if (payload.approval_ref.version !== APPROVAL_STABILIZATION_VERSION) {
      errors.push("enforcement readiness approval version drifted");
    }
    if (payload.approval_ref.stage !== APPROVAL_STABILIZATION_STAGE) {
      errors.push("enforcement readiness approval stage drifted");
    }
    if (payload.approval_ref.boundary !== APPROVAL_FINAL_ACCEPTANCE_BOUNDARY) {
      errors.push("enforcement readiness approval boundary drifted");
    }
  }
  if (!isPlainObject(payload.scope_contract)) {
    errors.push("enforcement readiness scope contract must be an object");
  } else {
    const scope = payload.scope_contract;
    if (scope.kind !== ENFORCEMENT_SCOPE_CONTRACT_KIND) {
      errors.push("enforcement scope contract kind drifted");
    }
    if (scope.version !== ENFORCEMENT_SCOPE_CONTRACT_VERSION) {
      errors.push("enforcement scope contract version drifted");
    }
    if (scope.boundary !== ENFORCEMENT_SCOPE_CONTRACT_BOUNDARY) {
      errors.push("enforcement scope contract boundary drifted");
    }
    if (scope.recommendation_only !== true) {
      errors.push("enforcement readiness must remain recommendation-only");
    }
    if (scope.additive_only !== true) {
      errors.push("enforcement readiness must remain additive-only");
    }
    if (scope.execution_enabled !== false) {
      errors.push("enforcement readiness must remain non-executing");
    }
    if (scope.default_on !== false) {
      errors.push("enforcement readiness must remain default-off");
    }
    if (scope.authority_scope !== ENFORCEMENT_SCOPE_REVIEW_ONLY) {
      errors.push("enforcement scope drifted");
    }
    if (scope.authority_scope_expansion !== false) {
      errors.push("enforcement scope expansion boundary drifted");
    }
  }
  if (!isPlainObject(payload.preservation_contract)) {
    errors.push("enforcement preservation contract must be an object");
  } else {
    const contract = payload.preservation_contract;
    if (contract.audit_output_preserved !== true) {
      errors.push("enforcement readiness must preserve audit output");
    }
    if (contract.audit_verdict_preserved !== true) {
      errors.push("enforcement readiness must preserve audit verdict");
    }
    if (contract.actual_exit_code_preserved !== true) {
      errors.push("enforcement readiness must preserve actual exit code");
    }
    if (contract.denied_exit_code_preserved !== 25) {
      errors.push("enforcement readiness deny exit code drifted");
    }
    if (contract.permit_gate_semantics_preserved !== true) {
      errors.push("enforcement readiness must preserve permit gate semantics");
    }
    if (contract.enforcement_pilot_semantics_preserved !== true) {
      errors.push(
        "enforcement readiness must preserve enforcement pilot semantics"
      );
    }
    if (contract.limited_authority_semantics_preserved !== true) {
      errors.push(
        "enforcement readiness must preserve limited authority semantics"
      );
    }
    if (contract.approval_semantics_preserved !== true) {
      errors.push("enforcement readiness must preserve approval semantics");
    }
    if (contract.governance_object_addition !== false) {
      errors.push("enforcement readiness must not add governance objects");
    }
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidEnforcementReadinessProfile(profile) {
  const validation = validateEnforcementReadinessProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `enforcement readiness profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
