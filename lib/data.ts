import type { Citizen, Problem } from "./types";

export const citizens: Citizen[] = [
  {
    id: "u_balaji",
    handle: "balaji",
    name: "Balaji S.",
    avatar: "BS",
    credit: 0,
    solved: 0,
    joined: "2023-09-01",
    bio: "Founder. Mostly observing — credit goes to citizens.",
  },
  {
    id: "u_priya",
    handle: "priya.k",
    name: "Priya Krishnan",
    avatar: "PK",
    credit: 1240,
    solved: 8,
    joined: "2024-02-14",
    bio: "Logistics lead. Fixing things that should already work.",
  },
  {
    id: "u_marcus",
    handle: "marcus",
    name: "Marcus Lee",
    avatar: "ML",
    credit: 980,
    solved: 6,
    joined: "2024-03-20",
    bio: "Infra and tooling. If it's slow, ping me.",
  },
  {
    id: "u_aisha",
    handle: "aisha",
    name: "Aisha Bello",
    avatar: "AB",
    credit: 720,
    solved: 5,
    joined: "2024-04-02",
    bio: "Wellbeing & community rituals.",
  },
  {
    id: "u_jonas",
    handle: "jonas",
    name: "Jonas Weber",
    avatar: "JW",
    credit: 640,
    solved: 4,
    joined: "2024-05-11",
    bio: "Hardware tinkerer. Bring the broken things.",
  },
  {
    id: "u_emiko",
    handle: "emiko",
    name: "Emiko Tanaka",
    avatar: "ET",
    credit: 420,
    solved: 3,
    joined: "2024-06-08",
  },
  {
    id: "u_kofi",
    handle: "kofi",
    name: "Kofi Mensah",
    avatar: "KM",
    credit: 310,
    solved: 2,
    joined: "2024-07-15",
  },
  {
    id: "u_lena",
    handle: "lena",
    name: "Lena Petrova",
    avatar: "LP",
    credit: 220,
    solved: 2,
    joined: "2024-09-01",
  },
];

export const problems: Problem[] = [
  {
    id: "p_001",
    slug: "wifi-drops-coworking-3pm",
    title: "Coworking Wi-Fi drops every afternoon around 3pm",
    summary:
      "Connection becomes unusable in the main coworking from ~3pm to 5pm. Calls drop, deploys fail, members leave to cafés.",
    rootCause:
      "AP-3 in the south wall is on the same channel as the building's neighbour. When their afternoon shift starts, both routers fight for 5GHz band 36. We confirmed via WiFi Analyzer logs (see solution).",
    category: "infra",
    status: "solved",
    reporterId: "u_priya",
    createdAt: "2026-04-02",
    upvotes: 47,
    affected: 62,
    solutions: [
      {
        id: "s_001",
        problemId: "p_001",
        authorId: "u_marcus",
        summary: "Re-channel AP-3 to band 149 + add second AP in south corner",
        body: "Logged channel utilisation across a week — band 36 hit 92% saturation between 14:50–17:10 every weekday. Switched AP-3 to band 149, added a Unifi U6-Pro mounted on the south column. Latency p95 went from 480ms → 38ms during the problem window. Total parts: $189.",
        shippedAt: "2026-04-09",
        createdAt: "2026-04-04",
        upvotes: 31,
      },
    ],
  },
  {
    id: "p_002",
    slug: "newcomers-lost-first-week",
    title: "Newcomers spend their first week feeling lost",
    summary:
      "New arrivals report not knowing which Slack channels matter, who to ask for what, or where to physically go for meals. Average week-1 satisfaction: 4.2/10.",
    rootCause:
      "We have a Notion onboarding doc, but it's 14 pages and last updated 8 months ago. Half the named contacts have left. The real onboarding is tribal — you have to find a friend who'll walk you around.",
    category: "social",
    status: "in-progress",
    reporterId: "u_aisha",
    createdAt: "2026-04-10",
    upvotes: 38,
    affected: 24,
    solutions: [
      {
        id: "s_002",
        problemId: "p_002",
        authorId: "u_aisha",
        summary: "Pair every new arrival with a 'first-week buddy'",
        body: "Piloting a buddy system: every newcomer is auto-paired with a 30+ day resident on arrival. Buddy commits to 3 short meals in week 1. Tracking via a shared sheet. Pilot cohort (n=8) scored 8.1/10. Scaling next month.",
        createdAt: "2026-04-15",
        upvotes: 22,
      },
    ],
  },
  {
    id: "p_003",
    slug: "kitchen-dishes-pile",
    title: "Kitchen sink piles up every evening",
    summary:
      "Dishes accumulate after dinner. By morning the sink is full. Cleaners arrive at 9am — by then the smell has set in.",
    rootCause:
      "Two compounding causes: (1) the dishwasher cycle is 3 hours, so people queue dishes rather than load them. (2) No clear ownership — everyone assumes the next person will run it.",
    category: "operations",
    status: "investigating",
    reporterId: "u_emiko",
    createdAt: "2026-04-18",
    upvotes: 19,
    affected: 80,
    solutions: [],
  },
  {
    id: "p_004",
    slug: "1on1-rooms-always-booked",
    title: "1-on-1 rooms always booked, but half are empty",
    summary:
      "Calendar shows every small room booked 9am–7pm. Walking past, 40% are visibly empty. People squat bookings 'just in case'.",
    rootCause:
      "Booking has no cost and no enforcement. The optimum strategy for any individual is to over-book. Classic tragedy of the commons.",
    category: "policy",
    status: "open",
    reporterId: "u_jonas",
    createdAt: "2026-04-22",
    upvotes: 28,
    affected: 110,
    solutions: [],
  },
  {
    id: "p_005",
    slug: "gym-equipment-broken",
    title: "Half the gym equipment is broken or missing parts",
    summary:
      "Cable machine missing the lat bar. Two treadmills out of service for 3+ weeks. Adjustable bench has a wobbling pin.",
    rootCause:
      "No-one owns gym maintenance. Issues get reported in #facilities Slack and quietly fall off the feed. Not a budget problem — a routing problem.",
    category: "operations",
    status: "in-progress",
    reporterId: "u_kofi",
    createdAt: "2026-04-19",
    upvotes: 24,
    affected: 45,
    solutions: [
      {
        id: "s_005",
        problemId: "p_005",
        authorId: "u_jonas",
        summary: "Set up a #fix-it tag with weekly Friday sweep",
        body: "Created a #fix-it Slack tag — anything tagged gets logged to a public Linear board. Volunteering to do a Friday afternoon sweep myself for the next 6 weeks. After that we rotate. Already cleared 4 items this week.",
        createdAt: "2026-04-23",
        upvotes: 17,
      },
    ],
  },
  {
    id: "p_006",
    slug: "loneliness-third-week",
    title: "People hit a loneliness wall around week 3",
    summary:
      "Weeks 1–2 feel novel. Around week 3, several residents report feeling more alone than at home. A few have left early.",
    rootCause:
      "Honeymoon period ends but deep relationships haven't formed yet. Most events are large/passive — no consistent small-group ritual to build vulnerability.",
    category: "wellbeing",
    status: "open",
    reporterId: "u_lena",
    createdAt: "2026-04-24",
    upvotes: 41,
    affected: 30,
    solutions: [],
  },
  {
    id: "p_007",
    slug: "loud-calls-quiet-zone",
    title: "Loud calls happening in the designated quiet zone",
    summary:
      "The library/quiet zone has become the de facto call room because it has the best lighting. Deep-work members are getting pushed to bedrooms.",
    rootCause:
      "Signage is small and English-only. Better-lit call rooms exist but feel hidden. The behaviour is rational given the layout — the rules are just badly enforced by space design.",
    category: "operations",
    status: "open",
    reporterId: "u_priya",
    createdAt: "2026-04-25",
    upvotes: 15,
    affected: 35,
    solutions: [],
  },
  {
    id: "p_008",
    slug: "visa-runs-disorganized",
    title: "Visa runs are disorganized — same questions every month",
    summary:
      "Every month, 4–5 people independently figure out the visa run to JB. Same WhatsApp questions, same wrong info, occasional missed deadlines.",
    rootCause:
      "Knowledge isn't compounding. Each person solves it once, then leaves the chat. There's no living document — just stale screenshots.",
    category: "policy",
    status: "investigating",
    reporterId: "u_marcus",
    createdAt: "2026-04-20",
    upvotes: 22,
    affected: 50,
    solutions: [],
  },
];

export function getProblem(slug: string): Problem | undefined {
  return problems.find((p) => p.slug === slug);
}

export function getCitizen(id: string): Citizen | undefined {
  return citizens.find((c) => c.id === id);
}

export function topCitizens(): Citizen[] {
  return [...citizens]
    .filter((c) => c.credit > 0)
    .sort((a, b) => b.credit - a.credit);
}

export const stats = {
  problemsOpen: problems.filter((p) => p.status !== "solved").length,
  problemsSolved: problems.filter((p) => p.status === "solved").length,
  totalCredit: citizens.reduce((sum, c) => sum + c.credit, 0),
  citizens: citizens.length,
};
