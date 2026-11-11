"""Native syscall-only directory rename probe for I1-SEC-02.

Research fixture, NOT imported by MindForge Guard and NOT a Node binding.
There is deliberately NO os.rename/replace/MoveFileEx fallback for publication.
The caller must use disposable temp directories only.
"""
from __future__ import annotations
import ctypes
import errno
import os
import platform
from pathlib import Path

IS_LINUX = platform.system() == "Linux"
IS_MAC = platform.system() == "Darwin"
IS_WIN = platform.system() == "Windows"
RENAME_NOREPLACE = 0x00000001
RENAME_EXCL = 0x00000004
RENAME_API_NAME = ("renameat2(RENAME_NOREPLACE)" if IS_LINUX else
                   "renameatx_np(RENAME_EXCL)" if IS_MAC else
                   "SetFileInformationByHandle(FileRenameInfo,ReplaceIfExists=FALSE)")


class NotSupported(RuntimeError):
    pass


def _result(ok: bool, *, api: str, flag: int, error: int = 0, message: str = "", anchored: bool = False):
    return {"ok": bool(ok), "api": api, "flag": flag, "raw_error_code": int(error),
            "error_name": errno.errorcode.get(error, f"WIN32_{error}") if error else "SUCCESS",
            "message": message[:240], "parent_anchored": anchored, "no_fallback": True}


class NativeNoReplace:
    def __init__(self):
        if IS_LINUX or IS_MAC:
            self.libc = ctypes.CDLL(None, use_errno=True)
            name = "renameat2" if IS_LINUX else "renameatx_np"
            try:
                self.function = getattr(self.libc, name)
            except AttributeError as e:
                raise NotSupported(f"Native symbol {name} unavailable; no fallback allowed") from e
            self.function.argtypes = [ctypes.c_int, ctypes.c_char_p, ctypes.c_int,
                                      ctypes.c_char_p, ctypes.c_uint]
            self.function.restype = ctypes.c_int
        elif IS_WIN:
            self._win_init()
        else:
            raise NotSupported("Unsupported OS: native strict rename unavailable")

    def open_parent(self, parent: Path):
        if IS_WIN:
            return self._win_open(parent, parent=True)
        flags = os.O_RDONLY | getattr(os, "O_DIRECTORY", 0) | getattr(os, "O_CLOEXEC", 0)
        flags |= getattr(os, "O_NOFOLLOW", 0)
        return os.open(parent, flags)

    def close_parent(self, handle):
        if IS_WIN:
            self.CloseHandle(handle)
        else:
            os.close(handle)

    def rename_bound(self, source_parent_handle, source_name: str, destination_parent_handle,
                     destination_name: str, *, flag: int | None = None):
        if IS_WIN:
            raise NotSupported("Win32 bound destination requires an already-open source handle; use win_rename_bound")
        if any(z in ("", ".", "..") or "/" in z or "\0" in z for z in (source_name, destination_name)):
            raise ValueError("Single-component relative basenames only")
        f = RENAME_NOREPLACE if IS_LINUX else RENAME_EXCL
        if flag is not None:
            f = int(flag)
        ctypes.set_errno(0)
        r = self.function(source_parent_handle, os.fsencode(source_name),
                          destination_parent_handle, os.fsencode(destination_name), f)
        err = ctypes.get_errno() if r != 0 else 0
        return _result(r == 0, api=RENAME_API_NAME, flag=f, error=err,
                       message=os.strerror(err) if err else "",
                       anchored=True)

    def rename(self, source: Path, destination: Path, *, flag: int | None = None, win_class: int = 3):
        source, destination = Path(source), Path(destination)
        if IS_WIN:
            if source.parent.resolve() != destination.parent.resolve():
                raise NotSupported("Windows PoC requires same-parent sibling directory; no copy fallback")
            return self._win_rename(source, destination.name, cls=win_class)
        old = self.open_parent(source.parent)
        try:
            new = self.open_parent(destination.parent)
            try:
                return self.rename_bound(old, source.name, new, destination.name, flag=flag)
            finally:
                self.close_parent(new)
        finally:
            self.close_parent(old)

    # Windows: actual Win32 native calls; no use of os.rename or MoveFileEx fallback.
    def _win_init(self):
        from ctypes import wintypes
        self.kernel = ctypes.WinDLL("kernel32", use_last_error=True)
        self.w = wintypes
        self.CreateFileW = self.kernel.CreateFileW
        self.CreateFileW.argtypes = [ctypes.c_wchar_p, wintypes.DWORD, wintypes.DWORD,
                                     ctypes.c_void_p, wintypes.DWORD, wintypes.DWORD,
                                     ctypes.c_void_p]
        self.CreateFileW.restype = ctypes.c_void_p
        self.CloseHandle = self.kernel.CloseHandle
        self.CloseHandle.argtypes = [ctypes.c_void_p]
        self.CloseHandle.restype = wintypes.BOOL
        self.SetFileInformationByHandle = self.kernel.SetFileInformationByHandle
        self.SetFileInformationByHandle.argtypes = [ctypes.c_void_p, ctypes.c_int,
                                                    ctypes.c_void_p, wintypes.DWORD]
        self.SetFileInformationByHandle.restype = wintypes.BOOL
        self.INVALID_HANDLE_VALUE = ctypes.c_void_p(-1).value
        self.DELETE = 0x00010000
        self.READ_ATTR = 0x00000080
        self.TRAVERSE = 0x00000020
        self.SHARE_ALL = 0x00000007
        self.OPEN_EXISTING = 3
        self.DIRECTORY_FLAG = 0x02000000
        self.REPARSE_FLAG = 0x00200000

        class HEADER(ctypes.Structure):
            _fields_ = [("Flags", wintypes.DWORD), ("RootDirectory", ctypes.c_void_p),
                        ("FileNameLength", wintypes.DWORD),
                        ("FileName", ctypes.c_uint16 * 1)]
        self.HEADER = HEADER

    def _win_open(self, path: Path, *, parent: bool = False):
        access = (self.TRAVERSE | self.READ_ATTR) if parent else (self.DELETE | self.READ_ATTR)
        flags = self.DIRECTORY_FLAG | (self.REPARSE_FLAG if parent else 0)
        h = self.CreateFileW(str(path), access, self.SHARE_ALL, None,
                             self.OPEN_EXISTING, flags, None)
        if h is None or h == self.INVALID_HANDLE_VALUE:
            code = ctypes.get_last_error()
            raise OSError(code, f"CreateFileW failed for isolated fixture: {code}")
        return h

    def _win_call(self, source_handle, destination_name, root_directory=None, *, cls=3):
        if not destination_name or "\0" in destination_name:
            raise ValueError("Invalid target name")
        if root_directory is not None and any(sep in destination_name for sep in ("/", "\\")):
            raise ValueError("RootDirectory form permits one relative basename only")
        # Exact Win64 FILE_RENAME_INFO layout: Flags/ReplaceIfExists at 0,
        # RootDirectory at 8, FileNameLength at 16, FileName WCHAR[] at 20.
        encoded = destination_name.encode("utf-16-le")
        off = self.HEADER.FileName.offset
        size = max(ctypes.sizeof(self.HEADER), off + len(encoded) + 2)
        buffer = ctypes.create_string_buffer(size)
        header = ctypes.cast(buffer, ctypes.POINTER(self.HEADER)).contents
        header.Flags = 0  # FALSE / *NO* FILE_RENAME_REPLACE_IF_EXISTS.
        header.RootDirectory = root_directory or None
        header.FileNameLength = len(encoded)
        ctypes.memmove(ctypes.addressof(buffer) + off, encoded, len(encoded))
        ctypes.set_last_error(0)
        ok = self.SetFileInformationByHandle(source_handle, int(cls), buffer, size)
        err = ctypes.get_last_error() if not ok else 0
        api = f"SetFileInformationByHandle({'FileRenameInfoEx' if cls == 22 else 'FileRenameInfo'},Flags=0)"
        return _result(bool(ok), api=api, flag=0, error=err,
                       message=f"Win32 GetLastError={err}" if err else "",
                       anchored=(root_directory is not None))

    def _win_rename(self, source: Path, destination_basename: str, *, cls=3):
        source_handle = self._win_open(source)
        try:
            return self._win_call(source_handle, destination_basename, None, cls=cls)
        finally:
            self.CloseHandle(source_handle)

    def win_rename_bound(self, source_handle, destination_parent_handle, destination_basename, *, cls=3):
        if not IS_WIN:
            raise NotSupported("Windows-specific call")
        return self._win_call(source_handle, destination_basename, destination_parent_handle, cls=cls)


def system_identity(test_root: Path):
    import subprocess
    v = {"os": platform.platform(), "system": platform.system(),
         "release": platform.release(), "machine": platform.machine(),
         "python": platform.python_version(), "pid": os.getpid(),
         "temp_device": os.stat(test_root).st_dev,
         "native_api": RENAME_API_NAME, "native_flags": RENAME_NOREPLACE if IS_LINUX else RENAME_EXCL if IS_MAC else 0}
    if IS_LINUX:
        v["mount_fstype"] = "UNKNOWN"
        try:
            proc = subprocess.run(["findmnt", "-T", str(test_root), "-no", "FSTYPE,SOURCE,TARGET"],
                                  capture_output=True, text=True, timeout=8)
            if proc.returncode == 0:
                v["mount_fstype"] = proc.stdout.strip()[:350]
        except (OSError, subprocess.TimeoutExpired):
            pass
    elif IS_MAC:
        v["mount_fstype"] = "UNKNOWN"
        try:
            proc = subprocess.run(["diskutil", "info", str(test_root)],
                                  capture_output=True, text=True, timeout=12)
            if proc.returncode == 0:
                lines = [ln.strip() for ln in proc.stdout.splitlines() if
                         "File System Personality:" in ln or "Type (Bundle):" in ln or "Device Node:" in ln]
                v["mount_fstype"] = " | ".join(lines)[:350] if lines else "UNKNOWN"
        except (OSError, subprocess.TimeoutExpired):
            pass
    elif IS_WIN:
        import ctypes
        from ctypes import wintypes
        k = ctypes.WinDLL("kernel32", use_last_error=True)
        volume = ctypes.create_unicode_buffer(256)
        fsname = ctypes.create_unicode_buffer(256)
        serial = wintypes.DWORD()
        max_component = wintypes.DWORD()
        flags = wintypes.DWORD()
        drive = Path(test_root).anchor
        k.GetVolumeInformationW.argtypes = [ctypes.c_wchar_p, ctypes.c_wchar_p, wintypes.DWORD,
                                             ctypes.POINTER(wintypes.DWORD), ctypes.POINTER(wintypes.DWORD),
                                             ctypes.POINTER(wintypes.DWORD), ctypes.c_wchar_p, wintypes.DWORD]
        k.GetVolumeInformationW.restype = wintypes.BOOL
        if k.GetVolumeInformationW(drive, volume, 256, ctypes.byref(serial),
                                   ctypes.byref(max_component), ctypes.byref(flags), fsname, 256):
            v["mount_fstype"] = fsname.value
        else:
            v["mount_fstype"] = "UNKNOWN"
    return v
