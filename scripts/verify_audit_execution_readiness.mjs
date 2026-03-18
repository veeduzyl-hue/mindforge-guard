import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { loadPolicy } from "../packages/guard/src/kernelCompat.mjs";
import { runAudit } from "../packages/guard/src/runAudit.mjs";
import {
  validateCanonicalActionArtifact,
  validateCanonicalActionPolicyPreview,
  validatePermitPrecheckPreview,
  validateExecutionBridgePreview,
  validateExecutionReadinessJudgment,
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

const tmp = os.tmpdir();
const bridgeActionOut = path.join(tmp, "mindforge-guard-execution-readiness-action-a.json");
const bridgePolicyOut = path.join(tmp, "mindforge-guard-execution-readiness-policy-a.json");
const bridgePermitOut = path.join(tmp, "mindforge-guard-execution-readiness-permit-a.json");
const bridgeOut = path.join(tmp, "mindforge-guard-execution-readiness-bridge-a.json");
const fullActionOutA = path.join(tmp, "mindforge-guard-execution-readiness-action-b.json");
const fullPolicyOutA = path.join(tmp, "mindforge-guard-execution-readiness-policy-b.json");
const fullPermitOutA = path.join(tmp, "mindforge-guard-execution-readiness-permit-b.json");
const fullBridgeOutA = path.join(tmp, "mindforge-guard-execution-readiness-bridge-b.json");
const readinessOutA = path.join(tmp, "mindforge-guard-execution-readiness-a.json");
const fullActionOutB = path.join(tmp, "mindforge-guard-execution-readiness-action-c.json");
const fullPolicyOutB = path.join(tmp, "mindforge-guard-execution-readiness-policy-c.json");
const fullPermitOutB = path.join(tmp, "mindforge-guard-execution-readiness-permit-c.json");
const fullBridgeOutB = path.join(tmp, "mindforge-guard-execution-readiness-bridge-c.json");
const readinessOutB = path.join(tmp, "mindforge-guard-execution-readiness-b.json");

for (const filePath of [
  bridgeActionOut,
  bridgePolicyOut,
  bridgePermitOut,
  bridgeOut,
  fullActionOutA,
  fullPolicyOutA,
  fullPermitOutA,
  fullBridgeOutA,
  readinessOutA,
  fullActionOutB,
  fullPolicyOutB,
  fullPermitOutB,
  fullBridgeOutB,
  readinessOutB,
]) {
  try {
    fs.unlinkSync(filePath);
  } catch {}
}

const baseline = await runAudit({
  repoRoot,
  argv: [".", "--staged"],
  policy,
});

const bridgeOnly = await runAudit({
  repoRoot,
  argv: [
    ".",
    "--staged",
    "--emit-canonical-action",
    `--canonical-action-out=${bridgeActionOut}`,
    "--emit-policy-preview",
    `--policy-preview-out=${bridgePolicyOut}`,
    "--emit-permit-precheck-preview",
    `--permit-precheck-out=${bridgePermitOut}`,
    "--emit-execution-bridge-preview",
    `--execution-bridge-out=${bridgeOut}`,
  ],
  policy,
});

const readinessA = await runAudit({
  repoRoot,
  argv: [
    ".",
    "--staged",
    "--emit-canonical-action",
    `--canonical-action-out=${fullActionOutA}`,
    "--emit-policy-preview",
    `--policy-preview-out=${fullPolicyOutA}`,
    "--emit-permit-precheck-preview",
    `--permit-precheck-out=${fullPermitOutA}`,
    "--emit-execution-bridge-preview",
    `--execution-bridge-out=${fullBridgeOutA}`,
    "--emit-execution-readiness",
    `--execution-readiness-out=${readinessOutA}`,
  ],
  policy,
});

const readinessB = await runAudit({
  repoRoot,
  argv: [
    ".",
    "--staged",
    "--emit-canonical-action",
    `--canonical-action-out=${fullActionOutB}`,
    "--emit-policy-preview",
    `--policy-preview-out=${fullPolicyOutB}`,
    "--emit-permit-precheck-preview",
    `--permit-precheck-out=${fullPermitOutB}`,
    "--emit-execution-bridge-preview",
    `--execution-bridge-out=${fullBridgeOutB}`,
    "--emit-execution-readiness",
    `--execution-readiness-out=${readinessOutB}`,
  ],
  policy,
});

for (const result of [baseline, bridgeOnly, readinessA, readinessB]) {
  if (!result?.audit) {
    throw new Error(`audit run failed: ${result?.message || "unknown"}`);
  }
}

const normalizedBaseline = JSON.stringify(normalizeAudit(baseline.audit));
if (normalizedBaseline !== JSON.stringify(normalizeAudit(bridgeOnly.audit))) {
  throw new Error("execution bridge preview baseline changed the audit main output");
}
if (normalizedBaseline !== JSON.stringify(normalizeAudit(readinessA.audit))) {
  throw new Error("execution readiness judgment changed the audit main output");
}

const bridgeActionArtifact = readJson(bridgeActionOut);
const bridgePolicyArtifact = readJson(bridgePolicyOut);
const bridgePermitArtifact = readJson(bridgePermitOut);
const bridgeArtifact = readJson(bridgeOut);
const actionArtifactA = readJson(fullActionOutA);
const policyArtifactA = readJson(fullPolicyOutA);
const permitArtifactA = readJson(fullPermitOutA);
const bridgeArtifactA = readJson(fullBridgeOutA);
const readinessArtifactA = readJson(readinessOutA);
const actionArtifactB = readJson(fullActionOutB);
const policyArtifactB = readJson(fullPolicyOutB);
const permitArtifactB = readJson(fullPermitOutB);
const bridgeArtifactB = readJson(fullBridgeOutB);
const readinessArtifactB = readJson(readinessOutB);

const validations = [
  validateCanonicalActionArtifact(bridgeActionArtifact),
  validateCanonicalActionArtifact(actionArtifactA),
  validateCanonicalActionArtifact(actionArtifactB),
  validateCanonicalActionPolicyPreview(bridgePolicyArtifact),
  validateCanonicalActionPolicyPreview(policyArtifactA),
  validateCanonicalActionPolicyPreview(policyArtifactB),
  validatePermitPrecheckPreview(bridgePermitArtifact),
  validatePermitPrecheckPreview(permitArtifactA),
  validatePermitPrecheckPreview(permitArtifactB),
  validateExecutionBridgePreview(bridgeArtifact),
  validateExecutionBridgePreview(bridgeArtifactA),
  validateExecutionBridgePreview(bridgeArtifactB),
  validateExecutionReadinessJudgment(readinessArtifactA),
  validateExecutionReadinessJudgment(readinessArtifactB),
];

for (const result of validations) {
  if (!result.ok) {
    throw new Error(`execution readiness validation failed: ${result.errors.join("; ")}`);
  }
}

if (JSON.stringify(bridgeActionArtifact) !== JSON.stringify(actionArtifactA)) {
  throw new Error("execution readiness changed canonical action shadow output");
}
if (JSON.stringify(bridgePolicyArtifact) !== JSON.stringify(policyArtifactA)) {
  throw new Error("execution readiness changed policy preview output");
}
if (JSON.stringify(bridgePermitArtifact) !== JSON.stringify(permitArtifactA)) {
  throw new Error("execution readiness changed permit precheck preview output");
}
if (JSON.stringify(bridgeArtifact) !== JSON.stringify(bridgeArtifactA)) {
  throw new Error("execution readiness changed execution bridge preview output");
}
if (readinessArtifactA.enforcing !== false || readinessArtifactB.enforcing !== false) {
  throw new Error("execution readiness judgment must be non-enforcing");
}
if (JSON.stringify(readinessArtifactA) !== JSON.stringify(readinessArtifactB)) {
  throw new Error("execution readiness judgment is not stable across repeated runs");
}

process.stdout.write("audit execution readiness verified\n");
