# Markdown Report Renderer Plan

## Purpose

Explain how a generated JSON governance report can be represented as a readable Markdown handoff without changing Guard runtime behavior or report semantics.

## Current Source Artifact

The JSON report remains the deterministic source artifact.

- JSON report remains the deterministic source artifact.
- Markdown report is a human-readable handoff layer.
- Markdown does not replace the JSON report.
- Markdown does not change report schema.
- Markdown does not change Evidence Pack schema.
- Markdown does not add runtime authority.

## Human-readable Handoff Layer

Markdown is for reviewers, design partners, internal sponsors, and handoff packets that need a readable summary alongside the generated JSON report.

The human-readable layer helps a reviewer understand what the workflow is, what it is allowed to do, what evidence is visible, and what follow-up questions remain before reuse.

## Recommended Markdown Sections

1. Report Identity
2. Workflow Summary
3. Authority Boundary
4. Evidence Coverage
5. Missing Evidence
6. Risk / Drift Signals
7. Reviewer Questions
8. Handoff Checklist
9. Boundary Statement

## Mapping From JSON Report To Markdown

Use a conservative mapping that keeps the Markdown handoff downstream from the generated JSON report:

- report metadata -> Report Identity
- workflow / agent profile -> Workflow Summary
- authority / allowed / prohibited actions -> Authority Boundary
- evidence references -> Evidence Coverage
- missing evidence -> Missing Evidence
- risk / drift signals -> Risk / Drift Signals
- reviewer notes -> Reviewer Questions

The Markdown layer should summarize and reorder existing report facts for readability. It should not reinterpret the report into a new governance decision surface.

## What A Renderer May Do In A Future Additive PR

A future additive renderer may:

- format existing JSON report fields into Markdown;
- preserve JSON as the source artifact;
- include links or references to Evidence Pack files;
- include missing evidence sections;
- generate a reviewer handoff checklist.

## What A Renderer Must Not Do

A renderer must not:

- approve, block, deploy, certify, guarantee legal compliance, or control execution;
- produce safe-to-deploy claims;
- act as a CI gate;
- change exit codes;
- recalculate governance decisions;
- change report schema;
- change Evidence Pack schema;
- replace human reviewer decisions;
- add runtime authority.

## Reviewer Handoff Checklist

Include:

- Evidence Pack folder
- guard-pack-validate.json
- guard-single-agent-report.json
- optional Markdown summary
- known missing evidence
- security review notes when needed

## Boundary

This plan is docs / examples / verifier only. It does not implement a CLI renderer and does not change runtime behavior, pricing, checkout, license API, entitlement, report schema, Evidence Pack schema, or Guard command semantics.
