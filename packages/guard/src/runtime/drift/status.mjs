import path from "node:path";
import { analyzeDrift } from "./analyzer.mjs";

/**
 * v0.27:
 * - 透传 modules
 * - 顶层增加 dominance（永远存在，signal-only）
 * - 不改变既有字段结构
 */
export function buildDriftStatus({ repoRoot, window = "7d" }) {
  const eventsPath = path.join(
    repoRoot,
    ".mindforge",
    "drift",
    "events.jsonl"
  );

  const stats = analyzeDrift({ eventsPath, window });

  // ---- v0.27: dominance fallback (structure stability) ----
  const dominance =
    stats.dominance || {
      metric: "drift_units",
      top_n: 5,
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

  const modules = Array.isArray(stats.modules) ? stats.modules : [];

  return {
    kind: "drift_signal_bundle",
    v: 2,
    window,
    generated_at: new Date().toISOString(),

    trend: stats.trend,

    signal: {
      density: stats.density,
      slope: stats.slope,
      expansion: stats.expansion,
      unique_modules: stats.unique_modules,
    },

    explain: {
      events: stats.events_current,
      events_prev: stats.events_prev,
    },

    // v0.27 additive (signal-only)
    modules,
    dominance,

    policy: {
      affects_exit: false,
      affects_risk_v1: false,
    },
  };
}
