const HS_BASE = "https://api.hubapi.com";
const HS_TOKEN = process.env.HUBSPOT_API_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const hdrs = () => ({ Authorization: "Bearer " + HS_TOKEN, "Content-Type": "application/json" });

function parseMessage(message) {
  if (!message) return {};
  const result = {};
  const patterns = {
    ota:       /OTA:\s*([^|]+)/i,
    video:     /Video:\s*([^|]+)/i,
    emotional: /Emotional:\s*([^|]+)/i,
    ownership: /Ownership:\s*([^|]+)/i,
    pain:      /Pain Point:\s*([^|]+)/i,
    peak:      /Peak:\s*([^|]+)/i,
  };
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = message.match(pattern);
    if (match) result[key] = match[1].trim();
  }
  return result;
}

async function fetchContact(contactId) {
  const props = [
    "firstname", "lastname", "company", "website", "city", "state",
    "message", "jmedia_track", "jmedia_brand_identity", "jmedia_key_detail",
    "jmedia_concept",
  ].join(",");
  const res = await fetch(
    `${HS_BASE}/crm/v3/objects/contacts/${contactId}?properties=${props}`,
    { headers: hdrs() }
  );
  if (!res.ok) throw new Error("Contact not found");
  const data = await res.json();
  return data.properties;
}

async function generateConceptLive(contact, scoring) {
  const prompt = `You are writing a personalized one-page content concept for JMEDIA Productions, a hospitality content company targeting a 6-month content partnership. The concept is for ${contact.company} in ${contact.city || ""}, ${contact.state || ""}.

Brand Identity: ${contact.jmedia_brand_identity || "Not available"}
Key Detail: ${contact.jmedia_key_detail || "Not available"}
OTA Dependency: ${scoring.ota || "Medium"}
Video Score: ${scoring.video || "Unknown"} out of 10
Emotional Score: ${scoring.emotional || "Unknown"} out of 10
Ownership: ${scoring.ownership || "Independent"}
Peak Season: ${scoring.peak || "Unknown"}
Pain Point: ${scoring.pain || "Content gap"}

Output ONLY valid JSON, no markdown, no backticks:
{
  "headline": "Short punchy headline under 10 words",
  "opening": "One natural sentence connecting their specific brand to the content opportunity",
  "content_directions": [
    {"name": "3 to 4 word name", "angle": "One sentence specific to this property", "formats": ["format 1", "format 2", "format 3"]},
    {"name": "3 to 4 word name", "angle": "One sentence", "formats": ["format 1", "format 2", "format 3"]},
    {"name": "3 to 4 word name", "angle": "One sentence", "formats": ["format 1", "format 2", "format 3"]}
  ],
  "deliverables": ["deliverable 1", "deliverable 2", "deliverable 3", "deliverable 4", "deliverable 5"],
  "retainer_phases": [
    {
      "phase": "Phase 1",
      "months": "Months 1 and 2",
      "storyline": "Name of the first Signature Storyline being executed",
      "focus": "One sentence on what gets produced and why this comes first strategically",
      "output": "2 to 3 specific deliverables produced in this phase",
      "goal": "The specific booking or brand goal this phase drives toward"
    },
    {
      "phase": "Phase 2",
      "months": "Months 3 and 4",
      "storyline": "Name of the second Signature Storyline",
      "focus": "One sentence on what gets produced and why this phase builds on Phase 1",
      "output": "2 to 3 specific deliverables",
      "goal": "The specific booking or brand goal this phase drives toward"
    },
    {
      "phase": "Phase 3",
      "months": "Months 5 and 6",
      "storyline": "Name of the third Signature Storyline",
      "focus": "One sentence on what gets produced and why this phase completes the strategy",
      "output": "2 to 3 specific deliverables",
      "goal": "The specific booking or brand goal this phase drives toward"
    }
  ],
  "retainer_summary": "Two sentences on why a 6-month partnership gives this property compounding content advantage. Natural language, not AI speak.",
  "ota_impact": "One sentence on how this 6-month strategy specifically addresses their OTA dependency level",
  "why_now": "One sentence on timing urgency tied to their peak season"
}

Be specific to this property. Each phase should flow logically from the last. Sound like a strategist who studied this property.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) throw new Error("Claude API error " + res.status);
  const data = await res.json();
  const text = data.content.filter(b => b.type === "text").map(b => b.text).join("").trim();
  const clean = text.replace(/```json|```/g, "").trim();
  const match = clean.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Could not parse concept JSON");
  return JSON.parse(match[0]);
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  if (!HS_TOKEN) return res.status(500).json({ error: "HUBSPOT_API_KEY not configured" });

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Contact ID required" });

  try {
    const contact = await fetchContact(id);
    if (contact.jmedia_track !== "track_a") {
      return res.status(403).json({ error: "Not a hospitality contact" });
    }

    const scoring = parseMessage(contact.message);

    // Use pre-generated concept if available — fallback to live generation
    let concept;
    if (contact.jmedia_concept) {
      try {
        const parsed = JSON.parse(contact.jmedia_concept);
        if (!parsed.retainer_phases) {
          if (!ANTHROPIC_KEY) throw new Error("ANTHROPIC_API_KEY not configured");
          concept = await generateConceptLive(contact, scoring);
        } else {
          concept = parsed;
        }
      } catch {
        concept = await generateConceptLive(contact, scoring);
      }
    } else {
      if (!ANTHROPIC_KEY) throw new Error("ANTHROPIC_API_KEY not configured and no cached concept found");
      concept = await generateConceptLive(contact, scoring);
    }

    // No image fetching here — images load separately client-side for instant page render
    return res.status(200).json({ contact, scoring, concept });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
