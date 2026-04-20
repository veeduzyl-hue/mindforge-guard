import Link from "next/link";

import {
  pageBackgroundStyle,
  panelStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
} from "../siteChrome";

export default function LegalPage() {
  const legalSections = [
    {
      id: "terms",
      title: "\u6761\u6b3e",
      bullets: [
        "\u5546\u4e1a\u8bbf\u95ee\u4ec5\u8986\u76d6\u7ed3\u8d26\u3001\u8bb8\u53ef\u8bc1\u4ea4\u4ed8\u4e0e\u8d26\u6237\u53ef\u89c1\u6027\u3002",
        "\u672c\u5730 Guard CLI \u7684\u9a8c\u8bc1\u3001\u5b89\u88c5\u4e0e\u72b6\u6001\u4ecd\u4ee5\u8bb8\u53ef\u8bc1\u6587\u4ef6\u4e3a\u51c6\u3002",
        "\u672c\u7ad9\u4e0d\u63d0\u4f9b\u63a7\u5236\u5e73\u9762\u6216\u6267\u884c\u6743\u9650\u3002",
      ],
    },
    {
      id: "privacy",
      title: "\u9690\u79c1",
      bullets: [
        "License Hub \u53ef\u80fd\u5904\u7406\u8d2d\u4e70\u90ae\u7bb1\u3001\u8ba2\u5355\u72b6\u6001\u3001\u8d26\u5355\u72b6\u6001\u4e0e\u767b\u5f55\u4f1a\u8bdd\u6570\u636e\u3002",
        "Paddle \u7ee7\u7eed\u63d0\u4f9b\u81ea\u52a9\u7ed3\u8d26\u7684\u652f\u4ed8\u4e0e\u8d26\u5355\u4e8b\u4ef6\u3002",
        "\u8fd0\u8425\u90ae\u4ef6\u4ec5\u7528\u4e8e\u767b\u5f55\u3001\u4ea4\u4ed8\u4e0e\u652f\u6301\u6d41\u7a0b\u3002",
      ],
    },
    {
      id: "refunds",
      title: "\u9000\u6b3e",
      bullets: [
        "\u9000\u6b3e\u4e0e\u53d6\u6d88\u662f\u4e0d\u540c\u7684\u751f\u547d\u5468\u671f\u52a8\u4f5c\uff0c\u5206\u522b\u5904\u7406\u3002",
        "\u9000\u6b3e\u53ef\u80fd\u5bfc\u81f4\u76f8\u5173\u5546\u4e1a\u8bb8\u53ef\u8bc1\u5931\u6548\u6216\u505c\u7528\u3002",
        "\u8d26\u5355\u95ee\u9898\u9700\u7ed1\u5b9a\u8d2d\u4e70\u90ae\u7bb1\u4e0e\u8ba2\u5355\u4fe1\u606f\u3002",
      ],
    },
  ] as const;

  return (
    <main style={pageBackgroundStyle}>
      <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gap: 18 }}>
        <section style={panelStyle}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1 style={{ margin: 0, fontSize: 40, lineHeight: 1.04 }}>
              {"\u6761\u6b3e\u3001\u9690\u79c1\u548c\u9000\u6b3e\u3002"}
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <Link href="/#pricing" style={secondaryButtonStyle}>
                {"\u5b9a\u4ef7"}
              </Link>
              <Link href="/login" style={primaryButtonStyle}>
                {"\u767b\u5f55"}
              </Link>
            </div>
          </div>
        </section>

        <section style={{ display: "grid", gap: 12 }}>
          {legalSections.map((section) => (
            <article key={section.id} id={section.id} style={{ ...panelStyle, display: "grid", gap: 10 }}>
              <h2 style={{ margin: 0 }}>{section.title}</h2>
              <ul style={{ margin: 0, paddingLeft: 18, color: "#3e382b", lineHeight: 1.6 }}>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
