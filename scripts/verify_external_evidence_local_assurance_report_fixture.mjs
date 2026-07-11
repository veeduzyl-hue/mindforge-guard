import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildLocalAssuranceReportFixture } from "../packages/guard-core/src/externalEvidence/localAssuranceReportFixture.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const fixtureModulePath = path.join(
  repoRoot,
  "packages/guard-core/src/externalEvidence/localAssuranceReportFixture.mjs"
);
const packageJsonPath = path.join(repoRoot, "package.json");
const guardCoreIndexPath = path.join(repoRoot, "packages/guard-core/src/index.ts");

verifyModuleBoundary();
verifyPackageScripts();
verifyIsolation();
verifyDeterministicFixture();
verifyValidationFailure();

console.log("external evidence local assurance report fixture verified");

function verifyModuleBoundary() {
  const source = fs.readFileSync(fixtureModulePath, "utf8");
  const forbiddenTokens = [
    "Date.now",
    "new Date(",
    "Math.random",
    "randomUUID",
    "process.env",
    "fetch(",
    "node:fs",
    "node:crypto",
    "ramen",
    "billing",
    "approval",
    "blocking",
    "certification",
    "deployment control",
    "dynamic loading",
    "persistence",
  ];

  for (const token of forbiddenTokens) {
    assert.ok(
      !source.includes(token),
      `fixture module must not include forbidden token: ${token}`
    );
  }

  assert.ok(
    !/\bimport\s+/.test(source),
    "fixture module must remain standalone with no imports"
  );
}

function verifyPackageScripts() {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  assert.equal(
    packageJson.scripts["verify:external-evidence:local-assurance-report"],
    "node scripts/verify_external_evidence_local_assurance_report_fixture.mjs"
  );
  assert.equal(
    packageJson.scripts.verify,
    "npm run verify:core && npm run verify:v612 && npm run verify:external-evidence:type-contract"
  );
}

function verifyIsolation() {
  const indexSource = fs.readFileSync(guardCoreIndexPath, "utf8");
  assert.ok(
    !indexSource.includes("localAssuranceReportFixture"),
    "fixture module must not be exported from guard-core index"
  );

  const packageReferences = collectStringReferences(
    path.join(repoRoot, "packages"),
    "localAssuranceReportFixture",
    fixtureModulePath
  );

  assert.deepStrictEqual(
    packageReferences,
    [],
    "fixture module must remain isolated from package exports and runtime wiring"
  );
}

function verifyDeterministicFixture() {
  const fixtureInput = {
    verification_id: "verification-local-001",
    report_id: "report-local-001",
    request_id: "request-local-001",
    caller_reference: "demo-local-assurance",
    job_status: "completed_with_findings",
    verification_status: "partially_verified",
    contract_version: "0.1",
    engine_version: "guard-core-fixture-engine-v0.1",
    report_schema_version: "0.1",
    created_at: "2026-07-11T09:30:00.000Z",
    started_at: "2026-07-11T09:30:05.000Z",
    completed_at: "2026-07-11T09:30:30.000Z",
    generated_at: "2026-07-11T09:30:31.000Z",
    evidence_package: {
      package_id: "package-local-001",
      package_version: "0.1",
      digest: "sha256:fixture-package-digest",
      integrity_ref: "integrity://local/package-local-001",
    },
    producer: {
      producer_id: "producer-synthetic-local",
      producer_name: "Synthetic Local Evidence Producer",
      source_type: "external_verifier_output",
      external_reference: "local://synthetic/source-001",
    },
    adapter: {
      adapter_id: "adapter-generic-local",
      adapter_version: "0.1.0",
    },
    assurance_profiles: [
      {
        profile_id: "profile-basic-local-assurance",
        profile_version: "0.1",
      },
    ],
    executed_checks: [
      {
        check_type: "structural_validity",
        status: "verified",
        summary: "Fixture package structure matches the declared schema shape.",
        evidence_refs: ["record-local-001"],
      },
      {
        check_type: "digest_integrity",
        status: "partially_verified",
        summary: "Digest verified for provided record subset only.",
        evidence_refs: ["record-local-001"],
      },
    ],
    verified_claims: [
      {
        claim_id: "claim-local-001",
        claim_type: "evidence_binding",
        summary: "The local evidence package is bound to the supplied request.",
        evidence_refs: ["record-local-001"],
      },
    ],
    failed_checks: [
      {
        check_type: "signature_validity",
        status: "unsupported",
        summary: "Signature validation is not available for this synthetic fixture.",
        evidence_refs: ["record-local-001"],
      },
    ],
    findings: [
      {
        finding_id: "finding-local-001",
        finding_type: "integrity_gap",
        severity: "medium",
        category: "integrity",
        message: "Only partial integrity inputs were available in the local bundle.",
        evidence_ref: "record-local-001",
        recommendation: "Treat integrity claims as partial until the absent attestation is supplied.",
        verification_stage: "verify",
        source_adapter: "adapter-generic-local",
      },
    ],
    unresolved_findings: [
      {
        finding_id: "finding-local-002",
        finding_type: "missing_attestation",
        severity: "high",
        category: "evidence_completeness",
        message: "One upstream confirmation artifact is intentionally absent.",
        evidence_ref: "record-local-002",
        recommendation: "Obtain the missing upstream attestation for external review.",
        verification_stage: "emit_findings",
        source_adapter: "adapter-generic-local",
      },
    ],
    missing_evidence: [
      {
        missing_evidence_id: "missing-local-001",
        description: "Upstream attestation record not included in the local bundle.",
        evidence_refs: ["record-local-002"],
      },
    ],
    limitations: [
      "Local fixture coverage is bounded to deterministic offline verification only.",
    ],
    scope_limitations: [
      "This fixture does not represent a production external evidence producer.",
    ],
    human_review_recommendations: [
      {
        recommendation_id: "review-local-001",
        summary: "Review the absent attestation before treating this evidence as complete.",
        priority: "high",
        evidence_refs: ["record-local-002"],
      },
    ],
    normalized_records: [
      {
        record: {
          record_id: "normalized-record-local-001",
          record_version: "0.1",
          generated_at: "2026-07-11T09:30:10.000Z",
        },
        adapter: {
          adapter_name: "Generic Local Adapter",
          adapter_version: "0.1.0",
          source_type: "external_verifier_output",
        },
        source: {
          source_system: "synthetic-local-source",
          source_type: "external_verifier_output",
          issuer: "Synthetic Local Evidence Producer",
          trust_status: "unknown",
        },
        receipt: {
          receipt_id: "receipt-local-001",
          receipt_version: "0.1",
          raw_receipt_ref: "local://synthetic/receipt-001",
        },
        subject: {
          subject: "demo-artifact",
          subject_type: "synthetic_payload",
          action_summary: "Local assurance fixture verification",
        },
        verification: {
          status: "partially_verified",
          integrity: {
            payload_hash: "sha256:fixture-payload-hash",
            hash_algorithm: "sha256",
            raw_payload_available: true,
            payload_hash_status: "match",
          },
          diagnostics: [],
        },
        contract_validation: {
          status: "contract_parseable",
          required_fields_present: true,
          missing_required_fields: [],
          diagnostics: [],
        },
        evidence: {
          evidence_refs: ["record-local-001"],
          raw_payload_ref: "local://synthetic/payload-001",
          external_report_uri: "local://synthetic/external-report-001",
          completeness_status: "partial",
        },
        diagnostics: [],
        findings: [
          {
            finding_id: "finding-local-003",
            finding_type: "review_gap",
            category: "review",
            severity: "low",
            message: "Additional reviewer context may still be useful.",
            evidence_ref: "record-local-001",
            source_adapter: "adapter-generic-local",
          },
        ],
      },
    ],
    report_integrity: {
      digest: "sha256:fixture-report-digest",
      digest_algorithm: "sha256",
      integrity_ref: "integrity://local/report-local-001",
    },
    verification_summary:
      "Synthetic local assurance report fixture completed with bounded findings.",
    verification_usage_record: {
      usage_record_id: "usage-local-001",
      verification_id: "verification-local-001",
      evidence_package_count: 1,
      evidence_record_count: 2,
      assurance_profile_count: 1,
      verification_check_count: 3,
      cryptographic_operation_count: 1,
      evidence_chain_depth: 1,
      report_count: 1,
      retention_tier_ref: "local-only",
      human_review_requested: true,
      recorded_at: "2026-07-11T09:30:32.000Z",
      usage_schema_version: "0.1",
    },
  };

  const originalInput = cloneValue(fixtureInput);
  const firstResult = buildLocalAssuranceReportFixture(fixtureInput);
  const secondResult = buildLocalAssuranceReportFixture(fixtureInput);

  assert.deepStrictEqual(
    firstResult,
    secondResult,
    "fixture output must be deterministic for identical input"
  );
  assert.deepStrictEqual(
    fixtureInput,
    originalInput,
    "fixture builder must not mutate the caller input"
  );

  assert.equal(firstResult.verification_job.verification_id, fixtureInput.verification_id);
  assert.equal(firstResult.verification_job.request.request_id, fixtureInput.request_id);
  assert.equal(firstResult.verification_job.request.caller_reference, fixtureInput.caller_reference);
  assert.equal(firstResult.verification_job.status, fixtureInput.job_status);
  assert.equal(
    firstResult.verification_job.verification_status,
    fixtureInput.verification_status
  );
  assert.equal(
    firstResult.verification_job.assurance_report.report_id,
    fixtureInput.report_id
  );
  assert.equal(
    firstResult.verification_job.usage_record.usage_record_id,
    fixtureInput.verification_usage_record.usage_record_id
  );
  assert.deepStrictEqual(
    firstResult.verification_job.findings,
    fixtureInput.findings,
    "job findings must be preserved without reclassification"
  );
  assert.deepStrictEqual(
    firstResult.verification_job.limitations,
    fixtureInput.limitations,
    "job limitations must remain distinct from report scope limitations"
  );
  assert.deepStrictEqual(
    firstResult.verification_job.normalized_records,
    fixtureInput.normalized_records
  );
  assert.equal(
    firstResult.verification_job.normalized_records[0].record.record_version,
    "0.1"
  );
  assert.equal(
    firstResult.verification_job.normalized_records[0].source.source_type,
    "external_verifier_output"
  );

  assert.equal(firstResult.assurance_report.report_id, fixtureInput.report_id);
  assert.equal(
    firstResult.assurance_report.verification_id,
    fixtureInput.verification_id
  );
  assert.deepStrictEqual(firstResult.assurance_report.producer, fixtureInput.producer);
  assert.deepStrictEqual(firstResult.assurance_report.adapter, fixtureInput.adapter);
  assert.deepStrictEqual(
    firstResult.assurance_report.assurance_profiles,
    fixtureInput.assurance_profiles
  );
  assert.deepStrictEqual(
    firstResult.assurance_report.executed_checks,
    fixtureInput.executed_checks
  );
  assert.deepStrictEqual(
    firstResult.assurance_report.verified_claims,
    fixtureInput.verified_claims
  );
  assert.equal(firstResult.assurance_report.verified_claims.length, 1);
  assert.deepStrictEqual(
    firstResult.assurance_report.failed_checks,
    fixtureInput.failed_checks
  );
  assert.deepStrictEqual(
    firstResult.assurance_report.unresolved_findings,
    fixtureInput.unresolved_findings
  );
  assert.equal(
    firstResult.assurance_report.unresolved_findings[0].severity,
    fixtureInput.unresolved_findings[0].severity
  );
  assert.deepStrictEqual(
    firstResult.assurance_report.missing_evidence,
    fixtureInput.missing_evidence
  );
  assert.deepStrictEqual(
    firstResult.assurance_report.scope_limitations,
    fixtureInput.scope_limitations
  );
  assert.deepStrictEqual(
    firstResult.assurance_report.human_review_recommendations,
    fixtureInput.human_review_recommendations
  );
  assert.deepStrictEqual(
    firstResult.assurance_report.report_integrity,
    fixtureInput.report_integrity
  );
  assert.equal(
    firstResult.assurance_report.verification_summary,
    fixtureInput.verification_summary
  );
  assert.deepStrictEqual(
    firstResult.verification_usage_record,
    fixtureInput.verification_usage_record
  );

  firstResult.assurance_report.executed_checks[0].summary = "mutated";
  firstResult.verification_job.findings[0].message = "mutated";
  firstResult.verification_job.normalized_records[0].record.record_id = "mutated-record";
  firstResult.verification_usage_record.retention_tier_ref = "changed";

  const rebuiltResult = buildLocalAssuranceReportFixture(fixtureInput);
  assert.equal(
    rebuiltResult.assurance_report.executed_checks[0].summary,
    fixtureInput.executed_checks[0].summary,
    "rebuilt fixture must not retain mutated nested state from prior output"
  );
  assert.equal(
    rebuiltResult.verification_job.findings[0].message,
    fixtureInput.findings[0].message,
    "job findings must be cloned per invocation"
  );
  assert.equal(
    rebuiltResult.verification_job.normalized_records[0].record.record_id,
    fixtureInput.normalized_records[0].record.record_id,
    "normalized records must be cloned per invocation"
  );
  assert.equal(
    rebuiltResult.verification_usage_record.retention_tier_ref,
    fixtureInput.verification_usage_record.retention_tier_ref,
    "usage record must be cloned per invocation"
  );
}

function verifyValidationFailure() {
  assert.throws(
    () =>
      buildLocalAssuranceReportFixture({
        verification_id: "verification-local-001",
        report_id: "report-local-001",
        request_id: "request-local-001",
        job_status: "completed",
        contract_version: "0.1",
        engine_version: "fixture",
        report_schema_version: "0.1",
        created_at: "2026-07-11T09:30:00.000Z",
        generated_at: "2026-07-11T09:30:31.000Z",
        evidence_package: {
          package_id: "package-local-001",
        },
        producer: {
          source_type: "external_verifier_output",
        },
        adapter: {
          adapter_id: "adapter-generic-local",
          adapter_version: "0.1.0",
        },
        assurance_profiles: [],
        executed_checks: [],
        verified_claims: [],
        failed_checks: [],
        findings: [],
        unresolved_findings: [],
        missing_evidence: [],
        limitations: [],
        scope_limitations: [],
        human_review_recommendations: [],
        verification_usage_record: {
          usage_record_id: "usage-local-001",
          verification_id: "verification-local-999",
          evidence_package_count: 1,
          evidence_record_count: 1,
          assurance_profile_count: 1,
          verification_check_count: 1,
          report_count: 1,
          recorded_at: "2026-07-11T09:30:32.000Z",
          usage_schema_version: "0.1",
        },
      }),
    /verification_usage_record\.verification_id must match verification_id/
  );
}

function collectStringReferences(rootDir, pattern, excludedFilePath) {
  const matches = [];
  const normalizedExcludedPath = excludedFilePath
    ? normalizePath(excludedFilePath)
    : null;

  walkFiles(rootDir, (filePath) => {
    if (!/\.(ts|mts|cts|js|mjs|cjs)$/.test(filePath)) {
      return;
    }

    if (normalizePath(filePath) === normalizedExcludedPath) {
      return;
    }

    const source = fs.readFileSync(filePath, "utf8");
    if (source.includes(pattern)) {
      matches.push(normalizePath(filePath));
    }
  });

  return matches;
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
