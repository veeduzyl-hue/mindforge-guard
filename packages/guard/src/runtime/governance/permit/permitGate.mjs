import schema from "./permit_gate_result.schema.json" with { type: "json" };
import {
  POLICY_PERMIT_BRIDGE_KIND,
  POLICY_PERMIT_BRIDGE_VERSION,
  POLICY_PERMIT_BRIDGE_SCHEMA_ID,
  POLICY_PERMIT_BRIDGE_PRODUCER_SURFACE,
  assertValidPolicyPermitBridgeContract,
} from "../bridge/index.mjs";

export const PERMIT_GATE_RESULT_KIND = "permit_gate_result";
export const PERMIT_GATE_RESULT_VERSION = "v1";
export const PERMIT_GATE_RESULT_SCHEMA_ID = schema.$id;
export const PERMIT_GATE_MODE = "explicit_opt_in";
export const PERMIT_GATE_CONSUMER_SURFACE = "guard.audit";
export const PERMIT_GATE_DENIED_EXIT_CODE = 25;

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

function deriveGateReasons(bridgeContract, sourceDecision, decision) {
  const reasons = Array.isArray(bridgeContract?.policy_permit_bridge?.reason_summary)
    ? bridgeContract.policy_permit_bridge.reason_summary
    : [];

  if (reasons.length > 0 && decision === "deny") {
    return reasons;
  }

  if (decision === "allow") {
    return [
      {
        kind: "permit_gate_allow",
        message:
          sourceDecision === "would_allow"
            ? "Permit gate allowed this audit run because the bridge contract reached an allow-style governance decision."
            : "Permit gate allowed this audit run because the bridge contract did not escalate beyond insufficient signal.",
      },
    ];
  }

  return [
    {
      kind: "permit_gate_deny",
      message: `Permit gate denied this audit run because the bridge contract produced ${sourceDecision}.`,
    },
  ];
}

export function buildPermitGateResult({ policyPermitBridgeContract }) {
  const bridgeContract = assertValidPolicyPermitBridgeContract(policyPermitBridgeContract);
  const sourceDecision =
    bridgeContract?.policy_permit_bridge?.enforcement_adjacent_decision || "insufficient_signal";
  const decision =
    sourceDecision === "would_review" || sourceDecision === "would_deny" ? "deny" : "allow";
  const exitCode = decision === "deny" ? PERMIT_GATE_DENIED_EXIT_CODE : 0;

  return {
    kind: PERMIT_GATE_RESULT_KIND,
    version: PERMIT_GATE_RESULT_VERSION,
    schema_id: PERMIT_GATE_RESULT_SCHEMA_ID,
    canonical_action_hash: bridgeContract.canonical_action_hash,
    bridge_contract: {
      kind: POLICY_PERMIT_BRIDGE_KIND,
      version: POLICY_PERMIT_BRIDGE_VERSION,
      schema_id: POLICY_PERMIT_BRIDGE_SCHEMA_ID,
      producer_surface: POLICY_PERMIT_BRIDGE_PRODUCER_SURFACE,
    },
    permit_gate: {
      mode: PERMIT_GATE_MODE,
      consumer_surface: PERMIT_GATE_CONSUMER_SURFACE,
      decision,
      source_decision: sourceDecision,
      exit_code: exitCode,
      audit_output_preserved: true,
      reasons: deriveGateReasons(bridgeContract, sourceDecision, decision),
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validatePermitGateResult(artifact) {
  const errors = [];
  validateNode(artifact, schema, "", errors);
  return {
    ok: errors.length === 0,
    errors,
    schemaId: schema.$id,
  };
}

export function assertValidPermitGateResult(artifact) {
  const result = validatePermitGateResult(artifact);
  if (result.ok) return artifact;

  const err = new Error(`permit_gate_result failed validation: ${result.errors.join("; ")}`);
  err.validation = result;
  throw err;
}
