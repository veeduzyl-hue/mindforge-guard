import { buildLocalAdapterManifestSelectionFixture } from "../../packages/guard-core/src/externalEvidence/localAdapterManifestSelectionFixture.mjs";

export function createLocalAdapterManifestSelectionFixtureInput() {
  const selectedManifest = createManifest({
    adapterId: "adapter-generic-evidence",
    adapterName: "generic-evidence-mapper",
    adapterVersion: "1.2.0",
    sourceType: "external_verifier_output",
    sourceSchemas: ["external-evidence/1.0"],
    profiles: [
      { profile_id: "profile-structure", profile_version: "1.0" },
      { profile_id: "profile-integrity", profile_version: "2.0" },
    ],
    lifecycleStatus: "review_stage",
  });

  return {
    verification_request: {
      request_id: "request-adapter-selection-001",
      evidence_package: {
        package_id: "package-adapter-selection-001",
        package_version: "0.1",
        digest: "sha256:selection-evidence",
        integrity_ref: "integrity:selection-evidence",
      },
      adapter: {
        adapter_id: selectedManifest.adapter_id,
        adapter_version: selectedManifest.identity.adapter_version,
      },
      requested_assurance_profiles: [
        { profile_id: "profile-structure", profile_version: "1.0" },
        { profile_id: "profile-integrity", profile_version: "2.0" },
      ],
      requested_at: "2026-07-16T00:00:00.000Z",
    },
    evidence_package: {
      package_id: "package-adapter-selection-001",
      package_version: "0.1",
      producer: {
        producer_id: "producer-generic-verifier",
        producer_name: "Generic External Verifier",
        source_type: "external_verifier_output",
      },
      evidence_records: [],
      received_at: "2026-07-16T00:00:01.000Z",
      integrity: {
        digest: "sha256:selection-evidence",
        digest_algorithm: "sha256",
        integrity_ref: "integrity:selection-evidence",
      },
      source_schema_version: "external-evidence/1.0",
    },
    adapter_manifests: [
      selectedManifest,
      createManifest({
        adapterId: "adapter-generic-evidence",
        adapterName: "generic-evidence-mapper",
        adapterVersion: "1.1.0",
        sourceType: "external_verifier_output",
      }),
      createManifest({
        adapterId: "adapter-alternate-evidence",
        adapterName: "alternate-evidence-mapper",
        adapterVersion: "1.2.0",
        sourceType: "external_verifier_output",
      }),
      createManifest({
        adapterId: "adapter-source-decoy",
        adapterName: "source-decoy-mapper",
        adapterVersion: "3.0.0",
        sourceType: "ci_cd_evidence",
      }),
      createManifest({
        adapterId: "adapter-schema-decoy",
        adapterName: "schema-decoy-mapper",
        adapterVersion: "4.0.0",
        sourceType: "external_verifier_output",
        sourceSchemas: ["external-evidence/9.0"],
      }),
      createManifest({
        adapterId: "adapter-profile-decoy",
        adapterName: "profile-decoy-mapper",
        adapterVersion: "5.0.0",
        sourceType: "external_verifier_output",
        profiles: [{ profile_id: "profile-other", profile_version: "1.0" }],
      }),
    ],
    required_mapping_capabilities: [
      "normalized_evidence_record",
      "verification_findings",
    ],
  };
}

export function createLocalAdapterManifestSelectionFixtureSamples() {
  return buildLocalAdapterManifestSelectionFixture(
    createLocalAdapterManifestSelectionFixtureInput()
  );
}

function createManifest({
  adapterId,
  adapterName,
  adapterVersion,
  sourceType,
  sourceSchemas = ["external-evidence/1.0"],
  profiles = [
    { profile_id: "profile-structure", profile_version: "1.0" },
    { profile_id: "profile-integrity", profile_version: "2.0" },
  ],
  lifecycleStatus = "draft",
}) {
  return {
    adapter_id: adapterId,
    identity: {
      adapter_name: adapterName,
      adapter_version: adapterVersion,
      source_type: sourceType,
    },
    lifecycle_status: lifecycleStatus,
    supported_source_schema_versions: sourceSchemas,
    supported_assurance_profiles: profiles,
    declared_mapping_capability: {
      external_receipt_contract: false,
      normalized_evidence_record: true,
      verification_findings: true,
      report_language: true,
    },
    declared_limitations: {
      raw_payload_available: true,
      issuer_key_available: false,
      unsupported_algorithm: false,
      unsupported_receipt_version: false,
      redacted_evidence: false,
      confidential_evidence: false,
      limitations: ["Local compatibility proof only."],
    },
  };
}
