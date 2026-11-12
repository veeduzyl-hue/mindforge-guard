import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {inspectCandidateDryRun} from './manual_dry_run.mjs';
const root=fs.mkdtempSync(path.join(os.tmpdir(),'guard-i1-owner-cleanup-'));
const name='.guard-i1-partial-owned-synthetic-01';
const stage=path.join(root,name);
fs.writeFileSync(path.join(root,'.I1_MANUAL_CLEANUP_SYNTHETIC_ONLY'),'SYNTHETIC_ONLY\n');
fs.mkdirSync(stage,{mode:0o700});
const content=path.join(stage,'derived-report.json');
fs.writeFileSync(content,'{"synthetic":true,"private_narrative":"synthetic_only"}',{flag:'wx',mode:0o600});
const identity=p=>{const s=fs.statSync(p,{bigint:true});return{device:String(s.dev),inode:String(s.ino)};};
const first={mode:'SYNTHETIC_ONLY',operation:'REVIEW_NO_DELETE',root,stageName:name,
 expectedParentIdentity:identity(root),expectedObjectIdentity:identity(stage),
 taskId:'SIM-I1-OWNER-CLEANUP-00001',
 ownerApproval:{role:'SYNTHETIC_OWNER',actor:'fixture-owner',scope:'DRY_RUN_ONLY'},
 secondReview:{role:'SYNTHETIC_SECOND_REVIEWER',actor:'fixture-reviewer',scope:'DRY_RUN_ONLY'},
 legalHold:'NONE_SYNTHETIC_OWNER_ASSERTED',backupDisposition:'SYNTHETIC_NO_ACTIVE_BACKUP_ASSERTED',
 syncDisposition:'SYNTHETIC_NO_ACTIVE_SYNC_ASSERTED',
 retentionDisposition:'SYNTHETIC_REVIEWED_NOT_REAL_POLICY',
 sensitivity:'DERIVED_DATA_POTENTIALLY_SENSITIVE'};
const h=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const cases=[];
function one(id,fn){try{const evidence=fn();cases.push({id,status:'PASS_BOUNDED',evidence});
 console.log('PASS',id,JSON.stringify(evidence).slice(0,260));}
 catch(e){cases.push({id,status:'FAIL',error:String(e.stack||e).slice(0,1500)});console.error('FAIL',id,e.message);}}
one('CLN-01-DRY_RUN_ALL_PREREQUISITES_SIMULATED',()=>{
 const r=inspectCandidateDryRun(first);
 assert.equal(r.status,'SIMULATED_REVIEW_PREREQUISITES_PRESENT_NOT_EXECUTION_AUTHORITY');
 assert.equal(r.noDeletionPerformed,true);assert.equal(r.cleanupExecutionAuthority,'NOT AUTHORIZED');
 return {status:r.status,realOwnerDecision:r.actualOwnerDecision};});
one('CLN-02-EXACT_PARENT_AND_INODE_BINDING',()=>{
 const r=inspectCandidateDryRun({...first,expectedObjectIdentity:{...first.expectedObjectIdentity,inode:'123456789'}});
 assert.equal(r.status,'OBJECT_IDENTITY_CHANGED_HOLD');return {status:r.status};});
one('CLN-03-LEGAL_HOLD_BLOCKS',()=>{
 const r=inspectCandidateDryRun({...first,legalHold:'ACTIVE'});
 assert.equal(r.status,'HOLD_BLOCKED');assert(r.blocking.includes('LEGAL_HOLD_UNKNOWN_OR_ACTIVE'));
 return {status:r.status};});
one('CLN-04-UNKNOWN_BACKUP_OR_SYNC_BLOCKS',()=>{
 for(const override of [{backupDisposition:'UNKNOWN'},{syncDisposition:'UNKNOWN'}]){
  const r=inspectCandidateDryRun({...first,...override});assert.equal(r.status,'HOLD_BLOCKED');
 }return {backupHold:true,syncHold:true};});
one('CLN-05-OWNER_AND_SECOND_REVIEWER_NOT_INTERCHANGEABLE',()=>{
 let r=inspectCandidateDryRun({...first,secondReview:{...first.secondReview,actor:first.ownerApproval.actor}});
 assert.equal(r.status,'HOLD_BLOCKED');
 r=inspectCandidateDryRun({...first,ownerApproval:{role:'WRITER',actor:'a',scope:'DRY_RUN_ONLY'}});
 assert.equal(r.status,'HOLD_BLOCKED');return {differentRolesRequired:true};});
one('CLN-06-NO_REAL_DELETE_OR_AUTO_MODE',()=>{
 for(const operation of ['DELETE','AUTO_CLEANUP','DRY_RUN_AND_DELETE']){
  const r=inspectCandidateDryRun({...first,operation});assert.equal(r.status,'NOT_AUTHORIZED_REAL_OPERATION');
 }return {destructiveModesDenied:3};});
one('CLN-07-UNKNOWN_RAW_EVIDENCE_COPY_BLOCKS',()=>{
 fs.mkdirSync(path.join(stage,'.private-source'));
 try{const r=inspectCandidateDryRun(first);assert.equal(r.status,'HOLD_BLOCKED');
 assert(r.blocking.includes('LEGACY_RAW_EVIDENCE_COPY_PRESENT'));
 return {rawEvidenceCritical:true};}
 finally{fs.rmdirSync(path.join(stage,'.private-source'));}
});
one('CLN-08-RETENTION_AND_SENSITIVITY_UNAPPROVED_BLOCKS',()=>{
 const r=inspectCandidateDryRun({...first,retentionDisposition:'UNKNOWN',sensitivity:'UNKNOWN'});
 assert.equal(r.status,'HOLD_BLOCKED');
 return {blocking:r.blocking};});
one('CLN-09-EXTERNAL_ROOT_AND_NAME_TRAVERSAL_REJECTED',()=>{
 const r=inspectCandidateDryRun({...first,stageName:'../../victim'});
 assert.equal(r.status,'INVALID_EXACT_SCOPE');
 return {traversalRefused:true};});
one('CLN-10-STAGE_SYMLINK_REJECTED',()=>{
 const l=path.join(root,'.guard-i1-partial-link-synthetic');
 fs.symlinkSync(stage,l,process.platform==='win32'?'junction':'dir');
 const r=inspectCandidateDryRun({...first,stageName:path.basename(l)});
 assert.equal(r.status,'TARGET_NOT_PLAIN_DIRECTORY_HOLD');return {symlinkRefused:true};});
one('CLN-11-FIXTURE_NOT_MODIFIED',()=>{
 const before=h(content),mtime=fs.statSync(content).mtimeMs;
 const r=inspectCandidateDryRun(first);
 assert.equal(r.noDeletionPerformed,true);
 assert.equal(h(content),before);assert.equal(fs.statSync(content).mtimeMs,mtime);
 return {contentsPreserved:true,syntheticHumanParticipated:false};});
const failed=cases.filter(c=>c.status==='FAIL');
const result={kind:'I1_MANUAL_CLEANUP_01_DRY_RUN_RECEIPT',
 fixedHead:process.env.GITHUB_SHA||'LOCAL',platform:process.platform,
 total:cases.length,counts:{pass:cases.length-failed.length,fail:failed.length},
 cases,destructiveActionsPerformed:0,actualHumanReviewerJoined:false,
 actualCustomerEvidence:'NOT_AUTHORIZED',realLegalHold:'NOT_VERIFIED',
 actualOwnerApproval:'NOT_ESTABLISHED',automaticCleanup:'NOT_IMPLEMENTED',
 independentReceiptVault:'NOT_ESTABLISHED'};
if(process.env.I1_CLEANUP_RECEIPT_FILE){
 fs.mkdirSync(path.dirname(process.env.I1_CLEANUP_RECEIPT_FILE),{recursive:true});
 fs.writeFileSync(process.env.I1_CLEANUP_RECEIPT_FILE,JSON.stringify(result,null,2)+'\n');
}
console.log('I1_MANUAL_CLEANUP_FINAL',JSON.stringify(result.counts));
fs.rmSync(root,{recursive:true,force:true}); // owned synthetic fixture only
if(failed.length)process.exitCode=1;
