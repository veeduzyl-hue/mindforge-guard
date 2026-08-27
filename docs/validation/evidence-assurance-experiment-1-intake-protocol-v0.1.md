# Evidence Assurance Experiment 1 Intake Protocol v0.1

Status: Local, bounded, read-only protocol for real producer dry runs.

## Purpose

This protocol governs the intake of real CI/CD and deployment/provenance evidence for Evidence Assurance Experiment 1. It does not authorize execution, credential changes, producer integration, cloud service behavior, or changes to public Guard contracts.

## Raw Artifact Boundary

Raw producer artifacts are real, unaltered evidence. They must remain outside the repository, must not be committed to Git, and must not be copied into tracked repository directories.

The approved workstation-local staging location is:

`D:\\AI project\\mindforge-guard-evidence-exp1\\`

Each retrieval must be read-only and must record the producer, artifact type, source run or deployment identifier, and capture time in a local intake note. Do not retrieve, retain, or log credentials as evidence.

## Sensitive Data Prohibition

Never commit or log access tokens, API keys, cookies, authorization headers, environment variable values, private keys, credentials, session identifiers, webhook secrets, database URLs, or internal secrets.

Before retaining a sanitized derivative, inspect for personal email addresses, private deployment URLs, internal hostnames, user identifiers, repository secrets, and organization-sensitive paths. If a field cannot be safely retained, redact it or do not retain the derivative.

## Sanitized Evidence Boundary

Sanitized evidence is a derived, reviewed, redacted copy. It is not byte-identical to producer output and must state that fact. A retained sanitized artifact must include:

- `source_producer`
- `source_artifact_type`
- `source_run_or_deployment_id`
- `captured_at`
- `redaction_applied`
- `redaction_summary`
- `raw_artifact_digest` when safe to retain
- `sanitized_artifact_digest`

The sanitation record must preserve which producer generated the artifact, which run or deployment it came from, when it was captured, removed or transformed fields, and the bounded verification operations performed by Guard.

Redaction must not silently change semantic claims. If it removes evidence required for a verification, record that verification as `not possible after redaction`; never fabricate a result.

## Trust And Review Boundary

Producer statements remain producer declarations. Normalization only converts format and cannot upgrade trust. Guard verification, integrity checks, unsupported conclusions, missing evidence, and residual uncertainty must remain distinct in the resulting review packet.

All dry-run outputs are local review previews, recommendation-only, additive-only, non-executing, and default-off. They do not certify, approve, declare production safety, or change `audit`, `permit`, or `classify` behavior.
