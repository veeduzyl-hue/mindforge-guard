# v7.0.1 Commercial Baseline

v7.0.1 is the current public commercial baseline.

## Current Package

- current npm package: `@veeduzyl/mindforge-guard@7.0.1`

## Positioning

MindForge Guard is a deterministic governance evidence layer for single-agent AI workflows.

It helps teams make AI-assisted work reviewable before it becomes trusted, while preserving a bounded, local-first, recommendation-only runtime posture.

## First Governance Report Path

Start with the current public first-report guide:

- [First Governance Report](./first-governance-report.md)

Use that path to install Guard, validate the sample Evidence Pack, and generate a deterministic governance report locally.

For a manually triggered GitHub Actions walkthrough that uploads the same first-report outputs as review artifacts, see:

- [GitHub Action: First Governance Report](./github-action-first-report.md)

For closeout notes and future GitHub Marketplace Action planning, see:

- [GitHub Marketplace Action Feasibility](./marketplace-action-feasibility.md)

## Editions

Current buyer-facing editions are:

- Community
- Pro
- Pro+
- Enterprise

Editions change governance evidence depth, not runtime authority.

For the buyer-value map, see:

- [Edition Value Map](./edition-value-map.md)

## License Hub

License Hub supports purchase, account access, and signed license delivery for commercial editions.

Paid licensing remains a signed local license JSON workflow:

- `guard license verify --file downloaded-license.json`
- `guard license install --file downloaded-license.json`
- `guard license status`

## Product Boundary

Guard produces review evidence. It does not approve, block, deploy, certify, or control execution.

MindForge Guard remains recommendation-only, additive-only, non-executing, default-off where applicable, non-control-plane, deterministic, and local-first where applicable.

Enterprise keeps the same bounded runtime posture:

- no hosted control plane
- No extra runtime authority
- no approval system
- no blocking system
- no deployment-control authority

## Related References

- [Trust FAQ](./trust-faq.md)
- [First 10 Minutes With Guard](../../first-10-minutes.md)
- [Verification Guide](../../VERIFY.md)
