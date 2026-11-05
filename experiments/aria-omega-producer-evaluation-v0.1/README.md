# ARIA OMEGA External Producer Evaluation (AOE-PE) v0.1

## Purpose
Bounded, offline, research-only evaluation of the ARIA OMEGA Master Dossier dated 2026-11-02 as an external producer artifact. This evaluates whether selected claims are supported by the dossier's disclosed evidence and limitations.

It does not integrate ARIA OMEGA, execute its code, contact its services, validate its Git repository, or establish independent assurance. The evaluation is limited to the supplied 13-page PDF and source-bound facts transcribed from it.

## Frozen source
- File: `1793673197723.pdfARIA_OMEGA_Dossie_Auditavel_02-11-2026.pdf`
- SHA-256: `7ece4196fc069ffd12060bb25972b1d98e75a3882560ccb8b14ffdabd2de06d2`
- Dossier date: 2026-11-02
- Repository/revision stated by dossier: `alebalbim/ARIA_OMEGA_Audit_Evolution`, `main`, `6bb11b6`
- Evaluated output: `SAIDAS/dossie_auditavel_mestre_20261102_184231_914ebade.json`
- The underlying JSON, source repository, branches, signatures, TSA tokens, and stress-test package were not independently fetched.

## Five cases
1. `AOE-PE-01-C14-DOWNGRADE`: C14 registered as `TESTADO_EM_AMBIENTE_CONTROLADO`, effective as `DESIGN_DECLARADO` because no stress execution was located in this execution's evidence inventory.
2. `AOE-PE-02-MOCK-PROTOCOL`: distinguish reproducible digest claims from signature and trusted timestamp proof; envelope says `MOCK_PROTOCOLO`, `LOCAL_MOCK`, `signature: null`, `NAO_IMPLEMENTADO`.
3. `AOE-PE-03-RAG-ZERO-RELEVANCE`: 5 sources retrieved, 0 relevant under the dossier's criterion, status `contexto_insuficiente`.
4. `AOE-PE-04-UNSIGNED-ENVELOPE`: do not infer that this specific envelope is signed/timestamped from project-level prototype claims.
5. `AOE-PE-05-CLAIM-STATUS-RECONCILIATION`: reconcile 21 claims: 7 prototype, 8 design-declared, 6 roadmap; preserve C14 downgrade.

## Evaluation posture
- A producer claim is not self-authenticating.
- A digest is not a digital signature.
- A local mock timestamp is not an external trusted timestamp.
- Retrieved sources are not relevant support unless the relevance test passes.
- Registered claim status cannot override evidence-supported effective status.
- Project-level implementation claims do not prove that this specific envelope is signed or timestamped.

## Boundary
Research-only, offline, deterministic fixture evaluation. Additive-only. No changes to Guard product code, schemas, CLI, `audit`, `permit`, `classify`, npm package, release, deployment, license, or runtime behavior. No new top-level Guard object or EAK schema. No approval, blocking, certification, compliance determination, or runtime authority.

## Run
```bash
node experiments/aria-omega-producer-evaluation-v0.1/scripts/verify.mjs
```

The verifier is standalone and is not wired into aggregate `npm run verify`.
