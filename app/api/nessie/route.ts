import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { createProblem } from "@/lib/db/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * POST /api/nessie
 *   { messages: [{ role, content }], identity?: { name?, handle? } }
 *
 * Nessie's conversational brain. She runs a customer-discovery interview
 * about the member's NS experience and, when a real problem is concrete,
 * files it straight onto the engine using the file_problem tool. That is
 * how the chat seeds the database: every diagnosed friction becomes an
 * open problem the community can sort, fund, and fix.
 *
 * We file by inserting directly through createProblem (the same path the
 * modal uses), NOT by self-calling /api/problems over HTTP, because
 * preview deployments sit behind Vercel auth and a server-to-server hop
 * would get 401'd.
 *
 * Calls the Anthropic API directly (no SDK). With no ANTHROPIC_API_KEY it
 * returns a friendly degraded reply so the widget still works.
 */

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-3-5-haiku-latest";

const CATEGORIES = [
  "operations",
  "social",
  "infra",
  "policy",
  "wellbeing",
  "other",
] as const;

const SYSTEM = `You are Nessie, the resident AI of ness.city, an open-source civic coordination engine for the Network School (NS) community in Forest City, Malaysia.

Your job in this chat is to interview the member about their NS experience, find the real problems they keep running into, and file the concrete ones onto the engine so the community can sort, fund, and fix them.

How the engine works: anyone surfaces a problem, the community ranks it by importance and urgency, people propose solutions, patrons fund a bounty, and Fixers ship and document the fix.

Run the interview like a sharp product researcher doing customer discovery:
- Ask ONE question at a time. Keep every message to one or two sentences. Be warm, curious, specific.
- Open by asking how their week at NS is going and what has felt slow, annoying, or broken lately.
- When they name a friction, dig in before moving on: what exactly happens, how often, who else it hits, what good would look like. Follow-ups, not lectures. Roughly the five whys.
- Do not try to solve it for them in the chat. Your output is a well-scoped problem on the board, not advice.

Filing: once a friction is concrete and the member agrees it is a real, shareable problem (not private or personal), call the file_problem tool. Write a crisp title (a short noun phrase or imperative, no trailing period), a one or two sentence summary in the member's own framing, and pick the best category. Before filing, confirm in one short line such as "Want me to put this on the board?" and file once they say yes. After it is filed, tell them it is up and they can watch the community pick it up, then ask what else is slowing them down.

Rules:
- One problem per distinct issue. Never file vague venting, a duplicate of something you just filed, or anything private.
- You believe, with David Deutsch, that all problems are soluble. Stay optimistic and practical.
- Never use em dashes. Use commas, periods, or separate sentences instead.`;

const FILE_PROBLEM_TOOL = {
  name: "file_problem",
  description:
    "File a concrete community problem onto the ness.city engine so it becomes an open issue the community can rank, fund, and fix. Call this only after the member has described a specific, shareable problem and agreed to put it on the board. Do not call it for vague complaints, private matters, or a duplicate of one already filed in this conversation.",
  input_schema: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description:
          "A crisp title for the problem: a short noun phrase or imperative, no trailing period. Example: 'Gym is overcrowded at 6pm' or 'No quiet room for deep work'.",
      },
      summary: {
        type: "string",
        description:
          "One or two sentences describing the problem in the member's own framing: what happens, how often, who it affects.",
      },
      category: {
        type: "string",
        enum: CATEGORIES as unknown as string[],
        description:
          "Best fit. operations: logistics, space, events, food. social: community, belonging, events. infra: wifi, tools, software, facilities. policy: rules, governance, money. wellbeing: health, fitness, mental health. other: anything else.",
      },
    },
    required: ["title"],
  },
};

type ClientMsg = { role: "user" | "assistant"; content: string };
type Identity = { name?: string; handle?: string };

type TextBlock = { type: "text"; text: string };
type ToolUseBlock = {
  type: "tool_use";
  id: string;
  name: string;
  input: Record<string, unknown>;
};
type ContentBlock = TextBlock | ToolUseBlock | { type: string };

function isTextBlock(b: ContentBlock): b is TextBlock {
  return b.type === "text";
}
function isToolUseBlock(b: ContentBlock): b is ToolUseBlock {
  return b.type === "tool_use";
}

function textOf(content: ContentBlock[]): string {
  return content
    .filter(isTextBlock)
    .map((b) => b.text)
    .join("")
    .trim();
}

async function callAnthropic(
  key: string,
  messages: unknown[],
  withTools: boolean,
) {
  return fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 500,
      system: SYSTEM,
      ...(withTools ? { tools: [FILE_PROBLEM_TOOL] } : {}),
      messages,
    }),
  });
}

export async function POST(req: Request) {
  let body: { messages?: unknown; identity?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const rawMessages = Array.isArray(body.messages) ? body.messages : [];
  const clean: ClientMsg[] = rawMessages
    .filter(
      (m): m is ClientMsg =>
        !!m &&
        typeof m === "object" &&
        ((m as { role: unknown }).role === "user" ||
          (m as { role: unknown }).role === "assistant") &&
        typeof (m as { content: unknown }).content === "string",
    )
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

  const identity: Identity =
    body.identity && typeof body.identity === "object"
      ? (body.identity as Identity)
      : {};

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json({
      ok: true,
      degraded: true,
      reply:
        "My brain is not wired up here yet, but I am listening. How is your week at NS going, and what has felt slow or broken lately?",
    });
  }

  try {
    const messages: unknown[] = clean.length
      ? [...clean]
      : [{ role: "user", content: "Hi" }];

    const res1 = await callAnthropic(key, messages, true);
    if (!res1.ok) {
      const detail = await res1.text().catch(() => "");
      return NextResponse.json(
        { ok: false, error: `Nessie upstream ${res1.status}`, detail: detail.slice(0, 200) },
        { status: 502 },
      );
    }
    const data1 = (await res1.json()) as {
      stop_reason?: string;
      content?: ContentBlock[];
    };
    const content1 = data1.content ?? [];

    // Plain conversational turn, no filing.
    if (data1.stop_reason !== "tool_use") {
      return NextResponse.json({
        ok: true,
        reply: textOf(content1) || "I am here. Tell me what is on your mind.",
      });
    }

    // Tool turn: file each diagnosed problem, then ask Nessie to confirm.
    const toolUses = content1.filter(isToolUseBlock);
    const filed: { slug: string; title: string }[] = [];
    const toolResults: unknown[] = [];

    for (const tu of toolUses) {
      if (tu.name !== "file_problem") {
        toolResults.push({
          type: "tool_result",
          tool_use_id: tu.id,
          content: "Unknown tool.",
          is_error: true,
        });
        continue;
      }
      if (!isDbConfigured) {
        toolResults.push({
          type: "tool_result",
          tool_use_id: tu.id,
          content:
            "The problem board is not connected right now, so it could not be filed.",
          is_error: true,
        });
        continue;
      }
      const input = tu.input as {
        title?: string;
        summary?: string;
        category?: string;
      };
      try {
        const { problem } = await createProblem({
          title: input.title ?? "",
          summary: input.summary,
          category: input.category,
          reporterDisplayName: identity.name,
          reporterHandle: identity.handle,
        });
        filed.push({ slug: problem.slug, title: problem.title });
        toolResults.push({
          type: "tool_result",
          tool_use_id: tu.id,
          content: `Filed on the engine as "${problem.title}" at /townhall/${problem.slug}. It is now open for the community to rank and fix.`,
        });
      } catch (e) {
        toolResults.push({
          type: "tool_result",
          tool_use_id: tu.id,
          content: `Could not file that: ${e instanceof Error ? e.message : "error"}`,
          is_error: true,
        });
      }
    }

    // Second pass (no tools) for a natural confirmation message.
    const followMessages: unknown[] = [
      ...messages,
      { role: "assistant", content: content1 },
      { role: "user", content: toolResults },
    ];
    let reply = "";
    const res2 = await callAnthropic(key, followMessages, false);
    if (res2.ok) {
      const data2 = (await res2.json()) as { content?: ContentBlock[] };
      reply = textOf(data2.content ?? []);
    }
    if (!reply) {
      reply = filed.length
        ? "Done, it is on the board now. The community can rank and pick it up from here. What else has been slowing you down?"
        : textOf(content1) ||
          "I could not get that onto the board just now, but tell me more.";
    }

    return NextResponse.json({ ok: true, reply, filed });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Nessie error" },
      { status: 500 },
    );
  }
}
