# MindForge Guard M5 — Exact-P1 one-commit shallow offline source candidate v0.1

**Owner:** Internal Engineering Convergence follow-on, 2026-11-20 UTC+08. **Parent:** PR #382 HEAD `f43862f93741a0e377358e820f2f45f8d92f8424`. **Exact M5 P1 test program source:** `2a5365ea422b6dfb7f3d7bba81138e1e53862be1`. Status: **RESEARCH / SYNTHETIC-CI ONLY / NO EXTERNAL DISTRIBUTION AUTHORIZED**.

## Why a Git-free tarball is not yet a drop-in replacement

The existing fixed PR #377 demo calls `git rev-parse HEAD` to bind its exact source identity. A plain `git archive` / ZIP without `.git` does not provide that identity and the current demo fails closed. Creating a *different* synthetic commit would produce a different SHA and cannot claim the original fixed P1 source HEAD. Do not spoof Git identity with a shell/PowerShell alias or fake `git` executable.

A **one-commit shallow Git working checkout** provides an interim honest reduction: retain the exact Git commit object `2a5365ea...`, its current tree and all required bytes, but not the 1,249 ancestor commit objects. This is **not strictly a no-Git-history archive** because the one commit's author/date/parent ID and the current source tree are still included; its complete ancestral object history is omitted. Do not call it `NO_GIT_HISTORY` or imply that commit author metadata is sanitized.

## Exact code-level design

- A hosted Linux/Windows synthetic test reads a normal immutable PR head from the existing public repository, locally creates a fresh repository using `git init`, then locally `git fetch --no-tags --depth=1 <LOCAL_REPO_PATH> 2a5365ea...` and `git checkout --detach` that exact SHA.
- The test removes `.git/FETCH_HEAD` because it contains the CI host's local repo path. It then requires HEAD equal the approved P1 commit, `git rev-list --count HEAD=1`, `git rev-parse --is-shallow-repository=true`, empty `git remote`, no alternates, clean `git status --porcelain`, no reachable ancestor object, and successful `git fsck --full --no-reflogs`.
- Only after those trust-identity checks does the candidate execute the entire **fixed synthetic** demo `prepare`, CI-only automated eight decision choices, `complete`, native Pack validation/Report, and independent local readback of 17 checksums plus Pack/Report matching hash. The CI generated choices are **not human consent/review**.
- The test removes only its owned newly created synthetic TEMP directories. It does not transmit the shallow checkout, create a public ZIP artifact, overwrite external data, call GitHub remotely, install Native Addon, use customer inputs or sign any binary.

## Security limitations that keep external Track B HOLD

1. PR #382's original fixed-P1 history scan identified **7 literal private-key BEGIN marker-bearing blobs**, of which **1 exists in the current P1 tree** and **6 exist only in ancestry**; none was a complete long Base64 PEM block under its limited parser. A shallow snapshot avoids the six ancestor-only objects, **but still contains the one current-tree marker and potentially other unrecognized sensitive content**. No actual private credential has been confirmed, and no independent secret-free clearance is available.
2. Git's single preserved commit includes an author identity/email/date and the parent SHA metadata; the shallow checkout need not contain the parent's object, but this is NOT proof of zero personal metadata. Owner must authorize the legal/privacy disclosure of even the one commit.
3. All current P1 tree source/license files remain unless a separate allowlist-based history-free derived snapshot is created and its identity/compatibility rules are explicitly authorized. The one-commit approach is an **interim delivery architecture** only.
4. GitHub Actions testing the shallow checkout on Windows Server 2022 is not an independent Windows 10/11 x64 user trial or product release qualification.
5. Neither a successful shallow checkout nor 17 correct SHA-256 checks grants business authority, code-signing identity, independent Assurance or customer-data ingestion.

## Future choices, to be separately authorized

- **Default:** prioritize existing HTML-only reading Track A (no repository/history) for first uncoached comprehension study, subject to review of its synthetic report content.
- **Full Windows Track B:** prefer a history-free curated source snapshot as a future dedicated implementation if source-identity semantics and user trust policy are redesigned; else a single-commit shallow checkout can be reviewed after independent scanner, P1 current-tree classification, legal author metadata and installer safety gates.
- Source hashes and fixed HEAD must be supplied in a separately reviewed, tamper-evident distribution manifest. A SHA-256 alone does NOT authenticate the publisher.
- No developer/Owner may automatically mark `M5_FULL_WORKFLOW_BOUNDED_USER_VALIDATION_ACCEPTED` merely because CI can synthesize all eight choices.

```text
M5_ONE_COMMIT_SHALLOW_SOURCE=EXPERIMENTAL_PREVIEW_ONLY
M5_P1_FIXED_HEAD=2a5365ea422b6dfb7f3d7bba81138e1e53862be1
FULL_ANCESTOR_HISTORY_IN_CANDIDATE=EXCLUDED_IF_TEST_PASSES
CURRENT_COMMIT_AUTHOR_METADATA=STILL_PRESENT
CURRENT_TREE_SENSITIVE_PATTERN_REVIEW=NOT_COMPLETE
EXTERNAL_WINDOWS_FULL_KIT_DISTRIBUTION=HOLD
M5_HUMAN_FIRST_USER=NOT_TESTED
M4_ORIGINAL_62=NOT_RUN
NO_MAIN_MERGE
NO_RELEASE
NO_CUSTOMER_DATA
```

**STOP:** No actual full source ZIP or Git bundle external upload is authorized in this experiment; receipt-only verification until Owner approves a specific distribution design and exact source audit.
