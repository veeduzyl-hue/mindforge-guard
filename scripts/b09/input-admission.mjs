// VALIDATION_ONLY_REFERENCE_EVALUATOR
// NOT_PRODUCT_RUNTIME
// NOT_CANONICAL_MESR_IMPLEMENTATION
// B09 admission-hardening/0.1; keeps the frozen 0.2.0 finite kernel unchanged.
// Structural admission is separate from assurance. Exceptions from the kernel propagate as ERROR.
import { evaluate, canonical, hash, cmp } from "./reference.mjs";
export const ADMISSION_VERSION = "0.1.0";
const record=v=>v!==null&&typeof v==="object"&&!Array.isArray(v)&&Object.getPrototypeOf(v)===Object.prototype;
const text=v=>typeof v==="string";
const nonempty=v=>text(v)&&v.trim().length>0;
const strings=v=>Array.isArray(v)&&v.every(text);
const types=["core","domain_pack","crosswalk","institutional_profile"];
const paths=["pass","occurred","independence","producer_inference","observation_inference","integrity","custody","sufficiency","current","authority","old_authority_inference","acceptance","decision","action","presence","generic","weakening_inference","collision"];
function jsonDomain(v,seen=new Set()){
 if(v===null||["string","boolean"].includes(typeof v))return true;
 if(typeof v==="number")return Number.isFinite(v);
 if(!Array.isArray(v)&&!record(v))return false;
 if(seen.has(v))return false;
 seen.add(v);
 const valid=(Array.isArray(v)?v:Object.values(v)).every(x=>jsonDomain(x,seen));
 seen.delete(v);return valid;
}
export function validateReferenceInput(input){
 const issues=[];
 const issue=(field,rule="INVALID_FIELD_TYPE")=>issues.push({code:rule,field});
 const check=(ok,field,rule)=>{if(!ok)issue(field,rule);return ok;};
 const optional=(obj,key,predicate,base)=>{if(obj[key]!==undefined&&obj[key]!==null)check(predicate(obj[key]),base+"."+key);};
 if(!check(jsonDomain(input)&&record(input),"$","INVALID_JSON_INPUT"))return issues;
 if(!check(["claims","composition"].includes(input.kind),"kind","UNSUPPORTED_INPUT_KIND"))return issues;
 if(input.kind==="composition"){
  if(!check(Array.isArray(input.modules),"modules"))return issues;
  for(const [i,m]of input.modules.entries()){
   const p="modules."+i;
   if(!check(record(m),p))continue;
   check(types.includes(m.module_type),p+".module_type","UNSUPPORTED_MODULE_TYPE");
   for(const k of ["module_id","version","semantic_namespace","core_compatibility"])check(nonempty(m[k]),p+"."+k);
   for(const k of ["dependencies","added_semantics","mappings","conformance_requirements","external_references","prohibited_overrides"])check(Array.isArray(m[k]),p+"."+k);
   if(Array.isArray(m.dependencies))for(const [j,d]of m.dependencies.entries())check(record(d)&&nonempty(d.module_id)&&nonempty(d.version),p+".dependencies."+j);
   if(Array.isArray(m.added_semantics))for(const [j,e]of m.added_semantics.entries())check(record(e)&&nonempty(e.semantic_id)&&["supports","does_not_support","required_bindings"].every(k=>strings(e[k]))&&text(e.definition),p+".added_semantics."+j);
   if(Array.isArray(m.mappings))for(const [j,r]of m.mappings.entries())check(record(r)&&["external_concept","target_semantic_id","mapping_relation","source_version"].every(k=>nonempty(r[k]))&&strings(r.provenance)&&strings(r.limitations),p+".mappings."+j);
   optional(m,"semantic_overrides",v=>Array.isArray(v)&&v.every(r=>record(r)&&text(r.left)&&text(r.right)),p);
  }
  optional(input,"lock",v=>Array.isArray(v)&&v.every(r=>record(r)&&nonempty(r.module_id)&&Array.isArray(r.dependencies)&&r.dependencies.every(d=>record(d)&&nonempty(d.module_id)&&text(d.content_digest))),"$");
  optional(input,"relations",v=>Array.isArray(v)&&v.every(r=>record(r)&&["type","from","to"].every(k=>nonempty(r[k]))&&(r.activate===undefined||typeof r.activate==="boolean")),"$");
  optional(input,"effective_changes",v=>Array.isArray(v)&&v.every(r=>record(r)&&["kind","module_id","claim"].every(k=>nonempty(r[k]))),"$");
  optional(input,"raw_manifests",record,"$");
  if(record(input.raw_manifests))for(const [id,raw]of Object.entries(input.raw_manifests)){
   if(!check(text(raw),"raw_manifests."+id))continue;
   // Parsing rejection is deliberate input validation, not a swallowed evaluator exception.
   try{check(record(JSON.parse(raw)),"raw_manifests."+id,"INVALID_MANIFEST_JSON");}
   catch{issue("raw_manifests."+id,"INVALID_MANIFEST_JSON");}
  }
  return issues.sort((a,b)=>cmp(a.field+":"+a.code,b.field+":"+b.code));
 }
 if(!check(Array.isArray(input.requests)&&input.requests.length>0,"requests"))return issues;
 for(const [i,q]of input.requests.entries()){
  if(!check(record(q),"requests."+i))continue;
  check(paths.includes(q.path),"requests."+i+".path","UNSUPPORTED_CLAIM_PATH");
  check(nonempty(q.claim)&&strings(q.semantic_ids)&&q.semantic_ids.length>0&&nonempty(q.semantic_version),"requests."+i+".identity");
  optional(q,"required_bindings",strings,"requests."+i);
 }
 check(record(input.bindings),"bindings");
 for(const field of ["subject","scope","input_set_id","producer"])check(nonempty(input[field]),field);
 optional(input,"events",v=>Array.isArray(v)&&v.every(e=>record(e)&&Object.values(e).every(text)),"$");
 optional(input,"raw_producer",record,"$");
 if(record(input.raw_producer)){
  optional(input.raw_producer,"jobs",v=>Array.isArray(v)&&v.every(j=>record(j)&&(j.check===undefined||record(j.check))),"raw_producer");
  optional(input.raw_producer,"verification_events",v=>Array.isArray(v)&&v.every(record),"raw_producer");
 }
 for(const field of ["producer_principal","executor_principal","verifier_principal"])optional(input,field,nonempty,"$");
 optional(input,"separation",v=>record(v)&&["policy","producer_control","verifier_control","evidence_ref"].every(k=>nonempty(v[k])),"$");
 optional(input,"custody",v=>record(v)&&typeof v.sole_producer_control==="boolean"&&nonempty(v.criterion)&&strings(v.transfers)&&v.transfers.length>0&&nonempty(v.source_ref),"$");
 optional(input,"evidence_ledger",v=>record(v)&&Object.values(v).every(r=>record(r)&&nonempty(r.subject)&&nonempty(r.scope)),"$");
 optional(input,"integrity",record,"$");
 if(record(input.integrity)){
  for(const k of ["bytes_base64","expected_digest","expected_source","comparison_event","checker","time","byte_domain","expected_domain"])optional(input.integrity,k,text,"integrity");
  if(text(input.integrity.bytes_base64))check(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(input.integrity.bytes_base64),"integrity.bytes_base64","INVALID_BASE64");
 }
 optional(input,"sufficiency",record,"$");
 if(record(input.sufficiency)){
  const s=input.sufficiency;
  for(const k of ["profile_id","profile_version","profile_digest","claim_set_id","claim_set_version","claim_set_digest","scope","evaluation_time","material_gap_result","criterion_ref"])optional(s,k,text,"sufficiency");
  for(const k of ["evidence_refs","requirements","evaluated_requirements"])optional(s,k,strings,"sufficiency");
  optional(s,"atomic_results",v=>Array.isArray(v)&&v.every(a=>record(a)&&nonempty(a.claim)&&["SUPPORTED","UNSUPPORTED","UNRESOLVED","CONFLICTED","STALE","INCONCLUSIVE"].includes(a.state)),"sufficiency");
  // A supplied complete-evaluation record needs its explicit atomic inventory.
  if(s.material_gap_result==="no_material_gap")check(Array.isArray(s.atomic_results)&&s.atomic_results.length>0,"sufficiency.atomic_results","INCOMPLETE_EVALUATION_RECORD");
 }
 optional(input,"temporal",record,"$");
 if(record(input.temporal)){
  const t=input.temporal;
  for(const k of ["reliance_time","effective_from","effective_until","interval_rule","observed_at","continuity_result"])optional(t,k,text,"temporal");
  for(const k of ["historical_support","age_requested"])optional(t,k,v=>typeof v==="boolean","temporal");
  optional(t,"max_age_ms",v=>typeof v==="number"&&v>0,"temporal");
  optional(t,"continuity",v=>record(v)&&Object.values(v).every(x=>["same","material_loss"].includes(x)),"temporal");
  optional(t,"snapshot",v=>record(v)&&typeof v.complete==="boolean"&&["horizon","publisher","source_ref"].every(k=>nonempty(v[k])),"temporal");
  optional(t,"status_records",v=>Array.isArray(v)&&v.every(r=>record(r)&&["subject","scope","time","value","ref"].every(k=>nonempty(r[k]))&&typeof r.attributable==="boolean"),"temporal");
  optional(t,"revocation",v=>record(v)&&typeof v.attributable==="boolean"&&nonempty(v.effective_at)&&nonempty(v.source_ref),"temporal");
  for(const k of ["effective_from","effective_until"])if(t[k]===undefined)issue("temporal."+k,"INCOMPLETE_TEMPORAL_RECORD");
 }
 for(const field of ["authority_rebinding","acceptance_authority","acceptance_event"])optional(input,field,v=>record(v)&&["source_ref","subject","scope","time"].every(k=>nonempty(v[k])),"$");
 optional(input,"report_link",v=>record(v)&&text(v.bytes)&&nonempty(v.expected_digest),"$");
 optional(input,"harness_missing_facts",strings,"$");
 return issues.sort((a,b)=>cmp(a.field+":"+a.code,b.field+":"+b.code));
}
export function evaluateAdmitted(input,basis){
 const issues=validateReferenceInput(input);
 if(issues.length){
  if(input?.kind==="composition")return {status:"INVALID_COMPOSITION",semantic_entries:[],mappings:[],profiles:[],diagnostics:[{rule_id:"LOCK_BASIS_UNRESOLVED",subject:"composition",field:"shape",related_id:"",detail:"LOCK_BASIS_UNRESOLVED"}],input_validation:{status:"REJECTED",issues}};
  return {status:"REJECTED",claims:[],input_validation:{status:"REJECTED",issues}};
 }
 // No catch: an unexpected evaluator exception is an ERROR in the acceptance runner.
 return evaluate(input,basis);
}
export function artifactHash(bytes){return hash(bytes);}

