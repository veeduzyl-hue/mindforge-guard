import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { snapshot, stableJson, parseJsonBytes, VERSION } from './github_change_source_snapshot_v0.1.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const script = join(root, 'scripts/github_change_source_snapshot_v0.1.mjs');
const fixture = join(root, 'tests/fixtures/github-change-source-snapshot-v0.1/synthetic-pr.json');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const clone = v => JSON.parse(JSON.stringify(v));
const bytes = await readFile(fixture), base = parseJsonBytes(bytes);
const tests = [];
function check(name, mutate, code = null, inspect = () => {}) {
  const input = clone(base); mutate(input);
  const before = stableJson(input);
  const result = snapshot(input);
  assert.equal(stableJson(input), before, name + ': input changed');
  assert.equal(result.assurance, 'ASSURANCE_NOT_EVALUATED');
  if (code) {
    assert.notEqual(result.source_record_status, 'OBSERVED', name);
    assert.ok(result.issues.some(x => x.code === code), name + ': ' + code + ' missing ' + stableJson(result.issues));
  } else assert.equal(result.source_record_status, 'OBSERVED', name + ': ' + stableJson(result.issues));
  assert.equal(stableJson(result), stableJson(snapshot(input)), name + ': deterministic');
  inspect(result);
  tests.push({ name, category: code ? 'NEGATIVE' : 'POSITIVE', outcome: 'PASS' });
}
const response = (v, kind) => v.responses.find(r => r.kind === kind);
const updatePR = v => { response(v, 'pr').raw_base64 = null; };
const sha = n => String(n).repeat(40);
function bindInspected(v, value) {
  const old = v.inspected.sha; v.inspected.sha = value;
  for (const kind of ['inspected_commit', 'check_runs', 'statuses']) {
    const r = response(v, kind); r.locator = r.locator.replace(old, value);
    if (kind === 'inspected_commit') { r.body.sha = value; r.body.url = r.body.url.replace(old, value); }
    if (kind === 'check_runs') for (const c of r.body.check_runs) c.head_sha = value;
    if (kind === 'statuses') for (const s of r.body) s.url = s.url.replace(old, value);
  }
}
check('base-head-inspected-merge-distinct', () => {}, null, r => {
  assert.equal(r.pull_request.base_sha, sha(1)); assert.equal(r.pull_request.head_sha, sha(3));
  assert.equal(r.inspected_commit.sha, sha(2)); assert.equal(r.pull_request.actual_merge_commit_sha, sha(4));
  assert.match(r.changed_files.comparison, /NOT_AUTOMATICALLY_INSPECTED/);
});
check('explicit-head-selection', v => {
  bindInspected(v, sha(3)); response(v, 'inspected_commit').body.parents = [{ sha: sha(2) }];
  v.inspected.selection_basis = { kind: 'PR_HEAD', source_locator: response(v, 'pr').locator,
    source_pointer: '/head/sha', explanation: 'Explicit caller selects observed head.' };
});
check('actual-merge-selection', v => {
  bindInspected(v, sha(4)); response(v, 'inspected_commit').body.parents = [{ sha: sha(1) }, { sha: sha(3) }];
  v.inspected.selection_basis = { kind: 'MERGE_COMMIT', source_locator: response(v, 'pr').locator,
    source_pointer: '/merge_commit_sha', explanation: 'Explicit caller selects actual observed merge.' };
});
check('genuinely-empty-query-observation', v => {
  response(v, 'check_runs').body = { total_count: 0, check_runs: [] };
  response(v, 'statuses').body = [];
}, null, r => {
  assert.equal(r.check_runs.state, 'EMPTY_OBSERVED_SET'); assert.equal(r.statuses.state, 'EMPTY_OBSERVED_SET');
});
check('merge-not-yet-available', v => { updatePR(v); Object.assign(response(v, 'pr').body, { merged: false, merged_at: null, merge_commit_sha: sha(4) }); }, null,
  r => { assert.equal(r.pull_request.actual_merge_commit_sha, null); assert.equal(r.pull_request.reported_merge_commit_sha, sha(4)); });
check('no-original-bytes-does-not-invent-hash', v => { response(v, 'pr').raw_base64 = null; }, null,
  r => assert.equal(r.sources[0].original_response_bytes, null));
check('raw-only-response-parses-without-reconstructed-bytes', v => { response(v, 'pr').body = null; }, null,
  r => { assert.equal(r.pull_request.head_sha, sha(3)); assert.ok(r.sources[0].original_response_bytes.sha256); });
check('source-event-time-missing-not-capture-time', v => { updatePR(v); delete response(v, 'pr').body.created_at; }, null,
  r => assert.equal(r.pull_request.event_times.created_at, null));
check('missing-selection-basis', v => { delete v.inspected.selection_basis; }, 'INSPECTED_SELECTION_BASIS_REQUIRED');
check('missing-explicit-inspected-sha', v => { delete v.inspected.sha; }, 'EXPLICIT_INSPECTED_SHA_REQUIRED');
check('unsupported-selection-kind', v => { v.inspected.selection_basis.kind = 'AUTO'; }, 'INSPECTED_SELECTION_NOT_SUPPORTED');
check('wrong-selection-pointer', v => { v.inspected.selection_basis.source_pointer = '/1/sha'; }, 'INSPECTED_SELECTION_NOT_SUPPORTED');
check('wrong-selection-locator', v => { v.inspected.selection_basis.source_locator = 'https://example.com'; }, 'INSPECTED_SELECTION_NOT_SUPPORTED');
check('no-selection-explanation', v => { v.inspected.selection_basis.explanation = ''; }, 'INSPECTED_SELECTION_NOT_SUPPORTED');
check('wrong-inspected-source-sha', v => { response(v, 'inspected_commit').body.sha = sha(9); }, 'INSPECTED_COMMIT_IDENTITY_CONFLICT');
check('same-sha-parent-relationship-conflict', v => { response(v, 'inspected_commit').body.parents = [{ sha: sha(9) }]; }, 'COMMIT_PARENT_RELATIONSHIP_CONFLICT');
check('commit-list-cross-repository-link', v => { response(v, 'commits').body[0].url = 'https://api.github.com/repos/other/repo/commits/' + sha(2); }, 'PR_COMMIT_REPOSITORY_CONFLICT');
check('missing-parent-evidence', v => { delete response(v, 'inspected_commit').body.parents; }, 'PARENTS_UNAVAILABLE');
check('duplicate-parent-identity', v => { response(v, 'inspected_commit').body.parents.push({ sha: sha(1) }); }, 'DUPLICATE_PARENT_SHA');
check('missing-merged-state', v => { updatePR(v); delete response(v, 'pr').body.merged; }, 'MERGED_STATE_UNAVAILABLE');
check('cross-repository-checks', v => { response(v, 'check_runs').locator = response(v, 'check_runs').locator.replace('synthetic/adapter', 'other/repo'); }, 'SOURCE_LOCATOR_SCOPE_CONFLICT');
check('wrong-pr-number', v => { updatePR(v); response(v, 'pr').body.number = 43; }, 'PR_REPOSITORY_IDENTITY_CONFLICT');
check('wrong-repository-stable-id', v => { updatePR(v); response(v, 'pr').body.base.repo.id = 999; }, 'PR_REPOSITORY_IDENTITY_CONFLICT');
check('head-versus-commit-list-conflict', v => { updatePR(v); response(v, 'pr').body.head.sha = sha(8); }, 'PR_COMMIT_HEAD_CONFLICT');
check('hypothetical-merge-not-inspectable-as-actual', v => {
  updatePR(v); response(v, 'pr').body.merged = false; response(v, 'pr').body.merged_at = null;
  v.inspected.selection_basis.kind = 'MERGE_COMMIT';
}, 'INSPECTED_SELECTION_NOT_SUPPORTED');
check('contradictory-merge-time', v => { updatePR(v); response(v, 'pr').body.merged = false; }, 'MERGE_METADATA_CONFLICT');
check('changed-files-not-obtained', v => { Object.assign(response(v, 'files'), { state: 'NOT_OBTAINED', body: null, has_next: null }); }, 'SOURCE_NOT_OBTAINED',
  r => assert.equal(r.changed_files.state, 'NOT_OBTAINED'));
check('changed-file-count-conflict', v => { updatePR(v); response(v, 'pr').body.changed_files = 2; }, 'PR_COLLECTION_COUNT_CONFLICT');
check('changed-file-field-missing', v => { delete response(v, 'files').body[0].sha; }, 'FILE_OBSERVATION_INCOMPLETE');
check('rename-old-path-missing', v => { response(v, 'files').body[0].status = 'renamed'; }, 'FILE_OBSERVATION_INCOMPLETE');
check('file-count-arithmetic-conflict', v => { response(v, 'files').body[0].changes = 99; }, 'FILE_OBSERVATION_INCOMPLETE');
check('checks-not-obtained', v => { Object.assign(response(v, 'check_runs'), { state: 'NOT_OBTAINED', body: null, has_next: null }); }, 'SOURCE_NOT_OBTAINED',
  r => assert.equal(r.check_runs.state, 'NOT_OBTAINED'));
check('checks-query-incomplete', v => { response(v, 'check_runs').has_next = true; }, 'QUERY_INCOMPLETE',
  r => assert.equal(r.check_runs.state, 'INCOMPLETE'));
check('checks-query-unknown-pagination', v => { response(v, 'check_runs').has_next = null; }, 'QUERY_INCOMPLETE');
check('checks-empty-with-nonzero-total', v => { response(v, 'check_runs').body.check_runs = []; }, 'COLLECTION_COUNT_CONFLICT');
check('checks-filter-latest-not-complete', v => { response(v, 'check_runs').locator = response(v, 'check_runs').locator.replace('filter=all', 'filter=latest'); }, 'SOURCE_LOCATOR_SCOPE_CONFLICT');
check('wrong-check-commit', v => { response(v, 'check_runs').body.check_runs[0].head_sha = sha(3); }, 'CHECK_COMMIT_IDENTITY_CONFLICT');
check('wrong-status-commit', v => { response(v, 'statuses').body[0].url = response(v, 'statuses').body[0].url.replace(sha(2), sha(3)); }, 'STATUS_COMMIT_IDENTITY_CONFLICT');
check('unsupported-source-event-time', v => { updatePR(v); response(v, 'pr').body.created_at = 'UNKNOWN'; }, 'SOURCE_EVENT_TIME_INVALID',
  r => assert.equal(r.pull_request.event_times.created_at, null));
check('missing-capture-time', v => { response(v, 'pr').captured_at = null; }, 'CAPTURE_TIME_UNAVAILABLE_OR_INVALID');
check('raw-parsed-content-conflict', v => { response(v, 'pr').body.head.sha = sha(9); }, 'RAW_PARSED_BODY_CONFLICT');
check('raw-invalid-utf8', v => { response(v, 'pr').raw_base64 = Buffer.from([255]).toString('base64'); }, 'RAW_BYTES_INVALID_JSON_OR_ENCODING');
check('raw-duplicate-decoded-key', v => { response(v, 'pr').raw_base64 = Buffer.from('{"x":1,"\\u0078":2}').toString('base64'); }, 'RAW_BYTES_INVALID_JSON_OR_ENCODING');
check('raw-invalid-base64', v => { response(v, 'pr').raw_base64 = '%%%'; }, 'RAW_BYTES_INVALID_JSON_OR_ENCODING');
check('unknown-file-list-preserved-unresolved', v => { response(v, 'files').body = 'UNKNOWN'; }, 'SOURCE_COLLECTION_UNKNOWN');
check('not-obtained-with-payload', v => { response(v, 'pr').state = 'NOT_OBTAINED'; }, 'NOT_OBTAINED_WITH_PAYLOAD');
check('missing-source-response', v => { v.responses = v.responses.filter(r => r.kind !== 'pr'); }, 'SOURCE_NOT_OBTAINED');
check('duplicate-single-source', v => { v.responses.push(clone(response(v, 'pr'))); }, 'DUPLICATE_SOURCE');
check('duplicate-page', v => { v.responses.push(clone(response(v, 'files'))); }, 'QUERY_INCOMPLETE');
check('missing-first-page', v => { const r = response(v, 'files'); r.page = 2; r.locator = r.locator.replace('page=1', 'page=2'); }, 'QUERY_INCOMPLETE');
check('explicit-incomplete-response', v => { response(v, 'check_runs').state = 'INCOMPLETE'; }, 'QUERY_INCOMPLETE');
check('unknown-pr-base-sha', v => { updatePR(v); response(v, 'pr').body.base.sha = 'UNKNOWN'; }, 'COMMIT_SHA_UNKNOWN',
  r => assert.ok(r.issues.some(i => i.kind === 'UNKNOWN' && i.path === 'pr.base.sha')));
check('unsupported-version', v => { v.schema_version = 'other'; }, 'UNSUPPORTED_VERSION');
check('unsupported-session-input', v => { v.agent_session = {}; }, 'UNSUPPORTED_FIELD');
check('unsupported-source-kind', v => { v.responses.push({ ...clone(response(v, 'pr')), kind: 'agent_session' }); }, 'UNSUPPORTED_SOURCE_KIND');

// R1 bounded corrections: expectations are fixed before invoking the adapter.
const originalCaseCount = tests.length;
assert.equal(tests.filter(t => t.category === 'POSITIVE').length, 8);
assert.equal(tests.filter(t => t.category === 'NEGATIVE').length, 47);
check('R1-I16-same-full-name-conflicting-id', v => {
  updatePR(v); response(v, 'pr').body.head.repo.full_name = v.repository.full_name;
}, 'REPOSITORY_STABLE_ID_CONFLICT');
check('R1-I17-zero-head-id', v => { updatePR(v); response(v, 'pr').body.head.repo.id = 0; }, 'REPOSITORY_STABLE_ID_INVALID');
for (const invalid of [-1, '102', false, 1.5]) check('R1-invalid-head-id-' + String(invalid), v => {
  updatePR(v); response(v, 'pr').body.head.repo.id = invalid;
}, 'REPOSITORY_STABLE_ID_INVALID');
check('R1-case-insensitive-name-id-conflict', v => {
  updatePR(v); response(v, 'pr').body.head.repo.full_name = 'SYNTHETIC/ADAPTER';
}, 'REPOSITORY_STABLE_ID_CONFLICT');
check('R1-valid-same-repository', v => {
  updatePR(v); response(v, 'pr').body.head.repo = { id: 101, full_name: 'synthetic/adapter' };
});
check('R1-valid-case-insensitive-same-repository', v => {
  updatePR(v); response(v, 'pr').body.head.repo = { id: 101, full_name: 'SYNTHETIC/ADAPTER' };
});
check('R1-valid-fork', () => {});
check('R1-missing-head-identity', v => { updatePR(v); delete response(v, 'pr').body.head.repo; }, 'REPOSITORY_IDENTITY_UNAVAILABLE');
check('R1-missing-base-identity', v => { updatePR(v); delete response(v, 'pr').body.base.repo; }, 'REPOSITORY_IDENTITY_UNAVAILABLE');
check('R1-unknown-head-id', v => { updatePR(v); response(v, 'pr').body.head.repo.id = 'UNKNOWN'; }, 'REPOSITORY_STABLE_ID_UNAVAILABLE');
check('R1-self-report-cannot-override-conflict', v => {
  updatePR(v); Object.assign(response(v, 'pr').body.head.repo, { full_name: 'synthetic/adapter', consistency: true });
}, 'REPOSITORY_STABLE_ID_CONFLICT');
check('R1-self-parent-inspected-source', v => { response(v, 'inspected_commit').body.parents = [{ sha: sha(2) }]; }, 'COMMIT_SELF_PARENT');
check('R1-self-parent-other-pr-commit', v => { response(v, 'commits').body[1].parents = [{ sha: sha(3) }]; }, 'COMMIT_SELF_PARENT');
check('R1-I19-both-sources-self-parent', v => {
  response(v, 'commits').body[0].parents = [{ sha: sha(2) }];
  response(v, 'inspected_commit').body.parents = [{ sha: sha(2) }];
}, 'COMMIT_SELF_PARENT');
check('R1-normal-single-parent', () => {});
check('R1-normal-distinct-multiple-parents', v => {
  response(v, 'commits').body[0].parents = [{ sha: sha(1) }, { sha: sha(8) }];
  response(v, 'inspected_commit').body.parents = [{ sha: sha(1) }, { sha: sha(8) }];
});
check('R1-both-parent-sources-missing', v => {
  delete response(v, 'commits').body[0].parents; delete response(v, 'inspected_commit').body.parents;
}, 'PARENTS_UNAVAILABLE', o => assert.equal(o.inspected_commit.parents, null));
check('R1-I18-queued-success-and-completed-time', v => { response(v, 'check_runs').body.check_runs[0].status = 'queued'; }, 'CHECK_NONFINAL_CONCLUSION_CONFLICT');
check('R1-queued-success-only', v => {
  Object.assign(response(v, 'check_runs').body.check_runs[0], { status: 'queued', completed_at: null });
}, 'CHECK_NONFINAL_CONCLUSION_CONFLICT');
check('R1-queued-completed-time-only', v => {
  Object.assign(response(v, 'check_runs').body.check_runs[0], { status: 'queued', conclusion: null });
}, 'CHECK_NONFINAL_COMPLETED_AT_CONFLICT');
check('R1-in-progress-success', v => {
  Object.assign(response(v, 'check_runs').body.check_runs[0], { status: 'in_progress', completed_at: null });
}, 'CHECK_NONFINAL_CONCLUSION_CONFLICT');
check('R1-valid-queued', v => {
  Object.assign(response(v, 'check_runs').body.check_runs[0], { status: 'queued', conclusion: null, completed_at: null, started_at: null });
});
check('R1-valid-in-progress', v => {
  Object.assign(response(v, 'check_runs').body.check_runs[0], { status: 'in_progress', conclusion: null, completed_at: null });
});
check('R1-valid-completed-success', () => {});
check('R1-completed-conclusion-missing', v => { response(v, 'check_runs').body.check_runs[0].conclusion = null; }, 'CHECK_CONCLUSION_UNAVAILABLE');
check('R1-completed-time-missing', v => { response(v, 'check_runs').body.check_runs[0].completed_at = null; }, 'CHECK_COMPLETED_TIME_UNAVAILABLE',
  o => assert.equal(o.check_runs.records[0].completed_at, null));
check('R1-active-completion-field-missing', v => {
  const c = response(v, 'check_runs').body.check_runs[0]; c.status = 'in_progress'; c.conclusion = null; delete c.completed_at;
}, 'CHECK_COMPLETED_TIME_UNAVAILABLE');
check('R1-unknown-conclusion', v => { response(v, 'check_runs').body.check_runs[0].conclusion = 'UNKNOWN'; }, 'CHECK_CONCLUSION_UNKNOWN');
check('R1-unknown-completion-time', v => { response(v, 'check_runs').body.check_runs[0].completed_at = 'UNKNOWN'; }, 'SOURCE_EVENT_TIME_INVALID');
check('R1-completion-precedes-start', v => { response(v, 'check_runs').body.check_runs[0].completed_at = '2026-10-14T12:00:00Z'; }, 'CHECK_TIME_ORDER_CONFLICT');
check('R1-commit-status-pending-remains-separate', v => { response(v, 'statuses').body[0].state = 'pending'; });
check('R1-check-source-missing-not-empty', v => {
  Object.assign(response(v, 'check_runs'), { state: 'NOT_OBTAINED', body: null, has_next: null });
}, 'SOURCE_NOT_OBTAINED', o => assert.equal(o.check_runs.state, 'NOT_OBTAINED'));

// Digest domains: same JSON value with different whitespace has different original hashes.
const rawA = clone(base), rawB = clone(base);
response(rawB, 'pr').raw_base64 = Buffer.from(JSON.stringify(response(rawB, 'pr').body)).toString('base64');
const identityA = snapshot(rawA).sources[0], identityB = snapshot(rawB).sources[0];
assert.notEqual(identityA.original_response_bytes.sha256, identityB.original_response_bytes.sha256);
assert.equal(identityA.normalized_json.sha256, identityB.normalized_json.sha256);
assert.equal(identityA.original_response_bytes.sha256, digest(Buffer.from(response(base, 'pr').raw_base64, 'base64')));
assert.throws(() => parseJsonBytes(Buffer.from('{"k":1,"\\u006b":2}')), /DUPLICATE_JSON_KEY/);
assert.throws(() => parseJsonBytes(Buffer.from([255])));
assert.throws(() => parseJsonBytes(Buffer.from('{')));
assert.throws(() => parseJsonBytes(Buffer.from('{"id":9007199254740993}')), /JSON_NUMBER_UNSUPPORTED/);
assert.throws(() => parseJsonBytes(Buffer.from('{"n":1e999}')), /JSON_NUMBER_UNSUPPORTED/);

// Deep freezing and detached output verify non-mutation beyond equality of serialized values.
function freeze(v) { if (v && typeof v === 'object') { Object.values(v).forEach(freeze); Object.freeze(v); } return v; }
snapshot(freeze(clone(base)));
const detachedInput = clone(base), detached = snapshot(detachedInput);
detached.repository.full_name = 'changed/output';
assert.equal(detachedInput.repository.full_name, base.repository.full_name);

async function inventory(dir, prefix = '') {
  const result = [];
  for (const d of (await readdir(dir, { withFileTypes: true })).sort((a, b) => a.name < b.name ? -1 : 1)) {
    const rel = prefix + d.name, absolute = join(dir, d.name);
    if (d.isDirectory()) result.push(...await inventory(absolute, rel + '/'));
    else { const content = await readFile(absolute); result.push({ path: rel, bytes: content.length, sha256: digest(content) }); }
  }
  return result;
}
const beforeFiles = await inventory(root);
// Node permission mode allows reading this standalone directory and denies filesystem writes,
// child process creation and worker creation inside the adapter process.
const launch = args => spawnSync(process.execPath, ['--permission', `--allow-fs-read=${root}`, script, ...args], {
  cwd: root, encoding: null, env: { SystemRoot: process.env.SystemRoot, PATH: process.env.PATH }
});
const first = launch(['--input', fixture]), second = launch(['--input', fixture]);
assert.equal(first.status, 0, first.stderr?.toString()); assert.equal(second.status, 0, second.stderr?.toString());
assert.deepEqual(first.stdout, second.stdout); assert.deepEqual(first.stderr, second.stderr);
assert.equal(first.stdout.toString(), stableJson(snapshot(base)) + '\n');
const disabled = launch([]);
assert.equal(disabled.status, 0); assert.equal(JSON.parse(disabled.stdout).source_record_status, 'DISABLED');
const usage = launch(['--network']); assert.equal(usage.status, 2);
const missing = launch(['--input', join(root, 'does-not-exist.json')]); assert.equal(missing.status, 2);
assert.equal(JSON.parse(missing.stdout).assurance, 'ASSURANCE_NOT_EVALUATED');
assert.deepEqual(await readFile(fixture), bytes);
assert.deepEqual(await inventory(root), beforeFiles);
const source = await readFile(script, 'utf8');
assert.ok(!/\b(?:fetch|https?|net|tls|writeFile|appendFile|mkdir|exec|spawn)\s*\(/.test(source));
assert.ok(!/from\s*['"](?!node:)/.test(source), 'Only Node built-in imports allowed');
assert.ok(!/\b(?:Guard|EAK|Harness|GovernanceReport|Permit)\s*\(/.test(source));
process.stdout.write(stableJson({ status: 'PASS', assurance: 'ASSURANCE_NOT_EVALUATED',
  original_regression: { positive: 8, negative: 47, status: 'PASS' },
  r1_corrections: { positive: tests.slice(originalCaseCount).filter(t => t.category === 'POSITIVE').length,
    negative: tests.slice(originalCaseCount).filter(t => t.category === 'NEGATIVE').length, status: 'PASS' },
  synthetic_positive_tests: tests.filter(t => t.category === 'POSITIVE').length,
  synthetic_negative_tests: tests.filter(t => t.category === 'NEGATIVE').length, tests,
  independent_process_output_sha256: digest(first.stdout), deterministic_output: 'PASS',
  input_unchanged: 'PASS', default_read_only: 'PASS', raw_and_normalized_hash_domains: 'PASS',
  readback_files: beforeFiles, product_executed: false, actual_session_acquired: false,
  canonical_evidencepack_created: false }) + '\n');
