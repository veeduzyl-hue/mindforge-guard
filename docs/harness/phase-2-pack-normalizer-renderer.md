# Harness Phase 2 Pack Normalizer And Review Report Renderer

## Purpose

This document defines the bounded local preview implementation for the Guard-native Agent Harness Phase 2 pack normalizer and review report renderer.

This implementation is:

- local preview implementation
- default-off
- deterministic
- verification-only
- human-review-oriented
- additive-only
- recommendation-only
- non-executing

This implementation is not:

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

It does not change `audit`, `permit`, or `classify`.
It does not modify `packages/guard/**`.
It does not modify `README.md`.

`ramen-receipt-v5 remains one example only`.
External signed receipts are ingested only as deterministic review evidence.

## Scope

The Phase 2 normalizer reads a mixed evidence pack fixture and emits a normalized evidence pack for deterministic review.

The Phase 2 renderer reads that normalized pack and emits a markdown review report for human review preparation.

Neither step computes Guard verdicts.
Neither step emits approval, blocking, deployment, certification, or control-plane authority.

## Inputs

Primary source fixture:

- `experiments/harness-phase-2-external-evidence/fixtures/mixed-evidence-pack.json`

The normalizer must tolerate these top-level record container field names:

- `records`
- `evidence_records`
- `evidence`
- `items`

## Normalizer Contract

The normalizer exports:

```js
export function normalizeEvidencePack(inputPack) {}
```

The output pack must preserve these semantics:

- stable `normalized_pack_version`
- stable `evidence_pack_id`
- stable `source_pack_id`
- stable record ordering
- stable record counts by type
- stable assurance summaries
- explicit `missing_evidence`
- explicit `assurance_limits`
- explicit `reviewer_questions`
- explicit non-authority statement

Determinism rules:

- no live external API
- no ramen live API
- no wall-clock dependency
- `generated_at` derived from source pack timestamps when available
- fixed fallback timestamp if source timestamps are absent
- stable JSON rendering

## Renderer Contract

The renderer exports:

```js
export function renderReviewReport(normalizedPack) {}
```

The report must include:

- evidence pack summary
- record counts
- cryptographic evidence
- execution evidence
- policy findings
- external signed receipts
- missing evidence
- assurance limits
- human reviewer questions
- non-authority statement

The report must state:

- `Guard provides deterministic review evidence only. It does not approve, block, deploy, certify, or control execution.`
- `ramen-receipt-v5 remains one example only`

## Boundary Preservation

This local preview preserves:

- deterministic governance evidence layer
- recommendation-only
- additive-only
- non-executing
- non-control-plane
- verification-only
- human-review-oriented

This local preview does not:

- enter Guard runtime
- enter Guard CLI
- change `audit`, `permit`, or `classify`
- change `packages/guard/**`
- introduce runtime enforcement
- introduce production integration claims
- turn external signed receipts into authority

## Verification Surface

The standalone verification command is:

```bash
npm run verify:harness-phase2:normalizer
```

It must execute the real flow:

1. Load the mixed evidence pack fixture.
2. Generate the normalized evidence pack artifact.
3. Generate the markdown review report artifact.
4. Verify deterministic structure and required sections.
5. Verify compatibility boundaries remain intact.
