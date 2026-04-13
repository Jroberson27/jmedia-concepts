export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { contactId, revenue, otaPct, commission } = req.body;
  if (!contactId) return res.status(400).json({ error: "No contact ID" });

  const HUBSPOT_TOKEN = process.env.HUBSPOT_API_KEY;
  const props = {
    jmedia_roi_revenue: String(revenue),
    jmedia_roi_ota_pct: String(otaPct),
    jmedia_roi_commission: String(commission),
    jmedia_roi_viewed_at: new Date().toISOString(),
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
