"use client";

import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";

import type { PaddlePriceDefinition } from "../../../lib/paddlePrices";

declare global {
  interface Window {
    Paddle?: {
      Environment?: {
        set(environment: "sandbox" | "production"): void;
      };
      Initialize(input: {
        token: string;
        eventCallback?: (event: { name?: string }) => void;
      }): void;
      Checkout: {
        open(input: {
          transactionId: string;
          settings?: {
            successUrl?: string;
            allowLogout?: boolean;
            variant?: "one-page" | "multi-page";
          };
        }): void;
      };
    };
  }
}

export function PaddleTestClient(input: {
  environment: "sandbox" | "production";
  clientToken: string;
  successUrl: string;
  cancelUrl: string;
  prices: readonly PaddlePriceDefinition[];
}) {
  const [buyerEmail, setBuyerEmail] = useState("buyer@example.com");
  const [selectedPriceId, setSelectedPriceId] = useState(input.prices[0]?.priceId || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutState, setCheckoutState] = useState<string>("idle");
  const checkoutCompletedRef = useRef(false);
  const initializedRef = useRef(false);

  const selectedPrice = useMemo(
    () => input.prices.find((entry) => entry.priceId === selectedPriceId) || input.prices[0],
    [input.prices, selectedPriceId]
  );

  useEffect(() => {
    checkoutCompletedRef.current = false;
  }, [selectedPriceId, buyerEmail]);

  function initializePaddle() {
    if (initializedRef.current || !window.Paddle || !input.clientToken) {
      return;
    }

    if (input.environment === "sandbox") {
      window.Paddle.Environment?.set("sandbox");
    }

    window.Paddle.Initialize({
      token: input.clientToken,
      eventCallback(event) {
        if (event?.name === "checkout.completed") {
          checkoutCompletedRef.current = true;
          setCheckoutState("completed");
        }
        if (event?.name === "checkout.closed" && !checkoutCompletedRef.current) {
          window.location.href = `${input.cancelUrl}?reason=closed`;
        }
      },
    });
    initializedRef.current = true;
  }

  async function beginCheckout() {
    if (!selectedPrice) {
      setError("No Paddle price configured");
      return;
    }
    if (!input.clientToken) {
      setError("Missing PADDLE_CLIENT_TOKEN");
      return;
    }
    if (!window.Paddle) {
      setError("Paddle.js has not loaded yet");
      return;
    }

    setBusy(true);
    setError(null);
    setCheckoutState("creating");
    checkoutCompletedRef.current = false;

    try {
      const response = await fetch("/api/paddle/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buyerEmail,
          priceId: selectedPrice.priceId,
        }),
      });

      const payload = (await response.json()) as {
        ok: boolean;
        error?: string;
        checkout?: { transaction_id: string; success_url: string };
      };

      if (!response.ok || !payload.ok || !payload.checkout) {
        throw new Error(payload.error || "Unable to create Paddle checkout");
      }

      setCheckoutState("opening");
      window.Paddle.Checkout.open({
        transactionId: payload.checkout.transaction_id,
        settings: {
          successUrl: payload.checkout.success_url,
          allowLogout: true,
          variant: "one-page",
        },
      });
      setCheckoutState("opened");
    } catch (caughtError) {
      setCheckoutState("error");
      setError(caughtError instanceof Error ? caughtError.message : String(caughtError));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Script src="https://cdn.paddle.com/paddle/v2/paddle.js" strategy="afterInteractive" onLoad={initializePaddle} />
      <div style={{ display: "grid", gap: 16 }}>
        <label style={{ display: "grid", gap: 8 }}>
          <span>Buyer email</span>
          <input
            value={buyerEmail}
            onChange={(event) => setBuyerEmail(event.target.value)}
            placeholder="buyer@example.com"
            style={{ padding: 12, borderRadius: 10, border: "1px solid #c4b79d" }}
          />
        </label>

        <label style={{ display: "grid", gap: 8 }}>
          <span>Paddle price</span>
          <select
            value={selectedPriceId}
            onChange={(event) => setSelectedPriceId(event.target.value)}
            style={{ padding: 12, borderRadius: 10, border: "1px solid #c4b79d" }}
          >
            {input.prices.map((price) => (
              <option key={price.priceId} value={price.priceId}>
                {price.label} ({price.priceId})
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() => void beginCheckout()}
          disabled={busy || !selectedPrice}
          style={{
            padding: "14px 18px",
            borderRadius: 12,
            border: "none",
            background: "#2b4c7e",
            color: "white",
            fontSize: 16,
            cursor: busy ? "progress" : "pointer",
          }}
        >
          {busy ? "Starting checkout..." : `Launch ${selectedPrice?.label || "checkout"}`}
        </button>

        <div style={{ color: "#6a604b", fontSize: 14 }}>
          <p>Environment: {input.environment}</p>
          <p>Checkout state: {checkoutState}</p>
          <p>Success return: {input.successUrl}</p>
          <p>Cancel return: {input.cancelUrl}</p>
        </div>

        {error ? <p style={{ color: "#9f2c2c", margin: 0 }}>Error: {error}</p> : null}
      </div>
    </>
  );
}
