import {
  GOVERNANCE_CASE_RESOLUTION_STABILIZATION_BOUNDARY,
  GOVERNANCE_CASE_RESOLUTION_STABILIZATION_KIND,
  GOVERNANCE_CASE_RESOLUTION_STABILIZATION_STAGE,
  GOVERNANCE_CASE_RESOLUTION_STABILIZATION_VERSION,
  assertValidGovernanceCaseResolutionStabilizationProfile,
} from "../caseResolution/index.mjs";
import {
  GOVERNANCE_CASE_ESCALATION_STABILIZATION_BOUNDARY,
  GOVERNANCE_CASE_ESCALATION_STABILIZATION_KIND,
  GOVERNANCE_CASE_ESCALATION_STABILIZATION_STAGE,
  GOVERNANCE_CASE_ESCALATION_STABILIZATION_VERSION,
  assertValidGovernanceCaseEscalationStabilizationProfile,
} from "../caseEscalation/index.mjs";
import {
  GOVERNANCE_CASE_CLOSURE_STABILIZATION_BOUNDARY,
  GOVERNANCE_CASE_CLOSURE_STABILIZATION_KIND,
  GOVERNANCE_CASE_CLOSURE_STABILIZATION_STAGE,
  GOVERNANCE_CASE_CLOSURE_STABILIZATION_VERSION,
  assertValidGovernanceCaseClosureStabilizationProfile,
} from "../caseClosure/index.mjs";

export const GOVERNANCE_CASE_FINAL_ACCEPTANCE_KIND =
  "governance_case_final_acceptance_boundary";
export const GOVERNANCE_CASE_FINAL_ACCEPTANCE_VERSION = "v1";
export const GOVERNANCE_CASE_FINAL_ACCEPTANCE_SCHEMA_ID =
  "mindforge/governance-case-final-acceptance-boundary/v1";
export const GOVERNANCE_CASE_FINAL_ACCEPTANCE_STAGE =
  "governance_case_final_acceptance_consolidation_v5_3_0";
export const GOVERNANCE_CASE_FINAL_ACCEPTANCE_BOUNDARY =
  "governance_case_final_acceptance_boundary";
export const GOVERNANCE_CASE_FINAL_ACCEPTANCE_CONSUMER_SURFACE =
  "guard.audit.governance_case_final_acceptance";
export const GOVERNANCE_CASE_FINAL_ACCEPTANCE_READY =
  "release_ready_for_v5_3_0_review";
export const GOVERNANCE_CASE_FINAL_ACCEPTANCE_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "governance_case_final_acceptance",
  "deterministic",
  "enforcing",
]);
export const GOVERNANCE_CASE_FINAL_ACCEPTANCE_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "release_target",
  "resolution_ref",
  "escalation_ref",
  "closure_ref",
  "continuity",
  "final_acceptance_contract",
  "preserved_semantics",
]);
export const GOVERNANCE_CASE_FINAL_ACCEPTANCE_STABLE_EXPORT_SET = Object.freeze([
  "GOVERNANCE_CASE_FINAL_ACCEPTANCE_KIND",
  "GOVERNANCE_CASE_FINAL_ACCEPTANCE_VERSION",
  "GOVERNANCE_CASE_FINAL_ACCEPTANCE_SCHEMA_ID",
  "GOVERNANCE_CASE_FINAL_ACCEPTANCE_STAGE",
  "GOVERNANCE_CASE_FINAL_ACCEPTANCE_BOUNDARY",
  "GOVERNANCE_CASE_FINAL_ACCEPTANCE_CONSUMER_SURFACE",
  "GOVERNANCE_CASE_FINAL_ACCEPTANCE_READY",
  "GOVERNANCE_CASE_FINAL_ACCEPTANCE_TOP_LEVEL_FIELDS",
  "GOVERNANCE_CASE_FINAL_ACCEPTANCE_PAYLOAD_FIELDS",
  "GOVERNANCE_CASE_FINAL_ACCEPTANCE_STABLE_EXPORT_SET",
  "buildGovernanceCaseFinalAcceptanceBoundary",
  "validateGovernanceCaseFinalAcceptanceBoundary",
  "assertValidGovernanceCaseFinalAcceptanceBoundary",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function stableStringify(value) {
  return JSON.stringify(value);
}

function assertSameCanonicalLineage(resolution, escalation, closure) {
  const hashes = [
    resolution.canonical_action_hash,
    escalation.canonical_action_hash,
    closure.canonical_action_hash,
  ];
  if (new Set(hashes).size !== 1) {
    throw new Error(
      "governance case final acceptance canonical lineage mismatch: canonical_action_hash must match across resolution, escalation, and closure"
    );
  }
  return hashes[0];
}

function deriveContinuity(resolution, escalation, closure) {
  const resolutionRef =
    resolution.governance_case_resolution_stabilization.continuity_ref;
  const escalationRef =
    escalation.governance_case_escalation_stabilization.continuity_ref;
  const closureRef =
    closure.governance_case_closure_stabilization.continuity_ref;

  const sameCaseId =
    resolutionRef.case_id === escalationRef.case_id &&
    escalationRef.case_id === closureRef.case_id;
  const sameExceptionIds =
    stableStringify(resolutionRef.linked_exception_ids) ===
      stableStringify(escalationRef.linked_exception_ids) &&
    stableStringify(escalationRef.linked_exception_ids) ===
      stableStringify(closureRef.linked_exception_ids);
  const sameOverrideIds =
    stableStringify(resolutionRef.linked_override_record_ids) ===
      stableStringify(escalationRef.linked_override_record_ids) &&
    stableStringify(escalationRef.linked_override_record_ids) ===
      stableStringify(closureRef.linked_override_record_ids);
  const escalationResolutionContinuity =
    stableStringify(escalationRef.linked_resolution_ids) ===
    stableStringify(closureRef.linked_resolution_ids);
  const closureEscalationContinuity =
    Array.isArray(closureRef.linked_escalation_ids) &&
    closureRef.linked_escalation_ids.length > 0;

  if (!sameCaseId || !escalationResolutionContinuity || !closureEscalationContinuity) {
    throw new Error(
      "governance case final acceptance case continuity mismatch: case_id and cross-layer case linkage chain must match across resolution, escalation, and closure"
    );
  }
  if (!sameExceptionIds) {
    throw new Error(
      "governance case final acceptance exception continuity mismatch: exception-linked continuity basis must match across resolution, escalation, and closure"
    );
  }
  if (!sameOverrideIds) {
    throw new Error(
      "governance case final acceptance override continuity mismatch: override-linked continuity basis must match across resolution, escalation, and closure"
    );
  }

  return {
    case_id: resolutionRef.case_id,
    linked_exception_ids: resolutionRef.linked_exception_ids,
    linked_override_record_ids: resolutionRef.linked_override_record_ids,
    linked_resolution_ids: escalationRef.linked_resolution_ids,
    linked_escalation_ids: closureRef.linked_escalation_ids,
    basis_refs: resolutionRef.basis_refs,
    case_linkage_continuity: true,
    exception_override_compatibility_continuity: true,
    additive_only_continuity: true,
    recommendation_only_continuity: true,
    non_executing_continuity: true,
    default_off_continuity: true,
  };
}

export function buildGovernanceCaseFinalAcceptanceBoundary({
  governanceCaseResolutionStabilizationProfile,
  governanceCaseEscalationStabilizationProfile,
  governanceCaseClosureStabilizationProfile,
}) {
  const resolution = assertValidGovernanceCaseResolutionStabilizationProfile(
    governanceCaseResolutionStabilizationProfile
  );
  const escalation = assertValidGovernanceCaseEscalationStabilizationProfile(
    governanceCaseEscalationStabilizationProfile
  );
  const closure = assertValidGovernanceCaseClosureStabilizationProfile(
    governanceCaseClosureStabilizationProfile
  );

  const canonicalActionHash = assertSameCanonicalLineage(
    resolution,
    escalation,
    closure
  );
  const continuity = deriveContinuity(resolution, escalation, closure);

  return {
    kind: GOVERNANCE_CASE_FINAL_ACCEPTANCE_KIND,
    version: GOVERNANCE_CASE_FINAL_ACCEPTANCE_VERSION,
    schema_id: GOVERNANCE_CASE_FINAL_ACCEPTANCE_SCHEMA_ID,
    canonical_action_hash: canonicalActionHash,
    governance_case_final_acceptance: {
      stage: GOVERNANCE_CASE_FINAL_ACCEPTANCE_STAGE,
      consumer_surface: GOVERNANCE_CASE_FINAL_ACCEPTANCE_CONSUMER_SURFACE,
      boundary: GOVERNANCE_CASE_FINAL_ACCEPTANCE_BOUNDARY,
      release_target: "v5.3.0",
      resolution_ref: {
        kind: GOVERNANCE_CASE_RESOLUTION_STABILIZATION_KIND,
        version: GOVERNANCE_CASE_RESOLUTION_STABILIZATION_VERSION,
        stage: GOVERNANCE_CASE_RESOLUTION_STABILIZATION_STAGE,
        boundary: GOVERNANCE_CASE_RESOLUTION_STABILIZATION_BOUNDARY,
      },
      escalation_ref: {
        kind: GOVERNANCE_CASE_ESCALATION_STABILIZATION_KIND,
        version: GOVERNANCE_CASE_ESCALATION_STABILIZATION_VERSION,
        stage: GOVERNANCE_CASE_ESCALATION_STABILIZATION_STAGE,
        boundary: GOVERNANCE_CASE_ESCALATION_STABILIZATION_BOUNDARY,
      },
      closure_ref: {
        kind: GOVERNANCE_CASE_CLOSURE_STABILIZATION_KIND,
        version: GOVERNANCE_CASE_CLOSURE_STABILIZATION_VERSION,
        stage: GOVERNANCE_CASE_CLOSURE_STABILIZATION_STAGE,
        boundary: GOVERNANCE_CASE_CLOSURE_STABILIZATION_BOUNDARY,
      },
      continuity,
      final_acceptance_contract: {
        readiness_level: GOVERNANCE_CASE_FINAL_ACCEPTANCE_READY,
        resolution_boundary_present: true,
        escalation_boundary_present: true,
        closure_boundary_present: true,
        additive_only: true,
        recommendation_only: true,
        non_executing: true,
        default_off: true,
        execution_takeover: false,
        authority_scope_expansion: false,
        workflow_engine_emergence: false,
      },
      preserved_semantics: {
        audit_output_preserved: true,
        audit_verdict_preserved: true,
        actual_exit_code_preserved: true,
        denied_exit_code_preserved: 25,
        permit_gate_semantics_preserved: true,
        enforcement_pilot_semantics_preserved: true,
        limited_enforcement_authority_semantics_preserved: true,
        classify_semantics_preserved: true,
        main_path_takeover: false,
        governance_object_addition: false,
        risk_integration: false,
        ui_control_plane: false,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateGovernanceCaseFinalAcceptanceBoundary(boundary) {
  const errors = [];
  if (!isPlainObject(boundary)) {
    return {
      ok: false,
      errors: ["governance case final acceptance boundary must be an object"],
    };
  }
  if (
    JSON.stringify(Object.keys(boundary)) !==
    JSON.stringify(GOVERNANCE_CASE_FINAL_ACCEPTANCE_TOP_LEVEL_FIELDS)
  ) {
    errors.push("governance case final acceptance top-level field order drifted");
  }
  if (boundary.kind !== GOVERNANCE_CASE_FINAL_ACCEPTANCE_KIND) {
    errors.push("governance case final acceptance kind drifted");
  }
  if (boundary.version !== GOVERNANCE_CASE_FINAL_ACCEPTANCE_VERSION) {
    errors.push("governance case final acceptance version drifted");
  }
  if (boundary.schema_id !== GOVERNANCE_CASE_FINAL_ACCEPTANCE_SCHEMA_ID) {
    errors.push("governance case final acceptance schema drifted");
  }
  if (
    typeof boundary.canonical_action_hash !== "string" ||
    boundary.canonical_action_hash.length === 0
  ) {
    errors.push("governance case final acceptance canonical action hash is required");
  }
  if (boundary.deterministic !== true) {
    errors.push("governance case final acceptance determinism drifted");
  }
  if (boundary.enforcing !== false) {
    errors.push("governance case final acceptance enforcing drifted");
  }

  const payload = boundary.governance_case_final_acceptance;
  if (!isPlainObject(payload)) {
    errors.push("governance case final acceptance payload must be an object");
    return { ok: errors.length === 0, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(GOVERNANCE_CASE_FINAL_ACCEPTANCE_PAYLOAD_FIELDS)
  ) {
    errors.push("governance case final acceptance payload field order drifted");
  }
  if (payload.stage !== GOVERNANCE_CASE_FINAL_ACCEPTANCE_STAGE) {
    errors.push("governance case final acceptance stage drifted");
  }
  if (
    payload.consumer_surface !== GOVERNANCE_CASE_FINAL_ACCEPTANCE_CONSUMER_SURFACE
  ) {
    errors.push("governance case final acceptance surface drifted");
  }
  if (payload.boundary !== GOVERNANCE_CASE_FINAL_ACCEPTANCE_BOUNDARY) {
    errors.push("governance case final acceptance boundary drifted");
  }
  if (payload.release_target !== "v5.3.0") {
    errors.push("governance case final acceptance release target drifted");
  }
  if (!isPlainObject(payload.resolution_ref)) {
    errors.push("governance case final acceptance resolution ref missing");
  }
  if (!isPlainObject(payload.escalation_ref)) {
    errors.push("governance case final acceptance escalation ref missing");
  }
  if (!isPlainObject(payload.closure_ref)) {
    errors.push("governance case final acceptance closure ref missing");
  }
  if (!isPlainObject(payload.continuity)) {
    errors.push("governance case final acceptance continuity must be an object");
  } else {
    if (
      typeof payload.continuity.case_id !== "string" ||
      payload.continuity.case_id.length === 0
    ) {
      errors.push("governance case final acceptance continuity case_id is required");
    }
    if (
      !Array.isArray(payload.continuity.linked_exception_ids) ||
      payload.continuity.linked_exception_ids.length === 0
    ) {
      errors.push("governance case final acceptance linked exception ids are required");
    }
    if (
      !Array.isArray(payload.continuity.linked_override_record_ids) ||
      payload.continuity.linked_override_record_ids.length === 0
    ) {
      errors.push("governance case final acceptance linked override ids are required");
    }
    if (
      !Array.isArray(payload.continuity.linked_resolution_ids) ||
      payload.continuity.linked_resolution_ids.length === 0
    ) {
      errors.push("governance case final acceptance linked resolution ids are required");
    }
    if (
      !Array.isArray(payload.continuity.linked_escalation_ids) ||
      payload.continuity.linked_escalation_ids.length === 0
    ) {
      errors.push("governance case final acceptance linked escalation ids are required");
    }
    if (
      !Array.isArray(payload.continuity.basis_refs) ||
      payload.continuity.basis_refs.length === 0
    ) {
      errors.push("governance case final acceptance continuity basis refs are required");
    }
    if (payload.continuity.case_linkage_continuity !== true) {
      errors.push("governance case final acceptance case linkage continuity drifted");
    }
    if (payload.continuity.exception_override_compatibility_continuity !== true) {
      errors.push("governance case final acceptance exception continuity drifted");
    }
    if (payload.continuity.additive_only_continuity !== true) {
      errors.push("governance case final acceptance additive continuity drifted");
    }
    if (payload.continuity.recommendation_only_continuity !== true) {
      errors.push("governance case final acceptance recommendation continuity drifted");
    }
    if (payload.continuity.non_executing_continuity !== true) {
      errors.push("governance case final acceptance non-executing continuity drifted");
    }
    if (payload.continuity.default_off_continuity !== true) {
      errors.push("governance case final acceptance default-off continuity drifted");
    }
  }
  if (!isPlainObject(payload.final_acceptance_contract)) {
    errors.push("governance case final acceptance contract must be an object");
  } else {
    if (
      payload.final_acceptance_contract.readiness_level !==
      GOVERNANCE_CASE_FINAL_ACCEPTANCE_READY
    ) {
      errors.push("governance case final acceptance readiness drifted");
    }
    if (payload.final_acceptance_contract.resolution_boundary_present !== true) {
      errors.push("governance case final acceptance resolution presence drifted");
    }
    if (payload.final_acceptance_contract.escalation_boundary_present !== true) {
      errors.push("governance case final acceptance escalation presence drifted");
    }
    if (payload.final_acceptance_contract.closure_boundary_present !== true) {
      errors.push("governance case final acceptance closure presence drifted");
    }
    if (payload.final_acceptance_contract.additive_only !== true) {
      errors.push("governance case final acceptance additive boundary drifted");
    }
    if (payload.final_acceptance_contract.recommendation_only !== true) {
      errors.push("governance case final acceptance recommendation boundary drifted");
    }
    if (payload.final_acceptance_contract.non_executing !== true) {
      errors.push("governance case final acceptance non-executing boundary drifted");
    }
    if (payload.final_acceptance_contract.default_off !== true) {
      errors.push("governance case final acceptance default-off boundary drifted");
    }
    if (payload.final_acceptance_contract.execution_takeover !== false) {
      errors.push("governance case final acceptance execution takeover drifted");
    }
    if (payload.final_acceptance_contract.authority_scope_expansion !== false) {
      errors.push("governance case final acceptance authority expansion drifted");
    }
    if (payload.final_acceptance_contract.workflow_engine_emergence !== false) {
      errors.push("governance case final acceptance workflow emergence drifted");
    }
  }
  if (!isPlainObject(payload.preserved_semantics)) {
    errors.push("governance case final acceptance preserved semantics must be an object");
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseFinalAcceptanceBoundary(boundary) {
  const validation = validateGovernanceCaseFinalAcceptanceBoundary(boundary);
  if (validation.ok) return boundary;

  const err = new Error(
    `governance case final acceptance boundary invalid: ${validation.errors.join("; ")}`
  );
  err.validation = validation;
  throw err;
}
