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
import { validatePolicyPermitBridgeContract } from "../packages/guard/src/runtime/governance/bridge/policyPermitBridge.mjs";

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
const decisionActionOut = path.join(tmp, "mindforge-guard-policy-permit-bridge-action-a.json");
const decisionPolicyOut = path.join(tmp, "mindforge-guard-policy-permit-bridge-policy-a.json");
const decisionPermitOut = path.join(tmp, "mindforge-guard-policy-permit-bridge-permit-a.json");
const decisionBridgeOut = path.join(tmp, "mindforge-guard-policy-permit-bridge-bridge-a.json");
const decisionReadinessOut = path.join(tmp, "mindforge-guard-policy-permit-bridge-readiness-a.json");
const decisionOut = path.join(tmp, "mindforge-guard-policy-permit-bridge-decision-a.json");
const fullActionOutA = path.join(tmp, "mindforge-guard-policy-permit-bridge-action-b.json");
const fullPolicyOutA = path.join(tmp, "mindforge-guard-policy-permit-bridge-policy-b.json");
const fullPermitOutA = path.join(tmp, "mindforge-guard-policy-permit-bridge-permit-b.json");
const fullBridgeOutA = path.join(tmp, "mindforge-guard-policy-permit-bridge-bridge-b.json");
const fullReadinessOutA = path.join(tmp, "mindforge-guard-policy-permit-bridge-readiness-b.json");
const fullDecisionOutA = path.join(tmp, "mindforge-guard-policy-permit-bridge-decision-b.json");
const contractOutA = path.join(tmp, "mindforge-guard-policy-permit-bridge-a.json");
const fullActionOutB = path.join(tmp, "mindforge-guard-policy-permit-bridge-action-c.json");
const fullPolicyOutB = path.join(tmp, "mindforge-guard-policy-permit-bridge-policy-c.json");
const fullPermitOutB = path.join(tmp, "mindforge-guard-policy-permit-bridge-permit-c.json");
const fullBridgeOutB = path.join(tmp, "mindforge-guard-policy-permit-bridge-bridge-c.json");
const fullReadinessOutB = path.join(tmp, "mindforge-guard-policy-permit-bridge-readiness-c.json");
const fullDecisionOutB = path.join(tmp, "mindforge-guard-policy-permit-bridge-decision-c.json");
const contractOutB = path.join(tmp, "mindforge-guard-policy-permit-bridge-b.json");

for (const filePath of [
  decisionActionOut,
  decisionPolicyOut,
  decisionPermitOut,
  decisionBridgeOut,
  decisionReadinessOut,
  decisionOut,
  fullActionOutA,
  fullPolicyOutA,
  fullPermitOutA,
  fullBridgeOutA,
  fullReadinessOutA,
  fullDecisionOutA,
  contractOutA,
  fullActionOutB,
  fullPolicyOutB,
  fullPermitOutB,
  fullBridgeOutB,
  fullReadinessOutB,
  fullDecisionOutB,
  contractOutB,
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

const decisionOnly = await runAudit({
  repoRoot,
  argv: [
    ".",
    "--staged",
    "--emit-canonical-action",
    `--canonical-action-out=${decisionActionOut}`,
    "--emit-policy-preview",
    `--policy-preview-out=${decisionPolicyOut}`,
    "--emit-permit-precheck-preview",
    `--permit-precheck-out=${decisionPermitOut}`,
    "--emit-execution-bridge-preview",
    `--execution-bridge-out=${decisionBridgeOut}`,
    "--emit-execution-readiness",
    `--execution-readiness-out=${decisionReadinessOut}`,
    "--emit-enforcement-adjacent-decision",
    `--enforcement-adjacent-decision-out=${decisionOut}`,
  ],
  policy,
});

const contractA = await runAudit({
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
    `--enforcement-adjacent-decision-out=${fullDecisionOutA}`,
    "--emit-policy-permit-bridge",
    `--policy-permit-bridge-out=${contractOutA}`,
  ],
  policy,
});

const contractB = await runAudit({
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
    `--enforcement-adjacent-decision-out=${fullDecisionOutB}`,
    "--emit-policy-permit-bridge",
    `--policy-permit-bridge-out=${contractOutB}`,
  ],
  policy,
});

for (const result of [baseline, decisionOnly, contractA, contractB]) {
  if (!result?.audit) {
    throw new Error(`audit run failed: ${result?.message || "unknown"}`);
  }
}

const normalizedBaseline = JSON.stringify(normalizeAudit(baseline.audit));
if (normalizedBaseline !== JSON.stringify(normalizeAudit(decisionOnly.audit))) {
  throw new Error("enforcement-adjacent decision baseline changed the audit main output");
}
if (normalizedBaseline !== JSON.stringify(normalizeAudit(contractA.audit))) {
  throw new Error("policy-to-permit bridge contract changed the audit main output");
}

const decisionActionArtifact = readJson(decisionActionOut);
const decisionPolicyArtifact = readJson(decisionPolicyOut);
const decisionPermitArtifact = readJson(decisionPermitOut);
const decisionBridgeArtifact = readJson(decisionBridgeOut);
const decisionReadinessArtifact = readJson(decisionReadinessOut);
const decisionArtifact = readJson(decisionOut);
const actionArtifactA = readJson(fullActionOutA);
const policyArtifactA = readJson(fullPolicyOutA);
const permitArtifactA = readJson(fullPermitOutA);
const bridgeArtifactA = readJson(fullBridgeOutA);
const readinessArtifactA = readJson(fullReadinessOutA);
const decisionArtifactA = readJson(fullDecisionOutA);
const contractArtifactA = readJson(contractOutA);
const actionArtifactB = readJson(fullActionOutB);
const policyArtifactB = readJson(fullPolicyOutB);
const permitArtifactB = readJson(fullPermitOutB);
const bridgeArtifactB = readJson(fullBridgeOutB);
const readinessArtifactB = readJson(fullReadinessOutB);
const decisionArtifactB = readJson(fullDecisionOutB);
const contractArtifactB = readJson(contractOutB);

const validations = [
  validateCanonicalActionArtifact(decisionActionArtifact),
  validateCanonicalActionArtifact(actionArtifactA),
  validateCanonicalActionArtifact(actionArtifactB),
  validateCanonicalActionPolicyPreview(decisionPolicyArtifact),
  validateCanonicalActionPolicyPreview(policyArtifactA),
  validateCanonicalActionPolicyPreview(policyArtifactB),
  validatePermitPrecheckPreview(decisionPermitArtifact),
  validatePermitPrecheckPreview(permitArtifactA),
  validatePermitPrecheckPreview(permitArtifactB),
  validateExecutionBridgePreview(decisionBridgeArtifact),
  validateExecutionBridgePreview(bridgeArtifactA),
  validateExecutionBridgePreview(bridgeArtifactB),
  validateExecutionReadinessJudgment(decisionReadinessArtifact),
  validateExecutionReadinessJudgment(readinessArtifactA),
  validateExecutionReadinessJudgment(readinessArtifactB),
  validateEnforcementAdjacentDecisionRecord(decisionArtifact),
  validateEnforcementAdjacentDecisionRecord(decisionArtifactA),
  validateEnforcementAdjacentDecisionRecord(decisionArtifactB),
  validatePolicyPermitBridgeContract(contractArtifactA),
  validatePolicyPermitBridgeContract(contractArtifactB),
];

for (const result of validations) {
  if (!result.ok) {
    throw new Error(`policy-to-permit bridge validation failed: ${result.errors.join("; ")}`);
  }
}

if (JSON.stringify(decisionActionArtifact) !== JSON.stringify(actionArtifactA)) {
  throw new Error("policy-to-permit bridge changed canonical action shadow output");
}
if (JSON.stringify(decisionPolicyArtifact) !== JSON.stringify(policyArtifactA)) {
  throw new Error("policy-to-permit bridge changed policy preview output");
}
if (JSON.stringify(decisionPermitArtifact) !== JSON.stringify(permitArtifactA)) {
  throw new Error("policy-to-permit bridge changed permit precheck preview output");
}
if (JSON.stringify(decisionBridgeArtifact) !== JSON.stringify(bridgeArtifactA)) {
  throw new Error("policy-to-permit bridge changed execution bridge preview output");
}
if (JSON.stringify(decisionReadinessArtifact) !== JSON.stringify(readinessArtifactA)) {
  throw new Error("policy-to-permit bridge changed execution readiness output");
}
if (JSON.stringify(decisionArtifact) !== JSON.stringify(decisionArtifactA)) {
  throw new Error("policy-to-permit bridge changed enforcement-adjacent decision output");
}
if (contractArtifactA.enforcing !== false || contractArtifactB.enforcing !== false) {
  throw new Error("policy-to-permit bridge contract must be non-enforcing");
}
if (JSON.stringify(contractArtifactA) !== JSON.stringify(contractArtifactB)) {
  throw new Error("policy-to-permit bridge contract is not stable across repeated runs");
}

process.stdout.write("audit policy-to-permit bridge verified\n");
