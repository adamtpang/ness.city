/**
 * Single source of truth for "every place in Ness."
 * Used by:
 *   - The home-page directory grid (newcomer-friendly listing).
 *   - The header "All ▾" dropdown (any-page access to every route).
 *
 * If you ship a new page, add it here. If you remove a page, remove it
 * here. The map and the dropdown stay in sync.
 */

export type PlaceStatus = "live" | "in-design" | "planned";
export type PlaceSection =
  | "civic"
  | "knowledge"
  | "community"
  | "tools"
  | "meta";

export type Place = {
  id: string;
  name: string;
  building?: string;
  href: string;
  desc: string;
  section: PlaceSection;
  status: PlaceStatus;
  /** Show in the header dropdown? Most do; some are sub-routes that don't need to. */
  inHeader?: boolean;
};

export const places: Place[] = [
  // --- Civic engine ---
  {
    id: "townhall",
    name: "Townhall",
    building: "Townhall",
    href: "/solve",
    desc: "Surface problems, propose fixes, ship them.",
    section: "civic",
    status: "live",
    inHeader: true,
  },
  {
    id: "bounties",
    name: "Bounty Bureau",
    building: "Bounty Bureau",
    href: "/bounties",
    desc: "Open bounties patrons are funding right now.",
    section: "civic",
    status: "live",
    inHeader: true,
  },
  {
    id: "citizens",
    name: "Citizens Hall",
    building: "Citizens Hall",
    href: "/citizens",
    desc: "Solver karma + patron attribution leaderboards.",
    section: "civic",
    status: "live",
    inHeader: true,
  },
  {
    id: "os",
    name: "Open-source mirror",
    building: "The Forge",
    href: "/os",
    desc: "GitHub-style issues and pull requests for the community.",
    section: "civic",
    status: "in-design",
    inHeader: true,
  },

  // --- Knowledge / maps ---
  {
    id: "pagerank",
    name: "PageRank",
    building: "Observatory",
    href: "/pagerank",
    desc: "Map your ring. See who the city named most.",
    section: "knowledge",
    status: "live",
    inHeader: true,
  },
  // Points Vault commented out for the pre-public review. Restore by
  // unblocking this entry, reinstating the full app/points/page.tsx, and
  // adding the news banner item back.
  // {
  //   id: "points",
  //   name: "Points Vault",
  //   building: "Points Vault",
  //   href: "/points",
  //   desc: "Member points calculator with vesting timeline.",
  //   section: "knowledge",
  //   status: "live",
  //   inHeader: true,
  // },
  {
    id: "about",
    name: "Welcome Center",
    building: "Welcome Center",
    href: "/about",
    desc: "How Ness works, end-to-end.",
    section: "knowledge",
    status: "live",
    inHeader: true,
  },

  // --- Community ---
  {
    id: "whatsapp",
    name: "The Plaza",
    href: "/whatsapp",
    desc: "Curated NS WhatsApp interest groups.",
    section: "community",
    status: "live",
    inHeader: true,
  },
  {
    id: "market",
    name: "The Market",
    href: "/market",
    desc: "Buy, sell, swap, share. Ness's local craigslist.",
    section: "community",
    status: "live",
    inHeader: true,
  },
  {
    id: "minecraft",
    name: "Minecraft",
    href: "/minecraft",
    desc: "Community Minecraft server. Build and mine together.",
    section: "community",
    status: "in-design",
    inHeader: true,
  },

  // --- Tools ---
  {
    id: "tools",
    name: "Utility Belt",
    href: "/tools",
    desc: "Free calculators and small tools.",
    section: "tools",
    status: "live",
    inHeader: true,
  },
  {
    id: "routermill",
    name: "Routermill",
    href: "/tools/routermill",
    desc: "Snap a CelcomDigi router label, get the credentials extracted.",
    section: "tools",
    status: "live",
    inHeader: false,
  },
  {
    id: "match",
    name: "Match",
    href: "/match",
    desc: "Drop a resume, get the 80%+ matches across jobs and bounties.",
    section: "tools",
    status: "in-design",
    inHeader: true,
  },

  // --- Meta ---
  {
    id: "design",
    name: "Design system",
    href: "/design",
    desc: "Every color, type, and component used across Ness. Tinker zone.",
    section: "meta",
    status: "live",
    inHeader: true,
  },
  {
    id: "feedback",
    name: "Feedback",
    href: "/feedback",
    desc: "How feedback is triaged. Where it lands.",
    section: "meta",
    status: "live",
    inHeader: true,
  },
];

export const sectionLabels: Record<PlaceSection, { label: string; eyebrow: string }> = {
  civic: { label: "The civic engine", eyebrow: "Solve" },
  knowledge: { label: "Maps and knowledge", eyebrow: "Learn" },
  community: { label: "Community", eyebrow: "Connect" },
  tools: { label: "Free tools", eyebrow: "Use" },
  meta: { label: "Meta", eyebrow: "About" },
};

export const sectionOrder: PlaceSection[] = [
  "civic",
  "knowledge",
  "community",
  "tools",
  "meta",
];

export function placesBySection(): Record<PlaceSection, Place[]> {
  const acc = sectionOrder.reduce(
    (a, s) => {
      a[s] = [];
      return a;
    },
    {} as Record<PlaceSection, Place[]>,
  );
  for (const p of places) acc[p.section].push(p);
  return acc;
}
