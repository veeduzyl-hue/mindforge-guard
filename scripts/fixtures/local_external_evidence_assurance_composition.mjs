import { normalizeLocalExternalEvidence } from "../../packages/guard-core/src/externalEvidence/localDeclarativeNormalizationFixture.mjs";
import { buildLocalAssuranceReportFixture } from "../../packages/guard-core/src/externalEvidence/localAssuranceReportFixture.mjs";
import { verifyAssuranceReportIntegrity } from "../../packages/guard-core/src/externalEvidence/localAssuranceReportIntegrity.mjs";

const PARTIAL_SCOPE_LIMITATION =
  "Normalized evidence remains partially parseable; inspect normalization_findings before relying on this local composition output.";

export function composeLocalExternalEvidenceAssurance(input) {
  const args = expectObject(input, "input");
  const assuranceContext = expectObject(args.assurance_context, "assurance_context");
  const normalizationResult = normalizeLocalExternalEvidence({
    raw_evidence: args.raw_evidence,
    mapping_manifest: args.mapping_manifest,
  });
  const normalizedRecord = readNormalizedRecord(normalizationResult.normalized_record);
  const diagnostics = [];
  validateInputBindings(normalizedRecord, assuranceContext);
  if (normalizedRecord.contract_validation.status === "contract_not_parseable") {
    diagnostics.push(
      createDiagnostic(
        "normalization_not_parseable",
        `normalized record ${normalizedRecord.record.record_id} does not contain enough required fields for local assurance composition`
      )
    );

    return {
      normalization_result: normalizationResult,
      assurance_bundle: null,
      composition_diagnostics: diagnostics,
    };
  }
  if (
    normalizedRecord.contract_validation.status ===
    "contract_partially_parseable"
  ) {
    diagnostics.push(
      createDiagnostic(
        "normalization_incomplete",
        `normalized record ${normalizedRecord.record.record_id} remains partially parseable`
      )
    );
  }

  const assuranceBundle = buildLocalAssuranceReportFixture({
    verification_id: assuranceContext.verification_id,
    report_id: assuranceContext.report_id,
    request_id: assuranceContext.request_id,
    ...(hasString(assuranceContext.caller_reference)
      ? { caller_reference: assuranceContext.caller_reference }
      : {}),
    job_status:
      normalizedRecord.contract_validation.status ===
      "contract_partially_parseable"
        ? "completed_with_findings"
        : "completed",
    verification_status: "verification_not_performed",
    contract_version: assuranceContext.contract_version,
    engine_version: assuranceContext.engine_version,
    report_schema_version: assuranceContext.report_schema_version,
    created_at: assuranceContext.created_at,
    ...(hasString(assuranceContext.started_at)
      ? { started_at: assuranceContext.started_at }
      : {}),
    ...(hasString(assuranceContext.completed_at)
      ? { completed_at: assuranceContext.completed_at }
      : {}),
    generated_at: assuranceContext.generated_at,
    evidence_package: structuredClone(
      expectObject(assuranceContext.evidence_package, "assurance_context.evidence_package")
    ),
    producer: structuredClone(
      expectObject(assuranceContext.producer, "assurance_context.producer")
    ),
    adapter: structuredClone(
      expectObject(assuranceContext.adapter, "assurance_context.adapter")
    ),
    assurance_profiles: structuredClone(
      expectArray(
        assuranceContext.assurance_profiles,
        "assurance_context.assurance_profiles"
      )
    ),
    executed_checks: [],
    verified_claims: [],
    failed_checks: [],
    findings: cloneArray(assuranceContext.findings),
    unresolved_findings: cloneArray(assuranceContext.unresolved_findings),
    missing_evidence: cloneArray(assuranceContext.missing_evidence),
    limitations: uniqueStrings(
      normalizationResult.declared_limitations ?? [],
      assuranceContext.limitations ?? []
    ),
    scope_limitations: uniqueStrings(
      assuranceContext.scope_limitations ?? [],
      normalizedRecord.contract_validation.status === "contract_partially_parseable"
        ? [PARTIAL_SCOPE_LIMITATION]
        : []
    ),
    human_review_recommendations: cloneArray(
      assuranceContext.human_review_recommendations
    ),
    normalized_records: [structuredClone(normalizedRecord)],
    ...(hasString(assuranceContext.verification_summary)
      ? { verification_summary: assuranceContext.verification_summary }
      : {}),
    verification_usage_record: createUsageRecord(assuranceContext),
  });

  validateBundleBindings(assuranceBundle, normalizedRecord, assuranceContext);

  if (!verifyAssuranceReportIntegrity(assuranceBundle.assurance_report).matches) {
    throw new TypeError(
      "assurance_report failed deterministic integrity verification"
    );
  }

  return {
    normalization_result: normalizationResult,
    assurance_bundle: assuranceBundle,
    composition_diagnostics: diagnostics,
  };
}

function readNormalizedRecord(value) {
  const normalizedRecord = expectObject(value, "normalization_result.normalized_record");
  for (const key of ["record", "adapter", "source", "contract_validation"]) {
    normalizedRecord[key] = expectObject(
      normalizedRecord[key],
      `normalization_result.normalized_record.${key}`
    );
  }
  return normalizedRecord;
}

function validateInputBindings(normalizedRecord, assuranceContext) {
  const binding = expectObject(assuranceContext.normalized_record_binding, "assurance_context.normalized_record_binding");
  const producer = expectObject(assuranceContext.producer, "assurance_context.producer");
  const adapter = expectObject(assuranceContext.adapter, "assurance_context.adapter");
  const adapterIdentity = expectObject(
    assuranceContext.adapter_identity,
    "assurance_context.adapter_identity"
  );

  assertEqual(
    normalizedRecord.record.record_id,
    expectString(binding.record_id, "assurance_context.normalized_record_binding.record_id"),
    "normalized record ID does not match assurance_context.normalized_record_binding.record_id"
  );
  assertEqual(
    normalizedRecord.source.source_type,
    expectString(binding.source_type, "assurance_context.normalized_record_binding.source_type"),
    "normalized record source type does not match assurance_context.normalized_record_binding.source_type"
  );
  assertEqual(
    normalizedRecord.adapter.adapter_name,
    expectString(binding.adapter_name, "assurance_context.normalized_record_binding.adapter_name"),
    "normalized adapter name does not match assurance_context.normalized_record_binding.adapter_name"
  );
  assertEqual(
    normalizedRecord.adapter.adapter_version,
    expectString(binding.adapter_version, "assurance_context.normalized_record_binding.adapter_version"),
    "normalized adapter version does not match assurance_context.normalized_record_binding.adapter_version"
  );
  assertEqual(
    normalizedRecord.source.source_type,
    expectString(producer.source_type, "assurance_context.producer.source_type"),
    "normalized source type does not match assurance_context.producer.source_type"
  );
  assertEqual(
    normalizedRecord.adapter.adapter_name,
    expectString(adapterIdentity.adapter_name, "assurance_context.adapter_identity.adapter_name"),
    "normalized adapter name does not match assurance_context.adapter_identity.adapter_name"
  );
  assertEqual(
    normalizedRecord.adapter.adapter_version,
    expectString(adapter.adapter_version, "assurance_context.adapter.adapter_version"),
    "normalized adapter version does not match assurance_context.adapter.adapter_version"
  );
  assertEqual(
    normalizedRecord.adapter.adapter_version,
    expectString(adapterIdentity.adapter_version, "assurance_context.adapter_identity.adapter_version"),
    "normalized adapter version does not match assurance_context.adapter_identity.adapter_version"
  );
  assertEqual(
    normalizedRecord.adapter.source_type,
    expectString(adapterIdentity.source_type, "assurance_context.adapter_identity.source_type"),
    "normalized adapter source type does not match assurance_context.adapter_identity.source_type"
  );
}

function createUsageRecord(assuranceContext) {
  const usage = expectObject(assuranceContext.usage, "assurance_context.usage");
  return {
    usage_record_id: assuranceContext.usage_record_id,
    verification_id: assuranceContext.verification_id,
    evidence_package_count: usage.evidence_package_count,
    evidence_record_count: usage.evidence_record_count,
    assurance_profile_count: usage.assurance_profile_count,
    verification_check_count: usage.verification_check_count,
    ...(usage.cryptographic_operation_count !== undefined
      ? { cryptographic_operation_count: usage.cryptographic_operation_count }
      : {}),
    ...(usage.evidence_chain_depth !== undefined
      ? { evidence_chain_depth: usage.evidence_chain_depth }
      : {}),
    report_count: usage.report_count,
    ...(hasString(usage.retention_tier_ref)
      ? { retention_tier_ref: usage.retention_tier_ref }
      : {}),
    ...(typeof usage.human_review_requested === "boolean"
      ? { human_review_requested: usage.human_review_requested }
      : {}),
    recorded_at: assuranceContext.recorded_at,
    usage_schema_version: "0.1",
  };
}

function validateBundleBindings(assuranceBundle, normalizedRecord, assuranceContext) {
  const verificationJob = expectObject(
    assuranceBundle.verification_job,
    "assurance_bundle.verification_job"
  );
  const assuranceReport = expectObject(
    assuranceBundle.assurance_report,
    "assurance_bundle.assurance_report"
  );
  const usageRecord = expectObject(assuranceBundle.verification_usage_record, "assurance_bundle.verification_usage_record");
  assertEqual(
    verificationJob.verification_id,
    assuranceContext.verification_id,
    "verification job ID does not match assurance_context.verification_id"
  );
  assertEqual(
    assuranceReport.verification_id,
    verificationJob.verification_id,
    "assurance report verification ID does not match verification job ID"
  );
  assertEqual(
    usageRecord.verification_id,
    verificationJob.verification_id,
    "usage record verification ID does not match verification job ID"
  );
  assertEqual(
    assuranceReport.report_id,
    assuranceContext.report_id,
    "assurance report ID does not match assurance_context.report_id"
  );
  assertEqual(
    verificationJob.assurance_report?.report_id,
    assuranceReport.report_id,
    "verification job assurance_report.report_id does not match assurance report ID"
  );
  assertEqual(
    verificationJob.usage_record?.usage_record_id,
    assuranceContext.usage_record_id,
    "verification job usage_record.usage_record_id does not match assurance_context.usage_record_id"
  );
  assertEqual(
    verificationJob.evidence_package?.package_id,
    assuranceContext.evidence_package.package_id,
    "verification job evidence package reference does not match assurance_context.evidence_package.package_id"
  );
  assertEqual(
    assuranceReport.producer?.source_type,
    normalizedRecord.source.source_type,
    "assurance report producer source type does not match normalized record source type"
  );
  assertEqual(
    assuranceReport.adapter?.adapter_id,
    assuranceContext.adapter.adapter_id,
    "assurance report adapter ID does not match assurance_context.adapter.adapter_id"
  );
  assertEqual(
    assuranceReport.adapter?.adapter_version,
    assuranceContext.adapter.adapter_version,
    "assurance report adapter version does not match assurance_context.adapter.adapter_version"
  );
  assertEqual(
    verificationJob.normalized_records?.[0]?.record?.record_id,
    normalizedRecord.record.record_id,
    "verification job normalized record ID does not match normalized record"
  );

  if (
    JSON.stringify(verificationJob.assurance_profiles) !==
      JSON.stringify(assuranceContext.assurance_profiles) ||
    JSON.stringify(assuranceReport.assurance_profiles) !==
      JSON.stringify(assuranceContext.assurance_profiles)
  ) {
    throw new TypeError(
      "assurance profile references do not match assurance_context.assurance_profiles"
    );
  }
}

function createDiagnostic(code, message) {
  return { code, message };
}
function cloneArray(value) {
  return structuredClone(Array.isArray(value) ? value : []);
}
function uniqueStrings(...lists) {
  return Array.from(new Set(lists.flat().filter((value) => value !== "")));
}
function expectObject(value, label) {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    Object.getPrototypeOf(value) !== Object.prototype
  ) {
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
function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new TypeError(message);
  }
}
function hasString(value) {
  return typeof value === "string" && value.trim() !== "";
}
