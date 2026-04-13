"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

import type { CommercialOffer } from "../../lib/commercialCatalog";

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

type CheckoutApiPayload = {
  ok: boolean;
  error?: string;
  code?: string;
  checkout?: {
    transaction_id: string;
    success_url: string;
    checkout_url?: string | null;
  };
};

async function readCheckoutApiPayload(response: Response): Promise<CheckoutApiPayload> {
  const contentType = response.headers.get("content-type") || "";
  const rawBody = await response.text();

  if (contentType.toLowerCase().includes("application/json")) {
    return JSON.parse(rawBody) as CheckoutApiPayload;
  }

  const compactBody = rawBody.replace(/\s+/g, " ").trim();
  throw new Error(
    compactBody.startsWith("<")
      ? `Checkout endpoint returned HTML instead of JSON (status ${response.status}).`
      : compactBody || `Checkout request failed with status ${response.status}.`
  );
}

export function PricingClient(input: {
  environment: "sandbox" | "production";
  clientToken: string;
  successUrl: string;
  cancelUrl: string;
  offers: readonly CommercialOffer[];
}) {
  const [buyerEmail, setBuyerEmail] = useState("");
  const [busySlug, setBusySlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkoutState, setCheckoutState] = useState("idle");
  const checkoutCompletedRef = useRef(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    checkoutCompletedRef.current = false;
  }, [buyerEmail]);

  useEffect(() => {
    initializePaddle();
  }, [input.clientToken, input.environment]);

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

  async function beginCheckout(offer: CommercialOffer) {
    if (offer.kind !== "paddle_checkout" || !offer.priceKey) {
      return;
    }
    if (!buyerEmail.trim()) {
      setCheckoutState("error");
      setError("Enter the purchase email that should receive License Hub access.");
      return;
    }

    setError(null);
    setBusySlug(offer.slug);
    setCheckoutState("creating");
    checkoutCompletedRef.current = false;

    try {
      const response = await fetch("/api/paddle/checkout", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buyerEmail,
          priceKey: offer.priceKey,
        }),
      });

      const payload = await readCheckoutApiPayload(response);

      if (!response.ok || !payload.ok || !payload.checkout) {
        throw new Error(payload.error || "Unable to create Paddle checkout");
      }

      const checkoutUrl = payload.checkout.checkout_url || null;

      if (input.clientToken && window.Paddle) {
        setCheckoutState("opening");
        try {
          window.Paddle.Checkout.open({
            transactionId: payload.checkout.transaction_id,
            settings: {
              successUrl: payload.checkout.success_url,
              allowLogout: true,
              variant: "one-page",
            },
          });
          setCheckoutState("opened");
          return;
        } catch (openError) {
          if (!checkoutUrl) {
            throw openError;
          }
        }
      }

      if (checkoutUrl) {
        setCheckoutState("redirecting");
        window.location.href = checkoutUrl;
        return;
      }

      if (!input.clientToken) {
        throw new Error("Paddle client token is missing, so embedded checkout cannot start.");
      }

      throw new Error("Paddle.js has not loaded yet, and no hosted checkout URL was returned.");
    } catch (caughtError) {
      setCheckoutState("error");
      setError(caughtError instanceof Error ? caughtError.message : String(caughtError));
    } finally {
      setBusySlug(null);
    }
  }

  return (
    <>
      <Script src="https://cdn.paddle.com/paddle/v2/paddle.js" strategy="afterInteractive" onLoad={initializePaddle} />
      <section
        style={{
          display: "grid",
          gap: 14,
          padding: 22,
          borderRadius: 18,
          background: "#fffaf0",
          border: "1px solid #d8ccae",
        }}
      >
        <label style={{ display: "grid", gap: 8 }}>
          <span style={{ fontWeight: 700 }}>Purchase email</span>
          <input
            value={buyerEmail}
            onChange={(event) => setBuyerEmail(event.target.value)}
            placeholder="buyer@example.com"
            style={{ padding: 14, borderRadius: 12, border: "1px solid #c4b79d" }}
          />
        </label>
        <p style={{ margin: 0, color: "#5b5444" }}>
          Use the same email later for <Link href="/login">License Hub login</Link>, license downloads, and account
          billing lookup.
        </p>
        <p style={{ margin: 0, color: "#5b5444" }}>
          Checkout state: <strong>{checkoutState}</strong> | Environment: <strong>{input.environment}</strong>
        </p>
        {error ? (
          <p
            role="alert"
            aria-live="assertive"
            style={{
              margin: 0,
              padding: 12,
              borderRadius: 12,
              border: "1px solid #d7a0a0",
              background: "#fff2f2",
              color: "#9f2c2c",
              fontWeight: 600,
            }}
          >
            Checkout error: {error}
          </p>
        ) : null}
      </section>

      <section style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {input.offers.map((offer) => {
          const isPaid = offer.kind === "paddle_checkout";
          const isBusy = busySlug === offer.slug;

          return (
            <article
              key={offer.slug}
              style={{
                display: "grid",
                gap: 14,
                padding: 22,
                borderRadius: 18,
                background: "#ffffff",
                border: "1px solid #d8ccae",
                boxShadow: "0 12px 32px rgba(46, 38, 20, 0.08)",
              }}
            >
              <div style={{ display: "grid", gap: 6 }}>
                <p style={{ margin: 0, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#946c2b" }}>
                  {offer.editionLabel}
                </p>
                <h2 style={{ margin: 0, fontSize: 28 }}>{offer.title}</h2>
                <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.65 }}>{offer.summary}</p>
              </div>

              <div style={{ display: "grid", gap: 4, color: "#3e382b" }}>
                <div>Billing interval: {offer.billingIntervalLabel}</div>
                <div>Delivery: {offer.deliveryLabel}</div>
                {offer.priceId ? <div style={{ color: "#7b715d", fontSize: 12 }}>Verified checkout wiring is centralized in server config.</div> : null}
              </div>

              <ul style={{ margin: 0, paddingLeft: 18, color: "#3e382b", lineHeight: 1.7 }}>
                {offer.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>

              {offer.kind === "paddle_checkout" ? (
                <button
                  type="button"
                  onClick={() => void beginCheckout(offer)}
                  disabled={isBusy}
                  style={{
                    padding: "13px 16px",
                    borderRadius: 12,
                    border: "none",
                    background: "#1f3b63",
                    color: "#ffffff",
                    fontWeight: 700,
                    cursor: isBusy ? "progress" : "pointer",
                  }}
                >
                  {isBusy ? "Starting checkout..." : offer.ctaLabel}
                </button>
              ) : null}

              {offer.kind === "community" ? (
                <Link
                  href="/docs"
                  style={{
                    display: "inline-block",
                    padding: "13px 16px",
                    borderRadius: 12,
                    border: "1px solid #c4b79d",
                    textDecoration: "none",
                    color: "#3e382b",
                    fontWeight: 700,
                  }}
                >
                  {offer.ctaLabel}
                </Link>
              ) : null}

              {offer.kind === "contact" ? (
                <Link
                  href="/contact"
                  style={{
                    display: "inline-block",
                    padding: "13px 16px",
                    borderRadius: 12,
                    border: "1px solid #c4b79d",
                    textDecoration: "none",
                    color: "#3e382b",
                    fontWeight: 700,
                  }}
                >
                  {offer.ctaLabel}
                </Link>
              ) : null}
            </article>
          );
        })}
      </section>
    </>
  );
}
