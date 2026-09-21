# T2-06 Implementation Entry Refresh v0.2

Documentation-only entry refresh, 2026-09-21; T2-06 / G06. This delta consumes
the accepted criteria closure and scope decision without reopening either or
implementing T2-06. The historical blocked entry v0.1 remains immutable.

## Checkpoint and resolved blockers

```text
branch = planning/v8-gate1-tranche2-g06-v0.1
starting_HEAD = eae04d7b4f67209e0195b5578eca4cd7ea730341
starting_worktree = CLEAN
T2_06_BLOCKED_ENTRY_COMMIT = b0a2700659da5df14d13d0711099d150687ad8c8
T2_06_PROFILE_CRITERIA_COMMIT = 8bab7fbb50e5046c133706abe9da35ab921dc691
T2_06_SCOPE_EXPANSION_DECISION_COMMIT = eae04d7b4f67209e0195b5578eca4cd7ea730341
criteria_blocker_resolution = T2_06_PROFILE_CRITERIA_READY
scope_blocker_resolution = T2_06_BOUNDED_SCOPE_EXPANSION_APPROVED
```

The [v0.1 entry](v8-gate1-t2-06-implementation-entry-v0.1.md) lacked deterministic
profile criteria and canonical state-owner intake. The [criteria closure](v8-gate1-t2-06-private-profile-criteria-v0.1.md)
freezes the former; the [scope decision](v8-gate1-t2-06-scope-expansion-decision-v0.1.md)
admits exactly `packages/guard-core/src/mesr/repaired/evaluateClaim.ts` for the latter.
Authority remains the [canonical T2-06 card](21_GATE1_IMPLEMENTATION_PLAN.md#t2-06---profile-bound-standalone-sufficiency-artifact),
[B06 / ADR 0014](../adr/0014-profile-bound-evidence-sufficiency-and-report-boundary.md)
and [B02 / ADR 0011](../adr/0011-mesr-claim-nonclaim-state-and-binding-contract.md).
Earlier phase-local status language retains its historical context.

## Reverified frozen identities

Recomputed in memory with Python SHA-256 from the retained criteria text, without
importing or executing product code. Applied only the specified CRLF-to-LF and
marker-adjacent separator rules; preserved all other rules text and array order.
Rejected duplicate JSON keys, non-finite JSON, BOM and unexpected bare CR; also
required the claim-set source block to equal its canonical JSON serialization.
Object keys were code-point sorted; UTF-8 has no BOM or trailing newline.
Each digest AND byte length exactly matches the accepted scope-decision receipt.

All three identities have version `0.1.0`:

| Content / ID | Domain | SHA-256 | Bytes |
|---|---|---|---|
| Profile: `private.t2-06.software-change-check-record` | `private.t2-06.profile-content/0.1` | `ef051daa4b12093d195429746ac96ebadb5f85fa9497a3905ac77ba63f5390a0` | 26112 |
| Claim set: `private.t2-06.software-change-check-claims` | `private.t2-06.claim-set-content/0.1` | `6c374f3517c77c340a7807dc2c3e07df209a69dca75cff01157f305be89c4e68` | 381 |
| Method: `private.t2-06.strict-requirement-materiality` | `private.t2-06.method-rules/0.1` | `b46e86d207e9edb048992915f362be1cd8a7890a67fa224a0e301951a9223643` | 25866 |

Profile is the accepted five-field object containing the recomputed claim-set
digest and full rules text. Method bytes are the canonical JSON string of those
same rules; its domain is recorded alongside, not prepended. Profile/claim-set
domains are inside hashed content. Commit receipts remain external to content.
No content, inventory or rule changes are admitted. A different profile requires
a separately frozen version/content digest; no generic engine, policy DSL, risk
scoring, registry or public profile schema is introduced.

## Exact later implementation scope and owned request

The approved allowlist contains exactly eight paths; no ninth path is authorized:

```text
packages/guard-core/src/mesr/repaired/sufficiency.ts
packages/guard-core/src/mesr/repaired/evaluateClaim.ts
scripts/verify_v8_gate1_product_conformance.mjs
scripts/gate1/b09-product-inputs.mjs
scripts/gate1/b09-product-compare.mjs
tests/fixtures/gate1/t2-06-controls.v0.1.json
tests/fixtures/gate1/t2-06-results.v0.1.json
docs/validation/v8-gate1-t2-06-evidence-v0.1.md
```

This task creates only this v0.2 planning document. `sufficiency.ts` is absent
at the checkpoint and was not created. Every path outside the later allowlist
remains protected, especially:

```text
claimState.ts; requirements.ts; contracts.ts; admission.ts; canonicalBytes.ts
composition.ts; verificationEvent.ts
integrity.ts; independence.ts; temporalApplicability.ts; continuity.ts
Core registry / supports / aliases / boundaries
reason codes / reason bindings
EvidencePackV1 / parser / validator
GovernanceReportModel / reports / renderers / indexes
public CLI / SDK / package exports / default callers
licensing / offline authority / package and version files
historical T1/T2 evidence / frozen B09 history / external-review evidence
accepted entry v0.1 / criteria / scope decision / canonical task / ADRs
```

Owned request only:

```text
anchor = mesr.core.claim.claim@0.1.0
facet = evidence.sufficient
path = sufficiency
anchor_content_sha256 = 839d8b89b8eb79abea1001ef523b7c8e614206be47b158f5dc55b65eec13a28b
```

Anchor digest is the preserved v0.1 receipt (501 canonical JSON UTF-8 bytes),
not a newly measured registry receipt. No canonical ID, alias, Core support or
semantic module type is created. Private profile/claim/requirement IDs remain
bookkeeping only. The required atomic member remains `check-pass` on
`mesr.core.evidence.verification@0.1.0 / verification.passed / pass`.

## Criteria preserved without reinterpretation

The full accepted rules remain normative; this summary does not replace them.

| Item | Frozen requirement |
|---|---|
| R00 | Mandatory identity/bindings/full inherited-obligation accounting: expand every Core/entry/context/caller predicate and admitting source; unknown routes stay unresolved. |
| R01 | Mandatory fresh T2-01 attributable unit-tests verification result with all native method/criterion/input/output joins. |
| R02 | Mandatory fresh T2-02 byte equality for every relied-on input/output/original member against its own attributed expected reference. |
| R03 | Conditional fresh T2-02 byte equality for every intermediate/final transformed member when A1 positive; always retained in inventory, excluded only by complete X0. |
| A0 | Exact target/version/facet/path, unit-tests property, subject/revision/artifacts/environment, one included scope member, empty excluded scope, explicit reliance target equal to evaluation_time, and event_time <= evaluation_time. |
| A1 | Complete enumeration of actual retained source records, digest-bound manifest and transformation edges; positive for a retained dependency transformation, negative only for fully evidenced originals and zero edges. Missing/ambiguous enumeration is unresolved. |
| X0 | R03 only; A0 positive, A1 negative, full manifest/original-member evidence, explicit justification and no independent inherited transformed-member obligation. No other exclusion. |
| M1 | Ordered: missing mandatory basis -> unresolved; complete X0 -> permitted_exclusion; complete essential predicate false -> material_gap; complete applicable method unable to decide -> inconclusive; all required predicates established -> satisfied; otherwise unresolved. |
| NM0 | No non_material_gap determination permitted. No weighting, scoring, probabilities or severity model. |

Multi-member rows retain every determination: missing precedes complete negative,
then complete undecidable, then all-positive. An absent check/byte/reference is
not a completed failed check or mismatch. Stronger prohibition/conflict/stale
bases and collateral diagnostics remain intact. Inherited obligations are always
additive; an exclusion cannot remove them or a required claim.

Establish `no_material_gap` only when A0 is positive; full R00-R03 inventory and
all expanded inherited obligations are authenticated/accounted; every
applicability/materiality determination is complete; R00/R01/R02 are satisfied;
R03 is satisfied or has complete X0; all exclusions are justified; and no
material_gap, unresolved or inconclusive row remains. Empty gaps, all visible
claims supported and all references present each remain insufficient.

Enumerate required claims independently of display. Hidden/missing claims remain
required; duplicate full keys reject without first/last wins, retaining existing
`DUPLICATE_CLAIM_PATH`. Unknown identities remain unresolved; malformed/disallowed
paths retain validation errors. Extra claims cannot replace or silently bypass
the frozen member; additional required claims require a separately frozen claim
set. Existing false-evidence, empty-atomic-results and invalid-state structural
rejections remain unchanged.

## Executable predecessor routes and private handoff

Source inspection confirmed the existing exported routes below. Executable means
the retained source provides the required calls and readers; no route or product
suite was executed in this planning refresh.

| Predecessor | Preserved authentication route |
|---|---|
| T2-01 | Fresh `evaluateVerificationEvent` over native retained records plus its separate original canonical context; consume actual returned owner results. No private receipt reader is invented. |
| T2-02 | Fresh `compareExactBytes` + `readIntegrityReceipt` with original input/path/contexts and each member's actual bytes/expected reference. |
| T2-03 | Fresh `evaluateIndependence` + `readIndependenceFinding`, preserving original integrity receipts, native check, principals and custody prerequisites. |
| T2-04 | Fresh `evaluateTemporalApplicability` + `readTemporalApplicabilityFinding`, preserving original standing.current request, historical T2-01/02/03 basis and both times. |
| T2-05 | Fresh `evaluateContinuity` + `readContinuityFinding`, preserving separate historical/current/revalidation temporal envelopes and direct-channel agreement. |

Each route retains original input, anchor/facet/path, Core/trust, requirements,
subject/revision/scope, times, witnesses and private reader semantics. Never
substitute the outer sufficiency envelope or rename a predecessor path. R01 uses
T2-01; R02/R03 use T2-02; T2-03/04/05 apply only for inherited obligations, with
all their prerequisites. Serialized states, result hashes alone, caller labels
and copied handles never authenticate evidence.

```text
retained pinned profile / claim set / method + original supplied witnesses
  -> fresh product-side predecessor execution and original-context readers
  -> sufficiency.ts: frozen criteria and bounded factual dimensions
  -> private immutable context-bound T2-06 finding
  -> evaluateClaim.ts: exact-context authentication and factual projection
  -> existing factual basis arrays -> existing private selector
  -> canonical result owner
```

Only actual product execution of frozen criteria over authenticated evidence may
register a finding in a module-private identity map. Deeply freeze owned snapshots
and handle; retain genuine predecessor identities separately from serialized
snapshots. A finding is not a public schema, EvidencePack field, canonical ID,
new primary state, public serialized result contract or caller-authored StateBasis.
Standalone serialization communicates the actual owner's result, never selects it.

Plain/copy/serialized/deserialized/mutated findings, `sufficient=true`,
`no_material_gap=true`, caller `material_gap_result` or StateBasis arrays,
predecessor state/hash substitutions and fixture expected states remain inert.
Private identity proves only bounded product computation over supplied evidence,
not world truth, compliance, acceptance, certification, authority or permission.

Bind exact anchor/facet/path; full profile/claim-set/method IDs, versions, domains,
digests and content/rules; subject/revision/artifacts; scope/environment;
evaluation_time/reliance_time; Core/trust/registry/module locks; freshly collected
requirements; R00-R03 inventory; A0/A1/X0 and M1/NM0 determinations; predecessor
original envelopes/findings/results; evidence refs; limitations/nonclaims; and
provenance. The reader compares the saved context against the current retained
envelope AND the owner's freshly collected input/Core/trust/contexts. Matching
only a handle's own metadata is insufficient. Wrong-context replay fails;
changed profile/claim-set/method content or any bound basis requires recomputation.

## Sole state owner, sufficiency of scope and default-off

Inspected `evaluateClaim.ts`: eight existing parameters; fresh collection and
early admission rejection; unconditional sufficiency placeholder; structural
field checks; private selector; frozen and registered canonical results. Its
existing temporal branch shows how to avoid only a branch-owned placeholder.
The approved optional ninth private channel can carry a finding and its current
envelope without changing contracts, requirement union, exports or default callers.
Private types, validation, snapshots and registration fit inside `sufficiency.ts`.
Predecessor calls/imports require no top-level evaluation or registration; the
native verification dependency calls the owner from function bodies, and the fixed
atomic verification request does not recurse into sufficiency.

Thus exactly the eight approved paths are sufficient for this bounded handoff;
no additional protected edit or public/canonical contract change is required.
If later implementation reveals a ninth-path need, stop at
`T2_06_IMPLEMENTATION_ENTRY_BLOCKED_BY_ADDITIONAL_SCOPE`; this refresh grants no
further expansion and permits no weakening of criteria to fit scope.

`evaluateClaim.ts` remains sole canonical state owner. A valid finding on the
exact owned request may resolve only the branch-local
`profile_bound_sufficiency_basis` placeholder it proves. Never remove collected
obligations by matching this string: an identically named inherited
Core/context/caller obligation remains independently required. Preserve structural
sufficiency checks and generic proof validation. No selector export/copy, second
evaluator, seventh state, precedence/admission/union change or generic caller
StateBasis intake; fixtures cannot select canonical states.

| Existing ordered basis | Canonical state |
|---|---|
| Applicable prohibited inference | UNSUPPORTED |
| Comparable admissible conflict | CONFLICTED |
| Preserved historical support plus proven applicability loss | STALE |
| Missing evidence/criterion/binding/applicability/materiality coverage | UNRESOLVED |
| Complete bounded non-support | UNSUPPORTED |
| Complete applicable method unable to decide | INCONCLUSIVE |
| Complete positive profile basis | SUPPORTED |
| No admitted determination | UNRESOLVED |

Positive requires every applicable required claim supported, bindings satisfied,
profile applicability established, complete materiality, no_material_gap,
authenticated predecessor evidence and no stronger blocker. All claims SUPPORTED
alone is insufficient. Preserve all collateral diagnostics under stronger states.

**NO valid T2-06 private finding = EXACT existing product behavior.** Absent,
invalid or wrong-context handles retain existing placeholder/checks/diagnostics;
no new output key or diagnostic follows merely from the optional channel/import.
Module existence/import changes nothing. Historical/frozen sufficiency inputs do
not gain profile admission; supplemental controls are new evidence, not repair
of historical inputs or B09 observations.

## Standalone and protected product boundaries

BASE remains standalone; this profile version requires no report link. No
`reportAssociation.ts`, report-byte verification, report mutation or renderer/index
change. An unverified report reference establishes no association. T2-07 remains
`BLOCKED_BY_SEQUENCE_UNTIL_T2-06_CLOSED`.

G03 remains `DEFERRED_TO_G03`: no Harness mapping, canonical EvidencePack creation,
producer integration or ingestion layer. Explicit admitted offline evidence is
sufficient as an input route; missing producer facts stay missing.

Audit output/verdict/exit and deny exit 25 unchanged; permit and classify unchanged;
recommendation-only, additive-only, non-executing, default-off; no authority scope
expansion, main-path takeover or control-plane/dashboard/orchestration drift.
Public contracts, licensing/offline authority, install/demo paths and v7.0.1
commercial surface remain unchanged. This entry establishes no execution,
acceptance, audit-opinion, compliance or certification authority.

## Later implementation proof obligations - NOT RUN

- Exact profile/claim-set/method digests; R00-R03; A0/A1/X0/M1/NM0; complete
  no_material_gap, every inherited obligation and all required member comparisons.
- S04, S10, S11.absent; S01-S13 standalone; S04.label_only,
  S04.bad_profile_digest; S02.*, S03.*, S07.*, S08.*, S09; H08/H16/H17/H18/H19.
  Preserve assertions; report-association portions remain deferred to T2-07.
- Hidden/missing required claim, duplicate/unknown/extra claim; every atomic
  state and collateral blocker; empty gaps; all claims supported with incomplete
  materiality; missing versus completed negative versus complete undecidable.
- Forged/copied/serialized/mutated finding; caller booleans/StateBasis;
  predecessor state-label/hash-only substitution; wrong reader envelope;
  changed witnesses and conflicting separately supplied channels.
- Wrong profile/claim-set/method digest or content; wrong subject/revision/
  artifact/scope/environment/evaluation/reliance time; changed locks/requirements;
  same-name placeholder collision remains an independent obligation.
- T1-01/02/03/04 and 603 Core probes preserved; T2_01_RESULT_HASH through
  T2_05_RESULT_HASH unchanged against the exact inherited receipts in the accepted
  scope decision. Frozen B09 commit/oracle/result receipts remain unchanged.
- R-EAK, R-MESR, R-ISOLATION, R-PUBLIC, R-OUTCOME; exact default-off historical
  outputs and unrelated paths; import isolation; no caller mutation; unchanged
  parser/validator, reason values/order, CLI/SDK, JSON/MD/HTML/index and four verdicts.
- Independent product harness; no reference-engine dependency or fixture state
  selection; corrupted expectation, dropped binding, duplicate/omitted case,
  deliberate false positive and unexpected-exception falsifiers.
- Record commands/exits, before/after observations, source/input/method/oracle
  versions/digests, byte domains and worktree/Git-blob continuity for new evidence.
  Require PUBLIC_CONTRACT_DRIFT = NO, AUTHORITY_EXPANSION = NO, NEW_REGRESSION = 0
  and three identical deterministic product replays.

These are later acceptance obligations, not test results of this entry refresh.

## Entry receipt and stop

Planning hygiene is limited to `git diff --check`, `git diff --name-only` and
`git status --short`, accounting explicitly for this new untracked document.
Only `docs/planning/v8-gate1-t2-06-implementation-entry-v0.2.md` may change.
No product code, fixture or implementation suite is changed/executed.

On READY, commit this document alone with subject
`Refresh T2-06 implementation entry for profile-bound sufficiency`.
Record that actual commit externally as BOTH `T2_06_IMPLEMENTATION_ENTRY_COMMIT`
and `T2_06_IMPLEMENTATION_PRE_CHANGE_HEAD`; it becomes the immutable later
implementation baseline. Avoid a self-referential commit value in this file.
Require a clean worktree after that one commit, then stop.

T2-06 IMPLEMENTATION NOT STARTED. T2-07 NOT STARTED / BLOCKED_BY_SEQUENCE.
G06 OPEN. G03 NOT STARTED. G05 CLOSED. G07 CLOSED.

Criteria identities match exactly; approved scope is sufficient; handoff is
bounded; predecessor routes exist; no public/canonical contract change is needed;
state ownership is preserved; BASE is standalone; T2-07 and G03 remain deferred.

T2_06_IMPLEMENTATION_ENTRY_READY
