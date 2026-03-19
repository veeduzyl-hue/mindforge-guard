# Second Consumer Operational Boundary

This document freezes the v3.2 Phase 1 operational boundary for the promoted second consumer runtime.

## Runtime Position

- The runtime remains a standalone non-audit second consumer.
- The runtime does not integrate into `guard audit`.
- The runtime does not modify `runGuard.mjs`.
- The runtime continues to consume only existing governance artifacts.

## Invocation Boundary

- Stable required inputs:
  - `permit_gate_result`
  - `governance_decision_record`
  - `governance_activation_record`
- Stable optional inputs:
  - `governance_outcome_bundle`
  - `governance_application_record`
  - `governance_disposition`
- Stable excluded input:
  - `governance_receipt`
- Stable output file behavior:
  - UTF-8 encoding
  - trailing newline preserved
  - pretty output indentation fixed at 2 spaces
  - file output written through atomic replace semantics

## Reproducibility Boundary

- identical inputs must produce identical runtime summaries
- identical inputs must produce identical summary hashes
- repeated writes to the same output path must preserve identical file content
- the runtime summary remains a runtime summary, not a governance object

## Phase 1 Completion Standard

v3.2 Phase 1 is complete only if all of the following remain true:

- invocation flags and required / optional / excluded input sets remain stable
- runtime summary serialization remains stable and reproducible
- repeated runtime execution does not drift in summary content or summary hash
- repeated file output does not drift in written content
- existing audit, permit gate, classify, governance artifact, readiness, pilot, and contract semantics remain unchanged
