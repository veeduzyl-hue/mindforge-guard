import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";

const {
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONTRACT_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONTRACT_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_SCOPE_CURRENT_CLOSURE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_STATUS_PACKAGED,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SCOPE_CURRENT_PACKAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_STATUS_AVAILABLE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_ORDER,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SURFACE_MAP,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageContract,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageExplanation,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageExplanationContract,
  consumeGovernanceCaseReviewDecisionClosureEvidencePackageExplanation,
} = permitExports;

await import("./verify_governance_case_review_decision_closure_evidence_package_boundary.mjs");

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertRejected(factory, expectedFragment, message) {
  let rejected = false;
  try {
    factory();
  } catch (error) {
    if (String(error.message).includes(expectedFragment)) {
      rejected = true;
    } else {
      throw error;
    }
  }
  if (!rejected) throw new Error(message);
}

function buildPackageFixture() {
  return {
    kind: GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_KIND,
    version: GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_VERSION,
    schema_id:
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_SCHEMA_ID,
    canonical_action_hash:
      "sha256:111122223333444455556666777788889999aaaabbbbccccddddeeeeffff0000",
    governance_case_review_decision_closure_evidence_package: {
      stage: GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_STAGE,
      consumer_surface:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMER_SURFACE,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_BOUNDARY,
      closure_evidence_package_ref: {
        package_id: "receipt-1:package",
        receipt_id: "receipt-1",
        receipt_selection_id: "receipt-selection-1",
        explanation_id: "closure-explanation-1",
        explanation_selection_id: "closure-explanation-selection-1",
        closure_id: "closure-1",
        closure_selection_id: "closure-selection-1",
        case_id: "case-1",
        review_decision_id: "review-decision-1",
        attestation_id: "attestation-1",
        current_selection_id: "current-selection-1",
      },
      package_manifest: {
        package_status:
          GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_STATUS_PACKAGED,
        package_scope:
          GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_SCOPE_CURRENT_CLOSURE,
        package_envelope: {
          manifest_version: "v1",
          delivery_surface: "closure_receipt_evidence_package",
          included_artifact_count: 3,
        },
        included_artifact_ids: ["closure-1", "closure-explanation-1", "receipt-1"],
        included_artifacts: [
          {
            artifact_id: "closure-1",
            artifact_kind:
              "governance_case_review_decision_attestation_applicability_closure",
            role: "closure_foundation",
          },
          {
            artifact_id: "closure-explanation-1",
            artifact_kind:
              "governance_case_review_decision_attestation_closure_explanation",
            role: "closure_explanation",
          },
          {
            artifact_id: "receipt-1",
            artifact_kind:
              "governance_case_review_decision_attestation_closure_receipt",
            role: "closure_receipt",
          },
        ],
        package_basis: {
          package_reason_codes: [
            "closure_available",
            "closure_explanation_available",
            "closure_receipt_available",
            "current_receipt_selected",
            "current_receipt_selection_stable",
            "current_closure_selected",
            "current_explanation_selected",
            "current_explanation_selection_stable",
            "package_manifest_complete",
            "package_composition_bounded",
            "package_export_stable",
            "supporting_basis_complete",
          ],
          receipt_available: true,
          closure_available: true,
          closure_explanation_available: true,
          current_receipt_selected: true,
          current_receipt_selection_stable: true,
          current_closure_selected: true,
          current_explanation_selected: true,
          current_explanation_selection_stable: true,
          package_manifest_complete: true,
          package_composition_bounded: true,
          package_export_stable: true,
          supporting_basis_complete: true,
          package_linkage_only: true,
          consumption_boundary_bounded: true,
          aggregate_export_only: true,
          permit_aggregate_export_only: true,
        },
      },
      validation_exports: {
        receipt_required: true,
        closure_required: true,
        closure_explanation_required: true,
        current_receipt_selected_only: true,
        unique_current_receipt_required: true,
        current_receipt_selection_stable: true,
        current_closure_selected_only: true,
        current_explanation_selected_only: true,
        package_manifest_complete: true,
        package_composition_bounded: true,
        package_export_stable: true,
        package_linkage_only: true,
        consumption_boundary_bounded: true,
        cross_case_binding_rejected: true,
        cross_review_decision_binding_rejected: true,
        cross_canonical_action_hash_binding_rejected: true,
        complete_supporting_linkage_required: true,
        aggregate_export_only: true,
        permit_aggregate_export_only: true,
      },
      preserved_semantics: {
        derived_only: true,
        supporting_artifact_only: true,
        non_authoritative: true,
        recommendation_only: true,
        additive_only: true,
        non_executing: true,
        default_off: true,
        judgment_source_enabled: false,
        authority_source_enabled: false,
        execution_binding_enabled: false,
        risk_source_enabled: false,
        main_path_takeover: false,
        authority_scope_expansion: false,
        governance_object_addition: false,
        ui_control_plane: false,
      },
    },
    deterministic: true,
    enforcing: false,
  };
}

const packageProfile = buildPackageFixture();
const packageContract =
  buildGovernanceCaseReviewDecisionClosureEvidencePackageContract({
    governanceCaseReviewDecisionClosureEvidencePackageProfile: packageProfile,
  });
if (
  packageContract.kind !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONTRACT_KIND ||
  packageContract.version !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONTRACT_VERSION ||
  packageContract.boundary !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONTRACT_BOUNDARY
) {
  throw new Error("review decision closure evidence package fixture contract drifted");
}

const profile =
  buildGovernanceCaseReviewDecisionClosureEvidencePackageExplanation({
    governanceCaseReviewDecisionClosureEvidencePackageProfile: packageProfile,
  });
const contract =
  buildGovernanceCaseReviewDecisionClosureEvidencePackageExplanationContract({
    governanceCaseReviewDecisionClosureEvidencePackageExplanationProfile:
      profile,
  });
const consumed =
  consumeGovernanceCaseReviewDecisionClosureEvidencePackageExplanation({
    governanceCaseReviewDecisionClosureEvidencePackageExplanationProfile:
      profile,
    governanceCaseReviewDecisionClosureEvidencePackageExplanationContract:
      contract,
  });
const payload =
  profile.governance_case_review_decision_closure_evidence_package_explanation;

if (
  profile.kind !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_KIND ||
  profile.version !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_VERSION ||
  profile.schema_id !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_SCHEMA_ID ||
  payload.stage !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_STAGE ||
  payload.boundary !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_BOUNDARY ||
  payload.consumer_surface !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONSUMER_SURFACE ||
  payload.explanation_context.explanation_status !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_STATUS_AVAILABLE ||
  payload.explanation_context.explanation_scope !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SCOPE_CURRENT_PACKAGE
) {
  throw new Error(
    "review decision closure evidence package explanation profile envelope drifted"
  );
}

if (
  contract.kind !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_KIND ||
  contract.version !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_VERSION ||
  contract.boundary !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_BOUNDARY
) {
  throw new Error(
    "review decision closure evidence package explanation contract envelope drifted"
  );
}

if (
  JSON.stringify(consumed.narrative_section_ids) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_ORDER
    ) ||
  consumed.supporting_artifact_only !== true ||
  consumed.non_authoritative !== true ||
  consumed.additive_only !== true ||
  consumed.non_executing !== true ||
  consumed.default_off !== true
) {
  throw new Error(
    "review decision closure evidence package explanation summary drifted"
  );
}

const canonicalSections =
  payload.explanation_context.narrative_structure.narrative_sections;
if (
  canonicalSections.length !== 5 ||
  JSON.stringify(canonicalSections[0].artifact_refs) !==
    JSON.stringify(["receipt-1:package"]) ||
  JSON.stringify(canonicalSections[1].artifact_refs) !==
    JSON.stringify(["closure-1", "closure-explanation-1", "receipt-1"]) ||
  JSON.stringify(canonicalSections[2].artifact_refs) !==
    JSON.stringify(["closure-1"]) ||
  JSON.stringify(canonicalSections[3].artifact_refs) !==
    JSON.stringify(["receipt-1", "closure-explanation-1"]) ||
  JSON.stringify(canonicalSections[4].artifact_refs) !==
    JSON.stringify(["closure-explanation-1"])
) {
  throw new Error(
    "review decision closure evidence package explanation canonical narrative bindings drifted"
  );
}

assertRejected(
  () =>
    buildGovernanceCaseReviewDecisionClosureEvidencePackageExplanation({
      governanceCaseReviewDecisionClosureEvidencePackageProfile: null,
    }),
  "profile must be an object",
  "review decision closure evidence package explanation must reject missing package"
);

assertRejected(() => {
  const mismatched = cloneJson(packageProfile);
  mismatched.governance_case_review_decision_closure_evidence_package.package_manifest.included_artifacts[0].role =
    "authority_surface";
  return buildGovernanceCaseReviewDecisionClosureEvidencePackageExplanation({
    governanceCaseReviewDecisionClosureEvidencePackageProfile: mismatched,
  });
}, "bounded narrative artifact roles", "review decision closure evidence package explanation must reject malformed package role shape");

assertRejected(() => {
  const drifted = cloneJson(profile);
  drifted.governance_case_review_decision_closure_evidence_package_explanation.explanation_context.narrative_structure.narrative_sections[0].artifact_refs_alias =
    drifted.governance_case_review_decision_closure_evidence_package_explanation.explanation_context.narrative_structure.narrative_sections[0].artifact_refs;
  delete drifted.governance_case_review_decision_closure_evidence_package_explanation.explanation_context.narrative_structure.narrative_sections[0].artifact_refs;
  permitExports.assertValidGovernanceCaseReviewDecisionClosureEvidencePackageExplanationProfile(
    drifted
  );
}, "field order drifted", "review decision closure evidence package explanation must reject section field name drift");

assertRejected(() => {
  const drifted = cloneJson(profile);
  delete drifted.governance_case_review_decision_closure_evidence_package_explanation.explanation_context.narrative_structure.narrative_sections[0].title;
  permitExports.assertValidGovernanceCaseReviewDecisionClosureEvidencePackageExplanationProfile(
    drifted
  );
}, "field order drifted", "review decision closure evidence package explanation must reject missing section field");

assertRejected(() => {
  const drifted = cloneJson(profile);
  drifted.governance_case_review_decision_closure_evidence_package_explanation.explanation_context.narrative_structure.narrative_sections[0].extra_field =
    true;
  permitExports.assertValidGovernanceCaseReviewDecisionClosureEvidencePackageExplanationProfile(
    drifted
  );
}, "field order drifted", "review decision closure evidence package explanation must reject extra section field");

assertRejected(() => {
  const drifted = cloneJson(profile);
  drifted.governance_case_review_decision_closure_evidence_package_explanation.explanation_context.narrative_structure.narrative_sections[0].section_id =
    "supporting_evidence";
  permitExports.assertValidGovernanceCaseReviewDecisionClosureEvidencePackageExplanationProfile(
    drifted
  );
}, "section id drifted", "review decision closure evidence package explanation must reject section id misalignment");

assertRejected(() => {
  const drifted = cloneJson(profile);
  drifted.governance_case_review_decision_closure_evidence_package_explanation.explanation_context.narrative_structure.narrative_sections[0].interpretation_surface =
    "bounded_supporting_evidence";
  permitExports.assertValidGovernanceCaseReviewDecisionClosureEvidencePackageExplanationProfile(
    drifted
  );
}, "interpretation surface drifted", "review decision closure evidence package explanation must reject interpretation surface mismatch");

assertRejected(() => {
  const drifted = cloneJson(profile);
  drifted.governance_case_review_decision_closure_evidence_package_explanation.explanation_context.narrative_structure.narrative_sections[0].artifact_refs =
    [];
  permitExports.assertValidGovernanceCaseReviewDecisionClosureEvidencePackageExplanationProfile(
    drifted
  );
}, "artifact refs drifted", "review decision closure evidence package explanation must reject empty artifact refs");

assertRejected(() => {
  const drifted = cloneJson(profile);
  drifted.governance_case_review_decision_closure_evidence_package_explanation.explanation_context.narrative_structure.narrative_sections[0].artifact_refs =
    ["", 7];
  permitExports.assertValidGovernanceCaseReviewDecisionClosureEvidencePackageExplanationProfile(
    drifted
  );
}, "artifact refs drifted", "review decision closure evidence package explanation must reject invalid artifact ref members");

assertRejected(() => {
  const drifted = cloneJson(profile);
  drifted.governance_case_review_decision_closure_evidence_package_explanation.preserved_semantics.authority_source_enabled =
    true;
  permitExports.assertValidGovernanceCaseReviewDecisionClosureEvidencePackageExplanationProfile(
    drifted
  );
}, "authority_source_enabled=false", "review decision closure evidence package explanation profile validator must reject authority drift");

assertRejected(() => {
  const drifted = cloneJson(contract);
  drifted.main_path_takeover = true;
  permitExports.assertValidGovernanceCaseReviewDecisionClosureEvidencePackageExplanationContract(
    drifted
  );
}, "main_path_takeover", "review decision closure evidence package explanation contract validator must reject main-path drift");

const surfaceEntry =
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SURFACE_MAP.governance_case_review_decision_closure_evidence_package_explanation;
if (
  !surfaceEntry ||
  surfaceEntry.supporting_artifact_only !== true ||
  surfaceEntry.interpretation_surface_bounded !== true ||
  surfaceEntry.narrative_sections_complete !== true ||
  surfaceEntry.main_path_takeover !== false
) {
  throw new Error(
    "review decision closure evidence package explanation export surface drifted"
  );
}

for (const exportName of [
  "buildGovernanceCaseReviewDecisionClosureEvidencePackageExplanation",
  "buildGovernanceCaseReviewDecisionClosureEvidencePackageExplanationContract",
  "consumeGovernanceCaseReviewDecisionClosureEvidencePackageExplanation",
  "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SURFACE_MAP",
]) {
  if (!(exportName in permitExports)) {
    throw new Error(
      `review decision closure evidence package explanation permit export missing: ${exportName}`
    );
  }
}

process.stdout.write(
  "governance case review decision closure evidence package explanation boundary verified\n"
);
