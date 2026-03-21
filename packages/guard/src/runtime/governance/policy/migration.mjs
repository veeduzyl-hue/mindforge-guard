import {
  POLICY_CONSUMER_SURFACE,
  POLICY_PROFILE_BOUNDARY,
  POLICY_PROFILE_KIND,
  POLICY_PROFILE_STAGE,
  POLICY_PROFILE_VERSION,
  assertValidPolicyProfile,
} from "./profile.mjs";
import {
  POLICY_PINNING_CONTRACT_BOUNDARY,
  POLICY_PINNING_CONTRACT_KIND,
  POLICY_PINNING_CONTRACT_VERSION,
  assertValidPolicyPinningContract,
  buildPolicyPinningContract,
  validatePolicyPinningContract,
} from "./pinning.mjs";

export const POLICY_MIGRATION_READINESS_KIND =
  "policy_migration_readiness_profile";
export const POLICY_MIGRATION_READINESS_VERSION = "v1";
export const POLICY_MIGRATION_READINESS_SCHEMA_ID =
  "mindforge/policy-migration-readiness/v1";
export const POLICY_MIGRATION_READINESS_STAGE =
  "policy_compatibility_phase2_v1";
export const POLICY_MIGRATION_READINESS_BOUNDARY =
  "bounded_policy_migration_readiness_contract";
export const POLICY_MIGRATION_READY = "migration_ready";
export const POLICY_CONSUMER_COMPATIBLE = "consumer_compatible";
export const POLICY_MIGRATION_READINESS_LEVELS = Object.freeze([
  POLICY_MIGRATION_READY,
  POLICY_CONSUMER_COMPATIBLE,
]);
export const POLICY_MIGRATION_READINESS_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "policy_migration_readiness",
  "deterministic",
  "enforcing",
]);
export const POLICY_MIGRATION_READINESS_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "policy_ref",
  "pinning_contract",
  "migration_contract",
  "receipt_readiness",
  "consumer_compatibility",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildPolicyMigrationReadinessProfile({ policyProfile }) {
  const profile = assertValidPolicyProfile(policyProfile);
  const pinning = assertValidPolicyPinningContract(
    buildPolicyPinningContract({ policyProfile: profile })
  );

  return {
    kind: POLICY_MIGRATION_READINESS_KIND,
    version: POLICY_MIGRATION_READINESS_VERSION,
    schema_id: POLICY_MIGRATION_READINESS_SCHEMA_ID,
    canonical_action_hash: profile.canonical_action_hash,
    policy_migration_readiness: {
      stage: POLICY_MIGRATION_READINESS_STAGE,
      consumer_surface: POLICY_CONSUMER_SURFACE,
      boundary: POLICY_MIGRATION_READINESS_BOUNDARY,
      policy_ref: {
        kind: POLICY_PROFILE_KIND,
        version: POLICY_PROFILE_VERSION,
        stage: POLICY_PROFILE_STAGE,
        boundary: POLICY_PROFILE_BOUNDARY,
      },
      pinning_contract: pinning,
      migration_contract: {
        readiness_only: true,
        additive_only: true,
        non_executing: true,
        default_on: false,
        policy_receipt_ready: true,
        migration_safe: true,
      },
      receipt_readiness: {
        level: POLICY_MIGRATION_READY,
        pinning_ready: true,
        migration_safe: true,
        recommendation_only: true,
      },
      consumer_compatibility: {
        level: POLICY_CONSUMER_COMPATIBLE,
        additive_only: true,
        non_executing: true,
        default_off: true,
        authority_scope: pinning.authority_scope,
        denied_exit_code_preserved: 25,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validatePolicyMigrationReadinessProfile(profile) {
  const errors = [];

  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: ["policy migration readiness profile must be an object"],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(POLICY_MIGRATION_READINESS_TOP_LEVEL_FIELDS)
  ) {
    errors.push("policy migration readiness top-level field order drifted");
  }
  if (profile.kind !== POLICY_MIGRATION_READINESS_KIND) {
    errors.push("policy migration readiness kind drifted");
  }
  if (profile.version !== POLICY_MIGRATION_READINESS_VERSION) {
    errors.push("policy migration readiness version drifted");
  }
  if (profile.schema_id !== POLICY_MIGRATION_READINESS_SCHEMA_ID) {
    errors.push("policy migration readiness schema id drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("policy migration readiness canonical_action_hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("policy migration readiness must remain deterministic");
  }
  if (profile.enforcing !== false) {
    errors.push("policy migration readiness must remain non-enforcing");
  }
  if (!isPlainObject(profile.policy_migration_readiness)) {
    errors.push("policy migration readiness payload must be an object");
    return { ok: errors.length === 0, errors };
  }

  const payload = profile.policy_migration_readiness;
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(POLICY_MIGRATION_READINESS_PAYLOAD_FIELDS)
  ) {
    errors.push("policy migration readiness payload field order drifted");
  }
  if (payload.stage !== POLICY_MIGRATION_READINESS_STAGE) {
    errors.push("policy migration readiness stage drifted");
  }
  if (payload.consumer_surface !== POLICY_CONSUMER_SURFACE) {
    errors.push("policy migration readiness consumer surface drifted");
  }
  if (payload.boundary !== POLICY_MIGRATION_READINESS_BOUNDARY) {
    errors.push("policy migration readiness boundary drifted");
  }
  if (!isPlainObject(payload.policy_ref)) {
    errors.push("policy migration readiness ref must be an object");
  } else {
    if (payload.policy_ref.kind !== POLICY_PROFILE_KIND) {
      errors.push("policy migration readiness ref kind drifted");
    }
    if (payload.policy_ref.version !== POLICY_PROFILE_VERSION) {
      errors.push("policy migration readiness ref version drifted");
    }
    if (payload.policy_ref.stage !== POLICY_PROFILE_STAGE) {
      errors.push("policy migration readiness ref stage drifted");
    }
    if (payload.policy_ref.boundary !== POLICY_PROFILE_BOUNDARY) {
      errors.push("policy migration readiness ref boundary drifted");
    }
  }
  const pinningValidation = validatePolicyPinningContract(
    payload.pinning_contract
  );
  if (!pinningValidation.ok) {
    errors.push(...pinningValidation.errors);
  }
  if (!isPlainObject(payload.migration_contract)) {
    errors.push("policy migration contract must be an object");
  } else {
    if (payload.migration_contract.readiness_only !== true) {
      errors.push("policy migration readiness drifted");
    }
    if (payload.migration_contract.additive_only !== true) {
      errors.push("policy migration additive boundary drifted");
    }
    if (payload.migration_contract.non_executing !== true) {
      errors.push("policy migration execution boundary drifted");
    }
    if (payload.migration_contract.default_on !== false) {
      errors.push("policy migration default-on boundary drifted");
    }
    if (payload.migration_contract.policy_receipt_ready !== true) {
      errors.push("policy receipt readiness drifted");
    }
    if (payload.migration_contract.migration_safe !== true) {
      errors.push("policy migration safety drifted");
    }
  }
  if (!isPlainObject(payload.receipt_readiness)) {
    errors.push("policy receipt readiness must be an object");
  } else {
    if (payload.receipt_readiness.level !== POLICY_MIGRATION_READY) {
      errors.push("policy receipt readiness level drifted");
    }
    if (payload.receipt_readiness.pinning_ready !== true) {
      errors.push("policy pinning readiness drifted");
    }
    if (payload.receipt_readiness.migration_safe !== true) {
      errors.push("policy migration receipt safety drifted");
    }
    if (payload.receipt_readiness.recommendation_only !== true) {
      errors.push("policy receipt recommendation boundary drifted");
    }
  }
  if (!isPlainObject(payload.consumer_compatibility)) {
    errors.push("policy consumer compatibility must be an object");
  } else {
    if (payload.consumer_compatibility.level !== POLICY_CONSUMER_COMPATIBLE) {
      errors.push("policy consumer compatibility level drifted");
    }
    if (payload.consumer_compatibility.additive_only !== true) {
      errors.push("policy consumer additive boundary drifted");
    }
    if (payload.consumer_compatibility.non_executing !== true) {
      errors.push("policy consumer execution boundary drifted");
    }
    if (payload.consumer_compatibility.default_off !== true) {
      errors.push("policy consumer default-off boundary drifted");
    }
    if (
      payload.consumer_compatibility.authority_scope !==
      "review_gate_deny_exit_recommendation_only"
    ) {
      errors.push("policy consumer authority scope drifted");
    }
    if (payload.consumer_compatibility.denied_exit_code_preserved !== 25) {
      errors.push("policy consumer deny exit drifted");
    }
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidPolicyMigrationReadinessProfile(profile) {
  const validation = validatePolicyMigrationReadinessProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `policy migration readiness profile invalid: ${validation.errors.join(
      "; "
    )}`
  );
  err.validation = validation;
  throw err;
}
