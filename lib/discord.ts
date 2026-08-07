/**
 * Discord webhook notifier. Silently no-ops until DISCORD_COMMUNITY_WEBHOOK
 * is set, same convention as every other optional integration in this repo
 * (NEXT_PUBLIC_PRIVY_APP_ID, DISCORD_FEEDBACK_WEBHOOK).
 *
 * The distribution test: the community already coordinates in Discord and
 * WhatsApp, every hour. Ness.city is a separate destination asking people to
 * remember it exists. This posts new events + food straight into a channel
 * people already have open, real-time, so we get a real signal instead of a
 * guess. To turn it on: create an Incoming Webhook on one Discord channel
 * (Channel Settings -> Integrations -> Webhooks -> New Webhook), set
 * DISCORD_COMMUNITY_WEBHOOK to that URL in Vercel, redeploy.
 *
 * Never used for WhatsApp: an incoming webhook is Discord's own sanctioned,
 * unlimited-scale mechanism. WhatsApp has no equivalent for a personal
 * account, and building an automated poster into groups a personal account
 * only belongs to (not administers) risks that number being banned. That
 * one stays a manual, per-message action if it ever happens.
 */
export async function notifyDiscordCommunity(content: string): Promise<void> {
  const url = process.env.DISCORD_COMMUNITY_WEBHOOK;
  if (!url) return; // not configured yet; no-op, never throws

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: content.slice(0, 2000) }),
    });
  } catch {
    // Never let a Discord hiccup break the actual post to the board.
  }
}
