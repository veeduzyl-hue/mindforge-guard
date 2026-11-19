// Windows Server x64 synthetic negative tests ONLY for Authenticode/policy gate.
// No signing key, no trust-store modification, no loading or executing native addon.
// A negative suite PASS is NOT a signed distribution or Windows11 client PASS.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';

if(process.platform!=='win32'||process.arch!=='x64'||process.env.GITHUB_ACTIONS!=='true'||
   process.env.ARCH_V02X_SIGNER_NEGATIVE_SYNTHETIC_ONLY!=='1')throw Error('HOSTED_X64_SIGNER_NEGATIVE_SCOPE_REQUIRED');
const root=fs.mkdtempSync(path.join(process.env.RUNNER_TEMP||os.tmpdir(),'arch-v02x-signer-negatives-'));
const source=path.resolve('experiments/i1-real-writer-win-acl-integration-01/private_acl.node');
const verifier=path.resolve('scripts/arch_v02x_win11_x64_signed_addon_preflight.ps1');
const sha256=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=spawnSync('git',['rev-parse','HEAD'],{encoding:'utf8',timeout:10000});
assert.equal(git.status,0);
const head=git.stdout.trim();assert.match(head,/^[a-f0-9]{40}$/);
const cases=[];
const run=(args)=>{
  const r=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-File',verifier,
    '-HostedServerNegativeOnly',...args],{encoding:'utf8',windowsHide:true,timeout:90000,maxBuffer:4e6});
  if(r.error)throw r.error;
  const prefix='ARCH_V02X_SIGNED_ADDON_PREFLIGHT ';
  const line=(r.stdout||'').split(/\r?\n/).find(x=>x.startsWith(prefix));
  assert(line,'No normalized decision: '+(r.stdout||'')+' '+(r.stderr||''));
  return {code:r.status,decision:JSON.parse(line.slice(prefix.length)),stderr:r.stderr};
};
const one=(id,reason,cb)=>{
  try{const v=cb();assert.equal(v.code,24,id+' must refuse');assert.equal(v.decision.decision,reason);
    cases.push({id,status:'PASS_BOUNDED',expectedRefusal:reason});console.log('PASS '+id+' '+reason);}
  catch(e){cases.push({id,status:'FAIL',detail:String(e?.stack||e).slice(0,2500)});
    console.error('FAIL '+id+' '+String(e?.message||e));}
};
try{
 assert(fs.existsSync(verifier));
 assert(fs.existsSync(source),'Real compiled unsigned x64 Node-API8 addon required');
 // Parse verification is enforced using PowerShell's own language parser.
 const parse=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',
  '$tok=$null;$err=$null;'+
  '[System.Management.Automation.Language.Parser]::ParseFile($args[0],[ref]$tok,[ref]$err)|Out-Null;'+
  'if($err.Count -gt 0){$err|Out-String|Write-Error;exit 13};exit 0',verifier],
 {encoding:'utf8',windowsHide:true,timeout:30000});
 assert.equal(parse.status,0,'PowerShell parser rejected preflight: '+parse.stdout+parse.stderr);
 const addon=path.join(root,'private_acl.node');
 fs.copyFileSync(source,addon,fs.constants.COPYFILE_EXCL);
 const bytes=fs.readFileSync(addon);
 const digest=sha256(bytes);
 const policyPath=path.join(root,'admission-policy.json');
 const policyBase={
  kind:'ARCH_V02X_WIN_SIGNED_ADDON_ADMISSION_POLICY',
  version:'0.1',scope:'BOUNDED_SYNTHETIC_PACK_ONLY',
  source_head:head,platform:'win32',arch:'x64',
  node_api_min:8,artifact_file_name:'private_acl.node',
  artifact_sha256:digest,artifact_size_bytes:bytes.length,
  signer_thumbprint:'0'.repeat(40),
  signer_cert_sha256:'0'.repeat(64),
  root_thumbprint:'0'.repeat(40),
  release_authorization:'NOT_ESTABLISHED',
  note:'Unsigned synthetic negative fixture: deliberately not a release policy'
 };
 function writePolicy(p){
  fs.writeFileSync(policyPath,JSON.stringify(p,null,2)+'\n');
  return sha256(fs.readFileSync(policyPath));
 }
 const exactArgs=(policySha,addonFile=addon,sourceSha=head)=>[
  '-AddonFile',addonFile,'-PolicyFile',policyPath,'-ExpectedPolicySha256',policySha,
  '-ExpectedSourceHead',sourceSha
 ];
 const policySha=writePolicy(policyBase);
 one('AV02-SIGN-N01','HOLD_MISSING_SIGNED_ARTIFACT_OR_OWNER_PINNED_POLICY',()=>run([]));
 one('AV02-SIGN-N02','BLOCKED_INVALID_POLICY_SHA_OR_SOURCE_IDENTITY',()=>
  run(exactArgs('g'.repeat(64))));
 one('AV02-SIGN-N03','BLOCKED_OWNER_POLICY_SHA_MISMATCH',()=>
  run(exactArgs('a'.repeat(64))));
 one('AV02-SIGN-N04','BLOCKED_POLICY_CONTRACT_OR_SOURCE_MISMATCH',()=>
  run(exactArgs(policySha,addon,'f'.repeat(40))));
 one('AV02-SIGN-N05','BLOCKED_MISSING_LOCAL_ARTIFACT_OR_POLICY',()=>
  run(exactArgs(policySha,path.join(root,'missing.node'))));
 const mismatch=writePolicy({...policyBase,artifact_sha256:'a'.repeat(64)});
 one('AV02-SIGN-N06','BLOCKED_NATIVE_BINARY_SHA256_MISMATCH',()=>
  run(exactArgs(mismatch)));
 const wrongArch=writePolicy({...policyBase,arch:'arm64'});
 one('AV02-SIGN-N07','BLOCKED_POLICY_CONTRACT_OR_SOURCE_MISMATCH',()=>
  run(exactArgs(wrongArch)));
 const unsupportedSigner=writePolicy({...policyBase,claimed_issuer:'Owner trusted',claimed_signature:'PASS'});
 one('AV02-SIGN-N08','BLOCKED_AUTHENTICODE_NOT_VALID_OR_UNSIGNED',()=>
  run(exactArgs(unsupportedSigner)));
 const normal=writePolicy(policyBase);
 one('AV02-SIGN-N09','BLOCKED_AUTHENTICODE_NOT_VALID_OR_UNSIGNED',()=>
  run(exactArgs(normal)));
 assert.equal(sha256(fs.readFileSync(addon)),digest,'Source addon changed');
} finally {
 // Only the harness-created synthetic path; no registered/installed addon cleanup.
 fs.rmSync(root,{recursive:true,force:true});
}
const failed=cases.filter(x=>x.status==='FAIL');
const receipt={
 kind:'ARCH_V02X_X64_AUTHENTICODE_FAIL_CLOSED_NEGATIVE',
 testedSourceHead:head,platform:process.platform,arch:process.arch,
 sourceClass:'HOSTED_WINDOWS_SERVER_SYNTHETIC',signatureTrust:'NOT_ESTABLISHED',
 selfSignedRootInstalled:false,realSigningKeyAvailable:false,
 windows11x64OwnerNativePositive:'NOT_TESTED',
 windowsProductRelease:'HOLD',realCustomerEvidence:'NOT_AUTHORIZED',
 originalM4Cases:'NOT_RUN',
 counts:{pass:cases.length-failed.length,fail:failed.length},cases
};
console.log('ARCH_V02X_SIGNER_NEGATIVE_RECEIPT '+JSON.stringify(receipt));
if(process.env.ARCH_V02X_SIGNER_NEGATIVE_RECEIPT){
 const out=path.resolve(process.env.ARCH_V02X_SIGNER_NEGATIVE_RECEIPT);
 const parent=path.resolve(process.env.RUNNER_TEMP||os.tmpdir());
 if(!out.startsWith(parent+path.sep))throw Error('RECEIPT_OUTSIDE_CI_TEMP');
 fs.writeFileSync(out,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
}
if(failed.length)process.exitCode=1;
