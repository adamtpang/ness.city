import type { Tier } from "@/lib/curation";

/**
 * The /humans directory data.
 *
 * IMPORTANT: these are DEMO / SEED humans, illustrative only, not real members.
 * Real profiles are opt-in and claimed by the person themselves (see the claim
 * CTA on /humans). The scraped NS directory (2,541 people) is never published
 * here, it stays local and private. A public directory of real people is built
 * the consensual way: claimable stubs the person controls.
 */
export type Human = {
  handle: string;
  name: string;
  tagline: string; // the one-line identity (Twitter bio)
  building: string; // what they are working on (LinkedIn / Polywork)
  role: string;
  location: string;
  onCampus: boolean; // presence (Discord / Snap Map)
  tier: Tier; // curation tier, from lib/curation.ts
  vouches: number; // distributed trust
  shipped: number; // contributions on the engine (the body of work)
  x?: string; // optional handle
};

export const HUMANS: Human[] = [
  {
    handle: "maya",
    name: "Maya Lindqvist",
    tagline: "Teaching machines to teach people.",
    building: "An AI tutor for self-directed learners",
    role: "Founder",
    location: "Forest City",
    onCampus: true,
    tier: "steward",
    vouches: 14,
    shipped: 9,
    x: "maya",
  },
  {
    handle: "zara",
    name: "Zara Okafor",
    tagline: "Raising the next generation on campus.",
    building: "A school for the children of NS",
    role: "Educator",
    location: "Forest City",
    onCampus: true,
    tier: "steward",
    vouches: 15,
    shipped: 11,
  },
  {
    handle: "sofia",
    name: "Sofia Marchetti",
    tagline: "Design is how a city feels.",
    building: "Design systems for civic apps",
    role: "Designer",
    location: "Forest City",
    onCampus: true,
    tier: "steward",
    vouches: 12,
    shipped: 7,
    x: "sofia",
  },
  {
    handle: "priya",
    name: "Priya Nair",
    tagline: "Healthcare that meets you where you live.",
    building: "Walk-in community health clinics",
    role: "Physician",
    location: "Forest City",
    onCampus: true,
    tier: "trusted",
    vouches: 9,
    shipped: 6,
  },
  {
    handle: "diego",
    name: "Diego Alvarez",
    tagline: "Power should belong to the people using it.",
    building: "Off-grid solar microgrids",
    role: "Hardware",
    location: "Forest City",
    onCampus: false,
    tier: "trusted",
    vouches: 8,
    shipped: 5,
  },
  {
    handle: "aisha",
    name: "Aisha Rahman",
    tagline: "Measuring what makes us live longer.",
    building: "Longevity biomarker tracking",
    role: "Researcher",
    location: "Singapore",
    onCampus: false,
    tier: "trusted",
    vouches: 7,
    shipped: 4,
    x: "aisha",
  },
  {
    handle: "hana",
    name: "Hana Kim",
    tagline: "Small daily rituals, compounded.",
    building: "A daily wellness ritual app",
    role: "Founder",
    location: "Seoul / Forest City",
    onCampus: true,
    tier: "trusted",
    vouches: 6,
    shipped: 4,
  },
  {
    handle: "kenji",
    name: "Kenji Watanabe",
    tagline: "Make the border crossing painless.",
    building: "A Johor to Singapore crossing app",
    role: "Engineer",
    location: "Johor Bahru",
    onCampus: true,
    tier: "member",
    vouches: 3,
    shipped: 2,
  },
  {
    handle: "liam",
    name: "Liam O'Connor",
    tagline: "Open hardware for everyone.",
    building: "Open-source robotics kits",
    role: "Engineer",
    location: "Forest City",
    onCampus: true,
    tier: "member",
    vouches: 4,
    shipped: 3,
  },
  {
    handle: "noah",
    name: "Noah Bergman",
    tagline: "Agents that do the boring work.",
    building: "AI agents for back-office ops",
    role: "Engineer",
    location: "Forest City",
    onCampus: true,
    tier: "member",
    vouches: 3,
    shipped: 2,
    x: "noah",
  },
  {
    handle: "tomas",
    name: "Tomas Novak",
    tagline: "Money that moves at the speed of the internet.",
    building: "A payments rail for nomads",
    role: "Founder",
    location: "Lisbon",
    onCampus: false,
    tier: "member",
    vouches: 2,
    shipped: 1,
  },
  {
    handle: "marco",
    name: "Marco Silva",
    tagline: "Tiny team, big worlds.",
    building: "An indie game studio",
    role: "Gamedev",
    location: "São Paulo",
    onCampus: false,
    tier: "member",
    vouches: 1,
    shipped: 1,
  },
];

/** Two-letter initials for the avatar. */
export function initialsOf(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}
