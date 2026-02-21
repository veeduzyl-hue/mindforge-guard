# Drift CLI Interface (v0.25)

Drift CLI exposes time-dimension structural trend signals.

Drift is signal-only. It never affects risk scoring, verdicts, or exit
codes.

------------------------------------------------------------------------

## 1. drift status

Show drift trend summary for a time window.

### Usage

    mindforge drift status [options]

### Options

- `--window 7d|14d|30d` Rolling time window. Default: 7d

- `--since <ISO>` Custom start timestamp (overrides window)

- `--surface <id>` Filter by surface_id

- `--module <prefix>` Filter by module prefix

- `--format text|json` Output format (default: text)

### Output (text)

- Trend: accelerating | stable | cooling
- Density: X.X events/day
- Expansion: +N modules
- Window: 7d
- Generated at: `<timestamp>`

------------------------------------------------------------------------

## 2. drift explain

Explain how the trend was computed.

### Usage

    mindforge drift explain [options]

### Output includes

- Current window events
- Previous window events
- Density and slope
- Unique module growth
- Top surfaces (optional)
- Top modules (optional)

This command provides transparency. It does not change system behavior.

------------------------------------------------------------------------

## 3. drift export

Export drift signal bundle as JSON.

### Usage

    mindforge drift export [options]

### Output schema

Returns:

    kind: "drift_signal_bundle"
    v: 2
    policy.affects_exit: false
    policy.affects_risk_v1: false

------------------------------------------------------------------------

## 4. Safety Guarantee

Drift CLI:

- does NOT modify risk
- does NOT modify verdict
- does NOT modify exit code
- does NOT override DS-EXIT-001

Drift is observational. Not enforceable.
