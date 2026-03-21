import {
  POLICY_CONSUMER_SURFACE,
  POLICY_INHERITANCE_CONTRACT_BOUNDARY,
  POLICY_INHERITANCE_CONTRACT_KIND,
  POLICY_INHERITANCE_CONTRACT_VERSION,
  POLICY_PROFILE_BOUNDARY,
  POLICY_PROFILE_KIND,
  POLICY_PROFILE_SCHEMA_ID,
  POLICY_PROFILE_STAGE,
  POLICY_PROFILE_VERSION,
  POLICY_ROLLOUT_READINESS_CONTRACT_BOUNDARY,
  POLICY_ROLLOUT_READINESS_CONTRACT_KIND,
  POLICY_ROLLOUT_READINESS_CONTRACT_VERSION,
} from "./profile.mjs";
import {
  POLICY_PINNING_CONTRACT_BOUNDARY,
  POLICY_PINNING_CONTRACT_KIND,
  POLICY_PINNING_CONTRACT_VERSION,
} from "./pinning.mjs";
import {
  POLICY_MIGRATION_READINESS_BOUNDARY,
  POLICY_MIGRATION_READINESS_KIND,
  POLICY_MIGRATION_READINESS_VERSION,
  POLICY_MIGRATION_READY,
  POLICY_CONSUMER_COMPATIBLE,
} from "./migration.mjs";
import {
  POLICY_COMPATIBILITY_BOUNDARY,
  POLICY_COMPATIBILITY_KIND,
  POLICY_COMPATIBILITY_STAGE,
  POLICY_COMPATIBILITY_VERSION,
} from "./compatibility.mjs";
import {
  POLICY_FINAL_ACCEPTANCE_BOUNDARY,
  POLICY_FINAL_ACCEPTANCE_READY,
  POLICY_STABILIZATION_KIND,
  POLICY_STABILIZATION_STAGE,
  POLICY_STABILIZATION_VERSION,
} from "./stabilization.mjs";

export const POLICY_SURFACE_VERSION = "v1";
export const POLICY_SURFACE_STABILITY = "stable";
export const POLICY_SURFACE_CONSUMER_TIER = "policy_lifecycle_surface";
export const POLICY_SURFACE_ARTIFACT_ORDER = Object.freeze([
  "policy_profile",
  "policy_compatibility",
  "policy_stabilization",
]);
export const POLICY_SURFACE_META_EXPORTS = Object.freeze([
  "POLICY_SURFACE_VERSION",
  "POLICY_SURFACE_STABILITY",
  "POLICY_SURFACE_CONSUMER_TIER",
  "POLICY_SURFACE_ARTIFACT_ORDER",
  "POLICY_SURFACE_META_EXPORTS",
  "POLICY_SURFACE_STABLE_EXPORT_SET",
  "POLICY_SURFACE_MAP",
  "getPolicySurfaceEntry",
  "listPolicySurfaceEntries",
  "validatePolicySurface",
  "assertValidPolicySurface",
]);
export const POLICY_SURFACE_STABLE_EXPORT_SET = Object.freeze([
  ...POLICY_SURFACE_META_EXPORTS,
]);
export const POLICY_SURFACE_MAP = Object.freeze({
  policy_profile: Object.freeze({
    artifact_id: "policy_profile",
    consumer_surface: POLICY_CONSUMER_SURFACE,
    contract: Object.freeze({
      kind: POLICY_PROFILE_KIND,
      version: POLICY_PROFILE_VERSION,
      schema_id: POLICY_PROFILE_SCHEMA_ID,
      stage: POLICY_PROFILE_STAGE,
      boundary: POLICY_PROFILE_BOUNDARY,
    }),
    inheritance_contract: Object.freeze({
      kind: POLICY_INHERITANCE_CONTRACT_KIND,
      version: POLICY_INHERITANCE_CONTRACT_VERSION,
      boundary: POLICY_INHERITANCE_CONTRACT_BOUNDARY,
    }),
    rollout_contract: Object.freeze({
      kind: POLICY_ROLLOUT_READINESS_CONTRACT_KIND,
      version: POLICY_ROLLOUT_READINESS_CONTRACT_VERSION,
      boundary: POLICY_ROLLOUT_READINESS_CONTRACT_BOUNDARY,
    }),
    recommendation_only: true,
    additive_only: true,
    executing: false,
  }),
  policy_compatibility: Object.freeze({
    artifact_id: "policy_compatibility",
    consumer_surface: POLICY_CONSUMER_SURFACE,
    contract: Object.freeze({
      kind: POLICY_COMPATIBILITY_KIND,
      version: POLICY_COMPATIBILITY_VERSION,
      schema_id: "mindforge/policy-compatibility/v1",
      stage: POLICY_COMPATIBILITY_STAGE,
      boundary: POLICY_COMPATIBILITY_BOUNDARY,
    }),
    pinning_contract: Object.freeze({
      kind: POLICY_PINNING_CONTRACT_KIND,
      version: POLICY_PINNING_CONTRACT_VERSION,
      boundary: POLICY_PINNING_CONTRACT_BOUNDARY,
    }),
    migration_contract: Object.freeze({
      kind: POLICY_MIGRATION_READINESS_KIND,
      version: POLICY_MIGRATION_READINESS_VERSION,
      boundary: POLICY_MIGRATION_READINESS_BOUNDARY,
      readiness_level: POLICY_MIGRATION_READY,
      compatibility_level: POLICY_CONSUMER_COMPATIBLE,
    }),
    recommendation_only: true,
    additive_only: true,
    executing: false,
  }),
  policy_stabilization: Object.freeze({
    artifact_id: "policy_stabilization",
    consumer_surface: POLICY_CONSUMER_SURFACE,
    contract: Object.freeze({
      kind: POLICY_STABILIZATION_KIND,
      version: POLICY_STABILIZATION_VERSION,
      schema_id: "mindforge/policy-stabilization/v1",
      stage: POLICY_STABILIZATION_STAGE,
      boundary: POLICY_FINAL_ACCEPTANCE_BOUNDARY,
    }),
    compatibility_contract: Object.freeze({
      kind: POLICY_COMPATIBILITY_KIND,
      version: POLICY_COMPATIBILITY_VERSION,
      boundary: POLICY_COMPATIBILITY_BOUNDARY,
      acceptance_level: POLICY_FINAL_ACCEPTANCE_READY,
    }),
    recommendation_only: true,
    additive_only: true,
    executing: false,
  }),
});

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function getPolicySurfaceEntry(artifactId) {
  return POLICY_SURFACE_MAP[artifactId] ?? null;
}

export function listPolicySurfaceEntries() {
  return POLICY_SURFACE_ARTIFACT_ORDER.map((artifactId) =>
    getPolicySurfaceEntry(artifactId)
  );
}

export function validatePolicySurface() {
  const errors = [];

  if (POLICY_SURFACE_VERSION !== "v1") {
    errors.push("policy surface version drifted");
  }
  if (POLICY_SURFACE_STABILITY !== "stable") {
    errors.push("policy surface stability drifted");
  }
  if (POLICY_SURFACE_CONSUMER_TIER !== "policy_lifecycle_surface") {
    errors.push("policy surface consumer tier drifted");
  }
  if (
    JSON.stringify(POLICY_SURFACE_ARTIFACT_ORDER) !==
    JSON.stringify([
      "policy_profile",
      "policy_compatibility",
      "policy_stabilization",
    ])
  ) {
    errors.push("policy surface artifact order drifted");
  }

  const artifact = POLICY_SURFACE_MAP.policy_profile;
  if (!isPlainObject(artifact)) {
    errors.push("policy surface artifact entry must be an object");
    return { ok: errors.length === 0, errors };
  }
  if (artifact.consumer_surface !== POLICY_CONSUMER_SURFACE) {
    errors.push("policy surface consumer surface drifted");
  }
  if (!isPlainObject(artifact.contract)) {
    errors.push("policy surface contract must be an object");
  } else {
    if (artifact.contract.kind !== POLICY_PROFILE_KIND) {
      errors.push("policy surface contract kind drifted");
    }
    if (artifact.contract.version !== POLICY_PROFILE_VERSION) {
      errors.push("policy surface contract version drifted");
    }
    if (artifact.contract.schema_id !== POLICY_PROFILE_SCHEMA_ID) {
      errors.push("policy surface contract schema drifted");
    }
    if (artifact.contract.stage !== POLICY_PROFILE_STAGE) {
      errors.push("policy surface contract stage drifted");
    }
    if (artifact.contract.boundary !== POLICY_PROFILE_BOUNDARY) {
      errors.push("policy surface contract boundary drifted");
    }
  }
  if (!isPlainObject(artifact.inheritance_contract)) {
    errors.push("policy surface inheritance contract must be an object");
  }
  if (!isPlainObject(artifact.rollout_contract)) {
    errors.push("policy surface rollout contract must be an object");
  }
  if (artifact.recommendation_only !== true) {
    errors.push("policy surface recommendation boundary drifted");
  }
  if (artifact.additive_only !== true) {
    errors.push("policy surface additive boundary drifted");
  }
  if (artifact.executing !== false) {
    errors.push("policy surface executing boundary drifted");
  }
  const compatibilityArtifact = POLICY_SURFACE_MAP.policy_compatibility;
  if (!isPlainObject(compatibilityArtifact)) {
    errors.push("policy compatibility surface artifact entry must be an object");
  } else {
    if (compatibilityArtifact.contract.kind !== POLICY_COMPATIBILITY_KIND) {
      errors.push("policy compatibility contract kind drifted");
    }
    if (
      compatibilityArtifact.pinning_contract.kind !==
      POLICY_PINNING_CONTRACT_KIND
    ) {
      errors.push("policy pinning contract kind drifted");
    }
    if (
      compatibilityArtifact.migration_contract.kind !==
      POLICY_MIGRATION_READINESS_KIND
    ) {
      errors.push("policy migration contract kind drifted");
    }
    if (compatibilityArtifact.recommendation_only !== true) {
      errors.push("policy compatibility recommendation boundary drifted");
    }
    if (compatibilityArtifact.additive_only !== true) {
      errors.push("policy compatibility additive boundary drifted");
    }
    if (compatibilityArtifact.executing !== false) {
      errors.push("policy compatibility execution boundary drifted");
    }
  }
  const stabilizationArtifact = POLICY_SURFACE_MAP.policy_stabilization;
  if (!isPlainObject(stabilizationArtifact)) {
    errors.push("policy stabilization surface artifact entry must be an object");
  } else {
    if (stabilizationArtifact.contract.kind !== POLICY_STABILIZATION_KIND) {
      errors.push("policy stabilization contract kind drifted");
    }
    if (
      stabilizationArtifact.compatibility_contract.kind !==
      POLICY_COMPATIBILITY_KIND
    ) {
      errors.push("policy stabilization compatibility contract kind drifted");
    }
    if (stabilizationArtifact.recommendation_only !== true) {
      errors.push("policy stabilization recommendation boundary drifted");
    }
    if (stabilizationArtifact.additive_only !== true) {
      errors.push("policy stabilization additive boundary drifted");
    }
    if (stabilizationArtifact.executing !== false) {
      errors.push("policy stabilization execution boundary drifted");
    }
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidPolicySurface() {
  const validation = validatePolicySurface();
  if (validation.ok) return POLICY_SURFACE_MAP;

  const err = new Error(
    `policy surface invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
