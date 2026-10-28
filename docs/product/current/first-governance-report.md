# First Governance Report

MindForge Guard is a deterministic governance evidence layer for single-agent AI workflows. Use this guide to move from a local Evidence Pack to a deterministic governance report that helps human reviewers inspect authority boundaries, execution evidence, missing evidence, and risk/drift signals.

> Not an approval system. Not a blocker. Not a control plane.

## Install

```bash
npm install -g @veeduzyl/mindforge-guard@7.0.1
```

## Verify The CLI

```bash
guard --version
guard --help
```

Confirm the packaged CLI entrypoint is available before validating the Evidence Pack.

## Obtain the Sample Pack and choose a working directory

Installing `@veeduzyl/mindforge-guard@7.0.1` and obtaining the repository's
Sample Pack are separate steps. Global npm installation does not include the
repository's root `examples/` directory.

Download and extract the [fixed-SHA GitHub source ZIP](https://github.com/veeduzyl-hue/mindforge-guard/archive/6ac3401db09f3ecd4499e09e3bd9ce81abbcab46.zip).
This ZIP is a **sample acquisition method**; its original downloaded archive
bytes have **not** been independently verified by this documentation review.

Open a terminal in the extracted source root, containing `examples/`.
Keep the Sample Pack and its `evidence/` subdirectory intact. The sample path,
relative to that working directory, is:

`examples/single-agent-governance-pack/hr-self-service-agent/`

These commands use the installed `guard` CLI, not a source build. You can
instead prepare a real Evidence Pack using [Bring your own workflow](bring-your-own-workflow.md)
and substitute its path in the commands.

> **Windows PowerShell 5.1 users:** Its native `>` redirection writes UTF-16LE (with
> a BOM), rather than a UTF-8 JSON file. To save UTF-8 output for other JSON
> tools, use the Windows-specific commands below **instead of** the two generic
> redirection examples. This encoding difference was observed in the
> [bounded Windows automation run](https://github.com/veeduzyl-hue/mindforge-guard/actions/runs/40627033967).

## Validate The Evidence Pack

Use the sample single-agent Evidence Pack for a first local walkthrough:

```bash
guard pack validate --pack examples/single-agent-governance-pack/hr-self-service-agent --preview --json > guard-pack-validate.json
```

Read `guard-pack-validate.json` and any stderr diagnostics before continuing.
For **Pack Validate**, the status-to-exit-code mapping is:

| `validation_status` | Exit code |
|---|---:|
| `valid_with_no_omissions` | 0 |
| `valid_with_limitations` | 2 |
| `invalid_due_to_omissions` | 3 |
| `invalid_due_to_malformed_input` | 4 |

Argument usage errors can also return **Exit Code 2**. Interpret the exit code,
JSON `validation_status` (if present), and stderr **together**; Exit Code 2
alone does not establish whether the result has limitations or the arguments
were invalid. Review limitations and warnings; resolve omissions or malformed
input before treating the Pack as ready for this walkthrough. This mapping
applies to Pack Validate only, not as a Report exit-code guarantee.

## Generate The Report

Generate the deterministic governance report locally:

```bash
guard report single-agent --pack examples/single-agent-governance-pack/hr-self-service-agent --preview --json > guard-single-agent-report.json
```

Report Preview calls Pack Validate internally. The preceding independent
validation command helps inspect input problems; no new implementation is
required for this connection.

Shell redirection (`>`) saves stdout in these files in the current working
directory, and **overwrites** existing files with these names. The shell,
not Guard, creates the named files; file existence alone does **not** prove
command success. Inspect exit code, JSON output and stderr for each command.
`guard-pack-validate.json` is the validation output;
`guard-single-agent-report.json` is the Report Preview.

## Windows PowerShell 5.1: Save UTF-8 JSON

From Windows PowerShell 5.1, in the extracted source root containing `examples/`,
use the following **alternative to the two generic `>` commands above**. The
fixed literal sample path is intentional. `cmd.exe /d /c` performs the native
stdout/stderr redirection without PowerShell 5.1's `Out-File` UTF-16LE
re-encoding; it does not modify system settings or change Guard itself.

```powershell
cmd.exe /d /c 'guard pack validate --pack "examples\single-agent-governance-pack\hr-self-service-agent" --preview --json 1>"guard-pack-validate.json" 2>"guard-pack-validate.stderr.txt"'
$packExit = $LASTEXITCODE
if ($packExit -ne 0) {
  Write-Warning ('Pack Validate exit code: ' + $packExit)
  Get-Content -LiteralPath '.\guard-pack-validate.stderr.txt'
  throw 'Sample Pack validation stopped. Inspect JSON validation_status, exit code, and stderr.'
}
$packResult = Get-Content -LiteralPath '.\guard-pack-validate.json' -Raw -Encoding UTF8 | ConvertFrom-Json
if ($packResult.validation_status -ne 'valid_with_no_omissions') {
  throw ('Unexpected sample validation_status: ' + $packResult.validation_status)
}

cmd.exe /d /c 'guard report single-agent --pack "examples\single-agent-governance-pack\hr-self-service-agent" --preview --json 1>"guard-single-agent-report.json" 2>"guard-single-agent-report.stderr.txt"'
$reportExit = $LASTEXITCODE
if ($reportExit -ne 0) {
  Write-Warning ('Single-Agent Report exit code: ' + $reportExit)
  Get-Content -LiteralPath '.\guard-single-agent-report.stderr.txt'
  throw 'Sample report generation stopped. Inspect exit code, JSON, and stderr.'
}
$reportResult = Get-Content -LiteralPath '.\guard-single-agent-report.json' -Raw -Encoding UTF8 | ConvertFrom-Json
if ($reportResult.report_mode -ne 'preview' -or
    $reportResult.review_posture -ne 'ready_for_review' -or
    $reportResult.deterministic_hash -ne $packResult.deterministic_pack_hash) {
  throw 'Unexpected report mode, review posture, or Pack/Report hash mismatch.'
}
```

These commands capture the Guard CLI's native redirected output files without
PowerShell 5.1 rewriting stdout as UTF-16LE. The JSON files are expected to be
UTF-8 for the published Node.js CLI; check their actual bytes/encoding when
using them for evidence or interoperability claims. The `.stderr.txt` files
retain separate diagnostics, and `$LASTEXITCODE` records the exit code of each
`cmd.exe` invocation. Do not treat the presence of a JSON file as success.

For the fixed synthetic Sample Pack, the expected exit code for each command
is `0`; the validation status should be `valid_with_no_omissions` and the report
review posture `ready_for_review`. For other Packs, Pack Validate exit code
`2` may mean `valid_with_limitations` **or** a usage error; inspect the JSON
`validation_status` and stderr as well as the exit code. Review omissions and
limitations before relying on an output. Redirected files are overwritten by
a repeat run; choose a fresh working directory if earlier artifacts must
be retained.

Windows PowerShell 5.1 `Out-File -Encoding utf8` writes UTF-8 **with a BOM**,
which is not the same as BOM-free UTF-8. See Microsoft's
[PowerShell 5.1 encoding guidance](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_character_encoding?view=powershell-5.1).
This documentation-only alternative has not undergone a separate human
Windows first-user walkthrough. It does not change the v7.0.1 npm package,
CLI behavior, approval boundaries, or the earlier automated test receipt.
## Read The Report

Read the output through these review layers:

Read `review_posture`, `receipt_refs`, `deterministic_hash`,
`non_enforcement_boundary` and evidence limitations in the JSON report.
The Sample Pack is a demonstration input, **not** evidence of your own workflow.
Preview is not independent verification, approval, institutional acceptance,
or execution authorization. GitHub Source Adapter R1 remains a standalone
offline observation tool: it does **not** automatically produce this
Single-Agent Evidence Pack.

Updating GitHub repository documentation does **not** update the published
npm v7.0.1 package documentation. No package release is performed here.

- authority boundaries
- execution evidence
- missing evidence
- risk/drift signals

Guard produces review evidence. The final human review decision remains outside Guard.

## License Hub

If you are using a commercial edition, use the same purchase email to sign in to License Hub, download the signed license JSON, and install it locally:

```bash
guard license verify --file downloaded-license.json
guard license install --file downloaded-license.json
guard license status
```

## Boundary

MindForge Guard remains recommendation-only, additive-only, non-executing, default-off where applicable, non-control-plane, deterministic, local-first where applicable, and human-review-oriented.

MindForge Guard does not approve, block, deploy, certify, or control execution.
