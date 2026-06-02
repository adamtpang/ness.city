/* Ness UI kit — chrome: live background, news banner, header, footer. */
const { useState: useStateChrome } = React;

function LiveBackground() {
  return <div className="live-bg" aria-hidden><div className="orb orb-a" /><div className="orb orb-b" /></div>;
}

function NewsBanner() {
  const [open, setOpen] = useStateChrome(true);
  if (!open) return null;
  return (
    <div className="newsbanner" role="status">
      <div className="inner">
        <span className="tag">v0.16</span>
        <span className="msg">The Market is open. Buy, sell, swap, share with the city.</span>
        <a className="cta" onClick={(e) => { e.preventDefault(); window.__nessGo && window.__nessGo("market"); }} href="#">Browse listings <span aria-hidden>→</span></a>
        <button className="x" aria-label="Dismiss" onClick={() => setOpen(false)}>×</button>
      </div>
    </div>
  );
}

const HEADER_NAV = [
  { id: "market", label: "Market" },
  { id: "forum", label: "Forum" },
  { id: "roadmap", label: "Roadmap" },
  { id: "citizens", label: "Citizens" },
];

function Header({ route, go }) {
  return (
    <header className="hdr">
      <div className="inner">
        <a className="brand" onClick={(e) => { e.preventDefault(); go("home"); }} href="#">
          <span className="dino" aria-hidden>🦕</span>
          <span className="wm">ness<span className="tld">.city</span></span>
        </a>
        <nav>
          {HEADER_NAV.map((n) => (
            <a key={n.id} href="#" className={route === n.id ? "active" : ""}
              onClick={(e) => { e.preventDefault(); go(n.id); }}>{n.label}</a>
          ))}
        </nav>
        <a className="btn btn-primary btn-sm" href="#"
          onClick={(e) => { e.preventDefault(); go(route === "forum" ? "forum" : "market"); }}>
          {route === "forum" ? "Surface" : "Post"} <span aria-hidden>→</span>
        </a>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="ftr">
      <div className="inner">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
          <div className="links">
            <span>ness.city · v0.16</span><span className="sep">·</span>
            <a href="https://github.com/adamtpang/ness.city" target="_blank" rel="noopener noreferrer">GitHub <span style={{ color: "var(--ink-400)" }}>↗</span></a><span className="sep">·</span>
            <a href="#">Discord <span style={{ color: "var(--ink-400)" }}>↗</span></a><span className="sep">·</span>
            <a href="#">interneta.world <span style={{ color: "var(--ink-400)" }}>↗</span></a>
          </div>
          <span>MIT licensed. Built bottom-up.</span>
        </div>
        <div className="fine">Independent project. Not affiliated with any specific community. Ness is its own brand and operates separately.</div>
      </div>
    </footer>
  );
}

Object.assign(window, { LiveBackground, NewsBanner, Header, Footer });
