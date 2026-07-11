export function buildLocalAssuranceReportFixture(input) {
  const fixtureInput = expectPlainObject(input, "input");
  const verificationId = expectString(
    fixtureInput.verification_id,
    "verification_id"
  );
  const reportId = expectString(fixtureInput.report_id, "report_id");
  const requestId = expectString(fixtureInput.request_id, "request_id");
  const jobStatus = expectEnumString(
    fixtureInput.job_status,
    "job_status",
    VERIFICATION_JOB_STATUSES
  );
  const contractVersion = expectFixedString(
    fixtureInput.contract_version,
    "contract_version",
    "0.1"
  );
  const engineVersion = expectString(
    fixtureInput.engine_version,
    "engine_version"
  );
  const reportSchemaVersion = expectFixedString(
    fixtureInput.report_schema_version,
    "report_schema_version",
    "0.1"
  );
  const createdAt = expectString(fixtureInput.created_at, "created_at");
  const generatedAt = expectString(fixtureInput.generated_at, "generated_at");

  const evidencePackage = expectEvidencePackageReference(
    fixtureInput.evidence_package
  );
  const producer = expectEvidenceProducerReference(fixtureInput.producer);
  const adapter = expectAdapterManifestReference(fixtureInput.adapter);
  const assuranceProfiles = expectAssuranceProfileReferences(
    fixtureInput.assurance_profiles
  );
  const executedChecks = expectAssuranceCheckSummaries(
    fixtureInput.executed_checks,
    "executed_checks"
  );
  const verifiedClaims = expectVerificationClaims(
    fixtureInput.verified_claims,
    "verified_claims"
  );
  const failedChecks = expectAssuranceCheckSummaries(
    fixtureInput.failed_checks,
    "failed_checks"
  );
  const findings = expectVerificationFindings(
    fixtureInput.findings,
    "findings"
  );
  const unresolvedFindings = expectVerificationFindings(
    fixtureInput.unresolved_findings,
    "unresolved_findings"
  );
  const missingEvidence = expectMissingEvidenceReferences(
    fixtureInput.missing_evidence
  );
  const limitations = expectStringArray(
    fixtureInput.limitations,
    "limitations"
  );
  const scopeLimitations = expectStringArray(
    fixtureInput.scope_limitations,
    "scope_limitations"
  );
  const humanReviewRecommendations = expectHumanReviewRecommendations(
    fixtureInput.human_review_recommendations
  );
  const usageRecord = expectVerificationUsageRecord(
    fixtureInput.verification_usage_record
  );

  if (usageRecord.verification_id !== verificationId) {
    throw new TypeError(
      "verification_usage_record.verification_id must match verification_id"
    );
  }

  const verificationJob = {
    verification_id: verificationId,
    request: {
      request_id: requestId,
      ...(hasNonEmptyString(fixtureInput.caller_reference)
        ? { caller_reference: fixtureInput.caller_reference }
        : {}),
    },
    evidence_package: evidencePackage,
    adapter,
    assurance_profiles: assuranceProfiles,
    contract_version: contractVersion,
    engine_version: engineVersion,
    status: jobStatus,
    ...(fixtureInput.verification_status !== undefined
      ? {
          verification_status: expectEnumString(
            fixtureInput.verification_status,
            "verification_status",
            VERIFICATION_STATUSES
          ),
        }
      : {}),
    created_at: createdAt,
    ...(hasNonEmptyString(fixtureInput.started_at)
      ? { started_at: fixtureInput.started_at }
      : {}),
    ...(hasNonEmptyString(fixtureInput.completed_at)
      ? { completed_at: fixtureInput.completed_at }
      : {}),
    ...(Array.isArray(fixtureInput.normalized_records)
      ? { normalized_records: cloneValue(fixtureInput.normalized_records) }
      : {}),
    findings,
    limitations,
    usage_record: {
      usage_record_id: expectString(usageRecord.usage_record_id, "usage_record_id"),
    },
    assurance_report: {
      report_id: reportId,
    },
  };

  const assuranceReport = {
    report_id: reportId,
    verification_id: verificationId,
    evidence_package: cloneValue(evidencePackage),
    producer,
    adapter: cloneValue(adapter),
    assurance_profiles: cloneValue(assuranceProfiles),
    executed_checks: executedChecks,
    verified_claims: verifiedClaims,
    failed_checks: failedChecks,
    unresolved_findings: unresolvedFindings,
    missing_evidence: missingEvidence,
    scope_limitations: scopeLimitations,
    human_review_recommendations: humanReviewRecommendations,
    engine_version: engineVersion,
    report_schema_version: reportSchemaVersion,
    generated_at: generatedAt,
    ...(fixtureInput.report_integrity !== undefined
      ? {
          report_integrity: expectEvidenceIntegrityReference(
            fixtureInput.report_integrity,
            "report_integrity"
          ),
        }
      : {}),
    ...(hasNonEmptyString(fixtureInput.verification_summary)
      ? { verification_summary: fixtureInput.verification_summary }
      : {}),
  };

  return {
    verification_job: verificationJob,
    assurance_report: assuranceReport,
    verification_usage_record: usageRecord,
  };
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

function expectFixedString(value, label, expected) {
  const actual = expectString(value, label);
  if (actual !== expected) {
    throw new TypeError(`${label} must be ${expected}`);
  }

  return actual;
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

function hasNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
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

function expectOptionalString(value, label) {
  if (value === undefined) {
    return undefined;
  }

  return expectString(value, label);
}

function expectOptionalStringArray(value, label) {
  if (value === undefined) {
    return undefined;
  }

  return expectStringArray(value, label);
}

function expectStringArray(value, label) {
  const entries = expectArray(value, label);
  return entries.map((entry, index) =>
    expectString(entry, `${label}[${index}]`)
  );
}

function expectOptionalBoolean(value, label) {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "boolean") {
    throw new TypeError(`${label} must be a boolean`);
  }

  return value;
}

function expectEvidencePackageReference(value) {
  const reference = expectPlainObject(value, "evidence_package");

  return {
    package_id: expectString(reference.package_id, "evidence_package.package_id"),
    ...(reference.package_version !== undefined
      ? {
          package_version: expectString(
            reference.package_version,
            "evidence_package.package_version"
          ),
        }
      : {}),
    ...(reference.digest !== undefined
      ? { digest: expectString(reference.digest, "evidence_package.digest") }
      : {}),
    ...(reference.integrity_ref !== undefined
      ? {
          integrity_ref: expectString(
            reference.integrity_ref,
            "evidence_package.integrity_ref"
          ),
        }
      : {}),
  };
}

function expectEvidenceProducerReference(value) {
  const producer = expectPlainObject(value, "producer");

  return {
    ...(producer.producer_id !== undefined
      ? { producer_id: expectString(producer.producer_id, "producer.producer_id") }
      : {}),
    ...(producer.producer_name !== undefined
      ? {
          producer_name: expectString(
            producer.producer_name,
            "producer.producer_name"
          ),
        }
      : {}),
    source_type: expectEnumString(
      producer.source_type,
      "producer.source_type",
      EVIDENCE_SOURCE_TYPES
    ),
    ...(producer.external_reference !== undefined
      ? {
          external_reference: expectString(
            producer.external_reference,
            "producer.external_reference"
          ),
        }
      : {}),
  };
}

function expectAdapterManifestReference(value) {
  const adapter = expectPlainObject(value, "adapter");

  return {
    adapter_id: expectString(adapter.adapter_id, "adapter.adapter_id"),
    adapter_version: expectString(
      adapter.adapter_version,
      "adapter.adapter_version"
    ),
  };
}

function expectAssuranceProfileReferences(value) {
  const profiles = expectArray(value, "assurance_profiles");

  return profiles.map((profile, index) => {
    const reference = expectPlainObject(
      profile,
      `assurance_profiles[${index}]`
    );

    return {
      profile_id: expectString(
        reference.profile_id,
        `assurance_profiles[${index}].profile_id`
      ),
      profile_version: expectString(
        reference.profile_version,
        `assurance_profiles[${index}].profile_version`
      ),
    };
  });
}

function expectAssuranceCheckSummaries(value, label) {
  const checks = expectArray(value, label);

  return checks.map((check, index) => {
    const summary = expectPlainObject(check, `${label}[${index}]`);

    return {
      check_type: expectEnumString(
        summary.check_type,
        `${label}[${index}].check_type`,
        ASSURANCE_CHECK_TYPES
      ),
      status: expectEnumString(
        summary.status,
        `${label}[${index}].status`,
        ASSURANCE_CHECK_EXECUTION_STATUSES
      ),
      summary: expectString(summary.summary, `${label}[${index}].summary`),
      ...(summary.evidence_refs !== undefined
        ? {
            evidence_refs: expectStringArray(
              summary.evidence_refs,
              `${label}[${index}].evidence_refs`
            ),
          }
        : {}),
    };
  });
}

function expectVerificationClaims(value, label) {
  const claims = expectArray(value, label);

  return claims.map((claim, index) => {
    const entry = expectPlainObject(claim, `${label}[${index}]`);

    return {
      claim_id: expectString(entry.claim_id, `${label}[${index}].claim_id`),
      claim_type: expectString(
        entry.claim_type,
        `${label}[${index}].claim_type`
      ),
      summary: expectString(entry.summary, `${label}[${index}].summary`),
      ...(entry.evidence_refs !== undefined
        ? {
            evidence_refs: expectStringArray(
              entry.evidence_refs,
              `${label}[${index}].evidence_refs`
            ),
          }
        : {}),
    };
  });
}

function expectVerificationFindings(value, label) {
  const findings = expectArray(value, label);

  return findings.map((finding, index) => {
    const entry = expectPlainObject(finding, `${label}[${index}]`);

    return {
      finding_id: expectString(entry.finding_id, `${label}[${index}].finding_id`),
      finding_type: expectString(
        entry.finding_type,
        `${label}[${index}].finding_type`
      ),
      category: expectEnumString(
        entry.category,
        `${label}[${index}].category`,
        FINDING_CATEGORIES
      ),
      severity: expectEnumString(
        entry.severity,
        `${label}[${index}].severity`,
        FINDING_SEVERITIES
      ),
      ...(entry.field !== undefined
        ? { field: expectString(entry.field, `${label}[${index}].field`) }
        : {}),
      message: expectString(entry.message, `${label}[${index}].message`),
      ...(entry.evidence_ref !== undefined
        ? {
            evidence_ref: expectString(
              entry.evidence_ref,
              `${label}[${index}].evidence_ref`
            ),
          }
        : {}),
      ...(entry.recommendation !== undefined
        ? {
            recommendation: expectString(
              entry.recommendation,
              `${label}[${index}].recommendation`
            ),
          }
        : {}),
      ...(entry.verification_stage !== undefined
        ? {
            verification_stage: expectEnumString(
              entry.verification_stage,
              `${label}[${index}].verification_stage`,
              ADAPTER_DIAGNOSTIC_STAGES
            ),
          }
        : {}),
      ...(entry.source_adapter !== undefined
        ? {
            source_adapter: expectString(
              entry.source_adapter,
              `${label}[${index}].source_adapter`
            ),
          }
        : {}),
    };
  });
}

function expectMissingEvidenceReferences(value) {
  const entries = expectArray(value, "missing_evidence");

  return entries.map((entry, index) => {
    const reference = expectPlainObject(entry, `missing_evidence[${index}]`);

    return {
      missing_evidence_id: expectString(
        reference.missing_evidence_id,
        `missing_evidence[${index}].missing_evidence_id`
      ),
      description: expectString(
        reference.description,
        `missing_evidence[${index}].description`
      ),
      ...(reference.evidence_refs !== undefined
        ? {
            evidence_refs: expectStringArray(
              reference.evidence_refs,
              `missing_evidence[${index}].evidence_refs`
            ),
          }
        : {}),
    };
  });
}

function expectHumanReviewRecommendations(value) {
  const entries = expectArray(
    value,
    "human_review_recommendations"
  );

  return entries.map((entry, index) => {
    const recommendation = expectPlainObject(
      entry,
      `human_review_recommendations[${index}]`
    );

    return {
      recommendation_id: expectString(
        recommendation.recommendation_id,
        `human_review_recommendations[${index}].recommendation_id`
      ),
      summary: expectString(
        recommendation.summary,
        `human_review_recommendations[${index}].summary`
      ),
      ...(recommendation.priority !== undefined
        ? {
            priority: expectEnumString(
              recommendation.priority,
              `human_review_recommendations[${index}].priority`,
              FINDING_SEVERITIES
            ),
          }
        : {}),
      ...(recommendation.evidence_refs !== undefined
        ? {
            evidence_refs: expectStringArray(
              recommendation.evidence_refs,
              `human_review_recommendations[${index}].evidence_refs`
            ),
          }
        : {}),
    };
  });
}

function expectVerificationUsageRecord(value) {
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
    evidence_package_count: expectNumber(
      usageRecord.evidence_package_count,
      "verification_usage_record.evidence_package_count"
    ),
    evidence_record_count: expectNumber(
      usageRecord.evidence_record_count,
      "verification_usage_record.evidence_record_count"
    ),
    assurance_profile_count: expectNumber(
      usageRecord.assurance_profile_count,
      "verification_usage_record.assurance_profile_count"
    ),
    verification_check_count: expectNumber(
      usageRecord.verification_check_count,
      "verification_usage_record.verification_check_count"
    ),
    ...(usageRecord.cryptographic_operation_count !== undefined
      ? {
          cryptographic_operation_count: expectNumber(
            usageRecord.cryptographic_operation_count,
            "verification_usage_record.cryptographic_operation_count"
          ),
        }
      : {}),
    ...(usageRecord.evidence_chain_depth !== undefined
      ? {
          evidence_chain_depth: expectNumber(
            usageRecord.evidence_chain_depth,
            "verification_usage_record.evidence_chain_depth"
          ),
        }
      : {}),
    report_count: expectNumber(
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
    ...(usageRecord.human_review_requested !== undefined
      ? {
          human_review_requested: expectOptionalBoolean(
            usageRecord.human_review_requested,
            "verification_usage_record.human_review_requested"
          ),
        }
      : {}),
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

function expectEvidenceIntegrityReference(value, label) {
  const reference = expectPlainObject(value, label);
  const digest = expectOptionalString(reference.digest, `${label}.digest`);
  const digestAlgorithm = expectOptionalString(
    reference.digest_algorithm,
    `${label}.digest_algorithm`
  );
  const integrityRef = expectOptionalString(
    reference.integrity_ref,
    `${label}.integrity_ref`
  );

  if (
    digest === undefined &&
    digestAlgorithm === undefined &&
    integrityRef === undefined
  ) {
    throw new TypeError(
      `${label} must include at least one integrity reference field`
    );
  }

  return {
    ...(digest !== undefined ? { digest } : {}),
    ...(digestAlgorithm !== undefined
      ? { digest_algorithm: digestAlgorithm }
      : {}),
    ...(integrityRef !== undefined ? { integrity_ref: integrityRef } : {}),
  };
}

function expectNumber(value, label) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`${label} must be a finite number`);
  }

  return value;
}

const EVIDENCE_SOURCE_TYPES = new Set([
  "runtime_receipt",
  "evidence_pack",
  "ci_cd_evidence",
  "agent_action_evidence",
  "policy_decision_artifact",
  "external_verifier_output",
  "runtime_provenance_record",
  "unknown",
]);

const VERIFICATION_JOB_STATUSES = new Set([
  "pending",
  "ready",
  "completed",
  "completed_with_findings",
  "unsupported",
  "invalid_input",
  "verification_error",
]);

const VERIFICATION_STATUSES = new Set([
  "verified",
  "not_verified",
  "partially_verified",
  "verification_not_performed",
  "verification_error",
]);

const ASSURANCE_CHECK_TYPES = new Set([
  "structural_validity",
  "required_field_completeness",
  "payload_binding",
  "digest_integrity",
  "signature_validity",
  "temporal_consistency",
  "provenance_completeness",
  "evidence_chain_completeness",
]);

const ASSURANCE_CHECK_EXECUTION_STATUSES = new Set([
  "verified",
  "failed",
  "not_run",
  "unsupported",
  "partially_verified",
]);

const FINDING_SEVERITIES = new Set([
  "info",
  "low",
  "medium",
  "high",
  "critical",
]);

const FINDING_CATEGORIES = new Set([
  "identity",
  "integrity",
  "signature",
  "timestamp",
  "policy_reference",
  "evidence_completeness",
  "adapter",
  "compatibility",
  "review",
]);

const ADAPTER_DIAGNOSTIC_STAGES = new Set([
  "parse",
  "validate",
  "verify",
  "normalize",
  "emit_findings",
]);
