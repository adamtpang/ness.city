import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Nessie } from "@/components/Nessie";
import { LiveBackground } from "@/components/LiveBackground";
import { Providers } from "@/components/Providers";

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

const NESS_DESCRIPTION =
  "The civic layer for builders. Problems become bounties become fixes — open tooling for ambitious communities.";

// Sitewide JSON-LD: one Organization node grounding the "Ness" entity (with
// a sameAs link so crawlers can tie it to the public repo) and one WebSite
// node publishers/authored by that Organization. Rendered on every page via
// the root layout so AI crawlers get consistent structured data everywhere,
// not just the homepage.
const NESS_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://ness.city/#organization",
      name: "Ness",
      url: "https://ness.city",
      logo: "https://ness.city/icon.svg",
      description: NESS_DESCRIPTION,
      sameAs: ["https://github.com/adamtpang/ness.city"],
      founder: {
        "@type": "Person",
        name: "Adam Pang",
        url: "https://adampang.com",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://ness.city/#website",
      url: "https://ness.city",
      name: "Ness",
      description: NESS_DESCRIPTION,
      publisher: { "@id": "https://ness.city/#organization" },
      author: { "@id": "https://ness.city/#organization" },
    },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Ness · civic layer for builders",
    template: "%s · Ness",
  },
  description: NESS_DESCRIPTION,
  metadataBase: new URL("https://ness.city"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ness · civic layer for builders",
    description: NESS_DESCRIPTION,
    url: "https://ness.city",
    siteName: "Ness",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ness · civic layer for builders",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(NESS_JSON_LD) }}
        />
        <Providers>
          <LiveBackground />
          <Header />
          {children}
        <footer className="mt-32 border-t border-ink-200 py-10">
          <div className="mx-auto max-w-5xl px-5 text-[12px] text-ink-500">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3 font-mono">
                <span>ness.city · v0.17</span>
                <span className="text-ink-300">·</span>
                <a
                  href="https://github.com/adamtpang/ness.city"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-ink-700 underline-offset-2 hover:underline"
                >
                  GitHub
                  <span aria-hidden className="text-ink-400">↗</span>
                </a>
                <span className="text-ink-300">·</span>
                <Link
                  href="/about"
                  className="text-ink-700 underline-offset-2 hover:underline"
                >
                  About
                </Link>
                <span className="text-ink-300">·</span>
                <Link
                  href="/contact"
                  className="text-ink-700 underline-offset-2 hover:underline"
                >
                  Contact
                </Link>
                <span className="text-ink-300">·</span>
                <Link
                  href="/privacy"
                  className="text-ink-700 underline-offset-2 hover:underline"
                >
                  Privacy
                </Link>
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
              Ness is an independent project operated by Adam Pang. It is not
              affiliated with Network School or ns.com.
            </div>
          </div>
          </footer>
          <Nessie />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
