# Demo C: Commercial Editions Boundary

## Goal

Show a buyer the practical difference between Community, Pro, and Pro+ using the same governance scenario.

This demo does not change the current commercial boundaries.
It explains the already-released command promises for each edition and why a user would upgrade.

## Buyer-Facing Scenario

Use the same question for every edition:

"An AI-assisted team is preparing a release. What can this edition show us about the current governance state, drift trend, and deeper comparative signals?"

This demo keeps the scenario constant and changes only the edition entitlement.

## Scenario Input

Input file:

- [`demo_c_same_scenario.txt`](demo_c_same_scenario.txt)

Input text:

```text
An AI-assisted team is preparing a release and wants to inspect the current governance state, review drift over time, and compare signals before deciding whether to upgrade.
```

## Edition Walkthrough

### Community

Community can inspect the current governance state and current drift surface.

Commands:

```bash
node packages/guard/src/runGuard.mjs status
node packages/guard/src/runGuard.mjs drift status --format json
node packages/guard/src/runGuard.mjs drift timeline
```

Expected practical outcome:

- `status` works
- `drift status` works
- `drift timeline` is gated

Expected gated output shape:

```json
{
  "ok": false,
  "error": {
    "kind": "license_required",
    "feature": "drift_timeline",
    "required_edition": "pro",
    "current_edition": "community",
    "license_state": "missing",
    "hint": "Install a signed pro license file: guard license install --file <file>"
  }
}
```

Why Community is useful:

- a buyer can inspect the repo's current governance state
- a team can see current drift without committing to paid analytics
- evaluation starts with real visibility, not a black box

Why a user upgrades from Community:

- Community shows "what is true now"
- Pro adds "how the drift is moving over time"

### Pro

Pro adds timeline-oriented drift visibility to the same scenario.

Commands:

```bash
node packages/guard/src/runGuard.mjs drift timeline
node packages/guard/src/runGuard.mjs drift compare
```

Expected practical outcome:

- `drift timeline` works with a valid Pro license
- `drift compare` remains gated because it requires Pro+

Expected upgrade value:

- a buyer can move from static drift status to trend review
- a release owner can inspect whether drift is rising, cooling, or stabilizing
- Pro is the practical upgrade when the team needs historical drift visibility but not full comparison analytics

Expected gated output shape for the still-blocked command:

```json
{
  "ok": false,
  "error": {
    "kind": "edition_mismatch",
    "feature": "drift_compare",
    "required_edition": "pro_plus",
    "current_edition": "pro",
    "license_state": "valid",
    "hint": "Install a signed pro_plus license file: guard license install --file <file>"
  }
}
```

Why a user upgrades from Pro:

- Pro shows "how drift changes over time"
- Pro+ adds "how states compare and which signals correlate"

### Pro+

Pro+ unlocks the full current paid analytics surface for the same scenario.

Commands:

```bash
node packages/guard/src/runGuard.mjs drift timeline
node packages/guard/src/runGuard.mjs drift compare
node packages/guard/src/runGuard.mjs assoc correlate
```

Expected practical outcome:

- `drift timeline` works
- `drift compare` works
- `assoc correlate` works

Expected upgrade value:

- a buyer can compare change across states instead of viewing one moment at a time
- an advanced workflow owner can correlate drift-oriented and association-oriented signals
- Pro+ is the current top analytics tier for buyers who need more than visibility and trend review

## Edition Boundary Summary

| Edition | What the buyer can do in this scenario | Why upgrade |
|---|---|---|
| Community | see current governance state and current drift status | move to Pro for time-based drift visibility |
| Pro | see current state plus drift timeline | move to Pro+ for comparison and correlation analytics |
| Pro+ | see state, trend, comparison, and correlation signals | highest current paid analytics surface |

## Validation Commands

These commands validate the current boundary from the repository root:

```bash
node packages/guard/src/runGuard.mjs status
node packages/guard/src/runGuard.mjs drift status --format json
node packages/guard/src/runGuard.mjs drift timeline
node packages/guard/src/runGuard.mjs drift compare
node packages/guard/src/runGuard.mjs assoc correlate
node scripts/verify_commercial_edition_boundary.mjs
```

## Validation Notes

Validation run date:

- `2026-04-02`

Observed notes in the current local Community environment:

- `node packages/guard/src/runGuard.mjs drift timeline`
  - returned `license_required`
  - required edition: `pro`
- `node packages/guard/src/runGuard.mjs drift compare`
  - returned `license_required`
  - required edition: `pro_plus`
- `node packages/guard/src/runGuard.mjs assoc correlate`
  - returned `license_required`
  - required edition: `pro_plus`
- `node scripts/verify_commercial_edition_boundary.mjs`
  - passed
  - output: `commercial edition boundary verified`

These observations are consistent with the released boundary in [`docs/EDITIONS.md`](../EDITIONS.md) and the gate contract in [`docs/LICENSE.md`](../LICENSE.md).

## Demo Boundary

Demo C preserves current Guard posture:

- recommendation-only
- additive-only
- non-executing
- default-off where applicable
- no authority expansion

It explains the existing commercial promise surface.
It does not introduce any new edition behavior.
