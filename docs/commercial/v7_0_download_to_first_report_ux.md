# v7.0.1 Download To First Report UX

## Candidate Status

This is a commercial UX plan for the v7.0.1 first report path. It is not a production implementation.

- v7.0.1 is the recommended install target because it restores the packaged CLI entrypoint.
- npm package: `@veeduzyl/mindforge-guard@7.0.1`
- GitHub Release: `v7.0.1`
- Historical context: v7.0.0 is published as a prior release, including `@veeduzyl/mindforge-guard@7.0.0` and GitHub Release: `v7.0.0`.
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

The entry point should make clear that v7.0.1 is the recommended install target and that the next step is a local First Governance Report workflow.

## Download To First Report Flow

1. User arrives from `mindforge.run` or License Hub.
2. User installs package: `npm install -g @veeduzyl/mindforge-guard@7.0.1`.
3. User verifies CLI availability with a local CLI check.
4. User downloads or installs a license if applicable to the paid edition.
5. User opens the example Evidence Pack:
   `examples/single-agent-governance-pack/hr-self-service-agent/`.
6. User runs pack validate:
   `guard pack validate --pack examples/single-agent-governance-pack/hr-self-service-agent --preview --json`.
7. User runs report single-agent:
   `guard report single-agent --pack examples/single-agent-governance-pack/hr-self-service-agent --preview --json`.
8. User reads the report through the three report layers.
9. User decides the next human review action outside Guard.

## First Governance Report Workflow

The First Governance Report workflow is:

- install Guard
- activate license if paid edition
- use example Evidence Pack
- validate pack with `pack validate`
- generate single-agent governance report with `report single-agent`
- read report using the three layers
- make the next human review decision outside Guard

## Three Report Reading Layers

### Authority / Permission Boundary

Review the visible task boundary, permission context, and what the report leaves to human decision-making.

### Execution / Behavior Evidence

Review the Evidence Pack contents, execution and behavior evidence, traceability, omissions, and limitations.

### Risk / Drift / Maturity Signals

Review risk, drift, maturity, missing-evidence, and limitation signals before deciding the next human action.

## Report Experience By Edition

Edition mapping:

- Community: current-state governance report preview.
- Pro: timeline / trend-oriented report reading where released commands support it.
- Pro+: compare / correlate / deeper signals where released commands support them.
- Enterprise: same runtime entitlement as Pro+, procurement / organizational adoption framing, no extra runtime authority.

Edition boundary:

- Report experience can vary by released command support.
- Runtime authority does not expand by edition.
- Enterprise adds commercial and organizational framing, not extra execution authority.

## Human Review Decision Outside Guard

The final UX step is outside Guard:

- assign a reviewer
- request more evidence
- continue investigation
- document a governance review result in the team's own system
- decide whether another human process should continue

Guard does not make that decision. The report is an evidence-backed reading surface.

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
- no merge-safety claim
- no deployment-safety claim
- no legal compliance guarantee
- no compliance certification
- no maturity certification
- No GitHub Action is launched.
- No Marketplace listing is available.
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
