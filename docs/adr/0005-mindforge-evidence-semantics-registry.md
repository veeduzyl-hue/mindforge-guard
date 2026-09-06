# ADR 0005: MindForge Evidence Semantics Registry

- Status: Accepted for V8.0 Phase 1 architecture

## Context

The Evidence Contract defines the canonical structure Guard can inspect. The EAK PoC already evaluates bounded supportability, missing evidence, contradictions, and residual uncertainty. Without a stable semantic layer, producer-specific terms and future modules could silently change what evidence means or what claims it supports.

## Decision

Adopt the MindForge Evidence Semantics Registry (MESR) with this strict separation:

```text
Evidence Contract = syntax
MESR = semantics
EAK = claim support evaluation
Governance Report = institutional communication and downstream disposition
```

MESR Core is a small, versioned registry of semantic entries, bindings, relations, explicit non-claims, provenance, and supersession rules. It does not ingest evidence by itself and does not compute a governance disposition.

## MESR Boundary

MESR is not:

- a universal ontology;
- a knowledge graph or truth engine;
- a policy or compliance engine;
- an authority issuer;
- a certification registry;
- an execution-permission source;
- a replacement for the Evidence Contract or Governance Report.

MESR meaning is deterministic and machine-readable. A semantic ID is stable across compatible versions; incompatible meaning requires a new ID or explicit supersession. `does_not_support` is mandatory so that `logged -> evidenced -> verified -> assured -> approved -> compliant -> safe` cannot occur by silent inflation.

## Relationship To Existing EAK PoC

The PoC remains evidence that a bounded deterministic assurance layer is feasible. Its existing status vocabulary is not silently redefined. Phase 2 must add an explicit binding between PoC statuses and MESR support relations, with ambiguity resolving to `indeterminate`, never to a stronger claim.

## Consequences

- Evidence Pack remains the factual input boundary.
- MESR Core meaning is Guard-owned and thin.
- EAK remains deterministic claim-support evaluation, not a Policy Decision Point.
- Governance Report verdicts remain backward-compatible and downstream.
