const HS_BASE = "https://api.hubapi.com";
const HS_TOKEN = process.env.HUBSPOT_API_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const hdrs = () => ({ Authorization: "Bearer " + HS_TOKEN, "Content-Type": "application/json" });

async function fetchContact(contactId) {
  const props = [
    "firstname", "lastname", "company", "website",
    "city", "state", "message",
    "jmedia_brand_identity", "jmedia_key_detail", "jmedia_track"
  ].join(",");
  const res = await fetch(
    HS_BASE + "/crm/v3/objects/contacts/" + contactId + "?properties=" + props,
    { headers: hdrs() }
  );
  if (!res.ok) throw new Error("Contact not found");
  const data = await res.json();
  return data.properties;
}

function parseMessage(message) {
  if (!message) return {};
  const result = {};
  const patterns = {
    segment: /Segment:\s*([^|]+)/i,
    ota: /OTA:\s*([^|]+)/i,
    video: /Video:\s*([^|]+)/i,
    emotional: /Emotional:\s*([^|]+)/i,
    luxury: /Luxury:\s*([^|]+)/i,
    ownership: /Ownership:\s*([^|]+)/i,
    pain: /Pain Point:\s*([^|]+)/i,
    peak: /Peak:\s*([^|]+)/i,
  };
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = message.match(pattern);
    if (match) result[key] = match[1].trim();
  }
  return result;
}

async function generateConcept(contact, scoring) {
  const prompt = `You are writing a personalized one-page content concept for JMEDIA Productions, a hospitality content company. The concept is for ${contact.company} in ${contact.city || ""}, ${contact.state || ""}.

Here is what we know about this property:

Brand Identity: ${contact.jmedia_brand_identity || "Not available"}
Key Detail: ${contact.jmedia_key_detail || "Not available"}
OTA Dependency: ${scoring.ota || "Medium"}
Video Score: ${scoring.video || "Unknown"} out of 10
Emotional Score: ${scoring.emotional || "Unknown"} out of 10
Ownership: ${scoring.ownership || "Independent"}
Peak Season: ${scoring.peak || "Unknown"}
Primary Pain Point: ${scoring.pain || "Content gap"}
Website: ${contact.website || "Not available"}

Generate a personalized content concept. Output ONLY valid JSON, no markdown, no backticks, no explanation. Use this exact structure:

{
  "headline": "A short punchy headline specific to this property (not generic)",
  "opening": "One sentence that connects their specific brand to the content opportunity. Natural language, not AI marketing speak.",
  "content_directions": [
    {
      "name": "Direction name (3 to 4 words)",
      "angle": "One sentence describing what this content direction captures about this specific property",
      "formats": ["format 1", "format 2", "format 3"]
    },
    {
      "name": "Direction name",
      "angle": "One sentence",
      "formats": ["format 1", "format 2", "format 3"]
    },
    {
      "name": "Direction name",
      "angle": "One sentence",
      "formats": ["format 1", "format 2", "format 3"]
    }
  ],
  "deliverables": [
    "Specific deliverable 1 tailored to this property",
    "Specific deliverable 2",
    "Specific deliverable 3",
    "Specific deliverable 4",
    "Specific deliverable 5"
  ],
  "timeline": "Proposed timeline for summer production window",
  "ota_impact": "One specific sentence on how this content strategy addresses their OTA dependency level",
  "why_now": "One sentence on timing urgency related to their peak season"
}

Be specific to this property. Do not use filler language. Do not use words like: meticulous, sophisticated, curated, elevated, seamless, bespoke, orchestrated, transformative. Write like a strategist who studied this property, not a copywriter filling a template.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) throw new Error("Claude API error " + res.status);
  const data = await res.json();
  const textBlocks = data.content.filter(b => b.type === "text").map(b => b.text);
  const raw = textBlocks.join("").trim();
  const clean = raw.replace(/```json|```/g, "").trim();
  const match = clean.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Could not parse concept JSON");
  return JSON.parse(match[0]);
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  if (!HS_TOKEN) return res.status(500).json({ error: "HUBSPOT_API_KEY not configured" });
  if (!ANTHROPIC_KEY) return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Contact ID required" });

  try {
    const contact = await fetchContact(id);
    if (contact.jmedia_track !== "track_a") {
      return res.status(403).json({ error: "Not a hospitality contact" });
    }
    const scoring = parseMessage(contact.message);
    const concept = await generateConcept(contact, scoring);
    return res.status(200).json({ contact, scoring, concept });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
