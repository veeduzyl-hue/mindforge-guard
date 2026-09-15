# ADR 0014: Profile-bound evidence sufficiency and report boundary

- Status: B06 architecture decision, 2026-09-15; SPECIFICATION_ONLY.
- Decision: **VERSIONED_SIDE_ARTIFACT**. GovernanceReportModel 1.0.0 remains unchanged; no report migration in Phase B.
- Inputs: [B02](0011-mesr-claim-nonclaim-state-and-binding-contract.md), [B04](0012-reason-semantic-domain-policy-separation-contract.md), [B05](0013-independent-verification-and-integrity-evidence-contract.md), [V8-000](../planning/13_V8_000_SOURCE_RECONCILIATION.md).

## Source evidence and architecture choice

[generateGovernanceReport.buildVerdict](../../packages/guard-core/src/generateGovernanceReport.ts) checks critical blocked activity, manifest incomplete/unknown, selected authority/test/rollback/cyber reasons and generated review requirements, then falls through to allow. The allow explanation says "Authority, scope, verification, and manifest evidence are structurally sufficient." This is existing wording, not repaired evidence.sufficient. Coverage uses submitted counts, manifest status and findings; it does not evaluate a frozen assurance profile and claim set. Unselected findings can coexist with allow.

[GovernanceReportModel](../../packages/guard-core/src/reportModel.ts), [Markdown renderer](../../packages/renderer-md/src/renderMarkdownReport.ts), [HTML renderer](../../packages/renderer-html/src/renderHtmlReport.ts) and [evidence index](../../packages/guard-core/src/generateEvidenceIndex.ts) consume the same verdict, wording, counts and reasons. [EAK](../../packages/guard-core/src/evidenceAssuranceKernel.ts) already separates its profile/review_scope/conclusions from a default-off local mapping preview. A separate bounded artifact therefore closes the architecture decision with the smallest compatibility impact.

The V8-000 evidence.sufficient row retains ALIGN_AND_ADOPT and REQUIRES_REPORT_MIGRATION **if projected into the existing report**. This ADR chooses to avoid that projection. It does not reclassify the row, migrate the report or grant a stronger meaning to allow. Any future report schema migration requires a separately admitted version/consumer/snapshot plan.

## Distinctions

| Concept | Bounded meaning | Does not establish |
|---|---|---|
| Evidence Present | Attributed evidence record/bytes available within named input | Complete inventory or sufficiency |
| Evidence Complete | All members of a named required inventory accounted for under its method | Coverage of every necessary claim or world completeness |
| Evidence Coverage | Named claim parts have specified evidence associations | Integrity, successful verification or sufficient quality |
| Evidence Integrity | B05 byte/reference comparison supports the specified integrity property | Independent custody or truth |
| Evidence Sufficient | Admitted profile requirements met for pinned claim set, subject, scope, evaluation time and evidence basis, with no material gap | Audit opinion, safety, correctness outside scope or acceptance |
| Verification Passed | Bound method reports successful checking of a specified property | Independence or all-profile sufficiency |
| Guard allow | Existing bounded report-rule fallthrough | evidence.sufficient or execution authorization |
| Institutional Acceptance | Separately evidenced decision and applicable authority in institutional context | Automatically established by any preceding evidence state |

Guard allow != evidence.sufficient != Runtime ALLOW != Institutional Acceptance. No Preview/Final lifecycle or authority transition is introduced.

## Required contract and outcome

The [side artifact specification](../architecture/evidence-sufficiency-side-artifact-v0.1.md) defines profile_id, claim_set_id, scope, evaluation_time, evidence_refs and material_gap_result plus registry version/digest, module lock and method version. Subject/version binding is mandatory. Missing required basis yields UNRESOLVED, never sufficient=false by default. An explicit material gap under a complete admitted profile evaluation can produce UNSUPPORTED for sufficiency; it does not prove the underlying software unsafe or a world proposition false.

An assurance profile names evaluative requirements over admitted meanings. It is **not** a new runtime module type and must not turn the existing presentation-only institutional_profile into a semantic evaluator. A profile can add requirements to the B02 binding union, never weaken Core, remove nonclaims, mint canonical IDs or convert policy results into facts. Named methods require deterministic, separately validated criteria before execution is admitted.

The artifact points to a legacy report only from outside that report; no fields or references are injected into report JSON, Markdown/HTML or existing evidence indexes. Missing or invalid side artifacts leave existing report generation unchanged and never default to sufficient. Side consumers display an unresolved association when report identity/digest cannot be verified. A profile-sufficient artifact can coexist with legacy require_review; an unresolved artifact can coexist with allow. Neither overwrites the other.

## Acceptance and authorization boundary

B06 = PASS for the explicit architecture/migration decision and schema/oracle specification. Implementation, JSON Schema installation, EAK changes, new report fields, renderer/index modifications and legacy verdict migration are not authorized. The side artifact is future opt-in/default-off; no automatic generation occurs.

Audit output / verdict / exit and deny 25 unchanged; permit/classify unchanged; recommendation-only, additive-only, non-executing, default-off; no authority scope expansion. B03 missing facts remain missing, all historical artifacts remain immutable, and Gate 1 remains BLOCKED pending B09/B10.
