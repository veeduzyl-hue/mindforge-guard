import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildLocalVerificationJobEnvelopeFixture } from "../packages/guard-core/src/externalEvidence/localVerificationJobEnvelopeFixture.mjs";
import { buildLocalIdempotencyReplayFixture } from "../packages/guard-core/src/externalEvidence/localIdempotencyReplayFixture.mjs";
import {
  createDeterministicReplayEnvelopeInput,
  createIdempotentResubmissionRequest,
  createIntentionalNewJobEnvelopeInput,
  createLocalIdempotencyReplayFixtureInput,
  createLocalIdempotencyReplayFixtureSamples,
  createSourceEnvelopeInput,
} from "./fixtures/local_external_evidence_idempotency_replay.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const fixtureModulePath = path.join(
  repoRoot,
  "packages/guard-core/src/externalEvidence/localIdempotencyReplayFixture.mjs"
);
const samplesModulePath = path.join(
  repoRoot,
  "scripts/fixtures/local_external_evidence_idempotency_replay.mjs"
);
const verifierModulePath = path.join(
  repoRoot,
  "scripts/verify_external_evidence_local_idempotency_replay.mjs"
);
const packageJsonPath = path.join(repoRoot, "package.json");
const guardCoreIndexPath = path.join(repoRoot, "packages/guard-core/src/index.ts");

verifyModuleBoundary();
verifyPackageScripts();
verifyIsolationBoundary();
verifyPositiveSamples();
verifyDeterminismAndImmutability();
verifyNegativeCases();
verifyRepoBoundaries();

console.log("external evidence local idempotency replay verified");

function verifyModuleBoundary() {
  const fixtureSource = fs.readFileSync(fixtureModulePath, "utf8");
  const sampleSource = fs.readFileSync(samplesModulePath, "utf8");

  assert.ok(
    fixtureSource.includes(
      'import { buildLocalVerificationJobEnvelopeFixture } from "./localVerificationJobEnvelopeFixture.mjs";'
    ),
    "fixture module must statically import the existing verification job envelope fixture"
  );

  for (const forbiddenToken of [
    "node:fs",
    "fetch(",
    "process.env",
    "Date.now",
    "new Date(",
    "Math.random",
    "randomUUID",
    "import(",
    "child_process",
    "new Map(",
    "globalThis.",
    "buildLocalAssuranceReportFixture",
    "verifyAssuranceReportIntegrity",
    "createHash(",
    "billing",
    "invoice",
    "payment",
    "authority",
    "ramen",
  ]) {
    assert.equal(
      fixtureSource.includes(forbiddenToken),
      false,
      `fixture module must not include forbidden token: ${forbiddenToken}`
    );
  }

  assert.ok(
    sampleSource.includes("buildLocalIdempotencyReplayFixture"),
    "sample fixture should exercise the local idempotency replay fixture"
  );
}

function verifyPackageScripts() {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  assert.equal(
    packageJson.scripts["verify:external-evidence:local-idempotency-replay"],
    "node scripts/verify_external_evidence_local_idempotency_replay.mjs"
  );
  assert.equal(
    packageJson.scripts.verify,
    "npm run verify:core && npm run verify:v612 && npm run verify:external-evidence:type-contract"
  );
}

function verifyIsolationBoundary() {
  const indexSource = fs.readFileSync(guardCoreIndexPath, "utf8");

  assert.equal(
    indexSource.includes("localIdempotencyReplayFixture"),
    false,
    "fixture module must not be exported from guard-core index"
  );
  assert.deepStrictEqual(
    collectStringReferences(
      path.join(repoRoot, "packages"),
      "localIdempotencyReplayFixture",
      fixtureModulePath
    ),
    [],
    "fixture module must remain isolated from package exports and runtime wiring"
  );
}

function verifyPositiveSamples() {
  const fixtureInput = createLocalIdempotencyReplayFixtureInput();
  const sampleOutput = createLocalIdempotencyReplayFixtureSamples();
  const directOutput = buildLocalIdempotencyReplayFixture(fixtureInput);

  assert.deepStrictEqual(
    directOutput,
    sampleOutput,
    "sample output must build deterministically from the canonical sample input"
  );

  const expectedKeys = [
    "deterministic_replay_envelope",
    "idempotent_resubmission_resolution",
    "intentional_new_job_envelope",
    "source_envelope",
  ];
  assert.deepStrictEqual(Object.keys(sampleOutput).sort(), expectedKeys);

  const sourceEnvelope = sampleOutput.source_envelope;
  const replayEnvelope = sampleOutput.deterministic_replay_envelope;
  const intentionalNewJobEnvelope = sampleOutput.intentional_new_job_envelope;
  const resubmissionResolution =
    sampleOutput.idempotent_resubmission_resolution;

  assert.ok(
    sourceEnvelope.verification_request.idempotency,
    "source envelope must carry a full idempotency boundary"
  );
  assert.deepStrictEqual(
    sourceEnvelope.verification_job.idempotency,
    sourceEnvelope.verification_request.idempotency,
    "source job must project the caller-provided idempotency boundary"
  );
  assert.equal(
    sourceEnvelope.verification_request.replay_context,
    undefined,
    "source envelope must not include replay_context"
  );
  assert.equal(
    sourceEnvelope.verification_job.replay_context,
    undefined,
    "source job must not include replay_context"
  );
  assert.equal(
    sourceEnvelope.verification_attempts[0].replay_context,
    undefined,
    "source attempt must not include replay_context"
  );

  assert.deepStrictEqual(resubmissionResolution, {
    resolution: "same_logical_job",
    request_id: sourceEnvelope.verification_request.request_id,
    verification_id: sourceEnvelope.verification_job.verification_id,
    verification_attempt_id:
      sourceEnvelope.verification_attempts[0].verification_attempt_id,
    verification_job_result_id:
      sourceEnvelope.verification_job_result.verification_job_result_id,
    report_id: sourceEnvelope.assurance_report.report_id,
    usage_record_id: sourceEnvelope.verification_usage_record.usage_record_id,
  });

  assert.equal(
    replayEnvelope.verification_request.replay_context.replay_mode,
    "deterministic_reexecution"
  );
  assert.deepStrictEqual(
    replayEnvelope.verification_request.replay_context,
    replayEnvelope.verification_job.replay_context,
    "replay request and job replay_context must match"
  );
  assert.deepStrictEqual(
    replayEnvelope.verification_request.replay_context,
    replayEnvelope.verification_attempts[0].replay_context,
    "replay request and attempt replay_context must match"
  );
  assert.equal(
    replayEnvelope.verification_request.replay_context.source_verification_id,
    sourceEnvelope.verification_job.verification_id
  );
  assert.equal(
    replayEnvelope.verification_request.replay_context
      .source_verification_attempt_id,
    sourceEnvelope.verification_attempts[0].verification_attempt_id
  );
  assert.deepStrictEqual(
    replayEnvelope.verification_request.evidence_package,
    sourceEnvelope.verification_request.evidence_package,
    "replay must preserve evidence_package"
  );
  assert.deepStrictEqual(
    replayEnvelope.verification_request.adapter,
    sourceEnvelope.verification_request.adapter,
    "replay must preserve adapter"
  );
  assert.deepStrictEqual(
    replayEnvelope.verification_request.requested_assurance_profiles,
    sourceEnvelope.verification_request.requested_assurance_profiles,
    "replay must preserve assurance profiles"
  );
  assert.notEqual(
    replayEnvelope.verification_request.request_id,
    sourceEnvelope.verification_request.request_id,
    "replay must create a new request_id"
  );
  assert.notEqual(
    replayEnvelope.verification_job.verification_id,
    sourceEnvelope.verification_job.verification_id,
    "replay must create a new verification_id"
  );
  assert.notEqual(
    replayEnvelope.verification_attempts[0].verification_attempt_id,
    sourceEnvelope.verification_attempts[0].verification_attempt_id,
    "replay must create a new verification_attempt_id"
  );
  assert.notEqual(
    replayEnvelope.verification_job_result.verification_job_result_id,
    sourceEnvelope.verification_job_result.verification_job_result_id,
    "replay must create a new verification_job_result_id"
  );
  assert.notEqual(
    replayEnvelope.assurance_report.report_id,
    sourceEnvelope.assurance_report.report_id,
    "replay must not reuse the source report identity"
  );
  assert.notEqual(
    replayEnvelope.verification_usage_record.usage_record_id,
    sourceEnvelope.verification_usage_record.usage_record_id,
    "replay must create a new verification_usage_record"
  );

  assert.deepStrictEqual(
    intentionalNewJobEnvelope.verification_request.evidence_package,
    sourceEnvelope.verification_request.evidence_package,
    "intentional new job should keep the same evidence package selection"
  );
  assert.deepStrictEqual(
    intentionalNewJobEnvelope.verification_request.adapter,
    sourceEnvelope.verification_request.adapter,
    "intentional new job should keep the same adapter selection"
  );
  assert.deepStrictEqual(
    intentionalNewJobEnvelope.verification_request.requested_assurance_profiles,
    sourceEnvelope.verification_request.requested_assurance_profiles,
    "intentional new job should keep the same assurance profiles"
  );
  assert.notDeepStrictEqual(
    intentionalNewJobEnvelope.verification_request.idempotency,
    sourceEnvelope.verification_request.idempotency,
    "intentional new job must be outside the source idempotency boundary"
  );
  assert.equal(
    intentionalNewJobEnvelope.verification_request.replay_context,
    undefined,
    "intentional new job must not include replay_context"
  );
  assert.equal(
    intentionalNewJobEnvelope.verification_job.replay_context,
    undefined,
    "intentional new job job must not include replay_context"
  );
  assert.notEqual(
    intentionalNewJobEnvelope.verification_request.request_id,
    sourceEnvelope.verification_request.request_id,
    "intentional new job must use a new request_id"
  );
  assert.notEqual(
    intentionalNewJobEnvelope.verification_job.verification_id,
    sourceEnvelope.verification_job.verification_id,
    "intentional new job must use a new verification_id"
  );
  assert.notEqual(
    intentionalNewJobEnvelope.assurance_report.report_id,
    sourceEnvelope.assurance_report.report_id,
    "intentional new job must use a new report_id"
  );

  const outputJson = JSON.stringify(sampleOutput);
  for (const forbiddenToken of [
    "retry_count",
    "retry_policy",
    "automatic_retry",
    "backoff",
    "worker",
    "queue",
    "billing",
    "invoice",
    "payment",
    "authority",
    "ramen",
  ]) {
    assert.equal(
      outputJson.includes(forbiddenToken),
      false,
      `output must not include forbidden token: ${forbiddenToken}`
    );
  }

  const sourceEnvelopeBuilderProjection =
    buildLocalVerificationJobEnvelopeFixture(fixtureInput.source_envelope_input);
  assert.equal(
    sourceEnvelopeBuilderProjection.verification_job.verification_id,
    sourceEnvelope.verification_job.verification_id,
    "existing envelope builder must remain the service-side identity source"
  );
}

function verifyDeterminismAndImmutability() {
  const fixtureInput = createLocalIdempotencyReplayFixtureInput();
  const fixtureInputSnapshot = cloneValue(fixtureInput);
  const firstOutput = buildLocalIdempotencyReplayFixture(fixtureInput);
  const secondOutput = buildLocalIdempotencyReplayFixture(fixtureInput);

  assert.deepStrictEqual(
    firstOutput,
    secondOutput,
    "same input must produce deep-equal output"
  );
  assert.deepStrictEqual(
    fixtureInput,
    fixtureInputSnapshot,
    "fixture builder must not mutate the caller input"
  );

  const mutatedOutput = cloneValue(firstOutput);
  mutatedOutput.source_envelope.assurance_report.report_id = "mutated-report";
  mutatedOutput.deterministic_replay_envelope.verification_job.verification_id =
    "mutated-verification";

  const rebuiltOutput = buildLocalIdempotencyReplayFixture(fixtureInput);
  assert.equal(
    rebuiltOutput.source_envelope.assurance_report.report_id,
    firstOutput.source_envelope.assurance_report.report_id,
    "source envelope must remain immutable across builds"
  );
  assert.equal(
    rebuiltOutput.deterministic_replay_envelope.verification_job.verification_id,
    firstOutput.deterministic_replay_envelope.verification_job.verification_id,
    "replay output must remain immutable across builds"
  );

  const reorderedInput = {
    intentional_new_job_envelope_input: cloneValue(
      fixtureInput.intentional_new_job_envelope_input
    ),
    replay_envelope_input: cloneValue(fixtureInput.replay_envelope_input),
    idempotent_resubmission_request: cloneValue(
      fixtureInput.idempotent_resubmission_request
    ),
    source_envelope_input: cloneValue(fixtureInput.source_envelope_input),
  };

  assert.deepStrictEqual(
    buildLocalIdempotencyReplayFixture(reorderedInput),
    firstOutput,
    "replay/new-job assembly order must not affect output"
  );
}

function verifyNegativeCases() {
  assertNegativeCase(
    "key mismatch",
    (input) => {
      input.idempotent_resubmission_request.idempotency.idempotency_key =
        "idempotency-key-mismatch";
    },
    /idempotent_resubmission_request\.idempotency\.idempotency_key mismatch/
  );
  assertNegativeCase(
    "scope mismatch",
    (input) => {
      input.idempotent_resubmission_request.idempotency.scope_reference =
        "scope://local/external-evidence/mismatch";
    },
    /idempotent_resubmission_request\.idempotency\.scope_reference mismatch/
  );
  assertNegativeCase(
    "fingerprint mismatch",
    (input) => {
      input.idempotent_resubmission_request.idempotency.request_fingerprint_ref =
        "fingerprint://local/external-evidence/mismatch";
    },
    /idempotent_resubmission_request\.idempotency\.request_fingerprint_ref mismatch/
  );
  assertNegativeCase(
    "evidence mismatch",
    (input) => {
      input.idempotent_resubmission_request.evidence_package.package_id =
        "package-idempotency-mismatch";
    },
    /idempotent_resubmission_request\.evidence_package mismatch/
  );
  assertNegativeCase(
    "adapter mismatch",
    (input) => {
      input.idempotent_resubmission_request.adapter.adapter_id =
        "adapter-idempotency-mismatch";
    },
    /idempotent_resubmission_request\.adapter mismatch/
  );
  assertNegativeCase(
    "profile mismatch",
    (input) => {
      input.idempotent_resubmission_request.requested_assurance_profiles[0].profile_id =
        "profile-idempotency-mismatch";
    },
    /idempotent_resubmission_request\.requested_assurance_profiles mismatch/
  );
  assertNegativeCase(
    "request id mismatch",
    (input) => {
      input.idempotent_resubmission_request.request_id =
        "request-idempotency-mismatch";
    },
    /idempotent_resubmission_request\.request_id mismatch/
  );
  assertNegativeCase(
    "caller reference mismatch",
    (input) => {
      input.idempotent_resubmission_request.caller_reference =
        "demo-local-idempotency-mismatch";
    },
    /idempotent_resubmission_request\.caller_reference mismatch/
  );
  assertNegativeCase(
    "resubmission replay context",
    (input) => {
      input.idempotent_resubmission_request.replay_context = {
        replay_mode: "deterministic_reexecution",
        replay_reference: "replay-reference-invalid",
        source_verification_id: "verification-service-source-001",
        source_verification_attempt_id: "attempt-service-source-001",
      };
    },
    /idempotent_resubmission_request\.replay_context must not be provided/
  );
  assertNegativeCase(
    "replay source verification mismatch",
    (input) => {
      input.replay_envelope_input.verification_request.replay_context.source_verification_id =
        "verification-service-mismatch";
      input.replay_envelope_input.verification_job.replay_context.source_verification_id =
        "verification-service-mismatch";
      input.replay_envelope_input.verification_attempt.replay_context.source_verification_id =
        "verification-service-mismatch";
    },
    /replay_context\.source_verification_id mismatch/
  );
  assertNegativeCase(
    "replay source attempt mismatch",
    (input) => {
      input.replay_envelope_input.verification_request.replay_context.source_verification_attempt_id =
        "attempt-service-mismatch";
      input.replay_envelope_input.verification_job.replay_context.source_verification_attempt_id =
        "attempt-service-mismatch";
      input.replay_envelope_input.verification_attempt.replay_context.source_verification_attempt_id =
        "attempt-service-mismatch";
    },
    /replay_context\.source_verification_attempt_id mismatch/
  );
  assertNegativeCase(
    "replay evidence drift",
    (input) => {
      input.replay_envelope_input.verification_request.evidence_package.package_id =
        "package-idempotency-replay-drift";
    },
    /deterministic replay must preserve evidence_package/
  );
  assertNegativeCase(
    "replay adapter drift",
    (input) => {
      input.replay_envelope_input.verification_request.adapter.adapter_id =
        "adapter-idempotency-replay-drift";
    },
    /deterministic replay must preserve adapter/
  );
  assertNegativeCase(
    "replay profile drift",
    (input) => {
      input.replay_envelope_input.verification_request.requested_assurance_profiles[0].profile_id =
        "profile-idempotency-replay-drift";
    },
    /deterministic replay must preserve requested_assurance_profiles/
  );
  assertNegativeCase(
    "replay service id reuse",
    (input) => {
      input.replay_envelope_input.assurance_report.report_id =
        input.source_envelope_input.assurance_report.report_id;
    },
    /deterministic replay must not reuse the source report_id/
  );
  assertNegativeCase(
    "intentional new job same boundary",
    (input) => {
      input.intentional_new_job_envelope_input.verification_request.idempotency =
        cloneValue(input.source_envelope_input.verification_request.idempotency);
      input.intentional_new_job_envelope_input.verification_job.idempotency =
        cloneValue(input.source_envelope_input.verification_request.idempotency);
    },
    /intentional new job must be outside the source idempotency boundary/
  );
  assertNegativeCase(
    "intentional new job replay context",
    (input) => {
      const replayContext = cloneValue(
        input.replay_envelope_input.verification_request.replay_context
      );
      input.intentional_new_job_envelope_input.verification_request.replay_context =
        replayContext;
      input.intentional_new_job_envelope_input.verification_job.replay_context =
        cloneValue(replayContext);
      input.intentional_new_job_envelope_input.verification_attempt.replay_context =
        cloneValue(replayContext);
    },
    /intentional_new_job_envelope_input must not include replay_context/
  );
}

function verifyRepoBoundaries() {
  for (const requiredFilePath of [
    fixtureModulePath,
    samplesModulePath,
    verifierModulePath,
  ]) {
    assert.equal(
      fs.existsSync(requiredFilePath),
      true,
      `required local fixture file must exist: ${normalizePath(
        path.relative(repoRoot, requiredFilePath)
      )}`
    );
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const focusedVerifyCommand =
    "node scripts/verify_external_evidence_local_idempotency_replay.mjs";
  assert.equal(
    packageJson.scripts["verify:external-evidence:local-idempotency-replay"],
    focusedVerifyCommand,
    "package.json must expose the focused idempotency replay verifier"
  );
  assert.equal(
    packageJson.scripts.verify.includes(
      "verify:external-evidence:local-idempotency-replay"
    ),
    false,
    "aggregate verify must not invoke the focused verifier by script name"
  );
  assert.equal(
    packageJson.scripts.verify.includes(
      "verify_external_evidence_local_idempotency_replay.mjs"
    ),
    false,
    "aggregate verify must not invoke the focused verifier directly"
  );

  const indexSource = fs.readFileSync(guardCoreIndexPath, "utf8");
  for (const privateExportName of [
    "localIdempotencyReplayFixture",
    "buildLocalIdempotencyReplayFixture",
  ]) {
    assert.equal(
      indexSource.includes(privateExportName),
      false,
      `guard-core index must not export ${privateExportName}`
    );
  }

  const fixtureSource = fs.readFileSync(fixtureModulePath, "utf8");
  const staticEnvelopeImport =
    'import { buildLocalVerificationJobEnvelopeFixture } from "./localVerificationJobEnvelopeFixture.mjs";';
  assert.equal(
    fixtureSource.includes(staticEnvelopeImport),
    true,
    "fixture must reuse the envelope fixture through the plain static import"
  );
  assert.equal(
    countOccurrences(fixtureSource, "localVerificationJobEnvelopeFixture.mjs"),
    1,
    "fixture must reference the envelope fixture only through its static import"
  );
  assert.doesNotMatch(
    fixtureSource,
    /\\u[0-9a-f]{4}/i,
    "fixture must not encode its module import with Unicode escapes"
  );
  assert.doesNotMatch(
    fixtureSource,
    /import\s*\(/,
    "fixture must not use dynamic imports"
  );
  assert.doesNotMatch(
    fixtureSource,
    /from\s+[`]|localVerificationJobEnvelopeFixture(?:\.mjs)?["'`]\s*\+/,
    "fixture must not compute or concatenate its envelope module path"
  );

  for (const duplicatedImplementationPattern of [
    /function\s+buildLocalVerificationJobEnvelopeFixture\s*\(/,
    /(?:const|let|var)\s+buildLocalVerificationJobEnvelopeFixture\s*=/,
    /buildLocalAssuranceReportFixture/,
    /verifyAssuranceReportIntegrity/,
    /createHash\s*\(/,
    /canonical(?:ize|ization)?AssuranceReport/i,
  ]) {
    assert.doesNotMatch(
      fixtureSource,
      duplicatedImplementationPattern,
      "fixture must not duplicate envelope or assurance-report integrity implementation"
    );
  }

  for (const prohibitedRuntimePattern of [
    /node:fs/,
    /node:http/,
    /node:https/,
    /fetch\s*\(/,
    /process\.env/,
    /Date\.now/,
    /Math\.random/,
    /randomUUID/,
    /persistence/i,
    /database/i,
    /scheduler/i,
    /billing/i,
    /invoice/i,
    /payment/i,
    /approval/i,
    /authorization/i,
    /certification/i,
    /deployment[ _-]*authority/i,
    /ramen/i,
  ]) {
    assert.doesNotMatch(
      fixtureSource,
      prohibitedRuntimePattern,
      `fixture must not include prohibited runtime surface: ${prohibitedRuntimePattern}`
    );
  }

  assert.equal(
    countOccurrences(fixtureSource, '"worker"'),
    1,
    "worker must appear only in the deferred retry-field rejection list"
  );
  assert.equal(
    countOccurrences(fixtureSource, '"queue"'),
    1,
    "queue must appear only in the deferred retry-field rejection list"
  );
  assert.match(
    fixtureSource,
    /const FORBIDDEN_RETRY_FIELDS = \[[\s\S]*?"worker",\s*"queue",\s*\];/,
    "worker and queue tokens must remain confined to the deferred retry-field rejection list"
  );
}

function assertNegativeCase(label, mutate, pattern) {
  const input = createLocalIdempotencyReplayFixtureInput();
  mutate(input);

  assert.throws(
    () => buildLocalIdempotencyReplayFixture(input),
    (error) => {
      assert.ok(error instanceof TypeError, `${label} should throw TypeError`);
      assert.match(error.message, pattern);
      return true;
    },
    `expected rejection for ${label}`
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

function countOccurrences(source, token) {
  return source.split(token).length - 1;
}

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizePath(filePath) {
  return filePath.replaceAll("\\", "/");
}
