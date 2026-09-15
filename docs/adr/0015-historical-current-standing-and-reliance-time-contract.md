# ADR 0015: Historical/current standing and reliance-time contract

- Status: B07 specification decision, 2026-09-15; SPECIFICATION_ONLY.
- Contract: `temporal-standing-evaluation/0.1`, auxiliary/versioned; no temporal enum migration.
- Depends on [B01](0010-mesr-canonical-id-relation-and-admission-contract.md), [B02](0011-mesr-claim-nonclaim-state-and-binding-contract.md), [B05](0013-independent-verification-and-integrity-evidence-contract.md).

## Current source and immutable history

[temporalBasis.ts](../../packages/guard-core/src/mesr/temporalBasis.ts) validates offset timestamp shape, allowed supplied statuses, basis_valid_at and provenance presence for current. It does not recompute revocation, expiry, supersession or continuity. [Coverage](../../packages/guard-core/src/inspectEvidenceCoverage.ts) emits TIME_WINDOW_EXPIRED when a provided end_at is strictly earlier than pack.created_at, after checking that both window endpoints exist. It does not use the present clock or intended reliance time. This predicate, its comparison boundary and its [reason binding](../../packages/guard-core/src/mesr/reasonCodeBindings.ts) remain unchanged despite the latter's evaluation-time wording.

[CB-15/16/18](../../packages/guard-core/src/mesr/claimBoundaries.ts) distinguish historical standing, changed context and approval reuse. Existing evidence, approvals, receipts, license history, Experiment 2B reviewer packages and historical decisions are immutable evidence of their original context. A new current-standing record references them by exact identity/version/digest; it never rewrites or retroactively invalidates them. Offline license authority is not repurposed as a semantic authority or revocation service.

## Time and basis contract

Every future evaluation records claim/canonical version, immutable historical_basis_refs, subject revision, scope, registry/version/digest, module lock, method version, evaluation_time, reliance_time, temporal rules and their provenance, available snapshot coverage, evidence refs, dimension results, primary state and missing obligations. Required values use B02 predicates, not presence alone.

- event_time: occurrence asserted by the original event evidence.
- created_at/generated_at: original artifact creation; not evaluation or verification time.
- evaluation_time: explicit instant at which this bounded evaluation is performed using the recorded knowledge snapshot.
- reliance_time: explicit instant for which applicability is requested. It may equal evaluation_time only when explicitly requested, never by a hidden clock fallback.
- observed_at/verified_at: attributed collection/check times, retained separately from effective dates and ingestion time.
- effective_from/effective_until: source/rule-defined applicability boundaries, including timezone, endpoint inclusivity and applicable scope.

Normalize valid offset timestamps to instants for comparison while retaining original values. Missing/ambiguous timestamps, timezone, applicable interval rule or tolerances yields UNRESOLVED. This contract's default interval convention is [effective_from, effective_until) only when the admitted rule explicitly adopts it; a source's different explicit convention is retained. No rounding or grace period is inferred. Legacy TIME_WINDOW_EXPIRED keeps its existing strict comparison regardless.

## Explicit applicability dimensions

| Dimension | Required basis and deterministic rule | Missing or lost applicability |
|---|---|---|
| Freshness | Versioned claim-specific max-age rule, relevant observed/verified instant, target reliance_time, scope and limitations | Age without an applicable rule is UNRESOLVED; beyond explicit allowable age is STALE |
| Expiry | Attributed validity interval with endpoint convention and bound subject/scope | Proven reliance outside formerly valid interval -> STALE; missing interval/currentness basis -> UNRESOLVED |
| Revocation | Attributable revocation/status evidence, issuer/authority scope, subject, effective time, source snapshot and coverage horizon | Applicable effective revocation -> STALE for subsequent reliance; no record alone cannot establish non-revocation |
| Supersession | B01 admitted successor/predecessor identities/versions/digests plus effective applicability rule | Explicit displacement for requested reliance -> STALE; mere successor existence does not displace old meaning |
| Revalidation | New attributable check/event/result, subject/context/time, method, custody/independence if required and explicit applicability link | Successful new basis evaluated separately; no timestamp refresh on the old record; mere revalidation label -> UNRESOLVED |
| Subject continuity | Exact revision/artifact binding, or an admitted equivalence/rebinding proof | Proven incompatible change -> STALE for reused basis; missing equality/change evidence -> UNRESOLVED |
| Scope continuity | Same bounded action/resource/claim scope or explicit compatible projection proof | Changed beyond old scope -> STALE; unspecified scope -> UNRESOLVED |
| Environment continuity | Captured old/current environment identities/digests and materiality rule for changed settings | Proven material change -> STALE; absent current snapshot or comparison -> UNRESOLVED |
| Policy continuity | Old/current applicable policy versions/digests, effective dates and compatibility decision | Proven material rule change displacing reliance -> STALE; differing version string without impact proof -> UNRESOLVED |
| Dependency continuity | Old/current dependency lock/artifact identities and named impact criterion | Proven material dependency drift -> STALE; no lock/equality basis -> UNRESOLVED |
| Authority rebinding | Applicable principal/authority provenance, action/target/purpose/scope/time binding, continuity/re-establishment evidence and limitations | Old authority evidence alone -> UNRESOLVED; established lost scope/revocation -> STALE; independently evaluated rebind may support new basis only |
| Review/approval reuse | Original review event/result plus subject/scope/context continuity and currently applicable reviewer/acceptance authority as required | Reuse unsupported from mere old approval; missing currentness -> UNRESOLVED; explicit loss -> STALE. Review occurrence and acceptance stay separate |

A not-yet-effective basis does not establish historical validity: evaluate its applicability under the named criterion without inventing a formerly valid interval. STALE requires preserved historical support plus proven loss for the requested reliance context, per B02. An explicitly excluded inference (old approval alone -> current acceptance) is UNSUPPORTED for that path; the wider current-acceptance question can be UNRESOLVED.

## Offline currentness and state selection

No online revocation, identity or authority service is assumed or called. A supplied snapshot must identify its publisher, covered subjects/status categories, as-of time, effective periods, completeness claims and permissible reliance horizon under the admitted method. Absence of a revocation record in an incomplete snapshot is not a non-revocation fact. A target later than the available coverage horizon remains UNRESOLVED unless a separately evidenced prospective validity rule covers it; that limited result never guarantees no later revocation.

Historical valid != standing.current. created_at != evaluation_time. Old approval != current acceptance. Old authority evidence != current authority.

Use exactly B02's six states and precedence: applicable inference prohibition -> UNSUPPORTED; comparable admissible contradiction -> CONFLICTED; explicit lost applicability -> STALE; missing necessary currentness basis -> UNRESOLVED; then completed positive/non-support/undecidable evaluation -> SUPPORTED/UNSUPPORTED/INCONCLUSIVE. A sole revocation record is not automatically CONFLICTED with an older approval: both can be valid at different times. Missing collateral data is retained even when proven loss selects STALE.

## Acceptance and preserved behavior

[Temporal cases](../validation/v8-b07-temporal-standing-cases-v0.1.md) specify falsifiers. B07 = PASS for the temporal contract and validation design only; no temporal evaluator, TIME_WINDOW_EXPIRED, license/receipt behavior or historical fixture changes. B03 unavailable event/authority/time facts remain unavailable; no time or current authority may be fabricated from Harness metadata.

Audit output / verdict / exit and deny 25 unchanged; permit/classify unchanged; recommendation-only, additive-only, non-executing, default-off; no authority scope expansion. Gate 1 remains BLOCKED. B09/B10 are pending and not started.
