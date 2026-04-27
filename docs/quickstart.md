# Guard Quickstart

MindForge Guard is a local-first CLI. It helps you inspect and document AI-assisted change, but it does not take over execution or become a control plane.

## Install

Install the published CLI package:

```bash
npm install -g @veeduzyl/mindforge-guard
```

## Verify The Install

Use the installed executable directly:

```bash
guard --version
guard --help
guard status
```

Expected outcome:

- `guard --version` prints the installed Guard version.
- `guard --help` lists the implemented command surface.
- `guard status` prints repo policy state, drift summary, and local license state.

## First Successful Guard Run

These commands work without a paid license and without initializing a repo policy first:

```bash
guard drift status --format json --pretty
guard action classify --text "write file README.md"
```

Expected outcome:

- `guard drift status` returns a signal-only drift bundle.
- `guard action classify` returns a deterministic `canonical_action` JSON artifact.

## Repo-Local Policy Workflow

When you are inside a repository and want the policy/audit path:

```bash
guard init
guard validate-policy
guard audit . --staged
guard snapshot .
```

Notes:

- `guard init` creates `.mindforge/config/policy.json`.
- `guard validate-policy` validates the repo policy file.
- `guard audit . --staged` is the implemented audit command surface.
- `guard snapshot .` uses the latest local audit artifact, so run it after a successful audit.

## Paid Analytics

Paid analytics commands are edition-gated:

- `guard drift timeline` requires `pro`
- `guard drift compare` requires `pro_plus`
- `guard assoc correlate` requires `pro_plus`

Use a signed local license file to unlock them. See [License Activation](./license-activation.md).

## Next Docs

- [License Activation](./license-activation.md)
- [Editions And Command Map](./EDITIONS.md)
- [First 10 Minutes With Guard](./first-10-minutes.md)
