import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { loadPolicy } from "../packages/guard/src/kernelCompat.mjs";
import { runAudit } from "../packages/guard/src/runAudit.mjs";
import {
  validateCanonicalActionArtifact,
  validateCanonicalActionPolicyPreview,
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

const actionOutA = path.join(os.tmpdir(), "mindforge-guard-policy-preview-action-a.json");
const actionOutB = path.join(os.tmpdir(), "mindforge-guard-policy-preview-action-b.json");
const previewOutA = path.join(os.tmpdir(), "mindforge-guard-policy-preview-a.json");
const previewOutB = path.join(os.tmpdir(), "mindforge-guard-policy-preview-b.json");

for (const filePath of [actionOutA, actionOutB, previewOutA, previewOutB]) {
  try {
    fs.unlinkSync(filePath);
  } catch {}
}

const baseline = await runAudit({
  repoRoot,
  argv: [".", "--staged"],
  policy,
});

const actionOnly = await runAudit({
  repoRoot,
  argv: [".", "--staged", "--emit-canonical-action", `--canonical-action-out=${actionOutA}`],
  policy,
});

const previewA = await runAudit({
  repoRoot,
  argv: [
    ".",
    "--staged",
    "--emit-canonical-action",
    `--canonical-action-out=${actionOutB}`,
    "--emit-policy-preview",
    `--policy-preview-out=${previewOutA}`,
  ],
  policy,
});

const previewB = await runAudit({
  repoRoot,
  argv: [
    ".",
    "--staged",
    "--emit-canonical-action",
    `--canonical-action-out=${path.join(os.tmpdir(), "mindforge-guard-policy-preview-action-c.json")}`,
    "--emit-policy-preview",
    `--policy-preview-out=${previewOutB}`,
  ],
  policy,
});

for (const result of [baseline, actionOnly, previewA, previewB]) {
  if (!result?.audit) {
    throw new Error(`audit run failed: ${result?.message || "unknown"}`);
  }
}

const normalizedBaseline = JSON.stringify(normalizeAudit(baseline.audit));
if (normalizedBaseline !== JSON.stringify(normalizeAudit(actionOnly.audit))) {
  throw new Error("canonical action shadow changed the audit main output");
}
if (normalizedBaseline !== JSON.stringify(normalizeAudit(previewA.audit))) {
  throw new Error("policy preview changed the audit main output");
}

const actionArtifactA = readJson(actionOutA);
const actionArtifactB = readJson(actionOutB);
const previewArtifactA = readJson(previewOutA);
const previewArtifactB = readJson(previewOutB);

const actionValidationA = validateCanonicalActionArtifact(actionArtifactA);
const actionValidationB = validateCanonicalActionArtifact(actionArtifactB);
const previewValidationA = validateCanonicalActionPolicyPreview(previewArtifactA);
const previewValidationB = validateCanonicalActionPolicyPreview(previewArtifactB);

if (!actionValidationA.ok) {
  throw new Error(`canonical action shadow invalid: ${actionValidationA.errors.join("; ")}`);
}
if (!actionValidationB.ok) {
  throw new Error(`canonical action shadow with preview invalid: ${actionValidationB.errors.join("; ")}`);
}
if (!previewValidationA.ok) {
  throw new Error(`policy preview invalid: ${previewValidationA.errors.join("; ")}`);
}
if (!previewValidationB.ok) {
  throw new Error(`policy preview repeat invalid: ${previewValidationB.errors.join("; ")}`);
}

if (JSON.stringify(actionArtifactA) !== JSON.stringify(actionArtifactB)) {
  throw new Error("policy preview changed canonical action shadow output");
}

if (previewArtifactA.enforcing !== false || previewArtifactB.enforcing !== false) {
  throw new Error("policy preview must be non-enforcing");
}

if (JSON.stringify(previewArtifactA) !== JSON.stringify(previewArtifactB)) {
  throw new Error("policy preview artifact is not stable across repeated runs");
}

process.stdout.write("audit canonical policy preview verified\n");
