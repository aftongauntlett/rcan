import { describe, expect, it } from "vitest";

import { FALLBACK_SITE } from "../data/site";
import { buildRobotsTxt } from "../pages/robots.txt";
import { buildSitemapXml, SITE_ROUTES } from "../pages/sitemap.xml";

describe("sitemap route helpers", () => {
  it("builds sitemap xml with expected structure and routes", () => {
    const xml = buildSitemapXml(new URL("https://rcandc.org"));

    expect(xml).toContain("<urlset");
    expect(xml).toContain("https://rcandc.org/");
    expect(xml).toContain("https://rcandc.org/about");
    expect(xml).toContain("https://rcandc.org/contact");
    expect((xml.match(/<loc>/g) ?? []).length).toBe(SITE_ROUTES.length);
  });

  it("exports the expected fallback site", () => {
    expect(FALLBACK_SITE.toString()).toBe("https://rcandc.org/");
  });

  it("builds robots.txt with an absolute sitemap URL", () => {
    expect(buildRobotsTxt(new URL("https://rcandc.org"))).toBe(
      "User-agent: *\nAllow: /\n\nSitemap: https://rcandc.org/sitemap.xml\n",
    );
  });

  it("handles all declared routes with the fallback site", () => {
    const xml = buildSitemapXml(FALLBACK_SITE);

    SITE_ROUTES.forEach((route) => {
      expect(xml).toContain(new URL(route, FALLBACK_SITE).toString());
    });
  });
});
