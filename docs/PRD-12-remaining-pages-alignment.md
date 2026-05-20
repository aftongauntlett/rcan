# PRD: Remaining Pages Alignment Override (Post PRD-04/05)

## Purpose

This PRD captures the actual implementation decisions made while completing Home and About.

Use this document as the required alignment source before implementing or revising:

- `docs/PRD-06-how-we-help.md`
- `docs/PRD-07-impact.md`
- `docs/PRD-08-get-involved.md`
- `docs/PRD-09-contact.md`
- `docs/PRD-10-donate.md`
- `docs/PRD-11-final-audit.md`

If any of those PRDs conflict with this document, this document wins.

---

## Order of Authority

1. `.github/copilot-instructions.md`
2. `docs/PRD-12-remaining-pages-alignment.md` (this file)
3. Page PRD (`docs/PRD-06` through `docs/PRD-11`)
4. Archived PRDs (context only)

---

## Confirmed Design Decisions From Implemented Code

These decisions were validated in implemented code and should be treated as the baseline for remaining pages.

### 1. Header pattern: no required two-column hero image

- Use `SectionHeader` as the standard page-opening pattern.
- Do not require a two-column hero with image for remaining pages.
- Add hero/lead images only when content meaningfully requires them.

### 2. No dark-card pattern as a default

- Do not introduce `bg-surface-invert` as a default section treatment.
- Do not use dark visual bookends to force rhythm.
- Build rhythm with white, subtle, spacing, and typography hierarchy.

### 3. Closing CTA pattern is shared and reusable

- Use `CTABlock` for page-closing CTA sections.
- Use `variant="outline"` as the default close style unless a page-specific requirement is approved.
- Do not reintroduce page-specific CTA markup if `CTABlock` can satisfy the need.

### 4. Reuse components before adding variation

Prefer these existing components first:

- `SectionHeader`
- `CTABlock`
- `StatStrip`
- `StoryBlock`
- `StepList`
- `BulletList`
- `Button`
- `Icon`

If a PRD proposes new one-off structures, check whether one of the above can be extended first.

### 5. Tokenized styling and consistent interaction patterns

- Keep all styling token-based through Tailwind classes already in use.
- Keep visible focus states on links/buttons.
- Keep motion limited to allowed patterns and reduced-motion safe behavior.

---

## Required PRD Normalization For 06-11

When implementing any remaining PRD, normalize it against this checklist first.

1. Remove instructions that require `bg-surface-invert` sections or dark closing cards.
2. Remove instructions that require two-column hero text+image as a default page opener.
3. Convert CTA instructions using old `CTABlock` background props to current `CTABlock` API (`variant`).
4. Replace one-off card/button variants with shared component usage where possible.
5. Keep page-level visual consistency anchored to Home/About component patterns.

---

## Per-PRD Guidance (What To Override)

### PRD-06 (How We Help)

- Do not convert the pathway section to dark/invert.
- Keep hierarchy improvements and list consolidation, but implement using white/subtle surfaces.
- Close with shared `CTABlock` (`variant="outline"`).

### PRD-07 (Impact)

- Do not convert Program Highlights to invert.
- Keep story regrouping and stats clarity goals.
- Use existing `StoryBlock`, `StatStrip`, and `CTABlock` patterns without introducing dark anchor sections.

### PRD-08 (Get Involved)

- Keep text-first opener direction.
- Do not convert Prison Friendship section to invert.
- Keep shared CTA close and component reuse goals.

### PRD-09 (Contact)

- Continue using shared section rhythm and `CTABlock` close.
- Keep form and trust refinements; avoid introducing new visual paradigms.

### PRD-10 (Donate)

- Keep embed-state and trust-clarity work.
- Keep close section in shared `CTABlock` style.
- Avoid special-case card treatments that diverge from Home/About patterns.

### PRD-11 (Final Audit)

- Add this PRD as an explicit audit check:
  - Validate remaining pages align with this override baseline.
  - Flag any drift back to dark-card or non-reusable one-off patterns.

---

## Implementation Gate For Future PRD Runs

Before implementing PRD-06 through PRD-11, the agent must:

1. Read `.github/copilot-instructions.md`
2. Read `docs/PRD-12-remaining-pages-alignment.md`
3. Read target PRD
4. Note any contradiction and resolve using the order of authority above

---

## Why This Exists

PRD-04 and PRD-05 were materially implemented with iterative design decisions that were not fully backported into every downstream PRD document. This file prevents regressions and keeps future work aligned to the real, shipped direction.
