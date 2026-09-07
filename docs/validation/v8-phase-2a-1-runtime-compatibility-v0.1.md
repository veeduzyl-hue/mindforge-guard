# V8.0 Phase 2A.1 - Runtime And Cross-Platform Compatibility v0.1

Status: `COMPATIBLE FOR V8 DEVELOPMENT ONLY`. The current public Guard v7 runtime contract remains Node `>=18`; no public minimum-version change is made.

## 1. Compatibility Decision

The Phase 2A MESR verifier path uses Node native TypeScript type stripping. Its direct, unflagged development baseline is Node 22.18.0 on the Node 22 LTS line, Node 23.6.0 on the Node 23 line, or a later release line that enables type stripping by default. It was executed locally on Node 24.14.0.

Node 18 does not provide this direct `.ts` execution mode. This is an explicit V8 development-verifier limitation, not a change to the current public CLI runtime, because the public `packages/guard/src/**/*.mjs` graph has no direct `.ts` imports and the MESR package is not exported by the guard-core public index.

Reference: [Node.js TypeScript modules documentation](https://nodejs.org/download/release/v22.18.0/docs/api/typescript.html).

## 2. Existing And Current Language Boundary

Before Phase 2A:

- `packages/guard-core/src` already contained TypeScript source;
- existing EAK and Experiment 1 development verifiers already used MJS-to-TS direct imports;
- the public Guard CLI used MJS entry points and runtime modules.

After Phase 2A:

- MESR Core implementation remains TypeScript source;
- MESR fixtures and directly executable verifier entry points remain MJS;
- the verifier commands are plain `node scripts/*.mjs` commands;
- there is no compiler-output path, `tsx`, `ts-node`, custom loader, or MESR tsconfig path;
- the public Guard CLI import graph remains MJS-only.

Actual Phase 2A mode: `Mode A` - an MJS verifier imports `.ts` source directly and Node performs native type stripping.

```text
scripts/verify_mesr_*.mjs
  -> packages/guard-core/src/mesr/*.ts
  -> existing packages/guard-core/src/*.ts
```

This continues the pre-Phase-2A development convention; it expands the number of development-only edges but does not introduce the first MJS-to-TS verifier edge.

## 3. TypeScript Syntax Boundary

The MESR direct execution path is restricted to erasable TypeScript syntax. The compatibility verifier rejects:

- runtime enums;
- runtime namespaces;
- constructor parameter properties;
- TypeScript import aliases;
- decorators;
- tsconfig path aliases.

Relative import extensions are explicit, type-only imports use `import type` or inline `type`, and all runtime import targets resolve with exact filename case. No transform-requiring TypeScript construct was found.

## 4. OS Portability Boundary

`.ts` versus `.mjs` is not inherently a Windows/macOS/Linux portability issue. The relevant compatibility boundary is Node version, execution mode, and filesystem/shell behavior.

The Phase 2A source, fixtures, and verifiers contain no hard-coded drive paths, UNC paths, backslash-only path construction, cmd.exe/PowerShell/bash invocation, `/tmp` assumption, child-process shell execution, or platform branch. ESM relative imports and Node filesystem/path APIs are platform-neutral. Import filename case is checked explicitly.

## 5. Runtime Contract Comparison

| Surface | Declared/effective baseline | Decision |
| --- | --- | --- |
| Current public Guard CLI | Node `>=18`; MJS runtime graph | Preserved |
| Guard-core source | TypeScript, private package, ESM | Existing source-language convention |
| V8 Phase 2A development verifiers | Native type stripping; Node 22.18.0 LTS-line baseline or a later default-enabled line | Explicit development-only baseline |
| MESR public/runtime integration | None | Default-off and out of public v7 path |

No `engines.node` field is changed. If MESR later enters a public runtime, a separate decision must choose one of:

1. preserve Node `>=18` and add an explicit compile/runtime artifact boundary;
2. raise a future V8 public Node minimum through a separate release decision;
3. retain direct native-TS execution only for development verification.

Phase 2A.1 adopts option 3 for the current checkpoint.

## 6. Cross-Platform Test Matrix

| OS | Surface | Node target | Status | Evidence |
| --- | --- | --- | --- | --- |
| Windows | Public v7 CLI/regressions | Declared `>=18`; executed on 24.14.0 | EXECUTED / PASS | Local required regression suite |
| Windows | V8 native-TS development verifier | 22.18.0 LTS-line baseline; executed on 24.14.0 | EXECUTED / PASS | `verify:v8:runtime-compatibility` and Phase 2A suite |
| Linux | Public v7 CLI/regressions | `>=18` | NOT EXECUTED | Matrix defined only |
| Linux | V8 native-TS development verifier | 22.18.0 LTS-line baseline | NOT EXECUTED | Matrix defined only |
| macOS | Public v7 CLI/regressions | `>=18` | NOT EXECUTED | Matrix defined only |
| macOS | V8 native-TS development verifier | 22.18.0 LTS-line baseline | NOT EXECUTED | Matrix defined only |

No Linux or macOS PASS is claimed. A future CI matrix should run the targeted compatibility verifier, Phase 2A aggregate, and current public regressions on each OS without changing their expectations.

## 7. Preserved Boundaries

- audit output, verdict, and exit semantics unchanged;
- deny exit code `25` unchanged;
- permit and classify behavior unchanged;
- recommendation-only, additive-only, non-executing, and default-off;
- no authority expansion;
- no build-system, runtime-loader, network, database, cloud, or public package-engine change;
- E3-A and E3-B remain not run; Gate 2 remains not yet complete.
