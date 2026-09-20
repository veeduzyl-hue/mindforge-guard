import { canonicalJson, contentDigest } from "./canonicalBytes.ts";
import { record, nonempty, type JsonRecord, type AdmissionTrust } from "./contracts.ts";
import { collectBindingRequirements, type RequirementContext } from "./requirements.ts";
import { evaluateVerificationEvent } from "./verificationEvent.ts";
import { readIntegrityReceipt } from "./integrity.ts";

// Internal supplied-fact methods. These evaluate retained assertions; they do not
// authenticate world identities, issue credentials, or establish current standing.
const findings = new WeakMap<object, { context: string; evidence: JsonRecord }>();
const time = (v: unknown) => typeof v === "string" && /(?:Z|[+-]\d{2}:\d{2})$/.test(v) && Number.isFinite(Date.parse(v));
const texts = (v: unknown) => Array.isArray(v) && v.length > 0 && v.every(nonempty);
const empty = () => ({ missing: [] as string[], violations: [] as JsonRecord[], contradictions: [] as JsonRecord[], undecidable: [] as JsonRecord[], witnesses: [] as JsonRecord[], satisfied: false });
function freeze<T>(v: T): T { if (v && typeof v === "object") { Object.values(v).forEach(freeze); Object.freeze(v); } return v; }
function context(input: unknown, core: unknown, trust: AdmissionTrust, contexts: readonly RequirementContext[], collection: unknown) {
  return canonicalJson({ input, core, trust, contexts, collection });
}

/** A dossier is explicitly retained in the admitted input ledger. Receipt identities
 * arrive separately and are read against their original T2-02 input/path/contexts.
 * No caller fact/state can register a finding. Partial findings remain useful facts.
 */
export function evaluateIndependence(input: unknown, core: unknown, trust: AdmissionTrust, contexts: readonly RequirementContext[] = [], integrityReceipts: readonly unknown[] = []) {
  canonicalJson({ input, core, trust, contexts });
  const source = structuredClone(input) as JsonRecord;
  const collection = collectBindingRequirements(source, core, trust, contexts);
  if (collection.status !== "COLLECTED") return freeze({ finding: null, evidence: null });
  const dossier = source.evidence_ledger?.["t2-03:dossier"];
  if (!record(dossier)) return freeze({ finding: null, evidence: null });
  const d = dossier as JsonRecord, records = record(d.records) ? d.records : {};
  const identity = empty(), separation = empty(), custody = empty(), check = empty();
  const evidence: JsonRecord = { method: "retained-principal-custody/0.1", dossier: d, identity, principal_separation: separation, custody, successful_check: check,
    attributable_result: null, control_facts: [], comparisons: [],
    nonclaims: ["real_world_authentication", "current_continuing_independence", "institutional_acceptance", "certification", "authority", "execution_permission"] };
  type Dimension = ReturnType<typeof empty>;
  const need = (b: Dimension, ok: unknown, name: string) => { if (!ok) b.missing.push(name); return !!ok; };
  const targetKeys = ["subject", "revision", "scope", "event_id", "event_time"];
  const target = { subject: source.subject, revision: source.revision, scope: source.scope, event_id: source.event_id, event_time: source.event_time };
  const same = (a: JsonRecord, b: JsonRecord, keys: string[]) => keys.every(k => nonempty(a[k]) && a[k] === b[k]);
  const interval = (r: JsonRecord) => time(r.from) && time(r.until) && Date.parse(r.from) <= Date.parse(target.event_time) && Date.parse(target.event_time) <= Date.parse(r.until);
  const get = (ref: unknown, kind: string, b: Dimension): JsonRecord | null => {
    const r = typeof ref === "string" && record(records[ref]) ? records[ref] : null;
    if (!need(b, r && r.kind === kind && r.source_ref === ref && nonempty(r.source_namespace) && nonempty(r.recorder)
      && same(r, target, targetKeys) && nonempty(d.event_namespace) && r.event_namespace === d.event_namespace && texts(r.limitations) && record(r.content), kind + ":" + String(ref))) return null;
    b.witnesses.push(r); return r;
  };
  const provenance = (r: JsonRecord, b: Dimension) => {
    const p = get(r.provenance_ref, "provenance", b);
    return !!p && need(b, p.content.record_ref === r.source_ref && p.content.recorder === r.recorder, "provenance_association:" + r.source_ref);
  };
  for (const b of [identity, separation, custody, check]) need(b, d.contract_version === "t2-03-retained-witnesses/0.1" && same(d, target, targetKeys)
    && time(target.event_time) && time(source.bindings?.evaluation_time) && texts(d.limitations) && Array.isArray(d.omissions) && !d.omissions.length, "dossier_context_and_coverage");
  const principals = record(d.principals) ? d.principals : {};
  const roleFacts: JsonRecord = {};
  for (const role of ["producer", "executor", "verifier", "custodian"]) {
    const before = identity.missing.length, ref = d.identity_refs?.[role], r = get(ref, "identity", identity);
    if (!r) continue;
    const p = principals[role];
    need(identity, nonempty(p) && r.principal === p && r.role === role && (role === "custodian" || source[role + "_principal"] === p), "identity_role:" + role);
    need(identity, r.method === "retained-role-attestation" && r.method_version === "0.1" && r.result === "matched"
      && nonempty(r.identity_ref) && nonempty(r.attribution) && r.content.identity_ref === r.identity_ref && r.content.principal === p
      && r.content.role === role && r.content.attribution === r.attribution && r.content.event_id === target.event_id, "identity_method_result:" + role);
    const proof = get(r.identity_ref, "identity_verification", identity);
    if (proof) {
      need(identity, proof.principal === p && proof.role === role && proof.attribution === r.attribution
        && proof.method === "retained-credential-verification/0.1" && proof.result === "verified"
        && nonempty(proof.content.credential_ref) && proof.content.credential_subject === p
        && proof.content.checked_by === proof.recorder && nonempty(proof.content.verification_record), "retained_identity_verification:" + role);
      provenance(proof, identity);
    }
    provenance(r, identity);
    if (identity.missing.length === before) roleFacts[role] = r;
  }
  identity.satisfied = !identity.missing.length && Object.keys(roleFacts).length === 4;
  // Every record purporting to describe these roles must be selected; ambiguity is
  // not resolved by ignoring a second identity or by picking a favorable principal.
  for (const r of Object.values(records) as JsonRecord[]) if (record(r) && r.kind === "identity" && !Object.values(d.identity_refs ?? {}).includes(r.source_ref)) identity.missing.push("unselected_identity_candidate");
  identity.satisfied = identity.satisfied && !identity.missing.length;
  need(separation, identity.satisfied, "complete_identity_basis");
  const policy = get(d.separation_policy_ref, "separation_policy", separation);
  const policyOK = policy && provenance(policy, separation) && need(separation, policy.policy_id === "verifier-separate-from-producer-and-executor" && policy.version === "0.1"
    && policy.content.criterion === "distinct-principal-no-common-control-no-conflict" && canonicalJson(policy.content.pairs) === canonicalJson(["producer:verifier", "executor:verifier"]), "named_separation_policy");
  const relationRefs = texts(d.relationship_refs) ? d.relationship_refs : [];
  need(separation, relationRefs.length, "control_conflict_witnesses");
  need(separation, relationRefs.every((ref: string) => record(records[ref]) && ["producer:verifier", "executor:verifier"].includes(records[ref].pair)), "selected_relationship_scope");
  for (const r of Object.values(records) as JsonRecord[]) if (record(r) && r.kind === "relationship" && !relationRefs.includes(r.source_ref)) separation.missing.push("unselected_relationship_candidate");
  for (const pair of ["producer:verifier", "executor:verifier"]) {
    const admitted: JsonRecord[] = [];
    for (const ref of relationRefs) {
      const raw = records[ref]; if (record(raw) && raw.pair !== pair) continue;
      const start = separation.missing.length, r = get(ref, "relationship", separation); if (!r) continue;
      const [left, right] = pair.split(":");
      need(separation, policyOK && r.policy_ref === d.separation_policy_ref && r.policy_version === policy!.version && r.pair === pair
        && r.left === principals[left] && r.right === principals[right] && interval(r) && Array.isArray(r.omissions) && !r.omissions.length, "relationship_context:" + ref);
      need(separation, r.method === "retained-control-and-conflict-register/0.1" && ["decided", "undecidable"].includes(r.result)
        && (r.result === "undecidable" ? nonempty(r.content.undecidable_reason) : typeof r.content.common_control === "boolean" && typeof r.content.conflict_of_interest === "boolean"), "relationship_method:" + ref);
      provenance(r, separation);
      if (start === separation.missing.length) admitted.push(r);
    }
    need(separation, admitted.length, "relationship:" + pair);
    evidence.control_facts.push(...admitted);
    for (const r of admitted) {
      if (r.result === "undecidable") separation.undecidable.push(r);
      else if (r.left === r.right || r.content.common_control || r.content.conflict_of_interest) separation.violations.push(r);
    }
    for (let i = 0; i < admitted.length; i++) for (const b of admitted.slice(i + 1)) {
      const a = admitted[i];
      if (a.result === "decided" && b.result === "decided" && a.from === b.from && a.until === b.until
        && (a.content.common_control !== b.content.common_control || a.content.conflict_of_interest !== b.content.conflict_of_interest)) separation.contradictions.push({ criterion: "same-role-policy-interval", refs: [a.source_ref, b.source_ref].sort(), records: [a, b] });
    }
  }
  separation.satisfied = !separation.missing.length && !separation.violations.length && !separation.contradictions.length && !separation.undecidable.length;

  // T2-01 remains the sole attributable occurrence/result implementation.
  const verification = record(d.verification) ? evaluateVerificationEvent(d.verification) : null;
  evidence.attributable_result = verification;
  const event = d.verification?.records?.[d.verification?.occurrence_ref];
  const eventBound = record(event) && event.source_namespace === d.event_namespace && same(event, target, targetKeys) && roleFacts.producer?.attribution === event.producer && roleFacts.verifier?.attribution === event.verifier;
  const competingResults = eventBound && verification?.occurrence_basis.established && verification?.result_basis.requested
    && verification.missing_facts.every((m: JsonRecord) => m.path === "/claim_context") && new Set(verification.result_basis.values).size > 1;
  need(check, eventBound && verification?.occurrence_basis.established && (verification?.result_basis.established || competingResults), "attributable_check_result_association");
  if (competingResults) check.contradictions.push({ criterion: "T2-01-comparable-results", refs: verification!.result_basis.refs, records: verification!.result_basis.refs.map((ref: string) => d.verification.records[ref]) });
  if (!check.missing.length && !competingResults) {
    const value = verification!.result_basis.values[0];
    if (value === "failed") check.violations.push({ result: value, refs: verification!.result_basis.refs });
    else if (value === "inconclusive") check.undecidable.push({ result: value, refs: verification!.result_basis.refs });
    else check.satisfied = value === "passed";
  }
  // Custody has its own basis and does not depend on the check having passed.
  need(custody, !!roleFacts.producer && !!roleFacts.custodian, "custody_principal_identity");
  need(custody, record(event) && event.source_namespace === d.event_namespace && same(event, target, targetKeys)
    && verification?.occurrence_basis.established, "custody_native_event_association");
  const criterion = get(d.custody_criterion_ref, "custody_criterion", custody);
  const criterionOK = criterion && provenance(criterion, custody) && need(custody, criterion.criterion_id === "no-sole-producer-substitution" && criterion.version === "0.1"
    && criterion.content.criterion === "all-retained-stages-through-check" && interval(d.custody_interval ?? {}), "named_custody_criterion_and_interval");
  need(custody, Array.isArray(d.members) && d.members.every(record), "custody_member_shape");
  const members = Array.isArray(d.members) ? d.members.filter(record) : [];
  need(custody, members.length > 0, "custody_members");
  const requiredRefs = new Set<string>();
  for (const ref of Array.isArray(d.verification?.result_refs) ? d.verification.result_refs : []) { const r = d.verification.records?.[ref]; if (record(r)) { requiredRefs.add(r.input_ref); requiredRefs.add(r.output_ref); } }
  need(custody, requiredRefs.size >= 2 && members.length === requiredRefs.size && new Set(members.map((m: JsonRecord) => m.verification_ref)).size === members.length
    && members.every((m: JsonRecord) => requiredRefs.has(m.verification_ref)), "relied_on_input_output_members");
  const segmentRefs = texts(d.custody_refs) ? d.custody_refs : [];
  need(custody, segmentRefs.every((ref: string) => record(records[ref]) && ["collection", "transfer", "transformation", "storage", "access_control"].includes(records[ref].stage) && members.some((m: JsonRecord) => m.member_ref === records[ref].member_ref)), "selected_custody_scope");
  for (const r of Object.values(records) as JsonRecord[]) if (record(r) && r.kind === "custody_segment" && !segmentRefs.includes(r.source_ref)) custody.missing.push("unselected_custody_candidate");
  for (const [index, m] of members.entries()) {
    const comparison = record(m.comparison) ? readIntegrityReceipt(integrityReceipts[index], m.comparison.input, m.comparison.path, m.comparison.contexts) : null;
    if (!need(custody, comparison, "T2_02_comparison:" + index)) continue;
    evidence.comparisons.push(comparison);
    const ce = comparison!.comparison_context.event, v = d.verification?.records?.[m.verification_ref];
    need(custody, record(v) && Object.hasOwn(v, "content") && same(v, target, ["subject", "revision", "scope"]) && v.source_namespace === event?.source_namespace && same(ce, target, ["subject", "revision", "scope"]) && m.content_sha256 === contentDigest(v.content)
      && m.representation === "canonical-json-utf8" && m.byte_domain === "supplied-verification-content" && comparison!.recomputed_digest === m.content_sha256
      && m.member_ref === ce.member_ref && m.member_namespace === ce.member_namespace && m.representation === ce.representation && m.byte_domain === ce.byte_domain
      && time(ce.time) && criterionOK && Date.parse(d.custody_interval.from) <= Date.parse(ce.time) && Date.parse(ce.time) <= Date.parse(d.custody_interval.until), "member_comparison_association:" + index);
    for (const stage of ["collection", "transfer", "transformation", "storage", "access_control"]) {
      const admitted: JsonRecord[] = [];
      for (const ref of segmentRefs) {
        const raw = records[ref]; if (record(raw) && (raw.stage !== stage || raw.member_ref !== m.member_ref)) continue;
        const start = custody.missing.length, r = get(ref, "custody_segment", custody); if (!r) continue;
        need(custody, criterionOK && r.criterion_ref === d.custody_criterion_ref && r.criterion_version === criterion!.version
          && r.stage === stage && r.member_ref === m.member_ref && r.member_namespace === m.member_namespace && r.representation === m.representation && r.byte_domain === m.byte_domain
          && r.verification_ref === m.verification_ref && r.content_sha256 === m.content_sha256 && r.expected_digest === comparison!.expected_digest && r.recomputed_digest === comparison!.recomputed_digest
          && r.custodian === principals.custodian && r.producer === principals.producer && r.from === d.custody_interval.from && r.until === d.custody_interval.until
          && interval(r) && Array.isArray(r.omissions) && !r.omissions.length, "custody_segment_association:" + ref);
        need(custody, r.method === "retained-access-and-custody-record/0.1" && ["decided", "undecidable"].includes(r.result)
          && nonempty(r.content.operation) && (r.result === "undecidable" ? nonempty(r.content.undecidable_reason) : typeof r.content.producer_can_substitute === "boolean"), "custody_segment_method:" + ref);
        provenance(r, custody);
        if (start === custody.missing.length) admitted.push(r);
      }
      need(custody, admitted.length, "custody_stage:" + index + ":" + stage);
      for (const r of admitted) {
        if (r.result === "undecidable") custody.undecidable.push(r);
        else if (r.content.producer_can_substitute || r.custodian === r.producer) custody.violations.push(r);
      }
      for (let i = 0; i < admitted.length; i++) for (const b of admitted.slice(i + 1)) {
        const a = admitted[i]; if (a.result === "decided" && b.result === "decided" && a.content.producer_can_substitute !== b.content.producer_can_substitute) custody.contradictions.push({ criterion: "same-member-stage-interval", refs: [a.source_ref, b.source_ref].sort(), records: [a, b] });
      }
    }
  }
  custody.satisfied = !custody.missing.length && !custody.violations.length && !custody.contradictions.length && !custody.undecidable.length;
  for (const b of [identity, separation, custody, check]) b.missing = [...new Set(b.missing)].sort();
  freeze(evidence);
  const finding = Object.freeze({ evidence });
  findings.set(finding, { context: context(source, core, trust, contexts, collection), evidence });
  return Object.freeze({ finding, evidence });
}

/** Process-local identity plus exact admitted context. JSON copies carry no authority. */
export function readIndependenceFinding(finding: unknown, input: unknown, core: unknown, trust: AdmissionTrust, contexts: readonly RequirementContext[], collection: unknown, path: string) {
  if (!finding || typeof finding !== "object") return null;
  const saved = findings.get(finding); if (!saved) return null;
  try {
    if (saved.context !== context(input, core, trust, contexts, collection)) return null;
    const requests = (input as JsonRecord).requests.filter((r: JsonRecord) => r.path === path);
    if (requests.length !== 1 || requests[0].semantic_version !== "0.1.0" || !["verification.independent", "custody.independent"].includes(requests[0].claim)) return null;
  } catch { return null; }
  return saved.evidence;
}
