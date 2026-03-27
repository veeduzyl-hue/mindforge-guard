---
name: guard-compat-boundary-review
description: Use this skill when the task is to review whether a proposed or completed MindForge Guard change preserves compatibility, respects the bounded governance posture, and avoids semantic drift. This skill is for boundary review, invariant checks, unchanged-surface validation, and authority-drift detection. Do not use it for ordinary feature planning unless the primary question is whether the change crosses a boundary.
---

# Guard Compatibility Boundary Review

You are operating inside the `mindforge-guard` repository.

This skill is the compatibility and boundary-review skill for Guard.
Use it whenever the key question is:

- does this proposal cross a boundary
- is this phase compatible
- did this PR drift
- is this still additive-only
- did this change alter audit/permit/classify semantics
- is this becoming authority expansion
- is this drifting into platform/control-plane territory

## Primary objective

Determine whether a proposed, implemented, or released change remains inside the accepted Guard compatibility envelope.

## Canonical review dimensions

Every review should check the following dimensions explicitly.

### 1) Main-path stability
Check whether the change preserves:

- `audit` output
- `audit` verdict semantics
- `audit` exit semantics
- `permit` behavior unless explicitly scoped
- `classify` behavior unless explicitly scoped

### 2) Product posture stability
Check whether the change remains:

- recommendation-only
- additive-only
- non-executing
- default-off where applicable

### 3) Authority boundary stability
Check whether the change:

- introduces new authority
- turns supporting artifacts into controlling artifacts
- changes approval/permit semantics
- creates hidden enforcement behavior
- broadens authority scope implicitly

### 4) Roadmap posture stability
Check whether the change drifts toward:

- dashboard-first framing
- control-plane framing
- multi-agent orchestration framing
- platform shell expansion
- unrelated commercialization surfaces that are not part of the current bounded step

### 5) Lineage stability
Check whether the change disrupts the already completed governance lineage, including bounded review-decision / attestation / explanation / receipt style objects that have already been completed and frozen into released history.

## Standard output contract

Unless the user requests another format, return:

1. Compatibility conclusion
2. Boundary status
3. Preserved invariants
4. Potential drift detected
5. Semantic risk level
6. Required follow-up
7. Can proceed / cannot proceed

## Preferred conclusion language

Use crisp judgments such as:

- compatible
- compatible with caution
- not yet compatible
- boundary drift detected
- no semantic regression found
- environment issue, not semantic issue
- authority ambiguity remains
- release-safe
- not release-safe

## Review heuristics

### Compatible changes usually look like:
- additive schemas
- bounded exports
- explanation/receipt/evidence improvements
- verification expansion
- docs/status freeze updates
- explicit unchanged-surface statements

### Suspicious changes usually look like:
- broad refactors with no boundary need
- policy logic moving into main path
- default-on behavior
- renamed/remapped stable outputs
- control-plane or dashboard language creeping into product definition
- mixing commercialization packaging with semantic authority changes in one step

## When logs or execution results are provided

Separate findings into:

- semantic compatibility
- verification coverage
- environment/tooling/git issues
- release readiness
- remaining ambiguity

Do not overstate failures.
Be exact about whether a problem is environmental or product-semantic.

## Do not use this skill for

- writing a release plan from scratch
- producing marketing copy
- brainstorming multiple future versions
- routine implementation guidance where compatibility is not the key question