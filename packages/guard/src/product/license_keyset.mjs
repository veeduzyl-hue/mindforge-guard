/**
 * License public key set for offline verification (Ed25519).
 *
 * Key rotation strategy:
 * - Add new key entries for new periods (e.g., mf_k2_2027).
 * - Keep old keys to verify existing licenses.
 * - Use LICENSE_KEY_METADATA to mark deprecated keys and successors.
 *
 * IMPORTANT:
 * - Only public keys live here.
 * - Private keys MUST NEVER be committed.
 */

export const LICENSE_KEYSET = {
    "mf_k1_2026": {
      publicKey:
        "-----BEGIN PUBLIC KEY-----\n" +
        "MCowBQYDK2VwAyEAK9nSHqn4DE9tdF4v/DB5TK+5XOxaGnuHHkQduMD7jy8=\n" +
        "-----END PUBLIC KEY-----\n",
    },
  
    // Example future key (placeholder):
    // "mf_k2_2027": {
    //   publicKey:
    //     "-----BEGIN PUBLIC KEY-----\n" +
    //     "...\n" +
    //     "-----END PUBLIC KEY-----\n",
    // },
  };
  