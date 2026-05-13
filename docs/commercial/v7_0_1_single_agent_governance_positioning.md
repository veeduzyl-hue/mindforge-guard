# v7.0.1 Single-Agent Governance Positioning

## Purpose

This document freezes the v7.0.1 commercial positioning rewrite around a single bounded story:

> MindForge Guard is a deterministic governance evidence layer for single-agent AI workflows.

The public commercial headline is:

> Make AI-assisted work reviewable before it becomes trusted.

## Why This Rewrite Was Needed

The prior commercial copy over-weighted engineering release packaging:

- version numbers were too close to the hero story
- npm package and GitHub Release references were too visible in commercial entry points
- the first report path over-centered an HR sample
- AI coding read like the only category instead of one use case within a broader single-agent story

This rewrite moves the public story back to evidence, reviewability, and bounded human review.

## Primary Commercial Story

Use this subhead:

> MindForge Guard is a deterministic governance evidence layer for single-agent AI workflows. It helps teams inspect authority, evidence, state, and decision boundaries before AI-assisted work is accepted into business or engineering processes.

Use this boundary line:

> Not an approval system. Not a blocker. Not a control plane.

## Evidence Pack Explanation

Use this explanation:

> An Evidence Pack is the review bundle behind an AI-assisted action: task context, allowed scope, action trace, tool/data references, outputs, missing evidence, and reviewer notes.

Use this consequence:

> Guard turns that evidence bundle into a governance report, the evidence-bound review artifact behind the action.

## First Workflow Story

The first public workflow should say:

- Review your first single-agent action with evidence.
- Start with a sample agent action.
- Validate the evidence bundle.
- Generate a governance report.
- Read authority boundary, execution evidence, missing evidence, and risk/drift signals.
- Make the next human review decision outside Guard.

Do not make one sample workflow the public first-report hero path.

If an example is kept, describe it as:

> synthetic sample evidence bundle for local validation

## Use Cases

The public story should work across:

- AI coding agents
- Support agents
- Operations agents
- Internal workflow agents

AI coding copy:

> Review evidence behind AI-generated code changes before merge or release decisions.

## Editions by Customer Outcome

- Community: See the current governance evidence for one agent workflow.
- Pro: Track governance signals over time.
- Pro+: Compare evidence states and uncover deeper signals.
- Enterprise: Standardize adoption, review packets, and procurement around the same bounded runtime posture. No extra runtime authority.

## Secondary Technical Install

Keep version, npm package, and GitHub Release references in secondary install/docs surfaces.

The recommended install target remains:

```bash
npm install -g @veeduzyl/mindforge-guard@7.0.1
```

Do not make the version number, npm package, or GitHub Release the public commercial hero subject.

## Required Boundary

This rewrite must preserve:

- recommendation-only
- additive-only
- non-executing
- default-off where applicable
- non-control-plane
- human-review-oriented
- deterministic
- local-first where applicable
- no extra runtime authority for Enterprise
- no approval system
- no blocking system
- no safe-to-deploy claim
- no legal compliance guarantee
- no compliance certification
- no maturity certification
- no pricing change
- no entitlement change

## Explicit Non-Changes

This rewrite does not authorize changes to:

- packages
- schemas
- fixtures
- examples
- pricing / checkout / Paddle / license API
- entitlement logic
- runtime authority
- `.github/workflows/**`
- `action.yml`
- lockfiles
- audit / permit / classify / drift / license semantics
- deny exit code `25`
- historical release record docs

## Verification Intent

The companion verifier should confirm:

- single-agent governance evidence layer language is present
- AI-assisted work and single-agent AI workflows are present
- Evidence Pack is explained as an evidence bundle or review bundle
- authority boundary, execution evidence, missing evidence, and risk/drift signals are present
- use cases include AI coding agents, support agents, operations agents, and internal workflow agents
- one sample workflow is not the primary public hero path
- technical install stays secondary
- edition mapping uses customer-outcome language
- boundary terms exist
- forbidden claims remain absent
- no package/runtime/pricing/entitlement drift occurred
