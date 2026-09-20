# T2-02 implementation entry refresh v0.2

Planning-only delta to the immutable [v0.1 blocked entry](v8-gate1-t2-02-implementation-entry-v0.1.md).
No product implementation, fixtures or implementation suites are part of this task.

## Checkpoint and blocker resolution

- Branch: `planning/v8-gate1-tranche2-t2-02-v0.1`.
- Starting HEAD: `52d7f8db5ee241ef0ce7d52a429932132544ad41`; worktree CLEAN.
- Accepted T2-01 verifier closure: `6ec7d06ee48f700ab16333420ffe3fc2b18aee19`.
- T2_02_BLOCKED_ENTRY_COMMIT: `29499392254d1a224de86c957161b524a3050e56`.
- T2_02_SCOPE_EXPANSION_DECISION_COMMIT: `52d7f8db5ee241ef0ce7d52a429932132544ad41`.
- v0.1 blocker: no authorized canonical state-integration route.
- Resolution: accepted `T2_02_BOUNDED_SCOPE_EXPANSION_APPROVED` in the
  [scope decision](v8-gate1-t2-02-scope-expansion-decision-v0.1.md) at that commit.
- Newly admitted path: `packages/guard-core/src/mesr/repaired/evaluateClaim.ts`.

The existing [T2-02 task card](21_GATE1_IMPLEMENTATION_PLAN.md#t2-02---exact-byte-integrity-comparison)
and v0.1 byte/provenance requirements remain authoritative; neither is rewritten.
Source review of `evaluateClaim.ts` and the private `claimState.ts` contract
confirms that the recognized equality branch can consume factual comparison
basis through existing positive/negative/missing arrays. The selector and result
registration already share one owner. No additional product path, state category,
public input field or canonical contract change is needed. This is implementation
entry feasibility, not tested implementation acceptance or release readiness.

## Exact future implementation allowlist

```text
packages/guard-core/src/mesr/repaired/integrity.ts
packages/guard-core/src/mesr/repaired/evaluateClaim.ts
scripts/verify_v8_gate1_product_conformance.mjs
scripts/gate1/b09-product-inputs.mjs
scripts/gate1/b09-product-compare.mjs
tests/fixtures/gate1/t2-02-controls.v0.1.json
tests/fixtures/gate1/t2-02-results.v0.1.json
docs/validation/v8-gate1-t2-02-evidence-v0.1.md
```

No ninth path is authorized. All other paths are protected, including repaired
`claimState.ts`, `requirements.ts`, `contracts.ts`, `admission.ts`,
`canonicalBytes.ts`, `composition.ts`, `verificationEvent.ts`; Core registry and
boundaries; reason bindings/codes; EvidencePackV1, parser and validator;
GovernanceReportModel and report generation/renderers; public CLI, SDK/package
exports, licensing/offline authority and package/version files. Historical
T1/T2-01/B09 fixtures, evidence, freeze receipts and the canonical task card stay
unchanged. Shared test edits remain translation/invocation/comparison only.
If any additional product path proves necessary, stop with
`T2_02_IMPLEMENTATION_ENTRY_BLOCKED_BY_ADDITIONAL_SCOPE`.

## Private comparison handoff

```text
explicit supplied bytes -> integrity.ts
-> private context-bound exact-byte comparison receipt
-> evaluateClaim.ts -> existing canonical state owner
-> existing six-state selector
```

- **Creation authority:** only the admitted private T2-02 comparison path may
  create a valid receipt, after actual complete computation. Preserve the scope
  decision's immutable process-local receipt with module-private WeakMap
  registration (or the narrowest equally private repository-compatible mechanism
  preserving these guarantees). A plain, fabricated, copied or deserialized
  object cannot become valid. Inspection serialization conveys no receipt
  authority; replay requires fresh explicit computation. Identity is not checker
  authentication or custody proof.
- **Context binding:** retain immutable snapshots of the exact canonical
  input/request and comparison context: claim/path and canonical identity/version,
  member namespace/reference, representation/byte domain, subject/revision,
  scope, expected-source witness/digest association, SHA-256 method, measured
  byte length, computed digest and match/mismatch. Preserve existing justified
  checker/version, method/version/descriptor, provided event time, distinct
  evaluation time, input/output references, provenance witnesses and limitations.
  Validate these associations at consumption, including supplied legacy integrity
  fields. Cross-member/revision/domain reuse, input mutation and ambiguous or
  competing basis cannot discharge an obligation; never select a passing witness
  by last-write. These are private facts from v0.1/the decision, not a new schema.
- **Completed immutable result:** caller-declared observed digest, `match=true`,
  test expectation, reference label and `verification.passed` are never substitutes
  for actual decode/hash/length/comparison. Expected reference must be independently
  specified and attributable; deriving it from current supplied bytes is not proof.
- **Responsibility:** `integrity.ts` owns exact-byte decode, SHA-256, measured
  length, comparison, comparison-basis checks and private receipt construction.
  `evaluateClaim.ts` owns canonical admission/context validation, existing
  obligations, valid receipt consumption and existing state selection. No hash
  duplication in the evaluator; no state selection in integrity; no second
  evaluator, generic basis injection, callback or fabricated composite child.
- **Private integration:** an optional fifth receipt argument to existing
  `evaluateClaims` can preserve every four-argument call. Types and the narrow
  factual receipt reader stay within the two admitted product files. The evaluator
  may import the reader; integrity must not import/call the evaluator. The receipt
  stays outside the closed legacy integrity JSON object. It is not an EvidencePack
  field, public serialized contract, canonical object, SDK/package export or
  caller-authoritative state assertion.

Only the existing admitted `mesr.core.evidence.item` anchor and exact
`artifact.byte_equality` facet may consume this basis. No Core supports/alias
change or support inferred from `bounded_content`. Preserve unknown-identity
rejection, all collected obligations and existing state-proof checks. Discharge
only the branch's own integrity missing markers actually supplied by the receipt;
never remove an identically named Core/caller/context missing obligation.

Exact original octets and SHA-256 only: no filesystem/network/reference lookup,
normalization, transcoding, semantic-content digest substitution or canonical
EvidencePack creation. Raw and derivative members remain separate. Supplied zoned
comparison time must be valid and remain distinct from evaluation time; no sampled
clock, generated time or fallback. The absent-receipt path performs no hashing or
I/O; module existence/import alone changes no result.

## State and historical preservation

Preserve `SUPPORTED`, `UNSUPPORTED`, `UNRESOLVED`, `CONFLICTED`, `STALE`,
`INCONCLUSIVE`, malformed-input rejection and the private selector unchanged.
Precedence remains Core prohibition -> comparable conflict -> proven stale basis
-> missing obligation -> completed determination (negative -> undecidable ->
positive), with the existing fallback. No seventh state or selector export/copy.

| Equality basis | Required behavior, subject to existing admission/bindings/precedence |
| --- | --- |
| No valid completed T2-02 receipt | EXACT existing T1 output and missing-basis behavior. |
| Missing/unestablished domain, member, algorithm or comparison basis | UNRESOLVED unless a stronger existing blocker takes precedence. |
| Complete admissible comparison, digest mismatch | UNSUPPORTED; retain both digests, no automatic CONFLICTED. |
| Complete admissible comparison, digest match | Eligible for narrow SUPPORTED only after all existing obligations and precedence pass. |

**NO valid T2-02 private receipt = EXACT existing T1 behavior.** Invalid receipt
diagnostics, if retained privately, must not change the canonical result. Historical
B09 labels/reference strings without complete attributable comparison evidence
must never become retrospectively SUPPORTED. A new complete task control is new
evidence, not a repair of frozen historical input.

Match implies none of authenticity, truth, custody, verifier independence, outcome
correctness, institutional acceptance, authority, execution permission or compliance.

## Frozen later controls and noninterference acceptance

Controls must prove that forged, test-fabricated, copied, serialized/reconstructed
or tampered receipts cannot activate completed equality. Also test receipts for a
different claim/path/member, representation/domain, subject/revision, scope/time/
method, wrong expected-source association or wrong byte length, and mutated input.
Caller-provided observed digest only, caller-provided `match=true`,
`verification.passed` substitution and T2-01 occurrence/result substitution must
all fail to activate equality. Invalid handoff must reproduce the no-receipt T1
output; malformed canonical input remains REJECTED. These controls are obligations,
not fixtures or tests implemented here.

Later implementation must provide:

- T1-01/02/03/04 preservation through unchanged accepted input inventories and
  actual product APIs, comparing complete serialized outputs/fingerprints,
  admission failures, obligation unions, six states, composition and 603 Core probes.
- Exact historical equality outputs without valid receipts, including label-only
  B09, I06/I07/I08/I09/I10/I15 and N17.failed/skipped; unrelated claims unchanged.
  Exercise valid match/mismatch and missing admission/bindings/prohibitions, keeping
  selector ownership, composite admission and precedence intact.
- Unchanged T2-01 370 annotation and 64 bridge/boundary assertions, three replays,
  and result SHA-256 `4df327296d4c2baea45cd22ce13d4b789fedbb783a7c8a1ff7a526745edad102`.
- Before/after R-EAK + R-MESR + R-ISOLATION + R-PUBLIC evidence, exact legacy
  report/renderer/index bytes, parser/validator behavior, reason order, exports
  and licensing: `PUBLIC_CONTRACT_DRIFT = NO`; `AUTHORITY_EXPANSION = NO`.
- Three explicit product replays with fresh receipts and the same supplied bytes/
  times: identical serialized hashes, `deterministic replay = PASS`. No serialized
  process identity or clock data; input immutability and product/test isolation.
- Exact eight-path allowlist, protected-source hashes and `NEW_REGRESSION = 0`.
  Pin exact source/input/result baselines from the committed entry tree before
  implementation. Attribute the permitted evaluator delta; preserve historical
  freeze hashes and branch guards, executing unchanged semantic cases in a
  separately attributed allowed T2-02 lane when required. Never count unexecuted
  assertions as passed or weaken historical verifiers.

These are future proof obligations, not PASS claims from this planning task.
Audit output/verdict/exit (including deny 25), permit and classify remain unchanged.
Recommendation-only, additive-only, non-executing, default-off and no authority
scope expansion are mandatory; no control-plane/dashboard/orchestration drift.

## Deferred boundary and entry disposition

T2-03 alone owns verifier/principal separation, verifier independence, custody
independence and common-control/conflict facts. G03 owns truthful Harness ->
canonical EvidencePack integration. T2-02 closes neither; G05 also remains OPEN.
T2-02 IMPLEMENTATION NOT STARTED; T2-03 NOT STARTED; G03 OPEN.

Only this v0.2 document changes. Planning hygiene is limited to `git diff --check`,
`git diff --name-only` and `git status --short`; no implementation suites run.
Create one entry commit only for READY. Its resulting commit ID is both
`T2_02_IMPLEMENTATION_ENTRY_COMMIT` and `T2_02_IMPLEMENTATION_PRE_CHANGE_HEAD`,
reported after commit as the immutable later implementation baseline. Then verify
clean status and stop. No additional scope or public/canonical handoff change is
needed for the bounded route above.

T2_02_IMPLEMENTATION_ENTRY_READY
