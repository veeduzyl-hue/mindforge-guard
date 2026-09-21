// Test-side data translation only. No reference evaluator or expected output imports.
import fs from "node:fs";
import { createHash } from "node:crypto";
export const frozenDir = "tests/fixtures/experiment-3-repaired/";
export const readJson = path => JSON.parse(fs.readFileSync(path, "utf8"));
export function canonical(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
}
export const digest = value => createHash("sha256").update(typeof value === "string" || Buffer.isBuffer(value) ? value : canonical(value)).digest("hex");
export const baseIds = ["C01", "C02", "C05", "C06.registry", "C07", "C20.producer", "C20.consumer", "C20.malformed", "C21.>=0.1.0", "C21.latest", "C21.0.1.0-rc.1", "C21.01.1.0", "C22.array", "C22.raw", "C27"];
export const hardeningIds = Array.from({ length: 35 }, (_, i) => `H${String(i + 1).padStart(2, "0")}`);
export const caseIds = [...baseIds, ...hardeningIds];
export function loadInputs() {
  const fixtures = readJson(frozenDir + "cases.v0.2.json");
  const hardening = readJson(frozenDir + "admission-hardening.v0.1.json");
  const rows = baseIds.map(id => {
    const matches = fixtures.filter(row => row.case_id === id);
    if (matches.length !== 1) throw new Error(`Missing/duplicate input: ${id}`);
    return structuredClone(matches[0]);
  });
  for (const id of hardeningIds) {
    const matches = hardening.cases.filter(row => row.case_id === id);
    if (matches.length !== 1) throw new Error(`Missing/duplicate hardening: ${id}`);
    const h = matches[0];
    const bases = fixtures.filter(row => row.case_id === h.base_case_id);
    if (bases.length !== 1) throw new Error(`Missing/duplicate base: ${id}`);
    let input = structuredClone(bases[0].input);
    for (const op of h.mutations) {
      if (!["replace", "remove"].includes(op.op)) throw new Error("Unsupported mutation");
      if (!op.path.length) { input = structuredClone(op.value); continue; }
      let parent = input;
      for (const key of op.path.slice(0, -1)) parent = parent[key];
      if (op.op === "remove") delete parent[op.path.at(-1)];
      else parent[op.path.at(-1)] = structuredClone(op.value);
    }
    if (digest(input) !== h.input_sha256) throw new Error(`Mutation drift: ${id}`);
    rows.push({ case_id: id, input });
  }
  return rows;
}

// The caller supplies this separately from untrusted evidence. Its digest and source
// are recorded in the evidence envelope. This is finite test context, not general
// contextual semantic admission. Only current product Core owns canonical meaning.
export function testTrust() {
  const basis = readJson(frozenDir + "basis.v0.2.json");
  return {
    proof: structuredClone(basis.admission_basis),
    proof_digest: digest(basis.admission_basis),
    proof_ref: `${frozenDir}basis.v0.2.json#admission_basis`,
    registry: structuredClone(basis.registry),
    modules: structuredClone(basis.modules),
    request_paths: ["pass", "occurred", "independence", "producer_inference", "observation_inference", "integrity", "custody", "sufficiency", "current", "authority", "old_authority_inference", "acceptance", "decision", "action", "presence", "generic", "weakening_inference", "collision"],
  };
}

// T1-02 translation preserves original claim inputs and exact H mutations.
export const t102CaseIds = ["N03", "N04", "N07", "N08", "N09", "N08.predicate_override", "I10.unresolved_ref", "N18", "H08", "H28", "H29", "control.generic", "control.caller_added"];
export function loadRequirementInputs() {
  const fixtures = readJson(frozenDir + "cases.v0.2.json");
  const h = loadInputs();
  const rows = t102CaseIds.filter(id => !id.startsWith("control.")).map(id => {
    const found = (id.startsWith("H") ? h : fixtures).filter(row => row.case_id === id);
    if (found.length !== 1) throw new Error("Missing/duplicate T1-02 input: " + id);
    return { case_id: id, input: structuredClone(found[0].input) };
  });
  const positive = structuredClone(fixtures.find(row => row.case_id === "N04").input);
  positive.requests[0].claim = "evidence_presence";
  delete positive.caller_supported_claim_parts;
  rows.push({ case_id: "control.generic", input: positive });
  const added = structuredClone(positive);
  added.requests[0].required_bindings = ["witnesses"];
  rows.push({ case_id: "control.caller_added", input: added });
  return rows;
}
export function requirementCoreInput() {
  const input = structuredClone(loadInputs().find(row => row.case_id === "C01").input);
  input.modules = input.modules.filter(row => row.module_id === "mesr.core");
  input.lock = input.lock.filter(row => row.module_id === "mesr.core");
  input.raw_manifests = { "mesr.core": input.raw_manifests["mesr.core"] };
  return input;
}

// T1-03 passes frozen N/E3-C inputs unchanged; no expected states enter input.
export function loadStateInputs() {
  const rows = readJson(frozenDir + "cases.v0.2.json").filter(row => row.case_id.startsWith("N") || row.case_id.startsWith("E3-C."));
  if (new Set(rows.map(row => row.case_id)).size !== rows.length) throw new Error("Duplicate T1-03 cases");
  return structuredClone(rows.map(({ case_id, input }) => ({ case_id, input })));
}

// T1-04 finite composition inputs remain byte/content-identical to frozen cases.
export const t104HardeningIds = ["H22", "H23", "H24", "H25", "H31"];
export function loadCompositionInputs() {
  const rows = readJson(frozenDir + "cases.v0.2.json").filter(row => row.case_id.startsWith("C"));
  if (rows.length !== 41 || new Set(rows.map(row => row.case_id)).size !== rows.length) throw new Error("T1-04 C inventory drift");
  const hardening = loadInputs().filter(row => t104HardeningIds.includes(row.case_id));
  return structuredClone([...rows, ...hardening].map(({ case_id, input }) => ({ case_id, input })));
}
export function loadCoreProbes() {
  const basis = readJson(frozenDir + "basis.v0.2.json");
  const complete = readJson(frozenDir + "cases.v0.2.json").find(row => row.case_id === "I10").input;
  const probes = [];
  for (const entry of basis.entries) {
    const input = structuredClone(complete);
    input.requests = [{ path: "generic", claim: entry.supports[0], semantic_ids: [entry.semantic_id], semantic_version: entry.version, required_bindings: [] }];
    probes.push({ id: entry.semantic_id + ":base", facet: "base", input });
    for (const binding of entry.required_bindings) for (const value of [null, "", [], false]) {
      const probe = structuredClone(input); probe.bindings[binding] = value;
      probes.push({ id: entry.semantic_id + ":" + binding + ":" + JSON.stringify(value), facet: "binding", binding, input: probe });
    }
    for (const nonclaim of entry.does_not_support) {
      const probe = structuredClone(input); probe.requests[0].claim = nonclaim; probe.caller_supported_claim_parts = [nonclaim];
      probes.push({ id: entry.semantic_id + ":nonclaim:" + nonclaim, facet: "nonclaim", nonclaim, input: probe });
    }
  }
  if (probes.length !== 603 || new Set(probes.map(p => p.id)).size !== 603) throw new Error("T1-04 probe inventory drift");
  return probes;
}

export function compositionTrust() {
  const basis = readJson(frozenDir + "basis.v0.2.json");
  // Frozen vocabulary-role identifiers, not inferred semantic equivalences.
  return { ...testTrust(), context_versions: structuredClone(basis.context_versions), context_modules: {
    core: "mesr.core", software: "mesr.module.software.v0_1", crosswalk: "mesr.xw.test_nist_like.v0_1"
  } };
}

// T2-01: literal accepted planning declarations; not observed Harness checks.
export function loadVerificationEventInputs() {
  const baseline=readJson("tests/fixtures/gate1/t2-01-controls.v0.1.json"),literals=baseline.witnesses.map(r=>r.input),rows=[];
  const no="NO_ATTRIBUTABLE_OCCURRENCE",unresolved="ATTRIBUTABLE_OCCURRENCE_RESULT_UNRESOLVED",full="ATTRIBUTABLE_OCCURRENCE_WITH_RESULT";
  const add=(id,input,annotation)=>rows.push({case_id:id,input,expected_annotation:annotation});
  const mutate=(id,fn,annotation=unresolved)=>{const x=structuredClone(literals[0]);fn(x);add(id,x,annotation);};
  literals.forEach((x,i)=>add("W0"+(i+1),structuredClone(x),i<3?full:unresolved));
  const occurrence=structuredClone(literals[3]);occurrence.requested_dimension="occurrence";add("W04o",occurrence,"ATTRIBUTABLE_OCCURRENCE");
  const removals={W05:["w:event","event_id",no],W06:["w:event","subject",no],W07:["w:event","scope",no],W08a:["w:event","method",no],W08b:["w:event","method_version",no],W09:["w:event","event_time",no],W10:["w:result","criterion",unresolved],W11:["w:result","event_ref",unresolved],W17:["w:result","result",unresolved],W18:["w:result","limitations",unresolved],W19:["w:event","verifier",no],W22:["w:event","source_namespace",no],W23:["w:event","checked_property",no],W24:["w:event","revision",no]};
  for(const [id,[ref,field,annotation]] of Object.entries(removals))mutate(id,x=>{delete x.records[ref][field];},annotation);
  for(const [k,v] of [["revision","revision-b"],["scope","other-case"],["event_time","2026-09-18T11:00:00Z"]])mutate("W12."+k,x=>{x.records["w:result"][k]=v;});
  const conflict=structuredClone(literals[0]);conflict.result_refs=["w:result-pass","w:result-fail"];conflict.records["w:event"].output_refs=["w:output-pass","w:output-fail"];
  for(const [i,suffix] of [[0,"pass"],[1,"fail"]])for(const kind of ["result","output"]){const ref="w:"+kind+"-"+suffix,r=structuredClone(literals[i].records["w:"+kind]);r.source_ref=ref;if(kind==="result")r.output_ref="w:output-"+suffix;conflict.records[ref]=r;}
  delete conflict.records["w:result"];delete conflict.records["w:output"];add("W13",conflict,unresolved);
  for(const [id,r] of [["W14",{kind:"command_result",event_id:"command-17",exit_code:0}],["W15",{passed:8,failed:0,paths:["reports/tests.json"]}],["W16",{producer:"sample-ci/1.0",verified:true,status:"passed"}]])mutate(id,x=>{delete x.occurrence_ref;x.result_refs=[];x.records={assertion:r};},no);
  mutate("W20",x=>{delete x.records["w:input"];});mutate("W21",x=>{delete x.records["w:output"];},no);mutate("W25",x=>{x.records["w:result"].source_namespace="other-producer";});
  for(const [ref,r] of Object.entries(literals[0].records))for(const field of Object.keys(r).filter(k=>k!=="content")){
    const resultOnly=ref==="w:result"||ref==="w:input"||(ref==="w:output"&&["input_ref","criterion","result","limitations"].includes(field));
    for(const [variant,value] of [["absent",undefined],["null",null],["empty",""],["whitespace","  "],["wrong-type",42]])mutate(`field.${ref}.${field}.${variant}`,x=>{if(variant==="absent")delete x.records[ref][field];else x.records[ref][field]=value;},resultOnly?unresolved:no);
  }
  for(const ref of ["w:input","w:output"])mutate("missing-content."+ref,x=>{delete x.records[ref].content;},ref==="w:input"?unresolved:no);
  for(const ref of ["w:result","w:output","w:input"])for(const field of ["source_namespace","source_ref","subject","revision","scope",...(ref==="w:input"?[]:["event_id","checked_property","method","method_version","event_time"])])mutate(`mismatch.${ref}.${field}`,x=>{x.records[ref][field]=field==="event_time"?"2026-09-18T11:00:00Z":"different";},ref==="w:output"?no:unresolved);
  for(const field of ["producer","verifier","event_ref","input_ref","output_ref","criterion","limitations","result"])mutate("result-mismatch."+field,x=>{x.records["w:result"][field]="different";});
  mutate("result.not_run",x=>{x.records["w:result"].result="not_run";});mutate("result.missing-selection",x=>{delete x.result_refs;});mutate("result.empty-selection",x=>{x.result_refs=[];});
  mutate("duplicate-native-identity",x=>{const r=structuredClone(x.records["w:event"]);r.source_ref="w:duplicate";r.revision="different";x.records["w:duplicate"]=r;},no);
  mutate("mixed-valid-invalid-results",x=>{x.result_refs.push("w:missing");});
  for(const k of ["subject","revision","scope"])mutate("target."+k,x=>{delete x.target[k];},null);
  mutate("envelope.unknown",x=>{x.caller_positive=true;},null);mutate("target.unknown",x=>{x.target.extra=true;},null);
  mutate("result.duplicate-ref",x=>{x.result_refs.push("w:result");});mutate("event.invalid-time",x=>{x.records["w:event"].event_time="2026-09-18T10:00:00";},no);
  for(const observation of baseline.observations){
    // No absent native namespace, event or output association is invented.
    const input={contract_version:literals[0].contract_version,requested_dimension:"occurrence_and_result",target:Object.fromEntries(["subject","revision","scope"].filter(k=>Object.hasOwn(observation.input,k)).map(k=>[k,observation.input[k]])),records:{frozen_source:structuredClone(observation.input)}};
    add(observation.case_id,input,no);
  }
  if(new Set(rows.map(r=>r.case_id)).size!==rows.length)throw new Error("Duplicate T2-01 case");return rows;
}

// T2-02: new supplied records stay separate from frozen B09 evidence.
export function loadIntegrityInputs() { return structuredClone(readJson("tests/fixtures/gate1/t2-02-controls.v0.1.json").cases); }

// T2-03: explicit NEW supplemental witnesses only; no frozen input enrichment.
export function loadIndependenceInputs() {
  const controls = readJson("tests/fixtures/gate1/t2-03-controls.v0.1.json");
  return controls.cases.map(row => {
    const input = structuredClone(controls.supplemental_input);
    for (const operation of row.operations) {
      const keys = [...operation.path], key = keys.pop();
      const parent = keys.reduce((value, part) => value[part], input);
      if (operation.op === "delete") delete parent[key];
      else if (operation.op === "set") parent[key] = structuredClone(operation.value);
      else throw new Error("Unknown declarative T2-03 operation");
    }
    return { ...row, input };
  });
}

// T2-04 NEW task-specific evidence only; frozen translators above stay exact.
export function loadTemporalInputs() {
  const controls=readJson('tests/fixtures/gate1/t2-04-controls.v0.1.json');
  return controls.cases.map(row=>{
    const input=structuredClone(controls.supplemental_input);
    for(const operation of row.operations){
      const keys=[...operation.path],key=keys.pop(),parent=keys.reduce((value,part)=>value[part],input);
      if(operation.op==='delete')delete parent[key];
      else if(operation.op==='set')parent[key]=structuredClone(operation.value);
      else throw new Error('Unknown declarative T2-04 operation');
    }
    return {...row,input};
  });
}

// T2-05: declarative supplemental inputs; no enrichment of frozen cases.
export function loadContinuityInputs() {
  const controls=readJson('tests/fixtures/gate1/t2-05-controls.v0.1.json');
  return controls.cases.map(row=>{
    const input=structuredClone(controls.supplemental_input);
    for(const op of row.operations){
      const keys=[...op.path],key=keys.pop(),parent=keys.reduce((v,k)=>v[k],input);
      if(op.op==='delete')delete parent[key];
      else if(op.op==='set')parent[key]=structuredClone(op.value);
      else throw new Error('Unknown declarative T2-05 operation');
    }
    return {...row,input};
  });
}

// T2-06 retained inputs: translation only; no assertion enters the product envelope.
export function t206Criteria() {
  const text=fs.readFileSync('docs/planning/v8-gate1-t2-06-private-profile-criteria-v0.1.md','utf8').replaceAll('\r\n','\n');
  const rules=text.split('<!-- PROFILE_RULES_BEGIN -->\n')[1].split('\n<!-- PROFILE_RULES_END -->')[0];
  const claim=JSON.parse(text.split('<!-- CLAIM_SET_CONTENT_BEGIN -->\n```json\n')[1].split('\n```')[0]);
  const profile={domain:'private.t2-06.profile-content/0.1',id:'private.t2-06.software-change-check-record',version:'0.1.0',claim_set_digest:{algorithm:'SHA-256',value:digest(claim)},rules_text:rules};
  return {profile:{content:profile,digest:digest(profile)},claim_set:{content:claim,digest:digest(claim)},method:{id:'private.t2-06.strict-requirement-materiality',version:'0.1.0',domain:'private.t2-06.method-rules/0.1',rules,digest:digest(canonical(rules))}};
}
export function loadSufficiencyInputs(){
  const controls=readJson('tests/fixtures/gate1/t2-06-controls.v0.1.json');
  return controls.cases.map(row=>{
    const supplied=structuredClone(controls.supplemental_input);
    for(const op of row.operations){
      const keys=[...op.path],key=keys.pop(),parent=keys.reduce((v,k)=>v[k],supplied);
      if(op.op==='delete')delete parent[key];else if(op.op==='set')parent[key]=structuredClone(op.value);else throw new Error('Unknown T2-06 operation');
    }
    return {...row,...supplied};
  });
}
