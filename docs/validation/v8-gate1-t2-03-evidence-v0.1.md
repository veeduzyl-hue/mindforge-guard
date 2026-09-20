# T2-03 Principal Separation and Custody-Bound Independent Checking — Evidence v0.1

Decision: **T2_03_IMPLEMENTATION_PASS_WITH_REMAINING_GAPS**. G05 = CLOSED through the accepted T2-01, T2-02 and this T2-03 decomposition. G07, G06 and G03 remain OPEN; none is started here. Internal V8 remains unreleased; public/commercial baseline remains v7.0.1.

## Checkpoint and exact boundary

- Pre-change HEAD / implementation-entry commit: `d5beff29c5e33a7b9ff5a8e7f9af7214e802f228`.
- Starting worktree: CLEAN, confirmed before branch creation.
- Implementation branch: `feat/v8-gate1-tranche2-t2-03-independent-checking-v0.1`.
- Accepted authority: [entry v0.2](../planning/v8-gate1-t2-03-implementation-entry-v0.2.md); its eight-path scope and all historical evidence remain immutable.
- Exact changed-path set:

```text
packages/guard-core/src/mesr/repaired/independence.ts
packages/guard-core/src/mesr/repaired/evaluateClaim.ts
scripts/verify_v8_gate1_product_conformance.mjs
scripts/gate1/b09-product-inputs.mjs
scripts/gate1/b09-product-compare.mjs
tests/fixtures/gate1/t2-03-controls.v0.1.json
tests/fixtures/gate1/t2-03-results.v0.1.json
docs/validation/v8-gate1-t2-03-evidence-v0.1.md
```

Only the first two paths contain product changes. No registry, Core support/nonclaim, reason code, binding collector, state selector, shared contract, admission, integrity implementation, verification-event implementation, composition owner, public export, CLI, license or package/version file changes.

## Private factual method and retained dimensions

`independence.ts` implements the explicit supplied-fact method `retained-principal-custody/0.1`. It reads a separately authored private dossier under the admitted evidence ledger. Historical ledger references are never expanded or repaired. It retains separately attributable T2-01 results, identity basis, private principal separation, custody basis, successful-check association and attributable control/conflict records. Canonical primary states remain exclusively owned by `evaluateClaim.ts`.

Identity uses `retained-role-attestation@0.1` linked to an actual retained `identity_verification` record under `retained-credential-verification/0.1`: principal, operational role, checker/producer attribution, identity reference, method/result, credential-subject association, recorder, provenance, event namespace/ID, subject/revision/scope/time and limitations must agree. An opaque reference without its retained record is missing evidence. This interprets supplied credential-verification assertions; it performs no live authentication, issues no identities and does not prove world truth.

The separation policy is `verifier-separate-from-producer-and-executor@0.1`, with the explicit criterion `distinct-principal-no-common-control-no-conflict` and named producer:verifier / executor:verifier role pairs. It does not require producer and executor to be distinct. `retained-control-and-conflict-register/0.1` requires affirmative common-control and conflict-of-interest observations, attribution, provenance, complete coverage and an event-covering interval. Equal controlling principals or complete policy violations are non-support. Opposing comparable records produce separate contradiction facts; records are not selected by favorable order or majority. Unknown methods/criteria and missing witnesses remain missing.

Custody uses `no-sole-producer-substitution@0.1` / `all-retained-stages-through-check`. Every relied-on event input and output requires collection, transfer, transformation (including an explicitly recorded absence), storage and access-control witnesses under `retained-access-and-custody-record/0.1`. Named producer/custodian identity, member namespace/ref, representation/domain, attributable substitution-control facts, complete intervals through check/comparison time, provenance, limitations and no unaccounted omissions are required. A sole-control flag, copied bytes, storage label or custodian label alone cannot satisfy this method.

This bounded method admits the explicitly declared `canonical-json-utf8` / `supplied-verification-content` representation for the supplemental event members. It checks actual recomputed byte digest against canonical retained content and validates each T2-02 receipt against its exact separate original input/path/requirement contexts. It retains expected source/digest, recomputed digest, byte count, comparison result, checker/method/time and all member associations, including the native event namespace and retained input/output context. Other representations remain unresolved under this method. It does not broaden G03 producer/pack integration or treat equality as custody.

The original T2-01 occurrence/result evaluator is invoked unchanged. Failed, skipped/incomplete, inconclusive and competing results are preserved. A complete failure cannot support successful independence; custody may still be supported. A pass with missing identity can remain supported on its own pass path while independence is unresolved.

## Creation authority, context binding and state ownership

A module-private WeakMap holds immutable product-created snapshots behind frozen handles. Reader authority requires the original object identity and equality of the full admitted input, Core input, admission trust, collected basis and requirement contexts. The input contains the entire retained dossier, principals, methods, policy/criterion versions, event/result, source/member/comparison associations, custody intervals, limitations and supplied evaluation time. The reader also checks the requested facet/path and semantic version. No clock, pointer or process identity enters output.

Plain/copied/serialized handles, caller flags, fixture expectations, caller StateBasis and T2-01/T2-02 objects cannot grant finding authority. Attempts to mutate frozen evidence throw. Serialized witness evidence can be recomputed into a fresh valid handle; its serialized handle cannot be reused.

The optional sixth `evaluateClaims` argument is private and defaults absent. The fifth T2-02 receipt channel is unchanged. Only the two exact existing facets consume T2-03 facts. Existing admission, collected Core/caller/context obligations, scoped prohibitions, six-state precedence, state selection, result registration and composite ownership remain unchanged. Source reconstruction checks prove the evaluator differs only by the import, optional intake and guarded branch.

| Complete or partial basis | verification.independent | custody.independent |
| --- | --- | --- |
| Complete positive identity/separation/custody + attributable successful check | eligible SUPPORTED | eligible SUPPORTED on its own custody basis |
| Missing relevant witness/association | UNRESOLVED | UNRESOLVED where custody is affected |
| Complete policy/control/substitution violation | UNSUPPORTED when otherwise complete | UNSUPPORTED for custody violation |
| Comparable contradictory retained witnesses | CONFLICTED, subject to Core prohibition | CONFLICTED for custody contradiction |
| Complete bounded undecidable method | INCONCLUSIVE | INCONCLUSIVE for custody method |

No valid finding executes exactly the old behavior. No collected missing binding is removed, including caller/context obligations colliding with T2-03 fact names. Principal separation is private; no new canonical claim identity or alias exists.

## Executed BEFORE capture

Before any product edit, `node "$env:TEMP/guard-t203-before.mjs"` exited 0 using function extraction from the unchanged existing verifier. Its exact executed source is retained in controls.before.capture_source (SHA-256 `78162ea94c387a2f1c41aa450733c15937ceb0efde9d1296807e1d1eb44c0e8e`); the source verifier hash is `d4cb58dc0c7c0ab2eeab12b64d2b76721ff3efefccb8398527ef68ada75eb912`.

The capture executed unchanged T2-01 and T2-02 semantic assertion bodies, t201Preservation through actual product APIs, all 21 existing regression commands, complete legacy report/render/index/parser/validator/reason-order controls, 133 historical claim outputs (including I-family, N02/N15/N18, I10.unresolved_ref and temporal I17), H14/H15 structural rejection, and 1440 tracked-source hashes. Historical branch-specific lifecycle modes are preserved in source; they are not represented as having passed under the new branch.

An initial temporary extraction syntax error happened before product edits and produced no accepted baseline; the corrected capture completed successfully. Early semantic drafts found stale fixture evidence references, which were corrected only in new supplemental evidence. The earlier debug-only replay is not the accepted result below. A later full attempt was deliberately stopped before acceptance to tighten native event/member custody associations; its intermediate replay hash is also not the accepted result. The first final-code acceptance attempt passed every semantic/T1/T2/Core assertion and 20 regression commands, but the public-surface command rejected unstaged implementation files at its Git-index-stat scope guard (exit 1, BLOCKED_BY_VALIDATION). Normal staging of the exact eight paths resolved that lifecycle mismatch: the unchanged command then exited 0. The complete acceptance command was rerun from the staged content to produce the single final 21/21 receipt below. No protected guard was changed or bypassed, and the initial validation failure is not a product-semantic regression.

## Executed acceptance and replay

Command: `node scripts/verify_v8_gate1_product_conformance.mjs --task T2-03 --record`; exit 0.

- 171 declarative supplemental witness cases and 76 executed runtime/falsifier controls, each evaluated three times with fresh private handles.
- New I10/I18/N18 complete supplemental controls: bounded independence and custody SUPPORTED; institutional acceptance remains unresolved. These are synthetic supplied witnesses, never rewritten historical evidence.
- Label/process/machine/organization-only, missing/null/empty/wrong-type witnesses, opaque/unresolved identity references, unknown methods/policies, incomplete intervals, custody gaps, bare false sole-control flags, copied record references and equality-only substitutions remain unresolved.
- Same principal, common control, conflict-of-interest and sole-producer substitution establish bounded non-support when complete; contradictory relationship/custody/T2-01 result witnesses preserve conflict precedence. Collateral missing obligations do not erase admissible contradictions; Core prohibitions remain stronger.
- Forged/copied/serialized/tampered handle, caller StateBasis/flags, fixture expectations and T2 substitutions cannot authorize facts. Cross-subject/revision/scope/event/principal/member/representation/domain/policy/interval/time/evaluation-time/path/identity-method/result/provenance/Core/trust/requirement-context reuse is inert.
- Failed/skipped/incomplete/inconclusive results are retained exactly; separation is independently retained. Pass-with-missing-independence is exercised through the actual T2-01 canonical bridge. Original fifth-argument behavior is executed by accepted T2-02 controls.
- All 133 historical outputs are byte-equivalent under canonical serialization without a valid finding. Frozen I10 has no dossier/handle and stays byte-identical; I10.unresolved_ref is preserved. I17 stays temporal/G07 evidence only.
- H14 malformed base64 `%%%`: REJECTED. H15 numeric base64 `123`: REJECTED, without coercion.
- T1-01 / T1-02 / T1-03 / T1-04: PASS, exact accepted API fingerprints and requirement unions. All 603 Core probes: PASS.
- T2-01: 370 cases / 64 controls, unchanged result hash `4df327296d4c2baea45cd22ce13d4b789fedbb783a7c8a1ff7a526745edad102`.
- T2-02: 4 comparisons / 81 controls, unchanged result hash `a1a11f600d227220aac30d91dda8f7e57a1d6f1f3825c4fb392583ad0b36f4c5`.

Three canonical T2-03 replay hashes:

```text
1: fd1bcd87dcd6e061c8bd8584705a178484bf2c09e9b347dd1293db559df35b34
2: fd1bcd87dcd6e061c8bd8584705a178484bf2c09e9b347dd1293db559df35b34
3: fd1bcd87dcd6e061c8bd8584705a178484bf2c09e9b347dd1293db559df35b34
T2_03_RESULT_HASH = fd1bcd87dcd6e061c8bd8584705a178484bf2c09e9b347dd1293db559df35b34
```

All three raw JSON serializations were also asserted exactly equal. SHA-256 of each exact JSON serialization: `a5976a2ada4e38012c238f82c5432407c1340700d765bb7ab414a019f3067dee`. No generated identity or current clock participates. The clean post-commit invocation is a fresh-process reproduction; its result and implementation commit SHA are reported outside this immutable commit's own bytes.

## BEFORE / AFTER regression receipts

R-MESR: registry, reason bindings, claim stability, composition, portability, cross-domain and crosswalk. R-EAK: kernel and local normalization/report/composition. R-ISOLATION: runtime compatibility plus exact protected-source inventory, old verifier reconstruction and product import checks. R-PUBLIC: full serialized legacy API controls plus governance/audit/permit and v7.0.1 regression commands below. Every command's source hash and complete stdout are retained in the JSON evidence.

| Exact command | BEFORE exit | AFTER exit | BEFORE stdout SHA-256 | AFTER stdout SHA-256 |
| --- | --- | --- | --- | --- |
| `node scripts/verify_mesr_registry.mjs` | 0 | 0 | `27b44de12c3cc1027ed81c4e8428e6cd830e359f4eb73dd46809295807c7dc1f` | `27b44de12c3cc1027ed81c4e8428e6cd830e359f4eb73dd46809295807c7dc1f` |
| `node scripts/verify_mesr_reason_bindings.mjs` | 0 | 0 | `f13e72889d28248625bba98d337c232282ea8c0e8e02a311191cc0c3bfe3fac6` | `f13e72889d28248625bba98d337c232282ea8c0e8e02a311191cc0c3bfe3fac6` |
| `node scripts/verify_mesr_claim_stability.mjs` | 0 | 0 | `1fef93b0bfa4b995441314633581ad8f847e1121b442756100a938be43ac04d4` | `1fef93b0bfa4b995441314633581ad8f847e1121b442756100a938be43ac04d4` |
| `node scripts/verify_mesr_composition.mjs` | 0 | 0 | `33c6a9c12419985363611e86616ad95211eeb22019ceac861a32fca35878ff0d` | `33c6a9c12419985363611e86616ad95211eeb22019ceac861a32fca35878ff0d` |
| `node scripts/verify_mesr_runtime_portability.mjs` | 0 | 0 | `6246178f816e5f10e4e81b3c156e4a63791c7dbdc68004ef124ed8ce2433b64e` | `6246178f816e5f10e4e81b3c156e4a63791c7dbdc68004ef124ed8ce2433b64e` |
| `node scripts/verify_mesr_cross_domain.mjs` | 0 | 0 | `3e42917d3097cdd4bf29107fb5b212ecfa588d01bbe79c208aa569da4fcd5718` | `3e42917d3097cdd4bf29107fb5b212ecfa588d01bbe79c208aa569da4fcd5718` |
| `node scripts/verify_mesr_apaai_crosswalk.mjs` | 0 | 0 | `04e4c6016641f575bebc75fffa43ff16f70244cffdd80057cebbebde0922ef9d` | `04e4c6016641f575bebc75fffa43ff16f70244cffdd80057cebbebde0922ef9d` |
| `node scripts/verify_v8_runtime_compatibility.mjs` | 0 | 0 | `34a498b6d7c488b46053e85d8d4a57a1ab7832801764158d9375f552b76e751a` | `34a498b6d7c488b46053e85d8d4a57a1ab7832801764158d9375f552b76e751a` |
| `node scripts/verify_v8_institutional_artifact_readiness.mjs` | 0 | 0 | `f89984210010f4db5ce739108a2097e12cfa274d6cdc2f13987386002b1b7641` | `f89984210010f4db5ce739108a2097e12cfa274d6cdc2f13987386002b1b7641` |
| `node scripts/verify_evidence_assurance_kernel_poc.mjs` | 0 | 0 | `4e135771af995ec5035f1c95804e2ac34aa8b94e801fac9fa352f5adb2ecd0ea` | `4e135771af995ec5035f1c95804e2ac34aa8b94e801fac9fa352f5adb2ecd0ea` |
| `node scripts/verify_external_evidence_local_normalization_fixture.mjs` | 0 | 0 | `699fa082797809571aa5dd440d3f8d359281a0a44adb664fc9b97e0d8bfc96ec` | `699fa082797809571aa5dd440d3f8d359281a0a44adb664fc9b97e0d8bfc96ec` |
| `node scripts/verify_external_evidence_local_assurance_report_fixture.mjs` | 0 | 0 | `93e939d24d0006b043e20980545c243107914a4dbb41512fd840c41ae942ef6a` | `93e939d24d0006b043e20980545c243107914a4dbb41512fd840c41ae942ef6a` |
| `node scripts/verify_external_evidence_local_assurance_composition.mjs` | 0 | 0 | `82b82c12ed97f1edad3fb052553ca57fea860165e17bf023c623b78cdaf334f0` | `82b82c12ed97f1edad3fb052553ca57fea860165e17bf023c623b78cdaf334f0` |
| `node scripts/verify_governance_surface.mjs` | 0 | 0 | `7c1d3bb409f69f4612e79fe28e180853827878f0b3c1befb820a732e7f40b214` | `7c1d3bb409f69f4612e79fe28e180853827878f0b3c1befb820a732e7f40b214` |
| `node scripts/verify_governance_consumption_profile.mjs` | 0 | 0 | `d4fe7972b1ac55432ace076b56327359f397e29d6c15440e739711f0f7b74b68` | `d4fe7972b1ac55432ace076b56327359f397e29d6c15440e739711f0f7b74b68` |
| `node scripts/verify_audit_permit_gate.mjs` | 0 | 0 | `38d6221a05780f8374657a75016e926810175d298f584e058b066864ddb83357` | `38d6221a05780f8374657a75016e926810175d298f584e058b066864ddb83357` |
| `node scripts/verify_v7_0_example_evidence_pack.mjs` | 0 | 0 | `1a7fe24a57cdd5eefd694b70b3aa7ff5336948affbb4aa98f7ec56fdaaee09f3` | `1a7fe24a57cdd5eefd694b70b3aa7ff5336948affbb4aa98f7ec56fdaaee09f3` |
| `node scripts/verify_v7_0_1_license_hub_after_purchase_copy.mjs` | 0 | 0 | `6fb02dcce1495a16a65ccf48ccc09e02ac69c4f34f31d033e68387da63ba7dd2` | `6fb02dcce1495a16a65ccf48ccc09e02ac69c4f34f31d033e68387da63ba7dd2` |
| `node scripts/verify_v7_0_1_public_surface_consistency.mjs` | 0 | 0 | `d88d8e12e3852a64c502aa2e0dc60c5c64d9d91da44add8f882dd1eca43b3f10` | `d88d8e12e3852a64c502aa2e0dc60c5c64d9d91da44add8f882dd1eca43b3f10` |
| `node scripts/verify_v7_0_1_current_docs_baseline.mjs` | 0 | 0 | `5eda00a3e7b6febb1493287ffd926237fb2ed1e795ff33668b38bed6d1a06c07` | `5eda00a3e7b6febb1493287ffd926237fb2ed1e795ff33668b38bed6d1a06c07` |
| `node scripts/verify_v7_0_1_github_action_first_report.mjs` | 0 | 0 | `e1be24a7741f4f0b97ff4d17fed78690e06f7d22f7c363129a50317157b5b38d` | `e1be24a7741f4f0b97ff4d17fed78690e06f7d22f7c363129a50317157b5b38d` |

Targeted type check exited 0:

```text
node node_modules/typescript/bin/tsc --noEmit --strictNullChecks --allowImportingTsExtensions --module nodenext --moduleResolution nodenext --target es2022 --skipLibCheck packages/guard-core/src/mesr/repaired/independence.ts packages/guard-core/src/mesr/repaired/evaluateClaim.ts
```

Exploratory compiler settings exposed pre-existing errors only in protected admission/requirements/verificationEvent sources; no such files were changed. The explicit final null-safe command above passes. Git whitespace and exact-scope checks run before the implementation commit.

## Protected hashes and compatibility

All 1436 pre-existing paths outside the allowlist match the raw BEFORE hashes in controls.before.protected_hashes; Git also verifies inventory and unchanged protected paths against the entry commit. Frozen B09 files are checked against both freeze pins and committed blobs. Historical verifier/helper source prefixes and all old lifecycle guards remain intact. Controls file SHA-256: `66b9964ae0367d7994262faf825b4ce97b66267bc37bf53735155fdd12181bc0`.

| Changed implementation / verifier source | Accepted SHA-256 |
| --- | --- |
| `packages/guard-core/src/mesr/repaired/independence.ts` | `c8fd7dc7d694eadecafd7999c06a01e14d14bfbaade9a330a8d6b7e4c45e4fc7` |
| `packages/guard-core/src/mesr/repaired/evaluateClaim.ts` | `a024c07b4847396a55f1dc80a638aefdf8c286639edf4f836831b38ab9cd08bd` |
| `scripts/verify_v8_gate1_product_conformance.mjs` | `6d63fb353280c836d404164932d9ec389325d92854a0951c5ea9d4a812831462` |
| `scripts/gate1/b09-product-inputs.mjs` | `31c2453e24f405e178faee199133114fadd20a9f347b560c1576a053d4bbef65` |
| `scripts/gate1/b09-product-compare.mjs` | `34896dafda7e10e260639e004b8bc00a6b9ef137cf876ee3567e3cfb2698832f` |

PUBLIC_CONTRACT_DRIFT = NO. AUTHORITY_EXPANSION = NO. NEW_REGRESSION = 0.

Audit output/verdict/exit and deny exit 25 unchanged; permit and classify unchanged. EvidencePackV1, parser/validator, GovernanceReportModel, report/render/index serialization, reason-code values/order, exports, CLI, license gating/offline authority and v7.0.1 defaults remain unchanged. Recommendation-only, additive-only, non-executing, default-off; no authority scope expansion, execution permission, certification, institutional acceptance, runtime takeover, control-plane/dashboard or orchestration drift.

## Lifecycle, commit and rollback

PRE_COMMIT_IMPLEMENTATION requires HEAD exactly equal to the entry with pending paths confined to the eight-path allowlist. POST_COMMIT_ACCEPTED_IMPLEMENTATION requires one direct child of the entry, a clean tree, exactly the eight committed paths and reproduction of accepted semantic/result/source hashes. Executed lifecycle falsifiers reject later descendants, merge parents, ninth paths and dirty committed trees. Existing T2-01/T2-02 lifecycle guards were not relaxed; only separately attributed semantic replay returns are admitted by the T2-03 lane.

Create one implementation commit only after this PASS and exact-scope/whitespace checks. Suggested subject: `Implement T2-03 independent checking evidence`. Then run `node scripts/verify_v8_gate1_product_conformance.mjs --task T2-03` from the clean commit. This reruns semantic preservation and source/lifecycle checks; large T1/Core and 21-suite receipts are inherited unchanged, not falsely marked rerun. The implementation SHA and actual post-commit decision are reported in the task response. No amend of this accepted commit is authorized to repair a later lifecycle defect.

Rollback/stop if default-absent behavior changes, accepted T1/T2 hashes drift, any protected path changes, new regressions appear, witness/context fabrication grants support, the existing state owner/precedence is bypassed, or authority scope expands. A required ninth path means T2_03_IMPLEMENTATION_SCOPE_EXPANSION_REQUIRED; shared selector/state/Core changes require SPECIFICATION_REOPEN_REQUIRED. Validation blockage is distinct from a product regression. Reverting this isolated implementation commit is the bounded recovery, subject to explicit authorization; no historical evidence is rewritten.

G05 = CLOSED. G07 = OPEN. G06 = OPEN. G03 = OPEN. No current/continuing independence, G07 closure, Harness canonical integration, G03 closure or released V8 capability is claimed.
