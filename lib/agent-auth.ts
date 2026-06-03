import { timingSafeEqual } from "node:crypto";

/**
 * Identity every autonomous-agent action is attributed to. All writes from
 * the 24/7 worker (OpenClaw / Hermes on the VPS) land as @nessie so the
 * community always knows a post came from the agent, not a human.
 */
export const NESSIE_IDENTITY = {
  handle: "nessie",
  displayName: "Nessie 🦕",
} as const;

/**
 * Bearer-token gate for the agent write-path (/api/agent/*).
 *
 * Closed by default: with no AGENT_API_TOKEN set, every agent request is
 * rejected, so the path is inert until the operator deliberately turns it
 * on. The same token is set in Vercel (AGENT_API_TOKEN) and in the VPS
 * agent's environment (NESS_AGENT_TOKEN). Rotate it in Vercel to instantly
 * revoke the agent.
 */
export function agentAuthorized(req: Request): boolean {
  const token = process.env.AGENT_API_TOKEN;
  if (!token) return false;
  const header = req.headers.get("authorization") ?? "";
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  if (!match) return false;
  const provided = Buffer.from(match[1]);
  const expected = Buffer.from(token);
  if (provided.length !== expected.length) return false;
  try {
    return timingSafeEqual(provided, expected);
  } catch {
    return false;
  }
}
