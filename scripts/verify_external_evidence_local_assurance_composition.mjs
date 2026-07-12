import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { composeLocalExternalEvidenceAssurance } from "./fixtures/local_external_evidence_assurance_composition.mjs";
import { verifyAssuranceReportIntegrity } from "../packages/guard-core/src/externalEvidence/localAssuranceReportIntegrity.mjs";

const REQUIRED_TARGETS = ["source.issuer", "receipt.receipt_id", "subject.subject", "verification.integrity.payload_hash", "evidence.evidence_refs"];
const OPTIONAL_TARGETS = ["source.source_system", "receipt.raw_receipt_ref", "verification.integrity.raw_payload_available", "evidence.raw_payload_ref", "evidence.external_report_uri"];
const PARTIAL_SCOPE_LIMITATION =
  "Normalized evidence remains partially parseable; inspect normalization_findings before relying on this local composition output.";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const compositionModulePath = path.join(repoRoot, "scripts", "fixtures", "local_external_evidence_assurance_composition.mjs");
const packageJsonPath = path.join(repoRoot, "package.json");
const guardCoreIndexPath = path.join(repoRoot, "packages", "guard-core", "src", "index.ts");
const CASES = [
  { kind: "runtime", idPrefix: "runtime-receipt", title: "Runtime Receipt", manifest_id: "manifest-synthetic-runtime-receipt", producer_id: "producer-synthetic-runtime-receipt", producer_name: "Synthetic Runtime Receipt Producer", source_type: "runtime_receipt", source_schema_version: "synthetic-runtime-receipt/v0.1", record_id: "normalized-runtime-receipt-001", adapter_name: "Synthetic Runtime Receipt Adapter", adapter_id: "adapter-synthetic-runtime-receipt", receipt_version: "synthetic-runtime-receipt-v0.1", action_summary: "Normalize a synthetic runtime receipt into review data.", limitation: "Synthetic runtime receipt evidence is normalized locally for review only.", generated_at: "2026-07-12T00:00:00.000Z" },
  { kind: "ci", idPrefix: "ci-provenance", title: "CI Provenance", manifest_id: "manifest-synthetic-ci-provenance", producer_id: "producer-synthetic-ci-provenance", producer_name: "Synthetic CI Provenance Producer", source_type: "ci_cd_evidence", source_schema_version: "synthetic-ci-provenance/v0.1", record_id: "normalized-ci-provenance-001", adapter_name: "Synthetic CI Provenance Adapter", adapter_id: "adapter-synthetic-ci-provenance", receipt_version: "synthetic-ci-provenance-v0.1", action_summary: "Normalize a synthetic CI provenance record into review data.", limitation: "Synthetic CI provenance evidence is normalized locally for review only.", generated_at: "2026-07-12T00:00:01.000Z" },
];

verifyModuleBoundary();
verifyPackageScript();
verifyIsolationBoundary();
verifyTwoSources();
verifyPartialAndNotParseable();
verifyBindingFailures();
verifyDeterminismAndIntegrity();

console.log("external evidence local assurance composition verified");

function verifyModuleBoundary() {
  const source = fs.readFileSync(compositionModulePath, "utf8");

  for (const requiredImport of [
    'import { normalizeLocalExternalEvidence } from "../../packages/guard-core/src/externalEvidence/localDeclarativeNormalizationFixture.mjs";',
    'import { buildLocalAssuranceReportFixture } from "../../packages/guard-core/src/externalEvidence/localAssuranceReportFixture.mjs";',
    'import { verifyAssuranceReportIntegrity } from "../../packages/guard-core/src/externalEvidence/localAssuranceReportIntegrity.mjs";',
  ]) {
    assert.ok(source.includes(requiredImport));
  }

  for (const forbiddenToken of [
    "\\u0046",
    "\\u0079",
    "import(",
    "Date.now",
    "new Date(",
    "Math.random",
    "randomUUID",
    "process.env",
    "fetch(",
    "node:fs",
    "child_process",
    "eval(",
    "Function(",
    "ramen",
  ]) {
    assert.equal(source.includes(forbiddenToken), false);
  }

  for (const sourceSpecificToken of [
    "producer-synthetic-runtime-receipt",
    "producer-synthetic-ci-provenance",
    "synthetic-runtime-receipt-system",
    "synthetic-ci-provenance-system",
  ]) {
    assert.equal(source.includes(sourceSpecificToken), false);
  }
}

function verifyPackageScript() {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  assert.equal(
    packageJson.scripts["verify:external-evidence:local-composition"],
    "node scripts/verify_external_evidence_local_assurance_composition.mjs"
  );
  assert.equal(
    packageJson.scripts.verify,
    "npm run verify:core && npm run verify:v612 && npm run verify:external-evidence:type-contract"
  );
}

function verifyIsolationBoundary() {
  const indexSource = fs.readFileSync(guardCoreIndexPath, "utf8");
  assert.equal(indexSource.includes("localExternalEvidenceAssuranceComposition"), false);
  assert.deepStrictEqual(collectStringReferences(path.join(repoRoot, "packages"), "local_external_evidence_assurance_composition"), []);
}

function verifyTwoSources() {
  const runtimeInput = createCompositionInput(CASES[0]);
  const ciInput = createCompositionInput(CASES[1]);
  const runtimeResult = composeLocalExternalEvidenceAssurance(runtimeInput);
  const ciResult = composeLocalExternalEvidenceAssurance(ciInput);
  assert.deepStrictEqual(
    composeLocalExternalEvidenceAssurance(createCompositionInput(CASES[0])),
    runtimeResult
  );
  assert.deepStrictEqual(
    composeLocalExternalEvidenceAssurance(createCompositionInput(CASES[1])),
    ciResult
  );

  assertSuccessfulComposition(CASES[0], runtimeResult);
  assertSuccessfulComposition(CASES[1], ciResult);
  assert.notEqual(
    runtimeResult.assurance_bundle.assurance_report.report_integrity.digest,
    ciResult.assurance_bundle.assurance_report.report_integrity.digest
  );
  assert.equal(
    JSON.stringify(runtimeResult).includes(CASES[1].producer_id),
    false
  );
  assert.equal(JSON.stringify(ciResult).includes(CASES[0].producer_id), false);
}

function verifyPartialAndNotParseable() {
  const partialResult = composeLocalExternalEvidenceAssurance(
    createCompositionInput(CASES[0], {
      mutateRaw(rawEvidence) {
        delete rawEvidence.integrity.payload_digest;
      },
    })
  );
  const notParseableResult = composeLocalExternalEvidenceAssurance(
    createCompositionInput(CASES[0], {
      mutateRaw(rawEvidence) {
        delete rawEvidence.actor.issuer;
        delete rawEvidence.receipt.identifier;
        delete rawEvidence.subject.artifact;
        delete rawEvidence.integrity.payload_digest;
        delete rawEvidence.evidence.refs;
      },
    })
  );

  assert.equal(
    partialResult.normalization_result.normalized_record.contract_validation.status,
    "contract_partially_parseable"
  );
  assert.equal(
    partialResult.assurance_bundle.verification_job.verification_status,
    "verification_not_performed"
  );
  assert.deepStrictEqual(partialResult.assurance_bundle.assurance_report.verified_claims, []);
  assert.deepStrictEqual(partialResult.composition_diagnostics, [
    {
      code: "normalization_incomplete",
      message:
        "normalized record normalized-runtime-receipt-001 remains partially parseable",
    },
  ]);
  assert.ok(
    partialResult.assurance_bundle.assurance_report.scope_limitations.includes(
      PARTIAL_SCOPE_LIMITATION
    )
  );
  assert.equal(
    JSON.stringify({
      findings: partialResult.assurance_bundle.verification_job.findings,
      unresolved: partialResult.assurance_bundle.assurance_report.unresolved_findings,
    }).includes(
      partialResult.normalization_result.normalization_findings[0].message
    ),
    false
  );

  assert.equal(
    notParseableResult.normalization_result.normalized_record.contract_validation.status,
    "contract_not_parseable"
  );
  assert.equal(notParseableResult.assurance_bundle, null);
  assert.deepStrictEqual(notParseableResult.composition_diagnostics, [
    {
      code: "normalization_not_parseable",
      message:
        "normalized record normalized-runtime-receipt-001 does not contain enough required fields for local assurance composition",
    },
  ]);
}

function verifyBindingFailures() {
  const invalidCases = [
    {
      mutate(context) {
        context.normalized_record_binding.record_id = "wrong-record";
      },
      pattern:
        /normalized record ID does not match assurance_context\.normalized_record_binding\.record_id/,
    },
    {
      mutate(context) {
        context.adapter_identity.adapter_name = "Wrong Adapter";
      },
      pattern:
        /normalized adapter name does not match assurance_context\.adapter_identity\.adapter_name/,
    },
    {
      mutate(context) {
        context.adapter.adapter_version = "9.9.9";
      },
      pattern:
        /normalized adapter version does not match assurance_context\.adapter\.adapter_version/,
    },
    {
      mutate(context) {
        context.producer.source_type = "external_verifier_output";
      },
      pattern:
        /normalized source type does not match assurance_context\.producer\.source_type/,
    },
  ];

  for (const invalidCase of invalidCases) {
    const input = createCompositionInput(CASES[0]);
    invalidCase.mutate(input.assurance_context);
    assert.throws(() => composeLocalExternalEvidenceAssurance(input), invalidCase.pattern);
  }
}

function verifyDeterminismAndIntegrity() {
  const input = createCompositionInput(CASES[1]);
  const snapshot = cloneValue(input);
  const result = composeLocalExternalEvidenceAssurance(input);
  const tamperedReport = cloneValue(result.assurance_bundle.assurance_report);
  tamperedReport.scope_limitations[0] = "tampered";
  assert.deepStrictEqual(input, snapshot);
  result.normalization_result.normalized_record.evidence.evidence_refs[0] = "mutated";
  result.assurance_bundle.assurance_report.scope_limitations[0] = "mutated";
  result.assurance_bundle.verification_job.findings[0].message = "mutated";

  const rebuiltResult = composeLocalExternalEvidenceAssurance(
    createCompositionInput(CASES[1])
  );
  assert.equal(
    rebuiltResult.normalization_result.normalized_record.evidence.evidence_refs[0],
    "evidence://synthetic/ci-provenance/build-001"
  );
  assert.equal(
    rebuiltResult.assurance_bundle.assurance_report.scope_limitations[0],
    "Synthetic CI Provenance scope remains bounded to local-only deterministic review."
  );
  assert.equal(
    rebuiltResult.assurance_bundle.verification_job.findings[0].message,
    "Synthetic CI Provenance review remains recommendation-only."
  );

  const integrityVerification = verifyAssuranceReportIntegrity(tamperedReport);
  assert.equal(integrityVerification.matches, false);
  assert.notEqual(
    integrityVerification.expectedDigest,
    integrityVerification.actualDigest
  );
}

function assertSuccessfulComposition(config, result) {
  const normalizedRecord = result.normalization_result.normalized_record;
  const verificationJob = result.assurance_bundle.verification_job;
  const assuranceReport = result.assurance_bundle.assurance_report;
  const usageRecord = result.assurance_bundle.verification_usage_record;

  assert.ok(result.assurance_bundle);
  assert.deepStrictEqual(result.composition_diagnostics, []);
  assert.equal(normalizedRecord.source.source_type, config.source_type);
  assert.equal(normalizedRecord.verification.status, "verification_not_performed");
  assert.equal(verificationJob.status, "completed");
  assert.equal(verificationJob.verification_status, "verification_not_performed");
  assert.deepStrictEqual(assuranceReport.executed_checks, []);
  assert.deepStrictEqual(assuranceReport.verified_claims, []);
  assert.deepStrictEqual(assuranceReport.failed_checks, []);
  assert.equal(verificationJob.verification_id, assuranceReport.verification_id);
  assert.equal(usageRecord.verification_id, verificationJob.verification_id);
  assert.equal(
    verificationJob.normalized_records[0].record.record_id,
    normalizedRecord.record.record_id
  );
  assert.equal(assuranceReport.producer.producer_id, config.producer_id);
  assert.equal(assuranceReport.adapter.adapter_id, config.adapter_id);
  assert.equal(
    assuranceReport.assurance_profiles[0].profile_id,
    `profile-${config.idPrefix}-001`
  );
  assert.deepStrictEqual(verifyAssuranceReportIntegrity(assuranceReport), {
    matches: true,
    algorithm: "sha256",
    expectedDigest: assuranceReport.report_integrity.digest,
    actualDigest: assuranceReport.report_integrity.digest,
  });
}

function createCompositionInput(config, options = {}) {
  const raw_evidence = createRawEvidence(config);
  if (typeof options.mutateRaw === "function") {
    options.mutateRaw(raw_evidence);
  }

  return {
    raw_evidence,
    mapping_manifest: createMappingManifest(config),
    assurance_context: createAssuranceContext(config),
  };
}

function createRawEvidence(config) {
  return config.kind === "runtime"
    ? { receipt: { identifier: "runtime-receipt-001" }, integrity: { payload_digest: "sha256:runtime-payload-digest-001", raw_payload_available: true }, actor: { issuer: "runtime-issuer-sample" }, source: { system: "synthetic-runtime-receipt-system" }, subject: { artifact: "runtime-artifact-001" }, evidence: { refs: ["evidence://synthetic/runtime-receipt/record-001"], raw_receipt_ref: "local://synthetic/runtime-receipt/receipt-001", raw_payload_ref: "local://synthetic/runtime-receipt/payload-001", external_report_uri: "local://synthetic/runtime-receipt/external-report-001" } }
    : { build: { run_id: "ci-run-001" }, artifact: { digest: "sha256:ci-artifact-digest-001", refs: ["evidence://synthetic/ci-provenance/build-001"], raw_payload_ref: "local://synthetic/ci-provenance/payload-001", external_report_uri: "local://synthetic/ci-provenance/report-001" }, revision: { source_ref: "local://synthetic/ci-provenance/run-001", issuer: "ci-system-sample" }, provenance: { system: "synthetic-ci-provenance-system" }, target: { name: "ci-artifact-001" }, access: { raw_payload_available: false } };
}

function createMappingManifest(config) {
  return {
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
    field_paths:
      config.kind === "runtime"
        ? {
            "source.source_system": ["source", "system"],
            "source.issuer": ["actor", "issuer"],
            "receipt.receipt_id": ["receipt", "identifier"],
            "receipt.raw_receipt_ref": ["evidence", "raw_receipt_ref"],
            "subject.subject": ["subject", "artifact"],
            "verification.integrity.payload_hash": ["integrity", "payload_digest"],
            "verification.integrity.raw_payload_available": [
              "integrity",
              "raw_payload_available",
            ],
            "evidence.evidence_refs": ["evidence", "refs"],
            "evidence.raw_payload_ref": ["evidence", "raw_payload_ref"],
            "evidence.external_report_uri": ["evidence", "external_report_uri"],
          }
        : {
            "source.source_system": ["provenance", "system"],
            "source.issuer": ["revision", "issuer"],
            "receipt.receipt_id": ["build", "run_id"],
            "receipt.raw_receipt_ref": ["revision", "source_ref"],
            "subject.subject": ["target", "name"],
            "verification.integrity.payload_hash": ["artifact", "digest"],
            "verification.integrity.raw_payload_available": [
              "access",
              "raw_payload_available",
            ],
            "evidence.evidence_refs": ["artifact", "refs"],
            "evidence.raw_payload_ref": ["artifact", "raw_payload_ref"],
            "evidence.external_report_uri": ["artifact", "external_report_uri"],
          },
    required_targets: REQUIRED_TARGETS.slice(),
    optional_targets: OPTIONAL_TARGETS.slice(),
    limitations: [config.limitation],
  };
}

function createAssuranceContext(config) {
  const id = (kind) => `${kind}-${config.idPrefix}-001`;
  return {
    verification_id: id("verification"),
    report_id: id("report"),
    request_id: id("request"),
    usage_record_id: id("usage"),
    evidence_package: {
      package_id: id("package"),
      package_version: "0.1",
      digest: `sha256:${config.idPrefix}-package-digest`,
      integrity_ref: `integrity://local/${id("package")}`,
    },
    producer: {
      producer_id: config.producer_id,
      producer_name: config.producer_name,
      source_type: config.source_type,
      external_reference: `local://synthetic/${config.idPrefix}/source-001`,
    },
    adapter: { adapter_id: config.adapter_id, adapter_version: "0.1.0" },
    adapter_identity: {
      adapter_name: config.adapter_name,
      adapter_version: "0.1.0",
      source_type: config.source_type,
    },
    normalized_record_binding: {
      record_id: config.record_id,
      source_type: config.source_type,
      adapter_name: config.adapter_name,
      adapter_version: "0.1.0",
    },
    assurance_profiles: [
      { profile_id: `profile-${config.idPrefix}-001`, profile_version: "0.1" },
    ],
    engine_version: "guard-core-local-composition-fixture-v0.1",
    contract_version: "0.1",
    report_schema_version: "0.1",
    created_at: "2026-07-12T09:30:00.000Z",
    started_at: "2026-07-12T09:30:05.000Z",
    completed_at: "2026-07-12T09:30:30.000Z",
    generated_at: "2026-07-12T09:30:31.000Z",
    recorded_at: "2026-07-12T09:30:32.000Z",
    caller_reference: `demo-${config.idPrefix}-composition`,
    verification_summary: `Synthetic ${config.title} composition completed without performing external verification.`,
    limitations: [
      `Synthetic ${config.title} composition remains bounded to local deterministic assembly.`,
    ],
    scope_limitations: [
      `Synthetic ${config.title} scope remains bounded to local-only deterministic review.`,
    ],
    findings: [
      {
        finding_id: `finding-${config.idPrefix}-001`,
        finding_type: "review_gap",
        category: "review",
        severity: "low",
        message: `Synthetic ${config.title} review remains recommendation-only.`,
        evidence_ref: config.record_id,
        verification_stage: "emit_findings",
        source_adapter: config.adapter_id,
      },
    ],
    unresolved_findings: [
      {
        finding_id: `finding-${config.idPrefix}-002`,
        finding_type: "missing_attachment",
        category: "evidence_completeness",
        severity: "medium",
        message: `Synthetic ${config.title} bundle intentionally omits one supporting artifact.`,
        evidence_ref: config.record_id,
        recommendation:
          "Review the absent supporting artifact before relying on this local-only composition output.",
        verification_stage: "emit_findings",
        source_adapter: config.adapter_id,
      },
    ],
    missing_evidence: [
      {
        missing_evidence_id: `missing-${config.idPrefix}-001`,
        description: `Synthetic ${config.title} omits one supporting artifact reference.`,
        evidence_refs: [config.record_id],
      },
    ],
    human_review_recommendations: [
      {
        recommendation_id: `review-${config.idPrefix}-001`,
        summary:
          "Review the normalized evidence and absent attachment before treating the composition output as complete.",
        priority: "medium",
        evidence_refs: [config.record_id],
      },
    ],
    usage: {
      evidence_package_count: 1,
      evidence_record_count: 1,
      assurance_profile_count: 1,
      verification_check_count: 0,
      cryptographic_operation_count: 1,
      evidence_chain_depth: 1,
      report_count: 1,
      retention_tier_ref: "local-only",
      human_review_requested: true,
    },
  };
}

function collectStringReferences(rootDir, pattern) {
  const matches = [];
  walkFiles(rootDir, (filePath) => {
    if (!/\.(ts|mts|cts|js|mjs|cjs)$/.test(filePath)) {
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
