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

// Fetch images from the hotel's own website using OG/meta tags and img scraping
async function fetchPropertyImages(websiteUrl) {
  if (!websiteUrl) return [];

  try {
    // Ensure URL has protocol
    let url = websiteUrl;
    if (!url.startsWith("http")) url = "https://" + url;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; JMEDIA-Bot/1.0)",
        "Accept": "text/html",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return [];
    const html = await res.text();

    const images = new Set();

    // Extract OG images (highest priority — these are the property's hero shots)
    const ogMatches = html.matchAll(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/gi);
    for (const m of ogMatches) {
      if (m[1] && m[1].startsWith("http")) images.add(m[1]);
    }

    // Also check content-first OG format
    const ogMatches2 = html.matchAll(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/gi);
    for (const m of ogMatches2) {
      if (m[1] && m[1].startsWith("http")) images.add(m[1]);
    }

    // Twitter card images as fallback
    const twitterMatches = html.matchAll(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/gi);
    for (const m of twitterMatches) {
      if (m[1] && m[1].startsWith("http")) images.add(m[1]);
    }

    // Large img tags as additional fallback (filter for likely hero images)
    const imgMatches = html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi);
    for (const m of imgMatches) {
      const src = m[1];
      if (!src || !src.startsWith("http")) continue;
      // Only include images that look like hero/lifestyle shots
      const lower = src.toLowerCase();
      if (
        lower.includes("hero") ||
        lower.includes("banner") ||
        lower.includes("home") ||
        lower.includes("gallery") ||
        lower.includes("room") ||
        lower.includes("pool") ||
        lower.includes("exterior") ||
        lower.includes("lobby")
      ) {
        images.add(src);
      }
    }

    // Return up to 4 unique images
    return Array.from(images).slice(0, 4);
  } catch {
    return [];
  }
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

    // Fetch property images and concept in parallel for speed
    const [propertyImages, conceptResult] = await Promise.all([
      fetchPropertyImages(contact.website),
      (async () => {
        if (contact.jmedia_concept) {
          try {
            const parsed = JSON.parse(contact.jmedia_concept);
            // If stored concept missing retainer_phases, regenerate live
            if (!parsed.retainer_phases) {
              if (!ANTHROPIC_KEY) throw new Error("ANTHROPIC_API_KEY not configured");
              return await generateConceptLive(contact, scoring);
            }
            return parsed;
          } catch {
            if (!ANTHROPIC_KEY) throw new Error("ANTHROPIC_API_KEY not configured");
            return await generateConceptLive(contact, scoring);
          }
        } else {
          if (!ANTHROPIC_KEY) throw new Error("ANTHROPIC_API_KEY not configured and no cached concept found");
          return await generateConceptLive(contact, scoring);
        }
      })(),
    ]);

    return res.status(200).json({
      contact,
      scoring,
      concept: conceptResult,
      propertyImages,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
