# RCAN

RCAN is a nonprofit website for the Returning Citizens Assistance Network, a Washington, DC network of congregations supporting people re-entering society after involvement with the criminal justice system.

## Current status

This repository contains an implemented multi-page Astro site with release-gate tooling:

- Astro site with TypeScript strict mode enabled
- Tailwind CSS v4 integrated through Vite
- Centralized design-token configuration in `tailwind.config.ts`
- ESLint with TypeScript + Astro + jsx-a11y
- Vitest test runner setup
- Prettier formatting setup
- Shared layouts and reusable UI components for page composition
- Production-surface artifacts including `404` handling, `robots.txt`, and `sitemap.xml`
- Release remediation plan in `docs/PRD-13-release-readiness-remediation.md`

## Product and planning docs

Current product requirements and page planning docs live in `docs/`.

- Active release PRD: `docs/PRD-13-release-readiness-remediation.md`
- Guide docs: `docs/guide/content.md`, `docs/guide/rules.md`, `docs/guide/formspree-turnstile-ops.md`
- Archived PRDs and legacy notes: `docs/archived/`

## Tech stack

- Astro 6
- TypeScript
- Tailwind CSS 4
- @tailwindcss/typography
- ESLint 9 + @typescript-eslint + eslint-plugin-jsx-a11y + eslint-plugin-astro
- Vitest
- Prettier

## Local development

### Prerequisites

- Node.js 22.12.0 or newer

### Install

```bash
npm install
```

### Run dev server

```bash
npm run dev
```

### Build

```bash
npm run build
```

Note: `astro check` runs automatically before build via `prebuild`.

## Quality checks

```bash
npm run check
npm run lint
npm run test
npm run format
```

## Project structure

```text
.
├── docs/
│   ├── PRD-13-release-readiness-remediation.md
│   ├── guide/
│   │   ├── content.md
│   │   ├── formspree-turnstile-ops.md
│   │   └── rules.md
│   └── archived/
│       ├── PRD-11-final-audit.md
│       └── PRD-12-remaining-pages-alignment.md
├── public/
│   └── robots.txt
├── tailwind.config.ts
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   │   ├── 404.astro
│   │   ├── index.astro
│   │   └── sitemap.xml.ts
│   └── styles/
│       └── global.css
│   └── utils/
└── ...
```
