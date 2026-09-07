# V8 Experiment 2 Institutional Artifact Bridge v0.1

Status: Experiment 2B launch-readiness bridge; live review not run

## Reused mechanism

This bridge inserts Institutional Artifact v0.1 into the existing Experiment 2 sequence. It does not define another experiment and does not edit the historical Experiment 2 templates.

Reused assets:

- `docs/validation/production-evidence-readiness-experiment-2-operational-plan-v0.1.md`
- `docs/validation/production-evidence-readiness-review-validation-strategy-v0.1.md`
- `docs/validation/templates/production-evidence-readiness-design-partner-kit-v0.1.md`
- `docs/validation/templates/production-evidence-readiness-design-partner-intake-v0.1.md`
- `docs/validation/templates/production-evidence-readiness-review-packet-v0.1.md`
- `docs/validation/templates/production-evidence-readiness-post-review-interview-v0.1.md`
- `docs/validation/templates/production-evidence-readiness-measurement-v0.1.md`

The accepted current operational state is:

```text
EXPERIMENT_2A_OPERATIONAL_READY = YES
DESIGN_PARTNER_SECURED = NO
EXPERIMENT_2B = WAITING_FOR_DESIGN_PARTNER
```

## Review-packet insertion

For the first Experiment 2B event, the operator attaches both Developer and Audit/Assurance renderings after the existing verification/findings sections and before reviewer disposition. The packet records one canonical semantic-snapshot digest for both profiles. The reviewer chooses the profile that fits their task; the second rendering is used only for the profile-invariance check and optional comparison.

The artifact supplements the existing evidence-pack and verification material. It does not replace original evidence, the reviewer disposition, or the post-review interview.

## Minimal intake addendum

Capture only non-sensitive operational metadata needed for Gate 3:

- reviewer role category and accountability for the decision;
- profile selected: Developer or Audit/Assurance;
- confirmation that the subject is a real consequential Software Change review;
- confirmation that source evidence may be used under the partner’s existing permission boundary;
- producer and verifier roles, including whether independence is claimed;
- institutional decision owner outside Guard.

Do not collect secrets, credentials, personal identifiers not already required by the partner process, proprietary policy text, or unrelated customer data.

## Live review steps

1. Complete existing partner qualification, scope, baseline, and intake.
2. Produce and verify the evidence pack using the existing Experiment 2 path.
3. Render both profiles locally from the same semantic input and record their equal semantic-snapshot digest.
4. Give the selected rendering, original evidence references, and existing review packet to the real reviewer.
5. Ask the ten frozen questions from the Gate 3 acceptance contract.
6. Record supplementation, reviewer disposition, provenance trace, existing Experiment 2 measurements, and six Gate 3 measurement categories.
7. Complete the existing post-review interview and capture whether the reviewer retained institutional decision ownership.
8. Evaluate G3-H01 through G3-H06. Do not infer a pass from internal verification.

## Interview addendum

Append the frozen questions verbatim to the existing interview. The operator records answers and source references without reducing them to a score. A Gate 3 evaluator must be able to distinguish observed reviewer behavior from interpretation and must preserve negative, ambiguous, or contradictory evidence.

## Phase 3A boundary

This bridge establishes launch readiness only. No design partner has been secured by this work, no real reviewer has completed the flow, and all external Gate 3 hard requirements remain `NOT RUN`.
