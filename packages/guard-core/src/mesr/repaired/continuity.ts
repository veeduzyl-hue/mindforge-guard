import { canonicalJson, contentDigest } from "./canonicalBytes.ts";
import { record, nonempty, type JsonRecord, type AdmissionTrust } from "./contracts.ts";
import { collectBindingRequirements, type RequirementContext } from "./requirements.ts";
import { readTemporalApplicabilityFinding } from "./temporalApplicability.ts";
import { evaluateVerificationEvent } from "./verificationEvent.ts";

const METHOD = "retained-context-continuity/0.1";
const DIMENSIONS = ["subject", "scope", "environment", "policy", "dependency", "authority", "revalidation", "review_reuse"];
const CONTEXT = ["subject", "scope", "environment", "policy", "dependency"];
const findings = new WeakMap<object, { context: string; evidence: JsonRecord }>();
const texts = (x: unknown) => Array.isArray(x) && x.every(nonempty);
const retained = (x: unknown): x is JsonRecord => !!record(x) && nonempty((x as JsonRecord).source_ref) && nonempty((x as JsonRecord).issuer) && texts((x as JsonRecord).limitations) && (x as JsonRecord).limitations.length > 0;
const eq = (a: unknown, b: unknown) => canonicalJson(a ?? null) === canonicalJson(b ?? null);
const stamp = (x: unknown): number | null => {
  if (typeof x !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(x) || x.endsWith("-00:00")) return null;
  const v = Date.parse(x);
  if (!Number.isFinite(v)) return null;
  const [y, m, d] = x.slice(0, 10).split("-").map(Number), leap = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
  if (m < 1 || m > 12 || d < 1 || d > [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1] || +x.slice(11, 13) > 23 || +x.slice(14, 16) > 59 || +x.slice(17, 19) > 59) return null;
  return v;
};
const within = (r: JsonRecord, at: unknown) => {
  const a = stamp(r.effective_from), b = stamp(r.effective_until), t = stamp(at);
  return a !== null && b !== null && t !== null && a < b && r.convention === "[from,until)" && a <= t && t < b;
};
function freeze<T>(x: T): T { if (x && typeof x === "object") { Object.values(x).forEach(freeze); Object.freeze(x); } return x; }
function context(input: unknown, core: unknown, trust: AdmissionTrust, contexts: readonly RequirementContext[], collection: unknown) {
  return canonicalJson({ input, core, trust, contexts, collection });
}
const blank = (): JsonRecord => ({ satisfied: false, missing: [], negative: [], losses: [], conflicts: [], undecidable: [], positive: [], historical_support: false });
const sorted = (a: any[]) => a.sort((x, y) => canonicalJson(x) < canonicalJson(y) ? -1 : canonicalJson(x) > canonicalJson(y) ? 1 : 0);

/** Bounded retained assertions, not independent world authentication. Each supplied
 * temporal handle is authenticated through its unchanged original-context reader.
 * No primary state, permission, acceptance, or execution decision is made here. */
export function evaluateContinuity(input: unknown, core: unknown, trust: AdmissionTrust, contexts: readonly RequirementContext[] = [],
  temporalFindings: { historical?: unknown; current?: unknown; revalidation?: unknown } = {}) {
  canonicalJson({ input, core, trust, contexts });
  const source = structuredClone(input) as JsonRecord;
  const collection = collectBindingRequirements(source, core, trust, contexts);
  if (collection.status !== "COLLECTED") return freeze({ finding: null, evidence: null });
  const d = source.evidence_ledger?.["t2-05:dossier"];
  if (!record(d)) return freeze({ finding: null, evidence: null });
  const requests = source.requests.filter((r: JsonRecord) => ["standing.current", "authority.current"].includes(r.claim) && r.semantic_version === "0.1.0" && r.semantic_ids.includes("mesr.core.temporal.basis"));
  if (!requests.length) return freeze({ finding: null, evidence: null });
  const evidence: JsonRecord = { method: METHOD, dossier: d, dimensions: Object.fromEntries(DIMENSIONS.map(k => [k, blank()])), paths: {}, temporal: {}, missing: [],
    times: { evaluation_time: d.evaluation_time ?? null, reliance_time: d.reliance_time ?? null },
    nonclaims: ["real_world_truth", "authority_creation", "delegation", "execution_permission", "institutional_acceptance", "profile_sufficiency"] };
  const need = (out: JsonRecord, ok: unknown, name: string) => { if (!ok) out.missing.push(name); return !!ok; };
  need(evidence, Array.isArray(d.comparisons) && d.comparisons.every((r: unknown) => record(r) && [...CONTEXT, "authority"].includes((r as JsonRecord).dimension)), "continuity.comparison_inventory");
  const old = record(d.historical_context) ? d.historical_context : {}, now = record(d.current_context) ? d.current_context : {};
  const identity = (x: JsonRecord) => ["subject", "revision", "scope"].every(k => nonempty(x[k]));
  const same = (a: JsonRecord, b: JsonRecord) => ["subject", "revision", "scope"].every(k => a[k] === b[k] && nonempty(a[k]));
  const baseOK = need(evidence, retained(d) && d.contract_version === "t2-05-retained-witnesses/0.1" && identity(source) && same(d, source)
    && retained(old) && retained(now) && identity(old) && same(now, source)
    && ["continuity", "revalidation", "review_reuse"].includes(d.usage) && Array.isArray(d.omissions) && !d.omissions.length, "continuity.context");
  const timeOK = need(evidence, stamp(d.evaluation_time) !== null && d.evaluation_time === source.bindings.evaluation_time, "continuity.evaluation_time")
    && need(evidence, stamp(d.reliance_time) !== null, "continuity.reliance_time");
  if (stamp(d.reliance_time) === null) need(evidence, false, "continuity.reliance_time");
  // No retargeting: the input embedded in each envelope is the original input.
  for (const name of ["historical", "current", "revalidation"] as const) {
    const envelope = d.temporal?.[name], required = name !== "revalidation" || d.usage === "revalidation";
    let value: JsonRecord | null = null;
    if (record(envelope) && record(envelope.input) && Array.isArray(envelope.contexts) && nonempty(envelope.path)) {
      const c = collectBindingRequirements(envelope.input, core, trust, envelope.contexts);
      value = readTemporalApplicabilityFinding(temporalFindings[name], envelope.input, core, trust, envelope.contexts, c, envelope.path);
      const target = name === "historical" ? old : now;
      if (!same(envelope.input, target) || value?.times.evaluation_time !== d.evaluation_time || value?.times.reliance_time !== d.reliance_time) value = null;
    }
    evidence.temporal[name] = value;
    if (required) need(evidence, value, "continuity.temporal." + name);
  }
  const historical = evidence.temporal.historical, current = evidence.temporal.current;
  const witness = (ctx: JsonRecord, dim: string) => dim === "subject" ? { subject: ctx.subject ?? null, revision: ctx.revision ?? null, artifact: ctx.artifact ?? null }
    : dim === "scope" ? ctx.bounded_scope ?? null : ctx[dim] ?? null;
  const completeWitness = (ctx: JsonRecord, dim: string) => {
    const w = witness(ctx, dim);
    if (dim === "subject") return identity(ctx) && retained(ctx.artifact) && nonempty(ctx.artifact.id) && nonempty(ctx.artifact.digest);
    if (dim === "scope") return retained(w) && nonempty(w.id) && w.id === ctx.scope && record(w.bounds) && Object.keys(w.bounds).length > 0;
    if (!retained(w)) return false;
    if (dim === "environment") return nonempty(w.id) && record(w.snapshot) && Object.keys(w.snapshot).length > 0 && w.digest === contentDigest(w.snapshot);
    if (dim === "policy") return ["id", "version", "digest"].every(k => nonempty(w[k])) && record(w.content) && w.digest === contentDigest(w.content) && stamp(w.effective_from) !== null && stamp(w.effective_until) !== null && within(w, ctx === old ? historical?.historical_result?.raw_input?.records?.[historical?.historical_result?.raw_input?.occurrence_ref]?.event_time : d.reliance_time);
    if (dim === "dependency") return Array.isArray(w.items) && w.items.length > 0 && record(w.lock) && nonempty(w.lock.id) && record(w.lock.content) && w.lock.digest === contentDigest(w.lock.content)
      && w.items.every((x: JsonRecord) => record(x) && ["id", "version", "artifact", "digest"].every(k => nonempty(x[k])));
    if (dim === "authority") return ["record_id", "principal", "authority_source", "authorized_action", "target", "purpose", "scope"].every(k => nonempty(w[k])) && w.scope === ctx.scope && stamp(w.effective_from) !== null && stamp(w.effective_until) !== null && w.convention === "[from,until)";
    return false;
  };
  const historicalEvent = historical?.historical_result?.raw_input?.records?.[historical?.historical_result?.raw_input?.occurrence_ref];
  for (const dim of [...CONTEXT, "authority"]) {
    const out = blank(); evidence.dimensions[dim] = out;
    const criterion = d.criteria?.[dim], a = witness(old, dim), b = witness(now, dim);
    out.criterion = criterion ?? null; out.historical = a; out.current = b;
    const complete = need(out, completeWitness(old, dim) && completeWitness(now, dim), "continuity." + dim + ".witnesses");
    const criterionOK = need(out, retained(criterion) && criterion.method === METHOD && criterion.version === "0.1" && criterion.dimension === dim
      && nonempty(criterion.id) && criterion.comparability === "exact-basis-context" && texts(criterion.limitations), "continuity." + dim + ".criterion");
    const assessment = d.historical_assessments?.[dim];
    const historyOK = completeWitness(old, dim) && criterionOK && retained(assessment) && assessment.method === METHOD
      && assessment.criterion_digest === contentDigest(criterion) && assessment.witness_digest === contentDigest(a)
      && assessment.event_digest === contentDigest(historical?.historical_result?.raw_input ?? null)
      && assessment.time === historicalEvent?.event_time && ["supported", "never_supported"].includes(assessment.result);
    out.historical_assessment = assessment ?? null;
    need(out, historyOK, "continuity." + dim + ".historical_assessment");
    out.historical_support = !!historical?.historical_support && historyOK && assessment.result === "supported";
    const records = Array.isArray(d.comparisons) ? d.comparisons.filter((r: JsonRecord) => record(r) && r.dimension === dim) : [];
    if (!records.length) need(out, false, "continuity." + dim + ".comparison");
    const admitted: JsonRecord[] = [];
    for (const r of records) {
      const valid = baseOK && timeOK && complete && criterionOK && retained(r) && r.method === METHOD
        && r.criterion_id === criterion.id && r.criterion_version === criterion.version && r.criterion_digest === contentDigest(criterion)
        && r.historical_digest === contentDigest(a) && r.current_digest === contentDigest(b)
        && r.subject === now.subject && r.revision === now.revision && r.scope === now.scope
        && r.evaluation_time === d.evaluation_time && r.reliance_time === d.reliance_time
        && stamp(r.observed_at) !== null && stamp(r.observed_at)! <= stamp(d.evaluation_time)!
        && ["compatible", "material_loss", "non_support", "undecidable"].includes(r.result)
        && historyOK && r.historical_result === assessment.result
        && r.historical_event_digest === contentDigest(historical?.historical_result?.raw_input ?? null)
        && nonempty(r.rationale) && Array.isArray(r.evidence_basis) && eq(r.evidence_basis, [contentDigest(a), contentDigest(b)]);
      if (!need(out, valid, "continuity." + dim + ".bound_comparison")) continue;
      if (r.result === "undecidable" && !need(out, nonempty(r.undecidable_reason), "continuity." + dim + ".undecidable_reason")) continue;
      if (r.result === "compatible" && dim === "subject" && !eq(a, b) && !need(out, r.projection === "bounded-equivalence", "continuity.subject.rebinding_proof")) continue;
      if (r.result === "compatible" && dim === "scope" && !eq(a, b) && !need(out, r.projection === "compatible-projection", "continuity.scope.rebinding_proof")) continue;
      admitted.push(r);
    }
    sorted(admitted); out.records = admitted;
    // Every competing record is retained; an unknown method creates an obligation.
    for (let i = 0; i < admitted.length; i++) for (let j = i + 1; j < admitted.length; j++) {
      const a = admitted[i], b = admitted[j];
      if ((a.result === "compatible" && ["material_loss", "non_support"].includes(b.result)) || (b.result === "compatible" && ["material_loss", "non_support"].includes(a.result)) || a.historical_result !== b.historical_result)
        out.conflicts.push({ criterion: "same-bound-continuity-predicate/0.1", refs: [a.source_ref, b.source_ref].sort(), records: [a, b] });
    }
    const wasSupported = out.historical_support;
    out.historical_support = wasSupported;
    for (const r of admitted) {
      if (r.result === "compatible") out.positive.push(r);
      if (r.result === "non_support" || (r.result === "material_loss" && !wasSupported)) out.negative.push(r);
      if (r.result === "material_loss" && wasSupported) out.losses.push(r);
      if (r.result === "undecidable") out.undecidable.push(r);
    }
    if (dim === "authority") {
      const expected = d.authority_request;
      need(out, record(expected) && ["principal", "authority_source", "authorized_action", "target", "purpose", "scope"].every(k => nonempty(expected[k]) && expected[k] === b?.[k]), "continuity.authority.target");
      need(out, retained(b) && within(b, d.reliance_time) && b.predecessor_ref === a?.source_ref && nonempty(b.relationship), "continuity.authority.current_interval_and_relationship");
      if (!(retained(a) && within(a, historicalEvent?.event_time))) out.historical_support = false;
      // Material loss needs historical authority, not just historical standing.
      if (!out.historical_support) { out.negative.push(...out.losses); out.losses = []; }
    }
    out.missing = [...new Set(out.missing)].sort();
    out.satisfied = admitted.length > 0 && !["missing", "negative", "losses", "conflicts", "undecidable"].some(k => out[k].length);
  }
  const revalidation = blank(); evidence.dimensions.revalidation = revalidation;
  if (d.usage === "revalidation") {
    const r = d.revalidation, t = evidence.temporal.revalidation;
    const valid = need(revalidation, retained(r) && record(r.verification) && r.method === METHOD && r.version === "0.1"
      && nonempty(r.criterion) && nonempty(r.criterion_version) && r.evaluation_time === d.evaluation_time && r.reliance_time === d.reliance_time, "continuity.revalidation.new_event");
    const result = valid ? evaluateVerificationEvent(r.verification) : null;
    revalidation.result = result;
    const ev = result?.raw_input?.records?.[result?.raw_input?.occurrence_ref];
    need(revalidation, result?.occurrence_basis.established && result?.result_basis.established && eq(result.result_basis.values, ["passed"])
      && ev?.event_id !== historicalEvent?.event_id && stamp(ev?.event_time) !== null && stamp(historicalEvent?.event_time) !== null
      && stamp(ev.event_time)! >= stamp(historicalEvent.event_time)! && stamp(ev.event_time)! <= stamp(d.reliance_time)!
      && same(result.raw_input.target, now), "continuity.revalidation.attributable_new_result");
    need(revalidation, t?.applicable && eq(t.historical_result?.raw_input, r?.verification)
      && r?.predecessor_digest === contentDigest(historical?.historical_result?.raw_input ?? null)
      && r?.new_basis_digest === contentDigest(d.temporal?.revalidation?.input ?? null), "continuity.revalidation.separate_basis");
    revalidation.satisfied = !revalidation.missing.length;
    if (revalidation.satisfied) revalidation.positive.push({ event: r, separately_evaluated_basis: t });
  } else { revalidation.not_requested = true; }
  const reuse = blank(); evidence.dimensions.review_reuse = reuse;
  if (d.usage === "review_reuse") {
    const r = d.review_reuse, a = now.authority;
    need(reuse, retained(r) && retained(r.original) && ["event_id", "reviewer", "result", "method", "method_version", "criterion", "criterion_version"].every(k => nonempty(r.original[k]))
      && same(r.original, old) && stamp(r.original.review_time) !== null && stamp(r.original.review_time)! <= stamp(d.reliance_time)! && stamp(r.original.review_time)! <= stamp(d.evaluation_time)!
      && r.original.reviewer === a?.principal && r.authority_ref === a?.source_ref
      && r.method === METHOD && r.version === "0.1" && r.evaluation_time === d.evaluation_time && r.reliance_time === d.reliance_time
      && nonempty(r.criterion) && nonempty(r.criterion_version) && ["reusable", "non_support", "undecidable"].includes(r.result), "continuity.review_reuse.bound_review");
    need(reuse, evidence.dimensions.authority.satisfied && CONTEXT.every(k => evidence.dimensions[k].satisfied), "continuity.review_reuse.current_context_and_authority");
    if (!reuse.missing.length) {
      if (r.result === "reusable") reuse.positive.push(r);
      if (r.result === "non_support") reuse.negative.push(r);
      if (r.result === "undecidable") { if (nonempty(r.undecidable_reason)) reuse.undecidable.push(r); else need(reuse, false, "continuity.review_reuse.undecidable_reason"); }
    }
    reuse.satisfied = !["missing", "negative", "undecidable"].some(k => reuse[k].length);
  } else { reuse.not_requested = true; }
  for (const request of requests) {
    const out = blank(), names = [...CONTEXT, ...(request.claim === "authority.current" || d.usage === "review_reuse" ? ["authority"] : []),
      ...(d.usage === "revalidation" ? ["revalidation"] : []), ...(d.usage === "review_reuse" ? ["review_reuse"] : [])];
    out.missing.push(...evidence.missing, ...(historical?.missing ?? []).map((m: string) => "continuity.historical." + m)); out.required_dimensions = names;
    for (const name of names) for (const key of ["missing", "negative", "losses", "conflicts", "undecidable"]) out[key].push(...evidence.dimensions[name][key]);
    out.historical_support = !!historical?.historical_support && names.filter(n => !["revalidation", "review_reuse"].includes(n)).every(n => evidence.dimensions[n].historical_support);
    // A loss of this facet requires its own complete historical support.
    if (!out.historical_support) { out.negative.push(...out.losses); out.losses = []; }
    if (current) {
      out.missing.push(...current.missing); out.negative.push(...current.exclusions); out.undecidable.push(...current.undecidable); out.conflicts.push(...current.contradictions);
      if (out.historical_support) out.losses.push(...current.losses); else out.negative.push(...current.losses);
    }
    out.satisfied = !!current?.applicable && names.every(n => evidence.dimensions[n].satisfied) && !["missing", "negative", "losses", "conflicts", "undecidable"].some(k => out[k].length);
    out.missing = [...new Set(out.missing)].sort();
    for (const k of ["negative", "losses", "conflicts", "undecidable"]) sorted(out[k]);
    if (out.satisfied) out.positive.push({ criterion: METHOD, claim: request.claim, dimensions: names, temporal_basis: contentDigest(current) });
    evidence.paths[request.path] = out;
  }
  evidence.missing = [...new Set(evidence.missing)].sort();
  freeze(evidence);
  const finding = Object.freeze({ evidence });
  findings.set(finding, { context: context(source, core, trust, contexts, collection), evidence });
  return Object.freeze({ finding, evidence });
}

export function readContinuityFinding(finding: unknown, input: unknown, core: unknown, trust: AdmissionTrust, contexts: readonly RequirementContext[], collection: unknown, path: string, directTemporalFinding?: unknown) {
  if (!finding || typeof finding !== "object") return null;
  const saved = findings.get(finding);
  if (!saved || !Object.hasOwn(saved.evidence.paths, path)) return null;
  try {
    if (saved.context !== context(input, core, trust, contexts, collection)) return null;
    // If supplied, the other private channel must agree with the original join.
    if (directTemporalFinding !== undefined) {
      const envelope = saved.evidence.dossier.temporal.current;
      const c = collectBindingRequirements(envelope.input, core, trust, envelope.contexts);
      const direct = readTemporalApplicabilityFinding(directTemporalFinding, envelope.input, core, trust, envelope.contexts, c, envelope.path);
      if (!direct || !eq(direct, saved.evidence.temporal.current)) return null;
    }
  } catch { return null; }
  return saved.evidence;
}
