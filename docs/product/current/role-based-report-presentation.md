# Role-Based Governance Report Presentation (English, v0.1)

This is an **additive, offline, English-only presentation** of an existing v7.0.1 `single_agent_governance_report_preview` JSON. It does not use or change the separate historical Guard Core `GovernanceReportModel` renderer contract.

## Run (source checkout of the proposed branch)

Generate an existing JSON preview first:

```sh
guard report single-agent --pack examples/single-agent-governance-pack/hr-self-service-agent --preview --json > guard-single-agent-report.json
```

Render the English HTML locally:

```sh
node packages/guard/bin/guard.mjs report render --input guard-single-agent-report.json --out guard-readable.html --format html
```

Or use the installed `guard` binary after a **separately authorized future package release** containing this command. The published npm v7.0.1 **does not** contain the new renderer.

`--input` is a regular UTF-8 JSON file, up to 4 MiB; `--out` must name a *new* `.html` file in an existing directory. It will never overwrite an existing output. A Windows PowerShell 5.1 `>` redirect produces UTF-16LE; follow the first-report Windows CMD redirection guide to get native UTF-8 output first.

## Reader perspectives

- **Business owner:** intended task, summarized behavior, boundaries, evidence and risk in plain English.
- **Technical reviewer:** source references, receipt identifiers, hashes, reported provenance and continuity limits.
- **Governance / risk reviewer:** stated authority, drift, admissibility, open issues, findings and preview checks.

The three views use **the same** JSON fields, with inline source-field pointers and a read-only raw source JSON section. Radio-tab selection uses only HTML/CSS; no executable browser JavaScript, third-party libraries, hosted fonts, network fetches, or telemetry.

## Evidence and authority boundaries

- `ready_for_review` means **ready for human review**, never approval, security assurance or deployment authorization.
- Source-reported timestamps may refer to historical fixtures; the page never labels them the execution time.
- `receipt_refs` are source-reported identifiers; a `present` flag or hash does **not** establish external verification.
- The HTML includes both the source-reported `deterministic_hash` and a separate SHA-256 calculated over exact input JSON bytes; these are **different digest domains**.
- The renderer does not change, validate the reality of, or approve evidence; it performs *only* a minimal input-contract and non-enforcement-boundary check and escapes report strings.
- No JSON, Pack, report schema, CLI existing command/exit, pricing, license, runtime authority or V8 EAK/Producer behavior is changed.

## Tests

```sh
node scripts/verify_v7_role_based_report_render.mjs
```

The verifier covers deterministic repeatability, exact CLI byte equality with the pure renderer, original JSON unchanged, refusal of overwrite or contradictory authority claims, UTF-16 input rejection, unsafe-string HTML escaping and all three English role views. Testing this proposed source does not imply publication to npm or a verified Windows manual user session.
