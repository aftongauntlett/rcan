import type { APIRoute } from "astro";

const siteRoutes = [
  "/",
  "/about",
  "/how-we-help",
  "/impact",
  "/get-involved",
  "/contact",
  "/donate",
] as const;

const fallbackSite = new URL("https://rcan.example");

export const GET: APIRoute = ({ site }) => {
  const baseSite = site ?? fallbackSite;

  const urls = siteRoutes
    .map((route) => {
      const loc = new URL(route, baseSite).toString();
      return `  <url>\n    <loc>${loc}</loc>\n  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
