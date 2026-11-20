# Architecture v0.2.x — M4 v0.1.1 P0 Case Applicability & Supporting Probe Receipt v0.1

**Source:** original `MindForge_Guard_M4_Joint_Compatibility_Negative_Test_Matrix_v0.1.1.docx` dated 2026-11-06, sections 5–9. **Owner instruction:** Internal Engineering Convergence Sprint v0.1, 2026-11-20. **Fixed parent:** PR #379 `2e38044ecb65f4e026f9ffa7441a428277c3f985`. The 62 original case IDs and their original `NOT RUN` statuses remain unchanged until exact scenario execution is qualified and performed. This file is NOT an amendment to the accepted M4 source.

## 1. What is testable today, and what is not

Original M4 expects the FUTURE M2 unified command and M3 SOURCE-to-PACK/Bundle delivery behavior. The actual PR #379 branch contains standalone **synthetic-only** Source Inventory / Discover / Review / Fixed HR demo, plus I1 existing Pack Review experiment, but does not expose the new admitted `guard review --source ...` route. The fact that a different scope/component handles a negative case does **not** close the original M4 acceptance case.

| Original M4 ID | Exact original scenario / expected result (source terminology) | Current executable representative | Original M4 runtime disposition |
| --- | --- | --- | --- |
| `REL-05` | Binary / hidden / unrelated files in canonical Pack → Reject or external-reference; no hidden/raw copying/hashing into Pack | Existing `guard pack validate --pack`, synthetic injected file; separately M3 inventory rejects/excludes | **NOT RUN**: future onboarding/Pack admission behavior differs from existing Pack parser |
| `REL-06` | Symlink escape from Pack root → onboarding rejects resolved paths outside selected root | Current canonical Pack parser with synthetic outside symlink; M3 marked-root importer is different | **NOT RUN**: unified importer absent |
| `BND-01` | Raw restricted source not explicitly copied → Bundle includes references only | M3 standalone Inventory source copy/metadata test; I1 Pack Writer separate | **NOT RUN**: signed-off M3 Bundle delivery not available |
| `BND-02` | Absolute host paths/secrets diagnostic → do not export path map, environment or secrets by default | M3 Inventory stdout under synthetic secret-like fixture | **NOT RUN**: full Bundle and diagnostics not implemented as in M4 |
| `BND-03` | Bundle atomic finalization → staging + atomic rename, not direct write helper | Fixed synthetic demo stops before final folder on incomplete decisions | **NOT RUN**: not equivalent to actual secure I1 Bundle atomicity/hostile concurrency |
| `BND-05` | Partial component failure → preserve successes, mark failed/skipped with reason and no overall success | Synthetic PREPARE→COMPLETE failed on all-defer; no final demo | **NOT RUN**: native multi-component Bundle orchestration absent |
| `BND-07` | Symlink/path traversal and input/output overlap → reject escapes | M3 Inventory off-marked-root refusal and legacy Pack symlink probe | **NOT RUN**: unified mode not present, output overlap unverified |
| `CLI-09` | Existing output directory → reject before source mutation, no overwrite or `--force` | Existing experimental `guard review --pack ... --out ...`, creates no overwrite | **NOT RUN**: new M2 Source route does not exist |
| `LIC-01` | Community base `guard review` must not be paywalled because of unified command | Existing License Gate, not future unified M2 route | **NOT RUN**: requires Owner-approved scoped Edition behavior in future command |
| `LIC-02` | Community Timeline → native `license_required`, exit 21 | Existing Timeline License Gate route available, but not unified opt-in projection | **NOT RUN**: not silently substituted |
| `LIC-03` | Pro Compare → edition_mismatch/pro_plus, exit 21 | Existing Compare License Gate route, not proposed M2 | **NOT RUN** |
| `LIC-04` | Pro+ explicit selected Analytics only; no auto-run all paid analytics | Existing components, not unified orchestrator | **NOT RUN** |

These are priority applicability decisions, **not twelve individually run original acceptance tests**. The original schema/Harness/EAK/Analytics/Vendor-Signal case families not included in this narrow P0 group remain `NOT RUN` without further claims. Source M4 counts: `REL=6`, `SCH=5`, `HNS=5`, `EAK=6`, `LIC=7`, `CLI=12`, `BND=7`, `ANA=5`, `VS=9`, **TOTAL=62**.

## 2. Six separate supporting engineering probes (`M4P0-SUPPORT-*`)

Standalone `scripts/arch_v02x_m4_p0_supporting_boundary_probe.mjs` executes only synthetic temp fixtures on Linux/Windows CI and emits a **sanitized JSON receipt**. It does not modify Guard runtime. These IDs must NEVER be renamed into original M4 REL/BND/CLI case IDs:

1. `M4P0-SUPPORT-01` — compare native Pack Validate baseline against synthetic extra hidden `.env.synthetic` and opaque binary. Classify as `GAP_OBSERVED_IN_CURRENT_INTERFACE` if unrelated extra content is accepted as valid or if a synthetic secret marker is exported; do not print raw source.
2. `M4P0-SUPPORT-02` — construct an outside-root synthetic symlink in existing Pack; determine whether native parser accepts and hashes outside content. On Windows without symlink privilege, `NOT_TESTED` rather than false PASS.
3. `M4P0-SUPPORT-03` — use existing I1 `guard review --pack --out` to check collision exit and existing bytes preservation.
4. `M4P0-SUPPORT-04` — marked-root M3 Inventory excludes synthetic secret-like files and does not export full path/raw secret.
5. `M4P0-SUPPORT-05` — fixed synthetic HR demo intentionally all-defer; verify no final `delivery` is created and no false overall success.
6. `M4P0-SUPPORT-06` — M3 standalone Source Inventory refuses selection outside its marked fixture root.

Possible observed result values: `ENFORCED_BOUNDED_CURRENT_INTERFACE` (only the current standalone/legacy route), `GAP_OBSERVED_IN_CURRENT_INTERFACE`, `NOT_TESTED` or `PROBE_EXECUTION_ERROR`. **CI SUCCESS means the diagnostic harness ran; if a gap is observed the PRODUCT/M4 admission gate remains HOLD.** The probe deliberately does not assume the existing legacy Pack parser implements future M3 data-minimization rules. Findings are evidence of a compatibility/design gap, not license to ingest real secrets.

## 3. Exit conditions for promotion of any original M4 test

Before changing *any* of the 62 `NOT RUN` cells, record exact case contract/expected behavior, the correctly scoped executable and version, selected data/control/Edition, actual environment, isolation and identity, valid/negative fixture, dry-run vs runtime authorization, raw/sanitized machine receipt and independent QA/Owner review. If the required future M2 unified CLI or M3 security-grade Bundle does not exist, status remains NOT RUN even if a supporting representative passes. Record a separate `GAP` if current legacy behavior contradicts desired future contract.

OR-01 Audit writes, OR-02 time cut, OR-03 Edition parity, OR-04 Bundle sensitive-data custody, OR-05 native exit taxonomy **all remain OPEN for runtime closure**. Accepted OD design directions do not close them. Historical `T2_FORMAL_CLOSURE=BLOCKED`, `S04_FACTUAL_ADMISSION=UNRESOLVED`, `G03_IMPLEMENTATION=FROZEN`, Sebbi HOLD, M5 human `NOT TESTED`, signing deferred and product release HOLD are unchanged.

## 4. Nonclaims and stop

```text
M4_ORIGINAL_62=NOT_RUN
M4_P0_SUPPORTING_PROBES=SEPARATE_NON_EQUIVALENT_IDS
FUTURE_M2_UNIFIED_SOURCE_CLI=NOT_IMPLEMENTED
FUTURE_M3_REAL_DATA_BUNDLE=NOT_ADMITTED
OR_01_TO_05=UNCHANGED_OPEN
M5_INDEPENDENT_FIRST_USER=NOT_TESTED
SECURE_NATIVE_SIGNED_ADDON=DEFERRED_NOT_ESTABLISHED
NO_MAIN_MERGE
NO_RELEASE
NO_CUSTOMER_DATA
```

Do not suppress discovered shortcomings, rewrite an existing M4 identifier as PASS, copy secrets to a public artifact or treat this diagnostic PR as authority to patch/release production components.
