import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { listProblemsWithCounts } from "@/lib/db/queries";
import { agentAuthorized, NESSIE_IDENTITY } from "@/lib/agent-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITE = "https://ness.city";

/**
 * GET /api/agent/queue
 *
 * The priority queue for the 24/7 worker: open problems, most important
 * first (importance = community upvotes). Bearer-token gated. This is the
 * read half of the agent write-path; the agent reads here, then posts an
 * explanation or proposal via /api/agent/comment or /api/agent/proposal.
 */
export async function GET(req: Request) {
  if (!agentAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!isDbConfigured) {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }

  const all = await listProblemsWithCounts();
  const queue = all
    .filter((p) => p.status !== "solved")
    .slice(0, 25)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      category: p.category,
      status: p.status,
      importance: p.upvotes,
      explanations: p.commentCount,
      solutions: p.proposalCount,
      url: `${SITE}/townhall/${p.slug}`,
    }));

  return NextResponse.json({
    ok: true,
    agent: NESSIE_IDENTITY.handle,
    mandate:
      "Work the queue. Pick one problem and add either an explanation that sharpens the root cause, or a concrete solution proposal. Propose and document, never self-approve. Humans verify and release bounties.",
    count: queue.length,
    queue,
  });
}
