import {signerIssue} from './vault.mjs';
const [submissionPath,privateKeyPath,vaultRoot,logPath]=process.argv.slice(2);
if(process.env.I1_VAULT_SIGNER_EXPERIMENT!=='1'||!submissionPath||!privateKeyPath||!vaultRoot||!logPath)process.exit(2);
const r=signerIssue({submissionPath,privateKeyPath,vaultRoot,logPath});
process.stdout.write(JSON.stringify(r)+'\n');
