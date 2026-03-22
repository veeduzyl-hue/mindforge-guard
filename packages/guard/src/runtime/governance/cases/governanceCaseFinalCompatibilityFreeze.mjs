import {
  GOVERNANCE_CASE_FINAL_ACCEPTANCE_BOUNDARY,
  GOVERNANCE_CASE_FINAL_ACCEPTANCE_KIND,
  GOVERNANCE_CASE_FINAL_ACCEPTANCE_VERSION,
  assertValidGovernanceCaseFinalAcceptanceBoundary,
} from "./governanceCaseFinalAcceptanceBoundary.mjs";

export const GOVERNANCE_CASE_FINAL_COMPATIBILITY_FREEZE_KIND =
  "governance_case_final_compatibility_freeze";
export const GOVERNANCE_CASE_FINAL_COMPATIBILITY_FREEZE_VERSION = "v1";
export const GOVERNANCE_CASE_FINAL_COMPATIBILITY_FREEZE_BOUNDARY =
  "governance_case_final_compatibility_freeze_boundary";
export const GOVERNANCE_CASE_FINAL_COMPATIBILITY_FREEZE_STABLE_EXPORT_SET =
  Object.freeze([
    "GOVERNANCE_CASE_FINAL_COMPATIBILITY_FREEZE_KIND",
    "GOVERNANCE_CASE_FINAL_COMPATIBILITY_FREEZE_VERSION",
    "GOVERNANCE_CASE_FINAL_COMPATIBILITY_FREEZE_BOUNDARY",
    "buildGovernanceCaseFinalCompatibilityFreeze",
    "validateGovernanceCaseFinalCompatibilityFreeze",
    "assertValidGovernanceCaseFinalCompatibilityFreeze",
  ]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceCaseFinalCompatibilityFreeze({
  governanceCaseFinalAcceptanceBoundary,
}) {
  const boundary = assertValidGovernanceCaseFinalAcceptanceBoundary(
    governanceCaseFinalAcceptanceBoundary
  );
  return {
    kind: GOVERNANCE_CASE_FINAL_COMPATIBILITY_FREEZE_KIND,
    version: GOVERNANCE_CASE_FINAL_COMPATIBILITY_FREEZE_VERSION,
    boundary: GOVERNANCE_CASE_FINAL_COMPATIBILITY_FREEZE_BOUNDARY,
    final_acceptance_ref: {
      kind: GOVERNANCE_CASE_FINAL_ACCEPTANCE_KIND,
      version: GOVERNANCE_CASE_FINAL_ACCEPTANCE_VERSION,
      boundary: GOVERNANCE_CASE_FINAL_ACCEPTANCE_BOUNDARY,
    },
    release_target: "v5.3.0",
    recommendation_only: true,
    additive_only: true,
    non_executing: true,
    default_off: true,
    actual_resolution_execution: false,
    actual_escalation_execution: false,
    actual_closure_execution: false,
    automatic_routing: false,
    automatic_case_finalization: false,
    workflow_transition_engine: false,
    authority_scope_expansion: false,
    audit_output_preserved: true,
    audit_verdict_preserved: true,
    actual_exit_code_preserved: true,
    denied_exit_code_preserved: 25,
    permit_gate_semantics_preserved: true,
    enforcement_pilot_semantics_preserved: true,
    limited_enforcement_authority_semantics_preserved: true,
    classify_semantics_preserved: true,
    main_path_takeover: false,
    canonical_action_hash: boundary.canonical_action_hash,
  };
}

export function validateGovernanceCaseFinalCompatibilityFreeze(freeze) {
  const errors = [];
  if (!isPlainObject(freeze)) {
    return {
      ok: false,
      errors: ["governance case final compatibility freeze must be an object"],
    };
  }
  if (freeze.kind !== GOVERNANCE_CASE_FINAL_COMPATIBILITY_FREEZE_KIND) {
    errors.push("governance case final compatibility freeze kind drifted");
  }
  if (freeze.version !== GOVERNANCE_CASE_FINAL_COMPATIBILITY_FREEZE_VERSION) {
    errors.push("governance case final compatibility freeze version drifted");
  }
  if (freeze.boundary !== GOVERNANCE_CASE_FINAL_COMPATIBILITY_FREEZE_BOUNDARY) {
    errors.push("governance case final compatibility freeze boundary drifted");
  }
  if (!isPlainObject(freeze.final_acceptance_ref)) {
    errors.push("governance case final compatibility freeze ref missing");
  }
  if (freeze.release_target !== "v5.3.0") {
    errors.push("governance case final compatibility freeze release target drifted");
  }
  for (const field of [
    "recommendation_only",
    "additive_only",
    "non_executing",
    "default_off",
    "audit_output_preserved",
    "audit_verdict_preserved",
    "actual_exit_code_preserved",
    "permit_gate_semantics_preserved",
    "enforcement_pilot_semantics_preserved",
    "limited_enforcement_authority_semantics_preserved",
    "classify_semantics_preserved",
  ]) {
    if (freeze[field] !== true) {
      errors.push(`governance case final compatibility freeze field drifted: ${field}`);
    }
  }
  for (const field of [
    "actual_resolution_execution",
    "actual_escalation_execution",
    "actual_closure_execution",
    "automatic_routing",
    "automatic_case_finalization",
    "workflow_transition_engine",
    "authority_scope_expansion",
    "main_path_takeover",
  ]) {
    if (freeze[field] !== false) {
      errors.push(`governance case final compatibility freeze field drifted: ${field}`);
    }
  }
  if (freeze.denied_exit_code_preserved !== 25) {
    errors.push("governance case final compatibility freeze denied exit drifted");
  }
  if (
    typeof freeze.canonical_action_hash !== "string" ||
    freeze.canonical_action_hash.length === 0
  ) {
    errors.push("governance case final compatibility freeze canonical action hash is required");
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseFinalCompatibilityFreeze(freeze) {
  const validation = validateGovernanceCaseFinalCompatibilityFreeze(freeze);
  if (validation.ok) return freeze;

  const err = new Error(
    `governance case final compatibility freeze invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
