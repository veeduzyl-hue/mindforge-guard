import { canonicalJson, parseExactJson } from "./canonicalBytes.ts";
import { evaluateClaims } from "./evaluateClaim.ts";
import { nonempty, record, type AdmissionTrust, type JsonRecord } from "./contracts.ts";
import type { RequirementContext } from "./requirements.ts";

// Private, explicit invocation only. These annotations select no canonical state.
const CONTRACT = "t2-01-private-event-result/0.1";
const GATE = "t2_01_result_basis";
const SOURCE = "docs/architecture/t2-01-internal-event-result-serialization-v0.1.md";
const CONTEXT = ["subject", "revision", "scope"];
const EVENT = ["event_id", ...CONTEXT, "checked_property", "method", "method_version", "event_time"];
const ACTORS = ["producer", "verifier"];
const RESULT = ["input_ref", "criterion", "result", "limitations"];
const own = (x: JsonRecord, k: string) => Object.hasOwn(x, k);
const timestamp = (x: unknown) => typeof x === "string" && /(?:Z|[+-]\d{2}:\d{2})$/.test(x) && Number.isFinite(Date.parse(x));
const pointer = (key: string) => key.replaceAll("~", "~0").replaceAll("/", "~1");
export type OccurrenceAnnotation = "NO_ATTRIBUTABLE_OCCURRENCE" | "ATTRIBUTABLE_OCCURRENCE" | "ATTRIBUTABLE_OCCURRENCE_WITH_RESULT" | "ATTRIBUTABLE_OCCURRENCE_RESULT_UNRESOLVED";
export interface VerificationClaimContext {
  input: unknown;
  coreInput: unknown;
  trust: AdmissionTrust;
  contexts?: readonly RequirementContext[];
  // A retained caller-supplied set record is mandatory for multiple candidates.
  result_set_ref?: string;
}

function inspect(supplied: unknown) {
  // The exact parser rejects duplicate decoded keys before they can be erased.
  const input = typeof supplied === "string" ? parseExactJson(supplied) : supplied;
  canonicalJson(input);
  const out: JsonRecord = { contract_version: CONTRACT, raw_input: structuredClone(input),
    occurrence_basis: { established: false, refs: [] }, result_basis: { requested: false, established: false, refs: [], values: [] },
    missing_facts: [], diagnostics: [], provenance: [] };
  const issue = (path: string, obligation: string, kind: string, refs: string[] = []) => {
    out.missing_facts.push({ path, obligation }); out.diagnostics.push({ path, issue: kind, refs });
  };
  const text = (r: JsonRecord, k: string, path: string) => {
    if (nonempty(r[k])) return true;
    const kind = !own(r, k) ? "ABSENT" : r[k] === null ? "NULL" : typeof r[k] !== "string" ? "WRONG_TYPE" : r[k] === "" ? "EMPTY" : "WHITESPACE";
    issue(path + "/" + pointer(k), k, kind); return false;
  };
  const array = (r: JsonRecord, k: string, path: string, nonemptySet: boolean) => {
    if (!Array.isArray(r[k])) { issue(path + "/" + k, k, !own(r, k) ? "ABSENT" : r[k] === null ? "NULL" : "WRONG_TYPE"); return false; }
    if (nonemptySet && !r[k].length) { issue(path + "/" + k, k, "EMPTY_SET"); return false; }
    let valid = true;
    for (let i = 0; i < r[k].length; i++) if (!text(r[k], String(i), path + "/" + k)) valid = false;
    if (new Set(r[k]).size !== r[k].length) { issue(path + "/" + k, k, "DUPLICATE_REFERENCE"); valid = false; }
    return valid;
  };
  const equal = (a: JsonRecord, b: JsonRecord, fields: string[], path: string, refs: string[]) => {
    for (const k of fields) if (a[k] !== b[k]) issue(path + "/" + k, k, "MISMATCH", refs);
  };
  const closed = (r: JsonRecord, keys: string[], path: string) => { for (const k of Object.keys(r)) if (!keys.includes(k)) issue(path + "/" + pointer(k), "closed_control_keys", "UNKNOWN_CONTROL_KEY"); };
  if (!record(input)) { issue("", "envelope", "WRONG_TYPE"); return { out, issue, input: null, event: null, candidates: [], admissible: false }; }
  const x = input as JsonRecord;
  closed(x, ["contract_version", "requested_dimension", "target", "occurrence_ref", "result_refs", "records"], "");
  if (x.contract_version !== CONTRACT) issue("/contract_version", "contract_version", "UNSUPPORTED_CONTRACT");
  if (!["occurrence", "occurrence_and_result"].includes(x.requested_dimension)) issue("/requested_dimension", "requested_dimension", "INVALID_DIMENSION");
  out.result_basis.requested = x.requested_dimension === "occurrence_and_result";
  if (!record(x.target)) issue("/target", "target", "INVALID_TARGET");
  else { closed(x.target, CONTEXT, "/target"); CONTEXT.forEach(k => text(x.target, k, "/target")); }
  if (!record(x.records)) issue("/records", "records", "INVALID_RECORD_MAP");
  if (out.diagnostics.length) return { out, issue, input: x, event: null, candidates: [], admissible: false };
  const pathOf = (ref: string) => "/records/" + pointer(ref);
  const get = (ref: unknown, kind: string, selection: string): JsonRecord | null => {
    if (!nonempty(ref) || !own(x.records, ref as string) || !record(x.records[ref as string])) { issue(selection, "retained_" + kind, "UNRESOLVED_REFERENCE", typeof ref === "string" ? [ref] : []); return null; }
    const key = ref as string, r = x.records[key], path = pathOf(key);
    for (const field of ["kind", "source_namespace", "source_ref"]) text(r, field, path);
    if (r.kind !== kind) issue(path + "/kind", kind, "WRONG_KIND", [key]);
    if (r.source_ref !== key) issue(path + "/source_ref", "lookup_key", "MISMATCH", [key]);
    for (const field of Object.keys(r).sort()) out.provenance.push({ field, record_ref: key, pointer: path + "/" + pointer(field) });
    return r;
  };
  const fields = (r: JsonRecord, keys: string[], path: string) => keys.forEach(k => text(r, k, path));
  const eventFields = (r: JsonRecord, path: string) => { fields(r, EVENT, path); if (nonempty(r.event_time) && !timestamp(r.event_time)) issue(path + "/event_time", "zoned_event_time", "INVALID_TIME"); };
  const content = (r: JsonRecord, path: string) => { if (!own(r, "content")) issue(path + "/content", "retained_content", "ABSENT"); };
  text(x, "occurrence_ref", "");
  const event = get(x.occurrence_ref, "verification_occurrence", "/occurrence_ref");
  const outputs = new Map<string, JsonRecord>();
  if (event) {
    const path = pathOf(x.occurrence_ref);
    eventFields(event, path); fields(event, ACTORS, path); equal(event, x.target, CONTEXT, path, [x.occurrence_ref]);
    if (array(event, "output_refs", path, true)) for (const ref of event.output_refs) {
      const output = get(ref, "output", path + "/output_refs");
      if (output) { const op = pathOf(ref); eventFields(output, op); content(output, op); equal(output, event, ["source_namespace", ...EVENT], op, [x.occurrence_ref, ref]); outputs.set(ref, output); }
    }
    for (const [ref, other] of Object.entries(x.records) as [string, JsonRecord][]) {
      if (ref === x.occurrence_ref || !record(other) || other.kind !== "verification_occurrence" || !nonempty(event.event_id) || !nonempty(event.source_namespace)) continue;
      if (other.source_namespace === event.source_namespace && other.event_id === event.event_id && [...EVENT, ...ACTORS].some(k => other[k] !== event[k])) issue(pathOf(ref), "unique_native_event_context", "CONFLICTING_EVENT_IDENTITY", [x.occurrence_ref, ref]);
    }
  }
  out.occurrence_basis.established = out.diagnostics.length === 0;
  out.occurrence_basis.refs = event ? [x.occurrence_ref, ...outputs.keys()] : [];
  const candidates: JsonRecord[] = [];
  let allResultsValid = false;
  if (out.result_basis.requested) {
    const start = out.diagnostics.length;
    if (array(x, "result_refs", "", true)) for (const ref of x.result_refs) {
      const before = out.diagnostics.length, r = get(ref, "verification_result", "/result_refs");
      out.result_basis.refs.push(ref);
      if (!r) continue;
      if (typeof r.result === "string") out.result_basis.values.push(r.result);
      const path = pathOf(ref); eventFields(r, path); fields(r, [...ACTORS, ...RESULT, "event_ref", "output_ref"], path);
      if (!["passed", "failed", "inconclusive"].includes(r.result)) issue(path + "/result", "explicit_result", "INVALID_RESULT", [ref]);
      if (r.event_ref !== x.occurrence_ref) issue(path + "/event_ref", "event_association", "MISMATCH", [ref]);
      if (event) equal(r, event, ["source_namespace", ...EVENT, ...ACTORS], path, [x.occurrence_ref, ref]);
      const output = outputs.get(r.output_ref);
      if (!output) issue(path + "/output_ref", "occurrence_output_membership", "UNRESOLVED_REFERENCE", [ref]);
      else { const op = pathOf(r.output_ref); fields(output, RESULT, op); equal(output, r, RESULT, op, [ref, r.output_ref]); }
      const retainedInput = get(r.input_ref, "input", path + "/input_ref");
      if (retainedInput) { const ip = pathOf(r.input_ref); fields(retainedInput, CONTEXT, ip); content(retainedInput, ip); equal(retainedInput, r, ["source_namespace", ...CONTEXT], ip, [ref, r.input_ref]); }
      if (before === out.diagnostics.length) candidates.push(r);
    }
    allResultsValid = out.occurrence_basis.established && start === out.diagnostics.length && candidates.length > 0;
  }
  const predicates = new Set(candidates.map(r => canonicalJson([r.checked_property, r.method, r.method_version, r.criterion, r.input_ref])));
  const admissible = allResultsValid && predicates.size === 1;
  if (predicates.size > 1) issue("/result_refs", "unambiguous_predicate", "AMBIGUOUS_RESULT_PREDICATE", out.result_basis.refs);
  const values = new Set(candidates.map(r => r.result));
  if (values.size > 1) out.diagnostics.push({ path: "/result_refs", issue: "COMPETING_RESULTS", refs: candidates.map(r => r.source_ref) });
  out.result_basis.established = admissible && values.size === 1;
  out.annotation = !out.occurrence_basis.established ? "NO_ATTRIBUTABLE_OCCURRENCE" : !out.result_basis.requested ? "ATTRIBUTABLE_OCCURRENCE" : out.result_basis.established ? "ATTRIBUTABLE_OCCURRENCE_WITH_RESULT" : "ATTRIBUTABLE_OCCURRENCE_RESULT_UNRESOLVED";
  return { out, issue, input: x, event, candidates, admissible };
}

/** Retained factual associations only; never executes a check or authenticates an actor.
 * An optional canonical response is returned verbatim from the unchanged T1 evaluator.
 */
export function evaluateVerificationEvent(input: unknown, context?: VerificationClaimContext): JsonRecord {
  const checked = inspect(input), { out, issue, event, candidates } = checked;
  if (!context) { issue("/claim_context", "separately_supplied_canonical_context", "NOT_SUPPLIED"); return out; }
  const original = context.input as JsonRecord;
  const contexts = context.contexts ?? [];
  if (record(original) && (record(original.bindings) && own(original.bindings, GATE)
    || record(original.predicates) && own(original.predicates, GATE)
    || Array.isArray(original.requests) && original.requests.some((r: JsonRecord) => Array.isArray(r?.required_bindings) && r.required_bindings.includes(GATE)))
    || Array.isArray(contexts) && contexts.some(c => Array.isArray(c?.requirements) && c.requirements.some(r => r?.binding === GATE))) throw new TypeError("Reserved binding collision: " + GATE);
  if (!context.trust || context.coreInput === undefined || context.input === undefined) { issue("/claim_context", "canonical_context", "NOT_SUPPLIED"); return out; }
  // Preserve actual T1 input rejection, before attempting any structural bridge.
  const prior = evaluateClaims(original, context.coreInput, context.trust, contexts);
  if (prior.status === "REJECTED") { out.claim_evaluation = prior; return out; }
  if (!checked.input || !out.annotation) { issue("/claim_context", "valid_private_envelope", "INVALID_PRIVATE_INPUT"); return out; }
  if (!timestamp(original.bindings?.evaluation_time) || !record(original.method) || !["id", "version", "digest"].every(k => nonempty(original.method[k]))) { issue("/claim_context", "explicit_time_and_method_descriptor", "MISSING_CONTEXT"); return out; }
  if (original.subject !== checked.input.target.subject || original.scope !== checked.input.target.scope
    || own(original, "revision") && original.revision !== checked.input.target.revision
    || event && (original.method.id !== event.method || original.method.version !== event.method_version)) { issue("/claim_context", "same_context_and_method", "MISMATCH"); return out; }
  const source = structuredClone(original), extra = structuredClone(contexts) as RequirementContext[];
  let gate = checked.admissible;
  if (gate && candidates.length > 1) {
    const ref = context.result_set_ref, set = nonempty(ref) && checked.input.records[ref as string];
    if (!record(set) || set.source_ref !== ref || set.source_namespace !== event!.source_namespace
      || CONTEXT.some(k => set[k] !== checked.input!.target[k]) || !Array.isArray(set.result_refs)
      || canonicalJson([...set.result_refs].sort()) !== canonicalJson([...checked.input.result_refs].sort())) {
      issue("/claim_context/result_set_ref", "retained_complete_candidate_set", "MISSING_OR_MISMATCHED_SET"); return out;
    }
  }
  source.events = [];
  source.evidence_ledger = source.evidence_ledger ?? {};
  // Unavailable result values cannot be supplied by caller-positive hints.
  delete source.bindings.result; delete source.bindings.limitations;
  if (gate) {
    const put = (ref: string, r: JsonRecord) => {
      const witness = structuredClone(r);
      if (own(r, "event_time")) witness.time = r.event_time;
      if (own(source.evidence_ledger, ref) && canonicalJson(source.evidence_ledger[ref]) !== canonicalJson(witness)) throw new TypeError("Retained ledger collision: " + ref);
      source.evidence_ledger[ref] = witness;
    };
    source.event_id = event!.event_id; source.event_time = event!.event_time;
    for (const r of candidates) {
      source.events.push({ kind: "verification", event_id: r.event_id, subject: r.subject, scope: r.scope, time: r.event_time, property: r.checked_property,
        method: r.method, method_version: r.method_version, producer: r.producer, verifier: r.verifier, criterion: r.criterion, result: r.result, input_ref: r.input_ref, output_ref: r.output_ref });
      for (const ref of [r.input_ref, r.output_ref, r.source_ref]) put(ref, checked.input.records[ref]);
    }
    Object.assign(source.bindings, { verifier: event!.verifier, method: event!.method, subject: event!.subject, scope: event!.scope, verified_at: event!.event_time });
    if (candidates.length === 1) { source.bindings.result = candidates[0].result; source.bindings.limitations = candidates[0].limitations; }
    else { const ref = context.result_set_ref!; put(ref, checked.input.records[ref]); source.bindings.result = ref; source.bindings.limitations = ref; }
    // Preserve caller references and all candidate references; never choose a winner.
    if (source.bindings.evidence_refs === undefined || Array.isArray(source.bindings.evidence_refs)) source.bindings.evidence_refs = [...new Set([...(source.bindings.evidence_refs ?? []), ...candidates.flatMap(r => [r.input_ref, r.output_ref, r.source_ref])])];
  }
  source.bindings[GATE] = gate;
  for (const request of source.requests) if (request.semantic_ids.includes("mesr.core.evidence.verification") && ["verification.passed", "verification.occurred"].includes(request.claim)) extra.push({ path: request.path, subject: source.subject, scope: source.scope, evaluation_time: source.bindings.evaluation_time, source_ref: SOURCE, requirements: [{ binding: GATE, predicate: "true" }] });
  out.claim_evaluation = evaluateClaims(source, context.coreInput, context.trust, extra);
  return out;
}
