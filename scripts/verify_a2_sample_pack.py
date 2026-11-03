#!/usr/bin/env python3
"""Verify the fixed A2 zip, ZIP entries, exact source blobs and manifest custody."""
import hashlib
import json
import stat
import zipfile
from pathlib import Path

from build_a2_sample_pack import COMMIT, EXPECTED, NAME, ROOT, TREE, gitblob

ARCHIVE_SHA256 = "1c0c7d4c26f564294c0024a0412ebf2f03288484002e8b61716526153eafb6bf"
ARCHIVE_BLOB = "2350fbaa55843d0a7d7fbe7e2cac53db07250567"
DOWNLOADS = ROOT / "downloads"

def require(value, message):
    if not value:
        raise SystemExit("FAIL: " + message)

def verify():
    zip_path = DOWNLOADS / NAME
    raw = zip_path.read_bytes()
    digest = hashlib.sha256(raw).hexdigest()
    require(len(raw) == 8356, "archive size changed")
    require(digest == ARCHIVE_SHA256, "fixed archive SHA-256 changed")
    require(gitblob(raw) == ARCHIVE_BLOB, "fixed archive Git Blob changed")
    manifest = json.loads((DOWNLOADS / (NAME + ".manifest.json")).read_text(encoding="utf-8"))
    require(manifest["archive_sha256"] == digest, "manifest digest mismatch")
    require(manifest["archive_bytes"] == len(raw), "manifest size mismatch")
    require(manifest["archive_git_blob_sha1"] == ARCHIVE_BLOB, "manifest Git Blob mismatch")
    require(manifest["source_commit"] == COMMIT, "source commit changed")
    require(manifest["source_pack_tree_git_sha1"] == TREE, "source tree changed")
    require(manifest["synthetic_only"] is True and manifest["no_production_assurance"] is True, "synthetic boundary missing")
    require((DOWNLOADS / (NAME + ".sha256")).read_text().strip() == digest + "  " + NAME, "checksum sidecar mismatch")
    entries = manifest.get("files", [])
    require(len(entries) == len(EXPECTED) == 11, "manifest files count incorrect")
    map_entries = {f["path"]: f for f in entries}
    require(len(map_entries) == 11 and set(map_entries) == set(EXPECTED), "manifest inventory mismatch")
    expected_names = {"hr-self-service-agent/" + f for f in EXPECTED}
    with zipfile.ZipFile(zip_path) as archive:
        names = archive.namelist()
        require(len(names) == 11 and len(set(names)) == 11 and set(names) == expected_names, "ZIP inventory mismatch")
        for rel, source_sha in EXPECTED.items():
            name = "hr-self-service-agent/" + rel
            info = archive.getinfo(name)
            require(info.file_size == info.compress_size, "unexpected ZIP compression")
            require(info.compress_type == zipfile.ZIP_STORED, "ZIP compression changed")
            require(not name.startswith("/") and ".." not in Path(name).parts, "unsafe ZIP path")
            mode = (info.external_attr >> 16) & 0o170000
            require(mode == stat.S_IFREG, "non-regular ZIP entry")
            data = archive.read(name)
            entry = map_entries[rel]
            require(gitblob(data) == source_sha, "Git blob changed: " + rel)
            require(entry["git_blob_sha1"] == source_sha, "manifest Git blob mismatch: " + rel)
            require(hashlib.sha256(data).hexdigest() == entry["sha256"], "member SHA-256 mismatch: " + rel)
            require(len(data) == entry["bytes"], "member size mismatch: " + rel)
    print("PASS: fixed standalone sample ZIP; 11 exact source blobs; SHA-256, paths and manifest verified")

if __name__ == "__main__":
    verify()
