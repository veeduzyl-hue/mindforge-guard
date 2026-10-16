import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const VERSION = 'github-pr-change-source-snapshot/v0.1';
const obj = x => x !== null && typeof x === 'object' && !Array.isArray(x);
const sha = x => typeof x === 'string' && /^[a-f0-9]{40}$/.test(x);
const text = x => typeof x === 'string' && x.trim() === x && x.length > 0 && x !== 'UNKNOWN';
const count = x => Number.isSafeInteger(x) && x >= 0;
const time = x => typeof x === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z$/.test(x) &&
  Number.isFinite(Date.parse(x)) && new Date(x).toISOString().replace('.000Z', 'Z') === x.replace(/\.0{1,3}Z$/, 'Z');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
export function stableJson(v) {
  if (Array.isArray(v)) return '[' + v.map(stableJson).join(',') + ']';
  if (obj(v)) return '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + stableJson(v[k])).join(',') + '}';
  return JSON.stringify(v);
}

// Local input reader, not Guard's canonical parser or canonical byte algorithm.
export function parseJsonBytes(bytes) {
  if (bytes.length > 16 * 1024 * 1024) throw new Error('INPUT_TOO_LARGE');
  const s = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes);
  const value = JSON.parse(s, (_key, item) => {
    if (typeof item === 'number' && (!Number.isFinite(item) || (Number.isInteger(item) && !Number.isSafeInteger(item))))
      throw new Error('JSON_NUMBER_UNSUPPORTED');
    return item;
  });
  let i = 0;
  const ws = () => { while (/\s/.test(s[i] ?? '') && i < s.length) i++; };
  function string() {
    const start = i++;
    while (i < s.length) {
      if (s[i] === '\\') i += 2;
      else if (s[i++] === '"') break;
    }
    return JSON.parse(s.slice(start, i));
  }
  function scan(depth = 0) {
    if (depth > 128) throw new Error('JSON_DEPTH_LIMIT');
    ws();
    if (s[i] === '{') {
      i++; ws(); const keys = new Set();
      while (s[i] !== '}') {
        const key = string();
        if (keys.has(key)) throw new Error('DUPLICATE_JSON_KEY');
        keys.add(key); ws(); i++; scan(depth + 1); ws();
        if (s[i] === ',') { i++; ws(); } else break;
      }
      i++;
    } else if (s[i] === '[') {
      i++; ws();
      while (s[i] !== ']') { scan(depth + 1); ws(); if (s[i] === ',') i++; else break; }
      i++;
    } else if (s[i] === '"') string();
    else while (i < s.length && !/[\s,\]}]/.test(s[i])) i++;
  }
  scan();
  return value;
}

export function snapshot(input) {
  // Pure JSON-data interface. Cloning detaches output observations from the caller.
  const v = parseJsonBytes(Buffer.from(JSON.stringify(input)));
  const issues = [];
  const add = (kind, code, path) => issues.push({ kind, code, path });
  function shape(value, keys, path) {
    if (!obj(value)) { add('INVALID', 'OBJECT_REQUIRED', path); return false; }
    for (const k of keys) if (!Object.hasOwn(value, k)) add('MISSING', 'REQUIRED_FIELD', path + '.' + k);
    for (const k of Object.keys(value)) if (!keys.includes(k)) add('INVALID', 'UNSUPPORTED_FIELD', path + '.' + k);
    return true;
  }
  const base = { snapshot_version: VERSION, assurance: 'ASSURANCE_NOT_EVALUATED',
    source_set: 'GITHUB_CHANGE_ONLY', source_authenticity: 'NOT_AUTHENTICATED',
    observation_scope: 'SUPPLIED_SOURCE_RECORDS_ONLY',
    limitations: ['GITHUB_RECORDS_ARE_NOT_COMPLETE_SOFTWARE_CHANGE_EVIDENCE',
      'EMPTY_CHECK_QUERY_DOES_NOT_ESTABLISH_NO_CHECKS_EVER_RAN',
      'NO_AGENT_SESSION_TASK_AUTHORIZATION_OR_S04_SUBJECT_BINDING',
      'NO_CANONICAL_PACKAGING_ASSURANCE_ACCEPTANCE_OR_EXECUTION_AUTHORITY',
      'PAGINATION_AND_CAPTURE_METADATA_ARE_CALLER_DECLARATIONS'], issues };
  function finish(fields = {}) {
    issues.sort((a, b) => stableJson(a) < stableJson(b) ? -1 : stableJson(a) > stableJson(b) ? 1 : 0);
    const source_record_status = issues.some(x => x.kind === 'CONFLICT') ? 'CONFLICTING' :
      issues.some(x => x.kind === 'INVALID') ? 'INVALID' : issues.length ? 'INCOMPLETE' : 'OBSERVED';
    return { ...base, ...fields, source_record_status };
  }
  if (!shape(v, ['schema_version', 'repository', 'pr_number', 'inspected', 'responses'], '$')) return finish();
  if (v.schema_version !== VERSION) add('INVALID', 'UNSUPPORTED_VERSION', '$.schema_version');
  const repoOK = shape(v.repository, ['id', 'full_name'], '$.repository') &&
    Number.isSafeInteger(v.repository.id) && v.repository.id > 0 &&
    typeof v.repository.full_name === 'string' && /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(v.repository.full_name);
  if (!repoOK) add('INVALID', 'REPOSITORY_IDENTITY_REQUIRED', '$.repository');
  if (!Number.isSafeInteger(v.pr_number) || v.pr_number < 1) add('INVALID', 'PR_NUMBER_REQUIRED', '$.pr_number');
  if (!Array.isArray(v.responses)) { add('INVALID', 'RESPONSES_REQUIRED', '$.responses'); return finish(); }
  if (!repoOK) return finish();
  const api = `https://api.github.com/repos/${v.repository.full_name}`;
  const web = `https://github.com/${v.repository.full_name}`;
  const prAPI = `${api}/pulls/${v.pr_number}`;
  const ref = (r, pointer) => ({ locator: r.locator, pointer });
  const ledger = [], groups = new Map();
  const inspectedSHA = v.inspected?.sha;
  const endpoints = { pr: prAPI, commits: `${prAPI}/commits`, files: `${prAPI}/files`,
    inspected_commit: `${api}/commits/${inspectedSHA}`,
    check_runs: `${api}/commits/${inspectedSHA}/check-runs`, statuses: `${api}/commits/${inspectedSHA}/statuses` };
  const collectionKinds = ['commits', 'files', 'check_runs', 'statuses'];
  for (const [index, r] of v.responses.entries()) {
    const p = `$.responses[${index}]`;
    if (!shape(r, ['kind', 'locator', 'captured_at', 'state', 'page', 'has_next', 'body', 'raw_base64'], p)) continue;
    if (!Object.hasOwn(endpoints, r.kind)) { add('INVALID', 'UNSUPPORTED_SOURCE_KIND', p + '.kind'); continue; }
    if (!time(r.captured_at)) add('MISSING', 'CAPTURE_TIME_UNAVAILABLE_OR_INVALID', p + '.captured_at');
    if (!['OBTAINED', 'NOT_OBTAINED', 'INCOMPLETE'].includes(r.state)) add('INVALID', 'INVALID_RETRIEVAL_STATE', p + '.state');
    const collection = collectionKinds.includes(r.kind);
    let locatorOK = false;
    try {
      const u = new URL(r.locator), wanted = new URL(endpoints[r.kind]);
      locatorOK = u.origin === wanted.origin && u.pathname === wanted.pathname && !u.hash && !u.username && !u.password;
      if (collection) {
        const required = { per_page: '100', page: String(r.page), ...(r.kind === 'check_runs' ? { filter: 'all' } : {}) };
        locatorOK &&= Number.isSafeInteger(r.page) && r.page > 0 && [...u.searchParams].length === Object.keys(required).length &&
          Object.entries(required).every(([k, val]) => u.searchParams.get(k) === val);
      } else locatorOK &&= !u.search && r.page === null && r.has_next === null;
    } catch { /* Retain explicit locator conflict below. */ }
    if (!locatorOK) add('CONFLICT', 'SOURCE_LOCATOR_SCOPE_CONFLICT', p + '.locator');
    if (collection && ![true, false, null].includes(r.has_next)) add('INVALID', 'PAGINATION_STATE_REQUIRED', p + '.has_next');
    let body = r.body, original = null;
    if (r.raw_base64 !== null) {
      try {
        if (typeof r.raw_base64 !== 'string' || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(r.raw_base64)) throw new Error();
        const bytes = Buffer.from(r.raw_base64, 'base64');
        original = { sha256: hash(bytes), byte_length: bytes.length, domain: 'SUPPLIED_ORIGINAL_RESPONSE_BYTES' };
        const decoded = parseJsonBytes(bytes);
        if (r.body !== null && stableJson(decoded) !== stableJson(r.body)) add('CONFLICT', 'RAW_PARSED_BODY_CONFLICT', p + '.body');
        body = decoded;
      } catch { add('INVALID', 'RAW_BYTES_INVALID_JSON_OR_ENCODING', p + '.raw_base64'); body = null; }
    }
    if (r.state === 'NOT_OBTAINED' && (body !== null || original !== null)) add('CONFLICT', 'NOT_OBTAINED_WITH_PAYLOAD', p);
    if (r.state !== 'NOT_OBTAINED' && body === null) add('MISSING', 'RESPONSE_BODY_MISSING', p + '.body');
    ledger.push({ kind: r.kind, locator: r.locator, captured_at: time(r.captured_at) ? r.captured_at : null,
      retrieval_state: r.state, page: r.page, has_next: r.has_next,
      original_response_bytes: original,
      original_bytes_state: original ? 'SUPPLIED_NOT_AUTHENTICATED' : 'NOT_OBTAINED',
      normalized_json: body === null ? null : { sha256: hash(Buffer.from(stableJson(body))),
        domain: 'ADAPTER_SORTED_JSON_UTF8_V1_NOT_ORIGINAL_BYTES' } });
    const list = groups.get(r.kind) ?? [];
    list.push({ ...r, body, path: p, locatorOK }); groups.set(r.kind, list);
  }
  function single(kind) {
    const rows = groups.get(kind) ?? [];
    if (rows.length !== 1) { add(rows.length ? 'CONFLICT' : 'MISSING', rows.length ? 'DUPLICATE_SOURCE' : 'SOURCE_NOT_OBTAINED', kind); return null; }
    const r = rows[0];
    if (r.state !== 'OBTAINED' || !obj(r.body)) { add('MISSING', 'SOURCE_NOT_OBTAINED_OR_INCOMPLETE', kind); return null; }
    return r;
  }
  function collection(kind, extract) {
    const rows = (groups.get(kind) ?? []).slice().sort((a, b) => a.page - b.page);
    let complete = rows.length > 0, total = null;
    const items = [];
    if (!rows.length || rows.every(r => r.state === 'NOT_OBTAINED')) {
      add('MISSING', 'SOURCE_NOT_OBTAINED', kind);
      return { state: 'NOT_OBTAINED', items, declared_pagination_complete: false };
    }
    for (const [i, r] of rows.entries()) {
      const values = extract(r.body);
      if (!Array.isArray(values)) {
        add(r.body === 'UNKNOWN' ? 'UNKNOWN' : 'INVALID', r.body === 'UNKNOWN' ? 'SOURCE_COLLECTION_UNKNOWN' : 'COLLECTION_BODY_REQUIRED', r.path);
        complete = false;
      }
      else {
        if (values.length > 100) { add('CONFLICT', 'PAGE_SIZE_CONFLICT', r.path); complete = false; }
        for (const [j, value] of values.entries()) items.push({ value, source: ref(r, kind === 'check_runs' ? `/check_runs/${j}` : `/${j}`) });
      }
      if (r.page !== i + 1 || r.state !== 'OBTAINED' || !r.locatorOK ||
          r.has_next !== (i < rows.length - 1)) complete = false;
      if (kind === 'check_runs') {
        if (!count(r.body?.total_count)) complete = false;
        else if (total !== null && total !== r.body.total_count) { add('CONFLICT', 'CHECK_TOTAL_CHANGED', r.path); complete = false; }
        else total = r.body.total_count;
      }
    }
    if (total !== null && total !== items.length) { complete = false; add('CONFLICT', 'COLLECTION_COUNT_CONFLICT', kind); }
    if (!complete) add('UNKNOWN', 'QUERY_INCOMPLETE', kind);
    return { state: complete ? items.length ? 'OBSERVED_SET' : 'EMPTY_OBSERVED_SET' : 'INCOMPLETE',
      declared_pagination_complete: complete, items };
  }
  function sourceTime(value, path) {
    if (value === null || value === undefined) return null;
    if (!time(value)) { add('UNKNOWN', 'SOURCE_EVENT_TIME_INVALID', path); return null; }
    return value;
  }
  const pr = single('pr'), commit = single('inspected_commit');
  const commits = collection('commits', b => b), files = collection('files', b => b);
  const checks = collection('check_runs', b => b?.check_runs), statuses = collection('statuses', b => b);
  const b = pr?.body;
  const readSHA = (value, path) => {
    if (value === 'UNKNOWN' || value === null) { add('UNKNOWN', 'COMMIT_SHA_UNKNOWN', path); return null; }
    if (!sha(value)) { add(value === undefined ? 'MISSING' : 'INVALID', 'COMMIT_SHA_UNAVAILABLE_OR_INVALID', path); return null; }
    return value;
  };
  const baseSHA = readSHA(b?.base?.sha, 'pr.base.sha'), headSHA = readSHA(b?.head?.sha, 'pr.head.sha');
  const reportedMerge = b?.merge_commit_sha ?? null;
  if (reportedMerge !== null && !sha(reportedMerge)) add('INVALID', 'MERGE_SHA_INVALID', 'pr.merge_commit_sha');
  if (b && (b.number !== v.pr_number || b.url !== prAPI || b.html_url !== web + '/pull/' + v.pr_number))
    add('CONFLICT', 'PR_REPOSITORY_IDENTITY_CONFLICT', 'pr');
  const repositoryIds = new Map([[v.repository.full_name.toLowerCase(), v.repository.id]]);
  for (const [role, identity] of [['base', b?.base?.repo], ['head', b?.head?.repo]]) {
    const path = 'pr.' + role + '.repo';
    if (!obj(identity)) {
      add(identity == null || identity === 'UNKNOWN' ? 'UNKNOWN' : 'INVALID', 'REPOSITORY_IDENTITY_UNAVAILABLE', path);
      continue;
    }
    const idKnown = identity.id != null && identity.id !== 'UNKNOWN';
    const nameKnown = identity.full_name != null && identity.full_name !== 'UNKNOWN';
    const idValid = Number.isSafeInteger(identity.id) && identity.id > 0;
    const nameValid = typeof identity.full_name === 'string' && /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(identity.full_name);
    if (!idKnown) add('UNKNOWN', 'REPOSITORY_STABLE_ID_UNAVAILABLE', path + '.id');
    else if (!idValid) add('INVALID', 'REPOSITORY_STABLE_ID_INVALID', path + '.id');
    if (!nameKnown) add('UNKNOWN', 'REPOSITORY_FULL_NAME_UNAVAILABLE', path + '.full_name');
    else if (!nameValid) add('INVALID', 'REPOSITORY_FULL_NAME_INVALID', path + '.full_name');
    if (!idKnown || !nameKnown || !idValid || !nameValid) continue;
    const key = identity.full_name.toLowerCase();
    if (repositoryIds.has(key) && repositoryIds.get(key) !== identity.id)
      add('CONFLICT', 'REPOSITORY_STABLE_ID_CONFLICT', path);
    else repositoryIds.set(key, identity.id);
    if (role === 'base' && (key !== v.repository.full_name.toLowerCase() || identity.id !== v.repository.id))
      add('CONFLICT', 'PR_REPOSITORY_IDENTITY_CONFLICT', path);
  }
  const mergedAt = sourceTime(b?.merged_at, 'pr.merged_at');
  if (b && typeof b.merged !== 'boolean') add('UNKNOWN', 'MERGED_STATE_UNAVAILABLE', 'pr.merged');
  const actualMerge = b?.merged === true && mergedAt && sha(reportedMerge) ? reportedMerge : null;
  if (b?.merged === true && !actualMerge) add('MISSING', 'ACTUAL_MERGE_IDENTITY_UNAVAILABLE', 'pr');
  if (b?.merged === false && mergedAt) add('CONFLICT', 'MERGE_METADATA_CONFLICT', 'pr');
  const seenCommits = new Set();
  for (const c of commits.items) {
    if (!sha(c.value?.sha)) add('INVALID', 'COMMIT_IDENTITY_INVALID', c.source.locator + c.source.pointer);
    if (c.value?.url !== `${api}/commits/${c.value?.sha}`) add('CONFLICT', 'PR_COMMIT_REPOSITORY_CONFLICT', c.source.locator + c.source.pointer);
    if (seenCommits.has(c.value?.sha)) add('CONFLICT', 'DUPLICATE_COMMIT', 'commits');
    seenCommits.add(c.value?.sha);
  }
  for (const [kind, col, expected] of [['commits', commits, b?.commits], ['files', files, b?.changed_files]]) {
    if (!count(expected)) add('MISSING', 'PR_COLLECTION_COUNT_UNAVAILABLE', kind);
    else if (col.declared_pagination_complete && col.items.length !== expected) { add('CONFLICT', 'PR_COLLECTION_COUNT_CONFLICT', kind); col.state = 'INCOMPLETE'; }
  }
  if (commits.declared_pagination_complete && commits.items.length && commits.items.at(-1).value?.sha !== headSHA)
    add('CONFLICT', 'PR_COMMIT_HEAD_CONFLICT', 'commits');
  const inspectedOK = shape(v.inspected, ['sha', 'selection_basis'], '$.inspected');
  if (!sha(inspectedSHA)) add('MISSING', 'EXPLICIT_INSPECTED_SHA_REQUIRED', '$.inspected.sha');
  const selection = v.inspected?.selection_basis;
  if (!inspectedOK || !shape(selection, ['kind', 'source_locator', 'source_pointer', 'explanation'], '$.inspected.selection_basis'))
    add('MISSING', 'INSPECTED_SELECTION_BASIS_REQUIRED', '$.inspected');
  else {
    let supported = false;
    if (selection.kind === 'PR_HEAD') supported = inspectedSHA === headSHA && selection.source_locator === pr?.locator && selection.source_pointer === '/head/sha';
    if (selection.kind === 'MERGE_COMMIT') supported = inspectedSHA === actualMerge && selection.source_locator === pr?.locator && selection.source_pointer === '/merge_commit_sha';
    if (selection.kind === 'PR_COMMIT') supported = commits.items.some(c => c.value?.sha === inspectedSHA && c.source.locator === selection.source_locator && c.source.pointer + '/sha' === selection.source_pointer);
    if (!supported || !text(selection.explanation)) add('CONFLICT', 'INSPECTED_SELECTION_NOT_SUPPORTED', '$.inspected.selection_basis');
  }
  if (commit && (commit.body.sha !== inspectedSHA || commit.body.url !== endpoints.inspected_commit)) add('CONFLICT', 'INSPECTED_COMMIT_IDENTITY_CONFLICT', 'inspected_commit');
  function parents(body, path) {
    if (!Array.isArray(body?.parents)) { add('MISSING', 'PARENTS_UNAVAILABLE', path); return null; }
    if (body.parents.some(p => !sha(p?.sha))) add('INVALID', 'PARENT_SHA_INVALID', path);
    if (new Set(body.parents.map(p => p?.sha)).size !== body.parents.length) add('CONFLICT', 'DUPLICATE_PARENT_SHA', path);
    if (sha(body.sha) && body.parents.some(p => p?.sha === body.sha)) add('CONFLICT', 'COMMIT_SELF_PARENT', path);
    return body.parents.map(p => p?.sha ?? null);
  }
  const commitObservations = commits.items.map(c => ({ sha: c.value?.sha ?? null, parents: parents(c.value, c.source.pointer), source: c.source }));
  if (commit) {
    for (const c of commits.items.filter(c => c.value?.sha === commit.body.sha)) {
      // Parent records may contain unrelated API metadata; compare ordered SHA identities only.
      const a = Array.isArray(c.value.parents) ? c.value.parents.map(p => p?.sha ?? null) : null;
      const b = Array.isArray(commit.body.parents) ? commit.body.parents.map(p => p?.sha ?? null) : null;
      if (stableJson(a) !== stableJson(b)) add('CONFLICT', 'COMMIT_PARENT_RELATIONSHIP_CONFLICT', 'inspected_commit.parents');
    }
  }
  const fileNames = new Set();
  const fileObservations = files.items.map(f => {
    const x = f.value;
    if (!obj(x) || !text(x.filename) || !['added', 'removed', 'modified', 'renamed', 'copied', 'changed', 'unchanged'].includes(x.status) ||
        !sha(x.sha) || !count(x.additions) || !count(x.deletions) || !count(x.changes) || x.changes !== x.additions + x.deletions ||
        (x.status === 'renamed' && !text(x.previous_filename))) { add('MISSING', 'FILE_OBSERVATION_INCOMPLETE', f.source.locator + f.source.pointer); files.state = 'INCOMPLETE'; }
    if (fileNames.has(x?.filename)) add('CONFLICT', 'DUPLICATE_FILE', 'files');
    fileNames.add(x?.filename);
    return { filename: x?.filename ?? null, status: x?.status ?? null, blob_sha: x?.sha ?? null,
      previous_filename: x?.previous_filename ?? null, additions: x?.additions ?? null, deletions: x?.deletions ?? null,
      changes: x?.changes ?? null, patch_state: typeof x?.patch === 'string' ? 'SUPPLIED_PATCH_MAY_BE_TRUNCATED' : 'NOT_OBTAINED', source: f.source };
  });
  function observedChecks(col, kind) {
    const ids = new Set();
    return col.items.map(item => {
      const x = item.value, path = item.source.locator + item.source.pointer;
      if (!obj(x) || !Number.isSafeInteger(x.id) || x.id < 1 || ids.has(x.id)) add('INVALID', 'CHECK_OR_STATUS_ID_INVALID_OR_DUPLICATE', path);
      ids.add(x?.id);
      if (kind === 'check_runs' && x?.head_sha !== inspectedSHA) add('CONFLICT', 'CHECK_COMMIT_IDENTITY_CONFLICT', path);
      if (kind === 'statuses' && x?.url !== `${api}/statuses/${inspectedSHA}`) add('CONFLICT', 'STATUS_COMMIT_IDENTITY_CONFLICT', path);
      if (kind === 'check_runs' && (!text(x?.name) || !['queued', 'in_progress', 'completed', 'waiting', 'pending', 'requested'].includes(x?.status) ||
          !(x?.conclusion == null || x?.conclusion === 'UNKNOWN' || ['success', 'failure', 'neutral', 'cancelled', 'skipped', 'timed_out', 'action_required', 'stale', 'startup_failure'].includes(x?.conclusion))))
        add('INVALID', 'CHECK_OBSERVATION_INVALID', path);
      if (kind === 'check_runs' && obj(x)) {
        const nonfinal = ['queued', 'in_progress', 'waiting', 'pending', 'requested'].includes(x.status);
        if (x.conclusion === undefined || (x.status === 'completed' && x.conclusion === null))
          add('MISSING', 'CHECK_CONCLUSION_UNAVAILABLE', path + '/conclusion');
        else if (x.conclusion === 'UNKNOWN') add('UNKNOWN', 'CHECK_CONCLUSION_UNKNOWN', path + '/conclusion');
        else if (nonfinal && x.conclusion !== null)
          add('CONFLICT', 'CHECK_NONFINAL_CONCLUSION_CONFLICT', path + '/conclusion');
        if (x.completed_at === undefined || (x.status === 'completed' && x.completed_at === null))
          add('MISSING', 'CHECK_COMPLETED_TIME_UNAVAILABLE', path + '/completed_at');
        else if (nonfinal && time(x.completed_at))
          add('CONFLICT', 'CHECK_NONFINAL_COMPLETED_AT_CONFLICT', path + '/completed_at');
        if (time(x.started_at) && time(x.completed_at) && Date.parse(x.completed_at) < Date.parse(x.started_at))
          add('CONFLICT', 'CHECK_TIME_ORDER_CONFLICT', path + '/completed_at');
      }
      if (kind === 'statuses' && (!text(x?.context) || !['error', 'failure', 'pending', 'success'].includes(x?.state))) add('INVALID', 'STATUS_OBSERVATION_INVALID', path);
      return kind === 'check_runs' ? { id: x?.id ?? null, name: x?.name ?? null, head_sha: x?.head_sha ?? null,
        status: x?.status ?? null, conclusion: x?.conclusion ?? null,
        started_at: sourceTime(x?.started_at, path + '/started_at'), completed_at: sourceTime(x?.completed_at, path + '/completed_at'), source: item.source } :
        { id: x?.id ?? null, context: x?.context ?? null, state: x?.state ?? null,
          created_at: sourceTime(x?.created_at, path + '/created_at'), updated_at: sourceTime(x?.updated_at, path + '/updated_at'), source: item.source };
    });
  }
  return finish({ repository: v.repository, pr_number: v.pr_number,
    pull_request: { base_sha: baseSHA, head_sha: headSHA, head_repository: b?.head?.repo ? { id: b.head.repo.id ?? null, full_name: b.head.repo.full_name ?? null } : null,
      reported_merge_commit_sha: reportedMerge, actual_merge_commit_sha: actualMerge,
      event_times: Object.fromEntries(['created_at', 'updated_at', 'closed_at', 'merged_at'].map(k => [k, sourceTime(b?.[k], 'pr.' + k)])),
      source: pr ? ref(pr, '') : null },
    inspected_commit: { sha: inspectedSHA ?? null, selection_basis: selection ?? null,
      parents: commit ? parents(commit.body, 'inspected_commit.parents') : null, source: commit ? ref(commit, '') : null },
    commit_relationship_evidence: { state: commits.state, records: commitObservations,
      relationship_scope: 'SUPPLIED_PARENT_LINKS_AND_PR_LIST_MEMBERSHIP_ONLY_NO_GRAPH_ANCESTRY_PROOF' },
    changed_files: { state: files.state, comparison: 'PR_BASE_TO_HEAD_NOT_AUTOMATICALLY_INSPECTED_COMMIT_DIFF', records: fileObservations },
    check_runs: { state: checks.state, records: observedChecks(checks, 'check_runs') },
    statuses: { state: statuses.state, records: observedChecks(statuses, 'statuses') }, sources: ledger });
}

export async function runCLI(args) {
  if (args.length === 0) return { exit_code: 0, output: { snapshot_version: VERSION, source_record_status: 'DISABLED', assurance: 'ASSURANCE_NOT_EVALUATED' } };
  if (args.length !== 2 || args[0] !== '--input' || !text(args[1])) return { exit_code: 2, output: { error: 'USAGE_EXPLICIT_INPUT_REQUIRED', assurance: 'ASSURANCE_NOT_EVALUATED' } };
  let bytes;
  try { bytes = await readFile(args[1]); } catch { return { exit_code: 2, output: { error: 'INPUT_READ_ERROR', assurance: 'ASSURANCE_NOT_EVALUATED' } }; }
  try {
    const output = snapshot(parseJsonBytes(bytes));
    return { exit_code: output.source_record_status === 'OBSERVED' ? 0 : 1, output };
  } catch { return { exit_code: 1, output: { error: 'INVALID_JSON_INPUT', assurance: 'ASSURANCE_NOT_EVALUATED' } }; }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const result = await runCLI(process.argv.slice(2));
  process.stdout.write(stableJson(result.output) + '\n'); process.exitCode = result.exit_code;
}
