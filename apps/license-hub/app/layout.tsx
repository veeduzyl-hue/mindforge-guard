import type { ReactNode } from "react";

export const metadata = {
  title: "MindForge License Hub",
  description: "Bounded license issuance subsystem skeleton for MindForge Guard",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          background: "#f4f1e8",
          color: "#1b1b18",
        }}
      >
        {children}
      </body>
    </html>
  );
}
