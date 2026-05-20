# PRD: Get Involved Page - Phase 3

## Copy/Paste Agent Prompt (Step 5 of 8)

Recommended model: GPT-5.3-Codex

Use this prompt with your coding agent:

```text
Implement only this PRD: docs/PRD-08-get-involved.md.

Target page and likely touchpoints:
- src/pages/get-involved.astro
- src/components/StepList.astro (only if required by this PRD)
- src/components/CTABlock.astro (only if required by this PRD)

Execution rules:
1) Read docs/PRD-08-get-involved.md fully before editing.
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

The Get Involved page has good core content, but it currently feels visually repetitive and over-dense in the lower half. The page also ends without the shared closing CTA pattern used elsewhere.

This PRD focuses on clearer audience pathways, cleaner hierarchy, and a stronger emotional anchor around the Prison Friendship Project, while preserving the current content scope.

All decisions are committed for implementation. Client copy refinements can follow after build.

---

## Current State

| #   | Section                            | Background | Status                                                                           |
| --- | ---------------------------------- | ---------- | -------------------------------------------------------------------------------- |
| 1   | Hero (text + image)                | White      | Functional, but repeats the same two-column hero pattern used across other pages |
| 2   | Ways to Help (4 icon rows)         | Subtle     | Good content, but weak action hierarchy                                          |
| 3   | Congregation Commitments (3 steps) | White      | Clear structure, but lacks a next-step cue                                       |
| 4   | Prison Friendship Project          | Subtle     | Strong content but visually dense and not clearly prioritized                    |
| -   | Closing CTA block                  | -          | Missing                                                                          |

### Visual rhythm (current vs target)

Current: White -> Subtle -> White -> Subtle

Target: White -> Subtle -> White -> Invert -> Subtle

The Prison Friendship Project becomes the page anchor using invert treatment. The page closes with a subtle CTABlock for consistent site-wide endings.

---

## Section Specifications

### 1. Hero - move to text-first orientation (no hero image)

**What is working:**

- The heading direction is strong and specific to action.
- Existing body copy explains RCAN's practical participation model.

**Issue:**
The two-column image hero repeats a pattern already used heavily across pages. This page should feel more action-oriented and less promotional.

**Changes:**

1. Remove the hero image from Get Involved.
2. Keep a text-first opening with `SectionHeader` and one supporting paragraph.
3. Update heading to broaden audience beyond congregations:

> Bring your strengths to RCAN.

4. Keep the paragraph practical and concise; remove duplicated phrasing about case volume where possible.

**Rationale:**
A text-first opening improves differentiation from other pages and supports the page's functional purpose: helping visitors choose a participation path quickly.

---

### 2. Ways to Help - strengthen action clarity

**What is working:**

- Four participation paths are useful and distinct.
- Icon + title + short description format is scannable.

**Changes:**

1. Keep this section on `bg-surface-subtle`.
2. Keep four items, but tighten copy to consistent verb-led structure:

- Direct support urgent requests
- Coordinate volunteers through your congregation
- Build one-to-one encouragement and mentoring
- Give financially for urgent needs

3. Add one text link below the grid:

```html
<p class="mt-6 text-sm text-text-subtle">
  <a
    href="/how-we-help"
    class="text-text-link underline underline-offset-2 hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
  >
    See the full range of support requests ->
  </a>
</p>
```

**Rationale:**
This section should answer "what can I do?" immediately, then offer a deeper detail path.

---

### 3. Congregation Commitments - keep step structure, add clear transition

**What is working:**

- Three commitments are concise and actionable.
- StepList structure is appropriate and consistent.

**Changes:**

1. Keep this section on white background.
2. Keep the existing three-step commitment content.
3. Add one transition line after the steps:

> Individuals can join this work directly through the Prison Friendship Project below.

**Rationale:**
The page currently feels congregation-heavy until very late. This line improves flow to the individual participation path.

---

### 4. Prison Friendship Project - promote to anchor section (invert)

**Decision:**
Convert the full PFP section to `bg-surface-invert` and simplify internal hierarchy.

**Changes:**

1. Container: `bg-surface-invert rounded-lg px-6 py-8 md:px-8 md:py-10`.
2. Remove the top border accent (no `border-t-2`) to avoid decorative redundancy on dark background.
3. Update text classes for invert contrast:

- Section heading and subheads: `text-text-invert`
- Body: `text-neutral-300`
- Supporting copy: `text-neutral-300`

4. Keep intro + image two-column layout, but shorten paragraph spacing for better density control.
5. Replace `StatStrip` usage here with a local two-item semantic `<dl>` to ensure correct invert styling and simpler visual integration.
6. Keep "What Prison Friends do" as bullet list.
7. Keep right-side reassurance callout, but reduce duplicate support lines.
8. Keep button label "Become a Prison Friend" and route to `/contact`.

**Rationale:**
This is the highest-emotion and most distinctive program on the page. It should carry the visual emphasis.

---

### 5. NEW - Closing CTA block

Add a final shared `CTABlock` section to align with the site pattern that each page ends with a clear next step.

```astro
<CTABlock
  heading="Ready to respond with RCAN?"
  body="Whether you are joining as a congregation, becoming a Prison Friend, or giving to urgent needs, RCAN can help you take the next step."
  primaryLabel="Contact RCAN"
  primaryHref="/contact"
  secondaryLabel="Donate"
  secondaryHref="/donate"
  background="subtle"
/>
```

**Rationale:**
A shared closing CTA improves consistency and captures visitors who reach the end of a long informational section.

---

## Content and Component Notes

- Remove the hero image usage on this page.
- Keep existing `StepList` for commitments.
- Keep existing `Icon` usage in Ways to Help.
- Keep PFP image (`holding-hands.jpg`) in the featured section.
- Use `CTABlock` for the final section instead of custom markup.

---

## Accessibility Checklist

- [ ] All sections retain `aria-labelledby` with visible headings
- [ ] PFP invert text meets WCAG AA on `#162824`
- [ ] PFP stats use semantic `<dl>` with clear number/label association
- [ ] All new links include visible `focus-visible` styles
- [ ] Hero remains H1 and downstream headings remain H2/H3 with no skips
- [ ] Button and link targets are keyboard reachable and clearly labeled

---

## Implementation Order

1. Refactor hero to text-first layout and remove image import/figure
2. Tighten Ways to Help copy and add `/how-we-help` text link
3. Add transition sentence after Congregation Commitments
4. Convert PFP section to invert and update typography classes
5. Replace PFP `StatStrip` with local semantic `<dl>` stats
6. Add final `CTABlock` section
7. Run `astro check` and `eslint`
8. Validate contrast, focus states, heading order, and mobile layout
