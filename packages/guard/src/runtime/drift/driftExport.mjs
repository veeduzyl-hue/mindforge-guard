#!/usr/bin/env node
// packages/guard/src/runtime/drift/driftExport.mjs
/**
 * Drift Export (v0.25) — Contract-first, signal-only.
 *
 * Guarantees:
 * - Does NOT affect risk scoring, verdicts, or exit codes of existing flows.
 * - Outputs a DriftSignalBundle v2 JSON that conforms to drift.signal.schema.json.
 *
 * Notes:
 * - This is a standalone, user-invoked command.
 * - In v0.25 Contract-First stage, it emits a stable "noop" signal bundle.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { driftNoop } from "./driftNoop.mjs";

function printHelp() {
  const text = `
Usage:
  node packages/guard/src/runtime/drift/driftExport.mjs [options]

Options:
  --window <7d|14d|30d>     Rolling time window (default: 7d)
  --format <json>           Output format (default: json)
  --pretty                  Pretty-print JSON (2-space indent)
  --out <file>              Write output to a file (otherwise stdout)
  --help                    Show help

Accepted but ignored in v0.25 noop mode:
  --since <ISO>
  --surface <id>
  --module <prefix>

Behavior:
  - Always emits a drift_signal_bundle v2.
  - policy.affects_exit=false and policy.affects_risk_v1=false are always set.
`;
  process.stdout.write(text.trimStart());
}

function parseArgs(argv) {
  const args = {
    window: "7d",
    format: "json",
    pretty: false,
    out: null,

    // accepted (ignored in noop mode)
    since: null,
    surface: null,
    module: null,

    help: false,
  };

  const a = [...argv];
  while (a.length) {
    const token = a.shift();

    if (token === "--help" || token === "-h") {
      args.help = true;
      continue;
    }

    if (token === "--pretty") {
      args.pretty = true;
      continue;
    }

    const next = a[0];

    if (token === "--window" && next) {
      args.window = String(a.shift());
      continue;
    }
    if (token === "--format" && next) {
      args.format = String(a.shift());
      continue;
    }
    if (token === "--out" && next) {
      args.out = String(a.shift());
      continue;
    }

    // accepted but ignored in v0.25 noop mode
    if (token === "--since" && next) {
      args.since = String(a.shift());
      continue;
    }
    if (token === "--surface" && next) {
      args.surface = String(a.shift());
      continue;
    }
    if (token === "--module" && next) {
      args.module = String(a.shift());
      continue;
    }

    // Unknown token: ignore (do not fail; keep contract-first stability)
    process.stderr.write(`[drift] warning: unknown arg ignored: ${token}\n`);
  }

  return args;
}

function normalizeWindow(w) {
  if (w === "7d" || w === "14d" || w === "30d") return w;
  process.stderr.write(`[drift] warning: invalid --window "${w}", falling back to "7d"\n`);
  return "7d";
}

function normalizeFormat(f) {
  if (!f) return "json";
  const v = String(f).toLowerCase();
  if (v === "json") return "json";
  process.stderr.write(`[drift] warning: invalid --format "${f}", falling back to "json"\n`);
  return "json";
}

function ensureDirForFile(filePath) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    // Intentionally exit 0 (standalone tool; avoid introducing brittle nonzero codes)
    return;
  }

  const window = normalizeWindow(args.window);
  const format = normalizeFormat(args.format);

  // v0.25 Contract-First: emit noop bundle only
  const bundle = driftNoop(window);

  if (format !== "json") {
    // Defensive: should never happen due to normalizeFormat
    process.stderr.write(`[drift] warning: unsupported format "${format}", using json\n`);
  }

  const json = args.pretty
    ? JSON.stringify(bundle, null, 2) + "\n"
    : JSON.stringify(bundle) + "\n";

  if (args.out) {
    const outPath = path.isAbsolute(args.out)
      ? args.out
      : path.join(process.cwd(), args.out);
    ensureDirForFile(outPath);
    fs.writeFileSync(outPath, json, "utf8");
    process.stdout.write(outPath + "\n"); // prints where it wrote (useful for scripts)
  } else {
    process.stdout.write(json);
  }
}

main();
