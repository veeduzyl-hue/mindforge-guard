import {
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_SCOPE_CURRENT_CLOSURE,
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_STATUS_PACKAGED,
  assertValidGovernanceCaseReviewDecisionClosureEvidencePackageProfile,
} from "./governanceCaseReviewDecisionClosureEvidencePackageProfile.mjs";

export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_KIND =
  "governance_case_review_decision_closure_evidence_package_explanation_profile";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_VERSION =
  "v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_SCHEMA_ID =
  "mindforge/governance-case-review-decision-closure-evidence-package-explanation-profile/v1";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_STAGE =
  "governance_case_review_decision_closure_evidence_package_explanation_boundary_phase1_v6_8_0";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONSUMER_SURFACE =
  "guard.audit.governance_case_review_decision_closure_evidence_package_explanation";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_BOUNDARY =
  "governance_case_review_decision_closure_evidence_package_explanation_boundary_contract";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_STATUS_AVAILABLE =
  "available";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SCOPE_CURRENT_PACKAGE =
  "current_closure_evidence_package_explanation_only";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_PACKAGE_OVERVIEW =
  "package_overview";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_SUPPORTING_EVIDENCE =
  "supporting_evidence";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_CLOSURE_CONCLUSION =
  "closure_conclusion";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_SELECTION_BASIS =
  "selection_basis";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_EXPLANATION_SUMMARY =
  "explanation_summary";
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_ORDER =
  Object.freeze([
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_PACKAGE_OVERVIEW,
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_SUPPORTING_EVIDENCE,
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_CLOSURE_CONCLUSION,
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_SELECTION_BASIS,
    GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_EXPLANATION_SUMMARY,
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_FIELDS =
  Object.freeze([
    "section_id",
    "title",
    "interpretation_surface",
    "artifact_refs",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_INTERPRETATION_SURFACE_BY_SECTION =
  Object.freeze({
    [GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_PACKAGE_OVERVIEW]:
      "bounded_package_summary",
    [GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_SUPPORTING_EVIDENCE]:
      "bounded_supporting_evidence",
    [GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_CLOSURE_CONCLUSION]:
      "bounded_closure_conclusion",
    [GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_SELECTION_BASIS]:
      "bounded_selection_basis",
    [GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_EXPLANATION_SUMMARY]:
      "bounded_explanation_summary",
  });
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_REASON_CODES =
  Object.freeze([
    "package_available",
    "package_manifest_complete",
    "package_composition_bounded",
    "package_export_stable",
    "package_linkage_only",
    "supporting_evidence_bounded",
    "closure_conclusion_bounded",
    "selection_basis_bounded",
    "explanation_summary_bounded",
    "interpretation_surface_bounded",
    "narrative_sections_complete",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_REASON_CODE_ALLOWLIST =
  GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_REASON_CODES;
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_TOP_LEVEL_FIELDS =
  Object.freeze([
    "kind",
    "version",
    "schema_id",
    "canonical_action_hash",
    "governance_case_review_decision_closure_evidence_package_explanation",
    "deterministic",
    "enforcing",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PAYLOAD_FIELDS =
  Object.freeze([
    "stage",
    "consumer_surface",
    "boundary",
    "closure_evidence_package_explanation_ref",
    "explanation_context",
    "validation_exports",
    "preserved_semantics",
  ]);
export const GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_STABLE_EXPORT_SET =
  Object.freeze([
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_KIND",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_VERSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_SCHEMA_ID",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_STAGE",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONSUMER_SURFACE",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_BOUNDARY",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_STATUS_AVAILABLE",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SCOPE_CURRENT_PACKAGE",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_PACKAGE_OVERVIEW",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_SUPPORTING_EVIDENCE",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_CLOSURE_CONCLUSION",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_SELECTION_BASIS",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_EXPLANATION_SUMMARY",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_ORDER",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_INTERPRETATION_SURFACE_BY_SECTION",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_REASON_CODES",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_REASON_CODE_ALLOWLIST",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_TOP_LEVEL_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PAYLOAD_FIELDS",
    "GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_STABLE_EXPORT_SET",
    "buildGovernanceCaseReviewDecisionClosureEvidencePackageExplanationProfile",
    "validateGovernanceCaseReviewDecisionClosureEvidencePackageExplanationProfile",
    "assertValidGovernanceCaseReviewDecisionClosureEvidencePackageExplanationProfile",
  ]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasUniqueStrings(values) {
  return Array.isArray(values) && new Set(values).size === values.length;
}

function hasNonEmptyStringArray(values) {
  return (
    Array.isArray(values) &&
    values.length > 0 &&
    values.every((value) => typeof value === "string" && value.length > 0)
  );
}

function assertTrueFields(source, fields, label) {
  for (const field of fields) {
    if (source[field] !== true) {
      throw new Error(
        `governance case review decision closure evidence package explanation requires ${label} ${field}=true`
      );
    }
  }
}

function assertFalseFields(source, fields, label) {
  for (const field of fields) {
    if (source[field] !== false) {
      throw new Error(
        `governance case review decision closure evidence package explanation requires ${label} ${field}=false`
      );
    }
  }
}

export function buildGovernanceCaseReviewDecisionClosureEvidencePackageExplanationProfile({
  governanceCaseReviewDecisionClosureEvidencePackageProfile,
}) {
  const packageProfile =
    assertValidGovernanceCaseReviewDecisionClosureEvidencePackageProfile(
      governanceCaseReviewDecisionClosureEvidencePackageProfile
    );
  const payload =
    packageProfile.governance_case_review_decision_closure_evidence_package;
  const ref = payload.closure_evidence_package_ref;
  const manifest = payload.package_manifest;
  const basis = manifest.package_basis;

  if (
    manifest.package_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_STATUS_PACKAGED ||
    manifest.package_scope !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_SCOPE_CURRENT_CLOSURE
  ) {
    throw new Error(
      "governance case review decision closure evidence package explanation requires packaged current closure evidence package"
    );
  }
  if (
    !Array.isArray(manifest.included_artifacts) ||
    manifest.included_artifacts.length !== 3
  ) {
    throw new Error(
      "governance case review decision closure evidence package explanation requires bounded package artifact set"
    );
  }
  const expectedRoles = [
    "closure_foundation",
    "closure_explanation",
    "closure_receipt",
  ];
  const actualRoles = manifest.included_artifacts.map((artifact) => artifact.role);
  if (JSON.stringify(actualRoles) !== JSON.stringify(expectedRoles)) {
    throw new Error(
      "governance case review decision closure evidence package explanation requires bounded narrative artifact roles"
    );
  }
  assertTrueFields(
    basis,
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

  const narrativeSections = Object.freeze([
    Object.freeze({
      section_id:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_PACKAGE_OVERVIEW,
      title: "Package Overview",
      interpretation_surface: "bounded_package_summary",
      artifact_refs: Object.freeze([ref.package_id]),
    }),
    Object.freeze({
      section_id:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_SUPPORTING_EVIDENCE,
      title: "Supporting Evidence",
      interpretation_surface: "bounded_supporting_evidence",
      artifact_refs: Object.freeze([...manifest.included_artifact_ids]),
    }),
    Object.freeze({
      section_id:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_CLOSURE_CONCLUSION,
      title: "Closure Conclusion",
      interpretation_surface: "bounded_closure_conclusion",
      artifact_refs: Object.freeze([ref.closure_id]),
    }),
    Object.freeze({
      section_id:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_SELECTION_BASIS,
      title: "Selection Basis",
      interpretation_surface: "bounded_selection_basis",
      artifact_refs: Object.freeze([ref.receipt_id, ref.explanation_id]),
    }),
    Object.freeze({
      section_id:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_EXPLANATION_SUMMARY,
      title: "Explanation Summary",
      interpretation_surface: "bounded_explanation_summary",
      artifact_refs: Object.freeze([ref.explanation_id]),
    }),
  ]);

  return assertValidGovernanceCaseReviewDecisionClosureEvidencePackageExplanationProfile(
    {
      kind:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_KIND,
      version:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_VERSION,
      schema_id:
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_SCHEMA_ID,
      canonical_action_hash: packageProfile.canonical_action_hash,
      governance_case_review_decision_closure_evidence_package_explanation: {
        stage:
          GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_STAGE,
        consumer_surface:
          GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONSUMER_SURFACE,
        boundary:
          GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_BOUNDARY,
        closure_evidence_package_explanation_ref: {
          narrative_id: `${ref.package_id}:narrative`,
          package_id: ref.package_id,
          receipt_id: ref.receipt_id,
          explanation_id: ref.explanation_id,
          closure_id: ref.closure_id,
          case_id: ref.case_id,
          review_decision_id: ref.review_decision_id,
          attestation_id: ref.attestation_id,
        },
        explanation_context: {
          explanation_status:
            GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_STATUS_AVAILABLE,
          explanation_scope:
            GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SCOPE_CURRENT_PACKAGE,
          explanation_basis: Object.freeze({
            explanation_reason_codes: Object.freeze([
              ...GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_REASON_CODES,
            ]),
            package_available: true,
            package_manifest_complete: true,
            package_composition_bounded: true,
            package_export_stable: true,
            package_linkage_only: true,
            supporting_evidence_bounded: true,
            closure_conclusion_bounded: true,
            selection_basis_bounded: true,
            explanation_summary_bounded: true,
            interpretation_surface_bounded: true,
            narrative_sections_complete: true,
            consumption_boundary_bounded: true,
            aggregate_export_only: true,
            permit_aggregate_export_only: true,
          }),
          narrative_structure: Object.freeze({
            narrative_section_ids: Object.freeze([
              ...GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_ORDER,
            ]),
            narrative_section_order: Object.freeze([
              ...GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_ORDER,
            ]),
            narrative_sections: narrativeSections,
          }),
        },
        validation_exports: Object.freeze({
          package_required: true,
          package_manifest_complete: true,
          package_composition_bounded: true,
          package_export_stable: true,
          package_linkage_only: true,
          supporting_evidence_bounded: true,
          closure_conclusion_bounded: true,
          selection_basis_bounded: true,
          explanation_summary_bounded: true,
          interpretation_surface_bounded: true,
          narrative_sections_complete: true,
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

export function validateGovernanceCaseReviewDecisionClosureEvidencePackageExplanationProfile(
  profile
) {
  const errors = [];
  if (!isPlainObject(profile)) {
    return {
      ok: false,
      errors: [
        "governance case review decision closure evidence package explanation profile must be an object",
      ],
    };
  }
  if (
    JSON.stringify(Object.keys(profile)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_TOP_LEVEL_FIELDS
    )
  ) {
    errors.push(
      "governance case review decision closure evidence package explanation top-level field order drifted"
    );
  }
  if (
    profile.kind !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_KIND ||
    profile.version !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_VERSION ||
    profile.schema_id !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_SCHEMA_ID ||
    profile.deterministic !== true ||
    profile.enforcing !== false
  ) {
    errors.push(
      "governance case review decision closure evidence package explanation profile envelope drifted"
    );
  }
  const payload =
    profile.governance_case_review_decision_closure_evidence_package_explanation;
  if (!isPlainObject(payload)) {
    errors.push(
      "governance case review decision closure evidence package explanation payload missing"
    );
    return { ok: false, errors };
  }
  if (
    JSON.stringify(Object.keys(payload)) !==
    JSON.stringify(
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PAYLOAD_FIELDS
    )
  ) {
    errors.push(
      "governance case review decision closure evidence package explanation payload field order drifted"
    );
  }
  if (
    payload.stage !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_STAGE ||
    payload.consumer_surface !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_CONSUMER_SURFACE ||
    payload.boundary !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_PROFILE_BOUNDARY
  ) {
    errors.push(
      "governance case review decision closure evidence package explanation payload metadata drifted"
    );
  }
  if (!isPlainObject(payload.closure_evidence_package_explanation_ref)) {
    errors.push(
      "governance case review decision closure evidence package explanation ref missing"
    );
  }
  if (!isPlainObject(payload.explanation_context)) {
    errors.push(
      "governance case review decision closure evidence package explanation context missing"
    );
    return { ok: false, errors };
  }
  if (
    payload.explanation_context.explanation_status !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_STATUS_AVAILABLE ||
    payload.explanation_context.explanation_scope !==
      GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SCOPE_CURRENT_PACKAGE
  ) {
    errors.push(
      "governance case review decision closure evidence package explanation status drifted"
    );
  }
  const context = payload.explanation_context;
  assertTrueFields(
    context.explanation_basis,
    [
      "package_available",
      "package_manifest_complete",
      "package_composition_bounded",
      "package_export_stable",
      "package_linkage_only",
      "supporting_evidence_bounded",
      "closure_conclusion_bounded",
      "selection_basis_bounded",
      "explanation_summary_bounded",
      "interpretation_surface_bounded",
      "narrative_sections_complete",
      "consumption_boundary_bounded",
      "aggregate_export_only",
      "permit_aggregate_export_only",
    ],
    "explanation basis"
  );
  if (
    !hasUniqueStrings(context.explanation_basis.explanation_reason_codes) ||
    JSON.stringify(context.narrative_structure.narrative_section_order) !==
      JSON.stringify(
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_ORDER
      ) ||
    JSON.stringify(context.narrative_structure.narrative_section_ids) !==
      JSON.stringify(
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_ORDER
      ) ||
    !Array.isArray(context.narrative_structure.narrative_sections) ||
    context.narrative_structure.narrative_sections.length !== 5
  ) {
    errors.push(
      "governance case review decision closure evidence package explanation narrative structure drifted"
    );
  }
  if (Array.isArray(context.narrative_structure.narrative_sections)) {
    for (const [index, section] of context.narrative_structure.narrative_sections.entries()) {
      if (!isPlainObject(section)) {
        errors.push(
          "governance case review decision closure evidence package explanation narrative section must be an object"
        );
        continue;
      }
      if (
        JSON.stringify(Object.keys(section)) !==
        JSON.stringify(
          GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_FIELDS
        )
      ) {
        errors.push(
          `governance case review decision closure evidence package explanation narrative section field order drifted: ${index}`
        );
      }
      const expectedSectionId =
        context.narrative_structure.narrative_section_order[index];
      if (section.section_id !== expectedSectionId) {
        errors.push(
          `governance case review decision closure evidence package explanation narrative section id drifted: ${index}`
        );
      }
      const expectedInterpretationSurface =
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_INTERPRETATION_SURFACE_BY_SECTION[
          expectedSectionId
        ];
      if (section.interpretation_surface !== expectedInterpretationSurface) {
        errors.push(
          `governance case review decision closure evidence package explanation narrative interpretation surface drifted: ${index}`
        );
      }
      if (!hasNonEmptyStringArray(section.artifact_refs)) {
        errors.push(
          `governance case review decision closure evidence package explanation narrative artifact refs drifted: ${index}`
        );
        continue;
      }
      if (expectedSectionId ===
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_PACKAGE_OVERVIEW &&
        JSON.stringify(section.artifact_refs) !==
          JSON.stringify([
            payload.closure_evidence_package_explanation_ref.package_id,
          ])) {
        errors.push(
          "governance case review decision closure evidence package explanation package overview artifact binding drifted"
        );
      }
      if (expectedSectionId ===
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_SUPPORTING_EVIDENCE &&
        JSON.stringify(section.artifact_refs) !==
          JSON.stringify(
            [
              payload.closure_evidence_package_explanation_ref.closure_id,
              payload.closure_evidence_package_explanation_ref.explanation_id,
              payload.closure_evidence_package_explanation_ref.receipt_id,
            ]
          )) {
        errors.push(
          "governance case review decision closure evidence package explanation supporting evidence artifact binding drifted"
        );
      }
      if (expectedSectionId ===
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_CLOSURE_CONCLUSION &&
        JSON.stringify(section.artifact_refs) !==
          JSON.stringify([
            payload.closure_evidence_package_explanation_ref.closure_id,
          ])) {
        errors.push(
          "governance case review decision closure evidence package explanation closure conclusion artifact binding drifted"
        );
      }
      if (expectedSectionId ===
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_SELECTION_BASIS &&
        JSON.stringify(section.artifact_refs) !==
          JSON.stringify([
            payload.closure_evidence_package_explanation_ref.receipt_id,
            payload.closure_evidence_package_explanation_ref.explanation_id,
          ])) {
        errors.push(
          "governance case review decision closure evidence package explanation selection basis artifact binding drifted"
        );
      }
      if (expectedSectionId ===
        GOVERNANCE_CASE_REVIEW_DECISION_CLOSURE_EVIDENCE_PACKAGE_EXPLANATION_SECTION_EXPLANATION_SUMMARY &&
        JSON.stringify(section.artifact_refs) !==
          JSON.stringify([
            payload.closure_evidence_package_explanation_ref.explanation_id,
          ])) {
        errors.push(
          "governance case review decision closure evidence package explanation summary artifact binding drifted"
        );
      }
    }
  }
  assertTrueFields(
    payload.validation_exports,
    [
      "package_required",
      "package_manifest_complete",
      "package_composition_bounded",
      "package_export_stable",
      "package_linkage_only",
      "supporting_evidence_bounded",
      "closure_conclusion_bounded",
      "selection_basis_bounded",
      "explanation_summary_bounded",
      "interpretation_surface_bounded",
      "narrative_sections_complete",
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

export function assertValidGovernanceCaseReviewDecisionClosureEvidencePackageExplanationProfile(
  profile
) {
  const validation =
    validateGovernanceCaseReviewDecisionClosureEvidencePackageExplanationProfile(
      profile
    );
  if (validation.ok) return profile;
  const err = new Error(
    `governance case review decision closure evidence package explanation profile invalid: ${validation.errors.join(
      "; "
    )}`
  );
  err.validation = validation;
  throw err;
}
