import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";

const {
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SCOPE_CURRENT_PACKAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_ORDER,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SELECTION_MODE_CURRENT,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SURFACE_MAP,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageExplanation,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageExplanationContract,
  consumeGovernanceCaseReviewDecisionClosureEvidencePackageExplanation,
  validateGovernanceCaseReviewDecisionClosureEvidencePackageExplanationContract,
} = permitExports;

await import("./verify_governance_case_review_decision_closure_evidence_package_explanation_boundary.mjs");

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
    kind: "governance_case_review_decision_closure_evidence_package_profile",
    version: "v1",
    schema_id:
      "mindforge/governance-case-review-decision-closure-evidence-package-profile/v1",
    canonical_action_hash:
      "sha256:111122223333444455556666777788889999aaaabbbbccccddddeeeeffff0000",
    governance_case_review_decision_closure_evidence_package: {
      stage:
        "governance_case_review_decision_closure_evidence_package_boundary_phase2_v6_7_0",
      consumer_surface:
        "guard.audit.governance_case_review_decision_closure_evidence_package",
      boundary:
        "governance_case_review_decision_closure_evidence_package_boundary_contract",
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
        package_status: "packaged",
        package_scope: "current_closure_supporting_evidence_package_only",
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

if (
  contract.kind !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_KIND ||
  contract.version !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_VERSION ||
  contract.boundary !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONTRACT_BOUNDARY
) {
  throw new Error(
    "review decision closure evidence package explanation hardening contract envelope drifted"
  );
}

for (const field of [
  "current_narrative_selected_only",
  "unique_current_narrative_required",
  "current_narrative_selection_stable",
  "narrative_section_alignment_stable",
  "section_artifact_binding_stable",
  "section_consumer_consistency_stable",
  "cross_surface_alignment_stable",
  "consumption_boundary_bounded",
  "aggregate_export_only",
  "permit_aggregate_export_only",
]) {
  if (contract[field] !== true) {
    throw new Error(
      `review decision closure evidence package explanation hardening contract drifted: ${field}`
    );
  }
}

for (const field of [
  "permit_lane_consumption",
  "audit_path_dependency",
  "main_path_takeover",
  "authority_scope_expansion",
  "new_governance_authority_object",
]) {
  if (contract[field] !== false) {
    throw new Error(
      `review decision closure evidence package explanation hardening contract drifted: ${field}`
    );
  }
}

if (
  consumed.narrative_selection_mode !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SELECTION_MODE_CURRENT ||
  consumed.current_narrative_selected !== true ||
  consumed.current_narrative_selection_stable !== true ||
  consumed.narrative_section_alignment_stable !== true ||
  consumed.section_artifact_binding_stable !== true ||
  consumed.section_consumer_consistency_stable !== true ||
  consumed.cross_surface_alignment_stable !== true ||
  JSON.stringify(consumed.narrative_section_ids) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_ORDER
    )
) {
  throw new Error(
    "review decision closure evidence package explanation hardening consumer summary drifted"
  );
}

assertRejected(() => {
  const drifted = cloneJson(profile);
  drifted.governance_case_review_decision_closure_evidence_package_explanation.explanation_context.explanation_basis.current_narrative_selection_stable =
    false;
  permitExports.assertValidGovernanceCaseReviewDecisionClosureEvidencePackageExplanationProfile(
    drifted
  );
}, "current_narrative_selection_stable=true", "review decision closure evidence package explanation must reject unstable current narrative selection");

assertRejected(() => {
  const drifted = cloneJson(profile);
  drifted.governance_case_review_decision_closure_evidence_package_explanation.explanation_context.narrative_structure.narrative_selection_mode =
    "narrative_selection_mode_other";
  permitExports.assertValidGovernanceCaseReviewDecisionClosureEvidencePackageExplanationProfile(
    drifted
  );
}, "narrative structure drifted", "review decision closure evidence package explanation must reject narrative selection mode drift");

assertRejected(() => {
  const drifted = cloneJson(profile);
  drifted.governance_case_review_decision_closure_evidence_package_explanation.validation_exports.section_consumer_consistency_stable =
    false;
  permitExports.assertValidGovernanceCaseReviewDecisionClosureEvidencePackageExplanationProfile(
    drifted
  );
}, "section_consumer_consistency_stable=true", "review decision closure evidence package explanation must reject consumer consistency drift");

assertRejected(() => {
  const mismatched = cloneJson(contract);
  mismatched.closure_evidence_package_explanation_profile_ref.narrative_selection_id =
    "receipt-1:package:narrative:other";
  consumeGovernanceCaseReviewDecisionClosureEvidencePackageExplanation({
    governanceCaseReviewDecisionClosureEvidencePackageExplanationProfile:
      profile,
    governanceCaseReviewDecisionClosureEvidencePackageExplanationContract:
      mismatched,
  });
}, "aligned", "review decision closure evidence package explanation consumer must reject narrative selection mismatch");

assertRejected(() => {
  const drifted = cloneJson(contract);
  drifted.cross_surface_alignment_stable = false;
  const validation =
    validateGovernanceCaseReviewDecisionClosureEvidencePackageExplanationContract(
      drifted
    );
  if (validation.ok) {
    throw new Error("expected invalid contract");
  }
  throw new Error(validation.errors.join("; "));
}, "cross_surface_alignment_stable", "review decision closure evidence package explanation contract validator must reject cross-surface alignment drift");

const surfaceEntry =
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SURFACE_MAP.governance_case_review_decision_closure_evidence_package_explanation;
if (
  !surfaceEntry ||
  surfaceEntry.current_narrative_selected_only !== true ||
  surfaceEntry.unique_current_narrative_required !== true ||
  surfaceEntry.current_narrative_selection_stable !== true ||
  surfaceEntry.narrative_section_alignment_stable !== true ||
  surfaceEntry.section_artifact_binding_stable !== true ||
  surfaceEntry.section_consumer_consistency_stable !== true ||
  surfaceEntry.cross_surface_alignment_stable !== true ||
  surfaceEntry.permit_lane_consumption !== false ||
  surfaceEntry.main_path_takeover !== false
) {
  throw new Error(
    "review decision closure evidence package explanation hardening surface drifted"
  );
}

process.stdout.write(
  "governance case review decision closure evidence package explanation hardening verified\n"
);
