import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";

const {
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONTRACT_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONTRACT_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SURFACE_MAP,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummary,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryContract,
  consumeGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummary,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageExplanation,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageExplanationContract,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageContract,
  validateGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryContract,
} = permitExports;

await import(
  "./verify_governance_case_review_decision_closure_evidence_package_consumption_summary_boundary.mjs"
);

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
    kind: permitExports.GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_KIND,
    version:
      permitExports.GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_VERSION,
    schema_id:
      permitExports.GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_SCHEMA_ID,
    canonical_action_hash:
      "sha256:111122223333444455556666777788889999aaaabbbbccccddddeeeeffff0000",
    governance_case_review_decision_closure_evidence_package: {
      stage:
        permitExports.GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_STAGE,
      consumer_surface:
        permitExports.GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMER_SURFACE,
      boundary:
        permitExports.GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_BOUNDARY,
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
          permitExports.GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_STATUS_PACKAGED,
        package_scope:
          permitExports.GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_SCOPE_CURRENT_CLOSURE,
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
buildGovernanceCaseReviewDecisionClosureEvidencePackageContract({
  governanceCaseReviewDecisionClosureEvidencePackageProfile: packageProfile,
});

const explanationProfile =
  buildGovernanceCaseReviewDecisionClosureEvidencePackageExplanation({
    governanceCaseReviewDecisionClosureEvidencePackageProfile: packageProfile,
  });
buildGovernanceCaseReviewDecisionClosureEvidencePackageExplanationContract({
  governanceCaseReviewDecisionClosureEvidencePackageExplanationProfile:
    explanationProfile,
});

const profile =
  buildGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummary({
    governanceCaseReviewDecisionClosureEvidencePackageProfile: packageProfile,
    governanceCaseReviewDecisionClosureEvidencePackageExplanationProfile:
      explanationProfile,
  });
const contract =
  buildGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryContract(
    {
      governanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile:
        profile,
    }
  );
const consumed =
  consumeGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummary({
    governanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile:
      profile,
    governanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryContract:
      contract,
  });
const payload =
  profile.governance_case_review_decision_closure_evidence_package_consumption_summary;
const ref = payload.closure_evidence_package_consumption_summary_ref;
const readiness = payload.summary_context.delivery_readiness;
const surface =
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SURFACE_MAP
    .governance_case_review_decision_closure_evidence_package_consumption_summary;

if (
  contract.kind !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONTRACT_KIND ||
  contract.version !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONTRACT_VERSION ||
  contract.boundary !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONTRACT_BOUNDARY
) {
  throw new Error(
    "review decision closure evidence package consumption summary hardening contract envelope drifted"
  );
}

for (const field of [
  "summary_ref_alignment_stable",
  "explanation_stabilized_surface_semantics_stable",
  "delivery_readiness_interpretation_stable",
  "delivery_readiness_consumer_consistency_stable",
  "cross_surface_alignment_stable",
  "summary_export_stable",
  "aggregate_export_only",
  "permit_aggregate_export_only",
]) {
  if (contract[field] !== true) {
    throw new Error(
      `review decision closure evidence package consumption summary hardening contract drifted: ${field}`
    );
  }
}

if (
  ref.summary_id !== `${ref.package_id}:consumption-summary` ||
  consumed.summary_id !== ref.summary_id ||
  consumed.narrative_id !== ref.narrative_id ||
  consumed.receipt_id !== ref.receipt_id ||
  consumed.explanation_id !== ref.explanation_id ||
  consumed.closure_id !== ref.closure_id
) {
  throw new Error(
    "review decision closure evidence package consumption summary hardening ref alignment drifted"
  );
}

for (const field of [
  "summary_ref_alignment_stable",
  "explanation_stabilized_surface_semantics_stable",
  "delivery_readiness_interpretation_stable",
  "delivery_readiness_consumer_consistency_stable",
  "cross_surface_alignment_stable",
  "summary_export_stable",
]) {
  if (readiness[field] !== true || consumed[field] !== true || surface[field] !== true) {
    throw new Error(
      `review decision closure evidence package consumption summary hardening cross-surface drifted: ${field}`
    );
  }
}

assertRejected(
  () => {
    const drifted = cloneJson(profile);
    drifted.governance_case_review_decision_closure_evidence_package_consumption_summary.closure_evidence_package_consumption_summary_ref.summary_id =
      "receipt-1:package:other";
    permitExports.assertValidGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile(
      drifted
    );
  },
  "ref derivation drifted",
  "consumption summary profile must reject summary ref derivation drift"
);

assertRejected(
  () => {
    const drifted = cloneJson(profile);
    drifted.governance_case_review_decision_closure_evidence_package_consumption_summary.summary_context.delivery_readiness.summary_reason_codes =
      ["package_available"];
    permitExports.assertValidGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile(
      drifted
    );
  },
  "reason codes drifted",
  "consumption summary profile must reject delivery readiness reason-code drift"
);

assertRejected(
  () => {
    const drifted = cloneJson(profile);
    drifted.governance_case_review_decision_closure_evidence_package_consumption_summary.validation_exports.explanation_stabilized_surface_semantics_stable =
      false;
    permitExports.assertValidGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile(
      drifted
    );
  },
  "explanation_stabilized_surface_semantics_stable=true",
  "consumption summary profile must reject explanation semantics instability"
);

assertRejected(
  () => {
    const mismatched = cloneJson(contract);
    mismatched.closure_evidence_package_consumption_summary_profile_ref.narrative_id =
      "receipt-1:package:narrative:other";
    consumeGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummary({
      governanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile:
        profile,
      governanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryContract:
        mismatched,
    });
  },
  "consumer mismatch",
  "consumption summary consumer must reject summary ref narrative mismatch"
);

assertRejected(
  () => {
    const drifted = cloneJson(contract);
    drifted.delivery_readiness_consumer_consistency_stable = false;
    const validation =
      validateGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryContract(
        drifted
      );
    if (validation.ok) {
      throw new Error("expected invalid contract");
    }
    throw new Error(validation.errors.join("; "));
  },
  "delivery_readiness_consumer_consistency_stable",
  "consumption summary contract validator must reject consumer consistency drift"
);

process.stdout.write(
  "governance case review decision closure evidence package consumption summary hardening verified\n"
);
