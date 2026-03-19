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

function readText(filePath) {
  return fs.readFileSync(filePath, permit.SECOND_CONSUMER_CONTRACT_OUTPUT_ENCODING);
}

for (const exportName of [
  "SECOND_CONSUMER_CONTRACT_INVOCATION_FLAGS",
  "SECOND_CONSUMER_CONTRACT_OUTPUT_ENCODING",
  "SECOND_CONSUMER_CONTRACT_OUTPUT_EOL",
  "SECOND_CONSUMER_CONTRACT_PRETTY_INDENT",
  "SECOND_CONSUMER_CONTRACT_OUTPUT_MODE",
  "SECOND_CONSUMER_CONTRACT_REPLAY_SAFETY",
  "serializeSecondConsumerSummary",
  "computeSecondConsumerSummaryHash",
  "renderSecondConsumerPilotSummary",
  "getSecondConsumerPilotSummaryHash",
]) {
  if (!(exportName in permit)) {
    throw new Error(`second consumer operational export missing: ${exportName}`);
  }
}

if (permit.SECOND_CONSUMER_CONTRACT_OUTPUT_ENCODING !== "utf8") {
  throw new Error("second consumer output encoding drifted");
}
if (permit.SECOND_CONSUMER_CONTRACT_OUTPUT_EOL !== "\n") {
  throw new Error("second consumer output newline drifted");
}
if (permit.SECOND_CONSUMER_CONTRACT_PRETTY_INDENT !== 2) {
  throw new Error("second consumer pretty indent drifted");
}
if (permit.SECOND_CONSUMER_CONTRACT_OUTPUT_MODE !== "atomic_replace") {
  throw new Error("second consumer output mode drifted");
}
if (permit.SECOND_CONSUMER_CONTRACT_REPLAY_SAFETY !== "same_inputs_same_summary") {
  throw new Error("second consumer replay safety guarantee drifted");
}

const tmp = os.tmpdir();
const permitOut = path.join(tmp, "mindforge-second-consumer-hardening-permit.json");
const decisionOut = path.join(tmp, "mindforge-second-consumer-hardening-decision.json");
const activationOut = path.join(tmp, "mindforge-second-consumer-hardening-activation.json");
const bundleOut = path.join(tmp, "mindforge-second-consumer-hardening-bundle.json");
const applicationOut = path.join(tmp, "mindforge-second-consumer-hardening-application.json");
const dispositionOut = path.join(tmp, "mindforge-second-consumer-hardening-disposition.json");
const summaryOut = path.join(tmp, "mindforge-second-consumer-hardening-summary.json");

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
    fs.rmSync(filePath, { force: true });
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
  throw new Error(`second consumer hardening setup audit failed: ${audit?.message || "unknown"}`);
}

const argv = [
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
];

const first = await runSecondConsumerPilot({
  argv,
  stdout: null,
  stderr: null,
});
const second = await runSecondConsumerPilot({
  argv,
  stdout: null,
  stderr: null,
});

if (first.exitCode !== 0 || second.exitCode !== 0) {
  throw new Error("second consumer hardening should allow repeated runtime execution");
}
if (first.summaryHash !== second.summaryHash) {
  throw new Error("second consumer hardening summary hash drifted across identical runs");
}

const firstSerialized = permit.renderSecondConsumerPilotSummary(first.summary);
const secondSerialized = permit.renderSecondConsumerPilotSummary(second.summary);
if (firstSerialized !== secondSerialized) {
  throw new Error("second consumer hardening serialized summary drifted across identical runs");
}
if (!firstSerialized.endsWith(permit.SECOND_CONSUMER_CONTRACT_OUTPUT_EOL)) {
  throw new Error("second consumer hardening serialized summary must end with stable newline");
}
if (
  permit.getSecondConsumerPilotSummaryHash(first.summary) !==
  permit.computeSecondConsumerSummaryHash(first.summary)
) {
  throw new Error("second consumer hardening pilot hash helper drifted from contract hash helper");
}

const firstWrite = await runSecondConsumerPilot({
  argv: [...argv, "--out", summaryOut, "--pretty"],
  stdout: null,
  stderr: null,
});
const firstContent = readText(summaryOut);
const firstFileSummary = readJson(summaryOut);

const secondWrite = await runSecondConsumerPilot({
  argv: [...argv, "--out", summaryOut, "--pretty"],
  stdout: null,
  stderr: null,
});
const secondContent = readText(summaryOut);
const secondFileSummary = readJson(summaryOut);

if (firstWrite.exitCode !== 0 || secondWrite.exitCode !== 0) {
  throw new Error("second consumer hardening should allow repeated pretty file output");
}
if (firstContent !== secondContent) {
  throw new Error("second consumer hardening file output drifted across repeated writes");
}
if (JSON.stringify(firstFileSummary) !== JSON.stringify(secondFileSummary)) {
  throw new Error("second consumer hardening file summary drifted across repeated writes");
}
if (firstWrite.summaryHash !== secondWrite.summaryHash) {
  throw new Error("second consumer hardening pretty summary hash drifted across repeated writes");
}

process.stdout.write("second consumer operational hardening verified\n");
