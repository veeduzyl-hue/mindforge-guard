import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";

export const pageBackgroundStyle: CSSProperties = {
  minHeight: "100vh",
  padding: 24,
  background: "linear-gradient(180deg, #f4f1e8 0%, #e7dfcc 100%)",
};

export const panelStyle: CSSProperties = {
  background: "rgba(255,255,255,0.92)",
  borderRadius: 18,
  padding: 24,
  boxShadow: "0 18px 44px rgba(46, 38, 20, 0.10)",
  border: "1px solid rgba(148, 108, 43, 0.16)",
};

export const subtlePanelStyle: CSSProperties = {
  ...panelStyle,
  background: "rgba(255,250,240,0.9)",
};

export const eyebrowStyle: CSSProperties = {
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#946c2b",
  fontSize: 12,
  fontWeight: 700,
  margin: 0,
};

export const mutedTextStyle: CSSProperties = {
  color: "#5b5444",
  lineHeight: 1.65,
};

export const primaryButtonStyle: CSSProperties = {
  display: "inline-block",
  padding: "12px 18px",
  borderRadius: 999,
  border: "none",
  background: "#1f3b63",
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: 700,
};

export const secondaryButtonStyle: CSSProperties = {
  display: "inline-block",
  padding: "12px 18px",
  borderRadius: 999,
  border: "1px solid #b9ab8b",
  color: "#3e382b",
  textDecoration: "none",
  fontWeight: 700,
  background: "transparent",
};

export const pricingPageHref = "/#pricing";
export const mainSiteHref = "https://mindforge.run";

const navItems = [
  { href: "/product", label: "Product" },
  { href: pricingPageHref, label: "Pricing" },
  { href: "/#demos", label: "Demos" },
  { href: "/faq", label: "FAQ" },
  { href: "/login", label: "License Hub" },
] as const;

export function SiteChrome(input: {
  title: string;
  eyebrow: string;
  lede: string;
  children: ReactNode;
  hideNav?: boolean;
  showHeaderNote?: boolean;
  showFooter?: boolean;
}) {
  return (
    <main style={pageBackgroundStyle}>
      <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gap: 20 }}>
        <header style={{ ...panelStyle, display: "grid", gap: 16 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "grid", gap: 8 }}>
              <p style={eyebrowStyle}>{input.eyebrow}</p>
              <h1 style={{ margin: 0, fontSize: 42, lineHeight: 1.05 }}>{input.title}</h1>
            </div>
            {input.hideNav ? null : (
              <nav style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      textDecoration: "none",
                      color: "#3e382b",
                      fontWeight: 600,
                      padding: "8px 12px",
                      borderRadius: 999,
                      background: "rgba(244, 241, 232, 0.95)",
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>
          <p style={{ ...mutedTextStyle, margin: 0, maxWidth: 860, fontSize: 18 }}>{input.lede}</p>
          {input.showHeaderNote === false ? null : (
            <div
              style={{
                borderRadius: 16,
                padding: 16,
                background: "#fff8e2",
                border: "1px solid #d8bd74",
                color: "#5b4720",
              }}
            >
              MindForge Guard License Hub is the bounded purchase, billing, signed license delivery, and account
              center for MindForge Guard. It supports secure checkout, license delivery, and account visibility without
              changing Guard CLI behavior or expanding authority into the Guard main path.
            </div>
          )}
        </header>

        {input.children}

        {input.showFooter === false ? null : (
          <footer style={{ ...subtlePanelStyle, display: "grid", gap: 10 }}>
            <p style={{ margin: 0, fontWeight: 700 }}>MindForge Guard commercial delivery stays bounded.</p>
            <p style={{ ...mutedTextStyle, margin: 0 }}>
              No control-plane, dashboard-first, or autonomous execution claims are made here. Community stays outside
              payment, commercial checkout flows through License Hub, and Enterprise remains contact-led.
            </p>
          </footer>
        )}
      </div>
    </main>
  );
}
