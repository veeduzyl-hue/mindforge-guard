# MindForge Guard — M5 fixed P1 independent Gitleaks screening v0.1

**Authorisation:** 2026-11-20 UTC+08, Owner reviewed PR #385 and authorised continuing the recommended P0 track. **Fixed scanner branch parent:** PR #382 `f43862f93741a0e377358e820f2f45f8d92f8424`. **Exact screened source:** P1 `2a5365ea422b6dfb7f3d7bba81138e1e53862be1`, which is the source of the original M5 Windows offline kit. **NO PUBLIC RELEASE OR EXTERNAL HANDOFF AUTHORIZED**.

## 1. Independent detector, immutable dependency

The prior first-party PR #382 scan inspected 2,483 Git blobs in the fixed P1 ancestor graph and observed 7 `BEGIN PRIVATE KEY` delimiter-bearing blobs, with 1 in the current P1 tree, 6 only in ancestry and 0 complete long Base64 PEM blocks. This does NOT decide whether there are real credentials and is not a zero-secrets proof.

This experiment runs the **independently implemented open-source Gitleaks v8.30.1** engine (official `gitleaks/gitleaks` GitHub release `v8.30.1`, published March 2026) on two separate scopes: (a) only Git history reachable from the exact fixed P1 commit using Gitleaks' `git` mode / pinned `--log-opts <P1>`; (b) files extracted using `git archive <P1>` into a separate temporary directory scanned with Gitleaks' `dir` mode. The release archive `gitleaks_8.30.1_linux_x64.tar.gz` must have SHA-256 `551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb`. The binary/version is checked before use. No unpinned GitHub Action or `latest` tag downloads the scanner.

Official documentation: https://github.com/gitleaks/gitleaks — `git`, `dir`, `--redact=100`, `--report-format json`, `--report-path`, `--max-decode-depth` and `--max-archive-depth`. Source archive pinned digest is from the official GitHub release API asset metadata. The scanner is third-party **software**, not a separately retained professional auditor, attested signing service or certificate authority.

## 2. Secure handling of potential findings

- The workflow checks out the expected source branch into a GitHub-hosted Linux environment without user credentials, `persist-credentials:false`, `contents:read` only and NO Azure sign-in/secret tokens.
- Gitleaks uses a forced full redaction flag and writes both raw-format reports into newly created private CI temp files. Subprocess stdout/stderr are deliberately discarded; no raw matches, paths, line numbers, source code, Git author names, emails or report files are uploaded. A Node helper parses reports and emits only normalized RuleID category counts and total findings.
- The source tree extracted by `git archive` and any private scanning outputs are restricted to runner temp; CI cleans private reports via `finally`, and GitHub-hosted runner disposal handles checkout. No history rewrite, local Owner file deletion or original repository mutation occurs.
- Scanner network access is used **only for the official pinned executable download** at CI provisioning. Scans themselves operate locally. This does not prove network noninterference at the OS level.
- A tool execution error, bad checksum, wrong fixed SHA, malformed JSON or other scope problem is a hard `HOLD_INDEPENDENT_TOOL_OR_SCOPE_FAILURE` and nonzero exit. A finding is a separate `HOLD_INDEPENDENT_POTENTIAL_FINDINGS` and nonzero exit. Zero findings under configured rules still means `HOLD_DESPITE_ZERO_DETECTOR_FINDINGS_PENDING_OWNER_REVIEW`, because it cannot prove secret-free bytes.

## 3. Limits of negative/positive detection

Gitleaks and the default configuration cover recognized string rules, not every possible secret. Current code enables 1-level decoding and disables archive traversal; input files over 16 MiB are subject to a size skip that must be considered in adjudication. The first-party PR #382 had no blob over 16 MiB for this fixed P1 history and no Git LFS/submodules, but those results do not guarantee Gitleaks itself read every byte with the same semantics.

Also not demonstrated: whether each pattern match represents a real credential, account validity/expiry or revocation, secret encodings not supported by Gitleaks, Git objects unreachable from fixed P1, branches outside the bundled ancestry, legal/privacy permission to disclose one commit's author metadata, secure package signing, Windows native signing, First Report report content appropriateness and identity-verified human user consent.

## 4. Actual distribution gates

| M5 asset | Current disposition | Owner decision needed |
| --- | --- | --- |
| HTML-only report-reading kit | `OWNER_REVIEW_CANDIDATE` | Review synthetic report and independent tester information/consent; no Git history |
| Original full Git-history Windows bundle | `HOLD` | Independently classify scanner findings, verify license and historical metadata, controlled private recipient and no real data |
| Experimental one-commit shallow source PR #384 | `HOLD` | Still includes one commit's author metadata and complete current tree; no signed distributable produced |
| True Git-free current-tree snapshot | `NOT_IMPLEMENTED` | Versioned source identity redesign; separate source content audit and trust envelope |
| M5 genuine independent first-user | `NOT_TESTED` | One uncoached actual volunteer session with dated outcome and feedback |

## 5. Retained boundaries

```text
M5_INDEPENDENT_GITLEAKS_FIXED_P1=BOUNDED_PATTERN_SCAN
M5_WINDOWS_GIT_HISTORY_EXTERNAL_HANDOFF=HOLD
M5_INDEPENDENT_HUMAN_FIRST_USER=NOT_TESTED
M4_ORIGINAL_62=NOT_RUN
SIGNED_NATIVE_ADDON=DEFERRED_NOT_ESTABLISHED
I1_NATIVE_SECURE_BUNDLE=NOT_USED
OR_01_TO_05=UNCHANGED
T2_FORMAL_CLOSURE=BLOCKED
S04_FACTUAL_ADMISSION=UNRESOLVED
G03_IMPLEMENTATION=FROZEN
SEBBI=HOLD
NO_MAIN_MERGE
NO_RELEASE
NO_CUSTOMER_DATA
```

**STOP for Owner review of sanitized findings;** neither a scanner success status nor a zero-finding count authorizes source-history export to an uncoached first user.
