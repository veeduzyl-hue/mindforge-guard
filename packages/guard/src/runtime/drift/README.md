# Drift — Trend Signal Engine

Drift adds time-dimension memory to Guard as a **signal-only** trend layer.

---

## Non-negotiable constraints

- Drift does **not** change Risk v1
- Drift does **not** change verdicts
- Drift does **not** change exit codes
- Drift does **not** affect DS-EXIT-001
- Drift is **not** a risk replacement
- Drift is context enrichment only

---

# v0.28 Boundary Clause (ADR)

**Status:** Accepted  
**Effective:** v0.28  
**Scope:** Drift CLI outputs only  

## Context

v0.28 introduces timeline and compare views.  
These outputs are durable artifacts and may be consumed by CI or dashboards.

To prevent semantic drift, explicit output boundaries are required.

## Hard Boundary

The following tokens MUST NOT appear in Drift CLI stdout or stderr:

- risk
- verdict
- block
- governance

This rule:

- Applies to timeline / compare / status CLI output
- Does NOT apply to internal event schemas
- Is enforced by CI tests

## Rationale

1. Drift is observational only
2. Risk v1 (v0.23) remains separate
3. Timeline increases propagation surface
4. Boundary must be machine-checkable

---

## Density unit

- Fixed: events per day
- Windows: 7d | 14d | 30d

---

## Trend rule

slope = density_current - density_prev

- accelerating: slope > +0.5
- cooling: slope < -0.5
- stable: otherwise