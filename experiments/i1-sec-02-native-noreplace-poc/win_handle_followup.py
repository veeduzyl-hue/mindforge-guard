"""I1-SEC-02 follow-on: Windows HANDLE-bound native NOREPLACE.

Research-only. No Guard import or production effect. All renames run exclusively
on freshly created synthetic temp directories. FileRenameInformation is 10 for
NtSetInformationFile, distinct from Win32 FileRenameInfo (3).
"""
from __future__ import annotations
import ctypes
import hashlib
import json
import os
from pathlib import Path
import platform
import shutil
import struct
import sys
import tempfile
import traceback
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone

from native_bridge import NativeNoReplace, IS_WIN

NT_FILE_RENAME_INFORMATION = 10
STATUS_OBJECT_NAME_COLLISION = 0xC0000035
STATUS_OBJECT_NAME_EXISTS = 0x40000000
STATUS_INVALID_PARAMETER = 0xC000000D
STATUS_ACCESS_DENIED = 0xC0000022
STATUS_NOT_SAME_DEVICE = 0xC00000D4
STATUS_PENDING = 0x00000103

class IOStatusBlock(ctypes.Structure):
    _fields_ = [("StatusOrPointer", ctypes.c_void_p), ("Information", ctypes.c_size_t)]

class NativeNtRename:
    def __init__(self):
        if not IS_WIN:
            raise RuntimeError("Windows-only")
        self.native = NativeNoReplace()
        self.ntdll = ctypes.WinDLL("ntdll", use_last_error=True)
        self.setinfo = self.ntdll.NtSetInformationFile
        self.setinfo.argtypes = [ctypes.c_void_p, ctypes.POINTER(IOStatusBlock),
                                 ctypes.c_void_p, ctypes.c_ulong, ctypes.c_int]
        self.setinfo.restype = ctypes.c_long
        self.rtl = self.ntdll.RtlNtStatusToDosError
        self.rtl.argtypes = [ctypes.c_long]
        self.rtl.restype = ctypes.c_ulong
        self.get_final = self.native.kernel.GetFinalPathNameByHandleW
        self.get_final.argtypes = [ctypes.c_void_p, ctypes.c_wchar_p, ctypes.c_ulong, ctypes.c_ulong]
        self.get_final.restype = ctypes.c_ulong

    def handle_path(self, handle):
        buf = ctypes.create_unicode_buffer(32768)
        n = self.get_final(handle, buf, len(buf), 0)
        return buf.value if n > 0 and n < len(buf) else f"UNAVAILABLE_WIN32_{ctypes.get_last_error()}"

    def open_source(self, path):
        return self.native._win_open(Path(path))

    def open_parent(self, path):
        return self.native.open_parent(Path(path))

    def close(self, handle):
        self.native.CloseHandle(handle)

    def call(self, source_handle, parent_handle, target_basename):
        if (not target_basename or target_basename in (".", "..") or
            "/" in target_basename or "\\" in target_basename or "\x00" in target_basename):
            raise ValueError("Only simple relative destination basenames are allowed")
        encoded = target_basename.encode("utf-16-le")
        offset = self.native.HEADER.FileName.offset
        size = max(ctypes.sizeof(self.native.HEADER), offset + len(encoded) + 2)
        buf = ctypes.create_string_buffer(size)
        hdr = ctypes.cast(buf, ctypes.POINTER(self.native.HEADER)).contents
        hdr.Flags = 0  # ReplaceIfExists=FALSE, never call replace mode.
        hdr.RootDirectory = parent_handle
        hdr.FileNameLength = len(encoded)
        ctypes.memmove(ctypes.addressof(buf) + offset, encoded, len(encoded))
        iosb = IOStatusBlock()
        ctypes.set_last_error(0)
        ret = self.setinfo(source_handle, ctypes.byref(iosb), buf, size, NT_FILE_RENAME_INFORMATION)
        status = int(ret) & 0xffffffff
        if status == STATUS_PENDING:
            # No asynchronous rename is assumed by this PoC; fail closed.
            return {"ok":False,"status_hex":f"0x{status:08X}","pending_not_waited":True,
                    "api":"ntdll!NtSetInformationFile/FileRenameInformation(10)"}
        ok = status == 0
        return {
            "api":"ntdll!NtSetInformationFile/FileRenameInformation(10)",
            "ok":ok,"status_hex":f"0x{status:08X}",
            "status_name": ("STATUS_SUCCESS" if ok else
                            "STATUS_OBJECT_NAME_COLLISION" if status==STATUS_OBJECT_NAME_COLLISION else
                            "STATUS_INVALID_PARAMETER" if status==STATUS_INVALID_PARAMETER else
                            "STATUS_ACCESS_DENIED" if status==STATUS_ACCESS_DENIED else
                            "STATUS_NOT_SAME_DEVICE" if status==STATUS_NOT_SAME_DEVICE else
                            "NTSTATUS_OTHER"),
            "win32_mapping":int(self.rtl(ctypes.c_long(ret))) if not ok else 0,
            "file_info_class":10, "replace_if_exists":False,
            "root_directory_handle_present":bool(parent_handle),
            "relative_basename":target_basename,
            "struct_size":ctypes.sizeof(self.native.HEADER),
            "filename_offset":offset, "buffer_bytes":size,
            "file_name_length_bytes":len(encoded),
            "no_path_fallback":True
        }

def run(output):
    native = NativeNtRename()
    root = Path(tempfile.mkdtemp(prefix="guard-i1-winhandle-")).resolve()
    rows=[]
    def fixture(name, occupied=False):
        p=root/name; p.mkdir()
        src=p/"source-parent";src.mkdir()
        target=p/"target-parent";target.mkdir()
        stage=src/"stage";stage.mkdir()
        (stage/"receipt.txt").write_text("SYNTHETIC_SOURCE_"+name,encoding="utf-8")
        dst=target/"final"
        if occupied:
            dst.mkdir();(dst/"foreign.txt").write_text("DO_NOT_CLOBBER",encoding="utf-8")
        return p,stage,target,dst

    def one(test,fun):
        try:
            evidence, status=fun()
            row={"id":test,"status":status,"evidence":evidence}
        except Exception as ex:
            row={"id":test,"status":"FAIL","error":repr(ex),"trace":traceback.format_exc(limit=3)}
        rows.append(row)
        print(test,row["status"],json.dumps(row.get("evidence") or row.get("error"),ensure_ascii=False,sort_keys=True)[:900],flush=True)

    def call_for(stage,parent,dest="final"):
        sh=native.open_source(stage)
        ph=native.open_parent(parent)
        try:
            rv=native.call(sh,ph,dest)
            rv["target_handle_path_at_call"]=native.handle_path(ph)
            return rv
        finally:
            native.close(sh)
            native.close(ph)

    def n01():
        _,stage,parent,dst=fixture("N01")
        r=call_for(stage,parent)
        assert r["ok"] and not stage.exists() and (dst/"receipt.txt").exists(),r
        assert r["root_directory_handle_present"] and r["no_path_fallback"]
        return r,"PASS_BOUNDED_G3"
    one("W01_NT_ROOT_HANDLE_FRESH_TARGET",n01)

    def n02():
        _,stage,parent,dst=fixture("N02",occupied=True)
        old=(dst/"foreign.txt").read_bytes()
        r=call_for(stage,parent)
        assert not r["ok"] and r["status_hex"]==f"0x{STATUS_OBJECT_NAME_COLLISION:08X}",r
        assert stage.exists() and (dst/"foreign.txt").read_bytes()==old,r
        return {**r,"foreign_digest_preserved":hashlib.sha256(old).hexdigest()},"PASS_BOUNDED_G1_G3"
    one("W02_NT_ROOT_HANDLE_EXISTING_TARGET_REJECTED",n02)

    def n03():
        _,stage,parent,dst=fixture("N03")
        sh=native.open_source(stage)
        ph=native.open_parent(parent)
        try:
            # This compares the original Win32 behavior; error 87 is not a success.
            r=native.native.win_rename_bound(sh,ph,"final",cls=3)
            evidence={**r,"primary_NT_path_already_tested":True}
            assert stage.exists() and not dst.exists()
            if not r["ok"]:
                return evidence,"OBSERVED_WIN32_WRAPPER_LIMITATION"
            return evidence,"OBSERVED_WIN32_WRAPPER_SUCCESS"
        finally:
            native.close(sh);native.close(ph)
    one("W03_WIN32_CLASS3_CONTROL",n03)

    def n04():
        p,stage,parent,dst=fixture("N04")
        decoy=p/"decoy";decoy.mkdir()
        (decoy/"decoy.txt").write_text("KEEP")
        moved=p/"relocated-original"
        sh=native.open_source(stage)
        ph=native.open_parent(parent)
        before=native.handle_path(ph)
        try:
            # Attacker fixture moves the pathname, NOT the published directory.
            os.rename(parent,moved)
            os.rename(decoy,parent)
            after=native.handle_path(ph)
            r=native.call(sh,ph,"final")
            assert r["ok"],r
            assert (moved/"final"/"receipt.txt").exists()
            assert not (parent/"final").exists()
            assert (parent/"decoy.txt").read_text()=="KEEP"
            return {**r,"parent_handle_before":before,"parent_handle_after":after,
                    "old_parent_relocated":True,"decoy_not_modified":True,
                    "attacker_pathname_swap":True},"PASS_BOUNDED_G3_PARENT_SWAP"
        finally:
            native.close(sh);native.close(ph)
    one("W04_NT_PARENT_NAME_REPLACEMENT",n04)

    def n05():
        p=root/"N05";p.mkdir();target=p/"target-parent";target.mkdir()
        source_dirs=[]
        for i in range(8):
            d=p/f"src-{i:02d}";d.mkdir()
            stage=d/"stage";stage.mkdir()
            (stage/"receipt.txt").write_text(f"W{i:02d}")
            source_dirs.append(stage)
        def work(i):
            return {"i":i,**call_for(source_dirs[i],target)}
        with ThreadPoolExecutor(max_workers=8) as executor:
            results=list(executor.map(work,range(8)))
        winners=[r for r in results if r["ok"]]
        losers=[r for r in results if not r["ok"]]
        assert len(winners)==1 and len(losers)==7,results
        assert all(r["status_hex"]==f"0x{STATUS_OBJECT_NAME_COLLISION:08X}" for r in losers),results
        assert (target/"final"/"receipt.txt").read_text()==f"W{winners[0]['i']:02d}"
        assert all(source_dirs[r["i"]].exists() for r in losers)
        return {"winners":1,"rejected":7,"failure_status":"STATUS_OBJECT_NAME_COLLISION",
                "no_overwrite":True,"source_preserved":True},"PASS_BOUNDED_G1_G3_CONCURRENT"
    one("W05_EIGHT_CONCURRENT_HANDLE_BOUND_CALLS",n05)

    def n06():
        _,stage,parent,dst=fixture("N06")
        r=call_for(stage,parent)
        assert r["ok"] and dst.is_dir(),r
        path=dst/"receipt.txt"
        before=hashlib.sha256(path.read_bytes()).hexdigest()
        path.write_text("MALICIOUS_SAME_USER_EDIT")
        after=hashlib.sha256(path.read_bytes()).hexdigest()
        assert before!=after
        return {"before":before,"after":after,"native_no_replace_protects_after_rename":False},"OBSERVED_G4_UNPROTECTED"
    one("W06_POST_PUBLISH_SAME_USER_EDIT",n06)

    result={
        "kind":"I1_SEC_02_WINDOWS_ROOT_HANDLE_FOLLOWUP",
        "created_at_utc":datetime.now(timezone.utc).isoformat(),
        "observed_platform":platform.platform(),"python":platform.python_version(),
        "source_poc_sha":"ef69a2702cc0ed8aaff07729331070e80bdb54d4",
        "experiment_head":os.getenv("GITHUB_SHA","UNPINNED_LOCAL"),
        "privileges":"ordinary CI account; no elevation requested",
        "synthetic_only":True,"no_guard_runtime_changes":True,
        "native_kernel_function":"ntdll!NtSetInformationFile",
        "nt_information_class":10,
        "notes":"Win32 FileRenameInfo Class 3 and Native FileRenameInformation Class 10 are distinct. Raw NTSTATUS must not be interpreted as a POSIX errno.",
        "cases":rows,
        "goals":{
            "G1_root_handle_collision_no_replace":"PASS_BOUNDED" if any(r["id"].startswith("W02") and r["status"]=="PASS_BOUNDED_G1_G3" for r in rows) else "NOT_ESTABLISHED",
            "G3_Windows_handle_anchoring":"PASS_BOUNDED" if all(any(r["id"].startswith(prefix) and r["status"].startswith("PASS_BOUNDED") for r in rows) for prefix in ("W01","W04","W05")) else "NOT_ESTABLISHED",
            "G4_post_publish_immutability":"NOT_ESTABLISHED"
        },
        "conclusion_ceiling":"Native Windows handle-bound directory rename on this test NTFS volume only. No Node addon or Guard product admission."
    }
    output=Path(output);output.parent.mkdir(parents=True,exist_ok=True)
    output.write_text(json.dumps(result,ensure_ascii=False,indent=2,sort_keys=True)+"\n",encoding="utf-8")
    shutil.rmtree(root,ignore_errors=True)
    print("RESULT",json.dumps({"goals":result["goals"],"statuses":{x["id"]:x["status"] for x in rows}},ensure_ascii=False),flush=True)
    return 1 if any(r["status"]=="FAIL" for r in rows) or result["goals"]["G3_Windows_handle_anchoring"]!="PASS_BOUNDED" or result["goals"]["G1_root_handle_collision_no_replace"]!="PASS_BOUNDED" else 0

if __name__=="__main__":
    if not IS_WIN:
        print("Windows only",file=sys.stderr);sys.exit(2)
    if len(sys.argv)!=2:
        print("Usage: python win_handle_followup.py <receipt.json>",file=sys.stderr);sys.exit(2)
    sys.exit(run(sys.argv[1]))
