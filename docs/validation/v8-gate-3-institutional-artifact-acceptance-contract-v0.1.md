# V8 Gate 3 Institutional Artifact Acceptance Contract v0.1

Status: frozen for Phase 3A readiness

## Gate 3 frozen definition

Real Experiment 2/design-partner evidence must show that an institutional reviewer can use and accept bounded claims, explicit nonclaims, missing or stale evidence, producer/verifier separation, and residual uncertainty without treating Guard as decision authority.

Phase 3A prepares the deterministic artifact and review mechanism. It does not supply the required external evidence and cannot close Gate 3.

## Derivation rule

The hard requirements below are derived directly from the frozen definition and the existing Experiment 2 review-validation strategy. Internal implementation checks are listed separately as readiness prerequisites so that repository evidence cannot be mistaken for institutional acceptance.

## Gate 3 hard requirements

| requirement_id | requirement | source | type | status | internal_evidence | external_evidence_required | reviewer_measure | pass_condition | fail_condition |
|---|---|---|---|---|---|---|---|---|---|
| G3-H01 | At least one real institutional/design-partner reviewer completes the bounded review. | Gate 3 frozen definition; Experiment 2B | EXTERNAL_REVIEW | NOT RUN | Review mechanism prepared | Named, qualified reviewer and completed same-review-event record | Workflow Fit | One accountable real reviewer completes intake, artifact review, measures, and interview | Synthetic-only review, no accountable reviewer, or incomplete event |
| G3-H02 | The reviewer correctly understands and uses bounded claim support and explicit nonclaims. | “bounded claims, non-claims” | EXTERNAL_REVIEW | NOT RUN | Claim and nonclaim artifact sections prepared | Reviewer answers and disposition rationale | Comprehension; Boundary Accuracy | Reviewer distinguishes supported scope from P0 nonclaims and uses both in review | Reviewer treats supported claim as approval, certification, or broader proof |
| G3-H03 | The reviewer identifies missing, stale, and conflicting evidence without silent normalization. | “missing/stale evidence” | EXTERNAL_REVIEW | NOT RUN | Missing/stale/conflicting groups prepared | Reviewer identification and supplementation record | Boundary Accuracy; Actionability | Reviewer correctly identifies applicable deficiencies and requests or records appropriate follow-up | Material deficiency is missed, hidden, or treated as passed evidence |
| G3-H04 | The reviewer can trace source, normalization, semantic binding, and producer/verifier separation. | “producer/verifier separation” | EXTERNAL_REVIEW | NOT RUN | Three deterministic provenance chains prepared | Reviewer trace exercise and interview response | Traceability | Reviewer traces representative supported, nonclaim, and indeterminate conclusions and identifies producer/verifier roles | Reviewer cannot trace a conclusion or assumes producer assertion is independent verification |
| G3-H05 | Residual uncertainty is understandable and leads to bounded follow-up rather than invented certainty. | “residual uncertainty” | EXTERNAL_REVIEW | NOT RUN | Uncertainty and review-request statements prepared | Reviewer follow-up and final rationale | Actionability; Overclaim Detection | Reviewer records what remains unknown and what additional evidence or escalation is needed | Reviewer converts uncertainty into a definitive positive or negative assertion without evidence |
| G3-H06 | The reviewer relies on the artifact as review input while keeping the institutional decision and authority external to Guard. | “without treating Guard as authority” | EXTERNAL_REVIEW | NOT RUN | Authority nonclaims and decision-owner wording prepared | Interview, disposition ownership, and overclaim probe | Boundary Accuracy; Workflow Fit; Overclaim Detection | Reviewer explicitly retains decision ownership and detects authority/certification overclaim | Guard output is treated as approval, certification, permission, policy decision, or delegated institutional authority |

## Phase 3A internal readiness prerequisites

| requirement_id | requirement | source | type | status | internal_evidence | external_evidence_required | reviewer_measure | pass_condition | fail_condition |
|---|---|---|---|---|---|---|---|---|---|
| G3-R01 | Institutional Artifact v0.1 has a strict machine-readable contract and deterministic local renderer. | MESR determinism; Gate 3 artifact need | INTERNAL_READINESS | PASS | Schema, fixture renderer, replay equality | None for readiness | N/A | Same input/profile produces canonical byte-equal output | Non-determinism or contract violation |
| G3-R02 | Supported, nonclaim, and indeterminate statements have replayable semantic provenance. | MESR Core; Claim Boundaries; Software Pack | INTERNAL_READINESS | PASS | Three chain assertions | Reviewer trace remains G3-H04 | Traceability | Each chain resolves to source, core ID, domain binding, relation, and statement | Missing link, invented semantic ID, or mismatched relation |
| G3-R03 | Developer and Audit/Assurance presentations are semantically invariant. | MESR module/profile invariants | INTERNAL_READINESS | PASS | Canonical semantic-snapshot equality | Profile usability remains external | Comprehension; Workflow Fit | Snapshot bytes match while presentation order differs | Any claim, boundary, relation, nonclaim, temporal, authority, or provenance difference |
| G3-R04 | Existing Experiment 2 instruments can consume the artifact without a competing experiment. | Experiment 2 operational plan | INTERNAL_READINESS | PASS | Bridge, ten questions, six measures, minimal addendum | Live completion remains G3-H01–H06 | All six categories | Artifact is inserted into the existing review packet and interview flow | New experiment, mutated historical template, or missing measurement mapping |
| G3-R05 | The readiness surface is additive and non-authoritative. | ADR-0008; repository invariants | INTERNAL_READINESS | PASS | Test-only fixture, docs, targeted verifier | Authority interpretation remains G3-H06 | Overclaim Detection | No CLI/main-path change, score, policy decision, certification, or execution authority | Public semantic drift or authority expansion |

## Frozen reviewer questions

The following ten questions are intentionally frozen for the first real review event:

1. What consequential transition is this artifact asking you to review?
2. Which claim is supported, by which evidence, and within what boundary?
3. What does the artifact explicitly say it does not prove or authorize?
4. What authority is declared, what authority is independently verified, and what authority evidence is missing?
5. Can you trace one conclusion from its artifact statement to the source evidence and semantic identifiers?
6. Which evidence is stale, missing, conflicting, or otherwise insufficient for your decision?
7. What additional evidence or human follow-up would you request before disposition?
8. Did this artifact improve the review workflow; if so, where did it reduce evidence chase or ambiguity?
9. Where, if anywhere, does the artifact overclaim, imply certification, or exceed its evidence?
10. Can you rely on this artifact as review input without delegating your institutional decision or authority to Guard?

## Measurement model

Experiment 2 retains its existing before/after timing, reviewer-effort, evidence-chase, supplementation, missing/unverified/contradiction, and decision-trace fields. The artifact-specific interpretation uses six categories:

| category | evidence captured |
|---|---|
| Comprehension | Reviewer description of transition, claim, evidence, and remaining uncertainty |
| Boundary Accuracy | Correct distinction among supported claim, explicit nonclaim, authority limits, and institutional decision |
| Traceability | Successful source-to-statement trace and producer/verifier identification |
| Actionability | Specific additional evidence, escalation, or bounded follow-up requested |
| Workflow Fit | Review time, evidence chase, ambiguity, supplementation, and reviewer narrative |
| Overclaim Detection | Identification of approval, certification, policy, authority, or certainty overreach |

No category is converted into a trust, risk, confidence, or compliance score.

## Gate decision rule

- Phase 3A may pass when G3-R01 through G3-R05 pass and the readiness acceptance criteria are satisfied.
- Gate 3 may pass only after G3-H01 through G3-H06 pass using at least one real institutional/design-partner reviewer.
- An LLM, synthetic persona, repository author, or deterministic test may exercise the mechanism but cannot supply Gate 3 external evidence.
