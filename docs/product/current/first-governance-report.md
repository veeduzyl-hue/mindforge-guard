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
