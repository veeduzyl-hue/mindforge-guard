import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  canonicalJson,
  createV8Phase3AInstitutionalArtifactFixture,
  institutionalArtifactV0_1
} from "./fixtures/v8_phase3a_institutional_artifact_fixture.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) => readFileSync(path.join(root, relativePath), "utf8");
const readJson = (relativePath) => JSON.parse(read(relativePath));
const digest = (value) => createHash("sha256").update(value, "utf8").digest("hex");

const allowedKinds = new Set([
  "FACT",
  "SUPPORTED_CLAIM",
  "NON_CLAIM",
  "UNCERTAINTY",
  "REVIEW_REQUEST"
]);
const forbiddenAuthorityKeys = new Set([
  "risk_score",
  "trust_score",
  "confidence_score",
  "compliance_score",
  "policy_decision",
  "institutional_decision",
  "execution_authorization",
  "certification_status"
]);

function visit(value, visitor) {
  visitor(value);
  if (Array.isArray(value)) {
    for (const item of value) visit(item, visitor);
  } else if (value !== null && typeof value === "object") {
    for (const child of Object.values(value)) visit(child, visitor);
  }
}

function validateArtifactShape(artifact) {
  assert.equal(artifact.schema_version, "institutional-artifact-v0.1");
  assert.equal(artifact.artifact_identity.artifact_version, "0.1");
  assert.match(artifact.artifact_identity.semantic_snapshot_sha256, /^[a-f0-9]{64}$/);
  assert.equal(artifact.presentation.section_order.length, 10);
  assert.equal(new Set(artifact.presentation.section_order).size, 10);
  assert.equal(artifact.semantic_state.reviewer_questions.length, 10);
  assert.ok(artifact.semantic_state.explicit_nonclaims.length >= 1);
  assert.ok(artifact.semantic_state.semantic_provenance.length >= 3);
  assert.ok(artifact.semantic_state.residual_uncertainty.length >= 1);

  visit(artifact, (value) => {
    if (value === null || typeof value !== "object" || Array.isArray(value)) return;
    for (const key of Object.keys(value)) {
      assert.equal(forbiddenAuthorityKeys.has(key), false, `forbidden authority/score key: ${key}`);
    }
    if (Object.hasOwn(value, "text")) {
      assert.ok(allowedKinds.has(value.statement_kind), `unclassified statement: ${value.text}`);
      assert.equal(typeof value.statement_id, "string");
      assert.ok(Array.isArray(value.evidence_refs));
    }
  });
}

const schema = readJson("schemas/institutional_artifact/institutional-artifact-v0.1.schema.json");
assert.equal(schema.title, "MindForge Guard Institutional Artifact v0.1");
assert.deepEqual(schema.properties.artifact_identity.properties.profile.enum, [
  "Developer",
  "Audit/Assurance"
]);

const artifactSpec = read("docs/specs/institutional-artifact-v0.1.md");
const acceptanceContract = read(
  "docs/validation/v8-gate-3-institutional-artifact-acceptance-contract-v0.1.md"
);
const experimentBridge = read(
  "docs/validation/v8-experiment-2-institutional-artifact-bridge-v0.1.md"
);
const mesrCore = read("docs/specs/mesr-core-v0.1.md");
const claimBoundaries = read("docs/specs/mesr-claim-boundary-registry-v0.1.md");
const softwarePack = read("docs/specs/mesr-software-change-domain-pack-v0.1.md");
const adr0008 = read("docs/adr/0008-claim-supportability-is-not-governance-disposition.md");
const caseDefinitions = read("scripts/fixtures/evidence_assurance_experiment_0_cases.mjs");
const basePack = readJson("fixtures/ai-pr-low-risk-complete/evidence-pack.json");

assert.match(artifactSpec, /Claim Support != Governance Disposition != Institutional Decision/);
assert.match(artifactSpec, /recommendation-only, additive-only, non-executing, and default-off/);
assert.match(acceptanceContract, /Gate 3 may pass only after G3-H01 through G3-H06 pass/);
for (const requirementId of ["G3-H01", "G3-H02", "G3-H03", "G3-H04", "G3-H05", "G3-H06"]) {
  assert.match(acceptanceContract, new RegExp(`\\| ${requirementId} \\|[^\\n]+\\| EXTERNAL_REVIEW \\| NOT RUN \\|`));
}
for (const requirementId of ["G3-R01", "G3-R02", "G3-R03", "G3-R04", "G3-R05"]) {
  assert.match(acceptanceContract, new RegExp(`\\| ${requirementId} \\|[^\\n]+\\| INTERNAL_READINESS \\| PASS \\|`));
}
assert.match(experimentBridge, /EXPERIMENT_2A_OPERATIONAL_READY = YES/);
assert.match(experimentBridge, /EXPERIMENT_2B = WAITING_FOR_DESIGN_PARTNER/);
assert.match(experimentBridge, /No design partner has been secured/);
assert.match(caseDefinitions, /caseC_conclusion_specific_missing_evidence/);
assert.match(basePack.workflow.repository.commit_sha, /^[a-f0-9]{40}$/);
assert.ok(basePack.authority.time_window);
assert.equal(basePack.verification[0].status, "passed");
assert.match(adr0008, /Claim Supportability.*Governance Disposition/is);

const first = createV8Phase3AInstitutionalArtifactFixture();
const replay = createV8Phase3AInstitutionalArtifactFixture();
assert.equal(canonicalJson(first), canonicalJson(replay), "fixture replay must be canonical byte-equal");
assert.equal(first.source_case.evidence_classification, "CONTROLLED_REPOSITORY_FIXTURE");
assert.equal(first.source_case.external_institutional_evidence, false);
assert.equal(first.semantic_snapshot_sha256, digest(first.semantic_snapshot_bytes));

const developer = first.profiles.developer;
const audit = first.profiles.audit_assurance;
validateArtifactShape(developer.artifact);
validateArtifactShape(audit.artifact);
assert.equal(developer.artifact.artifact_identity.profile, "Developer");
assert.equal(audit.artifact.artifact_identity.profile, "Audit/Assurance");
assert.notDeepEqual(developer.artifact.presentation, audit.artifact.presentation);
assert.equal(
  canonicalJson(developer.artifact.semantic_state),
  canonicalJson(audit.artifact.semantic_state),
  "profile semantic states must be canonical byte-equal"
);
assert.equal(developer.artifact.artifact_identity.semantic_snapshot_sha256, first.semantic_snapshot_sha256);
assert.equal(audit.artifact.artifact_identity.semantic_snapshot_sha256, first.semantic_snapshot_sha256);
assert.notEqual(developer.markdown, audit.markdown, "profile presentations should differ");

const semanticState = developer.artifact.semantic_state;
const chainByKind = new Map(
  semanticState.semantic_provenance.map((chain) => [chain.chain_kind, chain])
);
assert.equal(chainByKind.size, 3);
assert.equal(chainByKind.get("supported_claim").support_relation, "supports");
assert.equal(chainByKind.get("explicit_nonclaim").support_relation, "does_not_support");
assert.equal(chainByKind.get("explicit_nonclaim").claim_boundary_id, "CB-06");
assert.equal(chainByKind.get("missing_or_indeterminate").support_relation, "indeterminate");
assert.equal(
  chainByKind.get("missing_or_indeterminate").artifact_statement_id,
  "review-request.runtime-evidence"
);

const statementIds = [];
visit(semanticState, (value) => {
  if (value !== null && typeof value === "object" && value.statement_id) {
    statementIds.push(value.statement_id);
  }
});
for (const chain of semanticState.semantic_provenance) {
  assert.ok(mesrCore.includes(chain.core_semantic_id));
  assert.ok(softwarePack.includes(chain.domain_semantic_id));
  if (chain.claim_boundary_id) assert.ok(claimBoundaries.includes(chain.claim_boundary_id));
  assert.ok(statementIds.includes(chain.artifact_statement_id));
}

const nonclaimIds = new Set(semanticState.explicit_nonclaims.map((value) => value.statement_id));
assert.ok(nonclaimIds.has("nonclaim.no-approval"));
assert.ok(nonclaimIds.has("nonclaim.no-independent-authority-verification"));
assert.ok(nonclaimIds.has("nonclaim.no-runtime-proof"));
assert.ok(nonclaimIds.has("nonclaim.no-certification"));
assert.ok(semanticState.explicit_nonclaims.every((value) => value.statement_kind === "NON_CLAIM"));
assert.equal(semanticState.temporal_basis.basis_status, "stale");
const supportedStatements = [];
visit(semanticState, (value) => {
  if (value !== null && typeof value === "object" && value.statement_kind === "SUPPORTED_CLAIM") {
    supportedStatements.push(value.text);
  }
});
for (const text of supportedStatements) {
  assert.doesNotMatch(text, /\\b(?:safe|approved|certified|compliant|authorized|trusted)\\b/i);
}

assert.deepEqual(
  semanticState.reviewer_questions.map((value) => value.text),
  [...institutionalArtifactV0_1.reviewerQuestions]
);
assert.deepEqual(institutionalArtifactV0_1.profileIds, [
  "mesr.profile.developer.phase3a_v0_1",
  "mesr.profile.audit_assurance.phase3a_v0_1"
]);

assert.equal(read("packages/guard-core/src/index.ts").includes("institutionalArtifact"), false);
assert.equal(read("packages/guard/package.json").includes("institutional-artifact"), false);

const packageJson = readJson("package.json");
assert.equal(
  packageJson.scripts["verify:v8:institutional-artifact-readiness"],
  "node scripts/verify_v8_institutional_artifact_readiness.mjs"
);
assert.doesNotMatch(
  packageJson.scripts.verify,
  /institutional-artifact-readiness/,
  "global verify must not auto-include the Phase 3A verifier"
);

console.log("V8 Phase 3A institutional artifact readiness: PASS");
console.log(`source case: ${first.source_case.case_id} (${first.source_case.evidence_classification})`);
console.log(`semantic snapshot sha256: ${first.semantic_snapshot_sha256}`);
console.log("Developer/Audit semantic invariance: PASS");
console.log("provenance chains: supported_claim, explicit_nonclaim, missing_or_indeterminate");
console.log("external institutional reviewer evidence: NOT RUN");
console.log("Gate 3: READY FOR EXTERNAL REVIEW; PASS = NO");
