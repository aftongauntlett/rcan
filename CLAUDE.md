# Working rules

- Do not run Playwright, start the dev server, or run test suites proactively. Only do so when the user explicitly asks for it.
- If the user pastes a plain Formspree notification block that looks like an RCAN website change request, treat it as a request to add or update the static request history on `src/pages/admin.astro`. Parse fields such as `name`, `Change N - Page`, `Change N - Section`, `Change N - Description`, `priority`, and the submitted timestamp. Add the parsed request to the `CHANGE_REQUESTS` array near the top of the admin page, or update its `status`/`note` if the user asks for an existing request to be marked in progress, complete, blocked, etc. The `note` field is public to all admin users.
