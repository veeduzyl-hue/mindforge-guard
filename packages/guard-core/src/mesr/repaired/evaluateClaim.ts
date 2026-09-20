import { MESR_CORE_REGISTRY } from "../coreRegistry.ts";
import { MESR_CLAIM_BOUNDARIES } from "../claimBoundaries.ts";
import { collectBindingRequirements, type RequirementContext } from "./requirements.ts";
import { canonicalJson, compareCodePoints, contentDigest } from "./canonicalBytes.ts";
import { nonempty, record, type AdmissionTrust, type JsonRecord } from "./contracts.ts";
import { type ClaimState, type StateBasis } from "./claimState.ts";
import { readIntegrityReceipt } from "./integrity.ts";
import { readIndependenceFinding } from "./independence.ts";

function selectClaimState(basis: StateBasis): { state: ClaimState; rationale: string } {
  if (basis.prohibitions.length) return { state: "UNSUPPORTED", rationale: "CORE_PROHIBITED_INFERENCE" };
  if (basis.conflicts.length) return { state: "CONFLICTED", rationale: "COMPARABLE_CONFLICT" };
  if (basis.stale.length) return { state: "STALE", rationale: "APPLICABILITY_LOST" };
  if (basis.missing.length) return { state: "UNRESOLVED", rationale: "MISSING_OBLIGATION" };
  if (basis.negative.length) return { state: "UNSUPPORTED", rationale: "COMPLETED_NON_SUPPORT" };
  if (basis.undecidable.length) return { state: "INCONCLUSIVE", rationale: "COMPLETE_UNDECIDABLE_METHOD" };
  if (basis.positive.length) return { state: "SUPPORTED", rationale: "COMPLETE_POSITIVE_BASIS" };
  return { state: "UNRESOLVED", rationale: "NO_ADMITTED_DETERMINATION" };
}

const ADR = "docs/adr/0011-mesr-claim-nonclaim-state-and-binding-contract.md";
const ordered = (xs: string[]) => [...new Set(xs)].sort(compareCodePoints);
const sortRecords = (xs: JsonRecord[]) => xs.sort((a, b) => compareCodePoints(canonicalJson(a), canonicalJson(b)));
function freeze<T>(value: T): T { if (value && typeof value === "object") { Object.values(value).forEach(freeze); Object.freeze(value); } return value; }
const admittedResults = new WeakSet<object>();
const blank = (): StateBasis => ({ prohibitions: [], conflicts: [], stale: [], missing: [], positive: [], negative: [], undecidable: [] });
const time = (v: unknown) => typeof v === "string" && /(?:Z|[+-]\d{2}:\d{2})$/.test(v) && Number.isFinite(Date.parse(v));

/** Rechecks T1-01/T1-02, then projects bounded evidence into one state per path.
 * Recorded producer results remain attributed assertions. No check is executed,
 * no independent-verifier/custody/integrity/profile/current-standing method runs.
 */
export function evaluateClaims(input: unknown, coreInput: unknown, trust: AdmissionTrust, contexts: readonly RequirementContext[] = [], integrityReceipt?: unknown, independenceFinding?: unknown) {
  const collection = collectBindingRequirements(input, coreInput, trust, contexts);
  const result: JsonRecord = { contract_version: "mesr-claim-state-projection/0.1", method_version: "mesr-claim-evaluation/0.1", status: collection.status === "COLLECTED" ? "EVALUATED" : "REJECTED",
    semantic_composition: "WITHHELD_FOR_T1_04", input_digest: collection.input_digest, checked_basis: collection.checked_basis, input_issues: collection.input_issues, claims: [] };
  if (collection.status !== "COLLECTED") return freeze(result);
  const source = input as JsonRecord;
  if (source.state_proofs !== undefined && (!Array.isArray(source.state_proofs) || source.state_proofs.some((p: unknown) => !record(p) || !source.requests.some((r: JsonRecord) => r.path === (p as JsonRecord).path)))) {
    result.status = "REJECTED"; result.input_issues = [...result.input_issues, { code: "INVALID_STATE_PROOFS", field: "state_proofs" }]; return freeze(result);
  }
  for (const collected of collection.claims) {
    const c = structuredClone(collected), missing = [...c.missing_bindings];
    if (!time(c.provenance.evaluation_time)) missing.push("evaluation_time");
    const positive: JsonRecord[] = [], negative: JsonRecord[] = [], undecidable: JsonRecord[] = [], conflicts: JsonRecord[] = [], stale: JsonRecord[] = [];
    const prohibitions = structuredClone(c.excluded_inferences), supplementalNonclaims: JsonRecord[] = [], ignored: JsonRecord[] = [];
    const entries = MESR_CORE_REGISTRY.filter(e => c.semantic_ids.includes(e.semantic_id) && e.version === c.semantic_version);
    const has = (id: string) => entries.some(e => e.semantic_id === id);
    const anchored = entries.some(e => e.supports.includes(c.claim));
    const bound = (p: unknown) => record(p) && (p as JsonRecord).subject === source.subject && (p as JsonRecord).scope === source.scope && time((p as JsonRecord).time);
    const proofRef = (p: JsonRecord) => source.input_set_id + "#proof:" + contentDigest(p);
    const witness = (ref: unknown) => nonempty(ref) && record(source.evidence_ledger) && record(source.evidence_ledger[ref as string]) && source.evidence_ledger[ref as string].subject === source.subject && source.evidence_ledger[ref as string].scope === source.scope;
    // This facet binds the existing producer Core nonclaim/CB-22; it is not an alias.
    if (has("mesr.core.provenance.producer") && c.claim === "verification.independent") {
      const boundary = MESR_CLAIM_BOUNDARIES.find(b => b.boundary_id === "CB-22")!;
      const exclusion = { path: c.path, claim: "producer_result_does_not_establish_independence", canonical_nonclaim: "independent_verification", source_ref: "Core:" + boundary.boundary_id, boundary_digest: contentDigest(boundary) };
      prohibitions.push(exclusion); supplementalNonclaims.push(exclusion);
    }
    const verification = has("mesr.core.evidence.verification") && ["verification.passed", "verification.occurred"].includes(c.claim);
    if (verification) {
      const events = Array.isArray(source.events) ? source.events : [];
      const admitted: JsonRecord[] = [];
      for (const event of events) {
        const complete = record(event) && ["event_id", "producer", "verifier", "property", "method", "method_version", "criterion", "input_ref", "output_ref"].every(k => nonempty(event[k]));
        const applicable = complete && event.kind === "verification" && bound(event) && event.event_id === source.event_id && event.time === source.event_time && witness(event.input_ref) && witness(event.output_ref)
          && source.evidence_ledger[event.output_ref].event_id === event.event_id && source.evidence_ledger[event.output_ref].time === event.time;
        if (!applicable || !["passed", "failed", "inconclusive"].includes(event.result)) { ignored.push({ ref: proofRef(event), reason: "UNBOUND_OR_INCOMPLETE_RECORDED_ASSERTION", evidence: structuredClone(event) }); continue; }
        admitted.push({ ref: proofRef(event), evidence: structuredClone(event), criterion: "attributed-bound-record/0.1", origin: "PRODUCER_ASSERTION", source_ref: event.output_ref });
      }
      sortRecords(admitted);
      const predicates = new Set(admitted.map(p => canonicalJson([p.evidence.property, p.evidence.method, p.evidence.method_version, p.evidence.criterion, p.evidence.input_ref])));
      if (predicates.size > 1) missing.push("unambiguous_verification_predicate");
      for (const a of admitted) for (const b of admitted) {
        if (compareCodePoints(a.ref, b.ref) >= 0) continue;
        const keys = ["event_id", "subject", "scope", "time", "property", "method", "method_version", "criterion", "input_ref"];
        if (c.claim === "verification.passed" && keys.every(k => a.evidence[k] === b.evidence[k]) && [a.evidence.result, b.evidence.result].includes("passed") && [a.evidence.result, b.evidence.result].includes("failed")) conflicts.push({ criterion: "same-predicate-subject-scope-time/0.1", refs: [a.ref, b.ref], records: [a, b] });
      }
      for (const p of admitted) {
        if (c.claim === "verification.occurred" || p.evidence.result === "passed") positive.push(p);
        else if (p.evidence.result === "failed") negative.push(p);
        else undecidable.push(p);
      }
      if (!admitted.length) missing.push("verification_event");
    } else if (has("mesr.core.evidence.item") && ["evidence_presence", "evidence.present"].includes(c.claim)) {
      if (bound(source.positive_evidence) && nonempty(source.positive_evidence.ref) && source.positive_evidence.time === c.provenance.evaluation_time && source.evidence_present === true) positive.push({ ref: proofRef(source.positive_evidence), evidence: structuredClone(source.positive_evidence), criterion: "attributed-evidence-presence/0.1", origin: "PRODUCER_ASSERTION" });
      else missing.push("positive_evidence");
    } else if ((c.claim === "verification.independent" && has("mesr.core.evidence.verification") || c.claim === "custody.independent" && has("mesr.core.evidence.item"))
      && readIndependenceFinding(independenceFinding, source, coreInput, trust, contexts, collection, c.path)) {
      const finding = readIndependenceFinding(independenceFinding, source, coreInput, trust, contexts, collection, c.path)!;
      const dimensions = c.claim === "custody.independent" ? [finding.custody] : [finding.identity, finding.principal_separation, finding.custody, finding.successful_check];
      for (const dimension of dimensions) {
        missing.push(...dimension.missing);
        negative.push(...dimension.violations.map((evidence: JsonRecord) => ({ ref: proofRef(evidence), criterion: finding.method, evidence })));
        undecidable.push(...dimension.undecidable.map((evidence: JsonRecord) => ({ ref: proofRef(evidence), criterion: finding.method, evidence })));
        conflicts.push(...dimension.contradictions);
      }
      if (dimensions.every(d => d.satisfied)) positive.push({ ref: proofRef(finding), criterion: finding.method, evidence: finding });
    } else if (c.claim === "verification.independent" && has("mesr.core.evidence.verification")) {
      missing.push("independent_verification_basis");
      for (const key of ["verifier_principal", "separation", "custody"]) if (!source[key]) missing.push(key);
      if (!source.events?.some((e: JsonRecord) => e.result === "passed" && bound(e))) missing.push("verification_event");
    } else if (c.claim === "standing.current" && has("mesr.core.temporal.basis")) missing.push("currentness");
    else if (c.claim === "evidence.sufficient") {
      missing.push("profile_bound_sufficiency_basis");
      for (const key of ["profile_id", "claim_set_id", "scope", "evaluation_time", "evidence_refs", "material_gap_result"]) if (!source.sufficiency?.[key]) missing.push("sufficiency." + key);
    }
    else if (c.claim === "artifact.byte_equality") {
      const comparison = has("mesr.core.evidence.item") ? readIntegrityReceipt(integrityReceipt, source, c.path, contexts) : null;
      if (comparison) {
        const fact = { ref: source.integrity.comparison_event, criterion: comparison.method, evidence: comparison };
        (comparison.match ? positive : negative).push(fact);
      } else { missing.push("integrity_comparison_basis"); if (!source.integrity?.bytes_base64) missing.push("integrity.bytes_base64"); }
    }
    else if (["institutional.acceptance", "acceptance.decision_occurred"].includes(c.claim)) { missing.push("institutional_evidence_basis"); if (c.claim === "institutional.acceptance" && !source.acceptance_authority) missing.push("acceptance_authority"); }
    else if (source.caller_contradiction === true) missing.push("contradictory_evidence");
    else if (!anchored && !prohibitions.length) missing.push("admitted_mapping_and_evidence");

    // Generic primitive only: compare explicit, attributable boolean observations
    // under a closed named criterion. A caller outcome label is never a proof.
    const proofs = Array.isArray(source.state_proofs) ? source.state_proofs : [];
    for (const proof of proofs.filter((p: JsonRecord) => record(p) && p.path === c.path)) {
      const base = proof.claim === c.claim && proof.semantic_version === c.semantic_version && c.semantic_ids.includes(proof.semantic_id) && bound(proof) && proof.time === c.provenance.evaluation_time && nonempty(proof.source_ref);
      if (!base) { missing.push("state_proof_binding"); continue; }
      if (proof.criterion === "bound-boolean-equality/0.1" && anchored && c.claim === "evidence_presence" && proof.semantic_id === "mesr.core.evidence.item" && proof.expected === true && proof.property === "present" && witness(proof.evidence_ref)) {
        const evidence = source.evidence_ledger[proof.evidence_ref];
        if (evidence.time !== proof.time || evidence.predicate !== c.claim || evidence.semantic_id !== proof.semantic_id || !nonempty(evidence.source_ref) || typeof evidence[proof.property] !== "boolean") { missing.push("state_proof_value"); continue; }
        const p = { ref: proofRef(proof), criterion: proof.criterion, proof: structuredClone(proof), evidence: structuredClone(evidence) };
        (evidence[proof.property] === proof.expected ? positive : negative).push(p);
      } else if (proof.criterion === "bound-applicability-loss/0.1" && c.claim === "standing.current" && has("mesr.core.temporal.basis") && witness(proof.historical_ref) && witness(proof.current_ref)) {
        const old = source.evidence_ledger[proof.historical_ref], now = source.evidence_ledger[proof.current_ref];
        if (time(old.time) && Date.parse(old.time) < Date.parse(proof.time) && old.applicable === true && now.time === proof.time && now.applicable === false && old.predicate === c.claim && now.predicate === c.claim && nonempty(old.source_ref) && nonempty(now.source_ref)) stale.push({ ref: proofRef(proof), criterion: proof.criterion, proof: structuredClone(proof), historical: structuredClone(old), current: structuredClone(now) });
        else missing.push("applicability_loss_basis");
      } else missing.push("admitted_state_proof_criterion");
    }
    if ([...positive, ...negative].some(p => p.criterion === "bound-boolean-equality/0.1")) { const index = missing.indexOf("positive_evidence"); if (index >= 0) missing.splice(index, 1); }
    if (!verification) for (const a of positive) for (const b of negative) {
      if ((a.criterion === "attributed-evidence-presence/0.1" && b.proof?.claim === "evidence_presence") || (a.proof && b.proof && ["criterion", "property", "expected", "time", "subject", "scope", "claim"].every(k => a.proof[k] === b.proof[k]))) conflicts.push({ criterion: "same-claim-complete-opposing-determinations/0.1", refs: ordered([a.ref, b.ref]), records: [a, b] });
    }
    if (!positive.length && !negative.length && !undecidable.length && !conflicts.length && !stale.length && !prohibitions.length && !missing.length) missing.push("admitted_determination");
    const facts: StateBasis = { prohibitions: sortRecords(prohibitions), conflicts: sortRecords(conflicts), stale: sortRecords(stale), missing: ordered(missing), positive: sortRecords(positive), negative: sortRecords(negative), undecidable: sortRecords(undecidable) };
    const selected = selectClaimState(facts);
    const claim: JsonRecord = { ...c, state_evaluation: "EVALUATED", ...selected, missing_bindings: facts.missing,
      nonclaims: ordered([...c.nonclaims, ...supplementalNonclaims.map(n => n.claim)]), nonclaim_provenance: sortRecords([...c.nonclaim_provenance, ...supplementalNonclaims]),
      excluded_inferences: facts.prohibitions, evaluation_basis: facts, conflict_refs: ordered(conflicts.flatMap(c => c.refs)), basis_refs: ordered([...positive, ...negative, ...undecidable, ...stale].map(p => p.ref)),
      historical_basis: structuredClone(source.historical_basis ?? null), ignored_evidence: sortRecords(ignored),
      diagnostics: ordered([...c.diagnostics, ...missing.map(m => "MISSING:" + m), ...(prohibitions.length ? ["INFERENCE_PROHIBITED"] : []), ...(conflicts.length ? ["COMPARABLE_CONFLICT"] : []), ...(stale.length ? ["APPLICABILITY_LOST"] : [])]),
      dimension_annotations: positive.some(p => p.origin === "PRODUCER_ASSERTION") ? ["SUPPORTED_BY_PRODUCER_ASSERTION"] : [],
      source_contract: ADR, legacy_value: source.legacy_report ?? source.legacy_relation ?? null, world_falsity_asserted: false,
      pending_specialized_evaluation: ["G05", "G07", "G06", "G03"], collection: collected };
    freeze(claim); admittedResults.add(claim); result.claims.push(claim);
  }
  return freeze(result);
}

/** Composite input consists of required path IDs and actual immutable results
 * produced above. Caller-written states, dropped/duplicate parts and mixed
 * subject/scope/time results cannot manufacture a supported composite. */
export function evaluateCompositeClaim(identity: { claim: string; subject: string; scope: string; evaluation_time: string; source_ref: string }, requiredPaths: readonly string[], children: readonly JsonRecord[]) {
  if (!record(identity) || !Array.isArray(requiredPaths) || !Array.isArray(children)) throw new TypeError("Invalid composite input shape");
  canonicalJson({ identity, requiredPaths, children });
  const supplied = sortRecords(structuredClone(children));
  const facts = blank(); const missing: string[] = [], accepted: JsonRecord[] = [];
  if (![identity.claim, identity.subject, identity.scope, identity.source_ref].every(nonempty) || !time(identity.evaluation_time)) missing.push("composite_identity");
  if (!Array.isArray(requiredPaths) || !requiredPaths.length || requiredPaths.some(p => !nonempty(p)) || new Set(requiredPaths).size !== requiredPaths.length) missing.push("required_parts");
  for (const path of ordered(Array.isArray(requiredPaths) ? requiredPaths : [])) {
    const matches = Array.isArray(children) ? children.filter(c => c?.path === path) : [];
    if (matches.length !== 1 || !admittedResults.has(matches[0]) || matches[0].provenance.subject !== identity.subject || matches[0].provenance.scope !== identity.scope || matches[0].provenance.evaluation_time !== identity.evaluation_time) { missing.push("child:" + path); continue; }
    accepted.push(matches[0]);
  }
  if (children.some(c => !requiredPaths.includes(c?.path))) missing.push("unrequested_child");
  const collected = { ...facts, missing } as { [K in keyof StateBasis]: any[] };
  for (const child of accepted) {
    const b = child.evaluation_basis as StateBasis;
    for (const key of ["prohibitions", "conflicts", "stale"] as const) collected[key].push(...b[key].map(proof => ({ path: child.path, proof })));
    if (child.state === "UNRESOLVED") missing.push("child:" + child.path);
    if (child.state === "UNSUPPORTED" && !b.prohibitions.length) collected.negative.push({ path: child.path, basis: b.negative });
    if (child.state === "INCONCLUSIVE") collected.undecidable.push({ path: child.path, basis: b.undecidable });
  }
  if (accepted.length && accepted.length === requiredPaths.length && accepted.every(c => c.state === "SUPPORTED")) collected.positive.push({ required_parts: accepted.map(c => ({ path: c.path, basis_refs: c.basis_refs })) });
  collected.missing = ordered(missing);
  return freeze({ ...identity, required_paths: ordered([...requiredPaths]), children: accepted, supplied_children: supplied, rejected_or_missing_parts: collected.missing,
    ...selectClaimState(collected), evaluation_basis: collected, world_falsity_asserted: false, semantic_composition: "WITHHELD_FOR_T1_04" });
}
