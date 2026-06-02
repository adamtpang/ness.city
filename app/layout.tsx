import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Nessie } from "@/components/Nessie";
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

const NESS_DESCRIPTION = "A civic coordination platform.";

export const metadata: Metadata = {
  title: {
    default: "Ness",
    template: "%s · Ness",
  },
  description: NESS_DESCRIPTION,
  metadataBase: new URL("https://ness.city"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ness",
    description: NESS_DESCRIPTION,
    url: "https://ness.city",
    siteName: "Ness",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ness",
    description: NESS_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="min-h-dvh bg-paper-warm font-sans text-ink-950 antialiased">
        <LiveBackground />
        <Header />
        {children}
        <footer className="mt-32 border-t border-ink-200 py-10">
          <div className="mx-auto max-w-5xl px-5 text-[12px] text-ink-500">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3 font-mono">
                <span>ness.city · v0.16</span>
                <span className="text-ink-300">·</span>
                <a
                  href="https://github.com/adamtpang/ness"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-ink-700 underline-offset-2 hover:underline"
                >
                  GitHub
                  <span aria-hidden className="text-ink-400">↗</span>
                </a>
                <span className="text-ink-300">·</span>
                <a
                  href="https://discord.gg/fNmdFWcMU"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-ink-700 underline-offset-2 hover:underline"
                >
                  Discord
                  <span aria-hidden className="text-ink-400">↗</span>
                </a>
                <span className="text-ink-300">·</span>
                <a
                  href="https://interneta.world"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-ink-700 underline-offset-2 hover:underline"
                >
                  interneta.world
                  <span aria-hidden className="text-ink-400">↗</span>
                </a>
              </div>
              <span>MIT licensed. Built bottom-up.</span>
            </div>
            <div className="mt-5 border-t border-ink-100 pt-4 text-[11px] text-ink-400">
              Independent project. Not affiliated with any specific community.
              Ness is its own brand and operates separately.
            </div>
          </div>
        </footer>
        <Nessie />
        <Analytics />
      </body>
    </html>
  );
}
