/* Ness UI kit — shared primitives, brand marks, and seed data.
   Exports everything to window for the screen files + index.html. */

const { useState, useEffect, useRef } = React;

/* ---------- Brand marks (exact path data from the source) ---------- */
function NessieLogo({ width = 44, color = "currentColor", withWater = true }) {
  return (
    <svg viewBox="0 0 44 28" fill="none" style={{ width, color, display: "block" }} aria-hidden>
      <path d="M3 21 Q5.5 13 8 21 Q10.5 16 13 21 Q15.5 18 17 14 Q19 8 25 6.5 Q31 5 33.5 9 Q34 10 33 10.5 Q31 11 29 10.7 L26.5 10.5"
        stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="30.5" cy="8.6" r="0.9" fill="currentColor" />
      {withWater && <path d="M2 24 Q8 22.5 14 24 T26 24 T38 24 T42 24" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.45" />}
    </svg>
  );
}

/* ---------- Avatar (seeded tint, initials only) ---------- */
const AVATAR_PALETTE = ["#1f2937", "#7c2d12", "#365314", "#831843", "#1e3a8a", "#581c87", "#0c4a6e", "#7c2d12"];
function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i); return Math.abs(h); }
function Avatar({ initials, seed, size = 28 }) {
  const bg = AVATAR_PALETTE[hashStr(seed) % AVATAR_PALETTE.length];
  return <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.36, background: bg }}>{initials}</span>;
}

/* ---------- Small atoms ---------- */
function Dot({ color }) { return <span className="dot" style={{ background: color }} />; }
function Stat({ k, v }) { return <span className="stat"><span className="k">{k}</span><span className="v">{v}</span></span>; }
function Chip({ color, muted, children }) {
  return <span className={"chip" + (muted ? " chip-muted" : "")}>{color && <Dot color={color} />}{children}</span>;
}
function FadeIn({ delay = 0, children, style }) {
  return <div className="fade" style={{ animationDelay: delay + "s", ...style }}>{children}</div>;
}

/* signal colors (component-level, matching the shipped app) */
const SIGNAL = { open: "#a3a3a3", investigating: "#f59e0b", "in-progress": "#3b82f6", solved: "#16a34a" };
const SIGNAL_LABEL = { open: "Open", investigating: "Investigating", "in-progress": "In progress", solved: "Solved" };

/* ---------- Market data (verbatim from lib/market.ts) ---------- */
const KIND_STYLE = {
  forsale: { dot: "#3b82f6", label: "For sale" },
  free: { dot: "#22c55e", label: "Free" },
  wanted: { dot: "#f59e0b", label: "Wanted" },
};
const MARKET_FILTERS = [
  { id: "all", label: "All" }, { id: "forsale", label: "For sale" },
  { id: "free", label: "Free" }, { id: "wanted", label: "Wanted" },
];
// Real listings only. No seed, no fake data. An empty market is honest;
// the founders post the first real things. (Source principle, app/market/page.tsx.)
const LISTINGS = []

/* ---------- Forum data (modeled on ProblemCard / lib types) ---------- */
// Real problems only. The townhall seeds nothing — citizens surface the first ones.
const PROBLEMS = []
const FORUM_FILTERS = [
  { id: "all", label: "All" }, { id: "open", label: "Open" },
  { id: "in-progress", label: "In progress" }, { id: "solved", label: "Solved" },
];

/* ---------- Rooms (homepage grid) ---------- */
const ROOMS = [
  { href: "/roadmap", name: "The Roadmap", body: "Living public roadmap. Eisenhower-prioritized. Owner per row." },
  { href: "/market", name: "The Market", body: "Buy, sell, share. Like craigslist, with real handles.", nav: "market" },
  { href: "/solve", name: "The Forum", body: "File problems. Propose fixes. Patrons pledge. Ship and get paid.", nav: "forum" },
  { href: "/pagerank", name: "PageRank", body: "Map your ring. See who the community has named." },
  { href: "/pulse", name: "Pulse", body: "Community analytics: skills, interests, ideas, apps." },
  { href: "/citizens", name: "Citizens", body: "Solver karma · patron pledged. Two leaderboards." },
  { href: "/guide", name: "The Guide", body: "An honest, independent guide to Network School. Loch in." },
  { href: "/nslink", name: "nslink", body: "Snap a stack of routers, get a CSV the bot can run." },
  { href: "https://discord.gg/", name: "Discord", body: "Open chat, bug-reports, feature-requests, support.", external: true },
];

Object.assign(window, {
  NessieLogo, Avatar, Dot, Stat, Chip, FadeIn,
  SIGNAL, SIGNAL_LABEL, KIND_STYLE, MARKET_FILTERS, LISTINGS,
  PROBLEMS, FORUM_FILTERS, ROOMS,
});
