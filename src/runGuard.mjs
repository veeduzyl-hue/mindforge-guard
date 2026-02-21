import fs from "node:fs";
import path from "node:path";

import { loadPolicy } from "../../kernel/src/policy.mjs";
import { runAudit } from "./runAudit.mjs";
import { runSnapshot } from "../../kernel/src/snapshot.mjs";
import {
  validatePolicyFile,
  defaultPolicyPath,
} from "../../kernel/src/validatePolicy.mjs";
import {
  getStagedTreeHash,
  hasAckForTree,
  writeAckForTree,
} from "./ackManager.mjs";

// v0.24 Enterprise Hooks (minimal, internal)
import { loadHookConfig } from "./hooks/hook_config.mjs";
import { invokeEnterpriseHook } from "./hooks/hook_invoke.mjs";

// v0.26 Drift (signal-only)
import { buildDriftStatus } from "./runtime/drift/status.mjs";

// v0.28 NEW
import { buildTimeline } from "./runtime/drift/timeline.mjs";
import { buildCompare } from "./runtime/drift/compare.mjs";

// v0.29 NEW (signal-only analytics surface)
import { buildAssociationBundle } from "./runtime/association/index.mjs";

function parseFlag(argv, flag) {
  return argv.includes(flag);
}

function parseValue(argv, key) {
  const pref = `${key}=`;
  const hit = argv.find((a) => a.startsWith(pref));
  return hit ? hit.slice(pref.length) : undefined;
}

function parseDriftArgs(argv) {
  const out = { window: "7d", format: "text", pretty: false, out: null, help: false };
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
    "mf drift <status|timeline|compare>",
    "",
    "Usage:",
    "  mf drift status   [--window 7d|14d|30d] [--format text|json] [--pretty] [--out <file>]",
    "  mf drift timeline [--window 7d|14d|30d]",
    "  mf drift compare  [--window 7d|14d|30d]",
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

function stableBundle({ window }) {
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
    "mf assoc correlate",
    "",
    "Usage:",
    "  mf assoc correlate [--window 7d|14d|30d] [--bucket day]",
    "                    [--x drift_density|drift_events|drift_unique_modules]",
    "                    [--y risk_score_avg|risk_score_p95|risk_events]",
    "                    [--lags <n>] [--subsamples <n>]",
    "                    [--eventsPath <file>] [--auditPath <file>]",
    "                    [--pretty]",
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

export async function runGuard({ argv }) {
  const cmd = argv[0];

  // -------------------------
  // validate-policy
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

  const policy = await loadPolicy();

  // -------------------------
  // drift surface
  // -------------------------
  if (cmd === "drift") {
    const sub = argv[1] || "status";
    const args = parseDriftArgs(argv.slice(2));
    const repoRoot = process.cwd();

    if (args.help) {
      return { exitCode: 0, stdout: renderDriftHelp() + "\n" };
    }

    // -------------------------
    // status (existing)
    // -------------------------
    if (sub === "status") {
      let bundle;
      try {
        bundle = buildDriftStatus({
          repoRoot,
          window: args.window,
        });
      } catch {
        bundle = stableBundle({ window: args.window });
      }

      let text;
      if (args.format === "json") {
        text = args.pretty
          ? JSON.stringify(bundle, null, 2) + "\n"
          : JSON.stringify(bundle) + "\n";
      } else {
        text = renderDriftText(bundle);
      }

      if (args.out) {
        const abs = path.isAbsolute(args.out)
          ? args.out
          : path.join(process.cwd(), args.out);
        fs.mkdirSync(path.dirname(abs), { recursive: true });
        fs.writeFileSync(abs, text, "utf8");
        return { exitCode: 0, stdout: abs + "\n" };
      }

      return { exitCode: 0, stdout: text };
    }

    // -------------------------
    // timeline (v0.28)
    // -------------------------
    if (sub === "timeline") {
      try {
        const result = buildTimeline({
          eventsPath: path.join(repoRoot, ".mindforge", "drift", "events.jsonl"),
          window: args.window,
        });

        return {
          exitCode: 0,
          stdout: JSON.stringify(result, null, 2) + "\n",
        };
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

    // -------------------------
    // compare (v0.28)
    // -------------------------
    if (sub === "compare") {
      try {
        const result = buildCompare({
          eventsPath: path.join(repoRoot, ".mindforge", "drift", "events.jsonl"),
          window: args.window,
        });

        return {
          exitCode: 0,
          stdout: JSON.stringify(result, null, 2) + "\n",
        };
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
  // assoc surface (v0.29)
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
        repoRoot: process.cwd(),
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
      bundle = stableAssocBundle({
        window: args.window,
        bucket: args.bucket,
        x: args.x,
        y: args.y,
      });
    }

    const text = args.pretty
      ? JSON.stringify(bundle, null, 2) + "\n"
      : JSON.stringify(bundle) + "\n";

    return { exitCode: 0, stdout: text };
  }

  // -------------------------
  // audit (unchanged)
  // -------------------------
  if (cmd === "audit") {
    const result = await runAudit({ argv, policy });
    return { exitCode: result.exitCode };
  }

  // -------------------------
  // snapshot
  // -------------------------
  if (cmd === "snapshot") {
    const result = runSnapshot({ argv, policy });
    return {
      exitCode: result.exitCode,
      stdout: result?.stdout ? String(result.stdout).trimEnd() + "\n" : "",
      stderr: result?.stderr ? String(result.stderr).trimEnd() + "\n" : "",
    };
  }

  return { exitCode: policy.exit_codes?.error ?? 30 };
}