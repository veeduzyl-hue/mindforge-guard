# Second Consumer Runtime Boundary

This document freezes the v3.3 Phase 1 stable runtime boundary for the second consumer runtime.

## Runtime Position

- The runtime remains a standalone non-audit second consumer.
- The runtime does not integrate into `guard audit`.
- The runtime does not modify `runGuard.mjs`.
- The runtime does not become a second main-path takeover entrypoint.

## Stable Runtime Discipline

- Stable help exit: `0`
- Stable success exit: `0`
- Stable failure exit: `1`
- Stable stdout mode: help or runtime summary only
- Stable stderr mode: single-line error output
- Stable output write rule: write only on success

## Stable Input and Output Boundary

- Required inputs:
  - `permit_gate_result`
  - `governance_decision_record`
  - `governance_activation_record`
- Optional inputs:
  - `governance_outcome_bundle`
  - `governance_application_record`
  - `governance_disposition`
- Excluded input:
  - `governance_receipt`
- Stable runtime output remains a runtime summary, not a governance object.

## Phase 1 Completion Standard

v3.3 Phase 1 is complete only if all of the following remain true:

- invocation flags remain stable
- runtime help, success, and failure exits remain stable
- stdout and stderr discipline remain stable
- output files are written only on success
- `summaryHash` remains a reproducibility signal only
- existing audit, permit gate, classify, governance artifact, readiness, pilot, contract, and operational hardening semantics remain unchanged
