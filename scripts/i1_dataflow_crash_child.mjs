// Test-only forced termination after snapshot; synthetic source marker must
// reside outside Pack to keep the I-1 allowlist exactly unchanged.
import fs from 'node:fs';
import path from 'node:path';
import {preflightReview,takeReviewSnapshot} from '../packages/guard/src/cli/review_bundle_writer.mjs';
const [pack,out]=process.argv.slice(2);
if(process.env.I1_DATAFLOW_CRASH_TEST!=='1'||!pack||!out||!path.isAbsolute(pack)||!path.isAbsolute(out))process.exit(2);
if(!fs.existsSync(path.join(path.dirname(pack),'.I1_SYNTHETIC_CRASH_MARKER')))process.exit(3);
const ctx=takeReviewSnapshot(preflightReview(pack,out));
process.stdout.write('I1_DATAFLOW_STAGE_CREATED '+path.basename(ctx.stage)+'\n');
process.kill(process.pid,'SIGKILL');
process.exit(99);
