import type { Metadata } from "next";
import Board from "../page";

/**
 * /townhall renders the civic board (Problem -> Priority -> Solution -> Bounty).
 *
 * The board used to live only at the home page, and this route redirected there.
 * Now that the apex serves the member rating app (see middleware.ts), that
 * redirect left the board with no reachable URL — so /townhall is its home again.
 * It re-uses the same component as `app/page.tsx` rather than duplicating it, so
 * board work lands in both places automatically.
 *
 * Problem detail pages still live at /townhall/[slug].
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Townhall",
  description: "The community solves its own problems, in the open.",
  alternates: { canonical: "/townhall" },
};

export default function TownhallPage() {
  return <Board />;
}
