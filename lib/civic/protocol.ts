/**
 * The Civic Protocol, v0.1
 *
 * A tiny open contract that lets startup societies interoperate instead of
 * each rebuilding identity, events and coordination behind its own login.
 *
 * The movement's failure mode is that every society is built as a product:
 * a closed app with its own database. So when one is shut down (a licence
 * revoked, a lease lost, a founder leaving) its people cannot carry anything
 * with them, and the community dissolves with the venue. A protocol fixes
 * the class of problem that no single node can fix for itself.
 *
 * Design rules:
 *  1. Nodes own their data. The protocol owns only the contract.
 *  2. Read-only and public by default. Anything private stays behind the
 *     node's own gate and is never part of the federated surface.
 *  3. Consent over completeness. A node publishes people who opted in, not
 *     everyone it happens to know about.
 *  4. Exit is a feature. Members can always take their data elsewhere.
 *
 * Discovery: GET /.well-known/civic.json on any node.
 * Spec: docs/CIVIC-PROTOCOL.md. MIT licensed, implement it freely.
 */

export const CIVIC_VERSION = "0.1";

/** How a node describes itself at /.well-known/civic.json */
export type CivicManifest = {
  protocol: "civic";
  version: string;
  node: {
    id: string;
    name: string;
    url: string;
    description: string;
    /** "independent" means no host org can revoke this node's existence. */
    operator: "independent" | "hosted";
    license: string;
    source?: string;
  };
  endpoints: Record<string, string>;
  guarantees: {
    /** Members can export their own data in full, at any time. */
    exportable: boolean;
    /** Node publishes only people who opted in, never its full directory. */
    consentGated: boolean;
    openSource: boolean;
  };
};

/** A node's public vital signs. The honest numbers, including zeroes. */
export type CivicNodeStats = {
  /** People the node knows about. A roster size, not a claim of membership. */
  known: number;
  /** People who have actively opted in to being listed publicly. */
  listed: number;
  /** Open civic problems the community is working on. */
  problems: number;
  /** Distinct places this node's people are heading next. */
  destinations: number;
};

/** A person, only ever published with consent. */
export type CivicPerson = {
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  /** Where they are heading next, if they said. This is the opt-in signal. */
  nextDestination: string | null;
  nextOn: string | null;
};

/** A problem the community has surfaced. Public by design: townhall is open. */
export type CivicProblem = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  status: string;
  affected: number;
  upvotes: number;
  url: string;
  createdAt: string;
};

/** An event. Shape is fixed now so nodes can implement against it. */
export type CivicEvent = {
  id: string;
  title: string;
  startsAt: string;
  place: string | null;
  url: string | null;
};

const SITE = "https://ness.city";

export const NESS_MANIFEST: CivicManifest = {
  protocol: "civic",
  version: CIVIC_VERSION,
  node: {
    id: "ness.city",
    name: "Ness",
    url: SITE,
    description:
      "The civic layer for builders. Independent, portable, and not hosted by any campus or licence.",
    operator: "independent",
    license: "MIT",
    source: "https://github.com/adamtpang/ness.city",
  },
  endpoints: {
    node: "/api/civic/node",
    people: "/api/civic/people",
    problems: "/api/civic/problems",
    events: "/api/civic/events",
  },
  guarantees: {
    exportable: true,
    consentGated: true,
    openSource: true,
  },
};
