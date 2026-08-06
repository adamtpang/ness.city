/**
 * The story so far. Curated, not exhaustive: only the changes that actually
 * mattered to the physical community, told in plain language, not commit
 * messages. The full technical log (every commit, every fix) lives in git
 * history and on GitHub; this page is for people, not for engineers.
 *
 * Numbers belong on nskpi.com, not here. This page tells the story; nskpi
 * tells the score.
 */
export type StoryEntry = {
  when: string; // "Month Year", deliberately not a precise date
  title: string;
  body: string;
};

export const STORY: StoryEntry[] = [
  {
    when: "April 2026",
    title: "Ness goes live, for real.",
    body: "No more mockups. A real, working platform, and its own name, independent of Network School from day one.",
  },
  {
    when: "May 2026",
    title: "Townhall opens.",
    body: "Anyone can surface a problem, propose a fix, fund it, and ship it, in the open. The bottom-up loop the whole project is built around.",
  },
  {
    when: "May 2026",
    title: "Market and PageRank open.",
    body: "A place to trade inside the community instead of on someone else's platform, and a way to map who the community actually trusts, ring by ring.",
  },
  {
    when: "June 2026",
    title: "Nessie starts listening.",
    body: "An always-on companion that checks in with members, so feedback doesn't only come from whoever happens to be loudest.",
  },
  {
    when: "June 2026",
    title: "The front door changes.",
    body: "The home page stops being a pitch and starts being the community's real, live work: what's open, what's shipping, right now.",
  },
  {
    when: "July 2026",
    title: "The rating index ships.",
    body: "Rate the room, see who's building. The more you take part, the more of the index you see. Nobody ever sees their own score.",
  },
  {
    when: "Early August 2026",
    title: "Network School's Malaysia campus is shut down.",
    body: "A licensing decision, not a scandal. Within a day, a new campus in Kazakhstan is announced, real land, real state backing. But the recovery ran through one founder's own backup, not through anything the community owned. Nobody carried a roster, an event history, or their own reputation between the two.",
  },
  {
    when: "August 2026",
    title: "Ness answers, fast.",
    body: "Rating goes fully anonymous, no login required to take part. The directory is locked behind real participation instead of sitting open to anyone. \"Where next\" opens, so a community that's mid-move can still find each other in the next city.",
  },
  {
    when: "August 2026",
    title: "The Civic Protocol ships.",
    body: "An open, MIT-licensed way for a community like this one to publish its own real numbers and let its members carry their identity somewhere else. No central server, no gatekeeper. Ness is the first node.",
  },
  {
    when: "August 2026",
    title: "nskpi.com comes back.",
    body: "Not a directory of who exists, a live registry of what's actually true: population, participation, open problems, read straight from the protocol.",
  },
  {
    when: "August 2026",
    title: "The roadmap gets rebuilt.",
    body: "The old internal critique table, which named individual people against numbers nobody could check, is retired. What replaces it: where this came from, where it's going, and why, in the open.",
  },
  {
    when: "August 2026",
    title: "Events and food go native.",
    body: "What's happening and what's cooking, posted by the community itself, working wherever the community is physically standing. The first two things ness.city needed to actually replace, not just supplement.",
  },
];
