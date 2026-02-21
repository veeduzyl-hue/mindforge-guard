export function driftNoop(window = "7d") {
    return {
      kind: "drift_signal_bundle",
      v: 2,
      window,
      generated_at: new Date().toISOString(),
      trend: "stable",
      signal: {
        density: 0,
        slope: 0,
        expansion: 0,
        unique_modules: 0
      },
      policy: {
        affects_exit: false,
        affects_risk_v1: false
      }
    };
  }
  