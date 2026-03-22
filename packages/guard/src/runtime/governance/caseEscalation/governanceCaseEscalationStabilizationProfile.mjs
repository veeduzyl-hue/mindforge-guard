import {
  GOVERNANCE_CASE_ESCALATION_COMPATIBILITY_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_ESCALATION_COMPATIBILITY_CONTRACT_KIND,
  GOVERNANCE_CASE_ESCALATION_COMPATIBILITY_CONTRACT_VERSION,
  assertValidGovernanceCaseEscalationCompatibilityContract,
} from "./governanceCaseEscalationCompatibilityContract.mjs";
import {
  GOVERNANCE_CASE_ESCALATION_CONSUMER_SURFACE,
  GOVERNANCE_CASE_ESCALATION_CLOSURE_READY,
  GOVERNANCE_CASE_ESCALATION_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_ESCALATION_PROFILE_KIND,
  GOVERNANCE_CASE_ESCALATION_PROFILE_STAGE,
  GOVERNANCE_CASE_ESCALATION_PROFILE_VERSION,
  assertValidGovernanceCaseEscalationProfile,
} from "./governanceCaseEscalationProfile.mjs";

export const GOVERNANCE_CASE_ESCALATION_STABILIZATION_KIND =
  "governance_case_escalation_stabilization_profile";
export const GOVERNANCE_CASE_ESCALATION_STABILIZATION_VERSION = "v1";
export const GOVERNANCE_CASE_ESCALATION_STABILIZATION_SCHEMA_ID =
  "mindforge/governance-case-escalation-stabilization/v1";
export const GOVERNANCE_CASE_ESCALATION_STABILIZATION_STAGE =
  "governance_case_escalation_boundary_phase2_stabilization_v1";
export const GOVERNANCE_CASE_ESCALATION_STABILIZATION_BOUNDARY =
  "governance_case_escalation_stabilization_boundary";
export const GOVERNANCE_CASE_ESCALATION_STABILIZATION_READY =
  "stabilized_for_consumer_review";
export const GOVERNANCE_CASE_ESCALATION_STABILIZATION_TOP_LEVEL_FIELDS =
  Object.freeze([
    "kind",
    "version",
    "schema_id",
    "canonical_action_hash",
    "governance_case_escalation_stabilization",
    "deterministic",
    "enforcing",
  ]);
export const GOVERNANCE_CASE_ESCALATION_STABILIZATION_PAYLOAD_FIELDS =
  Object.freeze([
    "stage",
    "consumer_surface",
    "boundary",
    "escalation_profile_ref",
    "compatibility_ref",
    "continuity_ref",
    "stabilization_contract",
    "preserved_semantics",
  ]);
export const GOVERNANCE_CASE_ESCALATION_STABILIZATION_STABLE_EXPORT_SET =
  Object.freeze([
    "GOVERNANCE_CASE_ESCALATION_STABILIZATION_KIND",
    "GOVERNANCE_CASE_ESCALATION_STABILIZATION_VERSION",
    "GOVERNANCE_CASE_ESCALATION_STABILIZATION_SCHEMA_ID",
    "GOVERNANCE_CASE_ESCALATION_STABILIZATION_STAGE",
    "GOVERNANCE_CASE_ESCALATION_STABILIZATION_BOUNDARY",
    "GOVERNANCE_CASE_ESCALATION_STABILIZATION_READY",
    "GOVERNANCE_CASE_ESCALATION_STABILIZATION_TOP_LEVEL_FIELDS",
    "GOVERNANCE_CASE_ESCALATION_STABILIZATION_PAYLOAD_FIELDS",
    "GOVERNANCE_CASE_ESCALATION_STABILIZATION_STABLE_EXPORT_SET",
    "buildGovernanceCaseEscalationStabilizationProfile",
    "validateGovernanceCaseEscalationStabilizationProfile",
    "assertValidGovernanceCaseEscalationStabilizationProfile",
  ]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceCaseEscalationStabilizationProfile({
  governanceCaseEscalationProfile,
  governanceCaseEscalationCompatibilityContract,
}) {
  const profile = assertValidGovernanceCaseEscalationProfile(
    governanceCaseEscalationProfile
  );
  const compatibility = assertValidGovernanceCaseEscalationCompatibilityContract(
    governanceCaseEscalationCompatibilityContract
  );

  return {
    kind: GOVERNANCE_CASE_ESCALATION_STABILIZATION_KIND,
    version: GOVERNANCE_CASE_ESCALATION_STABILIZATION_VERSION,
    schema_id: GOVERNANCE_CASE_ESCALATION_STABILIZATION_SCHEMA_ID,
    canonical_action_hash: profile.canonical_action_hash,
    governance_case_escalation_stabilization: {
      stage: GOVERNANCE_CASE_ESCALATION_STABILIZATION_STAGE,
      consumer_surface: GOVERNANCE_CASE_ESCALATION_CONSUMER_SURFACE,
      boundary: GOVERNANCE_CASE_ESCALATION_STABILIZATION_BOUNDARY,
      escalation_profile_ref: {
        kind: GOVERNANCE_CASE_ESCALATION_PROFILE_KIND,
        version: GOVERNANCE_CASE_ESCALATION_PROFILE_VERSION,
        stage: GOVERNANCE_CASE_ESCALATION_PROFILE_STAGE,
        boundary: GOVERNANCE_CASE_ESCALATION_PROFILE_BOUNDARY,
      },
      compatibility_ref: {
        kind: GOVERNANCE_CASE_ESCALATION_COMPATIBILITY_CONTRACT_KIND,
        version: GOVERNANCE_CASE_ESCALATION_COMPATIBILITY_CONTRACT_VERSION,
        boundary: GOVERNANCE_CASE_ESCALATION_COMPATIBILITY_CONTRACT_BOUNDARY,
      },
      continuity_ref: {
        case_id: profile.governance_case_escalation.escalation_context.case_id,
        linked_exception_ids:
          profile.governance_case_escalation.escalation_context.linked_exception_ids,
        linked_override_record_ids:
          profile.governance_case_escalation.escalation_context
            .linked_override_record_ids,
        linked_resolution_ids:
          profile.governance_case_escalation.escalation_context.linked_resolution_ids,
        basis_refs:
          profile.governance_case_escalation.escalation_context
            .escalation_basis_refs,
      },
      stabilization_contract: {
        readiness_level: GOVERNANCE_CASE_ESCALATION_STABILIZATION_READY,
        closure_readiness_level: GOVERNANCE_CASE_ESCALATION_CLOSURE_READY,
        recommendation_only: true,
        additive_only: true,
        non_executing: true,
        default_off: true,
        actual_escalation_execution: false,
        actual_routing: false,
        actual_closure_execution: false,
      },
      preserved_semantics: {
        escalation_boundary_preserved: true,
        compatibility_boundary_preserved: true,
        escalation_lane_preserved: true,
        closure_readiness_preserved: true,
        resolution_semantics_preserved: true,
        exception_semantics_preserved: true,
        snapshot_semantics_preserved: true,
        evidence_semantics_preserved: true,
        policy_semantics_preserved: true,
        enforcement_semantics_preserved: true,
        approval_semantics_preserved: true,
        judgment_semantics_preserved: true,
        permit_gate_semantics_preserved: true,
        audit_output_preserved: true,
        audit_verdict_preserved: true,
        actual_exit_code_preserved: true,
        denied_exit_code_preserved: 25,
        authority_scope_expansion: false,
        governance_object_addition: false,
        main_path_takeover: false,
        consumer_compatible: compatibility.consumer_compatible === true,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateGovernanceCaseEscalationStabilizationProfile(profile) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: ["governance case escalation stabilization profile must be an object"],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(GOVERNANCE_CASE_ESCALATION_STABILIZATION_TOP_LEVEL_FIELDS)
  ) {
    errors.push("governance case escalation stabilization top-level field order drifted");
  }
  if (profile.kind !== GOVERNANCE_CASE_ESCALATION_STABILIZATION_KIND) {
    errors.push("governance case escalation stabilization kind drifted");
  }
  if (profile.version !== GOVERNANCE_CASE_ESCALATION_STABILIZATION_VERSION) {
    errors.push("governance case escalation stabilization version drifted");
  }
  if (profile.schema_id !== GOVERNANCE_CASE_ESCALATION_STABILIZATION_SCHEMA_ID) {
    errors.push("governance case escalation stabilization schema drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("governance case escalation stabilization canonical action hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("governance case escalation stabilization determinism drifted");
  }
  if (profile.enforcing !== false) {
    errors.push("governance case escalation stabilization enforcement drifted");
  }
  const payload = profile.governance_case_escalation_stabilization;
  if (!isPlainObject(payload)) {
    errors.push("governance case escalation stabilization payload must be an object");
    return { ok: errors.length === 0, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(GOVERNANCE_CASE_ESCALATION_STABILIZATION_PAYLOAD_FIELDS)
  ) {
    errors.push("governance case escalation stabilization payload field order drifted");
  }
  if (payload.stage !== GOVERNANCE_CASE_ESCALATION_STABILIZATION_STAGE) {
    errors.push("governance case escalation stabilization stage drifted");
  }
  if (payload.consumer_surface !== GOVERNANCE_CASE_ESCALATION_CONSUMER_SURFACE) {
    errors.push("governance case escalation stabilization consumer surface drifted");
  }
  if (payload.boundary !== GOVERNANCE_CASE_ESCALATION_STABILIZATION_BOUNDARY) {
    errors.push("governance case escalation stabilization boundary drifted");
  }
  if (!isPlainObject(payload.escalation_profile_ref)) {
    errors.push("governance case escalation stabilization profile ref missing");
  }
  if (!isPlainObject(payload.compatibility_ref)) {
    errors.push("governance case escalation stabilization compatibility ref missing");
  }
  if (!isPlainObject(payload.continuity_ref)) {
    errors.push("governance case escalation stabilization continuity ref missing");
  } else {
    if (
      typeof payload.continuity_ref.case_id !== "string" ||
      payload.continuity_ref.case_id.length === 0
    ) {
      errors.push("governance case escalation stabilization continuity case_id is required");
    }
    if (
      !Array.isArray(payload.continuity_ref.linked_exception_ids) ||
      payload.continuity_ref.linked_exception_ids.length === 0
    ) {
      errors.push(
        "governance case escalation stabilization continuity linked exception ids are required"
      );
    }
    if (
      !Array.isArray(payload.continuity_ref.linked_override_record_ids) ||
      payload.continuity_ref.linked_override_record_ids.length === 0
    ) {
      errors.push(
        "governance case escalation stabilization continuity linked override ids are required"
      );
    }
    if (
      !Array.isArray(payload.continuity_ref.linked_resolution_ids) ||
      payload.continuity_ref.linked_resolution_ids.length === 0
    ) {
      errors.push(
        "governance case escalation stabilization continuity linked resolution ids are required"
      );
    }
    if (
      !Array.isArray(payload.continuity_ref.basis_refs) ||
      payload.continuity_ref.basis_refs.length === 0
    ) {
      errors.push(
        "governance case escalation stabilization continuity basis refs are required"
      );
    }
  }
  if (!isPlainObject(payload.stabilization_contract)) {
    errors.push("governance case escalation stabilization contract missing");
  }
  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push("governance case escalation stabilization preserved semantics missing");
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseEscalationStabilizationProfile(profile) {
  const validation = validateGovernanceCaseEscalationStabilizationProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `governance case escalation stabilization invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
