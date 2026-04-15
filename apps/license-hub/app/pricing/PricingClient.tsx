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

type CheckoutOffer = CommercialOffer & {
  kind: "paddle_checkout";
  priceKey: string;
};

function isCheckoutOffer(offer: CommercialOffer): offer is CheckoutOffer {
  return offer.kind === "paddle_checkout" && typeof offer.priceKey === "string" && offer.priceKey.length > 0;
}

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
          setCheckoutState("completed");
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
    setCheckoutState("switching_to_hosted");
    window.location.href = activeCheckout.checkoutUrl;
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
        setCheckoutState("opening");
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
          setCheckoutState("opened");
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
        setCheckoutState("switching_to_hosted");
        window.location.href = checkoutUrl;
        return;
      }

      if (!input.clientToken) {
        throw new Error("Paddle client token is missing, so embedded checkout cannot start.");
      }

      throw new Error("Paddle.js has not loaded yet, and no hosted checkout URL was returned.");
    } catch (caughtError) {
      activeCheckoutRef.current = null;
      setCheckoutState("error");
      setError(caughtError instanceof Error ? caughtError.message : String(caughtError));
    } finally {
      setBusySlug(null);
    }
  }

  function requireCheckoutOffer(priceKey: string): CheckoutOffer {
    const offer = input.offers.find((candidate) => isCheckoutOffer(candidate) && candidate.priceKey === priceKey);
    if (!offer || !isCheckoutOffer(offer)) {
      throw new Error(`Missing checkout offer for ${priceKey}`);
    }
    return offer;
  }

  const proMonthly = requireCheckoutOffer("pro_monthly");
  const proYearly = requireCheckoutOffer("pro_annual");
  const proPlusMonthly = requireCheckoutOffer("pro_plus_monthly");
  const proPlusYearly = requireCheckoutOffer("pro_plus_annual");

  const cards = [
    {
      slug: "community",
      eyebrow: "Community",
      title: "Community",
      summary: "Free for open-source and repository-level use when commercial checkout is not needed.",
      bullets: [
        "Current governance state",
        "Policy validation and audit baseline",
        "Snapshot and action classification",
        "No commercial checkout or commercial license delivery",
      ],
      actions: [
        {
          kind: "link" as const,
          href: "/docs",
          label: "Read docs",
          tone: "secondary" as const,
        },
      ],
    },
    {
      slug: "pro",
      eyebrow: "Commercial",
      title: "Pro",
      summary: "For individual developers and small teams that need commercial access and governance trend visibility.",
      bullets: [
        "Everything in Community",
        "Drift timeline",
        "Commercial license delivery",
        "Account and order visibility",
      ],
      actions: [
        {
          kind: "checkout" as const,
          offer: proMonthly,
          label: "Buy Pro Monthly \u2014 $19 / month",
        },
        {
          kind: "checkout" as const,
          offer: proYearly,
          label: "Buy Pro Yearly \u2014 $199 / year",
        },
      ],
    },
    {
      slug: "pro-plus",
      eyebrow: "Commercial",
      title: "Pro+",
      summary: "For teams that need deeper comparison and correlation signals in commercial use.",
      bullets: [
        "Everything in Pro",
        "Drift compare",
        "Assoc correlate",
        "Deeper change and signal analysis",
      ],
      actions: [
        {
          kind: "checkout" as const,
          offer: proPlusMonthly,
          label: "Buy Pro+ Monthly \u2014 $49 / month",
        },
        {
          kind: "checkout" as const,
          offer: proPlusYearly,
          label: "Buy Pro+ Yearly \u2014 $499 / year",
        },
      ],
    },
    {
      slug: "enterprise",
      eyebrow: "Enterprise",
      title: "Enterprise",
      summary:
        "For procurement-led adoption, organizational rollout, and commercial coordination beyond self-serve checkout.",
      bullets: [
        "Contact-led purchasing",
        "Organizational adoption path",
        "Commercial coordination",
        "Not sold through the current self-serve checkout",
      ],
      actions: [
        {
          kind: "link" as const,
          href: "/contact",
          label: "Contact sales",
          tone: "primary" as const,
        },
      ],
    },
  ] as const;

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
          Use the same email later for <Link href="/login">account access</Link> and commercial purchase visibility.
        </p>
        {checkoutState !== "idle" ? (
          <p style={{ margin: 0, color: "#5b5444" }}>
            Checkout status: <strong>{checkoutState}</strong>
          </p>
        ) : null}
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

      <section style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
        {cards.map((card) => {
          const isCommercialCard = card.actions.some((action) => action.kind === "checkout");

          return (
            <article
              key={card.slug}
              style={{
                display: "grid",
                gap: 14,
                padding: 22,
                borderRadius: 18,
                background: "#ffffff",
                border: "1px solid #d8ccae",
                boxShadow: "0 12px 32px rgba(46, 38, 20, 0.08)",
                alignContent: "start",
              }}
            >
              <div style={{ display: "grid", gap: 6 }}>
                <p style={{ margin: 0, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#946c2b" }}>
                  {card.eyebrow}
                </p>
                <h2 style={{ margin: 0, fontSize: 28 }}>{card.title}</h2>
                <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.65 }}>{card.summary}</p>
              </div>

              <ul style={{ margin: 0, paddingLeft: 18, color: "#3e382b", lineHeight: 1.7 }}>
                {card.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>

              <div style={{ display: "grid", gap: 10, marginTop: "auto" }}>
                {card.actions.map((action) => {
                  if (action.kind === "checkout") {
                    const isBusy = busySlug === action.offer.slug;

                    return (
                      <button
                        key={action.label}
                        type="button"
                        onClick={() => void beginCheckout(action.offer)}
                        disabled={isBusy}
                        style={{
                          padding: "13px 16px",
                          borderRadius: 12,
                          border: "none",
                          background: "#1f3b63",
                          color: "#ffffff",
                          fontWeight: 700,
                          cursor: isBusy ? "progress" : "pointer",
                          textAlign: "left",
                        }}
                      >
                        {isBusy ? "Starting checkout..." : action.label}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      style={{
                        display: "inline-block",
                        padding: "13px 16px",
                        borderRadius: 12,
                        border: action.tone === "primary" ? "none" : "1px solid #c4b79d",
                        textDecoration: "none",
                        color: action.tone === "primary" ? "#ffffff" : "#3e382b",
                        fontWeight: 700,
                        background: action.tone === "primary" ? "#1f3b63" : "transparent",
                        textAlign: "left",
                      }}
                    >
                      {action.label}
                    </Link>
                  );
                })}
              </div>

              {isCommercialCard ? (
                <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: "#7b715d" }}>
                  Self-serve checkout opens from the buttons above and keeps the existing purchase wiring unchanged.
                </p>
              ) : null}
            </article>
          );
        })}
      </section>
    </>
  );
}
