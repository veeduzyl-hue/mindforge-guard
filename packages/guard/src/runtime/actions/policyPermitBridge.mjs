import schema from "./policy_permit_bridge.schema.json" with { type: "json" };

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

function buildReasonSummary(enforcementAdjacentDecisionArtifact) {
  const reasons = Array.isArray(enforcementAdjacentDecisionArtifact?.enforcement_adjacent_decision?.reasons)
    ? enforcementAdjacentDecisionArtifact.enforcement_adjacent_decision.reasons
    : [];

  return reasons.map((reason) => {
    const summary = {
      kind: reason.kind,
      message: reason.message,
    };
    if (typeof reason.rule_id === "string") {
      summary.rule_id = reason.rule_id;
    }
    return summary;
  });
}

export function buildPolicyPermitBridgeContract({
  canonicalActionArtifact,
  policyPreviewArtifact,
  permitPrecheckArtifact,
  executionBridgeArtifact,
  executionReadinessArtifact,
  enforcementAdjacentDecisionArtifact,
}) {
  return {
    kind: "policy_permit_bridge_contract",
    version: "v1",
    canonical_action_hash: canonicalActionArtifact.canonical_action_hash,
    policy_permit_bridge: {
      action_class: canonicalActionArtifact?.action?.action_class || "unknown",
      policy_preview_verdict: policyPreviewArtifact?.policy_preview?.preview_verdict || "unknown",
      permit_precheck_decision: permitPrecheckArtifact?.permit_precheck?.decision || "unknown",
      execution_bridge_verdict: executionBridgeArtifact?.execution_bridge?.bridge_verdict || "unknown",
      execution_readiness: executionReadinessArtifact?.execution_readiness?.readiness || "unknown",
      enforcement_adjacent_decision:
        enforcementAdjacentDecisionArtifact?.enforcement_adjacent_decision?.decision || "insufficient_signal",
      reason_summary: buildReasonSummary(enforcementAdjacentDecisionArtifact),
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validatePolicyPermitBridgeContract(artifact) {
  const errors = [];
  validateNode(artifact, schema, "", errors);
  return {
    ok: errors.length === 0,
    errors,
    schemaId: schema.$id,
  };
}

export function assertValidPolicyPermitBridgeContract(artifact) {
  const result = validatePolicyPermitBridgeContract(artifact);
  if (result.ok) return artifact;

  const err = new Error(`policy_permit_bridge_contract failed validation: ${result.errors.join("; ")}`);
  err.validation = result;
  throw err;
}
