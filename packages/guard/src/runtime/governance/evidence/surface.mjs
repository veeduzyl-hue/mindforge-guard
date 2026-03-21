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
import {
  GOVERNANCE_EVIDENCE_REPLAY_BOUNDARY,
  GOVERNANCE_EVIDENCE_REPLAY_KIND,
  GOVERNANCE_EVIDENCE_REPLAY_STAGE,
  GOVERNANCE_EVIDENCE_REPLAY_VERSION,
  GOVERNANCE_EVIDENCE_RECEIPT_READY,
  GOVERNANCE_EVIDENCE_CONSUMER_COMPATIBLE,
} from "./replay.mjs";
import {
  GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_BOUNDARY,
  GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_KIND,
  GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_VERSION,
} from "./compare.mjs";
import {
  GOVERNANCE_EVIDENCE_FINAL_ACCEPTANCE_BOUNDARY,
  GOVERNANCE_EVIDENCE_FINAL_ACCEPTANCE_READY,
  GOVERNANCE_EVIDENCE_STABILIZATION_KIND,
  GOVERNANCE_EVIDENCE_STABILIZATION_STAGE,
  GOVERNANCE_EVIDENCE_STABILIZATION_VERSION,
} from "./stabilization.mjs";

export const GOVERNANCE_EVIDENCE_SURFACE_VERSION = "v1";
export const GOVERNANCE_EVIDENCE_SURFACE_STABILITY = "stable";
export const GOVERNANCE_EVIDENCE_SURFACE_CONSUMER_TIER =
  "governance_evidence_surface";
export const GOVERNANCE_EVIDENCE_SURFACE_ARTIFACT_ORDER = Object.freeze([
  "governance_evidence",
  "governance_evidence_replay",
  "governance_evidence_stabilization",
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
  governance_evidence_replay: Object.freeze({
    artifact_id: "governance_evidence_replay",
    consumer_surface: GOVERNANCE_EVIDENCE_CONSUMER_SURFACE,
    contract: Object.freeze({
      kind: GOVERNANCE_EVIDENCE_REPLAY_KIND,
      version: GOVERNANCE_EVIDENCE_REPLAY_VERSION,
      schema_id: "mindforge/governance-evidence-replay/v1",
      stage: GOVERNANCE_EVIDENCE_REPLAY_STAGE,
      boundary: GOVERNANCE_EVIDENCE_REPLAY_BOUNDARY,
    }),
    compare_contract: Object.freeze({
      kind: GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_KIND,
      version: GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_VERSION,
      boundary: GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_BOUNDARY,
      receipt_level: GOVERNANCE_EVIDENCE_RECEIPT_READY,
      compatibility_level: GOVERNANCE_EVIDENCE_CONSUMER_COMPATIBLE,
    }),
    recommendation_only: true,
    additive_only: true,
    executing: false,
  }),
  governance_evidence_stabilization: Object.freeze({
    artifact_id: "governance_evidence_stabilization",
    consumer_surface: GOVERNANCE_EVIDENCE_CONSUMER_SURFACE,
    contract: Object.freeze({
      kind: GOVERNANCE_EVIDENCE_STABILIZATION_KIND,
      version: GOVERNANCE_EVIDENCE_STABILIZATION_VERSION,
      schema_id: "mindforge/governance-evidence-stabilization/v1",
      stage: GOVERNANCE_EVIDENCE_STABILIZATION_STAGE,
      boundary: GOVERNANCE_EVIDENCE_FINAL_ACCEPTANCE_BOUNDARY,
    }),
    compare_contract: Object.freeze({
      kind: GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_KIND,
      version: GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_VERSION,
      boundary: GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_BOUNDARY,
      acceptance_level: GOVERNANCE_EVIDENCE_FINAL_ACCEPTANCE_READY,
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
    JSON.stringify([
      "governance_evidence",
      "governance_evidence_replay",
      "governance_evidence_stabilization",
    ])
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
  const replayArtifact = GOVERNANCE_EVIDENCE_SURFACE_MAP.governance_evidence_replay;
  if (!isPlainObject(replayArtifact)) {
    errors.push("governance evidence replay surface entry must be an object");
  } else {
    if (replayArtifact.contract.kind !== GOVERNANCE_EVIDENCE_REPLAY_KIND) {
      errors.push("governance evidence replay surface contract kind drifted");
    }
    if (
      replayArtifact.compare_contract.kind !==
      GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_KIND
    ) {
      errors.push("governance evidence compare contract kind drifted");
    }
    if (replayArtifact.recommendation_only !== true) {
      errors.push("governance evidence replay recommendation boundary drifted");
    }
    if (replayArtifact.additive_only !== true) {
      errors.push("governance evidence replay additive boundary drifted");
    }
    if (replayArtifact.executing !== false) {
      errors.push("governance evidence replay execution boundary drifted");
    }
  }
  const stabilizationArtifact =
    GOVERNANCE_EVIDENCE_SURFACE_MAP.governance_evidence_stabilization;
  if (!isPlainObject(stabilizationArtifact)) {
    errors.push("governance evidence stabilization surface entry must be an object");
  } else {
    if (
      stabilizationArtifact.contract.kind !== GOVERNANCE_EVIDENCE_STABILIZATION_KIND
    ) {
      errors.push("governance evidence stabilization contract kind drifted");
    }
    if (
      stabilizationArtifact.compare_contract.kind !==
      GOVERNANCE_COMPARE_COMPATIBILITY_CONTRACT_KIND
    ) {
      errors.push("governance evidence stabilization compare contract kind drifted");
    }
    if (stabilizationArtifact.recommendation_only !== true) {
      errors.push("governance evidence stabilization recommendation boundary drifted");
    }
    if (stabilizationArtifact.additive_only !== true) {
      errors.push("governance evidence stabilization additive boundary drifted");
    }
    if (stabilizationArtifact.executing !== false) {
      errors.push("governance evidence stabilization execution boundary drifted");
    }
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
