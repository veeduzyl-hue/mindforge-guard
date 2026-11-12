// Synthetic fault-injection ONLY. Intercepts real I-1 Writer filesystem
// actions at deterministic checkpoints without touching any customer files.
import fs from 'node:fs';
import path from 'node:path';
import {handleReviewPackSubcommand} from '../packages/guard/src/cli/review_pack.mjs';

const [pack,out,point]=process.argv.slice(2);
const valid=new Set(['AFTER_STAGE_CREATED','AFTER_CHECKSUM_INDEX_WRITTEN',
  'AFTER_FINAL_DIRECTORY_RENAME','THROW_AFTER_FINAL_DIRECTORY_RENAME',
  'EIO_BEFORE_FINAL_DIRECTORY_RENAME']);
if(process.env.I1_RECOVERY_SYNTHETIC_CRASH!=='1'||!pack||!out||!valid.has(point)||
   !path.isAbsolute(pack)||!path.isAbsolute(out)||
   !fs.existsSync(path.join(path.dirname(pack),'.I1_RECOVERY_SYNTHETIC_ONLY'))){
  process.stderr.write('I-1 recovery child requires an owned synthetic fixture and explicit opt-in\n');
  process.exit(2);
}
const originalMk=fs.mkdtempSync,originalRename=fs.renameSync;
// The Writer canonicalizes an existing output parent via fs.realpathSync;
// on macOS /var is often an alias for /private/var. Match the same target.
const canonicalFinal=path.join(fs.realpathSync(path.dirname(out)),path.basename(out));
const signal=tag=>{
  fs.writeSync(1,'I1_REAL_RECOVERY_CHECKPOINT '+tag+'\n');
};
const kill=tag=>{
  signal(tag);
  process.kill(process.pid,'SIGKILL');
  throw new Error('SYNTHETIC_TERMINATION_FAILED');
};
if(point==='AFTER_STAGE_CREATED'){
  fs.mkdtempSync=(prefix,...rest)=>{
    const created=originalMk(prefix,...rest);
    if(typeof prefix==='string'&&prefix.includes('.guard-i1-partial-'))kill(point);
    return created;
  };
}
fs.renameSync=(from,to,...rest)=>{
  const isTemp=typeof from==='string'&&path.basename(from).includes('.tmp-');
  const checksums=typeof to==='string'&&path.basename(to)==='bundle-checksums.json';
  const final=typeof to==='string'&&path.resolve(to)===canonicalFinal&&
    typeof from==='string'&&path.basename(from).startsWith('.guard-i1-partial-');
  if(final&&point==='EIO_BEFORE_FINAL_DIRECTORY_RENAME'){
    signal(point);
    const e=new Error('SYNTHETIC_INJECTED_EIO_BEFORE_NATIVE_COMMIT');
    e.code='EIO';throw e;
  }
  const r=originalRename(from,to,...rest);
  if(isTemp&&checksums&&point==='AFTER_CHECKSUM_INDEX_WRITTEN')kill(point);
  if(final&&point==='AFTER_FINAL_DIRECTORY_RENAME')kill(point);
  if(final&&point==='THROW_AFTER_FINAL_DIRECTORY_RENAME'){
    signal(point);
    const e=new Error('SYNTHETIC_AFTER_COMMIT_ACK_LOST');
    e.code='EIO';throw e;
  }
  return r;
};
const res=handleReviewPackSubcommand(['--pack',pack,'--out',out,'--format','json'],
 {guardVersion:'7.1.0-rc.0'});
signal('COMMAND_RETURNED_'+res.exitCode);
if(res.stdout)fs.writeSync(1,res.stdout);
if(res.stderr)fs.writeSync(2,res.stderr);
process.exit(res.exitCode);
