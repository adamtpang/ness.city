/* Ness UI kit — Market (interactive: filter + reply dialog). */
const { useState: useStateMkt, useMemo: useMemoMkt } = React;

function ListingRow({ l, onReply }) {
  const k = KIND_STYLE[l.kind];
  const initials = l.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="lrow">
      <div>
        <div className="meta">
          <Dot color={k.dot} /><span className="kind">{k.label}</span>
          <span className="sep">·</span><span style={{ fontSize: 10.5, color: "var(--ink-400)" }}>{l.days}</span>
        </div>
        <div className="ttl">{l.title}</div>
        <div className="body">{l.body}</div>
        <div className="author">
          <Avatar initials={initials} seed={l.handle} size={18} />
          <span style={{ color: "var(--ink-700)" }}>{l.name}</span>
          <span className="sep">·</span><span className="mono" style={{ fontSize: 11 }}>@{l.handle}</span>
        </div>
      </div>
      <div className="price">{l.price}</div>
      <button className="btn btn-primary btn-sm" onClick={() => onReply(l)}>Reply <span aria-hidden>↓</span></button>
    </div>
  );
}

function ReplyDialog({ listing, onClose }) {
  if (!listing) return null;
  const k = KIND_STYLE[listing.kind];
  return (
    <div className="scrim" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Dot color={k.dot} /><span className="kind">{k.label}</span>
          <span className="sep">·</span><span className="mono" style={{ fontSize: 11, color: "var(--ink-500)" }}>@{listing.handle}</span>
        </div>
        <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: 24, lineHeight: 1.15, margin: "12px 0 0" }}>{listing.title}</h3>
        <p style={{ marginTop: 10, fontSize: 14, lineHeight: 1.6, color: "var(--ink-600)" }}>{listing.body}</p>
        <div className="bounty" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="lbl-sm">Price</span><span className="mono" style={{ fontSize: 14, color: "var(--ink-950)" }}>{listing.price}</span>
        </div>
        <p style={{ marginTop: 16, fontSize: 12.5, color: "var(--ink-500)" }}>
          Reply directly via {listing.contact}. Every listing is tied to a real handle — look anyone up on PageRank before you reply.
        </p>
        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <a className="btn btn-primary" href="#" onClick={(e) => e.preventDefault()} style={{ flex: 1, justifyContent: "center" }}>Open {listing.contact} <span aria-hidden>↗</span></a>
          <button className="btn btn-sec" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function Market({ go }) {
  const [filter, setFilter] = useStateMkt("all");
  const [active, setActive] = useStateMkt(null);

  const counts = useMemoMkt(() => {
    const c = { all: LISTINGS.length };
    for (const l of LISTINGS) c[l.kind] = (c[l.kind] || 0) + 1;
    return c;
  }, []);
  const filtered = LISTINGS.filter((l) => filter === "all" || l.kind === filter);

  return (
    <main className="container container-narrow" style={{ paddingBottom: 80 }}>
      <FadeIn><a className="backlink" href="#" onClick={(e) => { e.preventDefault(); go("home"); }} style={{ marginTop: 28, display: "inline-flex" }}><span aria-hidden>←</span> back to the city</a></FadeIn>
      <FadeIn delay={0.05}>
        <div style={{ marginTop: 28 }}>
          <p className="lbl">The Market</p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, letterSpacing: "-0.022em", fontSize: 56, lineHeight: 1.05, margin: "8px 0 0" }}>Buy &amp; sell, locally.</h1>
          <p style={{ marginTop: 12, maxWidth: 560, fontSize: 16, lineHeight: 1.55, color: "var(--ink-600)" }}>
            The community marketplace. Things people are selling, giving away, or looking for. Reply directly. Every listing is tied to a real handle, so you always know who you're dealing with.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Stat k="Open listings" v={counts.all} />
          <Stat k="For sale" v={counts.forsale || 0} />
          <Stat k="Free" v={counts.free || 0} />
          <Stat k="Wanted" v={counts.wanted || 0} />
        </div>
      </FadeIn>

      <div className="filterstrip">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {MARKET_FILTERS.map((f) => {
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
            {filter === "all" ? "Nothing's listed yet." : "Nothing in this category yet."}
          </p>
          <p style={{ margin: "8px auto 0", maxWidth: 380, fontSize: 13.5, lineHeight: 1.6, color: "var(--ink-500)" }}>
            {filter === "all"
              ? "This is a real market with real people. No fake listings. Post the first thing and it shows up here instantly."
              : "Try another category, or be the first to post here."}
          </p>
          <a className="btn btn-primary btn-sm" href="#" onClick={(e) => e.preventDefault()} style={{ marginTop: 18 }}>Post a listing <span aria-hidden>→</span></a>
        </div>
      ) : (
        <div className="rows" style={{ marginTop: 24 }}>
          {filtered.map((l) => <ListingRow key={l.id} l={l} onReply={setActive} />)}
        </div>
      )}

      <FadeIn>
        <div style={{ marginTop: 40, display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }} className="mkt-cta">
          <div className="card">
            <p className="lbl-sm">Post a listing</p>
            <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: 20, lineHeight: 1.15, margin: "8px 0 0" }}>Got something to sell, give, or find?</h3>
            <p style={{ marginTop: 8, fontSize: 13.5, lineHeight: 1.65, color: "var(--ink-600)" }}>Post it in under a minute. Tied to your handle so every reply knows who they're dealing with. Listings expire after 30 days.</p>
            <a className="btn btn-primary btn-sm" href="#" onClick={(e) => e.preventDefault()} style={{ marginTop: 16 }}>Post a listing <span aria-hidden>→</span></a>
          </div>
          <div className="card card-tint">
            <p className="lbl-sm">Etiquette</p>
            <ul style={{ margin: "12px 0 0", padding: 0, listStyle: "none", fontSize: 13.5, lineHeight: 1.7, color: "var(--ink-700)" }}>
              <li>· Real names. Real prices. Real photos when you can.</li>
              <li>· Mark sold or claimed quickly. Keeps the feed fresh.</li>
              <li>· Pay each other in USDC, cash, or the Costco order.</li>
              <li>· Don't list anything sketchy. Citizens see each other.</li>
            </ul>
          </div>
        </div>
      </FadeIn>

      <ReplyDialog listing={active} onClose={() => setActive(null)} />
    </main>
  );
}

Object.assign(window, { Market });
