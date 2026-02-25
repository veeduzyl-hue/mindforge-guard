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
      const obj = JSON.parse(line);
      if (obj?.kind === "drift_event" && obj?.v === 2 && typeof obj?.ts === "string") {
        out.push(obj);
      }
    } catch {
      // ignore bad lines
    }
  }
  return out;
}

/**
 * Returns per-day series for the window:
 * [{ t, drift_events, drift_unique_modules }]
 * Missing days are filled with zeros.
 */
export function buildDriftDailySeries({
  eventsPath,
  window = "7d",
  nowMs = Date.now()
}) {
  const days = windowToDays(window);
  const { startIso, endIso } = daysBackIso(days, nowMs);
  const startMs = Date.parse(startIso);
  const endMs = Date.parse(endIso) + 24 * 60 * 60 * 1000;

  const rows = new Map(); // t -> {events, modules:Set}

  // prefill
  for (let i = 0; i < days; i++) {
    const t = new Date(Date.parse(startIso) + i * 24 * 60 * 60 * 1000).toISOString();
    rows.set(t, { t, events: 0, modules: new Set() });
  }

  const all = parseJsonlSafe(eventsPath);
  for (const e of all) {
    const ts = Date.parse(e.ts);
    if (!ts || ts < startMs || ts >= endMs) continue;

    const t = utcDayStartIso(ts);
    const r = rows.get(t);
    if (!r) continue;

    r.events += 1;
    if (typeof e.module === "string" && e.module) r.modules.add(e.module);
  }

  return Array.from(rows.values()).map(r => ({
    t: r.t,
    drift_events: r.events,
    drift_unique_modules: r.modules.size
  }));
}
