import {
  ENFORCEMENT_COMPATIBILITY_BOUNDARY,
  ENFORCEMENT_COMPATIBILITY_KIND,
  ENFORCEMENT_COMPATIBILITY_STAGE,
  ENFORCEMENT_COMPATIBILITY_VERSION,
  ENFORCEMENT_CONSUMER_COMPATIBLE,
  assertValidEnforcementCompatibilityProfile,
} from "./compatibility.mjs";
import {
  ENFORCEMENT_CONSUMER_SURFACE,
  ENFORCEMENT_SCOPE_REVIEW_ONLY,
} from "./profile.mjs";

export const ENFORCEMENT_STABILIZATION_KIND =
  "enforcement_stabilization_profile";
export const ENFORCEMENT_STABILIZATION_VERSION = "v1";
export const ENFORCEMENT_STABILIZATION_SCHEMA_ID =
  "mindforge/enforcement-stabilization/v1";
export const ENFORCEMENT_STABILIZATION_STAGE =
  "enforcement_stabilization_phase3_v1";
export const ENFORCEMENT_FINAL_ACCEPTANCE_BOUNDARY =
  "final_bounded_enforcement_consumer_contract";
export const ENFORCEMENT_FINAL_ACCEPTANCE_READY = "final_consumer_ready";
export const ENFORCEMENT_STABILIZATION_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "enforcement_stabilization",
  "deterministic",
  "enforcing",
]);
export const ENFORCEMENT_STABILIZATION_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "compatibility_ref",
  "final_consumer_contract",
  "preserved_semantics",
]);
export const ENFORCEMENT_STABILIZATION_STABLE_EXPORT_SET = Object.freeze([
  "ENFORCEMENT_STABILIZATION_KIND",
  "ENFORCEMENT_STABILIZATION_VERSION",
  "ENFORCEMENT_STABILIZATION_SCHEMA_ID",
  "ENFORCEMENT_STABILIZATION_STAGE",
  "ENFORCEMENT_FINAL_ACCEPTANCE_BOUNDARY",
  "ENFORCEMENT_FINAL_ACCEPTANCE_READY",
  "ENFORCEMENT_STABILIZATION_TOP_LEVEL_FIELDS",
  "ENFORCEMENT_STABILIZATION_PAYLOAD_FIELDS",
  "ENFORCEMENT_STABILIZATION_STABLE_EXPORT_SET",
  "buildEnforcementStabilizationProfile",
  "validateEnforcementStabilizationProfile",
  "assertValidEnforcementStabilizationProfile",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildEnforcementStabilizationProfile({
  enforcementCompatibilityProfile,
}) {
  const compatibility = assertValidEnforcementCompatibilityProfile(
    enforcementCompatibilityProfile
  );

  return {
    kind: ENFORCEMENT_STABILIZATION_KIND,
    version: ENFORCEMENT_STABILIZATION_VERSION,
    schema_id: ENFORCEMENT_STABILIZATION_SCHEMA_ID,
    canonical_action_hash: compatibility.canonical_action_hash,
    enforcement_stabilization: {
      stage: ENFORCEMENT_STABILIZATION_STAGE,
      consumer_surface: ENFORCEMENT_CONSUMER_SURFACE,
      boundary: ENFORCEMENT_FINAL_ACCEPTANCE_BOUNDARY,
      compatibility_ref: {
        kind: ENFORCEMENT_COMPATIBILITY_KIND,
        version: ENFORCEMENT_COMPATIBILITY_VERSION,
        stage: ENFORCEMENT_COMPATIBILITY_STAGE,
        boundary: ENFORCEMENT_COMPATIBILITY_BOUNDARY,
      },
      final_consumer_contract: {
        acceptance_level: ENFORCEMENT_FINAL_ACCEPTANCE_READY,
        recommendation_only: true,
        additive_only: true,
        execution_enabled: false,
        default_on: false,
        audit_output_preserved: true,
        audit_verdict_preserved: true,
        actual_exit_code_preserved: true,
        denied_exit_code_preserved: 25,
        authority_scope: ENFORCEMENT_SCOPE_REVIEW_ONLY,
        governance_object_addition: false,
      },
      preserved_semantics: {
        permit_gate_semantics_preserved: true,
        enforcement_pilot_semantics_preserved: true,
        limited_authority_semantics_preserved: true,
        approval_semantics_preserved: true,
        enforcement_readiness_semantics_preserved: true,
        enforcement_compatibility_semantics_preserved: true,
        rollback_execution_available: false,
        override_execution_available: false,
        consumer_contract_ready:
          compatibility.enforcement_compatibility.consumer_compatibility.level ===
          ENFORCEMENT_CONSUMER_COMPATIBLE,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateEnforcementStabilizationProfile(profile) {
  const errors = [];

  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: ["enforcement stabilization profile must be an object"],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(ENFORCEMENT_STABILIZATION_TOP_LEVEL_FIELDS)
  ) {
    errors.push("enforcement stabilization top-level field order drifted");
  }
  if (profile.kind !== ENFORCEMENT_STABILIZATION_KIND) {
    errors.push("enforcement stabilization kind drifted");
  }
  if (profile.version !== ENFORCEMENT_STABILIZATION_VERSION) {
    errors.push("enforcement stabilization version drifted");
  }
  if (profile.schema_id !== ENFORCEMENT_STABILIZATION_SCHEMA_ID) {
    errors.push("enforcement stabilization schema id drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("enforcement stabilization canonical_action_hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("enforcement stabilization must remain deterministic");
  }
  if (profile.enforcing !== false) {
    errors.push("enforcement stabilization must remain non-enforcing");
  }
  if (!isPlainObject(profile.enforcement_stabilization)) {
    errors.push("enforcement stabilization payload must be an object");
    return { ok: errors.length === 0, errors };
  }

  const payload = profile.enforcement_stabilization;
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(ENFORCEMENT_STABILIZATION_PAYLOAD_FIELDS)
  ) {
    errors.push("enforcement stabilization payload field order drifted");
  }
  if (payload.stage !== ENFORCEMENT_STABILIZATION_STAGE) {
    errors.push("enforcement stabilization stage drifted");
  }
  if (payload.consumer_surface !== ENFORCEMENT_CONSUMER_SURFACE) {
    errors.push("enforcement stabilization consumer surface drifted");
  }
  if (payload.boundary !== ENFORCEMENT_FINAL_ACCEPTANCE_BOUNDARY) {
    errors.push("enforcement stabilization boundary drifted");
  }
  if (!isPlainObject(payload.compatibility_ref)) {
    errors.push("enforcement stabilization compatibility ref must be an object");
  } else {
    if (payload.compatibility_ref.kind !== ENFORCEMENT_COMPATIBILITY_KIND) {
      errors.push("enforcement stabilization compatibility kind drifted");
    }
    if (
      payload.compatibility_ref.version !== ENFORCEMENT_COMPATIBILITY_VERSION
    ) {
      errors.push("enforcement stabilization compatibility version drifted");
    }
    if (payload.compatibility_ref.stage !== ENFORCEMENT_COMPATIBILITY_STAGE) {
      errors.push("enforcement stabilization compatibility stage drifted");
    }
    if (
      payload.compatibility_ref.boundary !== ENFORCEMENT_COMPATIBILITY_BOUNDARY
    ) {
      errors.push("enforcement stabilization compatibility boundary drifted");
    }
  }
  if (!isPlainObject(payload.final_consumer_contract)) {
    errors.push("enforcement stabilization final consumer contract must be an object");
  } else {
    const contract = payload.final_consumer_contract;
    if (contract.acceptance_level !== ENFORCEMENT_FINAL_ACCEPTANCE_READY) {
      errors.push("enforcement stabilization acceptance level drifted");
    }
    if (contract.recommendation_only !== true) {
      errors.push("enforcement stabilization must remain recommendation-only");
    }
    if (contract.additive_only !== true) {
      errors.push("enforcement stabilization must remain additive-only");
    }
    if (contract.execution_enabled !== false) {
      errors.push("enforcement stabilization execution boundary drifted");
    }
    if (contract.default_on !== false) {
      errors.push("enforcement stabilization default-on boundary drifted");
    }
    if (contract.audit_output_preserved !== true) {
      errors.push("enforcement stabilization audit output drifted");
    }
    if (contract.audit_verdict_preserved !== true) {
      errors.push("enforcement stabilization audit verdict drifted");
    }
    if (contract.actual_exit_code_preserved !== true) {
      errors.push("enforcement stabilization actual exit drifted");
    }
    if (contract.denied_exit_code_preserved !== 25) {
      errors.push("enforcement stabilization deny exit drifted");
    }
    if (contract.authority_scope !== ENFORCEMENT_SCOPE_REVIEW_ONLY) {
      errors.push("enforcement stabilization authority scope drifted");
    }
    if (contract.governance_object_addition !== false) {
      errors.push("enforcement stabilization governance object boundary drifted");
    }
  }
  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push("enforcement stabilization preserved semantics must be an object");
  } else {
    const semantics = payload.preserved_semantics;
    if (semantics.permit_gate_semantics_preserved !== true) {
      errors.push("enforcement stabilization permit gate semantics drifted");
    }
    if (semantics.enforcement_pilot_semantics_preserved !== true) {
      errors.push("enforcement stabilization pilot semantics drifted");
    }
    if (semantics.limited_authority_semantics_preserved !== true) {
      errors.push("enforcement stabilization limited authority semantics drifted");
    }
    if (semantics.approval_semantics_preserved !== true) {
      errors.push("enforcement stabilization approval semantics drifted");
    }
    if (semantics.enforcement_readiness_semantics_preserved !== true) {
      errors.push("enforcement stabilization readiness semantics drifted");
    }
    if (semantics.enforcement_compatibility_semantics_preserved !== true) {
      errors.push("enforcement stabilization compatibility semantics drifted");
    }
    if (semantics.rollback_execution_available !== false) {
      errors.push("enforcement stabilization rollback execution drifted");
    }
    if (semantics.override_execution_available !== false) {
      errors.push("enforcement stabilization override execution drifted");
    }
    if (semantics.consumer_contract_ready !== true) {
      errors.push("enforcement stabilization consumer contract readiness drifted");
    }
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidEnforcementStabilizationProfile(profile) {
  const validation = validateEnforcementStabilizationProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `enforcement stabilization profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
