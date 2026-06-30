# PRD: Release Readiness Remediation (Post-Audit)

## Purpose

Convert the findings from `docs/PRD-11-final-audit.md` into an implementation plan that closes release blockers and high-priority launch risks.

This PRD is the execution source of truth for remediating audit findings before production release.

---

## Scope

In scope:

- Mobile navigation accessibility and route reachability
- SEO metadata correctness (canonical and absolute social URLs)
- Production surface essentials (404, robots, sitemap)
- Test coverage and release-gate rigor for critical flows
- Security hardening steps for Formspree + Turnstile integration
- High-value maintainability and standards consistency items identified in the audit

Out of scope:

- New feature work unrelated to audit findings
- Content rewrites outside of targeted metadata and documentation corrections
- Design overhauls not required to satisfy accessibility/SEO/release criteria

---

## Mission

Implement all P0 and P1 findings first, then resolve P2 items required for stable launch confidence.

Default behavior for this PRD:

- Implement fixes directly in the repository.
- Keep changes minimal and focused on findings.
- Preserve existing design system and page content unless required by this PRD.

---

## Severity-Driven Work Order

1. P0: Mobile navigation failure
2. P1: SEO metadata correctness
3. P1: 404 production handling
4. P1: Test coverage and CI gate quality
5. P2: robots and sitemap generation
6. P2: Form abuse hardening checks
7. P2: Maintainability refactors on oversized files
8. P2: Token-consistency cleanup
9. P3: Documentation alignment

Do not start P2/P3 until all P0/P1 acceptance criteria are met.

---

## Detailed Requirements

### 1) P0 Accessibility: Mobile Navigation Must Work

Problem:

- Primary navigation links are hidden at small breakpoints with no equivalent mobile menu.

Requirements:

- Provide a fully keyboard-operable mobile navigation pattern.
- Include visible focus states and proper semantics.
- Ensure parity between desktop and mobile primary nav routes.
- Ensure escape/close behavior and focus management are robust.

Acceptance criteria:

- On small screens, users can reach all primary routes without URL manipulation.
- Keyboard-only users can open, traverse, and close mobile navigation.
- Focus order is logical and visible at all interactive controls.

---

### 2) P1 SEO: Canonical and Absolute Metadata

Problems:

- Open Graph URLs resolve to localhost in build artifacts.
- Canonical link tags are missing.

Requirements:

- Configure Astro site origin for production URL generation.
- Emit canonical links for every page.
- Ensure OG URL and image values resolve to production origin in build output.

Acceptance criteria:

- Built HTML for every route contains a canonical link.
- Built OG metadata no longer references localhost.
- Metadata remains unique per page title and description.

---

### 3) P1 Production Readiness: 404 Handling

Problem:

- No 404 output artifact found in build output.

Requirements:

- Add and wire a dedicated 404 page.
- Keep layout, semantics, and accessibility consistent with site standards.

Acceptance criteria:

- Build output includes a 404 artifact.
- 404 page includes meaningful guidance and route recovery CTA.

---

### 4) P1 Testing: Critical Path Coverage and Gate Reliability

Problems:

- Tests are minimal and concentrated in one utility.
- Test scripts allow success when no tests are present.

Requirements:

- Add tests for critical user paths:
  - Mobile navigation reachability and keyboard behavior
  - Contact form core interaction logic (topic behavior, required fields, submission state)
  - Key interactive components (carousel state changes, copy feedback logic where applicable)
- Strengthen release test gate behavior by removing permissive no-test pass behavior in CI-facing scripts.

Acceptance criteria:

- Test suite contains meaningful assertions for critical flows.
- Release gate fails when test coverage is absent for configured suites.
- `npm run test` remains green with the new tests in place.

---

### 5) P2 SEO Site Artifacts: robots and sitemap

Problems:

- No robots.txt or sitemap.xml in output.

Requirements:

- Configure generation of sitemap.xml.
- Provide explicit robots policy suitable for production indexing.

Acceptance criteria:

- Build output contains sitemap.xml.
- robots.txt exists and reflects intended crawl policy.

---

### 6) P2 Security: Formspree + Turnstile Abuse Resistance

Problem:

- Direct endpoint posting remains a residual abuse risk without explicit provider-side enforcement.

Requirements:

- Verify Turnstile verification is enforced for intended form submission paths.
- Confirm anti-spam/rate controls are configured in provider settings.
- Document residual risk and operating guidance for production monitoring.

Acceptance criteria:

- Configuration assumptions are documented in repo docs.
- Submission path behavior is consistent across local/dev/prod expectations.

Note:

- If provider dashboard settings cannot be changed from repository code, document exact manual steps and owner responsibility.

---

### 7) P2 Maintainability: Oversized File Decomposition

Problem:

- Several files are large and mix markup, behavior, and state logic.

Requirements:

- Decompose oversized pages/components into smaller, focused modules where practical.
- Extract reusable behavior into utility helpers when reused or complex.
- Preserve behavior and visual output.

Acceptance criteria:

- Largest high-risk files are reduced in complexity and responsibility.
- No functionality regressions are introduced.

---

### 8) P2 Standards Consistency: Token Usage

Problem:

- Hardcoded color usage appears in page-level class strings.

Requirements:

- Replace hardcoded values with approved token classes.
- Ensure WCAG-safe pairings are preserved after replacement.

Acceptance criteria:

- No hardcoded color literals remain in page/component class strings for remediated areas.

---

### 9) P3 Documentation Accuracy

Problem:

- README status language no longer matches current implementation state.

Requirements:

- Update README sections that describe current project state, structure, and key pages.

Acceptance criteria:

- README accurately reflects current app scope and architecture.

---

## Implementation Constraints

- Follow all repository instructions in `.github/copilot-instructions.md`.
- Preserve semantic HTML and heading hierarchy.
- Preserve reduced-motion requirements.
- Keep all focus states WCAG 2.2 AA compliant.
- Do not introduce unrelated refactors.

---

## Required Validation Workflow

Run after implementation, in this exact order:

1. `npm run check`
2. `npm run lint`
3. `npm run test`
4. `npm run build`

If a command fails:

- Continue running remaining commands.
- Classify failures by severity and map to the affected requirement above.

---

## Required Completion Report Format

Return results in this exact structure:

1. Executive summary

- What was fixed
- Remaining risks
- Overall recommendation

2. Requirement closure matrix

- For each section 1 through 9: Done / Partial / Not done
- Evidence paths and line references

3. Validation results

- `npm run check` result
- `npm run lint` result
- `npm run test` result
- `npm run build` result

4. Residual risk log

- Open risks that are not fully solvable in code
- Owner and follow-up action

5. Release decision

- Ready for production
- Ready with exceptions
- Not ready

---

## Exit Criteria

This PRD is complete only when:

1. P0 and all P1 requirements are fully closed
2. P2 items required for launch confidence are closed or explicitly excepted
3. Validation commands have been run and reported
4. Release decision is explicit and justified
