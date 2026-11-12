// I1-OWNER-MANUAL-CLEANUP-SOP-ADMISSION-02: approval packet check only.
// No I/O, credentials, timer, network, deletion, CLI authority or actions.
const required=[
 'taskId','objectIdentity','parentIdentity','classification','ownerReview',
 'independentReviewer','retentionReview','legalHoldReview','backupReview',
 'syncReview','externalReceiptReference','targetCanonicalPath',
 'observedAt','expiresAt'
];
const id=o=>o&&typeof o.device==='string'&&/^[0-9]+$/.test(o.device)&&
 typeof o.inode==='string'&&/^[0-9]+$/.test(o.inode);
const forbidden=['DELETE','RM','RMDIR','CLEANUP','ERASE','SHRED','RETRY'];
export function evaluateOwnerCleanupPacket(p={},now='2026-11-12T00:00:00.000Z'){
 const reasons=[];
 for(const key of required)if(p[key]===undefined||p[key]===null)reasons.push('MISSING_'+key);
 if(p.operation!=='DRY_RUN_NO_DELETE')reasons.push('DESTRUCTIVE_OR_UNKNOWN_OPERATION_NOT_AUTHORIZED');
 if(!id(p.objectIdentity)||!id(p.parentIdentity))reasons.push('UNCERTAIN_OBJECT_BINDING');
 if(typeof p.targetCanonicalPath!=='string'||!p.targetCanonicalPath||p.targetCanonicalPath.includes('*')||
     p.targetCanonicalPath.includes('..'))reasons.push('UNSAFE_TARGET_EXACTNESS');
 if(p.classification!=='DERIVED_MAY_BE_SENSITIVE')reasons.push('CLASSIFICATION_UNVERIFIED');
 if(p.legalHoldReview!=='NO_ACTIVE_HOLD_SYNTHETIC_ASSERTION')reasons.push('LEGAL_HOLD_UNVERIFIED');
 if(p.backupReview!=='SYNTHETIC_BACKUPS_REVIEWED')reasons.push('BACKUP_CUSTODY_UNVERIFIED');
 if(p.syncReview!=='SYNTHETIC_CLOUD_SYNC_REVIEWED')reasons.push('SYNC_CUSTODY_UNVERIFIED');
 if(p.retentionReview!=='SYNTHETIC_POLICY_ONLY')reasons.push('REAL_RETENTION_POLICY_UNAPPROVED');
 if(!p.ownerReview?.role||!p.independentReviewer?.role||
    p.ownerReview?.role!=='SYNTHETIC_OWNER'||p.independentReviewer?.role!=='SYNTHETIC_REVIEWER'||
    p.ownerReview?.actor===p.independentReviewer?.actor){
   reasons.push('INDEPENDENT_HUMAN_APPROVAL_NOT_ESTABLISHED');
 }
 const age=Date.parse(now),expires=Date.parse(p.expiresAt),observed=Date.parse(p.observedAt);
 if(!Number.isFinite(age)||!Number.isFinite(expires)||!Number.isFinite(observed)||
    observed>age||expires<=age||expires-age>24*3600*1000)reasons.push('EXPIRED_OR_EXCESSIVE_APPROVAL_WINDOW');
 if(p.externalReceiptReference?.authenticity!=='SYNTHETIC_UNAUTHENTICATED'){
   reasons.push('EXTERNAL_RECEIPT_CUSTODY_UNVERIFIED');
 }
 if(p.realOwnerSignature===true||p.realSecondReviewerSignature===true){
   reasons.push('SELF_DECLARED_REAL_SIGNATURE_NOT_ACCEPTED');
 }
 if(forbidden.includes(String(p.requestedCommand||'').toUpperCase())){
   reasons.push('OPERATIONAL_COMMAND_MUST_NOT_BE_IN_DRY_RUN_PACKET');
 }
 return {kind:'I1_OWNER_CLEANUP_APPROVAL_PACKET_REVIEW_V02',
   status:reasons.length?'HOLD_BLOCKED':'SIMULATED_DOCUMENTATION_COMPLETE_NOT_EXECUTION_AUTHORITY',
   reasons,readOnly:true,
   anyActualHumanAuthenticated:false,
   actualLegalHoldConfirmed:false,
   actualDeletionAuthorized:false,
   noFilesystemChanges:true,
   noGuardExecutionAuthority:true,
   independentReceiptProvider:'NOT_AVAILABLE',
   humanOperatorMustObtainSeparateExactObjectAuthorization:true};
}
