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

export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_KIND =
  "governance_case_review_decision_closure_evidence_package_consumption_summary_profile";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_SCHEMA_ID =
  "mindforge/governance-case-review-decision-closure-evidence-package-consumption-summary-profile/v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_STAGE =
  "governance_case_review_decision_closure_evidence_package_consumption_summary_boundary_phase1_v6_9_0";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONSUMER_SURFACE =
  "guard.audit.governance_case_review_decision_closure_evidence_package_consumption_summary";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_BOUNDARY =
  "governance_case_review_decision_closure_evidence_package_consumption_summary_boundary_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_STATUS_AVAILABLE =
  "available";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SCOPE_CURRENT_PACKAGE =
  "current_closure_evidence_package_delivery_readiness_summary_only";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_DELIVERY_STATE_READY =
  "ready";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_READABILITY_STATE_READABLE =
  "readable";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_REASON_CODES =
  Object.freeze([
    "package_available",
    "explanation_available",
    "explanation_stabilized_surface_available",
    "current_narrative_selected",
    "current_narrative_selection_stable",
    "narrative_section_alignment_stable",
    "section_artifact_binding_stable",
    "section_consumer_consistency_stable",
    "cross_surface_alignment_stable",
    "delivery_readiness_summary_bounded",
    "delivery_readiness_readable",
    "consumer_reading_surface_bounded",
    "summary_export_stable",
    "aggregate_export_only",
    "permit_aggregate_export_only",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_REASON_CODE_ALLOWLIST =
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_REASON_CODES;
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_TOP_LEVEL_FIELDS =
  Object.freeze([
    "kind",
    "version",
    "schema_id",
    "canonical_action_hash",
    "governance_case_review_decision_closure_evidence_package_consumption_summary",
    "deterministic",
    "enforcing",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PAYLOAD_FIELDS =
  Object.freeze([
    "stage",
    "consumer_surface",
    "boundary",
    "closure_evidence_package_consumption_summary_ref",
    "summary_context",
    "validation_exports",
    "preserved_semantics",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_STABLE_EXPORT_SET =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_KIND",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_SCHEMA_ID",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_STAGE",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONSUMER_SURFACE",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_BOUNDARY",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_STATUS_AVAILABLE",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SCOPE_CURRENT_PACKAGE",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_DELIVERY_STATE_READY",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_READABILITY_STATE_READABLE",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_REASON_CODES",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_REASON_CODE_ALLOWLIST",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_TOP_LEVEL_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PAYLOAD_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_STABLE_EXPORT_SET",
    "buildGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile",
    "validateGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile",
    "assertValidGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile",
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
        `governance case review decision closure evidence package consumption summary requires ${label} ${field}=true`
      );
    }
  }
}

function assertFalseFields(source, fields, label) {
  for (const field of fields) {
    if (source[field] !== false) {
      throw new Error(
        `governance case review decision closure evidence package consumption summary requires ${label} ${field}=false`
      );
    }
  }
}

export function buildGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile({
  governanceCaseReviewDecisionClosureEvidencePackageProfile,
  governanceCaseReviewDecisionClosureEvidencePackageExplanationProfile,
}) {
  const packageProfile =
    assertValidGovernanceCaseReviewDecisionClosureEvidencePackageProfile(
      governanceCaseReviewDecisionClosureEvidencePackageProfile
    );
  const explanationProfile =
    assertValidGovernanceCaseReviewDecisionClosureEvidencePackageExplanationProfile(
      governanceCaseReviewDecisionClosureEvidencePackageExplanationProfile
    );
  const packagePayload =
    packageProfile.governance_case_review_decision_closure_evidence_package;
  const explanationPayload =
    explanationProfile.governance_case_review_decision_closure_evidence_package_explanation;
  const packageRef = packagePayload.closure_evidence_package_ref;
  const explanationRef =
    explanationPayload.closure_evidence_package_explanation_ref;
  const packageBasis = packagePayload.package_manifest.package_basis;
  const explanationBasis = explanationPayload.explanation_context.explanation_basis;

  if (
    packagePayload.stage !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_STAGE ||
    packagePayload.package_manifest.package_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_STATUS_PACKAGED ||
    packagePayload.package_manifest.package_scope !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_SCOPE_CURRENT_CLOSURE
  ) {
    throw new Error(
      "governance case review decision closure evidence package consumption summary requires packaged current closure evidence package"
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
      "governance case review decision closure evidence package consumption summary requires available current package explanation"
    );
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
        `governance case review decision closure evidence package consumption summary mismatch: ${field} must remain aligned`
      );
    }
  }
  if (
    packageProfile.canonical_action_hash !==
    explanationProfile.canonical_action_hash
  ) {
    throw new Error(
      "governance case review decision closure evidence package consumption summary mismatch: canonical_action_hash must remain aligned"
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

  return assertValidGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile(
    {
      kind:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_KIND,
      version:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_VERSION,
      schema_id:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_SCHEMA_ID,
      canonical_action_hash: packageProfile.canonical_action_hash,
      governance_case_review_decision_closure_evidence_package_consumption_summary:
        {
          stage:
            GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_STAGE,
          consumer_surface:
            GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONSUMER_SURFACE,
          boundary:
            GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_BOUNDARY,
          closure_evidence_package_consumption_summary_ref: {
            summary_id: `${packageRef.package_id}:consumption-summary`,
            package_id: packageRef.package_id,
            narrative_id: explanationRef.narrative_id,
            narrative_selection_id: explanationRef.narrative_selection_id,
            receipt_id: packageRef.receipt_id,
            explanation_id: packageRef.explanation_id,
            closure_id: packageRef.closure_id,
            case_id: packageRef.case_id,
            review_decision_id: packageRef.review_decision_id,
            attestation_id: packageRef.attestation_id,
          },
          summary_context: {
            summary_status:
              GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_STATUS_AVAILABLE,
            summary_scope:
              GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SCOPE_CURRENT_PACKAGE,
            delivery_readiness: Object.freeze({
              delivery_state:
                GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_DELIVERY_STATE_READY,
              readability_state:
                GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_READABILITY_STATE_READABLE,
              summary_reason_codes: Object.freeze([
                ...GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_REASON_CODES,
              ]),
              package_available: true,
              explanation_available: true,
              explanation_stabilized_surface_available: true,
              current_narrative_selected: true,
              current_narrative_selection_stable: true,
              narrative_section_alignment_stable: true,
              section_artifact_binding_stable: true,
              section_consumer_consistency_stable: true,
              cross_surface_alignment_stable: true,
              delivery_readiness_summary_bounded: true,
              delivery_readiness_readable: true,
              consumer_reading_surface_bounded: true,
              summary_export_stable: true,
              aggregate_export_only: true,
              permit_aggregate_export_only: true,
            }),
          },
          validation_exports: Object.freeze({
            package_surface_required: true,
            explanation_surface_required: true,
            explanation_stabilized_surface_required: true,
            current_narrative_selected_only: true,
            current_narrative_selection_stable: true,
            narrative_section_alignment_stable: true,
            section_artifact_binding_stable: true,
            section_consumer_consistency_stable: true,
            cross_surface_alignment_stable: true,
            delivery_readiness_summary_bounded: true,
            delivery_readiness_readable: true,
            consumer_reading_surface_bounded: true,
            summary_export_stable: true,
            consumption_boundary_bounded: true,
            aggregate_export_only: true,
            permit_aggregate_export_only: true,
            cross_case_binding_rejected: true,
            cross_review_decision_binding_rejected: true,
            cross_canonical_action_hash_binding_rejected: true,
          }),
          preserved_semantics: Object.freeze({
            derived_only: true,
            supporting_artifact_only: true,
            non_authoritative: true,
            additive_only: true,
            non_executing: true,
            default_off: true,
            judgment_source_enabled: false,
            authority_source_enabled: false,
            execution_binding_enabled: false,
            risk_source_enabled: false,
            main_path_takeover: false,
            authority_scope_expansion: false,
            governance_authority_object_addition: false,
            ui_control_plane: false,
          }),
        },
      deterministic: true,
      enforcing: false,
    }
  );
}

export function validateGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile(
  profile
) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: [
        "governance case review decision closure evidence package consumption summary profile must be an object",
      ],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_TOP_LEVEL_FIELDS
    )
  ) {
    errors.push(
      "governance case review decision closure evidence package consumption summary top-level field order drifted"
    );
  }
  if (
    profile.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_KIND ||
    profile.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_VERSION ||
    profile.schema_id !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_SCHEMA_ID ||
    profile.deterministic !== true ||
    profile.enforcing !== false
  ) {
    errors.push(
      "governance case review decision closure evidence package consumption summary profile envelope drifted"
    );
  }
  const payload =
    profile.governance_case_review_decision_closure_evidence_package_consumption_summary;
  if (!isPlainObject(payload)) {
    errors.push(
      "governance case review decision closure evidence package consumption summary payload missing"
    );
    return { ok: false, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PAYLOAD_FIELDS
    )
  ) {
    errors.push(
      "governance case review decision closure evidence package consumption summary payload field order drifted"
    );
  }
  if (
    payload.stage !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_STAGE ||
    payload.consumer_surface !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_CONSUMER_SURFACE ||
    payload.boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_PROFILE_BOUNDARY
  ) {
    errors.push(
      "governance case review decision closure evidence package consumption summary payload envelope drifted"
    );
  }
  if (
    !isPlainObject(payload.closure_evidence_package_consumption_summary_ref) ||
    [
      "summary_id",
      "package_id",
      "narrative_id",
      "narrative_selection_id",
      "receipt_id",
      "explanation_id",
      "closure_id",
      "case_id",
      "review_decision_id",
      "attestation_id",
    ].some(
      (field) =>
        typeof payload.closure_evidence_package_consumption_summary_ref?.[field] !==
          "string" ||
        payload.closure_evidence_package_consumption_summary_ref[field].length === 0
    )
  ) {
    errors.push(
      "governance case review decision closure evidence package consumption summary ref fields drifted"
    );
  }
  if (!isPlainObject(payload.summary_context)) {
    errors.push(
      "governance case review decision closure evidence package consumption summary context missing"
    );
    return { ok: false, errors };
  }
  if (
    payload.summary_context.summary_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_STATUS_AVAILABLE ||
    payload.summary_context.summary_scope !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_SCOPE_CURRENT_PACKAGE
  ) {
    errors.push(
      "governance case review decision closure evidence package consumption summary status drifted"
    );
  }
  const readiness = payload.summary_context.delivery_readiness;
  if (
    !isPlainObject(readiness) ||
    readiness.delivery_state !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_DELIVERY_STATE_READY ||
    readiness.readability_state !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMPTION_SUMMARY_READABILITY_STATE_READABLE
  ) {
    errors.push(
      "governance case review decision closure evidence package consumption summary readiness envelope drifted"
    );
  }
  assertTrueFields(
    readiness,
    [
      "package_available",
      "explanation_available",
      "explanation_stabilized_surface_available",
      "current_narrative_selected",
      "current_narrative_selection_stable",
      "narrative_section_alignment_stable",
      "section_artifact_binding_stable",
      "section_consumer_consistency_stable",
      "cross_surface_alignment_stable",
      "delivery_readiness_summary_bounded",
      "delivery_readiness_readable",
      "consumer_reading_surface_bounded",
      "summary_export_stable",
      "aggregate_export_only",
      "permit_aggregate_export_only",
    ],
    "delivery readiness"
  );
  if (!hasUniqueStrings(readiness.summary_reason_codes)) {
    errors.push(
      "governance case review decision closure evidence package consumption summary reason codes drifted"
    );
  }
  assertTrueFields(
    payload.validation_exports,
    [
      "package_surface_required",
      "explanation_surface_required",
      "explanation_stabilized_surface_required",
      "current_narrative_selected_only",
      "current_narrative_selection_stable",
      "narrative_section_alignment_stable",
      "section_artifact_binding_stable",
      "section_consumer_consistency_stable",
      "cross_surface_alignment_stable",
      "delivery_readiness_summary_bounded",
      "delivery_readiness_readable",
      "consumer_reading_surface_bounded",
      "summary_export_stable",
      "consumption_boundary_bounded",
      "aggregate_export_only",
      "permit_aggregate_export_only",
      "cross_case_binding_rejected",
      "cross_review_decision_binding_rejected",
      "cross_canonical_action_hash_binding_rejected",
    ],
    "validation export"
  );
  assertTrueFields(
    payload.preserved_semantics,
    [
      "derived_only",
      "supporting_artifact_only",
      "non_authoritative",
      "additive_only",
      "non_executing",
      "default_off",
    ],
    "preserved semantic"
  );
  assertFalseFields(
    payload.preserved_semantics,
    [
      "judgment_source_enabled",
      "authority_source_enabled",
      "execution_binding_enabled",
      "risk_source_enabled",
      "main_path_takeover",
      "authority_scope_expansion",
      "governance_authority_object_addition",
      "ui_control_plane",
    ],
    "preserved semantic"
  );
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile(
  profile
) {
  const validation =
    validateGovernanceCaseReviewDecisionClosureEvidencePackageConsumptionSummaryProfile(
      profile
    );
  if (validation.ok) return profile;
  const err = new Error(
    `governance case review decision closure evidence package consumption summary profile invalid: ${validation.errors.join(
      "; "
    )}`
  );
  err.validation = validation;
  throw err;
}
