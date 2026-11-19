# MindForge Guard M5 P1 Independent First-User Protocol v0.2 — Observer/Owner only

**Status:** DESIGN AND PACKET PREPARATION / NO PARTICIPANT EXECUTED. Original M5 `HUMAN_FIRST_USER_VALIDATION=NOT_TESTED`. P1 source candidate `2a5365ea422b6dfb7f3d7bba81138e1e53862be1`, not the released npm v7.0.1 package. Do not conflate evidence from those different releases.

## Purpose and governing precedent

This protocol preserves the existing `M5 — First-User Observation Sheet v0.1` questions and bounded synthetic/Windows PowerShell 5.1 requirements. M5 cannot close based on CI, Owner-mediated use or previous technical reviewers; it requires at least one genuinely **independent**, **first-time**, consented human participant and a dated session observation/receipt, with genuine time, effort, confusion and comprehension data.

## Cohort eligibility

- Preferred first workflow participant: not a Guard contributor, Owner, prior external technical reviewer or developer of this implementation; no previous hands-on Guard use; accustomed to Windows PowerShell 5.1/Node 24 enough to follow instructions without developer coaching. This trial is about *first-time use*, not an institutional Assurance attestation.
- A report-reader without CLI experience may do Track A, but Track A alone does not close the full M5 First Report path.
- Existing external reviewers Ale/Sebbi/Bilidione served technical evaluation or prior review roles; do **not** count them automatically as brand-new independent first users, or contact them without assessing willingness and role.
- If the tester already used Guard, lacked consent, used actual business/employee records, or needed a developer to complete substantive decisions, record that explicitly. Do not silently exclude or reclassify observations.

## Session script for an observer (silent unless safety requires action)

1. Invite privately and explain the limits, anonymous metrics, synthetic-only restrictions and voluntary stopping. Record consent, source version and track.
2. Ask the person to share their screen **only with their permission**, or self-report timestamps; do not require an external screen recording or personally identifiable account evidence. Start timer when instructions are opened. Do not send the answer key.
3. Offer only the M5 tester ZIP and its short instructions; do not give previous M5 implementation readiness report, PR diff/CI logs, build scripts or internal engineering notes as instruction material. The Git bundle included for Track B is the fixed public-source executable fixture, not an internal assurance packet.
4. Remain silent. Record task duration, command count, errors, retries, time to the first HTML report, whether the three role views and original JSON were used, which descriptions were misunderstood, and if a `defer`/`reject` choice caused a deliberate safe stop.
5. Ask all seven comprehension questions in the tester form in their own words. Record answers without 'helping' the participant reach the expected conclusion. If a safety risk occurs (real source, credential, admin privileges, unknown addon), immediately stop and record as BLOCKED.
6. Obtain the completed observation sheet and sanitized JSON receipt. The raw Pack, user home paths, logged-in identity, screenshots with PII and customer data are not requested.
7. Compare the exact source/version and package digest with the pinned P1 candidate and GitHub artifact. A participant self-report is not an independently witnessed operating-system receipt. A session with no raw footage can still be classified `PARTICIPANT_SELF_REPORTED` with explicit limitations.

## Reading comprehension rubric (assessor only)

| Prompt | Evidence expected for comprehension (do not send this table as an answer key) |
| --- | --- |
| Source task | HR policy Q&A based on handbook, recommendation-only |
| Ready for human review | Reviewable, not approval, certification, permission to execute, merge or deploy |
| Three roles | Different **presentations** of the same report, not new verdicts |
| Hash | A reproducible byte/reference digest is not independent provenance, identity or execution proof |
| Source refs | Locate field links and raw input, understand their input-reported nature |
| Risk/nonclaims | No real client evidence, independent Assurance or customer production admission |
| Usability | Concrete observed font/link/focus/zoom issues; no coached answer |

**Do not require the participant to use this language verbatim.** Incorrect answers count as usability findings rather than automatic removal of a tester.

## M5 disposition and stop rules

Gate A: participant identity and eligibility (none/previous use/unknown); Gate B: no customer/secrets; Gate C: uncoached time/effort evidence; Gate D: correct First Report status, evidence and nonauthority understanding; Gate E: real observation sheet + session receipt anchored to the exact P1 source and package digest.

Possible disposition values:
- `M5_READING_ONLY_COMPLETED_WITH_FINDINGS`: one or more report-reading sessions but no independent full workflow completion. **Original M5 human First Report gate remains NOT_TESTED**.
- `M5_FULL_WORKFLOW_OBSERVED_WITH_LIMITATIONS`: eligible independent participant executed a genuine Track B workflow, evidence reviewed but there are friction/missing observations or risk flags; do not declare PASS.
- `M5_FULL_WORKFLOW_BOUNDED_USER_VALIDATION_ACCEPTED`: Owner explicitly accepts a completed, independently sourced Track B session with time, effort, comprehension, safety and source/version evidence. **Acceptance cannot occur automatically in the protocol or CI.**
- `M5_BLOCKED`: unreconciled safety/data/identity/source/admission gap. Preserve exact failure and do not rerun outside scope.

Important: `M5_READING_ONLY_COMPLETED_WITH_FINDINGS` still means a human did a reading task, but it is **not** closure of the actual independent first-use workflow. Never retroactively upgrade earlier status or conflated versions. Clear role separation: the Owner can observe and review evidence, but their own successful Windows run cannot count as a new independent user.

## Security and governance scope

- Default-off/isolated/synthetic-only; no real customer source, tool execution authority, native signed addon, EAK independent verification, License/Edition change or public npm release.
- The P1 candidate has verified CSS/static color-pairs and bounded headless Chromium three-role switching. Full WCAG 2.2 compliance and first-user readability remain unestablished pending real participant answers.
- Keep the source Git branch and PR as Draft; no main merge without separate Owner acceptance. Any incoming completed form should be appended as an **additive, privacy-minimized, date/source-bound** session receipt, not overwrite the M5 historical readiness report.

```text
P1_LEGIBILITY=VERIFIED_BOUNDED_VISUAL_ONLY
M5_INDEPENDENT_FIRST_USER=NOT_TESTED
M5_SESSION_CONSENT=NOT_YET_OBTAINED
M5_ELIGIBLE_PARTICIPANT=NOT_YET_IDENTIFIED
M4_ORIGINAL_62=NOT_RUN
SIGNED_NATIVE_ADDON=DEFERRED_NOT_ESTABLISHED
OR_01_TO_05=UNCHANGED
T2_FORMAL_CLOSURE=BLOCKED
S04_FACTUAL_ADMISSION=UNRESOLVED
G03_IMPLEMENTATION=FROZEN
SEBBI=HOLD
NO_MAIN_MERGE
NO_RELEASE
NO_CUSTOMER_DATA
```
