import {
  GOVERNANCE_EXPLAINABILITY_CONTRACT_BOUNDARY,
  GOVERNANCE_EXPLAINABILITY_CONTRACT_KIND,
  GOVERNANCE_EXPLAINABILITY_CONTRACT_VERSION,
  GOVERNANCE_RATIONALE_CONTRACT_BOUNDARY,
  GOVERNANCE_RATIONALE_CONTRACT_KIND,
  GOVERNANCE_RATIONALE_CONTRACT_VERSION,
  GOVERNANCE_SNAPSHOT_CONSUMER_SURFACE,
  GOVERNANCE_SNAPSHOT_PROFILE_BOUNDARY,
  GOVERNANCE_SNAPSHOT_PROFILE_KIND,
  GOVERNANCE_SNAPSHOT_PROFILE_SCHEMA_ID,
  GOVERNANCE_SNAPSHOT_PROFILE_STAGE,
  GOVERNANCE_SNAPSHOT_PROFILE_VERSION,
} from "./profile.mjs";
import {
  GOVERNANCE_RATIONALE_BUNDLE_BOUNDARY,
  GOVERNANCE_RATIONALE_BUNDLE_KIND,
  GOVERNANCE_RATIONALE_BUNDLE_STAGE,
  GOVERNANCE_RATIONALE_BUNDLE_VERSION,
  GOVERNANCE_SNAPSHOT_CONSUMER_COMPATIBLE,
  GOVERNANCE_SNAPSHOT_RECEIPT_READY,
} from "./rationaleBundle.mjs";
import {
  GOVERNANCE_REVIEW_PACK_CONTRACT_BOUNDARY,
  GOVERNANCE_REVIEW_PACK_CONTRACT_KIND,
  GOVERNANCE_REVIEW_PACK_CONTRACT_VERSION,
} from "./reviewPack.mjs";
import {
  GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_BOUNDARY,
  GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_KIND,
  GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_VERSION,
} from "./exportCompatibility.mjs";

export const GOVERNANCE_SNAPSHOT_SURFACE_VERSION = "v1";
export const GOVERNANCE_SNAPSHOT_SURFACE_STABILITY = "stable";
export const GOVERNANCE_SNAPSHOT_SURFACE_CONSUMER_TIER =
  "governance_snapshot_surface";
export const GOVERNANCE_SNAPSHOT_SURFACE_ARTIFACT_ORDER = Object.freeze([
  "governance_snapshot",
  "governance_snapshot_review_pack",
]);
export const GOVERNANCE_SNAPSHOT_SURFACE_META_EXPORTS = Object.freeze([
  "GOVERNANCE_SNAPSHOT_SURFACE_VERSION",
  "GOVERNANCE_SNAPSHOT_SURFACE_STABILITY",
  "GOVERNANCE_SNAPSHOT_SURFACE_CONSUMER_TIER",
  "GOVERNANCE_SNAPSHOT_SURFACE_ARTIFACT_ORDER",
  "GOVERNANCE_SNAPSHOT_SURFACE_META_EXPORTS",
  "GOVERNANCE_SNAPSHOT_SURFACE_STABLE_EXPORT_SET",
  "GOVERNANCE_SNAPSHOT_SURFACE_MAP",
  "getGovernanceSnapshotSurfaceEntry",
  "listGovernanceSnapshotSurfaceEntries",
  "validateGovernanceSnapshotSurface",
  "assertValidGovernanceSnapshotSurface",
]);
export const GOVERNANCE_SNAPSHOT_SURFACE_STABLE_EXPORT_SET = Object.freeze([
  ...GOVERNANCE_SNAPSHOT_SURFACE_META_EXPORTS,
]);
export const GOVERNANCE_SNAPSHOT_SURFACE_MAP = Object.freeze({
  governance_snapshot: Object.freeze({
    artifact_id: "governance_snapshot",
    consumer_surface: GOVERNANCE_SNAPSHOT_CONSUMER_SURFACE,
    contract: Object.freeze({
      kind: GOVERNANCE_SNAPSHOT_PROFILE_KIND,
      version: GOVERNANCE_SNAPSHOT_PROFILE_VERSION,
      schema_id: GOVERNANCE_SNAPSHOT_PROFILE_SCHEMA_ID,
      stage: GOVERNANCE_SNAPSHOT_PROFILE_STAGE,
      boundary: GOVERNANCE_SNAPSHOT_PROFILE_BOUNDARY,
    }),
    explainability_contract: Object.freeze({
      kind: GOVERNANCE_EXPLAINABILITY_CONTRACT_KIND,
      version: GOVERNANCE_EXPLAINABILITY_CONTRACT_VERSION,
      boundary: GOVERNANCE_EXPLAINABILITY_CONTRACT_BOUNDARY,
    }),
    rationale_contract: Object.freeze({
      kind: GOVERNANCE_RATIONALE_CONTRACT_KIND,
      version: GOVERNANCE_RATIONALE_CONTRACT_VERSION,
      boundary: GOVERNANCE_RATIONALE_CONTRACT_BOUNDARY,
    }),
    recommendation_only: true,
    additive_only: true,
    executing: false,
  }),
  governance_snapshot_review_pack: Object.freeze({
    artifact_id: "governance_snapshot_review_pack",
    consumer_surface: GOVERNANCE_SNAPSHOT_CONSUMER_SURFACE,
    contract: Object.freeze({
      kind: GOVERNANCE_RATIONALE_BUNDLE_KIND,
      version: GOVERNANCE_RATIONALE_BUNDLE_VERSION,
      schema_id: "mindforge/governance-rationale-bundle/v1",
      stage: GOVERNANCE_RATIONALE_BUNDLE_STAGE,
      boundary: GOVERNANCE_RATIONALE_BUNDLE_BOUNDARY,
    }),
    review_pack_contract: Object.freeze({
      kind: GOVERNANCE_REVIEW_PACK_CONTRACT_KIND,
      version: GOVERNANCE_REVIEW_PACK_CONTRACT_VERSION,
      boundary: GOVERNANCE_REVIEW_PACK_CONTRACT_BOUNDARY,
      receipt_level: GOVERNANCE_SNAPSHOT_RECEIPT_READY,
      compatibility_level: GOVERNANCE_SNAPSHOT_CONSUMER_COMPATIBLE,
    }),
    export_contract: Object.freeze({
      kind: GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_KIND,
      version: GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_VERSION,
      boundary: GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_BOUNDARY,
    }),
    recommendation_only: true,
    additive_only: true,
    executing: false,
  }),
});

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function getGovernanceSnapshotSurfaceEntry(artifactId) {
  return GOVERNANCE_SNAPSHOT_SURFACE_MAP[artifactId] ?? null;
}

export function listGovernanceSnapshotSurfaceEntries() {
  return GOVERNANCE_SNAPSHOT_SURFACE_ARTIFACT_ORDER.map((artifactId) =>
    getGovernanceSnapshotSurfaceEntry(artifactId)
  );
}

export function validateGovernanceSnapshotSurface() {
  const errors = [];

  if (GOVERNANCE_SNAPSHOT_SURFACE_VERSION !== "v1") {
    errors.push("governance snapshot surface version drifted");
  }
  if (GOVERNANCE_SNAPSHOT_SURFACE_STABILITY !== "stable") {
    errors.push("governance snapshot surface stability drifted");
  }
  if (
    GOVERNANCE_SNAPSHOT_SURFACE_CONSUMER_TIER !== "governance_snapshot_surface"
  ) {
    errors.push("governance snapshot surface consumer tier drifted");
  }
  if (
    JSON.stringify(GOVERNANCE_SNAPSHOT_SURFACE_ARTIFACT_ORDER) !==
    JSON.stringify(["governance_snapshot", "governance_snapshot_review_pack"])
  ) {
    errors.push("governance snapshot surface artifact order drifted");
  }

  const artifact = GOVERNANCE_SNAPSHOT_SURFACE_MAP.governance_snapshot;
  if (!isPlainObject(artifact)) {
    errors.push("governance snapshot surface entry must be an object");
    return { ok: false, errors };
  }
  if (artifact.consumer_surface !== GOVERNANCE_SNAPSHOT_CONSUMER_SURFACE) {
    errors.push("governance snapshot surface consumer surface drifted");
  }
  if (!isPlainObject(artifact.contract)) {
    errors.push("governance snapshot surface contract must be an object");
  } else {
    if (artifact.contract.kind !== GOVERNANCE_SNAPSHOT_PROFILE_KIND) {
      errors.push("governance snapshot surface contract kind drifted");
    }
    if (artifact.contract.version !== GOVERNANCE_SNAPSHOT_PROFILE_VERSION) {
      errors.push("governance snapshot surface contract version drifted");
    }
    if (artifact.contract.schema_id !== GOVERNANCE_SNAPSHOT_PROFILE_SCHEMA_ID) {
      errors.push("governance snapshot surface contract schema drifted");
    }
    if (artifact.contract.stage !== GOVERNANCE_SNAPSHOT_PROFILE_STAGE) {
      errors.push("governance snapshot surface contract stage drifted");
    }
    if (artifact.contract.boundary !== GOVERNANCE_SNAPSHOT_PROFILE_BOUNDARY) {
      errors.push("governance snapshot surface contract boundary drifted");
    }
  }
  if (!isPlainObject(artifact.explainability_contract)) {
    errors.push("governance snapshot surface explainability contract missing");
  }
  if (!isPlainObject(artifact.rationale_contract)) {
    errors.push("governance snapshot surface rationale contract missing");
  }
  if (artifact.recommendation_only !== true) {
    errors.push("governance snapshot surface recommendation boundary drifted");
  }
  if (artifact.additive_only !== true) {
    errors.push("governance snapshot surface additive boundary drifted");
  }
  if (artifact.executing !== false) {
    errors.push("governance snapshot surface execution boundary drifted");
  }
  const reviewPackArtifact =
    GOVERNANCE_SNAPSHOT_SURFACE_MAP.governance_snapshot_review_pack;
  if (!isPlainObject(reviewPackArtifact)) {
    errors.push("governance snapshot review pack surface entry must be an object");
  } else {
    if (reviewPackArtifact.contract.kind !== GOVERNANCE_RATIONALE_BUNDLE_KIND) {
      errors.push("governance snapshot review pack contract kind drifted");
    }
    if (
      reviewPackArtifact.review_pack_contract.kind !==
      GOVERNANCE_REVIEW_PACK_CONTRACT_KIND
    ) {
      errors.push("governance snapshot review pack contract drifted");
    }
    if (
      reviewPackArtifact.export_contract.kind !==
      GOVERNANCE_SNAPSHOT_EXPORT_COMPATIBILITY_KIND
    ) {
      errors.push("governance snapshot export contract drifted");
    }
    if (reviewPackArtifact.recommendation_only !== true) {
      errors.push("governance snapshot review pack recommendation boundary drifted");
    }
    if (reviewPackArtifact.additive_only !== true) {
      errors.push("governance snapshot review pack additive boundary drifted");
    }
    if (reviewPackArtifact.executing !== false) {
      errors.push("governance snapshot review pack execution boundary drifted");
    }
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceSnapshotSurface() {
  const validation = validateGovernanceSnapshotSurface();
  if (validation.ok) return GOVERNANCE_SNAPSHOT_SURFACE_MAP;

  const err = new Error(
    `governance snapshot surface invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
