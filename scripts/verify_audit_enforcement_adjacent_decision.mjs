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
  validateEnforcementAdjacentDecisionRecord,
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
const readinessActionOut = path.join(tmp, "mindforge-guard-enforcement-decision-action-a.json");
const readinessPolicyOut = path.join(tmp, "mindforge-guard-enforcement-decision-policy-a.json");
const readinessPermitOut = path.join(tmp, "mindforge-guard-enforcement-decision-permit-a.json");
const readinessBridgeOut = path.join(tmp, "mindforge-guard-enforcement-decision-bridge-a.json");
const readinessOut = path.join(tmp, "mindforge-guard-enforcement-decision-readiness-a.json");
const fullActionOutA = path.join(tmp, "mindforge-guard-enforcement-decision-action-b.json");
const fullPolicyOutA = path.join(tmp, "mindforge-guard-enforcement-decision-policy-b.json");
const fullPermitOutA = path.join(tmp, "mindforge-guard-enforcement-decision-permit-b.json");
const fullBridgeOutA = path.join(tmp, "mindforge-guard-enforcement-decision-bridge-b.json");
const fullReadinessOutA = path.join(tmp, "mindforge-guard-enforcement-decision-readiness-b.json");
const decisionOutA = path.join(tmp, "mindforge-guard-enforcement-decision-a.json");
const fullActionOutB = path.join(tmp, "mindforge-guard-enforcement-decision-action-c.json");
const fullPolicyOutB = path.join(tmp, "mindforge-guard-enforcement-decision-policy-c.json");
const fullPermitOutB = path.join(tmp, "mindforge-guard-enforcement-decision-permit-c.json");
const fullBridgeOutB = path.join(tmp, "mindforge-guard-enforcement-decision-bridge-c.json");
const fullReadinessOutB = path.join(tmp, "mindforge-guard-enforcement-decision-readiness-c.json");
const decisionOutB = path.join(tmp, "mindforge-guard-enforcement-decision-b.json");

for (const filePath of [
  readinessActionOut,
  readinessPolicyOut,
  readinessPermitOut,
  readinessBridgeOut,
  readinessOut,
  fullActionOutA,
  fullPolicyOutA,
  fullPermitOutA,
  fullBridgeOutA,
  fullReadinessOutA,
  decisionOutA,
  fullActionOutB,
  fullPolicyOutB,
  fullPermitOutB,
  fullBridgeOutB,
  fullReadinessOutB,
  decisionOutB,
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

const readinessOnly = await runAudit({
  repoRoot,
  argv: [
    ".",
    "--staged",
    "--emit-canonical-action",
    `--canonical-action-out=${readinessActionOut}`,
    "--emit-policy-preview",
    `--policy-preview-out=${readinessPolicyOut}`,
    "--emit-permit-precheck-preview",
    `--permit-precheck-out=${readinessPermitOut}`,
    "--emit-execution-bridge-preview",
    `--execution-bridge-out=${readinessBridgeOut}`,
    "--emit-execution-readiness",
    `--execution-readiness-out=${readinessOut}`,
  ],
  policy,
});

const decisionA = await runAudit({
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
    `--execution-readiness-out=${fullReadinessOutA}`,
    "--emit-enforcement-adjacent-decision",
    `--enforcement-adjacent-decision-out=${decisionOutA}`,
  ],
  policy,
});

const decisionB = await runAudit({
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
    `--execution-readiness-out=${fullReadinessOutB}`,
    "--emit-enforcement-adjacent-decision",
    `--enforcement-adjacent-decision-out=${decisionOutB}`,
  ],
  policy,
});

for (const result of [baseline, readinessOnly, decisionA, decisionB]) {
  if (!result?.audit) {
    throw new Error(`audit run failed: ${result?.message || "unknown"}`);
  }
}

const normalizedBaseline = JSON.stringify(normalizeAudit(baseline.audit));
if (normalizedBaseline !== JSON.stringify(normalizeAudit(readinessOnly.audit))) {
  throw new Error("execution readiness baseline changed the audit main output");
}
if (normalizedBaseline !== JSON.stringify(normalizeAudit(decisionA.audit))) {
  throw new Error("enforcement-adjacent decision changed the audit main output");
}

const readinessActionArtifact = readJson(readinessActionOut);
const readinessPolicyArtifact = readJson(readinessPolicyOut);
const readinessPermitArtifact = readJson(readinessPermitOut);
const readinessBridgeArtifact = readJson(readinessBridgeOut);
const readinessArtifact = readJson(readinessOut);
const actionArtifactA = readJson(fullActionOutA);
const policyArtifactA = readJson(fullPolicyOutA);
const permitArtifactA = readJson(fullPermitOutA);
const bridgeArtifactA = readJson(fullBridgeOutA);
const readinessArtifactA = readJson(fullReadinessOutA);
const decisionArtifactA = readJson(decisionOutA);
const actionArtifactB = readJson(fullActionOutB);
const policyArtifactB = readJson(fullPolicyOutB);
const permitArtifactB = readJson(fullPermitOutB);
const bridgeArtifactB = readJson(fullBridgeOutB);
const readinessArtifactB = readJson(fullReadinessOutB);
const decisionArtifactB = readJson(decisionOutB);

const validations = [
  validateCanonicalActionArtifact(readinessActionArtifact),
  validateCanonicalActionArtifact(actionArtifactA),
  validateCanonicalActionArtifact(actionArtifactB),
  validateCanonicalActionPolicyPreview(readinessPolicyArtifact),
  validateCanonicalActionPolicyPreview(policyArtifactA),
  validateCanonicalActionPolicyPreview(policyArtifactB),
  validatePermitPrecheckPreview(readinessPermitArtifact),
  validatePermitPrecheckPreview(permitArtifactA),
  validatePermitPrecheckPreview(permitArtifactB),
  validateExecutionBridgePreview(readinessBridgeArtifact),
  validateExecutionBridgePreview(bridgeArtifactA),
  validateExecutionBridgePreview(bridgeArtifactB),
  validateExecutionReadinessJudgment(readinessArtifact),
  validateExecutionReadinessJudgment(readinessArtifactA),
  validateExecutionReadinessJudgment(readinessArtifactB),
  validateEnforcementAdjacentDecisionRecord(decisionArtifactA),
  validateEnforcementAdjacentDecisionRecord(decisionArtifactB),
];

for (const result of validations) {
  if (!result.ok) {
    throw new Error(`enforcement-adjacent decision validation failed: ${result.errors.join("; ")}`);
  }
}

if (JSON.stringify(readinessActionArtifact) !== JSON.stringify(actionArtifactA)) {
  throw new Error("enforcement-adjacent decision changed canonical action shadow output");
}
if (JSON.stringify(readinessPolicyArtifact) !== JSON.stringify(policyArtifactA)) {
  throw new Error("enforcement-adjacent decision changed policy preview output");
}
if (JSON.stringify(readinessPermitArtifact) !== JSON.stringify(permitArtifactA)) {
  throw new Error("enforcement-adjacent decision changed permit precheck preview output");
}
if (JSON.stringify(readinessBridgeArtifact) !== JSON.stringify(bridgeArtifactA)) {
  throw new Error("enforcement-adjacent decision changed execution bridge preview output");
}
if (JSON.stringify(readinessArtifact) !== JSON.stringify(readinessArtifactA)) {
  throw new Error("enforcement-adjacent decision changed execution readiness output");
}
if (decisionArtifactA.enforcing !== false || decisionArtifactB.enforcing !== false) {
  throw new Error("enforcement-adjacent decision record must be non-enforcing");
}
if (JSON.stringify(decisionArtifactA) !== JSON.stringify(decisionArtifactB)) {
  throw new Error("enforcement-adjacent decision record is not stable across repeated runs");
}

process.stdout.write("audit enforcement-adjacent decision verified\n");
