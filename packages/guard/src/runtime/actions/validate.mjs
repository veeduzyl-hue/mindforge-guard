import schema from "./canonical.schema.json" with { type: "json" };

import { normalizeActionText } from "./classify.mjs";
import { hashAction } from "./hashAction.mjs";

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

    if (isPlainObject(nodeSchema.additionalProperties)) {
      for (const [key, childValue] of Object.entries(value)) {
        if (!(key in properties)) {
          validateNode(childValue, nodeSchema.additionalProperties, joinPath(path, key), errors);
        }
      }
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

export function validateCanonicalActionArtifact(artifact) {
  const errors = [];
  validateNode(artifact, schema, "", errors);

  if (isPlainObject(artifact)) {
    if (artifact.input?.text !== normalizeActionText(artifact.input?.text)) {
      errors.push("input.text must be normalized");
    }
    if (artifact.action?.canonical_label !== artifact.action?.action_class) {
      errors.push("action.canonical_label must equal action.action_class");
    }
    if (isPlainObject(artifact.action)) {
      const expectedHash = hashAction(artifact.action);
      if (artifact.canonical_action_hash !== expectedHash) {
        errors.push("canonical_action_hash must match the canonicalized action payload");
      }
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    schemaId: schema.$id,
  };
}

export function assertValidCanonicalActionArtifact(artifact) {
  const result = validateCanonicalActionArtifact(artifact);
  if (result.ok) return artifact;

  const err = new Error(`canonical_action artifact failed validation: ${result.errors.join("; ")}`);
  err.validation = result;
  throw err;
}
