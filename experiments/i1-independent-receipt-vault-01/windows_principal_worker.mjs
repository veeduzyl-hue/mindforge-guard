// Ephemeral Windows 11 dual-standard-user trust-boundary test, synthetic only.
// Called by the CI's synthetic credential harness; never product-integrated.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {generateFixtureKeys,signerIssue,verifyIndependentReceipt} from './vault.mjs';
const [role,root,expectedRunId,expectedHash]=process.argv.slice(2);
if(process.platform!=='win32'||!root||!path.isAbsolute(root)||!['signer','writer'].includes(role)){
  process.stderr.write('SYNTHETIC_PRINCIPAL_PROBE_SCOPE_ONLY\n');process.exit(2);
}
const marker=path.join(root,'.I1_VAULT_EPHEMERAL_PRINCIPALS');
if(fs.readFileSync(marker,'utf8')!=='SYNTHETIC_ONLY\n')process.exit(3);
const shared=path.join(root,'shared'),keys=path.join(root,'signer'),
 vault=path.join(root,'vault');
const stat=path.join(shared,'signer-result.json');
const receiptFile=path.join(vault,crypto.createHash('sha256').update(expectedRunId).digest('hex')+'.json');
if(role==='signer'){
  process.env.I1_VAULT_SYNTHETIC_ADMIN='1';
  process.env.I1_VAULT_SIGNER_EXPERIMENT='1';
  const k=generateFixtureKeys(keys);
  const r=signerIssue({submissionPath:path.join(shared,'submission.json'),
    privateKeyPath:k.privatePath,vaultRoot:vault,logPath:path.join(vault,'audit.jsonl')});
  fs.copyFileSync(k.publicPath,path.join(shared,'public.pem'));
  fs.writeFileSync(stat,JSON.stringify({receiptSha256:r.receiptSha256,
     signerPrincipalSeparateProcess:true,signatureAlgorithm:'Ed25519'})+'\n',
     {flag:'wx'});
  process.stdout.write('SIGNER_ISSUED_SYNTHETIC_ONLY\n');
  process.exit(0);
}
const positive=fs.readFileSync(path.join(shared,'public.pem'),'utf8');
if(!positive.includes('BEGIN PUBLIC KEY'))process.exit(11);
let denied=false;
try{fs.readFileSync(path.join(keys,'ephemeral_signer_private.pem'));}
catch(e){if(['EPERM','EACCES'].includes(e?.code))denied=true;else process.exit(12);}
if(!denied)process.exit(13);
const verified=verifyIndependentReceipt({receiptPath:receiptFile,
 publicKeyPath:path.join(shared,'public.pem'),expectedRunId,expectedBundleHash:expectedHash});
if(!verified.signatureValid)process.exit(14);
process.stdout.write(JSON.stringify({
 signerPrivateKeyReadDeniedToOtherNonAdminUser:true,
 publicKeyPositiveRead:true,
 signedReceiptVerifiedByOtherUser:true,
 trueIndependentOperationalTrustDomain:false,
 ephemeralWindowsPrincipalOnly:true
})+'\n');
