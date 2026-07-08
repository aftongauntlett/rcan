import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = ["/", "/about", "/how-we-help", "/impact", "/get-involved", "/contact", "/donate"];

const describeViolations = (
  violations: {
    id: string;
    impact?: string | null;
    description: string;
    nodes: { target: unknown[] }[];
  }[],
): string => {
  if (violations.length === 0) {
    return "No blocking accessibility violations found.";
  }

  return violations
    .map((violation) => {
      const targets = violation.nodes
        .map((node) =>
          node.target
            .map((entry) =>
              Array.isArray(entry) ? entry.map((value) => String(value)).join(" ") : String(entry),
            )
            .join(" "),
        )
        .join(" | ");
      return `${violation.id} (${violation.impact ?? "unknown"}): ${violation.description}\nTargets: ${targets}`;
    })
    .join("\n\n");
};

for (const route of routes) {
  test(`axe scan has no serious or critical issues on ${route}`, async ({ page }) => {
    await page.route(/donorbox\.org/, (donorboxRoute) => donorboxRoute.abort());
    await page.goto(route, { waitUntil: "domcontentloaded" });

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    const blockingViolations = results.violations.filter(
      (violation) => violation.impact === "serious" || violation.impact === "critical",
    );

    expect(blockingViolations, describeViolations(blockingViolations)).toEqual([]);
  });
}
