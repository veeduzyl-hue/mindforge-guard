import {
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SCOPE_CURRENT_PACKAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_STATUS_AVAILABLE,
  assertValidGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile,
} from "./governanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SCOPE_CURRENT_PACKAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_STATUS_AVAILABLE,
  assertValidGovernanceCaseReviewDecisionClosureEvidencePackageExplanationProfile,
} from "./governanceCaseReviewDecisionClosureEvidencePackageExplanationProfile.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_SCOPE_CURRENT_CLOSURE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_STATUS_PACKAGED,
  assertValidGovernanceCaseReviewDecisionClosureEvidencePackageProfile,
} from "./governanceCaseReviewDecisionClosureEvidencePackageProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_KIND =
  "governance_case_review_decision_closure_evidence_package_delivery_bundle_profile";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_SCHEMA_ID =
  "mindforge/governance-case-review-decision-closure-evidence-package-delivery-bundle-profile/v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_STAGE =
  "governance_case_review_decision_closure_evidence_package_delivery_bundle_boundary_phase1_v6_10_0";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_CONSUMER_SURFACE =
  "guard.audit.governance_case_review_decision_closure_evidence_package_delivery_bundle";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_BOUNDARY =
  "governance_case_review_decision_closure_evidence_package_delivery_bundle_boundary_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_STATUS_AVAILABLE =
  "available";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SCOPE_CURRENT_HANDOFF =
  "current_closure_evidence_package_handoff_bundle_only";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_HANDOFF_STATE_READY =
  "ready";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_READABILITY_STATE_READABLE =
  "readable";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_REASON_CODES =
  Object.freeze([
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
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_REASON_CODE_ALLOWLIST =
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_REASON_CODES;
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_TOP_LEVEL_FIELDS =
  Object.freeze([
    "kind",
    "version",
    "schema_id",
    "canonical_action_hash",
    "governance_case_review_decision_closure_evidence_package_delivery_bundle",
    "deterministic",
    "enforcing",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PAYLOAD_FIELDS =
  Object.freeze([
    "stage",
    "consumer_surface",
    "boundary",
    "closure_evidence_package_delivery_bundle_ref",
    "bundle_context",
    "validation_exports",
    "preserved_semantics",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_STABLE_EXPORT_SET =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_KIND",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_SCHEMA_ID",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_STAGE",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_CONSUMER_SURFACE",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_BOUNDARY",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_STATUS_AVAILABLE",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SCOPE_CURRENT_HANDOFF",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_HANDOFF_STATE_READY",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_READABILITY_STATE_READABLE",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_REASON_CODES",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_REASON_CODE_ALLOWLIST",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_TOP_LEVEL_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PAYLOAD_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_STABLE_EXPORT_SET",
    "buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleProfile",
    "validateGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleProfile",
    "assertValidGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleProfile",
  ]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasUniqueStrings(values) {
  return Array.isArray(values) && new Set(values).size === values.length;
}

function assertTrueFields(source, fields, label) {
  for (const field of fields) {
    if (source[field] !== true) {
      throw new Error(
        `governance case review decision closure evidence package delivery bundle requires ${label} ${field}=true`
      );
    }
  }
}

function assertFalseFields(source, fields, label) {
  for (const field of fields) {
    if (source[field] !== false) {
      throw new Error(
        `governance case review decision closure evidence package delivery bundle requires ${label} ${field}=false`
      );
    }
  }
}

export function buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleProfile({
  governanceCaseReviewDecisionClosureEvidencePackageProfile,
  governanceCaseReviewDecisionClosureEvidencePackageExplanationProfile,
  governanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile,
}) {
  const packageProfile =
    assertValidGovernanceCaseReviewDecisionClosureEvidencePackageProfile(
      governanceCaseReviewDecisionClosureEvidencePackageProfile
    );
  const explanationProfile =
    assertValidGovernanceCaseReviewDecisionClosureEvidencePackageExplanationProfile(
      governanceCaseReviewDecisionClosureEvidencePackageExplanationProfile
    );
  const summaryProfile =
    assertValidGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile(
      governanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile
    );

  const packagePayload =
    packageProfile.governance_case_review_decision_closure_evidence_package;
  const explanationPayload =
    explanationProfile.governance_case_review_decision_closure_evidence_package_explanation;
  const summaryPayload =
    summaryProfile.governance_case_review_decision_closure_evidence_package_consumption_summary;
  const packageRef = packagePayload.closure_evidence_package_ref;
  const explanationRef =
    explanationPayload.closure_evidence_package_explanation_ref;
  const summaryRef =
    summaryPayload.closure_evidence_package_consumption_summary_ref;
  const packageBasis = packagePayload.package_manifest.package_basis;
  const explanationBasis = explanationPayload.explanation_context.explanation_basis;
  const summaryReadiness = summaryPayload.summary_context.delivery_readiness;

  if (
    packagePayload.stage !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_STAGE ||
    packagePayload.package_manifest.package_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_STATUS_PACKAGED ||
    packagePayload.package_manifest.package_scope !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_SCOPE_CURRENT_CLOSURE
  ) {
    throw new Error(
      "governance case review decision closure evidence package delivery bundle requires packaged current closure evidence package"
    );
  }
  if (
    explanationPayload.stage !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_STAGE ||
    explanationPayload.explanation_context.explanation_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_STATUS_AVAILABLE ||
    explanationPayload.explanation_context.explanation_scope !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SCOPE_CURRENT_PACKAGE
  ) {
    throw new Error(
      "governance case review decision closure evidence package delivery bundle requires available current package explanation"
    );
  }
  if (
    summaryPayload.stage !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_STAGE ||
    summaryPayload.summary_context.summary_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_STATUS_AVAILABLE ||
    summaryPayload.summary_context.summary_scope !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SCOPE_CURRENT_PACKAGE
  ) {
    throw new Error(
      "governance case review decision closure evidence package delivery bundle requires available current package consumption summary"
    );
  }

  for (const field of [
    "package_id",
    "narrative_id",
    "narrative_selection_id",
    "receipt_id",
    "explanation_id",
    "closure_id",
    "case_id",
    "review_decision_id",
    "attestation_id",
  ]) {
    const packageValue =
      field === "narrative_id" || field === "narrative_selection_id"
        ? explanationRef[field]
        : packageRef[field];
    if (packageValue !== summaryRef[field]) {
      throw new Error(
        `governance case review decision closure evidence package delivery bundle mismatch: ${field} must remain aligned`
      );
    }
  }
  for (const field of [
    "package_id",
    "receipt_id",
    "explanation_id",
    "closure_id",
    "case_id",
    "review_decision_id",
    "attestation_id",
  ]) {
    if (packageRef[field] !== explanationRef[field]) {
      throw new Error(
        `governance case review decision closure evidence package delivery bundle mismatch: ${field} must remain aligned`
      );
    }
  }
  if (
    packageProfile.canonical_action_hash !== explanationProfile.canonical_action_hash ||
    packageProfile.canonical_action_hash !== summaryProfile.canonical_action_hash
  ) {
    throw new Error(
      "governance case review decision closure evidence package delivery bundle mismatch: canonical_action_hash must remain aligned"
    );
  }

  assertTrueFields(
    packageBasis,
    [
      "package_manifest_complete",
      "package_composition_bounded",
      "package_export_stable",
      "package_linkage_only",
      "consumption_boundary_bounded",
      "aggregate_export_only",
      "permit_aggregate_export_only",
    ],
    "package basis"
  );
  assertTrueFields(
    explanationBasis,
    [
      "package_available",
      "current_narrative_selected",
      "current_narrative_selection_stable",
      "narrative_section_alignment_stable",
      "section_artifact_binding_stable",
      "section_consumer_consistency_stable",
      "cross_surface_alignment_stable",
      "consumption_boundary_bounded",
      "aggregate_export_only",
      "permit_aggregate_export_only",
    ],
    "explanation basis"
  );
  assertTrueFields(
    summaryReadiness,
    [
      "package_available",
      "explanation_available",
      "explanation_stabilized_surface_available",
      "summary_ref_alignment_stable",
      "explanation_stabilized_surface_semantics_stable",
      "current_narrative_selected",
      "current_narrative_selection_stable",
      "cross_surface_alignment_stable",
      "delivery_readiness_interpretation_stable",
      "delivery_readiness_consumer_consistency_stable",
      "delivery_readiness_summary_bounded",
      "delivery_readiness_readable",
      "consumer_reading_surface_bounded",
      "summary_export_stable",
      "aggregate_export_only",
      "permit_aggregate_export_only",
    ],
    "consumption summary delivery readiness"
  );

  return assertValidGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleProfile(
    {
      kind:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_KIND,
      version:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_VERSION,
      schema_id:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_SCHEMA_ID,
      canonical_action_hash: packageProfile.canonical_action_hash,
      governance_case_review_decision_closure_evidence_package_delivery_bundle:
        {
          stage:
            GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_STAGE,
          consumer_surface:
            GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_CONSUMER_SURFACE,
          boundary:
            GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_BOUNDARY,
          closure_evidence_package_delivery_bundle_ref: {
            bundle_id: `${packageRef.package_id}:delivery-bundle`,
            package_id: packageRef.package_id,
            explanation_id: explanationRef.explanation_id,
            summary_id: summaryRef.summary_id,
            narrative_id: explanationRef.narrative_id,
            narrative_selection_id: explanationRef.narrative_selection_id,
            receipt_id: packageRef.receipt_id,
            closure_id: packageRef.closure_id,
            case_id: packageRef.case_id,
            review_decision_id: packageRef.review_decision_id,
            attestation_id: packageRef.attestation_id,
          },
          bundle_context: {
            bundle_status:
              GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_STATUS_AVAILABLE,
            bundle_scope:
              GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SCOPE_CURRENT_HANDOFF,
            handoff_bundle: {
              handoff_state:
                GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_HANDOFF_STATE_READY,
              readability_state:
                GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_READABILITY_STATE_READABLE,
              bundle_reason_codes: [
                ...GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_REASON_CODES,
              ],
              package_available: true,
              explanation_available: true,
              consumption_summary_available: true,
              explanation_stabilized_surface_available: true,
              delivery_readiness_summary_available: true,
              bundle_ref_alignment_stable: true,
              bundle_composition_bounded: true,
              bundle_handoff_surface_bounded: true,
              bundle_handoff_readable: true,
              bundle_export_stable: true,
              aggregate_export_only: true,
              permit_aggregate_export_only: true,
            },
          },
          validation_exports: {
            package_surface_required: true,
            explanation_surface_required: true,
            consumption_summary_surface_required: true,
            explanation_stabilized_surface_required: true,
            delivery_readiness_summary_required: true,
            bundle_ref_alignment_stable: true,
            bundle_composition_bounded: true,
            bundle_handoff_surface_bounded: true,
            bundle_handoff_readable: true,
            bundle_export_stable: true,
            cross_case_binding_rejected: true,
            cross_review_decision_binding_rejected: true,
            cross_canonical_action_hash_binding_rejected: true,
            complete_bundle_linkage_required: true,
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
            permit_lane_consumption: false,
            audit_path_dependency: false,
            main_path_takeover: false,
            authority_scope_expansion: false,
            governance_object_addition: false,
            ui_control_plane: false,
          },
        },
      deterministic: true,
      enforcing: false,
    }
  );
}

export function validateGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleProfile(
  profile
) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: [
        "governance case review decision closure evidence package delivery bundle profile must be an object",
      ],
    };
  }
  if (
    profile.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_KIND ||
    profile.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_VERSION ||
    profile.schema_id !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_SCHEMA_ID
  ) {
    errors.push(
      "governance case review decision closure evidence package delivery bundle profile envelope drifted"
    );
  }

  const payload =
    profile.governance_case_review_decision_closure_evidence_package_delivery_bundle;
  if (!isPlainObject(payload)) {
    errors.push(
      "governance case review decision closure evidence package delivery bundle payload must be an object"
    );
  } else {
    if (
      payload.stage !==
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_STAGE ||
      payload.consumer_surface !==
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_CONSUMER_SURFACE ||
      payload.boundary !==
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_BOUNDARY
    ) {
      errors.push(
        "governance case review decision closure evidence package delivery bundle payload envelope drifted"
      );
    }

    const ref = payload.closure_evidence_package_delivery_bundle_ref;
    if (!isPlainObject(ref)) {
      errors.push(
        "governance case review decision closure evidence package delivery bundle ref must be an object"
      );
    } else {
      for (const field of [
        "bundle_id",
        "package_id",
        "explanation_id",
        "summary_id",
        "narrative_id",
        "narrative_selection_id",
        "receipt_id",
        "closure_id",
        "case_id",
        "review_decision_id",
        "attestation_id",
      ]) {
        if (typeof ref[field] !== "string" || ref[field].length === 0) {
          errors.push(
            `governance case review decision closure evidence package delivery bundle ref field invalid: ${field}`
          );
        }
      }
      if (
        typeof ref.bundle_id === "string" &&
        typeof ref.package_id === "string" &&
        ref.bundle_id !== `${ref.package_id}:delivery-bundle`
      ) {
        errors.push(
          "governance case review decision closure evidence package delivery bundle ref drifted: bundle_id derivation changed"
        );
      }
    }

    const handoff = payload.bundle_context?.handoff_bundle;
    if (!isPlainObject(payload.bundle_context) || !isPlainObject(handoff)) {
      errors.push(
        "governance case review decision closure evidence package delivery bundle handoff context must be an object"
      );
    } else {
      if (
        payload.bundle_context.bundle_status !==
          GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_STATUS_AVAILABLE ||
        payload.bundle_context.bundle_scope !==
          GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SCOPE_CURRENT_HANDOFF ||
        handoff.handoff_state !==
          GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_HANDOFF_STATE_READY ||
        handoff.readability_state !==
          GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_READABILITY_STATE_READABLE
      ) {
        errors.push(
          "governance case review decision closure evidence package delivery bundle handoff envelope drifted"
        );
      }
      if (
        !hasUniqueStrings(handoff.bundle_reason_codes) ||
        JSON.stringify(handoff.bundle_reason_codes) !==
          JSON.stringify(
            GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_REASON_CODES
          )
      ) {
        errors.push(
          "governance case review decision closure evidence package delivery bundle reason codes drifted"
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
        if (handoff[field] !== true) {
          errors.push(
            `governance case review decision closure evidence package delivery bundle handoff field drifted: ${field}`
          );
        }
      }
    }

    const validationExports = payload.validation_exports;
    if (!isPlainObject(validationExports)) {
      errors.push(
        "governance case review decision closure evidence package delivery bundle validation exports must be an object"
      );
    } else {
      for (const field of [
        "package_surface_required",
        "explanation_surface_required",
        "consumption_summary_surface_required",
        "explanation_stabilized_surface_required",
        "delivery_readiness_summary_required",
        "bundle_ref_alignment_stable",
        "bundle_composition_bounded",
        "bundle_handoff_surface_bounded",
        "bundle_handoff_readable",
        "bundle_export_stable",
        "cross_case_binding_rejected",
        "cross_review_decision_binding_rejected",
        "cross_canonical_action_hash_binding_rejected",
        "complete_bundle_linkage_required",
        "aggregate_export_only",
        "permit_aggregate_export_only",
      ]) {
        if (validationExports[field] !== true) {
          errors.push(
            `governance case review decision closure evidence package delivery bundle validation export drifted: ${field}`
          );
        }
      }
    }

    const preservedSemantics = payload.preserved_semantics;
    if (!isPlainObject(preservedSemantics)) {
      errors.push(
        "governance case review decision closure evidence package delivery bundle preserved semantics must be an object"
      );
    } else {
      for (const field of [
        "derived_only",
        "supporting_artifact_only",
        "non_authoritative",
        "recommendation_only",
        "additive_only",
        "non_executing",
        "default_off",
      ]) {
        if (preservedSemantics[field] !== true) {
          errors.push(
            `governance case review decision closure evidence package delivery bundle preserved semantic drifted: ${field}`
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
        "authority_scope_expansion",
        "governance_object_addition",
        "ui_control_plane",
      ]) {
        if (preservedSemantics[field] !== false) {
          errors.push(
            `governance case review decision closure evidence package delivery bundle preserved semantic drifted: ${field}`
          );
        }
      }
    }
  }

  if (profile.deterministic !== true) {
    errors.push(
      "governance case review decision closure evidence package delivery bundle must remain deterministic"
    );
  }
  if (profile.enforcing !== false) {
    errors.push(
      "governance case review decision closure evidence package delivery bundle must remain non-enforcing"
    );
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleProfile(
  profile
) {
  const validation =
    validateGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleProfile(
      profile
    );
  if (validation.ok) return profile;
  const err = new Error(
    `governance case review decision closure evidence package delivery bundle profile invalid: ${validation.errors.join(
      "; "
    )}`
  );
  err.validation = validation;
  throw err;
}
