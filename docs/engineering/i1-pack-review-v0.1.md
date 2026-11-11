# I-1 Local Pack Review — engineering candidate v0.1

**Status:** ISOLATED_ENGINEERING_CANDIDATE / NOT RELEASED / NOT MERGED.
**Fixed parent:** `main` `3bad6d7fc69b64cdc7ef594edff97cfaeba62b0c`.
**Scope:** existing First Report folder Pack only. No `--source`, `--repo`, drift, analytics, IAM, remote scan, upload or agent execution.

## Usage (candidate branch only)

```sh
guard review --pack ./hr-self-service-agent --out ./new-review-bundle --format text
# or --format json for stdout metadata
```

The output directory **must not exist**, and its parent must already exist. This command is an explicitly requested, local, additive review operation. It has no license gate. It does not approve, certify, enforce, execute or establish independent assurance.

## How it works

1. Strict preflight of an explicitly selected Pack (7 required files, 3 recommended files, plus optional README), only the `evidence/` allowlist, no extra directories, symlinks, source/output overlap, path traversal references or inaccessible sources.
2. Create a private same-parent sibling staging directory. Copy selected files into a private snapshot with exclusive writes and size limits. Compute content digests and reject detected input mutations.
3. Parse the frozen copy **once** using the existing `parseSingleAgentGovernancePackPreview`. Construct the existing Pack Validate object through an additive export and the unchanged Single-Agent Report mapper. The latter reads the immutable private copy, not the mutable source.
4. Preserve the validation native status and corresponding exit 0/2/3/4. Usage errors may also exit 2 and must be distinguished from valid-with-limitations by JSON/stderr. Review I/O/preflight errors use separate diagnostics; the overall numeric exit contract is candidate-only.
5. Generate a Review Bundle envelope with native component JSON, status/limitations, relative artifact paths, SHA-256 digests, report preview, `does_not_support` claims and a human-readable summary. The `pack_path` field inside the Bundle is reduced to a source basename (deliberate path minimization); native CLI commands remain unchanged. No raw source copies remain in the completed Bundle.
6. Flush individual temp files, rename within staging, generate checksums excluding the checksum index itself, remove source snapshot, and publish through a same-filesystem sibling directory rename. The command fails closed on an already existing destination. Errors after staging can retain a non-successful `.guard-i1-partial-*` directory without source copies.

## Explicit limitations and stop conditions

- Unlike the pre-existing Pack parser, I-1 deliberately **rejects** unexpected files within the selected root. This strict allowlist is a deliberate candidate restriction: do not silently scan or retain unrelated data or secrets.
- Source reads and after-read digest verification detect ordinary changes; this is **not** a transactional filesystem snapshot against an adversarial concurrent writer. No stronger runtime provenance or file-origin claims are made.
- Exclusive temporary writes and a same-volume final rename are used. Filesystem and non-cooperating external-writer races remain a platform-specific admission test; do not claim universal overwrite immunity from source review alone.
- JSON component fields may contain input-provided narrative or identifiers. Source absolute `pack_path` is minimized but the user must still inspect the Bundle for sensitivity before sharing.
- `ready_for_review` means only ready for human review, not approved, deployed, verified or safe-to-execute.
- M2/M3 `guard review` (broader modes) and M4 original 62-test matrix remain separate. I-1 test IDs `I1-T01..T20` are local, not M4 IDs.
- This candidate remains outside public npm v7.0.1 and does not promote v7.1.0-rc.0 to a stable release.
- No release, PR merge, main update, Entitlement, License Hub, Paddle or commercial prices change is authorized by I-1 implementation.

## Review Bundle contents

```text
<new-output-directory>/
  review-manifest.json
  review-summary.md
  diagnostics.json
  bundle-checksums.json
  components/pack-validation.json
  components/single-agent-governance-report.json  # except malformed input
```

The Bundle is a *delivery envelope*, not a fifth canonical Evidence Contract. `bundle-checksums.json` lists the other files' byte lengths and SHA-256; it never claims completeness of actual Agent execution.

## Verification

- Run `npm run verify` and `npm run verify:v7.0.1` on the fixed engineering branch to prove legacy surface compatibility.
- Run `node scripts/verify_i1_pack_review.mjs` for local I-1 tests: happy path, missing/limited/malformed, symlink/ref escape, output collision, extra-file refusal, Unicode, content mutation and limitations.
- Install **one canonical tarball** into a temporary prefix on Linux, Windows PS5.1, macOS ARM64 and macOS Intel, then run `node scripts/verify_i1_packaged_smoke.mjs` against the installed CLI. No npm publish.
- Record every test result and its actual runner. A green CI badge alone does not prove a production security guarantee or real first-user acceptance.

## Outstanding Owner Gates

This candidate is not itself a frozen public command contract. Review numeric overall status behavior, allowed-file constraints, other first-user inputs and filesystem race coverage before final I-1 acceptance. Independent macOS first-user validation remains pending.
