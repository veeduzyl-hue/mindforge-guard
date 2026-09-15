// B09 fixture/oracle AUTHORING ONLY. Does not import or execute reference evaluation.
// Verification never calls this file. --author is an explicit oracle revision operation.
import fs from "node:fs";
import { generateGovernanceReport } from "../../packages/guard-core/src/generateGovernanceReport.ts";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { MESR_CORE_REGISTRY } from "../../packages/guard-core/src/mesr/coreRegistry.ts";
import { MESR_CLAIM_BOUNDARIES } from "../../packages/guard-core/src/mesr/claimBoundaries.ts";
import { MESR_REASON_CODE_BINDINGS } from "../../packages/guard-core/src/mesr/reasonCodeBindings.ts";
import { createMesrExperiment3Phase2AFixtures } from "../fixtures/mesr_experiment_3_phase2a_fixtures.mjs";
const root=fileURLToPath(new URL("../../",import.meta.url)), dir=root+"tests/fixtures/experiment-3-repaired/";
const clone=v=>JSON.parse(JSON.stringify(v));
const canon=v=>v===null||typeof v!=="object"?JSON.stringify(v):Array.isArray(v)?"["+v.map(canon).join(",")+"]":"{"+Object.keys(v).sort().map(k=>JSON.stringify(k)+":"+canon(v[k])).join(",")+"}";
const sha=v=>createHash("sha256").update(typeof v==="string"?v:canon(v)).digest("hex");
const uniq=a=>[...new Set(a)].sort(), read=p=>fs.readFileSync(root+p,"utf8").replace(/^\uFEFF/,"");
const old=createMesrExperiment3Phase2AFixtures(), modules=clone([...old.d1.base_modules,...old.d1.additive_modules]);
const method_digest=sha(read("scripts/b09/reference.mjs"));
function lock(ms) {return ms.map(m=>({module_id:m.module_id,version:m.version,byte_digest:sha(canon(m)),content_digest:sha(m),byte_length:Buffer.byteLength(canon(m)),dependencies:m.dependencies.map(d=>({...d,content_digest:sha(ms.find(m=>m.module_id===d.module_id)??null)}))}));}
const basis={
 input_set_id:"b09-repaired-e3/0.2.0",oracle_version:"0.2.0",entries:clone(MESR_CORE_REGISTRY),boundaries:clone(MESR_CLAIM_BOUNDARIES),reason_bindings:clone(MESR_REASON_CODE_BINDINGS),modules,
 registry:{version:"0.1.0",digest:sha({entries:MESR_CORE_REGISTRY,boundaries:MESR_CLAIM_BOUNDARIES,reason_bindings:MESR_REASON_CODE_BINDINGS})},
 context_versions:Object.fromEntries(modules.filter(m=>["crosswalk","institutional_profile"].includes(m.module_type)).map(m=>[m.module_id,{core:"0.1.0",software:"0.1.0",crosswalk:"0.1.0"}])),
 admission_basis:{id:"b09-test-admission/0.2.0",issuer:"B09 fixture author",authority:"FINITE_TEST_ONLY_NOT_PRODUCT_ADMISSION",source:"B01/B08 and frozen Phase2A manifests",module_digests:modules.map(m=>({module_id:m.module_id,digest:sha(m)})),proof:"Exact existing entry/support/nonclaim/binding inventory; maps_to only; presentation only; finite base-claim/predicate noninterference probes"},
 method_digest,method_version:"0.2.0",canonicalization:"JSON keys code-point sorted; arrays preserved; UTF-8; no BOM/whitespace; finite JSON only",
 runtime:{node:"v24.15.0",mesr:"0.1.0",eak:"0.1.0-poc",report:"1.0.0"}
};
basis.binding_predicates={...Object.fromEntries(MESR_CORE_REGISTRY.flatMap(e=>e.required_bindings).map(k=>[k,"nonempty_reference"])),verification_executed:"true",witnesses:"nonempty_array",evidence_refs:"nonempty_array"};
basis.sufficiency_profile={id:"b09-assurance-profile",version:"0.1.0",digest:sha("B09 complete fixed profile"),requirements:["tests"]};
basis.claim_set={id:"b09-claim-set",version:"0.1.0",digest:sha("verification.passed"),claims:["verification.passed"]};
basis.module_lock=lock(modules);basis.module_lock_digest=sha(basis.module_lock);
const contractFiles={N:"docs/validation/v8-b02-claim-state-negative-cases-v0.1.md",I:"docs/validation/v8-b05-independence-integrity-falsifiers-v0.1.md",S:"docs/architecture/evidence-sufficiency-side-artifact-v0.1.md",T:"docs/validation/v8-b07-temporal-standing-cases-v0.1.md",C:"docs/validation/v8-b08-composition-hardening-cases-v0.1.md"};
const source_paths=[
 "fixtures/ai-pr-low-risk-complete/evidence-pack.json","scripts/fixtures/evidence_assurance_experiment_0_cases.mjs",
 ...Object.values(contractFiles),...fs.readdirSync(root+"docs/adr").filter(f=>/^001[0-6]-/.test(f)).map(f=>"docs/adr/"+f),
 "docs/architecture/harness-to-canonical-evidencepackv1-closure-v0.1.md","docs/adapters/harness-canonical-field-provenance-map-v0.1.md","docs/mesr/reason-code-semantic-delta-v0.1.md",
 "docs/mesr/implementation-reconciliation.v0.1.json","docs/planning/13_V8_000_SOURCE_RECONCILIATION.md","docs/validation/experiment-3-semantic-portability-and-composition-v0.1.md",
 "scripts/fixtures/mesr_experiment_3_phase2a_fixtures.mjs","scripts/fixtures/mesr_experiment_3_phase2c_fixtures.mjs","scripts/fixtures/mesr_e3_a1_runtime_portability_fixtures.mjs",
 ...fs.readdirSync(root+"packages/guard-core/src/mesr").filter(f=>f.endsWith(".ts")).map(f=>"packages/guard-core/src/mesr/"+f),
 "packages/guard-core/src/evidenceAssuranceKernel.ts","packages/guard-core/src/generateGovernanceReport.ts","packages/guard-core/src/reportModel.ts","packages/guard-core/src/reasonCodes.ts","packages/schema/evidence-schema-v1.json"];
basis.legacy_report_control=clone(generateGovernanceReport(JSON.parse(read("fixtures/ai-pr-low-risk-complete/evidence-pack.json"))));
basis.source_inventory=uniq(source_paths).map(path=>({path,digest:sha(read(path))}));
const V="mesr.core.evidence.verification",P="mesr.core.provenance.producer",O="mesr.core.evidence.observation",T="mesr.core.temporal.basis",E="mesr.core.evidence.item",A="mesr.core.action.action",G="mesr.core.claim.claim",R="mesr.core.review.review";
function request(path,claim=path,anchor=V){return {path,claim,semantic_ids:[anchor],semantic_version:"0.1.0",required_bindings:[]};}
const claims=Object.fromEntries([
 ["pass","verification.passed",V],["occurred","verification.occurred",V],["independence","verification.independent",V],
 ["producer_inference","verification.independent",P],["observation_inference","verification.independent",O],
 ["integrity","artifact.byte_equality",E],["custody","custody.independent",E],["sufficiency","evidence.sufficient",G],
 ["current","standing.current",T],["authority","authority.current",T],["old_authority_inference","authority.current",P],
 ["acceptance","institutional.acceptance",R],["decision","acceptance.decision_occurred",R],["action","action.succeeded",A],
 ["presence","evidence.present",E],["generic","claim_identity",G],["weakening_inference","evidence.sufficient",G]
].map(([p,c,a])=>[p,request(p,c,a)]));
const time="2026-09-15T10:00:00Z",subject="repo:fixture@revision-b",scope="src/change.ts";
function event(result="passed"){return {kind:"verification",event_id:"check:1",producer:"ci:fixture",verifier:"producer-check-runner",subject,scope,property:"unit-tests",method:"bounded-check",method_version:"0.1.0",time,input_ref:"fixture:change",output_ref:"fixture:test-output",criterion:"exit=0 and assertions=3",result};}
function temporal(){return {historical_support:true,reliance_time:time,effective_from:"2026-09-14T00:00:00Z",effective_until:"2026-09-16T00:00:00Z",interval_rule:"[from,until)",observed_at:"2026-09-15T09:00:00Z",continuity:{subject:"same",scope:"same",environment:"same",policy:"same",dependency:"same",authority:"same"},snapshot:{complete:true,horizon:"2026-09-16T00:00:00Z",publisher:"fixture:status-authority",source_ref:"fixture:offline-snapshot"},continuity_result:"decided",status_records:[]};}
function control(paths=["pass"]){
 const bindings=Object.fromEntries(uniq(MESR_CORE_REGISTRY.flatMap(e=>e.required_bindings)).map(k=>[k,"fixture:"+k]));
 Object.assign(bindings,{subject,scope,evaluation_time:time,evidence_refs:["fixture:change","fixture:test-output"],provenance:"fixture:provenance",witnesses:["fixture:witness"],verification_executed:true});
 return {kind:"claims",input_set_id:basis.input_set_id,subject,revision:"revision-b",scope,event_id:"check:1",event_time:time,producer:"ci:fixture",bindings,predicates:{verification_executed:"true",witnesses:"nonempty"},registry:clone(basis.registry),module_lock_digest:basis.module_lock_digest,method:{id:"b09-reference",version:"0.2.0",digest:method_digest},
 requests:paths.map(p=>clone(claims[p])),events:[event()],
 evidence_ledger:{"fixture:change":{subject,scope,revision:"revision-b",content:"- old\n+ repaired bounded change",producer:"ci:fixture"},"fixture:test-output":{subject,scope,event_id:"check:1",time,assertions:3,exit_code:0,producer:"ci:fixture"}},producer_principal:"principal:producer",executor_principal:"principal:executor",verifier_principal:"principal:independent",
 separation:{policy:"fixture:separation/0.1.0",producer_control:"org:producer",verifier_control:"org:review",evidence_ref:"fixture:control-register"},
 custody:{sole_producer_control:false,criterion:"fixture:custody/0.1.0",transfers:["fixture:collection","fixture:sealed-copy"],source_ref:"fixture:custody-record"},
 integrity:{bytes_base64:Buffer.from("B09 exact raw bytes\r\n").toString("base64"),expected_digest:sha("B09 exact raw bytes\r\n"),expected_source:"fixture:expected-manifest",comparison_event:"fixture:comparison",checker:"fixture:checker/0.1.0",time,byte_domain:"raw",expected_domain:"raw"},
 temporal:temporal(),historical_basis:{ref:"fixture:historical",digest:sha("historical bytes unchanged"),state:"SUPPORTED",time:"2026-09-14T10:00:00Z"},
 sufficiency:{profile_id:"b09-assurance-profile",profile_version:"0.1.0",profile_digest:sha("B09 complete fixed profile"),claim_set_id:"b09-claim-set",claim_set_version:"0.1.0",claim_set_digest:sha("verification.passed"),scope,evaluation_time:time,evidence_refs:["fixture:test-output"],material_gap_result:"no_material_gap",criterion_ref:"fixture:materiality/0.1.0",requirements:["tests"],evaluated_requirements:["tests"],atomic_results:[{claim:"verification.passed",state:"SUPPORTED"}]},
 authority_rebinding:{source_ref:"fixture:authority",principal:"principal:review",scope,subject,time},acceptance_authority:{source_ref:"fixture:decision-authority",subject,scope,time},acceptance_event:{source_ref:"fixture:acceptance",subject,scope,time},
 evidence_present:true,positive_evidence:{ref:"fixture:claim",subject,scope,time},legacy_report:"allow"};
}
const fixtures=[],oracleCases={};
function contract(id){const base=id.split(".")[0],file=contractFiles[base[0]];return {source:file??"docs/experiments/experiment-3-repaired-acceptance-v0.2.md",case:base,verbatim:file?read(file).split(/\r?\n/).find(l=>l.startsWith("| "+base+" |"))??"B09 variant":"B09 repaired E3 task; explicit local fixture"};}
function expected(input,states,gaps=[],diags=[]){return {claims:input.requests.map((q,i)=>{
 const m=Array.isArray(gaps[i])?gaps[i]:gaps,d=Array.isArray(diags[i])?diags[i]:diags;
 const extra={producer_inference:"producer_result_does_not_establish_independence",observation_inference:"observation_does_not_establish_verification",old_authority_inference:"historical_authority_does_not_establish_current_authority",weakening_inference:"requirements_cannot_be_subtracted"}[q.path];
 return {claim:q.claim,path:q.path,state:states[i],missing_bindings:uniq(m),nonclaims:uniq(q.semantic_ids.flatMap(id=>basis.entries.find(e=>e.semantic_id===id)?.does_not_support??[]).concat(extra?[extra]:[])),diagnostics:uniq([...m.map(x=>"MISSING:"+x),...d])};
 }).sort((a,b)=>{const x=a.claim+":"+a.path,y=b.claim+":"+b.path;return x<y?-1:x>y?1:0;}),automatic_equivalences:[],name_only_aliases:[]};}
function add(id,paths,mutate,states,gaps=[],diags=[],classification="PARTIAL_CONFORMANCE"){
 const input=control(paths);mutate?.(input);
 fixtures.push({case_id:id,contract_basis:contract(id),input,legacy_behavior_expected_unchanged:true,current_runtime_expected_to_conform:classification==="CONFORMS_TODAY",runtime_expectation:classification,observation_limit:"Legacy API results separate; no six-state enum equivalence."});
 oracleCases[id]=expected(input,states,gaps,diags);
 oracleCases[id].canonical_closure={status:input.harness_missing_facts?.length?"MISSING_FACTS":id==="I08"?"REJECTED":"NOT_REQUESTED",missing_facts:uniq(input.harness_missing_facts??[])};
}
const noInd=x=>{delete x.verifier_principal;delete x.separation;delete x.custody;},indGaps=["verifier_principal","separation","custody"],sg=["profile_id","claim_set_id","scope","evaluation_time","evidence_refs","material_gap_result"];
add("N01",["occurred","pass"],x=>x.events=[],["UNRESOLVED","UNRESOLVED"],["verification_event"]);
add("N02",["pass","independence","producer_inference"],noInd,["SUPPORTED","UNRESOLVED","UNSUPPORTED"],[[],indGaps,[]],[[],[],["INFERENCE_PROHIBITED"]]);
add("N03",["generic"],x=>{delete x.bindings.subject;delete x.bindings.provenance;x.requests[0].semantic_ids=[E];x.requests[0].claim="evidence_presence";},["UNRESOLVED"],["subject","provenance"],[],"EXPECTED_GAP");
add("N04",["generic"],x=>{x.requests[0].semantic_ids=[E];x.requests[0].claim="evidence_sufficiency";x.caller_supported_claim_parts=["evidence_sufficiency"];},["UNSUPPORTED"],[],["INFERENCE_PROHIBITED"],"EXPECTED_GAP");
add("N05",["pass"],x=>x.events.push(event("failed")),["CONFLICTED"],[],["COMPARABLE_CONFLICT"],"EXPECTED_GAP");
add("N06a",["current"],x=>delete x.temporal,["UNRESOLVED"],["currentness"],[],"EXPECTED_GAP");
add("N06b",["current"],x=>x.temporal.effective_until=time,["STALE"],[],["APPLICABILITY_LOST"],"EXPECTED_GAP");
add("N07",["pass"],x=>{x.requests[0].required_bindings=["witnesses"];x.bindings.witnesses=[];},["UNRESOLVED"],["witnesses"],[],"EXPECTED_GAP");
add("N08",["pass"],x=>{x.requests[0].required_bindings=["verification_executed"];x.bindings.verification_executed=false;},["UNRESOLVED"],["verification_executed"],[],"EXPECTED_GAP");
add("N09",["pass"],x=>x.requests[0].semantic_ids.push("mesr.core.unknown"),["UNRESOLVED"],["semantic_identity"]);
add("N10",["generic"],x=>x.caller_contradiction=true,["UNRESOLVED"],["contradictory_evidence"],[],"EXPECTED_GAP");
for(const kind of ["subject","time"])add("N11."+kind,["pass"],x=>{const e=event("failed");e[kind]="different";x.events.push(e);},["SUPPORTED"]);
add("N12.complete",["pass"],x=>x.events=[event("inconclusive")],["INCONCLUSIVE"]);
add("N12.missing",["pass"],x=>{x.events=[event("inconclusive")];delete x.bindings.subject;},["UNRESOLVED"],["subject"]);
add("N13",["presence","sufficiency"],x=>delete x.sufficiency,["SUPPORTED","UNRESOLVED"],[[],sg.map(k=>"sufficiency."+k)]);
add("N14",["decision","acceptance"],x=>delete x.acceptance_authority,["SUPPORTED","UNRESOLVED"],[[],["acceptance_authority"]]);
add("N15",["producer_inference","independence"],noInd,["UNSUPPORTED","UNRESOLVED"],[[],indGaps],[["INFERENCE_PROHIBITED"],[]]);
for(const result of ["failed","skipped"])add("N17."+result,["integrity","independence"],x=>{noInd(x);x.events=[];delete x.integrity.bytes_base64;x.external_checks=[result];},["UNRESOLVED","UNRESOLVED"],[["integrity.bytes_base64"],["verification_event",...indGaps]],[],"EXPECTED_GAP");
for(const label of ["allow","block"])add("N16."+label,["sufficiency"],x=>{delete x.sufficiency;x.legacy_report=label;},["UNRESOLVED"],sg.map(k=>"sufficiency."+k));
add("N18",["observation_inference","independence"],null,["UNSUPPORTED","SUPPORTED"],[],[["INFERENCE_PROHIBITED"],[]]);
add("I01",["pass","independence"],x=>x.verifier_principal=x.producer_principal,["SUPPORTED","UNSUPPORTED"]);
add("I02",["independence"],x=>delete x.verifier_principal,["UNRESOLVED"],["verifier_principal"]);
add("I03",["independence"],x=>delete x.custody,["UNRESOLVED"],["custody"]);
add("I04",["independence","producer_inference"],x=>{x.events=[];x.external_checks=["verified"];},["UNRESOLVED","UNSUPPORTED"],[["verification_event"],[]],[[],["INFERENCE_PROHIBITED"]],"EXPECTED_GAP");
add("I05.failed",["independence"],x=>{x.events=[event("failed")];x.external_checks=["failed"];},["UNSUPPORTED"],[],[],"EXPECTED_GAP");
add("I05.skipped",["occurred","independence"],x=>{x.events=[];x.external_checks=["skipped"];},["UNRESOLVED","UNRESOLVED"],["verification_event"],[],"EXPECTED_GAP");
add("I06",["integrity"],x=>delete x.integrity.bytes_base64,["UNRESOLVED"],["integrity.bytes_base64"],[],"EXPECTED_GAP");
add("I07",["integrity"],x=>delete x.integrity.comparison_event,["UNRESOLVED"],["integrity.comparison_event"],[],"EXPECTED_GAP");
add("I08",["integrity"],x=>x.integrity.expected_digest="0".repeat(64),["UNSUPPORTED"],[],[],"EXPECTED_GAP");
add("I09",["integrity","custody","independence"],x=>x.custody.sole_producer_control=true,["SUPPORTED","UNSUPPORTED","UNSUPPORTED"]);
add("I10",["independence","integrity","acceptance"],x=>{delete x.acceptance_event;delete x.acceptance_authority;},["SUPPORTED","SUPPORTED","UNRESOLVED"],[[],[],["acceptance_authority","acceptance_event"]]);
add("I11",["pass","independence"],x=>x.separation.verifier_control=x.separation.producer_control,["SUPPORTED","UNSUPPORTED"]);
for(const field of ["subject","scope","time"])add("I12."+field,["pass"],x=>x.events[0][field]="unrelated",["UNRESOLVED"],["verification_event"]);
add("I13",["pass"],x=>x.events.push(event("failed")),["CONFLICTED"],[],["COMPARABLE_CONFLICT"]);
add("I14.complete",["pass"],x=>x.events[0].result="inconclusive",["INCONCLUSIVE"]);
add("I14.missing",["pass"],x=>{x.events[0].result="inconclusive";delete x.events[0].method;},["UNRESOLVED"],["verification_event"]);
add("I15",["integrity"],x=>x.integrity.byte_domain="redacted",["UNRESOLVED"],["integrity.byte_domain"]);
add("I16",["pass","action"],x=>{x.events=[{...event(),kind:"action",result:"succeeded"}];x.harness_missing_facts=["verification_event","owner","authority"];},["UNRESOLVED","SUPPORTED"],[["verification_event"],[]]);
add("I17",["current"],x=>x.temporal.effective_until=time,["STALE"],[],["APPLICABILITY_LOST"],"EXPECTED_GAP");
add("I18",["observation_inference","independence"],null,["UNSUPPORTED","SUPPORTED"],[],[["INFERENCE_PROHIBITED"],[]]);


add("S01",["sufficiency"],x=>delete x.sufficiency,["UNRESOLVED"],sg.map(k=>"sufficiency."+k),[],"EXPECTED_GAP");
for(const f of sg)add("S02."+f,["sufficiency"],x=>delete x.sufficiency[f],["UNRESOLVED"],["sufficiency."+f],[],"EXPECTED_GAP");
for(const f of ["registry","method","module_lock"])add("S03."+f,["sufficiency"],x=>{if(f==="module_lock")x.module_lock_digest="unknown";else x[f]=null;},["UNRESOLVED"],[f],[],"EXPECTED_GAP");
add("S04",["sufficiency"],null,["SUPPORTED"]);
add("S05",["sufficiency"],x=>x.sufficiency.material_gap_result="material_gap",["UNSUPPORTED"]);
add("S06",["sufficiency"],x=>x.sufficiency.evaluated_requirements=[],["UNRESOLVED"],["sufficiency.requirement.tests"]);
for(const val of ["omit","false","empty"])add("S07."+val,["sufficiency","weakening_inference"],x=>{for(const q of x.requests)q.required_bindings=["verification_executed"];if(val==="omit")delete x.bindings.verification_executed;else x.bindings.verification_executed=val==="false"?false:[];},["UNRESOLVED","UNSUPPORTED"],["verification_executed"],[[],["INFERENCE_PROHIBITED"]]);
add("S08.conflict",["sufficiency"],x=>{x.events.push(event("failed"));x.precedence_conflict=true;delete x.sufficiency.scope;},["CONFLICTED"],["sufficiency.scope"],["COMPARABLE_CONFLICT"]);
add("S08.stale",["sufficiency"],x=>{x.temporal.effective_until=time;x.precedence_stale=true;delete x.sufficiency.scope;},["STALE"],["sufficiency.scope"],["APPLICABILITY_LOST"]);
add("S09",["sufficiency"],x=>x.sufficiency.material_gap_result="inconclusive",["INCONCLUSIVE"]);
add("S10",["sufficiency"],x=>x.legacy_report="require_review",["SUPPORTED"]);
add("S11.mismatch",["sufficiency"],x=>x.report_link={bytes:JSON.stringify(basis.legacy_report_control.report),report_id:basis.legacy_report_control.report.report_id,report_schema_version:"1.0.0",expected_digest:sha("other report bytes")},["SUPPORTED"],[],["REPORT_LINK_MISMATCH"]);
add("S11.absent",["sufficiency"],null,["SUPPORTED"]);
add("S12",["sufficiency"],x=>{x.presentation={hidden_claims:["tests"],label:"SUFFICIENT"};x.sufficiency.atomic_results[0].state="UNRESOLVED";},["UNRESOLVED"],["sufficiency.atomic.verification.passed"]);
add("S13",["sufficiency","pass"],x=>{x.harness_missing_facts=["owner","authority","verification_event"];x.events=[];x.sufficiency.atomic_results[0].state="UNRESOLVED";},["UNRESOLVED","UNRESOLVED"],[["sufficiency.atomic.verification.passed"],["verification_event"]]);
add("T01",["current"],x=>delete x.temporal,["UNRESOLVED"],["currentness"],[],"EXPECTED_GAP");
add("T02.at",["current"],x=>x.temporal.effective_until=time,["STALE"],[],["APPLICABILITY_LOST"],"EXPECTED_GAP");
add("T02.before",["current"],x=>x.temporal.effective_until="2026-09-15T10:00:00.001Z",["SUPPORTED"]);
add("T03",["current"],x=>x.temporal.revocation={attributable:true,effective_at:"2026-09-15T09:00:00Z",source_ref:"fixture:revocation"},["STALE"],[],["APPLICABILITY_LOST"],"EXPECTED_GAP");
add("T04",["current"],x=>x.temporal.snapshot.complete=false,["UNRESOLVED"],["snapshot_coverage"],[],"EXPECTED_GAP");
add("T05",["current"],x=>x.temporal.successor={id:"next",version:"0.1.1"},["UNRESOLVED"],["supersession_rule"]);
add("T06",["current"],x=>{x.temporal.successor={id:"next",version:"0.1.1"};x.temporal.displacement_rule={effective_at:time,ref:"fixture:displacement"};},["STALE"],[],["APPLICABILITY_LOST"]);
add("T07",["current"],x=>x.revalidation={event:event(),historical_ref:x.historical_basis.ref},["SUPPORTED"]);
add("T08",["current"],x=>x.temporal.continuity.subject="material_loss",["STALE"],[],["APPLICABILITY_LOST"]);
for(const f of ["subject","scope"])add("T09."+f,["current"],x=>delete x.temporal.continuity[f],["UNRESOLVED"],["continuity."+f]);
for(const [id,f] of [["T10","scope"],["T11","environment"],["T12.policy","policy"],["T12.dependency","dependency"]])add(id,["current"],x=>x.temporal.continuity[f]="material_loss",["STALE"],[],["APPLICABILITY_LOST"]);
for(const f of ["policy","dependency"])add("T13."+f,["current"],x=>delete x.temporal.continuity[f],["UNRESOLVED"],["continuity."+f]);
add("T14",["authority","old_authority_inference"],x=>delete x.authority_rebinding,["UNRESOLVED","UNSUPPORTED"],[["authority_rebinding"],[]],[[],["INFERENCE_PROHIBITED"]]);
add("T15",["authority","acceptance"],x=>delete x.acceptance_event,["SUPPORTED","UNRESOLVED"],[[],["acceptance_event"]]);
add("T16",["decision","acceptance"],x=>delete x.acceptance_authority,["SUPPORTED","UNRESOLVED"],[[],["acceptance_authority"]]);
add("T17",["current"],x=>x.temporal.revocation={attributable:true,effective_at:"2026-09-16T00:00:00Z",source_ref:"fixture:later-revocation"},["SUPPORTED"]);
for(const f of ["evaluation_time","reliance_time"])add("T18."+f,["current"],x=>{if(f==="evaluation_time")delete x.bindings[f];else delete x.temporal[f];},["UNRESOLVED"],[f]);
add("T19",["current"],x=>x.temporal.status_records=["current","revoked"].map(value=>({subject,scope,time,attributable:true,value,ref:"fixture:"+value})),["CONFLICTED"],[],["COMPARABLE_CONFLICT"]);
add("T20",["current"],x=>{x.temporal.effective_until=time;delete x.temporal.continuity.dependency;},["STALE"],["continuity.dependency"],["APPLICABILITY_LOST"]);
add("T21.complete",["current"],x=>x.temporal.continuity_result="inconclusive",["INCONCLUSIVE"]);
add("T21.missing",["current"],x=>{x.temporal.continuity_result="inconclusive";delete x.temporal.continuity.policy;},["UNRESOLVED"],["continuity.policy"]);
add("T22.rule",["current"],x=>{x.temporal.max_age_ms=1000;x.temporal.age_requested=true;},["STALE"],[],["APPLICABILITY_LOST"]);
add("T22.absent",["current"],x=>x.temporal.age_requested=true,["UNRESOLVED"],["freshness_rule"]);
add("T23",["current"],x=>x.temporal.snapshot.horizon="2026-09-15T09:00:00Z",["UNRESOLVED"],["snapshot_coverage"]);
add("T24.timezone",["current"],x=>x.temporal.reliance_time="2026-09-15T10:00:00",["UNRESOLVED"],["reliance_time"]);
add("T24.interval",["current"],x=>delete x.temporal.interval_rule,["UNRESOLVED"],["interval_rule"]);
for(const variant of ["equal","earlier"])add("T25."+variant,["current"],x=>x.legacy_expiry=variant,["SUPPORTED"]);
add("T26.complete",["current"],x=>{x.temporal.historical_support=false;x.temporal.effective_from="2026-09-16T00:00:00Z";},["UNSUPPORTED"]);
add("T26.missing",["current"],x=>{x.temporal.historical_support=false;x.temporal.effective_from="2026-09-16T00:00:00Z";delete x.temporal.interval_rule;},["UNRESOLVED"],["interval_rule"]);
add("T27",["authority"],x=>{delete x.temporal;delete x.authority_rebinding;x.harness_missing_facts=["currentness","authority_rebinding"];},["UNRESOLVED"],["currentness","authority_rebinding"]);
for(const producer of ["ci","harness_style"]){
 add("E3-A."+producer,["pass","independence"],x=>{noInd(x);x.producer=producer+":fixture";x.events[0].producer=x.producer;x.raw_producer=producer==="ci"?{jobs:[{check:clone(x.events[0])}]}:{verification_events:[clone(x.events[0])],source:"Explicit supplemental test events, not actual Harness integration"};delete x.events;},["SUPPORTED","UNRESOLVED"],[[],indGaps]);
 add("E3-A."+producer+".execution_only",["action","pass","independence"],x=>{noInd(x);x.producer=producer+":fixture";x.events=[{...event(),kind:"action",result:"succeeded",producer:x.producer}];x.harness_missing_facts=["verification_event","owner","authority"];},["SUPPORTED","UNRESOLVED","UNRESOLVED"],[[],["verification_event"],["verification_event",...indGaps]]);
}
add("E3-B.absent",["occurred","pass","independence"],x=>{noInd(x);x.events=[];},["UNRESOLVED","UNRESOLVED","UNRESOLVED"],[["verification_event"],["verification_event"],["verification_event",...indGaps]]);
add("E3-B.producer",["pass","independence","producer_inference"],noInd,["SUPPORTED","UNRESOLVED","UNSUPPORTED"],[[],indGaps,[]],[[],[],["INFERENCE_PROHIBITED"]]);
for(const label of ["Runtime ALLOW","Guard allow","external ALLOW","VERIFIED","APPROVED","SAFE","ACCEPTED","COMPLIANT","IDENTITY","AUTHORITY","TESTS PASSED","ACCEPTANCE","HISTORICAL VALID","CURRENT STANDING"])
 add("E3-C."+label.replaceAll(" ","_"),["generic"],x=>{x.requests=[request("collision","world.fact",G)];x.events=[];x.label=label;},["UNRESOLVED"],["admitted_mapping_and_evidence"],[],"CONFORMS_TODAY");
function baseComposition(){return {kind:"composition",input_set_id:basis.input_set_id,modules:clone(modules),registry:clone(basis.registry),lock:clone(basis.module_lock),raw_manifests:Object.fromEntries(modules.map(m=>[m.module_id,canon(m)])),admission_basis:clone(basis.admission_basis),context_versions:clone(basis.context_versions),relations:[],effective_changes:[],evaluation_time:time};}
function diag(rule_id,subject="",field="",related_id=""){return {rule_id,subject,field,related_id,detail:rule_id};}
const mid=modules.map(m=>m.module_id),sid=modules[1].added_semantics[0].semantic_id,xid=modules[2].mappings[0].external_concept;
function comp(id,mutate,diagnostics=[],relock=true,classification="EXPECTED_GAP"){
 const input=baseComposition();mutate?.(input);
 if(relock){input.lock=lock(input.modules);input.raw_manifests=Object.fromEntries(input.modules.map(m=>[m.module_id,canon(m)]));}
 fixtures.push({case_id:id,contract_basis:contract(id),input,legacy_behavior_expected_unchanged:true,current_runtime_expected_to_conform:classification==="CONFORMS_TODAY",runtime_expectation:classification,observation_limit:"Exact legacy issues separate from auxiliary LOCK_*."});
 oracleCases[id]={status:diagnostics.length?"INVALID_COMPOSITION":"VALID_COMPOSITION",semantic_entries:diagnostics.length?[]:modules.flatMap(m=>m.added_semantics),mappings:diagnostics.length?[]:modules.flatMap(m=>m.mappings),profiles:diagnostics.length?[]:modules.filter(m=>m.module_type==="institutional_profile"),diagnostics:diagnostics.sort((a,b)=>{const x=[a.rule_id,a.subject,a.field,a.related_id,a.detail].join("\0"),y=[b.rule_id,b.subject,b.field,b.related_id,b.detail].join("\0");return x<y?-1:x>y?1:0;})};
}
comp("C01",null,[],true,"CONFORMS_TODAY");
comp("C02",x=>x.modules.push(clone(x.modules[3])),[diag("LOCK_DUPLICATE_MODULE_ID",mid[3],"module_id")]);
comp("C03.within",x=>x.modules[1].added_semantics.push(clone(x.modules[1].added_semantics[0])),[diag("DUPLICATE_MODULE_SEMANTIC_ID",mid[1],"added_semantics",sid)],true,"CONFORMS_TODAY");
comp("C04",x=>x.modules[3].dependencies.push({module_id:"missing",version:"0.1.0"}),[diag("MISSING_MODULE_DEPENDENCY",mid[3],"dependencies","missing")],true,"CONFORMS_TODAY");
comp("C05",x=>x.modules[1].dependencies[0].version="0.1.1",[diag("LOCK_DEPENDENCY_VERSION_MISMATCH",mid[1],"dependencies",mid[0])]);
comp("C06.literal",x=>x.modules[1].core_compatibility="latest",[diag("INCOMPATIBLE_CORE_VERSION",mid[1],"core_compatibility")],true,"CONFORMS_TODAY");
comp("C06.registry",x=>x.registry.digest="0".repeat(64),[diag("LOCK_REGISTRY_MISMATCH","registry","registry")]);
comp("C07",x=>x.lock[1].byte_digest="0".repeat(64),[diag("LOCK_CONTENT_MISMATCH",mid[1],"lock")],false);
comp("C08.override",x=>x.modules[1].semantic_overrides=[{left:"verified",right:"approved"}],[diag("SEMANTIC_OVERRIDE_FORBIDDEN",mid[1],"semantic_overrides","verified=approved")],true,"CONFORMS_TODAY");
comp("C08.collision",x=>x.modules[1].added_semantics.push(clone(x.modules[0].added_semantics[0])),[diag("SEMANTIC_COLLISION",mid[1],"added_semantics",modules[0].added_semantics[0].semantic_id),diag("SEMANTIC_OUTSIDE_OWNED_NAMESPACE",mid[1],"added_semantics",modules[0].added_semantics[0].semantic_id)],true,"CONFORMS_TODAY");
comp("C09",x=>x.modules[1].added_semantics[0].supports.push("world_safe"),[diag("LOCK_SUPPORT_WIDENING",mid[1],"supports",sid)]);
comp("C10",x=>x.modules[1].added_semantics[0].does_not_support=[],[diag("LOCK_NONCLAIM_REMOVAL",mid[1],"does_not_support",sid)]);
comp("C11",x=>x.modules[1].added_semantics[0].required_bindings=[],[diag("LOCK_BINDING_WEAKENING",mid[1],"required_bindings",sid)]);
for(const [id,type,code]of [["C12","alias","LOCK_ALIAS_CYCLE"],["C13","supersedes","LOCK_SUPERSESSION_CYCLE"]])comp(id,x=>x.relations=[{type,from:"A",to:"B"},{type,from:"B",to:"A"}],[diag(code,"composition",type,"A->B->A")]);
comp("C14",x=>x.modules[0].dependencies=[{module_id:mid[1],version:"0.1.0"}],[diag("CIRCULAR_MODULE_DEPENDENCY","composition","dependencies",mid[0]+"->"+mid[1]+"->"+mid[0]),diag("LOCK_BASIS_UNRESOLVED",mid[0],"forward_dependency",mid[1])],true,"PARTIAL_CONFORMANCE");
comp("C15.source",x=>x.modules[2].mappings[0].source_version="wrong",[diag("LOCK_CONTEXT_VERSION_MISMATCH",mid[2],"source_version")]);
comp("C15.profile",x=>x.context_versions[mid[3]].crosswalk="0.1.1",[diag("LOCK_CONTEXT_VERSION_MISMATCH",mid[3],"context_versions")]);
comp("C16.crosswalk",x=>x.modules[2].added_semantics=[clone(modules[0].added_semantics[0])],[diag("CROSSWALK_SEMANTICS_FORBIDDEN",mid[2],"added_semantics"),diag("SEMANTIC_COLLISION",mid[2],"added_semantics",modules[0].added_semantics[0].semantic_id),diag("SEMANTIC_OUTSIDE_OWNED_NAMESPACE",mid[2],"added_semantics",modules[0].added_semantics[0].semantic_id)],true,"CONFORMS_TODAY");
comp("C16.profile",x=>x.modules[3].mappings=[clone(modules[2].mappings[0])],[diag("PROFILE_SEMANTIC_PARTICIPATION_FORBIDDEN",mid[3],"added_semantics")],true,"CONFORMS_TODAY");
comp("C17.target",x=>x.modules[2].mappings[0].target_semantic_id="missing",[diag("UNRESOLVED_MAPPING_TARGET",mid[2],"mappings","missing")],true,"CONFORMS_TODAY");
comp("C17.provenance",x=>x.modules[2].mappings[0].provenance=[],[diag("INCOMPLETE_MAPPING_PROVENANCE",mid[2],"mappings",xid)],true,"CONFORMS_TODAY");
comp("C18",x=>x.modules[3].semantic_overrides=[{left:"a",right:"b"}],[diag("SEMANTIC_OVERRIDE_FORBIDDEN",mid[3],"semantic_overrides","a=b")],true,"CONFORMS_TODAY");
comp("C19",x=>{x.modules[1].dependencies[0].version="0.1.1";x.modules[1].added_semantics[0].supports.push("world_safe");},[diag("LOCK_DEPENDENCY_VERSION_MISMATCH",mid[1],"dependencies",mid[0]),diag("LOCK_SUPPORT_WIDENING",mid[1],"supports",sid)]);
for(const type of ["producer","consumer"])comp("C20."+type,x=>x.modules[3].module_type=type,[diag("LOCK_BASIS_UNRESOLVED","composition","shape")],true,"NOT_APPLICABLE_TO_CURRENT_RUNTIME");
comp("C20.malformed",x=>x.modules[3].added_semantics=[null],[diag("LOCK_BASIS_UNRESOLVED","composition","shape")],true,"NOT_APPLICABLE_TO_CURRENT_RUNTIME");
for(const version of [">=0.1.0","latest","0.1.0-rc.1","01.1.0"])comp("C21."+version,x=>x.modules[1].dependencies[0].version=version,[diag("LOCK_BASIS_UNRESOLVED",mid[1],"dependencies.version",version)]);
comp("C22.array",x=>{x.modules[1].added_semantics.reverse();x.raw_manifests[mid[1]]=canon(x.modules[1]);},[diag("LOCK_CONTENT_MISMATCH",mid[1],"lock"),diag("LOCK_CONTENT_MISMATCH",mid[2],"dependencies.digest",mid[1])],false);
comp("C22.raw",x=>x.raw_manifests[mid[1]]+="\n",[diag("LOCK_CONTENT_MISMATCH",mid[1],"lock")],false);
comp("C23",x=>x.effective_changes=[{kind:"binding_weakening",module_id:mid[3],claim:"verification.passed"}],[diag("LOCK_BINDING_WEAKENING",mid[3],"effective_claim","verification.passed")]);
comp("C24",x=>x.relations=[{type:"adjacent_to",from:"A",to:"B"},{type:"adjacent_to",from:"B",to:"A"},{type:"orthogonal_to",from:"A",to:"B"},{type:"orthogonal_to",from:"B",to:"A"}],[],true,"PARTIAL_CONFORMANCE");
comp("C25",x=>x.modules[2].dependencies.push({module_id:mid[3],version:"0.1.0"}),[diag("LOCK_BASIS_UNRESOLVED",mid[2],"forward_dependency",mid[3])]);
for(const type of ["supersedes","refines","stronger_than","weaker_than"])comp("C26."+type,x=>x.relations=[{type,from:"A",to:"B",activate:true}],[diag("LOCK_NONINTERFERENCE_UNPROVEN","composition","relation",type)]);
comp("C27",x=>x.admission_basis=null,[diag("LOCK_NONINTERFERENCE_UNPROVEN","composition","admission_basis")]);
add("S04.label_only",["sufficiency"],x=>x.events=[],["UNRESOLVED"],["sufficiency.atomic.verification.passed"],[],"EXPECTED_GAP");
add("S04.bad_profile_digest",["sufficiency"],x=>x.sufficiency.profile_digest="0".repeat(64),["UNRESOLVED"],["sufficiency.profile_version_digest"]);
add("N08.predicate_override",["pass"],x=>{x.requests[0].required_bindings=["verification_executed"];x.bindings.verification_executed=false;x.predicates.verification_executed="presence";},["UNRESOLVED"],["verification_executed"],[],"EXPECTED_GAP");
add("I10.unresolved_ref",["pass"],x=>delete x.evidence_ledger["fixture:test-output"],["UNRESOLVED"],["evidence_ref:fixture:test-output"]);
add("E3-A.actual_harness_gaps",["action","pass","independence"],x=>{noInd(x);x.producer="guard-native-agent-harness@0.5.0";x.events=[{...event(),kind:"action",result:"succeeded",producer:x.producer}];x.harness_missing_facts=["owner","authority","verification_event"];x.raw_harness={schema_version:"mindforge-guard-evidence.v1",pack_type:"execution_facts",verification:{passed:1,failed:0},command_result:{exit_code:0},task:{created_at:time}};},["SUPPORTED","UNRESOLVED","UNRESOLVED"],[[],["verification_event"],["verification_event",...indGaps]]);
const oracle={fixture_input_digests:Object.fromEntries(fixtures.map(f=>[f.case_id,sha(f.input)])),oracle_version:"0.2.0",input_set_id:basis.input_set_id,registry:basis.registry,canonical_semantic_ids:basis.entries.map(e=>({id:e.semantic_id,version:e.version,digest:sha(e)})),module_lock:basis.module_lock,module_lock_digest:basis.module_lock_digest,method:{version:"0.2.0",digest:method_digest},claim_set:uniq(fixtures.flatMap(f=>f.input.requests?.map(q=>q.claim)??[])),subject,revision:"revision-b",scope,evaluation_time:time,reliance_time:time,basis_digest:sha(basis),cases:oracleCases,nonclaims:["not runtime conformance","not canonical alias admission","not independent audit opinion","not universal interoperability","not Gate 1 admission"],provenance_rule:"Producer identities remain different even when bounded check results agree."};
if(process.argv.includes("--author")){
 if(fs.existsSync(dir+"freeze.v0.2.json"))throw Error("Oracle frozen; author a separately reviewed version instead of overwriting.");
 for(const [file,value]of [["basis.v0.2.json",basis],["cases.v0.2.json",fixtures],["oracle.v0.2.json",oracle]])fs.writeFileSync(dir+file,JSON.stringify(value,null,2)+"\n");
 console.log("AUTHORED",fixtures.length,"fixtures; independent expected results. No evaluator executed.");
}

