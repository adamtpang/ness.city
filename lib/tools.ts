export type ToolStatus = "live" | "in-design" | "planned";

export type Tool = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: ToolStatus;
  href?: string;
};

export const tools: Tool[] = [
  {
    id: "townhall",
    name: "Townhall",
    tagline: "Civic layer. Problems become bounties become fixes.",
    description:
      "The live tool. Anyone surfaces a problem with a real diagnosis. Patrons crowdfund the fix. Solvers ship and document. Two leaderboards keep score.",
    status: "live",
    href: "/",
  },
  {
    id: "atlas",
    name: "Atlas",
    tagline: "Social PageRank. Map the city.",
    description:
      "Citizens list their closest relationships. We crawl, render, and rank. The way Zuck did it at Harvard, but for a school of network founders. Find the connectors. Find the loners.",
    status: "in-design",
    href: "/atlas",
  },
  {
    id: "jobs",
    name: "Jobs",
    tagline: "Hiring board, sourced from Discord.",
    description:
      "Pull the NS Discord hiring thread on a cron. De-duplicate. Tag by role and stack. Surface the freshest at the top. Apply via DM. The board the thread should have been.",
    status: "planned",
    href: "/jobs",
  },
  {
    id: "market",
    name: "Market",
    tagline: "Products, services, assets.",
    description:
      "Consolidates nsmarket.app and redmart.xyz. Citizens list what they make, what they sell, what they need. Local economy for a place that travels.",
    status: "planned",
    href: "/market",
  },
];

export type Integration = {
  name: string;
  url: string;
  blurb: string;
  state: "live" | "applied" | "soon" | "external";
};

export const integrations: Integration[] = [
  {
    name: "ns.com/directory",
    url: "https://ns.com/directory",
    blurb: "Member graph. Source of truth for citizens.",
    state: "applied",
  },
  {
    name: "ns.com/platform",
    url: "https://ns.com/platform",
    blurb: "Auth + API. Application pending.",
    state: "applied",
  },
  {
    name: "nstools.xyz",
    url: "https://nstools.xyz",
    blurb: "Tooling. Sister site.",
    state: "external",
  },
  {
    name: "nskpi.com",
    url: "https://nskpi.com",
    blurb: "NS KPIs and dashboards.",
    state: "external",
  },
  {
    name: "nsnodes.com",
    url: "https://nsnodes.com",
    blurb: "Network state node directory.",
    state: "external",
  },
  {
    name: "thenetworkstate.com",
    url: "https://thenetworkstate.com",
    blurb: "Balaji's thesis. The thinking behind it all.",
    state: "external",
  },
  {
    name: "interneta.world",
    url: "#",
    blurb: "Adam's umbrella. The next evolution of the West.",
    state: "soon",
  },
];
