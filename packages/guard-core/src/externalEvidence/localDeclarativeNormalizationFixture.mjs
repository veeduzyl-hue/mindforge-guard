const NORMALIZED_RECORD_VERSION = "0.1";
const MANIFEST_VERSION = "0.1";
const SUPPORTED_SOURCE_TYPES = new Set([
  "runtime_receipt",
  "evidence_pack",
  "ci_cd_evidence",
  "agent_action_evidence",
  "policy_decision_artifact",
  "external_verifier_output",
  "runtime_provenance_record",
  "unknown",
]);
const SUPPORTED_TRUST_STATUSES = new Set(["known", "unknown", "not_checked"]);
const SUPPORTED_COMPLETENESS_STATUSES = new Set([
  "complete",
  "incomplete",
  "partial",
  "redacted",
  "confidential_labeled",
  "unknown",
]);
const FORBIDDEN_SEGMENTS = new Set(["__proto__", "prototype", "constructor"]);
const SOURCE_DECLARED_VALUE_LIMITATION =
  "Source-declared identity and integrity values were copied into a normalized structure and were not independently verified.";

const TARGET_SPECS = {
  "source.source_system": {
    expected_type: "string",
    assign(record, value) {
      record.source.source_system = value;
    },
  },
  "source.issuer": {
    expected_type: "string",
    required: true,
    assign(record, value) {
      record.source.issuer = value;
    },
  },
  "source.issuer_key_ref": {
    expected_type: "string",
    assign(record, value) {
      record.source.issuer_key_ref = value;
    },
  },
  "receipt.receipt_id": {
    expected_type: "string",
    required: true,
    assign(record, value) {
      record.receipt.receipt_id = value;
    },
  },
  "receipt.raw_receipt_ref": {
    expected_type: "string",
    assign(record, value) {
      record.receipt.raw_receipt_ref = value;
    },
  },
  "subject.subject": {
    expected_type: "string",
    required: true,
    assign(record, value) {
      record.subject.subject = value;
    },
  },
  "verification.integrity.payload_hash": {
    expected_type: "string",
    required: true,
    assign(record, value) {
      record.verification.integrity.payload_hash = value;
    },
  },
  "verification.integrity.hash_algorithm": {
    expected_type: "string",
    assign(record, value) {
      record.verification.integrity.hash_algorithm = value;
    },
  },
  "verification.integrity.raw_payload_available": {
    expected_type: "boolean",
    assign(record, value) {
      record.verification.integrity.raw_payload_available = value;
    },
  },
  "evidence.evidence_refs": {
    expected_type: "string_array",
    required: true,
    assign(record, value) {
      record.evidence.evidence_refs = value;
    },
  },
  "evidence.raw_payload_ref": {
    expected_type: "string",
    assign(record, value) {
      record.evidence.raw_payload_ref = value;
    },
  },
  "evidence.external_report_uri": {
    expected_type: "string",
    assign(record, value) {
      record.evidence.external_report_uri = value;
    },
  },
};
const REQUIRED_TARGETS = [
  "source.issuer",
  "receipt.receipt_id",
  "subject.subject",
  "verification.integrity.payload_hash",
  "evidence.evidence_refs",
];
const OPTIONAL_TARGETS = Object.keys(TARGET_SPECS).filter(
  (target) => !REQUIRED_TARGETS.includes(target)
);

const REQUIRED_DECLARED_FIELDS = new Set([
  "record_id",
  "generated_at",
  "adapter_name",
  "adapter_version",
  "trust_status",
  "completeness_status",
]);

const DECLARED_FIELD_SPECS = {
  record_id: {
    read(value) {
      return expectString(value, "mapping_manifest.declared_fields.record_id");
    },
  },
  generated_at: {
    read(value) {
      return expectString(
        value,
        "mapping_manifest.declared_fields.generated_at"
      );
    },
  },
  adapter_name: {
    read(value) {
      return expectString(
        value,
        "mapping_manifest.declared_fields.adapter_name"
      );
    },
  },
  adapter_version: {
    read(value) {
      return expectString(
        value,
        "mapping_manifest.declared_fields.adapter_version"
      );
    },
  },
  trust_status: {
    read(value) {
      return expectEnumString(
        value,
        "mapping_manifest.declared_fields.trust_status",
        SUPPORTED_TRUST_STATUSES
      );
    },
  },
  receipt_version: {
    read(value) {
      return expectOptionalString(
        value,
        "mapping_manifest.declared_fields.receipt_version"
      );
    },
  },
  subject_type: {
    read(value) {
      return expectOptionalString(
        value,
        "mapping_manifest.declared_fields.subject_type"
      );
    },
  },
  action_summary: {
    read(value) {
      return expectOptionalString(
        value,
        "mapping_manifest.declared_fields.action_summary"
      );
    },
  },
  completeness_status: {
    read(value) {
      return expectEnumString(
        value,
        "mapping_manifest.declared_fields.completeness_status",
        SUPPORTED_COMPLETENESS_STATUSES
      );
    },
  },
};

export function normalizeLocalExternalEvidence(input) {
  const normalizationInput = expectPlainObject(input, "input");
  validateJsonCompatibleValue(
    normalizationInput.raw_evidence,
    "raw_evidence",
    new Set()
  );
  validateJsonCompatibleValue(
    normalizationInput.mapping_manifest,
    "mapping_manifest",
    new Set()
  );

  const rawEvidence = expectPlainObject(
    normalizationInput.raw_evidence,
    "raw_evidence"
  );
  const manifest = normalizeManifest(normalizationInput.mapping_manifest);
  const normalizationFindings = [];
  const mappedValues = {};

  for (const [target, sourcePath] of Object.entries(manifest.field_paths)) {
    const sourceValue = readOwnDataPath(rawEvidence, sourcePath);

    if (sourceValue.kind === "missing") {
      normalizationFindings.push(
        createNormalizationFinding(
          manifest,
          normalizationFindings.length,
          "missing_source_field",
          target,
          sourcePath,
          `source path is missing for normalized target ${target}`
        )
      );
      continue;
    }

    if (sourceValue.kind === "unsupported") {
      normalizationFindings.push(
        createNormalizationFinding(
          manifest,
          normalizationFindings.length,
          "unsupported_source_path",
          target,
          sourcePath,
          `source path is unsupported for normalized target ${target}`
        )
      );
      continue;
    }

    const targetValue = expectTargetValue(target, sourceValue.value);
    if (!targetValue.ok) {
      normalizationFindings.push(
        createNormalizationFinding(
          manifest,
          normalizationFindings.length,
          "invalid_source_value",
          target,
          sourcePath,
          targetValue.message
        )
      );
      continue;
    }

    mappedValues[target] = cloneJsonValue(sourceValue.value);
  }

  const missingRequiredFields = REQUIRED_TARGETS.filter(
    (target) => !(target in mappedValues)
  );
  const rawPayloadAvailable =
    mappedValues["verification.integrity.raw_payload_available"];
  const limitations = {
    ...(typeof rawPayloadAvailable === "boolean"
      ? { raw_payload_available: rawPayloadAvailable }
      : {}),
    limitations: collectLimitations(manifest.limitations),
  };
  const normalizedRecord = {
    record: {
      record_id: manifest.declared_fields.record_id,
      record_version: NORMALIZED_RECORD_VERSION,
      generated_at: manifest.declared_fields.generated_at,
    },
    adapter: {
      adapter_name: manifest.declared_fields.adapter_name,
      adapter_version: manifest.declared_fields.adapter_version,
      source_type: manifest.source_type,
      limitations,
    },
    source: {
      source_type: manifest.source_type,
      trust_status: manifest.declared_fields.trust_status,
    },
    receipt: {
      ...(manifest.declared_fields.receipt_version !== undefined
        ? { receipt_version: manifest.declared_fields.receipt_version }
        : {}),
    },
    subject: {
      ...(manifest.declared_fields.subject_type !== undefined
        ? { subject_type: manifest.declared_fields.subject_type }
        : {}),
      ...(manifest.declared_fields.action_summary !== undefined
        ? { action_summary: manifest.declared_fields.action_summary }
        : {}),
    },
    verification: {
      status: "verification_not_performed",
      integrity: {
        payload_hash_status:
          "verification.integrity.payload_hash" in mappedValues
            ? "not_checked"
            : "unavailable",
      },
      diagnostics: [],
    },
    contract_validation: {
      status:
        missingRequiredFields.length === 0
          ? "contract_parseable"
          : missingRequiredFields.length ===
              Object.values(TARGET_SPECS).filter((spec) => spec.required).length
            ? "contract_not_parseable"
            : "contract_partially_parseable",
      required_fields_present: missingRequiredFields.length === 0,
      missing_required_fields: missingRequiredFields,
      diagnostics: [],
    },
    evidence: {
      completeness_status: manifest.declared_fields.completeness_status,
    },
    diagnostics: [],
    findings: [],
  };

  for (const [target, value] of Object.entries(mappedValues)) {
    TARGET_SPECS[target].assign(normalizedRecord, value);
  }

  return {
    normalized_record: normalizedRecord,
    normalization_findings: normalizationFindings,
    source_reference: {
      manifest_id: manifest.manifest_id,
      manifest_version: manifest.manifest_version,
      producer_id: manifest.producer_id,
      source_type: manifest.source_type,
      source_schema_version: manifest.source_schema_version,
      normalized_contract_version: manifest.normalized_contract_version,
    },
    declared_limitations: collectLimitations(manifest.limitations),
  };
}

function normalizeManifest(value) {
  const manifest = expectPlainObject(value, "mapping_manifest");
  const manifestKeys = Object.keys(manifest).sort().join(",");
  const expectedKeys = [
    "declared_fields",
    "field_paths",
    "limitations",
    "manifest_id",
    "manifest_version",
    "normalized_contract_version",
    "optional_targets",
    "producer_id",
    "required_targets",
    "source_schema_version",
    "source_type",
  ].join(",");

  if (manifestKeys !== expectedKeys) {
    throw new TypeError(
      "mapping_manifest must contain only manifest_id, manifest_version, producer_id, source_type, source_schema_version, normalized_contract_version, declared_fields, field_paths, required_targets, optional_targets, and limitations"
    );
  }

  const declaredFields = expectPlainObject(
    manifest.declared_fields,
    "mapping_manifest.declared_fields"
  );
  const fieldPaths = expectPlainObject(
    manifest.field_paths,
    "mapping_manifest.field_paths"
  );
  const requiredTargets = normalizeTargetList(
    manifest.required_targets,
    "mapping_manifest.required_targets"
  );
  const optionalTargets = normalizeTargetList(
    manifest.optional_targets,
    "mapping_manifest.optional_targets"
  );
  const normalizedDeclaredFields = {};

  for (const requiredField of REQUIRED_DECLARED_FIELDS) {
    if (!(requiredField in declaredFields)) {
      throw new TypeError(
        `mapping_manifest.declared_fields.${requiredField} is required`
      );
    }
  }

  for (const key of Object.keys(declaredFields)) {
    const spec = DECLARED_FIELD_SPECS[key];
    if (!spec) {
      throw new TypeError(
        `mapping_manifest.declared_fields.${key} is not supported`
      );
    }

    const normalizedValue = spec.read(declaredFields[key]);
    if (normalizedValue !== undefined) {
      normalizedDeclaredFields[key] = normalizedValue;
    }
  }

  const normalizedFieldPaths = {};

  for (const target of Object.keys(fieldPaths)) {
    if (!(target in TARGET_SPECS)) {
      throw new TypeError(`unsupported target field in mapping_manifest: ${target}`);
    }

    normalizedFieldPaths[target] = normalizeSourcePath(
      fieldPaths[target],
      `mapping_manifest.field_paths.${target}`
    );
  }

  if (Object.keys(normalizedFieldPaths).length === 0) {
    throw new TypeError("mapping_manifest.field_paths must declare at least one target");
  }

  validateManifestTargetPartition(requiredTargets, optionalTargets, normalizedFieldPaths);

  return {
    manifest_id: expectString(manifest.manifest_id, "mapping_manifest.manifest_id"),
    manifest_version: expectFixedString(
      manifest.manifest_version,
      "mapping_manifest.manifest_version",
      MANIFEST_VERSION
    ),
    producer_id: expectString(manifest.producer_id, "mapping_manifest.producer_id"),
    source_type: expectEnumString(
      manifest.source_type,
      "mapping_manifest.source_type",
      SUPPORTED_SOURCE_TYPES
    ),
    source_schema_version: expectString(
      manifest.source_schema_version,
      "mapping_manifest.source_schema_version"
    ),
    normalized_contract_version: expectFixedString(
      manifest.normalized_contract_version,
      "mapping_manifest.normalized_contract_version",
      NORMALIZED_RECORD_VERSION
    ),
    declared_fields: normalizedDeclaredFields,
    field_paths: normalizedFieldPaths,
    required_targets: requiredTargets,
    optional_targets: optionalTargets,
    limitations: expectStringArray(
      manifest.limitations,
      "mapping_manifest.limitations"
    ),
  };
}

function normalizeTargetList(value, label) {
  if (!Array.isArray(value)) {
    throw new TypeError(`${label} must be an array`);
  }

  return value.map((entry, index) => {
    if (typeof entry !== "string" || entry.trim() === "") {
      throw new TypeError(`${label}[${index}] must be a non-empty string`);
    }

    if (!(entry in TARGET_SPECS)) {
      throw new TypeError(`${label}[${index}] is not a supported target`);
    }

    return entry;
  });
}

function validateManifestTargetPartition(requiredTargets, optionalTargets, fieldPaths) {
  const requiredSet = new Set(requiredTargets);
  const optionalSet = new Set(optionalTargets);

  if (requiredSet.size !== requiredTargets.length) {
    throw new TypeError("mapping_manifest.required_targets must not contain duplicates");
  }

  if (optionalSet.size !== optionalTargets.length) {
    throw new TypeError("mapping_manifest.optional_targets must not contain duplicates");
  }

  for (const target of requiredSet) {
    if (optionalSet.has(target)) {
      throw new TypeError(`mapping_manifest target ${target} must not be both required and optional`);
    }
  }

  for (const target of REQUIRED_TARGETS) {
    if (!requiredSet.has(target)) {
      throw new TypeError(`mapping_manifest.required_targets must include ${target}`);
    }

    if (!(target in fieldPaths)) {
      throw new TypeError(`mapping_manifest.field_paths must declare required target ${target}`);
    }
  }

  for (const target of requiredSet) {
    if (!REQUIRED_TARGETS.includes(target)) {
      throw new TypeError(`mapping_manifest.required_targets must not include optional target ${target}`);
    }
  }

  for (const target of optionalSet) {
    if (REQUIRED_TARGETS.includes(target)) {
      throw new TypeError(`mapping_manifest.optional_targets must not include required target ${target}`);
    }

    if (!(target in fieldPaths)) {
      throw new TypeError(`mapping_manifest.field_paths must declare optional target ${target}`);
    }
  }

  const declaredTargets = [...requiredSet, ...optionalSet].sort().join(",");
  const mappedTargets = Object.keys(fieldPaths).sort().join(",");
  if (declaredTargets !== mappedTargets) {
    throw new TypeError(
      "mapping_manifest.required_targets and optional_targets must exactly cover field_paths"
    );
  }
}

function normalizeSourcePath(value, label) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new TypeError(`${label} must be a non-empty string segment array`);
  }

  return value.map((segment, index) => {
    if (typeof segment !== "string" || segment.length === 0) {
      throw new TypeError(`${label}[${index}] must be a non-empty string`);
    }

    if (FORBIDDEN_SEGMENTS.has(segment)) {
      throw new TypeError(`${label}[${index}] uses a forbidden source path segment`);
    }

    if (/^\d+$/.test(segment)) {
      throw new TypeError(`${label}[${index}] must not use an array index segment`);
    }

    if (segment.includes("*") || segment.includes("[") || segment.includes("]")) {
      throw new TypeError(`${label}[${index}] must not use wildcard or bracket notation`);
    }

    return segment;
  });
}

function readOwnDataPath(root, segments) {
  let current = root;

  for (let index = 0; index < segments.length; index += 1) {
    if (!isPlainObject(current)) {
      return { kind: "missing" };
    }

    const descriptor = Object.getOwnPropertyDescriptor(current, segments[index]);
    if (!descriptor || !descriptor.enumerable) {
      return { kind: "missing" };
    }

    if (
      typeof descriptor.get === "function" ||
      typeof descriptor.set === "function"
    ) {
      return { kind: "unsupported" };
    }

    current = descriptor.value;

    if (index < segments.length - 1 && Array.isArray(current)) {
      return { kind: "unsupported" };
    }
  }

  return { kind: "value", value: current };
}

function expectTargetValue(target, value) {
  const expectedType = TARGET_SPECS[target].expected_type;

  if (expectedType === "string") {
    if (typeof value !== "string" || value.trim() === "") {
      return {
        ok: false,
        message: `normalized target ${target} requires a non-empty string value`,
      };
    }

    return { ok: true };
  }

  if (expectedType === "boolean") {
    if (typeof value !== "boolean") {
      return {
        ok: false,
        message: `normalized target ${target} requires a boolean value`,
      };
    }

    return { ok: true };
  }

  if (expectedType === "string_array") {
    if (!Array.isArray(value)) {
      return {
        ok: false,
        message: `normalized target ${target} requires an array of non-empty strings`,
      };
    }

    for (let index = 0; index < value.length; index += 1) {
      if (typeof value[index] !== "string" || value[index].trim() === "") {
        return {
          ok: false,
          message: `normalized target ${target} requires an array of non-empty strings`,
        };
      }
    }

    return { ok: true };
  }

  throw new TypeError(`unsupported target value contract for ${target}`);
}

function createNormalizationFinding(
  manifest,
  findingIndex,
  findingType,
  field,
  sourcePath,
  message
) {
  return {
    finding_id: `${manifest.manifest_id}:normalization:${findingIndex + 1}`,
    finding_type: findingType,
    field,
    source_path: sourcePath.slice(),
    message,
  };
}

function validateJsonCompatibleValue(value, label, ancestors) {
  if (value === null) {
    return;
  }

  switch (typeof value) {
    case "string":
      return;
    case "boolean":
      return;
    case "number":
      if (!Number.isFinite(value)) {
        throw new TypeError(`${label} must not contain a non-finite number`);
      }
      return;
    case "undefined":
      throw new TypeError(`${label} must not contain undefined`);
    case "function":
      throw new TypeError(`${label} must not contain a function`);
    case "symbol":
      throw new TypeError(`${label} must not contain a symbol`);
    case "bigint":
      throw new TypeError(`${label} must not contain a bigint`);
    case "object":
      break;
    default:
      throw new TypeError(`${label} must be JSON-compatible`);
  }

  if (ancestors.has(value)) {
    throw new TypeError(`${label} must not contain a cyclic reference`);
  }

  if (ArrayBuffer.isView(value)) {
    throw new TypeError(`${label} must not contain a typed array`);
  }

  ancestors.add(value);

  try {
    if (Array.isArray(value)) {
      validateJsonCompatibleArray(value, label, ancestors);
      return;
    }

    validateJsonCompatibleObject(value, label, ancestors);
  } finally {
    ancestors.delete(value);
  }
}

function validateJsonCompatibleArray(value, label, ancestors) {
  const symbolKeys = Object.getOwnPropertySymbols(value);
  if (symbolKeys.length > 0) {
    throw new TypeError(`${label} must not contain symbol-keyed properties`);
  }

  const descriptors = Object.getOwnPropertyDescriptors(value);
  if ("toJSON" in descriptors) {
    throw new TypeError(`${label} must not contain an own toJSON property`);
  }

  for (let index = 0; index < value.length; index += 1) {
    if (!Object.prototype.hasOwnProperty.call(value, index)) {
      throw new TypeError(`${label}[${index}] must not be an array hole`);
    }

    const descriptor = descriptors[String(index)];
    if (
      typeof descriptor.get === "function" ||
      typeof descriptor.set === "function"
    ) {
      throw new TypeError(`${label}[${index}] must not be an accessor property`);
    }

    validateJsonCompatibleValue(value[index], `${label}[${index}]`, ancestors);
  }

  for (const [key, descriptor] of Object.entries(descriptors)) {
    if (key === "length" || /^\d+$/.test(key)) {
      continue;
    }

    if (
      typeof descriptor.get === "function" ||
      typeof descriptor.set === "function"
    ) {
      throw new TypeError(`${label}.${key} must not be an accessor property`);
    }

    if (!descriptor.enumerable) {
      throw new TypeError(`${label}.${key} must be enumerable`);
    }

    validateJsonCompatibleValue(descriptor.value, `${label}.${key}`, ancestors);
  }
}

function validateJsonCompatibleObject(value, label, ancestors) {
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new TypeError(`${label} must be a plain object`);
  }

  const symbolKeys = Object.getOwnPropertySymbols(value);
  if (symbolKeys.length > 0) {
    throw new TypeError(`${label} must not contain symbol-keyed properties`);
  }

  const descriptors = Object.getOwnPropertyDescriptors(value);
  if ("toJSON" in descriptors) {
    throw new TypeError(`${label} must not contain an own toJSON property`);
  }

  for (const [key, descriptor] of Object.entries(descriptors)) {
    if (
      typeof descriptor.get === "function" ||
      typeof descriptor.set === "function"
    ) {
      throw new TypeError(`${label}.${key} must not be an accessor property`);
    }

    if (!descriptor.enumerable) {
      throw new TypeError(`${label}.${key} must be enumerable`);
    }

    if (descriptor.value === undefined) {
      throw new TypeError(`${label}.${key} must not be undefined`);
    }

    validateJsonCompatibleValue(descriptor.value, `${label}.${key}`, ancestors);
  }
}

function cloneJsonValue(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => cloneJsonValue(entry));
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, cloneJsonValue(entry)])
    );
  }

  return value;
}

function cloneStringArray(values) {
  return values.slice();
}

function collectLimitations(values) {
  const limitations = cloneStringArray(values);
  if (!limitations.includes(SOURCE_DECLARED_VALUE_LIMITATION)) {
    limitations.push(SOURCE_DECLARED_VALUE_LIMITATION);
  }

  return limitations;
}

function expectPlainObject(value, label) {
  if (!isPlainObject(value)) {
    throw new TypeError(`${label} must be a plain object`);
  }

  return value;
}

function isPlainObject(value) {
  const prototype = Object.getPrototypeOf(value);

  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    (prototype === Object.prototype || prototype === null)
  );
}

function expectString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError(`${label} must be a non-empty string`);
  }

  return value;
}

function expectOptionalString(value, label) {
  if (value === undefined) {
    return undefined;
  }

  return expectString(value, label);
}

function expectFixedString(value, label, expected) {
  const actual = expectString(value, label);
  if (actual !== expected) {
    throw new TypeError(`${label} must be ${expected}`);
  }

  return actual;
}

function expectEnumString(value, label, allowedValues) {
  const actual = expectString(value, label);
  if (!allowedValues.has(actual)) {
    throw new TypeError(
      `${label} must be one of: ${Array.from(allowedValues).join(", ")}`
    );
  }

  return actual;
}

function expectStringArray(value, label) {
  if (!Array.isArray(value)) {
    throw new TypeError(`${label} must be an array`);
  }

  return value.map((entry, index) =>
    expectString(entry, `${label}[${index}]`)
  );
}
