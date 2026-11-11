// Intentional crash helper for disposable synthetic fixture directories only.
import fs from 'node:fs';
import path from 'node:path';
const root=process.argv[2];
if(!root||!path.isAbsolute(root)||process.env.I1_NATIVE_SPIKE_CRASH_TEST!=='1'){
  process.stderr.write('Synthetic crash test not authorized\n');process.exit(2);
}
const rp=fs.realpathSync(root);
if(fs.readFileSync(path.join(rp,'.i1-native-spike-synthetic-only'),'utf8')!=='I1_NATIVE_SPIKE_SYNTHETIC_FIXTURE_V01\n'){
  process.stderr.write('Missing synthetic test marker\n');process.exit(3);
}
const stage=fs.mkdtempSync(path.join(rp,'.guard-i1-partial-crash-'));
fs.chmodSync(stage,0o700);
const privateDir=path.join(stage,'.private-source');
fs.mkdirSync(privateDir,{mode:0o700});
fs.writeFileSync(path.join(privateDir,'synthetic.txt'),'SYNTHETIC_TEST_ONLY_NO_CUSTOMER_DATA',{mode:0o600,flag:'wx'});
fs.writeSync(1,'SYNTHETIC_CRASH_FIXTURE_READY\n');
process.kill(process.pid,'SIGKILL');
process.exit(99);
