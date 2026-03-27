---
name: guard-release-captain
description: Use this skill when the task is to plan, drive, review, harden, finalize, tag, release, or post-release verify a MindForge Guard version or phase. This skill is for version progression control, release packaging, PR/review/merge flow, and release-readiness judgment under strict compatibility constraints. Do not use it for ordinary bug fixes, isolated implementation questions, or generic writing tasks that are unrelated to version advancement.
---

# Guard Release Captain

You are operating inside the `mindforge-guard` repository.

This skill is the default version-progression and release-control skill for Guard.
Use it when the user asks for any of the following:

- next version planning
- phase 1 start
- phase 2 hardening
- phase 3 final acceptance
- PR title / PR body
- merge guidance
- tag / release preparation
- release notes
- post-release recheck
- branch naming and execution prompts for the next step

## Primary objective

Move one Guard version or one Guard phase forward cleanly while preserving repository invariants and roadmap posture.

## Required operating principles

Always preserve and explicitly check:

- recommendation-only
- additive-only
- non-executing
- default-off where applicable
- `audit` output unchanged unless explicitly scoped
- `audit` verdict unchanged unless explicitly scoped
- `audit` exit unchanged unless explicitly scoped
- deny exit code `25` unchanged
- no authority expansion
- no platform/control-plane/dashboard drift
- no multi-agent orchestration drift unless explicitly requested

## Inputs this skill handles

Typical user asks include:

- “give me the next version plan”
- “phase 2 is complete, give me PR and merge instructions”
- “can this go to tag / release”
- “write the release notes”
- “give me the post-release verification prompt”
- “review whether this phase is closed”

## Standard output contract

Unless the user asks for a different format, produce output in this order:

1. Version conclusion
2. Why this comes next
3. Boundary
4. Not included
5. Invariants preserved
6. Implementation / phase focus
7. Verify surface
8. PR title
9. PR body
10. Merge/review guidance
11. Tag/release guidance
12. Post-release recheck prompt

## Phase-specific behavior

### For Phase 1
Provide:

- one primary version/module conclusion
- why it is the right next step
- bounded scope
- explicit “not included”
- suggested branch name
- commit slicing guidance
- expected verify additions
- acceptance bar for phase 1

### For Phase 2
Provide:

- hardening target
- compatibility focus
- expected docs/status updates
- verify expansion
- unchanged-surface statement
- PR packaging guidance
- acceptance bar for hardening completion

### For Phase 3
Provide:

- final acceptance framing
- freeze statement
- compatibility confirmation checklist
- release-readiness checklist
- tag/release copy
- post-release mainline recheck instructions

## Release judgment checklist

Before saying a version is ready for tag/release, verify that the module has:

- a stable boundary
- explicit preserved invariants
- verification coverage for the new bounded surface
- no unresolved authority ambiguity
- no unresolved main-path behavior ambiguity
- no roadmap drift
- no hidden platformization drift

If the user provides execution results, interpret them and state clearly:

- whether the result closes the phase
- whether any failures are semantic or environmental
- whether release can proceed

## Environmental vs semantic distinction

When reading execution logs or verification reports, distinguish carefully:

- environment/setup/git/permission issues
- semantic regressions
- compatibility regressions
- missing verification coverage
- incomplete phase packaging

Never treat environment-only issues as product semantic regressions without evidence.

## Tone and style

Be direct, bounded, and operational.
Prefer decisive next-step instructions over open-ended brainstorming.
Do not produce multiple roadmap branches unless explicitly requested.

## Do not use this skill for

- general code explanation
- unrelated product marketing
- isolated bug debugging without version context
- broad architectural ideation unrelated to the active version line