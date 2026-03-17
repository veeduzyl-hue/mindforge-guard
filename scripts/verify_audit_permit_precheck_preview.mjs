import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { loadPolicy } from "../packages/guard/src/kernelCompat.mjs";
import { runAudit } from "../packages/guard/src/runAudit.mjs";
import {
  validateCanonicalActionArtifact,
  validateCanonicalActionPolicyPreview,
  validatePermitPrecheckPreview,
} from "../packages/guard/src/runtime/actions/index.mjs";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeAudit(audit) {
  const copy = clone(audit);
  if (copy?.run) {
    copy.run.run_id = "<run_id>";
    copy.run.timestamp = "<timestamp>";
  }
  return copy;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

const repoRoot = process.cwd();
const policyPath = path.join(repoRoot, ".mindforge", "config", "policy.json");
const policy = await loadPolicy({ policyPath, repoRoot });

const actionOutA = path.join(os.tmpdir(), "mindforge-guard-permit-preview-action-a.json");
const actionOutB = path.join(os.tmpdir(), "mindforge-guard-permit-preview-action-b.json");
const previewOutA = path.join(os.tmpdir(), "mindforge-guard-permit-preview-policy-a.json");
const previewOutB = path.join(os.tmpdir(), "mindforge-guard-permit-preview-policy-b.json");
const permitOutA = path.join(os.tmpdir(), "mindforge-guard-permit-preview-a.json");
const permitOutB = path.join(os.tmpdir(), "mindforge-guard-permit-preview-b.json");

for (const filePath of [actionOutA, actionOutB, previewOutA, previewOutB, permitOutA, permitOutB]) {
  try {
    fs.unlinkSync(filePath);
  } catch {}
}

const baseline = await runAudit({
  repoRoot,
  argv: [".", "--staged"],
  policy,
});

const policyOnly = await runAudit({
  repoRoot,
  argv: [
    ".",
    "--staged",
    "--emit-canonical-action",
    `--canonical-action-out=${actionOutA}`,
    "--emit-policy-preview",
    `--policy-preview-out=${previewOutA}`,
  ],
  policy,
});

const permitA = await runAudit({
  repoRoot,
  argv: [
    ".",
    "--staged",
    "--emit-canonical-action",
    `--canonical-action-out=${actionOutB}`,
    "--emit-policy-preview",
    `--policy-preview-out=${previewOutB}`,
    "--emit-permit-precheck-preview",
    `--permit-precheck-out=${permitOutA}`,
  ],
  policy,
});

const permitB = await runAudit({
  repoRoot,
  argv: [
    ".",
    "--staged",
    "--emit-canonical-action",
    `--canonical-action-out=${path.join(os.tmpdir(), "mindforge-guard-permit-preview-action-c.json")}`,
    "--emit-policy-preview",
    `--policy-preview-out=${path.join(os.tmpdir(), "mindforge-guard-permit-preview-policy-c.json")}`,
    "--emit-permit-precheck-preview",
    `--permit-precheck-out=${permitOutB}`,
  ],
  policy,
});

for (const result of [baseline, policyOnly, permitA, permitB]) {
  if (!result?.audit) {
    throw new Error(`audit run failed: ${result?.message || "unknown"}`);
  }
}

const normalizedBaseline = JSON.stringify(normalizeAudit(baseline.audit));
if (normalizedBaseline !== JSON.stringify(normalizeAudit(policyOnly.audit))) {
  throw new Error("policy preview changed the audit main output");
}
if (normalizedBaseline !== JSON.stringify(normalizeAudit(permitA.audit))) {
  throw new Error("permit precheck preview changed the audit main output");
}

const actionArtifactA = readJson(actionOutA);
const actionArtifactB = readJson(actionOutB);
const policyArtifactA = readJson(previewOutA);
const policyArtifactB = readJson(previewOutB);
const permitArtifactA = readJson(permitOutA);
const permitArtifactB = readJson(permitOutB);

const actionValidationA = validateCanonicalActionArtifact(actionArtifactA);
const actionValidationB = validateCanonicalActionArtifact(actionArtifactB);
const policyValidationA = validateCanonicalActionPolicyPreview(policyArtifactA);
const policyValidationB = validateCanonicalActionPolicyPreview(policyArtifactB);
const permitValidationA = validatePermitPrecheckPreview(permitArtifactA);
const permitValidationB = validatePermitPrecheckPreview(permitArtifactB);

if (!actionValidationA.ok || !actionValidationB.ok) {
  throw new Error("permit precheck preview changed canonical action shadow validity");
}
if (!policyValidationA.ok || !policyValidationB.ok) {
  throw new Error("permit precheck preview changed policy preview validity");
}
if (!permitValidationA.ok) {
  throw new Error(`permit precheck preview invalid: ${permitValidationA.errors.join("; ")}`);
}
if (!permitValidationB.ok) {
  throw new Error(`permit precheck preview repeat invalid: ${permitValidationB.errors.join("; ")}`);
}

if (JSON.stringify(actionArtifactA) !== JSON.stringify(actionArtifactB)) {
  throw new Error("permit precheck preview changed canonical action shadow output");
}
if (JSON.stringify(policyArtifactA) !== JSON.stringify(policyArtifactB)) {
  throw new Error("permit precheck preview changed policy preview output");
}
if (permitArtifactA.enforcing !== false || permitArtifactB.enforcing !== false) {
  throw new Error("permit precheck preview must be non-enforcing");
}
if (JSON.stringify(permitArtifactA) !== JSON.stringify(permitArtifactB)) {
  throw new Error("permit precheck preview is not stable across repeated runs");
}

process.stdout.write("audit permit precheck preview verified\n");
