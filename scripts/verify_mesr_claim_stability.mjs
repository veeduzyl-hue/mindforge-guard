import assert from "node:assert/strict";
import { evaluateEvidenceAssuranceKernel } from "../packages/guard-core/src/evidenceAssuranceKernel.ts";
import { generateGovernanceReport } from "../packages/guard-core/src/generateGovernanceReport.ts";
import { validateMesrModuleManifest } from "../packages/guard-core/src/mesr/moduleManifest.ts";
import { MESR_CORE_REGISTRY } from "../packages/guard-core/src/mesr/coreRegistry.ts";
import { MESR_SOFTWARE_DOMAIN_SEED } from "../packages/guard-core/src/mesr/softwareDomainSeed.ts";
import { evaluateMesrClaimSupport } from "../packages/guard-core/src/mesr/supportEvaluator.ts";
import { projectEvidenceAssuranceResultToMesr } from "../packages/guard-core/src/mesr/eakProjection.ts";
import { createExperiment0Cases } from "./fixtures/evidence_assurance_experiment_0_cases.mjs";
import { createMesrExperiment3Phase2AFixtures } from "./fixtures/mesr_experiment_3_phase2a_fixtures.mjs";

const fixtures = createMesrExperiment3Phase2AFixtures();
const available = [...MESR_CORE_REGISTRY, ...MESR_SOFTWARE_DOMAIN_SEED];
const resultSummary = {};

// E3-C1: three identity vocabularies normalize to identity without authority inflation.
assert.equal(validateMesrModuleManifest(fixtures.c1.crosswalk, available).valid, true);
for (const vocabulary of fixtures.c1.vocabularies) {
  assert.ok(fixtures.c1.crosswalk.mappings.some((entry) => entry.external_concept === vocabulary));
  const identity = evaluateMesrClaimSupport({
    claim_id: "verified_identity",
    semantic_ids: ["mesr.core.actor.identity_assertion"],
    observed_state_ids: ["identity_verified"],
    provided_bindings: { actor: "actor:test", credential_or_source: vocabulary, observed_or_verified_time: "2026-09-01T00:00:00Z" },
    required_bindings: ["actor", "credential_or_source", "observed_or_verified_time"],
    supported_claim_parts: ["verified_identity"],
  });
  const authority = evaluateMesrClaimSupport({
    claim_id: "authority_verified",
    semantic_ids: ["mesr.core.actor.identity_assertion"],
    observed_state_ids: ["identity_verified"],
    provided_bindings: {}, required_bindings: [],
  });
  assert.equal(identity.relation, "supports");
  assert.equal(authority.relation, "does_not_support");
  assert.deepEqual(authority.claim_boundaries_applied, ["CB-05"]);
}
resultSummary.C1 = "identity resolved; authority_verified does_not_support via CB-05";

// E3-C2: approval words are insufficient until subject/scope/authority/time are all bound.
assert.equal(validateMesrModuleManifest(fixtures.c2.crosswalk, available).valid, true);
for (const vocabulary of fixtures.c2.vocabularies) {
  const incomplete = evaluateMesrClaimSupport({
    claim_id: "applicable_review_exists", semantic_ids: ["mesr.core.review.review"],
    observed_state_ids: ["approval_record_exists"], provided_bindings: { subject: "commit:test" },
    required_bindings: ["subject", "scope", "authority", "time"], supported_claim_parts: ["applicable_review_exists"],
  });
  const complete = evaluateMesrClaimSupport({
    claim_id: "applicable_review_exists", semantic_ids: ["mesr.core.review.review"],
    observed_state_ids: ["approval_record_exists"],
    provided_bindings: { subject: "commit:test", scope: "repo:path", authority: "delegation:test", time: "2026-09-01T00:00:00Z" },
    required_bindings: ["subject", "scope", "authority", "time"], supported_claim_parts: ["applicable_review_exists"],
  });
  const execution = evaluateMesrClaimSupport({
    claim_id: "execution_authorized", semantic_ids: ["mesr.core.review.review"],
    observed_state_ids: ["approval_record_exists"], provided_bindings: { vocabulary }, required_bindings: [],
  });
  assert.equal(incomplete.relation, "does_not_support");
  assert.deepEqual(incomplete.claim_boundaries_applied, ["CB-18"]);
  assert.equal(complete.relation, "supports");
  assert.notEqual(execution.relation, "supports");
}
resultSummary.C2 = "incomplete approval does_not_support via CB-18; fully bound review supports; execution remains not supported";

// E3-C3: integrity/authenticity can support integrity, never truth/correctness by vocabulary alone.
assert.equal(validateMesrModuleManifest(fixtures.c3.crosswalk, available).valid, true);
const integrity = evaluateMesrClaimSupport({
  claim_id: "artifact_integrity", semantic_ids: ["mesr.core.evidence.verification", "mesr.core.evidence.attestation"],
  observed_state_ids: ["artifact_integrity", "signature_verified"], provided_bindings: {}, required_bindings: [],
  supported_claim_parts: ["artifact_integrity"],
});
assert.equal(integrity.relation, "supports");
const truth = evaluateMesrClaimSupport({ claim_id: "artifact_truth", semantic_ids: ["mesr.core.evidence.verification"], observed_state_ids: ["artifact_integrity"], provided_bindings: {}, required_bindings: [] });
const correctness = evaluateMesrClaimSupport({ claim_id: "claim_correctness", semantic_ids: ["mesr.core.evidence.attestation"], observed_state_ids: ["signature_verified"], provided_bindings: {}, required_bindings: [] });
assert.equal(truth.relation, "does_not_support");
assert.deepEqual(truth.claim_boundaries_applied, ["CB-09"]);
assert.equal(correctness.relation, "does_not_support");
assert.deepEqual(correctness.claim_boundaries_applied, ["CB-10"]);
for (const claim of ["execution_authorized", "safe"]) {
  assert.equal(evaluateMesrClaimSupport({ claim_id: claim, semantic_ids: ["mesr.core.evidence.verification"], observed_state_ids: ["artifact_integrity"], provided_bindings: {}, required_bindings: [] }).relation, "indeterminate");
}
resultSummary.C3 = "artifact_integrity supports; truth/correctness rejected by CB-09/CB-10; unrelated stronger claims indeterminate";

// E3-C4: test-only framework vocabulary carries mapping presence, not normative outcomes.
assert.equal(validateMesrModuleManifest(fixtures.c4.crosswalk, available).valid, true);
for (const vocabulary of fixtures.c4.vocabularies) {
  const mapping = evaluateMesrClaimSupport({ claim_id: "framework_mapping_present", semantic_ids: ["mesr.core.claim.scope"], observed_state_ids: ["framework_mapping_present"], provided_bindings: {}, required_bindings: [], supported_claim_parts: ["framework_mapping_present"] });
  assert.equal(mapping.relation, "supports", vocabulary);
  const certification = evaluateMesrClaimSupport({ claim_id: "certified", semantic_ids: ["mesr.core.claim.scope"], observed_state_ids: ["framework_mapping_present"], provided_bindings: {}, required_bindings: [] });
  assert.equal(certification.relation, "does_not_support", vocabulary);
  assert.deepEqual(certification.claim_boundaries_applied, ["CB-20"]);
  for (const claim of ["legally_compliant", "safe", "execution_authorized"]) {
    assert.equal(evaluateMesrClaimSupport({ claim_id: claim, semantic_ids: ["mesr.core.claim.scope"], observed_state_ids: ["framework_mapping_present"], provided_bindings: {}, required_bindings: [] }).relation, "indeterminate");
  }
}
resultSummary.C4 = "test-only framework mapping supports presence; certification does_not_support via CB-20; other unknown stronger claims indeterminate";

// Exercise all five relation values and the unknown != explicitly unsupported distinction.
assert.equal(evaluateMesrClaimSupport({ claim_id: "compound_claim", semantic_ids: ["mesr.core.claim.claim"], provided_bindings: {}, required_bindings: [], required_claim_parts: ["part_a", "part_b"], supported_claim_parts: ["part_a"] }).relation, "partially_supports");
assert.equal(evaluateMesrClaimSupport({ claim_id: "claim:test", semantic_ids: ["mesr.core.claim.claim"], provided_bindings: {}, required_bindings: [], contradicted_claims: ["claim:test"] }).relation, "contradicts");
assert.equal(evaluateMesrClaimSupport({ claim_id: "unknown_claim", semantic_ids: ["mesr.core.claim.claim"], provided_bindings: {}, required_bindings: [] }).relation, "indeterminate");

// Mandatory dormant-path regression: explicit projection cannot mutate existing EAK/report results.
const existingCases = createExperiment0Cases();
const existingInput = existingCases.caseF_integrity_valid_truth_unsupported;
const eakBefore = evaluateEvidenceAssuranceKernel(existingInput);
const reportBefore = generateGovernanceReport(existingInput.pack);
const projection = projectEvidenceAssuranceResultToMesr({
  result: eakBefore,
  claims: {
    runtime_behavior: {
      claim_id: "artifact_truth", semantic_ids: ["mesr.core.evidence.verification"],
      observed_state_ids: ["artifact_integrity"], provided_bindings: {}, required_bindings: [],
      evidence_refs: eakBefore.supportability.find((entry) => entry.conclusion_id === "runtime_behavior")?.evidence_refs ?? [],
    },
    overall_production_evidence_readiness: {
      claim_id: "unknown_overall_claim", semantic_ids: ["mesr.core.claim.claim"],
      provided_bindings: {}, required_bindings: [],
    },
  },
});
assert.equal(projection.claim_support_relations.find((entry) => entry.claim_id === "artifact_truth")?.relation, "does_not_support");
assert.equal(projection.claim_support_relations.find((entry) => entry.claim_id === "unknown_overall_claim")?.relation, "indeterminate");
const eakAfter = evaluateEvidenceAssuranceKernel(existingInput);
const reportAfter = generateGovernanceReport(existingInput.pack);
assert.deepEqual(eakAfter, eakBefore);
assert.deepEqual(reportAfter, reportBefore);

console.log("PASS: MESR E3-C1/C2/C3/C4 claim stability and backward compatibility verified");
console.log(JSON.stringify(resultSummary));
