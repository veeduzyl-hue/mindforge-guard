#!/usr/bin/env python3
"""Run Pack Validate, Report Preview and English HTML renderer from extracted standalone ZIP."""
import hashlib,json,subprocess,sys,tempfile,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; CLI=ROOT/'packages/guard/bin/guard.mjs'; ZIP=ROOT/'downloads/mindforge-guard-hr-self-service-sample-pack-v0.1.zip'
def run(*args,expected=0):
 p=subprocess.run(['node',str(CLI),*map(str,args)],cwd=ROOT,capture_output=True,timeout=120)
 if p.returncode!=expected: raise SystemExit(f'FAIL exit={p.returncode} expected={expected} args={args} stderr={p.stderr[:500]!r}')
 return p.stdout
def main():
 with tempfile.TemporaryDirectory(prefix='A2 first report ') as td:
  d=Path(td); z=zipfile.ZipFile(ZIP); z.extractall(d); pack=d/'hr-self-service-agent'
  v=json.loads(run('pack','validate','--pack',pack,'--preview','--json'))
  assert v['validation_status']=='valid_with_no_omissions'
  raw=run('report','single-agent','--pack',pack,'--preview','--json'); report=json.loads(raw)
  assert report['report_mode']=='preview' and report['review_posture']=='ready_for_review'
  assert report['deterministic_hash']==v['deterministic_pack_hash']
  src=d/'report.json'; src.write_bytes(raw); before=hashlib.sha256(raw).hexdigest()
  out=d/'report.html'; run('report','render','--input',src,'--out',out,'--format','html')
  html=out.read_text(encoding='utf8')
  for marker in ['<html lang="en">','Business owner','Technical reviewer','Governance / risk reviewer','No operational authority']: assert marker in html
  assert 'sha256:'+before in html and '<script' not in html
  assert hashlib.sha256(src.read_bytes()).hexdigest()==before
  second=d/'second.html'; run('report','render','--input',src,'--out',second,'--format','html'); assert out.read_bytes()==second.read_bytes()
  run('report','render','--input',src,'--out',out,'--format','html',expected=4)
  print(json.dumps({'status':'PASS_BOUNDED','platform':sys.platform,'pack_validation':v['validation_status'],'report_posture':report['review_posture'],'pack_report_hash_match':True,'html_sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'source_json_unchanged':True,'repeatable_html':True,'overwrite_refused':True,'npm_release':'NOT_PERFORMED'},indent=2))
if __name__=='__main__': main()
