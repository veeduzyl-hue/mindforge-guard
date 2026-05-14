# Trust FAQ

## What is this FAQ for?

This FAQ answers common trust and positioning questions for the current v7.0.1 commercial baseline.

- v7.0.1 is the current public commercial baseline
- paid licensing remains signed local license JSON
- License Hub supports purchase, account, and license delivery
- Guard remains non-executing, recommendation-only, non-control-plane, and local-first where applicable
- Enterprise does not add extra runtime authority

## Does Guard take over execution?

No. Guard is non-executing by default and recommendation-oriented.

It can inspect, classify, validate, summarize, and expose edition-gated analytics, but it does not become a hidden execution authority over the user's repo workflow. See [Safety Boundary](../../trust/safety-boundary.md).

## Is Guard a control plane or dashboard product?

No. The current baseline is a deterministic governance evidence layer for single-agent AI workflows, with a local-first CLI plus bounded commercial support surfaces around licensing and account visibility.

Guard is not positioned as a control plane, orchestrator, or dashboard-first runtime.

## Does paid licensing move authority to a hosted service?

No. In the current release, paid access is enabled by a signed local license JSON.

The current activation path is still local:

- `guard license verify --file <file>`
- `guard license install --file <file>`
- `guard license status`

That makes the commercial boundary visible without changing the runtime trust model.

License Hub supports purchase, account access, and signed license delivery, but it does not move execution authority into a hosted runtime.

## What can Community users do today?

Community users can use the base governance CLI, including:

- `guard status`
- `guard init`
- `guard validate-policy`
- `guard audit . --staged`
- `guard snapshot .`
- `guard action classify --text "<text>"`
- `guard drift status`

Community is the real baseline surface, not a placeholder tier.

## What is gated behind Pro?

Current Pro unlocks:

- `guard drift timeline`

This is for teams that need time-based drift visibility, not just current-state inspection.

## What is gated behind Pro+?

Current Pro+ unlocks:

- `guard drift compare`
- `guard assoc correlate`

This is the current top analytics tier for deeper comparison and correlation work.

## What does Enterprise add today?

Enterprise is the formal commercial packaging and procurement tier in the current release.

In the current release, Enterprise keeps the same current CLI entitlement as Pro+ and does not add extra runtime authority.

## What happens if a paid command is unavailable?

The current gate contract is explicit.

- missing or otherwise non-usable paid license states return `license_required`
- valid but insufficient editions return `edition_mismatch`

That boundary is designed to be inspectable and predictable. For the authoritative command boundary, see [Editions And Command Map](../../EDITIONS.md).

## Does Guard require online activation?

No. Online or account-connected surfaces are additive support surfaces.

The current authoritative runtime path remains local install plus local license verification and installation when paid analytics are needed.

## Are roadmap notes the same as current availability?

No. Roadmap notes, planning references, and internal acceptance records are not current availability claims by themselves.

The current buyer-facing baseline is the released `v7.0.1` package plus the current docs, editions, License Hub, and first governance report path documented from this FAQ.

## How should a buyer verify the product safely?

Use the current local-first path:

1. install Guard locally
2. run `guard --version`, `guard --help`, and `guard status`
3. run `guard init` and `guard validate-policy` inside a repo if you want the policy path
4. run Community-safe commands first
5. install a signed local license only if you need paid analytics

## Related References

- [v7.0.1 Commercial Baseline](./v7_0_1_commercial_baseline.md)
- [Safety Boundary](../../trust/safety-boundary.md)
- [First 10 Minutes With Guard](../../first-10-minutes.md)
- [Edition Value Map](./edition-value-map.md)
- [First Governance Report](./first-governance-report.md)
- [Editions And Command Map](../../EDITIONS.md)
