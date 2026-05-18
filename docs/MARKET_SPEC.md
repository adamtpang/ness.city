# ness.city/market — Spec Sheet

A craigslist for the physical community. Shipped, intentionally minimal.

## First principles

**What craigslist.org actually is (stripped to essence):**
- A dense, plain-text noticeboard. Near-zero chrome.
- Post with almost no friction. Browse by category.
- Contact is relayed, not exposed. Listings expire (30 days).
- No payments, no ratings, no algorithm. It is a bulletin board, not a store.

**What facebook.com/marketplace adds:**
- Every listing is attached to a real identity. That is the entire trust model.
- Category + search, card layout, message the seller.
- No escrow. Trust comes from the profile and the social graph, not from the platform.

**Synthesis for an NS-shaped community:**
The members are physically colocated in one place. That changes the math:
- Trust does not need ratings or escrow. Reputation is real and face-to-face.
- Identity is the trust layer (craigslist never had it; we do, via the handle).
- No in-app payments. Trades happen in person, in cash / USDC / the Costco run.
- So: craigslist's simplicity + Facebook's identity, minus everything else.

## Shipped features (this is the whole product)

| Feature | Status | Notes |
|---|---|---|
| Browse feed | ✅ live | Dense rows, newest first, hover affordance |
| 7 categories | ✅ live | for sale, free, wanted, housing, services, rides, community |
| Category filter pills | ✅ live | Animated, sticky, live counts |
| Identity-linked listings | ✅ live | Every listing carries a handle → resolves to a citizen |
| Reveal-to-contact | ✅ live | Contact hidden until visitor clicks Reply (craigslist relay spirit) |
| Post a listing | ✅ live | `/market/new`, one-minute form, identity cached in localStorage |
| 30-day expiry | ✅ live | `expiresAt` set on create |
| Seed fallback | ✅ live | Static seed shows when DB empty so the feed is never blank |
| Live persistence | ✅ live | Supabase `market_listings`, GET/POST `/api/market` |

## Explicitly NOT in scope (kept out on purpose)

- In-app payments / escrow — trades are in person.
- Ratings / reviews — physical community, reputation is already real.
- Photos upload pipeline — text-first like craigslist; add later only if needed.
- Search box — 7 filtered categories is enough at this community size.
- Editing / deleting via UI — expiry handles cleanup; revisit if abused.
- Notifications / DMs — contact handoff is the reply reveal, then off-platform.

## Data model

`market_listings`: kind, title, body, priceCents?, rate?, sellerId→citizens,
sellerHandle, sellerDisplayName, contactKind, contactValue, status
(open|claimed|expired), createdAt, expiresAt.

## Routes

- `GET /api/market?kind=` — open listings, newest first
- `POST /api/market` — create (identity-linked via ensureCitizen, 30-day expiry)
- `/market` — the feed (seed fallback)
- `/market/new` — the create form

## Next, only if asked

1. Mark sold / claimed (one button, seller-side).
2. Optional single photo per listing.
3. Surface seller's PageRank standing on the listing (identity → trust signal).
