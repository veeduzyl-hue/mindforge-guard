# Demo B: Release Governance

## Goal

Show a buyer how a release workflow can produce verifiable governance evidence, delivery-manifest alignment, and delivery-readiness style artifacts without turning Guard into an execution authority.

This demo reuses the existing `v6.12.0` governance baseline and current repository verification semantics.

It does not start Demo C.

## Buyer-Facing Narrative

A release buyer typically wants to know:

"Before we publish, can we prove that the governance evidence is complete, the delivery manifest is aligned, and the release-readiness semantics are verifiable?"

Demo B answers that using the bounded release-governance surfaces already present in Guard:

1. confirm the release line
2. confirm repo governance status
3. verify the `v6.12` delivery manifest / acceptance semantics line
4. inspect the evidence and readiness artifacts that explain what was verified

The outcome is a release-governance story with bounded evidence, not autonomous release control.

## Demo Input

Input file:

- [`demo_b_release_context.txt`](demo_b_release_context.txt)

Input text:

```text
Prepare a release candidate with closure evidence, delivery manifest alignment, and final acceptance semantics verification before publication.
```

## Demo Commands

Run from the repository root:

```bash
node packages/guard/src/runGuard.mjs --version
node packages/guard/src/runGuard.mjs status
npm.cmd run verify:v612
node scripts/verify_governance_case_review_decision_closure_evidence_package_delivery_manifest_acceptance_semantics_final_acceptance.mjs
```

## Expected Outputs

### 1. Release Line Confirmation

Expected shape:

```text
guard 6.13.0
```

What this shows:

- the demo is running on the current commercial release line
- the release-governance baseline underneath it remains the finalized `v6.12.0` governance line

### 2. Repo Governance Status

Expected shape:

```text
Guard Status
------------
Policy: ok
...
Overall:     community (min)
```

What this shows:

- the repo has a valid local governance policy
- the release-governance demo starts from a visible and inspectable repo state

### 3. Delivery Manifest / Acceptance Semantics Verification

Expected shape:

```text
verify_governance_case_review_decision_closure_evidence_package_delivery_manifest_acceptance_semantics_boundary: ok
governance case review decision closure evidence package delivery manifest acceptance semantics hardening verified
governance case review decision closure evidence package delivery manifest acceptance semantics final acceptance verified
```

What this shows:

- the bounded release-governance line is verified end-to-end
- the evidence package, delivery manifest, and acceptance semantics chain is aligned
- final acceptance semantics are frozen and machine-checkable

## Delivery-Readiness Style Artifacts

These repository artifacts support the buyer-facing release-governance story:

- [docs/STATUS_v6.12_delivery_manifest_acceptance_semantics_final_acceptance_phase3.md](../STATUS_v6.12_delivery_manifest_acceptance_semantics_final_acceptance_phase3.md)
  - explains that final acceptance is closed and compatibility freeze is preserved
- [docs/governance/review-decision-closure-evidence-package-delivery-manifest-acceptance-semantics-final-acceptance-contract.md](../governance/review-decision-closure-evidence-package-delivery-manifest-acceptance-semantics-final-acceptance-contract.md)
  - explains what the final acceptance contract freezes and what must continue to be rejected
- [RELEASE.md](../../RELEASE.md)
  - explains how release verification is framed on the current release line

Together they give a buyer:

- evidence of what was verified
- a manifest-oriented explanation of the delivery surface
- a readiness-style narrative for release review

## Validation Commands

Use these commands to validate Demo B:

```bash
node packages/guard/src/runGuard.mjs --version
node packages/guard/src/runGuard.mjs status
npm.cmd run verify:v612
node scripts/verify_governance_case_review_decision_closure_evidence_package_delivery_manifest_acceptance_semantics_final_acceptance.mjs
```

## Validation Notes

Validation run date:

- `2026-04-02`

Observed notes:

- `node packages/guard/src/runGuard.mjs --version`
  - passed
  - output: `guard 6.13.0`
- `node packages/guard/src/runGuard.mjs status`
  - passed
  - showed `Policy: ok` and `Overall: community (min)`
- `npm.cmd run verify:v612`
  - passed
  - verified boundary, hardening, and final acceptance for the delivery manifest / acceptance semantics line
- `node scripts/verify_governance_case_review_decision_closure_evidence_package_delivery_manifest_acceptance_semantics_final_acceptance.mjs`
  - passed
  - confirmed final acceptance semantics verification directly

## Demo Boundary

Demo B preserves current Guard posture:

- recommendation-only
- additive-only
- non-executing
- default-off where applicable
- no authority expansion

It demonstrates verifiable release governance, not autonomous release execution.
