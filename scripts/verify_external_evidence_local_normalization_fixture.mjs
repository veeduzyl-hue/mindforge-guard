import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeLocalExternalEvidence } from "../packages/guard-core/src/externalEvidence/localDeclarativeNormalizationFixture.mjs";

const REQUIRED_TARGETS = [
  "source.issuer",
  "receipt.receipt_id",
  "subject.subject",
  "verification.integrity.payload_hash",
  "evidence.evidence_refs",
];
const OPTIONAL_TARGETS = [
  "source.source_system",
  "receipt.raw_receipt_ref",
  "verification.integrity.raw_payload_available",
  "evidence.raw_payload_ref",
  "evidence.external_report_uri",
];
const SOURCE_DECLARED_LIMITATION =
  "Source-declared identity and integrity values were copied into a normalized structure and were not independently verified.";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const normalizerPath = path.join(
  repoRoot,
  "packages",
  "guard-core",
  "src",
  "externalEvidence",
  "localDeclarativeNormalizationFixture.mjs"
);
const packageJsonPath = path.join(repoRoot, "package.json");
const guardCoreIndexPath = path.join(repoRoot, "packages", "guard-core", "src", "index.ts");
const CASES = [
  {
    kind: "runtime",
    manifest_id: "manifest-synthetic-runtime-receipt",
    producer_id: "producer-synthetic-runtime-receipt",
    source_type: "runtime_receipt",
    source_schema_version: "synthetic-runtime-receipt/v0.1",
    record_id: "normalized-runtime-receipt-001",
    generated_at: "2026-07-12T00:00:00.000Z",
    adapter_name: "Synthetic Runtime Receipt Adapter",
    receipt_version: "synthetic-runtime-receipt-v0.1",
    action_summary: "Normalize a synthetic runtime receipt into review data.",
    limitation: "Synthetic runtime receipt evidence is normalized locally for review only.",
    raw_evidence: {
      receipt: { identifier: "runtime-receipt-001" },
      integrity: {
        payload_digest: "sha256:runtime-payload-digest-001",
        raw_payload_available: true,
      },
      actor: { issuer: "runtime-issuer-sample" },
      source: { system: "synthetic-runtime-receipt-system" },
      subject: { artifact: "runtime-artifact-001" },
      evidence: {
        refs: ["evidence://synthetic/runtime-receipt/record-001"],
        raw_receipt_ref: "local://synthetic/runtime-receipt/receipt-001",
        raw_payload_ref: "local://synthetic/runtime-receipt/payload-001",
        external_report_uri: "local://synthetic/runtime-receipt/external-report-001",
      },
    },
    field_paths: {
      "source.source_system": ["source", "system"],
      "source.issuer": ["actor", "issuer"],
      "receipt.receipt_id": ["receipt", "identifier"],
      "receipt.raw_receipt_ref": ["evidence", "raw_receipt_ref"],
      "subject.subject": ["subject", "artifact"],
      "verification.integrity.payload_hash": ["integrity", "payload_digest"],
      "verification.integrity.raw_payload_available": ["integrity", "raw_payload_available"],
      "evidence.evidence_refs": ["evidence", "refs"],
      "evidence.raw_payload_ref": ["evidence", "raw_payload_ref"],
      "evidence.external_report_uri": ["evidence", "external_report_uri"],
    },
  },
  {
    kind: "ci",
    manifest_id: "manifest-synthetic-ci-provenance",
    producer_id: "producer-synthetic-ci-provenance",
    source_type: "ci_cd_evidence",
    source_schema_version: "synthetic-ci-provenance/v0.1",
    record_id: "normalized-ci-provenance-001",
    generated_at: "2026-07-12T00:00:01.000Z",
    adapter_name: "Synthetic CI Provenance Adapter",
    receipt_version: "synthetic-ci-provenance-v0.1",
    action_summary: "Normalize a synthetic CI provenance record into review data.",
    limitation: "Synthetic CI provenance evidence is normalized locally for review only.",
    raw_evidence: {
      build: { run_id: "ci-run-001" },
      artifact: {
        digest: "sha256:ci-artifact-digest-001",
        refs: ["evidence://synthetic/ci-provenance/build-001"],
        raw_payload_ref: "local://synthetic/ci-provenance/payload-001",
        external_report_uri: "local://synthetic/ci-provenance/report-001",
      },
      revision: {
        source_ref: "local://synthetic/ci-provenance/run-001",
        issuer: "ci-system-sample",
      },
      provenance: { system: "synthetic-ci-provenance-system" },
      target: { name: "ci-artifact-001" },
      access: { raw_payload_available: false },
    },
    field_paths: {
      "source.source_system": ["provenance", "system"],
      "source.issuer": ["revision", "issuer"],
      "receipt.receipt_id": ["build", "run_id"],
      "receipt.raw_receipt_ref": ["revision", "source_ref"],
      "subject.subject": ["target", "name"],
      "verification.integrity.payload_hash": ["artifact", "digest"],
      "verification.integrity.raw_payload_available": ["access", "raw_payload_available"],
      "evidence.evidence_refs": ["artifact", "refs"],
      "evidence.raw_payload_ref": ["artifact", "raw_payload_ref"],
      "evidence.external_report_uri": ["artifact", "external_report_uri"],
    },
  },
];

verifyModuleBoundary();
verifyPackageScripts();
verifyIsolation();
verifyTwoSourceNormalization();
verifyInvalidCases();

console.log("external evidence local declarative normalization fixture verified");

function verifyModuleBoundary() {
  const source = fs.readFileSync(normalizerPath, "utf8");
  for (const token of [
    "Date.now",
    "new Date(",
    "Math.random",
    "randomUUID",
    "process.env",
    "fetch(",
    "node:fs",
    "node:crypto",
    "child_process",
    "import(",
    "eval(",
    "Function(",
    "ramen",
  ]) {
    assert.equal(source.includes(token), false, `normalizer module must not include forbidden token: ${token}`);
  }
}

function verifyPackageScripts() {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  assert.equal(
    packageJson.scripts["verify:external-evidence:local-normalization"],
    "node scripts/verify_external_evidence_local_normalization_fixture.mjs"
  );
  assert.equal(
    packageJson.scripts.verify,
    "npm run verify:core && npm run verify:v612 && npm run verify:external-evidence:type-contract"
  );
}

function verifyIsolation() {
  const indexSource = fs.readFileSync(guardCoreIndexPath, "utf8");
  assert.equal(indexSource.includes("localDeclarativeNormalizationFixture"), false);
  assert.deepStrictEqual(
    collectStringReferences(path.join(repoRoot, "packages"), "localDeclarativeNormalizationFixture", normalizerPath),
    []
  );
}

function verifyTwoSourceNormalization() {
  const [runtimeInput, ciInput] = CASES.map(createSyntheticCase);
  const runtimeSnapshot = cloneValue(runtimeInput);
  const ciSnapshot = cloneValue(ciInput);
  const runtimeResult = normalizeLocalExternalEvidence(runtimeInput);
  const ciResult = normalizeLocalExternalEvidence(ciInput);

  assert.deepStrictEqual(runtimeInput, runtimeSnapshot);
  assert.deepStrictEqual(ciInput, ciSnapshot);
  assert.deepStrictEqual(normalizeLocalExternalEvidence(runtimeInput), runtimeResult);
  assert.deepStrictEqual(normalizeLocalExternalEvidence(ciInput), ciResult);
  assert.notDeepStrictEqual(runtimeInput.raw_evidence, ciInput.raw_evidence);
  assert.notDeepStrictEqual(runtimeInput.mapping_manifest.field_paths, ciInput.mapping_manifest.field_paths);
  assertNormalizedRecord(runtimeResult.normalized_record, runtimeInput.mapping_manifest);
  assertNormalizedRecord(ciResult.normalized_record, ciInput.mapping_manifest);
  assert.equal(runtimeResult.normalization_findings.length, 0);
  assert.equal(ciResult.normalization_findings.length, 0);
  assert.equal(runtimeResult.normalized_record.adapter.source_type, "runtime_receipt");
  assert.equal(ciResult.normalized_record.adapter.source_type, "ci_cd_evidence");
  assert.ok(!JSON.stringify(runtimeResult).includes("synthetic-ci-provenance"));
  assert.ok(!JSON.stringify(ciResult).includes("synthetic-runtime-receipt"));
  assert.deepStrictEqual(runtimeResult.source_reference, {
    manifest_id: runtimeInput.mapping_manifest.manifest_id,
    manifest_version: "0.1",
    producer_id: runtimeInput.mapping_manifest.producer_id,
    source_type: "runtime_receipt",
    source_schema_version: runtimeInput.mapping_manifest.source_schema_version,
    normalized_contract_version: "0.1",
  });
  const pristineCiResult = cloneValue(ciResult);
  runtimeResult.normalized_record.evidence.evidence_refs[0] = "mutated";
  runtimeResult.normalized_record.adapter.limitations.limitations[0] = "mutated";
  assert.deepStrictEqual(ciResult, pristineCiResult);
  assert.equal(
    normalizeLocalExternalEvidence(createSyntheticCase(CASES[0])).normalized_record.evidence.evidence_refs[0],
    "evidence://synthetic/runtime-receipt/record-001"
  );
}

function verifyInvalidCases() {
  const missingRequiredInput = createSyntheticCase(CASES[0]);
  delete missingRequiredInput.raw_evidence.integrity.payload_digest;
  const missingRequiredResult = normalizeLocalExternalEvidence(missingRequiredInput);
  assert.equal(missingRequiredResult.normalization_findings.length, 1);
  assert.equal(missingRequiredResult.normalized_record.contract_validation.status, "contract_partially_parseable");
  assert.deepStrictEqual(
    missingRequiredResult.normalized_record.contract_validation.missing_required_fields,
    ["verification.integrity.payload_hash"]
  );
  assert.equal("payload_hash" in missingRequiredResult.normalized_record.verification.integrity, false);

  const missingOptionalInput = createSyntheticCase(CASES[0]);
  delete missingOptionalInput.raw_evidence.evidence.external_report_uri;
  const missingOptionalResult = normalizeLocalExternalEvidence(missingOptionalInput);
  assert.equal(missingOptionalResult.normalization_findings.length, 1);
  assert.equal(missingOptionalResult.normalized_record.contract_validation.status, "contract_parseable");
  assert.deepStrictEqual(missingOptionalResult.normalized_record.contract_validation.missing_required_fields, []);

  const noCoercionInput = createSyntheticCase(CASES[0]);
  noCoercionInput.raw_evidence.receipt.identifier = 404;
  const noCoercionResult = normalizeLocalExternalEvidence(noCoercionInput);
  assert.equal(noCoercionResult.normalization_findings[0].finding_type, "invalid_source_value");
  assert.match(noCoercionResult.normalization_findings[0].message, /requires a non-empty string value/);

  const getterState = { invoked: false };
  const toJsonState = { invoked: false };
  expectInvalidCase(
    (input) => {
      const inherited = Object.create({ inherited: "value" });
      inherited.visible = "runtime-issuer-sample";
      input.raw_evidence.actor = inherited;
    },
    /raw_evidence\.actor must be a plain object/
  );
  expectInvalidCase(
    (input) => {
      Object.defineProperty(input.raw_evidence.integrity, "payload_digest", {
        enumerable: true,
        get() {
          getterState.invoked = true;
          return "sha256:getter";
        },
      });
    },
    /must not be an accessor property/
  );
  expectInvalidCase(
    (input) => {
      Object.defineProperty(input.raw_evidence.receipt, "toJSON", {
        enumerable: false,
        value() {
          toJsonState.invoked = true;
          return {};
        },
      });
    },
    /must not contain an own toJSON property/
  );
  assert.equal(getterState.invoked, false);
  assert.equal(toJsonState.invoked, false);

  for (const segment of ["__proto__", "constructor", "prototype"]) {
    expectInvalidCase(
      (input) => (input.mapping_manifest.field_paths["source.issuer"] = [segment, "issuer"]),
      /forbidden source path segment/
    );
  }
  assert.equal(Object.prototype.issuer, undefined);

  expectInvalidCase(
    (input) => (input.mapping_manifest.field_paths["record.record_id"] = ["receipt", "identifier"]),
    /unsupported target field/
  );
  expectInvalidCase(
    (input) => (input.mapping_manifest.callback = () => "nope"),
    /must not contain a function/
  );
  expectInvalidCase(
    (input) => {
      Object.defineProperty(input.mapping_manifest, "field_paths", {
        enumerable: true,
        get() {
          throw new Error("manifest getter should not run");
        },
      });
    },
    /must not be an accessor property/
  );
  expectInvalidCase((input) => (input.mapping_manifest[Symbol("shadow")] = "hidden"), /symbol-keyed properties/);
  expectInvalidCase((input) => (input.raw_evidence[Symbol("shadow")] = "hidden"), /symbol-keyed properties/);
  expectInvalidCase((input) => input.mapping_manifest.optional_targets.push("source.issuer"), /both required and optional/);
  expectInvalidCase(
    (input) => {
      input.mapping_manifest.required_targets = input.mapping_manifest.required_targets.filter((target) => target !== "source.issuer");
      input.mapping_manifest.optional_targets.push("source.issuer");
    },
    /must include source\.issuer|must not include required target/
  );
  expectInvalidCase(
    (input) => {
      input.mapping_manifest.required_targets = input.mapping_manifest.required_targets.filter((target) => target !== "evidence.evidence_refs");
    },
    /must include evidence\.evidence_refs/
  );
  expectInvalidCase((input) => delete input.mapping_manifest.field_paths["source.issuer"], /must declare required target source\.issuer/);
  expectInvalidCase(
    (input) => (input.mapping_manifest.field_paths["evidence.evidence_refs"] = ["evidence", "refs", "0"]),
    /must not use an array index segment/
  );

  const nullPrototypeInput = createSyntheticCase(CASES[0]);
  nullPrototypeInput.raw_evidence = Object.assign(Object.create(null), nullPrototypeInput.raw_evidence);
  assert.equal(
    normalizeLocalExternalEvidence(nullPrototypeInput).normalized_record.receipt.receipt_id,
    "runtime-receipt-001"
  );
}

function assertNormalizedRecord(record, manifest) {
  assert.deepStrictEqual(Object.keys(record).sort(), [
    "adapter",
    "contract_validation",
    "diagnostics",
    "evidence",
    "findings",
    "receipt",
    "record",
    "source",
    "subject",
    "verification",
  ]);
  assert.deepStrictEqual(Object.keys(record.record).sort(), ["generated_at", "record_id", "record_version"]);
  assert.equal(record.record.record_version, "0.1");
  assert.equal(record.record.record_id, manifest.declared_fields.record_id);
  assert.equal(record.record.generated_at, manifest.declared_fields.generated_at);
  assert.equal(record.adapter.adapter_name, manifest.declared_fields.adapter_name);
  assert.equal(record.adapter.adapter_version, manifest.declared_fields.adapter_version);
  assert.equal(record.source.source_type, manifest.source_type);
  assert.equal(record.source.trust_status, manifest.declared_fields.trust_status);
  assert.equal(record.evidence.completeness_status, manifest.declared_fields.completeness_status);
  assert.equal(record.verification.status, "verification_not_performed");
  assert.equal(record.verification.integrity.payload_hash_status, "not_checked");
  assert.ok(record.adapter.limitations.limitations.includes(SOURCE_DECLARED_LIMITATION));
  assert.deepStrictEqual(record.verification.diagnostics, []);
  assert.deepStrictEqual(record.contract_validation.diagnostics, []);
  assert.deepStrictEqual(record.diagnostics, []);
  assert.deepStrictEqual(record.findings, []);
}

function createSyntheticCase(config) {
  return {
    raw_evidence: cloneValue(config.raw_evidence),
    mapping_manifest: {
      manifest_id: config.manifest_id,
      manifest_version: "0.1",
      producer_id: config.producer_id,
      source_type: config.source_type,
      source_schema_version: config.source_schema_version,
      normalized_contract_version: "0.1",
      declared_fields: {
        record_id: config.record_id,
        generated_at: config.generated_at,
        adapter_name: config.adapter_name,
        adapter_version: "0.1.0",
        trust_status: "unknown",
        receipt_version: config.receipt_version,
        subject_type: "synthetic_artifact",
        action_summary: config.action_summary,
        completeness_status: "partial",
      },
      field_paths: cloneValue(config.field_paths),
      required_targets: REQUIRED_TARGETS.slice(),
      optional_targets: OPTIONAL_TARGETS.slice(),
      limitations: [config.limitation],
    },
  };
}

function expectInvalidCase(mutate, pattern) {
  const input = createSyntheticCase(CASES[0]);
  mutate(input);
  assert.throws(() => normalizeLocalExternalEvidence(input), pattern);
}

function collectStringReferences(rootDir, pattern, excludedFilePath) {
  const matches = [];
  const normalizedExcludedPath = normalizePath(excludedFilePath);
  walkFiles(rootDir, (filePath) => {
    if (!/\.(ts|mts|cts|js|mjs|cjs)$/.test(filePath) || normalizePath(filePath) === normalizedExcludedPath) {
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
