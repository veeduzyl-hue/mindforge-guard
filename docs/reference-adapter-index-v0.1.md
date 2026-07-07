# Reference Adapter Index v0.1

## Core Positioning

A reference adapter demonstrates how an external evidence source can be mapped into Guard's verification framework. It does not define the framework, own the contract, or create a privileged dependency.

ramen is a reference adapter, not a privileged dependency.

ramen issues. Guard verifies.

The boundary remains:

- Guard independently verifies external runtime evidence.
- External systems issue evidence. Guard verifies evidence.
- Guard findings are recommendation-only.
- Guard reports are additive.
- Guard does not issue, approve, block, execute, certify, or control runtime actions.

## 1. Purpose

The Reference Adapter Index exists to keep known adapter mappings visible without allowing any single issuer or receipt family to define Guard's architecture.

The index is needed to:

- document known external evidence source mappings
- keep adapters subordinate to the generalized framework
- prevent one issuer from defining Guard's architecture
- provide review-stage implementation references without changing Guard's boundary

The index is architecture-first.
It documents how adapters relate to the framework and what they are expected to map, without turning the index into a runtime integration surface or vendor announcement channel.

## 2. Reference Adapter Boundary

A reference adapter is not:

- a privileged dependency
- a product integration announcement
- a runtime control relationship
- a certification pathway
- the source of truth for Guard's contract
- required for other adapters to exist

This boundary is necessary because reference adapters are close to issuer-specific evidence.
If left unconstrained, they can drift into product-center narratives or appear to own framework semantics.

In `v0.1`, a reference adapter exists only to demonstrate bounded mapping into Guard's verification framework.
It does not create authority, default runtime coupling, or vendor preference.

## 3. Relationship to External Evidence Framework

Every reference adapter must map into the generalized Guard framework rather than redefine it.

That means each adapter should align with:

- External Receipt Contract
- Normalized Evidence Record
- Verification Findings Taxonomy
- Guard report language boundary

The adapter may translate source-specific evidence into these framework surfaces.
It may not alter the framework's upper-layer contracts, rename their semantics into vendor-specific authority language, or replace them with issuer-owned definitions.

Framework consequence:

- the contract remains Guard-owned
- the normalized record remains Guard-owned
- the taxonomy remains Guard-owned
- report language boundaries remain Guard-owned

## 4. Adapter Lifecycle Status

The adapter lifecycle status vocabulary in `v0.1` should include:

- `draft`
- `spike`
- `review-stage`
- `reference`
- `deprecated`

### `draft`

- Meaning: the adapter idea or mapping boundary is being described but is not yet sufficiently reviewed.

### `spike`

- Meaning: the adapter has exploratory work or provisional mapping logic associated with it.

### `review-stage`

- Meaning: the adapter is being reviewed for bounded semantic alignment with Guard's framework.
- Important boundary: `review-stage` does not mean production certification.

### `reference`

- Meaning: the adapter is suitable to serve as a documented example of how an external source can be mapped into the framework.
- Important boundary: `reference` does not mean privileged.

### `deprecated`

- Meaning: the adapter should not be treated as the preferred current example for forward-looking documentation or mapping work.
- Important boundary: `deprecated` does not automatically invalidate historical evidence that was already issued.

## 5. Adapter Registry Fields

Each adapter index entry should contain at least:

- `adapter_name`
- `external_source`
- `adapter_status`
- `source_version`
- `supported_receipt_version`
- `contract_mapping_status`
- `normalized_record_mapping_status`
- `findings_mapping_status`
- `report_language_status`
- `known_limitations`
- `review_notes`

### Field Semantics

- `adapter_name`: the stable name of the adapter entry inside Guard's documentation or mapping layer.
- `external_source`: the external evidence source family being mapped.
- `adapter_status`: the lifecycle state of the adapter in the index.
- `source_version`: the external source version context relevant to the mapping.
- `supported_receipt_version`: the receipt or evidence version that the adapter entry is designed to interpret.
- `contract_mapping_status`: whether and how the adapter maps into the External Receipt Contract.
- `normalized_record_mapping_status`: whether and how the adapter maps into the Normalized Evidence Record.
- `findings_mapping_status`: whether and how the adapter maps into the Verification Findings Taxonomy.
- `report_language_status`: whether the adapter's output semantics stay inside Guard's report-language boundary.
- `known_limitations`: bounded visibility into what the adapter does not fully support or intentionally leaves incomplete.
- `review_notes`: reviewer-facing notes that preserve current interpretation without expanding runtime authority.

## 6. Current Reference Adapters

The current `v0.1` index contains one first reference adapter entry.
It is a framework example, not a product center.

### ramen receipt v5

- `adapter_name`: `ramen-receipt-v5`
- `external_source`: `ramen`
- `adapter_status`: `reference`
- `source_version`: `ramen receipt family`
- `supported_receipt_version`: `v5`
- `boundary`: `ramen issues. Guard verifies.`
- `role`: demonstrates signed runtime receipt verification
- `status`: review-stage reference adapter
- `limitation`: does not define the generalized External Evidence Framework

ramen is a reference adapter, not a privileged dependency.

This entry exists because ramen `v5` is the first bounded example of an external source that can be mapped into Guard's framework.
It is useful as a reference because it demonstrates contract mapping, normalized record mapping, findings mapping, and report-language alignment.

It is not the product center of Guard.
It does not own the generalized framework.
It does not imply that future adapters must inherit ramen-specific assumptions.

## 7. Mapping Expectations

Each reference adapter should provide bounded visibility into how it maps source-specific evidence into the Guard framework.

Expected mapping outputs include:

- receipt contract mapping
- normalized evidence record mapping
- findings taxonomy mapping
- sample evidence records
- sample Guard report language
- known non-compatible cases
- verification limitations

These expectations exist so a reviewer can understand how the adapter fits within the Guard framework without requiring runtime code or productized integration behavior.

## 8. What Reference Adapters Must Not Do

Reference adapters must not:

- approve actions
- block actions
- execute runtime changes
- mutate upstream state
- override Guard contract semantics
- hide failed evidence
- define compliance status
- imply certification

These constraints preserve Guard's existing posture:

- recommendation-only
- additive-only
- non-executing
- verification-only
- human-review-oriented

## 9. Review Notes for ramen V5

The current review understanding for ramen `v5` should be:

- V5 receipt semantics aligned
- adapter evidence semantics aligned
- corrected taxonomy aligned
- sample findings aligned
- evidence records aligned
- Guard report language aligned
- suitable as first reference adapter
- not suitable as product-center narrative

These notes should be read as architecture and review observations only.
They are not a product launch announcement, not a privileged partnership statement, and not a runtime integration claim.

## 10. Future Adapter Candidates

Future candidates should be described as evidence-source types rather than product commitments.

Potential future external evidence source types include:

- CI/CD execution receipts
- agent action receipts
- policy engine decision artifacts
- external verifier outputs
- runtime provenance records
- deployment evidence packs
- tool invocation receipts

This list is directional only.
It identifies the kinds of sources the framework may later support without promising implementation scope in `v0.1`.

## 11. Non-Goals

The Reference Adapter Index does not include:

- no adapter marketplace in `v0.1`
- no runtime plugin execution
- no trust registry
- no certification program
- no policy enforcement layer
- no privileged vendor relationship
- no automatic deployment approval

The index remains a documentation and boundary artifact.
It does not become a platform shell, integration catalog, or hidden control surface.

## 12. Open Questions

Open questions for later bounded phases include:

- adapter conformance tests
- adapter versioning
- source issuer trust metadata
- public key discovery
- mapping drift over time
- historical adapter compatibility
- multi-adapter correlation
- sample fixture governance

These questions should remain future hardening questions rather than pull `v0.1` into runtime control, certification language, or privileged-source semantics.
