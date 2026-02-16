import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stockade | Australian Market Intelligence",
  description:
    "Curated Australian stock market news, investment analysis, and market insights. The essential daily read for ASX investors.",
  keywords:
    "ASX, Australian stocks, investing, market news, stock market, Australia",
  openGraph: {
    title: "Stockade",
    description: "Australian market intelligence, curated hourly",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
