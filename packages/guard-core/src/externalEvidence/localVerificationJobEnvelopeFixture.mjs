import { buildLocalAssuranceReportFixture } from "./localAssuranceReportFixture.mjs";
import { verifyAssuranceReportIntegrity } from "./localAssuranceReportIntegrity.mjs";

const COMPLETED_JOB_STATUSES = new Set([
  "completed",
  "completed_with_findings",
]);
const COMPLETED_ATTEMPT_STATUS = "completed";
const VERIFICATION_STATUSES = new Set([
  "verified",
  "not_verified",
  "partially_verified",
  "verification_not_performed",
  "verification_error",
]);
const REPORT_INTEGRITY_STATUS = "valid";

export function buildLocalVerificationJobEnvelopeFixture(input) {
  const fixtureInput = expectPlainObject(input, "input");
  const verificationRequest = readVerificationRequest(
    fixtureInput.verification_request
  );
  const verificationJobInput = readVerificationJobInput(
    fixtureInput.verification_job
  );
  const verificationAttemptInput = readVerificationAttemptInput(
    fixtureInput.verification_attempt
  );
  const verificationJobResultInput = readVerificationJobResultInput(
    fixtureInput.verification_job_result
  );
  const assuranceReportInput = readAssuranceReportInput(
    fixtureInput.assurance_report
  );
  const verificationUsageRecordInput = readVerificationUsageRecordInput(
    fixtureInput.verification_usage_record
  );
  const verificationStatus = resolveVerificationStatus(
    verificationJobInput.verification_status,
    verificationJobResultInput.verification_status
  );

  assertEqual(
    verificationJobInput.status,
    verificationJobResultInput.job_status,
    "verification_job_result.job_status must match verification_job.status"
  );
  assertEqual(
    verificationJobInput.verification_id,
    verificationUsageRecordInput.verification_id,
    "verification_usage_record.verification_id must match verification_job.verification_id"
  );
  assertEqual(
    verificationAttemptInput.verification_attempt_id,
    verificationUsageRecordInput.verification_attempt_id,
    "verification_usage_record.verification_attempt_id must match verification_attempt.verification_attempt_id"
  );
  assertEqual(
    verificationJobResultInput.verification_job_result_id,
    verificationUsageRecordInput.deterministic_result
      .verification_job_result_id,
    "verification_usage_record.deterministic_result.verification_job_result_id must match verification_job_result.verification_job_result_id"
  );
  assertEqual(
    verificationJobInput.status,
    verificationUsageRecordInput.terminal_outcome,
    "verification_usage_record.terminal_outcome must match verification_job.status"
  );

  assertFindingsConsistency(
    verificationJobInput.status,
    verificationJobResultInput.findings,
    assuranceReportInput.unresolved_findings
  );
  assertUsageConsistency(
    verificationUsageRecordInput,
    verificationRequest.requested_assurance_profiles,
    verificationJobResultInput.normalized_records,
    assuranceReportInput.executed_checks
  );
  assertRetentionConsistency(verificationUsageRecordInput);

  const assuranceBundle = buildLocalAssuranceReportFixture({
    verification_id: verificationJobInput.verification_id,
    report_id: assuranceReportInput.report_id,
    request_id: verificationRequest.request_id,
    ...(verificationRequest.caller_reference !== undefined
      ? { caller_reference: verificationRequest.caller_reference }
      : {}),
    job_status: verificationJobInput.status,
    ...(verificationStatus !== undefined
      ? { verification_status: verificationStatus }
      : {}),
    contract_version: verificationJobInput.contract_version,
    engine_version: verificationJobInput.engine_version,
    report_schema_version: assuranceReportInput.report_schema_version,
    created_at: verificationJobInput.created_at,
    ...(verificationJobInput.started_at !== undefined
      ? { started_at: verificationJobInput.started_at }
      : {}),
    completed_at: verificationJobInput.completed_at,
    generated_at: assuranceReportInput.generated_at,
    evidence_package: cloneValue(verificationRequest.evidence_package),
    producer: cloneValue(assuranceReportInput.producer),
    adapter: cloneValue(verificationRequest.adapter),
    assurance_profiles: cloneArray(
      verificationRequest.requested_assurance_profiles
    ),
    executed_checks: cloneArray(assuranceReportInput.executed_checks),
    verified_claims: cloneArray(assuranceReportInput.verified_claims),
    failed_checks: cloneArray(assuranceReportInput.failed_checks),
    findings: cloneArray(verificationJobResultInput.findings),
    unresolved_findings: cloneArray(assuranceReportInput.unresolved_findings),
    missing_evidence: cloneArray(assuranceReportInput.missing_evidence),
    limitations: cloneArray(verificationJobInput.limitations),
    scope_limitations: cloneArray(assuranceReportInput.scope_limitations),
    human_review_recommendations: cloneArray(
      assuranceReportInput.human_review_recommendations
    ),
    normalized_records: cloneArray(
      verificationJobResultInput.normalized_records
    ),
    ...(assuranceReportInput.verification_summary !== undefined
      ? { verification_summary: assuranceReportInput.verification_summary }
      : {}),
    verification_usage_record: {
      usage_record_id: verificationUsageRecordInput.usage_record_id,
      verification_id: verificationUsageRecordInput.verification_id,
      evidence_package_count:
        verificationUsageRecordInput.evidence_package_count,
      evidence_record_count: verificationUsageRecordInput.evidence_record_count,
      assurance_profile_count:
        verificationUsageRecordInput.assurance_profile_count,
      verification_check_count:
        verificationUsageRecordInput.verification_check_count,
      ...(verificationUsageRecordInput.cryptographic_operation_count !==
      undefined
        ? {
            cryptographic_operation_count:
              verificationUsageRecordInput.cryptographic_operation_count,
          }
        : {}),
      ...(verificationUsageRecordInput.evidence_chain_depth !== undefined
        ? {
            evidence_chain_depth:
              verificationUsageRecordInput.evidence_chain_depth,
          }
        : {}),
      report_count: verificationUsageRecordInput.report_count,
      ...(verificationUsageRecordInput.retention_tier_ref !== undefined
        ? {
            retention_tier_ref:
              verificationUsageRecordInput.retention_tier_ref,
          }
        : {}),
      ...(verificationUsageRecordInput.human_review_requested !== undefined
        ? {
            human_review_requested:
              verificationUsageRecordInput.human_review_requested,
          }
        : {}),
      recorded_at: verificationUsageRecordInput.recorded_at,
      usage_schema_version: verificationUsageRecordInput.usage_schema_version,
    },
  });

  const integrityVerification = verifyAssuranceReportIntegrity(
    assuranceBundle.assurance_report
  );

  if (!integrityVerification.matches) {
    throw new TypeError(
      "assurance_report failed deterministic integrity verification"
    );
  }

  const verificationJob = {
    ...cloneValue(assuranceBundle.verification_job),
    ...(verificationStatus !== undefined
      ? { verification_status: verificationStatus }
      : {}),
    attempts: [
      {
        verification_attempt_id:
          verificationAttemptInput.verification_attempt_id,
        attempt_number: verificationAttemptInput.attempt_number,
      },
    ],
    result: {
      verification_job_result_id:
        verificationJobResultInput.verification_job_result_id,
    },
  };

  const verificationAttempt = {
    verification_attempt_id: verificationAttemptInput.verification_attempt_id,
    verification_id: verificationJob.verification_id,
    attempt_number: verificationAttemptInput.attempt_number,
    status: verificationAttemptInput.status,
    created_at: verificationAttemptInput.created_at,
    ...(verificationAttemptInput.replay_context !== undefined
      ? {
          replay_context: cloneValue(
            verificationAttemptInput.replay_context
          ),
        }
      : {}),
    ...(verificationAttemptInput.started_at !== undefined
      ? { started_at: verificationAttemptInput.started_at }
      : {}),
    completed_at: verificationAttemptInput.completed_at,
    result: {
      verification_job_result_id:
        verificationJobResultInput.verification_job_result_id,
    },
  };

  const verificationJobResult = {
    verification_job_result_id:
      verificationJobResultInput.verification_job_result_id,
    verification_id: verificationJob.verification_id,
    verification_attempt_id: verificationAttempt.verification_attempt_id,
    job_status: verificationJobResultInput.job_status,
    ...(verificationStatus !== undefined
      ? { verification_status: verificationStatus }
      : {}),
    report_integrity_status: REPORT_INTEGRITY_STATUS,
    normalized_records: cloneArray(verificationJobResultInput.normalized_records),
    findings: cloneArray(verificationJobResultInput.findings),
    assurance_report: {
      report_id: assuranceBundle.assurance_report.report_id,
    },
    finalized_at: verificationJobResultInput.finalized_at,
    ...(verificationJobResultInput.result_summary !== undefined
      ? { result_summary: verificationJobResultInput.result_summary }
      : {}),
  };

  const verificationUsageRecord = {
    ...cloneValue(assuranceBundle.verification_usage_record),
    verification_attempt_id: verificationAttempt.verification_attempt_id,
    ...(verificationUsageRecordInput.retention_class !== undefined
      ? {
          retention_class: cloneValue(
            verificationUsageRecordInput.retention_class
          ),
        }
      : {}),
    terminal_outcome: verificationJob.status,
    deterministic_result: {
      verification_job_result_id:
        verificationJobResult.verification_job_result_id,
    },
  };

  return {
    verification_request: cloneValue(verificationRequest),
    verification_job: verificationJob,
    verification_attempts: [verificationAttempt],
    verification_job_result: verificationJobResult,
    assurance_report: cloneValue(assuranceBundle.assurance_report),
    verification_usage_record: verificationUsageRecord,
  };
}

function resolveVerificationStatus(jobStatus, resultStatus) {
  if (jobStatus !== undefined && resultStatus !== undefined) {
    assertEqual(
      jobStatus,
      resultStatus,
      "verification_job_result.verification_status must match verification_job.verification_status when both are declared"
    );
  }

  return jobStatus ?? resultStatus;
}

function assertFindingsConsistency(jobStatus, resultFindings, reportFindings) {
  const resultEntries = cloneArray(resultFindings);
  const reportEntries = cloneArray(reportFindings);

  if (jobStatus === "completed" && resultEntries.length > 0) {
    throw new TypeError(
      "verification_job_result.findings must be empty when verification_job.status is completed"
    );
  }

  if (jobStatus === "completed" && reportEntries.length > 0) {
    throw new TypeError(
      "assurance_report.unresolved_findings must be empty when verification_job.status is completed"
    );
  }

  if (
    jobStatus === "completed_with_findings" &&
    resultEntries.length === 0
  ) {
    throw new TypeError(
      "verification_job_result.findings must contain at least one finding when verification_job.status is completed_with_findings"
    );
  }

  if (!deepEqualValue(resultEntries, reportEntries)) {
    throw new TypeError(
      "assurance_report.unresolved_findings must match verification_job_result.findings"
    );
  }
}

function assertUsageConsistency(
  usageRecord,
  assuranceProfiles,
  normalizedRecords,
  executedChecks
) {
  assertEqual(
    usageRecord.evidence_package_count,
    1,
    "verification_usage_record.evidence_package_count must be 1"
  );
  assertEqual(
    usageRecord.evidence_record_count,
    normalizedRecords.length,
    "verification_usage_record.evidence_record_count must match verification_job_result.normalized_records.length"
  );
  assertEqual(
    usageRecord.assurance_profile_count,
    assuranceProfiles.length,
    "verification_usage_record.assurance_profile_count must match verification_request.requested_assurance_profiles.length"
  );
  assertEqual(
    usageRecord.verification_check_count,
    executedChecks.length,
    "verification_usage_record.verification_check_count must match assurance_report.executed_checks.length"
  );
  assertEqual(
    usageRecord.report_count,
    1,
    "verification_usage_record.report_count must be 1"
  );
}

function assertRetentionConsistency(usageRecord) {
  if (
    usageRecord.retention_tier_ref !== undefined &&
    usageRecord.retention_class !== undefined
  ) {
    assertEqual(
      usageRecord.retention_tier_ref,
      usageRecord.retention_class.retention_class_id,
      "verification_usage_record.retention_class.retention_class_id must match verification_usage_record.retention_tier_ref when both are declared"
    );
  }
}

function readVerificationRequest(value) {
  const request = expectPlainObject(value, "verification_request");

  return {
    request_id: expectString(request.request_id, "verification_request.request_id"),
    ...(request.caller_reference !== undefined
      ? {
          caller_reference: expectString(
            request.caller_reference,
            "verification_request.caller_reference"
          ),
        }
      : {}),
    evidence_package: cloneValue(
      expectPlainObject(
        request.evidence_package,
        "verification_request.evidence_package"
      )
    ),
    adapter: cloneValue(
      expectPlainObject(request.adapter, "verification_request.adapter")
    ),
    requested_assurance_profiles: cloneArray(
      expectArray(
        request.requested_assurance_profiles,
        "verification_request.requested_assurance_profiles"
      )
    ),
    requested_at: expectString(
      request.requested_at,
      "verification_request.requested_at"
    ),
    ...(request.idempotency !== undefined
      ? {
          idempotency: cloneValue(
            expectPlainObject(
              request.idempotency,
              "verification_request.idempotency"
            )
          ),
        }
      : {}),
    ...(request.replay_context !== undefined
      ? {
          replay_context: cloneValue(
            expectPlainObject(
              request.replay_context,
              "verification_request.replay_context"
            )
          ),
        }
      : {}),
    ...(request.human_review_context !== undefined
      ? {
          human_review_context: cloneValue(
            expectPlainObject(
              request.human_review_context,
              "verification_request.human_review_context"
            )
          ),
        }
      : {}),
    ...(request.customer_reference !== undefined
      ? {
          customer_reference: expectString(
            request.customer_reference,
            "verification_request.customer_reference"
          ),
        }
      : {}),
    ...(request.request_metadata !== undefined
      ? {
          request_metadata: cloneValue(
            expectPlainObject(
              request.request_metadata,
              "verification_request.request_metadata"
            )
          ),
        }
      : {}),
  };
}

function readVerificationJobInput(value) {
  const job = expectPlainObject(value, "verification_job");

  return {
    verification_id: expectString(
      job.verification_id,
      "verification_job.verification_id"
    ),
    contract_version: expectFixedString(
      job.contract_version,
      "verification_job.contract_version",
      "0.1"
    ),
    engine_version: expectString(
      job.engine_version,
      "verification_job.engine_version"
    ),
    status: expectEnumString(
      job.status,
      "verification_job.status",
      COMPLETED_JOB_STATUSES
    ),
    ...(job.verification_status !== undefined
      ? {
          verification_status: expectEnumString(
            job.verification_status,
            "verification_job.verification_status",
            VERIFICATION_STATUSES
          ),
        }
      : {}),
    created_at: expectString(
      job.created_at,
      "verification_job.created_at"
    ),
    ...(job.started_at !== undefined
      ? {
          started_at: expectString(
            job.started_at,
            "verification_job.started_at"
          ),
        }
      : {}),
    completed_at: expectString(
      job.completed_at,
      "verification_job.completed_at"
    ),
    limitations: cloneArray(
      job.limitations === undefined
        ? []
        : expectArray(job.limitations, "verification_job.limitations")
    ),
  };
}

function readVerificationAttemptInput(value) {
  const attempt = expectPlainObject(value, "verification_attempt");
  const attemptNumber = expectPositiveInteger(
    attempt.attempt_number,
    "verification_attempt.attempt_number"
  );

  assertEqual(
    attemptNumber,
    1,
    "verification_attempt.attempt_number must be 1 for v0.1 single-attempt fixtures"
  );

  return {
    verification_attempt_id: expectString(
      attempt.verification_attempt_id,
      "verification_attempt.verification_attempt_id"
    ),
    attempt_number: attemptNumber,
    status: expectFixedString(
      attempt.status,
      "verification_attempt.status",
      COMPLETED_ATTEMPT_STATUS
    ),
    created_at: expectString(
      attempt.created_at,
      "verification_attempt.created_at"
    ),
    ...(attempt.replay_context !== undefined
      ? {
          replay_context: cloneValue(
            expectPlainObject(
              attempt.replay_context,
              "verification_attempt.replay_context"
            )
          ),
        }
      : {}),
    ...(attempt.started_at !== undefined
      ? {
          started_at: expectString(
            attempt.started_at,
            "verification_attempt.started_at"
          ),
        }
      : {}),
    completed_at: expectString(
      attempt.completed_at,
      "verification_attempt.completed_at"
    ),
  };
}

function readVerificationJobResultInput(value) {
  const result = expectPlainObject(value, "verification_job_result");

  if (result.report_integrity_status !== undefined) {
    throw new TypeError(
      "verification_job_result.report_integrity_status is derived by the fixture and must not be provided"
    );
  }

  return {
    verification_job_result_id: expectString(
      result.verification_job_result_id,
      "verification_job_result.verification_job_result_id"
    ),
    job_status: expectEnumString(
      result.job_status,
      "verification_job_result.job_status",
      COMPLETED_JOB_STATUSES
    ),
    ...(result.verification_status !== undefined
      ? {
          verification_status: expectEnumString(
            result.verification_status,
            "verification_job_result.verification_status",
            VERIFICATION_STATUSES
          ),
        }
      : {}),
    normalized_records: cloneArray(
      result.normalized_records === undefined
        ? []
        : expectArray(
            result.normalized_records,
            "verification_job_result.normalized_records"
          )
    ),
    findings: cloneArray(
      result.findings === undefined
        ? []
        : expectArray(result.findings, "verification_job_result.findings")
    ),
    finalized_at: expectString(
      result.finalized_at,
      "verification_job_result.finalized_at"
    ),
    ...(result.result_summary !== undefined
      ? {
          result_summary: expectString(
            result.result_summary,
            "verification_job_result.result_summary"
          ),
        }
      : {}),
  };
}

function readAssuranceReportInput(value) {
  const report = expectPlainObject(value, "assurance_report");

  if (report.report_integrity !== undefined) {
    throw new TypeError(
      "assurance_report.report_integrity must not be provided; it is generated deterministically"
    );
  }

  return {
    report_id: expectString(report.report_id, "assurance_report.report_id"),
    producer: cloneValue(
      expectPlainObject(report.producer, "assurance_report.producer")
    ),
    executed_checks: cloneArray(
      expectArray(report.executed_checks, "assurance_report.executed_checks")
    ),
    verified_claims: cloneArray(
      expectArray(report.verified_claims, "assurance_report.verified_claims")
    ),
    failed_checks: cloneArray(
      expectArray(report.failed_checks, "assurance_report.failed_checks")
    ),
    unresolved_findings: cloneArray(
      expectArray(
        report.unresolved_findings,
        "assurance_report.unresolved_findings"
      )
    ),
    missing_evidence: cloneArray(
      expectArray(report.missing_evidence, "assurance_report.missing_evidence")
    ),
    scope_limitations: cloneArray(
      expectArray(
        report.scope_limitations,
        "assurance_report.scope_limitations"
      )
    ),
    human_review_recommendations: cloneArray(
      expectArray(
        report.human_review_recommendations,
        "assurance_report.human_review_recommendations"
      )
    ),
    report_schema_version: expectFixedString(
      report.report_schema_version,
      "assurance_report.report_schema_version",
      "0.1"
    ),
    generated_at: expectString(
      report.generated_at,
      "assurance_report.generated_at"
    ),
    ...(report.verification_summary !== undefined
      ? {
          verification_summary: expectString(
            report.verification_summary,
            "assurance_report.verification_summary"
          ),
        }
      : {}),
  };
}

function readVerificationUsageRecordInput(value) {
  const usageRecord = expectPlainObject(
    value,
    "verification_usage_record"
  );

  return {
    usage_record_id: expectString(
      usageRecord.usage_record_id,
      "verification_usage_record.usage_record_id"
    ),
    verification_id: expectString(
      usageRecord.verification_id,
      "verification_usage_record.verification_id"
    ),
    verification_attempt_id: expectString(
      usageRecord.verification_attempt_id,
      "verification_usage_record.verification_attempt_id"
    ),
    evidence_package_count: expectNonNegativeInteger(
      usageRecord.evidence_package_count,
      "verification_usage_record.evidence_package_count"
    ),
    evidence_record_count: expectNonNegativeInteger(
      usageRecord.evidence_record_count,
      "verification_usage_record.evidence_record_count"
    ),
    assurance_profile_count: expectNonNegativeInteger(
      usageRecord.assurance_profile_count,
      "verification_usage_record.assurance_profile_count"
    ),
    verification_check_count: expectNonNegativeInteger(
      usageRecord.verification_check_count,
      "verification_usage_record.verification_check_count"
    ),
    ...(usageRecord.cryptographic_operation_count !== undefined
      ? {
          cryptographic_operation_count: expectNonNegativeInteger(
            usageRecord.cryptographic_operation_count,
            "verification_usage_record.cryptographic_operation_count"
          ),
        }
      : {}),
    ...(usageRecord.evidence_chain_depth !== undefined
      ? {
          evidence_chain_depth: expectNonNegativeInteger(
            usageRecord.evidence_chain_depth,
            "verification_usage_record.evidence_chain_depth"
          ),
        }
      : {}),
    report_count: expectNonNegativeInteger(
      usageRecord.report_count,
      "verification_usage_record.report_count"
    ),
    ...(usageRecord.retention_tier_ref !== undefined
      ? {
          retention_tier_ref: expectString(
            usageRecord.retention_tier_ref,
            "verification_usage_record.retention_tier_ref"
          ),
        }
      : {}),
    ...(usageRecord.retention_class !== undefined
      ? {
          retention_class: readRetentionClassReference(
            usageRecord.retention_class
          ),
        }
      : {}),
    ...(usageRecord.human_review_requested !== undefined
      ? {
          human_review_requested: expectBoolean(
            usageRecord.human_review_requested,
            "verification_usage_record.human_review_requested"
          ),
        }
      : {}),
    terminal_outcome: expectEnumString(
      usageRecord.terminal_outcome,
      "verification_usage_record.terminal_outcome",
      COMPLETED_JOB_STATUSES
    ),
    deterministic_result: {
      verification_job_result_id: expectString(
        expectPlainObject(
          usageRecord.deterministic_result,
          "verification_usage_record.deterministic_result"
        ).verification_job_result_id,
        "verification_usage_record.deterministic_result.verification_job_result_id"
      ),
    },
    recorded_at: expectString(
      usageRecord.recorded_at,
      "verification_usage_record.recorded_at"
    ),
    usage_schema_version: expectFixedString(
      usageRecord.usage_schema_version,
      "verification_usage_record.usage_schema_version",
      "0.1"
    ),
  };
}

function readRetentionClassReference(value) {
  const retentionClass = expectPlainObject(
    value,
    "verification_usage_record.retention_class"
  );

  return {
    retention_class_id: expectString(
      retentionClass.retention_class_id,
      "verification_usage_record.retention_class.retention_class_id"
    ),
    ...(retentionClass.retention_class_version !== undefined
      ? {
          retention_class_version: expectString(
            retentionClass.retention_class_version,
            "verification_usage_record.retention_class.retention_class_version"
          ),
        }
      : {}),
  };
}

function cloneArray(value) {
  return cloneValue(Array.isArray(value) ? value : []);
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

function deepEqualValue(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
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

function expectEnumString(value, label, allowedValues) {
  const actual = expectString(value, label);

  if (!allowedValues.has(actual)) {
    throw new TypeError(
      `${label} must be one of: ${Array.from(allowedValues).join(", ")}`
    );
  }

  return actual;
}

function expectFixedString(value, label, expected) {
  const actual = expectString(value, label);

  if (actual !== expected) {
    throw new TypeError(`${label} must be ${expected}`);
  }

  return actual;
}

function expectPositiveInteger(value, label) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new TypeError(`${label} must be a positive integer`);
  }

  return value;
}

function expectNonNegativeInteger(value, label) {
  if (!Number.isInteger(value) || value < 0) {
    throw new TypeError(`${label} must be a non-negative integer`);
  }

  return value;
}

function expectBoolean(value, label) {
  if (typeof value !== "boolean") {
    throw new TypeError(`${label} must be a boolean`);
  }

  return value;
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
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
