import {
  JUDGMENT_PROFILE_BOUNDARY,
  JUDGMENT_PROFILE_CLASSES,
  JUDGMENT_PROFILE_CONSUMER_SURFACE,
  JUDGMENT_PROFILE_KIND,
  JUDGMENT_PROFILE_SOURCE_ORDER,
  JUDGMENT_PROFILE_VERSION,
  assertValidJudgmentProfile,
} from "./profile.mjs";

export const JUDGMENT_READINESS_KIND = "judgment_readiness_profile";
export const JUDGMENT_READINESS_VERSION = "v1";
export const JUDGMENT_READINESS_SCHEMA_ID = "mindforge/judgment-readiness/v1";
export const JUDGMENT_READINESS_STABILITY = "stable";
export const JUDGMENT_READINESS_STAGE = "judgment_readiness_phase2_v1";
export const JUDGMENT_READINESS_CONSUMER_SURFACE =
  JUDGMENT_PROFILE_CONSUMER_SURFACE;
export const JUDGMENT_READINESS_BOUNDARY =
  "stable_recommendation_only_judgment_readiness";
export const JUDGMENT_READINESS_READY = "ready";
export const JUDGMENT_READINESS_CONSUMER_COMPATIBLE = "consumer_compatible";
export const JUDGMENT_READINESS_LEVELS = Object.freeze([
  JUDGMENT_READINESS_READY,
  JUDGMENT_READINESS_CONSUMER_COMPATIBLE,
]);
export const JUDGMENT_READINESS_SOURCE_ORDER = JUDGMENT_PROFILE_SOURCE_ORDER;
export const JUDGMENT_READINESS_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "judgment_readiness",
  "deterministic",
  "enforcing",
]);
export const JUDGMENT_READINESS_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "signal",
  "permit",
  "governance",
  "limited_authority",
  "consumer_contract",
]);
export const JUDGMENT_READINESS_STABLE_EXPORT_SET = Object.freeze([
  "JUDGMENT_READINESS_KIND",
  "JUDGMENT_READINESS_VERSION",
  "JUDGMENT_READINESS_SCHEMA_ID",
  "JUDGMENT_READINESS_STABILITY",
  "JUDGMENT_READINESS_STAGE",
  "JUDGMENT_READINESS_CONSUMER_SURFACE",
  "JUDGMENT_READINESS_BOUNDARY",
  "JUDGMENT_READINESS_READY",
  "JUDGMENT_READINESS_CONSUMER_COMPATIBLE",
  "JUDGMENT_READINESS_LEVELS",
  "JUDGMENT_READINESS_SOURCE_ORDER",
  "JUDGMENT_READINESS_TOP_LEVEL_FIELDS",
  "JUDGMENT_READINESS_PAYLOAD_FIELDS",
  "JUDGMENT_READINESS_STABLE_EXPORT_SET",
  "buildJudgmentReadinessProfile",
  "validateJudgmentReadinessProfile",
  "assertValidJudgmentReadinessProfile",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildJudgmentReadinessProfile({ judgmentProfile }) {
  const profile = assertValidJudgmentProfile(judgmentProfile);
  const payload = profile.judgment_profile;

  return {
    kind: JUDGMENT_READINESS_KIND,
    version: JUDGMENT_READINESS_VERSION,
    schema_id: JUDGMENT_READINESS_SCHEMA_ID,
    canonical_action_hash: profile.canonical_action_hash,
    judgment_readiness: {
      stage: JUDGMENT_READINESS_STAGE,
      consumer_surface: JUDGMENT_READINESS_CONSUMER_SURFACE,
      boundary: JUDGMENT_READINESS_BOUNDARY,
      signal: {
        readiness: JUDGMENT_READINESS_READY,
        source: payload.signal.source,
        judgment_class: payload.signal.judgment_class,
        boundary: JUDGMENT_PROFILE_BOUNDARY,
      },
      permit: {
        readiness: JUDGMENT_READINESS_READY,
        source: payload.permit.source,
        decision: payload.permit.decision,
        exit_code: payload.permit.exit_code,
        judgment_class: payload.permit.judgment_class,
      },
      governance: {
        readiness: JUDGMENT_READINESS_READY,
        source: payload.governance.source,
        outcome: payload.governance.outcome,
        audit_output_preserved: payload.governance.audit_output_preserved,
      },
      limited_authority: {
        readiness: JUDGMENT_READINESS_READY,
        source: payload.limited_authority.source,
        authority_status: payload.limited_authority.authority_status,
        proposed_audit_exit_code:
          payload.limited_authority.proposed_audit_exit_code,
        current_audit_exit_code:
          payload.limited_authority.current_audit_exit_code,
        judgment_class: payload.limited_authority.judgment_class,
      },
      consumer_contract: {
        readiness: JUDGMENT_READINESS_CONSUMER_COMPATIBLE,
        recommendation_only: payload.unified_judgment.recommendation_only,
        audit_output_preserved: payload.unified_judgment.audit_output_preserved,
        audit_verdict_preserved:
          payload.unified_judgment.audit_verdict_preserved,
        actual_exit_code_preserved:
          payload.unified_judgment.actual_exit_code_preserved,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateJudgmentReadinessProfile(profile) {
  const errors = [];

  if (!isPlainObject(profile)) {
    return { ok: false, errors: ["judgment readiness profile must be an object"] };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(JUDGMENT_READINESS_TOP_LEVEL_FIELDS)
  ) {
    errors.push("judgment readiness top-level field order drifted");
  }
  if (profile.kind !== JUDGMENT_READINESS_KIND) {
    errors.push("judgment readiness kind drifted");
  }
  if (profile.version !== JUDGMENT_READINESS_VERSION) {
    errors.push("judgment readiness version drifted");
  }
  if (profile.schema_id !== JUDGMENT_READINESS_SCHEMA_ID) {
    errors.push("judgment readiness schema id drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("judgment readiness canonical_action_hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("judgment readiness must remain deterministic");
  }
  if (profile.enforcing !== false) {
    errors.push("judgment readiness must remain non-enforcing");
  }
  if (!isPlainObject(profile.judgment_readiness)) {
    errors.push("judgment readiness payload must be an object");
    return { ok: errors.length === 0, errors };
  }

  const payload = profile.judgment_readiness;
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(JUDGMENT_READINESS_PAYLOAD_FIELDS)
  ) {
    errors.push("judgment readiness payload field order drifted");
  }
  if (payload.stage !== JUDGMENT_READINESS_STAGE) {
    errors.push("judgment readiness stage drifted");
  }
  if (payload.consumer_surface !== JUDGMENT_READINESS_CONSUMER_SURFACE) {
    errors.push("judgment readiness consumer surface drifted");
  }
  if (payload.boundary !== JUDGMENT_READINESS_BOUNDARY) {
    errors.push("judgment readiness boundary drifted");
  }

  for (const key of [
    "signal",
    "permit",
    "governance",
    "limited_authority",
    "consumer_contract",
  ]) {
    if (!isPlainObject(payload[key])) {
      errors.push(`judgment readiness ${key} section must be an object`);
    }
  }

  if (isPlainObject(payload.signal)) {
    if (payload.signal.readiness !== JUDGMENT_READINESS_READY) {
      errors.push("judgment readiness signal state drifted");
    }
    if (!JUDGMENT_PROFILE_CLASSES.includes(payload.signal.judgment_class)) {
      errors.push("judgment readiness signal class drifted");
    }
    if (payload.signal.boundary !== JUDGMENT_PROFILE_BOUNDARY) {
      errors.push("judgment readiness signal boundary drifted");
    }
  }
  if (isPlainObject(payload.permit)) {
    if (payload.permit.readiness !== JUDGMENT_READINESS_READY) {
      errors.push("judgment readiness permit state drifted");
    }
    if (!JUDGMENT_PROFILE_CLASSES.includes(payload.permit.judgment_class)) {
      errors.push("judgment readiness permit class drifted");
    }
  }
  if (isPlainObject(payload.governance)) {
    if (payload.governance.readiness !== JUDGMENT_READINESS_READY) {
      errors.push("judgment readiness governance state drifted");
    }
    if (payload.governance.audit_output_preserved !== true) {
      errors.push("judgment readiness governance must preserve audit output");
    }
  }
  if (isPlainObject(payload.limited_authority)) {
    if (payload.limited_authority.readiness !== JUDGMENT_READINESS_READY) {
      errors.push("judgment readiness limited authority state drifted");
    }
    if (payload.limited_authority.current_audit_exit_code !== null) {
      errors.push(
        "judgment readiness limited authority must preserve null current_audit_exit_code"
      );
    }
    if (!JUDGMENT_PROFILE_CLASSES.includes(payload.limited_authority.judgment_class)) {
      errors.push("judgment readiness limited authority class drifted");
    }
  }
  if (isPlainObject(payload.consumer_contract)) {
    if (
      payload.consumer_contract.readiness !==
      JUDGMENT_READINESS_CONSUMER_COMPATIBLE
    ) {
      errors.push("judgment readiness consumer contract state drifted");
    }
    if (payload.consumer_contract.recommendation_only !== true) {
      errors.push("judgment readiness must remain recommendation-only");
    }
    if (payload.consumer_contract.audit_output_preserved !== true) {
      errors.push("judgment readiness must preserve audit output");
    }
    if (payload.consumer_contract.audit_verdict_preserved !== true) {
      errors.push("judgment readiness must preserve audit verdict");
    }
    if (payload.consumer_contract.actual_exit_code_preserved !== true) {
      errors.push("judgment readiness must preserve actual exit code");
    }
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function assertValidJudgmentReadinessProfile(profile) {
  const validation = validateJudgmentReadinessProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `judgment readiness profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
