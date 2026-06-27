# PRD: Sitewide Design Cohesion (Component Consolidation Round)

## Purpose

PRD-14 rolled a new design system out page-by-page (About first, then Home, How We Help, Get Involved, Contact, Donate, Who We Are), fixing one inconsistency at a time as each page came up in rotation. That page-at-a-time approach left a second layer of inconsistency behind it: pages that all nominally use the "new" components still disagree with each other in ways no single page's task ever asked to fix, because no one ever compared all eight pages side by side. Afton flagged this directly: the site doesn't feel cohesive, page headers are visibly different widths, and some hero sections have two stacked paragraphs in different fonts/widths that look like a mistake.

This PRD is that side-by-side comparison. It audits all eight pages against each other (not against an abstract spec), names every place they still disagree, and proposes component changes to make the disagreement structurally impossible going forward — not just patched on the pages that happen to be wrong today.

**Status: approved, implementation underway.** Both open questions (Finding 4, Finding 5/Rule 5) have been confirmed by Afton — see [Decisions Log](#decisions-log) #6–7. Everything below is a final decision. Read [Audit Findings](#audit-findings) first — it's the evidence; [Design System Rules v2](#design-system-rules-v2-supersedes-extends-prd-14) is the fix.

---

## Audit method

Findings below are evidence-based, not impressions from reading source:

- `npm test` (vitest, all 20 unit tests) — pass.
- `npm run test:e2e` — ran chromium + mobile-chrome (firefox/webkit aren't installed in this sandbox: `browserType.launch` fails with "Executable doesn't exist," an environment gap, not a product bug). 18/20 passed; the 2 failures are the same pre-existing color-contrast issue on `/about`, unrelated to anything in this PRD — see [Finding 6](#finding-6-pre-existing-color-contrast-failure-on-about-found-incidentally).
- `npm run check` — 0 errors.
- A throwaway Playwright script (not committed) launched chromium against the built site and captured full-page and hero-crop (0–700px) screenshots of all 8 routes at 1280×900 (desktop) and 390×844 (mobile). These screenshots are what [Audit Findings](#audit-findings) below is describing — exact pixel comparisons, not a read-through of the markup.

---

## Scope

In scope:

- Visual/structural cohesion across all 8 pages (Home, About, How We Help, Who We Are, Impact, Get Involved, Contact, Donate) — hero shape, section-heading style, tinted-card usage, quote/testimonial presentation.
- Component changes needed to make the fix durable: extending `SectionTitle.astro`, extracting a shared quote/testimonial component, retiring the legacy `.section-title` CSS rule for good.
- Re-flowing displaced hero copy (see [Rule 1](#rule-1-pageheader-contract-header-only-no-trailing-paragraphs)) into page content — copy relocation, not new copy.

Out of scope:

- New content (client-provided stories, board bios, etc. — still blocked per PRD-14).
- Card-shape variety across genuinely different content types (board member cards vs. icon-feature cards vs. program-highlight cards) — see Finding 4 under [Audit Findings](#audit-findings), confirmed fine as-is. This PRD targets _unjustified_ inconsistency, not all variety.
- Anything PRD-14 already explicitly decided should stay bespoke (e.g. Get Involved's Congregation Commitments and Donate's "What your gift supports" keeping a left-aligned, two-column-attached heading) — those are revisited here only insofar as the _implementation_ of "left-aligned heading" should still go through a component (see [Rule 2](#rule-2-sectiontitle-becomes-the-only-section-heading-implementation)), not because the visual call itself was wrong.

---

## Legend

- ✅ **Clear** — the inconsistency is objectively present (screenshot-verified) and the fix is the obvious one; low risk to implement directly.
- ❓ **Needs Afton's input** — a genuine judgment call (usually copy or branding, not layout mechanics). (As of this revision, both items flagged this way have been resolved — see [Decisions Log](#decisions-log).)

---

## Audit Findings

### Finding 1: Hero sections disagree on whether — and how — body copy follows the subheading ✅

This is the specific issue Afton called out ("two paragraphs with different font styles and widths"). Every page's hero now uses `PageHeader.astro` (eyebrow + H1 + divider + centered subheading, `max-w-2xl`, subheading itself capped at `max-w-md`) except Home's (genuinely two-column, out of scope here). But what comes _after_ the subheading is different on every page:

| Page                                      | Paragraphs after subheading | Alignment/width                        |
| ----------------------------------------- | --------------------------- | -------------------------------------- |
| About (`about.astro:44-50`)               | 0                           | —                                      |
| Who We Are (`who-we-are.astro:57-63`)     | 0                           | —                                      |
| Contact (`contact.astro:31-41`)           | 1                           | left-aligned, `max-w-3xl`, `text-base` |
| How We Help (`how-we-help.astro:82-93`)   | 1                           | left-aligned, `max-w-3xl`, `text-base` |
| Donate (`donate.astro:22-44`)             | 1 (long)                    | left-aligned, `max-w-3xl`, `text-base` |
| Get Involved (`get-involved.astro:61-79`) | 2                           | left-aligned, `max-w-3xl`, `text-base` |
| Impact (`impact.astro:26-42`)             | 2                           | left-aligned, `max-w-3xl`, `text-base` |

The subheading itself is **centered**, `max-w-md` (≈448px), `text-lg`. The paragraph(s) immediately below it are **left-aligned**, `max-w-3xl` (≈768px), `text-base` — narrower-then-suddenly-wider, centered-then-suddenly-left, larger-then-suddenly-smaller, all with no visual transition between them. Confirmed in both desktop and mobile screenshots (most visible on Donate and Impact, which stack a long subheading directly into a long, wide, left-aligned paragraph block).

About and Who We Are — the two pages with **zero** trailing paragraphs — are the only two whose hero reads as a single, deliberate, finished thought. That's not a coincidence; it's the version every other page should match.

### Finding 2: Section headings still split between two different visual systems, sometimes on the same page ✅

PRD-14's rollout left `.section-title` (the legacy CSS rule: left-aligned, `::after` underline anchored at `left-0`) and `SectionTitle.astro` (the new component: centered, `::after`-free, accent bar centered beneath) both live in the same codebase, with no consistent rule for which page/section gets which. Worse, several pages mix both **on the same page**:

- **How We Help**: "Support Pathway," "Holiday Gifts...," "Beauty Behind Bars...," "Bike Ministry," "Prison Friendship Project" are all still raw `.section-title` (`how-we-help.astro:112,169,192,401,425`) — left-aligned — while "RCAN fun" further down the same page uses `SectionTitle.astro` — centered. A visitor scrolling this one page sees the heading style change at least once with no signal why.
- **Get Involved**: "Ways to help" is `SectionTitle.astro` (centered); "Congregation commitments" two sections later is raw `.section-title` (left-aligned, `get-involved.astro:107`).
- **Impact**: "2025 by the numbers" and all three client-story headings ("Mr. E...," "TW...," "Ms. Davenport's Birthday") are raw `.section-title` (`impact.astro:45,72,85,97`) — this entire page never adopted the centered pattern at all.
- **Contact**: "Get in touch" is raw `.section-title` (`contact.astro:45`).
- **Donate**: "Give to RCAN" is `SectionTitle.astro`; "What your gift supports" is raw `.section-title` (`donate.astro:149`) — a deliberate PRD-14 call (two-column attached heading), but still means the page visibly changes heading systems partway through.

Twelve raw `.section-title` headings remain across 5 pages (full list in the grep above). The global `.section-title` CSS rule in `global.css` is still alive specifically because of these — PRD-14 flagged this exact cleanup as blocked on "once those pages migrate too," three times, across Decisions Log #13, #17 (consumer-list notes), and the rollout section itself, and it never happened.

### Finding 3: Tinted (`bg-surface-subtle`) section backgrounds have no consistent rule for when they're used ✅

PRD-14's pattern 1 says "no gray/tinted page backgrounds... don't reintroduce a tinted section background without a specific reason." In practice, "specific reason" was applied inconsistently:

- Removed (correctly, per PRD-14): Home's "How RCAN assists"/"How you can help," Get Involved's "Ways to help," Who We Are's "Board of Directors," Donate's "Give to RCAN"/"What your gift supports."
- Still present, no stated reason: How We Help's "Support Pathway" box (`how-we-help.astro:111`), "Beauty Behind Bars" section wrapper (`how-we-help.astro:189`), "Prison Friendship Project" section wrapper (`how-we-help.astro:424`), Impact's "2025 by the numbers" wrapper (`impact.astro:44`).
- Present _with_ a defensible reason (contained form/widget, not a plain content section): Contact's "Get in touch" card (`contact.astro:44`) — this one should very likely stay, see [Rule 3](#rule-3-tinted-background-allowlist).
- Present as the deliberate quote-card pattern (defensible, see Finding 4): About's scripture quotes (`about.astro:116`), Impact's client-story quote figures (`impact.astro:73,86,100,109`).

So three different "exception" categories (form-card, quote-card, plain-content-box) currently look identical in code (`bg-surface-subtle` + `rounded-lg`/`rounded-2xl` + padding), with no way for a future page author to tell which kind they're looking at or which kind they're allowed to add.

### Finding 4: Card design language varies by content type (judged acceptable) ✅ confirmed — no fix needed

Board member cards (Who We Are), icon-feature cards (`IconCardGrid`, Home/Get Involved/About), program-highlight cards (How We Help's tinted boxes), and quote/testimonial cards (About/Impact) all look different from each other. Unlike Findings 1–3, this isn't an accident of incremental rollout — these are four genuinely different content types (a person, a feature, a program write-up, a quote), and forcing them into one shared shape would hurt legibility more than it would help cohesion. **Confirmed by Afton: leave this alone** — see [Decisions Log](#decisions-log) #6.

The one piece of this that _is_ an accident rather than a deliberate choice: About's quote cards and Impact's quote cards are two independently hand-rolled implementations of the same idea (scripture quote vs. testimonial quote), with different internals (About has the diamond-and-rule divider between stacked quotes; Impact repeats individual bordered figures with no divider). PRD-14 flagged this as a "strong candidate" for extraction back when only About had it (Design System Rollout, pattern 6) — Impact now also wants it, which is exactly the project's own "extract on second occurrence" trigger. See [Rule 4](#rule-4-extract-a-shared-quotecard-component).

### Finding 5: Home's hero has no eyebrow label ✅ confirmed — stays as-is

Every other page's centered hero leads with a small uppercase eyebrow (page name) above the H1 — "ABOUT RCAN," "DONATE," "WHO WE ARE," etc. Home's two-column hero has no equivalent element; it goes straight to the H1. This is a smaller inconsistency than Findings 1–3 (Home is structurally a different hero shape already, by design), but it's still a place where Home doesn't match the "every page announces what page you're on" pattern the other seven established. **Confirmed by Afton: Home's hero looks fine as-is, no eyebrow added** — see [Decisions Log](#decisions-log) #7.

### Finding 6: Pre-existing color-contrast failure on About, found incidentally ✅ (informational — not new, not caused by this round)

`npm run test:e2e`'s axe scan fails on `/about` (chromium and mobile-chrome both): the scripture-reference captions ("Hebrews 13:3," "1 Peter 4:10," etc., `about.astro:134` and four siblings) render `text-brand-secondary/80` on the quote card's `bg-surface-subtle` background — 3.47:1 contrast, against a required 4.5:1. Confirmed via `git log -- src/pages/about.astro` that this predates every session in this PRD/PRD-14 — it's been live since the quote-card pattern was first built. Not in scope to fix as a standalone item, but worth doing as part of [Rule 4](#rule-4-extract-a-shared-quotecard-component)'s extraction, since the new shared component is the one place this needs fixing once, instead of twice (it would otherwise get copy-pasted into Impact's version too).

---

## Design System Rules v2 (supersedes/extends PRD-14)

### Rule 1: `PageHeader` contract — header only, no trailing paragraphs ✅

`PageHeader.astro`'s centered block (eyebrow + H1 + divider + subheading) is the _entire_ hero on every page that uses it. No page-specific paragraph(s) render inside or directly below that centered block. If a page's original subheading paragraph carried more than one sentence's worth of context, that extra context moves down into the **lead prose of the page's first content section** — left-aligned, part of that section, under that section's own heading — not floating in the hero as an orphaned, differently-styled paragraph.

This is not a new pattern to invent: About and Who We Are already do exactly this (zero trailing paragraphs in the hero; their first real content section opens directly with prose under its own `SectionTitle`). Every other page conforms to what's already the best-looking version on the site, rather than the other way around.

Per-page relocation (mechanical content move, no new copy):

- **How We Help** (`how-we-help.astro:88-90`): the one paragraph becomes the lead-in prose of "Support Pathway."
- **Donate** (`donate.astro:29-38`): the RCAN Fund paragraph + the "every contribution..." line become the lead-in prose of "Give to RCAN," ahead of or alongside its existing "Support is processed securely through Donorbox" line.
- **Get Involved** (`get-involved.astro:68-77`): both paragraphs fold into "Ways to help"'s existing short intro line.
- **Contact** (`contact.astro:37-39`): the one paragraph becomes the lead-in prose of "Get in touch," ahead of its existing intro line.
- **Impact** (`impact.astro:31-40`): both paragraphs become the lead-in prose of "2025 by the numbers" (or live as ordinary body copy directly above it, outside the hero's `border-b` divider — implementer's call, as long as it's outside the centered block).

### Rule 2: `SectionTitle` becomes the only section-heading implementation ✅

Add an optional `align` prop to `SectionTitle.astro` (`"center" | "left"`, default `"center"`), reusing the existing `level` prop (2/3) for the program/client-story h3s. Every remaining raw `<h2|h3 class="section-title ...">` in the codebase (the 12 instances under [Finding 2](#finding-2-section-headings-still-split-between-two-different-visual-systems-sometimes-on-the-same-page)) migrates onto the component — centered where the heading already sits full-width above its content (How We Help's program write-ups, Impact's "2025 by the numbers" and all three client-story headings, Contact's "Get in touch"), `align="left"` where PRD-14 deliberately kept a left-aligned heading attached to one side of a two-column layout (Get Involved's Congregation Commitments, Donate's "What your gift supports").

Once every usage migrates, delete the `.section-title`/`.section-title::after` rule from `global.css` for good — this closes out a cleanup PRD-14 deferred three separate times (Decisions Log #13, the consumer-list note under pattern 3, and the rollout's own "How to roll this out" section) waiting for "every page to migrate."

Why extend `SectionTitle` instead of building a new component: the only actual difference between the left- and center-aligned versions is text-alignment and where the accent bar sits — same typography, same spacing, same heading levels. A second component would just be this one with `text-center` swapped for nothing, which is exactly the kind of duplication this whole PRD exists to remove.

### Rule 3: Tinted-background allowlist ✅

`bg-surface-subtle` as a **section-level wrapper** (not as small UI chrome — input fills, icon-circle backgrounds, hover states, image placeholder fills, `StatStrip`'s own internal background prop — none of that is in scope or affected) is allowed only for:

1. The quote/testimonial card (see Rule 4) — content that's explicitly an excerpt/quote, set apart from surrounding prose on purpose.
2. A contained interactive widget that benefits from visual separation from surrounding prose — currently just Contact's "Get in touch" form card. Keep as-is.
3. `StatStrip`'s own `background` prop, which is the component's own decision, not a per-page author's — not affected by this rule.

Everywhere else, remove it. Concretely: How We Help's "Support Pathway" wrapper, "Beauty Behind Bars" section wrapper, "Prison Friendship Project" section wrapper, and Impact's "2025 by the numbers" wrapper all lose their `bg-surface-subtle` — these are plain content sections that happened to get boxed in along the way, not anything that needs visual containment.

### Rule 4: Extract a shared `QuoteCard` component ✅

New component (suggested name `QuoteCard.astro`, final name implementer's call) absorbing About's scripture-quote pattern and Impact's client-story quote pattern into one implementation: bordered, `bg-surface-subtle` card, blockquote with the brand-secondary left border, right-aligned reference/attribution caption. Props roughly: `items: { quote: string; reference: string }[]`, optional `divider` (About's diamond-and-rule between stacked quotes — Impact's quotes don't currently have one, since they're spread across separate `<article>`s rather than stacked in one card; decide during implementation whether Impact's quotes should adopt the stacked-with-divider shape or keep separate cards with no divider between — either way, both pages call the same component for the individual quote card itself).

Fix [Finding 6](#finding-6-pre-existing-color-contrast-failure-on-about-found-incidentally)'s contrast failure inside this component once, rather than living with it on About and risking copying it into Impact's version too — likely fix: drop the caption's `/80` opacity modifier, or darken `brand-secondary` for this specific on-`surface-subtle` context until it clears 4.5:1.

### Rule 5: Home's hero eyebrow ✅ resolved — no change

Confirmed by Afton: no eyebrow on Home. This is now the one deliberate, documented exception to "every hero has an eyebrow" — not an oversight. No implementation work follows from this rule.

---

## Page-by-Page Plan

| Page         | Rule 1 (hero copy)                                     | Rule 2 (heading migration)                                                      | Rule 3 (tinted bg)                                                                      | Rule 4 (quote card)            |
| ------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------ |
| Home         | — (two-column hero, out of scope)                      | —                                                                               | —                                                                                       | —                              |
| About        | — (already 0 trailing paragraphs)                      | — (already on `SectionTitle`)                                                   | — (quote card stays, see Rule 4)                                                        | becomes a `QuoteCard` consumer |
| How We Help  | relocate 1 paragraph into "Support Pathway"            | migrate 5 headings (Support Pathway + 4 program write-ups) to `SectionTitle`    | drop 3 tinted wrappers (Support Pathway, Beauty Behind Bars, Prison Friendship Project) | —                              |
| Who We Are   | — (already 0 trailing paragraphs)                      | — (already on `SectionTitle`)                                                   | —                                                                                       | —                              |
| Impact       | relocate 2 paragraphs into "2025 by the numbers" intro | migrate 4 headings ("2025 by the numbers" + 3 client stories) to `SectionTitle` | drop 1 tinted wrapper ("2025 by the numbers")                                           | becomes a `QuoteCard` consumer |
| Get Involved | relocate 2 paragraphs into "Ways to help" intro        | migrate "Congregation commitments" to `SectionTitle align="left"`               | —                                                                                       | —                              |
| Contact      | relocate 1 paragraph into "Get in touch" intro         | migrate "Get in touch" to `SectionTitle`                                        | — (form card is an allowed exception)                                                   | —                              |
| Donate       | relocate 1 long paragraph into "Give to RCAN" intro    | migrate "What your gift supports" to `SectionTitle align="left"`                | —                                                                                       | —                              |

After all eight rows: zero raw `.section-title` usages left → delete the CSS rule from `global.css`. Zero hero sections with trailing paragraphs outside About/Who We Are's existing shape → every `PageHeader` page is now byte-for-byte the same hero shape (modulo copy).

---

## Decisions Log

1. **Subheading-only hero, no exceptions** — chosen over "standardize the trailing-paragraph treatment but keep it" because the two best-looking pages on the site (About, Who We Are) already have zero trailing paragraphs, and matching them requires no new design work, just relocating existing copy. A "keep but standardize" fix would still leave every hero ending at a different visual weight depending on how much copy that page happened to have.
2. **Extend `SectionTitle` with an `align` prop instead of building a second component** — the left- and center-aligned versions differ only in `text-align` and accent-bar position; a second component would be near-duplicate code, which contradicts this PRD's own purpose.
3. **Card-shape variety across content types (board/feature/program/quote) is acceptable, not a finding** — these are different content types where a shared shape would cost legibility. Recorded explicitly so it reads as a decision, not an oversight, the next time someone re-audits the site.
4. **Quote card extraction (`QuoteCard.astro`) is in scope now, not deferred again** — PRD-14 flagged this as a candidate when only About needed it and explicitly deferred extraction until a second page needed the same pattern. Impact's client-story quotes are that second occurrence.
5. **Donate's relocated-paragraph exact wording is left as an implementer question** — a copy judgment call, not layout mechanics, and doesn't block starting the rest of this PRD.
6. **Card-shape variety (Finding 4) confirmed by Afton** — no fix needed; recorded as a deliberate decision, not a gap.
7. **Home's hero eyebrow (Finding 5 / Rule 5) confirmed by Afton** — Home's hero "looks fine as it is"; no eyebrow added. This is now the one documented exception to "every hero has an eyebrow."
8. **`SectionTitle.astro` gained slot support, not just the `align` prop** — How We Help's "Beauty Behind Bars" heading wraps an external link (with an inline SVG icon), so a plain `text` string prop couldn't carry it. Added `Astro.slots.has("default")` so the component renders `<slot />` instead of `text` when children are passed, falling back to `text` everywhere else. No existing consumer had to change.
9. **How We Help's and Impact's migrated headings stay centered (component default), not `align="left"`** — only Get Involved's "Congregation commitments" and Donate's "What your gift supports" got `align="left"`, per the Page-by-Page Plan table (those two cells explicitly say `SectionTitle align="left"`; every other migration cell just says `SectionTitle`). This holds even though several of How We Help's headings (Support pathway, Holiday Gifts, Beauty Behind Bars, Bike Ministry) sit at the top of one column in a two-column grid — visually similar to Get Involved's Congregation Commitments — because PRD-14 never made the same deliberate "keep left-aligned" call for those; they were just unmigrated leftovers. Followed the table literally rather than my own structural read of the grid layout.
10. **Rule 3's tinted wrappers were replaced with their sibling sections' actual spacing convention, not left as a bare class removal** — "lose their `bg-surface-subtle`" read literally would have left `rounded-lg px-6 py-8 md:px-8 md:py-10` behind: a rounded, padded box with no fill, which looks like a mistake next to this round's other plain sections. Matched each wrapper to the spacing already used by its unboxed siblings on the same page instead: How We Help's "Support Pathway" column now uses `flex h-full flex-col` (matching the Holiday Gifts/Bike Ministry columns beside it), and "Beauty Behind Bars," "Prison Friendship Project," and Impact's "2025 by the numbers" sections now use plain `py-10` (matching Bike Ministry's section and Donate's "Give to RCAN" section respectively). Removing each wrapper's tint also surfaced three child elements that had been styled _against_ that tint rather than the page background: "Beauty Behind Bars"'s catalogue link had `focus-visible:ring-offset-surface-subtle` (now `-surface-default`, matching the page), its inline pull-quote was `bg-surface-default` for contrast against the tinted parent (now `bg-surface-subtle`, matching the same pattern Bike Ministry's untinted section already uses for its own pull-quote), and the Prison Friendship Project's two stat boxes were bare `bg-surface-default` + `shadow-sm` with no border (fine against a tinted parent, invisible against the page's own white background) — added `border border-border-default` to match every other plain-background card in the codebase (Contact's contact-method cards, Who We Are's congregation cards, `Card.astro`, `IconCardGrid.astro`).
11. **Rule 1 relocated paragraphs match each landing section's existing prose convention, not a single literal "left-aligned" rule everywhere** — Rule 1's text says relocated copy should read as ordinary left-aligned body prose, which is exactly what happened on How We Help, Contact, and Impact (their landing sections already use plain, unconstrained-width paragraphs). But Donate's "Give to RCAN" and Get Involved's "Ways to help" sections both already had a centered, `max-w-2xl`, `text-center` intro line under their `SectionTitle` — relocating the hero copy as left-aligned text into a centered section would have reintroduced exactly the alignment clash this PRD exists to remove. Kept those two centered and folded the relocated copy in alongside the section's existing intro line instead.
12. **`QuoteCard.astro`'s shared shape is Impact's existing look (bordered card, `border-l-4` blockquote), not About's** — Rule 4's own description ("blockquote with the brand-secondary left border") matches Impact's 4 existing instances, not About's hand-rolled serif-italic-with-curly-quote-glyphs treatment. About's outer `rounded-2xl` quote-stack container and optional diamond divider were kept (now the component's wrapper + `divider` prop), but the individual-quote styling converged onto Impact's shape. About's scripture references and Impact's "— PDS Lawyer"-style attributions now share one caption treatment (uppercase, semibold, `tracking-wide`, `text-brand-secondary`); the inherited dash-prefix convention on Impact's attributions was kept as-is since it's existing copy, not new.
13. **Finding 6's contrast fix: dropped the `/80` opacity modifier, confirmed by contrast math, not guessed** — full-opacity `text-brand-secondary` (`#B14D2A`) on `bg-surface-subtle` (`#F5F7F6`) computes to ≈4.92:1, clearing the 4.5:1 AA threshold the `/80` version failed at 3.47:1. No color value changed, just the opacity modifier removed — confirmed this was sufficient before relying on it rather than also darkening the brand color "to be safe."
14. **Impact's Ms. Davenport's Birthday quotes consolidated into one `QuoteCard` call, no divider** — Rule 4 left this as an implementer's call ("decide... whether Impact's quotes should adopt the stacked-with-divider shape or keep separate cards with no divider between"). Chose one shared card with both quotes and `divider` omitted (defaults to `false`): closer to the existing visual rhythm (quotes already read as one beat, just spaced) without adding a divider that wasn't part of either page's original pattern for this story.

---

## Implementation Status

**Done.** All four rules are implemented in the order Implementation Status originally recommended — Rule 2 → Rule 3 → Rule 1 → Rule 4 — with `npm run check` run clean (0 errors/warnings/hints) after each rule:

- **Rule 2** — `SectionTitle.astro` gained `align` (`"center" | "left"`, default `"center"`) and slot support (see Decisions Log #8). All 12 raw `.section-title` headings (How We Help ×5, Impact ×4, Contact ×1, Get Involved ×1, Donate ×1) now consume the component — see Decisions Log #9 for the centered-vs-`align="left"` split. The `.section-title`/`.section-title::after` rule is deleted from `global.css`; nothing references it anymore.
- **Rule 3** — How We Help's "Support Pathway," "Beauty Behind Bars," and "Prison Friendship Project" wrappers and Impact's "2025 by the numbers" wrapper all lost their `bg-surface-subtle` box treatment, replaced with the spacing their unboxed sibling sections already use (Decisions Log #10). Contact's form card and `StatStrip`'s own `background` prop were left untouched, per the Rule 3 allowlist.
- **Rule 1** — Every `PageHeader`-based hero (How We Help, Donate, Get Involved, Contact, Impact) is now header-only; the relocated copy lives in each page's first content section (Decisions Log #11). About, Who We Are, and Home were untouched, as planned.
- **Rule 4** — `src/components/QuoteCard.astro` extracted (props: `items: { quote, reference }[]`, optional `divider`, optional `ariaLabel`, `class`). About's five scripture quotes and Impact's three client-story quotes (Mr. E., TW, and the consolidated Davenport pair — Decisions Log #14) all consume it. Finding 6's pre-existing contrast failure is fixed inside the component (Decisions Log #13).

Nothing left to pick up from this PRD — nothing was deferred or blocked.
