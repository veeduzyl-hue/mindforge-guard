import schema from "./execution_readiness.schema.json" with { type: "json" };

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

function buildReasons(executionBridgeArtifact, readiness) {
  if (readiness === "ready") {
    return [
      {
        kind: "readiness_ready",
        message: "Execution bridge preview indicates this canonical action is ready for future enforcement design review.",
      },
    ];
  }

  if (readiness === "not_ready") {
    return Array.isArray(executionBridgeArtifact?.execution_bridge?.reasons)
      ? executionBridgeArtifact.execution_bridge.reasons
      : [];
  }

  return [
    {
      kind: "readiness_unknown",
      message: `Execution readiness remained unknown because the execution bridge verdict is ${executionBridgeArtifact?.execution_bridge?.bridge_verdict || "unknown"}.`,
    },
  ];
}

export function buildExecutionReadinessJudgment({
  canonicalActionArtifact,
  executionBridgeArtifact,
}) {
  const bridgeVerdict = executionBridgeArtifact?.execution_bridge?.bridge_verdict || "unknown";

  let readiness = "unknown";
  if (bridgeVerdict === "allow") {
    readiness = "ready";
  } else if (bridgeVerdict === "review" || bridgeVerdict === "deny") {
    readiness = "not_ready";
  }

  return {
    kind: "execution_readiness_judgment",
    version: "v1",
    canonical_action_hash: canonicalActionArtifact.canonical_action_hash,
    execution_readiness: {
      readiness,
      bridge_verdict: bridgeVerdict,
      reasons: buildReasons(executionBridgeArtifact, readiness),
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateExecutionReadinessJudgment(artifact) {
  const errors = [];
  validateNode(artifact, schema, "", errors);
  return {
    ok: errors.length === 0,
    errors,
    schemaId: schema.$id,
  };
}

export function assertValidExecutionReadinessJudgment(artifact) {
  const result = validateExecutionReadinessJudgment(artifact);
  if (result.ok) return artifact;

  const err = new Error(`execution_readiness_judgment failed validation: ${result.errors.join("; ")}`);
  err.validation = result;
  throw err;
}
