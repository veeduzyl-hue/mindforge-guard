import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildLocalTechnicalUsageRecordFixture } from "../packages/guard-core/src/externalEvidence/localTechnicalUsageRecordFixture.mjs";
import {
  createLocalTechnicalUsageRecordFixtureInput,
  createLocalTechnicalUsageRecordFixtureSamples,
} from "./fixtures/local_external_evidence_technical_usage_record.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const fixtureModulePath = path.join(
  repoRoot,
  "packages/guard-core/src/externalEvidence/localTechnicalUsageRecordFixture.mjs"
);
const samplesModulePath = path.join(
  repoRoot,
  "scripts/fixtures/local_external_evidence_technical_usage_record.mjs"
);
const verifierModulePath = path.join(
  repoRoot,
  "scripts/verify_external_evidence_local_technical_usage_record.mjs"
);
const packageJsonPath = path.join(repoRoot, "package.json");
const guardCoreIndexPath = path.join(repoRoot, "packages/guard-core/src/index.ts");
const verificationTypesPath = path.join(
  repoRoot,
  "packages/guard-core/src/externalEvidence/verificationTypes.ts"
);

verifyRepositoryBoundaries();
verifyPositiveSamples();
verifyOptionalBoundaries();
verifyCrossNamespaceCoincidenceAccepted();
verifyDeterminismAndImmutability();
verifyNegativeCases();

console.log("external evidence local technical usage record verified");

function verifyRepositoryBoundaries() {
  for (const requiredFilePath of [
    fixtureModulePath,
    samplesModulePath,
    verifierModulePath,
  ]) {
    assert.equal(
      fs.existsSync(requiredFilePath),
      true,
      `required local technical usage file must exist: ${normalizePath(
        path.relative(repoRoot, requiredFilePath)
      )}`
    );
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const focusedCommand =
    "node scripts/verify_external_evidence_local_technical_usage_record.mjs";
  assert.equal(
    packageJson.scripts["verify:external-evidence:local-technical-usage-record"],
    focusedCommand,
    "package.json must expose the focused technical usage verifier"
  );
  assert.equal(
    packageJson.scripts.verify.includes(
      "verify:external-evidence:local-technical-usage-record"
    ),
    false,
    "aggregate verify must not invoke the focused technical usage script"
  );
  assert.equal(
    packageJson.scripts.verify.includes(
      "verify_external_evidence_local_technical_usage_record.mjs"
    ),
    false,
    "aggregate verify must not invoke the focused verifier directly"
  );

  const fixtureSource = fs.readFileSync(fixtureModulePath, "utf8");
  const samplesSource = fs.readFileSync(samplesModulePath, "utf8");
  const indexSource = fs.readFileSync(guardCoreIndexPath, "utf8");
  const typeSource = fs.readFileSync(verificationTypesPath, "utf8");

  assert.equal(
    indexSource.includes("localTechnicalUsageRecordFixture"),
    false,
    "technical usage fixture must not be exported from guard-core index"
  );
  assert.equal(
    indexSource.includes("buildLocalTechnicalUsageRecordFixture"),
    false,
    "technical usage builder must not be publicly exported"
  );
  assert.deepStrictEqual(
    collectStringReferences(
      path.join(repoRoot, "packages"),
      "localTechnicalUsageRecordFixture",
      fixtureModulePath
    ),
    [],
    "technical usage fixture must have no package consumers"
  );

  assert.doesNotMatch(
    fixtureSource,
    /^\s*import\s/m,
    "package fixture must consume built artifacts without importing upstream builders"
  );
  assert.equal(
    fixtureSource.includes("localIdempotencyReplayFixture"),
    false,
    "package fixture must not import or invoke the idempotency/replay fixture"
  );
  assert.equal(
    fixtureSource.includes("localVerificationJobEnvelopeFixture"),
    false,
    "package fixture must not import or invoke the Envelope fixture"
  );

  for (const expectedSampleToken of [
    "buildLocalIdempotencyReplayFixture",
    "createLocalIdempotencyReplayFixtureInput",
    "buildLocalTechnicalUsageRecordFixture",
  ]) {
    assert.equal(
      samplesSource.includes(expectedSampleToken),
      true,
      `sample layer must reuse ${expectedSampleToken}`
    );
  }

  assert.match(
    typeSource,
    /export interface VerificationUsageRecord\s*\{/,
    "existing VerificationUsageRecord must remain the canonical usage contract"
  );
  assert.doesNotMatch(
    typeSource,
    /export\s+(?:interface|type)\s+TechnicalUsageRecord\b/,
    "no new TechnicalUsageRecord type may be introduced"
  );
  assert.doesNotMatch(
    typeSource,
    /export\s+(?:interface|type)\s+BillableUsageEvent\b/,
    "no BillableUsageEvent type may be introduced"
  );

  for (const forbiddenRuntimePattern of [
    /node:fs/,
    /node:http/,
    /node:https/,
    /fetch\s*\(/,
    /process\.env/,
    /Date\.now/,
    /Math\.random/,
    /randomUUID/,
    /globalThis/,
    /persistence/i,
    /database/i,
    /cache/i,
    /queue/i,
    /worker/i,
    /scheduler/i,
  ]) {
    assert.doesNotMatch(
      fixtureSource,
      forbiddenRuntimePattern,
      `package fixture must not include runtime surface: ${forbiddenRuntimePattern}`
    );
  }

  assert.doesNotMatch(
    fixtureSource,
    /ramen/i,
    "package fixture must remain producer-neutral"
  );
  assert.doesNotMatch(
    samplesSource,
    /ramen/i,
    "sample fixture must remain producer-neutral"
  );
}

function verifyPositiveSamples() {
  const fixtureInput = createLocalTechnicalUsageRecordFixtureInput();
  const sampleOutput = createLocalTechnicalUsageRecordFixtureSamples();
  const directOutput = buildLocalTechnicalUsageRecordFixture(fixtureInput);

  assert.deepStrictEqual(
    directOutput,
    sampleOutput,
    "sample output must build deterministically from its canonical input"
  );
  assert.deepStrictEqual(Object.keys(sampleOutput).sort(), [
    "deterministic_replay_usage",
    "idempotent_resubmission_usage_resolution",
    "intentional_new_job_usage",
    "source_usage",
  ]);

  verifyUsageProjection(
    sampleOutput.source_usage,
    fixtureInput.source_envelope,
    "source_usage"
  );
  verifyUsageProjection(
    sampleOutput.deterministic_replay_usage,
    fixtureInput.deterministic_replay_envelope,
    "deterministic_replay_usage"
  );
  verifyUsageProjection(
    sampleOutput.intentional_new_job_usage,
    fixtureInput.intentional_new_job_envelope,
    "intentional_new_job_usage"
  );

  assert.deepStrictEqual(
    sampleOutput.idempotent_resubmission_usage_resolution,
    {
      resolution: "existing_technical_usage_record",
      verification_id:
        fixtureInput.source_envelope.verification_job.verification_id,
      usage_record_id:
        fixtureInput.source_envelope.verification_usage_record.usage_record_id,
    }
  );
  assert.equal(
    Object.hasOwn(
      sampleOutput.idempotent_resubmission_usage_resolution,
      "verification_usage_record"
    ),
    false,
    "idempotent resubmission must not create a new usage record"
  );

  const usageIds = [
    sampleOutput.source_usage.verification_usage_record.usage_record_id,
    sampleOutput.deterministic_replay_usage.verification_usage_record
      .usage_record_id,
    sampleOutput.intentional_new_job_usage.verification_usage_record
      .usage_record_id,
  ];
  assert.equal(
    new Set(usageIds).size,
    3,
    "three actual logical jobs must have distinct usage_record_id values"
  );

  assert.equal(
    sampleOutput.source_usage.verification_usage_record
      .cryptographic_operation_count,
    3
  );
  assert.equal(
    sampleOutput.source_usage.verification_usage_record.evidence_chain_depth,
    2
  );
  assert.equal(
    sampleOutput.source_usage.verification_usage_record.retention_tier_ref,
    sampleOutput.source_usage.verification_usage_record.retention_class
      .retention_class_id
  );
  assert.equal(
    sampleOutput.deterministic_replay_usage.verification_usage_record
      .retention_tier_ref,
    undefined,
    "replay sample should demonstrate structured-only retention"
  );
  assert.ok(
    sampleOutput.deterministic_replay_usage.verification_usage_record
      .retention_class
  );
  assert.ok(
    sampleOutput.intentional_new_job_usage.verification_usage_record
      .retention_tier_ref
  );
  assert.equal(
    sampleOutput.intentional_new_job_usage.verification_usage_record
      .retention_class,
    undefined,
    "new-job sample should demonstrate compatibility-string-only retention"
  );

  assertNoCommercialKeys(sampleOutput);
  assert.equal(
    JSON.stringify(sampleOutput).includes("ramen"),
    false,
    "sample output must not privilege Ramen"
  );
  assert.equal(
    JSON.stringify(sampleOutput).includes("authority"),
    false,
    "sample output must not introduce authority semantics"
  );
}

function verifyUsageProjection(projection, envelope, label) {
  const attempt = envelope.verification_attempts[0];
  const usage = envelope.verification_usage_record;

  assert.deepStrictEqual(projection.binding, {
    verification_id: envelope.verification_job.verification_id,
    verification_attempt_id: attempt.verification_attempt_id,
    verification_job_result_id:
      envelope.verification_job_result.verification_job_result_id,
    report_id: envelope.assurance_report.report_id,
    terminal_outcome: envelope.verification_job.status,
  });
  assert.deepStrictEqual(
    projection.verification_usage_record,
    usage,
    `${label} must preserve the existing VerificationUsageRecord`
  );
  assert.equal(usage.evidence_package_count, 1);
  assert.equal(
    usage.evidence_record_count,
    envelope.verification_job_result.normalized_records.length
  );
  assert.equal(
    usage.assurance_profile_count,
    envelope.verification_request.requested_assurance_profiles.length
  );
  assert.equal(
    usage.verification_check_count,
    envelope.assurance_report.executed_checks.length
  );
  assert.equal(usage.report_count, 1);
  assert.equal(usage.usage_schema_version, "0.1");
  assert.equal(typeof usage.recorded_at, "string");
  assert.ok(usage.recorded_at.length > 0);
}

function verifyOptionalBoundaries() {
  const noMetricsInput = createLocalTechnicalUsageRecordFixtureInput();
  delete noMetricsInput.deterministic_replay_envelope.verification_usage_record
    .cryptographic_operation_count;
  delete noMetricsInput.deterministic_replay_envelope.verification_usage_record
    .evidence_chain_depth;
  const noMetricsOutput =
    buildLocalTechnicalUsageRecordFixture(noMetricsInput);
  assert.equal(
    noMetricsOutput.deterministic_replay_usage.verification_usage_record
      .cryptographic_operation_count,
    undefined,
    "optional metrics must not be inferred"
  );
  assert.equal(
    noMetricsOutput.deterministic_replay_usage.verification_usage_record
      .evidence_chain_depth,
    undefined,
    "optional metrics must not be inferred"
  );

  const requestSideAbsentInput =
    createLocalTechnicalUsageRecordFixtureInput();
  delete requestSideAbsentInput.source_envelope.verification_request
    .human_review_context;
  const requestSideAbsentOutput = buildLocalTechnicalUsageRecordFixture(
    requestSideAbsentInput
  );
  assert.equal(
    requestSideAbsentOutput.source_usage.verification_usage_record
      .human_review_requested,
    true,
    "usage-side human review value must be preserved when request-side context is absent"
  );

  const usageSideAbsentInput = createLocalTechnicalUsageRecordFixtureInput();
  delete usageSideAbsentInput.deterministic_replay_envelope
    .verification_usage_record.human_review_requested;
  const usageSideAbsentOutput =
    buildLocalTechnicalUsageRecordFixture(usageSideAbsentInput);
  assert.equal(
    Object.hasOwn(
      usageSideAbsentOutput.deterministic_replay_usage
        .verification_usage_record,
      "human_review_requested"
    ),
    false,
    "request-side human review context must not synthesize a usage flag"
  );

  const commercialWordsInValueInput =
    createLocalTechnicalUsageRecordFixtureInput();
  const commercialWordsInValueUsage =
    commercialWordsInValueInput.source_envelope.verification_usage_record;
  commercialWordsInValueUsage.retention_tier_ref =
    "customer payment plan cost";
  commercialWordsInValueUsage.retention_class.retention_class_id =
    commercialWordsInValueUsage.retention_tier_ref;
  assert.doesNotThrow(
    () => buildLocalTechnicalUsageRecordFixture(commercialWordsInValueInput),
    "ordinary string values must not be scanned as commercial field names"
  );
}

function verifyCrossNamespaceCoincidenceAccepted() {
  const input = createLocalTechnicalUsageRecordFixtureInput();
  const source = input.source_envelope;
  source.verification_request.request_id =
    source.verification_job.verification_id;
  input.idempotent_resubmission_resolution.request_id =
    source.verification_request.request_id;
  source.verification_request.idempotency.idempotency_key =
    source.verification_usage_record.usage_record_id;
  source.verification_job.idempotency.idempotency_key =
    source.verification_usage_record.usage_record_id;
  input.deterministic_replay_envelope.verification_request.replay_context.replay_reference =
    input.deterministic_replay_envelope.assurance_report.report_id;

  assert.doesNotThrow(
    () => buildLocalTechnicalUsageRecordFixture(input),
    "fixture must not impose global cross-namespace raw-string uniqueness"
  );
}

function verifyDeterminismAndImmutability() {
  const input = createLocalTechnicalUsageRecordFixtureInput();
  const inputSnapshot = cloneValue(input);
  const firstOutput = buildLocalTechnicalUsageRecordFixture(input);
  const secondOutput = buildLocalTechnicalUsageRecordFixture(input);

  assert.deepStrictEqual(firstOutput, secondOutput);
  assert.deepStrictEqual(
    input,
    inputSnapshot,
    "fixture must not mutate caller input or upstream envelopes"
  );

  firstOutput.source_usage.verification_usage_record.recorded_at =
    "mutated-output";
  firstOutput.deterministic_replay_usage.binding.report_id =
    "mutated-report";
  const rebuiltOutput = buildLocalTechnicalUsageRecordFixture(input);
  assert.equal(
    rebuiltOutput.source_usage.verification_usage_record.recorded_at,
    input.source_envelope.verification_usage_record.recorded_at,
    "output mutation must not pollute a rebuilt projection"
  );
  assert.equal(
    rebuiltOutput.deterministic_replay_usage.binding.report_id,
    input.deterministic_replay_envelope.assurance_report.report_id,
    "binding mutation must not pollute a rebuilt projection"
  );

  const reorderedInput = {
    intentional_new_job_envelope: cloneValue(
      input.intentional_new_job_envelope
    ),
    deterministic_replay_envelope: cloneValue(
      input.deterministic_replay_envelope
    ),
    idempotent_resubmission_resolution: cloneValue(
      input.idempotent_resubmission_resolution
    ),
    source_envelope: cloneValue(input.source_envelope),
  };
  assert.deepStrictEqual(
    buildLocalTechnicalUsageRecordFixture(reorderedInput),
    rebuiltOutput,
    "input field order must not affect output"
  );
}

function verifyNegativeCases() {
  assertNegativeCase(
    "missing required envelope",
    (input) => {
      delete input.intentional_new_job_envelope;
    },
    /input must contain exactly/
  );
  assertNegativeCase(
    "negative required counter",
    (input) => {
      input.source_envelope.verification_usage_record.evidence_package_count =
        -1;
    },
    /evidence_package_count must be a non-negative integer/
  );
  assertNegativeCase(
    "fractional required counter",
    (input) => {
      input.source_envelope.verification_usage_record.report_count = 1.5;
    },
    /report_count must be a non-negative integer/
  );
  assertNegativeCase(
    "evidence count mismatch",
    (input) => {
      input.source_envelope.verification_usage_record.evidence_record_count = 0;
    },
    /evidence_record_count must match the completed envelope/
  );
  assertNegativeCase(
    "profile count mismatch",
    (input) => {
      input.source_envelope.verification_usage_record.assurance_profile_count =
        0;
    },
    /assurance_profile_count must match the completed envelope/
  );
  assertNegativeCase(
    "check count mismatch",
    (input) => {
      input.source_envelope.verification_usage_record.verification_check_count =
        0;
    },
    /verification_check_count must match the completed envelope/
  );
  assertNegativeCase(
    "report count mismatch",
    (input) => {
      input.source_envelope.verification_usage_record.report_count = 0;
    },
    /report_count must match the completed envelope/
  );
  assertNegativeCase(
    "verification id mismatch",
    (input) => {
      input.source_envelope.verification_usage_record.verification_id =
        "verification-mismatch";
    },
    /verification_id must match verification_job/
  );
  assertNegativeCase(
    "attempt id mismatch",
    (input) => {
      input.source_envelope.verification_usage_record.verification_attempt_id =
        "attempt-mismatch";
    },
    /verification_attempt_id must match/
  );
  assertNegativeCase(
    "deterministic result mismatch",
    (input) => {
      input.source_envelope.verification_usage_record.deterministic_result.verification_job_result_id =
        "result-mismatch";
    },
    /deterministic_result\.verification_job_result_id must match/
  );
  assertNegativeCase(
    "terminal outcome mismatch",
    (input) => {
      input.source_envelope.verification_usage_record.terminal_outcome =
        "completed";
    },
    /terminal_outcome must match verification_job.status/
  );
  assertNegativeCase(
    "job usage reference mismatch",
    (input) => {
      input.source_envelope.verification_job.usage_record.usage_record_id =
        "usage-mismatch";
    },
    /usage_record_id must match verification_usage_record/
  );
  assertNegativeCase(
    "result report reference mismatch",
    (input) => {
      input.source_envelope.verification_job_result.assurance_report.report_id =
        "report-mismatch";
    },
    /verification_job_result\.assurance_report\.report_id must match assurance_report\.report_id/
  );
  assertNegativeCase(
    "usage schema version mismatch",
    (input) => {
      input.source_envelope.verification_usage_record.usage_schema_version =
        "0.2";
    },
    /usage_schema_version must be 0.1/
  );
  assertNegativeCase(
    "retention conflict",
    (input) => {
      input.source_envelope.verification_usage_record.retention_class.retention_class_id =
        "retention-conflict";
    },
    /retention references must identify the same opaque class/
  );
  assertNegativeCase(
    "negative optional metric",
    (input) => {
      input.source_envelope.verification_usage_record.cryptographic_operation_count =
        -1;
    },
    /cryptographic_operation_count must be a non-negative integer/
  );
  assertNegativeCase(
    "fractional optional metric",
    (input) => {
      input.source_envelope.verification_usage_record.evidence_chain_depth =
        1.5;
    },
    /evidence_chain_depth must be a non-negative integer/
  );
  assertNegativeCase(
    "human review mismatch",
    (input) => {
      input.source_envelope.verification_usage_record.human_review_requested =
        false;
    },
    /human_review_requested must match/
  );
  assertNegativeCase(
    "normalized commercial key injection",
    (input) => {
      input.source_envelope.verification_usage_record.metadata = {
        " BILLING ": true,
      };
    },
    /must not include commercial field key: billing/
  );
  assertNegativeCase(
    "replay usage id reuse",
    (input) => {
      const sourceUsageId =
        input.source_envelope.verification_usage_record.usage_record_id;
      input.deterministic_replay_envelope.verification_usage_record.usage_record_id =
        sourceUsageId;
      input.deterministic_replay_envelope.verification_job.usage_record.usage_record_id =
        sourceUsageId;
    },
    /usage_record_id values must be distinct/
  );
  assertNegativeCase(
    "new-job usage id reuses source",
    (input) => {
      const sourceUsageId =
        input.source_envelope.verification_usage_record.usage_record_id;
      input.intentional_new_job_envelope.verification_usage_record.usage_record_id =
        sourceUsageId;
      input.intentional_new_job_envelope.verification_job.usage_record.usage_record_id =
        sourceUsageId;
    },
    /usage_record_id values must be distinct/
  );
  assertNegativeCase(
    "new-job usage id reuses replay",
    (input) => {
      const replayUsageId =
        input.deterministic_replay_envelope.verification_usage_record
          .usage_record_id;
      input.intentional_new_job_envelope.verification_usage_record.usage_record_id =
        replayUsageId;
      input.intentional_new_job_envelope.verification_job.usage_record.usage_record_id =
        replayUsageId;
    },
    /usage_record_id values must be distinct/
  );
  assertNegativeCase(
    "replay verification id reuses source",
    (input) => {
      setEnvelopeVerificationId(
        input.deterministic_replay_envelope,
        input.source_envelope.verification_job.verification_id
      );
    },
    /verification_id values must be distinct/
  );
  assertNegativeCase(
    "new-job verification id reuses source",
    (input) => {
      setEnvelopeVerificationId(
        input.intentional_new_job_envelope,
        input.source_envelope.verification_job.verification_id
      );
    },
    /verification_id values must be distinct/
  );
  assertNegativeCase(
    "new-job verification id reuses replay",
    (input) => {
      setEnvelopeVerificationId(
        input.intentional_new_job_envelope,
        input.deterministic_replay_envelope.verification_job.verification_id
      );
    },
    /verification_id values must be distinct/
  );
  assertNegativeCase(
    "wrong resubmission resolution",
    (input) => {
      input.idempotent_resubmission_resolution.resolution = "new_job";
    },
    /resolution must be same_logical_job/
  );
  assertNegativeCase(
    "wrong resubmission usage id",
    (input) => {
      input.idempotent_resubmission_resolution.usage_record_id =
        "usage-mismatch";
    },
    /usage_record_id must reference the source artifact/
  );
}

function assertNegativeCase(label, mutate, pattern) {
  const input = createLocalTechnicalUsageRecordFixtureInput();
  mutate(input);
  assert.throws(
    () => buildLocalTechnicalUsageRecordFixture(input),
    (error) => {
      assert.ok(error instanceof TypeError, `${label} should throw TypeError`);
      assert.match(error.message, pattern);
      return true;
    },
    `expected rejection for ${label}`
  );
}

function setEnvelopeVerificationId(envelope, verificationId) {
  envelope.verification_job.verification_id = verificationId;
  envelope.verification_attempts[0].verification_id = verificationId;
  envelope.verification_job_result.verification_id = verificationId;
  envelope.assurance_report.verification_id = verificationId;
  envelope.verification_usage_record.verification_id = verificationId;
}

function assertNoCommercialKeys(value) {
  const commercialKeys = [
    "amount",
    "billable",
    "billable_usage_event",
    "billing",
    "charge",
    "cost",
    "currency",
    "customer_balance",
    "invoice",
    "payment",
    "plan",
    "price",
    "rate",
    "revenue",
    "revenue_recognition",
    "subscription",
    "unit_price",
  ];

  walkValue(value, (key) => {
    assert.equal(
      commercialKeys.includes(key),
      false,
      `output must not include commercial field key: ${key}`
    );
  });
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
