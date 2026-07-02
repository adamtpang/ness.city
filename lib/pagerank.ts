/**
 * PageRank: the social-analysis engine.
 *
 * This is the missing keystone. Rings and vouches were being collected, but the
 * algorithm that turns a graph of who-named-whom (or who-vouches-whom) into a
 * ranking was never actually run. This is it: a real, iterative PageRank
 * (Brin and Page, 1998), pure and dependency-free.
 *
 * It powers two things:
 *  - /pagerank, importance: a node is important when important nodes point to it.
 *  - curation, trust: run with `seeds` (a personalization vector over your
 *    trusted core) and the same math becomes seeded trust propagation, which is
 *    exactly what lib/curation.ts wants for its character axis. One engine, two
 *    uses: uniform teleport ranks importance; seeded teleport ranks trust.
 */

export type PageRankEdge = {
  /** Source node (the one who named / vouched). */
  from: string;
  /** Target node (the one named / vouched for). */
  to: string;
  /** Edge weight (e.g. ring-round weight). Defaults to 1. */
  weight?: number;
};

export type PageRankOptions = {
  /** Share of rank that flows along edges. Classic value 0.85. */
  damping?: number;
  /** Max power-iteration passes. */
  maxIterations?: number;
  /** Stop when total rank change in a pass drops below this. */
  tolerance?: number;
  /**
   * Personalization: restart distribution. With no seeds, teleport is uniform
   * (pure importance). With seeds, teleport concentrates on the trusted core,
   * so rank becomes "trust reachable from the seed" (used by curation).
   */
  seeds?: string[];
};

export type RankedNode = { node: string; score: number };

/**
 * Compute PageRank over a directed, weighted graph. Returns every node with its
 * score (the scores sum to ~1), sorted highest first. Handles dangling nodes
 * (no out-edges) by redistributing their mass via the teleport vector, and
 * unknown/ghost nodes (named but never naming) by giving them no out-flow.
 */
export function pagerank(edges: PageRankEdge[], opts: PageRankOptions = {}): RankedNode[] {
  const damping = opts.damping ?? 0.85;
  const maxIter = opts.maxIterations ?? 100;
  const tol = opts.tolerance ?? 1e-9;

  const nodes = new Set<string>();
  for (const e of edges) {
    nodes.add(e.from);
    nodes.add(e.to);
  }
  const ids = [...nodes];
  const N = ids.length;
  if (N === 0) return [];

  // Out-weight totals and inbound adjacency.
  const outWeight: Record<string, number> = {};
  const inbound: Record<string, { from: string; weight: number }[]> = {};
  for (const n of ids) {
    outWeight[n] = 0;
    inbound[n] = [];
  }
  for (const e of edges) {
    const w = e.weight ?? 1;
    if (w <= 0) continue;
    outWeight[e.from] += w;
    inbound[e.to].push({ from: e.from, weight: w });
  }

  // Teleport (restart) distribution: uniform, or concentrated on seeds.
  const seeds = (opts.seeds ?? []).filter((s) => nodes.has(s));
  const teleport: Record<string, number> = {};
  if (seeds.length > 0) {
    for (const n of ids) teleport[n] = 0;
    for (const s of seeds) teleport[s] += 1 / seeds.length;
  } else {
    for (const n of ids) teleport[n] = 1 / N;
  }

  let rank: Record<string, number> = {};
  for (const n of ids) rank[n] = teleport[n];

  for (let iter = 0; iter < maxIter; iter++) {
    // Mass sitting on dangling nodes redistributes via teleport each pass.
    let dangling = 0;
    for (const n of ids) if (outWeight[n] === 0) dangling += rank[n];

    const next: Record<string, number> = {};
    for (const n of ids) {
      let incoming = 0;
      for (const { from, weight } of inbound[n]) {
        incoming += (rank[from] * weight) / outWeight[from];
      }
      next[n] = (1 - damping) * teleport[n] + damping * (incoming + dangling * teleport[n]);
    }

    let delta = 0;
    for (const n of ids) delta += Math.abs(next[n] - rank[n]);
    rank = next;
    if (delta < tol) break;
  }

  return ids.map((n) => ({ node: n, score: rank[n] })).sort((a, b) => b.score - a.score);
}
