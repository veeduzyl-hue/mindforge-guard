# Source-Reconciled Gate 1 Delta Backlog

**PROPOSED_NOT_STARTED.** This backlog is derived from the pinned implementation, not copied from the Research OS backlog. It does not authorize implementation. The [readiness decision](15_GATE1_READINESS_DECISION.md) keeps repaired-track Gate 1 blocked. Existing internal MESR/EAK and prior Gate 1/2 validation lineage remain intact.

Primary next scope: freeze the claim, state, binding and compatibility deltas needed to reuse the existing semantic substrate. AI-generated software change is the primary domain; Cyber Remediation remains a contrast. No new resolver platform, runtime integration, commercial normalization or product release belongs to this queue.

## Dependency order

Preflight B00 precedes admission. Boundary phase B01 establishes canonical identity and compatibility rules; B02 defines claims/states; B03 specifies the actual Harness gap. Hardening phase B04-B08 builds on those contracts. Acceptance phase B09-B10 defines repaired E3 oracles, freezes compatibility evidence and requests a separate gate decision. These are proposed deliverables only; none is implemented by V8-000.

### B00 — Resolve commercial-baseline ownership without rewriting history

- **Source dependency:** AGENTS.md and commercial-baseline skill say v6.13; README.md, RELEASE.md, current product documentation and CLI package/lock say v7.0.1; local release tags corroborate the later lineage.
- **Why now:** VERSION_BASELINE_AMBIGUITY prevents an unambiguous public compatibility promise even though the engineering commit is pinned.
- **Compatibility risk:** Silently upgrading constitutional scope or presenting internal V8 substrate as released behavior.
- **Artifact:** A separately approved baseline-disposition ADR naming the authoritative commercial baseline and documenting the conflicting sources. This task does not itself edit version declarations.
- **Acceptance criteria:** Historical release, commercial baseline, engineering baseline and internal V8 state have separate definitions and explicit owner disposition. Any later AGENTS/version edit is separately scoped. Remote release status is verified only if the decision depends on publication claims.
- **Runtime behavior changes:** NO.
- **Reversibility:** Withdraw the proposed ADR; retain all historical declarations and tags.

### B01 — Freeze canonical IDs, typed relations and migration admission

- **Source dependency:** B00; coreRegistry.ts, softwareDomainSeed.ts, types.ts, moduleManifest.ts, reasonCodeBindings.ts, existing MESR ADRs/specifications; 41+3 reconciliation rows.
- **Why now:** The implemented 30 Core entries and 41 research predicates have different granularity and nonclaims. The implementation is already a semantic substrate, so rebuilding a second registry would create semantic drift.
- **Compatibility risk:** Treating partial mappings as equivalent aliases; silently widening supports or narrowing nonclaims; using orthogonal dimensions as a strength ladder.
- **Artifact:** Canonical mapping/alias admission ADR and additive relation specification. Preserve mesr.core.* IDs; distinguish refines, requires, entails, orthogonal_to, adjacent_to, conflicts_with and supersedes from existing support relations.
- **Acceptance criteria:** Each proposed alias requires exact meaning, nonclaim, binding and version evidence. Partial rows remain mappings, not aliases. Stronger/weaker stays inactive absent a proven strict monotonic chain. A field addition has an opt-in/versioned compatibility path. authority.reachable stays deferred. The three assurance metadata IDs remain interpretation-process metadata outside action evidence.
- **Runtime behavior changes:** NO.
- **Reversibility:** Remove the proposed mapping/specification; no existing registry entry is renamed or removed.

### B02 — Specify Claim / Non-Claim and six-state conformance

- **Source dependency:** B01; supportEvaluator.ts, claimBoundaries.ts, eakProjection.ts, evidenceAssuranceKernel.ts, producerAdapters/semanticProjection.ts; repaired E3-B.
- **Why now:** Registry required_bindings are not automatically enforced by the evaluator; caller supplied claim parts contribute positives. CB-22 currently rejects an independence inference using does_not_support, while the repaired model requires unresolved independence alongside producer execution evidence.
- **Compatibility risk:** In-place renaming of supports/does_not_support/indeterminate, changes to legacy EAK support statuses, and interpreting a nonclaim as proof of falsity.
- **Artifact:** State/binding ADR and a negative-case specification for SUPPORTED, UNSUPPORTED, UNRESOLVED, CONFLICTED, STALE and INCONCLUSIVE. Keep execution, verification result and independence as separate dimensions.
- **Acceptance criteria:** Specify no-event versus producer-pass/unresolved-independence cases; absent required registry binding despite a permissive request; false/empty-array input behavior; caller asserted positive against an explicit nonclaim; contradiction and stale historical basis. Dimension annotations NOT_EVALUABLE and SUPPORTED_BY_PRODUCER_ASSERTION are not unreviewed extra primary states. Define versioned projection before changing any old output.
- **Runtime behavior changes:** NO.
- **Reversibility:** Withdraw new state specifications; existing enums and evaluators remain canonical.

### B03 — Specify Harness-to-canonical closure

- **Source dependency:** B01-B02; pinned Harness src/evidence/schema.ts and compatibility.ts; Guard EvidencePackV1/schema/validator; existing Harness MESR adapter, ingestion summary bridge and external-evidence normalizer.
- **Why now:** Actual mindforge-guard-evidence.v1/execution_facts is not the adapter's pack_version/records input or canonical schema_version 1.0.0. An interface name cannot close schema, semantic, provenance and assurance gaps.
- **Compatibility risk:** Fabricating required owner/authority/time/hash facts, coercing aggregate verification into successful verification events, or confusing producer-only flags with authority.
- **Artifact:** A versioned adapter input/output and missing-fact contract, field provenance map and future fixture plan. No adapter implementation.
- **Acceptance criteria:** Every required canonical field has a real source or an explicit unresolved/rejection rule; no invented facts. Identify byte/digest custody and independent checker responsibility. Preserve native event identity and time, producer provenance and command results without elevating execution success to verification pass. Specify canonical validation before EAK and an explicit report projection boundary. Keep producer compatibility distinct from canonical/EAK/report integration.
- **Runtime behavior changes:** NO.
- **Reversibility:** Withdraw the adapter contract; actual Harness and Guard remain untouched.

### B04 — Separate reason semantics, domain interpretation and policy

- **Source dependency:** B01-B02; all 56 reason declarations and bindings; inspectEvidenceCoverage.ts and generateGovernanceReport.ts; 37 implemented trigger codes and 19 declaration/binding-only codes.
- **Why now:** TESTS_NOT_RUN is broader than absence; BUILD_FAILED includes no-pass states; SECURITY_REVIEW_REQUIRED follows workflow class; dependency and migration checks use labels/regex.
- **Compatibility risk:** Changing serialized values/order or binding/report wording to match research terminology. Declaration-only codes must not be described as executed checks.
- **Artifact:** Revised binding/interpretation delta specification over the existing reason-code migration document, plus source-trigger-to-domain claim/nonclaim cases.
- **Acceptance criteria:** Preserve all 56 codes, aliases and order; separate current fact, semantic interpretation, policy result and report wording. Cover tests, release, rollback, dependency, security review, artifacts, ownership, authority, breaking change, remediation and recovery. New semantics use additive mappings; any eventual code migration requires a separate explicit contract decision.
- **Runtime behavior changes:** NO.
- **Reversibility:** Remove proposed additive bindings; legacy registry and reason consumers remain unchanged.

### B05 — Define independence and integrity falsification cases

- **Source dependency:** B02-B03; EAK buildEvidenceItems/buildVerifications; externalEvidence types and local report/normalization fixtures; semanticProjection.ts artifact_integrity projection.
- **Why now:** EAK treats normalized verified status or nonempty executed_checks as independently_verified; digest presence can become bound, while the producer projection can support integrity from hash/subject presence.
- **Compatibility risk:** Tightening PoC classifications alters existing snapshots even if public CLI remains isolated. External verifier labels do not establish independent custody or successful checks.
- **Artifact:** Independence/integrity evidence contract and falsifiable fixture specification, preserving old PoC behavior until a migration is explicitly authorized.
- **Acceptance criteria:** Failed/skipped-only external checks, producer=verifier, absent principal/custody, digest supplied but bytes unchecked, digest mismatch and independently checked success yield distinct bounded results. Missing independence remains unresolved; result success does not imply acceptance or sufficiency.
- **Runtime behavior changes:** NO.
- **Reversibility:** Withdraw the proposed test contract; do not relabel existing PoC fixtures.

### B06 — Define profile-bound sufficiency and report migration

- **Source dependency:** B02/B04/B05; reportModel.ts, generateGovernanceReport.ts, renderer/index consumers, EAK profile/conclusion/review_scope types; evidence.sufficient reconciliation row.
- **Why now:** Legacy allow is rule fallthrough with structural-sufficiency wording. It is not the repaired profile/claim-set/time-bounded sufficiency predicate.
- **Compatibility risk:** REQUIRES_REPORT_MIGRATION if a new sufficiency claim is projected into the legacy report. Tighter EvidencePack fields would additionally need a separately scoped schema migration; V8-000 does neither.
- **Artifact:** Opt-in sufficiency artifact specification and report compatibility ADR. Choose a versioned side artifact or an explicit later report migration before implementation.
- **Acceptance criteria:** Require profile_id, claim_set_id, scope and evaluation_time, with evidence refs and material-gap result. Missing bindings remain unresolved. Preserve legacy report bytes/verdicts/reason wording, indexes, renderers, CLI/SDK and CI fixtures in the current contract. Guard allow, Runtime ALLOW and institutional acceptance remain separate. No Preview/Final authority transition is invented.
- **Runtime behavior changes:** NO.
- **Reversibility:** Withdraw the new artifact/ADR; retain GovernanceReportModel 1.0.0 unchanged.

### B07 — Define historical/current standing evaluation

- **Source dependency:** B01-B02/B05; temporalBasis.ts, CB-15/16/18, authority coverage expiry comparison and separate license/receipt histories.
- **Why now:** Supplied current/stale labels and expiry against pack.created_at do not compute applicability at reliance time.
- **Compatibility risk:** Reinterpreting historical TIME_WINDOW_EXPIRED or old approvals as fresh current decisions; repurposing license authority as MESR authority.
- **Artifact:** A bounded temporal evaluation and authority rebinding specification referencing immutable historical records.
- **Acceptance criteria:** Explicitly cover freshness, expiry, revocation, supersession, revalidation, changed subject/environment/policy/dependencies, authority rebinding and approval/review reuse. Historical validity stays historical after revocation. Absent currentness basis is unresolved, not fresh by default. No online authority/revocation service is assumed.
- **Runtime behavior changes:** NO.
- **Reversibility:** Remove the proposed evaluator contract; historical fixtures/records stay immutable.

### B08 — Specify composition hardening over the existing resolver

- **Source dependency:** B01-B02; moduleManifest.ts and its existing resolver/composition tests; repaired E3-D.
- **Why now:** Four module types, deterministic loading and override/cycle rejection already exist. Dependency.version is not evaluated and the forbidden-claim deny list is not an exhaustive non-widening proof.
- **Compatibility risk:** Replacing the resolver, renaming diagnostic codes or importing six research conceptual classes as runtime module types.
- **Artifact:** Version/digest lock and semantic compatibility specification, with translation of repaired E3-D diagnostics to current vocabulary where justified.
- **Acceptance criteria:** Keep Core/domain_pack/crosswalk/institutional_profile loading; producers/consumers remain interfaces. Specify incompatible dependency versions, duplicate IDs, override attempts, support widening, nonclaim removal, alias cycles and deterministic failure output. Reuse zero-entry invalid composition behavior. A module distribution service is not required for this bounded test.
- **Runtime behavior changes:** NO.
- **Reversibility:** Withdraw the hardening specification; no current resolver or module manifest changes.

### B09 — Freeze repaired Experiment 3 oracles and process metadata

- **Source dependency:** B02-B08; existing producer adapters, canonical snapshots, runtime portability/domain/crosswalk/composition tests; seven repaired Research OS E3 JSON fixtures.
- **Why now:** Existing test passes demonstrate earlier bounded contracts. Repaired example.ci/example.runtime input formats and state/diagnostic expectations are not directly consumed today.
- **Compatibility risk:** Treating old test passes as repaired E3 acceptance; silently changing fixture meanings; treating replayability as real-world truth or universal interoperability.
- **Artifact:** A fixture translation/oracle specification for E3-A/B/C/D and separate mesr_assurance process metadata schema proposal.
- **Acceptance criteria:** A preserves equal bounded claims and different provenance with Execution Success != Verification Passed; B separates absent execution and unresolved independence; C adds zero automatic ALLOW/VERIFIED/APPROVED/SAFE/ACCEPTED/COMPLIANT equivalences and leaves StegVerse unresolved; D reuses existing composition with explicit version/non-widening negatives. Pin input_set_id, registry_version, module_lock, method_version and evaluation_time. Do not rewrite delivered Experiment 2B or Research OS fixtures.
- **Runtime behavior changes:** NO.
- **Reversibility:** Withdraw next-baseline fixture specs/metadata proposal; old tests and all delivered evidence remain unchanged.

### B10 — Review the complete delta before any implementation gate

- **Source dependency:** B00-B09 accepted specifications and explicit resolution of blockers in the readiness decision.
- **Why now:** Material semantic and compatibility choices must be reviewable before narrow changes are authorized.
- **Compatibility risk:** Conflating a documentation/test PASS with implementation, merge or release authority.
- **Artifact:** A gate review package with per-surface migration decisions, scoped implementation slices and required verify commands.
- **Acceptance criteria:** Confirm audit output/verdict/exit, deny 25, permit/classify, serialized JSON/report/reasons, public Node support, licensing/offline authority, install/demo, historical fixtures and external-review freeze. Explicitly admit only bounded deltas with negative oracles and rollback. Keep unresolved debt blocked or deferred by name. No tag or release is implied.
- **Runtime behavior changes:** NO.
- **Reversibility:** Withdraw the gate proposal; retain this source-reconciliation baseline.

## Verify and PR path

Expected future checks reuse MESR registry/binding/claim-stability/composition/runtime-portability/domain/crosswalk verifiers, EAK/local-external fixtures, outcome-foundation positive/negative checks, runtime isolation and commercial CLI smoke checks. Repaired E3 requires its own admitted oracle; existing passes alone are insufficient.

After explicit blocker disposition and gate admission, propose small documentation/specification PRs in the dependency order above, then separately scoped deterministic fixtures/validators. Runtime edits require a later explicit scope and compatibility decision. Review against the pinned source and preserved invariants; merge and release remain separate actions. V8-000 creates no PR, commit, tag or release.

Preserved posture: recommendation-only, additive-only, non-executing, default-off where applicable; audit output/verdict/exit unchanged; permit/classify unchanged; no authority expansion, control-plane/dashboard/orchestration drift or main-path takeover.
