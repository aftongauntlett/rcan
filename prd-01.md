# rcan

You are setting up a new Astro project for a nonprofit static website.

## Project overview

This is a standalone site for RCAN (Returning Citizens Assistance Network), a Washington DC network of congregations that assists people re-entering society from the criminal justice system. The site is informational and mission-driven. Content will be provided incrementally — build the foundation first.

---

## Step 1: Project setup

Initialize an Astro project with the following configuration:

- TypeScript in strict mode
- Tailwind CSS v4 with a custom design token system (no hardcoded colors, spacing, font sizes, or radii anywhere in the codebase — all values must reference tokens)
- ESLint with @typescript-eslint and eslint-plugin-jsx-a11y
- Vitest for unit tests
- Prettier

Install and configure:

- `astro check` for type checking (add as a pre-build step in package.json)
- `eslint-plugin-jsx-a11y` for accessibility linting
- `@tailwindcss/typography` for prose content

---

## Step 2: Design token system

In `tailwind.config.ts`, define a complete token system under `theme.extend`. Do not use hardcoded values anywhere outside this file. Include:

**Colors** — define a semantic palette:

- `color.brand.primary`, `color.brand.secondary`, `color.brand.accent`
- `color.neutral.*` (50–900 scale)
- `color.surface.default`, `color.surface.subtle`, `color.surface.invert`
- `color.text.default`, `color.text.subtle`, `color.text.invert`, `color.text.link`
- `color.border.default`, `color.border.strong`
- `color.status.success`, `color.status.warning`, `color.status.error`

All colors must meet WCAG 2.2 AA contrast ratio minimums (4.5:1 for normal text, 3:1 for large text and UI components). Provide AAA where feasible.

**Typography**:

- `font.sans`, `font.serif`, `font.mono`
- `text.*` scale: xs through 4xl with defined line-height and letter-spacing per step

**Spacing**: use a 4px base grid (`spacing.1` = 4px through `spacing.32` = 128px)

**Radii**: `radius.sm`, `radius.md`, `radius.lg`, `radius.full`

**Shadows**: `shadow.sm`, `shadow.md`, `shadow.lg`

**Motion**: `transition.fast` (150ms), `transition.base` (250ms), `transition.slow` (400ms) — respect `prefers-reduced-motion` globally

---

## Step 3: Copilot instructions

Create `.github/copilot-instructions.md` with the following rules (write them as instructions Copilot must follow):

1. Never hardcode colors, spacing, font sizes, border radii, or shadows. Always use Tailwind token classes.
2. Before creating any new component, search `src/components/` for an existing component that could be reused or extended. Document why a new component is needed if one is created.
3. All interactive elements must be keyboard navigable and have visible focus indicators that meet WCAG 2.2 AA.
4. All images require descriptive `alt` text. Decorative images use `alt=""` and `role="presentation"`.
5. All color pairings must meet WCAG 2.2 AA contrast minimums.
6. Use semantic HTML elements: `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<header>`, `<footer>`. Never use a `<div>` where a semantic element is appropriate.
7. Heading hierarchy must be logical and unbroken (no skipping from h1 to h3).
8. Components should be in `src/components/` as `.astro` files (or `.tsx` if interactivity requires React). Layouts go in `src/layouts/`.
9. Write Vitest unit tests for any utility functions or data-transform logic. Component tests are required for interactive components.
10. Every page must score 100 on Lighthouse accessibility, best practices, and SEO. Performance target is 95+.
11. Use `astro check` and `eslint` clean runs as gates before considering any task done.

---

## Step 4: Base component library

Create the following base components in `src/components/`. Each must be typed, use only token classes, and include ARIA attributes where relevant:

- `Button.astro` — variants: `primary`, `secondary`, `ghost`; sizes: `sm`, `md`, `lg`; supports `href` (renders as `<a>`) or `type` (renders as `<button>`)
- `Card.astro` — generic content card with optional header, body, footer slots
- `Badge.astro` — small label/tag with color variant prop
- `Icon.astro` — thin wrapper for inline SVG icons with `aria-hidden` by default, `aria-label` prop for meaningful icons
- `Link.astro` — styled anchor that handles internal vs external links (adds `rel="noopener noreferrer"` and optional external indicator for external URLs)
- `SectionHeader.astro` — eyebrow text + heading + optional subheading, accepts `level` prop for heading tag (h1–h4)
- `SkipLink.astro` — visually hidden skip-to-main-content link, visible on focus

---

## Step 5: Layouts

Create:

- `src/layouts/BaseLayout.astro` — `<html>`, `<head>` with meta/og tags, `<SkipLink>`, `<Header>`, `<main>`, `<Footer>`; accepts `title`, `description`, `ogImage` props
- `src/layouts/ContentLayout.astro` — extends BaseLayout, adds a centered prose container with `@tailwindcss/typography` applied

---

## Step 6: Page stubs

Create stub pages:

- `src/pages/index.astro` — homepage
- `src/pages/about.astro`
- `src/pages/how-we-help.astro`
- `src/pages/get-involved.astro`
- `src/pages/donate.astro`
- `src/pages/contact.astro`

Each page should use `BaseLayout`, include a unique `<title>` and `<meta name="description">`, and render a `<SectionHeader>` as a placeholder.

---

## Step 7: Global styles

In `src/styles/global.css`:

- Set `box-sizing: border-box` globally
- Set a `:focus-visible` outline style using brand tokens (not `outline: none`)
- Add a `@media (prefers-reduced-motion: reduce)` block that sets `transition: none` and `animation: none` globally
- Import Tailwind base, components, utilities

---

Begin with Steps 1–2 and confirm before continuing.
