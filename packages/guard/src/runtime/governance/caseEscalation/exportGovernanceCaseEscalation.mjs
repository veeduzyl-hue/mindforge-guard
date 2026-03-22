import {
  GOVERNANCE_CASE_ESCALATION_COMPATIBILITY_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_ESCALATION_COMPATIBILITY_CONTRACT_KIND,
  GOVERNANCE_CASE_ESCALATION_COMPATIBILITY_CONTRACT_VERSION,
} from "./governanceCaseEscalationCompatibilityContract.mjs";
import {
  GOVERNANCE_CASE_ESCALATION_CONSUMER_SURFACE,
  GOVERNANCE_CASE_ESCALATION_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_ESCALATION_PROFILE_KIND,
  GOVERNANCE_CASE_ESCALATION_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_ESCALATION_PROFILE_STAGE,
  GOVERNANCE_CASE_ESCALATION_PROFILE_VERSION,
} from "./governanceCaseEscalationProfile.mjs";
import {
  GOVERNANCE_CASE_ESCALATION_STABILIZATION_BOUNDARY,
  GOVERNANCE_CASE_ESCALATION_STABILIZATION_KIND,
  GOVERNANCE_CASE_ESCALATION_STABILIZATION_SCHEMA_ID,
  GOVERNANCE_CASE_ESCALATION_STABILIZATION_STAGE,
  GOVERNANCE_CASE_ESCALATION_STABILIZATION_VERSION,
} from "./governanceCaseEscalationStabilizationProfile.mjs";

export const GOVERNANCE_CASE_ESCALATION_SURFACE_VERSION = "v1";
export const GOVERNANCE_CASE_ESCALATION_SURFACE_STABILITY = "stable";
export const GOVERNANCE_CASE_ESCALATION_SURFACE_CONSUMER_TIER =
  "governance_case_escalation_surface";
export const GOVERNANCE_CASE_ESCALATION_SURFACE_ARTIFACT_ORDER = Object.freeze([
  "governance_case_escalation",
  "governance_case_escalation_stabilization",
]);
export const GOVERNANCE_CASE_ESCALATION_SURFACE_META_EXPORTS = Object.freeze([
  "GOVERNANCE_CASE_ESCALATION_SURFACE_VERSION",
  "GOVERNANCE_CASE_ESCALATION_SURFACE_STABILITY",
  "GOVERNANCE_CASE_ESCALATION_SURFACE_CONSUMER_TIER",
  "GOVERNANCE_CASE_ESCALATION_SURFACE_ARTIFACT_ORDER",
  "GOVERNANCE_CASE_ESCALATION_SURFACE_META_EXPORTS",
  "GOVERNANCE_CASE_ESCALATION_SURFACE_STABLE_EXPORT_SET",
  "GOVERNANCE_CASE_ESCALATION_SURFACE_MAP",
  "getGovernanceCaseEscalationSurfaceEntry",
  "listGovernanceCaseEscalationSurfaceEntries",
  "exportGovernanceCaseEscalationSurface",
]);
export const GOVERNANCE_CASE_ESCALATION_SURFACE_STABLE_EXPORT_SET =
  Object.freeze([...GOVERNANCE_CASE_ESCALATION_SURFACE_META_EXPORTS]);
export const GOVERNANCE_CASE_ESCALATION_SURFACE_MAP = Object.freeze({
  governance_case_escalation: Object.freeze({
    artifact_id: "governance_case_escalation",
    consumer_surface: GOVERNANCE_CASE_ESCALATION_CONSUMER_SURFACE,
    contract: Object.freeze({
      kind: GOVERNANCE_CASE_ESCALATION_PROFILE_KIND,
      version: GOVERNANCE_CASE_ESCALATION_PROFILE_VERSION,
      schema_id: GOVERNANCE_CASE_ESCALATION_PROFILE_SCHEMA_ID,
      stage: GOVERNANCE_CASE_ESCALATION_PROFILE_STAGE,
      boundary: GOVERNANCE_CASE_ESCALATION_PROFILE_BOUNDARY,
    }),
    compatibility_contract: Object.freeze({
      kind: GOVERNANCE_CASE_ESCALATION_COMPATIBILITY_CONTRACT_KIND,
      version: GOVERNANCE_CASE_ESCALATION_COMPATIBILITY_CONTRACT_VERSION,
      boundary: GOVERNANCE_CASE_ESCALATION_COMPATIBILITY_CONTRACT_BOUNDARY,
    }),
    recommendation_only: true,
    additive_only: true,
    executing: false,
  }),
  governance_case_escalation_stabilization: Object.freeze({
    artifact_id: "governance_case_escalation_stabilization",
    consumer_surface: GOVERNANCE_CASE_ESCALATION_CONSUMER_SURFACE,
    contract: Object.freeze({
      kind: GOVERNANCE_CASE_ESCALATION_STABILIZATION_KIND,
      version: GOVERNANCE_CASE_ESCALATION_STABILIZATION_VERSION,
      schema_id: GOVERNANCE_CASE_ESCALATION_STABILIZATION_SCHEMA_ID,
      stage: GOVERNANCE_CASE_ESCALATION_STABILIZATION_STAGE,
      boundary: GOVERNANCE_CASE_ESCALATION_STABILIZATION_BOUNDARY,
    }),
    recommendation_only: true,
    additive_only: true,
    executing: false,
  }),
});

export function getGovernanceCaseEscalationSurfaceEntry(artifactId) {
  return GOVERNANCE_CASE_ESCALATION_SURFACE_MAP[artifactId] ?? null;
}

export function listGovernanceCaseEscalationSurfaceEntries() {
  return GOVERNANCE_CASE_ESCALATION_SURFACE_ARTIFACT_ORDER.map((artifactId) =>
    getGovernanceCaseEscalationSurfaceEntry(artifactId)
  );
}

export function exportGovernanceCaseEscalationSurface() {
  return GOVERNANCE_CASE_ESCALATION_SURFACE_MAP;
}
