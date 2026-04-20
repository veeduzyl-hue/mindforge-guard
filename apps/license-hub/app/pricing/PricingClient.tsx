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
    setError(`Overlay checkout could not finish (${reason}). Switching to the secure hosted checkout page...`);
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
        setError("Embedded checkout is unavailable. Switching to the secure hosted checkout page...");
        window.location.href = checkoutUrl;
        return;
      }

      if (!input.clientToken) {
        throw new Error("Paddle client token is missing, so embedded checkout cannot start.");
      }

      throw new Error("Paddle.js has not loaded yet, and no hosted checkout URL was returned.");
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
          gap: 14,
          padding: 22,
          borderRadius: 18,
          background: "#fffaf0",
          border: "1px solid #d8ccae",
        }}
      >
        <div style={{ display: "grid", gap: 6 }}>
          <h2 style={{ margin: 0 }}>Pricing grid</h2>
          <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.65 }}>
            Choose the edition that matches your stage today, then use one purchase email for checkout, License Hub
            access, and future account lookup.
          </p>
        </div>
        <label style={{ display: "grid", gap: 8 }}>
          <span style={{ fontWeight: 700 }}>Purchase email</span>
          <input
            value={buyerEmail}
            onChange={(event) => {
              setBuyerEmail(event.target.value);
              if (error) {
                setError(null);
              }
            }}
            placeholder="buyer@example.com"
            style={{ padding: 14, borderRadius: 12, border: "1px solid #c4b79d" }}
          />
        </label>
        <p style={{ margin: 0, color: "#5b5444" }}>
          Pro and Pro+ stay self-serve. Buy with the email that should own the commercial access, then use that same
          email later for <Link href="/login">License Hub login</Link>.
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
        {input.editions.map((edition) => {
          const monthlyBusy = busySlug === edition.monthlyOffer?.slug;
          const yearlyBusy = busySlug === edition.yearlyOffer?.slug;
          const anyBusy = busySlug !== null;
          const monthlyOffer = edition.monthlyOffer;
          const yearlyOffer = edition.yearlyOffer;

          return (
            <article
              key={edition.slug}
              style={{
                display: "grid",
                gap: 14,
                padding: 22,
                borderRadius: 18,
                background:
                  edition.slug === "pro-plus"
                    ? "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,248,232,0.98) 100%)"
                    : "#ffffff",
                border: edition.slug === "pro-plus" ? "1px solid #cfa24c" : "1px solid #d8ccae",
                boxShadow:
                  edition.slug === "pro-plus"
                    ? "0 18px 40px rgba(108, 74, 16, 0.14)"
                    : "0 12px 32px rgba(46, 38, 20, 0.08)",
              }}
            >
              <div style={{ display: "grid", gap: 6 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                  <p style={{ margin: 0, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#946c2b" }}>
                    {edition.eyebrow}
                  </p>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "5px 10px",
                      borderRadius: 999,
                      background: edition.slug === "pro-plus" ? "#f8d98b" : "#f4efe3",
                      color: "#4d3b19",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {edition.priceLabel}
                  </span>
                </div>
                <h2 style={{ margin: 0, fontSize: 28 }}>{edition.title}</h2>
                <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.65 }}>{edition.summary}</p>
              </div>

              <div
                style={{
                  display: "grid",
                  gap: 10,
                  padding: 14,
                  borderRadius: 14,
                  background: "#fffaf0",
                  border: "1px solid #e1d4b4",
                  color: "#3e382b",
                }}
              >
                <div>
                  <strong>{edition.audienceLabel}</strong>
                  <p style={{ margin: "6px 0 0", color: "#5b5444", lineHeight: 1.6 }}>{edition.audience}</p>
                </div>
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                <div>
                  <strong>What is included</strong>
                  <p style={{ margin: "6px 0 0", color: "#5b5444", lineHeight: 1.6 }}>{edition.includesLead}</p>
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, color: "#3e382b", lineHeight: 1.7 }}>
                  {edition.includes.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  padding: 14,
                  borderRadius: 14,
                  background: edition.slug === "community" ? "#f7f2e8" : "#f9f5eb",
                  border: "1px solid #e1d4b4",
                }}
              >
                <strong>Upgrade path</strong>
                <p style={{ margin: "6px 0 0", color: "#5b5444", lineHeight: 1.6 }}>{edition.upgradeNote}</p>
              </div>

              {edition.mode === "self_serve" && monthlyOffer && yearlyOffer ? (
                <div
                  style={{
                    display: "grid",
                    gap: 12,
                    padding: 16,
                    borderRadius: 14,
                    background: "#fffaf0",
                    border: "1px solid #e1d4b4",
                  }}
                >
                  <strong>Choose your billing cadence</strong>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "6px 10px",
                        borderRadius: 999,
                        background: "#ffffff",
                        border: "1px solid #d8ccae",
                        color: "#5b5444",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      Monthly
                    </span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "6px 10px",
                        borderRadius: 999,
                        background: "#ffffff",
                        border: "1px solid #d8ccae",
                        color: "#5b5444",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      Yearly
                    </span>
                  </div>
                  {edition.billingNote ? (
                    <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>{edition.billingNote}</p>
                  ) : null}
                  <div style={{ display: "grid", gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => void beginCheckout(monthlyOffer)}
                      disabled={anyBusy}
                      style={{
                        padding: "13px 16px",
                        borderRadius: 12,
                        border: "none",
                        background: "#1f3b63",
                        color: "#ffffff",
                        fontWeight: 700,
                        cursor: anyBusy ? "progress" : "pointer",
                      }}
                    >
                      {monthlyBusy ? "Starting checkout..." : "Choose Monthly"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void beginCheckout(yearlyOffer)}
                      disabled={anyBusy}
                      style={{
                        padding: "13px 16px",
                        borderRadius: 12,
                        border: "1px solid #b9ab8b",
                        background: "#ffffff",
                        color: "#3e382b",
                        fontWeight: 700,
                        cursor: anyBusy ? "progress" : "pointer",
                      }}
                    >
                      {yearlyBusy ? "Starting checkout..." : "Choose Yearly"}
                    </button>
                  </div>
                </div>
              ) : null}

              {edition.mode === "community" && edition.ctaHref && edition.ctaLabel ? (
                <Link
                  href={edition.ctaHref}
                  style={{
                    display: "inline-block",
                    padding: "13px 16px",
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
              ) : null}

              {edition.mode === "contact" && edition.ctaHref && edition.ctaLabel ? (
                <Link
                  href={edition.ctaHref}
                  style={{
                    display: "inline-block",
                    padding: "13px 16px",
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
              ) : null}
            </article>
          );
        })}
      </section>
    </>
  );
}
