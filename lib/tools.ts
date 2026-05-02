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
    href: "/solve",
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
    id: "pagerank",
    name: "PageRank",
    tagline: "Social PageRank. Map your ring.",
    description:
      "Name your closest connections in doubling rings: 1, 2, 4, 8, 16, 32. PageRank ranks who the city named most, weighted by who named them. The connectors emerge. The quiet ones too.",
    status: "live",
    href: "/pagerank",
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
