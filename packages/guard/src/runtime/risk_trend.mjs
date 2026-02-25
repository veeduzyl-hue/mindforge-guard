import fs from "node:fs";

function windowToDays(w) {
  if (w === "14d") return 14;
  if (w === "30d") return 30;
  return 7;
}

function utcDayStartIso(ts) {
  const d = new Date(ts);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())).toISOString();
}

function daysBackIso(days, nowMs) {
  const now = new Date(nowMs);
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const start = new Date(end.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
  return { startIso: start.toISOString(), endIso: end.toISOString() };
}

function parseJsonlSafe(path) {
  if (!fs.existsSync(path)) return [];
  const lines = fs.readFileSync(path, "utf8").split("\n").filter(Boolean);
  const out = [];
  for (const line of lines) {
    try {
      out.push(JSON.parse(line));
    } catch {
      // ignore
    }
  }
  return out;
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

function extractTs(obj) {
    const cands = [
      // common
      obj?.ts,
      obj?.time,
      obj?.timestamp,
      obj?.at,
      obj?.generated_at,
      obj?.created_at,
      obj?.createdAt,
      obj?.updated_at,
      obj?.updatedAt,
  
      // nested: event/meta
      obj?.event?.ts,
      obj?.event?.time,
      obj?.event?.timestamp,
      obj?.meta?.ts,
      obj?.meta?.time,
      obj?.meta?.timestamp,
  
      // nested: snapshot
      obj?.snapshot?.ts,
      obj?.snapshot?.time,
      obj?.snapshot?.timestamp,
      obj?.snapshot?.generated_at,
      obj?.snapshot?.created_at,
      obj?.snapshot?.createdAt,
      obj?.snapshot?.updated_at,
      obj?.snapshot?.updatedAt,
  
      // nested: receipt/audit/result (common in logs)
      obj?.receipt?.ts,
      obj?.audit?.ts,
      obj?.result?.ts,
  
      // numeric epoch candidates
      obj?.ts_ms,
      obj?.time_ms,
      obj?.timestamp_ms,
      obj?.ts_s,
      obj?.time_s,
      obj?.timestamp_s
    ];
  
    for (const cand of cands) {
      // ISO string
      if (typeof cand === "string" && cand.trim()) return cand.trim();
  
      // numeric epoch
      if (typeof cand === "number" && Number.isFinite(cand)) {
        // heuristic: >= 1e12 => ms, else seconds
        const ms = cand >= 1e12 ? cand : cand * 1000;
        const d = new Date(ms);
        if (!Number.isNaN(d.getTime())) return d.toISOString();
      }
    }
  
    // last resort: some logs embed time as string number
    const alt = obj?.ts || obj?.time || obj?.timestamp;
    if (typeof alt === "string" && alt.trim()) {
      const n = Number(alt);
      if (Number.isFinite(n)) {
        const ms = n >= 1e12 ? n : n * 1000;
        const d = new Date(ms);
        if (!Number.isNaN(d.getTime())) return d.toISOString();
      }
    }
  
    return null;
  }

function extractRiskScore(obj) {
  // best-effort across possible shapes
  const cand =
    obj?.risk_score ??
    obj?.snapshot?.risk_score ??
    obj?.snapshot?.risk?.score ??
    obj?.risk?.score;
  const n = Number(cand);
  return Number.isFinite(n) ? n : null;
}

/**
 * Read audit.jsonl and build per-day series:
 * [{ t, risk_events, risk_score_avg, risk_score_p95 }]
 *
 * signal-only: no governance semantics; best-effort parsing; missing days filled with zeros.
 */
export function readRiskTrendFromAuditJsonl({
  auditPath,
  window = "7d",
  nowMs = Date.now()
}) {
  const days = windowToDays(window);
  const { startIso } = daysBackIso(days, nowMs);
  const startMs = Date.parse(startIso);
  const endMs = startMs + days * 24 * 60 * 60 * 1000;

  const rows = new Map(); // t -> {scores:[], n}
  for (let i = 0; i < days; i++) {
    const t = new Date(startMs + i * 24 * 60 * 60 * 1000).toISOString();
    rows.set(t, { t, scores: [], n: 0 });
  }

  const all = parseJsonlSafe(auditPath);
  for (const obj of all) {
    const tsStr = extractTs(obj);
    if (!tsStr) continue;

    const ts = Date.parse(tsStr);
    if (!ts || ts < startMs || ts >= endMs) continue;

    const t = utcDayStartIso(ts);
    const row = rows.get(t);
    if (!row) continue;

    row.n += 1;

    const score = extractRiskScore(obj);
    if (score != null) row.scores.push(score);
  }

  const series = Array.from(rows.values()).map(r => {
    const scores = r.scores.slice().sort((a, b) => a - b);
    const avg =
      scores.length ? scores.reduce((s, x) => s + x, 0) / scores.length : 0;
    const p95 = scores.length ? quantile(scores, 0.95) : 0;

    return {
      t: r.t,
      risk_events: r.n,
      risk_score_avg: Number(avg.toFixed(2)),
      risk_score_p95: Number(p95.toFixed(2))
    };
  });

  return series;
}
