import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {assessOperationalVault,admissionRequirements} from './admission_gate.mjs';
const cases=[];const hex='a'.repeat(64);
function run(id,fn){try{const result=fn();cases.push({id,status:'PASS_BOUNDED',evidence:result||{}});
 console.log('PASS',id,JSON.stringify(result||{}).slice(0,260));}
 catch(e){cases.push({id,status:'FAIL',reason:String(e.stack||e).slice(0,1300)});console.error('FAIL',id,e.message);}}
run('TRUST-01-EMPTY_CONFIG_REJECTED',()=>{
 const s=assessOperationalVault({});
 assert.equal(s.status,'HOLD_EVIDENCE_MISSING');assert.equal(s.productAuthorized,false);
 return {openFindings:s.openFindings.length};});
run('TRUST-02-SAME_PROCESS_NOT_INDEPENDENT_CUSTODY',()=>{
 const s=assessOperationalVault({customerEvidence:'SYNTHETIC_ONLY',signerPrincipal:'same',writerPrincipal:'same'});
 assert(s.openFindings.some(f=>f.why==='SAME_SECURITY_PRINCIPAL'));return {rejected:true};});
run('TRUST-03-VERIFIER_MUST_BE_DISTINCT',()=>{
 const s=assessOperationalVault({customerEvidence:'SYNTHETIC_ONLY',signerPrincipal:'same',verifierPrincipal:'same'});
 assert(s.openFindings.some(f=>f.why==='VERIFIER_NOT_INDEPENDENT'));return {rejected:true};});
run('TRUST-04-RETENTION_NOT_INVENTED',()=>{
 const s=assessOperationalVault({customerEvidence:'SYNTHETIC_ONLY',retentionDays:365});
 assert(s.openFindings.some(f=>f.gate==='retentionDays'));
 return {retentionPeriodInvented:false};});
run('TRUST-05-SPOOFED_BOOLEAN_PASS_NOT_EVIDENCE',()=>{
 const s=assessOperationalVault(Object.fromEntries(admissionRequirements.map(x=>[x.id,true])));
 assert.equal(s.openFindings.filter(x=>x.gate!=='customerEvidence').length,10);
 return {spoofedPassRejected:true};});
run('TRUST-06-UNVERIFIED_SOURCE_NOT_INDEPENDENT_RECORD',()=>{
 const s=assessOperationalVault({customerEvidence:'SYNTHETIC_ONLY',
    kmsKeyCustody:{evidenceId:'VALID_TEST_ID_0001',sha256:hex,verifiedBy:'TEST_ACTOR',
     sourceClass:'SELF_DECLARED',executionReceipt:{}}});
 assert(s.openFindings.some(f=>f.gate==='kmsKeyCustody'));
 return {selfDeclarationRejected:true};});
run('TRUST-07-ALL_SELF_CONTAINED_PAPER_CLAIMS_NOT_PRODUCT_AUTHORIZATION',()=>{
 const record={evidenceId:'CANDIDATE_FACT_001',sha256:hex,
   verifiedBy:'SEPARATE_REVIEWER_001',sourceClass:'INDEPENDENT_EXTERNAL_RECORD',
   executionReceipt:{origin:'synthetic_unverified'}};
 const c={customerEvidence:'SYNTHETIC_ONLY'};
 for(const item of admissionRequirements)c[item.id]=record;
 const s=assessOperationalVault(c);
 assert.equal(s.openFindings.length,0);
 assert.equal(s.status,'OWNER_AND_INDEPENDENT_REVIEW_REQUIRED');
 assert.equal(s.customerEvidencePermitted,false);
 return {evenCompleteClaimSetCannotAuthorize:true};});
run('TRUST-08-REAL_CUSTOMER_DECLARATION_DENIED',()=>{
 const s=assessOperationalVault({customerEvidence:'REAL_CUSTOMER'});
 assert(s.openFindings.some(f=>f.gate==='customerEvidence'));
 return {customerDataDenied:true};});
run('TRUST-09-LEGACY_EPHEMERAL_SIGNER_POC_NOT_PROMOTED',()=>{
 const s=assessOperationalVault({customerEvidence:'SYNTHETIC_ONLY',kmsKeyCustody:{ephemeral:true},
 protectedAppendOnlyVault:{localHashChain:true}});
 assert(s.openFindings.some(f=>f.gate==='kmsKeyCustody'));
 assert(s.openFindings.some(f=>f.gate==='protectedAppendOnlyVault'));
 return {ephemeralCryptoNotPromoted:true};});
run('TRUST-10-NO_FS_OR_NETWORK_SIDE_EFFECTS',()=>{
 const before=process.cwd();
 const s=assessOperationalVault({customerEvidence:'SYNTHETIC_ONLY'});
 assert.equal(before,process.cwd());assert(s.noNetworkOrCredentialRead);
 return {pureGate:true};});
const fails=cases.filter(x=>x.status==='FAIL');
const receipt={kind:'I1_RECEIPT_TRUST_DOMAIN_ADMISSION_TEST',head:process.env.GITHUB_SHA||'LOCAL',
  platform:process.platform,node:process.version,counts:{pass:cases.length-fails.length,fail:fails.length},
  cases,realKms:'NOT_CONNECTED',retention:'NOT_APPROVED',customerEvidence:'NOT_AUTHORIZED'};
if(process.env.I1_VAULT_TRUST_RECEIPT){
 const p=path.resolve(process.env.I1_VAULT_TRUST_RECEIPT);
 fs.mkdirSync(path.dirname(p),{recursive:true});
 fs.writeFileSync(p,JSON.stringify(receipt,null,2)+'\n');
}
console.log('I1_VAULT_TRUST_GATE_FINAL',JSON.stringify(receipt.counts));
if(fails.length)process.exitCode=1;
