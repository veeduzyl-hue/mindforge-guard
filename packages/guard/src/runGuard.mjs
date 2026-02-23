#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

import { loadPolicy } from "../../kernel/src/policy.mjs";
import { runAudit } from "./runAudit.mjs";
import { runSnapshot } from "../../kernel/src/snapshot.mjs";
import {
  validatePolicyFile,
  defaultPolicyPath,
} from "../../kernel/src/validatePolicy.mjs";

// v0.24 Enterprise Hooks (minimal, internal)
import { loadHookConfig } from "./hooks/hook_config.mjs";
import { invokeEnterpriseHook } from "./hooks/hook_invoke.mjs";

// v0.26 Drift (signal-only)
import { buildDriftStatus } from "./runtime/drift/status.mjs";

// v0.28
import { buildTimeline } from "./runtime/drift/timeline.mjs";
import { buildCompare } from "./runtime/drift/compare.mjs";

// v0.29 (signal-only analytics surface)
import { buildAssociationBundle } from "./runtime/association/index.mjs";

const GUARD_VERSION = "1.0.0";

// DS-EXIT-001: keep stable defaults for packaging failures
const EXIT_ERROR_DEFAULT = 30;

function renderGuardHelp() {
  return [
    "Guard — AI Coding Safety Layer",
    "",
    "Usage:",
    "  guard <command> [options]",
    "",
    "Getting started:",
    "  guard status",
    "  guard init",
    "",
    "Core:",
    "  guard validate-policy [--path=<file>]",
    "  guard audit ...",
    "  guard snapshot ...",
    "",
    "Drift (signal-only; no policy required):",
    "  guard drift status   [--window 7d|14d|30d] [--format text|json] [--pretty] [--out <file>]",
    "  guard drift timeline [--window 7d|14d|30d]",
    "  guard drift compare  [--window 7d|14d|30d]",
    "",
    "Analytics (signal-only; no policy required):",
    "  guard assoc correlate [--window 7d|14d|30d] [--bucket day]",
    "                       [--x drift_density|drift_events|drift_unique_modules]",
    "                       [--y risk_score_avg|risk_score_p95|risk_events]",
    "                       [--lags <n>] [--subsamples <n>]",
    "                       [--eventsPath <file>] [--auditPath <file>]",
    "                       [--pretty]",
    "",
    "Options:",
    "  --help, -h     Show help",
    "  --version, -v  Show version",
    "",
  ].join("\n");
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeFileAtomic(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

function getRepoPolicyPath(repoRoot) {
  return path.join(repoRoot, ".mindforge", "config", "policy.json");
}

function policyMissingMessage(policyPath) {
  return (
    "Guard is not initialized for this repo.\n" +
    `Missing policy file: ${policyPath}\n\n` +
    "Run:\n" +
    "  guard init\n"
  );
}

/**
 * Minimal default policy (Community).
 * Intentionally small and stable to keep 1.0 packaging crisp.
 */
function defaultPolicyJson() {
  return {
    v: 1,
    edition: "community",
    exit_codes: {
      ok: 0,
      soft_block: 10,
      hard_block: 20,
      error: 30,
    },
    limits: {
      lines_added_soft: 900,
      files_changed_hard: 16,
    },
  };
}

function parseInitArgs(argv) {
  const out = { force: false, dryRun: false, help: false };
  for (const t of argv) {
    if (t === "--force") out.force = true;
    else if (t === "--dry-run") out.dryRun = true;
    else if (t === "--help" || t === "-h") out.help = true;
  }
  return out;
}

function renderInitHelp() {
  return [
    "guard init",
    "",
    "Usage:",
    "  guard init [--force] [--dry-run]",
    "",
    "Options:",
    "  --force     Overwrite existing policy file",
    "  --dry-run   Print policy content without writing files",
    "",
  ].join("\n");
}

function parseDriftArgs(argv) {
  const out = {
    window: "7d",
    format: "text",
    pretty: false,
    out: null,
    help: false,
  };
  const a = [...argv];
  while (a.length) {
    const t = a.shift();
    if (t === "--window") out.window = a.shift() || "7d";
    else if (t === "--format") out.format = a.shift() || "text";
    else if (t === "--pretty") out.pretty = true;
    else if (t === "--out") out.out = a.shift() || null;
    else if (t === "--help" || t === "-h") out.help = true;
  }
  return out;
}

function renderDriftHelp() {
  return [
    "guard drift <status|timeline|compare>",
    "",
    "Usage:",
    "  guard drift status   [--window 7d|14d|30d] [--format text|json] [--pretty] [--out <file>]",
    "  guard drift timeline [--window 7d|14d|30d]",
    "  guard drift compare  [--window 7d|14d|30d]",
    "",
    "Notes:",
    "  - signal-only; does NOT affect exit codes",
    "",
  ].join("\n");
}

function renderDriftText(bundle) {
  return (
    `
Drift Status
------------
Window: ${bundle.window}
Trend: ${bundle.trend}
Density: ${bundle.signal.density} events/day
Expansion: +${bundle.signal.expansion} modules
Unique Modules: ${bundle.signal.unique_modules}
Events (current): ${bundle.explain.events}
Events (prev): ${bundle.explain.events_prev}
`.trim() + "\n"
  );
}

function stableDriftBundle({ window }) {
  return {
    kind: "drift_signal_bundle",
    v: 2,
    window: window || "7d",
    generated_at: new Date().toISOString(),
    trend: "stable",
    signal: { density: 0, slope: 0, expansion: 0, unique_modules: 0 },
    explain: { events: 0, events_prev: 0 },
    policy: { affects_exit: false, affects_risk_v1: false },
  };
}

/* -------------------------
 * v0.29 assoc (signal-only)
 * ------------------------- */

function parseAssocArgs(argv) {
  const out = {
    window: "7d",
    bucket: "day",
    x: "drift_density",
    y: "risk_score_avg",
    lags: null,
    subsamples: 100,
    eventsPath: null,
    auditPath: null,
    pretty: false,
    help: false,
  };

  const a = [...argv];
  while (a.length) {
    const t = a.shift();
    if (t === "--window") out.window = a.shift() || "7d";
    else if (t === "--bucket") out.bucket = a.shift() || "day";
    else if (t === "--x") out.x = a.shift() || "drift_density";
    else if (t === "--y") out.y = a.shift() || "risk_score_avg";
    else if (t === "--lags") out.lags = a.shift() || null;
    else if (t === "--subsamples") out.subsamples = a.shift() || 100;
    else if (t === "--eventsPath") out.eventsPath = a.shift() || null;
    else if (t === "--auditPath") out.auditPath = a.shift() || null;
    else if (t === "--pretty") out.pretty = true;
    else if (t === "--help" || t === "-h") out.help = true;
  }

  return out;
}

function renderAssocHelp() {
  return [
    "guard assoc correlate",
    "",
    "Usage:",
    "  guard assoc correlate [--window 7d|14d|30d] [--bucket day]",
    "                       [--x drift_density|drift_events|drift_unique_modules]",
    "                       [--y risk_score_avg|risk_score_p95|risk_events]",
    "                       [--lags <n>] [--subsamples <n>]",
    "                       [--eventsPath <file>] [--auditPath <file>]",
    "                       [--pretty]",
    "",
    "Notes:",
    "  - signal-only analytics; does NOT affect exit codes",
    "  - outputs a single JSON object",
    "",
  ].join("\n");
}

function stableAssocBundle({ window, bucket, x, y }) {
  return {
    kind: "association_bundle",
    v: 1,
    generated_at: new Date().toISOString(),
    window: window || "7d",
    bucket: bucket || "day",
    metric_x: x || "drift_density",
    metric_y: y || "risk_score_avg",
    series: [],
    results: {
      pearson: { r: 0, n: 0 },
      lags: [{ lag_days: 0, r: 0, n: 0 }],
      robustness: {
        method: "block_bootstrap",
        subsamples: 100,
        median_r: 0,
        iqr_r: 0,
        stability: "low",
      },
    },
  };
}

/* -------------------------
 * status (product UX)
 * ------------------------- */

function safeTry(fn, fallback) {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

function renderStatusText({ repoRoot, policyState, driftState, licenseState }) {
  const lines = [];
  lines.push("Guard Status");
  lines.push("------------");

  // Policy
  if (policyState.kind === "missing") {
    lines.push(`Policy: missing`);
    lines.push(`  path: ${policyState.path}`);
    lines.push(`  next: guard init`);
  } else if (policyState.kind === "ok") {
    lines.push(`Policy: ok`);
    lines.push(`  edition: ${policyState.edition}`);
    lines.push(`  path: ${policyState.path}`);
  } else {
    lines.push(`Policy: error`);
    lines.push(`  reason: ${policyState.reason}`);
  }

  // Drift
  if (driftState.kind === "ok") {
    lines.push("");
    lines.push(`Drift: ${driftState.trend}`);
    lines.push(`  window: ${driftState.window}`);
    lines.push(`  density: ${driftState.density} events/day`);
    lines.push(`  unique_modules: ${driftState.unique_modules}`);
  } else {
    lines.push("");
    lines.push(`Drift: unavailable`);
  }

  // License (placeholder until we wire real license commands)
  lines.push("");
  lines.push(`License: ${licenseState.state}`);
  if (licenseState.note) lines.push(`  note: ${licenseState.note}`);

  lines.push("");
  lines.push(`Repo: ${repoRoot}`);

  return lines.join("\n") + "\n";
}

function detectLicensePlaceholder() {
  // v1.0: we haven't shipped license commands yet in this repo.
  // Keep a stable user-facing message.
  return { state: "not configured", note: "License commands not enabled in 1.0 packaging yet" };
}

export async function runGuard({ argv }) {
  if (!argv || argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
    return { exitCode: 0, stdout: renderGuardHelp() + "\n" };
  }
  if (argv.includes("--version") || argv.includes("-v")) {
    return { exitCode: 0, stdout: `guard ${GUARD_VERSION}\n` };
  }

  const cmd = argv[0];
  const repoRoot = process.cwd();

  // -------------------------
  // status (Day-0 UX)
  // -------------------------
  if (cmd === "status") {
    const policyPath = getRepoPolicyPath(repoRoot);

    // Policy state
    let policyState;
    if (!fs.existsSync(policyPath)) {
      policyState = { kind: "missing", path: policyPath };
    } else {
      // Best-effort parse; do not explode status if policy is malformed
      const parsed = safeTry(() => JSON.parse(fs.readFileSync(policyPath, "utf8")), null);
      if (parsed && typeof parsed === "object") {
        policyState = {
          kind: "ok",
          edition: parsed.edition || "unknown",
          path: policyPath,
        };
      } else {
        policyState = { kind: "error", reason: "policy.json is not valid JSON", path: policyPath };
      }
    }

    // Drift state (signal-only)
    const driftBundle = safeTry(
      () => buildDriftStatus({ repoRoot, window: "7d" }),
      stableDriftBundle({ window: "7d" })
    );
    const driftState = {
      kind: "ok",
      trend: driftBundle.trend,
      window: driftBundle.window,
      density: driftBundle.signal?.density ?? 0,
      unique_modules: driftBundle.signal?.unique_modules ?? 0,
    };

    const licenseState = detectLicensePlaceholder();

    return {
      exitCode: 0,
      stdout: renderStatusText({ repoRoot, policyState, driftState, licenseState }),
    };
  }

  // -------------------------
  // init (Day-0 UX)
  // -------------------------
  if (cmd === "init") {
    const args = parseInitArgs(argv.slice(1));
    if (args.help) return { exitCode: 0, stdout: renderInitHelp() + "\n" };

    const policyPath = getRepoPolicyPath(repoRoot);
    const exists = fs.existsSync(policyPath);

    if (exists && !args.force) {
      return {
        exitCode: 0,
        stdout:
          `Guard already initialized: ${policyPath}\n` +
          `Tip: re-run with --force to overwrite.\n`,
      };
    }

    const policy = defaultPolicyJson();
    const content = JSON.stringify(policy, null, 2) + "\n";

    if (args.dryRun) {
      return {
        exitCode: 0,
        stdout:
          `Dry-run: would write policy to ${policyPath}\n\n` +
          content,
      };
    }

    writeFileAtomic(policyPath, content);
    ensureDir(path.join(repoRoot, ".mindforge", "drift"));
    ensureDir(path.join(repoRoot, ".mindforge", "audit"));

    return {
      exitCode: 0,
      stdout: `Initialized Guard: ${policyPath}\n`,
    };
  }

  // -------------------------
  // validate-policy (no need to load repo policy)
  // -------------------------
  if (cmd === "validate-policy") {
    const args = argv.slice(1);
    const pathArg = args.find((a) => a.startsWith("--path="));
    const p = pathArg ? pathArg.split("=").slice(1).join("=") : defaultPolicyPath();
    const res = validatePolicyFile(p);

    if (res.ok) {
      return { exitCode: 0, stdout: `[mindforge] policy valid: ${p}\n` };
    } else {
      let err = `[mindforge] policy invalid: ${p}\n`;
      for (const e of res.errors) err += `- ${e}\n`;
      return { exitCode: 20, stderr: err };
    }
  }

  // -------------------------
  // drift surface (signal-only; NO policy required)
  // -------------------------
  if (cmd === "drift") {
    const sub = argv[1] || "status";
    const args = parseDriftArgs(argv.slice(2));

    if (args.help) return { exitCode: 0, stdout: renderDriftHelp() + "\n" };

    if (sub === "status") {
      let bundle;
      try {
        bundle = buildDriftStatus({ repoRoot, window: args.window });
      } catch {
        bundle = stableDriftBundle({ window: args.window });
      }

      let text;
      if (args.format === "json") {
        text = args.pretty ? JSON.stringify(bundle, null, 2) + "\n" : JSON.stringify(bundle) + "\n";
      } else {
        text = renderDriftText(bundle);
      }

      if (args.out) {
        const abs = path.isAbsolute(args.out) ? args.out : path.join(repoRoot, args.out);
        ensureDir(path.dirname(abs));
        fs.writeFileSync(abs, text, "utf8");
        return { exitCode: 0, stdout: abs + "\n" };
      }

      return { exitCode: 0, stdout: text };
    }

    if (sub === "timeline") {
      try {
        const result = buildTimeline({
          eventsPath: path.join(repoRoot, ".mindforge", "drift", "events.jsonl"),
          window: args.window,
        });
        return { exitCode: 0, stdout: JSON.stringify(result, null, 2) + "\n" };
      } catch {
        return {
          exitCode: 0,
          stdout:
            JSON.stringify(
              {
                kind: "drift_timeline",
                v: 1,
                window: args.window,
                bucket: "day",
                generated_at: new Date().toISOString(),
                series: [],
              },
              null,
              2
            ) + "\n",
        };
      }
    }

    if (sub === "compare") {
      try {
        const result = buildCompare({
          eventsPath: path.join(repoRoot, ".mindforge", "drift", "events.jsonl"),
          window: args.window,
        });
        return { exitCode: 0, stdout: JSON.stringify(result, null, 2) + "\n" };
      } catch {
        return {
          exitCode: 0,
          stdout:
            JSON.stringify(
              {
                kind: "drift_compare",
                v: 1,
                window: args.window,
                generated_at: new Date().toISOString(),
                a: {},
                b: {},
                delta: {},
              },
              null,
              2
            ) + "\n",
        };
      }
    }

    return { exitCode: 0, stdout: renderDriftHelp() + "\n" };
  }

  // -------------------------
  // assoc surface (signal-only; NO policy required)
  // -------------------------
  if (cmd === "assoc") {
    const sub = argv[1] || "correlate";
    const args = parseAssocArgs(argv.slice(2));

    if (args.help || sub !== "correlate") {
      return { exitCode: 0, stdout: renderAssocHelp() + "\n" };
    }

    let bundle;
    try {
      bundle = buildAssociationBundle({
        repoRoot,
        window: args.window,
        bucket: args.bucket,
        metric_x: args.x,
        metric_y: args.y,
        lags: args.lags,
        subsamples: args.subsamples,
        eventsPath: args.eventsPath,
        auditPath: args.auditPath,
      });
    } catch {
      bundle = stableAssocBundle({ window: args.window, bucket: args.bucket, x: args.x, y: args.y });
    }

    const text = args.pretty ? JSON.stringify(bundle, null, 2) + "\n" : JSON.stringify(bundle) + "\n";
    return { exitCode: 0, stdout: text };
  }

  // -------------------------
  // Commands below REQUIRE policy (audit/snapshot/etc.)
  // -------------------------
  let policy;
  try {
    policy = await loadPolicy({ repoRoot });
  } catch (err) {
    if (err?.code === "MF_POLICY_MISSING") {
      return {
        exitCode: EXIT_ERROR_DEFAULT,
        stderr: policyMissingMessage(err.policy_path || getRepoPolicyPath(repoRoot)),
      };
    }
    throw err;
  }

  // audit
  if (cmd === "audit") {
    const result = await runAudit({ argv, policy });
    return { exitCode: result.exitCode };
  }

  // snapshot
  if (cmd === "snapshot") {
    const result = runSnapshot({ argv, policy });
    return {
      exitCode: result.exitCode,
      stdout: result?.stdout ? String(result.stdout).trimEnd() + "\n" : "",
      stderr: result?.stderr ? String(result.stderr).trimEnd() + "\n" : "",
    };
  }

  // hooks (internal; not in help)
  if (cmd === "hook") {
    try {
      const cfg = loadHookConfig({ repoRoot });
      const out = await invokeEnterpriseHook({ argv: argv.slice(1), config: cfg, policy });
      return { exitCode: out?.exitCode ?? 0, stdout: out?.stdout, stderr: out?.stderr };
    } catch {
      return { exitCode: 0, stdout: "" };
    }
  }

  // Unknown command -> show help + non-zero
  return {
    exitCode: policy.exit_codes?.error ?? EXIT_ERROR_DEFAULT,
    stdout: renderGuardHelp() + "\n",
  };
}

async function main() {
  const result = await runGuard({ argv: process.argv.slice(2) });

  if (result?.stdout) process.stdout.write(String(result.stdout));
  if (result?.stderr) process.stderr.write(String(result.stderr));

  const code =
    typeof result?.exitCode === "number" && Number.isFinite(result.exitCode)
      ? result.exitCode
      : 0;

  process.exit(code);
}

main().catch((err) => {
  const msg = err?.stack || err?.message || String(err);
  process.stderr.write(msg + "\n");
  process.exit(1);
});