// VALIDATION_ONLY_REFERENCE_EVALUATOR / NOT_PRODUCT_RUNTIME / NOT_CANONICAL_MESR_IMPLEMENTATION
// Final B09 acceptance: preserved oracle + explicit malformed-input admission extension.
import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { canonical,hash,evaluate } from "./b09/reference.mjs";
import { evaluateAdmitted,ADMISSION_VERSION } from "./b09/input-admission.mjs";
import { observe } from "./b09/runtime-observer.mjs";
const root=fileURLToPath(new URL("../",import.meta.url)),dir=root+"tests/fixtures/experiment-3-repaired/";
const read=p=>fs.readFileSync(p,"utf8").replace(/^\uFEFF/,""),json=p=>JSON.parse(read(dir+p));
const basis=json("basis.v0.2.json"),fixtures=json("cases.v0.2.json"),oracle=json("oracle.v0.2.json"),checkpoint=json("recovery-checkpoint.v0.1.json"),baseResults=json("results.v0.2.json");
const hardening=json("admission-hardening.v0.1.json"),baseline=json("runtime-observation-baseline.v0.2.json");
assert.equal(process.version,basis.runtime.node);
for(const row of checkpoint.files)if(row.classification==="COMPLETE_VALID"||row.path.endsWith("/reference.mjs"))assert.equal(hash(fs.readFileSync(root+row.path)),row.sha256,"RECOVERY_IMMUTABILITY:"+row.path);
assert.equal(hash(read(root+"scripts/b09/reference.mjs")),oracle.method.digest);
assert.equal(hash(basis),oracle.basis_digest);
for(const row of basis.source_inventory)assert.equal(hash(read(root+row.path)),row.digest,"UNEXPECTED_REGRESSION: frozen source "+row.path);
function subset(r){if(!r.claims)return r;return {claims:r.claims.map(({claim,path,state,missing_bindings,nonclaims,diagnostics})=>({claim,path,state,missing_bindings,nonclaims,diagnostics})),automatic_equivalences:r.automatic_equivalences,name_only_aliases:r.name_only_aliases,canonical_closure:r.canonical_closure};}
const counts={PASS:0,FAIL:0,ERROR:0,SKIPPED:0};
const runtimeTotals=Object.fromEntries(["CONFORMS_TODAY","PARTIAL_CONFORMANCE","EXPECTED_GAP","UNEXPECTED_REGRESSION","NOT_APPLICABLE_TO_CURRENT_RUNTIME"].map(k=>[k,0]));
const results=[];
for(const f of fixtures){
 try{
  assert.equal(hash(f.input),oracle.fixture_input_digests[f.case_id]);
  const before=canonical(f.input),output=evaluateAdmitted(f.input,basis);
  // The original three shape-rejection cases gain admission diagnostics; existing semantic result stays identical.
  const coreOutput=structuredClone(output);delete coreOutput.input_validation;
  assert.deepEqual(subset(coreOutput),oracle.cases[f.case_id]);
  assert.equal(canonical(f.input),before);
  const replay=evaluateAdmitted(f.input,basis);assert.deepEqual(replay,output);
  const permutation=structuredClone(f.input);
  if(permutation.kind==="composition"){permutation.modules.reverse();permutation.lock.reverse();permutation.relations.reverse();}
  else{permutation.requests.reverse();permutation.bindings.evidence_refs?.reverse();}
  const perm=evaluateAdmitted(permutation,basis);
  // Structural positions in rejection diagnostics identify the submitted order; semantics remain atomic.
  if(!output.input_validation)assert.deepEqual(perm,output);
  else{assert.equal(perm.status,output.status);for(const key of ["semantic_entries","mappings","profiles"])assert.deepEqual(perm[key],[]);}
  const previous=baseResults.results.find(r=>r.case_id===f.case_id).current_runtime_observation;
  const live=JSON.parse(JSON.stringify(observe(f)));
  const recorded=structuredClone(previous);
  for(const k of ["classification_basis","classification","gap_ids"])if(!(k in live))delete recorded[k];
  assert.deepEqual(live,recorded,"UNEXPECTED_REGRESSION:"+f.case_id);
  assert.equal(hash(previous),baseline[f.case_id]);
  const observation=baseline._observations?.find(r=>r.case_id===f.case_id);
  assert.ok(observation,"Missing reviewed observation row");
  assert.equal(observation.classification,previous.classification);
  assert.ok(["applicable_current_surface","observed_result","oracle_expected_result","source","notes"].every(k=>k in observation));
  runtimeTotals[previous.classification]++;
  counts.PASS++;
  results.push({case_id:f.case_id,outcome:"PASS",reference_output:output,current_runtime_observation:observation});
 }catch(e){const outcome=e instanceof assert.AssertionError?"FAIL":"ERROR";counts[outcome]++;results.push({case_id:f.case_id,outcome,message:e.message});}
}
function materialize(h){
 let input=structuredClone(fixtures.find(f=>f.case_id===h.base_case_id).input);
 for(const op of h.mutations){
  if(op.path.length===0){input=structuredClone(op.value);continue;}
  let target=input;
  for(const key of op.path.slice(0,-1))target=target[key];
  if(op.op==="remove")delete target[op.path.at(-1)];else target[op.path.at(-1)]=structuredClone(op.value);
 }
 return input;
}
for(const h of hardening.cases){
 try{
  const input=materialize(h);
  assert.equal(hash(input),h.input_sha256);
  const before=canonical(input),output=evaluateAdmitted(input,basis);
  assert.equal(canonical(input),before);
  assert.deepEqual(evaluateAdmitted(input,basis),output);
  if(h.expected.status){
   assert.equal(output.status,h.expected.status);
   assert.equal(output.input_validation.status,"REJECTED");
   assert.ok(output.input_validation.issues.length>0);
   if(output.status==="INVALID_COMPOSITION")for(const key of ["semantic_entries","mappings","profiles"])assert.deepEqual(output[key],[]);
   else assert.deepEqual(output.claims,[]);
  }else{
   assert.ok(output.claims.length>0);assert.ok(output.claims.every(c=>c.state==="UNRESOLVED"));
   assert.ok(output.claims.every(c=>c.missing_bindings.includes(h.expected.missing_binding)));
  }
  counts.PASS++;runtimeTotals.NOT_APPLICABLE_TO_CURRENT_RUNTIME++;
  results.push({case_id:h.case_id,outcome:"PASS",reference_output:output,current_runtime_observation:{case_id:h.case_id,applicable_current_surface:"B09 validation-only input admission",observed_result:"No product call: malformed supplemental envelope is outside the current typed API.",oracle_expected_result:h.expected,classification:"NOT_APPLICABLE_TO_CURRENT_RUNTIME",source:"scripts/b09/input-admission.mjs",notes:"This is an executed rejection/UNRESOLVED test, not a skipped reference test. No production guarantee inferred."}});
 }catch(e){const outcome=e instanceof assert.AssertionError?"FAIL":"ERROR";counts[outcome]++;results.push({case_id:h.case_id,outcome,message:e.message});}
}
if(counts.FAIL||counts.ERROR){console.error(JSON.stringify({counts,failures:results.filter(r=>r.outcome!=="PASS")},null,2));process.exit(1);}
assert.equal(fixtures.length,172);
const summary={
 schema_version:"b09-final-acceptance/0.2",oracle_version:oracle.oracle_version,fixture_set_version:basis.input_set_id,
 admission_contract:"b09-admission-hardening/"+ADMISSION_VERSION,
 hashes:{oracle:hash(read(dir+"oracle.v0.2.json")),fixture_set:baseResults.hashes.fixture_set,reference_evaluator:oracle.method.digest,
  admission_evaluator:hash(read(root+"scripts/b09/input-admission.mjs")),hardening_fixtures:hash(read(dir+"admission-hardening.v0.1.json")),
  validator:hash(read(root+"scripts/verify_v8_b09_acceptance_resume.mjs")),base_result:hash(read(dir+"results.v0.2.json")),runtime_observation:hash(read(dir+"runtime-observation-baseline.v0.2.json"))},
 counts:{total:fixtures.length+hardening.cases.length,base_cases:fixtures.length,hardening_cases:hardening.cases.length,...counts,core_noninterference_probes:baseResults.noninterference_probes},
 current_runtime_observation_totals:runtimeTotals,specification_conflicts:[],unexpected_regressions:[],
 decision:"V8_B09_REPAIRED_EXPERIMENT_3_PASS_WITH_IMPLEMENTATION_GAPS",results
};
const bytes=canonical(summary)+"\n",resultHash=hash(bytes);
if(process.argv.includes("--write-results"))fs.writeFileSync(dir+"acceptance-results.v0.2.json",bytes);
else assert.equal(hash(read(dir+"acceptance-results.v0.2.json")),resultHash,"FINAL_REPLAY_MISMATCH");
if(fs.existsSync(dir+"freeze.v0.2.json"))for(const pin of json("freeze.v0.2.json").files)assert.equal(hash(fs.readFileSync(root+pin.path)),pin.sha256,"FREEZE_MISMATCH:"+pin.path);
console.log(JSON.stringify({counts:summary.counts,hashes:{...summary.hashes,result:resultHash},totals:runtimeTotals,decision:summary.decision},null,2));

