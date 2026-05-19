# Copilot Instructions

Follow these project rules for every task in this repository:

1. Never hardcode colors, spacing, font sizes, border radii, or shadows. Always use Tailwind token classes.
2. Before creating any new component, search src/components/ for an existing component that could be reused or extended. Document why a new component is needed if one is created.
3. All interactive elements must be keyboard navigable and have visible focus indicators that meet WCAG 2.2 AA.
4. All images require descriptive alt text. Decorative images use alt="" and role="presentation".
5. All color pairings must meet WCAG 2.2 AA contrast minimums.
6. Use semantic HTML elements: <nav>, <main>, <article>, <section>, <aside>, <header>, <footer>. Never use a <div> where a semantic element is appropriate.
7. Heading hierarchy must be logical and unbroken (no skipping from h1 to h3).
8. Components should be in src/components/ as .astro files (or .tsx if interactivity requires React). Layouts go in src/layouts/.
9. Write Vitest unit tests for any utility functions or data-transform logic. Component tests are required for interactive components.
10. Every page must score 100 on Lighthouse accessibility, best practices, and SEO. Performance target is 95+.
11. Use astro check and eslint clean runs as gates before considering any task done.
