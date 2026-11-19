# MindForge Guard — First Report P1 Readability Improvement and M5 Admission Note v0.1

**Owner authorization:** 2026-11-20 UTC+08, readability before independent first-time-user M5. **Fixed parent:** PR #377 `b45c8f4b38a3cfe73787657421486f6a7d413cc1`.
**Scope:** presentation CSS only, isolated Draft PR, no main merge, no npm release, no authority/schema/licensing/canonical Pack or signing changes.

## 1. Observed P1 problem

Owner-provided Windows client screenshots of the fixed synthetic HR First Report showed visually small/pale labels, fine print and source links on white; screenshot evaluation is qualitative, not measured browser accessibility. Three role tabs appeared as choices, but actual keyboard behavior and real first-user comprehension were not yet independently tested. The source report was ready_for_review, not approved.

## 2. Bounded implementation

- Retain all original HTML content, three reader sections, radio controls, CSP, offline rendering, original JSON, escaped source-value output, report source/byte digests, and non-enforcement semantics exactly.
- Add CSS-only P1 overrides to `packages/guard/src/presentation/role_based_html_report.mjs`: increase primary copy to 16px, card body to 15.5px, source-path and hash captions to >=13px, role selectors to 15px, footer to 13.5px; strengthen text and link contrast on white; underline real source anchors; provide a visible focus ring on radio control labels; retain mobile/print styles and reduce-motion behavior.
- Visual contrast checks use the W3C WCAG 2.2 1.4.3 static target of 4.5:1 for normal text, and 2.4.7 focus-visible principle. References: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum and https://www.w3.org/WAI/WCAG22/Understanding/focus-visible . Static color pairs and CSS selectors are **not** a claim of full WCAG compliance in computed browser UI.
- Do not alter the HTML template, translated text, role content, report validation, governance claims, underlying data, code paths, auth/login, input source interpretation, Markdown descriptions or HTML source byte digest.

## 3. Verification plan

1. Existing `scripts/verify_v7_role_based_report_render.mjs`: deterministic render, CSP, HTML escaping, non-enforcement field rejection, unknown/invalid contract refusal, no overwrite and malformed input failure.
2. New `scripts/verify_arch_v02x_first_report_p1_legibility.mjs`: frozen parent renderer vs P1 renderer, compare **every non-style HTML byte** after removing the style element from both, validate all original CSS remains and new rules are only appended, inspect explicit text/background pairs for >=4.5:1, ensure reader focus rules exist, underlined source links and responsive/print reduced-motion rules.
3. Re-run existing M3 Inventory/Discover/Review and full synthetic First Report demo. It must retain exact Pack/Report hash and create HTML without activating the unsigned Native Addon; no change to M4 original 62 cases.
4. Linux and Windows Server 2022 x64 CI are **engineering tests**, not Windows 11 consumer desktop visual/keyboard/screen-reader attestation. Actual view test with 100%/200% zoom and three role buttons is reserved for M5 preflight and real external user.

## 4. Acceptance matrix

| Gate | Required state | Nonclaim |
| --- | --- | --- |
| Non-style HTML parity | exact byte equality after CSS removal | Does not verify rendered layout |
| Color ratios for fixed palette | eleven explicit color pairs >=4.5:1 | Not proof of all computed CSS state combinations |
| Source links and keyboard focus rules | static selectors and anchor target present | Not witnessed browser tabbing or keyboard-only test |
| Guard content and authority | identical field rendering / report input hash / non-execution | No new approval or independent assurance |
| M3 synthetic user journey | 16/16 + predecessors in CI | Not real arbitrary customer Evidence / secure I1 native Bundle |
| M5 independent real user | PENDING until actual tester executes and receipt reviewed | Owner's own Windows run is not an independent first-user session |

## 5. M5 next step

After the P1 fixed-HEAD CI passes, issue a separate **offline synthetic-only first-user research kit** with uncoached tasks, report comprehension questions, no personal/enterprise data, neutral observer instructions, task timing/failure measures, actual session receipt fields and separation of report-reading-only vs full technical workflow tasks. Real M5 remains `NOT_TESTED` until at least one genuine uncoached external participant produces a dated, source-linked session outcome. Synthetic/CI behavior must never be relabeled as human findings.

## 6. Preserved governance

```text
FIRST_REPORT_P1_LEGIBILITY=EXPERIMENT_CANDIDATE
ORIGINAL_REPORT_JSON_AND_GOVERNANCE_SEMANTICS=UNCHANGED
M3_FIXED_SYNTHETIC_USER_PATH=PR377_BOUNDED_ONLY
M4_ORIGINAL_62=NOT_RUN
M5_INDEPENDENT_FIRST_USER=NOT_TESTED
SIGNED_NATIVE_ADDON=DEFERRED_NOT_ESTABLISHED
I1_SECURE_NATIVE_BUNDLE=NOT_USED
OR_01_TO_05=UNCHANGED
T2_FORMAL_CLOSURE=BLOCKED
S04_FACTUAL_ADMISSION=UNRESOLVED
G03_IMPLEMENTATION=FROZEN
SEBBI=HOLD
OWNER_FINAL_ACCEPTANCE=PENDING
NO_MAIN_MERGE
NO_RELEASE
NO_CUSTOMER_DATA
```

**Stop boundary:** A green CSS CI is not an accessibility certificate, external product validation or a merge/release authorization.
