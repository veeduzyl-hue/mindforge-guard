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
import {
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_SCOPE_CURRENT_CLOSURE,
  GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_STATUS_RECORDED,
  assertValidGovernanceCaseReviewDecisionAttestationClosureReceiptProfile,
} from "./governanceCaseReviewDecisionAttestationClosureReceiptProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_KIND =
  "governance_case_review_decision_closure_evidence_package_profile";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_SCHEMA_ID =
  "mindforge/governance-case-review-decision-closure-evidence-package-profile/v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_STAGE =
  "governance_case_review_decision_closure_evidence_package_boundary_phase2_v6_7_0";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMER_SURFACE =
  "guard.audit.governance_case_review_decision_closure_evidence_package";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_BOUNDARY =
  "governance_case_review_decision_closure_evidence_package_boundary_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_STATUS_PACKAGED =
  "packaged";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_SCOPE_CURRENT_CLOSURE =
  "current_closure_supporting_evidence_package_only";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_REASON_CODES =
  Object.freeze([
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
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_REASON_CODE_ALLOWLIST =
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_REASON_CODES;
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_TOP_LEVEL_FIELDS =
  Object.freeze([
    "kind",
    "version",
    "schema_id",
    "canonical_action_hash",
    "governance_case_review_decision_closure_evidence_package",
    "deterministic",
    "enforcing",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PAYLOAD_FIELDS =
  Object.freeze([
    "stage",
    "consumer_surface",
    "boundary",
    "closure_evidence_package_ref",
    "package_manifest",
    "validation_exports",
    "preserved_semantics",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_STABLE_EXPORT_SET =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_KIND",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_SCHEMA_ID",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_STAGE",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMER_SURFACE",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_BOUNDARY",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_STATUS_PACKAGED",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_SCOPE_CURRENT_CLOSURE",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_REASON_CODES",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_REASON_CODE_ALLOWLIST",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_TOP_LEVEL_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PAYLOAD_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_STABLE_EXPORT_SET",
    "buildGovernanceCaseReviewDecisionClosureEvidencePackageProfile",
    "validateGovernanceCaseReviewDecisionClosureEvidencePackageProfile",
    "assertValidGovernanceCaseReviewDecisionClosureEvidencePackageProfile",
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
        `governance case review decision closure evidence package requires ${label} ${field}=true`
      );
    }
  }
}

function assertFalseFields(source, fields, label) {
  for (const field of fields) {
    if (source[field] !== false) {
      throw new Error(
        `governance case review decision closure evidence package requires ${label} ${field}=false`
      );
    }
  }
}

function assertAlignedIdentity(left, right, fields, label) {
  for (const field of fields) {
    if (left[field] !== right[field]) {
      throw new Error(
        `governance case review decision closure evidence package ${label} mismatch: ${field} must remain aligned`
      );
    }
  }
}

export function buildGovernanceCaseReviewDecisionClosureEvidencePackageProfile({
  governanceCaseReviewDecisionAttestationApplicabilityClosureProfile,
  governanceCaseReviewDecisionAttestationClosureExplanationProfile,
  governanceCaseReviewDecisionAttestationClosureReceiptProfile,
}) {
  const closure =
    assertValidGovernanceCaseReviewDecisionAttestationApplicabilityClosureProfile(
      governanceCaseReviewDecisionAttestationApplicabilityClosureProfile
    );
  const explanation =
    assertValidGovernanceCaseReviewDecisionAttestationClosureExplanationProfile(
      governanceCaseReviewDecisionAttestationClosureExplanationProfile
    );
  const receipt =
    assertValidGovernanceCaseReviewDecisionAttestationClosureReceiptProfile(
      governanceCaseReviewDecisionAttestationClosureReceiptProfile
    );

  const closurePayload =
    closure.governance_case_review_decision_attestation_applicability_closure;
  const explanationPayload =
    explanation.governance_case_review_decision_attestation_closure_explanation;
  const receiptPayload =
    receipt.governance_case_review_decision_attestation_closure_receipt;
  const closureRef = closurePayload.attestation_applicability_closure_ref;
  const explanationRef = explanationPayload.attestation_closure_explanation_ref;
  const receiptRef = receiptPayload.attestation_closure_receipt_ref;

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
  assertAlignedIdentity(
    closureRef,
    receiptRef,
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
    "closure/receipt"
  );
  if (
    closure.canonical_action_hash !== explanation.canonical_action_hash ||
    closure.canonical_action_hash !== receipt.canonical_action_hash
  ) {
    throw new Error(
      "governance case review decision closure evidence package mismatch: canonical_action_hash must remain aligned"
    );
  }
  if (
    closurePayload.closure_context.closure_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_STATUS_CLOSED ||
    closurePayload.closure_context.closure_scope !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_APPLICABILITY_CLOSURE_SCOPE_CURRENT_ATTESTATION
  ) {
    throw new Error(
      "governance case review decision closure evidence package requires current closure"
    );
  }
  if (
    explanationPayload.explanation_context.explanation_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_STATUS_AVAILABLE ||
    explanationPayload.explanation_context.explanation_scope !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_EXPLANATION_SCOPE_CURRENT_CLOSURE
  ) {
    throw new Error(
      "governance case review decision closure evidence package requires current closure explanation"
    );
  }
  if (
    receiptPayload.receipt_context.receipt_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_STATUS_RECORDED ||
    receiptPayload.receipt_context.receipt_scope !==
      GOVERNANCE_CASE_REVIEW_DECISION_ATTESTATION_CLOSURE_RECEIPT_SCOPE_CURRENT_CLOSURE
  ) {
    throw new Error(
      "governance case review decision closure evidence package requires current closure receipt"
    );
  }

  const includedArtifacts = Object.freeze([
    Object.freeze({
      artifact_id: closureRef.closure_id,
      artifact_kind:
        "governance_case_review_decision_attestation_applicability_closure",
      role: "closure_foundation",
    }),
    Object.freeze({
      artifact_id: explanationRef.explanation_id,
      artifact_kind:
        "governance_case_review_decision_attestation_closure_explanation",
      role: "closure_explanation",
    }),
    Object.freeze({
      artifact_id: receiptRef.receipt_id,
      artifact_kind:
        "governance_case_review_decision_attestation_closure_receipt",
      role: "closure_receipt",
    }),
  ]);

  const profile = {
    kind: GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_KIND,
    version:
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_VERSION,
    schema_id:
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_SCHEMA_ID,
    canonical_action_hash: closure.canonical_action_hash,
    governance_case_review_decision_closure_evidence_package: {
      stage:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_STAGE,
      consumer_surface:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMER_SURFACE,
      boundary:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_BOUNDARY,
      closure_evidence_package_ref: {
        package_id: `${receiptRef.receipt_id}:package`,
        receipt_id: receiptRef.receipt_id,
        receipt_selection_id: receiptRef.receipt_selection_id,
        explanation_id: explanationRef.explanation_id,
        explanation_selection_id: explanationRef.explanation_selection_id,
        closure_id: closureRef.closure_id,
        closure_selection_id: closureRef.closure_selection_id,
        case_id: closureRef.case_id,
        review_decision_id: closureRef.review_decision_id,
        attestation_id: closureRef.attestation_id,
        current_selection_id: closureRef.current_selection_id,
      },
      package_manifest: {
        package_status:
          GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_STATUS_PACKAGED,
        package_scope:
          GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_SCOPE_CURRENT_CLOSURE,
        package_envelope: Object.freeze({
          manifest_version: "v1",
          delivery_surface: "closure_receipt_evidence_package",
          included_artifact_count: includedArtifacts.length,
        }),
        included_artifact_ids: Object.freeze(
          includedArtifacts.map((artifact) => artifact.artifact_id)
        ),
        included_artifacts: includedArtifacts,
        package_basis: Object.freeze({
          package_reason_codes: Object.freeze([
            ...GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_REASON_CODES,
          ]),
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
        }),
      },
      validation_exports: Object.freeze({
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
        main_path_takeover: false,
        authority_scope_expansion: false,
        governance_object_addition: false,
        ui_control_plane: false,
      }),
    },
    deterministic: true,
    enforcing: false,
  };

  return assertValidGovernanceCaseReviewDecisionClosureEvidencePackageProfile(
    profile
  );
}

export function validateGovernanceCaseReviewDecisionClosureEvidencePackageProfile(
  profile
) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: [
        "governance case review decision closure evidence package profile must be an object",
      ],
    };
  }
  const topKeys = Object.keys(profile);
  if (
    JSON.stringify(topKeys) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_TOP_LEVEL_FIELDS
    )
  ) {
    errors.push(
      "governance case review decision closure evidence package top-level field order drifted"
    );
  }
  if (
    profile.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_KIND ||
    profile.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_VERSION ||
    profile.schema_id !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_SCHEMA_ID ||
    profile.deterministic !== true ||
    profile.enforcing !== false
  ) {
    errors.push(
      "governance case review decision closure evidence package profile envelope drifted"
    );
  }
  const payload = profile.governance_case_review_decision_closure_evidence_package;
  if (!isPlainObject(payload)) {
    errors.push(
      "governance case review decision closure evidence package payload missing"
    );
    return { ok: false, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PAYLOAD_FIELDS
    )
  ) {
    errors.push(
      "governance case review decision closure evidence package payload field order drifted"
    );
  }
  if (
    payload.stage !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_STAGE ||
    payload.consumer_surface !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_CONSUMER_SURFACE ||
    payload.boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_PROFILE_BOUNDARY
  ) {
    errors.push(
      "governance case review decision closure evidence package payload metadata drifted"
    );
  }
  if (!isPlainObject(payload.closure_evidence_package_ref)) {
    errors.push(
      "governance case review decision closure evidence package ref missing"
    );
  } else {
    for (const field of [
      "package_id",
      "receipt_id",
      "receipt_selection_id",
      "explanation_id",
      "explanation_selection_id",
      "closure_id",
      "closure_selection_id",
      "case_id",
      "review_decision_id",
      "attestation_id",
      "current_selection_id",
    ]) {
      if (
        typeof payload.closure_evidence_package_ref[field] !== "string" ||
        payload.closure_evidence_package_ref[field].length === 0
      ) {
        errors.push(
          `governance case review decision closure evidence package ref field missing: ${field}`
        );
      }
    }
  }
  if (!isPlainObject(payload.package_manifest)) {
    errors.push(
      "governance case review decision closure evidence package manifest missing"
    );
  } else {
    if (
      payload.package_manifest.package_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_STATUS_PACKAGED
    ) {
      errors.push(
        "governance case review decision closure evidence package status drifted"
      );
    }
    if (
      payload.package_manifest.package_scope !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_SCOPE_CURRENT_CLOSURE
    ) {
      errors.push(
        "governance case review decision closure evidence package scope drifted"
      );
    }
    if (
      !hasUniqueStrings(payload.package_manifest.included_artifact_ids) ||
      payload.package_manifest.included_artifact_ids.length !== 3
    ) {
      errors.push(
        "governance case review decision closure evidence package manifest artifact ids drifted"
      );
    }
    assertTrueFields(
      payload.package_manifest.package_basis,
      [
        "receipt_available",
        "closure_available",
        "closure_explanation_available",
        "current_receipt_selected",
        "current_receipt_selection_stable",
        "current_closure_selected",
        "current_explanation_selected",
        "current_explanation_selection_stable",
        "package_manifest_complete",
        "package_composition_bounded",
        "package_export_stable",
        "supporting_basis_complete",
        "package_linkage_only",
        "consumption_boundary_bounded",
        "aggregate_export_only",
        "permit_aggregate_export_only",
      ],
      "package basis"
    );
    if (
      !hasUniqueStrings(payload.package_manifest.package_basis.package_reason_codes)
    ) {
      errors.push(
        "governance case review decision closure evidence package reason codes drifted"
      );
    }
  }
  assertTrueFields(
    payload.validation_exports,
    [
      "receipt_required",
      "closure_required",
      "closure_explanation_required",
      "current_receipt_selected_only",
      "unique_current_receipt_required",
      "current_receipt_selection_stable",
      "current_closure_selected_only",
      "current_explanation_selected_only",
      "package_manifest_complete",
      "package_composition_bounded",
      "package_export_stable",
      "package_linkage_only",
      "consumption_boundary_bounded",
      "cross_case_binding_rejected",
      "cross_review_decision_binding_rejected",
      "cross_canonical_action_hash_binding_rejected",
      "complete_supporting_linkage_required",
      "aggregate_export_only",
      "permit_aggregate_export_only",
    ],
    "validation export"
  );
  assertTrueFields(
    payload.preserved_semantics,
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
    payload.preserved_semantics,
    [
      "judgment_source_enabled",
      "authority_source_enabled",
      "execution_binding_enabled",
      "risk_source_enabled",
      "main_path_takeover",
      "authority_scope_expansion",
      "governance_object_addition",
      "ui_control_plane",
    ],
    "preserved semantic"
  );
  return { ok: errors.length === 0, errors };
}

export function assertValidGovernanceCaseReviewDecisionClosureEvidencePackageProfile(
  profile
) {
  const validation =
    validateGovernanceCaseReviewDecisionClosureEvidencePackageProfile(profile);
  if (validation.ok) return profile;
  const err = new Error(
    `governance case review decision closure evidence package profile invalid: ${validation.errors.join(
      "; "
    )}`
  );
  err.validation = validation;
  throw err;
}
