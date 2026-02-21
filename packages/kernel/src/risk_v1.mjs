// kernel/src/risk_v1.mjs
// Risk Intelligence Engine v1 (pure functions)
// - No IO, no time, no randomness, deterministic

// -----------------------------
// Path Normalization
// -----------------------------
function normalizePath(p) {
    return String(p || "")
      .replaceAll("\\", "/")
      .split("?")[0]
      .replace(/^\/+/, "");
  }
  
  /**
   * Stable module bucket rules (v1 contract)
   *
   * Priority:
   * 1. packages/<name>/...   => pkg:<name>
   * 2. tooling/...           => tooling
   * 3. scripts/...           => scripts
   * 4. .mindforge/...        => mindforge
   * 5. src/...               => src
   * 6. fallback              => top-level folder
   */
  export function moduleBucketOfPath(p) {
    const s = normalizePath(p);
    const parts = s.split("/").filter(Boolean);
    if (parts.length === 0) return "root";
  
    if (parts[0] === "packages" && parts.length >= 2) {
      return `pkg:${parts[1]}`;
    }
  
    if (parts[0] === "tooling") return "tooling";
    if (parts[0] === "scripts") return "scripts";
    if (parts[0] === ".mindforge") return "mindforge";
    if (parts[0] === "src") return "src";
  
    return parts[0];
  }
  
  // -----------------------------
  // Utilities
  // -----------------------------
  function clamp01(x) {
    if (!Number.isFinite(x)) return 0;
    return x < 0 ? 0 : x > 1 ? 1 : x;
  }
  
  function clampInt(x, lo, hi) {
    if (!Number.isFinite(x)) return lo;
    const r = Math.round(x);
    return r < lo ? lo : r > hi ? hi : r;
  }
  
  function expSaturate(x, scale) {
    const xx = Math.max(0, Number.isFinite(x) ? x : 0);
    const ss = Math.max(1e-9, Number.isFinite(scale) ? scale : 1);
    return clamp01(1 - Math.exp(-xx / ss));
  }
  
  function log2(x) {
    return Math.log(x) / Math.log(2);
  }
  
  // -----------------------------
  // Spread Risk
  // -----------------------------
  export function computeSpreadRiskV1(touched_paths) {
    const counts = Object.create(null);
  
    for (const raw of touched_paths || []) {
      const k = moduleBucketOfPath(raw);
      counts[k] = (counts[k] ?? 0) + 1;
    }
  
    const modules = Object.keys(counts).sort();
    const total = modules.reduce((acc, m) => acc + (counts[m] ?? 0), 0);
  
    if (total <= 0 || modules.length <= 1) {
      return {
        modules_touched: modules,
        module_counts: counts,
        total_files: total,
        entropy: 0,
        entropy_norm: 0,
        max_share: total > 0 ? 1 : 0,
        dominant_module: modules[0] || null,
        dominant_share: total > 0 ? 1 : 0,
        cross_boundary: modules.length > 1,
      };
    }
  
    let H = 0;
    let maxShare = 0;
    let dom = null;
  
    for (const m of modules) {
      const c = counts[m] ?? 0;
      const p = c / total;
  
      if (p > 0) H += -p * log2(p);
  
      if (p >= maxShare) {
        maxShare = p;
        dom = m;
      }
    }
  
    const denom = log2(modules.length);
    const Hn = denom > 0 ? H / denom : 0;
  
    return {
      modules_touched: modules,
      module_counts: counts,
      total_files: total,
      entropy: Number.isFinite(H) ? H : 0,
      entropy_norm: clamp01(Hn),
      max_share: clamp01(maxShare),
      dominant_module: dom,
      dominant_share: clamp01(maxShare),
      cross_boundary: modules.length > 1,
    };
  }
  
  // -----------------------------
  // Risk v1 Aggregation
  // -----------------------------
  export function computeRiskV1({
    lines_added,
    files_changed,
    touched_paths,
  }) {
    const L = Math.max(0, lines_added || 0);
    const F = Math.max(0, files_changed || 0);
    const spread = computeSpreadRiskV1(touched_paths || []);
    const M = spread.modules_touched.length;
  
    // Fixed v1 params (DO NOT change without version bump)
    const L0 = 400;
    const F0 = 10;
    const M0 = 4;
  
    const w_lines = 0.35;
    const w_files = 0.25;
    const w_modules = 0.20;
    const w_spread = 0.20;
  
    const f_lines = expSaturate(L, L0);
    const f_files = expSaturate(F, F0);
    const f_modules = expSaturate(Math.max(0, M - 1), M0);
    const f_spread = clamp01(spread.entropy_norm);
  
    const raw =
      100 *
      (w_lines * f_lines +
        w_files * f_files +
        w_modules * f_modules +
        w_spread * f_spread);
  
    const score = clampInt(raw, 0, 100);
  
    const contrib = [
      ["lines", w_lines * f_lines],
      ["files", w_files * f_files],
      ["modules", w_modules * f_modules],
      ["spread", w_spread * f_spread],
    ];
    contrib.sort((a, b) => b[1] - a[1]);
  
    return {
      v: 1,
      score,
      components: { f_lines, f_files, f_modules, f_spread },
      spread,
      weights: { w_lines, w_files, w_modules, w_spread },
      params: { L0, F0, M0 },
      explain: {
        primary_driver: contrib[0]?.[0] || "lines",
      },
    };
  }
  