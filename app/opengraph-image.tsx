import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ness · the civic layer for builders";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Free OG share card for ness.city. Civic proof, not video SaaS —
 * one clean card so links render with brand + one-liner.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F6F1E8",
          padding: "64px 72px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 999,
              background: "#0F172A",
              color: "#F6F1E8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            🦕
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#0F172A",
              letterSpacing: "-0.02em",
            }}
          >
            ness.city
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.05,
              color: "#0F172A",
              letterSpacing: "-0.03em",
              maxWidth: 980,
            }}
          >
            Problems become bounties become fixes.
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#475569",
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              maxWidth: 820,
              lineHeight: 1.35,
            }}
          >
            The civic layer for builders. Townhall, Jobs, PageRank — open
            tooling for ambitious communities.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "ui-monospace, monospace",
            fontSize: 18,
            color: "#64748B",
          }}
        >
          <span>Surface · Propose · Fund · Ship</span>
          <span>Independent · MIT</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
