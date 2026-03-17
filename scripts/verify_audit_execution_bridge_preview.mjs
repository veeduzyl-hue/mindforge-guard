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
const baselineActionOut = path.join(tmp, "mindforge-guard-execution-bridge-action-a.json");
const baselinePolicyOut = path.join(tmp, "mindforge-guard-execution-bridge-policy-a.json");
const baselinePermitOut = path.join(tmp, "mindforge-guard-execution-bridge-permit-a.json");
const fullActionOutA = path.join(tmp, "mindforge-guard-execution-bridge-action-b.json");
const fullPolicyOutA = path.join(tmp, "mindforge-guard-execution-bridge-policy-b.json");
const fullPermitOutA = path.join(tmp, "mindforge-guard-execution-bridge-permit-b.json");
const fullBridgeOutA = path.join(tmp, "mindforge-guard-execution-bridge-a.json");
const fullActionOutB = path.join(tmp, "mindforge-guard-execution-bridge-action-c.json");
const fullPolicyOutB = path.join(tmp, "mindforge-guard-execution-bridge-policy-c.json");
const fullPermitOutB = path.join(tmp, "mindforge-guard-execution-bridge-permit-c.json");
const fullBridgeOutB = path.join(tmp, "mindforge-guard-execution-bridge-b.json");

for (const filePath of [
  baselineActionOut,
  baselinePolicyOut,
  baselinePermitOut,
  fullActionOutA,
  fullPolicyOutA,
  fullPermitOutA,
  fullBridgeOutA,
  fullActionOutB,
  fullPolicyOutB,
  fullPermitOutB,
  fullBridgeOutB,
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

const permitOnly = await runAudit({
  repoRoot,
  argv: [
    ".",
    "--staged",
    "--emit-canonical-action",
    `--canonical-action-out=${baselineActionOut}`,
    "--emit-policy-preview",
    `--policy-preview-out=${baselinePolicyOut}`,
    "--emit-permit-precheck-preview",
    `--permit-precheck-out=${baselinePermitOut}`,
  ],
  policy,
});

const bridgeA = await runAudit({
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
  ],
  policy,
});

const bridgeB = await runAudit({
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
  ],
  policy,
});

for (const result of [baseline, permitOnly, bridgeA, bridgeB]) {
  if (!result?.audit) {
    throw new Error(`audit run failed: ${result?.message || "unknown"}`);
  }
}

const normalizedBaseline = JSON.stringify(normalizeAudit(baseline.audit));
if (normalizedBaseline !== JSON.stringify(normalizeAudit(permitOnly.audit))) {
  throw new Error("permit precheck preview baseline changed the audit main output");
}
if (normalizedBaseline !== JSON.stringify(normalizeAudit(bridgeA.audit))) {
  throw new Error("execution bridge preview changed the audit main output");
}

const baselineActionArtifact = readJson(baselineActionOut);
const baselinePolicyArtifact = readJson(baselinePolicyOut);
const baselinePermitArtifact = readJson(baselinePermitOut);
const actionArtifactA = readJson(fullActionOutA);
const policyArtifactA = readJson(fullPolicyOutA);
const permitArtifactA = readJson(fullPermitOutA);
const bridgeArtifactA = readJson(fullBridgeOutA);
const actionArtifactB = readJson(fullActionOutB);
const policyArtifactB = readJson(fullPolicyOutB);
const permitArtifactB = readJson(fullPermitOutB);
const bridgeArtifactB = readJson(fullBridgeOutB);

const validations = [
  validateCanonicalActionArtifact(baselineActionArtifact),
  validateCanonicalActionArtifact(actionArtifactA),
  validateCanonicalActionArtifact(actionArtifactB),
  validateCanonicalActionPolicyPreview(baselinePolicyArtifact),
  validateCanonicalActionPolicyPreview(policyArtifactA),
  validateCanonicalActionPolicyPreview(policyArtifactB),
  validatePermitPrecheckPreview(baselinePermitArtifact),
  validatePermitPrecheckPreview(permitArtifactA),
  validatePermitPrecheckPreview(permitArtifactB),
  validateExecutionBridgePreview(bridgeArtifactA),
  validateExecutionBridgePreview(bridgeArtifactB),
];

for (const result of validations) {
  if (!result.ok) {
    throw new Error(`execution bridge preview validation failed: ${result.errors.join("; ")}`);
  }
}

if (JSON.stringify(baselineActionArtifact) !== JSON.stringify(actionArtifactA)) {
  throw new Error("execution bridge preview changed canonical action shadow output");
}
if (JSON.stringify(baselinePolicyArtifact) !== JSON.stringify(policyArtifactA)) {
  throw new Error("execution bridge preview changed policy preview output");
}
if (JSON.stringify(baselinePermitArtifact) !== JSON.stringify(permitArtifactA)) {
  throw new Error("execution bridge preview changed permit precheck preview output");
}
if (bridgeArtifactA.enforcing !== false || bridgeArtifactB.enforcing !== false) {
  throw new Error("execution bridge preview must be non-enforcing");
}
if (JSON.stringify(bridgeArtifactA) !== JSON.stringify(bridgeArtifactB)) {
  throw new Error("execution bridge preview is not stable across repeated runs");
}

process.stdout.write("audit execution bridge preview verified\n");
