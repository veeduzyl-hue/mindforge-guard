# B07 temporal standing cases v0.1

Status: **SPECIFICATION_ONLY / NOT_EXECUTED**. Review oracles for [ADR 0015](../adr/0015-historical-current-standing-and-reliance-time-contract.md), not current runtime tests or repaired Experiment 3.

All cases preserve original bytes/digests and pin the B02 claim/binding envelope, historical evaluation, registry/module/method basis, explicit evaluation_time and reliance_time, temporal rules, evidence refs and snapshot coverage. No implicit current clock or automatic renewal. Other requirements must be explicitly complete before a positive result. Each assertion names whether it concerns historical support, current applicability, acceptance occurrence or authority.

| ID | Evidence and requested reliance | Expected repaired oracle | Must remain unchanged / forbidden inference |
|---|---|---|---|
| T01 | Historical support; currentness basis absent | Historical result retained; current claim UNRESOLVED | No current by default |
| T02 | Historically applicable basis with explicit end-exclusive expiry; reliance exactly at expiry | Current STALE; one instant before expiry may be SUPPORTED only if all other requirements met | Endpoint convention explicit; old report expiry predicate unchanged |
| T03 | Applicable revocation effective before reliance; issued by evidenced competent source | STALE for current applicability; original historical result retained | No retroactive historical falsity |
| T04 | No revocation entry in incomplete/outdated snapshot | UNRESOLVED for currentness; absence is not proof of non-revocation | No online lookup assumed |
| T05 | Admitted successor exists but displacement/applicability rule absent | No automatic STALE or currentness; UNRESOLVED where rule is necessary | Supersession != equivalence or erased predecessor |
| T06 | Explicit successor rule displaces previously applicable basis at reliance time | Current STALE; predecessor bytes/version still resolve historically | No alias retargeting or historical rewrite |
| T07 | New successful, attributable revalidation with required context and currentness basis | New basis may be SUPPORTED; old current result remains as recorded and linked | No edit of old verified_at/created_at |
| T08 | Current subject revision known incompatible with old review under explicit criterion | Old review reuse STALE; original review occurrence retained | Old approval does not cover new revision |
| T09 | Current subject or scope comparison unavailable | UNRESOLVED | Mere age/different label is not proven drift |
| T10 | Scope expands beyond originally bound resources/actions | Reused historical basis STALE if original applicability and scope loss proved | No automatic authority expansion |
| T11 | Environment materially changed under admitted criterion | STALE for historical basis at new context | Equality not inferred from environment name |
| T12 | Policy or dependency materiality rule and old/new snapshots prove loss | STALE; evaluate policy and dependency dimensions separately | Same successful test is not universal continuity |
| T13 | Policy/dependency version differs but impact criterion or current lock absent | UNRESOLVED | Version mismatch alone does not prove loss |
| T14 | Old authority evidence; no current principal/scope/time rebinding | Current authority UNRESOLVED; old-authority-only inference UNSUPPORTED | Authority evidence != current authority |
| T15 | Explicit current rebinding proof with all identity/authority/action/subject/time obligations met | New scoped authority basis may be SUPPORTED; acceptance/commitment occurrence still separate | No generated authority service or execution permission |
| T16 | Old approval, intact subject but current acceptance authority missing | Approval occurrence retained; current acceptance UNRESOLVED | Approval reuse != current acceptance |
| T17 | Revocation effective after requested historical reliance time | Evaluate earlier reliance using its own full basis; later revocation alone does not stale that earlier time | Event/knowledge/effective times not conflated |
| T18 | created_at supplied but evaluation_time or reliance_time absent | UNRESOLVED with missing time | No creation-time substitution |
| T19 | Admissible contradictory current-status records for same predicate/context/time | CONFLICTED; retain both refs | Different-time approval/revocation alone is not conflict |
| T20 | Proven expiry plus missing dependency snapshot | STALE takes B02 precedence; missing snapshot remains diagnostic | Missing data cannot erase explicit loss |
| T21 | Full applicability basis and method complete but undecidable continuity result | INCONCLUSIVE; omit a necessary input -> UNRESOLVED | No false positive/false default |
| T22 | Freshness age exceeds explicit claim-specific horizon | STALE with rule/ref; same age without rule -> UNRESOLVED | Age alone does not establish staleness |
| T23 | Reliance later than offline snapshot coverage with no admitted prospective basis | UNRESOLVED, even when all observed statuses say current | No future non-revocation guarantee |
| T24 | Ambiguous timezone or interval endpoint convention | UNRESOLVED; retain raw timestamp/rule | No rounding/grace-period invention |
| T25 | Legacy pack end_at equals pack.created_at or precedes it | Compatibility oracle: existing strict earlier-than predicate unchanged; new temporal result evaluated separately | No change to TIME_WINDOW_EXPIRED or old report wording |
| T26 | Known basis begins after reliance and has never applied to that requested context | Completed applicability exclusion may be UNSUPPORTED, otherwise UNRESOLVED; no invented historical support or STALE history | STALE reserved for proven loss of historical applicability |
| T27 | Harness task creation time and producer authority flags only | Missing currentness/rebinding facts remain UNRESOLVED under B03 | No synthesized canonical time, verification or authority |

The case set is specified, not executed. Historical bytes and review records are immutable; current results are separately versioned references. No runtime, report, reason-code or license behavior changes, and no Gate 1 opening.
