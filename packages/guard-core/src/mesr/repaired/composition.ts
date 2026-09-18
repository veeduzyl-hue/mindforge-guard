import { composeMesrModules, MESR_CORE_MODULE } from "../moduleManifest.ts";
import { MESR_SOFTWARE_DOMAIN_MODULE } from "../softwareDomainSeed.ts";
import { MESR_CLAIM_BOUNDARIES } from "../claimBoundaries.ts";
import { inspectCanonicalAdmission } from "./admission.ts";
import { collectBindingRequirements } from "./requirements.ts";
import { canonicalJson, CanonicalInputError, compareCodePoints, contentDigest } from "./canonicalBytes.ts";
import { record, type AdmissionTrust, type AdmissionDiagnostic, type JsonRecord } from "./contracts.ts";
import type { MesrModuleManifest } from "../types.ts";

/** Separately pinned caller context, never read from a producer's asserted proof.
 * Role names are vocabulary metadata; every role resolves to a supplied module.
 * No alias, external lookup, claim evaluation, or general version solver follows.
 */
export interface CompositionTrust extends AdmissionTrust {
  context_versions: Record<string, Record<string, string>>;
  context_modules: Record<string, string>;
}
const ranks: Record<string, number> = { core: 0, domain_pack: 1, crosswalk: 2, institutional_profile: 3 };
const sorted = (xs: string[]) => [...new Set(xs)].sort(compareCodePoints);
const sortRecords = (xs: JsonRecord[]) => [...xs].sort((a, b) => compareCodePoints(canonicalJson(a), canonicalJson(b)));
const moduleOrder = (a: JsonRecord, b: JsonRecord) => ranks[a.module_type] - ranks[b.module_type] || a.module_id.localeCompare(b.module_id) || compareCodePoints(contentDigest(a), contentDigest(b));
function freeze<T>(value: T): T { if (value && typeof value === "object") { Object.values(value).forEach(freeze); Object.freeze(value); } return value; }
const admitted = new WeakSet<object>();

// Typed graphs stay separate. Only cycle witnesses are calculated, never closure
// or implicit dependencies. Sorted DFS and rotated witnesses remove encounter order.
function cycleWitnesses(edges: readonly [string, string][]): string[] {
  const vertices = sorted(edges.flat());
  const done = new Set<string>(), active: string[] = [], witnesses: string[] = [];
  const walk = (id: string) => {
    const at = active.indexOf(id);
    if (at >= 0) {
      const ring = active.slice(at), least = [...ring].sort(compareCodePoints)[0], start = ring.indexOf(least);
      const ordered = [...ring.slice(start), ...ring.slice(0, start)];
      witnesses.push([...ordered, ordered[0]].join("->")); return;
    }
    if (done.has(id)) return;
    active.push(id);
    for (const to of sorted(edges.filter(([from]) => from === id).map(([, to]) => to))) walk(to);
    active.pop(); done.add(id);
  };
  vertices.forEach(walk); return sorted(witnesses);
}

/** Internal atomic side artifact. A rejected candidate may be inspected for
 * independently evaluable defects, but no subset or positive semantic result is
 * published. Existing resolver issues and admission results remain lossless.
 */
export function composePinnedModules(input: unknown, trust: CompositionTrust): JsonRecord {
  const result: JsonRecord = { contract_version: "mesr-composition-lock/0.1", method_version: "mesr-finite-composition/0.1",
    status: "INVALID_COMPOSITION", semantic_entries: [], mappings: [], profiles: [], requirements: [], nonclaims: [],
    diagnostics: [], admission: null, legacy_issues: [], legacy_resolver_called: false, requested_modules: [], resolved_modules: [],
    provenance: null, core_basis_input: null, later_assurance: "WITHHELD_FOR_TRANCHE_2" };
  const issue = (rule_id: string, subject: string, field: string, related_id = "") => {
    const row: AdmissionDiagnostic = { rule_id, subject, field, related_id, detail: rule_id };
    if (!result.diagnostics.some((d: AdmissionDiagnostic) => canonicalJson(d) === canonicalJson(row))) result.diagnostics.push(row);
  };
  const finish = () => {
    result.diagnostics.sort((a: AdmissionDiagnostic, b: AdmissionDiagnostic) => {
      for (const key of ["rule_id", "subject", "field", "related_id", "detail"] as const) { const n = compareCodePoints(a[key], b[key]); if (n) return n; } return 0;
    });
    return freeze(result);
  };
  try { canonicalJson(input); canonicalJson(trust); }
  catch (error) { if (!(error instanceof CanonicalInputError)) throw error; result.admission = inspectCanonicalAdmission(input, trust); issue("LOCK_BASIS_UNRESOLVED", "composition", "shape"); return finish(); }
  const source = structuredClone(input) as JsonRecord;
  // Only set-valued outer inventories are normalized; manifest arrays and exact
  // raw bytes keep their original digest domains and may never be reordered.
  if (record(source)) {
    if (Array.isArray(source.modules) && source.modules.every(record)) source.modules.sort((a: JsonRecord, b: JsonRecord) => compareCodePoints(canonicalJson(a), canonicalJson(b)));
    if (Array.isArray(source.lock) && source.lock.every(record)) source.lock = sortRecords(source.lock);
    if (Array.isArray(source.relations) && source.relations.every(record)) source.relations = sortRecords(source.relations);
    if (Array.isArray(source.effective_changes) && source.effective_changes.every(record)) source.effective_changes = sortRecords(source.effective_changes);
  }
  const admission = inspectCanonicalAdmission(source, trust);
  result.admission = admission;
  if (admission.input_issues.length || source?.kind !== "composition") { issue("LOCK_BASIS_UNRESOLVED", "composition", "shape"); return finish(); }
  const modules = [...source.modules].sort(moduleOrder) as MesrModuleManifest[];
  const byId = new Map(modules.map(m => [m.module_id, m]));
  result.requested_modules = modules.map(m => ({ module_id: m.module_id, module_type: m.module_type, version: m.version, digest: contentDigest(m) }));
  const legacy = composeMesrModules(modules);
  result.legacy_resolver_called = true;
  result.legacy_issues = structuredClone(legacy.issues);
  // Auxiliary diagnostics have fixed templates. Legacy detail/order is retained
  // verbatim above, not overwritten with these normalized contract diagnostics.
  for (const old of legacy.issues) {
    if (old.code === "CIRCULAR_MODULE_DEPENDENCY") continue;
    if (old.code === "MAPPING_TYPE_FORBIDDEN" && byId.get(old.subject)?.module_type === "institutional_profile") continue;
    const noRelated = ["INCOMPATIBLE_CORE_VERSION", "CROSSWALK_SEMANTICS_FORBIDDEN", "PROFILE_SEMANTIC_PARTICIPATION_FORBIDDEN"].includes(old.code);
    issue(old.code, old.subject, old.field, noRelated ? "" : old.detail);
  }
  const dependencyEdges: [string, string][] = modules.flatMap(m => m.dependencies.map(d => [m.module_id, d.module_id] as [string, string]));
  for (const witness of cycleWitnesses(dependencyEdges)) issue("CIRCULAR_MODULE_DEPENDENCY", "composition", "dependencies", witness);
  let canonicalInventoryChanged = false;
  for (const [i, module] of modules.entries()) {
    for (const dependency of module.dependencies) {
      if (modules.findIndex(m => m.module_id === dependency.module_id) >= i) issue("LOCK_BASIS_UNRESOLVED", module.module_id, "forward_dependency", dependency.module_id);
    }
    // Existing Core/software source is the semantic inventory. No new registry
    // or new contextual canonical ID is created by a caller-authored dossier.
    const canonicalModule = module.module_type === "core" ? MESR_CORE_MODULE : module.module_type === "domain_pack" ? MESR_SOFTWARE_DOMAIN_MODULE : null;
    if (canonicalModule) {
      if (contentDigest(module) !== contentDigest(canonicalModule)) canonicalInventoryChanged = true;
      for (const entry of module.added_semantics) {
        const original = canonicalModule.added_semantics.find(e => e.semantic_id === entry.semantic_id);
        if (!original) {
          if (!legacy.issues.some(d => d.subject === module.module_id && d.detail === entry.semantic_id)) issue("LOCK_NONINTERFERENCE_UNPROVEN", module.module_id, "semantic_identity", entry.semantic_id);
          continue;
        }
        if (entry.supports.some(c => !original.supports.includes(c))) issue("LOCK_SUPPORT_WIDENING", module.module_id, "supports", entry.semantic_id);
        if (original.does_not_support.some(c => !entry.does_not_support.includes(c))) issue("LOCK_NONCLAIM_REMOVAL", module.module_id, "does_not_support", entry.semantic_id);
        if (original.required_bindings.some(b => !entry.required_bindings.includes(b))) issue("LOCK_BINDING_WEAKENING", module.module_id, "required_bindings", entry.semantic_id);
        // Full definitions, predicates, versions and lifecycle meaning remain pinned
        // by T1-01; comparisons above explain specific independently visible defects.
      }
    }
    const pinned = trust.modules.find(m => m.module_id === module.module_id);
    if (module.module_type === "crosswalk") for (const mapping of module.mappings) {
      const original = pinned?.mappings.find(m => m.external_concept === mapping.external_concept);
      if (original && mapping.source_version !== original.source_version) issue("LOCK_CONTEXT_VERSION_MISMATCH", module.module_id, "source_version");
      if (mapping.mapping_relation !== "maps_to") issue("LOCK_NONINTERFERENCE_UNPROVEN", module.module_id, "mapping_relation", mapping.mapping_relation);
    }
    if (["crosswalk", "institutional_profile"].includes(module.module_type)) {
      const expected = trust.context_versions?.[module.module_id];
      if (!record(expected) || Object.keys(expected).length === 0 || !record(trust.context_modules)) issue("LOCK_BASIS_UNRESOLVED", module.module_id, "context_versions");
      else if (canonicalJson(source.context_versions?.[module.module_id] ?? null) !== canonicalJson(expected)
        || Object.entries(expected).some(([role, version]) => byId.get(trust.context_modules[role])?.version !== version)) issue("LOCK_CONTEXT_VERSION_MISMATCH", module.module_id, "context_versions");
    }
  }
  for (const change of source.effective_changes ?? []) {
    const rules: Record<string, string> = { binding_weakening: "LOCK_BINDING_WEAKENING", nonclaim_removal: "LOCK_NONCLAIM_REMOVAL", support_widening: "LOCK_SUPPORT_WIDENING" };
    issue(rules[change.kind] ?? "LOCK_NONINTERFERENCE_UNPROVEN", change.module_id, "effective_claim", change.claim);
  }
  const relations = source.relations ?? [];
  for (const [type, rule] of [["alias", "LOCK_ALIAS_CYCLE"], ["supersedes", "LOCK_SUPERSESSION_CYCLE"]]) {
    const selected = relations.filter((r: JsonRecord) => r.type === type);
    const cycles = cycleWitnesses(selected.map((r: JsonRecord) => [r.from, r.to]));
    cycles.forEach(witness => issue(rule, "composition", type, witness));
    if (selected.length && !cycles.length && !selected.some((r: JsonRecord) => r.activate)) issue("LOCK_BASIS_UNRESOLVED", "composition", type);
  }
  for (const relation of relations) {
    if (relation.activate || !["alias", "refines", "requires", "entails", "orthogonal_to", "adjacent_to", "conflicts_with", "supersedes"].includes(relation.type)) issue("LOCK_NONINTERFERENCE_UNPROVEN", "composition", "relation", relation.type);
  }
  // The original admission result always stays intact. A more specific diagnostic
  // can explain its umbrella failure; admission rejection still gates ALL output.
  for (const d of admission.diagnostics) {
    if (d.rule_id === "LOCK_NONINTERFERENCE_UNPROVEN") continue;
    if (d.rule_id === "LOCK_DEPENDENCY_VERSION_MISMATCH" && !byId.has(d.related_id)) continue; // legacy missing dependency above
    if (d.rule_id === "LOCK_REGISTRY_MISMATCH" && d.field === "core" && result.diagnostics.some((r: AdmissionDiagnostic) => r.rule_id === "CIRCULAR_MODULE_DEPENDENCY")) continue;
    issue(d.rule_id, d.subject, d.field, d.related_id);
  }
  if (canonicalInventoryChanged && !result.diagnostics.length) issue("LOCK_NONINTERFERENCE_UNPROVEN", "composition", "admission_basis");
  if (admission.status !== "CHECKED_BASIS" && !result.diagnostics.length) {
    for (const d of admission.diagnostics) issue(d.rule_id, d.subject, d.field, d.related_id);
    if (!result.diagnostics.length) issue("LOCK_NONINTERFERENCE_UNPROVEN", "composition", "admission_basis");
  }
  result.provenance = { input_set_id: source.input_set_id ?? null, registry: source.registry ?? null,
    requested_module_digests: result.requested_modules, admission_basis_refs: admission.checked_basis?.admission_basis_refs ?? [],
    candidate_admission_digest: contentDigest(admission), relation_ledger: relations, relations_activated: false,
    context_basis_digest: contentDigest({ versions: trust.context_versions ?? null, modules: trust.context_modules ?? null }),
    core_boundaries_digest: contentDigest(MESR_CLAIM_BOUNDARIES), binding_method: "mesr-binding-requirements/0.1" };
  if (admission.status !== "CHECKED_BASIS" || result.diagnostics.length || legacy.status !== "VALID_COMPOSITION") return finish();
  // Publication happens once, after every constraint succeeds. Clone all content;
  // freezing the result must never freeze or otherwise mutate caller-owned input.
  result.status = "VALID_COMPOSITION";
  result.semantic_entries = structuredClone(legacy.semantic_entries);
  result.mappings = structuredClone(legacy.mappings);
  result.profiles = structuredClone(legacy.profiles);
  result.resolved_modules = legacy.modules.map(m => structuredClone(admission.checked_basis!.modules.find((row: JsonRecord) => row.module_id === m.module_id)));
  result.requirements = modules.flatMap(m => m.added_semantics.map(e => ({ module_id: m.module_id, semantic_id: e.semantic_id, entry_digest: contentDigest(e), required_bindings: [...e.required_bindings] })));
  result.nonclaims = modules.flatMap(m => m.added_semantics.map(e => ({ module_id: m.module_id, semantic_id: e.semantic_id, entry_digest: contentDigest(e), does_not_support: [...e.does_not_support] })));
  // Existing T1-02/T1-03 consumers still receive their pinned Core-only basis.
  // Context never substitutes a registry or supplies state-selection rules.
  result.core_basis_input = { ...source, modules: structuredClone(modules.filter(m => m.module_id === "mesr.core")),
    lock: source.lock.filter((l: JsonRecord) => l.module_id === "mesr.core"), raw_manifests: { "mesr.core": source.raw_manifests["mesr.core"] }, relations: [], effective_changes: [] };
  admitted.add(result);
  return finish();
}

/** Consume only a successful in-process composition; Core's existing collector
 * owns predicates, unions and path exclusions. This function selects no state.
 */
export function collectComposedRequirements(input: unknown, composition: JsonRecord, trust: CompositionTrust) {
  if (!admitted.has(composition)) throw new TypeError("An in-process admitted composition is required");
  return collectBindingRequirements(input, composition.core_basis_input, trust);
}
