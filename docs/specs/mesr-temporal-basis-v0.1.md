# MESR Temporal Basis And Dead-Basis Semantics v0.1

Status: Gate 1 contract and acceptance scenarios. No temporal engine is implemented in this phase.

## 1. Principle

```text
Evidence valid when produced
does not imply
evidence basis valid when an institution relies on it.
```

`basis_valid_at` is the explicit instant at which a consumer evaluates whether evidence remains a usable basis for a bound claim. It is not the evidence production time, verification time, action time, or approval time unless the input explicitly makes them equal.

## 2. Contract

```yaml
temporal_basis:
  evidence_ref: string
  claim_ref: string
  subject_ref: string
  observed_at: timestamp | null
  verified_at: timestamp | null
  valid_from: timestamp | null
  valid_until: timestamp | null
  basis_valid_at: timestamp
  basis_status: current | stale | revoked | superseded | unresolvable
  status_reason: string
  revocation_ref: string | null
  superseded_by: string | null
  subject_binding_hash: string | null
  evaluated_subject_hash: string | null
  provenance_refs: [string]
```

All timestamps must include an offset and be normalized for comparison. The evaluator records its version and canonical ordering. Missing or conflicting required time/provenance inputs produce `unresolvable`, not `current`.

## 3. Basis Status

| Status | Meaning | Claim consequence |
| --- | --- | --- |
| `current` | No expiry, revocation, supersession, subject mismatch, or freshness violation is established at `basis_valid_at`. | Temporal binding may participate in evaluation; it does not support authority or correctness by itself. |
| `stale` | A freshness window or `valid_until` has elapsed, or the relied-on runtime/capability/deployment state materially changed. | Time-dependent claim is `indeterminate` or `does_not_support` under an explicit boundary. |
| `revoked` | An authoritative revocation applies at or before `basis_valid_at`. | The revoked basis cannot support the bound claim. |
| `superseded` | A newer identified source or policy replaces the relied-on basis. | Old basis remains traceable but cannot silently represent current standing. |
| `unresolvable` | Required time, subject, source, revocation, or supersession information is missing or contradictory. | Stronger claim is `indeterminate`; never assume current. |

Precedence for one basis is `revoked` > `superseded` > `stale` > `unresolvable` > `current` when multiple independently established conditions apply. An implementation must retain all contributing reasons even when one status is selected.

## 4. Dead-Basis Rules

A basis is dead for a claim when it is `revoked`, `superseded`, or stale beyond a claim's allowed window. `unresolvable` is not known-dead, but it is unusable for a stronger current-standing claim.

- Credential revocation invalidates only claims bound to that credential and effective time.
- Approval expiry invalidates applicability after `valid_until`; it does not erase historical approval evidence.
- Policy change supersedes the old policy basis only where the new policy applies.
- Runtime or capability change invalidates continuity claims when the evaluated state differs.
- Deployment change invalidates subject continuity unless the deployed identity remains bound.
- A superseded source remains valid evidence of what the source stated historically.
- Review subject hash mismatch prevents transfer of the review to the execution subject.
- Commit-time authority and review-time authority are distinct temporal evaluations.

## 5. Acceptance Scenarios

| ID | Fixture | Expected status | Required claim result | Fail condition |
| --- | --- | --- | --- | --- |
| TB-01 | Credential valid through T2; `basis_valid_at = T1`. | `current` | Credential may support only its bound identity property. | Supports authority or approval automatically. |
| TB-02 | Credential revoked at T1; reliance at T2. | `revoked` | Current credential claim `does_not_support`. | Status remains current. |
| TB-03 | Approval expires at T1; reliance at T2. | `stale` | Applicable approval is `indeterminate`/not supported. | Historical approval is erased or current approval is inferred. |
| TB-04 | Policy P1 replaced by P2 before reliance. | `superseded` | P1 may support historical mapping only. | P1 silently supports current policy match. |
| TB-05 | Runtime tools change from read to read/write. | `stale` | Authority continuity is unsupported. | Capability continuity implies authority continuity. |
| TB-06 | Candidate commit reviewed; different commit deployed. | `stale` | Review-to-execution binding `does_not_support`. | Review transfers to the deployed commit. |
| TB-07 | Source declares supersession but replacement cannot be resolved. | `superseded` | Current claim is `indeterminate`. | Missing replacement is treated as current. |
| TB-08 | Review subject hash differs from execution subject hash. | `stale` | Applicable review claim `does_not_support`. | Hash mismatch is ignored. |
| TB-09 | Commit-time authority current; revoked before review-time reliance. | `revoked` at review time | Historical authority may be recorded; current authority not supported. | Earlier current status is reused. |
| TB-10 | No reliable expiry, revocation, or observation time. | `unresolvable` | Time-sensitive claim is `indeterminate`. | Missing time becomes timeless validity. |

## 6. Non-Authority Boundary

Temporal evaluation limits claims. It does not create, renew, revoke, or enforce authority. Guard records the evidence basis and its status; external authority sources and decision owners retain authority.
