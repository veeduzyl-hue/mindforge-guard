// M5 security R&D — exact P1 commit with NO ancestor objects in shallow local
// checkout. CI-only; no external distribution, Git remote, telemetry or customer data.
// This is a ONE-COMMIT SHALLOW Git checkout, NOT a Git-free source archive.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';

const P1='2a5365ea422b6dfb7f3d7bba81138e1e53862be1';
const ALLOWED_PARENT='f43862f93741a0e377358e820f2f45f8d92f8424';
if(process.env.GITHUB_ACTIONS!=='true'||
   process.env.ARCH_V02X_M5_SHALLOW_SNAPSHOT_SYNTHETIC_ONLY!=='1'){
 throw Error('HOSTED_CI_SHALLOW_SNAPSHOT_SYNTHETIC_ONLY');
}
const checkout=process.cwd();
const root=fs.mkdtempSync(path.join(process.env.RUNNER_TEMP||os.tmpdir(),
 'arch-v02x-m5-shallow-'));
const single=path.join(root,'fixed-p1-shallow');
const demo=path.join(os.tmpdir(),'guard-v02x-synthetic-'+crypto.randomUUID().replaceAll('-',''));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function run(bin,args,cwd,env={}){
 const r=spawnSync(bin,args,{cwd,encoding:'utf8',timeout:90000,maxBuffer:6*1024*1024,
  windowsHide:true,env:{...process.env,...env,GIT_TERMINAL_PROMPT:'0'}});
 if(r.error||r.signal)throw Error('CHILD_PROCESS_FAILED_'+bin);
 return{code:r.status,stdout:r.stdout,stderr:r.stderr};
}
function git(args,cwd=checkout){
 const r=run('git',args,cwd);
 if(r.code!==0)throw Error('GIT_IDENTITY_OR_SHALLOW_OPERATION_FAILED_'+args[0]);
 return r.stdout.trim();
}
let output;
try{
 const source=git(['rev-parse','HEAD']);
 git(['merge-base','--is-ancestor',ALLOWED_PARENT,source]);
 git(['cat-file','-e',P1+'^{commit}']);
 fs.mkdirSync(single);
 git(['init','-q'],single);
 git(['config','core.autocrlf','false'],single);
 git(['-c','protocol.file.allow=always','fetch','--no-tags','--depth=1',checkout,P1],single);
 git(['checkout','--detach',P1],single);
 const fetchHead=path.join(single,'.git','FETCH_HEAD');
 // Git records the local checkout path in FETCH_HEAD. Never export it.
 if(fs.existsSync(fetchHead))fs.unlinkSync(fetchHead);
 const exact=git(['rev-parse','HEAD'],single);
 const depth=Number(git(['rev-list','--count','HEAD'],single));
 const isShallow=git(['rev-parse','--is-shallow-repository'],single);
 const status=git(['status','--porcelain=v1'],single);
 const remotes=git(['remote'],single);
 const fsck=run('git',['fsck','--full','--no-reflogs'],single);
 const headCommit=git(['show','-s','--format=%P','HEAD'],single);
 const ancestorObjectAvailable=headCommit.length>0?
   run('git',['cat-file','-e',headCommit.split(/\s+/)[0]+'^{commit}'],single).code===0:false;
 assert.equal(exact,P1,'Wrong exact fixed P1 SHA');
 assert.equal(depth,1,'Reachable history must be a single shallow commit');
 assert.equal(isShallow,'true');
 assert.equal(status,'','Shallow worktree must be clean');
 assert.equal(remotes,'','Shallow handoff must not contain a network remote');
 assert.equal(fsck.code,0,'Shallow object graph must verify');
 assert.equal(ancestorObjectAvailable,false,'One shallow commit must not contain its parent object');
 assert(fs.existsSync(path.join(single,'scripts','arch_v02x_m3_first_report_walkthrough_synthetic.mjs')));
 assert(!fs.existsSync(path.join(single,'.git','FETCH_HEAD')));
 assert(!fs.existsSync(path.join(single,'.git','objects','info','alternates')));
 // CI-generated eight confirms are TEST FIXTURES, not human review.
 const script=path.join(single,'scripts','arch_v02x_m3_first_report_walkthrough_synthetic.mjs');
 const env={ARCH_V02X_FIRST_REPORT_DEMO_SYNTHETIC_ONLY:'1'};
 const prepared=run(process.execPath,[script,'--mode','prepare','--workspace',demo],single,env);
 assert.equal(prepared.code,0,'Shallow source PREPARE failed');
 const preparedReceipt=JSON.parse(prepared.stdout);
 assert.equal(preparedReceipt.status,'SYNTHETIC_PREPARED');
 assert.equal(preparedReceipt.source_head,P1);
 const decisionsPath=path.join(demo,'mapping-decisions.synthetic.json');
 const choices=JSON.parse(fs.readFileSync(decisionsPath,'utf8'));
 assert.equal(choices.decisions.length,8);
 assert(choices.decisions.every(x=>x.decision==='defer'));
 for(const item of choices.decisions){
  item.decision='confirm';item.basis='source_reviewed';
  item.notes=['synthetic_checked_structure'];
 }
 fs.writeFileSync(decisionsPath,JSON.stringify(choices,null,2)+'\n');
 const actual=run(process.execPath,[script,'--mode','complete','--workspace',demo],single,env);
 assert.equal(actual.code,0,'One-commit shallow fixed source COMPLETE failed');
 const receipt=JSON.parse(actual.stdout);
 assert.equal(receipt.status,'SYNTHETIC_DEMO_DELIVERY_CREATED');
 assert.equal(receipt.validation,'valid_with_no_omissions');
 assert.equal(receipt.report_posture,'ready_for_review');
 assert.equal(receipt.mapping_decisions,8);
 assert.equal(receipt.product_bundle,'NOT_ADMITTED');
 const delivered=path.join(demo,'delivery');
 const index=JSON.parse(fs.readFileSync(path.join(delivered,'demo-checksums.json'),'utf8'));
 assert.equal(index.files.length,17);
 for(const f of index.files){
  const member=path.join(delivered,...f.relative_path.split('/'));
  const bytes=fs.readFileSync(member);
  assert.equal(bytes.length,f.byte_length);
  assert.equal(sha(bytes),f.sha256);
 }
 const report=JSON.parse(fs.readFileSync(path.join(delivered,'single-agent-report.json'),'utf8'));
 const validation=JSON.parse(fs.readFileSync(path.join(delivered,'pack-validation.json'),'utf8'));
 assert.equal(report.deterministic_hash,validation.deterministic_pack_hash);
 const manifest=JSON.parse(fs.readFileSync(path.join(delivered,'demo-delivery-manifest.json'),'utf8'));
 assert.equal(manifest.human_first_user_witnessed,false);
 output={
  kind:'M5_P1_ONE_COMMIT_SHALLOW_OFFLINE_CANDIDATE_TEST',
  source_candidate_head:source,fixed_original_source_head:exact,
  fixed_original_ancestry_omitted_from_shallow_checkout:true,
  git_history_commits_reachable_in_checkout:depth,
  locally_disclosed_commit_metadata_still_present:true,
  shallow_repository:true,no_git_remotes:true,
  fixed_source_checkout_clean:true,
  source_parent_commit_object_present:false,
  file_bytes_identity_proven_by_git_object_checks:true,
  synthetic_prepare:'PASS_BOUNDED',
  synthetic_auto_confirm_not_human:true,
  native_pack_validate:'valid_with_no_omissions',
  native_report_preview:'ready_for_review',
  demo_checksum_entries_verified:index.files.length,
  report_pack_hash_match:true,
  new_external_history_free_package:'NOT_DISTRIBUTED',
  current_tree_secret_audit:'NOT_PERFORMED_IN_THIS_TEST',
  independent_full_secret_audit:'NOT_PERFORMED',
  m5_external_participant:'NOT_TESTED',
  windows_external_handoff:'HOLD_PENDING_OWNER_AND_SECURITY_REVIEW',
  m4_original_62:'NOT_RUN',
  no_real_customer_data:true,no_release:true,no_main_merge:true
 };
}catch(e){
 output={kind:'M5_P1_ONE_COMMIT_SHALLOW_OFFLINE_CANDIDATE_TEST',
  source_candidate_head:'NOT_CONFIRMED',
  status:'BLOCKED',error_type:e?.name||'Error',
  distribution:'HOLD',m5_external_participant:'NOT_TESTED',
  m4_original_62:'NOT_RUN'};
 process.exitCode=1;
}finally{
 if(fs.existsSync(demo))fs.rmSync(demo,{recursive:true,force:true});
 if(fs.existsSync(root))fs.rmSync(root,{recursive:true,force:true});
}
console.log('ARCH_M5_P1_SHALLOW_OFFLINE_TEST_RECEIPT '+JSON.stringify(output));
