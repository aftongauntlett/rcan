# PRD: Impact Page - Phase 3

> **Alignment override:** Read `docs/PRD-12-remaining-pages-alignment.md` before implementation. If this PRD conflicts with PRD-12, PRD-12 wins.

## Copy/Paste Agent Prompt (Step 4 of 8)

Recommended model: GPT-5.3-Codex

Use this prompt with your coding agent:

```text
Implement only this PRD: docs/PRD-07-impact.md.

Review the copilot-instructions.md and content.md, rules.md in docs/guide
Read docs/PRD-12-remaining-pages-alignment.md before making changes.

Target page and likely touchpoints:
- src/pages/impact.astro
- src/components/StoryBlock.astro
- src/components/StatStrip.astro (only if required by this PRD)

Execution rules:
1) Read docs/PRD-12-remaining-pages-alignment.md, then docs/PRD-07-impact.md fully before editing.
2) Resolve contradictions using this order: copilot-instructions.md -> PRD-12 -> this PRD.
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

The Impact page has strong content and meaningful stories, but the visual hierarchy is currently too flat. Long-form quotes, repeated white sections, and equally weighted story blocks make the page feel heavier than it needs to.

This PRD keeps the existing content set while improving scanability, pacing, and emotional structure. All decisions are committed for implementation; client copy edits can follow after build.

---

## Current State

| #   | Section                                                 | Background | Status                                             |
| --- | ------------------------------------------------------- | ---------- | -------------------------------------------------- |
| 1   | Page header + lead copy                                 | White      | Content is strong, but metrics are buried          |
| 2   | Stories (4 consecutive StoryBlock entries)              | White      | Too much equal visual weight; high reading fatigue |
| 3   | Program highlights (feature + bike + 3 text highlights) | White      | Mixed content types, weak hierarchy                |
| 4   | CTA block                                               | Subtle     | Functional, but generic and visually soft          |

### Visual rhythm (current vs target)

Current: White -> White -> White -> Subtle

Target: White -> Subtle -> White -> Subtle

Program outcomes should be the visual anchor through hierarchy and grouping, not dark background treatment.

---

## Section Specifications

### 1. Page header - simplify narrative and separate metrics

**What is working:**

- Shared page opener and heading pattern perform well as orientation
- Heading and subheading are clear
- Copy tone aligns with the rest of the site

**Changes:**

1. Keep the current opener pattern and heading structure.
2. Reduce hero body to one paragraph (keep mission context, remove inline metric sentence from body copy).
3. Add one short transition line under the paragraph:

> The highlights below show personal stories, program milestones, and practical outcomes across the network.

4. Move all numeric outcomes into a dedicated metric strip section immediately after hero.

**Rationale:**
Metrics should be scannable at a glance, not buried inside paragraph text.

---

### 2. NEW Section - 2025 by the numbers (StatStrip)

Add a dedicated `StatStrip` section after the hero using `background="subtle"` and grid layout.

Use four stat items sourced from existing content:

1. 361 - clients supported in 2025
2. $25,000+ - contributed to the RCAN Fund
3. 120 - detained juveniles received holiday gifts
4. 1,000th - bicycle serviced and donated in 2025

Section heading:

- Label style with `section-title`
- Heading text: "2025 by the numbers"

**Rationale:**
This creates a clear proof layer before long-form stories and improves page confidence quickly.

---

### 3. Stories - reduce fatigue with intentional hierarchy

**Issue:**
Four long StoryBlock sections in sequence create visual monotony and make it hard to identify the strongest story first.

**Decision:**
Split stories into one featured story plus two supporting stories.

**Changes:**

1. Keep section heading: "Stories".
2. Feature "Ms. Davenport's Birthday" first as the lead story (with image right).
3. Render "TW and His Family" and "Mr. E." as supporting stories in a 2-column grid on desktop using `background="subtle"` StoryBlocks.
4. Move "Holiday Gifts at the Youth Services Center" out of Stories and into Program Highlights (it is program-scale, not individual narrative scale).
5. Add a short section intro line under the Stories heading:

> These stories reflect how practical support and personal relationships reduce immediate barriers and restore dignity.

**Rationale:**
A featured-first structure gives readers a clear emotional entry point and lowers fatigue.

---

### 4. Program Highlights - make this the visual anchor (no invert)

**Decision:**
Keep Program Highlights on white/subtle tokenized surfaces and make it the anchor through structure.

**Changes:**

1. Do not wrap the entire Program Highlights block in `bg-surface-invert`.
2. Keep heading and body copy on default/subtle token classes:

- section label and h2: `text-text-subtle` / `text-text-default`
- body copy: `text-text-subtle`
- supporting labels: `text-text-subtle`

3. Keep Beauty Behind Bars as the lead feature at the top of the section with two images.
4. Move "Holiday Gifts at the Youth Services Center" here as a program update card with quote.
5. Keep Bike Ministry and the three short highlights, but present them as a consistent 2x2 update grid (desktop) using subtle card containers to avoid mixed layout modes.

Recommended program updates in final grid:

- Bike Ministry
- Holiday Gifts at Youth Services Center
- Gift Cards - $15,325
- Second Chance Event / Material Support (merged concise update)

**Rationale:**
Program outcomes are the strongest proof layer after stories. Strong grouping and hierarchy should carry section identity without dark treatment.

---

### 5. CTA - keep CTABlock, update conversion language

Use `CTABlock` (do not revert to custom markup).

Update copy:

- Heading: "Help shape next year's impact."
- Body: "Donations meet urgent needs. Volunteers build lasting relationships. Join the network that responds when timing matters most."
- Primary: Donate -> `/donate`
- Secondary: Get involved -> `/get-involved`
- Variant: `outline`

**Rationale:**
The current CTA is serviceable but generic. Updated language ties directly to the page narrative and keeps options broad.

---

## Content and Component Notes

- Keep existing image assignments in this page:
  - `cake-gift.jpg` for Ms. Davenport story
  - `beauty-behind-bars.jpg` and `painting.jpg` for Beauty Behind Bars
  - `bike-bags-gift.jpg` for Bike Ministry
- Keep `StoryBlock` and `CTABlock` as primary layout components.
- Use page-local grouping for the supporting stories grid and program updates grid where component props are insufficient.

---

## Accessibility Checklist

- [ ] Every section has `aria-labelledby` tied to a visible heading
- [ ] Hero image and all story/program images have descriptive alt text
- [ ] Story quotes remain semantic (`figure`, `blockquote`, `figcaption`)
- [ ] All inline links and CTA buttons expose visible focus indicators
- [ ] Heading hierarchy stays H1 -> H2 -> H3 with no skips
- [ ] Stat labels remain readable and context-complete for assistive tech

---

## Implementation Order

1. Refactor hero copy and remove inline metric sentence
2. Insert new "2025 by the numbers" StatStrip section
3. Reorder and regroup Stories (featured + supporting grid)
4. Move Holiday Gifts content from Stories into Program Highlights
5. Normalize Program Highlights grouping on white/subtle surfaces and a consistent update grid
6. Update CTA copy and secondary link target to `/get-involved`
7. Run `astro check` and `eslint`
8. Validate contrast, heading order, keyboard focus states, and responsive layout
