# V8.0 Semantic Foundation Architecture Invariants v0.1

Status: Gate 1 architecture baseline. These invariants are accepted for V8.0 specification work; executable conformance coverage remains Phase 2 work.

## Purpose

This document freezes the testable boundaries for the V8.0 Semantic Foundation. It is additive to the existing Evidence Contract, Evidence Assurance Kernel (EAK) PoC, Governance Report, and external evidence architecture. It does not change any released runtime or commercial contract.

The target architecture is:

`Evidence Pack -> Evidence Contract -> MESR semantic binding -> EAK claim support evaluation -> governance / institutional disposition -> institutional artifact`

The fixed responsibility formula is:

```text
Evidence Contract transports facts.
MESR stabilizes meaning.
EAK limits claims.
Domain Packs extend context.
Crosswalks translate external vocabularies.
Institutional Profiles change expression, not meaning.
```

Guard verifies consequential transitions. Guard does not execute, approve, authorize, certify, or own them.

## Testable Invariants

| ID | Invariant | Conformance oracle | Required negative case |
| --- | --- | --- | --- |
| INV-01 | Evidence does not create authority. | Adding an evidence item without an authority source, subject, scope, and valid temporal basis cannot change an authority claim to `supports`. | A signed or complete artifact alone must not support `authority.verified`. |
| INV-02 | Verification does not create execution permission. | A verification result may affect claim support only; it cannot emit or mutate an execution-permission field. | `verification = passed` must not support `execution.authorized_by_guard`. |
| INV-03 | Verified identity and verified authority are distinct claims. | Identity bindings and authority bindings are evaluated under different semantic IDs and required bindings. | `identity_verified = true` must not support `authority_verified = true`. |
| INV-04 | Capability continuity does not imply authority continuity. | A capability delta and an authority delta are evaluated independently. | Adding a write tool to a read-only actor must produce changed capability and unsupported authority continuity. |
| INV-05 | A claim is supported only within the subject, scope, time, and provenance bound by its evidence. | `supports` requires all four bindings to match the evaluated claim. | Reusing evidence for a different commit, path, time, or producer must not retain `supports`. |
| INV-06 | Producer self-report does not constitute independent verification. | Producer and verifier identities and methods must be distinct before independent verification can be claimed. | A producer-authored `verified: true` field must not support `independently_verified`. |
| INV-07 | Integrity proves preservation, not truth. | Hash or signature verification may support artifact integrity/authenticity only. | A matching hash or valid signature must not support artifact truth or claim correctness. |
| INV-08 | Domain modules may extend context but may not redefine Core meaning. | Loading a Domain Pack cannot change a Core definition, required binding, support relation, or non-claim. | A pack defining `verified = approved` must be rejected. |
| INV-09 | Institutional Profiles may change expression but may not alter semantic IDs or claim boundaries. | Core evaluation before and after profile application must be byte-equivalent after presentation fields are removed. | A profile must not change `supports_claim()` output. |
| INV-10 | Guard never converts evidence assurance into execution authority. | No EAK result, assurance posture, report disposition, module, or profile may create an execution authorization. | `supports`, `partially_supports`, `contradicts`, `does_not_support`, `indeterminate`, and existing report verdicts must not authorize execution. |

## Compatibility Oracle

Every V8.0 implementation phase must demonstrate:

- `audit` output, verdict, and exit semantics unchanged;
- deny exit code `25` unchanged;
- `permit` and `classify` behavior unchanged unless a later phase explicitly scopes and separately releases a change;
- recommendation-only, additive-only, non-executing, and default-off posture preserved;
- no authority scope expansion;
- no competing factual input contract beside Evidence Pack;
- no competing final disposition vocabulary beside the existing Governance Report contract.

## Conformance Evidence Expected In Phase 2

Phase 2 should turn each invariant into at least one positive fixture and one rejecting or non-supporting fixture. A failure is architectural when the only way to make a fixture pass is to weaken a claim boundary, override Core meaning, or grant Guard execution authority.
