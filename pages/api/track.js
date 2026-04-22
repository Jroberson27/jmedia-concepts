export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { contactId, revenue, otaPct, commission } = req.body;
  if (!contactId) return res.status(400).json({ error: "No contact ID" });

  const HUBSPOT_TOKEN = process.env.HUBSPOT_API_KEY;

  // Net incremental revenue model
  // Annual OTA pool  = revenue × OTA%
  // Net shift 15     = revenue × OTA% × 15% × (1 - commission%)
  // 6-month          = shift15 / 2
  // Retainer         = (shift15 / 12) × multiplier | floor $2,500 | ceiling $8,500
  const annualOTAPool = Math.round(revenue * (otaPct / 100));
  const netFactor     = 1 - (commission / 100);
  const shift15       = Math.round(revenue * (otaPct / 100) * 0.15 * netFactor);
  const shift15_6mo   = Math.round(shift15 / 2);

  // Verify: $3,250,000 × 19% × 15% × 79% = $73,174 ✓
  // Verify: $3,500,000 × 30% × 15% × 76% = $119,700 ✓
  // Verify: $3,000,000 × 28% × 15% × 80% = $100,800 ✓

  let multiplier;
  if (revenue < 2000000)       multiplier = 0.30;
  else if (revenue < 5000000)  multiplier = 0.35;
  else if (revenue < 10000000) multiplier = 0.40;
  else                         multiplier = 0.45;

  const FLOOR   = 2500;
  const CEILING = 8500;
  const raw = Math.round((shift15 / 12) * multiplier);
  const recommendedRetainer = Math.min(CEILING, Math.max(FLOOR, raw));

  let retainerTier;
  if (recommendedRetainer < 3500)      retainerTier = "Essential";
  else if (recommendedRetainer < 6000) retainerTier = "Signature";
  else                                 retainerTier = "Flagship";

  const props = {
    jmedia_roi_revenue:          String(revenue),
    jmedia_roi_ota_pct:          String(otaPct),
    jmedia_roi_commission:       String(commission),
    jmedia_roi_viewed_at:        new Date().toISOString(),
    jmedia_roi_annual_ota_spend: String(annualOTAPool),
    jmedia_roi_shift_15:         String(shift15),
    jmedia_recommended_retainer: String(recommendedRetainer),
    jmedia_retainer_tier:        retainerTier,
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
