import {createPrivateStage} from './load.mjs';
const {root,parent,name,binarySha256}=JSON.parse(process.argv[2]||'{}');
const ret=createPrivateStage({enabled:true,mode:'SYNTHETIC_ONLY',root,parent,name,binarySha256});
process.stdout.write(JSON.stringify(ret)+'\n');
