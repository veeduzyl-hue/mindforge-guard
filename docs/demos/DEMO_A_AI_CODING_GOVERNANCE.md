# Demo A: AI Coding Governance

## Goal

Show a buyer how MindForge Guard helps a team see what AI changed before those changes become release drift.

This demo stays inside the existing Community command surface and uses current Guard semantics only.

It does not start Demo B or Demo C.

## Buyer-Facing Explanation

A buyer evaluating Guard usually wants a simple answer:

"Before AI-assisted edits move downstream into release packaging, can we make the work visible, classify what changed, and inspect whether the repo is drifting?"

Demo A answers that with three bounded moves:

1. classify an AI-authored change description
2. inspect the repo governance status
3. inspect drift status as a signal surface before release drift grows

The value is not autonomous enforcement.
The value is earlier visibility, deterministic artifacts, and a commercially bounded CLI that makes governance review easier before release pressure builds.

## Demo Input

Input file:

- [`demo_a_ai_change.txt`](demo_a_ai_change.txt)

Input text:

```text
AI rewrites the release README, updates edition copy, and changes docs links before a release candidate is reviewed.
```

## Demo Commands

Run from the repository root:

```bash
node packages/guard/src/runGuard.mjs --version
node packages/guard/src/runGuard.mjs action classify --text "AI rewrites the release README, updates edition copy, and changes docs links before a release candidate is reviewed"
node packages/guard/src/runGuard.mjs status
node packages/guard/src/runGuard.mjs drift status --format json
```

## Expected Outputs

### 1. Version

Expected shape:

```text
guard 6.13.0
```

What this shows:

- the demo is running on the `v6.13.0` commercial boundary release line

### 2. Action Classification

Expected shape:

```json
{
  "kind": "canonical_action",
  "version": "v1",
  "input": {
    "text": "..."
  },
  "action": {
    "action_class": "...",
    "canonical_label": "...",
    "target_type": "...",
    "target_ref": "...",
    "attributes": {
      "surface": "...",
      "risk_hint": "..."
    }
  },
  "canonical_action_hash": "sha256:...",
  "deterministic": true,
  "side_effect_free": true
}
```

What this shows:

- Guard can turn an AI change description into a deterministic governance artifact
- the artifact is side-effect-free and reviewable before anything becomes a release decision

### 3. Status

Expected shape:

```text
Guard Status
------------
Policy: ok
...
License: missing
...
Overall:     community (min)
```

What this shows:

- the repo has a valid local governance policy
- the current buyer path is still Community unless a paid license is installed
- governance visibility exists before any paid analytics upgrade

### 4. Drift Status

Expected shape:

```json
{
  "kind": "drift_signal_bundle",
  "v": 2,
  "window": "7d",
  "trend": "...",
  "signal": {
    "density": 0,
    "slope": 0,
    "expansion": 0,
    "unique_modules": 0
  },
  "policy": {
    "affects_exit": false,
    "affects_risk_v1": false
  }
}
```

What this shows:

- Guard exposes drift as a visible signal surface
- the signal is inspectable before it turns into release confusion
- this stays recommendation-only and does not silently take over the main path

## Validation Commands

Use these commands to validate the demo surface:

```bash
node packages/guard/src/runGuard.mjs --version
node packages/guard/src/runGuard.mjs action classify --text "AI rewrites the release README, updates edition copy, and changes docs links before a release candidate is reviewed"
node packages/guard/src/runGuard.mjs status
node packages/guard/src/runGuard.mjs drift status --format json
node scripts/verify_commercial_edition_boundary.mjs
```

## Validation Results

Validation run date:

- `2026-04-02`

Observed results:

- `node packages/guard/src/runGuard.mjs --version`
  - passed
  - output: `guard 6.13.0`
- `node packages/guard/src/runGuard.mjs action classify --text "..."`
  - passed
  - produced a deterministic `canonical_action` artifact with `side_effect_free: true`
- `node packages/guard/src/runGuard.mjs status`
  - passed
  - showed `Policy: ok`, `License: missing`, and `Overall: community (min)`
- `node packages/guard/src/runGuard.mjs drift status --format json`
  - passed
  - produced a `drift_signal_bundle` with a current observed trend of `cooling`
- `node scripts/verify_commercial_edition_boundary.mjs`
  - passed
  - output: `commercial edition boundary verified`

## Demo Boundary

Demo A preserves current Guard posture:

- recommendation-only
- additive-only
- non-executing
- default-off where applicable
- no authority expansion

It is intentionally limited to Community-safe visibility and verification surfaces.
