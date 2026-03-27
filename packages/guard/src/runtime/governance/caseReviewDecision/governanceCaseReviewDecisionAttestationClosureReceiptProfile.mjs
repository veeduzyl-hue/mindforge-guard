import {
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_SCOPE_CURRENT_ATTESTATION,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_STATUS_CLOSED,
  assertValidGovernanceCaseReviewDecisionAttestationApplicabilityClosureProfile,
} from "./governanceCaseReviewDecisionAttestationApplicabilityClosureProfile.mjs";
import {
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_SCOPE_CURRENT_CLOSURE,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_STATUS_AVAILABLE,
  assertValidGovernanceCaseReviewDecisionAttestationClosureExplanationProfile,
} from "./governanceCaseReviewDecisionAttestationClosureExplanationProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_KIND =
  "governance_case_review_decision_attestation_closure_receipt_profile";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_SCHEMA_ID =
  "mindforge/governance-case-review-decision-attestation-closure-receipt-profile/v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_STAGE =
  "governance_case_review_decision_attestation_closure_receipt_boundary_phase1_v6_7_0";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_CONSUMER_SURFACE =
  "guard.audit.governance_case_review_decision_attestation_closure_receipt";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_BOUNDARY =
  "governance_case_review_decision_attestation_closure_receipt_boundary_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_STATUS_RECORDED =
  "recorded";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_SCOPE_CURRENT_CLOSURE =
  "current_attestation_applicability_closure_explanation_receipt_only";
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_REASON_CODES =
  Object.freeze([
    "closure_available",
    "closure_explanation_available",
    "current_closure_selected",
    "current_explanation_selected",
    "current_explanation_selection_stable",
    "closure_selection_alignment_current",
    "attestation_selection_alignment_current",
    "attestation_applicability_binding_current",
    "applicability_explanation_alignment_current",
    "continuity_lineage_aligned",
    "supporting_basis_complete",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_REASON_CODE_ALLOWLIST =
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_REASON_CODES;
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_TOP_LEVEL_FIELDS =
  Object.freeze([
    "kind",
    "version",
    "schema_id",
    "canonical_action_hash",
    "governance_case_review_decision_attestation_closure_receipt",
    "deterministic",
    "enforcing",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PAYLOAD_FIELDS =
  Object.freeze([
    "stage",
    "consumer_surface",
    "boundary",
    "attestation_closure_receipt_ref",
    "receipt_context",
    "validation_exports",
    "preserved_semantics",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_STABLE_EXPORT_SET =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_KIND",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_SCHEMA_ID",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_STAGE",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_CONSUMER_SURFACE",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_BOUNDARY",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_STATUS_RECORDED",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_SCOPE_CURRENT_CLOSURE",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_REASON_CODES",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_REASON_CODE_ALLOWLIST",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_TOP_LEVEL_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PAYLOAD_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_STABLE_EXPORT_SET",
    "buildGovernanceCaseReviewDecisionAttestationClosureReceiptProfile",
    "validateGovernanceCaseReviewDecisionAttestationClosureReceiptProfile",
    "assertValidGovernanceCaseReviewDecisionAttestationClosureReceiptProfile",
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
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_REASON_CODE_ALLOWLIST.includes(
        code
      )
    )
  );
}

function assertTrueFields(container, fields, contextLabel) {
  for (const field of fields) {
    if (container[field] !== true) {
      throw new Error(
        `governance case review decision attestation closure receipt requires ${contextLabel} ${field}=true`
      );
    }
  }
}

function assertFalseFields(container, fields, contextLabel) {
  for (const field of fields) {
    if (container[field] !== false) {
      throw new Error(
        `governance case review decision attestation closure receipt requires ${contextLabel} ${field}=false`
      );
    }
  }
}

function assertAlignedIdentity(left, right, fields, contextLabel) {
  for (const field of fields) {
    if (left[field] !== right[field]) {
      throw new Error(
        `governance case review decision attestation closure receipt ${contextLabel} mismatch: ${field} must remain aligned`
      );
    }
  }
}

function assertClosureSemantics(payload) {
  if (
    payload.receipt_context.closure_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_STATUS_CLOSED ||
    payload.receipt_context.closure_scope !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_SCOPE_CURRENT_ATTESTATION
  ) {
    throw new Error(
      "governance case review decision attestation closure receipt requires current closure availability"
    );
  }
  assertTrueFields(
    payload.receipt_context.closure_basis,
    [
      "current_closure_selected",
      "unique_current_closure_required",
      "current_closure_selection_stable",
      "attestation_applicability_binding_unambiguous",
      "applicability_explanation_binding_unambiguous",
      "continuity_lineage_aligned",
      "derived_only",
      "supporting_artifact_only",
      "non_authoritative",
      "closure_linkage_only",
      "aggregate_export_only",
      "permit_aggregate_export_only",
    ],
    "closure basis"
  );
  assertTrueFields(
    payload.validation_exports,
    [
      "closure_available",
      "closure_explanation_available",
      "current_closure_selected_only",
      "current_explanation_selected_only",
      "unique_current_closure_required",
      "unique_current_explanation_required",
      "current_closure_selection_stable",
      "current_explanation_selection_stable",
      "closure_selection_alignment_required",
      "attestation_selection_alignment_required",
      "attestation_applicability_binding_required",
      "applicability_explanation_alignment_required",
      "continuity_lineage_alignment_required",
      "cross_case_binding_rejected",
      "cross_review_decision_binding_rejected",
      "cross_canonical_action_hash_binding_rejected",
      "complete_supporting_linkage_required",
      "receipt_linkage_only",
      "aggregate_export_only",
      "permit_aggregate_export_only",
    ],
    "validation export"
  );
}

function assertExplanationSemantics(payload) {
  if (
    payload.receipt_context.explanation_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_STATUS_AVAILABLE ||
    payload.receipt_context.explanation_scope !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_SCOPE_CURRENT_CLOSURE
  ) {
    throw new Error(
      "governance case review decision attestation closure receipt requires current closure explanation availability"
    );
  }
  assertTrueFields(
    payload.receipt_context.explanation_basis,
    [
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
      "explanation_consumption_boundary_bounded",
      "supporting_basis_complete",
    ],
    "explanation basis"
  );
}

function assertPreservedSemantics(semantics) {
  assertTrueFields(
    semantics,
    [
      "derived_only",
      "supporting_artifact_only",
      "non_authoritative",
      "recommendation_only",
      "additive_only",
      "non_executing",
      "default_off",
    ],
    "preserved semantic"
  );
  assertFalseFields(
    semantics,
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
      "closure_traceability",
      "cryptographic_receipt_seal",
    ],
    "preserved semantic"
  );
}

export function buildGovernanceCaseReviewDecisionAttestationClosureReceiptProfile({
  governanceCaseReviewDecisionAttestationApplicabilityClosureProfile,
  governanceCaseReviewDecisionAttestationClosureExplanationProfile,
}) {
  const closure =
    assertValidGovernanceCaseReviewDecisionAttestationApplicabilityClosureProfile(
      governanceCaseReviewDecisionAttestationApplicabilityClosureProfile
    );
  const explanation =
    assertValidGovernanceCaseReviewDecisionAttestationClosureExplanationProfile(
      governanceCaseReviewDecisionAttestationClosureExplanationProfile
    );

  const closurePayload =
    closure.governance_case_review_decision_attestation_applicability_closure;
  const explanationPayload =
    explanation.governance_case_review_decision_attestation_closure_explanation;
  const closureRef = closurePayload.attestation_applicability_closure_ref;
  const explanationRef = explanationPayload.attestation_closure_explanation_ref;

  assertAlignedIdentity(
    closureRef,
    explanationRef,
    [
      "closure_id",
      "closure_selection_id",
      "case_id",
      "review_decision_id",
      "attestation_id",
      "applicability_id",
      "applicability_explanation_id",
      "current_selection_id",
    ],
    "closure/explanation"
  );
  if (closure.canonical_action_hash !== explanation.canonical_action_hash) {
    throw new Error(
      "governance case review decision attestation closure receipt mismatch: canonical_action_hash must remain aligned"
    );
  }

  const receipt = {
    kind: GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_KIND,
    version:
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_VERSION,
    schema_id:
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_SCHEMA_ID,
    canonical_action_hash: closure.canonical_action_hash,
    governance_case_review_decision_attestation_closure_receipt: {
      stage:
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_STAGE,
      consumer_surface:
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_CONSUMER_SURFACE,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_BOUNDARY,
      attestation_closure_receipt_ref: {
        receipt_id: `${closureRef.closure_id}:receipt`,
        explanation_id: explanationRef.explanation_id,
        explanation_selection_id: explanationRef.explanation_selection_id,
        closure_id: closureRef.closure_id,
        closure_selection_id: closureRef.closure_selection_id,
        case_id: closureRef.case_id,
        review_decision_id: closureRef.review_decision_id,
        attestation_id: closureRef.attestation_id,
        applicability_id: closureRef.applicability_id,
        applicability_explanation_id: closureRef.applicability_explanation_id,
        current_selection_id: closureRef.current_selection_id,
      },
      receipt_context: {
        closure_status: closurePayload.closure_context.closure_status,
        closure_scope: closurePayload.closure_context.closure_scope,
        explanation_status:
          explanationPayload.explanation_context.explanation_status,
        explanation_scope: explanationPayload.explanation_context.explanation_scope,
        closure_basis: Object.freeze({
          ...closurePayload.closure_context.closure_basis,
        }),
        explanation_basis: Object.freeze({
          ...explanationPayload.explanation_context.explanation_basis,
        }),
        receipt_scope:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_SCOPE_CURRENT_CLOSURE,
        receipt_status:
          GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_STATUS_RECORDED,
        receipt_basis: Object.freeze({
          receipt_reason_codes: Object.freeze([
            ...GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_REASON_CODES,
          ]),
          closure_available: true,
          closure_explanation_available: true,
          current_closure_selected: true,
          current_explanation_selected: true,
          current_explanation_selection_stable: true,
          closure_selection_alignment_current: true,
          attestation_selection_alignment_current: true,
          attestation_applicability_binding_current: true,
          applicability_explanation_alignment_current: true,
          continuity_lineage_aligned: true,
          supporting_basis_complete: true,
          receipt_linkage_only: true,
          aggregate_export_only: true,
          permit_aggregate_export_only: true,
        }),
        receipt_status_inputs: Object.freeze({
          current_closure_only: true,
          current_explanation_only: true,
          stable_current_selection_only: true,
          complete_supporting_linkage_required: true,
        }),
      },
      validation_exports: Object.freeze({
        closure_available: true,
        closure_explanation_available: true,
        current_closure_selected_only: true,
        current_explanation_selected_only: true,
        unique_current_closure_required: true,
        unique_current_explanation_required: true,
        current_closure_selection_stable: true,
        current_explanation_selection_stable: true,
        closure_selection_alignment_required: true,
        attestation_selection_alignment_required: true,
        attestation_applicability_binding_required: true,
        applicability_explanation_alignment_required: true,
        continuity_lineage_alignment_required: true,
        cross_case_binding_rejected: true,
        cross_review_decision_binding_rejected: true,
        cross_canonical_action_hash_binding_rejected: true,
        complete_supporting_linkage_required: true,
        receipt_linkage_only: true,
        aggregate_export_only: true,
        permit_aggregate_export_only: true,
      }),
      preserved_semantics: Object.freeze({
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
        selection_feedback_enabled: false,
        main_path_takeover: false,
        authority_scope_expansion: false,
        governance_object_addition: false,
        ui_control_plane: false,
        closure_traceability: false,
        cryptographic_receipt_seal: false,
      }),
    },
    deterministic: true,
    enforcing: false,
  };

  return assertValidGovernanceCaseReviewDecisionAttestationClosureReceiptProfile(
    receipt
  );
}

export function validateGovernanceCaseReviewDecisionAttestationClosureReceiptProfile(
  profile
) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: [
        "governance case review decision attestation closure receipt profile must be an object",
      ],
    };
  }
  const topLevelKeys = Object.keys(profile);
  if (
    topLevelKeys.length !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_TOP_LEVEL_FIELDS.length ||
    GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_TOP_LEVEL_FIELDS.some(
      (field, index) => topLevelKeys[index] !== field
    )
  ) {
    errors.push(
      "governance case review decision attestation closure receipt top-level fields drifted"
    );
  }
  if (
    profile.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_KIND ||
    profile.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_VERSION ||
    profile.schema_id !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_SCHEMA_ID ||
    profile.deterministic !== true ||
    profile.enforcing !== false
  ) {
    errors.push(
      "governance case review decision attestation closure receipt profile envelope drifted"
    );
  }
  const payload =
    profile.governance_case_review_decision_attestation_closure_receipt;
  if (!isPlainObject(payload)) {
    errors.push(
      "governance case review decision attestation closure receipt payload missing"
    );
  } else {
    const payloadKeys = Object.keys(payload);
    if (
      payloadKeys.length !==
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PAYLOAD_FIELDS.length ||
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PAYLOAD_FIELDS.some(
        (field, index) => payloadKeys[index] !== field
      )
    ) {
      errors.push(
        "governance case review decision attestation closure receipt payload fields drifted"
      );
    }
    if (
      payload.stage !==
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_STAGE ||
      payload.consumer_surface !==
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_CONSUMER_SURFACE ||
      payload.boundary !==
        GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_PROFILE_BOUNDARY
    ) {
      errors.push(
        "governance case review decision attestation closure receipt payload metadata drifted"
      );
    }
    if (!isPlainObject(payload.attestation_closure_receipt_ref)) {
      errors.push(
        "governance case review decision attestation closure receipt ref missing"
      );
    } else {
      for (const field of [
        "receipt_id",
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
        if (
          typeof payload.attestation_closure_receipt_ref[field] !== "string" ||
          payload.attestation_closure_receipt_ref[field].length === 0
        ) {
          errors.push(
            `governance case review decision attestation closure receipt ref field missing: ${field}`
          );
        }
      }
    }
    if (!isPlainObject(payload.receipt_context)) {
      errors.push(
        "governance case review decision attestation closure receipt context missing"
      );
    } else {
      try {
        assertClosureSemantics(payload);
        assertExplanationSemantics(payload);
        const reasonCodes = payload.receipt_context.receipt_basis?.receipt_reason_codes;
        if (
          !hasUniqueStrings(reasonCodes) ||
          !ensureKnownReasonCodes(reasonCodes)
        ) {
          errors.push(
            "governance case review decision attestation closure receipt reason codes drifted"
          );
        }
      } catch (error) {
        errors.push(error.message);
      }
    }
    if (!isPlainObject(payload.preserved_semantics)) {
      errors.push(
        "governance case review decision attestation closure receipt preserved semantics missing"
      );
    } else {
      try {
        assertPreservedSemantics(payload.preserved_semantics);
      } catch (error) {
        errors.push(error.message);
      }
    }
  }
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionAttestationClosureReceiptProfile(
  profile
) {
  const validation =
    validateGovernanceCaseReviewDecisionAttestationClosureReceiptProfile(
      profile
    );
  if (validation.ok) return profile;

  const error = new Error(
    `governance case review decision attestation closure receipt profile invalid: ${validation.errors.join(
      "; "
    )}`
  );
  error.validation = validation;
  throw error;
}
