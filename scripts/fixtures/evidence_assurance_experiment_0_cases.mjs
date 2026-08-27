import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");

export function createExperiment0Cases() {
  const basePack = readJsonFixture("fixtures/ai-pr-low-risk-complete/evidence-pack.json");

  return {
    caseA_complete_bounded_evidence: {
      pack: cloneValue(basePack),
      external_assurance_reports: [
        createCiCdAssuranceReport({
          report_id: "assurance-report-ci-complete",
          build_outcome: "passed",
          test_outcome: "passed",
        }),
      ],
      normalized_records: [],
      review_scope: {},
    },
    caseB_structural_missing_evidence: {
      pack: mutatePack(basePack, (draft) => {
        draft.manifest.completeness = "partial";
        delete draft.provenance.source_pack_hash;
        draft.artifacts[0].sha256 = "";
      }),
      external_assurance_reports: [],
      normalized_records: [],
      review_scope: {},
    },
    caseC_conclusion_specific_missing_evidence: {
      pack: mutatePack(basePack, (draft) => {
        draft.workflow.environment = "staging";
      }),
      external_assurance_reports: [],
      normalized_records: [],
      review_scope: {
        runtime_behavior_in_scope: true,
      },
    },
    caseD_declared_only_evidence: {
      pack: mutatePack(basePack, (draft) => {
        draft.authority.authorization_status = "declared";
      }),
      external_assurance_reports: [],
      normalized_records: [],
      review_scope: {},
    },
    caseE_contradictory_evidence: {
      pack: cloneValue(basePack),
      external_assurance_reports: [
        createCiCdAssuranceReport({
          report_id: "assurance-report-ci-contradiction",
          build_outcome: "failed",
          test_outcome: "passed",
        }),
      ],
      normalized_records: [],
      review_scope: {},
    },
    caseF_integrity_valid_truth_unsupported: {
      pack: mutatePack(basePack, (draft) => {
        draft.workflow.environment = "staging";
      }),
      external_assurance_reports: [
        createRuntimeIntegrityOnlyAssuranceReport({
          report_id: "assurance-report-runtime-integrity-only",
        }),
      ],
      normalized_records: [
        createRuntimeNormalizedRecord({
          record_id: "normalized-runtime-integrity-only",
        }),
      ],
      review_scope: {
        runtime_behavior_in_scope: true,
      },
    },
    caseG_deterministic_rerun: {
      pack: cloneValue(basePack),
      external_assurance_reports: [
        createCiCdAssuranceReport({
          report_id: "assurance-report-ci-deterministic",
          build_outcome: "passed",
          test_outcome: "passed",
        }),
      ],
      normalized_records: [],
      review_scope: {},
    },
    caseH_not_applicable_evidence: {
      pack: cloneValue(basePack),
      external_assurance_reports: [],
      normalized_records: [],
      review_scope: {},
    },
  };
}

function readJsonFixture(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8"));
}

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function mutatePack(pack, mutate) {
  const draft = cloneValue(pack);
  mutate(draft);
  return draft;
}

function createCiCdAssuranceReport({ report_id, build_outcome, test_outcome }) {
  return {
    report_id,
    verification_id: `verification-${report_id}`,
    evidence_package: {
      package_id: `package-${report_id}`,
      package_version: "0.1",
      digest: `sha256:${report_id}-package-digest`,
      integrity_ref: `integrity://${report_id}`,
    },
    producer: {
      producer_id: `producer-${report_id}`,
      producer_name: "Synthetic CI/CD Producer",
      source_type: "ci_cd_evidence",
      external_reference: `local://${report_id}/producer`,
    },
    adapter: {
      adapter_id: "adapter.synthetic-ci",
      adapter_version: "0.1.0",
    },
    assurance_profiles: [
      {
        profile_id: "production_evidence_readiness",
        profile_version: "0.1",
      },
    ],
    executed_checks: [
      {
        check_type: "structural_validity",
        status: "verified",
        summary: "synthetic CI/CD evidence package is structurally valid",
        evidence_refs: [`evidence://${report_id}/structure`],
      },
      {
        check_type: "digest_integrity",
        status: "verified",
        summary: "synthetic CI/CD artifact digest matches producer record",
        evidence_refs: [`evidence://${report_id}/digest`],
      },
    ],
    verified_claims: [
      {
        claim_id: `${report_id}-build`,
        claim_type: "build_outcome",
        summary: `build ${build_outcome}`,
        evidence_refs: [`evidence://${report_id}/build`],
      },
      {
        claim_id: `${report_id}-test`,
        claim_type: "test_outcome",
        summary: `tests ${test_outcome}`,
        evidence_refs: [`evidence://${report_id}/tests`],
      },
    ],
    failed_checks: [],
    unresolved_findings: [],
    missing_evidence: [],
    scope_limitations: [
      "synthetic CI/CD assurance remains bounded to local deterministic review",
    ],
    human_review_recommendations: [
      {
        recommendation_id: `review-${report_id}`,
        summary: "review the CI/CD evidence in conjunction with the submitted pack",
        priority: "medium",
        evidence_refs: [`evidence://${report_id}/build`],
      },
    ],
    engine_version: "synthetic-ci-assurance-engine-v0.1",
    report_schema_version: "0.1",
    generated_at: "2026-08-27T10:00:00Z",
    report_integrity: {
      digest: `sha256:${report_id}-report-digest`,
      digest_algorithm: "sha256",
      integrity_ref: `integrity://${report_id}/report`,
    },
    verification_summary: "synthetic CI/CD assurance verified bounded build and test outcomes",
  };
}

function createRuntimeNormalizedRecord({ record_id }) {
  return {
    record: {
      record_id,
      record_version: "0.1",
      generated_at: "2026-08-27T10:05:00Z",
    },
    adapter: {
      adapter_name: "Synthetic Runtime Provenance Adapter",
      adapter_version: "0.1.0",
      source_type: "runtime_provenance_record",
      limitations: {
        limitations: [
          "runtime integrity is available, but outcome truth remains outside this synthetic example",
        ],
      },
    },
    source: {
      source_system: "synthetic-runtime-system",
      source_type: "runtime_provenance_record",
      issuer: "runtime.synthetic",
      issuer_key_ref: "key://runtime.synthetic",
      trust_status: "unknown",
    },
    receipt: {
      receipt_id: "runtime-receipt-001",
      receipt_version: "0.1",
      raw_receipt_ref: "local://runtime/receipt-001",
    },
    subject: {
      subject: "deployment/runtime/001",
      subject_type: "runtime_subject",
      action_summary: "bounded runtime provenance observation",
    },
    verification: {
      status: "verified",
      integrity: {
        payload_hash: "sha256:runtime-payload-001",
        hash_algorithm: "sha256",
        raw_payload_available: true,
        payload_hash_status: "match",
      },
      signature: {
        signature_present: true,
        signature_algorithm: "ed25519",
        signature_status: "valid",
        public_key_ref: "key://runtime.synthetic",
        issuer_key_available: true,
      },
      timestamp: {
        evidence_timestamp: "2026-08-27T09:58:00Z",
        timestamp_status: "valid",
        observed_at: "2026-08-27T10:05:00Z",
      },
      diagnostics: [],
      limitations: {
        limitations: [
          "integrity and timestamp checks do not establish the truth of the underlying runtime claim",
        ],
      },
    },
    contract_validation: {
      status: "contract_parseable",
      required_fields_present: true,
      missing_required_fields: [],
      diagnostics: [],
    },
    evidence: {
      evidence_refs: [
        "evidence://runtime/001",
      ],
      raw_payload_ref: "local://runtime/payload-001",
      external_report_uri: "local://runtime/report-001",
      completeness_status: "partial",
    },
    diagnostics: [],
    findings: [],
  };
}

function createRuntimeIntegrityOnlyAssuranceReport({ report_id }) {
  return {
    report_id,
    verification_id: `verification-${report_id}`,
    evidence_package: {
      package_id: `package-${report_id}`,
      package_version: "0.1",
      digest: `sha256:${report_id}-package-digest`,
      integrity_ref: `integrity://${report_id}`,
    },
    producer: {
      producer_id: `producer-${report_id}`,
      producer_name: "Synthetic Runtime Producer",
      source_type: "runtime_provenance_record",
      external_reference: `local://${report_id}/producer`,
    },
    adapter: {
      adapter_id: "adapter.synthetic-runtime",
      adapter_version: "0.1.0",
    },
    assurance_profiles: [
      {
        profile_id: "production_evidence_readiness",
        profile_version: "0.1",
      },
    ],
    executed_checks: [
      {
        check_type: "digest_integrity",
        status: "verified",
        summary: "runtime artifact digest is intact",
        evidence_refs: ["evidence://runtime/001"],
      },
      {
        check_type: "temporal_consistency",
        status: "verified",
        summary: "runtime evidence timestamp is fresh inside the bounded window",
        evidence_refs: ["evidence://runtime/001"],
      },
    ],
    verified_claims: [],
    failed_checks: [],
    unresolved_findings: [
      {
        finding_id: `${report_id}-truth-gap`,
        finding_type: "truth_gap",
        category: "review",
        severity: "medium",
        message: "integrity validation succeeded, but no independent runtime truth claim was verified",
        evidence_ref: "evidence://runtime/001",
        recommendation: "supplement with runtime outcome evidence before treating this as truth verification",
        verification_stage: "emit_findings",
        source_adapter: "adapter.synthetic-runtime",
      },
    ],
    missing_evidence: [
      {
        missing_evidence_id: `${report_id}-missing-truth`,
        description: "independent runtime truth verification is absent",
        evidence_refs: ["evidence://runtime/001"],
      },
    ],
    scope_limitations: [
      "runtime integrity was verified, but outcome truth remains outside this bounded dry run",
    ],
    human_review_recommendations: [
      {
        recommendation_id: `review-${report_id}`,
        summary: "review runtime truth support before relying on this bounded runtime evidence",
        priority: "high",
        evidence_refs: ["evidence://runtime/001"],
      },
    ],
    engine_version: "synthetic-runtime-assurance-engine-v0.1",
    report_schema_version: "0.1",
    generated_at: "2026-08-27T10:06:00Z",
    report_integrity: {
      digest: `sha256:${report_id}-report-digest`,
      digest_algorithm: "sha256",
      integrity_ref: `integrity://${report_id}/report`,
    },
    verification_summary: "synthetic runtime assurance verified integrity only",
  };
}
