import schema from "./enforcement_adjacent_decision.schema.json" with { type: "json" };

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

function buildReasons(executionReadinessArtifact, decision) {
  if (decision === "would_allow") {
    return [
      {
        kind: "decision_allow",
        message: "Current preview signals indicate this canonical action would be eligible for an allow-style enforcement decision if enforcement existed.",
      },
    ];
  }

  if (decision === "would_review" || decision === "would_deny") {
    return Array.isArray(executionReadinessArtifact?.execution_readiness?.reasons)
      ? executionReadinessArtifact.execution_readiness.reasons
      : [];
  }

  return [
    {
      kind: "decision_insufficient_signal",
      message: `Execution-adjacent decision record remained inconclusive because readiness is ${executionReadinessArtifact?.execution_readiness?.readiness || "unknown"}.`,
    },
  ];
}

export function buildEnforcementAdjacentDecisionRecord({
  canonicalActionArtifact,
  executionReadinessArtifact,
}) {
  const readiness = executionReadinessArtifact?.execution_readiness?.readiness || "unknown";
  const bridgeVerdict = executionReadinessArtifact?.execution_readiness?.bridge_verdict || "unknown";

  let decision = "insufficient_signal";
  if (readiness === "ready") {
    decision = "would_allow";
  } else if (readiness === "not_ready" && bridgeVerdict === "review") {
    decision = "would_review";
  } else if (readiness === "not_ready" && bridgeVerdict === "deny") {
    decision = "would_deny";
  }

  return {
    kind: "enforcement_adjacent_decision_record",
    version: "v1",
    canonical_action_hash: canonicalActionArtifact.canonical_action_hash,
    enforcement_adjacent_decision: {
      decision,
      readiness,
      bridge_verdict: bridgeVerdict,
      reasons: buildReasons(executionReadinessArtifact, decision),
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateEnforcementAdjacentDecisionRecord(artifact) {
  const errors = [];
  validateNode(artifact, schema, "", errors);
  return {
    ok: errors.length === 0,
    errors,
    schemaId: schema.$id,
  };
}

export function assertValidEnforcementAdjacentDecisionRecord(artifact) {
  const result = validateEnforcementAdjacentDecisionRecord(artifact);
  if (result.ok) return artifact;

  const err = new Error(
    `enforcement_adjacent_decision_record failed validation: ${result.errors.join("; ")}`
  );
  err.validation = result;
  throw err;
}
