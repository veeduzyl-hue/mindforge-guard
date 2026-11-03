#!/usr/bin/env python3
"""Build A2 standalone sample ZIP from the fixed repository fixture; no dependencies."""
import hashlib,json,os,stat,zipfile
from pathlib import Path
from datetime import datetime
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'examples/single-agent-governance-pack/hr-self-service-agent'
OUT=ROOT/'downloads'
NAME='mindforge-guard-hr-self-service-sample-pack-v0.1.zip'
TREE='f943fc9ced5f3087e70ecebcdf1cc7a5b323cce1'
COMMIT='46d77530a28b0a28d02e1c7ba29ccfa52e265849'
EXPECTED={
'README.md':'65c89252030ae6b969651e544eb84500bf7159dd',
'action-boundary.yaml':'baba3e7179d876661da48916c089c068f185913e',
'agent-profile.json':'6844af265ad8472963867f8cf6e226b6502f78dd',
'data-sources.yaml':'e17701b296860f8ee8bd6be9d67df96777daaf11',
'evidence/run-record.json':'79d2d90fabff2c68e3a69e82c85551a5e6605fa8',
'evidence/sample-output.json':'8c64014440c247816dff19e175b844f4462dedf1',
'manifest.json':'865b6cac70518ec5846dce19fb0b8ff0db8cb031',
'review-standards.md':'ec724b5f606ebaf6399a7351d476c0141ebf6e58',
'snapshot.json':'ac01d2d50fadcc74cd84dd0f4605e55cc6ae417c',
'task-scope.md':'ac9f702548d94457dc9921431875b13e212e2170',
'tools.yaml':'0c18dddf4ddcd07a499fec1a44b4bcafa69ad495'}
def gitblob(b): return hashlib.sha1(('blob '+str(len(b))+'\0').encode()+b).hexdigest()
def main():
 OUT.mkdir(exist_ok=True)
 observed={p.relative_to(SOURCE).as_posix() for p in SOURCE.rglob('*') if p.is_file() and not p.is_symlink()}
 if observed!=set(EXPECTED): raise SystemExit('FAIL: source file inventory drift')
 payloads={}
 for rel,sha in EXPECTED.items():
  p=SOURCE/rel
  if p.is_symlink() or not p.is_file(): raise SystemExit('FAIL: unsafe/missing '+rel)
  b=p.read_bytes()
  if gitblob(b)!=sha: raise SystemExit('FAIL: source blob changed '+rel)
  payloads[rel]=b
 with zipfile.ZipFile(OUT/NAME,'w',compression=zipfile.ZIP_STORED,allowZip64=False) as z:
  for rel,b in sorted(payloads.items()):
   info=zipfile.ZipInfo('hr-self-service-agent/'+rel,(1980,1,1,0,0,0))
   info.create_system=3; info.external_attr=(stat.S_IFREG|0o644)<<16; info.compress_type=zipfile.ZIP_STORED
   z.writestr(info,b)
 raw=(OUT/NAME).read_bytes(); digest=hashlib.sha256(raw).hexdigest()
 manifest={'artifact_version':'v0.1','archive':NAME,'archive_bytes':len(raw),'archive_sha256':digest,'source_commit':COMMIT,'source_pack_tree':TREE,'synthetic_only':True,'production_assurance':False,'files':[{'path':k,'bytes':len(v),'git_blob_sha1':EXPECTED[k],'sha256':hashlib.sha256(v).hexdigest()} for k,v in sorted(payloads.items())]}
 (OUT/(NAME+'.manifest.json')).write_text(json.dumps(manifest,indent=2)+'\\n',encoding='utf8')
 (OUT/(NAME+'.sha256')).write_text(digest+'  '+NAME+'\\n',encoding='ascii')
 print('PASS: built '+NAME+' '+str(len(raw))+' bytes sha256='+digest)
if __name__=='__main__': main()
