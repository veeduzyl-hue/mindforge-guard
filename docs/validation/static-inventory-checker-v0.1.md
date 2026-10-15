# Static Assertion / Route Inventory Checker v0.1

This is an independent, offline, synthetic-data-only tool spike.
It does not integrate with or execute MindForge Guard.

## Assurance boundary

PASS means only STATIC_INVENTORY_STRUCTURE_VALID.
Every checker result includes ASSURANCE_NOT_EVALUATED.

PASS does not establish:
- ASSERTION_INVENTORY_COMPLETE
- ROUTE_INVENTORY_COMPLETE
- BEFORE_CAPTURE_COMPLETE
- EXECUTION_COVERAGE_COMPLETE
- VERIFIER_INDEPENDENCE_ESTABLISHED
- T2_FORMAL_CLOSURE_PASS
- SUCCESSOR_GATE_ACCEPTED

A structurally consistent COMPLETE / complete=true declaration may pass.
That validates declaration consistency only, not real completeness.
No Authority Admission, source authenticity, evidence sufficiency,
execution, independent verification, acceptance, or governance decision occurs.

## Local synthetic contract

schema_version must equal static-inventory-contract/v0.1.

Required top-level fields:
schema_version, inventory_status, complete, assertions, routes,
applicability, multiplicity.

inventory_status accepts PARTIAL, COMPLETE, UNKNOWN, or null.
complete accepts boolean, UNKNOWN, or null.
PARTIAL requires complete=false.
COMPLETE requires complete=true.
complete=true requires COMPLETE and prohibits UNKNOWN/null anywhere.

Every assertion requires:
assertion_id, case_id, evidence_domain, owner, source_ref,
source_pointer, assertion_site, iteration_key, expected_ref,
comparator_route_ref, control_route_ref, applicability.

assertion_id and route_id are nonempty, trimmed input identifiers.
They cannot be UNKNOWN or null.
The checker does not allocate formal Assertion or Route IDs.

Duplicate assertion_id, duplicate seven-element descriptors, and duplicate
route_id fail. Descriptor object-member order does not affect equality.

source_ref and expected_ref are:
{ "artifact_id": "synthetic identifier", "pointer": "/json/pointer" }

iteration_key is:
{ "scope": "synthetic scope", "value": "synthetic iteration identity" }

source_pointer and reference pointers use JSON Pointer syntax:
empty string or slash-prefixed string; tilde escapes must be ~0 or ~1.

UNKNOWN/null may preserve unresolved descriptors, reference values,
iteration values, applicability, or counts in a PARTIAL inventory.
A missing required field always fails.
UNKNOWN/null are never filled or converted into known values.
Known identity strings must be nonempty and trimmed.

Every route requires route_id, route_kind, source_ref.
route_kind is COMPARATOR or CONTROL.
Known assertion route references must resolve to the corresponding kind.
Unresolved references remain unresolved in PARTIAL input.

Assertion applicability accepts APPLICABLE, NOT_APPLICABLE,
UNKNOWN, or null.

Top-level applicability requires status and applicable_assertion_count.
Known applicable_assertion_count equals the number of assertions explicitly
marked APPLICABLE. It is not a claim about undiscovered assertions.
APPLICABLE status requires at least one explicit applicable assertion.
NOT_APPLICABLE status prohibits applicable or unresolved assertions.

multiplicity requires assertion_count and route_count.
Known counts are nonnegative safe integers equal to the supplied array lengths.
These are supplied-record counts, not real-world completeness claims.

Unsupported fields and malformed structures fail closed.
Only supplied JSON structure and local relationships are checked.
Artifact references are not opened or resolved.

## Input limitations

Duplicate JSON member names are UNSUPPORTED AND PROHIBITED input.

The reader uses JSON.parse, which does not detect duplicate member names.
Therefore JSON.parse success is not strict duplicate-key validation.
Such input may lose earlier members before structural validation.
PASS cannot establish absence of duplicate JSON member names.

Use only trusted, bounded, locally created synthetic JSON.
No streaming parser, resource isolation, or adversarial-input resource bound
is implemented in v0.1. Do not use PASS as security approval for untrusted JSON.

## Execution

Checker accepts exactly one explicit JSON file.
Output is one JSON object plus LF, without timestamps or input-path details.

Exit codes:
- 0: structure valid
- 1: parse or structure failure
- 2: usage or read failure

Errors use deterministic path/code ordering.
The checker does not mutate input or write files.

The verifier's default mode reads the 22 exact synthetic fixtures,
runs each CLI input twice, compares output bytes and exit status,
and reads back both scripts, this document, and all fixtures to report
actual byte lengths and SHA-256 hashes on stdout.

--create-fixtures explicitly creates only synthetic JSON under
tests/fixtures/static-inventory-contract-v0.1.
The exact authorized root must already exist.
Existing differing fixture files are not overwritten.
Fixture creation and verification are separate invocations.

## Validation recorded during this session

Both scripts passed node --check through stdin.
In-memory tests passed: 3 positive fixtures and 19 negative fixtures.
Additional read-error and invalid-UTF-8 tests passed.
Repeated serialized outputs matched; inputs remained unchanged.

The input-reader tests injected synthetic bytes into the same reader function.
They did not exercise native filesystem reads.

The designated root was absent and outside sandbox writable roots.
No disk files were created.
Disk CLI tests, file readback, and file SHA-256 verification were not executed.
No disk-completion claim is recorded.

MindForge Guard audit output/verdict/exit, deny exit code 25,
permit, classify, license behavior, and released contracts remain unchanged.
Recommendation-only, additive-only, non-executing, default-off posture
and authority scope remain unchanged.
No governance status was changed.

## Clean-main portable candidate note

The verifier derives its workspace root from its own `import.meta.url`
(`scripts/..`) instead of a machine-specific drive, username or directory.
The original offline acceptance report above remains historical and unchanged.
The verifier is opt-in and synthetic-data-only; `--create-fixtures` is the
only code path that writes synthetic inputs. No Guard product code is imported.

Portability does not change the three existing limitations: duplicate JSON
member names are not detected by `JSON.parse`, untrusted large inputs have no
resource-safety guarantee, and source authenticity or execution coverage is
not verified. `STATIC_INVENTORY_STRUCTURE_VALID` does not confer assurance;
`ASSURANCE_NOT_EVALUATED` remains mandatory.

The clean-main candidate requires its own `node --check`, disk CLI, repeated
output, Git diff and public-content checks before any commit or PR decision.
