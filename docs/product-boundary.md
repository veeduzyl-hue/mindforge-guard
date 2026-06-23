# Guard Product Boundary

## Purpose

This document establishes the Guard-first architecture baseline for Outcome Foundation work.

It defines what MindForge Guard is, what major modules exist around it, and where governance conclusions are allowed to be computed.
It does not change the current `v7.0.1` commercial boundary, pricing, release notes, or public commercial materials.

## Product Positioning

MindForge Guard is an independent runtime governance and evidence layer for high-risk AI agent actions.

Near-term positioning:

MindForge Guard is a deterministic governance review and evidence layer for AI-generated software changes and high-risk agent workflows.

The first commercial wedge is AI-generated software change governance.
Cyber remediation governance is a high-risk sample scenario, not the primary commercial positioning for this phase.

## Boundary Principles

Guard remains:

- non-executing
- local-first
- evidence-first
- cross-runtime
- independent
- recommendation-only
- additive-only
- default-off where applicable

Guard must not:

- become a full SaaS
- become a multi-agent platform
- become a vulnerability scanner
- become a Codex replacement
- become a Daybreak replacement
- become a general agent framework
- become a deployment or rollback authority

## Governance Source Of Truth

The architecture has two fixed rules:

- Guard Core is the only governance source of truth.
- Evidence Pack is the only factual input.

All governance conclusions must be derived from Evidence Pack inputs.
No surrounding module may independently compute or override governance verdicts.

## Near-Term Roadmap Sequence

The near-term roadmap is:

`Evidence Contract -> Outcome Foundation -> Studio Prototype -> Harness Alignment -> SDK Alpha`

This sequence is an engineering and productization track.
It is not a replacement for the current `v7.0.1` commercial packaging.

## Module Boundaries

### 1. Guard Core

Guard Core:

- owns Evidence Contract
- parses and validates Evidence Packs
- computes evidence coverage
- computes risk signals
- computes governance verdicts
- generates Governance Receipt and Unified Report Model
- is the only governance source of truth

### 2. Renderer

Renderer:

- consumes Guard Core report model
- produces Markdown, HTML, JSON, and Evidence Index outputs
- must not compute governance verdicts

### 3. Studio

Studio:

- is a local-first review workspace
- supports sample run, import, validate, generate report, and export
- must not compute governance verdicts
- must not become a full SaaS in this phase

### 4. SDK

SDK:

- exposes Guard Core capabilities to external systems
- may later expose `validateEvidencePack`, `generateGovernanceReport`, and `inspectEvidenceCoverage`
- must not become a hosted API in this phase
- must not compute governance verdicts

### 5. CLI

CLI:

- invokes Guard Core capabilities and displays Guard Core output
- may validate, report, and export through Guard Core-owned logic
- must not independently compute governance verdicts outside Guard Core

### 6. Guard Evidence Harness

Guard Evidence Harness:

- lives as an external or sibling repo
- only produces bounded execution facts and Guard-compatible Evidence Packs
- must not output governance verdicts
- must not become an Agent framework

### 7. Decision Assistant

Decision Assistant:

- is frozen for now
- may later serve as IDE preflight or Guard trigger
- is not part of the current execution scope

## Architecture Constraints

The following constraints apply across all modules:

- Harness, Renderer, Studio, SDK, and CLI do not independently compute governance verdicts.
- Renderer only renders Guard Core output.
- Studio only consumes Guard Core output.
- SDK only exposes Guard Core capabilities.
- Harness only produces bounded execution facts and Guard-compatible Evidence Packs.
- Guard does not execute commands, call tools, run agents, generate code changes, deploy, rollback, scan for vulnerabilities, or approve actions.

## Compatibility Statement

This product boundary preserves:

- `audit` output / verdict / exit unchanged
- `permit` behavior unchanged unless explicitly scoped elsewhere
- `classify` behavior unchanged unless explicitly scoped elsewhere
- recommendation-only
- additive-only
- non-executing
- default-off where applicable
- no authority scope expansion

## Related References

- [Non-Goals](./non-goals.md)
- [Trust Model](./trust-model.md)
- [Evidence Flow](./evidence-flow.md)
- [ADR 0001: Guard First](./adr/0001-guard-first.md)
- [ADR 0002: Harness as Producer](./adr/0002-harness-as-producer.md)
- [ADR 0003: Non-Executing, Local-First](./adr/0003-non-executing-local-first.md)
