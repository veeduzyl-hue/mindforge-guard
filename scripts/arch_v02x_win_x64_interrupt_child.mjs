// Exact synthetic-only interruption of actual I-1 staging on Windows Server x64.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {preflightReview,takeReviewSnapshot} from '../packages/guard/src/cli/review_bundle_writer.mjs';
const [pack,out]=process.argv.slice(2);
if(process.platform!=='win32'||process.arch!=='x64'||process.env.GITHUB_ACTIONS!=='true'||
   process.env.ARCH_V02X_X64_CRASH_SYNTHETIC_ONLY!=='1'||!pack||!out||!path.isAbsolute(pack)||!path.isAbsolute(out)){
  throw Error('UNAUTHORIZED_WIN_X64_CRASH_CHILD');
}
const parent=path.dirname(out);
assert.equal(fs.readFileSync(path.join(parent,'.I1_WIN_PRIVATE_STAGE_SYNTHETIC_ONLY'),'utf8'),'I1_REAL_WRITER_WIN_ACL_SYNTHETIC_ONLY\n');
const pre=preflightReview(pack,out);
const ctx=takeReviewSnapshot(pre);
assert.equal(ctx.rawSourcePersisted,false);
assert(fs.existsSync(ctx.stage));
fs.writeSync(1,'ARCH_X64_NATIVE_STAGE_CREATED_BEFORE_INTERRUPT\n');
process.kill(process.pid,'SIGKILL');
throw Error('SYNTHETIC_TERMINATION_FAILED');
