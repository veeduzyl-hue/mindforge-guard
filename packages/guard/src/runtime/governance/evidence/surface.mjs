import {
  GOVERNANCE_EVIDENCE_CONSUMER_SURFACE,
  GOVERNANCE_EVIDENCE_PROFILE_BOUNDARY,
  GOVERNANCE_EVIDENCE_PROFILE_KIND,
  GOVERNANCE_EVIDENCE_PROFILE_SCHEMA_ID,
  GOVERNANCE_EVIDENCE_PROFILE_STAGE,
  GOVERNANCE_EVIDENCE_PROFILE_VERSION,
  GOVERNANCE_LINEAGE_CONTRACT_BOUNDARY,
  GOVERNANCE_LINEAGE_CONTRACT_KIND,
  GOVERNANCE_LINEAGE_CONTRACT_VERSION,
  GOVERNANCE_PROVENANCE_CONTRACT_BOUNDARY,
  GOVERNANCE_PROVENANCE_CONTRACT_KIND,
  GOVERNANCE_PROVENANCE_CONTRACT_VERSION,
} from "./profile.mjs";

export const GOVERNANCE_EVIDENCE_SURFACE_VERSION = "v1";
export const GOVERNANCE_EVIDENCE_SURFACE_STABILITY = "stable";
export const GOVERNANCE_EVIDENCE_SURFACE_CONSUMER_TIER =
  "governance_evidence_surface";
export const GOVERNANCE_EVIDENCE_SURFACE_ARTIFACT_ORDER = Object.freeze([
  "governance_evidence",
]);
export const GOVERNANCE_EVIDENCE_SURFACE_META_EXPORTS = Object.freeze([
  "GOVERNANCE_EVIDENCE_SURFACE_VERSION",
  "GOVERNANCE_EVIDENCE_SURFACE_STABILITY",
  "GOVERNANCE_EVIDENCE_SURFACE_CONSUMER_TIER",
  "GOVERNANCE_EVIDENCE_SURFACE_ARTIFACT_ORDER",
  "GOVERNANCE_EVIDENCE_SURFACE_META_EXPORTS",
  "GOVERNANCE_EVIDENCE_SURFACE_STABLE_EXPORT_SET",
  "GOVERNANCE_EVIDENCE_SURFACE_MAP",
  "getGovernanceEvidenceSurfaceEntry",
  "listGovernanceEvidenceSurfaceEntries",
  "validateGovernanceEvidenceSurface",
  "assertValidGovernanceEvidenceSurface",
]);
export const GOVERNANCE_EVIDENCE_SURFACE_STABLE_EXPORT_SET = Object.freeze([
  ...GOVERNANCE_EVIDENCE_SURFACE_META_EXPORTS,
]);
export const GOVERNANCE_EVIDENCE_SURFACE_MAP = Object.freeze({
  governance_evidence: Object.freeze({
    artifact_id: "governance_evidence",
    consumer_surface: GOVERNANCE_EVIDENCE_CONSUMER_SURFACE,
    contract: Object.freeze({
      kind: GOVERNANCE_EVIDENCE_PROFILE_KIND,
      version: GOVERNANCE_EVIDENCE_PROFILE_VERSION,
      schema_id: GOVERNANCE_EVIDENCE_PROFILE_SCHEMA_ID,
      stage: GOVERNANCE_EVIDENCE_PROFILE_STAGE,
      boundary: GOVERNANCE_EVIDENCE_PROFILE_BOUNDARY,
    }),
    provenance_contract: Object.freeze({
      kind: GOVERNANCE_PROVENANCE_CONTRACT_KIND,
      version: GOVERNANCE_PROVENANCE_CONTRACT_VERSION,
      boundary: GOVERNANCE_PROVENANCE_CONTRACT_BOUNDARY,
    }),
    lineage_contract: Object.freeze({
      kind: GOVERNANCE_LINEAGE_CONTRACT_KIND,
      version: GOVERNANCE_LINEAGE_CONTRACT_VERSION,
      boundary: GOVERNANCE_LINEAGE_CONTRACT_BOUNDARY,
    }),
    recommendation_only: true,
    additive_only: true,
    executing: false,
  }),
});

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function getGovernanceEvidenceSurfaceEntry(artifactId) {
  return GOVERNANCE_EVIDENCE_SURFACE_MAP[artifactId] ?? null;
}

export function listGovernanceEvidenceSurfaceEntries() {
  return GOVERNANCE_EVIDENCE_SURFACE_ARTIFACT_ORDER.map((artifactId) =>
    getGovernanceEvidenceSurfaceEntry(artifactId)
  );
}

export function validateGovernanceEvidenceSurface() {
  const errors = [];

  if (GOVERNANCE_EVIDENCE_SURFACE_VERSION !== "v1") {
    errors.push("governance evidence surface version drifted");
  }
  if (GOVERNANCE_EVIDENCE_SURFACE_STABILITY !== "stable") {
    errors.push("governance evidence surface stability drifted");
  }
  if (
    GOVERNANCE_EVIDENCE_SURFACE_CONSUMER_TIER !== "governance_evidence_surface"
  ) {
    errors.push("governance evidence surface consumer tier drifted");
  }
  if (
    JSON.stringify(GOVERNANCE_EVIDENCE_SURFACE_ARTIFACT_ORDER) !==
    JSON.stringify(["governance_evidence"])
  ) {
    errors.push("governance evidence surface artifact order drifted");
  }

  const artifact = GOVERNANCE_EVIDENCE_SURFACE_MAP.governance_evidence;
  if (!isPlainObject(artifact)) {
    errors.push("governance evidence surface entry must be an object");
    return { ok: false, errors };
  }
  if (artifact.consumer_surface !== GOVERNANCE_EVIDENCE_CONSUMER_SURFACE) {
    errors.push("governance evidence surface consumer surface drifted");
  }
  if (!isPlainObject(artifact.contract)) {
    errors.push("governance evidence surface contract must be an object");
  } else {
    if (artifact.contract.kind !== GOVERNANCE_EVIDENCE_PROFILE_KIND) {
      errors.push("governance evidence surface contract kind drifted");
    }
    if (artifact.contract.version !== GOVERNANCE_EVIDENCE_PROFILE_VERSION) {
      errors.push("governance evidence surface contract version drifted");
    }
    if (artifact.contract.schema_id !== GOVERNANCE_EVIDENCE_PROFILE_SCHEMA_ID) {
      errors.push("governance evidence surface contract schema drifted");
    }
    if (artifact.contract.stage !== GOVERNANCE_EVIDENCE_PROFILE_STAGE) {
      errors.push("governance evidence surface contract stage drifted");
    }
    if (artifact.contract.boundary !== GOVERNANCE_EVIDENCE_PROFILE_BOUNDARY) {
      errors.push("governance evidence surface contract boundary drifted");
    }
  }
  if (!isPlainObject(artifact.provenance_contract)) {
    errors.push("governance evidence surface provenance contract must be an object");
  }
  if (!isPlainObject(artifact.lineage_contract)) {
    errors.push("governance evidence surface lineage contract must be an object");
  }
  if (artifact.recommendation_only !== true) {
    errors.push("governance evidence surface recommendation boundary drifted");
  }
  if (artifact.additive_only !== true) {
    errors.push("governance evidence surface additive boundary drifted");
  }
  if (artifact.executing !== false) {
    errors.push("governance evidence surface execution boundary drifted");
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceEvidenceSurface() {
  const validation = validateGovernanceEvidenceSurface();
  if (validation.ok) return GOVERNANCE_EVIDENCE_SURFACE_MAP;

  const err = new Error(
    `governance evidence surface invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
