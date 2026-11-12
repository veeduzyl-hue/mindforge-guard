import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {evaluateOwnerCleanupPacket} from './approval_packet.mjs';
const now='2026-11-12T12:00:00.000Z';
const base={
 taskId:'SIM-I1-OWNER-DRYRUN-001',
 objectIdentity:{device:'5',inode:'101'},parentIdentity:{device:'5',inode:'100'},
 targetCanonicalPath:'/SYNTHETIC/EXACT_STAGING',
 operation:'DRY_RUN_NO_DELETE',classification:'DERIVED_MAY_BE_SENSITIVE',
 ownerReview:{role:'SYNTHETIC_OWNER',actor:'fixture-owner'},
 independentReviewer:{role:'SYNTHETIC_REVIEWER',actor:'fixture-reviewer'},
 retentionReview:'SYNTHETIC_POLICY_ONLY',legalHoldReview:'NO_ACTIVE_HOLD_SYNTHETIC_ASSERTION',
 backupReview:'SYNTHETIC_BACKUPS_REVIEWED',syncReview:'SYNTHETIC_CLOUD_SYNC_REVIEWED',
 externalReceiptReference:{authenticity:'SYNTHETIC_UNAUTHENTICATED'},
 observedAt:'2026-11-12T11:00:00.000Z',expiresAt:'2026-11-12T13:00:00.000Z'
};
const cases=[];
function check(id,fn){try{const result=fn();cases.push({id,status:'PASS_BOUNDED',evidence:result||{}});
 console.log('PASS',id);}catch(e){cases.push({id,status:'FAIL',reason:String(e.stack||e).slice(0,1400)});console.error('FAIL',id,e.message);}}
const valid=p=>evaluateOwnerCleanupPacket(p,now);
check('SOP-01-COMPLETE_SIMULATED_PACKET_NEVER_ACTUAL_AUTHORITY',()=>{
 const r=valid(base);
 assert.equal(r.status,'SIMULATED_DOCUMENTATION_COMPLETE_NOT_EXECUTION_AUTHORITY');
 assert.equal(r.actualDeletionAuthorized,false);return {noDeletion:true};});
check('SOP-02-DESTRUCTIVE_ACTION_DENIED',()=>{
 for(const op of ['DELETE','CLEANUP','RESTORE','AUTO']){
  assert.equal(valid({...base,operation:op}).status,'HOLD_BLOCKED');
 }return {refused:4};});
check('SOP-03-OWNER_AND_SECOND_ROLE_INDEPENDENCE',()=>{
 const r=valid({...base,independentReviewer:{...base.independentReviewer,actor:'fixture-owner'}});
 assert(r.reasons.includes('INDEPENDENT_HUMAN_APPROVAL_NOT_ESTABLISHED'));return {};});
check('SOP-04-LEGAL_HOLD_UNKNOWN_OR_ACTIVE',()=>{
 for(const x of ['UNKNOWN','ACTIVE'])assert(valid({...base,legalHoldReview:x}).reasons.includes('LEGAL_HOLD_UNVERIFIED'));
 return {};});
check('SOP-05-BACKUP_AND_SYNC_UNKNOWN_BLOCK',()=>{
 for(const key of ['backupReview','syncReview']){
  const r=valid({...base,[key]:'UNKNOWN'});assert.equal(r.status,'HOLD_BLOCKED');
 }return {};});
check('SOP-06-IDENTITY_CHANGED_AND_PATH_WILDCARD',()=>{
 assert(valid({...base,objectIdentity:{device:'5',inode:'wrong'}}).reasons.includes('UNCERTAIN_OBJECT_BINDING'));
 assert(valid({...base,targetCanonicalPath:'/synthetic/*'}).reasons.includes('UNSAFE_TARGET_EXACTNESS'));
 return {};});
check('SOP-07-EXPIRED_APPROVAL_WINDOW',()=>{
 assert(valid({...base,expiresAt:'2026-11-12T11:59:00Z'}).reasons.includes('EXPIRED_OR_EXCESSIVE_APPROVAL_WINDOW'));
 return {};});
check('SOP-08-SELF_ASSERTED_SIGNED_REAL_APPROVAL_FORBIDDEN',()=>{
 assert(valid({...base,realOwnerSignature:true,realSecondReviewerSignature:true}).reasons.includes('SELF_DECLARED_REAL_SIGNATURE_NOT_ACCEPTED'));
 return {};});
check('SOP-09-FORBIDDEN_COMMAND_IN_PACKET',()=>{
 assert(valid({...base,requestedCommand:'DELETE'}).reasons.includes('OPERATIONAL_COMMAND_MUST_NOT_BE_IN_DRY_RUN_PACKET'));
 return {};});
check('SOP-10-REAL_POLICY_CANNOT_BE_REPLACED_BY_PAPER_TEST',()=>{
 const r=valid({...base,retentionReview:'OWNER_APPROVED_365_DAYS'});
 assert(r.reasons.includes('REAL_RETENTION_POLICY_UNAPPROVED'));
 assert.equal(r.anyActualHumanAuthenticated,false);return {};});
const fail=cases.filter(x=>x.status==='FAIL');
const receipt={kind:'I1_OWNER_CLEANUP_SOP_ADMISSION_02',head:process.env.GITHUB_SHA||'LOCAL',
  node:process.version,platform:process.platform,counts:{pass:cases.length-fail.length,fail:fail.length},
  cases,realCleanup:'NOT_AUTHORIZED',actualHumans:'NOT_TESTED',actualLegalHold:'NOT_VERIFIED',
  approvals:'SYNTHETIC_ONLY'};
if(process.env.I1_CLEANUP_POLICY_RECEIPT){
const o=path.resolve(process.env.I1_CLEANUP_POLICY_RECEIPT);
fs.mkdirSync(path.dirname(o),{recursive:true});fs.writeFileSync(o,JSON.stringify(receipt,null,2)+'\n');
}
console.log('I1_OWNER_SOP_ADMISSION_FINAL',JSON.stringify(receipt.counts));
if(fail.length)process.exitCode=1;
