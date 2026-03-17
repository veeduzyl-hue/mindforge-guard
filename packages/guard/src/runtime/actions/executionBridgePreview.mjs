import schema from "./execution_bridge_preview.schema.json" with { type: "json" };

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

function buildReasons(policyPreviewArtifact, permitPrecheckArtifact, bridgeVerdict) {
  if (bridgeVerdict === "deny" || bridgeVerdict === "review") {
    return Array.isArray(permitPrecheckArtifact?.permit_precheck?.reasons)
      ? permitPrecheckArtifact.permit_precheck.reasons
      : [];
  }

  if (bridgeVerdict === "allow") {
    return [
      {
        kind: "preview_allow",
        message: "Execution bridge preview found no blocking policy or permit precheck conditions for this canonical action.",
      },
    ];
  }

  return [
    {
      kind: "preview_unknown",
      message: `Execution bridge preview remained non-blocking because the current policy preview verdict is ${policyPreviewArtifact?.policy_preview?.preview_verdict || "unknown"} and the permit precheck decision is ${permitPrecheckArtifact?.permit_precheck?.decision || "unknown"}.`,
    },
  ];
}

export function buildExecutionBridgePreview({
  canonicalActionArtifact,
  policyPreviewArtifact,
  permitPrecheckArtifact,
}) {
  const policyPreviewVerdict = policyPreviewArtifact?.policy_preview?.preview_verdict || "unknown";
  const permitPrecheckDecision = permitPrecheckArtifact?.permit_precheck?.decision || "unknown";

  let bridgeVerdict = "unknown";
  if (permitPrecheckDecision === "deny") {
    bridgeVerdict = "deny";
  } else if (permitPrecheckDecision === "review") {
    bridgeVerdict = "review";
  } else if (permitPrecheckDecision === "allow" && policyPreviewVerdict === "allow") {
    bridgeVerdict = "allow";
  }

  return {
    kind: "execution_bridge_preview",
    version: "v1",
    canonical_action_hash: canonicalActionArtifact.canonical_action_hash,
    execution_bridge: {
      bridge_verdict: bridgeVerdict,
      policy_preview_verdict: policyPreviewVerdict,
      permit_precheck_decision: permitPrecheckDecision,
      reasons: buildReasons(policyPreviewArtifact, permitPrecheckArtifact, bridgeVerdict),
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateExecutionBridgePreview(artifact) {
  const errors = [];
  validateNode(artifact, schema, "", errors);
  return {
    ok: errors.length === 0,
    errors,
    schemaId: schema.$id,
  };
}

export function assertValidExecutionBridgePreview(artifact) {
  const result = validateExecutionBridgePreview(artifact);
  if (result.ok) return artifact;

  const err = new Error(`execution_bridge_preview failed validation: ${result.errors.join("; ")}`);
  err.validation = result;
  throw err;
}
