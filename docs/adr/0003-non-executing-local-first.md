# ADR 0003: Non-Executing, Local-First

- Status: Accepted

## Context

Guard must preserve its bounded governance posture while Outcome Foundation expands evidence and reporting surfaces.
Without a clear architectural decision, new modules could drift toward execution, hosted authority, or runtime takeover behavior.

The product also needs to remain usable across different runtimes and workflow environments without becoming dependent on one assistant, one platform, or one hosted control layer.

## Decision

Guard remains non-executing, local-first, evidence-first, cross-runtime, and independent.
It does not run agents, execute commands, call tools, patch code, deploy, rollback, or scan vulnerabilities.

Guard Core computes governance conclusions from Evidence Pack inputs.
Supporting modules may produce, transport, render, or expose Guard output, but they do not gain execution authority or independent verdict authority.

## Consequences

- governance remains inspectable and deterministic
- local workflows remain first-class
- cross-runtime integration stays possible through Evidence Packs and Guard Core APIs
- surrounding tools remain bounded producers or consumers
- the architecture avoids control-plane, execution-engine, and assistant-replacement drift
