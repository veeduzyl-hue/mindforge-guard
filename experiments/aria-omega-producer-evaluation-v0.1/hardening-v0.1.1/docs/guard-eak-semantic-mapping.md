# AOE-PE v0.1.1 — Guard / EAK Semantic Mapping Review

## Status

Research-only semantic mapping. No Guard runtime adapter, product-code change, or EAK schema change is proposed.

## 1. Source classification

The 2026-11-02 ARIA OMEGA Master Dossier is an external audit/report artifact. It is not itself a runtime receipt and is not shown to satisfy the minimum External Receipt Contract. A future Evidence Package may represent it as `external_verifier_output` (or `evidence_pack` when the package boundary is being evaluated), not as `runtime_receipt` by default.

- Do not force the Master Dossier through the minimum signed-receipt fields.
- Do not invent receipt IDs, signatures, public keys, TSA tokens, runtime actions, or execution facts absent from the source.
- Preserve the PDF as a raw evidence reference and preserve producer-declared limitations.
- A later raw JSON, source repository snapshot, stress artifact, signature, or TSA token is a separate evidence item with its own provenance.

## 2. Existing Guard / EAK surfaces only

| Existing surface | AOE-PE use | Boundary |
|---|---|---|
| Evidence Pack v1 `producer` | Identify ARIA OMEGA as declared producer | Identity is not trust or assurance |
| Evidence Pack v1 `artifacts` / `manifest` | Reference the frozen PDF and missing artifacts | Reference is not proof of retrieval or integrity |
| Evidence Pack v1 `verification` | Record what was and was not independently checked | Do not infer unavailable facts |
| EAK `EvidencePackageRecord` | Represent the dossier as an external verifier output | Existing `source_type` vocabulary only |
| `NormalizedEvidenceRecord` | Apply only if a later adapter parses a concrete receipt/evidence item | This suite emits no production normalized record |
| `VerificationFinding` | Attach existing taxonomy findings to evidence references | No new finding type/category/severity |
| `AssuranceProfile` / `AssuranceReport` | Reuse existing check, finding, missing-evidence, limitation and human-review surfaces | No new check type or report schema |

## 3. Baseline case mappings

| Case | Existing finding types | EAK mapping | Interpretation |
|---|---|---|---|
| C14 downgrade | `external_report_unavailable`, `evidence_incomplete` | `evidence_chain_completeness=failed`; `provenance_completeness=partially_verified` | Referenced stress evidence is not present and bound to this execution; this does not prove it never existed elsewhere |
| MOCK_PROTOCOL | `missing_signature`, `signature_not_checked`, `timestamp_not_checked`, `raw_payload_unavailable` | `digest_integrity=not_run`; `signature_validity=not_run`; `temporal_consistency=not_run` | Digest, signature, and TSA are separate proof dimensions |
| RAG 0/5 relevance | `evidence_insufficient_for_review`, `partial_evidence` | `provenance_completeness=partially_verified` only as a bounded source-visibility observation | Relevance is not a dedicated EAK check type; do not relabel it as cryptographic verification |
| Unsigned envelope | `missing_signature`, `timestamp_not_checked`, `raw_payload_unavailable` | signature / temporal / digest checks `not_run` | Project-level crypto prototype claims do not sign this specific envelope |
| 21-claim reconciliation | `reviewer_attention_recommended`, `partial_evidence` | `structural_validity=verified`; `provenance_completeness=not_run` | Published counts reconcile; underlying registry not independently fetched |

`SUPPORTED_LIMITED` is an AOE case disposition only. It is not a Guard finding type, assurance status, approval, or product verdict.

## 4. Existing EAK check vocabulary

Use only the current `AssuranceCheckType` values: `structural_validity`, `required_field_completeness`, `payload_binding`, `digest_integrity`, `signature_validity`, `temporal_consistency`, `provenance_completeness`, and `evidence_chain_completeness`.

Use only the current statuses: `verified`, `failed`, `not_run`, `unsupported`, and `partially_verified`.

RAG relevance is not a dedicated EAK check type. Preserve zero relevance as a scope limitation / missing-evidence explanation and use existing review findings. Do not invent a relevance check or coerce it into digest/signature/legal-applicability checks.

## 5. Claim-status reconciliation

Registered status, producer effective status, deterministic Core result, and LLM narrative are distinct values. Narrative output must not overwrite a deterministic effective status.

For C14, the registered status is `TESTADO_EM_AMBIENTE_CONTROLADO`; the dossier's effective status is `DESIGN_DECLARADO`; the stress artifact is not present/verified in this execution. A reference to another branch remains a lead, not admitted current-execution evidence.

If a narrative says `TESTADO_EM_AMBIENTE_CONTROLADO` while the deterministic result says `DESIGN_DECLARADO`, preserve the deterministic status and emit existing `reviewer_attention_recommended` / `evidence_incomplete` findings.

## 6. Cryptographic semantics

- Digest presence is not a digital signature.
- Digest comparison requires exact payload bytes or a declared canonicalization procedure plus the payload.
- `signature: null` and `NAO_IMPLEMENTADO` cannot produce `valid_signature`.
- `LOCAL_MOCK` is not an externally verified RFC 3161 timestamp token.
- A local chain is not an external anchor.
- Do not emit `payload_hash_match`, `valid_signature`, or `valid_timestamp` unless the corresponding verification was actually performed and supported by retained evidence.

## 7. Positive control

A synthetic control case supplies a stress-test artifact that is present, bound to the current execution, and digest-verified. The experiment oracle preserves the registered tested status and emits no downgrade findings. This tests the evaluator's balance; it is not evidence that ARIA actually supplied such an artifact.

## 8. Independent verifier boundary

The offline oracle is experiment-level deterministic logic. It is not Guard Core, not an Evidence Source Adapter, and not the EAK verifier. Its PASS means only that synthetic inputs produced the expected bounded findings.

## 9. Frozen boundaries

- No changes to `packages/guard/**`, `packages/guard-core/**`, or `packages/schema/**`.
- No changes to Evidence Contract v1, EAK types, or the existing finding taxonomy.
- No changes to `audit`, `permit`, or `classify`.
- No aggregate `npm run verify` wiring.
- No package export, runtime adapter, network retrieval, live ARIA integration, deployment, or release.
- Recommendation-only, additive-only, non-executing; no authority expansion.
