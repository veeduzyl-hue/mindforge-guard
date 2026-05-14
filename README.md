# MindForge Guard

**Deterministic governance evidence layer for single-agent AI workflows.**

MindForge Guard helps teams make AI-assisted work reviewable before it becomes trusted. It turns Evidence Packs into deterministic governance reports so human reviewers can inspect authority boundaries, execution evidence, missing evidence, and risk/drift signals.

v7.0.1 is the current public commercial baseline.

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

## GitHub Action Demo

Run the first governance report in GitHub Actions as a manually triggered, non-blocking review artifact workflow.

See: [GitHub Action: First Governance Report](./docs/product/current/github-action-first-report.md)

The workflow does not approve, block, deploy, certify, or control execution.

## Editions

MindForge Guard editions differ by governance evidence depth, not runtime authority.

| Edition | Buyer outcome | Review depth |
|---|---|---|
| Community | See current governance evidence for one local single-agent workflow | Current-state evidence, local CLI evaluation, audit / permit / classify / drift status, license lifecycle commands |
| Pro | Track governance signals over time for AI-assisted work | Everything in Community, plus timeline-oriented governance review where released commands support it |
| Pro+ | Compare evidence states and uncover deeper governance signals | Everything in Pro, plus compare-oriented and correlation-oriented review where released commands support them |
| Enterprise | Standardize procurement, rollout, and review packets around the same bounded runtime posture | Commercial entitlement aligned with Pro+. No hosted control plane. No extra runtime authority. |

Edition boundaries:

- Editions change evidence depth and commercial access.
- Editions do not add approval authority.
- Editions do not add blocking authority.
- Enterprise does not add extra runtime authority.

See:

- [Current commercial baseline](./docs/product/current/v7_0_1_commercial_baseline.md)
- [Choose the right Guard edition](./docs/product/current/edition-value-map.md)
- [License guide](./docs/LICENSE.md)

## Demo Paths

Use the current demos to understand how Guard's evidence layer appears in different review situations.

- [Current product demos](./docs/demos/current/README.md)
- [First 10 minutes with Guard](./docs/first-10-minutes.md)
- [First governance report](./docs/product/current/first-governance-report.md)

Recommended demo order:

1. Start with First governance report.
2. Review current product demos.
3. Use the edition guide to decide whether Community, Pro, Pro+, or Enterprise fits the review depth you need.

Important:
Demos are explanatory paths. They do not approve, block, deploy, certify, or control execution.

## Common CLI Surface

Core local commands:

```bash
guard status
guard validate-policy
guard audit . --staged
guard snapshot .
guard action classify --text "write file README.md"
guard drift status --format json
```

Paid analytics commands where licensed and released:

```bash
guard drift timeline
guard drift compare
guard assoc correlate
```

License lifecycle commands:

```bash
guard license verify --file downloaded-license.json
guard license install --file downloaded-license.json
guard license status
guard license show
guard license remove
```

These commands remain local CLI surfaces. Guard produces review evidence and does not approve, block, deploy, certify, or control execution.

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
- a deployment-control authority
- a runtime control plane

MindForge Guard does not approve, block, deploy, certify, or control execution.

## Guides

- [First governance report](./docs/product/current/first-governance-report.md)
- [Current commercial baseline](./docs/product/current/v7_0_1_commercial_baseline.md)
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
