import {
  POLICY_PERMIT_BRIDGE_PRODUCER_SURFACE,
  assertValidPolicyPermitBridgeContract,
} from "../bridge/index.mjs";
import {
  PERMIT_GATE_CONSUMER_SURFACE,
  assertValidPermitGateResult,
} from "../permit/permitGate.mjs";
import {
  GOVERNANCE_DECISION_RECORD_CONSUMER_SURFACE,
  assertValidGovernanceDecisionRecord,
} from "../permit/governanceDecisionRecord.mjs";
import {
  LIMITED_ENFORCEMENT_AUTHORITY_CONSUMER_SURFACE,
  assertValidLimitedEnforcementAuthoritySurface,
} from "../permit/enforcementPilot.mjs";

export const JUDGMENT_PROFILE_KIND = "judgment_profile";
export const JUDGMENT_PROFILE_VERSION = "v1";
export const JUDGMENT_PROFILE_SCHEMA_ID = "mindforge/judgment-profile/v1";
export const JUDGMENT_PROFILE_STAGE = "judgment_profile_phase1_v1";
export const JUDGMENT_PROFILE_CONSUMER_SURFACE = "guard.audit";
export const JUDGMENT_PROFILE_BOUNDARY =
  "additive_signal_permit_authority_mapping";
export const JUDGMENT_PROFILE_SIGNAL_SOURCE = "policy_permit_bridge";
export const JUDGMENT_PROFILE_PERMIT_SOURCE = "permit_gate_result";
export const JUDGMENT_PROFILE_GOVERNANCE_SOURCE =
  "governance_decision_record";
export const JUDGMENT_PROFILE_LIMITED_AUTHORITY_SOURCE =
  "limited_enforcement_authority_result";
export const JUDGMENT_CLASS_INSUFFICIENT_SIGNAL = "insufficient_signal";
export const JUDGMENT_CLASS_ALLOW = "allow";
export const JUDGMENT_CLASS_REVIEW_RECOMMENDATION = "review_recommendation";
export const JUDGMENT_CLASS_DENY_RECOMMENDATION = "deny_recommendation";
export const JUDGMENT_PROFILE_CLASSES = Object.freeze([
  JUDGMENT_CLASS_INSUFFICIENT_SIGNAL,
  JUDGMENT_CLASS_ALLOW,
  JUDGMENT_CLASS_REVIEW_RECOMMENDATION,
  JUDGMENT_CLASS_DENY_RECOMMENDATION,
]);
export const JUDGMENT_PROFILE_SOURCE_ORDER = Object.freeze([
  JUDGMENT_PROFILE_SIGNAL_SOURCE,
  JUDGMENT_PROFILE_PERMIT_SOURCE,
  JUDGMENT_PROFILE_GOVERNANCE_SOURCE,
  JUDGMENT_PROFILE_LIMITED_AUTHORITY_SOURCE,
]);
export const JUDGMENT_PROFILE_TOP_LEVEL_FIELDS = Object.freeze([
  "kind",
  "version",
  "schema_id",
  "canonical_action_hash",
  "judgment_profile",
  "deterministic",
  "enforcing",
]);
export const JUDGMENT_PROFILE_PAYLOAD_FIELDS = Object.freeze([
  "stage",
  "consumer_surface",
  "boundary",
  "signal",
  "permit",
  "governance",
  "limited_authority",
  "unified_judgment",
]);
export const JUDGMENT_PROFILE_STABLE_EXPORT_SET = Object.freeze([
  "JUDGMENT_PROFILE_KIND",
  "JUDGMENT_PROFILE_VERSION",
  "JUDGMENT_PROFILE_SCHEMA_ID",
  "JUDGMENT_PROFILE_STAGE",
  "JUDGMENT_PROFILE_CONSUMER_SURFACE",
  "JUDGMENT_PROFILE_BOUNDARY",
  "JUDGMENT_PROFILE_SIGNAL_SOURCE",
  "JUDGMENT_PROFILE_PERMIT_SOURCE",
  "JUDGMENT_PROFILE_GOVERNANCE_SOURCE",
  "JUDGMENT_PROFILE_LIMITED_AUTHORITY_SOURCE",
  "JUDGMENT_CLASS_INSUFFICIENT_SIGNAL",
  "JUDGMENT_CLASS_ALLOW",
  "JUDGMENT_CLASS_REVIEW_RECOMMENDATION",
  "JUDGMENT_CLASS_DENY_RECOMMENDATION",
  "JUDGMENT_PROFILE_CLASSES",
  "JUDGMENT_PROFILE_SOURCE_ORDER",
  "JUDGMENT_PROFILE_TOP_LEVEL_FIELDS",
  "JUDGMENT_PROFILE_PAYLOAD_FIELDS",
  "buildJudgmentProfile",
  "validateJudgmentProfile",
  "assertValidJudgmentProfile",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function classifyDecision(decision) {
  switch (decision) {
    case "would_allow":
      return JUDGMENT_CLASS_ALLOW;
    case "would_review":
      return JUDGMENT_CLASS_REVIEW_RECOMMENDATION;
    case "would_deny":
      return JUDGMENT_CLASS_DENY_RECOMMENDATION;
    default:
      return JUDGMENT_CLASS_INSUFFICIENT_SIGNAL;
  }
}

function classifyAuthorityStatus(authorityStatus) {
  switch (authorityStatus) {
    case "would_apply_deny_exit_code":
      return JUDGMENT_CLASS_DENY_RECOMMENDATION;
    case "would_require_review":
      return JUDGMENT_CLASS_REVIEW_RECOMMENDATION;
    default:
      return JUDGMENT_CLASS_INSUFFICIENT_SIGNAL;
  }
}

function selectUnifiedJudgmentClass({
  authorityClass,
  permitClass,
  signalClass,
}) {
  if (authorityClass === JUDGMENT_CLASS_DENY_RECOMMENDATION) {
    return authorityClass;
  }
  if (authorityClass === JUDGMENT_CLASS_REVIEW_RECOMMENDATION) {
    return authorityClass;
  }
  if (permitClass === JUDGMENT_CLASS_ALLOW) {
    return permitClass;
  }
  if (signalClass === JUDGMENT_CLASS_ALLOW) {
    return signalClass;
  }
  return JUDGMENT_CLASS_INSUFFICIENT_SIGNAL;
}

export function buildJudgmentProfile({
  policyPermitBridgeContract,
  permitGateResult,
  governanceDecisionRecord,
  limitedEnforcementAuthorityResult,
}) {
  const bridge = assertValidPolicyPermitBridgeContract(policyPermitBridgeContract);
  const permit = assertValidPermitGateResult(permitGateResult);
  const governance = assertValidGovernanceDecisionRecord(governanceDecisionRecord);
  const authority = assertValidLimitedEnforcementAuthoritySurface(
    limitedEnforcementAuthorityResult
  );

  const canonicalActionHash = bridge.canonical_action_hash;
  for (const artifact of [permit, governance, authority]) {
    if (artifact.canonical_action_hash !== canonicalActionHash) {
      throw new Error("judgment profile requires matching canonical action hashes");
    }
  }

  const signalDecision = bridge.policy_permit_bridge.enforcement_adjacent_decision;
  const signalClass = classifyDecision(signalDecision);
  const permitClass = classifyDecision(permit.permit_gate.source_decision);
  const authorityClass = classifyAuthorityStatus(
    authority.limited_enforcement_authority.authority_status
  );

  return {
    kind: JUDGMENT_PROFILE_KIND,
    version: JUDGMENT_PROFILE_VERSION,
    schema_id: JUDGMENT_PROFILE_SCHEMA_ID,
    canonical_action_hash: canonicalActionHash,
    judgment_profile: {
      stage: JUDGMENT_PROFILE_STAGE,
      consumer_surface: JUDGMENT_PROFILE_CONSUMER_SURFACE,
      boundary: JUDGMENT_PROFILE_BOUNDARY,
      signal: {
        source: JUDGMENT_PROFILE_SIGNAL_SOURCE,
        producer_surface: POLICY_PERMIT_BRIDGE_PRODUCER_SURFACE,
        source_decision: signalDecision,
        bridge_verdict: bridge.policy_permit_bridge.execution_bridge_verdict,
        execution_readiness: bridge.policy_permit_bridge.execution_readiness,
        judgment_class: signalClass,
      },
      permit: {
        source: JUDGMENT_PROFILE_PERMIT_SOURCE,
        consumer_surface: PERMIT_GATE_CONSUMER_SURFACE,
        decision: permit.permit_gate.decision,
        source_decision: permit.permit_gate.source_decision,
        exit_code: permit.permit_gate.exit_code,
        judgment_class: permitClass,
      },
      governance: {
        source: JUDGMENT_PROFILE_GOVERNANCE_SOURCE,
        consumer_surface: GOVERNANCE_DECISION_RECORD_CONSUMER_SURFACE,
        outcome: governance.governance_decision.outcome,
        exit_code: governance.governance_decision.exit_code,
        audit_output_preserved: governance.governance_decision.audit_output_preserved,
      },
      limited_authority: {
        source: JUDGMENT_PROFILE_LIMITED_AUTHORITY_SOURCE,
        consumer_surface: LIMITED_ENFORCEMENT_AUTHORITY_CONSUMER_SURFACE,
        authority_status:
          authority.limited_enforcement_authority.authority_status,
        proposed_audit_exit_code:
          authority.limited_enforcement_authority.proposed_audit_exit_code,
        current_audit_exit_code:
          authority.limited_enforcement_authority.current_audit_exit_code,
        judgment_class: authorityClass,
      },
      unified_judgment: {
        class: selectUnifiedJudgmentClass({
          authorityClass,
          permitClass,
          signalClass,
        }),
        recommendation_only: true,
        audit_output_preserved: true,
        audit_verdict_preserved: true,
        actual_exit_code_preserved: true,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateJudgmentProfile(profile) {
  const errors = [];

  if (!isPlainObject(profile)) {
    return { ok: false, errors: ["judgment profile must be an object"] };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(JUDGMENT_PROFILE_TOP_LEVEL_FIELDS)
  ) {
    errors.push("judgment profile top-level field order drifted");
  }
  if (profile.kind !== JUDGMENT_PROFILE_KIND) {
    errors.push("judgment profile kind drifted");
  }
  if (profile.version !== JUDGMENT_PROFILE_VERSION) {
    errors.push("judgment profile version drifted");
  }
  if (profile.schema_id !== JUDGMENT_PROFILE_SCHEMA_ID) {
    errors.push("judgment profile schema id drifted");
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push("judgment profile canonical_action_hash is required");
  }
  if (profile.deterministic !== true) {
    errors.push("judgment profile must remain deterministic");
  }
  if (profile.enforcing !== false) {
    errors.push("judgment profile must remain non-enforcing");
  }
  if (!isPlainObject(profile.judgment_profile)) {
    errors.push("judgment profile payload must be an object");
    return { ok: errors.length === 0, errors };
  }

  const payload = profile.judgment_profile;
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(JUDGMENT_PROFILE_PAYLOAD_FIELDS)
  ) {
    errors.push("judgment profile payload field order drifted");
  }
  if (payload.stage !== JUDGMENT_PROFILE_STAGE) {
    errors.push("judgment profile stage drifted");
  }
  if (payload.consumer_surface !== JUDGMENT_PROFILE_CONSUMER_SURFACE) {
    errors.push("judgment profile consumer surface drifted");
  }
  if (payload.boundary !== JUDGMENT_PROFILE_BOUNDARY) {
    errors.push("judgment profile boundary drifted");
  }

  for (const key of ["signal", "permit", "governance", "limited_authority", "unified_judgment"]) {
    if (!isPlainObject(payload[key])) {
      errors.push(`judgment profile ${key} section must be an object`);
    }
  }

  if (isPlainObject(payload.signal)) {
    if (payload.signal.source !== JUDGMENT_PROFILE_SIGNAL_SOURCE) {
      errors.push("judgment profile signal source drifted");
    }
    if (payload.signal.producer_surface !== POLICY_PERMIT_BRIDGE_PRODUCER_SURFACE) {
      errors.push("judgment profile signal producer surface drifted");
    }
    if (!JUDGMENT_PROFILE_CLASSES.includes(payload.signal.judgment_class)) {
      errors.push("judgment profile signal class drifted");
    }
  }
  if (isPlainObject(payload.permit)) {
    if (payload.permit.source !== JUDGMENT_PROFILE_PERMIT_SOURCE) {
      errors.push("judgment profile permit source drifted");
    }
    if (payload.permit.consumer_surface !== PERMIT_GATE_CONSUMER_SURFACE) {
      errors.push("judgment profile permit consumer surface drifted");
    }
    if (!JUDGMENT_PROFILE_CLASSES.includes(payload.permit.judgment_class)) {
      errors.push("judgment profile permit class drifted");
    }
  }
  if (isPlainObject(payload.governance)) {
    if (payload.governance.source !== JUDGMENT_PROFILE_GOVERNANCE_SOURCE) {
      errors.push("judgment profile governance source drifted");
    }
    if (
      payload.governance.consumer_surface !==
      GOVERNANCE_DECISION_RECORD_CONSUMER_SURFACE
    ) {
      errors.push("judgment profile governance consumer surface drifted");
    }
    if (payload.governance.audit_output_preserved !== true) {
      errors.push("judgment profile governance must preserve audit output");
    }
  }
  if (isPlainObject(payload.limited_authority)) {
    if (
      payload.limited_authority.source !==
      JUDGMENT_PROFILE_LIMITED_AUTHORITY_SOURCE
    ) {
      errors.push("judgment profile limited authority source drifted");
    }
    if (
      payload.limited_authority.consumer_surface !==
      LIMITED_ENFORCEMENT_AUTHORITY_CONSUMER_SURFACE
    ) {
      errors.push("judgment profile limited authority consumer surface drifted");
    }
    if (
      payload.limited_authority.current_audit_exit_code !== null
    ) {
      errors.push(
        "judgment profile limited authority must preserve null current_audit_exit_code"
      );
    }
    if (!JUDGMENT_PROFILE_CLASSES.includes(payload.limited_authority.judgment_class)) {
      errors.push("judgment profile limited authority class drifted");
    }
  }
  if (isPlainObject(payload.unified_judgment)) {
    if (!JUDGMENT_PROFILE_CLASSES.includes(payload.unified_judgment.class)) {
      errors.push("judgment profile unified class drifted");
    }
    if (payload.unified_judgment.recommendation_only !== true) {
      errors.push("judgment profile must remain recommendation-only");
    }
    if (payload.unified_judgment.audit_output_preserved !== true) {
      errors.push("judgment profile must preserve audit output");
    }
    if (payload.unified_judgment.audit_verdict_preserved !== true) {
      errors.push("judgment profile must preserve audit verdict");
    }
    if (payload.unified_judgment.actual_exit_code_preserved !== true) {
      errors.push("judgment profile must preserve actual exit code");
    }
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function assertValidJudgmentProfile(profile) {
  const validation = validateJudgmentProfile(profile);
  if (validation.ok) return profile;

  const err = new Error(`judgment profile invalid: ${validation.errors.join("; ")}`);
  err.validation = validation;
  throw err;
}
