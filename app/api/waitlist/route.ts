import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { addToWaitlist, ensureWaitlistTable, waitlistCount } from "@/lib/waitlist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function GET() {
  if (!isDbConfigured) return NextResponse.json({ ok: true, count: 0 });
  try {
    await ensureWaitlistTable();
    return NextResponse.json({ ok: true, count: await waitlistCount() });
  } catch {
    return NextResponse.json({ ok: true, count: 0 });
  }
}

export async function POST(req: Request) {
  if (!isDbConfigured) {
    return NextResponse.json(
      { ok: false, error: "Database not configured" },
      { status: 503 },
    );
  }
  let body: { email?: unknown; note?: unknown; source?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const email =
    typeof body.email === "string" ? body.email.trim().slice(0, 200) : "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid email." },
      { status: 400 },
    );
  }
  const note =
    typeof body.note === "string" && body.note.trim()
      ? body.note.trim().slice(0, 500)
      : null;
  const source =
    typeof body.source === "string" && body.source.trim()
      ? body.source.trim().slice(0, 80)
      : "join";

  try {
    await ensureWaitlistTable();
    await addToWaitlist(email, note, source);
    return NextResponse.json({ ok: true, count: await waitlistCount() });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Could not sign up" },
      { status: 500 },
    );
  }
}
