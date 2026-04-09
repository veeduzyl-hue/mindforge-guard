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

  const payload = (await response.json()) as
    | PaddleApiResponse<T>
    | { error?: { detail?: string; code?: string; type?: string } };

  if (!response.ok) {
    const detail =
      "error" in payload && payload.error
        ? payload.error.detail || payload.error.code || payload.error.type
        : `paddle_api_${response.status}`;
    throw new Error(detail || `paddle_api_${response.status}`);
  }

  if (!("data" in payload)) {
    throw new Error("invalid Paddle API response");
  }

  return payload.data;
}
