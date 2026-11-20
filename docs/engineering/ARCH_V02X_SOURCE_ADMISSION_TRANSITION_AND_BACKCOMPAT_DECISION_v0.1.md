# Architecture v0.2.x — Source Admission Transition & Backward Compatibility Decision v0.1

**Decision document, not an execution contract.** 2026-11-20 UTC+08. Owner authorized continuation after reviewing/authorizing PR #385. This is a DOCS-ONLY recommendation from **post-merge `main` at `6701f40fce4307118fca47176e81d6be7d05ef3e`**. No public CLI/Schema/Pack Parser change, main merge, release or customer-data admission is authorized by this document.

## 1. Grounding: separate proven behavior from intended source contract

PR #381 (fixed `6b4503478fe58636ca25a06d29ed741a3c9240be`), with 6 synthetic P0 support probes on Linux/Windows, observed two **legacy Pack Parser input-scope gaps**: accepting extra hidden/binary synthetic files and including their content in the deterministic Pack hash, and accepting/hashing an out-of-root synthetic symlink. These behaviors must not be misreported as validations of the future M3 Source Admission contract; original M4 62/62 still `NOT RUN`.

PR #383 (fixed `475d0705b581c7535dfe6fb4e5832b0e75432a51`) built a **separate default-off, synthetic-only** bounded allowlist and file-identity gate. Its `P0G-01..15` cases passed on hosted Linux/Windows Server 2022, including hidden/binary extras, outside-root file symlinks, directory junctions, hardlinks and caps. This is NOT wired to legacy Pack Parser or real-data `guard review` and does not certify cross-user/hostile real-time filesystem races.

Existing I1 Review Bundle Writer has distinct stricter allowlist/snapshot/NTFS staging constraints; its design cannot be treated as automatic authority to change the legacy parser. PR #385 is an unrelated CSS-only update already merged independently; it must not be co-mingled with the source-trust transition.

## 2. Compatibility decision options

| Option | Behavior | Risk and benefit | Recommended posture |
| --- | --- | --- | --- |
| A — silently harden legacy `guard pack validate` for every Pack | Reject extra, hidden, binary, symlink or unrecognized old inputs globally | Breaks historical Pack `valid_with_no_omissions`, deterministic hash, old attestations and old users without a version change | **REJECT for now** |
| B — versioned, explicit strict source admission; preserve legacy Pack path | Add a new user-selected source ingestion contract and strict capture scope. Leave legacy `--pack` validation/hash unchanged. Reuse only reviewed, correctly scoped source I/O/identity primitives | Keeps backward compatibility while enabling a narrow audit-friendly M3 path; adds two explicitly distinct semantics that must be documented | **PREFERRED CANDIDATE; Owner approval required before implementation** |
| C — retain legacy parser entirely for arbitrary new source imports | Minimal code, no new path | Leaves both observed root-confinement and unexpected-content digest issues exposed in future Source Onboarding | **REJECT for new real-data import** |

**Proposed Owner disposition**: `B: VERSIONED_OPT_IN_STRICT_SOURCE_ADMISSION_CANDIDATE`. This document does **not** record that Owner accepted the choice or authorize M2 public CLI, real data, a production Bundle, new Evidence Schema, Edition projection or signed Native distribution.

## 3. Proposed command and contract boundary (DESIGN-ONLY)

- Keep the currently admitted `guard pack validate --pack <path> --preview --json` and `guard report single-agent --pack <path> --preview --json` behavior, including the **legacy deterministic_pack_hash domain**, unchanged for existing users.
- Any future source ingestion must use an **explicitly versioned new route or flag**, such as an opt-in `guard review --source <explicit-selected-path> --source-contract strict-v0.1 ...`, **only if** the Owner separately approves its public API naming, exit taxonomy and Edition semantics. No background/current-working-directory scan, no default recursion, no implicit network/telemetry or secret collection.
- Strict selected source file roots must first be admitted by a policy-specific **Source Manifest / allowlist**, with full source file classification, total/individual byte caps, selected-root canonical containment and file-descriptor identity checking; reject ambiguous/unsupported types and any source whose identity changes during capture. Snapshot bytes privately before parsing; never feed a path-reopened mutable directory into validation under the guise of an immutable capture.
- **No silent normalization:** unreadable, unknown, skipped, binary, symlinked, junction or externally referenced inputs remain `unknown` or explicit refusal, not `valid_with_no_omissions`. `HOLD/NOT RUN` must not be converted into `PASS` by renderer wording, unsupported parser fallback or a generated zero-evidence report.
- Evidence source file SHA-256 = observed byte integrity only. It is **not a certificate**, publishing authority, producer provenance, independent signature, or human permission to use private employee records.
- Every source-locator map, redaction status, sensitivity, intended task, allowed/prohibited actions and identity/owner claim requires a separate human review protocol with clearly marked `NOT_VERIFIED`; an observed tool invocation cannot prove authority.
- A future strict source **canonical hash** must have a new version/domain identifier distinct from legacy Pack content hashes. Do NOT retroactively rewrite old Pack hashes. Include hash-domain/version in report/receipt metadata and test for cross-domain inequality without treating it as corruption.
- Reject input/output overlap, pre-existing output directory, symlink redirect at parent or intermediate component, hardlink aliasing, reparse-point/junction ambiguity, mutable file identity, raw secret/path diagnostic disclosure and partial staging failures **before** creating a final delivery.
- Windows production native staging/signing/ACL distribution still has separate P0 gates. An opt-in pure-JS source gate must not be marketed as I1 private NTFS Bundle assurance or signed Native Addon.

## 4. Backward-compatibility invariants and negative suite (NOT executed original M4 cases)

| Test ID proposed (new candidate) | Input | Expected | Evidence needed |
| --- | --- | --- | --- |
| `SRC-TX-01` | Fixed known legacy HR Pack | Existing Pack exit/status/hash unchanged byte-for-byte | Independent old/new same-source comparison |
| `SRC-TX-02` | Legacy Pack containing extra synthetic binary | Legacy behavior documented, but NEW strict mode rejects before capture | Separate old/new expected behavior; no false case upgrade |
| `SRC-TX-03` | Strict source with hidden `.env*` file | Reject/no hash/no raw export | No source read of excluded bytes, guarded log/receipt |
| `SRC-TX-04` | Strict source with out-of-root symlink | Reject before traversal and content hashing | Linux + Windows Server + ordinary Windows 11 client |
| `SRC-TX-05` | Junction/reparse parent/special/hardlink file | Reject; no source root escape or borrowed bytes | Stronger Windows ACL + identity observations, not only synthetic symlink |
| `SRC-TX-06` | Source changes between discovery/review and build | Stale snapshot / fail closed | Distinct content and file ID evidence |
| `SRC-TX-07` | Unsupported binary or unknown format | Explicit inventory-only/unknown or rejection according to Owner source policy; no silent semantic mapping | Source Kind + Loss/Unknown receipts |
| `SRC-TX-08` | No intent/owner/policy authority evidence | `NOT_VERIFIED` / `HOLD` | Human confirmation/identity not inferred |
| `SRC-TX-09` | Existing output, overlap, canceled write, crash | No final committed Bundle and no owner files touched | Independent Writer/cleanup/atomicity test |
| `SRC-TX-10` | Trial license/community/pro+ scopes | Community base facts retained and no incidental paid analysis | Explicit Edition approval and exit-code parity |

These `SRC-TX-*` IDs are **proposed new test cases**, not M4 original `REL/CLI/BND/LIC` IDs. The original M4 62 remain `NOT RUN` until their exact scenario and real approved runtime exist. CI pass on PR #383's fifteen synthetic probes is supporting evidence only.

## 5. Release / implementation gates

**Gate G1 — Contract Owner acceptance:** approve Option B (or a distinct option), public interface naming, explicit failure taxonomy and legacy hash backward compatibility; record OR-01..OR-05 closure criteria independently. `PENDING`.

**Gate G2 — Bounded exact-source engineering:** implement in a separate branch from a reverified main, keep new strict path default-off and source fixtures synthetic, avoid `main` merge and new license/schema writes. `NOT AUTHORIZED BY THIS DOC`.

**Gate G3 — Security/QA:** original M4 exact-case admission and verified tests; real Windows file-security/TOCTOU, source retention and transport, default-deny and no secret disclosure, no authority inference. `NOT RUN / HOLD`.

**Gate G4 — Human + commercial:** independent M5 human first-user, customer-specific admissibility and paid Edition projection. `NOT TESTED / NOT AUTHORIZED`.

**Gate G5 — Release:** explicit Owner acceptance + independent supply-chain/security/provenance gate + separate merge/release approvals. `NOT AUTHORIZED`.

## 6. Disposition

```text
SOURCE_ADMISSION_COMPAT_STRATEGY=PREFERRED_OPTION_B_PENDING_OWNER_DECISION
LEGACY_PACK_PARSER_BEHAVIOR=UNCHANGED
LEGACY_INPUT_TRUST_GAPS=OPEN
PR383_SYNTHETIC_GATE=VERIFIED_BOUNDED_NON_PRODUCT
M4_ORIGINAL_62=NOT_RUN
M5_REAL_INDEPENDENT_FIRST_USER=NOT_TESTED
M5_WINDOWS_FULL_SOURCE_DISTRIBUTION=HOLD
SIGNED_NATIVE_ADDON=DEFERRED
OWNER_GENERAL_REAL_DATA_SOURCE_ADMISSION=NOT_AUTHORIZED
NO_MAIN_MERGE
NO_RELEASE
NO_CUSTOMER_DATA
```

**STOP for Owner review of the contract.** No new production code, public `--source` flag, canonical Schema/API or Pack hash migration is implemented by this document.
