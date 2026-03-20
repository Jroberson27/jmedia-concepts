import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const CALENDAR_URL = "https://meetings.hubspot.com/officialjordan-roberson2/jmedia-intro";

const DARK = {
  black: "#0A0A0A", dark: "#0F0F0F", card: "#141414",
  border: "#1E1E1E", coral: "#E8625A", coralDim: "#5A1E1A",
  white: "#F4F2EE", muted: "#666666", dim: "#2A2A2A",
};
const LIGHT = {
  black: "#F8F8F6", dark: "#FFFFFF", card: "#FFFFFF",
  border: "#E0E0E0", coral: "#E8625A", coralDim: "#FADAD8",
  white: "#111111", muted: "#777777", dim: "#E8E8E8",
};

const FONT = "'Inter', system-ui, sans-serif";

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
  return [ref, { opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.75s ease ${delay || 0}ms, transform 0.75s ease ${delay || 0}ms` }];
}

function ConceptPage() {
  const [state, setState] = useState("loading");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [gated, setGated] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Detect color scheme
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);
    const schemeHandler = (e) => setIsDark(e.matches);
    mq.addEventListener("change", schemeHandler);

    // Print detection
    const onBefore = () => setIsPrinting(true);
    const onAfter = () => setIsPrinting(false);
    window.addEventListener("beforeprint", onBefore);
    window.addEventListener("afterprint", onAfter);

    // Fetch data
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) { setError("No contact ID in URL."); setState("error"); return; }

    fetch("/api/concept?id=" + id)
      .then(r => r.json())
      .then(d => {
        if (d.error) throw new Error(d.error);
        setData(d);
        setState("ready");
        if (d.contact?.website) {
          fetch("/api/images?website=" + encodeURIComponent(d.contact.website))
            .then(r => r.json())
            .then(img => { if (img.images?.length) setData(prev => ({ ...prev, propertyImages: img.images })); })
            .catch(() => {});
        }
      })
      .catch(e => { setError(e.message); setState("error"); });

    return () => {
      mq.removeEventListener("change", schemeHandler);
      window.removeEventListener("beforeprint", onBefore);
      window.removeEventListener("afterprint", onAfter);
    };
  }, []);

  const C = isDark ? DARK : LIGHT;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: ${C.black}; color: ${C.white}; font-family: ${FONT}; -webkit-font-smoothing: antialiased; scroll-behavior: smooth; transition: background 0.3s ease; }
        ::selection { background: #E8625A; color: #fff; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: ${C.black}; }
        ::-webkit-scrollbar-thumb { background: ${C.dim}; }
        @keyframes pulse { 0%,100%{opacity:.3} 50%{opacity:1} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>
      {state === "loading" && <Loading C={C} />}
      {state === "error" && <Err C={C} message={error} />}
      {state === "ready" && data && isPrinting && <PrintView data={data} />}
      {state === "ready" && data && !isPrinting && (
        <ConceptView data={data} gated={gated} onUngate={() => setGated(false)} C={C} isDark={isDark} />
      )}
    </>
  );
}

function Loading({ C }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32, background: C.black }}>
      <img src="/jmedia-logo.png" alt="JMEDIA" style={{ height: 56, mixBlendMode: "screen", animation: "float 3s ease infinite" }} />
      <div style={{ display: "flex", gap: 8 }}>
        {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "#E8625A", animation: `pulse 1.2s ease ${i*0.2}s infinite` }} />)}
      </div>
      <p style={{ fontFamily: FONT, fontSize: 11, color: C.muted, letterSpacing: "0.12em" }}>Building your content concept</p>
    </div>
  );
}

function Err({ C, message }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: "0 24px", textAlign: "center", background: C.black }}>
      <img src="/jmedia-logo.png" alt="JMEDIA" style={{ height: 44, opacity: 0.7 }} />
      <p style={{ color: C.muted, fontSize: 14 }}>{message || "Something went wrong."}</p>
    </div>
  );
}

function SectionLabel({ children, C }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 20, height: 1, background: C.coral }} />
      <span style={{ fontFamily: FONT, fontSize: 11, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>{children}</span>
    </div>
  );
}

function StatCounter({ value, suffix, label, C }) {
  const dec = value % 1 !== 0 ? 1 : 0;
  const [count, ref] = useCountUp(value, 1800, dec);
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{ fontFamily: FONT, fontSize: "clamp(38px, 5vw, 58px)", fontWeight: 300, color: C.coral, lineHeight: 1, marginBottom: 12 }}>
        {dec ? count.toFixed(1) : Math.floor(count)}{suffix}
      </div>
      <div style={{ fontFamily: FONT, fontSize: 13, color: C.muted, lineHeight: 1.7, maxWidth: 160, margin: "0 auto", fontWeight: 400 }}>{label}</div>
    </div>
  );
}

function ImpactCard({ number, label, sub, accent, C }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${accent ? C.coralDim : C.border}`, padding: "28px 24px", position: "relative", overflow: "hidden" }}>
      {accent && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: C.coral }} />}
      <div style={{ fontFamily: FONT, fontSize: 44, fontWeight: 300, color: accent ? C.coral : C.white, lineHeight: 1, marginBottom: 8 }}>{number}</div>
      <div style={{ fontFamily: FONT, fontSize: 10, color: accent ? C.coral : C.muted, letterSpacing: "0.08em", marginBottom: 12, fontWeight: 600 }}>{label}</div>
      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, fontWeight: 400 }}>{sub}</p>
    </div>
  );
}

function DirectionCard({ index, direction, C }) {
  const [open, setOpen] = useState(index === 1);
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, overflow: "hidden" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "22px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, textAlign: "left" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ fontFamily: FONT, fontSize: 10, color: C.coral, fontWeight: 600 }}>{String(index).padStart(2,"0")}</span>
          <span style={{ fontFamily: FONT, fontSize: 18, fontWeight: 600, color: C.white }}>{direction.name}</span>
        </div>
        <span style={{ fontSize: 18, color: C.muted, transform: open ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.25s ease", flexShrink: 0, lineHeight: 1 }}>+</span>
      </button>
      <div style={{ maxHeight: open ? "300px" : "0", overflow: "hidden", transition: "max-height 0.35s ease" }}>
        <div style={{ padding: "0 28px 28px", borderTop: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 18, marginTop: 20, fontWeight: 400 }}>{direction.angle}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {direction.formats.map((f, i) => (
              <span key={i} style={{ fontFamily: FONT, fontSize: 9, color: C.coral, background: C.coral + "11", border: `1px solid ${C.coralDim}`, padding: "5px 12px", letterSpacing: "0.08em" }}>{f}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RetainerPhase({ phase, index, C }) {
  const [open, setOpen] = useState(index === 0);
  const phaseColors = ["#E8625A", "#C4524B", "#A04440"];
  const color = phaseColors[index] || C.coral;
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, overflow: "hidden" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, textAlign: "left" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, flex: 1 }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontFamily: FONT, fontSize: 9, color: color, letterSpacing: "0.1em", marginBottom: 4, fontWeight: 600 }}>{phase.phase}</div>
            <div style={{ fontFamily: FONT, fontSize: 9, color: C.muted }}>{phase.months}</div>
          </div>
          <div style={{ width: 1, height: 32, background: C.border, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: C.white, marginBottom: 3 }}>{phase.storyline}</div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 400 }}>{phase.goal}</div>
          </div>
        </div>
        <span style={{ fontSize: 18, color: C.muted, transform: open ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.25s ease", flexShrink: 0, lineHeight: 1 }}>+</span>
      </button>
      <div style={{ maxHeight: open ? "400px" : "0", overflow: "hidden", transition: "max-height 0.35s ease" }}>
        <div style={{ padding: "0 28px 28px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginTop: 20 }}>
            <div style={{ background: C.black, border: `1px solid ${C.border}`, padding: "18px 20px" }}>
              <div style={{ fontFamily: FONT, fontSize: 9, color: color, letterSpacing: "0.1em", marginBottom: 10, fontWeight: 600 }}>Strategic focus</div>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75, fontWeight: 400 }}>{phase.focus}</p>
            </div>
            <div style={{ background: C.black, border: `1px solid ${C.border}`, padding: "18px 20px" }}>
              <div style={{ fontFamily: FONT, fontSize: 9, color: C.muted, letterSpacing: "0.1em", marginBottom: 10, fontWeight: 600 }}>Deliverables</div>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75, fontWeight: 400 }}>{phase.output}</p>
            </div>
          </div>
          {index < 2 && (
            <div style={{ marginTop: 12, padding: "10px 16px", background: color + "0D", border: `1px solid ${color}33`, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: color, flexShrink: 0 }} />
              <span style={{ fontFamily: FONT, fontSize: 9, color: color, letterSpacing: "0.08em", fontWeight: 600 }}>Builds into Phase {index + 2}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GateSection({ gated, onUngate, hotel, C }) {
  const inner = (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: FONT, fontSize: 10, color: C.coral, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>Your concept is ready to download</div>
      <p style={{ fontFamily: FONT, fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 300, color: C.white, marginBottom: 16 }}>Download the full PDF concept for {hotel}</p>
      <p style={{ fontSize: 13, color: C.muted, fontWeight: 400, maxWidth: 440, margin: "0 auto 36px", lineHeight: 1.75 }}>Book a 15-minute call and I will send the PDF before we speak. No agenda, no pressure.</p>
      <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer"
        style={{ display: "inline-block", background: C.coral, color: "#fff", fontFamily: FONT, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", padding: "16px 44px", textDecoration: "none", fontWeight: 600, transition: "opacity 0.15s" }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
        Book a Meeting to Download
      </a>
    </div>
  );

  if (!gated) return <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: "64px 48px" }}>{inner}</div>;

  return (
    <div style={{ position: "relative" }}>
      <div style={{ filter: "blur(8px)", pointerEvents: "none", userSelect: "none", opacity: 0.2, background: C.card, border: `1px solid ${C.border}`, padding: "64px 48px" }}>
        <div style={{ height: 14, background: C.dim, borderRadius: 2, width: "55%", margin: "0 auto 14px" }} />
        <div style={{ height: 14, background: C.dim, borderRadius: 2, width: "75%", margin: "0 auto 14px" }} />
        <div style={{ height: 44, background: C.coral, width: 220, margin: "0 auto" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: C.black + "E0", backdropFilter: "blur(4px)", padding: "64px 48px" }}>
        {inner}
        <button onClick={onUngate} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: FONT, fontSize: 10, color: C.muted, letterSpacing: "0.06em", textDecoration: "underline", marginTop: 20 }}>
          View concept without downloading
        </button>
      </div>
    </div>
  );
}

function ConceptView({ data, gated, onUngate, C, isDark }) {
  const { contact, concept, scoring = {}, propertyImages = [] } = data;
  const heroImg = propertyImages[0] || null;
  const breakImg = propertyImages[1] || propertyImages[0] || null;
  const galleryImgs = propertyImages.slice(0, 4);
  const logoSrc = isDark ? "/jmedia-logo.png" : "/jmedia-logo-light.png";
  const logoStyle = isDark
    ? { height: 52, mixBlendMode: "screen" }
    : { height: 52, mixBlendMode: "multiply" };

  const [heroRef, heroStyle] = useFadeUp(0);
  const [statsRef, statsStyle] = useFadeUp(0);
  const [brandRef, brandStyle] = useFadeUp(0);
  const [dirRef, dirStyle] = useFadeUp(0);
  const [delivRef, delivStyle] = useFadeUp(0);
  const [retainerRef, retainerStyle] = useFadeUp(0);
  const [impactRef, impactStyle] = useFadeUp(0);
  const [gateRef, gateStyle] = useFadeUp(0);

  return (
    <div style={{ maxWidth: "100%", overflowX: "hidden", background: C.black }}>

      {/* HERO */}
      <div style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: heroImg ? `url(${heroImg})` : "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.15) saturate(0.3)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${C.black}00 0%, ${C.black}BB 55%, ${C.black} 100%)` }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: C.coral }} />
        <nav style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "28px 48px", borderBottom: `1px solid ${C.border}22` }}>
          <img src={logoSrc} alt="JMEDIA Productions" style={logoStyle} />
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <span style={{ fontFamily: FONT, fontSize: 10, color: C.muted, letterSpacing: "0.1em" }}>Content Concept</span>
            <div style={{ width: 1, height: 14, background: C.border }} />
            <span style={{ fontFamily: FONT, fontSize: 10, color: C.coral, letterSpacing: "0.1em" }}>{contact.company}</span>
          </div>
        </nav>
        <div ref={heroRef} style={{ ...heroStyle, position: "relative", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 48px 100px", maxWidth: 940 }}>
          <div style={{ fontFamily: FONT, fontSize: 10, color: C.coral, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 24, fontWeight: 600 }}>Prepared exclusively for {contact.company}</div>
          <h1 style={{ fontFamily: FONT, fontSize: "clamp(40px, 7vw, 78px)", fontWeight: 700, lineHeight: 1.08, color: C.white, marginBottom: 28, letterSpacing: "-0.02em" }}>{concept.headline}</h1>
          <p style={{ fontSize: 18, color: C.muted, lineHeight: 1.85, maxWidth: 580, fontWeight: 400 }}>{concept.opening}</p>
          <div style={{ position: "absolute", bottom: 36, left: 48, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 28, height: 1, background: C.muted }} />
            <span style={{ fontFamily: FONT, fontSize: 9, color: C.muted, letterSpacing: "0.1em" }}>Scroll to explore</span>
          </div>
        </div>
      </div>

      {/* OTA STATS */}
      <div style={{ background: C.dark, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "80px 48px" }}>
        <div ref={statsRef} style={{ ...statsStyle, maxWidth: 860, margin: "0 auto" }}>
          <div style={{ fontFamily: FONT, fontSize: 10, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", textAlign: "center", marginBottom: 60, fontWeight: 600 }}>Why direct bookings matter</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "40px 24px" }}>
            {OTA_STATS.map((s, i) => <StatCounter key={i} {...s} C={C} />)}
          </div>
          <div style={{ marginTop: 56, padding: "24px 32px", background: C.coral + "0D", border: `1px solid ${C.coralDim}`, borderLeft: `3px solid ${C.coral}`, maxWidth: 680, margin: "56px auto 0" }}>
            <div style={{ fontFamily: FONT, fontSize: 10, color: C.coral, letterSpacing: "0.1em", marginBottom: 8, fontWeight: 600 }}>{contact.company} — {scoring.ota || "Medium"} OTA dependency</div>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, fontWeight: 400 }}>{concept.ota_impact}</p>
          </div>
        </div>
      </div>

      {/* BRAND */}
      <div style={{ padding: "100px 48px", maxWidth: 860, margin: "0 auto" }}>
        <div ref={brandRef} style={brandStyle}>
          <SectionLabel C={C}>What we see in {contact.company}</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginTop: 28 }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: "36px 32px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${C.coral}, transparent)` }} />
              <div style={{ fontFamily: FONT, fontSize: 10, color: C.coral, letterSpacing: "0.1em", marginBottom: 16, fontWeight: 600 }}>Brand identity</div>
              <p style={{ fontSize: 14, color: C.white, lineHeight: 1.9, fontWeight: 400 }}>{contact.jmedia_brand_identity}</p>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: "36px 32px" }}>
              <div style={{ fontFamily: FONT, fontSize: 10, color: C.muted, letterSpacing: "0.1em", marginBottom: 16, fontWeight: 600 }}>Market position</div>
              <p style={{ fontSize: 14, color: C.white, lineHeight: 1.9, fontWeight: 400 }}>{contact.jmedia_key_detail}</p>
            </div>
          </div>
        </div>
      </div>

      {/* PROPERTY IMAGE GALLERY */}
      {galleryImgs.length > 1 && (
        <div style={{ padding: "0 48px 80px", maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: galleryImgs.length >= 3 ? "2fr 1fr 1fr" : "1fr 1fr", gap: 2 }}>
            {galleryImgs.map((img, i) => (
              <div key={i} style={{ aspectRatio: i === 0 ? "16/10" : "4/3", overflow: "hidden", gridRow: i === 0 && galleryImgs.length >= 3 ? "1 / 3" : "auto" }}>
                <img src={img} alt={contact.company} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.85) saturate(0.9)", transition: "transform 0.5s ease", display: "block" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8, fontFamily: FONT, fontSize: 9, color: C.muted, textAlign: "right" }}>Images from {contact.website || contact.company}</div>
        </div>
      )}

      {/* CINEMATIC BREAK */}
      <div style={{ position: "relative", height: 300, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: breakImg ? `url(${breakImg})` : "url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center 40%", filter: "brightness(0.18) saturate(0.4)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${C.black} 0%, transparent 35%, transparent 65%, ${C.black} 100%)` }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontFamily: FONT, fontSize: "clamp(18px, 3vw, 32px)", fontWeight: 300, color: "#F4F2EE", textAlign: "center", maxWidth: 580, lineHeight: 1.5, padding: "0 24px", fontStyle: "italic" }}>"{concept.why_now}"</p>
        </div>
      </div>

      {/* SIGNATURE STORYLINES */}
      <div style={{ padding: "100px 48px", maxWidth: 860, margin: "0 auto" }}>
        <div ref={dirRef} style={dirStyle}>
          <SectionLabel C={C}>Signature Storylines</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 28 }}>
            {concept.content_directions.map((dir, i) => <DirectionCard key={i} index={i + 1} direction={dir} C={C} />)}
          </div>
        </div>
      </div>

      {/* DELIVERABLES */}
      <div style={{ background: C.dark, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "100px 48px" }}>
        <div ref={delivRef} style={{ ...delivStyle, maxWidth: 860, margin: "0 auto" }}>
          <SectionLabel C={C}>Proposed deliverables</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginTop: 28 }}>
            {concept.deliverables.map((d, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, padding: "20px 24px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span style={{ fontFamily: FONT, fontSize: 10, color: C.coral, marginTop: 3, flexShrink: 0, fontWeight: 600 }}>{String(i+1).padStart(2,"0")}</span>
                <span style={{ fontSize: 14, color: C.white, lineHeight: 1.7, fontWeight: 400 }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6-MONTH RETAINER */}
      <div style={{ padding: "100px 48px", maxWidth: 860, margin: "0 auto" }}>
        <div ref={retainerRef} style={retainerStyle}>
          <SectionLabel C={C}>6-month content partnership</SectionLabel>
          {concept.retainer_summary && (
            <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.85, maxWidth: 640, marginTop: 16, marginBottom: 40, fontWeight: 400 }}>{concept.retainer_summary}</p>
          )}
          {concept.retainer_phases ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {concept.retainer_phases.map((phase, i) => <RetainerPhase key={i} phase={phase} index={i} C={C} />)}
            </div>
          ) : concept.timeline && (
            <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: "22px 28px" }}>
              <p style={{ fontSize: 14, color: C.white, lineHeight: 1.7, fontWeight: 400 }}>{concept.timeline}</p>
            </div>
          )}
        </div>
      </div>

      {/* DIRECT BOOKING IMPACT */}
      <div style={{ background: C.dark, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "100px 48px" }}>
        <div ref={impactRef} style={{ ...impactStyle, maxWidth: 860, margin: "0 auto" }}>
          <SectionLabel C={C}>Direct booking impact</SectionLabel>
          <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
            <ImpactCard number="23%" label="Direct booking lift" sub="Average result for hospitality content campaigns in the first 90 days" C={C} />
            <ImpactCard number="4mo" label="Content lifespan" sub="One shoot repurposed across social, email, paid, and web for months" accent C={C} />
            <ImpactCard number="1 tier" label="OTA reduction" sub="Properties with strong brand content consistently lower OTA dependency within one season" C={C} />
          </div>
          <div style={{ marginTop: 2, background: C.card, border: `1px solid ${C.border}`, padding: "32px 36px", display: "flex", gap: 32, alignItems: "center" }}>
            <div style={{ flexShrink: 0, textAlign: "center" }}>
              <div style={{ fontFamily: FONT, fontSize: 10, color: C.coral, letterSpacing: "0.1em", marginBottom: 8, fontWeight: 600 }}>Proven at scale</div>
              <div style={{ fontFamily: FONT, fontSize: 48, fontWeight: 300, color: C.white, lineHeight: 1 }}>1.5M</div>
              <div style={{ fontFamily: FONT, fontSize: 9, color: C.muted, marginTop: 6 }}>views per episode</div>
            </div>
            <div style={{ width: 1, height: 70, background: C.border, flexShrink: 0 }} />
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.85, fontWeight: 400 }}>
              I worked on the Checked In series for Universal Orlando, covering Stella Nova, Terra Luna, and Helios Grand. Each episode averaged 1.5 million views at 69% watch completion. The same approach is what I bring to {contact.company}.
            </p>
          </div>
        </div>
      </div>

      {/* GATE */}
      <div style={{ padding: "80px 48px 120px", maxWidth: 860, margin: "0 auto" }}>
        <div ref={gateRef} style={gateStyle}>
          <GateSection gated={gated} onUngate={onUngate} hotel={contact.company} C={C} />
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "32px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", background: C.black }}>
        <img src={logoSrc} alt="JMEDIA Productions" style={{ height: 32, opacity: 0.7 }} />
        <span style={{ fontFamily: FONT, fontSize: 10, color: C.muted, letterSpacing: "0.06em" }}>Confidential / {contact.company} / {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}

function PrintView({ data }) {
  const { contact, concept } = data;
  const coral = "#E8625A";
  const black = "#111";
  const muted = "#666";
  const border = "#e0e0e0";
  const bg = "#f7f7f7";

  return (
    <div style={{ fontFamily: FONT, background: "#fff", color: black, maxWidth: 780, margin: "0 auto", padding: "32px 40px", fontSize: 11 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 16, borderBottom: `2px solid ${coral}`, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 8, color: coral, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>Prepared exclusively for {contact.company}</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: black, lineHeight: 1.2, margin: 0, maxWidth: 480 }}>{concept.headline}</h1>
          <p style={{ fontSize: 12, color: muted, marginTop: 8, lineHeight: 1.6, maxWidth: 480 }}>{concept.opening}</p>
        </div>
        <img src="/jmedia-logo-light.png" alt="JMEDIA Productions" style={{ height: 36, flexShrink: 0, marginLeft: 24 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        <div style={{ background: bg, border: `1px solid ${border}`, padding: "12px 14px", borderLeft: `3px solid ${coral}` }}>
          <div style={{ fontSize: 8, color: coral, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>Brand Identity</div>
          <p style={{ fontSize: 11, color: black, lineHeight: 1.65, margin: 0 }}>{contact.jmedia_brand_identity}</p>
        </div>
        <div style={{ background: bg, border: `1px solid ${border}`, padding: "12px 14px" }}>
          <div style={{ fontSize: 8, color: muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>Market Position</div>
          <p style={{ fontSize: 11, color: black, lineHeight: 1.65, margin: 0 }}>{contact.jmedia_key_detail}</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
        {[{num:"23%",label:"Avg OTA commission"},{num:"68%",label:"Social research before booking"},{num:"3.2x",label:"Direct guest lifetime value"}].map((s,i)=>(
          <div key={i} style={{ background: bg, border: `1px solid ${border}`, padding: "10px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 300, color: coral, lineHeight: 1 }}>{s.num}</div>
            <div style={{ fontSize: 9, color: muted, marginTop: 4, lineHeight: 1.5 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background: coral + "0D", border: `1px solid ${coral}44`, borderLeft: `3px solid ${coral}`, padding: "10px 14px", marginBottom: 16 }}>
        <div style={{ fontSize: 8, color: coral, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4, fontWeight: 600 }}>Direct Booking Impact</div>
        <p style={{ fontSize: 11, color: black, lineHeight: 1.6, margin: 0 }}>{concept.ota_impact}</p>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 8, color: muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>Signature Storylines</div>
        {concept.content_directions.map((dir, i) => (
          <div key={i} style={{ background: bg, border: `1px solid ${border}`, padding: "10px 14px", marginBottom: 6 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 8, color: coral, fontWeight: 600 }}>{String(i+1).padStart(2,"0")}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: black }}>{dir.name}</span>
            </div>
            <p style={{ fontSize: 11, color: muted, lineHeight: 1.6, margin: "0 0 8px 0" }}>{dir.angle}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {dir.formats.map((f,j) => <span key={j} style={{ fontSize: 8, color: coral, background: coral+"11", border:`1px solid ${coral}33`, padding:"2px 8px" }}>{f}</span>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 8, color: muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>Proposed Deliverables</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {concept.deliverables.map((d,i) => (
            <div key={i} style={{ background: bg, border:`1px solid ${border}`, padding:"8px 12px", display:"flex", gap:10 }}>
              <span style={{ fontSize:8, color:coral, fontWeight:600, flexShrink:0 }}>{String(i+1).padStart(2,"0")}</span>
              <span style={{ fontSize:11, color:black, lineHeight:1.5 }}>{d}</span>
            </div>
          ))}
        </div>
      </div>
      {concept.retainer_phases && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 8, color: muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>6-Month Content Partnership</div>
          {concept.retainer_summary && <p style={{ fontSize: 11, color: muted, lineHeight: 1.65, marginBottom: 10 }}>{concept.retainer_summary}</p>}
          {concept.retainer_phases.map((phase, i) => (
            <div key={i} style={{ background: bg, border:`1px solid ${border}`, padding:"10px 14px", marginBottom:6 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
                <div style={{ flexShrink:0 }}>
                  <div style={{ fontSize:8, color:coral, fontWeight:600 }}>{phase.phase}</div>
                  <div style={{ fontSize:8, color:muted }}>{phase.months}</div>
                </div>
                <div style={{ width:1, height:24, background:border, flexShrink:0 }} />
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:black }}>{phase.storyline}</div>
                  <div style={{ fontSize:10, color:muted }}>{phase.goal}</div>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                <div style={{ background:"#fff", border:`1px solid ${border}`, padding:"8px 10px" }}>
                  <div style={{ fontSize:8, color:coral, textTransform:"uppercase", marginBottom:4, fontWeight:600 }}>Strategic Focus</div>
                  <p style={{ fontSize:10, color:muted, lineHeight:1.6, margin:0 }}>{phase.focus}</p>
                </div>
                <div style={{ background:"#fff", border:`1px solid ${border}`, padding:"8px 10px" }}>
                  <div style={{ fontSize:8, color:muted, textTransform:"uppercase", marginBottom:4, fontWeight:600 }}>Deliverables</div>
                  <p style={{ fontSize:10, color:muted, lineHeight:1.6, margin:0 }}>{phase.output}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ background:bg, border:`1px solid ${border}`, padding:"12px 14px", display:"flex", gap:20, alignItems:"center", marginBottom:16 }}>
        <div style={{ flexShrink:0, textAlign:"center" }}>
          <div style={{ fontSize:8, color:coral, textTransform:"uppercase", marginBottom:4, fontWeight:600 }}>Proven at scale</div>
          <div style={{ fontSize:28, fontWeight:300, color:black, lineHeight:1 }}>1.5M</div>
          <div style={{ fontSize:8, color:muted, marginTop:2 }}>views per episode</div>
        </div>
        <div style={{ width:1, height:48, background:border, flexShrink:0 }} />
        <p style={{ fontSize:11, color:muted, lineHeight:1.7, margin:0 }}>I worked on the Checked In series for Universal Orlando, covering Stella Nova, Terra Luna, and Helios Grand. Each episode averaged 1.5 million views at 69% watch completion. The same approach is what I bring to {contact.company}.</p>
      </div>
      <div style={{ borderTop:`1px solid ${border}`, paddingTop:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <img src="/jmedia-logo-light.png" alt="JMEDIA" style={{ height:24 }} />
        <div style={{ fontSize:9, color:muted }}>Confidential / {contact.company} / {new Date().getFullYear()}</div>
        <div style={{ fontSize:9, color:muted }}>meetings.hubspot.com/officialjordan-roberson2/jmedia-intro</div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(ConceptPage), { ssr: false });
