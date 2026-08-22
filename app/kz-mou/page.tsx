import type { Metadata } from "next";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import ReactMarkdown from "react-markdown";
import { FadeIn } from "@/components/motion/FadeIn";

/**
 * /kz-mou
 *
 * English translation of the official Kazakhstan Ministry of AI and
 * Digital Development press release announcing the Network School
 * campus MOU. Sourced from context/claude/kz-network-school-mou-press-
 * release-en.md (Cowork research capture), surfaced here as a public
 * page since it directly informs the community's go/stay decisions.
 */

const SOURCE_PATH = path.join(
  process.cwd(),
  "context/claude/kz-network-school-mou-press-release-en.md",
);

export const metadata: Metadata = {
  title: "Kazakhstan MOU (English Translation)",
  description:
    "English translation of the official Kazakhstan Ministry of AI and Digital Development press release announcing the Network School campus MOU.",
  alternates: { canonical: "https://ness.city/kz-mou" },
  openGraph: {
    title: "Kazakhstan Network School MOU (English Translation)",
    description:
      "Official Kazakhstan government press release on the Network School campus MOU, translated to English.",
    url: "https://ness.city/kz-mou",
    siteName: "Ness",
    type: "article",
  },
};

export default function KzMouPage() {
  const content = fs.readFileSync(SOURCE_PATH, "utf-8");

  return (
    <main className="mx-auto max-w-3xl px-5 pb-28 pt-12">
      <FadeIn y={6}>
        <Link
          href="/"
          className="text-sm text-neutral-500 hover:text-neutral-800"
        >
          ← Ness
        </Link>
        <article className="prose prose-neutral mt-6 max-w-none prose-headings:font-semibold prose-a:text-neutral-900">
          <ReactMarkdown>{content}</ReactMarkdown>
        </article>
      </FadeIn>
    </main>
  );
}
