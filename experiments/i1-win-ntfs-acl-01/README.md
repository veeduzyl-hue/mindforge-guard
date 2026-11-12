# I1-WIN-NTFS-ACL-01 — Private staging DACL at creation (isolated research)

**Implementation:** Node-API8 Windows-native `CreateDirectoryW` with explicit `SECURITY_ATTRIBUTES.lpSecurityDescriptor` containing a **protected DACL**. No post-create `icacls` / `chmod` repair and no automatic fallback.

**Scope and identity**
- Frozen parent: `05cc5eee25c53db164d2d766e73fa63afd853bf4` (I1-REAL-WRITER-RECOVERY-02).
- Source-only isolated experiment under `experiments/i1-win-ntfs-acl-01/`; CI workflow changes allowed. **No real I-1 Writer import, no product integration, no `main` or PR #359 mutation, and no publication.**
- A newly allocated disposable synthetic fixture and an explicit double opt-in are required. The proof must not run on genuine customer evidence or user-selected folders.

**Objective and admission**
1. Verify actual native Windows Server 2022 test volume is `NTFS` with `FS_PERSISTENT_ACLS`; otherwise fail closed.
2. Capture the current token user SID without logging it; construct a descriptor with `D:P`, granting inheritable full control only to that user and LocalSystem. **Do not allow Authenticated Users, Everyone, Builtin Users, broad administrator groups or inherited ACEs** on the newly created stage.
3. Pass that descriptor directly into `CreateDirectoryW`, so protected permissions apply **at directory creation**, not in a later repair window.
4. Reopen the created directory using a real HANDLE; verify DACL protected flag, enumerated ACE identities and full control, no inherited ACE, and parent object identity unchanged at check time. If verification fails, refuse to use the created directory; do **not** blindly delete it.
5. Demonstrate a deliberately permissive synthetic parent that gives `Authenticated Users` inherited Modify; Node's normal `mkdir(mode:0700)` inherits broader rights, whereas the native directory is protected. Read back child file DACL and verify intended inheritance.
6. Test 12 independently spawned processes competing for a single new private stage: one verified winner, 11 collisions and no overwrite.
7. Keep all Windows client and product gates open until separately validated.

**Threat model / nonclaims**
- Parent `CreateDirectoryW` is currently *path-based*. It holds a parent HANDLE and **rechecks its identity after creation**, but a malicious same-user adversary can change the parent pathname **during the creation call**. The atomic ACL is not proof of handle-relative creation or a complete G3 solution.
- DACL ACE enumeration does **not substitute for an actual access attempt from another distinct Windows account/session**. Local Admins/SYSTEM may retain privileged recovery/take-ownership rights even without an explicit directory ACE; G4 is NOT ESTABLISHED.
- This does not enforce Windows 10/11 desktop compatibility, unsupported filesystems, SMB, OneDrive/cloud sync policy, backup retention, secure erasure, authenticated receipts, or customer First-User Admission.
- The Node-API native binary is built only in isolated CI, `private: true`, has no install hooks, and **is not shipped in Guard**. The actual Writer still uses `mkdtempSync` and therefore has Windows DACL P0 HOLD pending a separate integration admission.
- The isolated test may give broad `Authenticated Users` Modify access to **its own newly created synthetic test parent** to demonstrate inherited permissions. The runner fixture is destroyed only by the test harness after inspection; this is not permission for product cleanup.

**Correct interpretation:** If the synthetic Windows Server 2022 NTFS proof passes, `AT_CREATION_PRIVATE_DACL_PROOF = PASS_BOUNDED` is possible; `REAL_I1_PRODUCT_STAGING_ACL = HOLD` until actual Writer integration + a Windows client effective cross-account access test.

**Original documentation:** [CreateDirectoryW](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-createdirectory); [Security descriptors for new objects](https://learn.microsoft.com/en-us/windows/win32/secauthz/security-descriptors-for-new-objects); [GetSecurityInfo](https://learn.microsoft.com/en-us/windows/win32/api/aclapi/nf-aclapi-getsecurityinfo).

**No `main` merge / no release / no new Guard runtime status or enforcement responsibility.**
