import assert from "node:assert/strict";
import { caseIds, readJson, frozenDir, digest } from "./b09-product-inputs.mjs";

export function expectations() {
  const oracle = readJson(frozenDir + "oracle.v0.2.json");
  const hardening = readJson(frozenDir + "admission-hardening.v0.1.json");
  return Object.fromEntries(caseIds.map(id => [id, id.startsWith("H")
    ? hardening.cases.find(row => row.case_id === id).expected : oracle.cases[id]]));
}
export function compare(row, result, expected) {
  assert.ok(expected, `Unmatched oracle: ${row.case_id}`);
  assert.equal(result.contract_version, "mesr-canonical-admission/0.1");
  assert.equal(result.semantic_composition, "WITHHELD");
  for (const key of ["semantic_entries", "mappings", "profiles", "claims"]) assert.deepEqual(result[key], []);
  const pending = row.case_id.startsWith("C") ? ["T1-04: complete semantic composition/noninterference"] : [];
  if (row.case_id === "C01") {
    assert.equal(expected.status, "VALID_COMPOSITION");
    assert.equal(result.status, "CHECKED_BASIS");
    assert.ok(result.checked_basis.modules.length > 0);
    assert.ok(result.checked_basis.admission_basis_refs[0].digest);
    assert.deepEqual(Object.keys(result.checked_basis).sort(), ["contract_version", "registry", "modules", "relation_ledger_ref", "admission_basis_refs", "validation_method", "input_set_id"].sort());
    assert.equal(result.checked_basis.contract_version, "mesr-composition-lock/0.1");
    assert.deepEqual(result.checked_basis.registry.version, row.input.registry.version);
    assert.deepEqual(result.checked_basis.registry.digest, row.input.registry.digest);
    assert.deepEqual(result.checked_basis.modules.map(m => m.module_id), row.input.modules.map(m => m.module_id));
    for (const checked of result.checked_basis.modules) {
      const locked = row.input.lock.find(m => m.module_id === checked.module_id);
      assert.equal(checked.byte_digest, locked.byte_digest);
      assert.equal(checked.byte_length, locked.byte_length);
      assert.equal(checked.semantic_content_digest, locked.content_digest);
      assert.deepEqual(checked.entries, expected.semantic_entries.filter(entry => entry.namespace === checked.namespace).map(entry => ({ semantic_id: entry.semantic_id, version: entry.version, digest: digest(entry) })));
    }
    return { asserted: ["identity/lock admission", "attribution", "composition withheld"], pending };
  }
  if (expected.status) {
    // REJECTED is the private admission result, not a legacy composition verdict.
    // It maps losslessly to oracle REJECTED / INVALID_COMPOSITION by input kind.
    assert.equal(result.status, "REJECTED");
    assert.equal(result.checked_basis, null);
    if (row.case_id.startsWith("C")) assert.deepEqual(result.diagnostics, expected.diagnostics);
    else assert.ok(result.input_issues.length > 0);
    return { asserted: ["rejection", "zero admitted outputs", ...(row.case_id.startsWith("C") ? ["all oracle diagnostic fields"] : ["structural issues"])], pending };
  }
  // Five H cases exercise later binding/state logic. Preserve their exact input;
  // acceptance of shape MUST NOT be called supportability or whole-case conformance.
  assert.equal(result.status, "CHECKED_INPUT_SHAPE");
  assert.equal(result.checked_basis, null);
  assert.deepEqual(result.input_issues, []);
  assert.equal(expected.state, "UNRESOLVED");
  pending.push(`T1-02/T1-03/Tranche 2: UNRESOLVED; missing ${expected.missing_binding}`);
  return { asserted: ["structural admission only", "no claim evaluation"], pending };
}
export function compareAll(rows, outputs, expected) {
  assert.deepEqual(rows.map(row => row.case_id), caseIds, "Dropped/duplicate/reordered input inventory");
  assert.deepEqual(Object.keys(outputs), caseIds, "Dropped/duplicate/unmatched result inventory");
  return rows.map(row => ({ case_id: row.case_id, ...compare(row, outputs[row.case_id], expected[row.case_id]) }));
}

// T1-02 comparisons own requirement/nonclaim facets, never six-state selection.
export function compareRequirements(rows, outputs, expected, ids) {
  assert.deepEqual(rows.map(row => row.case_id), ids);
  assert.deepEqual(Object.keys(outputs), ids, "Dropped/duplicate/unmatched T1-02 results");
  const item = ["evidence_id_or_ref", "producer_or_source", "provenance", "subject"];
  const verification = ["evidence_refs", "limitations", "method", "result", "scope", "subject", "verified_at", "verifier"];
  const observation = ["checked_property", "limitations", "method", "observed_time", "observer_or_source", "scope", "subject", "time", "verifier"];
  const assertions = [];
  for (const row of rows) {
    const result = outputs[row.case_id];
    assert.equal(result.status, "COLLECTED", row.case_id);
    assert.equal(result.state_evaluation, "PENDING_STATE_EVALUATION");
    assert.equal(result.semantic_composition, "WITHHELD");
    assert.equal(result.input_digest, digest(row.input));
    assert.equal(result.claims.length, row.input.requests.length);
    const oracle = expected[row.case_id];
    for (const claim of result.claims) {
      assert.ok(!Object.hasOwn(claim, "state"));
      assert.equal(claim.state_evaluation, "PENDING_STATE_EVALUATION");
      const request = row.input.requests.find(r => r.path === claim.path && r.claim === claim.claim);
      assert.ok(request);
      let required = row.case_id === "H08" ? ["claim_id", "evidence_refs", "predicate", "scope", "subject", "time"]
        : claim.path === "observation_inference" ? observation : claim.path === "generic" ? item : verification;
      required = [...new Set([...required, ...request.required_bindings])].sort();
      assert.deepEqual(claim.effective_requirements, required, row.case_id + ": exact binding union");
      assert.deepEqual(claim.bindings.map(r => r.binding), required);
      for (const binding of claim.bindings) {
        assert.equal(binding.present, Object.hasOwn(row.input.bindings, binding.binding));
        if (binding.present) assert.deepEqual(binding.value, row.input.bindings[binding.binding]);
        assert.ok(binding.predicates.length > 0 && binding.origins.length > 0);
        assert.equal(binding.association.subject, row.input.subject);
        assert.equal(binding.association.scope, row.input.scope);
        assert.equal(binding.association.evaluation_time, row.input.bindings.evaluation_time);
        assert.ok(binding.association.source_ref);
        for (const predicate of binding.predicates) {
          const name = binding.binding === "evidence_refs" || binding.binding === "witnesses" ? "nonempty_array"
            : binding.binding === "verification_executed" ? "true" : "nonempty_reference";
          assert.equal(predicate.predicate, name);
          assert.equal(predicate.defined, true);
          assert.equal(predicate.present, binding.present);
          const v = row.input.bindings[binding.binding];
          const valid = name === "true" ? v === true : name === "nonempty_array" ? Array.isArray(v) && v.length > 0 && v.every(x => typeof x === "string" && x.trim().length > 0) : typeof v === "string" && v.trim().length > 0;
          assert.equal(predicate.satisfied, binding.present && valid);
        }
      }
      let missing = [], nonclaims, prohibited = false;
      if (oracle?.claims) {
        const wanted = oracle.claims.find(r => r.path === claim.path && r.claim === claim.claim);
        assert.ok(wanted, "Missing original oracle assertion");
        missing = wanted.missing_bindings;
        nonclaims = wanted.nonclaims;
        prohibited = wanted.diagnostics.includes("INFERENCE_PROHIBITED");
        // B09 selects prohibition first. Collection also retains CB-07's missing
        // checked_property requirement; this does not rewrite that state oracle.
        if (claim.path === "observation_inference") missing = [...new Set([...missing, "checked_property"])].sort();
      } else if (oracle?.missing_binding) {
        missing = [oracle.missing_binding];
        nonclaims = row.case_id === "H08" ? ["claim_support_without_evidence", "claim_truth_without_evidence"] : ["approval", "execution_authority", "untested_properties"];
      } else {
        assert.ok(row.case_id.startsWith("control."));
        nonclaims = ["artifact_truth", "authority", "evidence_sufficiency"];
      }
      assert.deepEqual(claim.missing_bindings, missing, row.case_id + ": missing bindings");
      for (const binding of claim.bindings) assert.equal(binding.satisfied, !missing.includes(binding.binding), row.case_id + ": binding satisfaction");
      assert.ok(claim.nonclaim_provenance.every(n => typeof n.canonical_nonclaim === "string" && n.canonical_nonclaim.length > 0));
      assert.deepEqual(claim.nonclaims, nonclaims, row.case_id + ": nonclaims");
      assert.equal(claim.excluded_inferences.length > 0, prohibited);
      assert.deepEqual(claim.diagnostics, [...missing.map(key => "MISSING:" + key), ...(prohibited ? ["INFERENCE_PROHIBITED"] : [])].sort());
      assert.deepEqual(claim.unresolved_identities, row.case_id === "N09" ? [{ semantic_id: "mesr.core.unknown", requested_version: "0.1.0" }] : []);
      assert.deepEqual(claim.caller_assertions.supported_claim_parts, row.input.caller_supported_claim_parts ?? []);
      assert.deepEqual(claim.caller_assertions.predicate_hints, row.input.predicates ?? {});
      assert.ok(claim.nonclaim_provenance.every(n => n.path === claim.path && n.source_ref));
    }
    assertions.push({ case_id: row.case_id, asserted: ["exact effective requirements", "binding values/predicates/provenance", "missing bindings", "nonclaims/exclusions", "unresolved identities", "state/composition withheld"],
      comparison: "EXPECTED_GAP_CLOSED", pending: ["T1-03 six-state selection", "T1-04 semantic composition", ...(["N18", "I10.unresolved_ref", "H29", "H08"].includes(row.case_id) ? ["Tranche 2 specialized proof evaluation"] : [])] });
  }
  return assertions;
}

// T1-03 owns selection and preserves the collector. Specialized proof methods
// remain separately named; these rows are partial, never whole-case PASS.
export function compareStateResults(rows, outputs, oracle, baseline) {
  const pending = { "N06b:current": { gap: "G07 explicit interval evaluation", state: "STALE", missing: "currentness" }, "N14:decision": { gap: "G03/institutional occurrence evidence", state: "SUPPORTED", missing: "institutional_evidence_basis" }, "N18:independence": { gap: "G05 independent checking", state: "SUPPORTED", missing: "independent_verification_basis" } };
  assert.deepEqual(Object.keys(outputs), rows.map(r => r.case_id));
  assert.deepEqual(rows.map(r => r.case_id), baseline.observations.map(r => r.case_id));
  return rows.map(row => {
    const output = outputs[row.case_id], expected = oracle.cases[row.case_id];
    assert.ok(expected && output && output.status === "EVALUATED", row.case_id);
    assert.equal(output.claims.length, expected.claims.length, row.case_id + " omitted claim");
    const fields = [];
    for (const want of expected.claims) {
      const matches = output.claims.filter(c => c.path === want.path && c.claim === want.claim);
      assert.equal(matches.length, 1, row.case_id + ":" + want.path);
      const got = matches[0], original = baseline.observations.find(r => r.case_id === row.case_id).collection.claims.find(c => c.path === want.path && c.claim === want.claim);
      assert.deepEqual(got.collection, original, "T1-02 collection drift");
      const withheld = pending[row.case_id + ":" + want.path];
      if (!withheld) assert.equal(got.state, want.state, row.case_id + ":" + want.path);
      else { assert.equal(want.state, withheld.state, "Withheld frozen expectation changed"); assert.equal(got.state, "UNRESOLVED"); assert.ok(got.missing_bindings.includes(withheld.missing), "Missing explicit later-proof obligation"); }
      for (const name of want.missing_bindings) assert.ok(got.missing_bindings.includes(name), row.case_id + " missing diagnostic " + name);
      for (const name of want.nonclaims) assert.ok(got.nonclaims.includes(name), row.case_id + " missing nonclaim " + name);
      for (const name of want.diagnostics.filter(d => !withheld || d !== "APPLICABILITY_LOST")) assert.ok(got.diagnostics.includes(name), row.case_id + " missing diagnostic " + name);
      assert.equal(got.world_falsity_asserted, false);
      fields.push({ path: want.path, claim: want.claim, expected_state: want.state, observed_state: got.state, selector_assertions: "PASS", pending_specialized_proof: withheld?.gap ?? null });
    }
    return { case_id: row.case_id, fields, classification: fields.some(f => f.pending_specialized_proof) ? "PARTIAL_CONFORMANCE_IMPROVED" : "EXPECTED_GAP_CLOSED", unit: "task-owned selector slice; specialized semantics not claimed" };
  });
}

// All frozen composition fields are compared in full. The extra product
// admission/legacy/provenance fields are retained and checked separately.
export function compareCompositions(rows, outputs, oracle, hardening) {
  const ids = rows.map(r => r.case_id);
  assert.equal(new Set(ids).size, ids.length, "Duplicate composition case");
  assert.equal(ids.filter(id => id.startsWith("C")).length, 41);
  assert.deepEqual(Object.keys(outputs), ids, "Missing/unmatched composition result");
  return rows.map(row => {
    const result = outputs[row.case_id];
    assert.equal(result.contract_version, "mesr-composition-lock/0.1");
    const expected = row.case_id.startsWith("C") ? oracle.cases[row.case_id] : hardening.cases.find(r => r.case_id === row.case_id)?.expected;
    assert.ok(expected, "Missing expectation: " + row.case_id);
    const actual = Object.fromEntries(Object.keys(expected).map(key => [key, result[key]]));
    assert.deepEqual(actual, expected, "Full composition oracle: " + row.case_id);
    if (result.status === "INVALID_COMPOSITION") {
      for (const key of ["semantic_entries", "mappings", "profiles", "requirements", "nonclaims", "resolved_modules"]) assert.deepEqual(result[key], [], row.case_id + ":" + key);
      assert.equal(result.core_basis_input, null);
      assert.ok(result.diagnostics.length > 0);
    } else {
      assert.equal(result.admission.status, "CHECKED_BASIS");
      assert.equal(result.resolved_modules.length, row.input.modules.length);
      assert.ok(result.provenance.admission_basis_refs.length > 0);
      assert.ok(result.core_basis_input);
      assert.equal(result.requirements.length, result.semantic_entries.length);
      assert.equal(result.nonclaims.length, result.semantic_entries.length);
      for (const entry of result.semantic_entries) {
        assert.deepEqual(result.requirements.find(r => r.semantic_id === entry.semantic_id).required_bindings, entry.required_bindings);
        assert.deepEqual(result.nonclaims.find(r => r.semantic_id === entry.semantic_id).does_not_support, entry.does_not_support);
      }
    }
    assert.equal(result.later_assurance, "WITHHELD_FOR_TRANCHE_2");
    return { case_id: row.case_id, asserted_fields: Object.keys(expected), atomicity: "PASS", outcome: "PASS", classification: "EXPECTED_GAP_CLOSED" };
  });
}

// Private annotation assertions only; no claim selector or evidence synthesis.
export function compareVerificationEvents(rows,outputs){
  assert.deepEqual(Object.keys(outputs).sort(),rows.map(r=>r.case_id).sort(),"T2-01 inventory");
  return rows.map(row=>{
    const out=outputs[row.case_id];assert.ok(!Object.hasOwn(out,"state"),row.case_id+": no primary state");
    assert.equal(out.annotation??null,row.expected_annotation,row.case_id);assert.deepEqual(out.raw_input,row.input,row.case_id+": raw facts");
    assert.equal(out.occurrence_basis.established,!!row.expected_annotation&&row.expected_annotation!=="NO_ATTRIBUTABLE_OCCURRENCE",row.case_id);
    assert.equal(out.result_basis.established,row.expected_annotation==="ATTRIBUTABLE_OCCURRENCE_WITH_RESULT",row.case_id);
    if(row.expected_annotation==="ATTRIBUTABLE_OCCURRENCE_WITH_RESULT")assert.deepEqual(out.result_basis.values,[row.input.records["w:result"].result]);
    if(row.case_id==="W13"){assert.deepEqual(out.result_basis.values,["passed","failed"]);assert.ok(out.diagnostics.some(d=>d.issue==="COMPETING_RESULTS"));}
    if(row.case_id.startsWith("field."))assert.ok(out.missing_facts.some(m=>m.path.startsWith("/records/")),row.case_id+": missing fact");
    return {case_id:row.case_id,result:"PASS",classification:"EXPECTED_GAP_CLOSED",asserted:["annotation","occurrence_basis","result_basis","raw_input","no_primary_state"],scope:"Private occurrence/result slice; no whole-case G05 closure"};
  });
}

// T2-02 expected assertions only; all states come from the product evaluator.
export function compareIntegrity(rows, outputs) {
  return rows.map(row => {
    const output = outputs[row.case_id];
    assert.ok(output, row.case_id);
    assert.equal(output.comparison.receipt !== null, row.receipt, row.case_id);
    assert.equal(output.evaluation.status, "EVALUATED", row.case_id);
    assert.equal(output.evaluation.claims.find(c => c.path === "integrity").state, row.expected_state, row.case_id);
    if (row.measured_byte_length !== undefined) assert.equal(output.comparison.evidence.measured_byte_length, row.measured_byte_length);
    return {case_id:row.case_id,outcome:"PASS",state:row.expected_state};
  });
}

// T2-03 expectations assert product output; they never enter product evaluation.
export function compareIndependence(rows, outputs) {
  assert.deepEqual(Object.keys(outputs).sort(), rows.map(r => r.case_id).sort());
  return rows.map(row => {
    const result = outputs[row.case_id].evaluation;
    assert.equal(result.status, "EVALUATED", row.case_id);
    for (const [path, expected] of Object.entries(row.expected)) assert.equal(result.claims.find(c => c.path === path)?.state, expected, row.case_id + ":" + path);
    return { case_id: row.case_id, asserted: row.expected, outcome: "PASS" };
  });
}

// T2-04 comparisons never manufacture retained witness facts or select states.
export function compareTemporal(rows,outputs) {
  return rows.map(row=>{
    const actual=outputs[row.case_id];assert.ok(actual,'Missing T2-04 output '+row.case_id);
    const claim=actual.evaluation.claims.find(c=>c.path==='current');
    assert.equal(claim?.state,row.expected.state,row.case_id);
    const retained=row.input.evidence_ledger['t2-04:dossier'];
    assert.deepEqual(actual.evidence.dossier,retained,'Exact retained witness spelling/content '+row.case_id);
    assert.equal(actual.evidence.times.evaluation_time,retained.evaluation_time??null);
    assert.equal(actual.evidence.times.reliance_time,retained.reliance_time??null);
    assert.deepEqual(actual.evidence.nonclaims,['real_world_temporal_truth','context_continuity','current_authority','institutional_acceptance','execution_permission']);
    assert.equal(claim.world_falsity_asserted,false);
    if(row.expected.state==='SUPPORTED'){assert.equal(actual.evidence.applicable,true);assert.deepEqual(actual.evidence.missing,[]);assert.deepEqual(actual.evidence.losses,[]);}
    if(row.expected.state==='STALE'){assert.equal(actual.evidence.historical_support,true);assert.ok(actual.evidence.losses.length);}
    if(retained.historical?.verification)assert.deepEqual(actual.evidence.historical_result.raw_input,retained.historical.verification,'Original T2-01 evidence retained');
    for(const name of row.expected.missing??[])assert.ok(claim.missing_bindings.includes(name),row.case_id+': '+name);
    for(const reason of row.expected.losses??[])assert.ok(actual.evidence.losses.some(x=>x.reason===reason),row.case_id+': '+reason);
    assert.equal(actual.evaluation.world_falsity_asserted??false,false);
    return {case_id:row.case_id,state:claim.state,missing:claim.missing_bindings,losses:actual.evidence?.losses.map(x=>x.reason)??[],outcome:'PASS'};
  });
}

// T2-05 compares product-owned assertion fields; unexpected errors stay ERROR.
export function compareContinuity(rows,outputs) {
  return rows.map(row=>{
    const a=outputs[row.case_id];assert.ok(a,'Missing T2-05 output '+row.case_id);
    assert.ok(!a.error,'ERROR '+row.case_id+': '+a.error);
    const d=row.input.evidence_ledger['t2-05:dossier'];
    assert.ok(a.evidence,'Missing evaluated evidence '+row.case_id+': '+JSON.stringify(a.evaluation.input_issues));
    assert.deepEqual(a.evidence.dossier,d,'Immutable retained history '+row.case_id);
    const claims=Object.fromEntries(a.evaluation.claims.map(c=>[c.path,c]));
    for(const [path,expected]of Object.entries(row.expected.claims)){
      const c=claims[path];assert.equal(c?.state,expected.state,row.case_id+': '+path);
      for(const m of expected.missing??[])assert.ok(c.missing_bindings.includes(m),row.case_id+': '+m);
      for(const kind of expected.facts??[])assert.ok(c.evaluation_basis[kind].length,row.case_id+': '+kind);
      assert.equal(c.world_falsity_asserted,false);
      if(expected.state==='STALE'){assert.ok(a.evidence.paths[path].historical_support);assert.ok(a.evidence.paths[path].losses.length);}
    }
    for(const [name,expected]of Object.entries(row.expected.dimensions??{})){
      const actual=a.evidence.dimensions[name];assert.ok(actual,'Missing dimension '+name);
      for(const [field,value]of Object.entries(expected))assert.deepEqual(actual[field],value,row.case_id+': '+name+'.'+field);
    }
    return {case_id:row.case_id,canonical_case:row.canonical_case??null,claims:Object.fromEntries(Object.keys(row.expected.claims).map(p=>[p,{state:claims[p].state,missing:claims[p].missing_bindings,fact_counts:Object.fromEntries(Object.entries(claims[p].evaluation_basis).map(([k,v])=>[k,v.length]))}])),dimensions:Object.fromEntries(Object.entries(a.evidence.dimensions).map(([k,v])=>[k,{satisfied:v.satisfied,missing:v.missing,negative:v.negative.length,conflicts:v.conflicts.length,undecidable:v.undecidable.length}])),outcome:'PASS'};
  });
}

// T2-06 compares actual owner results; it never constructs a semantic basis.
export function compareSufficiency(rows,outputs,inventory=rows.map(r=>r.case_id)){
  assert.equal(new Set(inventory).size,inventory.length,'Duplicate expected inventory');
  assert.equal(new Set(rows.map(r=>r.case_id)).size,rows.length,'Duplicate case');
  assert.deepEqual(rows.map(r=>r.case_id).sort(),[...inventory].sort(),'Omitted/extra case');
  assert.deepEqual(Object.keys(outputs).sort(),[...inventory].sort(),'Omitted/extra output');
  return rows.map(row=>{
    const a=outputs[row.case_id];assert.ok(a&&!a.error,'ERROR '+row.case_id+': '+JSON.stringify(a?.error));
    assert.equal(a.evaluation.status,row.expected.status??'EVALUATED',row.case_id);
    const c=a.evaluation.claims.find(c=>c.path==='sufficiency');
    if(row.expected.state!==undefined)assert.equal(c?.state,row.expected.state,row.case_id);
    for(const m of row.expected.missing??[])assert.ok(c?.missing_bindings.includes(m),row.case_id+': '+m);
    for(const kind of row.expected.facts??[])assert.ok(c?.evaluation_basis[kind].length,row.case_id+': '+kind);
    if(row.expected.validation)assert.ok(a.validation?.some(v=>v.code===row.expected.validation),row.case_id+': validation');
    if(row.expected.inventory)assert.deepEqual(a.evidence?.requirements.map(r=>[r.requirement_id,r.decision]),row.expected.inventory,row.case_id);
    for(const [key,value]of Object.entries(row.expected.dimensions??{}))assert.deepEqual(a.evidence?.[key],value,row.case_id+': '+key);
    for(const r of a.evidence?.requirements??[])if(r.decision==='unresolved')assert.equal(r.rationale,r.missing.length?'missing-basis':'no-admitted-determination');
    if(c?.state==='SUPPORTED'){
      assert.equal(a.evidence.no_material_gap,true);assert.equal(a.evidence.A0.result,'positive');
      assert.deepEqual(a.evidence.requirements.map(r=>r.requirement_id),['R00','R01','R02','R03']);
      assert.ok(a.evidence.requirements.every(r=>['satisfied','permitted_exclusion'].includes(r.decision)));
      assert.deepEqual(c.missing_bindings,[]);
    }
    return {case_id:row.case_id,canonical_case:row.canonical_case??null,status:a.evaluation.status,state:c?.state??null,missing:c?.missing_bindings??[],requirements:a.evidence?.requirements.map(r=>[r.requirement_id,r.decision])??[],outcome:'PASS'};
  });
}
