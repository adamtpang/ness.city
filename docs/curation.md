# Judging member quality: a curation model for Ness

How do you judge the quality of a community member? This note synthesizes how
curated communities have answered that across four very different worlds:
pre-modern guilds, orders, and academies; modern exclusive clubs and gatekept
professions; online trust and reputation systems; and the social science of
trust and signaling. The striking finding is how few mechanisms there really
are. The same patterns recur across a thousand years and every medium.

## What every curated community converges on

1. **Vouching beats vetting, and the voucher must have skin in the game.** A
   trusted referral is the single strongest signal almost everywhere: the Royal
   Society's two-Fellow certificate, Soho House referrals, secret-society
   tapping, Lobsters' public invite tree, CouchSurfing's three-vouch chain, the
   open-source commit bit. It works because it is a costly, witnessed commitment
   that ties the voucher's own reputation to the outcome. Lobsters makes this
   explicit: the invite tree is visible and a bad sub-tree can be pruned. A vouch
   with no downside for the voucher is noise.

2. **Time is the honest filter.** Communities trust multi-year probation far more
   than any one-off test: the Benedictine novitiate, guild apprenticeship, the
   Pythagorean five years of silence, page to knight, tenure gates online,
   reputation earned slowly over many interactions. Endurance is hard to fake, so
   it is the most reliable signal. Earn trust slowly, lose it fast.

3. **Two gates: proof-of-merit and social acceptance.** Skill can be demonstrated
   (the guild masterpiece, an exam, accepted pull requests) but final entry
   almost always also requires existing members to accept you (a ballot, a
   committee, courtesy visits). Competence rarely suffices without belonging.

4. **Costly, hard-to-fake signals, or quality collapses.** Signaling theory
   (Zahavi, Spence) says a signal is trustworthy only when it is genuinely costly
   to fake and cheaper for high-quality members to produce. Akerlof's "market for
   lemons" is the warning: with no credible quality signal, the good people leave
   and the average rots. Online this is Sybil resistance: make identities
   expensive (a fee, an invite, proof of work).

5. **Graded, revocable status with graduated sanctions.** Almost everyone uses
   tiers (apprentice / journeyman / master, the degrees of an order, privileges
   that unlock with reputation) and keeps removal live. Ostrom's commons research
   says durable governance uses graduated sanctions (warning, then restriction,
   then removal), not arbitrary instant bans. Status is earned continuously, not
   granted once.

6. **The universal failure mode: "fit" collapses into homophily.** This is the
   one to fear most. Rivera's study of elite hiring shows "quality" quietly
   becomes "similar to the people judging." Black-balls, opaque committees, and
   soft "is this person interesting" scores are where documented bias and
   in-group cloning enter. Tajfel and McPherson show this bias is the default in
   any human group, not an accident.

7. **Scale: informal vouching caps near 150.** Dunbar's number says trust-based
   relationships top out around 150. Below that, informal vouching is enough.
   Above it (NS is already larger) you need a formal, history-based reputation
   system for strangers to trust each other.

8. **Algorithms plus humans beat either alone.** Pure algorithmic scores get
   gamed (karma farming, reciprocal rating rings, review bombing). Pure human
   committees get biased and captured. The durable online systems pair automated
   detectors with human moderation.

## What actually predicts a quality member

Adam's three axes map cleanly onto the three things communities have always
measured. The research also tells us the honest signal for each, and the trap.

| Axis (Adam's words) | What it really is | The honest signal | The trap |
| --- | --- | --- | --- |
| **Character** / integrity | Trustworthiness | Behavior over time, staked vouches, a clean record, did they deliver what they promised | Oaths and "fitness" tests drift into measuring conformity and discretion, not integrity |
| **Ability** / potential + kinetic | Competence | Demonstrated work: shipped fixes, funded bounties, accepted contributions (the verifiable "masterpiece") | Credentials and exams sort for who could pay or memorize, not who can do |
| **Energy** / vibes + fun | Contribution and fit | Showing up, giving, organizing, energizing others (contribution over consumption) | This is the soft score where homophily and bias enter most. Handle with the most care |

## The model for Ness

Judge member quality on the three signals, measured by costly and
time-revealed evidence, decided by vouching with real stakes, held as graded
revocable status, with explicit guards against capture.

1. **Gate: vouch with skin in the game.** Entry by invite or vouch from an
   existing member, with a visible invite tree, so the voucher's standing is tied
   to the people they bring in. Most proven mechanism in existence, and it fits
   the Dunbar-scale seed cohort.

2. **Probation: time plus a first contribution.** New members are provisional for
   a window and must produce one real contribution: file or help solve a problem,
   fund a bounty, organize something. The Ness "masterpiece" is your first
   shipped fix or funded bounty.

3. **Earned reputation from behavior, not opinion polls.** Do not let people
   simply star-rate each other (reciprocity and homophily poison that). Derive
   reputation from:
   - **Ability** from the engine: bounties solved, problems whose fixes shipped.
     Objective and verifiable, like a commit log.
   - **Character** from staked vouches plus reliability over time (did they do
     what they said).
   - **Energy** from participation: showing up, giving, helping others.
   Propagate it through the `/pagerank` trust graph: trust flows from a hand-picked
   high-quality seed set, with capped transitivity (the EigenTrust and Advogato
   insight that resists fake accounts).

4. **Graded, revocable status.** Tiers (invited, member, trusted) with privileges
   that unlock as reputation grows, and graduated sanctions when it falls. Status
   is never permanent.

5. **Anti-capture guards (the most important part).** Because the default failure
   is the in-group cloning itself:
   - Diversify who can vouch and judge. Do not let one clique own the gate.
   - Score behavior and contribution, not background or who someone resembles.
   - Break reciprocity: any peer rating uses blind or simultaneous reveal, and
     objective contribution outweighs popularity.
   - Keep bridging ties: deliberately admit some diversity, not only clones
     (Putnam's bonding vs bridging, Granovetter's weak ties).
   - Anchor trust to the seed set and cap how far it flows.

## Ness's unfair advantage

Almost every community in this research claims to measure merit but actually
measures sponsorship and conformity, because they have no objective way to see
ability. Ness does. The problem and bounty engine is a "masterpiece machine": it
shows what a person actually ships, verifiably, the way a guild saw the finished
work or open source sees the commit log. Lean on that. Let demonstrated
contribution carry real weight, because it is the one signal that is both hard to
fake and hard to bias. That is how Ness can curate for quality without becoming
just another room full of people who all look like the founder.

## Seeding the first 100 and growing without dilution

The hard part is not the gate, it is keeping quality as you grow. Research across
startup societies, elite organizations, and creative scenes converges on a few
hard truths.

- **Quality is a flow, not a stock.** A-players admit A-players; B-players admit
  C-players (the "bozo explosion"). Your bar is set by your *worst* admit, not
  your best, and one diluted tier compounds downward forever. Keep final say with
  the anchor.
- **The first ~100 are the culture, permanently** (organizational imprinting,
  Stinchcombe). You cannot reset it later, so over-index on character in the seed.
- **One toxic member costs about 5x a good one** (Sutton's No Asshole Rule). Bad
  people repel good people. Character is a hard gate, not a weighted nicety.
- **Growth rate is the killer, not size.** Communities die of "Eternal September":
  newcomers arriving faster than they can be acculturated. Throttle intake so the
  acculturated always outnumber the new.
- **Cap a single high-trust cell near Dunbar (~150).** Beyond that, split into
  cells; do not stretch one group thin.

The playbook (encoded in `lib/curation.ts`):

1. Hand-pick a tiny anchor (~12) for both talent and character. They imprint.
2. Grow the anchor to ~100 by two-key vetting: a core vouch (taste) AND community
   vouches (distributed trust). This is the "vetted by core and community" model.
3. Run a no-asshole gate: one disqualifying signal is an automatic no.
4. Engineer "scenius" (Brian Eno): applaud risk, share tools fast, credit wins to
   the whole scene, tolerate novelty. Quality is an ecology, not just a roster.
5. After the 100, throttle organic intake to a fraction of the acculturated base
   per cycle, in batches, never a firehose.
6. Expand cell by cell (the Facebook school-by-school move), each new cell seeded
   by proven members who carry the norms.
7. Make exit graceful and real. Selection out matters as much as selection in.

**What Flow gets wrong, and you get right.** Flow (Adam Neumann) is a landlord
betting that amenities and a concierge manufacture community top-down, with no
documented member vetting. The kibbutz that inspired it actually curated hard
(one-to-two-year probation, community ballot); Flow kept the aesthetic and dropped
the mechanism. The curation layer Flow is missing is the layer Ness is.

**Where this sits in interneta.world.** Interneta is the open protocol layer:
forkable, opt-in, opt-out, "no central curation authority." That is correct for
the federation. Curation lives one level down, in each society. Interneta is the
open ecosystem; Ness is one organism with a strong, selective membrane. Open
network, curated cells.

## Sources

- Pre-modern: [medieval guilds](https://brewminate.com/the-medieval-guild-apprentice-journeyman-and-master/), [the Benedictine novitiate](https://www.newadvent.org/cathen/11144a.htm), [imperial examinations](https://www.newworldencyclopedia.org/entry/Imperial_Examinations_(Keju)), [Royal Society election](https://royalsociety.org/fellows-directory/election/), [Freemason balloting](https://masonicfind.com/how-balloting-works-in-freemasonry), [blackballing](https://en.wikipedia.org/wiki/Blackballing).
- Modern: [Y Combinator interviews](https://www.ycombinator.com/interviews), [Soho House membership](https://candaceabroad.com/soho-house-membership/), [Harvard admissions](https://www.thecrimson.com/article/2018/6/16/harvard-admissions-behind-the-scenes/), [Yale society tap process](https://yaledailynews.com/blog/2024/02/28/behind-tomb-doors-yales-society-tap-process/), [Burning Man placement](https://burningman.org/event/participate/camps/placement-process/), [bar character and fitness](https://www.barbri.com/resources/understanding-the-character-and-fitness-process-for-us-bar-admission).
- Online: [Lobsters](https://lobste.rs/about), [MetaFilter](https://en.wikipedia.org/wiki/MetaFilter), [Stack Overflow reputation gaming](https://arxiv.org/html/2111.07101), [Wikipedia RfA](https://en.wikipedia.org/wiki/Wikipedia:Requests_for_adminship), [Airbnb two-sided reviews](https://andreyfradkin.com/assets/reviews_paper.pdf), [EigenTrust](https://nlp.stanford.edu/pubs/eigentrust.pdf), [Advogato trust metric](https://levien.com/thesis/thesis.pdf), [Sybil attack](https://en.wikipedia.org/wiki/Sybil_attack).
- Theory: [costly signaling / handicap principle](https://en.wikipedia.org/wiki/Handicap_principle), [Spence job-market signaling](https://www.sfu.ca/~allen/Spence.pdf), [Akerlof, market for lemons](https://en.wikipedia.org/wiki/The_Market_for_Lemons), [Aronson and Mills, severity of initiation](https://web.mit.edu/curhan/www/docs/Articles/15341_Readings/Motivation/Aronson_Mills_1959_The_effect_of_severity_of_initiation.pdf), [Granovetter, weak ties](https://www.cs.cmu.edu/~jure/pub/papers/granovetter73ties.pdf), [Nowak and Sigmund, indirect reciprocity](https://www.nature.com/articles/31225), [Ostrom's design principles](https://earthbound.report/2018/01/15/elinor-ostroms-8-rules-for-managing-the-commons/), [Dunbar's number](https://en.wikipedia.org/wiki/Dunbar%27s_number), [Rivera, Pedigree](https://press.princeton.edu/books/hardcover/9780691155623/pedigree), [Putnam, social capital](http://bowlingalone.com/?page_id=13).
