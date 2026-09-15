# B05 independence and integrity falsifiers v0.1

Status: **SPECIFICATION_ONLY / NOT_EXECUTED**. These are review oracles for [ADR 0013](../adr/0013-independent-verification-and-integrity-evidence-contract.md), not installed fixtures or repaired Experiment 3 acceptance.

## Case envelope and state interpretation

Every future fixture explicitly supplies input_set_id, canonical claim/version, subject revision/artifact identity, scope, event_time, evaluation_time, evidence refs, registry version/digest, module lock and method version. Independent-check cases additionally bind producer/executor/verifier principals, separation criterion and custody records. No fixture helper may fill missing facts. "Other bindings complete" below means an explicitly authored control fixture satisfying every B02/ADR 0013 obligation, not implicit defaults.

Output preserves separate occurrence, result, independence, byte-integrity and custody claims, primary state per claim, missing bindings, nonclaims and exact legacy values. SUPPORTED means bounded support only. Apply B02 precedence to all cases. Producer-only inference UNSUPPORTED and world-level independence UNRESOLVED are different claim paths, never contradictory verdicts on the same path.

| ID | Given / mutation from explicit control | Expected repaired oracle | Falsified shortcut |
|---|---|---|---|
| I01 | Successful attributable check; established producer == verifier | Result can be SUPPORTED; independence for that check UNSUPPORTED by completed separation criterion; unrelated independent-check existence UNRESOLVED | Different software label implies independence |
| I02 | Successful recorded result; verifier identity absent | Independent verification UNRESOLVED, missing verifier principal; supplied-result attribution retained | Generated verifier ID or external label authenticates a verifier |
| I03 | Verifier distinct and identified; custody basis absent | Independence UNRESOLVED; retain separate principal-separation result | Distinct principal proves independent custody |
| I04 | verified label supplied, no successful attributable check/event/output | Independent verification UNRESOLVED; label-only inference UNSUPPORTED; no synthetic event | verified means independently checked |
| I05 | executed_checks contains only failed/skipped entries | No successful independent verification supported; with complete bound failed criterion, success UNSUPPORTED; skipped without event proof leaves occurrence UNRESOLVED. Label-only rows leave claim UNRESOLVED | Nonempty check list proves successful independent verification |
| I06 | Digest exists; exact artifact bytes unavailable | Integrity-to-reference UNRESOLVED, missing bytes; record digest declaration only | Hash presence proves integrity |
| I07 | Bytes and expected digest supplied; no recomputation event | Integrity-to-reference UNRESOLVED, missing comparison/check evidence | Bytes plus hash presence implies comparison occurred |
| I08 | Attributable recomputation over correct bytes yields declared digest != observed digest | Equality UNSUPPORTED; mismatch claim can be SUPPORTED; preserve both digests. B03 closure REJECTED | Mismatch silently accepted, or called CONFLICTED without contradictory assertions |
| I09 | Local comparison succeeds; producer controls sole custody | Byte equality SUPPORTED; independent custody UNSUPPORTED when sole-control facts/criterion are complete, otherwise UNRESOLVED; independence never inferred from match | Integrity verified implies independent custody |
| I10 | Independently attributable successful check with bound subject/scope/time, satisfied separation and custody predicates, complete method/inputs/outputs | Independent successful verification SUPPORTED for that check; integrity separately evaluated; acceptance UNRESOLVED absent separate decision/authority evidence | Independent verification implies acceptance or all claims sufficient |
| I11 | Different verifier ID, but established common operational control violates separation criterion | Independence UNSUPPORTED; preserve the successful result | String inequality establishes independence |
| I12 | Check subject digest, scope or time does not bind requested claim | UNRESOLVED for missing association; STALE only with proven loss of formerly applicable basis | Passing unrelated check supports requested subject |
| I13 | Same check, subject/scope/time has admissible passed and failed records with no resolution | CONFLICTED for result; preserve both refs; no last-write or majority resolution | Supplied status decides conflict |
| I14 | Complete bound method finishes inconclusive | INCONCLUSIVE for result/support; remove mandatory method input -> UNRESOLVED | Inconclusive equals failed or missing |
| I15 | Expected hash references raw bytes; recomputation used redacted/reserialized bytes | UNRESOLVED for raw equality without correct comparison; recorded derivative comparison remains separate; actual raw mismatch uses I08 | Different byte domains interchangeable |
| I16 | Harness only has verification counts/paths or run_command exit 0 | No canonical verification event; requested verification UNRESOLVED; B03 missing-fact rules retained | Execution success manufactures verification/independence |
| I17 | Old independent pass loses applicability under explicit B07 expiry/revocation rule | Current claim STALE; historical result and bytes unchanged | Past independent pass is perpetually current |
| I18 | Observation nonclaim plus a separate fully bound independent check | Observation inference UNSUPPORTED; independent event path may be SUPPORTED | Remove nonclaim, or use it to globally veto independent evidence |

Acceptance is a reviewed specification decision, not a claim current EAK passes these cases. Current EAK labels/snapshots and report bytes remain frozen. No execution, enforcement, authority expansion, B09/B10 work or Gate 1 opening occurs.
