export type GroupCategory =
  | "build"
  | "money"
  | "body"
  | "mind"
  | "social"
  | "ops"
  | "fun";

export type WhatsappGroup = {
  id: string;
  name: string;
  blurb: string;
  category: GroupCategory;
  /** Public invite URL. Empty string if not yet shared. */
  invite: string;
  /** Optional admin or canonical organizer for transparency. */
  steward?: string;
};

/**
 * Curated NS interest groups. Seeded with the categories that come up
 * the most in any cohort. Invites stay empty until a group steward
 * shares a public link — then this file is the single place to update.
 *
 * Inspired by nspulse.xyz (Discord-derived NS stats) and the patterns
 * Adam has seen in #reception and #discussion. Ness doesn't republish
 * private data — every entry here is opt-in by a steward.
 */
export const groups: WhatsappGroup[] = [
  // BUILD
  {
    id: "g_ai_builders",
    name: "AI Builders",
    blurb: "LLM apps, agents, evals, prompts. Ship things, share notes.",
    category: "build",
    invite: "",
  },
  {
    id: "g_crypto_builders",
    name: "Crypto & Web3 Builders",
    blurb: "Onchain dev, smart contracts, wallets, indexing. Mostly EVM, some Solana.",
    category: "build",
    invite: "",
  },
  {
    id: "g_founders",
    name: "Founders Circle",
    blurb: "Solo + early-stage founders. Pitch practice, hard-conversation venting, intros.",
    category: "build",
    invite: "",
  },
  {
    id: "g_designers",
    name: "Designers + Brand",
    blurb: "Visual designers, brand strategists, illustrators. Critique each other's work.",
    category: "build",
    invite: "",
  },

  // MONEY
  {
    id: "g_traders",
    name: "Traders & Markets",
    blurb: "Crypto, equities, macro. Charts and screenshots.",
    category: "money",
    invite: "",
  },
  {
    id: "g_patrons",
    name: "Patrons & Backers",
    blurb: "Citizens who fund bounties on Ness or back NS member projects directly.",
    category: "money",
    invite: "",
  },
  {
    id: "g_hiring",
    name: "Hiring & Jobs",
    blurb: "Members looking and members hiring. Mirrors the Discord #hiring thread.",
    category: "money",
    invite: "",
  },

  // BODY
  {
    id: "g_burn",
    name: "Burn",
    blurb: "Lifters, cutters, runners. Daily check-ins. Pairs with the NS Burn programme.",
    category: "body",
    invite: "",
  },
  {
    id: "g_climb",
    name: "Climbing & Hiking",
    blurb: "Local crags, weekend trails, indoor sessions in JB and SG.",
    category: "body",
    invite: "",
  },
  {
    id: "g_football",
    name: "Football (Soccer)",
    blurb: "Pickup games, watching matches, league chat.",
    category: "body",
    invite: "",
  },

  // MIND
  {
    id: "g_books",
    name: "Books & Reading",
    blurb: "What we're reading. Monthly group reads with a discussion call.",
    category: "mind",
    invite: "",
  },
  {
    id: "g_meditation",
    name: "Yoga & Meditation",
    blurb: "Morning sits, stretch sessions, breathwork.",
    category: "mind",
    invite: "",
  },

  // SOCIAL
  {
    id: "g_dinners",
    name: "Dinners & Potlucks",
    blurb: "Who's cooking what, where, and when. Open spots posted daily.",
    category: "social",
    invite: "",
  },
  {
    id: "g_music",
    name: "Music & Concerts",
    blurb: "Concert tickets, jam sessions, share-the-aux nights.",
    category: "social",
    invite: "",
  },
  {
    id: "g_kids",
    name: "Kids at NS",
    blurb: "Parents coordinating playdates, schools, childcare.",
    category: "social",
    invite: "",
  },

  // OPS
  {
    id: "g_visa",
    name: "Visa & Admin",
    blurb: "Visa runs, immigration paperwork, address changes. Tribal knowledge.",
    category: "ops",
    invite: "",
  },
  {
    id: "g_food",
    name: "Forest City Food",
    blurb: "Where to eat, delivery codes, tested places.",
    category: "ops",
    invite: "",
  },
  {
    id: "g_apartments",
    name: "Apartments & Moves",
    blurb: "Subleases, bulky-item swaps, what to bring on day one.",
    category: "ops",
    invite: "",
  },

  // FUN
  {
    id: "g_minecraft",
    name: "Minecraft",
    blurb: "The community Minecraft server. Coordinates and builds.",
    category: "fun",
    invite: "",
  },
  {
    id: "g_movies",
    name: "Movies & Shows",
    blurb: "What's worth watching this week. Rotating watch parties.",
    category: "fun",
    invite: "",
  },
  {
    id: "g_photography",
    name: "Photography",
    blurb: "Phone shots and serious cameras. Local spots and editing tips.",
    category: "fun",
    invite: "",
  },
  {
    id: "g_travel",
    name: "Travel & Trips",
    blurb: "Group trips, KL/Bangkok/Singapore weekend runs, visa-fresh hacks.",
    category: "fun",
    invite: "",
  },
];

export const groupCategories: { id: GroupCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "build", label: "Build" },
  { id: "money", label: "Money" },
  { id: "body", label: "Body" },
  { id: "mind", label: "Mind" },
  { id: "social", label: "Social" },
  { id: "ops", label: "Ops" },
  { id: "fun", label: "Fun" },
];

export const categoryDot: Record<GroupCategory, string> = {
  build: "bg-blue-500",
  money: "bg-emerald-500",
  body: "bg-rose-500",
  mind: "bg-violet-500",
  social: "bg-amber-500",
  ops: "bg-cyan-500",
  fun: "bg-pink-500",
};
