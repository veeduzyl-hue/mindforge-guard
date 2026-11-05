# MindForge Guard

**Deterministic governance evidence layer for single-agent AI workflows.**

MindForge Guard helps teams make AI-assisted work reviewable before it becomes trusted. It turns Evidence Packs into deterministic governance reports so human reviewers can inspect authority boundaries, execution evidence, missing evidence, and risk/drift signals.

> Not an approval system. Not a blocker. Not a control plane.

## Install

```bash
npm install -g @veeduzyl/mindforge-guard@7.0.1
```

```bash
guard --version
guard --help
```

## First Governance Report

Use the sample single-agent Evidence Pack to generate a deterministic governance report locally:

```bash
guard pack validate --pack examples/single-agent-governance-pack/hr-self-service-agent --preview --json
guard report single-agent --pack examples/single-agent-governance-pack/hr-self-service-agent --preview --json
```

Read the report through:

- authority boundaries
- execution evidence
- missing evidence
- risk/drift signals

Guard remains recommendation-only, additive-only, non-executing, default-off where applicable, non-control-plane, deterministic, local-first where applicable, and human-review-oriented.

Guard does not approve, block, deploy, certify, or control execution.

## Standalone Sample Pack

For a first local walkthrough, download the [standalone synthetic HR Self-Service Sample Pack](https://github.com/veeduzyl-hue/mindforge-guard/blob/main/downloads/mindforge-guard-hr-self-service-sample-pack-v0.1.zip), then verify its adjacent SHA-256 file and manifest. It contains only the eleven sample files; you do not need to download the full source repository. Extract it to a short working directory and use the extracted `hr-self-service-agent` directory as the `--pack` path.

The pack is synthetic review material only. It is not evidence of your own production workflow and does not establish production assurance.

## English Role-Based HTML Report

The source repository now contains an offline English renderer with Business Owner, Technical Reviewer, and Governance / Risk Reviewer perspectives:

```bash
guard report render --input first-report.json --out first-report.html --format html
```

**Release distinction:** this command is not included in the published npm v7.0.1 package. It becomes available from a future package release that includes PR #349. Do not run this command against npm v7.0.1 and infer a product defect if it is unavailable. The HTML is a reading aid over the same JSON; it does not approve, certify, or authorize execution. Inspect the source JSON for sensitive content before sharing the HTML.

## License Hub

Use License Hub to buy a commercial edition, sign in with your purchase email, download the signed license JSON, and keep local CLI license usage aligned with the same bounded runtime posture.

Typical local license flow:

```bash
guard license verify --file downloaded-license.json
guard license install --file downloaded-license.json
guard license status
```

## Links

- [First governance report guide](https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/product/current/first-governance-report.md)
- [License guide](https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/LICENSE.md)
- [Verification guide](https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/VERIFY.md)
- [npm package](https://www.npmjs.com/package/@veeduzyl/mindforge-guard/v/7.0.1)
- [GitHub release v7.0.1](https://github.com/veeduzyl-hue/mindforge-guard/releases/tag/v7.0.1)

## v7.1.0-rc.0 Candidate — Not Published

This source candidate is **not** the public npm release. The current published version remains `@veeduzyl/mindforge-guard@7.0.1`. For review, install only the version-pinned `7.1.0-rc.0` tarball from the bounded GitHub Actions RC artifact in an isolated directory; do not use `npm install @veeduzyl/mindforge-guard@7.1.0-rc.0` because no registry publish is authorized.

The candidate adds the existing, explicitly invoked English offline renderer to the packaged CLI. After the RC tarball is installed, use the standalone 11-file synthetic Sample Pack, validate and generate a JSON preview, then run:

```bash
guard report render --input first-report.json --out first-report.html --format html
```

The JSON stays the source evidence; the English HTML is a non-executing, role-based review aid, not approval, certification, or runtime authorization. The entire input JSON is embedded in HTML as escaped text; review and redact sensitive content before sharing. Report timestamps may be synthetic fixture timestamps. `ready_for_review` is not an approval.

Community access to this first-report path remains free. Pro, Pro+ and Enterprise features and commercial prices do not change.
