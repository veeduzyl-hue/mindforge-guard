/**
 * License Key Metadata Registry (rotation-ready)
 *
 * This file is informational and does NOT affect verification logic.
 * It exists to support:
 * - issuer metadata
 * - key lifecycle
 * - deprecation + rotation successor
 *
 * Verification still relies on LICENSE_KEYSET only.
 */

export const LICENSE_KEY_METADATA = {
    "mf_k1_2026": {
      issuer: "MindForge Licensing Authority",
      algorithm: "Ed25519",
      created_at: "2026-01-01T00:00:00Z",
      deprecated: false,
      rotation_successor: null,
      description: "Primary production key for 2026",
    },
  };
  
