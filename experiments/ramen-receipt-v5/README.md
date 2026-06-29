# Ramen Receipt V5 Interoperability Spike

This experiment is a bounded, local-only proof that MindForge Guard can independently verify Ramen V5 signed receipts without depending on a Ramen reference verifier.

Boundary:

- additive only
- recommendation only
- non-executing
- default-off
- no `audit`, `permit`, or `classify` changes
- no runtime enforcement

Source material:

- provider document: `alane-v5-conformance`
- issued: `2026-06-22T10:10:42.789Z`
- gist: `https://gist.github.com/ramen-noodle6/86495c48c71ca380d43af6a9e586ad4b`

The fixture file at `fixtures/ramen-v5-conformance.json` preserves the provider vectors and key material needed for local verification:

- `ramen_pk_v1` remains the documented production key with `static_key_provisional` trust status
- `ramen_pk_ephemeral_test` is the provider-published throwaway key for the conformance vectors
- `ramen_pk_ephemeral_alias` is a local alias that reuses the same public key so Guard-side envelope mismatch tests can stay signature-valid

Verification surfaces:

- provider vectors `5.1` to `5.6`
- Guard-side derived negatives for unknown `kid`, envelope drift, and top-level response drift
- adapter contract presence and boundary language

Run:

```bash
npm run verify:ramen-v5
```
