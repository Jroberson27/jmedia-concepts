import { useState, useEffect } from "react";

const CALENDAR_URL = "https://calendar.app.google/r4YhAH1SQJJXLgCu9";

const C = {
  black:   "#0A0A0A",
  dark:    "#111111",
  card:    "#161616",
  border:  "#222222",
  coral:   "#E8625A",
  coralDim:"#7A2F2A",
  white:   "#F4F2EE",
  muted:   "#666666",
  dim:     "#333333",
};

const FONT = {
  display: "'Cormorant Garamond', Georgia, serif",
  body:    "'DM Sans', system-ui, sans-serif",
  mono:    "'DM Mono', monospace",
};

export default function ConceptPage() {
  const [state, setState] = useState("loading");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [gated, setGated] = useState(true);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) {
      setError("No contact ID found in URL.");
      setState("error");
      return;
    }
    fetch("/api/concept?id=" + id)
      .then(r => r.json())
      .then(d => {
        if (d.error) throw new Error(d.error);
        setData(d);
        setState("ready");
      })
      .catch(e => {
        setError(e.message);
        setState("error");
      });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { background: ${C.black}; color: ${C.white}; font-family: ${FONT.body}; -webkit-font-smoothing: antialiased; }
        body { background: ${C.black}; min-height: 100vh; }
        ::selection { background: ${C.coral}; color: ${C.white}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${C.black}; }
        ::-webkit-scrollbar-thumb { background: ${C.dim}; border-radius: 2px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .fade-up-1 { animation-delay: 0.1s; opacity: 0; }
        .fade-up-2 { animation-delay: 0.2s; opacity: 0; }
        .fade-up-3 { animation-delay: 0.3s; opacity: 0; }
        .fade-up-4 { animation-delay: 0.4s; opacity: 0; }
        .fade-up-5 { animation-delay: 0.5s; opacity: 0; }
        .fade-up-6 { animation-delay: 0.6s; opacity: 0; }
      `}</style>

      {state === "loading" && <LoadingScreen />}
      {state === "error" && <ErrorScreen message={error} />}
      {state === "ready" && data && (
        <ConceptView data={data} gated={gated} onUngate={() => setGated(false)} />
      )}
    </>
  );
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <Logo size="sm" />
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: C.coral, animation: `pulse 1.2s ease ${i * 0.2}s infinite` }} />
        ))}
      </div>
      <p style={{ fontSize: 12, color: C.muted, fontFamily: FONT.mono, letterSpacing: "0.1em" }}>
        Building your content concept
      </p>
    </div>
  );
}

function ErrorScreen({ message }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "0 24px", textAlign: "center" }}>
      <Logo size="sm" />
      <p style={{ color: C.muted, fontSize: 14 }}>{message || "Something went wrong."}</p>
    </div>
  );
}

function Logo({ size = "md" }) {
  const height = size === "sm" ? 28 : 36;
  return (
    <img
      src="/jmedia-logo.png"
      alt="JMEDIA Productions"
      style={{ height: height, width: "auto", display: "block" }}
    />
  );
}

function ConceptView({ data, gated, onUngate }) {
  const { contact, concept } = data;

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 80px" }}>

      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "28px 0", borderBottom: "1px solid " + C.border, marginBottom: 64 }}>
        <Logo />
        <span style={{ fontFamily: FONT.mono, fontSize: 11, color: C.muted, letterSpacing: "0.08em" }}>
          Content Concept / {contact.company}
        </span>
      </nav>

      {/* Hero */}
      <div className="fade-up fade-up-1" style={{ marginBottom: 72 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.coral, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
          Prepared exclusively for
        </div>
        <h1 style={{ fontFamily: FONT.display, fontSize: "clamp(40px, 7vw, 72px)", fontWeight: 300, lineHeight: 1.05, color: C.white, marginBottom: 24 }}>
          {concept.headline}
        </h1>
        <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.75, maxWidth: 580, fontWeight: 300 }}>
          {concept.opening}
        </p>
      </div>

      {/* Divider */}
      <div className="fade-up fade-up-2" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 64 }}>
        <div style={{ flex: 1, height: 1, background: C.border }} />
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.coral }} />
        <div style={{ flex: 1, height: 1, background: C.border }} />
      </div>

      {/* Content Directions */}
      <section className="fade-up fade-up-2" style={{ marginBottom: 72 }}>
        <SectionLabel>Content Directions</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {concept.content_directions.map((dir, i) => (
            <DirectionCard key={i} index={i + 1} direction={dir} />
          ))}
        </div>
      </section>

      {/* Deliverables */}
      <section className="fade-up fade-up-3" style={{ marginBottom: 72 }}>
        <SectionLabel>Proposed Deliverables</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {concept.deliverables.map((d, i) => (
            <div key={i} style={{ background: C.card, border: "1px solid " + C.border, padding: "16px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span style={{ fontFamily: FONT.mono, fontSize: 10, color: C.coral, marginTop: 2, flexShrink: 0 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontSize: 13, color: C.white, lineHeight: 1.6, fontWeight: 300 }}>{d}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline + Impact row */}
      <section className="fade-up fade-up-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 72 }}>
        <InfoCard label="Production Timeline" value={concept.timeline} />
        <InfoCard label="Why Now" value={concept.why_now} accent />
      </section>

      {/* OTA Impact */}
      <section className="fade-up fade-up-5" style={{ marginBottom: 72 }}>
        <div style={{ background: C.card, border: "1px solid " + C.coralDim, borderLeft: "3px solid " + C.coral, padding: "24px 28px" }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.coral, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
            Direct Booking Impact
          </div>
          <p style={{ fontSize: 14, color: C.white, lineHeight: 1.75, fontWeight: 300 }}>{concept.ota_impact}</p>
        </div>
      </section>

      {/* Gate */}
      <section className="fade-up fade-up-6">
        <GateSection gated={gated} onUngate={onUngate} hotel={contact.company} />
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid " + C.border, marginTop: 80, paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Logo size="sm" />
        <span style={{ fontFamily: FONT.mono, fontSize: 10, color: C.muted, letterSpacing: "0.06em" }}>
          Confidential / {contact.company}
        </span>
      </footer>

    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
      {children}
    </div>
  );
}

function DirectionCard({ index, direction }) {
  const [open, setOpen] = useState(index === 1);
  return (
    <div style={{ background: C.card, border: "1px solid " + C.border, overflow: "hidden" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, textAlign: "left" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 10, color: C.coral }}>
            {String(index).padStart(2, "0")}
          </span>
          <span style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 400, color: C.white, letterSpacing: "0.02em" }}>
            {direction.name}
          </span>
        </div>
        <span style={{ fontSize: 16, color: C.muted, transform: open ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>+</span>
      </button>
      {open && (
        <div style={{ padding: "0 24px 24px", borderTop: "1px solid " + C.border }}>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 16, marginTop: 16, fontWeight: 300 }}>
            {direction.angle}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {direction.formats.map((f, i) => (
              <span key={i} style={{ fontFamily: FONT.mono, fontSize: 10, color: C.coral, background: C.coralDim + "33", border: "1px solid " + C.coralDim, padding: "4px 10px", letterSpacing: "0.06em" }}>
                {f}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value, accent }) {
  return (
    <div style={{ background: C.card, border: "1px solid " + (accent ? C.coralDim : C.border), padding: "20px 24px" }}>
      <div style={{ fontFamily: FONT.mono, fontSize: 10, color: accent ? C.coral : C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
        {label}
      </div>
      <p style={{ fontSize: 13, color: C.white, lineHeight: 1.7, fontWeight: 300 }}>{value}</p>
    </div>
  );
}

function GateSection({ gated, onUngate, hotel }) {
  if (!gated) {
    return (
      <div style={{ background: C.card, border: "1px solid " + C.border, padding: "36px 40px", textAlign: "center" }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.coral, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
          Your concept is ready
        </div>
        <p style={{ fontSize: 14, color: C.muted, marginBottom: 28, fontWeight: 300 }}>
          Book a 15-minute call and I will send the full PDF concept to you before we speak.
        </p>
        <a
          href={CALENDAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-block", background: C.coral, color: C.white, fontFamily: FONT.mono, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", padding: "14px 36px", textDecoration: "none", transition: "opacity 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          Book a Meeting to Download
        </a>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      {/* Blurred preview */}
      <div style={{ filter: "blur(6px)", pointerEvents: "none", userSelect: "none", opacity: 0.4, background: C.card, border: "1px solid " + C.border, padding: "36px 40px" }}>
        <div style={{ height: 12, background: C.dim, borderRadius: 2, marginBottom: 12, width: "60%" }} />
        <div style={{ height: 12, background: C.dim, borderRadius: 2, marginBottom: 12, width: "80%" }} />
        <div style={{ height: 12, background: C.dim, borderRadius: 2, width: "40%" }} />
      </div>

      {/* Gate overlay */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, background: C.black + "CC", backdropFilter: "blur(2px)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: FONT.display, fontSize: 22, fontWeight: 300, color: C.white, marginBottom: 8 }}>
            Download Your {hotel} Concept
          </div>
          <p style={{ fontSize: 13, color: C.muted, fontWeight: 300 }}>
            Book a 15-minute call to receive the full PDF.
          </p>
        </div>
        <a
          href={CALENDAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-block", background: C.coral, color: C.white, fontFamily: FONT.mono, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", padding: "14px 36px", textDecoration: "none" }}
        >
          Book a Meeting to Download
        </a>
        <button
          onClick={onUngate}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: FONT.mono, fontSize: 10, color: C.muted, letterSpacing: "0.06em", textDecoration: "underline" }}
        >
          View concept first
        </button>
      </div>
    </div>
  );
}
