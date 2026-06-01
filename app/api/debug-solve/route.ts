import { NextResponse } from "next/server";
import { getProblemBySlug } from "@/lib/db/queries";
import { isDbConfigured } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * TEMPORARY diagnostic route. Runs the same relational query the
 * /solve/[slug] page uses, in a try/catch, and returns the real error.
 * Delete after the 500 is root-caused.
 */
export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug") ?? "non-existent-slug";
  const out: Record<string, unknown> = { isDbConfigured };
  try {
    const row = await getProblemBySlug(slug);
    out.ok = true;
    out.found = !!row;
  } catch (e) {
    out.ok = false;
    out.errorName = e instanceof Error ? e.name : typeof e;
    out.errorMessage = e instanceof Error ? e.message : String(e);
    out.stack = e instanceof Error ? (e.stack ?? "").split("\n").slice(0, 6) : undefined;
    // postgres-js attaches extra fields
    const anyE = e as Record<string, unknown>;
    out.pgCode = anyE?.code;
    out.pgDetail = anyE?.detail;
    out.pgHint = anyE?.hint;
    out.pgRoutine = anyE?.routine;
  }
  return NextResponse.json(out);
}
