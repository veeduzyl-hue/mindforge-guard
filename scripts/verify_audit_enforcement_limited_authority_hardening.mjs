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
  "mindforge-guard-limited-enforcement-authority-hardening-a.json"
);
const outB = path.join(
  os.tmpdir(),
  "mindforge-guard-limited-enforcement-authority-hardening-b.json"
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
  throw new Error("limited enforcement authority hardening changed audit main output");
}
if (baseline.exitCode !== pilotA.exitCode) {
  throw new Error("limited enforcement authority hardening changed audit exit code");
}

permit.assertValidLimitedEnforcementAuthorityHardening(
  pilotA.limitedEnforcementAuthorityResult
);
permit.assertValidLimitedEnforcementAuthorityHardening(
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
    "limited enforcement authority hardening serialized output drifted from hardened contract"
  );
}
if (serializedA !== serializedB) {
  throw new Error(
    "limited enforcement authority hardening serialized output is not stable across repeated runs"
  );
}

const payload = pilotA.limitedEnforcementAuthorityResult.limited_enforcement_authority;

if (
  payload.authority_scope !== "review_gate_deny_exit_recommendation_only"
) {
  throw new Error("limited enforcement authority hardening scope drifted");
}
if (payload.current_audit_exit_code !== null) {
  throw new Error(
    "limited enforcement authority hardening must preserve null current_audit_exit_code"
  );
}
if (
  JSON.stringify(Object.keys(pilotA.limitedEnforcementAuthorityResult)) !==
  JSON.stringify(permit.LIMITED_ENFORCEMENT_AUTHORITY_TOP_LEVEL_FIELDS)
) {
  throw new Error(
    "limited enforcement authority hardening top-level field order drifted"
  );
}
if (
  JSON.stringify(Object.keys(payload)) !==
  JSON.stringify(permit.LIMITED_ENFORCEMENT_AUTHORITY_PAYLOAD_FIELDS)
) {
  throw new Error(
    "limited enforcement authority hardening payload field order drifted"
  );
}
for (const exportName of permit.LIMITED_ENFORCEMENT_AUTHORITY_EXPORT_SET) {
  if (!(exportName in permit)) {
    throw new Error(
      `limited enforcement authority hardening export missing from permit index: ${exportName}`
    );
  }
}

process.stdout.write("audit limited enforcement authority hardening verified\n");
