import fs from "node:fs";
import path from "node:path";

import { buildDriftDailySeries } from "./series_from_drift_events.mjs";
import { buildRiskDailySeries } from "./series_from_risk_audit.mjs";

function windowToDays(w) {
  if (w === "14d") return 14;
  if (w === "30d") return 30;
  return 7;
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function quantile(sorted, q) {
  if (!sorted.length) return 0;
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  const v0 = sorted[base];
  const v1 = sorted[Math.min(base + 1, sorted.length - 1)];
  return v0 + rest * (v1 - v0);
}

/**
 * Pearson with diagnostics:
 * - n_effective: number of finite pairs
 * - degenerate: true if n_effective<3 or variance_x==0 or variance_y==0
 */
function pearsonStats(xs, ys) {
  const pairs = [];
  for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
    const x = xs[i];
    const y = ys[i];
    if (Number.isFinite(x) && Number.isFinite(y)) pairs.push([x, y]);
  }

  const n_effective = pairs.length;
  if (n_effective < 3) {
    return { r: 0, n_effective, degenerate: true, variance_x: 0, variance_y: 0 };
  }

  let sx = 0, sy = 0;
  for (const [x, y] of pairs) { sx += x; sy += y; }
  const mx = sx / n_effective;
  const my = sy / n_effective;

  let num = 0, dx = 0, dy = 0;
  for (const [x, y] of pairs) {
    const ax = x - mx;
    const ay = y - my;
    num += ax * ay;
    dx += ax * ax;
    dy += ay * ay;
  }

  const variance_x = dx / (n_effective - 1);
  const variance_y = dy / (n_effective - 1);

  const den = Math.sqrt(dx) * Math.sqrt(dy);
  if (!den) {
    return {
      r: 0,
      n_effective,
      degenerate: true,
      variance_x: Number(variance_x.toFixed(6)),
      variance_y: Number(variance_y.toFixed(6))
    };
  }

  const r = num / den;
  return {
    r: Number(clamp(r, -1, 1).toFixed(4)),
    n_effective,
    degenerate: false,
    variance_x: Number(variance_x.toFixed(6)),
    variance_y: Number(variance_y.toFixed(6))
  };
}

function computeLagStats(xs, ys, lagDays) {
  const n = Math.min(xs.length, ys.length);
  const ax = [];
  const ay = [];

  // lagDays > 0: x leads y  (x[t] vs y[t+lag])
  // lagDays < 0: y leads x  (x[t-lag] vs y[t])
  for (let i = 0; i < n; i++) {
    const j = i + lagDays;
    if (j < 0 || j >= n) continue;
    ax.push(xs[i]);
    ay.push(ys[j]);
  }

  const s = pearsonStats(ax, ay);
  const deg = s.degenerate || s.n_effective < 3;
  return { r: deg ? 0 : s.r, n_effective: s.n_effective, degenerate: deg, n_pairs: ax.length };
}

function blockBootstrapR(xs, ys, subsamples = 100, blockSize = 2) {
  const n = Math.min(xs.length, ys.length);
  if (n < 3) {
    return {
      method: "block_bootstrap",
      subsamples,
      samples_used: 0,
      degenerate_rate: 1,
      median_r: 0,
      iqr_r: 0,
      stability: "low",
      is_informative: false
    };
  }

  const rs = [];
  let degenerateCount = 0;

  const blocks = Math.max(1, Math.floor(n / blockSize));

  for (let s = 0; s < subsamples; s++) {
    const bx = [];
    const by = [];

    for (let b = 0; b < blocks; b++) {
      const start = Math.floor(Math.random() * Math.max(1, n - blockSize + 1));
      for (let k = 0; k < blockSize; k++) {
        const idx = start + k;
        if (idx >= n) break;
        bx.push(xs[idx]);
        by.push(ys[idx]);
      }
    }

    const p = pearsonStats(bx, by);
    if (p.degenerate || p.n_effective < 3) {
      degenerateCount += 1;
      continue;
    }
    rs.push(p.r);
  }

  rs.sort((a, b) => a - b);
  const samples_used = rs.length;
  const degenerate_rate = Number((degenerateCount / subsamples).toFixed(4));

  // "informative" means enough valid bootstrap samples and not mostly degenerate
  const is_informative = samples_used >= 20 && degenerate_rate <= 0.5;

  if (!is_informative) {
    return {
      method: "block_bootstrap",
      subsamples,
      samples_used,
      degenerate_rate,
      median_r: 0,
      iqr_r: 0,
      stability: "low",
      is_informative: false
    };
  }

  const median = quantile(rs, 0.5);
  const q1 = quantile(rs, 0.25);
  const q3 = quantile(rs, 0.75);
  const iqr = Math.max(0, q3 - q1);

  const abs = Math.abs(median);
  let stability = "low";
  if (abs >= 0.5 && iqr <= 0.2) stability = "high";
  else if (abs >= 0.3 && iqr <= 0.35) stability = "medium";

  return {
    method: "block_bootstrap",
    subsamples,
    samples_used,
    degenerate_rate,
    median_r: Number(clamp(median, -1, 1).toFixed(4)),
    iqr_r: Number(iqr.toFixed(4)),
    stability,
    is_informative: true
  };
}

function buildXYSeries({ driftDaily, riskDaily, metricX, metricY }) {
  const n = Math.min(driftDaily.length, riskDaily.length);
  const out = [];

  for (let i = 0; i < n; i++) {
    const t = driftDaily[i].t; // day-aligned
    const d = driftDaily[i];
    const r = riskDaily[i];

    let x = 0;
    if (metricX === "drift_unique_modules") x = Number(d.drift_unique_modules || 0);
    else if (metricX === "drift_events") x = Number(d.drift_events || 0);
    else x = Number(d.drift_events || 0); // drift_density for day bucket == events/day

    let y = 0;
    if (metricY === "risk_events") y = Number(r.risk_events || 0);
    else if (metricY === "risk_score_p95") y = Number(r.risk_score_p95 || 0);
    else y = Number(r.risk_score_avg || 0);

    out.push({ t, x, y });
  }

  return out;
}

/**
 * v0.29 (assoc) — statistically rigorous signal-only correlation bundle (v2)
 * - single JSON object output
 * - fail-safe computation
 */
export function buildAssociationBundle({
  repoRoot,
  window = "7d",
  bucket = "day",
  metric_x = "drift_density",
  metric_y = "risk_score_avg",
  lags = null,
  subsamples = 100,
  eventsPath = null,
  auditPath = null,
  nowMs = Date.now()
}) {
  const days = windowToDays(window);
  const maxLag = lags == null ? clamp(days, 3, 14) : clamp(Number(lags) || 0, 0, 14);
  const ss = clamp(Number(subsamples) || 100, 20, 500);

  const driftEventsPath =
    eventsPath || path.join(repoRoot, ".mindforge", "drift", "events.jsonl");

  // Default audit path fix:
  // Prefer: .mindforge/audit.jsonl
  // Fallback: .mindforge/artifacts/guard/audit.jsonl
  const auditPrimary = path.join(repoRoot, ".mindforge", "audit.jsonl");
  const auditFallback = path.join(repoRoot, ".mindforge", "artifacts", "guard", "audit.jsonl");
  const auditJsonlPath =
    auditPath || (fs.existsSync(auditPrimary) ? auditPrimary : auditFallback);

  const driftDaily = buildDriftDailySeries({
    eventsPath: driftEventsPath,
    window,
    nowMs
  });

  const riskDaily = buildRiskDailySeries({
    auditPath: auditJsonlPath,
    window,
    nowMs
  });

  const series = buildXYSeries({
    driftDaily,
    riskDaily,
    metricX: metric_x,
    metricY: metric_y
  });

  const xs = series.map(s => s.x);
  const ys = series.map(s => s.y);

  const nTotal = series.length;

  const nonzero_x_days = series.reduce((c, s) => c + (s.x !== 0 ? 1 : 0), 0);
  const nonzero_y_days = series.reduce((c, s) => c + (s.y !== 0 ? 1 : 0), 0);
  const nonzero_overlap_days = series.reduce((c, s) => c + ((s.x !== 0 && s.y !== 0) ? 1 : 0), 0);

  const notes = [];
  if (nonzero_x_days < 3) notes.push("sparse_x");
  if (nonzero_y_days < 3) notes.push("sparse_y");
  if (nonzero_overlap_days < 3) notes.push("low_overlap");

  const p = pearsonStats(xs, ys);
  if (p.degenerate && p.variance_y === 0) notes.push("degenerate_y");
  if (p.degenerate && p.variance_x === 0) notes.push("degenerate_x");

  const lagResults = [];
  for (let lag = -maxLag; lag <= maxLag; lag++) {
    const s = computeLagStats(xs, ys, lag);
    lagResults.push({
      lag_days: lag,
      r: s.r,
      n: nTotal,
      n_pairs: s.n_pairs,
      n_effective: s.n_effective,
      degenerate: s.degenerate
    });
  }

  const robust = blockBootstrapR(xs, ys, ss, 2);

  return {
    kind: "association_bundle",
    v: 2,
    generated_at: new Date().toISOString(),
    window,
    bucket,
    metric_x,
    metric_y,
    series,
    diagnostics: {
      window_days: nTotal,
      nonzero_x_days,
      nonzero_y_days,
      nonzero_overlap_days,
      missing_policy: "zero_fill",
      notes
    },
    results: {
      pearson: {
        r: p.degenerate ? 0 : p.r,
        n: nTotal,
        n_effective: p.n_effective,
        degenerate: p.degenerate,
        variance_x: p.variance_x,
        variance_y: p.variance_y
      },
      lags: lagResults,
      robustness: robust
    }
  };
}