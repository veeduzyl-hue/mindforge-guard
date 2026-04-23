import type { ReactNode } from "react";

export const metadata = {
  title: "MindForge Guard Licensing Center",
  description: "Purchase, license delivery, and customer portal access for MindForge Guard",
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
