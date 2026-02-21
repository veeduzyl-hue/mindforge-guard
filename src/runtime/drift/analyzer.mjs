import fs from "node:fs";

function parseJsonlSafe(path) {
  if (!fs.existsSync(path)) return [];
  const lines = fs.readFileSync(path, "utf8").split("\n").filter(Boolean);

  const out = [];
  for (const line of lines) {
    try {
      const obj = JSON.parse(line);
      if (obj?.kind === "drift_event" && obj?.v === 2) {
        out.push(obj);
      }
    } catch {
      // swallow bad lines
    }
  }
  return out;
}

function daysToMs(days) {
  return days * 24 * 60 * 60 * 1000;
}

function windowToDays(w) {
  if (w === "14d") return 14;
  if (w === "30d") return 30;
  return 7;
}

/**
 * v0.27 NEW (additive): Drift Dominance
 * - pure computation
 * - stable ordering
 * - signal-only
 */
function computeDriftDominance({ modules = [], metric = "drift_units", topN = 5 }) {
  if (!Array.isArray(modules) || modules.length === 0) {
    return {
      metric,
      top_n: topN,
      total_contribution: 0,
      top_modules: [],
      dominance_ratio: 0,
      top3_share: 0,
      cross_boundary: {
        is_cross_boundary: false,
        boundaries: [],
        note: "signal-only",
      },
    };
  }

  const sorted = [...modules].sort((a, b) => {
    const av = Number(a?.[metric] ?? 0);
    const bv = Number(b?.[metric] ?? 0);
    if (bv !== av) return bv - av;
    return String(a?.module ?? "").localeCompare(String(b?.module ?? ""));
  });

  const total = sorted.reduce((sum, m) => sum + Number(m?.[metric] ?? 0), 0);

  const top_modules = sorted.slice(0, topN).map((m, i) => {
    const contribution = Number(m?.[metric] ?? 0);
    return {
      module: m.module,
      contribution,
      share: total > 0 ? contribution / total : 0,
      rank: i + 1,
    };
  });

  const dominance_ratio = top_modules.length > 0 ? top_modules[0].share : 0;
  const top3_share = top_modules.slice(0, 3).reduce((s, m) => s + m.share, 0);

  const boundaryMap = {};
  for (const m of sorted) {
    const b = m?.boundary;
    if (!b) continue;
    boundaryMap[b] = (boundaryMap[b] || 0) + Number(m?.[metric] ?? 0);
  }

  const boundaries = Object.entries(boundaryMap)
    .map(([boundary, contribution]) => ({
      boundary,
      contribution,
      share: total > 0 ? contribution / total : 0,
    }))
    .sort((a, b) => {
      if (b.contribution !== a.contribution) return b.contribution - a.contribution;
      return String(a.boundary).localeCompare(String(b.boundary));
    });

  return {
    metric,
    top_n: topN,
    total_contribution: total,
    top_modules,
    dominance_ratio,
    top3_share,
    cross_boundary: {
      is_cross_boundary: boundaries.length > 1,
      boundaries,
      note: "signal-only",
    },
  };
}

export function analyzeDrift({ eventsPath, window = "7d" }) {
  const all = parseJsonlSafe(eventsPath);

  const days = windowToDays(window);
  const now = Date.now();
  const currentStart = now - daysToMs(days);
  const prevStart = now - daysToMs(days * 2);

  const current = [];
  const previous = [];

  for (const e of all) {
    const ts = Date.parse(e.ts);
    if (!ts) continue;

    if (ts >= currentStart) current.push(e);
    else if (ts >= prevStart) previous.push(e);
  }

  const densityCurrent = current.length / days;
  const densityPrev = previous.length / days;
  const slope = densityCurrent - densityPrev;

  const modulesCurrent = new Set(current.map((e) => e.module));
  const modulesPrev = new Set(previous.map((e) => e.module));

  const expansion = Math.max(0, modulesCurrent.size - modulesPrev.size);

  let trend = "stable";
  const epsilon = 0.5;
  if (slope > epsilon) trend = "accelerating";
  else if (slope < -epsilon) trend = "cooling";

  // v0.27 additive: per-module contribution
  const counts = new Map();
  for (const e of current) {
    const key = e?.module || "unknown";
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  const modules = Array.from(counts.entries())
    .map(([module, drift_units]) => ({
      module,
      drift_units,
      boundary: undefined,
    }))
    .sort((a, b) => {
      if (b.drift_units !== a.drift_units) return b.drift_units - a.drift_units;
      return String(a.module).localeCompare(String(b.module));
    });

  const dominance = computeDriftDominance({
    modules,
    metric: "drift_units",
    topN: 5,
  });

  return {
    trend,
    density: Number(densityCurrent.toFixed(2)),
    slope: Number(slope.toFixed(2)),
    expansion,
    unique_modules: modulesCurrent.size,

    // 🔥 v0.28.1 precise baseline
    unique_modules_prev: modulesPrev.size,

    events_current: current.length,
    events_prev: previous.length,

    // additive signal fields
    modules,
    dominance,
  };
}