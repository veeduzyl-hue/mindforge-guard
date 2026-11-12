// I1-INDEPENDENT-RECEIPT-VAULT-01: synthetic-only separate-process receipt prototype.
// No Guard product import, no customer input, no network, no irreversible actions.
// Persistent keys, custody, ACL separation and real retention are NOT established.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const KIND='i1_independent_receipt_research_v0.1';
const ALLOWED=new Set(['run_id','bundle_sha256','manifest_sha256','source_sha256','evidence_class','writer_head','verification_scope']);
const hex=s=>typeof s==='string'&&/^[a-f0-9]{64}$/.test(s);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
export const canonical=o=>JSON.stringify(Object.fromEntries(Object.entries(o).sort(([a],[b])=>a.localeCompare(b))));
function readJson(p,max=65536){const st=fs.lstatSync(p);if(!st.isFile()||st.isSymbolicLink()||st.size>max)throw Error('INVALID_RECEIPT_FILE');return JSON.parse(fs.readFileSync(p,'utf8'));}
export function validateSubmission(x){
 if(!x||typeof x!=='object'||Array.isArray(x)||Object.keys(x).sort().join(',')!==[...ALLOWED].sort().join(','))throw Error('FORBIDDEN_RAW_OR_MISSING_FIELDS');
 for(const k of ['bundle_sha256','manifest_sha256','source_sha256'])if(!hex(x[k]))throw Error('INVALID_HASH_'+k);
 if(!/^[a-zA-Z0-9._-]{8,72}$/.test(x.run_id))throw Error('INVALID_RUN_ID');
 if(!['SYNTHETIC_ONLY'].includes(x.evidence_class))throw Error('REAL_CUSTOMER_NOT_AUTHORIZED');
 if(!/^[a-f0-9]{40}$/.test(x.writer_head))throw Error('INVALID_WRITER_ID');
 if(x.verification_scope!=='READ_ONLY_BOUNDED')throw Error('AUTHORITY_EXPANSION_FORBIDDEN');
 return x;
}
export function generateFixtureKeys(dir){
 if(process.env.I1_VAULT_SYNTHETIC_ADMIN!=='1')throw Error('KEY_SETUP_NOT_AUTHORIZED');
 fs.mkdirSync(dir,{recursive:true,mode:0o700});
 const privatePath=path.join(dir,'ephemeral_signer_private.pem');
 const publicPath=path.join(dir,'ephemeral_signer_public.pem');
 const {privateKey,publicKey}=crypto.generateKeyPairSync('ed25519');
 fs.writeFileSync(privatePath,privateKey.export({type:'pkcs8',format:'pem'}),{flag:'wx',mode:0o600});
 fs.writeFileSync(publicPath,publicKey.export({type:'spki',format:'pem'}),{flag:'wx',mode:0o600});
 return {privatePath,publicPath,ephemeral:true,externalKeyCustodyEstablished:false};
}
export function signerIssue({submissionPath,privateKeyPath,vaultRoot,logPath}){
 if(process.env.I1_VAULT_SIGNER_EXPERIMENT!=='1')throw Error('SIGNING_DEFAULT_DISABLED');
 const x=validateSubmission(readJson(submissionPath));
 const key=crypto.createPrivateKey(fs.readFileSync(privateKeyPath));
 const issuerKey=crypto.createPublicKey(key);
 const kid=hash(issuerKey.export({type:'spki',format:'der'}));
 const payload={kind:KIND,run_id:x.run_id,bundle_sha256:x.bundle_sha256,
  manifest_sha256:x.manifest_sha256,source_sha256:x.source_sha256,
  writer_head:x.writer_head,evidence_class:x.evidence_class,
  verification_scope:x.verification_scope,issuer_public_key_sha256:kid,
  external_custody:'NOT_ESTABLISHED',retention_policy:'NOT_APPROVED',
  governance_decision:'NOT_AUTHORIZED',signed_at:new Date().toISOString()};
 const bytes=Buffer.from(canonical(payload));
 const signature=crypto.sign(null,bytes,key).toString('base64');
 const doc={payload,signature,algorithm:'Ed25519',status:'CRYPTOGRAPHIC_SIGNATURE_ONLY'};
 fs.mkdirSync(vaultRoot,{recursive:true,mode:0o700});
 const dest=path.join(vaultRoot,hash(Buffer.from(x.run_id))+'.json');
 fs.writeFileSync(dest,JSON.stringify(doc,null,2)+'\n',{flag:'wx',mode:0o600});
 // This ledger is an ordinary local file, not a protected append-only journal.
 // Keep a hash chain for corruption detection only; a same-user actor can rewrite it.
 let oldHash='0'.repeat(64);
 if(fs.existsSync(logPath)){
  const lines=fs.readFileSync(logPath,'utf8').trim().split('\n').filter(Boolean);
  for(const line of lines){const rec=JSON.parse(line);if(rec.previous_hash!==oldHash)throw Error('AUDIT_CHAIN_UNTRUSTED');
   oldHash=hash(Buffer.from(canonical({...rec,event_hash:undefined})));
   if(oldHash!==rec.event_hash)throw Error('AUDIT_CHAIN_MODIFIED');}
 }
 const ev={seq:fs.existsSync(logPath)?fs.readFileSync(logPath,'utf8').trim().split('\n').filter(Boolean).length+1:1,
   previous_hash:oldHash,action:'ISSUED_SYNTHETIC_ONLY',run_digest:hash(Buffer.from(x.run_id)),
   receipt_sha256:hash(fs.readFileSync(dest)),event_at:new Date().toISOString()};
 const event_hash=hash(Buffer.from(canonical(ev)));
 fs.appendFileSync(logPath,JSON.stringify({...ev,event_hash})+'\n',{mode:0o600});
 return {receiptPath:dest,receiptSha256:hash(fs.readFileSync(dest)),issuerKeyFingerprint:kid,
  auditEventHash:event_hash,retentionAuthorized:false};
}
export function verifyIndependentReceipt({receiptPath,publicKeyPath,expectedRunId,expectedBundleHash}){
 const doc=readJson(receiptPath);
 if(doc.algorithm!=='Ed25519'||typeof doc.signature!=='string')throw Error('UNSUPPORTED_SIGNATURE');
 const pub=crypto.createPublicKey(fs.readFileSync(publicKeyPath));
 const kid=hash(pub.export({type:'spki',format:'der'}));
 const p=doc.payload;
 if(p?.kind!==KIND||kid!==p.issuer_public_key_sha256)throw Error('UNTRUSTED_ISSUER_KEY');
 if(p.run_id!==expectedRunId||p.bundle_sha256!==expectedBundleHash)throw Error('RUN_OR_ARTIFACT_BINDING_MISMATCH');
 if(p.external_custody!=='NOT_ESTABLISHED'||p.retention_policy!=='NOT_APPROVED'||
    p.governance_decision!=='NOT_AUTHORIZED')throw Error('FORBIDDEN_ASSURANCE_CLAIM');
 if(!crypto.verify(null,Buffer.from(canonical(p)),pub,Buffer.from(doc.signature,'base64')))throw Error('INVALID_ED25519_SIGNATURE');
 return {signatureValid:true,runBindingValid:true,artifactBindingValid:true,publicKeyFingerprint:kid,
  verifiedAt:new Date().toISOString(),realIndependentCustody:'NOT_ESTABLISHED',
  externalKeyProtection:'NOT_ESTABLISHED',approvedRetention:'NOT_ESTABLISHED',
  customerAdmission:'HOLD'};
}
export function verifyAuditChain(logPath) {
 let prior='0'.repeat(64),count=0;
 for(const line of fs.readFileSync(logPath,'utf8').trim().split('\n').filter(Boolean)){
  const {event_hash,...ev}=JSON.parse(line);
  if(ev.previous_hash!==prior||hash(Buffer.from(canonical(ev)))!==event_hash)throw Error('AUDIT_CHAIN_CORRUPTED');
  prior=event_hash;count++;
 }
 return {chainConsistent:true,events:count,untrustedAppendOnlyMedia:true,tailHash:prior};
}
export function restoreSyntheticBackup({originalReceipt,backup,publicKeyPath,expectedRunId,expectedBundleHash}){
 if(!fs.existsSync(backup))throw Error('BACKUP_MISSING');
 const now=fs.readFileSync(originalReceipt);
 if(hash(now)!==hash(fs.readFileSync(backup)))throw Error('BACKUP_MISMATCH');
 return verifyIndependentReceipt({receiptPath:backup,publicKeyPath,expectedRunId,expectedBundleHash});
}
