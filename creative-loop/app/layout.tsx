import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CreativeLoop — Automated Weekly Marketing Creatives",
  description:
    "Get a full week of AI-generated social media posts delivered to your inbox every Monday. No effort, no templates — just great content.",
  openGraph: {
    title: "CreativeLoop",
    description: "Your weekly marketing content on autopilot.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
