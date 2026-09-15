// VALIDATION_ONLY_REFERENCE_EVALUATOR
// NOT_PRODUCT_RUNTIME
// NOT_CANONICAL_MESR_IMPLEMENTATION
// Closed B09 fixture language; no exports from product packages, no canonical ID admission.
import { createHash } from "node:crypto";
export const VERSION = "0.2.0";
export const cmp = (a,b) => a < b ? -1 : a > b ? 1 : 0;
export const sorted = a => [...new Set(a)].sort(cmp);
export function canonical(v) {
  if (v === null || typeof v === "string" || typeof v === "boolean") return JSON.stringify(v);
  if (typeof v === "number" && Number.isFinite(v)) return JSON.stringify(v);
  if (Array.isArray(v)) return "["+v.map(canonical).join(",")+"]";
  if (v && Object.getPrototypeOf(v) === Object.prototype) return "{"+Object.keys(v).sort(cmp).map(k=>JSON.stringify(k)+":"+canonical(v[k])).join(",")+"}";
  throw Error("Non-JSON value");
}
export const hash = v => createHash("sha256").update(typeof v === "string" || Buffer.isBuffer(v) ? v : canonical(v)).digest("hex");
const present = v => typeof v === "string" ? v.trim().length > 0 : Array.isArray(v) ? v.length > 0 : v !== null && v !== undefined;
const instant = v => typeof v === "string" && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?(?:Z|[+-]\d\d:\d\d)$/.test(v) && Number.isFinite(Date.parse(v));
const types = ["core","domain_pack","crosswalk","institutional_profile"];
const exact = v => typeof v === "string" && /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(v);
export function cycles(edges) {
  const graph = new Map();
  for (const [a,b] of edges) graph.set(a,sorted([...(graph.get(a)??[]),b]));
  const found = [];
  for (const start of sorted(edges.flat())) {
    function walk(at, path) {
      for (const next of graph.get(at)??[]) {
        if (next===start) found.push([...path,start].join("->"));
        else if (!path.includes(next) && cmp(next,start)>=0) walk(next,[...path,next]);
      }
    }
    walk(start,[start]);
  }
  return sorted(found);
}
export function compose(input,basis) {
  const errors = [];
  const add = (code,subject="",field="",related_id="") => errors.push({rule_id:code,subject,field,related_id,detail:code});
  const modules = input.modules;
  const shape = m => m && types.includes(m.module_type) && ["module_id","version","semantic_namespace","core_compatibility"].every(k=>typeof m[k]==="string") &&
    ["dependencies","added_semantics","mappings","conformance_requirements","external_references","prohibited_overrides"].every(k=>Array.isArray(m[k])) &&
    m.dependencies.every(d=>d && typeof d.module_id==="string" && typeof d.version==="string") &&
    m.added_semantics.every(e=>e && typeof e.semantic_id==="string" && ["supports","does_not_support","required_bindings"].every(k=>Array.isArray(e[k]))) &&
    m.mappings.every(e=>e && typeof e.target_semantic_id==="string" && Array.isArray(e.provenance) && Array.isArray(e.limitations));
  if (!Array.isArray(modules) || modules.some(m=>!shape(m))) {
    add("LOCK_BASIS_UNRESOLVED","composition","shape");
    return finish([]);
  }
  const ordered = [...modules].sort((a,b)=>types.indexOf(a.module_type)-types.indexOf(b.module_type)||cmp(a.module_id,b.module_id));
  const seen = new Set(), available = new Set();
  const byId = new Map(ordered.map(m=>[m.module_id,m]));
  if (!input.registry || canonical(input.registry)!==canonical(basis.registry)) add("LOCK_REGISTRY_MISMATCH","registry","registry");
  if (!input.admission_basis || hash(input.admission_basis)!==hash(basis.admission_basis)) add("LOCK_NONINTERFERENCE_UNPROVEN","composition","admission_basis");
  if (!input.lock || input.lock.length!==ordered.length) add("LOCK_BASIS_UNRESOLVED","composition","lock");
  for (const m of ordered) {
    const id = m.module_id;
    if (seen.has(id)) add("LOCK_DUPLICATE_MODULE_ID",id,"module_id");
    seen.add(id);
    if (!/^[a-z0-9_.]+$/.test(id) || !exact(m.version)) add("LOCK_BASIS_UNRESOLVED",id,"version");
    if (m.core_compatibility!==">=0.1.0 <0.2.0") add("INCOMPATIBLE_CORE_VERSION",id,"core_compatibility");
    if (m.module_type==="core" && m.version!=="0.1.0") add("LOCK_REGISTRY_MISMATCH",id,"version");
    if (m.module_type==="core" && hash(m.added_semantics)!==hash(basis.modules.find(b=>b.module_type==="core").added_semantics)) add("LOCK_NONINTERFERENCE_UNPROVEN",id,"core_snapshot");
    const row = input.lock?.find(r=>r.module_id===id);
    if (!row) add("LOCK_BASIS_UNRESOLVED",id,"lock");
    else {
      const raw = input.raw_manifests?.[id];
      if (typeof raw!=="string" || hash(raw)!==row.byte_digest || Buffer.byteLength(raw)!==row.byte_length ||
          hash(m)!==row.content_digest || canonical(JSON.parse(raw))!==canonical(m) || row.version!==m.version)
        add("LOCK_CONTENT_MISMATCH",id,"lock");
    }
    if (row) for (const dep of row.dependencies??[]) {
      const target=byId.get(dep.module_id);
      if (target && dep.content_digest!==hash(target)) add("LOCK_CONTENT_MISMATCH",id,"dependencies.digest",dep.module_id);
    }
    for (const d of m.dependencies) {
      if (!byId.has(d.module_id)) add("MISSING_MODULE_DEPENDENCY",id,"dependencies",d.module_id);
      else if (!exact(d.version)) add("LOCK_BASIS_UNRESOLVED",id,"dependencies.version",d.version);
      else if (byId.get(d.module_id).version!==d.version) add("LOCK_DEPENDENCY_VERSION_MISMATCH",id,"dependencies",d.module_id);
      if (byId.has(d.module_id) && ordered.indexOf(byId.get(d.module_id))>=ordered.indexOf(m)) add("LOCK_BASIS_UNRESOLVED",id,"forward_dependency",d.module_id);
    }
    const own = new Set();
    const prefix = m.module_type==="core" ? "mesr.core" : m.module_type==="domain_pack" ? "mesr.domain." : m.module_type==="crosswalk" ? "mesr.xw." : "mesr.profile.";
    if (!m.semantic_namespace.startsWith(prefix)) add("INVALID_NAMESPACE_OWNERSHIP",id,"semantic_namespace");
    for (const e of m.added_semantics) {
      if (own.has(e.semantic_id)) add("DUPLICATE_MODULE_SEMANTIC_ID",id,"added_semantics",e.semantic_id);
      if (available.has(e.semantic_id)) add("SEMANTIC_COLLISION",id,"added_semantics",e.semantic_id);
      own.add(e.semantic_id);
      if (!e.semantic_id.startsWith(m.semantic_namespace+".")) add("SEMANTIC_OUTSIDE_OWNED_NAMESPACE",id,"added_semantics",e.semantic_id);
      const original = basis.modules.flatMap(x=>x.added_semantics).find(x=>x.semantic_id===e.semantic_id);
      if (!original) add("LOCK_NONINTERFERENCE_UNPROVEN",id,"added_semantics",e.semantic_id);
      else {
        if (e.supports.some(s=>!original.supports.includes(s))) add("LOCK_SUPPORT_WIDENING",id,"supports",e.semantic_id);
        if (original.does_not_support.some(s=>!e.does_not_support.includes(s))) add("LOCK_NONCLAIM_REMOVAL",id,"does_not_support",e.semantic_id);
        if (original.required_bindings.some(s=>!e.required_bindings.includes(s))) add("LOCK_BINDING_WEAKENING",id,"required_bindings",e.semantic_id);
        if (e.definition!==original.definition) add("LOCK_NONINTERFERENCE_UNPROVEN",id,"definition",e.semantic_id);
      }
      if (e.supports.some(s=>["execution_authorized","action_approved","certified","legally_compliant"].includes(s))) add("AUTHORITY_EXPANSION_FORBIDDEN",id,"supports",e.semantic_id);
    }
    if (m.module_type==="crosswalk" && m.added_semantics.length) add("CROSSWALK_SEMANTICS_FORBIDDEN",id,"added_semantics");
    if (m.module_type==="institutional_profile" && (m.added_semantics.length||m.mappings.length)) add("PROFILE_SEMANTIC_PARTICIPATION_FORBIDDEN",id,"added_semantics");
    for (const a of m.semantic_overrides??[]) add("SEMANTIC_OVERRIDE_FORBIDDEN",id,"semantic_overrides",a.left+"="+a.right);
    for (const map of m.mappings) {
      if (!available.has(map.target_semantic_id)) add("UNRESOLVED_MAPPING_TARGET",id,"mappings",map.target_semantic_id);
      if (!map.provenance.length||!map.limitations.length) add("INCOMPLETE_MAPPING_PROVENANCE",id,"mappings",map.external_concept);
      if (map.mapping_relation!=="maps_to") add("LOCK_NONINTERFERENCE_UNPROVEN",id,"mapping_relation",map.mapping_relation);
      const original = basis.modules.find(x=>x.module_id===id)?.mappings.find(x=>x.external_concept===map.external_concept);
      if (original && map.source_version!==original.source_version) add("LOCK_CONTEXT_VERSION_MISMATCH",id,"source_version");
    }
    const context = input.context_versions?.[id];
    if (["crosswalk","institutional_profile"].includes(m.module_type) && canonical(context??null)!==canonical(basis.context_versions[id])) add("LOCK_CONTEXT_VERSION_MISMATCH",id,"context_versions");
    for (const e of m.added_semantics) available.add(e.semantic_id);
  }
  for (const witness of cycles(ordered.flatMap(m=>m.dependencies.map(d=>[m.module_id,d.module_id])))) add("CIRCULAR_MODULE_DEPENDENCY","composition","dependencies",witness);
  for (const kind of ["alias","supersedes"]) for (const witness of cycles((input.relations??[]).filter(r=>r.type===kind).map(r=>[r.from,r.to]))) add(kind==="alias"?"LOCK_ALIAS_CYCLE":"LOCK_SUPERSESSION_CYCLE","composition",kind,witness);
  for (const r of input.relations??[]) if (r.activate===true) add("LOCK_NONINTERFERENCE_UNPROVEN","composition","relation",r.type);
  for (const change of input.effective_changes??[]) add(change.kind==="nonclaim_removal"?"LOCK_NONCLAIM_REMOVAL":change.kind==="binding_weakening"?"LOCK_BINDING_WEAKENING":"LOCK_SUPPORT_WIDENING",change.module_id,"effective_claim",change.claim);
  return finish(ordered);
  function finish(ordered) {
    const diagnostics = [...new Map(errors.map(e=>[canonical(e),e])).values()].sort((a,b)=>cmp([a.rule_id,a.subject,a.field,a.related_id,a.detail].join("\0"),[b.rule_id,b.subject,b.field,b.related_id,b.detail].join("\0")));
    const invalid = diagnostics.length>0;
    return {status:invalid?"INVALID_COMPOSITION":"VALID_COMPOSITION",semantic_entries:invalid?[]:ordered.flatMap(m=>m.added_semantics),mappings:invalid?[]:ordered.flatMap(m=>m.mappings),profiles:invalid?[]:ordered.filter(m=>m.module_type==="institutional_profile"),diagnostics};
  }
}
export function evaluate(input,basis) {
  if (input.kind==="composition") return compose(input,basis);
  input = structuredClone(input);
  if (input.raw_producer) input.events = input.raw_producer.jobs ? input.raw_producer.jobs.flatMap(j => j.check ? [j.check] : []) : input.raw_producer.verification_events ?? [];
  const results = input.requests.map(q=>{
    const missing = [], diagnostic = [], detail = {};
    const gap = field => missing.push(field);
    const entries = q.semantic_ids.map(id=>basis.entries.find(e=>e.semantic_id===id));
    if (entries.some(e=>!e)||q.semantic_version!=="0.1.0") gap("semantic_identity");
    const nonclaims = sorted(entries.filter(Boolean).flatMap(e=>e.does_not_support).concat(q.path==="producer_inference"?["producer_result_does_not_establish_independence"]:q.path==="observation_inference"?["observation_does_not_establish_verification"]:q.path==="old_authority_inference"?["historical_authority_does_not_establish_current_authority"]:q.path==="weakening_inference"?["requirements_cannot_be_subtracted"]:[]));
    const obligations = sorted(entries.filter(Boolean).flatMap(e=>e.required_bindings).concat(q.required_bindings??[],["subject","scope","evaluation_time","evidence_refs"]));
    for (const field of obligations) {
      const value = input.bindings[field];
      const predicate=basis.binding_predicates[field]??"nonempty_reference";
      const satisfied=predicate==="true"?value===true:predicate==="nonempty_array"?Array.isArray(value)&&value.length>0:typeof value==="string"&&value.trim().length>0;
      if (!satisfied) gap(field);
    }
    if (input.bindings.subject !== input.subject) gap("subject");
    if (input.bindings.scope !== input.scope) gap("scope");
    if (!instant(input.bindings.evaluation_time)) gap("evaluation_time");
    if (!input.registry || canonical(input.registry)!==canonical(basis.registry)) gap("registry");
    if (input.module_lock_digest!==basis.module_lock_digest) gap("module_lock");
    if (input.method?.version!==VERSION || input.method?.digest!==basis.method_digest) gap("method");
    const relevant = (input.events??[]).filter(e=>e.subject===input.subject && e.scope===input.scope && e.event_id===input.event_id && e.time===input.event_time);
    const checks = relevant.filter(e=>e.kind==="verification" && ["event_id","producer","verifier","subject","scope","property","method","method_version","time","input_ref","output_ref","criterion","result"].every(k=>present(e[k])) && instant(e.time));
    const completeCheck = checks.length>0;
    for (const e of checks) {
      for (const ref of [e.input_ref,e.output_ref]) if (!input.evidence_ledger?.[ref]) gap("evidence_ref:"+ref);
    }
    let forbidden = ["producer_inference","observation_inference","old_authority_inference","weakening_inference"].includes(q.path) || (q.path==="generic" && entries.filter(Boolean).some(e=>e.does_not_support.includes(q.claim)));
    let conflict = false, stale = false, outcome = null;
    if (["pass","occurred","independence"].includes(q.path)) {
      if (!completeCheck) gap("verification_event");
      else {
        const values = sorted(checks.map(e=>e.result));
        conflict = values.includes("passed") && values.includes("failed");
        outcome = q.path==="occurred"?"positive":values.includes("passed")?"positive":values.includes("failed")?"negative":values.includes("inconclusive")?"undecidable":null;
      }
      if (q.path==="independence") {
        for (const f of ["producer_principal","executor_principal","verifier_principal","separation","custody"]) if (!present(input[f])) gap(f);
        if (input.separation && input.producer_principal && input.verifier_principal) {
          if (input.producer_principal===input.verifier_principal || input.separation.producer_control===input.separation.verifier_control) outcome="negative";
        }
        if (input.custody?.sole_producer_control===true) outcome="negative";
      }
    } else if (q.path==="integrity"||q.path==="custody") {
      const i = input.integrity;
      if (q.path==="custody") {
        if (!input.custody) gap("custody");
        else outcome=input.custody.sole_producer_control?"negative":"positive";
      } else {
        for (const f of ["bytes_base64","expected_digest","expected_source","comparison_event","checker","time","byte_domain"]) if (!present(i?.[f])) gap("integrity."+f);
        if (i?.byte_domain!==i?.expected_domain) gap("integrity.byte_domain");
        if (i && present(i.bytes_base64) && present(i.comparison_event) && present(i.expected_digest)) {
          const bytes = Buffer.from(i.bytes_base64,"base64");
          detail.observed_digest=hash(bytes); detail.expected_digest=i.expected_digest; detail.byte_length=bytes.length;
          outcome=detail.observed_digest===i.expected_digest?"positive":"negative";
        }
      }
    } else if (q.path==="sufficiency") {
      const s=input.sufficiency;
      for (const f of ["profile_id","claim_set_id","scope","evaluation_time","evidence_refs","material_gap_result"]) if (!present(s?.[f])) gap("sufficiency."+f);
      if (s) {
        if (s.profile_version!==basis.sufficiency_profile.version || s.profile_digest!==basis.sufficiency_profile.digest) gap("sufficiency.profile_version_digest");
        if (s.claim_set_version!==basis.claim_set.version || s.claim_set_digest!==basis.claim_set.digest) gap("sufficiency.claim_set_version_digest");
        if (s.scope!==input.scope) gap("sufficiency.scope");
        for (const req of basis.sufficiency_profile.requirements) if (!(s.requirements??[]).includes(req)) gap("sufficiency.requirement."+req);
        // Atomic labels cannot replace the bound verification event and its result.
        if (s.atomic_results?.some(a=>a.claim==="verification.passed" && a.state==="SUPPORTED") && !checks.some(e=>e.result==="passed")) gap("sufficiency.atomic.verification.passed");
        for (const req of s.requirements??[]) if (!s.evaluated_requirements.includes(req)) gap("sufficiency.requirement."+req);
        for (const a of s.atomic_results??[]) if (a.state!=="SUPPORTED") gap("sufficiency.atomic."+a.claim);
        outcome=s.material_gap_result==="no_material_gap"?"positive":s.material_gap_result==="material_gap"?"negative":s.material_gap_result==="inconclusive"?"undecidable":null;
      }
      if (input.report_link && input.report_link.expected_digest!==hash(input.report_link.bytes)) diagnostic.push("REPORT_LINK_MISMATCH");
      detail.report_association=input.report_link?(diagnostic.includes("REPORT_LINK_MISMATCH")?"UNRESOLVED":"BOUND"):"ABSENT";
    } else if (q.path==="current" || q.path==="authority" || q.path==="acceptance") {
      const t=input.temporal;
      if (!t) gap("currentness");
      else {
        if (!instant(t.reliance_time)) gap("reliance_time");
        if (!t.interval_rule) gap("interval_rule");
        for (const f of ["subject","scope","environment","policy","dependency","authority"]) if (!t.continuity?.[f]) gap("continuity."+f);
        if (!t.snapshot?.complete || !instant(t.snapshot?.horizon) || Date.parse(t.reliance_time)>Date.parse(t.snapshot.horizon)) gap("snapshot_coverage");
        if (t.successor && !t.displacement_rule) gap("supersession_rule");
        if (t.age_requested && !t.max_age_ms) gap("freshness_rule");
        if (t.interval_rule && instant(t.reliance_time)) {
          const time=Date.parse(t.reliance_time);
          const expired=time>=Date.parse(t.effective_until);
          const revoked=t.revocation && t.revocation.attributable && time>=Date.parse(t.revocation.effective_at);
          const displaced=t.successor && t.displacement_rule && time>=Date.parse(t.displacement_rule.effective_at);
          const changed=Object.values(t.continuity??{}).some(v=>v==="material_loss");
          const tooOld=t.max_age_ms && time-Date.parse(t.observed_at)>t.max_age_ms;
          stale=Boolean(t.historical_support && (expired||revoked||displaced||changed||tooOld));
          const comparable=(t.status_records??[]).filter(r=>r.subject===input.subject&&r.scope===input.scope&&r.time===t.reliance_time&&r.attributable);
          conflict=sorted(comparable.map(r=>r.value)).length>1;
          outcome=time<Date.parse(t.effective_from)?"negative":t.continuity_result==="inconclusive"?"undecidable":"positive";
        }
      }
      if (q.path==="authority"&&!input.authority_rebinding) gap("authority_rebinding");
      if (q.path==="acceptance"&&!input.acceptance_authority) gap("acceptance_authority");
      if (q.path==="acceptance"&&!input.acceptance_event) gap("acceptance_event");
      detail.historical_basis=input.historical_basis??null;
    } else if (q.path==="action") {
      const event=relevant.find(e=>e.kind==="action"&&e.result==="succeeded"&&e.producer&&e.output_ref);
      if (!event) gap("action_event"); else outcome="positive";
    } else if (q.path==="presence") { if (!input.evidence_present) gap("evidence_record"); else outcome="positive"; }
    else if (q.path==="decision") { if (!input.acceptance_event) gap("acceptance_event"); else outcome="positive"; }
    else if (q.path==="generic") {
      if (input.caller_contradiction) gap("contradictory_evidence");
      else if (!input.positive_evidence) gap("positive_evidence");
      else outcome="positive";
    } else if (q.path==="collision") gap("admitted_mapping_and_evidence");
    if (input.precedence_conflict) conflict=true;
    if (input.precedence_stale) stale=true;
    // These flags are derived only from supplied complete records, never caller support flags.
    if (input.precedence_conflict) conflict=checks.some(a=>checks.some(b=>a.result==="passed"&&b.result==="failed"));
    if (input.precedence_stale) stale=Boolean(input.temporal?.historical_support&&Date.parse(input.temporal.reliance_time)>=Date.parse(input.temporal.effective_until));
    const missing_bindings=sorted(missing);
    const state=forbidden?"UNSUPPORTED":conflict?"CONFLICTED":stale?"STALE":missing_bindings.length?"UNRESOLVED":outcome==="positive"?"SUPPORTED":outcome==="negative"?"UNSUPPORTED":outcome==="undecidable"?"INCONCLUSIVE":"UNRESOLVED";
    if (forbidden) diagnostic.push("INFERENCE_PROHIBITED");
    if (conflict) diagnostic.push("COMPARABLE_CONFLICT");
    if (stale) diagnostic.push("APPLICABILITY_LOST");
    if (!outcome&&!missing_bindings.length&&!forbidden&&!conflict&&!stale) { missing_bindings.push("admitted_determination"); }
    diagnostic.push(...missing_bindings.map(f=>"MISSING:"+f));
    if (q.path==="pass" && state==="SUPPORTED") detail.result_annotation="SUPPORTED_BY_PRODUCER_ASSERTION";
    return {claim:q.claim,path:q.path,state,missing_bindings,nonclaims,diagnostics:sorted(diagnostic),provenance:{producer:input.producer,evidence_refs:sorted(Array.isArray(input.bindings.evidence_refs)?input.bindings.evidence_refs:[]),basis:input.input_set_id},detail};
  });
  return {claims:results.sort((a,b)=>cmp(a.claim+":"+a.path,b.claim+":"+b.path)),automatic_equivalences:[],name_only_aliases:[],canonical_output:null,canonical_closure:{status:input.harness_missing_facts?.length?"MISSING_FACTS":results.some(c=>c.path==="integrity"&&c.state==="UNSUPPORTED"&&c.detail.observed_digest!==c.detail.expected_digest)?"REJECTED":"NOT_REQUESTED",missing_facts:sorted(input.harness_missing_facts??[])}};
}

