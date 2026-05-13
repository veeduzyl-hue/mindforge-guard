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
