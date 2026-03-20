import {
  APPROVAL_ARTIFACT_BOUNDARY,
  APPROVAL_ARTIFACT_KIND,
  APPROVAL_ARTIFACT_SCHEMA_ID,
  APPROVAL_ARTIFACT_STAGE,
  APPROVAL_ARTIFACT_VERSION,
  APPROVAL_CONSUMER_SURFACE,
  APPROVAL_EXCEPTION_CONTRACT_BOUNDARY,
  APPROVAL_EXCEPTION_CONTRACT_KIND,
  APPROVAL_EXCEPTION_CONTRACT_VERSION,
} from "./profile.mjs";

export const APPROVAL_SURFACE_VERSION = "v1";
export const APPROVAL_SURFACE_STABILITY = "stable";
export const APPROVAL_SURFACE_CONSUMER_TIER = "approval_adjacent_surface";
export const APPROVAL_SURFACE_ARTIFACT_ORDER = Object.freeze([
  "approval_artifact",
]);
export const APPROVAL_SURFACE_META_EXPORTS = Object.freeze([
  "APPROVAL_SURFACE_VERSION",
  "APPROVAL_SURFACE_STABILITY",
  "APPROVAL_SURFACE_CONSUMER_TIER",
  "APPROVAL_SURFACE_ARTIFACT_ORDER",
  "APPROVAL_SURFACE_META_EXPORTS",
  "APPROVAL_SURFACE_STABLE_EXPORT_SET",
  "APPROVAL_SURFACE_MAP",
  "getApprovalSurfaceEntry",
  "listApprovalSurfaceEntries",
  "validateApprovalSurface",
  "assertValidApprovalSurface",
]);
export const APPROVAL_SURFACE_STABLE_EXPORT_SET = Object.freeze([
  ...APPROVAL_SURFACE_META_EXPORTS,
]);
export const APPROVAL_SURFACE_MAP = Object.freeze({
  approval_artifact: Object.freeze({
    artifact_id: "approval_artifact",
    consumer_surface: APPROVAL_CONSUMER_SURFACE,
    contract: Object.freeze({
      kind: APPROVAL_ARTIFACT_KIND,
      version: APPROVAL_ARTIFACT_VERSION,
      schema_id: APPROVAL_ARTIFACT_SCHEMA_ID,
      stage: APPROVAL_ARTIFACT_STAGE,
      boundary: APPROVAL_ARTIFACT_BOUNDARY,
    }),
    exception_contract: Object.freeze({
      kind: APPROVAL_EXCEPTION_CONTRACT_KIND,
      version: APPROVAL_EXCEPTION_CONTRACT_VERSION,
      boundary: APPROVAL_EXCEPTION_CONTRACT_BOUNDARY,
    }),
    recommendation_only: true,
    additive_only: true,
    executing: false,
  }),
});

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function getApprovalSurfaceEntry(artifactId) {
  return APPROVAL_SURFACE_MAP[artifactId] ?? null;
}

export function listApprovalSurfaceEntries() {
  return APPROVAL_SURFACE_ARTIFACT_ORDER.map((artifactId) =>
    getApprovalSurfaceEntry(artifactId)
  );
}

export function validateApprovalSurface() {
  const errors = [];

  if (APPROVAL_SURFACE_VERSION !== "v1") {
    errors.push("approval surface version drifted");
  }
  if (APPROVAL_SURFACE_STABILITY !== "stable") {
    errors.push("approval surface stability drifted");
  }
  if (APPROVAL_SURFACE_CONSUMER_TIER !== "approval_adjacent_surface") {
    errors.push("approval surface consumer tier drifted");
  }
  if (
    JSON.stringify(APPROVAL_SURFACE_ARTIFACT_ORDER) !==
    JSON.stringify(["approval_artifact"])
  ) {
    errors.push("approval surface artifact order drifted");
  }
  if (!isPlainObject(APPROVAL_SURFACE_MAP.approval_artifact)) {
    errors.push("approval surface artifact entry must be an object");
  } else {
    const artifact = APPROVAL_SURFACE_MAP.approval_artifact;
    if (artifact.consumer_surface !== APPROVAL_CONSUMER_SURFACE) {
      errors.push("approval surface consumer surface drifted");
    }
    if (!isPlainObject(artifact.contract)) {
      errors.push("approval surface contract entry must be an object");
    } else {
      if (artifact.contract.kind !== APPROVAL_ARTIFACT_KIND) {
        errors.push("approval surface contract kind drifted");
      }
      if (artifact.contract.version !== APPROVAL_ARTIFACT_VERSION) {
        errors.push("approval surface contract version drifted");
      }
      if (artifact.contract.schema_id !== APPROVAL_ARTIFACT_SCHEMA_ID) {
        errors.push("approval surface contract schema id drifted");
      }
      if (artifact.contract.stage !== APPROVAL_ARTIFACT_STAGE) {
        errors.push("approval surface contract stage drifted");
      }
      if (artifact.contract.boundary !== APPROVAL_ARTIFACT_BOUNDARY) {
        errors.push("approval surface contract boundary drifted");
      }
    }
    if (!isPlainObject(artifact.exception_contract)) {
      errors.push("approval surface exception contract entry must be an object");
    } else {
      if (artifact.exception_contract.kind !== APPROVAL_EXCEPTION_CONTRACT_KIND) {
        errors.push("approval surface exception contract kind drifted");
      }
      if (
        artifact.exception_contract.version !==
        APPROVAL_EXCEPTION_CONTRACT_VERSION
      ) {
        errors.push("approval surface exception contract version drifted");
      }
      if (
        artifact.exception_contract.boundary !==
        APPROVAL_EXCEPTION_CONTRACT_BOUNDARY
      ) {
        errors.push("approval surface exception contract boundary drifted");
      }
    }
    if (artifact.recommendation_only !== true) {
      errors.push("approval surface must remain recommendation-only");
    }
    if (artifact.additive_only !== true) {
      errors.push("approval surface must remain additive-only");
    }
    if (artifact.executing !== false) {
      errors.push("approval surface must remain non-executing");
    }
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidApprovalSurface() {
  const validation = validateApprovalSurface();
  if (validation.ok) return APPROVAL_SURFACE_MAP;

  const err = new Error(
    `approval surface invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
