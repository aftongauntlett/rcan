# RCAN PRD Execution Rules

## Purpose

Use this file as the single planning index and execution-order guide for PRD implementation.

Authoritative coding constraints live in `.github/copilot-instructions.md`.

---

## Implementation Order

Run page PRDs in this order:

1. `docs/PRD-04-home.md`
2. `docs/PRD-05-about.md`
3. `docs/PRD-12-remaining-pages-alignment.md` (required override baseline for PRD-06 through PRD-11)
4. `docs/PRD-06-how-we-help.md`
5. `docs/PRD-07-impact.md`
6. `docs/PRD-08-get-involved.md`
7. `docs/PRD-09-contact.md`
8. `docs/PRD-10-donate.md`
9. `docs/PRD-11-final-audit.md` (release gate)

Do not run all page PRDs in one implementation pass.

---

## Execution Rules

- Implement one PRD per run.
- Treat the selected PRD as scope authority for that run.
- Do not pull in unrelated changes from other PRDs unless explicitly called out as a dependency.
- Preserve existing design-token, accessibility, and reduced-motion rules.
- Validate each run with:
  - `npm run check`
  - `npm run lint`

---

## Cross-PRD Dependencies

- `docs/PRD-05-about.md` references home-page copy consistency from `docs/PRD-04-home.md`.
- `docs/PRD-12-remaining-pages-alignment.md` must be read before `docs/PRD-06-how-we-help.md` through `docs/PRD-11-final-audit.md` and overrides those PRDs when conflicts exist.
- `docs/PRD-11-final-audit.md` must run only after all page PRDs are implemented.

---

## Active PRDs

- Home: `docs/PRD-04-home.md`
- About: `docs/PRD-05-about.md`
- Remaining pages alignment override: `docs/PRD-12-remaining-pages-alignment.md`
- How We Help: `docs/PRD-06-how-we-help.md`
- Impact: `docs/PRD-07-impact.md`
- Get Involved: `docs/PRD-08-get-involved.md`
- Contact: `docs/PRD-09-contact.md`
- Donate: `docs/PRD-10-donate.md`
- Final audit: `docs/PRD-11-final-audit.md`

---

## Archived PRDs

- `docs/archived/PRD-01-foundation-setup.md`
- `docs/archived/PRD-02-design-polish-content-layout.md`
- `docs/archived/PRD-03-round-2-consistency-components.md`

Archived PRDs are historical context only unless a current PRD explicitly references them.
