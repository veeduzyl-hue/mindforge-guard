// ARCH-v0.2.x: WINDOWS native-ACL-protected synthetic Bundle POSITIVE equivalents.
// Corresponds to POSIX AV02-P04/P05/P06. IDs are separate; original POSIX tests
// remain NOT_TESTED on Windows. This does NOT execute the M4 62-test matrix.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';

if(process.platform !== 'win32') throw Error('AV02_WINDOWS_NATIVE_ONLY');
if(process.env.ARCH_V02X_WINDOWS_POSITIVE_SYNTHETIC_ONLY !== '1') {
  throw Error('EXPLICIT_SYNTHETIC_ONLY_GATE_REQUIRED');
}
const require=createRequire(import.meta.url);
const repo=path.resolve('.');
const addonPath=path.join(repo,'experiments','i1-real-writer-win-acl-integration-01','private_acl.node');
const receiptPath=path.join(repo,'experiments','i1-real-writer-win-acl-integration-01','build-receipt.json');
const sample=path.join(repo,'examples','single-agent-governance-pack','hr-self-service-agent');
const cli=path.join(repo,'packages','guard','bin','guard.mjs');
const sha=(x)=>crypto.createHash('sha256').update(x).digest('hex');
assert(fs.existsSync(addonPath),'NATIVE_BINARY_MISSING_FAIL_CLOSED');
assert(fs.existsSync(receiptPath),'BUILD_RECEIPT_MISSING_FAIL_CLOSED');
assert(fs.existsSync(sample),'FIXED_SYNTHETIC_SAMPLE_MISSING');
assert(fs.existsSync(cli),'FIXED_CLI_MISSING');
const built=JSON.parse(fs.readFileSync(receiptPath,'utf8'));
const binaryDigest=sha(fs.readFileSync(addonPath));
assert.equal(binaryDigest,built.binarySha256,'Native binary digest does not match build receipt');
assert.equal(built.productIntegration,false);
assert.equal(built.experimentalOnly,true);
assert.equal(built.platform,'win32');
assert.equal(built.arch,process.arch);
assert.equal(built.node,process.version);
const addon=require(addonPath);
assert.equal(typeof addon.inspectAcl,'function');
assert.equal(typeof addon.createPrivateBound,'function');

const workspace=fs.mkdtempSync(path.join(os.tmpdir(),'arch-v02x-win-positive-'));
const parent=path.join(workspace,'synthetic-output-parent');
const markerName='.I1_WIN_PRIVATE_STAGE_SYNTHETIC_ONLY';
const caution=/Bundle may contain input-derived narratives and identifiers.*Inspect locally before sharing/;
const cases=[];
function test(id,title,fn) {
  try {const result=fn();cases.push({id,title,status:'PASS_BOUNDED',evidence:result||{}});
    console.log('PASS '+id+' '+title);}
  catch(err){cases.push({id,title,status:'FAIL',error:String(err?.stack||err).slice(0,1800)});
    console.error('FAIL '+id+' '+String(err?.message||err));}
}
function sourceCopy(tag) {
  const dir=path.join(workspace,'pack-'+tag);
  fs.cpSync(sample,dir,{recursive:true});
  return dir;
}
function sourceDigestList(root) {
  const entries=[];
  function scan(dir,relative='') {
    for(const e of fs.readdirSync(dir,{withFileTypes:true})) {
      const rel=relative ? relative+'/'+e.name : e.name;
      const p=path.join(dir,e.name);
      assert.equal(e.isSymbolicLink(),false,'Unexpected synthetic symlink');
      if(e.isDirectory())scan(p,rel);
      else {assert(e.isFile());entries.push({rel,sha256:sha(fs.readFileSync(p))});}
    }
  }
  scan(root);
  return entries.sort((a,b)=>a.rel.localeCompare(b.rel));
}
function runReview(pack,out,format) {
  const env={...process.env,
    I1_REAL_WIN_ACL_INTEGRATION_EXPERIMENT:'1',
    I1_REAL_WIN_ACL_SYNTHETIC_ONLY:'1',
    I1_REAL_WIN_ACL_MODULE_PATH:addonPath,
    I1_REAL_WIN_ACL_MODULE_SHA256:binaryDigest,
    HOME:path.join(workspace,'isolated-home'),
    USERPROFILE:path.join(workspace,'isolated-home')};
  const r=spawnSync(process.execPath,[cli,'review','--pack',pack,'--out',out,'--format',format],{
    cwd:workspace,env,encoding:'utf8',timeout:90000,
    maxBuffer:10*1024*1024,windowsHide:true
  });
  if(r.error)throw r.error;
  assert.equal(r.signal,null,'Unexpected child signal');
  return {exit:r.status,stdout:r.stdout,stderr:r.stderr};
}
function inspectProtected(file,requireProtected) {
  const a=addon.inspectAcl(file);
  assert.equal(a.filesystem,'NTFS','Require real NTFS observation');
  assert.equal(a.onlyTrustedAces,true,'Unexpected broad ACL');
  if(requireProtected){
    assert.equal(a.protectedDacl,true,'Protected NTFS DACL not established');
    assert.equal(a.hasInheritedAces,false,'Broad inherited ACEs not rejected');
  }
  return a;
}
function checkBundle(out,validationExit,expectedStatus) {
  assert(fs.existsSync(out),'Expected output Bundle not created');
  inspectProtected(out,true);
  assert.equal(fs.existsSync(path.join(out,'.private-source')),false);
  const manifest=JSON.parse(fs.readFileSync(path.join(out,'review-manifest.json'),'utf8'));
  assert.equal(manifest.kind,'mindforge_guard_review_bundle');
  assert.equal(manifest.recommendation_only,true);
  assert.equal(manifest.non_executing,true);
  assert.equal(manifest.independent_assurance,'NOT_ESTABLISHED');
  assert.equal(manifest.overall_status,expectedStatus);
  assert.equal(manifest.components.pack_validation.native_exit_code,validationExit);
  assert.equal(manifest.components.single_agent_report.native_exit_code,validationExit);
  assert.notEqual(manifest.components.single_agent_report.artifact,null);
  assert(!manifest.does_not_support.every(x=>x.includes('approval')),'Check exact nonclaims');
  const sums=JSON.parse(fs.readFileSync(path.join(out,'bundle-checksums.json'),'utf8'));
  assert.equal(sums.kind,'i1_bundle_checksums');
  assert.equal(sums.files.length,5,'Expected bounded envelope members');
  assert(!sums.files.some(x=>x.path==='bundle-checksums.json'));
  for(const f of sums.files){
    assert(!f.path.startsWith('/') && !f.path.includes('..') && !f.path.includes('\\'));
    const actual=path.join(out,...f.path.split('/'));
    inspectProtected(actual,false);
    const bytes=fs.readFileSync(actual);
    assert.equal(bytes.length,f.bytes,'Byte length mismatch: '+f.path);
    assert.equal(sha(bytes),f.sha256,'Checksum mismatch: '+f.path);
  }
  inspectProtected(path.join(out,'bundle-checksums.json'),false);
  const v=JSON.parse(fs.readFileSync(path.join(out,'components','pack-validation.json'),'utf8'));
  const report=JSON.parse(fs.readFileSync(path.join(out,'components','single-agent-governance-report.json'),'utf8'));
  assert.equal(report.deterministic_hash,v.deterministic_pack_hash);
  assert.equal(report.review_posture,expectedStatus==='ready_for_review'?'ready_for_review':'needs_human_review');
  assert.equal(manifest.input.source_basename ? typeof manifest.input.source_basename:'string','string');
  assert(!fs.readdirSync(parent).some(name=>name.startsWith('.guard-i1-partial-')),
    'Unexpected unacknowledged partial stage remains');
  return {checkedArtifactChecksums:sums.files.length,privateAclObserved:true,
    validationStatus:v.validation_status,reportPosture:report.review_posture};
}
try {
  fs.mkdirSync(parent);
  fs.mkdirSync(path.join(workspace,'isolated-home'));
  // This marker is only inside our newly allocated synthetic temp root; no
  // general customer path or parent directory can pass the existing native gate.
  fs.writeFileSync(path.join(parent,markerName),'I1_REAL_WRITER_WIN_ACL_SYNTHETIC_ONLY\n',{flag:'wx'});
  const baselineAcl=addon.inspectAcl(parent);
  assert.equal(baselineAcl.filesystem,'NTFS','Host temp parent is not confirmed NTFS');

  test('AV02-WP04','Windows private-ACL JSON Pack Review / checksums / hash parity',()=>{
    const p=sourceCopy('json');const before=sourceDigestList(p);
    const out=path.join(parent,'bundle-json');const r=runReview(p,out,'json');
    assert.equal(r.exit,0,r.stderr);
    const v=JSON.parse(r.stdout);
    assert.equal(v.status,'ready_for_review');
    assert.equal(v.native_pack_validation_exit_code,0);
    assert.equal(v.not_approval,true);
    assert.equal(v.not_execution_authority,true);
    assert.match(v.share_caution,caution);
    assert.deepEqual(sourceDigestList(p),before);
    return checkBundle(out,0,'ready_for_review');
  });
  test('AV02-WP05','Windows private-ACL text Pack Review / sharing caution',()=>{
    const p=sourceCopy('text');const before=sourceDigestList(p);
    const out=path.join(parent,'bundle-text');const r=runReview(p,out,'text');
    assert.equal(r.exit,0,r.stderr);
    assert.match(r.stdout,caution);
    assert.match(r.stdout,/not approval, certification, or execution permission/);
    assert.deepEqual(sourceDigestList(p),before);
    return checkBundle(out,0,'ready_for_review');
  });
  test('AV02-WP06','Windows private-ACL limitation preserves native exit 2 / gaps',()=>{
    const p=sourceCopy('limited');
    fs.unlinkSync(path.join(p,'snapshot.json'));
    const before=sourceDigestList(p);
    const out=path.join(parent,'bundle-limited');const r=runReview(p,out,'json');
    assert.equal(r.exit,2,r.stderr);
    const v=JSON.parse(r.stdout);
    assert.equal(v.status,'completed_with_limitations');
    assert.equal(v.native_pack_validation_exit_code,2);
    assert.match(v.share_caution,caution);
    assert.deepEqual(sourceDigestList(p),before);
    const check=checkBundle(out,2,'completed_with_limitations');
    const manifest=JSON.parse(fs.readFileSync(path.join(out,'review-manifest.json'),'utf8'));
    assert(manifest.limitations.length>0,'Limitation was erased');
    return {...check,limitationCount:manifest.limitations.length};
  });
} finally {
  // Remove ONLY this harness's newly-created private synthetic TEMP root;
  // no external stage, Pack, customer Evidence, backup or retention data.
  assert(workspace.startsWith(os.tmpdir()),'Refuse cleanup of unowned root');
  fs.rmSync(workspace,{recursive:true,force:true});
}
const failures=cases.filter(x=>x.status==='FAIL');
const receipt={
  kind:'ARCH_V02X_WIN_NTFS_SYNTHETIC_POSITIVE_EQUIVALENCE',
  sourceHead:process.env.GITHUB_SHA||'LOCAL_UNPINNED',
  originalPosixCaseIds:['AV02-P04','AV02-P05','AV02-P06'],
  windowsEquivalentIds:['AV02-WP04','AV02-WP05','AV02-WP06'],
  platform:process.platform,arch:process.arch,node:process.version,
  syntheticOnly:true,binarySha256:binaryDigest,checksumsSource:'BUILD_RECEIPT',
  originalPosixTestsOnWindows:'NOT_TESTED',
  m4Original62:'NOT_RUN',
  windows10_11_x64:'NOT_TESTED',
  signedAddonDistribution:'NOT_ESTABLISHED',
  realCustomerEvidence:'NOT_AUTHORIZED',
  independentReceiptCustody:'HOLD',
  productMergeRelease:'HOLD',
  counts:{pass:cases.length-failures.length,fail:failures.length},cases
};
console.log('ARCH_V02X_WIN_POSITIVE_RECEIPT '+JSON.stringify(receipt));
const dest=process.env.ARCH_V02X_WIN_POSITIVE_RECEIPT;
if(dest) {
  fs.mkdirSync(path.dirname(path.resolve(dest)),{recursive:true});
  fs.writeFileSync(dest,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
}
if(failures.length)process.exitCode=1;
