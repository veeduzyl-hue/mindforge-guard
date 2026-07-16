import { buildLocalVerificationJobEnvelopeFixture } from "./localVerificationJobEnvelopeFixture.mjs";

const INTERNAL_REPLAY_MODE = "deterministic_reexecution";
const SERVICE_ID_FIELD_NAMES = [
  "verification_id",
  "verification_attempt_id",
  "verification_job_result_id",
  "report_id",
  "usage_record_id",
];
const FORBIDDEN_RETRY_FIELDS = [
  "retry_count",
  "retry_policy",
  "automatic_retry",
  "backoff",
  "worker",
  "queue",
];

export function buildLocalIdempotencyReplayFixture(input) {
  const fixtureInput = expectPlainObject(input, "input");
  const sourceEnvelopeInput = expectPlainObject(
    fixtureInput.source_envelope_input,
    "input.source_envelope_input"
  );
  const idempotentResubmissionRequest = expectPlainObject(
    fixtureInput.idempotent_resubmission_request,
    "input.idempotent_resubmission_request"
  );
  const replayEnvelopeInput = expectPlainObject(
    fixtureInput.replay_envelope_input,
    "input.replay_envelope_input"
  );
  const intentionalNewJobEnvelopeInput = expectPlainObject(
    fixtureInput.intentional_new_job_envelope_input,
    "input.intentional_new_job_envelope_input"
  );

  const sourceEnvelope = buildProjectedEnvelope(sourceEnvelopeInput, {
    label: "source_envelope_input",
    requireFullIdempotencyBoundary: true,
    allowReplayContext: false,
  });
  const sourceEnvelopeSnapshot = cloneValue(sourceEnvelope);

  const idempotentResubmissionResolution = resolveIdempotentResubmission({
    sourceEnvelope,
    resubmissionRequest: idempotentResubmissionRequest,
  });

  const deterministicReplayEnvelope = buildProjectedEnvelope(
    replayEnvelopeInput,
    {
      label: "replay_envelope_input",
      requireFullIdempotencyBoundary: false,
      allowReplayContext: true,
      requireReplayContext: true,
    }
  );
  validateDeterministicReplay({
    sourceEnvelope,
    replayEnvelope: deterministicReplayEnvelope,
  });

  const intentionalNewJobEnvelope = buildProjectedEnvelope(
    intentionalNewJobEnvelopeInput,
    {
      label: "intentional_new_job_envelope_input",
      requireFullIdempotencyBoundary: false,
      allowReplayContext: false,
    }
  );
  validateIntentionalNewJob({
    sourceEnvelope,
    intentionalNewJobEnvelope,
  });

  assertDeepEqual(
    sourceEnvelope,
    sourceEnvelopeSnapshot,
    "source envelope must remain immutable after local idempotency/replay resolution"
  );

  return {
    source_envelope: sourceEnvelope,
    idempotent_resubmission_resolution: idempotentResubmissionResolution,
    deterministic_replay_envelope: deterministicReplayEnvelope,
    intentional_new_job_envelope: intentionalNewJobEnvelope,
  };
}

function buildProjectedEnvelope(envelopeInput, options) {
  const label = options.label;
  const verificationRequestInput = expectPlainObject(
    envelopeInput.verification_request,
    `${label}.verification_request`
  );
  const verificationJobInput = expectPlainObject(
    envelopeInput.verification_job,
    `${label}.verification_job`
  );
  const verificationAttemptInput = expectPlainObject(
    envelopeInput.verification_attempt,
    `${label}.verification_attempt`
  );

  const requestIdempotency = readIdempotencyBoundary(
    verificationRequestInput.idempotency,
    `${label}.verification_request.idempotency`,
    { required: options.requireFullIdempotencyBoundary }
  );
  const jobIdempotency =
    verificationJobInput.idempotency === undefined
      ? requestIdempotency
      : readIdempotencyBoundary(
          verificationJobInput.idempotency,
          `${label}.verification_job.idempotency`,
          { required: true }
        );

  if (jobIdempotency !== undefined && requestIdempotency === undefined) {
    throw new TypeError(
      `${label}.verification_job.idempotency requires verification_request.idempotency`
    );
  }
  if (jobIdempotency !== undefined) {
    assertDeepEqual(
      jobIdempotency,
      requestIdempotency,
      `${label}.verification_job.idempotency must match verification_request.idempotency`
    );
  }

  const requestReplayContext = readReplayContext(
    verificationRequestInput.replay_context,
    `${label}.verification_request.replay_context`
  );
  const jobReplayContext = readReplayContext(
    verificationJobInput.replay_context,
    `${label}.verification_job.replay_context`
  );
  const attemptReplayContext = readReplayContext(
    verificationAttemptInput.replay_context,
    `${label}.verification_attempt.replay_context`
  );

  const replayContextCount = [
    requestReplayContext,
    jobReplayContext,
    attemptReplayContext,
  ].filter((value) => value !== undefined).length;

  if (replayContextCount > 0 && !options.allowReplayContext) {
    throw new TypeError(`${label} must not include replay_context`);
  }

  if (options.requireReplayContext && replayContextCount !== 3) {
    throw new TypeError(
      `${label} requires request, job, and attempt replay_context`
    );
  }

  if (replayContextCount > 0 && replayContextCount !== 3) {
    throw new TypeError(
      `${label} replay_context must be declared consistently on request, job, and attempt`
    );
  }

  if (replayContextCount === 3) {
    assertDeepEqual(
      requestReplayContext,
      jobReplayContext,
      `${label}.verification_job.replay_context must match verification_request.replay_context`
    );
    assertDeepEqual(
      requestReplayContext,
      attemptReplayContext,
      `${label}.verification_attempt.replay_context must match verification_request.replay_context`
    );
  }

  const builtEnvelope = cloneValue(
    buildLocalVerificationJobEnvelopeFixture(envelopeInput)
  );
  const projectedEnvelope = {
    ...builtEnvelope,
    verification_request: {
      ...builtEnvelope.verification_request,
    },
    verification_job: {
      ...builtEnvelope.verification_job,
    },
    verification_attempts: builtEnvelope.verification_attempts.map((attempt) => ({
      ...attempt,
    })),
  };

  if (requestIdempotency !== undefined) {
    projectedEnvelope.verification_request.idempotency = cloneValue(
      requestIdempotency
    );
    projectedEnvelope.verification_job.idempotency = cloneValue(jobIdempotency);
  }

  if (requestReplayContext !== undefined) {
    projectedEnvelope.verification_request.replay_context = cloneValue(
      requestReplayContext
    );
    projectedEnvelope.verification_job.replay_context = cloneValue(
      jobReplayContext
    );
    projectedEnvelope.verification_attempts[0].replay_context = cloneValue(
      attemptReplayContext
    );
  }

  assertSingleAttemptEnvelope(projectedEnvelope, label);
  assertServiceIdentityConsistency(projectedEnvelope, label);
  assertNoRetryLifecycleFields(projectedEnvelope, label);

  return projectedEnvelope;
}

function resolveIdempotentResubmission({ sourceEnvelope, resubmissionRequest }) {
  const normalizedResubmissionRequest = normalizeResubmissionRequest(
    resubmissionRequest,
    "idempotent_resubmission_request"
  );
  const sourceRequest = sourceEnvelope.verification_request;

  assertEqual(
    normalizedResubmissionRequest.request_id,
    sourceRequest.request_id,
    "idempotent_resubmission_request.request_id mismatch"
  );
  assertOptionalStringMatch(
    normalizedResubmissionRequest.caller_reference,
    sourceRequest.caller_reference,
    "idempotent_resubmission_request.caller_reference mismatch"
  );
  assertDeepEqual(
    normalizedResubmissionRequest.evidence_package,
    sourceRequest.evidence_package,
    "idempotent_resubmission_request.evidence_package mismatch"
  );
  assertDeepEqual(
    normalizedResubmissionRequest.adapter,
    sourceRequest.adapter,
    "idempotent_resubmission_request.adapter mismatch"
  );
  assertDeepEqual(
    normalizedResubmissionRequest.requested_assurance_profiles,
    sourceRequest.requested_assurance_profiles,
    "idempotent_resubmission_request.requested_assurance_profiles mismatch"
  );

  const sourceBoundary = readIdempotencyBoundary(
    sourceRequest.idempotency,
    "source_envelope.verification_request.idempotency",
    { required: true }
  );

  assertEqual(
    normalizedResubmissionRequest.idempotency.idempotency_key,
    sourceBoundary.idempotency_key,
    "idempotent_resubmission_request.idempotency.idempotency_key mismatch"
  );
  assertEqual(
    normalizedResubmissionRequest.idempotency.scope_reference,
    sourceBoundary.scope_reference,
    "idempotent_resubmission_request.idempotency.scope_reference mismatch"
  );
  assertEqual(
    normalizedResubmissionRequest.idempotency.request_fingerprint_ref,
    sourceBoundary.request_fingerprint_ref,
    "idempotent_resubmission_request.idempotency.request_fingerprint_ref mismatch"
  );

  return {
    resolution: "same_logical_job",
    request_id: sourceRequest.request_id,
    verification_id: sourceEnvelope.verification_job.verification_id,
    verification_attempt_id:
      sourceEnvelope.verification_attempts[0].verification_attempt_id,
    verification_job_result_id:
      sourceEnvelope.verification_job_result.verification_job_result_id,
    report_id: sourceEnvelope.assurance_report.report_id,
    usage_record_id: sourceEnvelope.verification_usage_record.usage_record_id,
  };
}

function validateDeterministicReplay({ sourceEnvelope, replayEnvelope }) {
  const sourceRequest = sourceEnvelope.verification_request;
  const replayRequest = replayEnvelope.verification_request;
  const replayJob = replayEnvelope.verification_job;
  const replayAttempt = replayEnvelope.verification_attempts[0];
  const replayContext = replayRequest.replay_context;

  assertEqual(
    replayContext.replay_mode,
    INTERNAL_REPLAY_MODE,
    "replay_context.replay_mode must be deterministic_reexecution"
  );
  assertEqual(
    replayContext.source_verification_id,
    sourceEnvelope.verification_job.verification_id,
    "replay_context.source_verification_id mismatch"
  );
  assertEqual(
    replayContext.source_verification_attempt_id,
    sourceEnvelope.verification_attempts[0].verification_attempt_id,
    "replay_context.source_verification_attempt_id mismatch"
  );

  assertDeepEqual(
    replayRequest.evidence_package,
    sourceRequest.evidence_package,
    "deterministic replay must preserve evidence_package"
  );
  assertDeepEqual(
    replayRequest.adapter,
    sourceRequest.adapter,
    "deterministic replay must preserve adapter"
  );
  assertDeepEqual(
    replayRequest.requested_assurance_profiles,
    sourceRequest.requested_assurance_profiles,
    "deterministic replay must preserve requested_assurance_profiles"
  );

  assertNotEqual(
    replayRequest.request_id,
    sourceRequest.request_id,
    "deterministic replay must use a new request_id"
  );
  assertNotEqual(
    replayJob.verification_id,
    sourceEnvelope.verification_job.verification_id,
    "deterministic replay must use a new verification_id"
  );
  assertNotEqual(
    replayAttempt.verification_attempt_id,
    sourceEnvelope.verification_attempts[0].verification_attempt_id,
    "deterministic replay must use a new verification_attempt_id"
  );
  assertNotEqual(
    replayEnvelope.verification_job_result.verification_job_result_id,
    sourceEnvelope.verification_job_result.verification_job_result_id,
    "deterministic replay must use a new verification_job_result_id"
  );
  assertNotEqual(
    replayEnvelope.assurance_report.report_id,
    sourceEnvelope.assurance_report.report_id,
    "deterministic replay must not reuse the source report_id"
  );
  assertNotEqual(
    replayEnvelope.verification_usage_record.usage_record_id,
    sourceEnvelope.verification_usage_record.usage_record_id,
    "deterministic replay must use a new usage_record_id"
  );

  if (
    replayRequest.idempotency !== undefined &&
    deepEqualValue(replayRequest.idempotency, sourceRequest.idempotency)
  ) {
    throw new TypeError(
      "deterministic replay must not reuse the source idempotency boundary"
    );
  }
}

function validateIntentionalNewJob({
  sourceEnvelope,
  intentionalNewJobEnvelope,
}) {
  const sourceRequest = sourceEnvelope.verification_request;
  const newRequest = intentionalNewJobEnvelope.verification_request;
  const newJob = intentionalNewJobEnvelope.verification_job;
  const newAttempt = intentionalNewJobEnvelope.verification_attempts[0];

  if (
    newRequest.replay_context !== undefined ||
    newJob.replay_context !== undefined ||
    newAttempt.replay_context !== undefined
  ) {
    throw new TypeError(
      "intentional new job must not include replay_context"
    );
  }

  assertDeepEqual(
    newRequest.evidence_package,
    sourceRequest.evidence_package,
    "intentional new job must preserve evidence_package to isolate boundary semantics"
  );
  assertDeepEqual(
    newRequest.adapter,
    sourceRequest.adapter,
    "intentional new job must preserve adapter to isolate boundary semantics"
  );
  assertDeepEqual(
    newRequest.requested_assurance_profiles,
    sourceRequest.requested_assurance_profiles,
    "intentional new job must preserve requested_assurance_profiles to isolate boundary semantics"
  );

  assertNotEqual(
    newRequest.request_id,
    sourceRequest.request_id,
    "intentional new job must use a new request_id"
  );
  assertNotEqual(
    newJob.verification_id,
    sourceEnvelope.verification_job.verification_id,
    "intentional new job must use a new verification_id"
  );
  assertNotEqual(
    newAttempt.verification_attempt_id,
    sourceEnvelope.verification_attempts[0].verification_attempt_id,
    "intentional new job must use a new verification_attempt_id"
  );
  assertNotEqual(
    intentionalNewJobEnvelope.verification_job_result.verification_job_result_id,
    sourceEnvelope.verification_job_result.verification_job_result_id,
    "intentional new job must use a new verification_job_result_id"
  );
  assertNotEqual(
    intentionalNewJobEnvelope.assurance_report.report_id,
    sourceEnvelope.assurance_report.report_id,
    "intentional new job must use a new report_id"
  );
  assertNotEqual(
    intentionalNewJobEnvelope.verification_usage_record.usage_record_id,
    sourceEnvelope.verification_usage_record.usage_record_id,
    "intentional new job must use a new usage_record_id"
  );

  if (
    newRequest.idempotency !== undefined &&
    deepEqualValue(newRequest.idempotency, sourceRequest.idempotency)
  ) {
    throw new TypeError(
      "intentional new job must be outside the source idempotency boundary"
    );
  }
}

function normalizeResubmissionRequest(value, label) {
  const request = normalizeRequestLike(value, label, {
    requireFullIdempotencyBoundary: true,
    allowReplayContext: false,
  });

  assertNoServiceIdentityFields(value, label);

  return request;
}

function normalizeRequestLike(value, label, options) {
  const request = expectPlainObject(value, label);

  if (request.replay_context !== undefined && !options.allowReplayContext) {
    throw new TypeError(`${label}.replay_context must not be provided`);
  }

  return {
    request_id: expectString(request.request_id, `${label}.request_id`),
    ...(request.caller_reference !== undefined
      ? {
          caller_reference: expectString(
            request.caller_reference,
            `${label}.caller_reference`
          ),
        }
      : {}),
    evidence_package: cloneValue(
      expectPlainObject(request.evidence_package, `${label}.evidence_package`)
    ),
    adapter: cloneValue(
      expectPlainObject(request.adapter, `${label}.adapter`)
    ),
    requested_assurance_profiles: cloneValue(
      expectArray(
        request.requested_assurance_profiles,
        `${label}.requested_assurance_profiles`
      )
    ),
    requested_at: expectString(request.requested_at, `${label}.requested_at`),
    idempotency: readIdempotencyBoundary(
      request.idempotency,
      `${label}.idempotency`,
      { required: options.requireFullIdempotencyBoundary }
    ),
  };
}

function readIdempotencyBoundary(value, label, options) {
  if (value === undefined) {
    if (options.required) {
      throw new TypeError(`${label} must be provided`);
    }
    return undefined;
  }

  const boundary = expectPlainObject(value, label);

  return {
    idempotency_key: expectString(
      boundary.idempotency_key,
      `${label}.idempotency_key`
    ),
    scope_reference: expectString(
      boundary.scope_reference,
      `${label}.scope_reference`
    ),
    request_fingerprint_ref: expectString(
      boundary.request_fingerprint_ref,
      `${label}.request_fingerprint_ref`
    ),
  };
}

function readReplayContext(value, label) {
  if (value === undefined) {
    return undefined;
  }

  const replayContext = expectPlainObject(value, label);

  return {
    replay_mode: expectFixedString(
      replayContext.replay_mode,
      `${label}.replay_mode`,
      INTERNAL_REPLAY_MODE
    ),
    replay_reference: expectString(
      replayContext.replay_reference,
      `${label}.replay_reference`
    ),
    source_verification_id: expectString(
      replayContext.source_verification_id,
      `${label}.source_verification_id`
    ),
    source_verification_attempt_id: expectString(
      replayContext.source_verification_attempt_id,
      `${label}.source_verification_attempt_id`
    ),
  };
}

function assertSingleAttemptEnvelope(envelope, label) {
  const attempts = expectArray(
    envelope.verification_attempts,
    `${label}.verification_attempts`
  );

  if (attempts.length !== 1) {
    throw new TypeError(`${label} must contain exactly one verification attempt`);
  }
}

function assertServiceIdentityConsistency(envelope, label) {
  const attempt = envelope.verification_attempts[0];

  assertEqual(
    envelope.verification_job.verification_id,
    attempt.verification_id,
    `${label}.verification_attempts[0].verification_id must match verification_job.verification_id`
  );
  assertEqual(
    envelope.verification_job.verification_id,
    envelope.verification_job_result.verification_id,
    `${label}.verification_job_result.verification_id must match verification_job.verification_id`
  );
  assertEqual(
    envelope.verification_job.verification_id,
    envelope.assurance_report.verification_id,
    `${label}.assurance_report.verification_id must match verification_job.verification_id`
  );
  assertEqual(
    envelope.verification_job.verification_id,
    envelope.verification_usage_record.verification_id,
    `${label}.verification_usage_record.verification_id must match verification_job.verification_id`
  );
  assertEqual(
    envelope.verification_job_result.verification_attempt_id,
    attempt.verification_attempt_id,
    `${label}.verification_job_result.verification_attempt_id must match verification_attempt.verification_attempt_id`
  );
  assertEqual(
    envelope.assurance_report.report_id,
    envelope.verification_job.assurance_report.report_id,
    `${label}.verification_job.assurance_report.report_id must match assurance_report.report_id`
  );
  assertEqual(
    envelope.assurance_report.report_id,
    envelope.verification_job_result.assurance_report.report_id,
    `${label}.verification_job_result.assurance_report.report_id must match assurance_report.report_id`
  );
  assertEqual(
    envelope.verification_usage_record.usage_record_id,
    envelope.verification_usage_record.usage_record_id,
    `${label}.verification_usage_record.usage_record_id must be stable`
  );
}

function assertNoRetryLifecycleFields(value, label) {
  for (const fieldName of FORBIDDEN_RETRY_FIELDS) {
    if (containsFieldName(value, fieldName)) {
      throw new TypeError(`${label} must not include retry field ${fieldName}`);
    }
  }
}

function assertNoServiceIdentityFields(value, label) {
  for (const fieldName of SERVICE_ID_FIELD_NAMES) {
    if (fieldName in value) {
      throw new TypeError(
        `${label} must not provide service-generated field ${fieldName}`
      );
    }
  }
}

function containsFieldName(value, fieldName) {
  if (Array.isArray(value)) {
    return value.some((entry) => containsFieldName(entry, fieldName));
  }

  if (isPlainObject(value)) {
    if (fieldName in value) {
      return true;
    }

    return Object.values(value).some((entry) => containsFieldName(entry, fieldName));
  }

  return false;
}

function assertOptionalStringMatch(actual, expected, message) {
  if (actual === undefined && expected === undefined) {
    return;
  }

  assertEqual(actual, expected, message);
}

function assertDeepEqual(actual, expected, message) {
  if (!deepEqualValue(actual, expected)) {
    throw new TypeError(message);
  }
}

function deepEqualValue(left, right) {
  if (left === right) {
    return true;
  }

  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right)) {
      return false;
    }
    if (left.length !== right.length) {
      return false;
    }
    for (let index = 0; index < left.length; index += 1) {
      if (!deepEqualValue(left[index], right[index])) {
        return false;
      }
    }
    return true;
  }

  if (isPlainObject(left) || isPlainObject(right)) {
    if (!isPlainObject(left) || !isPlainObject(right)) {
      return false;
    }
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);
    if (leftKeys.length !== rightKeys.length) {
      return false;
    }
    for (const key of leftKeys) {
      if (!Object.hasOwn(right, key)) {
        return false;
      }
      if (!deepEqualValue(left[key], right[key])) {
        return false;
      }
    }
    return true;
  }

  return false;
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

function expectFixedString(value, label, expectedValue) {
  const actual = expectString(value, label);

  if (actual !== expectedValue) {
    throw new TypeError(`${label} must be ${expectedValue}`);
  }

  return actual;
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new TypeError(message);
  }
}

function assertNotEqual(actual, expected, message) {
  if (actual === expected) {
    throw new TypeError(message);
  }
}

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}
