import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Ness — Network School's civic layer",
  description:
    "Surface problems, document root causes, ship solutions, earn social credit. The community OS for Network School.",
  metadataBase: new URL("https://ness.city"),
  openGraph: {
    title: "Ness — Network School's civic layer",
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
    <html lang="en">
      <body className="min-h-dvh font-sans">
        <Header />
        {children}
        <footer className="mt-24 border-t border-ink-800 py-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center justify-between text-[12px] text-ink-500">
            <span className="font-mono">ness.city · v0.1</span>
            <span>Built bottom-up by citizens of Network School.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
