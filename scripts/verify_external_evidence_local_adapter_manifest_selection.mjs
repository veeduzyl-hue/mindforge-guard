import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildLocalAdapterManifestSelectionFixture } from "../packages/guard-core/src/externalEvidence/localAdapterManifestSelectionFixture.mjs";
import {
  createLocalAdapterManifestSelectionFixtureInput,
  createLocalAdapterManifestSelectionFixtureSamples,
} from "./fixtures/local_external_evidence_adapter_manifest_selection.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const fixtureModulePath = path.join(
  repoRoot,
  "packages/guard-core/src/externalEvidence/localAdapterManifestSelectionFixture.mjs"
);
const samplesModulePath = path.join(
  repoRoot,
  "scripts/fixtures/local_external_evidence_adapter_manifest_selection.mjs"
);
const verifierModulePath = path.join(
  repoRoot,
  "scripts/verify_external_evidence_local_adapter_manifest_selection.mjs"
);
const packageJsonPath = path.join(repoRoot, "package.json");
const guardCoreIndexPath = path.join(repoRoot, "packages/guard-core/src/index.ts");
const verificationTypesPath = path.join(
  repoRoot,
  "packages/guard-core/src/externalEvidence/verificationTypes.ts"
);
const registryTypesPath = path.join(
  repoRoot,
  "packages/guard-core/src/externalEvidence/registryTypes.ts"
);

verifyRepositoryBoundaries();
verifyPositiveSelection();
verifyOpaqueExactVersionAcceptance();
verifyLifecycleAndLimitationBoundaries();
verifyOrderIndependence();
verifyDeterminismAndImmutability();
verifyNegativeCases();

console.log("external evidence local adapter manifest selection verified");

function verifyRepositoryBoundaries() {
  for (const requiredPath of [
    fixtureModulePath,
    samplesModulePath,
    verifierModulePath,
  ]) {
    assert.equal(
      fs.existsSync(requiredPath),
      true,
      `required adapter selection file must exist: ${normalizePath(
        path.relative(repoRoot, requiredPath)
      )}`
    );
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const focusedCommand =
    "node scripts/verify_external_evidence_local_adapter_manifest_selection.mjs";
  assert.equal(
    packageJson.scripts[
      "verify:external-evidence:local-adapter-manifest-selection"
    ],
    focusedCommand,
    "package.json must expose the focused adapter selection verifier"
  );
  assert.equal(
    packageJson.scripts.verify.includes(
      "verify:external-evidence:local-adapter-manifest-selection"
    ),
    false,
    "aggregate verify must not invoke the adapter selection verifier"
  );
  assert.equal(
    packageJson.scripts.verify.includes(
      "verify_external_evidence_local_adapter_manifest_selection.mjs"
    ),
    false,
    "aggregate verify must not invoke the focused file directly"
  );

  const fixtureSource = fs.readFileSync(fixtureModulePath, "utf8");
  const samplesSource = fs.readFileSync(samplesModulePath, "utf8");
  const indexSource = fs.readFileSync(guardCoreIndexPath, "utf8");
  const verificationTypesSource = fs.readFileSync(
    verificationTypesPath,
    "utf8"
  );
  const registryTypesSource = fs.readFileSync(registryTypesPath, "utf8");

  assert.doesNotMatch(
    fixtureSource,
    /^\s*import\s/m,
    "package fixture must not import upstream fixtures or other modules"
  );
  assert.deepStrictEqual(
    collectStringReferences(
      path.join(repoRoot, "packages"),
      "localAdapterManifestSelectionFixture",
      fixtureModulePath
    ),
    [],
    "adapter selection fixture must have no package consumers"
  );
  assert.equal(
    indexSource.includes("localAdapterManifestSelectionFixture"),
    false,
    "adapter selection fixture must not be exported from guard-core index"
  );
  assert.equal(
    indexSource.includes("buildLocalAdapterManifestSelectionFixture"),
    false,
    "adapter selection builder must not be publicly exported"
  );

  assert.match(
    verificationTypesSource,
    /export interface AdapterManifest\s*\{/,
    "existing AdapterManifest must remain the canonical manifest contract"
  );
  assert.match(
    verificationTypesSource,
    /export interface AdapterManifestReference\s*\{/,
    "existing AdapterManifestReference must remain the canonical pin"
  );
  assert.doesNotMatch(
    verificationTypesSource,
    /export\s+(?:interface|type)\s+AdapterManifestSelection\b/,
    "no new selection type may be introduced"
  );
  for (const lifecycleStatus of [
    "draft",
    "spike",
    "review_stage",
    "reference",
    "deprecated",
  ]) {
    assert.equal(
      registryTypesSource.includes(`| "${lifecycleStatus}"`),
      true,
      `registry lifecycle status must remain available: ${lifecycleStatus}`
    );
  }

  for (const forbiddenPattern of [
    /node:fs/,
    /node:http/,
    /node:https/,
    /fetch\s*\(/,
    /process\./,
    /Date\.now/,
    /Math\.random/,
    /randomUUID/,
    /globalThis/,
    /import\s*\(/,
    /module_path/,
    /executable_factory/,
    /adapter_execute/,
    /runtime_registry/,
    /database/i,
    /persistence/i,
    /cache/i,
    /queue/i,
    /worker/i,
    /scheduler/i,
  ]) {
    assert.doesNotMatch(
      fixtureSource,
      forbiddenPattern,
      `package fixture must not include forbidden surface: ${forbiddenPattern}`
    );
  }
  for (const forbiddenField of [
    "approved",
    "trusted",
    "certified",
    "billable",
    "billing",
    "price",
    "charge",
    "payment",
  ]) {
    assert.equal(
      fixtureSource.includes(`"${forbiddenField}"`),
      false,
      `package fixture must not introduce authority or commercial field: ${forbiddenField}`
    );
  }
  assert.doesNotMatch(fixtureSource, /ramen/i, "fixture must be producer-neutral");
  assert.doesNotMatch(samplesSource, /ramen/i, "sample must be producer-neutral");
}

function verifyPositiveSelection() {
  const input = createLocalAdapterManifestSelectionFixtureInput();
  const output = buildLocalAdapterManifestSelectionFixture(input);
  const sampleOutput = createLocalAdapterManifestSelectionFixtureSamples();
  const selectedManifest = findExactManifest(input);

  assert.deepStrictEqual(output, sampleOutput);
  assert.deepStrictEqual(Object.keys(output).sort(), [
    "fixed_input_compatibility",
    "selection",
  ]);
  assert.deepStrictEqual(Object.keys(output.selection).sort(), [
    "adapter",
    "manifest",
    "selection_mode",
  ]);
  assert.equal(output.selection.selection_mode, "exact_adapter_manifest_pin");
  assert.deepStrictEqual(output.selection.adapter, input.verification_request.adapter);
  assert.deepStrictEqual(output.selection.manifest, selectedManifest);
  assert.notEqual(output.selection.manifest, selectedManifest);
  assert.notEqual(output.selection.manifest.identity, selectedManifest.identity);

  assert.deepStrictEqual(output.fixed_input_compatibility, {
    evidence_package: {
      package_id: input.evidence_package.package_id,
      package_version: input.evidence_package.package_version,
      source_type: input.evidence_package.producer.source_type,
      source_schema_version: input.evidence_package.source_schema_version,
    },
    requested_assurance_profiles:
      input.verification_request.requested_assurance_profiles,
    required_mapping_capabilities: input.required_mapping_capabilities,
  });

  for (const forbiddenOutputKey of [
    "approved",
    "trusted",
    "certified",
    "permitted",
    "blocked",
    "production_ready",
    "runtime_enabled",
    "default_adapter",
    "preferred_adapter",
    "candidate_index",
    "position",
    "ranking",
    "score",
    "priority",
    "module_path",
    "runtime_module",
    "factory",
    "execute",
    "loader",
    "billing",
    "price",
    "charge",
    "payment",
    "selection_id",
    "selection_timestamp",
    "registry_id",
    "approval_status",
  ]) {
    assert.equal(
      collectKeys(output).includes(forbiddenOutputKey),
      false,
      `output must not include ${forbiddenOutputKey}`
    );
  }

  const emptyProfilesInput = createLocalAdapterManifestSelectionFixtureInput();
  emptyProfilesInput.verification_request.requested_assurance_profiles = [];
  const emptyProfilesOutput = buildLocalAdapterManifestSelectionFixture(
    emptyProfilesInput
  );
  assert.deepStrictEqual(
    emptyProfilesOutput.fixed_input_compatibility.requested_assurance_profiles,
    [],
    "an empty requested profile set must remain explicitly empty"
  );

  assert.notEqual(
    selectedManifest.adapter_id,
    selectedManifest.identity.adapter_name,
    "adapter ID and adapter name must remain independent identifiers"
  );
}

function verifyOpaqueExactVersionAcceptance() {
  assertOpaqueVersionCase({
    adapterVersion: "vendor=2026-07+build.5",
    sourceSchemaVersion: "schema=2026-07+revision.2",
    profileVersion: "profile=review-v1+revision.3",
  });
  assertOpaqueVersionCase({
    adapterVersion: "release-candidate-1",
    sourceSchemaVersion: "vendor-schema-2026-07",
    profileVersion: "review-profile-v1",
  });
  assertOpaqueVersionCase({
    adapterVersion: "xray-1",
    sourceSchemaVersion: "linux-2026",
    profileVersion: "index-v1",
  });
}

function assertOpaqueVersionCase({
  adapterVersion,
  sourceSchemaVersion,
  profileVersion,
}) {
  const input = createLocalAdapterManifestSelectionFixtureInput();
  const selected = findExactManifest(input);
  input.verification_request.adapter.adapter_version = adapterVersion;
  selected.identity.adapter_version = adapterVersion;
  input.evidence_package.source_schema_version = sourceSchemaVersion;
  selected.supported_source_schema_versions = [sourceSchemaVersion];
  input.verification_request.requested_assurance_profiles[0].profile_version =
    profileVersion;
  selected.supported_assurance_profiles[0].profile_version = profileVersion;

  const output = buildLocalAdapterManifestSelectionFixture(input);
  assert.equal(output.selection.adapter.adapter_version, adapterVersion);
  assert.equal(
    output.selection.manifest.identity.adapter_version,
    adapterVersion
  );
  assert.equal(
    output.fixed_input_compatibility.evidence_package.source_schema_version,
    sourceSchemaVersion
  );
  assert.equal(
    output.selection.manifest.supported_source_schema_versions[0],
    sourceSchemaVersion
  );
  assert.equal(
    output.fixed_input_compatibility.requested_assurance_profiles[0]
      .profile_version,
    profileVersion
  );
  assert.equal(
    output.selection.manifest.supported_assurance_profiles[0].profile_version,
    profileVersion
  );
}

function verifyLifecycleAndLimitationBoundaries() {
  for (const lifecycleStatus of [
    "draft",
    "spike",
    "reference",
    "deprecated",
  ]) {
    const input = createLocalAdapterManifestSelectionFixtureInput();
    findExactManifest(input).lifecycle_status = lifecycleStatus;
    const output = buildLocalAdapterManifestSelectionFixture(input);
    assert.equal(output.selection.manifest.lifecycle_status, lifecycleStatus);
  }

  const limitationInput = createLocalAdapterManifestSelectionFixtureInput();
  const selected = findExactManifest(limitationInput);
  selected.declared_limitations = {
    raw_payload_available: false,
    issuer_key_available: false,
    unsupported_algorithm: true,
    unsupported_receipt_version: true,
    redacted_evidence: true,
    confidential_evidence: true,
    limitations: [
      "The runtime trust review may mention payment and production context.",
      "Deprecated or unsupported evidence remains descriptive limitation text.",
    ],
  };
  const limitationOutput = buildLocalAdapterManifestSelectionFixture(
    limitationInput
  );
  assert.deepStrictEqual(
    limitationOutput.selection.manifest.declared_limitations,
    selected.declared_limitations,
    "limitations must be preserved without affecting exact selection"
  );
}

function verifyOrderIndependence() {
  const input = createLocalAdapterManifestSelectionFixtureInput();
  const baseline = buildLocalAdapterManifestSelectionFixture(input);

  const reversedInput = cloneValue(input);
  reversedInput.adapter_manifests.reverse();
  assert.deepStrictEqual(
    buildLocalAdapterManifestSelectionFixture(reversedInput),
    baseline,
    "candidate order must not affect exact selection"
  );

  const decoyInput = cloneValue(input);
  const decoy = cloneValue(decoyInput.adapter_manifests[1]);
  decoy.adapter_id = "adapter-additional-decoy";
  decoy.identity.adapter_name = "additional-decoy-mapper";
  decoy.identity.adapter_version = "8.0.0";
  decoyInput.adapter_manifests.splice(1, 0, decoy);
  assert.deepStrictEqual(
    buildLocalAdapterManifestSelectionFixture(decoyInput),
    baseline,
    "a legal nonmatching decoy must not affect output"
  );

  const keyOrderInput = cloneValue(input);
  const selectedIndex = findExactManifestIndex(keyOrderInput);
  keyOrderInput.adapter_manifests[selectedIndex] = Object.fromEntries(
    Object.entries(keyOrderInput.adapter_manifests[selectedIndex]).reverse()
  );
  assert.deepStrictEqual(
    buildLocalAdapterManifestSelectionFixture(keyOrderInput),
    baseline,
    "candidate key order must not affect semantics"
  );
}

function verifyDeterminismAndImmutability() {
  const input = createLocalAdapterManifestSelectionFixtureInput();
  const snapshot = cloneValue(input);
  const first = buildLocalAdapterManifestSelectionFixture(input);
  const second = buildLocalAdapterManifestSelectionFixture(input);

  assert.deepStrictEqual(first, second);
  assert.deepStrictEqual(input, snapshot, "caller input must remain unchanged");

  first.selection.manifest.identity.adapter_name = "mutated-output";
  first.fixed_input_compatibility.required_mapping_capabilities.push(
    "report_language"
  );
  const rebuilt = buildLocalAdapterManifestSelectionFixture(input);
  assert.deepStrictEqual(
    rebuilt,
    second,
    "output mutation must not pollute a rebuilt selection"
  );
}

function verifyNegativeCases() {
  assertNegativeCase(
    "extra top-level input",
    (input) => {
      input.registry = {};
    },
    /input must contain exactly/
  );
  assertNegativeCase(
    "empty candidates",
    (input) => {
      input.adapter_manifests = [];
    },
    /adapter_manifests must not be empty/
  );
  assertNegativeCase(
    "missing exact candidate",
    (input) => {
      input.adapter_manifests = input.adapter_manifests.filter(
        (manifest) => manifest !== findExactManifest(input)
      );
    },
    /must contain one exact adapter ID\/version match/
  );
  assertNegativeCase(
    "duplicate exact candidate",
    (input) => {
      input.adapter_manifests.push(cloneValue(findExactManifest(input)));
    },
    /must not contain duplicate exact adapter ID\/version matches/
  );
  assertNegativeCase(
    "same ID wrong version does not fallback",
    (input) => {
      input.verification_request.adapter.adapter_version = "9.9.9";
    },
    /must contain one exact adapter ID\/version match/
  );
  assertNegativeCase(
    "same version wrong ID does not fallback",
    (input) => {
      input.verification_request.adapter.adapter_id = "adapter-missing";
    },
    /must contain one exact adapter ID\/version match/
  );
  assertNegativeCase(
    "incompatible exact candidate does not fallback",
    (input) => {
      findExactManifest(input).supported_source_schema_versions = [
        "external-evidence/2.0",
      ];
    },
    /must explicitly support the evidence package source schema version/
  );
  assertNegativeCase(
    "source type mismatch",
    (input) => {
      findExactManifest(input).identity.source_type = "ci_cd_evidence";
    },
    /source type must match evidence package source type/
  );
  assertNegativeCase(
    "source schema mismatch",
    (input) => {
      input.evidence_package.source_schema_version = "external-evidence/7.0";
    },
    /must explicitly support the evidence package source schema version/
  );
  assertNegativeCase(
    "schema wildcard does not match",
    (input) => {
      findExactManifest(input).supported_source_schema_versions = ["*"];
    },
    /supported_source_schema_versions\[0\] must be an exact version/
  );
  assertNegativeCase(
    "symbolic latest adapter pin",
    (input) => {
      const selected = findExactManifest(input);
      input.verification_request.adapter.adapter_version = "latest";
      selected.identity.adapter_version = "latest";
    },
    /verification_request.adapter.adapter_version must be an exact version/
  );
  assertNegativeCase(
    "whitespace symbolic latest adapter pin",
    (input) => {
      const selected = findExactManifest(input);
      input.verification_request.adapter.adapter_version = " latest ";
      selected.identity.adapter_version = " latest ";
    },
    /verification_request.adapter.adapter_version must be an exact version/
  );
  assertNegativeCase(
    "adapter x wildcard pin",
    (input) => {
      const selected = findExactManifest(input);
      input.verification_request.adapter.adapter_version = "1.2.x";
      selected.identity.adapter_version = "1.2.x";
    },
    /verification_request.adapter.adapter_version must be an exact version/
  );
  assertNegativeCase(
    "adapter version range pin",
    (input) => {
      const selected = findExactManifest(input);
      input.verification_request.adapter.adapter_version = "^1.2.0";
      selected.identity.adapter_version = "^1.2.0";
    },
    /verification_request.adapter.adapter_version must be an exact version/
  );
  assertNegativeCase(
    "adapter leading comparator pin",
    (input) => {
      const selected = findExactManifest(input);
      input.verification_request.adapter.adapter_version = ">=1.0";
      selected.identity.adapter_version = ">=1.0";
    },
    /verification_request.adapter.adapter_version must be an exact version/
  );
  assertNegativeCase(
    "adapter interval range pin",
    (input) => {
      const selected = findExactManifest(input);
      input.verification_request.adapter.adapter_version = "[1.0,2.0)";
      selected.identity.adapter_version = "[1.0,2.0)";
    },
    /verification_request.adapter.adapter_version must be an exact version/
  );
  assertNegativeCase(
    "symbolic profile version",
    (input) => {
      input.verification_request.requested_assurance_profiles[0].profile_version =
        "latest";
      findExactManifest(input).supported_assurance_profiles[0].profile_version =
        "latest";
    },
    /requested_assurance_profiles\[0\]\.profile_version must be an exact version/
  );
  assertNegativeCase(
    "profile x wildcard version",
    (input) => {
      input.verification_request.requested_assurance_profiles[0].profile_version =
        "2.X";
      findExactManifest(input).supported_assurance_profiles[0].profile_version =
        "2.X";
    },
    /requested_assurance_profiles\[0\]\.profile_version must be an exact version/
  );
  assertNegativeCase(
    "profile logical range version",
    (input) => {
      input.verification_request.requested_assurance_profiles[0].profile_version =
        "1.0 || 2.0";
      findExactManifest(input).supported_assurance_profiles[0].profile_version =
        "1.0 || 2.0";
    },
    /requested_assurance_profiles\[0\]\.profile_version must be an exact version/
  );
  assertNegativeCase(
    "source schema hyphen range",
    (input) => {
      input.evidence_package.source_schema_version = "1.0 - 2.0";
      findExactManifest(input).supported_source_schema_versions = [
        "1.0 - 2.0",
      ];
    },
    /evidence_package.source_schema_version must be an exact version/
  );
  assertNegativeCase(
    "unsupported profile ID",
    (input) => {
      input.verification_request.requested_assurance_profiles[0].profile_id =
        "profile-unsupported";
    },
    /must explicitly support every requested assurance profile/
  );
  assertNegativeCase(
    "unsupported profile version",
    (input) => {
      input.verification_request.requested_assurance_profiles[0].profile_version =
        "99.0";
    },
    /must explicitly support every requested assurance profile/
  );
  assertNegativeCase(
    "duplicate requested profile",
    (input) => {
      input.verification_request.requested_assurance_profiles.push(
        cloneValue(input.verification_request.requested_assurance_profiles[0])
      );
    },
    /requested_assurance_profiles must not contain duplicate profiles/
  );
  assertNegativeCase(
    "duplicate supported profile",
    (input) => {
      const selected = findExactManifest(input);
      selected.supported_assurance_profiles.push(
        cloneValue(selected.supported_assurance_profiles[0])
      );
    },
    /supported_assurance_profiles must not contain duplicate profiles/
  );
  assertNegativeCase(
    "duplicate supported schema",
    (input) => {
      const selected = findExactManifest(input);
      selected.supported_source_schema_versions.push(
        selected.supported_source_schema_versions[0]
      );
    },
    /supported_source_schema_versions must not contain duplicates/
  );
  assertNegativeCase(
    "missing required capability",
    (input) => {
      delete findExactManifest(input).declared_mapping_capability
        .normalized_evidence_record;
    },
    /must declare required mapping capability: normalized_evidence_record/
  );
  assertNegativeCase(
    "false required capability",
    (input) => {
      findExactManifest(input).declared_mapping_capability.verification_findings =
        false;
    },
    /must declare required mapping capability: verification_findings/
  );
  assertNegativeCase(
    "unknown required capability",
    (input) => {
      input.required_mapping_capabilities.push("adapter_execute");
    },
    /required_mapping_capabilities\[2\] must be one of/
  );
  assertNegativeCase(
    "duplicate required capability",
    (input) => {
      input.required_mapping_capabilities.push(
        input.required_mapping_capabilities[0]
      );
    },
    /required_mapping_capabilities must not contain duplicates/
  );
  assertNegativeCase(
    "malformed manifest",
    (input) => {
      findExactManifest(input).identity = [];
    },
    /identity must be a plain object/
  );
  assertNegativeCase(
    "malformed non-selected manifest",
    (input) => {
      input.adapter_manifests[1].runtime_module = "./adapter.mjs";
    },
    /adapter_manifests\[1\] must contain exactly/
  );
  assertNegativeCase(
    "unknown manifest field",
    (input) => {
      findExactManifest(input).selection_score = 10;
    },
    /adapter_manifests\[0\] must contain exactly/
  );
  assertNegativeCase(
    "invalid lifecycle status",
    (input) => {
      findExactManifest(input).lifecycle_status = "production";
    },
    /lifecycle_status must be one of/
  );
  assertNegativeCase(
    "unknown mapping declaration",
    (input) => {
      findExactManifest(input).declared_mapping_capability.priority = true;
    },
    /declared_mapping_capability must not include unknown field: priority/
  );
  assertNegativeCase(
    "non-boolean mapping declaration",
    (input) => {
      findExactManifest(input).declared_mapping_capability.report_language =
        "yes";
    },
    /report_language must be a boolean/
  );
  assertNegativeCase(
    "unknown limitation field",
    (input) => {
      findExactManifest(input).declared_limitations.storage = "remote";
    },
    /declared_limitations must not include unknown field: storage/
  );
  assertNegativeCase(
    "non-boolean limitation flag",
    (input) => {
      findExactManifest(input).declared_limitations.redacted_evidence = "no";
    },
    /redacted_evidence must be a boolean/
  );
  assertNegativeCase(
    "invalid limitation text",
    (input) => {
      findExactManifest(input).declared_limitations.limitations = [""];
    },
    /limitations\[0\] must be a non-empty string/
  );
  const duplicateLimitationInput =
    createLocalAdapterManifestSelectionFixtureInput();
  const duplicateLimitation = "Repeated caller-provided limitation.";
  findExactManifest(duplicateLimitationInput).declared_limitations.limitations = [
    duplicateLimitation,
    duplicateLimitation,
  ];
  assert.doesNotThrow(
    () => buildLocalAdapterManifestSelectionFixture(duplicateLimitationInput),
    "canonical limitations do not impose an unrequested uniqueness rule"
  );
  assertNegativeCase(
    "invalid evidence source type",
    (input) => {
      findExactManifest(input).identity.source_type = "vendor_receipt";
    },
    /identity.source_type must be one of/
  );
  assertNegativeCase(
    "request package ID mismatch",
    (input) => {
      input.verification_request.evidence_package.package_id =
        "package-other";
    },
    /evidence package ID must match/
  );
  assertNegativeCase(
    "request package version mismatch",
    (input) => {
      input.verification_request.evidence_package.package_version = "0.2";
    },
    /evidence package version must match/
  );
  assertNegativeCase(
    "request digest mismatch",
    (input) => {
      input.verification_request.evidence_package.digest =
        "sha256:different";
    },
    /digest must match evidence_package.integrity.digest/
  );
  assertNegativeCase(
    "request integrity reference mismatch",
    (input) => {
      input.verification_request.evidence_package.integrity_ref =
        "integrity:different";
    },
    /integrity_ref must match evidence_package.integrity.integrity_ref/
  );
  assertNegativeCase(
    "missing package integrity",
    (input) => {
      delete input.evidence_package.integrity;
    },
    /evidence_package.integrity is required/
  );

  for (const forbiddenAdapterField of [
    "latest",
    "default",
    "preferred",
    "fallback",
    "version_range",
    "priority",
    "lifecycle_status",
    "module_path",
    "runtime_module",
    "executable_factory",
    "factory",
    "adapter_execute",
    "execute",
    "loader",
    "approved",
    "trusted",
    "certified",
    "permitted",
    "blocked",
    "production_ready",
    "runtime_enabled",
    "default_adapter",
    "preferred_adapter",
    "billing",
    "price",
    "charge",
    "payment",
  ]) {
    assertNegativeCase(
      `forbidden adapter pin field ${forbiddenAdapterField}`,
      (input) => {
        input.verification_request.adapter[forbiddenAdapterField] = true;
      },
      /verification_request.adapter must contain exactly/
    );
  }

  for (const forbiddenManifestField of [
    "module_path",
    "runtime_module",
    "executable_factory",
    "factory",
    "adapter_execute",
    "execute",
    "loader",
    "approved",
    "trusted",
    "certified",
    "permitted",
    "blocked",
    "production_ready",
    "runtime_enabled",
    "default_adapter",
    "preferred_adapter",
    "default",
    "priority",
    "billing",
    "price",
    "charge",
    "payment",
  ]) {
    assertNegativeCase(
      `forbidden manifest field ${forbiddenManifestField}`,
      (input) => {
        findExactManifest(input)[forbiddenManifestField] = true;
      },
      /adapter_manifests\[0\] must contain exactly/
    );
  }
}

function assertNegativeCase(label, mutate, pattern) {
  const input = createLocalAdapterManifestSelectionFixtureInput();
  mutate(input);
  assert.throws(
    () => buildLocalAdapterManifestSelectionFixture(input),
    (error) => {
      assert.ok(error instanceof TypeError, `${label} should throw TypeError`);
      assert.match(error.message, pattern);
      return true;
    },
    `expected rejection for ${label}`
  );
}

function findExactManifest(input) {
  return input.adapter_manifests[findExactManifestIndex(input)];
}

function findExactManifestIndex(input) {
  const { adapter_id, adapter_version } = input.verification_request.adapter;
  return input.adapter_manifests.findIndex(
    (manifest) =>
      manifest.adapter_id === adapter_id &&
      manifest.identity.adapter_version === adapter_version
  );
}

function collectKeys(value) {
  const keys = [];
  walkValue(value, (key) => keys.push(key));
  return keys;
}

function walkValue(value, visitKey) {
  if (Array.isArray(value)) {
    value.forEach((entry) => walkValue(entry, visitKey));
    return;
  }
  if (value === null || typeof value !== "object") {
    return;
  }
  for (const [key, entry] of Object.entries(value)) {
    visitKey(key);
    walkValue(entry, visitKey);
  }
}

function collectStringReferences(rootDir, pattern, excludedFilePath) {
  const matches = [];
  const excludedPath = normalizePath(excludedFilePath);
  walkFiles(rootDir, (filePath) => {
    if (!/\.(ts|mts|cts|js|mjs|cjs)$/.test(filePath)) {
      return;
    }
    if (normalizePath(filePath) === excludedPath) {
      return;
    }
    if (fs.readFileSync(filePath, "utf8").includes(pattern)) {
      matches.push(normalizePath(filePath));
    }
  });
  return matches.sort();
}

function walkFiles(rootDir, visit) {
  for (const entry of fs.readdirSync(rootDir, { withFileTypes: true })) {
    const entryPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(entryPath, visit);
      continue;
    }
    visit(entryPath);
  }
}

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizePath(filePath) {
  return filePath.replaceAll("\\", "/");
}
