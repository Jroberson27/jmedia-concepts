export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { contactId, adr, rooms, occupancy, otaPct, commission } = req.body;
  if (!contactId) return res.status(400).json({ error: "No contact ID" });

  const HUBSPOT_TOKEN = process.env.HUBSPOT_API_KEY;

  // Derived revenue from GM-native inputs
  // revenue = ADR × rooms × (occupancy/100) × 365
  // OTA pool = revenue × (OTA/100)
  // shift15 = OTA pool × 0.15 × (1 - commission/100)
  // 6-month = shift15 / 2

  const revenue       = Math.round(adr * rooms * (occupancy / 100) * 365);
  const annualOTAPool = Math.round(revenue * (otaPct / 100));
  const netFactor     = 1 - (commission / 100);
  const shift15       = Math.round(annualOTAPool * 0.15 * netFactor);
  const shift15_6mo   = Math.round(shift15 / 2);

  // Pricing: ADR sets tier, room count and OTA% tune within range
  // Verified: 200 rooms $150 ADR 65% occ 35% OTA 22% comm → $5,300 Signature
  let tierLabel, tierFloor, tierCeiling;
  if (adr < 150)       { tierLabel = "Essential"; tierFloor = 2500; tierCeiling = 3500; }
  else if (adr <= 300) { tierLabel = "Signature"; tierFloor = 3500; tierCeiling = 5500; }
  else                 { tierLabel = "Flagship";  tierFloor = 5500; tierCeiling = 8500; }

  const tierRange   = tierCeiling - tierFloor;
  const roomPushPct = rooms < 50 ? 0 : rooms <= 150 ? 0.30 : 0.60;
  const otaPushPct  = otaPct < 25 ? 0 : otaPct <= 45 ? 0.30 : 0.40;
  const rawRetainer = tierFloor + Math.round(tierRange * roomPushPct) + Math.round(tierRange * otaPushPct);
  const retainer    = Math.min(tierCeiling, rawRetainer);

  const props = {
    jmedia_roi_adr:              String(adr),
    jmedia_roi_rooms:            String(rooms),
    jmedia_roi_occupancy:        String(occupancy),
    jmedia_roi_ota_pct:          String(otaPct),
    jmedia_roi_commission:       String(commission),
    jmedia_roi_viewed_at:        new Date().toISOString(),
    jmedia_roi_annual_ota_spend: String(annualOTAPool),
    jmedia_roi_shift_15:         String(shift15),
    jmedia_recommended_retainer: String(retainer),
    jmedia_retainer_tier:        tierLabel,
  };

  try {
    const r = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ properties: props }),
    });
    if (!r.ok) throw new Error(`HubSpot error ${r.status}`);
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
