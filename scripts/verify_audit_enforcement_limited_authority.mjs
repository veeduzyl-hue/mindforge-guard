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
const outA = path.join(
  os.tmpdir(),
  "mindforge-guard-limited-enforcement-authority-a.json"
);
const outB = path.join(
  os.tmpdir(),
  "mindforge-guard-limited-enforcement-authority-b.json"
);

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
  argv: [
    ".",
    "--staged",
    "--limited-enforcement-authority",
    `--limited-enforcement-authority-out=${outA}`,
  ],
  policy,
});

const pilotB = await runAudit({
  repoRoot,
  argv: [
    ".",
    "--staged",
    "--limited-enforcement-authority",
    `--limited-enforcement-authority-out=${outB}`,
  ],
  policy,
});

for (const result of [baseline, pilotA, pilotB]) {
  if (!result?.audit) {
    throw new Error(`audit run failed: ${result?.message || "unknown"}`);
  }
}

if (JSON.stringify(normalizeAudit(baseline.audit)) !== JSON.stringify(normalizeAudit(pilotA.audit))) {
  throw new Error("limited enforcement authority changed audit main output");
}
if (baseline.exitCode !== pilotA.exitCode) {
  throw new Error("limited enforcement authority changed audit exit code");
}
if (pilotA.enforcementPilotResult !== null) {
  throw new Error(
    "limited enforcement authority pilot must not implicitly enable stronger enforcement pilot"
  );
}

permit.assertValidLimitedEnforcementAuthorityPilot(
  pilotA.limitedEnforcementAuthorityResult
);
permit.assertValidLimitedEnforcementAuthorityPilot(
  pilotB.limitedEnforcementAuthorityResult
);

const serializedA = readText(outA);
const serializedB = readText(outB);
const expectedA = permit.serializeLimitedEnforcementAuthorityResult(
  pilotA.limitedEnforcementAuthorityResult,
  { pretty: true }
);
const expectedB = permit.serializeLimitedEnforcementAuthorityResult(
  pilotB.limitedEnforcementAuthorityResult,
  { pretty: true }
);

if (serializedA !== expectedA || serializedB !== expectedB) {
  throw new Error(
    "limited enforcement authority serialized output drifted from stabilized contract"
  );
}
if (serializedA !== serializedB) {
  throw new Error(
    "limited enforcement authority serialized output is not stable across repeated runs"
  );
}

const payload = pilotA.limitedEnforcementAuthorityResult.limited_enforcement_authority;

if (payload.current_audit_exit_code !== null) {
  throw new Error(
    "limited enforcement authority must not mutate or claim current audit exit code"
  );
}
if (
  pilotA.limitedEnforcementAuthorityResult.authority_active &&
  payload.authority_status === "would_apply_deny_exit_code" &&
  payload.proposed_audit_exit_code !== 25
) {
  throw new Error(
    "limited enforcement authority deny recommendation must remain pinned to exit code 25"
  );
}
if (
  payload.authority_status !== "would_apply_deny_exit_code" &&
  payload.proposed_audit_exit_code !== null
) {
  throw new Error(
    "limited enforcement authority proposed exit code must remain null outside deny recommendation"
  );
}
if (
  JSON.stringify(Object.keys(pilotA.limitedEnforcementAuthorityResult)) !==
  JSON.stringify(permit.LIMITED_ENFORCEMENT_AUTHORITY_TOP_LEVEL_FIELDS)
) {
  throw new Error(
    "limited enforcement authority top-level field order drifted"
  );
}
if (
  JSON.stringify(Object.keys(payload)) !==
  JSON.stringify(permit.LIMITED_ENFORCEMENT_AUTHORITY_PAYLOAD_FIELDS)
) {
  throw new Error("limited enforcement authority payload field order drifted");
}
for (const exportName of permit.LIMITED_ENFORCEMENT_AUTHORITY_EXPORT_SET) {
  if (!(exportName in permit)) {
    throw new Error(
      `limited enforcement authority export missing from permit index: ${exportName}`
    );
  }
}

process.stdout.write("audit limited enforcement authority verified\n");
