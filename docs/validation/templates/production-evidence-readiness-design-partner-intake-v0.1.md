# Production Evidence Readiness Design Partner Intake v0.1

Status: Template for a bounded external Experiment 2B review. Do not include credentials, tokens, cookies, private keys, environment values, or raw evidence.

## Partner And Ownership

- Partner review ID:
- Partner identifier (sanitized):
- Accountable reviewer role:
- External decision owner role:
- Buyer role / budget-owner role (hypothesis or evidence):

## Review Subject

- Subject ID and type:
- Workflow, agent, or integration identity:
- Version / revision:
- Trigger event: production entry / material change / renewal / re-review
- Review scope:
- Requested evidence conclusion:
- Known limitations:
- Existing reviewer notes:

## Evidence Sources And Constraints

| Evidence family | Applicability | Verification expectation | Producing system | Available evidence | Unavailable evidence | Privacy / redaction constraint |
| --- | --- | --- | --- | --- | --- | --- |
| Subject/version identity | required | declaration_acceptable |  |  |  |  |
| Change/release identity | required | verification_recommended |  |  |  |  |
| Build/test | required | verification_recommended |  |  |  |  |
| Deployment/provenance | conditionally_required | verification_recommended |  |  |  |  |
| Tool evidence | conditionally_required | declaration_acceptable |  |  |  |  |
| Model/configuration | conditionally_required | declaration_acceptable |  |  |  |  |
| Data/context | conditionally_required | declaration_acceptable |  |  |  |  |
| Runtime evidence | conditionally_required | independent_verification_required |  |  |  |  |
| Security/safety | conditionally_required | verification_recommended |  |  |  |  |
| Rollback/recovery | conditionally_required | verification_recommended |  |  |  |  |
| Limitations and reviewer notes | required | declaration_acceptable |  |  |  |  |

## Current Process And Baseline

- Current review process:
- Current review cycle-time estimate:
- Reviewer-hours estimate:
- Evidence-chase actions / systems consulted:
- Expected supplementation rounds:
- Repeat-review event and expected timing:

## Intake Attestation

- Raw evidence remains outside the repository: yes / no
- Sanitized retention permitted: yes / no
- Redaction constraints recorded: yes / no
- Guard is understood to be recommendation-only and non-executing: yes / no
