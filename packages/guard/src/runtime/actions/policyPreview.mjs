import schema from "./policy_preview.schema.json" with { type: "json" };

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

function readPreviewActionClasses(rule) {
  const classes = rule?.preview_when?.action_classes;
  return Array.isArray(classes) ? classes.filter((value) => typeof value === "string" && value.length > 0) : [];
}

export function buildCanonicalActionPolicyPreview({ canonicalActionArtifact, policy }) {
  const actionClass = canonicalActionArtifact?.action?.action_class || "";
  const matchedRules = (policy?.rules || [])
    .filter((rule) => rule?.enabled === true)
    .filter((rule) => readPreviewActionClasses(rule).includes(actionClass))
    .map((rule) => ({
      rule_id: rule.id,
      severity: rule.severity,
      message: rule.message,
    }));

  const previewVerdict =
    matchedRules.length === 0
      ? "unknown"
      : matchedRules.some((rule) => rule.severity === "hard_block" || rule.severity === "soft_block")
      ? "review"
      : "allow";

  return {
    kind: "canonical_action_policy_preview",
    version: "v1",
    canonical_action_hash: canonicalActionArtifact.canonical_action_hash,
    policy_preview: {
      matched_rules: matchedRules,
      preview_verdict: previewVerdict,
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validateCanonicalActionPolicyPreview(artifact) {
  const errors = [];
  validateNode(artifact, schema, "", errors);
  return {
    ok: errors.length === 0,
    errors,
    schemaId: schema.$id,
  };
}

export function assertValidCanonicalActionPolicyPreview(artifact) {
  const result = validateCanonicalActionPolicyPreview(artifact);
  if (result.ok) return artifact;

  const err = new Error(`canonical_action_policy_preview failed validation: ${result.errors.join("; ")}`);
  err.validation = result;
  throw err;
}
