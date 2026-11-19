// Windows Server x64 synthetic stage interruption, not power-loss proof.
// Uses the actual isolated I-1 Writer staging function and read-only recovery.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import {inspectI1ReviewRecovery} from '../packages/guard/src/cli/review_recovery_readonly.mjs';
const require=createRequire(import.meta.url);
if(process.platform!=='win32'||process.arch!=='x64'||
   process.env.ARCH_V02X_X64_CRASH_SYNTHETIC_ONLY!=='1'||
   process.env.GITHUB_ACTIONS!=='true') throw Error('HOSTED_WINDOWS_X64_SYNTHETIC_ONLY');
const repo=path.resolve('.');
const addonPath=path.join(repo,'experiments/i1-real-writer-win-acl-integration-01/private_acl.node');
const receiptPath=path.join(repo,'experiments/i1-real-writer-win-acl-integration-01/build-receipt.json');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const nativeReceipt=JSON.parse(fs.readFileSync(receiptPath,'utf8'));
const nativeSha=sha(fs.readFileSync(addonPath));
assert.equal(nativeSha,nativeReceipt.binarySha256);
assert.equal(nativeReceipt.arch,'x64');
assert.equal(nativeReceipt.platform,'win32');
const addon=require(addonPath);
const root=fs.mkdtempSync(path.join(process.env.RUNNER_TEMP||os.tmpdir(),'arch-v02x-x64-crash-'));
const parent=path.join(root,'owned-output-parent');
const selected=path.join(root,'selected-synthetic-pack');
const final=path.join(parent,'bundle-interrupted');
const cases=[];
function check(id,fn) {
  try {const detail=fn();cases.push({id,status:'PASS_BOUNDED',detail});console.log('PASS '+id);}
  catch(error) {cases.push({id,status:'FAIL',reason:String(error.stack||error).slice(0,1600)});console.error('FAIL '+id+' '+error.message);}
}
const checkInput=()=>sha(fs.readFileSync(path.join(selected,'manifest.json')));
try {
  fs.mkdirSync(parent);
  fs.writeFileSync(path.join(parent,'.I1_WIN_PRIVATE_STAGE_SYNTHETIC_ONLY'),'I1_REAL_WRITER_WIN_ACL_SYNTHETIC_ONLY\n',{flag:'wx'});
  fs.cpSync('examples/single-agent-governance-pack/hr-self-service-agent',selected,{recursive:true});
  const before=checkInput();
  let childResult=null;
  check('AV02-X64-R01',()=>{
    const child=spawnSync(process.execPath,[path.resolve('scripts/arch_v02x_win_x64_interrupt_child.mjs'),selected,final],{
      cwd:repo,timeout:65000,maxBuffer:2e6,encoding:'utf8',windowsHide:true,
      env:{...process.env,
        I1_REAL_WIN_ACL_INTEGRATION_EXPERIMENT:'1',
        I1_REAL_WIN_ACL_SYNTHETIC_ONLY:'1',
        I1_REAL_WIN_ACL_MODULE_PATH:addonPath,
        I1_REAL_WIN_ACL_MODULE_SHA256:nativeSha}
    });
    if(child.error)throw child.error;
    assert.match(child.stdout||'',/ARCH_X64_NATIVE_STAGE_CREATED_BEFORE_INTERRUPT/);
    assert.notEqual(child.status,0,'interrupted process did not terminate');
    childResult={status:child.status,signal:child.signal||null};
    assert.equal(fs.existsSync(final),false);
    const entries=fs.readdirSync(parent).filter(n=>n.startsWith('.guard-i1-partial-'));
    assert.equal(entries.length,1,'Exactly one generated orphan stage expected');
    const stage=path.join(parent,entries[0]);
    const acl=addon.inspectAcl(stage);
    assert.equal(acl.filesystem,'NTFS');assert.equal(acl.protectedDacl,true);
    assert.equal(acl.onlyTrustedAces,true);assert.equal(acl.hasInheritedAces,false);
    assert.equal(fs.existsSync(path.join(stage,'.private-source')),false);
    const observed=inspectI1ReviewRecovery({parent,outputName:'bundle-interrupted'});
    assert.equal(observed.stageCount,1);
    assert.equal(observed.stages[0].status,'EMPTY_STAGE_REVIEW_REQUIRED');
    assert.equal(observed.constraints.noAutomaticDeletion,true);
    assert.equal(checkInput(),before);
    assert.equal(fs.existsSync(stage),true);
    return {syntheticProcessKilled:true,stagePrivateAcl:true,stageRetained:true,
      emptyStageStatus:observed.stages[0].status,rawSourceDuplicated:false};
  });
  check('AV02-X64-R02',()=>{
    const entries=fs.readdirSync(parent).filter(n=>n.startsWith('.guard-i1-partial-'));
    assert.equal(entries.length,1);
    const stage=path.join(parent,entries[0]);
    fs.writeFileSync(path.join(stage,'INCOMPLETE.json'),JSON.stringify({kind:'SYNTHETIC_INTERRUPTED_STAGE',status:'INCOMPLETE'}));
    const beforeEntries=fs.readdirSync(stage).sort();
    const a=inspectI1ReviewRecovery({parent,outputName:'bundle-interrupted'});
    const b=inspectI1ReviewRecovery({parent,outputName:'bundle-interrupted'});
    assert.equal(a.stageCount,1);
    assert.equal(a.stages[0].status,'INCOMPLETE_MARKER_REVIEW_REQUIRED');
    assert.equal(a.stages[0].autoCleanupPerformed,false);
    assert.equal(b.stages[0].status,a.stages[0].status);
    assert.deepEqual(fs.readdirSync(stage).sort(),beforeEntries);
    assert.equal(fs.existsSync(final),false);
    return {inspectorReadOnly:true,manualReviewRequired:true,
      noAutoDelete:true,completeBundleNotClaimed:true};
  });
}finally{
  // Only the own disposable CI root; never source/customer data.
  fs.rmSync(root,{recursive:true,force:true});
}
const failed=cases.filter(c=>c.status==='FAIL');
const receipt={kind:'ARCH_V02X_X64_INTERRUPTED_NATIVE_STAGE_SYNTHETIC',
  testedSourceSha:(()=>{const r=spawnSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'});return r.stdout?.trim()||'UNKNOWN';})(),
  platform:process.platform,arch:process.arch,sourceClass:'GITHUB_HOSTED_SERVER_SYNTHETIC',
  binarySha256:nativeSha,
  interruptionScope:'AFTER_NATIVE_PRIVATE_STAGE_CREATED',
  actualFullWriterCrash:'NOT_TESTED',
  physicalPowerLoss:'NOT_TESTED',userDesktop:'NOT_TESTED',
  customerEvidence:'NOT_AUTHORIZED', noAutoCleanup:true,
  counts:{pass:cases.length-failed.length,fail:failed.length},cases};
console.log('ARCH_V02X_X64_CRASH_INSPECTION_RECEIPT '+JSON.stringify(receipt));
if(failed.length)process.exitCode=1;
