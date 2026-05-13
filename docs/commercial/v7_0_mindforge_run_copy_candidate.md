# v7.0.1 mindforge.run Copy Candidate

## Candidate Status

This is a copy candidate for a future `mindforge.run` commercial surface. It is not a production page deployment.

- v7.0.1 is the recommended install target because it restores the packaged CLI entrypoint.
- npm package: `@veeduzyl/mindforge-guard@7.0.1`
- GitHub Release: `v7.0.1`
- Historical context: v7.0.0 is published as a prior release, including `@veeduzyl/mindforge-guard@7.0.0` and GitHub Release: `v7.0.0`.
- No change to pricing or entitlement in this copy candidate.
- No `mindforge.run` production file is changed by this candidate.

## Suggested Module: Hero / CTA Language For v7.0.0

Candidate headline:

> Generate your first AI governance report from a local Evidence Pack.

Candidate subcopy:

> MindForge Guard v7.0.0 turns bounded single-agent evidence into a deterministic governance report for human review. It helps teams inspect authority, execution evidence, and risk signals without turning Guard into an execution system or control plane.

Candidate CTA labels:

- `Install Guard v7.0.1`
- `Generate a first report`
- `Read the GitHub Release`

Candidate proof line:

> Published as `@veeduzyl/mindforge-guard@7.0.1` with GitHub Release `v7.0.1`.

## Suggested Module: From Evidence Pack To Governance Report

Candidate section title:

> From Evidence Pack to Governance Report

Candidate copy:

> Start with a local Evidence Pack. Validate that the pack is readable, then generate a single-agent governance report in preview mode. The report is deterministic and designed for human review, not automated approval or execution control.

Suggested steps:

1. Install the published package.
2. Open the HR self-service example Evidence Pack.
3. Run `guard pack validate --pack <path> --preview --json`.
4. Run `guard report single-agent --pack <path> --preview --json`.
5. Read the report through the three review layers.

## Suggested Module: First Governance Report In 10 Minutes

Candidate section title:

> First Governance Report in 10 Minutes

Candidate copy:

> The fastest first run uses the included HR self-service example Evidence Pack. It gives new users a complete local path from install to report reading without changing their runtime, CI, pricing, or entitlement setup.

Suggested command block:

```bash
npm install -g @veeduzyl/mindforge-guard@7.0.1
guard pack validate --pack examples/single-agent-governance-pack/hr-self-service-agent --preview --json
guard report single-agent --pack examples/single-agent-governance-pack/hr-self-service-agent --preview --json
```

Suggested report reading copy:

> Read the report in three layers: Authority / Permission Boundary, Execution / Behavior Evidence, and Risk / Drift / Maturity Signals.

## Suggested Module: Report Experience By Edition

Candidate copy:

> Guard editions shape the report reading experience, not runtime authority.

Edition mapping:

- Community: current-state governance report preview for a single Evidence Pack.
- Pro: timeline / trend-oriented report reading where released commands support it.
- Pro+: compare / correlate / deeper signals where released commands support them.
- Enterprise: same runtime entitlement as Pro+, procurement / organizational adoption framing, no extra runtime authority.

Suggested Enterprise note:

> Enterprise is for procurement, support, and organizational adoption framing around the same released runtime entitlement as Pro+. It is not a control plane and does not add execution authority.

## Suggested Module: Boundary: Not Approval, Not Blocking, Not Compliance Certification

Candidate copy:

> MindForge Guard v7.0.0 is recommendation-only, non-executing, non-control-plane, deterministic, local-first where applicable, and human-review-oriented. Reports help reviewers decide their next action outside Guard.

Candidate boundary bullets:

- Not an approval system.
- Not a blocker.
- Not a deployment gate.
- Not a legal compliance guarantee.
- Not a maturity certification.
- No GitHub Action is launched in this candidate.
- No Marketplace listing is provided in this candidate.
- No pricing change.
- No entitlement change.
- No extra runtime authority for Enterprise.

## Implementation Boundary

This document is a copy candidate only.

Do not implement this candidate by changing:

- `mindforge.run` production files
- `apps/license-hub/**`
- pricing
- checkout
- Paddle
- license API
- runtime authority
- entitlement
- GitHub Action
- Marketplace
