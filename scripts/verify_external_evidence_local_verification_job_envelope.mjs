import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildLocalAssuranceReportFixture } from "../packages/guard-core/src/externalEvidence/localAssuranceReportFixture.mjs";
import { verifyAssuranceReportIntegrity } from "../packages/guard-core/src/externalEvidence/localAssuranceReportIntegrity.mjs";
import { buildLocalVerificationJobEnvelopeFixture } from "../packages/guard-core/src/externalEvidence/localVerificationJobEnvelopeFixture.mjs";
import {
  createCompletedVerificationJobEnvelopeInput,
  createCompletedWithFindingsVerificationJobEnvelopeInput,
  createLocalVerificationJobEnvelopeSamples,
} from "./fixtures/local_external_evidence_verification_job_envelope.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const fixtureModulePath = path.join(
  repoRoot,
  "packages/guard-core/src/externalEvidence/localVerificationJobEnvelopeFixture.mjs"
);
const samplesModulePath = path.join(
  repoRoot,
  "scripts/fixtures/local_external_evidence_verification_job_envelope.mjs"
);
const packageJsonPath = path.join(repoRoot, "package.json");
const packageLockPath = path.join(repoRoot, "package-lock.json");
const guardCoreIndexPath = path.join(repoRoot, "packages/guard-core/src/index.ts");

verifyModuleBoundary();
verifyPackageScripts();
verifyIsolationBoundary();
verifySamples();
verifyNoForbiddenFields();
verifyRepoBoundaries();
verifyAggregateVerifyUnchanged();

console.log("external evidence local verification job envelope verified");

function verifyModuleBoundary() {
  const fixtureSource = fs.readFileSync(fixtureModulePath, "utf8");
  const samplesSource = fs.readFileSync(samplesModulePath, "utf8");

  assert.ok(
    fixtureSource.includes(
      'import { buildLocalAssuranceReportFixture } from "./localAssuranceReportFixture.mjs";'
    ),
    "fixture module must import the canonical local assurance report fixture"
  );
  assert.ok(
    fixtureSource.includes(
      'import { verifyAssuranceReportIntegrity } from "./localAssuranceReportIntegrity.mjs";'
    ),
    "fixture module must import the canonical local assurance report integrity verifier"
  );

  for (const forbiddenToken of [
    "\\u0046",
    "\\u0079",
    "\\\\u",
    "import(",
    'import { createHash } from "node:crypto";',
    "createHash(",
    "DIGEST_ALGORITHM",
    "DIGEST_ENCODING",
    "CANONICALIZATION_PROFILE",
    "INTEGRITY_REFERENCE_PREFIX",
    "projectReportContent",
    "canonicalizeProjectedValue",
    "serializeCanonicalValue",
    "serializeArray",
    "serializePlainObject",
    "buildIntegrityReference",
    "createReportIntegrityReference",
    "verifyGeneratedReportIntegrity",
    "Date.now",
    "new Date(",
    "Math.random",
    "randomUUID",
    "process.env",
    "fetch(",
    "node:fs",
    "child_process",
    "setTimeout(",
    "setInterval(",
    "queue",
    "persist",
    "invoice",
    "payment",
    "billing",
    "ramen",
    "approve",
    "approval",
    "permit",
    "authorize",
    "authority_scope",
  ]) {
    assert.equal(
      fixtureSource.includes(forbiddenToken),
      false,
      `fixture module must not include forbidden token: ${forbiddenToken}`
    );
  }

  for (const sampleOnlyToken of [
    "producer-generic-runtime-001",
    "producer-generic-ci-001",
    "request-generic-runtime-001",
    "request-generic-ci-001",
  ]) {
    assert.equal(
      fixtureSource.includes(sampleOnlyToken),
      false,
      `fixture module must remain producer-neutral in production code: ${sampleOnlyToken}`
    );
  }

  assert.ok(
    samplesSource.includes("completed_with_findings"),
    "sample fixture must include the findings case"
  );
}

function verifyPackageScripts() {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  assert.equal(
    packageJson.scripts["verify:external-evidence:local-verification-job-envelope"],
    "node scripts/verify_external_evidence_local_verification_job_envelope.mjs"
  );
}

function verifyIsolationBoundary() {
  const indexSource = fs.readFileSync(guardCoreIndexPath, "utf8");

  assert.equal(
    indexSource.includes("localVerificationJobEnvelopeFixture"),
    false,
    "fixture module must not be exported from guard-core index"
  );
  assert.deepStrictEqual(
    collectStringReferences(
      path.join(repoRoot, "packages"),
      "localVerificationJobEnvelopeFixture",
      fixtureModulePath
    ),
    [],
    "fixture module must remain isolated from package exports and runtime wiring"
  );
}

function verifySamples() {
  const completedInput = createCompletedVerificationJobEnvelopeInput();
  const completedInputSnapshot = cloneValue(completedInput);
  const findingsInput = createCompletedWithFindingsVerificationJobEnvelopeInput();
  const findingsInputSnapshot = cloneValue(findingsInput);
  const samples = createLocalVerificationJobEnvelopeSamples();
  const completed = samples.completed;
  const completedWithFindings = samples.completed_with_findings;

  assert.deepStrictEqual(
    buildLocalVerificationJobEnvelopeFixture(completedInput),
    completed,
    "completed sample must build deterministically"
  );
  assert.deepStrictEqual(
    buildLocalVerificationJobEnvelopeFixture(findingsInput),
    completedWithFindings,
    "completed_with_findings sample must build deterministically"
  );
  assert.deepStrictEqual(
    completedInput,
    completedInputSnapshot,
    "builder must not mutate the completed sample input"
  );
  assert.deepStrictEqual(
    findingsInput,
    findingsInputSnapshot,
    "builder must not mutate the findings sample input"
  );

  for (const sample of [completed, completedWithFindings]) {
    verifyEnvelopeShape(sample);
    verifyReferenceConsistency(sample);
    verifyIntegrity(sample);
    verifyCompatibilityProjections(sample);
  }

  verifyNoAutoGeneratedClaims();
  verifyNegativeCases();

  assert.equal(
    completed.verification_attempts.length,
    1,
    "completed sample must contain exactly one attempt"
  );
  assert.equal(
    completedWithFindings.verification_attempts.length,
    1,
    "findings sample must contain exactly one attempt"
  );
  assert.deepStrictEqual(
    completed.verification_job_result.findings ?? [],
    [],
    "completed sample must not contain findings"
  );
  assert.ok(
    (completedWithFindings.verification_job_result.findings ?? []).length >= 1,
    "completed_with_findings sample must contain at least one finding"
  );
}

function verifyEnvelopeShape(sample) {
  assert.deepStrictEqual(
    Object.keys(sample).sort(),
    [
      "assurance_report",
      "verification_attempts",
      "verification_job",
      "verification_job_result",
      "verification_request",
      "verification_usage_record",
    ]
  );
}

function verifyReferenceConsistency(sample) {
  const request = sample.verification_request;
  const job = sample.verification_job;
  const attempt = sample.verification_attempts[0];
  const result = sample.verification_job_result;
  const report = sample.assurance_report;
  const usage = sample.verification_usage_record;

  assert.equal(job.request.request_id, request.request_id);
  assert.equal(
    job.evidence_package.package_id,
    request.evidence_package.package_id
  );
  assert.equal(job.adapter.adapter_id, request.adapter.adapter_id);
  assert.deepStrictEqual(
    job.assurance_profiles,
    request.requested_assurance_profiles
  );
  assert.equal(job.verification_id, attempt.verification_id);
  assert.equal(job.verification_id, result.verification_id);
  assert.equal(job.verification_id, report.verification_id);
  assert.equal(job.verification_id, usage.verification_id);
  assert.equal(job.attempts[0].verification_attempt_id, attempt.verification_attempt_id);
  assert.equal(job.attempts[0].attempt_number, 1);
  assert.equal(attempt.attempt_number, 1);
  assert.equal(
    attempt.result.verification_job_result_id,
    result.verification_job_result_id
  );
  assert.equal(
    job.result.verification_job_result_id,
    result.verification_job_result_id
  );
  assert.equal(
    result.verification_attempt_id,
    attempt.verification_attempt_id
  );
  assert.equal(result.assurance_report.report_id, report.report_id);
  assert.equal(job.assurance_report.report_id, report.report_id);
  assert.equal(usage.verification_attempt_id, attempt.verification_attempt_id);
  assert.equal(
    usage.deterministic_result.verification_job_result_id,
    result.verification_job_result_id
  );
  assert.equal(usage.terminal_outcome, job.status);
  assert.equal(
    usage.report_count,
    report === null ? 0 : 1
  );
  assert.equal(job.status, result.job_status);
  assert.equal(result.report_integrity_status, "valid");
  assert.equal(attempt.status, "completed");
}

function verifyIntegrity(sample) {
  const report = sample.assurance_report;
  const integrityVerification = verifyAssuranceReportIntegrity(report);

  assert.deepStrictEqual(integrityVerification, {
    matches: true,
    algorithm: "sha256",
    expectedDigest: report.report_integrity.digest,
    actualDigest: report.report_integrity.digest,
  });

  const expectedReport = buildExpectedAssuranceReport(sample);
  assert.deepStrictEqual(
    report,
    expectedReport,
    "envelope assurance_report must remain semantically aligned with the established local assurance report fixture"
  );
}

function verifyCompatibilityProjections(sample) {
  const job = sample.verification_job;
  const result = sample.verification_job_result;

  assert.deepStrictEqual(
    job.normalized_records ?? [],
    result.normalized_records ?? [],
    "job.normalized_records must match canonical result.normalized_records"
  );
  assert.deepStrictEqual(
    job.findings ?? [],
    result.findings ?? [],
    "job.findings must match canonical result.findings"
  );
  assert.deepStrictEqual(
    sample.assurance_report.unresolved_findings,
    result.findings ?? [],
    "report.unresolved_findings must match canonical result.findings"
  );
  assert.deepStrictEqual(
    job.assurance_report,
    result.assurance_report,
    "job.assurance_report must match canonical result.assurance_report"
  );
}

function verifyNoForbiddenFields() {
  const samples = createLocalVerificationJobEnvelopeSamples();
  const outputJson = JSON.stringify(samples);

  for (const forbiddenField of [
    "approval",
    "approve",
    "authorized",
    "billing",
    "invoice",
    "payment",
    "queue",
    "runtime_execution",
    "network_request",
    "persistence",
    "ramen",
  ]) {
    assert.equal(
      outputJson.includes(forbiddenField),
      false,
      `fixture output must not include forbidden field or identifier: ${forbiddenField}`
    );
  }
}

function verifyNoAutoGeneratedClaims() {
  const input = createCompletedVerificationJobEnvelopeInput();
  input.assurance_report.verified_claims = [];
  const output = buildLocalVerificationJobEnvelopeFixture(input);

  assert.deepStrictEqual(
    output.assurance_report.verified_claims,
    [],
    "fixture must not auto-generate verified claims"
  );
  assert.deepStrictEqual(
    verifyAssuranceReportIntegrity(output.assurance_report),
    {
      matches: true,
      algorithm: "sha256",
      expectedDigest: output.assurance_report.report_integrity.digest,
      actualDigest: output.assurance_report.report_integrity.digest,
    },
    "report integrity validity must not create verified claims"
  );
}

function verifyNegativeCases() {
  assertNegativeCase(
    "completed status with findings",
    (input) => {
      input.verification_job_result.findings = [
        cloneValue(
          createCompletedWithFindingsVerificationJobEnvelopeInput()
            .verification_job_result.findings[0]
        ),
      ];
      input.assurance_report.unresolved_findings = cloneValue(
        input.verification_job_result.findings
      );
    },
    /verification_job_result\.findings must be empty/
  );
  assertNegativeCase(
    "completed_with_findings without findings",
    (input) => {
      input.verification_job_result.findings = [];
      input.assurance_report.unresolved_findings = [];
    },
    /must contain at least one finding/
  );
  assertNegativeCase(
    "result and report findings mismatch",
    (input) => {
      input.assurance_report.unresolved_findings[0].message = "mismatch";
    },
    /assurance_report\.unresolved_findings must match verification_job_result\.findings/
  );
  assertNegativeCase(
    "caller-provided report_integrity_status",
    (input) => {
      input.verification_job_result.report_integrity_status = "valid";
    },
    /report_integrity_status is derived by the fixture/
  );
  assertNegativeCase(
    "unknown verification status on job",
    (input) => {
      input.verification_job.verification_status = "unknown_status";
    },
    /verification_job\.verification_status must be one of/
  );
  assertNegativeCase(
    "unknown verification status on result",
    (input) => {
      input.verification_job_result.verification_status = "unknown_status";
    },
    /verification_job_result\.verification_status must be one of/
  );
  assertNegativeCase(
    "negative usage counter",
    (input) => {
      input.verification_usage_record.evidence_record_count = -1;
    },
    /must be a non-negative integer/
  );
  assertNegativeCase(
    "fractional usage counter",
    (input) => {
      input.verification_usage_record.evidence_record_count = 1.5;
    },
    /must be a non-negative integer/
  );
  assertNegativeCase(
    "evidence record count mismatch",
    (input) => {
      input.verification_usage_record.evidence_record_count = 2;
    },
    /evidence_record_count must match verification_job_result\.normalized_records\.length/
  );
  assertNegativeCase(
    "assurance profile count mismatch",
    (input) => {
      input.verification_usage_record.assurance_profile_count = 2;
    },
    /assurance_profile_count must match verification_request\.requested_assurance_profiles\.length/
  );
  assertNegativeCase(
    "verification check count mismatch",
    (input) => {
      input.verification_usage_record.verification_check_count = 3;
    },
    /verification_check_count must match assurance_report\.executed_checks\.length/
  );
  assertNegativeCase(
    "report count mismatch",
    (input) => {
      input.verification_usage_record.report_count = 0;
    },
    /report_count must be 1/
  );
  assertNegativeCase(
    "conflicting retention references",
    (input) => {
      input.verification_usage_record.retention_class.retention_class_id =
        "other-tier";
    },
    /retention_class\.retention_class_id must match verification_usage_record\.retention_tier_ref/
  );
  assertNegativeCase(
    "usage verification id mismatch",
    (input) => {
      input.verification_usage_record.verification_id = "wrong-verification-id";
    },
    /verification_usage_record\.verification_id must match verification_job\.verification_id/
  );
  assertNegativeCase(
    "usage attempt id mismatch",
    (input) => {
      input.verification_usage_record.verification_attempt_id =
        "wrong-attempt-id";
    },
    /verification_usage_record\.verification_attempt_id must match verification_attempt\.verification_attempt_id/
  );
  assertNegativeCase(
    "usage deterministic result mismatch",
    (input) => {
      input.verification_usage_record.deterministic_result.verification_job_result_id =
        "wrong-result-id";
    },
    /deterministic_result\.verification_job_result_id must match verification_job_result\.verification_job_result_id/
  );
  assertNegativeCase(
    "usage terminal outcome mismatch",
    (input) => {
      input.verification_usage_record.terminal_outcome =
        "completed_with_findings";
    },
    /terminal_outcome must match verification_job\.status/
  );
}

function verifyRepoBoundaries() {
  assert.equal(
    runGitPathDiff("package-lock.json"),
    "",
    "package-lock.json must remain unchanged"
  );
  assert.equal(
    runGitPathDiff("packages/guard-core/src/index.ts"),
    "",
    "packages/guard-core/src/index.ts must remain unchanged"
  );
}

function verifyAggregateVerifyUnchanged() {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  assert.equal(
    packageJson.scripts.verify,
    "npm run verify:core && npm run verify:v612 && npm run verify:external-evidence:type-contract"
  );
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

    const source = fs.readFileSync(filePath, "utf8");
    if (source.includes(pattern)) {
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

function runGitPathDiff(relativePath) {
  return execFileSync(
    "git",
    ["diff", "--name-only", "--", relativePath],
    { cwd: repoRoot, encoding: "utf8" }
  ).trim();
}

function buildExpectedAssuranceReport(sample) {
  const request = sample.verification_request;
  const job = sample.verification_job;
  const result = sample.verification_job_result;
  const report = sample.assurance_report;
  const usage = sample.verification_usage_record;

  return buildLocalAssuranceReportFixture({
    verification_id: job.verification_id,
    report_id: report.report_id,
    request_id: request.request_id,
    ...(request.caller_reference !== undefined
      ? { caller_reference: request.caller_reference }
      : {}),
    job_status: job.status,
    ...(result.verification_status !== undefined
      ? { verification_status: result.verification_status }
      : {}),
    contract_version: job.contract_version,
    engine_version: job.engine_version,
    report_schema_version: report.report_schema_version,
    created_at: job.created_at,
    ...(job.started_at !== undefined ? { started_at: job.started_at } : {}),
    ...(job.completed_at !== undefined
      ? { completed_at: job.completed_at }
      : {}),
    generated_at: report.generated_at,
    evidence_package: cloneValue(request.evidence_package),
    producer: cloneValue(report.producer),
    adapter: cloneValue(request.adapter),
    assurance_profiles: cloneValue(request.requested_assurance_profiles),
    executed_checks: cloneValue(report.executed_checks),
    verified_claims: cloneValue(report.verified_claims),
    failed_checks: cloneValue(report.failed_checks),
    findings: cloneValue(result.findings ?? []),
    unresolved_findings: cloneValue(report.unresolved_findings),
    missing_evidence: cloneValue(report.missing_evidence),
    limitations: cloneValue(job.limitations ?? []),
    scope_limitations: cloneValue(report.scope_limitations),
    human_review_recommendations: cloneValue(
      report.human_review_recommendations
    ),
    ...(result.normalized_records !== undefined
      ? { normalized_records: cloneValue(result.normalized_records) }
      : {}),
    ...(report.verification_summary !== undefined
      ? { verification_summary: report.verification_summary }
      : {}),
    verification_usage_record: {
      usage_record_id: usage.usage_record_id,
      verification_id: usage.verification_id,
      evidence_package_count: usage.evidence_package_count,
      evidence_record_count: usage.evidence_record_count,
      assurance_profile_count: usage.assurance_profile_count,
      verification_check_count: usage.verification_check_count,
      ...(usage.cryptographic_operation_count !== undefined
        ? {
            cryptographic_operation_count:
              usage.cryptographic_operation_count,
          }
        : {}),
      ...(usage.evidence_chain_depth !== undefined
        ? { evidence_chain_depth: usage.evidence_chain_depth }
        : {}),
      report_count: usage.report_count,
      ...(usage.retention_tier_ref !== undefined
        ? { retention_tier_ref: usage.retention_tier_ref }
        : {}),
      ...(usage.human_review_requested !== undefined
        ? { human_review_requested: usage.human_review_requested }
        : {}),
      recorded_at: usage.recorded_at,
      usage_schema_version: usage.usage_schema_version,
    },
  }).assurance_report;
}

function assertNegativeCase(label, mutate, pattern) {
  const input =
    label === "completed status with findings" ||
    label === "caller-provided report_integrity_status" ||
    label === "unknown verification status on job" ||
    label === "unknown verification status on result" ||
    label === "negative usage counter" ||
    label === "fractional usage counter" ||
    label === "evidence record count mismatch" ||
    label === "assurance profile count mismatch" ||
    label === "verification check count mismatch" ||
    label === "report count mismatch" ||
    label === "usage verification id mismatch" ||
    label === "usage attempt id mismatch" ||
    label === "usage deterministic result mismatch" ||
    label === "usage terminal outcome mismatch"
      ? createCompletedVerificationJobEnvelopeInput()
      : createCompletedWithFindingsVerificationJobEnvelopeInput();

  mutate(input);

  assert.throws(
    () => buildLocalVerificationJobEnvelopeFixture(input),
    pattern,
    `expected rejection for ${label}`
  );
}
