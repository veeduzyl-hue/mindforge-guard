// ARCH v0.2.x Azure Artifact Signing operator: NEGATIVE-ONLY defaults.
// Tests must never contact Azure or sign/execute a native binary.
// No PFX, credentials, CA roots, or signature trust mutation.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const repo=path.resolve('.');
const script=path.resolve('scripts/arch_v02x_azure_artifact_signing_operator.ps1');
if(process.platform!=='win32'||process.env.GITHUB_ACTIONS!=='true'){
  throw Error('GITHUB_WINDOWS_HOSTED_NEGATIVE_ONLY');
}
assert(fs.existsSync(script));
const cases=[];
function run(args){
  const x=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-File',script,...args],{
    cwd:repo,encoding:'utf8',windowsHide:true,maxBuffer:4*1024*1024,timeout:30000,
    env:{...process.env}
  });
  if(x.error)throw x.error;
  const label='ARCH_V02X_AZURE_SIGNING_OPERATOR ';
  const lines=(x.stdout||'').split(/\r?\n/).filter(y=>y.startsWith(label));
  assert.equal(lines.length,1,'Missing normalized status: '+x.stdout+' '+x.stderr);
  return {status:x.status,decision:JSON.parse(lines[0].slice(label.length)),stderr:x.stderr};
}
function test(id,expectedStatus,expectedExit,args){
  try{
    const r=run(args);
    assert.equal(r.status,expectedExit,id+' exit mismatch: '+r.stderr);
    assert.equal(r.decision.execution,expectedStatus,id+' policy mismatch');
    assert.equal(r.decision.productAdmission,'HOLD');
    assert.equal(r.decision.signerIdentityAndReleaseApproval,'NOT_ESTABLISHED');
    assert.equal(r.decision.actualWindows11X64ClientNativePositive,'NOT_RUN');
    cases.push({id,status:'PASS_BOUNDED',expectedStatus,expectedExit});
    console.log('PASS '+id+' '+expectedStatus);
  }catch(e){
    cases.push({id,status:'FAIL',detail:String(e?.stack||e).slice(0,2300)});
    console.error('FAIL '+id+' '+String(e?.message||e));
  }
}
test('AV02-AZ-N01','CHECK_ONLY_NOT_SIGNED_NO_CLOUD_CALL_NO_FILES_CREATED',0,[]);
test('AV02-AZ-N02','HOLD_MISSING_EXPLICIT_SIGNING_AND_POTENTIAL_COST_ACKNOWLEDGEMENT',24,['-ExecuteSign']);
test('AV02-AZ-N03','BLOCKED_DIRECT_SIGNING_ON_CI_NOT_AUTHORIZED',24,['-ExecuteSign','-AcknowledgeExternalSigning']);
test('AV02-AZ-N04','BLOCKED_DIRECT_SIGNING_ON_CI_NOT_AUTHORIZED',24,[
  '-ExecuteSign','-AcknowledgeExternalSigning',
  '-ExpectedSourceHead','a'.repeat(40)
]);
const fails=cases.filter(x=>x.status==='FAIL');
const p=spawnSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8',timeout:10000});
assert.equal(p.status,0);
const receipt={kind:'ARCH_V02X_AZURE_SIGNING_OPERATOR_NEGATIVE',
  sourceSha:p.stdout.trim(),platform:process.platform,arch:process.arch,
  accountIdentity:'NOT_AVAILABLE',signingKeys:'NOT_AVAILABLE',
  azureNetworkCalls:'NOT_PERFORMED',actualSigning:'NOT_RUN',
  signedArtifact:'NOT_CREATED',positiveClientBundle:'NOT_RUN',
  signerTrust:'NOT_ESTABLISHED',productRelease:'HOLD',
  m4Original62:'NOT_RUN',counts:{pass:cases.length-fails.length,fail:fails.length},
  cases};
console.log('ARCH_V02X_AZURE_SIGNING_NEGATIVE_RECEIPT '+JSON.stringify(receipt));
if(fails.length)process.exitCode=1;
