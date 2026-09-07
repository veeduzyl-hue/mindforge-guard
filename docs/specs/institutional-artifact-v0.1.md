# Institutional Artifact v0.1

Status: Phase 3A readiness contract

## Purpose

Institutional Artifact v0.1 is a deterministic projection and communication surface for an institutional reviewer. It presents existing MESR and Evidence Assurance Kernel semantics without changing the evidence, claim, temporal, or authority meaning underneath them.

It is not a policy decision, approval, certification, risk score, confidence score, legal opinion, runtime authorization, or institutional decision. Guard remains recommendation-only, additive-only, non-executing, and default-off.

The machine-readable contract is `schemas/institutional_artifact/institutional-artifact-v0.1.schema.json`.

## Semantic separation

The artifact preserves this separation:

```text
Claim Support != Governance Disposition != Institutional Decision
```

- MESR claim-support relations describe what evidence can support.
- A downstream governance disposition, if one exists, remains a separate bounded object.
- The accountable institution and its reviewer own the institutional decision.
- No artifact field may translate support directly into approval, certification, permission, or execution authority.

## Required sections

Every v0.1 artifact contains:

1. artifact identity;
2. the consequential transition being reviewed;
3. evidence summary grouped as observed, verified, missing, and conflicting;
4. claim support with semantic identifiers and claim boundaries;
5. explicit P0 nonclaims;
6. authority context grouped as declared, verified, and missing;
7. temporal basis;
8. semantic provenance chains;
9. residual uncertainty;
10. reviewer questions and required follow-up.

Every substantive statement is explicitly classified as exactly one of:

- `FACT`
- `SUPPORTED_CLAIM`
- `NON_CLAIM`
- `UNCERTAINTY`
- `REVIEW_REQUEST`

The artifact contains no trust, risk, confidence, compliance, approval, or certification score.

## Profiles

v0.1 permits exactly two presentation profiles:

- `Developer`
- `Audit/Assurance`

The profiles may change section order, grouping, language density, and emphasis. They must use the same semantic snapshot, semantic IDs, domain bindings, Claim Boundaries, support relations, explicit nonclaims, authority context, temporal basis, and provenance chains. Profile presentation is not a semantic module and adds no authority.

Canonical semantic-snapshot byte equality is the v0.1 profile-invariance test.

## Provenance requirement

The artifact must make at least these three chain kinds replayable:

- supported claim: native source pointer -> normalized fact -> MESR core semantic -> Software Change binding -> support relation -> artifact statement;
- explicit nonclaim: source observation -> Claim Boundary -> `does_not_support` relation -> artifact nonclaim;
- missing or indeterminate: absent/insufficient source fact -> MESR semantic -> Software Change binding -> `indeterminate` relation -> artifact uncertainty or review request.

Provenance identifies sources and transformations. It does not independently verify producer-supplied authority or turn a controlled fixture into external evidence.

## Compatibility boundary

Institutional Artifact v0.1 is an additive, local-first review fixture. It introduces no public CLI command or flag, changes no JSON contract, does not alter `audit`, `permit`, or `classify`, and is not included in the global `npm run verify` path. It does not add a dashboard, workflow engine, approval system, GRC platform, runtime gate, cloud service, database, customer portal, or LLM assurance path.
