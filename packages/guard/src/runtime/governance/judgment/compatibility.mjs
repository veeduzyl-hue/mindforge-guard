import {
  JUDGMENT_PROFILE_BOUNDARY,
  JUDGMENT_PROFILE_CONSUMER_SURFACE,
  JUDGMENT_PROFILE_KIND,
  JUDGMENT_PROFILE_SOURCE_ORDER,
  JUDGMENT_PROFILE_VERSION,
  assertValidJudgmentProfile,
} from "./profile.mjs";
import {
  JUDGMENT_READINESS_BOUNDARY,
  JUDGMENT_READINESS_KIND,
  JUDGMENT_READINESS_VERSION,
  assertValidJudgmentReadinessProfile,
} from "./readiness.mjs";

export const JUDGMENT_COMPATIBILITY_KIND = "judgment_compatibility_contract";
export const JUDGMENT_COMPATIBILITY_VERSION = "v1";
export const JUDGMENT_COMPATIBILITY_SCHEMA_ID =
  "mindforge/judgment-compatibility/v1";
export const JUDGMENT_COMPATIBILITY_STAGE =
  "judgment_compatibility_phase2_v1";
export const JUDGMENT_COMPATIBILITY_CONSUMER_SURFACE =
  JUDGMENT_PROFILE_CONSUMER_SURFACE;
export const JUDGMENT_COMPATIBILITY_BOUNDARY =
  "additive_only_recommendation_only_judgment_consumer_contract";
export const JUDGMENT_COMPATIBILITY_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "judgment_compatibility",
  "deterministic",
  "enforcing",
]);
export const JUDGMENT_COMPATIBILITY_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "source_order",
  "readiness_refs",
  "contract_preservation",
]);
export const JUDGMENT_COMPATIBILITY_STABLE_EXPORT_SET = Object.freeze([
  "JUDGMENT_COMPATIBILITY_KIND",
  "JUDGMENT_COMPATIBILITY_VERSION",
  "JUDGMENT_COMPATIBILITY_SCHEMA_ID",
  "JUDGMENT_COMPATIBILITY_STAGE",
  "JUDGMENT_COMPATIBILITY_CONSUMER_SURFACE",
  "JUDGMENT_COMPATIBILITY_BOUNDARY",
  "JUDGMENT_COMPATIBILITY_TOP_LEVEL_FIELDS",
  "JUDGMENT_COMPATIBILITY_PAYLOAD_FIELDS",
  "JUDGMENT_COMPATIBILITY_STABLE_EXPORT_SET",
  "buildJudgmentCompatibilityContract",
  "validateJudgmentCompatibilityContract",
  "assertValidJudgmentCompatibilityContract",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildJudgmentCompatibilityContract({
  judgmentProfile,
  judgmentReadinessProfile,
}) {
  const profile = assertValidJudgmentProfile(judgmentProfile);
  const readiness = assertValidJudgmentReadinessProfile(judgmentReadinessProfile);

  if (profile.canonical_action_hash !== readiness.canonical_action_hash) {
    throw new Error(
      "judgment compatibility requires matching canonical action hashes"
    );
  }

  return {
    kind: JUDGMENT_COMPATIBILITY_KIND,
    version: JUDGMENT_COMPATIBILITY_VERSION,
    schema_id: JUDGMENT_COMPATIBILITY_SCHEMA_ID,
    canonical_action_hash: profile.canonical_action_hash,
    judgment_compatibility: {
      stage: JUDGMENT_COMPATIBILITY_STAGE,
      consumer_surface: JUDGMENT_COMPATIBILITY_CONSUMER_SURFACE,
      boundary: JUDGMENT_COMPATIBILITY_BOUNDARY,
      source_order: JUDGMENT_PROFILE_SOURCE_ORDER,
      readiness_refs: {
        judgment_profile_kind: JUDGMENT_PROFILE_KIND,
        judgment_profile_version: JUDGMENT_PROFILE_VERSION,
        judgment_profile_boundary: JUDGMENT_PROFILE_BOUNDARY,
        judgment_readiness_kind: JUDGMENT_READINESS_KIND,
        judgment_readiness_version: JUDGMENT_READINESS_VERSION,
        judgment_readiness_boundary: JUDGMENT_READINESS_BOUNDARY,
      },
      contract_preservation: {
        recommendation_only: true,
        additive_only: true,
        permit_gate_semantics_preserved: true,
        enforcement_pilot_semantics_preserved: true,
        limited_authority_semantics_preserved: true,
        audit_output_preserved: true,
        audit_verdict_preserved: true,
        actual_exit_code_preserved: true,
        denied_exit_code_preserved: 25,
        authority_scope: "review_gate_deny_exit_recommendation_only",
        governance_object_addition: false,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateJudgmentCompatibilityContract(contract) {
  const errors = [];

  if (!isPlainObject(contract)) {
    return {
      ok: false,
      errors: ["judgment compatibility contract must be an object"],
    };
  }
  if (
    JSON.stringify(Object.keys(contract)) !==
    JSON.stringify(JUDGMENT_COMPATIBILITY_TOP_LEVEL_FIELDS)
  ) {
    errors.push("judgment compatibility top-level field order drifted");
  }
  if (contract.kind !== JUDGMENT_COMPATIBILITY_KIND) {
    errors.push("judgment compatibility kind drifted");
  }
  if (contract.version !== JUDGMENT_COMPATIBILITY_VERSION) {
    errors.push("judgment compatibility version drifted");
  }
  if (contract.schema_id !== JUDGMENT_COMPATIBILITY_SCHEMA_ID) {
    errors.push("judgment compatibility schema id drifted");
  }
  if (
    typeof contract.canonical_action_hash !== "string" ||
    contract.canonical_action_hash.length === 0
  ) {
    errors.push("judgment compatibility canonical_action_hash is required");
  }
  if (contract.deterministic !== true) {
    errors.push("judgment compatibility must remain deterministic");
  }
  if (contract.enforcing !== false) {
    errors.push("judgment compatibility must remain non-enforcing");
  }
  if (!isPlainObject(contract.judgment_compatibility)) {
    errors.push("judgment compatibility payload must be an object");
    return { ok: errors.length === 0, errors };
  }

  const payload = contract.judgment_compatibility;
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(JUDGMENT_COMPATIBILITY_PAYLOAD_FIELDS)
  ) {
    errors.push("judgment compatibility payload field order drifted");
  }
  if (payload.stage !== JUDGMENT_COMPATIBILITY_STAGE) {
    errors.push("judgment compatibility stage drifted");
  }
  if (payload.consumer_surface !== JUDGMENT_COMPATIBILITY_CONSUMER_SURFACE) {
    errors.push("judgment compatibility consumer surface drifted");
  }
  if (payload.boundary !== JUDGMENT_COMPATIBILITY_BOUNDARY) {
    errors.push("judgment compatibility boundary drifted");
  }
  if (
    JSON.stringify(payload.source_order) !== JSON.stringify(JUDGMENT_PROFILE_SOURCE_ORDER)
  ) {
    errors.push("judgment compatibility source order drifted");
  }
  if (!isPlainObject(payload.readiness_refs)) {
    errors.push("judgment compatibility readiness refs must be an object");
  } else {
    if (payload.readiness_refs.judgment_profile_kind !== JUDGMENT_PROFILE_KIND) {
      errors.push("judgment compatibility profile kind drifted");
    }
    if (
      payload.readiness_refs.judgment_profile_version !==
      JUDGMENT_PROFILE_VERSION
    ) {
      errors.push("judgment compatibility profile version drifted");
    }
    if (
      payload.readiness_refs.judgment_profile_boundary !==
      JUDGMENT_PROFILE_BOUNDARY
    ) {
      errors.push("judgment compatibility profile boundary drifted");
    }
    if (
      payload.readiness_refs.judgment_readiness_kind !== JUDGMENT_READINESS_KIND
    ) {
      errors.push("judgment compatibility readiness kind drifted");
    }
    if (
      payload.readiness_refs.judgment_readiness_version !==
      JUDGMENT_READINESS_VERSION
    ) {
      errors.push("judgment compatibility readiness version drifted");
    }
    if (
      payload.readiness_refs.judgment_readiness_boundary !==
      JUDGMENT_READINESS_BOUNDARY
    ) {
      errors.push("judgment compatibility readiness boundary drifted");
    }
  }
  if (!isPlainObject(payload.contract_preservation)) {
    errors.push("judgment compatibility preservation contract must be an object");
  } else {
    const preservation = payload.contract_preservation;
    if (preservation.recommendation_only !== true) {
      errors.push("judgment compatibility must remain recommendation-only");
    }
    if (preservation.additive_only !== true) {
      errors.push("judgment compatibility must remain additive-only");
    }
    if (preservation.permit_gate_semantics_preserved !== true) {
      errors.push("judgment compatibility must preserve permit gate semantics");
    }
    if (preservation.enforcement_pilot_semantics_preserved !== true) {
      errors.push(
        "judgment compatibility must preserve enforcement pilot semantics"
      );
    }
    if (preservation.limited_authority_semantics_preserved !== true) {
      errors.push(
        "judgment compatibility must preserve limited authority semantics"
      );
    }
    if (preservation.audit_output_preserved !== true) {
      errors.push("judgment compatibility must preserve audit output");
    }
    if (preservation.audit_verdict_preserved !== true) {
      errors.push("judgment compatibility must preserve audit verdict");
    }
    if (preservation.actual_exit_code_preserved !== true) {
      errors.push("judgment compatibility must preserve actual exit code");
    }
    if (preservation.denied_exit_code_preserved !== 25) {
      errors.push("judgment compatibility deny exit code drifted");
    }
    if (
      preservation.authority_scope !==
      "review_gate_deny_exit_recommendation_only"
    ) {
      errors.push("judgment compatibility authority scope drifted");
    }
    if (preservation.governance_object_addition !== false) {
      errors.push("judgment compatibility must not add governance objects");
    }
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function assertValidJudgmentCompatibilityContract(contract) {
  const validation = validateJudgmentCompatibilityContract(contract);
  if (validation.ok) return contract;

  const err = new Error(
    `judgment compatibility contract invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
