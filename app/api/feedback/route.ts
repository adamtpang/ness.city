import { NextResponse } from "next/server";

export const runtime = "edge";

const REPO_OWNER = "adamtpang";
const REPO_NAME = "ness";
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

  const token = process.env.GITHUB_FEEDBACK_TOKEN;
  if (!token) {
    return new NextResponse(
      "GITHUB_FEEDBACK_TOKEN not configured. Add it in Vercel project env.",
      { status: 503 },
    );
  }

  const ratingLabels: Record<number, string> = {
    1: "Broken",
    2: "Rough",
    3: "Fine",
    4: "Good",
    5: "Loved it",
  };

  const title = `Feedback ${rating}/5 (${ratingLabels[rating]}) on ${page}`;

  const issueBody = [
    `**Rating:** ${rating}/5 (${ratingLabels[rating]})`,
    `**Page:** \`${page}\``,
    referrer ? `**Referrer:** ${referrer}` : null,
    "",
    message ? `> ${message.split("\n").join("\n> ")}` : "_(no comment)_",
    "",
    "---",
    "_Filed automatically by the Ness feedback widget._",
  ]
    .filter(Boolean)
    .join("\n");

  const labels = ["feedback", `rating-${rating}`];

  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
      {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
          "User-Agent": "ness.city-feedback-widget",
        },
        body: JSON.stringify({ title, body: issueBody, labels }),
      },
    );

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return new NextResponse(
        `GitHub API ${res.status}: ${text.slice(0, 300)}`,
        { status: 502 },
      );
    }

    const data = (await res.json()) as { html_url?: string; number?: number };
    return NextResponse.json({
      ok: true,
      url: data.html_url ?? null,
      number: data.number ?? null,
    });
  } catch (err) {
    return new NextResponse(
      `Network error: ${err instanceof Error ? err.message : "unknown"}`,
      { status: 502 },
    );
  }
}
