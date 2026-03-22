import {
  GOVERNANCE_CASE_FINAL_ACCEPTANCE_BOUNDARY,
  GOVERNANCE_CASE_FINAL_ACCEPTANCE_CONSUMER_SURFACE,
  GOVERNANCE_CASE_FINAL_ACCEPTANCE_KIND,
  GOVERNANCE_CASE_FINAL_ACCEPTANCE_READY,
  assertValidGovernanceCaseFinalAcceptanceBoundary,
} from "./governanceCaseFinalAcceptanceBoundary.mjs";
import {
  GOVERNANCE_CASE_FINAL_COMPATIBILITY_FREEZE_BOUNDARY,
  GOVERNANCE_CASE_FINAL_COMPATIBILITY_FREEZE_KIND,
  assertValidGovernanceCaseFinalCompatibilityFreeze,
} from "./governanceCaseFinalCompatibilityFreeze.mjs";

export const GOVERNANCE_CASE_FINAL_ACCEPTANCE_SURFACE_VERSION = "v1";
export const GOVERNANCE_CASE_FINAL_ACCEPTANCE_SURFACE_STABILITY = "frozen";
export const GOVERNANCE_CASE_FINAL_ACCEPTANCE_SURFACE_CONSUMER_TIER =
  "external_consumer";
export const GOVERNANCE_CASE_FINAL_ACCEPTANCE_SURFACE_ARTIFACT_ORDER =
  Object.freeze([
    "governance_case_final_acceptance",
    "governance_case_final_compatibility_freeze",
  ]);
export const GOVERNANCE_CASE_FINAL_ACCEPTANCE_SURFACE_META_EXPORTS =
  Object.freeze([
    "GOVERNANCE_CASE_FINAL_ACCEPTANCE_SURFACE_VERSION",
    "GOVERNANCE_CASE_FINAL_ACCEPTANCE_SURFACE_STABILITY",
    "GOVERNANCE_CASE_FINAL_ACCEPTANCE_SURFACE_CONSUMER_TIER",
    "GOVERNANCE_CASE_FINAL_ACCEPTANCE_SURFACE_ARTIFACT_ORDER",
    "GOVERNANCE_CASE_FINAL_ACCEPTANCE_SURFACE_META_EXPORTS",
    "GOVERNANCE_CASE_FINAL_ACCEPTANCE_SURFACE_STABLE_EXPORT_SET",
    "GOVERNANCE_CASE_FINAL_ACCEPTANCE_SURFACE_MAP",
  ]);
export const GOVERNANCE_CASE_FINAL_ACCEPTANCE_SURFACE_STABLE_EXPORT_SET =
  Object.freeze([
    ...GOVERNANCE_CASE_FINAL_ACCEPTANCE_SURFACE_META_EXPORTS,
    "getGovernanceCaseFinalAcceptanceSurfaceEntry",
    "listGovernanceCaseFinalAcceptanceSurfaceEntries",
    "exportGovernanceCaseFinalAcceptanceSurface",
  ]);

export const GOVERNANCE_CASE_FINAL_ACCEPTANCE_SURFACE_MAP = Object.freeze({
  governance_case_final_acceptance: Object.freeze({
    artifact_id: "governance_case_final_acceptance",
    kind: GOVERNANCE_CASE_FINAL_ACCEPTANCE_KIND,
    boundary: GOVERNANCE_CASE_FINAL_ACCEPTANCE_BOUNDARY,
    consumer_surface: GOVERNANCE_CASE_FINAL_ACCEPTANCE_CONSUMER_SURFACE,
    consumer_tier: GOVERNANCE_CASE_FINAL_ACCEPTANCE_SURFACE_CONSUMER_TIER,
    stability: GOVERNANCE_CASE_FINAL_ACCEPTANCE_SURFACE_STABILITY,
    recommendation_only: true,
    additive_only: true,
    executing: false,
    release_target: "v5.3.0",
    readiness_level: GOVERNANCE_CASE_FINAL_ACCEPTANCE_READY,
  }),
  governance_case_final_compatibility_freeze: Object.freeze({
    artifact_id: "governance_case_final_compatibility_freeze",
    kind: GOVERNANCE_CASE_FINAL_COMPATIBILITY_FREEZE_KIND,
    boundary: GOVERNANCE_CASE_FINAL_COMPATIBILITY_FREEZE_BOUNDARY,
    consumer_surface: GOVERNANCE_CASE_FINAL_ACCEPTANCE_CONSUMER_SURFACE,
    consumer_tier: GOVERNANCE_CASE_FINAL_ACCEPTANCE_SURFACE_CONSUMER_TIER,
    stability: GOVERNANCE_CASE_FINAL_ACCEPTANCE_SURFACE_STABILITY,
    recommendation_only: true,
    additive_only: true,
    executing: false,
    release_target: "v5.3.0",
  }),
});

export function getGovernanceCaseFinalAcceptanceSurfaceEntry(artifactId) {
  return GOVERNANCE_CASE_FINAL_ACCEPTANCE_SURFACE_MAP[artifactId] ?? null;
}

export function listGovernanceCaseFinalAcceptanceSurfaceEntries() {
  return GOVERNANCE_CASE_FINAL_ACCEPTANCE_SURFACE_ARTIFACT_ORDER.map(
    (artifactId) => GOVERNANCE_CASE_FINAL_ACCEPTANCE_SURFACE_MAP[artifactId]
  );
}

export function exportGovernanceCaseFinalAcceptanceSurface({
  governanceCaseFinalAcceptanceBoundary,
  governanceCaseFinalCompatibilityFreeze,
}) {
  const boundary = assertValidGovernanceCaseFinalAcceptanceBoundary(
    governanceCaseFinalAcceptanceBoundary
  );
  const freeze = assertValidGovernanceCaseFinalCompatibilityFreeze(
    governanceCaseFinalCompatibilityFreeze
  );
  return Object.freeze({
    governance_case_final_acceptance: boundary,
    governance_case_final_compatibility_freeze: freeze,
    release_summary: Object.freeze({
      release_target: "v5.3.0",
      module: "Governance Case Resolution, Escalation & Closure v1",
      readiness: GOVERNANCE_CASE_FINAL_ACCEPTANCE_READY,
      recommendation_only: true,
      additive_only: true,
      non_executing: true,
      default_off: true,
    }),
  });
}
