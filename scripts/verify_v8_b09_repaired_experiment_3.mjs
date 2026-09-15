// VALIDATION_ONLY_REFERENCE_EVALUATOR / NOT_PRODUCT_RUNTIME / NOT_CANONICAL_MESR_IMPLEMENTATION
import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { canonical,hash,evaluate,compose,cmp,VERSION } from "./b09/reference.mjs";
import { observe } from "./b09/runtime-observer.mjs";
const root=fileURLToPath(new URL("../",import.meta.url)),dir=root+"tests/fixtures/experiment-3-repaired/";
const read=p=>fs.readFileSync(p,"utf8").replace(/^\uFEFF/,"");
const basis=JSON.parse(read(dir+"basis.v0.2.json")),fixtures=JSON.parse(read(dir+"cases.v0.2.json")),oracle=JSON.parse(read(dir+"oracle.v0.2.json"));
assert.equal(process.version,basis.runtime.node,"Pinned observation runtime required");
assert.equal(VERSION,oracle.method.version);
assert.equal(hash(read(root+"scripts/b09/reference.mjs")),oracle.method.digest,"Frozen evaluator changed: explicit oracle revision required");
assert.equal(hash(basis),oracle.basis_digest);
for(const f of fixtures)assert.equal(hash(f.input),oracle.fixture_input_digests[f.case_id],"FROZEN_INPUT_CHANGED:"+f.case_id);
assert.equal(fixtures.length,new Set(fixtures.map(f=>f.case_id)).size);
for(const pin of basis.source_inventory)assert.equal(hash(read(root+pin.path)),pin.digest,"FROZEN_SOURCE_CHANGED:"+pin.path);
for(const [prefix,count]of [["I",18],["S",13],["T",27],["C",27]])for(let i=1;i<=count;i++)assert.ok(fixtures.some(f=>f.contract_basis.case===prefix+String(i).padStart(2,"0")),prefix+i);
for(const id of ["N01","N02","N03","N04","N05","N06a","N06b",...Array.from({length:12},(_,i)=>"N"+String(i+7).padStart(2,"0"))])assert.ok(fixtures.some(f=>f.contract_basis.case===id),id);
function comparable(r){return r.claims?{claims:r.claims.map(({claim,path,state,missing_bindings,nonclaims,diagnostics})=>({claim,path,state,missing_bindings,nonclaims,diagnostics})),automatic_equivalences:r.automatic_equivalences,name_only_aliases:r.name_only_aliases,canonical_closure:r.canonical_closure}:r;}
const results=[],failures=[];
for(const f of fixtures){
 try{
  const before=canonical(f.input),r=evaluate(f.input,basis);
  assert.deepEqual(comparable(r),oracle.cases[f.case_id]);
  assert.equal(canonical(f.input),before,"Reference mutated fixture");
  assert.equal(canonical(evaluate(f.input,basis)),canonical(r),"Replay mismatch");
  const p=structuredClone(f.input);
  if(p.kind==="composition"){p.modules.reverse();p.lock.reverse();p.relations.reverse();}
  else{p.requests.reverse();p.bindings.evidence_refs?.reverse();}
  assert.equal(canonical(evaluate(p,basis)),canonical(r),"Permutation mismatch");
  results.push({case_id:f.case_id,reference:r});
 }catch(e){failures.push({case_id:f.case_id,error:e.message});}
}
if(failures.length){console.error(JSON.stringify(failures,null,2));process.exit(1);}

// Finite noninterference obligations over every pinned Core entry, not a conformance flag.
const completeFixture=fixtures.find(f=>f.case_id==="I10").input;
const compositionControl=fixtures.find(f=>f.case_id==="C01").input;
const admitted=compose(compositionControl,basis);
let noninterferenceProbes=0;
for(const entry of basis.entries){
 const input=structuredClone(completeFixture);
 input.requests=[{path:"generic",claim:entry.supports[0],semantic_ids:[entry.semantic_id],semantic_version:entry.version,required_bindings:[]}];
 const base=evaluate(input,basis);
 const contextual=evaluate(input,{...basis,entries:admitted.semantic_entries});
 assert.deepEqual(contextual,base,"Additive context changed Core claim");
 noninterferenceProbes++;
 for(const binding of entry.required_bindings)for(const value of [null,"",[],false]){
   const probe=structuredClone(input);
   probe.bindings[binding]=value;
   const a=evaluate(probe,basis),b=evaluate(probe,{...basis,entries:admitted.semantic_entries});
   assert.deepEqual(a,b,"Context weakened a binding");
   if(value!==false)assert.ok(a.claims[0].missing_bindings.includes(binding),binding);
   noninterferenceProbes++;
 }
 for(const nonclaim of entry.does_not_support){
   const probe=structuredClone(input);probe.requests[0].claim=nonclaim;probe.caller_supported_claim_parts=[nonclaim];
   const a=evaluate(probe,basis),b=evaluate(probe,{...basis,entries:admitted.semantic_entries});
   assert.deepEqual(a,b);assert.equal(a.claims[0].state,"UNSUPPORTED");
   assert.ok(a.claims[0].nonclaims.includes(nonclaim));
   noninterferenceProbes++;
 }
}
const orderControl=structuredClone(compositionControl);
for(let i=0;i<orderControl.modules.length;i++){
 orderControl.modules.push(orderControl.modules.shift());
 assert.deepEqual(compose(orderControl,basis),admitted);
}
// Oracle and results are compared, never fed as evaluator inputs.
const corruptedOracle=structuredClone(oracle.cases.N01);
corruptedOracle.claims[0].state="SUPPORTED";
assert.throws(()=>assert.deepEqual(comparable(evaluate(fixtures.find(f=>f.case_id==="N01").input,basis)),corruptedOracle));
const forged=structuredClone(fixtures.find(f=>f.case_id==="N08").input);
forged.predicates.verification_executed="presence";
assert.equal(evaluate(forged,basis).claims[0].state,"UNRESOLVED");
const absentRef=structuredClone(completeFixture);delete absentRef.evidence_ledger["fixture:test-output"];
assert.ok(evaluate(absentRef,basis).claims.some(c=>c.missing_bindings.includes("evidence_ref:fixture:test-output")));


if(process.argv.includes("--reference-only")){console.log("REFERENCE PASS",results.length);process.exit(0);}
const totals=Object.fromEntries(["CONFORMS_TODAY","PARTIAL_CONFORMANCE","EXPECTED_GAP","UNEXPECTED_REGRESSION","NOT_APPLICABLE_TO_CURRENT_RUNTIME"].map(k=>[k,0]));
for(const row of results){
 const f=fixtures.find(f=>f.case_id===row.case_id);
 let actual; try { actual=JSON.parse(JSON.stringify(observe(f))); } catch(error) { throw new Error(row.case_id+": "+error.message,{cause:error}); }
 if(!actual.classification){
  if(f.input.kind==="composition"){
   actual.classification=actual.raw_output.status===row.reference.status?(f.runtime_expectation==="PARTIAL_CONFORMANCE"?"PARTIAL_CONFORMANCE":"CONFORMS_TODAY"):"EXPECTED_GAP";
   actual.gap_ids=actual.classification==="EXPECTED_GAP"||actual.classification==="PARTIAL_CONFORMANCE"?["G08"]:[];
  }else{
   const paths=f.input.requests.map(q=>q.path);
   const repairOnly=paths.some(p=>["sufficiency","current","authority","acceptance","integrity","custody","independence"].includes(p));
   const mesrMismatch=actual.mesr.some(m=>{
     const r=row.reference.claims.find(c=>c.claim===m.claim&&c.path===m.path);
     const expectedRelation={SUPPORTED:"supports",UNSUPPORTED:"does_not_support",UNRESOLVED:"indeterminate",CONFLICTED:"contradicts",INCONCLUSIVE:"indeterminate",STALE:"indeterminate"}[r.state];
     return m.raw_output.relation!==expectedRelation;
   });
   actual.classification=repairOnly||mesrMismatch?"EXPECTED_GAP":paths.every(p=>p==="collision")?"CONFORMS_TODAY":"PARTIAL_CONFORMANCE";
   actual.gap_ids=[...(mesrMismatch?["G02"]:[]),...(paths.some(p=>["pass","occurred","independence","integrity","custody"].includes(p))?["G05"]:[]),...(paths.includes("sufficiency")?["G06"]:[]),...(paths.some(p=>["current","authority","acceptance"].includes(p))?["G07"]:[]),...(f.input.harness_missing_facts?["G03"]:[])];
  }
 }
 actual.classification_basis="Measured legacy subset compared with oracle; expected gaps localized against frozen B02/B03/B05/B06/B07/B08 source debt. Matching enum alone is never repaired conformance.";
 totals[actual.classification]++;
 row.current_runtime_observation=actual;
}
const byId=id=>results.find(r=>r.case_id===id).reference;
assert.deepEqual(comparable(byId("E3-A.ci")),comparable(byId("E3-A.harness_style")));
assert.equal(byId("I08").canonical_closure.status,"REJECTED");
assert.equal(byId("E3-A.actual_harness_gaps").canonical_closure.status,"MISSING_FACTS");
assert.ok(byId("E3-A.ci").claims.some(c=>c.detail.result_annotation==="SUPPORTED_BY_PRODUCER_ASSERTION"));
assert.notEqual(byId("E3-A.ci").claims[0].provenance.producer,byId("E3-A.harness_style").claims[0].provenance.producer);
for(const f of fixtures.filter(f=>f.case_id.startsWith("E3-C.")))assert.ok(byId(f.case_id).claims.every(c=>c.state!=="SUPPORTED"));
for(const r of results.filter(r=>r.reference.status==="INVALID_COMPOSITION"))for(const key of ["semantic_entries","mappings","profiles"])assert.deepEqual(r.reference[key],[]);
const runtimeSnapshot=Object.fromEntries(results.map(r=>[r.case_id,hash(r.current_runtime_observation)]));
const snapshotPath=dir+"runtime-observation-baseline.v0.2.json";
if(process.argv.includes("--capture-observation")){
 if(fs.existsSync(snapshotPath))throw Error("Refusing to overwrite existing runtime observation baseline");
 fs.writeFileSync(snapshotPath,JSON.stringify(runtimeSnapshot,null,2)+"\n");
}else{
 const frozen=JSON.parse(read(snapshotPath));
 for(const [id,value]of Object.entries(runtimeSnapshot))assert.equal(value,frozen[id],"UNEXPECTED_REGRESSION:"+id);
}
// Source-backed spot assertions prevent classifying accidental adapter mistakes as expected gaps.
const observation=id=>results.find(r=>r.case_id===id).current_runtime_observation;
assert.equal(observation("N03").mesr[0].raw_output.relation,"supports");
assert.equal(observation("N15").mesr[0].raw_output.relation,"does_not_support");
assert.ok(observation("N15").mesr[0].raw_output.claim_boundaries_applied.includes("CB-22"));
assert.equal(observation("N01").eak.raw_output.verifications.length,0);
assert.ok(observation("I05.failed").eak.raw_output.evidence_items.some(e=>e.evidence_item_id.endsWith("external_assurance")&&e.independence_posture==="independently_verified"&&e.verification_posture==="not_verified"));
assert.equal(observation("S01").report.before.report.verdict.value,"allow");
assert.equal(observation("S10").report.before.report.verdict.value,"require_review");
assert.equal(observation("N16.block").report.before.report.verdict.value,"block");
assert.equal(observation("T25.equal").report.coverage.reason_codes.includes("TIME_WINDOW_EXPIRED"),false);
assert.equal(observation("T25.earlier").report.coverage.reason_codes.includes("TIME_WINDOW_EXPIRED"),true);
const hashes={runtime_observer:hash(read(root+"scripts/b09/runtime-observer.mjs")),validator:hash(read(root+"scripts/verify_v8_b09_repaired_experiment_3.mjs")),oracle:hash(read(dir+"oracle.v0.2.json")),fixture_set:hash({basis:hash(read(dir+"basis.v0.2.json")),cases:hash(read(dir+"cases.v0.2.json"))}),reference_evaluator:hash(read(root+"scripts/b09/reference.mjs")),runtime_observation:hash(runtimeSnapshot)};
const output={oracle_version:oracle.oracle_version,input_set_id:basis.input_set_id,evaluation_time:oracle.evaluation_time,hashes,fixture_count:fixtures.length,noninterference_probes:noninterferenceProbes,oracle_result:"PASS",reference_evaluator_result:"PASS",current_runtime_observation_totals:totals,specification_conflicts:[],unexpected_regressions:[],results};
const bytes=canonical(output)+"\n",resultHash=hash(bytes);
if(process.argv.includes("--write-results"))fs.writeFileSync(dir+"results.v0.2.json",bytes);
else assert.equal(hash(read(dir+"results.v0.2.json")),resultHash,"Result replay differs");
const freezePath=dir+"freeze.v0.2.json";
if(fs.existsSync(freezePath)){
 const freeze=JSON.parse(read(freezePath));
 for(const pin of freeze.files)assert.equal(hash(fs.readFileSync(root+pin.path)),pin.sha256,"FREEZE_MISMATCH:"+pin.path);
}
console.log(JSON.stringify({fixture_count:fixtures.length,hashes:{...hashes,result:resultHash},totals,decision:totals.EXPECTED_GAP?"V8_B09_REPAIRED_EXPERIMENT_3_PASS_WITH_IMPLEMENTATION_GAPS":"V8_B09_REPAIRED_EXPERIMENT_3_PASS"},null,2));

