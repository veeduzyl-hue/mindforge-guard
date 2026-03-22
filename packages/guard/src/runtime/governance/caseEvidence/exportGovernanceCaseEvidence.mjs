import {
  GOVERNANCE_CASE_EVIDENCE_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_EVIDENCE_CONTRACT_KIND,
  GOVERNANCE_CASE_EVIDENCE_CONTRACT_VERSION,
} from "./governanceCaseEvidenceContract.mjs";
import {
  GOVERNANCE_CASE_EVIDENCE_CONSUMER_SURFACE,
  GOVERNANCE_CASE_EVIDENCE_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_EVIDENCE_PROFILE_KIND,
  GOVERNANCE_CASE_EVIDENCE_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_EVIDENCE_PROFILE_STAGE,
  GOVERNANCE_CASE_EVIDENCE_PROFILE_VERSION,
} from "./governanceCaseEvidenceProfile.mjs";

export const GOVERNANCE_CASE_EVIDENCE_SURFACE_VERSION = "v1";
export const GOVERNANCE_CASE_EVIDENCE_SURFACE_STABILITY = "stable";
export const GOVERNANCE_CASE_EVIDENCE_SURFACE_CONSUMER_TIER =
  "governance_case_evidence_surface";
export const GOVERNANCE_CASE_EVIDENCE_SURFACE_ARTIFACT_ORDER = Object.freeze([
  "governance_case_evidence",
]);
export const GOVERNANCE_CASE_EVIDENCE_SURFACE_META_EXPORTS = Object.freeze([
  "GOVERNANCE_CASE_EVIDENCE_SURFACE_VERSION",
  "GOVERNANCE_CASE_EVIDENCE_SURFACE_STABILITY",
  "GOVERNANCE_CASE_EVIDENCE_SURFACE_CONSUMER_TIER",
  "GOVERNANCE_CASE_EVIDENCE_SURFACE_ARTIFACT_ORDER",
  "GOVERNANCE_CASE_EVIDENCE_SURFACE_META_EXPORTS",
  "GOVERNANCE_CASE_EVIDENCE_SURFACE_STABLE_EXPORT_SET",
  "GOVERNANCE_CASE_EVIDENCE_SURFACE_MAP",
  "getGovernanceCaseEvidenceSurfaceEntry",
  "listGovernanceCaseEvidenceSurfaceEntries",
  "exportGovernanceCaseEvidenceSurface",
]);
export const GOVERNANCE_CASE_EVIDENCE_SURFACE_STABLE_EXPORT_SET =
  Object.freeze([...GOVERNANCE_CASE_EVIDENCE_SURFACE_META_EXPORTS]);
export const GOVERNANCE_CASE_EVIDENCE_SURFACE_MAP = Object.freeze({
  governance_case_evidence: Object.freeze({
    artifact_id: "governance_case_evidence",
    consumer_surface: GOVERNANCE_CASE_EVIDENCE_CONSUMER_SURFACE,
    contract: Object.freeze({
      kind: GOVERNANCE_CASE_EVIDENCE_PROFILE_KIND,
      version: GOVERNANCE_CASE_EVIDENCE_PROFILE_VERSION,
      schema_id: GOVERNANCE_CASE_EVIDENCE_PROFILE_SCHEMA_ID,
      stage: GOVERNANCE_CASE_EVIDENCE_PROFILE_STAGE,
      boundary: GOVERNANCE_CASE_EVIDENCE_PROFILE_BOUNDARY,
    }),
    boundary_contract: Object.freeze({
      kind: GOVERNANCE_CASE_EVIDENCE_CONTRACT_KIND,
      version: GOVERNANCE_CASE_EVIDENCE_CONTRACT_VERSION,
      boundary: GOVERNANCE_CASE_EVIDENCE_CONTRACT_BOUNDARY,
    }),
    supporting_artifact_only: true,
    recommendation_only: true,
    additive_only: true,
    executing: false,
  }),
});

export function getGovernanceCaseEvidenceSurfaceEntry(artifactId) {
  return GOVERNANCE_CASE_EVIDENCE_SURFACE_MAP[artifactId] ?? null;
}

export function listGovernanceCaseEvidenceSurfaceEntries() {
  return GOVERNANCE_CASE_EVIDENCE_SURFACE_ARTIFACT_ORDER.map((artifactId) =>
    getGovernanceCaseEvidenceSurfaceEntry(artifactId)
  );
}

export function exportGovernanceCaseEvidenceSurface() {
  return GOVERNANCE_CASE_EVIDENCE_SURFACE_MAP;
}
