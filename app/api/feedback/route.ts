import { NextResponse } from "next/server";
import { getDb, isDbConfigured, schema } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE = 4000;

type Body = {
  rating?: unknown;
  message?: unknown;
  page?: unknown;
  referrer?: unknown;
};

function clean(value: unknown, max = 200): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

const RATING_LABELS: Record<number, string> = {
  1: "Broken",
  2: "Rough",
  3: "Fine",
  4: "Good",
  5: "Loved it",
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  const rating = typeof body.rating === "number" ? body.rating : NaN;
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return new NextResponse("Rating must be an integer 1-5", { status: 400 });
  }

  const message = clean(body.message, MAX_MESSAGE);
  const page = clean(body.page, 200) ?? "/";
  const referrer = clean(body.referrer, 200);
  const at = new Date().toISOString();

  // Always log to server-side console (visible in Vercel function logs).
  // Adam can review via the Vercel dashboard.
  console.log(
    JSON.stringify({
      type: "ness.feedback",
      at,
      rating,
      label: RATING_LABELS[rating],
      page,
      referrer,
      message: message ?? null,
    }),
  );

  // Persist to Postgres if configured. Best-effort; failures don't block.
  if (isDbConfigured) {
    try {
      const db = getDb();
      await db.insert(schema.feedback).values({
        rating,
        message: message ?? null,
        page,
        referrer: referrer ?? null,
        meta: null,
      });
    } catch (err) {
      console.error("feedback db insert failed", err);
    }
  }

  // Optional: forward to a Discord webhook if configured.
  // Adam sets DISCORD_FEEDBACK_WEBHOOK in Vercel env, no code changes needed.
  const webhook = process.env.DISCORD_FEEDBACK_WEBHOOK;
  if (webhook) {
    try {
      const lines = [
        `**Feedback ${rating}/5** (${RATING_LABELS[rating]}) on \`${page}\``,
        message ? `> ${message.split("\n").join("\n> ")}` : "_(no comment)_",
        referrer ? `_referrer: ${referrer}_` : null,
      ].filter(Boolean);
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: lines.join("\n"),
          username: "Ness Feedback",
        }),
      });
    } catch {
      // Webhook failures shouldn't block the user response. Log only.
      console.error("Discord webhook failed");
    }
  }

  return NextResponse.json({ ok: true });
}
