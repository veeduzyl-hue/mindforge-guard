// MindForge Guard Architecture v0.2.x — synthetic First Report human-visible walk-through.
// Demonstrates PREPARE -> local mapping choices -> BUILD -> native VALIDATE
// -> native REPORT -> HTML -> demo delivery folder. NEVER a production M3 Pack Builder.
// Only the fixed repository HR synthetic fixture can be copied/processed.
// No network, customer data, signature, I1 privileged Bundle Writer or public CLI extension.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const REPO=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const SAMPLE=path.join(REPO,'examples/single-agent-governance-pack/hr-self-service-agent');
const REVIEW=path.join(REPO,'scripts/arch_v02x_m3_review_confirm_synthetic.mjs');
const GUARD=path.join(REPO,'packages/guard/bin/guard.mjs');
const WORK_MARKER='.ARCH_V02X_FIRST_REPORT_DEMO_SYNTHETIC_ONLY';
const INVENTORY_MARKER='.ARCH_V02X_M3_INVENTORY_SYNTHETIC_ONLY';
const WORK_MARKER_VALUE='ARCH_V02X_FIRST_REPORT_SYNTHETIC_WORKSPACE_V0_1\n';
const INVENTORY_MARKER_VALUE='ARCH_V02X_SOURCE_INVENTORY_SYNTHETIC_ONLY\n';
const INPUT_NAME='synthetic-input-pack';
const OUTPUT_NAME='delivery';
const DECISION='mapping-decisions.synthetic.json';
const ACK='SYNTHETIC_MAPPING_REVIEW_ONLY_NOT_IDENTITY_OR_AUTHORITY';
const ROOT_FILES=[
 'README.md','action-boundary.yaml','agent-profile.json','data-sources.yaml',
 'manifest.json','review-standards.md','snapshot.json','task-scope.md','tools.yaml'
];
const EVIDENCE_FILES=['run-record.json','sample-output.json'];
const ALL_SOURCE_FILES=[
 ...ROOT_FILES,...EVIDENCE_FILES.map(x=>'evidence/'+x)
];
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const json=o=>JSON.stringify(o,null,2)+'\n';
const onlyKeys=(obj,keys)=>obj&&typeof obj==='object'&&!Array.isArray(obj)&&
 Object.keys(obj).length===keys.length&&Object.keys(obj).every(x=>keys.includes(x));
const location=()=>{
  const res=spawnSync('git',['rev-parse','HEAD'],{
    cwd:REPO,encoding:'utf8',windowsHide:true,timeout:12000
  });
  if(res.error||res.status!==0||!/^[a-f0-9]{40}$/.test(res.stdout.trim()))
    fail('SOURCE_HEAD_UNAVAILABLE');
  return res.stdout.trim();
};
class Refusal extends Error {constructor(code){super(code);this.name='Refusal';}}
function fail(code){throw new Refusal(code);}
function parse(argv){
 if(argv.length===1&&['--help','-h'].includes(argv[0]))return {help:true};
 const a={mode:null,workspace:null};
 for(let i=0;i<argv.length;i++){
  const k=argv[i];
  if(!['--mode','--workspace'].includes(k))fail('UNSUPPORTED_OPTION');
  const val=argv[++i];
  if(!val||val.startsWith('--'))fail('OPTION_VALUE_REQUIRED');
  const dest=k.slice(2);
  if(a[dest]!==null)fail('DUPLICATE_OPTION');
  a[dest]=val;
 }
 if(!['prepare','complete','status'].includes(a.mode)||!a.workspace)
   fail('MODE_AND_WORKSPACE_REQUIRED');
 if(!path.isAbsolute(a.workspace))fail('ABSOLUTE_WORKSPACE_REQUIRED');
 return a;
}
function isOwnWorkspace(workspace){
 const temp=fs.realpathSync(os.tmpdir());
 const parent=fs.realpathSync(path.dirname(workspace));
 if(parent!==temp||!path.basename(workspace).startsWith('guard-v02x-synthetic-')||
    !/^guard-v02x-synthetic-[a-zA-Z0-9_-]{8,60}$/.test(path.basename(workspace)))
   fail('ONLY_FRESH_DIRECT_CHILD_OF_SYSTEM_TEMP_ALLOWED');
 const stat=fs.lstatSync(parent);
 if(!stat.isDirectory()||stat.isSymbolicLink())fail('TEMP_PARENT_UNSAFE');
 return workspace;
}
function verifyMarker(workspace){
 isOwnWorkspace(workspace);
 const st=fs.lstatSync(workspace);
 if(!st.isDirectory()||st.isSymbolicLink()||fs.realpathSync(workspace)!==workspace)
   fail('UNSAFE_WORKSPACE_ROOT');
 for(const [name,expected] of [
   [WORK_MARKER,WORK_MARKER_VALUE],[INVENTORY_MARKER,INVENTORY_MARKER_VALUE]
 ]){
   const p=path.join(workspace,name);
   const x=fs.lstatSync(p);
   if(!x.isFile()||x.isSymbolicLink()||fs.readFileSync(p,'utf8')!==expected)
     fail('SYNTHETIC_WORKSPACE_MARKER_INVALID');
 }
}
function assertPlainDir(p) {
 const st=fs.lstatSync(p);
 if(!st.isDirectory()||st.isSymbolicLink())fail('SOURCE_DIRECTORY_UNSAFE');
}
function assertPlainFile(p) {
 const st=fs.lstatSync(p);
 if(!st.isFile()||st.isSymbolicLink()||st.size>4*1024*1024)
   fail('SOURCE_FILE_UNSAFE_OR_TOO_LARGE');
 return st;
}
function copyFrozenFixture(source,out) {
 assertPlainDir(source);
 assertPlainDir(path.join(source,'evidence'));
 fs.mkdirSync(out,{recursive:false,mode:0o700});
 fs.mkdirSync(path.join(out,'evidence'),{mode:0o700});
 const sourceIndex={};
 for(const relative of ALL_SOURCE_FILES){
   const a=path.join(source,...relative.split('/'));
   const b=path.join(out,...relative.split('/'));
   const first=assertPlainFile(a);
   const bytes=fs.readFileSync(a);
   const second=assertPlainFile(a);
   if(first.size!==second.size||first.mtimeMs!==second.mtimeMs||
      first.size!==bytes.length)fail('SYNTHETIC_TEMPLATE_CHANGED_DURING_COPY');
   fs.writeFileSync(b,bytes,{flag:'wx',mode:0o600});
   if(sha(fs.readFileSync(b))!==sha(bytes))fail('COPIED_SYNTHETIC_FILE_HASH_MISMATCH');
   sourceIndex[relative]='sha256:'+sha(bytes);
 }
 return sourceIndex;
}
function snapshotFrozenFixture(dir,expected) {
 assertPlainDir(dir);
 assertPlainDir(path.join(dir,'evidence'));
 // Do not silently ingest supplementary files, dotfiles, subdirectories,
 // external mounts or symlinks in this entirely fixed teaching fixture.
 const top=fs.readdirSync(dir).sort();
 if(JSON.stringify(top)!==JSON.stringify([...ROOT_FILES,'evidence'].sort()))
   fail('SYNTHETIC_SOURCE_FILE_SET_CHANGED');
 const nested=fs.readdirSync(path.join(dir,'evidence')).sort();
 if(JSON.stringify(nested)!==JSON.stringify([...EVIDENCE_FILES].sort()))
   fail('SYNTHETIC_EVIDENCE_FILE_SET_CHANGED');
 const got={};
 for(const relative of ALL_SOURCE_FILES){
   const p=path.join(dir,...relative.split('/'));
   assertPlainFile(p);
   got[relative]='sha256:'+sha(fs.readFileSync(p));
   if(expected&&got[relative]!==expected[relative])
     fail('SOURCE_CHANGED_SINCE_PREPARE');
 }
 return got;
}
function invoke(script,args,workspace){
 const env={...process.env,
   ARCH_V02X_M3_INVENTORY_SYNTHETIC_ONLY:'1',
   ARCH_V02X_M3_DISCOVER_SYNTHETIC_ONLY:'1',
   ARCH_V02X_M3_REVIEW_SYNTHETIC_ONLY:'1',
   ARCH_V02X_M3_INVENTORY_FIXTURE_ROOT:workspace
 };
 const r=spawnSync(process.execPath,[script,...args],{
   cwd:REPO,env,encoding:'utf8',timeout:45000,
   maxBuffer:12*1024*1024,windowsHide:true
 });
 if(r.error||r.signal!==null)fail('CHILD_EXECUTION_ERROR');
 return r;
}
function m3args(mode,workspace){
 const a=['--mode',mode,'--source',path.join(workspace,INPUT_NAME),
   '--target-contract','first-report-pack','--format','json'];
 if(mode==='confirm')a.push('--confirmation-file',path.join(workspace,DECISION));
 return a;
}
function strictJSON(r,code){
 if(r.status!==0)fail(code);
 try{return JSON.parse(r.stdout)}catch{fail('CHILD_JSON_INVALID');}
}
function safeWrite(p,s){fs.writeFileSync(p,s,{flag:'wx',mode:0o600,encoding:'utf8'});}
function prepare(workspace) {
 isOwnWorkspace(workspace);
 if(fs.existsSync(workspace))fail('WORKSPACE_ALREADY_EXISTS_NO_OVERWRITE');
 if(!fs.existsSync(SAMPLE)||!fs.existsSync(REVIEW)||!fs.existsSync(GUARD))
   fail('FIXED_LOCAL_REPOSITORY_DEPENDENCY_MISSING');
 fs.mkdirSync(workspace,{mode:0o700});
 safeWrite(path.join(workspace,WORK_MARKER),WORK_MARKER_VALUE);
 safeWrite(path.join(workspace,INVENTORY_MARKER),INVENTORY_MARKER_VALUE);
 const sourceIndex=copyFrozenFixture(SAMPLE,path.join(workspace,INPUT_NAME));
 const review=strictJSON(invoke(REVIEW,m3args('review',workspace),workspace),
   'M3_REVIEW_DID_NOT_COMPLETE');
 if(review.kind!=='ARCH_V02X_M3_SYNTHETIC_MAPPING_REVIEW'||
    review.status!=='REVIEW_REQUIRED_UNCONFIRMED'||
    review.counts.confirmed!==0||review.mappings.length!==8||
    !/^sha256:[a-f0-9]{64}$/.test(review.draft_fingerprint_sha256))
   fail('M3_REVIEW_BOUNDARY_CHANGED');
 safeWrite(path.join(workspace,'source-hashes.synthetic.json'),json({
   kind:'arch_v02x_first_report_source_hashes_synthetic',
   source_head:location(),source_files:sourceIndex
 }));
 safeWrite(path.join(workspace,'mapping-review.synthetic.json'),json(review));
 const decisions=review.mappings.map(m=>({
   mapping_item_id:m.mapping_item_id,decision:'defer',
   basis:'not_confirmed',notes:['synthetic_value_not_validated']
 }));
 safeWrite(path.join(workspace,DECISION),json({
   kind:'mindforge_mapping_confirmation_request_synthetic',version:'0.1',
   draft_fingerprint_sha256:review.draft_fingerprint_sha256,
   source_digest_set_sha256:review.source_digest_set_sha256,
   reviewer_label:'synthetic_reviewer',reviewer_role:'review_owner',
   synthetic_acknowledgement:ACK,decisions
 }));
 safeWrite(path.join(workspace,'START_HERE.txt'),[
   'MindForge Guard v0.2.x — SYNTHETIC FIRST REPORT USER WALKTHROUGH',
   'No customer inputs. No real identity/authorization validation.',
   '1. Open mapping-review.synthetic.json to inspect all 8 source/target locators.',
   '2. Inspect the fixed synthetic-input-pack files (ONLY synthetic HR example).',
   '3. Open mapping-decisions.synthetic.json. All eight choices are initially defer.',
   '4. Explicitly change each decision to confirm and basis to source_reviewed',
   '   ONLY after inspecting that synthetic source mapping. No automated approval.',
   '5. Run the SAME command with --mode complete and identical --workspace.',
   '6. Open delivery/report.html and delivery/DELIVERY-READ-ME.txt if complete succeeds.',
   'No actual human identity was witnessed by the script. Synthetic choices are not',
   'business authorization or a sign-off; all hard fields remain unverified.',
   'Never use this workflow for customer data, production Evidence or secrets.',
   'No secure Windows Native Addon or public M3 Source route is required or claimed.'
 ].join('\n')+'\n');
 return {status:'SYNTHETIC_PREPARED',source_head:location(),
   workspace,review_items:review.mappings.length,
   review_file:'mapping-review.synthetic.json',
   editable_decisions:'mapping-decisions.synthetic.json',
   next_step:'INSPECT_SYNTHETIC_VALUES_AND_EXPLICITLY_CONFIRM_OR_DEFER',
   delivery:'NOT_BUILT',source_data_class:'FIXED_SYNTHETIC_ONLY',
   real_user_identity:'NOT_ESTABLISHED',product_admission:'HOLD'};
}
function confirmAndBind(workspace,sourceHashes) {
 const reviewFile=path.join(workspace,'mapping-review.synthetic.json');
 assertPlainFile(reviewFile);
 const frozenReview=JSON.parse(fs.readFileSync(reviewFile,'utf8'));
 if(frozenReview.kind!=='ARCH_V02X_M3_SYNTHETIC_MAPPING_REVIEW')
   fail('PREPARED_REVIEW_MANIFEST_INVALID');
 const liveReview=strictJSON(invoke(REVIEW,m3args('review',workspace),workspace),
   'LIVE_REVIEW_FAILED');
 if(liveReview.draft_fingerprint_sha256!==frozenReview.draft_fingerprint_sha256||
    liveReview.source_digest_set_sha256!==frozenReview.source_digest_set_sha256)
   fail('PREPARED_REVIEW_STALE_OR_SOURCE_CHANGED');
 const confirmation=strictJSON(invoke(REVIEW,m3args('confirm',workspace),workspace),
   'M3_CONFIRMATION_FAIL_CLOSED');
 if(confirmation.kind!=='mindforge_mapping_confirmation'||
    confirmation.identity_assurance!=='not_verified'||
    confirmation.organizational_authority!=='not_established'||
    confirmation.counts.total!==8||confirmation.counts.confirm!==8||
    confirmation.counts.reject!==0||confirmation.counts.defer!==0||
    confirmation.counts.unreviewed!==0||
    confirmation.counts.hard_confirmation_fields_satisfied!==0||
    confirmation.record_class!=='SYNTHETIC_FIXTURE_DECISIONS_NOT_REAL_HUMAN_WITNESS')
   fail('MAPPING_DECISIONS_INCOMPLETE_OR_NOT_CONFIRMABLE');
 // Value binding exists ONLY for the fixed, formerly copied HR sample.
 // It compares direct JSON/YAML values against the matching target and source
 // digest. No real-world inference, arbitrary mapping or authority claim.
 const source=path.join(workspace,INPUT_NAME);
 const jsonFiles={
   'manifest.json':JSON.parse(fs.readFileSync(path.join(source,'manifest.json'),'utf8')),
   'agent-profile.json':JSON.parse(fs.readFileSync(path.join(source,'agent-profile.json'),'utf8'))
 };
 const top=fs.readdirSync(source,{withFileTypes:true}).filter(e=>e.isFile())
   .map(e=>e.name).sort();
 const targetAllow=new Map([
   ['manifest.json#/pack_id','manifest.json'],
   ['manifest.json#/pack_version','manifest.json'],
   ['manifest.json#/report_target','manifest.json'],
   ['agent-profile.json#/agent_id','agent-profile.json'],
   ['agent-profile.json#/agent_name','agent-profile.json'],
   ['agent-profile.json#/agent_type','agent-profile.json'],
   ['tools.yaml#/tools/0/tool_name','tools.yaml'],
   ['tools.yaml#/tools/1/tool_name','tools.yaml']
 ]);
 const confirmed=new Set(confirmation.confirmations.map(x=>x.mapping_item_id));
 const observed=new Set();
 const toolLines=fs.readFileSync(path.join(source,'tools.yaml'),'utf8').split(/\r?\n/);
 for(const m of liveReview.mappings){
   const rel=targetAllow.get(m.target_locator);
   if(!rel||observed.has(m.target_locator)||!confirmed.has(m.mapping_item_id))
     fail('FIXED_SYNTHETIC_TARGET_BINDING_NOT_APPROVED');
   observed.add(m.target_locator);
   if(!top.includes(rel))fail('BOUND_TARGET_FILE_NOT_FOUND');
   if(m.source_sha256!==sourceHashes[rel])fail('BOUND_MAPPING_SOURCE_SHA_MISMATCH');
   const loc=m.source_locator;
   if(rel.endsWith('.json')){
     const key=m.target_locator.split('#/')[1];
     if(loc.json_pointer!=='/'+key||typeof jsonFiles[rel][key]!=='string'||
        jsonFiles[rel][key].length<1)fail('BOUND_JSON_VALUE_SOURCE_OR_TARGET_MISMATCH');
   }else{
     if(loc.json_pointer!==null||!Number.isInteger(loc.line_start)||loc.line_start<1||
        loc.line_start>toolLines.length)fail('BOUND_YAML_LOCATOR_INVALID');
     if(!/^\s*tool_name:\s+\S/.test(toolLines[loc.line_start-1]))
       fail('BOUND_YAML_TOOL_NAME_LINE_CHANGED');
   }
 }
 if(observed.size!==8)fail('NOT_ALL_FIXED_BINDINGS_CONFIRMED');
 return {review:frozenReview,confirmation,sourceHashes};
}
function cleanHostPaths(obj,workspace) {
 // The fixed local Guard validator emits pack_path; keep only the synthetic
 // basename in demo delivery. Refuse other absolute paths in serialized output.
 const copy=structuredClone(obj);
 if(Object.hasOwn(copy,'pack_path'))copy.pack_path='synthetic-first-report-pack';
 if(JSON.stringify(copy).includes(workspace))fail('ABSOLUTE_SYNTHETIC_HOST_PATH_LEAK');
 return copy;
}
function validateAndRender(staging,workspace) {
 const built=path.join(staging,'synthetic-first-report-pack');
 function guard(args,code) {
   const r=spawnSync(process.execPath,[GUARD,...args],{
     cwd:REPO,encoding:'utf8',windowsHide:true,
     timeout:60000,maxBuffer:12*1024*1024,
     env:{...process.env,
       I1_REAL_WIN_ACL_INTEGRATION_EXPERIMENT:'0',
       I1_REAL_WIN_ACL_SYNTHETIC_ONLY:'0',
       I1_REAL_WIN_ACL_MODULE_PATH:'',
       I1_REAL_WIN_ACL_MODULE_SHA256:''}
   });
   if(r.error||r.status!==0)fail(code);
   return r.stdout;
 }
 const validation=cleanHostPaths(JSON.parse(guard([
   'pack','validate','--pack',built,'--preview','--json'
 ],'NATIVE_PACK_VALIDATION_FAILED')),workspace);
 if(validation.validation_status!=='valid_with_no_omissions'||!validation.deterministic_pack_hash)
   fail('PACK_NOT_VALID_WITH_NO_OMISSIONS');
 const report=cleanHostPaths(JSON.parse(guard([
   'report','single-agent','--pack',built,'--preview','--json'
 ],'NATIVE_SINGLE_AGENT_REPORT_FAILED')),workspace);
 if(report.review_posture!=='ready_for_review'||
    report.deterministic_hash!==validation.deterministic_pack_hash||
    report.recommendation_only===false)fail('REPORT_POSTURE_HASH_OR_AUTHORITY_INVALID');
 safeWrite(path.join(staging,'pack-validation.json'),json(validation));
 safeWrite(path.join(staging,'single-agent-report.json'),json(report));
 const html=path.join(staging,'report.html');
 guard(['report','render','--input',path.join(staging,'single-agent-report.json'),
   '--out',html,'--format','html'],'ROLE_BASED_HTML_RENDER_FAILED');
 assertPlainFile(html);
 if(fs.statSync(html).size>2*1024*1024)fail('HTML_REPORT_SIZE_LIMIT');
 return {validation,report};
}
function packagePreview(staging,workspace,confirmed,sourceIndex) {
 const {validation,report}=validateAndRender(staging,workspace);
 const items=['synthetic-first-report-pack/'+ALL_SOURCE_FILES[0]];
 // No self-referential checksum of index, and a fixed allowlist only.
 const files=['pack-validation.json','single-agent-report.json','report.html',
   'synthetic-mapping-review.json','synthetic-confirmation.json','DELIVERY-READ-ME.txt',
   ...ALL_SOURCE_FILES.map(x=>'synthetic-first-report-pack/'+x)].sort();
 const integrity=files.map(rel=>{
   const p=path.join(staging,...rel.split('/'));
   assertPlainFile(p);
   const b=fs.readFileSync(p);
   return {relative_path:rel,byte_length:b.length,sha256:sha(b)};
 });
 const manifest={
   kind:'arch_v02x_synthetic_first_report_demo_envelope',
   version:'0.1',scope:'FIXED_COMMITTED_HR_SYNTHETIC_SAMPLE_ONLY',
   status:'DEMO_READY_FOR_HUMAN_USABILITY_REVIEW_NOT_PRODUCT_ADMITTED',
   delivery_type:'SYNTHETIC_DEMO_NOT_I1_SECURE_REVIEW_BUNDLE',
   canonical_pack_type:'SYNTHETIC_COPY_OF_EXISTING_FIRST_REPORT_EXAMPLE',
   source_head:location(),
   source_file_count:ALL_SOURCE_FILES.length,
   mapping_count:confirmed.confirmation.confirmations.length,
   mapping_hard_fields_confirmed:0,
   identity_assurance:'not_verified',
   organizational_authority:'not_established',
   human_first_user_witnessed:false,
   signed_native_addon:'NOT_USED',
   native_pack_validation_status:validation.validation_status,
   native_report_review_posture:report.review_posture,
   deterministic_pack_hash:validation.deterministic_pack_hash,
   external_review:'NOT_ESTABLISHED',
   no_network_upload:true,no_execution_authority:true,
   no_real_customer_input:true,
   no_release_or_main_merge:true,
   security_limit:'WINDOWS_OUTPUT_ACL_NOT_VERIFIED_FOR_REAL_DATA',
   source_index_digest:'sha256:'+sha(Buffer.from(json(sourceIndex)))
 };
 safeWrite(path.join(staging,'demo-delivery-manifest.json'),json(manifest));
 safeWrite(path.join(staging,'demo-checksums.json'),json({
   kind:'arch_v02x_synthetic_demo_checksum_index',
   self_digest_excluded:true,files:integrity
 }));
 return manifest;
}
function complete(workspace) {
 verifyMarker(workspace);
 const idx=path.join(workspace,'source-hashes.synthetic.json');
 assertPlainFile(idx);
 const prepared=JSON.parse(fs.readFileSync(idx,'utf8'));
 if(prepared.kind!=='arch_v02x_first_report_source_hashes_synthetic'||
    prepared.source_head!==location()||
    !prepared.source_files||
    JSON.stringify(Object.keys(prepared.source_files).sort())!==
      JSON.stringify([...ALL_SOURCE_FILES].sort()))
    fail('PREPARED_SOURCE_IDENTITY_OR_WORKTREE_CHANGED');
 const source=path.join(workspace,INPUT_NAME);
 snapshotFrozenFixture(source,prepared.source_files);
 if(fs.existsSync(path.join(workspace,OUTPUT_NAME)))fail('DELIVERY_ALREADY_EXISTS_NO_OVERWRITE');
 const confirmed=confirmAndBind(workspace,prepared.source_files);
 // Build only a copied fixed synthetic template, NOT a general-purpose
 // reconstruction of unverified business facts. All 11 files remain synthetic.
 const staging=path.join(workspace,'.partial-synthetic-delivery-'+crypto.randomUUID());
 fs.mkdirSync(staging,{mode:0o700});
 const outputPack=path.join(staging,'synthetic-first-report-pack');
 const outputIndex=copyFrozenFixture(source,outputPack);
 if(JSON.stringify(outputIndex)!==JSON.stringify(prepared.source_files))
   fail('SOURCE_BYTES_CHANGED_BETWEEN_CONFIRM_AND_BUILD');
 safeWrite(path.join(staging,'synthetic-mapping-review.json'),json(confirmed.review));
 safeWrite(path.join(staging,'synthetic-confirmation.json'),json(confirmed.confirmation));
 safeWrite(path.join(staging,'DELIVERY-READ-ME.txt'),[
   'MindForge Guard SYNTHETIC First Report demonstration — NOT a product Bundle',
   'Open report.html for the HTML First Report; pack-validation.json and',
   'single-agent-report.json retain native Preview statuses and deterministic hash.',
   'synthetic-first-report-pack is only a fixed teaching Pack copy.',
   'M3 confirmation is a synthetic choice record, not human identity or approval.',
   'Owners, policy, authority, sensitivity and real-world values were NOT confirmed.',
   'Inspect all derived narratives/identifiers before sharing. DO NOT input real data.',
   'This directory does not use I1 trusted NTFS Native Addon, signed installation,',
   'independent receipt custody, a security-approved Bundle Writer or an audited',
   'production lifecycle. Do not upload it to a customer or call it Assurance.',
   'All M4 original 62 tests and M5 real first-user remain NOT RUN / NOT TESTED.',
   'No automatic deletion. Treat this folder as a candidate for usability review.'
 ].join('\n')+'\n');
 snapshotFrozenFixture(source,prepared.source_files);
 const manifest=packagePreview(staging,workspace,confirmed,prepared.source_files);
 if(fs.existsSync(path.join(workspace,OUTPUT_NAME)))fail('OUTPUT_CREATED_DURING_SYNTHETIC_STAGE');
 fs.renameSync(staging,path.join(workspace,OUTPUT_NAME));
 return {status:'SYNTHETIC_DEMO_DELIVERY_CREATED',workspace,
   delivery_dir:path.join(workspace,OUTPUT_NAME),report_html:'delivery/report.html',
   validation:'valid_with_no_omissions',
   report_posture:'ready_for_review',
   deterministic_pack_hash:manifest.deterministic_pack_hash,
   mapping_decisions:8,hard_business_field_confirmation:'NOT_ESTABLISHED',
   actual_user_identity:'NOT_ESTABLISHED',
   product_bundle:'NOT_ADMITTED',m4_62:'NOT_RUN',m5_human:'NOT_TESTED',
   no_native_addon_loaded:true};
}
function status(workspace) {
 verifyMarker(workspace);
 const prepared=fs.existsSync(path.join(workspace,'mapping-review.synthetic.json'));
 const completed=fs.existsSync(path.join(workspace,OUTPUT_NAME,'demo-delivery-manifest.json'));
 return {status:completed?'SYNTHETIC_DEMO_DELIVERY_PRESENT':
   prepared?'SYNTHETIC_REVIEW_PREPARED':'SYNTHETIC_INCOMPLETE',
   workspace,has_mapping_review:prepared,has_delivery:completed,
   product_admission:'HOLD',signed_addon:'DEFERRED',
   real_user_first_report:'NOT_TESTED'};
}
try {
 const args=parse(process.argv.slice(2));
 if(args.help){
   process.stdout.write('Synthetic First Report walk-through: --mode prepare|complete|status --workspace <ABSOLUTE_NEW_SYSTEM_TEMP_CHILD_named_guard-v02x-synthetic-...>. Explicit env ARCH_V02X_FIRST_REPORT_DEMO_SYNTHETIC_ONLY=1 required. No customer data.\n');
 }else {
   if(process.env.ARCH_V02X_FIRST_REPORT_DEMO_SYNTHETIC_ONLY!=='1')
     fail('SYNTHETIC_DEMO_EXPLICIT_OPT_IN_REQUIRED');
   const ws=isOwnWorkspace(path.resolve(args.workspace));
   const result=args.mode==='prepare'?prepare(ws):
     args.mode==='complete'?complete(ws):status(ws);
   process.stdout.write(json(result));
 }
}catch(e){
 const reason=e instanceof Refusal?e.message:'SYNTHETIC_DEMO_IO_OR_RUNTIME_ERROR';
 process.stdout.write(json({status:'BLOCKED',reason,
   no_customer_data:true,
   partial_synthetic_workspace_may_need_manual_review:true,
   no_automatic_cleanup:true,no_authority_expansion:true}));
 process.exitCode=24;
}
