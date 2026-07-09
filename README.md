# RCAN

Website for the [Returning Citizens Assistance Network](https://www.rcandc.org/) (RCAN), a Washington, DC network of congregations supporting people re-entering society after involvement with the criminal justice system.

**Live site:** [rcandc.org](https://www.rcandc.org/)

## Highlights

- Fully accessible: automated axe-core checks plus manual screen-reader smoke testing
- Performance-gated: Lighthouse CI thresholds enforced for mobile and desktop on every release
- Type-safe: Astro + TypeScript in strict mode
- Cross-browser regression coverage via Playwright
- Custom admin dashboard for tracking client change requests
- Secure contact/donation forms with Turnstile bot protection

## Tech stack

- Astro 7, TypeScript
- Tailwind CSS 4
- ESLint, Prettier
- Vitest, Playwright

## Local Development

```bash
npm install
npm run dev
npm run preview
npm run build
```

Node.js 24 is recommended for local parity with Vercel serverless functions. Node.js 22.12.0 or newer is supported by the project.

## Release Checks

Run these before publishing meaningful changes:

```bash
npm run check
npm run lint
npm run test
npm run format
npm run build
npm run audit:deps
npm run test:e2e
```

Notes:

- `npm run preview` intentionally aliases Astro's dev server because the Vercel adapter does not support `astro preview` for this server-mode build.
- `npm run test:e2e` starts Astro's dev server through Playwright. The Playwright config sets `ASTRO_DEV_BACKGROUND=1` so Astro 7 runs in the foreground under agent/CI environments.
- The contact form imports Formspree's ESM build directly (`@formspree/ajax/dist/index.mjs`) because Astro 7's bundler resolves the package browser entry differently.
