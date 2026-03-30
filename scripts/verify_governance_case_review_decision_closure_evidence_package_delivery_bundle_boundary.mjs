import * as permitExports from "../packages/guard/src/runtime/governance/permit/index.mjs";

const {
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_CONTRACT_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_CONTRACT_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_CONTRACT_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_CONSUMER_SURFACE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_HANDOFF_STATE_READY,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_BOUNDARY,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_KIND,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_SCHEMA_ID,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_VERSION,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_READABILITY_STATE_READABLE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_REASON_CODES,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SCOPE_CURRENT_HANDOFF,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_STATUS_AVAILABLE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SURFACE_MAP,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundle,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleContract,
  consumeGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundle,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummary,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryContract,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageExplanation,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageExplanationContract,
  buildGovernanceCaseReviewDecisionClosureEvidencePackageContract,
} = permitExports;

await import(
  "./verify_governance_case_review_decision_closure_evidence_package_consumption_summary_final_acceptance.mjs"
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

const profile = buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundle(
  {
    governanceCaseReviewDecisionClosureEvidencePackageProfile: packageProfile,
    governanceCaseReviewDecisionClosureEvidencePackageExplanationProfile:
      explanationProfile,
    governanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile:
      summaryProfile,
  }
);
const contract =
  buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleContract({
    governanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleProfile:
      profile,
  });
const consumed =
  consumeGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundle({
    governanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleProfile:
      profile,
    governanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleContract:
      contract,
  });
const payload =
  profile.governance_case_review_decision_closure_evidence_package_delivery_bundle;
const handoff = payload.bundle_context.handoff_bundle;
const surface =
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SURFACE_MAP
    .governance_case_review_decision_closure_evidence_package_delivery_bundle;

if (
  profile.kind !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_KIND ||
  profile.version !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_VERSION ||
  profile.schema_id !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_SCHEMA_ID ||
  payload.stage !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_STAGE ||
  payload.boundary !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_BOUNDARY ||
  payload.consumer_surface !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_CONSUMER_SURFACE ||
  payload.bundle_context.bundle_status !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_STATUS_AVAILABLE ||
  payload.bundle_context.bundle_scope !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SCOPE_CURRENT_HANDOFF ||
  handoff.handoff_state !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_HANDOFF_STATE_READY ||
  handoff.readability_state !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_READABILITY_STATE_READABLE
) {
  throw new Error(
    "review decision closure evidence package delivery bundle profile envelope drifted"
  );
}

if (
  contract.kind !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_CONTRACT_KIND ||
  contract.version !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_CONTRACT_VERSION ||
  contract.boundary !==
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_CONTRACT_BOUNDARY
) {
  throw new Error(
    "review decision closure evidence package delivery bundle contract envelope drifted"
  );
}

if (
  consumed.bundle_id !== payload.closure_evidence_package_delivery_bundle_ref.bundle_id ||
  consumed.summary_id !== payload.closure_evidence_package_delivery_bundle_ref.summary_id
) {
  throw new Error(
    "review decision closure evidence package delivery bundle consumer drifted"
  );
}

for (const field of [
  "package_available",
  "explanation_available",
  "consumption_summary_available",
  "explanation_stabilized_surface_available",
  "delivery_readiness_summary_available",
  "bundle_ref_alignment_stable",
  "bundle_composition_bounded",
  "bundle_handoff_surface_bounded",
  "bundle_handoff_readable",
  "bundle_export_stable",
  "aggregate_export_only",
  "permit_aggregate_export_only",
]) {
  if (handoff[field] !== true || consumed[field] !== true || surface[field] !== true) {
    throw new Error(
      `review decision closure evidence package delivery bundle handoff drifted: ${field}`
    );
  }
}

if (
  !Array.isArray(handoff.bundle_reason_codes) ||
  JSON.stringify(handoff.bundle_reason_codes) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_REASON_CODES
    )
) {
  throw new Error(
    "review decision closure evidence package delivery bundle reason codes drifted"
  );
}

for (const field of [
  "derived_only",
  "supporting_artifact_only",
  "non_authoritative",
  "additive_only",
  "non_executing",
  "default_off",
]) {
  if (payload.preserved_semantics[field] !== true || surface[field] !== true) {
    throw new Error(
      `review decision closure evidence package delivery bundle preserved semantic drifted: ${field}`
    );
  }
}

for (const field of [
  "judgment_source_enabled",
  "authority_source_enabled",
  "execution_binding_enabled",
  "risk_source_enabled",
  "permit_lane_consumption",
  "audit_path_dependency",
  "main_path_takeover",
]) {
  if (payload.preserved_semantics[field] !== false || surface[field] !== false) {
    throw new Error(
      `review decision closure evidence package delivery bundle preserved negative semantic drifted: ${field}`
    );
  }
}

assertRejected(
  () =>
    buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundle({
      governanceCaseReviewDecisionClosureEvidencePackageProfile: packageProfile,
      governanceCaseReviewDecisionClosureEvidencePackageExplanationProfile:
        explanationProfile,
      governanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile:
        (() => {
          const drifted = cloneJson(summaryProfile);
          drifted.governance_case_review_decision_closure_evidence_package_consumption_summary.closure_evidence_package_consumption_summary_ref.summary_id =
            "receipt-1:package:drifted-summary";
          return drifted;
        })(),
    }),
  "ref derivation drifted",
  "review decision closure evidence package delivery bundle must reject summary drift"
);

assertRejected(
  () =>
    buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundle({
      governanceCaseReviewDecisionClosureEvidencePackageProfile: packageProfile,
      governanceCaseReviewDecisionClosureEvidencePackageExplanationProfile:
        explanationProfile,
      governanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile:
        (() => {
          const drifted = cloneJson(summaryProfile);
          drifted.governance_case_review_decision_closure_evidence_package_consumption_summary.summary_context.delivery_readiness.delivery_readiness_readable =
            false;
          return drifted;
        })(),
    }),
  "delivery_readiness_readable",
  "review decision closure evidence package delivery bundle must reject unreadable delivery readiness summary"
);

assertRejected(
  () =>
    buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundle({
      governanceCaseReviewDecisionClosureEvidencePackageProfile: packageProfile,
      governanceCaseReviewDecisionClosureEvidencePackageExplanationProfile:
        explanationProfile,
      governanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile:
        (() => {
          const drifted = cloneJson(summaryProfile);
          drifted.governance_case_review_decision_closure_evidence_package_consumption_summary.summary_context.delivery_readiness.summary_reason_codes =
            ["package_available"];
          return drifted;
        })(),
    }),
  "reason codes",
  "review decision closure evidence package delivery bundle must reject reason-code drift"
);

console.log(
  "verify_governance_case_review_decision_closure_evidence_package_delivery_bundle_boundary: ok"
);
