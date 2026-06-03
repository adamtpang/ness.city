import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * POST /api/nessie  { messages: [{ role: "user"|"assistant", content }] }
 *
 * Nessie's conversational brain. Calls the Anthropic API directly (no
 * SDK dependency). If ANTHROPIC_API_KEY is not set, returns a friendly
 * fallback so the widget still works.
 *
 * The autonomous 24/7 worker (the OpenClaw instance on the VPS that
 * works the priority queue) is a separate process; this endpoint is the
 * reactive chat the agent and users share.
 */

const SYSTEM = `You are Nessie, the AI agent of ness.city, an open-source civic coordination engine for the Network School (NS) community in Forest City, Malaysia.

The engine: anyone surfaces a problem, the community sorts it by importance and urgency, anyone can explain or propose solutions, patrons fund bounties, and Fixers ship and document the fix. Your job is to help the community solve its own problems and to learn how members are doing.

You believe, with David Deutsch, that problems are inevitable and problems are soluble. You are concise, warm, optimistic, and practical. Two or three sentences per reply unless asked for more.

When a conversation starts, briefly interview the member about their NS experience: how is it going (0 to 5), and what would make it a 5. Listen first. Then, if useful, point them to the engine to surface a problem. Never use em dashes.`;

export async function POST(req: Request) {
  let body: { messages?: unknown };
  try {
    body = (await req.json()) as { messages?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const clean = messages
    .filter(
      (m): m is { role: string; content: string } =>
        !!m &&
        typeof m === "object" &&
        (("role" in m && (m as { role: unknown }).role === "user") ||
          (m as { role: unknown }).role === "assistant") &&
        typeof (m as { content: unknown }).content === "string",
    )
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json({
      ok: true,
      reply:
        "My brain (the 24/7 agent) is not wired up here yet, but I am listening. How is your NS experience right now, 0 to 5, and what would make it a 5?",
      degraded: true,
    });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-latest",
        max_tokens: 400,
        system: SYSTEM,
        messages: clean.length ? clean : [{ role: "user", content: "Hi" }],
      }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      return NextResponse.json(
        { ok: false, error: `Nessie upstream ${res.status}`, detail: t.slice(0, 200) },
        { status: 502 },
      );
    }
    const data = (await res.json()) as { content?: Array<{ text?: string }> };
    const reply = (data.content ?? [])
      .map((b) => b.text ?? "")
      .join("")
      .trim();
    return NextResponse.json({ ok: true, reply: reply || "..." });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Nessie error" },
      { status: 500 },
    );
  }
}
