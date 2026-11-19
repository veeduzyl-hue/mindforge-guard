# MindForge Guard Architecture v0.2.x — First Report Synthetic User Path v0.1

**Purpose:** create one **real, locally runnable teaching workflow** from the separately verified M3 stages — source SELECT/INVENTORY, DISCOVER/DRAFT, REVIEW/CONFIRM → **fixed synthetic template BUILD** → Guard native Pack Validate → native Single-Agent Report Preview → English HTML renderer → checksummed **synthetic demo delivery folder**. This is not the full real-data M3 workflow, not a production I-1 Review Bundle and not commercially released.

**Fixed parent:** PR #376 `ce1a235aeccebc5df9be7609ac20bc9ed3e059ac`. **Authorization:** Owner-directed bounded engineering only, no main merge, release, signed native addon, customer Evidence or verified organizational authority. All commands below work ONLY on the exact committed **synthetic HR sample**; no arbitrary source files are accepted.

## 1. What is actually integrated

1. PREPARE creates a **new, uniquely named direct child of the system TEMP directory** and copies exactly the **11 files** of the previously committed fixed synthetic HR sample, including the two evidence files, into a private teaching subfolder (no real input). Creates both existing synthetic marker files and explicit per-file source SHA-256 manifest.
2. PREPARE invokes the unchanged fixed M3 REVIEW script, which reuses Inventory/Discover/Draft. It writes `mapping-review.synthetic.json` for inspection and an **all-deferred by default** `mapping-decisions.synthetic.json` for deliberate editing. `START_HERE.txt` explains the path. At this stage **nothing is confirmed or built**.
3. The **user manually inspects only this synthetic fixture**: each mapping has a target and source locator. If they choose, they edit every `decision` from `defer` to `confirm` and each matching `basis` from `not_confirmed` to `source_reviewed`. The tool never manufactures a human confirmation or infers that a real actor or authority exists. Any omitted, rejected or deferred item prevents this specific 8-field demo from proceeding; the M3 Confirm stage itself supports all three decisions and retains distinct semantics.
4. COMPLETE rechecks the exact prepared source SHA per file, the live review fingerprint and fresh M3 Confirmation Record; requires **eight explicit synthetic mapping selections**, validates key/line source locators and that the source SHA matches the expected fixed target file. Business owner, tool permissions, task intent, policy and sensitivity remain **unverified declarations in the pre-existing synthetic teaching sample** — not evidence of real authorization.
5. COMPLETE constructs a new **copy of the known complete synthetic First Report Pack** under a staging directory. This is a *fixed-fixture clone after structural value binding checks*, **not a general source-value transformer** or automatic Pack builder for arbitrary customer input. It runs the actual existing `guard pack validate --preview --json`, `guard report single-agent --preview --json` and `guard report render --format html` commands and verifies valid-with-no-omissions, ready-for-review and identical deterministic pack hashes.
6. COMPLETE writes validation, report JSON and `report.html`, the non-authoritative synthetic Confirmation Record, a readable safety note and an SHA-256 checksum index over bounded output files; it renames the new staging directory to `delivery` only after all checks. It does **not** use, bypass or claim equivalence with the production I-1 trusted-native Bundle Writer. It explicitly states `SYNTHETIC_DEMO_NOT_I1_SECURE_REVIEW_BUNDLE` and records `WINDOWS_OUTPUT_ACL_NOT_VERIFIED_FOR_REAL_DATA`.

## 2. Windows 11/10 x64 usage for a first-time tester (synthetic-only)

Requirements: Node 24 x64, Git, a reviewed **clean exact-SHA checkout** of this experimental PR, Windows PowerShell 5.1 or pwsh, and **no code signing service or native `.node` Addon**. No npm package release or customer data. Work in an ordinary non-admin window. The scripts are standalone repository test tools, NOT installed public `guard review --source` features.

Open Windows PowerShell in the fixed source checkout, then:

```powershell
# Exact new checkout is recommended; do not use a previous recovery worktree.
git status --porcelain
git rev-parse HEAD
$env:ARCH_V02X_FIRST_REPORT_DEMO_SYNTHETIC_ONLY = '1'
$demo = Join-Path $env:TEMP ('guard-v02x-synthetic-' + [guid]::NewGuid().ToString('N'))
node .\scripts\arch_v02x_m3_first_report_walkthrough_synthetic.mjs --mode prepare --workspace $demo
notepad (Join-Path $demo 'START_HERE.txt')
notepad (Join-Path $demo 'mapping-review.synthetic.json')
notepad (Join-Path $demo 'mapping-decisions.synthetic.json')
```

Use Notepad or your preferred local text editor. The **eight initial decisions are all `defer`**, so `complete` MUST refuse until every mapping is explicitly marked `confirm` with `basis=source_reviewed`, after inspecting the synthetic source files in `synthetic-input-pack`. It is permitted to leave them deferred; that is a **valid stop**, not a failing real user. Do not edit the `source_digest_set_sha256`, `draft_fingerprint_sha256`, mapping IDs, review baseline or original source content. Do not use search-and-replace across other files.

After deliberately editing the synthetic decision file, run:

```powershell
node .\scripts\arch_v02x_m3_first_report_walkthrough_synthetic.mjs --mode complete --workspace $demo
node .\scripts\arch_v02x_m3_first_report_walkthrough_synthetic.mjs --mode status --workspace $demo
Invoke-Item (Join-Path $demo 'delivery\report.html')
```

The local `delivery` folder contains `report.html`, `single-agent-report.json`, `pack-validation.json`, `synthetic-first-report-pack` (11 example files), `synthetic-mapping-review.json`, `synthetic-confirmation.json`, `DELIVERY-READ-ME.txt`, `demo-delivery-manifest.json`, and `demo-checksums.json`. The checksum index excludes itself and is not independently signed. The supplied test script verifies every indexed artifact SHA-256.

**No automatic deletion.** The sample stays in the newly created TEMP directory for inspection; clean up manually only after confirming it is disposable synthetic data. If COMPLETE fails after staging, inspect the `.partial-synthetic-delivery-*` directory and DO NOT infer that a complete delivery exists. Do not upload the directory to a customer, and do not test with sensitive sources or credentials.

## 3. Linux usage

```bash
export ARCH_V02X_FIRST_REPORT_DEMO_SYNTHETIC_ONLY=1
demo="$(mktemp -u "${TMPDIR:-/tmp}/guard-v02x-synthetic-XXXXXXXXXX")"
node scripts/arch_v02x_m3_first_report_walkthrough_synthetic.mjs --mode prepare --workspace "$demo"
# Open $demo/START_HERE.txt, review the fixed example and edit decision JSON.
node scripts/arch_v02x_m3_first_report_walkthrough_synthetic.mjs --mode complete --workspace "$demo"
# Open "$demo/delivery/report.html".
```

Use the CI test suite instead if your Linux TMPDIR contains symlinked directories or you cannot ensure a safe new root. The displayed `mktemp -u` creates only a proposed unique name; creation collision is refused by the actual PREPARE command, and concurrent adversarial path substitution is not fully hardened in v0.1.

## 4. Contract and security gates

| Gate | Result that can be claimed | Still NOT established |
| --- | --- | --- |
| Fixed synthetic 11-file Pack clone | True native validation and Single-Agent Preview can complete on synthetic data | Automatic build of arbitrary client evidence from individual mappings |
| Review choice input | Every candidate is explicitly selected, Source Inventory hash and review fingerprint rechecked | A live human actually read it; identity, corporate delegation or authorization |
| Derived HTML/report | Existing Guard renderer and Pack/Report deterministic hash parity | Independent Assurance, governance verdict, customer-facing certification |
| Delivery folder | Synthetic-only files and local SHA-256 index under freshly created TEMP-owned folder | I-1 native secured Bundle, private NTFS DACL for real data, signed application distribution, crash-safe NOREPLACE under hostile concurrency |
| CI testing | Separate new `M3FLOW-*` bounded cases and previous M3 regressions on Linux and Windows hosted runners | Original M4 62 tests; M5 real independent user session or actual customer data |

The full M3 9-stage contract is NOT yet implemented as a general product. No source-redaction management, credential/secret scanner guarantee, full YAML semantic parser, arbitrary product template field-level consent, cross-contract converter, License/Edition projection or independent receipt-custody protection exists. Synthetic template authority/control fields are only pre-existing sample declarations; no backend/user can upgrade them by this demo.

## 5. Owner acceptance and future external-user criteria

An Owner can evaluate whether the whole demonstration is understandable using its HTML report and safe tutorial. To offer it to an **external first-time usability tester**, first review the exact source and the generated local demo deliverables, then supply a controlled, easy-to-launch package with explicit access boundaries. The tester should not need to handle actual corporate evidence or install a native module. A true **M5 Human First-User** requires a real uncoached session and separately recorded feedback; running these automated tests cannot substitute for it.

Stop: Draft PR only. `NO MAIN MERGE`, `NO RELEASE`, `NO CUSTOMER DATA`, `NO_SIGNED_ADDON`, original M4 `NOT RUN`, M5 `NOT TESTED`, OR-01..05, T2/S04/G03/Sebbi states unchanged.
