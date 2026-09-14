"""Offline V8-000 renderer and validator. Never imports or writes Guard runtime.

Default: read-only validation against the pinned checkout and Research OS.
--render: additionally replace ONLY the reconciliation matrix from reviewed JSON.
Manual semantic judgments live in JSON; this tool checks evidence/completeness,
not their truth, and cannot grant Gate 1 or manufacture a readiness decision.
"""
from pathlib import Path
import argparse, collections, copy, hashlib, json, re, subprocess, sys

ROOT = Path(__file__).resolve().parents[1]
DATA = 'docs/mesr/implementation-reconciliation.v0.1.json'
MATRIX = 'docs/mesr/07_IMPLEMENTATION_RECONCILIATION_MATRIX.md'
PLANS = ['docs/planning/' + n for n in (
    '13_V8_000_SOURCE_RECONCILIATION.md',
    '14_SOURCE_RECONCILED_GATE1_BACKLOG.md',
    '15_GATE1_READINESS_DECISION.md')]
OUTPUTS = [MATRIX, DATA] + PLANS
HELPER = 'scripts/_build_v8_000.py'
VERDICTS = {'ALREADY_IMPLEMENTED', 'ALIGN_AND_ADOPT', 'NEEDS_EXPERIMENT', 'REJECT_OR_DEFER'}
IMPACTS = {'PURELY_ADDITIVE', 'ADDITIVE_WITH_ALIAS', 'REQUIRES_REPORT_MIGRATION',
           'REQUIRES_SCHEMA_MIGRATION', 'REQUIRES_REASON_CODE_MIGRATION', 'POTENTIALLY_BREAKING'}
MATCHES = {'EXACT', 'PARTIAL', 'NONE', 'CONFLICT'}
RELATIONS = ('refines', 'requires', 'entails', 'orthogonal_to', 'adjacent_to', 'conflicts_with', 'supersedes')
ROLES = {'CORE_SEMANTIC', 'DOMAIN_SEMANTIC', 'POLICY_RESULT', 'REPORT_WORDING', 'LEGACY', 'NEEDS_REVIEW'}
EXTS = ('.ts', '.mjs', '.js', '.json', '.md', '.yml', '.yaml', '.ps1', '.py')


def check(condition, message):
    if not condition:
        raise ValueError(message)


def read(path):
    return (ROOT / path).read_text(encoding='utf-8-sig')


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def git(*args, cwd=ROOT):
    return subprocess.check_output(['git', *args], cwd=cwd).decode('utf-8').strip()


def load(path):
    return json.loads(path.read_text(encoding='utf-8-sig'))


def source_ref(value):
    match = re.fullmatch(r'(.+):(\d+)', value)
    path = match[1] if match else value
    check((ROOT / path).is_file(), 'Missing source: ' + value)
    if match:
        check(1 <= int(match[2]) <= len(read(path).splitlines()), 'Invalid line: ' + value)


def schema_fields(schema):
    result = []
    def walk(node, instance, pointer, required, seen=()):
        if '$ref' in node:
            key = node['$ref'].split('/')[-1]
            check(key not in seen, 'Cyclic schema ref')
            walk(schema['$defs'][key], instance, '#/$defs/' + key, required, seen + (key,))
            return
        if instance:
            result.append((instance, pointer, required, {k:v for k,v in node.items()
                if k not in ['properties', 'items', 'oneOf', 'anyOf', '$defs', 'required']}))
        for key, child in node.get('properties', {}).items():
            walk(child, instance + '/' + key, pointer + '/properties/' + key,
                 key in node.get('required', []), seen)
        if 'items' in node:
            walk(node['items'], instance + '/*', pointer + '/items', None, seen)
        for op in ['oneOf', 'anyOf']:
            for i, child in enumerate(node.get(op, [])):
                walk(child, instance + '{' + op + ':' + str(i) + '}',
                     pointer + '/' + op + '/' + str(i), required, seen)
    walk(schema, '', '#', None)
    return result


def validate_data(data, research, source_codes):
    for name, research_name, count in [('core_candidates', 'primitives', 41),
            ('meta_assurance_candidates', 'mesr_assurance_metadata', 3)]:
        rows = data[name]
        check(len(rows) == count, name + ' count')
        ids = [r['semantic_id'] for r in rows]
        expected = {r['semantic_id']: r for r in research[research_name]}
        check(len(set(ids)) == count and set(ids) == set(expected), name + ' exact IDs')
        for row in rows:
            sid = row['semantic_id']; original = expected[sid]
            check(isinstance(row['verdict'], str) and row['verdict'] in VERDICTS, sid + ' verdict')
            for k in ['current_implementation_analogue', 'source_paths', 'current_behavior',
                    'compatibility_impact', 'verdict_reason', 'required_experiment', 'gate1_action', 'alias_requirement']:
                check(bool(row.get(k)), sid + ' missing ' + k)
            check(row['meaning_match'] in MATCHES and row['claim_boundary_match'] in MATCHES, sid + ' match')
            if row['verdict'] == 'ALIGN_AND_ADOPT':
                check(isinstance(row['primary_compatibility_impact'], str) and
                      row['primary_compatibility_impact'] in IMPACTS, sid + ' primary impact')
            for key in ['supports', 'does_not_support', 'instance_requirements']:
                check(row[key] == original[key], sid + ' research drift: ' + key)
            check(row['research_definition'] == original['definition'], sid + ' definition drift')
            check(row['relations'] == {k: original[k] for k in RELATIONS}, sid + ' relation drift')
            for ref in row['source_paths']:
                source_ref(ref)
    codes = data['canonical_reason_codes']
    check([r['code'] for r in codes] == source_codes and len(source_codes) == 56, 'Reason list/order')
    for row in codes:
        check(row['primary_role'] in ROLES, row['code'] + ' primary role')
        for key in ['definition', 'declaration', 'definition_location', 'generic_consumers',
                    'generic_tests', 'report_phrases', 'serialized_api_exposure',
                    'current_runtime_meaning', 'compatibility_sensitivity', 'all_occurrences']:
            check(bool(row.get(key)), row['code'] + ' missing ' + key)
        check(bool(row['emitters']) == (row['emitter_status'] == 'IMPLEMENTED_TRIGGER'), row['code'] + ' trigger refs')
        source_ref(row['declaration']); source_ref(row['definition_location'])
        for path in row['generic_consumers'] + row['report_wording_sources']:
            source_ref(path)
        for test in row['generic_tests']:
            source_ref(test['path'])
    expected = schema_fields(load(ROOT / 'packages/schema/evidence-schema-v1.json'))
    actual = [(r['field_path'], r['schema_pointer'], r['required_in_parent'], r['constraints'])
              for r in data['evidence_contract_fields']]
    check(actual == expected, 'Schema field/variant inventory incomplete or drifted')
    for row in data['evidence_contract_fields']:
        source_ref(row['validator'])
        for key in ['context_group', 'meaning', 'producer', 'consumer', 'compatibility_sensitivity']:
            check(bool(row[key]), 'Field context missing ' + row['field_path'])
    for flag in ['runtime_behavior_changed', 'gate1_implementation_started', 'reconciliation_outputs_committed']:
        check(data[flag] is False, flag)
    check(data['automatic_allow_equivalences_added'] == 0, 'ALLOW equivalences')
    check(data['status'] in {'V8_000_PASS', 'V8_000_PASS_WITH_BLOCKERS', 'V8_000_FAIL'}, 'Reviewed decision missing')
    check(bool(data['open_blockers']) == (data['status'] == 'V8_000_PASS_WITH_BLOCKERS')
          or data['status'] == 'V8_000_FAIL', 'Decision/blocker inconsistency')
    tests = data['baseline_tests'] + data['recovery_tests']
    check(len(tests) >= 22 and all(t['exit_code'] == 0 for t in tests), 'Baseline observation failure')


def validate_environment(data):
    baseline = data['baseline']
    check(git('branch', '--show-current') == baseline['branch'], 'Branch mismatch')
    check(git('rev-parse', 'HEAD') == baseline['agents_context_commit'], 'HEAD mismatch')
    check(git('rev-parse', 'HEAD^') == baseline['base_commit'], 'Base parent mismatch')
    check(git('rev-parse', baseline['base_ref']) == baseline['base_commit'], 'Base ref mismatch')
    check(git('diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD') == 'AGENTS.md', 'Constitution commit scope')
    check(not git('diff', '--name-only', 'HEAD'), 'Tracked files changed (including protected product and Experiment 2B)')
    check(not git('diff', '--cached', '--name-only'), 'Unexpected staged changes')
    subprocess.run(['git', 'diff', '--check'], cwd=ROOT, check=True)
    ancestor = subprocess.run(['git', 'merge-base', '--is-ancestor', baseline['des_closure_commit'], 'HEAD'], cwd=ROOT)
    check(ancestor.returncode == 1, 'DES imported or ancestry check failed')
    agents = read('AGENTS.md')
    check(agents.count('## V8 semantic-foundation strategic context') == 1, 'V8 constitution heading')
    for line in ['RESEARCH_COMPRESSION = PASS', 'SEMANTIC_ARCHITECTURE_REPAIR = PASS',
                 'V8_000_SOURCE_RECONCILIATION = REQUIRED_NEXT', 'GATE_1_IMPLEMENTATION = BLOCKED_UNTIL_V8_000_PASS']:
        check(agents.count(line) == 1, 'Constitution gate missing/duplicated')
    patch = Path(r'D:\AI project\mindforge-guard-outbound\AGENTS-v8-source-reconciliation-context.patch')
    check(sha(patch) == baseline['patch_sha256'], 'Preserved patch changed')
    research_root = Path(baseline['research_root'])
    hashes = {p.relative_to(research_root).as_posix(): sha(p) for p in research_root.rglob('*') if p.is_file()}
    check(hashes == baseline['research_hashes_before'], 'Research OS changed')
    harness = Path(baseline['harness_root'])
    check(git('rev-parse', 'HEAD', cwd=harness) == baseline['harness_commit'], 'Harness HEAD changed')
    check(not git('status', '--porcelain', cwd=harness), 'Harness worktree changed')
    for path, digest in baseline['harness_source_hashes'].items():
        check(sha(harness / path) == digest, 'Harness source changed: ' + path)
    for path in OUTPUTS:
        check((ROOT / path).is_file(), 'Missing required output: ' + path)
    untracked = set(git('ls-files', '--others', '--exclude-standard', '-z').split('\0')) - {''}
    check(untracked == set(OUTPUTS + [HELPER]), 'Unexpected untracked files: ' + repr(untracked ^ set(OUTPUTS + [HELPER])))
    for path, key in zip(PLANS, ['source_inventory_narrative', 'backlog_narrative', 'decision_narrative']):
        check(read(path) == data[key], 'Planning/JSON mismatch: ' + path)
    check(data['status'] in read(PLANS[2]), 'Decision status missing')
    for blocker in data['open_blockers']:
        check(blocker['id'] in read(PLANS[2]), 'Unreported blocker: ' + blocker['id'])
    # Verify all literal references against tracked baseline sources, not against our generated report.
    tracked = [p for p in git('ls-files', '-z').split('\0') if p]
    contents = {p: (ROOT / p).read_text(encoding='utf-8-sig', errors='replace')
                for p in tracked if p.endswith(EXTS) and p != 'package-lock.json'}
    lines = [(p, i+1, line.strip()) for p, value in contents.items() for i, line in enumerate(value.splitlines())]
    for row in data['canonical_reason_codes']:
        code = row['code']; pattern = re.compile(r'(?<![A-Z_])' + code + r'(?![A-Z_])')
        actual = [dict(path=p, line=i, excerpt=line) for p, i, line in lines if code in line and pattern.search(line)]
        check(actual == row['all_occurrences'], code + ' incomplete/stale literal trace')
        for group in ['emitters', 'consumers', 'fixtures', 'tests', 'emitter_file_occurrences']:
            check(all(ref in actual for ref in row[group]), code + ' false ' + group + ' reference')
        for context in row['emission_context']:
            start = context['start_line']-1; count = len(context['source'].split('\n'))
            check('\n'.join(read(context['path']).splitlines()[start:start+count]) == context['source'], code + ' emission context drift')
    for name, paths in data['metadata_name_search'].items():
        check(paths == [p for p,t in contents.items() if name in t], 'Metadata alias search drift')
    for paths in data['implementation_file_inventory'].values():
        for path in paths:
            source_ref(path)
    wording = data['wording_audit']
    for term, refs in wording['terms'].items():
        actual = [dict(path=path, line=i+1, excerpt=line.strip()) for path in wording['scope']
                  for i, line in enumerate(read(path).splitlines()) if re.search(term, line, re.I)]
        check(actual == refs, 'Wording trace drift: ' + term)
    decision = data['decision_narrative']
    core_counts = collections.Counter(r['verdict'] for r in data['core_candidates'])
    meta_counts = collections.Counter(r['verdict'] for r in data['meta_assurance_candidates'])
    for verdict in VERDICTS:
        check(f'| {verdict} | {core_counts[verdict]} | {meta_counts[verdict]} |' in decision,
              'Decision verdict totals drift: ' + verdict)
    core_impacts = collections.Counter(r['primary_compatibility_impact'] for r in data['core_candidates'] if r['verdict'] == 'ALIGN_AND_ADOPT')
    meta_impacts = collections.Counter(r['primary_compatibility_impact'] for r in data['meta_assurance_candidates'] if r['verdict'] == 'ALIGN_AND_ADOPT')
    for impact in IMPACTS:
        a, b = core_impacts[impact], meta_impacts[impact]
        check(f'| {impact} | {a} | {b} | {a+b} |' in decision, 'Decision impact totals drift: ' + impact)
    for path in OUTPUTS + [HELPER]:
        for i, line in enumerate(read(path).splitlines(), 1):
            check(line == line.rstrip(), f'Trailing whitespace {path}:{i}')
    return len(hashes)


def render(data):
    out = ['# V8-000 Implementation Reconciliation Matrix', '',
           'Generated from reviewed [JSON](implementation-reconciliation.v0.1.json) by `python scripts/_build_v8_000.py --render`.', '',
           data['source_of_truth'], '',
           'This file mirrors every machine-readable conclusion. Source trace arrays and provenance are retained as JSON blocks to preserve exact field names, line numbers and excerpts. They describe this pinned baseline only.', '',
           '## Counts', '']
    for name in ['core_candidates', 'meta_assurance_candidates']:
        counts = collections.Counter(r['verdict'] for r in data[name])
        out += [name + ': ' + ', '.join(v + '=' + str(counts[v]) for v in sorted(VERDICTS)) + '; total=' + str(len(data[name])) + '.', '']
    impacts = collections.Counter(r['primary_compatibility_impact'] for n in ['core_candidates', 'meta_assurance_candidates'] for r in data[n] if r['verdict'] == 'ALIGN_AND_ADOPT')
    out += ['Primary compatibility totals cover ALIGN_AND_ADOPT only (Core + metadata): ' + ', '.join(k + '=' + str(impacts[k]) for k in sorted(IMPACTS)) + '.', '']
    for name in ['core_candidates', 'meta_assurance_candidates']:
        out += ['## ' + name.replace('_', ' ').title() + ' Index', '',
                '| Candidate | Verdict | Meaning / boundary | Primary impact |', '|---|---|---|---|']
        for row in data[name]:
            sid = row['semantic_id']; slug = re.sub(r'[^a-z0-9_-]', '', sid.lower())
            out.append(f'| [{sid}](#{slug}) | {row["verdict"]} | {row["meaning_match"]} / {row["claim_boundary_match"]} | {row["primary_compatibility_impact"] or "Experiment/defer: narrative risk"} |')
        out += ['']
    out += ['## Reason Code Index', '', '| Code | Primary role | Current trigger status |', '|---|---|---|']
    for row in data['canonical_reason_codes']:
        code = row['code']
        out.append(f'| [{code}](#{code.lower()}) | {row["primary_role"]} | {row["emitter_status"]} |')
    out += ['']
    for key, value in data.items():
        out += ['## ' + key.replace('_', ' ').title(), '']
        if key.endswith('_narrative'):
            narrative = re.sub(r'\]\((1[345]_[^)]+\.md)\)', r'](../planning/\1)', value)
            out += [re.sub(r'^(#+) ', r'##\1 ', narrative, flags=re.M).rstrip(), '']
        elif key in ['core_candidates', 'meta_assurance_candidates', 'canonical_reason_codes']:
            for row in value:
                out += ['### ' + row.get('semantic_id', row.get('code', '')), '']
                for field, item in row.items():
                    if isinstance(item, (list, dict)):
                        out += ['**' + field + '**', '', '```json', json.dumps(item, ensure_ascii=False, indent=2), '```', '']
                    else:
                        out += ['**' + field + ':** ' + (str(item) if item is not None else 'Not classified: classification mandatory only for ALIGN_AND_ADOPT.'), '']
        elif isinstance(value, (dict, list)):
            out += ['```json', json.dumps(value, ensure_ascii=False, indent=2), '```', '']
        else:
            out += [str(value), '']
    return '\n'.join(out).rstrip() + '\n'


def self_test(data, research, codes):
    mutations = [
        ('missing Core row', lambda d: d['core_candidates'].pop()),
        ('fifth verdict', lambda d: d['core_candidates'][0].update(verdict='MAYBE')),
        ('missing primary impact', lambda d: d['core_candidates'][0].update(primary_compatibility_impact=None)),
        ('nonclaim drift', lambda d: d['core_candidates'][0].update(does_not_support=[])),
        ('missing reason', lambda d: d['canonical_reason_codes'].pop()),
        ('missing schema field', lambda d: d['evidence_contract_fields'].pop()),
        ('authority equivalence', lambda d: d.update(automatic_allow_equivalences_added=1)),
    ]
    for label, mutation in mutations:
        altered = copy.deepcopy(data); mutation(altered)
        try:
            validate_data(altered, research, codes)
        except (ValueError, KeyError):
            continue
        raise ValueError('Negative self-test unexpectedly accepted: ' + label)
    return len(mutations)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--render', action='store_true', help='Write only the Markdown matrix from reviewed JSON, then validate it.')
    parser.add_argument('--self-test', action='store_true', help='Exercise negative structural checks in memory; no fixture writes.')
    args = parser.parse_args()
    data = load(ROOT / DATA)
    research = load(Path(data['baseline']['research_root']) / 'docs/mesr/mesr-core-candidates.v0.1.json')
    reason_source = read('packages/guard-core/src/reasonCodes.ts')
    declaration = reason_source.split('export const GUARD_REASON_CODES = {')[1].split('} as const')[0]
    codes = re.findall(r'\w+: "([A-Z_]+)"', declaration)
    validate_data(data, research, codes)
    research_count = validate_environment(data)
    expected = render(data)
    if args.render:
        (ROOT / MATRIX).write_text(expected, encoding='utf-8', newline='\n')
    check(read(MATRIX) == expected, 'Markdown/JSON mismatch; review JSON then use --render')
    negative = self_test(data, research, codes) if args.self_test else 0
    print(f'PASS: 41 Core + 3 metadata; 56 complete reason traces; {len(data["evidence_contract_fields"])} schema field/variant records; 5 outputs synchronized.')
    print(f'PASS: {research_count} Research files unchanged; tracked product/Experiment 2B/AGENTS unchanged; Harness baseline unchanged; zero automatic ALLOW additions.')
    print(f'PASS: {negative} requested negative self-checks; reviewed decision = {data["status"]}; Gate 1 remains governed by the decision, never by this validator.')


if __name__ == '__main__':
    try:
        main()
    except (ValueError, KeyError, OSError, subprocess.CalledProcessError) as exc:
        print('FAIL: ' + str(exc), file=sys.stderr)
        sys.exit(1)
