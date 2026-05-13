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

## Generate Your First Governance Report

Use the sample single-agent Evidence Pack to validate inputs and generate a deterministic report locally:

```bash
guard pack validate --pack examples/single-agent-governance-pack/hr-self-service-agent --preview --json
guard report single-agent --pack examples/single-agent-governance-pack/hr-self-service-agent --preview --json
```

Human reviewers use the report to inspect:

- authority boundaries
- execution evidence
- missing evidence
- risk/drift signals

Guard produces review evidence. The final human review decision remains outside Guard.

## License Hub

Use License Hub to buy a commercial edition, sign in with your purchase email, download the signed license JSON, and keep local CLI license usage aligned with the same bounded runtime posture.

Typical local license flow:

```bash
guard license verify --file downloaded-license.json
guard license install --file downloaded-license.json
guard license status
```

## Product Boundary

MindForge Guard remains:

- recommendation-only
- additive-only
- non-executing
- default-off where applicable
- non-control-plane
- deterministic
- local-first where applicable
- human-review-oriented

MindForge Guard does not become:

- an approval system
- a blocking system
- a deployment gate
- a runtime control plane

MindForge Guard does not approve, block, deploy, certify, or control execution.

## Guides

- [First governance report](./docs/product/current/first-governance-report.md)
- [Choose the right Guard edition](./docs/product/current/edition-value-map.md)
- [Trust FAQ](./docs/product/current/trust-faq.md)
- [First 10 minutes with Guard](./docs/first-10-minutes.md)
- [License guide](./docs/LICENSE.md)
- [Verification guide](./docs/VERIFY.md)

## Package

- [npm package](https://www.npmjs.com/package/@veeduzyl/mindforge-guard/v/7.0.1)
- [GitHub release v7.0.1](https://github.com/veeduzyl-hue/mindforge-guard/releases/tag/v7.0.1)

## License

See [LICENSE](./LICENSE).
