import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MESR_CORE_REGISTRY } from "../packages/guard-core/src/mesr/coreRegistry.ts";
import { MESR_SOFTWARE_DOMAIN_SEED } from "../packages/guard-core/src/mesr/softwareDomainSeed.ts";
import {
  createCanonicalSemanticSnapshot,
  serializeCanonicalSemanticSnapshot,
} from "../packages/guard-core/src/mesr/semanticSnapshot.ts";
import { GITHUB_ACTIONS_SEMANTIC_ADAPTER } from "../packages/guard-core/src/mesr/producerAdapters/githubActionsAdapter.ts";
import { HARNESS_SEMANTIC_ADAPTER } from "../packages/guard-core/src/mesr/producerAdapters/harnessAdapter.ts";
import {
  EVIDENCE_PRODUCER_ADAPTERS,
  normalizeProducerEvidence,
} from "../packages/guard-core/src/mesr/producerAdapters/registry.ts";
import { projectProducerSemanticInputToMesr } from "../packages/guard-core/src/mesr/producerAdapters/semanticProjection.ts";
import {
  PRODUCER_ADAPTER_ERROR_CODES,
  ProducerAdapterError,
} from "../packages/guard-core/src/mesr/producerAdapters/types.ts";
import { freshArtifact } from "./fixtures/evidence_assurance_experiment_1_1_fresh_artifact.mjs";
import { createMesrE3A1RuntimePortabilityFixtures } from "./fixtures/mesr_e3_a1_runtime_portability_fixtures.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const fixtures = createMesrE3A1RuntimePortabilityFixtures();
const clone = (value) => structuredClone(value);

function snapshotFor(raw) {
  const normalized = normalizeProducerEvidence(raw);
  const projection = projectProducerSemanticInputToMesr(normalized);
  return {
    normalized,
    projection,
    snapshot: createCanonicalSemanticSnapshot(projection),
  };
}

function relation(snapshotResult, claimId) {
  const result = snapshotResult.projection.claim_support_relations.find(
    (entry) => entry.claim_id === claimId,
  );
  assert.ok(result, `missing relation ${claimId}`);
  return result;
}

function deleteHarnessClaim(pack, claimType) {
  for (const record of pack.records) {
    record.claims = record.claims.filter((claim) => claim.claim_type !== claimType);
  }
}

function assertSameMeaning(left, right, label) {
  assert.deepEqual(left.snapshot, right.snapshot, label);
  assert.equal(
    serializeCanonicalSemanticSnapshot(left.snapshot),
    serializeCanonicalSemanticSnapshot(right.snapshot),
    `${label}: serialized snapshot`,
  );
}

function assertUnsupportedVersion(raw, expectedFragment) {
  assert.throws(
    () => normalizeProducerEvidence(raw),
    (error) => {
      assert.ok(error instanceof ProducerAdapterError);
      assert.equal(error.code, PRODUCER_ADAPTER_ERROR_CODES.UNSUPPORTED_PRODUCER_VERSION);
      assert.match(error.message, expectedFragment);
      return true;
    },
  );
}

// Registry and adapter boundary: deterministic, local, versioned, and non-authoritative.
assert.deepEqual(
  EVIDENCE_PRODUCER_ADAPTERS.map((entry) => entry.adapterId),
  [...EVIDENCE_PRODUCER_ADAPTERS].map((entry) => entry.adapterId).sort(),
);
assert.deepEqual(GITHUB_ACTIONS_SEMANTIC_ADAPTER.supportedProducerSchemaVersions, [
  "evidence-assurance-experiment-1.1/v0.1",
  "github-actions-controlled-equivalence/v0.1",
]);
assert.deepEqual(HARNESS_SEMANTIC_ADAPTER.supportedProducerSchemaVersions, [
  "harness-evidence-pack/v0.1",
]);
assert.equal(GITHUB_ACTIONS_SEMANTIC_ADAPTER.mesrCoreCompatibility, ">=0.1.0 <0.2.0");
assert.equal(HARNESS_SEMANTIC_ADAPTER.mesrCoreCompatibility, ">=0.1.0 <0.2.0");
for (const file of ["githubActionsAdapter.ts", "harnessAdapter.ts"]) {
  const source = fs.readFileSync(
    path.join(repoRoot, "packages", "guard-core", "src", "mesr", "producerAdapters", file),
    "utf8",
  );
  assert.equal(source.includes("evaluateMesrClaimSupport"), false);
  assert.equal(source.includes("MESR_CLAIM_BOUNDARIES"), false);
}

// Positive E3-A1: representations and native identifiers differ; MESR meaning is equal.
assert.notDeepEqual(fixtures.github, fixtures.harness);
const positiveGitHub = snapshotFor(fixtures.github);
const positiveHarness = snapshotFor(fixtures.harness);
assert.notDeepEqual(
  positiveGitHub.normalized.producer_native_metadata,
  positiveHarness.normalized.producer_native_metadata,
);
assertSameMeaning(positiveGitHub, positiveHarness, "controlled two-producer semantic equality");
assert.ok(positiveGitHub.snapshot.subject_effect_bindings.length >= 18);
const positiveSnapshotBytes = serializeCanonicalSemanticSnapshot(positiveGitHub.snapshot);
for (const nativeId of ["gha-run-9001", "gha-artifact-7001", "harness-run-4401", "tool-call-8101"]) {
  assert.equal(positiveSnapshotBytes.includes(nativeId), false, `producer-native id leaked into semantic equality: ${nativeId}`);
}
for (const normalized of [positiveGitHub.normalized, positiveHarness.normalized]) {
  assert.ok(normalized.provenance.length >= 20);
  for (const entry of normalized.provenance) {
    assert.equal(entry.producer_id, normalized.producer.producer_id);
    assert.equal(entry.producer_schema_version, normalized.producer.producer_schema_version);
    assert.equal(entry.adapter_id, normalized.producer.adapter_id);
    assert.equal(entry.adapter_version, normalized.producer.adapter_version);
    assert.match(entry.native_field, /^\//);
  }
}
assert.equal(relation(positiveGitHub, "bounded_software_change_observed").relation, "supports");
assert.equal(relation(positiveGitHub, "tests_passed").relation, "supports");
assert.equal(relation(positiveGitHub, "applicable_review_exists").relation, "supports");
assert.equal(
  relation(positiveGitHub, "release_subject_equals_verification_subject").relation,
  "supports",
);

// Producer vocabulary inflation: "approved" is only a producer record and CB-01/06/18 remain controlling.
const vocabularyGitHubRaw = clone(fixtures.github);
vocabularyGitHubRaw.workflow_run.conclusion = "approved";
vocabularyGitHubRaw.review = { exists: true, conclusion: "approved" };
const vocabularyHarnessRaw = clone(fixtures.harness);
const harnessReview = vocabularyHarnessRaw.records.find((record) => record.evidence_type === "review_record");
harnessReview.claims = harnessReview.claims.filter((claim) =>
  ["review_exists", "approval_record"].includes(claim.claim_type)
);
const vocabularyGitHub = snapshotFor(vocabularyGitHubRaw);
const vocabularyHarness = snapshotFor(vocabularyHarnessRaw);
assertSameMeaning(vocabularyGitHub, vocabularyHarness, "approval vocabulary inflation symmetry");
assert.equal(relation(vocabularyGitHub, "applicable_review_exists").relation, "does_not_support");
assert.deepEqual(relation(vocabularyGitHub, "applicable_review_exists").claim_boundaries_applied, ["CB-18"]);
assert.equal(relation(vocabularyGitHub, "authority_verified").relation, "does_not_support");
assert.deepEqual(relation(vocabularyGitHub, "authority_verified").claim_boundaries_applied, ["CB-01"]);
assert.equal(relation(vocabularyGitHub, "execution_authorized").relation, "does_not_support");
assert.deepEqual(relation(vocabularyGitHub, "execution_authorized").claim_boundaries_applied, ["CB-06"]);

// Integrity inflation: digest binding supports integrity and nothing stronger.
const integrityGitHubRaw = clone(fixtures.github);
integrityGitHubRaw.verification = {};
integrityGitHubRaw.review = {};
integrityGitHubRaw.release = {};
integrityGitHubRaw.effect = {};
integrityGitHubRaw.workflow_run.conclusion = null;
const integrityHarnessRaw = clone(fixtures.harness);
integrityHarnessRaw.records = integrityHarnessRaw.records.filter((record) =>
  ["agent_workflow_artifact", "external_signed_receipt"].includes(record.evidence_type) &&
  record.source_id !== "harness-release-2201"
);
integrityHarnessRaw.record_count = integrityHarnessRaw.records.length;
const integrityGitHub = snapshotFor(integrityGitHubRaw);
const integrityHarness = snapshotFor(integrityHarnessRaw);
assertSameMeaning(integrityGitHub, integrityHarness, "integrity inflation symmetry");
assert.equal(relation(integrityGitHub, "artifact_integrity").relation, "supports");
assert.equal(relation(integrityGitHub, "artifact_truth").relation, "does_not_support");
assert.deepEqual(relation(integrityGitHub, "artifact_truth").claim_boundaries_applied, ["CB-09"]);
for (const claimId of ["change_correctness", "safe", "execution_authorized"]) {
  assert.notEqual(relation(integrityGitHub, claimId).relation, "supports");
}

// Missing evidence: removing the same result binding yields the same indeterminate claim.
const missingGitHubRaw = clone(fixtures.github);
delete missingGitHubRaw.verification.result;
const missingHarnessRaw = clone(fixtures.harness);
deleteHarnessClaim(missingHarnessRaw, "verification_result");
const missingGitHub = snapshotFor(missingGitHubRaw);
const missingHarness = snapshotFor(missingHarnessRaw);
assertSameMeaning(missingGitHub, missingHarness, "missing verification result symmetry");
assert.equal(relation(missingGitHub, "tests_passed").relation, "indeterminate");
assert.deepEqual(relation(missingGitHub, "tests_passed").missing_bindings, ["result"]);

// Subject mismatch: both producer representations produce an explicit contradiction.
const mismatchGitHubRaw = clone(fixtures.github);
mismatchGitHubRaw.release.commit_sha = "commit-C";
const mismatchHarnessRaw = clone(fixtures.harness);
for (const record of mismatchHarnessRaw.records) {
  for (const claim of record.claims) {
    if (claim.claim_type === "release_subject_revision") claim.detail = "commit-C";
  }
}
const mismatchGitHub = snapshotFor(mismatchGitHubRaw);
const mismatchHarness = snapshotFor(mismatchHarnessRaw);
assertSameMeaning(mismatchGitHub, mismatchHarness, "subject mismatch symmetry");
assert.equal(
  relation(mismatchGitHub, "release_subject_equals_verification_subject").relation,
  "contradicts",
);

// Producer version/schema rejection is exact and repeatable; no field guessing.
const unsupportedGitHub = clone(fixtures.github);
unsupportedGitHub.schema_version = "github-actions-controlled-equivalence/v9.9";
const unsupportedHarness = clone(fixtures.harness);
unsupportedHarness.pack_version = "9.9";
assertUnsupportedVersion(unsupportedGitHub, /github-actions schema/);
assertUnsupportedVersion(unsupportedHarness, /Harness schema/);
assertUnsupportedVersion(clone(unsupportedGitHub), /github-actions schema/);
assertUnsupportedVersion(clone(unsupportedHarness), /Harness schema/);

// Repository-grounded replay. These are independent samples and are not compared as one event.
const realGitHub = snapshotFor(freshArtifact);
const harnessFixturePath = path.join(
  repoRoot,
  "experiments",
  "harness-phase-2-external-evidence",
  "fixtures",
  "mixed-evidence-pack.json",
);
const realHarnessRaw = JSON.parse(fs.readFileSync(harnessFixturePath, "utf8"));
const realHarness = snapshotFor(realHarnessRaw);
assert.equal(realGitHub.normalized.producer.producer_id, "github-actions");
assert.equal(realHarness.normalized.producer.producer_id, "guard-native-agent-harness-local");
assert.equal(realGitHub.normalized.producer.producer_schema_version, "evidence-assurance-experiment-1.1/v0.1");
assert.equal(realHarness.normalized.producer.producer_schema_version, "harness-evidence-pack/v0.1");
assert.ok(realGitHub.normalized.provenance.some((entry) => entry.native_field === "/commit_sha"));
assert.ok(realHarness.normalized.provenance.some((entry) => entry.native_field.includes("/subject/agent_id")));
assert.ok(realGitHub.normalized.producer_native_metadata.workflow_run_id);
assert.ok(realHarness.normalized.producer_native_metadata.record_ids.length >= 6);

// Same raw input + adapter/version + registry yields byte-identical snapshots twice.
for (const raw of [fixtures.github, fixtures.harness, freshArtifact, realHarnessRaw]) {
  const first = serializeCanonicalSemanticSnapshot(snapshotFor(raw).snapshot);
  const second = serializeCanonicalSemanticSnapshot(snapshotFor(raw).snapshot);
  assert.equal(second, first);
}

// Every resolved semantic is from the shared Phase 2A Core/software registries.
const knownSemanticIds = new Set(
  [...MESR_CORE_REGISTRY, ...MESR_SOFTWARE_DOMAIN_SEED].map((entry) => entry.semantic_id),
);
for (const projection of [positiveGitHub.projection, positiveHarness.projection]) {
  for (const semanticId of projection.semantic_ids) assert.ok(knownSemanticIds.has(semanticId));
  for (const support of projection.claim_support_relations) {
    for (const semanticId of support.semantic_ids) assert.ok(knownSemanticIds.has(semanticId));
  }
}

const packageJson = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
assert.equal(packageJson.engines.node, ">=18");
assert.equal(packageJson.scripts.verify.includes("runtime-portability"), false);
assert.equal(
  fs.readFileSync(path.join(repoRoot, "packages", "guard-core", "src", "index.ts"), "utf8").includes("producerAdapters"),
  false,
);

console.log("PASS: MESR E3-A1 initial two-producer runtime portability verified");
console.log(JSON.stringify({
  classification: {
    github_replay: "REAL PRODUCER SCHEMA EVIDENCE / SANITIZED",
    harness_replay: "REPOSITORY-GROUNDED PRODUCER FIXTURE",
    equality: "CONTROLLED EQUIVALENCE FIXTURE",
  },
  controlled_snapshot_equal: true,
  core_semantic_ids: positiveGitHub.snapshot.core_semantic_ids.length,
  support_relations: positiveGitHub.snapshot.support_relations.length,
  claim_boundaries: positiveGitHub.snapshot.claim_boundaries,
  subject_effect_bindings: positiveGitHub.snapshot.subject_effect_bindings.length,
  negatives: {
    vocabulary_inflation: "symmetric_and_blocked",
    integrity_inflation: "symmetric_and_blocked",
    missing_evidence: "symmetric_indeterminate",
    subject_mismatch: "symmetric_contradiction",
  },
  real_replay: { github: "normalized", harness: "normalized", same_event_claimed: false },
  deterministic_replays_per_input: 2,
  gate_2: "NOT_YET",
}));
