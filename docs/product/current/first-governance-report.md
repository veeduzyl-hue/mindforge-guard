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

## Validate The Evidence Pack

Use the sample single-agent Evidence Pack for a first local walkthrough:

```bash
guard pack validate --pack examples/single-agent-governance-pack/hr-self-service-agent --preview --json
```

## Generate The Report

Generate the deterministic governance report locally:

```bash
guard report single-agent --pack examples/single-agent-governance-pack/hr-self-service-agent --preview --json
```

## Read The Report

Read the output through these review layers:

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
