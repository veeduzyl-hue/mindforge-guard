import {
  ENFORCEMENT_CONSUMER_SURFACE,
  ENFORCEMENT_READINESS_BOUNDARY,
  ENFORCEMENT_READINESS_KIND,
  ENFORCEMENT_READINESS_SCHEMA_ID,
  ENFORCEMENT_READINESS_STAGE,
  ENFORCEMENT_READINESS_VERSION,
  ENFORCEMENT_SCOPE_CONTRACT_BOUNDARY,
  ENFORCEMENT_SCOPE_CONTRACT_KIND,
  ENFORCEMENT_SCOPE_CONTRACT_VERSION,
} from "./profile.mjs";

export const ENFORCEMENT_SURFACE_VERSION = "v1";
export const ENFORCEMENT_SURFACE_STABILITY = "stable";
export const ENFORCEMENT_SURFACE_CONSUMER_TIER =
  "bounded_enforcement_readiness_surface";
export const ENFORCEMENT_SURFACE_ARTIFACT_ORDER = Object.freeze([
  "bounded_enforcement_readiness",
  "enforcement_compatibility",
  "enforcement_stabilization",
]);
export const ENFORCEMENT_SURFACE_META_EXPORTS = Object.freeze([
  "ENFORCEMENT_SURFACE_VERSION",
  "ENFORCEMENT_SURFACE_STABILITY",
  "ENFORCEMENT_SURFACE_CONSUMER_TIER",
  "ENFORCEMENT_SURFACE_ARTIFACT_ORDER",
  "ENFORCEMENT_SURFACE_META_EXPORTS",
  "ENFORCEMENT_SURFACE_STABLE_EXPORT_SET",
  "ENFORCEMENT_SURFACE_MAP",
  "getEnforcementSurfaceEntry",
  "listEnforcementSurfaceEntries",
  "validateEnforcementSurface",
  "assertValidEnforcementSurface",
]);
export const ENFORCEMENT_SURFACE_STABLE_EXPORT_SET = Object.freeze([
  ...ENFORCEMENT_SURFACE_META_EXPORTS,
]);
export const ENFORCEMENT_SURFACE_MAP = Object.freeze({
  bounded_enforcement_readiness: Object.freeze({
    artifact_id: "bounded_enforcement_readiness",
    consumer_surface: ENFORCEMENT_CONSUMER_SURFACE,
    contract: Object.freeze({
      kind: ENFORCEMENT_READINESS_KIND,
      version: ENFORCEMENT_READINESS_VERSION,
      schema_id: ENFORCEMENT_READINESS_SCHEMA_ID,
      stage: ENFORCEMENT_READINESS_STAGE,
      boundary: ENFORCEMENT_READINESS_BOUNDARY,
    }),
    scope_contract: Object.freeze({
      kind: ENFORCEMENT_SCOPE_CONTRACT_KIND,
      version: ENFORCEMENT_SCOPE_CONTRACT_VERSION,
      boundary: ENFORCEMENT_SCOPE_CONTRACT_BOUNDARY,
    }),
    recommendation_only: true,
    additive_only: true,
    executing: false,
  }),
  enforcement_compatibility: Object.freeze({
    artifact_id: "enforcement_compatibility",
    consumer_surface: ENFORCEMENT_CONSUMER_SURFACE,
    contract: Object.freeze({
      kind: "enforcement_compatibility_readiness_profile",
      version: "v1",
      schema_id: "mindforge/enforcement-compatibility/v1",
      stage: "enforcement_compatibility_phase2_v1",
      boundary: "authority_proof_and_rollback_safety_consumer_compatibility",
    }),
    proof_contract: Object.freeze({
      kind: "authority_proof_contract",
      version: "v1",
      boundary: "bounded_non_executing_authority_proof",
    }),
    rollback_contract: Object.freeze({
      kind: "rollback_safety_contract",
      version: "v1",
      boundary: "bounded_non_executing_rollback_safety",
    }),
    recommendation_only: true,
    additive_only: true,
    executing: false,
  }),
  enforcement_stabilization: Object.freeze({
    artifact_id: "enforcement_stabilization",
    consumer_surface: ENFORCEMENT_CONSUMER_SURFACE,
    contract: Object.freeze({
      kind: "enforcement_stabilization_profile",
      version: "v1",
      schema_id: "mindforge/enforcement-stabilization/v1",
      stage: "enforcement_stabilization_phase3_v1",
      boundary: "final_bounded_enforcement_consumer_contract",
    }),
    recommendation_only: true,
    additive_only: true,
    executing: false,
  }),
});

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function getEnforcementSurfaceEntry(artifactId) {
  return ENFORCEMENT_SURFACE_MAP[artifactId] ?? null;
}

export function listEnforcementSurfaceEntries() {
  return ENFORCEMENT_SURFACE_ARTIFACT_ORDER.map((artifactId) =>
    getEnforcementSurfaceEntry(artifactId)
  );
}

export function validateEnforcementSurface() {
  const errors = [];

  if (ENFORCEMENT_SURFACE_VERSION !== "v1") {
    errors.push("enforcement surface version drifted");
  }
  if (ENFORCEMENT_SURFACE_STABILITY !== "stable") {
    errors.push("enforcement surface stability drifted");
  }
  if (
    ENFORCEMENT_SURFACE_CONSUMER_TIER !==
    "bounded_enforcement_readiness_surface"
  ) {
    errors.push("enforcement surface consumer tier drifted");
  }
  if (
    JSON.stringify(ENFORCEMENT_SURFACE_ARTIFACT_ORDER) !==
    JSON.stringify([
      "bounded_enforcement_readiness",
      "enforcement_compatibility",
      "enforcement_stabilization",
    ])
  ) {
    errors.push("enforcement surface artifact order drifted");
  }

  const artifact = ENFORCEMENT_SURFACE_MAP.bounded_enforcement_readiness;
  if (!isPlainObject(artifact)) {
    errors.push("enforcement surface artifact entry must be an object");
    return { ok: errors.length === 0, errors };
  }
  if (artifact.consumer_surface !== ENFORCEMENT_CONSUMER_SURFACE) {
    errors.push("enforcement surface consumer surface drifted");
  }
  if (!isPlainObject(artifact.contract)) {
    errors.push("enforcement surface contract must be an object");
  } else {
    if (artifact.contract.kind !== ENFORCEMENT_READINESS_KIND) {
      errors.push("enforcement surface contract kind drifted");
    }
    if (artifact.contract.version !== ENFORCEMENT_READINESS_VERSION) {
      errors.push("enforcement surface contract version drifted");
    }
    if (artifact.contract.schema_id !== ENFORCEMENT_READINESS_SCHEMA_ID) {
      errors.push("enforcement surface contract schema id drifted");
    }
    if (artifact.contract.stage !== ENFORCEMENT_READINESS_STAGE) {
      errors.push("enforcement surface contract stage drifted");
    }
    if (artifact.contract.boundary !== ENFORCEMENT_READINESS_BOUNDARY) {
      errors.push("enforcement surface contract boundary drifted");
    }
  }
  if (!isPlainObject(artifact.scope_contract)) {
    errors.push("enforcement surface scope contract must be an object");
  } else {
    if (artifact.scope_contract.kind !== ENFORCEMENT_SCOPE_CONTRACT_KIND) {
      errors.push("enforcement surface scope kind drifted");
    }
    if (
      artifact.scope_contract.version !== ENFORCEMENT_SCOPE_CONTRACT_VERSION
    ) {
      errors.push("enforcement surface scope version drifted");
    }
    if (
      artifact.scope_contract.boundary !== ENFORCEMENT_SCOPE_CONTRACT_BOUNDARY
    ) {
      errors.push("enforcement surface scope boundary drifted");
    }
  }
  if (artifact.recommendation_only !== true) {
    errors.push("enforcement surface must remain recommendation-only");
  }
  if (artifact.additive_only !== true) {
    errors.push("enforcement surface must remain additive-only");
  }
  if (artifact.executing !== false) {
    errors.push("enforcement surface must remain non-executing");
  }

  const compatibility = ENFORCEMENT_SURFACE_MAP.enforcement_compatibility;
  if (!isPlainObject(compatibility)) {
    errors.push("enforcement compatibility surface entry must be an object");
    return { ok: errors.length === 0, errors };
  }
  if (compatibility.consumer_surface !== ENFORCEMENT_CONSUMER_SURFACE) {
    errors.push("enforcement compatibility consumer surface drifted");
  }
  if (!isPlainObject(compatibility.contract)) {
    errors.push("enforcement compatibility contract must be an object");
  }
  if (!isPlainObject(compatibility.proof_contract)) {
    errors.push("enforcement compatibility proof contract must be an object");
  }
  if (!isPlainObject(compatibility.rollback_contract)) {
    errors.push("enforcement compatibility rollback contract must be an object");
  }
  if (compatibility.recommendation_only !== true) {
    errors.push("enforcement compatibility must remain recommendation-only");
  }
  if (compatibility.additive_only !== true) {
    errors.push("enforcement compatibility must remain additive-only");
  }
  if (compatibility.executing !== false) {
    errors.push("enforcement compatibility must remain non-executing");
  }

  const stabilization = ENFORCEMENT_SURFACE_MAP.enforcement_stabilization;
  if (!isPlainObject(stabilization)) {
    errors.push("enforcement stabilization surface entry must be an object");
    return { ok: errors.length === 0, errors };
  }
  if (stabilization.consumer_surface !== ENFORCEMENT_CONSUMER_SURFACE) {
    errors.push("enforcement stabilization consumer surface drifted");
  }
  if (!isPlainObject(stabilization.contract)) {
    errors.push("enforcement stabilization contract must be an object");
  }
  if (stabilization.recommendation_only !== true) {
    errors.push("enforcement stabilization must remain recommendation-only");
  }
  if (stabilization.additive_only !== true) {
    errors.push("enforcement stabilization must remain additive-only");
  }
  if (stabilization.executing !== false) {
    errors.push("enforcement stabilization must remain non-executing");
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidEnforcementSurface() {
  const validation = validateEnforcementSurface();
  if (validation.ok) return ENFORCEMENT_SURFACE_MAP;

  const err = new Error(
    `enforcement surface invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
