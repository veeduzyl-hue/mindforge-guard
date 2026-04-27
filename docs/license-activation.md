# Guard License Activation

Paid Guard analytics stay offline and use a signed local license file.

## What The License File Is

The Guard license file is a signed JSON document you download from License Hub. Guard reads it locally to decide whether edition-gated CLI commands are available.

Community use does not require a paid license file. Pro, Pro+, and Enterprise users install a signed local license JSON to unlock paid analytics commands.

## Where Guard Expects The License

Guard installs and reads the local license at:

- Windows: `C:\Users\<user>\.guard\license.json`
- macOS/Linux: `~/.guard/license.json`

`guard license status` prints the exact path Guard is using on the current machine.

## Activation Flow

1. Download your signed license JSON from License Hub.
2. Verify the downloaded file before installing it:

```bash
guard license verify --file downloaded-license.json
```

3. Install the verified file locally:

```bash
guard license install --file downloaded-license.json
```

4. Confirm the installed state:

```bash
guard license status
guard license show
guard status
```

What each command does:

- `guard license verify --file <file>` checks a downloaded file and reports the expected install path plus the next step.
- `guard license install --file <file>` writes the file to Guard's local license path after validation.
- `guard license status` prints a human-readable summary.
- `guard license show` prints the structured local inspection result as JSON.
- `guard status` includes the local license section alongside policy and drift status.
- `guard license remove` removes the currently installed local license file.

## Activation Meaning By Edition

- `community`: no paid license is required for the base CLI surface.
- `pro`: installs a signed license that unlocks `guard drift timeline`.
- `pro_plus`: installs a signed license that unlocks `guard drift compare` and `guard assoc correlate` in addition to Pro access.
- `enterprise`: installs a signed enterprise license; in the current release its CLI entitlement matches Pro+, with no extra runtime authority added.

## Interpreting Gate Errors

### `license_required`

`license_required` means the command is gated and Guard does not currently see a usable local license for that feature.

This includes the common cases called out in the implementation:

- missing license
- invalid license
- expired license
- `not_yet_valid` license

Other non-`ok` local license states are treated the same way for command gating.

### `edition_mismatch`

`edition_mismatch` means the local license is valid, but the installed edition is below the required tier for the command you ran.

Typical examples:

- `guard drift timeline` requires `pro`
- `guard drift compare` requires `pro_plus`
- `guard assoc correlate` requires `pro_plus`

## Troubleshooting

### Command Not Found

- Reinstall the published package: `npm install -g @veeduzyl/mindforge-guard`
- Re-check the executable: `guard --version`
- If you are working directly from this repo, verify the entrypoint with `node packages/guard/src/runGuard.mjs --version`

### License File Not Detected

- Run `guard license status` and check the printed `path:`
- Install the file with `guard license install --file downloaded-license.json`
- Confirm the file you downloaded is the one you expected Guard to install

### Invalid Or Expired License

- Run `guard license verify --file downloaded-license.json`
- Re-download a fresh signed license JSON from License Hub if the file is invalid or expired
- Reinstall with `guard license install --file downloaded-license.json`

### Edition Mismatch

- Confirm the installed edition with `guard license status` or `guard license show`
- Match the command to the required tier:
- `guard drift timeline` -> `pro`
- `guard drift compare` -> `pro_plus`
- `guard assoc correlate` -> `pro_plus`
- Install the correct higher-tier license if needed

### Pro Or Pro+ Command Still Blocked After Install

- Run `guard license status` and confirm it reports `license: ok (<edition>)`
- If the command returns `edition_mismatch`, the installed license is valid but too low-tier for that command
- If the command returns `license_required`, the installed file is not currently usable; re-run `guard license verify --file <file>` and reinstall
- If you need to clear a stale local file first, run `guard license remove` and then reinstall the correct signed file

## Related Docs

- [Quickstart](./quickstart.md)
- [Editions And Command Map](./EDITIONS.md)
- [First 10 Minutes With Guard](./first-10-minutes.md)
