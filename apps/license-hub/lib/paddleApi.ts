import { getPaddleConfig } from "./env";

interface PaddleApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface PaddleTransactionResponse {
  id: string;
  status: string;
  checkout?: {
    url?: string | null;
  } | null;
}

export class PaddleApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message || `paddle_api_${status}`);
    this.name = "PaddleApiError";
    this.status = status;
  }
}

function parseJsonSafely(value: string): unknown {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

export async function paddleApiRequest<T>(pathname: string, init?: RequestInit): Promise<T> {
  const config = getPaddleConfig();
  if (!config.apiKey) {
    throw new Error("Missing required environment variable: PADDLE_API_KEY");
  }

  const response = await fetch(`${config.apiBaseUrl}${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "Paddle-Version": "1",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  const rawBody = await response.text();
  const parsedPayload = parseJsonSafely(rawBody) as
    | PaddleApiResponse<T>
    | { error?: { detail?: string; code?: string; type?: string } }
    | null;

  if (!response.ok) {
    const detail =
      parsedPayload && "error" in parsedPayload && parsedPayload.error
        ? parsedPayload.error.detail || parsedPayload.error.code || parsedPayload.error.type
        : rawBody.trim() || `paddle_api_${response.status}`;
    throw new PaddleApiError(response.status, detail || `paddle_api_${response.status}`);
  }

  if (!parsedPayload) {
    throw new Error("invalid Paddle API response");
  }

  if (!("data" in parsedPayload)) {
    throw new Error("invalid Paddle API response");
  }

  return parsedPayload.data;
}
