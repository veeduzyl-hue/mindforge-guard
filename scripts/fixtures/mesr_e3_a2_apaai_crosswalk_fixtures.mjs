const CORE_VERSION = "0.1.0";
const CORE_COMPATIBILITY = ">=0.1.0 <0.2.0";
const SOURCE_COMMIT = "723defe1972a7e9df19eaff7db3d5d7101297137";
const SOURCE_VERSION = `openapi-0.1.0@${SOURCE_COMMIT}`;
const PINNED_ARTIFACT = `https://github.com/apaAI-Labs/apaai-protocol/blob/${SOURCE_COMMIT}/openapi.yaml`;
const MANIFEST_REF = "scripts/fixtures/apaai_protocol_source_manifest_v1.json";

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
  "audit.output",
  "audit.verdict",
  "audit.exit",
  "permit.behavior",
  "classify.behavior",
];

function mapping(externalConcept, targetSemanticId, limitation) {
  return {
    external_concept: externalConcept,
    target_semantic_id: targetSemanticId,
    mapping_relation: "maps_to",
    source_version: SOURCE_VERSION,
    provenance: [MANIFEST_REF, PINNED_ARTIFACT],
    limitations: [limitation, "Vocabulary mapping only; it creates no Guard authority or execution effect."],
  };
}

export const MESR_APAAI_CROSSWALK_TEST_MODULE = {
  module_id: "mesr.xw.apaai.openapi_0_1_0.e3_a2",
  module_type: "crosswalk",
  version: CORE_VERSION,
  semantic_namespace: "mesr.xw.apaai",
  core_compatibility: CORE_COMPATIBILITY,
  dependencies: [
    { module_id: "mesr.core", version: CORE_VERSION },
    { module_id: "mesr.module.software.v0_1", version: CORE_VERSION },
  ],
  added_semantics: [],
  mappings: [
    mapping("Actor", "mesr.core.actor.actor", "Actor records source attribution, not authority, principal equivalence, or verified identity."),
    mapping("Action", "mesr.core.action.action", "Action records a bounded reported act, not permission, approval, correctness, or a safe effect."),
    mapping("Action.actor", "mesr.core.actor.actor", "The nested actor is source attribution only."),
    mapping("Action.target", "mesr.core.action.action", "Target supplies an action binding and does not widen authority scope."),
    mapping("Action.timestamp", "mesr.core.temporal.basis", "A source timestamp is temporal provenance, not current standing or timeless validity."),
    mapping("Policy", "mesr.core.evidence.item", "A Policy is treated as an addressable external record, not Guard policy authority."),
    mapping("Policy.rules", "mesr.core.claim.scope", "Rules bound the source record's applicability only; they do not establish legal compliance."),
    mapping("Policy.rules[].when", "mesr.core.claim.scope", "A source match condition is claim scope, not an authoritative legal determination."),
    mapping("Policy.rules[].mode", "mesr.core.evidence.observation", "observe/enforce is recorded source vocabulary and does not activate Guard enforcement."),
    mapping("Policy.rules[].require", "mesr.core.claim.scope", "Requirements are external rule content, not proof that approval or checks occurred."),
    mapping("Decision", "mesr.core.evidence.item", "Decision is an external response record, not a Guard review disposition."),
    mapping("Decision.status", "mesr.core.evidence.observation", "allowed/requires_approval/recorded remain APAAI status observations only."),
    mapping("Decision.checks", "mesr.core.evidence.item", "Check names record source content, not check success or sufficiency."),
    mapping("Evidence", "mesr.core.evidence.item", "Evidence establishes record presence and bounded content only."),
    mapping("Evidence.actionId", "mesr.core.claim.scope", "actionId binds the source record to an action and does not establish authority."),
    mapping("Evidence.checks", "mesr.core.evidence.observation", "Checks are producer observations unless separately verified."),
    mapping("Evidence.checks[].pass", "mesr.core.evidence.observation", "pass is a source result and not independent verification, correctness, safety, or compliance."),
    mapping("Evidence.checks[].approver", "mesr.core.evidence.attestation", "An approver string is attributable record content, not applicable approval."),
    mapping("Evidence.timestamp", "mesr.core.temporal.basis", "A source timestamp alone does not establish current applicability."),
    mapping("Evidence.signed", "mesr.core.evidence.attestation", "signed indicates a source assertion; signature validity, claim correctness, and authority remain separate."),
    mapping("Evidence.hash", "mesr.core.evidence.item", "hash records source content; integrity verification and truth are separate claims."),
    mapping("POST /evidence response.verified", "mesr.core.evidence.observation", "verified means source checks passed and is not independent verification."),
  ],
  external_references: [
    "https://www.apaaiprotocol.org/",
    PINNED_ARTIFACT,
    MANIFEST_REF,
  ],
  prohibited_overrides: PROHIBITED_OVERRIDES,
  conformance_requirements: CONFORMANCE,
  presentation: {
    classification: "CONTROLLED SOURCE-PINNED CROSSWALK EVIDENCE",
    product_support: false,
    public_surface: false,
    runtime_network: false,
    recommendation_only: true,
    non_executing: true,
    default_off: true,
  },
};

const apaaiFixture = {
  action: {
    id: "act-e3-a2-001",
    type: "code.change.review",
    actor: { kind: "agent", name: "controlled-coding-agent", provider: "fixture-producer" },
    target: "repository:fixture/repo@candidate-a",
    params: { subject_ref: "commit:candidate-a" },
    timestamp: "2026-09-07T08:00:00Z",
  },
  policy: {
    rules: [{
      id: "rule-review-001",
      when: { actionType: "code.change.review", actorKind: "agent" },
      mode: "enforce",
      require: ["reviewer_approval"],
      note: "Controlled fixture rule; not Guard authority.",
    }],
  },
  decision: {
    actionId: "act-e3-a2-001",
    status: "allowed",
    checks: ["reviewer_approval"],
  },
  evidence: {
    actionId: "act-e3-a2-001",
    checks: [{
      name: "reviewer_approval",
      pass: true,
      approver: "fixture-reviewer",
      note: "Approver record lacks independently established scope and authority.",
    }],
    timestamp: "2026-09-07T08:01:00Z",
    signed: true,
    hash: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  },
  evidence_response: { verified: true },
};

const nativeFixture = {
  event_ref: "native-event-e3-a2-001",
  event_kind: "code.change.review",
  performed_by: { category: "agent", identifier: "controlled-coding-agent", origin: "fixture-producer" },
  affected_subject: "repository:fixture/repo@candidate-a",
  subject_ref: "commit:candidate-a",
  observed_at: "2026-09-07T08:00:00Z",
  rule_record: {
    record_ref: "rule-review-001",
    applies_to: { event_kind: "code.change.review", actor_category: "agent" },
    source_mode_label: "enforce",
    expected_records: ["reviewer_approval"],
  },
  external_result_record: {
    event_ref: "native-event-e3-a2-001",
    source_status_label: "allowed",
    named_checks: ["reviewer_approval"],
  },
  evidence_record: {
    event_ref: "native-event-e3-a2-001",
    observations: [{ label: "reviewer_approval", result: true, attributed_reviewer: "fixture-reviewer" }],
    produced_at: "2026-09-07T08:01:00Z",
    source_signed_flag: true,
    source_digest: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    producer_verified_flag: true,
  },
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function createMesrE3A2ApaaiFixtures() {
  return {
    apaai: clone(apaaiFixture),
    native: clone(nativeFixture),
    ambiguity_negatives: {
      prose_status_approved: { ...clone(apaaiFixture), decision: { ...clone(apaaiFixture.decision), status: "approved" } },
      prose_status_rejected: { ...clone(apaaiFixture), decision: { ...clone(apaaiFixture.decision), status: "rejected" } },
      incompatible_policy_example: {
        ...clone(apaaiFixture),
        policy: { actionType: "code.change.review", requiresApproval: true, checks: ["reviewer_approval"], evidence: true },
      },
      evidence_check_metadata: {
        ...clone(apaaiFixture),
        evidence: {
          ...clone(apaaiFixture.evidence),
          checks: [{ ...clone(apaaiFixture.evidence.checks[0]), metadata: { source: "example-only" } }],
        },
      },
      evidence_check_error: {
        ...clone(apaaiFixture),
        evidence: {
          ...clone(apaaiFixture.evidence),
          checks: [{ ...clone(apaaiFixture.evidence.checks[0]), error: "example-only" }],
        },
      },
    },
  };
}

export const APAAI_SOURCE_VERSION = SOURCE_VERSION;
