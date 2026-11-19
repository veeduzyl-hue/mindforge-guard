# MindForge Guard Architecture v0.2.x — M3 DISCOVER / Mapping Draft synthetic v0.1

**Source and authorization:** Owner's 2026-11-19 bounded engineering continuation after PR #374; fixed parent **PR #374 head `11337880c7e97a1d2a274009ed28c36279f302c7`**. This is **DOCS + isolated experimental tests**, not a public product, frozen canonical contract, M4 case completion, production ingestion, sign/release authorization or M5 human validation.

## 1. Exact M3 v0.1.1 scope

The existing M3 design defines nine lifecycle stages: SELECT → INVENTORY → DISCOVER → DRAFT → REVIEW → CONFIRM → BUILD → VALIDATE → PACKAGE. PR #374 implemented the first two under a marked synthetic root. This candidate adds **only DISCOVER + DRAFT** after reusing the same actual inventory script through a child process. It does NOT create a Confirmation Record, a First Report Pack, a Review Bundle or a new Evidence type.

Mapping Draft `kind=mindforge_mapping_draft`, `version=0.1` is a **working artifact** only. Structural observations are not verified business truth. The First Report target id and version are `first-report-pack` and `single_agent_governance_pack_preview_v1`. Source locators use JSON Pointer for JSON fields; JSONL line number plus pointer; YAML/Markdown/TXT line ranges. They are bound to the corresponding Inventory `source_id` and `source_sha256`. No input values, user paths, filenames or private locator map are exported.

## 2. Guarded execution

Experimental script: `scripts/arch_v02x_m3_discover_draft_synthetic.mjs`. Both environment gates are mandatory:

```text
ARCH_V02X_M3_INVENTORY_SYNTHETIC_ONLY=1
ARCH_V02X_M3_INVENTORY_FIXTURE_ROOT=<absolute newly-marked disposable synthetic fixture root>
ARCH_V02X_M3_DISCOVER_SYNTHETIC_ONLY=1
```

Call syntax: `node scripts/arch_v02x_m3_discover_draft_synthetic.mjs --source <absolute synthetic source file-or-directory> --target-contract first-report-pack --format json`. **Do not use actual user files.** The fixed inventory script rejects unmarked, off-root, secret, symlink and unbounded sources. The discovery script re-enumerates the same top-level file set in inventory order, rechecks every source SHA-256 and size, checks reparse/symlink entries and fails closed on missing/changed/invalid sources. It is read-only and emits one JSON object to stdout. No external network, native signing, telemetry, file creation or source copy is performed by this script.

Current limits are **synthetic-only**, not frozen M3 policy: Inventory 32 directory entries / 4 MiB each / 16 MiB total; Discover 1,024 text lines, 64 JSONL events, 128 observations, 32 mapping suggestions; YAML text matching is intentionally **not a semantic YAML validator**. This does not establish robust production race prevention, Windows junction/hardlink or arbitrary malformed encoding support.

## 3. Structure-only extraction and conservative proposals

| Source | DISCOVER | DRAFT | Nonclaim |
| --- | --- | --- | --- |
| JSON | Allowlisted top-level key presence; JSON Pointer to key; bound source digest | `pack_id`, `pack_version`, `report_target` to `manifest.json` and `agent_id`, `agent_name`, `agent_type` to `agent-profile.json` only for designated synthetic layouts | No values exported, fields are only `declared`, not authenticated |
| JSONL | Bounded JSONL object lines, observed `event_type` / `tool` / `action` / `timestamp`, with exact line and pointer | **None** from tool events | Observed tool execution NEVER implies allowed tool/authorization |
| YAML | Allowlisted line-level keys, line start/end | `tool_name` under designated synthetic `tools.yaml` creates ordered `tools.yaml#/tools/N/tool_name` *suggestions only* | No full YAML semantics, no permission claim |
| Markdown / TXT | Heading line only, without heading content | **None** | No AI semantic extraction or natural-language intent inference |
| Binary / unknown | Inventory remains `inventory_only` | **None** | No PDF/image or opaque extractor |

Mappings carry `mapping_item_id`, `source_id`, `source_sha256`, `source_locator`, `target_locator`, `semantic_class`, `field_state`, `mapping_status`, `transformation_id`, `loss_notes`, and `requires_human_confirmation=true`. If two candidates target the same field, both remain `ambiguous` with a matching loss note; no first-wins rule. The draft reports `confirmed=0` and `confirmation_record=NOT_CREATED`. Business owner, review owner, task intent, control objectives, authorization, permitted/prohibited actions, policy and sensitivity remain hard human-confirmation fields.

## 4. Separate test identities and evidence quality

`scripts/verify_arch_v02x_m3_discover_draft_synthetic.mjs` creates an ephemeral synthetic fixture based on the repository's fixed HR example. The test cases `M3D-01..M3D-19` include missing opt-in, normal structural mapping, JSON Pointer, YAML suggestions, observed JSONL, heading redaction, authority separation, conflicting mapping, malformed JSON/JSONL, JSONL count bounds, repeatability, opaque files, excluded secrets, path/mode refusals, invalid UTF-8 and symlink refusal where the CI host supports construction.

**M3D IDs are NOT original M4 cases.** The M4 v0.1.1 **62/62 tests remain `NOT RUN`**; this synthetic supporting evidence does not silently close M4 `REL`, `CLI`, `BND` or release scenarios. No real user, customer files, new contract schema, input Pack build or output Bundle is tested.

Run the two test suites within a pinned checkout (on CI or otherwise only within disposable synthetic fixtures):

```shell
node scripts/verify_arch_v02x_m3_source_inventory_synthetic.mjs
node scripts/verify_arch_v02x_m3_discover_draft_synthetic.mjs
```

CI keeps the existing v7.0.1 compatibility checks and checks no new worktree changes from the M3 scripts. Linux may see the previously observed `npm ci`-only executable-bit change to `packages/guard/bin/guard.mjs`; this is accepted only if indexed mode and exact content digest match and no other path is modified.

## 5. Next step is separate human REVIEW / CONFIRM design

To close the next life-cycle gate, build an explicit Review UI/document that displays source locators and unconfirmed fields, then a distinct human Confirmation Record and its limits. Confirmation must not silently become verified identity, organizational authority, producer attestation or a Guard approval. Canonical Pack building and `guard review --source` public CLI integration remain unavailable until separate Owner authorization and tests.

## 6. Preserved stop boundaries

```text
M3_DISCOVER_DRAFT=ISOLATED_SYNTHETIC_CANDIDATE_ONLY
M3_CONFIRMATION_RECORD=NOT_CREATED
M3_BUILD_VALIDATE_PACKAGE=NOT_IMPLEMENTED
M2_PUBLIC_SOURCE_CLI=NOT_AUTHORIZED
M4_ORIGINAL_62=NOT_RUN
M5_HUMAN_FIRST_USER=NOT_TESTED
OR_01_TO_05=UNCHANGED
SIGNED_ADDON_DISTRIBUTION=DEFERRED_NOT_ESTABLISHED
WIN11_X64_SIGNED_NATIVE_POSITIVE=NOT_RUN
T2_FORMAL_CLOSURE=BLOCKED
S04_FACTUAL_ADMISSION=UNRESOLVED
G03_IMPLEMENTATION=FROZEN
SEBBI=HOLD
NO_MAIN_MERGE
NO_RELEASE
NO_CUSTOMER_DATA
NO_SCHEMA_OR_LICENSE_CHANGE
```

**No downstream action is implied by an experimental CI PASS.**
