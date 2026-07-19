import { timingSafeEqual } from "node:crypto";
import { isDbConfigured } from "@/lib/db";
import { getDashboardRows } from "@/lib/members/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/members/export?token=AGENT_API_TOKEN
 * CSV of the full ranked table for the core team. Token-gated, never cached.
 */
function tokenOk(provided: string): boolean {
  const expected = process.env.AGENT_API_TOKEN ?? "";
  if (!expected) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function csvCell(v: string | number): string {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  if (!tokenOk(token)) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!isDbConfigured) {
    return new Response("Database not configured", { status: 503 });
  }

  const rows = await getDashboardRows();
  const header = ["rank", "handle", "display_name", "building", "shrunk_score", "mean", "median", "ratings", "raters", "insufficient_data"];
  const lines = [header.join(",")];
  rows.forEach((r, i) => {
    lines.push(
      [
        i + 1,
        r.handle,
        r.displayName,
        r.building ?? "",
        r.shrunk.toFixed(4),
        r.mean.toFixed(4),
        r.median.toFixed(2),
        r.ratings,
        r.raters,
        r.insufficient ? "yes" : "no",
      ].map(csvCell).join(","),
    );
  });

  return new Response(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ness-members.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
