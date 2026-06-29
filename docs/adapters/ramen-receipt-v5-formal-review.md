# Ramen Receipt V5 Formal Review

## 1. Review Status

Status: formal adapter review package prepared for bounded review-stage evaluation.

This package is review-stage only.
It is not production integration, not runtime enforcement, and not a Guard main-path activation step.
It is a review-stage spike.
It is not Guard runtime.
It is not Guard CLI.
It is not control plane.
It does not modify `packages/guard/**`.
`ramen-receipt-v5 remains one example only`.
External signed receipts are ingested only as deterministic review evidence.
It does not approve, block, deploy, certify, or control execution.

## 2. Frozen Baseline SHA

Frozen baseline SHA: `db8d7f46275f477286f1bae0c5869cb7f08fe49a`

## 3. Secret Gist Link

Secret Gist review link:

`https://gist.github.com/veeduzyl-hue/2ce98f6186ec4fa4e4cfe0af0b886541`

## 4. Local PoC Scope

The local PoC proves that Guard can verify Ramen V5 as a signed decision-and-steering receipt.

The scope is limited to:

- receipt structure validation
- Ed25519 signature verification over `UTF8(receipt.canonical_payload)`
- input binding via `payload_hash`
- envelope consistency checks
- top-level response consistency checks
- bounded assurance findings emission
- review-stage negative testing

The scope explicitly excludes:

- runtime enforcement
- control-plane behavior
- production integration
- changes to `audit`, `permit`, or `classify`

## 5. Files Changed

Primary files in the review package:

- `docs/adapters/ramen-receipt-v5-adapter-spec.md`
- `docs/adapters/ramen-receipt-v5-formal-review.md`
- `experiments/ramen-receipt-v5/README.md`
- `experiments/ramen-receipt-v5/fixtures/ramen-v5-conformance.json`
- `experiments/ramen-receipt-v5/verify-ramen-v5.mjs`
- `experiments/ramen-receipt-v5/artifacts/verify-ramen-v5-output.txt`
- `experiments/ramen-receipt-v5/artifacts/sample-findings-allowed.json`
- `experiments/ramen-receipt-v5/artifacts/sample-findings-blocked.json`
- `experiments/ramen-receipt-v5/artifacts/sample-findings-steered.json`
- `scripts/verify_ramen_receipt_v5_conformance.mjs`
- `scripts/verify_ramen_receipt_v5_review_package.mjs`
- `package.json`

## 6. Run Commands

Review-stage commands:

```bash
npm run verify:ramen-v5
npm run verify:ramen-v5:review
npm run verify
```

## 7. Conformance Vectors Covered

Provider vectors covered:

- Vector 1 Allowed
- Vector 2 Blocked
- Vector 3 Steered
- Negative N1 Modified Signature
- Negative N2 Modified Input
- Negative N3 M-1 Signing Failure

## 8. Guard-Side Negative Tests Covered

Derived Guard-side review negatives covered:

- unknown `kid`
- envelope / payload `id` mismatch
- envelope / payload `kid` mismatch
- envelope / payload `schema_version` mismatch
- top-level `allowed` mismatch against signed `verdict`
- top-level `policy_ids` mismatch against signed `policy_ids`
- top-level `executed_at` mismatch against signed `payload.timestamp`
- malformed `canonical_payload`
- unsupported `schema_version`
- invalid `verdict`
- missing required payload field
- conflicting `receipt_alert` and `receipt`

All are required to fail safely without uncaught exceptions.

## 9. Assurance Findings Summary

Review conclusion for the current package:

- Guard verifies Ramen V5 as a signed decision-and-steering receipt
- valid provider vectors produce `cryptographic_assurance: "verified"`
- M-1 no-receipt scenario produces `cryptographic_assurance: "absent"`
- several review-stage negatives preserve cryptographic validity while failing governance consistency checks
- valid signature is not a complete governance conclusion

The assurance model remains bounded:

- `policy_content_immutability: "not_provided"`
- `execution_binding: "not_provided"`
- `legal_applicability: "not_verified"`

## 10. Known Limits

Known limits preserved in this package:

- V5 does not prove policy content immutability
- V5 does not prove downstream execution
- V5 does not prove legal applicability
- V5 does not prove runtime execution outcome
- production key discovery remains static-key-map based
- the review package does not attach the verifier to Guard main-path behavior

## 11. Questions For Damian Review

Questions to resolve in formal review:

1. Is the current separation between cryptographic assurance and governance completeness stated clearly enough for external reviewers?
2. Should `receipt_alert` plus `receipt` be documented as a hard-invalid producer contract breach or kept as an assurance-absent review-stage anomaly?
3. Is the current static-key-map trust labeling (`ephemeral_test_key`, `static_key_provisional`) sufficient for the adapter review stage?
4. Should later review phases require a direct copy of the provider generator output in addition to the normalized local fixture?
5. Is the current bounded non-goal language strong enough to prevent runtime-enforcement misreading?

## 12. Recommendation For Next Stage

Recommended next stage:

- send this package for Damian formal adapter review
- keep the package local/review-stage only
- do not publicize it as production-ready integration
- do not attach the verifier to Guard runtime surfaces
- defer any public posting until review feedback resolves boundary and wording questions

Compatibility / boundary summary:

- compatible
- no semantic regression found
- no authority expansion found
- can proceed to formal review
