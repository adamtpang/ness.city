"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";

type Connection = {
  id: string;
  name: string;
  round: number;
  addedAt: number;
};

const ROUNDS: { round: number; count: number; label: string; prompt: string }[] = [
  {
    round: 1,
    count: 1,
    label: "Closest",
    prompt: "Name the one person you'd take a bullet for at NS.",
  },
  {
    round: 2,
    count: 2,
    label: "Inner ring",
    prompt: "Now two more. People who know what's going on with you.",
  },
  {
    round: 3,
    count: 4,
    label: "Close",
    prompt: "Four more. The people whose week affects yours.",
  },
  {
    round: 4,
    count: 8,
    label: "Regular",
    prompt: "Eight more. The faces you actually look for at events.",
  },
  {
    round: 5,
    count: 16,
    label: "Network",
    prompt: "Sixteen more. People you'd grab coffee with on purpose.",
  },
  {
    round: 6,
    count: 32,
    label: "Acquainted",
    prompt: "Thirty-two more. People you'd recognize, name, and remember.",
  },
];

const STORAGE_KEY = "ness.pagerank.v1";

// Mock leaderboard. Replaces with real data once backend is wired.
const STUB_LEADERBOARD = [
  { id: "u_priya", name: "Priya Krishnan", handle: "priya.k", named: 23 },
  { id: "u_marcus", name: "Marcus Lee", handle: "marcus", named: 19 },
  { id: "u_aisha", name: "Aisha Bello", handle: "aisha", named: 17 },
  { id: "u_balaji", name: "Balaji S.", handle: "balaji", named: 15 },
  { id: "u_jonas", name: "Jonas Weber", handle: "jonas", named: 12 },
  { id: "u_naomi", name: "Naomi Park", handle: "naomi", named: 11 },
  { id: "u_emiko", name: "Emiko Tanaka", handle: "emiko", named: 9 },
  { id: "u_devraj", name: "Devraj Iyer", handle: "devraj", named: 7 },
];

export default function PageRankPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [draft, setDraft] = useState("");
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Connection[];
        if (Array.isArray(parsed)) setConnections(parsed);
      }
    } catch {
      /* noop */
    }
    setHydrated(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(connections));
    } catch {
      /* noop */
    }
  }, [connections, hydrated]);

  const byRound = useMemo(() => {
    const map = new Map<number, Connection[]>();
    for (const c of connections) {
      const arr = map.get(c.round) ?? [];
      arr.push(c);
      map.set(c.round, arr);
    }
    return map;
  }, [connections]);

  // Determine the current round (first round that isn't full)
  const currentRound = useMemo(() => {
    for (const r of ROUNDS) {
      const have = byRound.get(r.round)?.length ?? 0;
      if (have < r.count) return r;
    }
    return null; // all done
  }, [byRound]);

  const totalAdded = connections.length;
  const totalGoal = ROUNDS.reduce((s, r) => s + r.count, 0);

  function addConnection() {
    const name = draft.trim();
    if (!name || !currentRound) return;
    setConnections((prev) => [
      ...prev,
      {
        id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name,
        round: currentRound.round,
        addedAt: Date.now(),
      },
    ]);
    setDraft("");
  }

  function removeConnection(id: string) {
    setConnections((prev) => prev.filter((c) => c.id !== id));
  }

  function reset() {
    if (typeof window !== "undefined" && !window.confirm("Clear your ring and start over?")) return;
    setConnections([]);
  }

  return (
    <main className="mx-auto max-w-5xl px-5 pb-20 pt-12">
      {/* Header */}
      <FadeIn>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
          PageRank
        </p>
        <h1 className="serif mt-2 text-[44px] leading-[1.05] text-ink-950 sm:text-[60px]">
          Map your ring.
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-[1.6] text-ink-600">
          Name the people closest to you at NS in doubling rings. One. Two
          more. Four more. Eight more. Sixteen more. Thirty-two more. Each
          ring is half your last one in importance and twice the size. Stays
          on your device until backend is live.
        </p>
      </FadeIn>

      {/* Round tracker pills */}
      <FadeIn delay={0.06}>
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {ROUNDS.map((r) => {
            const have = byRound.get(r.round)?.length ?? 0;
            const done = have >= r.count;
            const active = currentRound?.round === r.round;
            return (
              <div
                key={r.round}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] transition-colors ${
                  done
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-900"
                    : active
                      ? "border border-ink-950 bg-ink-950 text-paper"
                      : "border border-ink-200 bg-paper text-ink-500"
                }`}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.1em]">
                  R{r.round}
                </span>
                <span className="font-medium">{r.label}</span>
                <span className="font-mono text-[11px] tabular-nums opacity-80">
                  {have}/{r.count}
                </span>
              </div>
            );
          })}
        </div>
      </FadeIn>

      {/* Two-column: form + viz */}
      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_minmax(0,520px)]">
        {/* Left: current round form */}
        <FadeIn delay={0.1}>
          <div className="rounded-2xl border border-ink-200 bg-paper p-6">
            {currentRound ? (
              <>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                  Round {currentRound.round} · {currentRound.label}
                </p>
                <h2 className="serif mt-2 text-[24px] leading-tight text-ink-950">
                  {currentRound.prompt}
                </h2>
                <p className="mt-2 text-[12.5px] text-ink-500">
                  {(byRound.get(currentRound.round)?.length ?? 0)} of{" "}
                  {currentRound.count} added in this ring.
                </p>

                <div className="mt-5 flex gap-2">
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addConnection();
                    }}
                    placeholder="Name or handle"
                    autoFocus
                    className="flex-1 rounded-xl border border-ink-200 bg-paper px-4 py-2.5 text-[14px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none"
                  />
                  <button
                    onClick={addConnection}
                    disabled={!draft.trim()}
                    className="inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800 disabled:opacity-40 disabled:hover:bg-ink-950"
                  >
                    Add
                    <span aria-hidden>↵</span>
                  </button>
                </div>
              </>
            ) : (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-700">
                  All rings complete
                </p>
                <h2 className="serif mt-2 text-[24px] leading-tight text-ink-950">
                  Sixty-three names. That&apos;s the city you live in.
                </h2>
                <p className="mt-3 text-[14px] leading-[1.6] text-ink-600">
                  When PageRank goes live with the backend, your ring becomes
                  the seed for a community-wide social graph. The most-named
                  citizens rise. The connectors get visible. The quiet ones
                  too.
                </p>
                <button
                  onClick={reset}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-3 py-1.5 text-[12px] text-ink-700 transition-colors hover:border-ink-950 hover:text-ink-950"
                >
                  Start over
                </button>
              </div>
            )}

            {/* List of names per round */}
            {totalAdded > 0 && (
              <div className="mt-7 border-t border-ink-100 pt-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                    Your ring · {totalAdded} of {totalGoal}
                  </p>
                  <button
                    onClick={reset}
                    className="text-[11px] text-ink-400 transition-colors hover:text-ink-950"
                  >
                    reset
                  </button>
                </div>
                <div className="space-y-3">
                  {ROUNDS.filter((r) => (byRound.get(r.round)?.length ?? 0) > 0).map(
                    (r) => (
                      <div key={r.round}>
                        <div className="mb-1.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-500">
                          <span>R{r.round}</span>
                          <span>·</span>
                          <span>{r.label}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <AnimatePresence>
                            {byRound.get(r.round)!.map((c) => (
                              <motion.span
                                key={c.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.18 }}
                                className="group inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-paper-tint px-2.5 py-1 text-[12px] text-ink-800"
                              >
                                {c.name}
                                <button
                                  onClick={() => removeConnection(c.id)}
                                  aria-label={`Remove ${c.name}`}
                                  className="text-ink-400 transition-colors group-hover:text-ink-950"
                                >
                                  ×
                                </button>
                              </motion.span>
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        </FadeIn>

        {/* Right: ring visualization */}
        <FadeIn delay={0.16}>
          <div className="rounded-2xl border border-ink-200 bg-paper p-5 sm:p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
              Your ring, drawn
            </p>
            <RingViz connections={connections} />
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10.5px] text-ink-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-ink-950" />
                you
              </span>
              {ROUNDS.map((r) => {
                const have = byRound.get(r.round)?.length ?? 0;
                const opacity = 1 - (r.round - 1) * 0.13;
                return (
                  <span key={r.round} className="inline-flex items-center gap-1.5">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-ink-950"
                      style={{ opacity }}
                    />
                    R{r.round} ({have}/{r.count})
                  </span>
                );
              })}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Stub leaderboard */}
      <FadeInOnView>
        <div className="mt-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
            Most-named citizens · the Facemash analog
          </p>
          <h2 className="serif mt-2 text-[28px] leading-tight text-ink-950">
            Who the city named.
          </h2>
          <p className="mt-2 max-w-xl text-[14px] leading-[1.6] text-ink-600">
            Once enough citizens map their rings, PageRank ranks who the
            community has named most, weighted by who named them. Below is a
            preview of the format with stub data. Real numbers go live once
            the backend ships.
          </p>
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-6 overflow-hidden rounded-2xl border border-ink-200 opacity-90">
          <div className="grid grid-cols-12 gap-4 border-b border-ink-200 bg-paper-tint px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            <div className="col-span-1">#</div>
            <div className="col-span-7">Citizen</div>
            <div className="col-span-4 text-right">Times named</div>
          </div>
          {STUB_LEADERBOARD.map((c, idx) => {
            const pct = (c.named / STUB_LEADERBOARD[0].named) * 100;
            return (
              <div
                key={c.id}
                className="grid grid-cols-12 gap-4 border-b border-ink-100 bg-paper px-5 py-3 last:border-0"
              >
                <div className="col-span-1 flex items-center font-mono text-[12px] tabular-nums text-ink-400">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <div className="col-span-7 flex items-center gap-3">
                  <div className="text-[14px] font-medium text-ink-950">
                    {c.name}
                  </div>
                  <div className="font-mono text-[11px] text-ink-500">
                    @{c.handle}
                  </div>
                </div>
                <div className="col-span-4 flex items-center justify-end gap-3">
                  <div className="hidden max-w-[140px] flex-1 sm:block">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                      <div
                        className="h-full rounded-full bg-ink-950"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <div className="min-w-[40px] text-right font-mono text-[13px] tabular-nums text-ink-950">
                    {c.named}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-ink-400">
          Stub data. Real PageRank computes once enough citizens have mapped
          their rings.
        </p>
      </FadeInOnView>

      {/* Algorithm deep-dive */}
      <FadeInOnView>
        <div className="mt-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
            How the math works
          </p>
          <h2 className="serif mt-2 text-[34px] leading-tight text-ink-950">
            PageRank in one paragraph.
          </h2>
          <p className="mt-3 max-w-2xl text-[15.5px] leading-[1.7] text-ink-700">
            Brin and Page, two Stanford grad students, wrote PageRank in 1996
            to rank web pages by importance. Their insight: a page is
            important not because it links to many things, but because
            <em> many important things link to it.</em> The same trick works
            on any directed graph, including a graph of who-named-whom in a
            small city.
          </p>
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-8 overflow-hidden rounded-2xl border border-ink-200 bg-paper">
          <div className="border-b border-ink-100 bg-paper-tint px-5 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
              The formula
            </p>
          </div>
          <div className="px-5 py-6 sm:px-7">
            <pre className="overflow-x-auto rounded-xl bg-ink-950 p-5 font-mono text-[13px] leading-[1.7] text-paper">
{`PR(p) = (1 - d) / N
      + d × Σ ( PR(q) / L(q) )   for every q that names p`}
            </pre>
            <ul className="mt-5 space-y-2.5 text-[14px] leading-[1.65] text-ink-700">
              <li>
                <span className="font-mono text-[12px] text-ink-950">PR(p)</span>{" "}
                is the rank of person <em>p</em>.
              </li>
              <li>
                <span className="font-mono text-[12px] text-ink-950">N</span> is
                the total number of citizens.
              </li>
              <li>
                <span className="font-mono text-[12px] text-ink-950">L(q)</span>{" "}
                is the number of names <em>q</em> wrote in their ring (so each
                vote is split across the names q spent it on).
              </li>
              <li>
                <span className="font-mono text-[12px] text-ink-950">d</span>{" "}
                is the damping factor, classically{" "}
                <span className="font-mono text-[12px] text-ink-950">0.85</span>.
                It says: 85% of importance flows through who-named-whom; 15%
                of it diffuses uniformly to everyone (the &ldquo;random
                surfer&rdquo; or &ldquo;random citizen you might bump into&rdquo;).
              </li>
              <li>
                We iterate the formula until ranks stop changing. About 30 to
                50 passes over the graph is enough to converge for a city of
                a few hundred citizens.
              </li>
            </ul>
          </div>
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-10 overflow-hidden rounded-2xl border border-ink-200 bg-paper">
          <div className="border-b border-ink-100 bg-paper-tint px-5 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
              How the crawl runs · step by step
            </p>
          </div>
          <ol className="px-5 py-6 sm:px-7 space-y-5 text-[14.5px] leading-[1.7] text-ink-700">
            <li>
              <p>
                <span className="font-mono text-[12px] text-ink-950">1.</span>{" "}
                <strong>Collect rings.</strong> Each citizen submits up to 63
                names across rounds 1 to 6. Each name becomes a directed edge
                from them to the named citizen, weighted by which round it
                appeared in (R1 = 6, R2 = 5, R3 = 4, R4 = 3, R5 = 2, R6 = 1).
                Stored in the{" "}
                <span className="font-mono text-[12px] text-ink-950">
                  pagerank_rings
                </span>{" "}
                table.
              </p>
            </li>
            <li>
              <p>
                <span className="font-mono text-[12px] text-ink-950">2.</span>{" "}
                <strong>Resolve handles to citizens.</strong> A name like
                &ldquo;priya.k&rdquo; resolves to a real citizen record if one
                exists. Unmatched names stay as ghost nodes with no outgoing
                edges (they receive but don&apos;t pass on rank). This avoids
                inflating rank for handles nobody recognizes.
              </p>
            </li>
            <li>
              <p>
                <span className="font-mono text-[12px] text-ink-950">3.</span>{" "}
                <strong>Initialize ranks.</strong> Every node gets rank{" "}
                <span className="font-mono text-[12px] text-ink-950">1/N</span>
                . With 100 citizens, every starting rank is 0.01. Rank is a
                probability: the chance that a random walker through the graph
                lands on this node.
              </p>
            </li>
            <li>
              <p>
                <span className="font-mono text-[12px] text-ink-950">4.</span>{" "}
                <strong>Iterate.</strong> One pass: every node passes its
                current rank to the people it named, in proportion to the
                weight of those names. Then we add the damping correction
                (1&minus;d)/N to every node. Then we normalize so all ranks
                sum back to 1. Repeat for 30 to 50 passes.
              </p>
            </li>
            <li>
              <p>
                <span className="font-mono text-[12px] text-ink-950">5.</span>{" "}
                <strong>Watch convergence.</strong> Each pass, the ranks
                shift less than the one before. We stop when the largest
                rank change in a pass is below epsilon (e.g. 0.0001). At
                that point the ranking is stable: it&apos;s a property of
                the graph, not of where we started.
              </p>
            </li>
            <li>
              <p>
                <span className="font-mono text-[12px] text-ink-950">6.</span>{" "}
                <strong>Publish.</strong> The ranked list is the leaderboard.
                Connectors rise, bridges rise, the quiet ones who got named
                by the right people rise. Ranks update nightly as new rings
                come in.
              </p>
            </li>
          </ol>
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-6 rounded-2xl border border-ink-200 bg-paper-tint p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            What &ldquo;rings to compute&rdquo; means
          </p>
          <h3 className="serif mt-2 text-[20px] leading-tight text-ink-950">
            We need a graph before we can rank it.
          </h3>
          <p className="mt-2 text-[14.5px] leading-[1.7] text-ink-700">
            A single citizen&apos;s ring is a star: one center, up to 63
            outbound edges. Star graphs aren&apos;t interesting; PageRank on a
            star is trivial. The signal kicks in when many stars overlap and
            you can chase importance through the graph: A names B, B names C,
            so C inherits a fraction of A&apos;s rank through B. Below
            ~5 citizens with full rings, the ranks just track raw inbound
            mention count. Above 20 to 30, real PageRank dynamics emerge.
            The leaderboard automatically switches from &ldquo;weighted
            mentions&rdquo; to &ldquo;true PageRank&rdquo; once that
            threshold passes.
          </p>
          <p className="mt-3 text-[14.5px] leading-[1.7] text-ink-700">
            For NS specifically: a single Forest City cohort is ~100 people.
            If 30 submit rings, you have a tractable graph. If 60 submit, the
            ranking starts looking like Pals on intent steroids. If everyone
            submits, you have something genuinely new: a quantitative
            self-portrait of the social fabric, refreshed weekly.
          </p>
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <Card title="How we adapt it for Ness">
            <p>
              We treat each ring as an edge with weight. Round 1 names count
              for 6, Round 2 for 5, &hellip; Round 6 for 1. Closer ties get
              more importance flow than acquaintance ties. We also reward
              <em> reciprocity</em>: if A names B and B names A, the edge
              counts double. Convergence runs nightly once the backend is
              live.
            </p>
          </Card>
          <Card title="Why doubling rings">
            <p>
              Human social structure layers in roughly doubling sizes
              (Dunbar). Asking for one name first removes friction. Each
              ring after that asks for half the trust depth and twice the
              breadth. By round six, you&apos;ve mapped 63 names: the
              relationships that matter.
            </p>
          </Card>
          <Card title="What the leaderboard surfaces">
            <p>
              <strong>Connectors:</strong> high PageRank, named by a wide
              cross-section of citizens.{" "}
              <strong>Bridges:</strong> high betweenness centrality, the
              people who join otherwise-disconnected clusters.{" "}
              <strong>Quiet ones:</strong> named by very few citizens despite
              showing up every day. Ness highlights all three, with permission.
            </p>
          </Card>
          <Card title="Privacy stance">
            <p>
              Your ring stays on your device until you opt into the social
              graph. Once opted in, only the aggregate score is published.
              Nobody sees your individual list. Citizens you named never see
              that you named them specifically.
            </p>
          </Card>
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-10 rounded-2xl border border-garden-200 bg-garden-50/60 p-6 sm:p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-garden-700">
            Coming next · Tournament input
          </p>
          <h3 className="serif mt-2 text-[24px] leading-tight text-ink-950">
            One click at a time. No typing.
          </h3>
          <p className="mt-3 text-[14.5px] leading-[1.7] text-ink-700">
            Naming 63 people from memory is hard. Recognising someone when
            you see their face is easy. The next iteration of PageRank input
            is a <strong>tournament</strong>: we show you two citizens at a
            time and ask &ldquo;who do you know better?&rdquo; You click. We
            update Elo-style closeness ratings and surface the next pair.
            About 30 rounds gets us a stable ranked list per citizen,
            which becomes the weighted edges into the PageRank graph.
          </p>
          <p className="mt-3 text-[14.5px] leading-[1.7] text-ink-700">
            The input pool is bootstrapped from the host community
            directory. So the very first time you open Tournament, the
            faces are already people you might know. Cold start solved by
            the same trick Zuck pulled at Harvard: pre-populate the
            graph, let the network effect do the rest.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-garden-300 bg-paper px-3 py-1 font-mono text-[11px] text-garden-800">
            <span className="h-1.5 w-1.5 rounded-full bg-garden-500" />
            Lands in v0.12. The schema already has the rings table.
          </div>
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-10 rounded-2xl border border-nessie-200 bg-nessie-50/60 p-6 sm:p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-nessie-700">
            Compared to ns.com/pals
          </p>
          <h3 className="serif mt-2 text-[24px] leading-tight text-ink-950">
            Pals connects. PageRank ranks.
          </h3>
          <p className="mt-2 text-[14.5px] leading-[1.7] text-ink-700">
            <a
              href="https://ns.com/pals"
              target="_blank"
              rel="noopener noreferrer"
              className="text-nessie-700 underline-offset-4 hover:underline"
            >
              ns.com/pals
            </a>{" "}
            is a Network School feature for finding and connecting to other
            members. It surfaces who you might want to meet. PageRank works
            on a different layer: it takes the connections people make and
            quantifies who matters across the whole graph. Pals is
            recommendation. PageRank is rank. They&apos;re complementary.
            Pals helps a citizen, PageRank tells the city about itself.
          </p>
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-10 rounded-2xl border border-ink-200 bg-paper p-6 sm:p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            The Facemash echo
          </p>
          <h3 className="serif mt-2 text-[22px] leading-tight text-ink-950">
            Same data appetite. Different ranking criterion.
          </h3>
          <p className="mt-2 text-[14.5px] leading-[1.7] text-ink-700">
            Zuckerberg&apos;s Facemash at Harvard ranked classmates by
            hot-or-not. The data was the same shape: who is paying attention
            to whom. PageRank inverts that energy. Instead of vanity, trust.
            Instead of ratings by strangers, naming by friends. Instead of a
            leaderboard that humiliates, one that surfaces the connectors
            who quietly hold the city together.
          </p>
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/citizens"
            className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800"
          >
            See the karma + patron leaderboards
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-5 py-3 text-[14px] font-medium text-ink-950 transition-colors hover:border-ink-950"
          >
            How Ness works
          </Link>
        </div>
      </FadeInOnView>
    </main>
  );
}

function RingViz({ connections }: { connections: Connection[] }) {
  // Concentric ring layout
  const SIZE = 460;
  const CENTER = SIZE / 2;
  const RING_BASE_R = 38;
  const RING_STEP = 32;

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="mx-auto mt-3 block h-auto w-full max-w-[460px]"
      aria-label="Concentric ring visualization of your closest connections"
    >
      {/* Concentric guide circles */}
      {ROUNDS.map((r) => {
        const radius = RING_BASE_R + r.round * RING_STEP;
        return (
          <circle
            key={`g-${r.round}`}
            cx={CENTER}
            cy={CENTER}
            r={radius}
            fill="none"
            stroke="#e5e5e5"
            strokeDasharray="2 4"
            strokeWidth={1}
          />
        );
      })}

      {/* Connection dots */}
      {ROUNDS.map((r) => {
        const ringConnections = connections.filter((c) => c.round === r.round);
        const radius = RING_BASE_R + r.round * RING_STEP;
        const opacity = 1 - (r.round - 1) * 0.11;
        const phase = (r.round * Math.PI) / 9; // small rotation per ring for visual variety
        return ringConnections.map((c, i) => {
          const angle = (i / r.count) * Math.PI * 2 + phase - Math.PI / 2;
          const x = CENTER + Math.cos(angle) * radius;
          const y = CENTER + Math.sin(angle) * radius;
          const initials = c.name
            .split(/\s+/)
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
          return (
            <g key={c.id}>
              <motion.circle
                initial={{ r: 0, opacity: 0 }}
                animate={{ r: 12, opacity }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                cx={x}
                cy={y}
                fill="#0a0a0a"
              />
              <motion.text
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.25 }}
                x={x}
                y={y + 3.5}
                textAnchor="middle"
                fontSize="9"
                fontFamily="ui-monospace, SFMono-Regular, monospace"
                fill="#ffffff"
              >
                {initials}
              </motion.text>
            </g>
          );
        });
      })}

      {/* Center: you */}
      <circle cx={CENTER} cy={CENTER} r={18} fill="#0a0a0a" />
      <text
        x={CENTER}
        y={CENTER + 3.5}
        textAnchor="middle"
        fontSize="10"
        fontFamily="ui-monospace, SFMono-Regular, monospace"
        fill="#ffffff"
      >
        YOU
      </text>
    </svg>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-paper p-5">
      <h3 className="serif text-[18px] leading-tight text-ink-950">{title}</h3>
      <div className="mt-2 text-[13.5px] leading-[1.65] text-ink-700">
        {children}
      </div>
    </div>
  );
}
