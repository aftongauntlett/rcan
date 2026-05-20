# PRD: Contact Page - Phase 3

> **Note:** Ignore anything about the header/hero area — use the current implementation to stay consistent. Do not add or reinstate any dark (`bg-surface-invert`) CTA block at the bottom of pages; that pattern has been removed. If any remaining task references a dark closing box or `background="invert"` on CTABlock, skip it.

## Copy/Paste Agent Prompt (Step 6 of 8)

Recommended model: GPT-5.3-Codex

Use this prompt with your coding agent:

```text
Implement only this PRD: docs/PRD-09-contact.md.

Review the copilot-instructions.md and content.md, rules.md in docs/guide

Target page and likely touchpoints:
- src/pages/contact.astro
- src/components/CustomDropdown.astro (only if required by this PRD)
- src/components/CTABlock.astro (only if required by this PRD)

Execution rules:
1) Read docs/PRD-09-contact.md fully before editing.
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

The Contact page is functional and already includes meaningful form validation, referral-oriented messaging, and anti-spam protection. The remaining work is primarily design and conversion polish: improve first-screen clarity, reduce visual heaviness in the form section, and standardize the page close with the shared CTA pattern.

All decisions in this PRD are committed for implementation. Client copy edits can follow after build.

---

## Current State

| #   | Section                              | Background                          | Status                                                                     |
| --- | ------------------------------------ | ----------------------------------- | -------------------------------------------------------------------------- |
| 1   | Hero (text + image)                  | White                               | Clear intent, but intro copy is longer than needed                         |
| 2   | Get in touch cards (mailing + email) | Mixed subtle cards in white section | Useful contact info, but no response expectation guidance                  |
| 3   | Contact form                         | White with border                   | Functionally strong, visually dense and form-first readability can improve |
| 4   | Bottom CTA area (custom markup)      | Subtle                              | Works, but not standardized with `CTABlock`                                |

### Visual rhythm (current vs target)

Current: White -> White/subtle mix -> White -> Subtle

Target: White -> Subtle -> White -> Subtle

The contact-methods area becomes a clean subtle section. The form remains on white for readability. The closing CTA is converted to `CTABlock` for consistency with other pages.

---

## Section Specifications

### 1. Hero - simplify to one supporting paragraph

**What is working:**

- Heading is direct and audience-appropriate.
- Hero image supports the idea of community collaboration.

**Changes:**

1. Keep the two-column hero layout and current image assignment (`gardening-community.jpg`).
2. Keep `SectionHeader` heading and subheading.
3. Reduce body copy from two paragraphs to one concise support paragraph:

> RCAN responds through trusted referral and congregation channels and welcomes partnership from communities committed to practical, dignity-centered reentry support.

4. Remove repetitive wording about both congregation and general questions (covered in form intro and topic selector).

**Rationale:**
The contact page should move visitors to action quickly. One support paragraph reduces friction.

---

### 2. Get in touch section - improve trust and expectation setting

**Issue:**
Current cards provide address and email only. Users do not see expected response pattern unless they read further down.

**Changes:**

1. Convert this section to a full subtle container:

- `rounded-lg bg-surface-subtle px-6 py-8 md:px-8 md:py-10`

2. Keep two-column layout for mailing and email.
3. Add a compact line beneath the cards:

> RCAN reviews each message and follows up through trusted referral and congregation channels.

4. Keep email link styling and focus ring treatment as-is.

**Rationale:**
Contact sections perform better when trust and expectation are explicit near the channel options.

---

### 3. Contact form - reduce density and improve field flow

**What is working:**

- Formspree integration and error surfaces are already in place.
- Field labels and validation are clear.

**Changes:**

1. Keep form on `bg-surface-default` with border for readability; do not invert this section.
2. Shorten intro text to one sentence to reduce pre-form fatigue.
3. Add a visible required-field note under heading:

> Required fields are marked by validation. Please include enough detail for follow-up.

4. Keep 2-column layout for top fields, but add a stronger visual break before Message (`mt-2` and section label style for clarity).
5. Increase textarea rows from 5 to 6 for better long-message usability.
6. Keep topic dropdown required; ensure first shown value is a neutral prompt (e.g., "Select a topic") rather than preselecting a live option.

**Rationale:**
A slightly calmer form hierarchy improves completion rates without changing backend behavior.

---

### 4. CAPTCHA and submit-state messaging - clarify behavior by environment

**Issue:**
Local preview state and deployed non-configured state are both informative, but the disabled submit behavior can feel confusing during local QA.

**Changes:**

1. Keep Turnstile enabled only in non-local environments with a site key.
2. In local dev, keep the preview helper text and keep submit disabled when Turnstile is not configured.
3. In deployed environments without key, keep warning text and disable submit.
4. For end-to-end submit QA, use a staging/deployed environment with a valid Turnstile site key.
5. Keep explicit error slot for `cf-turnstile-response`.

**Rationale:**
This preserves production safety while making local validation and QA less brittle.

---

### 5. Replace custom bottom CTA with shared CTABlock

Current custom CTA should be replaced by `CTABlock`.

```astro
<CTABlock
  heading="Take the next step"
  body="If you are ready to support this work right away, financial giving remains one of the fastest ways to strengthen RCAN's response capacity."
  primaryLabel="Donate"
  primaryHref="/donate"
  secondaryLabel="Get involved"
  secondaryHref="/get-involved"
  background="subtle"
/>
```

**Rationale:**
This aligns Contact with Home/About/Get Involved consistency goals and reduces page-specific markup drift.

---

## Content and Component Notes

- Keep hero image assignment: `gardening-community.jpg` on Contact.
- Keep existing `CustomDropdown` component for topic selection.
- Keep Formspree integration and current hidden spam field strategy.
- Replace only the bottom custom CTA section with `CTABlock`.

---

## Accessibility Checklist

- [ ] Hero and all form controls retain clear label association (`for` / `id`)
- [ ] Form error text remains exposed to assistive tech via existing status/alert regions
- [ ] Dropdown remains keyboard navigable with visible focus state
- [ ] Email link and all actionable controls preserve `focus-visible` ring styles
- [ ] Heading hierarchy remains H1 -> H2 without skips
- [ ] Form instructions are concise and not duplicative for screen reader users

---

## Implementation Order

1. Trim hero body copy to one supporting paragraph
2. Convert Get in touch section to a single subtle container and add response-expectation line
3. Tighten contact form intro and add required-field helper line
4. Update message-field hierarchy and textarea size
5. Adjust topic default state to neutral prompt
6. Clarify CAPTCHA/submit behavior by environment (local vs deployed-no-key)
7. Replace bottom custom CTA with `CTABlock`
8. Run `astro check` and `eslint`
9. Validate keyboard flow, error announcements, and responsive form layout
