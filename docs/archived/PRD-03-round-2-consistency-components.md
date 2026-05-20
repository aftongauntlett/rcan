# PRD: Round 2 — Consistency, Reusable Components & Per-Page Improvements

## Overview

This PRD captures feedback from a full site review. The driving principle is **component reuse over per-page custom code**: when a layout pattern or visual block is redesigned, it should update everywhere simultaneously. Before any implementation starts, existing pages must be audited and shared patterns extracted into components.

This document is organized as: (1) reusable component specs, (2) global changes, (3) per-page changes. Work top-down — components first, then apply them page by page.

---

## Design Principles

1. **One component, many pages.** If the same pattern appears on two or more pages, it is a component. No copy-pasting layout code across `.astro` files.
2. **Consistent vertical rhythm.** Every `<section>` inside a page gets the same top margin. Sections never touch. Standard gap between sections: `mt-12 md:mt-16`.
3. **Use the dark surface.** `bg-surface-invert` (`#162824`) is currently unused across the site. Use it on at least one section per content-heavy page to break up white space and add visual depth.
4. **Stats are data, not decoration.** Stat blocks should be plain, high-contrast numbers with a small label — no animation, no counting up. The `CountUpScript` adds complexity with minimal payoff; remove it.
5. **Donate route is `/donate`.** No external NYAPC links on buttons. Every donate CTA links to `/donate`; the donate page is the single handoff point to the payment provider.

---

## Section 1 — Reusable Components to Create or Refactor

### 1.1 `StatStrip.astro`

**Current state:** The stat numbers pattern is hand-coded in both `index.astro` and `impact.astro`, and duplicated inside `get-involved.astro` for the Prison Friendship Project mini-stats. Each uses slightly different markup.

**New component spec:**

```
Props:
  stats: Array<{
    prefix?: string       // e.g. "$"
    value: string         // display value, e.g. "25,000+"
    label: string         // e.g. "contributed to the RCAN Fund in 2025"
    highlight?: boolean   // if true, use brand-secondary color
  }>
  layout?: "strip" | "grid"   // strip = horizontal row; grid = 2x2 or 4-col
  background?: "none" | "subtle" | "invert"
```

**Visual spec — `background="subtle"` (home page):**

- Each stat in its own pill/tile: `rounded-lg bg-surface-default px-5 py-4 shadow-sm`
- Value: `text-3xl font-bold text-brand-secondary`
- Label: `text-sm text-text-subtle mt-1` (allow 2 lines — do not truncate)
- Layout: `grid grid-cols-2 sm:grid-cols-4 gap-4` with the outer container getting `bg-surface-subtle rounded-lg p-4`

**Visual spec — `background="invert"` (impact page):**

- Full-width dark strip: `bg-surface-invert py-10 px-6`
- Value: `text-3xl font-bold text-text-invert`
- Label: `text-sm text-neutral-300 mt-1`
- Layout: `flex flex-wrap justify-center gap-x-12 gap-y-6`

**Remove `CountUpScript` entirely.** The count animation adds JavaScript load, causes accessibility issues with screen readers mid-count, and provides no meaningful UX improvement. Replace all `data-count-to` spans with static formatted values.

---

### 1.2 `CTABlock.astro`

**Current state:** A centered CTA section appears at the bottom of: `index.astro`, `how-we-help.astro`, `impact.astro`, `contact.astro`. Each is hand-coded with different markup and button combinations.

**New component spec:**

```
Props:
  heading: string
  body?: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel?: string
  secondaryHref?: string
  background?: "subtle" | "invert"   // default: "subtle"
```

**Visual spec — `background="subtle"` (default):**

- `<section class="rounded-lg bg-surface-subtle px-6 py-10 text-center md:px-8 md:py-12">`
- Heading: `text-xl font-semibold text-text-default`
- Body: `mx-auto mt-3 max-w-2xl text-base leading-7 text-text-subtle`
- Buttons row: `mt-6 flex flex-wrap items-center justify-center gap-3`

**Visual spec — `background="invert"`:**

- `<section class="bg-surface-invert px-6 py-10 text-center md:px-8 md:py-12">`
- Heading: `text-xl font-semibold text-text-invert`
- Body: `text-neutral-300`
- Primary button: use `variant="primary"` (teal — readable on dark bg)
- Secondary button: use `variant="secondary"` with inverted border (`border-neutral-400 text-text-invert hover:bg-neutral-800`)

---

### 1.3 `StepList.astro`

**Current state:** The 3-step "congregations participate" / "congregation commitments" pattern is duplicated in `index.astro` and `get-involved.astro` with identical markup.

**New component spec:**

```
Props:
  steps: Array<{ label?: string; description: string }>
  accentColor?: "secondary" | "primary"   // default: "secondary"
```

**Visual spec (unchanged from current best implementation):**

```html
<ol class="mt-6 space-y-6 border-l-2 border-brand-secondary pl-6">
  <li>
    <p class="text-sm font-semibold uppercase tracking-wide text-brand-secondary">Step 1</p>
    <p class="mt-1 text-base leading-7 text-text-subtle">…</p>
  </li>
</ol>
```

---

### 1.4 `StoryBlock.astro`

**New component — impact page stories and any future story content.**

```
Props:
  heading: string
  intro?: string              // optional paragraph before quote(s)
  quotes: Array<{
    text: string
    attribution: string
    accentColor?: "secondary" | "primary"   // border-l color
  }>
  image?: {
    src: ImageMetadata
    alt: string
  }
  imagePosition?: "left" | "right"   // default: alternates; pass explicitly to override
  background?: "none" | "subtle" | "invert"
```

**Visual spec (no image):**

- Story heading: `text-lg font-semibold text-text-default`
- Quote: `mt-4 border-l-4 border-brand-secondary pl-6 text-base italic leading-8 text-text-default`
- Attribution: `mt-3 pl-6 text-sm text-text-subtle`

**Visual spec (with image, imagePosition="right"):**

```
[Quote column — 3fr] [Image column — 2fr]
```

- Outer: `grid gap-8 lg:grid-cols-[3fr_2fr] lg:items-start`
- Image: `rounded-lg shadow-md overflow-hidden min-h-60 relative`

**Visual spec (with image, imagePosition="left"):**

```
[Image column — 2fr] [Quote column — 3fr]
```

**Visual spec (background="invert"):**

- Wrap the whole story in `<div class="bg-surface-invert rounded-lg px-6 py-8 -mx-4 sm:mx-0">`
- All text classes swap to `text-text-invert` and `text-neutral-300`
- Quote border: `border-brand-accent`

---

### 1.5 `BulletList.astro`

**Current state:** The accent-dot bullet pattern (`h-1.5 w-1.5 rounded-full bg-brand-secondary`) is used in six different files with identical markup but no shared component.

**New component spec:**

```
Props:
  items: string[]
  size?: "sm" | "base"   // text-sm or text-base; default: "base"
  columns?: 1 | 2        // CSS columns; default: 1
```

---

## Section 2 — Global Changes

### 2.1 Section spacing standard

Every page currently has inconsistent vertical rhythm. Sections sometimes touch (notably `get-involved.astro`). Establish this standard:

- First `<section>` on a page: `py-10 md:py-14` (hero section)
- Subsequent sections: add `mt-12 md:mt-16` to each `<section>` element, OR wrap all sections in a `<div class="space-y-12 md:space-y-16">` inside `<main>`
- **Preferred approach:** update `BaseLayout.astro` or `ContentLayout.astro` to add `space-y-12 md:space-y-16` to the `<main>` content wrapper, so pages automatically get consistent spacing.

**Check `BaseLayout.astro`:** If `<main>` currently has `space-y-10` or similar, update to `space-y-12 md:space-y-16` and remove per-section `py-10` top padding where it creates double-spacing.

### 2.2 Donate button routing

All `Button` components that currently link to `https://nyapc.org/give/` must be updated to `href="/donate"`. This includes:

| File                          | Current href                   | New href                                    |
| ----------------------------- | ------------------------------ | ------------------------------------------- |
| `src/pages/index.astro`       | `https://nyapc.org/give/`      | `/donate`                                   |
| `src/pages/donate.astro`      | `https://nyapc.org/give/` (×2) | `/donate` — **replace with Donorbox embed** |
| `src/pages/contact.astro`     | `https://nyapc.org/give/`      | `/donate`                                   |
| `src/components/Header.astro` | already `/donate` ✓            | —                                           |
| `src/pages/impact.astro`      | already `/donate` ✓            | —                                           |

---

## Section 3 — Per-Page Changes

### 3.1 Donate Page (`/donate`)

**Goal:** Make `/donate` the canonical donation destination. All buttons across the site lead here. This page handles the actual payment handoff.

**Changes:**

1. **Replace "Ways to give" section with a Donorbox embed section.**
   - Remove the two-card grid (Online card + Mail card).
   - Replace with a full-width Donorbox embed using `<iframe>` (placeholder until live account is ready).
   - Keep the mail address as a secondary option _below_ the embed.
   - Section heading: `"Give to RCAN"` with subtitle `"Support is processed securely through Donorbox."`

2. **Remove the "Give online now" button** from the hero — the page itself _is_ the donation action. Replace hero CTA with a smooth-scroll anchor link to the embed: `href="#donate-form"` with label `"Give now"`.

3. **Placeholder Donorbox embed markup** (replace when campaign URL is known):

   ```html
   <!-- PLACEHOLDER: Replace src with your live Donorbox campaign embed URL -->
   <!-- e.g. src="https://donorbox.org/embed/rcan-returning-citizens" -->
   <div
     id="donate-form"
     class="rounded-lg border border-border-default bg-surface-subtle px-6 py-8"
   >
     <div
       class="flex min-h-96 items-center justify-center rounded-md border-2 border-dashed border-border-default"
     >
       <div class="text-center space-y-3">
         <p class="text-sm font-semibold uppercase tracking-wide text-text-subtle">
           Donorbox Embed
         </p>
         <p class="text-base text-text-subtle max-w-sm">
           Donation form will appear here once the Donorbox campaign is configured.
         </p>
         <p class="text-xs text-text-subtle">
           Replace this block with the Donorbox iframe embed code.
         </p>
       </div>
     </div>
   </div>
   ```

4. **Keep "What your gift supports"** but use `BulletList.astro` instead of 3 Card wrappers.

5. **Mail address** — keep at bottom as a simple card:
   ```
   [ONLINE]           [BY MAIL]
   Donorbox embed     Address block
   ```
   Actually move mail address to a small footer note beneath the embed, not a full card.

---

### 3.2 Impact Page (`/impact`)

**Goal:** Human, story-driven page. Break up the white. Use images alongside stories rather than sequestered at the bottom.

#### Remove the count-up stats section

Delete the entire `<section class="rounded-lg bg-surface-subtle ...">` containing the 4 count-up stats. This section is now redundant with the stats shown on the home page and adds nothing at the top of a story page.

**Instead:** Integrate a slimmer stat line within the hero text, e.g. a single line:

> "In 2025, RCAN helped **361 clients** and contributed **$25,000+** to the RCAN Fund."

#### Restructure stories with alternating image layout

Remove the current flat story list. Replace with alternating `StoryBlock` instances, pairing each story with the image currently buried at the bottom of the page:

| Story                    | Image                                      | Position    |
| ------------------------ | ------------------------------------------ | ----------- |
| TW and His Family        | None — use `background="invert"` dark tile | —           |
| Mr. E.                   | None — plain left-border blockquote        | —           |
| Ms. Davenport's Birthday | `cake-gift.jpg`                            | Image right |
| Holiday Gifts at YSC     | None — plain                               | —           |

#### Restructure Program Highlights with images inline

| Highlight            | Image                                     | Treatment                 |
| -------------------- | ----------------------------------------- | ------------------------- |
| Beauty Behind Bars   | `beauty-behind-bars.jpg` + `painting.jpg` | Image right, side by side |
| Bike Ministry        | `bike-bags-gift.jpg`                      | Image left, text right    |
| Second Chance Event  | None                                      | —                         |
| Gift Cards — $15,325 | None                                      | —                         |
| Material Support     | None                                      | —                         |

**The last three highlights (Second Chance, Gift Cards, Material Support)** are short text entries with no image and currently feel disconnected. Combine them into a single `bg-surface-invert` dark section:

```
[ADDITIONAL HIGHLIGHTS — invert bg]
  Three columns (sm: 1-col, md: 3-col), each with a small header and 1–2 sentence description.
  No images. The dark background provides contrast and groups them visually.
```

#### Add dark background variety

- Use `bg-surface-invert` for: (1) the "TW and His Family" story (strong anchor for the stories section), and (2) the combined Second Chance/Gift Cards/Material Support section.
- The hero, Mr. E, Ms. Davenport, Beauty Behind Bars, and Bike Ministry all remain on white/subtle.
- CTA block at the bottom: use `background="invert"` variant of `CTABlock`.

---

### 3.3 About Page (`/about`)

**Goal:** The page is structurally solid. Key issues: the "How RCAN Came Together" and "Holiday Gift Program" sections feel identical (same `bg-surface-subtle` tile), and the holiday gift program has a large image with very little text, which looks unbalanced.

#### Differentiate "How RCAN Came Together"

- Keep the current `bg-surface-subtle` rounded block with prose treatment.
- **Add:** a pull-quote or highlighted stat to give it weight: e.g. `"Founded 2018 · 22 congregations · DC, Maryland, and Virginia"` as a small `text-sm uppercase tracking-wide` annotation.
- This section should feel like a brief historical note — keep it short.

#### Redesign "Holiday Gift Program"

The current treatment (short text left, tall image right inside `bg-surface-subtle`) creates imbalance. Two options — choose one:

**Option A (recommended): Full-width image banner with overlaid text**

- Use the bag-of-gifts image as a wide background with a dark overlay:
  ```html
  <section class="relative overflow-hidden rounded-lg" aria-labelledby="gift-program-heading">
    <image class="absolute inset-0 h-full w-full object-cover" ... />
    <div class="relative bg-surface-invert/80 px-8 py-10">
      <h2 ...>Holiday Gift Program</h2>
      <p class="text-text-invert/90 ...">...</p>
    </div>
  </section>
  ```

**Option B: Dark tile with stat highlight**

- Give this section `bg-surface-invert` background (matching the dark treatment used on impact page).
- Text becomes `text-text-invert`. Add a large stat: **"51"** adults and children received gifts in 2025.
- This pairs it visually with the RCAN Fund section and gives the page a dark-light-dark rhythm.

#### Section flow recommendation

Current order:

1. Hero (white)
2. How RCAN Came Together (subtle)
3. Holiday Gift Program (subtle) ← looks same as #2
4. The RCAN Fund (white)
5. Board of Directors (subtle)
6. Participating Congregations (white)
7. Shared Identity (subtle)

**Recommended order with visual rhythm:**

1. Hero (white)
2. How RCAN Came Together (subtle — brief prose)
3. Holiday Gift Program (**invert** — stand-alone dark tile)
4. The RCAN Fund (white — image + prose + quote)
5. Board of Directors (subtle)
6. Participating Congregations (white)
7. Shared Identity (subtle)

This creates: white → subtle → **dark** → white → subtle → white → subtle — alternation that keeps the page interesting.

---

### 3.4 Get Involved Page (`/get-involved`)

**Goal:** Sections are currently touching with no gap. Ways to Help and Congregation Commitments don't flow well. Prison Friendship Project feels disconnected.

#### Section spacing

Apply the global section spacing standard (see §2.1). All sections need breathing room. Currently the hero `<section>` runs directly into "Ways to help" `<section>` — there is zero margin between them.

#### Ways to Help — improve layout

The current 2×2 icon grid is workable but the section runs directly into "Congregation Commitments" with no visual separation.

**Change:**

- Add `mt-12 md:mt-16` between "Ways to help" and "Congregation commitments"
- Consider giving "Ways to Help" a `bg-surface-subtle rounded-lg px-6 py-8` wrapper so it reads as a contained block separate from the commitments.

#### Congregation Commitments — minimal change

The current left-border step list is clean. Just needs vertical spacing from the section above. No structural change needed.

#### Prison Friendship Project — layout refinements

Current issues in the section:

1. The stats (`23 / 40`) appear inline within the intro text column, pushing the image down.
2. The "What Prison Friends do" / callout split uses `lg:grid-cols-[3fr_2fr]` but the right column only has a single callout quote and a button — too much whitespace.

**Changes:**

1. Move the `23 / 40` stats below the image, full-width, as a `StatStrip` with `background="none"`.
2. For "What Prison Friends do": make right column the "Become a Prison Friend" CTA card with more content — add: `"RCAN provides support materials, client background, and correspondence guidance."` This fills the whitespace and makes the CTA more contextual.
3. Give the prison friendship project section `border-t-2 border-brand-secondary` above the intro to visually separate it from "Congregation Commitments."

---

### 3.5 Home Page (`/`)

**Goal:** Nicer stats row, more even bullet text, reconsider what to feature given the depth of content on other pages.

#### Stats row — add per-stat tiles

Currently stats sit in a grid with no background, separated only by a top border line. On a white page this is easy to overlook.

**Change:** Wrap each stat in a tile:

```html
<div class="rounded-lg bg-surface-subtle px-5 py-4">
  <dd class="text-3xl font-bold text-brand-secondary">361</dd>
  <dt class="mt-1 text-sm text-text-subtle">clients helped in 2025</dt>
</div>
```

Grid: `grid grid-cols-2 gap-4 sm:grid-cols-4 mt-10`  
Remove the `border-t border-border-default pt-8` — the tiles provide their own visual separation.

#### "How RCAN Assists" — normalize bullet lengths

Current bullets have very uneven lengths — some fit one line, others wrap to three. Target: **all bullets wrap to exactly 2 lines at 1280px viewport**. Rewrite to approximately 10–14 words each:

| Current                                                                                              | Revised (≈2 lines at md breakpoint)                                             |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| "Providing clothes and food for those just out of prison"                                            | "Providing clothing, food, and personal essentials to people newly released"    |
| "Giving informal life-skills counseling or short-term mentoring"                                     | "Offering life-skills counseling and short-term mentoring relationships"        |
| "Helping to find an apartment or paying an application fee or security deposit"                      | "Helping secure housing — application fees, security deposits, and furnishings" |
| "Writing and sending books to those who are still incarcerated"                                      | "Writing to and sending books for DC clients still serving time"                |
| "Collecting donated furniture to help furnish apartments for returning citizens"                     | "Collecting and delivering donated furniture for newly housed clients"          |
| "Providing funds to avoid eviction or helping with other emergency needs"                            | "Providing emergency funds to prevent eviction or meet urgent financial needs"  |
| "Helping with official documents or, under power of attorney, doing other tasks"                     | "Assisting with official documents or acting under power of attorney"           |
| "Assisting efforts to find work by navigating applications or connecting with prospective employers" | "Connecting clients to employers and navigating job applications together"      |

#### Reconsider home page content structure

The home page currently has four sections after the hero: stats, "How RCAN assists," "How congregations participate," CTA. With richer dedicated pages now built, the home page should function as a **narrative overview + invitation** rather than a duplicate of every page.

**Recommended new structure:**

1. **Hero** — unchanged (image + heading + 2 paragraphs + 2 CTAs)
2. **Stats strip** — redesigned tiles (see above)
3. **How RCAN helps** — keep the 2-column bullet list but trim to 6 items (remove 2 least distinctive bullets). Pair with a subtle `<p>` CTA: `"Read about the full range of support →"` linking to `/how-we-help`
4. **Impact highlight** — _new section_: pull one story from the impact page (e.g. a single blockquote from a PDS lawyer) with a dark `bg-surface-invert` background. This is the most emotionally compelling content on the site and it's currently not on the home page at all. Use `StoryBlock` with `background="invert"`.
5. **Prison Friendship Project teaser** — a brief `bg-surface-subtle` block: 1 sentence of context + `23 new matches in 2025` stat + `"Become a Prison Friend"` CTA. This surfaces one of RCAN's most distinctive programs on the entry point.
6. **CTA block** — `CTABlock` component, `background="subtle"`. Remove the current "Support this ministry" section with the mail address box — that information lives on `/donate`.

**Remove from home page:**

- The "How congregations participate" step list (it's on `/get-involved` — the home page doesn't need to explain the join process, just invite people to explore)
- The mail address box (lives on `/donate`)

---

## Section 4 — Implementation Order

Work in this sequence to maximize reuse:

1. **Create reusable components** (`StatStrip`, `CTABlock`, `StepList`, `BulletList`) — do not touch pages yet
2. **Global spacing** — update `BaseLayout.astro` main wrapper spacing
3. **Donate page** — Donorbox placeholder, remove external links
4. **Global donate button audit** — update all `https://nyapc.org/give/` hrefs to `/donate`
5. **Impact page** — remove count strip, restructure stories, add dark sections
6. **About page** — reorder sections, redesign Holiday Gift Program
7. **Get Involved page** — spacing fixes, PFP layout refinements
8. **Home page** — stat tiles, bullet copy edits, remove step list, add impact quote + PFP teaser
9. **Run `astro check` and `eslint`** — resolve all errors before shipping

---

## Section 5 — Open Questions (Resolve Before Implementation)

1. **Donorbox campaign URL** — what is the embed URL once the campaign is created? Placeholder uses a `<!-- REPLACE -->` comment.
2. **Board of Directors content** — real names/bios to populate the 4 placeholder cards on About.
3. **Home page impact quote** — confirm which story to feature on the home page (TW family quote recommended — it is the most direct and grateful).
4. **"Second Chance Event" image** — no image exists for this story. Confirm whether one will be provided or if the dark-tile treatment covers it.

---

## Section 6 — Accessibility & Quality Gates

All changes must pass:

- `astro check` — no TypeScript errors
- `eslint` — no lint errors (jsx-a11y rules enforced)
- All images have descriptive `alt` text
- All new `<section>` elements have `aria-labelledby` pointing to their heading
- No hardcoded color/spacing/font values (all Tailwind token classes)
- Keyboard navigation tested on all interactive elements
- Lighthouse accessibility: 100; SEO: 100; Performance: 95+
