import { describe, expect, it } from "vitest";

import { buildSitemapXml, FALLBACK_SITE, SITE_ROUTES } from "../pages/sitemap.xml";

describe("sitemap route helpers", () => {
  it("builds sitemap xml with expected structure and routes", () => {
    const xml = buildSitemapXml(new URL("https://rcan.example"));

    expect(xml).toContain("<urlset");
    expect(xml).toContain("https://rcan.example/");
    expect(xml).toContain("https://rcan.example/about");
    expect(xml).toContain("https://rcan.example/contact");
    expect((xml.match(/<loc>/g) ?? []).length).toBe(SITE_ROUTES.length);
  });

  it("exports the expected fallback site", () => {
    expect(FALLBACK_SITE.toString()).toBe("https://rcan.example/");
  });

  it("handles all declared routes with the fallback site", () => {
    const xml = buildSitemapXml(FALLBACK_SITE);

    SITE_ROUTES.forEach((route) => {
      expect(xml).toContain(new URL(route, FALLBACK_SITE).toString());
    });
  });
});
