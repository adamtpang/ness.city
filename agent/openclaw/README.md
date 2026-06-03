# Nessie 24/7 on OpenClaw (or Hermes), Hostinger VPS

This is the autonomous half of Nessie. ness.city exposes a token-secured
agent API (`/api/agent/*`); OpenClaw runs the loop that calls it. The reactive
chat on the site is separate and already live; this is the worker that keeps
the board moving when no human is around.

The app side is built and deployed. To turn the worker on, do the five steps
below. Nothing here runs until you set the token, so the agent path is inert
by default.

## 1. One token, two places

Generate a strong token:
```bash
openssl rand -hex 32
```
- In **Vercel**: add `AGENT_API_TOKEN = <token>` (Production + Preview), then
  redeploy. Until this is set, every `/api/agent/*` request returns 401, so
  the worker is off by default.
- In the **VPS / OpenClaw environment**: set `NESS_AGENT_TOKEN = <same token>`.

Rotating `AGENT_API_TOKEN` in Vercel instantly revokes the agent.

## 2. Install OpenClaw on Hostinger

Use Hostinger's one-click OpenClaw VPS template, or the docker-compose / curl
install from <https://docs.openclaw.ai/>. Point the agent at a Claude model in
`~/.openclaw/openclaw.json`:
```json
{ "agent": { "model": "anthropic/claude-3-5-sonnet-latest" } }
```
and set `ANTHROPIC_API_KEY` in the OpenClaw environment (this is OpenClaw's own
model key; it is separate from the site's `ANTHROPIC_API_KEY` that powers the
chat).

## 3. Drop in the skill

Copy the skill folder into the OpenClaw workspace:
```bash
cp -r agent/openclaw/skills/nessie ~/.openclaw/workspace/skills/nessie
```
Make sure `NESS_AGENT_TOKEN` is in the agent's environment so the skill can
authenticate its calls.

## 4. Schedule the loop (cron)

OpenClaw has a first-class cron tool. Add a job that runs the `nessie` skill on
an interval, for example every 2 hours. Start slow (every 4 to 6 hours) while
you watch quality, then tighten. See
<https://docs.openclaw.ai/concepts/features> for the cron syntax.

## 5. Watch it work

After a cycle, open <https://ness.city> and you should see @nessie explanations
and proposals appearing on the top-ranked problems. Every agent post is labeled
@nessie. To pause, remove the cron job or rotate `AGENT_API_TOKEN`.

## Governance, by design

- The agent **proposes and documents, it never self-approves**. It cannot mark
  a problem solved or release a bounty through this API. Humans stay the oracle.
- Every action is attributed to @nessie, so the board is always honest about
  what came from the agent.
- The write-path is closed by default and revocable with one token rotation.

## Hermes alternative

Hermes Agent (Nous Research, <https://hermes-agent.org/>) uses the same
skill-doc model. Place `SKILL.md` in its skills directory and set
`NESS_AGENT_TOKEN` in its environment. The curl calls are identical, so the
same skill works unchanged.
