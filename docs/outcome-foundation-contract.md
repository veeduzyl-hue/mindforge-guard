# Outcome Foundation Contract Verification

## 1. Purpose

This contract verifies the current local-first Outcome Foundation chain end to end:

- Evidence Schema v1 fixture input
- `parseEvidencePack`
- `validateEvidencePack`
- `generateGovernanceReport`
- `renderMarkdownReport`
- `renderHtmlReport`
- `generateEvidenceIndex`

The goal is to prove that the bounded report-production and downstream-consumer surfaces still compose correctly.

## 2. Why This Exists Before Studio Or SDK

This verification exists before Studio or SDK work so the repository has one explicit contract check around the current Outcome Foundation pipeline.

That keeps:

- Guard Core as the only governance source of truth
- renderers as downstream presentation-only consumers
- Evidence Index as downstream traceability-only output
- future consumers aligned to one verified local-first chain

## 3. What It Verifies

The verification script checks that all five Evidence Schema v1 fixtures:

- parse successfully
- validate successfully, allowing warnings but not errors
- produce governance reports with required high-level fields
- match expected high-level verdicts
- render non-empty Markdown with required sections
- render non-empty local-first HTML with required sections
- produce JSON-serializable Evidence Index output

## 4. What It Does Not Verify

This contract does not:

- change any governance behavior
- add or modify parser, validator, report-service, or renderer behavior
- inspect artifact file contents
- execute commands from Evidence Packs
- call network or model APIs
- add Studio or SDK behavior

## 5. Boundary Notes

The verification remains local-first and non-executing.

It is a verification-only surface and does not change runtime CLI behavior, audit / permit / classify behavior, or the current `v7.0.1` commercial boundary.
