import { MESR_CORE_REGISTRY } from "../coreRegistry.ts";
import { MESR_CLAIM_BOUNDARIES } from "../claimBoundaries.ts";
import { inspectCanonicalAdmission } from "./admission.ts";
import { canonicalJson, CanonicalInputError, compareCodePoints, contentDigest } from "./canonicalBytes.ts";
import { inputShapeIssues, nonempty, record, type AdmissionTrust, type JsonRecord } from "./contracts.ts";

const METHOD = "mesr-binding-requirements/0.1";
const CONTRACT = "mesr-claim-state-projection/0.1";
const ADR = "docs/adr/0011-mesr-claim-nonclaim-state-and-binding-contract.md";
const ordered = (values: string[]) => [...new Set(values)].sort(compareCodePoints);
const own = (value: JsonRecord, key: string) => Object.hasOwn(value, key);
function immutable<T>(value: T): T {
  if (value && typeof value === "object") { Object.values(value).forEach(immutable); Object.freeze(value); }
  return value;
}

/** Value predicates only. A true result establishes neither evidence truth nor a claim state. */
export function inspectBindingValue(predicate: string, present: boolean, value: unknown) {
  let satisfied = false;
  let defined = true;
  switch (predicate) {
    case "nonempty_reference": satisfied = nonempty(value); break;
    case "nonempty_array": satisfied = Array.isArray(value) && value.length > 0 && value.every(nonempty); break;
    case "true": satisfied = value === true; break;
    case "boolean": satisfied = typeof value === "boolean"; break;
    case "nonnegative_integer": satisfied = Number.isSafeInteger(value) && (value as number) >= 0; break;
    case "reference_array_allow_empty": satisfied = Array.isArray(value) && value.every(nonempty); break;
    default: defined = false;
  }
  return { predicate, defined, present, satisfied: present && defined && satisfied };
}

export interface RequirementContext {
  path: string;
  subject: string;
  scope: string;
  evaluation_time: string;
  source_ref: string;
  requirements: { binding: string; predicate: string }[];
}

/** Internal explicit invocation. Rechecks T1-01 identity/bytes; never trusts a
 * caller-written CHECKED_BASIS label. Additional context contributes obligations
 * only, conjunctively. It grants no semantic-module admission or positive claims.
 * Raw contextual modules remain withheld until the separate composition task.
 */
export function collectBindingRequirements(input: unknown, coreInput: unknown, trust: AdmissionTrust, contexts: readonly RequirementContext[] = []) {
  const result: JsonRecord = {
    contract_version: CONTRACT, method_version: METHOD, state_evaluation: "PENDING_STATE_EVALUATION",
    semantic_composition: "WITHHELD", status: "REJECTED", checked_basis: null,
    input_digest: null, context_digest: null, input_issues: [], admission_diagnostics: [], claims: [],
  };
  try { canonicalJson(input); canonicalJson(contexts); }
  catch (error) {
    if (!(error instanceof CanonicalInputError)) throw error;
    result.input_issues.push({ code: "INVALID_JSON_INPUT", field: "$" }); return immutable(result);
  }
  result.input_digest = contentDigest(input);
  result.context_digest = contentDigest(contexts);
  const admission = inspectCanonicalAdmission(coreInput, trust);
  result.admission_diagnostics = structuredClone(admission.diagnostics);
  if (admission.status !== "CHECKED_BASIS") { result.input_issues = structuredClone(admission.input_issues); return immutable(result); }
  if (admission.checked_basis!.modules.length !== 1 || admission.checked_basis!.modules[0].module_id !== "mesr.core") {
    result.input_issues.push({ code: "CONTEXTUAL_COMPOSITION_WITHHELD", field: "coreInput.modules" }); return immutable(result);
  }
  result.checked_basis = structuredClone(admission.checked_basis);
  result.input_issues = inputShapeIssues(input, trust.request_paths);
  if (result.input_issues.length) return immutable(result);
  const source = input as JsonRecord;
  if (source.kind !== "claims" || canonicalJson(source.registry ?? null) !== canonicalJson(trust.registry)) {
    result.input_issues.push({ code: "UNRESOLVED_CLAIM_BASIS", field: "registry" }); return immutable(result);
  }
  const keys = new Set<string>();
  for (const request of source.requests) {
    const key = canonicalJson([request.path, request.claim]);
    if (keys.has(key)) result.input_issues.push({ code: "DUPLICATE_CLAIM_PATH", field: request.path });
    keys.add(key);
    if (request.observed_state_ids !== undefined && (!Array.isArray(request.observed_state_ids) || !request.observed_state_ids.every(nonempty))) {
      result.input_issues.push({ code: "INVALID_OBSERVED_STATES", field: request.path });
    }
  }
  if (!Array.isArray(contexts) || contexts.some(context => !record(context)
    || !["path", "subject", "scope", "evaluation_time", "source_ref"].every(key => nonempty(context[key as keyof RequirementContext]))
    || !source.requests.some((request: JsonRecord) => request.path === context.path)
    || context.subject !== source.subject || context.scope !== source.scope || context.evaluation_time !== source.bindings.evaluation_time
    || !Array.isArray(context.requirements) || !context.requirements.every(row => record(row) && nonempty(row.binding) && nonempty(row.predicate)))) {
    result.input_issues.push({ code: "UNBOUND_CONTEXT_REQUIREMENTS", field: "contexts" });
  }
  if (result.input_issues.length) return immutable(result);

  const coreNames = new Set(MESR_CORE_REGISTRY.flatMap(entry => [...entry.required_bindings]));
  const boundaryNames = new Set(MESR_CLAIM_BOUNDARIES.flatMap(boundary => [...boundary.required_additional_bindings]));
  const predicateFor = (binding: string) => binding === "evidence_refs" || binding === "witnesses" ? "nonempty_array"
    : binding === "verification_executed" ? "true" : coreNames.has(binding) || boundaryNames.has(binding) ? "nonempty_reference" : "UNDEFINED";
  for (const request of source.requests) {
    const requirements = new Map<string, JsonRecord>();
    const nonclaims: JsonRecord[] = [], exclusions: JsonRecord[] = [], unresolved: JsonRecord[] = [];
    const add = (binding: string, origin: string, predicate = predicateFor(binding)) => {
      let row = requirements.get(binding);
      if (!row) { row = { binding, origins: [], predicates: [] }; requirements.set(binding, row); }
      row.origins.push(origin);
      if (!row.predicates.some((p: JsonRecord) => p.predicate === predicate && p.source_ref === origin)) row.predicates.push({ predicate, source_ref: origin });
    };
    const exclude = (claim: string, source_ref: string, applies: boolean, canonical_nonclaim = claim) => {
      const row = { claim, canonical_nonclaim, source_ref, path: request.path };
      nonclaims.push(row); if (applies) exclusions.push(row);
    };
    const entries = ordered(request.semantic_ids).flatMap(id => {
      const entry = MESR_CORE_REGISTRY.find(entry => entry.semantic_id === id && entry.version === request.semantic_version);
      if (!entry) { unresolved.push({ semantic_id: id, requested_version: request.semantic_version }); return []; }
      return [entry];
    });
    for (const entry of entries) {
      const ref = entry.semantic_id + "@" + entry.version + "#" + contentDigest(entry);
      entry.required_bindings.forEach(binding => add(binding, ref));
      entry.does_not_support.forEach(claim => exclude(claim, ref, claim === request.claim));
    }
    // These are bounded request facets on existing anchors, never new aliases.
    const observation = entries.some(entry => entry.semantic_id === "mesr.core.evidence.observation");
    const verification = entries.some(entry => entry.semantic_id === "mesr.core.evidence.verification");
    const verificationFacet = verification && ["verification.passed", "verification.occurred", "verification.independent"].includes(request.claim);
    const observationFacet = observation && ["verification", "verification.passed", "verification.occurred", "verification.independent", "independent_verification"].includes(request.claim);
    const evidenceItem = entries.some(entry => entry.semantic_id === "mesr.core.evidence.item");
    const observed = Array.isArray(request.observed_state_ids) ? request.observed_state_ids : [];
    for (const boundary of MESR_CLAIM_BOUNDARIES) {
      if (((observed.includes(boundary.evidence_or_state_id)
          || (evidenceItem && ["CB-01", "CB-11"].includes(boundary.boundary_id))) && request.claim === boundary.does_not_support)
        || (observationFacet && boundary.boundary_id === "CB-07")) {
        boundary.required_additional_bindings.forEach(binding => add(binding, "Core:" + boundary.boundary_id));
        // The observation facet keeps the original Core exclusion and its explicit
        // bounded projection label. Neither becomes a global veto on other paths.
        const label = observationFacet && boundary.boundary_id === "CB-07" ? "observation_does_not_establish_verification" : boundary.does_not_support;
        exclude(label, "Core:" + boundary.boundary_id, true, boundary.does_not_support);
      }
    }
    if (verificationFacet) {
      add("evidence_refs", ADR + "#bound-evidence");
      add("method", ADR + "#named-method");
    }
    if (request.claim === "evidence.sufficient" && entries.some(entry => entry.semantic_id === "mesr.core.claim.claim")) add("evidence_refs", ADR + "#required-evidence-set");
    for (const binding of ordered(request.required_bindings ?? [])) add(binding, "caller:" + request.path);
    for (const context of contexts.filter(context => context.path === request.path)) {
      for (const row of context.requirements) {
        // Context cannot replace the minimum even when its predicate is weaker.
        if (predicateFor(row.binding) !== "UNDEFINED") add(row.binding, ADR + "#minimum-predicate");
        add(row.binding, context.source_ref, row.predicate);
      }
    }
    const bindings = [...requirements.values()].sort((a, b) => compareCodePoints(a.binding, b.binding)).map(row => {
      const present = own(source.bindings, row.binding), value = source.bindings[row.binding];
      const predicates = row.predicates.sort((a: JsonRecord, b: JsonRecord) => compareCodePoints(a.predicate, b.predicate) || compareCodePoints(a.source_ref, b.source_ref))
        .map((p: JsonRecord) => ({ ...inspectBindingValue(p.predicate, present, value), source_ref: p.source_ref }));
      const associated = (row.binding !== "subject" || value === source.subject) && (row.binding !== "scope" || value === source.scope);
      const methodAvailable = row.binding !== "method" || !verificationFacet || (record(source.method) && ["id", "version", "digest"].every(key => nonempty(source.method[key])));
      return { binding: row.binding, origins: ordered(row.origins), present, ...(present ? { value: structuredClone(value) } : {}), predicates,
        satisfied: predicates.every((p: JsonRecord) => p.satisfied) && associated && methodAvailable,
        association: { subject: source.subject, scope: source.scope, evaluation_time: source.bindings.evaluation_time ?? null,
          source_ref: source.input_set_id + "#bindings." + row.binding, subject_scope_match: associated, method_descriptor_present: methodAvailable } };
    });
    const missing = bindings.filter(row => !row.satisfied).map(row => row.binding);
    if (!nonempty(source.bindings.evaluation_time)) missing.push("evaluation_time");
    if (unresolved.length) missing.push("semantic_identity");
    const referenceChecks: JsonRecord[] = [];
    if (requirements.has("evidence_refs") && Array.isArray(source.bindings.evidence_refs)) {
      for (const ref of ordered(source.bindings.evidence_refs.filter(nonempty))) {
        const witness = record(source.evidence_ledger) && own(source.evidence_ledger, ref) ? source.evidence_ledger[ref] : null;
        const resolved = record(witness) && witness.subject === source.subject && witness.scope === source.scope;
        referenceChecks.push({ ref, resolved, subject: source.subject, scope: source.scope, source_ref: source.input_set_id + "#evidence_ledger." + ref });
        if (!resolved) missing.push("evidence_ref:" + ref);
      }
    }
    const orderedNonclaims = nonclaims.sort((a, b) => compareCodePoints(a.claim, b.claim) || compareCodePoints(a.source_ref, b.source_ref));
    result.claims.push({ path: request.path, claim: request.claim, state_evaluation: "PENDING_STATE_EVALUATION",
      semantic_ids: ordered(request.semantic_ids), semantic_version: request.semantic_version, unresolved_identities: unresolved,
      effective_requirements: bindings.map(row => row.binding), bindings, reference_checks: referenceChecks,
      missing_bindings: ordered(missing), nonclaims: ordered(orderedNonclaims.map(row => row.claim)), nonclaim_provenance: orderedNonclaims,
      excluded_inferences: exclusions.sort((a, b) => compareCodePoints(a.claim, b.claim) || compareCodePoints(a.source_ref, b.source_ref)),
      caller_assertions: { supported_claim_parts: structuredClone(source.caller_supported_claim_parts ?? []), predicate_hints: structuredClone(source.predicates ?? {}) },
      diagnostics: ordered([...missing.map(binding => "MISSING:" + binding), ...(exclusions.length ? ["INFERENCE_PROHIBITED"] : [])]),
      provenance: { input_set_id: source.input_set_id, subject: source.subject, scope: source.scope,
        evaluation_time: source.bindings.evaluation_time ?? null, source_ref: source.input_set_id, registry: structuredClone(source.registry) } });
  }
  result.claims.sort((a: JsonRecord, b: JsonRecord) => compareCodePoints(a.path, b.path) || compareCodePoints(a.claim, b.claim));
  result.status = "COLLECTED";
  return immutable(result);
}
