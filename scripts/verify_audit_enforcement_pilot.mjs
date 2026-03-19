import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { loadPolicy } from "../packages/guard/src/kernelCompat.mjs";
import { runAudit } from "../packages/guard/src/runAudit.mjs";
import {
  assertValidEnforcementPilotResult,
  ENFORCEMENT_PILOT_DEFAULT_STATE,
  ENFORCEMENT_PILOT_RESULT_BOUNDARY,
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

const repoRoot = process.cwd();
const policyPath = path.join(repoRoot, ".mindforge", "config", "policy.json");
const policy = await loadPolicy({ policyPath, repoRoot });
const tmpOutA = path.join(os.tmpdir(), "mindforge-guard-enforcement-pilot-a.json");
const tmpOutB = path.join(os.tmpdir(), "mindforge-guard-enforcement-pilot-b.json");

for (const filePath of [tmpOutA, tmpOutB]) {
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
  argv: [".", "--staged", "--enforcement-pilot", `--enforcement-pilot-out=${tmpOutA}`],
  policy,
});

const pilotB = await runAudit({
  repoRoot,
  argv: [".", "--staged", "--enforcement-pilot", `--enforcement-pilot-out=${tmpOutB}`],
  policy,
});

for (const result of [baseline, pilotA, pilotB]) {
  if (!result?.audit) {
    throw new Error(`audit run failed: ${result?.message || "unknown"}`);
  }
}

if (baseline.exitCode !== pilotA.exitCode || baseline.exitCode !== pilotB.exitCode) {
  throw new Error("enforcement pilot changed audit exit code");
}
if (JSON.stringify(normalizeAudit(baseline.audit)) !== JSON.stringify(normalizeAudit(pilotA.audit))) {
  throw new Error("enforcement pilot changed audit main output");
}
if (JSON.stringify(normalizeAudit(baseline.audit)) !== JSON.stringify(normalizeAudit(pilotB.audit))) {
  throw new Error("enforcement pilot changed audit main output across repeated runs");
}

const artifactA = assertValidEnforcementPilotResult(readJson(tmpOutA));
const artifactB = assertValidEnforcementPilotResult(readJson(tmpOutB));

if (artifactA.enforcement_pilot.default_state !== ENFORCEMENT_PILOT_DEFAULT_STATE) {
  throw new Error("enforcement pilot default state drifted");
}
if (artifactA.enforcement_pilot.result_boundary !== ENFORCEMENT_PILOT_RESULT_BOUNDARY) {
  throw new Error("enforcement pilot result boundary drifted");
}
if (artifactA.enforcing !== false || artifactB.enforcing !== false) {
  throw new Error("enforcement pilot must remain non-enforcing");
}
if (artifactA.enforcement_pilot.current_audit_exit_code !== null) {
  throw new Error("enforcement pilot must not claim audit exit authority");
}
if (JSON.stringify(artifactA) !== JSON.stringify(artifactB)) {
  throw new Error("enforcement pilot result is not stable across repeated runs");
}

process.stdout.write("audit enforcement pilot verified\n");
