import { canonicalJson, CanonicalInputError, sha256Bytes } from "./canonicalBytes.ts";
import { nonempty, record, type JsonRecord } from "./contracts.ts";
import type { RequirementContext } from "./requirements.ts";

// Internal explicit computation only. No serialized value is receipt authority.
const receipts = new WeakMap<object, { input: string; contexts: string; path: string; facts: JsonRecord }>();
const sha = (v: unknown) => typeof v === "string" && /^[a-f0-9]{64}$/.test(v);
const time = (v: unknown) => typeof v === "string" && /(?:Z|[+-]\d{2}:\d{2})$/.test(v) && Number.isFinite(Date.parse(v));
const strings = (v: unknown) => Array.isArray(v) && v.length > 0 && v.every(nonempty);
function freeze<T>(v: T): T { if (v && typeof v === "object") { Object.values(v).forEach(freeze); Object.freeze(v); } return v; }

/** Private inspection retains facts even when no admissible receipt can issue.
 * Expected references are supplied declarations, never derived from these bytes.
 * Attribution is not authentication/custody. No Core admission or state selection.
 */
export function compareExactBytes(input: unknown, path: string, contexts: readonly RequirementContext[] = []) {
  // Validate before traversal: no accessors, hidden properties or non-JSON data.
  const inputSnapshot = canonicalJson(input), contextSnapshot = canonicalJson(contexts);
  const raw = JSON.parse(inputSnapshot), missing: string[] = [];
  const facts: JsonRecord = { method: "exact-octets-sha256/0.1", raw_input: raw, requirement_contexts: JSON.parse(contextSnapshot),
    path, expected_digest: null, recomputed_digest: null, measured_byte_length: null, match: null,
    nonclaims: ["authenticity", "truth", "custody", "verifier_independence", "outcome_correctness", "institutional_acceptance", "authority", "execution_permission", "compliance"] };
  const need = (ok: unknown, name: string) => { if (!ok) missing.push(name); };
  const source: JsonRecord = record(raw) ? raw : {};
  const integrity = record(source.integrity) ? source.integrity : {};
  facts.expected_digest = integrity.expected_digest ?? null;
  const transport = integrity.bytes_base64;
  // Buffer is permissive. Require the existing padded alphabet and exact round
  // trip, including zero pad bits; never repair malformed transport.
  const syntax = typeof transport === "string" && /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(transport);
  const bytes = syntax ? Buffer.from(transport, "base64") : null;
  const exact = bytes !== null && bytes.toString("base64") === transport;
  need(exact, "exact_byte_transport");
  if (exact) { facts.measured_byte_length = bytes!.length; facts.recomputed_digest = sha256Bytes(bytes!); }
  need(sha(integrity.expected_digest), "expected_sha256");
  if (exact && sha(integrity.expected_digest)) facts.match = facts.recomputed_digest === integrity.expected_digest;
  const requests = Array.isArray(source.requests) ? source.requests.filter((r: JsonRecord) => r?.path === path) : [];
  const request = requests.length === 1 ? requests[0] : {};
  need(request.claim === "artifact.byte_equality" && request.semantic_version === "0.1.0"
    && Array.isArray(request.semantic_ids) && request.semantic_ids.includes("mesr.core.evidence.item"), "claim_identity");
  need([source.subject, source.revision, source.scope].every(nonempty), "subject_revision_scope");
  need(time(source.bindings?.evaluation_time), "evaluation_time");
  need(time(integrity.time), "comparison_time");
  need(nonempty(integrity.byte_domain) && integrity.byte_domain === integrity.expected_domain, "same_byte_domain");
  const ledger = record(source.evidence_ledger) ? source.evidence_ledger : {};
  const witness = (ref: unknown, kind: string): JsonRecord => {
    const r = typeof ref === "string" && record(ledger[ref]) ? ledger[ref] : {};
    need(nonempty(ref) && r.source_ref === ref && nonempty(r.source_namespace) && r.kind === kind
      && r.subject === source.subject && r.revision === source.revision && r.scope === source.scope, kind + "_witness");
    return r;
  };
  const expected = witness(integrity.expected_source, "expected_reference");
  const event = witness(integrity.comparison_event, "byte_comparison");
  const member = witness(event.input_ref, "byte_member");
  const output = witness(event.output_ref, "comparison_output");
  const keys = ["member_namespace", "member_ref", "representation", "byte_domain"];
  need(keys.every(k => nonempty(event[k]) && expected[k] === event[k] && member[k] === event[k] && output[k] === event[k]), "member_representation_association");
  need(event.byte_domain === integrity.byte_domain, "legacy_domain_association");
  need(expected.expected_digest === integrity.expected_digest && expected.algorithm === "SHA-256"
    && event.algorithm === "SHA-256" && member.algorithm === "SHA-256" && output.algorithm === "SHA-256", "sha256_reference_association");
  need(event.expected_source === integrity.expected_source && event.expected_digest === integrity.expected_digest
    && event.input_ref !== integrity.expected_source && event.output_ref !== integrity.expected_source
    && event.output_ref !== event.input_ref, "independently_specified_reference");
  need(member.bytes_base64 === transport, "supplied_member_bytes");
  need(Number.isSafeInteger(event.byte_length) && event.byte_length >= 0 && event.byte_length === facts.measured_byte_length
    && member.byte_length === event.byte_length && expected.byte_length === event.byte_length && output.byte_length === event.byte_length, "measured_byte_length_association");
  need(event.claim === request.claim && event.path === path && event.semantic_id === "mesr.core.evidence.item"
    && event.semantic_version === request.semantic_version, "comparison_claim_association");
  need(event.time === integrity.time && output.time === event.time && output.comparison_event === integrity.comparison_event
    && event.evaluation_time === source.bindings?.evaluation_time, "comparison_time_association");
  need(nonempty(event.checker) && event.checker === integrity.checker && nonempty(event.checker_version), "checker_attribution");
  need(record(event.method) && event.method.id === "exact-octets-sha256" && event.method.version === "0.1"
    && event.method.digest === "descriptor:exact-octets-sha256/0.1"
    && canonicalJson(event.method ?? null) === canonicalJson(source.method ?? null), "method_descriptor");
  need(strings(event.limitations) && strings(event.provenance_refs), "limitations_provenance");
  for (const ref of Array.isArray(event.provenance_refs) ? event.provenance_refs : []) witness(ref, "provenance");
  // Competing records are never resolved by order or by selecting a passing one.
  for (const kind of ["expected_reference", "byte_comparison"]) {
    const candidates = Object.values(ledger).filter((r: any) => record(r) && r.kind === kind
      && r.subject === source.subject && r.revision === source.revision && r.scope === source.scope
      && r.member_namespace === event.member_namespace && r.member_ref === event.member_ref);
    need(candidates.length === 1, "unambiguous_" + kind);
  }
  facts.comparison_context = { request, expected_source: expected, event, member, output };
  facts.missing = [...new Set(missing)].sort();
  freeze(facts);
  if (missing.length) return freeze({ receipt: null, evidence: facts });
  const receipt = freeze({ evidence: facts });
  receipts.set(receipt, { input: inputSnapshot, contexts: contextSnapshot, path, facts });
  return freeze({ receipt, evidence: facts });
}

/** Identity lookup and context comparison only; never hashes bytes or trusts a
 * caller-written result. Copy/JSON round trips cannot restore receipt identity.
 */
export function readIntegrityReceipt(receipt: unknown, input: unknown, path: string, contexts: readonly RequirementContext[]) {
  if (!receipt || typeof receipt !== "object") return null;
  const saved = receipts.get(receipt);
  if (!saved || saved.path !== path) return null;
  try {
    if (saved.input !== canonicalJson(input) || saved.contexts !== canonicalJson(contexts)) return null;
  } catch (error) { if (error instanceof CanonicalInputError) return null; throw error; }
  return saved.facts;
}
