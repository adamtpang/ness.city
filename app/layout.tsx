import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Header } from "@/components/Header";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { LiveBackground } from "@/components/LiveBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ness · The civic layer for builders",
  description:
    "Surface problems. Diagnose root causes. Fund the fixes in USDC. Solvers earn karma. Patrons earn attribution. Open-source community tooling.",
  metadataBase: new URL("https://ness.city"),
  openGraph: {
    title: "Ness · The civic layer for builders",
    description:
      "Surface problems. Diagnose root causes. Fund the fixes. Open-source community tooling.",
    url: "https://ness.city",
    siteName: "Ness",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="min-h-dvh bg-paper font-sans text-ink-950 antialiased">
        <LiveBackground />
        <Header />
        {children}
        <footer className="mt-32 border-t border-ink-200 py-10">
          <div className="mx-auto max-w-5xl px-5 text-[12px] text-ink-500">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3 font-mono">
                <span>ness.city · v0.9</span>
                <span className="text-ink-300">·</span>
                <span>
                  a node in{" "}
                  <span className="text-ink-700">interneta.world</span>{" "}
                  <span className="text-ink-400">(soon)</span>
                </span>
              </div>
              <span>Built bottom-up by citizens, for citizens.</span>
            </div>
            <div className="mt-5 border-t border-ink-100 pt-4 text-[11px] text-ink-400">
              <span className="font-mono uppercase tracking-[0.18em] text-ink-500">
                Independent project
              </span>{" "}
              · Not affiliated with Network School (ns.com). Ness is its own
              brand and operates separately.
            </div>
          </div>
        </footer>
        <FeedbackWidget />
        <Analytics />
      </body>
    </html>
  );
}
