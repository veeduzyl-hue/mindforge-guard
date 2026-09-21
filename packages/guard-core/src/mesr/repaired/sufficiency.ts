import { canonicalJson, contentDigest, parseExactJson, CanonicalInputError, compareCodePoints, sha256Bytes } from "./canonicalBytes.ts";
import { record, nonempty, type JsonRecord, type AdmissionTrust } from "./contracts.ts";
import { collectBindingRequirements, type RequirementContext } from "./requirements.ts";
import { composePinnedModules, type CompositionTrust } from "./composition.ts";
import { MESR_CORE_REGISTRY } from "../coreRegistry.ts";
import { evaluateVerificationEvent } from "./verificationEvent.ts";
import { compareExactBytes, readIntegrityReceipt } from "./integrity.ts";
import { evaluateIndependence, readIndependenceFinding } from "./independence.ts";
import { evaluateTemporalApplicability, readTemporalApplicabilityFinding } from "./temporalApplicability.ts";
import { evaluateContinuity, readContinuityFinding } from "./continuity.ts";
import { evaluateClaims } from "./evaluateClaim.ts";

// One private frozen profile. These are admission receipts, never caller authority.
const PROFILE = "ef051daa4b12093d195429746ac96ebadb5f85fa9497a3905ac77ba63f5390a0";
const CLAIM_SET = "6c374f3517c77c340a7807dc2c3e07df209a69dca75cff01157f305be89c4e68";
const METHOD = "b46e86d207e9edb048992915f362be1cd8a7890a67fa224a0e301951a9223643";
const ANCHOR = "mesr.core.claim.claim";
const INVENTORY = ["R00", "R01", "R02", "R03"];
const NONCLAIMS = ["universal_sufficiency", "institutional_acceptance", "audit_opinion", "certification", "compliance", "authority", "execution_permission", "authenticity", "custody", "real_world_truth", "untested_properties", "transformation_fidelity", "report_association"];
const findings = new WeakMap<object, { context: string; evidence: JsonRecord; predecessors: unknown[] }>();
const eq = (a: unknown, b: unknown) => canonicalJson(a ?? null) === canonicalJson(b ?? null);
const obj = (x: unknown): JsonRecord => record(x) ? x as JsonRecord : {};
const array = (x: unknown): any[] => Array.isArray(x) ? x : [];
const texts = (x: unknown) => Array.isArray(x) && x.every(nonempty);
const sorted = (x: string[]) => [...new Set(x)].sort(compareCodePoints);
function freeze<T>(x: T): T { if (x && typeof x === "object") { Object.values(x).forEach(freeze); Object.freeze(x); } return x; }
function instant(x: unknown): number | null {
  if (typeof x !== "string") return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|[+-]\d{2}:\d{2})$/.exec(x);
  if (!m || m[8] === "-00:00") return null;
  const [y, mo, d, h, mi, s] = m.slice(1, 7).map(Number), leap = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
  if (mo < 1 || mo > 12 || d < 1 || d > [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][mo - 1] || h > 23 || mi > 59 || s > 59) return null;
  if (m[8] !== "Z" && (+m[8].slice(1, 3) > 23 || +m[8].slice(4) > 59)) return null;
  return Number.isFinite(Date.parse(x)) ? Date.parse(x) : null;
}
const same = (a: JsonRecord, b: JsonRecord) => ["subject", "revision", "scope"].every(k => nonempty(a[k]) && a[k] === b[k]);
const context = (input: unknown, core: unknown, trust: unknown, contexts: unknown, collection: unknown, envelope: unknown) => canonicalJson({ input, core, trust, contexts, collection, envelope });
function closed(x: unknown, keys: string[], path: string, issues: JsonRecord[]) {
  if (!record(x)) { issues.push({ code: "INVALID_PRIVATE_ENVELOPE", field: path }); return false; }
  for (const key of Object.keys(x as object)) if (!keys.includes(key)) issues.push({ code: "UNKNOWN_PRIVATE_KEY", field: path + "." + key });
  return true;
}
function types(x: unknown, rules: Record<string, (v: any) => boolean>, path: string, issues: JsonRecord[]) {
  if (!record(x)) return;
  for (const [key, predicate] of Object.entries(rules)) if (Object.hasOwn(x, key) && !predicate((x as JsonRecord)[key])) issues.push({ code: "INVALID_PRIVATE_TYPE", field: path + "." + key });
}
const string = (v: unknown) => typeof v === "string";
const strings = (v: unknown) => Array.isArray(v) && v.every(string);
const tupleTypes = { subject: string, revision: string, artifacts: strings, scope: record, environment_ref: string, evaluation_time: string, reliance_time: string };
function authenticate(d: JsonRecord) {
  const p = obj(d.profile), c = obj(d.claim_set), m = obj(d.method);
  return p.digest === PROFILE && contentDigest(p.content ?? null) === PROFILE && Buffer.byteLength(canonicalJson(p.content)) === 26112
    && c.digest === CLAIM_SET && contentDigest(c.content ?? null) === CLAIM_SET && Buffer.byteLength(canonicalJson(c.content)) === 381
    && m.id === "private.t2-06.strict-requirement-materiality" && m.version === "0.1.0" && m.domain === "private.t2-06.method-rules/0.1"
    && m.digest === METHOD && contentDigest(m.rules ?? null) === METHOD && Buffer.byteLength(canonicalJson(m.rules)) === 25866
    && p.content.rules_text === m.rules && p.content.claim_set_digest.value === CLAIM_SET;
}
const owned = (r: JsonRecord) => r.path === "sufficiency" && r.claim === "evidence.sufficient" && r.semantic_version === "0.1.0" && eq(r.semantic_ids, [ANCHOR]);
const dimension = (): JsonRecord => ({ missing: [], negative: [], undecidable: [], positive: [], conflicts: [], stale: [], prohibitions: [] });

/** Explicit, process-local computation over supplied offline evidence. No primary
 * state, acceptance, permission, report association, or external action is selected.
 */
export function evaluateSufficiency(input: unknown, core: unknown, trust: AdmissionTrust, contexts: readonly RequirementContext[] = [], envelope?: unknown) {
  const validation: JsonRecord[] = [];
  try { canonicalJson({ input, core, trust, contexts, envelope: envelope ?? null }); }
  catch (error) { if (!(error instanceof CanonicalInputError)) throw error; return freeze({ finding: null, evidence: null, validation: [{ code: "INVALID_JSON_INPUT", field: "private" }] }); }
  const collection = collectBindingRequirements(input, core, trust, contexts), source = obj(input), d = structuredClone(obj(envelope));
  if (collection.status !== "COLLECTED" || !array(source.requests).some(owned) || !record(envelope)) return freeze({ finding: null, evidence: null, validation });
  closed(d, ["contract_version", "profile", "claim_set", "method", "tuple", "source", "manifest", "claims", "composition", "materiality", "exclusion", "inherited", "provenance", "limitations"], "private", validation);
  for (const [key, fields] of [
    ["profile", ["content", "digest"]], ["claim_set", ["content", "digest"]],
    ["method", ["id", "version", "domain", "rules", "digest"]],
    ["tuple", ["subject", "revision", "artifacts", "scope", "environment_ref", "evaluation_time", "reliance_time"]],
    ["source", ["schema", "bytes_base64", "sha256", "byte_length", "source_ref"]],
    ["manifest", ["source_digest", "record_refs", "member_refs", "edge_refs"]],
    ["composition", ["input", "trust"]],
    ["materiality", ["criterion", "version", "requirement_ids", "assertions"]],
    ["exclusion", ["requirement_id", "criterion", "version", "justification"]],
  ] as [string, string[]][]) if (d[key] !== undefined) closed(d[key], fields, key, validation);
  for (const key of ["claims", "inherited", "provenance", "limitations"]) if (d[key] !== undefined && !Array.isArray(d[key])) validation.push({ code: "INVALID_PRIVATE_TYPE", field: key });
  for (const c of array(d.claims)) closed(c, ["member_id", "canonical_id", "canonical_version", "requested_facet", "test_path", "original", "visible"], "claims", validation);
  for (const c of array(d.claims).map(obj)) if (c.original !== undefined) closed(c.original, ["input", "core", "trust", "contexts", "result_set_ref"], "claims.original", validation);
  for (const r of array(d.inherited)) closed(r, ["obligation", "route", "original"], "inherited", validation);
  for (const r of array(d.inherited).map(obj)) if (r.original !== undefined) closed(r.original, ["input", "core", "trust", "contexts", "path"], "inherited.original", validation);
  types(d, { contract_version: string, claims: Array.isArray, inherited: Array.isArray, provenance: strings, limitations: strings }, "private", validation);
  types(d.tuple, tupleTypes, "tuple", validation);
  types(obj(d.tuple).scope, { included: strings, excluded: strings }, "tuple.scope", validation);
  types(d.source, { schema: string, bytes_base64: string, sha256: string, byte_length: v => Number.isSafeInteger(v) && v >= 0, source_ref: string }, "source", validation);
  types(d.manifest, { source_digest: string, record_refs: strings, member_refs: strings, edge_refs: strings }, "manifest", validation);
  types(d.composition, { input: record, trust: record }, "composition", validation);
  types(d.materiality, { criterion: string, version: string, requirement_ids: strings, assertions: Array.isArray }, "materiality", validation);
  types(d.exclusion, { requirement_id: string, criterion: string, version: string, justification: string }, "exclusion", validation);
  for (const c of array(d.claims)) {
    types(c, { member_id: string, canonical_id: string, canonical_version: string, requested_facet: string, test_path: string, original: record, visible: v => typeof v === "boolean" }, "claims", validation);
    types(obj(c).original, { input: record, core: record, trust: record, contexts: Array.isArray, result_set_ref: string }, "claims.original", validation);
  }
  for (const r of array(d.inherited)) {
    types(r, { obligation: record, route: string, original: record }, "inherited", validation);
    types(obj(r).original, { input: record, core: record, trust: record, contexts: Array.isArray, path: string }, "inherited.original", validation);
    if (obj(r).obligation !== undefined) closed(r.obligation, ["target", "binding", "predicate", "predicate_version", "source_ref"], "inherited.obligation", validation);
  }
  const claimKeys = array(d.claims).map(obj).map(c => canonicalJson([c.canonical_id ?? null, c.canonical_version ?? null, c.requested_facet ?? null, c.test_path ?? null, d.tuple ?? null]));
  if (new Set(claimKeys).size !== claimKeys.length) validation.push({ code: "DUPLICATE_CLAIM_PATH", field: "claims" });
  if (d.contract_version !== "private.t2-06.retained-envelope/0.1") validation.push({ code: "INVALID_PRIVATE_VERSION", field: "contract_version" });
  if (!authenticate(d)) validation.push({ code: "PROFILE_CRITERIA_INTEGRITY", field: "profile/claim_set/method" });
  if (validation.length) return freeze({ finding: null, evidence: null, validation });

  const evidence: JsonRecord = { method: "private.t2-06.strict-requirement-materiality@0.1.0", envelope: structuredClone(d),
    profile_digest: PROFILE, claim_set_digest: CLAIM_SET, method_digest: METHOD, collection: structuredClone(collection),
    requirements: [], obligations: [], predecessors: [], A0: {}, A1: {}, X0: {}, M1: "0.1.0", NM0: { version: "0.1.0", permitted_requirements: [], assertions: structuredClone(d.materiality?.assertions ?? []) },
    no_material_gap: false, nonclaims: NONCLAIMS, ...dimension() };
  const rows = Object.fromEntries(INVENTORY.map(id => [id, { requirement_id: id, criterion_id: "M1", criterion_version: "0.1.0", tuple: structuredClone(d.tuple ?? null), applicability: "A0@0.1.0", ...dimension(), members: [], limitations: NONCLAIMS }])) as Record<string, JsonRecord>;
  const need = (r: JsonRecord, ok: unknown, name: string) => { if (!ok) r.missing.push(name); return !!ok; };
  const held: unknown[] = [];
  const retainBasis = (row: JsonRecord, claim: JsonRecord | undefined, prefix: string) => {
    if (!claim) { row.missing.push(prefix + ".owner_result"); return; }
    const b = claim.evaluation_basis;
    for (const key of ["prohibitions", "conflicts", "stale", "negative", "undecidable", "positive"]) row[key].push(...array(b?.[key]).map(fact => ["conflicts", "prohibitions"].includes(key) ? { ...fact, predecessor: prefix } : { predecessor: prefix, evidence: fact }));
    row.missing.push(...array(b?.missing).map(m => prefix + "." + m));
  };
  // Authenticate exact original envelopes; no supplied state or handle is consumed.
  const originalOK = (e: JsonRecord) => record(e.input) && record(e.core) && record(e.trust) && Array.isArray(e.contexts)
    && eq(e.core, core) && eq(e.trust, trust);
  const integrity = (e: JsonRecord) => {
    if (!record(e.input) || !nonempty(e.path) || !Array.isArray(e.contexts)) return null;
    const result = compareExactBytes(e.input, e.path, e.contexts);
    held.push(result.receipt);
    const facts = readIntegrityReceipt(result.receipt, e.input, e.path, e.contexts);
    return { envelope: e, evidence: result.evidence, facts, receipt: result.receipt };
  };
  const independence = (e: JsonRecord) => {
    if (!originalOK(e)) return null;
    const members = array(e.input.evidence_ledger?.["t2-03:dossier"]?.members);
    const comparisons = members.map(m => integrity(obj(m.comparison)));
    const receipts = comparisons.map(c => c?.receipt ?? null);
    const out = evaluateIndependence(e.input, e.core, e.trust, e.contexts, receipts), collected = collectBindingRequirements(e.input, e.core, e.trust, e.contexts);
    held.push(out.finding);
    const facts = readIndependenceFinding(out.finding, e.input, e.core, e.trust, e.contexts, collected, e.path);
    return { finding: out.finding, facts, comparisons, original: e };
  };
  const temporal = (e: JsonRecord) => {
    if (!originalOK(e)) return null;
    const history = obj(e.input.evidence_ledger?.["t2-04:dossier"]?.historical);
    const old = { input: history.input, core: e.core, trust: e.trust, contexts: history.contexts, path: history.path };
    const prior = independence(old), receipts = prior?.comparisons.map(c => c?.receipt ?? null) ?? [];
    const out = evaluateTemporalApplicability(e.input, e.core, e.trust, e.contexts, receipts, prior?.finding), collected = collectBindingRequirements(e.input, e.core, e.trust, e.contexts);
    held.push(out.finding);
    const facts = readTemporalApplicabilityFinding(out.finding, e.input, e.core, e.trust, e.contexts, collected, e.path);
    return { finding: out.finding, facts, original: e, prior };
  };
  const inherited = (route: JsonRecord) => {
    const e = obj(route.original);
    if (!originalOK(e) || !same(e.input, source) || e.input.bindings?.evaluation_time !== source.bindings?.evaluation_time) return null;
    const request = array(e.input.requests).find(r => r.path === e.path);
    const admittedRoutes: JsonRecord = { independence: ["independence", "verification.independent"], custody: ["independence", "custody.independent"], currentness: ["temporal", "standing.current"], continuity: ["continuity", "standing.current"], rebinding: ["continuity", "standing.current"], authority: ["continuity", "authority.current"] };
    if (!request || !Array.isArray(admittedRoutes[route.obligation?.binding]) || !eq(admittedRoutes[route.obligation.binding], [route.route, request.claim])) return null;
    if (["temporal", "continuity"].includes(route.route)) {
      const dossier = obj(e.input.evidence_ledger?.[route.route === "temporal" ? "t2-04:dossier" : "t2-05:dossier"]);
      if (instant(dossier.reliance_time) === null || instant(dossier.reliance_time) !== instant(obj(d.tuple).reliance_time)) return null;
    }
    let handle: unknown, facts: JsonRecord | null = null, result: JsonRecord | null = null;
    if (route.route === "independence" && ["verification.independent", "custody.independent"].includes(request?.claim)) {
      const f = independence(e); handle = f?.finding; facts = f?.facts ?? null;
      if (facts) result = evaluateClaims(e.input, e.core, e.trust, e.contexts, undefined, handle);
    } else if (route.route === "temporal" && request?.claim === "standing.current") {
      const f = temporal(e); handle = f?.finding; facts = f?.facts ?? null;
      if (facts) result = evaluateClaims(e.input, e.core, e.trust, e.contexts, undefined, undefined, handle);
    } else if (route.route === "continuity" && ["standing.current", "authority.current"].includes(request?.claim)) {
      const td = obj(e.input.evidence_ledger?.["t2-05:dossier"]?.temporal);
      const joins = Object.fromEntries(["historical", "current", "revalidation"].map(k => {
        const original = obj(td[k]); return [k, temporal({ ...original, core: e.core, trust: e.trust, path: original.input?.evidence_ledger?.["t2-04:dossier"]?.path })];
      }));
      const handles = Object.fromEntries(Object.entries(joins).map(([k, v]) => [k, v?.finding]));
      const f = evaluateContinuity(e.input, e.core, e.trust, e.contexts, handles);
      handle = f.finding; held.push(handle);
      const collected = collectBindingRequirements(e.input, e.core, e.trust, e.contexts);
      facts = readContinuityFinding(handle, e.input, e.core, e.trust, e.contexts, collected, e.path, joins.current?.finding);
      if (facts) result = evaluateClaims(e.input, e.core, e.trust, e.contexts, undefined, undefined, joins.current?.finding, handle);
    }
    if (!facts || !result) return null;
    const nativeBasis = route.route === "independence" ? facts.attributable_result?.raw_input
      : route.route === "temporal" ? facts.historical_result?.raw_input : facts.temporal?.current?.historical_result?.raw_input;
    if (!eq(nativeBasis, pack.native)) return null;
    if (route.route === "continuity") {
      const current = obj(e.input.evidence_ledger?.["t2-05:dossier"]?.current_context);
      if (!nonempty(current.artifact?.id) || !nonempty(current.environment?.id) || !eq(obj(d.tuple).artifacts, [current.artifact.id]) || obj(d.tuple).environment_ref !== current.environment.id) return null;
    }
    const claim = result.claims.find((c: JsonRecord) => c.path === e.path);
    const retained = { route: route.route, original: e, facts, result, claim };
    evidence.predecessors.push(retained); return retained;
  };

  const r00 = rows.R00;
  need(r00, source.requests.length === 1 && owned(source.requests[0]), "R00.unrequested_outer_claim");
  const anchor = MESR_CORE_REGISTRY.find(e => e.semantic_id === ANCHOR && e.version === "0.1.0");
  need(r00, contentDigest(anchor) === "839d8b89b8eb79abea1001ef523b7c8e614206be47b158f5dc55b65eec13a28b", "R00.anchor_content");
  need(r00, texts(d.provenance) && d.provenance.length > 0 && texts(d.limitations) && d.limitations.length > 0, "R00.provenance_limitations");
  const sufficiency = obj(source.sufficiency);
  need(r00, sufficiency.profile_id === d.profile.content.id && sufficiency.profile_version === d.profile.content.version && sufficiency.profile_digest === PROFILE
    && sufficiency.claim_set_id === d.claim_set.content.id && sufficiency.claim_set_version === d.claim_set.content.version && sufficiency.claim_set_digest === CLAIM_SET
    && sufficiency.scope === source.scope && sufficiency.evaluation_time === source.bindings.evaluation_time, "R00.outer_profile_binding");
  need(r00, source.module_lock_digest === contentDigest(obj(core).lock ?? null), "R00.module_lock");
  const composition = d.composition && record(d.composition.input) && record(d.composition.trust)
    ? composePinnedModules(d.composition.input, d.composition.trust as CompositionTrust) : null;
  evidence.composition = composition;
  need(r00, composition?.status === "VALID_COMPOSITION" && composition.resolved_modules.length === 1 && eq(composition.core_basis_input, core)
    && eq(d.composition.trust.proof, trust.proof) && d.composition.trust.proof_digest === trust.proof_digest
    && eq(d.composition.trust.registry, trust.registry) && eq(d.composition.trust.modules, trust.modules), "R00.composition");

  let pack: JsonRecord = {};
  const supplied = obj(d.source), transport = supplied.bytes_base64;
  if (typeof transport === "string" && /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(transport)) {
    const bytes = Buffer.from(transport, "base64");
    if (need(r00, bytes.toString("base64") === transport && bytes.length === supplied.byte_length && sha256Bytes(bytes) === supplied.sha256
      && supplied.schema === "private.t2-06.source-pack/0.1" && nonempty(supplied.source_ref), "R00.source_bytes")) {
      try { pack = obj(parseExactJson(bytes.toString("utf8"))); }
      catch (error) { if (!(error instanceof CanonicalInputError)) throw error; validation.push({ code: "INVALID_SOURCE_JSON", field: "source" }); }
      need(r00, Buffer.from(canonicalJson(pack), "utf8").equals(bytes), "R00.source_representation");
    }
  } else need(r00, false, "R00.source_bytes");
  closed(pack, ["schema", "tuple", "native", "members", "edges", "provenance"], "source.pack", validation);
  if (pack.tuple !== undefined) {
    closed(pack.tuple, ["subject", "revision", "artifacts", "scope", "environment_ref", "evaluation_time", "reliance_time"], "source.tuple", validation);
    if (obj(pack.tuple).scope !== undefined) closed(pack.tuple.scope, ["included", "excluded"], "source.tuple.scope", validation);
  }
  if (obj(d.tuple).scope !== undefined) closed(d.tuple.scope, ["included", "excluded"], "tuple.scope", validation);
  for (const m of array(pack.members)) {
    closed(m, ["member_ref", "member_namespace", "record_ref", "kind", "representation", "byte_domain", "content", "check_event_id", "check_event_namespace", "comparison"], "source.member", validation);
    if (obj(m).comparison !== undefined) closed(m.comparison, ["input", "path", "contexts"], "source.member.comparison", validation);
  }
  for (const e of array(pack.edges)) closed(e, ["source_ref", "source_namespace", "from", "to", "method", "version", "time", "provenance_refs", "limitations"], "source.edge", validation);
  if (pack.provenance !== undefined) closed(pack.provenance, ["transformation_refs", "source_namespace", "source_ref"], "source.provenance", validation);
  types(pack, { schema: string, tuple: record, native: record, members: Array.isArray, edges: Array.isArray, provenance: record }, "source.pack", validation);
  types(pack.tuple, tupleTypes, "source.tuple", validation);
  types(obj(pack.tuple).scope, { included: strings, excluded: strings }, "source.tuple.scope", validation);
  types(pack.provenance, { transformation_refs: strings, source_namespace: string, source_ref: string }, "source.provenance", validation);
  for (const m of array(pack.members)) {
    types(m, { member_ref: string, member_namespace: string, record_ref: string, kind: string, representation: string, byte_domain: string, check_event_id: string, check_event_namespace: string, comparison: record }, "source.member", validation);
    types(obj(m).comparison, { input: record, path: string, contexts: Array.isArray }, "source.member.comparison", validation);
  }
  for (const e of array(pack.edges)) types(e, { source_ref: string, source_namespace: string, from: string, to: string, method: string, version: string, time: string, provenance_refs: strings, limitations: strings }, "source.edge", validation);
  need(r00, pack.schema === supplied.schema && record(pack.native) && record(pack.native.records) && Array.isArray(pack.members) && Array.isArray(pack.edges), "R00.source_pack");
  if (validation.length) return freeze({ finding: null, evidence: null, validation });
  need(r00, nonempty(pack.provenance?.source_namespace) && pack.provenance?.source_ref === supplied.source_ref, "R00.source_provenance");
  evidence.source_pack = pack;
  const t = obj(d.tuple), actual = obj(pack.tuple), native = obj(pack.native), event = obj(native.records?.[native.occurrence_ref]);
  const tupleComplete = (v: JsonRecord) => ["subject", "revision", "environment_ref"].every(k => nonempty(v[k])) && texts(v.artifacts) && v.artifacts.length > 0
    && record(v.scope) && texts(v.scope.included) && texts(v.scope.excluded) && instant(v.evaluation_time) !== null && instant(v.reliance_time) !== null;
  const a0Complete = tupleComplete(t) && tupleComplete(actual) && ["subject", "revision", "scope", "checked_property"].every(k => nonempty(event[k])) && instant(event.event_time) !== null;
  const comparisons = a0Complete ? [
    ["exact_tuple", eq(t, actual)], ["outer_subject", source.subject === t.subject], ["outer_revision", source.revision === t.revision],
    ["scope", t.scope.included.length === 1 && t.scope.included[0] === source.scope && t.scope.excluded.length === 0],
    ["native_subject", event.subject === t.subject], ["native_revision", event.revision === t.revision], ["native_scope", event.scope === source.scope],
    ["property", event.checked_property === "unit-tests"], ["evaluation_time", instant(source.bindings?.evaluation_time) === instant(t.evaluation_time)],
    ["reliance_target", instant(t.reliance_time) === instant(t.evaluation_time)], ["event_time", instant(event.event_time)! <= instant(t.evaluation_time)!],
  ] : [];
  evidence.A0 = { criterion: "A0", version: "0.1.0", result: !a0Complete ? "unresolved" : comparisons.every(([, yes]) => yes) ? "positive" : "negative", comparisons, tuple: t, retained: actual, event };
  need(r00, a0Complete, "A0.missing_basis");
  if (evidence.A0.result === "negative") r00.negative.push({ criterion: "A0@0.1.0", comparisons });
  const claimed = array(d.claims), member = claimed.find(c => c.member_id === "check-pass" && c.canonical_id === "mesr.core.evidence.verification" && c.canonical_version === "0.1.0" && c.requested_facet === "verification.passed" && c.test_path === "pass");
  need(r00, claimed.length === 1 && !!member, "R00.required_claim_set");
  const original = obj(member?.original);
  const originalValid = originalOK(original) && same(original.input, source) && original.input.bindings?.evaluation_time === t.evaluation_time
    && array(original.input.requests).length === 1 && original.input.requests[0].path === "pass" && original.input.requests[0].claim === "verification.passed"
    && original.input.requests[0].semantic_version === "0.1.0" && eq(original.input.requests[0].semantic_ids, ["mesr.core.evidence.verification"]);
  const check = originalValid && record(pack.native) ? evaluateVerificationEvent(native, {
    input: original.input, coreInput: original.core, trust: original.trust, contexts: original.contexts, ...(original.result_set_ref ? { result_set_ref: original.result_set_ref } : {}),
  }) : null;
  const atomic = check?.claim_evaluation?.claims?.find((c: JsonRecord) => c.path === "pass");
  evidence.verification = check; held.push(check);
  need(rows.R01, originalValid, "R01.original_context");
  retainBasis(rows.R01, atomic, "R01");
  if (check) rows.R01.missing.push(...array(check.missing_facts).map(f => "R01." + f.path + ":" + f.obligation));
  need(rows.R01, check?.result_basis?.established, "R01.native_result_basis");
  const expand = (claims: JsonRecord[], owner: string) => {
    for (const c of claims) {
      for (const binding of c.bindings) for (const p of binding.predicates) {
        const target = { canonical_ids: c.semantic_ids, canonical_version: c.semantic_version, facet: c.claim, path: c.path };
        const key = { target, binding: binding.binding, predicate: p.predicate, predicate_version: "mesr-binding-requirements/0.1", source_ref: p.source_ref };
        const candidates = array(d.inherited).filter(r => eq(r.obligation, key));
        const semantic = ["currentness", "continuity", "rebinding", "authority", "independence", "custody", "transformed_members"].includes(binding.binding);
        const row: JsonRecord = { ...key, owner, result: binding.satisfied && p.satisfied ? "satisfied" : "unresolved", evidence: { binding, predicate: p }, limitations: NONCLAIMS };
        if (candidates.length || semantic) {
          if (candidates.length !== 1) row.result = "unresolved";
          else {
            const route = inherited(candidates[0]);
            row.predecessor = route;
            if (!route) row.result = "unresolved";
            else {
              retainBasis(r00, route.claim, "R00." + binding.binding);
              row.result = route.claim?.state === "SUPPORTED" && binding.satisfied && p.satisfied ? "satisfied" : "unresolved";
              // Completed predecessor negatives/undecidability are accounted by M1,
              // not relabeled as missing because their canonical state is not positive.
              if (binding.satisfied && p.satisfied && route.claim && !route.claim.evaluation_basis.missing.length) row.result = "accounted";
            }
          }
        }
        if (row.result === "unresolved") r00.missing.push("R00.binding:" + owner + ":" + binding.binding + ":" + p.source_ref);
        evidence.obligations.push(row);
      }
      r00.missing.push(...c.missing_bindings.map((m: string) => "R00." + owner + "." + m));
    }
  };
  expand(collection.claims, "outer");
  if (atomic?.collection) expand([atomic.collection], "check-pass"); else need(r00, false, "R00.atomic_collection");
  evidence.obligations.sort((a: JsonRecord, b: JsonRecord) => compareCodePoints(canonicalJson([a.target, a.binding, a.predicate, a.source_ref]), canonicalJson([b.target, b.binding, b.predicate, b.source_ref])));
  for (const r of array(d.inherited)) need(r00, evidence.obligations.some((o: JsonRecord) => eq(r.obligation, { target: o.target, binding: o.binding, predicate: o.predicate, predicate_version: o.predicate_version, source_ref: o.source_ref })), "R00.unrequested_inherited_route");

  const members = array(pack.members), edges = array(pack.edges), manifest = obj(d.manifest), provenance = obj(pack.provenance);
  const results = array(native.result_refs).map(ref => obj(native.records?.[ref]));
  const relied = sorted([...results.flatMap(r => [r.input_ref, r.output_ref]), ...array(event.output_refs)].filter(nonempty));
  const a1missing: string[] = [];
  const a1need = (ok: unknown, name: string) => { if (!ok) a1missing.push(name); };
  a1need(!r00.missing.includes("R00.source_bytes") && record(pack.native) && record(pack.native.records), "source");
  a1need(manifest.source_digest === supplied.sha256 && texts(manifest.record_refs) && eq(sorted(manifest.record_refs), Object.keys(obj(native.records)).sort(compareCodePoints)) && new Set(manifest.record_refs).size === manifest.record_refs.length, "record_manifest");
  a1need(members.every(m => nonempty(m.member_ref)) && texts(manifest.member_refs) && eq(sorted(manifest.member_refs), members.map(m => m.member_ref).sort(compareCodePoints)) && new Set(manifest.member_refs).size === manifest.member_refs.length, "member_manifest");
  a1need(edges.every(e => nonempty(e.source_ref)) && texts(manifest.edge_refs) && eq(sorted(manifest.edge_refs), edges.map(e => e.source_ref).sort(compareCodePoints)) && new Set(manifest.edge_refs).size === manifest.edge_refs.length, "edge_manifest");
  a1need(Array.isArray(pack.members) && members.length > 0 && new Set(members.map(m => m.member_ref)).size === members.length, "members");
  a1need(Array.isArray(pack.edges) && new Set(edges.map(e => e.source_ref)).size === edges.length, "edges");
  a1need(edges.every(e => nonempty(e.source_ref)) && texts(provenance.transformation_refs) && eq(sorted(provenance.transformation_refs), edges.map(e => e.source_ref).sort(compareCodePoints)), "transformation_provenance");
  const byId = new Map(members.map(m => [m.member_ref, m])), visited = new Set<string>(), usedEdges = new Set<string>();
  const visit = (id: string, stack: string[]) => {
    if (!nonempty(id)) { a1missing.push("missing_lineage_identity"); return; }
    const m = byId.get(id);
    if (!m || stack.includes(id)) { a1missing.push("unresolved_or_cyclic_lineage:" + id); return; }
    if (visited.has(id)) return;
    const incoming = edges.filter(e => e.to === id);
    if (m.kind === "original") a1need(incoming.length === 0, "original_has_edge:" + id);
    else if (m.kind === "transformed") {
      a1need(incoming.length === 1, "ambiguous_transformation:" + id);
      for (const edge of incoming) {
        if (nonempty(edge.source_ref)) usedEdges.add(edge.source_ref);
        a1need(nonempty(edge.source_ref) && nonempty(edge.source_namespace) && nonempty(edge.method) && nonempty(edge.version) && instant(edge.time) !== null && texts(edge.provenance_refs) && edge.provenance_refs.length > 0 && texts(edge.limitations) && edge.limitations.length > 0, "edge_basis:" + id);
        visit(edge.from, [...stack, id]);
      }
    } else a1missing.push("member_kind:" + id);
    visited.add(id);
  };
  for (const ref of relied) {
    const found = members.filter(m => m.record_ref === ref);
    a1need(found.length === 1 && record(native.records?.[ref]) && eq(found[0]?.content, native.records?.[ref]?.content), "relied_member:" + ref);
    if (found.length === 1 && nonempty(found[0].member_ref)) visit(found[0].member_ref, []);
  }
  a1need(relied.length > 0, "relied_members");
  a1need(visited.size === members.length && usedEdges.size === edges.length, "unaccounted_member_or_edge");
  const allCandidates = Object.entries(obj(native.records)).filter(([, r]) => obj(r).kind === "verification_result").map(([k]) => k);
  a1need(eq(sorted(allCandidates), sorted(array(native.result_refs))), "candidate_enumeration");
  evidence.A1 = { criterion: "A1", version: "0.1.0", result: a1missing.length ? "unresolved" : edges.length > 0 ? "positive" : members.every(m => m.kind === "original") ? "negative" : "unresolved", missing: sorted(a1missing), manifest, relied_on_refs: relied, member_refs: [...visited].sort(compareCodePoints), edge_refs: [...usedEdges].sort(compareCodePoints), provenance };
  // Every retained relied-on input/output and every ancestor is checked; no sampling.
  for (const m of members) {
    const row = m.kind === "transformed" ? rows.R03 : rows.R02, mMissing: string[] = [];
    const comparison = integrity(obj(m.comparison));
    const facts = comparison?.facts, e = obj(facts?.comparison_context?.event), nativeRecord = obj(native.records?.[m.record_ref]);
    if (!comparison || !facts) mMissing.push("comparison_basis");
    if (!nonempty(m.member_ref) || !nonempty(m.member_namespace) || !nonempty(m.byte_domain) || m.representation !== "canonical-json-utf8" || !Object.hasOwn(m, "content")) mMissing.push("member_basis");
    if (facts) {
      if (!same(comparison!.envelope.input, source) || comparison!.envelope.input.bindings?.evaluation_time !== t.evaluation_time
        || !["member_ref", "member_namespace", "representation", "byte_domain"].every(k => e[k] === m[k])) mMissing.push("original_member_context");
      if (!Object.hasOwn(m, "content") || comparison!.envelope.input.integrity.bytes_base64 !== Buffer.from(canonicalJson(m.content)).toString("base64")) mMissing.push("retained_actual_bytes");
      if (instant(e.time) === null || instant(e.time)! > instant(t.evaluation_time)! || m.check_event_id !== event.event_id || m.check_event_namespace !== event.source_namespace) mMissing.push("check_event_join");
      if (m.record_ref && (!record(native.records?.[m.record_ref]) || !eq(nativeRecord.content, m.content))) mMissing.push("native_content_join");
    }
    const observation = { member: m, original_envelope: m.comparison ?? null, comparison: comparison?.evidence ?? null, missing: mMissing, match: facts?.match ?? null };
    row.members.push(observation);
    row.missing.push(...mMissing.map(k => row.requirement_id + "." + m.member_ref + "." + k));
    if (facts?.match === false) row.negative.push(observation);
    if (facts?.match === true && !mMissing.length) row.positive.push(observation);
    // R02 also accounts for any direct transformed R01 input/output member.
    if (m.kind === "transformed" && relied.includes(m.record_ref)) {
      rows.R02.members.push(observation);
      rows.R02.missing.push(...mMissing.map(k => "R02." + m.member_ref + "." + k));
      if (facts?.match === false) rows.R02.negative.push(observation);
      if (facts?.match === true && !mMissing.length) rows.R02.positive.push(observation);
    }
  }
  rows.R02.missing.push(...a1missing.map(m => "R02.inventory." + m));
  need(rows.R02, rows.R02.members.length > 0, "R02.required_members");
  const inheritedTransform = evidence.obligations.some((o: JsonRecord) => o.binding === "transformed_members" || o.binding === "transformations");
  const x = obj(d.exclusion);
  const excluded = evidence.A0.result === "positive" && evidence.A1.result === "negative" && !inheritedTransform
    && x.requirement_id === "R03" && x.criterion === "X0" && x.version === "0.1.0" && x.justification === "no-transformed-member-in-bound-input";
  evidence.X0 = { criterion: "X0", version: "0.1.0", established: excluded, requirement_id: "R03", justification: x.justification ?? null,
    scope: t.scope ?? null, manifest, originals: members.filter(m => m.kind === "original").map(m => m.member_ref ?? null), applicability: evidence.A1, inherited_obligations: evidence.obligations, limitations: ["only-the-enumerated-input; no-custody-or-world-completeness-claim"] };
  if (!excluded) {
    if (evidence.A0.result === "negative" && evidence.A1.result !== "unresolved") rows.R03.negative.push({ criterion: "A0@0.1.0", comparisons });
    else {
      need(rows.R03, evidence.A0.result === "positive" && evidence.A1.result === "positive", "R03.applicability_or_X0");
      need(rows.R03, rows.R03.members.length > 0, "R03.required_members");
    }
  }
  const mat = obj(d.materiality);
  need(r00, mat.criterion === "M1" && mat.version === "0.1.0" && eq(mat.requirement_ids, INVENTORY) && Array.isArray(mat.assertions), "M1.complete_inventory");
  for (const assertion of array(mat.assertions)) {
    if (assertion?.determination === "non_material_gap") r00.missing.push("NM0.non_material_gap_prohibited");
    else r00.missing.push("M1.caller_determination_inert");
  }
  for (const id of INVENTORY) {
    const row = rows[id];
    if (evidence.A0.result === "unresolved") row.missing.push("A0.missing_basis");
    row.missing = sorted(row.missing);
    row.decision = row.missing.length ? "unresolved" : id === "R03" && excluded ? "permitted_exclusion" : row.negative.length ? "material_gap"
      : row.undecidable.length ? "inconclusive" : id === "R00" || row.positive.length ? "satisfied" : "unresolved";
    row.rationale = row.decision === "unresolved" ? (row.missing.length ? "missing-basis" : "no-admitted-determination") : ({ unresolved: "no-admitted-determination", permitted_exclusion: "no-transformed-member", material_gap: "completed-non-support", inconclusive: "complete-method-undecidable", satisfied: "all-required-predicates-established" } as JsonRecord)[row.decision];
    evidence.requirements.push(row);
    for (const k of ["missing", "negative", "undecidable", "conflicts", "stale", "prohibitions"]) evidence[k].push(...row[k]);
  }
  evidence.no_material_gap = evidence.A0.result === "positive" && evidence.A1.result !== "unresolved"
    && evidence.requirements.every((r: JsonRecord) => r.decision === "satisfied" || r.requirement_id === "R03" && r.decision === "permitted_exclusion")
    && atomic?.state === "SUPPORTED" && !["missing", "negative", "undecidable", "conflicts", "stale", "prohibitions"].some(k => evidence[k].length);
  evidence.missing = sorted(evidence.missing);
  if (evidence.no_material_gap) evidence.positive.push({ criterion: "complete-private-profile/0.1", profile: PROFILE, claim_set: CLAIM_SET, method: METHOD, requirements: INVENTORY });
  if (!evidence.no_material_gap && !["missing", "negative", "undecidable", "conflicts", "stale", "prohibitions"].some(k => evidence[k].length)) evidence.missing.push("no_material_gap.not_established");
  freeze(evidence);
  const finding = freeze({ evidence });
  findings.set(finding, { context: context(input, core, trust, contexts, collection, envelope), evidence, predecessors: held });
  return freeze({ finding, evidence, validation });
}

/** Identity + exact fresh owner context only. Serialized findings are inert. */
export function readSufficiencyFinding(channel: unknown, input: unknown, core: unknown, trust: AdmissionTrust, contexts: readonly RequirementContext[], collection: unknown, path: string, otherChannels: readonly unknown[] = []) {
  if (!channel || typeof channel !== "object" || path !== "sufficiency" || otherChannels.some(x => x !== undefined)) return null;
  const supplied = channel as { finding?: object; envelope?: unknown };
  if (!supplied.finding || typeof supplied.finding !== "object") return null;
  const saved = findings.get(supplied.finding);
  if (!saved) return null;
  try {
    if (saved.context !== context(input, core, trust, contexts, collection, supplied.envelope)) return null;
    if (!array(obj(input).requests).some(owned)) return null;
  } catch (error) { if (error instanceof CanonicalInputError) return null; throw error; }
  return saved.evidence;
}
