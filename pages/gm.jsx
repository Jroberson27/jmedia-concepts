import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const CALENDAR_URL = "https://meetings.hubspot.com/officialjordan-roberson2/jmedia-intro";
const FONT = "'Inter', system-ui, sans-serif";

const DARK = {
  black:"#0A0A0A", dark:"#0F0F0F", card:"#141414", border:"#1E1E1E",
  coral:"#E8625A", coralDim:"#5A1E1A", white:"#F4F2EE", body:"#C8C4BC", muted:"#777777", dim:"#2A2A2A"
};
const LIGHT = {
  black:"#FFFFFF", dark:"#F5F4F1", card:"#FAFAF8", border:"#E2E0D8",
  coral:"#C94B43", coralDim:"#F5D0CE", white:"#111111", body:"#2E2B26", muted:"#888888", dim:"#E8E6E0"
};

function useColorScheme() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    const handler = (e) => setDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return dark ? DARK : LIGHT;
}

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
  const C = useColorScheme();
  return <img src="/jmedia-logo.png" alt="JMEDIA" style={{ height, mixBlendMode:"screen" }} />;
}

function SectionLabel({ children }) {
  const C = useColorScheme();
  return (
    <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:32 }}>
      <div style={{ width:20, height:1, background:C.coral }} />
      <span style={{ fontFamily:FONT, fontSize:13, color:C.muted, letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:600 }}>{children}</span>
    </div>
  );
}

function ROICalculator({ hotel, contactId }) {
  const C = useColorScheme();
  const [adr, setAdr]           = useState(200);
  const [rooms, setRooms]       = useState(80);
  const [occupancy, setOccupancy] = useState(70);
  const [otaPct, setOtaPct]     = useState(40);
  const [commission, setCommission] = useState(23);
  const debounceRef = useRef(null);

  // Derived revenue from GM-native inputs
  // revenue = ADR × rooms × (occupancy/100) × 365
  // OTA pool = revenue × (OTA/100)
  // shift15 = revenue × (OTA/100) × 0.15 × (1 - commission/100)
  // 6-month = shift15 / 2

  // Tier by ADR: under $150 Essential, $150-$300 Signature, over $300 Flagship
  // Retainer = tier floor + room push + OTA push, capped at ceiling
  // Room push: <50 rooms 0%, 50-150 rooms 30% of range, >150 rooms 60% of range
  // OTA push:  <25% 0%, 25-45% 30% of range, >45% 40% of range

  const revenue       = Math.round(adr * rooms * (occupancy / 100) * 365);
  const annualOTAPool = Math.round(revenue * (otaPct / 100));
  const netFactor     = 1 - (commission / 100);
  const shift10       = Math.round(annualOTAPool * 0.10 * netFactor);
  const shift15       = Math.round(annualOTAPool * 0.15 * netFactor);
  const shift20       = Math.round(annualOTAPool * 0.20 * netFactor);
  const shift15_6mo   = Math.round(shift15 / 2);
  const perRoomAnnual = Math.round(shift15 / rooms);
  const perRoom6mo    = Math.round(shift15_6mo / rooms);

  // Pricing logic — verified: 200 rooms $150 ADR 65% occ 35% OTA 22% comm → $5,300 Signature
  let tierLabel, tierFloor, tierCeiling;
  if (adr < 150)       { tierLabel = "Essential"; tierFloor = 2500; tierCeiling = 3500; }
  else if (adr <= 300) { tierLabel = "Signature"; tierFloor = 3500; tierCeiling = 5500; }
  else                 { tierLabel = "Flagship";  tierFloor = 5500; tierCeiling = 8500; }
  const tierRange    = tierCeiling - tierFloor;
  const roomPushPct  = rooms < 50 ? 0 : rooms <= 150 ? 0.30 : 0.60;
  const otaPushPct   = otaPct < 25 ? 0 : otaPct <= 45 ? 0.30 : 0.40;
  const rawRetainer  = tierFloor + Math.round(tierRange * roomPushPct) + Math.round(tierRange * otaPushPct);
  const retainer     = Math.min(tierCeiling, rawRetainer);

  const fmt = (n) => "$" + Math.round(n).toLocaleString();

  const track = (a, r, o, p, c) => {
    if (!contactId) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId, adr: a, rooms: r, occupancy: o, otaPct: p, commission: c }),
      }).catch(() => {});
    }, 2000);
  };

  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, padding:"40px 36px" }}>
      <div style={{ fontSize:12, color:C.coral, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:8, fontWeight:600 }}>ROI Calculator</div>
      <p style={{ fontSize:16, color:C.body, marginBottom:28, lineHeight:1.7 }}>Use the numbers you already know. We will show you what a shift to direct bookings means for {hotel}.</p>

      <div style={{ fontSize:12, color:C.muted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:14 }}>Your property</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:24, marginBottom:20 }}>
        {[
          { label:"Average Daily Rate", value:adr, setter:(v) => { setAdr(v); track(v, rooms, occupancy, otaPct, commission); }, min:50, max:2000, step:10, prefix:"$" },
          { label:"Room Count", value:rooms, setter:(v) => { setRooms(v); track(adr, v, occupancy, otaPct, commission); }, min:10, max:500, step:5, suffix:" rooms" },
          { label:"Occupancy Rate", value:occupancy, setter:(v) => { setOccupancy(v); track(adr, rooms, v, otaPct, commission); }, min:20, max:100, step:1, suffix:"%" },
        ].map((s, i) => (
          <div key={i}>
            <div style={{ fontSize:13, color:C.muted, marginBottom:8, fontWeight:600 }}>{s.label}</div>
            <div style={{ fontSize:24, fontWeight:300, color:C.white, marginBottom:12 }}>
              {s.prefix || ""}{Number(s.value).toLocaleString()}{s.suffix || ""}
            </div>
            <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
              onChange={e => s.setter(Number(e.target.value))}
              style={{ width:"100%", accentColor:C.coral, cursor:"pointer" }} />
          </div>
        ))}
      </div>

      <div style={{ background:C.black, border:`1px solid ${C.border}`, padding:"12px 16px", marginBottom:24, display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ fontSize:12, color:C.muted, letterSpacing:"0.06em", textTransform:"uppercase" }}>Estimated annual room revenue</div>
        <div style={{ fontSize:20, fontWeight:300, color:C.coral }}>{fmt(revenue)}</div>
      </div>

      <div style={{ fontSize:12, color:C.muted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:14 }}>OTA exposure</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, marginBottom:32 }}>
        {[
          { label:"OTA Booking %", value:otaPct, setter:(v) => { setOtaPct(v); track(adr, rooms, occupancy, v, commission); }, min:5, max:80, step:1, suffix:"%" },
          { label:"OTA Commission %", value:commission, setter:(v) => { setCommission(v); track(adr, rooms, occupancy, otaPct, v); }, min:10, max:30, step:1, suffix:"%" },
        ].map((s, i) => (
          <div key={i}>
            <div style={{ fontSize:13, color:C.muted, marginBottom:8, fontWeight:600 }}>{s.label}</div>
            <div style={{ fontSize:24, fontWeight:300, color:C.white, marginBottom:12 }}>
              {s.value}{s.suffix}
            </div>
            <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
              onChange={e => s.setter(Number(e.target.value))}
              style={{ width:"100%", accentColor:C.coral, cursor:"pointer" }} />
          </div>
        ))}
      </div>

      <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:32 }}>
        <div style={{ background:C.black, border:`1px solid ${C.coralDim}`, borderLeft:`3px solid ${C.coral}`, padding:"20px 24px", marginBottom:8 }}>
          <div style={{ fontSize:13, color:C.muted, marginBottom:4, letterSpacing:"0.06em", textTransform:"uppercase" }}>Annual booking revenue flowing through OTAs</div>
          <div style={{ fontSize:40, fontWeight:300, color:C.coral, marginBottom:6 }}>{fmt(annualOTAPool)}</div>
          <div style={{ fontSize:13, color:C.body, lineHeight:1.6 }}>Every booking in this pool is a guest who found {hotel} on Expedia or Booking.com instead of your own site. You paid {commission}% for the privilege.</div>
        </div>

        <div style={{ fontSize:13, color:C.muted, marginBottom:16, marginTop:24, letterSpacing:"0.06em", textTransform:"uppercase" }}>Net revenue recovered by shifting bookings to direct</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:8 }}>
          {[
            { label:"10% shift to direct", saving:shift10, accent:false },
            { label:"15% shift to direct", saving:shift15, accent:true },
            { label:"20% shift to direct", saving:shift20, accent:false },
          ].map((s, i) => (
            <div key={i} style={{ background:s.accent ? C.coral+"15" : C.black, border:`1px solid ${s.accent ? C.coral : C.border}`, padding:"20px 18px", position:"relative" }}>
              {s.accent && <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:C.coral }} />}
              <div style={{ fontSize:13, color:s.accent ? C.coral : C.muted, marginBottom:8, fontWeight:600 }}>{s.label}</div>
              <div style={{ fontSize:28, fontWeight:300, color:s.accent ? C.coral : C.white }}>{fmt(s.saving)}</div>
              <div style={{ fontSize:12, color:C.muted, marginTop:6 }}>net revenue recovered annually</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize:13, color:C.body, marginBottom:16, lineHeight:1.6 }}>
          These figures show the net revenue {hotel} keeps by capturing those bookings directly. The OTA commission that would have been paid is removed. The guest is the same guest. The difference is who captures the margin.
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2, marginBottom:2 }}>
          <div style={{ background:C.black, border:`1px solid ${C.coralDim}`, borderLeft:`3px solid ${C.coral}`, padding:"20px 24px" }}>
            <div style={{ fontSize:13, color:C.muted, marginBottom:8, letterSpacing:"0.06em", textTransform:"uppercase" }}>6-month recovery at 15% shift</div>
            <div style={{ fontSize:32, fontWeight:300, color:C.coral, marginBottom:8 }}>{fmt(shift15_6mo)}</div>
            <div style={{ fontSize:14, color:C.body, lineHeight:1.7 }}>
              These are guests who are already choosing {hotel}. Just finding it through the wrong channel.
            </div>
          </div>
          <div style={{ background:C.black, border:`1px solid ${C.border}`, padding:"20px 24px" }}>
            <div style={{ fontSize:13, color:C.muted, marginBottom:16, letterSpacing:"0.06em", textTransform:"uppercase" }}>Per room — 15% shift</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div>
                <div style={{ fontSize:22, fontWeight:300, color:C.white }}>{fmt(perRoomAnnual)}</div>
                <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>per room annually</div>
              </div>
              <div>
                <div style={{ fontSize:22, fontWeight:300, color:C.white }}>{fmt(perRoom6mo)}</div>
                <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>per room over 6 months</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ background:C.black, border:`1px solid ${C.border}`, padding:"20px 24px", marginTop:2, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
          <div>
            <div style={{ fontSize:13, color:C.muted, marginBottom:4, letterSpacing:"0.06em", textTransform:"uppercase" }}>Recommended engagement</div>
            <div style={{ fontSize:24, fontWeight:300, color:C.coral }}>{fmt(retainer)}<span style={{ fontSize:14, color:C.muted }}> / month</span></div>
          </div>
          <div style={{ background:C.coral+"15", border:`1px solid ${C.coralDim}`, padding:"8px 20px" }}>
            <div style={{ fontSize:13, color:C.coral, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase" }}>{tierLabel}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProofBlock() {
  const C = useColorScheme();
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2 }}>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, padding:"32px 28px", position:"relative" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:C.coral }} />
        <div style={{ fontSize:12, color:C.coral, letterSpacing:"0.1em", marginBottom:20, fontWeight:600 }}>Checked In at Universal Orlando</div>
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:48, fontWeight:300, color:C.white, lineHeight:1, marginBottom:6 }}>1.5M</div>
          <div style={{ fontSize:15, color:C.body }}>views per episode average</div>
        </div>
        <div>
          <div style={{ fontSize:48, fontWeight:300, color:C.white, lineHeight:1, marginBottom:6 }}>69%</div>
          <div style={{ fontSize:15, color:C.body }}>watch completion rate</div>
        </div>
      </div>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, padding:"32px 28px" }}>
        <div style={{ fontSize:12, color:C.muted, letterSpacing:"0.1em", marginBottom:16, fontWeight:600 }}>Industry Validation</div>
        <p style={{ fontSize:16, color:C.white, lineHeight:1.85, marginBottom:20 }}>
          Lowe's Hotels launched a dedicated YouTube channel to syndicate the Checked In series after seeing its direct booking impact on Universal Orlando.
        </p>
        <p style={{ fontSize:15, color:C.body, lineHeight:1.8 }}>
          When a branded hotel group builds a distribution channel around your content model, that is proof of concept at scale. That same approach is what I bring to independent properties.
        </p>
      </div>
    </div>
  );
}

function VideoInfographic() {
  const C = useColorScheme();
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, padding:"40px 36px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:8 }}>
        <div style={{ width:20, height:1, background:C.coral }} />
        <span style={{ fontFamily:FONT, fontSize:13, color:C.muted, letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:600 }}>The data behind the strategy</span>
      </div>
      <h3 style={{ fontFamily:FONT, fontSize:"clamp(20px,2.5vw,26px)", fontWeight:600, color:C.white, marginBottom:8, lineHeight:1.3 }}>
        Video is not the discovery tool. It is the conversion tool.
      </h3>
      <p style={{ fontSize:15, color:C.body, lineHeight:1.8, marginBottom:36, maxWidth:640 }}>
        Guests find properties through OTAs. They choose where to book through trust. Cinematic content is the infrastructure that makes direct worth choosing.
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:2, marginBottom:2 }}>
        {[
          { stat:"26%", label:"of travelers now start their hotel search on Booking.com", sub:"Overtaking Google for the first time. Discovery is happening on OTAs before guests ever find you direct." },
          { stat:"35%", label:"premium guests will pay for a half-star difference in perception", sub:"Trust and content quality directly translate to rate. Perception is not soft. It is revenue." },
          { stat:"64%", label:"of travelers say video helped them choose where to stay", sub:"Video is not a marketing add-on. It is the deciding factor in the final booking choice." },
        ].map((item, i) => (
          <div key={i} style={{ background:C.black, border:`1px solid ${C.border}`, padding:"28px 24px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:C.coral, opacity:0.4 }} />
            <div style={{ fontSize:44, fontWeight:300, color:C.coral, lineHeight:1, marginBottom:10 }}>{item.stat}</div>
            <div style={{ fontSize:14, color:C.white, fontWeight:600, lineHeight:1.4, marginBottom:10 }}>{item.label}</div>
            <div style={{ fontSize:13, color:C.body, lineHeight:1.7 }}>{item.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2, marginBottom:2 }}>
        {[
          { stat:"73%", label:"prefer learning about a property through short-form video", sub:"Not brochures. Not photo galleries. Short-form cinematic content is now the primary trust signal before booking." },
          { stat:"83%", label:"say video content helps them make better booking decisions", sub:"The inspiration phase has moved entirely to visual platforms. TikTok and Instagram are where intent is formed. Not search engines." },
        ].map((item, i) => (
          <div key={i} style={{ background:C.black, border:`1px solid ${C.border}`, padding:"28px 24px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:C.coral, opacity:0.4 }} />
            <div style={{ fontSize:44, fontWeight:300, color:C.coral, lineHeight:1, marginBottom:10 }}>{item.stat}</div>
            <div style={{ fontSize:14, color:C.white, fontWeight:600, lineHeight:1.4, marginBottom:10 }}>{item.label}</div>
            <div style={{ fontSize:13, color:C.body, lineHeight:1.7 }}>{item.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background:C.black, border:`1px solid ${C.border}`, padding:"28px 32px" }}>
        <div style={{ fontSize:12, color:C.coral, letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:600, marginBottom:20 }}>How the mechanism works</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:0, alignItems:"center" }}>
          {[
            { step:"01", label:"Guest discovers property", sub:"OTA or social platform" },
            { step:"02", label:"Lands on hotel site or social", sub:"Actively evaluating" },
            { step:"03", label:"Cinematic content builds trust", sub:"Perceived value increases" },
            { step:"04", label:"Guest books direct", sub:"Bypasses OTA entirely" },
            { step:"05", label:"Hotel captures full revenue", sub:"Zero commission paid" },
          ].map((item, i) => (
            <div key={i} style={{ display:"flex", alignItems:"stretch", flex:1 }}>
              <div style={{ flex:1, padding:"16px 12px", borderLeft:`1px solid ${C.border}`, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, borderRight: i === 4 ? `1px solid ${C.border}` : "none", background: i === 4 ? C.coral + "10" : "transparent" }}>
                <div style={{ fontSize:11, color:C.coral, fontWeight:600, marginBottom:8 }}>{item.step}</div>
                <div style={{ fontSize:13, color:C.white, fontWeight:600, lineHeight:1.4, marginBottom:6 }}>{item.label}</div>
                <div style={{ fontSize:11, color:C.body, lineHeight:1.5 }}>{item.sub}</div>
              </div>
              {i < 4 && <div style={{ width:20, display:"flex", alignItems:"center", justifyContent:"center", color:C.coral, fontSize:14, flexShrink:0 }}>→</div>}
            </div>
          ))}
        </div>
        <div style={{ marginTop:20, paddingTop:20, borderTop:`1px solid ${C.border}` }}>
          <p style={{ fontSize:15, color:C.white, lineHeight:1.8, fontWeight:400 }}>
            Video is not the replacement for OTA dependency. <span style={{ color:C.coral, fontWeight:600 }}>It is the trust infrastructure that makes direct worth choosing.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function ProblemSection({ hotel }) {
  const C = useColorScheme();
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2 }}>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, padding:"40px 36px", borderTop:`2px solid ${C.coral}` }}>
        <div style={{ fontSize:12, color:C.coral, letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:600, marginBottom:20 }}>The reality</div>
        <h3 style={{ fontFamily:FONT, fontSize:"clamp(18px,2vw,24px)", fontWeight:600, color:C.white, lineHeight:1.3, marginBottom:16 }}>
          Guests are already finding {hotel}. The question is what they see when they do.
        </h3>
        <p style={{ fontSize:15, color:C.body, lineHeight:1.85 }}>
          Today a guest discovers your property on Booking.com, compares it on Google, checks your Instagram, and only then decides whether to book direct or return to the OTA. The OTA is not the problem. The gap in your visual story is.
        </p>
      </div>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, padding:"40px 36px" }}>
        <div style={{ fontSize:12, color:C.coral, letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:600, marginBottom:20 }}>What drives the decision</div>
        <p style={{ fontSize:15, color:C.body, lineHeight:1.85, marginBottom:20 }}>
          Price still matters. But trust now plays a bigger role in the final booking decision. Guests are more cautious and more informed than ever. Even a competitive rate loses if the property does not feel worth the risk of booking outside an OTA.
        </p>
        <p style={{ fontSize:15, color:C.body, lineHeight:1.85 }}>
          Trust is built visually. Before a guest ever speaks to your staff, reads a review, or picks up the phone.
        </p>
      </div>
    </div>
  );
}

function MechanismSection() {
  const C = useColorScheme();
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, padding:"40px 36px" }}>
      <div style={{ fontSize:12, color:C.coral, letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:600, marginBottom:12 }}>The missing piece</div>
      <h3 style={{ fontFamily:FONT, fontSize:"clamp(18px,2vw,24px)", fontWeight:600, color:C.white, lineHeight:1.3, marginBottom:12 }}>
        Video is not the replacement for OTA dependency. It is the trust infrastructure that makes direct worth choosing.
      </h3>
      <p style={{ fontSize:15, color:C.body, lineHeight:1.85, marginBottom:36 }}>
        The path to a direct booking is no longer linear. Here is how it actually works and where cinematic content changes the outcome.
      </p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:0, marginBottom:28 }}>
        {[
          { step:"01", label:"Discovery", sub:"Guest finds you on Booking.com, Google, or social media" },
          { step:"02", label:"Evaluation", sub:"They land on your website or Instagram to learn more" },
          { step:"03", label:"Trust signal", sub:"Cinematic content communicates brand quality and perceived value" },
          { step:"04", label:"Conversion", sub:"Guest books direct. Your property feels worth it without the OTA safety net." },
          { step:"05", label:"Full revenue", sub:"You capture the booking without paying OTA commission" },
        ].map((item, i) => (
          <div key={i} style={{ display:"flex", alignItems:"stretch" }}>
            <div style={{ flex:1, padding:"20px 14px", background: i === 4 ? C.coral+"15" : C.black, border:`1px solid ${i === 4 ? C.coralDim : C.border}`, borderRight: i < 4 ? "none" : `1px solid ${i === 4 ? C.coralDim : C.border}` }}>
              <div style={{ fontSize:11, color:C.coral, fontWeight:600, marginBottom:10 }}>{item.step}</div>
              <div style={{ fontSize:13, color:C.white, fontWeight:600, lineHeight:1.4, marginBottom:8 }}>{item.label}</div>
              <div style={{ fontSize:12, color:C.body, lineHeight:1.6 }}>{item.sub}</div>
            </div>
            {i < 4 && <div style={{ width:16, display:"flex", alignItems:"center", justifyContent:"center", color:C.coral, fontSize:12, flexShrink:0 }}>→</div>}
          </div>
        ))}
      </div>
      <div style={{ background:C.black, borderLeft:`3px solid ${C.coral}`, padding:"16px 20px" }}>
        <p style={{ fontSize:15, color:C.body, lineHeight:1.75 }}>
          The inspiration phase has migrated almost entirely to visual platforms. TikTok and Instagram are where booking intent is formed. Not search engines. What your property looks like on those platforms is not a branding decision. <span style={{ color:C.coral, fontWeight:600 }}>It is a revenue decision.</span>
        </p>
      </div>
    </div>
  );
}

function IndependentHotelsSection() {
  const C = useColorScheme();
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2 }}>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, padding:"40px 36px", borderTop:`2px solid ${C.coral}` }}>
        <div style={{ fontSize:12, color:C.coral, letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:600, marginBottom:20 }}>The branded hotel advantage</div>
        <p style={{ fontSize:15, color:C.body, lineHeight:1.85, marginBottom:16 }}>
          Marriott, Hilton, and Hyatt have loyalty programs, global name recognition, and decades of brand equity doing the trust-building before a guest ever sees their content.
        </p>
        <p style={{ fontSize:15, color:C.body, lineHeight:1.85 }}>
          A guest books a Marriott partly because they know what a Marriott feels like. That familiarity is the trust signal. It is built into the brand.
        </p>
      </div>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, padding:"40px 36px" }}>
        <div style={{ fontSize:12, color:C.coral, letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:600, marginBottom:20 }}>Your competitive advantage</div>
        <p style={{ fontSize:15, color:C.body, lineHeight:1.85, marginBottom:16 }}>
          Independent hotels do not have that badge. What they have is character, specificity, and a story that no Marriott can tell. Cinematic content is how an independent property competes on perceived value and wins.
        </p>
        <p style={{ fontSize:15, color:C.white, lineHeight:1.85, fontWeight:500 }}>
          The guest who books your property direct is not settling. They are choosing. Content is what makes that choice feel obvious.
        </p>
      </div>
    </div>
  );
}

function DirectionCard({ index, direction }) {
  const C = useColorScheme();
  const [open, setOpen] = useState(index === 0);
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, overflow:"hidden" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width:"100%", background:"none", border:"none", cursor:"pointer", padding:"20px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", textAlign:"left" }}>
        <div style={{ display:"flex", alignItems:"center", gap:20 }}>
          <span style={{ fontSize:13, color:C.coral, fontWeight:600 }}>{String(index + 1).padStart(2, "0")}</span>
          <span style={{ fontSize:18, fontWeight:600, color:C.white }}>{direction.name}</span>
        </div>
        <span style={{ fontSize:18, color:C.body, transform:open ? "rotate(45deg)" : "rotate(0)", transition:"transform 0.25s ease", lineHeight:1 }}>+</span>
      </button>
      <div style={{ maxHeight:open ? "220px" : "0", overflow:"hidden", transition:"max-height 0.35s ease" }}>
        <div style={{ padding:"0 28px 24px", borderTop:`1px solid ${C.border}` }}>
          <p style={{ fontSize:15, color:C.body, lineHeight:1.8, marginTop:16, marginBottom:14 }}>{direction.angle}</p>
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
  const C = useColorScheme();
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, overflow:"hidden" }}>
      <div style={{ background:`linear-gradient(135deg, ${C.coral}12 0%, transparent 60%)`, padding:"40px 36px", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ fontSize:12, color:C.coral, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:12, fontWeight:600 }}>Client Portal</div>
        <h3 style={{ fontFamily:FONT, fontSize:"clamp(20px,2.5vw,28px)", fontWeight:600, color:C.white, marginBottom:12, lineHeight:1.2 }}>
          You will not just get content. You will get proof it is working.
        </h3>
        <p style={{ fontSize:16, color:C.body, lineHeight:1.8, maxWidth:560 }}>
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
            <p style={{ fontSize:15, color:C.body, lineHeight:1.75 }}>{item.body}</p>
          </div>
        ))}
      </div>
      <div style={{ borderTop:`1px solid ${C.border}`, padding:"20px 36px", display:"flex", alignItems:"center", gap:16 }}>
        <div style={{ width:6, height:6, borderRadius:"50%", background:C.coral, flexShrink:0 }} />
        <p style={{ fontSize:15, color:C.body, lineHeight:1.7 }}>No other video production company in the independent hotel space offers PMS-connected performance tracking. This is the difference between a vendor and a partner.</p>
      </div>
    </div>
  );
}

function GateSection({ gated, onUngate, hotel }) {
  const C = useColorScheme();
  const inner = (
    <div style={{ textAlign:"center" }}>
      <div style={{ fontSize:12, color:C.coral, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:16, fontWeight:600 }}>Ready to see the full breakdown</div>
      <p style={{ fontSize:"clamp(20px,3vw,28px)", fontWeight:300, color:C.white, marginBottom:12 }}>Book a 15-minute call to get the full PDF for {hotel}</p>
      <p style={{ fontSize:15, color:C.body, maxWidth:400, margin:"0 auto 32px", lineHeight:1.75 }}>No agenda. No pressure. I will send the PDF before we speak.</p>
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
  const C = useColorScheme();
  const { contact, concept, propertyImages = [] } = data;
  const heroImg = propertyImages[0] || null;
  const [heroRef, heroStyle] = useFadeUp(0);
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
      {/* 1. HERO */}
      <div style={{ position:"relative", minHeight:"60vh", display:"flex", flexDirection:"column", justifyContent:"center" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:heroImg ? `url(${heroImg})` : "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80')", backgroundSize:"cover", backgroundPosition:"center", filter:"brightness(0.12) saturate(0.3)" }} />
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(180deg, ${C.black}00 0%, ${C.black}CC 60%, ${C.black} 100%)` }} />
        <div ref={heroRef} style={{ ...heroStyle, position:"relative", padding:"80px 48px", maxWidth:860 }}>
          <div style={{ fontFamily:FONT, fontSize:13, color:C.coral, letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:20, fontWeight:600 }}>Prepared exclusively for {contact.company}</div>
          <h1 style={{ fontFamily:FONT, fontSize:"clamp(32px,5vw,60px)", fontWeight:700, lineHeight:1.1, color:C.white, marginBottom:24, letterSpacing:"-0.02em" }}>{concept.headline}</h1>
          <p style={{ fontSize:18, color:C.body, lineHeight:1.85, maxWidth:560, marginBottom:32 }}>{concept.opening}</p>
          {contact.jmedia_outreach_hook && (
            <div style={{ background:C.coral + "12", border:`1px solid ${C.coralDim}`, borderLeft:`3px solid ${C.coral}`, padding:"16px 20px", maxWidth:560 }}>
              <p style={{ fontSize:15, color:C.white, lineHeight:1.75 }}>{contact.jmedia_outreach_hook}</p>
            </div>
          )}
        </div>
      </div>

      {/* 2. THE PROBLEM */}
      <div style={{ padding:"80px 48px", background:C.dark, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <SectionLabel>The real problem</SectionLabel>
          <ProblemSection hotel={contact.company} />
        </div>
      </div>

      {/* 3. THE MECHANISM */}
      <div style={{ padding:"80px 48px" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <SectionLabel>How direct bookings actually happen</SectionLabel>
          <MechanismSection />
        </div>
      </div>

      {/* 4. ROI CALCULATOR */}
      <div style={{ padding:"80px 48px", background:C.dark, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <SectionLabel>The OTA math for {contact.company}</SectionLabel>
          <ROICalculator hotel={contact.company} contactId={contact.hs_object_id} />
        </div>
      </div>

      {/* 5. THE DATA */}
      <div style={{ padding:"80px 48px" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <SectionLabel>This is not aesthetic. This is commercial.</SectionLabel>
          <VideoInfographic />
        </div>
      </div>

      {/* 5. WHAT JMEDIA DELIVERS */}
      <div style={{ padding:"80px 48px" }}>
        <div ref={dirRef} style={{ ...dirStyle, maxWidth:860, margin:"0 auto" }}>
          <SectionLabel>What we produce for {contact.company}</SectionLabel>
          <p style={{ fontSize:16, color:C.body, lineHeight:1.8, maxWidth:600, marginBottom:8 }}>Month-to-month. Specifically. What gets filmed, what gets delivered, where it lives, and how often. Three content directions built for your property.</p>
          <div style={{ fontSize:13, color:C.body, marginBottom:28, lineHeight:1.7 }}>Each direction is a Signature Storyline. A recurring content format designed to build guest trust over time, not just produce one-off assets.</div>
          <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
            {concept.content_directions.map((dir, i) => (
              <DirectionCard key={i} index={i} direction={dir} />
            ))}
          </div>
        </div>
      </div>

      {/* 6. WHY INDEPENDENT HOTELS */}
      <div style={{ padding:"80px 48px", background:C.dark, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <SectionLabel>Why this matters more for independent hotels</SectionLabel>
          <IndependentHotelsSection />
        </div>
      </div>

      {/* 7. CREDIBILITY ANCHOR */}
      <div style={{ padding:"80px 48px" }}>
        <div ref={proofRef} style={{ ...proofStyle, maxWidth:860, margin:"0 auto" }}>
          <SectionLabel>Proven at scale</SectionLabel>
          <ProofBlock />
        </div>
      </div>

      {/* 8. PORTAL */}
      <div style={{ padding:"80px 48px", background:C.dark, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
        <div ref={portalRef} style={{ ...portalStyle, maxWidth:860, margin:"0 auto" }}>
          <SectionLabel>How you track results</SectionLabel>
          <PortalBlock hotel={contact.company} />
        </div>
      </div>

      {/* 9. CTA */}
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
