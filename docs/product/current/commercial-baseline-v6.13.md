# Commercial Baseline `v6.13`

## Purpose

This document freezes the current stable commercial user-facing baseline before any `v6.14+` implementation work.

## Baseline statement

- `v6.13` is the current stable commercial baseline.
- `v6.14+` is an additive evolution track.
- Future `v6.14+` roadmap items must not be described as currently available unless they are separately implemented and released.

## Current stable commercial surface

The `v6.13` commercial baseline is the currently shipped user-facing combination of:

- Guard CLI as the local deterministic governance runtime
- License Hub as the bounded commercial delivery and account support surface
- Community / Pro / Pro+ / Enterprise edition framing already documented in current repository and License Hub materials

## Preserved user-facing contracts

The following surfaces must be preserved through `v6.14+` planning and phased implementation unless a later change is explicitly scoped and released:

- current CLI outputs
- current JSON contracts
- current exit semantics
- current license gating behavior
- current offline license authority and local install model
- current install instructions
- current demo paths
- current commercial edition positioning and entitlement boundary

This includes preserving the established contract lines around `audit`, edition-gated analytics behavior, license install and verify guidance, and the current demo entry points already referenced in repository docs and License Hub materials.

## Current posture that remains true

Guard remains:

- recommendation-only
- additive-only
- non-executing by default
- preview-first for execution-adjacent features
- default-off for consumption or gate behavior where applicable
- a deterministic governance layer, not an execution authority

Guard is not:

- an orchestrator
- a control plane
- an agent builder
- an IAM replacement

## Future/additive capability boundary

The following capability areas are future/additive only unless separately implemented and released:

- Authority / Intent Boundary
- Admissibility
- Commit Gate Dry-run
- Multi-Agent Handoff
- Graph-aware Governance
- Enterprise Runtime Governance

These names may be used for roadmap framing, boundary setting, or scoped design discussion, but they must not be represented as currently shipping `v6.13` capabilities.

## Commercial boundary interpretation

When updating docs, demos, roadmap notes, packaging, or License Hub positioning:

- do not change current install instructions as part of roadmap framing alone
- do not change pricing or edition copy as part of roadmap framing alone
- do not change current license setup guidance as part of roadmap framing alone
- do not change current demo paths as part of roadmap framing alone
- do not imply runtime authority expansion or hosted-path dependence

## Related references

- [README](../../../README.md)
- [Current Product Baseline](../current-product-baseline.md)
- [Capability Baseline](../capability-baseline.md)
- [Guard Editions And Command Map](../../EDITIONS.md)
- [License Activation](../../license-activation.md)
- [Buyer Demo Series](../../demos/README.md)
