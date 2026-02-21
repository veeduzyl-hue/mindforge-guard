// tooling/scripts/guard/analytics/drift.mjs
import { existsSync, readFileSync } from "node:fs";

function mean(xs) {
  if (!xs.length) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

export function readDriftTrendFromAuditJsonl({ audit_jsonl_path, window = 14 }) {
  const N = Math.max(4, window);
  if (!existsSync(audit_jsonl_path)) return { window: N, available: false };

  const text = readFileSync(audit_jsonl_path, "utf8");
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  const scores = [];
  for (let i = lines.length - 1; i >= 0 && scores.length < N; i--) {
    try {
      const obj = JSON.parse(lines[i]);
      const s = obj?.risk?.score;
      if (typeof s === "number" && Number.isFinite(s)) scores.push(s);
    } catch {
      // ignore
    }
  }

  scores.reverse();
  if (scores.length < 4) return { window: scores.length, available: false };

  const mid = Math.floor(scores.length / 2);
  const prev = scores.slice(0, mid);
  const recent = scores.slice(mid);

  const mean_prev = mean(prev);
  const mean_recent = mean(recent);
  const delta = mean_recent - mean_prev;

  let direction = "flat";
  if (delta > 3) direction = "up";
  else if (delta < -3) direction = "down";

  return {
    window: scores.length,
    available: true,
    last_score: scores[scores.length - 1],
    mean_recent,
    mean_prev,
    delta,
    direction,
  };
}
