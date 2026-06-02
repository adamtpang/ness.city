/* Ness UI kit — Home (the brand landing). */
function Home({ go }) {
  return (
    <main className="container">
      {/* Hero */}
      <section className="hero">
        <div>
          <FadeIn><p className="lbl" style={{ letterSpacing: "0.22em" }}>ness.city · open-source community OS · MIT</p></FadeIn>
          <FadeIn delay={0.05}><h1>Loch in.</h1></FadeIn>
          <FadeIn delay={0.1}>
            <p style={{ marginTop: 24, maxWidth: 560, fontSize: 18, lineHeight: 1.55, color: "var(--ink-700)" }}>
              The bottom-up coordination platform for the community. Marketplace, problem-solving forum, social graph, all in one repo. Free, public, MIT.
            </p>
          </FadeIn>
          <FadeIn delay={0.16}>
            <div style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: 12 }}>
              <a className="btn btn-primary" href="#" onClick={(e) => { e.preventDefault(); go("market"); }}>Open the market <span aria-hidden>→</span></a>
              <a className="btn btn-sec" href="#" onClick={(e) => { e.preventDefault(); go("forum"); }}>Open the forum</a>
            </div>
          </FadeIn>
        </div>
        <FadeIn delay={0.22}>
          <figure className="figure" style={{ margin: 0 }}>
            <img src="../../assets/nessie-silhouette.svg" alt="Nessie surfacing in Loch Ness" style={{ aspectRatio: "3/4" }} />
            <figcaption>Loch Ness, 1934 — Nessie</figcaption>
          </figure>
        </FadeIn>
      </section>

      <div className="divider" style={{ maxWidth: 768, margin: "0 auto" }} />

      {/* Vision strip */}
      <section style={{ display: "grid", gap: 32, padding: "64px 0", alignItems: "center" }} className="vision">
        <FadeIn>
          <figure className="figure" style={{ margin: 0, maxWidth: 420 }}>
            <img src="../../assets/solarpunk-vision.svg" alt="A solarpunk vision" style={{ aspectRatio: "3/4" }} />
            <figcaption>Forest City, one possible future</figcaption>
          </figure>
        </FadeIn>
        <FadeIn delay={0.05}>
          <div>
            <p className="lbl" style={{ letterSpacing: "0.22em" }}>Vision</p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, letterSpacing: "-0.022em", fontSize: 52, lineHeight: 1.02, margin: "12px 0 0" }}>
              What Forest City becomes<br /><span style={{ fontStyle: "italic" }}>if we build it together.</span>
            </h2>
            <p style={{ marginTop: 20, maxWidth: 440, fontSize: 16, lineHeight: 1.6, color: "var(--ink-700)" }}>
              A solarpunk, optimistic, fun city. Coordinated bottom-up by the citizens who live here. The platform is the tool; the people are the product.
            </p>
          </div>
        </FadeIn>
      </section>

      <div className="divider" style={{ maxWidth: 768, margin: "0 auto" }} />

      {/* Nessie agent teaser */}
      <FadeIn>
        <section className="card-dark" style={{ borderRadius: 24, padding: "40px 48px", marginTop: 48 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 12 }}>
            <span style={{ fontSize: 32, lineHeight: 1 }} aria-hidden>🦕</span>
            <p className="lbl" style={{ color: "var(--ink-300)", letterSpacing: "0.22em" }}>Coming · Nessie</p>
          </div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, letterSpacing: "-0.022em", fontSize: 48, lineHeight: 1.02, margin: "16px 0 0" }}>
            A 24/7 community coordinator.
          </h2>
          <p style={{ marginTop: 20, maxWidth: 640, fontSize: 16, lineHeight: 1.65, color: "var(--ink-200)" }}>
            Nessie is the AI agent that triages problems, surfaces patterns, drafts proposals, watches the changelog, and never sleeps. Built on the same open-source rails as the rest of ness.city, listening to the community 24/7 so the founders don't have to.
          </p>
          <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 12 }}>
            <a className="btn btn-inv" href="https://github.com/adamtpang/ness.city" target="_blank" rel="noopener noreferrer">Read the spec on GitHub <span aria-hidden>↗</span></a>
            <a className="btn btn-darkline" href="#" onClick={(e) => e.preventDefault()}>Discuss on Discord <span aria-hidden>↗</span></a>
          </div>
        </section>
      </FadeIn>

      {/* Rooms grid */}
      <FadeIn>
        <section style={{ marginTop: 80 }}>
          <p className="lbl" style={{ letterSpacing: "0.22em" }}>Every room in Ness</p>
          <div className="rooms" style={{ marginTop: 20 }}>
            {ROOMS.map((r) => (
              <a key={r.name} href="#" className="card card-hover room"
                onClick={(e) => { e.preventDefault(); if (r.nav) go(r.nav); }} style={{ padding: 20 }}>
                <div className="rh">
                  <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: 22, lineHeight: 1.1, margin: 0 }}>{r.name}</h3>
                  <span className="livetag"><span className="dot" />{r.external ? "off-site" : "live"}</span>
                </div>
                <p style={{ flex: 1, marginTop: 8, fontSize: 13, lineHeight: 1.55, color: "var(--ink-600)" }}>{r.body}</p>
                <span className="url">{r.href} <span aria-hidden>{r.external ? "↗" : "→"}</span></span>
              </a>
            ))}
          </div>
        </section>
      </FadeIn>
    </main>
  );
}

Object.assign(window, { Home });
