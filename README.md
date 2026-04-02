# MindForge Guard

**Verifiable runtime governance for AI coding workflows.**

MindForge Guard is a commercially bounded CLI for teams that want to **see what AI changed, detect workflow drift, compare change over time, and prove governance outcomes** — without handing execution authority to a hidden control plane.

> Governance without hidden takeover.

---

## Why Guard

Most AI coding tools stop at assistance.

Guard adds a verifiable governance layer on top of AI-assisted development and release workflows:

- **See the action** with structured action classification
- **See the drift** with workflow drift visibility
- **Compare the change** with time-based and cross-state analysis
- **Prove the governance** with verification surfaces, delivery evidence, and commercial gate contracts

Guard is designed for teams that want stronger governance **without** turning the product into:

- an execution authority
- a hidden policy enforcer
- a dashboard-first control plane
- a silent main-path takeover

---

## Who it is for

### Individual developers
Add governance checks to AI-assisted coding workflows without buying into a heavyweight platform.

### Small engineering teams
Standardize change visibility, drift review, and evidence-ready release checks.

### Governance-conscious organizations
Adopt a commercially bounded governance layer with clear edition semantics and verifiable boundaries.

---

## How it works

### 1) Classify the action
Use Guard to make AI-assisted development activity more explicit.

```bash
node packages/guard/src/runGuard.mjs action classify
```

### 2) Detect workflow drift
Track whether the working path is moving away from the expected governance baseline.

```bash
node packages/guard/src/runGuard.mjs drift status --format json
```

### 3) Compare change over time
Move from static status to time-based or cross-state comparison.

```bash
node packages/guard/src/runGuard.mjs drift timeline
node packages/guard/src/runGuard.mjs drift compare
```

### 4) Prove governance outcomes
Verify the release surface and commercial boundary.

```bash
npm run verify:core
npm run verify:v612
node scripts/verify_commercial_edition_boundary.mjs
```

---

## Editions

| Edition | Buyer outcome | Includes |
|---|---|---|
| **Community** | See the current governance state | `status`, `validate-policy`, `audit`, `snapshot`, `action classify`, `drift status`, license install/status/show/remove |
| **Pro** | See governance trends over time | Everything in Community + `drift timeline` |
| **Pro+** | Compare change and uncover deeper signals | Everything in Pro + `drift compare` + `assoc correlate` |
| **Enterprise** | Standardize procurement and organizational adoption | Current CLI entitlement same as Pro+, with enterprise purchasing boundary and **no extra runtime authority promised in this release** |

See the full edition boundary in `docs/EDITIONS.md`.

---

## Quick start

Install dependencies and run the Community baseline:

```bash
npm install
node packages/guard/src/runGuard.mjs --version
node packages/guard/src/runGuard.mjs status
node packages/guard/src/runGuard.mjs validate-policy
node packages/guard/src/runGuard.mjs audit . --staged
node packages/guard/src/runGuard.mjs snapshot .
node packages/guard/src/runGuard.mjs drift status --format json
```

---

## Demo paths

### Demo A — Community baseline
Run Guard without a paid license:

```bash
node packages/guard/src/runGuard.mjs status
node packages/guard/src/runGuard.mjs audit . --staged
node packages/guard/src/runGuard.mjs snapshot .
node packages/guard/src/runGuard.mjs drift status --format json
```

### Demo B — Pro drift visibility
Show the first paid analytics boundary:

```bash
node packages/guard/src/runGuard.mjs drift timeline
```

Without a valid Pro license, Guard returns a structured `license_required` response.

### Demo C — Pro+ comparison and correlation
Show the main paid upgrade surface:

```bash
node packages/guard/src/runGuard.mjs drift compare
node packages/guard/src/runGuard.mjs assoc correlate
```

Without a sufficient license, Guard returns either `license_required` or `edition_mismatch`, depending on the current license state.

---

## What the current release line means

There are two important release layers in this repository:

- **`v6.12.0`** = governance / supporting-artifact baseline
- **`v6.13.0`** = commercial edition boundary completion

Some Pro / Pro+ capabilities may have existed earlier in implementation.

What changes in `v6.13.0` is that **Community / Pro / Pro+ / Enterprise become a formal, documented, verified, and release-promised product surface**.

---

## Commercial gate contract

Formal gate behavior:

- `0` = success
- `21` = commercial gate blocked
- `30` = command/runtime validation error

Formal gate error kinds:

- `license_required`
- `edition_mismatch`

See `docs/LICENSE.md` for license and gate details.

---

## Product principles

MindForge Guard remains:

- **recommendation-only**
- **additive-only**
- **non-executing**
- **default-off where applicable**

MindForge Guard does **not** become:

- an execution authority
- a hidden policy enforcer
- a control plane
- a dashboard-first product
- a silent takeover of the main path

---

## Documentation

- `docs/EDITIONS.md` — commercial edition boundary
- `docs/LICENSE.md` — license and gate contract
- `docs/VERIFY.md` — verification surface
- `RELEASE.md` — release boundary and scope

---

## Current release line

- Governance baseline: `v6.12.0`
- Current commercial boundary release: `v6.13.0`

---

## License

See `LICENSE`.
