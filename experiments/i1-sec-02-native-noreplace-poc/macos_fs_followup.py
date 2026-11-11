"""I1-SEC-02 follow-on: Darwin native statfs/fstatfs volume identity.

Bound to the exact synthetic directory on which renameatx_np(RENAME_EXCL)
is tested. Cross-check user-visible /sbin/mount + diskutil; never infer APFS
from the GitHub runner label. No Guard or system settings are changed.
"""
from __future__ import annotations
import ctypes
import hashlib
import json
import os
from pathlib import Path
import platform
import plistlib
import re
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from native_bridge import NativeNoReplace, IS_MAC

class FSID(ctypes.Structure):
    _fields_=[("val",ctypes.c_int32*2)]

class DarwinStatfs(ctypes.Structure):
    # 64-bit user-space XNU sys/mount.h __DARWIN_STRUCT_STATFS64.
    _fields_=[
        ("f_bsize",ctypes.c_uint32),("f_iosize",ctypes.c_int32),
        ("f_blocks",ctypes.c_uint64),("f_bfree",ctypes.c_uint64),
        ("f_bavail",ctypes.c_uint64),("f_files",ctypes.c_uint64),
        ("f_ffree",ctypes.c_uint64),("f_fsid",FSID),
        ("f_owner",ctypes.c_uint32),("f_type",ctypes.c_uint32),
        ("f_flags",ctypes.c_uint32),("f_fssubtype",ctypes.c_uint32),
        ("f_fstypename",ctypes.c_char*16),
        ("f_mntonname",ctypes.c_char*1024),
        ("f_mntfromname",ctypes.c_char*1024),
        ("f_flags_ext",ctypes.c_uint32),("f_reserved",ctypes.c_uint32*7)
    ]

def as_name(raw):
    return bytes(raw).split(b"\x00",1)[0].decode("utf-8","replace")

def value(s):
    return {
      "fstypename":as_name(s.f_fstypename),
      "mount_point":as_name(s.f_mntonname),
      "mount_source":as_name(s.f_mntfromname),
      "fsid":list(s.f_fsid.val),
      "owner":int(s.f_owner),"f_type":int(s.f_type),
      "f_subtype":int(s.f_fssubtype),
      "block_size":int(s.f_bsize),
      "statfs_struct_bytes":ctypes.sizeof(DarwinStatfs),
      "fstypename_offset":DarwinStatfs.f_fstypename.offset,
    }

def call_statfs(statfs_function, path):
    stat=DarwinStatfs()
    ctypes.set_errno(0)
    rc=statfs_function(os.fsencode(path),ctypes.byref(stat))
    if rc!=0:raise OSError(ctypes.get_errno(),"statfs failed for actual synthetic path")
    return value(stat)

def call_fstatfs(fstatfs_function, path):
    fd=os.open(path,os.O_RDONLY|os.O_DIRECTORY|getattr(os,"O_CLOEXEC",0))
    try:
        stat=DarwinStatfs()
        ctypes.set_errno(0)
        rc=fstatfs_function(fd,ctypes.byref(stat))
        if rc!=0:raise OSError(ctypes.get_errno(),"fstatfs failed for native directory fd")
        return value(stat)
    finally:os.close(fd)

def get_mount_record(mountpoint):
    p=subprocess.run(["/sbin/mount"],capture_output=True,text=True,timeout=12)
    if p.returncode!=0:return {"available":False,"exit_code":p.returncode}
    records=[]
    for line in p.stdout.splitlines():
        match=re.match(r"^(.*?) on (.*?) \((.*?)\)$",line)
        if not match:continue
        if match.group(2)==mountpoint:
            records.append({"device":match.group(1),"mount_point":match.group(2),
                            "options":match.group(3).split(","),"raw_line":line[:480]})
    return {"available":bool(records),"matched_records":records,"mount_records_scanned":len(p.stdout.splitlines())}

def get_diskutil_record(mountpoint):
    try:
        p=subprocess.run(["/usr/sbin/diskutil","info","-plist",mountpoint],
                         capture_output=True,timeout=20)
        if p.returncode!=0:
            return {"available":False,"exit_code":p.returncode,
                    "stderr_excerpt":p.stderr.decode("utf-8","replace")[:220]}
        payload=plistlib.loads(p.stdout)
        keys=["FilesystemName","FilesystemType","FilesystemUserVisibleName",
              "FilesystemPersonality","VolumeName","MountPoint","DeviceIdentifier",
              "Content","VirtualOrPhysical","VolumeUUID"]
        out={k:payload.get(k) for k in keys if k in payload}
        return {"available":bool(out),"fields":out}
    except Exception as e:return {"available":False,"reason":str(e)[:260]}

def main(outfile):
    if not IS_MAC:raise RuntimeError("macOS only")
    if platform.machine() not in ("arm64","x86_64"):
        raise RuntimeError("Unexpected host arch")
    root=Path(tempfile.mkdtemp(prefix="guard-i1-sec02-macos-fs-")).resolve()
    try:
        libc=ctypes.CDLL(None,use_errno=True)
        # arm64 Darwin has only the modern 64-bit inode ABI; Intel also exports
        # the old statfs entrypoint, which fills a *different* struct.  Using
        # ctypes libc.statfs on Intel silently gives garbage at offset 72.
        # Select the explicit statfs64/fstatfs64 symbols for Intel; do not
        # reinterpret an old ABI result as a valid filesystem identity.
        arch=platform.machine()
        if arch=="x86_64":
            if hasattr(libc,"statfs64") and hasattr(libc,"fstatfs64"):
                stat_fn=libc.statfs64
                fstat_fn=libc.fstatfs64
                abi="Darwin statfs64/fstatfs64 with 64-bit inode struct"
            else:
                stat_fn=getattr(libc,"statfs$INODE64")
                fstat_fn=getattr(libc,"fstatfs$INODE64")
                abi="Darwin statfs$INODE64/fstatfs$INODE64"
        else:
            stat_fn=libc.statfs
            fstat_fn=libc.fstatfs
            abi="Darwin arm64 native statfs/fstatfs modern ABI"
        stat_fn.argtypes=[ctypes.c_char_p,ctypes.POINTER(DarwinStatfs)]
        stat_fn.restype=ctypes.c_int
        fstat_fn.argtypes=[ctypes.c_int,ctypes.POINTER(DarwinStatfs)]
        fstat_fn.restype=ctypes.c_int
        before_stat=call_statfs(stat_fn,root)
        before_fd=call_fstatfs(fstat_fn,root)
        assert before_stat["fstypename"]==before_fd["fstypename"],(before_stat,before_fd)
        assert before_stat["mount_point"]==before_fd["mount_point"]
        assert before_stat["fsid"]==before_fd["fsid"]
        fst=before_fd["fstypename"]
        assert fst and fst.isascii() and 1<=len(fst)<=15 and fst.lower() not in ("unknown",),before_fd
        mount=get_mount_record(before_fd["mount_point"])
        diskutil=get_diskutil_record(before_fd["mount_point"])
        native=NativeNoReplace()
        source=root/"stage";source.mkdir()
        (source/"receipt.txt").write_text("NATIVE_MACOS_VOLUME_PROBE",encoding="utf-8")
        dest=root/"final"
        dest.mkdir()
        reject=native.rename(source,dest)
        assert not reject["ok"] and reject["raw_error_code"]==17,reject
        dest.rmdir()
        success=native.rename(source,dest)
        assert success["ok"] and (dest/"receipt.txt").exists(),success
        after_fd=call_fstatfs(fstat_fn,dest)
        assert after_fd["fstypename"]==fst and after_fd["fsid"]==before_fd["fsid"],after_fd
        cross_mount=any(fst.lower() in [x.strip().lower() for x in r.get("options",[])]
                        for r in mount.get("matched_records",[]))
        known_diskutil="UNKNOWN"
        if diskutil.get("available"):
            vals=" ".join(str(v) for v in diskutil.get("fields",{}).values() if v is not None)
            known_diskutil="CONFIRMS_FSTYPE" if fst.lower() in vals.lower() else "NOT_MATCHED_OR_NOT_EXPOSED"
        rec={
            "kind":"I1_SEC_02_MACOS_REAL_FILESYSTEM_FOLLOWUP",
            "created_at_utc":datetime.now(timezone.utc).isoformat(),
            "experiment_head":os.getenv("GITHUB_SHA","UNPINNED_LOCAL"),
            "host":platform.platform(),"arch":platform.machine(),
            "python":platform.python_version(),
            "synthetic_only":True,"root_directory_is_new_temp":True,
            "native_header":"Apple XNU bsd/sys/mount.h __DARWIN_STRUCT_STATFS64",
            "selected_libsystem_abi":abi,
            "statfs_path":before_stat,"fstatfs_open_directory":before_fd,
            "mount_command":mount,"diskutil_info":diskutil,
            "native_rename_collision":reject,"native_rename_success":success,
            "post_rename_fstatfs":after_fd,
            "cross_checks":{
                "path_and_fd_fs_type_match":True,
                "path_and_fd_fsid_match":True,
                "mount_command_type_match":cross_mount,
                "diskutil_type_match":known_diskutil
            },
            "goals":{
                "filesystem_type_identified":"PASS_NATIVE_STATFS_FSTATFS",
                "native_RENAME_EXCL_on_same_verified_volume":"PASS_BOUNDED",
                "APFS_evidence":"OBSERVED_APFS" if fst.lower()=="apfs" else "NOT_APFS_CONFIRMED"
            },
            "limits":"Applies to actual temporary test volume only. Diskutil may not expose name. No arbitrary APFS/SMB volume certification, no Guard integration."
        }
        out=Path(outfile);out.parent.mkdir(parents=True,exist_ok=True)
        out.write_text(json.dumps(rec,ensure_ascii=False,indent=2,sort_keys=True)+"\n",encoding="utf-8")
        print("MACOS_FSTYPE_NATIVE",fst,"MOUNT_POINT",before_fd["mount_point"],
              "MOUNT_CROSSCHECK",cross_mount,"DISKUTIL",known_diskutil,flush=True)
        print("MACOS_G1_G2_RENAME_EXCL",success["ok"],"G3_FS_OBJECT_ID",before_fd["fsid"],flush=True)
        return 0
    finally:shutil.rmtree(root,ignore_errors=True)

if __name__=="__main__":
    if len(sys.argv)!=2:
        print("Usage: python macos_fs_followup.py <receipt.json>",file=sys.stderr);sys.exit(2)
    sys.exit(main(sys.argv[1]))
