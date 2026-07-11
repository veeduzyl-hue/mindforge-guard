import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  canonicalizeAssuranceReport,
  createAssuranceReportIntegrityReference,
  verifyAssuranceReportIntegrity,
} from "../packages/guard-core/src/externalEvidence/localAssuranceReportIntegrity.mjs";
import { buildLocalAssuranceReportFixture } from "../packages/guard-core/src/externalEvidence/localAssuranceReportFixture.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const fixtureModulePath = path.join(
  repoRoot,
  "packages/guard-core/src/externalEvidence/localAssuranceReportFixture.mjs"
);
const integrityModulePath = path.join(
  repoRoot,
  "packages/guard-core/src/externalEvidence/localAssuranceReportIntegrity.mjs"
);
const packageJsonPath = path.join(repoRoot, "package.json");
const guardCoreIndexPath = path.join(repoRoot, "packages/guard-core/src/index.ts");

verifyModuleBoundary();
verifyPackageScripts();
verifyIsolation();
verifyKnownAnswer();
verifyDeterministicFixture();
verifyCallerProvidedIntegrityRejected();
verifyValidationFailure();

console.log("external evidence local assurance report fixture verified");

function verifyModuleBoundary() {
  const fixtureSource = fs.readFileSync(fixtureModulePath, "utf8");
  const integritySource = fs.readFileSync(integrityModulePath, "utf8");

  const forbiddenDeterminismTokens = [
    "Date.now",
    "new Date(",
    "Math.random",
    "randomUUID",
    "process.env",
    "fetch(",
    "node:fs",
  ];

  for (const token of forbiddenDeterminismTokens) {
    assert.ok(
      !fixtureSource.includes(token),
      `fixture module must not include forbidden token: ${token}`
    );
    assert.ok(
      !integritySource.includes(token),
      `integrity helper must not include forbidden token: ${token}`
    );
  }

  assert.ok(
    integritySource.includes('const DIGEST_ALGORITHM = "sha256"') &&
      integritySource.includes("createHash(DIGEST_ALGORITHM)"),
    "integrity helper must compute SHA-256 with node:crypto"
  );
  assert.ok(
    !integritySource.includes("createHmac("),
    "integrity helper must not introduce HMAC behavior"
  );
  assert.ok(
    !integritySource.includes("signature"),
    "integrity helper must not introduce signature semantics"
  );
  assert.ok(
    !integritySource.includes("certificate"),
    "integrity helper must not introduce certificate semantics"
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
  assert.ok(
    !indexSource.includes("localAssuranceReportIntegrity"),
    "integrity helper must not be exported from guard-core index"
  );

  const fixturePackageReferences = collectStringReferences(
    path.join(repoRoot, "packages"),
    "localAssuranceReportFixture",
    fixtureModulePath
  );
  const integrityPackageReferences = collectStringReferences(
    path.join(repoRoot, "packages"),
    "localAssuranceReportIntegrity",
    integrityModulePath
  );

  assert.deepStrictEqual(
    fixturePackageReferences,
    [],
    "fixture module must remain isolated from package exports and runtime wiring"
  );
  assert.deepStrictEqual(
    integrityPackageReferences,
    [normalizePath(fixtureModulePath)],
    "integrity helper must remain local-only and only be consumed by the fixture module in package runtime code"
  );
}

function verifyKnownAnswer() {
  const knownAnswerReport = {
    verification_id: "v1",
    report_id: "r1",
    z: false,
    a: {
      b: [2, 1],
      a: "x",
    },
    report_integrity: {
      digest: "88504f36a850ced3b4ce0f1fade841b74b1371c2663b3ee7566ad794baf33814",
      digest_algorithm: "sha256",
      integrity_ref:
        "guard-local-integrity://assurance-report/v0.1?artifact=assurance_report&report_id=r1&verification_id=v1&canonicalization=guard-local-assurance-report-v0.1&digest_encoding=hex",
    },
  };
  const expectedCanonical =
    '{"a":{"a":"x","b":[2,1]},"report_id":"r1","verification_id":"v1","z":false}';
  const expectedDigest =
    "88504f36a850ced3b4ce0f1fade841b74b1371c2663b3ee7566ad794baf33814";

  assert.equal(
    canonicalizeAssuranceReport(knownAnswerReport),
    expectedCanonical,
    "known-answer canonical string must match the fixed expected value"
  );

  const generatedIntegrity =
    createAssuranceReportIntegrityReference(knownAnswerReport);
  assert.equal(
    generatedIntegrity.digest,
    expectedDigest,
    "known-answer digest must match the fixed SHA-256 value"
  );
  assert.deepStrictEqual(verifyAssuranceReportIntegrity(knownAnswerReport), {
    matches: true,
    algorithm: "sha256",
    expectedDigest,
    actualDigest: expectedDigest,
  });
}

function verifyDeterministicFixture() {
  const fixtureInput = createFixtureInput();
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

  const report = firstResult.assurance_report;
  const integrity = report.report_integrity;

  assert.ok(integrity, "fixture must generate a report integrity reference");
  assert.equal(integrity.digest_algorithm, "sha256");
  assert.match(integrity.digest, /^[0-9a-f]{64}$/);
  assert.ok(
    integrity.integrity_ref.includes(
      "canonicalization=guard-local-assurance-report-v0.1"
    ),
    "integrity reference must declare the canonicalization profile"
  );
  assert.ok(
    integrity.integrity_ref.includes("digest_encoding=hex"),
    "integrity reference must declare the digest encoding"
  );
  assert.ok(
    integrity.integrity_ref.includes("artifact=assurance_report"),
    "integrity reference must declare the covered artifact type"
  );
  assert.ok(
    integrity.integrity_ref.includes(
      `report_id=${encodeURIComponent(fixtureInput.report_id)}`
    ),
    "integrity reference must bind the covered report id"
  );
  assert.ok(
    integrity.integrity_ref.includes(
      `verification_id=${encodeURIComponent(fixtureInput.verification_id)}`
    ),
    "integrity reference must bind the covered verification id"
  );

  const integrityVerification = verifyAssuranceReportIntegrity(report);
  assert.deepStrictEqual(integrityVerification, {
    matches: true,
    algorithm: "sha256",
    expectedDigest: integrity.digest,
    actualDigest: integrity.digest,
  });

  const canonicalReport = canonicalizeAssuranceReport(report);
  assert.ok(
    !canonicalReport.includes('"report_integrity"'),
    "canonical report projection must exclude report_integrity"
  );
  assert.ok(
    !canonicalReport.includes(integrity.digest),
    "canonical report projection must not include the declared digest value"
  );
  assert.ok(
    canonicalReport.includes(
      '"One upstream confirmation artifact is intentionally absent."'
    ),
    "canonical report projection must include unresolved findings content"
  );
  assert.ok(
    canonicalReport.includes(
      '"Upstream attestation record not included in the local bundle."'
    ),
    "canonical report projection must include missing evidence content"
  );
  assert.ok(
    canonicalReport.includes(
      '"This fixture does not represent a production external evidence producer."'
    ),
    "canonical report projection must include scope limitations"
  );
  assert.ok(
    canonicalReport.includes(
      '"Review the absent attestation before treating this evidence as complete."'
    ),
    "canonical report projection must include human-review recommendations"
  );
  assert.ok(
    canonicalReport.includes(
      '"The local evidence package is bound to the supplied request."'
    ),
    "canonical report projection must include verified claims"
  );
  assert.ok(
    canonicalReport.includes(
      '"Fixture package structure matches the declared schema shape."'
    ),
    "canonical report projection must include check summaries"
  );
  assert.ok(
    canonicalReport.includes('"generated_at":"2026-07-11T09:30:31.000Z"'),
    "canonical report projection must preserve timestamps"
  );
  assert.ok(
    canonicalReport.includes('"engine_version":"guard-core-fixture-engine-v0.1"'),
    "canonical report projection must preserve engine version"
  );
  assert.ok(
    canonicalReport.includes('"digest":"sha256%3Afixture-package-digest"') === false,
    "canonical report string should remain plain JSON, not URL encoded report content"
  );
  assert.ok(
    canonicalReport.includes('"digest":"sha256:fixture-package-digest"'),
    "canonical report projection must preserve evidence package references"
  );

  const directIntegrity = createAssuranceReportIntegrityReference(report);
  assert.deepStrictEqual(
    directIntegrity,
    integrity,
    "direct helper generation must match fixture-generated integrity"
  );

  const rebuiltResult = buildLocalAssuranceReportFixture(fixtureInput);
  rebuiltResult.assurance_report.executed_checks[0].summary = "mutated";
  rebuiltResult.verification_job.findings[0].message = "mutated";
  rebuiltResult.verification_job.normalized_records[0].record.record_id =
    "mutated-record";
  rebuiltResult.verification_usage_record.retention_tier_ref = "changed";

  const freshResult = buildLocalAssuranceReportFixture(fixtureInput);
  assert.equal(
    freshResult.assurance_report.executed_checks[0].summary,
    fixtureInput.executed_checks[0].summary,
    "rebuilt fixture must not retain mutated executed check state"
  );
  assert.equal(
    freshResult.verification_job.findings[0].message,
    fixtureInput.findings[0].message,
    "job findings must be cloned per invocation"
  );
  assert.equal(
    freshResult.verification_job.normalized_records[0].record.record_id,
    fixtureInput.normalized_records[0].record.record_id,
    "normalized records must be cloned per invocation"
  );
  assert.equal(
    freshResult.verification_usage_record.retention_tier_ref,
    fixtureInput.verification_usage_record.retention_tier_ref,
    "usage record must be cloned per invocation"
  );

  const reorderedInput = reorderKeysDeep(fixtureInput);
  const reorderedResult = buildLocalAssuranceReportFixture(reorderedInput);
  assert.equal(
    reorderedResult.assurance_report.report_integrity.digest,
    integrity.digest,
    "same fixture content with different key insertion order must keep the same digest"
  );

  const reorderedReport = reorderKeysDeep(report);
  const reorderedReportIntegrity =
    createAssuranceReportIntegrityReference(reorderedReport);
  assert.equal(
    reorderedReportIntegrity.digest,
    integrity.digest,
    "same report content with different key insertion order must keep the same digest"
  );
  assert.equal(
    verifyAssuranceReportIntegrity(reorderedReport).matches,
    true,
    "key insertion order changes must not break integrity verification"
  );

  const digestOnlyTamper = cloneValue(report);
  digestOnlyTamper.report_integrity.digest = "0".repeat(64);
  const digestOnlyVerification = verifyAssuranceReportIntegrity(
    digestOnlyTamper
  );
  assert.equal(
    digestOnlyVerification.matches,
    false,
    "changing only the declared digest must produce an integrity mismatch"
  );
  assert.equal(
    digestOnlyVerification.actualDigest,
    integrity.digest,
    "recomputed digest must remain stable when only the declared digest changes"
  );

  expectTamperMismatch(report, (tampered) => {
    tampered.unresolved_findings[0].message =
      "Changed unresolved finding content.";
  }, "finding content tamper must be detected");
  expectTamperMismatch(report, (tampered) => {
    tampered.unresolved_findings[0].severity = "critical";
  }, "finding severity tamper must be detected");
  expectTamperMismatch(report, (tampered) => {
    tampered.verified_claims[0].summary = "Changed verified claim.";
  }, "verified claim tamper must be detected");
  expectTamperMismatch(report, (tampered) => {
    tampered.missing_evidence[0].description =
      "Changed missing evidence description.";
  }, "missing evidence tamper must be detected");
  expectTamperMismatch(report, (tampered) => {
    tampered.scope_limitations[0] = "Changed scope limitation.";
  }, "limitation tamper must be detected");
  expectTamperMismatch(report, (tampered) => {
    tampered.human_review_recommendations[0].summary =
      "Changed recommendation summary.";
  }, "recommendation tamper must be detected");
  expectTamperMismatch(report, (tampered) => {
    tampered.generated_at = "2026-07-11T09:30:32.000Z";
  }, "timestamp tamper must be detected");
  expectTamperMismatch(report, (tampered) => {
    tampered.engine_version = "guard-core-fixture-engine-v0.2";
  }, "version tamper must be detected");
  expectTamperMismatch(report, (tampered) => {
    tampered.evidence_package.integrity_ref =
      "integrity://local/package-local-002";
  }, "reference tamper must be detected");
  expectTamperMismatch(report, (tampered) => {
    tampered.executed_checks.reverse();
  }, "array-order tamper must be detected");

  const unsupportedUndefinedReport = cloneValue(report);
  unsupportedUndefinedReport.verification_summary = undefined;
  assert.throws(
    () => createAssuranceReportIntegrityReference(unsupportedUndefinedReport),
    /unsupported canonical report value/
  );

  const unsupportedDateReport = cloneValue(report);
  unsupportedDateReport.generated_at = new Date("2026-07-11T09:30:31.000Z");
  assert.throws(
    () => createAssuranceReportIntegrityReference(unsupportedDateReport),
    /unsupported canonical report value/
  );

  const cyclicReport = cloneValue(report);
  const cyclicEvidenceRefs = ["record-local-001"];
  cyclicEvidenceRefs.push(cyclicEvidenceRefs);
  cyclicReport.executed_checks[0].evidence_refs = cyclicEvidenceRefs;
  assert.throws(
    () => createAssuranceReportIntegrityReference(cyclicReport),
    /unsupported canonical report value/
  );

  const symbolKeyReport = cloneValue(report);
  symbolKeyReport[Symbol("shadow")] = "hidden";
  assert.throws(
    () => createAssuranceReportIntegrityReference(symbolKeyReport),
    /symbol-keyed property/
  );

  const accessorReport = cloneValue(report);
  Object.defineProperty(accessorReport.producer, "producer_name", {
    enumerable: true,
    get() {
      return "getter-value";
    },
  });
  assert.throws(
    () => createAssuranceReportIntegrityReference(accessorReport),
    /accessor property/
  );

  const toJsonReport = cloneValue(report);
  Object.defineProperty(toJsonReport.adapter, "toJSON", {
    enumerable: false,
    value() {
      return { adapter_id: "shadow" };
    },
  });
  assert.throws(
    () => createAssuranceReportIntegrityReference(toJsonReport),
    /toJSON property is not supported/
  );

  const unsupportedAlgorithmReport = cloneValue(report);
  unsupportedAlgorithmReport.report_integrity.digest_algorithm = "sha512";
  assert.throws(
    () => verifyAssuranceReportIntegrity(unsupportedAlgorithmReport),
    /digest_algorithm must be sha256/
  );

  const unsupportedEncodingReport = cloneValue(report);
  unsupportedEncodingReport.report_integrity.integrity_ref =
    unsupportedEncodingReport.report_integrity.integrity_ref.replace(
      "digest_encoding=hex",
      "digest_encoding=base64"
    );
  assert.throws(
    () => verifyAssuranceReportIntegrity(unsupportedEncodingReport),
    /digest_encoding=hex/
  );

  const unsupportedProfileReport = cloneValue(report);
  unsupportedProfileReport.report_integrity.integrity_ref =
    unsupportedProfileReport.report_integrity.integrity_ref.replace(
      "canonicalization=guard-local-assurance-report-v0.1",
      "canonicalization=other-profile"
    );
  assert.throws(
    () => verifyAssuranceReportIntegrity(unsupportedProfileReport),
    /canonicalization=guard-local-assurance-report-v0.1/
  );

  const shortDigestReport = cloneValue(report);
  shortDigestReport.report_integrity.digest = "abcd";
  assert.throws(
    () => verifyAssuranceReportIntegrity(shortDigestReport),
    /64-character hexadecimal SHA-256 digest/
  );

  const nonHexDigestReport = cloneValue(report);
  nonHexDigestReport.report_integrity.digest = "z".repeat(64);
  assert.throws(
    () => verifyAssuranceReportIntegrity(nonHexDigestReport),
    /64-character hexadecimal SHA-256 digest/
  );
}

function verifyCallerProvidedIntegrityRejected() {
  const fixtureInput = createFixtureInput();
  fixtureInput.report_integrity = {
    digest: "deadbeef",
    digest_algorithm: "sha256",
    integrity_ref: "guard-local-integrity://assurance-report/v0.1?fake=true",
  };

  assert.throws(
    () => buildLocalAssuranceReportFixture(fixtureInput),
    /report_integrity is generated by the fixture and must not be provided/
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

function createFixtureInput() {
  return {
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
        summary:
          "Signature validation is not available for this synthetic fixture.",
        evidence_refs: ["record-local-001"],
      },
    ],
    findings: [
      {
        finding_id: "finding-local-001",
        finding_type: "integrity_gap",
        severity: "medium",
        category: "integrity",
        message:
          "Only partial integrity inputs were available in the local bundle.",
        evidence_ref: "record-local-001",
        recommendation:
          "Treat integrity claims as partial until the absent attestation is supplied.",
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
        recommendation:
          "Obtain the missing upstream attestation for external review.",
        verification_stage: "emit_findings",
        source_adapter: "adapter-generic-local",
      },
    ],
    missing_evidence: [
      {
        missing_evidence_id: "missing-local-001",
        description:
          "Upstream attestation record not included in the local bundle.",
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
        summary:
          "Review the absent attestation before treating this evidence as complete.",
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
}

function expectTamperMismatch(report, mutate, message) {
  const tamperedReport = cloneValue(report);
  mutate(tamperedReport);
  const verification = verifyAssuranceReportIntegrity(tamperedReport);

  assert.equal(verification.matches, false, message);
  assert.notEqual(
    verification.actualDigest,
    verification.expectedDigest,
    `${message}: expected digest and actual digest must diverge`
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

function reorderKeysDeep(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => reorderKeysDeep(entry));
  }

  if (isPlainObject(value)) {
    const reordered = {};
    for (const key of Object.keys(value).sort().reverse()) {
      reordered[key] = reorderKeysDeep(value[key]);
    }
    return reordered;
  }

  return value;
}

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function normalizePath(filePath) {
  return filePath.replaceAll("\\", "/");
}
