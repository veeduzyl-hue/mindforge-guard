# Guard Trust Model

## Purpose

This document defines what MindForge Guard trusts, what it does not trust, and what it only reports as declared.

The scope of this document is the Evidence Pack to governance report path.
It does not change `audit`, `permit`, or `classify` behavior.
It does not grant execution authority.

## Canonical Trust Path

The bounded trust path is:

`Evidence Producer -> Evidence Pack -> Guard Core -> Unified Report Model -> Renderer / Studio / SDK`

This path has one governing rule:

- the Evidence Pack is the only factual input to Guard Core

Guard Core reads the pack, validates the pack, and computes governance conclusions from the pack.
Renderer, Studio, SDK, CLI, and Guard Evidence Harness may package, display, transport, invoke, or export results, but they do not compute governance verdicts.

## Trust Boundary Summary

### What Guard Trusts

Guard trusts only:

- the bytes and structure of the provided Evidence Pack
- evidence references that are present inside the pack
- declared metadata included in the pack
- validation outcomes Guard Core can derive from the pack itself

Guard Core does not trust implied facts that are not represented in the Evidence Pack.

### What Guard Does Not Trust

Guard does not inherently trust:

- unverifiable claims outside the Evidence Pack
- runtime narratives provided only in chat, UI text, or comments
- renderer output as a source of governance truth
- Studio state as a source of governance truth
- SDK wrappers as a source of governance truth
- CLI presentation state as a source of governance truth
- Guard Evidence Harness-produced summaries as a source of governance truth unless those facts are included in the Evidence Pack

### What Guard Only Reports As Declared

Some fields may be reported as declared rather than proven.
Examples include:

- intended authority scope
- workflow intent
- human review declarations
- producer identity
- environment labels

Guard can preserve and surface those declarations, but a declaration is not the same as verified evidence.

## Evidence Categories

Guard distinguishes four different evidence states:

| Category | Meaning | Typical source | Trust posture |
| --- | --- | --- | --- |
| Execution facts | What actually happened in the described workflow | logs, artifacts, manifests, tool call records inside the pack | trusted only when present in the pack |
| Declared authority | What the producer says it was allowed or intended to do | authority or intent fields inside the pack | reported as declared unless separately evidenced |
| Verified evidence | Facts Guard Core can validate from pack structure, presence, and consistency | schema-valid fields, manifests, evidence refs, deterministic checks | trusted within the pack boundary |
| Missing evidence | Facts that would be needed for stronger confidence but are absent or incomplete | omitted or incomplete pack fields and artifacts | surfaced as missing, never inferred as present |

Guard must not collapse these categories into one another.

## Local-First Assumption

Guard is local-first within this flow.

That means:

- the Evidence Pack is expected to be available locally
- Guard Core evaluates the pack locally
- governance conclusions are computed locally from the supplied pack
- no hosted service is required to determine the verdict inside this flow

Local-first does not mean every declared fact is automatically true.
It means the trust decision is made from the local pack boundary rather than from an external control plane.

## Redaction Boundary

Redaction must happen before evidence becomes authoritative input.

The boundary is:

- the producer decides what to include or redact before finalizing the Evidence Pack
- Guard Core evaluates the pack it receives
- Guard Core does not recover redacted facts that are no longer present
- renderers and consumer surfaces may hide or summarize fields, but they do not restore missing evidence

If redaction removes information needed for governance interpretation, the result should be reduced confidence, missing evidence, or a review requirement rather than silent assumption.

## Evidence Integrity Assumptions

Guard Core assumes:

- the supplied pack is the intended evaluation unit
- files and fields inside the pack were not corrupted between production and evaluation
- artifact references point to the evidence the producer intended to submit
- timestamps, identities, and workflow labels are only as trustworthy as the submitted evidence supporting them

Guard Core validates structure and consistency where possible.
Guard Core does not prove real-world truth beyond the submitted evidence boundary.

## Known Trust Limitations

The current trust model has explicit limits:

- Guard cannot prove facts that were never captured in the Evidence Pack.
- Guard cannot prove authority merely because authority was declared.
- Guard cannot prove execution completeness when logs or artifacts are partial.
- Guard cannot prove that omitted evidence does not exist elsewhere.
- Guard cannot use Renderer, Studio, SDK, CLI, or Guard Evidence Harness as alternate verdict engines.
- Guard cannot convert supporting evidence into execution authority.
- Guard cannot approve actions, execute tools, deploy, roll back, scan vulnerabilities, or replace Codex or Daybreak.

These limitations are intentional.
They preserve recommendation-only, additive-only, non-executing governance behavior.

## Responsibility Split

### Evidence Producer

The producer is responsible for:

- collecting workflow evidence
- declaring intent, scope, and authority context
- applying redaction before packaging
- preserving enough evidence for review

### Evidence Pack

The pack is responsible for:

- being the single factual handoff to Guard Core
- carrying declared and observed evidence in inspectable form
- making missing evidence visible through omission rather than hidden narrative

### Guard Core

Guard Core is responsible for:

- validating the pack
- distinguishing declared facts from verified facts
- computing governance conclusions from the pack
- surfacing missing or incomplete evidence

### Renderer / Studio / SDK / CLI / Guard Evidence Harness

These consumers are responsible for:

- presenting pack validation or report output
- helping users inspect conclusions
- invoking Guard Core-owned flows through bounded interfaces
- exporting or integrating Guard output

They are not responsible for:

- computing governance verdicts
- redefining trust semantics
- overriding Guard Core conclusions

## Compatibility Statement

This trust model is compatible with the current Guard posture:

- `audit` output / verdict / exit unchanged
- `permit` behavior unchanged unless explicitly scoped elsewhere
- `classify` behavior unchanged unless explicitly scoped elsewhere
- recommendation-only preserved
- additive-only preserved
- non-executing preserved
- default-off where applicable preserved
- no authority scope expansion
