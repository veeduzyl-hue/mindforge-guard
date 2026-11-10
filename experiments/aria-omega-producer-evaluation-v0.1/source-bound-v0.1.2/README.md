# AOE-PE v0.1.2 — Source-Bound Verification Preparation

Status: **RESEARCH-ONLY / DOCS-ONLY / PRELIMINARY / NO PRODUCER ADMISSION**  
Base: previously merged AOE-PE v0.1.1.  
Source event: a follow-up evidence package supplied by the ARIA OMEGA producer on 2026-11-10.

## Authorization and boundary

This branch records the *scope* of a proposed source-bound evidence verification, not an assurance opinion.

- **No Guard Core, EAK schema, API, CLI, release, entitlement, or runtime changes.**
- **No ARIA runtime installation, remote execution, or production integration.**
- **No cryptographic or regulatory conclusions beyond separately reviewable evidence.**
- **No authority expansion; recommendation-only / additive-only / non-executing.**
- Prior AOE-PE v0.1.1 findings remain historically intact; new evidence is evaluated as a new source version.

## Allowed limited research

1. Check exact bytes and checksum manifest consistency of the received artifacts.
2. Examine internal canonical payload hash, detached signatures, Ledger chain, and file bindings.
3. Verify trusted timestamps against independently sourced certificate trust anchors.
4. Review public transparency receipts only after identifying official trust roots and index semantics.
5. Recompute aggregate C14 counts from privately held case-level records, without publishing those records.
6. Keep the distinction between historical evidence existence and admission to the particular Master Dossier execution.
7. Draft a bounded verification report and independent-verification contract, both subject to separate human review.

## Producer-specified handling restriction

The producer explicitly restricted `casos/` and `casos.jsonl` to verification-only use. Do **not** commit or publish them, raw prompts, case-level outputs, attack traces, extracted derivatives, or private archive contents.

A public summary may contain only carefully reviewed aggregate results, selected hashes, methods, and bounded findings. **Publishing any such summary is on HOLD pending Owner review.** The underlying source package and private verification record are not committed to this repository.

## Evidence-state discipline

Use distinct assessment states: `VERIFIED`, `FAILED`, `UNVERIFIED`, `NOT_RUN`, `NOT_APPLICABLE`. A check that validates with a supplied public key must not silently claim that the key's external identity or HSM custody was independently verified.

Open conditions include independent FreeTSA CA-chain validation, official Rekor log and checkpoint corroboration, identity/custody of signing keys, and evaluation-method limits of the C14 stress report.

## Admission and signature

- Producer Assurance: **NOT ESTABLISHED**
- Formal Guard Admission: **NOT PERFORMED**
- Independent assurance report: **NOT SIGNED**
- Public disclosure of verification findings: **HOLD FOR OWNER REVIEW**
- PR merge: **NOT AUTHORIZED** without a separate review and disposition

The parent AOE-PE v0.1.1 source-bound fixtures and signed-claim boundaries are unchanged.
