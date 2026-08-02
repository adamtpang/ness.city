# The Civic Protocol, v0.1

An open contract for startup societies, network states, popup villages and any
community that lives in more than one place.

MIT licensed. Implement it, fork it, ignore the parts you dislike.

Reference implementation: [ness.city](https://ness.city). Discovery endpoint:
[ness.city/.well-known/civic.json](https://ness.city/.well-known/civic.json).

---

## Why this exists

Every startup society is built as a **product**: a closed app, its own login,
its own database. Nothing composes. So when a node dies, and nodes do die, its
people cannot carry their identity, their reputation, or even their address
book anywhere. The community dissolves with the venue.

In July 2026 the Network School in Forest City was ordered to cease operations
over a licensing irregularity. Not a scandal, not a vote, a permit. Within
hours the founder had signed with another country. The residents, who had paid
to be part of a community, had no infrastructure of their own and simply
scattered.

That is not a story about one project. It is the predictable failure mode of
building a decentralised idea on a centralised stack. One founder, one campus,
one licence, one country: every failure mode is single-point.

A protocol fixes the class of problem no single node can fix for itself.

## Design rules

1. **Nodes own their data.** The protocol owns only the contract. There is no
   central server, no registry you must join, no one who can revoke you.
2. **Read-only and public by default.** Anything private stays behind the
   node's own gate and never appears on the federated surface.
3. **Consent over completeness.** Publish people who opted in, never your full
   directory. A network of nodes must not become a way to launder a roster
   into the open.
4. **Exit is a feature.** Members can export their own data in full, at any
   time. If they cannot leave, they are not members, they are inventory.

Rule 3 is the one people will be tempted to break. Do not break it.

## Discovery

Serve a manifest at `/.well-known/civic.json`:

```json
{
  "protocol": "civic",
  "version": "0.1",
  "node": {
    "id": "ness.city",
    "name": "Ness",
    "url": "https://ness.city",
    "description": "The civic layer for builders.",
    "operator": "independent",
    "license": "MIT",
    "source": "https://github.com/adamtpang/ness.city"
  },
  "endpoints": {
    "node": "/api/civic/node",
    "people": "/api/civic/people",
    "problems": "/api/civic/problems",
    "events": "/api/civic/events"
  },
  "guarantees": {
    "exportable": true,
    "consentGated": true,
    "openSource": true
  }
}
```

`operator` is either `independent` (no host organisation can revoke this node's
existence) or `hosted`. Be honest about it. It is the single most useful field
for anyone deciding how much to depend on you.

## Endpoints

All are `GET`, return JSON, and send `Access-Control-Allow-Origin: *`.
Any endpoint you have not built yet should still respond, with an empty
collection and `"implemented": false`. A protocol whose endpoints appear one at
a time is not something anyone can build against.

### `node`

Aggregate vital signs. Counts only, never a list.

```json
{ "id": "ness.city", "name": "Ness", "version": "0.1",
  "stats": { "known": 2753, "listed": 0, "problems": 7, "destinations": 0 } }
```

`known` is how many people the node has records for. `listed` is how many opted
in to appear publicly. **These are deliberately different numbers.** Publishing
a roster size is not the same as publishing a roster.

### `people`

Only members who opted in. Never your directory.

```json
{ "people": [ { "handle": "maanasa", "displayName": "Maanasa G.",
  "avatarUrl": null, "nextDestination": "Batam", "nextOn": "Aug 5" } ],
  "total": 1 }
```

The opt-in signal that works best in practice is a member volunteering where
they are heading next. It is a deliberate public act, and it is the thing
worth federating: it lets someone in another city find who is arriving.

### `problems`

Open civic problems. Public by design.

```json
{ "problems": [ { "slug": "mould-in-block-d", "title": "Mould in Block D",
  "summary": "...", "category": "infra", "status": "open", "affected": 12,
  "upvotes": 30, "url": "https://ness.city/townhall/mould-in-block-d",
  "createdAt": "2026-08-02T00:00:00.000Z" } ], "total": 1 }
```

This is the most immediately useful endpoint. Every society hits the same
things (housing, food, visas, mould, nightlife, childcare) and right now each
one rediscovers the answer alone. Federated problems let a node in Batam read
what a node in Forest City already solved.

### `events`

```json
{ "events": [ { "id": "...", "title": "Friday dinner",
  "startsAt": "2026-08-08T11:00:00.000Z", "place": "Beach", "url": null } ],
  "total": 1 }
```

## Implementing it

Four things, in order, none of them large:

1. Serve `/.well-known/civic.json`.
2. Serve `node`, with honest numbers including the zeroes.
3. Serve `problems`. It is public already and costs you nothing.
4. Serve `people`, opt-in only.

That is the whole protocol. It is deliberately small enough to add to an
existing app in an afternoon, because a protocol nobody implements is just an
opinion.

## What is not in v0.1

- **Portable identity.** One person, one ID across nodes. This is v0.2 and it
  is the hard part.
- **Portable reputation.** Ratings and rings travelling with the person rather
  than living in one node's database. v0.3.
- **Writes.** v0.1 is read-only on purpose. Federated writes need identity
  first, and identity needs to be got right rather than got early.

## Registry

A registry is just a client that fetches manifests and renders them. It holds
no authority and can be replaced. [interneta.world](https://interneta.world)
runs one; run your own if you would rather not depend on it. That is the point.
