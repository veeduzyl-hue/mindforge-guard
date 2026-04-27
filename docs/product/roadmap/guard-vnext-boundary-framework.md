# Guard `vNext` Boundary Framework

## Purpose

This document defines the additive-only roadmap boundary for `v6.14+` work without changing the current stable `v6.13` commercial baseline.

## Roadmap baseline

- `v6.13` remains the current stable commercial user-facing baseline.
- `v6.14+` is an additive evolution track.
- This document is a boundary framework, not a launch claim.

## Preserved surfaces

Until separately scoped and released, `v6.14+` work must preserve:

- existing CLI outputs
- existing JSON contracts
- existing exit semantics
- existing license gating behavior
- existing offline license authority
- existing install instructions
- existing demo paths
- existing commercial edition positioning and buyer-facing claims

This boundary includes preserving the stable behavior of `audit`, the current edition-gated analytics contract, and the present commercial support role of License Hub.

## Future/additive capability areas

The following areas are roadmap candidates only. They are future/additive capabilities unless separately implemented and released.

### Authority / Intent Boundary

Potential future surface for making recommendation boundaries and intent interpretation more explicit without granting execution authority.

### Admissibility

Potential future surface for bounded, inspectable decision-adjacent eligibility or evidence intake rules without hidden policy takeover.

### Commit Gate Dry-run

Potential future preview-first, non-executing gate simulation surface. Any execution-adjacent behavior must remain preview-first and default-off until explicitly released.

### Multi-Agent Handoff

Potential future evidence or handoff description surface. It must not drift Guard into an orchestrator, autonomous agent manager, or multi-agent control framework.

### Graph-aware Governance

Potential future governance-analysis surface for richer relation or topology awareness, provided it remains additive, inspectable, and compatible with existing contracts.

### Enterprise Runtime Governance

Potential future enterprise-facing governance packaging surface. It must not become an IAM replacement, control plane, or authority-expanding runtime takeover.

## Boundary rules for `v6.14+`

Any future implementation should preserve all of the following unless explicitly scoped otherwise:

- recommendation-only
- additive-only
- non-executing by default
- preview-first for execution-adjacent features
- default-off for consumption or gate behavior where applicable
- no hidden enforcement takeover
- no orchestrator drift
- no control-plane drift
- no agent-builder drift
- no IAM-replacement drift
- no silent CLI contract breakage

## Release discipline

A `v6.14+` capability area should not be presented as available until it has:

- separately scoped implementation
- explicit compatibility statement
- verification coverage
- documentation aligned to the released surface
- release-level acceptance or tag line that makes the new availability clear

## What this framework is for

Use this framework to:

- keep roadmap wording additive and compatibility-preserving
- prevent future docs from overstating availability
- separate roadmap intent from released product claims
- preserve the current `v6.13` commercial baseline while future work is phased in

## Related references

- [Commercial Baseline `v6.13`](../current/commercial-baseline-v6.13.md)
- [Current Product Baseline](../current-product-baseline.md)
- [Release Baseline After `v6.13.0`](../release-baseline-post-v6.13.md)
