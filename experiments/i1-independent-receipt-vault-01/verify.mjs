import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {generateFixtureKeys,verifyIndependentReceipt,verifyAuditChain,
 restoreSyntheticBackup,validateSubmission} from './vault.mjs';
const root=fs.mkdtempSync(path.join(os.tmpdir(),'guard-i1-vault-'));
const d=path.dirname(fileURLToPath(import.meta.url));
const keyRoot=path.join(root,'signer-isolated-fixture');
const vaultRoot=path.join(root,'verifier-vault-fixture');
const audit=path.join(root,'audit.chain.jsonl');
const input=path.join(root,'untrusted-writer-submission.json');
const backup=path.join(root,'offline-backup.json');
const receiptFile=path.join(root,'test-results.json');
const cases=[];
const h=()=>crypto.randomBytes(32).toString('hex');
const writerSha='05cc5eee25c53db164d2d766e73fa63afd853bf4';
const runId='SYNTHETIC_I1_20261112_001',bundleHash=h();
const submitted={run_id:runId,bundle_sha256:bundleHash,manifest_sha256:h(),source_sha256:h(),
 evidence_class:'SYNTHETIC_ONLY',writer_head:writerSha,verification_scope:'READ_ONLY_BOUNDED'};
function check(id,fn){try{const v=fn();cases.push({id,status:'PASS_BOUNDED',evidence:v??{}});
 console.log('PASS',id,JSON.stringify(v??{}).slice(0,300));}
 catch(e){cases.push({id,status:'FAIL',reason:String(e.stack||e).slice(0,1400)});console.error('FAIL',id,e.message);}}
process.env.I1_VAULT_SYNTHETIC_ADMIN='1';
const keys=generateFixtureKeys(keyRoot);
fs.writeFileSync(input,JSON.stringify(submitted),{flag:'wx',mode:0o600});
let signed;
check('VLT-01-STRICT_ALLOWLIST_AND_NO_RAW_CONTENT',()=>{
 assert.deepEqual(validateSubmission(submitted),submitted);
 assert.throws(()=>validateSubmission({...submitted,raw_evidence:'SECRET'}),/FORBIDDEN_RAW/);
 assert.throws(()=>validateSubmission({...submitted,evidence_class:'REAL_CUSTOMER'}),/REAL_CUSTOMER_NOT_AUTHORIZED/);
 return {schemaAllowlist:true,noRawEvidence:true};});
check('VLT-02-SEPARATE_SIGNER_PROCESS_AND_KEY',()=>{
 const p=spawnSync(process.execPath,[path.join(d,'sign_worker.mjs'),input,keys.privatePath,vaultRoot,audit],
  {encoding:'utf8',timeout:40000,env:{...process.env,I1_VAULT_SIGNER_EXPERIMENT:'1'}});
 assert.equal(p.status,0,p.stderr);signed=JSON.parse(p.stdout.trim());
 assert(fs.existsSync(signed.receiptPath));
 assert(!fs.readFileSync(signed.receiptPath,'utf8').includes('PRIVATE KEY'));
 return {differentProcess:true,ephemeralKey:true,actualSeparateSecurityPrincipal:false};
});
check('VLT-03-ED25519_VERIFICATION_AND_RUN_BINDING',()=>{
 const v=verifyIndependentReceipt({receiptPath:signed.receiptPath,publicKeyPath:keys.publicPath,
  expectedRunId:runId,expectedBundleHash:bundleHash});
 assert(v.signatureValid&&v.runBindingValid&&v.artifactBindingValid);
 assert.equal(v.realIndependentCustody,'NOT_ESTABLISHED');return v;
});
check('VLT-04-MISMATCHED_RUN_OR_ARTIFACT_REJECTED',()=>{
 assert.throws(()=>verifyIndependentReceipt({receiptPath:signed.receiptPath,publicKeyPath:keys.publicPath,
  expectedRunId:'WRONG_RUN',expectedBundleHash:bundleHash}),/MISMATCH/);
 assert.throws(()=>verifyIndependentReceipt({receiptPath:signed.receiptPath,publicKeyPath:keys.publicPath,
  expectedRunId:runId,expectedBundleHash:h()}),/MISMATCH/);return {mismatchesRejected:2};
});
check('VLT-05-TAMPERED_PAYLOAD_AND_SIGNATURE_REJECTED',()=>{
 const data=JSON.parse(fs.readFileSync(signed.receiptPath,'utf8'));
 const dest=path.join(root,'tampered.json');
 data.payload.source_sha256=h();
 fs.writeFileSync(dest,JSON.stringify(data));
 assert.throws(()=>verifyIndependentReceipt({receiptPath:dest,publicKeyPath:keys.publicPath,
  expectedRunId:runId,expectedBundleHash:bundleHash}),/INVALID_ED25519_SIGNATURE/);
 data.payload.source_sha256=submitted.source_sha256;
 data.signature=Buffer.alloc(64).toString('base64');fs.writeFileSync(dest,JSON.stringify(data));
 assert.throws(()=>verifyIndependentReceipt({receiptPath:dest,publicKeyPath:keys.publicPath,
  expectedRunId:runId,expectedBundleHash:bundleHash}),/INVALID_ED25519_SIGNATURE/);
 return {tampersRejected:2};
});
check('VLT-06-WRONG_KEY_REJECTED',()=>{
 const alternate=generateFixtureKeys(path.join(root,'other-keys'));
 assert.throws(()=>verifyIndependentReceipt({receiptPath:signed.receiptPath,publicKeyPath:alternate.publicPath,
  expectedRunId:runId,expectedBundleHash:bundleHash}),/UNTRUSTED_ISSUER_KEY/);
 return {differentKeyRejected:true};
});
check('VLT-07-AUDIT_CHAIN_AND_MUTATION_DETECTION',()=>{
 const v=verifyAuditChain(audit);assert.equal(v.events,1);
 const lines=fs.readFileSync(audit,'utf8');
 fs.writeFileSync(audit,lines.replace('ISSUED_SYNTHETIC_ONLY','DELETED'));
 assert.throws(()=>verifyAuditChain(audit),/AUDIT_CHAIN_CORRUPTED/);
 fs.writeFileSync(audit,lines);return {hashChainConsistent:true,tamperDetected:true};
});
check('VLT-08-INDEPENDENT_OFFLINE_BACKUP_AND_RESTORE_CRYPTO',()=>{
 fs.copyFileSync(signed.receiptPath,backup);
 const v=restoreSyntheticBackup({originalReceipt:signed.receiptPath,backup,publicKeyPath:keys.publicPath,
  expectedRunId:runId,expectedBundleHash:bundleHash});
 assert.equal(v.signatureValid,true);
 fs.appendFileSync(backup,'SIMULATED_CORRUPTION');
 assert.throws(()=>restoreSyntheticBackup({originalReceipt:signed.receiptPath,backup,
 publicKeyPath:keys.publicPath,expectedRunId:runId,expectedBundleHash:bundleHash}),/BACKUP_MISMATCH/);
 return {syntheticRestore:true,realIndependentVaultStorage:false};
});
check('VLT-09-DUPLICATE_RECEIPT_NEVER_OVERWRITTEN',()=>{
 const p=spawnSync(process.execPath,[path.join(d,'sign_worker.mjs'),input,keys.privatePath,vaultRoot,audit],
  {encoding:'utf8',timeout:40000,env:{...process.env,I1_VAULT_SIGNER_EXPERIMENT:'1'}});
 assert.notEqual(p.status,0);
 assert.equal(verifyAuditChain(audit).events,1);
 return {overwriteRefused:true};
});
check('VLT-10-RETENTION_AND_KEY_CUSTODY_NOT_FABRICATED',()=>{
 const doc=JSON.parse(fs.readFileSync(signed.receiptPath,'utf8'));
 assert.equal(doc.payload.retention_policy,'NOT_APPROVED');
 assert.equal(doc.payload.external_custody,'NOT_ESTABLISHED');
 assert.equal(doc.payload.governance_decision,'NOT_AUTHORIZED');
 return {operationalRetention:'HOLD',keyCustody:'HOLD',accessAuditTamperResistance:'NOT_ESTABLISHED'};
});
const fails=cases.filter(x=>x.status==='FAIL'),counts={pass:cases.length-fails.length,fail:fails.length};
const result={kind:'I1_INDEPENDENT_RECEIPT_VAULT_01_SYNTHETIC_RECEIPT',testSha:process.env.GITHUB_SHA||'LOCAL',
 os:process.platform,node:process.version,counts,cases,
 trueIndependentIdentity:'NOT_TESTED',realKeyCustody:'NOT_TESTED',
 actualCustomerEvidence:'NOT_AUTHORIZED',realRetentionPeriod:'NOT_APPROVED',
 externalBackup:'NOT_ESTABLISHED',realLegalHold:'NOT_ESTABLISHED',
 signedReceiptSchema:'TESTED_SYNTHETIC_ONLY',noProductionChanges:true};
const output=process.env.I1_VAULT_RECEIPT_FILE||receiptFile;
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');
console.log('I1_INDEPENDENT_VAULT_FINAL',JSON.stringify(counts));
fs.rmSync(root,{force:true,recursive:true});
if(fails.length)process.exitCode=1;
