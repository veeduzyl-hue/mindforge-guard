# External Evidence Adapter Interface v0.1

## Core Positioning

The External Evidence Adapter Interface defines a minimal design boundary for parsing, validating, verifying, normalizing, and emitting findings for external runtime evidence. It is not a runtime execution interface, approval API, blocking API, certification API, or deployment control API.

An adapter maps and verifies evidence. It does not decide whether the underlying action may proceed.

This document is Phase 2 minimal adapter interface design only.
It does not implement runtime code, adapter code, verifier code, fixtures, or package changes.

## 1. Purpose

This interface design exists to:

- translate Phase 1 docs into minimal implementation design
- define method boundaries before code
- keep adapter behavior verification-only
- keep external evidence source specifics outside Guard Core semantics
- prepare for future reference adapter implementation without privileging ramen

The purpose of this design is to freeze a narrow adapter boundary before any type-only or runtime-facing follow-up work exists.
The document converts the Phase 1 framework, contract, normalized record, findings, and reference-adapter posture into a minimal interface sketch that preserves Guard's existing product posture.

## 2. Interface Boundary

This interface is not:

- an approval API
- a blocking API
- an execution API
- a deployment gate
- a certification API
- a policy authority API
- a replacement for human review

This interface must remain subordinate to Guard's existing verification posture.
It may describe how evidence is interpreted, but it must not authorize action, mutate upstream runtime state, or redefine Guard as a control surface.

## 3. Adapter Role

An Evidence Source Adapter is a bounded review-stage translation and verification layer.
Its role is to:

- parse external evidence
- validate minimum receipt contract
- verify integrity, signature, and timestamp where possible
- normalize into Guard's Normalized Evidence Record
- emit Verification Findings
- preserve raw evidence references
- report limitations

Adapter outputs are review artifacts, not runtime authority objects.

An adapter may explain what was verified, what could not be verified, and what remains incomplete.
It may not convert that explanation into approval, blocking, certification, authorization, or deployment control semantics.

## 4. Minimal Interface Shape

The following is a TypeScript-like design sketch.
It is not an implementation contract yet.

```ts
interface EvidenceSourceAdapter {
  identity: AdapterIdentity;

  parse(input: unknown, context?: AdapterContext): ParseResult;
  validate(
    parsed: ParsedExternalEvidence,
    context?: AdapterContext
  ): ContractValidationResult;
  verify(
    parsed: ParsedExternalEvidence,
    validation: ContractValidationResult,
    context?: AdapterContext
  ): VerificationResult;
  normalize(
    parsed: ParsedExternalEvidence,
    validation: ContractValidationResult,
    verification: VerificationResult,
    context?: AdapterContext
  ): NormalizedEvidenceRecord;
  emitFindings(
    record: NormalizedEvidenceRecord,
    diagnostics?: AdapterDiagnostic[],
    context?: AdapterContext
  ): VerificationFinding[];
}
```

Design interpretation:

- `identity` carries adapter name, adapter version, and external evidence source type
- method ordering expresses review flow, not runtime orchestration authority

This sketch defines the minimum logical surface needed to move from external evidence into Guard-owned review artifacts without exposing execution authority.

### Type-only contract notes

For the Phase 2 type-only contract pass:

- `ContractValidationResult` should be carried into both `verify` and `normalize`
- `AdapterLimitations` should have a stable final location on normalized record adapter metadata
- diagnostics may feed findings, but diagnostics and findings remain review artifacts rather than approval or blocking decisions

## 5. Method Responsibilities

### `parse`

- input: raw external evidence, raw receipt object, serialized payload, or adapter-supplied wrapper input
- output: `ParseResult`
- must do: interpret source-specific structure into a bounded parsed representation and preserve parse diagnostics
- must not do: approve action, hide malformed evidence, mutate upstream evidence, or silently fetch missing authority from uncontrolled sources
- failure behavior: return explicit parse errors and limitations that can later become findings or reviewer-visible limitations

### `validate`

- input: `ParsedExternalEvidence`
- output: `ContractValidationResult`
- must do: evaluate whether the minimum external receipt contract is present enough for bounded verification semantics
- must not do: treat contract validity as business approval, silently rewrite required fields, or infer missing fields as though they were present
- failure behavior: report missing fields, unsupported versions, malformed shapes, and contract gaps as explicit validation outcomes

### `verify`

- input: `ParsedExternalEvidence`
- output: `VerificationResult`
- must do: verify signature, payload hash, issuer identity references, timestamp semantics, and other bounded integrity checks when possible
- must not do: execute policy, approve runtime actions, suppress failed checks, or reinterpret verification failure as a deployment decision
- failure behavior: surface unavailable keys, unsupported algorithms, missing raw payloads, stale timestamps, redaction limits, and integrity mismatches as explicit verification states

### `normalize`

- input: `ParsedExternalEvidence`, `VerificationResult`
- output: `NormalizedEvidenceRecord`
- must do: convert source-specific evidence into Guard's review-oriented normalized representation while preserving traceability and verification outcomes
- must not do: collapse failures into success, discard limitations, or replace Guard-owned semantics with source-specific authority language
- failure behavior: if normalization cannot fully complete, preserve partial visibility, incomplete-state markers, and reviewer-visible limitations instead of inventing complete evidence

### `emitFindings`

- input: `NormalizedEvidenceRecord`
- output: `VerificationFinding[]`
- must do: emit review-oriented findings derived from normalized evidence and visible verification state
- must not do: emit approval outcomes, blocking outcomes, certification claims, or runtime execution directives
- failure behavior: emit bounded findings such as verification not performed, evidence incomplete, or adapter parse error rather than hiding unresolved states

## 6. AdapterContext

`AdapterContext` is a bounded design-time helper object that supplies explicit external dependencies needed for deterministic review work.
It may include:

- `adapter_run_id`
- `observed_at`
- `raw_payload_lookup`
- `issuer_key_lookup`
- `freshness_window`
- `policy_reference_resolver`
- `redaction_mode`
- `review_mode`

Suggested semantics:

- `adapter_run_id`: explicit run identifier for traceability
- `observed_at`: explicit timestamp used for freshness evaluation
- `raw_payload_lookup`: explicit mechanism for retrieving referenced raw payloads when available
- `issuer_key_lookup`: explicit mechanism for resolving issuer verification keys
- `freshness_window`: explicit reviewer-configured threshold for timestamp freshness interpretation
- `policy_reference_resolver`: optional helper for displaying policy references without mutating policy authority
- `redaction_mode`: bounded hint describing known redaction expectations
- `review_mode`: bounded hint for human-review output shape or strictness

`AdapterContext` does not provide:

- runtime execution authority
- approval authority
- deployment control
- policy mutation authority

The context object should expose only explicit, review-oriented dependencies.
Hidden authority channels and implicit runtime privileges are out of scope.

## 7. Result Types

These result types are design objects only.
They describe field intent and semantic boundaries without creating a code contract in this phase.

### `ParseResult`

Expected field concepts:

- parse status
- parsed evidence object
- source format version if visible
- parse diagnostics
- raw reference visibility

Boundary:

- parse result states whether interpretation succeeded, partially succeeded, or failed
- parse result does not authorize action

### `ContractValidationResult`

Expected field concepts:

- contract validity status
- required fields present
- missing required fields
- recommended fields present
- unsupported receipt version
- validation limitations

Boundary:

- validation result expresses contract completeness for verification purposes
- validation result is not an allow or deny decision

### `VerificationResult`

Expected field concepts:

- signature verification status
- payload hash verification status
- issuer identity or key resolution status
- timestamp status
- verification evidence references
- verification limitations

Boundary:

- verification result records what was checked and what remains unresolved
- verification result must preserve failed verification as visible state

### `NormalizedEvidenceRecord`

Expected field concepts:

- source identity
- adapter identity
- receipt identity
- issuer visibility
- subject visibility
- receipt version
- integrity status
- signature status
- timestamp status
- policy reference visibility
- completeness status
- raw evidence references
- limitations summary

Boundary:

- normalized record is a Guard-owned review artifact
- normalized record is not a runtime authorization token

### `VerificationFinding`

Expected field concepts:

- finding code
- finding severity or review importance
- finding summary
- supporting evidence reference
- reviewer note or explanation
- source attribution

Boundary:

- findings describe evidence interpretation outcomes
- findings are recommendation-oriented and review-oriented, not blocking semantics

### `AdapterLimitations`

Expected field concepts:

- limitation code
- limitation description
- affected verification area
- recoverability hint
- reviewer visibility requirement

Boundary:

- limitations preserve honest incompleteness
- limitations must not be silently converted into success states

## 8. Error Handling

Adapters should convert error conditions into visible review artifacts, limitations, or findings rather than approval or blocking decisions.

Expected handled cases include:

- parse error
- missing required field
- unsupported receipt version
- unsupported signature algorithm
- issuer key unavailable
- raw payload unavailable
- payload hash mismatch
- malformed timestamp
- redacted evidence
- confidential evidence

Error-handling rules:

- malformed or incomplete evidence must remain visible
- adapter failure should produce reviewer-visible diagnostics where possible
- unsupported verification conditions should become explicit findings or limitations
- confidentiality or redaction limits should be reported as bounded visibility gaps
- no error condition should be rephrased as automatic runtime approval or automatic runtime blocking

The adapter is responsible for preserving ambiguity honestly.
It is not responsible for turning ambiguity into authority.

## 9. Determinism Requirements

The adapter design should preserve deterministic review behavior:

- same input and same context should produce same normalized record and findings
- timestamps and generated identifiers should be explicit
- adapters should avoid hidden network calls unless explicitly supplied through context
- raw evidence should be referenced, not silently transformed
- failed verification must remain visible

Determinism matters because adapter outputs are intended to support auditability, explanation, and repeatable human review.
Any dependency on dynamic external state should be explicit through `AdapterContext`, not hidden inside adapter behavior.

## 10. Relationship to Guard Core

Guard Core consumes normalized records and findings.
Guard Core should not depend on external receipt-specific shape.

Phase 2 interface consequences:

- adapter output must remain additive
- adapter output must not mutate `audit` behavior in Phase 2 design
- adapter output must not mutate `permit` behavior in Phase 2 design
- adapter output must not mutate `classify` behavior in Phase 2 design
- Guard Core remains the consumer of Guard-owned semantics rather than issuer-owned raw schemas

This keeps source-specific evidence handling at the adapter boundary and preserves unchanged main-path semantics in the Guard Core line.

## 11. Relationship to Reference Adapters

ramen `v5` can be mapped through this interface later.
Other adapters should also be mappable.

Boundary rules:

- ramen must not define the interface
- reference adapters validate the interface design, not own it
- the interface must remain vendor-neutral
- the interface must remain evidence-source-oriented rather than issuer-privileged

Reference adapters are useful because they pressure-test the design boundary.
They must not become the reason the generalized interface inherits vendor-specific authority language, field assumptions, or lifecycle coupling.

## 12. Non-Goals

This phase does not include:

- no runtime enforcement
- no approval or blocking semantics
- no deployment control
- no certification
- no trust registry in `v0.1`
- no automatic remediation
- no adapter marketplace
- no production conformance suite

This document is intentionally narrower than a product integration contract.
It exists to protect the verification boundary before any future type-only or implementation follow-up work is considered.

## 13. Open Questions

The following questions remain intentionally open for later bounded work:

- sync vs async interface
- key discovery abstraction
- raw payload lookup semantics
- canonical payload hashing
- adapter conformance checks
- fixture governance
- version compatibility
- confidential evidence handling
- multi-receipt aggregation
- chained evidence

These questions may shape later hardening, but they should not pull the Phase 2 design into execution authority, vendor privilege, or control-plane semantics.
