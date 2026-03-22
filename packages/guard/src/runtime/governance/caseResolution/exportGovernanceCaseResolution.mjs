import {
  GOVERNANCE_CASE_RESOLUTION_COMPATIBILITY_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_RESOLUTION_COMPATIBILITY_CONTRACT_KIND,
  GOVERNANCE_CASE_RESOLUTION_COMPATIBILITY_CONTRACT_VERSION,
} from "./governanceCaseResolutionCompatibilityContract.mjs";
import {
  GOVERNANCE_CASE_RESOLUTION_CONSUMER_SURFACE,
  GOVERNANCE_CASE_RESOLUTION_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_RESOLUTION_PROFILE_KIND,
  GOVERNANCE_CASE_RESOLUTION_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_RESOLUTION_PROFILE_STAGE,
  GOVERNANCE_CASE_RESOLUTION_PROFILE_VERSION,
} from "./governanceCaseResolutionProfile.mjs";
import {
  GOVERNANCE_CASE_RESOLUTION_STABILIZATION_BOUNDARY,
  GOVERNANCE_CASE_RESOLUTION_STABILIZATION_KIND,
  GOVERNANCE_CASE_RESOLUTION_STABILIZATION_SCHEMA_ID,
  GOVERNANCE_CASE_RESOLUTION_STABILIZATION_STAGE,
  GOVERNANCE_CASE_RESOLUTION_STABILIZATION_VERSION,
} from "./governanceCaseResolutionStabilizationProfile.mjs";

export const GOVERNANCE_CASE_RESOLUTION_SURFACE_VERSION = "v1";
export const GOVERNANCE_CASE_RESOLUTION_SURFACE_STABILITY = "stable";
export const GOVERNANCE_CASE_RESOLUTION_SURFACE_CONSUMER_TIER =
  "governance_case_resolution_surface";
export const GOVERNANCE_CASE_RESOLUTION_SURFACE_ARTIFACT_ORDER = Object.freeze([
  "governance_case_resolution",
  "governance_case_resolution_stabilization",
]);
export const GOVERNANCE_CASE_RESOLUTION_SURFACE_META_EXPORTS = Object.freeze([
  "GOVERNANCE_CASE_RESOLUTION_SURFACE_VERSION",
  "GOVERNANCE_CASE_RESOLUTION_SURFACE_STABILITY",
  "GOVERNANCE_CASE_RESOLUTION_SURFACE_CONSUMER_TIER",
  "GOVERNANCE_CASE_RESOLUTION_SURFACE_ARTIFACT_ORDER",
  "GOVERNANCE_CASE_RESOLUTION_SURFACE_META_EXPORTS",
  "GOVERNANCE_CASE_RESOLUTION_SURFACE_STABLE_EXPORT_SET",
  "GOVERNANCE_CASE_RESOLUTION_SURFACE_MAP",
  "getGovernanceCaseResolutionSurfaceEntry",
  "listGovernanceCaseResolutionSurfaceEntries",
  "exportGovernanceCaseResolutionSurface",
]);
export const GOVERNANCE_CASE_RESOLUTION_SURFACE_STABLE_EXPORT_SET =
  Object.freeze([...GOVERNANCE_CASE_RESOLUTION_SURFACE_META_EXPORTS]);
export const GOVERNANCE_CASE_RESOLUTION_SURFACE_MAP = Object.freeze({
  governance_case_resolution: Object.freeze({
    artifact_id: "governance_case_resolution",
    consumer_surface: GOVERNANCE_CASE_RESOLUTION_CONSUMER_SURFACE,
    contract: Object.freeze({
      kind: GOVERNANCE_CASE_RESOLUTION_PROFILE_KIND,
      version: GOVERNANCE_CASE_RESOLUTION_PROFILE_VERSION,
      schema_id: GOVERNANCE_CASE_RESOLUTION_PROFILE_SCHEMA_ID,
      stage: GOVERNANCE_CASE_RESOLUTION_PROFILE_STAGE,
      boundary: GOVERNANCE_CASE_RESOLUTION_PROFILE_BOUNDARY,
    }),
    compatibility_contract: Object.freeze({
      kind: GOVERNANCE_CASE_RESOLUTION_COMPATIBILITY_CONTRACT_KIND,
      version: GOVERNANCE_CASE_RESOLUTION_COMPATIBILITY_CONTRACT_VERSION,
      boundary: GOVERNANCE_CASE_RESOLUTION_COMPATIBILITY_CONTRACT_BOUNDARY,
    }),
    recommendation_only: true,
    additive_only: true,
    executing: false,
  }),
  governance_case_resolution_stabilization: Object.freeze({
    artifact_id: "governance_case_resolution_stabilization",
    consumer_surface: GOVERNANCE_CASE_RESOLUTION_CONSUMER_SURFACE,
    contract: Object.freeze({
      kind: GOVERNANCE_CASE_RESOLUTION_STABILIZATION_KIND,
      version: GOVERNANCE_CASE_RESOLUTION_STABILIZATION_VERSION,
      schema_id: GOVERNANCE_CASE_RESOLUTION_STABILIZATION_SCHEMA_ID,
      stage: GOVERNANCE_CASE_RESOLUTION_STABILIZATION_STAGE,
      boundary: GOVERNANCE_CASE_RESOLUTION_STABILIZATION_BOUNDARY,
    }),
    recommendation_only: true,
    additive_only: true,
    executing: false,
  }),
});

export function getGovernanceCaseResolutionSurfaceEntry(artifactId) {
  return GOVERNANCE_CASE_RESOLUTION_SURFACE_MAP[artifactId] ?? null;
}

export function listGovernanceCaseResolutionSurfaceEntries() {
  return GOVERNANCE_CASE_RESOLUTION_SURFACE_ARTIFACT_ORDER.map((artifactId) =>
    getGovernanceCaseResolutionSurfaceEntry(artifactId)
  );
}

export function exportGovernanceCaseResolutionSurface() {
  return GOVERNANCE_CASE_RESOLUTION_SURFACE_MAP;
}
