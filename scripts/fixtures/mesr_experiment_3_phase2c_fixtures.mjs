const CORE_COMPATIBILITY = ">=0.1.0 <0.2.0";
const CORE_VERSION = "0.1.0";
const CONFORMANCE = [
  "semantic_non_interference",
  "deterministic_resolution",
  "explicit_provenance",
  "no_execution_authority",
];
const PROHIBITED_OVERRIDES = [
  "mesr.core.*",
  "core.required_bindings",
  "core.support_relations",
  "core.does_not_support",
];
const SOURCE = ["docs/validation/v8-phase-2c-e3-b-cross-domain-interpretation-v0.1.md"];

function syntheticEntry(namespace, suffix, definition, requiredBindings, explicitNonClaims) {
  const semanticId = `${namespace}.${suffix}`;
  return {
    semantic_id: semanticId,
    namespace,
    version: CORE_VERSION,
    definition,
    status: "active",
    supports: [`${semanticId}.observed`],
    does_not_support: [...explicitNonClaims],
    stronger_than: [],
    weaker_than: [],
    conflicts_with: [],
    required_bindings: [...requiredBindings],
    provenance: SOURCE,
    supersedes: [],
    deprecated_by: null,
  };
}

function syntheticModule(moduleId, namespace, entries) {
  return {
    module_id: moduleId,
    module_type: "domain_pack",
    version: CORE_VERSION,
    semantic_namespace: namespace,
    core_compatibility: CORE_COMPATIBILITY,
    dependencies: [{ module_id: "mesr.core", version: CORE_VERSION }],
    added_semantics: entries,
    mappings: [],
    external_references: [],
    prohibited_overrides: PROHIBITED_OVERRIDES,
    conformance_requirements: CONFORMANCE,
    presentation: {
      classification: "CONTROLLED SYNTHETIC DOMAIN EVIDENCE",
      product_support: false,
      public_surface: false,
    },
  };
}

const financeNamespace = "mesr.domain.synthetic_finance";
const healthcareNamespace = "mesr.domain.synthetic_healthcare";
const epistemicNamespace = "mesr.domain.synthetic_epistemic";

export const MESR_SYNTHETIC_FINANCE_TEST_MODULE = syntheticModule(
  "mesr.module.synthetic_finance.e3_b.v0_1",
  financeNamespace,
  [
    syntheticEntry(
      financeNamespace,
      "mandate.scope",
      "Synthetic account, instrument, amount, and time dimensions for testing Core authority scope.",
      ["account_ref", "instrument_ref", "amount_limit", "valid_until", "provenance"],
      ["trading_authorized", "financial_advice", "execution_authorized", "legal_compliance"],
    ),
    syntheticEntry(
      financeNamespace,
      "access.record",
      "Synthetic transaction API access observation used only to test Access does not imply Authority.",
      ["actor", "api_ref", "access_state", "observed_at", "provenance"],
      ["business_authority_verified", "applicable_authority", "execution_authorized"],
    ),
  ],
);

export const MESR_SYNTHETIC_HEALTHCARE_TEST_MODULE = syntheticModule(
  "mesr.module.synthetic_healthcare.e3_b.v0_1",
  healthcareNamespace,
  [
    syntheticEntry(
      healthcareNamespace,
      "review.subject",
      "Synthetic AI recommendation subject used only to test the Core review pattern.",
      ["recommendation_ref", "subject_hash", "scope", "time", "provenance"],
      ["medical_correctness", "treatment_recommended", "clinical_authority", "execution_authorized"],
    ),
    syntheticEntry(
      healthcareNamespace,
      "reviewer.requirement",
      "Synthetic domain requirement for separately binding applicable reviewer authority.",
      ["reviewer", "credential_or_role_ref", "subject_scope", "valid_time"],
      ["meaningful_oversight", "authorized_decision", "medical_validation"],
    ),
  ],
);

export const MESR_SYNTHETIC_EPISTEMIC_TEST_MODULE = syntheticModule(
  "mesr.module.synthetic_epistemic.e3_b.v0_1",
  epistemicNamespace,
  [
    syntheticEntry(
      epistemicNamespace,
      "assertion.subject",
      "Synthetic captured assertion subject used to test a Core evidence transition.",
      ["assertion_ref", "subject", "captured_at", "provenance"],
      ["verified_truth", "organizationally_warranted_reliance", "institutional_approval"],
    ),
    syntheticEntry(
      epistemicNamespace,
      "reliance.context",
      "Synthetic organizational reliance context specialized through Core reliance bindings.",
      ["relying_context", "claim_ref", "basis_valid_at", "provenance"],
      ["universal_truth", "timeless_validity", "institutional_approval"],
    ),
    syntheticEntry(
      epistemicNamespace,
      "artifact.knowledge_bundle",
      "Synthetic knowledge bundle identity used only for integrity-versus-truth testing.",
      ["bundle_ref", "digest", "assertion_refs", "provenance"],
      ["knowledge_truth", "warranted_reliance", "claim_correctness"],
    ),
  ],
);

const delegationCoreIds = [
  "mesr.core.actor.principal",
  "mesr.core.actor.actor",
  "mesr.core.authority.source",
  "mesr.core.authority.scope",
  "mesr.core.authority.delegation",
  "mesr.core.boundary.authority",
  "mesr.core.action.action",
  "mesr.core.evidence.item",
  "mesr.core.claim.claim",
  "mesr.core.claim.support_relation",
  "mesr.core.provenance.producer",
  "mesr.core.provenance.lineage",
  "mesr.core.temporal.basis",
];

const reviewCoreIds = [
  "mesr.core.actor.actor",
  "mesr.core.review.review",
  "mesr.core.evidence.item",
  "mesr.core.claim.claim",
  "mesr.core.claim.scope",
  "mesr.core.claim.support_relation",
  "mesr.core.provenance.producer",
  "mesr.core.provenance.lineage",
  "mesr.core.temporal.basis",
];

const transitionCoreIds = [
  "mesr.core.actor.actor",
  "mesr.core.authority.scope",
  "mesr.core.action.action",
  "mesr.core.boundary.effect",
  "mesr.core.boundary.reliance",
  "mesr.core.effect.effect",
  "mesr.core.effect.state_transition",
  "mesr.core.evidence.item",
  "mesr.core.evidence.observation",
  "mesr.core.evidence.verification",
  "mesr.core.claim.claim",
  "mesr.core.claim.scope",
  "mesr.core.claim.support_relation",
  "mesr.core.provenance.producer",
  "mesr.core.provenance.verifier",
  "mesr.core.provenance.lineage",
  "mesr.core.temporal.basis",
];

export function createMesrExperiment3Phase2CFixtures() {
  return {
    modules: {
      finance: MESR_SYNTHETIC_FINANCE_TEST_MODULE,
      healthcare: MESR_SYNTHETIC_HEALTHCARE_TEST_MODULE,
      epistemic: MESR_SYNTHETIC_EPISTEMIC_TEST_MODULE,
    },
    b1: {
      pattern: {
        semantic_ids: delegationCoreIds,
        required_binding_categories: ["principal", "actor", "action", "target", "scope", "time", "provenance", "constraints"],
        transition_boundary_pattern: ["delegation", "authority_boundary", "scope_attenuation"],
        provenance_roles: ["producer", "authority_source", "transformation"],
        independence_roles: ["access_separate_from_authority", "producer_separate_from_authority_verifier"],
      },
      software: {
        principal: "engineering-owner",
        actor: "coding-agent",
        action: "modify_code",
        target: "repository:example/repo",
        scope: { repository: "example/repo", paths: ["repo/src/**"] },
        valid_until: "2026-10-01T00:00:00Z",
        authority_source: "code-owner-record:01",
        provenance: "synthetic-software-delegation:e3-b1",
        access: { kind: "repository_write", present: true },
        parent_scope: { paths: ["repo/src/**"] },
        child_scope: { paths: ["repo/**"] },
        child_scope_relation: "broader_than_parent",
      },
      finance: {
        principal: "mandate-holder",
        actor: "execution-agent",
        action: "transact",
        target: "synthetic-account:account-01",
        scope: { account: "account-01", instrument: "instrument-X", amount_limit: 10000 },
        valid_until: "2026-10-01T00:00:00Z",
        authority_source: "synthetic-mandate-record:01",
        provenance: "synthetic-finance-delegation:e3-b1",
        access: { kind: "transaction_api", present: true },
        parent_scope: { amount_limit: 10000 },
        child_scope: { amount_limit: 100000 },
        child_scope_relation: "broader_than_parent",
      },
    },
    b2: {
      pattern: {
        semantic_ids: reviewCoreIds,
        required_binding_categories: ["reviewer", "subject", "scope", "time", "provenance", "authority"],
        transition_boundary_pattern: ["review_occurrence", "review_subject_binding", "review_authority_separation"],
        provenance_roles: ["producer", "reviewer", "artifact_source"],
        independence_roles: ["reviewer_presence_separate_from_authority", "review_separate_from_correctness"],
      },
      software: {
        reviewer: "code-reviewer-01",
        review_artifact: "review:software:01",
        subject: "candidate-commit:B",
        scope: ["src/payment.ts"],
        time: "2026-09-03T10:00:00Z",
        provenance: "synthetic-software-review:e3-b2",
        authority_requirement: { code_owner_ref: "codeowners:v1", repository_path: "src/payment.ts" },
      },
      healthcare: {
        reviewer: "synthetic-clinical-reviewer-01",
        review_artifact: "review:healthcare-synthetic:01",
        subject: "ai-recommendation:synthetic-01",
        scope: ["synthetic-workflow-review"],
        time: "2026-09-03T10:00:00Z",
        provenance: "synthetic-healthcare-review:e3-b2",
        authority_requirement: { credential_or_role_ref: "synthetic-role:reviewer", workflow_scope: "synthetic-workflow-review" },
      },
    },
    b3: {
      pattern: {
        semantic_ids: transitionCoreIds,
        required_binding_categories: ["from_state", "to_state", "boundary", "actor", "authority", "evidence", "provenance", "verification", "effect", "claim", "time"],
        transition_boundary_pattern: ["state_transition", "effect_boundary", "reliance_boundary", "claim_support"],
        provenance_roles: ["producer", "verifier", "transformation", "lineage"],
        independence_roles: ["producer_separate_from_verifier", "integrity_separate_from_truth", "reliance_separate_from_assertion"],
      },
      operational: {
        actor: "release-agent",
        from_state: "candidate-code",
        to_state: "release-state",
        boundary: "release-boundary",
        authority_binding: "release-scope-record:01",
        evidence: "release-artifact:01",
        verification: "release-observation:01",
        effect: "release-artifact-observed",
        claim: "operational-transition-occurred",
        time: "2026-09-04T10:00:00Z",
        digest: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        provenance: "synthetic-operational-transition:e3-b3",
      },
      epistemic: {
        actor: "assertion-curator",
        from_state: "captured-assertion",
        to_state: "organizationally-reusable-claim",
        boundary: "reliance-boundary",
        authority_binding: "reliance-context-record:01",
        evidence: "knowledge-bundle:01",
        verification: "bundle-integrity-check:01",
        effect: "claim-recorded-for-bounded-reuse",
        claim: "epistemic-transition-occurred",
        time: "2026-09-04T10:00:00Z",
        digest: "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        provenance: "synthetic-epistemic-transition:e3-b3",
      },
    },
  };
}
