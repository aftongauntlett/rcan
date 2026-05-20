# PRD: Home Page Elevation — Phase 3

## Copy/Paste Agent Prompt (Step 1 of 8)

Recommended model: GPT-5.3-Codex

Use this prompt with your coding agent:

```text
Implement only this PRD: docs/PRD-04-home.md.

Target page and likely touchpoints:
- src/pages/index.astro
- src/components/StatStrip.astro (if required by this PRD)

Execution rules:
1) Read docs/PRD-04-home.md fully before editing.
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

The current structure is:

1. Hero (image left, text right, stats strip below)
2. "How RCAN Assists" (6-item 2-column bullet list, subtle bg, "Learn more" button)
3. "A family reunited" impact story — **StoryBlock with `background="invert"` is in code but screenshots show it rendering on white; verify dark bg is visible in browser before treating this as resolved**
4. Prison Friendship Project teaser (subtle bg, description, CTA button)
5. "Support this ministry" CTA block

This PRD specifies all remaining improvements. All design decisions are committed — the client will review copy and content after implementation and make adjustments then.

---

## Design Principles (specific to home page)

1. **Serve three audiences simultaneously.** Donors, volunteers/congregation members, and people seeking help each need a clear entry path. Never assume visitors know which action is theirs to take.
2. **Motion earns its place.** Animations that reinforce data comprehension (count-up on stats) or guide attention (scroll fade-in) are welcome. All effects must respect `prefers-reduced-motion`.
3. **Plain language at every reading level.** Target 8th-grade reading level for all body copy. Active voice, short sentences, concrete nouns. This serves older visitors, non-native English speakers, and low-literacy users.
4. **One primary action per section.** Each section has one primary CTA (filled) and at most one secondary CTA (ghost/outline).

---

## Current State vs. Target

| Section               | Current                                      | Target                                                                                                    |
| --------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Hero                  | Image + text grid, 2 CTAs, stats strip       | Same layout — paragraph order swap + faith anchor line added                                              |
| Stats strip           | 4 static tiles                               | Count-up animation on scroll, with accessibility guards                                                   |
| How RCAN Assists      | 6 bullets, "Learn more" button               | Same + 2 footer lines (congregation join path + PDS referral path); swap "Learn more" button to text link |
| Three-path engagement | Missing                                      | New section added between "Assists" and story block                                                       |
| Story block           | In code as `invert`; confirm dark bg renders | No change to content — verify dark tile is working                                                        |
| PFP teaser            | Text + 1 stat (23) + CTA                     | Add second stat (40 active), add supporting line                                                          |
| CTA block             | "Support this ministry"                      | New heading: "Stand with returning citizens."                                                             |

---

## Section Specifications

### 1. Hero — Paragraph order + faith anchor

**What's working:** The image + text grid, both CTAs, the stats strip placement. Do not change layout.

**Change 1 — Swap paragraph order:**

Current order puts the Bryan Stevenson founding context before the practical mission description. First-time visitors who don't know Stevenson read past it. Mission first, founding context second.

**New paragraph order:**

> RCAN responds to urgent needs for returning citizens and others in the criminal justice system — all referred by the DC Public Defender Service. The network focuses on practical barriers to reentry: housing, clothing, food, employment, and ongoing personal support.

> In 2018, inspired by Bryan Stevenson's call to get proximate to those who are incarcerated, New York Avenue Presbyterian Church and Metropolitan AME Church partnered with the DC Public Defender Service to establish RCAN — an informal network of congregations committed to social justice and practical help.

**Change 2 — Add faith anchor line:**

Add a single right-aligned line below the two CTAs:

```html
<p class="mt-4 text-right text-xs italic text-text-subtle">
  "I was in prison and you came to visit me." — Matthew 25:36
</p>
```

Matthew 25:36 is used here rather than Micah 6:8 — Micah 6:8 is already established on the About page in the RCAN Fund section. Matthew 25:36 is equally appropriate (explicitly about visiting those imprisoned) and avoids repeating the exact same quote across two pages.

This signals faith-based character without excluding secular supporters. It replaces no existing content and takes no visual space from the core message.

---

### 2. Stats Strip — Restore count-up with accessibility guards

**Decision:** Count-up is restored.

**Implementation spec:**

- **Trigger:** `IntersectionObserver` with `threshold: 0.25` and `rootMargin: "0px"`
- **Trigger once:** Set `data-counted="true"` on the strip element after first fire; observer disconnects immediately after
- **Duration:** 800ms
- **Easing:** `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (ease-out). JS equivalent — use this function directly in the rAF loop:
  ```js
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  // progress = elapsed / duration (0 → 1)
  // currentValue = Math.round(start + (end - start) * easeOutCubic(progress))
  ```
- **Counter engine:** `requestAnimationFrame` with timestamp-based progress — no `setInterval`
- **Prefix/suffix:** Keep `$` and `+` as static sibling text nodes outside the animated `<span>` so they never flicker
- **`prefers-reduced-motion` guard:** `if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)` — skip animation entirely, show final value immediately; do not attach observer
- **Screen reader:** `aria-live="off"` on the animating `<span>`; `aria-label` on the parent `<dd>` with the complete final value (e.g. `aria-label="361 clients helped in 2025"`)
- **Layout stability:** `min-w-16` (or appropriate token-based minimum) on number spans to prevent layout shift during animation

This logic should live in a small `<script>` tag inside `StatStrip.astro` (Astro's `is:inline` script, or a client-side `<script>` block), scoped to the component. No global script file.

---

### 3. How RCAN Assists — Footer lines + button-to-link swap

**Change 1 — Swap "Learn more" button to text link:**

The current "Learn more" button is a full `<Button>` component — visually heavy for what is functionally a "read more" nudge. Replace with a text link matching the PRD-round2 spec:

```html
<p class="mt-6 text-sm text-text-subtle">
  <a
    href="/how-we-help"
    class="text-text-link underline underline-offset-2 hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
  >
    Read about the full range of support →
  </a>
</p>
```

**Change 2 — Add congregation and PDS referral lines:**

Add two more lines beneath the first, all inside a `<div class="mt-6 space-y-2">`:

```html
<p class="text-sm text-text-subtle">
  <a
    href="/get-involved"
    class="text-text-link underline underline-offset-2 hover:text-brand-accent ..."
  >
    Is your congregation in the DC area? Learn how to join the network →
  </a>
</p>
<p class="text-sm text-text-subtle">
  <a
    href="/contact"
    class="text-text-link underline underline-offset-2 hover:text-brand-accent ..."
  >
    Working with a PDS client who needs support? Contact RCAN →
  </a>
</p>
```

Three text links, stacked, `space-y-2`. No new section, no layout change. This is the minimum intervention to surface the congregation and referral paths.

---

### 4. NEW SECTION — Three ways to engage

**Rationale:** There is no moment on the home page that tells a visitor "here is YOUR path." Donor, volunteer, and congregation audiences all need explicit lanes. This section creates that clarity.

**Placement:** Between "How RCAN Assists" and the story block — after the page has explained what RCAN does, before the emotional anchor.

**Structure:** Three equal tiles, `<article>` elements inside a `<section>`.

The section heading is **visible**, using the standard `.section-title` pattern for consistency with every other labeled section on the page. An sr-only heading would weaken scannability — a visitor scrolling past needs to know at a glance that this group of tiles answers "how do I get involved?"

```html
<section aria-labelledby="engage-heading">
  <h2
    id="engage-heading"
    class="section-title text-base font-semibold uppercase tracking-widest text-text-subtle"
  >
    Get involved
  </h2>
  <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
    <!-- DONATE tile -->
    <article
      class="rounded-lg bg-surface-subtle px-5 py-6 hover:shadow-md transition-shadow duration-200"
      aria-labelledby="engage-donate-heading"
    >
      <p class="text-xs font-semibold uppercase tracking-widest text-brand-secondary">Donate</p>
      <h3 id="engage-donate-heading" class="mt-1 text-base font-semibold text-text-default">
        Give to the RCAN Fund
      </h3>
      <p class="mt-2 text-sm leading-6 text-text-subtle">
        Every gift goes directly to urgent client needs — housing, food, emergency funds, and more.
      </p>
      <a
        href="/donate"
        class="mt-4 block text-sm font-medium text-text-link underline underline-offset-2 hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        >Give now →</a
      >
    </article>

    <!-- VOLUNTEER tile -->
    <article
      class="rounded-lg bg-surface-subtle px-5 py-6 hover:shadow-md transition-shadow duration-200"
      aria-labelledby="engage-volunteer-heading"
    >
      <p class="text-xs font-semibold uppercase tracking-widest text-brand-secondary">Volunteer</p>
      <h3 id="engage-volunteer-heading" class="mt-1 text-base font-semibold text-text-default">
        Serve a returning citizen
      </h3>
      <p class="mt-2 text-sm leading-6 text-text-subtle">
        Become a Prison Friend or respond to specific client requests through your congregation.
      </p>
      <a
        href="/get-involved"
        class="mt-4 block text-sm font-medium text-text-link underline underline-offset-2 hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        >Get involved →</a
      >
    </article>

    <!-- CONGREGATION tile -->
    <article
      class="rounded-lg bg-surface-subtle px-5 py-6 hover:shadow-md transition-shadow duration-200"
      aria-labelledby="engage-congregation-heading"
    >
      <p class="text-xs font-semibold uppercase tracking-widest text-brand-secondary">
        Congregations
      </p>
      <h3 id="engage-congregation-heading" class="mt-1 text-base font-semibold text-text-default">
        Join the network
      </h3>
      <p class="mt-2 text-sm leading-6 text-text-subtle">
        If your congregation is in the DC, MD, or VA area, RCAN welcomes new partners committed to
        social justice.
      </p>
      <a
        href="/get-involved"
        class="mt-4 block text-sm font-medium text-text-link underline underline-offset-2 hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        >Learn how →</a
      >
    </article>
  </div>
</section>
```

**Hover:** `hover:shadow-md transition-shadow duration-200` on each tile. No `transform`, no lift.

**Scroll animation:** Fade in on scroll (see Section 7). The three tiles animate together as a group, not individually staggered — staggered delays on low-motion devices feel like jank.

---

### 5. Story block — Verify dark background, no content changes

**Action item only:** Confirm `StoryBlock` with `background="invert"` is rendering the dark tile (`bg-surface-invert` = `#162824`) in the browser. The component code is correct — this may have been a dev server state issue during screenshot capture. If it is visually broken, the fix is in the component or a Tailwind purge issue; the index.astro code does not need to change.

No content or copy changes to this section.

---

### 6. Prison Friendship Project Teaser — Second stat + supporting line

**Change 1 — Add second stat:**

The current stat display shows only "23 new matches in 2025." Add "40 active matches" directly below it to show both growth and current scale. Update the `<dl>` in the teaser to stack two stats:

```html
<dl class="shrink-0 space-y-3 text-center">
  <div>
    <dd class="text-3xl font-bold text-brand-secondary">23</dd>
    <dt class="mt-1 text-xs text-text-subtle">new matches in 2025</dt>
  </div>
  <div>
    <dd class="text-2xl font-bold text-brand-secondary">40</dd>
    <dt class="mt-1 text-xs text-text-subtle">active matches</dt>
  </div>
</dl>
```

**Note on `<dd>` before `<dt>` ordering:** Strictly, the HTML spec places `<dt>` (term) before `<dd>` (description). For visual stats, number-first matches natural reading order ("361 clients helped" is how you read it aloud) and is the established pattern throughout this site (see `about.astro` and `StatStrip.astro`). Changing it would create an inconsistency with existing code. Keep number-first. Ensure the parent `<dl>` or each `<div>` wrapper has an `aria-label` providing the full phrase (e.g. `aria-label="23 new Prison Friendship matches in 2025"`) so screen reader users hear the complete stat regardless of DOM order.

Give the `<dl>` column `min-w-36` (9rem / 144px from Tailwind default scale) so both stats display cleanly when the description text wraps.

**Change 2 — Add supporting line to description:**

Append to the existing description paragraph (after "across distance"):

> RCAN provides match guidance, client background, and access to social workers and attorneys throughout the friendship.

This answers the unspoken question — "what support will I get?" — that hesitant volunteers need to hear before committing.

---

### 7. CTA Block — New heading and body copy

**Heading:** "Stand with returning citizens."

**Body:** "Donations fund emergency needs. Volunteers build connections. Every contribution — of any kind — makes a difference."

**Button labels:** Keep "Donate" (primary) and "Get involved" (secondary). No structural change.

This is a `CTABlock` component props change only:

```astro
<CTABlock
  heading="Stand with returning citizens."
  body="Donations fund emergency needs. Volunteers build connections. Every contribution — of any kind — makes a difference."
  primaryLabel="Donate"
  primaryHref="/donate"
  secondaryLabel="Get involved"
  secondaryHref="/get-involved"
  background="subtle"
/>
```

---

## Animation & Microinteraction Spec

| Effect             | Elements                       | Implementation                                                        | Motion guard                                                                                                         |
| ------------------ | ------------------------------ | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Count-up on scroll | Stats strip                    | IntersectionObserver + rAF, triggers once                             | `prefers-reduced-motion` → show final value, skip observer                                                           |
| Scroll fade-in     | Three-engage tiles, PFP teaser | `opacity-0 → opacity-100`, 300ms, threshold 0.1, IntersectionObserver | `prefers-reduced-motion` → skip, elements visible by default                                                         |
| Hover shadow       | Engage tiles                   | `hover:shadow-md transition-shadow duration-200`                      | Covered by `global.css` nuclear override — no per-element guard needed                                               |
| Hover color        | All inline links               | `hover:text-brand-accent` — already implemented                       | Covered by `global.css` nuclear override                                                                             |
| Smooth scroll      | All anchor links               | `scroll-behavior: smooth` in CSS                                      | `global.css` nuclear override already sets `scroll-behavior: auto !important` under `prefers-reduced-motion: reduce` |

**Motion guard strategy — why CSS-only effects need no additional guards:**
`global.css` contains a nuclear `@media (prefers-reduced-motion: reduce)` rule that sets `animation: none !important`, `transition: none !important`, and `scroll-behavior: auto !important` on every element. This covers all Tailwind utility transitions (`transition-shadow`, `transition-colors`, `transition-opacity`) automatically. No per-element CSS guard is ever needed — the global rule is the guard.

JS-driven effects (count-up, scroll fade-in) are **not** covered by CSS rules and require explicit `window.matchMedia('(prefers-reduced-motion: reduce)').matches` checks in their scripts. Both are already specified above.

**Scroll fade-in implementation note:** Elements that scroll-animate must have a non-JS fallback. Set `opacity-0` via a JS-applied class (`js-fade`), not via Tailwind utility directly, so the element is visible when JS is disabled or blocked. Pattern:

```js
// Only hide if JS is available
document.querySelectorAll("[data-fade]").forEach((el) => el.classList.add("opacity-0"));

const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove("opacity-0");
        entry.target.classList.add("transition-opacity", "duration-300");
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 },
);

document.querySelectorAll("[data-fade]").forEach((el) => obs.observe(el));
```

Add `data-fade` attribute to the engage tiles wrapper and the PFP teaser section in the HTML.

---

## Accessibility Checklist

- [ ] Count-up spans: `aria-live="off"` on animated `<span>`, `aria-label` with final value on parent `<dd>`
- [ ] Engage tiles: each `<article>` has `aria-labelledby` pointing to its `<h3>`
- [ ] Engage section: `<section aria-labelledby="engage-heading">` with visible `<h2 id="engage-heading" class="section-title ...">`
- [ ] All new links: `focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2`
- [ ] PFP dual stats: both `<div>` pairs inside a single `<dl>` (already the case in spec above)
- [ ] `prefers-reduced-motion`: honored for count-up and scroll fade-in
- [ ] Scroll fade-in: non-JS fallback — elements visible without JavaScript
- [ ] Heading hierarchy: H1 (page) → H2 (sections, some sr-only) → H3 (tiles) — no skips
- [ ] Faith anchor `<p>`: `aria-hidden="true"` — it is decorative context, not navigational. Screen readers do not need to announce it mid-flow between the hero CTAs and the stats strip.

---

## Implementation Order

1. **Verify story block dark bg** — open browser, confirm `bg-surface-invert` tile is visible; fix if not (5 min or less)
2. **Stats count-up** — isolated `<script>` inside `StatStrip.astro`; test with and without `prefers-reduced-motion`
3. **Hero changes** — paragraph order swap + faith anchor line
4. **"How RCAN Assists"** — swap button to text link + add 2 footer lines
5. **Three-engage section** — new `<section>` inserted in `index.astro` between assists and story
6. **PFP teaser** — second stat + supporting sentence
7. **CTA block** — props update only
8. **Scroll fade-in** — add `data-fade` attributes + `<script>` block; test with JS disabled
9. **`astro check` + `eslint` + Lighthouse pass**
