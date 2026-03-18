import schema from "./governance_decision_record.schema.json" with { type: "json" };
import {
  POLICY_PERMIT_BRIDGE_KIND,
  POLICY_PERMIT_BRIDGE_VERSION,
  POLICY_PERMIT_BRIDGE_SCHEMA_ID,
  POLICY_PERMIT_BRIDGE_PRODUCER_SURFACE,
  assertValidPolicyPermitBridgeContract,
} from "../bridge/index.mjs";
import {
  PERMIT_GATE_RESULT_KIND,
  PERMIT_GATE_RESULT_VERSION,
  PERMIT_GATE_RESULT_SCHEMA_ID,
  PERMIT_GATE_MODE,
  PERMIT_GATE_CONSUMER_SURFACE,
  assertValidPermitGateResult,
} from "./permitGate.mjs";
import {
  GOVERNANCE_RECEIPT_KIND,
  GOVERNANCE_RECEIPT_VERSION,
  GOVERNANCE_RECEIPT_SCHEMA_ID,
  GOVERNANCE_RECEIPT_EMISSION_MODE,
  GOVERNANCE_RECEIPT_RESULT_BOUNDARY,
  assertValidGovernanceReceipt,
} from "./governanceReceipt.mjs";

export const GOVERNANCE_DECISION_RECORD_KIND = "governance_decision_record";
export const GOVERNANCE_DECISION_RECORD_VERSION = "v1";
export const GOVERNANCE_DECISION_RECORD_SCHEMA_ID = schema.$id;
export const GOVERNANCE_DECISION_RECORD_CONSUMER_SURFACE = "guard.audit";
export const GOVERNANCE_DECISION_RECORD_SOURCE = "permit_gate";
export const GOVERNANCE_DECISION_RECORD_MODE = "explicit_opt_in";
export const GOVERNANCE_DECISION_RECORD_RESULT_BOUNDARY = "parallel_artifact";
export const GOVERNANCE_DECISION_RECORD_EMITTER_SURFACE = "guard.audit";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function joinPath(base, key) {
  return base ? `${base}.${key}` : key;
}

function validateNode(value, nodeSchema, path, errors) {
  if (nodeSchema.const !== undefined && value !== nodeSchema.const) {
    errors.push(`${path || "$"} must equal ${JSON.stringify(nodeSchema.const)}`);
    return;
  }

  if (nodeSchema.enum && !nodeSchema.enum.includes(value)) {
    errors.push(`${path || "$"} must be one of ${nodeSchema.enum.join(", ")}`);
    return;
  }

  if (nodeSchema.type === "object") {
    if (!isPlainObject(value)) {
      errors.push(`${path || "$"} must be an object`);
      return;
    }

    const properties = nodeSchema.properties || {};
    const required = nodeSchema.required || [];
    for (const key of required) {
      if (!(key in value)) errors.push(`${joinPath(path, key)} is required`);
    }

    if (nodeSchema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!(key in properties)) errors.push(`${joinPath(path, key)} is not allowed`);
      }
    }

    for (const [key, child] of Object.entries(properties)) {
      if (key in value) validateNode(value[key], child, joinPath(path, key), errors);
    }
    return;
  }

  if (nodeSchema.type === "array") {
    if (!Array.isArray(value)) {
      errors.push(`${path || "$"} must be an array`);
      return;
    }
    if (nodeSchema.items) {
      value.forEach((item, index) => validateNode(item, nodeSchema.items, `${path}[${index}]`, errors));
    }
    return;
  }

  if (nodeSchema.type === "string") {
    if (typeof value !== "string") {
      errors.push(`${path || "$"} must be a string`);
      return;
    }
    if (typeof nodeSchema.minLength === "number" && value.length < nodeSchema.minLength) {
      errors.push(`${path || "$"} must be at least ${nodeSchema.minLength} characters`);
    }
    if (nodeSchema.pattern && !(new RegExp(nodeSchema.pattern).test(value))) {
      errors.push(`${path || "$"} must match ${nodeSchema.pattern}`);
    }
  }
}

export function buildGovernanceDecisionRecord({
  audit,
  policyPermitBridgeContract,
  permitGateResult,
  governanceReceipt = null,
}) {
  const bridgeContract = assertValidPolicyPermitBridgeContract(policyPermitBridgeContract);
  const gateResult = assertValidPermitGateResult(permitGateResult);
  const receipt = governanceReceipt ? assertValidGovernanceReceipt(governanceReceipt) : null;

  if (bridgeContract.canonical_action_hash !== gateResult.canonical_action_hash) {
    throw new Error("governance decision record requires matching canonical action hashes");
  }

  if (receipt && receipt.canonical_action_hash !== gateResult.canonical_action_hash) {
    throw new Error("governance decision record receipt linkage requires matching canonical action hashes");
  }

  const record = {
    kind: GOVERNANCE_DECISION_RECORD_KIND,
    version: GOVERNANCE_DECISION_RECORD_VERSION,
    schema_id: GOVERNANCE_DECISION_RECORD_SCHEMA_ID,
    canonical_action_hash: bridgeContract.canonical_action_hash,
    bridge_contract: {
      kind: POLICY_PERMIT_BRIDGE_KIND,
      version: POLICY_PERMIT_BRIDGE_VERSION,
      schema_id: POLICY_PERMIT_BRIDGE_SCHEMA_ID,
      producer_surface: POLICY_PERMIT_BRIDGE_PRODUCER_SURFACE,
    },
    permit_gate_result: {
      kind: PERMIT_GATE_RESULT_KIND,
      version: PERMIT_GATE_RESULT_VERSION,
      schema_id: PERMIT_GATE_RESULT_SCHEMA_ID,
      consumer_surface: PERMIT_GATE_CONSUMER_SURFACE,
      mode: PERMIT_GATE_MODE,
      decision: gateResult.permit_gate.decision,
      source_decision: gateResult.permit_gate.source_decision,
      exit_code: gateResult.permit_gate.exit_code,
    },
    governance_decision: {
      outcome: gateResult.permit_gate.decision,
      consumer_surface: GOVERNANCE_DECISION_RECORD_CONSUMER_SURFACE,
      decision_mode: GOVERNANCE_DECISION_RECORD_MODE,
      decision_source: GOVERNANCE_DECISION_RECORD_SOURCE,
      result_boundary: GOVERNANCE_DECISION_RECORD_RESULT_BOUNDARY,
      exit_code: gateResult.permit_gate.exit_code,
      audit_output_preserved: gateResult.permit_gate.audit_output_preserved,
    },
    traceability: {
      run_id: audit?.run?.run_id || "",
      audit_mode: audit?.run?.mode || "local",
      git_head: audit?.run?.git?.head || "",
      git_branch: audit?.run?.git?.branch || "",
      emitted_by: GOVERNANCE_DECISION_RECORD_EMITTER_SURFACE,
    },
    deterministic: true,
    enforcing: false,
  };

  if (receipt) {
    record.governance_receipt_linkage = {
      kind: GOVERNANCE_RECEIPT_KIND,
      version: GOVERNANCE_RECEIPT_VERSION,
      schema_id: GOVERNANCE_RECEIPT_SCHEMA_ID,
      emission_mode: GOVERNANCE_RECEIPT_EMISSION_MODE,
      result_boundary: GOVERNANCE_RECEIPT_RESULT_BOUNDARY,
    };
  }

  return record;
}

export function validateGovernanceDecisionRecord(artifact) {
  const errors = [];
  validateNode(artifact, schema, "", errors);
  return {
    ok: errors.length === 0,
    errors,
    schemaId: schema.$id,
  };
}

export function assertValidGovernanceDecisionRecord(artifact) {
  const result = validateGovernanceDecisionRecord(artifact);
  if (result.ok) return artifact;

  const err = new Error(`governance_decision_record failed validation: ${result.errors.join("; ")}`);
  err.validation = result;
  throw err;
}
