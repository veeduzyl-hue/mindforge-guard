// ARCH v0.2.x M3 — REVIEW -> CONFIRM v0.1, synthetic-only candidate.
// This script never creates a real human/organizational approval or Evidence Pack.
// Source values, original file paths, reviewer PII and decision notes are not exported.
// It uses the fixed PR #375 Discover/Draft source after that stage rechecks Inventory.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const SCRIPTS_DIR=path.dirname(fileURLToPath(import.meta.url));
const DISCOVER=path.join(SCRIPTS_DIR,'arch_v02x_m3_discover_draft_synthetic.mjs');
const EXPECTED_MARKER='.ARCH_V02X_M3_INVENTORY_SYNTHETIC_ONLY';
const MARKER_CONTENT='ARCH_V02X_SOURCE_INVENTORY_SYNTHETIC_ONLY\n';
const DECISION_BASENAME='mapping-decisions.synthetic.json';
const ACKNOWLEDGEMENT='SYNTHETIC_MAPPING_REVIEW_ONLY_NOT_IDENTITY_OR_AUTHORITY';
const ROLES=new Set(['workflow_owner','technical_owner','review_owner','other']);
const DECISIONS=new Set(['confirm','reject','defer']);
const BASES=new Set(['source_reviewed','owner_declared','not_confirmed']);
const NOTE_CODES=new Set([
 'synthetic_checked_structure','synthetic_value_not_validated','synthetic_conflict_unresolved'
]);
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
class BoundedRefusal extends Error {constructor(code){super(code);this.name='BoundedRefusal';}}
const refuse=code=>{throw new BoundedRefusal(code);};
const isSha256=s=>typeof s==='string'&&/^sha256:[0-9a-f]{64}$/.test(s);
const plain=o=>o!==null&&typeof o==='object'&&!Array.isArray(o);
function onlyKeys(obj,keys) {
 return plain(obj)&&Object.keys(obj).every(x=>keys.includes(x))&&
   keys.every(x=>Object.hasOwn(obj,x));
}
function isInside(root,subject) {
 const rel=path.relative(root,subject);
 return rel.length>0&&rel!=='..'&&!rel.startsWith('..'+path.sep)&&
   !path.isAbsolute(rel);
}
function parseArgs(argv) {
 if(argv.length===1&&['--help','-h'].includes(argv[0]))return {help:true};
 const x={mode:null,source:null,contract:null,format:null,confirmationFile:null};
 for(let i=0;i<argv.length;i++){
   const flag=argv[i];
   const field=new Map([
     ['--mode','mode'],['--source','source'],
     ['--target-contract','contract'],['--format','format'],
     ['--confirmation-file','confirmationFile']
   ]).get(flag);
   if(!field)refuse('UNSUPPORTED_OPTION_OR_MODE');
   if(i+1>=argv.length||argv[i+1].startsWith('--'))refuse('MISSING_OPTION_VALUE');
   if(x[field]!==null)refuse('DUPLICATE_SINGLETON_OPTION');
   x[field]=argv[++i];
 }
 if(!x.mode||!x.source||!x.contract||!x.format){
   refuse('EXPLICIT_MODE_SOURCE_TARGET_FORMAT_REQUIRED');
 }
 if(!['review','confirm'].includes(x.mode)||x.contract!=='first-report-pack'||
   !['json','text'].includes(x.format))refuse('UNSUPPORTED_REVIEW_MODE_OR_TARGET');
 if(!path.isAbsolute(x.source))refuse('ABSOLUTE_SOURCE_PATH_REQUIRED');
 if(x.mode==='review'&&x.confirmationFile!==null){
   refuse('REVIEW_MODE_MUST_NOT_LOAD_CONFIRMATION');
 }
 if(x.mode==='confirm'&&x.format!=='json')refuse('CONFIRM_MODE_JSON_ONLY');
 if(x.mode==='confirm'&&!x.confirmationFile)refuse('EXPLICIT_CONFIRMATION_FILE_REQUIRED');
 if(x.confirmationFile!==null&&!path.isAbsolute(x.confirmationFile)){
   refuse('ABSOLUTE_CONFIRMATION_FILE_REQUIRED');
 }
 return x;
}
function syntheticEnvironment() {
 if(process.env.ARCH_V02X_M3_INVENTORY_SYNTHETIC_ONLY!=='1'||
    process.env.ARCH_V02X_M3_DISCOVER_SYNTHETIC_ONLY!=='1'||
    process.env.ARCH_V02X_M3_REVIEW_SYNTHETIC_ONLY!=='1'){
   refuse('ALL_THREE_EXPLICIT_SYNTHETIC_GATES_REQUIRED');
 }
 const root=process.env.ARCH_V02X_M3_INVENTORY_FIXTURE_ROOT;
 if(!root||!path.isAbsolute(root))refuse('EXPLICIT_FIXTURE_ROOT_REQUIRED');
 const rootStat=fs.lstatSync(root);
 if(!rootStat.isDirectory()||rootStat.isSymbolicLink()){
   refuse('UNSAFE_SYNTHETIC_FIXTURE_ROOT');
 }
 const canonical=fs.realpathSync(root);
 const marker=path.join(canonical,EXPECTED_MARKER);
 const markerStat=fs.lstatSync(marker);
 if(!markerStat.isFile()||markerStat.isSymbolicLink()||
   fs.readFileSync(marker,'utf8')!==MARKER_CONTENT){
   refuse('OWNED_SYNTHETIC_FIXTURE_MARKER_REQUIRED');
 }
 return canonical;
}
function runDiscovery(args) {
 const run=spawnSync(process.execPath,[DISCOVER,
   '--source',args.source,'--target-contract',args.contract,'--format','json'],{
   cwd:SCRIPTS_DIR,env:process.env,encoding:'utf8',timeout:30000,
   maxBuffer:6*1024*1024
 });
 if(run.error||run.signal!==null||run.status!==0){
   refuse('DISCOVERY_PREFLIGHT_REFUSED');
 }
 let draft;
 try{draft=JSON.parse(run.stdout);}catch{refuse('DISCOVERY_RESULT_MALFORMED');}
 if(!plain(draft)||draft.kind!=='mindforge_mapping_draft'||draft.version!=='0.1'||
    draft.status!=='DRAFT_UNCONFIRMED'||draft.lifecycle!=='DISCOVER_AND_DRAFT_ONLY'||
    draft.confirmation_record!=='NOT_CREATED'||draft.identity_assurance!=='not_verified'||
    draft.organizational_authority!=='not_established'||
    draft.no_raw_values_exported!==true||draft.no_source_copy_written!==true||
    draft.no_canonical_pack_generated!==true||draft.no_review_bundle_generated!==true||
    draft.no_tool_execution!==true||draft.no_network_access!==true||
    draft.target_contract?.id!=='first-report-pack'||
    draft.target_contract?.version!=='single_agent_governance_pack_preview_v1'||
    !isSha256(draft.source_inventory_ref?.source_digest_set_sha256)||
    !Array.isArray(draft.observations)||draft.observations.length>128||
    !Array.isArray(draft.mappings)||draft.mappings.length<1||draft.mappings.length>32||
    !Array.isArray(draft.hard_confirmation_required)||
    draft.counts?.confirmed!==0)refuse('DISCOVERY_CONTRACT_NOT_UNCONFIRMED');
 const ids=new Set();
 for(const m of draft.mappings){
   if(!plain(m)||typeof m.mapping_item_id!=='string'||
      !/^mapitem_[0-9]{3}$/.test(m.mapping_item_id)||ids.has(m.mapping_item_id)||
      !isSha256(m.source_sha256)||
      !['suggested','ambiguous'].includes(m.mapping_status)||
      m.requires_human_confirmation!==true||m.value_exported!==false||
      !plain(m.source_locator)||typeof m.target_locator!=='string'||
      !/^(?:manifest\.json#\/(?:pack_id|pack_version|report_target)|agent-profile\.json#\/(?:agent_id|agent_name|agent_type)|tools\.yaml#\/tools\/[0-7]\/tool_name)$/.test(m.target_locator)){
     refuse('DISCOVERY_MAPPING_INVARIANTS_INVALID');
   }
   ids.add(m.mapping_item_id);
 }
 return draft;
}
function canonicalFingerprint(draft) {
 // Random inventory_id/mapping_id/discovered_at are excluded from binding.
 // Exact ordered locators, source digest set, metadata and human-required fields
 // are included. A changed synthetic source must change this fingerprint.
 const canonical={
   target_contract:draft.target_contract,
   source_digest_set_sha256:draft.source_inventory_ref.source_digest_set_sha256,
   observations:draft.observations,
   mappings:draft.mappings,
   hard_confirmation_required:draft.hard_confirmation_required
 };
 return 'sha256:'+sha(Buffer.from(JSON.stringify(canonical),'utf8'));
}
function reviewRecord(draft,fingerprint) {
 const mappings=draft.mappings.map(m=>({
   mapping_item_id:m.mapping_item_id,source_id:m.source_id,
   source_sha256:m.source_sha256,source_locator:m.source_locator,
   target_locator:m.target_locator,semantic_class:m.semantic_class,
   field_state:m.field_state,mapping_status:m.mapping_status,
   loss_notes:m.loss_notes,requires_human_confirmation:true,
   value_exported:false
 }));
 return {
   kind:'ARCH_V02X_M3_SYNTHETIC_MAPPING_REVIEW',version:'0.1',
   status:'REVIEW_REQUIRED_UNCONFIRMED',
   scope:'EXPLICIT_SYNTHETIC_SOURCES_ONLY',
   draft_fingerprint_sha256:fingerprint,
   source_digest_set_sha256:draft.source_inventory_ref.source_digest_set_sha256,
   target_contract:draft.target_contract,
   mappings,
   observations:draft.observations,
   counts:{candidates:mappings.length,
     suggested:mappings.filter(m=>m.mapping_status==='suggested').length,
     ambiguous:mappings.filter(m=>m.mapping_status==='ambiguous').length,
     confirmed:0},
   hard_confirmation_required:draft.hard_confirmation_required,
   confirmation_request:{
     kind:'mindforge_mapping_confirmation_request_synthetic',version:'0.1',
     required_decision_per_mapping:true,
     accepted_decisions:['confirm','reject','defer'],
     only_synthetic_reviewer_label:'synthetic_reviewer',
     no_automatic_ambiguous_confirmation:true,
     identity_assurance:'not_verified',organizational_authority:'not_established'
   },
   no_raw_values_exported:true,no_source_copy_written:true,
   no_confirmation_record_created:true,
   no_evidence_pack_generated:true,no_review_bundle_generated:true,
   no_execution_authority:true,
   known_limits:['structural_mapping_only','source_locator_is_not_source_authenticity',
     'reviewer_identity_and_role_not_verified','human_presence_not_witnessed',
     'original_source_values_not_exported','synthetic_only',
     'hard_confirmation_fields_not_satisfied','not_a_public_guard_command',
     'no_independent_assurance_or_business_approval']
 };
}
function textView(review) {
 const lines=[
   'MindForge Guard M3 REVIEW — SYNTHETIC ONLY / UNCONFIRMED',
   'Draft fingerprint: '+review.draft_fingerprint_sha256,
   'Source digest set: '+review.source_digest_set_sha256,
   'Candidates: '+review.counts.candidates+
     ' | Suggested: '+review.counts.suggested+
     ' | Ambiguous: '+review.counts.ambiguous,
   'Mapping ID | Source ID | Target | State | Source location'
 ];
 for(const m of review.mappings){
   const loc=m.source_locator.json_pointer||
      ('lines '+String(m.source_locator.line_start)+'-'+String(m.source_locator.line_end));
   lines.push([
     m.mapping_item_id,m.source_id,m.target_locator,m.mapping_status,loc
   ].join(' | '));
 }
 lines.push('ALL BUSINESS OWNER / POLICY / PERMISSIONS / INTENT / SENSITIVITY REQUIRE SEPARATE HUMAN REVIEW.');
 lines.push('No original source values shown. A synthetic confirmation is NOT identity verification, authorization or Assurance.');
 lines.push('A confirmation file must be separately supplied; this review operation writes no file.');
 return lines.join('\n')+'\n';
}
function readPinnedConfirmation(file,root,source) {
 const candidate=path.resolve(file);
 if(!isInside(root,candidate)||path.basename(candidate)!==DECISION_BASENAME){
   refuse('CONFIRMATION_FILE_NOT_IN_MARKED_SYNTHETIC_ROOT');
 }
 const selected=fs.realpathSync(source);
 if(candidate===selected||isInside(selected,candidate)){
   refuse('CONFIRMATION_FILE_MUST_BE_OUTSIDE_SELECTED_SOURCE');
 }
 let cursor=root;
 for(const component of path.relative(root,candidate).split(path.sep)){
   cursor=path.join(cursor,component);
   if(fs.lstatSync(cursor).isSymbolicLink())refuse('CONFIRMATION_PATH_REPARSE_REFUSED');
 }
 const before=fs.lstatSync(candidate,{bigint:true});
 if(!before.isFile()||before.isSymbolicLink())refuse('CONFIRMATION_NOT_PLAIN_FILE');
 if(before.size>BigInt(64*1024))refuse('CONFIRMATION_FILE_TOO_LARGE');
 const fd=fs.openSync(candidate,fs.constants.O_RDONLY|(fs.constants.O_NOFOLLOW||0));
 let bytes;
 try{
   const opened=fs.fstatSync(fd,{bigint:true});
   if(!opened.isFile()||opened.dev!==before.dev||opened.ino!==before.ino||
      opened.size!==before.size||opened.mtimeNs!==before.mtimeNs){
     refuse('CONFIRMATION_CHANGED_BEFORE_READ');
   }
   bytes=fs.readFileSync(fd);
   const after=fs.fstatSync(fd,{bigint:true});
   if(after.dev!==opened.dev||after.ino!==opened.ino||after.size!==opened.size||
      after.mtimeNs!==opened.mtimeNs||after.ctimeNs!==opened.ctimeNs){
     refuse('CONFIRMATION_CHANGED_DURING_READ');
   }
 }finally{fs.closeSync(fd);}
 const end=fs.lstatSync(candidate,{bigint:true});
 if(end.dev!==before.dev||end.ino!==before.ino||end.size!==before.size||
    end.mtimeNs!==before.mtimeNs||fs.realpathSync(candidate)!==candidate){
   refuse('CONFIRMATION_CHANGED_AFTER_READ');
 }
 let request;
 try{
   const decoder=new TextDecoder('utf-8',{fatal:true});
   request=JSON.parse(decoder.decode(bytes));
 }catch{refuse('CONFIRMATION_JSON_INVALID_OR_NON_UTF8');}
 return request;
}
function processConfirmation(request,draft,fingerprint) {
 if(!onlyKeys(request,[
    'kind','version','draft_fingerprint_sha256','source_digest_set_sha256',
    'reviewer_label','reviewer_role','synthetic_acknowledgement','decisions'
  ])||request.kind!=='mindforge_mapping_confirmation_request_synthetic'||
   request.version!=='0.1'||request.synthetic_acknowledgement!==ACKNOWLEDGEMENT||
   request.reviewer_label!=='synthetic_reviewer'||!ROLES.has(request.reviewer_role)||
   !Array.isArray(request.decisions)){
   refuse('INVALID_SYNTHETIC_REVIEW_REQUEST_CONTRACT');
 }
 if(request.draft_fingerprint_sha256!==fingerprint||
    request.source_digest_set_sha256!==draft.source_inventory_ref.source_digest_set_sha256){
   refuse('STALE_DRAFT_OR_SOURCE_DIGEST_REVIEW_REQUIRED');
 }
 if(request.decisions.length!==draft.mappings.length){
   refuse('EXPLICIT_DECISION_REQUIRED_FOR_EVERY_MAPPING');
 }
 const expected=new Map(draft.mappings.map(x=>[x.mapping_item_id,x]));
 const seen=new Set(),ordered=[];
 for(const entry of request.decisions){
   if(!onlyKeys(entry,['mapping_item_id','decision','basis','notes'])||
      typeof entry.mapping_item_id!=='string'||!DECISIONS.has(entry.decision)||
      !BASES.has(entry.basis)||!Array.isArray(entry.notes)||entry.notes.length>3||
      entry.notes.some(x=>!NOTE_CODES.has(x))){
     refuse('UNSUPPORTED_DECISION_OR_UNREVIEWED_NOTES');
   }
   const mapping=expected.get(entry.mapping_item_id);
   if(!mapping)refuse('UNKNOWN_MAPPING_ITEM_ID');
   if(seen.has(entry.mapping_item_id))refuse('DUPLICATE_MAPPING_DECISION');
   seen.add(entry.mapping_item_id);
   if(mapping.mapping_status==='ambiguous'&&entry.decision!=='defer'){
     refuse('AMBIGUOUS_MAPPING_MUST_REMAIN_DEFERRED');
   }
   if(entry.decision==='confirm'&&entry.basis!=='source_reviewed'){
     refuse('CONFIRM_REQUIRES_EXPLICIT_SOURCE_REVIEW_BASIS');
   }
   if(entry.decision==='defer'&&entry.basis!=='not_confirmed'){
     refuse('DEFER_MUST_RETAIN_NOT_CONFIRMED_BASIS');
   }
   ordered.push({
     mapping_item_id:entry.mapping_item_id,decision:entry.decision,
     reviewer_label:request.reviewer_label,reviewer_role:request.reviewer_role,
     basis:entry.basis,notes:entry.notes
   });
 }
 if(seen.size!==expected.size)refuse('EXPLICIT_DECISION_COVERAGE_INCOMPLETE');
 const outcome={
   kind:'mindforge_mapping_confirmation',version:'0.1',
   mapping_id:draft.mapping_id,confirmed_at:new Date().toISOString(),
   review_draft_fingerprint_sha256:fingerprint,
   source_digest_set_sha256:draft.source_inventory_ref.source_digest_set_sha256,
   confirmations:ordered,
   identity_assurance:'not_verified',
   organizational_authority:'not_established',
   record_class:'SYNTHETIC_FIXTURE_DECISIONS_NOT_REAL_HUMAN_WITNESS',
   lifecycle:'REVIEW_CONFIRM_ONLY',
   counts:{total:ordered.length,confirm:ordered.filter(x=>x.decision==='confirm').length,
     reject:ordered.filter(x=>x.decision==='reject').length,
     defer:ordered.filter(x=>x.decision==='defer').length,
     unreviewed:0,hard_confirmation_fields_satisfied:0},
   mapping_workflow_state:'LOCAL_SYNTHETIC_REVIEW_RECORDED_ONLY',
   business_approval:'NOT_ESTABLISHED',
   verified_actor_identity:'NOT_ESTABLISHED',
   hard_confirmation_required:draft.hard_confirmation_required,
   hard_confirmation_fields:'NOT_CONFIRMED',
   source_values:'NOT_EXPORTED',
   canonical_pack:'NOT_GENERATED',
   review_bundle:'NOT_GENERATED',
   no_source_copy_written:true,no_network_access:true,
   no_execution_authority:true,no_independent_assurance:true,
   limitations:['all_user_choices_are_synthetic_fixture_claims',
     'no_actual_human_witness','reviewer_label_and_role_not_authenticated',
     'mapping_confirmation_not_fact_validation',
     'observed_tool_calls_do_not_grant_permission',
     'no_persistent_replay_ledger_or_confirmation_idempotency',
     'no_real_customer_source_or_hard_field_confirmation',
     'no_canonical_evidence_pack_or_release_authorization']
 };
 return outcome;
}
try{
 const args=parseArgs(process.argv.slice(2));
 if(args.help){
   process.stdout.write('Experimental M3 REVIEW/CONFIRM --mode review|confirm --source <absolute synthetic> --target-contract first-report-pack --format json|text [--confirmation-file <absolute synthetic decision JSON>]. Requires THREE synthetic-only env gates.\n');
 }else{
   const root=syntheticEnvironment();
   if(!isInside(root,path.resolve(args.source))){
     refuse('SOURCE_OUTSIDE_MARKED_SYNTHETIC_ROOT');
   }
   const draft=runDiscovery(args);
   const fingerprint=canonicalFingerprint(draft);
   if(args.mode==='review'){
     const result=reviewRecord(draft,fingerprint);
     process.stdout.write(args.format==='json'?JSON.stringify(result,null,2)+'\n':textView(result));
   }else{
     const request=readPinnedConfirmation(args.confirmationFile,root,args.source);
     const record=processConfirmation(request,draft,fingerprint);
     process.stdout.write(JSON.stringify(record,null,2)+'\n');
   }
 }
}catch(e){
 const reason=e instanceof BoundedRefusal?e.message:'REVIEW_CONFIRM_IO_OR_RUNTIME_ERROR';
 process.stdout.write(JSON.stringify({
   kind:'ARCH_V02X_M3_REVIEW_CONFIRM_EXPERIMENT',
   status:'BLOCKED',reason,
   no_confirmation_record_created:true,
   no_source_copy_written:true,
   no_authority_expansion:true
 })+'\n');
 process.exitCode=24;
}
