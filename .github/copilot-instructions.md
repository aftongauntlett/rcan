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
12. All animations and transitions must respect `prefers-reduced-motion`. Any JS-driven animation must check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` before running. Any CSS transition/animation must be wrapped in `@media (prefers-reduced-motion: no-preference)` or reset inside `@media (prefers-reduced-motion: reduce)`.
13. Permitted motion effects: `transition-opacity` for scroll-based reveals, `transition-shadow` and `transition-colors` for hover states. Forbidden: `transform: translate`, slide-in from any direction, parallax, bounce, float, or any motion that shifts layout. Vestibular sensitivity is a real accessibility concern — opacity transitions are safe; movement is not.
14. Scroll-reveal animations must have a no-JS fallback: apply the hidden state via JavaScript (not a Tailwind class in markup) so elements remain visible when JS is disabled or blocked.
