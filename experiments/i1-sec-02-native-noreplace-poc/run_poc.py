"""I1-SEC-02 native directory NOREPLACE adversarial PoC, synthetic-only.

Run: python run_poc.py --output <new receipt.json>
Workers: python run_poc.py --worker <owned-temp-parent> <index>
NO product integration, NO privileged operations, NO customer paths.
"""
from __future__ import annotations
import argparse
import ctypes
import errno
import hashlib
import json
import os
from pathlib import Path
import platform
import shutil
import subprocess
import sys
import tempfile
import time
import traceback
from native_bridge import NativeNoReplace, NotSupported, IS_LINUX, IS_MAC, IS_WIN, system_identity

BASELINE = "a1e6c84a9628430c3a6a8d242ab96f62de79d1f9"
ROOT_SHA = "3bad6d7fc69b64cdc7ef594edff97cfaeba62b0c"
class Blocked(Exception):
    pass

def digest(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def as_json(x):
    return json.dumps(x, ensure_ascii=False, sort_keys=True)

def fixture(base, label, *, source_kind="directory"):
    case = base / label
    case.mkdir()
    stage = case / "stage"
    if source_kind == "file":
        stage.write_text("source-data-for-"+label, encoding="utf8")
    else:
        stage.mkdir()
        (stage/"receipt.txt").write_text("source-data-for-"+label, encoding="utf8")
    return case, stage, case/"final"

def native_rejected(native, stage, final):
    result = native.rename(stage, final)
    assert result["ok"] is False, result
    assert result["no_fallback"] is True
    assert stage.exists(), "Refused rename must not consume source"
    return result

def run_case(receipt, label, func):
    row={"case_id":label,"status":"NOT_TESTED"}
    try:
        result=func()
        if isinstance(result,dict) and result.get("_observation"):
            row["status"]=result.pop("_observation")
        else:
            row["status"]="PASS_BOUNDED"
        row["evidence"]=result
    except Blocked as ex:
        row["status"]="BLOCKED_LIMITATION"
        row["reason"]=str(ex)
    except NotSupported as ex:
        row["status"]="UNSUPPORTED_FAIL_CLOSED"
        row["reason"]=str(ex)
    except Exception as ex:
        row["status"]="FAIL"
        row["reason"]=repr(ex)
        row["traceback"]=traceback.format_exc(limit=4)
    receipt["cases"].append(row)
    print("CASE",label,row["status"],as_json(row.get("evidence") or row.get("reason"))[:480],flush=True)

def worker_mode(parent, index):
    native=NativeNoReplace()
    source=Path(parent)/f"worker-{index:02d}"
    result=native.rename(source,Path(parent)/"final")
    print(json.dumps({"index":index,**result},sort_keys=True),flush=True)
    return 0

def main(output):
    native=NativeNoReplace()
    root=Path(tempfile.mkdtemp(prefix="guard-i1-sec02-native-")).resolve()
    receipt={"kind":"I1_SEC_02_NATIVE_NOREPLACE_POC","baseline_immutable_sha":BASELINE,
             "main_unchanged_reference":ROOT_SHA,"actual_test_head":os.environ.get("GITHUB_SHA","LOCAL_ISOLATED"),
             "generated_at_utc":__import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat(),
             "synthetic_only":True,"privilege_escalation":False,
             "production_guard_files_modified":False,"no_os_rename_fallback":True,
             "system":system_identity(root),"cases":[]}
    try:
        def n01():
            _,src,dst=fixture(root,"N01");dst.mkdir()
            r=native_rejected(native,src,dst)
            assert dst.is_dir() and list(dst.iterdir())==[]
            return r
        run_case(receipt,"N01",n01)

        def n02():
            _,src,dst=fixture(root,"N02");dst.mkdir()
            keep=dst/"foreign.txt";keep.write_text("DO_NOT_CLOBBER",encoding="utf8")
            before=digest(keep);r=native_rejected(native,src,dst)
            assert digest(keep)==before
            return {**r,"foreign_sha256_preserved":before}
        run_case(receipt,"N02",n02)

        def n03():
            _,src,dst=fixture(root,"N03");dst.write_text("DO_NOT_CLOBBER",encoding="utf8")
            before=digest(dst);r=native_rejected(native,src,dst)
            assert digest(dst)==before
            return {**r,"existing_file_sha256_preserved":before}
        run_case(receipt,"N03",n03)

        def n04():
            case,src,dst=fixture(root,"N04")
            decoy=case/"decoy";decoy.mkdir()
            keep=decoy/"foreign.txt";keep.write_text("SAFE",encoding="utf8")
            method="symlink"
            try:
                os.symlink(decoy,dst,target_is_directory=True)
            except OSError as err:
                if not IS_WIN:raise Blocked(f"Symlink unavailable in unprivileged runner: {err}")
                p=subprocess.run(["cmd","/d","/c","mklink","/J",str(dst),str(decoy)],
                                 capture_output=True,text=True,timeout=15)
                if p.returncode!=0:
                    raise Blocked(f"Unprivileged Windows symlink and junction unavailable: {err}; mklink {p.returncode}")
                method="junction"
            r=native_rejected(native,src,dst)
            assert digest(keep)==hashlib.sha256(b"SAFE").hexdigest()
            assert dst.is_symlink() or (IS_WIN and dst.exists())
            return {**r,"destination_kind":method,"decoy_preserved":True}
        run_case(receipt,"N04",n04)

        def concurrency(n,label):
            case=root/label
            case.mkdir()
            for i in range(n):
                p=case/f"worker-{i:02d}";p.mkdir()
                (p/"receipt.txt").write_text(f"WORKER-{i:02d}",encoding="utf8")
            processes=[subprocess.Popen([sys.executable,str(Path(__file__).resolve()),"--worker",str(case),str(i)],
                        stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
                        for i in range(n)]
            results=[]
            for p in processes:
                stdout,stderr=p.communicate(timeout=85)
                assert p.returncode==0,(p.returncode,stderr[-700:])
                rows=stdout.strip().splitlines()
                assert rows,repr(stderr[-350:])
                results.append(json.loads(rows[-1]))
            success=[x for x in results if x["ok"]]
            loser=[x for x in results if not x["ok"]]
            assert len(success)==1, as_json(results)
            assert len(loser)==n-1,as_json(results)
            assert all(x["no_fallback"] for x in results)
            final=case/"final"
            winner=(final/"receipt.txt").read_text(encoding="utf8")
            assert winner==f"WORKER-{success[0]['index']:02d}",winner
            assert all((case/f"worker-{x['index']:02d}"/"receipt.txt").exists() for x in loser)
            return {"api":results[0]["api"],"processes":n,"winners":1,"refused":len(loser),
                    "loser_error_codes":sorted(set(x["raw_error_code"] for x in loser)),
                    "winner_identity":winner,"no_loser_input_modified":True}
        run_case(receipt,"N05",lambda:concurrency(2,"N05"))
        run_case(receipt,"N06-8",lambda:concurrency(8,"N06-8"))
        run_case(receipt,"N06-32",lambda:concurrency(32,"N06-32"))

        def n07():
            _,src,dst=fixture(root,"N07")
            dst.mkdir();(dst/"old-marker").write_text("old",encoding="utf8")
            # A0 adversary removes initial placeholder, then creates a new
            # empty destination *before* the linearization-point syscall.
            shutil.rmtree(dst)
            dst.mkdir()
            new=(dst/"new-adversary-marker");new.write_text("keep",encoding="utf8")
            r=native_rejected(native,src,dst)
            assert new.read_text(encoding="utf8")=="keep"
            return {**r,"controlled_schedule":"attacker-removes-and-recreates-before-native-call",
                    "not_a_proof_of_all_interleavings":True}
        run_case(receipt,"N07",n07)

        def n08():
            _,src,dst=fixture(root,"N08")
            dst.mkdir()
            dst.rmdir() # adversary removes the target *before* syscall
            r=native.rename(src,dst)
            assert r["ok"] and (dst/"receipt.txt").exists()
            return {**r,"_observation":"OBSERVED_LIMITATION","goal":"G1: no target at the syscall means success is lawful"}
        run_case(receipt,"N08",n08)

        def n09():
            if IS_WIN:raise Blocked("Windows anchored API evaluated separately in N10")
            base=root/"N09";base.mkdir()
            original=base/"parent";original.mkdir()
            decoy=base/"decoy";decoy.mkdir()
            (original/"stage").mkdir()
            (original/"stage"/"receipt.txt").write_text("FD_PINNED",encoding="utf8")
            fd=native.open_parent(original)
            ino=os.fstat(fd).st_ino
            moved=base/"moved"
            try:
                # The hostile rename is a test-fixture operation, not publication.
                original.rename(moved)
                os.symlink(decoy,original,target_is_directory=True)
                r=native.rename_bound(fd,"stage",fd,"final")
                assert r["ok"],r
                assert (moved/"final"/"receipt.txt").read_text(encoding="utf8")=="FD_PINNED"
                assert not (decoy/"final").exists()
                assert os.stat(moved).st_ino==ino
                return {**r,"held_parent_inode":ino,"decoy_not_modified":True,
                        "external_path_original_now_points_to_decoy":True}
            finally:
                native.close_parent(fd)
        run_case(receipt,"N09",n09)

        def n10():
            if not IS_WIN:raise Blocked("Windows RootDirectory-only question")
            base=root/"N10";base.mkdir();parent=base/"parent";parent.mkdir()
            source=parent/"source";source.mkdir()
            (source/"receipt.txt").write_text("HANDLE",encoding="utf8")
            source_handle=native._win_open(source)
            parent_handle=native.open_parent(parent)
            try:
                r=native.win_rename_bound(source_handle,parent_handle,"final",cls=3)
            finally:
                native.CloseHandle(source_handle)
                native.close_parent(parent_handle)
            if not r["ok"]:
                raise Blocked("Native RootDirectory HANDLE was rejected; G3 NOT ESTABLISHED: "+as_json(r))
            assert (parent/"final"/"receipt.txt").read_text(encoding="utf8")=="HANDLE"
            return {**r,"root_directory_handle_used":True,
                    "_observation":"PASS_BOUNDED_G3_HANDLE_WITHOUT_RELINK"}
        run_case(receipt,"N10",n10)

        def n11():
            if not IS_LINUX:raise Blocked("Linux-only openat2")
            class OPEN_HOW(ctypes.Structure):
                _fields_=[("flags",ctypes.c_uint64),("mode",ctypes.c_uint64),
                          ("resolve",ctypes.c_uint64)]
            libc=ctypes.CDLL(None,use_errno=True)
            libc.syscall.restype=ctypes.c_long
            c=root/"N11";c.mkdir();(c/"safe").mkdir()
            os.symlink(root,c/"escape")
            dirfd=os.open(c,os.O_RDONLY|os.O_DIRECTORY)
            try:
                how=OPEN_HOW(getattr(os,"O_PATH",os.O_RDONLY)|os.O_CLOEXEC,0,
                             0x08|0x04|0x02) # RESOLVE_BENEATH + NO_SYMLINKS + NO_MAGICLINKS
                ctypes.set_errno(0)
                val=libc.syscall(ctypes.c_long(437),ctypes.c_int(dirfd),ctypes.c_char_p(b"escape"),
                                 ctypes.byref(how),ctypes.c_size_t(ctypes.sizeof(how)))
                err=ctypes.get_errno() if val<0 else 0
                if val>=0:os.close(val)
                assert val<0 and err in (errno.ELOOP,errno.EXDEV), (val,err)
                return {"api":"syscall(SYS_openat2=437)","resolve_flags":"RESOLVE_BENEATH|RESOLVE_NO_SYMLINKS|RESOLVE_NO_MAGICLINKS",
                        "syscall_result":val,"raw_errno":err,"error_name":errno.errorcode.get(err),
                        "symlink_escape_refused":True}
            finally:os.close(dirfd)
        run_case(receipt,"N11",n11)

        def n12():
            if not IS_MAC:raise Blocked("macOS-only APFS capability")
            _,src,dst=fixture(root,"N12")
            r=native.rename(src,dst)
            assert r["ok"],r
            return {**r,"actual_volume_identity":receipt["system"]["mount_fstype"],
                    "capability_proof":"The RENAME_EXCL native call actually succeeded on the test volume; not a claim about all APFS or SMB volumes"}
        run_case(receipt,"N12",n12)

        def n13():
            if not IS_WIN:raise Blocked("Windows-only FileRenameInfoEx")
            _,src,dst=fixture(root,"N13");dst.mkdir()
            r=native.rename(src,dst,win_class=22)
            if r["raw_error_code"]==87:
                raise Blocked("FileRenameInfoEx returned ERROR_INVALID_PARAMETER; older FileRenameInfo is tested as primary native API: "+as_json(r))
            assert not r["ok"],r
            assert src.exists() and dst.exists()
            return {**r,"native_class":"FileRenameInfoEx", "replace_flag_set":False}
        run_case(receipt,"N13",n13)

        def n14():
            if IS_WIN:raise Blocked("No speculative invalid FileRenameInfoEx flag test: unsupported-volume test requires another volume")
            _,src,dst=fixture(root,"N14")
            bad=0x80000000
            r=native.rename(src,dst,flag=bad)
            assert not r["ok"] and src.exists() and not dst.exists(),r
            return {**r,"_observation":"PASS_BOUNDED_INVALID_FLAG_ONLY","unsupported_filesystem_unavailable":True}
        run_case(receipt,"N14-invalid-flag",n14)
        run_case(receipt,"N14-unsupported-volume",lambda: (_ for _ in ()).throw(
            Blocked("No isolated unsupported kernel/filesystem volume mounted; NOT_TESTED, no fallback claimed")))

        def n15():
            if not IS_LINUX:raise Blocked("No separate writable test volume proven on this platform")
            if not Path("/dev/shm").is_dir():raise Blocked("No /dev/shm volume")
            other=Path(tempfile.mkdtemp(dir="/dev/shm",prefix="i1-sec02-crossvol-"))
            try:
                _,src,_=fixture(root,"N15")
                if os.stat(src.parent).st_dev == os.stat(other).st_dev:
                    raise Blocked("Two test roots have same device; cannot claim real EXDEV")
                r=native.rename(src,other/"final")
                assert not r["ok"] and r["raw_error_code"]==errno.EXDEV,r
                assert src.exists() and not (other/"final").exists()
                return {**r,"source_dev":os.stat(src.parent).st_dev,"destination_dev":os.stat(other).st_dev,
                        "real_cross_volume":True,"no_copy_delete_fallback":True}
            finally:shutil.rmtree(other,ignore_errors=True)
        run_case(receipt,"N15",n15)
        run_case(receipt,"N16",lambda: (_ for _ in ()).throw(Blocked(
            "Real EIO/EACCES/ENOSPC not induced; SEC-01 separate simulated fault tests are NOT native evidence")))
        run_case(receipt,"N17",lambda: (_ for _ in ()).throw(Blocked(
            "Physical disk-fill and unprovided Windows/macOS cross-volume are deliberately NOT_TESTED")))
        run_case(receipt,"N18",lambda: (_ for _ in ()).throw(Blocked(
            "Kill/recovery of complete Guard Review Bundle is beyond standalone native directory syscall PoC; NOT_TESTED")))

        def n19():
            _,src,dst=fixture(root,"N19")
            r=native.rename(src,dst);assert r["ok"],r
            manifest=dst/"receipt.txt";before=digest(manifest)
            manifest.write_text("MALICIOUS_SAME_USER_POSTPUBLISH_EDIT",encoding="utf8")
            after=digest(manifest)
            assert before!=after
            return {**r,"_observation":"OBSERVED_G4_UNPROTECTED",
                    "before_sha256":before,"after_sha256":after,
                    "conclusion":"No-replace does not protect content after publication"}
        run_case(receipt,"N19",n19)

        def n20():
            _,src,dst=fixture(root,"N20")
            source=src/"receipt.txt"
            source.write_text("SAME_USER_CAN_POISON_SOURCE",encoding="utf8")
            r=native.rename(src,dst);assert r["ok"],r
            assert (dst/"receipt.txt").read_text(encoding="utf8")=="SAME_USER_CAN_POISON_SOURCE"
            return {**r,"_observation":"OBSERVED_UNTRUSTED_SOURCE",
                    "conclusion":"Success of no-replace syscall does not attest source authenticity"}
        run_case(receipt,"N20",n20)

        run_case(receipt,"N21",lambda: (_ for _ in ()).throw(Blocked(
            "No native Node-API addon built, signed, distributed, or installed; Python ctypes is a research bridge only")))
        run_case(receipt,"N22",lambda: (_ for _ in ()).throw(Blocked(
            "No production npm package modified or built by this native-only PoC")))
        def n23():
            repo_root=Path(__file__).resolve().parents[2]
            p=subprocess.run(["git","diff","--name-only",BASELINE,"HEAD"],
                             cwd=repo_root,capture_output=True,text=True,timeout=20)
            if p.returncode!=0:raise Blocked("Repository historical baseline inaccessible for static diff")
            names=[x for x in p.stdout.splitlines() if x.strip()]
            assert names
            assert all(x.startswith("experiments/i1-sec-02-native-noreplace-poc/") or
                       x==".github/workflows/guard-i1-sec-02-native-poc.yml" for x in names),names
            return {"_observation":"PASS_STATIC_BOUNDARY_ONLY","changed_paths":names,
                    "full_guard_regression":"NOT_RUN_FOR_NATIVE_POC"}
        run_case(receipt,"N23",n23)

        def n24():
            if IS_WIN:raise Blocked("RootDirectory anchor and parent rebind on Windows NOT ESTABLISHED; see N10")
            return {"_observation":"OBSERVED_G3_EXTERNAL_PATH_LIMIT",
                    "refer_to":"N09","meaning":"FD-bound rename targets original directory object; attacker may change how external pathname resolves"}
        run_case(receipt,"N24",n24)

    finally:
        statuses=[x["status"] for x in receipt["cases"]]
        receipt["counts"]={k:statuses.count(k) for k in sorted(set(statuses))}
        receipt["goals"]={
            "G1_atomic_no_clobber":"PASS_BOUNDED" if all(
                x["status"]=="PASS_BOUNDED" for x in receipt["cases"] if x["case_id"] in ("N01","N02","N03","N05","N06-8","N06-32","N07")) else "NOT_ESTABLISHED",
            "G2_final_name_no_TOCTOU":"PASS_BOUNDED_FOR_NATIVE_OPERATION" if all(
                x["status"]=="PASS_BOUNDED" for x in receipt["cases"] if x["case_id"] in ("N01","N05","N06-32")) else "NOT_ESTABLISHED",
            "G3_parent_object_binding":"PASS_BOUNDED_POSIX_ONLY" if
                not IS_WIN and any(x["case_id"]=="N09" and x["status"]=="PASS_BOUNDED" for x in receipt["cases"]) else "NOT_ESTABLISHED",
            "G4_post_publish_immutability":"NOT_ESTABLISHED_AND_DEMONSTRABLY_FALSE_FOR_SAME_USER"}
        receipt["conclusion_ceiling"]="Native syscall/flags proof only on this runner and its test filesystem. No Guard integration, institutional assurance, or sustained same-user immutability."
        receipt["root_cleanup_attempted"]=True
        Path(output).parent.mkdir(parents=True,exist_ok=True)
        Path(output).write_text(json.dumps(receipt,ensure_ascii=False,indent=2,sort_keys=True)+"\n",encoding="utf8")
        shutil.rmtree(root,ignore_errors=True)
    print("SUMMARY",json.dumps({"counts":receipt["counts"],"goals":receipt["goals"]},ensure_ascii=False),flush=True)
    # A platform may lack optional rooted operations, which remains a documented
    # limitation; any failed required test or G1 regression fails the CI.
    return 1 if receipt["counts"].get("FAIL",0) or receipt["goals"]["G1_atomic_no_clobber"]!="PASS_BOUNDED" else 0

if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--output",type=Path)
    parser.add_argument("--worker",type=Path)
    parser.add_argument("index",nargs="?")
    a=parser.parse_args()
    if a.worker is not None:
        if a.index is None:parser.error("--worker requires index")
        sys.exit(worker_mode(a.worker,int(a.index)))
    if a.output is None:parser.error("--output must be specified")
    sys.exit(main(a.output))
