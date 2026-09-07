import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MESR_CLAIM_BOUNDARIES } from "../packages/guard-core/src/mesr/claimBoundaries.ts";
import { MESR_CORE_REGISTRY } from "../packages/guard-core/src/mesr/coreRegistry.ts";
import {
  createCanonicalCorePatternSignature,
  createCanonicalCoreRegistrySnapshot,
  serializeCanonicalCorePatternSignature,
  serializeCanonicalCoreRegistrySnapshot,
} from "../packages/guard-core/src/mesr/corePatternSignature.ts";
import {
  MESR_CORE_MODULE,
  composeMesrModules,
  validateMesrModuleManifest,
} from "../packages/guard-core/src/mesr/moduleManifest.ts";
import {
  MESR_SOFTWARE_DOMAIN_MODULE,
  MESR_SOFTWARE_DOMAIN_SEED,
} from "../packages/guard-core/src/mesr/softwareDomainSeed.ts";
import { evaluateMesrClaimSupport } from "../packages/guard-core/src/mesr/supportEvaluator.ts";
import { createMesrExperiment3Phase2CFixtures } from "./fixtures/mesr_experiment_3_phase2c_fixtures.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const fixtures = createMesrExperiment3Phase2CFixtures();
const syntheticModules = Object.values(fixtures.modules);
const composition = composeMesrModules([
  MESR_CORE_MODULE,
  MESR_SOFTWARE_DOMAIN_MODULE,
  ...syntheticModules,
]);

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function evaluate({
  claimId,
  semanticIds,
  providedBindings = {},
  requiredBindings = [],
  supported = false,
  observedStateIds = [],
  contradicted = false,
}, semanticEntries = composition.semantic_entries) {
  return evaluateMesrClaimSupport({
    claim_id: claimId,
    semantic_ids: semanticIds,
    provided_bindings: providedBindings,
    required_bindings: requiredBindings,
    supported_claim_parts: supported ? [claimId] : [],
    observed_state_ids: observedStateIds,
    contradicted_claims: contradicted ? [claimId] : [],
    evidence_refs: ["controlled-synthetic-domain:e3-b"],
  }, semanticEntries);
}

function signature(pattern, supportRelations, reverseInputOrder = false) {
  const source = reverseInputOrder
    ? {
        ...pattern,
        semantic_ids: [...pattern.semantic_ids].reverse(),
        required_binding_categories: [...pattern.required_binding_categories].reverse(),
        transition_boundary_pattern: [...pattern.transition_boundary_pattern].reverse(),
        provenance_roles: [...pattern.provenance_roles].reverse(),
        independence_roles: [...pattern.independence_roles].reverse(),
      }
    : pattern;
  return createCanonicalCorePatternSignature({
    ...source,
    support_relations: reverseInputOrder ? [...supportRelations].reverse() : supportRelations,
  });
}

function relationByRole(relations, role) {
  const entry = relations.find((item) => item.pattern_role === role);
  assert.ok(entry, `missing pattern relation ${role}`);
  return entry.result;
}

function assertPatternEqual(left, right, label) {
  assert.deepEqual(left, right, label);
  assert.equal(
    serializeCanonicalCorePatternSignature(left),
    serializeCanonicalCorePatternSignature(right),
    `${label}: serialized signature`,
  );
}

function assertNoStrongerSupport(relations, roles) {
  for (const role of roles) {
    assert.notEqual(relationByRole(relations, role).relation, "supports", role);
  }
}

// The test-only modules are valid additive Domain modules and cannot mutate Core.
assert.equal(MESR_CORE_REGISTRY.length, 30);
assert.equal(MESR_CLAIM_BOUNDARIES.length, 24);
for (const module of syntheticModules) {
  const validation = validateMesrModuleManifest(
    module,
    [...MESR_CORE_REGISTRY, ...MESR_SOFTWARE_DOMAIN_SEED],
  );
  assert.equal(validation.status, "VALID_MODULE", module.module_id);
  assert.ok(module.semantic_namespace.startsWith("mesr.domain.synthetic_"));
  assert.equal(module.presentation.classification, "CONTROLLED SYNTHETIC DOMAIN EVIDENCE");
  assert.equal(module.presentation.product_support, false);
  assert.equal(module.presentation.public_surface, false);
  assert.equal(module.semantic_overrides, undefined);
}
assert.equal(composition.status, "VALID_COMPOSITION");

const coreBeforeSnapshot = createCanonicalCoreRegistrySnapshot(MESR_CORE_REGISTRY);
const coreAfterEntries = composition.semantic_entries.filter((entry) => entry.namespace === "mesr.core");
const coreAfterSnapshot = createCanonicalCoreRegistrySnapshot(coreAfterEntries);
const coreBeforeBytes = serializeCanonicalCoreRegistrySnapshot(coreBeforeSnapshot);
const coreAfterBytes = serializeCanonicalCoreRegistrySnapshot(coreAfterSnapshot);
const coreBeforeHash = sha256(coreBeforeBytes);
const coreAfterHash = sha256(coreAfterBytes);
assert.equal(coreBeforeSnapshot.length, 30);
assert.equal(coreAfterSnapshot.length, 30);
assert.equal(coreAfterBytes, coreBeforeBytes);
assert.equal(coreAfterHash, coreBeforeHash);

// E3-B1: one Core delegation/authority pattern, different domain scope shapes.
function buildDelegationRelations(domain) {
  return [
    {
      pattern_role: "delegation_occurrence",
      result: evaluate({
        claimId: "delegation_occurrence",
        semanticIds: ["mesr.core.authority.delegation"],
        providedBindings: {
          delegator: domain.principal,
          delegate: domain.actor,
          scope: domain.scope,
          valid_time: domain.valid_until,
          provenance: domain.provenance,
        },
        requiredBindings: ["delegator", "delegate", "scope", "valid_time", "provenance"],
      }),
    },
    {
      pattern_role: "bounded_delegation_scope",
      result: evaluate({
        claimId: "bounded_delegation_scope",
        semanticIds: ["mesr.core.authority.delegation", "mesr.core.authority.scope"],
        providedBindings: {
          principal: domain.principal,
          actor: domain.actor,
          action: domain.action,
          target: domain.target,
          scope: domain.scope,
          time: domain.valid_until,
          provenance: domain.provenance,
        },
        requiredBindings: ["principal", "actor", "action", "target", "scope", "time", "provenance"],
        supported: true,
      }),
    },
    {
      pattern_role: "access_does_not_establish_authority",
      result: evaluate({
        claimId: "authority_verified",
        semanticIds: ["mesr.core.evidence.item", "mesr.core.action.action"],
        providedBindings: { access: domain.access.present },
        observedStateIds: ["resource_access"],
      }),
    },
    {
      pattern_role: "domain_authority_remains_separate",
      result: evaluate({
        claimId: domain.access.kind === "transaction_api"
          ? "business_authority_verified"
          : "code_change_authority_verified",
        semanticIds: ["mesr.core.authority.scope"],
      }),
    },
    {
      pattern_role: "applicable_authority_remains_separate",
      result: evaluate({
        claimId: "applicable_authority",
        semanticIds: ["mesr.core.authority.source", "mesr.core.authority.scope"],
        providedBindings: {},
        requiredBindings: ["authority_source", "subject", "scope", "valid_time"],
      }),
    },
    {
      pattern_role: "execution_authority_remains_external",
      result: evaluate({
        claimId: "execution_authorized",
        semanticIds: ["mesr.core.boundary.execution"],
      }),
    },
    {
      pattern_role: "delegation_non_amplification",
      result: evaluate({
        claimId: "authority_amplified",
        semanticIds: ["mesr.core.authority.delegation", "mesr.core.boundary.authority"],
        providedBindings: {
          delegator_delegable_scope: domain.parent_scope,
          delegate_scope: domain.child_scope,
          constraints: domain.child_scope_relation,
          chain_validity: null,
        },
        observedStateIds: ["delegation_exists"],
      }),
    },
  ];
}

assert.notDeepEqual(fixtures.b1.software.scope, fixtures.b1.finance.scope);
assert.equal(fixtures.b1.software.child_scope_relation, "broader_than_parent");
assert.equal(fixtures.b1.finance.child_scope_relation, "broader_than_parent");
const b1SoftwareRelations = buildDelegationRelations(fixtures.b1.software);
const b1FinanceRelations = buildDelegationRelations(fixtures.b1.finance);
assert.equal(relationByRole(b1SoftwareRelations, "delegation_occurrence").relation, "supports");
assert.equal(relationByRole(b1FinanceRelations, "delegation_occurrence").relation, "supports");
assert.equal(relationByRole(b1SoftwareRelations, "access_does_not_establish_authority").relation, "does_not_support");
assert.deepEqual(relationByRole(b1SoftwareRelations, "access_does_not_establish_authority").claim_boundaries_applied, ["CB-03"]);
assert.equal(relationByRole(b1FinanceRelations, "delegation_non_amplification").relation, "does_not_support");
assert.deepEqual(relationByRole(b1FinanceRelations, "delegation_non_amplification").claim_boundaries_applied, ["CB-17"]);
assertNoStrongerSupport(b1SoftwareRelations, [
  "access_does_not_establish_authority",
  "domain_authority_remains_separate",
  "applicable_authority_remains_separate",
  "execution_authority_remains_external",
  "delegation_non_amplification",
]);
assertNoStrongerSupport(b1FinanceRelations, [
  "access_does_not_establish_authority",
  "domain_authority_remains_separate",
  "applicable_authority_remains_separate",
  "execution_authority_remains_external",
  "delegation_non_amplification",
]);
const b1SoftwareSignature = signature(fixtures.b1.pattern, b1SoftwareRelations);
const b1FinanceSignature = signature(fixtures.b1.pattern, b1FinanceRelations, true);
assertPatternEqual(b1SoftwareSignature, b1FinanceSignature, "E3-B1 Core delegation pattern");

// E3-B2: review occurrence is Core; authority, oversight, and correctness remain separate.
function buildReviewRelations(domain) {
  return [
    {
      pattern_role: "review_exists",
      result: evaluate({
        claimId: "review_exists",
        semanticIds: ["mesr.core.review.review", "mesr.core.evidence.item"],
        providedBindings: {
          reviewer: domain.reviewer,
          subject: domain.subject,
          scope: domain.scope,
          time: domain.time,
          provenance: domain.provenance,
        },
        requiredBindings: ["reviewer", "subject", "scope", "time", "provenance"],
        supported: true,
      }),
    },
    {
      pattern_role: "reviewer_authority_separate",
      result: evaluate({
        claimId: "applicable_reviewer_authority",
        semanticIds: ["mesr.core.review.review", "mesr.core.authority.scope"],
        providedBindings: { reviewer: domain.reviewer },
        requiredBindings: ["reviewer", "authority_source", "scope", "valid_time"],
      }),
    },
    {
      pattern_role: "human_presence_not_meaningful_oversight",
      result: evaluate({
        claimId: "meaningful_oversight",
        semanticIds: ["mesr.core.review.review"],
        providedBindings: { reviewer: domain.reviewer },
        observedStateIds: ["human_in_loop_present"],
      }),
    },
    {
      pattern_role: "applicable_review_requires_bindings",
      result: evaluate({
        claimId: "applicable_review_exists",
        semanticIds: ["mesr.core.review.review", "mesr.core.claim.scope"],
        providedBindings: { reviewer: domain.reviewer },
        requiredBindings: ["subject", "scope", "authority", "time"],
      }),
    },
    {
      pattern_role: "authorized_decision_remains_external",
      result: evaluate({
        claimId: "authorized_decision",
        semanticIds: ["mesr.core.review.review", "mesr.core.boundary.execution"],
      }),
    },
  ];
}

assert.notDeepEqual(
  fixtures.b2.software.authority_requirement,
  fixtures.b2.healthcare.authority_requirement,
);
const b2SoftwareRelations = buildReviewRelations(fixtures.b2.software);
const b2HealthcareRelations = buildReviewRelations(fixtures.b2.healthcare);
assert.equal(relationByRole(b2SoftwareRelations, "review_exists").relation, "supports");
assert.equal(relationByRole(b2HealthcareRelations, "review_exists").relation, "supports");
assert.equal(relationByRole(b2SoftwareRelations, "reviewer_authority_separate").relation, "indeterminate");
assert.equal(relationByRole(b2HealthcareRelations, "human_presence_not_meaningful_oversight").relation, "does_not_support");
assert.deepEqual(relationByRole(b2HealthcareRelations, "human_presence_not_meaningful_oversight").claim_boundaries_applied, ["CB-24"]);
assertNoStrongerSupport(b2SoftwareRelations, [
  "reviewer_authority_separate",
  "human_presence_not_meaningful_oversight",
  "applicable_review_requires_bindings",
  "authorized_decision_remains_external",
]);
assertNoStrongerSupport(b2HealthcareRelations, [
  "reviewer_authority_separate",
  "human_presence_not_meaningful_oversight",
  "applicable_review_requires_bindings",
  "authorized_decision_remains_external",
]);
const b2SoftwareSignature = signature(fixtures.b2.pattern, b2SoftwareRelations);
const b2HealthcareSignature = signature(fixtures.b2.pattern, b2HealthcareRelations, true);
assertPatternEqual(b2SoftwareSignature, b2HealthcareSignature, "E3-B2 Core review pattern");

// E3-B3: operational and epistemic transitions use the same Core evaluator/pattern.
function buildTransitionRelations(domain, epistemic) {
  return [
    {
      pattern_role: "transition_occurrence",
      result: evaluate({
        claimId: "transition_occurrence",
        semanticIds: ["mesr.core.effect.state_transition"],
        providedBindings: {
          from_state: domain.from_state,
          to_state: domain.to_state,
          boundary: domain.boundary,
          time: domain.time,
          provenance: domain.provenance,
        },
        requiredBindings: ["from_state", "to_state", "boundary", "time", "provenance"],
      }),
    },
    {
      pattern_role: "bounded_effect_occurrence",
      result: evaluate({
        claimId: "bounded_effect_occurrence",
        semanticIds: ["mesr.core.effect.effect", "mesr.core.boundary.effect"],
        providedBindings: {
          action: domain.actor,
          subject: domain.effect,
          before_state: domain.from_state,
          after_state: domain.to_state,
          time: domain.time,
          provenance: domain.provenance,
        },
        requiredBindings: ["action", "subject", "before_state", "after_state", "time", "provenance"],
        supported: true,
      }),
    },
    {
      pattern_role: "reliance_requires_separate_basis",
      result: evaluate({
        claimId: epistemic ? "organizationally_warranted_reliance" : "operationally_warranted_reliance",
        semanticIds: ["mesr.core.boundary.reliance", "mesr.core.claim.scope"],
        providedBindings: {
          relying_context: null,
          basis_valid_at: domain.time,
          authority: null,
          verification: null,
          provenance: domain.provenance,
        },
        requiredBindings: ["relying_context", "basis_valid_at", "authority", "verification", "provenance"],
      }),
    },
    {
      pattern_role: "assertion_not_verified_truth",
      result: evaluate({
        claimId: epistemic ? "verified_truth" : "software_correctness",
        semanticIds: ["mesr.core.evidence.observation", "mesr.core.claim.claim"],
        providedBindings: { evidence: domain.evidence },
        requiredBindings: ["content_verifier", "method", "subject", "scope", "time"],
      }),
    },
    {
      pattern_role: "institutional_approval_remains_external",
      result: evaluate({
        claimId: epistemic ? "institutionally_approved_claim" : "release_approved",
        semanticIds: ["mesr.core.review.disposition", "mesr.core.boundary.execution"],
      }),
    },
    {
      pattern_role: "artifact_integrity",
      result: evaluate({
        claimId: "artifact_integrity",
        semanticIds: ["mesr.core.evidence.item", "mesr.core.evidence.verification"],
        providedBindings: { digest: domain.digest, subject: domain.evidence },
        requiredBindings: ["digest", "subject"],
        supported: true,
        observedStateIds: ["artifact_integrity"],
      }),
    },
    {
      pattern_role: "integrity_not_veracity",
      result: evaluate({
        claimId: "artifact_truth",
        semanticIds: ["mesr.core.evidence.verification"],
        observedStateIds: ["artifact_integrity"],
      }),
    },
    {
      pattern_role: "producer_claim_not_independent_verification",
      result: evaluate({
        claimId: "independent_verification",
        semanticIds: ["mesr.core.provenance.producer"],
        observedStateIds: ["producer_claim_present"],
      }),
    },
  ];
}

assert.notEqual(fixtures.b3.operational.from_state, fixtures.b3.epistemic.from_state);
assert.notEqual(fixtures.b3.operational.to_state, fixtures.b3.epistemic.to_state);
const b3OperationalRelations = buildTransitionRelations(fixtures.b3.operational, false);
const b3EpistemicRelations = buildTransitionRelations(fixtures.b3.epistemic, true);
assert.equal(relationByRole(b3OperationalRelations, "transition_occurrence").relation, "supports");
assert.equal(relationByRole(b3EpistemicRelations, "transition_occurrence").relation, "supports");
assert.equal(relationByRole(b3EpistemicRelations, "reliance_requires_separate_basis").relation, "indeterminate");
assert.equal(relationByRole(b3EpistemicRelations, "integrity_not_veracity").relation, "does_not_support");
assert.deepEqual(relationByRole(b3EpistemicRelations, "integrity_not_veracity").claim_boundaries_applied, ["CB-09"]);
assert.equal(relationByRole(b3EpistemicRelations, "producer_claim_not_independent_verification").relation, "does_not_support");
assert.deepEqual(relationByRole(b3EpistemicRelations, "producer_claim_not_independent_verification").claim_boundaries_applied, ["CB-22"]);
assertNoStrongerSupport(b3OperationalRelations, [
  "reliance_requires_separate_basis",
  "assertion_not_verified_truth",
  "institutional_approval_remains_external",
  "integrity_not_veracity",
  "producer_claim_not_independent_verification",
]);
assertNoStrongerSupport(b3EpistemicRelations, [
  "reliance_requires_separate_basis",
  "assertion_not_verified_truth",
  "institutional_approval_remains_external",
  "integrity_not_veracity",
  "producer_claim_not_independent_verification",
]);
const b3OperationalSignature = signature(fixtures.b3.pattern, b3OperationalRelations);
const b3EpistemicSignature = signature(fixtures.b3.pattern, b3EpistemicRelations, true);
assertPatternEqual(b3OperationalSignature, b3EpistemicSignature, "E3-B3 Core transition pattern");

// Pattern signatures exclude event values, domain names, and presentation metadata.
const allSignatureBytes = [
  b1SoftwareSignature,
  b1FinanceSignature,
  b2SoftwareSignature,
  b2HealthcareSignature,
  b3OperationalSignature,
  b3EpistemicSignature,
].map(serializeCanonicalCorePatternSignature);
for (const bytes of allSignatureBytes) {
  for (const forbidden of [
    "example/repo",
    "account-01",
    "instrument-X",
    "10000",
    "synthetic-clinical-reviewer",
    "ai-recommendation",
    "captured-assertion",
    "organizationally-reusable-claim",
    "software",
    "finance",
    "healthcare",
    "epistemic",
  ]) assert.equal(bytes.includes(forbidden), false, `domain value leaked into Core pattern: ${forbidden}`);
}
for (const item of [
  [fixtures.b1.pattern, b1SoftwareRelations],
  [fixtures.b2.pattern, b2SoftwareRelations],
  [fixtures.b3.pattern, b3OperationalRelations],
]) {
  const first = serializeCanonicalCorePatternSignature(signature(item[0], item[1]));
  const second = serializeCanonicalCorePatternSignature(signature(item[0], item[1]));
  assert.equal(second, first);
}

// Core supports_claim meaning is byte-equivalent before/after all synthetic modules load.
const coreRegressionRequests = [
  {
    claimId: "delegation_occurrence",
    semanticIds: ["mesr.core.authority.delegation"],
    providedBindings: { delegator: "A", delegate: "B", scope: "S", valid_time: "T", provenance: "P" },
    requiredBindings: ["delegator", "delegate", "scope", "valid_time", "provenance"],
  },
  {
    claimId: "meaningful_oversight",
    semanticIds: ["mesr.core.review.review"],
    observedStateIds: ["human_in_loop_present"],
  },
  {
    claimId: "artifact_truth",
    semanticIds: ["mesr.core.evidence.verification"],
    observedStateIds: ["artifact_integrity"],
  },
];
for (const request of coreRegressionRequests) {
  const before = evaluate(request, MESR_CORE_REGISTRY);
  const after = evaluate(request, coreAfterEntries);
  assert.deepEqual(after, before);
}

const coreExpansionPressure = [
  ["financial mandate scope", "authority.scope + authority.delegation", "synthetic_finance.mandate.scope", "NO", "Account, instrument, amount, and time remain domain scope dimensions."],
  ["reviewer authority", "review.review + authority.source/scope", "synthetic_healthcare.reviewer.requirement", "NO", "Review occurrence and applicable authority remain separate claims."],
  ["meaningful oversight", "review.review + CB-24", "review rationale/actionability bindings", "NO", "The existing Human-in-loop boundary prevents presence inflation."],
  ["epistemic reliance", "boundary.reliance + claim.scope + temporal.basis", "synthetic_epistemic.reliance.context", "NO", "Missing reliance basis remains indeterminate; a future claim-boundary rule may improve specificity without a new primitive."],
  ["knowledge integrity", "evidence.item/verification + CB-09", "synthetic_epistemic.artifact.knowledge_bundle", "NO", "Integrity and truth remain separated by the existing Core boundary."],
  ["state transition", "effect.state_transition + boundary.effect", "domain state labels", "NO", "Operational and epistemic state values share the same transition structure."],
  ["delegation attenuation", "authority.delegation/boundary + CB-17", "domain scope comparator + chain-validity binding", "NO", "Domain comparators decide subset/broader shape; Core records non-amplification."],
].map(([requested_semantic_concept, existing_core_candidate, domain_binding_candidate, core_expansion_needed, reason]) => ({
  requested_semantic_concept,
  existing_core_candidate,
  domain_binding_candidate,
  core_expansion_needed,
  reason,
}));
assert.equal(coreExpansionPressure.length, 7);
assert.ok(coreExpansionPressure.every((entry) => entry.core_expansion_needed === "NO"));

// Test module isolation: no public export, CLI import, product copy, or canonical verify wiring.
const packageJson = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
assert.equal(packageJson.engines.node, ">=18");
assert.equal(packageJson.scripts.verify.includes("cross-domain"), false);
const publicIndex = fs.readFileSync(path.join(repoRoot, "packages", "guard-core", "src", "index.ts"), "utf8");
assert.equal(publicIndex.includes("corePatternSignature"), false);
assert.equal(publicIndex.includes("synthetic_finance"), false);
const publicRoots = [
  path.join(repoRoot, "packages", "guard", "src"),
  path.join(repoRoot, "docs", "product"),
];
function collectFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(entryPath) : [entryPath];
  });
}
for (const file of publicRoots.flatMap(collectFiles)) {
  const source = fs.readFileSync(file, "utf8");
  assert.equal(/mesr\.domain\.synthetic_(?:finance|healthcare|epistemic)/.test(source), false, file);
}

console.log("PASS: MESR E3-B cross-domain interpretation verified without Core expansion");
console.log(JSON.stringify({
  classification: "CONTROLLED SYNTHETIC DOMAIN EVIDENCE",
  core_primitive_count: { before: coreBeforeSnapshot.length, after: coreAfterSnapshot.length },
  core_registry: { before_sha256: coreBeforeHash, after_sha256: coreAfterHash, equal: true },
  outcomes: { B1: "PASS", B2: "PASS", B3: "PASS" },
  pattern_signatures: {
    B1: sha256(serializeCanonicalCorePatternSignature(b1SoftwareSignature)),
    B2: sha256(serializeCanonicalCorePatternSignature(b2SoftwareSignature)),
    B3: sha256(serializeCanonicalCorePatternSignature(b3OperationalSignature)),
  },
  claim_boundaries: { B1: ["CB-03", "CB-17"], B2: ["CB-24"], B3: ["CB-09", "CB-22"] },
  core_expansion_pressure: coreExpansionPressure,
  eak_engine_count: 1,
  public_surface_changed: false,
  gate_2: "NOT_YET",
}));
