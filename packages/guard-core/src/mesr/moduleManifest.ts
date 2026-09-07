import { MESR_CORE_REGISTRY } from "./coreRegistry.ts";
import {
  MESR_CORE_VERSION,
  type MesrComposition,
  type MesrModuleManifest,
  type MesrModuleValidationResult,
  type MesrSemanticEntry,
  type MesrValidationIssue,
} from "./types.ts";

const REQUIRED_CONFORMANCE = [
  "semantic_non_interference",
  "deterministic_resolution",
  "explicit_provenance",
  "no_execution_authority",
] as const;

const TYPE_ORDER = { core: 0, domain_pack: 1, crosswalk: 2, institutional_profile: 3 } as const;

export const MESR_CORE_MODULE: MesrModuleManifest = {
  module_id: "mesr.core",
  module_type: "core",
  version: MESR_CORE_VERSION,
  semantic_namespace: "mesr.core",
  core_compatibility: ">=0.1.0 <0.2.0",
  dependencies: [],
  added_semantics: MESR_CORE_REGISTRY,
  mappings: [],
  external_references: [],
  prohibited_overrides: [],
  conformance_requirements: REQUIRED_CONFORMANCE,
};

function addIssue(issues: MesrValidationIssue[], code: string, manifest: MesrModuleManifest, field: string, detail: string): void {
  issues.push({ code, subject: manifest.module_id, field, detail });
}

function canonicalIssueSort(left: MesrValidationIssue, right: MesrValidationIssue): number {
  return JSON.stringify(left).localeCompare(JSON.stringify(right));
}

function namespaceValid(manifest: MesrModuleManifest): boolean {
  if (manifest.module_type === "core") return manifest.semantic_namespace === "mesr.core";
  if (manifest.module_type === "domain_pack") return /^mesr\.domain\.[a-z0-9_]+$/.test(manifest.semantic_namespace);
  if (manifest.module_type === "crosswalk") return /^mesr\.xw\.[a-z0-9_]+$/.test(manifest.semantic_namespace);
  return /^mesr\.profile\.[a-z0-9_]+$/.test(manifest.semantic_namespace);
}

export function validateMesrModuleManifest(
  manifest: MesrModuleManifest,
  availableSemantics?: readonly MesrSemanticEntry[],
): MesrModuleValidationResult {
  const issues: MesrValidationIssue[] = [];
  const resolvedAvailableSemantics = availableSemantics ?? (
    manifest.module_type === "core" ? [] : MESR_CORE_REGISTRY
  );
  const requiredStrings = ["module_id", "module_type", "version", "semantic_namespace", "core_compatibility"] as const;
  const requiredArrays = ["dependencies", "added_semantics", "mappings", "external_references", "prohibited_overrides", "conformance_requirements"] as const;
  for (const field of requiredStrings) {
    if (typeof manifest[field] !== "string" || manifest[field].length === 0) addIssue(issues, "MISSING_REQUIRED_FIELD", manifest, field, "non-empty string required");
  }
  for (const field of requiredArrays) {
    if (!Array.isArray(manifest[field])) addIssue(issues, "MISSING_REQUIRED_FIELD", manifest, field, "array required");
  }
  if (!namespaceValid(manifest)) addIssue(issues, "INVALID_NAMESPACE_OWNERSHIP", manifest, "semantic_namespace", manifest.semantic_namespace);
  if (manifest.core_compatibility !== ">=0.1.0 <0.2.0") addIssue(issues, "INCOMPATIBLE_CORE_VERSION", manifest, "core_compatibility", manifest.core_compatibility);
  for (const requirement of REQUIRED_CONFORMANCE) {
    if (!manifest.conformance_requirements.includes(requirement)) addIssue(issues, "MISSING_CONFORMANCE_REQUIREMENT", manifest, "conformance_requirements", requirement);
  }

  const knownIds = new Set(resolvedAvailableSemantics.map((entry) => entry.semantic_id));
  const ownIds = new Set<string>();
  for (const entry of manifest.added_semantics) {
    if (ownIds.has(entry.semantic_id)) addIssue(issues, "DUPLICATE_MODULE_SEMANTIC_ID", manifest, "added_semantics", entry.semantic_id);
    ownIds.add(entry.semantic_id);
    if (knownIds.has(entry.semantic_id)) addIssue(issues, "SEMANTIC_COLLISION", manifest, "added_semantics", entry.semantic_id);
    if (manifest.module_type !== "core" && !entry.semantic_id.startsWith(`${manifest.semantic_namespace}.`)) {
      addIssue(issues, "SEMANTIC_OUTSIDE_OWNED_NAMESPACE", manifest, "added_semantics", entry.semantic_id);
    }
    if (manifest.module_type === "core" && !entry.semantic_id.startsWith("mesr.core.")) {
      addIssue(issues, "SEMANTIC_OUTSIDE_OWNED_NAMESPACE", manifest, "added_semantics", entry.semantic_id);
    }
    if (entry.supports.some((claim) => ["execution_authorized", "action_approved", "certified", "legally_compliant"].includes(claim))) {
      addIssue(issues, "AUTHORITY_EXPANSION_FORBIDDEN", manifest, "added_semantics.supports", entry.semantic_id);
    }
  }

  if (manifest.module_type === "crosswalk" && manifest.added_semantics.length > 0) {
    addIssue(issues, "CROSSWALK_SEMANTICS_FORBIDDEN", manifest, "added_semantics", "crosswalks map external vocabulary only");
  }
  if (manifest.module_type === "institutional_profile" && (manifest.added_semantics.length > 0 || manifest.mappings.length > 0)) {
    addIssue(issues, "PROFILE_SEMANTIC_PARTICIPATION_FORBIDDEN", manifest, "added_semantics", "profiles are presentation-only");
  }
  for (const mapping of manifest.mappings) {
    if (manifest.module_type !== "crosswalk") addIssue(issues, "MAPPING_TYPE_FORBIDDEN", manifest, "mappings", mapping.external_concept);
    if (!knownIds.has(mapping.target_semantic_id)) addIssue(issues, "UNRESOLVED_MAPPING_TARGET", manifest, "mappings", mapping.target_semantic_id);
    if (mapping.provenance.length === 0 || mapping.limitations.length === 0) addIssue(issues, "INCOMPLETE_MAPPING_PROVENANCE", manifest, "mappings", mapping.external_concept);
  }
  for (const attempt of manifest.semantic_overrides ?? []) {
    addIssue(issues, "SEMANTIC_OVERRIDE_FORBIDDEN", manifest, "semantic_overrides", `${attempt.left}=${attempt.right}`);
  }

  issues.sort(canonicalIssueSort);
  return {
    valid: issues.length === 0,
    issues,
    module_id: manifest.module_id,
    status: issues.length === 0 ? "VALID_MODULE" : "INVALID_MODULE",
    loaded_semantic_count: issues.length === 0 ? manifest.added_semantics.length : 0,
  };
}

export function composeMesrModules(manifests: readonly MesrModuleManifest[]): MesrComposition {
  const ordered = [...manifests].sort((left, right) =>
    TYPE_ORDER[left.module_type] - TYPE_ORDER[right.module_type] || left.module_id.localeCompare(right.module_id),
  );
  const issues: MesrValidationIssue[] = [];
  const available: MesrSemanticEntry[] = [];
  const moduleIds = new Set(ordered.map((entry) => entry.module_id));

  for (const manifest of ordered) {
    for (const dependency of manifest.dependencies) {
      if (!moduleIds.has(dependency.module_id)) addIssue(issues, "MISSING_MODULE_DEPENDENCY", manifest, "dependencies", dependency.module_id);
    }
    const validation = validateMesrModuleManifest(manifest, available);
    issues.push(...validation.issues);
    if (validation.valid) available.push(...manifest.added_semantics);
  }

  const moduleById = new Map(ordered.map((entry) => [entry.module_id, entry]));
  const visiting = new Set<string>();
  const visited = new Set<string>();
  function visit(moduleId: string): void {
    if (visiting.has(moduleId)) {
      const manifest = moduleById.get(moduleId);
      if (manifest) addIssue(issues, "CIRCULAR_MODULE_DEPENDENCY", manifest, "dependencies", moduleId);
      return;
    }
    if (visited.has(moduleId)) return;
    visiting.add(moduleId);
    for (const dependency of moduleById.get(moduleId)?.dependencies ?? []) visit(dependency.module_id);
    visiting.delete(moduleId);
    visited.add(moduleId);
  }
  for (const moduleId of moduleById.keys()) visit(moduleId);

  issues.sort(canonicalIssueSort);
  if (issues.length > 0) {
    return { status: "INVALID_COMPOSITION", modules: ordered, semantic_entries: [], mappings: [], profiles: [], issues };
  }
  return {
    status: "VALID_COMPOSITION",
    modules: ordered,
    semantic_entries: available,
    mappings: ordered.flatMap((entry) => entry.mappings),
    profiles: ordered.filter((entry) => entry.module_type === "institutional_profile"),
    issues: [],
  };
}
