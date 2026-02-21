// packages/guard/src/runtime/drift/timeline.mjs
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
    } catch {}
  }
  return out;
}

/**
 * UTC-stable bucket boundary
 * Prevents timezone drift across machines (CI / Windows / macOS)
 */
function bucketStart(ts, bucket) {
  const d = new Date(ts);

  if (bucket === "hour") {
    return new Date(Date.UTC(
      d.getUTCFullYear(),
      d.getUTCMonth(),
      d.getUTCDate(),
      d.getUTCHours()
    )).toISOString();
  }

  // day bucket (default)
  return new Date(Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate()
  )).toISOString();
}

export function buildTimeline({
  eventsPath,
  window = "7d",
  bucket = "day"
}) {
  const events = parseJsonlSafe(eventsPath);

  const days = window === "14d" ? 14 : window === "30d" ? 30 : 7;

  // Use UTC-based now
  const now = Date.now();
  const start = now - days * 24 * 60 * 60 * 1000;

  const buckets = new Map();

  for (const e of events) {
    const ts = Date.parse(e.ts);
    if (!ts || ts < start) continue;

    const key = bucketStart(ts, bucket);

    if (!buckets.has(key)) {
      buckets.set(key, {
        t: key,
        events: 0,
        modules: new Set()
      });
    }

    const b = buckets.get(key);
    b.events++;
    b.modules.add(e.module);
  }

  const series = Array.from(buckets.values())
    .sort((a, b) => Date.parse(a.t) - Date.parse(b.t))
    .map(b => ({
      t: b.t,
      events: b.events,
      unique_modules: b.modules.size
    }));

  return {
    kind: "drift_timeline",
    v: 1,
    window,
    bucket,
    generated_at: new Date().toISOString(),
    series
  };
}