import Link from "next/link";

import { getPaddleClientBootConfig } from "../../../lib/paddleCheckout";
import { PaddleTestClient } from "./PaddleTestClient";

export default function PaddleDevPage() {
  const config = getPaddleClientBootConfig();

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 32, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <h1>Paddle Phase 1 Test Checkout</h1>
      <p>
        This page is the bounded Phase 1 purchase harness for Pro Monthly, Pro Annual, Pro+ Monthly, and Pro+ Annual.
        It is a dev/test entry point only.
      </p>
      <p>
        <Link href="/">Back to License Hub home</Link>
      </p>
      <div style={{ padding: 20, borderRadius: 16, border: "1px solid #d1cab8", background: "#fffaf0" }}>
        <PaddleTestClient
          environment={config.environment}
          clientToken={config.clientToken}
          successUrl={config.successUrl}
          cancelUrl={config.cancelUrl}
          prices={config.prices}
        />
      </div>
      <p style={{ color: "#6a604b" }}>
        The checkout creates a Paddle transaction, records a pending commercial order in License Hub, and waits for the
        signed webhook to drive fulfillment.
      </p>
    </main>
  );
}
