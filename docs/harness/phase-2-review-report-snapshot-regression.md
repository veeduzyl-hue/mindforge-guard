# Harness Phase 2 Review Report Snapshot Regression

## Purpose

This document defines the bounded local preview snapshot regression layer for Harness Phase 2 generated review evidence artifacts.

This layer is:

- local preview implementation
- deterministic snapshot regression only
- default-off
- verification-only
- human-review-oriented
- additive-only
- recommendation-only
- non-executing

This layer is not:

- not production integration
- not Guard runtime
- not Guard CLI
- not control plane
- not approval authority
- not blocking authority
- not deployment authority
- not certification authority

Guard provides deterministic review evidence only.
It does not approve, block, deploy, certify, or control execution.

It does not modify `packages/guard/**`.
It does not change `audit`, `permit`, or `classify`.
It does not modify the main README product narrative.

External signed receipts are review evidence only.
`ramen-receipt-v5 remains one example only`.

Snapshots are regression fixtures only.
They are not governance truth, runtime permission, approval power, certification power, or deployment power.

## Scope

This snapshot regression layer freezes the current deterministic output shape for:

- `normalized-evidence-pack-generated.json`
- `review-report-generated.md`
- `evidence-type-contract-validation-summary.json`

The goal is not to re-implement the existing normalizer, renderer, or contract validator.
The goal is to detect bounded output drift in review evidence artifacts after later code changes.

## Determinism Rules

The snapshot regression layer must remain:

- local-only
- deterministic
- default-off
- verification-only

It must not:

- call live external APIs
- call ramen live APIs
- introduce wall-clock timestamps
- introduce machine-specific paths
- introduce random ids
- introduce nondeterministic ordering

If a generated artifact becomes nondeterministic, the verifier must report the drift explicitly.
Only minimal deterministic-output fixes are allowed in the underlying normalizer or renderer, and those fixes must not change the established Phase 2 semantic boundary.

## Snapshot Surface

The snapshot fixtures are stored in:

- `experiments/harness-phase-2-external-evidence/snapshots/normalized-evidence-pack.snapshot.json`
- `experiments/harness-phase-2-external-evidence/snapshots/review-report.snapshot.md`
- `experiments/harness-phase-2-external-evidence/snapshots/evidence-type-contract-validation-summary.snapshot.json`

The verifier must:

1. regenerate the normalized evidence pack artifact
2. regenerate the review report artifact
3. regenerate the contract validation summary artifact
4. compare generated artifacts to snapshots
5. verify required review-report sections remain stable
6. verify required non-authority and example-only statements remain stable
7. verify no authority-expanding language is introduced
8. verify `packages/guard/**`, `README.md`, `audit`, `permit`, and `classify` remain unchanged
9. verify `npm run verify` still excludes this standalone snapshot verifier

## Verification Surface

The standalone verification command is:

```bash
npm run verify:harness-phase2:snapshots
```

It is not merged into:

```bash
npm run verify
```

This preserves the main verification path while keeping snapshot regression checks available as a bounded standalone layer.
