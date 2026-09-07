import assert from "node:assert/strict";
import { MESR_CORE_REGISTRY, validateMesrCoreRegistry } from "../packages/guard-core/src/mesr/coreRegistry.ts";
import { MESR_CLAIM_BOUNDARIES, validateMesrClaimBoundaries } from "../packages/guard-core/src/mesr/claimBoundaries.ts";
import { validateMesrTemporalBasis } from "../packages/guard-core/src/mesr/temporalBasis.ts";

const expectedCoreIds = [
  "mesr.core.actor.principal", "mesr.core.actor.actor", "mesr.core.actor.identity_assertion",
  "mesr.core.authority.source", "mesr.core.authority.scope", "mesr.core.authority.delegation", "mesr.core.authority.declared",
  "mesr.core.intent.intent", "mesr.core.action.action", "mesr.core.action.tool_invocation",
  "mesr.core.boundary.authority", "mesr.core.boundary.execution", "mesr.core.boundary.effect", "mesr.core.boundary.reliance",
  "mesr.core.effect.effect", "mesr.core.effect.outcome", "mesr.core.effect.state_transition",
  "mesr.core.evidence.item", "mesr.core.evidence.observation", "mesr.core.evidence.attestation", "mesr.core.evidence.verification",
  "mesr.core.claim.claim", "mesr.core.claim.scope", "mesr.core.claim.support_relation",
  "mesr.core.provenance.producer", "mesr.core.provenance.verifier", "mesr.core.provenance.lineage",
  "mesr.core.temporal.basis", "mesr.core.review.review", "mesr.core.review.disposition",
];

assert.equal(MESR_CORE_REGISTRY.length, 30);
assert.deepEqual(MESR_CORE_REGISTRY.map((entry) => entry.semantic_id), expectedCoreIds);
assert.ok(MESR_CORE_REGISTRY.every((entry) => entry.namespace === "mesr.core"));
assert.ok(MESR_CORE_REGISTRY.every((entry) => entry.version === "0.1.0" && entry.status === "active"));
assert.ok(MESR_CORE_REGISTRY.every((entry) => entry.does_not_support.length > 0));

const firstValidation = validateMesrCoreRegistry();
const secondValidation = validateMesrCoreRegistry();
assert.deepEqual(firstValidation, { valid: true, issues: [] });
assert.deepEqual(firstValidation, secondValidation);

const collision = [
  ...MESR_CORE_REGISTRY,
  { ...MESR_CORE_REGISTRY[0], definition: "conflicting test definition" },
];
assert.equal(validateMesrCoreRegistry(collision).valid, false);

assert.equal(MESR_CLAIM_BOUNDARIES.length, 24);
assert.deepEqual(validateMesrClaimBoundaries(), { valid: true, issues: [] });
for (const [state, claim] of [
  ["evidence_present", "authority_verified"],
  ["identity_verified", "authority_verified"],
  ["verification_passed", "execution_authorized"],
  ["observation_recorded", "verification"],
  ["artifact_integrity", "artifact_truth"],
  ["historical_evidence_valid", "current_standing"],
  ["capability_continuity", "authority_continuity"],
  ["framework_mapping_present", "certified"],
  ["producer_claim_present", "independent_verification"],
]) {
  assert.ok(MESR_CLAIM_BOUNDARIES.some((entry) => entry.evidence_or_state_id === state && entry.does_not_support === claim));
}

const temporalBase = {
  evidence_ref: "evidence:test", claim_ref: "claim:test", subject_ref: "subject:test",
  observed_at: "2026-09-01T00:00:00Z", verified_at: "2026-09-01T00:01:00Z",
  valid_from: "2026-09-01T00:00:00Z", valid_until: "2026-09-02T00:00:00Z",
  basis_valid_at: "2026-09-03T00:00:00Z", status_reason: "explicit test state",
  revocation_ref: null, superseded_by: null, subject_binding_hash: "sha256:subject",
  evaluated_subject_hash: "sha256:subject", provenance_refs: ["fixture:temporal"],
};
assert.equal(validateMesrTemporalBasis({ ...temporalBase, basis_status: "stale" }).valid, true);
assert.equal(validateMesrTemporalBasis({ ...temporalBase, basis_status: "revoked", revocation_ref: "revocation:test" }).valid, true);

console.log("PASS: MESR registry 30/30, boundaries 24/24, and temporal contract verified");
