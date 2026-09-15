# Reason-code semantic delta v0.1

Status: **B04 SPECIFICATION_ONLY**. Companion to [ADR 0012](../adr/0012-reason-semantic-domain-policy-separation-contract.md). No source, serialized value, emitter, current binding or report wording changes. This adds an interpretation ledger alongside the frozen [existing migration specification](../specs/mesr-reason-code-migration-v0.1.md).

## Source and compatibility contract

Source baseline: Phase A commit `dcfc021c4d13d19662fd6cab0191481707dada89`, whose product tree is unchanged from V8-000. The [reconciliation JSON](implementation-reconciliation.v0.1.json) and [matrix](07_IMPLEMENTATION_RECONCILIATION_MATRIX.md) supply all 56 declaration/definition/emission/consumer/fixture traces. Current [reason definitions](../../packages/guard-core/src/reasonCodes.ts), [coverage](../../packages/guard-core/src/inspectEvidenceCoverage.ts), [report generator](../../packages/guard-core/src/generateGovernanceReport.ts) and [MESR bindings](../../packages/guard-core/src/mesr/reasonCodeBindings.ts) were inspected against those traces.

The ledger is in exact canonical declaration/binding order: 56 unique values, 37 IMPLEMENTED_TRIGGER and 19 DECLARED_AND_BOUND_ONLY_NO_CURRENT_CORE_EMITTER_FOUND. Declaration/binding-only does not establish an executed check. Direct coverage predicates do not necessarily pass the normal report validator first: empty owner, missing artifact hash and missing producer/source hash are examples. Preserve this reachability difference.

CURRENT_INTERPRETATION quotes the existing MESR supported_claim and canonical targets; it is not a new assertion that the trigger proves that proposition. CURRENT_REPORT_WORDING preserves the exact reason definition. Missing-evidence messages use that definition; require_review explanations concatenate at most the first three verdict reason definitions; review/next-action text follows the frozen generator described below. Declaration-only wording is available vocabulary, not proof it was emitted. All category/severity/output placement remains unchanged.

FACT here means what the submitted fields or actual rule predicate show. SEMANTIC INTERPRETATION needs separately admitted bindings and evidence. POLICY RESULT means a bounded recommendation. REPORT WORDING is communication, not a witness. Reason-code presence != proof of the world-level semantic proposition; code absence does not prove its negation.

## Shared current policy and wording rules

All emitted codes retain category summaries and maximum severity-hint aggregation; severity is report priority, not assurance maturity. Coverage addCoverageFinding creates missing evidence; addUnique-only branches do not. Report order is first-occurrence append: coverage, verdict, review, next actions. Do not sort report arrays into declaration order.

| Policy key | Exact current effect, subject to global verdict precedence |
|---|---|
| P0 | Coverage/risk/category communication only unless another listed rule applies; no code-specific verdict/review/next-action trigger found. |
| PG | Generic review on MISSING_AUTHORITY, DECLARED_AUTHORITY_ONLY, INSUFFICIENT_VERIFICATION, TESTS_NOT_RUN, TESTS_FAILED, BUILD_NOT_RUN, BUILD_FAILED, MANIFEST_INCOMPLETE or BLOCKED_ACTION_PRESENT. Emits HUMAN_REVIEW_REQUIRED. |
| PA | Authority next-action for CYBER_AUTHORIZATION_REQUIRED > MISSING_AUTHORITY > DECLARED_AUTHORITY_ONLY > OWNER_MISSING > REVIEWER_MISSING > TIME_WINDOW_MISSING (first matching priority). |
| PV | Verification next-action when tests/build/INSUFFICIENT_VERIFICATION/BREAKING_CHANGE_UNVERIFIED present; selected reason is BREAKING_CHANGE_UNVERIFIED > TESTS_NOT_RUN > INSUFFICIENT_VERIFICATION. |
| PR | Release rollback absence/unverified emits RELEASE_REVIEW_REQUIRED and rollback next-action (ROLLBACK_MISSING preferred). |
| PP | Manifest/hash/ref/producer findings cause provenance next-action, with ARTIFACT_REF_UNRESOLVED > ARTIFACT_HASH_MISSING > MANIFEST_INCOMPLETE; producer gap may therefore use manifest reason. |
| PO | Dependency workflow with dependency/impact reason requests owner review; missing owner on release/security_patch/dependency_upgrade also requests it. Deduplicate by reason. |
| PS | Cyber pack, security_patch workflow or cyber authorization reason requests security review, regardless of completed human_review status. |
| PD | MISSING_AUTHORITY directly adds verdict reason; OWNER_MISSING only in high-risk workflow types; software INSUFFICIENT_VERIFICATION/TESTS_NOT_RUN/TESTS_FAILED, release rollback reasons and cyber authorization also directly contribute. |
| PB | Any submitted critical blocked item drives block first; reason is BLOCKED_ACTION_PRESENT plus all mapped blocked-item reasons, not just critical ones. |
| PN | No current Core/report emitter or code-specific policy evaluation. Retain vocabulary/binding without creating a trigger. |

Verdict precedence: PB block -> manifest incomplete/unknown inconclusive -> selected PD reasons or any required review -> require_review -> allow. Manifest partial or empty files may produce PG without the inconclusive branch. Nonselected findings may coexist with allow. No rule executes a command or grants institutional acceptance.

Exact review messages: HUMAN_REVIEW_REQUIRED: "A human review step is needed before relying on this governance report." SECURITY_REVIEW_REQUIRED: "Security review is needed for the cyber-oriented workflow." OWNER_REVIEW_REQUIRED: "Owner review is needed for the dependency-oriented workflow." or, when that reason was not already added, "Owner review is needed because owner context is absent." RELEASE_REVIEW_REQUIRED: "Release review is needed before relying on this release summary."

Exact shared next-action messages: PA "Clarify or strengthen the authority material for this workflow." PV "Strengthen verification evidence for the recorded change." PR "Provide rollback evidence for the release-oriented workflow." PP "Align the manifest, artifact, and provenance material with the report input." Review next-actions copy their review messages. No recommendations are executed.

Preserve source translations DESTRUCTIVE_COMMAND -> DESTRUCTIVE_COMMAND_ATTEMPTED, SECRET_ACCESS -> SECRET_ACCESS_ATTEMPTED and NETWORK_NOT_ALLOWED -> NETWORK_ACCESS_ATTEMPTED only in blocked-action mapping. Preserve art_manifest reference bypass. No global alias introduced. The only canonical DEPENDENCY_CHANGE_* code in this 56-code list is DEPENDENCY_CHANGE_DETECTED; related impact/lockfile/migration/API codes are separately retained, not invented wildcard expansions.

## Complete 56-code ledger

### 01 `MISSING_AUTHORITY`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:39`, `packages/guard-core/src/reasonCodes.ts:150`, `packages/guard-core/src/inspectEvidenceCoverage.ts:230`.
- **CURRENT_OBSERVATION:** authorization_status is missing OR authorization_evidence is empty.
- **CURRENT_INTERPRETATION:** Existing binding: "authority evidence is missing for the evaluated scope"; Core `mesr.core.authority.scope`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PG, PA, PD; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "Submitted evidence does not include authority material needed for governance interpretation." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve authority / high and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain attributed authority/context field observation only; verify applicable principal, source, scope and time separately before any authority claim. Missing context is not absent real-world authority. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `action_approved`, `authority_current`, `authority_verified`, `execution_authorized`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 02 `DECLARED_AUTHORITY_ONLY`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:40`, `packages/guard-core/src/reasonCodes.ts:157`, `packages/guard-core/src/inspectEvidenceCoverage.ts:241`.
- **CURRENT_OBSERVATION:** authorization_status equals declared.
- **CURRENT_INTERPRETATION:** Existing binding: "producer-declared authority is present"; Core `mesr.core.authority.declared`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PG, PA; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "Authority is declared in the pack but lacks stronger supporting evidence." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve authority / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain attributed authority/context field observation only; verify applicable principal, source, scope and time separately before any authority claim. Missing context is not absent real-world authority. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `action_approved`, `authority_current`, `authority_verified`, `execution_authorized`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 03 `AUTHORITY_OUT_OF_SCOPE`

- Source / status: DECLARED_AND_BOUND_ONLY_NO_CURRENT_CORE_EMITTER_FOUND; `packages/guard-core/src/reasonCodes.ts:41`, `packages/guard-core/src/reasonCodes.ts:164`.
- **CURRENT_OBSERVATION:** Declared vocabulary and mandatory MESR binding only; no current Core/report emitter found. Declaration does not prove this check executes.
- **CURRENT_INTERPRETATION:** Existing binding: "submitted authority does not cover the recorded scope"; Core `mesr.core.boundary.authority`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PN; no current emission or rule execution established.
- **CURRENT_REPORT_WORDING:** "Submitted authority material does not cover the recorded workflow scope." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve authority / high and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** No automatic mapping from an occurrence is admitted because no current emitter is established. A separately admitted future evidence path would need: Retain attributed authority/context field observation only; verify applicable principal, source, scope and time separately before any authority claim. Missing context is not absent real-world authority. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `action_approved`, `authority_current`, `authority_verified`, `execution_authorized`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 04 `REVIEWER_MISSING`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:42`, `packages/guard-core/src/reasonCodes.ts:171`, `packages/guard-core/src/inspectEvidenceCoverage.ts:263`.
- **CURRENT_OBSERVATION:** No nonempty reviewer string.
- **CURRENT_INTERPRETATION:** Existing binding: "reviewer context is missing"; Core `mesr.core.review.review`; domain `mesr.domain.software.review.not_demonstrated`. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PA; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "Expected reviewer context is absent from submitted evidence." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve authority / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain attributed authority/context field observation only; verify applicable principal, source, scope and time separately before any authority claim. Missing context is not absent real-world authority. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `applicable_approval`, `execution_authorized`, `legally_compliant`, `reviewer_authority_verified`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 05 `OWNER_MISSING`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:43`, `packages/guard-core/src/reasonCodes.ts:178`, `packages/guard-core/src/inspectEvidenceCoverage.ts:252`.
- **CURRENT_OBSERVATION:** owner absent/empty to coverage; normal report validation rejects empty required owner.
- **CURRENT_INTERPRETATION:** Existing binding: "ownership or principal context is missing"; Core `mesr.core.actor.principal`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PA, PO, PD; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "Expected ownership context is absent from submitted evidence." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve authority / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain attributed authority/context field observation only; verify applicable principal, source, scope and time separately before any authority claim. Missing context is not absent real-world authority. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `action_approved`, `applicable_approval`, `authority_current`, `authority_verified`, `execution_authorized`, `legally_compliant`, `reviewer_authority_verified`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 06 `TIME_WINDOW_MISSING`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:44`, `packages/guard-core/src/reasonCodes.ts:185`, `packages/guard-core/src/inspectEvidenceCoverage.ts:274`.
- **CURRENT_OBSERVATION:** start_at or end_at absent.
- **CURRENT_INTERPRETATION:** Existing binding: "authority time binding is missing"; Core `mesr.core.temporal.basis`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PA; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "Authority evidence does not include a bounded time window." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve authority / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain attributed authority/context field observation only; verify applicable principal, source, scope and time separately before any authority claim. Missing context is not absent real-world authority. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `action_approved`, `authority_current`, `authority_verified`, `execution_authorized`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 07 `TIME_WINDOW_EXPIRED`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:45`, `packages/guard-core/src/reasonCodes.ts:192`, `packages/guard-core/src/inspectEvidenceCoverage.ts:288`.
- **CURRENT_OBSERVATION:** end_at precedes pack.created_at, not wall-clock/current reliance time.
- **CURRENT_INTERPRETATION:** Existing binding: "submitted authority basis is stale at evaluation time"; Core `mesr.core.temporal.basis`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** P0; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "Authority time window is present but appears no longer current." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve authority / high and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain end_at < pack.created_at after both endpoints are supplied; do not reinterpret as current reliance-time expiry. B07 evaluates future applicability separately; canonical ID and existing wording remain unchanged. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `action_approved`, `authority_current`, `authority_verified`, `execution_authorized`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 08 `OUT_OF_SCOPE_ACTION`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:46`, `packages/guard-core/src/reasonCodes.ts:199`, `packages/guard-core/src/inspectEvidenceCoverage.ts:343`.
- **CURRENT_OBSERVATION:** Action target path/resource exactly matches out_of_scope.
- **CURRENT_INTERPRETATION:** Existing binding: "recorded action exceeds declared scope"; Core `mesr.core.boundary.authority`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** P0; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "An action recorded in the pack exceeds the declared scope." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve scope / high and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Only object-form action.target path/resource is compared by exact inclusion against out_of_scope; string targets are ignored by this predicate. Preserve that bounded observation without a universal scope assessment. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `action_approved`, `authority_current`, `authority_verified`, `causal_attribution`, `execution_authorized`, `outcome_correct`, `outcome_safe`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 09 `OUT_OF_SCOPE_RESOURCE`

- Source / status: DECLARED_AND_BOUND_ONLY_NO_CURRENT_CORE_EMITTER_FOUND; `packages/guard-core/src/reasonCodes.ts:47`, `packages/guard-core/src/reasonCodes.ts:206`.
- **CURRENT_OBSERVATION:** Declared vocabulary and mandatory MESR binding only; no current Core/report emitter found. Declaration does not prove this check executes.
- **CURRENT_INTERPRETATION:** Existing binding: "touched resource exceeds declared scope"; Core `mesr.core.boundary.authority`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PN; no current emission or rule execution established.
- **CURRENT_REPORT_WORDING:** "A touched resource exceeds the declared workflow scope." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve scope / high and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** No automatic mapping from an occurrence is admitted because no current emitter is established. A separately admitted future evidence path would need: Retain exact submitted list membership/regex observation with subject and scope. Scope violation or protected-resource classification requires an admitted contextual criterion; label matching is not world-level proof. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `action_approved`, `authority_current`, `authority_verified`, `causal_attribution`, `execution_authorized`, `outcome_correct`, `outcome_safe`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 10 `PROTECTED_RESOURCE_TOUCHED`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:48`, `packages/guard-core/src/reasonCodes.ts:213`, `packages/guard-core/src/inspectEvidenceCoverage.ts:327`.
- **CURRENT_OBSERVATION:** Touched resource matches secret/credential/private/.pem/id_rsa/.env regex.
- **CURRENT_INTERPRETATION:** Existing binding: "protected-resource contact is recorded"; Core `mesr.core.action.action`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** P0; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "Evidence indicates contact with a protected resource." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve scope / high and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain exact submitted list membership/regex observation with subject and scope. Scope violation or protected-resource classification requires an admitted contextual criterion; label matching is not world-level proof. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `action_approved`, `authority_current`, `authority_verified`, `causal_attribution`, `execution_authorized`, `outcome_correct`, `outcome_safe`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 11 `UNDECLARED_FILE_CHANGE`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:49`, `packages/guard-core/src/reasonCodes.ts:220`, `packages/guard-core/src/inspectEvidenceCoverage.ts:313`.
- **CURRENT_OBSERVATION:** Changed file not exactly listed in nonempty in_scope.
- **CURRENT_INTERPRETATION:** Existing binding: "a changed file is outside the declared list or limits"; Core `mesr.core.action.action`; domain `mesr.domain.software.change.undeclared_file_observed`. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** P0; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "Changed files appear outside the declared file list or declared limits." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve scope / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain exact submitted list membership/regex observation with subject and scope. Scope violation or protected-resource classification requires an admitted contextual criterion; label matching is not world-level proof. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `action_approved`, `authority_current`, `authority_verified`, `change_correct`, `execution_authorized`, `outcome_safe`, `verification_passed`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 12 `SCOPE_TOO_BROAD`

- Source / status: DECLARED_AND_BOUND_ONLY_NO_CURRENT_CORE_EMITTER_FOUND; `packages/guard-core/src/reasonCodes.ts:50`, `packages/guard-core/src/reasonCodes.ts:227`.
- **CURRENT_OBSERVATION:** Declared vocabulary and mandatory MESR binding only; no current Core/report emitter found. Declaration does not prove this check executes.
- **CURRENT_INTERPRETATION:** Existing binding: "submitted scope is broader than the evaluated boundary"; Core `mesr.core.claim.scope`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PN; no current emission or rule execution established.
- **CURRENT_REPORT_WORDING:** "Submitted scope is broader than the expected governance boundary." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve scope / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** No automatic mapping from an occurrence is admitted because no current emitter is established. A separately admitted future evidence path would need: Retain exact submitted list membership/regex observation with subject and scope. Scope violation or protected-resource classification requires an admitted contextual criterion; label matching is not world-level proof. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `action_approved`, `applicable_approval`, `authority_current`, `authority_verified`, `execution_authorized`, `legally_compliant`, `reviewer_authority_verified`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 13 `SCOPE_INCOMPLETE`

- Source / status: DECLARED_AND_BOUND_ONLY_NO_CURRENT_CORE_EMITTER_FOUND; `packages/guard-core/src/reasonCodes.ts:51`, `packages/guard-core/src/reasonCodes.ts:234`.
- **CURRENT_OBSERVATION:** Declared vocabulary and mandatory MESR binding only; no current Core/report emitter found. Declaration does not prove this check executes.
- **CURRENT_INTERPRETATION:** Existing binding: "claim or action scope bindings are incomplete"; Core `mesr.core.claim.scope`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PN; no current emission or rule execution established.
- **CURRENT_REPORT_WORDING:** "Submitted scope material is incomplete for later interpretation." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve scope / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** No automatic mapping from an occurrence is admitted because no current emitter is established. A separately admitted future evidence path would need: Retain exact submitted list membership/regex observation with subject and scope. Scope violation or protected-resource classification requires an admitted contextual criterion; label matching is not world-level proof. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `action_approved`, `artifact_truth`, `authority_current`, `authority_verified`, `claim_correctness`, `evidence_sufficient`, `execution_authorized`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 14 `INSUFFICIENT_VERIFICATION`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:52`, `packages/guard-core/src/reasonCodes.ts:241`, `packages/guard-core/src/inspectEvidenceCoverage.ts:354`, `packages/guard-core/src/inspectEvidenceCoverage.ts:398`, `packages/guard-core/src/inspectEvidenceCoverage.ts:408`, `packages/guard-core/src/inspectEvidenceCoverage.ts:418`, `packages/guard-core/src/inspectEvidenceCoverage.ts:510`, `packages/guard-core/src/inspectEvidenceCoverage.ts:512`.
- **CURRENT_OBSERVATION:** No verification entries OR selected software test/compatibility deficiencies.
- **CURRENT_INTERPRETATION:** Existing binding: "available verification is insufficient for the requested claim"; Core `mesr.core.evidence.verification`; domain `mesr.domain.software.verification.insufficient`. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PG, PV, PD; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "Verification material is present but not strong enough for the recorded workflow." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve verification / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain zero verification records or selected software/dependency deficits. In dependency logic, the else-if no integration record after a passed integration result is unreachable; no new branch is invented. This is not profile-bound evidence.sufficient. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `change_correct`, `execution_authorized`, `outcome_safe`, `verification_passed`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 15 `TESTS_NOT_RUN`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:53`, `packages/guard-core/src/reasonCodes.ts:248`, `packages/guard-core/src/inspectEvidenceCoverage.ts:393`, `packages/guard-core/src/inspectEvidenceCoverage.ts:413`.
- **CURRENT_OBSERVATION:** Ordinary ai_software_change lacks unit/integration record, has not_run, or no passed result; failed branch takes precedence.
- **CURRENT_INTERPRETATION:** Existing binding: "test execution is not demonstrated"; Core `mesr.core.evidence.verification`; domain `mesr.domain.software.verification.test_execution_not_demonstrated`. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PG, PV, PD; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "Evidence indicates test activity did not occur." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve verification / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Ordinary ai_software_change excluding release/dependency_upgrade: distinguish no test record, explicit not_run, and no passed result after failed precedence. Inconclusive-only emits this code; pass plus not_run also emits it. This code alone cannot support verification.execution_absent or world-level tests never ran. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `change_correct`, `execution_authorized`, `outcome_safe`, `verification_passed`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 16 `TESTS_FAILED`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:54`, `packages/guard-core/src/reasonCodes.ts:255`, `packages/guard-core/src/inspectEvidenceCoverage.ts:403`.
- **CURRENT_OBSERVATION:** Eligible ordinary software workflow has any failed unit/integration test.
- **CURRENT_INTERPRETATION:** Existing binding: "submitted evidence records unsuccessful tests"; Core `mesr.core.evidence.verification`; domain `mesr.domain.software.verification.test_failure_observed`. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PG, PV, PD; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "Evidence indicates test activity ended unsuccessfully." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve verification / high and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain each actual check/event/result and method/subject/scope/time separately. Absence, not_run, failed and inconclusive are distinct; B05 governs integrity and independence. No verification claim from a code alone. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `change_correct`, `execution_authorized`, `outcome_safe`, `verification_passed`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 17 `BUILD_NOT_RUN`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:55`, `packages/guard-core/src/reasonCodes.ts:262`, `packages/guard-core/src/inspectEvidenceCoverage.ts:437`.
- **CURRENT_OBSERVATION:** Software/release/dependency workflow has no build record.
- **CURRENT_INTERPRETATION:** Existing binding: "build execution is not demonstrated"; Core `mesr.core.evidence.verification`; domain `mesr.domain.software.verification.build_execution_not_demonstrated`. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PG, PV; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "Evidence indicates build verification did not occur." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve verification / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain each actual check/event/result and method/subject/scope/time separately. Absence, not_run, failed and inconclusive are distinct; B05 governs integrity and independence. No verification claim from a code alone. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `change_correct`, `execution_authorized`, `outcome_safe`, `verification_passed`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 18 `BUILD_FAILED`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:56`, `packages/guard-core/src/reasonCodes.ts:269`, `packages/guard-core/src/inspectEvidenceCoverage.ts:446`.
- **CURRENT_OBSERVATION:** Eligible workflow has failed build OR a build record with no pass, including not_run/inconclusive.
- **CURRENT_INTERPRETATION:** Existing binding: "submitted evidence records an unsuccessful build"; Core `mesr.core.evidence.verification`; domain `mesr.domain.software.verification.build_failure_observed`. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PG, PV; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "Evidence indicates build verification ended unsuccessfully." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve verification / high and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** For ai_software_change OR release/dependency_upgrade, distinguish an actual failed build (even if another passes) from present no-pass not_run/inconclusive. Only a bound failed event supports observed failure; the code alone cannot prove build execution/failure. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `change_correct`, `execution_authorized`, `outcome_safe`, `verification_passed`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 19 `STATIC_ANALYSIS_NOT_RUN`

- Source / status: DECLARED_AND_BOUND_ONLY_NO_CURRENT_CORE_EMITTER_FOUND; `packages/guard-core/src/reasonCodes.ts:57`, `packages/guard-core/src/reasonCodes.ts:276`.
- **CURRENT_OBSERVATION:** Declared vocabulary and mandatory MESR binding only; no current Core/report emitter found. Declaration does not prove this check executes.
- **CURRENT_INTERPRETATION:** Existing binding: "static-analysis execution is not demonstrated"; Core `mesr.core.evidence.verification`; domain `mesr.domain.software.verification.static_analysis_not_demonstrated`. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PN; no current emission or rule execution established.
- **CURRENT_REPORT_WORDING:** "Expected static analysis evidence is absent." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve verification / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** No automatic mapping from an occurrence is admitted because no current emitter is established. A separately admitted future evidence path would need: Retain each actual check/event/result and method/subject/scope/time separately. Absence, not_run, failed and inconclusive are distinct; B05 governs integrity and independence. No verification claim from a code alone. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `change_correct`, `execution_authorized`, `outcome_safe`, `verification_passed`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 20 `SECURITY_SCAN_NOT_RUN`

- Source / status: DECLARED_AND_BOUND_ONLY_NO_CURRENT_CORE_EMITTER_FOUND; `packages/guard-core/src/reasonCodes.ts:58`, `packages/guard-core/src/reasonCodes.ts:283`.
- **CURRENT_OBSERVATION:** Declared vocabulary and mandatory MESR binding only; no current Core/report emitter found. Declaration does not prove this check executes.
- **CURRENT_INTERPRETATION:** Existing binding: "security-scan execution is not demonstrated"; Core `mesr.core.evidence.verification`; domain `mesr.domain.software.verification.security_scan_not_demonstrated`. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PN; no current emission or rule execution established.
- **CURRENT_REPORT_WORDING:** "Expected security scan evidence is absent." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve verification / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** No automatic mapping from an occurrence is admitted because no current emitter is established. A separately admitted future evidence path would need: Retain each actual check/event/result and method/subject/scope/time separately. Absence, not_run, failed and inconclusive are distinct; B05 governs integrity and independence. No verification claim from a code alone. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `certified`, `change_correct`, `execution_authorized`, `legally_compliant`, `outcome_safe`, `safe`, `verification_passed`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 21 `MANUAL_REVIEW_MISSING`

- Source / status: DECLARED_AND_BOUND_ONLY_NO_CURRENT_CORE_EMITTER_FOUND; `packages/guard-core/src/reasonCodes.ts:59`, `packages/guard-core/src/reasonCodes.ts:290`.
- **CURRENT_OBSERVATION:** Declared vocabulary and mandatory MESR binding only; no current Core/report emitter found. Declaration does not prove this check executes.
- **CURRENT_INTERPRETATION:** Existing binding: "expected manual review evidence is missing"; Core `mesr.core.review.review`; domain `mesr.domain.software.review.not_demonstrated`. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PN; no current emission or rule execution established.
- **CURRENT_REPORT_WORDING:** "Expected human review evidence is absent." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve verification / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** No automatic mapping from an occurrence is admitted because no current emitter is established. A separately admitted future evidence path would need: Retain each actual check/event/result and method/subject/scope/time separately. Absence, not_run, failed and inconclusive are distinct; B05 governs integrity and independence. No verification claim from a code alone. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `applicable_approval`, `execution_authorized`, `legally_compliant`, `reviewer_authority_verified`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 22 `ROLLBACK_MISSING`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:60`, `packages/guard-core/src/reasonCodes.ts:297`, `packages/guard-core/src/inspectEvidenceCoverage.ts:474`.
- **CURRENT_OBSERVATION:** Release lacks passed rollback_check and either lacks record or has not_run record.
- **CURRENT_INTERPRETATION:** Existing binding: "rollback evidence is missing"; Core `mesr.core.evidence.item`; domain `mesr.domain.software.release.rollback_not_demonstrated`. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PR, PD; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "Rollback evidence is absent for a release-oriented workflow." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve release_rollback / high and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Release and no passed rollback_check: no rollback record OR any not_run record selects this code. A failed plus not_run mixture still selects MISSING; any pass suppresses both rollback reasons. No absence of all rollback plans/capability inferred. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `causal_attribution`, `change_correct`, `execution_authorized`, `outcome_correct`, `outcome_safe`, `verification_passed`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 23 `ROLLBACK_UNVERIFIED`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:61`, `packages/guard-core/src/reasonCodes.ts:304`, `packages/guard-core/src/inspectEvidenceCoverage.ts:475`.
- **CURRENT_OBSERVATION:** Release has rollback record, no pass and no not_run.
- **CURRENT_INTERPRETATION:** Existing binding: "rollback material lacks required verification"; Core `mesr.core.evidence.verification`; domain `mesr.domain.software.release.rollback_not_verified`. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PR, PD; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "Rollback material is present but not verified strongly enough." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve release_rollback / high and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Release with rollback record, no passed and no not_run selects this code (failed/inconclusive). Retain actual event result separately; do not infer a performed failed rollback, recovery success or independent checking. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `causal_attribution`, `change_correct`, `execution_authorized`, `outcome_correct`, `outcome_safe`, `verification_passed`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 24 `RELEASE_TARGET_UNCLEAR`

- Source / status: DECLARED_AND_BOUND_ONLY_NO_CURRENT_CORE_EMITTER_FOUND; `packages/guard-core/src/reasonCodes.ts:62`, `packages/guard-core/src/reasonCodes.ts:311`.
- **CURRENT_OBSERVATION:** Declared vocabulary and mandatory MESR binding only; no current Core/report emitter found. Declaration does not prove this check executes.
- **CURRENT_INTERPRETATION:** Existing binding: "release target binding is unclear"; Core `mesr.core.claim.scope`; domain `mesr.domain.software.release.target_unclear`. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PN; no current emission or rule execution established.
- **CURRENT_REPORT_WORDING:** "Release target details are incomplete or unclear." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve release_rollback / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** No automatic mapping from an occurrence is admitted because no current emitter is established. A separately admitted future evidence path would need: Retain release-context policy need separately from rollback event occurrence/result and target/environment bindings. No recovery capability or successful rollback inference without actual checks. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `action_approved`, `authority_current`, `authority_verified`, `causal_attribution`, `execution_authorized`, `outcome_correct`, `outcome_safe`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 25 `PRODUCTION_ENVIRONMENT_UNVERIFIED`

- Source / status: DECLARED_AND_BOUND_ONLY_NO_CURRENT_CORE_EMITTER_FOUND; `packages/guard-core/src/reasonCodes.ts:63`, `packages/guard-core/src/reasonCodes.ts:318`.
- **CURRENT_OBSERVATION:** Declared vocabulary and mandatory MESR binding only; no current Core/report emitter found. Declaration does not prove this check executes.
- **CURRENT_INTERPRETATION:** Existing binding: "production-environment claim is not sufficiently verified"; Core `mesr.core.evidence.verification`; domain `mesr.domain.software.deployment.environment_not_verified`. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PN; no current emission or rule execution established.
- **CURRENT_REPORT_WORDING:** "Production environment material is not sufficiently verified." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve release_rollback / high and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** No automatic mapping from an occurrence is admitted because no current emitter is established. A separately admitted future evidence path would need: Retain release-context policy need separately from rollback event occurrence/result and target/environment bindings. No recovery capability or successful rollback inference without actual checks. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `causal_attribution`, `change_correct`, `execution_authorized`, `outcome_correct`, `outcome_safe`, `verification_passed`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 26 `BLOCKED_ACTION_PRESENT`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:64`, `packages/guard-core/src/reasonCodes.ts:325`, `packages/guard-core/src/inspectEvidenceCoverage.ts:619`.
- **CURRENT_OBSERVATION:** Nonempty blocked actions; critical item can drive report block.
- **CURRENT_INTERPRETATION:** Existing binding: "a halted or blocked action is recorded"; Core `mesr.core.action.action`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PG, PB; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "A halted action appears in submitted evidence." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve tool_action / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain attributed tool/action/block record and exact scoped source mapping; attempt/blocked status is not successful effect, verified cause, safety or authority. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `action_approved`, `authority_current`, `authority_verified`, `causal_attribution`, `execution_authorized`, `outcome_correct`, `outcome_safe`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 27 `DESTRUCTIVE_COMMAND_ATTEMPTED`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:65`, `packages/guard-core/src/reasonCodes.ts:332`, `packages/guard-core/src/inspectEvidenceCoverage.ts:104`.
- **CURRENT_OBSERVATION:** Explicit mapping from blocked action DESTRUCTIVE_COMMAND.
- **CURRENT_INTERPRETATION:** Existing binding: "a destructive command attempt is recorded"; Core `mesr.core.action.tool_invocation`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PB; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "Evidence indicates an attempted destructive command." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve tool_action / high and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain attributed tool/action/block record and exact scoped source mapping; attempt/blocked status is not successful effect, verified cause, safety or authority. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `action_approved`, `authority_current`, `authority_verified`, `causal_attribution`, `execution_authorized`, `outcome_correct`, `outcome_safe`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 28 `SECRET_ACCESS_ATTEMPTED`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:66`, `packages/guard-core/src/reasonCodes.ts:339`, `packages/guard-core/src/inspectEvidenceCoverage.ts:106`.
- **CURRENT_OBSERVATION:** Explicit mapping from blocked action SECRET_ACCESS.
- **CURRENT_INTERPRETATION:** Existing binding: "a secret-access attempt is recorded"; Core `mesr.core.action.tool_invocation`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PB; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "Evidence indicates an attempted secret-access operation." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve tool_action / high and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain attributed tool/action/block record and exact scoped source mapping; attempt/blocked status is not successful effect, verified cause, safety or authority. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `action_approved`, `authority_current`, `authority_verified`, `causal_attribution`, `execution_authorized`, `outcome_correct`, `outcome_safe`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 29 `NETWORK_ACCESS_ATTEMPTED`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:67`, `packages/guard-core/src/reasonCodes.ts:346`, `packages/guard-core/src/inspectEvidenceCoverage.ts:108`.
- **CURRENT_OBSERVATION:** Explicit mapping from blocked action NETWORK_NOT_ALLOWED.
- **CURRENT_INTERPRETATION:** Existing binding: "a network-access attempt is recorded"; Core `mesr.core.action.tool_invocation`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PB; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "Evidence indicates an attempted network operation." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve tool_action / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain attributed tool/action/block record and exact scoped source mapping; attempt/blocked status is not successful effect, verified cause, safety or authority. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `action_approved`, `authority_current`, `authority_verified`, `causal_attribution`, `execution_authorized`, `outcome_correct`, `outcome_safe`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 30 `UNSAFE_GIT_OPERATION`

- Source / status: DECLARED_AND_BOUND_ONLY_NO_CURRENT_CORE_EMITTER_FOUND; `packages/guard-core/src/reasonCodes.ts:68`, `packages/guard-core/src/reasonCodes.ts:353`.
- **CURRENT_OBSERVATION:** Declared vocabulary and mandatory MESR binding only; no current Core/report emitter found. Declaration does not prove this check executes.
- **CURRENT_INTERPRETATION:** Existing binding: "a Git operation with elevated concern is recorded"; Core `mesr.core.action.tool_invocation`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PN; no current emission or rule execution established.
- **CURRENT_REPORT_WORDING:** "Evidence indicates a Git operation with elevated safety concern." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve tool_action / high and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** No automatic mapping from an occurrence is admitted because no current emitter is established. A separately admitted future evidence path would need: Retain attributed tool/action/block record and exact scoped source mapping; attempt/blocked status is not successful effect, verified cause, safety or authority. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `action_approved`, `authority_current`, `authority_verified`, `causal_attribution`, `execution_authorized`, `outcome_correct`, `outcome_safe`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 31 `TOOL_OUTPUT_MISSING`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:69`, `packages/guard-core/src/reasonCodes.ts:360`, `packages/guard-core/src/inspectEvidenceCoverage.ts:631`.
- **CURRENT_OBSERVATION:** Tool output_summary null/empty.
- **CURRENT_INTERPRETATION:** Existing binding: "expected tool-output evidence is missing"; Core `mesr.core.evidence.item`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** P0; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "A recorded tool interaction lacks expected output material." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve tool_action / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain attributed tool/action/block record and exact scoped source mapping; attempt/blocked status is not successful effect, verified cause, safety or authority. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `artifact_truth`, `change_correct`, `claim_correctness`, `evidence_sufficient`, `execution_authorized`, `outcome_safe`, `verification_passed`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 32 `COMMAND_RESULT_MISSING`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:70`, `packages/guard-core/src/reasonCodes.ts:367`, `packages/guard-core/src/inspectEvidenceCoverage.ts:637`.
- **CURRENT_OBSERVATION:** Truthy command and outputs coerces to empty record; non-object captured output can trigger.
- **CURRENT_INTERPRETATION:** Existing binding: "expected command-result evidence is missing"; Core `mesr.core.evidence.item`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** P0; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "A recorded command interaction lacks expected result material." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve tool_action / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Truthy command plus outputs coercing to an empty object can include a captured string/array result. Retain original output type/value; do not infer command did not run or returned no output. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `artifact_truth`, `change_correct`, `claim_correctness`, `evidence_sufficient`, `execution_authorized`, `outcome_safe`, `verification_passed`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 33 `HIGH_RISK_DATA`

- Source / status: DECLARED_AND_BOUND_ONLY_NO_CURRENT_CORE_EMITTER_FOUND; `packages/guard-core/src/reasonCodes.ts:71`, `packages/guard-core/src/reasonCodes.ts:374`.
- **CURRENT_OBSERVATION:** Declared vocabulary and mandatory MESR binding only; no current Core/report emitter found. Declaration does not prove this check executes.
- **CURRENT_INTERPRETATION:** Existing binding: "submitted evidence identifies high-risk-data interaction"; Core `mesr.core.evidence.observation`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PN; no current emission or rule execution established.
- **CURRENT_REPORT_WORDING:** "Submitted evidence indicates interaction with high-risk data." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve data_security / high and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** No automatic mapping from an occurrence is admitted because no current emitter is established. A separately admitted future evidence path would need: Retain submitted security context or policy requirement; independently evidenced threat/remediation properties and authorization need their own bound criteria. No safety, review absence or compliance inference. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `action_approved`, `authority_current`, `authority_verified`, `certified`, `execution_authorized`, `legally_compliant`, `safe`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 34 `DATA_SENSITIVITY_UNKNOWN`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:72`, `packages/guard-core/src/reasonCodes.ts:381`, `packages/guard-core/src/inspectEvidenceCoverage.ts:299`.
- **CURRENT_OBSERVATION:** Scope sensitivity unknown or absent to coverage.
- **CURRENT_INTERPRETATION:** Existing binding: "data-sensitivity binding is unknown"; Core `mesr.core.claim.scope`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** P0; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "Data sensitivity context is absent or unclear." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve data_security / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain submitted security context or policy requirement; independently evidenced threat/remediation properties and authorization need their own bound criteria. No safety, review absence or compliance inference. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `artifact_truth`, `certified`, `claim_correctness`, `evidence_sufficient`, `execution_authorized`, `legally_compliant`, `safe`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 35 `CREDENTIAL_RISK`

- Source / status: DECLARED_AND_BOUND_ONLY_NO_CURRENT_CORE_EMITTER_FOUND; `packages/guard-core/src/reasonCodes.ts:73`, `packages/guard-core/src/reasonCodes.ts:388`.
- **CURRENT_OBSERVATION:** Declared vocabulary and mandatory MESR binding only; no current Core/report emitter found. Declaration does not prove this check executes.
- **CURRENT_INTERPRETATION:** Existing binding: "credential-handling risk is recorded"; Core `mesr.core.actor.identity_assertion`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PN; no current emission or rule execution established.
- **CURRENT_REPORT_WORDING:** "Evidence indicates credential-handling risk." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve data_security / high and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** No automatic mapping from an occurrence is admitted because no current emitter is established. A separately admitted future evidence path would need: Retain submitted security context or policy requirement; independently evidenced threat/remediation properties and authorization need their own bound criteria. No safety, review absence or compliance inference. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `action_approved`, `authority_current`, `authority_verified`, `certified`, `execution_authorized`, `legally_compliant`, `safe`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 36 `EXFILTRATION_RISK`

- Source / status: DECLARED_AND_BOUND_ONLY_NO_CURRENT_CORE_EMITTER_FOUND; `packages/guard-core/src/reasonCodes.ts:74`, `packages/guard-core/src/reasonCodes.ts:395`.
- **CURRENT_OBSERVATION:** Declared vocabulary and mandatory MESR binding only; no current Core/report emitter found. Declaration does not prove this check executes.
- **CURRENT_INTERPRETATION:** Existing binding: "evidence records possible exfiltration risk"; Core `mesr.core.evidence.observation`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PN; no current emission or rule execution established.
- **CURRENT_REPORT_WORDING:** "Evidence indicates possible exfiltration risk." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve data_security / critical and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** No automatic mapping from an occurrence is admitted because no current emitter is established. A separately admitted future evidence path would need: Retain submitted security context or policy requirement; independently evidenced threat/remediation properties and authorization need their own bound criteria. No safety, review absence or compliance inference. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `causal_attribution`, `certified`, `execution_authorized`, `legally_compliant`, `outcome_correct`, `outcome_safe`, `safe`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 37 `SECURITY_PATCH_SCOPE_UNCLEAR`

- Source / status: DECLARED_AND_BOUND_ONLY_NO_CURRENT_CORE_EMITTER_FOUND; `packages/guard-core/src/reasonCodes.ts:75`, `packages/guard-core/src/reasonCodes.ts:402`.
- **CURRENT_OBSERVATION:** Declared vocabulary and mandatory MESR binding only; no current Core/report emitter found. Declaration does not prove this check executes.
- **CURRENT_INTERPRETATION:** Existing binding: "security-patch scope is unclear"; Core `mesr.core.claim.scope`; domain `mesr.domain.software.change.diff_scope`. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PN; no current emission or rule execution established.
- **CURRENT_REPORT_WORDING:** "Security patch evidence does not define a clear remediation scope." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve data_security / high and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** No automatic mapping from an occurrence is admitted because no current emitter is established. A separately admitted future evidence path would need: Retain submitted security context or policy requirement; independently evidenced threat/remediation properties and authorization need their own bound criteria. No safety, review absence or compliance inference. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `action_approved`, `authority_current`, `authority_verified`, `certified`, `change_correct`, `execution_authorized`, `legally_compliant`, `outcome_safe`, `safe`, `verification_passed`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 38 `CYBER_AUTHORIZATION_REQUIRED`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:76`, `packages/guard-core/src/reasonCodes.ts:409`, `packages/guard-core/src/inspectEvidenceCoverage.ts:535`, `packages/guard-core/src/generateGovernanceReport.ts:642`.
- **CURRENT_OBSERVATION:** cyber_remediation authorization_status is not provided; no independent authority check.
- **CURRENT_INTERPRETATION:** Existing binding: "stronger applicable authorization evidence is required"; Core `mesr.core.boundary.authority`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PA, PS, PD; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "Cyber-oriented workflow evidence calls for stronger authorization material." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve data_security / critical and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain submitted security context or policy requirement; independently evidenced threat/remediation properties and authorization need their own bound criteria. No safety, review absence or compliance inference. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `action_approved`, `authority_current`, `authority_verified`, `certified`, `execution_authorized`, `legally_compliant`, `safe`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 39 `EVIDENCE_INCOMPLETE`

- Source / status: DECLARED_AND_BOUND_ONLY_NO_CURRENT_CORE_EMITTER_FOUND; `packages/guard-core/src/reasonCodes.ts:77`, `packages/guard-core/src/reasonCodes.ts:416`.
- **CURRENT_OBSERVATION:** Declared vocabulary and mandatory MESR binding only; no current Core/report emitter found. Declaration does not prove this check executes.
- **CURRENT_INTERPRETATION:** Existing binding: "evidence is incomplete for the requested interpretation"; Core `mesr.core.evidence.item`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PN; no current emission or rule execution established.
- **CURRENT_REPORT_WORDING:** "Submitted evidence is structurally present but incomplete for stronger interpretation." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve evidence_integrity / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** No automatic mapping from an occurrence is admitted because no current emitter is established. A separately admitted future evidence path would need: Retain submitted evidence/manifest/producer/reference observation, then require B05 byte/custody checks and B06 claim/profile coverage separately. Presence, path and count are not sufficiency or truth. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `artifact_truth`, `claim_correctness`, `evidence_sufficient`, `execution_authorized`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 40 `MANIFEST_INCOMPLETE`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:78`, `packages/guard-core/src/reasonCodes.ts:423`, `packages/guard-core/src/inspectEvidenceCoverage.ts:551`.
- **CURRENT_OBSERVATION:** Manifest partial/incomplete/unknown OR empty files array.
- **CURRENT_INTERPRETATION:** Existing binding: "evidence inventory is incomplete"; Core `mesr.core.evidence.item`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PG, PP; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "Manifest completeness indicates omitted or partial evidence inventory." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve evidence_integrity / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain submitted evidence/manifest/producer/reference observation, then require B05 byte/custody checks and B06 claim/profile coverage separately. Presence, path and count are not sufficiency or truth. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `artifact_truth`, `claim_correctness`, `evidence_sufficient`, `execution_authorized`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 41 `ARTIFACT_MISSING`

- Source / status: DECLARED_AND_BOUND_ONLY_NO_CURRENT_CORE_EMITTER_FOUND; `packages/guard-core/src/reasonCodes.ts:79`, `packages/guard-core/src/reasonCodes.ts:430`.
- **CURRENT_OBSERVATION:** Declared vocabulary and mandatory MESR binding only; no current Core/report emitter found. Declaration does not prove this check executes.
- **CURRENT_INTERPRETATION:** Existing binding: "an expected artifact is missing"; Core `mesr.core.evidence.item`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PN; no current emission or rule execution established.
- **CURRENT_REPORT_WORDING:** "An expected artifact is absent from submitted evidence." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve evidence_integrity / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** No automatic mapping from an occurrence is admitted because no current emitter is established. A separately admitted future evidence path would need: Retain submitted evidence/manifest/producer/reference observation, then require B05 byte/custody checks and B06 claim/profile coverage separately. Presence, path and count are not sufficiency or truth. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `artifact_truth`, `claim_correctness`, `evidence_sufficient`, `execution_authorized`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 42 `ARTIFACT_HASH_MISSING`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:80`, `packages/guard-core/src/reasonCodes.ts:437`, `packages/guard-core/src/inspectEvidenceCoverage.ts:563`.
- **CURRENT_OBSERVATION:** Missing artifact sha256 to coverage; normal report validator rejects missing hash first.
- **CURRENT_INTERPRETATION:** Existing binding: "stable artifact-integrity binding is missing"; Core `mesr.core.provenance.lineage`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PP; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "An artifact reference is present without stable hash material." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve evidence_integrity / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain submitted evidence/manifest/producer/reference observation, then require B05 byte/custody checks and B06 claim/profile coverage separately. Presence, path and count are not sufficiency or truth. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `artifact_truth`, `claim_correctness`, `evidence_sufficient`, `execution_authorized`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 43 `ARTIFACT_REF_UNRESOLVED`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:81`, `packages/guard-core/src/reasonCodes.ts:444`, `packages/guard-core/src/inspectEvidenceCoverage.ts:592`.
- **CURRENT_OBSERVATION:** Tool/verification/authorization ref absent from artifact IDs except art_manifest bypass.
- **CURRENT_INTERPRETATION:** Existing binding: "an artifact reference is unresolvable"; Core `mesr.core.provenance.lineage`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PP; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "An artifact reference cannot be resolved within submitted evidence." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve evidence_integrity / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain submitted evidence/manifest/producer/reference observation, then require B05 byte/custody checks and B06 claim/profile coverage separately. Presence, path and count are not sufficiency or truth. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `artifact_truth`, `claim_correctness`, `evidence_sufficient`, `execution_authorized`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 44 `PROVENANCE_MISSING`

- Source / status: DECLARED_AND_BOUND_ONLY_NO_CURRENT_CORE_EMITTER_FOUND; `packages/guard-core/src/reasonCodes.ts:82`, `packages/guard-core/src/reasonCodes.ts:451`.
- **CURRENT_OBSERVATION:** Declared vocabulary and mandatory MESR binding only; no current Core/report emitter found. Declaration does not prove this check executes.
- **CURRENT_INTERPRETATION:** Existing binding: "required lineage is missing"; Core `mesr.core.provenance.lineage`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PN; no current emission or rule execution established.
- **CURRENT_REPORT_WORDING:** "Provenance material is absent from submitted evidence." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve evidence_integrity / high and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** No automatic mapping from an occurrence is admitted because no current emitter is established. A separately admitted future evidence path would need: Retain submitted evidence/manifest/producer/reference observation, then require B05 byte/custody checks and B06 claim/profile coverage separately. Presence, path and count are not sufficiency or truth. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `artifact_truth`, `claim_correctness`, `evidence_sufficient`, `execution_authorized`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 45 `PRODUCER_IDENTITY_UNKNOWN`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:83`, `packages/guard-core/src/reasonCodes.ts:458`, `packages/guard-core/src/inspectEvidenceCoverage.ts:607`, `packages/guard-core/src/inspectEvidenceCoverage.ts:645`.
- **CURRENT_OBSERVATION:** Missing producer id/name/generated_by OR missing source_pack_hash; validator constrains normal-path reachability.
- **CURRENT_INTERPRETATION:** Existing binding: "producer identity is unknown"; Core `mesr.core.provenance.producer`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PP; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "Producer identity is absent or cannot be established from submitted evidence." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve evidence_integrity / high and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Distinguish producer metadata missing from source_pack_hash missing. The latter is not proof actor identity is unknown; supplied names/hash are not verified identity or custody. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `artifact_truth`, `change_correct`, `claim_correctness`, `evidence_sufficient`, `execution_authorized`, `outcome_safe`, `verification_passed`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 46 `NON_DETERMINISTIC_PRODUCER`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:84`, `packages/guard-core/src/reasonCodes.ts:465`, `packages/guard-core/src/inspectEvidenceCoverage.ts:615`.
- **CURRENT_OBSERVATION:** provenance.deterministic is not true; no replay comparison.
- **CURRENT_INTERPRETATION:** Existing binding: "producer generation may be non-deterministic"; Core `mesr.core.provenance.producer`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** P0; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "Producer metadata indicates evidence generation may not be deterministic." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve evidence_integrity / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain provenance.deterministic != true declaration check. No replay comparison is performed; code presence does not prove actual nondeterminism. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `artifact_truth`, `change_correct`, `claim_correctness`, `evidence_sufficient`, `execution_authorized`, `outcome_safe`, `verification_passed`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 47 `DEPENDENCY_CHANGE_DETECTED`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:85`, `packages/guard-core/src/reasonCodes.ts:472`, `packages/guard-core/src/inspectEvidenceCoverage.ts:484`.
- **CURRENT_OBSERVATION:** workflow_type equals dependency_upgrade; no actual dependency diff required.
- **CURRENT_INTERPRETATION:** Existing binding: "a dependency-oriented change is recorded"; Core `mesr.core.effect.state_transition`; domain `mesr.domain.software.change.dependency_observed`. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PO; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "Evidence indicates a dependency-oriented software change." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve dependency_change / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain workflow_type=dependency_upgrade as declared scenario only; a concrete before/after dependency diff must separately establish a change. No dependency diff is required by the current emitter. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `causal_attribution`, `change_correct`, `execution_authorized`, `outcome_correct`, `outcome_safe`, `verification_passed`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 48 `BREAKING_CHANGE_UNVERIFIED`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:86`, `packages/guard-core/src/reasonCodes.ts:479`, `packages/guard-core/src/inspectEvidenceCoverage.ts:505`, `packages/guard-core/src/inspectEvidenceCoverage.ts:656`.
- **CURRENT_OBSERVATION:** Dependency workflow lacks integration pass OR repository.branch absent.
- **CURRENT_INTERPRETATION:** Existing binding: "breaking-impact verification is missing or insufficient"; Core `mesr.core.evidence.verification`; domain `mesr.domain.software.change.breaking_impact_not_verified`. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PV, PO; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "Evidence suggests possible breaking change impact without strong verification." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve dependency_change / high and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Split lack of integration pass from missing repository.branch (including string-form repository). Neither proves actual breaking change; future impact claim requires actual change and compatible subject/environment/method evidence. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `causal_attribution`, `change_correct`, `execution_authorized`, `outcome_correct`, `outcome_safe`, `verification_passed`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 49 `LOCKFILE_CHANGED`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:87`, `packages/guard-core/src/reasonCodes.ts:486`, `packages/guard-core/src/inspectEvidenceCoverage.ts:490`.
- **CURRENT_OBSERVATION:** Dependency changed_files matches lockfile/package-lock.json/pnpm-lock.yaml/yarn.lock regex.
- **CURRENT_INTERPRETATION:** Existing binding: "a lockfile change is recorded"; Core `mesr.core.effect.state_transition`; domain `mesr.domain.software.change.lockfile_observed`. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** P0; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "Evidence indicates lockfile material changed during the workflow." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve dependency_change / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain regex match against submitted changed_files, not verified changed bytes or actual dependency resolution. Require before/after artifacts for a world-level change claim. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `causal_attribution`, `change_correct`, `execution_authorized`, `outcome_correct`, `outcome_safe`, `verification_passed`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 50 `MIGRATION_NOT_DOCUMENTED`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:88`, `packages/guard-core/src/reasonCodes.ts:493`, `packages/guard-core/src/inspectEvidenceCoverage.ts:523`.
- **CURRENT_OBSERVATION:** Dependency has no artifact path/description matching migration or upgrade.
- **CURRENT_INTERPRETATION:** Existing binding: "expected migration evidence is missing"; Core `mesr.core.evidence.item`; domain `mesr.domain.software.change.migration_not_documented`. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** P0; apply shared precedence and conditional context above.
- **CURRENT_REPORT_WORDING:** "Migration-oriented evidence is expected but absent." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve dependency_change / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain absence of migration/upgrade regex match in artifact path/description. Existing prose could be present elsewhere; a matching filename does not prove adequate migration instructions. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `artifact_truth`, `change_correct`, `claim_correctness`, `evidence_sufficient`, `execution_authorized`, `outcome_safe`, `verification_passed`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 51 `PUBLIC_API_CHANGE_UNVERIFIED`

- Source / status: DECLARED_AND_BOUND_ONLY_NO_CURRENT_CORE_EMITTER_FOUND; `packages/guard-core/src/reasonCodes.ts:89`, `packages/guard-core/src/reasonCodes.ts:500`.
- **CURRENT_OBSERVATION:** Declared vocabulary and mandatory MESR binding only; no current Core/report emitter found. Declaration does not prove this check executes.
- **CURRENT_INTERPRETATION:** Existing binding: "public-API impact is not sufficiently verified"; Core `mesr.core.evidence.verification`; domain `mesr.domain.software.change.public_api_impact_not_verified`. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PN; no current emission or rule execution established.
- **CURRENT_REPORT_WORDING:** "Evidence indicates public API change without strong verification." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve dependency_change / high and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** No automatic mapping from an occurrence is admitted because no current emitter is established. A separately admitted future evidence path would need: Retain dependency workflow labels, listed paths and verification context; actual diff, API impact, migration adequacy and compatibility need subject-bound evidence/methods, not regex or labels. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `causal_attribution`, `change_correct`, `execution_authorized`, `outcome_correct`, `outcome_safe`, `verification_passed`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 52 `HUMAN_REVIEW_REQUIRED`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:90`, `packages/guard-core/src/reasonCodes.ts:507`, `packages/guard-core/src/generateGovernanceReport.ts:341`.
- **CURRENT_OBSERVATION:** Selected coverage triggers: authority, test/build deficiency, incomplete manifest, blocked activity.
- **CURRENT_INTERPRETATION:** Existing binding: "human review is requested by current reasoning"; Core `mesr.core.review.review`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** Emitted by PG; required=true contributes require_review after block/inconclusive precedence and generates request_review next-action. Completed review status is not used to clear it.
- **CURRENT_REPORT_WORDING:** "Later governance flow may call for human review." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve human_review / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain current review recommendation and its policy trigger. Review occurrence, applicability, reviewer authority and acceptance each require separate evidence; required is not never occurred. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `applicable_approval`, `execution_authorized`, `legally_compliant`, `reviewer_authority_verified`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 53 `SECURITY_REVIEW_REQUIRED`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:91`, `packages/guard-core/src/reasonCodes.ts:514`, `packages/guard-core/src/generateGovernanceReport.ts:354`.
- **CURRENT_OBSERVATION:** Cyber pack OR security_patch workflow OR cyber authorization reason; does not test review absence.
- **CURRENT_INTERPRETATION:** Existing binding: "security-oriented review is requested"; Core `mesr.core.review.review`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** Emitted by PS; required=true contributes require_review after block/inconclusive precedence and generates request_review next-action. Completed review status is not used to clear it.
- **CURRENT_REPORT_WORDING:** "Later governance flow may call for security-oriented review." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve human_review / high and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain workflow-derived review request even when human_review.status=completed. Establish review occurrence or absence only from separately bound event evidence; never interpret this code as proof security review did not occur. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `applicable_approval`, `certified`, `execution_authorized`, `legally_compliant`, `reviewer_authority_verified`, `safe`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 54 `OWNER_REVIEW_REQUIRED`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:92`, `packages/guard-core/src/reasonCodes.ts:521`, `packages/guard-core/src/generateGovernanceReport.ts:369`, `packages/guard-core/src/generateGovernanceReport.ts:397`.
- **CURRENT_OBSERVATION:** Dependency/impact reason in dependency workflow OR missing owner on release/security/dependency workflow.
- **CURRENT_INTERPRETATION:** Existing binding: "owner review is requested"; Core `mesr.core.review.review`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** Emitted by PO; required=true contributes require_review after block/inconclusive precedence and generates request_review next-action. Completed review status is not used to clear it.
- **CURRENT_REPORT_WORDING:** "Later governance flow may call for owner review." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve human_review / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain current review recommendation and its policy trigger. Review occurrence, applicability, reviewer authority and acceptance each require separate evidence; required is not never occurred. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `applicable_approval`, `execution_authorized`, `legally_compliant`, `reviewer_authority_verified`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 55 `RELEASE_REVIEW_REQUIRED`

- Source / status: IMPLEMENTED_TRIGGER; `packages/guard-core/src/reasonCodes.ts:93`, `packages/guard-core/src/reasonCodes.ts:528`, `packages/guard-core/src/generateGovernanceReport.ts:384`.
- **CURRENT_OBSERVATION:** Release has missing/unverified rollback.
- **CURRENT_INTERPRETATION:** Existing binding: "release-oriented review is requested"; Core `mesr.core.review.review`; domain `mesr.domain.software.review.not_demonstrated`. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** Emitted by PR; required=true contributes require_review after block/inconclusive precedence and generates request_review next-action. Completed review status is not used to clear it.
- **CURRENT_REPORT_WORDING:** "Later governance flow may call for release review." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve human_review / high and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** Retain current review recommendation and its policy trigger. Review occurrence, applicability, reviewer authority and acceptance each require separate evidence; required is not never occurred. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `applicable_approval`, `execution_authorized`, `legally_compliant`, `reviewer_authority_verified`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

### 56 `CUSTOMER_REVIEW_REQUIRED`

- Source / status: DECLARED_AND_BOUND_ONLY_NO_CURRENT_CORE_EMITTER_FOUND; `packages/guard-core/src/reasonCodes.ts:94`, `packages/guard-core/src/reasonCodes.ts:535`.
- **CURRENT_OBSERVATION:** Declared vocabulary and mandatory MESR binding only; no current Core/report emitter found. Declaration does not prove this check executes.
- **CURRENT_INTERPRETATION:** Existing binding: "customer-facing review is requested"; Core `mesr.core.review.review`; domain null. This is existing interpretation vocabulary, not an independent witness.
- **CURRENT_POLICY_EFFECT:** PN; no current emission or rule execution established.
- **CURRENT_REPORT_WORDING:** "Later governance flow may call for customer-facing review." Exact existing definition; shared review/next-action/first-three explanation rules above apply only where emitted. Preserve human_review / medium and serialized code/order.
- **FUTURE_SEMANTIC_MAPPING:** No automatic mapping from an occurrence is admitted because no current emitter is established. A separately admitted future evidence path would need: Retain current review recommendation and its policy trigger. Review occurrence, applicability, reviewer authority and acceptance each require separate evidence; required is not never occurred. Use the versioned ADR 0012 envelope and B01 admission, never an alias or in-place redefinition.
- **NONCLAIMS:** Preserve current binding exclusions: `applicable_approval`, `execution_authorized`, `legally_compliant`, `reviewer_authority_verified`. Code presence alone establishes neither world-level truth nor an event absent from the source; no independent verification, institutional acceptance or execution permission. Missing repaired basis remains UNRESOLVED; prohibited inference is UNSUPPORTED for that path under B02.

## Falsifiers and compatibility acceptance (NOT_EXECUTED)

| ID | Input distinction | Current behavior to preserve / future interpretation oracle |
|---|---|---|
| R01 | Ordinary software test records absent vs explicit not_run vs inconclusive-only | All can emit TESTS_NOT_RUN; missing event -> UNRESOLVED, not synthetic not_run/failed. Retain explicit result separately. |
| R02 | Any failed test, including mixture with pass; pass plus not_run without failed | Failed branch emits TESTS_FAILED; second mixture emits TESTS_NOT_RUN. Do not rewrite precedence to improve the label. |
| R03 | Build not_run/inconclusive without pass vs failed plus pass | Both can emit BUILD_FAILED; future failure claim requires the actual failed event, not code text. |
| R04 | Cyber/security workflow with completed human review | SECURITY_REVIEW_REQUIRED persists; no inference review never occurred. |
| R05 | Dependency workflow with no actual dependency diff | DEPENDENCY_CHANGE_DETECTED persists; actual change UNRESOLVED without diff. |
| R06 | Missing repository.branch but passing integration check | BREAKING_CHANGE_UNVERIFIED can persist; no proven breaking change or failed check. |
| R07 | Migration-like filename without adequate content, or content without matching filename | Keep regex result; no content adequacy/absence claim from path test. |
| R08 | Release rollback absent, failed, inconclusive, not_run, mixed failed/not_run, or any pass | MISSING vs UNVERIFIED follows exact branches above; any pass suppresses both; no world recovery guarantee. |
| R09 | Declaration-only reason has binding and English description | No executed check claimed or invented; serialized list stays 56. |
| R10 | Hash/producer metadata missing before normal validation; direct coverage call | Preserve validation-first rejection vs direct coverage finding; do not invent a generated report for invalid canonical input. |
| R11 | Artifact reference art_manifest; three mapped blocked source labels | Preserve scoped bypass/translations; no global aliases. |
| R12 | Bound producer status/hash/old time with no independent/current/sufficiency basis | B05/B06/B07 requested claims UNRESOLVED; old reason wording/report remains identical. |
| R13 | Caller attempts to turn a legacy binding or policy requirement into a fact against Core nonclaim | Excluded inference UNSUPPORTED; canonical IDs, nonclaims and B03 missing-fact rules retained. |
| R14 | Complete emitted reason stream and declaration list | Declaration/binding order preserved separately from dynamic insertion order; JSON/MD/HTML/evidence-index output and severity unchanged. |

Source fixture review: [missing tests report](../../examples/reports/ai-pr-missing-tests.md), [dependency report](../../examples/reports/dependency-upgrade-breaking-change.md), canonical fixtures referenced in V8-000, [reason binding verifier](../../scripts/verify_mesr_reason_bindings.mjs), and [outcome contract verifier](../../scripts/verify_outcome_foundation_contract.mjs). Generic 56-code binding checks are not proof of every emitter branch. [Renderers](../../packages/renderer-md/src/renderMarkdownReport.ts) and [HTML](../../packages/renderer-html/src/renderHtmlReport.ts) display existing model fields; [evidence index](../../packages/guard-core/src/generateEvidenceIndex.ts) carries reasons/explanations without granting support. No runtime tests or repaired Experiment 3 were executed here.

B04 = PASS for this source-backed specification. Audit output/verdict/exit and deny 25 unchanged; permit/classify unchanged; recommendation-only, additive-only, non-executing, default-off; no authority scope expansion. No canonical ID/alias admission, code change or report migration. Gate 1 remains BLOCKED; B09/B10 not started.
