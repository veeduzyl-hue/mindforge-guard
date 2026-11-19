// M5 P1 fixed-source participant transport kit. HOSTED CI ONLY, no user tests.
// The reading kit contains ONLY P1 synthetic HTML and blank study forms.
// The technical kit additionally contains an offline Git bundle of the fixed
// public-source P1 commit, so first use needs no live GitHub availability.
// No participant outcome, consent or acceptance is fabricated by this builder.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const P1='2a5365ea422b6dfb7f3d7bba81138e1e53862be1';
if(process.env.GITHUB_ACTIONS!=='true'||process.env.ARCH_V02X_M5_PACK_BUILD_SYNTHETIC_ONLY!=='1'){
 throw Error('CI_SYNTHETIC_M5_PACKAGE_GATE_REQUIRED');
}
const main=process.env.ARCH_V02X_M5_BUILDER_ROOT;
const fixed=process.env.ARCH_V02X_M5_FIXED_SOURCE_ROOT;
const runner=process.env.RUNNER_TEMP;
if(!main||!fixed||!runner||![main,fixed,runner].every(path.isAbsolute)){
 throw Error('EXPLICIT_ABSOLUTE_CI_ROOTS_REQUIRED');
}
function run(program,args,cwd,timeout=60000){
 const r=spawnSync(program,args,{cwd,encoding:'utf8',timeout,maxBuffer:12*1024*1024,windowsHide:true,
  env:{...process.env,CI:'true',I1_REAL_WIN_ACL_INTEGRATION_EXPERIMENT:'0',
   I1_REAL_WIN_ACL_SYNTHETIC_ONLY:'0',I1_REAL_WIN_ACL_MODULE_PATH:'',
   I1_REAL_WIN_ACL_MODULE_SHA256:''}});
 if(r.error||r.status!==0)throw Error('COMMAND_FAILED_'+program+':'+(r.stderr||r.stdout||String(r.error)).slice(0,700));
 return r.stdout;
}
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const root=path.resolve(runner);
const buildRoot=path.join(root,'arch-v02x-m5-p1-output');
if(fs.existsSync(buildRoot))throw Error('M5_OUTPUT_ROOT_ALREADY_EXISTS');
const reading=path.join(buildRoot,'reading-only-kit');
const technical=path.join(buildRoot,'full-windows-first-user-kit');
const receiptDir=path.join(buildRoot,'internal-build-receipt');
fs.mkdirSync(buildRoot,{recursive:false,mode:0o700});
for(const r of [reading,technical,receiptDir])fs.mkdirSync(r,{mode:0o700});
const head=run('git',['rev-parse','HEAD'],fixed).trim();
if(head!==P1)throw Error('P1_TEST_SOURCE_SHA_MISMATCH');
if(run('git',['status','--porcelain=v1','--untracked-files=normal'],fixed).trim()!==''){
 throw Error('P1_FIXED_SOURCE_WORKTREE_NOT_CLEAN');
}
const candidate=run('git',['rev-parse','HEAD'],main).trim();
assert.match(candidate,/^[0-9a-f]{40}$/);
const docRoot=path.join(main,'docs','validation');
const tasks='M5_P1_INDEPENDENT_TESTER_GUIDE_v0.2.md';
const observation='M5_P1_OBSERVATION_FORM_v0.2.md';
const docFiles=[tasks,observation];
for(const f of docFiles)assert(fs.existsSync(path.join(docRoot,f)),f);
const sourcePack=path.join(fixed,'examples','single-agent-governance-pack','hr-self-service-agent');
assert(fs.existsSync(path.join(sourcePack,'manifest.json')));
const cli=path.join(fixed,'packages','guard','bin','guard.mjs');
const reportJson=run(process.execPath,[cli,'report','single-agent','--pack',sourcePack,'--preview','--json'],fixed);
const report=JSON.parse(reportJson);
if(report.review_posture!=='ready_for_review'||report.report_mode!=='preview'||
   !/^sha256:[a-f0-9]{64}$/.test(report.deterministic_hash)){
 throw Error('P1_SOURCE_REPORT_SEMANTICS_CHANGED');
}
const temp=path.join(buildRoot,'temp-render');
fs.mkdirSync(temp,{mode:0o700});
fs.writeFileSync(path.join(temp,'report.json'),reportJson,{flag:'wx',mode:0o600});
run(process.execPath,[cli,'report','render','--input',path.join(temp,'report.json'),
 '--out',path.join(temp,'report.html'),'--format','html'],fixed);
const html=fs.readFileSync(path.join(temp,'report.html'));
if(!html.toString('utf8').includes('FIRST_REPORT_P1_LEGIBILITY_V01')||
   !html.toString('utf8').includes('No operational authority')||
   html.toString('utf8').includes('<script>')){
 throw Error('P1_LEGIBLE_HTML_CONTENT_OR_CSP_UNEXPECTED');
}
const confirmationTemplate={
 kind:'M5_P1_INDEPENDENT_FIRST_USER_SESSION_RECEIPT_TEMPLATE',
 version:'0.2',source_head:P1,
 source_class:'HUMAN_FIRST_USE_NOT_YET_OBSERVED',
 anonymous_participant_code:'NOT_ASSIGNED',
 track:'NOT_SELECTED',
 participant_prior_guard_use:'NOT_RECORDED',
 consent_recorded:false,
 independent_from_development:'NOT_ESTABLISHED',
 os_family:'NOT_RECORDED',
 powershell_version:'NOT_RECORDED',
 node_version:'NOT_RECORDED',
 start_local_time:'NOT_RECORDED',
 end_local_time:'NOT_RECORDED',
 duration_to_first_report_minutes:'NOT_RECORDED',
 manual_command_count:'NOT_RECORDED',
 mapping_decision_count:'NOT_RECORDED',
 uncoached_help_count:'NOT_RECORDED',
 task_disposition:'NOT_RUN',
 native_pack_validate:'NOT_RUN',
 native_report_preview:'NOT_RUN',
 html_opened:'NOT_RUN',
 perspective_switch:'NOT_TESTED',
 source_link_and_original_json:'NOT_TESTED',
 authority_comprehension:'NOT_TESTED',
 reported_hash_comprehension:'NOT_TESTED',
 readability_at_200_percent:'NOT_TESTED',
 observed_friction:'NOT_RECORDED',
 evidence_class:'NOT_ESTABLISHED',
 status:'M5_HUMAN_FIRST_USER_NOT_TESTED',
 original_m4_62:'NOT_RUN',
 customer_data_used:false,
 signed_native_addon:'NOT_USED',
 release_admission:'HOLD'
};
const json=o=>JSON.stringify(o,null,2)+'\n';
for(const dst of [reading,technical]){
 fs.mkdirSync(path.join(dst,'reading'),{mode:0o700});
 for(const file of docFiles)fs.copyFileSync(path.join(docRoot,file),path.join(dst,file));
 fs.copyFileSync(path.join(temp,'report.html'),path.join(dst,'reading','report.html'));
 fs.copyFileSync(path.join(temp,'report.json'),path.join(dst,'reading','report.json'));
 fs.writeFileSync(path.join(dst,'M5_P1_SESSION_RECEIPT_TEMPLATE.json'),json(confirmationTemplate),{flag:'wx'});
}
const gitBundleDir=path.join(technical,'source');
fs.mkdirSync(gitBundleDir,{mode:0o700});
const bundle=path.join(gitBundleDir,'mindforge-guard-p1-fixed.bundle');
run('git',['bundle','create',bundle,'HEAD'],fixed,120000);
run('git',['bundle','verify',bundle],fixed,30000);
const checkout=path.join(buildRoot,'verify-git-bundle-clone');
run('git',['clone','--quiet',bundle,checkout],buildRoot,120000);
if(run('git',['rev-parse','HEAD'],checkout).trim()!==P1)throw Error('M5_OFFLINE_BUNDLE_CHECKOUT_SHA_MISMATCH');
if(run('git',['status','--porcelain=v1'],checkout).trim())throw Error('M5_OFFLINE_BUNDLE_CHECKOUT_DIRTY');
assert(fs.existsSync(path.join(checkout,'scripts','arch_v02x_m3_first_report_walkthrough_synthetic.mjs')));
const forbidden=run('git',['ls-tree','-r','--name-only',P1],checkout).split('\n')
 .filter(x=>/\.(pfx|p12|key|pem)$/i.test(x)||/\/\.env(?:\.|$)/i.test(x));
// Only two independently reviewed known-safe public files, pinned by exact Git
// blob identity. This checks the current tree, not all public Git history.
const allowedPublic=new Map([
 ['apps/license-hub/.env.example','82b38461c20c14b5613ce5177b79ab3c954e7c64'],
 ['packages/guard/src/product/keys/guard_ed25519_public.pem','7bdc259a0b2b9836044c2a2acd0e524814997b16']
]);
for(const rel of forbidden){
 const expected=allowedPublic.get(rel);
 if(!expected)throw Error('UNREVIEWED_CREDENTIAL_LIKE_TRACKED_FILE_IN_SOURCE_TREE');
 const blob=run('git',['hash-object','--',rel],checkout).trim();
 if(blob!==expected)throw Error('APPROVED_PUBLIC_EXAMPLE_BLOB_CHANGED');
 const body=fs.readFileSync(path.join(checkout,...rel.split('/')),'utf8');
 if(rel.endsWith('.env.example')&&(!body.includes('REPLACE_ME')||
    !body.includes('replace-with-long-random-secret')||
    !body.includes('admin@example.com')))throw Error('PUBLIC_ENV_EXAMPLE_NO_LONGER_PLACEHOLDER');
 if(rel.endsWith('guard_ed25519_public.pem')&&(!body.startsWith('-----BEGIN PUBLIC KEY-----')||
    body.includes('BEGIN PRIVATE KEY')))throw Error('PUBLISHED_PUBLIC_KEY_UNSAFE');
}
for(const [rootDir,track] of [[reading,'A_REPORT_READING_ONLY'],[technical,'B_WINDOWS_FIRST_USER_WORKFLOW']]){
 const lead=[
  'MINDFORGE GUARD — M5 P1 INDEPENDENT FIRST-USER TRIAL (EXPERIMENTAL)',
  'SOURCE_HEAD='+P1,
  'KIT_TRACK='+track,
  'NO CUSTOMER DATA; NO UNTRUSTED NATIVE ADDON; NO PRODUCT RELEASE',
  'Open M5_P1_INDEPENDENT_TESTER_GUIDE_v0.2.md and the blank observation form.',
  track.startsWith('A')?'Open reading/report.html, answer comprehension tasks. No installation required.':
   'Do NOT preview reading/report.html before your own Track B workflow. Use source/mindforge-guard-p1-fixed.bundle and Node 24 + Windows PowerShell + Git.',
  'All receipt fields start NOT RUN. Real participant completion is required.',
  'Use participant code rather than a real name. Do not send system logs or local paths.',
  'The P1 report is a preview. Ready for human review is not approval.'
 ];
 fs.writeFileSync(path.join(rootDir,'00_START_HERE.txt'),lead.join('\n')+'\n',{flag:'wx'});
 const entries=[];
 function walk(base,rel=''){
  for(const e of fs.readdirSync(base,{withFileTypes:true})){
    const sub=rel?rel+'/'+e.name:e.name;
    if(['M5_PACKAGE_INDEX.json','SHA256SUMS.txt'].includes(e.name)&&rel==='')continue;
    const loc=path.join(base,e.name);
    if(e.isDirectory())walk(loc,sub);
    else if(e.isFile()){
      const b=fs.readFileSync(loc);
      entries.push({relative_path:sub,bytes:b.length,sha256:sha(b)});
    }else throw Error('M5_KIT_UNSAFE_FILE_TYPE');
  }
 }
 walk(rootDir);
 entries.sort((a,b)=>a.relative_path.localeCompare(b.relative_path));
 if(entries.some(e=>e.relative_path.endsWith('.node')||e.relative_path.endsWith('.pfx')))
   throw Error('M5_KIT_CONTAINS_NATIVE_BINARY_OR_PRIVATE_KEY');
 const manifest={
  kind:'M5_P1_INDEPENDENT_FIRST_USER_KIT',
  version:'0.2',candidate_head:candidate,fixed_source_head:P1,
  track,synthetic_only:true,
  report_status:report.review_posture,
  report_deterministic_hash:report.deterministic_hash,
  full_bundle_sha256:track.startsWith('B')?sha(fs.readFileSync(bundle)):null,
  m5_independent_human_session:'NOT_TESTED',
  actual_reviewer_consent:'NOT_OBTAINED',
  first_use_admission:'NOT_ESTABLISHED',
  no_product_release:true,
  no_customer_input:true,
  includes_source_history:track.startsWith('B'),
  files:entries
 };
 fs.writeFileSync(path.join(rootDir,'M5_PACKAGE_INDEX.json'),json(manifest),{flag:'wx'});
 const sums=entries.map(e=>e.sha256+'  '+e.relative_path).join('\n')+'\n';
 fs.writeFileSync(path.join(rootDir,'SHA256SUMS.txt'),sums,{flag:'wx'});
 for(const entry of entries){
  const loc=path.join(rootDir,...entry.relative_path.split('/'));
  const b=fs.readFileSync(loc);
  if(b.length!==entry.bytes||sha(b)!==entry.sha256)throw Error('M5_KIT_CHECKSUM_MISMATCH');
 }
}
const fullIndex=JSON.parse(fs.readFileSync(path.join(technical,'M5_PACKAGE_INDEX.json')));
const simpleIndex=JSON.parse(fs.readFileSync(path.join(reading,'M5_PACKAGE_INDEX.json')));
const receipt={
 kind:'M5_P1_SYNTHETIC_KIT_BUILD_RECEIPT',
 fixed_source_head:P1,kit_source_head:candidate,
 reading_kit_files:simpleIndex.files.length,full_kit_files:fullIndex.files.length,
 report_hash:report.deterministic_hash,
 source_bundle_sha256:fullIndex.full_bundle_sha256,
 offline_git_clone_exact_head_verified:true,
 participant_real_first_use:'NOT_TESTED',
 first_user_consent:'NOT_OBTAINED',
 source_class:'CI_SYNTHETIC_PACKAGING_ONLY',
 m4_original_62:'NOT_RUN',
 source_and_signer_identity_not_verified:true,
 public_git_history_full_secret_audit:'NOT_PERFORMED',
 private_external_distribution:'REQUIRES_OWNER_REVIEW',
 current_tree_known_public_examples_pinned:true,
 no_main_merge_no_release:true
};
fs.writeFileSync(path.join(receiptDir,'M5_BUILD_RECEIPT.json'),json(receipt),{flag:'wx'});
console.log('M5_P1_KIT_BUILD_RECEIPT '+JSON.stringify(receipt));
