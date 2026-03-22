import {
  GOVERNANCE_EXCEPTION_CONSUMER_SURFACE,
  GOVERNANCE_EXCEPTION_CONTRACT_BOUNDARY,
  GOVERNANCE_EXCEPTION_CONTRACT_KIND,
  GOVERNANCE_EXCEPTION_CONTRACT_VERSION,
  GOVERNANCE_EXCEPTION_PROFILE_BOUNDARY,
  GOVERNANCE_EXCEPTION_PROFILE_KIND,
  GOVERNANCE_EXCEPTION_PROFILE_SCHEMA_ID,
  GOVERNANCE_EXCEPTION_PROFILE_STAGE,
  GOVERNANCE_EXCEPTION_PROFILE_VERSION,
  GOVERNANCE_WAIVER_CONTRACT_BOUNDARY,
  GOVERNANCE_WAIVER_CONTRACT_KIND,
  GOVERNANCE_WAIVER_CONTRACT_VERSION,
} from "./profile.mjs";
import {
  GOVERNANCE_CASE_LINKAGE_BOUNDARY as CASE_LINKAGE_BOUNDARY,
  GOVERNANCE_CASE_LINKAGE_KIND as CASE_LINKAGE_KIND,
  GOVERNANCE_CASE_LINKAGE_SCHEMA_ID as CASE_LINKAGE_SCHEMA_ID,
  GOVERNANCE_CASE_LINKAGE_STAGE as CASE_LINKAGE_STAGE,
  GOVERNANCE_CASE_LINKAGE_VERSION as CASE_LINKAGE_VERSION,
  GOVERNANCE_EXCEPTION_CONSUMER_COMPATIBLE as EXCEPTION_CONSUMER_COMPATIBLE,
  GOVERNANCE_EXCEPTION_RECEIPT_READY as EXCEPTION_RECEIPT_READY,
} from "./caseLinkage.mjs";
import {
  GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_BOUNDARY as EXCEPTION_COMPATIBILITY_BOUNDARY,
  GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_KIND as EXCEPTION_COMPATIBILITY_KIND,
  GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_VERSION as EXCEPTION_COMPATIBILITY_VERSION,
} from "./compatibility.mjs";

export const GOVERNANCE_EXCEPTION_SURFACE_VERSION = "v1";
export const GOVERNANCE_EXCEPTION_SURFACE_STABILITY = "stable";
export const GOVERNANCE_EXCEPTION_SURFACE_CONSUMER_TIER =
  "governance_exception_surface";
export const GOVERNANCE_EXCEPTION_SURFACE_ARTIFACT_ORDER = Object.freeze([
  "governance_exception",
  "governance_exception_override_record",
]);
export const GOVERNANCE_EXCEPTION_SURFACE_META_EXPORTS = Object.freeze([
  "GOVERNANCE_EXCEPTION_SURFACE_VERSION",
  "GOVERNANCE_EXCEPTION_SURFACE_STABILITY",
  "GOVERNANCE_EXCEPTION_SURFACE_CONSUMER_TIER",
  "GOVERNANCE_EXCEPTION_SURFACE_ARTIFACT_ORDER",
  "GOVERNANCE_EXCEPTION_SURFACE_META_EXPORTS",
  "GOVERNANCE_EXCEPTION_SURFACE_STABLE_EXPORT_SET",
  "GOVERNANCE_EXCEPTION_SURFACE_MAP",
  "getGovernanceExceptionSurfaceEntry",
  "listGovernanceExceptionSurfaceEntries",
  "validateGovernanceExceptionSurface",
  "assertValidGovernanceExceptionSurface",
]);
export const GOVERNANCE_EXCEPTION_SURFACE_STABLE_EXPORT_SET = Object.freeze([
  ...GOVERNANCE_EXCEPTION_SURFACE_META_EXPORTS,
]);
export const GOVERNANCE_EXCEPTION_SURFACE_MAP = Object.freeze({
  governance_exception: Object.freeze({
    artifact_id: "governance_exception",
    consumer_surface: GOVERNANCE_EXCEPTION_CONSUMER_SURFACE,
    contract: Object.freeze({
      kind: GOVERNANCE_EXCEPTION_PROFILE_KIND,
      version: GOVERNANCE_EXCEPTION_PROFILE_VERSION,
      schema_id: GOVERNANCE_EXCEPTION_PROFILE_SCHEMA_ID,
      stage: GOVERNANCE_EXCEPTION_PROFILE_STAGE,
      boundary: GOVERNANCE_EXCEPTION_PROFILE_BOUNDARY,
    }),
    exception_contract: Object.freeze({
      kind: GOVERNANCE_EXCEPTION_CONTRACT_KIND,
      version: GOVERNANCE_EXCEPTION_CONTRACT_VERSION,
      boundary: GOVERNANCE_EXCEPTION_CONTRACT_BOUNDARY,
    }),
    waiver_contract: Object.freeze({
      kind: GOVERNANCE_WAIVER_CONTRACT_KIND,
      version: GOVERNANCE_WAIVER_CONTRACT_VERSION,
      boundary: GOVERNANCE_WAIVER_CONTRACT_BOUNDARY,
    }),
    recommendation_only: true,
    additive_only: true,
    executing: false,
  }),
  governance_exception_override_record: Object.freeze({
    artifact_id: "governance_exception_override_record",
    consumer_surface: GOVERNANCE_EXCEPTION_CONSUMER_SURFACE,
    contract: Object.freeze({
      kind: CASE_LINKAGE_KIND,
      version: CASE_LINKAGE_VERSION,
      schema_id: CASE_LINKAGE_SCHEMA_ID,
      stage: CASE_LINKAGE_STAGE,
      boundary: CASE_LINKAGE_BOUNDARY,
    }),
    compatibility_contract: Object.freeze({
      kind: EXCEPTION_COMPATIBILITY_KIND,
      version: EXCEPTION_COMPATIBILITY_VERSION,
      boundary: EXCEPTION_COMPATIBILITY_BOUNDARY,
      receipt_level: EXCEPTION_RECEIPT_READY,
      compatibility_level: EXCEPTION_CONSUMER_COMPATIBLE,
    }),
    recommendation_only: true,
    additive_only: true,
    executing: false,
  }),
});

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function getGovernanceExceptionSurfaceEntry(artifactId) {
  return GOVERNANCE_EXCEPTION_SURFACE_MAP[artifactId] ?? null;
}

export function listGovernanceExceptionSurfaceEntries() {
  return GOVERNANCE_EXCEPTION_SURFACE_ARTIFACT_ORDER.map((artifactId) =>
    getGovernanceExceptionSurfaceEntry(artifactId)
  );
}

export function validateGovernanceExceptionSurface() {
  const errors = [];

  if (GOVERNANCE_EXCEPTION_SURFACE_VERSION !== "v1") {
    errors.push("governance exception surface version drifted");
  }
  if (GOVERNANCE_EXCEPTION_SURFACE_STABILITY !== "stable") {
    errors.push("governance exception surface stability drifted");
  }
  if (
    GOVERNANCE_EXCEPTION_SURFACE_CONSUMER_TIER !==
    "governance_exception_surface"
  ) {
    errors.push("governance exception surface consumer tier drifted");
  }
  if (
    JSON.stringify(GOVERNANCE_EXCEPTION_SURFACE_ARTIFACT_ORDER) !==
    JSON.stringify(["governance_exception", "governance_exception_override_record"])
  ) {
    errors.push("governance exception surface artifact order drifted");
  }

  const artifact = GOVERNANCE_EXCEPTION_SURFACE_MAP.governance_exception;
  if (!isPlainObject(artifact)) {
    errors.push("governance exception surface entry must be an object");
    return { ok: false, errors };
  }
  if (artifact.consumer_surface !== GOVERNANCE_EXCEPTION_CONSUMER_SURFACE) {
    errors.push("governance exception surface consumer surface drifted");
  }
  if (!isPlainObject(artifact.contract)) {
    errors.push("governance exception surface contract missing");
  } else {
    if (artifact.contract.kind !== GOVERNANCE_EXCEPTION_PROFILE_KIND) {
      errors.push("governance exception surface contract kind drifted");
    }
    if (artifact.contract.version !== GOVERNANCE_EXCEPTION_PROFILE_VERSION) {
      errors.push("governance exception surface contract version drifted");
    }
    if (artifact.contract.schema_id !== GOVERNANCE_EXCEPTION_PROFILE_SCHEMA_ID) {
      errors.push("governance exception surface contract schema drifted");
    }
    if (artifact.contract.stage !== GOVERNANCE_EXCEPTION_PROFILE_STAGE) {
      errors.push("governance exception surface contract stage drifted");
    }
    if (artifact.contract.boundary !== GOVERNANCE_EXCEPTION_PROFILE_BOUNDARY) {
      errors.push("governance exception surface contract boundary drifted");
    }
  }
  if (!isPlainObject(artifact.exception_contract)) {
    errors.push("governance exception surface exception contract missing");
  }
  if (!isPlainObject(artifact.waiver_contract)) {
    errors.push("governance exception surface waiver contract missing");
  }
  if (artifact.recommendation_only !== true) {
    errors.push("governance exception surface recommendation boundary drifted");
  }
  if (artifact.additive_only !== true) {
    errors.push("governance exception surface additive boundary drifted");
  }
  if (artifact.executing !== false) {
    errors.push("governance exception surface execution boundary drifted");
  }
  const overrideArtifact =
    GOVERNANCE_EXCEPTION_SURFACE_MAP.governance_exception_override_record;
  if (!isPlainObject(overrideArtifact)) {
    errors.push("governance exception override surface entry must be an object");
  } else {
    if (overrideArtifact.contract.kind !== CASE_LINKAGE_KIND) {
      errors.push("governance exception override contract kind drifted");
    }
    if (
      overrideArtifact.compatibility_contract.kind !== EXCEPTION_COMPATIBILITY_KIND
    ) {
      errors.push("governance exception override compatibility contract drifted");
    }
    if (overrideArtifact.recommendation_only !== true) {
      errors.push("governance exception override recommendation boundary drifted");
    }
    if (overrideArtifact.additive_only !== true) {
      errors.push("governance exception override additive boundary drifted");
    }
    if (overrideArtifact.executing !== false) {
      errors.push("governance exception override execution boundary drifted");
    }
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceExceptionSurface() {
  const validation = validateGovernanceExceptionSurface();
  if (validation.ok) return GOVERNANCE_EXCEPTION_SURFACE_MAP;

  const err = new Error(
    `governance exception surface invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
