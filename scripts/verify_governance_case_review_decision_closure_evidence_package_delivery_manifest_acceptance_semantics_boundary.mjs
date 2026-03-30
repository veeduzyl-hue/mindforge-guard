import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";

const {
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_CONTRACT_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_CONTRACT_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_FINALIZATION_STATE_FINALIZED,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_PROFILE_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_READABILITY_STATE_FINALIZED_READABLE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_REASON_CODES,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_SCOPE_CURRENT_FINALIZED_ACCEPTANCE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_STATUS_AVAILABLE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_SURFACE_MAP,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageContract,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummary,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryContract,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundle,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleContract,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifest,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemantics,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemanticsContract,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestContract,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageExplanation,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageExplanationContract,
  consumeGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemantics,
} = permitExports;

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
      "sha256:111122223333444455556666777788889999aaaabbbbccccddddeeeeffff4444",
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
const summaryProfile =
  buildGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummary({
    governanceCaseReviewDecisionClosureEvidencePackageProfile: packageProfile,
    governanceCaseReviewDecisionClosureEvidencePackageExplanationProfile:
      explanationProfile,
  });
buildGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryContract(
  {
    governanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile:
      summaryProfile,
  }
);
const bundleProfile =
  buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundle({
    governanceCaseReviewDecisionClosureEvidencePackageProfile: packageProfile,
    governanceCaseReviewDecisionClosureEvidencePackageExplanationProfile:
      explanationProfile,
    governanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile:
      summaryProfile,
  });
buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleContract({
  governanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleProfile:
    bundleProfile,
});
const manifestProfile =
  buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifest({
    governanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleProfile:
      bundleProfile,
  });
buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestContract({
  governanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestProfile:
    manifestProfile,
});

const profile =
  buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemantics(
    {
      governanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleProfile:
        bundleProfile,
      governanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestProfile:
        manifestProfile,
    }
  );
const contract =
  buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemanticsContract(
    {
      governanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemanticsProfile:
        profile,
    }
  );
const consumed =
  consumeGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemantics(
    {
      governanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemanticsProfile:
        profile,
      governanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemanticsContract:
        contract,
    }
  );
const payload =
  profile.governance_case_review_decision_closure_evidence_package_delivery_manifest_acceptance_semantics;
const semantics = payload.acceptance_semantics_context.finalized_acceptance_semantics;
const surface =
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_SURFACE_MAP
    .governance_case_review_decision_closure_evidence_package_delivery_manifest_acceptance_semantics;

if (
  profile.kind !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_PROFILE_KIND ||
  profile.version !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_PROFILE_VERSION ||
  profile.schema_id !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_PROFILE_SCHEMA_ID ||
  payload.stage !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_PROFILE_STAGE ||
  payload.boundary !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_PROFILE_BOUNDARY ||
  payload.consumer_surface !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_CONSUMER_SURFACE ||
  payload.acceptance_semantics_context.semantics_status !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_STATUS_AVAILABLE ||
  payload.acceptance_semantics_context.semantics_scope !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_SCOPE_CURRENT_FINALIZED_ACCEPTANCE ||
  semantics.finalization_state !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_FINALIZATION_STATE_FINALIZED ||
  semantics.readability_state !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_READABILITY_STATE_FINALIZED_READABLE
) {
  throw new Error(
    "review decision closure evidence package delivery manifest acceptance semantics profile envelope drifted"
  );
}

if (
  contract.kind !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_CONTRACT_KIND ||
  contract.version !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_CONTRACT_VERSION ||
  contract.boundary !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_CONTRACT_BOUNDARY
) {
  throw new Error(
    "review decision closure evidence package delivery manifest acceptance semantics contract envelope drifted"
  );
}

if (
  consumed.acceptance_semantics_id !==
    payload.closure_evidence_package_delivery_manifest_acceptance_semantics_ref.acceptance_semantics_id ||
  consumed.manifest_id !==
    payload.closure_evidence_package_delivery_manifest_acceptance_semantics_ref.manifest_id ||
  consumed.bundle_id !==
    payload.closure_evidence_package_delivery_manifest_acceptance_semantics_ref.bundle_id
) {
  throw new Error(
    "review decision closure evidence package delivery manifest acceptance semantics consumer drifted"
  );
}

for (const field of [
  "bundle_available",
  "manifest_available",
  "package_available",
  "explanation_available",
  "consumption_summary_available",
  "bundle_manifest_semantic_linkage_finalized",
  "acceptance_semantics_finalized",
  "finalized_acceptance_readability_bounded",
  "finalized_cross_surface_consistency_bounded",
  "finalized_export_stable",
  "aggregate_export_only",
  "permit_aggregate_export_only",
]) {
  if (
    semantics[field] !== true ||
    consumed[field] !== true ||
    surface[field] !== true
  ) {
    throw new Error(
      `review decision closure evidence package delivery manifest acceptance semantics drifted: ${field}`
    );
  }
}

if (
  !Array.isArray(semantics.finalized_reason_codes) ||
  JSON.stringify(semantics.finalized_reason_codes) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_SEMANTICS_REASON_CODES
    )
) {
  throw new Error(
    "review decision closure evidence package delivery manifest acceptance semantics reason codes drifted"
  );
}

assertRejected(
  () =>
    buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemantics(
      {
        governanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleProfile:
          bundleProfile,
        governanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestProfile:
          (() => {
            const drifted = cloneJson(manifestProfile);
            drifted.governance_case_review_decision_closure_evidence_package_delivery_manifest.closure_evidence_package_delivery_manifest_ref.bundle_id =
              "receipt-1:package:other-bundle";
            drifted.governance_case_review_decision_closure_evidence_package_delivery_manifest.closure_evidence_package_delivery_manifest_ref.manifest_id =
              "receipt-1:package:other-bundle:manifest";
            return drifted;
          })(),
      }
    ),
  "bundle and manifest refs must remain aligned",
  "review decision closure evidence package delivery manifest acceptance semantics must reject bundle-manifest linkage drift"
);

assertRejected(
  () =>
    permitExports.assertValidGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestAcceptanceSemanticsProfile(
      (() => {
        const drifted = cloneJson(profile);
        drifted.governance_case_review_decision_closure_evidence_package_delivery_manifest_acceptance_semantics.acceptance_semantics_context.finalized_acceptance_semantics.readability_state =
          "other";
        return drifted;
      })()
    ),
  "context envelope drifted",
  "review decision closure evidence package delivery manifest acceptance semantics must reject finalized readability drift"
);

console.log(
  "verify_governance_case_review_decision_closure_evidence_package_delivery_manifest_acceptance_semantics_boundary: ok"
);
