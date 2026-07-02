# Ness shoulds

Ness exists to turn what the Network School community says *should* happen into
things that actually happen. This file is the running list: the backlog and the
manifesto in one place. Add a "should" by filing it on the board, or open a PR
against this file.

## Principles (how Ness should operate)

- **Bottom-up.** Problems and ideas come from members, not from the top. Ness is
  where they get filed, ranked, funded, and closed.
- **Open by default.** Open-source code, open financials. Run it like a public
  company that publishes its numbers.
- **Pay for outcomes.** Real problems get real bounties, paid in USDC on Base
  when solved. Money follows results.
- **Two ledgers of credit.** Solvers (who do the work) and patrons (who fund it)
  both get visible recognition.
- **Quality over quantity of people.** A community is only as good as who it lets
  in. Curate.
- **Free tools first.** Give the community genuinely useful free tools before
  asking for anything back.
- **Trust is earned and visible.** Reputation comes from vouching and delivery,
  not from claims.

## Ness product shoulds

### Shipped

- **The board** (`/`): file a problem, anonymously or not, vote it up or down by
  importance. Real persistent voting, one member one vote, one honest ranked list.
- **`/mdac`**: save your Malaysia Digital Arrival Card details once, copy them
  into the government form on every visa run. Private, on-device only.
- **`/routers`**: a free WiFi router setup tool for campus. Scans the label with
  Claude vision and walks you through it. Built for an intern to run.
- **`/join`** and **`/join/list`**: QR plus email capture for the waitlist.
- **`/market`**: local classifieds.
- **`/clubs`**, **`/whatsapp`**: interest-group plazas.
- **`/os`**: a GitHub lens on ns.com (issues and PRs).
- **`/points`**: NS Points calculator.
- **`/pagerank`**: interactive reputation-ring builder.
- **`/games`**: placeholder hub for the community Minecraft server.
- **Backend**: Supabase Postgres wired end to end (problem to proposal to bounty
  to pledge), hosted in Singapore.

### Building / next

- **Community curation**: invite, vouch, and reputation, so good people compound
  and bad actors never get in. (priority, see below)
- **Singapore connection**: a `/crossing` hub that owns the daily border chore.
  (priority, see below)
- **Nessie**: an AI that interviews members about their NS experience, diagnoses
  real problems, and seeds the board. Should run 24/7.
- **Payouts**: USDC on Base via Privy auth.
- **First waitlist cohort**: email CTA plus a WhatsApp group (open sourcerers,
  patrons, solvers).
- **A "Free tools" row** in the nav and footer for `/mdac`, `/routers`, `/games`.

### Proposed / someday

- **City-map home**: an illustrated, clickable city where each landmark is a tool.
- **Dual leaderboards** surfaced throughout the site.
- **Built-in member discovery**: find your people by character, ability, and
  energy, not just a flat list. (Today this is a private, local tool.)

## NS community shoulds

Things members want from Network School itself. Ness's job is to surface them,
rank them, and where it can, build or broker them.

- **Singapore connectivity**: smoother visa runs, a cross-border Grab deal, the
  stampless boat/ferry option, eGate eligibility, live checkpoint timing.
- **Curate who gets in.** Letting in low-integrity people repels high-quality ones.
- **Better member discovery**: find people by who they are, not just a directory.
- **Interest clubs** and a recurring fair.
- **A community Minecraft server.**
- **Onboarding and community structure** improvements.

## The two current priorities

### 1. Community curation

The core insight: network quality is asymmetric. One low-integrity person can
drive out ten high-quality ones, so who gets in *is* the product.

- Build curation as **vouching plus reputation, not a blacklist.** Distributed
  trust ages well; top-down banning invites bias and drama.
- **Seed from a high-quality, vouched core** (the first cohort) and grow by
  invite. Quality compounds from a quality seed.
- A private, local people-rater (Character, Ability, Energy) is *personal*
  curation. The *community* version is the vouch-and-reputation graph already
  sketched at `/pagerank`.
- **Open question, governance**: who can vouch, what a vouch is worth, and how to
  keep it fair.

### 2. Singapore connection

Forest City sits on the border. The Singapore crossing is the highest-frequency
chore in every member's week, so owning it makes Ness a daily habit.

A `/crossing` hub, extending `/mdac`:

- MDAC arrival card (done)
- eGate / autogate eligibility check (the stampless path)
- The stampless boat/ferry alternative to the causeway queues
- The cross-border Grab deal
- Live checkpoint timing: when the JB land crossing is clear versus jammed
- Visa rules in plain language

Utility like this is what makes people open ness.city without being asked. The
engine is the mission; the crossing is the habit.
