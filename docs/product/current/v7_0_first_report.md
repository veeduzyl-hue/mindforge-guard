# v7.0 First Report Candidate

## Scope

- README/docs candidate only
- Not a public launch
- No pricing change
- No entitlement change
- No License Hub change
- No GitHub Action launch
- No Marketplace launch

## Current Baseline

MindForge Guard v6.13.1 remains the current commercial baseline until separately approved otherwise.

v7.0 has passed internal E2E acceptance and commercial release gate review.
This PR is a README/docs candidate, not a public launch.

## The v7.0 Preview Report Path

The `v7.0` path is a preview report path for a single-agent governance review flow:

1. Evidence Pack
2. Pack Parser Preview
3. CLI Pack Validate Preview
4. Report Single-Agent Preview
5. Human Review Reading View

The goal is a deterministic report artifact that helps human reviewers read authority, behavior evidence, and risk/drift signals without turning Guard into an execution authority.

## Preview Commands

Use the preview commands exactly as implemented:

```bash
guard pack validate --pack <path> --preview --json
guard report single-agent --pack <path> --preview --json
```

These commands are preview-only in `v7.0` in this candidate path.
They remain local-first, deterministic, non-executing, recommendation-only, and human-review-oriented.

## HR Self-Service Example Evidence Pack

Use the existing synthetic example pack at:

`examples/single-agent-governance-pack/hr-self-service-agent/`

This example pack helps users understand how the `v7.0` path prepares:

- an Evidence Pack with bounded task, action, data, and tool context
- a local pack validation preview
- a local single-agent governance report preview
- a human review reading view over the resulting report

The example pack is explanatory only.
It does not invent new runtime behavior or new fixture semantics.

## How To Read The Report

The report is meant to be read through three layers:

### Authority / Permission Boundary

This layer helps reviewers understand what the agent was supposed to do, what authority boundary was visible, and what the report explicitly does not authorize.

### Execution / Behavior Evidence

This layer helps reviewers understand what happened, what evidence exists, and whether the report is traceable enough for human review.

### Risk / Drift / Maturity Signals

This layer helps reviewers inspect risk signals, drift signals, evidence maturity signals, and missing evidence that still needs human follow-up.

## Report Experience By Edition

Across all editions, this report path remains recommendation-only, non-executing, non-control-plane, human-review-oriented, and does not approve, block, deploy, certify, or control execution.

### Community

- current-state governance report preview for a single reviewable pack/run
- Evidence Pack
- Authority / Permission Boundary
- Execution / Behavior Evidence
- Missing Evidence / Limitations
- Human Review Next Step
- It does not promise timeline, compare, or correlate views.

### Pro

- everything in Community
- trend / timeline-oriented reading where released commands support it
- It does not promise deep correlation by default.

### Pro+

- everything in Pro
- compare / correlate / deeper signals where released commands support them
- It remains a human-review reading surface, not an approval, blocking, enforcement, or deploy go/no-go output.

### Enterprise

- same runtime entitlement as Pro+ in the current commercial boundary
- procurement / organizational adoption / governance packet framing around the same report path
- no extra runtime authority
- not a control plane

## What Users Should Expect From v7.0

`v7.0` introduces a preview report path that can:

- validate a local Evidence Pack in preview mode
- generate a local single-agent governance report preview
- produce a deterministic report artifact
- help reviewers read authority, behavior evidence, and risk/drift signals

The path is evidence-backed and buyer-readable, but it does not approve, block, deploy, certify, or control execution.

## Not Included / Not Claimed in v7.0

`v7.0` does not provide:

- compliance certification
- legal compliance claim
- maturity certification
- approval
- blocking
- safe-to-merge
- safe-to-deploy
- runtime control plane
- policy engine
- GitHub Action launched
- Marketplace available
- entitlement changed
- pricing changed

It also does not approve, block, deploy, certify, or control execution.

## Candidate Positioning Notes

This candidate path is appropriate for explaining:

- Evidence Pack to Governance Report
- files in, deterministic governance report out
- single-agent governance report preview
- evidence-backed report review
- preview-only, non-executing, recommendation-oriented review

This candidate path is not appropriate for claiming:

- launch-level authority or enforcement
- certification or legal conclusion
- automation-led execution control
- public commercial baseline change

## Next Review Step

This candidate layer supports a future README/docs review wave only.
It does not authorize pricing changes, entitlement changes, License Hub deployment, mindforge.run publication, GitHub Action implementation, Marketplace work, or compliance claims.
