import {
  GUARD_VALIDATION_ERROR_CODES,
  createValidationError,
  type GuardValidationError,
} from "./errors.ts";

export interface EvidencePackV1 extends Record<string, unknown> {
  schema_version: string;
  pack_id: string;
  pack_type: string;
  created_at: string;
  producer: Record<string, unknown>;
  workflow: Record<string, unknown>;
  authority: Record<string, unknown>;
  runtime: Record<string, unknown>;
  intent: Record<string, unknown>;
  scope: Record<string, unknown>;
  actions: unknown[];
  tool_calls: unknown[];
  blocked_actions: unknown[];
  artifacts: unknown[];
  verification: unknown[];
  risk_signals: unknown[];
  provenance: Record<string, unknown>;
  manifest: Record<string, unknown>;
  plan?: Record<string, unknown>;
  policy_observations?: unknown[];
  human_review?: Record<string, unknown>;
  extensions?: Record<string, unknown>;
}

export type ParseResult =
  | { ok: true; pack: EvidencePackV1 }
  | { ok: false; errors: GuardValidationError[] };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseJsonText(text: string): ParseResult {
  try {
    const parsed = JSON.parse(text);
    if (!isPlainObject(parsed)) {
      return {
        ok: false,
        errors: [
          createValidationError(
            GUARD_VALIDATION_ERROR_CODES.INVALID_INPUT_TYPE,
            "$",
            "Evidence Pack JSON must parse to an object.",
            { receivedType: Array.isArray(parsed) ? "array" : typeof parsed },
          ),
        ],
      };
    }

    return { ok: true, pack: parsed as EvidencePackV1 };
  } catch (error) {
    return {
      ok: false,
      errors: [
        createValidationError(
          GUARD_VALIDATION_ERROR_CODES.INVALID_JSON,
          "$",
          "Evidence Pack input is not valid JSON.",
          {
            error:
              error instanceof Error
                ? error.message
                : "Unknown JSON parse failure.",
          },
        ),
      ],
    };
  }
}

export function parseEvidencePack(input: string | Buffer | unknown): ParseResult {
  if (typeof input === "string") {
    return parseJsonText(input);
  }

  if (typeof Buffer !== "undefined" && Buffer.isBuffer(input)) {
    return parseJsonText(input.toString("utf8"));
  }

  if (isPlainObject(input)) {
    return { ok: true, pack: input as EvidencePackV1 };
  }

  return {
    ok: false,
    errors: [
      createValidationError(
        GUARD_VALIDATION_ERROR_CODES.INVALID_INPUT_TYPE,
        "$",
        "Evidence Pack input must be a JSON string, Buffer, or parsed object.",
        { receivedType: Array.isArray(input) ? "array" : typeof input },
      ),
    ],
  };
}
