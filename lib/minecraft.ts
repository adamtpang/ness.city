/**
 * Minecraft server config. Update the values below once the server is
 * provisioned and you have a public IP/hostname.
 *
 * If `serverHost` is the placeholder, the page renders a "server is
 * being set up" state with instructions; once it's a real hostname the
 * page flips to the join state automatically.
 */

export const minecraft = {
  /** Public hostname or IP. Empty until the server is up. */
  serverHost: "",
  /** Default Minecraft Java port; usually omitted. */
  port: 25565,
  /** Java Edition or Bedrock. */
  edition: "Java" as "Java" | "Bedrock",
  /** Minecraft version. */
  version: "1.21",
  /** Free text describing the world / vibe. */
  vibe: "Vanilla survival on a flat-ish plains seed. Friendly. No PvP.",
  /** Optional Discord channel or WhatsApp group for coordination. */
  community: {
    label: "Coordinate on the Minecraft WhatsApp group",
    href: "/whatsapp",
  },
};

export const isMinecraftLive = Boolean(minecraft.serverHost);
