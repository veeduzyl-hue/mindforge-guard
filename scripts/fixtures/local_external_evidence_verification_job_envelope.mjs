import { buildLocalVerificationJobEnvelopeFixture } from "../../packages/guard-core/src/externalEvidence/localVerificationJobEnvelopeFixture.mjs";

export function createCompletedVerificationJobEnvelopeInput() {
  return {
    verification_request: {
      request_id: "request-generic-runtime-001",
      caller_reference: "demo-generic-runtime-envelope",
      evidence_package: {
        package_id: "package-generic-runtime-001",
        package_version: "0.1",
        digest: "sha256:generic-runtime-package-digest",
        integrity_ref: "integrity://local/package-generic-runtime-001",
      },
      adapter: {
        adapter_id: "adapter-generic-runtime",
        adapter_version: "0.1.0",
      },
      requested_assurance_profiles: [
        {
          profile_id: "profile-generic-runtime-001",
          profile_version: "0.1",
        },
      ],
      requested_at: "2026-07-15T01:00:00.000Z",
      human_review_context: {
        requested: false,
        notes: ["No manual review requested for the completed sample."],
      },
      customer_reference: "customer-generic-runtime",
      request_metadata: {
        fixture_case: "completed",
      },
    },
    verification_job: {
      verification_id: "verification-generic-runtime-001",
      contract_version: "0.1",
      engine_version: "guard-core-local-envelope-fixture-v0.1",
      status: "completed",
      verification_status: "partially_verified",
      created_at: "2026-07-15T01:00:01.000Z",
      started_at: "2026-07-15T01:00:02.000Z",
      completed_at: "2026-07-15T01:00:06.000Z",
      limitations: [
        "This local envelope fixture remains bounded to deterministic offline review artifacts.",
      ],
    },
    verification_attempt: {
      verification_attempt_id: "attempt-generic-runtime-001",
      attempt_number: 1,
      status: "completed",
      created_at: "2026-07-15T01:00:02.000Z",
      started_at: "2026-07-15T01:00:03.000Z",
      completed_at: "2026-07-15T01:00:05.000Z",
    },
    verification_job_result: {
      verification_job_result_id: "result-generic-runtime-001",
      job_status: "completed",
      verification_status: "partially_verified",
      normalized_records: [
        {
          record: {
            record_id: "normalized-generic-runtime-001",
            record_version: "0.1",
            generated_at: "2026-07-15T01:00:03.500Z",
          },
          adapter: {
            adapter_name: "Generic Runtime Adapter",
            adapter_version: "0.1.0",
            source_type: "runtime_receipt",
          },
          source: {
            source_system: "generic-runtime-source",
            source_type: "runtime_receipt",
            issuer: "Generic Runtime Evidence Source",
            trust_status: "known",
          },
          receipt: {
            receipt_id: "receipt-generic-runtime-001",
            receipt_version: "0.1",
            raw_receipt_ref: "local://generic/runtime/receipt-001",
          },
          subject: {
            subject: "runtime-artifact-001",
            subject_type: "application_artifact",
            action_summary: "Generic runtime evidence review",
          },
          verification: {
            status: "partially_verified",
            integrity: {
              payload_hash: "sha256:generic-runtime-payload-digest",
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
            evidence_refs: ["record-generic-runtime-001"],
            raw_payload_ref: "local://generic/runtime/payload-001",
            external_report_uri: "local://generic/runtime/report-001",
            completeness_status: "complete",
          },
          diagnostics: [],
          findings: [],
        },
      ],
      findings: [],
      finalized_at: "2026-07-15T01:00:06.500Z",
      result_summary:
        "Generic runtime verification completed without unresolved findings.",
    },
    assurance_report: {
      report_id: "report-generic-runtime-001",
      producer: {
        producer_id: "producer-generic-runtime-001",
        producer_name: "Generic Runtime Evidence Source",
        source_type: "runtime_receipt",
        external_reference: "local://generic/runtime/source-001",
      },
      executed_checks: [
        {
          check_type: "structural_validity",
          status: "verified",
          summary:
            "Generic runtime evidence matched the declared structural contract.",
          evidence_refs: ["record-generic-runtime-001"],
        },
        {
          check_type: "digest_integrity",
          status: "verified",
          summary:
            "Payload digest bindings matched the provided runtime evidence record.",
          evidence_refs: ["record-generic-runtime-001"],
        },
      ],
      verified_claims: [
        {
          claim_id: "claim-generic-runtime-001",
          claim_type: "payload_binding",
          summary:
            "The generic runtime evidence package remained bound to the supplied verification request.",
          evidence_refs: ["record-generic-runtime-001"],
        },
      ],
      failed_checks: [],
      unresolved_findings: [],
      missing_evidence: [],
      scope_limitations: [
        "This completed sample remains a local deterministic fixture and does not assert operational authority.",
      ],
      human_review_recommendations: [],
      report_schema_version: "0.1",
      generated_at: "2026-07-15T01:00:07.000Z",
      verification_summary:
        "Generic runtime verification completed locally without unresolved findings.",
    },
    verification_usage_record: {
      usage_record_id: "usage-generic-runtime-001",
      verification_id: "verification-generic-runtime-001",
      verification_attempt_id: "attempt-generic-runtime-001",
      evidence_package_count: 1,
      evidence_record_count: 1,
      assurance_profile_count: 1,
      verification_check_count: 2,
      cryptographic_operation_count: 1,
      evidence_chain_depth: 1,
      report_count: 1,
      retention_tier_ref: "local-only",
      retention_class: {
        retention_class_id: "local-only",
        retention_class_version: "0.1",
      },
      human_review_requested: false,
      terminal_outcome: "completed",
      deterministic_result: {
        verification_job_result_id: "result-generic-runtime-001",
      },
      recorded_at: "2026-07-15T01:00:07.500Z",
      usage_schema_version: "0.1",
    },
  };
}

export function createCompletedWithFindingsVerificationJobEnvelopeInput() {
  return {
    verification_request: {
      request_id: "request-generic-ci-001",
      caller_reference: "demo-generic-ci-envelope",
      evidence_package: {
        package_id: "package-generic-ci-001",
        package_version: "0.1",
        digest: "sha256:generic-ci-package-digest",
        integrity_ref: "integrity://local/package-generic-ci-001",
      },
      adapter: {
        adapter_id: "adapter-generic-ci",
        adapter_version: "0.1.0",
      },
      requested_assurance_profiles: [
        {
          profile_id: "profile-generic-ci-001",
          profile_version: "0.1",
        },
      ],
      requested_at: "2026-07-15T02:00:00.000Z",
      human_review_context: {
        requested: true,
        requested_by: "fixture-reviewer",
        notes: [
          "The findings sample preserves recommendation-only review context.",
        ],
      },
      request_metadata: {
        fixture_case: "completed_with_findings",
      },
    },
    verification_job: {
      verification_id: "verification-generic-ci-001",
      contract_version: "0.1",
      engine_version: "guard-core-local-envelope-fixture-v0.1",
      status: "completed_with_findings",
      verification_status: "partially_verified",
      created_at: "2026-07-15T02:00:01.000Z",
      started_at: "2026-07-15T02:00:02.000Z",
      completed_at: "2026-07-15T02:00:06.000Z",
      limitations: [
        "This findings sample remains bounded to deterministic local review artifacts only.",
      ],
    },
    verification_attempt: {
      verification_attempt_id: "attempt-generic-ci-001",
      attempt_number: 1,
      status: "completed",
      created_at: "2026-07-15T02:00:02.000Z",
      started_at: "2026-07-15T02:00:03.000Z",
      completed_at: "2026-07-15T02:00:05.000Z",
    },
    verification_job_result: {
      verification_job_result_id: "result-generic-ci-001",
      job_status: "completed_with_findings",
      verification_status: "partially_verified",
      normalized_records: [
        {
          record: {
            record_id: "normalized-generic-ci-001",
            record_version: "0.1",
            generated_at: "2026-07-15T02:00:03.500Z",
          },
          adapter: {
            adapter_name: "Generic CI Adapter",
            adapter_version: "0.1.0",
            source_type: "ci_cd_evidence",
          },
          source: {
            source_system: "generic-ci-source",
            source_type: "ci_cd_evidence",
            issuer: "Generic CI Evidence Source",
            trust_status: "unknown",
          },
          receipt: {
            receipt_id: "receipt-generic-ci-001",
            receipt_version: "0.1",
            raw_receipt_ref: "local://generic/ci/receipt-001",
          },
          subject: {
            subject: "ci-artifact-001",
            subject_type: "build_artifact",
            action_summary: "Generic CI evidence review",
          },
          verification: {
            status: "partially_verified",
            integrity: {
              payload_hash: "sha256:generic-ci-payload-digest",
              hash_algorithm: "sha256",
              raw_payload_available: false,
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
            evidence_refs: ["record-generic-ci-001"],
            raw_payload_ref: "local://generic/ci/payload-001",
            external_report_uri: "local://generic/ci/report-001",
            completeness_status: "partial",
          },
          diagnostics: [],
          findings: [
            {
              finding_id: "finding-generic-ci-record-001",
              finding_type: "review_gap",
              category: "review",
              severity: "low",
              message:
                "Additional reviewer context may still be useful for the generic CI sample.",
              evidence_ref: "record-generic-ci-001",
              source_adapter: "adapter-generic-ci",
            },
          ],
        },
      ],
      findings: [
        {
          finding_id: "finding-generic-ci-001",
          finding_type: "missing_supporting_artifact",
          category: "evidence_completeness",
          severity: "medium",
          message:
            "One supporting CI artifact is intentionally absent from the local sample bundle.",
          evidence_ref: "record-generic-ci-001",
          recommendation:
            "Review the missing supporting CI artifact before treating this sample as complete.",
          verification_stage: "emit_findings",
          source_adapter: "adapter-generic-ci",
        },
      ],
      finalized_at: "2026-07-15T02:00:06.500Z",
      result_summary:
        "Generic CI verification completed locally with bounded unresolved findings.",
    },
    assurance_report: {
      report_id: "report-generic-ci-001",
      producer: {
        producer_id: "producer-generic-ci-001",
        producer_name: "Generic CI Evidence Source",
        source_type: "ci_cd_evidence",
        external_reference: "local://generic/ci/source-001",
      },
      executed_checks: [
        {
          check_type: "structural_validity",
          status: "verified",
          summary:
            "Generic CI evidence matched the declared structural contract.",
          evidence_refs: ["record-generic-ci-001"],
        },
        {
          check_type: "provenance_completeness",
          status: "partially_verified",
          summary:
            "Provenance coverage remained partial because one supporting CI artifact was absent.",
          evidence_refs: ["record-generic-ci-001"],
        },
      ],
      verified_claims: [
        {
          claim_id: "claim-generic-ci-001",
          claim_type: "request_binding",
          summary:
            "The generic CI evidence package remained bound to the supplied verification request.",
          evidence_refs: ["record-generic-ci-001"],
        },
      ],
      failed_checks: [
        {
          check_type: "evidence_chain_completeness",
          status: "partially_verified",
          summary:
            "Evidence-chain completeness remained partial because one supporting artifact was intentionally absent.",
          evidence_refs: ["record-generic-ci-001"],
        },
      ],
      unresolved_findings: [
        {
          finding_id: "finding-generic-ci-001",
          finding_type: "missing_supporting_artifact",
          category: "evidence_completeness",
          severity: "medium",
          message:
            "One supporting CI artifact is intentionally absent from the local sample bundle.",
          evidence_ref: "record-generic-ci-001",
          recommendation:
            "Review the missing supporting CI artifact before treating this sample as complete.",
          verification_stage: "emit_findings",
          source_adapter: "adapter-generic-ci",
        },
      ],
      missing_evidence: [
        {
          missing_evidence_id: "missing-generic-ci-001",
          description:
            "A supporting CI artifact was intentionally omitted from the local sample bundle.",
          evidence_refs: ["record-generic-ci-001"],
        },
      ],
      scope_limitations: [
        "This findings sample remains a local deterministic fixture and does not assert runtime authority.",
      ],
      human_review_recommendations: [
        {
          recommendation_id: "review-generic-ci-001",
          summary:
            "Review the missing supporting CI artifact before treating this sample as complete.",
          priority: "medium",
          evidence_refs: ["record-generic-ci-001"],
        },
      ],
      report_schema_version: "0.1",
      generated_at: "2026-07-15T02:00:07.000Z",
      verification_summary:
        "Generic CI verification completed locally with bounded unresolved findings.",
    },
    verification_usage_record: {
      usage_record_id: "usage-generic-ci-001",
      verification_id: "verification-generic-ci-001",
      verification_attempt_id: "attempt-generic-ci-001",
      evidence_package_count: 1,
      evidence_record_count: 1,
      assurance_profile_count: 1,
      verification_check_count: 2,
      cryptographic_operation_count: 1,
      evidence_chain_depth: 1,
      report_count: 1,
      retention_tier_ref: "local-only",
      retention_class: {
        retention_class_id: "local-only",
        retention_class_version: "0.1",
      },
      human_review_requested: true,
      terminal_outcome: "completed_with_findings",
      deterministic_result: {
        verification_job_result_id: "result-generic-ci-001",
      },
      recorded_at: "2026-07-15T02:00:07.500Z",
      usage_schema_version: "0.1",
    },
  };
}

export function createLocalVerificationJobEnvelopeSamples() {
  return {
    completed: buildLocalVerificationJobEnvelopeFixture(
      createCompletedVerificationJobEnvelopeInput()
    ),
    completed_with_findings: buildLocalVerificationJobEnvelopeFixture(
      createCompletedWithFindingsVerificationJobEnvelopeInput()
    ),
  };
}
