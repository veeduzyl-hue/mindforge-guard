# ADR 0004: Evidence Semantic Control Point

- Status: Accepted for V8.0 Phase 1 architecture

## Context

Guard already has a canonical Evidence Pack, deterministic validation and reason codes, a bounded EAK PoC, external evidence normalization, and a Governance Report. The next architecture question is how heterogeneous evidence can retain stable meaning without turning Guard into a complete AI Governance Platform.

The strategic direction is for MindForge Guard to evolve as independent Evidence Assurance Infrastructure for consequential AI actions and transitions. The longer-term term **Evidence Semantic Control Point** remains a hypothesis and architecture direction. It is not a claim of market validation, category leadership, universal authority, certification authority, or current shipped capability.

External source says X does not imply Guard should build X. External runtimes, IAM systems, security products, GRC systems, and standards may supply evidence or vocabulary without transferring their product responsibilities or authority to Guard.

## Decision

Guard will stabilize evidence meaning and claim boundaries between the Evidence Contract and downstream governance communication:

```text
Evidence Pack
-> Evidence Contract
-> MESR semantic binding
-> EAK claim support evaluation
-> governance / institutional disposition
-> institutional artifact
```

The layer responsibilities are:

- Evidence Contract transports facts through the existing canonical input boundary.
- MESR assigns stable, versioned meaning to bounded evidence concepts.
- EAK evaluates what claims the bound evidence supports or does not support.
- Governance Report retains the existing downstream disposition vocabulary.
- Institutional artifacts communicate results without acquiring independent semantic or execution authority.

## Adjacent Systems

Execution runtimes own execution. IAM systems own permissions and identity policy. Security tools own their bounded detection or control functions. GRC systems own their institutional workflows. Guard may consume artifacts from or export artifacts to those systems, but it does not replace them.

## Consequences

- Guard does not become a dashboard-first platform, control plane, runtime controller, IAM replacement, generic GRC suite, or agent orchestrator.
- The Evidence Semantic Control Point hypothesis must be tested by semantic portability, claim stability, composition stability, and institutional validation.
- Failure of the relevant Experiment 3 or design-partner criteria weakens or kills the hypothesis; it is not protected as doctrine.
- Existing commercial and runtime surfaces remain unchanged.

## Acceptance Conditions

This ADR is satisfied only when the Evidence Contract/MESR/EAK/Report boundaries are explicit, modules cannot redefine Core meaning, and no assurance output creates execution authority.
