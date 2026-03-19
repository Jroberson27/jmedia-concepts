import { useState, useEffect, useRef } from "react";

const CALENDAR_URL = "https://calendar.app.google/r4YhAH1SQJJXLgCu9";

const C = {
  black:    "#0A0A0A",
  dark:     "#0F0F0F",
  card:     "#141414",
  border:   "#1E1E1E",
  coral:    "#E8625A",
  coralDim: "#5A1E1A",
  white:    "#F4F2EE",
  muted:    "#555555",
  dim:      "#2A2A2A",
};

const FONT = {
  display: "'Inter', system-ui, sans-serif",
  body:    "'Inter', system-ui, sans-serif",
  mono:    "'Inter', system-ui, sans-serif",
};

const OTA_STATS = [
  { value: 23, suffix: "%", label: "Average OTA commission per booking" },
  { value: 68, suffix: "%", label: "Guests research on social before booking" },
  { value: 3.2, suffix: "x", label: "Higher lifetime value from direct guests" },
];

function useCountUp(target, duration, decimals) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setCount(parseFloat((eased * target).toFixed(decimals)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration, decimals]);
  return [count, ref];
}

function useFadeUp(delay) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, {
    opacity: vis ? 1 : 0,
    transform: vis ? "translateY(0)" : "translateY(28px)",
    transition: "opacity 0.75s ease " + (delay || 0) + "ms, transform 0.75s ease " + (delay || 0) + "ms",
  }];
}

export default function ConceptPage() {
  const [state, setState] = useState("loading");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [gated, setGated] = useState(true);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) { setError("No contact ID in URL."); setState("error"); return; }
    fetch("/api/concept?id=" + id)
      .then(r => r.json())
      .then(d => {
        if (d.error) throw new Error(d.error);
        setData(d);
        setState("ready");
        // Fetch images separately after page renders — keeps initial load instant
        if (d.contact?.website) {
          fetch("/api/images?website=" + encodeURIComponent(d.contact.website))
            .then(r => r.json())
            .then(img => {
              if (img.images?.length) {
                setData(prev => ({ ...prev, propertyImages: img.images }));
              }
            })
            .catch(() => {});
        }
      })
      .catch(e => { setError(e.message); setState("error"); });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: ${C.black}; color: ${C.white}; font-family: ${FONT.body}; -webkit-font-smoothing: antialiased; scroll-behavior: smooth; }
        ::selection { background: ${C.coral}; color: ${C.white}; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: ${C.black}; }
        ::-webkit-scrollbar-thumb { background: ${C.dim}; }
        @keyframes pulse { 0%,100%{opacity:.3} 50%{opacity:1} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>
      {state === "loading" && <LoadingScreen />}
      {state === "error" && <ErrorScreen message={error} />}
      {state === "ready" && data && <ConceptView data={data} gated={gated} onUngate={() => setGated(false)} />}
    </>
  );
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32 }}>
      <img src="/jmedia-logo.png" alt="JMEDIA" style={{ height: 56, mixBlendMode: "screen", animation: "float 3s ease infinite" }} />
      <div style={{ display: "flex", gap: 8 }}>
        {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: C.coral, animation: "pulse 1.2s ease " + (i * 0.2) + "s infinite" }} />)}
      </div>
      <p style={{ fontFamily: FONT.mono, fontSize: 11, color: C.muted, letterSpacing: "0.12em" }}>Building your content concept</p>
    </div>
  );
}

function ErrorScreen({ message }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: "0 24px", textAlign: "center" }}>
      <img src="/jmedia-logo.png" alt="JMEDIA" style={{ height: 44, opacity: 0.7, mixBlendMode: "screen" }} />
      <p style={{ color: C.muted, fontSize: 14 }}>{message || "Something went wrong."}</p>
    </div>
  );
}

function StatCounter({ value, suffix, label }) {
  const dec = value % 1 !== 0 ? 1 : 0;
  const [count, ref] = useCountUp(value, 1800, dec);
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{ fontFamily: FONT.display, fontSize: "clamp(42px, 6vw, 66px)", fontWeight: 300, color: C.coral, lineHeight: 1, marginBottom: 12 }}>
        {dec ? count.toFixed(1) : Math.floor(count)}{suffix}
      </div>
      <div style={{ fontFamily: FONT.body, fontSize: 13, color: C.muted, lineHeight: 1.7, maxWidth: 160, margin: "0 auto", fontWeight: 400 }}>{label}</div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 20, height: 1, background: C.coral }} />
      <span style={{ fontFamily: FONT.body, fontSize: 11, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>{children}</span>
    </div>
  );
}

function ImpactCard({ number, label, sub, accent }) {
  return (
    <div style={{ background: C.card, border: "1px solid " + (accent ? C.coralDim : C.border), padding: "28px 24px", position: "relative", overflow: "hidden" }}>
      {accent && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: C.coral }} />}
      <div style={{ fontFamily: FONT.display, fontSize: 44, fontWeight: 300, color: accent ? C.coral : C.white, lineHeight: 1, marginBottom: 8 }}>{number}</div>
      <div style={{ fontFamily: FONT.mono, fontSize: 10, color: accent ? C.coral : C.muted, letterSpacing: "0.08em", marginBottom: 12 }}>{label}</div>
      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, fontWeight: 400 }}>{sub}</p>
    </div>
  );
}

function DirectionCard({ index, direction }) {
  const [open, setOpen] = useState(index === 1);
  return (
    <div style={{ background: C.card, border: "1px solid " + C.border, overflow: "hidden" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "22px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, textAlign: "left" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 10, color: C.coral }}>{String(index).padStart(2, "0")}</span>
          <span style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 600, color: C.white }}>{direction.name}</span>
        </div>
        <span style={{ fontSize: 18, color: C.muted, transform: open ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.25s ease", flexShrink: 0, lineHeight: 1 }}>+</span>
      </button>
      <div style={{ maxHeight: open ? "300px" : "0", overflow: "hidden", transition: "max-height 0.35s ease" }}>
        <div style={{ padding: "0 28px 28px", borderTop: "1px solid " + C.border }}>
          <p style={{ fontSize: 14, color: "#999", lineHeight: 1.8, marginBottom: 18, marginTop: 20, fontWeight: 400 }}>{direction.angle}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {direction.formats.map((f, i) => (
              <span key={i} style={{ fontFamily: FONT.mono, fontSize: 9, color: C.coral, background: C.coral + "11", border: "1px solid " + C.coralDim, padding: "5px 12px", letterSpacing: "0.08em" }}>{f}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RetainerPhase({ phase, index }) {
  const [open, setOpen] = useState(index === 0);
  const phaseColors = ["#E8625A", "#C4524B", "#A04440"];
  const color = phaseColors[index] || C.coral;

  return (
    <div style={{ background: C.card, border: "1px solid " + C.border, overflow: "hidden" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, textAlign: "left" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, flex: 1 }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 9, color: color, letterSpacing: "0.1em", marginBottom: 4 }}>{phase.phase}</div>
            <div style={{ fontFamily: FONT.mono, fontSize: 9, color: C.muted, letterSpacing: "0.06em" }}>{phase.months}</div>
          </div>
          <div style={{ width: 1, height: 32, background: C.border, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: C.white, marginBottom: 4 }}>{phase.storyline}</div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 300 }}>{phase.goal}</div>
          </div>
        </div>
        <span style={{ fontSize: 18, color: C.muted, transform: open ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.25s ease", flexShrink: 0, lineHeight: 1 }}>+</span>
      </button>

      <div style={{ maxHeight: open ? "400px" : "0", overflow: "hidden", transition: "max-height 0.35s ease" }}>
        <div style={{ padding: "0 28px 28px", borderTop: "1px solid " + C.border }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginTop: 20 }}>
            <div style={{ background: C.black, border: "1px solid " + C.border, padding: "18px 20px" }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 9, color: color, letterSpacing: "0.1em", marginBottom: 10 }}>Strategic focus</div>
              <p style={{ fontSize: 14, color: "#999", lineHeight: 1.75, fontWeight: 400 }}>{phase.focus}</p>
            </div>
            <div style={{ background: C.black, border: "1px solid " + C.border, padding: "18px 20px" }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 9, color: C.muted, letterSpacing: "0.1em", marginBottom: 10 }}>Deliverables</div>
              <p style={{ fontSize: 14, color: "#999", lineHeight: 1.75, fontWeight: 400 }}>{phase.output}</p>
            </div>
          </div>
          {index < 2 && (
            <div style={{ marginTop: 12, padding: "10px 16px", background: color + "0D", border: "1px solid " + color + "33", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: color, flexShrink: 0 }} />
              <span style={{ fontFamily: FONT.mono, fontSize: 9, color: color, letterSpacing: "0.08em" }}>
                Builds into Phase {index + 2}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GateSection({ gated, onUngate, hotel }) {
  const inner = (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.coral, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
        Your concept is ready to download
      </div>
      <p style={{ fontFamily: FONT.display, fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 300, color: C.white, marginBottom: 16 }}>
        Download the full PDF concept for {hotel}
      </p>
      <p style={{ fontSize: 13, color: "#666", fontWeight: 300, maxWidth: 440, margin: "0 auto 36px", lineHeight: 1.75 }}>
        Book a 15-minute call and I will send the PDF before we speak. No agenda, no pressure.
      </p>
      <a
        href={CALENDAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "inline-block", background: C.coral, color: C.white, fontFamily: FONT.mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", padding: "16px 44px", textDecoration: "none", transition: "opacity 0.15s" }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      >
        Book a Meeting to Download
      </a>
    </div>
  );

  if (!gated) return <div style={{ background: C.card, border: "1px solid " + C.border, padding: "64px 48px" }}>{inner}</div>;

  return (
    <div style={{ position: "relative" }}>
      <div style={{ filter: "blur(8px)", pointerEvents: "none", userSelect: "none", opacity: 0.2, background: C.card, border: "1px solid " + C.border, padding: "64px 48px" }}>
        <div style={{ height: 14, background: C.dim, borderRadius: 2, width: "55%", margin: "0 auto 14px" }} />
        <div style={{ height: 14, background: C.dim, borderRadius: 2, width: "75%", margin: "0 auto 14px" }} />
        <div style={{ height: 44, background: C.coral, width: 220, margin: "0 auto" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: C.black + "E0", backdropFilter: "blur(4px)", padding: "64px 48px" }}>
        {inner}
        <button onClick={onUngate} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: FONT.mono, fontSize: 10, color: C.muted, letterSpacing: "0.06em", textDecoration: "underline", marginTop: 20 }}>
          View concept without downloading
        </button>
      </div>
    </div>
  );
}

function ConceptView({ data, gated, onUngate }) {
  const { contact, concept, scoring, propertyImages = [] } = data;
  const heroImage = propertyImages[0] || null;
  const breakImage = propertyImages[1] || propertyImages[0] || null;
  const galleryImages = propertyImages.slice(0, 4);
  const otaLevel = scoring.ota || "Medium";

  const [heroRef, heroStyle]           = useFadeUp(0);
  const [statsRef, statsStyle]         = useFadeUp(0);
  const [brandRef, brandStyle]         = useFadeUp(0);
  const [directionsRef, directionsStyle] = useFadeUp(0);
  const [deliverablesRef, deliverablesStyle] = useFadeUp(0);
  const [impactRef, impactStyle]       = useFadeUp(0);
  const [gateRef, gateStyle]           = useFadeUp(0);

  return (
    <div style={{ maxWidth: "100%", overflowX: "hidden" }}>

      {/* HERO */}
      <div style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: heroImage ? `url(${heroImage})` : "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80&fit=crop')", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.15) saturate(0.3)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, " + C.black + "00 0%, " + C.black + "BB 55%, " + C.black + " 100%)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: C.coral }} />

        <nav style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "28px 48px", borderBottom: "1px solid " + C.border + "22" }}>
          <img src="/jmedia-logo.png" alt="JMEDIA Productions" style={{ height: 52, mixBlendMode: "screen" }} />
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <span style={{ fontFamily: FONT.mono, fontSize: 10, color: C.muted, letterSpacing: "0.1em" }}>Content Concept</span>
            <div style={{ width: 1, height: 14, background: C.border }} />
            <span style={{ fontFamily: FONT.mono, fontSize: 10, color: C.coral, letterSpacing: "0.1em" }}>{contact.company}</span>
          </div>
        </nav>

        <div ref={heroRef} style={{ ...heroStyle, position: "relative", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 48px 100px", maxWidth: 940 }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.coral, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 24 }}>
            Prepared exclusively for {contact.company}
          </div>
          <h1 style={{ fontFamily: FONT.display, fontSize: "clamp(44px, 7vw, 82px)", fontWeight: 300, lineHeight: 1.05, color: C.white, marginBottom: 28, letterSpacing: "-0.01em" }}>
            {concept.headline}
          </h1>
          <p style={{ fontSize: 18, color: "#999", lineHeight: 1.85, maxWidth: 580, fontWeight: 400 }}>
            {concept.opening}
          </p>
          <div style={{ position: "absolute", bottom: 36, left: 48, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 28, height: 1, background: C.muted }} />
            <span style={{ fontFamily: FONT.mono, fontSize: 9, color: C.muted, letterSpacing: "0.1em" }}>Scroll to explore</span>
          </div>
        </div>
      </div>

      {/* OTA STATS */}
      <div style={{ background: C.dark, borderTop: "1px solid " + C.border, borderBottom: "1px solid " + C.border, padding: "80px 48px" }}>
        <div ref={statsRef} style={{ ...statsStyle, maxWidth: 860, margin: "0 auto" }}>
          <div style={{ fontFamily: FONT.body, fontSize: 11, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, textAlign: "center", marginBottom: 60 }}>
            Why direct bookings matter
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "40px 24px" }}>
            {OTA_STATS.map((s, i) => <StatCounter key={i} {...s} />)}
          </div>
          <div style={{ marginTop: 56, padding: "24px 32px", background: C.coral + "0D", border: "1px solid " + C.coralDim, borderLeft: "3px solid " + C.coral, maxWidth: 680, margin: "56px auto 0" }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.coral, letterSpacing: "0.1em", marginBottom: 8 }}>
              {contact.company} — {otaLevel} OTA dependency
            </div>
            <p style={{ fontSize: 14, color: "#999", lineHeight: 1.8, fontWeight: 400 }}>{concept.ota_impact}</p>
          </div>
        </div>
      </div>

      {/* BRAND */}
      <div style={{ padding: "100px 48px", maxWidth: 860, margin: "0 auto" }}>
        <div ref={brandRef} style={brandStyle}>
          <SectionLabel>What we see in {contact.company}</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginTop: 28 }}>
            <div style={{ background: C.card, border: "1px solid " + C.border, padding: "36px 32px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, " + C.coral + ", transparent)" }} />
              <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.coral, letterSpacing: "0.1em", marginBottom: 16 }}>Brand identity</div>
              <p style={{ fontSize: 15, color: C.white, lineHeight: 1.9, fontWeight: 400 }}>{contact.jmedia_brand_identity}</p>
            </div>
            <div style={{ background: C.card, border: "1px solid " + C.border, padding: "36px 32px" }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.muted, letterSpacing: "0.1em", marginBottom: 16 }}>Market position</div>
              <p style={{ fontSize: 15, color: C.white, lineHeight: 1.9, fontWeight: 400 }}>{contact.jmedia_key_detail}</p>
            </div>
          </div>
        </div>
      </div>

      {/* PROPERTY IMAGE GALLERY */}
      {galleryImages.length > 1 && (
        <div style={{ padding: "0 48px 80px", maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: galleryImages.length >= 3 ? "2fr 1fr 1fr" : "1fr 1fr", gap: 2 }}>
            {galleryImages.map((img, i) => (
              <div key={i} style={{
                aspectRatio: i === 0 ? "16/10" : "4/3",
                overflow: "hidden",
                position: "relative",
                gridRow: i === 0 && galleryImages.length >= 3 ? "1 / 3" : "auto",
              }}>
                <img
                  src={img}
                  alt={contact.company + " property image " + (i + 1)}
                  style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.85) saturate(0.9)", transition: "transform 0.5s ease, filter 0.3s ease", display: "block" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.filter = "brightness(0.95) saturate(1.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.filter = "brightness(0.85) saturate(0.9)"; }}
                />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8, fontFamily: FONT.mono, fontSize: 9, color: C.muted, letterSpacing: "0.08em", textAlign: "right" }}>
            Images from {contact.website || contact.company}
          </div>
        </div>
      )}

      {/* CINEMATIC BREAK */}
      <div style={{ position: "relative", height: 300, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: breakImage ? `url(${breakImage})` : "url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1600&q=80&fit=crop')", backgroundSize: "cover", backgroundPosition: "center 40%", filter: "brightness(0.18) saturate(0.4)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, " + C.black + " 0%, transparent 35%, transparent 65%, " + C.black + " 100%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontFamily: FONT.display, fontSize: "clamp(20px, 3.5vw, 36px)", fontWeight: 300, color: C.white, textAlign: "center", maxWidth: 580, lineHeight: 1.5, padding: "0 24px", letterSpacing: "0.02em", fontStyle: "italic" }}>
            "{concept.why_now}"
          </p>
        </div>
      </div>

      {/* DIRECTIONS */}
      <div style={{ padding: "100px 48px", maxWidth: 860, margin: "0 auto" }}>
        <div ref={directionsRef} style={directionsStyle}>
          <SectionLabel>Signature Storylines</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 28 }}>
            {concept.content_directions.map((dir, i) => <DirectionCard key={i} index={i + 1} direction={dir} />)}
          </div>
        </div>
      </div>

      {/* DELIVERABLES */}
      <div style={{ background: C.dark, borderTop: "1px solid " + C.border, borderBottom: "1px solid " + C.border, padding: "100px 48px" }}>
        <div ref={deliverablesRef} style={{ ...deliverablesStyle, maxWidth: 860, margin: "0 auto" }}>
          <SectionLabel>Proposed deliverables</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginTop: 28 }}>
            {concept.deliverables.map((d, i) => (
              <div key={i} style={{ background: C.card, border: "1px solid " + C.border, padding: "20px 24px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span style={{ fontFamily: FONT.mono, fontSize: 10, color: C.coral, marginTop: 3, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: 14, color: C.white, lineHeight: 1.7, fontWeight: 400 }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6-MONTH RETAINER TIMELINE */}
      <div style={{ padding: "100px 48px", maxWidth: 860, margin: "0 auto" }}>
        <div ref={deliverablesRef} style={deliverablesStyle}>
          <SectionLabel>6-month content partnership</SectionLabel>
          {concept.retainer_summary && (
            <p style={{ fontSize: 16, color: "#999", lineHeight: 1.85, maxWidth: 640, marginTop: 16, marginBottom: 40, fontWeight: 400 }}>
              {concept.retainer_summary}
            </p>
          )}
          {concept.retainer_phases ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 8 }}>
              {concept.retainer_phases.map((phase, i) => (
                <RetainerPhase key={i} phase={phase} index={i} />
              ))}
            </div>
          ) : (
            concept.timeline && (
              <div style={{ background: C.card, border: "1px solid " + C.border, padding: "22px 28px" }}>
                <p style={{ fontSize: 14, color: C.white, lineHeight: 1.7, fontWeight: 400 }}>{concept.timeline}</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* IMPACT */}
      <div style={{ padding: "100px 48px", maxWidth: 860, margin: "0 auto" }}>
        <div ref={impactRef} style={impactStyle}>
          <SectionLabel>Direct booking impact</SectionLabel>
          <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
            <ImpactCard number="23%" label="Direct booking lift" sub="Average result for hospitality content campaigns in the first 90 days" />
            <ImpactCard number="4mo" label="Content lifespan" sub="One shoot repurposed across social, email, paid, and web for months" accent />
            <ImpactCard number="1 tier" label="OTA reduction" sub="Properties with strong brand content consistently lower OTA dependency within one season" />
          </div>

          {/* Checked In proof */}
          <div style={{ marginTop: 2, background: C.card, border: "1px solid " + C.border, padding: "32px 36px", display: "flex", gap: 32, alignItems: "center" }}>
            <div style={{ flexShrink: 0, textAlign: "center" }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.coral, letterSpacing: "0.1em", marginBottom: 8 }}>Proven at scale</div>
              <div style={{ fontFamily: FONT.display, fontSize: 48, fontWeight: 300, color: C.white, lineHeight: 1 }}>1.5M</div>
              <div style={{ fontFamily: FONT.mono, fontSize: 9, color: C.muted, marginTop: 6 }}>views per episode</div>
            </div>
            <div style={{ width: 1, height: 70, background: C.border, flexShrink: 0 }} />
            <p style={{ fontSize: 14, color: "#999", lineHeight: 1.85, fontWeight: 400 }}>
              I worked on the Checked In series for Universal Orlando, covering Stella Nova, Terra Luna, and Helios Grand. Each episode averaged 1.5 million views at 69% watch completion. The same approach — content that captures what a property actually feels like — is what I bring to {contact.company}.
            </p>
          </div>
        </div>
      </div>

      {/* GATE */}
      <div style={{ padding: "0 48px 120px", maxWidth: 860, margin: "0 auto" }}>
        <div ref={gateRef} style={gateStyle}>
          <GateSection gated={gated} onUngate={onUngate} hotel={contact.company} />
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid " + C.border, padding: "32px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <img src="/jmedia-logo.png" alt="JMEDIA Productions" style={{ height: 32, opacity: 0.55, mixBlendMode: "screen" }} />
        <span style={{ fontFamily: FONT.mono, fontSize: 10, color: C.muted, letterSpacing: "0.06em" }}>
          Confidential / {contact.company} / {new Date().getFullYear()}
        </span>
      </footer>

    </div>
  );
}
