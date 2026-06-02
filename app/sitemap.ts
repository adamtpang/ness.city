import type { MetadataRoute } from "next";

const SITE_URL = "https://ness.city";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/townhall",
    "/roadmap",
    "/citizens",
    "/pagerank",
    "/pulse",
    "/guide",
  ];
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
}
