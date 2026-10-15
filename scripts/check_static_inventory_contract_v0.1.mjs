import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const VERSION = 'static-inventory-contract/v0.1';
export const NON_CLAIMS = Object.freeze([
  'ASSERTION_INVENTORY_COMPLETE', 'ROUTE_INVENTORY_COMPLETE',
  'BEFORE_CAPTURE_COMPLETE', 'EXECUTION_COVERAGE_COMPLETE',
  'VERIFIER_INDEPENDENCE_ESTABLISHED', 'T2_FORMAL_CLOSURE_PASS',
  'SUCCESSOR_GATE_ACCEPTED'
]);
const unknown = v => v === null || v === 'UNKNOWN';
const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const has = (o, k) => Object.hasOwn(o, k);
const canonical = v => JSON.stringify(Array.isArray(v) ? v.map(v => JSON.parse(canonical(v))) :
  object(v) ? Object.fromEntries(Object.keys(v).sort().map(k => [k, JSON.parse(canonical(v[k]))])) : v);
const pointerOK = v => typeof v === 'string' && (v === '' || v.startsWith('/')) && !/~(?:[^01]|$)/u.test(v);
const DESC = ['case_id', 'evidence_domain', 'owner', 'source_ref',
  'source_pointer', 'assertion_site', 'iteration_key'];

export function failure(code, path = '$') {
  return report([{ code, path }], 0, 0);
}
function report(errors, assertions, routes) {
  errors.sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 :
    a.code < b.code ? -1 : a.code > b.code ? 1 : 0);
  return {
    checker_version: '0.1', status: errors.length ? 'FAIL' : 'PASS',
    result: errors.length ? 'STATIC_INVENTORY_STRUCTURE_INVALID' : 'STATIC_INVENTORY_STRUCTURE_VALID',
    assurance: 'ASSURANCE_NOT_EVALUATED',
    non_claims: [...NON_CLAIMS],
    input_limits: ['DUPLICATE_JSON_MEMBER_NAMES_UNSUPPORTED_AND_PROHIBITED'],
    observed_counts: { assertions, routes }, errors
  };
}

export function checkInventory(input) {
  const errors = [];
  const add = (code, path) => errors.push({ code, path });
  function shape(v, keys, path) {
    if (!object(v)) { add('OBJECT_REQUIRED', path); return false; }
    for (const k of keys) if (!has(v, k)) add('REQUIRED_FIELD', path + '.' + k);
    for (const k of Object.keys(v)) if (!keys.includes(k)) add('UNSUPPORTED_FIELD', path + '.' + k);
    return true;
  }
  function text(v, path, unresolved = true) {
    if (unresolved && unknown(v)) return;
    if (typeof v !== 'string' || !v.trim() || v !== v.trim() || (!unresolved && v === 'UNKNOWN'))
      add('NONEMPTY_STRING_REQUIRED', path);
  }
  function pointer(v, path) {
    if (!unknown(v) && !pointerOK(v)) add('JSON_POINTER_REQUIRED', path);
  }
  function enumeration(v, choices, path) {
    if (!unknown(v) && !choices.includes(v)) add('INVALID_ENUM', path);
  }
  function ref(v, path) {
    if (unknown(v)) return;
    if (shape(v, ['artifact_id', 'pointer'], path)) {
      if (has(v, 'artifact_id')) text(v.artifact_id, path + '.artifact_id');
      if (has(v, 'pointer')) pointer(v.pointer, path + '.pointer');
    }
  }
  function iteration(v, path) {
    if (unknown(v)) return;
    if (shape(v, ['scope', 'value'], path)) {
      for (const k of ['scope', 'value']) if (has(v, k)) text(v[k], path + '.' + k);
    }
  }
  function count(v, expected, path) {
    if (unknown(v)) return;
    if (!Number.isSafeInteger(v) || v < 0) add('NONNEGATIVE_SAFE_INTEGER_REQUIRED', path);
    else if (v !== expected) add('COUNT_CONFLICT', path);
  }
  const top = ['schema_version', 'inventory_status', 'complete', 'assertions',
    'routes', 'applicability', 'multiplicity'];
  if (!shape(input, top, '$')) return report(errors, 0, 0);
  if (input.schema_version !== VERSION) add('UNSUPPORTED_SCHEMA_VERSION', '$.schema_version');
  enumeration(input.inventory_status, ['PARTIAL', 'COMPLETE'], '$.inventory_status');
  if (!unknown(input.complete) && typeof input.complete !== 'boolean') add('BOOLEAN_REQUIRED', '$.complete');
  if ((input.inventory_status === 'COMPLETE' && input.complete !== true) ||
      (input.complete === true && input.inventory_status !== 'COMPLETE') ||
      (input.inventory_status === 'PARTIAL' && input.complete !== false))
    add('COMPLETENESS_STATE_CONFLICT', '$.complete');

  if (!Array.isArray(input.assertions)) add('ARRAY_REQUIRED', '$.assertions');
  if (!Array.isArray(input.routes)) add('ARRAY_REQUIRED', '$.routes');
  const assertions = Array.isArray(input.assertions) ? input.assertions : [];
  const routes = Array.isArray(input.routes) ? input.routes : [];
  const routeMap = new Map();
  const routeIds = new Set();
  routes.forEach((r, i) => {
    const p = '$.routes[' + i + ']';
    if (!shape(r, ['route_id', 'route_kind', 'source_ref'], p)) return;
    text(r.route_id, p + '.route_id', false);
    if (routeIds.has(r.route_id)) add('DUPLICATE_ROUTE_IDENTITY', p + '.route_id');
    routeIds.add(r.route_id);
    if (!['COMPARATOR', 'CONTROL'].includes(r.route_kind)) add('INVALID_ROUTE_KIND', p + '.route_kind');
    ref(r.source_ref, p + '.source_ref');
    if (typeof r.route_id === 'string' && !routeMap.has(r.route_id)) routeMap.set(r.route_id, r.route_kind);
  });
  const ids = new Set();
  const descriptors = new Set();
  let applicable = 0;
  let unresolvedApplicability = false;
  assertions.forEach((a, i) => {
    const p = '$.assertions[' + i + ']';
    const fields = ['assertion_id', ...DESC, 'expected_ref',
      'comparator_route_ref', 'control_route_ref', 'applicability'];
    if (!shape(a, fields, p)) return;
    text(a.assertion_id, p + '.assertion_id', false);
    if (ids.has(a.assertion_id)) add('DUPLICATE_ASSERTION_IDENTITY', p + '.assertion_id');
    ids.add(a.assertion_id);
    if (DESC.every(k => has(a, k))) {
      const key = canonical(DESC.map(k => a[k]));
      if (descriptors.has(key)) add('DUPLICATE_ASSERTION_DESCRIPTOR', p);
      descriptors.add(key);
    }
    for (const k of ['case_id', 'evidence_domain', 'owner', 'assertion_site'])
      if (has(a, k)) text(a[k], p + '.' + k);
    if (has(a, 'source_pointer')) pointer(a.source_pointer, p + '.source_pointer');
    if (has(a, 'source_ref')) ref(a.source_ref, p + '.source_ref');
    if (has(a, 'expected_ref')) ref(a.expected_ref, p + '.expected_ref');
    if (has(a, 'iteration_key')) iteration(a.iteration_key, p + '.iteration_key');
    enumeration(a.applicability, ['APPLICABLE', 'NOT_APPLICABLE'], p + '.applicability');
    if (a.applicability === 'APPLICABLE') applicable++;
    if (unknown(a.applicability)) unresolvedApplicability = true;
    for (const [k, kind] of [['comparator_route_ref', 'COMPARATOR'], ['control_route_ref', 'CONTROL']]) {
      const v = a[k];
      if (!has(a, k) || unknown(v)) continue;
      text(v, p + '.' + k, false);
      if (!routeMap.has(v)) add('DANGLING_ROUTE_REFERENCE', p + '.' + k);
      else if (routeMap.get(v) !== kind) add('ROUTE_KIND_CONFLICT', p + '.' + k);
    }
  });
  if (shape(input.multiplicity, ['assertion_count', 'route_count'], '$.multiplicity')) {
    if (has(input.multiplicity, 'assertion_count'))
      count(input.multiplicity.assertion_count, assertions.length, '$.multiplicity.assertion_count');
    if (has(input.multiplicity, 'route_count'))
      count(input.multiplicity.route_count, routes.length, '$.multiplicity.route_count');
  }
  if (shape(input.applicability, ['status', 'applicable_assertion_count'], '$.applicability')) {
    const v = input.applicability;
    enumeration(v.status, ['APPLICABLE', 'NOT_APPLICABLE'], '$.applicability.status');
    if (has(v, 'applicable_assertion_count'))
      count(v.applicable_assertion_count, applicable, '$.applicability.applicable_assertion_count');
    if ((v.status === 'NOT_APPLICABLE' && (applicable > 0 || unresolvedApplicability)) ||
        (v.status === 'APPLICABLE' && applicable === 0))
      add('APPLICABILITY_STATE_CONFLICT', '$.applicability.status');
  }
  function containsUnknown(v) {
    return unknown(v) || (Array.isArray(v) ? v.some(containsUnknown) :
      object(v) ? Object.values(v).some(containsUnknown) : false);
  }
  if ((input.complete === true || input.inventory_status === 'COMPLETE') && containsUnknown(input))
    add('UNKNOWN_WITH_COMPLETE', '$.complete');
  return report(errors, assertions.length, routes.length);
}

export async function readInventory(file, read = readFile) {
  let bytes;
  try { bytes = await read(file); }
  catch { return { exitCode: 2, result: failure('INPUT_READ_ERROR') }; }
  let value;
  try {
    const source = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    value = JSON.parse(source);
  } catch { return { exitCode: 1, result: failure('JSON_PARSE_ERROR') }; }
  const result = checkInventory(value);
  return { exitCode: result.status === 'PASS' ? 0 : 1, result };
}
export async function main(args) {
  if (args.length !== 1) {
    process.stdout.write(JSON.stringify(failure('EXACTLY_ONE_INPUT_FILE_REQUIRED')) + '\n');
    return 2;
  }
  const { exitCode, result } = await readInventory(args[0]);
  process.stdout.write(JSON.stringify(result) + '\n');
  return exitCode;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href)
  process.exitCode = await main(process.argv.slice(2));
