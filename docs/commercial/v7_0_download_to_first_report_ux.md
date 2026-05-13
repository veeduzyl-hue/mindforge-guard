# v7.0.1 Download To First Report UX

## Candidate Status

This is a commercial UX plan for the v7.0.1 first report path. It is not a production implementation.

- The public entry story is single-agent governance evidence, not version-led install marketing.
- The recommended install target for technical docs remains `@veeduzyl/mindforge-guard@7.0.1`.
- No change to pricing or entitlement in this copy candidate.
- No License Hub production page is changed.
- No `mindforge.run` production page is changed.

## UX Goal

Help a new user move from a commercial entry point to a first deterministic governance report without changing runtime authority, pricing, entitlement, CI, Marketplace, or production website surfaces.

The flow remains recommendation-only, non-executing, non-control-plane, local-first where applicable, deterministic, and human-review-oriented.

## Entry Points

User arrives from:

- `mindforge.run`
- License Hub

The entry point should make clear that MindForge Guard is a deterministic governance evidence layer for single-agent AI workflows and that the next step is to review a first single-agent action with evidence.

## Download To First Report Flow

1. User arrives from `mindforge.run` or License Hub.
2. User reads the evidence-layer framing and understands the boundary: not an approval system, not a blocker, not a control plane.
3. User opens the first-workflow guide or a synthetic sample evidence bundle for local validation.
4. User installs Guard from a secondary technical section: `npm install -g @veeduzyl/mindforge-guard@7.0.1`.
5. User verifies CLI availability with a local CLI check.
6. User downloads or installs a license if applicable to the paid edition.
7. User runs pack validation and report generation for the sample workflow.
8. User reads the governance report through the authority boundary, execution evidence, missing evidence, and risk/drift signals.
9. User decides the next human review action outside Guard.

## First Workflow Story

The public first workflow should say:

- review your first single-agent action with evidence
- start with a sample agent action
- validate the evidence bundle
- generate a governance report
- inspect authority boundary, execution evidence, missing evidence, and risk/drift signals
- make the next human review decision outside Guard

Do not make one sample workflow the public first-report hero path. If an example is kept, describe it as a synthetic sample evidence bundle for local validation.

## Evidence Pack Explanation

An Evidence Pack is the review bundle behind an AI-assisted action:

- task context
- allowed scope
- action trace
- tool/data references
- outputs
- missing evidence
- reviewer notes

The governance report is the evidence-bound review artifact created from that bundle.

## Use Cases

The public flow should work for:

- AI coding agents
- Support agents
- Operations agents
- Internal workflow agents

AI coding copy:

> Review evidence behind AI-generated code changes before merge or release decisions.

## Report Experience By Edition

Edition mapping:

- Community: See the current governance evidence for one agent workflow.
- Pro: Track governance signals over time.
- Pro+: Compare evidence states and uncover deeper signals.
- Enterprise: Standardize adoption, review packets, and procurement around the same bounded runtime posture. No extra runtime authority.

Edition boundary:

- Report experience can vary by released command support.
- Runtime authority does not expand by edition.
- Enterprise adds adoption and procurement support, not extra execution authority.

## Human Review Decision Outside Guard

The final UX step is outside Guard:

- assign a reviewer
- request more evidence
- continue investigation
- document a governance review result in the team's own system
- decide whether another human process should continue

Guard does not make that decision. The report is an evidence-bound reading surface.

## Boundary

This UX plan preserves:

- recommendation-only
- additive-only
- non-executing
- default-off where applicable
- non-control-plane
- local-first where applicable
- deterministic
- human-review-oriented
- no extra runtime authority for Enterprise
- no approval system
- no blocking system
- no safe-to-deploy claim
- no legal compliance guarantee
- no compliance certification
- no maturity certification
- no pricing change
- no entitlement change

## Implementation Boundary

This document is a UX plan and copy candidate only.

Do not implement this candidate by changing:

- `apps/license-hub/**`
- `mindforge.run` production files
- pricing
- checkout
- Paddle
- license API
- runtime authority
- entitlement
- GitHub Action
- Marketplace
- packages
- schemas
- fixtures
- examples
- `.github/workflows/**`
- `action.yml`
- lockfiles
