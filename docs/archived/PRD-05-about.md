# PRD: About Page — Phase 3

> **Note:** Ignore anything about the header/hero area — use the current implementation to stay consistent. Do not add or reinstate any dark (`bg-surface-invert`) CTA block at the bottom of pages; that pattern has been removed. If any remaining task references a dark closing box or `background="invert"` on CTABlock, skip it.

## Status - Complete

The About page is functionally complete and structurally sound. This PRD addresses visual rhythm, a pair of content conflicts introduced during previous rounds, an accessibility bug in the congregations list, and the missing page-closing CTA.

---

## `prefers-reduced-motion` — Project Status

**CSS side: fully covered.** `global.css` already has a nuclear override:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
```

This handles every CSS `transition` and `animation` on the entire site, including hover effects, the congregation icon fade, and any Tailwind utility transitions.

**JS side: covered per page.** The count-up animation on the home page requires a `window.matchMedia('(prefers-reduced-motion: reduce)').matches` check in its script, as documented in `docs/PRD-04-home.md`. The About page introduces no new JS-driven animations — no additional JS guards needed here.

**Known bug (fix in this PRD):** The congregation external-link icons use `opacity-0 transition-opacity group-hover:opacity-100`. When the CSS override removes `transition`, the icon is permanently `opacity-0` and invisible to reduced-motion users. See Section 6.

---

## Current State

| #   | Section                       | Background | Status                                         |
| --- | ----------------------------- | ---------- | ---------------------------------------------- |
| 1   | Hero — text left, image right | White      | ✓ Working                                      |
| 2   | How RCAN Came Together        | Subtle     | ✓ Working                                      |
| 3   | Holiday Gift Program          | Subtle     | ⚠ Two consecutive subtle tiles                 |
| 4   | The RCAN Fund                 | White      | ⚠ Blockquote uses right border (nonstandard)   |
| 5   | Board of Directors            | Subtle     | ✓ Placeholder acceptable until content arrives |
| 6   | Participating Congregations   | White      | ✗ External link icon accessibility bug         |
| 7   | Our Shared Identity           | Subtle     | ⚠ Weak page close — no CTA                     |
| —   | CTA block                     | —          | ✗ Missing                                      |

### Visual rhythm (current vs. target)

**Current:** White → Subtle → Subtle → White → Subtle → White → Subtle

**Target:** White → Subtle → **Invert** → White → Subtle → White → Subtle → **Invert** (CTA)

The Holiday Gift Program section moves to `bg-surface-invert` to break the double-subtle pattern. The new CTA block at the bottom also uses `invert`, creating a visual bookend that opens on white and closes on dark.

---

## Conflicts Resolved in This PRD

### Image assignment conflict

`community-is-strength.jpg` is currently used on the About hero. `docs/archived/PRD-02-design-polish-content-layout.md` originally assigned it to Get Involved. This is resolved here:

- **About keeps `community-is-strength.jpg`.** The "COMMUNITY IS STRENGTH." billboard is visually strong and fits the About page's congregation-network identity.
- **Get Involved goes prose-only.** `docs/archived/PRD-02-design-polish-content-layout.md` already specified removing the hero image from Get Involved — there is no conflict once that is implemented.

Update the image assignment table in `docs/archived/PRD-02-design-polish-content-layout.md` accordingly.

### Scriptural quote conflict

Micah 6:8 appears in the RCAN Fund section on About AND was proposed as a home page faith anchor in `docs/PRD-04-home.md`.

Resolution: **Micah 6:8 stays on About** where it is already established and well-placed. Update `docs/PRD-04-home.md` to use Matthew 25:35–36 as the home page faith anchor instead — it is equally appropriate (explicitly about visiting the imprisoned) and does not repeat the About page content.

Updated home page faith anchor:

```
"I was in prison and you came to visit me." — Matthew 25:36
```

---

## Section Specifications

### 1. Hero — Minor text refinement

**What's working:** Clean two-column layout, no card border, strong heading. Keep as-is structurally.

**Issue:** The hero carries two paragraphs of founding context that largely duplicate what the "How RCAN Came Together" section covers just below. The hero should establish identity and orientation; the history section fills in the detail.

**Change:** Trim to one founding paragraph. Keep the first ("In 2018, New York Avenue Presbyterian Church and Metropolitan AME Church worked with the Public Defender Service...") and remove the second ("RCAN generally engages with one or two cases each week..."). The second paragraph belongs in the history section, not the hero.

The `subheading` prop on `SectionHeader` ("RCAN responds to requests from the DC Public Defender Service and connects congregations with practical ways to support returning citizens.") already captures the mission concisely. One body paragraph after that is sufficient.

**No layout, image, or structural changes.**

---

### 2. How RCAN Came Together — Add the removed paragraph

**Change:** Add back the operational paragraph that was removed from the hero — it fits perfectly here as a second paragraph that explains how the network actually functions day-to-day:

> RCAN generally engages with one or two cases each week, with that number growing as more congregations and individuals join. RCAN shares information about each case with the full network; each congregation then determines for itself whether it is able to help with a particular case.

This keeps all founding/operational content together in one section where it belongs, rather than split across hero + history.

**No background or layout changes.**

---

### 3. Holiday Gift Program — Move to `bg-surface-invert`

**Rationale:** This section currently follows "How RCAN Came Together" on a `bg-surface-subtle` background, creating two consecutive identical tile treatments. Moving it to `bg-surface-invert` breaks the rhythm, visually elevates the stat (51), and makes the holiday program feel distinct — it is a specific, named program, not background context.

**Changes:**

1. Change the section background from `bg-surface-subtle` to `bg-surface-invert`.
2. Update all text classes to invert variants:
   - Section label: `text-text-invert` (was `text-text-subtle`)
   - Body paragraphs: `text-neutral-300`
   - Stat value: keep `text-brand-secondary` (rust on dark background — verify contrast: `#B14D2A` on `#162824` = ~4.6:1 ✓ passes AA for large text; if the label below needs AA for normal text, use `text-neutral-300` instead)
   - Stat label: `text-neutral-300`
3. Add `bag-of-gifts.jpg` image. This image was planned for this section in `docs/archived/PRD-02-design-polish-content-layout.md` but never implemented. Place it in the layout as a side image opposite the stat, or as a background treatment.

**Image placement spec:**

```
[HOLIDAY GIFT PROGRAM — invert bg, full-width]
  Grid: text column (flex-1) | stat + image column (shrink-0)

  Stat stack (stacked, not side-by-side):
    51          ← text-5xl font-bold text-brand-secondary
    adults and children received gifts in 2025  ← text-sm text-neutral-300

  Image: bag-of-gifts.jpg
    max-w-52 rounded-lg mt-4 mx-auto
    alt: "Holiday gift bags prepared by RCAN volunteers for PDS client families."
```

Place stat and image in the right column. On mobile, stack below the text paragraphs.

**Contrast verification for the stat label on invert bg:**
`text-neutral-300` = `#D2DAD6` on `#162824` = approximately 9.5:1 ✓ exceeds AAA.

---

### 4. The RCAN Fund — Fix blockquote direction

**What's working:** The image + text grid, the prose content, the donate link.

**Issue:** The blockquote uses `border-r-4` (right border, right-aligned text). This is the only right-border blockquote on the entire site. All other blockquotes on the site use `border-l-4` with left-aligned text. The nonstandard treatment is visually jarring when scrolling between pages.

**Change:** Replace `border-r-4 pr-6 text-right` with `border-l-4 pl-6 text-left` on the blockquote. Update the attribution paragraph to match: remove `text-right pr-6`, replace with `pl-6 text-left`.

This is a 4-character change to the class attributes — no structural impact.

**Note:** This is a raw `<blockquote>` element inline in `about.astro`, not a `StoryBlock` component. Do not confuse it with `StoryBlock.astro`'s `<figcaption>` attribution, which was updated to `text-right` during PRD-04 and should remain right-aligned. These are two different elements with intentionally different treatments.

**Updated blockquote:**

```html
<blockquote
  class="mt-6 border-l-4 border-brand-secondary pl-6 text-base italic leading-8 text-text-default"
>
  "Act justly, love mercy, and walk humbly."
</blockquote>
<p class="mt-2 pl-6 text-sm text-text-subtle">— Micah 6:8</p>
```

**No other changes to this section.**

---

### 5. Board of Directors — Document real-data structure

**Current state:** 4 placeholder cards are correct and acceptable until board member content is received.

**No visual changes needed now.** Document the real data structure so it is not invented when content arrives:

When board member bios and photos are received, replace the `Array.from({ length: 4 })` loop with a typed data array:

```typescript
interface BoardMember {
  name: string;
  title: string;
  bio: string;
  image?: ImageMetadata; // headshot; omit if not provided
}

const boardMembers: BoardMember[] = [
  {
    name: "...",
    title: "...",
    bio: "...",
    // image: import("../assets/board-member-name.jpg"),
  },
  // ...
];
```

The card layout stays the same — swap the placeholder icon div for an `<Image>` when `image` is provided, and populate `name`, `title`, `bio`. The `Card` component stays as the wrapper since board members are genuinely distinct items that benefit from containment.

---

### 6. Participating Congregations — Fix external link icon bug

**Bug:** External link icons are `opacity-0 transition-opacity group-hover:opacity-100`. When `prefers-reduced-motion: reduce` is active, the CSS override removes the `transition`, leaving the icons permanently at `opacity-0` — invisible to reduced-motion users and keyboard-only users who never trigger a hover state.

External link icons are accessibility affordances, not decoration. They tell users "this link leaves the site and opens in a new tab." They must always be visible.

**Fix — update icon class:**

Remove `opacity-0`. Replace with an always-visible base state. This follows the same principle applied in PRD-04: never use CSS to permanently hide an accessibility affordance. CSS reduced-motion override strips `transition`, leaving `opacity-0` elements invisible forever for those users.

```html
<!-- Before -->
<svg class="opacity-0 transition-opacity group-hover:opacity-100" ...>
  <!-- After -->
  <svg class="opacity-50 transition-opacity group-hover:opacity-100" ...></svg>
</svg>
```

`opacity-50` keeps the icon visually subordinate to the link text at rest while making it always visible. On hover, it transitions to full opacity. With `prefers-reduced-motion`, the transition is stripped but the icon remains at `opacity-50` — visible.

**Also add screen reader context to each external link.** `target="_blank"` without an announcement is a known WCAG 2.2 issue. Add `aria-label` that appends "(opens in a new tab)":

```html
<a
  href="{url}"
  class="group inline-flex items-center gap-1 hover:underline hover:text-text-default"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="{`${name}"
  (opens
  in
  a
  new
  tab)`}
>
  {name}
</a>
```

This is the only change to the congregations section.

---

### 7. Our Shared Identity — Remove image, strengthen copy, center layout

**Issue:** The handshake logo (`hand-shake-logo.jpg`) is 282×324px at source. Displaying it in a two-column grid at `max-w-xs` (320px) means it is being upscaled slightly on most screens. `docs/archived/PRD-02-design-polish-content-layout.md` noted: "Very small (282×324). Hold — use only if a small illustrative mark is needed; do not stretch or upscale."

**Change 1 — Reposition the logo:**

Remove it from the two-column grid. Display it centered below the values list at its natural display size (`max-w-56 mx-auto`). This respects the source resolution and keeps it as a mark, not a hero image.

```
[OUR SHARED IDENTITY — subtle bg]
  Label, heading
  Prose paragraph
  Values bullet list

  [Logo centered below, max-w-56, mt-6]
    RCAN handshake mark
```

On desktop: the section stays as a single column (`max-w-3xl`) with the logo centered beneath the content. No two-column grid.

**Change 2 — Strengthen the closing paragraph:**

Replace "RCAN is rooted in the conviction that practical support and faithful community can reshape reentry outcomes. This mark reflects the network's full name and shared commitment across congregations." with:

> RCAN is rooted in the conviction that practical support and faithful community can reshape reentry outcomes. Twenty-two congregations across DC, Maryland, and Virginia share this commitment — different in tradition, united in purpose.

This ties the values section back to the congregation count and closes the page with a statement of network strength, not a logo description.

---

### 8. NEW — CTABlock at page bottom

The About page currently ends on "Our Shared Identity" with no action to take. Every content page should close with a clear next step.

```astro
<CTABlock
  heading="Ready to be part of this?"
  body="Whether you want to join as a congregation, volunteer your time, or support the work with a gift — RCAN welcomes new partners."
  primaryLabel="Get involved"
  primaryHref="/get-involved"
  secondaryLabel="Donate"
  secondaryHref="/donate"
  background="invert"
/>
```

`background="invert"` creates the visual bookend with the dark Holiday Gift Program section above, and differentiates the close from the "Our Shared Identity" subtle tile immediately before it.

---

## Visual Rhythm — Final

| #   | Section                     | Background |
| --- | --------------------------- | ---------- |
| 1   | Hero                        | White      |
| 2   | How RCAN Came Together      | Subtle     |
| 3   | Holiday Gift Program        | **Invert** |
| 4   | The RCAN Fund               | White      |
| 5   | Board of Directors          | Subtle     |
| 6   | Participating Congregations | White      |
| 7   | Our Shared Identity         | Subtle     |
| 8   | CTA Block                   | **Invert** |

Pattern: White → Subtle → **Dark** → White → Subtle → White → Subtle → **Dark**

The two dark sections bracket the content without clustering. No two sections of the same treatment appear consecutively.

---

## Cross-Page Updates Required

| File                                                   | Change                                                                                                             |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `docs/PRD-04-home.md`                                  | Replace Micah 6:8 faith anchor with Matthew 25:36                                                                  |
| `docs/archived/PRD-02-design-polish-content-layout.md` | Update image assignment table: `community-is-strength.jpg` → About hero; Get Involved → prose-only                 |
| `src/pages/index.astro`                                | ~~Update faith anchor quote~~ **Already done — Matthew 25:36 is live in PRD-04 implementation. No action needed.** |

---

## Accessibility Checklist

- [ ] Congregation external link icons: `opacity-50` base state (always visible)
- [ ] Congregation links: `aria-label` includes "(opens in a new tab)"
- [ ] Holiday Gift Program invert section: all text meets WCAG AA contrast on `#162824`
- [ ] CTABlock invert: uses `variant="primary"` button (teal on dark — verified readable)
- [ ] Logo image `alt` describes the mark, not the page: "Two hands clasped in a handshake — the RCAN network mark."
- [ ] `bag-of-gifts.jpg` has descriptive `alt` text as specified in `docs/archived/PRD-02-design-polish-content-layout.md`
- [ ] All sections have `aria-labelledby` pointing to a visible or sr-only heading
- [ ] Board placeholder cards: maintain `aria-label` on the `<ul>` so screen readers identify the list

---

## Implementation Order

1. **Blockquote direction fix** (`border-r-4` → `border-l-4`) — 2 lines, zero risk
2. **Congregation icon fix** (`opacity-0` → `opacity-50`, add `aria-label`) — isolated change
3. **Hero text trim** — remove second paragraph from hero, add it to How RCAN Came Together
4. **Holiday Gift Program** — invert background + add `bag-of-gifts.jpg`
5. **Our Shared Identity** — reposition logo, update prose
6. **CTABlock** — add at bottom of page
7. **Cross-page PRD updates** — update Micah 6:8 → Matthew 25:36 in `docs/PRD-04-home.md` and home page implementation
8. **`astro check` + `eslint` + Lighthouse pass**
