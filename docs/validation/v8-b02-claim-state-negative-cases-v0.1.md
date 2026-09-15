# B02 claim/state negative cases v0.1

Status: **SPECIFICATION_ONLY / NOT_EXECUTED**. These are normative review cases for [ADR 0011](../adr/0011-mesr-claim-nonclaim-state-and-binding-contract.md), not fixtures installed into current evaluators, not repaired Experiment 3 execution, and not a claim that today's implementation passes.

Every future executable case must pin input_set_id, subject, claim, scope, evaluation_time, source refs, registry/entry versions and digests, module lock, and method version. Each expected primary state applies to a named inference/basis, not to all propositions in the pack. Missing required context is explicit; no test helper may supply it silently.

| ID | Given / requested claim | Expected oracle | Forbidden inference |
|---|---|---|---|
| N01 | No verification event exists; request verification occurred/passed | Execution is not demonstrated; positive claim UNRESOLVED with missing event. Preserve any explicit producer not_run record separately. | Verification failed; a synthetic failed/not_run event from absence |
| N02 | Bound producer verification event passes; independent verifier/custody basis absent | Producer-attributed result may be SUPPORTED with SUPPORTED_BY_PRODUCER_ASSERTION annotation; independence = UNRESOLVED. The producer-only inference to independence is separately UNSUPPORTED. | Independence false merely from absence; result equals independence |
| N03 | Registered semantic entry requires subject and provenance; caller supplies neither and requests required_bindings=[] | Effective requirements include registry obligations; UNRESOLVED and named missing bindings; cannot become SUPPORTED. | Caller request weakens the registry |
| N04 | Caller asserts supported_claim_parts containing an explicit Core nonclaim on that evidence path | Excluded inference UNSUPPORTED; retain Core nonclaim and caller assertion as attributed input. | Caller positive overrides Core; nonclaim proves world falsity |
| N05 | Two admissible records assert passed and failed for the same check execution, subject, scope and time; no resolution basis | CONFLICTED with both references and named conflict criterion. | Last-write wins, majority wins, generic source ranking |
| N06a | Historical support exists; no established current-applicability basis | Historical support retained; current claim UNRESOLVED. | Historical standing is current by default |
| N06b | Historical support exists; explicit expiry before reliance time or applicable revocation/supersession established | Current claim STALE with rule/time/reference; historical evidence unchanged. | Retroactive historical falsity; silently refreshed event time |
| N07 | Required witness array is []; caller treats key presence as sufficient | UNRESOLVED; empty witness set fails the witness predicate. | Empty array proves event/execution/independent witness |
| N08 | Verification-executed binding is false; positive occurrence predicate requires true | False is valid data, but predicate unsatisfied; positive claim cannot be SUPPORTED. Use UNRESOLVED absent an admitted completed negative criterion; preserve explicit false assertion. | Boolean presence equals predicate satisfaction; false discarded as missing data |
| N09 | Unknown semantic ID/version mixed with a known positive entry | UNRESOLVED for the composite; unresolved ID is retained. | Filtering unknown IDs creates support |
| N10 | Caller supplies contradicted_claims but no admissible contradictory evidence | UNRESOLVED for purported conflict, not CONFLICTED solely from the flag. | Caller controls primary state |
| N11 | Records differ only in subject or time; each is separately bound | Evaluate separately; no CONFLICTED state solely from differing values. | Different context implies contradiction |
| N12 | Complete bound check returns inconclusive | INCONCLUSIVE for that check. If a necessary subject/method binding is missing, UNRESOLVED instead. | Inconclusive equals failed or evidence absent |
| N13 | Producer says evidence is present; required sufficiency profile/claim-set/scope/time basis absent | Presence may be supported; sufficiency UNRESOLVED. | Evidence present equals evidence sufficient |
| N14 | Acceptance decision record exists; applicable acceptance authority basis absent | Decision occurrence may be supported within captured bounds; acceptance authority UNRESOLVED. | Occurrence verifies authority or authorizes execution |
| N15 | Legacy CB-22 does_not_support plus producer pass and missing separation/custody | Preserve legacy relation; excluded inference UNSUPPORTED, world-level independence UNRESOLVED. | Blind enum rename; independence false |
| N16 | Legacy report allow or block, no separate assurance basis | Preserve report exactly; requested assurance claim UNRESOLVED. | allow -> SUPPORTED/safe/accepted; block -> false |
| N17 | Present digest or external verified label/nonempty failed or skipped checks only | Integrity/independence cannot become SUPPORTED from presence. Missing proof UNRESOLVED. | Hash presence equals verified bytes; check presence equals independent success |
| N18 | Observation's nonclaim and a separately bound verification event | Observation path remains UNSUPPORTED for verification; evaluate independent verification path using its own full obligations. | Remove observation nonclaim, or globally veto valid separate evidence |

Required review coverage: all six primary states; UNSUPPORTED vs UNRESOLVED; required-binding union; false/empty semantics; nonclaim precedence; conflict comparability; historical/current separation; preservation of legacy surface/version/value. No status is a runtime gate or execution decision. B05-B09 must later add their own admitted detailed fixtures; these cases do not close those blockers.
