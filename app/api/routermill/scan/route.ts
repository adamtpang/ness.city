import { NextResponse } from "next/server";
import Replicate from "replicate";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST /api/routermill/scan
 *
 * Body: { image: string } — a base64 data URI of a router label.
 *
 * Returns the extracted router credentials as JSON:
 *   { serial_number, default_ssid, default_pass, target_ssid, new_pass }
 *
 * Uses Gemini 3 Pro (via Replicate) to read the label. The user fills in
 * target_ssid + new_pass on the client; the bot consumes the resulting CSV.
 */
export async function POST(req: Request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json(
      {
        error:
          "REPLICATE_API_TOKEN is not set. Add it in Vercel project env vars.",
      },
      { status: 500 },
    );
  }

  let body: { image?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { image } = body;
  if (!image) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  const prompt = `
Analyze this router label image. Extract the following fields strictly in JSON format:
- serial_number (Labelled as S/N)
- default_ssid (Labelled as "2.4G SSID" or just "SSID". If multiple, prefer 2.4G. Example: "B4B@celcomdigi_2.4Ghz")
- default_pass (Labelled as "Wireless Password/PIN" or "Password")
- target_ssid (Leave this null, user will input later)
- new_pass (Leave this null, user will input later)

If a field is not visible, return null.
Do not guess.
Return ONLY raw JSON. No markdown code blocks.
`;

  try {
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
    const output = await replicate.run("google/gemini-3-pro", {
      input: { images: [image], prompt },
    });

    const resultText = Array.isArray(output) ? output.join("") : String(output);
    const jsonString = resultText.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const parsed = JSON.parse(jsonString);
      return NextResponse.json(parsed);
    } catch {
      // Fallback: at least try to grab the serial number out of free-form text.
      const snMatch = resultText.match(/S\/N[:\s]*([A-Z0-9]+)/i);
      if (snMatch) {
        return NextResponse.json({
          serial_number: snMatch[1],
          default_ssid: "",
          default_pass: "",
          target_ssid: null,
          new_pass: null,
        });
      }
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[routermill/scan] error", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 },
    );
  }
}
