import type { MesrModuleManifest } from "../types.ts";

export const ADMISSION_CONTRACT = "mesr-canonical-admission/0.1" as const;
export const BYTE_METHOD = "json-codepoint-utf8/0.1" as const;
export type JsonRecord = Record<string, any>;
export interface AdmissionTrust {
  proof: JsonRecord;
  proof_digest: string;
  proof_ref: string;
  registry: { version: string; digest: string };
  modules: readonly MesrModuleManifest[];
  request_paths: readonly string[];
}
export interface AdmissionDiagnostic {
  rule_id: string;
  subject: string;
  field: string;
  related_id: string;
  detail: string;
}
export interface InputIssue { field: string; code: string }
export interface AdmissionResult {
  contract_version: typeof ADMISSION_CONTRACT;
  status: "REJECTED" | "CHECKED_INPUT_SHAPE" | "CHECKED_BASIS";
  semantic_composition: "WITHHELD";
  semantic_entries: readonly never[];
  mappings: readonly never[];
  profiles: readonly never[];
  claims: readonly never[];
  diagnostics: AdmissionDiagnostic[];
  input_issues: InputIssue[];
  checked_basis: JsonRecord | null;
}

// Structural schemas only: these do not evaluate predicates, events, states,
// temporal applicability, independence, authority, or evidence sufficiency.
type Shape = (value: unknown) => boolean;
export const record: Shape = value => value !== null && typeof value === "object" && !Array.isArray(value);
const text: Shape = value => typeof value === "string";
export const nonempty: Shape = value => typeof value === "string" && value.trim().length > 0;
const bool: Shape = value => typeof value === "boolean";
const array = (shape: Shape): Shape => value => Array.isArray(value) && value.every(shape);
const strings = array(text);
const fields = (required: Record<string, Shape>, optional: Record<string, Shape> = {}): Shape => value => {
  if (!record(value)) return false;
  const row = value as JsonRecord;
  return Object.entries(required).every(([key, shape]) => Object.hasOwn(row, key) && shape(row[key]))
    && Object.entries(optional).every(([key, shape]) => row[key] === undefined || row[key] === null || shape(row[key]));
};
const textFields = (...keys: string[]) => Object.fromEntries(keys.map(key => [key, nonempty]));
const moduleShape = fields({
  ...textFields("module_id", "version", "semantic_namespace", "core_compatibility"),
  module_type: value => ["core", "domain_pack", "crosswalk", "institutional_profile"].includes(value as string),
  dependencies: array(fields(textFields("module_id", "version"))),
  added_semantics: array(fields({ ...textFields("semantic_id"), definition: text, supports: strings, does_not_support: strings, required_bindings: strings })),
  mappings: array(fields({ ...textFields("external_concept", "target_semantic_id", "mapping_relation", "source_version"), provenance: strings, limitations: strings })),
  conformance_requirements: strings, external_references: strings, prohibited_overrides: strings,
}, { semantic_overrides: array(fields({ left: text, right: text })), presentation: record });
const attribution = fields(textFields("source_ref", "subject", "scope", "time"));
const atomicResult = fields({ claim: nonempty, state: value => ["SUPPORTED", "UNSUPPORTED", "UNRESOLVED", "CONFLICTED", "STALE", "INCONCLUSIVE"].includes(value as string) });
const claimOptional: Record<string, Shape> = {
  events: array(value => record(value) && Object.values(value as JsonRecord).every(text)),
  evidence_ledger: value => record(value) && Object.values(value as JsonRecord).every(fields(textFields("subject", "scope"))),
  producer_principal: nonempty, executor_principal: nonempty, verifier_principal: nonempty,
  separation: fields(textFields("policy", "producer_control", "verifier_control", "evidence_ref")),
  custody: fields({ ...textFields("criterion", "source_ref"), sole_producer_control: bool, transfers: value => strings(value) && (value as string[]).length > 0 }),
  integrity: fields({}, {
    ...Object.fromEntries(["expected_digest", "expected_source", "comparison_event", "checker", "time", "byte_domain", "expected_domain"].map(key => [key, text])),
    bytes_base64: value => text(value) && /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value as string),
  }),
  sufficiency: fields({}, {
    ...Object.fromEntries(["profile_id", "profile_version", "profile_digest", "claim_set_id", "claim_set_version", "claim_set_digest", "scope", "evaluation_time", "material_gap_result", "criterion_ref"].map(key => [key, text])),
    evidence_refs: strings, requirements: strings, evaluated_requirements: strings, atomic_results: array(atomicResult),
  }),
  temporal: fields({ effective_from: value => value === null || text(value), effective_until: value => value === null || text(value) }, {
    ...Object.fromEntries(["reliance_time", "interval_rule", "observed_at", "continuity_result"].map(key => [key, text])),
    historical_support: bool, age_requested: bool, max_age_ms: value => typeof value === "number" && value > 0,
    continuity: value => record(value) && Object.values(value as JsonRecord).every(v => ["same", "material_loss"].includes(v)),
    snapshot: fields({ ...textFields("horizon", "publisher", "source_ref"), complete: bool }),
    status_records: array(fields({ ...textFields("subject", "scope", "time", "value", "ref"), attributable: bool })),
    revocation: fields({ ...textFields("effective_at", "source_ref"), attributable: bool }),
  }),
  authority_rebinding: attribution, acceptance_authority: attribution, acceptance_event: attribution,
  report_link: fields({ bytes: text, expected_digest: nonempty }), harness_missing_facts: strings,
  raw_producer: fields({}, { jobs: array(fields({}, { check: record })), verification_events: array(record) }),
};

export function inputShapeIssues(input: unknown, requestPaths: readonly string[]): InputIssue[] {
  const issues: InputIssue[] = [];
  const check = (shape: Shape, value: unknown, field: string) => { if (!shape(value)) issues.push({ code: "INVALID_INPUT_SHAPE", field }); };
  if (!record(input)) return [{ code: "INVALID_INPUT_SHAPE", field: "$" }];
  const row = input as JsonRecord;
  if (row.kind === "composition") {
    const allowed = ["kind", "input_set_id", "modules", "registry", "lock", "raw_manifests", "admission_basis", "context_versions", "relations", "effective_changes", "evaluation_time"];
    for (const key of Object.keys(row)) if (!allowed.includes(key)) issues.push({ code: "UNKNOWN_INPUT_FIELD", field: key });
    check(array(moduleShape), row.modules, "modules");
    if (row.lock != null) check(array(fields({ module_id: nonempty, dependencies: array(fields({ module_id: nonempty, content_digest: text })) })), row.lock, "lock");
    if (row.raw_manifests != null) check(value => record(value) && Object.values(value as JsonRecord).every(text), row.raw_manifests, "raw_manifests");
    if (row.relations != null) check(array(fields(textFields("type", "from", "to"), { activate: bool })), row.relations, "relations");
    if (row.effective_changes != null) check(array(fields(textFields("kind", "module_id", "claim"))), row.effective_changes, "effective_changes");
  } else if (row.kind === "claims") {
    check(value => Array.isArray(value) && value.length > 0 && value.every(fields({
      path: value => requestPaths.includes(value as string), claim: nonempty,
      semantic_ids: value => strings(value) && (value as string[]).length > 0, semantic_version: nonempty,
    }, { required_bindings: strings })), row.requests, "requests");
    check(record, row.bindings, "bindings");
    for (const key of ["subject", "scope", "input_set_id", "producer"]) check(nonempty, row[key], key);
    for (const [key, shape] of Object.entries(claimOptional)) if (row[key] != null) check(shape, row[key], key);
    if (record(row.sufficiency) && row.sufficiency.material_gap_result === "no_material_gap") {
      check(value => Array.isArray(value) && value.length > 0, row.sufficiency.atomic_results, "sufficiency.atomic_results");
    }
  } else issues.push({ code: "UNSUPPORTED_INPUT_KIND", field: "kind" });
  return issues;
}
