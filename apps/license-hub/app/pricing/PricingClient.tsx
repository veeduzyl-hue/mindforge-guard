"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

import type { CommercialOffer, PricingEdition } from "../../lib/commercialCatalog";

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
          customer?: {
            email?: string;
          };
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
    cancel_url?: string;
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

function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:");
}

export function PricingClient(input: {
  environment: "sandbox" | "production";
  clientToken: string;
  successUrl: string;
  cancelUrl: string;
  editions: readonly PricingEdition[];
}) {
  const [buyerEmail, setBuyerEmail] = useState("");
  const [busySlug, setBusySlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const checkoutCompletedRef = useRef(false);
  const hostedFallbackStartedRef = useRef(false);
  const activeCheckoutRef = useRef<{
    transactionId: string;
    checkoutUrl: string | null;
  } | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    checkoutCompletedRef.current = false;
    hostedFallbackStartedRef.current = false;
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
          hostedFallbackStartedRef.current = false;
          activeCheckoutRef.current = null;
        }

        if (event?.name === "checkout.payment.error" || event?.name === "checkout.error") {
          redirectToHostedCheckout("payment error in overlay");
          return;
        }

        if (event?.name === "checkout.closed" && !checkoutCompletedRef.current) {
          redirectToHostedCheckout("overlay closed before payment completion");
        }
      },
    });
    initializedRef.current = true;
  }

  function redirectToHostedCheckout(reason: string) {
    const activeCheckout = activeCheckoutRef.current;
    if (!activeCheckout?.checkoutUrl || hostedFallbackStartedRef.current) {
      if (!activeCheckout?.checkoutUrl && !checkoutCompletedRef.current) {
        window.location.href = `${input.cancelUrl}?reason=closed`;
      }
      return;
    }

    hostedFallbackStartedRef.current = true;
    setError(`Checkout could not finish (${reason}). Switching to the secure hosted checkout page...`);
    window.location.href = activeCheckout.checkoutUrl;
  }

  async function beginCheckout(offer: CommercialOffer) {
    if (offer.kind !== "paddle_checkout" || !offer.priceKey) {
      return;
    }
    if (!buyerEmail.trim()) {
      setError("Enter the purchase email that should receive License Hub access.");
      return;
    }

    setError(null);
    setBusySlug(offer.slug);
    checkoutCompletedRef.current = false;
    hostedFallbackStartedRef.current = false;
    activeCheckoutRef.current = null;

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

      activeCheckoutRef.current = {
        transactionId: payload.checkout.transaction_id,
        checkoutUrl: payload.checkout.checkout_url || null,
      };
      const checkoutUrl = payload.checkout.checkout_url || null;

      if (input.clientToken && window.Paddle) {
        try {
          window.Paddle.Checkout.open({
            transactionId: payload.checkout.transaction_id,
            customer: {
              email: buyerEmail.trim().toLowerCase(),
            },
            settings: {
              successUrl: payload.checkout.success_url,
              allowLogout: false,
              variant: "one-page",
            },
          });
          return;
        } catch (openError) {
          if (!checkoutUrl) {
            throw openError;
          }
          redirectToHostedCheckout("overlay launch failed");
          return;
        }
      }

      if (checkoutUrl) {
        setError("Checkout is opening on the secure hosted checkout page...");
        window.location.href = checkoutUrl;
        return;
      }

      if (!input.clientToken) {
        throw new Error("Checkout is temporarily unavailable. Please contact support.");
      }

      throw new Error("Checkout is temporarily unavailable. Please contact support.");
    } catch (caughtError) {
      activeCheckoutRef.current = null;
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
          gap: 12,
          padding: 16,
          borderRadius: 16,
          background: "rgba(255,255,255,0.92)",
          border: "1px solid #d8ccae",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
          }}
        >
          <p style={{ flex: "1 1 260px", minWidth: 0, margin: 0, color: "#5b5444", lineHeight: 1.5, fontWeight: 600 }}>
            {"\u8d2d\u4e70\u90ae\u7bb1\u7528\u4e8e\u7ed3\u8d26\u548c\u767b\u5f55"}
            <Link href="/login">{"\u8bb8\u53ef\u8bc1\u4e2d\u5fc3"}</Link>
            {"\u3002"}
          </p>
          <label style={{ display: "block", flex: "1 1 320px", minWidth: 0, maxWidth: 420, width: "100%" }}>
            <input
              aria-label="\u8d2d\u4e70\u90ae\u7bb1"
              value={buyerEmail}
              onChange={(event) => {
                setBuyerEmail(event.target.value);
                if (error) {
                  setError(null);
                }
              }}
              placeholder="buyer@example.com"
              style={{
                boxSizing: "border-box",
                width: "100%",
                maxWidth: "100%",
                minWidth: 0,
                padding: 13,
                borderRadius: 12,
                border: "1px solid #c4b79d",
                background: "#fffdf8",
              }}
            />
          </label>
        </div>
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
            Checkout notice: {error}
          </p>
        ) : null}
      </section>

      <section style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
        {input.editions.map((edition) => {
          const monthlyBusy = busySlug === edition.monthlyOffer?.slug;
          const yearlyBusy = busySlug === edition.yearlyOffer?.slug;
          const anyBusy = busySlug !== null;
          const monthlyOffer = edition.monthlyOffer;
          const yearlyOffer = edition.yearlyOffer;
          const ctaIsExternal = edition.ctaHref ? isExternalHref(edition.ctaHref) : false;

          return (
            <article
              key={edition.slug}
              style={{
                display: "grid",
                gap: 14,
                padding: 20,
                borderRadius: 16,
                background:
                  edition.slug === "pro-plus"
                    ? "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,248,232,0.98) 100%)"
                    : "#ffffff",
                border: edition.slug === "pro-plus" ? "1px solid #cfa24c" : "1px solid #d8ccae",
                boxShadow:
                  edition.slug === "pro-plus"
                    ? "0 14px 32px rgba(108, 74, 16, 0.12)"
                    : "0 10px 26px rgba(46, 38, 20, 0.07)",
              }}
            >
              <div style={{ display: "grid", gap: 6 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "baseline", justifyContent: "space-between" }}>
                  <h2 style={{ margin: 0, fontSize: 26 }}>{edition.title}</h2>
                  <span style={{ color: "#4d3b19", fontSize: 15, fontWeight: 700 }}>{edition.priceLabel}</span>
                </div>
                <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.45 }}>{edition.summary}</p>
              </div>

              <ul style={{ margin: 0, paddingLeft: 18, color: "#3e382b", lineHeight: 1.55 }}>
                {edition.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>

              {edition.mode === "self_serve" && monthlyOffer && yearlyOffer ? (
                <div style={{ display: "grid", gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => void beginCheckout(monthlyOffer)}
                    disabled={anyBusy}
                    style={{
                      padding: "12px 14px",
                      borderRadius: 12,
                      border: "none",
                      background: "#1f3b63",
                      color: "#ffffff",
                      fontWeight: 700,
                      cursor: anyBusy ? "progress" : "pointer",
                    }}
                  >
                    {monthlyBusy ? "\u6b63\u5728\u6253\u5f00..." : "\u9009\u62e9\u6708\u4ed8"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void beginCheckout(yearlyOffer)}
                    disabled={anyBusy}
                    style={{
                      padding: "12px 14px",
                      borderRadius: 12,
                      border: "1px solid #b9ab8b",
                      background: "#ffffff",
                      color: "#3e382b",
                      fontWeight: 700,
                      cursor: anyBusy ? "progress" : "pointer",
                    }}
                  >
                    {yearlyBusy ? "\u6b63\u5728\u6253\u5f00..." : "\u9009\u62e9\u5e74\u5ea6"}
                  </button>
                </div>
              ) : null}

              {edition.mode !== "self_serve" && edition.ctaHref && edition.ctaLabel ? (
                ctaIsExternal ? (
                  <a
                    href={edition.ctaHref}
                    target={edition.ctaHref.startsWith("http") ? "_blank" : undefined}
                    rel={edition.ctaHref.startsWith("http") ? "noreferrer" : undefined}
                    style={{
                      display: "inline-block",
                      padding: "12px 14px",
                      borderRadius: 12,
                      border: "1px solid #c4b79d",
                      textDecoration: "none",
                      color: "#3e382b",
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    {edition.ctaLabel}
                  </a>
                ) : (
                  <Link
                    href={edition.ctaHref}
                    style={{
                      display: "inline-block",
                      padding: "12px 14px",
                      borderRadius: 12,
                      border: "1px solid #c4b79d",
                      textDecoration: "none",
                      color: "#3e382b",
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    {edition.ctaLabel}
                  </Link>
                )
              ) : null}
            </article>
          );
        })}
      </section>
    </>
  );
}
