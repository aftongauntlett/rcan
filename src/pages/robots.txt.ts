import type { APIRoute } from "astro";
import { FALLBACK_SITE } from "../data/site";

export const buildRobotsTxt = (baseSite: URL): string => {
  const sitemapUrl = new URL("/sitemap.xml", baseSite).toString();

  return `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`;
};

export const GET: APIRoute = ({ site }) => {
  const baseSite = site ?? FALLBACK_SITE;

  return new Response(buildRobotsTxt(baseSite), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
