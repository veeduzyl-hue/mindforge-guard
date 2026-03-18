import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";

import { runAudit } from "../packages/guard/src/runAudit.mjs";
import {
  PERMIT_GATE_RESULT_KIND,
  PERMIT_GATE_RESULT_VERSION,
  PERMIT_GATE_RESULT_SCHEMA_ID,
  PERMIT_GATE_MODE,
  PERMIT_GATE_CONSUMER_SURFACE,
  PERMIT_GATE_DENIED_EXIT_CODE,
  GOVERNANCE_RECEIPT_KIND,
  validatePermitGateResult,
  validateGovernanceReceipt,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";

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

function basePolicy() {
  return {
    policy_version: "1.0",
    defaults: {},
    thresholds: {},
    rules: [],
    exit_codes: {
      allow: 0,
      soft_block: 10,
      hard_block: 20,
      error: 1,
    },
  };
}

function denyPolicy() {
  const policy = basePolicy();
  policy.rules.push({
    id: "permit-gate-deny-unknown",
    enabled: true,
    severity: "hard_block",
    message: "deny unknown action classes at the permit gate",
    when: {
      any_of: [{ metric: "lines_added", op: ">", value: 999999 }],
    },
    preview_when: {
      action_classes: ["unknown"],
    },
  });
  return policy;
}

const tmp = os.tmpdir();
const allowOut = path.join(tmp, "mindforge-guard-permit-gate-allow.json");
const denyOut = path.join(tmp, "mindforge-guard-permit-gate-deny.json");
const allowReceiptOut = path.join(tmp, "mindforge-guard-permit-gate-allow-receipt.json");
const denyReceiptOut = path.join(tmp, "mindforge-guard-permit-gate-deny-receipt.json");

for (const filePath of [allowOut, denyOut, allowReceiptOut, denyReceiptOut]) {
  try {
    fs.unlinkSync(filePath);
  } catch {}
}

const baseline = await runAudit({
  argv: [".", "--staged"],
  policy: basePolicy(),
});

const allow = await runAudit({
  argv: [
    ".",
    "--staged",
    "--permit-gate",
    `--permit-gate-out=${allowOut}`,
    `--governance-receipt-out=${allowReceiptOut}`,
  ],
  policy: basePolicy(),
});

const deny = await runAudit({
  argv: [
    ".",
    "--staged",
    "--permit-gate",
    `--permit-gate-out=${denyOut}`,
    `--governance-receipt-out=${denyReceiptOut}`,
  ],
  policy: denyPolicy(),
});

for (const result of [baseline, allow, deny]) {
  if (!result?.audit) {
    throw new Error(`permit gate audit failed: ${result?.message || "unknown"}`);
  }
}

const normalizedBaseline = JSON.stringify(normalizeAudit(baseline.audit));
if (normalizedBaseline !== JSON.stringify(normalizeAudit(allow.audit))) {
  throw new Error("permit gate allow path changed the audit main output");
}
if (normalizedBaseline !== JSON.stringify(normalizeAudit(deny.audit))) {
  throw new Error("permit gate deny path changed the audit main output");
}

if (allow.exitCode !== 0) {
  throw new Error(`permit gate allow path should pass, got exit ${allow.exitCode}`);
}
if (deny.exitCode !== PERMIT_GATE_DENIED_EXIT_CODE) {
  throw new Error(`permit gate deny path should exit ${PERMIT_GATE_DENIED_EXIT_CODE}, got ${deny.exitCode}`);
}

const allowArtifact = readJson(allowOut);
const denyArtifact = readJson(denyOut);
const allowReceipt = readJson(allowReceiptOut);
const denyReceipt = readJson(denyReceiptOut);

for (const artifact of [allowArtifact, denyArtifact]) {
  const validation = validatePermitGateResult(artifact);
  if (!validation.ok) {
    throw new Error(`permit gate validation failed: ${validation.errors.join("; ")}`);
  }
}

for (const receipt of [allowReceipt, denyReceipt]) {
  const validation = validateGovernanceReceipt(receipt);
  if (!validation.ok) {
    throw new Error(`governance receipt validation failed: ${validation.errors.join("; ")}`);
  }
  if (receipt.kind !== GOVERNANCE_RECEIPT_KIND) {
    throw new Error("permit gate receipt kind mismatch");
  }
  if (receipt.governance_receipt.audit_output_preserved !== true) {
    throw new Error("permit gate receipt must preserve audit output semantics");
  }
}

for (const artifact of [allowArtifact, denyArtifact]) {
  if (artifact.kind !== PERMIT_GATE_RESULT_KIND) {
    throw new Error("permit gate result kind mismatch");
  }
  if (artifact.version !== PERMIT_GATE_RESULT_VERSION) {
    throw new Error("permit gate result version mismatch");
  }
  if (artifact.schema_id !== PERMIT_GATE_RESULT_SCHEMA_ID) {
    throw new Error("permit gate result schema_id mismatch");
  }
  if (artifact.enforcing !== false) {
    throw new Error("permit gate result must remain non-enforcing");
  }
  if (artifact?.permit_gate?.mode !== PERMIT_GATE_MODE) {
    throw new Error("permit gate mode mismatch");
  }
  if (artifact?.permit_gate?.consumer_surface !== PERMIT_GATE_CONSUMER_SURFACE) {
    throw new Error("permit gate consumer surface mismatch");
  }
  if (artifact?.permit_gate?.audit_output_preserved !== true) {
    throw new Error("permit gate must preserve audit output semantics");
  }
}

if (allowArtifact.permit_gate.decision !== "allow") {
  throw new Error("permit gate allow path did not produce an allow decision");
}
if (allowArtifact.permit_gate.source_decision !== "insufficient_signal") {
  throw new Error("permit gate allow path should be sourced from insufficient_signal");
}
if (allowArtifact.permit_gate.exit_code !== 0) {
  throw new Error("permit gate allow path should keep exit code 0");
}
if (denyArtifact.permit_gate.decision !== "deny") {
  throw new Error("permit gate deny path did not produce a deny decision");
}
if (denyArtifact.permit_gate.source_decision !== "would_deny") {
  throw new Error("permit gate deny path should be sourced from would_deny");
}
if (denyArtifact.permit_gate.exit_code !== PERMIT_GATE_DENIED_EXIT_CODE) {
  throw new Error("permit gate deny path exit code mismatch");
}

const denyRepo = path.join(tmp, "mindforge-guard-permit-gate-deny-repo");
try {
  fs.rmSync(denyRepo, { recursive: true, force: true });
} catch {}
fs.mkdirSync(path.join(denyRepo, ".mindforge", "config"), { recursive: true });
fs.writeFileSync(path.join(denyRepo, ".mindforge", "config", "policy.json"), JSON.stringify(denyPolicy(), null, 2));
execFileSync("git", ["init"], { cwd: denyRepo, stdio: "ignore" });
execFileSync("git", ["config", "user.email", "codex@example.com"], { cwd: denyRepo, stdio: "ignore" });
execFileSync("git", ["config", "user.name", "Codex"], { cwd: denyRepo, stdio: "ignore" });
execFileSync("git", ["add", "."], { cwd: denyRepo, stdio: "ignore" });
execFileSync("git", ["commit", "-m", "init"], { cwd: denyRepo, stdio: "ignore" });

const denyRunGuard = spawnSync(
  process.execPath,
  [
    path.join(process.cwd(), "packages/guard/src/runGuard.mjs"),
    "audit",
    ".",
    "--staged",
    "--permit-gate",
    `--governance-receipt-out=${path.join(denyRepo, "deny-receipt.json")}`,
  ],
  {
    cwd: denyRepo,
    encoding: "utf8",
  }
);

if (denyRunGuard.status !== PERMIT_GATE_DENIED_EXIT_CODE) {
  throw new Error("runGuard deny path exit code mismatch");
}

const denyStdout = JSON.parse(denyRunGuard.stdout);
if (denyStdout.kind !== PERMIT_GATE_RESULT_KIND) {
  throw new Error("runGuard deny path should emit permit_gate_result");
}
if (denyStdout?.permit_gate?.decision !== "deny") {
  throw new Error("runGuard deny path should emit deny decision");
}
if (denyStdout?.permit_gate?.audit_output_preserved !== true) {
  throw new Error("runGuard deny path should keep audit output boundary preserved");
}

const denyRunGuardReceipt = readJson(path.join(denyRepo, "deny-receipt.json"));
if (denyRunGuardReceipt.kind !== GOVERNANCE_RECEIPT_KIND) {
  throw new Error("runGuard deny path should write governance receipt");
}
if (denyRunGuardReceipt.governance_receipt.outcome !== "deny") {
  throw new Error("runGuard deny path receipt should emit deny outcome");
}
if (denyRunGuardReceipt.governance_receipt.exit_code !== PERMIT_GATE_DENIED_EXIT_CODE) {
  throw new Error("runGuard deny path receipt exit code mismatch");
}

process.stdout.write("audit permit gate verified\n");
