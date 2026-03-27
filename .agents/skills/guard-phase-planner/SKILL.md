---
name: guard-phase-planner
description: Use this skill when the task is to decide the next bounded MindForge Guard version/module, define its scope, slice it into phases, and produce a directly executable plan. This skill is for choosing one primary next-step conclusion, defining why it comes next, setting boundaries, phase slicing, and acceptance criteria. Do not use it for release-closeout tasks when the version has already been finalized; use the release skill instead.
---

# Guard Phase Planner

You are operating inside the `mindforge-guard` repository.

This skill is the planning skill for the next bounded version/module in Guard.
Use it when the user asks for:

- the next version
- a new planning prompt
- the next module after a release
- phase 1 start planning
- phase slicing for a chosen version
- acceptance criteria for the next step

## Primary objective

Choose one primary next-step conclusion and turn it into a concrete, phase-based execution plan.

## Core planning rules

### Rule 1: choose one main conclusion
Default to one primary version/module conclusion.
Do not produce multiple competing roadmap branches unless the user explicitly asks for alternatives.

### Rule 2: explain why now
State why this version is the right next step in the sequence.
The explanation must reference continuity, product posture, and bounded progression.

### Rule 3: define the boundary
Be explicit about what the version is.
A good boundary names:

- the object or layer being advanced
- the type of bounded outcome
- how it relates to already completed lineage
- what it does not become

### Rule 4: define what is not included
Always include a “not included” section to prevent scope creep.

### Rule 5: slice by phase
Unless the user asks otherwise, break work into:

- Phase 1: boundary start
- Phase 2: hardening
- Phase 3: final acceptance

## Standard output contract

Unless the user requests another format, produce:

1. Version conclusion
2. Why this comes next
3. Boundary definition
4. Not included
5. Phase 1 scope
6. Phase 2 scope
7. Phase 3 scope
8. Preserved invariants
9. Verify surface
10. Acceptance criteria
11. Suggested branch name
12. Suggested PR framing
13. Next-step execution prompt

## Guard-specific planning constraints

Always plan within these default repository constraints unless explicitly overridden:

- recommendation-only
- additive-only
- non-executing
- default-off where applicable
- audit output / verdict / exit unchanged
- deny exit code `25` unchanged
- no control-plane drift
- no dashboard-first drift
- no multi-agent orchestration drift
- no authority expansion without explicit direction

## Planning heuristics

### Good next versions usually:
- complete a bounded layer
- convert a completed object chain into clearer explanation/receipt/evidence/consumption form
- improve verification and productization clarity
- preserve semantic stability while increasing usability or defensibility

### Weak next versions usually:
- reopen already closed semantics without strong reason
- mix multiple unrelated roadmap jumps
- leap into platformization too early
- expand into multi-agent scope before the single-agent line is productized
- combine packaging, authority changes, and platform changes in one version

## Phase design guidance

### Phase 1
Should establish:
- boundary
- object naming
- initial contract/surface
- status docs
- base verify coverage

### Phase 2
Should establish:
- hardening
- compatibility strengthening
- export/consumer stability
- stronger verify coverage
- unchanged-surface confidence

### Phase 3
Should establish:
- final acceptance
- freeze
- release readiness
- consolidated verification posture
- precise release language

## Do not use this skill for

- tag/release closeout once the version is already complete
- compatibility-only reviews of an existing proposal
- generic brainstorming disconnected from the Guard roadmap