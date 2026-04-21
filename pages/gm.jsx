import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const CALENDAR_URL = "https://meetings.hubspot.com/officialjordan-roberson2/jmedia-intro";
const FONT = "'Inter', system-ui, sans-serif";
const C = {
  black:"#0A0A0A", dark:"#0F0F0F", card:"#141414", border:"#1E1E1E",
  coral:"#E8625A", coralDim:"#5A1E1A", white:"#F4F2EE", muted:"#666666", dim:"#2A2A2A"
};

function useFadeUp(delay) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold:0.08 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return [ref, { opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(28px)", transition:`opacity 0.75s ease ${delay||0}ms, transform 0.75s ease ${delay||0}ms` }];
}

function Logo({ height=44 }) {
  return <img src="/jmedia-logo.png" alt="JMEDIA" style={{ height, mixBlendMode:"screen" }} />;
}

function SectionLabel({ children }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:32 }}>
      <div style={{ width:20, height:1, background:C.coral }} />
      <span style={{ fontFamily:FONT, fontSize:13, color:C.muted, letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:600 }}>{children}</span>
    </div>
  );
}

function ROICalculator({ hotel, contactId }) {
  const [revenue, setRevenue] = useState(5000000);
  const [otaPct, setOtaPct] = useState(40);
  const [commission, setCommission] = useState(23);
  const debounceRef = useRef(null);
  const annualOTACost = Math.round(revenue * (otaPct / 100) * (commission / 100));
  const shift10 = Math.round(revenue * (otaPct / 100) * 0.10 * (commission / 100));
  const shift15 = Math.round(revenue * (otaPct / 100) * 0.15 * (commission / 100));
  const shift20 = Math.round(revenue * (otaPct / 100) * 0.20 * (commission / 100));
  const retainerMonthly = 4500;
  const retainerTotal6Mo = retainerMonthly * 6;
  const shift15Over6Mo = Math.round(shift15 / 2);
  const netGain6Mo = shift15Over6Mo - retainerTotal6Mo;
  const fmt = (n) => "$" + n.toLocaleString();

  const track = (r, o, c) => {
    if (!contactId) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId, revenue: r, otaPct: o, commission: c }),
      }).catch(() => {});
    }, 2000);
  };

  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, padding:"40px 36px" }}>
      <div style={{ fontSize:12, color:C.coral, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:8, fontWeight:600 }}>ROI Calculator</div>
      <p style={{ fontSize:16, color:C.muted, marginBottom:32, lineHeight:1.7 }}>Adjust the numbers to see what a shift to direct bookings means for {hotel}.</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:24, marginBottom:40 }}>
        {[
          { label:"Annual Room Revenue", value:revenue, setter:(v) => { setRevenue(v); track(v, otaPct, commission); }, min:500000, max:50000000, step:250000, fmt:true },
          { label:"OTA Booking %", value:otaPct, setter:(v) => { setOtaPct(v); track(revenue, v, commission); }, min:5, max:80, step:1, suffix:"%" },
          { label:"Avg OTA Commission", value:commission, setter:(v) => { setCommission(v); track(revenue, otaPct, v); }, min:15, max:30, step:1, suffix:"%" },
        ].map((s, i) => (
          <div key={i}>
            <div style={{ fontSize:13, color:C.muted, marginBottom:8, fontWeight:600 }}>{s.label}</div>
            <div style={{ fontSize:24, fontWeight:300, color:C.white, marginBottom:12 }}>
              {s.fmt ? "$" + Number(s.value).toLocaleString() : s.value}{s.suffix || ""}
            </div>
            <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
              onChange={e => s.setter(Number(e.target.value))}
              style={{ width:"100%", accentColor:C.coral, cursor:"pointer" }} />
          </div>
        ))}
      </div>
      <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:32 }}>
        <div style={{ background:C.black, border:`1px solid ${C.coralDim}`, borderLeft:`3px solid ${C.coral}`, padding:"20px 24px", marginBottom:28 }}>
          <div style={{ fontSize:14, color:C.muted, marginBottom:6 }}>Annual OTA commission spend</div>
          <div style={{ fontSize:40, fontWeight:300, color:C.coral }}>{fmt(annualOTACost)}</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:20 }}>
          {[
            { label:"10% shift to direct", saving:shift10, accent:false },
            { label:"15% shift to direct", saving:shift15, accent:true },
            { label:"20% shift to direct", saving:shift20, accent:false },
          ].map((s, i) => (
            <div key={i} style={{ background:s.accent ? C.coral+"15" : C.black, border:`1px solid ${s.accent ? C.coral : C.border}`, padding:"20px 18px", position:"relative" }}>
              {s.accent && <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:C.coral }} />}
              <div style={{ fontSize:13, color:s.accent ? C.coral : C.muted, marginBottom:8, fontWeight:600 }}>{s.label}</div>
              <div style={{ fontSize:28, fontWeight:300, color:s.accent ? C.coral : C.white }}>{fmt(s.saving)}</div>
              <div style={{ fontSize:13, color:C.muted, marginTop:6 }}>saved annually</div>
            </div>
          ))}
        </div>
        <div style={{ background:C.black, border:`1px solid ${C.border}`, padding:"16px 20px" }}>
          <div style={{ fontSize:15, color:C.white, lineHeight:1.75 }}>
            At a 15% direct booking shift, {hotel} would recover <span style={{ color:C.coral, fontWeight:600 }}>{fmt(shift15Over6Mo)}</span> in OTA commissions over the first 6 months alone.
          </div>
        </div>
      </div>
    </div>
  );
}

function ProofBlock() {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2 }}>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, padding:"32px 28px", position:"relative" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:C.coral }} />
        <div style={{ fontSize:12, color:C.coral, letterSpacing:"0.1em", marginBottom:20, fontWeight:600 }}>Checked In — Universal Orlando</div>
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:48, fontWeight:300, color:C.white, lineHeight:1, marginBottom:6 }}>1.5M</div>
          <div style={{ fontSize:15, color:C.muted }}>views per episode average</div>
        </div>
        <div>
          <div style={{ fontSize:48, fontWeight:300, color:C.white, lineHeight:1, marginBottom:6 }}>69%</div>
          <div style={{ fontSize:15, color:C.muted }}>watch completion rate</div>
        </div>
      </div>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, padding:"32px 28px" }}>
        <div style={{ fontSize:12, color:C.muted, letterSpacing:"0.1em", marginBottom:16, fontWeight:600 }}>Industry Validation</div>
        <p style={{ fontSize:16, color:C.white, lineHeight:1.85, marginBottom:20 }}>
          Lowe's Hotels launched a dedicated YouTube channel to syndicate the Checked In series after seeing its direct booking impact on Universal Orlando.
        </p>
        <p style={{ fontSize:15, color:C.muted, lineHeight:1.8 }}>
          When a branded hotel group builds a distribution channel around your content model, that is proof of concept at scale. That same approach is what I bring to independent properties.
        </p>
      </div>
    </div>
  );
}

function DirectionCard({ index, direction }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, overflow:"hidden" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width:"100%", background:"none", border:"none", cursor:"pointer", padding:"20px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", textAlign:"left" }}>
        <div style={{ display:"flex", alignItems:"center", gap:20 }}>
          <span style={{ fontSize:13, color:C.coral, fontWeight:600 }}>{String(index + 1).padStart(2, "0")}</span>
          <span style={{ fontSize:18, fontWeight:600, color:C.white }}>{direction.name}</span>
        </div>
        <span style={{ fontSize:18, color:C.muted, transform:open ? "rotate(45deg)" : "rotate(0)", transition:"transform 0.25s ease", lineHeight:1 }}>+</span>
      </button>
      <div style={{ maxHeight:open ? "220px" : "0", overflow:"hidden", transition:"max-height 0.35s ease" }}>
        <div style={{ padding:"0 28px 24px", borderTop:`1px solid ${C.border}` }}>
          <p style={{ fontSize:15, color:C.muted, lineHeight:1.8, marginTop:16, marginBottom:14 }}>{direction.angle}</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {direction.formats.map((f, j) => (
              <span key={j} style={{ fontSize:9, color:C.coral, background:C.coral + "11", border:`1px solid ${C.coralDim}`, padding:"4px 10px" }}>{f}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PortalBlock({ hotel }) {
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, overflow:"hidden" }}>
      <div style={{ background:`linear-gradient(135deg, ${C.coral}12 0%, transparent 60%)`, padding:"40px 36px", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ fontSize:12, color:C.coral, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:12, fontWeight:600 }}>Client Portal</div>
        <h3 style={{ fontFamily:FONT, fontSize:"clamp(20px,2.5vw,28px)", fontWeight:600, color:C.white, marginBottom:12, lineHeight:1.2 }}>
          You will not just get content. You will get proof it is working.
        </h3>
        <p style={{ fontSize:16, color:C.muted, lineHeight:1.8, maxWidth:560 }}>
          Every JMEDIA partnership includes access to a dedicated client portal that connects directly to your property management system and tracks direct booking impact over the life of our engagement.
        </p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr" }}>
        {[
          { num:"01", title:"PMS Integration", body:"The portal connects to your property management system via OAuth. Cloudbeds, Opera, Synxis, and other major platforms are supported. No manual data entry." },
          { num:"02", title:"Direct Booking Tracking", body:"See direct booking percentage, ADR, and OTA dependency updated alongside your content calendar. One dashboard tying content output to revenue outcomes." },
          { num:"03", title:"Monthly Reporting", body:"Every month you get a performance summary showing what shipped, what performed, and what the numbers look like. You own the data and the decisions." },
        ].map((item, i) => (
          <div key={i} style={{ padding:"28px 24px", borderRight: i < 2 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ fontSize:13, color:C.coral, fontWeight:600, marginBottom:12 }}>{item.num}</div>
            <div style={{ fontSize:17, fontWeight:600, color:C.white, marginBottom:10 }}>{item.title}</div>
            <p style={{ fontSize:15, color:C.muted, lineHeight:1.75 }}>{item.body}</p>
          </div>
        ))}
      </div>
      <div style={{ borderTop:`1px solid ${C.border}`, padding:"20px 36px", display:"flex", alignItems:"center", gap:16 }}>
        <div style={{ width:6, height:6, borderRadius:"50%", background:C.coral, flexShrink:0 }} />
        <p style={{ fontSize:15, color:C.muted, lineHeight:1.7 }}>No other video production company in the independent hotel space offers PMS-connected performance tracking. This is the difference between a vendor and a partner.</p>
      </div>
    </div>
  );
}

function GateSection({ gated, onUngate, hotel }) {
  const inner = (
    <div style={{ textAlign:"center" }}>
      <div style={{ fontSize:12, color:C.coral, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:16, fontWeight:600 }}>Ready to see the full breakdown</div>
      <p style={{ fontSize:"clamp(20px,3vw,28px)", fontWeight:300, color:C.white, marginBottom:12 }}>Book a 15-minute call to get the full PDF for {hotel}</p>
      <p style={{ fontSize:15, color:C.muted, maxWidth:400, margin:"0 auto 32px", lineHeight:1.75 }}>No agenda. No pressure. I will send the PDF before we speak.</p>
      <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer"
        style={{ display:"inline-block", background:C.coral, color:"#fff", fontFamily:FONT, fontSize:13, letterSpacing:"0.12em", textTransform:"uppercase", padding:"16px 44px", textDecoration:"none", fontWeight:600 }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
        Book a Meeting to Download
      </a>
    </div>
  );
  if (!gated) return <div style={{ background:C.card, border:`1px solid ${C.border}`, padding:"64px 48px" }}>{inner}</div>;
  return (
    <div style={{ position:"relative" }}>
      <div style={{ filter:"blur(8px)", pointerEvents:"none", userSelect:"none", opacity:0.2, background:C.card, border:`1px solid ${C.border}`, padding:"64px 48px" }}>
        <div style={{ height:14, background:C.dim, borderRadius:2, width:"55%", margin:"0 auto 14px" }} />
        <div style={{ height:44, background:C.coral, width:220, margin:"0 auto" }} />
      </div>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:C.black + "E0", backdropFilter:"blur(4px)", padding:"64px 48px" }}>
        {inner}
        <button onClick={onUngate} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:FONT, fontSize:13, color:C.muted, textDecoration:"underline", marginTop:20 }}>
          View without downloading
        </button>
      </div>
    </div>
  );
}

function GMView({ data, gated, onUngate }) {
  const { contact, concept, propertyImages = [] } = data;
  const heroImg = propertyImages[0] || null;
  const [heroRef, heroStyle] = useFadeUp(0);
  const [calcRef, calcStyle] = useFadeUp(0);
  const [proofRef, proofStyle] = useFadeUp(0);
  const [dirRef, dirStyle] = useFadeUp(0);
  const [portalRef, portalStyle] = useFadeUp(0);
  const [gateRef, gateStyle] = useFadeUp(0);

  return (
    <div style={{ maxWidth:"100%", overflowX:"hidden", background:C.black }}>
      <div style={{ position:"fixed", top:0, left:0, right:0, height:2, background:C.coral, zIndex:100 }} />
      <nav style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 48px", borderBottom:`1px solid ${C.border}`, background:C.black }}>
        <Logo height={48} />
        <div style={{ display:"flex", gap:20, alignItems:"center" }}>
          <span style={{ fontFamily:FONT, fontSize:12, color:C.muted, letterSpacing:"0.1em" }}>General Manager Briefing</span>
          <div style={{ width:1, height:14, background:C.border }} />
          <span style={{ fontFamily:FONT, fontSize:12, color:C.coral, letterSpacing:"0.1em" }}>{contact.company}</span>
        </div>
      </nav>
      <div style={{ position:"relative", minHeight:"60vh", display:"flex", flexDirection:"column", justifyContent:"center" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:heroImg ? `url(${heroImg})` : "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80')", backgroundSize:"cover", backgroundPosition:"center", filter:"brightness(0.12) saturate(0.3)" }} />
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(180deg, ${C.black}00 0%, ${C.black}CC 60%, ${C.black} 100%)` }} />
        <div ref={heroRef} style={{ ...heroStyle, position:"relative", padding:"80px 48px", maxWidth:860 }}>
          <div style={{ fontFamily:FONT, fontSize:13, color:C.coral, letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:20, fontWeight:600 }}>Prepared exclusively for {contact.company}</div>
          <h1 style={{ fontFamily:FONT, fontSize:"clamp(32px,5vw,60px)", fontWeight:700, lineHeight:1.1, color:C.white, marginBottom:24, letterSpacing:"-0.02em" }}>{concept.headline}</h1>
          <p style={{ fontSize:18, color:C.muted, lineHeight:1.85, maxWidth:560, marginBottom:32 }}>{concept.opening}</p>
          {contact.jmedia_outreach_hook && (
            <div style={{ background:C.coral + "12", border:`1px solid ${C.coralDim}`, borderLeft:`3px solid ${C.coral}`, padding:"16px 20px", maxWidth:560 }}>
              <p style={{ fontSize:15, color:C.white, lineHeight:1.75 }}>{contact.jmedia_outreach_hook}</p>
            </div>
          )}
        </div>
      </div>
      <div style={{ padding:"80px 48px", background:C.dark, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
        <div ref={calcRef} style={{ ...calcStyle, maxWidth:860, margin:"0 auto" }}>
          <SectionLabel>The OTA Math for {contact.company}</SectionLabel>
          <ROICalculator hotel={contact.company} contactId={contact.hs_object_id} />
        </div>
      </div>
      <div style={{ padding:"80px 48px" }}>
        <div ref={proofRef} style={{ ...proofStyle, maxWidth:860, margin:"0 auto" }}>
          <SectionLabel>Proven at scale</SectionLabel>
          <ProofBlock />
        </div>
      </div>
      <div style={{ padding:"80px 48px", background:C.dark, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
        <div ref={dirRef} style={{ ...dirStyle, maxWidth:860, margin:"0 auto" }}>
          <SectionLabel>What this looks like for {contact.company}</SectionLabel>
          <p style={{ fontSize:16, color:C.muted, lineHeight:1.8, maxWidth:600, marginBottom:28 }}>Three content directions specific to your property, each designed to move guests from discovery to direct booking.</p>
          <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
            {concept.content_directions.map((dir, i) => (
              <DirectionCard key={i} index={i} direction={dir} />
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding:"80px 48px" }}>
        <div ref={portalRef} style={{ ...portalStyle, maxWidth:860, margin:"0 auto" }}>
          <SectionLabel>How you track results</SectionLabel>
          <PortalBlock hotel={contact.company} />
        </div>
      </div>
      <div style={{ padding:"0 48px 100px" }}>
        <div ref={gateRef} style={{ ...gateStyle, maxWidth:860, margin:"0 auto" }}>
          <GateSection gated={gated} onUngate={onUngate} hotel={contact.company} />
        </div>
      </div>
      <footer style={{ borderTop:`1px solid ${C.border}`, padding:"24px 48px", display:"flex", justifyContent:"space-between", alignItems:"center", background:C.black }}>
        <Logo height={28} />
        <span style={{ fontFamily:FONT, fontSize:13, color:C.muted }}>{contact.company} / {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}

function GMPage() {
  const [state, setState] = useState("loading");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [gated, setGated] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isPreview = params.get("preview") === "true";
    const id = params.get("id");
    if (!isPreview) {
      const onContextMenu = (e) => e.preventDefault();
      const onKeyDown = (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "p") {
          e.preventDefault();
          alert("To download this concept, please book a meeting using the button below.");
        }
      };
      document.addEventListener("contextmenu", onContextMenu);
      document.addEventListener("keydown", onKeyDown);
    }
    if (!id) { setError("No contact ID in URL."); setState("error"); return; }
    fetch("/api/concept?id=" + id)
      .then(r => r.json())
      .then(d => {
        if (d.error) throw new Error(d.error);
        setData(d);
        setState("ready");
        if (d.contact && d.contact.website) {
          fetch("/api/images?website=" + encodeURIComponent(d.contact.website))
            .then(r => r.json())
            .then(img => { if (img.images && img.images.length) setData(prev => ({ ...prev, propertyImages: img.images })); })
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
        html, body { background: #0A0A0A; color: #F4F2EE; font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
        ::selection { background: #E8625A; color: #fff; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #0A0A0A; }
        ::-webkit-scrollbar-thumb { background: #2A2A2A; }
        @keyframes pulse { 0%,100%{opacity:.3} 50%{opacity:1} }
      `}</style>
      {state === "loading" && (
        <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:32, background:"#0A0A0A" }}>
          <Logo height={48} />
          <div style={{ display:"flex", gap:8 }}>
            {[0,1,2].map(i => <div key={i} style={{ width:5, height:5, borderRadius:"50%", background:"#E8625A", animation:`pulse 1.2s ease ${i*0.2}s infinite` }} />)}
          </div>
          <p style={{ fontFamily:"'Inter', system-ui, sans-serif", fontSize:14, color:"#666666", letterSpacing:"0.12em" }}>Building your revenue briefing</p>
        </div>
      )}
      {state === "error" && (
        <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:20, padding:"0 24px", textAlign:"center" }}>
          <Logo height={44} />
          <p style={{ color:"#666666", fontSize:14 }}>{error || "Something went wrong."}</p>
        </div>
      )}
      {state === "ready" && data && (
        <GMView data={data} gated={gated} onUngate={() => setGated(false)} />
      )}
    </>
  );
}

export default dynamic(() => Promise.resolve(GMPage), { ssr: false });
