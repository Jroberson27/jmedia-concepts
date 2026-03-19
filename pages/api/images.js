// pages/api/images.js
// Separate endpoint for property images — called client-side after page renders

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { website } = req.query;
  if (!website) return res.status(200).json({ images: [] });

  try {
    let url = website;
    if (!url.startsWith("http")) url = "https://" + url;

    const fetchRes = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; JMEDIA-Bot/1.0)",
        "Accept": "text/html",
      },
      signal: AbortSignal.timeout(7000),
    });

    if (!fetchRes.ok) return res.status(200).json({ images: [] });
    const html = await fetchRes.text();

    const images = new Set();

    // OG images — highest priority
    for (const m of html.matchAll(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/gi)) {
      if (m[1]?.startsWith("http")) images.add(m[1]);
    }
    for (const m of html.matchAll(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/gi)) {
      if (m[1]?.startsWith("http")) images.add(m[1]);
    }

    // Twitter card fallback
    for (const m of html.matchAll(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/gi)) {
      if (m[1]?.startsWith("http")) images.add(m[1]);
    }

    // Hero img tags
    for (const m of html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)) {
      const src = m[1];
      if (!src?.startsWith("http")) continue;
      const lower = src.toLowerCase();
      if (["hero","banner","home","gallery","room","pool","exterior","lobby"].some(k => lower.includes(k))) {
        images.add(src);
      }
    }

    const result = Array.from(images).slice(0, 4);
    res.setHeader("Cache-Control", "s-maxage=86400"); // cache for 24hrs on Vercel edge
    return res.status(200).json({ images: result });
  } catch {
    return res.status(200).json({ images: [] });
  }
}
