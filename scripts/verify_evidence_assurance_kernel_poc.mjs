import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildProductionEvidenceReadinessReviewPreview,
  evaluateEvidenceAssuranceKernel,
  mapEvidenceAssuranceToLocalGovernancePreview,
} from "../packages/guard-core/src/evidenceAssuranceKernel.ts";
import { createExperiment0Cases } from "./fixtures/evidence_assurance_experiment_0_cases.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const packageJsonPath = path.join(repoRoot, "package.json");
const guardCoreIndexPath = path.join(repoRoot, "packages", "guard-core", "src", "index.ts");
const mappingPreviewFixturePath = path.join(
  repoRoot,
  "scripts",
  "fixtures",
  "local_governance_mapping_preview.case-e.json",
);
const reviewPreviewFixturePath = path.join(
  repoRoot,
  "scripts",
  "fixtures",
  "production_evidence_readiness_review_preview.case-c.json",
);

const cases = createExperiment0Cases();

verifyRepositoryBoundary();
verifyCaseACompleteBoundedEvidence();
verifyCaseBStructuralMissingEvidence();
verifyCaseCConclusionSpecificMissingEvidence();
verifyCaseDDeclaredOnlyEvidence();
verifyCaseEContradictoryEvidence();
verifyCaseFIntegrityValidTruthUnsupported();
verifyCaseGDeterministicRerun();
verifyCaseHNotApplicableEvidence();
verifyGovernanceMappingPreview();
verifyReviewPacketPreview();

console.log("PASS: bounded evidence assurance kernel poc verified");

function verifyRepositoryBoundary() {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  assert.equal(
    packageJson.scripts["verify:evidence-assurance-kernel:poc"],
    "node scripts/verify_evidence_assurance_kernel_poc.mjs",
  );

  const guardCoreIndex = fs.readFileSync(guardCoreIndexPath, "utf8");
  assert.equal(guardCoreIndex.includes("evidenceAssuranceKernel"), false);
}

function verifyCaseACompleteBoundedEvidence() {
  const result = evaluateEvidenceAssuranceKernel(cases.caseA_complete_bounded_evidence);
  const overall = supportabilityById(result, "overall_production_evidence_readiness");

  assert.equal(overall.supportability, "supported");
  assert.equal(result.structural_missing_evidence.length, 0);
  assert.equal(result.conclusion_specific_missing_evidence.length, 0);
  assert.equal(result.contradictions.length, 0);
  assert.ok(result.residual_uncertainty.length >= 1);
  assert.ok(
    result.residual_uncertainty.some((entry) =>
      entry.summary.includes("outcome verification remains absent"),
    ),
  );
}

function verifyCaseBStructuralMissingEvidence() {
  const result = evaluateEvidenceAssuranceKernel(cases.caseB_structural_missing_evidence);
  const overall = supportabilityById(result, "overall_production_evidence_readiness");

  assert.equal(overall.supportability, "insufficient_evidence");
  assert.ok(result.structural_missing_evidence.length >= 1);
  assert.equal(result.conclusion_specific_missing_evidence.length, 0);
  assert.ok(
    result.structural_missing_evidence.some((entry) => entry.family_id === "provenance_integrity"),
  );
}

function verifyCaseCConclusionSpecificMissingEvidence() {
  const result = evaluateEvidenceAssuranceKernel(cases.caseC_conclusion_specific_missing_evidence);
  const overall = supportabilityById(result, "overall_production_evidence_readiness");
  const runtimeSupportability = supportabilityById(result, "runtime_behavior");

  assert.equal(overall.supportability, "insufficient_evidence");
  assert.equal(result.structural_missing_evidence.length, 0);
  assert.ok(result.conclusion_specific_missing_evidence.length >= 1);
  assert.equal(runtimeSupportability.supportability, "insufficient_evidence");
  assert.ok(
    result.conclusion_specific_missing_evidence.some((entry) =>
      entry.summary.includes("runtime or staging evidence is applicable"),
    ),
  );
}

function verifyCaseDDeclaredOnlyEvidence() {
  const result = evaluateEvidenceAssuranceKernel(cases.caseD_declared_only_evidence);
  const authorityItem = result.evidence_items.find((item) => item.family_id === "authority_scope");
  const authoritySupportability = supportabilityById(result, "authority_scope");
  const overall = supportabilityById(result, "overall_production_evidence_readiness");

  assert.ok(authorityItem);
  assert.equal(authorityItem.independence_posture, "declared_only");
  assert.equal(authoritySupportability.supportability, "insufficient_evidence");
  assert.equal(overall.supportability, "insufficient_evidence");
  assert.ok(
    result.conclusion_specific_missing_evidence.some((entry) =>
      entry.summary.includes("declared-only"),
    ),
  );
}

function verifyCaseEContradictoryEvidence() {
  const result = evaluateEvidenceAssuranceKernel(cases.caseE_contradictory_evidence);
  const overall = supportabilityById(result, "overall_production_evidence_readiness");

  assert.equal(overall.supportability, "contradicted");
  assert.ok(result.contradictions.length >= 1);
  assert.ok(
    result.contradictions.some((entry) =>
      entry.evidence_refs.includes("ver_ai_pr_low_risk_complete_002") &&
      entry.evidence_refs.includes("evidence://assurance-report-ci-contradiction/build"),
    ),
  );
}

function verifyCaseFIntegrityValidTruthUnsupported() {
  const result = evaluateEvidenceAssuranceKernel(cases.caseF_integrity_valid_truth_unsupported);
  const overall = supportabilityById(result, "overall_production_evidence_readiness");
  const runtimeSupportability = supportabilityById(result, "runtime_behavior");
  const runtimeEvidenceItems = result.evidence_items.filter((item) => item.family_id === "runtime_behavior");

  assert.equal(runtimeSupportability.supportability, "unsupported");
  assert.equal(overall.supportability, "unsupported");
  assert.ok(runtimeEvidenceItems.length >= 2);
  assert.ok(runtimeEvidenceItems.every((item) => item.integrity_posture === "bound"));
  assert.ok(runtimeEvidenceItems.some((item) => item.independence_posture === "independently_verified"));
  assert.ok(
    result.residual_uncertainty.some((entry) =>
      entry.summary.includes("real-world runtime truth remains unsupported"),
    ),
  );
  assert.ok(
    result.residual_uncertainty.some((entry) =>
      entry.summary.includes("does not establish the truth"),
    ),
  );
}

function verifyCaseGDeterministicRerun() {
  const first = evaluateEvidenceAssuranceKernel(cases.caseG_deterministic_rerun);
  const second = evaluateEvidenceAssuranceKernel(cases.caseG_deterministic_rerun);

  assert.deepStrictEqual(first, second);
  assert.equal(first.integrity.result_hash, second.integrity.result_hash);
  assert.equal(first.determinism_metadata.input_hash, second.determinism_metadata.input_hash);
}

function verifyCaseHNotApplicableEvidence() {
  const result = evaluateEvidenceAssuranceKernel(cases.caseH_not_applicable_evidence);
  const runtimeRequirement = result.family_requirements.find(
    (entry) => entry.family_id === "runtime_behavior",
  );
  const runtimeSupportability = supportabilityById(result, "runtime_behavior");
  const overall = supportabilityById(result, "overall_production_evidence_readiness");

  assert.ok(runtimeRequirement);
  assert.equal(runtimeRequirement.applicability, "not_applicable");
  assert.equal(runtimeSupportability.supportability, "inadmissible");
  assert.equal(overall.supportability, "supported");
  assert.equal(
    result.structural_missing_evidence.some((entry) => entry.family_id === "runtime_behavior"),
    false,
  );
  assert.equal(
    result.conclusion_specific_missing_evidence.some((entry) => entry.family_id === "runtime_behavior"),
    false,
  );
}

function verifyGovernanceMappingPreview() {
  const result = evaluateEvidenceAssuranceKernel(cases.caseE_contradictory_evidence);
  const preview = mapEvidenceAssuranceToLocalGovernancePreview(result);
  const expected = JSON.parse(fs.readFileSync(mappingPreviewFixturePath, "utf8"));

  assert.equal(preview.default_off, true);
  assert.equal(preview.public_contract_changed, false);
  assert.ok(
    preview.governance_reasoning_inputs.reason_codes.includes("kernel:contradiction_visible"),
  );
  assert.deepStrictEqual(preview, expected);
}

function verifyReviewPacketPreview() {
  const result = evaluateEvidenceAssuranceKernel(cases.caseC_conclusion_specific_missing_evidence);
  const preview = buildProductionEvidenceReadinessReviewPreview(result);
  const expected = JSON.parse(fs.readFileSync(reviewPreviewFixturePath, "utf8"));

  assert.ok(preview.evidence_inventory.length >= 1);
  assert.ok(preview.source_map.length >= 1);
  assert.ok(preview.verification_posture.length >= 1);
  assert.ok(preview.missing_evidence.some((entry) => entry.family_id === "runtime_behavior"));
  assert.deepStrictEqual(preview, expected);
}

function supportabilityById(result, conclusionId) {
  const match = result.supportability.find((entry) => entry.conclusion_id === conclusionId);
  assert.ok(match, `missing supportability entry for ${conclusionId}`);
  return match;
}
