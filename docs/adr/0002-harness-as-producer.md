# ADR 0002: Harness As Producer

- Status: Accepted

## Context

The architecture needs a clear boundary between evidence production and governance computation.
`guard-native-agent-harness` may capture bounded execution facts from external workflows, but Outcome Foundation requires Guard Core to remain the single governance authority.

Without a clear ADR, a harness could drift into verdict generation, approval semantics, or control-plane behavior.

## Decision

`guard-native-agent-harness` should only produce bounded execution facts and Guard-compatible Evidence Packs.
It must not produce final governance verdicts, approvals, or runtime control-plane decisions.

Guard Core remains the only governance source of truth.
Evidence Pack remains the only factual input.

## Consequences

- harness output is limited to evidence production and packaging
- verdict logic stays centralized in Guard Core
- renderer, Studio, SDK, and CLI consume Guard Core output rather than harness-owned conclusions
- cross-runtime evidence collection remains possible without turning the harness into the product center

## Anti-Goals

The harness must not become:

- a final verdict engine
- an approval authority
- a deployment or rollback controller
- a multi-agent orchestrator
- a general Agent framework
- a hosted control plane
