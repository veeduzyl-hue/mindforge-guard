import { MESR_CORE_REGISTRY } from "../coreRegistry.ts";
import { MESR_CLAIM_BOUNDARIES } from "../claimBoundaries.ts";
import { MESR_REASON_CODE_BINDINGS } from "../reasonCodeBindings.ts";
import { MESR_CORE_MODULE } from "../moduleManifest.ts";
import { MESR_CORE_VERSION } from "../types.ts";
import { ADMISSION_CONTRACT, BYTE_METHOD, inputShapeIssues, nonempty, record, type AdmissionTrust, type AdmissionResult, type AdmissionDiagnostic, type JsonRecord } from "./contracts.ts";
import { canonicalJson, CanonicalInputError, compareCodePoints, contentDigest, parseExactJson, sha256Bytes } from "./canonicalBytes.ts";

const exactVersion = (value: unknown): value is string => typeof value === "string" && /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$/.test(value);
const sha = (value: unknown): value is string => typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
const asciiId = (value: unknown): value is string => typeof value === "string" && /^[A-Za-z0-9_.:-]+$/.test(value);
const ranks: Record<string, number> = { core: 0, domain_pack: 1, crosswalk: 2, institutional_profile: 3 };
const registryInventory = { entries: MESR_CORE_REGISTRY, boundaries: MESR_CLAIM_BOUNDARIES, reason_bindings: MESR_REASON_CODE_BINDINGS };
const registry = { version: MESR_CORE_VERSION, digest: contentDigest(registryInventory) };
const coreDigest = contentDigest(MESR_CORE_MODULE);

function freeze<T>(value: T): T {
  if (value && typeof value === "object") {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

/** Private, explicit invocation. Checks supplied data; publishes no composition or claims.
 * `trust` is independently pinned by the internal caller, never taken from the producer.
 * A checked contextual byte basis remains unusable for semantic composition until the
 * separate composition contract is implemented and accepted.
 */
export function inspectCanonicalAdmission(input: unknown, trust: AdmissionTrust): AdmissionResult {
  const result: AdmissionResult = {
    contract_version: ADMISSION_CONTRACT, status: "REJECTED", semantic_composition: "WITHHELD",
    semantic_entries: [], mappings: [], profiles: [], claims: [], diagnostics: [], input_issues: [], checked_basis: null,
  };
  const issue = (rule_id: string, subject: string, field: string, related_id = "") => {
    const diagnostic: AdmissionDiagnostic = { rule_id, subject, field, related_id, detail: rule_id };
    if (!result.diagnostics.some(row => canonicalJson(row) === canonicalJson(diagnostic))) result.diagnostics.push(diagnostic);
  };
  const finish = () => {
    result.diagnostics.sort((a, b) => {
      for (const key of ["rule_id", "subject", "field", "related_id", "detail"] as const) {
        const difference = compareCodePoints(a[key], b[key]); if (difference) return difference;
      }
      return 0;
    });
    result.input_issues.sort((a, b) => compareCodePoints(a.field, b.field) || compareCodePoints(a.code, b.code));
    return freeze(result);
  };
  try { canonicalJson(input); canonicalJson(trust); }
  catch (error) {
    if (!(error instanceof CanonicalInputError)) throw error;
    result.input_issues.push({ code: "INVALID_JSON_INPUT", field: "$" });
    return finish();
  }
  if (!record(trust) || !Array.isArray(trust.request_paths) || !trust.request_paths.every(nonempty)) {
    result.input_issues.push({ code: "INVALID_TRUST_SHAPE", field: "trust" }); return finish();
  }
  result.input_issues = inputShapeIssues(input, trust.request_paths);
  const source = input as JsonRecord;
  if (result.input_issues.length) {
    if (source?.kind === "composition") issue("LOCK_BASIS_UNRESOLVED", "composition", "shape");
    return finish();
  }
  if (source.kind === "claims") {
    // Only identity/shape checks here; no interpretation of request paths or labels.
    if (canonicalJson(source.registry ?? null) !== canonicalJson(registry)) issue("LOCK_REGISTRY_MISMATCH", "registry", "registry");
    for (const request of source.requests) {
      for (const id of request.semantic_ids) {
        const entry = MESR_CORE_REGISTRY.find(entry => entry.semantic_id === id);
        if (!entry || request.semantic_version !== entry.version) issue("LOCK_BASIS_UNRESOLVED", "request", "semantic_identity", id);
      }
    }
    if (!result.diagnostics.length) result.status = "CHECKED_INPUT_SHAPE";
    return finish();
  }

  // Raw text parsing is separate from semantic content hashing: duplicate keys may
  // never disappear through parsing, and text formatting affects only byte locks.
  const raw = source.raw_manifests;
  if (record(raw)) for (const [id, bytes] of Object.entries(raw)) {
    try { if (Buffer.from(bytes as string, "utf8").toString("utf8") !== bytes || !record(parseExactJson(bytes as string))) throw new CanonicalInputError("Manifest must be an object"); }
    catch (error) {
      if (!(error instanceof CanonicalInputError) && !(error instanceof SyntaxError)) throw error;
      result.input_issues.push({ code: "INVALID_MANIFEST_JSON", field: "raw_manifests." + id });
    }
  }
  if (result.input_issues.length) { issue("LOCK_BASIS_UNRESOLVED", "composition", "shape"); return finish(); }

  if (!nonempty(source.input_set_id)) issue("LOCK_BASIS_UNRESOLVED", "composition", "input_set_id");
  if (!exactVersion(source.registry?.version) || canonicalJson(source.registry ?? null) !== canonicalJson(registry)
    || canonicalJson(trust.registry ?? null) !== canonicalJson(registry)) issue("LOCK_REGISTRY_MISMATCH", "registry", "registry");
  const modules = source.modules as JsonRecord[];
  const byId = new Map<string, JsonRecord>();
  for (const module of modules) {
    if (byId.has(module.module_id)) issue("LOCK_DUPLICATE_MODULE_ID", module.module_id, "module_id");
    else byId.set(module.module_id, module);
    if (!asciiId(module.module_id) || !exactVersion(module.version)) issue("LOCK_BASIS_UNRESOLVED", module.module_id, "identity");
    if (module.core_compatibility !== ">=0.1.0 <0.2.0") issue("INCOMPATIBLE_CORE_VERSION", module.module_id, "core_compatibility");
  }
  const core = byId.get("mesr.core");
  if (!core || contentDigest(core) !== coreDigest || modules.filter(module => module.module_type === "core").length !== 1) issue("LOCK_REGISTRY_MISMATCH", "registry", "core");
  // Current Core must actually satisfy the retained numeric half-open interval.
  const [major, minor] = MESR_CORE_VERSION.split(".").map(Number);
  if (major !== 0 || minor !== 1) issue("LOCK_REGISTRY_MISMATCH", "registry", "core.version");
  const locks = source.lock;
  if (!Array.isArray(locks) || !record(raw)) { issue("LOCK_BASIS_UNRESOLVED", "composition", "lock"); return finish(); }
  const locked = new Map<string, JsonRecord>();
  for (const lock of locks) {
    if (locked.has(lock.module_id)) issue("LOCK_DUPLICATE_MODULE_ID", lock.module_id, "module_id");
    else locked.set(lock.module_id, lock);
  }
  const ids = [...byId.keys()].sort(compareCodePoints);
  if (canonicalJson([...locked.keys()].sort(compareCodePoints)) !== canonicalJson(ids)
    || canonicalJson(Object.keys(raw).sort(compareCodePoints)) !== canonicalJson(ids)) issue("LOCK_BASIS_UNRESOLVED", "composition", "manifest_set");
  const checked: JsonRecord[] = [];
  for (const module of [...byId.values()].sort((a, b) => ranks[a.module_type] - ranks[b.module_type] || compareCodePoints(a.module_id, b.module_id))) {
    const id = module.module_id, lock = locked.get(id), bytes = raw[id];
    if (!lock || typeof bytes !== "string") { issue("LOCK_BASIS_UNRESOLVED", id, "lock"); continue; }
    const content = contentDigest(module);
    const byteDigest = sha256Bytes(bytes), byteLength = Buffer.byteLength(bytes, "utf8");
    if (Object.keys(lock).some(key => !["module_id", "version", "byte_digest", "content_digest", "byte_length", "dependencies"].includes(key))
      || !exactVersion(lock.version) || lock.version !== module.version || !sha(lock.byte_digest) || !sha(lock.content_digest)
      || !Number.isSafeInteger(lock.byte_length) || lock.byte_length < 0
      || lock.byte_digest !== byteDigest || lock.content_digest !== content || lock.byte_length !== byteLength
      || canonicalJson(parseExactJson(bytes)) !== canonicalJson(module)) issue("LOCK_CONTENT_MISMATCH", id, "lock");
    if (module.dependencies.length !== lock.dependencies.length) issue("LOCK_CONTENT_MISMATCH", id, "dependencies");
    const dependencyIds = new Set<string>();
    for (const dependency of module.dependencies) {
      const target = byId.get(dependency.module_id);
      const dependencyLocks = lock.dependencies.filter((row: JsonRecord) => row.module_id === dependency.module_id);
      if (dependencyIds.has(dependency.module_id) || dependencyLocks.length !== 1) issue("LOCK_CONTENT_MISMATCH", id, "dependencies", dependency.module_id);
      dependencyIds.add(dependency.module_id);
      if (!exactVersion(dependency.version)) issue("LOCK_BASIS_UNRESOLVED", id, "dependencies.version", dependency.version);
      else if (!target || dependency.version !== target.version) issue("LOCK_DEPENDENCY_VERSION_MISMATCH", id, "dependencies", dependency.module_id);
      const pin = dependencyLocks[0];
      if (!pin || Object.keys(pin).some(key => !["module_id", "version", "content_digest"].includes(key)) || pin.version !== dependency.version) issue("LOCK_CONTENT_MISMATCH", id, "dependencies", dependency.module_id);
      if (target && (!pin || pin.content_digest !== contentDigest(target))) issue("LOCK_CONTENT_MISMATCH", id, "dependencies.digest", dependency.module_id);
    }
    checked.push({ module_id: id, module_type: module.module_type, version: module.version, namespace: module.semantic_namespace,
      manifest_byte_ref: `raw_manifests.${id}`, representation: "supplied JSON text; UTF-8", byte_length: byteLength,
      byte_digest: byteDigest, semantic_content_digest: content,
      dependencies: structuredClone(lock.dependencies), compatibility_basis_ref: trust.proof_ref,
      entries: module.added_semantics.map((entry: JsonRecord) => ({ semantic_id: entry.semantic_id, version: entry.version, digest: contentDigest(entry) })),
    });
  }
  // Admission proof comparison needs resolved locks. Retain independently evaluable
  // byte/version failures above; do not claim semantic inference over their basis.
  if (result.diagnostics.length) return finish();
  if (!record(source.admission_basis) || !record(trust.proof) || !sha(trust.proof_digest) || !nonempty(trust.proof_ref)
    || contentDigest(trust.proof) !== trust.proof_digest || contentDigest(source.admission_basis) !== trust.proof_digest
    || !["id", "issuer", "authority", "source", "proof"].every(key => nonempty(trust.proof[key])) || !Array.isArray(trust.modules)) {
    issue("LOCK_NONINTERFERENCE_UNPROVEN", "composition", "admission_basis"); return finish();
  }
  for (const module of modules) {
    const matches = trust.modules.filter(candidate => candidate.module_id === module.module_id);
    const proofRows = trust.proof.module_digests;
    const proofMatches = Array.isArray(proofRows) ? proofRows.filter((row: JsonRecord) => row.module_id === module.module_id) : [];
    if (matches.length !== 1 || contentDigest(matches[0]) !== contentDigest(module)
      || proofMatches.length !== 1 || proofMatches[0].digest !== contentDigest(module)) issue("LOCK_NONINTERFERENCE_UNPROVEN", "composition", "admission_basis");
  }
  if (result.diagnostics.length) return finish();
  result.status = "CHECKED_BASIS";
  result.checked_basis = {
    contract_version: "mesr-composition-lock/0.1", input_set_id: source.input_set_id,
    registry: { ...registry, canonicalization_method: BYTE_METHOD, versioned_inventory_digest: contentDigest({ version: MESR_CORE_VERSION, ...registryInventory }), core: { module_id: "mesr.core", version: MESR_CORE_VERSION, digest: coreDigest } },
    modules: checked, relation_ledger_ref: { digest: contentDigest(source.relations ?? null), supplied: Object.hasOwn(source, "relations"), evaluated: false },
    admission_basis_refs: [{ id: trust.proof.id, issuer: trust.proof.issuer, authority: trust.proof.authority, source: trust.proof.source, ref: trust.proof_ref, digest: trust.proof_digest }], validation_method: BYTE_METHOD,
  };
  return finish();
}
