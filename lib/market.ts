export type ListingKind =
  | "forsale"
  | "free"
  | "wanted"
  | "housing"
  | "service"
  | "ride"
  | "community";

export type ContactKind = "whatsapp" | "email" | "discord" | "telegram";

export type Listing = {
  id: string;
  kind: ListingKind;
  title: string;
  body: string;
  /** USD; null means N/A (free, wanted, community). */
  priceUsd: number | null;
  /** Free-text rate ("$60/hr", "$25/hr") for services. */
  rate?: string;
  authorName: string;
  authorHandle: string;
  contactKind: ContactKind;
  /** Revealed only when the visitor clicks "Reply". Format depends on contactKind. */
  contactValue: string;
  postedAt: string;
  status: "open" | "claimed" | "expired";
};

/**
 * Seeded NS-flavored listings. Real submissions land here as a CSV /
 * Townhall problem until we add a `listings` table. Keep authorName /
 * contactValue plausible since they're displayed publicly.
 */
export const listings: Listing[] = [
  {
    id: "l_001",
    kind: "forsale",
    title: "Hyundai i10 (2018, 38k km, perfect for JB runs)",
    body: "One-owner since new. Just serviced, fresh tires. Selling because I'm leaving the cohort. Title transfer same week.",
    priceUsd: 4800,
    authorName: "Marcus Lee",
    authorHandle: "marcus",
    contactKind: "whatsapp",
    contactValue: "+60-12-555-0123",
    postedAt: "2026-05-04",
    status: "open",
  },
  {
    id: "l_002",
    kind: "forsale",
    title: "Brompton M6L folding bike",
    body: "Black, M-bar 6-speed, original saddle. Has Brooks grips. Great for the coworking commute. Will throw in a transit cover.",
    priceUsd: 850,
    authorName: "Priya Krishnan",
    authorHandle: "priya.k",
    contactKind: "whatsapp",
    contactValue: "+60-19-444-0987",
    postedAt: "2026-05-03",
    status: "open",
  },
  {
    id: "l_003",
    kind: "forsale",
    title: "Standing desk + dual monitor arm",
    body: "Flexispot E7, 140cm × 70cm bamboo top. Vivo dual-monitor mount. Ideal home setup, can deliver within campus.",
    priceUsd: 220,
    authorName: "Jonas Weber",
    authorHandle: "jonas",
    contactKind: "discord",
    contactValue: "jonas#4421",
    postedAt: "2026-05-02",
    status: "open",
  },
  {
    id: "l_004",
    kind: "forsale",
    title: "Adjustable dumbbells 5–25 kg pair",
    body: "Bowflex SelectTech 552. Replaced by gym membership. Saves a closet vs a full rack.",
    priceUsd: 280,
    authorName: "Kofi Mensah",
    authorHandle: "kofi",
    contactKind: "whatsapp",
    contactValue: "+44-7700-900123",
    postedAt: "2026-05-02",
    status: "open",
  },
  {
    id: "l_005",
    kind: "free",
    title: "Moving out: full kitchen kit",
    body: "Pans, plates, glasses, cutlery, a kettle, a rice cooker. Take everything or pick. Pickup B2-08, this weekend.",
    priceUsd: null,
    authorName: "Lena Petrova",
    authorHandle: "lena",
    contactKind: "telegram",
    contactValue: "@lenap",
    postedAt: "2026-05-04",
    status: "open",
  },
  {
    id: "l_006",
    kind: "free",
    title: "4x potted plants (monstera, pothos, snake plant, fiddle)",
    body: "Healthy. Watering schedule taped to each pot. Need to find them homes before flight.",
    priceUsd: null,
    authorName: "Aisha Bello",
    authorHandle: "aisha",
    contactKind: "whatsapp",
    contactValue: "+234-803-555-7788",
    postedAt: "2026-05-03",
    status: "open",
  },
  {
    id: "l_007",
    kind: "wanted",
    title: "Looking: standing desk for new arrival",
    body: "Just moved in B6. Will pay up to $200 for a working standing desk. Pickup same day.",
    priceUsd: null,
    authorName: "Naomi Park",
    authorHandle: "naomi",
    contactKind: "whatsapp",
    contactValue: "+1-415-555-6677",
    postedAt: "2026-05-04",
    status: "open",
  },
  {
    id: "l_008",
    kind: "wanted",
    title: "Ride to Singapore Changi, Friday morning",
    body: "Need to be at T3 by 8am. Happy to split the toll + petrol. Two carry-on bags only.",
    priceUsd: null,
    authorName: "Devraj Iyer",
    authorHandle: "devraj",
    contactKind: "whatsapp",
    contactValue: "+91-98765-43210",
    postedAt: "2026-05-04",
    status: "open",
  },
  {
    id: "l_009",
    kind: "housing",
    title: "Sublease: B2-12, 6 months, June – November",
    body: "Furnished one-bedroom. Strong wifi (already on AP-3 fix). Pool view. $1100/mo + utilities. References checked.",
    priceUsd: 1100,
    authorName: "Marcus Lee",
    authorHandle: "marcus",
    contactKind: "whatsapp",
    contactValue: "+60-12-555-0123",
    postedAt: "2026-05-01",
    status: "open",
  },
  {
    id: "l_010",
    kind: "housing",
    title: "Roommate wanted: B5-21, $750/mo",
    body: "Two-bed, one-bath. Sharing with a quiet builder, mid-30s. Walking distance to coworking. Move-in June 1.",
    priceUsd: 750,
    authorName: "Emiko Tanaka",
    authorHandle: "emiko",
    contactKind: "discord",
    contactValue: "emiko#1010",
    postedAt: "2026-04-30",
    status: "open",
  },
  {
    id: "l_011",
    kind: "service",
    title: "Event + headshot photography",
    body: "Shot 4 NS events last cohort. Same-day delivery for headshots. Portfolio on request. Bring me to your dinner.",
    priceUsd: null,
    rate: "$80/hr",
    authorName: "Aisha Bello",
    authorHandle: "aisha",
    contactKind: "whatsapp",
    contactValue: "+234-803-555-7788",
    postedAt: "2026-04-28",
    status: "open",
  },
  {
    id: "l_012",
    kind: "service",
    title: "Vibecoding partner. AI agents, Next.js, Vercel.",
    body: "Pair with you on shipping a v1 in a weekend. Best at agent loops, prompt eval, payments. Sample work: ness.city itself.",
    priceUsd: null,
    rate: "$60/hr",
    authorName: "Jonas Weber",
    authorHandle: "jonas",
    contactKind: "discord",
    contactValue: "jonas#4421",
    postedAt: "2026-04-27",
    status: "open",
  },
  {
    id: "l_013",
    kind: "service",
    title: "Spanish conversation tutoring",
    body: "Native speaker from Buenos Aires. Conversational, no rote drills. Online or in person at the coworking.",
    priceUsd: null,
    rate: "$25/hr",
    authorName: "Lena Petrova",
    authorHandle: "lena",
    contactKind: "telegram",
    contactValue: "@lenap",
    postedAt: "2026-04-29",
    status: "open",
  },
  {
    id: "l_014",
    kind: "ride",
    title: "KLIA airport run, Saturday 6am",
    body: "Driving up early Sat, 4 seats, leaving from the coworking. $40 each split for fuel + tolls. Coffee stop at the rest area.",
    priceUsd: 40,
    authorName: "Marcus Lee",
    authorHandle: "marcus",
    contactKind: "whatsapp",
    contactValue: "+60-12-555-0123",
    postedAt: "2026-05-04",
    status: "open",
  },
  {
    id: "l_015",
    kind: "ride",
    title: "JB visa run, Tuesday, 4 seats",
    body: "Quick in-out at the JB ICA. Leaving 9am, back by 1pm. Bring your passport. $20 split for fuel.",
    priceUsd: 20,
    authorName: "Priya Krishnan",
    authorHandle: "priya.k",
    contactKind: "whatsapp",
    contactValue: "+60-19-444-0987",
    postedAt: "2026-05-03",
    status: "open",
  },
  {
    id: "l_016",
    kind: "community",
    title: "Lost: AirPods Pro near coworking gate",
    body: "Black case, slight scuff. Must've fallen out of a tote. Buying coffee for whoever finds them.",
    priceUsd: null,
    authorName: "Kofi Mensah",
    authorHandle: "kofi",
    contactKind: "whatsapp",
    contactValue: "+44-7700-900123",
    postedAt: "2026-05-04",
    status: "open",
  },
  {
    id: "l_017",
    kind: "community",
    title: "Costco group order. Sunday delivery.",
    body: "Driving to Tuas Costco Sunday morning. Comment what you want, I'll come back with the receipt and you Venmo. No bulk peanut butter limits.",
    priceUsd: null,
    authorName: "Naomi Park",
    authorHandle: "naomi",
    contactKind: "whatsapp",
    contactValue: "+1-415-555-6677",
    postedAt: "2026-05-02",
    status: "open",
  },
];

export const listingKinds: { id: ListingKind | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "forsale", label: "For sale" },
  { id: "free", label: "Free" },
  { id: "wanted", label: "Wanted" },
  { id: "housing", label: "Housing" },
  { id: "service", label: "Services" },
  { id: "ride", label: "Rides" },
  { id: "community", label: "Community" },
];

export const kindStyles: Record<
  ListingKind,
  { dot: string; label: string }
> = {
  forsale: { dot: "bg-blue-500", label: "For sale" },
  free: { dot: "bg-emerald-500", label: "Free" },
  wanted: { dot: "bg-amber-500", label: "Wanted" },
  housing: { dot: "bg-violet-500", label: "Housing" },
  service: { dot: "bg-cyan-500", label: "Service" },
  ride: { dot: "bg-rose-500", label: "Ride" },
  community: { dot: "bg-pink-500", label: "Community" },
};

export function formatListingPrice(l: Listing): string {
  if (l.kind === "free") return "FREE";
  if (l.kind === "wanted") return "WANTED";
  if (l.kind === "service" && l.rate) return l.rate;
  if (l.kind === "community") return "·";
  if (l.kind === "ride" && l.priceUsd) return `$${l.priceUsd} split`;
  if (l.kind === "housing" && l.priceUsd) return `$${l.priceUsd}/mo`;
  if (l.priceUsd != null) return `$${l.priceUsd}`;
  return "·";
}

export function daysAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const days = Math.floor(ms / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function contactLabel(kind: ContactKind): string {
  switch (kind) {
    case "whatsapp":
      return "WhatsApp";
    case "email":
      return "Email";
    case "discord":
      return "Discord";
    case "telegram":
      return "Telegram";
  }
}

export function contactHref(kind: ContactKind, value: string): string {
  switch (kind) {
    case "whatsapp": {
      const digits = value.replace(/[^\d]/g, "");
      return `https://wa.me/${digits}`;
    }
    case "telegram": {
      const handle = value.replace(/^@/, "");
      return `https://t.me/${handle}`;
    }
    case "email":
      return `mailto:${value}`;
    case "discord":
      return "#";
  }
}
