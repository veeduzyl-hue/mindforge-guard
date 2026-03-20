import {
  JUDGMENT_COMPATIBILITY_BOUNDARY,
  JUDGMENT_COMPATIBILITY_CONSUMER_SURFACE,
  JUDGMENT_COMPATIBILITY_KIND,
  JUDGMENT_COMPATIBILITY_STAGE,
  JUDGMENT_COMPATIBILITY_VERSION,
  assertValidJudgmentCompatibilityContract,
} from "./compatibility.mjs";
import {
  JUDGMENT_PROFILE_KIND,
  JUDGMENT_PROFILE_SOURCE_ORDER,
  JUDGMENT_PROFILE_VERSION,
  assertValidJudgmentProfile,
} from "./profile.mjs";
import {
  JUDGMENT_READINESS_CONSUMER_COMPATIBLE,
  JUDGMENT_READINESS_KIND,
  JUDGMENT_READINESS_STAGE,
  JUDGMENT_READINESS_VERSION,
  assertValidJudgmentReadinessProfile,
} from "./readiness.mjs";

export const JUDGMENT_STABILIZATION_KIND = "judgment_stabilization_profile";
export const JUDGMENT_STABILIZATION_VERSION = "v1";
export const JUDGMENT_STABILIZATION_SCHEMA_ID =
  "mindforge/judgment-stabilization/v1";
export const JUDGMENT_STABILIZATION_STAGE =
  "judgment_stabilization_phase3_v1";
export const JUDGMENT_STABILIZATION_CONSUMER_SURFACE =
  JUDGMENT_COMPATIBILITY_CONSUMER_SURFACE;
export const JUDGMENT_FINAL_ACCEPTANCE_BOUNDARY =
  "final_recommendation_only_judgment_consumer_contract";
export const JUDGMENT_FINAL_ACCEPTANCE_READY = "final_consumer_ready";
export const JUDGMENT_STABILIZATION_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "judgment_stabilization",
  "deterministic",
  "enforcing",
]);
export const JUDGMENT_STABILIZATION_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "source_order",
  "contract_refs",
  "final_consumer_contract",
  "preserved_semantics",
]);
export const JUDGMENT_STABILIZATION_STABLE_EXPORT_SET = Object.freeze([
  "JUDGMENT_STABILIZATION_KIND",
  "JUDGMENT_STABILIZATION_VERSION",
  "JUDGMENT_STABILIZATION_SCHEMA_ID",
  "JUDGMENT_STABILIZATION_STAGE",
  "JUDGMENT_STABILIZATION_CONSUMER_SURFACE",
  "JUDGMENT_FINAL_ACCEPTANCE_BOUNDARY",
  "JUDGMENT_FINAL_ACCEPTANCE_READY",
  "JUDGMENT_STABILIZATION_TOP_LEVEL_FIELDS",
  "JUDGMENT_STABILIZATION_PAYLOAD_FIELDS",
  "JUDGMENT_STABILIZATION_STABLE_EXPORT_SET",
  "buildJudgmentStabilizationProfile",
  "validateJudgmentStabilizationProfile",
  "assertValidJudgmentStabilizationProfile",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildJudgmentStabilizationProfile({
  judgmentProfile,
  judgmentReadinessProfile,
  judgmentCompatibilityContract,
}) {
  const profile = assertValidJudgmentProfile(judgmentProfile);
  const readiness = assertValidJudgmentReadinessProfile(judgmentReadinessProfile);
  const compatibility = assertValidJudgmentCompatibilityContract(
    judgmentCompatibilityContract
  );

  if (profile.canonical_action_hash !== readiness.canonical_action_hash) {
    throw new Error(
      "judgment stabilization requires matching readiness canonical action hash"
    );
  }
  if (profile.canonical_action_hash !== compatibility.canonical_action_hash) {
    throw new Error(
      "judgment stabilization requires matching compatibility canonical action hash"
    );
  }

  return {
    kind: JUDGMENT_STABILIZATION_KIND,
    version: JUDGMENT_STABILIZATION_VERSION,
    schema_id: JUDGMENT_STABILIZATION_SCHEMA_ID,
    canonical_action_hash: profile.canonical_action_hash,
    judgment_stabilization: {
      stage: JUDGMENT_STABILIZATION_STAGE,
      consumer_surface: JUDGMENT_STABILIZATION_CONSUMER_SURFACE,
      boundary: JUDGMENT_FINAL_ACCEPTANCE_BOUNDARY,
      source_order: JUDGMENT_PROFILE_SOURCE_ORDER,
      contract_refs: {
        judgment_profile_kind: JUDGMENT_PROFILE_KIND,
        judgment_profile_version: JUDGMENT_PROFILE_VERSION,
        judgment_readiness_kind: JUDGMENT_READINESS_KIND,
        judgment_readiness_version: JUDGMENT_READINESS_VERSION,
        judgment_readiness_stage: JUDGMENT_READINESS_STAGE,
        judgment_compatibility_kind: JUDGMENT_COMPATIBILITY_KIND,
        judgment_compatibility_version: JUDGMENT_COMPATIBILITY_VERSION,
        judgment_compatibility_stage: JUDGMENT_COMPATIBILITY_STAGE,
        judgment_compatibility_boundary: JUDGMENT_COMPATIBILITY_BOUNDARY,
      },
      final_consumer_contract: {
        acceptance_level: JUDGMENT_FINAL_ACCEPTANCE_READY,
        recommendation_only: true,
        additive_only: true,
        audit_output_preserved: true,
        audit_verdict_preserved: true,
        actual_exit_code_preserved: true,
        denied_exit_code_preserved: 25,
        authority_scope: "review_gate_deny_exit_recommendation_only",
        governance_object_addition: false,
      },
      preserved_semantics: {
        permit_gate_semantics_preserved: true,
        enforcement_pilot_semantics_preserved: true,
        limited_authority_semantics_preserved: true,
        judgment_mapping_stable: true,
        consumer_contract_ready:
          readiness.judgment_readiness.consumer_contract.readiness ===
          JUDGMENT_READINESS_CONSUMER_COMPATIBLE,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateJudgmentStabilizationProfile(profile) {
  const errors = [];

  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: ["judgment stabilization profile must be an object"],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(JUDGMENT_STABILIZATION_TOP_LEVEL_FIELDS)
  ) {
    errors.push("judgment stabilization top-level field order drifted");
  }
  if (profile.kind !== JUDGMENT_STABILIZATION_KIND) {
    errors.push("judgment stabilization kind drifted");
  }
  if (profile.version !== JUDGMENT_STABILIZATION_VERSION) {
    errors.push("judgment stabilization version drifted");
  }
  if (profile.schema_id !== JUDGMENT_STABILIZATION_SCHEMA_ID) {
    errors.push("judgment stabilization schema id drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("judgment stabilization canonical_action_hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("judgment stabilization must remain deterministic");
  }
  if (profile.enforcing !== false) {
    errors.push("judgment stabilization must remain non-enforcing");
  }
  if (!isPlainObject(profile.judgment_stabilization)) {
    errors.push("judgment stabilization payload must be an object");
    return { ok: errors.length === 0, errors };
  }

  const payload = profile.judgment_stabilization;
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(JUDGMENT_STABILIZATION_PAYLOAD_FIELDS)
  ) {
    errors.push("judgment stabilization payload field order drifted");
  }
  if (payload.stage !== JUDGMENT_STABILIZATION_STAGE) {
    errors.push("judgment stabilization stage drifted");
  }
  if (payload.consumer_surface !== JUDGMENT_STABILIZATION_CONSUMER_SURFACE) {
    errors.push("judgment stabilization consumer surface drifted");
  }
  if (payload.boundary !== JUDGMENT_FINAL_ACCEPTANCE_BOUNDARY) {
    errors.push("judgment stabilization boundary drifted");
  }
  if (
    JSON.stringify(payload.source_order) !==
    JSON.stringify(JUDGMENT_PROFILE_SOURCE_ORDER)
  ) {
    errors.push("judgment stabilization source order drifted");
  }

  if (!isPlainObject(payload.contract_refs)) {
    errors.push("judgment stabilization contract refs must be an object");
  } else {
    if (payload.contract_refs.judgment_profile_kind !== JUDGMENT_PROFILE_KIND) {
      errors.push("judgment stabilization profile kind drifted");
    }
    if (
      payload.contract_refs.judgment_profile_version !== JUDGMENT_PROFILE_VERSION
    ) {
      errors.push("judgment stabilization profile version drifted");
    }
    if (
      payload.contract_refs.judgment_readiness_kind !== JUDGMENT_READINESS_KIND
    ) {
      errors.push("judgment stabilization readiness kind drifted");
    }
    if (
      payload.contract_refs.judgment_readiness_version !==
      JUDGMENT_READINESS_VERSION
    ) {
      errors.push("judgment stabilization readiness version drifted");
    }
    if (
      payload.contract_refs.judgment_readiness_stage !==
      JUDGMENT_READINESS_STAGE
    ) {
      errors.push("judgment stabilization readiness stage drifted");
    }
    if (
      payload.contract_refs.judgment_compatibility_kind !==
      JUDGMENT_COMPATIBILITY_KIND
    ) {
      errors.push("judgment stabilization compatibility kind drifted");
    }
    if (
      payload.contract_refs.judgment_compatibility_version !==
      JUDGMENT_COMPATIBILITY_VERSION
    ) {
      errors.push("judgment stabilization compatibility version drifted");
    }
    if (
      payload.contract_refs.judgment_compatibility_stage !==
      JUDGMENT_COMPATIBILITY_STAGE
    ) {
      errors.push("judgment stabilization compatibility stage drifted");
    }
    if (
      payload.contract_refs.judgment_compatibility_boundary !==
      JUDGMENT_COMPATIBILITY_BOUNDARY
    ) {
      errors.push("judgment stabilization compatibility boundary drifted");
    }
  }

  if (!isPlainObject(payload.final_consumer_contract)) {
    errors.push("judgment stabilization final consumer contract must be an object");
  } else {
    const contract = payload.final_consumer_contract;
    if (contract.acceptance_level !== JUDGMENT_FINAL_ACCEPTANCE_READY) {
      errors.push("judgment stabilization acceptance level drifted");
    }
    if (contract.recommendation_only !== true) {
      errors.push("judgment stabilization must remain recommendation-only");
    }
    if (contract.additive_only !== true) {
      errors.push("judgment stabilization must remain additive-only");
    }
    if (contract.audit_output_preserved !== true) {
      errors.push("judgment stabilization must preserve audit output");
    }
    if (contract.audit_verdict_preserved !== true) {
      errors.push("judgment stabilization must preserve audit verdict");
    }
    if (contract.actual_exit_code_preserved !== true) {
      errors.push("judgment stabilization must preserve actual exit code");
    }
    if (contract.denied_exit_code_preserved !== 25) {
      errors.push("judgment stabilization deny exit code drifted");
    }
    if (
      contract.authority_scope !== "review_gate_deny_exit_recommendation_only"
    ) {
      errors.push("judgment stabilization authority scope drifted");
    }
    if (contract.governance_object_addition !== false) {
      errors.push("judgment stabilization must not add governance objects");
    }
  }

  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push("judgment stabilization preserved semantics must be an object");
  } else {
    const semantics = payload.preserved_semantics;
    if (semantics.permit_gate_semantics_preserved !== true) {
      errors.push("judgment stabilization must preserve permit gate semantics");
    }
    if (semantics.enforcement_pilot_semantics_preserved !== true) {
      errors.push(
        "judgment stabilization must preserve enforcement pilot semantics"
      );
    }
    if (semantics.limited_authority_semantics_preserved !== true) {
      errors.push(
        "judgment stabilization must preserve limited authority semantics"
      );
    }
    if (semantics.judgment_mapping_stable !== true) {
      errors.push("judgment stabilization mapping stability drifted");
    }
    if (semantics.consumer_contract_ready !== true) {
      errors.push("judgment stabilization consumer contract readiness drifted");
    }
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function assertValidJudgmentStabilizationProfile(profile) {
  const validation = validateJudgmentStabilizationProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `judgment stabilization profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
