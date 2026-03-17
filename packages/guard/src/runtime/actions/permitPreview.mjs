import schema from "./permit_preview.schema.json" with { type: "json" };

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

export function buildPermitPrecheckPreview({ canonicalActionArtifact, policyPreviewArtifact }) {
  const matchedRules = Array.isArray(policyPreviewArtifact?.policy_preview?.matched_rules)
    ? policyPreviewArtifact.policy_preview.matched_rules
    : [];

  let decision = "unknown";
  if (matchedRules.some((rule) => rule.severity === "hard_block")) {
    decision = "deny";
  } else if (matchedRules.some((rule) => rule.severity === "soft_block")) {
    decision = "review";
  } else if (policyPreviewArtifact?.policy_preview?.preview_verdict === "allow") {
    decision = "allow";
  }

  const reasons =
    decision === "deny" || decision === "review"
      ? matchedRules
          .filter((rule) =>
            decision === "deny" ? rule.severity === "hard_block" : rule.severity === "soft_block"
          )
          .map((rule) => ({
            kind: "policy_rule_match",
            rule_id: rule.rule_id,
            message: rule.message,
          }))
      : decision === "allow"
      ? [
          {
            kind: "preview_allow",
            message: "No blocking policy preview matches were found for this canonical action.",
          },
        ]
      : [
          {
            kind: "preview_unknown",
            message: "Permit precheck preview could not derive a stronger decision from the current policy preview.",
          },
        ];

  return {
    kind: "permit_precheck_preview",
    version: "v1",
    canonical_action_hash: canonicalActionArtifact.canonical_action_hash,
    permit_precheck: {
      decision,
      reasons,
    },
    deterministic: true,
    enforcing: false,
  };
}

export function validatePermitPrecheckPreview(artifact) {
  const errors = [];
  validateNode(artifact, schema, "", errors);
  return {
    ok: errors.length === 0,
    errors,
    schemaId: schema.$id,
  };
}

export function assertValidPermitPrecheckPreview(artifact) {
  const result = validatePermitPrecheckPreview(artifact);
  if (result.ok) return artifact;

  const err = new Error(`permit_precheck_preview failed validation: ${result.errors.join("; ")}`);
  err.validation = result;
  throw err;
}
