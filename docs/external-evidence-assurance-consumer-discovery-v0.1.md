# External Evidence Assurance Consumer Discovery v0.1

## 1. Status

- Status: `discovery-protocol-only`
- Scope: `docs-only`
- Current discovery state: `DISCOVERY_IN_PROGRESS`
- Repository baseline: `main` at `0730f7e992080cacfad5a3a4b7a7cef4c7f25930`
- Starting decision baseline: `EXTERNAL_CONSUMER_DISCOVERY_REQUIRED`
- Validated external consumer evidence at protocol creation: `none`
- Commercial validation evidence at protocol creation: `none`
- Public export required at protocol creation: `no`
- Runtime implementation authorized at protocol creation: `no`
- Idempotency line reopened at protocol creation: `no`
- Fingerprint conformance eligible at protocol creation: `no`

This document is not:

- completed discovery
- validated demand
- product-market fit
- service readiness
- production readiness
- implementation authorization

## 2. Discovery Objective

This phase defines a bounded, executable consumer-discovery protocol for
External Evidence Assurance.

Its purpose is to answer, through human-led interviews, workflow capture,
artifact review, and pilot qualification:

1. who produces `EvidencePackage`
2. who reads `AssuranceReport`
3. who owns human review
4. which workflow triggers independent verification
5. what current alternative is used now
6. what concrete cost, delay, or risk exists without independent assurance
7. who is the user, integrator, reviewer, buyer, and usage-record consumer
8. whether the consumer can provide real, anonymized, or representative samples
9. whether the consumer will join a local-first, non-executing pilot
10. whether the consumer need truly triggers transport, persistence,
    authentication/tenant, or conformance boundaries

This phase creates only:

- a consumer-discovery protocol
- a role model
- a priority archetype map
- JTBD hypotheses
- an interview guide
- an artifact-request guide
- a validated-evidence definition
- a non-evidence definition
- an evidence-quality model
- an empty evidence-ledger template
- pilot and architecture decision gates

## 3. Current Evidence Baseline

The current repository line provides:

- bounded architecture documents
- package-internal external-evidence contracts
- deterministic local fixtures
- focused verifiers

The current repository line does not provide:

- validated external integration evidence
- a public API obligation
- a validated buyer, user, reviewer chain
- an approved service runtime

Current baseline findings from repository-grounded review are:

- current external consumer: `none`
- current public consumer: `none`
- current commercial validation evidence: `none`
- stable package-internal type gap: `none`
- stable service-boundary type gap: `none`

Current concrete artifact baseline includes:

- [external-evidence-assurance-platform-v0.1.md](</D:/AI project/mindforge-guard/docs/external-evidence-assurance-platform-v0.1.md:1>)
- [external-evidence-assurance-service-gap-assessment-v0.1.md](</D:/AI project/mindforge-guard/docs/external-evidence-assurance-service-gap-assessment-v0.1.md:1>)
- [external-evidence-assurance-minimal-service-api-proposal-v0.1.md](</D:/AI project/mindforge-guard/docs/external-evidence-assurance-minimal-service-api-proposal-v0.1.md:1>)
- [external-evidence-assurance-persistence-boundary-proposal-v0.1.md](</D:/AI project/mindforge-guard/docs/external-evidence-assurance-persistence-boundary-proposal-v0.1.md:1>)
- [external-evidence-assurance-authentication-tenant-boundary-proposal-v0.1.md](</D:/AI project/mindforge-guard/docs/external-evidence-assurance-authentication-tenant-boundary-proposal-v0.1.md:1>)
- [external-evidence-assurance-idempotency-semantic-alignment-architecture-checkpoint-v0.1.md](</D:/AI project/mindforge-guard/docs/external-evidence-assurance-idempotency-semantic-alignment-architecture-checkpoint-v0.1.md:1>)
- [verificationTypes.ts](</D:/AI project/mindforge-guard/packages/guard-core/src/externalEvidence/verificationTypes.ts:1>)
- [minimalServiceApiTypes.ts](</D:/AI project/mindforge-guard/packages/guard-core/src/externalEvidence/minimalServiceApiTypes.ts:1>)

This protocol starts from the conclusion that the next missing proof is
consumer evidence, not a new implementation line.

## 4. Explicit Non-Goals

This phase introduces no:

- source change
- fixture change
- sample change
- verifier change
- package change
- public-export change
- HTTP service
- HTTP route
- middleware
- worker
- queue
- persistence implementation
- authentication implementation
- tenant implementation
- conformance implementation
- billing implementation
- pricing logic
- invoice logic
- payment logic
- deployment authority
- approval authority
- blocking authority
- certification authority
- compliance designation
- trust designation
- durable-claim registry

This phase does not claim:

- that discovery is complete
- that a pilot is already validated
- that current demand is validated
- that a public API is currently required
- that transport is a current gap without consumer evidence
- that persistence is justified without a durable consumer

## 5. Product Boundary

MindForge Guard remains:

- verification-only
- recommendation-only
- additive-only
- non-executing
- non-control-plane
- human-review-oriented
- producer-neutral
- default-off
- local-first where implemented
- deterministic where implemented

The fixed relationship remains:

`External systems issue evidence. Guard verifies evidence.`

Guard does not become:

- an approval gate
- a blocking system
- a deployment authority
- a runtime enforcement system
- a certification service
- a compliance designation layer
- a trust authority
- an identity provider
- a tenant control plane
- a payment processor
- a durable-claim registry

`AssuranceReport` does not become:

- a certificate
- an approval
- a compliance declaration
- a deployment authorization
- a safety guarantee
- a trust guarantee

This protocol preserves:

- `audit` output, verdict, and exit semantics unchanged
- `permit` behavior unchanged
- `classify` behavior unchanged
- recommendation-only
- additive-only
- non-executing
- default-off
- no authority scope expansion

## 6. Discovery Questions

The discovery program must answer the following without guessing:

1. Which workflow currently produces the raw evidence that could become one
   `EvidencePackage`?
2. Which exact role reads `AssuranceReport`, and at which decision point?
3. Which exact human owns the final review judgment outside Guard?
4. Which trigger event causes the workflow to need independent verification?
5. What current alternative is used instead of Guard today?
6. What concrete failure, delay, rework, or uncertainty happens now?
7. Which role is producer, integrator, report reader, human reviewer, buyer,
   and usage-record consumer?
8. Can the team provide a real, anonymized, or representative artifact sample?
9. Will the team participate in a local-first, non-executing pilot?
10. Does the need truly require transport, persistence, auth/tenant, or
    fingerprint-conformance work, or is local review sufficient?

## 7. Consumer Role Model

### Evidence producer

Candidate examples:

- AI coding agent
- CI/CD pipeline
- agent runtime
- security remediation tool
- policy or evaluation system
- signed-receipt producer

Discovery must determine:

- what raw evidence is produced
- whether stable ID, version, timestamp, hash, or signature exists
- who assembles the `EvidencePackage`
- when Guard verification would be triggered

### Integration owner

Candidate examples:

- platform engineering
- DevSecOps
- developer tooling
- AI platform team
- security engineering

Discovery must determine:

- who owns the integration
- whether local-first exchange is acceptable
- whether the team prefers CLI, file exchange, CI artifact exchange, or API
- whether the need truly requires an async service

### AssuranceReport consumer

Candidate examples:

- security reviewer
- AI governance reviewer
- engineering manager
- release reviewer
- auditor
- risk owner

Discovery must determine:

- where in the decision flow the report is read
- whether the report changes information quality, review speed, or risk
  detection
- whether the report must enter an existing ticket, PR, SIEM, GRC, audit, or
  release workflow

### Human-review owner

Discovery must identify:

- who carries the final human judgment
- how Guard recommendations are used
- which conclusions always require human confirmation
- which phrases would be misread as approval or certification

### Economic buyer

Candidate examples:

- CISO
- Head of AI Governance
- VP Engineering
- Head of Platform
- Compliance or Risk leader
- DevSecOps leader

Discovery must keep separate:

- buyer
- daily user
- reviewer
- integration owner
- evidence producer

### Usage-record consumer

Discovery must determine:

- whether any role needs `VerificationUsageRecord`
- whether it is needed for capacity, cost attribution, audit, or service
  operations
- whether durable metering is truly required
- whether local technical accounting is sufficient
- billing need must not be inferred automatically

## 8. Priority Archetypes

The discovery program must assess at least the following six archetypes.
Priority is based on evidence accessibility, reviewer clarity, boundary fit, and
 pilot suitability, not market size alone.

| Archetype | Producer candidate | Report consumer candidate | Human reviewer | Economic buyer | Likely workflow trigger | Likely evidence artifact | Current alternative | Strongest pain hypothesis | Key disconfirming question | Local-first fit | Service-runtime necessity | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1. AI-generated software change / coding-agent teams | AI coding agent or repository workflow | engineering manager or governance reviewer | code reviewer or release reviewer | VP Engineering or Head of Platform | PR review before merge or release | PR evidence pack, diff summary, test record | PR comments, checklists, manual screenshots | evidence completeness and review context drift across PR review | Is existing PR evidence already sufficient without independent assurance? | high | likely no at pilot start | high |
| 2. CI/CD and DevSecOps platform teams | CI pipeline or release workflow | release reviewer or platform lead | release manager or platform reviewer | Head of Platform or DevSecOps leader | release candidate review or deployment-prep review | build log, manifest, rollback evidence, release ticket | CI logs, release checklist, ticket workflow | rollback, provenance, and authorization evidence are fragmented | Do current CI artifacts already satisfy reviewer needs without Guard? | medium-high | unclear until artifact exchange is proven insufficient | high |
| 3. AppSec and cyber-remediation teams | security remediation workflow or patch tool | security reviewer or app owner | security owner | CISO or AppSec leader | security patch enters human review | authorization note, patch diff, test log, static-analysis log | ticket thread, patch review, spreadsheet, SIEM note | authorization, test, and rollback evidence are hard to review together | Is the current security patch review already well served by existing ticket plus diff flow? | medium | likely no at pilot start | medium-high |
| 4. Agent runtime or agent-framework vendors | agent runtime receipt emitter | governance reviewer or platform customer | customer review owner | product leader or platform buyer | runtime emits decision receipt or action record | signed receipt, provenance record, decision trace | runtime-native logs or receipts | producer-native receipts are not independently reviewable enough | Would consumers trust the producer receipt alone without a separate assurance layer? | medium | unknown; may depend on buyer workflow | medium |
| 5. AI governance, GRC, or audit workflow teams | imported workflow pack or review bundle | auditor or risk owner | governance review owner | Head of AI Governance or Risk leader | formal governance review or audit sample review | evidence bundle, report package, missing-evidence record | manual audit worksheet, GRC entry, document bundle | evidence normalization and missing-evidence visibility are inconsistent | Do they need Guard output, or only cleaner producer documentation? | medium | possibly later, not assumed now | medium |
| 6. Enterprise internal AI platform engineering teams | internal platform workflow or toolchain | platform governance lead | designated platform reviewer | Head of Platform or AI platform lead | onboarding or recurring workflow review | workflow bundle, runtime trace, tool policy note | internal docs, wiki, ticket, custom scripts | platform teams lack a bounded review artifact across heterogeneous tools | Can a file-based local pilot fit their review flow before any service demand appears? | high | likely no at pilot start | high |

## 9. Jobs-to-be-Done Hypotheses

These are hypotheses only. None are validated at protocol creation.

| JTBD | Trigger | Producer | Evidence | Current workflow | Current pain | Reviewer | Desired outcome | Guard role | Forbidden Guard role | Evidence needed to validate | Disconfirming evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1. Validate AI-generated software change evidence completeness before PR review | AI-generated code change enters PR review | AI coding agent or repo workflow | diff summary, tests, prompts, reviewer notes | PR thread plus manual checklist | review misses missing evidence or burns reviewer time reconstructing context | code reviewer or release reviewer | reviewer sees bounded evidence and missing items earlier | verify supplied review evidence and produce scoped report | approve merge or claim production readiness | real PR review workflow, artifact sample, report-reading feedback | team says existing PR tooling already solves this problem |
| 2. Validate authorization, testing, and rollback evidence for cyber remediation before human review | security patch enters remediation review | remediation tool or security engineer workflow | authorization ticket, patch diff, test log, rollback note | ticket plus patch review plus ad hoc notes | remediation evidence is scattered or incomplete | security reviewer | faster evidence review without granting release authority | verify supplied remediation evidence and missing items | authorize patch deployment or certify security | real remediation workflow, artifact sample, named reviewer | reviewer says producer-native ticket and patch flow are already enough |
| 3. Independently verify runtime decision receipt completeness and provenance | agent runtime emits decision receipt | runtime or receipt producer | receipt, provenance record, action trace | vendor log or runtime-native receipt | receipt is self-asserted and hard to compare across tools | governance reviewer or buyer-side reviewer | independent evidence-bound review artifact | normalize and verify producer-issued evidence | become the runtime, policy engine, or execution controller | real receipt sample, reviewer feedback, bounded pilot target | customer says producer receipt alone is sufficient |
| 4. Produce deterministic assurance artifacts for enterprise AI workflow review | workflow enters governance or audit review | internal platform workflow owner | workflow bundle, review standards, missing-evidence notes | manual review packet or GRC entry | inconsistent evidence quality and low repeatability | governance or audit reviewer | deterministic report for review and evidence follow-up | produce bounded assurance artifact for human review | declare compliance or make final governance decision | concrete review workflow, artifact bundle, human review owner | workflow has no distinct review point or no human owner |
| 5. Normalize cross-tool evidence during handoff between workflows or runtimes | toolchain handoff or cross-runtime review boundary | CI system, runtime, or platform exporter | bundle of logs, manifests, receipts, outputs | custom scripts and manual stitching | evidence format mismatch causes delays and ambiguity | integration owner and reviewer | one bounded reviewable package with explicit gaps | normalize and surface missing evidence | create a required public contract without evidence | two-sided producer-consumer workflow and artifact sample | handoff teams prefer direct producer-native artifacts with no extra review layer |

## 10. Interview Guide

The interview guide must remain non-leading and must not assume that Guard is
needed.

### Current workflow

- When did the most recent workflow of this kind happen?
- From initial input to final human judgment, what steps actually occurred?
- Who provided the evidence?
- Who checked the evidence?
- Who carried the final responsibility?
- Which artifacts were retained?

### Current pain

- Which step most often loses evidence, distorts context, or slows review?
- How do you currently detect missing test, authorization, rollback, or
  provenance evidence?
- What was the most recent failure, delay, or rework event?
- What concrete consequence did that failure cause?

### Current alternatives

- Do you currently use logs, tickets, PR comments, GRC records, SIEM records,
  release checklists, or spreadsheets?
- Why is the current method not sufficient?
- Which parts of the current method are already good enough?

### Independent assurance

- Why would a layer independent from the producer be useful here, if at all?
- Is the producer's own summary already sufficient?
- Which information must be reviewed independently from the producer?
- In what situation would Guard add no value at all?

### Artifact and integration

- Can you provide a real, anonymized, or representative `EvidencePackage`
  sample?
- Would you prefer file exchange, CLI, CI artifact exchange, or API exchange?
- Do you actually need persistence?
- Do you actually need async processing?
- Do you actually need tenant isolation?
- Do you actually need conformance vectors?

### Decision and value

- Who would read `AssuranceReport`?
- What human review action would it change, if any?
- Would it reduce review time, rework, or uncertainty?
- What result would make you reject a pilot?

### Pilot willingness

- Would you try a local-only, non-executing pilot?
- What type of sample could you provide?
- Who should participate in the pilot review?
- What are the success criteria for the pilot?

Forbidden interview framing:

- Guard will approve your workflow
- Guard will block unsafe actions
- Guard will certify the workflow
- Guard will guarantee safety
- Guard must be delivered as a SaaS

## 11. Artifact Request Guide

When requesting artifacts from a prospective consumer, ask only for the minimum
needed to understand the current workflow and review boundary.

Preferred request order:

1. one anonymized workflow description
2. one current trigger event
3. one current evidence bundle or representative sample
4. one current review artifact or review notes example
5. one current failure, delay, or missing-evidence example
6. one description of who reviews and who decides
7. one statement of whether a local-first pilot is acceptable

Ask for artifacts such as:

- evidence bundle or pack sample
- diff summary
- build, test, or analysis output
- authorization ticket or approval context note
- runtime receipt or provenance record
- reviewer checklist or report-reading notes
- current alternative artifact, such as a ticket, PR thread, spreadsheet, or
  GRC entry

Artifact handling rules:

- prefer anonymized or redacted artifacts
- request representative artifacts when real artifacts cannot be shared
- keep sensitive data out of the public repo
- store only aggregated, approved findings in public docs
- keep raw interview notes and non-public artifacts in an approved private
  location

Artifact request must not imply:

- transport implementation
- persistence implementation
- auth or tenant implementation
- conformance implementation
- billing need

## 12. Validated Evidence Definition

The following may count as validated consumer evidence:

- direct interview record
- approved anonymized workflow description
- real, anonymized, or representative evidence sample
- real report review feedback
- explicit pilot willingness
- identified integration owner
- identified human-review owner
- identified buyer or budget owner
- consumer-bound input and output requirement
- concrete current failure case

Validated consumer evidence must come from direct human contact or approved
artifact review. Level `2` or above is required to change an
architecture-roadmap judgment. Level `3` or `4` is required before transport,
public contract, persistence, auth/tenant, or conformance follow-up is opened.

## 13. Non-Evidence Definition

The following do not count as validated consumer evidence:

- docs
- source code
- fixtures
- focused verifiers
- future maintainers
- product vision
- web articles
- social-media likes
- Reddit comments
- LinkedIn comment counts
- competitor feature lists
- unsupported consultant inference
- generic statements such as "enterprises should need this"
- casual interest without workflow detail

These materials may help form hypotheses, but they do not validate demand or
consumer obligation.

## 14. Evidence Quality Levels

### Level 0: hypothesis only

- internal assumption
- web research
- no direct consumer contact

### Level 1: direct statement

- direct conversation
- no concrete workflow or artifact

### Level 2: workflow evidence

- concrete current workflow
- named role relationships
- specific failure, delay, or cost

### Level 3: artifact evidence

- real, anonymized, or representative artifact
- consumer reviews an actual output

### Level 4: pilot commitment

- identified producer
- identified reviewer
- agreed pilot scope
- sample availability
- success criteria

Only Level `2` or above may change architecture-roadmap judgment.
Only Level `3` or `4` may justify follow-up on public contract, transport,
persistence, auth/tenant, or conformance boundaries.

## 15. Evidence Ledger Template

The repository ledger remains empty at protocol creation.

| Record ID | Date | Organization or anonymized identifier | Archetype | Participant role | Producer / consumer / reviewer / buyer / integrator role | Current workflow | Trigger event | Evidence artifact | Current alternative | Concrete pain | Failure example | Report reader | Human-review owner | Usage-record need | Integration preference | Persistence need | Authentication/Tenant need | Transport need | Conformance need | Sample provided | Pilot willingness | Evidence quality | Contract obligation indicated | Disconfirming evidence | Follow-up | Consent/confidentiality status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

No participant or organization records are pre-filled in this document.

## 16. Minimum Evidence Threshold

Before `External Evidence Assurance Consumer Discovery v0.1` may be declared
complete, the program must collect at least:

- 5 valid interviews
- coverage across at least 3 archetypes
- at least 2 complete producer-to-reviewer workflows
- at least 2 real, anonymized, or representative evidence artifacts
- at least 2 instances of actual report-review feedback
- at least 1 clear pilot candidate
- at least 1 clear piece of disconfirming evidence
- an explicit separation of buyer, user, reviewer, integrator, and producer

Until those thresholds are met, the state remains `DISCOVERY_IN_PROGRESS`.

These thresholds are discovery gates only.
They are not a statement of product-market fit.

## 17. Pilot Eligibility

A local pilot may be recommended only if all of the following are true:

- the producer can provide fixed inputs
- the reviewer can name the human review flow where the report will be read
- the human-review owner is explicit
- the pilot does not require Guard to approve, block, or deploy
- the pilot can remain local-first
- the pilot does not require public export
- the pilot does not require a production service
- success criteria are explicit
- data use is permitted
- failure and stop conditions are explicit

Pilot eligibility does not authorize:

- HTTP service
- persistence
- authentication
- tenant model
- public API
- conformance implementation
- billing

## 18. Architecture Trigger Routing

### Local report review only

Route:

`Local Consumer Pilot Assessment`

Gate:

- Level `2` or above workflow evidence
- explicit human-review owner
- local-first fit
- no service-runtime requirement

### Transport-visible request and response

Route:

`External Evidence Assurance Transport and Problem Mapping Assessment v0.1`

Gate:

- Level `3` or `4` evidence
- concrete consumer-bound input and output need
- local file or CLI exchange shown insufficient for the validated workflow

### Durable same-job resolution

Route:

`External Evidence Assurance Durable Resolution Boundary Assessment v0.1`

Gate:

- real durable consumer
- need for durable same-job resolution
- need for effective scope, visibility, and persistence together
- Level `3` or `4` evidence

### Fingerprint conformance

Route:

`Fingerprint Conformance Boundary Proposal v0.1`

Gate:

- concrete consumer or approved bounded target
- consumer-bound input
- consumer-bound output
- failure taxonomy
- vectors or explicit vector plan
- Level `3` or `4` evidence

### Public export

Route:

separate public-export review

Gate:

- Level `3` or `4` external integration evidence
- stable contract obligation
- validated reason that package-internal scope is insufficient

### Insufficient evidence

Route:

- continue discovery
- or pause external-evidence service expansion

No new architecture line is opened only to preserve implementation momentum.

## 19. Decision Candidates

This protocol defines the following candidate decisions for later use. It does
not claim that any later candidate has been reached at protocol creation.

### A. `DISCOVERY_IN_PROGRESS`

Use when evidence thresholds have not yet been met.

### B. `LOCAL_PILOT_CONSUMER_VALIDATED`

Use when a real local-first pilot consumer exists, but no service or public API
obligation exists.

### C. `TRANSPORT_BOUNDARY_TRIGGER_VALIDATED`

Use when a real consumer clearly needs transport-visible input and output.

### D. `DURABLE_RESOLUTION_TRIGGER_VALIDATED`

Use when a real consumer clearly needs durable resolution, effective scope, and
tenant-visible persistence behavior together.

### E. `FINGERPRINT_CONFORMANCE_TRIGGER_VALIDATED`

Use when a real consumer satisfies the checkpoint-defined conformance reopen
conditions.

### F. `NO_ACTIONABLE_CONSUMER_EVIDENCE`

Use when enough interviews were completed but no actionable consumer evidence
was found.

### G. `DISCOVERY_SCOPE_REFINED`

Use when an initial archetype or JTBD must be narrowed or replaced without
opening implementation work.

At protocol creation, the current state remains `DISCOVERY_IN_PROGRESS`.

## 20. Stop Conditions

Immediately stop pursuing a consumer direction if:

- it requires Guard to assume approval or blocking authority
- it requires Guard to guarantee compliance or safety
- no human-review owner exists
- no workflow or artifact evidence can be obtained
- only general interest is expressed with no concrete workflow
- the integration request exceeds Guard's boundary
- the need requires a full SaaS before demand can be validated
- the direction requires unapproved handling of sensitive data
- the direction requires billing or payment in this phase

## 21. Privacy and Confidentiality

Discovery must follow these rules:

- prefer anonymized participant IDs
- do not store real names, company names, or sensitive artifacts without
  permission
- anonymize or redact samples before public-repo use
- do not commit secrets, personal data, or customer-confidential artifacts to
  the public repo
- public docs record only aggregated findings and the empty ledger structure
- raw interview records stay in an approved private location
- repo-visible evidence ledger entries must use anonymized or synthetic-safe
  references only after permission is confirmed
- validated consumer evidence and public documentation must remain separated

No public PR may contain unapproved customer information.

## 22. Discovery Execution Sequence

1. Confirm the archetype and workflow candidate.
2. Identify producer, integrator, reviewer, buyer, and human-review owner.
3. Capture the current workflow and trigger event.
4. Request one current alternative artifact and one evidence sample.
5. Record current pain and one concrete failure example.
6. Test whether local-first, non-executing review is acceptable.
7. Classify evidence quality.
8. Decide whether the result supports continued discovery, local pilot
   assessment, or a later gated architecture route.
9. Record disconfirming evidence explicitly.
10. Repeat across archetypes until threshold coverage is met or no actionable
    consumer evidence remains.

Following execution after this docs-only phase is human-led:

- interviews
- workflow capture
- artifact review
- pilot qualification

## 23. Reporting Format

Discovery reporting should remain operational and evidence-led.

Each reporting cycle should include:

- current discovery state
- interview count
- archetype coverage
- evidence-quality distribution
- current validated workflow count
- current artifact count
- current report-feedback count
- current pilot-candidate count
- disconfirming evidence collected
- open questions
- route recommendation, if any

Required reporting distinctions:

- hypothesis versus validated evidence
- local pilot readiness versus architecture-trigger evidence
- commercial interest versus technical need
- producer need versus reviewer need versus buyer need

## 24. Acceptance Criteria

This document is acceptable only if all of the following are true:

- discovery-protocol-only
- docs-only
- exactly one new document
- no existing file modification
- no source modification
- no fixture modification
- no sample modification
- no verifier modification
- no package modification
- no public export expansion
- no runtime implementation
- no conformance implementation
- no billing implementation
- no authority expansion
- validated consumer evidence at creation = `none`
- commercial validation evidence at creation = `none`
- current discovery state = `DISCOVERY_IN_PROGRESS`
- six archetypes assessed
- five JTBD hypotheses defined
- producer, consumer, reviewer, buyer, and integrator clearly separated
- interview guide complete
- artifact request guide complete
- evidence ledger empty
- evidence quality levels defined
- minimum evidence threshold defined
- pilot gate defined
- architecture trigger routing defined
- stop conditions defined
- privacy boundary defined
- web research does not count as validation
- docs, fixtures, samples, verifiers, and future maintainers do not count as
  external consumers
- public API is not described as a current gap without consumer evidence
- following execution is human-led interviews and artifact review
