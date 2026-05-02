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
    tagline: "Problems become bounties become fixes.",
    description:
      "Surface a problem. Someone proposes a fix. Patrons pledge USDC. The solver ships, documents, and gets paid.",
    status: "live",
    href: "/solve",
  },
  {
    id: "pagerank",
    name: "PageRank",
    tagline: "Social PageRank. Map the city.",
    description:
      "Citizens map their closest connections. PageRank surfaces who the city named most, weighted by who named them. The connectors emerge.",
    status: "live",
    href: "/pagerank",
  },
  {
    id: "match",
    name: "Match",
    tagline: "Resume to opportunities.",
    description:
      "Drop a resume. We score it against every open bounty and every job in the wild. Get back the 80%+ matches with concrete next steps.",
    status: "in-design",
    href: "/match",
  },
  {
    id: "market",
    name: "Market",
    tagline: "Products, services, assets.",
    description:
      "Citizens list what they make, what they sell, what they need. Local economy for a community that travels.",
    status: "planned",
    href: "/market",
  },
];
