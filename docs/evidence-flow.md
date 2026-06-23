# Guard Evidence Flow

## Purpose

This document explains how evidence moves through MindForge Guard and where governance conclusions are allowed to be computed.

The flow is bounded, local-first, and renderer-independent.
It does not authorize execution, enforcement, or hosted control-plane behavior.

## Canonical Flow

The canonical evidence flow is:

`Evidence Producer -> Evidence Pack -> Guard Core -> Unified Report Model -> Renderer / Studio / SDK`

## Stage Responsibilities

### 1. Evidence Producer

The Evidence Producer creates the input set for review.
Examples may include a harness, CI job, IDE workflow, agent runtime, or manual import path.

The producer may:

- collect logs, manifests, tool-call records, and artifacts
- declare workflow intent and authority context
- redact sensitive data before packaging
- mark known gaps or blocked actions

The producer does not create the final governance verdict.

### 2. Evidence Pack

The Evidence Pack is the only factual input Guard Core receives.

The pack should contain:

- execution facts that were actually captured
- declared authority and workflow context
- references to artifacts and verification material
- explicit omissions where evidence is missing

If a fact is not inside the pack, Guard Core must treat it as unavailable.

### 3. Guard Core

Guard Core validates the Evidence Pack and computes governance conclusions.

Guard Core may:

- validate the submitted structure
- inspect consistency and completeness
- detect missing evidence
- compute deterministic report fields and verdicts

Guard Core does not:

- execute workflow actions
- fetch hidden evidence from outside the pack
- delegate verdict logic to a renderer, Studio surface, SDK wrapper, CLI surface, or Guard Evidence Harness

### 4. Unified Report Model

The Unified Report Model is the normalized output of Guard Core.

It exists to:

- preserve deterministic conclusions
- separate governance computation from presentation
- support multiple consumers without duplicating verdict logic

The report model is a consumer contract, not a second governance engine.

### 5. Renderer / Studio / SDK / CLI

Renderer, Studio, SDK, and CLI consume the Unified Report Model.

They may:

- render Markdown, HTML, or structured JSON
- support local inspection workflows
- export results to downstream review surfaces

They do not:

- compute or alter governance verdicts
- upgrade declared facts into verified facts
- replace missing evidence with inferred evidence

## Evidence Interpretation Rules

Guard uses the following interpretation boundary:

| Evidence state | Meaning in flow | Guard behavior |
| --- | --- | --- |
| Execution facts | Observed workflow activity captured in the pack | use as evidence only to the extent captured |
| Declared authority | Claimed permission, intent, or boundary | report as declared unless corroborated |
| Verified evidence | Evidence Guard Core can validate from the pack | use in deterministic conclusions |
| Missing evidence | Expected evidence absent, incomplete, or redacted away | surface as missing or incomplete |

This separation prevents narrative drift.
A declaration is not automatically execution evidence.
Missing evidence is not treated as negative proof or positive proof.

## Redaction Boundary

Redaction occurs before Guard Core evaluation.

The flow expectation is:

1. the producer collects candidate evidence
2. the producer removes or masks sensitive material as needed
3. the producer finalizes the Evidence Pack
4. Guard Core evaluates the final packaged evidence

Once evidence is redacted out of the pack:

- Guard Core cannot rely on it
- renderers cannot restore it
- SDK consumers cannot treat it as implicitly present

If redaction weakens reviewability, Guard should surface missing evidence rather than silently compensate.

## Evidence Integrity Assumptions

The evidence flow assumes:

- the submitted pack is the intended review artifact
- the pack was not unintentionally altered after production
- artifact references point to the evidence set intended for review
- declared metadata may still require corroborating evidence

Guard Core validates pack structure and consistency, but it does not prove external truth beyond the submitted pack boundary.

## Known Trust Limitations In The Flow

This flow has explicit limits:

- It cannot prove unstated or uncaptured activity.
- It cannot prove authority from declaration alone.
- It cannot prove absence of risk when evidence is incomplete.
- It cannot recover evidence that the producer omitted or redacted.
- It cannot move verdict computation into the presentation layer.

These limits are intentional because Guard Core remains the only governance source of truth.
They also preserve Guard's non-executing, cross-runtime, and independent posture.

## Consumer Boundary

The consumer boundary is strict:

- Harness may help produce an Evidence Pack.
- Guard Core validates and computes governance conclusions.
- Unified Report Model carries those conclusions forward.
- Renderer, Studio, SDK, and CLI consume the model without recomputing verdicts.

This keeps governance logic centralized and inspectable.

## Failure And Missing Evidence Cases

When evidence is weak or absent, the expected behavior is:

- execution facts missing -> report the missing evidence
- authority declared but not evidenced -> report as declared and potentially incomplete
- verification artifacts missing -> reduce confidence and surface review need
- redacted evidence removes key context -> preserve the redaction boundary and report the gap

Guard should never fill these gaps with hidden inference from consumer surfaces.
Guard should not approve actions, execute tools, deploy, roll back, scan vulnerabilities, or replace Codex or Daybreak through this flow.

## Compatibility Statement

This evidence flow preserves current Guard invariants:

- `audit` output / verdict / exit unchanged
- `permit` behavior unchanged unless explicitly scoped elsewhere
- `classify` behavior unchanged unless explicitly scoped elsewhere
- recommendation-only preserved
- additive-only preserved
- non-executing preserved
- default-off where applicable preserved
- no authority scope expansion
