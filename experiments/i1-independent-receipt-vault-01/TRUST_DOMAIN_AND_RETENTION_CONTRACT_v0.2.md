# I1-INDEPENDENT-RECEIPT-VAULT — Trust & Custody Admission Contract v0.2

**Owner accepted bounded result:** `I1-INDEPENDENT-RECEIPT-VAULT-01 = CRYPTOGRAPHIC_POC_COMPLETED_WITH_BOUNDARIES`, fixed HEAD `705b4c77150ac12f906b63305ed0a0c0193f4cb9`, CI #43237642752 (30/30 synthetic verification).

**Proposed independent trust architecture (NOT deployed):**

| Responsibility | Intended trust domain | Admission evidence still required |
|---|---|---|
| Producer / Bundle Writer | Ordinary Guard execution principal; issues only digest+run references | Prove it cannot modify receipt signing key, audit ledger or independent verifier root |
| Receipt Signer | Separate IAM/OS service principal with isolated KMS/HSM Ed25519 signing key | Demonstrate key residency, access and non-export, rotation/revocation and compromised-producer negative test |
| Independent Verifier | Separate verification authority that pins a trust-root and checks signature/run/artifact binding | Read-only verification receipts, independently maintained trust anchors and expiry/revocation |
| Evidence Custodian | Protected immutable/append-only store with own access audit | Show Writer and Signer cannot retroactively modify past records; actual retention and legal hold policy |
| Human Owner and counsel | Human governance authority | Approve region, customer data class, minimum/maximum retention, legal hold, erasure and incident escalation |

**Admissibility is not a JSON boolean.** The new pure `admission_gate.mjs` assesses whether each of ten P0 trust-domain categories has a separately identifiable verification reference. It never converts self-claims into an authenticated operational decision. Even a complete paper packet yields `OWNER_AND_INDEPENDENT_REVIEW_REQUIRED`, not product authorization.

## P0 required records

1. Independent writer/signer identities and actual credential separation.
2. Verifier different from signer and writer.
3. KMS/HSM key custody, non-export restrictions and independent key lifecycle audit.
4. Pinned key distribution and revocation/rotation trust root.
5. Append-only or WORM backend with immutable retention and separate IAM.
6. Jurisdiction-specific Owner/legal-approved retention policy, not an invented number.
7. Actual legal-hold handling and immutable hold verification.
8. Writer-independent access/audit ledger.
9. Independently restored signed receipt sample from separate backup/custodian.
10. Key loss/recovery, rotation and compromise response.

**Required negative controls:** stolen producer token must not sign or delete; signer cannot edit historical vault records; verifier cannot issue; wrong tenant/run/bundle hash refuses; expired/revoked key refuses; retention/legal hold rejects deletion; power loss cannot fabricate prior success; missing KMS/credentials fails closed.

## Explicit current boundary

Previous cryptography PoC used distinct processes but the same OS user; ephemeral CI private key and ordinary writable hash-chain file are **not independent operational custody**. Synthetic CI tests may prove API semantics and reject self-declared admission, but cannot substitute for KMS, IAM, append-only retention infrastructure or external audit.

**Production receipt custody = HOLD; actual customer data = NOT AUTHORIZED; retention period = NOT APPROVED; no cloud KMS connected and no production secret in GitHub.**

This contract changes no Guard Evidence Contract, EAK schema, licensing, user authority or product publication.
