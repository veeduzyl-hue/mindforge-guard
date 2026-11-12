// Owner-only standalone read-only I-1 recovery inspector.
// Not a Guard product subcommand and does not write a receipt to disk.
import fs from 'node:fs';
import path from 'node:path';
import {inspectI1ReviewRecovery} from '../packages/guard/src/cli/review_recovery_readonly.mjs';

const USAGE='node scripts/i1_real_writer_recovery_inspect.mjs --parent <absolute-output-parent> --name <single-output-basename> [--prior <existing-json-receipt>]';
const args=process.argv.slice(2);
const opts={parent:null,outputName:null,priorReceipt:null};
const seen=new Set();
let priorPath=null;
for(let i=0;i<args.length;i+=2){
  const k=args[i],v=args[i+1];
  if(!['--parent','--name','--prior'].includes(k)||!v||seen.has(k)){
    process.stderr.write('I-1 read-only recovery inspector: unsupported/duplicate argument.\n'+USAGE+'\n');
    process.exit(2);
  }
  seen.add(k);
  if(k==='--parent')opts.parent=v;
  else if(k==='--name')opts.outputName=v;
  else priorPath=v;
}
if(!opts.parent||!opts.outputName){
  process.stderr.write(USAGE+'\n');process.exit(2);
}
try{
  if(priorPath){
    if(!path.isAbsolute(priorPath))throw Error('Prior receipt must have an absolute path');
    const st=fs.lstatSync(priorPath);
    if(!st.isFile()||st.isSymbolicLink()||st.size>32768)throw Error('Prior receipt unsafe or too large');
    opts.priorReceipt=JSON.parse(fs.readFileSync(priorPath,'utf8'));
  }
  const res=inspectI1ReviewRecovery(opts);
  process.stdout.write(JSON.stringify(res,null,2)+'\n');
  process.exitCode=res.overallReviewRequired?2:0;
}catch(e){
  process.stderr.write('I-1 read-only inspection could not establish a trustworthy result: '+String(e.code||e.message||'unknown').slice(0,180)+'\n');
  process.exitCode=30;
}
