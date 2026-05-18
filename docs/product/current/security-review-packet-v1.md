# Security Review Packet v1

This packet helps a security, platform, or procurement reviewer understand the bounded adoption posture for MindForge Guard v7.0.1 and the v7.1 adoption-readiness docs/examples line.

MindForge Guard is a deterministic governance evidence layer for single-agent AI workflows.

> Not an approval system. Not a blocker. Not a control plane.

## Product Boundary

MindForge Guard produces review evidence for human inspection.

It remains:

- recommendation-only;
- additive-only;
- non-executing;
- default-off where applicable;
- non-control-plane;
- deterministic;
- local-first where applicable;
- human-review-oriented.

It does not approve, block, deploy, certify, guarantee legal compliance, or control execution.

Enterprise does not receive extra runtime authority.

## Data Handling Posture For Evidence Packs

Evidence Packs are user-provided folders. Users decide what evidence to include.

Recommended first-review posture:

- use synthetic, redacted, or summary evidence where possible;
- avoid production secrets;
- avoid raw credentials;
- avoid access tokens;
- avoid private customer records unless the reviewer is authorized to inspect them;
- record missing evidence explicitly instead of inserting sensitive raw material.

## Local CLI Posture

The documented adoption path runs Guard locally or in a user-owned GitHub Actions workflow.

The docs/examples in this line do not add:

- hosted control-plane behavior;
- runtime enforcement behavior;
- approval authority;
- blocking authority;
- deployment-control authority;
- new entitlement behavior;
- new license API behavior.

## GitHub Actions Posture

The external adoption workflow under `examples/github-actions/bring-your-own-governance-report.yml` is designed as a copy-paste, manually triggered review artifact workflow.

It uses:

- `workflow_dispatch`;
- `contents: read`;
- user-provided `pack_path`;
- uploaded JSON review artifacts.

It is not attached to `push`, `pull_request`, or `pull_request_target` by default.

It does not approve, block, deploy, certify, or control execution.

## License Hub Boundary

License Hub supports commercial purchase, account access, and signed license delivery.

This adoption-readiness line does not change:

- pricing;
- checkout;
- Paddle behavior;
- license signing;
- license verification;
- entitlement;
- runtime authority.

## Security Review Checklist

Before sharing an Evidence Pack externally, check:

- no secrets, credentials, tokens, or private keys are included;
- customer, employee, or internal data is redacted or authorized for review;
- evidence omissions are clearly listed;
- the action boundary states allowed and prohibited actions;
- external side effects are described;
- final human review responsibility is explicit;
- the packet does not claim approval, blocking, deployment, certification, or legal compliance status.

## Questions For Reviewers

```md
reviewer:
review date:
workflow type:
evidence sensitivity:
redaction required:
missing evidence:
security concerns:
approved reviewer audience:
follow-up owner:
```

## Boundary

This packet is an adoption and security review aid. It is not a certification, not a legal compliance guarantee, and not a runtime-control claim.
