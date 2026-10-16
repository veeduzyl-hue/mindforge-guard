# GitHub Change Source Adapter v0.1 - R1 corrective source handoff

2026-10-16. Only repository identity, commit self-parent, and check-run state
consistency corrections. No schema version or source-profile expansion.

## Materialization status

The prescribed R1 directory creation returned Access denied in Codex's sandbox.
R1_FILES_CREATED=0 at handoff. No source or repository file was written.
This is a source patch handoff, not a completed disk candidate or acceptance.
The unchanged synthetic fixture is copied byte-for-byte by the Owner script.

## Corrections

Repository names are compared by full owner/repository with ASCII case-insensitive
matching; emitted names are preserved. Known IDs must be positive safe integers.
Missing/null/UNKNOWN identity remains unresolved, not guessed. Same normalized
full name with contradictory IDs conflicts; different full names and distinct
IDs remain eligible fork observations. No caller consistency flag overrides this.

Every supplied PR-list and inspected-commit parent array rejects its own commit
SHA as a parent, even when both sources agree on that error. Existing duplicate
and cross-source parent checks remain. No DAG reconstruction is added.

Nonfinal check-runs reject a known final conclusion or valid completed_at.
Completed observations require an available final conclusion and completion time
for a positive local consistency result. Missing fields are MISSING, explicit
UNKNOWN or invalid event clocks remain UNKNOWN, and conflicting known values are
CONFLICT. Missing completion time stays null and is never filled from capture.
A completion preceding a known start time is conflicting. Commit Status is unchanged.

Adopted source semantics: GitHub's Check Runs REST documentation says a conclusion
implies completed status and a completed status/completed_at requires a conclusion.
Missing completed_at in a completed source observation is conservatively incomplete;
this does not claim completed_at is mandatory in every API write request.
Reference (documentation only; no GitHub API evidence was queried):
https://docs.github.com/en/rest/checks/runs?apiVersion=2022-11-28#update-a-check-run

## Executed verification at source handoff

Both prepared MJS texts passed node --check through stdin.
Original 8 positive + 47 negative memory regressions passed.
R1 9 positive + 26 negative memory tests passed.
Prior independent I01-I20 plus three parser checks passed; I21 independently
compared two permission-restricted Node processes using the prepared adapter
text in memory, with identical stdout/stderr and exits in UTC/Asia/Shanghai.
All expectations were fixed before execution. Input immutability passed.
The original disk fixture was only read. No prepared R1 disk CLI or full disk
verifier was run. No R1 file byte/SHA readback exists at source handoff.
The Owner must materialize all four files and run the full verifier separately.

REFERENCE_NOT_LOCATED
CONTRACT_COMPATIBILITY_NOT_ESTABLISHED
PRODUCT_EXECUTED=NO
ACTUAL_SESSION_ACQUIRED=NO
CANONICAL_EVIDENCEPACK_CREATED=NO
G03_IMPLEMENTATION=FROZEN
T2_FORMAL_CLOSURE=BLOCKED
S04_FACTUAL_ADMISSION=UNRESOLVED
ASSURANCE_NOT_EVALUATED

Audit output/verdict/exit (including 25), permit/classify behavior, recommendation-only,
additive-only, non-executing, default-off posture and authority scope are unchanged.
No Guard/Core/Harness/EAK/Producer invocation, session acquisition, runtime/network
capability, commit, PR, merge, worktree operation, ACL or sandbox change is added.

## Frozen v0.1 historical documentation follows

Everything below describes the original v0.1 engineering delivery. Its historical
PASS/completion receipt does not establish R1 disk completion or acceptance.

# GitHub PR Change Source Snapshot v0.1

2026-10-16. Independent, opt-in, offline source-record adapter. Internal engineering
delivery only. Subject: GitHub Pull Request Change Evidence Source Adapter v0.1.
The subject is a prospective original-source candidate, with no S04 admission.

This standalone adapter is opt-in and offline. It reads explicit source inputs and emits bounded observations with ASSURANCE_NOT_EVALUATED. It does not integrate with Guard product execution or establish G03 implementation admission.

## Existing contracts and boundaries reused

These existing repository documents were located and read, without modification:

| Existing source | Constraint reused |
| --- | --- |
| `docs/evidence-contract-v1.md` | Source identity is distinct from authority; absent evidence is unavailable; canonical workflow repository context is not a new adapter pack contract. |
| `docs/adapter-responsibility-matrix-v0.1.md` | Preserve source locators, distinguish available bytes, retain limitations, invent no absent fields or authority. |
| `docs/strategy/evidence-assurance-real-producer-selection-v0.1.md` | GitHub source relevance is bounded; commit, repository, artifact and time identity remain explicit. |
| `docs/planning/v8-gate1-g03-canonical-producer-integration-v0.1.md` | Original, normalized, canonical and report digest domains remain separate; packaging, independent validation and assurance are separate stages. |
| `docs/planning/v8-gate1-t3-01-s23-changed-files-change-inventory-source-interface-authorization-v0.1.md` | PR file observations do not become subject-bound complete canonical changed-file inventory; no filename normalization, sorting or invented rename. |
| `docs/planning/v8-gate1-t3-01-canonical-packaging-lifecycle-sequencing-assessment-v0.1.md` | Formal T3/G03 implementation remains frozen. This adapter does not implement its private records, S22/S23/S27 suppliers, capture wrapper or packager. |
| PR #345's mainline `scripts/check_static_inventory_contract_v0.1.mjs`, `scripts/verify_static_inventory_checker_v0.1.mjs`, `docs/validation/static-inventory-checker-v0.1.md` | Independent Node built-ins, explicit input, stable output, synthetic verification, byte readback, mandatory assurance boundary and portable paths. No code dependency is introduced. |

`Real Evidence Producer Minimum Contract v0.1` and
`GitHub Change Evidence Producer Profile v0.1` were **not located** in the
checked-out tree, main's tracked paths or the searched local document locations.
The later G03 Lifecycle Model R1 / Successor Contract / S04 Source-ready Entry
artifacts named by the Owner were also not independently located here; their
reported statuses are Owner context, not verified document contents.
No replacement for those contracts is created. No conformance to them is claimed.
Independent acceptance must reconcile their actual versions and mapping rules
when their locations are supplied. `EXISTING_CONTRACTS_REUSED = PARTIAL`.

## Run

From this standalone directory, using Node.js 24.15.0 (the tested version):

```powershell
node scripts/github_change_source_snapshot_v0.1.mjs
node scripts/github_change_source_snapshot_v0.1.mjs --input tests/fixtures/github-change-source-snapshot-v0.1/synthetic-pr.json
node --check scripts/github_change_source_snapshot_v0.1.mjs
node --check scripts/verify_github_change_source_snapshot_v0.1.mjs
node scripts/verify_github_change_source_snapshot_v0.1.mjs
```

No arguments returns `DISABLED`, with `ASSURANCE_NOT_EVALUATED`, and reads no
input. `--input` reads exactly the named JSON file. Output goes only to stdout.
Exit 0 means disabled or locally consistent supplied observations; exit 1 means
invalid, conflicting, missing, unknown or incomplete source input; exit 2 means
usage/read error. These are standalone adapter exit codes, unrelated to Guard.
All success, error and disabled output includes `ASSURANCE_NOT_EVALUATED`.
There is no online option, token lookup, ambient repository discovery, session
lookup, output path, directory scan, automatic current time or output-file writer.

## Offline input interface

This is a local source-snapshot input envelope, not a replacement Producer
Minimum Contract, private S23 contract, NormalizedEvidenceRecord or EvidencePackV1.
The one synthetic fixture is the executable interface example.

Required closed top-level keys:

- `schema_version`: `github-pr-change-source-snapshot/v0.1`.
- `repository`: exact positive safe integer GitHub `id` and `full_name`.
- `pr_number`: exact positive safe integer.
- `inspected`: explicit full lowercase 40-character SHA and `selection_basis`.
- `responses`: explicitly supplied GitHub response envelopes.

`selection_basis` requires `kind`, `source_locator`, `source_pointer`, and
`explanation`. Kinds: `PR_HEAD`, `PR_COMMIT`, `MERGE_COMMIT`. Selection must
reference the exact observed field for the same SHA. No head default or
merge-to-head substitution exists. A merged commit is selectable only when the
PR reports `merged=true`, a valid `merged_at`, and its actual merge SHA.
An unmerged PR's reported synthetic merge SHA is kept separately from actual
merge identity. An inspected commit requires its own commit response.

Each response has exactly `kind`, `locator`, `captured_at`, `state`, `page`,
`has_next`, `body`, and `raw_base64`. Supported kinds are `pr`, `commits`,
`inspected_commit`, `files`, `check_runs`, `statuses`.
No session or other source set is supported.

Locators must be exact HTTPS `api.github.com/repos/<repository>/...` REST routes.
PR routes bind the exact PR; commit/check/status queries bind the explicit
inspected SHA. Collection pages require `per_page=100` and explicit consecutive
`page` numbers from 1. Check queries additionally require `filter=all`.
Unknown query parameters, credentials, fragments, redirects and other hosts
are not accepted. No locator is opened or fetched.

Collection rows contain one response per page. `has_next` is true for each
nonterminal supplied page and false for the last. Null/unknown pagination,
missing pages, duplicate pages, `INCOMPLETE` retrieval, inconsistent check totals,
or PR commit/file count discrepancies cannot establish a complete observation.
`state=NOT_OBTAINED` requires null body and raw bytes. `UNKNOWN` source collection
values remain explicitly unresolved. Completeness is bounded consistency of
caller-supplied retrieval metadata, not independently verified API coverage.

`body` contains the supplied parsed API JSON, or null when exact bytes supply it.
`raw_base64` is null unless actual bytes are supplied; it is never synthesized
from parsed JSON. If both exist, their parsed JSON content must agree.
Raw bytes and input JSON reject invalid UTF-8/JSON, duplicate decoded member names,
nonfinite/unsafe integer numbers, and nesting over 128. A 16 MiB parser limit is
checked after reading; this is not an adversarial-input memory isolation facility.
The exported pure function accepts plain JSON data, not active JavaScript objects.

## Observation and integrity semantics

Output is a bounded snapshot with missing, unknown, invalid and conflict issues.
`OBSERVED` means only no local consistency issue was found in supplied records.
It is not authenticity, real-world truth, source-set completeness, verification,
acceptance or authority. Conflicting observations remain represented with their
source pointers; there is no latest/first winner rule that clears a conflict.

The snapshot preserves separate base, head, explicit inspected and actual merge
identities, fork-head repository identity, parent relationships and PR commit-list
membership. Parent lists for the same inspected SHA must agree across responses.
It does not prove general graph ancestry, compare correctness, git object hashes,
or that an API commit is the actual commit inspected by an agent.

Changed-file observations retain upstream ordering and opaque names, rename origin
when present, additions/deletions and blob identity. Their domain is the PR's
base-to-head comparison, even when the inspected commit is an earlier commit or
the actual merge commit. This is not an inspected-commit diff or a worktree
inventory. Absent patches are marked; a supplied patch may still be truncated.
No file content is acquired and no completeness of actual code-change evidence
is inferred from the file count or blob SHA.

Check-runs and commit statuses remain separate. `EMPTY_OBSERVED_SET`,
`NOT_OBTAINED`, and `INCOMPLETE` are distinct. Check SHA/status URL must match the
inspected commit. An empty query result does not prove that no checks ever ran.
A recorded success/conclusion is an upstream observation, not verification passed
or an outcome correctness determination. Collection state describes retrieval,
and the top-level issue list additionally describes record conflicts/invalidity.

Capture times are explicit caller metadata in the source ledger. Event times
come only from PR/check/status fields with their original field meaning. Missing
event time stays null; invalid event time creates an UNKNOWN issue. Capture time
never substitutes for event time. No mtime, now(), or borrowed clock is used.

The source ledger includes byte length and SHA-256 of supplied actual response
bytes, with domain `SUPPLIED_ORIGINAL_RESPONSE_BYTES`. It excludes raw payloads
from output. Without supplied bytes, original-byte identity is `NOT_OBTAINED`.
Separately, parsed bodies have a deterministic sorted-object-key UTF-8 JSON digest
in domain `ADAPTER_SORTED_JSON_UTF8_V1_NOT_ORIGINAL_BYTES`. Arrays keep input order.
This is a local serialization convention, not Guard canonical bytes or RFC 8785.
Whitespace-different equal JSON produces different original-byte hashes and equal
normalized hashes. Neither digest authenticates the claimed GitHub origin.

## Verification and boundaries

Both Node syntax checks pass. The verifier runs 8 positive and 47 negative
synthetic cases, plus parser/encoding/number-limit, digest-domain and detached
output assertions. Each case checks repeatability and input immutability.
The single disk fixture explicitly uses four different commit SHAs and a fork.
Mutations create negative cases in memory; no negative response files are written.

Two independently spawned Node CLI processes read the same fixture. Output bytes,
stderr and exit status match. They run with Node permission mode allowing only
filesystem reads under this standalone directory, with no write permission.
Disabled, unsupported-option and input-read-error paths are also exercised.
The verifier hashes every file before/after the CLI runs and rereads the fixture;
the directory inventory and all input bytes remain unchanged. Source inspection
checks built-in-only imports and absence of network, writer or execution calls.
Network absence follows from implementation inspection, not a claimed Node network
sandbox feature. The verifier prints actual file byte lengths and SHA-256 values
to stdout on each run, including this document, without persisting a receipt.

No Guard regression suite was run: no product code is changed or imported.
No real PR #345 request was made or persisted. No real source custody is claimed.

Compatibility review: audit output/verdict/exit unchanged, deny exit 25 unchanged,
permit behavior unchanged, classify behavior unchanged. Recommendation-only,
additive-only, non-executing, default-off, no authority scope expansion. Core, EAK,
Canonical Producer, Harness, GovernanceReport, Permit, SDK/CLI contracts, released
v7.0.1, licensing, install/demo paths and frozen historical evidence are unchanged.
No control-plane, dashboard or orchestration behavior is introduced.

```text
EXISTING_CONTRACTS_REUSED=PARTIAL
IMPLEMENTATION_SCOPE=OFFLINE_GITHUB_PR_CHANGE_SOURCE_SNAPSHOT_V0_1
FILES_CREATED=4
SYNTHETIC_POSITIVE_TESTS=8_PASS
SYNTHETIC_NEGATIVE_TESTS=47_PASS
COMMIT_IDENTITY_CHECKS=PASS_BOUNDED_SOURCE_CONSISTENCY_ONLY
SOURCE_BYTE_INTEGRITY=PASS_SUPPLIED_SYNTHETIC_BYTES_ONLY
DETERMINISTIC_OUTPUT=PASS_TWO_INDEPENDENT_PROCESSES
INPUT_UNCHANGED=PASS
DEFAULT_READ_ONLY=PASS
PRODUCT_EXECUTED=NO
ACTUAL_SESSION_ACQUIRED=NO
CANONICAL_EVIDENCEPACK_CREATED=NO
G03_IMPLEMENTATION=FROZEN
T2_FORMAL_CLOSURE=BLOCKED
S04_FACTUAL_ADMISSION=UNRESOLVED
ASSURANCE_NOT_EVALUATED
GITHUB_CHANGE_SOURCE_ADAPTER_V0_1_OFFLINE_IMPLEMENTED
```

No commit, push, PR, merge, product invocation or producer start is authorized by
this completion. STOP pending Owner independent acceptance and a separate PR decision.
