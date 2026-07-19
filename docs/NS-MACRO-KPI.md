# NS Macro KPI — "GDP maxxing" (SHELVED)

**Status: shelved / backlog.** Captured for later; do not build ahead of the
member rating index MVP. This is the macro-metrics track: measure Network
School as a growing network state over time.

## The idea

`nskpi.com`'s spirit already lives at **`/kpi`** (a V0 with stubbed civic
pillars — citizens, problems, bounties, karma, market, jobs, tools). This
shelves the **macro** layer on top: the vital signs of NS *as a place and an
economy*, tracked over time, tied to NS's actual goals. `/roadmap` already
lists this gap ("public KPI dashboard tied to NS's actual goals — population,
GDP, real estate"), and there's a "Cohort GDP estimator" tool concept in
`/tools`.

## The four macro pillars (time series)

1. **Population over time** — headcount on campus, cumulative members ever,
   cohort sizes per intake, on-campus vs off-campus, longterm vs shortterm.
   Source seed: `directory_profiles` (roster) + arrival/departure dates
   (need a `joined_at` / `left_at` — not captured yet).
2. **Man-months at NS** — Σ (months each member was physically present). The
   single number for "how much high-agency human life-time has flowed through
   NS." Needs presence intervals per member; `raters.tenure_months` and a
   future `directory_profiles.cohort` / arrival dates are the seeds.
3. **GDP** — economic output of the community: member/company revenue,
   fundraising raised, bounties settled, salaries. Start with self-reported +
   the Cohort GDP estimator; refine with opt-in verified figures. This is the
   "GDP maxx" north star.
4. **Real estate footprint** — units/sqm occupied in Forest City over time,
   occupancy %, expansion curve. Manual/admin-entered snapshots to start.

## "How do we GDP maxx" — strategic framing

The dashboard isn't just measurement, it's a forcing function. Levers to grow
member GDP, each of which the dashboard should make legible and celebrate:

- **Select for output** — the member rating index (this repo's live feature)
  surfaces who ships; promotion into longterm membership compounds GDP/head.
- **Make revenue visible** — a leaderboard of shipped revenue / raises (opt-in)
  turns GDP into a status game people play.
- **Density × time** — man-months is the input; GDP per man-month is the
  efficiency metric to maximize. Track both.
- **Retain the high-output tail** — measure churn of top-GDP members; a
  departure is a GDP leak.
- **Comps** — benchmark GDP/head and GDP/man-month against other communities
  to create competitive pressure.

## Shape when built

- A `ns_metrics` time-series table: `{ metric, value, unit, as_of, source, note }`,
  snapshotted periodically (cron / admin entry), so every pillar is a curve,
  not a point.
- Render on `/kpi` as a "Network State" section above the civic pillars:
  four big curves (population, man-months, GDP, real-estate) + GDP/man-month.
- Most inputs are admin/self-reported at first (honest V0, clearly labeled as
  estimates, exactly like the current `/kpi` stub convention). Automate as
  data sources appear.

## Why shelved

Ship and validate the member rating index (the viral, tester-facing loop)
first. This macro-KPI track is parallel and lower-urgency; it needs data
plumbing (arrival dates, revenue capture) that doesn't exist yet. Revisit once
the rating index has traction and the roster carries arrival/cohort dates.
