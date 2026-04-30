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
      "The live tool. Anyone surfaces a problem with a real diagnosis. Patrons crowdfund the fix in USDC. Solvers ship and document. Two leaderboards keep score.",
    status: "live",
    href: "/",
  },
  {
    id: "jobs",
    name: "Jobs",
    tagline: "Curated public openings.",
    description:
      "A clean reading layer over public job postings. Filter by category. Spot remote roles. Apply direct on the company's own page. No aggregator middlemen, no logins, no scraping.",
    status: "live",
    href: "/jobs",
  },
  {
    id: "atlas",
    name: "Atlas",
    tagline: "Social PageRank. Map the city.",
    description:
      "Citizens list their closest relationships. We crawl, render, and rank. The way Zuck did it at Harvard, but for a community of network founders. Find the connectors. Find the quiet ones.",
    status: "in-design",
    href: "/atlas",
  },
  {
    id: "market",
    name: "Market",
    tagline: "Products, services, assets.",
    description:
      "Consolidates nsmarket.app and redmart.xyz. Citizens list what they make, what they sell, what they need. Local economy for a community that travels.",
    status: "planned",
    href: "/market",
  },
];
