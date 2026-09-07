import assert from "node:assert/strict";
import { MESR_CORE_REGISTRY } from "../packages/guard-core/src/mesr/coreRegistry.ts";
import { MESR_REASON_CODE_BINDINGS } from "../packages/guard-core/src/mesr/reasonCodeBindings.ts";
import { MESR_SOFTWARE_DOMAIN_SEED } from "../packages/guard-core/src/mesr/softwareDomainSeed.ts";
import { composeMesrModules, validateMesrModuleManifest } from "../packages/guard-core/src/mesr/moduleManifest.ts";
import { createCanonicalSemanticSnapshot, serializeCanonicalSemanticSnapshot } from "../packages/guard-core/src/mesr/semanticSnapshot.ts";
import { evaluateMesrClaimSupport } from "../packages/guard-core/src/mesr/supportEvaluator.ts";
import { createMesrExperiment3Phase2AFixtures } from "./fixtures/mesr_experiment_3_phase2a_fixtures.mjs";

const fixtures = createMesrExperiment3Phase2AFixtures();
const baseComposition = composeMesrModules(fixtures.d1.base_modules);
assert.equal(baseComposition.status, "VALID_COMPOSITION");

const baseRelation = evaluateMesrClaimSupport({
  claim_id: "artifact_truth",
  semantic_ids: ["mesr.core.evidence.verification"],
  observed_state_ids: ["artifact_integrity"],
  provided_bindings: {}, required_bindings: [],
});
const baseProjection = {
  semantic_ids: ["mesr.core.evidence.verification", "mesr.core.claim.support_relation", "mesr.domain.software.verification.test_evidence"],
  claim_support_relations: [baseRelation],
  claim_boundaries_applied: baseRelation.claim_boundaries_applied,
  explicit_non_claims: baseRelation.explicit_non_claims,
  semantic_provenance: ["fixture:E3-D"],
  reason_code_bindings: [MESR_REASON_CODE_BINDINGS[0]],
};
const baseSnapshot = createCanonicalSemanticSnapshot(baseProjection);
const baseBytes = serializeCanonicalSemanticSnapshot(baseSnapshot);

// E3-D1: conforming Crosswalk and Profile change metadata, never semantic snapshot.
const d1Modules = [...fixtures.d1.base_modules, ...fixtures.d1.additive_modules];
const d1Composition = composeMesrModules(d1Modules);
assert.equal(d1Composition.status, "VALID_COMPOSITION");
assert.equal(d1Composition.profiles.length, 1);
const d1Projection = {
  ...baseProjection,
  presentation: fixtures.d1.additive_modules[1].presentation,
  external_references: fixtures.d1.additive_modules.flatMap((entry) => entry.external_references),
};
assert.equal(serializeCanonicalSemanticSnapshot(createCanonicalSemanticSnapshot(d1Projection)), baseBytes);

// E3-D2: another additive test-only Crosswalk is order-independent and non-interfering.
const d2Modules = [...d1Modules, fixtures.d2.dynamic_crosswalk];
const d2Composition = composeMesrModules(d2Modules);
const d2Reversed = composeMesrModules([...d2Modules].reverse());
assert.equal(d2Composition.status, "VALID_COMPOSITION");
assert.equal(d2Reversed.status, "VALID_COMPOSITION");
assert.deepEqual(d2Composition.semantic_entries.map((entry) => entry.semantic_id), d2Reversed.semantic_entries.map((entry) => entry.semantic_id));
const d2Projection = { ...d1Projection, external_references: d2Composition.modules.flatMap((entry) => entry.external_references) };
assert.equal(serializeCanonicalSemanticSnapshot(createCanonicalSemanticSnapshot(d2Projection)), baseBytes);

// E3-D3: each prohibited equivalence rejects the entire module with zero definitions loaded.
for (const invalidModule of fixtures.d3.invalid_modules) {
  const validation = validateMesrModuleManifest(invalidModule, [...MESR_CORE_REGISTRY, ...MESR_SOFTWARE_DOMAIN_SEED]);
  assert.equal(validation.status, "INVALID_MODULE");
  assert.equal(validation.loaded_semantic_count, 0);
  assert.ok(validation.issues.some((issue) => issue.code === "SEMANTIC_OVERRIDE_FORBIDDEN"));
  const invalidComposition = composeMesrModules([...fixtures.d1.base_modules, invalidModule]);
  assert.equal(invalidComposition.status, "INVALID_COMPOSITION");
  assert.equal(invalidComposition.semantic_entries.length, 0);
}

// Type-specific negative conformance checks.
const coreEntry = MESR_CORE_REGISTRY[0];
const badDomain = {
  ...fixtures.d1.base_modules[1],
  module_id: "mesr.module.invalid_domain",
  added_semantics: [{ ...coreEntry, definition: "attempted domain redefinition" }],
};
assert.equal(validateMesrModuleManifest(badDomain, MESR_CORE_REGISTRY).status, "INVALID_MODULE");

const badCrosswalk = {
  ...fixtures.d1.additive_modules[0],
  module_id: "mesr.xw.invalid_semantic_registration",
  added_semantics: [{ ...coreEntry, semantic_id: "mesr.xw.test_nist_like.new_semantic", namespace: "mesr.xw.test_nist_like" }],
};
assert.ok(validateMesrModuleManifest(badCrosswalk, [...MESR_CORE_REGISTRY, ...MESR_SOFTWARE_DOMAIN_SEED]).issues.some((issue) => issue.code === "CROSSWALK_SEMANTICS_FORBIDDEN"));

const badProfile = {
  ...fixtures.d1.additive_modules[1],
  module_id: "mesr.profile.invalid_support",
  added_semantics: [{ ...coreEntry, semantic_id: "mesr.profile.test_audit.semantic", namespace: "mesr.profile.test_audit" }],
};
assert.ok(validateMesrModuleManifest(badProfile, MESR_CORE_REGISTRY).issues.some((issue) => issue.code === "PROFILE_SEMANTIC_PARTICIPATION_FORBIDDEN"));

console.log("PASS: MESR E3-D1/D2/D3 canonical composition and collision rejection verified");
console.log(JSON.stringify({
  D1: "canonical semantic equality after Crosswalk/Profile composition",
  D2: "additive Crosswalk and module order preserve canonical semantics",
  D3: "three semantic overrides rejected as INVALID_MODULE with zero loaded definitions",
}));
