import { readFile, writeFile, mkdir, realpath, stat } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { checkInventory, readInventory, VERSION } from './check_static_inventory_contract_v0.1.mjs';

const clone = v => JSON.parse(JSON.stringify(v));
const base = {
  schema_version: VERSION, inventory_status: 'PARTIAL', complete: false,
  assertions: [{
    assertion_id: 'SYN-A-1', case_id: 'SYN-CASE-1', evidence_domain: 'SYNTHETIC',
    owner: 'SYN-OWNER', source_ref: { artifact_id: 'SYN-SOURCE', pointer: '/items/0' },
    source_pointer: '/items/0', assertion_site: 'SYN-CHECK-1',
    iteration_key: { scope: 'SYN-LOOP', value: '0' },
    expected_ref: { artifact_id: 'SYN-EXPECTED', pointer: '/expected/0' },
    comparator_route_ref: 'SYN-R-CMP', control_route_ref: 'SYN-R-CTL',
    applicability: 'APPLICABLE'
  }],
  routes: [
    { route_id: 'SYN-R-CMP', route_kind: 'COMPARATOR', source_ref: { artifact_id: 'SYN-ROUTES', pointer: '/comparator' } },
    { route_id: 'SYN-R-CTL', route_kind: 'CONTROL', source_ref: { artifact_id: 'SYN-ROUTES', pointer: '/control' } }
  ],
  applicability: { status: 'APPLICABLE', applicable_assertion_count: 1 },
  multiplicity: { assertion_count: 1, route_count: 2 }
};
export const fixtures = [];
function fixture(name, expectedCode, edit = () => {}) {
  const value = clone(base);
  edit(value);
  fixtures.push({ name: name + '.json', expectedCode, text: JSON.stringify(value, null, 2) + '\n' });
}
fixture('valid-partial', null);
fixture('valid-partial-unresolved', null, v => {
  v.assertions[0].owner = null;
  v.assertions[0].expected_ref = 'UNKNOWN';
  v.assertions[0].iteration_key = null;
});
fixture('valid-complete-declaration-only', null, v => {
  v.inventory_status = 'COMPLETE'; v.complete = true;
});
fixture('duplicate-assertion', 'DUPLICATE_ASSERTION_IDENTITY', v => {
  v.assertions.push(clone(v.assertions[0])); v.multiplicity.assertion_count = 2;
  v.applicability.applicable_assertion_count = 2;
});
fixture('duplicate-descriptor', 'DUPLICATE_ASSERTION_DESCRIPTOR', v => {
  const a = clone(v.assertions[0]); a.assertion_id = 'SYN-A-2';
  a.source_ref = { pointer: '/items/0', artifact_id: 'SYN-SOURCE' };
  v.assertions.push(a); v.multiplicity.assertion_count = 2;
  v.applicability.applicable_assertion_count = 2;
});
fixture('duplicate-route', 'DUPLICATE_ROUTE_IDENTITY', v => {
  v.routes.push(clone(v.routes[0])); v.multiplicity.route_count = 3;
});
fixture('missing-source', 'REQUIRED_FIELD', v => { delete v.assertions[0].source_ref; });
fixture('dangling-route', 'DANGLING_ROUTE_REFERENCE', v => { v.assertions[0].control_route_ref = 'SYN-MISSING'; });
fixture('missing-iteration', 'REQUIRED_FIELD', v => { delete v.assertions[0].iteration_key; });
fixture('multiplicity-conflict', 'COUNT_CONFLICT', v => { v.multiplicity.assertion_count = 9; });
fixture('unknown-complete', 'UNKNOWN_WITH_COMPLETE', v => {
  v.inventory_status = 'COMPLETE'; v.complete = true; v.assertions[0].expected_ref = 'UNKNOWN';
});
fixture('null-complete', 'UNKNOWN_WITH_COMPLETE', v => {
  v.inventory_status = 'COMPLETE'; v.complete = true; v.assertions[0].iteration_key = null;
});
fixture('missing-required', 'REQUIRED_FIELD', v => { delete v.applicability; });
fixture('wrong-version', 'UNSUPPORTED_SCHEMA_VERSION', v => { v.schema_version = 'synthetic-unsupported'; });
fixture('malformed-source', 'JSON_POINTER_REQUIRED', v => { v.assertions[0].source_ref.pointer = '/bad~2'; });
fixture('malformed-expected', 'OBJECT_REQUIRED', v => { v.assertions[0].expected_ref = 7; });
fixture('malformed-iteration', 'REQUIRED_FIELD', v => { v.assertions[0].iteration_key = { scope: 'SYN-LOOP' }; });
fixture('route-kind-conflict', 'ROUTE_KIND_CONFLICT', v => { v.assertions[0].control_route_ref = 'SYN-R-CMP'; });
fixture('applicability-conflict', 'APPLICABILITY_STATE_CONFLICT', v => { v.applicability.status = 'NOT_APPLICABLE'; });
fixture('completeness-conflict', 'COMPLETENESS_STATE_CONFLICT', v => { v.complete = true; });
fixture('unsupported-field', 'UNSUPPORTED_FIELD', v => { v.extra = true; });
fixtures.push({ name: 'parse-error.json', expectedCode: 'JSON_PARSE_ERROR', text: '{"schema_version":' });

function ensure(ok, message) { if (!ok) throw new Error(message); }
function assess(f, r) {
  ensure(r.assurance === 'ASSURANCE_NOT_EVALUATED', f.name + ': assurance');
  ensure(r.non_claims.length === 7, f.name + ': non-claims');
  ensure(r.status === (f.expectedCode ? 'FAIL' : 'PASS'), f.name + ': status');
  ensure(r.result === (f.expectedCode ? 'STATIC_INVENTORY_STRUCTURE_INVALID' :
    'STATIC_INVENTORY_STRUCTURE_VALID'), f.name + ': result');
  if (f.expectedCode) ensure(r.errors.some(e => e.code === f.expectedCode), f.name + ': expected error');
}
export async function runMemoryTests() {
  for (const f of fixtures) {
    const read = async () => Buffer.from(f.text, 'utf8');
    const a = await readInventory(f.name, read);
    const b = await readInventory(f.name, read);
    assess(f, a.result);
    ensure(a.exitCode === (f.expectedCode ? 1 : 0), f.name + ': exit');
    ensure(JSON.stringify(a) === JSON.stringify(b), f.name + ': deterministic');
    if (f.expectedCode !== 'JSON_PARSE_ERROR') {
      const value = JSON.parse(f.text);
      const before = JSON.stringify(value);
      checkInventory(value);
      ensure(JSON.stringify(value) === before, f.name + ': input mutated');
    }
  }
  const io = await readInventory('SYN-MISSING', async () => { throw new Error('synthetic'); });
  ensure(io.exitCode === 2 && io.result.errors[0].code === 'INPUT_READ_ERROR', 'read failure');
  const utf = await readInventory('SYN-UTF8', async () => Buffer.from([0xff]));
  ensure(utf.exitCode === 1 && utf.result.errors[0].code === 'JSON_PARSE_ERROR', 'invalid UTF-8');
  return { positive: fixtures.filter(f => !f.expectedCode).length,
    negative: fixtures.filter(f => f.expectedCode).length, deterministic: 'PASS', input_unchanged: 'PASS' };
}
async function metadata(path) {
  const bytes = await readFile(path);
  return { path, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') };
}
async function diskMain(args) {
  ensure(args.length === 0 || (args.length === 1 && args[0] === '--create-fixtures'), 'Invalid arguments');
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  ensure((await stat(root)).isDirectory(), 'Root must already exist');
  ensure((await realpath(root)).toLowerCase() === root.toLowerCase(), 'Redirected root prohibited');
  const dir = join(root, 'tests', 'fixtures', 'static-inventory-contract-v0.1');
  if (args[0] === '--create-fixtures') {
    let current = root;
    for (const part of ['tests', 'fixtures', 'static-inventory-contract-v0.1']) {
      current = join(current, part);
      try { await mkdir(current); } catch (e) { if (e.code !== 'EEXIST') throw e; }
      ensure((await realpath(current)).toLowerCase() === current.toLowerCase(), 'Redirected fixture directory prohibited');
    }
    for (const f of fixtures) {
      const path = join(dir, f.name);
      try { await writeFile(path, f.text, { encoding: 'utf8', flag: 'wx' }); }
      catch (e) {
        if (e.code !== 'EEXIST') throw e;
        ensure(await readFile(path, 'utf8') === f.text, 'Existing fixture differs: ' + f.name);
      }
    }
    process.stdout.write(JSON.stringify({ synthetic_fixtures_created: fixtures.length }) + '\n');
    return;
  }
  // Validate existing ancestors before reading fixtures; no writes in this mode.
  let current = root;
  for (const part of ['tests', 'fixtures', 'static-inventory-contract-v0.1']) {
    current = join(current, part);
    ensure((await realpath(current)).toLowerCase() === current.toLowerCase(), 'Redirected fixture directory prohibited');
  }
  const memory = await runMemoryTests();
  const checker = join(root, 'scripts', 'check_static_inventory_contract_v0.1.mjs');
  const cli = file => spawnSync(process.execPath, [checker, file], {
    encoding: 'utf8', timeout: 10000, maxBuffer: 1024 * 1024
  });
  const files = [];
  for (const f of fixtures) {
    const path = join(dir, f.name);
    ensure(await readFile(path, 'utf8') === f.text, 'Fixture mismatch: ' + f.name);
    const a = cli(path), b = cli(path);
    ensure(!a.error && !b.error && !a.stderr && !b.stderr, f.name + ': CLI failure');
    ensure(a.status === (f.expectedCode ? 1 : 0), f.name + ': CLI exit');
    assess(f, JSON.parse(a.stdout));
    ensure(a.status === b.status && a.stdout === b.stdout, f.name + ': CLI deterministic');
    files.push(await metadata(path));
  }
  for (const path of [checker, fileURLToPath(import.meta.url),
    join(root, 'docs', 'validation', 'static-inventory-checker-v0.1.md')])
    files.push(await metadata(path));
  process.stdout.write(JSON.stringify({ verification: 'PASS', ...memory, files }) + '\n');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { await diskMain(process.argv.slice(2)); }
  catch (e) {
    process.stdout.write(JSON.stringify({ verification: 'FAIL', error: e.message,
      assurance: 'ASSURANCE_NOT_EVALUATED' }) + '\n');
    process.exitCode = 1;
  }
}
