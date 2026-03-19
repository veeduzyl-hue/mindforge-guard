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
export const ENFORCEMENT_PILOT_OUTPUT_ENCODING = "utf8";
export const ENFORCEMENT_PILOT_OUTPUT_EOL = "\n";
export const ENFORCEMENT_PILOT_PRETTY_INDENT = 2;
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
export const ENFORCEMENT_PILOT_SUPPORTED_DECISIONS = Object.freeze([
  "would_allow",
  "would_review",
  "would_deny",
  "insufficient_signal",
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

export function serializeEnforcementPilotResult(result, { pretty = false } = {}) {
  const validated = assertValidEnforcementPilotStabilization(result);
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
