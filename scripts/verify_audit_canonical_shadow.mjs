import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { loadPolicy } from "../packages/guard/src/kernelCompat.mjs";
import { runAudit } from "../packages/guard/src/runAudit.mjs";
import { validateCanonicalActionArtifact } from "../packages/guard/src/runtime/actions/index.mjs";

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

const shadowOutA = path.join(os.tmpdir(), "mindforge-guard-canonical-action-a.json");
const shadowOutB = path.join(os.tmpdir(), "mindforge-guard-canonical-action-b.json");

for (const filePath of [shadowOutA, shadowOutB]) {
  try {
    fs.unlinkSync(filePath);
  } catch {}
}

const baseline = await runAudit({
  repoRoot,
  argv: [".", "--staged"],
  policy,
});

if (!baseline?.audit) {
  throw new Error(`baseline audit failed: ${baseline?.message || "unknown"}`);
}

const shadowA = await runAudit({
  repoRoot,
  argv: [".", "--staged", "--emit-canonical-action", `--canonical-action-out=${shadowOutA}`],
  policy,
});

const shadowB = await runAudit({
  repoRoot,
  argv: [".", "--staged", "--emit-canonical-action", `--canonical-action-out=${shadowOutB}`],
  policy,
});

for (const result of [shadowA, shadowB]) {
  if (!result?.audit) {
    throw new Error(`shadow audit failed: ${result?.message || "unknown"}`);
  }
}

if (JSON.stringify(normalizeAudit(baseline.audit)) !== JSON.stringify(normalizeAudit(shadowA.audit))) {
  throw new Error("opt-in canonical shadow changed the audit main output");
}

const artifactA = readJson(shadowOutA);
const artifactB = readJson(shadowOutB);
const validationA = validateCanonicalActionArtifact(artifactA);
const validationB = validateCanonicalActionArtifact(artifactB);

if (!validationA.ok) {
  throw new Error(`first shadow artifact invalid: ${validationA.errors.join("; ")}`);
}

if (!validationB.ok) {
  throw new Error(`second shadow artifact invalid: ${validationB.errors.join("; ")}`);
}

if (JSON.stringify(artifactA) !== JSON.stringify(artifactB)) {
  throw new Error("shadow artifact is not stable across repeated runs");
}

process.stdout.write("audit canonical shadow verified\n");
