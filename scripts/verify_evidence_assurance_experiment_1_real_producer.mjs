import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildProductionEvidenceReadinessReviewPreview, evaluateEvidenceAssuranceKernel } from "../packages/guard-core/src/evidenceAssuranceKernel.ts";
import { createExperiment1RealCases } from "./fixtures/evidence_assurance_experiment_1_real_cases.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cases = createExperiment1RealCases();
const ci = evaluateEvidenceAssuranceKernel(cases.github_actions);
const deployment = evaluateEvidenceAssuranceKernel(cases.github_deployment);
const combined = evaluateEvidenceAssuranceKernel(cases.combined);

assert.equal(cases.evidence.classification, "REAL PRODUCER EVIDENCE / SANITIZED");
assert.equal(cases.evidence.github_actions.artifact_expired, true);
assert.equal(cases.evidence.github_actions.artifact_downloadable, false);
assert.notEqual(cases.evidence.github_actions.commit_sha, cases.evidence.github_deployment.commit_sha);
assert.deepStrictEqual(combined, evaluateEvidenceAssuranceKernel(cases.combined));
assert.ok(ci.residual_uncertainty.length > 0);
assert.ok(deployment.residual_uncertainty.length > 0);
assert.ok(cases.combined.external_assurance_reports.every((report) => report.missing_evidence.length > 0));
assert.ok(combined.residual_uncertainty.length > 0);
const reviewPreview = buildProductionEvidenceReadinessReviewPreview(combined);
assert.ok(reviewPreview.evidence_inventory.length > 0);
assert.ok(reviewPreview.source_map.length >= 3);
assert.ok(reviewPreview.residual_uncertainty.length > 0);
const kernel = fs.readFileSync(path.join(root, "packages/guard-core/src/evidenceAssuranceKernel.ts"), "utf8");
assert.equal(/github_actions|github deployment|vercel/i.test(kernel), false);
console.log("PASS: Experiment 1 real producer dry run verified");
