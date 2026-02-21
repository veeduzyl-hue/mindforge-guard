import { analyzeDrift } from "./analyzer.mjs";

export function buildCompare({ eventsPath, window = "7d" }) {
  const result = analyzeDrift({ eventsPath, window });

  const a = {
    events: result.events_prev,
    unique_modules: result.unique_modules_prev,
    density: Number(
      (result.events_prev / (window === "14d" ? 14 : window === "30d" ? 30 : 7))
        .toFixed(2)
    ),
    expansion: 0
  };

  const b = {
    events: result.events_current,
    unique_modules: result.unique_modules,
    density: result.density,
    expansion: result.expansion
  };

  return {
    kind: "drift_compare",
    v: 1,
    window,
    generated_at: new Date().toISOString(),
    a,
    b,
    delta: {
      events: b.events - a.events,
      unique_modules: b.unique_modules - a.unique_modules,
      density: Number((b.density - a.density).toFixed(2)),
      expansion: b.expansion - a.expansion
    }
  };
}