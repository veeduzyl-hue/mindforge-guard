# Harness Phase 2 External Evidence Verification Contract

## Purpose

This contract defines the bounded verification surface for the Guard-native Agent Harness Phase 2 external evidence spike.

The verification surface is local-only and deterministic.
It is not Guard runtime behavior.
It does not change `packages/guard/**`.
It does not change `audit`, `permit`, or `classify`.

## Required Files

The standalone verifier must require:

- `docs/harness/phase-2-external-evidence-record-schema.md`
- `docs/harness/phase-2-external-evidence-verification-contract.md`
- `experiments/harness-phase-2-external-evidence/README.md`
- `experiments/harness-phase-2-external-evidence/fixtures/agent-workflow-artifact.json`
- `experiments/harness-phase-2-external-evidence/fixtures/tool-call-trace.json`
- `experiments/harness-phase-2-external-evidence/fixtures/blocked-action.json`
- `experiments/harness-phase-2-external-evidence/fixtures/command-result.json`
- `experiments/harness-phase-2-external-evidence/fixtures/policy-finding.json`
- `experiments/harness-phase-2-external-evidence/fixtures/external-signed-receipt-ramen-example.json`
- `experiments/harness-phase-2-external-evidence/fixtures/mixed-evidence-pack.json`
- `experiments/harness-phase-2-external-evidence/artifacts/normalized-evidence-pack-sample.json`
- `experiments/harness-phase-2-external-evidence/artifacts/sample-review-report-section.md`
- `scripts/verify_harness_phase2_external_evidence_schema.mjs`

## Record-Level Verification

Every evidence fixture record must contain:

- `record_version`
- `record_id`
- `evidence_type`
- `source`
- `source_schema`
- `source_id`
- `timestamp`
- `subject`
- `assurance`
- `claims`
- `limits`
- `raw_reference`
- `non_authority_statement`

Every evidence fixture record must preserve these assurance layers:

- cryptographic validity
- input binding
- execution evidence
- policy completeness
- legal applicability
- human review status

Every evidence fixture record must include this boundary statement exactly:

`This evidence record is for review only. It does not approve, block, deploy, certify, or control execution.`

## Pack-Level Verification

`mixed-evidence-pack.json` must:

- contain at least six records
- contain at least six distinct evidence types
- combine internal workflow evidence and an external signed receipt example
- preserve a pack-level non-authority statement

`normalized-evidence-pack-sample.json` must contain:

- `evidence_pack_id`
- `generated_at`
- `records`
- `missing_evidence`
- `assurance_limits`
- `reviewer_questions`
- `non_authority_statement`

## Report-Level Verification

`sample-review-report-section.md` must render these sections:

1. Evidence summary
2. Cryptographic evidence
3. Execution evidence
4. Policy findings
5. External signed receipts
6. Missing evidence
7. Assurance limits
8. Human reviewer questions
9. Non-authority statement

The report must state that Guard provides deterministic review evidence only.
The report must not state that Guard approves, blocks, deploys, certifies, or controls execution.

## Adapter Boundary Verification

The verifier must confirm:

- the ramen example fixture uses `source: "ramen"`
- the documents state `Ramen is one example only.`
- no file claims production integration readiness
- no file introduces runtime enforcement
- no file introduces control-plane behavior

## Repository Boundary Verification

The verifier must confirm:

- no tracked or untracked changes exist under `packages/guard/**`
- `README.md` remains unchanged

These checks are guardrails for this bounded spike only.
They do not infer broader release readiness on their own.

## Standalone Script Contract

The standalone verification command is:

```bash
npm run verify:harness-phase2:evidence
```

It must remain separate from `npm run verify`.
It must fail loudly on missing files, malformed fixtures, boundary drift, or prohibited claims.

## Compatibility Statement

This verification contract preserves:

- `audit` output / verdict / exit unchanged
- `permit` behavior unchanged unless explicitly scoped
- `classify` behavior unchanged unless explicitly scoped
- recommendation-only
- additive-only
- non-executing
- default-off
- no authority scope expansion
