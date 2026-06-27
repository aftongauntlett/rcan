# RCAN Accessibility and Lighthouse Audit

This document is the project-specific accessibility and quality audit guide for RCAN.
It replaces a generic template and is aligned to this repository's current architecture,
coding constraints, and release gates.

Last updated: 2026-05-21

## 1) Project Context and Scope

Site type and stack:

- Multi-page Astro 6 website with TypeScript and Tailwind CSS 4
- Shared layout and reusable Astro components
- Utility-level interaction logic tested with Vitest

Pages in scope for audit and release:

- /
- /about
- /how-we-help
- /impact
- /get-involved
- /contact
- /donate
- /404

Repository rules that define the accessibility bar:

- WCAG 2.2 AA keyboard, focus, contrast, semantics, and heading-hierarchy requirements
- Reduced-motion safeguards for all animation/transition behavior
- Lighthouse targets: 100 Accessibility, 100 Best Practices, 100 SEO, 95+ Performance
- Release gate validation via check, lint, test, and build commands

## 2) Audit Baseline in Current Code

Current codebase already contains several accessibility-positive patterns:

- Landmark and document structure in the base layout:
  - html lang attribute set to en
  - Skip link rendered before header
  - main landmark with stable id target
- Keyboard-visible focus indicators are globally enforced via focus-visible styles
- Mobile navigation uses dialog semantics with focus return on close
- Contact page form includes labels, live regions, and explicit error regions
- Custom dropdown uses ARIA menu semantics and keyboard controls
- Reduced motion handling is present in CSS and JS for reveal effects
- Informative images include descriptive alt text across core pages

Supporting implementation paths:

- src/layouts/BaseLayout.astro
- src/components/SkipLink.astro
- src/components/Header.astro
- src/components/CustomDropdown.astro
- src/pages/contact.astro
- src/pages/index.astro
- src/styles/global.css
- src/utils/mobileNav.ts
- src/utils/dropdown.ts
- src/utils/contactInteractions.ts
- src/utils/carousel.ts

## 3) Automated Validation Status

Most recent local validation run (same command sequence used for release checks):

- npm run check: pass
- npm run lint: pass
- npm run test: pass
- npm run test:e2e -- --project=chromium: pass
- npm run test:a11y -- --project=chromium: pass
- npm run audit:deps: pass (no high or critical vulnerabilities)
- npm run lighthouse:ci: fail (current pages below enforced thresholds)
- npm run build: pass

Note:

- These checks validate type safety, linting, utility behavior, and build integrity.
- Browser automation now validates route smoke flows and severe axe violations for core pages.
- They do not replace manual assistive-technology review and Lighthouse evidence capture.

## 4) RCAN-Specific Manual Audit Checklist

Run this checklist on desktop and mobile breakpoints.

Navigation and keyboard flow:

- Confirm Skip to main content is first-focusable and moves focus to main content.
- Validate desktop header links and Donate button are reachable and visibly focused.
- Validate mobile menu open, close, backdrop close, and focus return behavior.
- Confirm no keyboard trap in mobile dialog or contact controls.

Headings and landmarks:

- Confirm one h1 per page and no heading level skips.
- Confirm each page includes meaningful landmark usage (header, nav, main, footer, section/article where needed).

Forms and dynamic feedback (/contact):

- Confirm all form fields have programmatic labels.
- Confirm topic selection keyboard behavior for custom dropdown (Arrow keys, Enter, Escape, Home, End).
- Confirm "Congregation or organization (if any)" field is always visible, optional, and has a programmatic label regardless of selected topic.
- Confirm submit state changes are announced and form uses aria-busy during submission.
- Confirm success and error messages are announced via live regions.
- Confirm copy buttons expose accessible names and feedback is announced.

Motion and visual comfort:

- With prefers-reduced-motion: reduce, verify animations and transitions are removed.
- With no-preference, ensure only approved motion effects are used.

Responsive and zoom:

- Validate usability at 320px width equivalent.
- Validate 200 percent zoom with no loss of content/function.

Color and contrast:

- Spot-check text, UI controls, and focus indicators against WCAG 2.2 AA contrast.

## 5) Lighthouse Evidence Requirements

For each release candidate page set, capture Lighthouse results for:

- Mobile profile
- Desktop profile

Required target scores:

- Accessibility: 100
- Best Practices: 100
- SEO: 100
- Performance: 95 or higher

Record at minimum:

- Page URL/path
- Device profile (mobile or desktop)
- Score set
- Timestamp and reviewer
- Any exception with remediation owner and due date

## 6) Interaction Test Coverage Snapshot

Utility tests currently present and passing:

- src/utils/mobileNav.test.ts
- src/utils/dropdown.test.ts
- src/utils/contactInteractions.test.ts
- src/utils/carousel.test.ts

What these tests cover:

- Mobile dialog open/close/focus restoration
- Dropdown default resolution rules
- Contact field-state and message-reset logic
- Carousel index wrapping and active state updates

Coverage gap to keep in mind:

- Automated browser checks now cover route smoke flows and serious/critical axe violations.
- Screen reader behavior verification remains a required manual step.

## 7) Release Gate Workflow (RCAN)

Use the project-defined command order:

1. npm run check
2. npm run lint
3. npm run test
4. npm run test:e2e
5. npm run test:a11y
6. npm run lighthouse:ci
7. npm run audit:deps
8. npm run build

If any command fails:

- Continue running the remaining commands.
- Classify issue severity.
- Map failure to an owner and a remediation task before release.

## 8) Public Compliance Language for RCAN

Recommended wording:

- Built and tested against WCAG 2.2 AA best practices.
- Validated using automated tooling plus manual keyboard and assistive-technology checks.

Avoid:

- Statements claiming universal or legal WCAG compliance without formal third-party audit evidence.

## 9) Open Risk Log Template

Use this short format for any unresolved issue:

- ID:
- Severity:
- Page(s):
- User impact:
- Evidence:
- Owner:
- Target fix date:
- Release decision impact:

## 10) Exit Criteria

This audit is complete for a release only when all are true:

- All release-gate commands pass.
- Lighthouse targets are met for mobile and desktop.
- Manual keyboard, focus, heading, form, reduced-motion, and zoom checks are complete.
- Any exceptions are documented with owner, timeline, and explicit release acceptance.

## 11) Additional Non-A11y Release Gates

Accessibility is necessary but not sufficient for launch confidence. Keep these gates in the same release checklist:

Performance and reliability:

- Verify Web Vitals trends (LCP, INP, CLS) in production analytics if available.
- Confirm large images are optimized and use responsive sizes.
- Confirm no client script errors in browser console for core flows.

Security and abuse resistance:

- Run dependency vulnerability checks and triage by severity.
- Verify form abuse controls (Turnstile and provider-side anti-spam/rate limits) remain enabled.
- Verify hosting/CDN security headers are configured (CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy).

Maintainability:

- Keep check, lint, test, and build all green before merge.
- Keep docs synchronized with behavior changes.
- Track technical debt items from audit findings in a visible backlog.

## 12) Installed Automation Coverage

The repository now includes automated browser accessibility and performance tooling:

- Playwright smoke tests across Chromium, Firefox, WebKit, and a mobile Chrome profile.
- Axe-based accessibility assertions for critical pages.
- Lighthouse CI configuration for mobile and desktop profiles.
- Dependency audit script for high-severity vulnerability triage.

Primary automation files:

- playwright.config.ts
- tests/e2e/smoke.spec.ts
- tests/e2e/accessibility.spec.ts
- .lighthouserc.mobile.json
- .lighthouserc.desktop.json
- .github/workflows/quality-gates.yml

First-pass automated scope:

- Home page navigation and landmark presence.
- Contact form labels, keyboard flow, and submission feedback states.
- Mobile menu open/close/focus return behavior at narrow viewport.

## 13) What Must Stay Manual

Even after adding automation, the following checks remain manual by design:

- Real screen reader reading order and announcement quality.
- Keyboard flow usability and focus order clarity.
- Content clarity for links, controls, and form instructions.
- Zoom/reflow usability at 200 percent and small viewport widths.

Manual release smoke test (20-30 minutes):

1. Keyboard-only pass on home, contact, donate.
2. Screen reader pass on headings, landmarks, nav menu, contact form labels/errors.
3. Mobile viewport pass for nav, forms, and call-to-action buttons.
4. Reduced-motion pass with OS preference enabled.

Detailed checklist:

- docs/guide/screen-reader-smoke-test.md

## 14) Screen Reader Testing Guidance for Non-Experts

Use a simple repeatable script rather than trying to master every shortcut:

1. Start at page top and list landmarks.
2. Jump by headings and verify hierarchy is logical.
3. Tab through all interactive controls and verify visible focus.
4. Submit form with an intentional error and confirm announcements.
5. Trigger success path and confirm confirmation messaging is announced.

Minimum platform matrix for RCAN:

- macOS + Safari + VoiceOver
- Windows + Firefox + NVDA (or equivalent remote/cloud session)
- iOS or Android screen reader pass on contact flow

## 15) Dependency and Package Risk Policy

Testing packages should remain in the repository after handoff if they are part of the release gate.
Do not remove them just to reduce package count if they provide ongoing quality protection.

Balance package value and supply-chain risk using these rules:

- Prefer well-maintained, widely adopted tooling.
- Pin versions and update on a regular cadence.
- Run vulnerability scans regularly and triage findings.
- Remove tools that are unused for two release cycles.
- Keep test/dev tooling in devDependencies, not dependencies.
- Treat deprecated packages as remediation tasks, not optional cleanup.

Risk note:

- More packages can increase supply-chain risk surface, but missing quality gates creates direct product risk.
- The correct approach is controlled adoption plus routine maintenance, not avoiding tooling entirely.

## 16) Community and Volunteer Feedback Options

External feedback improves confidence, especially for assistive-technology usability.

Low-cost options:

- Accessibility-focused community forums and chat groups.
- Local civic tech and disability advocacy groups.
- Volunteer calls for feedback on specific tasks (for example: complete contact form with screen reader).

Expectation setting:

- Free feedback is valuable but inconsistent in speed and coverage.
- Use it to supplement, not replace, internal release checks.
