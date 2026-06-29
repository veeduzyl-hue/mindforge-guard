# Harness Phase 2 Reviewer Packet

## Purpose

This document defines the bounded local preview reviewer packet layer for Harness Phase 2 generated review evidence.

This layer is:

- local preview implementation
- deterministic reviewer packet only
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

The reviewer packet is not governance truth, runtime permission, approval power, certification power, deployment power, or control-plane authority.

## Scope

The reviewer packet aggregates existing deterministic Phase 2 artifacts for human review preparation:

- `normalized-evidence-pack-generated.json`
- `review-report-generated.md`
- `evidence-type-contract-validation-summary.json`
- `snapshots/**`

It does not compute a Guard verdict.
It does not grant approval, blocking, deployment, certification, or execution control authority.

## Renderer Contract

The renderer exports:

```js
export function renderReviewerPacket(inputs) {}
```

The renderer inputs come only from existing local generated artifacts and snapshot files.
The renderer does not call external APIs and does not use ramen live APIs.

The generated packet must include:

- review scope
- source artifacts
- evidence type coverage
- assurance dimensions
- missing evidence review
- assurance limits review
- external signed receipts
- snapshot regression status
- reviewer checklist
- reviewer questions
- non-authority statement

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
- turn review evidence into authority

## Verification Surface

The standalone verification command is:

```bash
npm run verify:harness-phase2:reviewer-packet
```

It is not merged into:

```bash
npm run verify
```

This preserves the main verification path while adding a bounded reviewer-oriented packet surface for deterministic local review.
