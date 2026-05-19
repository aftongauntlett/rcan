# RCAN

RCAN is a nonprofit website for the Returning Citizens Assistance Network, a Washington, DC network of congregations supporting people re-entering society after involvement with the criminal justice system.

## Current status

This repository currently contains the Astro foundation and tooling baseline:

- Astro site with TypeScript strict mode enabled
- Tailwind CSS v4 integrated through Vite
- Centralized design-token configuration in `tailwind.config.ts`
- ESLint with TypeScript + Astro + jsx-a11y
- Vitest test runner setup
- Prettier formatting setup
- Basic homepage placeholder in `src/pages/index.astro`

## Product and planning docs

Implementation instructions and phased build requirements live in `prd-01.md`.

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
├── prd-01.md
├── tailwind.config.ts
├── src/
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css
└── ...
```
