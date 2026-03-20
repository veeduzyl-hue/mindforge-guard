export const ENFORCEMENT_PILOT_RESULT_KIND = "enforcement_pilot_result";
export const ENFORCEMENT_PILOT_RESULT_VERSION = "v1";
export const ENFORCEMENT_PILOT_MODE = "explicit_opt_in";
export const ENFORCEMENT_PILOT_DEFAULT_STATE = "disabled";
export const ENFORCEMENT_PILOT_CONSUMER_SURFACE = "guard.audit";
export const ENFORCEMENT_PILOT_RESULT_BOUNDARY = "non_enforcing_sidecar";
export const ENFORCEMENT_PILOT_HARDENING_STAGE = "stable_sidecar_v1";
export const ENFORCEMENT_PILOT_PROMOTION_STAGE = "promoted_pilot_v1";
export const ENFORCEMENT_PILOT_PROMOTION_BOUNDARY =
  "stable_explicit_opt_in_non_enforcing_sidecar";
export const ENFORCEMENT_PILOT_STABILIZATION_STAGE = "stable_pilot_v1";
export const ENFORCEMENT_PILOT_ACCEPTANCE_BOUNDARY =
  "stable_explicit_opt_in_non_authority_audit_adjacent_pilot";
export const ENFORCEMENT_PILOT_FINALIZATION_STAGE = "finalized_non_authority_pilot_v1";
export const ENFORCEMENT_PILOT_FINAL_ACCEPTANCE_BOUNDARY =
  "final_explicit_opt_in_non_authority_audit_adjacent_sidecar_pilot";
export const LIMITED_ENFORCEMENT_AUTHORITY_RESULT_KIND =
  "limited_enforcement_authority_result";
export const LIMITED_ENFORCEMENT_AUTHORITY_RESULT_VERSION = "v1";
export const LIMITED_ENFORCEMENT_AUTHORITY_MODE = "explicit_opt_in";
export const LIMITED_ENFORCEMENT_AUTHORITY_DEFAULT_STATE = "disabled";
export const LIMITED_ENFORCEMENT_AUTHORITY_CONSUMER_SURFACE = "guard.audit";
export const LIMITED_ENFORCEMENT_AUTHORITY_BOUNDARY =
  "explicit_opt_in_limited_authority_sidecar";
export const LIMITED_ENFORCEMENT_AUTHORITY_SCOPE =
  "review_gate_deny_exit_recommendation_only";
export const LIMITED_ENFORCEMENT_AUTHORITY_STAGE = "limited_authority_pilot_v1";
export const LIMITED_ENFORCEMENT_AUTHORITY_HARDENING_STAGE =
  "stable_limited_authority_sidecar_v1";
export const LIMITED_ENFORCEMENT_AUTHORITY_PROMOTION_STAGE =
  "promoted_limited_authority_pilot_v1";
export const LIMITED_ENFORCEMENT_AUTHORITY_PROMOTION_BOUNDARY =
  "promoted_explicit_opt_in_recommendation_only_authority_sidecar";
export const LIMITED_ENFORCEMENT_AUTHORITY_STABILIZATION_STAGE =
  "stable_limited_authority_pilot_v1";
export const LIMITED_ENFORCEMENT_AUTHORITY_ACCEPTANCE_BOUNDARY =
  "stable_explicit_opt_in_recommendation_only_authority_sidecar";
export const ENFORCEMENT_PILOT_OUTPUT_ENCODING = "utf8";
export const ENFORCEMENT_PILOT_OUTPUT_EOL = "\n";
export const ENFORCEMENT_PILOT_PRETTY_INDENT = 2;
export const LIMITED_ENFORCEMENT_AUTHORITY_OUTPUT_ENCODING =
  ENFORCEMENT_PILOT_OUTPUT_ENCODING;
export const LIMITED_ENFORCEMENT_AUTHORITY_OUTPUT_EOL =
  ENFORCEMENT_PILOT_OUTPUT_EOL;
export const LIMITED_ENFORCEMENT_AUTHORITY_PRETTY_INDENT =
  ENFORCEMENT_PILOT_PRETTY_INDENT;
export const ENFORCEMENT_PILOT_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "canonical_action_hash",
  "enforcement_pilot",
  "deterministic",
  "enforcing",
]);
export const ENFORCEMENT_PILOT_PAYLOAD_FIELDS = Object.freeze([
  "mode",
  "default_state",
  "consumer_surface",
  "result_boundary",
  "decision",
  "readiness",
  "bridge_verdict",
  "current_audit_verdict",
  "current_audit_exit_code",
  "reasons",
]);
export const LIMITED_ENFORCEMENT_AUTHORITY_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "canonical_action_hash",
  "limited_enforcement_authority",
  "deterministic",
  "authority_active",
]);
export const LIMITED_ENFORCEMENT_AUTHORITY_PAYLOAD_FIELDS = Object.freeze([
  "mode",
  "default_state",
  "consumer_surface",
  "authority_boundary",
  "authority_scope",
  "authority_status",
  "decision",
  "readiness",
  "bridge_verdict",
  "current_audit_verdict",
  "current_audit_exit_code",
  "proposed_audit_exit_code",
  "reasons",
]);
export const ENFORCEMENT_PILOT_COMPATIBILITY_GUARDS = Object.freeze([
  "explicit_opt_in_only",
  "default_off_only",
  "non_enforcing_sidecar_only",
  "no_audit_output_mutation",
  "no_audit_verdict_mutation",
  "no_exit_code_authority_claim",
]);
export const ENFORCEMENT_PILOT_PROMOTION_GUARDS = Object.freeze([
  "promoted_pilot_contract_only",
  "stable_export_boundary_frozen",
  "stable_sidecar_shape_frozen",
  "stable_non_authority_sidecar_only",
]);
export const ENFORCEMENT_PILOT_STABILIZATION_GUARDS = Object.freeze([
  "stable_acceptance_boundary_frozen",
  "stable_promoted_export_base_frozen",
  "stable_non_authority_pilot_only",
  "stable_audit_adjacent_sidecar_only",
]);
export const ENFORCEMENT_PILOT_FINALIZATION_GATES = Object.freeze([
  "final_acceptance_boundary_frozen",
  "final_export_boundary_frozen",
  "final_non_authority_pilot_only",
  "final_audit_adjacent_sidecar_only",
  "final_default_off_explicit_opt_in_only",
]);
export const LIMITED_ENFORCEMENT_AUTHORITY_GUARDS = Object.freeze([
  "explicit_opt_in_only",
  "default_off_only",
  "local_audit_only",
  "audit_adjacent_sidecar_only",
  "no_audit_output_mutation",
  "no_audit_verdict_mutation",
  "no_exit_code_mutation",
  "review_gate_deny_exit_recommendation_only",
]);
export const LIMITED_ENFORCEMENT_AUTHORITY_HARDENING_GUARDS = Object.freeze([
  "stable_sidecar_shape_frozen",
  "stable_serializer_frozen",
  "stable_field_order_frozen",
  "stable_recommendation_scope_frozen",
  "stable_non_executing_authority_only",
]);
export const LIMITED_ENFORCEMENT_AUTHORITY_PROMOTION_GUARDS = Object.freeze([
  "promoted_contract_only",
  "promoted_export_boundary_frozen",
  "promoted_recommendation_scope_only",
  "promoted_non_executing_authority_only",
]);
export const LIMITED_ENFORCEMENT_AUTHORITY_STABILIZATION_GUARDS = Object.freeze([
  "stable_acceptance_boundary_frozen",
  "stable_promoted_export_base_frozen",
  "stable_recommendation_only_authority_only",
  "stable_non_executing_audit_adjacent_sidecar_only",
]);
export const ENFORCEMENT_PILOT_SUPPORTED_DECISIONS = Object.freeze([
  "would_allow",
  "would_review",
  "would_deny",
  "insufficient_signal",
]);
export const LIMITED_ENFORCEMENT_AUTHORITY_STATUSES = Object.freeze([
  "inactive",
  "would_require_review",
  "would_apply_deny_exit_code",
]);
export const ENFORCEMENT_PILOT_STABLE_EXPORT_SET = Object.freeze([
  "ENFORCEMENT_PILOT_RESULT_KIND",
  "ENFORCEMENT_PILOT_RESULT_VERSION",
  "ENFORCEMENT_PILOT_MODE",
  "ENFORCEMENT_PILOT_DEFAULT_STATE",
  "ENFORCEMENT_PILOT_CONSUMER_SURFACE",
  "ENFORCEMENT_PILOT_RESULT_BOUNDARY",
  "ENFORCEMENT_PILOT_HARDENING_STAGE",
  "ENFORCEMENT_PILOT_OUTPUT_ENCODING",
  "ENFORCEMENT_PILOT_OUTPUT_EOL",
  "ENFORCEMENT_PILOT_PRETTY_INDENT",
  "ENFORCEMENT_PILOT_TOP_LEVEL_FIELDS",
  "ENFORCEMENT_PILOT_PAYLOAD_FIELDS",
  "ENFORCEMENT_PILOT_COMPATIBILITY_GUARDS",
  "ENFORCEMENT_PILOT_SUPPORTED_DECISIONS",
  "ENFORCEMENT_PILOT_STABLE_EXPORT_SET",
  "buildEnforcementPilotResult",
  "validateEnforcementPilotResult",
  "assertValidEnforcementPilotResult",
  "validateEnforcementPilotHardening",
  "assertValidEnforcementPilotHardening",
  "serializeEnforcementPilotResult",
]);
export const ENFORCEMENT_PILOT_PROMOTION_EXPORT_SET = Object.freeze([
  ...ENFORCEMENT_PILOT_STABLE_EXPORT_SET,
  "ENFORCEMENT_PILOT_PROMOTION_STAGE",
  "ENFORCEMENT_PILOT_PROMOTION_BOUNDARY",
  "ENFORCEMENT_PILOT_PROMOTION_GUARDS",
  "ENFORCEMENT_PILOT_PROMOTION_EXPORT_SET",
  "validateEnforcementPilotPromotion",
  "assertValidEnforcementPilotPromotion",
]);
export const ENFORCEMENT_PILOT_STABILIZATION_EXPORT_SET = Object.freeze([
  ...ENFORCEMENT_PILOT_PROMOTION_EXPORT_SET,
  "ENFORCEMENT_PILOT_STABILIZATION_STAGE",
  "ENFORCEMENT_PILOT_ACCEPTANCE_BOUNDARY",
  "ENFORCEMENT_PILOT_STABILIZATION_GUARDS",
  "ENFORCEMENT_PILOT_STABILIZATION_EXPORT_SET",
  "validateEnforcementPilotStabilization",
  "assertValidEnforcementPilotStabilization",
]);
export const ENFORCEMENT_PILOT_FINAL_EXPORT_SET = Object.freeze([
  ...ENFORCEMENT_PILOT_STABILIZATION_EXPORT_SET,
  "ENFORCEMENT_PILOT_FINALIZATION_STAGE",
  "ENFORCEMENT_PILOT_FINAL_ACCEPTANCE_BOUNDARY",
  "ENFORCEMENT_PILOT_FINALIZATION_GATES",
  "ENFORCEMENT_PILOT_FINAL_EXPORT_SET",
  "validateEnforcementPilotFinalization",
  "assertValidEnforcementPilotFinalization",
]);
export const LIMITED_ENFORCEMENT_AUTHORITY_EXPORT_SET = Object.freeze([
  ...ENFORCEMENT_PILOT_FINAL_EXPORT_SET,
  "LIMITED_ENFORCEMENT_AUTHORITY_RESULT_KIND",
  "LIMITED_ENFORCEMENT_AUTHORITY_RESULT_VERSION",
  "LIMITED_ENFORCEMENT_AUTHORITY_MODE",
  "LIMITED_ENFORCEMENT_AUTHORITY_DEFAULT_STATE",
  "LIMITED_ENFORCEMENT_AUTHORITY_CONSUMER_SURFACE",
  "LIMITED_ENFORCEMENT_AUTHORITY_BOUNDARY",
  "LIMITED_ENFORCEMENT_AUTHORITY_SCOPE",
  "LIMITED_ENFORCEMENT_AUTHORITY_STAGE",
  "LIMITED_ENFORCEMENT_AUTHORITY_HARDENING_STAGE",
  "LIMITED_ENFORCEMENT_AUTHORITY_PROMOTION_STAGE",
  "LIMITED_ENFORCEMENT_AUTHORITY_PROMOTION_BOUNDARY",
  "LIMITED_ENFORCEMENT_AUTHORITY_OUTPUT_ENCODING",
  "LIMITED_ENFORCEMENT_AUTHORITY_OUTPUT_EOL",
  "LIMITED_ENFORCEMENT_AUTHORITY_PRETTY_INDENT",
  "LIMITED_ENFORCEMENT_AUTHORITY_TOP_LEVEL_FIELDS",
  "LIMITED_ENFORCEMENT_AUTHORITY_PAYLOAD_FIELDS",
  "LIMITED_ENFORCEMENT_AUTHORITY_GUARDS",
  "LIMITED_ENFORCEMENT_AUTHORITY_HARDENING_GUARDS",
  "LIMITED_ENFORCEMENT_AUTHORITY_PROMOTION_GUARDS",
  "LIMITED_ENFORCEMENT_AUTHORITY_STATUSES",
  "LIMITED_ENFORCEMENT_AUTHORITY_EXPORT_SET",
  "buildLimitedEnforcementAuthorityResult",
  "serializeLimitedEnforcementAuthorityResult",
  "validateLimitedEnforcementAuthorityResult",
  "assertValidLimitedEnforcementAuthorityResult",
  "validateLimitedEnforcementAuthorityPilot",
  "assertValidLimitedEnforcementAuthorityPilot",
  "validateLimitedEnforcementAuthorityHardening",
  "assertValidLimitedEnforcementAuthorityHardening",
  "validateLimitedEnforcementAuthorityPromotion",
  "assertValidLimitedEnforcementAuthorityPromotion",
]);
export const LIMITED_ENFORCEMENT_AUTHORITY_STABILIZATION_EXPORT_SET =
  Object.freeze([
    ...LIMITED_ENFORCEMENT_AUTHORITY_EXPORT_SET,
    "LIMITED_ENFORCEMENT_AUTHORITY_STABILIZATION_STAGE",
    "LIMITED_ENFORCEMENT_AUTHORITY_ACCEPTANCE_BOUNDARY",
    "LIMITED_ENFORCEMENT_AUTHORITY_STABILIZATION_GUARDS",
    "LIMITED_ENFORCEMENT_AUTHORITY_STABILIZATION_EXPORT_SET",
    "validateLimitedEnforcementAuthorityStabilization",
    "assertValidLimitedEnforcementAuthorityStabilization",
  ]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildEnforcementPilotResult({
  audit,
  canonicalActionArtifact,
  executionReadinessArtifact,
  enforcementAdjacentDecisionArtifact,
}) {
  const decision =
    enforcementAdjacentDecisionArtifact?.enforcement_adjacent_decision?.decision ||
    "insufficient_signal";
  const readiness =
    executionReadinessArtifact?.execution_readiness?.readiness || "unknown";
  const bridgeVerdict =
    executionReadinessArtifact?.execution_readiness?.bridge_verdict || "unknown";
  const reasons = Array.isArray(
    enforcementAdjacentDecisionArtifact?.enforcement_adjacent_decision?.reasons
  )
    ? enforcementAdjacentDecisionArtifact.enforcement_adjacent_decision.reasons
    : [];

  return {
    kind: ENFORCEMENT_PILOT_RESULT_KIND,
    version: ENFORCEMENT_PILOT_RESULT_VERSION,
    canonical_action_hash: canonicalActionArtifact?.canonical_action_hash,
    enforcement_pilot: {
      mode: ENFORCEMENT_PILOT_MODE,
      default_state: ENFORCEMENT_PILOT_DEFAULT_STATE,
      consumer_surface: ENFORCEMENT_PILOT_CONSUMER_SURFACE,
      result_boundary: ENFORCEMENT_PILOT_RESULT_BOUNDARY,
      decision,
      readiness,
      bridge_verdict: bridgeVerdict,
      current_audit_verdict: audit?.evaluation?.verdict || "unknown",
      current_audit_exit_code: null,
      reasons,
    },
    deterministic: true,
    enforcing: false,
  };
}

export function buildLimitedEnforcementAuthorityResult({
  audit,
  canonicalActionArtifact,
  executionReadinessArtifact,
  enforcementAdjacentDecisionArtifact,
  deniedExitCode = 25,
}) {
  const decision =
    enforcementAdjacentDecisionArtifact?.enforcement_adjacent_decision?.decision ||
    "insufficient_signal";
  const readiness =
    executionReadinessArtifact?.execution_readiness?.readiness || "unknown";
  const bridgeVerdict =
    executionReadinessArtifact?.execution_readiness?.bridge_verdict || "unknown";
  const reasons = Array.isArray(
    enforcementAdjacentDecisionArtifact?.enforcement_adjacent_decision?.reasons
  )
    ? enforcementAdjacentDecisionArtifact.enforcement_adjacent_decision.reasons
    : [];

  let authorityStatus = "inactive";
  let proposedAuditExitCode = null;
  if (decision === "would_deny") {
    authorityStatus = "would_apply_deny_exit_code";
    proposedAuditExitCode = deniedExitCode;
  } else if (decision === "would_review") {
    authorityStatus = "would_require_review";
  }

  return {
    kind: LIMITED_ENFORCEMENT_AUTHORITY_RESULT_KIND,
    version: LIMITED_ENFORCEMENT_AUTHORITY_RESULT_VERSION,
    canonical_action_hash: canonicalActionArtifact?.canonical_action_hash,
    limited_enforcement_authority: {
      mode: LIMITED_ENFORCEMENT_AUTHORITY_MODE,
      default_state: LIMITED_ENFORCEMENT_AUTHORITY_DEFAULT_STATE,
      consumer_surface: LIMITED_ENFORCEMENT_AUTHORITY_CONSUMER_SURFACE,
      authority_boundary: LIMITED_ENFORCEMENT_AUTHORITY_BOUNDARY,
      authority_scope: LIMITED_ENFORCEMENT_AUTHORITY_SCOPE,
      authority_status: authorityStatus,
      decision,
      readiness,
      bridge_verdict: bridgeVerdict,
      current_audit_verdict: audit?.evaluation?.verdict || "unknown",
      current_audit_exit_code: null,
      proposed_audit_exit_code: proposedAuditExitCode,
      reasons,
    },
    deterministic: true,
    authority_active: authorityStatus !== "inactive",
  };
}

export function validateEnforcementPilotResult(result) {
  const errors = [];

  if (!isPlainObject(result)) {
    return { ok: false, errors: ["enforcement pilot result must be an object"] };
  }
  if (result.kind !== ENFORCEMENT_PILOT_RESULT_KIND) {
    errors.push("enforcement pilot result kind drifted");
  }
  if (result.version !== ENFORCEMENT_PILOT_RESULT_VERSION) {
    errors.push("enforcement pilot result version drifted");
  }
  if (typeof result.canonical_action_hash !== "string" || result.canonical_action_hash.length === 0) {
    errors.push("enforcement pilot result canonical_action_hash is required");
  }
  if (!isPlainObject(result.enforcement_pilot)) {
    errors.push("enforcement pilot payload must be an object");
  } else {
    const payload = result.enforcement_pilot;
    if (JSON.stringify(Object.keys(payload)) !== JSON.stringify(ENFORCEMENT_PILOT_PAYLOAD_FIELDS)) {
      errors.push("enforcement pilot payload field order drifted");
    }
    if (payload.mode !== ENFORCEMENT_PILOT_MODE) {
      errors.push("enforcement pilot mode drifted");
    }
    if (payload.default_state !== ENFORCEMENT_PILOT_DEFAULT_STATE) {
      errors.push("enforcement pilot default state drifted");
    }
    if (payload.consumer_surface !== ENFORCEMENT_PILOT_CONSUMER_SURFACE) {
      errors.push("enforcement pilot consumer surface drifted");
    }
    if (payload.result_boundary !== ENFORCEMENT_PILOT_RESULT_BOUNDARY) {
      errors.push("enforcement pilot result boundary drifted");
    }
    if (!ENFORCEMENT_PILOT_SUPPORTED_DECISIONS.includes(payload.decision)) {
      errors.push("enforcement pilot decision is invalid");
    }
    if (!Array.isArray(payload.reasons)) {
      errors.push("enforcement pilot reasons must be an array");
    }
  }
  if (result.deterministic !== true) {
    errors.push("enforcement pilot result must remain deterministic");
  }
  if (result.enforcing !== false) {
    errors.push("enforcement pilot result must remain non-enforcing");
  }
  if (result.enforcement_pilot?.current_audit_exit_code !== null) {
    errors.push("enforcement pilot result must not claim authority over audit exit code");
  }
  if (JSON.stringify(Object.keys(result)) !== JSON.stringify(ENFORCEMENT_PILOT_TOP_LEVEL_FIELDS)) {
    errors.push("enforcement pilot top-level field order drifted");
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function assertValidEnforcementPilotResult(result) {
  const validation = validateEnforcementPilotResult(result);
  if (validation.ok) return result;

  const err = new Error(
    `enforcement pilot result invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}

export function validateLimitedEnforcementAuthorityResult(result) {
  const errors = [];

  if (!isPlainObject(result)) {
    return {
      ok: false,
      errors: ["limited enforcement authority result must be an object"],
    };
  }
  if (result.kind !== LIMITED_ENFORCEMENT_AUTHORITY_RESULT_KIND) {
    errors.push("limited enforcement authority result kind drifted");
  }
  if (result.version !== LIMITED_ENFORCEMENT_AUTHORITY_RESULT_VERSION) {
    errors.push("limited enforcement authority result version drifted");
  }
  if (
    typeof result.canonical_action_hash !== "string" ||
    result.canonical_action_hash.length === 0
  ) {
    errors.push("limited enforcement authority canonical_action_hash is required");
  }
  if (!isPlainObject(result.limited_enforcement_authority)) {
    errors.push("limited enforcement authority payload must be an object");
  } else {
    const payload = result.limited_enforcement_authority;
    if (
      JSON.stringify(Object.keys(payload)) !==
      JSON.stringify(LIMITED_ENFORCEMENT_AUTHORITY_PAYLOAD_FIELDS)
    ) {
      errors.push("limited enforcement authority payload field order drifted");
    }
    if (payload.mode !== LIMITED_ENFORCEMENT_AUTHORITY_MODE) {
      errors.push("limited enforcement authority mode drifted");
    }
    if (payload.default_state !== LIMITED_ENFORCEMENT_AUTHORITY_DEFAULT_STATE) {
      errors.push("limited enforcement authority default state drifted");
    }
    if (
      payload.consumer_surface !== LIMITED_ENFORCEMENT_AUTHORITY_CONSUMER_SURFACE
    ) {
      errors.push("limited enforcement authority consumer surface drifted");
    }
    if (payload.authority_boundary !== LIMITED_ENFORCEMENT_AUTHORITY_BOUNDARY) {
      errors.push("limited enforcement authority boundary drifted");
    }
    if (payload.authority_scope !== LIMITED_ENFORCEMENT_AUTHORITY_SCOPE) {
      errors.push("limited enforcement authority scope drifted");
    }
    if (
      !LIMITED_ENFORCEMENT_AUTHORITY_STATUSES.includes(payload.authority_status)
    ) {
      errors.push("limited enforcement authority status is invalid");
    }
    if (!ENFORCEMENT_PILOT_SUPPORTED_DECISIONS.includes(payload.decision)) {
      errors.push("limited enforcement authority decision is invalid");
    }
    if (!Array.isArray(payload.reasons)) {
      errors.push("limited enforcement authority reasons must be an array");
    }
    if (payload.current_audit_exit_code !== null) {
      errors.push("limited enforcement authority must not claim current audit exit code");
    }
    if (
      payload.authority_status === "would_apply_deny_exit_code" &&
      payload.proposed_audit_exit_code !== 25
    ) {
      errors.push("limited enforcement authority deny recommendation drifted");
    }
    if (
      payload.authority_status !== "would_apply_deny_exit_code" &&
      payload.proposed_audit_exit_code !== null
    ) {
      errors.push(
        "limited enforcement authority proposed audit exit code must remain null outside deny recommendation"
      );
    }
  }
  if (result.deterministic !== true) {
    errors.push("limited enforcement authority result must remain deterministic");
  }
  if (
    result.authority_active !==
    (result.limited_enforcement_authority?.authority_status !== "inactive")
  ) {
    errors.push("limited enforcement authority activation state drifted");
  }
  if (
    JSON.stringify(Object.keys(result)) !==
    JSON.stringify(LIMITED_ENFORCEMENT_AUTHORITY_TOP_LEVEL_FIELDS)
  ) {
    errors.push("limited enforcement authority top-level field order drifted");
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function assertValidLimitedEnforcementAuthorityResult(result) {
  const validation = validateLimitedEnforcementAuthorityResult(result);
  if (validation.ok) return result;

  const err = new Error(
    `limited enforcement authority result invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}

export function validateEnforcementPilotHardening(result) {
  const errors = [];
  const validation = validateEnforcementPilotResult(result);

  if (!validation.ok) {
    errors.push(...validation.errors);
  }
  if (ENFORCEMENT_PILOT_HARDENING_STAGE !== "stable_sidecar_v1") {
    errors.push("enforcement pilot hardening stage drifted");
  }
  for (const guard of [
    "explicit_opt_in_only",
    "default_off_only",
    "non_enforcing_sidecar_only",
    "no_audit_output_mutation",
    "no_audit_verdict_mutation",
    "no_exit_code_authority_claim",
  ]) {
    if (!ENFORCEMENT_PILOT_COMPATIBILITY_GUARDS.includes(guard)) {
      errors.push(`enforcement pilot compatibility guard missing: ${guard}`);
    }
  }
  if (
    new Set(ENFORCEMENT_PILOT_STABLE_EXPORT_SET).size !==
    ENFORCEMENT_PILOT_STABLE_EXPORT_SET.length
  ) {
    errors.push("enforcement pilot stable export set contains duplicates");
  }
  if (
    new Set(ENFORCEMENT_PILOT_TOP_LEVEL_FIELDS).size !==
    ENFORCEMENT_PILOT_TOP_LEVEL_FIELDS.length
  ) {
    errors.push("enforcement pilot top-level fields contain duplicates");
  }
  if (
    new Set(ENFORCEMENT_PILOT_PAYLOAD_FIELDS).size !==
    ENFORCEMENT_PILOT_PAYLOAD_FIELDS.length
  ) {
    errors.push("enforcement pilot payload fields contain duplicates");
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function assertValidEnforcementPilotHardening(result) {
  const validation = validateEnforcementPilotHardening(result);
  if (validation.ok) return result;

  const err = new Error(
    `enforcement pilot hardening invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}

export function validateEnforcementPilotPromotion(result) {
  const errors = [];
  const validation = validateEnforcementPilotHardening(result);

  if (!validation.ok) {
    errors.push(...validation.errors);
  }
  if (ENFORCEMENT_PILOT_PROMOTION_STAGE !== "promoted_pilot_v1") {
    errors.push("enforcement pilot promotion stage drifted");
  }
  if (
    ENFORCEMENT_PILOT_PROMOTION_BOUNDARY !==
    "stable_explicit_opt_in_non_enforcing_sidecar"
  ) {
    errors.push("enforcement pilot promotion boundary drifted");
  }
  for (const guard of [
    "promoted_pilot_contract_only",
    "stable_export_boundary_frozen",
    "stable_sidecar_shape_frozen",
    "stable_non_authority_sidecar_only",
  ]) {
    if (!ENFORCEMENT_PILOT_PROMOTION_GUARDS.includes(guard)) {
      errors.push(`enforcement pilot promotion guard missing: ${guard}`);
    }
  }
  if (
    JSON.stringify(
      ENFORCEMENT_PILOT_PROMOTION_EXPORT_SET.slice(
        0,
        ENFORCEMENT_PILOT_STABLE_EXPORT_SET.length
      )
    ) !== JSON.stringify(ENFORCEMENT_PILOT_STABLE_EXPORT_SET)
  ) {
    errors.push("enforcement pilot promotion export set drifted from stable export base");
  }
  if (
    new Set(ENFORCEMENT_PILOT_PROMOTION_GUARDS).size !==
    ENFORCEMENT_PILOT_PROMOTION_GUARDS.length
  ) {
    errors.push("enforcement pilot promotion guards contain duplicates");
  }
  if (
    new Set(ENFORCEMENT_PILOT_PROMOTION_EXPORT_SET).size !==
    ENFORCEMENT_PILOT_PROMOTION_EXPORT_SET.length
  ) {
    errors.push("enforcement pilot promotion export set contains duplicates");
  }
  if (
    ENFORCEMENT_PILOT_PROMOTION_EXPORT_SET[
      ENFORCEMENT_PILOT_PROMOTION_EXPORT_SET.length - 2
    ] !== "validateEnforcementPilotPromotion" ||
    ENFORCEMENT_PILOT_PROMOTION_EXPORT_SET[
      ENFORCEMENT_PILOT_PROMOTION_EXPORT_SET.length - 1
    ] !== "assertValidEnforcementPilotPromotion"
  ) {
    errors.push("enforcement pilot promotion export tail drifted");
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function assertValidEnforcementPilotPromotion(result) {
  const validation = validateEnforcementPilotPromotion(result);
  if (validation.ok) return result;

  const err = new Error(
    `enforcement pilot promotion invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}

export function validateEnforcementPilotStabilization(result) {
  const errors = [];
  const validation = validateEnforcementPilotPromotion(result);

  if (!validation.ok) {
    errors.push(...validation.errors);
  }
  if (ENFORCEMENT_PILOT_STABILIZATION_STAGE !== "stable_pilot_v1") {
    errors.push("enforcement pilot stabilization stage drifted");
  }
  if (
    ENFORCEMENT_PILOT_ACCEPTANCE_BOUNDARY !==
    "stable_explicit_opt_in_non_authority_audit_adjacent_pilot"
  ) {
    errors.push("enforcement pilot acceptance boundary drifted");
  }
  for (const guard of [
    "stable_acceptance_boundary_frozen",
    "stable_promoted_export_base_frozen",
    "stable_non_authority_pilot_only",
    "stable_audit_adjacent_sidecar_only",
  ]) {
    if (!ENFORCEMENT_PILOT_STABILIZATION_GUARDS.includes(guard)) {
      errors.push(`enforcement pilot stabilization guard missing: ${guard}`);
    }
  }
  if (
    JSON.stringify(
      ENFORCEMENT_PILOT_STABILIZATION_EXPORT_SET.slice(
        0,
        ENFORCEMENT_PILOT_PROMOTION_EXPORT_SET.length
      )
    ) !== JSON.stringify(ENFORCEMENT_PILOT_PROMOTION_EXPORT_SET)
  ) {
    errors.push(
      "enforcement pilot stabilization export set drifted from promotion export base"
    );
  }
  if (
    new Set(ENFORCEMENT_PILOT_STABILIZATION_GUARDS).size !==
    ENFORCEMENT_PILOT_STABILIZATION_GUARDS.length
  ) {
    errors.push("enforcement pilot stabilization guards contain duplicates");
  }
  if (
    new Set(ENFORCEMENT_PILOT_STABILIZATION_EXPORT_SET).size !==
    ENFORCEMENT_PILOT_STABILIZATION_EXPORT_SET.length
  ) {
    errors.push("enforcement pilot stabilization export set contains duplicates");
  }
  if (
    ENFORCEMENT_PILOT_STABILIZATION_EXPORT_SET[
      ENFORCEMENT_PILOT_STABILIZATION_EXPORT_SET.length - 2
    ] !== "validateEnforcementPilotStabilization" ||
    ENFORCEMENT_PILOT_STABILIZATION_EXPORT_SET[
      ENFORCEMENT_PILOT_STABILIZATION_EXPORT_SET.length - 1
    ] !== "assertValidEnforcementPilotStabilization"
  ) {
    errors.push("enforcement pilot stabilization export tail drifted");
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function assertValidEnforcementPilotStabilization(result) {
  const validation = validateEnforcementPilotStabilization(result);
  if (validation.ok) return result;

  const err = new Error(
    `enforcement pilot stabilization invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}

export function validateEnforcementPilotFinalization(result) {
  const errors = [];
  const validation = validateEnforcementPilotStabilization(result);

  if (!validation.ok) {
    errors.push(...validation.errors);
  }
  if (ENFORCEMENT_PILOT_FINALIZATION_STAGE !== "finalized_non_authority_pilot_v1") {
    errors.push("enforcement pilot finalization stage drifted");
  }
  if (
    ENFORCEMENT_PILOT_FINAL_ACCEPTANCE_BOUNDARY !==
    "final_explicit_opt_in_non_authority_audit_adjacent_sidecar_pilot"
  ) {
    errors.push("enforcement pilot final acceptance boundary drifted");
  }
  for (const gate of [
    "final_acceptance_boundary_frozen",
    "final_export_boundary_frozen",
    "final_non_authority_pilot_only",
    "final_audit_adjacent_sidecar_only",
    "final_default_off_explicit_opt_in_only",
  ]) {
    if (!ENFORCEMENT_PILOT_FINALIZATION_GATES.includes(gate)) {
      errors.push(`enforcement pilot finalization gate missing: ${gate}`);
    }
  }
  if (
    JSON.stringify(
      ENFORCEMENT_PILOT_FINAL_EXPORT_SET.slice(
        0,
        ENFORCEMENT_PILOT_STABILIZATION_EXPORT_SET.length
      )
    ) !== JSON.stringify(ENFORCEMENT_PILOT_STABILIZATION_EXPORT_SET)
  ) {
    errors.push(
      "enforcement pilot final export set drifted from stabilization export base"
    );
  }
  if (
    new Set(ENFORCEMENT_PILOT_FINALIZATION_GATES).size !==
    ENFORCEMENT_PILOT_FINALIZATION_GATES.length
  ) {
    errors.push("enforcement pilot finalization gates contain duplicates");
  }
  if (
    new Set(ENFORCEMENT_PILOT_FINAL_EXPORT_SET).size !==
    ENFORCEMENT_PILOT_FINAL_EXPORT_SET.length
  ) {
    errors.push("enforcement pilot final export set contains duplicates");
  }
  if (
    ENFORCEMENT_PILOT_FINAL_EXPORT_SET[
      ENFORCEMENT_PILOT_FINAL_EXPORT_SET.length - 2
    ] !== "validateEnforcementPilotFinalization" ||
    ENFORCEMENT_PILOT_FINAL_EXPORT_SET[
      ENFORCEMENT_PILOT_FINAL_EXPORT_SET.length - 1
    ] !== "assertValidEnforcementPilotFinalization"
  ) {
    errors.push("enforcement pilot final export tail drifted");
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function assertValidEnforcementPilotFinalization(result) {
  const validation = validateEnforcementPilotFinalization(result);
  if (validation.ok) return result;

  const err = new Error(
    `enforcement pilot finalization invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}

export function validateLimitedEnforcementAuthorityPilot(result) {
  const errors = [];
  const validation = validateLimitedEnforcementAuthorityResult(result);

  if (!validation.ok) {
    errors.push(...validation.errors);
  }
  if (LIMITED_ENFORCEMENT_AUTHORITY_STAGE !== "limited_authority_pilot_v1") {
    errors.push("limited enforcement authority stage drifted");
  }
  for (const guard of [
    "explicit_opt_in_only",
    "default_off_only",
    "local_audit_only",
    "audit_adjacent_sidecar_only",
    "no_audit_output_mutation",
    "no_audit_verdict_mutation",
    "no_exit_code_mutation",
    "review_gate_deny_exit_recommendation_only",
  ]) {
    if (!LIMITED_ENFORCEMENT_AUTHORITY_GUARDS.includes(guard)) {
      errors.push(`limited enforcement authority guard missing: ${guard}`);
    }
  }
  if (
    JSON.stringify(
      LIMITED_ENFORCEMENT_AUTHORITY_EXPORT_SET.slice(
        0,
        ENFORCEMENT_PILOT_FINAL_EXPORT_SET.length
      )
    ) !== JSON.stringify(ENFORCEMENT_PILOT_FINAL_EXPORT_SET)
  ) {
    errors.push(
      "limited enforcement authority export set drifted from enforcement pilot final export base"
    );
  }
  if (
    new Set(LIMITED_ENFORCEMENT_AUTHORITY_GUARDS).size !==
    LIMITED_ENFORCEMENT_AUTHORITY_GUARDS.length
  ) {
    errors.push("limited enforcement authority guards contain duplicates");
  }
  if (
    new Set(LIMITED_ENFORCEMENT_AUTHORITY_EXPORT_SET).size !==
    LIMITED_ENFORCEMENT_AUTHORITY_EXPORT_SET.length
  ) {
    errors.push("limited enforcement authority export set contains duplicates");
  }
  if (
    !LIMITED_ENFORCEMENT_AUTHORITY_EXPORT_SET.includes(
      "validateLimitedEnforcementAuthorityPilot"
    ) ||
    !LIMITED_ENFORCEMENT_AUTHORITY_EXPORT_SET.includes(
      "assertValidLimitedEnforcementAuthorityPilot"
    )
  ) {
    errors.push("limited enforcement authority pilot exports drifted");
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function assertValidLimitedEnforcementAuthorityPilot(result) {
  const validation = validateLimitedEnforcementAuthorityPilot(result);
  if (validation.ok) return result;

  const err = new Error(
    `limited enforcement authority pilot invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}

export function validateLimitedEnforcementAuthorityHardening(result) {
  const errors = [];
  const validation = validateLimitedEnforcementAuthorityPilot(result);

  if (!validation.ok) {
    errors.push(...validation.errors);
  }
  if (
    LIMITED_ENFORCEMENT_AUTHORITY_HARDENING_STAGE !==
    "stable_limited_authority_sidecar_v1"
  ) {
    errors.push("limited enforcement authority hardening stage drifted");
  }
  if (
    LIMITED_ENFORCEMENT_AUTHORITY_OUTPUT_ENCODING !== "utf8" ||
    LIMITED_ENFORCEMENT_AUTHORITY_OUTPUT_EOL !== "\n" ||
    LIMITED_ENFORCEMENT_AUTHORITY_PRETTY_INDENT !== 2
  ) {
    errors.push("limited enforcement authority serializer defaults drifted");
  }
  for (const guard of [
    "stable_sidecar_shape_frozen",
    "stable_serializer_frozen",
    "stable_field_order_frozen",
    "stable_recommendation_scope_frozen",
    "stable_non_executing_authority_only",
  ]) {
    if (!LIMITED_ENFORCEMENT_AUTHORITY_HARDENING_GUARDS.includes(guard)) {
      errors.push(`limited enforcement authority hardening guard missing: ${guard}`);
    }
  }
  if (
    new Set(LIMITED_ENFORCEMENT_AUTHORITY_TOP_LEVEL_FIELDS).size !==
    LIMITED_ENFORCEMENT_AUTHORITY_TOP_LEVEL_FIELDS.length
  ) {
    errors.push("limited enforcement authority top-level fields contain duplicates");
  }
  if (
    new Set(LIMITED_ENFORCEMENT_AUTHORITY_PAYLOAD_FIELDS).size !==
    LIMITED_ENFORCEMENT_AUTHORITY_PAYLOAD_FIELDS.length
  ) {
    errors.push("limited enforcement authority payload fields contain duplicates");
  }
  if (
    new Set(LIMITED_ENFORCEMENT_AUTHORITY_HARDENING_GUARDS).size !==
    LIMITED_ENFORCEMENT_AUTHORITY_HARDENING_GUARDS.length
  ) {
    errors.push("limited enforcement authority hardening guards contain duplicates");
  }
  if (
    new Set(LIMITED_ENFORCEMENT_AUTHORITY_EXPORT_SET).size !==
    LIMITED_ENFORCEMENT_AUTHORITY_EXPORT_SET.length
  ) {
    errors.push("limited enforcement authority export set contains duplicates");
  }
  if (
    !LIMITED_ENFORCEMENT_AUTHORITY_EXPORT_SET.includes(
      "validateLimitedEnforcementAuthorityHardening"
    ) ||
    !LIMITED_ENFORCEMENT_AUTHORITY_EXPORT_SET.includes(
      "assertValidLimitedEnforcementAuthorityHardening"
    )
  ) {
    errors.push("limited enforcement authority hardening exports drifted");
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function assertValidLimitedEnforcementAuthorityHardening(result) {
  const validation = validateLimitedEnforcementAuthorityHardening(result);
  if (validation.ok) return result;

  const err = new Error(
    `limited enforcement authority hardening invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}

export function validateLimitedEnforcementAuthorityPromotion(result) {
  const errors = [];
  const validation = validateLimitedEnforcementAuthorityHardening(result);

  if (!validation.ok) {
    errors.push(...validation.errors);
  }
  if (
    LIMITED_ENFORCEMENT_AUTHORITY_PROMOTION_STAGE !==
    "promoted_limited_authority_pilot_v1"
  ) {
    errors.push("limited enforcement authority promotion stage drifted");
  }
  if (
    LIMITED_ENFORCEMENT_AUTHORITY_PROMOTION_BOUNDARY !==
    "promoted_explicit_opt_in_recommendation_only_authority_sidecar"
  ) {
    errors.push("limited enforcement authority promotion boundary drifted");
  }
  for (const guard of [
    "promoted_contract_only",
    "promoted_export_boundary_frozen",
    "promoted_recommendation_scope_only",
    "promoted_non_executing_authority_only",
  ]) {
    if (!LIMITED_ENFORCEMENT_AUTHORITY_PROMOTION_GUARDS.includes(guard)) {
      errors.push(`limited enforcement authority promotion guard missing: ${guard}`);
    }
  }
  if (
    new Set(LIMITED_ENFORCEMENT_AUTHORITY_PROMOTION_GUARDS).size !==
    LIMITED_ENFORCEMENT_AUTHORITY_PROMOTION_GUARDS.length
  ) {
    errors.push("limited enforcement authority promotion guards contain duplicates");
  }
  if (
    LIMITED_ENFORCEMENT_AUTHORITY_EXPORT_SET[
      LIMITED_ENFORCEMENT_AUTHORITY_EXPORT_SET.length - 2
    ] !== "validateLimitedEnforcementAuthorityPromotion" ||
    LIMITED_ENFORCEMENT_AUTHORITY_EXPORT_SET[
      LIMITED_ENFORCEMENT_AUTHORITY_EXPORT_SET.length - 1
    ] !== "assertValidLimitedEnforcementAuthorityPromotion"
  ) {
    errors.push("limited enforcement authority promotion export tail drifted");
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function assertValidLimitedEnforcementAuthorityPromotion(result) {
  const validation = validateLimitedEnforcementAuthorityPromotion(result);
  if (validation.ok) return result;

  const err = new Error(
    `limited enforcement authority promotion invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}

export function validateLimitedEnforcementAuthorityStabilization(result) {
  const errors = [];
  const validation = validateLimitedEnforcementAuthorityPromotion(result);

  if (!validation.ok) {
    errors.push(...validation.errors);
  }
  if (
    LIMITED_ENFORCEMENT_AUTHORITY_STABILIZATION_STAGE !==
    "stable_limited_authority_pilot_v1"
  ) {
    errors.push("limited enforcement authority stabilization stage drifted");
  }
  if (
    LIMITED_ENFORCEMENT_AUTHORITY_ACCEPTANCE_BOUNDARY !==
    "stable_explicit_opt_in_recommendation_only_authority_sidecar"
  ) {
    errors.push("limited enforcement authority acceptance boundary drifted");
  }
  for (const guard of [
    "stable_acceptance_boundary_frozen",
    "stable_promoted_export_base_frozen",
    "stable_recommendation_only_authority_only",
    "stable_non_executing_audit_adjacent_sidecar_only",
  ]) {
    if (!LIMITED_ENFORCEMENT_AUTHORITY_STABILIZATION_GUARDS.includes(guard)) {
      errors.push(
        `limited enforcement authority stabilization guard missing: ${guard}`
      );
    }
  }
  if (
    JSON.stringify(
      LIMITED_ENFORCEMENT_AUTHORITY_STABILIZATION_EXPORT_SET.slice(
        0,
        LIMITED_ENFORCEMENT_AUTHORITY_EXPORT_SET.length
      )
    ) !== JSON.stringify(LIMITED_ENFORCEMENT_AUTHORITY_EXPORT_SET)
  ) {
    errors.push(
      "limited enforcement authority stabilization export set drifted from promotion export base"
    );
  }
  if (
    new Set(LIMITED_ENFORCEMENT_AUTHORITY_STABILIZATION_GUARDS).size !==
    LIMITED_ENFORCEMENT_AUTHORITY_STABILIZATION_GUARDS.length
  ) {
    errors.push(
      "limited enforcement authority stabilization guards contain duplicates"
    );
  }
  if (
    new Set(LIMITED_ENFORCEMENT_AUTHORITY_STABILIZATION_EXPORT_SET).size !==
    LIMITED_ENFORCEMENT_AUTHORITY_STABILIZATION_EXPORT_SET.length
  ) {
    errors.push(
      "limited enforcement authority stabilization export set contains duplicates"
    );
  }
  if (
    LIMITED_ENFORCEMENT_AUTHORITY_STABILIZATION_EXPORT_SET[
      LIMITED_ENFORCEMENT_AUTHORITY_STABILIZATION_EXPORT_SET.length - 2
    ] !== "validateLimitedEnforcementAuthorityStabilization" ||
    LIMITED_ENFORCEMENT_AUTHORITY_STABILIZATION_EXPORT_SET[
      LIMITED_ENFORCEMENT_AUTHORITY_STABILIZATION_EXPORT_SET.length - 1
    ] !== "assertValidLimitedEnforcementAuthorityStabilization"
  ) {
    errors.push("limited enforcement authority stabilization export tail drifted");
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function assertValidLimitedEnforcementAuthorityStabilization(result) {
  const validation = validateLimitedEnforcementAuthorityStabilization(result);
  if (validation.ok) return result;

  const err = new Error(
    `limited enforcement authority stabilization invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}

export function serializeEnforcementPilotResult(result, { pretty = false } = {}) {
  const validated = assertValidEnforcementPilotFinalization(result);
  const payload = validated.enforcement_pilot;
  const ordered = {
    kind: validated.kind,
    version: validated.version,
    canonical_action_hash: validated.canonical_action_hash,
    enforcement_pilot: {
      mode: payload.mode,
      default_state: payload.default_state,
      consumer_surface: payload.consumer_surface,
      result_boundary: payload.result_boundary,
      decision: payload.decision,
      readiness: payload.readiness,
      bridge_verdict: payload.bridge_verdict,
      current_audit_verdict: payload.current_audit_verdict,
      current_audit_exit_code: payload.current_audit_exit_code,
      reasons: payload.reasons,
    },
    deterministic: validated.deterministic,
    enforcing: validated.enforcing,
  };

  return (
    JSON.stringify(ordered, null, pretty ? ENFORCEMENT_PILOT_PRETTY_INDENT : 0) +
    ENFORCEMENT_PILOT_OUTPUT_EOL
  );
}

export function serializeLimitedEnforcementAuthorityResult(
  result,
  { pretty = false } = {}
) {
  const validated = assertValidLimitedEnforcementAuthorityStabilization(result);
  const payload = validated.limited_enforcement_authority;
  const ordered = {
    kind: validated.kind,
    version: validated.version,
    canonical_action_hash: validated.canonical_action_hash,
    limited_enforcement_authority: {
      mode: payload.mode,
      default_state: payload.default_state,
      consumer_surface: payload.consumer_surface,
      authority_boundary: payload.authority_boundary,
      authority_scope: payload.authority_scope,
      authority_status: payload.authority_status,
      decision: payload.decision,
      readiness: payload.readiness,
      bridge_verdict: payload.bridge_verdict,
      current_audit_verdict: payload.current_audit_verdict,
      current_audit_exit_code: payload.current_audit_exit_code,
      proposed_audit_exit_code: payload.proposed_audit_exit_code,
      reasons: payload.reasons,
    },
    deterministic: validated.deterministic,
    authority_active: validated.authority_active,
  };

  return (
    JSON.stringify(
      ordered,
      null,
      pretty ? LIMITED_ENFORCEMENT_AUTHORITY_PRETTY_INDENT : 0
    ) + LIMITED_ENFORCEMENT_AUTHORITY_OUTPUT_EOL
  );
}
