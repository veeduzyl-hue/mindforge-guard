import {
  POLICY_CONSUMER_SURFACE,
  POLICY_PROFILE_BOUNDARY,
  POLICY_PROFILE_KIND,
  POLICY_PROFILE_STAGE,
  POLICY_PROFILE_VERSION,
  assertValidPolicyProfile,
} from "./profile.mjs";
import {
  POLICY_MIGRATION_READINESS_BOUNDARY,
  POLICY_MIGRATION_READINESS_KIND,
  POLICY_MIGRATION_READY,
  POLICY_MIGRATION_READINESS_LEVELS,
  POLICY_MIGRATION_READINESS_VERSION,
  POLICY_CONSUMER_COMPATIBLE,
  buildPolicyMigrationReadinessProfile,
  validatePolicyMigrationReadinessProfile,
  assertValidPolicyMigrationReadinessProfile,
} from "./migration.mjs";
import {
  POLICY_PINNING_CONTRACT_BOUNDARY,
  POLICY_PINNING_CONTRACT_KIND,
  POLICY_PINNING_CONTRACT_VERSION,
  buildPolicyPinningContract,
  validatePolicyPinningContract,
  assertValidPolicyPinningContract,
} from "./pinning.mjs";

export const POLICY_COMPATIBILITY_KIND = "policy_compatibility_profile";
export const POLICY_COMPATIBILITY_VERSION = "v1";
export const POLICY_COMPATIBILITY_SCHEMA_ID =
  "mindforge/policy-compatibility/v1";
export const POLICY_COMPATIBILITY_STAGE = "policy_compatibility_phase2_v1";
export const POLICY_COMPATIBILITY_BOUNDARY =
  "policy_pinning_and_migration_consumer_compatibility";
export const POLICY_COMPATIBILITY_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "policy_compatibility",
  "deterministic",
  "enforcing",
]);
export const POLICY_COMPATIBILITY_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "policy_ref",
  "pinning_contract",
  "migration_readiness_profile",
  "receipt_readiness",
  "consumer_compatibility",
  "stabilization_refs",
]);
export const POLICY_COMPATIBILITY_STABLE_EXPORT_SET = Object.freeze([
  "POLICY_COMPATIBILITY_KIND",
  "POLICY_COMPATIBILITY_VERSION",
  "POLICY_COMPATIBILITY_SCHEMA_ID",
  "POLICY_COMPATIBILITY_STAGE",
  "POLICY_COMPATIBILITY_BOUNDARY",
  "POLICY_COMPATIBILITY_TOP_LEVEL_FIELDS",
  "POLICY_COMPATIBILITY_PAYLOAD_FIELDS",
  "POLICY_COMPATIBILITY_STABLE_EXPORT_SET",
  "POLICY_MIGRATION_READY",
  "POLICY_CONSUMER_COMPATIBLE",
  "POLICY_MIGRATION_READINESS_LEVELS",
  "buildPolicyCompatibilityProfile",
  "validatePolicyCompatibilityProfile",
  "assertValidPolicyCompatibilityProfile",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildPolicyCompatibilityProfile({ policyProfile }) {
  const profile = assertValidPolicyProfile(policyProfile);
  const pinning = assertValidPolicyPinningContract(
    buildPolicyPinningContract({ policyProfile: profile })
  );
  const migration = assertValidPolicyMigrationReadinessProfile(
    buildPolicyMigrationReadinessProfile({ policyProfile: profile })
  );

  return {
    kind: POLICY_COMPATIBILITY_KIND,
    version: POLICY_COMPATIBILITY_VERSION,
    schema_id: POLICY_COMPATIBILITY_SCHEMA_ID,
    canonical_action_hash: profile.canonical_action_hash,
    policy_compatibility: {
      stage: POLICY_COMPATIBILITY_STAGE,
      consumer_surface: POLICY_CONSUMER_SURFACE,
      boundary: POLICY_COMPATIBILITY_BOUNDARY,
      policy_ref: {
        kind: POLICY_PROFILE_KIND,
        version: POLICY_PROFILE_VERSION,
        stage: POLICY_PROFILE_STAGE,
        boundary: POLICY_PROFILE_BOUNDARY,
      },
      pinning_contract: pinning,
      migration_readiness_profile: migration,
      receipt_readiness: migration.policy_migration_readiness.receipt_readiness,
      consumer_compatibility:
        migration.policy_migration_readiness.consumer_compatibility,
      stabilization_refs: {
        stabilization_profile_available: true,
        final_acceptance_boundary_available: true,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validatePolicyCompatibilityProfile(profile) {
  const errors = [];

  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: ["policy compatibility profile must be an object"],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(POLICY_COMPATIBILITY_TOP_LEVEL_FIELDS)
  ) {
    errors.push("policy compatibility top-level field order drifted");
  }
  if (profile.kind !== POLICY_COMPATIBILITY_KIND) {
    errors.push("policy compatibility kind drifted");
  }
  if (profile.version !== POLICY_COMPATIBILITY_VERSION) {
    errors.push("policy compatibility version drifted");
  }
  if (profile.schema_id !== POLICY_COMPATIBILITY_SCHEMA_ID) {
    errors.push("policy compatibility schema id drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("policy compatibility canonical_action_hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("policy compatibility must remain deterministic");
  }
  if (profile.enforcing !== false) {
    errors.push("policy compatibility must remain non-enforcing");
  }
  if (!isPlainObject(profile.policy_compatibility)) {
    errors.push("policy compatibility payload must be an object");
    return { ok: errors.length === 0, errors };
  }

  const payload = profile.policy_compatibility;
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(POLICY_COMPATIBILITY_PAYLOAD_FIELDS)
  ) {
    errors.push("policy compatibility payload field order drifted");
  }
  if (payload.stage !== POLICY_COMPATIBILITY_STAGE) {
    errors.push("policy compatibility stage drifted");
  }
  if (payload.consumer_surface !== POLICY_CONSUMER_SURFACE) {
    errors.push("policy compatibility consumer surface drifted");
  }
  if (payload.boundary !== POLICY_COMPATIBILITY_BOUNDARY) {
    errors.push("policy compatibility boundary drifted");
  }
  if (!isPlainObject(payload.policy_ref)) {
    errors.push("policy compatibility ref must be an object");
  } else {
    if (payload.policy_ref.kind !== POLICY_PROFILE_KIND) {
      errors.push("policy compatibility ref kind drifted");
    }
    if (payload.policy_ref.version !== POLICY_PROFILE_VERSION) {
      errors.push("policy compatibility ref version drifted");
    }
    if (payload.policy_ref.stage !== POLICY_PROFILE_STAGE) {
      errors.push("policy compatibility ref stage drifted");
    }
    if (payload.policy_ref.boundary !== POLICY_PROFILE_BOUNDARY) {
      errors.push("policy compatibility ref boundary drifted");
    }
  }
  const pinningValidation = validatePolicyPinningContract(
    payload.pinning_contract
  );
  if (!pinningValidation.ok) {
    errors.push(...pinningValidation.errors);
  }
  const migrationValidation = validatePolicyMigrationReadinessProfile(
    payload.migration_readiness_profile
  );
  if (!migrationValidation.ok) {
    errors.push(...migrationValidation.errors);
  }
  if (!isPlainObject(payload.receipt_readiness)) {
    errors.push("policy compatibility receipt readiness must be an object");
  } else {
    if (payload.receipt_readiness.level !== POLICY_MIGRATION_READY) {
      errors.push("policy compatibility receipt level drifted");
    }
    if (payload.receipt_readiness.pinning_ready !== true) {
      errors.push("policy compatibility pinning readiness drifted");
    }
    if (payload.receipt_readiness.migration_safe !== true) {
      errors.push("policy compatibility migration safety drifted");
    }
    if (payload.receipt_readiness.recommendation_only !== true) {
      errors.push("policy compatibility receipt recommendation boundary drifted");
    }
  }
  if (!isPlainObject(payload.consumer_compatibility)) {
    errors.push("policy compatibility consumer compatibility must be an object");
  } else {
    if (payload.consumer_compatibility.level !== POLICY_CONSUMER_COMPATIBLE) {
      errors.push("policy compatibility level drifted");
    }
    if (payload.consumer_compatibility.additive_only !== true) {
      errors.push("policy compatibility additive boundary drifted");
    }
    if (payload.consumer_compatibility.non_executing !== true) {
      errors.push("policy compatibility execution boundary drifted");
    }
    if (payload.consumer_compatibility.default_off !== true) {
      errors.push("policy compatibility default-off drifted");
    }
    if (
      payload.consumer_compatibility.authority_scope !==
      "review_gate_deny_exit_recommendation_only"
    ) {
      errors.push("policy compatibility authority scope drifted");
    }
    if (payload.consumer_compatibility.denied_exit_code_preserved !== 25) {
      errors.push("policy compatibility deny exit drifted");
    }
  }
  if (!isPlainObject(payload.stabilization_refs)) {
    errors.push("policy stabilization refs must be an object");
  } else {
    if (payload.stabilization_refs.stabilization_profile_available !== true) {
      errors.push("policy stabilization profile availability drifted");
    }
    if (
      payload.stabilization_refs.final_acceptance_boundary_available !== true
    ) {
      errors.push("policy final acceptance availability drifted");
    }
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidPolicyCompatibilityProfile(profile) {
  const validation = validatePolicyCompatibilityProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `policy compatibility profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
