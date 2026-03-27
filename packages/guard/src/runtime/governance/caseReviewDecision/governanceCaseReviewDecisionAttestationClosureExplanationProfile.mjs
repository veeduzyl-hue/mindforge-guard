import {
  assertValidGovernanceCaseReviewDecisionAttestationApplicabilityClosureProfile,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_SCOPE_CURRENT_ATTESTATION,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_STATUS_CLOSED,
} from "./governanceCaseReviewDecisionAttestationApplicabilityClosureProfile.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_STATUS_ATTESTED,
  assertValidGovernanceCaseReviewDecisionAttestationProfile,
} from "./governanceCaseReviewDecisionAttestationProfile.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_STATUS_APPLICABLE,
  assertValidGovernanceCaseReviewDecisionApplicabilityProfile,
} from "./governanceCaseReviewDecisionApplicabilityProfile.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_STATUS_AVAILABLE,
  assertValidGovernanceCaseReviewDecisionApplicabilityExplanationProfile,
} from "./governanceCaseReviewDecisionApplicabilityExplanationProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_KIND =
  "governance_case_review_decision_attestation_closure_explanation_profile";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_SCHEMA_ID =
  "mindforge/governance-case-review-decision-attestation-closure-explanation-profile/v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_STAGE =
  "governance_case_review_decision_attestation_closure_explanation_boundary_phase1_v6_6_0";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONSUMER_SURFACE =
  "guard.audit.governance_case_review_decision_attestation_closure_explanation";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_BOUNDARY =
  "governance_case_review_decision_attestation_closure_explanation_boundary_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_STATUS_AVAILABLE =
  "available";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_SCOPE_CURRENT_CLOSURE =
  "current_attestation_applicability_closure_only";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_REASON_CODES =
  Object.freeze([
    "closure_available",
    "attestation_available",
    "applicability_available",
    "applicability_explanation_available",
    "current_explanation_selected",
    "unique_current_explanation_required",
    "current_explanation_selection_stable",
    "current_closure_selected",
    "current_closure_selection_stable",
    "closure_validity_current",
    "attestation_applicability_binding_unambiguous",
    "applicability_explanation_alignment_current",
    "continuity_lineage_aligned",
    "closure_uniqueness_bounded",
    "supporting_basis_complete",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_REASON_CODE_ALLOWLIST =
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_REASON_CODES;
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_TOP_LEVEL_FIELDS =
  Object.freeze([
    "kind",
    "version",
    "schema_id",
    "canonical_action_hash",
    "governance_case_review_decision_attestation_closure_explanation",
    "deterministic",
    "enforcing",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PAYLOAD_FIELDS =
  Object.freeze([
    "stage",
    "consumer_surface",
    "boundary",
    "attestation_closure_explanation_ref",
    "explanation_context",
    "validation_exports",
    "preserved_semantics",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_STABLE_EXPORT_SET =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_KIND",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_SCHEMA_ID",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_STAGE",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONSUMER_SURFACE",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_BOUNDARY",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_STATUS_AVAILABLE",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_SCOPE_CURRENT_CLOSURE",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_REASON_CODES",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_REASON_CODE_ALLOWLIST",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_TOP_LEVEL_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PAYLOAD_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_STABLE_EXPORT_SET",
    "buildGovernanceCaseReviewDecisionAttestationClosureExplanationProfile",
    "validateGovernanceCaseReviewDecisionAttestationClosureExplanationProfile",
    "assertValidGovernanceCaseReviewDecisionAttestationClosureExplanationProfile",
  ]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasUniqueStrings(values) {
  return Array.isArray(values) && new Set(values).size === values.length;
}

function ensureKnownReasonCodes(reasonCodes) {
  return (
    Array.isArray(reasonCodes) &&
    reasonCodes.every((code) =>
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_REASON_CODE_ALLOWLIST.includes(
        code
      )
    )
  );
}

function assertTrueFields(source, fields, label) {
  for (const field of fields) {
    if (source[field] !== true) {
      throw new Error(`${label} must preserve ${field}`);
    }
  }
}

function assertFalseFields(source, fields, label) {
  for (const field of fields) {
    if (source[field] !== false) {
      throw new Error(`${label} must preserve ${field}=false`);
    }
  }
}

function assertAlignedIdentity({ label, ref, caseId, reviewDecisionId, hash, expectedHash }) {
  if (!isPlainObject(ref)) {
    throw new Error(
      `governance case review decision attestation closure explanation missing support: ${label} ref must be an object`
    );
  }
  if (ref.case_id !== caseId) {
    throw new Error(
      `governance case review decision attestation closure explanation mismatch: ${label} must remain case aligned`
    );
  }
  const currentReviewDecisionId =
    ref.review_decision_id ?? ref.current_review_decision_id ?? null;
  if (currentReviewDecisionId !== reviewDecisionId) {
    throw new Error(
      `governance case review decision attestation closure explanation mismatch: ${label} must remain review decision aligned`
    );
  }
  if (hash !== expectedHash) {
    throw new Error(
      `governance case review decision attestation closure explanation mismatch: ${label} must remain canonical action hash aligned`
    );
  }
}

function assertClosureSemantics(closurePayload) {
  const ref = closurePayload.attestation_applicability_closure_ref;
  const context = closurePayload.closure_context;
  const basis = context.closure_basis;
  const validationExports = closurePayload.validation_exports;
  const preservedSemantics = closurePayload.preserved_semantics;

  if (
    context.closure_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_STATUS_CLOSED ||
    context.closure_scope !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_SCOPE_CURRENT_ATTESTATION
  ) {
    throw new Error(
      "governance case review decision attestation closure explanation requires current closure scope"
    );
  }
  for (const field of [
    "closure_id",
    "closure_selection_id",
    "case_id",
    "review_decision_id",
    "attestation_id",
    "applicability_id",
    "applicability_explanation_id",
    "current_selection_id",
    "selection_explanation_id",
    "selection_receipt_id",
  ]) {
    if (typeof ref[field] !== "string" || ref[field].length === 0) {
      throw new Error(
        `governance case review decision attestation closure explanation requires closure ref ${field}`
      );
    }
  }
  assertTrueFields(
    basis,
    [
      "attestation_available",
      "applicability_available",
      "applicability_explanation_available",
      "current_closure_selected",
      "unique_current_closure_required",
      "current_closure_selection_stable",
      "attestation_applicability_binding_unambiguous",
      "applicability_explanation_binding_unambiguous",
      "continuity_lineage_aligned",
      "continuity_chain_current",
      "supporting_linkage_bounded",
      "derived_only",
      "supporting_artifact_only",
      "non_authoritative",
      "non_authoritative_support_only",
      "closure_linkage_only",
      "aggregate_export_only",
      "permit_aggregate_export_only",
    ],
    "closure basis"
  );
  assertTrueFields(
    validationExports,
    [
      "attestation_available",
      "applicability_available",
      "applicability_explanation_available",
      "export_surface_available",
      "unique_current_attestation_view_required",
      "unique_current_closure_required",
      "current_closure_selection_stable",
      "applicability_alignment_required",
      "applicability_explanation_alignment_required",
      "attestation_applicability_binding_unambiguous",
      "applicability_explanation_binding_unambiguous",
      "continuity_lineage_alignment_required",
      "continuity_chain_intact_required",
      "broken_continuity_rejected",
      "cross_case_binding_rejected",
      "cross_review_decision_binding_rejected",
      "cross_canonical_action_hash_binding_rejected",
      "complete_supporting_linkage_required",
      "non_authoritative_support_only",
      "aggregate_export_only",
      "permit_aggregate_export_only",
    ],
    "closure validation export"
  );
  assertTrueFields(
    preservedSemantics,
    [
      "derived_only",
      "supporting_artifact_only",
      "non_authoritative",
      "recommendation_only",
      "additive_only",
      "non_executing",
      "default_off",
    ],
    "closure preserved semantic"
  );
  assertFalseFields(
    preservedSemantics,
    [
      "judgment_source_enabled",
      "authority_source_enabled",
      "execution_binding_enabled",
      "risk_source_enabled",
      "selection_feedback_enabled",
      "main_path_takeover",
      "authority_scope_expansion",
      "governance_object_addition",
      "ui_control_plane",
      "observability_platform_behavior",
    ],
    "closure preserved semantic"
  );
}

function assertAttestationSemantics(payload) {
  if (
    payload.attestation_context.attestation_status !==
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_STATUS_ATTESTED
  ) {
    throw new Error(
      "governance case review decision attestation closure explanation requires current attestation"
    );
  }
  assertTrueFields(
    payload.attestation_context.attestation_basis,
    [
      "selection_explanation_linked",
      "selection_receipt_linked",
      "applicability_linked",
      "applicability_explanation_linked",
      "derived_only",
      "supporting_artifact_only",
      "non_authoritative",
      "no_main_path_takeover",
    ],
    "attestation basis"
  );
}

function assertApplicabilitySemantics(payload) {
  if (
    payload.applicability_context.applicability_status !==
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_STATUS_APPLICABLE
  ) {
    throw new Error(
      "governance case review decision attestation closure explanation requires applicable applicability"
    );
  }
  assertTrueFields(
    payload.validation_exports,
    [
      "current_selection_final_acceptance_available",
      "selected_review_decision_profile_available",
      "export_surface_available",
    ],
    "applicability validation export"
  );
}

function assertApplicabilityExplanationSemantics(payload) {
  if (
    payload.explanation_context.explanation_status !==
    GOVERNANCE_CASE_REVIEW_DECISION_APPLICABILITY_EXPLANATION_STATUS_AVAILABLE
  ) {
    throw new Error(
      "governance case review decision attestation closure explanation requires applicability explanation availability"
    );
  }
  assertTrueFields(
    payload.validation_exports,
    [
      "current_selection_final_acceptance_available",
      "applicability_profile_available",
      "selected_review_decision_profile_available",
      "export_surface_available",
    ],
    "applicability explanation validation export"
  );
}

export function buildGovernanceCaseReviewDecisionAttestationClosureExplanationProfile({
  governanceCaseReviewDecisionAttestationApplicabilityClosureProfile,
  governanceCaseReviewDecisionAttestationProfile,
  governanceCaseReviewDecisionApplicabilityProfile,
  governanceCaseReviewDecisionApplicabilityExplanationProfile,
}) {
  const closureProfile =
    assertValidGovernanceCaseReviewDecisionAttestationApplicabilityClosureProfile(
      governanceCaseReviewDecisionAttestationApplicabilityClosureProfile
    );
  const attestationProfile =
    assertValidGovernanceCaseReviewDecisionAttestationProfile(
      governanceCaseReviewDecisionAttestationProfile
    );
  const applicabilityProfile =
    assertValidGovernanceCaseReviewDecisionApplicabilityProfile(
      governanceCaseReviewDecisionApplicabilityProfile
    );
  const applicabilityExplanationProfile =
    assertValidGovernanceCaseReviewDecisionApplicabilityExplanationProfile(
      governanceCaseReviewDecisionApplicabilityExplanationProfile
    );

  const closurePayload =
    closureProfile.governance_case_review_decision_attestation_applicability_closure;
  const closureRef = closurePayload.attestation_applicability_closure_ref;
  const closureContext = closurePayload.closure_context;
  const attestationPayload =
    attestationProfile.governance_case_review_decision_attestation;
  const attestationRef = attestationPayload.attestation_ref;
  const applicabilityPayload =
    applicabilityProfile.governance_case_review_decision_applicability;
  const applicabilityRef = applicabilityPayload.applicability_ref;
  const applicabilityExplanationPayload =
    applicabilityExplanationProfile.governance_case_review_decision_applicability_explanation;
  const applicabilityExplanationRef =
    applicabilityExplanationPayload.applicability_explanation_ref;

  assertClosureSemantics(closurePayload);
  assertAttestationSemantics(attestationPayload);
  assertApplicabilitySemantics(applicabilityPayload);
  assertApplicabilityExplanationSemantics(applicabilityExplanationPayload);

  const caseId = closureRef.case_id;
  const reviewDecisionId = closureRef.review_decision_id;
  const canonicalActionHash = closureProfile.canonical_action_hash;

  assertAlignedIdentity({
    label: "attestation",
    ref: attestationRef,
    caseId,
    reviewDecisionId,
    hash: attestationProfile.canonical_action_hash,
    expectedHash: canonicalActionHash,
  });
  assertAlignedIdentity({
    label: "applicability",
    ref: applicabilityRef,
    caseId,
    reviewDecisionId,
    hash: applicabilityProfile.canonical_action_hash,
    expectedHash: canonicalActionHash,
  });
  assertAlignedIdentity({
    label: "applicability explanation",
    ref: applicabilityExplanationRef,
    caseId,
    reviewDecisionId,
    hash: applicabilityExplanationProfile.canonical_action_hash,
    expectedHash: canonicalActionHash,
  });

  if (
    closureRef.attestation_id !== attestationRef.attestation_id ||
    closureRef.current_selection_id !== attestationRef.current_selection_id ||
    closureRef.selection_explanation_id !== attestationRef.selection_explanation_id ||
    closureRef.selection_receipt_id !== attestationRef.selection_receipt_id
  ) {
    throw new Error(
      "governance case review decision attestation closure explanation mismatch: supporting linkage must remain aligned"
    );
  }

  return {
    kind:
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_KIND,
    version:
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_VERSION,
    schema_id:
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_SCHEMA_ID,
    canonical_action_hash: canonicalActionHash,
    governance_case_review_decision_attestation_closure_explanation: {
      stage:
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_STAGE,
      consumer_surface:
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONSUMER_SURFACE,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_BOUNDARY,
      attestation_closure_explanation_ref: {
        explanation_id: `${closureRef.closure_id}:explanation`,
        explanation_selection_id: `${closureRef.closure_selection_id}:explanation`,
        closure_id: closureRef.closure_id,
        closure_selection_id: closureRef.closure_selection_id,
        case_id: caseId,
        review_decision_id: reviewDecisionId,
        attestation_id: closureRef.attestation_id,
        applicability_id: closureRef.applicability_id,
        applicability_explanation_id: closureRef.applicability_explanation_id,
        current_selection_id: closureRef.current_selection_id,
      },
      explanation_context: {
        explanation_status:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_STATUS_AVAILABLE,
        continuity_status: closureContext.continuity_status,
        supersession_status: closureContext.supersession_status,
        closure_basis: Object.freeze({ ...closureContext.closure_basis }),
        explanation_scope:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_SCOPE_CURRENT_CLOSURE,
        explanation_basis: Object.freeze({
          explanation_reason_codes: Object.freeze([
            ...GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_REASON_CODES,
          ]),
          current_explanation_selected: true,
          unique_current_explanation_required: true,
          current_explanation_selection_stable: true,
          current_closure_selection_basis: true,
          closure_validity_basis: true,
          closure_selection_alignment_basis: true,
          attestation_selection_alignment_basis: true,
          attestation_applicability_binding_basis: true,
          applicability_explanation_alignment_basis: true,
          continuity_lineage_alignment_basis: true,
          closure_uniqueness_basis: true,
          explanation_consumption_boundary_bounded: true,
          supporting_basis_complete: true,
        }),
        artifact_version:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_VERSION,
      },
      validation_exports: {
        current_explanation_selected_only: true,
        unique_current_explanation_required: true,
        current_explanation_selection_stable: true,
        closure_available: true,
        attestation_available: true,
        applicability_available: true,
        applicability_explanation_available: true,
        export_surface_available: true,
        unique_current_closure_required: true,
        current_closure_selection_stable: true,
        closure_validity_basis_required: true,
        closure_selection_alignment_required: true,
        attestation_selection_alignment_required: true,
        applicability_alignment_required: true,
        applicability_explanation_alignment_required: true,
        continuity_lineage_alignment_required: true,
        cross_case_binding_rejected: true,
        cross_review_decision_binding_rejected: true,
        cross_canonical_action_hash_binding_rejected: true,
        complete_supporting_linkage_required: true,
        consumption_boundary_bounded: true,
        permit_aggregate_export_only: true,
      },
      preserved_semantics: {
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
        selection_feedback_enabled: false,
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

export function validateGovernanceCaseReviewDecisionAttestationClosureExplanationProfile(
  profile
) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: [
        "governance case review decision attestation closure explanation profile must be an object",
      ],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_TOP_LEVEL_FIELDS
    )
  ) {
    errors.push(
      "governance case review decision attestation closure explanation top-level field order drifted"
    );
  }
  if (
    profile.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_KIND ||
    profile.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_VERSION ||
    profile.schema_id !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_SCHEMA_ID
  ) {
    errors.push(
      "governance case review decision attestation closure explanation profile envelope drifted"
    );
  }
  if (
    typeof profile.canonical_action_hash !== "string" ||
    profile.canonical_action_hash.length === 0
  ) {
    errors.push(
      "governance case review decision attestation closure explanation canonical_action_hash is required"
    );
  }
  if (profile.deterministic !== true || profile.enforcing !== false) {
    errors.push(
      "governance case review decision attestation closure explanation execution flags drifted"
    );
  }

  const payload =
    profile.governance_case_review_decision_attestation_closure_explanation;
  if (!isPlainObject(payload)) {
    errors.push(
      "governance case review decision attestation closure explanation payload missing"
    );
    return { ok: false, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PAYLOAD_FIELDS
    )
  ) {
    errors.push(
      "governance case review decision attestation closure explanation payload field order drifted"
    );
  }
  if (
    payload.stage !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_STAGE ||
    payload.consumer_surface !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_CONSUMER_SURFACE ||
    payload.boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_BOUNDARY
  ) {
    errors.push(
      "governance case review decision attestation closure explanation payload envelope drifted"
    );
  }
  const ref = payload.attestation_closure_explanation_ref;
  const context = payload.explanation_context;
  const validationExports = payload.validation_exports;
  const preservedSemantics = payload.preserved_semantics;
  if (
    !isPlainObject(ref) ||
    !isPlainObject(context) ||
    !isPlainObject(validationExports) ||
    !isPlainObject(preservedSemantics)
  ) {
    errors.push(
      "governance case review decision attestation closure explanation payload structure drifted"
    );
    return { ok: false, errors };
  }
  for (const field of [
    "explanation_id",
    "explanation_selection_id",
    "closure_id",
    "closure_selection_id",
    "case_id",
    "review_decision_id",
    "attestation_id",
    "applicability_id",
    "applicability_explanation_id",
    "current_selection_id",
  ]) {
    if (typeof ref[field] !== "string" || ref[field].length === 0) {
      errors.push(
        `governance case review decision attestation closure explanation ref ${field} is required`
      );
    }
  }
  if (
    context.explanation_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_STATUS_AVAILABLE ||
    context.explanation_scope !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_SCOPE_CURRENT_CLOSURE
  ) {
    errors.push(
      "governance case review decision attestation closure explanation scope or status drifted"
    );
  }
  if (
    !isPlainObject(context.closure_basis) ||
    !isPlainObject(context.explanation_basis)
  ) {
    errors.push(
      "governance case review decision attestation closure explanation basis structure drifted"
    );
    return { ok: false, errors };
  }
  if (
    !ensureKnownReasonCodes(context.explanation_basis.explanation_reason_codes) ||
    !hasUniqueStrings(context.explanation_basis.explanation_reason_codes)
  ) {
    errors.push(
      "governance case review decision attestation closure explanation reason codes drifted"
    );
  }
  for (const field of [
    "current_explanation_selected",
    "unique_current_explanation_required",
    "current_explanation_selection_stable",
    "current_closure_selection_basis",
    "closure_validity_basis",
    "closure_selection_alignment_basis",
    "attestation_selection_alignment_basis",
    "attestation_applicability_binding_basis",
    "applicability_explanation_alignment_basis",
    "continuity_lineage_alignment_basis",
    "closure_uniqueness_basis",
    "explanation_consumption_boundary_bounded",
    "supporting_basis_complete",
  ]) {
    if (context.explanation_basis[field] !== true) {
      errors.push(
        `governance case review decision attestation closure explanation basis drifted: ${field}`
      );
    }
  }
  if (
    context.artifact_version !==
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_PROFILE_VERSION
  ) {
    errors.push(
      "governance case review decision attestation closure explanation artifact_version drifted"
    );
  }
  for (const field of [
    "current_explanation_selected_only",
    "unique_current_explanation_required",
    "current_explanation_selection_stable",
    "closure_available",
    "attestation_available",
    "applicability_available",
    "applicability_explanation_available",
    "export_surface_available",
    "unique_current_closure_required",
    "current_closure_selection_stable",
    "closure_validity_basis_required",
    "closure_selection_alignment_required",
    "attestation_selection_alignment_required",
    "applicability_alignment_required",
    "applicability_explanation_alignment_required",
    "continuity_lineage_alignment_required",
    "cross_case_binding_rejected",
    "cross_review_decision_binding_rejected",
    "cross_canonical_action_hash_binding_rejected",
    "complete_supporting_linkage_required",
    "consumption_boundary_bounded",
    "permit_aggregate_export_only",
  ]) {
    if (validationExports[field] !== true) {
      errors.push(
        `governance case review decision attestation closure explanation validation export drifted: ${field}`
      );
    }
  }
  for (const field of [
    "derived_only",
    "supporting_artifact_only",
    "non_authoritative",
    "additive_only",
    "non_executing",
    "default_off",
  ]) {
    if (preservedSemantics[field] !== true) {
      errors.push(
        `governance case review decision attestation closure explanation preserved semantic drifted: ${field}`
      );
    }
  }
  for (const field of [
    "judgment_source_enabled",
    "authority_source_enabled",
    "execution_binding_enabled",
    "risk_source_enabled",
    "selection_feedback_enabled",
    "main_path_takeover",
    "authority_scope_expansion",
    "governance_object_addition",
    "ui_control_plane",
  ]) {
    if (preservedSemantics[field] !== false) {
      errors.push(
        `governance case review decision attestation closure explanation preserved semantic drifted: ${field}`
      );
    }
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionAttestationClosureExplanationProfile(
  profile
) {
  const validation =
    validateGovernanceCaseReviewDecisionAttestationClosureExplanationProfile(
      profile
    );
  if (validation.ok) return profile;
  const err = new Error(
    `governance case review decision attestation closure explanation profile invalid: ${validation.errors.join(
      "; "
    )}`
  );
  err.validation = validation;
  throw err;
}
