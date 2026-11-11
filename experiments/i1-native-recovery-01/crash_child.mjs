// Child process for deterministic owned-temp checkpoint termination only.
import {publishSyntheticReview} from './recovery.mjs';
if(!process.argv[2]||!process.argv[3]||!process.argv[4])process.exit(2);
if(process.env.I1_RECOVERY_CRASH_FIXTURE!=='1'||process.env.I1_RECOVERY_ALLOW_PUBLISH!=='1'){
  process.stderr.write('Crash simulation disabled without explicit synthetic-only gates\n');
  process.exit(3);
}
const ret=publishSyntheticReview({root:process.argv[2],name:process.argv[3],
  expectedBinarySha256:process.argv[4]});
process.stdout.write('I1_RECOVERY_CHILD_RETURN '+JSON.stringify(ret)+'\n');
