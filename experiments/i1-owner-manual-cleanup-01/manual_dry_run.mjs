// I1-OWNER-MANUAL-CLEANUP-CONTRACT-01 — ONLY non-destructive dry-run checks.
// No fs.rm/unlink/rmdir/rename, no production CLI integration or automated cleanup.
// The test harness alone deletes its own fresh synthetic fixture after tests.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const MARKER='.I1_MANUAL_CLEANUP_SYNTHETIC_ONLY';
const PREFIX='.guard-i1-partial-';
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const stat=p=>fs.lstatSync(p,{bigint:true});
const id=s=>s?{device:String(s.dev),inode:String(s.ino)}:null;
const same=(a,b)=>!!(a&&b&&a.device===b.device&&a.inode===b.inode);
function safeName(n){return typeof n==='string'&&n.startsWith(PREFIX)&&
 /^[.a-zA-Z0-9_-]{20,180}$/.test(n)&&!n.includes('..');}
export function inspectCandidateDryRun(ctx){
 // Dry run requires an explicit synthetic fixture root marker. No customer path.
 if(ctx?.mode!=='SYNTHETIC_ONLY'||ctx?.operation!=='REVIEW_NO_DELETE'){
   return {status:'NOT_AUTHORIZED_REAL_OPERATION',dryRun:true,anyDeletion:false};
 }
 if(!path.isAbsolute(ctx.root||'')||!safeName(ctx.stageName)){
   return {status:'INVALID_EXACT_SCOPE',dryRun:true,anyDeletion:false};
 }
 let root,stage,parent;
 try{
  root=fs.realpathSync(ctx.root);
  const m=stat(path.join(root,MARKER));
  if(!m.isFile()||m.isSymbolicLink()||fs.readFileSync(path.join(root,MARKER),'utf8')!=='SYNTHETIC_ONLY\n'){
   return {status:'NOT_SYNTHETIC_SCOPE',dryRun:true,anyDeletion:false};
  }
  parent=root;
  stage=path.join(parent,ctx.stageName);
 }catch{return {status:'UNTRUSTED_ROOT',dryRun:true,anyDeletion:false};}
 let pst,st;
 try{pst=stat(parent);st=stat(stage);}
 catch{return {status:'TARGET_ABSENT_OR_UNREADABLE_HOLD',dryRun:true,anyDeletion:false};}
 if(pst.isSymbolicLink()||!pst.isDirectory()||st.isSymbolicLink()||!st.isDirectory()||
    fs.realpathSync(stage)!==stage){
  return {status:'TARGET_NOT_PLAIN_DIRECTORY_HOLD',dryRun:true,anyDeletion:false};
 }
 const parentIdentity=id(pst),objectIdentity=id(st);
 if(!same(ctx.expectedParentIdentity,parentIdentity)||
    !same(ctx.expectedObjectIdentity,objectIdentity)){
  return {status:'OBJECT_IDENTITY_CHANGED_HOLD',dryRun:true,anyDeletion:false};
 }
 const findings={
  legalHold:ctx.legalHold==='NONE_SYNTHETIC_OWNER_ASSERTED'?'DECLARED_ONLY':ctx.legalHold||'UNKNOWN',
  backup:ctx.backupDisposition||'UNKNOWN',
  sync:ctx.syncDisposition||'UNKNOWN',
  sensitivity:ctx.sensitivity||'UNKNOWN',
  retention:ctx.retentionDisposition||'UNKNOWN',
 };
 const blocking = [];
 if(!ctx.taskId||!/^SIM-I1-[A-Z0-9-]{6,64}$/.test(ctx.taskId))blocking.push('TASK_ID_MISSING');
 if(ctx.ownerApproval?.role!=='SYNTHETIC_OWNER'||ctx.ownerApproval?.scope!=='DRY_RUN_ONLY')blocking.push('OWNER_DRY_RUN_APPROVAL_MISSING');
 if(ctx.secondReview?.role!=='SYNTHETIC_SECOND_REVIEWER'||ctx.secondReview?.scope!=='DRY_RUN_ONLY'||
    ctx.secondReview?.actor===ctx.ownerApproval?.actor)blocking.push('SECOND_REVIEW_INDEPENDENCE_NOT_SIMULATED');
 if(ctx.legalHold!=='NONE_SYNTHETIC_OWNER_ASSERTED')blocking.push('LEGAL_HOLD_UNKNOWN_OR_ACTIVE');
 if(ctx.backupDisposition!=='SYNTHETIC_NO_ACTIVE_BACKUP_ASSERTED')blocking.push('BACKUP_UNRESOLVED');
 if(ctx.syncDisposition!=='SYNTHETIC_NO_ACTIVE_SYNC_ASSERTED')blocking.push('SYNC_UNRESOLVED');
 if(ctx.retentionDisposition!=='SYNTHETIC_REVIEWED_NOT_REAL_POLICY')blocking.push('RETENTION_POLICY_UNAPPROVED');
 if(ctx.sensitivity!=='DERIVED_DATA_POTENTIALLY_SENSITIVE')blocking.push('SENSITIVITY_UNCLASSIFIED');
 let entries=[];
 try{
  entries=fs.readdirSync(stage,{withFileTypes:true});
  if(entries.length>50)blocking.push('STAGE_ENTRIES_TOO_MANY');
  if(entries.some(e=>e.isSymbolicLink()||!(e.isFile()||e.isDirectory())))blocking.push('UNTRUSTED_STAGE_ENTRY');
  if(entries.some(e=>e.name==='.private-source'))blocking.push('LEGACY_RAW_EVIDENCE_COPY_PRESENT');
 }catch{blocking.push('STAGE_INSPECTION_FAILED');}
 const noBlock=blocking.length===0;
 const receipt={
  kind:'I1_MANUAL_CLEANUP_DRY_RUN_ONLY',
  status:noBlock?'SIMULATED_REVIEW_PREREQUISITES_PRESENT_NOT_EXECUTION_AUTHORITY':'HOLD_BLOCKED',
  dryRun:true,noDeletionPerformed:true,noRepairPerformed:true,
  exactTargetDigest:hash(Buffer.from(stage)),
  parentIdentity,objectIdentity,
  directoryEntriesCount:entries.length,
  observations:findings,blocking,
  simulatedApprovalsNotRealPersons:true,actualOwnerDecision:'NOT ESTABLISHED',
  cleanupExecutionAuthority:'NOT AUTHORIZED',
  humanOperatorCleanupAction:'NOT RUN',
  secureErasureClaim:false,
  currentFilesystemSnapshotOnly:true,
  actualLegalHoldOrBackupSyncVerification:'NOT ESTABLISHED'
 };
 return receipt;
}
