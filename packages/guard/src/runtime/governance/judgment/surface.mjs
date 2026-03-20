import {
  JUDGMENT_PROFILE_BOUNDARY,
  JUDGMENT_PROFILE_CONSUMER_SURFACE,
  JUDGMENT_PROFILE_KIND,
  JUDGMENT_PROFILE_SCHEMA_ID,
  JUDGMENT_PROFILE_SOURCE_ORDER,
  JUDGMENT_PROFILE_STABLE_EXPORT_SET,
  JUDGMENT_PROFILE_VERSION,
} from "./profile.mjs";

export const JUDGMENT_SURFACE_VERSION = "v1";
export const JUDGMENT_SURFACE_STABILITY = "stable";
export const JUDGMENT_SURFACE_CONSUMER_TIER = "consumer_judgment_surface";
export const JUDGMENT_SURFACE_ARTIFACT_ORDER = Object.freeze(["judgment_profile"]);
export const JUDGMENT_SURFACE_META_EXPORTS = Object.freeze([
  "JUDGMENT_SURFACE_VERSION",
  "JUDGMENT_SURFACE_STABILITY",
  "JUDGMENT_SURFACE_CONSUMER_TIER",
  "JUDGMENT_SURFACE_ARTIFACT_ORDER",
  "JUDGMENT_SURFACE_META_EXPORTS",
  "JUDGMENT_SURFACE_STABLE_EXPORT_SET",
  "JUDGMENT_SURFACE_MAP",
  "getJudgmentSurfaceEntry",
  "listJudgmentSurfaceEntries",
  "validateJudgmentSurface",
  "assertValidJudgmentSurface",
]);
export const JUDGMENT_SURFACE_STABLE_EXPORT_SET = Object.freeze([
  ...JUDGMENT_PROFILE_STABLE_EXPORT_SET,
  ...JUDGMENT_SURFACE_META_EXPORTS,
]);
export const JUDGMENT_SURFACE_MAP = Object.freeze({
  judgment_profile: Object.freeze({
    artifact_id: "judgment_profile",
    tier: JUDGMENT_SURFACE_CONSUMER_TIER,
    stability: JUDGMENT_SURFACE_STABILITY,
    contract: {
      kind: JUDGMENT_PROFILE_KIND,
      version: JUDGMENT_PROFILE_VERSION,
      schema_id: JUDGMENT_PROFILE_SCHEMA_ID,
    },
    consumer_surface: JUDGMENT_PROFILE_CONSUMER_SURFACE,
    boundary: JUDGMENT_PROFILE_BOUNDARY,
    source_order: JUDGMENT_PROFILE_SOURCE_ORDER,
    stable_exports: JUDGMENT_PROFILE_STABLE_EXPORT_SET,
  }),
});

export function getJudgmentSurfaceEntry(artifactId) {
  return JUDGMENT_SURFACE_MAP[artifactId] || null;
}

export function listJudgmentSurfaceEntries() {
  return JUDGMENT_SURFACE_ARTIFACT_ORDER.map(
    (artifactId) => JUDGMENT_SURFACE_MAP[artifactId]
  );
}

export function validateJudgmentSurface() {
  const errors = [];
  const entry = JUDGMENT_SURFACE_MAP.judgment_profile;

  if (
    JSON.stringify(JUDGMENT_SURFACE_ARTIFACT_ORDER) !==
    JSON.stringify(["judgment_profile"])
  ) {
    errors.push("judgment surface artifact order drifted");
  }
  if (entry.tier !== JUDGMENT_SURFACE_CONSUMER_TIER) {
    errors.push("judgment surface tier drifted");
  }
  if (entry.stability !== JUDGMENT_SURFACE_STABILITY) {
    errors.push("judgment surface stability drifted");
  }
  if (entry.contract.kind !== JUDGMENT_PROFILE_KIND) {
    errors.push("judgment surface kind drifted");
  }
  if (entry.contract.version !== JUDGMENT_PROFILE_VERSION) {
    errors.push("judgment surface version drifted");
  }
  if (entry.contract.schema_id !== JUDGMENT_PROFILE_SCHEMA_ID) {
    errors.push("judgment surface schema id drifted");
  }
  if (entry.consumer_surface !== JUDGMENT_PROFILE_CONSUMER_SURFACE) {
    errors.push("judgment surface consumer surface drifted");
  }
  if (entry.boundary !== JUDGMENT_PROFILE_BOUNDARY) {
    errors.push("judgment surface boundary drifted");
  }
  if (
    JSON.stringify(entry.source_order) !== JSON.stringify(JUDGMENT_PROFILE_SOURCE_ORDER)
  ) {
    errors.push("judgment surface source order drifted");
  }
  if (
    JSON.stringify(entry.stable_exports) !==
    JSON.stringify(JUDGMENT_PROFILE_STABLE_EXPORT_SET)
  ) {
    errors.push("judgment surface stable exports drifted");
  }
  if (
    new Set(JUDGMENT_SURFACE_STABLE_EXPORT_SET).size !==
    JUDGMENT_SURFACE_STABLE_EXPORT_SET.length
  ) {
    errors.push("judgment surface stable export set contains duplicates");
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function assertValidJudgmentSurface() {
  const validation = validateJudgmentSurface();
  if (validation.ok) return JUDGMENT_SURFACE_MAP;

  const err = new Error(`judgment surface invalid: ${validation.errors.join("; ")}`);
  err.validation = validation;
  throw err;
}
