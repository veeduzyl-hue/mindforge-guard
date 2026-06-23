# ADR 0001: Guard First

- Status: Accepted

## Context

Outcome Foundation work needs a stable architecture baseline.
The repository already contains Guard lineage, released commercial boundary materials, and a deterministic governance posture that must not drift into a broader platform or agent-runtime framing.

There is also a related harness concept that can produce workflow evidence.
Without an explicit decision, the product boundary could drift toward making the harness appear to be the main product.

## Decision

MindForge Guard is restored as the primary product.
Harness becomes an evidence producer, not the main product.

Guard remains the independent governance and evidence layer.
Guard Core remains the only governance source of truth.
Evidence Pack remains the only factual input for governance conclusions.

## Consequences

- architecture and documentation center on Guard first
- surrounding modules are described as producers or consumers around Guard Core
- future Outcome Foundation work stays focused on evidence contract, report foundation, and bounded consumer surfaces
- current `v7.1` commercial boundary remains intact
- the repository avoids drift into a general agent platform posture

## Alternatives Considered

### Harness-first product framing

Rejected because it would blur the architecture boundary and make the evidence producer appear to own governance logic.

### Parallel co-primary products

Rejected because it would increase ambiguity around the source of truth and make the near-term roadmap harder to communicate and verify.

### Studio-first or SaaS-first framing

Rejected because it would introduce control-plane drift before Guard Core, evidence contract, and bounded consumer semantics are stabilized.
