# v7.0.1 mindforge.run Implementation Pack

## Purpose

`mindforge.run` is externally hosted and Lovable-managed. This file is an implementation pack for the Lovable-hosted site, not a production deployment.

- v7.0.1 is the recommended install target because it restores the packaged CLI entrypoint.
- npm package: `@veeduzyl/mindforge-guard@7.0.1`
- GitHub Release: `v7.0.1`
- Historical context: v7.0.0 is published as a prior release, including `@veeduzyl/mindforge-guard@7.0.0` and GitHub Release: `v7.0.0`.
- No repository production site file is changed by this pack.
- No License Hub, pricing, entitlement, runtime authority, GitHub Action, or Marketplace change is made by this pack.

Use this pack to update the public website copy in a separate Lovable workflow.

## Lovable Prompt

Copy this prompt into Lovable:

```text
Update the existing mindforge.run homepage for MindForge Guard v7.0.1.

Keep the existing brand structure, visual rhythm, navigation, and commercial tone where possible. Avoid page bloat: add only compact modules or tighten existing sections. Do not create a dense technical documentation page.

Add visible v7.0.1 recommended-install status, including the package name @veeduzyl/mindforge-guard@7.0.1 and GitHub Release v7.0.1. Add a First Governance Report CTA. Add a concise Evidence Pack to Governance Report explanation. Add a compact Report Experience by Edition section. Add clear boundary language.

Use short buyer-readable copy, compact cards, and CTA blocks. Preserve the existing License Hub CTA destination already configured in the site. Add links to npm, GitHub Release v7.0.1, the v7.0 First Report doc, and the HR self-service example Evidence Pack.

Do not claim approval, blocking, compliance certification, maturity certification, legal compliance, or runtime control-plane authority. Do not imply pricing or entitlement changes. Do not launch or describe a GitHub Action or Marketplace listing as available.
```

## Suggested Page Modules

Use these modules only where they fit the current page without overfilling it:

1. Hero
2. Why v7.0.0 matters
3. First Governance Report in 10 Minutes
4. From Evidence Pack to Governance Report
5. Report Experience by Edition
6. Boundary / What Guard does not do
7. CTA to npm package
8. CTA to GitHub Release
9. CTA to License Hub

## Exact Copy Blocks

### Hero

Headline:

> Generate your first AI governance report from a local Evidence Pack.

Body:

> MindForge Guard v7.0.0 is published. It turns bounded single-agent evidence into a deterministic governance report for human review.

CTA labels:

- `Install Guard v7.0.1`
- `Generate a First Governance Report`
- `Open License Hub`

Proof line:

> Published as `@veeduzyl/mindforge-guard@7.0.1` with GitHub Release `v7.0.1`.

### Why v7.0.0 Matters

Title:

> v7.0.0 makes the first governance report concrete.

Body:

> Start from a local Evidence Pack, validate it, generate a single-agent report, and review authority, behavior evidence, and risk/drift signals.

Card copy:

- `Evidence in`: Start with a bounded HR self-service example Evidence Pack.
- `Report out`: Generate a deterministic report for human review.
- `Decision outside Guard`: Use the report to decide the next human review step in your own process.

### First Governance Report in 10 Minutes

Title:

> First Governance Report in 10 Minutes

Body:

> Install Guard, use the HR self-service example, run `pack validate`, then run `report single-agent`.

Command block:

```bash
npm install -g @veeduzyl/mindforge-guard@7.0.1
guard pack validate --pack examples/single-agent-governance-pack/hr-self-service-agent --preview --json
guard report single-agent --pack examples/single-agent-governance-pack/hr-self-service-agent --preview --json
```

CTA:

> Open the v7.0 First Report doc

### From Evidence Pack to Governance Report

Title:

> From Evidence Pack to Governance Report

Body:

> The Evidence Pack gives Guard the bounded task, action, data, and tool context. The report gives reviewers a readable view of authority, execution evidence, and risk signals.

Steps:

1. Open the HR self-service example Evidence Pack.
2. Validate the pack locally.
3. Generate the single-agent governance report.
4. Read the three report layers.

### Report Experience by Edition

Title:

> Report Experience by Edition

Body:

> Editions shape report reading depth, not runtime authority.

Edition cards:

- Community: current-state governance report preview.
- Pro: timeline / trend-oriented reading where released commands support it.
- Pro+: compare / correlate / deeper signals where released commands support them.
- Enterprise: same runtime entitlement as Pro+, with procurement and organizational adoption framing, and no extra runtime authority.

### Boundary / What Guard Does Not Do

Title:

> What Guard does not do

Body:

> Guard is recommendation-only, non-executing, non-control-plane, deterministic, local-first where applicable, and human-review-oriented. It does not make the human decision for you.

Boundary bullets:

- no approval system
- no blocking system
- no merge-safety promise
- no deployment-safety promise
- no legal compliance guarantee
- no compliance certification
- no maturity certification
- No GitHub Action launched
- No Marketplace available
- no pricing change
- no entitlement change

### CTA to npm Package

Title:

> Install the published package

Body:

> Use the published npm package to start the first report workflow locally.

CTA:

> Install `@veeduzyl/mindforge-guard@7.0.1`

### CTA to GitHub Release

Title:

> Read the v7.0.1 release

Body:

> Review the published release before you run the first governance report workflow.

CTA:

> Open GitHub Release `v7.0.1`

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
- Historical npm package URL: `https://www.npmjs.com/package/@veeduzyl/mindforge-guard/v/7.0.0`
- Historical GitHub Release v7.0.0 URL: `https://github.com/veeduzyl-hue/mindforge-guard/releases/tag/v7.0.0`
- License Hub URL: preserve the existing production `Open License Hub` URL already configured in Lovable; do not replace it with a guessed domain.
- v7.0 First Report doc URL: `https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/product/current/v7_0_first_report.md`
- HR example Evidence Pack URL: `https://github.com/veeduzyl-hue/mindforge-guard/tree/main/examples/single-agent-governance-pack/hr-self-service-agent`

## Design Constraints

- Do not overfill the page.
- Keep copy short and buyer-readable.
- Avoid dense technical paragraphs.
- Use compact cards / CTA blocks.
- Preserve current homepage commercial tone.
- Avoid legal or compliance overclaiming.
- Keep the First Governance Report path visible without turning the homepage into a docs page.
- Keep the existing License Hub CTA behavior.

## Acceptance Checklist

- v7.0.0 published status is visible.
- install CTA is visible.
- first report path is visible.
- edition experience is visible.
- boundary is visible.
- no approval, blocking, merge-safety, or deployment-safety claim appears.
- no compliance certification claim appears.
- no pricing or entitlement change is implied.
- License Hub link still works.
- GitHub Release link works.
- npm package link works.
- v7.0 First Report doc link works.
- HR example Evidence Pack link works.

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
- no merge-safety promise
- no deployment-safety promise
- no legal compliance guarantee
- no compliance certification
- no maturity certification
- No GitHub Action launched
- No Marketplace available
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
