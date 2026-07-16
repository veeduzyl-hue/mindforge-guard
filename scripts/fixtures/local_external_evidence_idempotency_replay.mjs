import { buildLocalIdempotencyReplayFixture } from "../../packages/guard-core/src/externalEvidence/localIdempotencyReplayFixture.mjs";
import { createCompletedWithFindingsVerificationJobEnvelopeInput } from "./local_external_evidence_verification_job_envelope.mjs";

export function createLocalIdempotencyReplayFixtureInput() {
  const sourceEnvelopeInput = createSourceEnvelopeInput();

  return {
    source_envelope_input: sourceEnvelopeInput,
    idempotent_resubmission_request:
      createIdempotentResubmissionRequest(sourceEnvelopeInput),
    replay_envelope_input:
      createDeterministicReplayEnvelopeInput(sourceEnvelopeInput),
    intentional_new_job_envelope_input:
      createIntentionalNewJobEnvelopeInput(sourceEnvelopeInput),
  };
}

export function createLocalIdempotencyReplayFixtureSamples() {
  return buildLocalIdempotencyReplayFixture(
    createLocalIdempotencyReplayFixtureInput()
  );
}

export function createSourceEnvelopeInput() {
  const input = cloneValue(
    createCompletedWithFindingsVerificationJobEnvelopeInput()
  );

  input.verification_request.request_id = "request-idempotency-source-001";
  input.verification_request.caller_reference =
    "demo-local-idempotency-source";
  input.verification_request.requested_at = "2026-07-16T04:00:00.000Z";
  input.verification_request.idempotency = {
    idempotency_key: "idempotency-key-source-001",
    scope_reference: "scope://local/external-evidence/source-001",
    request_fingerprint_ref:
      "fingerprint://local/external-evidence/source-001",
  };
  input.verification_request.request_metadata = {
    fixture_case: "first_submission",
    fixture_family: "local_idempotency_replay",
  };
  input.verification_request.evidence_package.package_id =
    "package-idempotency-source-001";
  input.verification_request.evidence_package.digest =
    "sha256:idempotency-source-package-digest";
  input.verification_request.evidence_package.integrity_ref =
    "integrity://local/package-idempotency-source-001";
  input.verification_request.adapter.adapter_id = "adapter-idempotency-source";
  input.verification_request.adapter.adapter_version = "0.1.0";
  input.verification_request.requested_assurance_profiles = [
    {
      profile_id: "profile-idempotency-source-001",
      profile_version: "0.1",
    },
  ];

  input.verification_job.verification_id = "verification-service-source-001";
  input.verification_job.idempotency = cloneValue(
    input.verification_request.idempotency
  );
  input.verification_job.limitations = [
    "This local idempotency and replay fixture remains bounded to deterministic offline verification semantics.",
  ];
  input.verification_job.created_at = "2026-07-16T04:00:01.000Z";
  input.verification_job.started_at = "2026-07-16T04:00:02.000Z";
  input.verification_job.completed_at = "2026-07-16T04:00:08.000Z";

  input.verification_attempt.verification_attempt_id =
    "attempt-service-source-001";
  input.verification_attempt.created_at = "2026-07-16T04:00:02.000Z";
  input.verification_attempt.started_at = "2026-07-16T04:00:03.000Z";
  input.verification_attempt.completed_at = "2026-07-16T04:00:07.000Z";

  input.verification_job_result.verification_job_result_id =
    "result-service-source-001";
  input.verification_job_result.finalized_at = "2026-07-16T04:00:08.500Z";

  input.assurance_report.report_id = "report-service-source-001";
  input.assurance_report.scope_limitations = [
    "This local idempotency and replay fixture remains bounded to deterministic offline review artifacts.",
  ];
  input.assurance_report.generated_at = "2026-07-16T04:00:09.000Z";
  input.assurance_report.verification_summary =
    "Source verification completed locally with bounded findings for idempotency and replay review.";

  input.verification_usage_record.usage_record_id =
    "usage-service-source-001";
  input.verification_usage_record.verification_id =
    input.verification_job.verification_id;
  input.verification_usage_record.verification_attempt_id =
    input.verification_attempt.verification_attempt_id;
  input.verification_usage_record.deterministic_result.verification_job_result_id =
    input.verification_job_result.verification_job_result_id;
  input.verification_usage_record.recorded_at = "2026-07-16T04:00:09.500Z";

  return input;
}

export function createIdempotentResubmissionRequest(sourceEnvelopeInput) {
  const request = cloneValue(sourceEnvelopeInput.verification_request);
  request.requested_at = "2026-07-16T04:05:00.000Z";
  request.request_metadata = {
    fixture_case: "idempotent_resubmission",
    fixture_family: "local_idempotency_replay",
  };
  return request;
}

export function createDeterministicReplayEnvelopeInput(sourceEnvelopeInput) {
  const input = cloneValue(sourceEnvelopeInput);
  const replayContext = {
    replay_mode: "deterministic_reexecution",
    replay_reference: "replay-reference-source-001",
    source_verification_id:
      sourceEnvelopeInput.verification_job.verification_id,
    source_verification_attempt_id:
      sourceEnvelopeInput.verification_attempt.verification_attempt_id,
  };

  input.verification_request.request_id = "request-idempotency-replay-001";
  input.verification_request.requested_at = "2026-07-16T04:10:00.000Z";
  input.verification_request.idempotency = {
    idempotency_key: "idempotency-key-replay-001",
    scope_reference: "scope://local/external-evidence/replay-001",
    request_fingerprint_ref:
      "fingerprint://local/external-evidence/replay-001",
  };
  input.verification_request.replay_context = cloneValue(replayContext);
  input.verification_request.request_metadata = {
    fixture_case: "deterministic_replay",
    fixture_family: "local_idempotency_replay",
  };

  input.verification_job.verification_id = "verification-service-replay-001";
  input.verification_job.idempotency = cloneValue(
    input.verification_request.idempotency
  );
  input.verification_job.replay_context = cloneValue(replayContext);
  input.verification_job.created_at = "2026-07-16T04:10:01.000Z";
  input.verification_job.started_at = "2026-07-16T04:10:02.000Z";
  input.verification_job.completed_at = "2026-07-16T04:10:08.000Z";

  input.verification_attempt.verification_attempt_id =
    "attempt-service-replay-001";
  input.verification_attempt.replay_context = cloneValue(replayContext);
  input.verification_attempt.created_at = "2026-07-16T04:10:02.000Z";
  input.verification_attempt.started_at = "2026-07-16T04:10:03.000Z";
  input.verification_attempt.completed_at = "2026-07-16T04:10:07.000Z";

  input.verification_job_result.verification_job_result_id =
    "result-service-replay-001";
  input.verification_job_result.finalized_at = "2026-07-16T04:10:08.500Z";

  input.assurance_report.report_id = "report-service-replay-001";
  input.assurance_report.generated_at = "2026-07-16T04:10:09.000Z";
  input.assurance_report.verification_summary =
    "Deterministic replay re-executed the accepted source inputs with fresh service-side artifact identities.";

  input.verification_usage_record.usage_record_id =
    "usage-service-replay-001";
  input.verification_usage_record.verification_id =
    input.verification_job.verification_id;
  input.verification_usage_record.verification_attempt_id =
    input.verification_attempt.verification_attempt_id;
  input.verification_usage_record.deterministic_result.verification_job_result_id =
    input.verification_job_result.verification_job_result_id;
  input.verification_usage_record.recorded_at = "2026-07-16T04:10:09.500Z";

  return input;
}

export function createIntentionalNewJobEnvelopeInput(sourceEnvelopeInput) {
  const input = cloneValue(sourceEnvelopeInput);

  delete input.verification_request.replay_context;
  delete input.verification_attempt.replay_context;
  delete input.verification_job.replay_context;

  input.verification_request.request_id = "request-idempotency-new-job-001";
  input.verification_request.requested_at = "2026-07-16T04:20:00.000Z";
  input.verification_request.idempotency = {
    idempotency_key: "idempotency-key-new-job-001",
    scope_reference: "scope://local/external-evidence/new-job-001",
    request_fingerprint_ref:
      "fingerprint://local/external-evidence/new-job-001",
  };
  input.verification_request.request_metadata = {
    fixture_case: "intentional_new_job",
    fixture_family: "local_idempotency_replay",
  };

  input.verification_job.verification_id = "verification-service-new-job-001";
  input.verification_job.idempotency = cloneValue(
    input.verification_request.idempotency
  );
  input.verification_job.created_at = "2026-07-16T04:20:01.000Z";
  input.verification_job.started_at = "2026-07-16T04:20:02.000Z";
  input.verification_job.completed_at = "2026-07-16T04:20:08.000Z";

  input.verification_attempt.verification_attempt_id =
    "attempt-service-new-job-001";
  input.verification_attempt.created_at = "2026-07-16T04:20:02.000Z";
  input.verification_attempt.started_at = "2026-07-16T04:20:03.000Z";
  input.verification_attempt.completed_at = "2026-07-16T04:20:07.000Z";

  input.verification_job_result.verification_job_result_id =
    "result-service-new-job-001";
  input.verification_job_result.finalized_at = "2026-07-16T04:20:08.500Z";

  input.assurance_report.report_id = "report-service-new-job-001";
  input.assurance_report.generated_at = "2026-07-16T04:20:09.000Z";
  input.assurance_report.verification_summary =
    "Intentional new job preserved the accepted source evidence selection but moved outside the original idempotency boundary.";

  input.verification_usage_record.usage_record_id =
    "usage-service-new-job-001";
  input.verification_usage_record.verification_id =
    input.verification_job.verification_id;
  input.verification_usage_record.verification_attempt_id =
    input.verification_attempt.verification_attempt_id;
  input.verification_usage_record.deterministic_result.verification_job_result_id =
    input.verification_job_result.verification_job_result_id;
  input.verification_usage_record.recorded_at = "2026-07-16T04:20:09.500Z";

  return input;
}

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}
