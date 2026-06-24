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
- Impact page (partial) — the four program write-ups that belonged on How We Help (Holiday Gifts, Beauty Behind Bars, Bike Ministry, Second Chance Event) are removed now that they've landed there; the page is back to just the stats strip and Client Stories, matching the target end-state. The dead `initCarousels` script (no carousels left on the page) was removed too. Still pending: new stories/quotes/photos when that material exists — see "Not started yet."

**Not started yet:**
- Who We Are: board placeholder slots 4→9
- Impact page: new stories/quotes/case summaries (structural cleanup above is done; this is additive content that needs client-provided material)
- Get Involved page (collapse Ways to Help to 4 — the Prison Friendship section itself is already gone, replaced with a pointer link; the 6→4 consolidation and its Contact-page sync are still open)
- Contact page (topic dropdown sync, congregation field simplification)
- Donate page (absorb RCAN Fund content — verify this is still needed; see note above)

Recommended order for what's left: Get Involved → Contact → Donate → Who We Are (board slots) → Impact (once new story material exists). Home and How We Help are now done — see above. For every page in this list, apply the [Design System Rollout](#design-system-rollout-about-page--rest-of-site) guidance below as you go — don't treat content and visual design as separate passes. Three components already exist (`SectionTitle.astro`, `IconCardGrid.astro`, `PageHeader.astro`) — use them instead of re-inlining the markup a third time.

---

## Design System Rollout (About page → rest of site)

**Read this before touching Home, How We Help, Who We Are, Impact, Get Involved, Contact, or Donate.** The About page (`about.astro`) just went through a visual design pass that should become the template for every other page, per direct instruction from Afton. The goal is a site that feels like one designed product, not eight separately-styled pages — favor reusable components and cohesiveness over re-solving the same layout problem per page.

**Patterns established on About — replicate these elsewhere:**

1. **No gray/tinted page backgrounds.** `BaseLayout.astro`'s `html`/`body` no longer carry the `neutral-50` gradient, and `Footer.astro` now uses `bg-surface-default` (matching the navbar) instead of `bg-surface-subtle`. This is already sitewide — no per-page action needed, but don't reintroduce a tinted section background without a specific reason (the quote card below is an intentional, deliberate exception, not the default).
2. **Centered page header.** Eyebrow label (small uppercase, `text-brand-secondary`) + centered serif H1 + short centered accent-bar divider + centered subheading, in a `max-w-2xl mx-auto text-center` block with a `border-b border-border-default` closing it out. ✅ **Extracted** into `src/components/PageHeader.astro` (props: `id`, `eyebrow`, `heading`, optional `subheading`, optional `class`) when How We Help became the second page with a text-only hero (no side image) needing this shape. `about.astro` and `how-we-help.astro` both use it now — reach for it on any other page whose hero is plain text (not a two-column image+text hero like Home's or Get Involved's, which stay on the left-aligned `SectionHeader.astro`).
3. **Centered section titles.** Short centered uppercase label + small centered accent bar underneath, replacing the old left-aligned `.section-title` CSS rule (`global.css`) and its `::after` underline anchored at `left-0`. ✅ **Extracted** into `src/components/SectionTitle.astro` (props: `id`, `text`, optional `level` (2 or 3, default 2), optional `class`) when Home became the second page to use this pattern. `about.astro` (History/Motivation/Approach) and `index.astro` ("How RCAN assists"/"How you can help") both use it now — reuse it on every other page instead of hand-rolling the eyebrow-label-plus-bar markup again. The old `.section-title` CSS rule in `global.css` is still live and still used by Donate, Contact, Get Involved, How We Help, Impact, and Who We Are — don't remove it until those pages migrate too.
4. **Narrow reading column for body copy.** Long-form paragraphs live in a `mx-auto max-w-3xl` wrapper, left-aligned (don't center body paragraphs — hurts readability past 1-2 lines). Centering is reserved for short ceremonial elements (titles, headers, captions), not prose.
5. **Ornamental paragraph dividers.** Small muted flanking lines + center dot (`brand-secondary/60`) between long paragraphs, used in History and the Motivation intro, to break up dense reading without a heavy rule.
6. **Quote card.** Scripture/testimonial quotes live in a single bordered, `bg-surface-subtle`-tinted rounded card (not individual boxes), right-aligned reference/attribution captions, separated by a fancier diamond-and-rule divider (longer lines, rotated diamond — distinct from the paragraph divider above). Strong candidate for Impact's client-story pull-quotes.
7. **Icon value-cards.** Bullet lists for values/features replaced with small cards (icon-in-circle + centered label) in a responsive grid. ✅ **Extracted** into `src/components/IconCardGrid.astro` (props: `items` — each `{ icon, label, description?, cta? }` — `ariaLabel`, optional `columns` (2/3/4, default 4), optional `class`) when Home became the second page to use this pattern. `about.astro` ("Our Approach", icon+label only) and `index.astro` ("How RCAN assists", icon+label; "How you can help", icon+label+description+per-card CTA button replacing the old separate button aside) all use it now. Good remaining candidates: How We Help's program list, Get Involved's "Ways to Help."
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

### 1. Board of Directors: 4 → 9 placeholder slots ✅

Clear. `who-we-are.astro` currently renders 4 placeholder cards from `boardPlaceholderPhotos`; needs 5 more placeholder images/slots (9 total).

### 2. "Remove the 'see more' button" ✅ confirmed

Confirmed this is the per-card "Read more / Show less" toggle. Once real bios exist for all 9 members: show the full bio directly, no truncation/expand interaction.

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

---

## Get Involved Page

### 1. "Bring your strengths to RCAN" heading — keep, may edit slightly ✅

### 2. Intro paragraph — keep as-is ✅

### 3. Ways to Help: collapse to exactly 4 ✅ (with one dependency)

> "be a prison friend, engage your congregation, provide direct assistance to returning citizens and their families and be an RCAN volunteer (match with contact form as much as possible)"

Current `waysToHelp` array has 6 items; consolidate to these 4. Also drives the Contact form topic-list changes below — these need to be the same 4 labels (or very close to it) in both places.

### 4. Prison Friendship Project section removed from this page ✅ done

Moved to How We Help (see above). The full section is gone; the "Become a Prison Friend" entry in the `waysToHelp` list now carries a "Learn more" link to `/how-we-help#prison-friendship-project` instead. Note this is still a 6-item list today — the 6→4 consolidation in item 3 above (and its Contact-page sync) hasn't happened yet, so don't read this as that task being done too.

### 5. Congregation Commitments section ✅ confirmed staying

Not addressed in the client notes; confirmed to leave as-is, unaffected by this round of changes.

---

## Contact Page

### 1. Topic dropdown: sync to Get Involved's 4 ways, drop "Referral question" ✅

Current `topicOptions` (`contact.astro`): Become a Prison Friend / Congregation partnership / Volunteer interest / Referral question / General question.

Per notes lines 86 + 110, recommend:

- Become a Prison Friend
- Engage your congregation _(replaces "Congregation partnership" to mirror Get Involved wording exactly)_
- Provide direct assistance _(new — matches the "direct assistance to returning citizens and their families" way-to-help)_
- Become an RCAN volunteer _(replaces "Volunteer interest")_
- General question _(kept as a catch-all)_
- ~~Referral question~~ — removed per line 110

### 2. "Congregation/organization (if any)" field ✅ resolved — single always-visible optional field

> "add to drop down, 'congregation/organization (if any)' on contact form optional - if selected, new input field appears for 'congregation or organization name'"

Confirmed: skip the dropdown-gate pattern entirely. Replace the current setup — where a congregation name input only auto-reveals when topic = "Congregation partnership" (`contact.astro` lines 131–142, driven by `getCongregationFieldState`) — with a **single, always-visible, optional** "Congregation or organization (if any)" text input, independent of which topic is selected. This removes the topic-driven show/hide logic (`getCongregationFieldState` in `src/utils/contactInteractions.ts` and the `hidden`/`data-congregation-field` wrapper in `contact.astro`) rather than adding a second field alongside it.

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
14. **Second component extraction: `PageHeader.astro`** — How We Help's hero is a plain text-only header (eyebrow + H1 + subheading, no side image), the same shape as About's hand-rolled centered header. Per the rollout's "extract on the second occurrence" rule, that markup became `src/components/PageHeader.astro` (props: `id`, `eyebrow`, `heading`, optional `subheading`, optional `class`); both `about.astro` and `how-we-help.astro` now consume it. This is distinct from `SectionHeader.astro`, which stays left-aligned and keeps serving the two-column image+text heroes (Home, Get Involved, Impact, etc.) — don't conflate the two when a future page's hero needs picking between them.
15. **How We Help / Get Involved / Impact content moves were already half-done before this round started** — a prior session had migrated Holiday Gifts, Beauty Behind Bars, and Bike Ministry from Impact into How We Help, deleted "Types of support," and moved Support Pathway to the top, but landed it inside a commit titled "home page redesign" (`d45875c`) without updating this PRD, so it read as "Not started" here despite being live. Worth flagging because it could easily happen again: when picking up a "Not started" page, run `git diff`/`git log -- <file>` against the actual file before trusting this doc's status table.

## Suggested next steps

See [Implementation Status](#implementation-status) for the current done/in-progress/not-started breakdown. About, Home, and How We Help are now done — three components are extracted as a result (`SectionTitle.astro`, `IconCardGrid.astro`, `PageHeader.astro`; see [Design System Rollout](#design-system-rollout-about-page--rest-of-site) and Decisions Log #13–14). Next chunk up is **Get Involved** (the 6→4 Ways to Help consolidation, which the Contact page's topic dropdown needs to mirror), then Contact, Donate, Who We Are (board slots), and Impact (new story material), in that order. Reach for `SectionTitle`/`IconCardGrid`/`PageHeader` first before re-inlining markup, and extract a new shared component the first time one of the remaining patterns (paragraph dividers, quote card) repeats on a second page. Per Decisions Log #15, don't trust this doc's status table blindly for a "Not started" page — check `git diff`/`git log` against the actual file first, since past sessions have landed page work inside differently-named commits without updating this PRD.
