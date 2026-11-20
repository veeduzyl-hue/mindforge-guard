# MindForge Guard M5 — Offline Kit Git-History & Private Distribution Security Preflight v0.1

**Owner authorized:** Internal Engineering Convergence Sprint Track C, 2026-11-20 UTC+08. **Fixed engineering parent:** PR #379 `2e38044ecb65f4e026f9ffa7441a428277c3f985`. **Actual Windows kit historical source:** fixed P1 candidate `2a5365ea422b6dfb7f3d7bba81138e1e53862be1`. **Current release posture:** Draft/experiment, M5 human NOT TESTED, no customer data or public product release.

## 1. Distribution choices and threat model

**Track A / HTML reading-only** should be first offered privately after Owner reviews report content, embedded original JSON, P1 identity/limits and participant consent. It contains no Git history, requires no Git/Node, but still is a synthetic HR policy example and contains input-derived narratives and simulated identifiers.

**Track B / Windows full user workflow** includes an offline `git bundle` with **reachable repository commit history**, not just the final working tree. Before any external handoff it requires two independent gates: (i) history secret screening of the exact fixed P1 bundle source, and (ii) Owner/manual distribution boundary review of package bytes/metadata, third-party identity, license, end-user safety and retention. Screening with a custom regex tool is *not* a comprehensive secret audit or actual credential revocation.

Likely failure modes: accidentally tracked old `.env`/private keys in historical blobs despite a clean current tree; current known `.env.example` and `.pem` basename false positives; Git author/email history visibility; unsigned binary or installer distribution; confusing demo report with verified Assurance; unbounded native modules in kit; hidden local endpoints or data copied to external service; unintended exposure of training fixture records. A clean GitHub repository is not proof of zero historic secrets.

## 2. Fixed-commit history screening tool

`scripts/arch_v02x_m5_fixed_git_history_screen.mjs` reads **every object reachable from the fixed P1 SHA**, not any guessed branch name, using `git rev-list --objects <P1>`, `git cat-file --batch-check` and bounded `git cat-file --batch`. It scans blob bytes using a limited high-confidence pattern collection for PEM private keys, major provider tokens and known public prefixes. It never prints raw blob bytes, token matches, source paths, personal Git emails or commit messages.

Resource ceilings (16 MiB/blob, 200 MiB total, 40,000 objects) are **coverage conditions**, not silent skipping: exceeding any yields `HOLD_INCOMPLETE_COVERAGE`, not PASS. Unresolved Git LFS pointers and submodules also force HOLD because the offline source bundle cannot prove those external bytes. The scanner does not cover unreachable git objects, unbundled other refs, unknown/encoded/split tokens, UTF-16 binaries, encrypted payload, external services or credential revocation. `SCREENED_NO_HIGH_CONFIDENCE_PATTERN_WITH_LIMITATIONS` is **not** `SECRET_FREE` or `PUBLIC_RELEASE_APPROVED`.

The scanner produces a sanitized machine receipt with source SHA, commit/blob counts, scan coverage, category/count of potential findings only, and full limitations. High-confidence matches or incomplete coverage fail closed and require a private Owner/investigator review. Sensitive matched bytes and paths are not attached to CI artifacts.

## 3. Additional Owner-only release preflight

| Stage | Required check | Current acceptance state |
| --- | --- | --- |
| C1 | fixed P1 identity (source `2a5365ea...`) + original M5 package index SHA and file count readback | Prior kit build PASS_BOUNDED, requires renewed source/digest readback for actual invitation |
| C2 | all reachable commit blobs screened and coverage measured | This PR performs limited pattern screening only |
| C3 | independent established secret scanner (e.g. organization-approved gitleaks/trufflehog), historical false-positive adjudication and leaked credential rotation if found | NOT PERFORMED by custom scanner |
| C4 | company approval of disclosed Git author metadata / license / historical commits for participant | OWNER_REVIEW_REQUIRED |
| C5 | demonstration bundle contains no unsigned native `.node`, PFX, scripts with implicit cloud/proxy auth or out-of-scope real data | Prior package builder checked current tree and file types; independent full distribution review required |
| C6 | non-admin ordinary-user synthetic instructions, no upload/network, clean exit and safe retention/cleanup language | Existing M5 guide in PR #379, bounded; uncoached human test still pending |
| C7 | recipient identity/consent, least data/retention, approved private handoff | NOT OBTAINED |
| C8 | main merge, public release, real-data authority | NOT AUTHORIZED |

**Do not send the full Track B Git bundle publicly or claim `FULL_HISTORY_SECRET_AUDIT_PASS` based only on this scoped scan**. If C2 finds a potential credential category, require private investigation of actual bytes, containment/rotation if necessary, and reissue of the package from a separately approved source. Do not post findings/secret values into public PR comments.

## 4. Isolation and privacy

CI invokes this tool on GitHub-hosted Linux and Windows with exact fixed main parent and no secrets or Azure credentials. It makes no network calls, creates no credentials, installs no native addons and only uploads sanitized counts/receipt. A red CI caused by a discovered candidate secret or incomplete scan means **the distribution safety gate failed/was held**, not that the product CLI failed.

Do not modify Git history, force-push, delete old artifacts, drop Git refs or revoke keys from this workflow without a separately reviewed incident and preservation plan. This read-only scan does not change M4 62, OR-01..05, T2, S04, G03, Sebbi or signed-native work.

## 5. Concrete disposition

```text
M5_READING_ONLY_PRIVATE_CANDIDATE=OWNER_REVIEW_REQUIRED
M5_WINDOWS_FULL_GIT_HISTORY_DISTRIBUTION=HOLD_UNTIL_ACCEPTED
FIXED_P1_SOURCE_HEAD=2a5365ea422b6dfb7f3d7bba81138e1e53862be1
SECRET_PATTERN_SCAN=SCOPED_NOT_FULL_SECRET_AUDIT
INDEPENDENT_SECRET_SCANNER=NOT_RUN
M5_REAL_HUMAN_FIRST_USER=NOT_TESTED
M4_ORIGINAL_62=NOT_RUN
SIGNED_ADDON=DEFERRED
NO_PUBLIC_DISTRIBUTION
NO_MAIN_MERGE
NO_RELEASE
NO_CUSTOMER_DATA
```

**Stop:** Owner reviews sanitized report and decides whether to commission independent history scan or limit M5 to HTML-only Track A; there is no implied permission to send the full public Git history to external testers.
