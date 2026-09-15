# B09 implementation gap ledger

**B09 OUTPUT ONLY. B10 NOT STARTED. Gate 1 BLOCKED.**

Six source-localized gaps form a proposed minimum dependency order for later review. This is not implementation/gate authorization.

## G08 ? recommended order 1

- Contract source: **B01 / B08**.
- Current source: packages/guard-core/src/mesr/moduleManifest.ts.
- Observed case IDs: C02, C05, C06.registry, C07, C09, C10, C11, C12, C13, C14, C15.source, C15.profile, C19, C20.producer, C20.consumer, C20.malformed, C21.>=0.1.0, C21.latest, C21.0.1.0-rc.1, C21.01.1.0, C22.array, C22.raw, C23, C24, C25, C26.supersedes, C26.refines, C26.stronger_than, C26.weaker_than, C27.
- Current behavior: Bounded current resolver lacks full locks, duplicate-ID and semantic noninterference validation.
- Required repaired behavior: Add separately admitted opt-in exact version/digest/semantic validation with atomic failure; retain old resolver behavior/diagnostics.
- Minimum implementation surface: Auxiliary lock validator and proofs; no scheduler, distribution service or new module types.
- Compatibility risk: Medium: stricter checks must not replace current default semantics.
- Required tests: C01-C27, full zero-entry failure, permutations, Core nonclaim/binding probes.
- EvidencePack migration: **NO**; separate evidence/receipt contracts.
- Reason-code migration: **NO**; preserve values, order and emitters.
- Report migration: **NO**; preserve model 1.0.0 and outward references.
- Public CLI/API migration: **NO**; existing APIs unchanged, auxiliary surfaces need separate admission.
- Reversibility: Disable/remove a later opt-in path while preserving original records and legacy behavior; no data rewrite or authority transfer.


## G02 ? recommended order 2

- Contract source: **B01 / B02**.
- Current source: packages/guard-core/src/mesr/supportEvaluator.ts.
- Observed case IDs: N01, N03, N04, N05, N06a, N06b, N07, N08, N10, N12.complete, N12.missing, N18, I01, I05.failed, I05.skipped, I08, I09, I10, I11, I12.subject, I12.scope, I12.time, I13, I14.complete, I14.missing, I16, I17, I18, S04, S05, S07.omit, S07.false, S07.empty, S08.conflict, S10, S11.mismatch, S11.absent, S13, T01, T02.at, T03, T04, T05, T06, T08, T09.subject, T09.scope, T10, T11, T12.policy, T12.dependency, T13.policy, T13.dependency, T14, T15, T18.evaluation_time, T18.reliance_time, T19, T20, T21.complete, T21.missing, T22.rule, T22.absent, T23, T24.timezone, T24.interval, T26.complete, T26.missing, E3-A.ci.execution_only, E3-A.harness_style.execution_only, E3-B.absent, N08.predicate_override, I10.unresolved_ref, E3-A.actual_harness_gaps.
- Current behavior: Caller requirement lists/positive parts and presence checks do not implement repaired binding/state semantics.
- Required repaired behavior: Versioned per-claim side evaluation with immutable requirement union, predicates, path-scoped nonclaims and six-state precedence.
- Minimum implementation surface: Separate repaired evaluation over canonical identities and admitted facets, preserving legacy enums.
- Compatibility risk: High if old values/main-path semantics are overwritten; additive side evaluation avoids migration.
- Required tests: N01-N18, false/empty/unknown/nonclaim/conflict controls and preserved CB-22.
- EvidencePack migration: **NO**; separate evidence/receipt contracts.
- Reason-code migration: **NO**; preserve values, order and emitters.
- Report migration: **NO**; preserve model 1.0.0 and outward references.
- Public CLI/API migration: **NO**; existing APIs unchanged, auxiliary surfaces need separate admission.
- Reversibility: Disable/remove a later opt-in path while preserving original records and legacy behavior; no data rewrite or authority transfer.


## G05 ? recommended order 3

- Contract source: **B03 / B05**.
- Current source: packages/guard-core/src/evidenceAssuranceKernel.ts; packages/guard-core/src/mesr/producerAdapters/semanticProjection.ts.
- Observed case IDs: N01, N02, N05, N07, N08, N09, N11.subject, N11.time, N12.complete, N12.missing, N15, N17.failed, N17.skipped, N18, I01, I02, I03, I04, I05.failed, I05.skipped, I06, I07, I08, I09, I10, I11, I12.subject, I12.scope, I12.time, I13, I14.complete, I14.missing, I15, I16, I18, S13, E3-A.ci, E3-A.ci.execution_only, E3-A.harness_style, E3-A.harness_style.execution_only, E3-B.absent, E3-B.producer, N08.predicate_override, I10.unresolved_ref, E3-A.actual_harness_gaps.
- Current behavior: Some verified/nonempty-check and digest/subject paths infer stronger independence/integrity without complete basis.
- Required repaired behavior: Separate occurrence/result/independence/custody/integrity via attributable events and exact bytes; retain unresolved missing basis.
- Minimum implementation surface: Auxiliary event/principal/separation/custody/comparison contracts and opt-in projection.
- Compatibility risk: High if PoC labels/snapshots change in place.
- Required tests: I01-I18, N02/N15/N17, byte mismatch/domain and producer-only/world-level distinctions.
- EvidencePack migration: **NO**; separate evidence/receipt contracts.
- Reason-code migration: **NO**; preserve values, order and emitters.
- Report migration: **NO**; preserve model 1.0.0 and outward references.
- Public CLI/API migration: **NO**; existing APIs unchanged, auxiliary surfaces need separate admission.
- Reversibility: Disable/remove a later opt-in path while preserving original records and legacy behavior; no data rewrite or authority transfer.


## G07 ? recommended order 4

- Contract source: **B02 / B07**.
- Current source: packages/guard-core/src/mesr/temporalBasis.ts; packages/guard-core/src/inspectEvidenceCoverage.ts.
- Observed case IDs: N06a, N06b, N14, I10, I17, T01, T02.at, T02.before, T03, T04, T05, T06, T07, T08, T09.subject, T09.scope, T10, T11, T12.policy, T12.dependency, T13.policy, T13.dependency, T14, T15, T16, T17, T18.evaluation_time, T18.reliance_time, T19, T20, T21.complete, T21.missing, T22.rule, T22.absent, T23, T24.timezone, T24.interval, T25.equal, T25.earlier, T26.complete, T26.missing, T27.
- Current behavior: Shape/status checks and created_at expiry do not establish requested current standing.
- Required repaired behavior: Evaluate explicit reliance/snapshot/continuity/rebinding while preserving historical records and legacy expiry.
- Minimum implementation surface: Default-off temporal side evaluation over immutable history and explicit offline evidence.
- Compatibility risk: Medium: preserve licensing/offline authority, expiry and receipt semantics.
- Required tests: T01-T27, boundary instants, future reliance, currentness gaps and stale/conflict precedence.
- EvidencePack migration: **NO**; separate evidence/receipt contracts.
- Reason-code migration: **NO**; preserve values, order and emitters.
- Report migration: **NO**; preserve model 1.0.0 and outward references.
- Public CLI/API migration: **NO**; existing APIs unchanged, auxiliary surfaces need separate admission.
- Reversibility: Disable/remove a later opt-in path while preserving original records and legacy behavior; no data rewrite or authority transfer.


## G06 ? recommended order 5

- Contract source: **B02 / B06**.
- Current source: packages/guard-core/src/generateGovernanceReport.ts; packages/guard-core/src/evidenceAssuranceKernel.ts.
- Observed case IDs: N13, N16.allow, N16.block, S01, S02.profile_id, S02.claim_set_id, S02.scope, S02.evaluation_time, S02.evidence_refs, S02.material_gap_result, S03.registry, S03.method, S03.module_lock, S04, S05, S06, S07.omit, S07.false, S07.empty, S08.conflict, S08.stale, S09, S10, S11.mismatch, S11.absent, S12, S13, S04.label_only, S04.bad_profile_digest.
- Current behavior: Legacy allow is rule fallthrough/structural wording, not profile-bound sufficiency.
- Required repaired behavior: Separately admitted sufficiency side artifact with full profile/claim bindings and outward report identity/digest link.
- Minimum implementation surface: Opt-in standalone evaluator/consumer contract; no report 1.0.0 injection.
- Compatibility risk: Medium: do not strengthen allow or inject report/index/renderer fields.
- Required tests: S01-S13, gap/missing/undecidable distinction and exact legacy report bytes.
- EvidencePack migration: **NO**; separate evidence/receipt contracts.
- Reason-code migration: **NO**; preserve values, order and emitters.
- Report migration: **NO**; preserve model 1.0.0 and outward references.
- Public CLI/API migration: **NO**; existing APIs unchanged, auxiliary surfaces need separate admission.
- Reversibility: Disable/remove a later opt-in path while preserving original records and legacy behavior; no data rewrite or authority transfer.


## G03 ? recommended order 6

- Contract source: **B03**.
- Current source: docs/architecture/harness-to-canonical-evidencepackv1-closure-v0.1.md.
- Observed case IDs: I16, S13, T27, E3-A.ci.execution_only, E3-A.harness_style.execution_only, E3-A.actual_harness_gaps.
- Current behavior: Actual Harness counts/exit/flags cannot supply every canonical owner/authority/event/provenance fact; current adapters target different contracts.
- Required repaired behavior: Preserve gaps; admit sourced supplementary facts and closure receipts only in a later scoped integration after canonical validation.
- Minimum implementation surface: Prerequisite supplementary-evidence/fixture closure; future adapter conditional on facts and gates.
- Compatibility risk: High if defaults fabricate facts or casts bypass validation.
- Required tests: E3-A actual Harness/execution-only, I16, S13, T27 and B03 rejected/missing/structural handoff.
- EvidencePack migration: **NO**; separate evidence/receipt contracts.
- Reason-code migration: **NO**; preserve values, order and emitters.
- Report migration: **NO**; preserve model 1.0.0 and outward references.
- Public CLI/API migration: **NO**; existing APIs unchanged, auxiliary surfaces need separate admission.
- Reversibility: Disable/remove a later opt-in path while preserving original records and legacy behavior; no data rewrite or authority transfer.


## Cross-gap constraint

Any future requirement that cannot retain the NO-migration boundary must return for a separate compatibility decision. G03 has a real missing-fact dependency, not merely an adapter-code gap. No general platform, IAM, live revocation service, producer marketplace or control-plane program is proposed.

Audit output / verdict / exit unchanged; deny exit code 25 unchanged; permit behavior unchanged; classify behavior unchanged. Recommendation-only, additive-only, non-executing, default-off where applicable; no authority scope expansion. No control-plane, dashboard or orchestration drift. CLI/JSON, licensing/offline authority, install and demo paths unchanged.
