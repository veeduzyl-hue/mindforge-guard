import {
  GOVERNANCE_CASE_LINKAGE_BOUNDARY,
  GOVERNANCE_CASE_LINKAGE_KIND,
  GOVERNANCE_CASE_LINKAGE_STAGE,
  GOVERNANCE_CASE_LINKAGE_VERSION,
  GOVERNANCE_EXCEPTION_CONSUMER_COMPATIBLE,
  assertValidGovernanceCaseLinkageProfile,
} from "./caseLinkage.mjs";
import {
  GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_BOUNDARY,
  GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_KIND,
  GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_VERSION,
  assertValidGovernanceExceptionCompatibilityContract,
} from "./compatibility.mjs";
import {
  GOVERNANCE_EXCEPTION_CONSUMER_SURFACE,
} from "./profile.mjs";

export const GOVERNANCE_EXCEPTION_STABILIZATION_KIND =
  "governance_exception_stabilization_profile";
export const GOVERNANCE_EXCEPTION_STABILIZATION_VERSION = "v1";
export const GOVERNANCE_EXCEPTION_STABILIZATION_SCHEMA_ID =
  "mindforge/governance-exception-stabilization/v1";
export const GOVERNANCE_EXCEPTION_STABILIZATION_STAGE =
  "governance_exception_stabilization_phase3_v1";
export const GOVERNANCE_EXCEPTION_FINAL_ACCEPTANCE_BOUNDARY =
  "final_governance_exception_consumer_contract";
export const GOVERNANCE_EXCEPTION_FINAL_ACCEPTANCE_READY =
  "final_consumer_ready";
export const GOVERNANCE_EXCEPTION_STABILIZATION_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "governance_exception_stabilization",
  "deterministic",
  "enforcing",
]);
export const GOVERNANCE_EXCEPTION_STABILIZATION_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "case_linkage_ref",
  "compatibility_ref",
  "final_consumer_contract",
  "preserved_semantics",
]);
export const GOVERNANCE_EXCEPTION_STABILIZATION_STABLE_EXPORT_SET =
  Object.freeze([
    "GOVERNANCE_EXCEPTION_STABILIZATION_KIND",
    "GOVERNANCE_EXCEPTION_STABILIZATION_VERSION",
    "GOVERNANCE_EXCEPTION_STABILIZATION_SCHEMA_ID",
    "GOVERNANCE_EXCEPTION_STABILIZATION_STAGE",
    "GOVERNANCE_EXCEPTION_FINAL_ACCEPTANCE_BOUNDARY",
    "GOVERNANCE_EXCEPTION_FINAL_ACCEPTANCE_READY",
    "GOVERNANCE_EXCEPTION_STABILIZATION_TOP_LEVEL_FIELDS",
    "GOVERNANCE_EXCEPTION_STABILIZATION_PAYLOAD_FIELDS",
    "GOVERNANCE_EXCEPTION_STABILIZATION_STABLE_EXPORT_SET",
    "buildGovernanceExceptionStabilizationProfile",
    "validateGovernanceExceptionStabilizationProfile",
    "assertValidGovernanceExceptionStabilizationProfile",
  ]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceExceptionStabilizationProfile({
  governanceCaseLinkageProfile,
  governanceExceptionCompatibilityContract,
}) {
  const caseLinkage = assertValidGovernanceCaseLinkageProfile(
    governanceCaseLinkageProfile
  );
  const compatibility = assertValidGovernanceExceptionCompatibilityContract(
    governanceExceptionCompatibilityContract
  );

  return {
    kind: GOVERNANCE_EXCEPTION_STABILIZATION_KIND,
    version: GOVERNANCE_EXCEPTION_STABILIZATION_VERSION,
    schema_id: GOVERNANCE_EXCEPTION_STABILIZATION_SCHEMA_ID,
    canonical_action_hash: caseLinkage.canonical_action_hash,
    governance_exception_stabilization: {
      stage: GOVERNANCE_EXCEPTION_STABILIZATION_STAGE,
      consumer_surface: GOVERNANCE_EXCEPTION_CONSUMER_SURFACE,
      boundary: GOVERNANCE_EXCEPTION_FINAL_ACCEPTANCE_BOUNDARY,
      case_linkage_ref: {
        kind: GOVERNANCE_CASE_LINKAGE_KIND,
        version: GOVERNANCE_CASE_LINKAGE_VERSION,
        stage: GOVERNANCE_CASE_LINKAGE_STAGE,
        boundary: GOVERNANCE_CASE_LINKAGE_BOUNDARY,
      },
      compatibility_ref: {
        kind: GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_KIND,
        version: GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_VERSION,
        boundary: GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_BOUNDARY,
      },
      final_consumer_contract: {
        acceptance_level: GOVERNANCE_EXCEPTION_FINAL_ACCEPTANCE_READY,
        recommendation_only: true,
        additive_only: true,
        execution_enabled: false,
        default_on: false,
        override_execution_available: false,
        waiver_execution_available: false,
        audit_output_preserved: true,
        audit_verdict_preserved: true,
        actual_exit_code_preserved: true,
        denied_exit_code_preserved: 25,
        authority_scope: "review_gate_deny_exit_recommendation_only",
        governance_object_addition: false,
      },
      preserved_semantics: {
        exception_waiver_semantics_preserved: true,
        override_record_semantics_preserved: true,
        case_linkage_semantics_preserved: true,
        exception_compatibility_semantics_preserved: true,
        snapshot_semantics_preserved: true,
        evidence_semantics_preserved: true,
        policy_semantics_preserved: true,
        enforcement_semantics_preserved: true,
        approval_semantics_preserved: true,
        judgment_semantics_preserved: true,
        permit_gate_semantics_preserved: true,
        consumer_contract_ready:
          caseLinkage.governance_case_linkage.consumer_compatibility.level ===
          GOVERNANCE_EXCEPTION_CONSUMER_COMPATIBLE,
        override_record_ready: compatibility.override_record_ready === true,
        consumer_compatible: compatibility.consumer_compatible === true,
        main_path_takeover: false,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateGovernanceExceptionStabilizationProfile(profile) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: ["governance exception stabilization profile must be an object"],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(GOVERNANCE_EXCEPTION_STABILIZATION_TOP_LEVEL_FIELDS)
  ) {
    errors.push("governance exception stabilization top-level field order drifted");
  }
  if (profile.kind !== GOVERNANCE_EXCEPTION_STABILIZATION_KIND) {
    errors.push("governance exception stabilization kind drifted");
  }
  if (profile.version !== GOVERNANCE_EXCEPTION_STABILIZATION_VERSION) {
    errors.push("governance exception stabilization version drifted");
  }
  if (profile.schema_id !== GOVERNANCE_EXCEPTION_STABILIZATION_SCHEMA_ID) {
    errors.push("governance exception stabilization schema drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("governance exception stabilization canonical action hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("governance exception stabilization determinism drifted");
  }
  if (profile.enforcing !== false) {
    errors.push("governance exception stabilization enforcement drifted");
  }
  const payload = profile.governance_exception_stabilization;
  if (!isPlainObject(payload)) {
    errors.push("governance exception stabilization payload must be an object");
    return { ok: errors.length === 0, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(GOVERNANCE_EXCEPTION_STABILIZATION_PAYLOAD_FIELDS)
  ) {
    errors.push("governance exception stabilization payload field order drifted");
  }
  if (payload.stage !== GOVERNANCE_EXCEPTION_STABILIZATION_STAGE) {
    errors.push("governance exception stabilization stage drifted");
  }
  if (payload.consumer_surface !== GOVERNANCE_EXCEPTION_CONSUMER_SURFACE) {
    errors.push("governance exception stabilization consumer surface drifted");
  }
  if (payload.boundary !== GOVERNANCE_EXCEPTION_FINAL_ACCEPTANCE_BOUNDARY) {
    errors.push("governance exception stabilization boundary drifted");
  }
  if (!isPlainObject(payload.case_linkage_ref)) {
    errors.push("governance exception stabilization case linkage ref missing");
  } else {
    if (payload.case_linkage_ref.kind !== GOVERNANCE_CASE_LINKAGE_KIND) {
      errors.push("governance exception stabilization case linkage kind drifted");
    }
    if (payload.case_linkage_ref.version !== GOVERNANCE_CASE_LINKAGE_VERSION) {
      errors.push("governance exception stabilization case linkage version drifted");
    }
    if (payload.case_linkage_ref.stage !== GOVERNANCE_CASE_LINKAGE_STAGE) {
      errors.push("governance exception stabilization case linkage stage drifted");
    }
    if (payload.case_linkage_ref.boundary !== GOVERNANCE_CASE_LINKAGE_BOUNDARY) {
      errors.push("governance exception stabilization case linkage boundary drifted");
    }
  }
  if (!isPlainObject(payload.compatibility_ref)) {
    errors.push("governance exception stabilization compatibility ref missing");
  } else {
    if (
      payload.compatibility_ref.kind !==
      GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_KIND
    ) {
      errors.push("governance exception stabilization compatibility kind drifted");
    }
    if (
      payload.compatibility_ref.version !==
      GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_VERSION
    ) {
      errors.push("governance exception stabilization compatibility version drifted");
    }
    if (
      payload.compatibility_ref.boundary !==
      GOVERNANCE_EXCEPTION_COMPATIBILITY_CONTRACT_BOUNDARY
    ) {
      errors.push("governance exception stabilization compatibility boundary drifted");
    }
  }
  if (!isPlainObject(payload.final_consumer_contract)) {
    errors.push("governance exception stabilization final contract missing");
  } else {
    const contract = payload.final_consumer_contract;
    if (
      contract.acceptance_level !== GOVERNANCE_EXCEPTION_FINAL_ACCEPTANCE_READY
    ) {
      errors.push("governance exception stabilization acceptance level drifted");
    }
    if (contract.recommendation_only !== true) {
      errors.push("governance exception stabilization recommendation boundary drifted");
    }
    if (contract.additive_only !== true) {
      errors.push("governance exception stabilization additive boundary drifted");
    }
    if (contract.execution_enabled !== false) {
      errors.push("governance exception stabilization execution boundary drifted");
    }
    if (contract.default_on !== false) {
      errors.push("governance exception stabilization default-on drifted");
    }
    if (contract.override_execution_available !== false) {
      errors.push("governance exception stabilization override execution drifted");
    }
    if (contract.waiver_execution_available !== false) {
      errors.push("governance exception stabilization waiver execution drifted");
    }
    if (contract.audit_output_preserved !== true) {
      errors.push("governance exception stabilization audit output drifted");
    }
    if (contract.audit_verdict_preserved !== true) {
      errors.push("governance exception stabilization audit verdict drifted");
    }
    if (contract.actual_exit_code_preserved !== true) {
      errors.push("governance exception stabilization actual exit drifted");
    }
    if (contract.denied_exit_code_preserved !== 25) {
      errors.push("governance exception stabilization deny exit drifted");
    }
    if (
      contract.authority_scope !== "review_gate_deny_exit_recommendation_only"
    ) {
      errors.push("governance exception stabilization authority scope drifted");
    }
    if (contract.governance_object_addition !== false) {
      errors.push("governance exception stabilization governance object drifted");
    }
  }
  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push("governance exception stabilization preserved semantics missing");
  } else {
    const semantics = payload.preserved_semantics;
    if (semantics.exception_waiver_semantics_preserved !== true) {
      errors.push("governance exception stabilization waiver semantics drifted");
    }
    if (semantics.override_record_semantics_preserved !== true) {
      errors.push("governance exception stabilization override semantics drifted");
    }
    if (semantics.case_linkage_semantics_preserved !== true) {
      errors.push("governance exception stabilization case linkage semantics drifted");
    }
    if (semantics.exception_compatibility_semantics_preserved !== true) {
      errors.push("governance exception stabilization compatibility semantics drifted");
    }
    if (semantics.snapshot_semantics_preserved !== true) {
      errors.push("governance exception stabilization snapshot semantics drifted");
    }
    if (semantics.evidence_semantics_preserved !== true) {
      errors.push("governance exception stabilization evidence semantics drifted");
    }
    if (semantics.policy_semantics_preserved !== true) {
      errors.push("governance exception stabilization policy semantics drifted");
    }
    if (semantics.enforcement_semantics_preserved !== true) {
      errors.push("governance exception stabilization enforcement semantics drifted");
    }
    if (semantics.approval_semantics_preserved !== true) {
      errors.push("governance exception stabilization approval semantics drifted");
    }
    if (semantics.judgment_semantics_preserved !== true) {
      errors.push("governance exception stabilization judgment semantics drifted");
    }
    if (semantics.permit_gate_semantics_preserved !== true) {
      errors.push("governance exception stabilization permit semantics drifted");
    }
    if (semantics.consumer_contract_ready !== true) {
      errors.push("governance exception stabilization consumer readiness drifted");
    }
    if (semantics.override_record_ready !== true) {
      errors.push("governance exception stabilization override readiness drifted");
    }
    if (semantics.consumer_compatible !== true) {
      errors.push("governance exception stabilization compatibility readiness drifted");
    }
    if (semantics.main_path_takeover !== false) {
      errors.push("governance exception stabilization main path takeover drifted");
    }
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceExceptionStabilizationProfile(profile) {
  const validation = validateGovernanceExceptionStabilizationProfile(profile);
  if (validation.ok) return profile;
  const err = new Error(
    `governance exception stabilization profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
