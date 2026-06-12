import type { APIRoute } from "astro";

export const SITE_ROUTES = [
  "/",
  "/about",
  "/how-we-help",
  "/who-we-are",
  "/impact",
  "/get-involved",
  "/contact",
  "/donate",
] as const;

export const FALLBACK_SITE = new URL("https://rcan.example");

export const buildSitemapXml = (baseSite: URL): string => {
  const urls = SITE_ROUTES.map((route) => {
    const loc = new URL(route, baseSite).toString();
    return `  <url>\n    <loc>${loc}</loc>\n  </url>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};

export const GET: APIRoute = ({ site }) => {
  const baseSite = site ?? FALLBACK_SITE;
  const xml = buildSitemapXml(baseSite);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
