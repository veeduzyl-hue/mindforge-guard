import { MESR_CORE_MODULE } from "../../packages/guard-core/src/mesr/moduleManifest.ts";
import { MESR_SOFTWARE_DOMAIN_MODULE } from "../../packages/guard-core/src/mesr/softwareDomainSeed.ts";

const REQUIRED_CONFORMANCE = [
  "semantic_non_interference",
  "deterministic_resolution",
  "explicit_provenance",
  "no_execution_authority",
];

function crosswalk(moduleId, source, concepts) {
  return {
    module_id: moduleId,
    module_type: "crosswalk",
    version: "0.1.0",
    semantic_namespace: `mesr.xw.${source}`,
    core_compatibility: ">=0.1.0 <0.2.0",
    dependencies: [
      { module_id: "mesr.core", version: "0.1.0" },
      { module_id: "mesr.module.software.v0_1", version: "0.1.0" },
    ],
    added_semantics: [],
    mappings: concepts.map(([externalConcept, targetSemanticId]) => ({
      external_concept: externalConcept,
      target_semantic_id: targetSemanticId,
      mapping_relation: "maps_to",
      source_version: "test-only-v0.1",
      provenance: [`fixture:${moduleId}`],
      limitations: ["test-only vocabulary mapping; no normative or authority claim"],
    })),
    external_references: [`test-only://${source}/v0.1`],
    prohibited_overrides: ["mesr.core.*", "core.required_bindings", "core.support_relations", "core.does_not_support"],
    conformance_requirements: REQUIRED_CONFORMANCE,
  };
}

function profile() {
  return {
    module_id: "mesr.profile.test_audit.v0_1",
    module_type: "institutional_profile",
    version: "0.1.0",
    semantic_namespace: "mesr.profile.test_audit",
    core_compatibility: ">=0.1.0 <0.2.0",
    dependencies: [{ module_id: "mesr.core", version: "0.1.0" }],
    added_semantics: [],
    mappings: [],
    external_references: [],
    prohibited_overrides: ["mesr.core.*", "core.required_bindings", "core.support_relations", "core.does_not_support"],
    conformance_requirements: REQUIRED_CONFORMANCE,
    presentation: {
      audience: "test auditor",
      label: "Test-only assurance presentation",
      grouping: ["identity", "integrity", "review"],
    },
  };
}

function invalidOverride(moduleId, left, right) {
  return {
    ...crosswalk(moduleId, moduleId.replace(/[^a-z0-9_]/g, "_"), []),
    semantic_overrides: [{ left, right }],
  };
}

export function createMesrExperiment3Phase2AFixtures() {
  const identityVocabularies = ["identity_verified", "authenticated_principal", "KYA_passed"];
  const approvalVocabularies = ["approved", "signed_off", "accepted"];
  return {
    c1: {
      vocabularies: identityVocabularies,
      crosswalk: crosswalk("mesr.xw.test_identity.v0_1", "test_identity", identityVocabularies.map((value) => [value, "mesr.core.actor.identity_assertion"])),
    },
    c2: {
      vocabularies: approvalVocabularies,
      crosswalk: crosswalk("mesr.xw.test_approval.v0_1", "test_approval", approvalVocabularies.map((value) => [value, "mesr.core.review.review"])),
    },
    c3: {
      vocabularies: ["sha256_valid", "signature_verified"],
      crosswalk: crosswalk("mesr.xw.test_integrity.v0_1", "test_integrity", [
        ["sha256_valid", "mesr.core.evidence.verification"],
        ["signature_verified", "mesr.core.evidence.attestation"],
      ]),
    },
    c4: {
      vocabularies: ["test_framework_alpha_mapped", "test_framework_beta_mapped", "test_framework_gamma_control_present"],
      crosswalk: crosswalk("mesr.xw.test_framework.v0_1", "test_framework", [
        ["test_framework_alpha_mapped", "mesr.core.claim.scope"],
        ["test_framework_beta_mapped", "mesr.core.claim.scope"],
        ["test_framework_gamma_control_present", "mesr.core.evidence.item"],
      ]),
    },
    d1: {
      base_modules: [MESR_CORE_MODULE, MESR_SOFTWARE_DOMAIN_MODULE],
      additive_modules: [
        crosswalk("mesr.xw.test_nist_like.v0_1", "test_nist_like", [["test_control_mapped", "mesr.core.claim.scope"]]),
        profile(),
      ],
    },
    d2: {
      dynamic_crosswalk: crosswalk("mesr.xw.test_owasp_like.v0_1", "test_owasp_like", [["test_risk_mapped", "mesr.core.evidence.item"]]),
    },
    d3: {
      invalid_modules: [
        invalidOverride("mesr.xw.invalid_verified_approved", "verified", "approved"),
        invalidOverride("mesr.xw.invalid_identity_authority", "identity_verified", "authority_verified"),
        invalidOverride("mesr.xw.invalid_signature_truth", "signature_valid", "artifact_true"),
      ],
    },
  };
}
