import schema from "./governance_receipt.schema.json" with { type: "json" };
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

export const GOVERNANCE_RECEIPT_KIND = "governance_receipt";
export const GOVERNANCE_RECEIPT_VERSION = "v1";
export const GOVERNANCE_RECEIPT_SCHEMA_ID = schema.$id;
export const GOVERNANCE_RECEIPT_EMITTER_SURFACE = "guard.audit";

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

export function buildGovernanceReceipt({ audit, policyPermitBridgeContract, permitGateResult }) {
  const bridgeContract = assertValidPolicyPermitBridgeContract(policyPermitBridgeContract);
  const gateResult = assertValidPermitGateResult(permitGateResult);

  if (bridgeContract.canonical_action_hash !== gateResult.canonical_action_hash) {
    throw new Error("governance receipt requires matching canonical action hashes");
  }

  return {
    kind: GOVERNANCE_RECEIPT_KIND,
    version: GOVERNANCE_RECEIPT_VERSION,
    schema_id: GOVERNANCE_RECEIPT_SCHEMA_ID,
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
    },
    governance_receipt: {
      outcome: gateResult.permit_gate.decision,
      consumer_surface: PERMIT_GATE_CONSUMER_SURFACE,
      exit_code: gateResult.permit_gate.exit_code,
      audit_output_preserved: gateResult.permit_gate.audit_output_preserved,
      traceability: {
        audit_mode: audit?.run?.mode || "local",
        git_head: audit?.run?.git?.head || "",
        git_branch: audit?.run?.git?.branch || "",
        emitted_by: GOVERNANCE_RECEIPT_EMITTER_SURFACE,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateGovernanceReceipt(artifact) {
  const errors = [];
  validateNode(artifact, schema, "", errors);
  return {
    ok: errors.length === 0,
    errors,
    schemaId: schema.$id,
  };
}

export function assertValidGovernanceReceipt(artifact) {
  const result = validateGovernanceReceipt(artifact);
  if (result.ok) return artifact;

  const err = new Error(`governance_receipt failed validation: ${result.errors.join("; ")}`);
  err.validation = result;
  throw err;
}
