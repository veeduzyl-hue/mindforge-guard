import { canonicalJson, contentDigest } from "./canonicalBytes.ts";
import { record, nonempty, type JsonRecord, type AdmissionTrust } from "./contracts.ts";
import { collectBindingRequirements, type RequirementContext } from "./requirements.ts";
import { evaluateVerificationEvent } from "./verificationEvent.ts";
import { readIntegrityReceipt } from "./integrity.ts";
import { readIndependenceFinding } from "./independence.ts";

// Private supplied-fact evaluation. No clock, lookup, state selector or authority.
const findings = new WeakMap<object, { context: string; path: string; evidence: JsonRecord }>();
const METHOD = "retained-temporal-applicability/0.1";
const ANCHOR = "mesr.core.temporal.basis";
const texts = (x: unknown): x is string[] => Array.isArray(x) && x.every(nonempty);
const retained = (x: unknown): x is JsonRecord => !!record(x) && nonempty((x as JsonRecord).source_ref) && nonempty((x as JsonRecord).issuer) && texts((x as JsonRecord).limitations) && (x as JsonRecord).limitations.length > 0;
function freeze<T>(x: T): T { if (x && typeof x === "object") { Object.values(x).forEach(freeze); Object.freeze(x); } return x; }
function context(input: unknown, core: unknown, trust: AdmissionTrust, contexts: readonly RequirementContext[], collection: unknown) {
  return canonicalJson({ input, core, trust, contexts, collection });
}
// Explicit millisecond-or-coarser offset instants only. Reject rather than round
// finer precision, invalid calendar dates, leap seconds or an unknown -00:00 zone.
function instant(value: unknown): number | null {
  if (typeof value !== "string") return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|[+-]\d{2}:\d{2})$/.exec(value);
  if (!m || m[8] === "-00:00") return null;
  const [year, month, day, hour, minute, second] = m.slice(1, 7).map(Number);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month < 1 || month > 12 || day < 1 || day > days[month - 1] || hour > 23 || minute > 59 || second > 59) return null;
  if (m[8] !== "Z" && (Number(m[8].slice(1, 3)) > 23 || Number(m[8].slice(4)) > 59)) return null;
  const parsed = Date.parse(value); return Number.isFinite(parsed) ? parsed : null;
}
const same = (a: JsonRecord, b: JsonRecord) => ["subject", "revision", "scope"].every(k => nonempty(a[k]) && a[k] === b[k]);
function interval(r: JsonRecord, at: number): boolean | null {
  const from = instant(r.effective_from), until = instant(r.effective_until);
  if (from === null || until === null || from >= until || !["[from,until)", "[from,until]", "(from,until)", "(from,until]"].includes(r.convention)) return null;
  return (r.convention[0] === "[" ? at >= from : at > from) && (r.convention.endsWith("]") ? at <= until : at < until);
}

/** The ledger is retained JSON; private historical receipts arrive separately.
 * This authenticates product computation, never the truth of supplied records.
 */
export function evaluateTemporalApplicability(input: unknown, core: unknown, trust: AdmissionTrust, contexts: readonly RequirementContext[] = [],
  integrityReceipts: readonly unknown[] = [], independenceFinding?: unknown) {
  canonicalJson({ input, core, trust, contexts });
  const source = structuredClone(input) as JsonRecord;
  const collection = collectBindingRequirements(source, core, trust, contexts);
  if (collection.status !== "COLLECTED") return freeze({ finding: null, evidence: null });
  const d = source.evidence_ledger?.["t2-04:dossier"];
  if (!record(d)) return freeze({ finding: null, evidence: null });
  const request = source.requests.filter((r: JsonRecord) => r.path === d.path && r.claim === "standing.current" && r.semantic_version === "0.1.0" && r.semantic_ids.includes(ANCHOR));
  if (request.length !== 1) return freeze({ finding: null, evidence: null });
  const evidence: JsonRecord = { method: METHOD, path: d.path, dossier: d, missing: [], losses: [], exclusions: [], contradictions: [], undecidable: [], applicable: false,
    historical_support: false, historical_result: null, historical_comparisons: [], historical_independence: null,
    times: { evaluation_time: d.evaluation_time ?? null, reliance_time: d.reliance_time ?? null, evaluation_instant: instant(d.evaluation_time), reliance_instant: instant(d.reliance_time) },
    nonclaims: ["real_world_temporal_truth", "context_continuity", "current_authority", "institutional_acceptance", "execution_permission"] };
  const need = (ok: unknown, name: string) => { if (!ok) evidence.missing.push(name); return !!ok; };
  const evaluation = instant(d.evaluation_time), reliance = instant(d.reliance_time);
  const baseOK = need(d.contract_version === "t2-04-retained-witnesses/0.1" && same(d, source) && retained(d) && Array.isArray(d.omissions) && !d.omissions.length, "temporal.context");
  const timeOK = need(evaluation !== null && d.evaluation_time === source.bindings.evaluation_time, "temporal.evaluation_time")
    && need(reliance !== null, "temporal.reliance_time");
  // Record both missing instants even when the first one is missing.
  if (reliance === null) need(false, "temporal.reliance_time");
  const rule = record(d.rule) ? d.rule : {};
  const required = ["historical_verification", "historical_independence", "freshness", "validity", "snapshot", "revocation", "supersession"];
  const ruleOK = need(retained(rule) && same(rule, source) && rule.method === METHOD && rule.version === "0.1" && nonempty(rule.policy_id)
    && nonempty(rule.provenance) && rule.claim === "standing.current" && rule.path === d.path
    && Array.isArray(rule.required_inputs) && canonicalJson(rule.required_inputs) === canonicalJson(required)
    && evaluation !== null && reliance !== null && interval(rule, evaluation) === true && interval(rule, reliance) === true, "temporal.applicable_rule");
  const h = record(d.historical) ? d.historical : {};
  const original = record(h.input) ? h.input : {};
  const verification = record(h.verification) ? h.verification : {};
  let result: JsonRecord | null = null;
  try { result = evaluateVerificationEvent(verification); } catch { /* missing retained JSON basis */ }
  evidence.historical_result = result;
  const event = verification.records?.[verification.occurrence_ref];
  const historicalTime = instant(event?.event_time);
  const canonicalEntry = collection.checked_basis.modules.flatMap((m: JsonRecord) => m.entries).find((e: JsonRecord) => e.semantic_id === ANCHOR && e.version === "0.1.0");
  const identityOK = need(nonempty(h.id) && nonempty(h.version) && h.digest === contentDigest(verification)
    && canonicalJson(h.canonical ?? null) === canonicalJson(canonicalEntry ?? null) && !!canonicalEntry
    && same(original, source) && same(verification.target ?? {}, source)
    && event?.event_id === original.event_id && event?.event_time === original.event_time
    && historicalTime !== null && evaluation !== null && historicalTime <= evaluation
    && result?.occurrence_basis.established && result?.result_basis.established
    && canonicalJson(result.result_basis.values) === canonicalJson(["passed"]), "temporal.historical_verification");
  let historicalOK = false;
  if (identityOK && Array.isArray(h.contexts) && nonempty(h.path)) {
    const hc = collectBindingRequirements(original, core, trust, h.contexts);
    const independence = readIndependenceFinding(independenceFinding, original, core, trust, h.contexts, hc, h.path);
    evidence.historical_independence = independence;
    const hd = original.evidence_ledger?.["t2-03:dossier"];
    const members = Array.isArray(hd?.members) ? hd.members : [];
    const receipts = members.map((m: JsonRecord, i: number) => m.comparison ? readIntegrityReceipt(integrityReceipts[i], m.comparison.input, m.comparison.path, m.comparison.contexts) : null);
    evidence.historical_comparisons = receipts;
    historicalOK = need(hc.status === "COLLECTED" && hc.claims.some((c: JsonRecord) => c.path === h.path && !c.missing_bindings.length && !c.excluded_inferences.length)
      && independence && ["identity", "principal_separation", "custody", "successful_check"].every(k => independence[k].satisfied)
      && canonicalJson(hd?.verification ?? null) === canonicalJson(verification)
      && members.length > 0 && receipts.length === integrityReceipts.length && receipts.every((r: JsonRecord | null) => r?.match), "temporal.historical_private_basis");
  } else need(false, "temporal.historical_private_basis");
  const v = record(d.validity) ? d.validity : {}, f = record(d.freshness) ? d.freshness : {}, snapshot = record(d.snapshot) ? d.snapshot : {};
  const associated = (r: JsonRecord) => retained(r) && same(r, source) && r.basis_id === h.id && r.basis_version === h.version && r.basis_digest === h.digest && r.rule_id === rule.policy_id && r.rule_version === rule.version;
  const validityOK = need(associated(v) && reliance !== null && interval(v, reliance) !== null && v.convention === rule.validity_convention, "temporal.validity_interval");
  const observed = instant(f.observed_at);
  const freshnessOK = need(associated(f) && f.observed_at === event?.event_time && observed !== null && evaluation !== null && observed <= evaluation
    && Number.isSafeInteger(rule.max_age_ms) && rule.max_age_ms >= 0 && ["<", "<="].includes(rule.max_age_comparison), "temporal.freshness_rule");
  const freshAt = (at: number) => observed !== null && at >= observed && (rule.max_age_comparison === "<=" ? at - observed <= rule.max_age_ms : at - observed < rule.max_age_ms);
  const asOf = instant(snapshot.as_of), horizon = instant(snapshot.horizon);
  const snapshotOK = need(associated(snapshot) && nonempty(snapshot.publisher) && nonempty(snapshot.completeness_basis)
    && Array.isArray(snapshot.covered_subjects) && snapshot.covered_subjects.some((x: JsonRecord) => record(x) && same(x, source))
    && texts(snapshot.categories) && ["revocation", "supersession", "status"].every(k => snapshot.categories.includes(k))
    && snapshot.complete === true && Array.isArray(snapshot.contents) && snapshot.contents.every(record)
    && Array.isArray(snapshot.omissions) && !snapshot.omissions.length
    && asOf !== null && horizon !== null && evaluation !== null && asOf <= evaluation && horizon <= asOf
    && instant(snapshot.effective_from) !== null && instant(snapshot.effective_until) !== null
    && interval(snapshot, asOf) === true && historicalTime !== null && interval(snapshot, historicalTime) === true, "temporal.snapshot_coverage");
  let horizonOK = reliance !== null && horizon !== null && reliance <= horizon && interval(snapshot, reliance) === true;
  if (!horizonOK && reliance !== null && horizon !== null && reliance > horizon) {
    const p = record(d.prospective) ? d.prospective : {};
    horizonOK = !!(associated(p) && p.method === "bounded-prospective-status/0.1" && p.snapshot_ref === snapshot.source_ref
      && p.snapshot_digest === contentDigest(snapshot) && p.horizon === snapshot.horizon && interval(p, reliance) === true
      && nonempty(p.rationale) && p.no_future_revocation_guarantee === true);
  }
  need(horizonOK, "temporal.snapshot_horizon");
  // Loss facts need their own complete rule/witness; collateral missing facts are
  // retained and cannot erase an independently demonstrated historical loss.
  const evaluable = baseOK && timeOK && ruleOK;
  const lossCandidates: JsonRecord[] = [];
  if (evaluable && validityOK && reliance !== null) {
    if (interval(v, reliance) === false) {
      if (reliance < (instant(v.effective_from) as number) || (reliance === instant(v.effective_from) && v.convention[0] === "(")) evidence.exclusions.push({ reason: "NOT_YET_EFFECTIVE", witness: v });
      else lossCandidates.push({ reason: "EXPIRED", witness: v });
    }
  }
  if (evaluable && freshnessOK && reliance !== null && observed !== null) {
    if (reliance < observed) evidence.exclusions.push({ reason: "BEFORE_OBSERVATION", witness: f });
    else if (!freshAt(reliance)) lossCandidates.push({ reason: "FRESHNESS_EXCEEDED", witness: f, rule });
  }
  const statuses: JsonRecord[] = [], effectiveLosses: JsonRecord[] = [];
  const contents = Array.isArray(snapshot.contents) ? snapshot.contents : [];
  for (const r of contents) {
    if (!record(r)) { need(false, "temporal.status_record"); continue; }
    // A retained record explicitly outside this exact context has no force here.
    if (["subject", "revision", "scope"].every(k => nonempty(r[k])) && !same(r, source)) continue;
    const effective = instant(r.effective_at);
    const competent = retained(r.competence) && same(r.competence, source) && r.competence.principal === r.issuer
      && texts(r.competence.categories) && r.competence.categories.includes(r.kind)
      && effective !== null && interval(r.competence, effective) === true;
    if (!need(associated(r) && r.snapshot_ref === snapshot.source_ref && effective !== null && competent
      && nonempty(r.provenance) && instant(r.recorded_at) !== null && asOf !== null && (instant(r.recorded_at) as number) <= asOf, "temporal.status_witness")) continue;
    if (r.kind === "revocation") {
      if (!need(r.method === "effective-scoped-revocation/0.1" && r.value === "revoked", "temporal.revocation_method")) continue;
      effectiveLosses.push({ reason: "REVOKED", effective, witness: r });
    } else if (r.kind === "supersession") {
      const successor = r.successor, displacement = r.displacement;
      let sr: JsonRecord | null = null;
      try { if (record(successor?.verification)) sr = evaluateVerificationEvent(successor.verification); } catch { /* unresolved */ }
      const admitted = record(successor) && record(successor.verification) && nonempty(successor.id) && nonempty(successor.version) && successor.id !== h.id
        && successor.digest === contentDigest(successor.verification) && same(successor.verification.target ?? {}, source)
        && canonicalJson(successor.canonical ?? null) === canonicalJson(canonicalEntry)
        && sr?.occurrence_basis.established && sr?.result_basis.established && canonicalJson(sr.result_basis.values) === canonicalJson(["passed"])
        && instant(successor.verification.records?.[successor.verification.occurrence_ref]?.event_time) !== null
        && (instant(successor.verification.records[successor.verification.occurrence_ref].event_time) as number) <= effective;
      if (!need(admitted && associated(displacement ?? {}) && displacement.method === "replace-exact-basis/0.1"
        && displacement.predecessor_digest === h.digest && displacement.successor_digest === successor.digest
        && displacement.effective_at === r.effective_at && nonempty(displacement.rationale) && nonempty(displacement.compatibility_limits), "temporal.successor_displacement")) continue;
      effectiveLosses.push({ reason: "DISPLACED", effective, witness: r, admitted_successor_result: sr });
    } else if (r.kind === "status") {
      if (!need(r.method === "same-context-recorded-status/0.1" && ["current", "non_support", "undecidable"].includes(r.value)
        && r.reliance_time === d.reliance_time && r.evaluation_time === d.evaluation_time && interval(r, reliance as number) === true, "temporal.current_status")) continue;
      statuses.push(r);
    } else need(false, "temporal.status_category");
  }
  const formerlyApplicable = evaluable && historicalOK && validityOK && freshnessOK && snapshotOK
    && !evidence.missing.some((name: string) => ["temporal.status_record", "temporal.status_witness", "temporal.revocation_method", "temporal.successor_displacement", "temporal.status_category"].includes(name))
    && historicalTime !== null && interval(rule, historicalTime) === true && interval(v, historicalTime) === true && freshAt(historicalTime)
    && horizon !== null && historicalTime <= horizon && !effectiveLosses.some(r => r.effective <= historicalTime);
  evidence.historical_support = !!formerlyApplicable;
  if (evaluable && snapshotOK && reliance !== null) {
    for (const r of effectiveLosses) if (r.effective <= reliance) lossCandidates.push(r);
    for (const a of statuses) for (const b of statuses) if (a.source_ref < b.source_ref && [a.value, b.value].includes("current") && [a.value, b.value].includes("non_support"))
      evidence.contradictions.push({ criterion: "same-bound-current-context/0.1", refs: [a.source_ref, b.source_ref], records: [a, b] });
    for (const r of statuses) {
      if (r.value === "non_support") evidence.exclusions.push({ reason: "COMPLETED_TEMPORAL_NON_SUPPORT", witness: r });
      if (r.value === "undecidable" && nonempty(r.undecidable_reason)) evidence.undecidable.push({ reason: "COMPLETE_TEMPORAL_UNDECIDABLE", witness: r });
      else if (r.value === "undecidable") need(false, "temporal.undecidable_reason");
    }
  }
  if (formerlyApplicable && horizonOK && reliance !== null && historicalTime !== null && reliance >= historicalTime) evidence.losses.push(...lossCandidates);
  else if (lossCandidates.length) need(false, "temporal.preserved_historical_support");
  evidence.missing = [...new Set(evidence.missing)].sort();
  evidence.applicable = evaluable && !evidence.missing.length && !evidence.losses.length && !evidence.exclusions.length && !evidence.contradictions.length && !evidence.undecidable.length;
  freeze(evidence);
  const finding = Object.freeze({ evidence });
  findings.set(finding, { context: context(source, core, trust, contexts, collection), path: d.path, evidence });
  return Object.freeze({ finding, evidence });
}

export function readTemporalApplicabilityFinding(finding: unknown, input: unknown, core: unknown, trust: AdmissionTrust, contexts: readonly RequirementContext[], collection: unknown, path: string) {
  if (!finding || typeof finding !== "object") return null;
  const saved = findings.get(finding); if (!saved || saved.path !== path) return null;
  try {
    if (saved.context !== context(input, core, trust, contexts, collection)) return null;
    const requests = (input as JsonRecord).requests.filter((r: JsonRecord) => r.path === path);
    if (requests.length !== 1 || requests[0].claim !== "standing.current" || requests[0].semantic_version !== "0.1.0" || !requests[0].semantic_ids.includes(ANCHOR)) return null;
  } catch { return null; }
  return saved.evidence;
}
