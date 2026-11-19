// ARCH-V02X Phase B: synthetic-only targeted regression for the existing I-1 Pack Review.
// Separate test IDs; this is NOT execution of the M4 62-case matrix.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const sample=path.resolve('examples/single-agent-governance-pack/hr-self-service-agent');
const cli=path.resolve('packages/guard/bin/guard.mjs');
const workspace=fs.mkdtempSync(path.join(os.tmpdir(),'arch-v02x-pack-synthetic-'));
const results=[];
const sha=(v)=>crypto.createHash('sha256').update(v).digest('hex');
const caution=/Bundle may contain input-derived narratives and identifiers.*Inspect locally before sharing/;
function run(args) {
  const env={...process.env,HOME:path.join(workspace,'isolated-home'),
    USERPROFILE:path.join(workspace,'isolated-home'),
    I1_REAL_WIN_ACL_INTEGRATION_EXPERIMENT:'',
    I1_REAL_WIN_ACL_SYNTHETIC_ONLY:'',
    I1_REAL_WIN_ACL_MODULE_PATH:'',
    I1_REAL_WIN_ACL_MODULE_SHA256:''};
  const r=spawnSync(process.execPath,[cli,...args],{
    cwd:workspace,env,encoding:'utf8',timeout:90000,maxBuffer:8*1024*1024
  });
  if(r.error)throw r.error;
  assert.equal(r.signal,null,'CLI terminated by signal');
  return {exit:r.status,stdout:r.stdout,stderr:r.stderr};
}
function test(id,title,callback) {
  try {callback();results.push({id,title,status:'PASS'});console.log('PASS '+id+' '+title);}
  catch(e) {results.push({id,title,status:'FAIL',detail:String(e?.stack||e)});console.error('FAIL '+id+' '+String(e?.message||e));}
}
function pack(name) {
  const dir=path.join(workspace,'pack-'+name);
  fs.cpSync(sample,dir,{recursive:true});
  return dir;
}
function checkManifest(out) {
  const manifest=JSON.parse(fs.readFileSync(path.join(out,'review-manifest.json'),'utf8'));
  const checksumIndex=JSON.parse(fs.readFileSync(path.join(out,'bundle-checksums.json'),'utf8'));
  assert.equal(manifest.kind,'mindforge_guard_review_bundle');
  assert.equal(manifest.recommendation_only,true);
  assert.equal(manifest.non_executing,true);
  assert.equal(manifest.independent_assurance,'NOT_ESTABLISHED');
  assert.equal(fs.existsSync(path.join(out,'.private-source')),false);
  assert(checksumIndex.files.length>0);
  for(const f of checksumIndex.files) {
    const bytes=fs.readFileSync(path.join(out,...f.path.split('/')));
    assert.equal(bytes.length,f.bytes);
    assert.equal(sha(bytes),f.sha256);
  }
  assert(!checksumIndex.files.some(f=>f.path==='bundle-checksums.json'));
  return manifest;
}
try {
  assert(fs.existsSync(sample),'sample pack is unavailable');
  assert(fs.existsSync(cli),'isolated I-1 CLI is unavailable');
  fs.mkdirSync(path.join(workspace,'isolated-home'),{recursive:true});

  test('AV02-P01','help does not create output and has no widened mode',()=>{
    const r=run(['review','--help']);
    assert.equal(r.exit,0,r.stderr);
    assert.match(r.stdout,/guard review --pack/);
    assert.doesNotMatch(r.stdout,/--source|--repo/);
  });
  test('AV02-P02','unknown mode rejected before any output side effect',()=>{
    const forbiddenOut=path.join(workspace,'reject-unknown');
    const r=run(['review','--source','./unknown','--out',forbiddenOut]);
    assert.equal(r.exit,2,r.stderr);
    assert.equal(fs.existsSync(forbiddenOut),false);
  });
  test('AV02-P03','preexisting output preserved byte-for-byte',()=>{
    const p=pack('collision');
    const out=path.join(workspace,'existing-output');
    fs.mkdirSync(out);
    const keep=path.join(out,'preserve.txt');
    fs.writeFileSync(keep,'PRESERVE_EXISTING_BYTES');
    const r=run(['review','--pack',p,'--out',out,'--format','json']);
    assert.equal(r.exit,2,r.stderr);
    assert.equal(fs.readFileSync(keep,'utf8'),'PRESERVE_EXISTING_BYTES');
  });

  if(process.platform==='win32') {
    test('AV02-W01','Windows default-deny refuses unverified private staging without a Bundle',()=>{
      const p=pack('win-default-deny');
      const out=path.join(workspace,'win-refused');
      const original=sha(fs.readFileSync(path.join(p,'manifest.json')));
      const r=run(['review','--pack',p,'--out',out,'--format','json']);
      assert.equal(r.exit,30,r.stderr);
      assert.match(r.stderr,/output_error/);
      assert.equal(fs.existsSync(out),false);
      assert.equal(sha(fs.readFileSync(path.join(p,'manifest.json'))),original);
      assert(!fs.readdirSync(workspace).some(x=>x.startsWith('.guard-i1-partial-')));
    });
    console.log('NOT_TESTED AV02-P04..P06 (POSIX Bundle publishing only; no Windows native addon configured)');
  } else {
    test('AV02-P04','POSIX synthetic JSON Pack Review has warning, native parity and sound checksums',()=>{
      const p=pack('json-positive');
      const out=path.join(workspace,'bundle-json');
      const original=sha(fs.readFileSync(path.join(p,'manifest.json')));
      const r=run(['review','--pack',p,'--out',out,'--format','json']);
      assert.equal(r.exit,0,r.stderr);
      const body=JSON.parse(r.stdout);
      assert.equal(body.status,'ready_for_review');
      assert.equal(body.not_approval,true);
      assert.equal(body.not_execution_authority,true);
      assert.match(body.share_caution,caution);
      assert.equal(body.native_pack_validation_exit_code,0);
      assert.equal(sha(fs.readFileSync(path.join(p,'manifest.json'))),original);
      const manifest=checkManifest(out);
      const validation=JSON.parse(fs.readFileSync(path.join(out,'components/pack-validation.json'),'utf8'));
      const report=JSON.parse(fs.readFileSync(path.join(out,'components/single-agent-governance-report.json'),'utf8'));
      assert.equal(manifest.components.pack_validation.native_exit_code,0);
      assert.equal(report.deterministic_hash,validation.deterministic_pack_hash);
    });
    test('AV02-P05','POSIX text output warns about disclosure without changing native semantics',()=>{
      const p=pack('text-positive');
      const out=path.join(workspace,'bundle-text');
      const r=run(['review','--pack',p,'--out',out,'--format','text']);
      assert.equal(r.exit,0,r.stderr);
      assert.match(r.stdout,caution);
      assert.match(r.stdout,/not approval, certification, or execution permission/);
      checkManifest(out);
    });
    test('AV02-P06','POSIX limitation still exits 2 and retains source limitation',()=>{
      const p=pack('limitation');
      fs.unlinkSync(path.join(p,'snapshot.json'));
      const out=path.join(workspace,'bundle-limited');
      const r=run(['review','--pack',p,'--out',out,'--format','json']);
      assert.equal(r.exit,2,r.stderr);
      const body=JSON.parse(r.stdout);
      assert.match(body.share_caution,caution);
      assert.equal(body.status,'completed_with_limitations');
      const m=checkManifest(out);
      assert.equal(m.components.pack_validation.native_exit_code,2);
      assert(m.limitations.length>0);
    });
  }
} finally {
  // Synthetic test harness removes only its own fresh disposable TEMP workspace.
  fs.rmSync(workspace,{recursive:true,force:true});
}
const failures=results.filter(x=>x.status==='FAIL');
const receipt={kind:'ARCH_V02X_PACK_SHARE_DISCLOSURE_SYNTHETIC_TEST',platform:process.platform,
  arch:process.arch,node:process.version,source_class:'SYNTHETIC_ONLY',
  m4_62_runtime_cases:'NOT_RUN',windows_release_admission:'HOLD',
  counts:{pass:results.length-failures.length,fail:failures.length,not_tested:process.platform==='win32'?3:1},
  cases:results};
console.log('ARCH_V02X_PACK_TEST_RECEIPT '+JSON.stringify(receipt));
if(failures.length)process.exitCode=1;
