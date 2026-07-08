# Handoff Doc

If you're reading this, you're probably taking over this website. Here's what you need to know, kept short on purpose. If you get stuck on anything technical, you can paste this whole file into an AI coding agent (like Claude Code or Cursor) along with your question — that works well for this project.

## What this is

The website for RCAN (Returning Citizens Assistance Network), a DC-area nonprofit. It's built with [Astro](https://astro.build), a framework for content-focused sites. No database, no user accounts (except one simple admin page — see below).

## Who owns what

This is the important part. A few pieces of this project are **not owned by RCAN** — they're hosted on the previous developer's personal accounts as a favor. If that developer becomes unreachable, these will eventually stop working and need to be replaced.

| Piece                                                                  | Who owns it                                         | What happens if not transferred                                                                                                                                      |
| ---------------------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GitHub repo** (the code)                                             | Previous developer, but transferable                | Can be transferred to a new GitHub account any time — just ask. No urgency.                                                                                          |
| **Vercel** (hosting — this is what actually serves the live site)      | Previous developer's personal account               | If access is lost, the live site goes down. You'll need to create your own Vercel account (free tier is fine) and redeploy from the GitHub repo.                     |
| **Formspree** (powers the Contact form and the Admin request-log form) | Previous developer's personal account               | If access is lost, form submissions stop working/arriving. You'll need your own Formspree account and to update the form endpoint URLs in the code (see below).      |
| **Domain name & DNS**                                                  | RCAN / Wix (managed by Theo or another RCAN member) | Not something you need to touch unless the site needs to move to different hosting — then DNS just needs to point at wherever the site is hosted (currently Vercel). |
| **Donorbox** (donation processing on the Donate page)                  | RCAN                                                | Maintained by RCAN directly, not the developer.                                                                                                                      |
| **Wix account**                                                        | RCAN                                                | Only used for domain/DNS management, not for the actual website.                                                                                                     |

**Bottom line:** if you're taking this over long-term, plan to set up your own Vercel and Formspree accounts fairly soon, so the site isn't dependent on someone else's personal login.

## How to move hosting to your own Vercel account

1. Create a free account at vercel.com.
2. Ask to be added as a collaborator to the GitHub repo (or have it transferred to you).
3. In Vercel, "Import Project" from the GitHub repo. Vercel auto-detects Astro — no config needed.
4. Once it's deploying successfully on your account, ask whoever manages DNS (Wix, via Theo/RCAN) to point the domain at your new Vercel deployment instead of the old one.
5. Old developer can then remove the project from their Vercel account.

## How to move forms to your own Formspree account

The site uses Formspree for two forms, hardcoded by URL:

- `src/components/ContactForm.astro` — the public Contact page form (`action="https://formspree.io/f/mdajaprb"`)
- `src/components/admin/AdminRequestForm.astro` — the admin "submit a change request" form (`action="https://formspree.io/f/mzdlkkrr"`)

To move these:

1. Create a free Formspree account.
2. Create two new forms there.
3. Replace the two URLs above with your new form endpoint URLs.
4. There's also a Cloudflare Turnstile (CAPTCHA) key involved on the contact form — see `docs/guide/formspree-turnstile-ops.md` for details on that setup.

## Codebase rundown

- **`src/pages/`** — one file per page (e.g. `about.astro`, `donate.astro`, `contact.astro`). This is the easiest place to start if you just need to change page content.
- **`src/components/`** — reusable pieces (buttons, cards, header, footer, etc.) used across pages.
- **`src/data/admin.ts`** — plain data file. Notably, `CHANGE_REQUESTS` near the top is a manually-maintained list of past site change requests, shown on the admin page as a history log.
- **`src/pages/admin.astro`** — a simple internal page (protected by a basic username/password in `.env.local`, not real user accounts) where RCAN members can view request history and submit new change requests.
- **`src/styles/global.css`** and **`tailwind.config.ts`** — colors, fonts, spacing. Change these to restyle the whole site at once.
- **`docs/`** — planning docs and guides from when the site was originally built. Mostly historical context, not required reading.

## Making changes (the easy way)

Most day-to-day requests — "change this text," "swap this photo," "update the phone number" — can be done by an AI coding agent with a plain-English prompt, e.g.:

> "On the Contact page, update the phone number to (202) 555-0100."

You don't need to know how to code to supervise that. Just:

1. Open the project folder in an AI coding tool (Claude Code, Cursor, etc.).
2. Describe the change in plain language.
3. Preview it (ask the agent to run `npm run dev` and check the result), then commit/push.

For anything structural (new pages, adding integrations, changing hosting), it's worth asking the agent to explain its plan before it makes changes.

## Local setup, if you ever need it directly

```bash
npm install       # install dependencies
npm run dev        # start local preview at localhost
npm run build       # build for production (Vercel does this automatically on push)
```

Requires Node.js 22.12.0 or newer.

## Contacts

- **RCAN / site content & Donorbox:** Theo (or current RCAN board contact)
- **Original developer / current Vercel & Formspree owner:** Afton Gauntlett
