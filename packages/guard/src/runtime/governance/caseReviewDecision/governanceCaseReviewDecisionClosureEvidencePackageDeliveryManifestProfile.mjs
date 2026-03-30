import {
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_HANDOFF_STATE_READY,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_STAGE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_READABILITY_STATE_READABLE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SCOPE_CURRENT_HANDOFF,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_STATUS_AVAILABLE,
  assertValidGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleProfile,
} from "./governanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PROFILE_KIND =
  "governance_case_review_decision_closure_evidence_package_delivery_manifest_profile";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PROFILE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PROFILE_SCHEMA_ID =
  "mindforge/governance-case-review-decision-closure-evidence-package-delivery-manifest-profile/v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PROFILE_STAGE =
  "governance_case_review_decision_closure_evidence_package_delivery_manifest_boundary_phase2_v6_11_0";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_CONSUMER_SURFACE =
  "guard.audit.governance_case_review_decision_closure_evidence_package_delivery_manifest";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PROFILE_BOUNDARY =
  "governance_case_review_decision_closure_evidence_package_delivery_manifest_boundary_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_STATUS_AVAILABLE =
  "available";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_SCOPE_CURRENT_ACCEPTANCE =
  "current_closure_evidence_package_delivery_manifest_only";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_STATE_READY =
  "ready";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_COMPLETENESS_STATE_COMPLETE =
  "complete";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_REASON_CODES =
  Object.freeze([
    "bundle_available",
    "package_available",
    "explanation_available",
    "consumption_summary_available",
    "manifest_ref_alignment_stable",
    "manifest_listing_deterministic",
    "manifest_listing_consistency_stable",
    "manifest_composition_bounded",
    "manifest_completeness_bounded",
    "manifest_completeness_semantics_stable",
    "manifest_acceptance_surface_bounded",
    "acceptance_readability_stable",
    "manifest_acceptance_readability_consistency_stable",
    "cross_surface_alignment_stable",
    "manifest_export_stable",
    "aggregate_export_only",
    "permit_aggregate_export_only",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_REASON_CODE_ALLOWLIST =
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_REASON_CODES;
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ITEM_KINDS =
  Object.freeze([
    "governance_case_review_decision_closure_evidence_package",
    "governance_case_review_decision_closure_evidence_package_explanation",
    "governance_case_review_decision_closure_evidence_package_consumption_summary",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_TOP_LEVEL_FIELDS =
  Object.freeze([
    "kind",
    "version",
    "schema_id",
    "canonical_action_hash",
    "governance_case_review_decision_closure_evidence_package_delivery_manifest",
    "deterministic",
    "enforcing",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PAYLOAD_FIELDS =
  Object.freeze([
    "stage",
    "consumer_surface",
    "boundary",
    "closure_evidence_package_delivery_manifest_ref",
    "manifest_context",
    "delivery_package_items",
    "validation_exports",
    "preserved_semantics",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_STABLE_EXPORT_SET =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PROFILE_KIND",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PROFILE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PROFILE_SCHEMA_ID",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PROFILE_STAGE",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_CONSUMER_SURFACE",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PROFILE_BOUNDARY",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_STATUS_AVAILABLE",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_SCOPE_CURRENT_ACCEPTANCE",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_STATE_READY",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_COMPLETENESS_STATE_COMPLETE",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_REASON_CODES",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_REASON_CODE_ALLOWLIST",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_TOP_LEVEL_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PAYLOAD_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_STABLE_EXPORT_SET",
    "buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestProfile",
    "validateGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestProfile",
    "assertValidGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestProfile",
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
        `governance case review decision closure evidence package delivery manifest requires ${label} ${field}=true`
      );
    }
  }
}

export function buildGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestProfile({
  governanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleProfile,
}) {
  const bundleProfile =
    assertValidGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleProfile(
      governanceCaseReviewDecisionClosureEvidencePackageDeliveryBundleProfile
    );
  const bundlePayload =
    bundleProfile.governance_case_review_decision_closure_evidence_package_delivery_bundle;
  const bundleRef = bundlePayload.closure_evidence_package_delivery_bundle_ref;
  const handoff = bundlePayload.bundle_context.handoff_bundle;
  const bundleValidationExports = bundlePayload.validation_exports;

  if (
    bundlePayload.stage !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_PROFILE_STAGE ||
    bundlePayload.bundle_context.bundle_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_STATUS_AVAILABLE ||
    bundlePayload.bundle_context.bundle_scope !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_SCOPE_CURRENT_HANDOFF ||
    handoff.handoff_state !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_HANDOFF_STATE_READY ||
    handoff.readability_state !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_BUNDLE_READABILITY_STATE_READABLE
  ) {
    throw new Error(
      "governance case review decision closure evidence package delivery manifest requires available readable current handoff bundle"
    );
  }

  assertTrueFields(
    handoff,
    [
      "package_available",
      "explanation_available",
      "consumption_summary_available",
      "bundle_ref_alignment_stable",
      "handoff_semantics_stable",
      "bundle_composition_stable",
      "bundle_handoff_readability_consistency_stable",
      "cross_surface_alignment_stable",
      "bundle_composition_bounded",
      "bundle_handoff_surface_bounded",
      "bundle_handoff_readable",
      "bundle_export_stable",
      "aggregate_export_only",
      "permit_aggregate_export_only",
    ],
    "bundle handoff"
  );
  assertTrueFields(
    bundleValidationExports,
    [
      "bundle_ref_alignment_stable",
      "handoff_semantics_stable",
      "bundle_composition_stable",
      "bundle_handoff_readability_consistency_stable",
      "cross_surface_alignment_stable",
      "bundle_composition_bounded",
      "bundle_handoff_surface_bounded",
      "bundle_handoff_readable",
      "bundle_export_stable",
      "aggregate_export_only",
      "permit_aggregate_export_only",
    ],
    "bundle validation exports"
  );

  return assertValidGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestProfile({
    kind:
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PROFILE_KIND,
    version:
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PROFILE_VERSION,
    schema_id:
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PROFILE_SCHEMA_ID,
    canonical_action_hash: bundleProfile.canonical_action_hash,
    governance_case_review_decision_closure_evidence_package_delivery_manifest: {
      stage:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PROFILE_STAGE,
      consumer_surface:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_CONSUMER_SURFACE,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PROFILE_BOUNDARY,
      closure_evidence_package_delivery_manifest_ref: {
        manifest_id: `${bundleRef.bundle_id}:manifest`,
        bundle_id: bundleRef.bundle_id,
        package_id: bundleRef.package_id,
        explanation_id: bundleRef.explanation_id,
        summary_id: bundleRef.summary_id,
        narrative_id: bundleRef.narrative_id,
        narrative_selection_id: bundleRef.narrative_selection_id,
        receipt_id: bundleRef.receipt_id,
        closure_id: bundleRef.closure_id,
        case_id: bundleRef.case_id,
        review_decision_id: bundleRef.review_decision_id,
        attestation_id: bundleRef.attestation_id,
      },
      manifest_context: {
        manifest_status:
          GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_STATUS_AVAILABLE,
        manifest_scope:
          GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_SCOPE_CURRENT_ACCEPTANCE,
          delivery_manifest: {
          acceptance_state:
            GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_STATE_READY,
          completeness_state:
            GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_COMPLETENESS_STATE_COMPLETE,
          manifest_reason_codes: [
            ...GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_REASON_CODES,
          ],
          delivery_package_item_count: 3,
            package_available: true,
            explanation_available: true,
            consumption_summary_available: true,
            bundle_available: true,
            manifest_ref_alignment_stable: true,
            manifest_listing_deterministic: true,
            manifest_listing_consistency_stable: true,
            manifest_composition_bounded: true,
            manifest_completeness_bounded: true,
            manifest_completeness_semantics_stable: true,
            manifest_acceptance_surface_bounded: true,
            acceptance_readability_stable: true,
            manifest_acceptance_readability_consistency_stable: true,
            cross_surface_alignment_stable: true,
            manifest_export_stable: true,
            aggregate_export_only: true,
            permit_aggregate_export_only: true,
        },
      },
      delivery_package_items: [
        {
          artifact_id: bundleRef.package_id,
          artifact_kind:
            "governance_case_review_decision_closure_evidence_package",
          role: "delivery_package",
          listing_order: 1,
        },
        {
          artifact_id: bundleRef.explanation_id,
          artifact_kind:
            "governance_case_review_decision_closure_evidence_package_explanation",
          role: "delivery_explanation",
          listing_order: 2,
        },
        {
          artifact_id: bundleRef.summary_id,
          artifact_kind:
            "governance_case_review_decision_closure_evidence_package_consumption_summary",
          role: "delivery_consumption_summary",
          listing_order: 3,
        },
      ],
      validation_exports: {
        bundle_surface_required: true,
        package_surface_required: true,
        explanation_surface_required: true,
        consumption_summary_surface_required: true,
        manifest_ref_alignment_stable: true,
        manifest_listing_deterministic: true,
        manifest_listing_consistency_stable: true,
        manifest_composition_bounded: true,
        manifest_completeness_bounded: true,
        manifest_completeness_semantics_stable: true,
        manifest_acceptance_surface_bounded: true,
        acceptance_readability_stable: true,
        manifest_acceptance_readability_consistency_stable: true,
        cross_surface_alignment_stable: true,
        manifest_export_stable: true,
        cross_case_binding_rejected: true,
        cross_review_decision_binding_rejected: true,
        cross_canonical_action_hash_binding_rejected: true,
        complete_manifest_linkage_required: true,
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
  });
}

export function validateGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestProfile(
  profile
) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: [
        "governance case review decision closure evidence package delivery manifest profile must be an object",
      ],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_TOP_LEVEL_FIELDS
    )
  ) {
    errors.push(
      "governance case review decision closure evidence package delivery manifest top-level field order drifted"
    );
  }
  if (
    profile.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PROFILE_KIND ||
    profile.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PROFILE_VERSION ||
    profile.schema_id !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PROFILE_SCHEMA_ID
  ) {
    errors.push(
      "governance case review decision closure evidence package delivery manifest profile envelope drifted"
    );
  }

  const payload =
    profile.governance_case_review_decision_closure_evidence_package_delivery_manifest;
  if (!isPlainObject(payload)) {
    errors.push(
      "governance case review decision closure evidence package delivery manifest payload must be an object"
    );
  } else {
    if (
      JSON.stringify(Object.keys(payload)) !==
      JSON.stringify(
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PAYLOAD_FIELDS
      )
    ) {
      errors.push(
        "governance case review decision closure evidence package delivery manifest payload field order drifted"
      );
    }
    if (
      payload.stage !==
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PROFILE_STAGE ||
      payload.consumer_surface !==
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_CONSUMER_SURFACE ||
      payload.boundary !==
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_PROFILE_BOUNDARY
    ) {
      errors.push(
        "governance case review decision closure evidence package delivery manifest payload envelope drifted"
      );
    }

    const ref = payload.closure_evidence_package_delivery_manifest_ref;
    if (!isPlainObject(ref)) {
      errors.push(
        "governance case review decision closure evidence package delivery manifest ref must be an object"
      );
    } else {
      for (const field of [
        "manifest_id",
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
            `governance case review decision closure evidence package delivery manifest ref field invalid: ${field}`
          );
        }
      }
      if (
        typeof ref.manifest_id === "string" &&
        typeof ref.bundle_id === "string" &&
        ref.manifest_id !== `${ref.bundle_id}:manifest`
      ) {
        errors.push(
          "governance case review decision closure evidence package delivery manifest ref drifted: manifest_id derivation changed"
        );
      }
    }

    const manifest = payload.manifest_context?.delivery_manifest;
    if (!isPlainObject(payload.manifest_context) || !isPlainObject(manifest)) {
      errors.push(
        "governance case review decision closure evidence package delivery manifest context must be an object"
      );
    } else {
      if (
        payload.manifest_context.manifest_status !==
          GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_STATUS_AVAILABLE ||
        payload.manifest_context.manifest_scope !==
          GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_SCOPE_CURRENT_ACCEPTANCE ||
        manifest.acceptance_state !==
          GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ACCEPTANCE_STATE_READY ||
        manifest.completeness_state !==
          GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_COMPLETENESS_STATE_COMPLETE ||
        manifest.delivery_package_item_count !== 3
      ) {
        errors.push(
          "governance case review decision closure evidence package delivery manifest context envelope drifted"
        );
      }
      if (
        !hasUniqueStrings(manifest.manifest_reason_codes) ||
        JSON.stringify(manifest.manifest_reason_codes) !==
          JSON.stringify(
            GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_REASON_CODES
          )
      ) {
        errors.push(
          "governance case review decision closure evidence package delivery manifest reason codes drifted"
        );
      }
      for (const field of [
        "package_available",
        "explanation_available",
        "consumption_summary_available",
        "bundle_available",
        "manifest_ref_alignment_stable",
        "manifest_listing_deterministic",
        "manifest_listing_consistency_stable",
        "manifest_composition_bounded",
        "manifest_completeness_bounded",
        "manifest_completeness_semantics_stable",
        "manifest_acceptance_surface_bounded",
        "acceptance_readability_stable",
        "manifest_acceptance_readability_consistency_stable",
        "cross_surface_alignment_stable",
        "manifest_export_stable",
        "aggregate_export_only",
        "permit_aggregate_export_only",
      ]) {
        if (manifest[field] !== true) {
          errors.push(
            `governance case review decision closure evidence package delivery manifest field drifted: ${field}`
          );
        }
      }
    }

    const items = payload.delivery_package_items;
    if (!Array.isArray(items) || items.length !== 3) {
      errors.push(
        "governance case review decision closure evidence package delivery manifest items drifted"
      );
    } else {
      const expectedArtifactIds = [
        ref?.package_id,
        ref?.explanation_id,
        ref?.summary_id,
      ];
      const expectedRoles = [
        "delivery_package",
        "delivery_explanation",
        "delivery_consumption_summary",
      ];
      for (let index = 0; index < items.length; index += 1) {
        const item = items[index];
        if (
          !isPlainObject(item) ||
          typeof item.artifact_id !== "string" ||
          typeof item.artifact_kind !== "string" ||
          item.role !== expectedRoles[index] ||
          item.listing_order !== index + 1
        ) {
          errors.push(
            "governance case review decision closure evidence package delivery manifest item listing drifted"
          );
          break;
        }
        if (
          item.artifact_id !== expectedArtifactIds[index] ||
          item.artifact_kind !==
            GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_DELIVERY_MANIFEST_ITEM_KINDS[
              index
            ]
        ) {
          errors.push(
            "governance case review decision closure evidence package delivery manifest item linkage drifted"
          );
          break;
        }
      }
    }

    const validationExports = payload.validation_exports;
    if (!isPlainObject(validationExports)) {
      errors.push(
        "governance case review decision closure evidence package delivery manifest validation exports must be an object"
      );
    } else {
      for (const field of [
        "bundle_surface_required",
        "package_surface_required",
        "explanation_surface_required",
        "consumption_summary_surface_required",
        "manifest_ref_alignment_stable",
        "manifest_listing_deterministic",
        "manifest_listing_consistency_stable",
        "manifest_composition_bounded",
        "manifest_completeness_bounded",
        "manifest_completeness_semantics_stable",
        "manifest_acceptance_surface_bounded",
        "acceptance_readability_stable",
        "manifest_acceptance_readability_consistency_stable",
        "cross_surface_alignment_stable",
        "manifest_export_stable",
        "cross_case_binding_rejected",
        "cross_review_decision_binding_rejected",
        "cross_canonical_action_hash_binding_rejected",
        "complete_manifest_linkage_required",
        "aggregate_export_only",
        "permit_aggregate_export_only",
      ]) {
        if (validationExports[field] !== true) {
          errors.push(
            `governance case review decision closure evidence package delivery manifest validation export drifted: ${field}`
          );
        }
      }
    }

    const preservedSemantics = payload.preserved_semantics;
    if (!isPlainObject(preservedSemantics)) {
      errors.push(
        "governance case review decision closure evidence package delivery manifest preserved semantics must be an object"
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
            `governance case review decision closure evidence package delivery manifest preserved semantic drifted: ${field}`
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
            `governance case review decision closure evidence package delivery manifest preserved semantic drifted: ${field}`
          );
        }
      }
    }
  }

  if (profile.deterministic !== true) {
    errors.push(
      "governance case review decision closure evidence package delivery manifest must remain deterministic"
    );
  }
  if (profile.enforcing !== false) {
    errors.push(
      "governance case review decision closure evidence package delivery manifest must remain non-enforcing"
    );
  }

  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestProfile(
  profile
) {
  const validation =
    validateGovernanceCaseReviewDecisionClosureEvidencePackageDeliveryManifestProfile(
      profile
    );
  if (validation.ok) return profile;
  const err = new Error(
    `governance case review decision closure evidence package delivery manifest profile invalid: ${validation.errors.join(
      "; "
    )}`
  );
  err.validation = validation;
  throw err;
}
