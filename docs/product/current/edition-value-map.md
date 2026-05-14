# Edition Value Map

## Purpose

This page explains the current v7.0.1 editions in buyer-value terms, then maps those outcomes back to the released command boundary.

- v7.0.1 is the current public commercial baseline
- MindForge Guard is a deterministic governance evidence layer for single-agent AI workflows
- Editions change governance evidence depth, not runtime authority
- Editions do not add approval authority, blocking authority, deployment authority, or runtime control-plane authority

## The Buyer Story In One Line

Guard helps teams make single-agent AI-assisted work reviewable before it becomes trusted, then upgrade only when they need deeper evidence over time, comparison, correlation, or organizational rollout support.

## Community

Buyer value:

- see current governance evidence for one local single-agent workflow
- inspect current status, policy state, audit output, current drift status, action classification, and license lifecycle commands
- start with local CLI evaluation without hosted execution authority

Released command boundary:

- `guard status`
- `guard validate-policy`
- `guard audit . --staged`
- `guard snapshot .`
- `guard action classify --text "<text>"`
- `guard drift status`
- `guard license verify --file <file>`
- `guard license install --file <file>`
- `guard license status`
- `guard license show`
- `guard license remove`

## Pro

Buyer value:

- track governance signals over time for AI-assisted work
- move from one-time evidence snapshot to timeline-oriented review where released commands support it

Released command boundary:

- everything in Community
- `guard drift timeline` where licensed and released

## Pro+

Buyer value:

- compare evidence states and uncover deeper governance signals
- support teams that need compare-oriented or correlation-oriented review before trust

Released command boundary:

- everything in Pro
- `guard drift compare` where licensed and released
- `guard assoc correlate` where licensed and released

## Enterprise

Buyer value:

- standardize procurement, rollout, and review packets around the same bounded runtime posture
- support organizational adoption without adding runtime authority

Released commercial boundary:

- commercial entitlement aligned with Pro+
- no hosted control plane
- No extra runtime authority
- no approval system
- no blocking system
- no deployment-control authority

## Boundary

Guard produces review evidence. It does not approve, block, deploy, certify, or control execution.

## Related References

- [v7.0.1 Commercial Baseline](./v7_0_1_commercial_baseline.md)
- [First Governance Report](./first-governance-report.md)
- [Trust FAQ](./trust-faq.md)
- [First 10 Minutes With Guard](../../first-10-minutes.md)
- [Guard Editions And Command Map](../../EDITIONS.md)
