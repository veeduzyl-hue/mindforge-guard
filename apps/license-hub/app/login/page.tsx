"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [devMagicLink, setDevMagicLink] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const error = searchParams.get("error");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setDevMagicLink(null);

    const response = await fetch("/api/auth/request-magic-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();
    setSubmitting(false);

    if (!response.ok) {
      setMessage(result.error || "Request failed");
      return;
    }

    setMessage(`Magic link prepared for ${result.email}.`);
    if (result.devMagicLink) {
      setDevMagicLink(result.devMagicLink);
    }
  }

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: 32, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <h1>License Hub Login</h1>
      <p>Enter the email used for your purchase to request a one-time sign-in link.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="buyer@example.com"
          required
          style={{ padding: 12, borderRadius: 8, border: "1px solid #c9c2b2" }}
        />
        <button
          type="submit"
          disabled={submitting}
          style={{ padding: 12, borderRadius: 8, border: 0, background: "#1b1b18", color: "white" }}
        >
          {submitting ? "Sending..." : "Request Magic Link"}
        </button>
      </form>

      {message ? <p style={{ marginTop: 16 }}>{message}</p> : null}
      {error ? <p style={{ marginTop: 16, color: "#9a2d20" }}>Last login attempt: {error}</p> : null}
      {devMagicLink ? (
        <p style={{ marginTop: 16 }}>
          Dev link: <a href={devMagicLink}>{devMagicLink}</a>
        </p>
      ) : null}
    </main>
  );
}
