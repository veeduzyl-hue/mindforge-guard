export const ENFORCEMENT_PILOT_RESULT_KIND = "enforcement_pilot_result";
export const ENFORCEMENT_PILOT_RESULT_VERSION = "v1";
export const ENFORCEMENT_PILOT_MODE = "explicit_opt_in";
export const ENFORCEMENT_PILOT_DEFAULT_STATE = "disabled";
export const ENFORCEMENT_PILOT_CONSUMER_SURFACE = "guard.audit";
export const ENFORCEMENT_PILOT_RESULT_BOUNDARY = "non_enforcing_sidecar";
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
  "ENFORCEMENT_PILOT_SUPPORTED_DECISIONS",
  "ENFORCEMENT_PILOT_STABLE_EXPORT_SET",
  "buildEnforcementPilotResult",
  "validateEnforcementPilotResult",
  "assertValidEnforcementPilotResult",
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
