#!/usr/bin/env node
import process from "node:process";
import { buildDriftStatus } from "./status.mjs";

function parseArgs(argv) {
  const args = { window: "7d", format: "text", pretty: false };

  const a = [...argv];
  while (a.length) {
    const token = a.shift();
    if (token === "--window") args.window = a.shift() || "7d";
    if (token === "--format") args.format = a.shift() || "text";
    if (token === "--pretty") args.pretty = true;
  }
  return args;
}

function clamp(n, min, max) {
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function pct01(x, digits = 1) {
  const v = clamp(Number(x || 0), 0, 1) * 100;
  return `${v.toFixed(digits)}%`;
}

function fmtInt(n) {
  const v = Number(n || 0);
  return Number.isFinite(v) ? String(Math.trunc(v)) : "0";
}

function padRight(str, width) {
  const s = String(str ?? "");
  if (s.length >= width) return s;
  return s + " ".repeat(width - s.length);
}

function padLeft(str, width) {
  const s = String(str ?? "");
  if (s.length >= width) return s;
  return " ".repeat(width - s.length) + s;
}

function shortenMiddle(s, maxLen = 48) {
  const str = String(s ?? "");
  if (str.length <= maxLen) return str;
  // keep tail to preserve meaning (paths/modules)
  const tailLen = Math.max(16, Math.floor(maxLen * 0.6));
  const headLen = Math.max(6, maxLen - tailLen - 1);
  return `${str.slice(0, headLen)}…${str.slice(str.length - tailLen)}`;
}

function concentrationNote(dominanceRatio) {
  const r = Number(dominanceRatio || 0);
  if (r >= 0.7) return "concentrated";
  if (r >= 0.4) return "mixed";
  return "spread";
}

/**
 * v0.27.1: dominance text rendering (signal-only)
 * - Only improves human readability
 * - No governance semantics (no risk/verdict words)
 * - JSON output remains unchanged
 */
function renderDominanceText(bundle) {
  const dom = bundle?.dominance;
  if (!dom || !Array.isArray(dom.top_modules) || dom.top_modules.length === 0) return "";

  const lines = [];
  const note = concentrationNote(dom.dominance_ratio);

  lines.push("");
  lines.push("Drift Dominance (signal-only)");
  lines.push("----------------------------");
  lines.push(`dominance_ratio: ${pct01(dom.dominance_ratio)}  (note: ${note})`);
  lines.push(`top3_share:      ${pct01(dom.top3_share)}`);
  lines.push(`total:           ${fmtInt(dom.total_contribution)} ${dom.metric || ""}`.trim());
  lines.push("");

  // Table header
  const colRank = 5;
  const colShare = 8;
  const colContrib = 10;
  const colModule = 52;

  lines.push(
    `${padRight("Rank", colRank)}  ${padRight("Share", colShare)}  ${padRight(
      "Contrib",
      colContrib
    )}  ${padRight("Module", colModule)}`
  );
  lines.push(
    `${"-".repeat(colRank)}  ${"-".repeat(colShare)}  ${"-".repeat(colContrib)}  ${"-".repeat(
      colModule
    )}`
  );

  for (const m of dom.top_modules) {
    const rank = `#${m.rank ?? "?"}`;
    const share = pct01(m.share);
    const contrib = fmtInt(m.contribution);
    const mod = shortenMiddle(m.module ?? "unknown", colModule);
    lines.push(
      `${padRight(rank, colRank)}  ${padLeft(share, colShare)}  ${padLeft(
        contrib,
        colContrib
      )}  ${padRight(mod, colModule)}`
    );
  }

  // Cross-boundary details (only if present)
  const cb = dom?.cross_boundary;
  if (cb?.is_cross_boundary) {
    lines.push("");
    lines.push("Cross-boundary drift (signal-only)");
    lines.push("-------------------------------");

    const boundaries = Array.isArray(cb.boundaries) ? cb.boundaries : [];
    if (boundaries.length === 0) {
      lines.push("detected: yes (no boundary breakdown available)");
    } else {
      const colB = 16;
      const colBS = 8;
      const colBC = 10;

      lines.push(
        `${padRight("Boundary", colB)}  ${padRight("Share", colBS)}  ${padRight("Contrib", colBC)}`
      );
      lines.push(`${"-".repeat(colB)}  ${"-".repeat(colBS)}  ${"-".repeat(colBC)}`);

      for (const b of boundaries) {
        lines.push(
          `${padRight(String(b.boundary ?? "unknown"), colB)}  ${padLeft(
            pct01(b.share),
            colBS
          )}  ${padLeft(fmtInt(b.contribution), colBC)}`
        );
      }
    }
  }

  return lines.join("\n");
}

function renderText(bundle) {
  const base = `
Drift Status
------------
Window: ${bundle.window}
Trend: ${bundle.trend}
Density: ${bundle.signal.density} events/day
Expansion: +${bundle.signal.expansion} modules
Unique Modules: ${bundle.signal.unique_modules}
Events (current): ${bundle.explain.events}
Events (prev): ${bundle.explain.events_prev}
`.trim();

  const domText = renderDominanceText(bundle);
  return domText ? `${base}\n\n${domText}` : base;
}

const args = parseArgs(process.argv.slice(2));
const repoRoot = process.cwd();

const bundle = buildDriftStatus({
  repoRoot,
  window: args.window,
});

if (args.format === "json") {
  // v0.27.1: JSON output remains unchanged
  const json = args.pretty ? JSON.stringify(bundle, null, 2) : JSON.stringify(bundle);
  console.log(json);
} else {
  console.log(renderText(bundle));
}
