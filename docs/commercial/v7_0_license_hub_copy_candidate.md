# v7.0.0 License Hub Copy Candidate

## Candidate Status

This is a copy candidate for a future License Hub module. It is not a production page change.

- v7.0.0 is published.
- npm package: `@veeduzyl/mindforge-guard@7.0.0`
- GitHub Release: `v7.0.0`
- No change to pricing or entitlement in this copy candidate.
- No License Hub TSX page is changed by this candidate.

The copy below translates the released v7.0.0 First Governance Report path into buyer onboarding language while preserving Guard's recommendation-only, non-executing, non-control-plane posture.

## Suggested Module: After Purchase: Generate Your First Governance Report

After purchase, start by generating your first local governance report from an example Evidence Pack.

Suggested copy:

> Your license gives you access to the Guard edition you purchased. Start by installing the published v7.0.0 package, activating your license if you purchased a paid edition, and generating a deterministic single-agent governance report from the HR self-service example Evidence Pack.

Suggested CTA label:

`Generate your first governance report`

Suggested helper copy:

> This workflow creates a report for human review. Guard does not approve, block, deploy, certify, or control execution.

## Suggested Module: Start With The v7.0.0 First Report Workflow

First Governance Report workflow:

1. Install Guard from npm: `@veeduzyl/mindforge-guard@7.0.0`.
2. Activate a license if using a paid edition.
3. Open the example Evidence Pack.
4. Run `guard pack validate --pack <path> --preview --json`.
5. Run `guard report single-agent --pack <path> --preview --json`.
6. Read the single-agent governance report through the three report layers.
7. Decide the next human review action outside Guard.

Suggested copy:

> The v7.0.0 first report workflow turns a local Evidence Pack into a deterministic governance report. It is designed for human reviewers who need a bounded view of authority, behavior evidence, and risk signals before deciding what to do next in their own process.

## Suggested Module: Use The HR Self-Service Example Evidence Pack

Use the HR self-service example Evidence Pack:

`examples/single-agent-governance-pack/hr-self-service-agent/`

Suggested copy:

> Start with the synthetic HR self-service example. It gives you a complete Evidence Pack that can be validated locally and then converted into a single-agent governance report preview.

Suggested command copy:

```bash
guard pack validate --pack examples/single-agent-governance-pack/hr-self-service-agent --preview --json
guard report single-agent --pack examples/single-agent-governance-pack/hr-self-service-agent --preview --json
```

## Suggested Module: Understand Your Edition's Report Experience

Edition mapping:

- Community: current-state governance report preview for a single local Evidence Pack.
- Pro: timeline / trend-oriented report reading where released commands support it.
- Pro+: compare / correlate / deeper signals where released commands support them.
- Enterprise: same runtime entitlement as Pro+, with procurement and organizational adoption framing, and no extra runtime authority.

Suggested copy:

> All editions keep the same bounded runtime posture: local-first where applicable, deterministic, recommendation-only, non-executing, non-control-plane, and human-review-oriented. Enterprise supports organizational adoption conversations around the same released runtime entitlement as Pro+; it does not add execution authority.

## Suggested Module: Read The Report In Three Layers

Use these three layers in the License Hub onboarding module:

### Authority / Permission Boundary

Suggested copy:

> Understand what the agent was expected to do, what permission boundary was visible, and what the report explicitly leaves to human review.

### Execution / Behavior Evidence

Suggested copy:

> Inspect the evidence that describes what happened, what files or artifacts were included, and whether the report is traceable enough for review.

### Risk / Drift / Maturity Signals

Suggested copy:

> Review risk, drift, maturity, missing-evidence, and limitation signals before deciding the next human step outside Guard.

## Suggested Module: What Guard Does Not Do

Suggested copy:

> Guard is a deterministic governance layer for evidence-backed review. It is not an approval system, not a blocker, not a deployment gate, not a legal compliance guarantee, and not a maturity certification. v7.0.0 does not launch a GitHub Action, does not provide a Marketplace listing, and does not change pricing or entitlement.

Boundary terms to preserve:

- recommendation-only
- additive-only
- non-executing
- default-off where applicable
- non-control-plane
- local-first where applicable
- deterministic
- human-review-oriented
- no extra runtime authority for Enterprise
- no pricing change
- no entitlement change

## Implementation Boundary

This document is a copy candidate only.

Do not implement this candidate by changing:

- `apps/license-hub/**`
- pricing
- checkout
- Paddle
- license API
- runtime authority
- entitlement
- GitHub Action
- Marketplace
- `mindforge.run`
