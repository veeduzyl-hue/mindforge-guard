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
  "mindforge-guard-limited-enforcement-authority-stabilization-a.json"
);
const outB = path.join(
  os.tmpdir(),
  "mindforge-guard-limited-enforcement-authority-stabilization-b.json"
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

if (
  JSON.stringify(normalizeAudit(baseline.audit)) !==
  JSON.stringify(normalizeAudit(pilotA.audit))
) {
  throw new Error("limited enforcement authority stabilization changed audit main output");
}
if (baseline.exitCode !== pilotA.exitCode) {
  throw new Error("limited enforcement authority stabilization changed audit exit code");
}

permit.assertValidLimitedEnforcementAuthorityStabilization(
  pilotA.limitedEnforcementAuthorityResult
);
permit.assertValidLimitedEnforcementAuthorityStabilization(
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
    "limited enforcement authority stabilization serialized output drifted from stabilized contract"
  );
}
if (serializedA !== serializedB) {
  throw new Error(
    "limited enforcement authority stabilization serialized output is not stable across repeated runs"
  );
}

const payload = pilotA.limitedEnforcementAuthorityResult.limited_enforcement_authority;

if (
  permit.LIMITED_ENFORCEMENT_AUTHORITY_ACCEPTANCE_BOUNDARY !==
  "stable_explicit_opt_in_recommendation_only_authority_sidecar"
) {
  throw new Error("limited enforcement authority stabilization acceptance boundary drifted");
}
if (payload.authority_scope !== "review_gate_deny_exit_recommendation_only") {
  throw new Error("limited enforcement authority stabilization scope drifted");
}
if (payload.current_audit_exit_code !== null) {
  throw new Error(
    "limited enforcement authority stabilization must preserve null current_audit_exit_code"
  );
}
for (const exportName of permit.LIMITED_ENFORCEMENT_AUTHORITY_STABILIZATION_EXPORT_SET) {
  if (!(exportName in permit)) {
    throw new Error(
      `limited enforcement authority stabilization export missing from permit index: ${exportName}`
    );
  }
}

process.stdout.write("audit limited enforcement authority stabilization verified\n");
