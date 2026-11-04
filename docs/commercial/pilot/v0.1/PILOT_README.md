# MindForge Guard — Commercial Pilot v0.1 (English)

**Research trial packet; no customer has been invited, accepted, charged or signed through its creation.** This is not a product certification, legal compliance engagement or deployment authorization.

## Intended users

Target three to five consenting early evaluators across three roles: a business/process owner, an agent developer or engineering lead, and a risk/governance reviewer. Recruit separately using opt-in outreach; do not scrape private contacts or presume participation.

## Pilot scope

One single-agent, bounded, review-only workflow per participant. Prefer a support knowledge assistant, AI-coding PR summarizer, or HR policy-answer assistant with no external side effects. Do not trial a payment-executing, privileged or multi-agent workflow.

### Steps

1. Agree purpose, authorized evidence audience, security/redaction rules and a named human reviewer; complete `PILOT_INTAKE.md`.
2. For initial orientation, use the separately distributed synthetic [Sample Pack](../../../../downloads/mindforge-guard-hr-self-service-sample-pack-v0.1.zip). It is not production evidence.
3. Install **only a reviewed RC artifact** from the specific GitHub Actions run in an isolated local environment; `7.1.0-rc.0` has not been published to npm. See [Release Candidate Review](../../../release/v7_1_0_rc_0_release_candidate.md).
4. Validate a user-owned, synthetic/redacted/summary Evidence Pack and generate the JSON governance preview.
5. Render the English offline HTML: `guard report render --input first-report.json --out first-report.html --format html`. Input JSON remains the source artifact.
6. Let a reviewer read the Business Owner, Technical Reviewer and Governance / Risk Reviewer perspectives; observe without coaching.
7. Collect `PILOT_FEEDBACK.md` and record the next action. Feedback sharing is optional, and no full Evidence Pack or raw report needs to be sent to the vendor.

## Measurements

Record time-to-first-pack, time-to-first-report, whether each participant can state allowed and prohibited actions correctly, whether they understand `ready_for_review` is not approval, and whether they would reuse it for a second workflow or recommend purchase. Track assistance frequency and drop-offs. Record `NOT_TESTED` for missing observations rather than inventing outcomes.

## Data handling

No automatic telemetry, hosted storage, log uploads or customer-file collection. Participant owns all files. English HTML **embeds the full input JSON**, so review for sensitive information before distribution. Share only authorized, explicitly redacted, opt-in excerpts. Never request passwords, access tokens, secrets, private keys or raw private personnel records.

## Commercial pilot posture

No fees or commitments by this packet. A separate bounded assistance service may be tested at an indicative USD 1,500–3,000 per single-workflow engagement (research-only price hypothesis) and only after written scope and independent commercial approval. Existing Guard Community/Pro/Pro+/Enterprise license prices stay unchanged.

## Boundaries

Guard is recommendation-only, non-executing, non-control-plane, no authority expansion. A report can be ready for human review without proving safety, approval, policy compliance or evidence authenticity. Reviewer remains responsible for decisions outside Guard.
