import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { runAudit } from "../packages/guard/src/runAudit.mjs";
import { runSecondConsumerPilot } from "../packages/guard/src/runSecondConsumerPilot.mjs";
import {
  SECOND_CONSUMER_PILOT_SURFACE,
  SECOND_CONSUMER_PILOT_MODE,
  SECOND_CONSUMER_PILOT_REQUIRED_INPUTS,
  SECOND_CONSUMER_PILOT_OPTIONAL_INPUTS,
  SECOND_CONSUMER_PILOT_AUDIT_BOUND_EXCLUSIONS,
} from "../packages/guard/src/runtime/governance/permit/index.mjs";

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

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

const tmp = os.tmpdir();
const permitOut = path.join(tmp, "mindforge-second-consumer-pilot-permit.json");
const decisionOut = path.join(tmp, "mindforge-second-consumer-pilot-decision.json");
const activationOut = path.join(tmp, "mindforge-second-consumer-pilot-activation.json");
const bundleOut = path.join(tmp, "mindforge-second-consumer-pilot-bundle.json");
const applicationOut = path.join(tmp, "mindforge-second-consumer-pilot-application.json");
const dispositionOut = path.join(tmp, "mindforge-second-consumer-pilot-disposition.json");
const receiptOut = path.join(tmp, "mindforge-second-consumer-pilot-receipt.json");
const summaryOut = path.join(tmp, "mindforge-second-consumer-pilot-summary.json");

for (const filePath of [
  permitOut,
  decisionOut,
  activationOut,
  bundleOut,
  applicationOut,
  dispositionOut,
  receiptOut,
  summaryOut,
]) {
  try {
    fs.unlinkSync(filePath);
  } catch {}
}

const audit = await runAudit({
  argv: [
    ".",
    "--staged",
    "--permit-gate",
    `--permit-gate-out=${permitOut}`,
    `--governance-receipt-out=${receiptOut}`,
    `--governance-decision-record-out=${decisionOut}`,
    `--governance-outcome-bundle-out=${bundleOut}`,
    `--governance-application-record-out=${applicationOut}`,
    `--governance-disposition-out=${dispositionOut}`,
    `--governance-activation-record-out=${activationOut}`,
  ],
  policy: basePolicy(),
});

if (!audit?.audit || audit.exitCode !== 0) {
  throw new Error(`second consumer pilot setup audit failed: ${audit?.message || "unknown"}`);
}

const missingRequired = await runSecondConsumerPilot({
  argv: [
    "--permit-gate-result-in",
    permitOut,
    "--governance-decision-record-in",
    decisionOut,
  ],
  stdout: null,
  stderr: null,
});

if (missingRequired.exitCode === 0) {
  throw new Error("second consumer pilot should require governance activation record input");
}

const auditBoundRejected = await runSecondConsumerPilot({
  argv: [
    "--permit-gate-result-in",
    permitOut,
    "--governance-decision-record-in",
    decisionOut,
    "--governance-activation-record-in",
    activationOut,
    "--governance-receipt-in",
    receiptOut,
  ],
  stdout: null,
  stderr: null,
});

if (auditBoundRejected.exitCode === 0) {
  throw new Error("second consumer pilot should reject governance receipt as audit-bound input");
}

const requiredOnly = await runSecondConsumerPilot({
  argv: [
    "--permit-gate-result-in",
    permitOut,
    "--governance-decision-record-in",
    decisionOut,
    "--governance-activation-record-in",
    activationOut,
  ],
  stdout: null,
  stderr: null,
});

if (requiredOnly.exitCode !== 0 || !requiredOnly.summary) {
  throw new Error("second consumer pilot should succeed with required inputs only");
}

const linked = await runSecondConsumerPilot({
  argv: [
    "--permit-gate-result-in",
    permitOut,
    "--governance-decision-record-in",
    decisionOut,
    "--governance-activation-record-in",
    activationOut,
    "--governance-outcome-bundle-in",
    bundleOut,
    "--governance-application-record-in",
    applicationOut,
    "--governance-disposition-in",
    dispositionOut,
    "--out",
    summaryOut,
    "--pretty",
  ],
  stdout: null,
  stderr: null,
});

if (linked.exitCode !== 0) {
  throw new Error("second consumer pilot should succeed with optional consumer-neutral inputs");
}

const linkedSummary = readJson(summaryOut);

if (requiredOnly.summary.consumer.surface !== SECOND_CONSUMER_PILOT_SURFACE) {
  throw new Error("second consumer pilot surface mismatch");
}
if (requiredOnly.summary.consumer.mode !== SECOND_CONSUMER_PILOT_MODE) {
  throw new Error("second consumer pilot mode mismatch");
}
if (requiredOnly.summary.readiness.minimal_ready !== true) {
  throw new Error("second consumer pilot should report minimal readiness");
}
if (JSON.stringify(requiredOnly.summary.readiness.required_artifacts) !== JSON.stringify(SECOND_CONSUMER_PILOT_REQUIRED_INPUTS)) {
  throw new Error("second consumer pilot required artifact profile drifted");
}
if (
  JSON.stringify(linkedSummary.readiness.audit_bound_artifacts_excluded) !==
  JSON.stringify(SECOND_CONSUMER_PILOT_AUDIT_BOUND_EXCLUSIONS)
) {
  throw new Error("second consumer pilot audit-bound exclusions drifted");
}
if (
  JSON.stringify(linkedSummary.dependencies.allowed_optional_artifacts) !==
  JSON.stringify(SECOND_CONSUMER_PILOT_OPTIONAL_INPUTS)
) {
  throw new Error("second consumer pilot optional artifact profile drifted");
}
if (
  JSON.stringify(linkedSummary.readiness.optional_artifacts_present) !==
  JSON.stringify(SECOND_CONSUMER_PILOT_OPTIONAL_INPUTS)
) {
  throw new Error("second consumer pilot optional artifact detection drifted");
}
if (linkedSummary.governance.decision !== "allow") {
  throw new Error("second consumer pilot should preserve allow decision");
}
if (linkedSummary.governance.exit_code !== 0) {
  throw new Error("second consumer pilot should preserve allow exit code");
}
if (!Array.isArray(linkedSummary.dependencies.activation_enabled_paths)) {
  throw new Error("second consumer pilot must report activation enabled paths");
}
if (!linkedSummary.dependencies.activation_enabled_paths.includes("governance_receipt")) {
  throw new Error("second consumer pilot should observe audit-bound paths without consuming receipt");
}
if (
  JSON.stringify(linkedSummary.dependencies.audit_bound_paths_present) !==
  JSON.stringify(["governance_receipt"])
) {
  throw new Error("second consumer pilot audit-bound path detection drifted");
}

process.stdout.write("second consumer pilot verified\n");
