# First 10 Minutes With Guard

This guide walks from install to a first successful Guard experience using only implemented commands.

## Minute 0-2: Install Guard

```bash
npm install -g @veeduzyl/mindforge-guard
```

Guard stays local-first. It helps you inspect change and governance state, but it does not take over execution.

## Minute 2-4: Verify Installation And Status

```bash
guard --version
guard --help
guard status
```

Expected outcome:

- version output confirms the executable is available
- help output shows the current command surface
- status output shows policy state, drift summary, and local license state

`guard status` succeeds even before a repo has been initialized with a policy.

## Minute 4-6: Run The First Governance Command

Start with a deterministic, side-effect-free command:

```bash
guard action classify --text "write file README.md"
```

Expected outcome:

- Guard returns a `canonical_action` JSON artifact
- the output includes a normalized action classification and a deterministic hash

If you want to start the repo-local policy path right away, follow with:

```bash
guard init
guard validate-policy
```

Expected outcome:

- `guard init` writes `.mindforge/config/policy.json`
- `guard validate-policy` confirms that policy file is valid

## Minute 6-8: Check Drift Or Capture A Snapshot

For a no-license, no-policy drift read:

```bash
guard drift status --format json --pretty
```

Expected outcome:

- Guard returns a drift signal bundle
- on a quiet repo, the drift trend may remain stable with zero density

If you have initialized the repo and want the audit/snapshot path, use the implemented sequence:

```bash
guard audit . --staged
guard snapshot .
```

Expected outcome:

- `guard audit . --staged` runs the audit path for staged changes in the current repo
- `guard snapshot .` writes a snapshot based on the latest local audit artifact

`guard snapshot .` depends on an existing audit artifact, so run it after a successful audit.

## Minute 8-10: Understand Editions, License Activation, And The Next Step

Community users can keep working with the base command surface immediately.

Paid analytics require a signed local license:

```bash
guard license verify --file downloaded-license.json
guard license install --file downloaded-license.json
guard license status
```

Edition summary:

- `pro` unlocks `guard drift timeline`
- `pro_plus` unlocks `guard drift compare` and `guard assoc correlate`
- `enterprise` currently matches Pro+ CLI entitlement in this release

From here, the usual next step is either:

- continue with the repo-local workflow: `guard audit . --staged`
- or activate a paid edition and try the gated analytics commands

## Related Docs

- [Quickstart](./quickstart.md)
- [License Activation](./license-activation.md)
- [Editions And Command Map](./EDITIONS.md)
