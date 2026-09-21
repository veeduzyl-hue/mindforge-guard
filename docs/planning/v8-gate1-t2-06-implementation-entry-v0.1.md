# T2-06 Profile-Bound Sufficiency - Implementation Entry Dossier v0.1

Documentation-only entry review, 2026-09-21. Task: T2-06, Tranche 2, G06.

## 1. Checkpoint and disposition

Verified before dossier creation:

```text
branch = planning/v8-gate1-tranche2-g06-v0.1
starting_HEAD = bf97b2c132b2702a2910225368d7736cfecbccb0
worktree = CLEAN
accepted_G06_planning = G06_IMPLEMENTATION_PLANNING_READY_WITH_BLOCKERS
```

The entry blocker is insufficiently defined deterministic assurance-profile criteria. B06 specifies required identities, full requirement/materiality coverage and outcome constraints, but the permitted authoritative sources do not supply an admitted profile/claim-set instance or a complete private criterion defining requirement classification, applicability, exclusions and materiality. Those missing rules cannot be manufactured from labels, expected test results, or the existing structural `sufficiency` fields.

Facet ownership is determinate. Existing predecessor methods provide source-grounded reconstruction and private-reader routes. A separate integration issue also remains: the canonical seven paths cannot discharge the owner's unconditional sufficiency placeholder. This dossier neither authorizes scope expansion nor claims that an evaluator-only expansion would resolve the profile blocker. No frozen contradiction was found; no specification reopening is requested.

Only this dossier may change. No product implementation, fixture creation, verifier modification, implementation suite, T2-07 design work or G03 integration is performed. V8-000, Tranche 1, T2-01 through T2-05, G05/G07 and the accepted G06 decomposition remain accepted history.

## 2. Bounded authority

- [Canonical plan](21_GATE1_IMPLEMENTATION_PLAN.md): sections 2/3 and T2-06; T2-07 only for the standalone/report boundary.
- [ADR 0014 / B06](../adr/0014-profile-bound-evidence-sufficiency-and-report-boundary.md), especially Required contract and outcome; [side-artifact specification](../architecture/evidence-sufficiency-side-artifact-v0.1.md), Closed documentation schema and Evaluation contract.
- [ADR 0011 / B02](../adr/0011-mesr-claim-nonclaim-state-and-binding-contract.md): binding union, atomic/composite evidence and six-state precedence.
- [ADR 0013 / B05](../adr/0013-independent-verification-and-integrity-evidence-contract.md): only profile-required verification, integrity, independence and custody dimensions.
- [ADR 0015 / B07](../adr/0015-historical-current-standing-and-reliance-time-contract.md): only required temporal applicability, continuity and rebinding.
- [ADR 0016 / B08](../adr/0016-mesr-module-version-lock-and-noninterference-contract.md): the card's directly cited lock/composition and presentation-profile boundaries.
- [Gate 1 change control](22_GATE1_CHANGE_CONTROL_CONTRACT.md).
- Protected implementation references: [evaluateClaim.ts](../../packages/guard-core/src/mesr/repaired/evaluateClaim.ts), [claimState.ts](../../packages/guard-core/src/mesr/repaired/claimState.ts), [requirements.ts](../../packages/guard-core/src/mesr/repaired/requirements.ts), [contracts.ts](../../packages/guard-core/src/mesr/repaired/contracts.ts).

Predecessor source and accepted evidence were inspected only for retained-witness/private-reader joins. Their old phase-local status wording does not reopen the accepted current state. The existing Core entry and canonical digest helper were inspected solely to pin the requested anchor; no registry admission or product evaluation was performed.

## 3. Exact owned evaluation subject

```text
canonical_anchor = mesr.core.claim.claim
canonical_version = 0.1.0
canonical_entry_content_digest_algorithm = SHA-256
canonical_entry_content_digest = 839d8b89b8eb79abea1001ef523b7c8e614206be47b158f5dc55b65eec13a28b
requested_facet = evidence.sufficient
test_path = sufficiency
```

Digest domain: the complete existing Core entry serialized by `canonicalJson` in `repaired/canonicalBytes.ts`; code-point key order, original array order, UTF-8 without BOM or trailing newline, 501 bytes. Measured using the existing `contentDigest` function at the starting HEAD. This is an entry-content digest, not a registry digest, profile digest or proof of sufficiency.

`requirements.ts` explicitly recognizes this facet on this anchor and adds `evidence_refs`. The anchor retains its `claim_identity` support and `claim_truth_without_evidence` / `claim_support_without_evidence` nonclaims. Neither the facet nor path is a new canonical ID or alias.

The task-local evaluation identity must retain the following complete tuple. These are frozen binding requirements, not fabricated instance values:

| Binding | Entry disposition |
|---|---|
| Subject/revision/artifact references | Exact retained subject ID, revision and associated artifacts; no actual evaluation instance supplied here |
| Scope | Explicit included/excluded members and environment reference; no universal scope or guessed environment |
| evaluation_time | Explicit supplied offset instant; no actual instance value frozen |
| Intended reliance_time | Explicit distinct instant, or explicit declaration that evaluation_time is the target; no clock/generated_at substitution |
| Evidence basis | Source-pack reference/schema/exact-byte digest and typed attributable references; originals and transformations retained |
| Profile | ID/version/content digest plus retained source, applicability and limitations; concrete content and values NOT ESTABLISHED |
| Claim set | ID/version/content digest and frozen nonempty claim/requirement inventory; concrete content and values NOT ESTABLISHED |
| Semantic/method basis | Exact registry/Core/contributing-module locks and method ID/version/digest, separately attributable admission basis |

The missing profile instance and rules are a profile-criteria blocker, not ambiguity about the resolved anchor/facet/path. No implementation pre-change HEAD is designated.

## 4. Assurance-profile semantics and unresolved criteria

An admitted assurance profile is retained, immutable evaluation criteria over already admitted meanings. It is not a fifth semantic module type, a presentation-only `institutional_profile`, or a registry extension. A digest verifies a particular representation only after recomputation; its presence does not validate criteria, provenance or applicability.

Minimum retained profile identity: profile ID, exact version, content digest with algorithm/domain, attributable source/provenance, scope/applicability, limitations/nonclaims, and linked claim-set ID/version/digest. The complete content must be retained and matched to the digest. Claim references preserve canonical ID/version, requested facet/path, subject/scope and requirements; a claim-set ID alone is insufficient.

| Topic | Source-grounded rule | Missing implementation-entry detail |
|---|---|---|
| Mandatory requirements | All applicable mandatory claims and the B02 Core/entry/context/caller union remain required | Concrete requirement inventory and deterministic applicability/classification rules |
| Optional requirements | No source authorizes an optional label to subtract an inherited obligation | Admitted optional classification and its exact consequences; absence must not be guessed |
| Permitted exclusions | Explicit scope exclusions/nonclaims retained; omission cannot hide required claims | Profile-specific exclusion conditions, evidence predicates and limits |
| Materiality | Every frozen requirement evaluated under a named retained criterion; non-materiality needs explicit rule and evidence | Actual material/non-material/exclusion decision procedure and coverage obligations |
| Applicability | Profile must apply to pinned subject/revision, scope/environment and requested times; missing basis is UNRESOLVED | Deterministic admission/applicability conditions for this profile |
| Claim/facet references | Resolve admitted identity/version and frozen claim set; unknown semantics never silently disappear | Exact list and criterion-to-claim/dimension mapping |
| Currentness | B07 only when applicable requirements demand it; retain original witnesses and both times | Which claims/dimensions require which admitted temporal/continuity methods |
| Limitations/nonclaims | Preserve Core and applicable module exclusions and profile limits | Profile-specific retained limits, without widening Core meaning |

B06 explicitly requires deterministic, separately validated criteria before execution is admitted. The supplied sources specify a contract for such criteria; they do not supply the missing profile-specific rules. This entry does not create a generic public profile language, risk score, universal materiality policy, implicit default profile or test-derived policy.

To remove this blocker, a later bounded entry must retain one concrete private profile/claim set and named deterministic criteria with provenance, digest domains, explicit applicability, requirement classifications, permitted exclusions, full materiality coverage and positive/negative/undecidable decision conditions. Existing predecessor requirements cannot be relaxed to fit it. No ADR/oracle rewrite is implied by completing that private detail.

## 5. Closed envelope: resolved boundary and remaining detail

Use B06's exact documentation envelope identifier `guard-evidence-sufficiency-side-artifact/0.1`. It is separate from EvidencePackV1 and the public report. The following minimum is source-defined; it is not a newly installed schema or complete admitted private API:

| Envelope field | Retained basis / validation |
|---|---|
| schema_version; artifact_id | Exact schema identifier; nonempty producer record ID, never proof |
| source | pack_ref, pack_schema_version, pack_digest; report_reference null on the standalone path |
| subject | subject_id, revision, associated artifact_refs |
| profile_id/version/digest | Resolve exact retained profile content and source; never latest |
| claim_set_id/version/digest | Resolve frozen nonempty claim inventory and all required members |
| scope | included, excluded, environment_ref; explicit empty exclusions only when defined |
| evaluation_time; reliance_time | Supplied offset timestamps and explicit reliance target as above |
| evidence_refs | Typed ref_id/source_ref/source_pointer/digest/subject_ref/scope_ref/event_time/role records; nonempty sufficient basis required |
| registry; module_lock | Exact registry version/digest, Core and contributing module versions/content; B08 atomic admission, zero entries from invalid composition |
| method | method_id/version/digest for frozen deterministic sufficiency/materiality criteria; concrete method not admitted by this entry |
| material_gap_result | status, criterion_ref, evaluated_requirement_ids, gaps, evidence_refs; four dimension statuses: no_material_gap/material_gap/unresolved/inconclusive |
| claim_results | Per-claim canonical ID/version, subject/scope, derived state, evidence_refs, missing_bindings, applied_nonclaims, rationale; all required claims represented |
| primary_state | Output of existing owner only, exactly six B02 states |
| missing_bindings | field/predicate_ref/reason/source_ref; no silently omitted required basis |
| applied_nonclaims; limitations | Attributed exclusions and nonempty limitation statements |
| provenance | producer_ref/evaluator_ref/input_set_id/input_digest/transformation_refs/generated_at; absent facts explicit, generated_at distinct from evaluation_time |

Preserve B06's expressly allowed nulls with matching missing-binding diagnostics. Unknown envelope keys/types are artifact-validation errors, not a seventh state. Missing semantic basis in a well-formed diagnostic envelope is UNRESOLVED subject to stronger precedence. Typed digests require an admitted algorithm, valid syntax and exact byte/content domains; mutable or self-authored locks do not confer admission.

`claim_results`, `primary_state` and material-gap determinations are derived outputs. Serialized fields carrying these names are not authenticated input evidence. The current `contracts.ts` `sufficiency.atomic_results` array is a shape check, not a sufficiency contract or result-authentication route.

The private intake needs retained profile/claim-set/method records, requirement-coverage and gap witnesses, and predecessor original-envelope references with separate private handles. Existing nested evidence-ledger records and private arguments offer a candidate transport without changing `contracts.ts`; a closed private grammar cannot be declared fully frozen while the required profile criteria remain unspecified. No EvidencePackV1 field or public profile schema is added.

For later replay, retain input bytes, digest representations/lengths, all semantic/profile/claim-set/method pins, both requested times and supplied generation metadata. Preserve event/evidence array order; canonicalize keys and explicitly set-valued diagnostics per the admitted method. No hidden clock, process identity or memory address belongs in serialized output.

## 6. Predecessor evidence consumption and joins

The source-grounded routes are B (fresh reconstruction from retained witnesses) and A (consume resulting private receipts/findings through existing readers). Authentication here proves product computation over supplied records, not actor authentication, world truth or authority. No inspected contract authorizes option C, accepting a serialized result by its hash alone.

| Predecessor / what is needed | How T2-06 can obtain it without changing the predecessor | Required joins and limits |
|---|---|---|
| T2-01: attributable verification occurrence/result where required | Re-run `evaluateVerificationEvent` in [verificationEvent.ts](../../packages/guard-core/src/mesr/repaired/verificationEvent.ts) on retained native records. For canonical results, supply its existing separate claim context and consume the actual returned owner results. No private T2-01 receipt reader exists. | Native namespace/event ID/reference, subject/revision/scope, property, method/version, criterion, event time, producer/verifier, retained input/output/result refs and limitations. Canonical context retains Core/trust/requirements/evaluation time; competing results require the complete retained candidate-set ref. An annotation or pass label is neither independence nor sufficiency. |
| T2-02: exact-byte equality where required | Fresh `compareExactBytes`, then `readIntegrityReceipt` in [integrity.ts](../../packages/guard-core/src/mesr/repaired/integrity.ts), using original input/path/contexts. | Reader checks process-local receipt identity and exact input/context snapshots/path. Method checks actual bytes, length, expected source/digest, member namespace, representation/domain, subject/revision/scope/time and checker/method/event/output associations. Join that exact member to the profile obligation. Equality does not establish authenticity, truth or custody. |
| T2-03: independence/custody where required | Fresh `evaluateIndependence`, with original T2-02 receipts, then `readIndependenceFinding` in [independence.ts](../../packages/guard-core/src/mesr/repaired/independence.ts). | Original input/Core/trust/contexts/collected requirements and exactly requested path/facet/version. Retained principals, identity checks, separation policy/control/conflict facts, successful T2-01 check, all custody stages and exact member receipt joins. Its admitted representation remains canonical-json-utf8 / supplied-verification-content. Different labels or matching bytes do not establish separation/custody. |
| T2-04: temporal applicability where required | Fresh `evaluateTemporalApplicability`, then `readTemporalApplicabilityFinding` in [temporalApplicability.ts](../../packages/guard-core/src/mesr/repaired/temporalApplicability.ts), with required original historical T2-02/T2-03 channels. | Original full input/Core/trust/contexts/collection/path, standing.current on temporal anchor/version, subject/revision/scope and both explicit times. Historical T2-01 witness digest/event joins, historical member/independence witnesses, policy/rule, intervals, freshness, snapshot/horizon and scoped status records remain required by that method. Currentness does not imply continuity or current authority. |
| T2-05: continuity/rebinding where required | Fresh `evaluateContinuity`, then `readContinuityFinding` in [continuity.ts](../../packages/guard-core/src/mesr/repaired/continuity.ts), using separate historical/current/revalidation T2-04 handles as applicable. | Exact original full input/Core/trust/contexts/collection and owned path. Old/current subject/revision/scope, artifacts, environments, policies, dependency locks, authority evidence, material-change criteria and both times. Every nested temporal handle is read in its original envelope; any direct T2-04 channel must agree with the authenticated current join. Rebinding supplies evidence, never creates authority or acceptance. |

Never rename a predecessor path to `sufficiency`, alter its original revision/time, or pass a profile-level input in place of the reader's original envelope. Retain explicit references joining each predecessor obligation to its claim-set member, subject/artifact, scope and relevant event/evaluation/reliance times. Different event times are not forced equal to evaluation time; historical/current transitions require the already admitted temporal/continuity proof.

`evaluateClaim.ts` registers genuine immutable claim objects in a private WeakSet; `evaluateCompositeClaim` verifies identity, required paths and subject/scope/evaluation-time joins. Copies/JSON reconstructions do not regain registration. This is a useful existing authenticity boundary, not a complete profile evaluator: it does not validate profile applicability or materiality. T2-06 must obtain facts through product computation/readers, not accept caller-authored child states or `StateBasis`.

Profile requirement -> added obligation. T2-01 through T2-05 are not universally mandatory. Selecting an existing method also retains that method's prerequisites: for example the accepted T2-04 historical method requires successful verification, integrity and independence; a profile cannot switch those prerequisites off. The exact per-profile obligation map remains part of the criteria blocker. Missing witnesses remain missing rather than being synthesized from predecessor result hashes.

## 7. Materiality, no_material_gap and claim-set completeness

B06 defines requirement-level traceability with a profile-wide complete evaluation: each gap names requirement_id, materiality rule, missing/unsatisfied predicate and evidence refs. `evaluated_requirement_ids` must cover the entire frozen requirement list. Claim- and evidence-dimension obligations participate through that list; the sources do not define an independent generic per-claim/per-dimension score or weighting model.

| Case | Frozen contract constraint |
|---|---|
| Material gap | Traceable unfulfilled material requirement under a completed admitted criterion; bounded non-support, not software unsafe/world false |
| Non-material gap | Retain gap and explicit profile rule plus evidence supporting non-materiality; cannot erase an independently mandatory obligation |
| Permitted exclusion | Retain explicit scope/profile authority and evidence for exclusion; never subtract Core/context/caller obligations |
| Complete coverage | Every frozen requirement accounted for and its applicability/materiality evaluated under the bound method; a count or labels are insufficient |
| no_material_gap | Complete requirement/materiality evaluation, justified non-material/exclusion decisions, and no material gap; never inferred solely from an empty gaps array |

These constraints are frozen. The concrete profile's classification/decision procedure is not established. Missing materiality coverage or criterion yields UNRESOLVED subject to stronger precedence; complete applicable but undecidable evaluation yields INCONCLUSIVE. All mandatory claims SUPPORTED still cannot discharge the independent applicability, binding and materiality obligations.

| Claim-set situation | Handling |
|---|---|
| Hidden or missing required claim | Retain it from the frozen inventory; unresolved requirement, never filter it out based on presentation |
| Duplicate claim | Existing duplicate request path/claim is input rejection (`DUPLICATE_CLAIM_PATH`); duplicate composite matches do not satisfy the part. No first/last wins. Exact future claim-set-key validation still depends on the admitted private grammar. |
| Unknown claim | Unresolved semantic identity is retained; malformed/disallowed path is validation rejection. Unknown semantics cannot contribute support or disappear. |
| Required UNSUPPORTED | Preserve applicable prohibition or completed non-support basis; propagate through the same owner precedence |
| Required CONFLICTED | Preserve comparable admissible contradictory facts and provenance; no majority decision |
| Required STALE | Preserve historical support and proven loss for the requested reliance context |
| Required INCONCLUSIVE | Retain complete applicable undecidable basis; do not relabel missing evidence as inconclusive |
| Required SUPPORTED | Necessary component only; profile sufficiency additionally requires all other obligations |
| Extra non-required claim | Cannot replace a required member or establish completeness. Existing composite treats an unrequested child as missing-obligation diagnostic; no source authorizes silently ignoring it to pass. Freeze a separate admitted handling rule before broadening that behavior. |

The side artifact must preserve claim-set ID/version/digest, all required results and their evidence/diagnostics. There is no authorized visible-claim-only completeness rule.

## 8. Existing state owner and exact mapping

`claimState.ts` defines the six-state enum and `StateBasis` type. The single selector is private to `evaluateClaim.ts`. Its actual order is retained:

| Order | Attributable basis | Primary state |
|---|---|---|
| 1 | Applicable prohibited inference | UNSUPPORTED |
| 2 | Comparable admissible conflict | CONFLICTED |
| 3 | Historically supported required basis with proven current applicability loss | STALE |
| 4 | Missing/unsatisfied mandatory evidence, criterion, identity, binding, applicability or materiality coverage | UNRESOLVED |
| 5 | Complete bounded non-support, including a completed explicit material-gap determination | UNSUPPORTED |
| 6 | Complete applicable admitted method unable to decide | INCONCLUSIVE |
| 7 | Complete positive profile-bound basis | SUPPORTED |
| Fallback | No admitted determination | UNRESOLVED |

Retain all collateral diagnostics under stronger states. Positive facts cannot mask missing, negative or undecidable facts. Support requires every applicable required claim SUPPORTED, all bindings satisfied, profile applicability established, complete materiality evaluation and no_material_gap, with no stronger blocker. Missing evidence does not default to sufficient=false. No selector copy, second selector or seventh state is admitted.

## 9. Integration finding and conditional private handoff

Verified source: `evaluateClaims` currently has eight parameters (the last four are integrity, independence, temporal and continuity private channels). Its `evidence.sufficient` branch unconditionally adds `profile_bound_sufficiency_basis`, then checks the presence of six structural sufficiency fields. No valid private sufficiency intake exists. Generic state proofs do not admit a sufficiency criterion. A new `sufficiency.ts` alone cannot remove that placeholder through an authorized route.

Canonical seven-path scope sufficient: **NO**.

```text
packages/guard-core/src/mesr/repaired/sufficiency.ts
scripts/verify_v8_gate1_product_conformance.mjs
scripts/gate1/b09-product-inputs.mjs
scripts/gate1/b09-product-compare.mjs
tests/fixtures/gate1/t2-06-controls.v0.1.json
tests/fixtures/gate1/t2-06-results.v0.1.json
docs/validation/v8-gate1-t2-06-evidence-v0.1.md
```

Minimum observed additional candidate: `packages/guard-core/src/mesr/repaired/evaluateClaim.ts`. This is a conditional candidate for a separate bounded scope review after criteria are resolved, not an approved eighth path or a proof of complete implementation readiness. No need to change an additional protected path has been established. If one becomes necessary, identify the first path and stop instead of progressively widening scope.

Candidate flow, conditional on later admitted criteria and scope review:

```text
retained profile / claim set / original predecessor witnesses and fresh handles
  -> sufficiency.ts validates closed input and computes bounded factual dimensions
  -> private immutable context-bound profile-sufficiency finding
  -> evaluateClaim.ts authenticates the exact finding and owned request
  -> existing factual basis arrays
  -> existing private selector
```

Use the predecessor private-identity pattern: module-private registration of product-created deeply frozen findings, read only by original identity and exact full context. Bind full input, retained profile/claim-set/method content and digests, Core/trust/registry/module basis, collected requirements, subject/revision/artifacts/scope/environment, both times, original predecessor inputs/contexts/paths and authenticated facts. Forge/copy/JSON round-trip/mutation/wrong-context substitutions cannot create a positive finding. Recompute after changed context; do not trust a serialized state or self-declared digest.

Only the exact anchor/version/facet/path may consume the finding. Project independently derived facts into existing arrays; preserve every collected obligation, including a caller/context obligation whose name collides with the branch placeholder. An absent/invalid finding preserves existing behavior. Serialization may communicate resulting evidence but cannot mint reader identity. The handoff is neither a public profile object, EvidencePack field, canonical semantic ID, public serialized result contract nor caller-authored StateBasis.

## 10. Boundaries and rejected shortcuts

Preserve the source-grounded distinctions:

```text
evidence present != evidence sufficient
claim supported != profile sufficient
all claims supported != profile sufficient automatically
profile sufficient != universal sufficiency
profile sufficient != institutional acceptance
profile sufficient != audit opinion
profile sufficient != certification
profile sufficient != compliance
profile sufficient != authority
profile sufficient != execution permission
```

B06 bounds sufficiency to one admitted profile/claim set/context; B02, B05 and Gate 1 change control preserve the remaining nonclaims. No acceptance authority, compliance determination or execution right is issued.

Standalone/report: absent report link permits standalone evaluation when the profile does not require it. If required, retain the missing obligation and defer link verification to T2-07; do not manufacture support by ignoring it. No `reportAssociation.ts`, report injection/byte validation/association, renderer or index edits. T2-07 remains BLOCKED_BY_SEQUENCE_UNTIL_T2-06_CLOSED.

G03 remains DEFERRED_TO_G03: no Harness mapping, canonical EvidencePack creation, producer integration or ingestion. Explicitly supplied admitted offline evidence is allowed; missing producer facts remain missing.

Reject caller predecessor states; all references present -> sufficient; visible supported claims -> sufficient; empty gaps -> no_material_gap; digest present -> profile validated; institutional_profile -> assurance profile; legacy allow/verdict -> sufficient; fixture expectation -> semantic input; a second/copied selector; generic StateBasis injection. Serialized result != authenticated accepted result; state label != evidence; result hash alone != sufficiency evidence.

## 11. Later implementation controls (frozen obligations; NOT EXECUTED)

- S04, S10, S11.absent standalone and complete no_material_gap positive controls, each with an actually admitted complete profile basis; legacy dispositions remain independent.
- Every S01-S13 standalone obligation, S04.label_only, S04.bad_profile_digest, S02.*, S03.*, S07.*, S08.*, S09 and H08/H16/H17/H18/H19. Preserve canonical IDs/mutations/assertions; do not infer product inputs from expected outcomes. Report-association portions remain T2-07 work.
- Hidden/missing required claims; unknown/duplicate/extra claim handling; every required atomic state, including unsupported/conflicted/stale/inconclusive; all visible claims supported with an omitted required member.
- Empty gaps, absent materiality criterion, incomplete evaluated-requirement coverage, unsupported non-materiality/exclusion, missing applicability, and complete undecidable materiality. Later concrete cases require the missing deterministic private criteria first.
- Wrong profile ID/version/digest; wrong claim-set ID/version/digest; absent retained content; wrong subject/revision/artifact/scope/environment/evaluation/reliance time; unknown registry/method/module basis.
- Forged/copied/serialized/mutated/wrong-context private finding; predecessor state-label and result-hash-only substitution; wrong original reader envelope/path; changed predecessor witnesses and conflicting private channels.
- Requirement-addition controls and Core/caller/context collisions; preserve scoped nonclaims and exact existing selector order. Valid direct evidence must not be globally vetoed by an unrelated prohibited inference.
- Preserve R-EAK, R-MESR, R-ISOLATION, R-PUBLIC and R-OUTCOME before/after obligations from canonical section 2; default-off/import isolation, no mutation, exact legacy JSON/Markdown/HTML/index and all four verdicts, parser/validator rejection behavior, reason ordering and accepted predecessor output preservation.
- Preserve frozen B09 bytes/oracle and all selected assertions; corrupted expectation, dropped binding, duplicate/omitted case, deliberate false positive and unexpected-exception controls must fail appropriately. Retain exact commands/exits, before/after observations, source/input/method/oracle versions/digests, representation/byte domains, remaining gaps and scoped diff. Three deterministic product replays at tranche exit; no execution claim in this dossier.

## 12. Preserved history, protected paths and planning hygiene

Accepted historical result hashes (inherited, not rerun or remeasured):

```text
T2_01_RESULT_HASH = 4df327296d4c2baea45cd22ce13d4b789fedbb783a7c8a1ff7a526745edad102
T2_02_RESULT_HASH = a1a11f600d227220aac30d91dda8f7e57a1d6f1f3825c4fb392583ad0b36f4c5
T2_03_RESULT_HASH = fd1bcd87dcd6e061c8bd8584705a178484bf2c09e9b347dd1293db559df35b34
T2_04_RESULT_HASH = 98bb34c335cba424061dbcfccb502e25e216363a6dc3579c14cdfdc32f643ecf
T2_05_RESULT_HASH = d2a43d1073c9cb6be36ff7edd91b8fe6bf50a19809dd364dce2c34a9906f296f
B09_COMMIT = a646f2b4576336321eda696c7dc2ee02749cadb2
ORACLE_HASH = 6dbc01d9650d45a03c0f8319eaecc994b34eae6d0f4885cdac971e6a32ab5c88
HISTORICAL_B09_RESULT_HASH = 49bd7526ba3092f02c0255970aa01723b771d492e57428f9a4aac0268fe69560
```

G06 may consume their required semantics, never rewrite them to satisfy a profile. All source, fixtures, verifier files, prior dossiers, B00-B08/B09 and external-review evidence remain protected in this task. In a later scope review, specifically protect `claimState.ts`, `requirements.ts`, `contracts.ts`, Core/registry/reason bindings, predecessor methods, EvidencePackV1, public report model/renderers/index, public CLI/SDK, exports/default callers and licensing/offline authority.

Preserved: audit output/verdict/exit unchanged; deny 25 unchanged; permit behavior unchanged; classify behavior unchanged; recommendation-only, additive-only, non-executing, default-off; no authority scope expansion, main-path takeover, dashboard/control-plane or orchestration drift. Commercial baseline remains v7.0.1; no install/demo/package/release changes.

Planning hygiene uses only `git diff --check`, `git diff --name-only` and `git status --short`; inspect status for this new untracked file because ordinary diff omits it. The sole changed path must be this dossier. Commit it alone as blocker evidence with subject `Record blocked T2-06 implementation entry`; report the resulting `T2_06_BLOCKED_ENTRY_COMMIT` in the final receipt, not a self-referential commit value in this file. Do not designate an implementation-entry/pre-change commit. No implementation suites run.

T2-06 IMPLEMENTATION NOT STARTED. T2-07 NOT STARTED / BLOCKED_BY_SEQUENCE. G06 OPEN. G03 NOT STARTED / DEFERRED_TO_G03. G05 CLOSED. G07 CLOSED.

## 13. Formal entry decision

T2_06_IMPLEMENTATION_ENTRY_BLOCKED_BY_PROFILE_CRITERIA
