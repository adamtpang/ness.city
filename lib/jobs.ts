export type JobCategory =
  | "engineering"
  | "ai"
  | "design"
  | "product"
  | "marketing"
  | "operations"
  | "leadership"
  | "fellowship";

export type JobType = "fulltime" | "contract" | "cofounder" | "fellowship";

export type Company = {
  id: string;
  name: string;
  founders?: string[];
  blurb?: string;
  url: string;
};

export type Role = {
  id: string;
  companyId: string;
  title: string;
  category: JobCategory;
  type: JobType;
  location: string;
  remote: boolean;
  comp?: string;
  blurb?: string;
  link: string;
  postedAt: string;
};

/**
 * Companies hiring on Ness Jobs. Curated public listings only.
 * Founder names are public information and listed for context, not as
 * endorsements. We don't republish private posts or member data.
 */
export const companies: Company[] = [
  {
    id: "c_cognition",
    name: "Cognition",
    founders: ["Scott Wu", "Steven Hao", "Walden Yan"],
    blurb:
      "Maker of Devin.ai and Windsurf. AI agents for software engineering. ARR went $1M → $73M in 8 months.",
    url: "https://cognition.ai",
  },
  {
    id: "c_varick",
    name: "Varick Agents",
    blurb: "AI agent products. SF-based. Visa support available.",
    url: "https://jobs.ashbyhq.com/Varick-Agents",
  },
  {
    id: "c_coingecko",
    name: "CoinGecko",
    founders: ["Bobby Ong", "TM Lee"],
    blurb:
      "Crypto data and analytics. KL-based, remote-friendly. Transparent salary bands.",
    url: "https://www.coingecko.com/en/jobs",
  },
  {
    id: "c_aifund",
    name: "AI Fund",
    founders: ["Andrew Ng"],
    blurb:
      "Andrew Ng's venture studio. Co-found a company alongside the team with up to $1M day-one funding.",
    url: "https://aifund.ai",
  },
  {
    id: "c_a16z",
    name: "Andreessen Horowitz",
    founders: ["Marc Andreessen", "Ben Horowitz"],
    blurb: "Venture firm. The Growth Fellowship is an 8-week cohort.",
    url: "https://a16z.com",
  },
  {
    id: "c_coindesk",
    name: "CoinDesk Consensus",
    blurb: "Crypto / DeFi / Web3 conference. Multi-org hiring board for the 2026 event.",
    url: "https://consensus.coindesk.com",
  },
  {
    id: "c_regenesis",
    name: "Regenesis Materials",
    blurb:
      "Singapore deep-tech. Material science with nano-bio for plastics, powered by quantum computing and AI.",
    url: "https://www.regenesismaterials.com",
  },
  {
    id: "c_revolut",
    name: "Revolut",
    founders: ["Nik Storonsky", "Vlad Yatsenko"],
    blurb: "Global neobank. London HQ.",
    url: "https://www.revolut.com/careers",
  },
  {
    id: "c_worldcoin",
    name: "Worldcoin (Tools for Humanity)",
    founders: ["Sam Altman", "Alex Blania"],
    blurb: "Proof-of-personhood network. Orb-verified human IDs.",
    url: "https://worldcoin.org/careers",
  },
  {
    id: "c_0x",
    name: "0x",
    founders: ["Will Warren", "Amir Bandeali"],
    blurb: "Decentralized exchange infrastructure across 30+ chains.",
    url: "https://www.0x.org/careers",
  },
  {
    id: "c_moonpay",
    name: "MoonPay",
    founders: ["Ivan Soto-Wright", "Victor Faramond"],
    blurb: "Crypto on-ramp. Buy and sell crypto with cards and bank transfers.",
    url: "https://www.moonpay.com/careers",
  },
  {
    id: "c_alchemy",
    name: "Alchemy",
    founders: ["Nikil Viswanathan", "Joe Lau"],
    blurb: "Web3 dev platform. APIs and infra for blockchain apps.",
    url: "https://www.alchemy.com/careers",
  },
  {
    id: "c_stripe",
    name: "Stripe",
    founders: ["Patrick Collison", "John Collison"],
    blurb: "Payments infrastructure for the internet.",
    url: "https://stripe.com/jobs",
  },
  {
    id: "c_kalshi",
    name: "Kalshi",
    founders: ["Tarek Mansour", "Luana Lopes Lara"],
    blurb: "Regulated event-contracts marketplace.",
    url: "https://kalshi.com/careers",
  },
  {
    id: "c_coinbase",
    name: "Coinbase",
    founders: ["Brian Armstrong", "Fred Ehrsam"],
    blurb: "The largest US crypto exchange.",
    url: "https://www.coinbase.com/careers",
  },
  {
    id: "c_sentient",
    name: "Sentient",
    founders: ["Pramod Viswanath", "Sandeep Nailwal", "Himanshu Tyagi"],
    blurb: "Open AGI lab building distributed AI ownership.",
    url: "https://sentient.xyz/careers",
  },
  {
    id: "c_deepgram",
    name: "Deepgram",
    founders: ["Scott Stephenson", "Noah Shutty"],
    blurb: "Voice AI: speech-to-text, agents, and audio understanding.",
    url: "https://deepgram.com/careers",
  },
  {
    id: "c_synthesia",
    name: "Synthesia",
    founders: ["Victor Riparbelli", "Steffen Tjerrild"],
    blurb: "AI video studio. Generate videos with AI avatars and voices.",
    url: "https://www.synthesia.io/careers",
  },
  {
    id: "c_addepto",
    name: "Addepto",
    blurb: "AI consulting and custom enterprise AI solutions.",
    url: "https://addepto.com/careers",
  },
  {
    id: "c_wise",
    name: "Wise",
    founders: ["Kristo Käärmann", "Taavet Hinrikus"],
    blurb: "Cross-border payments. Cheaper international transfers.",
    url: "https://wise.jobs",
  },
  {
    id: "c_cookunity",
    name: "CookUnity",
    founders: ["Mateo Marietti", "Lucas De Mendoza"],
    blurb: "Chef-prepared meal delivery marketplace.",
    url: "https://cookunity.com/careers",
  },
  {
    id: "c_deepl",
    name: "DeepL",
    founders: ["Jaroslaw Kutylowski"],
    blurb: "AI translation that beats Google for many language pairs.",
    url: "https://www.deepl.com/en/careers",
  },
  {
    id: "c_affirm",
    name: "Affirm",
    founders: ["Max Levchin"],
    blurb: "Buy-now-pay-later for the modern consumer.",
    url: "https://www.affirm.com/careers",
  },
  {
    id: "c_dh",
    name: "Delivery Hero",
    founders: ["Niklas Östberg"],
    blurb: "Global food delivery. Berlin-headquartered, operates in 70+ countries.",
    url: "https://careers.deliveryhero.com",
  },
  {
    id: "c_lemon",
    name: "Lemon.io",
    founders: ["Aleksandr Volodarsky"],
    blurb: "Vetted freelance marketplace for senior engineers.",
    url: "https://lemon.io/talent",
  },
  {
    id: "c_visa",
    name: "Visa",
    blurb: "Global payments network. Public, mature.",
    url: "https://corporate.visa.com/en/about-visa/careers.html",
  },
  {
    id: "c_fireblocks",
    name: "Fireblocks",
    founders: ["Michael Shaulov"],
    blurb: "Institutional-grade digital asset custody and ops.",
    url: "https://www.fireblocks.com/careers",
  },
  {
    id: "c_offchain",
    name: "Offchain Labs",
    founders: ["Steven Goldfeder", "Ed Felten"],
    blurb: "Builder of Arbitrum, the leading Ethereum L2.",
    url: "https://offchainlabs.com/careers",
  },
  {
    id: "c_ripple",
    name: "Ripple",
    founders: ["Chris Larsen", "Jed McCaleb"],
    blurb: "Crypto payments and CBDC infrastructure.",
    url: "https://ripple.com/careers",
  },
  {
    id: "c_circle",
    name: "Circle",
    founders: ["Jeremy Allaire", "Sean Neville"],
    blurb: "Issuer of USDC, the dominant regulated stablecoin.",
    url: "https://www.circle.com/careers",
  },
  {
    id: "c_anchorage",
    name: "Anchorage Digital",
    founders: ["Diogo Mónica", "Nathan McCauley"],
    blurb: "First federally-chartered crypto bank in the US.",
    url: "https://www.anchorage.com/careers",
  },
  {
    id: "c_ondo",
    name: "Ondo Finance",
    founders: ["Nathan Allman"],
    blurb: "Tokenized real-world assets, especially US Treasuries.",
    url: "https://ondo.finance/careers",
  },
  {
    id: "c_bitgo",
    name: "BitGo",
    founders: ["Mike Belshe"],
    blurb: "Multi-sig digital asset custody for institutions.",
    url: "https://www.bitgo.com/careers",
  },
];

export const roles: Role[] = [
  {
    id: "j_cognition_de_sea",
    companyId: "c_cognition",
    title: "Deployed Engineer (and AE), SEA",
    category: "engineering",
    type: "fulltime",
    location: "Singapore, Australia, or Korea",
    remote: false,
    blurb: "Define the playbook as one of the first deployed engineers in APAC.",
    link: "mailto:nathan.wangliao@cognition.ai",
    postedAt: "2026-04-02",
  },
  {
    id: "j_varick_ai_engineer",
    companyId: "c_varick",
    title: "AI Engineer / Strategist",
    category: "ai",
    type: "fulltime",
    location: "San Francisco",
    remote: false,
    comp: "$140K – $180K",
    link: "https://jobs.ashbyhq.com/Varick-Agents",
    postedAt: "2026-04-06",
  },
  {
    id: "j_coingecko_swe_l1",
    companyId: "c_coingecko",
    title: "Software Engineer, GeckoTerminal (L1)",
    category: "engineering",
    type: "fulltime",
    location: "Remote (KL-based)",
    remote: true,
    comp: "RM 8,962 – 9,858",
    link: "https://jobs.lever.co/coingecko/0bb646ae-9bd3-4da3-a60c-42b31fab4bcf",
    postedAt: "2026-04-16",
  },
  {
    id: "j_aifund_cofounder",
    companyId: "c_aifund",
    title: "Co-founder, validated Fortune-500 problems",
    category: "fellowship",
    type: "cofounder",
    location: "Remote",
    remote: true,
    comp: "Up to $1M day-one funding",
    link: "https://aifund.ai",
    postedAt: "2026-04-17",
  },
  {
    id: "j_a16z_growth_fellow",
    companyId: "c_a16z",
    title: "Growth Fellowship, 8-week cohort",
    category: "fellowship",
    type: "fellowship",
    location: "Remote",
    remote: true,
    link: "https://a16z.fillout.com/t/9RAnDmtvdkus",
    postedAt: "2026-04-21",
  },
  {
    id: "j_consensus_miami",
    companyId: "c_coindesk",
    title: "Cross-org hiring board",
    category: "operations",
    type: "fulltime",
    location: "Miami",
    remote: false,
    link: "https://consensus.coindesk.com/sponsor-job-board-application/",
    postedAt: "2026-04-24",
  },
  {
    id: "j_regenesis_pm",
    companyId: "c_regenesis",
    title: "Agile Project Manager / Scrum Master",
    category: "operations",
    type: "fulltime",
    location: "Singapore",
    remote: false,
    link: "https://www.regenesismaterials.com",
    postedAt: "2026-04-24",
  },

  // Revolut
  {
    id: "j_revolut_social",
    companyId: "c_revolut",
    title: "Global Social Media Manager",
    category: "marketing",
    type: "fulltime",
    location: "Various",
    remote: false,
    link: "https://www.revolut.com/careers",
    postedAt: "2026-04-12",
  },
  {
    id: "j_revolut_marketing",
    companyId: "c_revolut",
    title: "Marketing Manager",
    category: "marketing",
    type: "fulltime",
    location: "Various",
    remote: false,
    link: "https://www.revolut.com/careers",
    postedAt: "2026-04-21",
  },

  // Worldcoin
  {
    id: "j_worldcoin_ea",
    companyId: "c_worldcoin",
    title: "Senior Executive Assistant",
    category: "operations",
    type: "fulltime",
    location: "Various",
    remote: false,
    link: "https://worldcoin.org/careers",
    postedAt: "2026-04-12",
  },
  {
    id: "j_worldcoin_pm",
    companyId: "c_worldcoin",
    title: "Product Manager",
    category: "product",
    type: "fulltime",
    location: "Various",
    remote: false,
    link: "https://worldcoin.org/careers",
    postedAt: "2026-04-21",
  },

  // 0x
  {
    id: "j_0x_data_scientist",
    companyId: "c_0x",
    title: "Data Scientist",
    category: "ai",
    type: "fulltime",
    location: "Remote",
    remote: true,
    link: "https://www.0x.org/careers",
    postedAt: "2026-04-12",
  },

  // MoonPay
  {
    id: "j_moonpay_ml",
    companyId: "c_moonpay",
    title: "ML Engineer",
    category: "ai",
    type: "fulltime",
    location: "Remote",
    remote: true,
    link: "https://www.moonpay.com/careers",
    postedAt: "2026-04-12",
  },

  // Alchemy
  {
    id: "j_alchemy_pm",
    companyId: "c_alchemy",
    title: "Senior Product Manager",
    category: "product",
    type: "fulltime",
    location: "Remote",
    remote: true,
    link: "https://www.alchemy.com/careers",
    postedAt: "2026-04-12",
  },

  // Stripe
  {
    id: "j_stripe_swe",
    companyId: "c_stripe",
    title: "Software Engineer",
    category: "engineering",
    type: "fulltime",
    location: "Various",
    remote: false,
    link: "https://stripe.com/jobs",
    postedAt: "2026-04-12",
  },

  // Kalshi
  {
    id: "j_kalshi_brand",
    companyId: "c_kalshi",
    title: "Brand Designer",
    category: "design",
    type: "fulltime",
    location: "Various",
    remote: false,
    link: "https://kalshi.com/careers",
    postedAt: "2026-04-12",
  },
  {
    id: "j_kalshi_pmm",
    companyId: "c_kalshi",
    title: "Product Marketing Lead",
    category: "marketing",
    type: "fulltime",
    location: "Various",
    remote: false,
    link: "https://kalshi.com/careers",
    postedAt: "2026-04-21",
  },

  // Coinbase
  {
    id: "j_coinbase_em",
    companyId: "c_coinbase",
    title: "Engineering Manager",
    category: "leadership",
    type: "fulltime",
    location: "Remote",
    remote: true,
    link: "https://www.coinbase.com/careers",
    postedAt: "2026-04-12",
  },

  // Sentient
  {
    id: "j_sentient_strategy",
    companyId: "c_sentient",
    title: "Director of Strategy",
    category: "leadership",
    type: "fulltime",
    location: "Various",
    remote: false,
    link: "https://sentient.xyz/careers",
    postedAt: "2026-04-12",
  },

  // Deepgram
  {
    id: "j_deepgram_systems_arch",
    companyId: "c_deepgram",
    title: "Systems Architect, AI/ML Infrastructure",
    category: "engineering",
    type: "fulltime",
    location: "Remote",
    remote: true,
    link: "https://deepgram.com/careers",
    postedAt: "2026-04-20",
  },

  // Synthesia
  {
    id: "j_synthesia_csm",
    companyId: "c_synthesia",
    title: "Strategic Customer Success Manager",
    category: "operations",
    type: "fulltime",
    location: "Various",
    remote: false,
    link: "https://www.synthesia.io/careers",
    postedAt: "2026-04-20",
  },

  // Addepto
  {
    id: "j_addepto_po",
    companyId: "c_addepto",
    title: "Product Owner",
    category: "product",
    type: "fulltime",
    location: "Remote",
    remote: true,
    link: "https://addepto.com/careers",
    postedAt: "2026-04-20",
  },

  // Wise
  {
    id: "j_wise_product_analyst",
    companyId: "c_wise",
    title: "Senior Product Analyst",
    category: "product",
    type: "fulltime",
    location: "Various",
    remote: false,
    link: "https://wise.jobs",
    postedAt: "2026-04-20",
  },

  // CookUnity
  {
    id: "j_cookunity_pm",
    companyId: "c_cookunity",
    title: "Product Manager",
    category: "product",
    type: "fulltime",
    location: "Remote",
    remote: true,
    link: "https://cookunity.com/careers",
    postedAt: "2026-04-20",
  },

  // DeepL
  {
    id: "j_deepl_solutions",
    companyId: "c_deepl",
    title: "Solutions Consultant",
    category: "operations",
    type: "fulltime",
    location: "Various",
    remote: false,
    link: "https://www.deepl.com/en/careers",
    postedAt: "2026-04-20",
  },

  // Affirm
  {
    id: "j_affirm_pm",
    companyId: "c_affirm",
    title: "Senior Product Manager",
    category: "product",
    type: "fulltime",
    location: "Remote",
    remote: true,
    link: "https://www.affirm.com/careers",
    postedAt: "2026-04-20",
  },

  // Delivery Hero
  {
    id: "j_dh_comms",
    companyId: "c_dh",
    title: "Manager, Communications",
    category: "marketing",
    type: "fulltime",
    location: "Various",
    remote: false,
    link: "https://careers.deliveryhero.com",
    postedAt: "2026-04-20",
  },

  // Lemon.io
  {
    id: "j_lemon_fullstack",
    companyId: "c_lemon",
    title: "Senior Full-stack React Developer",
    category: "engineering",
    type: "contract",
    location: "Remote",
    remote: true,
    blurb: "Vetted freelance.",
    link: "https://lemon.io/talent",
    postedAt: "2026-04-20",
  },

  // Visa
  {
    id: "j_visa_design",
    companyId: "c_visa",
    title: "Senior Designer",
    category: "design",
    type: "fulltime",
    location: "Various",
    remote: false,
    link: "https://corporate.visa.com/en/about-visa/careers.html",
    postedAt: "2026-04-20",
  },

  // Fireblocks
  {
    id: "j_fireblocks_backend",
    companyId: "c_fireblocks",
    title: "Senior Backend Engineer",
    category: "engineering",
    type: "fulltime",
    location: "Remote",
    remote: true,
    link: "https://www.fireblocks.com/careers",
    postedAt: "2026-04-21",
  },

  // Offchain Labs
  {
    id: "j_offchain_enterprise",
    companyId: "c_offchain",
    title: "Head of Enterprise",
    category: "leadership",
    type: "fulltime",
    location: "Remote",
    remote: true,
    link: "https://offchainlabs.com/careers",
    postedAt: "2026-04-21",
  },

  // Ripple
  {
    id: "j_ripple_recruiter",
    companyId: "c_ripple",
    title: "Senior Business Recruiter",
    category: "operations",
    type: "fulltime",
    location: "Various",
    remote: false,
    link: "https://ripple.com/careers",
    postedAt: "2026-04-21",
  },

  // Circle
  {
    id: "j_circle_ea",
    companyId: "c_circle",
    title: "Executive Assistant",
    category: "operations",
    type: "fulltime",
    location: "Various",
    remote: false,
    link: "https://www.circle.com/careers",
    postedAt: "2026-04-21",
  },

  // Anchorage
  {
    id: "j_anchorage_data_gov",
    companyId: "c_anchorage",
    title: "Data Governance and Management Lead",
    category: "leadership",
    type: "fulltime",
    location: "Remote",
    remote: true,
    link: "https://www.anchorage.com/careers",
    postedAt: "2026-04-21",
  },

  // Ondo
  {
    id: "j_ondo_designer",
    companyId: "c_ondo",
    title: "Senior Web & UI Designer",
    category: "design",
    type: "fulltime",
    location: "Remote",
    remote: true,
    link: "https://ondo.finance/careers",
    postedAt: "2026-04-21",
  },

  // BitGo
  {
    id: "j_bitgo_infra",
    companyId: "c_bitgo",
    title: "Senior Infrastructure Engineer",
    category: "engineering",
    type: "fulltime",
    location: "Remote",
    remote: true,
    link: "https://www.bitgo.com/careers",
    postedAt: "2026-04-21",
  },
];

export type CompanyWithRoles = Company & { roles: Role[] };

export function companiesWithRoles(): CompanyWithRoles[] {
  const byCompany = new Map<string, Role[]>();
  for (const r of roles) {
    const arr = byCompany.get(r.companyId) ?? [];
    arr.push(r);
    byCompany.set(r.companyId, arr);
  }
  // Sort each company's roles by postedAt desc
  const result: CompanyWithRoles[] = [];
  for (const c of companies) {
    const cr = byCompany.get(c.id) ?? [];
    cr.sort((a, b) => (b.postedAt > a.postedAt ? 1 : -1));
    if (cr.length > 0) result.push({ ...c, roles: cr });
  }
  // Sort companies by their newest role
  result.sort((a, b) => {
    const ad = a.roles[0]?.postedAt ?? "";
    const bd = b.roles[0]?.postedAt ?? "";
    return bd > ad ? 1 : -1;
  });
  return result;
}

export const jobCategories: { id: JobCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "engineering", label: "Engineering" },
  { id: "ai", label: "AI / ML / Data" },
  { id: "design", label: "Design" },
  { id: "product", label: "Product" },
  { id: "marketing", label: "Marketing" },
  { id: "operations", label: "Operations" },
  { id: "leadership", label: "Leadership" },
  { id: "fellowship", label: "Fellowship" },
];

export const jobStats = {
  total: roles.length,
  companies: companies.length,
  remote: roles.filter((r) => r.remote).length,
  withComp: roles.filter((r) => r.comp).length,
};

// Backward-compat: legacy `jobs` export still works for any old import
export const jobs = roles;
export type Job = Role;
