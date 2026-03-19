import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { runAudit } from "../packages/guard/src/runAudit.mjs";
import { runSecondConsumerPilot } from "../packages/guard/src/runSecondConsumerPilot.mjs";
import * as permit from "../packages/guard/src/runtime/governance/permit/index.mjs";

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

permit.assertValidSecondConsumerContract();

const contractValidation = permit.validateSecondConsumerContract();
if (!contractValidation.ok) {
  throw new Error(`second consumer contract validation failed: ${contractValidation.errors.join("; ")}`);
}

if (
  JSON.stringify(permit.SECOND_CONSUMER_CONTRACT_REQUIRED_INPUTS) !==
  JSON.stringify(permit.SECOND_CONSUMER_PILOT_REQUIRED_INPUTS)
) {
  throw new Error("promoted second consumer required inputs drifted from pilot");
}
if (
  JSON.stringify(permit.SECOND_CONSUMER_CONTRACT_OPTIONAL_INPUTS) !==
  JSON.stringify(permit.SECOND_CONSUMER_PILOT_OPTIONAL_INPUTS)
) {
  throw new Error("promoted second consumer optional inputs drifted from pilot");
}
if (
  JSON.stringify(permit.SECOND_CONSUMER_CONTRACT_EXCLUDED_INPUTS) !==
  JSON.stringify(permit.SECOND_CONSUMER_PILOT_AUDIT_BOUND_EXCLUSIONS)
) {
  throw new Error("promoted second consumer excluded inputs drifted from pilot");
}

for (const exportName of permit.SECOND_CONSUMER_CONTRACT_STABLE_EXPORT_SET) {
  if (!(exportName in permit)) {
    throw new Error(`promoted second consumer export missing from permit index: ${exportName}`);
  }
}

const tmp = os.tmpdir();
const permitOut = path.join(tmp, "mindforge-second-consumer-contract-permit.json");
const decisionOut = path.join(tmp, "mindforge-second-consumer-contract-decision.json");
const activationOut = path.join(tmp, "mindforge-second-consumer-contract-activation.json");
const bundleOut = path.join(tmp, "mindforge-second-consumer-contract-bundle.json");
const applicationOut = path.join(tmp, "mindforge-second-consumer-contract-application.json");
const dispositionOut = path.join(tmp, "mindforge-second-consumer-contract-disposition.json");
const summaryOut = path.join(tmp, "mindforge-second-consumer-contract-summary.json");

for (const filePath of [
  permitOut,
  decisionOut,
  activationOut,
  bundleOut,
  applicationOut,
  dispositionOut,
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
    `--governance-decision-record-out=${decisionOut}`,
    `--governance-outcome-bundle-out=${bundleOut}`,
    `--governance-application-record-out=${applicationOut}`,
    `--governance-disposition-out=${dispositionOut}`,
    `--governance-activation-record-out=${activationOut}`,
  ],
  policy: basePolicy(),
});

if (!audit?.audit || audit.exitCode !== 0) {
  throw new Error(`second consumer contract setup audit failed: ${audit?.message || "unknown"}`);
}

const result = await runSecondConsumerPilot({
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

if (result.exitCode !== 0) {
  throw new Error(`second consumer contract pilot run failed: ${result.message || "unknown"}`);
}

const summary = readJson(summaryOut);
permit.assertValidSecondConsumerSummary(summary);

const summaryValidation = permit.validateSecondConsumerSummary(summary);
if (!summaryValidation.ok) {
  throw new Error(`second consumer summary validation failed: ${summaryValidation.errors.join("; ")}`);
}

if (
  JSON.stringify(Object.keys(summary)) !==
  JSON.stringify(permit.SECOND_CONSUMER_CONTRACT_SUMMARY_SECTIONS)
) {
  throw new Error("promoted second consumer summary section order drifted");
}

for (const sectionName of permit.SECOND_CONSUMER_CONTRACT_SUMMARY_SECTIONS) {
  const sectionFields = Object.keys(summary[sectionName]);
  const expectedFields = permit.SECOND_CONSUMER_CONTRACT_SUMMARY_SHAPE[sectionName];
  if (JSON.stringify(sectionFields) !== JSON.stringify(expectedFields)) {
    throw new Error(`promoted second consumer summary field order drifted for ${sectionName}`);
  }
}

if (
  JSON.stringify(summary.dependencies.provided_artifacts) !==
  JSON.stringify([
    ...permit.SECOND_CONSUMER_CONTRACT_REQUIRED_INPUTS,
    ...permit.SECOND_CONSUMER_CONTRACT_OPTIONAL_INPUTS,
  ])
) {
  throw new Error("promoted second consumer provided artifact set drifted");
}

if (
  JSON.stringify(summary.readiness.optional_artifacts_present) !==
  JSON.stringify(permit.SECOND_CONSUMER_CONTRACT_OPTIONAL_INPUTS)
) {
  throw new Error("promoted second consumer optional artifact presence drifted");
}

process.stdout.write("second consumer contract verified\n");
