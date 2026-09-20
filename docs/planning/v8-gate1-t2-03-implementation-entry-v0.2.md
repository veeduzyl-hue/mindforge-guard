# T2-03 Implementation Entry Refresh v0.2

Planning entry only; T2-03 / Tranche 2 / G05. This delta resolves the v0.1
state-integration authorization blocker. It does not implement or accept T2-03.

## Checkpoint and delta

- Branch: `planning/v8-gate1-tranche2-t2-03-v0.1`; starting worktree: CLEAN.
- Starting HEAD: `138e9e29d6e03027c8018abf0e2548f9a4eb7ad4`.
- `T2_03_BLOCKED_ENTRY_COMMIT = 4b94062fbdb538f1a87f611246c6b3b5a62474cd`.
- v0.1 blocker: no authorized canonical state-integration route.
- Blocker resolution: `T2_03_BOUNDED_SCOPE_EXPANSION_APPROVED`.
- `T2_03_SCOPE_EXPANSION_DECISION_COMMIT = 138e9e29d6e03027c8018abf0e2548f9a4eb7ad4`.
- Newly admitted product path: `packages/guard-core/src/mesr/repaired/evaluateClaim.ts`.

Authority: [immutable blocked entry](v8-gate1-t2-03-implementation-entry-v0.1.md),
[accepted scope decision](v8-gate1-t2-03-scope-expansion-decision-v0.1.md),
[canonical T2-03 card](21_GATE1_IMPLEMENTATION_PLAN.md#t2-03---principal-separation-and-custody-bound-independent-checking),
[current owner](../../packages/guard-core/src/mesr/repaired/evaluateClaim.ts), and
[ADR 0011 ownership/binding/precedence](../adr/0011-mesr-claim-nonclaim-state-and-binding-contract.md).
Only these minimum sources were read. `independence.ts` does not exist at this
checkpoint and is not created here. Earlier planning, accepted semantics,
V8-000, Tranche 1 and T2-01/02 remain closed; v0.1 stays immutable.

## Exact later implementation scope

Exactly eight paths; no ninth path is authorized:

```text
packages/guard-core/src/mesr/repaired/independence.ts
packages/guard-core/src/mesr/repaired/evaluateClaim.ts
scripts/verify_v8_gate1_product_conformance.mjs
scripts/gate1/b09-product-inputs.mjs
scripts/gate1/b09-product-compare.mjs
tests/fixtures/gate1/t2-03-controls.v0.1.json
tests/fixtures/gate1/t2-03-results.v0.1.json
docs/validation/v8-gate1-t2-03-evidence-v0.1.md
```

All other paths remain protected, especially `claimState.ts`, `requirements.ts`,
`contracts.ts`, `admission.ts`, `canonicalBytes.ts`, `composition.ts`,
`verificationEvent.ts`, `integrity.ts`; Core registry/supports/boundaries/aliases;
reason bindings/codes; EvidencePackV1/parser/validator; GovernanceReportModel,
reports/renderers; public CLI, SDK/package exports; licensing/offline authority;
package/version files; T1 evidence, T2-01 implementation/evidence, T2-02
implementation/evidence, frozen B09 and external-review history.
A required additional path means stop with
`T2_03_IMPLEMENTATION_ENTRY_BLOCKED_BY_ADDITIONAL_SCOPE`; no expansion here.

## Distinct evaluation dimensions

| Dimension | Representation / boundary |
| --- | --- |
| A. Attributable verification result | Inherited T2-01 occurrence/result facts; exact result preserved. |
| B. Principal separation | Private derived predicate finding, with evidence and limitations; no new canonical ID. |
| C. Verifier independence | Existing `verification.independent` facet on `mesr.core.evidence.verification@0.1.0`. |
| D. Custody independence | Existing `custody.independent` facet on `mesr.core.evidence.item@0.1.0`. |
| E. Control/conflict facts | Supporting attributable evidence under the named criterion; not a generic contradiction flag. |

No collapse into `independent = true|false`; no Core support or alias change.

## Private handoff, creation authority and context

```text
explicit retained T2-03 witnesses
 -> independence.ts
 -> private immutable context-bound T2-03 finding
 -> evaluateClaim.ts
 -> existing factual basis arrays
 -> existing private selectClaimState
 -> existing canonical state/result owner
```

The finding is not an EvidencePack field, public schema/serialized contract,
canonical object, SDK export, new primary state or caller-authored StateBasis.
The approved construction is a module-local WeakMap with opaque frozen handles
and immutable evaluated snapshots. Only actual product-side evaluation of
retained admissible witnesses may mint a handle; no registration of caller facts
or states. Internal producer/reader support stays inside the two product paths.
An optional T2-03-specific sixth intake can carry that handle; the fifth argument
remains exclusively the unchanged T2-02 receipt channel.

Fabricated, copied, serialized/deserialized or tampered findings are inert.
Caller `independent=true`, `custody.independent=true`, fixture expected states,
`verification.passed` alone, different principal IDs, processes/runtimes or
machine/organization labels cannot establish evaluated independence facts.
A handle proves only creation by the internal evaluation path:
private finding authority != authenticated principal identity != verifier
independence; private finding authority != independent custody. This is not an
identity/security claim. Partial findings may retain missing/negative/conflict/
undecidable facts; minting must not require a positive outcome.

Bind immutable snapshots of the full claim input, requested facet/path,
canonical identity/version, Core/admission inputs and trust, collected
registry/module basis, requirement contexts and retained witness dossier.
Bind applicable subject, revision, scope, verification event/result and
method/criterion, producer/executor/verifier principals, identity method/result/
provenance, separation policy/version, control/conflict witnesses, artifact/member
namespace, representation/domain, T2-02 comparison association, custody criterion,
collection/transfer/transformation/storage/access-control evidence, custodian,
custody interval, event/comparison times, evaluation_time and limitations/omissions.
Event time is not evaluation_time. No public schema, clock sampling, network
lookup, invented identity or implicit alias is introduced.

Wrong-context replay or changed bound inputs cannot discharge obligations.
An invalid handle uses exact old behavior; an admitted partial finding retains
its named missing associations. References must resolve to retained witnesses.
Preserve all comparable candidates; no favorable-source/order/majority choice.
Where a required T2-02 comparison has a separate equality request, use its exact
input/path/contexts and unchanged receipt reader, then check the explicit join.
Never retag a receipt, accept its serialized copy or overwrite a mismatch.

## Responsibility and source-grounded sufficiency

`independence.ts` owns identity-basis completeness, principal-separation and
control/conflict predicate facts, custody predicate, successful-check association,
missing/negative/conflict/undecidable diagnostics, and private creation/read
support. It does not select primary states, register IDs, change supports or
requirements, decide acceptance, or implement G07/G03.

`evaluateClaim.ts` retains admission, requirement/binding union, valid private
finding consumption, existing factual arrays, canonical selection and result
registration. Current source confirms admission precedes claims, independence
has local missing placeholders, custody lacks a specialized branch, and the
selector and admitted-result registration are file-private. The accepted scope
permits guarded exact-facet branches feeding the existing arrays; no other
product path is necessary. Existing contracts admit the bounded custody facet
as established by the accepted scope decision; Core supports need not change.

Keep collected missing bindings, evaluation-time checks and prohibitions intact.
Only branch-local placeholders may be avoided/replaced by evaluated local facts;
never remove collected obligations by matching names. Caller/context obligations
with colliding names still apply. No generic state_proofs widening, selector
export/copy, composite change or alternate owner. Existing precedence stays:
prohibition -> conflict -> stale -> missing -> negative -> undecidable -> positive
-> unresolved fallback. The six canonical states and result freezing/registration
remain unchanged.

## Exact facet effects and result preservation

Every row is subject to existing admission, binding union and precedence.

| Facet | Complete bounded facts / missing basis | Canonical consequence |
| --- | --- | --- |
| verification.independent | Successful attributable check + complete admissible identity + satisfied named separation + complete positive custody | Eligible for narrow SUPPORTED. |
| verification.independent | Successful check but missing identity, policy, separation, control/conflict or custody basis | UNRESOLVED. |
| verification.independent | Complete separation-policy/common-control or custody violation; all other required basis complete | UNSUPPORTED; not automatically CONFLICTED. |
| verification.independent | Comparable contradictory admissible witnesses | CONFLICTED, including collateral missing evidence, subject to Core prohibition. |
| verification.independent | Complete bounded undecidable method | INCONCLUSIVE. |
| custody.independent | Complete positive custody basis | Eligible for custody SUPPORTED independently of check success. |
| custody.independent | Complete sole-producer-control violation; other obligations complete | Custody UNSUPPORTED. |
| custody.independent | Missing retained custody witness | Custody UNRESOLVED. |
| custody.independent | Comparable contradictory custody witnesses | Custody CONFLICTED subject to existing precedence. |
| custody.independent | Complete bounded undecidable custody method | INCONCLUSIVE. |

Independent actor + failed check remains failed; separation may be retained
privately. Successful independent verification is not supported: complete
otherwise-required basis yields UNSUPPORTED; missing basis remains UNRESOLVED.
Skipped/incomplete checks provide no successful independence and preserve missing
event/result behavior; do not synthesize failure. Successful check + missing
independence basis may support pass on its own path while independence stays
UNRESOLVED. Complete inconclusive evaluation stays distinct from missing inputs.
Custody never upgrades result, verifier independence or institutional acceptance.

## Default-off and accepted boundaries

**NO valid T2-03 private finding = EXACT existing product behavior**, including
diagnostics, fallback and serialized output. Module existence/import alone has
zero semantic effect. Other facets and occurrence/pass, equality, generic-proof,
acceptance, currentness and composite routes remain unchanged.

Frozen I10 stays byte-identical, with its existing missing identity/control/
custody witnesses and historical expected result. Labels/references manufacture
nothing; preserve remaining product/oracle gaps. A complete I10-style control is
NEW supplemental hypothetical evidence with separate identity/provenance, never
historical enrichment. Frozen I-family/N02/N15/N18 and H14/H15 remain protected.

- T2-01 owns attributable verification occurrence/result; T2-03 joins, never
  redefines. Verification occurred != independent verification.
  `T2_01_RESULT_HASH = 4df327296d4c2baea45cd22ce13d4b789fedbb783a7c8a1ff7a526745edad102`.
- T2-02 owns exact-byte integrity comparison and established event/member/
  comparison associations. Byte equality != independent custody; receipt
  identity != authenticated checker identity; fifth-argument receipt != generic
  state/evidence injection. `integrity.ts` remains protected.
  `T2_02_RESULT_HASH = a1a11f600d227220aac30d91dda8f7e57a1d6f1f3825c4fb392583ad0b36f4c5`.
- Those hashes are inherited accepted evidence, not results run in this refresh.
- G07 remains OPEN / DEFERRED_TO_LATER_ACCEPTANCE. Historical/event-scoped
  independence != current continuing independence. Evaluate only admitted
  captured context; no temporal current standing, continuity, current reliance
  or evidence-expiry implementation.
- G03 remains OPEN / DEFERRED. No Harness mapping, canonical EvidencePack
  creation, producer integration or new ingestion layer. Explicit admitted
  offline facts suffice for this bounded implementation.

## Later acceptance controls (not run here)

Require label/ID/process/runtime/machine/organization-only separation falsifiers;
pass-only independence and equality-only custody falsifiers; reference-only,
missing/null/empty/wrong-type identity/policy/control/conflict/custody witnesses
and undefined methods remain unresolved. Separately prove common-control and
sole-producer-control non-support; preserve failed, skipped/incomplete and
inconclusive results. Prove bounded positive supplemental cases and separate
custody/result/independence outcomes without acceptance inference.

Reject wrong-context witness replay across every bound association and forged/
copied/serialized/tampered findings. Preserve no-handoff bytes, Core prohibition,
comparable-conflict precedence with missing evidence, colliding caller/context
obligations, scoped nonclaims, all candidates and actual composite ownership.
H14/H15 remain structural REJECTED; T1-01/02/03/04 and 603 Core probes preserved;
both accepted T2 result hashes unchanged. Preserve frozen I10 and B09 history.

Later evidence must include before/after R-EAK, R-MESR, R-ISOLATION and R-PUBLIC,
source/input/output hashes, asserted fields, commands/exits, provenance, remaining
gaps, product/test isolation, exact eight-path diff and reviewed rollback.
Historical pins/freeze receipts must not be rewritten. Require
`PUBLIC_CONTRACT_DRIFT = NO`, `AUTHORITY_EXPANSION = NO`, `NEW_REGRESSION = 0`,
and three identical deterministic replays with supplied times. These are future
acceptance obligations, not implementation/regression PASS claims.

Audit output/verdict/exit and deny exit 25 unchanged; permit/classify unchanged.
Recommendation-only, additive-only, non-executing, default-off; no authority scope
expansion, hidden enforcement, control-plane/dashboard/orchestration drift.
Released v7.0.1 contracts, licensing/offline authority and install/demo remain
unchanged. Internal V8 remains unreleased.

## Refreshed entry decision and commit protocol

The approved eight paths suffice: private predicates and intake fit within the
two product paths, the existing arrays represent all distinct dimensions, and
the selector/result owner remains unique. No public/canonical contract change,
additional protected path or handoff ambiguity is required. No semantic
contradiction was found. READY is an entry determination, not G05 acceptance.

This task creates only this v0.2 dossier. Planning hygiene is limited to
`git diff --check`, `git diff --name-only`, `git status --short`; intent-to-add
makes this new document visible to diff checks. No implementation suites,
product edits or fixtures. Commit only this document if hygiene passes, using
`Refresh T2-03 implementation entry for bounded state integration`.
Record the resulting SHA outside its own bytes as both
`T2_03_IMPLEMENTATION_ENTRY_COMMIT` and `T2_03_IMPLEMENTATION_PRE_CHANGE_HEAD`;
the committed entry HEAD is the immutable later implementation baseline.
Require post-commit CLEAN status, then stop.

T2-03 IMPLEMENTATION NOT STARTED. G07 NOT STARTED. G03 NOT STARTED. G05 OPEN.

T2_03_IMPLEMENTATION_ENTRY_READY
