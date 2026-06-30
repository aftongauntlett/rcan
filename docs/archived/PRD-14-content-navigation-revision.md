# PRD: Content & Navigation Revision (Client Notes Round)

## Purpose

Translate the client's raw notes (`notes.md`, root of repo) into an ordered, page-by-page implementation plan. The client's notes were written against an older draft structure and contained some duplicated and contradictory instructions — this PRD reconciled those against the live site (`src/pages/*.astro`) at the time.

**Status: approved, implementation underway.** Every item below is a final decision — see the [Decisions Log](#decisions-log) for the full record of how each one was resolved. Nothing here is still pending client or Afton sign-off. If you're picking this up fresh, read [Implementation Status](#implementation-status) first — it tells you what's already live in the codebase vs. what's still to build, so you don't redo finished work or treat resolved decisions as open. Then read [Design System Rollout](#design-system-rollout-about-page--rest-of-site) before touching any page besides About — it covers the visual patterns the About page now sets for the rest of the site.

---

## Implementation Status

**Done and live in code:**

- Sitewide: navbar + footer logo converted to HTML/CSS wordmark (with orange accent bar), old logo SVGs deleted
- Sitewide: section-title type scale bumped, consolidated into the shared `.section-title` CSS rule (no longer repeated inline per page)
- Who We Are: congregation list rebuilt as a card grid (chosen after comparing 3 live options), "Bread of Life Church" removed, congregation count now derived from data instead of hardcoded, "DC, Maryland, and Virginia" copy corrected to "Washington, DC" throughout this page, visited-link styling added to congregation cards

**In progress:**

- Congregation URL audit (Who We Are) — Afton is going through and fixing/confirming each congregation's URL directly in `who-we-are.astro` as a parallel task, not blocked on anything else here

**Done and live in code (cont'd):**

- About page content restructure — `about.astro` already has the full 3-part History/Motivation/Approach content (expanded founding narrative, all 5 scripture references, values renamed to "Our Approach"); no RCAN Fund section exists on this page in the current build, so there's nothing left to move to Donate on this front. The "Not started" status this used to carry was stale.
- About page visual/design pass — see [Design System Rollout](#design-system-rollout-about-page--rest-of-site) below. This is now the reference implementation for the rest of the site; read that section before touching any other page.
- Home page — tagline added under the H1 ("Giving a helping hand to those returning from incarceration."), hero paragraph left as the condensed version per the pushback recommendation below (no change needed there), "Bring your congregation" copy corrected from "DC, Maryland, or Virginia" to "Washington, DC" (missed by the original sitewide DC-only pass since Home wasn't in the locations list called out at the time — worth double-checking other pages for the same residual phrase). Visual/design pass done alongside the content change — see [Design System Rollout](#design-system-rollout-about-page--rest-of-site), Home is now the second page on the new patterns and two components were extracted in the process (`SectionTitle.astro`, `IconCardGrid.astro`) — see that section for details.
- How We Help page — done. Note for whoever picks this up next: an earlier session had already done substantial work here (Holiday Gifts/Beauty Behind Bars/Bike Ministry pulled in from Impact, "Types of support" deleted, Support Pathway moved to the top) but committed it inside a commit titled "home page redesign" without updating this doc, so it looked untouched on paper. This round verified the actual file state against the spec below and finished what was missing: Prison Friendship Project moved in from Get Involved (replacing the now-removed full section there with a "Learn more" link off the existing "Become a Prison Friend" list item), Second Chance Event cut entirely (removed from Impact, where it had lived), and a new "RCAN fun" section added (reusing the existing bag-of-gifts/bike photos in a lightweight 3-photo grid, per [Decisions Log](#decisions-log) #8). The hero also moved off `SectionHeader` onto the new centered `PageHeader.astro` (see Design System Rollout below).
- Impact page (partial) — the four program write-ups that belonged on How We Help (Holiday Gifts, Beauty Behind Bars, Bike Ministry, Second Chance Event) are removed now that they've landed there; the page is back to just the stats strip and Client Stories, matching the target end-state. The dead `initCarousels` script (no carousels left on the page) was removed too. Hero migrated to `PageHeader.astro` per Decisions Log #20 (was wrongly left on `SectionHeader`). Still pending: new stories/quotes/photos when that material exists — see "Not started yet."
- Get Involved page — "Ways to Help" consolidated from 6 items to the client's exact 4 (Become a Prison Friend, Engage your congregation, Provide direct assistance, Become an RCAN volunteer), merging the old heart/dollar-sign items into "Provide direct assistance" and the old user/book-open items into "Become an RCAN volunteer." Visual treatment migrated onto the design system: the section now uses `SectionTitle.astro` + `IconCardGrid.astro` (columns=4, label+description+cta) instead of the old left-aligned `.section-title` + `IconSupportList`, and the section's `bg-surface-subtle` tinted wrapper was dropped per the no-tinted-background pattern (same cleanup Home's "How RCAN assists" section got). Congregation Commitments section untouched (stays on `IconSupportList`/ordered steps per Decisions Log #11 — not a card-grid candidate). Hero migrated to `PageHeader.astro` per Decisions Log #20 (was wrongly left on `SectionHeader`, causing a sitewide page-header width inconsistency).
- Contact page — `topicOptions` synced to Get Involved's 4 labels (Become a Prison Friend / Engage your congregation / Provide direct assistance / Become an RCAN volunteer) plus "General question" as the catch-all; "Congregation partnership," "Volunteer interest," and "Referral question" are gone. Congregation field simplified per [Decisions Log](#decisions-log) #12: the topic-triggered show/hide (`getCongregationFieldState`, the `hidden`/`data-congregation-field` wrapper) is removed in favor of a single always-visible, optional "Congregation or organization (if any)" input. `getCongregationFieldState`/`CONGREGATION_PARTNERSHIP_TOPIC` deleted from `src/utils/contactInteractions.ts` (and their unit tests); the Playwright smoke test and `docs/wcag-audit.md`'s contact-form checklist item were updated to match the new always-visible/optional behavior instead of the old toggle. Hero migrated to `PageHeader.astro` per Decisions Log #20.
- Sitewide page-header width fix — Afton reported pages didn't feel cohesive because hero widths visibly differed across pages. Root cause and fix recorded in Decisions Log #20: Get Involved, Contact, and Impact's heroes were left on the unconstrained `SectionHeader.astro` under a mistaken "two-column hero" assumption from Decisions Log #14 that didn't match their actual markup (none have a side image). All three moved to `PageHeader.astro`; every `PageHeader` page now shares identical wrapper classes (`border-b border-border-default pb-10 pt-2 md:pb-12`) and `aria-labelledby` wiring — How We Help had drifted slightly on this and was also fixed. `SectionHeader.astro` now serves only Home's genuinely two-column hero plus a handful of internal subsection headers (e.g. Impact's "Client Stories").
- Donate page — turned out the RCAN Fund absorption itself was **already done**: `git log -- src/pages/donate.astro` showed the same "home page redesign" commit (`d45875c`) that quietly finished How We Help (see #15 below) had also folded the RCAN Fund founding detail into Donate's hero copy and added the "make checks payable to..." line to the existing mail-giving aside — another instance of the surprise-commit pattern. About's RCAN Fund section is confirmed fully gone (no address/donation content left there at all). What was still genuinely undone was the visual pass: the hero moved off `SectionHeader` onto `PageHeader.astro` (it's a plain-text hero, same shape as About/How We Help), "Give to RCAN" moved off the old `.section-title` onto `SectionTitle.astro` (it's a full-width heading over a two-column body, like Home's "How you can help"), and both that section's and "What your gift supports"'s `bg-surface-subtle` tinted wrappers were dropped per the no-tinted-background pattern. "What your gift supports" intentionally kept the old left-aligned `.section-title` rather than migrating to `SectionTitle.astro` — its heading is attached to one side of a two-column image+text layout (same shape as Get Involved's Congregation Commitments, which stayed on the old pattern for the same reason).
- Who We Are: board placeholder slots 4→9 — only 4 distinct placeholder photos exist (no real board member photos yet), so the array cycles through them to fill 9 slots; bios stay lorem ipsum until the client provides real ones. Visual pass done alongside: hero moved to `PageHeader.astro` (with a new descriptive H1 replacing the literal "Who We Are" repeat), "Board of Directors" and "Participating congregations" headings moved to `SectionTitle.astro`, Board section's `bg-surface-subtle` wrapper dropped. The per-card "Read more" toggle stays for now (Decisions Log #9 — removal is gated on real bios existing, which they don't yet) and the congregation URL audit remains Afton's separate parallel task, untouched here.

**Not started yet:**

- Impact page: new stories/quotes/case summaries (structural cleanup above is done; this is additive content that needs client-provided material)

This was the last code task in the recommended order — Home, About, How We Help, Get Involved, Contact, Donate, and Who We Are (except the bio-gated "see more" removal and Afton's parallel URL audit) are all done. All that's left sitewide is **Impact**'s new stories/quotes/case summaries, which is blocked on client-provided material rather than being an open implementation question. Four components now exist (`SectionTitle.astro`, `IconCardGrid.astro`, `PageHeader.astro`, plus `SectionHeader.astro` for two-column image+text heroes) — reach for them first if/when Impact's structure changes once new material arrives.

---

## Design System Rollout (About page → rest of site)

**Read this before touching Home, How We Help, Who We Are, Impact, Get Involved, Contact, or Donate.** The About page (`about.astro`) just went through a visual design pass that should become the template for every other page, per direct instruction from Afton. The goal is a site that feels like one designed product, not eight separately-styled pages — favor reusable components and cohesiveness over re-solving the same layout problem per page.

**Patterns established on About — replicate these elsewhere:**

1. **No gray/tinted page backgrounds.** `BaseLayout.astro`'s `html`/`body` no longer carry the `neutral-50` gradient, and `Footer.astro` now uses `bg-surface-default` (matching the navbar) instead of `bg-surface-subtle`. This is already sitewide — no per-page action needed, but don't reintroduce a tinted section background without a specific reason (the quote card below is an intentional, deliberate exception, not the default).
2. **Centered page header.** Eyebrow label (small uppercase, `text-brand-secondary`) + centered serif H1 + short centered accent-bar divider + centered subheading, in a `max-w-2xl mx-auto text-center` block with a `border-b border-border-default` closing it out. ✅ **Extracted** into `src/components/PageHeader.astro` (props: `id`, `eyebrow`, `heading`, optional `subheading`, optional `class`) when How We Help became the second page with a text-only hero (no side image) needing this shape. **Every page's hero is now on this component except Home's** — `about.astro`, `how-we-help.astro`, `donate.astro`, `who-we-are.astro`, `get-involved.astro`, `contact.astro`, and `impact.astro` all use it (see Decisions Log #20: Get Involved/Contact/Impact were originally left on `SectionHeader` based on a mistaken read that they had two-column image+text heroes like Home's — they don't, they're plain text, same shape as About). `SectionHeader.astro` now serves exactly one page-level hero sitewide: Home's, which is genuinely two-column (image left, text right). Every `PageHeader` instance shares the same section wrapper (`border-b border-border-default pb-10 pt-2 md:pb-12`, `aria-labelledby` pointing at the header's `id`) and the same narrow `mx-auto max-w-3xl` reading column for any body paragraphs below it — match this exactly on any future page's hero rather than approximating it, since inconsistent wrapper padding/width was exactly what made the site feel disjointed before this fix (see Decisions Log #20).
3. **Centered section titles.** Short centered uppercase label + small centered accent bar underneath, replacing the old left-aligned `.section-title` CSS rule (`global.css`) and its `::after` underline anchored at `left-0`. ✅ **Extracted** into `src/components/SectionTitle.astro` (props: `id`, `text`, optional `level` (2 or 3, default 2), optional `class`) when Home became the second page to use this pattern. `about.astro` (History/Motivation/Approach), `index.astro` ("How RCAN assists"/"How you can help"), `get-involved.astro` ("Ways to help"), `donate.astro` ("Give to RCAN"), and `who-we-are.astro` ("Board of Directors," "Participating congregations") all use it now — reuse it on every other page instead of hand-rolling the eyebrow-label-plus-bar markup again. The old `.section-title` CSS rule in `global.css` is still live — still used by Get Involved (Congregation Commitments), How We Help (Support Pathway, program write-ups), Impact, and Donate ("What your gift supports," intentionally kept for its two-column attached-heading shape — see Decisions Log #18) — don't remove it until those pages migrate too, and note some of those usages (like Donate's) are a deliberate keep, not a TODO.
4. **Narrow reading column for body copy.** Long-form paragraphs live in a `mx-auto max-w-3xl` wrapper, left-aligned (don't center body paragraphs — hurts readability past 1-2 lines). Centering is reserved for short ceremonial elements (titles, headers, captions), not prose.
5. **Ornamental paragraph dividers.** Small muted flanking lines + center dot (`brand-secondary/60`) between long paragraphs, used in History and the Motivation intro, to break up dense reading without a heavy rule.
6. **Quote card.** Scripture/testimonial quotes live in a single bordered, `bg-surface-subtle`-tinted rounded card (not individual boxes), right-aligned reference/attribution captions, separated by a fancier diamond-and-rule divider (longer lines, rotated diamond — distinct from the paragraph divider above). Strong candidate for Impact's client-story pull-quotes.
7. **Icon value-cards.** Bullet lists for values/features replaced with small cards (icon-in-circle + centered label) in a responsive grid. ✅ **Extracted** into `src/components/IconCardGrid.astro` (props: `items` — each `{ icon, label, description?, cta? }` — `ariaLabel`, optional `columns` (2/3/4, default 4), optional `class`) when Home became the second page to use this pattern. `about.astro` ("Our Approach", icon+label only), `index.astro` ("How RCAN assists", icon+label; "How you can help", icon+label+description+per-card CTA button replacing the old separate button aside), and `get-involved.astro` ("Ways to Help", icon+label+description+per-card CTA on one item) all use it now. Good remaining candidate: How We Help's program list (Support Pathway / program write-ups), still on `IconSupportList`.
8. **Italic serif font fix.** `BaseLayout.astro` now imports `@fontsource/fraunces/latin-400-italic.css` alongside `latin-600.css`. Before this, any `font-serif italic` text was rendering as a synthesized fake-oblique of the 600 weight (looked bold/heavy/dark). Already sitewide — no action needed, but don't add another Fraunces weight without importing its actual font file first.

**How to roll this out without making a mess:**

- Patterns 2, 3, and 7 are now real components (`PageHeader.astro`, `SectionTitle.astro`, `IconCardGrid.astro` — see above) since Home and How We Help each brought a second page into one. The rest (paragraph dividers, quote card) are still bespoke markup inside `about.astro` only — extract them the same way the first time a second page needs one; don't copy-paste the inline version.
- After extracting, sweep for dead code the change just orphaned: unused `SectionHeader` props if About stops calling it directly, the left-aligned `.section-title` CSS rule in `global.css` once every page ends up using `SectionTitle.astro`, any now-unused `bg-surface-subtle`/gray-background classes left over from the old per-page styling (Home's "How RCAN assists" section had one of these — removed when it moved to `SectionTitle`/`IconCardGrid`).
- Record each newly-extracted component here (or in the Decisions Log) as it's created, so the next agent reuses it instead of re-inlining the markup a third time.

---

## Scope

In scope:

- Copy/content changes across Home, About, How We Help, Who We Are, Impact, Get Involved, and Contact pages
- Navbar logo treatment (image → CSS/HTML)
- Section title type scale (sitewide)
- Congregation list data accuracy and presentation
- Contact form field changes (topic options, new congregation/org field)
- Board of Directors page slot count
- Donate page (absorbing the RCAN Fund content moved off About — see [Decisions Log](#decisions-log) #6)

Out of scope (not mentioned in client notes):

- Visual/brand redesign beyond what's explicitly requested
- New analytics, SEO, or infra work

---

## Legend

- ✅ **Clear** — instruction is unambiguous, ready to implement as written
- ❓ **Needs clarification** — instruction is ambiguous, contradicted elsewhere in the notes, or depends on info we don't have. (As of this revision, all such items have been resolved — see [Decisions Log](#decisions-log).)
- ⚠️ **Recommend pushback** — technically doable, but conflicts with web content/UX best practice. Reasoning included so you can decide whether to push back to the client.

---

## Cross-page reconciliation notes (read this first)

**Authority rule (added after `notes.md` line 88):** the notes are now split into two parts — lines 1–86 are the client's original notes, lines 90–114 are Afton's own personal notes/clarifications, which supersede the client notes wherever they conflict. That resolves several items that were previously flagged as contradictions — see below.

The notes contain a few instructions that contradict each other once you map them onto the _current_ site structure (which has separate Home / About / How We Help / Who We Are / Impact / Get Involved / Contact pages). Here's how I resolved each one — flag if you read it differently:

1. **"Impact" vs "Our Approach"** — Line 100 says "rename impact to 'our approach'", but line 98 says the About page's three parts are "our history > motivation > **impact**". Resolution: this is about the **About page's third internal section** (currently called "Our shared identity" in the code, drafted as "Our Approach" in the client's original notes lines 42–49), not the standalone **Impact nav page**. The Impact nav page keeps its name. ✅ resolved, see About page section below.
2. **"Delete types of support" (line 54, client) vs "replace 'types of support' with 'paths to support'" (line 108, Afton's personal notes)** — directly conflicting. ✅ Resolved by direct confirmation: **delete the section outright**, no rename-and-keep. "Support Pathway" still moves to the top of the page per line 55.
3. **"How We Help" content living under "About Page" in the notes** — the original notes draft (lines 24–62) nests Holiday Gifts / Beauty Behind Bars / Bike Ministry / Prison Friendship Project under the "About Page" heading. But the client's later, clearer instructions (line 98) say About should be "mostly text," "3 parts," "fewer images," matching only History/Motivation/Approach. Resolution: that program content belongs on the dedicated **How We Help** page (which already exists), not About. This also matches line 56 ("transfer some of the things from Impact to here [How We Help]"). ✅ resolved.
4. **DC-only vs. current site copy** — Line 90 (personal notes) says all congregations are in DC, no "DMV." The client's own original notes (line 6) independently say "20 congregations in Washington, DC." These two agree with each other — the conflict is only with the **live site**, which currently says "22 congregations across DC, Maryland, and Virginia" on both About and Who We Are. ✅ Resolved: target copy is "Washington, DC" only, no Maryland/Virginia/DMV references anywhere. Removing "Bread of Life Church" (line 104) brings the list from 22 → 21; confirmed the copy should just state whatever the real post-cleanup count is rather than forcing a fixed "20" — see [Decisions Log](#decisions-log) #2.

---

## Sitewide Changes

### 1. Navbar logo: image → CSS/HTML ✅ (resolved — answering your own question)

> "Are you able to redesign the navbar logo with just css/html instead of using an image, so we can make the text underneath a bit larger."

Opened both logo source files to check — this question answers itself:

- `rcan_logo_final.svg` (used in `Header.astro`) is **pure typography, no icon/mark**: it's two `<text>` nodes baked into a flattened SVG — "RCAN" at `font-size: 38`, and "RETURNING CITIZENS ASSISTANCE NETWORK" at `font-size: 10` directly below it. Because it's rendered via `<img src=...>`, those two text sizes are locked relative to each other — you can scale the whole image up, but you can't make the subtitle bigger relative to "RCAN" without editing the source file.
- `rcan-logo.svg` (used separately in `Footer.astro`) is just "RCAN" in a different typeface (serif Georgia vs. the header's sans), no subtitle, plus a small accent bar. The two logos are already inconsistent with each other today.

**Yes, this is straightforward** — there's no graphic mark to "redraw in CSS," just two lines of text. Plan: replace the `<img>` in `Header.astro` with two real HTML elements (e.g. a `<span>` for "RCAN" and a `<span>` below it for "Returning Citizens Assistance Network"), each sized and spaced independently with Tailwind classes — so the subtitle can be bumped up without touching "RCAN." Recommend also switching both header and footer to the **same** typeface for the wordmark (the site's existing `font-serif` heading font would tie it to the rest of the type system) so the two logos stop disagreeing with each other.

Confirmed: update **both** header and footer to the HTML/CSS treatment (footer gets the same wordmark treatment, can keep just "RCAN" with no subtitle since it's a smaller, secondary placement). Once both are live, delete the now-unused `rcan_logo_final.svg` and `rcan-logo.svg` source files.

### 2. Section title sizing ✅

> "make page section titles a little larger throughout"

Applies to every `<h2 class="section-title text-base font-semibold uppercase tracking-widest ...">` label used across Home, About, How We Help, Who We Are, Impact, and Get Involved (e.g. "How RCAN assists," "Our shared identity," "Types of support," "Board of Directors"). Recommend bumping from `text-base` to `text-lg` (or `text-xl` on `md:`) sitewide for consistency — a single shared change, not a per-page judgment call.

### 3. "DC, not DMV" ✅ resolved (one residual count check)

> "all of the congregations are in washington DC - No mention of 'DMV' - its just DC."

Today, About (`about.astro`) and Who We Are (`who-we-are.astro`) both say **"22 congregations across DC, Maryland, and Virginia."** Both the client's original notes (line 6) and your personal note agree this is wrong — every "DC, Maryland, and Virginia" / "DMV" reference (About hero, About badges, Who We Are hero/intro, any stat strips) should become **Washington, DC only**.

Confirmed: client notes say "20 congregations," but after removing "Bread of Life Church" (per line 104) the list is at 21. Resolved per [Decisions Log](#decisions-log) #2 — state the actual post-cleanup count rather than forcing it back to 20.

---

## Home Page

### 1. Tagline under "Returning Citizens Assistance Network" ✅ done

Requested twice — once in the client's notes (lines 2–4, two candidate options) and once in your personal notes (line 96). By the authority rule, your version is the final call:

> "Giving a helping hand to those returning from incarceration." (cleaned up from line 96's typos — _had_ → _hand_, tightened phrasing)

This is a one-line subtitle directly under the H1, distinct from the longer paragraph already in the hero (`SectionHeader subheading` prop in `index.astro`) and distinct from the navbar logo subtitle (which is the fixed org name, see Sitewide #1 above) — two different text elements, don't conflate them.

**Implemented:** `SectionHeader.astro` gained a new optional `tagline` prop (renders as italic serif text directly under the heading, above the divider) rather than hardcoding this one-off in `index.astro` — any other page that wants a one-line subtitle under its H1 can reuse it.

### 2. Hero/mission paragraph ⚠️ Recommend pushback — done, kept condensed

The notes provide a long two-paragraph mission statement (lines 6 and 8) for the homepage. The current homepage hero already carries a condensed version of this. Recommend **not** pasting the full two-paragraph version into the hero — keep the hero scannable and move the fuller narrative to About → Our History, which is already structured for long-form reading per the client's own "read like a book" instruction (see About page below). Happy to extend the existing homepage paragraph slightly if specific facts (e.g. "Prison Friendship Project" mention) are missing, but a dense hero paragraph hurts above-the-fold scannability.

**Resolved as recommended:** kept the existing condensed hero paragraph as-is — no change needed. The Prison Friendship Project is already represented on Home via the stats strip ("Active Prison Friendship Matches"), so nothing was missing that would justify extending the paragraph.

### 3. "How RCAN Assists" — bigger font ✅

Covered by sitewide section-title sizing change above. (Superseded by the centered-title design pass below — this section now uses `SectionTitle.astro`, which is already sized larger than the old `.section-title` class.)

### 4. "How You Can Help" — keep, edit slightly ✅ done

No structural change requested; light copy polish only. Visual treatment changed as part of the design system rollout (see below) — the per-card CTA buttons (Donate/Support/Partner) moved from a separate aside into each card via `IconCardGrid`'s `cta` prop, replacing the old `[1fr_280px]` two-column layout. Also fixed a residual "If your congregation serves in DC, Maryland, or Virginia" line to "Washington, DC" per the sitewide DC-only decision (this page wasn't in the original list of known locations for that fix).

### 5. Footer link check ✅ moot

Disregard — confirmed this no longer applies (client changed direction).

### 6. "Get Involved" button destination ✅ confirmed

Confirmed: keep the homepage CTA pointed at `/get-involved`. `contact.astro` already supports a `?topic=` query param that pre-selects the topic dropdown (`src/pages/contact.astro` line ~384), so the _individual_ options on the Get Involved page (e.g. "Become a Prison Friend") can still deep-link straight into a pre-filled contact form, while the homepage button gives first-time visitors the overview page first.

---

## About Page

Per the reconciliation above, this becomes a 3-part, text-forward page: **Our History → Our Motivation → Our Approach.**

### 1. Our History ✅

Already exists in `about.astro`. Expand using the fuller founding narrative from notes lines 28–30 (Bryan Stevenson talk, Theo Brown, Rob Hornstein/PDS, NYAPC → Metropolitan AME → 20 congregations) if not already fully represented — current build has a shorter version.

### 2. Our Motivation — net new content ✅

This section **does not currently exist on the live About page at all.** The notes (lines 32–40) specify it in full: the "child of God / dignity" framing plus five named Scripture references (Hebrews 13:3, Proverbs 14:31, Micah 6:8, 1 Peter 4:10, James 2:14–16). This isn't a copy edit — it's a new section to build, content is fully provided. Visual treatment: a simple list (verse + reference per line), not five separate pull-quote cards — five stacked blockquotes would be visually heavy and fight the "reads like a book" direction; save the pull-quote treatment (already used on Impact) for single standout lines elsewhere.

### 3. Our Approach ✅

Maps to the current "Our shared identity" section (`about.astro`, the four bullet values — dignity-first support, rapid response, congregation-led coordination, practical pathways). Rename the heading from "Our shared identity" to "Our Approach" to match notes line 42. Content itself is already correct and matches the notes verbatim.

### 4. Fewer images, "book chapters" feel ✅

Clear direction. Current page has 3 photos (community hero, holding hands, handshake mark) plus badges/stats. Recommend trimming to one supporting image max, or none, in favor of the text-led, chapter-style layout the client described.

### 5. "RCAN Fund" section ✅ resolved — move to Donate

The current About page has a substantial "RCAN Fund" section (donation history, mailing address) that isn't mentioned anywhere in the client's notes, and doesn't fit the new 3-part scope. Decision: move it to the **Donate page**, where it fits naturally — `donate.astro` already has a "Prefer to give by mail?" aside (line 83) with a placeholder mailing address that duplicates the one currently on the About page. Fold the RCAN Fund's founding detail ("established through NYAPC in January 2021...") into the Donate page's intro copy, and let the existing mail-giving aside absorb the address — this also removes a duplicated placeholder address that exists in two places today.

---

## How We Help Page

**Status: done** — see [Implementation Status](#implementation-status) for the full account of what was already live vs. finished this round.

This is where the program-specific content (Holiday Gifts, Beauty Behind Bars, Bike Ministry, Prison Friendship Project) lands, per the reconciliation above.

### 1. Headline/intro — keep, slight edit ✅

"RCAN offers practical support when timing matters most" — matches current H1; light copy edit only.

### 2. "Delete types of support" vs. "replace with 'paths to support'" ✅ resolved: delete

Confirmed directly: **delete the "Types of support" icon-list section outright** (the "paths to support" rename idea from the personal notes is out). "Support Pathway" (the 3-step process) moves to the top of the page per line 55, and becomes the page's primary content block in place of the deleted list.

### 3. Holiday Gifts — edit to include Connie's work and pictures ✅ resolved

Confirmed: "Connie's work" refers to existing material already on the Impact page — the cake-delivery photo/story currently in the "Ms. Davenport's Birthday" client story (`impact.astro`, `cakeGiftImage`, captioned generically as "An RCAN volunteer..."). When this moves into the Holiday Gifts write-up on How We Help, credit the volunteer by name ("Connie") instead of the generic caption.

### 4. Beauty Behind Bars, Bike Ministry ✅

Move from Impact page to How We Help page as-is (content already built and solid); no changes to the content itself requested.

### 5. "Second chance event—cut, no need for it" ✅

Confirmed twice (line 60 and line 104: "delete second chance event - put prison friendship project here"). Remove this section entirely from wherever it ends up (currently on the Impact page).

### 6. Add Prison Friendship Project here (moved from Get Involved) ✅

Move the existing, fully-built Prison Friendship Project section (`get-involved.astro`, lines 142–205) to How We Help, replacing the deleted Second Chance Event section. Get Involved should instead just link to it / mention it as one of the 4 "ways to help" (see below).

### 7. "Add section on RCAN fun here" ✅ resolved

Confirmed: build this from material already on hand — the bike-restoration and holiday gift-bag photos currently on the Impact page (`bikeGiftsImage`, `bikeBagsGiftImage`, `bagOfGiftsImage`). No new source material needed; this is a repurposing/highlighting pass, not new content collection.

---

## Who We Are Page

**Status: done** (except the congregation URL audit and the "see more" button removal, both gated on inputs outside this round's control — see #2 and #3 below).

### 1. Board of Directors: 4 → 9 placeholder slots ✅ done

`boardPlaceholderPhotos` in `who-we-are.astro` now renders 9 cards. Only 4 distinct placeholder source images exist (`board-placeholder-1.png` through `-4.png`); no real board photos are available yet, so the array cycles through the same 4 images to fill the 9 slots rather than waiting on new assets — consistent with the rest of the section already being lorem-ipsum/generic placeholder content ("Board Member" / "Title / Role" on every card). Swap in real, distinct photos and bios per member once the client provides them.

Visual/design pass done alongside: the hero moved off `SectionHeader` onto `PageHeader.astro` (plain-text hero, same shape as About/How We Help/Donate — eyebrow "Who We Are", with a new descriptive H1 replacing the old literal "Who We Are" heading, mirroring how About's and How We Help's H1s read as a sentence rather than repeating the nav label). Both "Board of Directors" and "Participating congregations" headings moved off the old `.section-title` onto `SectionTitle.astro` (full-width headings over a card grid, same shape as Home's sections); the Board section's `bg-surface-subtle` tinted wrapper was dropped per the no-tinted-background pattern (Participating Congregations already had no tinted wrapper).

### 2. "Remove the 'see more' button" ⏸ not yet — blocked on real bios

Confirmed this is the per-card "Read more / Show less" toggle. Once real bios exist for all 9 members: show the full bio directly, no truncation/expand interaction. Still showing lorem ipsum placeholder bios as of this round, so the toggle stays — this is additive content work blocked on client material, same shape as Impact's "new stories" item.

### 3. Congregation list — DC only, fix dead/wrong-state links, remove one entry ✅ mostly resolved

- DC-only copy confirmed (no Maryland/Virginia/DMV).
- "Remove 'Bread of Life Church'" — drop this entry (`who-we-are.astro` line 17).
- Count: don't hardcode a number — confirmed the copy should state **whatever the actual list count is** after cleanup, not a fixed "20." Recommend deriving any "X congregations" stat from `congregations.length` in code rather than a hand-typed string, so it can't drift out of sync with the data again.
- Link audit still outstanding: "Fix congregation links... flag the ones you can't find/confirm... St. Mark's should be `https://www.stmarks.net`, we used `.org`" — the current list actually has St. Mark's pointed at `https://stmarksdc.org` (a third domain, not just a TLD mismatch). This needs a manual link-by-link audit against each congregation's real, current website — none of the remaining URLs have been verified yet; that audit is a discrete task I can run separately before implementation, rather than guessing. The final post-audit count (after Bread of Life removal + dropping any unconfirmed/wrong entries) is what the "X congregations" copy should reflect.

### 4. Congregation list visual treatment ✅ done — card grid

All 3 directions (clean text list / card grid / logo-tile placeholder) were built live on the page for comparison; **card grid** was selected and is now the only version in `who-we-are.astro` (the other two were removed). The external-link affordance was kept but made quieter — it only appears on hover/focus instead of being always visible. Visited-link styling was also added on top of this (name + landmark icon dim on `:visited`).

---

## Impact Page

### 1. Headline/intro — fine, small edit ✅

### 2. More stories/quotes, more pictures (bicycles), case summaries ✅

Clear, additive — needs source material (more client-provided stories, quotes, and photos) but no structural ambiguity.

### 3. Holiday Gifts / Beauty Behind Bars / Bike Ministry / Second Chance Event move off this page ✅ done

Per the How We Help section above — those four program write-ups are now removed from Impact (Second Chance Event was cut outright per item 5 there, the other three already live on How We Help). Impact keeps the stats strip and the "Client Stories" block (Mr. E., TW, Ms. Davenport), which is exactly the kind of outcome-focused content the client's "list success stories" instruction is asking for.

### 4. Hero moved to `PageHeader.astro` ✅ done

Per Decisions Log #20: this page's hero has no side image and was never actually the two-column shape it was assumed to be — moved off `SectionHeader` onto `PageHeader.astro` to match About/How We Help/Donate/Who We Are/Get Involved/Contact. The "Client Stories" subsection heading (level 2, mid-page) stays on `SectionHeader` — that one was never part of the page-header width complaint.

---

## Get Involved Page

**Status: done.**

### 1. "Bring your strengths to RCAN" heading — keep, may edit slightly ✅

### 2. Intro paragraph — keep as-is ✅

### 3. Ways to Help: collapse to exactly 4 ✅ done

> "be a prison friend, engage your congregation, provide direct assistance to returning citizens and their families and be an RCAN volunteer (match with contact form as much as possible)"

`waysToHelp` in `get-involved.astro` is now exactly these 4 items: Become a Prison Friend, Engage your congregation, Provide direct assistance, Become an RCAN volunteer. The old 6-item list's heart (direct support) and dollar-sign (financial giving) items merged into "Provide direct assistance"; the old user (mentoring) and book-open (share resources) items merged into "Become an RCAN volunteer." Becomes a Prison Friend keeps its existing "Learn more" link to `/how-we-help#prison-friendship-project`; the other three have no CTA (no `?topic=` deep links into Contact yet — that wiring, if wanted, is a Contact-page-side decision, not done). Contact's `topicOptions` (see [Contact Page](#contact-page) below) are now synced to these same 4 labels.

### 4. Prison Friendship Project section removed from this page ✅ done

Moved to How We Help (see above). The full section is gone; the "Become a Prison Friend" entry in the `waysToHelp` list carries a "Learn more" link to `/how-we-help#prison-friendship-project` instead.

### 5. Congregation Commitments section ✅ confirmed staying

Not addressed in the client notes; confirmed to leave as-is, unaffected by this round of changes.

### 6. Hero moved to `PageHeader.astro` ✅ done

Per Decisions Log #20: this page's hero has no side image (the faith-community photo is further down, in Congregation Commitments) and was never actually the two-column shape Decisions Log #14 assumed — moved off `SectionHeader` onto `PageHeader.astro` to match the rest of the site. Subheading shortened to one sentence per the established convention; the rest of the original copy now lives in the standard narrow reading column below the header.

---

## Contact Page

**Status: done.**

### 1. Topic dropdown: sync to Get Involved's 4 ways, drop "Referral question" ✅ done

`topicOptions` (`contact.astro`) is now: Become a Prison Friend / Engage your congregation / Provide direct assistance / Become an RCAN volunteer / General question — matching Get Involved's "Ways to Help" labels exactly, plus the General question catch-all. "Congregation partnership," "Volunteer interest," and "Referral question" are gone.

### 2. "Congregation/organization (if any)" field ✅ done — single always-visible optional field

> "add to drop down, 'congregation/organization (if any)' on contact form optional - if selected, new input field appears for 'congregation or organization name'"

Implemented as planned: the topic-gated congregation input (which only auto-revealed when topic = "Congregation partnership") is now a **single, always-visible, optional** "Congregation or organization (if any)" text input, independent of which topic is selected. Removed: the `hidden`/`data-congregation-field` wrapper and inline `required`-toggle logic in `contact.astro`, plus `getCongregationFieldState`/`CONGREGATION_PARTNERSHIP_TOPIC` from `src/utils/contactInteractions.ts` (and their unit tests in `contactInteractions.test.ts`). The Playwright smoke test (`tests/e2e/smoke.spec.ts`) and the contact-form item in `docs/wcag-audit.md` were both updated to assert the new always-visible/optional behavior instead of the old show/hide toggle.

### 3. Hero moved to `PageHeader.astro` ✅ done

Per Decisions Log #20: this page's hero has no side image and was never actually the two-column shape Decisions Log #14 assumed — moved off `SectionHeader` onto `PageHeader.astro` to match the rest of the site.

---

## Donate Page

**Status: done.**

### 1. Absorb RCAN Fund content ✅ done (turned out to already be live)

Per [Decisions Log](#decisions-log) #6 and About Page #5, the RCAN Fund's founding detail and mailing address were supposed to move from About to Donate. Checking `git log -- src/pages/donate.astro` before starting (per Decisions Log #15's warning) turned up the same pattern again: the "home page redesign" commit (`d45875c`) had already folded the RCAN Fund founding paragraph into Donate's hero copy and added "Make checks payable to New York Avenue Presbyterian Church and mail to:" above the existing placeholder address in the mail-giving aside. About's RCAN Fund section is confirmed fully removed (no address/donation copy left on that page at all). So the content move itself needed no further work — see Decisions Log #18 for what _was_ done this round.

### 2. Visual/design pass ✅ done

Per the [Design System Rollout](#design-system-rollout-about-page--rest-of-site)'s explicit instruction to apply this before touching Donate: the hero (plain text, no side image) moved off `SectionHeader` onto `PageHeader.astro`, matching About's and How We Help's hero shape. "Give to RCAN" — a full-width heading sitting above a two-column body (Donorbox embed + mail-giving aside) — moved off the old `.section-title` onto `SectionTitle.astro`, matching how Home's "How you can help" section is structured. Both that section's and "What your gift supports"'s `bg-surface-subtle` tinted wrappers were dropped per the no-tinted-background pattern. "What your gift supports" intentionally kept the old left-aligned `.section-title`, not `SectionTitle.astro` — its heading is attached to one side of a two-column image+text layout, the same shape as Get Involved's Congregation Commitments (which stayed on the old pattern for the identical reason, see Decisions Log #11).

---

## Decisions Log

All items below were open questions as of the first draft of this PRD; all are now resolved by direct confirmation. Kept here as a record of what was decided and why, not as something still pending.

1. **Logo subtitle text** — "Returning Citizens Assistance Network." Footer logo gets the same HTML/CSS treatment as the header. Old `rcan_logo_final.svg` / `rcan-logo.svg` files get deleted once both are replaced.
2. **Congregation count / DC-only** — DC only, no Maryland/Virginia/DMV. Count should reflect the actual list after cleanup (don't force it back to a specific number like 20).
3. **Homepage tagline** — "Giving a helping hand to those returning from incarceration."
4. **Footer "is the one there ok?" link** — moot, disregard; the client changed direction on this point.
5. **Get Involved CTA destination** — stays `/get-involved`, confirmed fine as-is (not a UX anti-pattern).
6. **RCAN Fund section placement** — moves to the Donate page (delegated to my judgment; see About page section above for reasoning).
7. **"Types of support" vs. "Paths to support"** — delete the section outright. Support Pathway becomes the page's primary content, moved to the top.
8. **"Connie's work" / "RCAN fun" source material** — both draw from existing assets already used on the Impact page (cake-delivery photo for Connie's work; bike/gift-bag photos for RCAN fun). No new content collection needed.
9. **Board "see more" button** — confirmed to mean the per-card "Read more" bio toggle; remove it once real, full-length bios exist for all 9 members.
10. **Congregation list visual style** — card grid, chosen after comparing all 3 directions live (done, see Who We Are #4 above).
11. **Congregation Commitments section (Get Involved)** — confirmed staying as-is.
12. **Contact "congregation/organization" field** — single always-visible optional text input, replacing the current topic-triggered reveal logic (not an additional dropdown-gated field).
13. **First component extractions from the Design System Rollout** — Home was the second page to need the centered-section-title and icon-value-card patterns, so per the rollout's own instructions, both got extracted instead of copy-pasted a second time: `src/components/SectionTitle.astro` (centered eyebrow-style `h2`/`h3` + accent bar) and `src/components/IconCardGrid.astro` (icon-in-circle card grid, optional per-card description + CTA button). `about.astro` was updated to consume both instead of keeping its original hand-rolled markup, so there's exactly one implementation of each pattern. `SectionHeader.astro` also gained an optional `tagline` prop (italic line under the H1, above the divider) for the homepage tagline — reuse it rather than hand-rolling another one-off subtitle. The `.section-title` CSS rule in `global.css` is still in use by Donate, Contact, Get Involved, How We Help, Impact, and Who We Are, so it wasn't removed — revisit once those migrate too.
14. **Second component extraction: `PageHeader.astro`** — How We Help's hero is a plain text-only header (eyebrow + H1 + subheading, no side image), the same shape as About's hand-rolled centered header. Per the rollout's "extract on the second occurrence" rule, that markup became `src/components/PageHeader.astro` (props: `id`, `eyebrow`, `heading`, optional `subheading`, optional `class`); both `about.astro` and `how-we-help.astro` now consume it. This is distinct from `SectionHeader.astro`, which stays left-aligned for two-column image+text heroes. **Correction (see Decisions Log #20): at the time this was written, Get Involved and Impact were incorrectly assumed to have two-column image+text heroes like Home's — they don't, and that assumption was carried forward uncorrected for several rounds until a cohesion review caught it.**
15. **How We Help / Get Involved / Impact content moves were already half-done before this round started** — a prior session had migrated Holiday Gifts, Beauty Behind Bars, and Bike Ministry from Impact into How We Help, deleted "Types of support," and moved Support Pathway to the top, but landed it inside a commit titled "home page redesign" (`d45875c`) without updating this PRD, so it read as "Not started" here despite being live. Worth flagging because it could easily happen again: when picking up a "Not started" page, run `git diff`/`git log -- <file>` against the actual file before trusting this doc's status table.
16. **Get Involved's "Ways to Help" 6→4 consolidation and design-system migration** — confirmed via `git log -- src/pages/get-involved.astro` before starting that the page was genuinely still at 6 items (no repeat of #15's surprise-commit problem this time). Collapsed to the client's 4 labels (see Get Involved Page #3 above) and migrated the section off `.section-title`/`IconSupportList` onto `SectionTitle.astro`/`IconCardGrid.astro` (columns=4), dropping the section's `bg-surface-subtle` wrapper in the same pass per the no-tinted-background pattern — mirrors how Home's "How RCAN assists" section was migrated. Congregation Commitments section intentionally left on `IconSupportList` (ordered steps, not a card-grid shape) per Decisions Log #11. Did not add `?topic=` deep links from the new Ways-to-Help cards into Contact — only "Become a Prison Friend" keeps its existing How-We-Help link; wiring the other three to Contact is a Contact-page-side call, left for that task.
17. **Contact topic dropdown sync + congregation field simplification** — `topicOptions` updated to mirror Get Involved's 4 labels exactly (Become a Prison Friend / Engage your congregation / Provide direct assistance / Become an RCAN volunteer) plus General question, dropping Congregation partnership / Volunteer interest / Referral question. The topic-gated congregation field (`getCongregationFieldState`, the `hidden`/`data-congregation-field` wrapper, the per-topic `required` toggle) was removed outright rather than kept alongside the new field, per the resolution in Contact Page #2 — replaced with one always-visible, optional "Congregation or organization (if any)" input. Swept the now-dead code this orphaned: deleted `getCongregationFieldState`/`CONGREGATION_PARTNERSHIP_TOPIC` from `src/utils/contactInteractions.ts` and their tests, rewrote the Playwright smoke test that asserted the old toggle behavior, and updated the matching checklist line in `docs/wcag-audit.md`. Did not touch `src/utils/dropdown.test.ts`'s sample option labels ("Congregation partnership," etc.) — that's generic fixture data for `resolveInitialOption`, unrelated to the real Contact page content.
18. **Donate's RCAN Fund absorption was another surprise-commit case (like #15) — only the visual pass was actually left.** `git log -- src/pages/donate.astro` showed the same `d45875c` commit had already folded the RCAN Fund founding paragraph into the hero and added the "make checks payable to..." line to the mail-giving aside; About's RCAN Fund section is confirmed fully gone. So this round's real work was the design-system pass: hero moved off `SectionHeader` onto `PageHeader.astro` (plain-text hero, same shape as About/How We Help), "Give to RCAN" moved off `.section-title` onto `SectionTitle.astro` (full-width heading over a two-column body, same shape as Home's "How you can help"), and both that section's and "What your gift supports"'s `bg-surface-subtle` wrappers were dropped. "What your gift supports" intentionally kept the old `.section-title` (attached to one side of a two-column layout, same shape as Get Involved's Congregation Commitments per Decisions Log #11) — not every old-pattern heading needs migrating, only the ones whose shape actually matches a component.
19. **Who We Are's board slots and design-system migration** — `git log -- src/pages/who-we-are.astro` confirmed the page genuinely hadn't absorbed any of this round's work yet (no repeat of #15/#18's surprise-commit pattern this time). Expanded `boardPlaceholderPhotos` from 4 to 9 by cycling the same 4 existing placeholder images rather than waiting on real board photos — consistent with the rest of that section already being generic lorem-ipsum/"Board Member" placeholder content. Visual pass: hero moved to `PageHeader.astro`, with a new descriptive H1 ("A volunteer board and a growing network of congregations") replacing the old literal "Who We Are" heading now that "Who We Are" lives in the eyebrow instead (mirrors how About's and How We Help's H1s read as sentences, not nav-label repeats); "Board of Directors" and "Participating congregations" headings moved to `SectionTitle.astro`; Board section's `bg-surface-subtle` wrapper dropped. Left untouched: the per-card "Read more" toggle (Decisions Log #9 — gated on real bios, which still don't exist) and the congregation URL audit (Afton's own separate parallel task per Implementation Status, not blocked on or by this work).
20. **Cohesion bug: Get Involved, Contact, and Impact's heroes were left on `SectionHeader` under a mistaken premise, producing visibly inconsistent page-header widths sitewide.** Afton flagged that page headers looked different widths across the site. Root cause: `SectionHeader.astro` has no `max-width`/centering of its own — it's designed to be constrained by a parent two-column grid (Home's hero: image left, text right, ~50% width). Decisions Log #14 assumed Get Involved and Impact's heroes were the same two-column shape and left them on `SectionHeader` "by design" — but checking the actual markup showed neither page (nor Contact, added to the same list later) has a side image on its hero at all. With no parent grid constraining it, `SectionHeader`'s heading/subheading stretched to the full content width, while every `PageHeader`-based page rendered at a fixed centered `max-w-2xl` — hence the width mismatch Afton noticed. Fix: migrated Get Involved, Contact, and Impact's heroes to `PageHeader.astro` (eyebrow = page nav name, shortened the subheading to a single short sentence per the established convention, moved the rest of the original copy into the standard `mx-auto max-w-3xl` reading column below). Also standardized every `PageHeader` page's wrapper to the identical `border-b border-border-default pb-10 pt-2 md:pb-12` classes and `aria-labelledby` pattern — How We Help had drifted to slightly different padding (`pt-6 md:pt-8`) and was using `aria-label` instead, fixed to match. `SectionHeader.astro` now serves exactly one page-level hero sitewide (Home's, genuinely two-column) plus a few internal level-2/3 subsection headers (e.g. Impact's "Client Stories") that were never part of this complaint. Lesson: a design-system decision recorded once (#14) was never re-checked against the actual markup of the pages it named, and that error compounded silently across three more rounds (#16, #17, #18) before a direct "this doesn't feel cohesive" report caught it — when a rollout decision names specific pages as exceptions, verify the claimed shape against the file, not just trust the prior log entry.

## Suggested next steps

See [Implementation Status](#implementation-status) for the current done/in-progress/not-started breakdown. About, Home, How We Help, Get Involved, Contact, Donate, and Who We Are are all done, and a sitewide cohesion bug (page headers rendering at visibly different widths — Decisions Log #20) has been fixed: every page's hero now uses `PageHeader.astro` with identical wrapper markup, except Home's, which is genuinely the only two-column image+text hero left on `SectionHeader.astro`. Components now have 6-7 consumers each (`SectionTitle.astro`, `IconCardGrid.astro`, `PageHeader.astro`; see [Design System Rollout](#design-system-rollout-about-page--rest-of-site) and Decisions Log #13–14, #16, #18–20). The only page-level item left is **Impact** (new stories/quotes/case summaries) — and that's blocked on client-provided material, not an open implementation question, so there's no further code work to pick up until that material arrives. Two smaller loose ends, both intentionally deferred rather than forgotten: Who We Are's per-card "Read more" toggle (Decisions Log #9, gated on real bios) and its congregation URL audit (Afton's own parallel task). When Impact's new material does arrive, extract a new shared component the first time one of the remaining bespoke patterns (paragraph dividers, quote card) repeats on a second page — Impact's client-story pull-quotes are the likely next candidate for the quote card. Per Decisions Log #15/#18/#20: don't trust this doc's status table or a prior Decisions Log entry blindly for a page you haven't re-checked against the actual file — verify both file state (`git diff`/`git log`) and any claimed visual "shape" (two-column vs. plain-text hero, etc.) before reusing a past decision, since both kinds of staleness have bitten this PRD already.
