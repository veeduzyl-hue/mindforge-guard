// Child process used only by the isolated synthetic 32-way race test.
import path from 'node:path';
import {nativeCommit} from './load.mjs';
if(!process.argv[2])process.exit(2);
const {root,sourceName,destName,binarySha256}=JSON.parse(process.argv[2]);
const r=nativeCommit({enabled:true,mode:'SYNTHETIC_ONLY',fixtureRoot:root,
 sourceParent:path.join(root,'sources'),sourceName,
 destinationParent:path.join(root,'target'),destinationName:destName,
 expectedBinarySha256:binarySha256});
process.stdout.write(JSON.stringify(r)+'\n');
process.exit(0);
