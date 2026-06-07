import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST /api/nslink/scan
 *
 * Body: { image: string }, a base64 data URI of a router label.
 * Returns: { serial_number, default_ssid, default_pass, target_ssid, new_pass }
 *
 * Reads the label with Claude vision via the same ANTHROPIC_API_KEY that
 * powers Nessie, so the router tool needs no separate provider key. The user
 * fills target_ssid + new_pass on the client; the bot consumes the CSV.
 */

const PROMPT = `You are reading a WiFi router label. Extract these fields and return STRICT JSON only:
- serial_number (labelled "S/N")
- default_ssid (labelled "2.4G SSID" or "SSID"; if there are several, prefer the 2.4G one, e.g. "B4B@celcomdigi_2.4Ghz")
- default_pass (labelled "Wireless Password/PIN" or "Password")
- target_ssid (always null, the operator fills it later)
- new_pass (always null, the operator fills it later)

If a field is not visible, use null. Do not guess. Return ONLY raw JSON, no markdown, no prose.`;

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not set. Add it in the Vercel project env vars." },
      { status: 500 },
    );
  }

  let body: { image?: string };
  try {
    body = (await req.json()) as { image?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { image } = body;
  if (!image) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(image);
  if (!m) {
    return NextResponse.json(
      { error: "Image must be a base64 data URL" },
      { status: 400 },
    );
  }
  const mediaType = m[1];
  const data = m[2];

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-latest",
        max_tokens: 400,
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: mediaType, data } },
              { type: "text", text: PROMPT },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `Scanner upstream ${res.status}`, detail: t.slice(0, 200) },
        { status: 502 },
      );
    }

    const out = (await res.json()) as { content?: Array<{ text?: string }> };
    const text = (out.content ?? [])
      .map((b) => b.text ?? "")
      .join("")
      .trim();
    const jsonString = text.replace(/```json/gi, "").replace(/```/g, "").trim();

    try {
      const parsed = JSON.parse(jsonString);
      return NextResponse.json(parsed);
    } catch {
      // Fallback: at least pull a serial number out of free-form text.
      const snMatch = text.match(/S\/N[:\s]*([A-Z0-9]+)/i);
      if (snMatch) {
        return NextResponse.json({
          serial_number: snMatch[1],
          default_ssid: "",
          default_pass: "",
          target_ssid: null,
          new_pass: null,
        });
      }
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 502 });
    }
  } catch (err) {
    console.error("[routers/scan] error", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 },
    );
  }
}
