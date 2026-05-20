# PRD: Donate Page - Phase 3

> **Note:** Ignore anything about the header/hero area — use the current implementation to stay consistent. Do not add or reinstate any dark (`bg-surface-invert`) CTA block at the bottom of pages; that pattern has been removed. If any remaining task references a dark closing box or `background="invert"` on CTABlock, skip it.

## Copy/Paste Agent Prompt (Step 7 of 8)

Recommended model: GPT-5.3-Codex

Use this prompt with your coding agent:

```text
Implement only this PRD: docs/PRD-10-donate.md.

Review the copilot-instructions.md and content.md, rules.md in docs/guide

Target page and likely touchpoints:
- src/pages/donate.astro
- src/components/CTABlock.astro (only if required by this PRD)

Execution rules:
1) Read docs/PRD-10-donate.md fully before editing.
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

The Donate page is structurally simple and already points users to the right action, but it still looks partially in-progress because the donation embed area is visually dominant and placeholder-driven. The page also lacks a consistent closing section used elsewhere.

This PRD focuses on conversion clarity, trust signaling, and consistent page-end behavior while preserving existing route and content intent.

All decisions are committed for implementation. Client copy edits can follow after build.

---

## Current State

| #   | Section                                               | Background | Status                                                                        |
| --- | ----------------------------------------------------- | ---------- | ----------------------------------------------------------------------------- |
| 1   | Hero (text + image + Give now button)                 | White      | Clear headline and CTA, but supporting proof is limited                       |
| 2   | Give to RCAN (Donorbox placeholder + mailing address) | Subtle     | Functionally correct structure, but placeholder dominates and feels temporary |
| 3   | What your gift supports                               | White      | Useful but too brief to reinforce confidence                                  |
| -   | Closing CTA block                                     | -          | Missing                                                                       |

### Visual rhythm (current vs target)

Current: White -> Subtle -> White

Target: White -> Subtle -> White -> Subtle

The page should end with a subtle CTABlock to match the site pattern and provide a secondary action path.

---

## Section Specifications

### 1. Hero - keep layout, strengthen proof and urgency

**What is working:**

- Heading and subheading are donation-specific.
- Hero image (`make-change.jpg`) aligns with giving intent.
- Primary CTA to `#donate-form` is appropriate.

**Changes:**

1. Keep two-column layout and image assignment.
2. Keep heading text.
3. Replace body paragraph with one concise impact-oriented paragraph:

> Your gift helps RCAN respond quickly to urgent requests for housing, food, transportation, and other barriers that can delay reentry stability.

4. Add one trust line directly beneath the paragraph:

> Every contribution supports practical, short-term needs identified through RCAN's referral channels.

5. Keep primary button label as "Give now" and add a secondary text link to the mail-giving anchor (`#mail-giving`) in the Give section.

**Rationale:**
The hero should convert quickly by combining urgency, trust, and a clear immediate path.

---

### 2. Give to RCAN - production-ready embed behavior and cleaner fallback

**Issue:**
The current placeholder block is visually heavier than the rest of the page and can appear unfinished if live embed is missing.

**Changes:**

1. Keep section background subtle and current heading.
2. Implement explicit embed states:

- Use `PUBLIC_DONORBOX_EMBED_URL` as the embed source configuration.
- Treat local environment with `import.meta.env.DEV`.

- Live configured state: show Donorbox iframe only.
- Local/dev state: show compact preview helper panel.
- Deployed without embed configured: show warning panel and fallback CTA to `/contact` rather than a large dashed placeholder.

3. Reduce placeholder/fallback visual footprint in non-live states:

- Use a compact message block instead of full-height 96+ placeholder panel.

4. Keep "Prefer to give by mail?" block, but elevate it as a clear secondary option with slightly stronger heading contrast and add `id="mail-giving"`.

**Rationale:**
Donation pages must feel production-ready even before external embed setup is complete.

---

### 3. What your gift supports - expand and structure for confidence

**Issue:**
Current support list is too short for a dedicated donation page and does not fully reinforce practical impact.

**Changes:**

1. Keep section on white background with section-title heading.
2. Expand the list from 3 to 6 concise bullet points:

- Emergency support that prevents avoidable setbacks during reentry
- Housing-related costs (application fees, deposits, utilities)
- Transportation support (Metro cards, rides, bicycles)
- Essential needs (food, clothing, hygiene)
- Coordinated congregation response to urgent requests
- Program support that sustains ongoing client stabilization

3. Add one line under the list:

> RCAN prioritizes urgent practical barriers so returning citizens can focus on long-term stability.

**Rationale:**
Donors convert better when practical use-cases are concrete and varied.

---

### 4. NEW - Closing CTA with secondary pathway

Add a closing `CTABlock` section with subtle background.

```astro
<CTABlock
  heading="Want to support in more than one way?"
  body="Financial gifts fund urgent needs. Congregation and volunteer support expands RCAN's response capacity across the network."
  primaryLabel="Get involved"
  primaryHref="/get-involved"
  secondaryLabel="Contact RCAN"
  secondaryHref="/contact"
  background="subtle"
/>
```

**Rationale:**
Even high-intent donors may also want relational involvement. This closes the page with a broader participation path.

---

## Content and Component Notes

- Keep hero image assignment: `make-change.jpg` on Donate.
- Keep section anchor `#donate-form` for hero CTA.
- Keep `BulletList` for support items unless spacing changes require page-local list markup.
- Use existing `CTABlock` component for the new closing section.

---

## Accessibility Checklist

- [ ] Donorbox iframe includes accessible title text when configured
- [ ] Fallback messages are clear and announced as regular readable content
- [ ] Mailing address remains semantic `<address>`
- [ ] Hero and all link/button actions retain visible `focus-visible` states
- [ ] Heading hierarchy remains H1 -> H2 with no skips
- [ ] Bullet list remains semantic and easy to scan on mobile

---

## Implementation Order

1. Tighten hero support copy and add trust line + secondary mail-giving text link
2. Refactor Give section into clear embed states (live/dev/deployed-no-embed)
3. Reduce non-live fallback visual weight and keep actionable alternative
4. Expand "What your gift supports" list and add reinforcement line
5. Add final `CTABlock` section
6. Run `astro check` and `eslint`
7. Verify keyboard navigation, focus rings, and responsive donation flow
