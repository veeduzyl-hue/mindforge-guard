import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { loadPolicy } from "../packages/guard/src/kernelCompat.mjs";
import { runAudit } from "../packages/guard/src/runAudit.mjs";
import * as permit from "../packages/guard/src/runtime/governance/permit/index.mjs";

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

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

const repoRoot = process.cwd();
const policyPath = path.join(repoRoot, ".mindforge", "config", "policy.json");
const policy = await loadPolicy({ policyPath, repoRoot });
const outA = path.join(os.tmpdir(), "mindforge-guard-enforcement-pilot-finalization-a.json");
const outB = path.join(os.tmpdir(), "mindforge-guard-enforcement-pilot-finalization-b.json");

for (const filePath of [outA, outB]) {
  try {
    fs.unlinkSync(filePath);
  } catch {}
}

const baseline = await runAudit({
  repoRoot,
  argv: [".", "--staged"],
  policy,
});

const pilotA = await runAudit({
  repoRoot,
  argv: [".", "--staged", "--enforcement-pilot", `--enforcement-pilot-out=${outA}`],
  policy,
});

const pilotB = await runAudit({
  repoRoot,
  argv: [".", "--staged", "--enforcement-pilot", `--enforcement-pilot-out=${outB}`],
  policy,
});

for (const result of [baseline, pilotA, pilotB]) {
  if (!result?.audit) {
    throw new Error(`audit run failed: ${result?.message || "unknown"}`);
  }
}

if (JSON.stringify(normalizeAudit(baseline.audit)) !== JSON.stringify(normalizeAudit(pilotA.audit))) {
  throw new Error("enforcement pilot finalization changed audit main output");
}
if (baseline.exitCode !== pilotA.exitCode) {
  throw new Error("enforcement pilot finalization changed audit exit code");
}

permit.assertValidEnforcementPilotFinalization(pilotA.enforcementPilotResult);
permit.assertValidEnforcementPilotFinalization(pilotB.enforcementPilotResult);

const serializedA = readText(outA);
const serializedB = readText(outB);
const expectedA = permit.serializeEnforcementPilotResult(pilotA.enforcementPilotResult, {
  pretty: true,
});
const expectedB = permit.serializeEnforcementPilotResult(pilotB.enforcementPilotResult, {
  pretty: true,
});

if (serializedA !== expectedA || serializedB !== expectedB) {
  throw new Error(
    "enforcement pilot finalization serialized output drifted from finalized contract"
  );
}
if (serializedA !== serializedB) {
  throw new Error(
    "enforcement pilot finalization serialized output is not stable across repeated runs"
  );
}
if (pilotA.enforcementPilotResult.enforcement_pilot.current_audit_exit_code !== null) {
  throw new Error(
    "enforcement pilot finalization must preserve no authority claim over audit exit"
  );
}
if (pilotA.enforcementPilotResult.enforcing !== false) {
  throw new Error("enforcement pilot finalization must remain non-enforcing");
}
if (
  JSON.stringify(Object.keys(pilotA.enforcementPilotResult)) !==
  JSON.stringify(permit.ENFORCEMENT_PILOT_TOP_LEVEL_FIELDS)
) {
  throw new Error("enforcement pilot finalization top-level field order drifted");
}
if (
  JSON.stringify(Object.keys(pilotA.enforcementPilotResult.enforcement_pilot)) !==
  JSON.stringify(permit.ENFORCEMENT_PILOT_PAYLOAD_FIELDS)
) {
  throw new Error("enforcement pilot finalization payload field order drifted");
}
for (const exportName of permit.ENFORCEMENT_PILOT_FINAL_EXPORT_SET) {
  if (!(exportName in permit)) {
    throw new Error(
      `enforcement pilot finalization export missing from permit index: ${exportName}`
    );
  }
}

process.stdout.write("audit enforcement pilot finalization verified\n");
