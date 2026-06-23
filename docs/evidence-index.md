# Evidence Index

## 1. Purpose

The Evidence Index is a traceability aid derived from `GovernanceReportModel`.

It gives downstream consumers a compact, JSON-serializable map of evidence references and how those references relate to report conclusions and report-oriented surfaces.

## 2. Input Boundary

`generateEvidenceIndex(report)` consumes `GovernanceReportModel` only.

That means the Evidence Index:

- does not inspect Evidence Packs directly
- does not read artifact files
- does not resolve paths from disk
- does not compute governance conclusions

## 3. What The Evidence Index Maps

The Evidence Index reuses information already present in the report model:

- `evidence_refs`
- missing-evidence items
- human-review requirements
- next actions
- existing reason-code references

It is intended to help downstream consumers trace where evidence references appear and which report-oriented surfaces use them.

## 4. Relationship To Governance Conclusions

The Evidence Index is not a second governance engine.

It does not:

- compute verdicts
- compute risk
- compute evidence coverage
- select new reason codes
- infer new facts outside the report model

Guard Core Report Service remains the only place where governance conclusions are produced.

## 5. Expected Downstream Use

Future renderers and Studio-adjacent consumers may use the Evidence Index downstream for:

- traceability views
- evidence navigation
- report handoff support
- structured indexing of evidence references

Those downstream consumers should continue to treat Guard Core as the sole governance source of truth.
