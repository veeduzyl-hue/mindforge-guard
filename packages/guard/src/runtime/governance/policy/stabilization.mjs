import {
  POLICY_COMPATIBILITY_BOUNDARY,
  POLICY_COMPATIBILITY_KIND,
  POLICY_COMPATIBILITY_STAGE,
  POLICY_COMPATIBILITY_VERSION,
  assertValidPolicyCompatibilityProfile,
} from "./compatibility.mjs";
import {
  POLICY_CONSUMER_SURFACE,
} from "./profile.mjs";
import { POLICY_CONSUMER_COMPATIBLE } from "./migration.mjs";

export const POLICY_STABILIZATION_KIND = "policy_stabilization_profile";
export const POLICY_STABILIZATION_VERSION = "v1";
export const POLICY_STABILIZATION_SCHEMA_ID =
  "mindforge/policy-stabilization/v1";
export const POLICY_STABILIZATION_STAGE =
  "policy_stabilization_phase3_v1";
export const POLICY_FINAL_ACCEPTANCE_BOUNDARY =
  "final_policy_lifecycle_consumer_contract";
export const POLICY_FINAL_ACCEPTANCE_READY = "final_consumer_ready";
export const POLICY_STABILIZATION_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "policy_stabilization",
  "deterministic",
  "enforcing",
]);
export const POLICY_STABILIZATION_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "compatibility_ref",
  "final_consumer_contract",
  "preserved_semantics",
]);
export const POLICY_STABILIZATION_STABLE_EXPORT_SET = Object.freeze([
  "POLICY_STABILIZATION_KIND",
  "POLICY_STABILIZATION_VERSION",
  "POLICY_STABILIZATION_SCHEMA_ID",
  "POLICY_STABILIZATION_STAGE",
  "POLICY_FINAL_ACCEPTANCE_BOUNDARY",
  "POLICY_FINAL_ACCEPTANCE_READY",
  "POLICY_STABILIZATION_TOP_LEVEL_FIELDS",
  "POLICY_STABILIZATION_PAYLOAD_FIELDS",
  "POLICY_STABILIZATION_STABLE_EXPORT_SET",
  "buildPolicyStabilizationProfile",
  "validatePolicyStabilizationProfile",
  "assertValidPolicyStabilizationProfile",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildPolicyStabilizationProfile({
  policyCompatibilityProfile,
}) {
  const compatibility = assertValidPolicyCompatibilityProfile(
    policyCompatibilityProfile
  );

  return {
    kind: POLICY_STABILIZATION_KIND,
    version: POLICY_STABILIZATION_VERSION,
    schema_id: POLICY_STABILIZATION_SCHEMA_ID,
    canonical_action_hash: compatibility.canonical_action_hash,
    policy_stabilization: {
      stage: POLICY_STABILIZATION_STAGE,
      consumer_surface: POLICY_CONSUMER_SURFACE,
      boundary: POLICY_FINAL_ACCEPTANCE_BOUNDARY,
      compatibility_ref: {
        kind: POLICY_COMPATIBILITY_KIND,
        version: POLICY_COMPATIBILITY_VERSION,
        stage: POLICY_COMPATIBILITY_STAGE,
        boundary: POLICY_COMPATIBILITY_BOUNDARY,
      },
      final_consumer_contract: {
        acceptance_level: POLICY_FINAL_ACCEPTANCE_READY,
        recommendation_only: true,
        additive_only: true,
        execution_enabled: false,
        default_on: false,
        audit_output_preserved: true,
        audit_verdict_preserved: true,
        actual_exit_code_preserved: true,
        denied_exit_code_preserved: 25,
        authority_scope: "review_gate_deny_exit_recommendation_only",
        governance_object_addition: false,
      },
      preserved_semantics: {
        permit_gate_semantics_preserved: true,
        enforcement_semantics_preserved: true,
        approval_semantics_preserved: true,
        judgment_semantics_preserved: true,
        policy_rollout_semantics_preserved: true,
        policy_compatibility_semantics_preserved: true,
        pinning_execution_available: false,
        migration_execution_available: false,
        consumer_contract_ready:
          compatibility.policy_compatibility.consumer_compatibility.level ===
          POLICY_CONSUMER_COMPATIBLE,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validatePolicyStabilizationProfile(profile) {
  const errors = [];

  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: ["policy stabilization profile must be an object"],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(POLICY_STABILIZATION_TOP_LEVEL_FIELDS)
  ) {
    errors.push("policy stabilization top-level field order drifted");
  }
  if (profile.kind !== POLICY_STABILIZATION_KIND) {
    errors.push("policy stabilization kind drifted");
  }
  if (profile.version !== POLICY_STABILIZATION_VERSION) {
    errors.push("policy stabilization version drifted");
  }
  if (profile.schema_id !== POLICY_STABILIZATION_SCHEMA_ID) {
    errors.push("policy stabilization schema id drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("policy stabilization canonical_action_hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("policy stabilization must remain deterministic");
  }
  if (profile.enforcing !== false) {
    errors.push("policy stabilization must remain non-enforcing");
  }
  if (!isPlainObject(profile.policy_stabilization)) {
    errors.push("policy stabilization payload must be an object");
    return { ok: errors.length === 0, errors };
  }

  const payload = profile.policy_stabilization;
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(POLICY_STABILIZATION_PAYLOAD_FIELDS)
  ) {
    errors.push("policy stabilization payload field order drifted");
  }
  if (payload.stage !== POLICY_STABILIZATION_STAGE) {
    errors.push("policy stabilization stage drifted");
  }
  if (payload.consumer_surface !== POLICY_CONSUMER_SURFACE) {
    errors.push("policy stabilization consumer surface drifted");
  }
  if (payload.boundary !== POLICY_FINAL_ACCEPTANCE_BOUNDARY) {
    errors.push("policy stabilization boundary drifted");
  }
  if (!isPlainObject(payload.compatibility_ref)) {
    errors.push("policy stabilization compatibility ref must be an object");
  } else {
    if (payload.compatibility_ref.kind !== POLICY_COMPATIBILITY_KIND) {
      errors.push("policy stabilization compatibility kind drifted");
    }
    if (payload.compatibility_ref.version !== POLICY_COMPATIBILITY_VERSION) {
      errors.push("policy stabilization compatibility version drifted");
    }
    if (payload.compatibility_ref.stage !== POLICY_COMPATIBILITY_STAGE) {
      errors.push("policy stabilization compatibility stage drifted");
    }
    if (payload.compatibility_ref.boundary !== POLICY_COMPATIBILITY_BOUNDARY) {
      errors.push("policy stabilization compatibility boundary drifted");
    }
  }
  if (!isPlainObject(payload.final_consumer_contract)) {
    errors.push("policy stabilization final consumer contract must be an object");
  } else {
    const contract = payload.final_consumer_contract;
    if (contract.acceptance_level !== POLICY_FINAL_ACCEPTANCE_READY) {
      errors.push("policy stabilization acceptance level drifted");
    }
    if (contract.recommendation_only !== true) {
      errors.push("policy stabilization recommendation boundary drifted");
    }
    if (contract.additive_only !== true) {
      errors.push("policy stabilization additive boundary drifted");
    }
    if (contract.execution_enabled !== false) {
      errors.push("policy stabilization execution boundary drifted");
    }
    if (contract.default_on !== false) {
      errors.push("policy stabilization default-on boundary drifted");
    }
    if (contract.audit_output_preserved !== true) {
      errors.push("policy stabilization audit output drifted");
    }
    if (contract.audit_verdict_preserved !== true) {
      errors.push("policy stabilization audit verdict drifted");
    }
    if (contract.actual_exit_code_preserved !== true) {
      errors.push("policy stabilization actual exit drifted");
    }
    if (contract.denied_exit_code_preserved !== 25) {
      errors.push("policy stabilization deny exit drifted");
    }
    if (
      contract.authority_scope !== "review_gate_deny_exit_recommendation_only"
    ) {
      errors.push("policy stabilization authority scope drifted");
    }
    if (contract.governance_object_addition !== false) {
      errors.push("policy stabilization governance object boundary drifted");
    }
  }
  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push("policy stabilization preserved semantics must be an object");
  } else {
    const semantics = payload.preserved_semantics;
    if (semantics.permit_gate_semantics_preserved !== true) {
      errors.push("policy stabilization permit gate semantics drifted");
    }
    if (semantics.enforcement_semantics_preserved !== true) {
      errors.push("policy stabilization enforcement semantics drifted");
    }
    if (semantics.approval_semantics_preserved !== true) {
      errors.push("policy stabilization approval semantics drifted");
    }
    if (semantics.judgment_semantics_preserved !== true) {
      errors.push("policy stabilization judgment semantics drifted");
    }
    if (semantics.policy_rollout_semantics_preserved !== true) {
      errors.push("policy stabilization rollout semantics drifted");
    }
    if (semantics.policy_compatibility_semantics_preserved !== true) {
      errors.push("policy stabilization compatibility semantics drifted");
    }
    if (semantics.pinning_execution_available !== false) {
      errors.push("policy stabilization pinning execution drifted");
    }
    if (semantics.migration_execution_available !== false) {
      errors.push("policy stabilization migration execution drifted");
    }
    if (semantics.consumer_contract_ready !== true) {
      errors.push("policy stabilization consumer contract readiness drifted");
    }
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidPolicyStabilizationProfile(profile) {
  const validation = validatePolicyStabilizationProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `policy stabilization profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
