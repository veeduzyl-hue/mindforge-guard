#!/usr/bin/env python3
"""Verify A2 sample archive, manifest, fixed source Git blobs and safe ZIP paths."""
import hashlib,json,stat,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; D=ROOT/'downloads'; NAME='mindforge-guard-hr-self-service-sample-pack-v0.1.zip'
def gitblob(b): return hashlib.sha1(('blob '+str(len(b))+'\\0').encode()+b).hexdigest()
def main():
 zpath=D/NAME; raw=zpath.read_bytes(); sha=hashlib.sha256(raw).hexdigest()
 m=json.loads((D/(NAME+'.manifest.json')).read_text(encoding='utf8'))
 if m['archive_sha256']!=sha or m['archive_bytes']!=len(raw): raise SystemExit('FAIL: archive digest/length mismatch')
 if (D/(NAME+'.sha256')).read_text().split()[0]!=sha: raise SystemExit('FAIL: sha256 sidecar mismatch')
 with zipfile.ZipFile(zpath) as z:
  names=z.namelist()
  if len(names)!=11 or len(names)!=len(set(names)): raise SystemExit('FAIL: file count/duplicates')
  for n in names:
   p=Path(n)
   if p.is_absolute() or '..' in p.parts or not n.startswith('hr-self-service-agent/'): raise SystemExit('FAIL: unsafe path '+n)
   i=z.getinfo(n)
   if ((i.external_attr>>16)&0o170000)==stat.S_IFLNK: raise SystemExit('FAIL: symlink')
  for f in m['files']:
   n='hr-self-service-agent/'+f['path']; b=z.read(n)
   if hashlib.sha256(b).hexdigest()!=f['sha256']: raise SystemExit('FAIL: member hash '+n)
   if gitblob(b)!=f['git_blob_sha1']: raise SystemExit('FAIL: source git blob '+n)
 print('PASS: 11 files; archive and all member hashes verified')
if __name__=='__main__': main()
