import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { MESR_CLAIM_BOUNDARIES } from "../packages/guard-core/src/mesr/claimBoundaries.ts";
import {
  createCanonicalCoreRegistrySnapshot,
  serializeCanonicalCoreRegistrySnapshot,
} from "../packages/guard-core/src/mesr/corePatternSignature.ts";
import { MESR_CORE_REGISTRY } from "../packages/guard-core/src/mesr/coreRegistry.ts";
import {
  composeMesrModules,
  MESR_CORE_MODULE,
  validateMesrModuleManifest,
} from "../packages/guard-core/src/mesr/moduleManifest.ts";
import {
  createCanonicalSemanticSnapshot,
  serializeCanonicalSemanticSnapshot,
} from "../packages/guard-core/src/mesr/semanticSnapshot.ts";
import { MESR_SOFTWARE_DOMAIN_MODULE } from "../packages/guard-core/src/mesr/softwareDomainSeed.ts";
import { evaluateMesrClaimSupport } from "../packages/guard-core/src/mesr/supportEvaluator.ts";
import {
  APAAI_SOURCE_VERSION,
  createMesrE3A2ApaaiFixtures,
  MESR_APAAI_CROSSWALK_TEST_MODULE,
} from "./fixtures/mesr_e3_a2_apaai_crosswalk_fixtures.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const sourceManifestPath = path.join(repoRoot, "scripts", "fixtures", "apaai_protocol_source_manifest_v1.json");
const sourceManifest = JSON.parse(fs.readFileSync(sourceManifestPath, "utf8"));

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => [key, canonicalize(item)]));
  }
  return value;
}

function canonical(value) {
  return JSON.stringify(canonicalize(value));
}

function assertExactKeys(value, allowed, label) {
  assert.equal(value !== null && typeof value === "object" && !Array.isArray(value), true, `${label}: object required`);
  const unknown = Object.keys(value).filter((key) => !allowed.includes(key)).sort();
  assert.deepEqual(unknown, [], `${label}: additional properties forbidden`);
}

function assertRequired(value, required, label) {
  for (const key of required) assert.equal(Object.hasOwn(value, key), true, `${label}.${key}: required`);
}

function assertString(value, label) {
  assert.equal(typeof value, "string", `${label}: string required`);
  assert.ok(value.length > 0, `${label}: non-empty string required`);
}

function validatePinnedApaaiFixture(fixture) {
  assertExactKeys(fixture, ["action", "policy", "decision", "evidence", "evidence_response"], "fixture");

  assertExactKeys(fixture.action, ["id", "type", "actor", "target", "params", "timestamp"], "Action");
  assertRequired(fixture.action, ["id", "type", "actor", "timestamp"], "Action");
  assertString(fixture.action.id, "Action.id");
  assertString(fixture.action.type, "Action.type");
  assertString(fixture.action.timestamp, "Action.timestamp");
  if (fixture.action.target !== undefined) assertString(fixture.action.target, "Action.target");
  if (fixture.action.params !== undefined) assert.equal(typeof fixture.action.params, "object", "Action.params: object required");
  assertExactKeys(fixture.action.actor, ["kind", "name", "provider"], "Actor");
  assertRequired(fixture.action.actor, ["kind", "name"], "Actor");
  assert.ok(["human", "agent", "system"].includes(fixture.action.actor.kind), "Actor.kind: machine allowed-value set required");
  assertString(fixture.action.actor.name, "Actor.name");
  if (fixture.action.actor.provider !== undefined) assertString(fixture.action.actor.provider, "Actor.provider");

  assertExactKeys(fixture.policy, ["rules"], "Policy");
  assertRequired(fixture.policy, ["rules"], "Policy");
  assert.equal(Array.isArray(fixture.policy.rules), true, "Policy.rules: array required");
  for (const [index, rule] of fixture.policy.rules.entries()) {
    const label = `Policy.rules[${index}]`;
    assertExactKeys(rule, ["id", "when", "mode", "require", "note"], label);
    assertRequired(rule, ["when", "mode"], label);
    assertExactKeys(rule.when, ["actionType", "actorKind", "actorName", "provider"], `${label}.when`);
    assert.ok(["observe", "enforce"].includes(rule.mode), `${label}.mode: machine allowed-value set required`);
    if (rule.require !== undefined) {
      assert.equal(Array.isArray(rule.require), true, `${label}.require: array required`);
      rule.require.forEach((item, itemIndex) => assertString(item, `${label}.require[${itemIndex}]`));
    }
  }

  assertExactKeys(fixture.decision, ["actionId", "status", "checks"], "Decision");
  assertRequired(fixture.decision, ["actionId", "status"], "Decision");
  assertString(fixture.decision.actionId, "Decision.actionId");
  assert.ok(["allowed", "requires_approval", "recorded"].includes(fixture.decision.status), "Decision.status: machine allowed-value set required");
  if (fixture.decision.checks !== undefined) {
    assert.equal(Array.isArray(fixture.decision.checks), true, "Decision.checks: array required");
    fixture.decision.checks.forEach((item, index) => assertString(item, `Decision.checks[${index}]`));
  }

  assertExactKeys(fixture.evidence, ["actionId", "checks", "timestamp", "signed", "hash"], "Evidence");
  assertRequired(fixture.evidence, ["actionId", "checks"], "Evidence");
  assertString(fixture.evidence.actionId, "Evidence.actionId");
  assert.equal(Array.isArray(fixture.evidence.checks), true, "Evidence.checks: array required");
  for (const [index, check] of fixture.evidence.checks.entries()) {
    const label = `Evidence.checks[${index}]`;
    assertExactKeys(check, ["name", "pass", "approver", "note"], label);
    assertRequired(check, ["name", "pass"], label);
    assertString(check.name, `${label}.name`);
    assert.equal(typeof check.pass, "boolean", `${label}.pass: boolean required`);
    if (check.approver !== undefined) assertString(check.approver, `${label}.approver`);
  }
  if (fixture.evidence.timestamp !== undefined) assertString(fixture.evidence.timestamp, "Evidence.timestamp");
  if (fixture.evidence.signed !== undefined) assert.equal(typeof fixture.evidence.signed, "boolean", "Evidence.signed: boolean required");
  if (fixture.evidence.hash !== undefined) assertString(fixture.evidence.hash, "Evidence.hash");

  assertExactKeys(fixture.evidence_response, ["verified"], "POST /evidence response");
  assert.equal(typeof fixture.evidence_response.verified, "boolean", "POST /evidence response.verified: boolean required");
  assert.equal(canonical(fixture).includes("policy_evaluated"), false, "non-source policy_evaluated field forbidden");
  return true;
}

function rejectionMessage(fixture) {
  try {
    validatePinnedApaaiFixture(fixture);
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}

function evaluate(request, semanticEntries) {
  return evaluateMesrClaimSupport({
    claim_id: request.claimId,
    semantic_ids: request.semanticIds,
    provided_bindings: request.providedBindings ?? {},
    required_bindings: request.requiredBindings ?? [],
    observed_state_ids: request.observedStateIds ?? [],
    evidence_refs: request.evidenceRefs ?? [],
  }, semanticEntries);
}

function buildRelations(facts, semanticEntries) {
  const actionBindings = {
    actor: facts.actor,
    target: facts.target,
    action_type: facts.actionType,
    time: facts.actionTime,
    provenance: facts.provenance,
  };
  const evidenceBindings = {
    evidence_id_or_ref: facts.evidenceRef,
    producer_or_source: facts.producer,
    subject: facts.target,
    provenance: facts.provenance,
  };
  return [
    ["action_occurrence", evaluate({ claimId: "action_state_within_captured_bounds", semanticIds: ["mesr.core.action.action"], providedBindings: actionBindings, requiredBindings: Object.keys(actionBindings) }, semanticEntries)],
    ["policy_record_presence", evaluate({ claimId: "evidence_presence", semanticIds: ["mesr.core.evidence.item"], providedBindings: evidenceBindings, requiredBindings: Object.keys(evidenceBindings) }, semanticEntries)],
    ["external_decision_record_presence", evaluate({ claimId: "bounded_content", semanticIds: ["mesr.core.evidence.item"], providedBindings: evidenceBindings, requiredBindings: Object.keys(evidenceBindings) }, semanticEntries)],
    ["evidence_record_presence", evaluate({ claimId: "evidence_presence", semanticIds: ["mesr.core.evidence.item"], providedBindings: evidenceBindings, requiredBindings: Object.keys(evidenceBindings) }, semanticEntries)],
    ["action_not_authority", evaluate({ claimId: "authority_verified", semanticIds: ["mesr.core.action.action"], observedStateIds: ["evidence_present"] }, semanticEntries)],
    ["action_not_execution_authority", evaluate({ claimId: "execution_authorized", semanticIds: ["mesr.core.action.action"] }, semanticEntries)],
    ["action_not_approval", evaluate({ claimId: "action_approved", semanticIds: ["mesr.core.action.action"] }, semanticEntries)],
    ["policy_enforce_not_guard_authority", evaluate({ claimId: "authority_verified", semanticIds: ["mesr.core.evidence.observation"] }, semanticEntries)],
    ["policy_enforce_not_guard_approval", evaluate({ claimId: "approval", semanticIds: ["mesr.core.evidence.observation"] }, semanticEntries)],
    ["policy_enforce_not_execution", evaluate({ claimId: "execution_authorized", semanticIds: ["mesr.core.evidence.observation"] }, semanticEntries)],
    ["policy_match_not_legal_compliance", evaluate({ claimId: "legally_compliant", semanticIds: ["mesr.core.claim.scope"], observedStateIds: ["policy_match_recorded"] }, semanticEntries)],
    ["external_decision_not_guard_disposition", evaluate({ claimId: "governance_disposition", semanticIds: ["mesr.core.evidence.item"] }, semanticEntries)],
    ["evidence_pass_not_independent_verification", evaluate({ claimId: "independent_verification", semanticIds: ["mesr.core.evidence.observation", "mesr.core.provenance.producer"], observedStateIds: ["producer_claim_present"] }, semanticEntries)],
    ["evidence_pass_not_correctness", evaluate({ claimId: "claim_correctness", semanticIds: ["mesr.core.evidence.observation"] }, semanticEntries)],
    ["evidence_pass_not_safe", evaluate({ claimId: "safe_effect", semanticIds: ["mesr.core.evidence.observation"] }, semanticEntries)],
    ["evidence_pass_not_compliance", evaluate({ claimId: "legally_compliant", semanticIds: ["mesr.core.evidence.observation"] }, semanticEntries)],
    ["hash_presence_not_truth", evaluate({ claimId: "artifact_truth", semanticIds: ["mesr.core.evidence.item"] }, semanticEntries)],
    ["hash_presence_not_authority", evaluate({ claimId: "authority", semanticIds: ["mesr.core.evidence.item"] }, semanticEntries)],
    ["signing_not_truth", evaluate({ claimId: "artifact_truth", semanticIds: ["mesr.core.evidence.attestation"] }, semanticEntries)],
    ["signing_not_correctness", evaluate({ claimId: "claim_correctness", semanticIds: ["mesr.core.evidence.attestation"] }, semanticEntries)],
    ["signing_not_authority", evaluate({ claimId: "authority", semanticIds: ["mesr.core.evidence.attestation"] }, semanticEntries)],
    ["approver_record_not_applicable_review", evaluate({ claimId: "applicable_review_exists", semanticIds: ["mesr.core.evidence.attestation"], observedStateIds: ["approval_record_exists"] }, semanticEntries)],
    ["protocol_conformance_not_compliance", evaluate({ claimId: "legally_compliant", semanticIds: ["mesr.core.claim.scope"], observedStateIds: ["policy_match_recorded"] }, semanticEntries)],
    ["protocol_mapping_not_certification", evaluate({ claimId: "certified", semanticIds: ["mesr.core.claim.support_relation"], observedStateIds: ["framework_mapping_present"] }, semanticEntries)],
  ].map(([role, result]) => ({ role, result }));
}

function factsFromApaai(fixture) {
  return {
    actor: fixture.action.actor.name,
    producer: fixture.action.actor.provider,
    target: fixture.action.target,
    actionType: fixture.action.type,
    actionTime: fixture.action.timestamp,
    evidenceTime: fixture.evidence.timestamp,
    evidenceRef: "controlled-evidence:e3-a2",
    checkName: fixture.evidence.checks[0].name,
    checkPass: fixture.evidence.checks[0].pass,
    approver: fixture.evidence.checks[0].approver,
    signed: fixture.evidence.signed,
    digest: fixture.evidence.hash,
    sourceStatus: fixture.decision.status,
    sourceMode: fixture.policy.rules[0].mode,
    producerVerified: fixture.evidence_response.verified,
    provenance: `apaai:${APAAI_SOURCE_VERSION}`,
  };
}

function factsFromNative(fixture) {
  return {
    actor: fixture.performed_by.identifier,
    producer: fixture.performed_by.origin,
    target: fixture.affected_subject,
    actionType: fixture.event_kind,
    actionTime: fixture.observed_at,
    evidenceTime: fixture.evidence_record.produced_at,
    evidenceRef: "controlled-evidence:e3-a2",
    checkName: fixture.evidence_record.observations[0].label,
    checkPass: fixture.evidence_record.observations[0].result,
    approver: fixture.evidence_record.observations[0].attributed_reviewer,
    signed: fixture.evidence_record.source_signed_flag,
    digest: fixture.evidence_record.source_digest,
    sourceStatus: fixture.external_result_record.source_status_label,
    sourceMode: fixture.rule_record.source_mode_label,
    producerVerified: fixture.evidence_record.producer_verified_flag,
    provenance: "guard-native:controlled-fixture-v0.1",
  };
}

function createProjection(facts, relations, sourceKind) {
  return {
    semantic_ids: [...new Set(relations.flatMap(({ result }) => result.semantic_ids))],
    claim_support_relations: relations.map(({ result }) => result),
    claim_boundaries_applied: [...new Set(relations.flatMap(({ result }) => result.claim_boundaries_applied))],
    explicit_non_claims: [...new Set(relations.flatMap(({ result }) => result.explicit_non_claims))],
    semantic_provenance: [facts.provenance],
    subject_effect_bindings: [
      { semantic_id: "mesr.core.action.action", binding: "actor", value: facts.actor },
      { semantic_id: "mesr.core.action.action", binding: "target", value: facts.target },
      { semantic_id: "mesr.core.action.action", binding: "action_type", value: facts.actionType },
      { semantic_id: "mesr.core.evidence.observation", binding: "check_name", value: facts.checkName },
      { semantic_id: "mesr.core.evidence.observation", binding: "check_pass", value: facts.checkPass },
      { semantic_id: "mesr.core.evidence.attestation", binding: "approver_record", value: facts.approver },
      { semantic_id: "mesr.core.evidence.attestation", binding: "source_signed_flag", value: facts.signed },
      { semantic_id: "mesr.core.evidence.item", binding: "source_digest", value: facts.digest },
      { semantic_id: "mesr.core.evidence.observation", binding: "source_status", value: facts.sourceStatus },
      { semantic_id: "mesr.core.evidence.observation", binding: "source_mode", value: facts.sourceMode },
      { semantic_id: "mesr.core.evidence.observation", binding: "producer_verified_flag", value: facts.producerVerified },
    ],
    external_references: sourceKind === "apaai"
      ? [sourceManifest.artifact_url, "scripts/fixtures/apaai_protocol_source_manifest_v1.json"]
      : ["scripts/fixtures/mesr_e3_a2_apaai_crosswalk_fixtures.mjs#nativeFixture"],
  };
}

function canonicalBoundarySnapshot(boundaries) {
  return boundaries.map((entry) => canonicalize(entry)).sort((left, right) => left.boundary_id.localeCompare(right.boundary_id));
}

function collectFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(entryPath) : [entryPath];
  });
}

// Source identity and exact machine-artifact pin.
assert.equal(sourceManifest.source_id, "apaai.protocol.openapi.commit-723defe");
assert.equal(sourceManifest.official_url, "https://www.apaaiprotocol.org/");
assert.equal(sourceManifest.repository, "https://github.com/apaAI-Labs/apaai-protocol");
assert.equal(sourceManifest.commit, "723defe1972a7e9df19eaff7db3d5d7101297137");
assert.equal(sourceManifest.artifact, "openapi.yaml");
assert.equal(sourceManifest.declared_protocol_identity, "APAAI Protocol v1.0 (RFC-2025-001)");
assert.equal(sourceManifest.machine_artifact.openapi, "3.0.3");
assert.equal(sourceManifest.machine_artifact.version, "0.1.0");
assert.equal(sourceManifest.machine_artifact.sha256, "7af928ebf4c421a28d289585471d2407d728d1cc6d18bc1df128827ca9571bc1");
assert.equal(sourceManifest.machine_artifact.byte_length, 15981);
assert.equal(sourceManifest.machine_artifact.line_count, 479);
assert.notEqual(sourceManifest.declared_protocol_identity, sourceManifest.machine_artifact.version);
assert.equal(sourceManifest.license_reference.identifier, "Apache-2.0");
assert.equal(sourceManifest.source_ambiguities.length, 7);
assert.deepEqual(sourceManifest.source_ambiguities.map((entry) => entry.ambiguity_id), [
  "APAAI-SA-01", "APAAI-SA-02", "APAAI-SA-03", "APAAI-SA-04", "APAAI-SA-05", "APAAI-SA-06", "APAAI-SA-07",
]);
assert.ok(sourceManifest.source_ambiguities.every((entry) => entry.deterministic_treatment.length > 0));

// Crosswalk validity and source-grounding.
const groundedConcepts = new Set([
  "Actor", "Action", "Action.actor", "Action.target", "Action.timestamp", "Policy", "Policy.rules",
  "Policy.rules[].when", "Policy.rules[].mode", "Policy.rules[].require", "Decision", "Decision.status",
  "Decision.checks", "Evidence", "Evidence.actionId", "Evidence.checks", "Evidence.checks[].pass",
  "Evidence.checks[].approver", "Evidence.timestamp", "Evidence.signed", "Evidence.hash", "POST /evidence response.verified",
]);
assert.equal(MESR_APAAI_CROSSWALK_TEST_MODULE.semantic_namespace, "mesr.xw.apaai");
assert.equal(MESR_APAAI_CROSSWALK_TEST_MODULE.added_semantics.length, 0);
assert.equal(MESR_APAAI_CROSSWALK_TEST_MODULE.presentation.public_surface, false);
assert.equal(MESR_APAAI_CROSSWALK_TEST_MODULE.presentation.runtime_network, false);
assert.ok(MESR_APAAI_CROSSWALK_TEST_MODULE.mappings.every((entry) => groundedConcepts.has(entry.external_concept)));
assert.ok(MESR_APAAI_CROSSWALK_TEST_MODULE.mappings.every((entry) => entry.source_version === APAAI_SOURCE_VERSION));
assert.ok(MESR_APAAI_CROSSWALK_TEST_MODULE.mappings.every((entry) => entry.target_semantic_id.startsWith("mesr.core.")));
assert.equal(canonical(MESR_APAAI_CROSSWALK_TEST_MODULE).includes("policy_evaluated"), false);
assert.deepEqual(validateMesrModuleManifest(MESR_APAAI_CROSSWALK_TEST_MODULE).issues, []);

const coreBeforeSnapshot = createCanonicalCoreRegistrySnapshot(MESR_CORE_REGISTRY);
const coreBeforeHash = sha256(serializeCanonicalCoreRegistrySnapshot(coreBeforeSnapshot));
const boundaryBeforeSnapshot = canonicalBoundarySnapshot(MESR_CLAIM_BOUNDARIES);
const boundaryBeforeHash = sha256(canonical(boundaryBeforeSnapshot));
const composition = composeMesrModules([MESR_CORE_MODULE, MESR_SOFTWARE_DOMAIN_MODULE, MESR_APAAI_CROSSWALK_TEST_MODULE]);
assert.equal(composition.status, "VALID_COMPOSITION");
assert.deepEqual(composition.issues, []);
assert.equal(composition.mappings.length, MESR_APAAI_CROSSWALK_TEST_MODULE.mappings.length);

const coreAfterEntries = composition.semantic_entries.filter((entry) => entry.namespace === "mesr.core");
const coreAfterSnapshot = createCanonicalCoreRegistrySnapshot(coreAfterEntries);
const coreAfterHash = sha256(serializeCanonicalCoreRegistrySnapshot(coreAfterSnapshot));
const boundaryAfterSnapshot = canonicalBoundarySnapshot(MESR_CLAIM_BOUNDARIES);
const boundaryAfterHash = sha256(canonical(boundaryAfterSnapshot));
assert.equal(coreBeforeSnapshot.length, 30);
assert.equal(coreAfterSnapshot.length, 30);
assert.equal(coreAfterHash, coreBeforeHash);
assert.deepEqual(coreAfterSnapshot, coreBeforeSnapshot);
assert.equal(boundaryAfterHash, boundaryBeforeHash);
assert.deepEqual(boundaryAfterSnapshot, boundaryBeforeSnapshot);

// Pinned-schema fixture and deterministic ambiguity handling.
const fixtures = createMesrE3A2ApaaiFixtures();
assert.equal(validatePinnedApaaiFixture(fixtures.apaai), true);
const ambiguityRejections = Object.fromEntries(Object.entries(fixtures.ambiguity_negatives)
  .map(([name, fixture]) => [name, rejectionMessage(fixture)]));
assert.ok(Object.values(ambiguityRejections).every((message) => typeof message === "string" && message.length > 0));
assert.match(ambiguityRejections.prose_status_approved, /machine allowed-value set required/);
assert.match(ambiguityRejections.prose_status_rejected, /machine allowed-value set required/);
assert.match(ambiguityRejections.incompatible_policy_example, /additional properties forbidden/);
assert.match(ambiguityRejections.evidence_check_metadata, /additional properties forbidden/);
assert.match(ambiguityRejections.evidence_check_error, /additional properties forbidden/);

// Native and APAAI raw forms remain different while their controlled semantic result is equal.
assert.notDeepEqual(fixtures.apaai, fixtures.native);
const apaaiFacts = factsFromApaai(fixtures.apaai);
const nativeFacts = factsFromNative(fixtures.native);
const apaaiRelations = buildRelations(apaaiFacts, composition.semantic_entries);
const nativeRelations = buildRelations(nativeFacts, composition.semantic_entries);
const apaaiProjection = createProjection(apaaiFacts, apaaiRelations, "apaai");
const nativeProjection = createProjection(nativeFacts, nativeRelations, "native");
const apaaiSemanticSnapshot = createCanonicalSemanticSnapshot(apaaiProjection);
const nativeSemanticSnapshot = createCanonicalSemanticSnapshot(nativeProjection);
const apaaiSemanticBytes = serializeCanonicalSemanticSnapshot(apaaiSemanticSnapshot);
const nativeSemanticBytes = serializeCanonicalSemanticSnapshot(nativeSemanticSnapshot);
assert.equal(apaaiSemanticBytes, nativeSemanticBytes);
assert.notDeepEqual(apaaiProjection.semantic_provenance, nativeProjection.semantic_provenance);
assert.notDeepEqual(apaaiProjection.external_references, nativeProjection.external_references);
assert.equal(apaaiSemanticBytes.includes("apaai"), false);
assert.equal(nativeSemanticBytes.includes("guard-native"), false);

const relationByRole = new Map(apaaiRelations.map((entry) => [entry.role, entry.result]));
for (const role of ["action_occurrence", "policy_record_presence", "external_decision_record_presence", "evidence_record_presence"]) {
  assert.equal(relationByRole.get(role).relation, "supports", role);
}
const negativeRoles = apaaiRelations.map((entry) => entry.role).filter((role) => ![
  "action_occurrence", "policy_record_presence", "external_decision_record_presence", "evidence_record_presence",
].includes(role));
for (const role of negativeRoles) {
  assert.ok(["does_not_support", "indeterminate"].includes(relationByRole.get(role).relation), `${role}: semantic inflation`);
}
assert.deepEqual(relationByRole.get("action_not_authority").claim_boundaries_applied, ["CB-01"]);
assert.deepEqual(relationByRole.get("policy_match_not_legal_compliance").claim_boundaries_applied, ["CB-19"]);
assert.deepEqual(relationByRole.get("evidence_pass_not_independent_verification").claim_boundaries_applied, ["CB-22"]);
assert.deepEqual(relationByRole.get("approver_record_not_applicable_review").claim_boundaries_applied, ["CB-18"]);
assert.deepEqual(relationByRole.get("protocol_mapping_not_certification").claim_boundaries_applied, ["CB-20"]);
assert.ok(relationByRole.get("external_decision_not_guard_disposition").explicit_non_claims.includes("authority"));
assert.ok(relationByRole.get("signing_not_correctness").explicit_non_claims.includes("claim_correctness"));
assert.ok(relationByRole.get("signing_not_authority").explicit_non_claims.includes("authority_without_separate_binding"));

// Representative supports_claim behavior is byte-equivalent before and after the crosswalk composition.
const representativeRequests = [
  { claimId: "action_state_within_captured_bounds", semanticIds: ["mesr.core.action.action"], providedBindings: { actor: "a", target: "t", action_type: "x", time: "now", provenance: "p" }, requiredBindings: ["actor", "target", "action_type", "time", "provenance"] },
  { claimId: "authority_verified", semanticIds: ["mesr.core.action.action"], observedStateIds: ["evidence_present"] },
  { claimId: "legally_compliant", semanticIds: ["mesr.core.claim.scope"], observedStateIds: ["policy_match_recorded"] },
  { claimId: "applicable_review_exists", semanticIds: ["mesr.core.evidence.attestation"], observedStateIds: ["approval_record_exists"] },
  { claimId: "independent_verification", semanticIds: ["mesr.core.provenance.producer"], observedStateIds: ["producer_claim_present"] },
];
const supportsClaimBefore = representativeRequests.map((request) => evaluate(request, MESR_CORE_REGISTRY));
const supportsClaimAfter = representativeRequests.map((request) => evaluate(request, composition.semantic_entries));
assert.deepEqual(supportsClaimAfter, supportsClaimBefore);

// Replay is byte-deterministic.
function replay() {
  const replayFixtures = createMesrE3A2ApaaiFixtures();
  validatePinnedApaaiFixture(replayFixtures.apaai);
  const replayFacts = factsFromApaai(replayFixtures.apaai);
  const replayRelations = buildRelations(replayFacts, composition.semantic_entries);
  return serializeCanonicalSemanticSnapshot(createCanonicalSemanticSnapshot(createProjection(replayFacts, replayRelations, "apaai")));
}
const replayOne = replay();
const replayTwo = replay();
assert.equal(replayOne, replayTwo);
assert.equal(replayOne, apaaiSemanticBytes);

// Internal/default-off isolation: no public exports, CLI coupling, global verify wiring, or runtime networking.
const packageJson = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
assert.equal(packageJson.scripts["verify:mesr:apaai-crosswalk"], "node scripts/verify_mesr_apaai_crosswalk.mjs");
assert.equal(packageJson.scripts.verify.includes("apaai"), false);
assert.equal(packageJson.scripts["verify:v8:semantic-foundation:phase2"].includes("apaai"), false);
const publicIndex = fs.readFileSync(path.join(repoRoot, "packages", "guard-core", "src", "index.ts"), "utf8");
assert.equal(/apaai/i.test(publicIndex), false);
const publicFiles = [
  ...collectFiles(path.join(repoRoot, "packages", "guard", "src")),
  ...collectFiles(path.join(repoRoot, "docs", "product")),
  ...fs.readdirSync(repoRoot).filter((name) => /^readme/i.test(name)).map((name) => path.join(repoRoot, name)),
];
for (const file of publicFiles) assert.equal(/mesr\.xw\.apaai|APAAI/i.test(fs.readFileSync(file, "utf8")), false, file);
const forbiddenNetworkPatterns = [
  new RegExp("node:" + "https"),
  new RegExp("node:" + "http"),
  new RegExp("fe" + "tch\\s*\\("),
  new RegExp("Web" + "Socket"),
];
for (const relativePath of ["scripts/verify_mesr_apaai_crosswalk.mjs", "scripts/fixtures/mesr_e3_a2_apaai_crosswalk_fixtures.mjs"]) {
  const source = fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
  assert.equal(forbiddenNetworkPatterns.some((pattern) => pattern.test(source)), false, `${relativePath}: runtime network forbidden`);
}

const targetedAcceptance = Object.fromEntries(Array.from({ length: 18 }, (_, index) => [
  `AC-A2-${String(index + 1).padStart(2, "0")}`,
  "PASS",
]));

console.log("PASS: MESR E3-A2 grounded APAAI semantic crosswalk verified");
console.log(JSON.stringify({
  classification: "CONTROLLED SOURCE-PINNED CROSSWALK EVIDENCE",
  source: {
    protocol_identity: sourceManifest.declared_protocol_identity,
    machine_version: sourceManifest.machine_artifact.version,
    commit: sourceManifest.commit,
    artifact: sourceManifest.artifact,
    sha256: sourceManifest.machine_artifact.sha256,
    ambiguities_preserved: sourceManifest.source_ambiguities.length,
  },
  crosswalk: {
    module_id: MESR_APAAI_CROSSWALK_TEST_MODULE.module_id,
    mappings: MESR_APAAI_CROSSWALK_TEST_MODULE.mappings.length,
    added_semantics: MESR_APAAI_CROSSWALK_TEST_MODULE.added_semantics.length,
    public_surface: false,
    runtime_network: false,
  },
  core: {
    primitive_count: { before: coreBeforeSnapshot.length, after: coreAfterSnapshot.length },
    registry_sha256: { before: coreBeforeHash, after: coreAfterHash, equal: true },
    claim_boundary_sha256: { before: boundaryBeforeHash, after: boundaryAfterHash, equal: true },
    supports_claim_equal: true,
  },
  equivalence: {
    raw_equal: false,
    provenance_equal: false,
    canonical_semantics_equal: true,
    semantic_snapshot_sha256: sha256(apaaiSemanticBytes),
  },
  boundaries_applied: apaaiSemanticSnapshot.claim_boundaries,
  negative_inflation_checks: negativeRoles.length,
  ambiguity_negative_fixtures: Object.keys(ambiguityRejections).length,
  deterministic_replay: "PASS",
  targeted_acceptance: targetedAcceptance,
  regression_acceptance: {
    "AC-A2-19": "REQUIRES_EXTERNAL_REGRESSION_MATRIX",
    "AC-A2-20": "REQUIRES_EXTERNAL_REGRESSION_MATRIX",
  },
  gate_2_h03: "SATISFIED_BY_TARGETED_EVIDENCE",
  gate_2: "READY_TO_CLOSE_AFTER_REQUIRED_REGRESSIONS",
}));
