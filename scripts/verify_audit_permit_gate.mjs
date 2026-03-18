import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { runAudit } from "../packages/guard/src/runAudit.mjs";
import {
  PERMIT_GATE_DENIED_EXIT_CODE,
  validatePermitGateResult,
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

for (const filePath of [allowOut, denyOut]) {
  try {
    fs.unlinkSync(filePath);
  } catch {}
}

const baseline = await runAudit({
  argv: [".", "--staged"],
  policy: basePolicy(),
});

const allow = await runAudit({
  argv: [".", "--staged", "--permit-gate", `--permit-gate-out=${allowOut}`],
  policy: basePolicy(),
});

const deny = await runAudit({
  argv: [".", "--staged", "--permit-gate", `--permit-gate-out=${denyOut}`],
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

for (const artifact of [allowArtifact, denyArtifact]) {
  const validation = validatePermitGateResult(artifact);
  if (!validation.ok) {
    throw new Error(`permit gate validation failed: ${validation.errors.join("; ")}`);
  }
}

if (allowArtifact.permit_gate.decision !== "allow") {
  throw new Error("permit gate allow path did not produce an allow decision");
}
if (allowArtifact.permit_gate.source_decision !== "insufficient_signal") {
  throw new Error("permit gate allow path should be sourced from insufficient_signal");
}
if (denyArtifact.permit_gate.decision !== "deny") {
  throw new Error("permit gate deny path did not produce a deny decision");
}
if (denyArtifact.permit_gate.source_decision !== "would_deny") {
  throw new Error("permit gate deny path should be sourced from would_deny");
}

process.stdout.write("audit permit gate verified\n");
