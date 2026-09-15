# ADR 0013: Independent verification and integrity evidence contract

- Status: B05 specification decision; SPECIFICATION_ONLY, 2026-09-15.
- Contract: `verification-independence-integrity/0.1`, a future auxiliary evidence contract, not a change to EvidencePackV1.
- Depends on [B01](0010-mesr-canonical-id-relation-and-admission-contract.md), [B02](0011-mesr-claim-nonclaim-state-and-binding-contract.md), [B03](../architecture/harness-to-canonical-evidencepackv1-closure-v0.1.md).

## Current behavior and debt

[EAK buildVerifications](../../packages/guard-core/src/evidenceAssuranceKernel.ts) maps pack passed to verified, failed to partially_verified and other statuses to not_verified. Its generated verifier IDs identify projection records, not independently established principals. External report verification filters verified/partially_verified checks, but buildEvidenceItems independently marks any nonempty executed_checks as independently_verified. Normalized record status verified also receives that independence label. A report_integrity.digest gives integrity bound; a supplied normalized payload_hash_status is consumed without recomputing bytes in this path.

[Producer semantic projection](../../packages/guard-core/src/mesr/producerAdapters/semanticProjection.ts) can support artifact_integrity from digest/subject presence. Existing local verification contracts can perform actual checks; their existence does not prove every supplied label came from one. These are preserved PoC behaviors, not the repaired evidential standard. EAK `0.1.0-poc`, its projection, external-evidence types, local fixtures and snapshots remain unchanged.

## Distinct dimensions and required evidence

Each requested claim uses B02's required-binding union and precedence. Resolve all semantic identities and versions before evaluation. The following fields describe a future separate evidence record, not new required canonical pack fields. References are nonempty and point to retained, attributable records; a URI string alone is not a witness.

| Dimension | Minimum bound basis | Permitted conclusion and limit |
|---|---|---|
| Verification event occurrence | event_id; producer and verifier attribution; subject revision/artifact digest; scope; checked_property/claim_set; method ID/version; event_time; event/output refs | A named check occurred in the captured context. A command exit or aggregate count cannot supply a missing event. |
| Verification result | Occurrence basis plus exact result and method's pass/fail criterion, inputs, outputs and limitations | That check passed/failed/inconclusive under the named criterion; not independent by implication. Failed/skipped-only sets cannot support successful verification. |
| Verifier identity | Principal identity_ref, identity method/result/provenance, operational role and attribution to the actual check | Attributable verifier; a different label or generated record ID does not establish a different principal. Identity != authority. |
| Verifier independence | Producer/executor/verifier principal bindings, separation policy ID/version, control/conflict-of-interest facts, successful attributable check and custody basis for its inputs/results | Bounded independence under that separation policy. Different strings, processes or organizations alone are insufficient; common control must be evaluated. |
| Evidence custody | Artifact identity/digest and provenance for collection, transfers, transformations, storage and access/control through verification; named custodians and time intervals; omissions | Captured custody path. Independent custody additionally requires evidence that the producer cannot solely substitute the relied-on bytes/results, under the named custody criterion. No custody service is assumed. |
| Artifact-byte integrity | Exact supplied byte reference, namespace/member identity, byte count, subject/scope/time, algorithm, expected digest source and freshly observed digest, checker identity/method/time | Bounded equality to a specified reference digest; not truth, authenticity or independent custody. |
| Digest comparison | Expected and observed digest, same algorithm and same byte domain, successful recomputation event, match/mismatch result | Comparison occurred and matched/mismatched. Hash syntax or self-declared equality cannot replace recomputation. |
| Claim supportability | All above obligations relevant to the particular claim, canonical identity/version, registry digest, module lock, method version, evaluation_time, evidence refs and nonclaims | B02 six-state result for that claim/basis. Integrity, independence and result have separate states. |
| Acceptance | Separate decision occurrence and applicable decision-maker authority evidence, bound to subject/scope/time | Neither acceptance nor its authority follows from verification. This contract issues no acceptance decision. |

### Byte comparison rule

Resolve bytes only from explicitly supplied, bounded references; preserve originals and transformation provenance. Read exact bytes, measure byte length, compute the declared algorithm (SHA-256 for the B03 scenario), compare against an attributed expected digest for the same artifact/representation. Record both digests even on mismatch. No JSON reserialization, text newline normalization or redaction may be silently substituted for the original bytes. A fresh hash without an independently justified expected baseline supports only that byte snapshot's measured digest, not provenance/authenticity.

Missing bytes, expected reference or recomputation evidence yields UNRESOLVED for integrity-to-reference. A completed admissible mismatch yields UNSUPPORTED for the equality claim and may separately support a bounded mismatch claim. It is not automatically CONFLICTED: that requires mutually incompatible admissible assertions under B02. A local match can be SUPPORTED for byte equality while independence stays UNRESOLVED or is explicitly UNSUPPORTED under a completed producer-only custody criterion. B03 still rejects canonical closure on declared/observed digest mismatch.

### Independence rule

An independently attributable successful check requires all check/event/result bindings plus a satisfied separation predicate over the actual principals and the custody path. The independence claim here includes successful checking; an independent actor's failed check can establish actor separation and failure occurrence without establishing this successful-verification claim. If producer == verifier is established, this check's independence is UNSUPPORTED under the separation criterion. It says nothing about whether another independent check exists elsewhere.

If identity, separation or custody basis is absent, world-level independence is UNRESOLVED. The narrower inference "producer supplied verified, therefore independent" is UNSUPPORTED by Core nonclaim. Preserve both results with their different claim/basis identities. A successful check with no identity may support an attributed producer result if its own obligations are met, never independent verification.

## State, compatibility and acceptance

Exactly B02's states apply: SUPPORTED, UNSUPPORTED, UNRESOLVED, CONFLICTED, STALE, INCONCLUSIVE. Preserve its prohibition -> conflict -> stale -> missing basis -> completed determination order and per-claim diagnostics. No seventh state; no automatic legacy enum conversion. A recorded inconclusive result with complete inputs is INCONCLUSIVE; missing inputs are UNRESOLVED. Applicability at reliance time is governed by [B07](0015-historical-current-standing-and-reliance-time-contract.md).

verification.passed != verification.independent. Hash presence != Integrity verified. Integrity verified != Independent custody. Independent verification != Acceptance. None proves world truth, sufficiency, safety, compliance or execution authority.

[B05 falsifiers](../validation/v8-b05-independence-integrity-falsifiers-v0.1.md) make the requirements falsifiable. B05 = PASS for specification closure only; cases are NOT_EXECUTED. No Harness aggregate, path, producer flag or command success may synthesize missing B03 facts. No EAK runtime change, adapter implementation, canonical schema migration or repaired Experiment 3 execution is authorized.

Audit output / verdict / exit and deny 25 unchanged; permit/classify unchanged; recommendation-only, additive-only, non-executing, default-off; no authority scope expansion. Gate 1 remains BLOCKED.
