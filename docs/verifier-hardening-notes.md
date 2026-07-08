# Verifier Hardening Notes

## `verify_audit_permit_gate.mjs` temp-state isolation

### Context

During the post-merge cleanup for PR #292, the aggregate verifier failed in the existing core verification chain before the External Evidence verifier ran.

The failure occurred in:

- `scripts/verify_audit_permit_gate.mjs`
- command path: `npm run verify` -> `verify:core` -> `verify_audit_permit_gate.mjs`
- observed failure: `git commit -m init` returned exit code `1`

The failing temp repo was:

- `%TEMP%\mindforge-guard-permit-gate-deny-repo`

Related temp files included:

- `%TEMP%\mindforge-guard-permit-gate-allow.json`
- `%TEMP%\mindforge-guard-permit-gate-allow-receipt.json`
- `%TEMP%\mindforge-guard-permit-gate-deny.json`
- `%TEMP%\mindforge-guard-permit-gate-deny-receipt.json`

### Diagnosis

The failure was caused by stale local temp state.

The temp deny repo was not fresh. It already contained previous `init` commit history and had a clean working tree. As a result, the verifier's `git commit -m init` command could return `1` because there was nothing new to commit.

After deleting only the scoped temp paths used by this verifier, the following commands passed:

```bash
node scripts/verify_audit_permit_gate.mjs
npm run verify:core
npm run verify:external-evidence:type-contract
npm run verify
```

### Impact

This was not caused by the External Evidence Framework.

It did not involve:

- external evidence type contracts
- external evidence docs
- external evidence verifier logic
- runtime implementation
- `audit` / `permit` / `classify` semantic changes

### Hardening Recommendation

In a future verifier-only PR, consider replacing fixed temp paths with unique per-run temp directories, for example using `fs.mkdtempSync(path.join(os.tmpdir(), "mindforge-guard-permit-gate-"))`.

The future fix should remain verifier-only and should not change Guard runtime behavior.

### Non-Goals

This note does not propose:

- runtime behavior changes
- approval/blocking/enforcement behavior
- package export changes
- external evidence adapter implementation
- changes to `audit`, `permit`, or `classify` semantics
