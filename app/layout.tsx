import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

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
  title: "Ness — The civic layer for Network School",
  description:
    "Surface problems, document root causes, ship solutions, earn social credit. The community OS for Network School.",
  metadataBase: new URL("https://ness.city"),
  openGraph: {
    title: "Ness — The civic layer for Network School",
    description: "Bottom-up problem solving for Network School.",
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
        <Header />
        {children}
        <footer className="mt-32 border-t border-ink-200 py-10">
          <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 text-[12px] text-ink-500 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-mono">ness.city · v0.1</span>
            <span>Built bottom-up by citizens of Network School.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
