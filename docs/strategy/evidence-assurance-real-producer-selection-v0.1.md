# Evidence Assurance Real Producer Selection v0.1

Status: Bounded producer-selection note for the Evidence Assurance Kernel PoC on 2026-08-27.

## 1. Purpose

This document selects real evidence producers for the Production Evidence Readiness Review line.

It does not authorize:

- adapter expansion by default
- cloud ingestion
- background synchronization
- OAuth platform work
- hosted connector work

Its purpose is narrower:

> identify the real producer categories with the highest validation value for the first bounded dry runs.

## 2. Repository-Relevant Anchors

Concrete repository anchors reviewed on 2026-08-27:

- `.github/workflows/guard-first-governance-report.yml`
- `docs/strategy/production-evidence-readiness-review-validation-plan-v0.1.md`
- `docs/deployment/staging-deployment-runbook.md`
- `apps/license-hub/README.md`

Observed repository facts:

- the repo already contains a concrete GitHub Actions workflow boundary for review-artifact generation
- the repo already names an active hosted License Hub deployment: `mindforge-license-hub-live`
- the retired staging runbook explicitly describes Vercel deployment setup and history for License Hub

These anchors make GitHub Actions and Vercel materially more repository-consistent than generic vendor-popularity picks.

## 3. Scoring Method

Scoring scale:

- `5` = strongest fit
- `3` = usable but bounded / mixed
- `1` = weak fit for the first bounded dry run

Criteria:

- review-decision relevance
- artifact availability
- independence / trust value
- machine readability
- verification feasibility
- repeatability
- integration cost
- privacy / credential burden
- Evidence Contract compatibility
- Production Evidence Readiness fit
- future release-continuity relevance

## 4. CI/CD Candidates

### Candidate A: GitHub Actions workflow run artifacts

Repository fit:

- direct repo anchor exists at `.github/workflows/guard-first-governance-report.yml`
- first-report artifact upload already uses GitHub Actions artifact conventions

### Candidate B: GitLab CI pipeline artifacts

Repository fit:

- technically strong producer category
- no direct repo anchor observed in this repository on 2026-08-27

### Candidate C: Jenkins pipeline run artifacts

Repository fit:

- common enterprise producer category
- no direct Jenkins boundary or sample run artifact is present in this repository on 2026-08-27

| CI/CD candidate | Review relevance | Artifact availability | Independence / trust | Machine readability | Verification feasibility | Repeatability | Integration cost | Privacy / credential burden | Contract compatibility | Prod-readiness fit | Release-continuity relevance | Total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| GitHub Actions workflow run artifacts | 5 | 4 | 4 | 5 | 5 | 5 | 4 | 3 | 5 | 5 | 5 | 50 |
| GitLab CI pipeline artifacts | 4 | 2 | 4 | 5 | 4 | 5 | 2 | 3 | 5 | 4 | 5 | 43 |
| Jenkins pipeline artifacts | 4 | 2 | 3 | 4 | 3 | 4 | 2 | 2 | 4 | 4 | 4 | 36 |

Recommended CI/CD candidate:

- GitHub Actions workflow run artifacts

Why:

- concrete repo workflow already exists
- artifact upload semantics are already visible in the repository
- workflow run identity, commit identity, and artifact references align directly with the current Evidence Pack and kernel concepts

## 5. Deployment / Runtime Provenance Candidates

### Candidate A: Vercel deployment metadata and build outputs

Repository fit:

- `apps/license-hub/README.md` names the active deployment `mindforge-license-hub-live`
- `docs/deployment/staging-deployment-runbook.md` documents historical Vercel project setup and deployment steps

### Candidate B: GitHub deployment and release evidence

Repository fit:

- strong adjacency to GitHub Actions
- weaker repo evidence than Vercel for deployment/runtime provenance specifically

### Candidate C: Kubernetes or Helm rollout manifests

Repository fit:

- strong generic deployment provenance producer category
- no direct Kubernetes or Helm boundary was observed in this repository on 2026-08-27

| Deployment / provenance candidate | Review relevance | Artifact availability | Independence / trust | Machine readability | Verification feasibility | Repeatability | Integration cost | Privacy / credential burden | Contract compatibility | Prod-readiness fit | Release-continuity relevance | Total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Vercel deployment metadata and build outputs | 5 | 4 | 4 | 4 | 4 | 5 | 4 | 3 | 5 | 5 | 5 | 48 |
| GitHub deployment and release evidence | 4 | 3 | 4 | 5 | 4 | 5 | 4 | 3 | 5 | 4 | 4 | 45 |
| Kubernetes or Helm rollout manifests | 5 | 1 | 4 | 5 | 3 | 5 | 1 | 2 | 4 | 4 | 5 | 39 |

Recommended deployment / provenance candidate:

- Vercel deployment metadata and build outputs

Why:

- it is the only concrete deployment surface explicitly named in current repo materials
- it offers deployment identity, environment identity, timestamp, commit linkage, and runtime-adjacent provenance without forcing new service architecture
- it creates a cleaner bridge from Production Evidence Readiness into future release continuity and Temporal Authority work

## 6. Real Artifact Requirements

### Preferred CI/CD candidate: GitHub Actions

Required source artifacts:

- workflow run identity
- workflow definition reference
- commit SHA / branch / repository identity
- test result artifact or log
- build result artifact or log
- uploaded artifact identity
- artifact digest when available
- timestamp / actor metadata

### Preferred deployment / provenance candidate: Vercel

Required source artifacts:

- deployment identity
- project / environment identity
- deployment status
- source commit / branch identity
- deployment timestamp
- build output or deployment artifact identity
- provenance or attestation reference when available
- raw deployment metadata export or equivalent bounded record

No producer capability is invented here.

If a producer does not expose one of these fields, the dry run must preserve that absence as a limitation rather than fabricate it.

## 7. Real Artifact Readiness Gate

Assessment on 2026-08-27:

- `REAL_ARTIFACT_AVAILABLE = UNKNOWN`
- `ACCESS_PATH_CLEAR = UNKNOWN`
- `NO_SECRET_LEAKAGE = UNKNOWN`
- `MAPPING_REUSABLE_HYPOTHESIS = YES`

Why:

- the repository identifies likely real producers
- the repository does not include a real workflow-run artifact sample for the selected GitHub Actions path
- the repository does not include a real Vercel deployment artifact export for the selected deployment/provenance path
- secret-safe retrieval and redaction rules for those real artifacts have not been frozen in this branch
- the PoC kernel semantics already show reusable mapping behavior across pack-bounded, CI/CD-like, and runtime-provenance-like evidence shapes

## 8. Experiment 1 Decision

Experiment 1 rule requires all four readiness-gate values above to be `YES`.

Current result on 2026-08-27:

- `EXPERIMENT_1 = NOT EXECUTED`

Current bounded blockers:

1. no real GitHub Actions run artifact bundle has been supplied or captured in this branch
2. no real Vercel deployment metadata bundle has been supplied or captured in this branch
3. a secret-safe retrieval / redaction path has not yet been frozen for those producer artifacts

## 9. Recommendation

Proceed only with:

1. one real GitHub Actions workflow run artifact bundle
2. one real Vercel deployment / provenance artifact bundle
3. local-only normalization, verification, and limitation capture

Do not widen producer count before those two repository-consistent candidates prove reusable mapping value.
