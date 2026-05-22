# Screen Reader Smoke Test Checklist

Use this checklist for a fast release-level accessibility pass when specialist auditors are not available.

## Scope

Run this checklist on:

- /
- /contact
- /donate
- one additional content page changed in the release

Target platforms:

- macOS + Safari + VoiceOver
- Windows + Firefox + NVDA
- one mobile pass with iOS VoiceOver or Android TalkBack

## 20-30 Minute Test Routine

1. Landmarks and page structure

- Open page and list landmarks.
- Confirm header, navigation, main, and footer are discoverable.
- Confirm one clear page-level heading.

2. Heading hierarchy

- Navigate by headings only.
- Confirm heading levels are sequential and meaningful.

3. Keyboard and focus

- Navigate page with Tab and Shift+Tab only.
- Confirm all interactive controls are reachable.
- Confirm focus state is always visible.

4. Navigation interactions

- Trigger skip link and verify navigation to main content.
- Open and close mobile navigation menu.
- Confirm focus returns to the menu trigger after close.

5. Contact flow

- Move through labeled fields and confirm labels are announced.
- Trigger validation errors intentionally and confirm announcements.
- Confirm dynamic congregation field appears only for the partnership topic.
- Confirm success or failure messaging is announced.

6. Zoom and reflow

- Validate layout and controls at 200 percent zoom.
- Validate usability at a narrow viewport equivalent to 320px width.

## Recording Template

Use this template for each run:

- Date:
- Tester:
- Platform and screen reader:
- Routes tested:
- Issues found:
- Severity:
- Reproduction steps:
- Owner:
- Target fix date:

## Important Notes

- Automated checks reduce risk but do not validate usability quality for assistive technology users.
- If this smoke test fails, hold release until blockers are fixed or formally excepted.
