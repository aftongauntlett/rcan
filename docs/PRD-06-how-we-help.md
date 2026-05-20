# PRD: How We Help Page - Phase 3

> **Note:** Ignore anything about the header/hero area — use the current implementation to stay consistent. Do not add or reinstate any dark (`bg-surface-invert`) CTA block at the bottom of pages; that pattern has been removed. If any remaining task references a dark closing box or `background="invert"` on CTABlock, skip it.

## Copy/Paste Agent Prompt (Step 3 of 8)

Recommended model: GPT-5.3-Codex

Use this prompt with your coding agent:

```text
Implement only this PRD: docs/PRD-06-how-we-help.md.
Review the copilot-instructions.md and content.md, rules.md in docs/guide

Target page and likely touchpoints:
- src/pages/how-we-help.astro
- src/components/CTABlock.astro (only if required by this PRD)

Execution rules:
1) Read docs/PRD-06-how-we-help.md fully before editing.
2) Treat this PRD as source of truth for scope and copy direction.
3) Do not implement other PRDs in this run.
4) Preserve design tokens, accessibility, and motion constraints already used in this repo.
5) Run validation commands after implementation:
  - npm run check
  - npm run lint

Output format:
- Summary of completed PRD items
- Files changed
- Any deviations or blockers
```

## Status

The How We Help page is structurally sound and readable, but it still feels utilitarian compared to the updated Home and About pages. This PRD focuses on tightening information hierarchy, reducing cognitive load in the support list, adding one clear emotional anchor, and standardizing the page close with the shared `CTABlock` component.

All decisions in this PRD are committed for implementation. Client copy edits can follow after build.

---

## Current State

| #   | Section                            | Background | Status                                |
| --- | ---------------------------------- | ---------- | ------------------------------------- |
| 1   | Hero - text left, image right      | White      | Works, but message can be sharper     |
| 2   | Types of Support - 11 bullet items | Subtle     | Accurate but dense and repetitive     |
| 3   | Support Pathway - 3-step list      | White      | Good structure, needs visual weight   |
| 4   | Join this response network CTA     | Subtle     | Not using shared `CTABlock` component |

### Visual rhythm (current vs target)

Current: White -> Subtle -> White -> Subtle

Target: White -> Subtle -> Invert -> Subtle

The pathway section becomes the single invert section. This gives the process a stronger visual center and creates clearer pacing across the page.

---

## Section Specifications

### 1. Hero - tighten orientation copy, keep layout

**What is working:**

- Two-column structure with `art-community.jpg`
- Strong H1 and clear mission framing
- Good first impression and visual balance

**Changes:**

1. Keep existing layout and image.
2. Keep the current `SectionHeader` heading.
3. Replace the body paragraph with tighter service-language copy:

> Requests come through the DC Public Defender Service. RCAN congregations then coordinate practical, short-term support that helps people stabilize quickly and move toward longer-term reentry goals.

**Rationale:**
The page should immediately answer "how help is delivered" in one plain-language paragraph without repeating detail already covered in later sections.

---

### 2. Types of Support - reduce scan load and group overlapping items

**Issue:**
The current 11-item list is accurate but cognitively heavy. Several items overlap and force visitors to parse too many near-duplicate phrases.

**Decision:**
Consolidate to 8 grouped items while preserving all core categories of aid.

**Implementation:**
Use the existing list section and keep two-column presentation, but update the list data to these 8 items:

1. Housing support: apartment search, furnishings, application fees, security deposits
2. Food, clothing, and hygiene essentials
3. Transportation support: Metro cards, bicycles, and rides
4. Emergency financial relief: utilities, eviction prevention, and urgent household costs
5. Employment and life-skills support
6. Reentry legal support: court fees, sanctions, and release-related letters
7. Family and youth supports, including therapeutic program costs
8. Communication and stabilization resources, including phones, books, and therapy support

Then add one text link block below the list:

```html
<p class="mt-6 text-sm text-text-subtle">
  <a
    href="/impact"
    class="text-text-link underline underline-offset-2 hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
  >
    See real examples of this support on the Impact page ->
  </a>
</p>
```

**Rationale:**
Visitors scan this section before they commit to reading details. Grouping improves comprehension speed and reduces drop-off while keeping factual scope.

---

### 3. Support Pathway - make the process the emotional anchor

**Decision:**
Move this section to `bg-surface-invert` and keep the 3-step structure.

**What changes:**

1. Section container: white -> invert (`bg-surface-invert rounded-lg px-6 py-8 md:px-8 md:py-10`)
2. Heading and body text: switch to invert-safe classes
   - Heading label: `text-text-invert`
   - Step labels: `text-brand-secondary`
   - Step descriptions: `text-neutral-300`

- Border rail: `border-strong`

3. Add one supporting stat line below the steps:

```html
<p class="mt-6 text-sm text-neutral-300">
  Most weeks, RCAN coordinates one to two urgent requests through the network.
</p>
```

4. Add a secondary inline link under the stat:

```html
<p class="mt-3 text-sm text-neutral-300">
  <a
    href="/impact"
    class="text-text-invert underline underline-offset-2 hover:text-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
  >
    Read stories of what this pathway makes possible ->
  </a>
</p>
```

**Rationale:**
This page needs one section with emotional and visual weight. The pathway is the best anchor because it explains transformation, not just services.

---

### 4. CTA - standardize with CTABlock component

**Issue:**
Current CTA is custom inline markup, which drifts from site-wide patterns and adds maintenance variance.

**Decision:**
Replace the existing CTA section with the shared `CTABlock` component.

```astro
<CTABlock
  heading="Join this response network"
  body="RCAN depends on congregations and supporters who can respond when urgent needs arise."
  primaryLabel="Get involved"
  primaryHref="/get-involved"
  secondaryLabel="Support RCAN"
  secondaryHref="/donate"
  background="subtle"
/>
```

**Rationale:**
This keeps consistency with Home and About while preserving the current conversion intent.

---

## Content and Component Notes

- Keep `art-community.jpg` as the hero image for this page.
- Keep existing component usage where possible; only replace the final CTA markup with `CTABlock`.
- Use `StepList` only if style parity with invert backgrounds can be achieved without overriding core semantics. If not, keep page-local ordered list markup.

---

## Accessibility Checklist

- [ ] Hero image alt remains descriptive and contextual
- [ ] Types of support list remains semantic `<ul>` with `<li>` items
- [ ] Pathway section uses `<section aria-labelledby="pathway-heading">`
- [ ] Invert section text meets WCAG AA contrast against `#162824`
- [ ] Inline links include visible `focus-visible` ring states
- [ ] CTA uses `CTABlock` with keyboard-focusable buttons/links
- [ ] Heading hierarchy remains H1 -> H2 with no skips

---

## Implementation Order

1. Update hero body copy (content-only)
2. Consolidate support list from 11 to 8 grouped items
3. Add Impact page cross-link under Types of Support
4. Convert Support Pathway section to invert styling and add stat + link
5. Replace custom CTA section with `CTABlock`
6. Run `astro check` and `eslint`
7. Verify contrast, keyboard focus states, and final responsive layout
