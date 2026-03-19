#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import {
  SECOND_CONSUMER_PILOT_SURFACE,
  SECOND_CONSUMER_PILOT_MODE,
  SECOND_CONSUMER_PILOT_REQUIRED_INPUTS,
  SECOND_CONSUMER_PILOT_OPTIONAL_INPUTS,
  SECOND_CONSUMER_PILOT_AUDIT_BOUND_EXCLUSIONS,
  loadSecondConsumerPilotInputs,
  buildSecondConsumerPilotSummary,
  renderSecondConsumerPilotSummary,
  getSecondConsumerPilotSummaryHash,
} from "./runtime/governance/permit/index.mjs";

function renderHelp() {
  return [
    "MindForge Guard - Second Consumer Pilot",
    "",
    "Usage:",
    "  node packages/guard/src/runSecondConsumerPilot.mjs [options]",
    "",
    "Required:",
    "  --permit-gate-result-in <file>",
    "  --governance-decision-record-in <file>",
    "  --governance-activation-record-in <file>",
    "",
    "Optional:",
    "  --governance-outcome-bundle-in <file>",
    "  --governance-application-record-in <file>",
    "  --governance-disposition-in <file>",
    "  --out <file>",
    "  --pretty",
    "  --help",
    "",
    `Pilot surface: ${SECOND_CONSUMER_PILOT_SURFACE}`,
    `Pilot mode: ${SECOND_CONSUMER_PILOT_MODE}`,
    `Required artifacts: ${SECOND_CONSUMER_PILOT_REQUIRED_INPUTS.join(", ")}`,
    `Optional artifacts: ${SECOND_CONSUMER_PILOT_OPTIONAL_INPUTS.join(", ")}`,
    `Audit-bound exclusions: ${SECOND_CONSUMER_PILOT_AUDIT_BOUND_EXCLUSIONS.join(", ")}`,
    "Output encoding: utf8",
    "Output mode: atomic_replace",
    "Replay safety: same_inputs_same_summary",
  ].join("\n");
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFileAtomic(filePath, content) {
  const dirPath = path.dirname(filePath);
  ensureDir(dirPath);

  const tempPath = path.join(
    dirPath,
    `.second-consumer-pilot-${process.pid}-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}.tmp`
  );
  fs.writeFileSync(tempPath, content, "utf8");
  try {
    fs.renameSync(tempPath, filePath);
  } catch {
    try {
      fs.rmSync(filePath, { force: true });
    } catch {}
    fs.renameSync(tempPath, filePath);
  } finally {
    try {
      fs.rmSync(tempPath, { force: true });
    } catch {}
  }
}

function parseArgs(argv) {
  const args = {
    pretty: false,
    out: null,
    permitGateResultPath: null,
    governanceDecisionRecordPath: null,
    governanceActivationRecordPath: null,
    governanceOutcomeBundlePath: null,
    governanceApplicationRecordPath: null,
    governanceDispositionPath: null,
    governanceReceiptPath: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const next = argv[index + 1];

    if (token === "--help" || token === "-h") {
      args.help = true;
      continue;
    }
    if (token === "--pretty") {
      args.pretty = true;
      continue;
    }

    if (token === "--out") {
      if (!next || next.startsWith("--")) throw new Error("--out requires a file path");
      args.out = next;
      index += 1;
      continue;
    }

    const mapping = {
      "--permit-gate-result-in": "permitGateResultPath",
      "--governance-decision-record-in": "governanceDecisionRecordPath",
      "--governance-activation-record-in": "governanceActivationRecordPath",
      "--governance-outcome-bundle-in": "governanceOutcomeBundlePath",
      "--governance-application-record-in": "governanceApplicationRecordPath",
      "--governance-disposition-in": "governanceDispositionPath",
      "--governance-receipt-in": "governanceReceiptPath",
    };

    if (token in mapping) {
      if (!next || next.startsWith("--")) throw new Error(`${token} requires a file path`);
      args[mapping[token]] = next;
      index += 1;
      continue;
    }

    throw new Error(`unknown argument: ${token}`);
  }

  return args;
}

export async function runSecondConsumerPilot({
  argv = process.argv.slice(2),
  stdout = process.stdout,
  stderr = process.stderr,
} = {}) {
  try {
    const args = parseArgs(argv);
    if (args.help) {
      const message = `${renderHelp()}\n`;
      if (stdout) stdout.write(message);
      return { exitCode: 0, stdout: message };
    }

    const inputs = loadSecondConsumerPilotInputs(args);
    const summary = buildSecondConsumerPilotSummary(inputs);
    const output = renderSecondConsumerPilotSummary(summary, { pretty: args.pretty });
    const summaryHash = getSecondConsumerPilotSummaryHash(summary, { pretty: args.pretty });

    if (args.out) {
      writeFileAtomic(args.out, output);
    } else if (stdout) {
      stdout.write(output);
    }

    return {
      exitCode: 0,
      summary,
      summaryHash,
      stdout: args.out ? "" : output,
    };
  } catch (error) {
    const message = `${error?.message || String(error)}\n`;
    if (stderr) stderr.write(message);
    return {
      exitCode: 1,
      message: error?.message || String(error),
      stderr: message,
    };
  }
}

const isMain =
  process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isMain) {
  const result = await runSecondConsumerPilot();
  process.exitCode = result.exitCode;
}
