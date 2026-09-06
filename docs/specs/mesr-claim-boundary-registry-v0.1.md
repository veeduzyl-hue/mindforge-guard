# MESR Claim Boundary Registry v0.1

Status: Gate 1 claim and non-claim contract. These boundaries are normative for V8.0 architecture and are not a claim that an executable registry already exists.

## 1. Evaluation Rule

A left-side state can support only the bounded claim stated by its semantic entry. It does not support the stronger right-side claim unless all listed additional bindings exist and an EAK rule evaluates them.

Each example shows the prohibited inference. Each counterexample shows a separately bound case in which the stronger claim may be evaluated; it does not make the inference automatic.

## 2. Boundary Registry

| ID | Left-side evidence / state | `does_not_support` | Required additional bindings | Example | Counterexample |
| --- | --- | --- | --- | --- | --- |
| CB-01 | Evidence present | Authority | authority source, principal, action, target, scope, valid time, provenance | A signed log exists, so the actor is assumed authorized. | A separate current delegation explicitly binds that actor, action, target, and time; authority can then be evaluated. |
| CB-02 | Assessment completed/passed | Authority | applicable authority source and scope independent of assessment | A risk assessment passes, so execution is treated as authorized. | The assessment and an applicable external authority record are evaluated as distinct claims. |
| CB-03 | Resource or system access | Authority | permission source, intended action, scope, constraints, valid time | A token can write a repository, so every write is authorized. | IAM evidence binds the token to the exact path/action/time; applicable authority can then be evaluated. |
| CB-04 | Capability available | Authority | applicable authorization for the capability and target | A runtime has a deploy tool, so deployment is authorized. | A current scoped authority record separately covers deployment to the target. |
| CB-05 | Verified identity | Verified authority | authority source, delegation/scope, valid time, subject binding | Authentication proves the caller may approve a release. | Verified identity plus current code-owner delegation supports evaluation of applicable reviewer authority. |
| CB-06 | Verification passed | Execution authority | external decision owner, applicable permission, execution boundary | Tests pass, so Guard authorizes merge/deploy. | An external system may make its own decision using tests plus separately established authority; Guard still does not authorize. |
| CB-07 | Observation recorded | Verification | verifier, method, checked property, subject, scope, time, limitations | A producer log says a test passed, so it is independently verified. | A separate verifier replays the bound test artifact and records method and limitations. |
| CB-08 | Trace captured | Evidence sufficiency | claim, trace scope/completeness, subject/time binding, provenance | A tool trace exists, so the workflow is fully evidenced. | The trace is shown complete for a bounded claim and combined with required artifacts. |
| CB-09 | Integrity verified | Veracity | claim-content verification, source reliability, corroboration where required | SHA-256 matches, so the artifact contents are true. | Hash preservation and a separate content verifier support separate integrity and correctness claims. |
| CB-10 | Artifact authenticity verified | Claim correctness | issuer scope, claim verification, subject/time binding | A valid signature makes every signed assertion correct. | Signature authenticates the issuer; an independent check separately supports a bounded claim. |
| CB-11 | Evidence present | Evidence sufficiency | claim-specific required evidence, scope, quality, admissibility, time | A test report exists, so release evidence is sufficient. | The report covers the bound candidate and all claim-specific requirements. |
| CB-12 | Evidence complete against inventory | Correctness | property-specific verification and acceptance criteria | Every manifest item exists, so the change is correct. | Complete inventory plus successful bound verification supports only the checked correctness claim. |
| CB-13 | Execution occurred/succeeded | Outcome correctness | expected outcome, post-state observation, causal and subject binding | Deployment returned success, so production behavior is correct. | Bound health and outcome observations verify specified postconditions after that deployment. |
| CB-14 | Outcome occurred | Causal attribution | candidate cause, temporal ordering, controls/corroboration, alternative-cause treatment | Error rate fell after deployment, so the deployment caused it. | A bounded experiment with provenance and alternative-cause controls may support attribution. |
| CB-15 | Historical evidence was valid | Current standing | `basis_valid_at`, expiry, revocation, supersession, current subject | A credential was valid last week, so it is valid now. | Revocation/expiry sources are resolved at reliance time and yield `current`. |
| CB-16 | Capability continuity | Authority continuity | prior/current authority records, unchanged subject/scope/time, revocation check | The same tools remain available, so authority remains valid. | Current authority is independently re-evaluated and matches the unchanged capability scope. |
| CB-17 | Delegation exists | Authority amplification | delegator's delegable scope, delegate scope, constraints, chain validity | Read authority is delegated and treated as read/write authority. | Delegate scope is equal to or narrower than a verified delegable source scope. |
| CB-18 | Approval record exists | Applicable approval | reviewed subject hash, scope, reviewer authority, valid time, status | An old approval note is applied to a different commit. | The approval binds the same commit, scope, authorized reviewer, and current time. |
| CB-19 | Policy match recorded | Legal compliance | authoritative legal interpretation, jurisdiction, current law/policy, complete facts | A rule identifier matches, so the action is legally compliant. | Counsel or an accountable compliance owner makes a separate determination over current facts. |
| CB-20 | Framework mapping exists | Certification | framework/version, control evidence, authorized assessor/certifier, certification scope | NIST controls are mapped, so the system is certified. | An external authorized body may issue a separate certification; Guard records it as evidence only. |
| CB-21 | Decision divergence observed | Error | normative comparator, applicable scope, evidence that one result violates it | Human and Guard results differ, so one is wrong. | A bound rule and facts establish that one result contradicts the applicable criterion. |
| CB-22 | Producer claim present | Independent verification | separate verifier identity, method, source separation, limitations | CI metadata contains `verified: true`, so it is independently verified. | A separate verifier checks the underlying artifact rather than copying the field. |
| CB-23 | Control present | Control effectiveness | operating period, test method, coverage, observed outcomes, limitations | A rollback script exists, so rollback is effective. | A bound recovery exercise verifies the script against the candidate environment. |
| CB-24 | Human-in-loop present | Meaningful oversight | reviewer authority, information access, time, actionability, recorded rationale | A reviewer name exists, so oversight was meaningful. | An authorized reviewer inspected the bound subject, could intervene, and recorded rationale. |

## 3. Mandatory Semantic Inflation Protections

Every registered mapping, Crosswalk, Domain Pack, and Profile must preserve:

```text
logged != evidenced
evidenced != verified
verified != assured
assured != approved
approved != compliant
compliant != safe
```

The symbol `!=` means “does not automatically support,” not logical mutual exclusion. An artifact may participate in several separately evaluated claims when each claim has its own required bindings and provenance.

## 4. Machine Evaluation Expectations

A future registry entry for each boundary must expose:

- boundary ID;
- left and right semantic IDs;
- relation `does_not_support`;
- required additional bindings;
- rationale and provenance;
- compatible Core version;
- at least one negative fixture;
- deterministic failure output.

Unknown Crosswalk vocabulary and missing bindings produce `indeterminate`. A registered prohibited inference produces `does_not_support`. Neither result proves the stronger claim false.
