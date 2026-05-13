# v7.0.1 mindforge.run Implementation Pack

## Purpose

`mindforge.run` is externally hosted and Lovable-managed. This file is an implementation pack for the Lovable-hosted site, not a production deployment.

- The public story is single-agent governance evidence, not version-led packaging.
- The recommended install target for secondary technical docs remains `@veeduzyl/mindforge-guard@7.0.1`.
- No repository production site file is changed by this pack.
- No License Hub, pricing, entitlement, runtime authority, GitHub Action, or Marketplace change is made by this pack.

Use this pack to update the public website copy in a separate Lovable workflow.

## Lovable Prompt

Copy this prompt into Lovable:

```text
Update the existing mindforge.run homepage for MindForge Guard.

Keep the existing brand structure, visual rhythm, navigation, and commercial tone where possible. Avoid page bloat: add only compact modules or tighten existing sections. Do not create a dense technical documentation page.

Make the hero story: "Make AI-assisted work reviewable before it becomes trusted."
Use this subhead: "MindForge Guard is a deterministic governance evidence layer for single-agent AI workflows. It helps teams inspect authority, evidence, state, and decision boundaries before AI-assisted work is accepted into business or engineering processes."
Add a short boundary line: "Not an approval system. Not a blocker. Not a control plane."

Explain the Evidence Pack as the review bundle behind an AI-assisted action. Explain the governance report as the evidence-bound review artifact. Add a first-workflow module that reviews a sample single-agent action with evidence. Include use cases for AI coding agents, support agents, operations agents, and internal workflow agents.

Keep version, npm package, and GitHub Release references in a secondary technical install/docs module. Use @veeduzyl/mindforge-guard@7.0.1 only there. If you mention a sample, describe it as a synthetic sample evidence bundle for local validation, not as the public first-report hero path.

Do not claim approval, blocking, safe-to-deploy, compliance certification, legal compliance guarantee, maturity certification, or runtime control-plane authority. Do not imply pricing or entitlement changes. Enterprise must keep the same bounded runtime posture with no extra runtime authority.
```

## Suggested Page Modules

Use these modules only where they fit the current page without overfilling it:

1. Hero
2. Why reviewable evidence matters
3. Use cases
4. Review your first single-agent action with evidence
5. From Evidence Pack to governance report
6. Editions by customer outcome
7. Secondary technical install
8. Boundary / What Guard does not do
9. CTA to License Hub

## Exact Copy Blocks

### Hero

Headline:

> Make AI-assisted work reviewable before it becomes trusted.

Body:

> MindForge Guard is a deterministic governance evidence layer for single-agent AI workflows. It helps teams inspect authority, evidence, state, and decision boundaries before AI-assisted work is accepted into business or engineering processes.

Boundary line:

> Not an approval system. Not a blocker. Not a control plane.

CTA labels:

- `Review a first workflow`
- `Compare edition depth`
- `Open License Hub`

### Why Reviewable Evidence Matters

Title:

> Review AI-assisted work before it becomes trusted

Body:

> Teams need a bounded way to inspect authority boundary, execution evidence, missing evidence, and risk/drift signals before AI-assisted work enters business or engineering processes.

Card copy:

- `Evidence in`: Start with an evidence bundle behind an AI-assisted action.
- `Report out`: Generate a governance report for human review.
- `Decision outside Guard`: Use the report to decide the next human review step in your own process.

### Use Cases

Title:

> One bounded story across common single-agent workflows

Cards:

- `AI coding agents`: Review evidence behind AI-generated code changes before merge or release decisions.
- `Support agents`: Inspect action trace, allowed scope, and missing evidence before service actions are trusted.
- `Operations agents`: Review execution evidence and risk/drift signals before operational follow-through enters a human process.
- `Internal workflow agents`: Keep workflow actions reviewable without adding a control plane.

### Review Your First Single-Agent Action With Evidence

Title:

> Review your first single-agent action with evidence

Body:

> Start with a sample agent action. Guard validates the evidence bundle, generates a governance report, and shows reviewers the authority boundary, execution evidence, missing evidence, and risk/drift signals.

Supporting note:

> If a sample is shown, describe it as a synthetic sample evidence bundle for local validation.

### From Evidence Pack to Governance Report

Title:

> From Evidence Pack to governance report

Body:

> An Evidence Pack is the review bundle behind an AI-assisted action: task context, allowed scope, action trace, tool/data references, outputs, missing evidence, and reviewer notes.

Supporting copy:

> The governance report is the evidence-bound review artifact generated from that bundle.

### Editions by Customer Outcome

Title:

> Editions by customer outcome

Body:

> Editions shape how much governance evidence teams can read and compare over time, not runtime authority.

Edition cards:

- Community: See the current governance evidence for one agent workflow.
- Pro: Track governance signals over time.
- Pro+: Compare evidence states and uncover deeper signals.
- Enterprise: Standardize adoption, review packets, and procurement around the same bounded runtime posture. No extra runtime authority.

### Secondary Technical Install

Title:

> Technical install and release references

Body:

> Keep install and release references in a secondary docs-oriented area. The recommended install target is `@veeduzyl/mindforge-guard@7.0.1`.

Command block:

```bash
npm install -g @veeduzyl/mindforge-guard@7.0.1
```

Release links:

- npm package URL: `https://www.npmjs.com/package/@veeduzyl/mindforge-guard/v/7.0.1`
- GitHub Release v7.0.1 URL: `https://github.com/veeduzyl-hue/mindforge-guard/releases/tag/v7.0.1`

### Boundary / What Guard Does Not Do

Title:

> What Guard does not do

Body:

> Guard is recommendation-only, non-executing, non-control-plane, deterministic, local-first where applicable, and human-review-oriented. It does not make the human decision for you.

Boundary bullets:

- no approval system
- no blocking system
- no safe-to-deploy claim
- no legal compliance guarantee
- no compliance certification
- no maturity certification
- no pricing change
- no entitlement change
- no extra runtime authority for Enterprise

### CTA to License Hub

Title:

> Need a paid edition?

Body:

> Use License Hub for purchase, account access, and signed license delivery. Keep the existing License Hub link target already configured on mindforge.run.

CTA:

> Open License Hub

## Links To Use

- npm package URL: `https://www.npmjs.com/package/@veeduzyl/mindforge-guard/v/7.0.1`
- GitHub Release v7.0.1 URL: `https://github.com/veeduzyl-hue/mindforge-guard/releases/tag/v7.0.1`
- License Hub URL: preserve the existing production `Open License Hub` URL already configured in Lovable; do not replace it with a guessed domain.
- single-agent positioning brief URL: `https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/commercial/v7_0_1_single_agent_governance_positioning.md`
- first report workflow URL: `https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/product/current/v7_0_first_report.md`
- synthetic sample evidence bundle URL: `https://github.com/veeduzyl-hue/mindforge-guard/tree/main/examples/single-agent-governance-pack/hr-self-service-agent`

## Design Constraints

- Do not overfill the page.
- Keep copy short and buyer-readable.
- Avoid dense technical paragraphs.
- Use compact cards / CTA blocks.
- Preserve current homepage commercial tone.
- Avoid legal or compliance overclaiming.
- Keep the first workflow visible without turning the homepage into a docs page.
- Keep the existing License Hub CTA behavior.

## Acceptance Checklist

- single-agent governance evidence is the primary public story
- AI-assisted work and single-agent AI workflows are visible
- Evidence Pack is explained as an evidence bundle or review bundle
- the first workflow path is visible
- use cases are visible
- edition experience is visible
- boundary is visible
- no approval, blocking, safe-to-deploy, or compliance certification claim appears
- no pricing or entitlement change is implied
- License Hub link still works
- technical install references are secondary

## Boundary

This implementation pack preserves:

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

This pack does not authorize changes to:

- License Hub
- pricing
- checkout
- Paddle
- license API
- runtime authority
- entitlement
- packages
- schemas
- fixtures
- examples
- GitHub Action
- Marketplace
- repository production website files
