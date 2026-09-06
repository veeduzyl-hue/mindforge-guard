# MESR Software Change Domain Pack v0.1

Status: Gate 1 domain specification. This is the only product Domain Pack scoped for V8.0 v0.1; no loader or production implementation is included.

## 1. Purpose

The Software Change Domain Pack specializes Core semantics for this transition:

```text
base_revision
-> proposed_change
-> review_subject
-> verification_artifact
-> accepted_revision
-> release / deployment_effect
```

It adds software context without redefining Core meanings for actor, authority, evidence, verification, claim support, temporal basis, review, or disposition.

## 2. Manifest Identity

| Field | Value |
| --- | --- |
| `module_id` | `mesr.module.software.v0_1` |
| `module_type` | `domain_pack` |
| `version` | `0.1.0` |
| `semantic_namespace` | `mesr.domain.software` |
| `core_compatibility` | `>=0.1.0 <0.2.0` |
| `dependencies` | `mesr.core@0.1.0` |
| `conformance_requirements` | semantic non-interference, deterministic resolution, explicit provenance, no execution authority |

## 3. Domain Semantics

| Semantic ID | Meaning | Required bindings | Explicit non-claims |
| --- | --- | --- | --- |
| `mesr.domain.software.change.subject` | Bounded software change under review. | repository, base/candidate refs, diff scope, subject hash | authorization, correctness, deployment |
| `mesr.domain.software.change.base_commit` | Revision against which the candidate is compared. | repository, immutable commit ID, provenance | current main, accepted revision |
| `mesr.domain.software.change.candidate_commit` | Candidate revision proposed for review. | repository, immutable commit ID, provenance | reviewed/accepted/deployed revision |
| `mesr.domain.software.change.diff_scope` | Files/paths and change set between base and candidate. | base, candidate, canonical diff identity | completeness outside captured diff, authority |
| `mesr.domain.software.authority.code_owner` | Evidence of applicable code-owner authority. | actor, repository/path, action, source, valid time | approval, broader repository authority, execution permission |
| `mesr.domain.software.verification.test_evidence` | Test execution evidence bound to a candidate. | candidate/subject hash, command/suite, result, producer/verifier, time | change authorization, deployed correctness, production safety |
| `mesr.domain.software.review.binding` | Review event bound to an exact software subject. | reviewer, reviewer authority ref, subject hash, scope, time, rationale ref | approval applicability without all bindings, Guard authorization |
| `mesr.domain.software.release.identity` | Immutable identity of an accepted or released revision/artifact. | candidate/accepted commit, artifact digest/tag, provenance | deployment occurrence, production correctness |
| `mesr.domain.software.deployment.effect` | Observed deployment transition for a release identity. | release identity, environment, before/after state, time, provenance | outcome safety, causal completeness, authorization |
| `mesr.domain.software.rollback.reference` | Addressable rollback or recovery material. | release identity/environment, reference/digest, valid time | executability, effectiveness, authorization |
| `mesr.domain.software.verification.subject_equals_execution_subject` | Equality check between reviewed/verified subject and executed/deployed subject. | both immutable subject identities, comparison method, time | correctness, authorization, safe outcome |

## 4. Diagnostic Extension Semantics

Reason-code migration may bind to additive diagnostic entries such as:

- `mesr.domain.software.verification.insufficient`;
- `mesr.domain.software.verification.test_execution_not_demonstrated`;
- `mesr.domain.software.verification.test_failure_observed`;
- `mesr.domain.software.verification.build_execution_not_demonstrated`;
- `mesr.domain.software.verification.build_failure_observed`;
- `mesr.domain.software.verification.static_analysis_not_demonstrated`;
- `mesr.domain.software.verification.security_scan_not_demonstrated`;
- `mesr.domain.software.review.not_demonstrated`;
- `mesr.domain.software.release.rollback_not_demonstrated`;
- `mesr.domain.software.release.rollback_not_verified`;
- `mesr.domain.software.release.target_unclear`;
- `mesr.domain.software.deployment.environment_not_verified`;
- `mesr.domain.software.change.undeclared_file_observed`;
- `mesr.domain.software.change.dependency_observed`;
- `mesr.domain.software.change.breaking_impact_not_verified`;
- `mesr.domain.software.change.lockfile_observed`;
- `mesr.domain.software.change.migration_not_documented`;
- `mesr.domain.software.change.public_api_impact_not_verified`.

These diagnose evidence states. They do not decide a Governance Report verdict.

## 5. Mandatory Non-Claims

```text
Tests passed != change authorized.
Tests passed != deployed change correct.
Deployment succeeded != production outcome safe.
Reviewer exists != reviewer has applicable authority.
Rollback exists != rollback is valid or executable.
```

Additional fixed boundaries:

- candidate commit is not accepted commit;
- accepted commit is not deployed artifact;
- review subject is not execution subject unless immutable identities match;
- code-owner evidence does not create authority outside its repository/path/action/time;
- artifact integrity does not establish test truth or outcome correctness.

## 6. Canonical Software Claim Examples

| Claim | Minimum evidence and bindings | Still does not support |
| --- | --- | --- |
| `test_execution_demonstrated` | test artifact, candidate hash, result, producer/verifier, time | authorization, deployed correctness |
| `applicable_review_exists` | review record, exact subject hash, scope, reviewer authority, valid time | execution authorized by Guard |
| `release_identity_bound` | accepted commit and immutable artifact/tag provenance | deployment occurred |
| `deployment_effect_observed` | release identity, environment, transition observation, time | safe or correct production outcome |
| `review_subject_equals_execution_subject` | deterministic equality of immutable identifiers | correctness, authorization |

## 7. Composition Constraint

Adding a NIST/OWASP Crosswalk or an Audit Profile may add references, mappings, grouping, or presentation context. It must not change Core semantic IDs, Software Pack claim boundaries, or any support relation.

## 8. Out Of Scope

No Finance or Healthcare product pack, runtime enforcement, deployment controller, code-owner IAM system, policy engine, certification, legal compliance decision, or execution-time gate is implemented here. Finance and Healthcare may appear only as synthetic Experiment 3 fixtures.
