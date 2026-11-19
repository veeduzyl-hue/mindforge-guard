// ARCH v0.2.x: test ONLY local, ephemeral, UNPUBLISHED native-addon sidecar
// integrity on a disposable GitHub Actions Windows 11 ARM64 runner.
// Exact SHA256 matching is NOT a signer/producer authenticity proof.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
const require=createRequire(import.meta.url);
const guard=(reason)=>{throw Error(reason);};
if(process.platform!=='win32'||process.arch!=='arm64'||process.env.ARCH_V02X_ARM_CI_SYNTHETIC_ONLY!=='1'){
  guard('ARM64_WINDOWS_GITHUB_SYNTHETIC_ONLY');
}
const repo=path.resolve('.');
const source=path.join(repo,'experiments/i1-real-writer-win-acl-integration-01/private_acl.node');
const buildReceipt=path.join(repo,'experiments/i1-real-writer-win-acl-integration-01/build-receipt.json');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=spawnSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8',windowsHide:true,timeout:10000});
if(git.error||git.status!==0)guard('SOURCE_HEAD_CANNOT_BE_READ');
const sourceSha=git.stdout.trim();assert.match(sourceSha,/^[0-9a-f]{40}$/);
const br=JSON.parse(fs.readFileSync(buildReceipt,'utf8'));
const originalBytes=fs.readFileSync(source);
const actual=hash(originalBytes);
assert.equal(actual,br.binarySha256);
assert.equal(br.platform,'win32');
assert.equal(br.arch,'arm64');
assert.equal(br.node,process.version);
assert.equal(br.productIntegration,false);
assert.equal(br.experimentalOnly,true);
const sandbox=fs.mkdtempSync(path.join(os.tmpdir(),'arch-v02x-arm-sidecar-'));
const dst=path.join(sandbox,'native_private_acl.node');
const cases=[];
const test=(id,title,fn)=>{
  try{fn();cases.push({id,title,status:'PASS'});console.log('PASS '+id+' '+title);}
  catch(err){cases.push({id,title,status:'FAIL',error:String(err?.stack||err).slice(0,1500)});
    console.error('FAIL '+id+' '+String(err?.message||err));}
};
const manifest={
  kind:'ARCH_V02X_TEST_ONLY_NATIVE_ADDON_SIDECAR',
  runtime:'node',
  napiRequired:8,
  nodeVersion:process.version,
  platform:'win32',
  arch:'arm64',
  sourceSha:sourceSha,
  binarySha256:actual,
  binaryBytes:originalBytes.length,
  signatureStatus:'NOT_ESTABLISHED',
  signingKeyCustody:'NOT_ESTABLISHED',
  trustAnchor:'NOT_ESTABLISHED',
  distributionAuthority:'NOT_AUTHORIZED',
  customerUse:'NOT_AUTHORIZED',
  npmPublish:'NOT_AUTHORIZED'
};
function verifyIntegrityOnly(file,m){
  if(m.platform!=='win32'||m.arch!=='arm64')return 'REJECT_PLATFORM_ARCH';
  if(m.nodeVersion!==process.version || Number(process.versions.napi)<m.napiRequired)return 'REJECT_NODE_NAPI';
  if(!fs.existsSync(file))return 'REJECT_ABSENT_BINARY';
  const bytes=fs.readFileSync(file);
  if(bytes.length!==m.binaryBytes||hash(bytes)!==m.binarySha256)return 'REJECT_BINARY_DIGEST';
  return 'INTEGRITY_ONLY_UNSIGNED_HOLD';
}
function assessDistribution(m){
  if(m.signatureStatus!=='VERIFIED_TRUSTED_SIGNATURE'||
     m.signingKeyCustody!=='INDEPENDENT_PROTECTED_CUSTODY'||
     m.trustAnchor!=='EXTERNALLY_APPROVED_TRUST_ANCHOR'||
     m.distributionAuthority!=='OWNER_APPROVED_RELEASE'){
    return 'DISTRIBUTION_NOT_ADMITTED';
  }
  // This prototype does not implement an independent signature verifier.
  // Even supplied "positive" self-declared metadata cannot grant admission.
  return 'DISTRIBUTION_NOT_ADMITTED';
}
try{
  fs.writeFileSync(dst,originalBytes,{flag:'wx'});
  test('AV02-ARM-D01','isolated sidecar byte identity and local native load',()=>{
    assert.equal(verifyIntegrityOnly(dst,manifest),'INTEGRITY_ONLY_UNSIGNED_HOLD');
    const native=require(dst);
    assert.equal(typeof native.inspectAcl,'function');
    assert.equal(typeof native.createPrivateBound,'function');
    assert.equal(assessDistribution(manifest),'DISTRIBUTION_NOT_ADMITTED');
  });
  test('AV02-ARM-D02','one-byte tampering rejects before native loading',()=>{
    const corrupt=path.join(sandbox,'tampered.node');
    const contents=Buffer.from(originalBytes);
    contents[contents.length-1]^=1;
    fs.writeFileSync(corrupt,contents,{flag:'wx'});
    assert.equal(verifyIntegrityOnly(corrupt,manifest),'REJECT_BINARY_DIGEST');
    // Never require a tampered native binary.
  });
  test('AV02-ARM-D03','mismatched OS or architecture rejected',()=>{
    assert.equal(verifyIntegrityOnly(dst,{...manifest,arch:'x64'}),'REJECT_PLATFORM_ARCH');
    assert.equal(verifyIntegrityOnly(dst,{...manifest,platform:'linux'}),'REJECT_PLATFORM_ARCH');
  });
  test('AV02-ARM-D04','mismatched Node binary identity rejected',()=>{
    assert.equal(verifyIntegrityOnly(dst,{...manifest,nodeVersion:'v22.0.0'}),'REJECT_NODE_NAPI');
  });
  test('AV02-ARM-D05','missing binary rejected',()=>{
    assert.equal(verifyIntegrityOnly(path.join(sandbox,'absent.node'),manifest),'REJECT_ABSENT_BINARY');
  });
  test('AV02-ARM-D06','unsupported signature claims never turn self-asserted integrity into trust',()=>{
    assert.equal(assessDistribution(manifest),'DISTRIBUTION_NOT_ADMITTED');
    const forged={...manifest,signatureStatus:'VERIFIED_TRUSTED_SIGNATURE',
      signingKeyCustody:'INDEPENDENT_PROTECTED_CUSTODY',
      trustAnchor:'EXTERNALLY_APPROVED_TRUST_ANCHOR',
      distributionAuthority:'OWNER_APPROVED_RELEASE'};
    assert.equal(assessDistribution(forged),'DISTRIBUTION_NOT_ADMITTED');
  });
}finally{
  // Disposable and newly-created test-root only; no source cleanup.
  fs.rmSync(sandbox,{recursive:true,force:true});
}
const failed=cases.filter(x=>x.status==='FAIL');
const receipt={kind:'ARCH_V02X_NATIVE_ARM_OFFLINE_IDENTITY_SYNTHETIC',
  testedSourceSha:sourceSha,platform:process.platform,arch:process.arch,node:process.version,
  binarySha256:actual,trustClass:'CHECKSUM_INTEGRITY_ONLY',
  signatureStatus:'NOT_ESTABLISHED',distributionAdmission:'HOLD',
  supportedDesktopWindows11ARM64:'CANDIDATE_TEST_ONLY',
  customerInstall:'NOT_TESTED',windows10x64:'NOT_TESTED',windows11x64:'NOT_TESTED',
  originalM4Cases:'NOT_RUN',counts:{pass:cases.length-failed.length,fail:failed.length},cases};
console.log('ARCH_V02X_ARM_OFFLINE_IDENTITY_RECEIPT '+JSON.stringify(receipt));
if(process.env.ARCH_V02X_ARM_OFFLINE_RECEIPT){
  const target=path.resolve(process.env.ARCH_V02X_ARM_OFFLINE_RECEIPT);
  if(!target.startsWith(path.resolve(process.env.RUNNER_TEMP||os.tmpdir())+path.sep)){
    throw Error('RECEIPT_OUTSIDE_RUNNER_TEMP_REFUSED');
  }
  fs.writeFileSync(target,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
}
if(failed.length)process.exitCode=1;
