const EXPECTED_INPUT_KEYS = Object.freeze([
  "adapter_manifests",
  "evidence_package",
  "required_mapping_capabilities",
  "verification_request",
]);

const EXPECTED_ADAPTER_REFERENCE_KEYS = Object.freeze([
  "adapter_id",
  "adapter_version",
]);

const ALLOWED_EVIDENCE_REFERENCE_KEYS = Object.freeze([
  "digest",
  "integrity_ref",
  "package_id",
  "package_version",
]);

const EXPECTED_MANIFEST_KEYS = Object.freeze([
  "adapter_id",
  "declared_limitations",
  "declared_mapping_capability",
  "identity",
  "lifecycle_status",
  "supported_assurance_profiles",
  "supported_source_schema_versions",
]);

const EXPECTED_IDENTITY_KEYS = Object.freeze([
  "adapter_name",
  "adapter_version",
  "source_type",
]);

const EXPECTED_PROFILE_REFERENCE_KEYS = Object.freeze([
  "profile_id",
  "profile_version",
]);

const LIFECYCLE_STATUSES = Object.freeze([
  "deprecated",
  "draft",
  "reference",
  "review_stage",
  "spike",
]);

const EVIDENCE_SOURCE_TYPES = Object.freeze([
  "agent_action_evidence",
  "ci_cd_evidence",
  "evidence_pack",
  "external_verifier_output",
  "policy_decision_artifact",
  "runtime_provenance_record",
  "runtime_receipt",
  "unknown",
]);

const MAPPING_CAPABILITIES = Object.freeze([
  "external_receipt_contract",
  "normalized_evidence_record",
  "report_language",
  "verification_findings",
]);

const LIMITATION_KEYS = Object.freeze([
  "confidential_evidence",
  "issuer_key_available",
  "limitations",
  "raw_payload_available",
  "redacted_evidence",
  "unsupported_algorithm",
  "unsupported_receipt_version",
]);

const LIMITATION_FLAG_KEYS = Object.freeze(
  LIMITATION_KEYS.filter((key) => key !== "limitations")
);

export function buildLocalAdapterManifestSelectionFixture(input) {
  const fixtureInput = expectPlainObject(input, "input");
  assertExactKeys(fixtureInput, EXPECTED_INPUT_KEYS, "input");

  const request = readVerificationRequest(
    fixtureInput.verification_request
  );
  const evidencePackage = readEvidencePackage(fixtureInput.evidence_package);
  const requiredCapabilities = readUniqueEnumStrings(
    fixtureInput.required_mapping_capabilities,
    "required_mapping_capabilities",
    MAPPING_CAPABILITIES
  );
  const manifests = readAdapterManifests(fixtureInput.adapter_manifests);

  assertEvidencePackageBinding(request.evidencePackage, evidencePackage);

  const exactMatches = manifests.filter(
    ({ adapterId, adapterVersion }) =>
      adapterId === request.adapter.adapter_id &&
      adapterVersion === request.adapter.adapter_version
  );

  if (exactMatches.length === 0) {
    throw new TypeError(
      "adapter_manifests must contain one exact adapter ID/version match"
    );
  }
  if (exactMatches.length > 1) {
    throw new TypeError(
      "adapter_manifests must not contain duplicate exact adapter ID/version matches"
    );
  }

  const selected = exactMatches[0];
  assertSelectedManifestCompatibility({
    selected,
    evidencePackage,
    requestedProfiles: request.requestedProfiles,
    requiredCapabilities,
  });

  return {
    selection: {
      selection_mode: "exact_adapter_manifest_pin",
      adapter: cloneValue(request.adapter),
      manifest: cloneValue(selected.manifest),
    },
    fixed_input_compatibility: {
      evidence_package: {
        package_id: evidencePackage.packageId,
        package_version: evidencePackage.packageVersion,
        source_type: evidencePackage.sourceType,
        source_schema_version: evidencePackage.sourceSchemaVersion,
      },
      requested_assurance_profiles: cloneValue(request.requestedProfiles),
      required_mapping_capabilities: cloneValue(requiredCapabilities),
    },
  };
}

function readVerificationRequest(value) {
  const request = expectPlainObject(value, "verification_request");
  expectString(request.request_id, "verification_request.request_id");

  const evidencePackage = expectPlainObject(
    request.evidence_package,
    "verification_request.evidence_package"
  );
  assertAllowedKeys(
    evidencePackage,
    ALLOWED_EVIDENCE_REFERENCE_KEYS,
    "verification_request.evidence_package"
  );

  const adapter = expectPlainObject(
    request.adapter,
    "verification_request.adapter"
  );
  assertExactKeys(
    adapter,
    EXPECTED_ADAPTER_REFERENCE_KEYS,
    "verification_request.adapter"
  );

  return {
    evidencePackage: {
      package_id: expectString(
        evidencePackage.package_id,
        "verification_request.evidence_package.package_id"
      ),
      ...(evidencePackage.package_version !== undefined
        ? {
            package_version: expectString(
              evidencePackage.package_version,
              "verification_request.evidence_package.package_version"
            ),
          }
        : {}),
      ...(evidencePackage.digest !== undefined
        ? {
            digest: expectString(
              evidencePackage.digest,
              "verification_request.evidence_package.digest"
            ),
          }
        : {}),
      ...(evidencePackage.integrity_ref !== undefined
        ? {
            integrity_ref: expectString(
              evidencePackage.integrity_ref,
              "verification_request.evidence_package.integrity_ref"
            ),
          }
        : {}),
    },
    adapter: {
      adapter_id: expectString(
        adapter.adapter_id,
        "verification_request.adapter.adapter_id"
      ),
      adapter_version: expectExactVersion(
        adapter.adapter_version,
        "verification_request.adapter.adapter_version"
      ),
    },
    requestedProfiles: readProfileReferences(
      request.requested_assurance_profiles,
      "verification_request.requested_assurance_profiles"
    ),
  };
}

function readEvidencePackage(value) {
  const evidencePackage = expectPlainObject(value, "evidence_package");
  const producer = expectPlainObject(
    evidencePackage.producer,
    "evidence_package.producer"
  );
  const integrity =
    evidencePackage.integrity === undefined
      ? undefined
      : expectPlainObject(
          evidencePackage.integrity,
          "evidence_package.integrity"
        );

  return {
    packageId: expectString(
      evidencePackage.package_id,
      "evidence_package.package_id"
    ),
    packageVersion: expectFixedString(
      evidencePackage.package_version,
      "evidence_package.package_version",
      "0.1"
    ),
    sourceType: expectEnumString(
      producer.source_type,
      "evidence_package.producer.source_type",
      EVIDENCE_SOURCE_TYPES
    ),
    sourceSchemaVersion: expectExactVersion(
      evidencePackage.source_schema_version,
      "evidence_package.source_schema_version"
    ),
    receivedAt: expectString(
      evidencePackage.received_at,
      "evidence_package.received_at"
    ),
    integrity:
      integrity === undefined
        ? undefined
        : {
            ...(integrity.digest !== undefined
              ? {
                  digest: expectString(
                    integrity.digest,
                    "evidence_package.integrity.digest"
                  ),
                }
              : {}),
            ...(integrity.integrity_ref !== undefined
              ? {
                  integrity_ref: expectString(
                    integrity.integrity_ref,
                    "evidence_package.integrity.integrity_ref"
                  ),
                }
              : {}),
          },
  };
}

function readAdapterManifests(value) {
  const candidates = expectArray(value, "adapter_manifests");
  if (candidates.length === 0) {
    throw new TypeError("adapter_manifests must not be empty");
  }
  return candidates.map((candidate, index) =>
    readAdapterManifest(candidate, `adapter_manifests[${index}]`)
  );
}

function readAdapterManifest(value, label) {
  const manifest = expectPlainObject(value, label);
  assertExactKeys(manifest, EXPECTED_MANIFEST_KEYS, label);

  const identity = expectPlainObject(manifest.identity, `${label}.identity`);
  assertExactKeys(identity, EXPECTED_IDENTITY_KEYS, `${label}.identity`);

  const mappingCapability = expectPlainObject(
    manifest.declared_mapping_capability,
    `${label}.declared_mapping_capability`
  );
  assertAllowedKeys(
    mappingCapability,
    MAPPING_CAPABILITIES,
    `${label}.declared_mapping_capability`
  );
  for (const [key, entry] of Object.entries(mappingCapability)) {
    expectBoolean(entry, `${label}.declared_mapping_capability.${key}`);
  }

  const limitations = expectPlainObject(
    manifest.declared_limitations,
    `${label}.declared_limitations`
  );
  assertAllowedKeys(
    limitations,
    LIMITATION_KEYS,
    `${label}.declared_limitations`
  );
  for (const key of LIMITATION_FLAG_KEYS) {
    if (limitations[key] !== undefined) {
      expectBoolean(limitations[key], `${label}.declared_limitations.${key}`);
    }
  }
  readStrings(
    limitations.limitations,
    `${label}.declared_limitations.limitations`
  );

  const adapterId = expectString(manifest.adapter_id, `${label}.adapter_id`);
  const adapterVersion = expectExactVersion(
    identity.adapter_version,
    `${label}.identity.adapter_version`
  );

  return {
    adapterId,
    adapterVersion,
    sourceType: expectEnumString(
      identity.source_type,
      `${label}.identity.source_type`,
      EVIDENCE_SOURCE_TYPES
    ),
    sourceSchemaVersions: readUniqueExactVersions(
      manifest.supported_source_schema_versions,
      `${label}.supported_source_schema_versions`
    ),
    supportedProfiles: readProfileReferences(
      manifest.supported_assurance_profiles,
      `${label}.supported_assurance_profiles`
    ),
    mappingCapability,
    manifest: cloneValue(manifest),
    lifecycleStatus: expectEnumString(
      manifest.lifecycle_status,
      `${label}.lifecycle_status`,
      LIFECYCLE_STATUSES
    ),
    adapterName: expectString(
      identity.adapter_name,
      `${label}.identity.adapter_name`
    ),
  };
}

function readProfileReferences(value, label) {
  const profiles = expectArray(value, label);
  const profileKeys = new Set();
  return profiles.map((entry, index) => {
    const entryLabel = `${label}[${index}]`;
    const profile = expectPlainObject(entry, entryLabel);
    assertExactKeys(profile, EXPECTED_PROFILE_REFERENCE_KEYS, entryLabel);
    const normalized = {
      profile_id: expectString(profile.profile_id, `${entryLabel}.profile_id`),
      profile_version: expectExactVersion(
        profile.profile_version,
        `${entryLabel}.profile_version`
      ),
    };
    const key = `${normalized.profile_id}\u0000${normalized.profile_version}`;
    if (profileKeys.has(key)) {
      throw new TypeError(`${label} must not contain duplicate profiles`);
    }
    profileKeys.add(key);
    return normalized;
  });
}

function assertEvidencePackageBinding(reference, evidencePackage) {
  assertEqual(
    reference.package_id,
    evidencePackage.packageId,
    "verification_request evidence package ID must match evidence_package.package_id"
  );
  if (reference.package_version !== undefined) {
    assertEqual(
      reference.package_version,
      evidencePackage.packageVersion,
      "verification_request evidence package version must match evidence_package.package_version"
    );
  }
  for (const fieldName of ["digest", "integrity_ref"]) {
    if (reference[fieldName] !== undefined) {
      if (evidencePackage.integrity === undefined) {
        throw new TypeError(
          `evidence_package.integrity is required for ${fieldName} binding`
        );
      }
      assertEqual(
        reference[fieldName],
        evidencePackage.integrity[fieldName],
        `verification_request evidence package ${fieldName} must match evidence_package.integrity.${fieldName}`
      );
    }
  }
}

function assertSelectedManifestCompatibility({
  selected,
  evidencePackage,
  requestedProfiles,
  requiredCapabilities,
}) {
  assertEqual(
    selected.sourceType,
    evidencePackage.sourceType,
    "selected manifest source type must match evidence package source type"
  );
  if (!selected.sourceSchemaVersions.includes(evidencePackage.sourceSchemaVersion)) {
    throw new TypeError(
      "selected manifest must explicitly support the evidence package source schema version"
    );
  }

  const supportedProfileKeys = new Set(
    selected.supportedProfiles.map(
      ({ profile_id, profile_version }) =>
        `${profile_id}\u0000${profile_version}`
    )
  );
  for (const { profile_id, profile_version } of requestedProfiles) {
    if (!supportedProfileKeys.has(`${profile_id}\u0000${profile_version}`)) {
      throw new TypeError(
        "selected manifest must explicitly support every requested assurance profile"
      );
    }
  }

  for (const capability of requiredCapabilities) {
    if (selected.mappingCapability[capability] !== true) {
      throw new TypeError(
        `selected manifest must declare required mapping capability: ${capability}`
      );
    }
  }
}

function readUniqueEnumStrings(value, label, allowedValues) {
  const entries = readUniqueStrings(value, label);
  for (const [index, entry] of entries.entries()) {
    expectEnumString(entry, `${label}[${index}]`, allowedValues);
  }
  return entries;
}

function readUniqueStrings(value, label) {
  const entries = readStrings(value, label);
  if (new Set(entries).size !== entries.length) {
    throw new TypeError(`${label} must not contain duplicates`);
  }
  return entries;
}

function readUniqueExactVersions(value, label) {
  const entries = expectArray(value, label).map((entry, index) =>
    expectExactVersion(entry, `${label}[${index}]`)
  );
  if (new Set(entries).size !== entries.length) {
    throw new TypeError(`${label} must not contain duplicates`);
  }
  return entries;
}

function readStrings(value, label) {
  return expectArray(value, label).map((entry, index) =>
    expectString(entry, `${label}[${index}]`)
  );
}

function assertExactKeys(value, expectedKeys, label) {
  const actual = Object.keys(value).sort();
  const expected = [...expectedKeys].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new TypeError(`${label} must contain exactly: ${expected.join(", ")}`);
  }
}

function assertAllowedKeys(value, allowedKeys, label) {
  for (const key of Object.keys(value)) {
    if (!allowedKeys.includes(key)) {
      throw new TypeError(`${label} must not include unknown field: ${key}`);
    }
  }
}

function expectPlainObject(value, label) {
  if (!isPlainObject(value)) {
    throw new TypeError(`${label} must be a plain object`);
  }
  return value;
}

function expectArray(value, label) {
  if (!Array.isArray(value)) {
    throw new TypeError(`${label} must be an array`);
  }
  return value;
}

function expectString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError(`${label} must be a non-empty string`);
  }
  return value;
}

function expectExactVersion(value, label) {
  const actual = expectString(value, label);
  const normalized = actual.trim();
  const isIntervalRange =
    (normalized.startsWith("[") || normalized.startsWith("(")) &&
    (normalized.endsWith("]") || normalized.endsWith(")")) &&
    normalized.includes(",");
  if (
    /^(?:default|latest|preferred)$/i.test(normalized) ||
    normalized.includes("*") ||
    /(?:^|[^a-z0-9])x(?:$|[^a-z0-9])/i.test(normalized) ||
    /^[<>=~^]/.test(normalized) ||
    normalized.includes("||") ||
    /\s+-\s+/.test(normalized) ||
    isIntervalRange
  ) {
    throw new TypeError(`${label} must be an exact version`);
  }
  return actual;
}

function expectBoolean(value, label) {
  if (typeof value !== "boolean") {
    throw new TypeError(`${label} must be a boolean`);
  }
  return value;
}

function expectEnumString(value, label, allowedValues) {
  const actual = expectString(value, label);
  if (!allowedValues.includes(actual)) {
    throw new TypeError(`${label} must be one of: ${allowedValues.join(", ")}`);
  }
  return actual;
}

function expectFixedString(value, label, expected) {
  const actual = expectString(value, label);
  if (actual !== expected) {
    throw new TypeError(`${label} must be ${expected}`);
  }
  return actual;
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new TypeError(message);
  }
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function cloneValue(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => cloneValue(entry));
  }
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, cloneValue(entry)])
    );
  }
  return value;
}
