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

function readText(filePath) {
  return fs.readFileSync(filePath, permit.SECOND_CONSUMER_CONTRACT_OUTPUT_ENCODING);
}

for (const exportName of [
  "SECOND_CONSUMER_CONTRACT_EXIT_SUCCESS",
  "SECOND_CONSUMER_CONTRACT_EXIT_FAILURE",
  "SECOND_CONSUMER_CONTRACT_HELP_EXIT",
  "SECOND_CONSUMER_CONTRACT_STDOUT_MODE",
  "SECOND_CONSUMER_CONTRACT_STDERR_MODE",
  "SECOND_CONSUMER_CONTRACT_OUTPUT_WRITE_RULE",
  "formatSecondConsumerRuntimeError",
  "formatSecondConsumerPilotError",
]) {
  if (!(exportName in permit)) {
    throw new Error(`second consumer runtime export missing: ${exportName}`);
  }
}

if (permit.SECOND_CONSUMER_CONTRACT_EXIT_SUCCESS !== 0) {
  throw new Error("second consumer runtime success exit drifted");
}
if (permit.SECOND_CONSUMER_CONTRACT_EXIT_FAILURE !== 1) {
  throw new Error("second consumer runtime failure exit drifted");
}
if (permit.SECOND_CONSUMER_CONTRACT_HELP_EXIT !== 0) {
  throw new Error("second consumer runtime help exit drifted");
}
if (permit.SECOND_CONSUMER_CONTRACT_STDOUT_MODE !== "help_or_summary") {
  throw new Error("second consumer runtime stdout mode drifted");
}
if (permit.SECOND_CONSUMER_CONTRACT_STDERR_MODE !== "single_line_error") {
  throw new Error("second consumer runtime stderr mode drifted");
}
if (permit.SECOND_CONSUMER_CONTRACT_OUTPUT_WRITE_RULE !== "write_only_on_success") {
  throw new Error("second consumer runtime output write rule drifted");
}

const help = await runSecondConsumerPilot({
  argv: ["--help"],
  stdout: null,
  stderr: null,
});
if (help.exitCode !== permit.SECOND_CONSUMER_CONTRACT_HELP_EXIT) {
  throw new Error("second consumer runtime help exit code drifted");
}
if (!help.stdout?.includes("Usage:")) {
  throw new Error("second consumer runtime help output drifted");
}

const unknownArg = await runSecondConsumerPilot({
  argv: ["--nope"],
  stdout: null,
  stderr: null,
});
if (unknownArg.exitCode !== permit.SECOND_CONSUMER_CONTRACT_EXIT_FAILURE) {
  throw new Error("second consumer runtime unknown-arg exit code drifted");
}
if (!unknownArg.stderr || unknownArg.stderr !== permit.formatSecondConsumerPilotError(new Error("unknown argument: --nope"))) {
  throw new Error("second consumer runtime unknown-arg stderr formatting drifted");
}

const tmp = os.tmpdir();
const permitOut = path.join(tmp, "mindforge-second-consumer-runtime-permit.json");
const decisionOut = path.join(tmp, "mindforge-second-consumer-runtime-decision.json");
const activationOut = path.join(tmp, "mindforge-second-consumer-runtime-activation.json");
const bundleOut = path.join(tmp, "mindforge-second-consumer-runtime-bundle.json");
const applicationOut = path.join(tmp, "mindforge-second-consumer-runtime-application.json");
const dispositionOut = path.join(tmp, "mindforge-second-consumer-runtime-disposition.json");
const summaryOut = path.join(tmp, "mindforge-second-consumer-runtime-summary.json");

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
  throw new Error(`second consumer runtime setup audit failed: ${audit?.message || "unknown"}`);
}

const missingRequired = await runSecondConsumerPilot({
  argv: ["--permit-gate-result-in", permitOut],
  stdout: null,
  stderr: null,
});
if (missingRequired.exitCode !== permit.SECOND_CONSUMER_CONTRACT_EXIT_FAILURE) {
  throw new Error("second consumer runtime missing-required exit code drifted");
}
if (fs.existsSync(summaryOut)) {
  throw new Error("second consumer runtime must not write output on failed invocation");
}

const success = await runSecondConsumerPilot({
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

if (success.exitCode !== permit.SECOND_CONSUMER_CONTRACT_EXIT_SUCCESS) {
  throw new Error("second consumer runtime success exit code drifted");
}
if (success.stdout !== "") {
  throw new Error("second consumer runtime should not emit stdout when writing to file");
}
if (!fs.existsSync(summaryOut)) {
  throw new Error("second consumer runtime should write output file on success");
}

const summaryContent = readText(summaryOut);
if (!summaryContent.endsWith(permit.SECOND_CONSUMER_CONTRACT_OUTPUT_EOL)) {
  throw new Error("second consumer runtime summary file newline drifted");
}

process.stdout.write("second consumer runtime stability verified\n");
