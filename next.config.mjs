import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      // Civic Protocol discovery. Any node or registry can find out what this
      // node is by fetching /.well-known/civic.json, with no prior arrangement.
      { source: "/.well-known/civic.json", destination: "/api/civic/manifest" },
    ];
  },
};

export default nextConfig;
