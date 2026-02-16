import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The ASX Curator | Australian Stock Market Intelligence",
  description:
    "Curated Australian stock market news, investment analysis, and market insights. The essential daily read for Australian investors.",
  keywords:
    "ASX, Australian stocks, investing, market news, stock market, Australia",
  openGraph: {
    title: "The ASX Curator",
    description: "Curated Australian stock market intelligence",
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
