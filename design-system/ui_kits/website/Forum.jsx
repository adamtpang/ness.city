/* Ness UI kit — Forum (Townhall): problems, bounty progress, filter. */
const { useState: useStateForum } = React;

function StatusBadge({ status }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-700)" }}>
      <Dot color={SIGNAL[status]} />{SIGNAL_LABEL[status]}
    </span>
  );
}

function ProblemCard({ p, onOpen }) {
  const pct = p.bounty && p.bounty.goal ? Math.min(100, (p.bounty.total / p.bounty.goal) * 100) : 0;
  return (
    <a className="pcard" href="#" onClick={(e) => { e.preventDefault(); onOpen(p); }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span className="mono" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--ink-500)" }}>{p.category}</span>
            <span className="sep">·</span><StatusBadge status={p.status} />
          </div>
          <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: 22, lineHeight: 1.15, margin: 0 }}>{p.title}</h3>
          <p style={{ marginTop: 10, fontSize: 14, lineHeight: 1.55, color: "var(--ink-600)" }}>{p.summary}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <div className="mono" style={{ fontSize: 24, color: "var(--ink-950)" }}>{p.upvotes}</div>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--ink-400)" }}>signal</div>
        </div>
      </div>

      {p.bounty && (
        <div className="bounty">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="lbl-sm">Bounty</span>
            <span className="mono" style={{ fontSize: 12, color: "var(--ink-700)" }}>${p.bounty.total} / ${p.bounty.goal}</span>
          </div>
          <div className="bar"><span style={{ width: pct + "%", background: p.bounty.state === "paid" ? "var(--garden-600)" : "var(--ink-950)" }} /></div>
          <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-500)" }}>
            <span>{p.bounty.patrons} {p.bounty.patrons === 1 ? "patron" : "patrons"}</span>
            <span style={{ textTransform: "capitalize" }}>{p.bounty.state}</span>
          </div>
        </div>
      )}

      <div style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--ink-200)", paddingTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--ink-500)" }}>
          <Avatar initials={p.reporter.initials} seed={p.reporter.handle} size={20} />
          <span><span style={{ color: "var(--ink-700)" }}>@{p.reporter.handle}</span><span className="sep"> · </span>{p.affected} affected</span>
        </div>
        <span style={{ fontSize: 12, color: p.proposals ? "var(--ink-700)" : "var(--ink-400)" }}>
          {p.proposals ? `${p.proposals} ${p.proposals === 1 ? "proposal" : "proposals"}` : "no proposals yet"}
        </span>
      </div>
    </a>
  );
}

function Forum({ go }) {
  const [filter, setFilter] = useStateForum("all");
  const [open, setOpen] = useStateForum(null);

  const match = (p) => filter === "all" ? true : filter === "open" ? p.status === "open" : p.status === filter;
  const counts = {
    all: PROBLEMS.length,
    open: PROBLEMS.filter((p) => p.status === "open").length,
    "in-progress": PROBLEMS.filter((p) => p.status === "in-progress").length,
    solved: PROBLEMS.filter((p) => p.status === "solved").length,
  };
  const filtered = PROBLEMS.filter(match);

  return (
    <main className="container container-narrow" style={{ paddingBottom: 80 }}>
      <FadeIn><a className="backlink" href="#" onClick={(e) => { e.preventDefault(); go("home"); }} style={{ marginTop: 28, display: "inline-flex" }}><span aria-hidden>←</span> back to the city</a></FadeIn>
      <FadeIn delay={0.05}>
        <div style={{ marginTop: 28 }}>
          <p className="lbl">The Forum · Townhall</p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, letterSpacing: "-0.022em", fontSize: 56, lineHeight: 1.05, margin: "8px 0 0" }}>Problems become fixes.</h1>
          <p style={{ marginTop: 12, maxWidth: 560, fontSize: 16, lineHeight: 1.55, color: "var(--ink-600)" }}>
            Surface a community problem. Someone proposes a fix. Patrons pledge USDC. The solver ships, documents, and gets paid.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Stat k="Open" v={counts.open} />
          <Stat k="In progress" v={counts["in-progress"]} />
          <Stat k="Solved" v={counts.solved} />
          <Stat k="Pledged" v="$0" />
        </div>
      </FadeIn>

      <div className="filterstrip">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {FORUM_FILTERS.map((f) => {
            const on = filter === f.id;
            return (
              <button key={f.id} className={"pill" + (on ? " active" : "")} onClick={() => setFilter(f.id)}>
                {on && <span className="pillbg" />}
                <span className="pilltxt">{f.label} <span className={"cnt " + (on ? "cnt-on" : "cnt-off")}>{counts[f.id] || 0}</span></span>
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card card-dashed" style={{ marginTop: 24, textAlign: "center", padding: 48 }}>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: 26, lineHeight: 1.1, margin: 0 }}>
            {filter === "all" ? "No problems surfaced yet." : "Nothing in this filter."}
          </p>
          <p style={{ margin: "8px auto 0", maxWidth: 380, fontSize: 13.5, lineHeight: 1.6, color: "var(--ink-500)" }}>
            {filter === "all"
              ? "A real townhall with real people. No seeded threads. Surface the first problem and it shows up here instantly."
              : "Try a different status, or surface the first one."}
          </p>
          <a className="btn btn-primary btn-sm" href="#" onClick={(e) => e.preventDefault()} style={{ marginTop: 18 }}>Surface a problem <span aria-hidden>→</span></a>
        </div>
      ) : (
        <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
          {filtered.map((p) => <ProblemCard key={p.slug} p={p} onOpen={setOpen} />)}
        </div>
      )}

      {open && (
        <div className="scrim" onClick={() => setOpen(null)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="mono" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--ink-500)" }}>{open.category}</span>
              <span className="sep">·</span><StatusBadge status={open.status} />
            </div>
            <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: 24, lineHeight: 1.15, margin: "12px 0 0" }}>{open.title}</h3>
            <p style={{ marginTop: 10, fontSize: 14, lineHeight: 1.6, color: "var(--ink-600)" }}>{open.summary}</p>
            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              <a className="btn btn-primary" href="#" onClick={(e) => e.preventDefault()} style={{ flex: 1, justifyContent: "center" }}>Propose a fix <span aria-hidden>→</span></a>
              {open.bounty && <a className="btn btn-sec" href="#" onClick={(e) => e.preventDefault()}>Pledge</a>}
              <button className="btn btn-sec" onClick={() => setOpen(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

Object.assign(window, { Forum });
