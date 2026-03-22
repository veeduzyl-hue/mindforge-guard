import {
  GOVERNANCE_SNAPSHOT_CONSUMER_SURFACE,
} from "../snapshot/profile.mjs";
import {
  GOVERNANCE_SNAPSHOT_FINAL_ACCEPTANCE_BOUNDARY,
  GOVERNANCE_SNAPSHOT_STABILIZATION_KIND,
  GOVERNANCE_SNAPSHOT_STABILIZATION_STAGE,
  GOVERNANCE_SNAPSHOT_STABILIZATION_VERSION,
  assertValidGovernanceSnapshotStabilizationProfile,
} from "../snapshot/stabilization.mjs";

export const GOVERNANCE_EXCEPTION_PROFILE_KIND =
  "governance_exception_profile";
export const GOVERNANCE_EXCEPTION_PROFILE_VERSION = "v1";
export const GOVERNANCE_EXCEPTION_PROFILE_SCHEMA_ID =
  "mindforge/governance-exception-profile/v1";
export const GOVERNANCE_EXCEPTION_PROFILE_STAGE =
  "governance_exception_phase1_v1";
export const GOVERNANCE_EXCEPTION_CONSUMER_SURFACE =
  "guard.audit.governance_exception";
export const GOVERNANCE_EXCEPTION_PROFILE_BOUNDARY =
  "governance_exception_and_waiver_boundary_contract";
export const GOVERNANCE_WAIVER_CONTRACT_KIND = "governance_waiver_contract";
export const GOVERNANCE_WAIVER_CONTRACT_VERSION = "v1";
export const GOVERNANCE_WAIVER_CONTRACT_BOUNDARY =
  "bounded_governance_waiver_contract";
export const GOVERNANCE_EXCEPTION_CONTRACT_KIND =
  "governance_exception_contract";
export const GOVERNANCE_EXCEPTION_CONTRACT_VERSION = "v1";
export const GOVERNANCE_EXCEPTION_CONTRACT_BOUNDARY =
  "bounded_governance_exception_contract";
export const GOVERNANCE_EXCEPTION_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "governance_exception",
  "deterministic",
  "enforcing",
]);
export const GOVERNANCE_EXCEPTION_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "snapshot_ref",
  "exception_contract",
  "waiver_contract",
  "compatibility_refs",
  "validation_exports",
  "preserved_semantics",
]);
export const GOVERNANCE_EXCEPTION_STABLE_EXPORT_SET = Object.freeze([
  "GOVERNANCE_EXCEPTION_PROFILE_KIND",
  "GOVERNANCE_EXCEPTION_PROFILE_VERSION",
  "GOVERNANCE_EXCEPTION_PROFILE_SCHEMA_ID",
  "GOVERNANCE_EXCEPTION_PROFILE_STAGE",
  "GOVERNANCE_EXCEPTION_CONSUMER_SURFACE",
  "GOVERNANCE_EXCEPTION_PROFILE_BOUNDARY",
  "GOVERNANCE_WAIVER_CONTRACT_KIND",
  "GOVERNANCE_WAIVER_CONTRACT_VERSION",
  "GOVERNANCE_WAIVER_CONTRACT_BOUNDARY",
  "GOVERNANCE_EXCEPTION_CONTRACT_KIND",
  "GOVERNANCE_EXCEPTION_CONTRACT_VERSION",
  "GOVERNANCE_EXCEPTION_CONTRACT_BOUNDARY",
  "GOVERNANCE_EXCEPTION_TOP_LEVEL_FIELDS",
  "GOVERNANCE_EXCEPTION_PAYLOAD_FIELDS",
  "GOVERNANCE_EXCEPTION_STABLE_EXPORT_SET",
  "buildGovernanceExceptionProfile",
  "validateGovernanceExceptionProfile",
  "assertValidGovernanceExceptionProfile",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function buildGovernanceExceptionProfile({
  governanceSnapshotStabilizationProfile,
}) {
  const snapshot = assertValidGovernanceSnapshotStabilizationProfile(
    governanceSnapshotStabilizationProfile
  );

  return {
    kind: GOVERNANCE_EXCEPTION_PROFILE_KIND,
    version: GOVERNANCE_EXCEPTION_PROFILE_VERSION,
    schema_id: GOVERNANCE_EXCEPTION_PROFILE_SCHEMA_ID,
    canonical_action_hash: snapshot.canonical_action_hash,
    governance_exception: {
      stage: GOVERNANCE_EXCEPTION_PROFILE_STAGE,
      consumer_surface: GOVERNANCE_EXCEPTION_CONSUMER_SURFACE,
      boundary: GOVERNANCE_EXCEPTION_PROFILE_BOUNDARY,
      snapshot_ref: {
        kind: GOVERNANCE_SNAPSHOT_STABILIZATION_KIND,
        version: GOVERNANCE_SNAPSHOT_STABILIZATION_VERSION,
        stage: GOVERNANCE_SNAPSHOT_STABILIZATION_STAGE,
        boundary: GOVERNANCE_SNAPSHOT_FINAL_ACCEPTANCE_BOUNDARY,
        source_surface: GOVERNANCE_SNAPSHOT_CONSUMER_SURFACE,
      },
      exception_contract: {
        kind: GOVERNANCE_EXCEPTION_CONTRACT_KIND,
        version: GOVERNANCE_EXCEPTION_CONTRACT_VERSION,
        boundary: GOVERNANCE_EXCEPTION_CONTRACT_BOUNDARY,
        recommendation_only: true,
        additive_only: true,
        non_executing: true,
        default_on: false,
        exception_record_available: true,
      },
      waiver_contract: {
        kind: GOVERNANCE_WAIVER_CONTRACT_KIND,
        version: GOVERNANCE_WAIVER_CONTRACT_VERSION,
        boundary: GOVERNANCE_WAIVER_CONTRACT_BOUNDARY,
        waiver_available: true,
        descriptive_only: true,
        bounded_waiver: true,
      },
      compatibility_refs: {
        override_record_contract_available: true,
        case_linkage_profile_available: true,
        exception_compatibility_contract_available: true,
        stabilization_profile_available: true,
        final_acceptance_boundary_available: true,
      },
      validation_exports: {
        surface_available: true,
        validation_available: true,
        permit_chain_export_available: true,
      },
      preserved_semantics: {
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
        authority_scope: "review_gate_deny_exit_recommendation_only",
        authority_scope_expansion: false,
        governance_object_addition: false,
        main_path_takeover: false,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateGovernanceExceptionProfile(profile) {
  const errors = [];

  if (!isPlainObject(profile)) {
    return { ok: false, errors: ["governance exception profile must be an object"] };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(GOVERNANCE_EXCEPTION_TOP_LEVEL_FIELDS)
  ) {
    errors.push("governance exception top-level field order drifted");
  }
  if (profile.kind !== GOVERNANCE_EXCEPTION_PROFILE_KIND) {
    errors.push("governance exception kind drifted");
  }
  if (profile.version !== GOVERNANCE_EXCEPTION_PROFILE_VERSION) {
    errors.push("governance exception version drifted");
  }
  if (profile.schema_id !== GOVERNANCE_EXCEPTION_PROFILE_SCHEMA_ID) {
    errors.push("governance exception schema id drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("governance exception canonical_action_hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("governance exception must remain deterministic");
  }
  if (profile.enforcing !== false) {
    errors.push("governance exception must remain non-enforcing");
  }

  const payload = profile.governance_exception;
  if (!isPlainObject(payload)) {
    errors.push("governance exception payload must be an object");
    return { ok: errors.length === 0, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(GOVERNANCE_EXCEPTION_PAYLOAD_FIELDS)
  ) {
    errors.push("governance exception payload field order drifted");
  }
  if (payload.stage !== GOVERNANCE_EXCEPTION_PROFILE_STAGE) {
    errors.push("governance exception stage drifted");
  }
  if (payload.consumer_surface !== GOVERNANCE_EXCEPTION_CONSUMER_SURFACE) {
    errors.push("governance exception consumer surface drifted");
  }
  if (payload.boundary !== GOVERNANCE_EXCEPTION_PROFILE_BOUNDARY) {
    errors.push("governance exception boundary drifted");
  }
  if (!isPlainObject(payload.snapshot_ref)) {
    errors.push("governance exception snapshot ref must be an object");
  } else {
    if (payload.snapshot_ref.kind !== GOVERNANCE_SNAPSHOT_STABILIZATION_KIND) {
      errors.push("governance exception snapshot ref kind drifted");
    }
    if (
      payload.snapshot_ref.version !== GOVERNANCE_SNAPSHOT_STABILIZATION_VERSION
    ) {
      errors.push("governance exception snapshot ref version drifted");
    }
    if (payload.snapshot_ref.stage !== GOVERNANCE_SNAPSHOT_STABILIZATION_STAGE) {
      errors.push("governance exception snapshot ref stage drifted");
    }
    if (
      payload.snapshot_ref.boundary !== GOVERNANCE_SNAPSHOT_FINAL_ACCEPTANCE_BOUNDARY
    ) {
      errors.push("governance exception snapshot ref boundary drifted");
    }
    if (payload.snapshot_ref.source_surface !== GOVERNANCE_SNAPSHOT_CONSUMER_SURFACE) {
      errors.push("governance exception snapshot ref source surface drifted");
    }
  }
  if (!isPlainObject(payload.exception_contract)) {
    errors.push("governance exception contract must be an object");
  } else {
    if (payload.exception_contract.kind !== GOVERNANCE_EXCEPTION_CONTRACT_KIND) {
      errors.push("governance exception contract kind drifted");
    }
    if (
      payload.exception_contract.version !== GOVERNANCE_EXCEPTION_CONTRACT_VERSION
    ) {
      errors.push("governance exception contract version drifted");
    }
    if (
      payload.exception_contract.boundary !==
      GOVERNANCE_EXCEPTION_CONTRACT_BOUNDARY
    ) {
      errors.push("governance exception contract boundary drifted");
    }
    if (payload.exception_contract.recommendation_only !== true) {
      errors.push("governance exception recommendation boundary drifted");
    }
    if (payload.exception_contract.additive_only !== true) {
      errors.push("governance exception additive boundary drifted");
    }
    if (payload.exception_contract.non_executing !== true) {
      errors.push("governance exception execution boundary drifted");
    }
    if (payload.exception_contract.default_on !== false) {
      errors.push("governance exception default-on boundary drifted");
    }
    if (payload.exception_contract.exception_record_available !== true) {
      errors.push("governance exception availability drifted");
    }
  }
  if (!isPlainObject(payload.waiver_contract)) {
    errors.push("governance waiver contract must be an object");
  } else {
    if (payload.waiver_contract.kind !== GOVERNANCE_WAIVER_CONTRACT_KIND) {
      errors.push("governance waiver kind drifted");
    }
    if (payload.waiver_contract.version !== GOVERNANCE_WAIVER_CONTRACT_VERSION) {
      errors.push("governance waiver version drifted");
    }
    if (
      payload.waiver_contract.boundary !== GOVERNANCE_WAIVER_CONTRACT_BOUNDARY
    ) {
      errors.push("governance waiver boundary drifted");
    }
    if (payload.waiver_contract.waiver_available !== true) {
      errors.push("governance waiver availability drifted");
    }
    if (payload.waiver_contract.descriptive_only !== true) {
      errors.push("governance waiver descriptive boundary drifted");
    }
    if (payload.waiver_contract.bounded_waiver !== true) {
      errors.push("governance waiver bounded boundary drifted");
    }
  }
  if (!isPlainObject(payload.compatibility_refs)) {
    errors.push("governance exception compatibility refs must be an object");
  } else {
    if (payload.compatibility_refs.override_record_contract_available !== true) {
      errors.push("governance exception override record availability drifted");
    }
    if (payload.compatibility_refs.case_linkage_profile_available !== true) {
      errors.push("governance exception case linkage availability drifted");
    }
    if (
      payload.compatibility_refs.exception_compatibility_contract_available !== true
    ) {
      errors.push("governance exception compatibility contract availability drifted");
    }
    if (payload.compatibility_refs.stabilization_profile_available !== true) {
      errors.push("governance exception stabilization availability drifted");
    }
    if (payload.compatibility_refs.final_acceptance_boundary_available !== true) {
      errors.push("governance exception final acceptance boundary drifted");
    }
  }
  if (!isPlainObject(payload.validation_exports)) {
    errors.push("governance exception validation exports must be an object");
  } else {
    if (payload.validation_exports.surface_available !== true) {
      errors.push("governance exception surface availability drifted");
    }
    if (payload.validation_exports.validation_available !== true) {
      errors.push("governance exception validation availability drifted");
    }
    if (payload.validation_exports.permit_chain_export_available !== true) {
      errors.push("governance exception permit-chain export availability drifted");
    }
  }
  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push("governance exception preserved semantics must be an object");
  } else {
    const semantics = payload.preserved_semantics;
    if (semantics.snapshot_semantics_preserved !== true) {
      errors.push("governance exception snapshot semantics drifted");
    }
    if (semantics.evidence_semantics_preserved !== true) {
      errors.push("governance exception evidence semantics drifted");
    }
    if (semantics.policy_semantics_preserved !== true) {
      errors.push("governance exception policy semantics drifted");
    }
    if (semantics.enforcement_semantics_preserved !== true) {
      errors.push("governance exception enforcement semantics drifted");
    }
    if (semantics.approval_semantics_preserved !== true) {
      errors.push("governance exception approval semantics drifted");
    }
    if (semantics.judgment_semantics_preserved !== true) {
      errors.push("governance exception judgment semantics drifted");
    }
    if (semantics.permit_gate_semantics_preserved !== true) {
      errors.push("governance exception permit gate semantics drifted");
    }
    if (semantics.audit_output_preserved !== true) {
      errors.push("governance exception audit output drifted");
    }
    if (semantics.audit_verdict_preserved !== true) {
      errors.push("governance exception audit verdict drifted");
    }
    if (semantics.actual_exit_code_preserved !== true) {
      errors.push("governance exception actual exit drifted");
    }
    if (semantics.denied_exit_code_preserved !== 25) {
      errors.push("governance exception deny exit drifted");
    }
    if (
      semantics.authority_scope !== "review_gate_deny_exit_recommendation_only"
    ) {
      errors.push("governance exception authority scope drifted");
    }
    if (semantics.authority_scope_expansion !== false) {
      errors.push("governance exception authority expansion drifted");
    }
    if (semantics.governance_object_addition !== false) {
      errors.push("governance exception governance object boundary drifted");
    }
    if (semantics.main_path_takeover !== false) {
      errors.push("governance exception main path takeover drifted");
    }
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceExceptionProfile(profile) {
  const validation = validateGovernanceExceptionProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(
    `governance exception profile invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
