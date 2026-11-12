// I1-INDEPENDENT-RECEIPT-VAULT-ADMISSION-02.
// Pure, no-network admission review. It NEVER grants product approval from
// caller-provided JSON, even if every claim says "PASS".
const P0=[
 ['separateSignerPrincipal','actual_signer_and_writer_credential_separation'],
 ['distinctVerifierPrincipal','verifier_with_separate_credential_and_trust_root'],
 ['kmsKeyCustody','external_kms_hsm_key_attestation_and_no_export'],
 ['pinnedTrustAnchor','independent_verifier_public_key_root_and_rotation'],
 ['protectedAppendOnlyVault','externally_protected_append_only_worm_storage'],
 ['retentionPolicy','signed_owner_legal_retention_schedule_and_data_region'],
 ['legalHold','independent_legal_hold_rule_and_override_guard'],
 ['auditSeparation','audit_reader_protected_from_writer_signer_rewrite'],
 ['independentRestore','independently_restored_verifiable_sample'],
 ['revocationAndRecovery','key_revocation_rotation_and_loss_response']
];
const isEvidence=x=>x&&typeof x==='object'&&!Array.isArray(x)&&
 typeof x.evidenceId==='string'&&/^[A-Z0-9._-]{12,128}$/.test(x.evidenceId)&&
 typeof x.sha256==='string'&&/^[a-f0-9]{64}$/.test(x.sha256)&&
 typeof x.verifiedBy==='string'&&/^[A-Z0-9._-]{8,128}$/.test(x.verifiedBy)&&
 x.sourceClass==='INDEPENDENT_EXTERNAL_RECORD'&&x.executionReceipt!==undefined;
export function assessOperationalVault(config={}){
 const findings=[];
 const allow=(config?.customerEvidence==='SYNTHETIC_ONLY');
 if(!allow)findings.push({gate:'customerEvidence',status:'HOLD',why:'REAL_CUSTOMER_NOT_AUTHORIZED'});
 for(const [key,description]of P0){
   if(!isEvidence(config?.[key]))findings.push({gate:key,status:'HOLD',why:description});
 }
 if(config?.signerPrincipal&&config?.writerPrincipal&&
     config.signerPrincipal===config.writerPrincipal){
   findings.push({gate:'signerPrincipal',status:'HOLD',why:'SAME_SECURITY_PRINCIPAL'});
 }
 if(config?.verifierPrincipal&&config?.signerPrincipal&&
     config.verifierPrincipal===config.signerPrincipal){
   findings.push({gate:'verifierPrincipal',status:'HOLD',why:'VERIFIER_NOT_INDEPENDENT'});
 }
 if(typeof config?.retentionDays==='number'){
   findings.push({gate:'retentionDays',status:'HOLD',why:'UNAPPROVED_RETENTION_VALUE_NOT_ACCEPTED_FROM_CLIENT'});
 }
 return {
   kind:'I1_RECEIPT_OPERATIONAL_TRUST_GATE_V02',
   status:findings.length?'HOLD_EVIDENCE_MISSING':'OWNER_AND_INDEPENDENT_REVIEW_REQUIRED',
   productAuthorized:false,
   customerEvidencePermitted:false,
   independentAssuranceEstablished:false,
   signerKeyAndStorageVerifiedByThisCode:false,
   authoritativePolicyDecision:'NOT_AUTHORIZED',
   openFindings:findings,
   gateCount:P0.length,
   machineScope:'STATIC_EVIDENCE_REQUIREMENTS_ONLY',
   noNetworkOrCredentialRead:true
 };
}
export const admissionRequirements=P0.map(([id,reason])=>({id,requirement:reason}));
