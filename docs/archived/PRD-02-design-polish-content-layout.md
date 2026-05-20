# PRD: Design Polish & Content Layout Updates

## Overview

This PRD covers visual and layout changes to address client feedback after the initial site build. The core request is to reduce visual repetition, cut unnecessary card usage, let content breathe as prose, and give each page a distinct feel. A new Impact page is also specified here.

Content updates (copy, new page content, congregation list, board of directors) are tracked separately in `content.md`.

---

## Design Principles

These guide every decision in this PRD:

1. **Less scaffolding, more reading.** Cards and borders are load-bearing when they group genuinely separate items. They are noise when wrapped around individual list items or short paragraphs. Default to prose; reach for a card only when it adds real distinction.
2. **Each page has its own character.** Vary the opening treatment — not every page needs a two-column hero with a photo. Let content type drive layout.
3. **Quiet titles.** Prefer small, low-weight page labels (`text-sm uppercase tracking-wide`) over prominent `<h1>` headings that compete with the content. On some pages, the opening paragraph _is_ the introduction.
4. **Flow over structure.** Short lists of 3–8 items are better as prose or a simple unordered list than as a grid of bordered cards. Reserve grid layouts for genuinely parallel, scannable items (e.g., the congregation list).
5. **Respect existing tokens.** No hardcoded values. All changes use existing Tailwind token classes from `tailwind.config.ts`.

---

## Global Changes

### 1. Card component usage reduction

**Current pattern (used on every page):**

```astro
<Card class="group h-full transition-transform ...">
  <p class="flex items-start gap-3 ...">
    <Icon ... />
    <span>{item}</span>
  </p>
</Card>
```

**New default for list items:** remove the Card wrapper. Render list items as plain `<li>` with an optional leading accent — a colored left border rule, a subtle icon, or neither.

```astro
<!-- preferred for prose lists -->
<li class="flex items-start gap-3 text-base leading-7 text-text-subtle">
  <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-secondary" aria-hidden="true"></span>
  <span>{item}</span>
</li>
```

Reserve `<Card>` for:

- Congregation commitment / step-by-step sequences where distinct separation aids comprehension
- Board of Directors member profiles (image + bio)
- CTA blocks that must stand out from surrounding content

### 2. Hero section variation

**Current:** Every page opens with the same two-column layout — `SectionHeader` left, `<Image>` right, both inside a rounded bordered card.

**New rules by page:**

- Pages with a strong visual asset: keep the image, but use it editorially (full-bleed background tint, inline art, or pull-to-right without an outer card border).
- Text-first pages (About, Impact, Get Involved, Contact): open with a wide prose block, no image required. The eyebrow + heading + first paragraph _are_ the hero.

### 3. Section heading style

**Current:** `text-2xl font-semibold` section headings with a `section-title` class.

**New:** Reduce to `text-base font-semibold uppercase tracking-widest text-text-subtle` for section labels that introduce content (these are navigational signposts, not headings competing with the content). Reserve larger heading sizes for genuinely titled sections. Update only where section headings are purely labels.

---

## Per-Page Changes

### Home (`/`)

**Current issues:**

- The hero is wrapped in a bordered card (`rounded-lg border border-border-default bg-surface-subtle`), which makes the page feel boxed-in at the top.
- The "How RCAN assists" list renders each of 8 items inside its own Card with an icon and hover animation — heavy for a simple list.
- The stat callouts (`impactStats`) are individual bordered list items with hover lift.

**Changes:**

- Remove the outer card wrapper from the hero section. Let the two-column layout sit directly in the page flow with padding only.
- Replace the 8-item card grid for "How RCAN assists" with a clean two-column prose list using the accent dot style above.
- Replace the bordered stat `<li>` items with inline stat pairs — large numerals (`text-3xl font-bold text-brand-secondary`) with small labels below, no borders, separated by whitespace.
- Keep the hero image on this page — it is the main landing experience. Remove the outer `border` and `bg-surface-subtle` from the `<figure>` wrapper; let the image stand on its own with `rounded-lg shadow-lg` only.

### About (`/about`)

**Current issues:**

- Same hero pattern as every other page (image right, SectionHeader left, bordered card wrapper).
- "How RCAN came together" is a 3-col card grid with Step 1/2/3 labels — this is three sentences of linear prose forced into a grid.
- "Values in action" is a 2-col card grid with heart icons.

**Changes:**

- **Remove the hero image** from About. This page is about people and mission — open it with a wide, calm prose block. Use the `SectionHeader` eyebrow + heading, followed by 2–3 paragraphs of flowing text. No image column, no outer card.
- Replace the 3-col "How RCAN came together" card grid with a single prose paragraph (the content is already linear narrative — it should read as one).
- Replace the "Values in action" card grid with a simple indented list or inline prose.
- **Add: Board of Directors section.** Use `<Card>` here — each board member is a genuinely distinct item with image + name + bio. Placeholder cards until content is received. Layout: 2-col on desktop, 1-col on mobile.
- **Add: Participating Congregations section.** Clean multi-column list (`columns-2 md:columns-3`), no cards, no icons. Simple `text-sm text-text-subtle` with each congregation name as a line item.

### How We Help (`/how-we-help`)

**Current issues:**

- Hero pattern matches Home and Get Involved.
- "Types of support" — 8 items each in their own card.
- "Support pathway" — 3 cards for a 3-step process.

**Changes:**

- Keep the image but change the treatment: use a narrower image column ratio (`lg:grid-cols-[1fr_2fr]` → `lg:grid-cols-[3fr_2fr]`) so the text column dominates. Remove the outer bordered card from the section.
- Replace the 8-item assistance card grid with an unordered prose list split into two columns using CSS columns (`columns-1 sm:columns-2 gap-x-12`). No Card wrappers, no icons. Clean `text-base leading-7 text-text-subtle` list items with the accent dot.
- Replace the 3-col "Support pathway" card grid with a numbered description list:
  ```html
  <ol class="mt-6 space-y-6 border-l-2 border-border-default pl-6">
    <li>
      <p class="text-sm font-semibold uppercase tracking-wide text-brand-secondary">
        1. Request received
      </p>
      <p class="mt-1 text-base leading-7 text-text-subtle">...</p>
    </li>
    ...
  </ol>
  ```
- Keep the CTA block at the bottom but remove the card border — use `bg-surface-subtle` with generous padding and no border.

### Get Involved (`/get-involved`)

**Current issues:**

- Same hero pattern.
- "Ways to help" — 4 items each in their own card with icons.
- "Congregation commitments" — 3 items in cards.

**Changes:**

- **Remove the hero image.** Open with a wide prose block — a strong lead sentence followed by a paragraph. The image from this page can be repurposed elsewhere or used as a background treatment rather than a column.
- Replace "Ways to help" card grid with a prose paragraph that incorporates the 4 items as flowing text, or a simple list without cards.
- Replace "Congregation commitments" cards with a compact numbered list (these are 3 short commitments — they read clearly as a list without card scaffolding).
- **Add: Prison Friendship Project section** (new content from `content.md`). This section should feel distinct from the rest of the page. Use a subtle background block (`bg-surface-subtle rounded-lg px-6 py-8`) to set it apart — this is the one place on this page where a contained section is appropriate. Include: intro paragraphs, a "What Prison Friends do" list, a stat highlight (23 matches / 40 active), and a contact/sign-up CTA. Add `id="prison-friendship-project"` for deep linking.

### Impact (`/impact`) — New Page

**Page character:** Personal and human. This page should feel like reading stories, not viewing a report. No hero image. No card grids. Let the quotes carry the page.

**Layout spec:**

```
[Page label — small, quiet]
[Lead paragraph — 1–2 sentences]

[Story 1 heading — bold, medium weight]
[Blockquote — styled with left border accent, generous padding]
[Attribution — text-sm text-text-subtle, right-aligned or below]

[Story 2...]
...

[Program Highlights — section label]
[Each highlight: bold program name on one line, paragraph below. No cards, no grid.]

[Stats strip — 3–4 numbers inline, minimal, centered]
```

**Blockquote style:**

```html
<blockquote
  class="border-l-4 border-brand-secondary pl-6 text-base italic leading-8 text-text-default"
>
  "Quote text..."
</blockquote>
<p class="mt-3 pl-6 text-sm text-text-subtle">— Attribution</p>
```

**Stats strip (bottom of page or below intro):**

```html
<dl class="mt-10 flex flex-wrap justify-center gap-x-12 gap-y-6">
  <div class="text-center">
    <dd class="text-3xl font-bold text-brand-secondary">361</dd>
    <dt class="mt-1 text-sm text-text-subtle">clients helped in 2025</dt>
  </div>
  ...
</dl>
```

No Card wrappers on this page. The only structural element is the blockquote left border and the stats strip.

### Contact (`/contact`)

Review this page when working through the updates — ensure it does not use the card-per-item pattern for any list content. Apply the same prose-first principle.

---

## Navigation Changes

### Add Impact to primary nav

In `src/components/Header.astro`, add the Impact link to `navItems`:

```ts
const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/how-we-help", label: "How We Help" },
  { href: "/impact", label: "Impact" }, // ← add this
  { href: "/get-involved", label: "Get Involved" },
  { href: "/contact", label: "Contact" },
];
```

No dropdown needed at this time. Revisit if the site grows to 2–3 more pages that do not fit the primary nav.

---

## New Page: Impact (`/impact`)

Create `src/pages/impact.astro`. It should:

- Use `BaseLayout`
- Import no image assets (image-free page)
- Render stories as `<blockquote>` elements within `<article>` or `<section>` elements
- Render program highlights as `<section>` with `<h3>` bold titles and prose `<p>` descriptions
- Include the stats `<dl>` strip
- Include a closing CTA linking to `/get-involved#prison-friendship-project` and `/donate`
- Pass a descriptive `pageTitle` and `pageDescription` for SEO

---

## Image Placement

All source images live in `src/assets/`. Use Astro's `<Image>` component for every placement. Do not repeat a photo across pages — each image is assigned to exactly one location.

### Already in use (do not reassign)

| File                        | Page                           | Role                                                                           |
| --------------------------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `hands-holding.jpg`         | Home (`/`)                     | Hero image                                                                     |
| `faith.jpg`                 | About (`/about`)               | Hero image — remove if the About hero is refactored to prose-only per this PRD |
| `art-community.jpg`         | How We Help (`/how-we-help`)   | Hero image                                                                     |
| `community-is-strength.jpg` | Get Involved (`/get-involved`) | Hero image                                                                     |
| `gardening-community.jpg`   | Contact (`/contact`)           | Hero image                                                                     |
| `make-change.jpg`           | Donate (`/donate`)             | Hero image                                                                     |

### New placements — Impact page (`/impact`)

| File                     | Section                                 | Notes                                                                                                                                                                                                                                                                                                                                             |
| ------------------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `beauty-behind-bars.jpg` | Beauty Behind Bars highlight            | Group of PDS staff, RCAN volunteers, and returned clients holding artwork at St. Columba's. Place inline above or beside the highlight paragraph. alt: "PDS staff, RCAN volunteers, and recently returned clients show their artwork at the Beauty Behind Bars event at St. Columba's Episcopal Church."                                          |
| `painting.jpg`           | Beauty Behind Bars highlight            | Artist standing in front of his large colorful mural. Can appear as a second image in this same section (e.g., a two-image row) or immediately below the first. alt: "A recently returned PDS client stands beside his large mural on display at the Beauty Behind Bars exhibition."                                                              |
| `cake-gift.jpg`          | Ms. Davenport's Birthday story          | Person holding a purple birthday cake shaped like a hat. Place alongside or above the Davenport exchange quotes. alt: "An RCAN volunteer holds a purple birthday cake shaped like a hat, made for a PDS client."                                                                                                                                  |
| `bike-bags-gift.jpg`     | Bike Ministry / Holiday Gifts highlight | Pink children's bike surrounded by wrapped gifts and gift bags — represents both Manuel's bike donations and the annual holiday gift program. Place inline with the Bike Ministry or Holiday Gift highlight paragraph. alt: "A pink children's bicycle sits among wrapped holiday gift bags, donated by RCAN supporters for PDS client families." |

### New placements — other pages (text-breakers)

| File                | Page                           | Section                           | Notes                                                                                                                                                                                                                                                                                                                                          |
| ------------------- | ------------------------------ | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `holding-hands.jpg` | About (`/about`)               | RCAN Fund section                 | Hands clasped together — used in the source PDF alongside the Micah 6:8 quote and RCAN Fund contribution stats. Place as a modest inline figure (max-w-sm centered, or pull-right on desktop) within or just above the RCAN Fund prose block. alt: "Two people holding hands, representing the mutual support at the heart of RCAN's mission." |
| `bag-of-gifts.jpg`  | About (`/about`)               | Holiday Gift Program section      | Bags of holiday gifts. Place alongside the Holiday Gift Program paragraph. alt: "Holiday gift bags prepared by RCAN volunteers for PDS client families."                                                                                                                                                                                       |
| `bike-gifts.jpg`    | Get Involved (`/get-involved`) | Prison Friendship Project section | Bike and gifts photo — reinforces the tangible, personal giving theme. Place as a supporting image within or near the Prison Friendship Project section. alt: "Gifts and a bicycle prepared by RCAN supporters for PDS clients."                                                                                                               |

### Unplaced / reserved

| File                  | Notes                                                                                                    |
| --------------------- | -------------------------------------------------------------------------------------------------------- |
| `hand-shake-logo.jpg` | Very small (282×324). Hold — use only if a small illustrative mark is needed; do not stretch or upscale. |

---

## Out of Scope for This PRD

- Changing the color token system or brand palette
- Typography scale changes
- New component types beyond what is described above
- Mobile nav / hamburger menu redesign
- Animation or scroll behavior changes
- Any changes to `tailwind.config.ts`
- `astro check` / ESLint failures unrelated to these changes (fix but do not expand scope)

---

## Definition of Done

- [ ] Impact page exists at `/impact` and is linked in the nav
- [ ] Prison Friendship Project section added to `/get-involved` with `id="prison-friendship-project"`
- [ ] Board of Directors placeholder section added to `/about`
- [ ] Congregation list added to `/about`
- [ ] Card component removed from list-item contexts on all pages (Home, About, How We Help, Get Involved)
- [ ] No page opens with the identical two-column hero-with-image pattern (Home retains its image; About and Get Involved do not)
- [ ] All section label headings reviewed; verbose `<h2>` headings reduced to quiet label style where appropriate
- [ ] `npm run check` passes (astro check)
- [ ] `npm run lint` passes
- [ ] No hardcoded values introduced
