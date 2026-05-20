# PRD: Final Pre-Production Audit

> **Note:** Ignore anything about the header/hero area — use the current implementation to stay consistent. Do not add or reinstate any dark (`bg-surface-invert`) CTA block at the bottom of pages; that pattern has been removed. If any remaining task references a dark closing box or `background="invert"` on CTABlock, skip it.

## Copy/Paste Agent Prompt (Step 8 of 8)

Recommended model: GPT-5.3-Codex

Use this prompt with your coding agent:

```text
Run only this audit PRD: docs/PRD-11-final-audit.md.

Review the copilot-instructions.md and content.md, rules.md in docs/guide

Scope:
- Entire repository (full audit, no partial pass)
- Read/analyze only unless explicitly asked to fix findings

Execution rules:
1) Follow docs/PRD-11-final-audit.md exactly, including required commands and output format.
2) Run baseline commands and continue auditing even if one fails.
3) Provide severity-tagged findings with file/line evidence where possible.
4) Provide a clear release decision (ready, ready with exceptions, or not ready).
5) Do not implement fixes in this run unless explicitly requested.

Output format:
- Executive summary
- Findings by severity
- Coverage map
- Test gap summary
- Release decision
- Other concerns
```

## Purpose

Run one comprehensive, repo-wide pre-production audit after all page PRDs are implemented and before deployment. This audit is a release gate.

This document is written as an execution prompt for an AI coding agent.

---

## Agent Mission

You are performing a comprehensive pre-production audit of this codebase.

Work through the entire repository systematically. Do not stop after one file, one category, or one successful command. Cover every category below and report all findings with evidence.

Default behavior for this audit:

- Read and analyze only.
- Do not modify files unless the user explicitly asks for fixes after the audit.

---

## Project Context

Stack to audit against:

- Astro (static site)
- TypeScript
- Tailwind CSS
- Formspree form handling
- Cloudflare Turnstile (contact form)

Architecture assumption:

- Static site, no custom backend runtime expected

---

## Severity Model

Use this severity model for all findings:

- P0: Release blocker (security exposure, broken critical path, severe accessibility or SEO break, build-breaking issue)
- P1: High priority (likely user-facing defect, significant maintainability/performance/accessibility risk)
- P2: Medium priority (quality issue worth fixing soon)
- P3: Low priority (polish, minor cleanup)

Each finding must include:

1. Severity
2. Category
3. Impact summary
4. Evidence: file path and line number where possible
5. Recommended fix (concise)

---

## Required Audit Workflow

### Step 1: Baseline checks (must run)

Run and capture results for:

1. npm run check
2. npm run lint
3. npm run test
4. npm run build

If any command fails, continue the rest of the audit and classify each failure by severity.

### Step 2: Static code and architecture review

Review source, components, layouts, utilities, config, and docs for the categories below.

### Step 3: Production-surface review

Review metadata, robots/sitemap, accessibility affordances, external integrations, and static-host security posture.

### Step 4: Final release decision

Conclude with one of:

- Ready for production
- Ready with exceptions (list)
- Not ready (list blockers)

---

## Audit Checklist

## 1) Code Quality

- Dead code: unused functions, variables, imports, exports, interfaces/types
- Duplicated logic that should be extracted/shared
- Files over about 200-300 lines that should be split
- Janky workarounds, hacks, TODO/FIXME/HACK comments
- Stack-specific bad practices for Astro + TypeScript + Tailwind
- Naming/style drift or conflicting patterns across pages/components

## 2) Architecture and Maintainability

- Component/module structure: logical and scalable?
- Circular dependencies, fragile import paths, or hidden coupling
- Environment variable handling: correct, consistent, and least-exposed
- Repeated hardcoded values that should be centralized constants/tokens

## 3) Performance

- Large bundle risks or unnecessary client-side JS
- Unoptimized images and media usage
- Missing width/height, improper lazy loading, or CLS risks
- Expensive patterns in shared components

## 4) SEO and Metadata

For every page:

- Unique, descriptive title
- Unique, descriptive meta description
- Open Graph tags present and correct (title, description, image, URL)
- Canonical URL strategy is correct
- Heading hierarchy is valid (H1 -> H2 -> H3, no skips)

Site-level:

- sitemap presence/coverage
- robots.txt configuration
- structured data (JSON-LD) where appropriate

## 5) Accessibility (WCAG 2.2 AA)

- Missing alt text, aria labels, or roles
- Keyboard access and focus visibility
- Form labeling and error messaging behavior
- Potential contrast issues (especially hardcoded or custom combinations)
- Landmark and heading semantics

## 6) Security

- Secrets or sensitive values committed in repo or exposed client-side
- External links with target blank missing rel noopener noreferrer
- CSP and security headers: present and appropriately scoped for static hosting
- Third-party scripts lacking integrity where relevant
- Formspree + Turnstile integration:
  - confirm widget is scoped to the intended form
  - assess likely bypass vectors through direct endpoint posting
  - flag residual risk and mitigation suggestions
- Confirm no unintended server-side attack surface exists

## 7) Testing

- What has no test coverage that should
- Critical user paths untested (navigation, form submission, dynamic UI behavior)
- Minimum viable test additions for production confidence

## 8) Production Readiness

- Proper 404 page exists and is wired
- Error/empty states handled gracefully
- Build warnings that should be fixed before deploy
- Risks that fail silently in production but appear fine locally

## 9) Other Concerns

After all categories, add a section titled Other concerns.
Include anything you would want to know before shipping that does not fit above.

---

## Required Output Format

Return results in this exact structure:

1. Executive summary

- 3-6 bullets: overall health, top risks, release recommendation

2. Findings by severity

- Group by P0, P1, P2, P3
- For each finding include:
  - ID (example: SEC-001)
  - Category
  - Evidence path with line reference when possible
  - Why it matters
  - Recommended fix

3. Coverage map

- One checklist showing each audit category as Covered or Not covered

4. Test gap summary

- Critical missing tests
- Minimum additions before launch

5. Release decision

- Ready for production / Ready with exceptions / Not ready
- If not ready, list exact blockers

6. Other concerns

If no findings exist in a category, explicitly state No material issues found.

---

## Exit Criteria

This audit is complete only when:

1. All checklist categories are addressed in the report
2. Baseline commands were run and summarized
3. Findings include evidence paths
4. A clear release decision is provided
