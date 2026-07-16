const EXPECTED_INPUT_KEYS = Object.freeze([
  "deterministic_replay_envelope",
  "idempotent_resubmission_resolution",
  "intentional_new_job_envelope",
  "source_envelope",
]);

const COMMERCIAL_FIELD_NAMES = Object.freeze([
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
]);

export function buildLocalTechnicalUsageRecordFixture(input) {
  const fixtureInput = expectPlainObject(input, "input");
  assertExactKeys(fixtureInput, EXPECTED_INPUT_KEYS, "input");

  const sourceEnvelope = expectPlainObject(
    fixtureInput.source_envelope,
    "input.source_envelope"
  );
  const resubmissionResolution = expectPlainObject(
    fixtureInput.idempotent_resubmission_resolution,
    "input.idempotent_resubmission_resolution"
  );
  const replayEnvelope = expectPlainObject(
    fixtureInput.deterministic_replay_envelope,
    "input.deterministic_replay_envelope"
  );
  const intentionalNewJobEnvelope = expectPlainObject(
    fixtureInput.intentional_new_job_envelope,
    "input.intentional_new_job_envelope"
  );

  const sourceUsage = buildUsageProjection(sourceEnvelope, "source_envelope");
  const replayUsage = buildUsageProjection(
    replayEnvelope,
    "deterministic_replay_envelope"
  );
  const intentionalNewJobUsage = buildUsageProjection(
    intentionalNewJobEnvelope,
    "intentional_new_job_envelope"
  );

  assertDistinctLogicalJobUsage({
    sourceUsage,
    replayUsage,
    intentionalNewJobUsage,
  });

  return {
    source_usage: sourceUsage,
    idempotent_resubmission_usage_resolution:
      resolveIdempotentResubmissionUsage({
        sourceEnvelope,
        resubmissionResolution,
      }),
    deterministic_replay_usage: replayUsage,
    intentional_new_job_usage: intentionalNewJobUsage,
  };
}

function buildUsageProjection(envelope, label) {
  const request = expectPlainObject(
    envelope.verification_request,
    `${label}.verification_request`
  );
  const job = expectPlainObject(
    envelope.verification_job,
    `${label}.verification_job`
  );
  const attempts = expectArray(
    envelope.verification_attempts,
    `${label}.verification_attempts`
  );
  if (attempts.length !== 1) {
    throw new TypeError(
      `${label}.verification_attempts must contain exactly one completed attempt`
    );
  }
  const attempt = expectPlainObject(
    attempts[0],
    `${label}.verification_attempts[0]`
  );
  const result = expectPlainObject(
    envelope.verification_job_result,
    `${label}.verification_job_result`
  );
  const report = expectPlainObject(
    envelope.assurance_report,
    `${label}.assurance_report`
  );
  const usageRecord = expectPlainObject(
    envelope.verification_usage_record,
    `${label}.verification_usage_record`
  );
  const jobUsageReference = expectPlainObject(
    job.usage_record,
    `${label}.verification_job.usage_record`
  );
  const jobReportReference = expectPlainObject(
    job.assurance_report,
    `${label}.verification_job.assurance_report`
  );
  const resultReportReference = expectPlainObject(
    result.assurance_report,
    `${label}.verification_job_result.assurance_report`
  );
  const deterministicResult = expectPlainObject(
    usageRecord.deterministic_result,
    `${label}.verification_usage_record.deterministic_result`
  );

  const verificationId = expectString(
    job.verification_id,
    `${label}.verification_job.verification_id`
  );
  const verificationAttemptId = expectString(
    attempt.verification_attempt_id,
    `${label}.verification_attempts[0].verification_attempt_id`
  );
  const resultId = expectString(
    result.verification_job_result_id,
    `${label}.verification_job_result.verification_job_result_id`
  );
  const reportId = expectString(
    report.report_id,
    `${label}.assurance_report.report_id`
  );
  const usageRecordId = expectString(
    usageRecord.usage_record_id,
    `${label}.verification_usage_record.usage_record_id`
  );
  const terminalOutcome = expectString(
    job.status,
    `${label}.verification_job.status`
  );

  assertEqual(
    expectString(
      attempt.verification_id,
      `${label}.verification_attempts[0].verification_id`
    ),
    verificationId,
    `${label}.verification_attempts[0].verification_id must match verification_job.verification_id`
  );
  assertEqual(
    expectString(
      result.verification_id,
      `${label}.verification_job_result.verification_id`
    ),
    verificationId,
    `${label}.verification_job_result.verification_id must match verification_job.verification_id`
  );
  assertEqual(
    expectString(
      result.verification_attempt_id,
      `${label}.verification_job_result.verification_attempt_id`
    ),
    verificationAttemptId,
    `${label}.verification_job_result.verification_attempt_id must match verification_attempts[0].verification_attempt_id`
  );
  assertEqual(
    expectString(
      report.verification_id,
      `${label}.assurance_report.verification_id`
    ),
    verificationId,
    `${label}.assurance_report.verification_id must match verification_job.verification_id`
  );
  assertEqual(
    expectString(
      jobReportReference.report_id,
      `${label}.verification_job.assurance_report.report_id`
    ),
    reportId,
    `${label}.verification_job.assurance_report.report_id must match assurance_report.report_id`
  );
  assertEqual(
    expectString(
      resultReportReference.report_id,
      `${label}.verification_job_result.assurance_report.report_id`
    ),
    reportId,
    `${label}.verification_job_result.assurance_report.report_id must match assurance_report.report_id`
  );

  assertEqual(
    expectString(
      usageRecord.verification_id,
      `${label}.verification_usage_record.verification_id`
    ),
    verificationId,
    `${label}.verification_usage_record.verification_id must match verification_job.verification_id`
  );
  assertEqual(
    expectString(
      usageRecord.verification_attempt_id,
      `${label}.verification_usage_record.verification_attempt_id`
    ),
    verificationAttemptId,
    `${label}.verification_usage_record.verification_attempt_id must match verification_attempts[0].verification_attempt_id`
  );
  assertEqual(
    expectString(
      jobUsageReference.usage_record_id,
      `${label}.verification_job.usage_record.usage_record_id`
    ),
    usageRecordId,
    `${label}.verification_job.usage_record.usage_record_id must match verification_usage_record.usage_record_id`
  );
  assertEqual(
    expectString(
      deterministicResult.verification_job_result_id,
      `${label}.verification_usage_record.deterministic_result.verification_job_result_id`
    ),
    resultId,
    `${label}.verification_usage_record.deterministic_result.verification_job_result_id must match verification_job_result.verification_job_result_id`
  );
  assertEqual(
    expectString(
      usageRecord.terminal_outcome,
      `${label}.verification_usage_record.terminal_outcome`
    ),
    terminalOutcome,
    `${label}.verification_usage_record.terminal_outcome must match verification_job.status`
  );
  assertEqual(
    expectString(
      usageRecord.usage_schema_version,
      `${label}.verification_usage_record.usage_schema_version`
    ),
    "0.1",
    `${label}.verification_usage_record.usage_schema_version must be 0.1`
  );
  expectString(
    usageRecord.recorded_at,
    `${label}.verification_usage_record.recorded_at`
  );

  assertRequiredCounters({
    usageRecord,
    request,
    result,
    report,
    label,
  });
  assertOptionalTechnicalCounters(usageRecord, label);
  assertRetentionCompatibility(usageRecord, label);
  assertHumanReviewConsistency({ request, usageRecord, label });
  assertNoCommercialFields(
    usageRecord,
    `${label}.verification_usage_record`
  );

  return {
    binding: {
      verification_id: verificationId,
      verification_attempt_id: verificationAttemptId,
      verification_job_result_id: resultId,
      report_id: reportId,
      terminal_outcome: terminalOutcome,
    },
    verification_usage_record: cloneValue(usageRecord),
  };
}

function assertRequiredCounters({ usageRecord, request, result, report, label }) {
  const normalizedRecords = expectArray(
    result.normalized_records,
    `${label}.verification_job_result.normalized_records`
  );
  const assuranceProfiles = expectArray(
    request.requested_assurance_profiles,
    `${label}.verification_request.requested_assurance_profiles`
  );
  const executedChecks = expectArray(
    report.executed_checks,
    `${label}.assurance_report.executed_checks`
  );

  const expectedCounters = {
    evidence_package_count: 1,
    evidence_record_count: normalizedRecords.length,
    assurance_profile_count: assuranceProfiles.length,
    verification_check_count: executedChecks.length,
    report_count: 1,
  };

  for (const [fieldName, expectedValue] of Object.entries(expectedCounters)) {
    const actualValue = expectNonNegativeInteger(
      usageRecord[fieldName],
      `${label}.verification_usage_record.${fieldName}`
    );
    assertEqual(
      actualValue,
      expectedValue,
      `${label}.verification_usage_record.${fieldName} must match the completed envelope`
    );
  }
}

function assertOptionalTechnicalCounters(usageRecord, label) {
  for (const fieldName of [
    "cryptographic_operation_count",
    "evidence_chain_depth",
  ]) {
    if (usageRecord[fieldName] !== undefined) {
      expectNonNegativeInteger(
        usageRecord[fieldName],
        `${label}.verification_usage_record.${fieldName}`
      );
    }
  }
}

function assertRetentionCompatibility(usageRecord, label) {
  const retentionTierRef =
    usageRecord.retention_tier_ref === undefined
      ? undefined
      : expectString(
          usageRecord.retention_tier_ref,
          `${label}.verification_usage_record.retention_tier_ref`
        );
  const retentionClass =
    usageRecord.retention_class === undefined
      ? undefined
      : expectPlainObject(
          usageRecord.retention_class,
          `${label}.verification_usage_record.retention_class`
        );

  if (retentionClass !== undefined) {
    const retentionClassId = expectString(
      retentionClass.retention_class_id,
      `${label}.verification_usage_record.retention_class.retention_class_id`
    );
    if (retentionClass.retention_class_version !== undefined) {
      expectString(
        retentionClass.retention_class_version,
        `${label}.verification_usage_record.retention_class.retention_class_version`
      );
    }
    if (retentionTierRef !== undefined) {
      assertEqual(
        retentionClassId,
        retentionTierRef,
        `${label}.verification_usage_record retention references must identify the same opaque class`
      );
    }
  }
}

function assertHumanReviewConsistency({ request, usageRecord, label }) {
  const reviewContext =
    request.human_review_context === undefined
      ? undefined
      : expectPlainObject(
          request.human_review_context,
          `${label}.verification_request.human_review_context`
        );
  const requested =
    reviewContext?.requested === undefined
      ? undefined
      : expectBoolean(
          reviewContext.requested,
          `${label}.verification_request.human_review_context.requested`
        );
  const usageRequested =
    usageRecord.human_review_requested === undefined
      ? undefined
      : expectBoolean(
          usageRecord.human_review_requested,
          `${label}.verification_usage_record.human_review_requested`
        );

  if (requested !== undefined && usageRequested !== undefined) {
    assertEqual(
      usageRequested,
      requested,
      `${label}.verification_usage_record.human_review_requested must match verification_request.human_review_context.requested when both are declared`
    );
  }
}

function resolveIdempotentResubmissionUsage({
  sourceEnvelope,
  resubmissionResolution,
}) {
  const sourceRequest = expectPlainObject(
    sourceEnvelope.verification_request,
    "source_envelope.verification_request"
  );
  const sourceJob = expectPlainObject(
    sourceEnvelope.verification_job,
    "source_envelope.verification_job"
  );
  const sourceAttempts = expectArray(
    sourceEnvelope.verification_attempts,
    "source_envelope.verification_attempts"
  );
  const sourceAttempt = expectPlainObject(
    sourceAttempts[0],
    "source_envelope.verification_attempts[0]"
  );
  const sourceResult = expectPlainObject(
    sourceEnvelope.verification_job_result,
    "source_envelope.verification_job_result"
  );
  const sourceReport = expectPlainObject(
    sourceEnvelope.assurance_report,
    "source_envelope.assurance_report"
  );
  const sourceUsageRecord = expectPlainObject(
    sourceEnvelope.verification_usage_record,
    "source_envelope.verification_usage_record"
  );

  assertEqual(
    resubmissionResolution.resolution,
    "same_logical_job",
    "idempotent_resubmission_resolution.resolution must be same_logical_job"
  );

  const expectedReferences = {
    request_id: sourceRequest.request_id,
    verification_id: sourceJob.verification_id,
    verification_attempt_id: sourceAttempt.verification_attempt_id,
    verification_job_result_id: sourceResult.verification_job_result_id,
    report_id: sourceReport.report_id,
    usage_record_id: sourceUsageRecord.usage_record_id,
  };

  for (const [fieldName, expectedValue] of Object.entries(expectedReferences)) {
    assertEqual(
      expectString(
        resubmissionResolution[fieldName],
        `idempotent_resubmission_resolution.${fieldName}`
      ),
      expectString(expectedValue, `source_envelope.${fieldName}`),
      `idempotent_resubmission_resolution.${fieldName} must reference the source artifact`
    );
  }

  return {
    resolution: "existing_technical_usage_record",
    verification_id: sourceJob.verification_id,
    usage_record_id: sourceUsageRecord.usage_record_id,
  };
}

function assertDistinctLogicalJobUsage({
  sourceUsage,
  replayUsage,
  intentionalNewJobUsage,
}) {
  const usageRecordIds = [
    sourceUsage.verification_usage_record.usage_record_id,
    replayUsage.verification_usage_record.usage_record_id,
    intentionalNewJobUsage.verification_usage_record.usage_record_id,
  ];
  const verificationIds = [
    sourceUsage.binding.verification_id,
    replayUsage.binding.verification_id,
    intentionalNewJobUsage.binding.verification_id,
  ];

  assertPairwiseDistinct(
    usageRecordIds,
    "source, replay, and intentional new job usage_record_id values must be distinct"
  );
  assertPairwiseDistinct(
    verificationIds,
    "source, replay, and intentional new job verification_id values must be distinct"
  );
}

function assertNoCommercialFields(value, label) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) =>
      assertNoCommercialFields(entry, `${label}[${index}]`)
    );
    return;
  }
  if (!isPlainObject(value)) {
    return;
  }

  for (const [key, entry] of Object.entries(value)) {
    const normalizedKey = key.trim().toLowerCase();
    if (COMMERCIAL_FIELD_NAMES.includes(normalizedKey)) {
      throw new TypeError(
        `${label} must not include commercial field key: ${normalizedKey}`
      );
    }
    assertNoCommercialFields(entry, `${label}.${key}`);
  }
}

function assertPairwiseDistinct(values, message) {
  if (new Set(values).size !== values.length) {
    throw new TypeError(message);
  }
}

function assertExactKeys(value, expectedKeys, label) {
  const actualKeys = Object.keys(value).sort();
  const sortedExpectedKeys = [...expectedKeys].sort();
  if (JSON.stringify(actualKeys) !== JSON.stringify(sortedExpectedKeys)) {
    throw new TypeError(
      `${label} must contain exactly: ${sortedExpectedKeys.join(", ")}`
    );
  }
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
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`${label} must be a non-empty string`);
  }
  return value;
}

function expectBoolean(value, label) {
  if (typeof value !== "boolean") {
    throw new TypeError(`${label} must be a boolean`);
  }
  return value;
}

function expectNonNegativeInteger(value, label) {
  if (!Number.isInteger(value) || value < 0) {
    throw new TypeError(`${label} must be a non-negative integer`);
  }
  return value;
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new TypeError(message);
  }
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}
